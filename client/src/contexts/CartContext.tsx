/**
 * CartContext — Shopify Storefront cart state for Luma Daily
 * Design: Warm Editorial — cream/charcoal/amber palette
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
  type CartLineInput,
  type ShopifyCart,
  type ShopifyCartLine,
} from "@/lib/shopify";

const CART_ID_KEY = "luma_daily_cart_id";

export interface CartItem {
  id: string;
  lineId: string;
  variantId: string;
  handle: string;
  name: string;
  flavor: string;
  price: number;
  originalPrice: number;
  image: string;
  color: string;
  quantity: number;
  isSubscription: boolean;
  sellingPlanId?: string;
}

export type AddItemInput = Omit<CartItem, "id" | "lineId" | "quantity">;

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  checkoutUrl: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: AddItemInput) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  checkout: () => void;
  totalItems: number;
  subtotal: number;
  savings: number;
}

const CartContext = createContext<CartContextType | null>(null);

function moneyToNumber(amount: string | undefined) {
  return Number(amount ?? 0);
}

function getMetafield(line: ShopifyCartLine, key: string) {
  return line.merchandise.product.metafields.find((field) => field?.key === key)?.value;
}

function shopifyLineToCartItem(line: ShopifyCartLine): CartItem {
  const product = line.merchandise.product;
  const productName = product.title.replace(/^Luma\s+/i, "");
  const image =
    line.merchandise.image?.url ??
    product.images.edges[0]?.node.url ??
    "";
  const flavorMetafield = getMetafield(line, "flavor");
  const color = getMetafield(line, "product_color") ?? "#C8813A";
  const titleFlavor = line.merchandise.title === "Default Title" ? productName : line.merchandise.title;
  const price = moneyToNumber(line.cost.amountPerQuantity.amount);
  const originalPrice =
    moneyToNumber(line.cost.compareAtAmountPerQuantity?.amount) ||
    moneyToNumber(line.merchandise.compareAtPrice?.amount) ||
    price;

  return {
    id: line.id,
    lineId: line.id,
    variantId: line.merchandise.id,
    handle: product.handle,
    name: productName,
    flavor: flavorMetafield ?? titleFlavor,
    price,
    originalPrice,
    image,
    color,
    quantity: line.quantity,
    isSubscription: Boolean(line.sellingPlanAllocation),
    sellingPlanId: line.sellingPlanAllocation?.sellingPlan.id,
  };
}

function cartToItems(cart: ShopifyCart) {
  return cart.lines.edges.map((edge) => shopifyLineToCartItem(edge.node));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const applyCart = useCallback((cart: ShopifyCart) => {
    setCartId(cart.id);
    setCheckoutUrl(cart.checkoutUrl);
    setItems(cartToItems(cart));
    localStorage.setItem(CART_ID_KEY, cart.id);
  }, []);

  useEffect(() => {
    const existingCartId = localStorage.getItem(CART_ID_KEY);
    if (!existingCartId) return;

    let active = true;
    setIsLoading(true);

    getCart(existingCartId)
      .then((cart) => {
        if (!active) return;
        if (cart) {
          applyCart(cart);
        } else {
          localStorage.removeItem(CART_ID_KEY);
        }
      })
      .catch(() => {
        if (active) localStorage.removeItem(CART_ID_KEY);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [applyCart]);

  const addItem = useCallback(
    async (input: AddItemInput) => {
      if (!input.variantId) {
        toast.error("This product is not connected to Shopify yet.");
        return;
      }

      const line: CartLineInput = {
        merchandiseId: input.variantId,
        quantity: 1,
        ...(input.sellingPlanId ? { sellingPlanId: input.sellingPlanId } : {}),
      };

      setIsLoading(true);

      try {
        const cart = cartId ? await addCartLines(cartId, [line]) : await createCart([line]);
        applyCart(cart);
        setIsOpen(true);
      } catch {
        try {
          localStorage.removeItem(CART_ID_KEY);
          const freshCart = await createCart([line]);
          applyCart(freshCart);
          setIsOpen(true);
        } catch {
          toast.error("Unable to connect to store. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [applyCart, cartId],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cartId) return;

      setIsLoading(true);
      try {
        const cart = await removeCartLines(cartId, [lineId]);
        applyCart(cart);
      } catch {
        toast.error("Unable to remove this item. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [applyCart, cartId],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cartId) return;

      if (quantity <= 0) {
        await removeItem(lineId);
        return;
      }

      setIsLoading(true);
      try {
        const cart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
        applyCart(cart);
      } catch {
        toast.error("Unable to update quantity. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [applyCart, cartId, removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setCartId(null);
    setCheckoutUrl(null);
    localStorage.removeItem(CART_ID_KEY);
  }, []);

  const checkout = useCallback(() => {
    setIsOpen(false);
    window.location.href = checkoutUrl ?? "/checkout";
  }, [checkoutUrl]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = items.reduce(
    (sum, item) => sum + Math.max(item.originalPrice - item.price, 0) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isLoading,
        checkoutUrl,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
        totalItems,
        subtotal,
        savings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
