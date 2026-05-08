import { useCallback, useEffect, useState } from "react";
import {
  getAllProducts,
  getMonthlySellingPlan,
  getProductByHandle,
  isShopifyConfigured,
  type ShopifyProduct,
} from "@/lib/shopify";

let allProductsCache: ShopifyProduct[] | null = null;
let allProductsPromise: Promise<ShopifyProduct[]> | null = null;
const productCache = new Map<string, ShopifyProduct>();

function cacheProducts(products: ShopifyProduct[]) {
  allProductsCache = products;
  products.forEach((product) => productCache.set(product.handle, product));
}

export function useShopifyProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>(allProductsCache ?? []);
  const [isLoading, setIsLoading] = useState(() => isShopifyConfigured() && !allProductsCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isShopifyConfigured()) {
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(!allProductsCache);

    const promise =
      allProductsPromise ??
      getAllProducts().then((shopifyProducts) => {
        cacheProducts(shopifyProducts);
        return shopifyProducts;
      });

    allProductsPromise = promise;

    promise
      .then((shopifyProducts) => {
        if (!active) return;
        setProducts(shopifyProducts);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load Shopify products.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const getProduct = useCallback(
    (handle: string) => productCache.get(handle) ?? products.find((product) => product.handle === handle) ?? null,
    [products],
  );

  const getVariantId = useCallback(
    async (handle: string) => {
      const cached = getProduct(handle);
      if (cached) {
        return cached.variants.edges[0]?.node.id ?? "";
      }

      if (!isShopifyConfigured()) {
        return "";
      }

      const product = await getProductByHandle(handle);
      if (!product) {
        return "";
      }

      productCache.set(product.handle, product);
      return product.variants.edges[0]?.node.id ?? "";
    },
    [getProduct],
  );

  const getSellingPlanId = useCallback(
    (handle: string) => {
      const product = getProduct(handle);
      return product ? getMonthlySellingPlan(product)?.id ?? "" : "";
    },
    [getProduct],
  );

  return {
    products,
    isLoading,
    error,
    getProduct,
    getVariantId,
    getSellingPlanId,
    isConfigured: isShopifyConfigured(),
  };
}
