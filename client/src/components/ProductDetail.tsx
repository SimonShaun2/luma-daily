/**
 * LUMA DAILY — ProductDetail Modal
 * 6-element high-converting product detail layout + FBT upsell + swipe gestures
 *
 * SHOPIFY INTEGRATION:
 *   - Replace `price` with live Storefront API fetch keyed on `shopifyVariantId`
 *   - `soldOut` flag disables ATC and shows Sold Out badge
 *   - Subscribe option maps to a Recharge selling plan ID
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { X, Star, Check, ChevronDown, Shield, Truck, RefreshCw, Lock, ShoppingCart } from "lucide-react";

interface ProductEnrichment {
  hook: string;
  benefits: string[];
  subscribeChips: string[];
  stockLevel: number | null;
  reviewCount: string;
  rating: number;
  featuredReview: { name: string; location: string; avatar: string; text: string };
  pairingName: string;
  pairingReason: string;
}

const ENRICHMENT: Record<string, ProductEnrichment> = {
  "Luma Energy": {
    hook: "Clean, sustained energy + sharper focus — without the crash.",
    benefits: [
      "Vitamin B12 + Lion's Mane at clinically-studied doses",
      "Supports clean, sustained energy without the jitters",
      "Sharpens focus and mental clarity throughout the day",
    ],
    subscribeChips: ["Free Shipping", "Cancel Anytime", "Priority Access", "15% Off Forever"],
    stockLevel: 9,
    reviewCount: "2,847",
    rating: 4.9,
    featuredReview: { name: "Sarah M.", location: "Austin, TX", avatar: "SM", text: "I replaced my morning coffee with Luma Energy and I have way more steady energy without the jitters. Genuinely feel so much better after 30 days." },
    pairingName: "Luma Focus",
    pairingReason: "Most popular morning stack — energy + deep focus.",
  },
  "Luma Calm": {
    hook: "Melt stress and feel like yourself again — without drowsiness.",
    benefits: [
      "KSM-66 Ashwagandha reduces cortisol at an effective 600mg dose",
      "L-Theanine promotes calm focus without sedation",
      "Supports mood balance and stress resilience over time",
    ],
    subscribeChips: ["Free Shipping", "Cancel Anytime", "Skip Anytime", "15% Off Forever"],
    stockLevel: null,
    reviewCount: "1,923",
    rating: 4.8,
    featuredReview: { name: "Jessica L.", location: "New York, NY", avatar: "JL", text: "My anxiety has been so much better since starting Luma Calm. The Raspberry Hibiscus flavor makes it feel like a treat." },
    pairingName: "Luma Sleep",
    pairingReason: "Calm your day, then sleep deeply at night.",
  },
  "Luma Sleep": {
    hook: "Fall asleep faster, stay asleep deeper — wake up refreshed.",
    benefits: [
      "Melatonin-free formula — no grogginess, no dependency",
      "L-Theanine + Magnesium Glycinate for deep, restorative sleep",
      "Passionflower extract calms a racing mind at bedtime",
    ],
    subscribeChips: ["Free Shipping", "Cancel Anytime", "Pause Anytime", "15% Off Forever"],
    stockLevel: 14,
    reviewCount: "2,104",
    rating: 4.9,
    featuredReview: { name: "Priya K.", location: "San Francisco, CA", avatar: "PK", text: "I fall asleep within 20 minutes now. The Blueberry Lavender flavor is genuinely delicious and I don't wake up groggy at all." },
    pairingName: "Luma Calm",
    pairingReason: "The evening ritual — calm down, then sleep deeply.",
  },
  "Luma Glow": {
    hook: "Skin that glows, nails that don't break, hair that grows.",
    benefits: [
      "10,000mcg Biotin supports hair growth and nail strength",
      "Hydrolyzed Collagen Peptides improve skin elasticity",
      "Vitamin C + E protect against oxidative stress",
    ],
    subscribeChips: ["Free Shipping", "Cancel Anytime", "Skip Anytime", "15% Off Forever"],
    stockLevel: null,
    reviewCount: "1,677",
    rating: 4.8,
    featuredReview: { name: "Rachel T.", location: "Chicago, IL", avatar: "RT", text: "My skin has been glowing and my nails stopped breaking. My dermatologist actually asked what I changed in my routine." },
    pairingName: "Luma Gut",
    pairingReason: "Beauty starts from within — skin + gut health together.",
  },
  "Luma Focus": {
    hook: "Deep work sessions, sharper recall, zero brain fog.",
    benefits: [
      "Lion's Mane mushroom supports neurogenesis and memory",
      "Bacopa Monnieri improves information retention over time",
      "Rhodiola Rosea reduces mental fatigue during demanding tasks",
    ],
    subscribeChips: ["Free Shipping", "Cancel Anytime", "Priority Access", "15% Off Forever"],
    stockLevel: 7,
    reviewCount: "1,412",
    rating: 4.9,
    featuredReview: { name: "Marcus D.", location: "Seattle, WA", avatar: "MD", text: "Deep work sessions hit different now. I'm more productive in 4 hours than I used to be in 8." },
    pairingName: "Luma Energy",
    pairingReason: "The ultimate focus stack — energy + cognitive clarity.",
  },
  "Luma Gut": {
    hook: "No more bloating. A gut that actually works with you.",
    benefits: [
      "5 billion CFU probiotics restore healthy gut microbiome balance",
      "Prebiotic fiber feeds beneficial bacteria for long-term health",
      "Ginger + Fennel reduce bloating and digestive discomfort",
    ],
    subscribeChips: ["Free Shipping", "Cancel Anytime", "Skip Anytime", "15% Off Forever"],
    stockLevel: null,
    reviewCount: "1,289",
    rating: 4.7,
    featuredReview: { name: "Aisha R.", location: "Miami, FL", avatar: "AR", text: "Bloating is GONE. Luma Gut has completely changed how I feel after meals. This is the first probiotic that actually worked for me." },
    pairingName: "Luma Glow",
    pairingReason: "Gut health + skin health — the inside-out glow combo.",
  },
};

const PAYMENT_ICONS = [
  { label: "Apple Pay", bg: "#000", color: "#fff" },
  { label: "G Pay", bg: "#4285F4", color: "#fff" },
  { label: "MC", bg: "#EB001B", color: "#fff" },
  { label: "PayPal", bg: "#003087", color: "#fff" },
  { label: "Venmo", bg: "#3D95CE", color: "#fff" },
  { label: "Visa", bg: "#1A1F71", color: "#fff" },
];

const FREQUENCIES = ["Every 30 Days", "Every 45 Days", "Every 60 Days", "Every 90 Days"];

interface Product {
  name: string;
  tagline: string;
  flavor: string;
  accentColor: string;
  price: number;
  img: string;
  shopifyVariantId: string;
  shopifyHandle: string;
  soldOut: boolean;
  compareAtPrice?: number;
}

interface ProductDetailProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, subscribe: boolean) => void;
  addingId: string | null;
  successId: string | null;
}

function StarRow({ rating, count }: { rating: number; count: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={14} className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"} />
        ))}
      </div>
      <span className="text-xs text-[oklch(0.42_0.04_55)]">
        Rated <strong className="text-[oklch(0.22_0.04_55)]">"Excellent"</strong> By {count} Reviews
      </span>
    </div>
  );
}

export default function ProductDetail({ product, allProducts, onClose, onAddToCart, addingId, successId }: ProductDetailProps) {
  const [purchaseType, setPurchaseType] = useState<"subscribe" | "onetime">("subscribe");
  const [frequency, setFrequency] = useState(FREQUENCIES[0]);
  const [activeImg, setActiveImg] = useState(0);
  const [fbtAdded, setFbtAdded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const imgCount = 4;

  useEffect(() => {
    if (product) {
      setPurchaseType("subscribe");
      setFrequency(FREQUENCIES[0]);
      setActiveImg(0);
      setFbtAdded(false);
    }
  }, [product?.name]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const prevImg = useCallback(() => setActiveImg(i => (i - 1 + imgCount) % imgCount), []);
  const nextImg = useCallback(() => setActiveImg(i => (i + 1) % imgCount), []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? nextImg() : prevImg();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!product) return null;

  const enrichment = ENRICHMENT[product.name] ?? {
    hook: product.tagline,
    benefits: ["Clean, natural ingredients", "Clinically-studied doses", "Third-party tested for purity"],
    subscribeChips: ["Free Shipping", "Cancel Anytime", "Skip Anytime", "15% Off Forever"],
    stockLevel: null,
    reviewCount: "1,000+",
    rating: 4.8,
    featuredReview: { name: "Verified Customer", location: "", avatar: "VC", text: "Love this product!" },
    pairingName: "Luma Energy",
    pairingReason: "A great daily combination.",
  };

  const pairingProduct = allProducts.find(p => p.name === enrichment.pairingName);
  const subscribePrice = +(product.price * 0.85).toFixed(2);
  const displayPrice = purchaseType === "subscribe" ? subscribePrice : product.price;
  const isAdding = addingId === product.name;
  const isSuccess = successId === product.name;
  const thumbImages = [product.img, product.img, product.img, product.img];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal panel */}
      <div
        className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-4"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} product details`}
      >
        <div
          className="bg-white w-full md:max-w-[420px] md:rounded-2xl shadow-2xl flex flex-col"
          style={{ fontFamily: "'DM Sans', sans-serif", maxHeight: "92dvh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Fixed top: image carousel + thumbnail strip ───────────── */}
          <div className="flex-shrink-0">
            <div
              className="relative bg-[oklch(0.96_0.02_80)] select-none"
              style={{ aspectRatio: "4/3" }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={thumbImages[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Close — always visible */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-20"
                aria-label="Close"
              >
                <X size={16} className="text-[oklch(0.22_0.04_55)]" />
              </button>
              {/* Stock urgency */}
              {enrichment.stockLevel !== null && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-[oklch(0.22_0.04_55)]">
                    Selling fast — only {enrichment.stockLevel} left
                  </span>
                </div>
              )}
              {/* Arrows */}
              <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors z-10" aria-label="Previous image">
                <span className="text-[oklch(0.22_0.04_55)] font-bold text-sm leading-none">‹</span>
              </button>
              <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors z-10" aria-label="Next image">
                <span className="text-[oklch(0.22_0.04_55)] font-bold text-sm leading-none">›</span>
              </button>
              {/* Dot indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {thumbImages.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`rounded-full transition-all duration-200 ${i === activeImg ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} aria-label={`Image ${i + 1}`} />
                ))}
              </div>
            </div>
            {/* Thumbnail strip */}
            <div className="flex gap-2 px-4 pt-3">
              {thumbImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${i === activeImg ? "border-[oklch(0.58_0.13_45)]" : "border-[oklch(0.90_0.02_80)] hover:border-[oklch(0.72_0.04_80)]"}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Scrollable content ────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="px-4 pt-3 pb-8">
              {/* ① Rating */}
              <div className="mb-2"><StarRow rating={enrichment.rating} count={enrichment.reviewCount} /></div>
              {/* ② Title + hook */}
              <h2 className="font-bold text-2xl text-[oklch(0.22_0.04_55)] leading-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {product.name}
              </h2>
              <p className="text-sm text-[oklch(0.42_0.04_55)] mb-3 leading-relaxed">{enrichment.hook}</p>
              {/* ③ Benefits */}
              <div className="flex flex-col gap-2 mb-5">
                {enrichment.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: product.accentColor + "22" }}>
                      <Check size={10} strokeWidth={3} style={{ color: product.accentColor }} />
                    </div>
                    <span className="text-xs text-[oklch(0.32_0.04_55)] leading-relaxed">{b}</span>
                  </div>
                ))}
              </div>
              {/* ④ Subscribe / One-time */}
              <div className="flex flex-col gap-2 mb-5">
                <div
                  className={`border-2 rounded-xl p-3.5 cursor-pointer transition-all duration-200 ${purchaseType === "subscribe" ? "border-[oklch(0.58_0.13_45)] bg-[oklch(0.97_0.03_80)]" : "border-[oklch(0.88_0.02_80)] bg-white hover:border-[oklch(0.78_0.04_80)]"}`}
                  onClick={() => setPurchaseType("subscribe")}
                  role="radio"
                  aria-checked={purchaseType === "subscribe"}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${purchaseType === "subscribe" ? "border-[oklch(0.58_0.13_45)]" : "border-[oklch(0.72_0.04_55)]"}`}>
                        {purchaseType === "subscribe" && <div className="w-2 h-2 rounded-full bg-[oklch(0.58_0.13_45)]" />}
                      </div>
                      <span className="font-semibold text-sm text-[oklch(0.22_0.04_55)]">Subscribe &amp; Save 15%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[oklch(0.62_0.04_55)] line-through">${product.price.toFixed(2)}</span>
                      <span className="font-bold text-[oklch(0.58_0.13_45)]">${subscribePrice.toFixed(2)}</span>
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">Save 15%</span>
                    </div>
                  </div>
                  {purchaseType === "subscribe" && (
                    <>
                      <div className="relative mb-3">
                        <select
                          className="w-full border border-[oklch(0.88_0.02_80)] rounded-lg text-sm text-[oklch(0.22_0.04_55)] px-3 py-2.5 bg-white appearance-none pr-8 cursor-pointer"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                        >
                          {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.52_0.04_55)] pointer-events-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                        {enrichment.subscribeChips.map((chip) => (
                          <div key={chip} className="flex items-center gap-1.5">
                            <Check size={11} strokeWidth={3} className="text-[oklch(0.58_0.13_45)] flex-shrink-0" />
                            <span className="text-[11px] text-[oklch(0.32_0.04_55)]">{chip}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div
                  className={`border-2 rounded-xl p-3.5 cursor-pointer transition-all duration-200 ${purchaseType === "onetime" ? "border-[oklch(0.58_0.13_45)] bg-[oklch(0.97_0.03_80)]" : "border-[oklch(0.88_0.02_80)] bg-white hover:border-[oklch(0.78_0.04_80)]"}`}
                  onClick={() => setPurchaseType("onetime")}
                  role="radio"
                  aria-checked={purchaseType === "onetime"}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${purchaseType === "onetime" ? "border-[oklch(0.58_0.13_45)]" : "border-[oklch(0.72_0.04_55)]"}`}>
                        {purchaseType === "onetime" && <div className="w-2 h-2 rounded-full bg-[oklch(0.58_0.13_45)]" />}
                      </div>
                      <span className="font-medium text-sm text-[oklch(0.22_0.04_55)]">One Time</span>
                    </div>
                    <span className="font-bold text-[oklch(0.22_0.04_55)]">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              {/* ⑤ ATC */}
              <button
                onClick={() => !product.soldOut && !isAdding && onAddToCart(product, purchaseType === "subscribe")}
                disabled={product.soldOut || isAdding}
                className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 mb-3 ${
                  product.soldOut ? "bg-[oklch(0.88_0.02_80)] text-[oklch(0.62_0.04_55)] cursor-not-allowed"
                  : isSuccess ? "bg-[oklch(0.48_0.14_145)] text-white"
                  : "bg-[oklch(0.22_0.04_55)] text-white hover:bg-[oklch(0.58_0.13_45)] active:scale-[0.98]"
                }`}
                data-shopify-atc
                data-shopify-variant-id={product.shopifyVariantId}
                data-shopify-selling-plan={purchaseType === "subscribe" ? "RECHARGE_SELLING_PLAN_ID" : ""}
              >
                {product.soldOut ? "Sold Out"
                  : isAdding ? (
                    <><svg className="spinner-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>Adding...</>
                  ) : isSuccess ? (
                    <><Check size={16} strokeWidth={3} />Added to Cart!</>
                  ) : (
                    `Add to Cart — $${displayPrice.toFixed(2)}`
                  )}
              </button>
              {/* Payment icons */}
              <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap">
                {PAYMENT_ICONS.map((p) => (
                  <div key={p.label} className="rounded px-2 py-1 text-[9px] font-bold" style={{ backgroundColor: p.bg, color: p.color }}>{p.label}</div>
                ))}
              </div>
              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 mb-5 flex-wrap">
                {[
                  { icon: <Truck size={13} />, label: "Free over $50" },
                  { icon: <RefreshCw size={13} />, label: "30-day returns" },
                  { icon: <Shield size={13} />, label: "3rd-party tested" },
                  { icon: <Lock size={13} />, label: "Secure checkout" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-1.5 text-[oklch(0.52_0.04_55)]">
                    {t.icon}
                    <span className="text-[11px]">{t.label}</span>
                  </div>
                ))}
              </div>
              {/* ⑥ Featured review */}
              <div className="bg-[oklch(0.97_0.02_80)] rounded-xl p-4 border border-[oklch(0.90_0.02_80)] mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ backgroundColor: product.accentColor }}>
                    {enrichment.featuredReview.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-[oklch(0.22_0.04_55)]">{enrichment.featuredReview.name}</span>
                      {enrichment.featuredReview.location && <span className="text-xs text-[oklch(0.62_0.04_55)]">{enrichment.featuredReview.location}</span>}
                    </div>
                    <div className="flex gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-xs text-[oklch(0.32_0.04_55)] leading-relaxed">{enrichment.featuredReview.text}</p>
                  </div>
                </div>
              </div>

              {/* ⑦ Frequently Bought Together */}
              {pairingProduct && (
                <div className="border border-[oklch(0.88_0.02_80)] rounded-xl overflow-hidden">
                  <div className="bg-[oklch(0.22_0.04_55)] px-4 py-2.5">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Frequently Bought Together</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {/* Product A */}
                      <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-[oklch(0.90_0.02_80)]">
                          <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-semibold text-[oklch(0.22_0.04_55)] text-center leading-tight truncate w-full text-center">{product.name}</span>
                        <span className="text-[10px] text-[oklch(0.52_0.04_55)]">${product.price.toFixed(2)}</span>
                      </div>
                      {/* Plus */}
                      <div className="w-6 h-6 rounded-full bg-[oklch(0.92_0.02_80)] flex items-center justify-center flex-shrink-0">
                        <span className="text-[oklch(0.42_0.04_55)] font-bold text-xs leading-none">+</span>
                      </div>
                      {/* Product B */}
                      <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-[oklch(0.90_0.02_80)]">
                          <img src={pairingProduct.img} alt={pairingProduct.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-semibold text-[oklch(0.22_0.04_55)] text-center leading-tight truncate w-full text-center">{pairingProduct.name}</span>
                        <span className="text-[10px] text-[oklch(0.52_0.04_55)]">${pairingProduct.price.toFixed(2)}</span>
                      </div>
                      {/* Equals */}
                      <div className="w-6 h-6 rounded-full bg-[oklch(0.92_0.02_80)] flex items-center justify-center flex-shrink-0">
                        <span className="text-[oklch(0.42_0.04_55)] font-bold text-xs leading-none">=</span>
                      </div>
                      {/* Bundle total */}
                      <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-[oklch(0.97_0.03_80)] border-2 border-dashed border-[oklch(0.78_0.08_80)] flex flex-col items-center justify-center">
                          <span className="text-[9px] font-bold text-[oklch(0.58_0.13_45)] leading-tight">Bundle</span>
                          <span className="text-[11px] font-black text-[oklch(0.22_0.04_55)]">${(product.price + pairingProduct.price).toFixed(2)}</span>
                        </div>
                        <span className="text-[10px] text-[oklch(0.52_0.04_55)]">Both items</span>
                        <span className="text-[9px] font-bold text-[oklch(0.58_0.13_45)]">Save 15% w/ sub</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[oklch(0.42_0.04_55)] mb-3 text-center italic">"{enrichment.pairingReason}"</p>
                    <button
                      onClick={() => {
                        if (!fbtAdded) {
                          onAddToCart(pairingProduct, purchaseType === "subscribe");
                          setFbtAdded(true);
                        }
                      }}
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                        fbtAdded
                          ? "bg-[oklch(0.48_0.14_145)] text-white"
                          : "bg-[oklch(0.97_0.03_80)] border-2 border-[oklch(0.58_0.13_45)] text-[oklch(0.58_0.13_45)] hover:bg-[oklch(0.94_0.04_80)]"
                      }`}
                    >
                      {fbtAdded ? (
                        <><Check size={14} strokeWidth={3} />{pairingProduct.name} Added!</>
                      ) : (
                        <><ShoppingCart size={14} />Add {pairingProduct.name} to Cart</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
