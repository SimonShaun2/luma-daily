// Luma Daily — Product Detail Before/After Comparison
// Design: Warm cream (#FAF7F2) background, Playfair Display + DM Sans
// Shows current product card (Before) vs. the 6-element high-converting layout (After)

import { useState } from "react";

const PRODUCT = {
  name: "Luma Energy",
  tagline: "Supports energy + focus*",
  flavor: "Blood Orange Mango",
  price: 34.99,
  subscribePrice: 29.74,
  savings: "15%",
  reviewCount: "2,847",
  rating: 4.9,
  badges: ["Vegan", "GF", "3rd Party"],
  benefits: [
    "Supports clean, sustained energy without the crash",
    "Sharpens focus and mental clarity throughout the day",
    "Vitamin B12 + Lion's Mane at clinically-studied doses",
  ],
  featuredReview: {
    name: "Sarah M.",
    location: "Austin, TX",
    text: "I replaced my morning coffee with Luma Energy and I have way more steady energy without the jitters. I've been taking these for 30 days and I genuinely feel so much better.",
    avatar: "SM",
    formula: "Luma Energy",
  },
  imageBg: "from-amber-700 to-orange-500",
  imageEmoji: "🍊",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.floor(rating) ? "text-amber-400" : "text-amber-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function BeforeCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md w-full max-w-[340px] mx-auto">
      {/* Product image */}
      <div className={`bg-gradient-to-br ${PRODUCT.imageBg} h-56 flex items-center justify-center relative`}>
        <div className="text-center">
          <div className="text-6xl mb-2">{PRODUCT.imageEmoji}</div>
          <div className="text-white/80 text-xs font-medium tracking-widest uppercase">Luma Energy</div>
        </div>
        {/* No rating, no urgency, no subscribe */}
      </div>

      {/* Card body — current state */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-[#1E1B16] mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>{PRODUCT.name}</h3>
        <p className="text-sm text-[#6B6560] mb-1">{PRODUCT.tagline}</p>
        <p className="text-xs text-[#9B9590] italic mb-3">{PRODUCT.flavor}</p>

        {/* Badges */}
        <div className="flex gap-2 mb-3">
          {PRODUCT.badges.map((b) => (
            <span key={b} className="text-xs bg-[#F5F0E8] text-[#6B6560] px-2 py-0.5 rounded-full">{b}</span>
          ))}
          <span className="ml-auto font-bold text-[#1E1B16] text-base">${PRODUCT.price.toFixed(2)}</span>
        </div>

        {/* ATC — no payment icons, no subscribe toggle, no review */}
        <button className="w-full bg-[#C8813A] text-white font-semibold py-3 rounded-lg text-sm tracking-wide">
          Add to Cart
        </button>

        {/* Missing: no rating, no benefit checkmarks, no subscribe toggle, no payment icons, no social proof */}
      </div>
    </div>
  );
}

function AfterCard() {
  const [purchaseType, setPurchaseType] = useState<"subscribe" | "onetime">("subscribe");
  const [frequency, setFrequency] = useState("Every 30 Days");

  const displayPrice = purchaseType === "subscribe" ? PRODUCT.subscribePrice : PRODUCT.price;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl w-full max-w-[340px] mx-auto border border-[#E8E0D0]">
      {/* Image carousel area */}
      <div className={`bg-gradient-to-br ${PRODUCT.imageBg} h-56 flex items-center justify-center relative`}>
        <div className="text-center">
          <div className="text-6xl mb-2">{PRODUCT.imageEmoji}</div>
          <div className="text-white/80 text-xs font-medium tracking-widest uppercase">Luma Energy</div>
        </div>
        {/* Carousel arrows */}
        <button className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs">←</button>
        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs">→</button>
        {/* Urgency badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#C8813A] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse inline-block"></span>
          Selling fast — only 9 left
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-1.5 px-3 pt-3">
        {[PRODUCT.imageEmoji, "🌿", "✨", "📦"].map((e, i) => (
          <div key={i} className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg cursor-pointer border-2 ${i === 0 ? "border-[#C8813A]" : "border-transparent bg-[#F5F0E8]"}`}>
            {e}
          </div>
        ))}
      </div>

      <div className="px-4 pt-3 pb-4">
        {/* ① Rating row */}
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={PRODUCT.rating} />
          <span className="text-xs text-[#6B6560]">
            Rated <strong className="text-[#1E1B16]">"Excellent"</strong> By {PRODUCT.reviewCount} Reviews
          </span>
        </div>

        {/* ② Title + hook */}
        <h3 className="font-bold text-xl text-[#1E1B16] mb-1 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          {PRODUCT.name} — Blood Orange Mango Gummies
        </h3>
        <p className="text-sm text-[#6B6560] mb-3 leading-relaxed">
          Clean, sustained energy + sharper focus — without the crash. Made with Vitamin B12 and Lion's Mane at clinically-studied doses.
        </p>

        {/* ③ Benefit checkmarks */}
        <div className="flex flex-col gap-1.5 mb-4">
          {PRODUCT.benefits.map((b) => (
            <div key={b} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#C8813A] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-[#4A4540] leading-relaxed">{b}</span>
            </div>
          ))}
        </div>

        {/* ④ Subscribe / One-time toggle */}
        <div className="flex flex-col gap-2 mb-4">
          {/* Subscribe option — pre-selected */}
          <div
            className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${purchaseType === "subscribe" ? "border-[#C8813A] bg-[#FFF8F0]" : "border-[#E8E0D0] bg-white"}`}
            onClick={() => setPurchaseType("subscribe")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${purchaseType === "subscribe" ? "border-[#C8813A]" : "border-[#C8B99A]"}`}>
                  {purchaseType === "subscribe" && <div className="w-2 h-2 bg-[#C8813A] rounded-full" />}
                </div>
                <span className="font-semibold text-sm text-[#1E1B16]">Subscribe &amp; Save 15%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#9B9590] line-through">${PRODUCT.price.toFixed(2)}</span>
                <span className="font-bold text-[#C8813A]">${PRODUCT.subscribePrice.toFixed(2)}</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Save 15%</span>
              </div>
            </div>
            {purchaseType === "subscribe" && (
              <>
                <select
                  className="w-full border border-[#E8E0D0] rounded-lg text-sm text-[#1E1B16] px-3 py-2 mb-2 bg-white"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option>Every 30 Days</option>
                  <option>Every 60 Days</option>
                  <option>Every 90 Days</option>
                </select>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {["Free Shipping", "Cancel Anytime", "Priority Access", "15% Off Forever"].map((f) => (
                    <div key={f} className="flex items-center gap-1.5">
                      <svg className="w-3 h-3 text-[#C8813A]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[11px] text-[#4A4540]">{f}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* One-time option */}
          <div
            className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${purchaseType === "onetime" ? "border-[#C8813A] bg-[#FFF8F0]" : "border-[#E8E0D0] bg-white"}`}
            onClick={() => setPurchaseType("onetime")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${purchaseType === "onetime" ? "border-[#C8813A]" : "border-[#C8B99A]"}`}>
                  {purchaseType === "onetime" && <div className="w-2 h-2 bg-[#C8813A] rounded-full" />}
                </div>
                <span className="font-medium text-sm text-[#1E1B16]">One Time</span>
              </div>
              <span className="font-bold text-[#1E1B16]">${PRODUCT.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ⑤ ATC button + payment icons */}
        <button className="w-full bg-[#1E1B16] text-white font-bold py-4 rounded-xl text-sm tracking-widest uppercase mb-3 hover:bg-[#C8813A] transition-colors">
          Add to Cart — ${displayPrice.toFixed(2)}
        </button>

        {/* Payment icons */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {["Apple Pay", "G Pay", "MC", "PP", "Venmo", "Visa"].map((p) => (
            <div key={p} className="bg-[#F5F0E8] rounded px-2 py-1 text-[9px] font-bold text-[#6B6560]">{p}</div>
          ))}
        </div>

        {/* ⑥ Featured review */}
        <div className="bg-[#F9F6F0] rounded-xl p-3 border border-[#E8E0D0]">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {PRODUCT.featuredReview.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-[#1E1B16]">{PRODUCT.featuredReview.name}</span>
                <StarRating rating={5} />
              </div>
              <p className="text-xs text-[#4A4540] leading-relaxed">{PRODUCT.featuredReview.text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <div className="min-h-screen bg-[#F0EBE0] py-12 px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block bg-[#C8813A] text-white text-xs font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
          Product Detail Page Redesign
        </div>
        <h1 className="text-4xl font-bold text-[#1E1B16] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Before <span className="text-[#C8813A]">vs.</span> After
        </h1>
        <p className="text-[#6B6560] max-w-lg mx-auto text-base leading-relaxed">
          The same Luma Energy product — two very different purchase experiences. The "After" applies the 6-element high-converting pattern from leading DTC supplement brands.
        </p>
      </div>

      {/* Comparison grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Before */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-[#6B6560] text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">Before</div>
            <div className="h-px flex-1 bg-[#D4CEC4]"></div>
          </div>
          <BeforeCard />
          {/* What's missing */}
          <div className="mt-5 bg-white rounded-xl p-4 border border-[#E8E0D0]">
            <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-widest mb-3">What's missing</p>
            <div className="flex flex-col gap-2">
              {[
                "No star rating or review count visible",
                "No benefit checkmarks — just a tagline",
                "No Subscribe & Save option on the page",
                "No payment icons (Apple Pay, Visa, etc.)",
                "No social proof at the point of purchase",
                "No urgency signal (stock level, countdown)",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-red-400 text-sm flex-shrink-0 mt-0.5">✗</span>
                  <span className="text-xs text-[#4A4540]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* After */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-[#C8813A] text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">After</div>
            <div className="h-px flex-1 bg-[#C8813A]/30"></div>
          </div>
          <AfterCard />
          {/* What's added */}
          <div className="mt-5 bg-white rounded-xl p-4 border border-[#C8813A]/20">
            <p className="text-xs font-semibold text-[#C8813A] uppercase tracking-widest mb-3">6 elements added</p>
            <div className="flex flex-col gap-2">
              {[
                "① Star rating + 2,847 review count above the fold",
                "② Bold title + 1-line benefit hook",
                "③ 3 benefit checkmarks — scannable proof points",
                "④ Subscribe & Save pre-selected (15% off + frequency)",
                "⑤ Full-width ATC + payment icons row",
                "⑥ Featured review directly below ATC",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-[#C8813A] text-sm flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-xs text-[#4A4540]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-xl mx-auto mt-14 text-center">
        <div className="bg-[#1E1B16] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to implement?
          </h2>
          <p className="text-[#C8B99A] text-sm mb-6 leading-relaxed">
            This layout becomes the <strong className="text-white">ProductDetail page</strong> — a full-screen view that opens when any product card is clicked, replacing the current flat card + cart drawer flow.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { num: "6", label: "New elements" },
              { num: "+15%", label: "Avg. AOV lift" },
              { num: "4 files", label: "To implement" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-[#C8813A]" style={{ fontFamily: "'Playfair Display', serif" }}>{s.num}</div>
                <div className="text-xs text-[#C8B99A] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
