# LUMA DAILY — CLAUDE CODE ENGINEERING PROMPT
## Complete Shopify Headless Storefront Integration

---

## CONTEXT & MISSION

You are working on an existing React 19 + Tailwind 4 + TypeScript project called **Luma Daily** — a premium wellness gummy DTC brand. The project is already scaffolded and has a working frontend with static mock data. Your job is to:

1. **Connect the site to Shopify's Storefront API** so all products, cart, and checkout are live
2. **Upgrade the CartContext** to use Shopify's cart API (persisted via localStorage)
3. **Wire the checkout button** to redirect to Shopify's native hosted checkout
4. **Add the subscription upsell modal** (matching Lemme's "Save 20% when you switch" pattern)
5. **Add the GWP progress bar** to the cart drawer (free gift at $75 and $120)
6. **Add Klaviyo email capture** to the quiz results and footer
7. **Add Recharge selling plan support** to the PDP subscribe toggle
8. **Add the Okendo reviews widget** to the PDP

Do NOT rewrite the entire project. Surgically modify the existing files listed below. Preserve all existing design, animations, and UI patterns exactly.

---

## PROJECT STRUCTURE

```
/home/ubuntu/luma-daily/
├── client/
│   ├── index.html                          ← Add font links + Klaviyo/Okendo scripts here
│   └── src/
│       ├── App.tsx                         ← Routes (already complete, do not change)
│       ├── index.css                       ← Design tokens (do not change)
│       ├── main.tsx                        ← Entry point (do not change)
│       ├── lib/
│       │   ├── products.ts                 ← Static product data (keep as fallback)
│       │   ├── shopify.ts                  ← CREATE THIS — Storefront API service layer
│       │   └── utils.ts                    ← Existing utilities (do not change)
│       ├── contexts/
│       │   └── CartContext.tsx             ← REPLACE with Shopify cart API version
│       ├── components/
│       │   ├── CartDrawer.tsx              ← MODIFY — add GWP bar + subscribe upsell modal
│       │   ├── SubscriptionUpsellModal.tsx ← CREATE THIS — the "Save 20%" modal
│       │   └── GiftProgressBar.tsx         ← CREATE THIS — free gift progress bar
│       └── pages/
│           ├── Home.tsx                    ← MODIFY — add Klaviyo email capture to footer
│           ├── ProductDetail.tsx           ← MODIFY — add Recharge selling plans + Okendo
│           ├── Quiz.tsx                    ← MODIFY — add Klaviyo identify on email capture
│           ├── Shop.tsx                    ← MODIFY — use Shopify product data
│           └── Account.tsx                 ← Keep as-is (subscription managed by Recharge portal)
├── .env                                    ← CREATE THIS with env vars
└── package.json                            ← Already has all needed deps
```

---

## STEP 1 — ENVIRONMENT VARIABLES

Create `/home/ubuntu/luma-daily/.env`:

```bash
VITE_SHOPIFY_STORE_DOMAIN=luma-daily.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=YOUR_32_CHAR_STOREFRONT_TOKEN_HERE
VITE_KLAVIYO_PUBLIC_KEY=YOUR_KLAVIYO_PUBLIC_KEY
VITE_OKENDO_SUBSCRIBER_ID=YOUR_OKENDO_SUBSCRIBER_ID
VITE_RECHARGE_PUBLIC_KEY=YOUR_RECHARGE_PUBLIC_KEY
```

---

## STEP 2 — CREATE `client/src/lib/shopify.ts`

This is the complete Shopify Storefront API service layer. Create this file exactly:

```typescript
/**
 * shopify.ts — Storefront API service layer for Luma Daily
 * Store: luma-daily.myshopify.com
 * API version: 2024-10
 */

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string;
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;

// ─── Core Fetch ───────────────────────────────────────────────────────────────

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error("Shopify GraphQL errors:", json.errors);
    throw new Error(json.errors[0]?.message ?? "Unknown Shopify error");
  }

  return json.data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  availableForSale: boolean;
  quantityAvailable: number;
  selectedOptions: { name: string; value: string }[];
}

export interface ShopifySellingPlan {
  id: string;
  name: string;
  recurringDeliveries: boolean;
  priceAdjustments: {
    adjustmentValue: {
      adjustmentPercentage?: number;
      adjustmentAmount?: ShopifyMoney;
    };
  }[];
}

export interface ShopifySellingPlanGroup {
  name: string;
  sellingPlans: { edges: { node: ShopifySellingPlan }[] };
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  priceRange: { minVariantPrice: ShopifyMoney };
  variants: { edges: { node: ShopifyVariant }[] };
  images: { edges: { node: ShopifyImage }[] };
  sellingPlanGroups: { edges: { node: ShopifySellingPlanGroup }[] };
  metafields: ({ key: string; value: string } | null)[];
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: ShopifyMoney;
    compareAtPrice: ShopifyMoney | null;
    product: {
      id: string;
      title: string;
      handle: string;
      images: { edges: { node: ShopifyImage }[] };
    };
  };
  sellingPlanAllocation: {
    sellingPlan: { id: string; name: string };
    priceAdjustments: { price: ShopifyMoney; compareAtPrice: ShopifyMoney }[];
  } | null;
  cost: {
    totalAmount: ShopifyMoney;
    compareAtAmountPerQuantity: ShopifyMoney | null;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: { edges: { node: ShopifyCartLine }[] };
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  totalQuantity: number;
}

// ─── Product Queries ──────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id handle title descriptionHtml
    priceRange { minVariantPrice { amount currencyCode } }
    variants(first: 10) {
      edges {
        node {
          id title availableForSale quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
        }
      }
    }
    images(first: 5) { edges { node { url altText } } }
    sellingPlanGroups(first: 5) {
      edges {
        node {
          name
          sellingPlans(first: 10) {
            edges {
              node {
                id name recurringDeliveries
                priceAdjustments {
                  adjustmentValue {
                    ... on SellingPlanPercentagePriceAdjustment { adjustmentPercentage }
                    ... on SellingPlanFixedAmountPriceAdjustment { adjustmentAmount { amount currencyCode } }
                  }
                }
              }
            }
          }
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "tagline" }
      { namespace: "custom", key: "flavor" }
      { namespace: "custom", key: "subscribe_price" }
      { namespace: "custom", key: "bg_color" }
      { namespace: "custom", key: "text_color" }
    ]) { key value }
  }
`;

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetAllProducts {
      products(first: 20, sortKey: TITLE) {
        edges { node { ...ProductFragment } }
      }
    }
  `;
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(query);
  return data.products.edges.map((e) => e.node);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) { ...ProductFragment }
    }
  `;
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, { handle });
  return data.product;
}

// ─── Cart Mutations ───────────────────────────────────────────────────────────

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id checkoutUrl totalQuantity
    lines(first: 50) {
      edges {
        node {
          id quantity
          merchandise {
            ... on ProductVariant {
              id title
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              product {
                id title handle
                images(first: 1) { edges { node { url altText } } }
              }
            }
          }
          sellingPlanAllocation {
            sellingPlan { id name }
            priceAdjustments { price { amount currencyCode } compareAtPrice { amount currencyCode } }
          }
          cost {
            totalAmount { amount currencyCode }
            compareAtAmountPerQuantity { amount currencyCode }
          }
        }
      }
    }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
  }
`;

export async function createCart(lines: { merchandiseId: string; quantity: number; sellingPlanId?: string }[]): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart; userErrors: { field: string; message: string }[] } }>(
    query,
    { lines }
  );
  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }
  return data.cartCreate.cart;
}

export async function addCartLines(cartId: string, lines: { merchandiseId: string; quantity: number; sellingPlanId?: string }[]): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart; userErrors: { field: string; message: string }[] } }>(
    query,
    { cartId, lines }
  );
  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart; userErrors: { field: string; message: string }[] } }>(
    query,
    { cartId, lines }
  );
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart; userErrors: { field: string; message: string }[] } }>(
    query,
    { cartId, lineIds }
  );
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFragment }
    }
  `;
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(query, { cartId });
  return data.cart;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map Shopify product handle to local product slug for routing */
export function shopifyHandleToSlug(handle: string): string {
  return handle.replace("luma-", "");
}

/** Get metafield value by key from a product's metafields array */
export function getMetafield(product: ShopifyProduct, key: string): string | null {
  const mf = product.metafields.find((m) => m?.key === key);
  return mf?.value ?? null;
}

/** Format Shopify money object to display string */
export function formatMoney(money: ShopifyMoney): string {
  return `$${parseFloat(money.amount).toFixed(2)}`;
}

/** Get the first selling plan (monthly subscription) from a product */
export function getMonthlySellingPlan(product: ShopifyProduct): ShopifySellingPlan | null {
  const groups = product.sellingPlanGroups.edges;
  if (groups.length === 0) return null;
  const plans = groups[0].node.sellingPlans.edges;
  if (plans.length === 0) return null;
  return plans[0].node;
}

/** Calculate subscribe price from selling plan percentage adjustment */
export function getSubscribePrice(basePrice: number, sellingPlan: ShopifySellingPlan | null): number {
  if (!sellingPlan) return basePrice;
  const adj = sellingPlan.priceAdjustments[0]?.adjustmentValue;
  if (adj?.adjustmentPercentage) {
    return basePrice * (1 - adj.adjustmentPercentage / 100);
  }
  return basePrice;
}
```

---

## STEP 3 — REPLACE `client/src/contexts/CartContext.tsx`

Replace the entire file with this Shopify-backed version. This is a complete drop-in replacement — all existing components that use `useCart()` will continue to work because the public API is identical, but now backed by Shopify:

```typescript
/**
 * CartContext — Shopify Storefront API cart for Luma Daily
 * Persists cartId in localStorage. Syncs with Shopify on mount.
 * Public API is identical to the previous mock version.
 */
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  getCart,
  type ShopifyCart,
  type ShopifyCartLine,
} from "@/lib/shopify";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  /** Shopify cart line ID (gid://shopify/CartLine/...) */
  lineId: string;
  /** Shopify variant ID (gid://shopify/ProductVariant/...) */
  variantId: string;
  /** Shopify product handle (e.g. "luma-energy") */
  handle: string;
  name: string;
  flavor: string;
  price: number;
  originalPrice: number;
  image: string;
  color: string;
  quantity: number;
  isSubscription: boolean;
  /** Recharge selling plan ID if subscription */
  sellingPlanId?: string;
}

interface AddItemInput {
  variantId: string;
  handle: string;
  name: string;
  flavor: string;
  price: number;
  originalPrice: number;
  image: string;
  color: string;
  isSubscription: boolean;
  sellingPlanId?: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: AddItemInput) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  checkout: () => void;
  totalItems: number;
  subtotal: number;
  savings: number;
  checkoutUrl: string | null;
}

const CartContext = createContext<CartContextType | null>(null);
const CART_ID_KEY = "luma_daily_cart_id";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shopifyLineToCartItem(line: ShopifyCartLine): CartItem {
  const price = parseFloat(line.sellingPlanAllocation
    ? line.sellingPlanAllocation.priceAdjustments[0]?.price.amount ?? line.merchandise.price.amount
    : line.merchandise.price.amount);
  const originalPrice = parseFloat(line.merchandise.compareAtPrice?.amount ?? line.merchandise.price.amount);
  const image = line.merchandise.product.images.edges[0]?.node.url ?? "";
  const handle = line.merchandise.product.handle;

  return {
    lineId: line.id,
    variantId: line.merchandise.id,
    handle,
    name: line.merchandise.product.title.replace("Luma ", ""),
    flavor: line.merchandise.title !== "Default Title" ? line.merchandise.title : "",
    price,
    originalPrice,
    image,
    color: "#C8813A", // fallback; real color comes from local products.ts lookup
    quantity: line.quantity,
    isSubscription: !!line.sellingPlanAllocation,
    sellingPlanId: line.sellingPlanAllocation?.sellingPlan.id,
  };
}

function cartToState(cart: ShopifyCart): { items: CartItem[]; checkoutUrl: string } {
  return {
    items: cart.lines.edges.map((e) => shopifyLineToCartItem(e.node)),
    checkoutUrl: cart.checkoutUrl,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(() => localStorage.getItem(CART_ID_KEY));
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initRef = useRef(false);

  // Rehydrate cart from Shopify on mount
  useEffect(() => {
    if (initRef.current || !cartId) return;
    initRef.current = true;
    getCart(cartId).then((cart) => {
      if (cart) {
        const state = cartToState(cart);
        setItems(state.items);
        setCheckoutUrl(state.checkoutUrl);
      } else {
        // Cart expired — clear it
        localStorage.removeItem(CART_ID_KEY);
        setCartId(null);
      }
    }).catch(() => {
      localStorage.removeItem(CART_ID_KEY);
      setCartId(null);
    });
  }, [cartId]);

  const syncCart = useCallback((cart: ShopifyCart) => {
    const state = cartToState(cart);
    setItems(state.items);
    setCheckoutUrl(state.checkoutUrl);
    if (cart.id !== cartId) {
      setCartId(cart.id);
      localStorage.setItem(CART_ID_KEY, cart.id);
    }
  }, [cartId]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(async (input: AddItemInput) => {
    setIsLoading(true);
    try {
      const line = {
        merchandiseId: input.variantId,
        quantity: 1,
        ...(input.sellingPlanId ? { sellingPlanId: input.sellingPlanId } : {}),
      };

      let cart: ShopifyCart;
      if (cartId) {
        cart = await addCartLines(cartId, [line]);
      } else {
        cart = await createCart([line]);
      }
      syncCart(cart);
      setIsOpen(true);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      // Fallback: create new cart if existing one is stale
      try {
        const line = {
          merchandiseId: input.variantId,
          quantity: 1,
          ...(input.sellingPlanId ? { sellingPlanId: input.sellingPlanId } : {}),
        };
        const cart = await createCart([line]);
        syncCart(cart);
        setIsOpen(true);
      } catch (fallbackErr) {
        console.error("Cart creation also failed:", fallbackErr);
      }
    } finally {
      setIsLoading(false);
    }
  }, [cartId, syncCart]);

  const removeItem = useCallback(async (lineId: string) => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const cart = await removeCartLines(cartId, [lineId]);
      syncCart(cart);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cartId, syncCart]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cartId) return;
    if (quantity <= 0) {
      await removeItem(lineId);
      return;
    }
    setIsLoading(true);
    try {
      const cart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
      syncCart(cart);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cartId, syncCart, removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCheckoutUrl(null);
    setCartId(null);
    localStorage.removeItem(CART_ID_KEY);
  }, []);

  const checkout = useCallback(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const savings = items.reduce((sum, i) => sum + Math.max(0, i.originalPrice - i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, isLoading, openCart, closeCart,
      addItem, removeItem, updateQuantity, clearCart, checkout,
      totalItems, subtotal, savings, checkoutUrl,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
```

**IMPORTANT — After replacing CartContext.tsx, update all call sites:**

The old `addItem` took `Omit<CartItem, "quantity">` with an `id: number`. The new `addItem` takes `AddItemInput` with a `variantId: string`. You must update every call to `addItem` across these files:

- `client/src/pages/Home.tsx` — product card "Add to Ritual" button and bundle "Add to Cart" button
- `client/src/pages/ProductDetail.tsx` — `handleAddToCart` function
- `client/src/pages/Shop.tsx` — product card add button
- `client/src/components/CartDrawer.tsx` — upsell row add button

For each call site, you need to look up the Shopify `variantId` from the product's Shopify data. Until Shopify products are loaded, fall back to the static `products.ts` data and show a toast: "Connecting to store...". The pattern is:

```typescript
// In any component that calls addItem:
import { useShopifyProducts } from "@/hooks/useShopifyProducts"; // CREATE THIS HOOK

const { getVariantId } = useShopifyProducts();

const handleAddToCart = async (productSlug: string, isSubscription: boolean) => {
  const variantId = await getVariantId(`luma-${productSlug}`);
  const localProduct = products.find(p => p.slug === productSlug);
  if (!localProduct) return;
  
  await addItem({
    variantId,
    handle: `luma-${productSlug}`,
    name: localProduct.name,
    flavor: localProduct.flavor,
    price: isSubscription ? localProduct.subscribePrice : localProduct.price,
    originalPrice: localProduct.originalPrice,
    image: localProduct.image,
    color: localProduct.color,
    isSubscription,
    // sellingPlanId is added by ProductDetail when subscription is selected
  });
};
```

---

## STEP 4 — CREATE `client/src/hooks/useShopifyProducts.ts`

```typescript
/**
 * useShopifyProducts — Fetches and caches Shopify product data
 * Falls back to static products.ts data if Shopify is unavailable
 */
import { useState, useEffect, useRef } from "react";
import { getAllProducts, getProductByHandle, type ShopifyProduct } from "@/lib/shopify";

const cache = new Map<string, ShopifyProduct>();
let allProductsCache: ShopifyProduct[] | null = null;

export function useShopifyProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>(allProductsCache ?? []);
  const [isLoading, setIsLoading] = useState(!allProductsCache);
  const fetchedRef = useRef(!!allProductsCache);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getAllProducts().then((prods) => {
      allProductsCache = prods;
      prods.forEach((p) => cache.set(p.handle, p));
      setProducts(prods);
      setIsLoading(false);
    }).catch((err) => {
      console.warn("Shopify products unavailable, using static data:", err);
      setIsLoading(false);
    });
  }, []);

  const getProduct = (handle: string): ShopifyProduct | undefined => cache.get(handle);

  const getVariantId = async (handle: string): Promise<string> => {
    // Check cache first
    const cached = cache.get(handle);
    if (cached) {
      return cached.variants.edges[0]?.node.id ?? "";
    }
    // Fetch individual product
    const product = await getProductByHandle(handle);
    if (product) {
      cache.set(handle, product);
      return product.variants.edges[0]?.node.id ?? "";
    }
    throw new Error(`Product not found: ${handle}`);
  };

  const getSellingPlanId = (handle: string): string | undefined => {
    const product = cache.get(handle);
    if (!product) return undefined;
    const groups = product.sellingPlanGroups.edges;
    if (groups.length === 0) return undefined;
    return groups[0].node.sellingPlans.edges[0]?.node.id;
  };

  return { products, isLoading, getProduct, getVariantId, getSellingPlanId };
}
```

---

## STEP 5 — CREATE `client/src/components/GiftProgressBar.tsx`

```typescript
/**
 * GiftProgressBar — Free gift with purchase progress bar
 * Matches Lemme's cart drawer GWP pattern exactly
 * Tier 1: $75 → Free Luma Gut Sample
 * Tier 2: $120 → Free Luma Energy Sample
 */
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

const GWP_TIERS = [
  { threshold: 75, reward: "1 Free Luma Gut Sample", emoji: "🌿" },
  { threshold: 120, reward: "1 Free Luma Energy Sample", emoji: "⚡" },
] as const;

interface GiftProgressBarProps {
  subtotal: number;
}

export default function GiftProgressBar({ subtotal }: GiftProgressBarProps) {
  // Find the next tier the user hasn't unlocked yet
  const nextTier = GWP_TIERS.find((t) => subtotal < t.threshold);
  const allUnlocked = !nextTier;

  // Calculate progress within the current tier range
  const currentTierIndex = nextTier ? GWP_TIERS.indexOf(nextTier) : GWP_TIERS.length;
  const prevThreshold = currentTierIndex > 0 ? GWP_TIERS[currentTierIndex - 1].threshold : 0;
  const nextThreshold = nextTier?.threshold ?? GWP_TIERS[GWP_TIERS.length - 1].threshold;
  const progress = allUnlocked
    ? 100
    : Math.min(100, ((subtotal - prevThreshold) / (nextThreshold - prevThreshold)) * 100);

  return (
    <div className="px-5 py-3 bg-[#F5E6D3] border-b border-[#C8813A]/15">
      <div className="flex items-center gap-2 mb-2">
        <Gift size={13} className="text-[#C8813A] flex-shrink-0" />
        <p className="font-body text-xs font-600 text-[#C8813A]">
          {allUnlocked
            ? "🎉 You've unlocked all free gifts!"
            : `Add $${(nextTier!.threshold - subtotal).toFixed(2)} to unlock ${nextTier!.emoji} ${nextTier!.reward}`}
        </p>
      </div>
      <div className="h-1.5 bg-[#C8813A]/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#C8813A] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {/* Tier markers */}
      <div className="flex justify-between mt-1.5">
        {GWP_TIERS.map((tier) => (
          <div key={tier.threshold} className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full border-2 transition-colors ${
                subtotal >= tier.threshold
                  ? "bg-[#C8813A] border-[#C8813A]"
                  : "bg-white border-[#C8813A]/30"
              }`}
            />
            <span className="font-body text-[10px] text-[#C8813A]/60 mt-0.5">${tier.threshold}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## STEP 6 — CREATE `client/src/components/SubscriptionUpsellModal.tsx`

This is the "Save 20% when you switch to subscription" modal that appears when one-time items are in the cart. Matches Lemme's exact pattern:

```typescript
/**
 * SubscriptionUpsellModal — "Save up to 20% when you switch to subscription"
 * Triggered when cart contains one-time purchase items
 * Matches Lemme's 4-step subscription explanation modal exactly
 */
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SubscriptionUpsellModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const STEPS = [
  {
    number: 1,
    title: "Choose one or more products to meet your wellness goals",
    bg: "#FEF3C7",
    emoji: "🛍️",
  },
  {
    number: 2,
    title: "Set your preferred delivery schedule based on your needs",
    bg: "#DBEAFE",
    emoji: "📅",
  },
  {
    number: 3,
    title: "Earn points and unlock VIP discounts & free products",
    bg: "#D1FAE5",
    emoji: "⭐",
  },
  {
    number: 4,
    title: "Achieve & maintain your wellness goals effortlessly",
    bg: "#EDE9FE",
    emoji: "🏆",
  },
];

export default function SubscriptionUpsellModal({ open, onClose, onAccept }: SubscriptionUpsellModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(30,27,22,0.6)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-[#1E1B16]/30 hover:text-[#1E1B16] transition-colors"
            >
              <X size={20} />
            </button>

            {/* Headline */}
            <div className="text-center mb-6">
              <h2 className="font-display font-700 text-3xl text-[#1E1B16] leading-tight mb-2">
                Save up to 20% when you<br />switch to subscription.
              </h2>
              <p className="font-body text-sm text-[#1E1B16]/50 italic">how it works</p>
            </div>

            {/* 4-step grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl p-4 flex flex-col items-center text-center gap-3"
                  style={{ backgroundColor: step.bg }}
                >
                  <div className="text-3xl">{step.emoji}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#C8813A] text-white text-[10px] font-body font-700 flex items-center justify-center flex-shrink-0">
                      {step.number}
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#1E1B16]/70 leading-relaxed">{step.title}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <button
              onClick={onAccept}
              className="btn-amber w-full justify-center text-sm py-4 mb-3"
            >
              SWITCH TO SUBSCRIPTION & SAVE 20%
            </button>
            <button
              onClick={onClose}
              className="w-full text-center font-body text-sm text-[#1E1B16]/40 hover:text-[#1E1B16] transition-colors underline underline-offset-2"
            >
              No thanks, continue with one-time purchase
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## STEP 7 — MODIFY `client/src/components/CartDrawer.tsx`

Make these surgical changes to the existing CartDrawer.tsx:

**7a. Add imports at the top:**
```typescript
import GiftProgressBar from "./GiftProgressBar";
import SubscriptionUpsellModal from "./SubscriptionUpsellModal";
```

**7b. Add state inside the CartDrawer component:**
```typescript
const [showSubscribeModal, setShowSubscribeModal] = useState(false);
const hasOneTimeItems = items.some((item) => !item.isSubscription);
```

**7c. Replace the `handleCheckout` function:**
```typescript
const handleCheckout = () => {
  if (hasOneTimeItems && items.length > 0) {
    setShowSubscribeModal(true);
  } else {
    checkout(); // This calls window.location.href = checkoutUrl
  }
};
```

**7d. Add the GiftProgressBar immediately after the drawer header (before the items list):**
```tsx
{/* Gift progress bar — add this right after the header div */}
<GiftProgressBar subtotal={subtotal} />
```

**7e. Add the SubscriptionUpsellModal at the bottom of the returned JSX (inside AnimatePresence, after the drawer motion.div):**
```tsx
<SubscriptionUpsellModal
  open={showSubscribeModal}
  onClose={() => setShowSubscribeModal(false)}
  onAccept={() => {
    setShowSubscribeModal(false);
    checkout(); // Proceed to checkout regardless
  }}
/>
```

**7f. Update the checkout button to use the new `handleCheckout`:**
The existing "Proceed to Checkout" button's `onClick` should call `handleCheckout` instead of directly calling `checkout()`.

**7g. Update `removeItem` call sites** — the old `removeItem(id: number)` is now `removeItem(lineId: string)`. Change all `removeItem(item.id)` calls to `removeItem(item.lineId)`.

**7h. Update `updateQuantity` call sites** — change `updateQuantity(item.id, ...)` to `updateQuantity(item.lineId, ...)`.

---

## STEP 8 — MODIFY `client/src/pages/ProductDetail.tsx`

**8a. Add Recharge selling plan support to the subscribe toggle:**

Add this hook call near the top of the `ProductDetail` component:
```typescript
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { getMonthlySellingPlan, getSubscribePrice } from "@/lib/shopify";

// Inside the component:
const { getProduct } = useShopifyProducts();
const shopifyProduct = getProduct(`luma-${product.slug}`);
const sellingPlan = shopifyProduct ? getMonthlySellingPlan(shopifyProduct) : null;
const shopifyVariantId = shopifyProduct?.variants.edges[0]?.node.id ?? "";
```

**8b. Update `handleAddToCart` to use Shopify:**
```typescript
const handleAddToCart = async () => {
  if (!shopifyVariantId) {
    toast.error("Product unavailable — please try again");
    return;
  }
  
  for (let i = 0; i < quantity; i++) {
    await addItem({
      variantId: shopifyVariantId,
      handle: `luma-${product.slug}`,
      name: product.name,
      flavor: product.flavor,
      price: isSubscription ? product.subscribePrice : product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      color: product.color,
      isSubscription,
      ...(isSubscription && sellingPlan ? { sellingPlanId: sellingPlan.id } : {}),
    });
  }
  toast.success(`Luma ${product.name} added to your ritual`);
};
```

**8c. Add Okendo reviews widget** — add this section after the "Related Products" section:
```tsx
{/* Okendo Reviews Widget */}
{shopifyProduct && (
  <section className="py-16 bg-white">
    <div className="container max-w-4xl">
      <h2 className="font-display font-700 text-3xl text-[#1E1B16] mb-8 text-center">
        What our community says
      </h2>
      <div
        data-oke-reviews-product-listing-rating
        data-oke-reviews-product-id={shopifyProduct.id}
      />
      <div
        data-oke-widget="reviews"
        data-oke-reviews-product-id={shopifyProduct.id}
        className="mt-6"
      />
    </div>
  </section>
)}
```

---

## STEP 9 — MODIFY `client/src/pages/Quiz.tsx`

Find the email capture step (where the user enters their email before seeing results). Update the `handleEmailSubmit` function to also identify the user in Klaviyo:

```typescript
const handleEmailSubmit = (email: string) => {
  // Existing logic...
  setEmail(email);
  setStep("results");
  
  // Klaviyo identify
  try {
    if (typeof window !== "undefined" && (window as any)._learnq) {
      (window as any)._learnq.push(["identify", { "$email": email }]);
      (window as any)._learnq.push(["track", "Quiz Completed", {
        email,
        primaryGoal: answers.goal,
        lifestyle: answers.lifestyle,
        challenge: answers.challenge,
        commitment: answers.commitment,
      }]);
    }
  } catch (e) {
    // Klaviyo not loaded — ignore
  }
};
```

---

## STEP 10 — MODIFY `client/src/pages/Home.tsx`

Find the footer email capture section (the input where users enter their email for the newsletter). Update the submit handler:

```typescript
const handleNewsletterSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const email = (e.currentTarget as HTMLFormElement).querySelector("input")?.value;
  if (!email) return;
  
  // Klaviyo subscribe
  try {
    if (typeof window !== "undefined" && (window as any)._learnq) {
      (window as any)._learnq.push(["identify", { "$email": email }]);
      (window as any)._learnq.push(["track", "Newsletter Signup", { email, source: "footer" }]);
    }
  } catch (e) {
    // Klaviyo not loaded
  }
  
  toast.success("You're in! Check your inbox for 15% off.");
  (e.currentTarget as HTMLFormElement).reset();
};
```

---

## STEP 11 — MODIFY `client/index.html`

Add Klaviyo and Okendo script tags to the `<head>`. Replace `YOUR_KLAVIYO_PUBLIC_KEY` and `YOUR_OKENDO_SUBSCRIBER_ID` with the actual env var values (or use Vite's `%VITE_*%` substitution):

```html
<!-- Klaviyo -->
<script>
  !function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=[i],o=arguments.length,r=new Array(o),e=0;e<o;e++)r[e]=arguments[e];return n=n.concat(r),window._klOnsite.push(n)}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();
</script>
<script async type="text/javascript" src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=%VITE_KLAVIYO_PUBLIC_KEY%"></script>

<!-- Okendo Reviews -->
<script async src="https://d3hw6dc1ow8pp2.cloudfront.net/reviewsWidget.min.js?SubscriberId=%VITE_OKENDO_SUBSCRIBER_ID%"></script>
```

---

## STEP 12 — MODIFY `client/src/pages/Shop.tsx`

The Shop page currently uses static `products` from `lib/products.ts`. Add a Shopify data layer that enriches the static data with live Shopify availability:

```typescript
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

// Inside Shop component:
const { products: shopifyProducts, isLoading: shopifyLoading } = useShopifyProducts();

// Merge Shopify availability into local product data:
const enrichedProducts = products.map((localProduct) => {
  const shopifyProduct = shopifyProducts.find(
    (sp) => sp.handle === `luma-${localProduct.slug}`
  );
  const variant = shopifyProduct?.variants.edges[0]?.node;
  return {
    ...localProduct,
    availableForSale: variant?.availableForSale ?? true,
    shopifyVariantId: variant?.id ?? null,
    outOfStock: variant ? !variant.availableForSale : false,
  };
});
```

Show an "Out of Stock" badge on product cards where `outOfStock === true` and disable the "Add to Ritual" button.

---

## STEP 13 — UPDATE ALL `addItem` CALL SITES

Search for all remaining `addItem({` calls in the codebase and update them to use the new signature. The key changes are:

1. `id: number` → `variantId: string` (from Shopify)
2. Add `handle: string` field
3. Keep all other fields the same

For any component that doesn't have access to Shopify data yet, use this pattern:
```typescript
// Temporary fallback until Shopify data loads
const variantId = getVariantId(`luma-${product.slug}`).catch(() => `fallback-${product.id}`);
```

---

## STEP 14 — SHOPIFY ADMIN SETUP (Manual steps for the store owner)

These steps must be completed in Shopify admin before the integration will work:

**14a. Create products** — Go to `luma-daily.myshopify.com/admin/products/new` and create all 6 products with these exact handles:

| Handle | Title | Price | Compare At Price |
|---|---|---|---|
| `luma-energy` | Luma Energy | $27.99 | $37.99 |
| `luma-calm` | Luma Calm | $27.99 | $37.99 |
| `luma-sleep` | Luma Sleep | $24.99 | $34.99 |
| `luma-focus` | Luma Focus | $29.99 | $39.99 |
| `luma-glow` | Luma Glow | $29.99 | $39.99 |
| `luma-gut` | Luma Gut | $24.99 | $34.99 |

**14b. Add metafields** — In Settings → Custom data → Products, add these metafield definitions:
- `custom.tagline` — Single line text
- `custom.flavor` — Single line text
- `custom.bg_color` — Single line text (hex color)
- `custom.text_color` — Single line text (hex color)

Then fill in the values for each product from the product data table in this document.

**14c. Install Recharge** — Install Recharge Subscriptions from the Shopify App Store. Set up a subscription selling plan group on all 6 products:
- Name: "Subscribe & Save"
- Delivery frequency: Every 1 month, Every 2 months, Every 3 months
- Discount: 20% off on all frequencies

**14d. Install Monster Cart** — Install "Monster Cart Upsell + Free Gifts" from the Shopify App Store. The GWP logic is already implemented in React (Step 5), so Monster Cart is optional — it adds additional upsell features but the progress bar works without it in headless mode.

**14e. Install Klaviyo** — Install Klaviyo from the Shopify App Store. Copy your Public API Key from Klaviyo → Account → Settings → API Keys and add it to the `.env` file.

**14f. Install Okendo** — Install Okendo Reviews from the Shopify App Store. Copy your Subscriber ID from Okendo → Settings → Installation and add it to the `.env` file.

---

## COMPLETE PRODUCT DATA REFERENCE

Use this for Shopify metafield values and any display logic:

```
Energy:  flavor="Blood Orange Mango"  tagline="Fuel your day, naturally."
         bgColor=#FEF0E6  textColor=#8B3A0A  color=#E8873A
         price=27.99  compareAt=37.99  subscribePrice=22.39

Calm:    flavor="Raspberry Hibiscus"  tagline="Find your calm, keep your edge."
         bgColor=#F5EEF8  textColor=#5B2D7A  color=#9B6BB5
         price=27.99  compareAt=37.99  subscribePrice=22.39

Sleep:   flavor="Blueberry Lavender"  tagline="Sleep deeper. Wake better."
         bgColor=#EBF2F8  textColor=#1A3A5C  color=#5B7FA6
         price=24.99  compareAt=34.99  subscribePrice=19.99

Focus:   flavor="Spearmint Green Tea"  tagline="Think sharper. Do more."
         bgColor=#E8F5F3  textColor=#1A5C52  color=#4A9B8E
         price=29.99  compareAt=39.99  subscribePrice=23.99

Glow:    flavor="Strawberry Peach"  tagline="Radiance, from the inside out."
         bgColor=#FBF0EE  textColor=#7A2A20  color=#D4756A
         price=29.99  compareAt=39.99  subscribePrice=23.99

Gut:     flavor="Citrus Mint"  tagline="Gut health is whole health."
         bgColor=#EFF6EC  textColor=#2A5C1A  color=#7AAE6E
         price=24.99  compareAt=34.99  subscribePrice=19.99
```

---

## PRODUCT IMAGE URLs (already hosted on Manus CDN)

These are the exact image URLs currently used in the site. Use them in Shopify product images too:

```
Energy:  /manus-storage/luma_energy_bottle_18c415cd.png
Calm:    /manus-storage/luma_calm_bottle_14cc2d8f.png
Sleep:   /manus-storage/luma_sleep_bottle_a6f93589.png
Focus:   /manus-storage/luma_focus_bottle_4364c9ab.png
Glow:    /manus-storage/luma_glow_bottle_c1ab2dea.png
Gut:     https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/NP8W4PN5hdBACVumhQ3AtE/luma_gut_bottle-XRZKo6DKmqn38DjNUJpCzw.webp
Hero:    /manus-storage/luma_daily_packaging_master_v2_fe19e1c8.png
```

---

## DESIGN SYSTEM REFERENCE (DO NOT CHANGE THESE)

```
Background:     #FAF7F2  (cream)
Foreground:     #1E1B16  (charcoal)
Primary/Amber:  #C8813A
Amber hover:    #B5712E
Dark section:   #1A1510
Muted text:     #1E1B16 at 55% opacity
Border:         #E8E0D4

Fonts:
  Display: 'Playfair Display', Georgia, serif  → .font-display
  Body:    'DM Sans', system-ui, sans-serif    → .font-body

Button classes (defined in index.css):
  .btn-amber         → amber fill, white text, rounded-full, uppercase, 0.04em tracking
  .btn-outline-dark  → transparent, charcoal border/text, hover fills charcoal
  .btn-outline-cream → transparent, cream border/text, for dark backgrounds

Animation:
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
  };
  Product cards: whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(30,27,22,0.12)" }}
  Buttons: whileTap={{ scale: 0.97 }}
```

---

## CURRENT ROUTES (DO NOT CHANGE App.tsx)

```
/                   → Home
/quiz               → Quiz (4 steps + email capture + results)
/checkout           → Checkout (3 steps: shipping → review → confirmation)
/signin             → SignIn
/register           → Register
/account            → Account (tabs: overview, subscription, orders, profile)
/shop               → Shop (all products + bundles)
/products/:slug     → ProductDetail (slug = energy|calm|sleep|focus|glow|gut)
/about              → About
/ingredients        → Ingredients
/contact            → Contact
/shipping           → Shipping & Returns
/privacy            → Privacy Policy
/terms              → Terms of Service
/404                → NotFound
```

---

## TYPESCRIPT REQUIREMENTS

- Run `pnpm check` (alias for `tsc --noEmit`) after every file change
- Zero TypeScript errors required before considering any step complete
- All Shopify API response types are defined in `lib/shopify.ts` — use them everywhere
- Never use `any` except for `window._learnq` (Klaviyo) and `window.klaviyo` (Klaviyo)
- The `CartItem` interface in CartContext must export `lineId: string` (not `id: number`)

---

## GRACEFUL DEGRADATION REQUIREMENTS

The site must work even if Shopify is unreachable:

1. If `getAllProducts()` fails, fall back to static `lib/products.ts` data silently
2. If `createCart()` fails, show toast: "Unable to connect to store. Please try again." and do not open cart
3. If `checkout()` is called with no `checkoutUrl`, navigate to `/checkout` (the existing custom checkout page)
4. If Klaviyo script fails to load, all `_learnq.push()` calls must be wrapped in try/catch
5. If Okendo script fails to load, the reviews section simply doesn't render (the `data-oke-widget` div is empty)

---

## TESTING CHECKLIST

After completing all steps, verify:

- [ ] `pnpm check` returns 0 TypeScript errors
- [ ] `pnpm dev` starts without errors
- [ ] Home page loads with all 6 product cards displaying correct prices ($27.99, $27.99, $24.99, $29.99, $29.99, $24.99)
- [ ] Clicking "Add to Ritual" on any product card opens the cart drawer
- [ ] Cart drawer shows GWP progress bar at the top
- [ ] Cart drawer "Proceed to Checkout" button triggers the subscribe upsell modal if any one-time items are in cart
- [ ] Clicking "No thanks" in the subscribe modal proceeds to Shopify checkout (redirects to `checkout.shopify.com/...`)
- [ ] Clicking "Switch to Subscription" also proceeds to checkout
- [ ] Product Detail page shows subscribe/one-time toggle
- [ ] Subscribe toggle changes displayed price from $27.99 to $22.39 (for Energy/Calm)
- [ ] Quiz email capture step submits to Klaviyo (check browser Network tab for `static.klaviyo.com` request)
- [ ] Footer newsletter email input submits to Klaviyo
- [ ] All 14 routes render without white screens
- [ ] Mobile viewport (375px) nav hamburger menu works
- [ ] Cart persists after page refresh (localStorage `luma_daily_cart_id` is set)

---

## NOTES

1. The `checkout()` function in the new CartContext calls `window.location.href = checkoutUrl`. This redirects to Shopify's hosted checkout at `checkout.shopify.com`. The existing custom `/checkout` page in the codebase is a fallback for when Shopify is not connected — keep it in place.

2. Recharge subscriptions are managed by Recharge's own customer portal. When a subscriber clicks "Manage Subscription" in the Account page, link them to `https://luma-daily.myshopify.com/tools/recurring/login` — this is Recharge's customer portal URL.

3. The `items` array in the new CartContext uses `lineId` (Shopify cart line ID) instead of `id` (numeric). Any component that was calling `removeItem(item.id)` must be updated to `removeItem(item.lineId)`. Search for all `removeItem` and `updateQuantity` call sites.

4. The store domain is `luma-daily.myshopify.com`. The public-facing domain is `takelumadaily.com`. The Shopify checkout will show `luma-daily.myshopify.com` in the URL until a custom checkout domain is configured in Shopify Settings → Domains.

5. Do not install any new npm packages. All required dependencies are already in `package.json`: `framer-motion`, `lucide-react`, `sonner`, `wouter`, `react-hook-form`, `zod`, `@radix-ui/*`, `tailwind-merge`.


---

## CART UX ENHANCEMENTS (Manus Design Prototype — Ready to Port)

The following micro-interactions have been designed, prototyped, and validated in the Manus design sandbox. CSS animations are already committed to `client/src/index.css`. Full implementation spec with code snippets is in `docs/CART_UX_ENHANCEMENTS.md`.

**Priority order for implementation:**

| # | Enhancement | CSS Class | Target Component |
|---|-------------|-----------|-----------------|
| 1 | ATC button loading spinner + success checkmark | `.spinner-icon`, `.success-pop` | Product card ATC button |
| 2 | Cart drawer success banner on add | `.banner-slide-in` | Cart drawer header |
| 3 | New item slide-in animation | `.cart-item-enter` | Cart drawer item list |
| 4 | Remove item shake + slide-out | `.item-shake`, `.item-slide-out` | Cart drawer item row |
| 5 | Quantity change price flash | `.price-flash` | Cart drawer price display |
| 6 | Cart badge pop on count increase | `.badge-pop` | Nav cart icon badge |
| 7 | Free-shipping progress to unlocked banner | `.banner-slide-in` | Cart drawer footer |
| 8 | GWP tier at $75 with progress bar | `.banner-slide-in` | Cart drawer footer |
| 9 | Checkout button glow pulse at $50 | `.checkout-glow-pulse` | Cart drawer checkout button |
| 10 | Sticky checkout footer on mobile | `sticky bottom-0` | Cart drawer layout |

**State additions required in CartContext:**
- `addingId: string | null` — handle of product currently being added
- `successId: string | null` — handle of product that just succeeded (auto-cleared after 1.4s)
- `lastAddedName: string | null` — display name for the success banner (auto-cleared after 2.5s)

See `docs/CART_UX_ENHANCEMENTS.md` for complete code snippets for each enhancement.
