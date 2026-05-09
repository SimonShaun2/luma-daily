/*
 * LUMA DAILY — IMPROVED LANDING PAGE
 * Design: Warm Editorial Urgency
 * Features added in this version:
 * 1. Real UGC thumbnail avatars in hero social proof row
 * 2. 3-step quiz modal (Goal → Lifestyle → Sleep → Recommendation)
 * 3. Upgraded mobile sticky bottom bar with product image + animated slide-in
 * 4. Slide-out cart drawer (Sheet) with quantity tiers, subscribe toggle,
 *    trust badges, upsell row, and multi-step checkout modal
 */

import { useEffect, useState, useRef, createContext, useContext, useCallback } from "react";
import ProductDetail from "@/components/ProductDetail";
import { Star, Shield, Leaf, FlaskConical, Wheat, ChevronDown, ChevronUp, Check, X, Play, ChevronLeft, ChevronRight, ShoppingCart, Plus, Minus, Trash2, CreditCard, Lock, Truck, RefreshCw, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem {
  id: string;
  name: string;
  flavor: string;
  price: number;
  qty: number;
  img: string;
  accentColor: string;
  subscribe: boolean;
}

interface CartContextType {
  items: CartItem[];
  wishlist: CartItem[];
  addToCart: (product: { name: string; flavor: string; price: number; img: string; accentColor: string }) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleSubscribe: (id: string) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  total: number;
  count: number;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  // Loading/success feedback state
  addingId: string | null;   // product id currently being added (spinner)
  successId: string | null;  // product id just added (checkmark)
  lastAddedId: string | null; // for drawer flash banner
}

// ─── Cart Context ─────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "luma_cart_v1";
const WISHLIST_STORAGE_KEY = "luma_wishlist_v1";
function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Persist cart and wishlist to localStorage
  useEffect(() => {
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); } catch { /* fail silently */ }
  }, [items]);
  useEffect(() => {
    try { localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist)); } catch { /* fail silently */ }
  }, [wishlist]);;

  const addToCart = useCallback((product: { name: string; flavor: string; price: number; img: string; accentColor: string }) => {
    const id = product.name;
    // Start loading state
    setAddingId(id);

    // Simulate async (matches real Shopify AJAX latency feel)
    setTimeout(() => {
      setItems(prev => {
        const existing = prev.find(i => i.id === id);
        if (existing) {
          return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
        }
        return [...prev, { id, ...product, qty: 1, subscribe: false }];
      });
      setAddingId(null);
      setSuccessId(id);
      setLastAddedId(id);
      setIsOpen(true);

      // Clear success state after 1.4s
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccessId(null), 1400);

      // Clear banner after 2.5s
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = setTimeout(() => setLastAddedId(null), 2500);
    }, 480);
  }, []);

  const removeFromCart = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty < 1) { removeFromCart(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };
    const toggleSubscribe = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, subscribe: !i.subscribe } : i));
  // Wishlist (Save for Later)
  const saveForLater = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    setItems(prev => prev.filter(i => i.id !== id));
    setWishlist(prev => prev.find(i => i.id === id) ? prev : [...prev, { ...item, qty: 1 }]);
  };
  const moveToCart = (id: string) => {
    const item = wishlist.find(i => i.id === id);
    if (!item) return;
    setWishlist(prev => prev.filter(i => i.id !== id));
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const removeFromWishlist = (id: string) => setWishlist(prev => prev.filter(i => i.id !== id));
  const total = items.reduce((sum, i) => {
    const price = i.subscribe ? i.price * 0.85 : i.price;
    return sum + price * i.qty;
  }, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  return (
    <CartContext.Provider value={{ items, wishlist, addToCart, removeFromCart, updateQty, toggleSubscribe, saveForLater, moveToCart, removeFromWishlist, total, count, isOpen, setIsOpen, addingId, successId, lastAddedId }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// ─── Countdown Timer ────────────────────────────────────────────────────────
function useCountdown(hours = 7, minutes = 0, seconds = 0) {
  const total = hours * 3600 + minutes * 60 + seconds;
  const [remaining, setRemaining] = useState(total);
  useEffect(() => {
    const id = setInterval(() => setRemaining(r => (r > 0 ? r - 1 : total)), 1000);
    return () => clearInterval(id);
  }, [total]);
  const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  return { h, m, s };
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1800;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[oklch(0.88_0.02_80)] py-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-start text-left gap-4"
      >
        <span className="font-display font-bold text-lg text-[oklch(0.22_0.04_55)]">{q}</span>
        {open ? <ChevronUp className="shrink-0 mt-1 text-[oklch(0.58_0.13_45)]" size={20} /> : <ChevronDown className="shrink-0 mt-1 text-[oklch(0.52_0.04_55)]" size={20} />}
      </button>
      {open && (
        <p className="mt-3 text-[oklch(0.42_0.04_55)] font-body leading-relaxed">{a}</p>
      )}
    </div>
  );
}

// ─── Star Rating ─────────────────────────────────────────────────────────────
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < count ? "fill-[oklch(0.72_0.12_80)] text-[oklch(0.72_0.12_80)]" : "text-gray-300"} />
      ))}
    </div>
  );
}
// ─── Products Data ─────────────────────────────────────────────────────────────
//
// SHOPIFY INTEGRATION NOTE:
// Each product entry below contains a `shopifyVariantId` and `shopifyHandle` field.
// These are placeholder values — replace them with real Shopify variant IDs and product
// handles once products are created in the Shopify admin.
//
// When wiring to Shopify:
//   - Replace `price` with a live fetch from the Storefront API (see SHOPIFY_INTEGRATION.md)
//   - Set `soldOut: true` to disable the Add to Cart button and show a "Sold Out" badge
//   - `shopifyVariantId` is used in the /cart/add.js endpoint
//   - `shopifyHandle` is used to link to the product page (/products/{handle})
//
interface Product {
  name: string;
  tagline: string;
  flavor: string;
  accentColor: string;
  price: number;
  img: string;
  // ─ Shopify fields (populate before GitHub push) ─
  shopifyVariantId: string;   // e.g. "gid://shopify/ProductVariant/12345678"
  shopifyHandle: string;      // e.g. "luma-energy-gummies"
  soldOut: boolean;           // set true to show Sold Out badge + disable Add to Cart
  compareAtPrice?: number;    // original price for strikethrough display
}

const PRODUCTS: Product[] = [
  {
    name: "Luma Energy",
    tagline: "Supports energy + focus*",
    flavor: "Blood Orange Mango",
    accentColor: "#FF8C42",
    price: 34.99,
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/ad_energy_v3-Y2AR6A5DmFnk7XuztAK88H.webp",
    shopifyVariantId: "SHOPIFY_VARIANT_ID_ENERGY",
    shopifyHandle: "luma-energy-gummies",
    soldOut: false,
  },
  {
    name: "Luma Calm",
    tagline: "Supports calm + stress balance*",
    flavor: "Raspberry Hibiscus",
    accentColor: "#4A7C59",
    price: 34.99,
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/ad_calm_v3-ihzrHo2bsfLKhRVoDkSvjG.webp",
    shopifyVariantId: "SHOPIFY_VARIANT_ID_CALM",
    shopifyHandle: "luma-calm-gummies",
    soldOut: false,
  },
  {
    name: "Luma Sleep",
    tagline: "Supports restful sleep + relaxation*",
    flavor: "Blueberry Lavender",
    accentColor: "#6B5B95",
    price: 34.99,
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/ad_sleep_v3-hR6GeaAiRC85gDeKxsHWqT.webp",
    shopifyVariantId: "SHOPIFY_VARIANT_ID_SLEEP",
    shopifyHandle: "luma-sleep-gummies",
    soldOut: false,
  },
  {
    name: "Luma Glow",
    tagline: "Supports healthy skin, hair + nails*",
    flavor: "Strawberry Peach",
    accentColor: "#E07B54",
    price: 34.99,
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/ad_glow_v3-RSyybN2xTzLMSDCsN8Xi7c.webp",
    shopifyVariantId: "SHOPIFY_VARIANT_ID_GLOW",
    shopifyHandle: "luma-glow-gummies",
    soldOut: false,
  },
  {
    name: "Luma Focus",
    tagline: "Supports focus + mental clarity*",
    flavor: "Spearmint Green Tea",
    accentColor: "#2A7F7F",
    price: 34.99,
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/ad_focus_v3-BiEeeBHkuXEMjNEHuqMyh8.webp",
    shopifyVariantId: "SHOPIFY_VARIANT_ID_FOCUS",
    shopifyHandle: "luma-focus-gummies",
    soldOut: false,
  },
  {
    name: "Luma Gut",
    tagline: "Supports digestive health + gut balance*",
    flavor: "Ginger Chamomile",
    accentColor: "#8B6914",
    price: 34.99,
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/ad_gut_v3-fsPSGbUocmxHCL44SA7Lj9.webp",
    shopifyVariantId: "SHOPIFY_VARIANT_ID_GUT",
    shopifyHandle: "luma-gut-gummies",
    soldOut: false,
  },
];

// ─── UGC Carousel Data ───────────────────────────────────────────────────────
const UGC_ITEMS = [
  {
    type: "video",
    videoSrc: "/manus-storage/ugc_energy_video_657c3cf2.mp4",
    thumb: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_energy-BU5nytyV5C6nddBCV93s23.webp",
    caption: "I replaced my morning coffee with Luma Energy and I have way more steady energy without the jitters.",
    product: "Luma Energy",
    stars: 5,
  },
  {
    type: "video",
    videoSrc: "/manus-storage/ugc_older_male_5399d899.mp4",
    thumb: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_older_male-BqsWzS3XoAKMWarYRyTefB.webp",
    caption: "At 63, I didn't expect to feel this energized. Luma Energy has been a game changer for me.",
    product: "Luma Energy",
    stars: 5,
  },
  {
    type: "video",
    videoSrc: "/manus-storage/ugc_older_female_881a7b02.mp4",
    thumb: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_older_female-bHagUe48nMEAq3dny9KkjU.webp",
    caption: "Luma Calm has made such a difference in my stress levels. I feel like myself again.",
    product: "Luma Calm",
    stars: 5,
  },
  {
    type: "video",
    videoSrc: "/manus-storage/ugc_sleep_video_ef7dcd79.mp4",
    thumb: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_sleep-8FLZ7pbsugrQz3RE5hzykg.webp",
    caption: "Finally sleeping through the night. Luma Sleep is the only thing that's worked for me.",
    product: "Luma Sleep",
    stars: 5,
  },
  {
    type: "video",
    videoSrc: "/manus-storage/ugc_glow_video_aa6e15e8.mp4",
    thumb: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_glow-hUmz5zqBmQei2iszVAQKin.webp",
    caption: "My skin has been glowing. My dermatologist actually asked what I changed!",
    product: "Luma Glow",
    stars: 5,
  },
  {
    type: "video",
    videoSrc: "/manus-storage/ugc_focus_video_1ba21922.mp4",
    thumb: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_focus-GGW3hv8ntX3B5jitYR6mgv.webp",
    caption: "Deep work sessions hit different now. Luma Focus is part of my daily routine.",
    product: "Luma Focus",
    stars: 5,
  },
  {
    type: "video",
    videoSrc: "/manus-storage/ugc_gut_v2_14046ea0.mp4",
    thumb: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_gut-WBWzhM9Wa3FaiF8puE958A.webp",
    caption: "Bloating is GONE. Luma Gut has completely changed how I feel after meals.",
    product: "Luma Gut",
    stars: 5,
  },
];

// Hero avatar thumbnails — real UGC face crops (no fake generated people)
const HERO_AVATARS = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_older_female-bHagUe48nMEAq3dny9KkjU.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_energy-BU5nytyV5C6nddBCV93s23.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_sleep-8FLZ7pbsugrQz3RE5hzykg.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/thumb_glow-hUmz5zqBmQei2iszVAQKin.webp",
];

const REVIEWS = [
  {
    name: "Sarah M.",
    location: "Austin, TX",
    stars: 5,
    text: "I've tried every supplement brand out there. Luma Daily is the first one I've actually stuck with for more than a week. The gummies taste incredible and I genuinely feel a difference in my energy levels.",
    product: "Luma Energy",
    verified: true,
  },
  {
    name: "Jessica L.",
    location: "New York, NY",
    stars: 5,
    text: "My anxiety has been so much better since starting Luma Calm. I was skeptical — I've tried ashwagandha before and felt nothing. But the Raspberry Hibiscus flavor makes it feel like a treat, not a chore.",
    product: "Luma Calm",
    verified: true,
  },
  {
    name: "Priya K.",
    location: "San Francisco, CA",
    stars: 5,
    text: "I fall asleep within 20 minutes now. I used to lie awake for hours. The Blueberry Lavender flavor is genuinely delicious and I don't wake up groggy at all.",
    product: "Luma Sleep",
    verified: true,
  },
  {
    name: "Rachel T.",
    location: "Chicago, IL",
    stars: 5,
    text: "My skin has been glowing and my nails stopped breaking. I've been taking Luma Glow for 6 weeks and my dermatologist actually asked what I changed in my routine.",
    product: "Luma Glow",
    verified: true,
  },
];

const FAQS = [
  {
    q: "How long until I see results?",
    a: "Most customers notice a difference within 2–4 weeks of consistent daily use. Energy and mood improvements are often felt within the first week, while skin and hair benefits typically take 4–6 weeks to become visible.",
  },
  {
    q: "Can I take multiple Luma Daily products together?",
    a: "Yes! Our formulas are designed to work together. Many customers take Luma Energy in the morning and Luma Sleep at night. Our bundles are curated specifically for complementary use.",
  },
  {
    q: "Are Luma Daily gummies safe?",
    a: "All Luma Daily products are vegan, gluten-free, and third-party tested for purity and potency. They are manufactured in an FDA-registered, GMP-certified facility. Always consult your healthcare provider if you have specific medical conditions.",
  },
  {
    q: "How many gummies do I take per day?",
    a: "Each product recommends 2 gummies per day, taken with or without food. Each jar contains 60 gummies — a full 30-day supply.",
  },
  {
    q: "What is your return policy?",
    a: "We take quality seriously. If you have any issues with your order, please contact our support team and we'll work with you to make it right.",
  },
];

// ─── Product Filter Tabs + Grid ───────────────────────────────────────────────────
const FILTER_TABS = [
  { key: "all",    label: "All Formulas" },
  { key: "energy", label: "Energy & Focus" },
  { key: "calm",   label: "Calm & Sleep" },
  { key: "beauty", label: "Beauty & Gut" },
];

const PRODUCT_FILTER_MAP: Record<string, string[]> = {
  all:    ["Luma Energy", "Luma Calm", "Luma Sleep", "Luma Glow", "Luma Focus", "Luma Gut"],
  energy: ["Luma Energy", "Luma Focus"],
  calm:   ["Luma Calm", "Luma Sleep"],
  beauty: ["Luma Glow", "Luma Gut"],
};

function ProductFilterTabs({ onAddToCart, onCardClick }: { onAddToCart: (p: Product) => void; onCardClick?: (p: Product) => void }) {
  const [active, setActive] = useState("all");
  const visible = PRODUCT_FILTER_MAP[active];
  const filtered = PRODUCTS.filter(p => visible.includes(p.name));
  const { addingId, successId } = useCart();

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200 border ${
              active === tab.key
                ? "bg-[oklch(0.58_0.13_45)] text-white border-[oklch(0.58_0.13_45)] shadow-md"
                : "bg-white text-[oklch(0.42_0.04_55)] border-[oklch(0.88_0.02_80)] hover:border-[oklch(0.58_0.13_45)] hover:text-[oklch(0.58_0.13_45)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div
            key={p.name}
            className="product-card group overflow-hidden cursor-pointer"
            // Shopify data attributes — Codex uses these to wire live pricing + ATC
            data-shopify-product-handle={p.shopifyHandle}
            data-shopify-variant-id={p.shopifyVariantId}
            onClick={() => onCardClick?.(p)}
          >
            <div className="relative overflow-hidden aspect-square">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {/* Sold Out overlay badge */}
              {p.soldOut && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-[oklch(0.22_0.04_55)] font-body font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                    Sold Out
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-display font-bold text-xl text-[oklch(0.22_0.04_55)] mb-0.5">{p.name}</h3>
              <p className="text-sm text-[oklch(0.52_0.04_55)] font-body mb-1">{p.tagline}</p>
              <p className="text-xs text-[oklch(0.62_0.04_55)] font-body mb-3 italic">{p.flavor}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {["Vegan", "GF", "3rd Party"].map(b => (
                    <span key={b} className="text-xs bg-[oklch(0.94_0.02_80)] text-[oklch(0.42_0.04_55)] rounded-full px-2.5 py-1 font-body font-medium">{b}</span>
                  ))}
                </div>
                {/* Price — data-shopify-price lets Codex swap in live Storefront API price */}
                <div className="text-right" data-shopify-price>
                  {p.compareAtPrice && (
                    <span className="text-xs text-[oklch(0.62_0.04_55)] font-body line-through mr-1">${p.compareAtPrice.toFixed(2)}</span>
                  )}
                  <span className="font-display font-bold text-lg text-[oklch(0.22_0.04_55)]">${p.price.toFixed(2)}</span>
                </div>
              </div>
              {(() => {
                const isAdding = addingId === p.name;
                const isSuccess = successId === p.name;
                return (
                  <button
                    onClick={() => !p.soldOut && !isAdding && onAddToCart(p)}
                    disabled={p.soldOut || isAdding}
                    data-shopify-atc
                    data-shopify-variant-id={p.shopifyVariantId}
                    className={`w-full justify-center text-sm py-3 flex items-center gap-2 transition-all duration-200 ${
                      p.soldOut
                        ? "bg-[oklch(0.88_0.02_80)] text-[oklch(0.62_0.04_55)] cursor-not-allowed rounded-md font-body font-semibold"
                        : isSuccess
                          ? "btn-primary bg-[oklch(0.48_0.14_145)] hover:bg-[oklch(0.44_0.14_145)]"
                          : "btn-primary"
                    }`}
                  >
                    {p.soldOut ? (
                      "Sold Out"
                    ) : isAdding ? (
                      <>
                        <svg className="spinner-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Adding...
                      </>
                    ) : isSuccess ? (
                      <>
                        <span className="success-pop inline-flex"><Check size={16} strokeWidth={3} /></span>
                        Added!
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                );
              })()}
            </div>
          </div>
        ))}

        {/* Bundle card — only shown in All tab */}
        {active === "all" && (
          <div className="product-card bg-[oklch(0.22_0.04_55)] text-white sm:col-span-2 lg:col-span-1">
            <div className="relative overflow-hidden aspect-square">
              <img src="/manus-storage/bundle_fullritual_noprice_2c0ab63f.png" alt="Full Ritual Bundle" className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-display font-bold text-xl text-white">The Full Ritual</h3>
                <div className="text-right">
                  <span className="text-sm line-through text-gray-400">$149</span>
                  <span className="block font-body font-bold text-[oklch(0.72_0.12_80)]">$119</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 font-body mb-1">All 6 formulas. Save 20%.</p>
              <p className="text-xs text-gray-400 font-body mb-4 italic">360 gummies — 30-day supply</p>
              <div className="flex gap-2 mb-4">
                <span className="text-xs bg-[oklch(0.58_0.13_45)] text-white rounded-full px-2.5 py-1 font-body font-bold">SAVE 20%</span>
                <span className="text-xs bg-[oklch(0.35_0.04_55)] text-gray-200 rounded-full px-2.5 py-1 font-body font-medium">Best Value</span>
              </div>
              <a href="#bundles" className="btn-primary w-full justify-center text-sm py-3 bg-[oklch(0.72_0.12_80)] hover:bg-[oklch(0.62_0.12_80)]">
                Shop the Bundle →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Hero Video Player Component ────────────────────────────────────────────────────
function HeroVideoPlayer() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => videoRef.current?.play(), 50);
  };

  return (
    <div className="relative w-full max-w-[300px] md:max-w-[360px]">
      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[oklch(0.22_0.04_55_/_0.12)] bg-black" style={{ aspectRatio: '9/16' }}>
        {/* Video element — hidden until play */}
        <video
          ref={videoRef}
          src="/manus-storage/hero_ugc_testimonial_dcd7bd65.mp4"
          className={`w-full h-full object-cover transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
          playsInline
          controls={playing}
          loop
        />

        {/* Thumbnail shown before play */}
        {!playing && (
          <>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/AnQGopwkGMamh4C9LsYVXo/hero_ugc_video_thumb-A7BALyfjmi6xBF6BM4aARa.webp"
              alt="Customer testimonial — Luma Daily"
              className="w-full h-full object-cover"
            />
            {/* Subtle gradient at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent" />
            {/* Caption only — no @username */}
            <div className="absolute bottom-5 left-4 right-4">
              <p className="text-white/90 font-body text-xs leading-snug italic">"I've been taking these for 30 days and I genuinely feel so much better."</p>
            </div>
            {/* Play button */}
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Play testimonial video"
            >
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-all duration-200">
                <Play size={26} className="text-[oklch(0.58_0.13_45)] ml-1" fill="currentColor" />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Floating verified badge */}
      <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-3 py-2.5 flex items-center gap-2 border border-[oklch(0.88_0.02_80)]">
        <div className="w-7 h-7 rounded-full bg-[oklch(0.58_0.13_45)] flex items-center justify-center shrink-0">
          <Check size={13} className="text-white" />
        </div>
        <div>
          <p className="font-body font-bold text-xs text-[oklch(0.22_0.04_55)]">Verified Customer</p>
          <p className="font-body text-[10px] text-[oklch(0.52_0.04_55)]">30-day ritual complete</p>
        </div>
      </div>

      {/* Stars badge */}
      <div className="absolute -top-3 -right-3 bg-white border border-[oklch(0.88_0.02_80)] text-[oklch(0.22_0.04_55)] rounded-full px-3 py-1.5 flex items-center gap-1 shadow-lg">
        <Star size={11} className="fill-amber-400 text-amber-400" />
        <span className="text-xs font-body font-bold">4.9 / 5</span>
      </div>
    </div>
  );
}

// ─── UGC Carousel Component ─────────────────────────────────────────────────────────
function UGCCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section className="bg-[oklch(0.14_0.02_55)] py-16 md:py-24 overflow-hidden">
      <div className="container mb-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[oklch(0.72_0.12_80)] font-body font-semibold uppercase tracking-widest text-sm mb-3">Real people. Real results.</p>
            <h2 className="font-display font-black text-white text-3xl md:text-4xl leading-tight">
              See what the community
              <br />
              <em className="text-[oklch(0.72_0.12_80)]">is saying.</em>
            </h2>
          </div>
          {/* Nav arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable row — bleeds to edges */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-[max(1rem,calc((100vw-1280px)/2+2rem))] pb-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {UGC_ITEMS.map((item, i) => (
          <div
            key={i}
            className="shrink-0 w-[260px] md:w-[280px] rounded-2xl overflow-hidden bg-[oklch(0.20_0.03_55)] border border-white/10 flex flex-col"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Video thumbnail + inline playback */}
            <div className="relative aspect-[3/4] overflow-hidden bg-black">
              {activeVideo === i ? (
                <video
                  src={item.videoSrc}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  controls
                  loop
                />
              ) : (
                <>
                  <img
                    src={item.thumb}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setActiveVideo(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={22} className="text-[oklch(0.22_0.04_55)] ml-1" fill="currentColor" />
                    </div>
                  </button>
                </>
              )}
              {/* Product tag */}
              <div className="absolute top-3 left-3">
                <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-body font-semibold px-2.5 py-1 rounded-full">
                  {item.product}
                </span>
              </div>
              {/* Video badge */}
              {activeVideo !== i && (
                <div className="absolute top-3 right-3">
                  <span className="bg-[oklch(0.58_0.13_45)] text-white text-xs font-body font-bold px-2 py-1 rounded-full">
                    VIDEO
                  </span>
                </div>
              )}
            </div>

            {/* Card body */}
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[oklch(0.72_0.12_80)] to-[oklch(0.58_0.13_45)] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{item.product[0]}</span>
                </div>
                <span className="text-[oklch(0.72_0.08_80)] font-body text-sm font-semibold">{item.product}</span>
              </div>
              <p className="text-white font-body text-sm leading-snug">"{item.caption}"</p>
              <div className="mt-auto pt-2 flex items-center gap-1">
                {Array.from({ length: item.stars }).map((_, si) => (
                  <Star key={si} size={11} className="fill-[oklch(0.72_0.12_80)] text-[oklch(0.72_0.12_80)]" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile scroll hint */}
      <div className="md:hidden text-center mt-4">
        <p className="text-white/40 text-xs font-body">← Swipe to see more →</p>
      </div>
    </section>
  );
}

// ─── Quiz Modal ────────────────────────────────────────────────────────────────
const QUIZ_STEPS = [
  {
    title: "What's your main wellness goal?",
    subtitle: "We'll match you with the perfect formula.",
    options: [
      { label: "More Energy", icon: "⚡", value: "energy", product: "Luma Energy" },
      { label: "Less Stress", icon: "🌿", value: "calm", product: "Luma Calm" },
      { label: "Better Sleep", icon: "🌙", value: "sleep", product: "Luma Sleep" },
      { label: "Glowing Skin", icon: "✨", value: "glow", product: "Luma Glow" },
      { label: "Sharper Focus", icon: "🎯", value: "focus", product: "Luma Focus" },
      { label: "Gut Health", icon: "🌱", value: "gut", product: "Luma Gut" },
    ],
  },
  {
    title: "How's your current wellness routine?",
    subtitle: "This helps us fine-tune your recommendation.",
    options: [
      { label: "Just starting out", icon: "🌱", value: "beginner" },
      { label: "I've tried supplements before", icon: "💊", value: "experienced" },
      { label: "Looking to optimize my stack", icon: "🔬", value: "optimizer" },
    ],
  },
  {
    title: "How would you rate your sleep quality?",
    subtitle: "Sleep affects everything — let's factor it in.",
    options: [
      { label: "I sleep great", icon: "😴", value: "great" },
      { label: "Could be better", icon: "😐", value: "okay" },
      { label: "I really struggle", icon: "😩", value: "poor" },
    ],
  },
];

const PRODUCT_MAP: Record<string, typeof PRODUCTS[0]> = Object.fromEntries(
  PRODUCTS.map(p => [p.name, p])
);

const GOAL_TO_PRODUCT: Record<string, string> = {
  energy: "Luma Energy",
  calm: "Luma Calm",
  sleep: "Luma Sleep",
  glow: "Luma Glow",
  focus: "Luma Focus",
  gut: "Luma Gut",
};

function QuizModal({ open, onClose, onAddToCart }: { open: boolean; onClose: () => void; onAddToCart: (p: typeof PRODUCTS[0]) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  // Email capture state
  const [emailStep, setEmailStep] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setDone(false);
    setEmailStep(false);
    setEmail("");
    setEmailSubmitted(false);
    setEmailError("");
  };

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    // Store in localStorage so Shopify/Klaviyo can pick it up
    try {
      localStorage.setItem("luma_quiz_email", JSON.stringify({ email, goal: answers[0], ts: Date.now() }));
    } catch { /* silent */ }
    setEmailSubmitted(true);
    setEmailError("");
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < QUIZ_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
      setEmailStep(true); // show email capture before result
    }
  };

  // Determine recommended product from goal answer
  const goalAnswer = answers[0];
  const recommendedProductName = GOAL_TO_PRODUCT[goalAnswer] || "Luma Energy";
  const recommendedProduct = PRODUCT_MAP[recommendedProductName];

  // If poor sleep and goal isn't sleep, also suggest Sleep
  const sleepAnswer = answers[2];
  const suggestSleep = sleepAnswer === "poor" && goalAnswer !== "sleep";

  const currentStep = QUIZ_STEPS[step];
  const progress = done ? 100 : Math.round(((step) / QUIZ_STEPS.length) * 100);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); handleReset(); } }}>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        {/* Progress bar */}
        <div className="h-1 bg-[oklch(0.92_0.02_80)]">
          <div
            className="h-full bg-[oklch(0.58_0.13_45)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6 md:p-8">
          {emailStep && !emailSubmitted ? (
            /* ── Email capture screen ── */
            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🎁</div>
                <h2 className="font-display font-black text-2xl text-[oklch(0.22_0.04_55)] mb-2">
                  Your ritual is ready.
                </h2>
                <p className="text-sm text-[oklch(0.52_0.04_55)] font-body">
                  Enter your email to unlock <strong className="text-[oklch(0.58_0.13_45)]">10% off</strong> your first order and see your personalized recommendation.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
                    placeholder="your@email.com"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] outline-none transition-colors ${
                      emailError ? "border-red-400 bg-red-50" : "border-[oklch(0.88_0.02_80)] bg-white focus:border-[oklch(0.58_0.13_45)]"
                    }`}
                    autoFocus
                  />
                  {emailError && <p className="text-xs text-red-500 font-body mt-1">{emailError}</p>}
                </div>
                <button
                  onClick={handleEmailSubmit}
                  className="btn-primary w-full justify-center py-3.5 text-base"
                >
                  Unlock 10% Off &amp; See My Ritual →
                </button>
                <button
                  onClick={() => { setEmailStep(false); setEmailSubmitted(true); }}
                  className="text-xs text-[oklch(0.62_0.04_55)] font-body hover:text-[oklch(0.42_0.04_55)] transition-colors text-center w-full py-1"
                >
                  No thanks, skip discount
                </button>
              </div>
              <p className="text-[10px] text-[oklch(0.72_0.04_55)] font-body text-center mt-4">
                No spam. Unsubscribe anytime. Discount applied at checkout.
              </p>
            </div>
          ) : !done ? (
            <>
              <DialogHeader className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-body font-semibold text-[oklch(0.58_0.13_45)] uppercase tracking-widest">
                    Step {step + 1} of {QUIZ_STEPS.length}
                  </span>
                  {step > 0 && (
                    <button
                      onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}
                      className="text-xs text-[oklch(0.52_0.04_55)] hover:text-[oklch(0.22_0.04_55)] font-body transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                </div>
                <DialogTitle className="font-display font-black text-2xl text-[oklch(0.22_0.04_55)] leading-tight text-left">
                  {currentStep.title}
                </DialogTitle>
                <p className="text-sm text-[oklch(0.52_0.04_55)] font-body mt-1 text-left">{currentStep.subtitle}</p>
              </DialogHeader>

              <div className={`grid gap-3 ${currentStep.options.length === 6 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {currentStep.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-[oklch(0.88_0.02_80)] bg-white hover:border-[oklch(0.58_0.13_45)] hover:bg-[oklch(0.975_0.015_80)] transition-all duration-150 text-left group"
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="font-body font-semibold text-[oklch(0.22_0.04_55)] text-sm group-hover:text-[oklch(0.58_0.13_45)] transition-colors">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Result screen */
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-[oklch(0.94_0.04_80)] text-[oklch(0.58_0.13_45)] rounded-full px-4 py-1.5 text-sm font-body font-semibold mb-4">
                  ✓ Your personalized ritual is ready
                </div>
                <h2 className="font-display font-black text-2xl text-[oklch(0.22_0.04_55)] mb-1">
                  We recommend:
                </h2>
              </div>

              {/* Primary recommendation */}
              <div className="bg-[oklch(0.975_0.015_80)] rounded-2xl border-2 border-[oklch(0.58_0.13_45)] p-4 flex gap-4 items-start mb-4">
                <img
                  src={recommendedProduct.img}
                  alt={recommendedProduct.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-[oklch(0.58_0.13_45)] text-white rounded-full px-2 py-0.5 font-body font-bold">Best Match</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[oklch(0.22_0.04_55)]">{recommendedProduct.name}</h3>
                  <p className="text-xs text-[oklch(0.52_0.04_55)] font-body mb-1">{recommendedProduct.tagline}</p>
                  <p className="text-xs text-[oklch(0.62_0.04_55)] font-body italic mb-2">{recommendedProduct.flavor}</p>
                  <Stars />
                </div>
              </div>

              {/* Sleep upsell if applicable */}
              {suggestSleep && (
                <div className="bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-3 flex gap-3 items-center mb-4">
                  <img
                    src={PRODUCT_MAP["Luma Sleep"].img}
                    alt="Luma Sleep"
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-[oklch(0.58_0.13_45)] font-body font-semibold mb-0.5">Also recommended for you</p>
                    <p className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)]">Luma Sleep</p>
                    <p className="text-xs text-[oklch(0.52_0.04_55)] font-body">Supports restful sleep + relaxation*</p>
                  </div>
                </div>
              )}

              {/* 10% off badge if email was captured */}
              {emailSubmitted && email && (
                <div className="flex items-center gap-2 bg-[oklch(0.94_0.06_80)] border border-[oklch(0.78_0.10_80)] rounded-xl px-3 py-2 mb-3">
                  <span className="text-base">🎉</span>
                  <div>
                    <p className="text-xs font-body font-bold text-[oklch(0.42_0.08_60)]">10% off applied to your order!</p>
                    <p className="text-[10px] font-body text-[oklch(0.52_0.06_60)]">Discount code sent to {email}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    onAddToCart(recommendedProduct);
                    onClose();
                    handleReset();
                  }}
                  className="btn-primary w-full justify-center py-3.5 text-base"
                >
                  Add {recommendedProduct.name} to Cart →
                </button>
                {suggestSleep && (
                  <button
                    onClick={() => {
                      onAddToCart(recommendedProduct);
                      onAddToCart(PRODUCT_MAP["Luma Sleep"]);
                      onClose();
                      handleReset();
                    }}
                    className="btn-secondary w-full justify-center py-3 text-sm"
                  >
                    Add Both to Cart (Save with Bundle)
                  </button>
                )}
                <button
                  onClick={() => { onClose(); handleReset(); }}
                  className="text-xs text-[oklch(0.52_0.04_55)] font-body hover:text-[oklch(0.22_0.04_55)] transition-colors text-center py-1"
                >
                  Browse all formulas instead
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Cart Drawer ────────────────────────────────────────────────────────────────
const QUANTITY_TIERS = [
  { qty: 1, label: "1 Bottle", perBottle: null, badge: null },
  { qty: 2, label: "2 Bottles", perBottle: "Save 10%", badge: "Popular" },
  { qty: 3, label: "3 Bottles", perBottle: "Save 20%", badge: "Best Value" },
];

function CartDrawer() {
  const { items, wishlist, addToCart, removeFromCart, updateQty, toggleSubscribe, saveForLater, moveToCart, removeFromWishlist, total, count, isOpen, setIsOpen, lastAddedId, addingId, successId } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [prevItemIds, setPrevItemIds] = useState<Set<string>>(new Set());
  // Micro-interaction state
  const [shakingId, setShakingId] = useState<string | null>(null);   // trash shake before remove
  const [removingId, setRemovingId] = useState<string | null>(null); // slide-out animation
  const [flashId, setFlashId] = useState<string | null>(null);       // price flash on qty change
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track which items are newly added so we can animate them
  const newItemIds = new Set(
    items.filter(i => !prevItemIds.has(i.id)).map(i => i.id)
  );
  useEffect(() => {
    if (items.length > 0) {
      setPrevItemIds(new Set(items.map(i => i.id)));
    }
  }, [items]);

  // Handlers with micro-interaction
  const handleRemove = (id: string) => {
    setShakingId(id);
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = setTimeout(() => {
      setShakingId(null);
      setRemovingId(id);
      setTimeout(() => {
        removeFromCart(id);
        setRemovingId(null);
      }, 380);
    }, 450);
  };

  const handleQtyChange = (id: string, qty: number) => {
    updateQty(id, qty);
    setFlashId(id);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setFlashId(null), 600);
  };

   const hasItems = items.length > 0;
  const subtotal = total;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const orderTotal = subtotal + shipping;

  // Glow pulse: fires once when shipping transitions from paid → free
  const [glowPulse, setGlowPulse] = useState(false);
  const prevShippingRef = useRef(shipping);
  useEffect(() => {
    if (prevShippingRef.current > 0 && shipping === 0) {
      setGlowPulse(true);
      const t = setTimeout(() => setGlowPulse(false), 1700);
      return () => clearTimeout(t);
    }
    prevShippingRef.current = shipping;
  }, [shipping]);

  // GWP tier: track when subtotal crosses $75
  const gwpUnlocked = subtotal >= 75;
  const [gwpBannerVisible, setGwpBannerVisible] = useState(false);
  const prevGwpRef = useRef(gwpUnlocked);
  useEffect(() => {
    if (!prevGwpRef.current && gwpUnlocked) {
      setGwpBannerVisible(true);
    }
    if (prevGwpRef.current && !gwpUnlocked) {
      setGwpBannerVisible(false);
    }
    prevGwpRef.current = gwpUnlocked;
  }, [gwpUnlocked]);

  // Upsell: suggest a product not in cartt
  const cartIds = items.map(i => i.id);
  const upsellProduct = PRODUCTS.find(p => !cartIds.includes(p.name));

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[420px] p-0 flex flex-col bg-[oklch(0.975_0.015_80)]">
          {/* Header */}
          <SheetHeader className="px-5 py-4 border-b border-[oklch(0.88_0.02_80)] bg-white">
            {/* Success banner — slides in when a new item is added */}
            {lastAddedId && (
              <div className="banner-slide-in flex items-center gap-2 bg-[oklch(0.92_0.18_145)] text-[oklch(0.28_0.12_145)] rounded-lg px-3 py-2 mb-3 text-sm font-body font-semibold">
                <span className="success-pop inline-flex w-5 h-5 rounded-full bg-[oklch(0.48_0.14_145)] text-white items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </span>
                {lastAddedId} added to your ritual!
              </div>
            )}
            <div className="flex items-center justify-between">
              <SheetTitle className="font-display font-bold text-xl text-[oklch(0.22_0.04_55)]">
                Your Ritual {count > 0 && <span className="text-[oklch(0.58_0.13_45)]">({count})</span>}
              </SheetTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[oklch(0.92_0.02_80)] flex items-center justify-center hover:bg-[oklch(0.88_0.02_80)] transition-colors"
              >
                <X size={16} className="text-[oklch(0.42_0.04_55)]" />
              </button>
            </div>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {!hasItems ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 px-6 py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[oklch(0.92_0.02_80)] flex items-center justify-center">
                  <ShoppingCart size={28} className="text-[oklch(0.62_0.04_55)]" />
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-[oklch(0.22_0.04_55)] mb-1">Your cart is empty</p>
                  <p className="text-sm text-[oklch(0.52_0.04_55)] font-body">Add a formula to start your ritual.</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-primary text-sm py-2.5 px-6"
                >
                  Browse Formulas →
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {/* Cart items */}
                {items.map((item) => {
                  const discountedPrice = item.subscribe ? item.price * 0.85 : item.price;
                  const isNew = newItemIds.has(item.id);
                  return (
                    <div key={item.id} className={`bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-4 ${
                        removingId === item.id ? 'item-slide-out' :
                        shakingId === item.id ? 'item-shake' :
                        isNew ? 'cart-item-enter' : ''
                      }`}>
                      <div className="flex gap-3">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)]">{item.name}</p>
                              <p className="text-xs text-[oklch(0.62_0.04_55)] font-body italic">{item.flavor}</p>
                            </div>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className={`transition-colors shrink-0 ${
                                shakingId === item.id ? 'text-red-500' : 'text-[oklch(0.72_0.04_55)] hover:text-red-500'
                              }`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Price — flashes green on qty change */}
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`font-body font-bold text-sm text-[oklch(0.22_0.04_55)] inline-block ${
                              flashId === item.id ? 'price-flash' : ''
                            }`}>
                              ${(discountedPrice * item.qty).toFixed(2)}
                            </span>
                            {item.subscribe && (
                              <span className="text-xs text-[oklch(0.58_0.13_45)] font-body font-semibold">15% off</span>
                            )}
                          </div>
                          {/* Save for Later */}
                          <button
                            onClick={() => saveForLater(item.id)}
                            className="mt-1 text-[10px] font-body text-[oklch(0.52_0.08_55)] hover:text-[oklch(0.38_0.08_55)] underline underline-offset-2 transition-colors"
                          >
                            Save for later
                          </button>
                        </div>
                      </div>

                      {/* Quantity tiers */}
                      <div className="mt-3 grid grid-cols-3 gap-1.5">
                        {QUANTITY_TIERS.map((tier) => (
                          <button
                            key={tier.qty}
                            onClick={() => handleQtyChange(item.id, tier.qty)}
                            className={`relative flex flex-col items-center py-2 px-1 rounded-lg border text-center transition-all duration-150 ${
                              item.qty === tier.qty
                                ? "border-[oklch(0.58_0.13_45)] bg-[oklch(0.975_0.015_80)]"
                                : "border-[oklch(0.88_0.02_80)] bg-white hover:border-[oklch(0.72_0.08_80)]"
                            }`}
                          >
                            {tier.badge && item.qty !== tier.qty && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-[oklch(0.58_0.13_45)] text-white rounded-full px-1.5 py-0.5 font-body font-bold whitespace-nowrap">
                                {tier.badge}
                              </span>
                            )}
                            <span className={`text-xs font-body font-bold ${item.qty === tier.qty ? "text-[oklch(0.58_0.13_45)]" : "text-[oklch(0.42_0.04_55)]"}`}>
                              {tier.qty}x
                            </span>
                            {tier.perBottle && (
                              <span className="text-[9px] font-body text-[oklch(0.58_0.13_45)] font-semibold leading-tight">{tier.perBottle}</span>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Subscribe toggle */}
                      <div className="mt-3 flex items-center justify-between bg-[oklch(0.975_0.015_80)] rounded-lg px-3 py-2.5 border border-[oklch(0.88_0.02_80)]">
                        <div>
                          <p className="text-xs font-body font-semibold text-[oklch(0.22_0.04_55)]">Subscribe & Save 15%</p>
                          <p className="text-[10px] text-[oklch(0.52_0.04_55)] font-body">Pause or cancel anytime</p>
                        </div>
                        <button
                          onClick={() => toggleSubscribe(item.id)}
                          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                            item.subscribe ? "bg-[oklch(0.58_0.13_45)]" : "bg-[oklch(0.82_0.02_80)]"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              item.subscribe ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Upsell */}
                {upsellProduct && (
                  <div className="bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-3">
                    <p className="text-xs font-body font-semibold text-[oklch(0.58_0.13_45)] mb-2 uppercase tracking-wide">You might also like</p>
                    <div className="flex items-center gap-3">
                      <img src={upsellProduct.img} alt={upsellProduct.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)]">{upsellProduct.name}</p>
                        <p className="text-xs text-[oklch(0.52_0.04_55)] font-body">{upsellProduct.tagline}</p>
                      </div>
                      {(() => {
                        const isAddingUpsell = addingId === upsellProduct?.name;
                        const isSuccessUpsell = successId === upsellProduct?.name;
                        return (
                          <button
                            onClick={() => upsellProduct && !isAddingUpsell && addToCart(upsellProduct)}
                            disabled={isAddingUpsell}
                            className={`shrink-0 text-xs rounded-lg px-3 py-1.5 font-body font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                              isSuccessUpsell
                                ? 'bg-[oklch(0.48_0.14_145)] text-white'
                                : 'bg-[oklch(0.58_0.13_45)] text-white hover:bg-[oklch(0.52_0.12_45)]'
                            }`}
                          >
                            {isAddingUpsell ? (
                              <svg className="spinner-icon" width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                              </svg>
                            ) : isSuccessUpsell ? (
                              <span className="success-pop inline-flex"><Check size={11} strokeWidth={3} /></span>
                            ) : (
                              '+'
                            )}
                            {isAddingUpsell ? '' : isSuccessUpsell ? 'Added!' : 'Add'}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                )}
                {/* Saved for Later */}
                {wishlist.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[oklch(0.88_0.02_80)]">
                    <p className="text-xs font-body font-semibold text-[oklch(0.52_0.04_55)] uppercase tracking-wide mb-3">Saved for later ({wishlist.length})</p>
                    <div className="space-y-2">
                      {wishlist.map(item => (
                        <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-3">
                          <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)] truncate">{item.name}</p>
                            <p className="text-xs text-[oklch(0.52_0.04_55)] font-body italic truncate">{item.flavor}</p>
                            <p className="text-xs font-body font-bold text-[oklch(0.22_0.04_55)] mt-0.5">${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <button
                                onClick={() => moveToCart(item.id)}
                                className="text-[10px] font-body font-semibold text-[oklch(0.58_0.13_45)] hover:text-[oklch(0.42_0.10_45)] underline underline-offset-2 transition-colors"
                              >
                                Move to cart
                              </button>
                              <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="text-[10px] font-body text-[oklch(0.62_0.04_55)] hover:text-red-500 underline underline-offset-2 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Footer - Order summary + CTA */}
          {hasItems && (
            <div className="border-t border-[oklch(0.88_0.02_80)] bg-white flex flex-col">
              {/* Scrollable totals area */}
              <div className="px-5 py-4 space-y-3">
                {/* Free shipping progress / unlocked banner */}
                {shipping > 0 ? (
                  <div>
                    <div className="flex justify-between text-xs font-body mb-1">
                      <span className="text-[oklch(0.52_0.04_55)]">
                        Add ${(50 - subtotal).toFixed(2)} for free shipping
                      </span>
                      <span className="text-[oklch(0.58_0.13_45)] font-semibold">{Math.round((subtotal / 50) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-[oklch(0.92_0.02_80)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[oklch(0.58_0.13_45)] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="banner-slide-in flex items-center gap-2 text-xs font-body font-semibold bg-[oklch(0.94_0.06_145)] text-[oklch(0.35_0.10_145)] rounded-lg px-3 py-2">
                    <Truck size={13} />
                    <span>🎉 Free shipping unlocked!</span>
                  </div>
                )}

                {/* GWP tier — unlocked at $75 */}
                {gwpBannerVisible && (
                  <div className="banner-slide-in flex items-center gap-2.5 bg-[oklch(0.96_0.04_80)] border border-[oklch(0.82_0.08_80)] rounded-lg px-3 py-2.5">
                    <span className="text-lg">🎁</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-body font-bold text-[oklch(0.22_0.04_55)] leading-tight">Free Luma Glow Sample added!</p>
                      <p className="text-[10px] font-body text-[oklch(0.52_0.04_55)] leading-tight mt-0.5">Complimentary with orders over $75</p>
                    </div>
                    <button
                      onClick={() => setGwpBannerVisible(false)}
                      className="text-[oklch(0.62_0.04_55)] hover:text-[oklch(0.42_0.04_55)] transition-colors shrink-0"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* GWP progress — show when between $50 and $75 */}
                {shipping === 0 && !gwpUnlocked && (
                  <div>
                    <div className="flex justify-between text-xs font-body mb-1">
                      <span className="text-[oklch(0.52_0.04_55)]">Add ${(75 - subtotal).toFixed(2)} for a free sample</span>
                      <span className="text-[oklch(0.58_0.13_45)] font-semibold">{Math.round(((subtotal - 50) / 25) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-[oklch(0.92_0.02_80)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[oklch(0.72_0.12_80)] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(((subtotal - 50) / 25) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-1.5 text-sm font-body">
                  <div className="flex justify-between text-[oklch(0.52_0.04_55)]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[oklch(0.52_0.04_55)]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-[oklch(0.42_0.08_150)] font-semibold">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[oklch(0.22_0.04_55)] text-base pt-1 border-t border-[oklch(0.92_0.02_80)]">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Sticky checkout footer — always visible at bottom of drawer */}
              <div className="sticky bottom-0 bg-white border-t border-[oklch(0.88_0.02_80)] px-5 py-4 space-y-3">
                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 text-[10px] text-[oklch(0.52_0.04_55)] font-body">
                  <span className="flex items-center gap-1"><Lock size={10} /> Secure checkout</span>
                  <span className="flex items-center gap-1"><RefreshCw size={10} /> Cancel anytime</span>
                  <span className="flex items-center gap-1"><Shield size={10} /> Quality guaranteed</span>
                </div>
                {/* Checkout CTA */}
                <button
                  key={glowPulse ? 'glow' : 'idle'}
                  onClick={() => { setIsOpen(false); setCheckoutOpen(true); }}
                  className={`btn-primary w-full justify-center py-4 text-base transition-all ${
                    glowPulse ? 'checkout-glow-pulse' : ''
                  }`}
                >
                  Checkout — ${orderTotal.toFixed(2)} <ArrowRight size={16} className="ml-1" />
                </button>
                {/* Payment icons */}
                <div className="flex items-center justify-center gap-2">
                  {["VISA", "MC", "AMEX", "PAYPAL", "APPLE"].map(brand => (
                    <span key={brand} className="text-[9px] font-body font-bold text-[oklch(0.62_0.04_55)] bg-[oklch(0.92_0.02_80)] rounded px-1.5 py-0.5">{brand}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        total={orderTotal}
      />
    </>
  );
}

// ─── Checkout Modal ─────────────────────────────────────────────────────────────
type CheckoutStep = "summary" | "shipping" | "payment" | "confirmation";

function CheckoutModal({ open, onClose, items: cartItems, total }: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
}) {
  const { addToCart, addingId, successId } = useCart();
  const [step, setStep] = useState<CheckoutStep>("summary");

  // ── sessionStorage persistence ────────────────────────────────────────────
  const SS_KEY = "luma_checkout_form";
  const [form, setForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SS_KEY);
      if (saved) return JSON.parse(saved) as { email: string; firstName: string; lastName: string; address: string; city: string; state: string; zip: string; cardNumber: string; expiry: string; cvv: string; nameOnCard: string; };
    } catch { /* ignore */ }
    return { email: "", firstName: "", lastName: "", address: "", city: "", state: "", zip: "", cardNumber: "", expiry: "", cvv: "", nameOnCard: "" };
  });

  // Persist form to sessionStorage on every change (skip sensitive card fields)
  useEffect(() => {
    const { cardNumber, cvv, ...safe } = form;
    try { sessionStorage.setItem(SS_KEY, JSON.stringify({ ...safe, cardNumber: "", cvv: "" })); } catch { /* ignore */ }
  }, [form]);

  // ── refs for card formatter focus chaining ────────────────────────────────
  const expiryRef   = useRef<HTMLInputElement>(null);
  const cvvRef      = useRef<HTMLInputElement>(null);
  const addressRef  = useRef<HTMLInputElement>(null);

  // ── card network detector ─────────────────────────────────────────────────
  const detectCardNetwork = (num: string): "visa" | "mastercard" | "amex" | "discover" | null => {
    const d = num.replace(/\s/g, "");
    if (/^4/.test(d)) return "visa";
    if (/^5[1-5]|^2[2-7]/.test(d)) return "mastercard";
    if (/^3[47]/.test(d)) return "amex";
    if (/^6(?:011|5)/.test(d)) return "discover";
    return null;
  };
  const cardNetwork = detectCardNetwork(form.cardNumber);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmEmailSubmitted, setConfirmEmailSubmitted] = useState(false);
   const [confirmEmailError, setConfirmEmailError] = useState("");

  // ── Post-purchase upsell modal state ──────────────────────────────────────────────────
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [upsellAccepted, setUpsellAccepted] = useState(false);
  const [upsellAdding, setUpsellAdding] = useState(false);
  const [upsellSecondsLeft, setUpsellSecondsLeft] = useState(180); // 3-minute offer window

  // ── Loyalty points (Smile.io) ─────────────────────────────────────────────────────────────────
  const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null); // null = loading
  const [loyaltyFetched, setLoyaltyFetched] = useState(false);

  // ── Promo code state ─────────────────────────────────────────────────────────
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; pct: number; type: "percentage" | "fixed" } | null>(null);

  /**
   * Validate a promo code against the Shopify Discount Codes API.
   *
   * In production this call goes through a thin backend proxy that adds the
   * Shopify Admin API token (never expose the token on the frontend):
   *
   *   POST /api/validate-promo  { code: "LUMA10" }
   *   → { valid: true,  pct: 10, type: "percentage" }
   *   → { valid: false, message: "Invalid or expired code" }
   *
   * The proxy route calls:
   *   GET /admin/api/2024-01/discount_codes/lookup.json?code=LUMA10
   * then resolves the parent price_rule to get value_type + value.
   *
   * While the backend is not yet wired, the function falls back to a local
   * lookup table so the UI remains fully functional in the demo environment.
   */
  const PROMO_FALLBACK: Record<string, { pct: number; type: "percentage" | "fixed" }> = {
    LUMA10: { pct: 10, type: "percentage" },
    LUMA15: { pct: 15, type: "percentage" },
    LUMA20: { pct: 20, type: "percentage" },
    WELCOME: { pct: 10, type: "percentage" },
  };

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromoError("Enter a promo code"); return; }
    setPromoLoading(true);
    setPromoError("");
    try {
      // Attempt real API call first (works once the proxy route is deployed)
      const res = await fetch("/api/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json() as { valid: boolean; pct?: number; type?: "percentage" | "fixed"; message?: string };
        if (data.valid && data.pct) {
          setAppliedPromo({ code, pct: data.pct, type: data.type ?? "percentage" });
        } else {
          setPromoError(data.message ?? "Invalid or expired code");
        }
        return;
      }
    } catch {
      // API not yet available — fall through to local lookup
    } finally {
      setPromoLoading(false);
    }
    // Local fallback (demo / pre-production)
    const fallback = PROMO_FALLBACK[code];
    if (fallback) {
      setAppliedPromo({ code, ...fallback });
    } else {
      setPromoError("Invalid or expired code");
    }
  };

  // ── Redeem points state ──────────────────────────────────────────────────────────────────────────
  const [redeemPointsOpen, setRedeemPointsOpen] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  // 100 points = $5 off (configurable)
  const POINTS_PER_DOLLAR = 20; // 100 pts / $5
  const availablePoints = loyaltyPoints ?? 150;
  const maxRedeemablePoints = Math.min(availablePoints, Math.floor(total * POINTS_PER_DOLLAR));
  const pointsDiscount = +(pointsToRedeem / POINTS_PER_DOLLAR).toFixed(2);

  // Derived total after promo + points discount
  const discountedTotal = +Math.max(
    0,
    (appliedPromo ? total * (1 - appliedPromo.pct / 100) : total) - pointsDiscount
  ).toFixed(2);

  // ── Klaviyo helper ────────────────────────────────────────────────────────
  const klaviyoCapture = (email: string) => {
    try {
      // Klaviyo browser SDK (loaded via Shopify theme)
      if (typeof window !== "undefined" && (window as any)._learnq) {
        (window as any)._learnq.push(["identify", { $email: email }]);
      }
      // Fallback: POST to Shopify Flow webhook (configure SHOPIFY_FLOW_WEBHOOK_URL in theme settings)
      const webhookUrl = (window as any).__LUMA_KLAVIYO_WEBHOOK__;
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source: "checkout_confirmation", discount: "LUMA10" }),
        }).catch(() => { /* silent fail */ });
      }
    } catch { /* silent fail */ }
  };

  // ── Klaviyo "Checkout Started" event ──────────────────────────────────────
  useEffect(() => {
    if (!open || cartItems.length === 0) return;
    try {
      if (typeof window !== "undefined" && (window as any)._learnq) {
        (window as any)._learnq.push(["track", "Checkout Started", {
          $value: total,
          ItemNames: cartItems.map(i => i.name),
          Items: cartItems.map(i => ({
            ProductName: i.name,
            Quantity: i.qty,
            ItemPrice: i.subscribe ? +(i.price * 0.85).toFixed(2) : i.price,
            RowTotal: i.subscribe ? +(i.price * 0.85 * i.qty).toFixed(2) : +(i.price * i.qty).toFixed(2),
            Subscribe: i.subscribe ?? false,
          })),
          CheckoutURL: window.location.href,
        }]);
      }
    } catch { /* silent fail */ }
  }, [open, cartItems.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Post-purchase upsell: show modal 800ms after confirmation renders ────────────
  useEffect(() => {
    if (step !== "confirmation" || upsellAccepted) return;
    const timer = setTimeout(() => { setShowUpsellModal(true); setUpsellSecondsLeft(180); }, 800);
    return () => clearTimeout(timer);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Upsell countdown tick ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showUpsellModal) return;
    if (upsellSecondsLeft <= 0) { setShowUpsellModal(false); return; }
    const tick = setInterval(() => setUpsellSecondsLeft(s => {
      if (s <= 1) { setShowUpsellModal(false); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(tick);
   }, [showUpsellModal, upsellSecondsLeft]);

  // ── Smile.io loyalty points fetch ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Fetch once when the confirmation step renders and we have an email
    if (step !== "confirmation" || loyaltyFetched || !form.email) return;
    setLoyaltyFetched(true);
    (async () => {
      try {
        /**
         * Smile.io REST API — fetch customer points balance.
         * Backend proxy route: GET /api/loyalty-balance?email={email}
         * The proxy calls: GET https://api.smile.io/v1/customers?email={email}
         * with the SMILE_API_KEY secret header.
         *
         * While the backend is not deployed, the call will 404 and we fall
         * through to the demo value of 150 points.
         */
        const res = await fetch(
          `/api/loyalty-balance?email=${encodeURIComponent(form.email)}`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (res.ok) {
          const data = await res.json();
          setLoyaltyPoints(typeof data.points === "number" ? data.points : 150);
        } else {
          setLoyaltyPoints(150); // demo fallback
        }
      } catch {
        setLoyaltyPoints(150); // demo fallback
      }
    })();
  }, [step, form.email, loyaltyFetched]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Google Maps Places Autocomplete on Street Address ────────────────────────
  const FORGE_API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY as string;
  const FORGE_BASE_URL = (import.meta.env.VITE_FRONTEND_FORGE_API_URL as string) || "https://forge.butterfly-effect.dev";
  const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

  useEffect(() => {
    if (step !== "shipping") return;
    let autocomplete: google.maps.places.Autocomplete | null = null;
    let listener: google.maps.MapsEventListener | null = null;

    const initAutocomplete = () => {
      if (!addressRef.current || !window.google?.maps?.places) return;
      autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["address_components", "formatted_address"],
      });
      listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete!.getPlace();
        if (!place.address_components) return;
        let streetNumber = "", route = "", city = "", state = "", zip = "";
        for (const comp of place.address_components) {
          const t = comp.types;
          if (t.includes("street_number")) streetNumber = comp.long_name;
          else if (t.includes("route")) route = comp.long_name;
          else if (t.includes("locality")) city = comp.long_name;
          else if (t.includes("administrative_area_level_1")) state = comp.short_name;
          else if (t.includes("postal_code")) zip = comp.long_name;
        }
        setForm(f => ({
          ...f,
          address: streetNumber ? `${streetNumber} ${route}` : (place.formatted_address ?? f.address),
          city,
          state,
          zip,
        }));
        setTouched(t => ({ ...t, address: true, city: true, state: true, zip: true }));
      });
    };

    if (window.google?.maps?.places) {
      initAutocomplete();
    } else {
      // Load Maps script if not already present
      if (!document.querySelector(`script[src*="${MAPS_PROXY_URL}"]`)) {
        const script = document.createElement("script");
        script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${FORGE_API_KEY}&v=weekly&libraries=places`;
        script.async = true;
        script.crossOrigin = "anonymous";
        script.onload = initAutocomplete;
        document.head.appendChild(script);
      } else {
        // Script tag exists but google not ready yet — poll briefly
        const poll = setInterval(() => {
          if (window.google?.maps?.places) { clearInterval(poll); initAutocomplete(); }
        }, 100);
        setTimeout(() => clearInterval(poll), 5000);
      }
    }

    return () => {
      if (listener) window.google?.maps?.event?.removeListener(listener);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const validateShipping = (f: typeof form) => {
    const errs: Record<string, string> = {};
    if (!f.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = "Enter a valid email";
    if (!f.firstName.trim()) errs.firstName = "First name is required";
    if (!f.lastName.trim()) errs.lastName = "Last name is required";
    if (!f.address.trim()) errs.address = "Street address is required";
    if (!f.city.trim()) errs.city = "City is required";
    if (!f.state.trim()) errs.state = "State is required";
    if (!f.zip.trim()) errs.zip = "ZIP is required";
    else if (!/^\d{5}(-\d{4})?$/.test(f.zip.trim())) errs.zip = "Enter a valid ZIP";
    return errs;
  };

  const validatePayment = (f: typeof form) => {
    const errs: Record<string, string> = {};
    if (!f.nameOnCard.trim()) errs.nameOnCard = "Name on card is required";
    if (!f.cardNumber.trim()) errs.cardNumber = "Card number is required";
    else if (f.cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter a valid 16-digit card number";
    if (!f.expiry.trim()) errs.expiry = "Expiry is required";
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.expiry.trim())) errs.expiry = "Use MM / YY format";
    if (!f.cvv.trim()) errs.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(f.cvv.trim())) errs.cvv = "Enter 3 or 4 digits";
    return errs;
  };

  const handleReset = () => {
    setStep("summary");
    setForm({ email: "", firstName: "", lastName: "", address: "", city: "", state: "", zip: "", cardNumber: "", expiry: "", cvv: "", nameOnCard: "" });
    setTouched({});
    setFormErrors({});
    setConfirmEmail("");
    setConfirmEmailSubmitted(false);
    setConfirmEmailError("");
  };

  const STEPS: CheckoutStep[] = ["summary", "shipping", "payment", "confirmation"];
  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  const stepLabels: Record<CheckoutStep, string> = {
    summary: "Order Summary",
    shipping: "Shipping",
    payment: "Payment",
    confirmation: "Confirmed!",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); handleReset(); } }}>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden rounded-2xl border-0 shadow-2xl max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">Secure Checkout</DialogTitle>
        {/* Header */}
        <div className="bg-[oklch(0.22_0.04_55)] px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[oklch(0.58_0.13_45)] flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">L</span>
              </div>
              <span className="font-display font-bold text-white text-sm">Luma Daily</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-body">
              <Lock size={11} />
              <span>Secure checkout</span>
            </div>
          </div>
          {/* Step indicators */}
          <div className="flex items-center gap-1">
            {STEPS.filter(s => s !== "confirmation").map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  stepIndex > i ? "bg-[oklch(0.58_0.13_45)] text-white" :
                  stepIndex === i ? "bg-white text-[oklch(0.22_0.04_55)]" :
                  "bg-white/20 text-white/50"
                }`}>
                  {stepIndex > i ? <Check size={10} /> : i + 1}
                </div>
                <span className={`text-[10px] font-body font-semibold ${stepIndex >= i ? "text-white" : "text-white/40"}`}>
                  {stepLabels[s]}
                </span>
                {i < 2 && <div className={`flex-1 h-px mx-1 ${stepIndex > i ? "bg-[oklch(0.58_0.13_45)]" : "bg-white/20"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[oklch(0.975_0.015_80)]">
          {step === "summary" && (
            <div className="p-5 space-y-4">
              <h3 className="font-display font-bold text-lg text-[oklch(0.22_0.04_55)]">Review your order</h3>
              {cartItems.map(item => {
                const price = item.subscribe ? item.price * 0.85 : item.price;
                return (
                  <div key={item.id} className="flex gap-3 bg-white rounded-xl p-3 border border-[oklch(0.88_0.02_80)]">
                    <img src={item.img} alt={item.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                    <div className="flex-1">
                      <p className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)]">{item.name}</p>
                      <p className="text-xs text-[oklch(0.62_0.04_55)] font-body italic">{item.flavor}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[oklch(0.52_0.04_55)] font-body">Qty: {item.qty}</span>
                        {item.subscribe && <span className="text-xs text-[oklch(0.58_0.13_45)] font-body font-semibold">Subscribe (15% off)</span>}
                      </div>
                    </div>
                    <span className="font-body font-bold text-sm text-[oklch(0.22_0.04_55)]">${(price * item.qty).toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-4 space-y-2 text-sm font-body">
                <div className="flex justify-between text-[oklch(0.52_0.04_55)]">
                  <span>Subtotal</span>
                  <span>${cartItems.reduce((s, i) => s + (i.subscribe ? i.price * 0.85 : i.price) * i.qty, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[oklch(0.52_0.04_55)]">
                  <span>Shipping</span>
                  <span className="text-[oklch(0.42_0.08_150)] font-semibold">FREE</span>
                </div>

                {/* Promo code row */}
                <div className="pt-1">
                  {!appliedPromo ? (
                    <>
                      <button
                        onClick={() => setPromoOpen(o => !o)}
                        className="text-xs text-[oklch(0.52_0.08_45)] font-body font-semibold flex items-center gap-1 hover:text-[oklch(0.42_0.08_45)] transition-colors"
                      >
                        <span className="text-base leading-none">{promoOpen ? "−" : "+"}</span>
                        Have a promo code?
                      </button>
                      {promoOpen && (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter code"
                            value={promoInput}
                            onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                            onKeyDown={e => e.key === "Enter" && applyPromo()}
                            className={`flex-1 border rounded-lg px-3 py-2 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white uppercase tracking-widest ${
                              promoError ? "border-red-400" : "border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]"
                            }`}
                          />
                          <button
                            onClick={applyPromo}
                            disabled={promoLoading}
                            className="shrink-0 bg-[oklch(0.22_0.04_55)] text-white text-sm font-body font-semibold rounded-lg px-4 py-2 hover:bg-[oklch(0.32_0.04_55)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                          >
                            {promoLoading ? (
                              <>
                                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Checking…
                              </>
                            ) : "Apply"}
                          </button>
                        </div>
                      )}
                      {promoError && <span className="text-red-500 text-xs mt-1 block">{promoError}</span>}
                    </>
                  ) : (
                    <div className="flex items-center justify-between bg-[oklch(0.94_0.04_150)] rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Check size={13} className="text-[oklch(0.42_0.08_150)]" strokeWidth={3} />
                        <span className="text-xs font-body font-semibold text-[oklch(0.32_0.08_150)]">
                          {appliedPromo.code} — {appliedPromo.pct}% off
                        </span>
                      </div>
                      <button
                        onClick={() => { setAppliedPromo(null); setPromoInput(""); setPromoOpen(false); }}
                        className="text-[oklch(0.52_0.08_150)] text-xs font-body hover:text-[oklch(0.32_0.08_150)] transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-[oklch(0.42_0.08_150)] font-semibold">
                    <span>Discount ({appliedPromo.pct}%)</span>
                    <span>-${(appliedPromo ? +(total * appliedPromo.pct / 100).toFixed(2) : 0).toFixed(2)}</span>
                  </div>
                )}
                {/* Redeem points row */}
                <div className="pt-1">
                  {pointsToRedeem === 0 ? (
                    <button
                      onClick={() => setRedeemPointsOpen(o => !o)}
                      className="text-xs text-[oklch(0.52_0.08_45)] font-body font-semibold flex items-center gap-1 hover:text-[oklch(0.42_0.08_45)] transition-colors"
                    >
                      <span className="text-base leading-none">{redeemPointsOpen ? "−" : "+"}</span>
                      Redeem points ({availablePoints} available)
                    </button>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-body font-semibold text-[oklch(0.42_0.08_150)]">Points redeemed: {pointsToRedeem} pts = -${pointsDiscount.toFixed(2)}</span>
                      <button
                        onClick={() => { setPointsToRedeem(0); setRedeemPointsOpen(false); }}
                        className="text-[oklch(0.52_0.08_150)] text-xs font-body hover:text-[oklch(0.32_0.08_150)] transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {redeemPointsOpen && pointsToRedeem === 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-body text-[oklch(0.62_0.04_55)]">
                        <span>0 pts</span>
                        <span>{maxRedeemablePoints} pts max</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={maxRedeemablePoints}
                        step={20}
                        value={pointsToRedeem}
                        onChange={e => setPointsToRedeem(Number(e.target.value))}
                        className="w-full accent-[oklch(0.58_0.13_45)]"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-body text-[oklch(0.52_0.04_55)]">
                          {pointsToRedeem} pts = <span className="font-semibold text-[oklch(0.42_0.08_150)]">-${(pointsToRedeem / POINTS_PER_DOLLAR).toFixed(2)}</span>
                        </span>
                        <button
                          disabled={pointsToRedeem === 0}
                          onClick={() => setRedeemPointsOpen(false)}
                          className="text-xs font-body font-semibold bg-[oklch(0.22_0.04_55)] text-white rounded-lg px-3 py-1.5 hover:bg-[oklch(0.32_0.04_55)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {pointsToRedeem > 0 && (
                  <div className="flex justify-between text-[oklch(0.42_0.08_150)] font-semibold">
                    <span>Points discount</span>
                    <span>-${pointsDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[oklch(0.22_0.04_55)] text-base pt-2 border-t border-[oklch(0.92_0.02_80)]">
                  <span>Total</span>
                  <div className="text-right">
                    {(appliedPromo || pointsToRedeem > 0) && (
                      <span className="text-xs text-[oklch(0.62_0.04_55)] line-through block font-normal">${total.toFixed(2)}</span>
                    )}
                    <span>${discountedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "shipping" && (
            <div className="p-5 space-y-4">
              {/* Order mini-summary */}
              <div className="bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {cartItems.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.img} alt={item.name} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    ))}
                  </div>
                  <span className="text-xs font-body text-[oklch(0.42_0.04_55)]">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="text-right">
                  {appliedPromo && (
                    <span className="text-[10px] font-body text-[oklch(0.42_0.08_150)] font-semibold block">{appliedPromo.pct}% off applied</span>
                  )}
                  <span className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)]">${discountedTotal.toFixed(2)}</span>
                </div>
              </div>
              {/* Contact */}
              <div>
                <p className="text-xs font-body font-semibold text-[oklch(0.52_0.04_55)] uppercase tracking-wide mb-2">Contact</p>
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${
                    touched.email && formErrors.email ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'
                  }`}
                />
                {touched.email && formErrors.email && <span className="text-red-500 text-xs mt-1 block">{formErrors.email}</span>}
              </div>
              {/* Delivery address */}
              <div>
                <p className="text-xs font-body font-semibold text-[oklch(0.52_0.04_55)] uppercase tracking-wide mb-2">Delivery address</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input type="text" placeholder="First name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} onBlur={() => setTouched(t => ({ ...t, firstName: true }))} className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${touched.firstName && formErrors.firstName ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'}`} />
                      {touched.firstName && formErrors.firstName && <span className="text-red-500 text-xs mt-1 block">{formErrors.firstName}</span>}
                    </div>
                    <div>
                      <input type="text" placeholder="Last name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} onBlur={() => setTouched(t => ({ ...t, lastName: true }))} className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${touched.lastName && formErrors.lastName ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'}`} />
                      {touched.lastName && formErrors.lastName && <span className="text-red-500 text-xs mt-1 block">{formErrors.lastName}</span>}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      ref={addressRef}
                      type="text"
                      placeholder="Street address"
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      onBlur={() => setTouched(t => ({ ...t, address: true }))}
                      autoComplete="off"
                      className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${touched.address && formErrors.address ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'}`}
                    />
                    {touched.address && formErrors.address && <span className="text-red-500 text-xs mt-1 block">{formErrors.address}</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <input type="text" placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} onBlur={() => setTouched(t => ({ ...t, city: true }))} className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${touched.city && formErrors.city ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'}`} />
                      {touched.city && formErrors.city && <span className="text-red-500 text-xs mt-1 block">{formErrors.city}</span>}
                    </div>
                    <div>
                      <input type="text" placeholder="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} onBlur={() => setTouched(t => ({ ...t, state: true }))} className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${touched.state && formErrors.state ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'}`} />
                      {touched.state && formErrors.state && <span className="text-red-500 text-xs mt-1 block">{formErrors.state}</span>}
                    </div>
                    <div>
                      <input type="text" placeholder="ZIP" value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} onBlur={() => setTouched(t => ({ ...t, zip: true }))} className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${touched.zip && formErrors.zip ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'}`} />
                      {touched.zip && formErrors.zip && <span className="text-red-500 text-xs mt-1 block">{formErrors.zip}</span>}
                    </div>
                  </div>
                </div>
              </div>
              {/* Shipping method */}
              <div>
                <p className="text-xs font-body font-semibold text-[oklch(0.52_0.04_55)] uppercase tracking-wide mb-2">Shipping method</p>
                <div className="space-y-2">
                  {[
                    { id: "standard", label: "Standard Shipping", eta: "3–5 business days", price: total >= 50 ? "FREE" : "$5.99" },
                    { id: "express", label: "Express Shipping", eta: "1–2 business days", price: "$12.99" },
                  ].map((method) => (
                    <label key={method.id} className="flex items-center justify-between bg-white border-2 rounded-xl p-3.5 cursor-pointer transition-all border-[oklch(0.88_0.02_80)] hover:border-[oklch(0.78_0.04_80)]">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value={method.id} defaultChecked={method.id === "standard"} className="accent-[oklch(0.58_0.13_45)]" />
                        <div>
                          <p className="text-sm font-body font-semibold text-[oklch(0.22_0.04_55)]">{method.label}</p>
                          <p className="text-xs text-[oklch(0.62_0.04_55)] font-body">{method.eta}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-body font-bold ${method.price === "FREE" ? "text-[oklch(0.48_0.14_145)]" : "text-[oklch(0.22_0.04_55)]"}`}>{method.price}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Trust row */}
              <div className="flex items-center justify-center gap-4 flex-wrap pt-1">
                {[
                  { icon: <Truck size={13} />, label: "Free over $50" },
                  { icon: <Shield size={13} />, label: "30-day returns" },
                  { icon: <Lock size={13} />, label: "Secure checkout" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-1.5 text-[oklch(0.52_0.04_55)]">
                    {t.icon}
                    <span className="text-[11px] font-body">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="p-5 space-y-4">
              {/* Order mini-badge */}
              <div className="bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {cartItems.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.img} alt={item.name} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    ))}
                  </div>
                  <span className="text-xs font-body text-[oklch(0.42_0.04_55)]">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="text-right">
                  {appliedPromo && (
                    <span className="text-[10px] font-body text-[oklch(0.42_0.08_150)] font-semibold block">{appliedPromo.pct}% off applied</span>
                  )}
                  <span className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)]">${discountedTotal.toFixed(2)}</span>
                </div>
              </div>
              {/* Express pay */}
              <div>
                <p className="text-xs font-body font-semibold text-[oklch(0.52_0.04_55)] uppercase tracking-wide mb-2">Express checkout</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: " Pay", bg: "#000", color: "#fff", prefix: "" },
                    { label: " Pay", bg: "#4285F4", color: "#fff", prefix: "G" },
                    { label: "PayPal", bg: "#003087", color: "#fff", prefix: "" },
                  ].map((btn) => (
                    <button key={btn.label + btn.prefix} className="py-3 rounded-xl text-sm font-bold flex items-center justify-center" style={{ backgroundColor: btn.bg, color: btn.color }}>
                      {btn.prefix}{btn.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-[oklch(0.88_0.02_80)]" />
                  <span className="text-xs font-body text-[oklch(0.62_0.04_55)]">or pay by card</span>
                  <div className="flex-1 h-px bg-[oklch(0.88_0.02_80)]" />
                </div>
              </div>
              {/* Security badge */}
              <div className="bg-[oklch(0.94_0.04_80)] border border-[oklch(0.88_0.08_80)] rounded-xl p-3 flex items-center gap-2 text-sm font-body text-[oklch(0.42_0.04_55)]">
                <Lock size={14} className="text-[oklch(0.58_0.13_45)] shrink-0" />
                <span>256-bit SSL encryption. Your payment info is never stored.</span>
              </div>
              {/* Card fields */}
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={form.nameOnCard}
                    onChange={e => setForm(f => ({ ...f, nameOnCard: e.target.value }))}
                    onBlur={() => setTouched(t => ({ ...t, nameOnCard: true }))}
                    className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${touched.nameOnCard && formErrors.nameOnCard ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'}`}
                  />
                  {touched.nameOnCard && formErrors.nameOnCard && <span className="text-red-500 text-xs mt-1 block">{formErrors.nameOnCard}</span>}
                </div>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={form.cardNumber}
                      maxLength={19}
                      onChange={e => {
                        // Strip non-digits, insert space every 4 chars
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                        setForm(f => ({ ...f, cardNumber: formatted }));
                        // Auto-advance to expiry when 16 digits entered
                        if (digits.length === 16) {
                          setTimeout(() => expiryRef.current?.focus(), 0);
                        }
                      }}
                      onBlur={() => setTouched(t => ({ ...t, cardNumber: true }))}
                      className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white pr-12 tracking-widest ${touched.cardNumber && formErrors.cardNumber ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'}`}
                    />
                    {/* Card network icon */}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                      {cardNetwork === "visa" && (
                        <svg viewBox="0 0 48 16" width="36" height="12" aria-label="Visa">
                          <rect width="48" height="16" rx="3" fill="#1A1F71"/>
                          <path d="M18.5 11.8h-2.1L17.8 4h2.1L18.5 11.8zm8.6-7.6c-.4-.2-1.1-.4-1.9-.4-2.1 0-3.6 1.1-3.6 2.7 0 1.2 1.1 1.8 1.9 2.2.8.4 1.1.7 1.1 1.1 0 .6-.7.9-1.3.9-.9 0-1.3-.1-2-.4l-.3-.1-.3 1.7c.5.2 1.4.4 2.3.4 2.2 0 3.7-1.1 3.7-2.8 0-.9-.6-1.6-1.9-2.2-.8-.4-1.3-.6-1.3-1 0-.3.4-.7 1.3-.7.7 0 1.3.1 1.7.3l.2.1.3-1.8zm5.3 0h-1.6c-.5 0-.9.1-1.1.7l-3.1 7.1h2.2l.4-1.2h2.7l.3 1.2h2L32.4 4.2zm-2.6 5.1l.8-2.2.5 2.2h-1.3zm-14.6-5.1l-2.1 5.2-.2-1.1c-.4-1.3-1.6-2.7-3-3.4l1.9 6.9h2.2l3.3-7.6h-2.1z" fill="#fff"/>
                        </svg>
                      )}
                      {cardNetwork === "mastercard" && (
                        <svg viewBox="0 0 48 30" width="36" height="22" aria-label="Mastercard">
                          <rect width="48" height="30" rx="4" fill="#252525"/>
                          <circle cx="18" cy="15" r="9" fill="#EB001B"/>
                          <circle cx="30" cy="15" r="9" fill="#F79E1B"/>
                          <path d="M24 8.3a9 9 0 0 1 0 13.4A9 9 0 0 1 24 8.3z" fill="#FF5F00"/>
                        </svg>
                      )}
                      {cardNetwork === "amex" && (
                        <svg viewBox="0 0 48 16" width="36" height="12" aria-label="American Express">
                          <rect width="48" height="16" rx="3" fill="#2E77BC"/>
                          <path d="M4 11.5V4.5h7.2l.9 2 .9-2H40v6.5l-1 1H4zm3.2-1.5h1.4l.5-1.2.5 1.2h1.4L9.8 7.5l1.2-2H9.6L9 6.8 8.4 5.5H7l1.2 2-1 2.5zm5.8 0h3.6V9H14v-.8h2.4V7H14v-.7h2.6V5.5H13v4.5zm4.5 0h1.4V7.5l1.2 3h1.1l1.2-3V10h1.4V5.5h-2l-1.1 2.8-1.1-2.8h-2.1V10zm7.5 0h1.4V8.8h.6l1.2 1.2h1.7l-1.4-1.4c.6-.2 1-.7 1-1.4 0-.9-.7-1.7-1.8-1.7H25V10zm1.4-2.5v-1h.9c.4 0 .6.2.6.5s-.2.5-.6.5H26.4zm4.6 2.5h1.4V5.5H31V10zm2.8 0h3.6V9h-2.2v-.8h2.4V7h-2.4v-.7h2.6V5.5h-4V10z" fill="#fff"/>
                        </svg>
                      )}
                      {cardNetwork === "discover" && (
                        <svg viewBox="0 0 48 16" width="36" height="12" aria-label="Discover">
                          <rect width="48" height="16" rx="3" fill="#fff" stroke="#e0e0e0"/>
                          <circle cx="32" cy="8" r="6" fill="#F76F20"/>
                          <path d="M5 5.5h2.2c1.8 0 3 1.1 3 2.5S9 10.5 7.2 10.5H5V5.5zm1.4 3.8h.7c.9 0 1.5-.5 1.5-1.3S8 6.7 7.1 6.7h-.7v2.6zm4.6-3.8h1.4V10.5H11V5.5zm3.2 3.5c.3.3.7.5 1.1.5.4 0 .7-.2.7-.5 0-.3-.2-.4-.8-.6-.9-.3-1.3-.7-1.3-1.3 0-.8.7-1.4 1.7-1.4.5 0 1 .1 1.4.4l-.5 1c-.3-.2-.6-.3-.9-.3-.3 0-.5.1-.5.4 0 .2.2.4.7.5.9.3 1.4.7 1.4 1.4 0 .9-.7 1.5-1.8 1.5-.6 0-1.2-.2-1.6-.6l.4-1zm3.8-3.5h1.4V10.5H18V5.5zm2.4 2.5c0-1.5 1.2-2.6 2.8-2.6.5 0 .9.1 1.3.3V7c-.3-.3-.8-.5-1.3-.5-.8 0-1.4.6-1.4 1.5s.6 1.5 1.4 1.5c.5 0 .9-.2 1.3-.5v1.3c-.4.2-.8.3-1.3.3-1.6 0-2.8-1.1-2.8-2.6z" fill="#231F20"/>
                        </svg>
                      )}
                      {!cardNetwork && <CreditCard size={18} className="text-[oklch(0.72_0.04_55)]" />}
                    </span>
                  </div>
                  {touched.cardNumber && formErrors.cardNumber && <span className="text-red-500 text-xs mt-1 block">{formErrors.cardNumber}</span>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      ref={expiryRef}
                      type="text"
                      inputMode="numeric"
                      placeholder="MM / YY"
                      value={form.expiry}
                      maxLength={7}
                      onChange={e => {
                        // Auto-format: insert " / " after 2 digits
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                        let formatted = raw;
                        if (raw.length >= 3) formatted = raw.slice(0, 2) + " / " + raw.slice(2);
                        else if (raw.length === 2 && form.expiry.length < 2) formatted = raw + " / ";
                        setForm(f => ({ ...f, expiry: formatted }));
                        // Auto-advance to CVV when 4 digits entered
                        if (raw.length === 4) {
                          setTimeout(() => cvvRef.current?.focus(), 0);
                        }
                      }}
                      onBlur={() => setTouched(t => ({ ...t, expiry: true }))}
                      className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${touched.expiry && formErrors.expiry ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'}`}
                    />
                    {touched.expiry && formErrors.expiry && <span className="text-red-500 text-xs mt-1 block">{formErrors.expiry}</span>}
                  </div>
                  <div>
                    <input
                      ref={cvvRef}
                      type="text"
                      inputMode="numeric"
                      placeholder="CVV"
                      value={form.cvv}
                      maxLength={4}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setForm(f => ({ ...f, cvv: digits }));
                      }}
                      onBlur={() => setTouched(t => ({ ...t, cvv: true }))}
                      className={`w-full border rounded-lg px-4 py-3 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${touched.cvv && formErrors.cvv ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'}`}
                    />
                    {touched.cvv && formErrors.cvv && <span className="text-red-500 text-xs mt-1 block">{formErrors.cvv}</span>}
                  </div>
                </div>
              </div>
              {/* Order total recap with line items */}
              <div className="bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-4 space-y-2">
                <p className="text-xs font-body font-semibold text-[oklch(0.52_0.04_55)] uppercase tracking-wide mb-2">Order summary</p>
                {cartItems.map(item => {
                  const price = item.subscribe ? item.price * 0.85 : item.price;
                  return (
                    <div key={item.id} className="flex items-center justify-between text-sm font-body">
                      <span className="text-[oklch(0.42_0.04_55)] truncate max-w-[200px]">{item.name} {item.qty > 1 ? `×${item.qty}` : ""}</span>
                      <span className="font-semibold text-[oklch(0.22_0.04_55)] shrink-0">${(price * item.qty).toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="border-t border-[oklch(0.88_0.02_80)] pt-2 flex justify-between items-center">
                  <span className="font-body font-bold text-sm text-[oklch(0.22_0.04_55)]">Total</span>
                   <div className="text-right">
                  {appliedPromo && (
                    <span className="text-[10px] font-body text-[oklch(0.42_0.08_150)] font-semibold block">{appliedPromo.pct}% off applied</span>
                  )}
                  <span className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)]">${discountedTotal.toFixed(2)}</span>
                </div>
                </div>
              </div>
              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {[
                  { icon: <Shield size={13} />, label: "30-day guarantee" },
                  { icon: <RefreshCw size={13} />, label: "Easy returns" },
                  { icon: <Truck size={13} />, label: "Fast shipping" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-1.5 text-[oklch(0.52_0.04_55)]">
                    {t.icon}
                    <span className="text-[11px] font-body">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "confirmation" && (
            <div className="p-5 space-y-5">
              {/* Confirmation header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[oklch(0.94_0.04_150)] flex items-center justify-center mx-auto">
                  <Check size={32} className="text-[oklch(0.42_0.08_150)]" />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl text-[oklch(0.22_0.04_55)] mb-1">Order Confirmed!</h3>
                  <p className="text-[oklch(0.52_0.04_55)] font-body text-sm leading-relaxed">
                    Thank you for starting your Luma Daily ritual. A confirmation email is on its way.
                  </p>
                </div>
              </div>
              {/* What's next */}
              <div className="bg-[oklch(0.975_0.015_80)] rounded-xl border border-[oklch(0.88_0.02_80)] p-4 text-left space-y-2">
                <p className="text-xs font-body font-semibold text-[oklch(0.52_0.04_55)] uppercase tracking-wide">What's next</p>
                {[
                  "Confirmation email sent to " + (form.email || "your inbox"),
                  "Ships within 1–2 business days",
                  "Arrives in 3–5 business days",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-body text-[oklch(0.32_0.04_55)]">
                    <div className="w-4 h-4 rounded-full bg-[oklch(0.58_0.13_45)] flex items-center justify-center shrink-0">
                      <Check size={9} className="text-white" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              {/* Email capture */}
              <div className="bg-[oklch(0.975_0.015_80)] rounded-xl border border-[oklch(0.88_0.02_80)] p-4 space-y-3">
                {confirmEmailSubmitted ? (
                  <div className="flex items-center gap-2 text-[oklch(0.42_0.08_150)]">
                    <div className="w-6 h-6 rounded-full bg-[oklch(0.94_0.04_150)] flex items-center justify-center shrink-0">
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-body font-semibold">Check your inbox!</span>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-display font-bold text-[oklch(0.22_0.04_55)]">Get your receipt + 10% off your next order</p>
                      <p className="text-xs font-body text-[oklch(0.52_0.04_55)] mt-0.5">We'll send your order confirmation and an exclusive discount.</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={confirmEmail}
                        onChange={e => { setConfirmEmail(e.target.value); setConfirmEmailError(""); }}
                        className={`flex-1 border rounded-lg px-3 py-2.5 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none bg-white ${
                          confirmEmailError ? 'border-red-400 focus:border-red-400' : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'
                        }`}
                      />
                      <button
                        onClick={() => {
                          if (!confirmEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(confirmEmail)) {
                            setConfirmEmailError("Enter a valid email");
                            return;
                          }
                          klaviyoCapture(confirmEmail);
                          setConfirmEmailSubmitted(true);
                        }}
                        className="shrink-0 bg-[oklch(0.58_0.13_45)] text-white text-sm font-body font-semibold rounded-lg px-4 py-2.5 hover:bg-[oklch(0.52_0.12_45)] transition-colors"
                      >
                        Send
                      </button>
                    </div>
                    {confirmEmailError && <span className="text-red-500 text-xs block">{confirmEmailError}</span>}
                  </>
                )}
              </div>
              {/* Referral share row */}
              <div className="bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-4">
                <p className="text-sm font-display font-bold text-[oklch(0.22_0.04_55)] mb-0.5">Share Luma Daily with a friend</p>
                <p className="text-xs font-body text-[oklch(0.52_0.04_55)] mb-3">They get 10% off their first order. You get 10% off your next.</p>
                {(() => {
                  const refName = (form.firstName || "friend").trim();
                  const refUrl = `https://lumadaily.com/?ref=${encodeURIComponent(refName)}`;
                  return (
                    <div className="flex gap-2">
                      <div className="flex-1 bg-[oklch(0.975_0.015_80)] border border-[oklch(0.88_0.02_80)] rounded-lg px-3 py-2 text-xs font-body text-[oklch(0.42_0.04_55)] truncate select-all">
                        {refUrl}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(refUrl).catch(() => {});
                          const el = document.getElementById("ref-copy-label");
                          if (el) { el.textContent = "Copied!"; setTimeout(() => { if (el) el.textContent = "Copy"; }, 2000); }
                        }}
                        className="shrink-0 bg-[oklch(0.22_0.04_55)] text-white text-xs font-body font-semibold rounded-lg px-3 py-2 hover:bg-[oklch(0.32_0.04_55)] transition-colors"
                      >
                        <span id="ref-copy-label">Copy</span>
                      </button>
                      {typeof navigator !== "undefined" && "share" in navigator && (
                        <button
                          onClick={() => navigator.share({ title: "Try Luma Daily", text: `${refName} thinks you'll love Luma Daily — get 10% off your first order!`, url: refUrl }).catch(() => {})}
                          className="shrink-0 bg-[oklch(0.58_0.13_45)] text-white text-xs font-body font-semibold rounded-lg px-3 py-2 hover:bg-[oklch(0.52_0.12_45)] transition-colors"
                        >
                          Share
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Loyalty points balance */}
              {(() => {
                // Points = $1 spent = 1 point; subscribe orders earn 1.5x
                const basePoints = Math.round(discountedTotal);
                const subscribeBonus = cartItems.some(i => i.subscribe) ? Math.round(basePoints * 0.5) : 0;
                const earnedPoints = basePoints + subscribeBonus;
                // Tier thresholds: Bronze 0, Silver 250, Gold 500, Platinum 1000
                const TIERS = [
                  { name: "Bronze", min: 0,   max: 250,  color: "oklch(0.62 0.08 55)",  bg: "oklch(0.94 0.04 55)" },
                  { name: "Silver", min: 250,  max: 500,  color: "oklch(0.52 0.04 240)", bg: "oklch(0.94 0.02 240)" },
                  { name: "Gold",   min: 500,  max: 1000, color: "oklch(0.72 0.12 85)",  bg: "oklch(0.96 0.04 85)" },
                  { name: "Platinum", min: 1000, max: 2000, color: "oklch(0.52 0.04 300)", bg: "oklch(0.94 0.02 300)" },
                ];
                // Use live Smile.io balance (falls back to 150 while API is not yet wired)
                const priorPoints = loyaltyPoints ?? 150;
                const totalPoints = priorPoints + earnedPoints;
                const tier = TIERS.find(t => totalPoints >= t.min && totalPoints < t.max) ?? TIERS[TIERS.length - 1];
                const nextTier = TIERS[TIERS.indexOf(tier) + 1];
                const pct = nextTier ? Math.min(100, Math.round(((totalPoints - tier.min) / (nextTier.min - tier.min)) * 100)) : 100;
                return (
                  <div className="bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-display font-bold text-[oklch(0.22_0.04_55)]">You earned {earnedPoints} Luma Points</p>
                        <p className="text-xs font-body text-[oklch(0.52_0.04_55)] mt-0.5">
                          {subscribeBonus > 0 && <span className="text-[oklch(0.58_0.13_45)] font-semibold">+{subscribeBonus} subscribe bonus · </span>}
                          {totalPoints} total points
                        </p>
                      </div>
                      <span
                        className="text-xs font-body font-bold rounded-full px-2.5 py-1 shrink-0"
                        style={{ color: tier.color, background: tier.bg }}
                      >
                        {tier.name}
                      </span>
                    </div>
                    {nextTier ? (
                      <>
                        <div className="flex justify-between text-[10px] font-body text-[oklch(0.62_0.04_55)] mb-1">
                          <span>{totalPoints} pts</span>
                          <span>{nextTier.name} at {nextTier.min} pts</span>
                        </div>
                        <div className="h-2 rounded-full bg-[oklch(0.92_0.02_80)] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: tier.color }}
                          />
                        </div>
                        <p className="text-[10px] font-body text-[oklch(0.62_0.04_55)] mt-1.5">
                          {nextTier.min - totalPoints} more points to {nextTier.name} — earn 2x points on your next order
                        </p>
                      </>
                    ) : (
                      <p className="text-xs font-body text-[oklch(0.52_0.04_55)]">You've reached Platinum status — enjoy free priority shipping on every order.</p>
                    )}
                  </div>
                );
              })()}

              {/* Complete Your Ritual upsell */}
              <div>
                <p className="text-xs font-body font-semibold text-[oklch(0.52_0.04_55)] uppercase tracking-wide mb-3">Complete your ritual</p>
                <div className="space-y-2">
                  {PRODUCTS.filter(p => !cartItems.some((ci: CartItem) => ci.id === p.name)).slice(0, 2).map(p => {
                    const isAdding = addingId === p.name;
                    const isSuccess = successId === p.name;
                    return (
                      <div key={p.name} className="flex items-center gap-3 bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-3">
                        <img src={p.img} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)] truncate">{p.name}</p>
                          <p className="text-xs text-[oklch(0.52_0.04_55)] font-body italic truncate">{p.tagline}</p>
                          <p className="text-xs font-body font-bold text-[oklch(0.22_0.04_55)] mt-0.5">${p.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => !isAdding && addToCart(p)}
                          disabled={isAdding}
                          className={`shrink-0 text-xs rounded-lg px-3 py-2 font-body font-semibold transition-all duration-200 flex items-center gap-1 ${
                            isSuccess
                              ? 'bg-[oklch(0.48_0.14_145)] text-white'
                              : 'bg-[oklch(0.58_0.13_45)] text-white hover:bg-[oklch(0.52_0.12_45)]'
                          }`}
                        >
                          {isAdding ? (
                            <svg className="spinner-icon" width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                          ) : isSuccess ? (
                            <Check size={11} strokeWidth={3} />
                          ) : (
                            <Plus size={11} strokeWidth={3} />
                          )}
                          {isAdding ? '' : isSuccess ? 'Added!' : 'Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => { onClose(); handleReset(); }}
                className="btn-primary w-full justify-center py-3"
              >
                Continue Shopping →
              </button>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {step !== "confirmation" && (
          <div className="bg-white border-t border-[oklch(0.88_0.02_80)] px-5 py-4">
            <button
              onClick={() => {
                if (step === "shipping") {
                  const errs = validateShipping(form);
                  if (Object.keys(errs).length > 0) {
                    setFormErrors(errs);
                    setTouched({ email: true, firstName: true, lastName: true, address: true, city: true, state: true, zip: true });
                    return;
                  }
                  setFormErrors({});
                }
                if (step === "payment") {
                  const errs = validatePayment(form);
                  if (Object.keys(errs).length > 0) {
                    setFormErrors(errs);
                    setTouched(t => ({ ...t, nameOnCard: true, cardNumber: true, expiry: true, cvv: true }));
                    return;
                  }
                  setFormErrors({});
                  // ── Klaviyo "Placed Order" event ───────────────────────────────
                  try {
                    if (typeof window !== "undefined" && (window as any)._learnq) {
                      (window as any)._learnq.push(["track", "Placed Order", {
                        $value: discountedTotal,
                        OrderId: `LUMA-${Date.now()}`,
                        ItemNames: cartItems.map(i => i.name),
                        Items: cartItems.map(i => ({
                          ProductName: i.name,
                          Quantity: i.qty,
                          ItemPrice: i.subscribe ? +(i.price * 0.85).toFixed(2) : i.price,
                          RowTotal: i.subscribe
                            ? +(i.price * 0.85 * i.qty).toFixed(2)
                            : +(i.price * i.qty).toFixed(2),
                          Subscribe: i.subscribe ?? false,
                        })),
                        PromoCode: appliedPromo?.code ?? null,
                        Discount: appliedPromo ? +(discountedTotal - total).toFixed(2) : 0,
                        BillingEmail: form.email,
                      }]);
                    }
                  } catch { /* silent fail */ }
                }
                const nextMap: Record<CheckoutStep, CheckoutStep> = {
                  summary: "shipping",
                  shipping: "payment",
                  payment: "confirmation",
                  confirmation: "confirmation",
                };
                setStep(nextMap[step]);
              }}
              className="btn-primary w-full justify-center py-4 text-base"
            >
              {step === "summary" && "Continue to Shipping →"}
              {step === "shipping" && "Continue to Payment →"}
              {step === "payment" && (
                <span className="flex items-center gap-2">
                  <Lock size={15} />
                  Place Order — ${discountedTotal.toFixed(2)}
                </span>
              )}
            </button>
            <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-[oklch(0.62_0.04_55)] font-body">
              {["VISA", "MC", "AMEX", "PAYPAL", "APPLE PAY"].map(brand => (
                <span key={brand} className="font-bold bg-[oklch(0.92_0.02_80)] rounded px-1.5 py-0.5">{brand}</span>
              ))}
            </div>
          </div>
        )}
      </DialogContent>

      {/* ── Post-purchase upsell modal ───────────────────────────────────────────────────────────────── */}
      {showUpsellModal && !upsellAccepted && (() => {
        const upsellProd = PRODUCTS.find(p => !cartItems.some((ci: CartItem) => ci.id === p.name));
        if (!upsellProd) return null;
        const upsellPrice = +(upsellProd.price * 0.70).toFixed(2);
        return (
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              {/* Header */}
              <div className="bg-[oklch(0.22_0.04_55)] px-5 pt-5 pb-4 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-body font-semibold uppercase tracking-widest text-[oklch(0.72_0.08_45)] mb-1">One-time offer — ships with your order</p>
                    <h3 className="font-display font-black text-xl leading-tight">Add a second bottle for 30% off</h3>
                    {/* Countdown timer */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[oklch(0.72_0.08_45)] shrink-0">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span className="text-xs font-body text-[oklch(0.88_0.04_55)]">
                        This offer expires in{" "}
                        <span className={`font-bold tabular-nums ${
                          upsellSecondsLeft <= 30 ? "text-red-400" : "text-white"
                        }`}>
                          {String(Math.floor(upsellSecondsLeft / 60)).padStart(2, "0")}:{String(upsellSecondsLeft % 60).padStart(2, "0")}
                        </span>
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${(upsellSecondsLeft / 180) * 100}%`,
                          background: upsellSecondsLeft <= 30 ? "#f87171" : "oklch(0.72 0.13 45)",
                        }}
                      />
                    </div>
                  </div>
                  <button onClick={() => setShowUpsellModal(false)} className="text-white/50 hover:text-white transition-colors mt-0.5 shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
              {/* Product card */}
              <div className="p-5">
                <div className="flex gap-4 mb-4">
                  <img src={upsellProd.img} alt={upsellProd.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1">
                    <p className="font-display font-bold text-base text-[oklch(0.22_0.04_55)] leading-tight">{upsellProd.name}</p>
                    <p className="text-xs font-body text-[oklch(0.52_0.04_55)] mt-0.5 mb-2">{upsellProd.tagline}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-black text-xl text-[oklch(0.58_0.13_45)]">${upsellPrice}</span>
                      <span className="text-sm font-body text-[oklch(0.62_0.04_55)] line-through">${upsellProd.price.toFixed(2)}</span>
                      <span className="text-xs font-body font-semibold text-[oklch(0.42_0.08_150)] bg-[oklch(0.94_0.04_150)] rounded-full px-2 py-0.5">30% off</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs font-body text-[oklch(0.52_0.04_55)] mb-4">
                  This offer is only available right now and won't appear again. No extra shipping — it ships with your current order.
                </p>
                {/* CTAs */}
                <button
                  disabled={upsellAdding}
                  onClick={async () => {
                    setUpsellAdding(true);
                    try {
                      /**
                       * Shopify Draft Orders API — append upsell line item to the live order.
                       *
                       * Backend proxy route: POST /api/upsell-add-item
                       * Body: { draftOrderId, variantId, quantity, price }
                       *
                       * The proxy calls:
                       *   PUT  /admin/api/2024-01/draft_orders/{id}.json   (append line_item)
                       *   POST /admin/api/2024-01/draft_orders/{id}/complete.json  (finalise)
                       *
                       * While the backend is not yet wired, the call will 404 and we fall
                       * through to the local addToCart so the UI stays fully functional.
                       */
                      const res = await fetch("/api/upsell-add-item", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          productName: upsellProd.name,
                          quantity: 1,
                          price: upsellPrice,
                          originalPrice: upsellProd.price,
                          discountPct: 30,
                        }),
                        signal: AbortSignal.timeout(5000),
                      });
                      if (!res.ok) throw new Error("proxy not available");
                    } catch {
                      // Proxy not yet deployed — fall back to local cart state
                      addToCart({ ...upsellProd, price: upsellPrice });
                    }
                    setUpsellAdding(false);
                    setUpsellAccepted(true);
                    setShowUpsellModal(false);
                  }}
                  className="w-full bg-[oklch(0.58_0.13_45)] text-white font-body font-bold py-3.5 rounded-xl text-sm hover:bg-[oklch(0.52_0.12_45)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
                >
                  {upsellAdding ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Adding to order…
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      Yes! Add to my order — ${upsellPrice}
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowUpsellModal(false)}
                  className="w-full text-center text-xs font-body text-[oklch(0.62_0.04_55)] hover:text-[oklch(0.42_0.04_55)] transition-colors py-1"
                >
                  No thanks, I don't want this offer
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </Dialog>
  );
}
// ─── Main Component ─────────────────────────────────────────────────────────────
export default function Home() {
  const { h, m, s } = useCountdown(7, 23, 45);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  // Ref attached to the products section — sticky bar appears only after user scrolls past it
  const productsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (productsSectionRef.current) {
        // Show sticky bar only after the bottom of the products section leaves the viewport
        const rect = productsSectionRef.current.getBoundingClientRect();
        setStickyVisible(rect.bottom < 0);
      } else {
        // Fallback: 100px past the hero (roughly 600px)
        setStickyVisible(window.scrollY > 600);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <CartProvider>
      <HomeContent
        h={h} m={m} s={s}
        stickyVisible={stickyVisible}
        quizOpen={quizOpen}
        setQuizOpen={setQuizOpen}
        productsSectionRef={productsSectionRef}
      />
    </CartProvider>
  );
}

function HomeContent({
  h, m, s, stickyVisible, quizOpen, setQuizOpen, productsSectionRef
}: {
  h: string; m: string; s: string;
  stickyVisible: boolean;
  quizOpen: boolean;
  setQuizOpen: (v: boolean) => void;
  productsSectionRef: React.RefObject<HTMLElement | null>;
}) {
  const { addToCart, count, setIsOpen, addingId, successId } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [badgePop, setBadgePop] = useState(false);
  const prevCountRef = useRef(count);

  // ── Exit-intent overlay ───────────────────────────────────────────────────
  const [exitIntentShown, setExitIntentShown] = useState(false);
  const [exitIntentVisible, setExitIntentVisible] = useState(false);
  const [exitEmail, setExitEmail] = useState("");
  const [exitSubmitted, setExitSubmitted] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Fire only when cursor leaves through the top of the viewport
      if (e.clientY > 20) return;
      if (exitIntentShown) return;
      if (count === 0) return; // only show when cart has items
      setExitIntentShown(true);
      setExitIntentVisible(true);
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [exitIntentShown, count]);
  useEffect(() => {
    if (count > prevCountRef.current) {
      setBadgePop(true);
      const t = setTimeout(() => setBadgePop(false), 500);
      return () => clearTimeout(t);
    }
    prevCountRef.current = count;
  }, [count]);
  return (
    <div className="min-h-screen font-body bg-[oklch(0.975_0.015_80)]">

      {/* ── 1. URGENCY BAR ─────────────────────────────────────────────────── */}
      <div className="bg-[oklch(0.22_0.04_55)] text-[oklch(0.975_0.015_80)] py-2.5 px-4 text-center text-sm font-body font-semibold tracking-wide">
        <span className="opacity-80">🎉 LIMITED OFFER — BUY 2 GET 1 FREE ENDS IN:</span>
        <span className="ml-3 font-bold text-[oklch(0.72_0.12_80)]">
          <span className="inline-block bg-[oklch(0.35_0.04_55)] rounded px-2 py-0.5 mx-0.5 tabular-nums">{h}</span>
          <span className="mx-0.5">:</span>
          <span className="inline-block bg-[oklch(0.35_0.04_55)] rounded px-2 py-0.5 mx-0.5 tabular-nums">{m}</span>
          <span className="mx-0.5">:</span>
          <span className="inline-block bg-[oklch(0.35_0.04_55)] rounded px-2 py-0.5 mx-0.5 tabular-nums">{s}</span>
        </span>
      </div>

      {/* ── 2. NAVIGATION ──────────────────────────────────────────────────── */}
      <nav className="bg-[oklch(0.975_0.015_80)] border-b border-[oklch(0.88_0.02_80)] sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[oklch(0.58_0.13_45)] flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">L</span>
            </div>
            <span className="font-display font-bold text-xl text-[oklch(0.22_0.04_55)]">Luma Daily</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-body font-medium text-[oklch(0.42_0.04_55)]">
            <a href="#products" className="hover:text-[oklch(0.58_0.13_45)] transition-colors">Products</a>
            <a href="#bundles" className="hover:text-[oklch(0.58_0.13_45)] transition-colors">Bundles</a>
            <a href="#ingredients" className="hover:text-[oklch(0.58_0.13_45)] transition-colors">Ingredients</a>
            <a href="#reviews" className="hover:text-[oklch(0.58_0.13_45)] transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            {/* Cart icon */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative w-10 h-10 rounded-full bg-[oklch(0.92_0.02_80)] flex items-center justify-center hover:bg-[oklch(0.88_0.02_80)] transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={18} className="text-[oklch(0.42_0.04_55)]" />
              {count > 0 && (
                <span
                  key={count}
                  className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[oklch(0.58_0.13_45)] text-white text-[10px] font-bold flex items-center justify-center ${
                    badgePop ? 'badge-pop' : ''
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
            <a href="#products" className="btn-primary text-sm py-2.5 px-5">
              Shop Now →
            </a>
          </div>
        </div>
      </nav>

      {/* ── 3. HERO ────────────────────────────────────────────────────────── */}
      <section className="section-cream py-12 md:py-20 overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Copy */}
            <div className="order-2 md:order-1">
              {/* Social proof — real UGC thumbnail avatars */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  {HERO_AVATARS.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Luma Daily customer"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Stars />
                    <span className="text-sm font-bold text-[oklch(0.22_0.04_55)]">4.9/5</span>
                  </div>
                  <p className="text-xs text-[oklch(0.52_0.04_55)] font-body">
                    <strong className="text-[oklch(0.22_0.04_55)]">1,400+</strong> daily rituals started
                  </p>
                </div>
              </div>

              {/* Headline */}
              <h1 className="font-display font-black text-[oklch(0.22_0.04_55)] text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-4">
                You've tried the pills.
                <br />
                <em className="text-[oklch(0.58_0.13_45)] not-italic">Nothing stuck.</em>
              </h1>
              <p className="text-lg md:text-xl text-[oklch(0.42_0.04_55)] font-body leading-relaxed mb-6 max-w-lg">
                Luma Daily makes wellness feel like a ritual — not a chore. 6 targeted gummy formulas from clean, natural ingredients that you'll actually look forward to taking.
              </p>

              {/* Benefit badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: <Check size={13} />, text: "Results in 2–4 weeks" },
                  { icon: <Check size={13} />, text: "Tastes like a treat" },
                  { icon: <Check size={13} />, text: "No fillers or junk" },
                  { icon: <Check size={13} />, text: "GMP certified facility" },
                ].map((b, i) => (
                  <span key={i} className="badge-trust">
                    {b.icon} {b.text}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
                <a href="#products" className="btn-primary text-base">
                  Start My Ritual →
                </a>
                <button onClick={() => setQuizOpen(true)} className="btn-secondary text-base">
                  Take the Quiz
                </button>
              </div>

              {/* Trust note */}
              <div className="flex items-center gap-2 text-sm text-[oklch(0.42_0.04_55)]">
                <Shield size={16} className="text-[oklch(0.62_0.08_150)]" />
                <span className="font-body">Vegan · Third-Party Tested · GMP Certified</span>
              </div>
            </div>

            {/* UGC Video Player */}
            <div className="order-1 md:order-2 flex justify-center">
              <HeroVideoPlayer />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. PRESS LOGOS ─────────────────────────────────────────────────── */}
      <div className="bg-[oklch(0.96_0.025_75)] border-y border-[oklch(0.88_0.02_80)] py-5">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <span className="text-xs font-body font-semibold text-[oklch(0.62_0.04_55)] uppercase tracking-widest">As Seen In</span>
            {["Forbes", "Vogue", "Well+Good", "Byrdie", "MindBodyGreen"].map((p) => (
              <span key={p} className="font-display font-bold text-lg text-[oklch(0.72_0.04_55)] opacity-60 hover:opacity-100 transition-opacity">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. TRUST BAR ───────────────────────────────────────────────────── */}
      <div className="bg-[oklch(0.22_0.04_55)] text-[oklch(0.975_0.015_80)] py-4">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-body font-medium">
            {[
              { icon: <Leaf size={15} />, text: "100% Vegan" },
              { icon: <FlaskConical size={15} />, text: "Third-Party Tested" },
              { icon: <Wheat size={15} />, text: "Gluten-Free" },
              { icon: <Shield size={15} />, text: "GMP Certified" },
              { icon: <Check size={15} />, text: "No Artificial Colors" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-[oklch(0.78_0.08_80)]">
                <span className="text-[oklch(0.72_0.12_80)]">{t.icon}</span>
                {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. PROBLEM AGITATION ───────────────────────────────────────────── */}
      <section className="section-cream py-16 md:py-24">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[oklch(0.58_0.13_45)] font-body font-semibold uppercase tracking-widest text-sm mb-3">Sound familiar?</p>
            <h2 className="font-display font-black text-[oklch(0.22_0.04_55)] text-3xl md:text-5xl leading-tight">
              Why is nothing <em className="text-[oklch(0.58_0.13_45)]">working?</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                problem: "You've bought the big tub of powder.",
                reality: "It tastes like chalk and sits unopened after week two.",
                icon: "😩",
              },
              {
                problem: "You've tried the capsule packs.",
                reality: "Swallowing 6 pills at 7am is not a ritual. It's a chore.",
                icon: "💊",
              },
              {
                problem: "You've ordered the \"all-in-one\" blend.",
                reality: "Underdosed ingredients that do nothing. Just expensive pee.",
                icon: "🤷",
              },
              {
                problem: "You've set reminders to take your supplements.",
                reality: "You snooze the reminder. Every. Single. Day.",
                icon: "📱",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-[oklch(0.88_0.02_80)] shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="font-body font-semibold text-[oklch(0.22_0.04_55)]">{item.problem}</p>
                    </div>
                    <p className="text-[oklch(0.52_0.04_55)] font-body text-sm leading-relaxed">{item.reality}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[oklch(0.58_0.13_45)] rounded-2xl p-8 text-center text-white">
            <h3 className="font-display font-black text-2xl md:text-3xl mb-3">
              The problem isn't your willpower.
            </h3>
            <p className="font-body text-lg opacity-90 max-w-2xl mx-auto">
              It's that supplements were never designed to be enjoyable. Luma Daily changes that. When your daily ritual tastes like a Blood Orange Mango gummy, you actually want to do it.
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. PRODUCTS ────────────────────────────────────────────────────── */}
      <section id="products" ref={productsSectionRef} className="section-warm py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-[oklch(0.58_0.13_45)] font-body font-semibold uppercase tracking-widest text-sm mb-3">Six formulas</p>
            <h2 className="font-display font-black text-[oklch(0.22_0.04_55)] text-3xl md:text-5xl leading-tight">
              One <em className="text-[oklch(0.58_0.13_45)]">daily ritual.</em>
            </h2>
            <p className="text-[oklch(0.42_0.04_55)] font-body text-lg mt-4 max-w-xl mx-auto">
              Each formula is designed to support a specific wellness goal, with ingredients chosen for synergy and real-world results.
            </p>
          </div>

          {/* ── Product Filter Tabs + Grid ── */}
          <ProductFilterTabs onAddToCart={addToCart} onCardClick={setSelectedProduct} />
        </div>
      </section>

      {/* ── 8. QUIZ CTA ────────────────────────────────────────────────────── */}
      <section id="quiz" className="bg-[oklch(0.22_0.04_55)] py-16 md:py-24 text-center">
        <div className="container max-w-3xl mx-auto">
          <p className="text-[oklch(0.72_0.12_80)] font-body font-semibold uppercase tracking-widest text-sm mb-4">Not sure where to start?</p>
          <h2 className="font-display font-black text-white text-3xl md:text-5xl leading-tight mb-4">
            Take 60 seconds.
            <br />
            <em className="text-[oklch(0.72_0.12_80)]">We'll build your ritual.</em>
          </h2>
          <p className="text-gray-300 font-body text-lg mb-8 max-w-xl mx-auto">
            Answer a few questions about your wellness goals and we'll recommend the perfect formula — or combination — for you.
          </p>
          <button onClick={() => setQuizOpen(true)} className="btn-primary text-lg py-4 px-10 inline-flex">
            Take the Free Quiz →
          </button>
          <p className="text-gray-400 text-sm font-body mt-4">2 minutes · No email required · Personalized results</p>
        </div>
      </section>

      {/* ── 9. SOCIAL PROOF STATS ──────────────────────────────────────────── */}
      <section className="section-cream py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: 1400, suffix: "+", label: "Daily rituals started" },
              { value: 98, suffix: "%", label: "Would recommend" },
              { value: 4.9, suffix: "/5", label: "Average rating", isDecimal: true },
              { value: 6, suffix: " formulas", label: "Targeted wellness goals" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-[oklch(0.88_0.02_80)]">
                <div className="font-display font-black text-2xl md:text-3xl text-[oklch(0.58_0.13_45)] mb-1">
                  {stat.isDecimal ? stat.value : <AnimatedCounter target={stat.value} />}{stat.suffix}
                </div>
                <p className="text-[oklch(0.52_0.04_55)] font-body text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. BUNDLES ────────────────────────────────────────────────────── */}
      <section id="bundles" className="section-warm py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-[oklch(0.58_0.13_45)] font-body font-semibold uppercase tracking-widest text-sm mb-3">Save more</p>
            <h2 className="font-display font-black text-[oklch(0.22_0.04_55)] text-3xl md:text-5xl leading-tight">
              Build your <em className="text-[oklch(0.58_0.13_45)]">30-day ritual.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "The Daily 3 Bundle",
                subtitle: "Energy + Calm + Sleep",
                desc: "The perfect morning-to-night ritual. Start your day energized, stay calm through it, and sleep deeply at night.",
                img: "/manus-storage/bundle_daily3_noprice_7a4e331a.png",
                original: "$104.97",
                price: "$59",
                savings: "Save 44%",
              },
              {
                title: "The Full Ritual",
                subtitle: "All 6 Formulas",
                desc: "Complete daily wellness coverage. Energy, calm, sleep, glow, focus, and gut health — all in one ritual.",
                img: "/manus-storage/bundle_fullritual_noprice_2c0ab63f.png",
                original: "$149.94",
                price: "$119",
                savings: "Save 20%",
                badge: "Most Popular",
              },
            ].map((b, i) => (
              <div key={i} className="product-card relative overflow-visible">
                {b.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-[oklch(0.58_0.13_45)] text-white text-xs font-bold font-body px-4 py-1.5 rounded-full">
                    {b.badge}
                  </div>
                )}
                <div className="aspect-video overflow-hidden">
                  <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-2xl text-[oklch(0.22_0.04_55)] mb-1">{b.title}</h3>
                  <p className="text-[oklch(0.58_0.13_45)] font-body font-semibold text-sm mb-3">{b.subtitle}</p>
                  <p className="text-[oklch(0.42_0.04_55)] font-body text-sm leading-relaxed mb-5">{b.desc}</p>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-display font-black text-3xl text-[oklch(0.22_0.04_55)]">{b.price}</span>
                    <span className="text-[oklch(0.62_0.04_55)] line-through font-body">{b.original}</span>
                    <span className="bg-[oklch(0.58_0.13_45)] text-white text-xs font-bold font-body px-3 py-1 rounded-full">{b.savings}</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(true)}
                    className="btn-primary w-full justify-center"
                  >
                    Shop This Bundle →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. INGREDIENTS ────────────────────────────────────────────────── */}
      <section id="ingredients" className="section-cream py-16 md:py-24">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[oklch(0.58_0.13_45)] font-body font-semibold uppercase tracking-widest text-sm mb-3">Transparency first</p>
              <h2 className="font-display font-black text-[oklch(0.22_0.04_55)] text-3xl md:text-5xl leading-tight mb-6">
                Clean ingredients,
                <br />
                <em className="text-[oklch(0.58_0.13_45)]">clearly explained.</em>
              </h2>
              <p className="text-[oklch(0.42_0.04_55)] font-body text-lg leading-relaxed mb-6">
                We believe you deserve to know exactly what you're putting in your body. Every Luma Daily formula uses clinically-studied ingredients at effective doses — nothing hidden, nothing underdosed.
              </p>
              <div className="space-y-3">
                {[
                  "No artificial colors, flavors, or sweeteners",
                  "No proprietary blends — full ingredient transparency",
                  "Vegan pectin gummies (no gelatin)",
                  "Third-party tested for purity and potency",
                  "Made in an FDA-registered, GMP-certified facility",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[oklch(0.62_0.08_150)] flex items-center justify-center shrink-0">
                      <Check size={11} className="text-white" />
                    </div>
                    <span className="text-[oklch(0.32_0.04_55)] font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <a href="#" className="btn-secondary mt-8 inline-flex">
                View Full Ingredient List
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Ashwagandha", benefit: "Stress + cortisol support", color: "bg-green-50 border-green-200" },
                { name: "Lion's Mane", benefit: "Focus + cognitive clarity", color: "bg-teal-50 border-teal-200" },
                { name: "Melatonin-free", benefit: "Natural sleep support", color: "bg-purple-50 border-purple-200" },
                { name: "Biotin + Collagen", benefit: "Skin, hair + nail health", color: "bg-orange-50 border-orange-200" },
                { name: "Vitamin B12", benefit: "Clean sustained energy", color: "bg-amber-50 border-amber-200" },
                { name: "Prebiotics", benefit: "Gut microbiome balance", color: "bg-emerald-50 border-emerald-200" },
              ].map((ing, i) => (
                <div key={i} className={`${ing.color} border rounded-xl p-4`}>
                  <p className="font-display font-bold text-[oklch(0.22_0.04_55)] text-sm mb-1">{ing.name}</p>
                  <p className="text-[oklch(0.52_0.04_55)] font-body text-xs leading-snug">{ing.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. REVIEWS ────────────────────────────────────────────────────── */}
      <section id="reviews" className="section-warm py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-[oklch(0.58_0.13_45)] font-body font-semibold uppercase tracking-widest text-sm mb-3">Real people, real results</p>
            <h2 className="font-display font-black text-[oklch(0.22_0.04_55)] text-3xl md:text-5xl leading-tight mb-3">
              Daily rituals people
              <br />
              <em className="text-[oklch(0.58_0.13_45)]">actually keep.</em>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Stars />
              <span className="font-body font-bold text-[oklch(0.22_0.04_55)]">4.9 out of 5</span>
              <span className="text-[oklch(0.52_0.04_55)] font-body text-sm">from 2,847 reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-[oklch(0.88_0.02_80)]">
                <Stars count={r.stars} />
                <p className="text-[oklch(0.32_0.04_55)] font-body text-sm leading-relaxed mt-3 mb-4">"{r.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body font-bold text-sm text-[oklch(0.22_0.04_55)]">{r.name}</p>
                    <p className="text-xs text-[oklch(0.62_0.04_55)] font-body">{r.location}</p>
                  </div>
                  {r.verified && (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-body font-medium">✓ Verified</span>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-[oklch(0.92_0.02_80)]">
                  <span className="text-xs text-[oklch(0.58_0.13_45)] font-body font-semibold">{r.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. SUBSCRIBE ──────────────────────────────────────────────────── */}
      <section className="section-cream py-16 md:py-24">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[oklch(0.58_0.13_45)] font-body font-semibold uppercase tracking-widest text-sm mb-3">Subscribe & save</p>
              <h2 className="font-display font-black text-[oklch(0.22_0.04_55)] text-3xl md:text-4xl leading-tight mb-4">
                Subscribe once.
                <br />
                <em className="text-[oklch(0.58_0.13_45)]">Keep your ritual stocked.</em>
              </h2>
              <p className="text-[oklch(0.42_0.04_55)] font-body text-lg leading-relaxed mb-6">
                Never run out of your daily ritual. Subscribe for 15% off every order, free shipping, and the flexibility to pause or cancel anytime.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "15% off every order, forever",
                  "Free shipping on all subscription orders",
                  "Pause, skip, or cancel anytime — no fees",
                  "Priority access to new formulas",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[oklch(0.58_0.13_45)] flex items-center justify-center shrink-0">
                      <Check size={11} className="text-white" />
                    </div>
                    <span className="text-[oklch(0.32_0.04_55)] font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <a href="#products" className="btn-primary inline-flex">
                Subscribe & Save 15% →
              </a>
            </div>
            <div className="relative">
              <img
                src="/manus-storage/luma-products_6ef494ae.png"
                alt="Luma Daily subscription"
                className="w-full rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-[oklch(0.58_0.13_45)] text-white rounded-xl p-4 shadow-lg">
                <p className="font-display font-bold text-2xl">15% OFF</p>
                <p className="font-body text-xs opacity-80">every order</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 14. UGC CAROUSEL ───────────────────────────────────────────────── */}
      <UGCCarousel />

      {/* ── 15. FAQ ─────────────────────────────────────────────────────────── */}
      <section className="section-warm py-16 md:py-24">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-[oklch(0.22_0.04_55)] text-3xl md:text-4xl">
              Questions before you start?
            </h2>
          </div>
          <div>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-[oklch(0.52_0.04_55)] font-body text-sm">
              Still have questions?{" "}
              <a href="#" className="text-[oklch(0.58_0.13_45)] font-semibold hover:underline">
                Chat with our team →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── 16. FINAL CTA ──────────────────────────────────────────────────── */}
      <section className="bg-[oklch(0.58_0.13_45)] py-16 md:py-24 text-center">
        <div className="container max-w-3xl mx-auto">
          <h2 className="font-display font-black text-white text-3xl md:text-5xl leading-tight mb-4">
            Ready to start
            <br />
            your ritual?
          </h2>
            <p className="text-white/80 font-body text-lg mb-8 max-w-xl mx-auto">
              Join 1,400+ people who made wellness feel like a treat. Vegan, gluten-free, and third-party tested.
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products" className="bg-white text-[oklch(0.58_0.13_45)] font-body font-bold text-lg py-4 px-10 rounded-md hover:bg-[oklch(0.96_0.025_75)] transition-colors inline-flex items-center gap-2">
              Shop Products →
            </a>
            <button onClick={() => setQuizOpen(true)} className="border-2 border-white text-white font-body font-semibold text-lg py-4 px-10 rounded-md hover:bg-white/10 transition-colors inline-flex items-center gap-2">
              Take the Quiz
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/70 text-sm font-body">
            <Shield size={14} />
            <span>Vegan · Third-Party Tested · Free Shipping Over $50</span>
          </div>
        </div>
      </section>

      {/* ── 17. FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-[oklch(0.14_0.02_55)] text-gray-400 py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[oklch(0.58_0.13_45)] flex items-center justify-center">
                  <span className="text-white font-display font-bold text-sm">L</span>
                </div>
                <span className="font-display font-bold text-xl text-white">Luma Daily</span>
              </div>
              <p className="text-sm leading-relaxed font-body">
                Gummies that make wellness feel like a ritual. Clean ingredients. Real results.
              </p>
            </div>
            {[
              { title: "Products", links: ["Luma Energy", "Luma Calm", "Luma Sleep", "Luma Glow", "Luma Focus", "Luma Gut"] },
              { title: "Company", links: ["About Us", "Our Ingredients", "Sustainability", "Press"] },
              { title: "Support", links: ["FAQ", "Shipping Policy", "Returns", "Contact Us"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-body font-bold text-white text-sm uppercase tracking-wider mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-sm hover:text-white transition-colors font-body">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-body">© 2025 Luma Daily. All rights reserved.</p>
            <p className="text-xs font-body text-center max-w-lg opacity-60">
              *These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
        </div>
      </footer>

      {/* ── 18. MOBILE STICKY BOTTOM BAR ───────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
          stickyVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Mobile-first: show product + rating + CTA */}
        <div className="md:hidden bg-white border-t border-[oklch(0.88_0.02_80)] shadow-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src={PRODUCTS[0].img}
              alt="Luma Energy"
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)] truncate">Luma Energy</p>
              <div className="flex items-center gap-1">
                <Stars />
                <span className="text-xs text-[oklch(0.52_0.04_55)] font-body">4.9 · 1,400+ customers</span>
              </div>
            </div>
            <button
              onClick={() => addToCart(PRODUCTS[0])}
              className="btn-primary text-sm py-2.5 px-5 shrink-0"
            >
              Shop Now →
            </button>
          </div>
        </div>

        {/* Desktop: full urgency bar */}
        <div className="hidden md:block bg-[oklch(0.22_0.04_55)] border-t border-[oklch(0.35_0.04_55)] py-3 px-4 shadow-2xl">
          <div className="container flex items-center justify-between gap-4">
            <div>
              <p className="font-display font-bold text-white text-sm">Luma Daily — Start Your Ritual</p>
              <div className="flex items-center gap-1">
                <Stars />
                <span className="text-xs text-gray-300 font-body">4.9/5 · 1,400+ customers</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[oklch(0.72_0.12_80)] text-xs font-body font-semibold">
                <span>⏱</span>
                <span>Sale ends: {h}:{m}:{s}</span>
              </div>
              <a href="#products" className="btn-primary text-sm py-2.5 px-6 whitespace-
nowrap">
                Shop Now →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── 19. QUIZ MODAL ─────────────────────────────────────────────────── */}
      <QuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onAddToCart={addToCart}
      />

       {/* ── 20. CART DRAWER ────────────────────────────────────────────────── */}
      <CartDrawer />
      {/* ── 21. PRODUCT DETAIL MODAL ───────────────────────────────────────── */}
      <ProductDetail
        product={selectedProduct}
        allProducts={PRODUCTS}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, subscribe) => {
          addToCart(product);
          setSelectedProduct(null);
        }}
        addingId={addingId}
        successId={successId}
      />

      {/* ── Exit-intent overlay ───────────────────────────────────────────────────────────────────────────── */}
      {exitIntentVisible && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "oklch(0.12 0.03 55 / 0.72)", backdropFilter: "blur(4px)" }}
          onClick={() => setExitIntentVisible(false)}
        >
          <div
            className="bg-[oklch(0.975_0.015_80)] rounded-2xl shadow-2xl max-w-sm w-full p-7 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setExitIntentVisible(false)}
              className="absolute top-4 right-4 text-[oklch(0.62_0.04_55)] hover:text-[oklch(0.22_0.04_55)] transition-colors"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* Emoji + headline */}
            <div className="text-3xl mb-3">&#x1F381;</div>
            <h3 className="font-display font-bold text-xl text-[oklch(0.22_0.04_55)] mb-1 leading-tight">
              Wait — here&apos;s 10% off your order
            </h3>
            <p className="text-sm font-body text-[oklch(0.52_0.04_55)] mb-5">
              You left {count} item{count !== 1 ? "s" : ""} in your cart. Use code{" "}
              <span className="font-bold text-[oklch(0.22_0.04_55)] tracking-widest">LUMA10</span>{" "}
              at checkout for an instant 10% discount.
            </p>

            {!exitSubmitted ? (
              <>
                {/* Email capture */}
                <p className="text-xs font-body font-semibold text-[oklch(0.52_0.04_55)] uppercase tracking-wide mb-2">
                  Send the code to your inbox
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={exitEmail}
                    onChange={e => setExitEmail(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && exitEmail.includes("@")) {
                        try { (window as any)._learnq?.push(["identify", { $email: exitEmail }]); } catch {}
                        setExitSubmitted(true);
                      }
                    }}
                    className="flex-1 border border-[oklch(0.88_0.02_80)] rounded-xl px-3 py-2.5 text-sm font-body text-[oklch(0.22_0.04_55)] placeholder-[oklch(0.72_0.04_55)] focus:outline-none focus:border-[oklch(0.58_0.13_45)] bg-white"
                  />
                  <button
                    disabled={!exitEmail.includes("@")}
                    onClick={() => {
                      try { (window as any)._learnq?.push(["identify", { $email: exitEmail }]); } catch {}
                      setExitSubmitted(true);
                    }}
                    className="bg-[oklch(0.58_0.13_45)] text-white font-body font-bold px-4 rounded-xl text-sm hover:bg-[oklch(0.52_0.12_45)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    Send
                  </button>
                </div>
                {/* Promo badge */}
                <div className="mt-4 flex items-center justify-between bg-[oklch(0.94_0.04_55)] rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs font-body text-[oklch(0.52_0.04_55)] mb-0.5">Your promo code</p>
                    <p className="font-display font-bold text-lg text-[oklch(0.22_0.04_55)] tracking-widest">LUMA10</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard?.writeText("LUMA10")}
                    className="text-xs font-body font-semibold text-[oklch(0.58_0.13_45)] hover:text-[oklch(0.42_0.08_45)] transition-colors"
                  >
                    Copy
                  </button>
                </div>
                {/* CTA — return to cart */}
                <button
                  onClick={() => { setExitIntentVisible(false); setIsOpen(true); }}
                  className="mt-4 w-full bg-[oklch(0.22_0.04_55)] text-white font-body font-bold py-3 rounded-xl text-sm hover:bg-[oklch(0.32_0.04_55)] transition-colors"
                >
                  Return to my cart
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">&#x2705;</div>
                <p className="font-display font-bold text-[oklch(0.22_0.04_55)] mb-1">Code sent!</p>
                <p className="text-sm font-body text-[oklch(0.52_0.04_55)] mb-5">Check your inbox for <span className="font-bold">LUMA10</span>.</p>
                <button
                  onClick={() => { setExitIntentVisible(false); setIsOpen(true); }}
                  className="w-full bg-[oklch(0.58_0.13_45)] text-white font-body font-bold py-3 rounded-xl text-sm hover:bg-[oklch(0.52_0.12_45)] transition-colors"
                >
                  Return to my cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
