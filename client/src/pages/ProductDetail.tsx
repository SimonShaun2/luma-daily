/*
 * LUMA DAILY — Product Detail Page
 * Design: Warm Editorial — full PDP with image, ingredients, reviews, subscribe CTA
 * Route: /products/:slug
 */

import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Star, Check, ShoppingBag, ChevronDown, ChevronRight,
  Shield, Truck, RefreshCw, Leaf, Award, ArrowRight
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/lib/products";
import { toast } from "sonner";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { getMonthlySellingPlan } from "@/lib/shopify";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

function ReviewStars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(rating) ? "#C8813A" : "none"}
          stroke={i <= Math.round(rating) ? "none" : "#C8813A"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

const mockReviews = [
  {
    name: "Sarah M.",
    location: "New York, NY",
    stars: 5,
    date: "April 2026",
    title: "Finally, a supplement that actually works",
    text: "I've tried so many supplements and most feel like expensive placebos. This one is different — I noticed a real difference within the first week. The flavor is genuinely delicious too.",
    verified: true,
  },
  {
    name: "James T.",
    location: "Austin, TX",
    stars: 5,
    date: "March 2026",
    title: "Clean energy, no crash",
    text: "I was skeptical about gummies for adults, but the formula is legitimately effective. No jitters, no crash — just clean, sustained focus all morning. The ingredient transparency sold me.",
    verified: true,
  },
  {
    name: "Priya K.",
    location: "San Francisco, CA",
    stars: 4,
    date: "March 2026",
    title: "Love the subscription model",
    text: "The subscription makes it so easy. My ritual is stocked automatically and I never have to think about it. Knocked one star off only because I wish the pouch was resealable.",
    verified: true,
  },
];

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { addItem, openCart } = useCart();
  const { getProduct, getVariantId } = useShopifyProducts();
  const [isSubscription, setIsSubscription] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>("ingredients");

  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-700 text-3xl text-[#1E1B16] mb-4">Product not found</h1>
          <button onClick={() => navigate("/shop")} className="btn-amber">
            Browse All Products
          </button>
        </div>
      </div>
    );
  }

  const price = isSubscription ? product.subscribePrice : product.price;
  const savings = isSubscription ? (product.price - product.subscribePrice).toFixed(2) : null;
  const shopifyHandle = `luma-${product.slug}`;
  const shopifyProduct = getProduct(shopifyHandle);
  const sellingPlan = shopifyProduct ? getMonthlySellingPlan(shopifyProduct) : null;

  const handleAddToCart = async () => {
    const shopifyVariantId = shopifyProduct?.variants.edges[0]?.node.id ?? (await getVariantId(shopifyHandle));

    if (!shopifyVariantId) {
      toast.error("This product is not connected to Shopify yet.");
      return;
    }

    for (let i = 0; i < quantity; i += 1) {
      await addItem({
        variantId: shopifyVariantId,
        handle: shopifyHandle,
        name: product.name,
        flavor: product.flavor || product.name,
        price: price,
        originalPrice: product.originalPrice,
        image: shopifyProduct?.images.edges[0]?.node.url ?? product.image,
        color: product.color,
        isSubscription,
        sellingPlanId: isSubscription ? sellingPlan?.id : undefined,
      });
    }

    openCart();
    toast.success(`Luma ${product.name} added to your ritual`);
  };

  const accordionSections = [
    {
      id: "ingredients",
      title: "Ingredients & Doses",
      content: (
        <div className="space-y-3 pt-2">
          {product.ingredients.map((ing) => (
            <div key={ing.name} className="flex items-start gap-4 py-3 border-b border-[#1E1B16]/8 last:border-0">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-body font-600 text-sm text-[#1E1B16]">{ing.name}</span>
                  <span
                    className="font-body text-xs font-600 px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: product.bgColor, color: product.textColor }}
                  >
                    {ing.dose}
                  </span>
                </div>
                <p className="font-body text-xs text-[#1E1B16]/55">{ing.benefit}</p>
              </div>
            </div>
          ))}
          <p className="font-body text-xs text-[#1E1B16]/40 pt-2">
            *No proprietary blends. Every dose is listed exactly as formulated.
          </p>
        </div>
      ),
    },
    {
      id: "how-to-use",
      title: "How to Use",
      content: (
        <div className="pt-2">
          <p className="font-body text-sm text-[#1E1B16]/65 leading-relaxed">{product.howToUse}</p>
          <div className="mt-4 p-4 bg-[#C8813A]/8 rounded-xl">
            <p className="font-body text-xs text-[#C8813A] font-600">Pro tip</p>
            <p className="font-body text-xs text-[#1E1B16]/60 mt-1">
              Pair with other Luma formulas for a complete daily ritual. Our bundles are designed for exactly this purpose.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "certifications",
      title: "Quality & Certifications",
      content: (
        <div className="pt-2 grid grid-cols-2 gap-3">
          {product.certifications.map((cert) => (
            <div key={cert} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#C8813A]/15 flex items-center justify-center shrink-0">
                <Check size={10} className="text-[#C8813A]" />
              </div>
              <span className="font-body text-sm text-[#1E1B16]/70">{cert}</span>
            </div>
          ))}
          <div className="col-span-2 mt-2 pt-3 border-t border-[#1E1B16]/8">
            <p className="font-body text-xs text-[#1E1B16]/45">
              Every batch is tested by an independent ISO-certified lab. Certificates of Analysis available on request.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: (
        <div className="pt-2 space-y-3">
          {[
            { icon: <Truck size={14} />, title: "Free shipping on orders over $60", desc: "All subscription orders ship free, always." },
            { icon: <RefreshCw size={14} />, title: "60-day money-back guarantee", desc: "Not satisfied? We'll refund your first order, no questions asked." },
            { icon: <Shield size={14} />, title: "Secure checkout", desc: "256-bit SSL encryption on all transactions." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[#C8813A]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#C8813A]">
                {item.icon}
              </div>
              <div>
                <div className="font-body font-600 text-sm text-[#1E1B16]">{item.title}</div>
                <div className="font-body text-xs text-[#1E1B16]/50">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#1E1B16]/8">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors font-body text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#C8813A] flex items-center justify-center">
                <span className="text-white font-display font-700 text-xs">L</span>
              </div>
              <span className="font-display font-700 text-lg text-[#1E1B16]">Luma Daily</span>
            </button>
            <button onClick={() => navigate("/shop")} className="font-body text-sm text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors">
              All Products
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container pt-4 pb-0">
        <nav className="flex items-center gap-2 text-xs font-body text-[#1E1B16]/40">
          <button onClick={() => navigate("/")} className="hover:text-[#C8813A] transition-colors">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate("/shop")} className="hover:text-[#C8813A] transition-colors">Products</button>
          <ChevronRight size={12} />
          <span className="text-[#1E1B16]/70">Luma {product.name}</span>
        </nav>
      </div>

      {/* Main PDP */}
      <div className="container py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="rounded-3xl overflow-hidden aspect-square flex items-center justify-center"
              style={{ backgroundColor: product.bgColor }}
            >
              {product.badge && (
                <div
                  className="absolute top-6 left-6 z-10 text-xs font-body font-600 px-3 py-1.5 rounded-full text-white"
                  style={{ backgroundColor: product.color }}
                >
                  {product.badge}
                </div>
              )}
              <img
                src={product.image}
                alt={`Luma ${product.name} — ${product.flavor}`}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Trust badges below image */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: <Shield size={14} />, text: "Third-party tested" },
                { icon: <Leaf size={14} />, text: "Vegan & clean" },
                { icon: <Award size={14} />, text: "60-day guarantee" },
              ].map((b) => (
                <div
                  key={b.text}
                  className="flex flex-col items-center gap-1.5 bg-white rounded-xl p-3 text-center shadow-sm"
                >
                  <span className="text-[#C8813A]">{b.icon}</span>
                  <span className="font-body text-[10px] text-[#1E1B16]/60 leading-tight">{b.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ReviewStars rating={product.rating} size={14} />
                <span className="font-body text-sm text-[#1E1B16]/55">
                  {product.rating} ({product.reviews.toLocaleString()} reviews)
                </span>
              </div>
              <h1 className="font-display font-800 text-4xl lg:text-5xl text-[#1E1B16] mb-2">
                Luma {product.name}
              </h1>
              <p className="font-body text-lg text-[#1E1B16]/55 italic mb-3">{product.headline}</p>
              {product.flavor && (
                <span
                  className="inline-block text-xs font-body font-600 px-3 py-1 rounded-full"
                  style={{ backgroundColor: product.bgColor, color: product.textColor }}
                >
                  {product.flavor}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="font-body text-base text-[#1E1B16]/65 leading-relaxed mb-8">
              {product.longDescription}
            </p>

            {/* Purchase type toggle */}
            <div className="bg-white rounded-2xl p-1 flex mb-6 shadow-sm border border-[#E8E0D4]">
              <button
                onClick={() => setIsSubscription(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-body text-sm font-600 transition-all duration-200 ${
                  isSubscription
                    ? "bg-[#1E1B16] text-white shadow-sm"
                    : "text-[#1E1B16]/60 hover:text-[#1E1B16]"
                }`}
              >
                Subscribe & Save 20%
              </button>
              <button
                onClick={() => setIsSubscription(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-body text-sm font-600 transition-all duration-200 ${
                  !isSubscription
                    ? "bg-[#1E1B16] text-white shadow-sm"
                    : "text-[#1E1B16]/60 hover:text-[#1E1B16]"
                }`}
              >
                One-Time Purchase
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display font-700 text-3xl text-[#1E1B16]">
                ${price.toFixed(2)}
              </span>
              {isSubscription && (
                <span className="font-body text-base text-[#1E1B16]/40 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
              {isSubscription && savings && (
                <span className="font-body text-sm font-600 text-[#C8813A]">
                  Save ${savings}/mo
                </span>
              )}
            </div>
            {isSubscription && (
              <p className="font-body text-xs text-[#1E1B16]/45 mb-6">
                Delivered monthly · Free shipping · Cancel anytime
              </p>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border border-[#E8E0D4] rounded-full overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors font-body text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center font-body font-600 text-[#1E1B16]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-12 flex items-center justify-center text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors font-body text-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="btn-amber flex-1 justify-center text-sm py-3"
              >
                <ShoppingBag size={16} />
                Add to Ritual — ${(price * quantity).toFixed(2)}
              </button>
            </div>

            {/* Subscribe benefits */}
            {isSubscription && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-[#C8813A]/8 rounded-2xl p-4 mb-6"
              >
                <p className="font-body text-xs font-600 text-[#C8813A] mb-2">Subscription benefits</p>
                <div className="space-y-1.5">
                  {["20% off every order", "Free shipping always", "Pause or cancel anytime", "Priority customer support"].map((b) => (
                    <div key={b} className="flex items-center gap-2">
                      <Check size={11} className="text-[#C8813A] shrink-0" />
                      <span className="font-body text-xs text-[#1E1B16]/65">{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Accordion sections */}
            <div className="border-t border-[#1E1B16]/10">
              {accordionSections.map((section) => (
                <div key={section.id} className="border-b border-[#1E1B16]/10">
                  <button
                    onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <span className="font-body font-600 text-sm text-[#1E1B16] group-hover:text-[#C8813A] transition-colors">
                      {section.title}
                    </span>
                    <motion.div
                      animate={{ rotate: openSection === section.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#1E1B16]/40"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openSection === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5">{section.content}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="py-16 bg-[#F5EDD8]/40">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display font-700 text-3xl text-[#1E1B16] mb-1">Customer Reviews</h2>
              <div className="flex items-center gap-3">
                <ReviewStars rating={product.rating} />
                <span className="font-body text-sm text-[#1E1B16]/55">
                  {product.rating} out of 5 · {product.reviews.toLocaleString()} reviews
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {mockReviews.map((review, i) => (
              <motion.div
                key={review.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.1}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <ReviewStars rating={review.stars} size={13} />
                  {review.verified && (
                    <span className="font-body text-[10px] text-[#C8813A] font-600 flex items-center gap-1">
                      <Check size={10} /> Verified
                    </span>
                  )}
                </div>
                <h4 className="font-body font-600 text-sm text-[#1E1B16] mb-2">{review.title}</h4>
                <p className="font-body text-sm text-[#1E1B16]/65 leading-relaxed mb-4 italic">"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-body font-600 text-xs text-[#1E1B16]">{review.name}</div>
                    <div className="font-body text-[10px] text-[#1E1B16]/40">{review.location}</div>
                  </div>
                  <span className="font-body text-[10px] text-[#1E1B16]/35">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container">
          <h2 className="font-display font-700 text-3xl text-[#1E1B16] mb-8">
            Complete your ritual
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products
              .filter((p) => p.slug !== product.slug)
              .slice(0, 5)
              .map((p, i) => (
                <motion.button
                  key={p.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i * 0.08}
                  onClick={() => navigate(`/products/${p.slug}`)}
                  className="group text-left"
                >
                  <div
                    className="rounded-2xl overflow-hidden aspect-square mb-3 transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{ backgroundColor: p.bgColor }}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-display font-700 text-base text-[#1E1B16] mb-0.5">Luma {p.name}</div>
                  <div className="font-body text-xs text-[#1E1B16]/50 italic mb-1">{p.tagline}</div>
                  <div className="font-body font-600 text-sm text-[#C8813A]">${Number(p.price).toFixed(2)}</div>
                </motion.button>
              ))}
          </div>
        </div>
      </section>

      {/* Okendo Reviews Integration Slot */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto rounded-3xl border border-[#E8E0D4] bg-[#FAF7F2] p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
              <div>
                <p className="font-body text-xs font-600 tracking-[0.18em] uppercase text-[#C8813A] mb-2">
                  Verified rituals
                </p>
                <h2 className="font-display font-700 text-3xl text-[#1E1B16]">
                  Customer reviews
                </h2>
              </div>
              <p className="font-body text-sm text-[#1E1B16]/55 max-w-sm">
                Okendo reviews will render here once the subscriber ID is configured.
              </p>
            </div>
            <div
              data-oke-widget
              data-oke-reviews-product-id={shopifyProduct?.id ?? product.id}
              data-oke-reviews-product-handle={shopifyHandle}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[#1A1510]">
        <div className="container text-center">
          <h2 className="font-display font-700 text-3xl text-[#FAF7F2] mb-3">
            Not sure which formula is right for you?
          </h2>
          <p className="font-body text-base text-[#FAF7F2]/55 mb-6 max-w-md mx-auto">
            Take our 60-second quiz and we'll build your personalized ritual.
          </p>
          <button onClick={() => navigate("/quiz")} className="btn-amber">
            Take the Ritual Quiz <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
