/**
 * Quiz.tsx — "Find My Ritual" quiz flow
 * Design: Warm Editorial — Playfair Display + DM Sans, cream #FAF7F2 base, amber #C8813A accents
 * 4 steps: Wellness Goal → Supplement Timing → Secondary Support → Results
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ShoppingCart, ArrowLeft, ArrowRight, Check } from "lucide-react";

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
    },
    calm: {
      name: "Luma Calm",
      emoji: "🍃",
      timing: "AFTERNOON",
      timingColor: "#6EE7B7",
      description: "Supports a calm, focused mind through the demands of your afternoon",
      price: 22.4,
      color: "#D1FAE5",
    },
    sleep: {
      name: "Luma Sleep",
      emoji: "🌙",
      timing: "EVENING",
      timingColor: "#A78BFA",
      description: "Supports healthy wind down and more restful, restorative sleep quality",
      price: 22.4,
      color: "#EDE9FE",
    },
    glow: {
      name: "Luma Glow",
      emoji: "✨",
      timing: "MORNING",
      timingColor: "#F472B6",
      description: "Nourishes skin from within with collagen-supporting botanicals and antioxidants",
      price: 22.4,
      color: "#FCE7F3",
    },
    focus: {
      name: "Luma Focus",
      emoji: "🧠",
      timing: "MIDDAY",
      timingColor: "#60A5FA",
      description: "Sharpens concentration and mental clarity for sustained deep work",
      price: 22.4,
      color: "#DBEAFE",
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
            {["Shop All", "Bundles", "Ingredients", "Reviews", "FAQ", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className={`text-sm transition-colors ${
                  item === "Find My Ritual"
                    ? "text-[#1E1B16] font-semibold border-b-2 border-[#1E1B16] pb-0.5"
                    : "text-[#5C4F3A] hover:text-[#1E1B16]"
                }`}
              >
                {item}
              </a>
            ))}
            <a
              href="#"
              className="text-sm text-[#1E1B16] font-semibold border-b-2 border-[#1E1B16] pb-0.5"
            >
              Find My Ritual
            </a>
          </nav>

          <button className="flex items-center gap-2 bg-[#1E1B16] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#2D2820] transition-colors">
            <ShoppingCart size={15} />
            Cart
            <span className="bg-[#C8813A] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
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

                      {/* Emoji circle */}
                      <div
                        className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: product.color }}
                      >
                        {product.emoji}
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

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-[#1E1B16] text-white py-4 rounded-2xl text-base font-semibold hover:bg-[#2D2820] transition-colors cursor-pointer"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
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
                  <button className="text-sm text-[#8B7355] underline underline-offset-2 hover:text-[#1E1B16] transition-colors">
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
