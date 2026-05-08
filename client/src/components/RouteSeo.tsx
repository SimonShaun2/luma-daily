import { useLocation } from "wouter";
import SeoHead from "@/components/SeoHead";
import { getProductSeo, ROUTE_SEO, DEFAULT_SEO } from "@/lib/seo";
import { products } from "@/lib/products";

function normalizePath(path: string) {
  const withoutQuery = path.split("?")[0] || "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.replace(/\/$/, "");
}

export default function RouteSeo() {
  const [location] = useLocation();
  const path = normalizePath(location);
  const productSlug = path.match(/^\/products\/([^/]+)$/)?.[1];

  if (productSlug) {
    const product = products.find((item) => item.slug === productSlug);
    return product ? <SeoHead {...getProductSeo(product)} /> : <SeoHead noIndex title="Product Not Found" path={path} />;
  }

  const seo = ROUTE_SEO[path] ?? {
    ...DEFAULT_SEO,
    path,
    noIndex: path === "/404",
  };

  return <SeoHead {...seo} />;
}
