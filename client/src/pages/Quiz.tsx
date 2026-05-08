/**
 * Quiz.tsx — "Find My Ritual" quiz flow
 * Design: Warm Editorial — Playfair Display + DM Sans, cream #FAF7F2 base, amber #C8813A accents
 * 4 steps: Wellness Goal → Supplement Timing → Secondary Support → Results
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ShoppingCart, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { products, type Product } from "@/lib/products";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

interface KlaviyoQueue {
  push: (event: unknown[]) => void;
}

declare global {
  interface Window {
    _learnq?: KlaviyoQueue;
  }
}

// ── Types ────────────────────────────────────────────────────────────────────
interface QuizOption {
  id: string;
  emoji: string;
  label: string;
  description: string;
}

interface ProductRecommendation {
  name: string;
  emoji: string;
  timing: string;
  timingColor: string;
  description: string;
  price: number;
  color: string;
  image?: string;
}

// ── Quiz Data ─────────────────────────────────────────────────────────────────
const STEP1_OPTIONS: QuizOption[] = [
  { id: "energy", emoji: "⚡", label: "More energy", description: "Feel sharp and motivated all day" },
  { id: "calm", emoji: "🌤️", label: "Less stress", description: "Stay calm, focused, and grounded" },
  { id: "sleep", emoji: "🌙", label: "Better sleep", description: "Fall asleep faster, wake rested" },
  { id: "glow", emoji: "✨", label: "Healthier skin", description: "Glow from the inside out" },
];

const STEP2_OPTIONS: QuizOption[] = [
  { id: "morning", emoji: "🌅", label: "Morning", description: "With breakfast or coffee" },
  { id: "midday", emoji: "☀️", label: "Midday", description: "Lunch or afternoon break" },
  { id: "evening", emoji: "🌙", label: "Evening", description: "After dinner or before bed" },
  { id: "flexible", emoji: "⏰", label: "Flexible", description: "Whenever I remember" },
];

const STEP3_OPTIONS: QuizOption[] = [
  { id: "gut", emoji: "🌿", label: "Gut health", description: "Digestion and comfort" },
  { id: "hair", emoji: "💪", label: "Hair + nails", description: "Strength and growth" },
  { id: "energy_crash", emoji: "⚡", label: "Energy crash", description: "Mid afternoon slump" },
  { id: "clarity", emoji: "💬", label: "Mental clarity", description: "Focus and concentration" },
];
const STEP4_OPTIONS: QuizOption[] = [
  { id: "beginner", emoji: "🌱", label: "Just starting out", description: "New to supplements, keeping it simple" },
  { id: "occasional", emoji: "🔄", label: "Occasional user", description: "I try but forget sometimes" },
  { id: "consistent", emoji: "📅", label: "Pretty consistent", description: "I have a routine but want to optimize" },
  { id: "committed", emoji: "🏆", label: "Fully committed", description: "Wellness is a daily priority for me" },
];

// ── Product Recommendation Logic ──────────────────────────────────────────────
function getRecommendations(
  primaryGoal: string,
  timing: string,
  secondary: string[]
): ProductRecommendation[] {
  const allProducts: Record<string, ProductRecommendation> = {
    energy: {
      name: "Luma Energy",
      emoji: "⚡",
      timing: "MORNING",
      timingColor: "#F59E0B",
      description: "Supports your natural energy levels and mental focus for a productive morning",
      price: 22.4,
      color: "#FEF3C7",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/NP8W4PN5hdBACVumhQ3AtE/luma_energy_bottle-cvYNKNP3tibNNfeoANANbe.webp",
    },
    calm: {
      name: "Luma Calm",
      emoji: "🍃",
      timing: "AFTERNOON",
      timingColor: "#6EE7B7",
      description: "Supports a calm, focused mind through the demands of your afternoon",
      price: 22.4,
      color: "#D1FAE5",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/NP8W4PN5hdBACVumhQ3AtE/luma_calm_bottle-4s8xH37yWtFyqjfCx7bpQB.webp",
    },
    sleep: {
      name: "Luma Sleep",
      emoji: "🌙",
      timing: "EVENING",
      timingColor: "#A78BFA",
      description: "Supports healthy wind down and more restful, restorative sleep quality",
      price: 22.4,
      color: "#EDE9FE",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/NP8W4PN5hdBACVumhQ3AtE/luma_sleep_bottle-eLiwUvYuG8USYuzG87CxLd.webp",
    },
    glow: {
      name: "Luma Glow",
      emoji: "✨",
      timing: "MORNING",
      timingColor: "#F472B6",
      description: "Nourishes skin from within with collagen-supporting botanicals and antioxidants",
      price: 22.4,
      color: "#FCE7F3",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/NP8W4PN5hdBACVumhQ3AtE/luma_glow_bottle-9BCZUpncy5AWUKKLLgZyRL.webp",
    },
    focus: {
      name: "Luma Focus",
      emoji: "🧠",
      timing: "MIDDAY",
      timingColor: "#60A5FA",
      description: "Sharpens concentration and mental clarity for sustained deep work",
      price: 22.4,
      color: "#DBEAFE",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/NP8W4PN5hdBACVumhQ3AtE/luma_focus_bottle-kntCt5H5rBn5mV9QKvrTPf.webp",
    },
  };

  const recs: ProductRecommendation[] = [];

  // Always add primary goal product
  if (allProducts[primaryGoal]) recs.push(allProducts[primaryGoal]);

  // Add secondary based on timing
  if (timing === "morning" && primaryGoal !== "energy") recs.push(allProducts.energy);
  else if ((timing === "midday" || timing === "flexible") && primaryGoal !== "calm") recs.push(allProducts.calm);
  else if (timing === "evening" && primaryGoal !== "sleep") recs.push(allProducts.sleep);

  // Add third based on secondary concerns
  if (secondary.includes("clarity") && !recs.find((r) => r.name === "Luma Focus")) {
    recs.push(allProducts.focus);
  } else if (secondary.includes("hair") && !recs.find((r) => r.name === "Luma Glow")) {
    recs.push(allProducts.glow);
  } else if (recs.length < 3) {
    // Fill with a complementary product
    const remaining = Object.values(allProducts).filter((p) => !recs.find((r) => r.name === p.name));
    if (remaining.length > 0) recs.push(remaining[0]);
  }

  return recs.slice(0, 3);
}

// ── Option Card ───────────────────────────────────────────────────────────────
function OptionCard({
  option,
  selected,
  onClick,
  multiSelect = false,
}: {
  option: QuizOption;
  selected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? "border-[#1E1B16] bg-[#F5EDD8]/60"
          : "border-[#E8E0D0] bg-white hover:border-[#C8813A]/40 hover:bg-[#FAF7F2]"
      }`}
    >
      {selected && (
        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#1E1B16] flex items-center justify-center">
          <Check size={11} className="text-white" strokeWidth={3} />
        </div>
      )}
      <div className="text-3xl mb-3">{option.emoji}</div>
      <div
        className={`font-semibold text-base mb-1 transition-colors ${
          selected ? "text-[#1E1B16]" : "text-[#1E1B16]"
        }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {option.label}
        {selected && (
          <span className="ml-2 inline-block w-0.5 h-4 bg-[#C8813A] align-middle" />
        )}
      </div>
      <div className="text-sm text-[#8B7355]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {option.description}
      </div>
    </motion.button>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ step, total, label }: { step: number; total: number; label: string }) {
  const pct = step === total ? 100 : Math.round(((step - 1) / total) * 100);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#8B7355] tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </span>
        <span className="text-xs text-[#8B7355]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {pct}%
        </span>
      </div>
      <div className="h-0.5 bg-[#E8E0D0] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#1E1B16] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ── Main Quiz Component ───────────────────────────────────────────────────────
export default function Quiz() {
  const [step, setStep] = useState(1);
  const [primaryGoal, setPrimaryGoal] = useState<string>("");
  const [timing, setTiming] = useState<string>("");
  const [secondary, setSecondary] = useState<string[]>([]);
  const [routine, setRoutine] = useState<string>("");
  const [cartCount] = useState(4);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [, navigate] = useLocation();
  const { addItem, openCart } = useCart();
  const { getProduct, getVariantId, getSellingPlanId } = useShopifyProducts();
  const totalSteps = 5;

  const toggleSecondary = (id: string) => {
    setSecondary((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

   const canAdvance = () => {
    if (step === 1) return primaryGoal !== "";
    if (step === 2) return timing !== "";
    if (step === 3) return true; // optional multi-select
    if (step === 4) return routine !== "";
    return false;
  };
  const handleNext = () => {
    if (step === totalSteps - 1) {
      // Last question answered — show results
      setShowResults(true);
    } else {
      setStep((s) => s + 1);
    }
  };
  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      setStep(totalSteps - 1);
    } else {
      setStep((s) => Math.max(1, s - 1));
    }
  };

  const recommendations = getRecommendations(primaryGoal, timing, secondary);
  const totalPrice = recommendations.reduce((sum, r) => sum + r.price, 0);
  const bundlePrice = +(totalPrice * 0.75).toFixed(2);

  const getRecommendedProducts = () =>
    recommendations
      .map((recommendation) =>
        products.find((product) => product.fullName === recommendation.name),
      )
      .filter((product): product is Product => Boolean(product));

  const addRecommendationsToCart = async (isSubscription: boolean) => {
    const selectedProducts = getRecommendedProducts();

    if (!selectedProducts.length) {
      toast.error("We could not match your ritual to Shopify products yet.");
      return;
    }

    try {
      for (const product of selectedProducts) {
        const handle = `luma-${product.slug}`;
        const shopifyProduct = getProduct(handle);
        const variantId = shopifyProduct?.variants.edges[0]?.node.id ?? (await getVariantId(handle));
        const sellingPlanId = isSubscription ? getSellingPlanId(handle) : "";

        if (!variantId) {
          throw new Error(`Luma ${product.name} is not connected to Shopify yet.`);
        }

        await addItem({
          variantId,
          handle,
          name: product.name,
          flavor: product.flavor || product.name,
          price: isSubscription ? product.subscribePrice : product.price,
          originalPrice: product.originalPrice,
          image: shopifyProduct?.images.edges[0]?.node.url ?? product.image,
          color: product.color,
          isSubscription: Boolean(isSubscription && sellingPlanId),
          sellingPlanId: sellingPlanId || undefined,
        });
      }

      openCart();
      toast.success("Your personalized ritual is in your cart.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add your ritual to cart.");
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E8E0D0]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <span className="flex items-center gap-1 cursor-pointer">
              <span
                className="text-xl font-bold text-[#1E1B16]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Luma
              </span>
              <span
                className="text-xl italic text-[#1E1B16]"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                {" "}Daily
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Shop All", href: "/shop" },
              { label: "Bundles", href: "/shop" },
              { label: "Ingredients", href: "/ingredients" },
              { label: "Reviews", href: "/#testimonials" },
              { label: "FAQ", href: "/#faq" },
              { label: "About", href: "/about" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className="text-sm text-[#5C4F3A] hover:text-[#1E1B16] transition-colors"
              >
                {item.label}
              </button>
            ))}
            <a
              href="#"
              className="text-sm text-[#1E1B16] font-semibold border-b-2 border-[#1E1B16] pb-0.5"
            >
              Find My Ritual
            </a>
          </nav>

          <button onClick={openCart} className="flex items-center gap-2 bg-[#1E1B16] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#2D2820] transition-colors">
            <ShoppingCart size={15} />
            Cart
          </button>
        </div>
      </header>

      {/* ── Quiz Body ── */}
      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={`step-${step}`}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Progress */}
                <ProgressBar
                  step={step}
                  total={totalSteps}
                  label={`Step ${step} of ${totalSteps}`}
                />

                {/* Step 1 */}
                {step === 1 && (
                  <>
                    <h1
                      className="text-3xl md:text-4xl font-bold text-[#1E1B16] mb-2 leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      What's your biggest wellness goal right now?
                    </h1>
                    <p className="text-[#8B7355] mb-8 text-sm">Select the one that feels most true today.</p>
                    <div className="grid grid-cols-2 gap-4">
                      {STEP1_OPTIONS.map((opt) => (
                        <OptionCard
                          key={opt.id}
                          option={opt}
                          selected={primaryGoal === opt.id}
                          onClick={() => setPrimaryGoal(opt.id)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <>
                    <h1
                      className="text-3xl md:text-4xl font-bold text-[#1E1B16] mb-2 leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      When during the day do you take supplements?
                    </h1>
                    <p className="text-[#8B7355] mb-8 text-sm">This helps us time your ritual perfectly.</p>
                    <div className="grid grid-cols-2 gap-4">
                      {STEP2_OPTIONS.map((opt) => (
                        <OptionCard
                          key={opt.id}
                          option={opt}
                          selected={timing === opt.id}
                          onClick={() => setTiming(opt.id)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <>
                    <h1
                      className="text-3xl md:text-4xl font-bold text-[#1E1B16] mb-2 leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Any other areas you'd love support?
                    </h1>
                    <p className="text-[#8B7355] mb-8 text-sm">Select all that apply.</p>
                    <div className="grid grid-cols-2 gap-4">
                      {STEP3_OPTIONS.map((opt) => (
                        <OptionCard
                          key={opt.id}
                          option={opt}
                          selected={secondary.includes(opt.id)}
                          onClick={() => toggleSecondary(opt.id)}
                          multiSelect
                        />
                      ))}
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <h1
                      className="text-3xl md:text-4xl font-bold text-[#1E1B16] mb-2 leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      How would you describe your wellness routine?
                    </h1>
                    <p className="text-[#8B7355] mb-8 text-sm">This helps us tailor the right starting point for you.</p>
                    <div className="grid grid-cols-2 gap-4">
                      {STEP4_OPTIONS.map((opt) => (
                        <OptionCard
                          key={opt.id}
                          option={opt}
                          selected={routine === opt.id}
                          onClick={() => setRoutine(opt.id)}
                        />
                      ))}
                    </div>
                  </>
                )}
                {/* Navigation */}
                <div className="flex items-center justify-between mt-10">
                  {step > 1 ? (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-sm text-[#5C4F3A] hover:text-[#1E1B16] transition-colors"
                    >
                      <ArrowLeft size={15} />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}
                  <button
                    onClick={() => canAdvance() && handleNext()}
                    className={`flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all ${
                      canAdvance()
                        ? "bg-[#1E1B16] text-white hover:bg-[#2D2820] cursor-pointer"
                        : "bg-[#E8E0D0] text-[#B0A090] cursor-not-allowed"
                    }`}
                  >
                    Next <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Results Screen ── */
              <motion.div
                key="results"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Progress — 100% */}
                <ProgressBar step={totalSteps} total={totalSteps} label="Your results" />

                {/* Header */}
                <div className="text-center mb-10">
                  <p
                    className="text-xs tracking-[0.2em] text-[#8B7355] uppercase mb-3"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Your Personalized Ritual
                  </p>
                  <h1
                    className="text-4xl md:text-5xl font-bold text-[#1E1B16] leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Your Daily{" "}
                    <em className="text-[#C8813A] not-italic" style={{ fontStyle: "italic" }}>
                      Ritual
                    </em>
                  </h1>
                  <p className="text-[#8B7355] mt-3 text-sm max-w-md mx-auto leading-relaxed">
                    Based on your goals, here's the daily ritual we've built for you. These three
                    formulas work together without ingredient overlap.
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#E8E0D0] mb-6" />

                {/* Product Recommendations */}
                <div className="space-y-3 mb-6">
                  {recommendations.map((product, i) => (
                    <motion.div
                      key={product.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.4 }}
                      className="flex items-center gap-4 bg-white border border-[#E8E0D0] rounded-2xl p-5"
                    >
                      {/* Timing badge */}
                      <div
                        className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider"
                        style={{
                          backgroundColor: product.timingColor + "30",
                          color: product.timingColor,
                        }}
                      >
                        {product.timing}
                      </div>

                      {/* Product bottle image */}
                      <div
                        className="shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-black/5"
                        style={{ backgroundColor: product.color }}
                      >
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">{product.emoji}</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-semibold text-[#1E1B16] text-base"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {product.name}
                        </div>
                        <div className="text-xs text-[#8B7355] mt-0.5 leading-relaxed">
                          {product.description}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right">
                        <div className="font-semibold text-[#1E1B16] text-base">
                          ${product.price.toFixed(2)}/mo
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bundle Savings Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="bg-[#D1FAE5] border border-[#6EE7B7]/40 rounded-2xl p-5 mb-6"
                >
                  <div className="font-semibold text-[#065F46] mb-1 text-sm">
                    Bundle savings unlocked — save 25%
                  </div>
                  <div className="text-xs text-[#047857] leading-relaxed">
                    Subscribe to your Daily {recommendations.length} Ritual bundle for ${bundlePrice}/mo instead of $
                    {totalPrice.toFixed(2)}. Cancel or adjust anytime. Free shipping every order.
                  </div>
                </motion.div>

                {/* Email capture */}
                {!emailSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8E0D4]"
                  >
                    <p className="text-sm font-semibold text-[#1E1B16] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Save your ritual recommendations
                    </p>
                    <p className="text-xs text-[#8B7355] mb-3">Get your personalized formula guide + 15% off your first order.</p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 border border-[#E8E0D4] rounded-xl px-3 py-2.5 text-sm text-[#1E1B16] placeholder:text-[#1E1B16]/30 focus:outline-none focus:border-[#C8813A] bg-white"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                      <button
                        onClick={() => {
                          if (!email.includes("@")) { toast.error("Please enter a valid email"); return; }
                          try {
                            window._learnq?.push(["identify", { $email: email }]);
                            window._learnq?.push([
                              "track",
                              "Quiz Completed",
                              {
                                primaryGoal,
                                timing,
                                secondary,
                                routine,
                                recommendations: recommendations.map((recommendation) => recommendation.name),
                              },
                            ]);
                          } catch {
                            // Klaviyo should never block quiz completion.
                          }
                          setEmailSubmitted(true);
                          toast.success("15% off code sent to " + email + "!");
                        }}
                        className="bg-[#C8813A] text-white px-4 py-2.5 rounded-xl text-sm font-600 hover:bg-[#A66A2A] transition-colors shrink-0"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Get 15% Off
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 rounded-2xl p-4 border border-green-200 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-600 text-green-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>15% off code sent!</p>
                      <p className="text-xs text-green-600">Check {email} for your discount code.</p>
                    </div>
                  </motion.div>
                )}
                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-[#1E1B16] text-white py-4 rounded-2xl text-base font-semibold hover:bg-[#2D2820] transition-colors cursor-pointer"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  onClick={() => addRecommendationsToCart(true)}
                >
                  Subscribe to My Daily Ritual — ${bundlePrice}/mo
                </motion.button>

                {/* One-time option */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center mt-4"
                >
                  <button onClick={() => addRecommendationsToCart(false)} className="text-sm text-[#8B7355] underline underline-offset-2 hover:text-[#1E1B16] transition-colors">
                    Or buy once for ${totalPrice.toFixed(2)} — no commitment
                  </button>
                </motion.div>

                {/* Back link */}
                <div className="flex justify-start mt-8">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-sm text-[#5C4F3A] hover:text-[#1E1B16] transition-colors"
                  >
                    <ArrowLeft size={15} />
                    Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
