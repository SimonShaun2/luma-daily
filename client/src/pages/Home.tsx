/*
 * LUMA DAILY — Home Page
 * Design: Warm Editorial — luxury magazine meets wellness DTC
 * Sections: Nav, Hero, Marquee, Categories, Products, Quiz CTA, Bundles, Ingredients, Subscribe, Testimonials, FAQ, Footer
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Star, Check, ArrowRight, Menu, X, ShoppingBag, Leaf, Zap, Moon, Brain, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { products, bundles, type Bundle, type Product } from "@/lib/products";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import ExploreByGoal from "@/components/seo/ExploreByGoal";

const testimonials = [
  {
    name: "Sarah M.",
    location: "New York, NY",
    stars: 5,
    text: "The Calm gummies have genuinely changed my mornings. I used to dread the anxiety spike before big meetings — now I just feel... steady. It's subtle but real.",
    product: "Calm",
  },
  {
    name: "James T.",
    location: "Austin, TX",
    stars: 5,
    text: "I was skeptical about gummies for adults, but the Energy formula is legitimately effective. No jitters, no crash — just clean, sustained focus all morning.",
    product: "Energy",
  },
  {
    name: "Priya K.",
    location: "San Francisco, CA",
    stars: 5,
    text: "The subscription makes it so easy. My ritual is stocked automatically and I never have to think about it. The Sleep gummies have transformed my nights.",
    product: "Sleep",
  },
  {
    name: "Elena R.",
    location: "Chicago, IL",
    stars: 5,
    text: "Glow is the one I recommend to everyone. My skin looks noticeably better after 6 weeks and my nails stopped breaking. Clean ingredients, clearly explained.",
    product: "Glow",
  },
];

const faqs = [
  {
    q: "Are Luma Daily gummies suitable for everyone?",
    a: "Our formulas are designed for adults 18+. If you are pregnant, nursing, or taking medications, please consult your healthcare provider before starting any supplement routine.",
  },
  {
    q: "Can I take more than one formula at a time?",
    a: "Absolutely. Our formulas are designed to work together. Many customers take Energy in the morning, Calm in the afternoon, and Sleep at night. Our bundles are curated for exactly this purpose.",
  },
  {
    q: "How long until I notice results?",
    a: "Most customers notice effects from Energy and Calm within the first week. Sleep typically shows results in 3–5 days. Focus and Glow are designed for cumulative benefit and are best assessed after 4–6 weeks of consistent use.",
  },
  {
    q: "What does the subscription include?",
    a: "Subscribe and save 20% on every order, with free shipping on all subscription orders. You can pause, skip, or cancel anytime — no fees, no questions asked.",
  },
  {
    q: "Are your ingredients third-party tested?",
    a: "Yes. Every batch is tested by an independent ISO-certified lab for purity, potency, and safety. We publish our certificates of analysis on each product page.",
  },
];

const marqueeItems = [
  "Free shipping over $60",
  "Subscribe & save 20%",
  "Third-party tested",
  "Vegan & gluten-free",
  "No artificial colors",
  "60-day guarantee",
  "Clean ingredients",
  "Science-backed formulas",
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 bg-[#1E1B16]/15" />
      <span className="font-body text-xs font-600 tracking-[0.15em] uppercase text-[#1E1B16]/50">{children}</span>
      <div className="h-px flex-1 bg-[#1E1B16]/15" />
    </div>
  );
}

function getProductIcon(slug: string) {
  if (slug === "energy") return <Zap size={18} />;
  if (slug === "calm" || slug === "gut") return <Leaf size={18} />;
  if (slug === "sleep") return <Moon size={18} />;
  if (slug === "focus") return <Brain size={18} />;
  return <Sparkles size={18} />;
}

function getStorefrontHandle(product: Product) {
  return `luma-${product.slug}`;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { addItem } = useCart();
  const [, navigate] = useLocation();
  const { getProduct, getVariantId } = useShopifyProducts();

  const handleAddToCart = async () => {
    const handle = getStorefrontHandle(product);
    const shopifyProduct = getProduct(handle);
    const variantId = shopifyProduct?.variants.edges[0]?.node.id ?? (await getVariantId(handle));

    if (!variantId) {
      toast.error("This formula is not connected to Shopify yet.");
      return;
    }

    await addItem({
      variantId,
      handle,
      name: product.name,
      flavor: product.flavor || product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: shopifyProduct?.images.edges[0]?.node.url ?? product.image,
      color: product.color,
      isSubscription: false,
    });

    toast.success(`Luma ${product.name} added to your ritual`);
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      custom={index * 0.15}
      className="product-card group flex-shrink-0 flex flex-col h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product image area */}
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-t-2xl"
        style={{ backgroundColor: product.bgColor, height: "220px" }}
      >
        {product.badge && (
          <div
            className="absolute top-3 left-3 text-xs font-body font-600 px-3 py-1 rounded-full z-10"
            style={{ backgroundColor: product.color, color: "white" }}
          >
            {product.badge}
          </div>
        )}
        {/* Real product bottle image */}
        <motion.img
          src={product.image}
          alt={`Luma ${product.name} gummies`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: "center top" }}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Product info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display font-700 text-xl text-[#1E1B16]">{product.name}</h3>
            <p className="font-body text-xs text-[#1E1B16]/50 italic mt-0.5">{product.tagline}</p>
            {product.flavor && (
              <span
                className="inline-block mt-1.5 text-[10px] font-body font-600 px-2.5 py-0.5 rounded-full tracking-wide"
                style={{ backgroundColor: product.bgColor, color: product.textColor }}
              >
                {product.flavor}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="font-body font-600 text-[#1E1B16]">${Number(product.price).toFixed(2)}</div>
            <div className="font-body text-xs text-[#1E1B16]/40 line-through">${Number(product.originalPrice).toFixed(2)}</div>
          </div>
        </div>

        <p className="font-body text-sm text-[#1E1B16]/65 leading-relaxed mb-4">{product.description}</p>

        {/* Ingredients */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-4 overflow-hidden"
            >
              <div className="text-xs font-body font-600 text-[#1E1B16]/40 uppercase tracking-wider mb-2">Key Ingredients</div>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing.name}
                    className="text-xs font-body px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: product.bgColor, color: product.textColor }}
                  >
                    {ing.name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 mt-auto pt-3">
          <button onClick={handleAddToCart} className="btn-amber flex-1 justify-center text-xs py-2.5">
            Add to Ritual
          </button>
          <button onClick={() => navigate(`/products/${product.slug}`)} className="btn-outline-dark px-3 py-2.5 text-xs">
            Learn More
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
      custom={index * 0.1}
      className="border-b border-[#1E1B16]/10"
    >
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-display font-600 text-lg text-[#1E1B16] group-hover:text-[#C8813A] transition-colors pr-4">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-[#C8813A]"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="font-body text-[#1E1B16]/65 leading-relaxed pb-5 text-base">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { openCart, totalItems, addItem } = useCart();
  const { getProduct, getVariantId } = useShopifyProducts();

  const addFormulaToCart = async (product: Product) => {
    const handle = getStorefrontHandle(product);
    const shopifyProduct = getProduct(handle);
    const variantId = shopifyProduct?.variants.edges[0]?.node.id ?? (await getVariantId(handle));

    if (!variantId) {
      throw new Error(`Luma ${product.name} is not connected to Shopify yet.`);
    }

    await addItem({
      variantId,
      handle,
      name: product.name,
      flavor: product.flavor || product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: shopifyProduct?.images.edges[0]?.node.url ?? product.image,
      color: product.color,
      isSubscription: false,
    });
  };

  const addBundleToCart = async (bundle: Bundle) => {
    const bundleProducts = bundle.products
      .map((productName) => products.find((product) => product.name === productName))
      .filter((product): product is Product => Boolean(product));

    if (!bundleProducts.length) {
      toast.error("This bundle is not connected to Shopify yet.");
      return;
    }

    try {
      for (const product of bundleProducts) {
        await addFormulaToCart(product);
      }
      toast.success(`${bundle.name} added to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add bundle to cart.");
    }

    openCart();
  };
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = 600;
    carouselRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };
  const productCarouselRef = useRef<HTMLDivElement>(null);
  const scrollProductCarousel = (dir: "left" | "right") => {
    if (!productCarouselRef.current) return;
    const amount = 700;
    productCarouselRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C8813A] flex items-center justify-center">
                <span className="text-white font-display font-700 text-sm">L</span>
              </div>
              <span className="font-display font-700 text-xl text-[#1E1B16]">Luma Daily</span>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {[
                { label: "Products", href: "/shop" },
                { label: "Bundles", href: "/shop" },
                { label: "Ingredients", href: "/ingredients" },
                { label: "About", href: "/about" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className="font-body text-sm font-500 text-[#1E1B16]/70 hover:text-[#1E1B16] transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C8813A] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <button onClick={() => navigate("/signin")} className="font-body text-sm font-500 text-[#1E1B16]/70 hover:text-[#1E1B16] transition-colors">
                Sign In
              </button>
              <button onClick={() => navigate("/register")} className="font-body text-sm font-500 text-[#1E1B16]/70 hover:text-[#1E1B16] transition-colors">
                Register
              </button>
              <button onClick={() => navigate("/shop")} className="btn-amber py-2 px-5 text-xs">
                Shop Now
              </button>
              <button
                onClick={() => navigate("/quiz")}
                className="font-body text-sm font-500 text-[#C8813A] hover:text-[#A66A2A] transition-colors border border-[#C8813A]/40 hover:border-[#C8813A] rounded-full px-4 py-2"
              >
                Find My Ritual
              </button>
              <button onClick={openCart} className="relative text-[#1E1B16]/70 hover:text-[#1E1B16] transition-colors">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C8813A] rounded-full text-white text-[10px] flex items-center justify-center font-600">{totalItems}</span>
                )}
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden text-[#1E1B16]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#FAF7F2] border-t border-[#1E1B16]/10 overflow-hidden"
            >
              <div className="container py-6 flex flex-col gap-4">
                {[
                  { label: "Products", href: "/shop" },
                  { label: "Bundles", href: "/shop" },
                  { label: "Ingredients", href: "/ingredients" },
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { setMobileMenuOpen(false); navigate(item.href); }}
                    className="font-body text-base font-500 text-[#1E1B16] py-2 border-b border-[#1E1B16]/10 text-left"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  className="font-body text-base font-500 text-[#C8813A] py-2 border-b border-[#1E1B16]/10 text-left"
                  onClick={() => { setMobileMenuOpen(false); navigate("/quiz"); }}
                >
                  Find My Ritual
                </button>
                <button onClick={() => { setMobileMenuOpen(false); navigate("/shop"); }} className="btn-amber mt-2 justify-center">Shop Now</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#FAF7F2]">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[#FAF7F2]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#F5EDD8]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C8813A]/5 blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)] py-16">
            {/* Left: Copy */}
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-[#C8813A]/10 text-[#C8813A] text-xs font-body font-600 tracking-widest uppercase px-4 py-2 rounded-full mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8813A] animate-pulse" />
                Six Formulas. One Daily Ritual.
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-display font-800 text-5xl lg:text-6xl xl:text-7xl text-[#1E1B16] leading-[1.05] mb-6"
              >
                The gummies that make wellness{" "}
                <em className="italic text-[#C8813A] font-700">feel like a ritual.</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="font-body text-lg text-[#1E1B16]/60 leading-relaxed mb-8 max-w-md"
              >
                Science-backed formulas for energy, calm, sleep, focus, glow, and gut health. 
                Clean ingredients, clearly explained. A ritual you'll actually keep.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                <button className="btn-amber" onClick={() => navigate("/quiz")}>
                  Build Your Ritual <ArrowRight size={14} />
                </button>
                <button className="btn-outline-dark" onClick={() => navigate("/quiz")}>
                  Take the Quiz
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center gap-6"
              >
                {[
                  { icon: <Check size={14} />, text: "Vegan & gluten-free" },
                  { icon: <Check size={14} />, text: "Third-party tested" },
                  { icon: <Check size={14} />, text: "60-day guarantee" },
                ].map((badge) => (
                  <div key={badge.text} className="flex items-center gap-2 text-sm font-body text-[#1E1B16]/55">
                    <span className="text-[#C8813A]">{badge.icon}</span>
                    {badge.text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Product image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/manus-storage/luma_daily_packaging_master_v2_fe19e1c8.png"
                  alt="Luma Daily product lineup — Energy, Calm, Sleep, Focus, Glow"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B16]/10 to-transparent" />
              </div>

              {/* Floating stat cards */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-5 py-4"
              >
                <div className="font-display font-700 text-2xl text-[#1E1B16]">50K+</div>
                <div className="font-body text-xs text-[#1E1B16]/50 mt-0.5">Daily rituals kept</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-5 py-4"
              >
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#C8813A" stroke="none" />
                  ))}
                </div>
                <div className="font-body text-xs text-[#1E1B16]/50">4.9 / 5 average</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-body text-xs text-[#1E1B16]/30 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-[#1E1B16]/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── Marquee Banner ───────────────────────────────────────────────── */}
      <div className="bg-[#1A1510] py-3.5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 mx-8">
              <span className="font-body text-sm font-500 text-[#FAF7F2]/80 tracking-wide">{item}</span>
              <span className="text-[#C8813A] text-lg">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Choose Your Support ──────────────────────────────────────────── */}
      <section id="products" className="py-24 bg-[#FAF7F2]">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <SectionLabel>Choose Your Daily Support</SectionLabel>
            <h2 className="font-display font-700 text-4xl lg:text-5xl text-[#1E1B16] mb-4">
              Six formulas.{" "}
              <em className="italic text-[#C8813A]">One daily ritual.</em>
            </h2>
            <p className="font-body text-lg text-[#1E1B16]/55 max-w-xl mx-auto leading-relaxed">
              Each formula is designed to address a specific wellness need, with ingredients chosen for efficacy and transparency.
            </p>
          </AnimatedSection>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {products.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setActiveCategory(activeCategory === p.id ? null : p.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-500 transition-all duration-200 border"
                style={{
                  backgroundColor: activeCategory === p.id ? p.color : "transparent",
                  borderColor: p.color,
                  color: activeCategory === p.id ? "white" : p.textColor,
                }}
              >
                {getProductIcon(p.slug)}
                {p.name}
              </motion.button>
            ))}
          </div>

          {/* Product carousel */}
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => scrollProductCarousel("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-[#E8E0D4] flex items-center justify-center text-[#1E1B16] hover:bg-[#FAF7F2] transition-colors"
              aria-label="Scroll products left"
            >
              <ChevronLeft size={20} />
            </button>
            {/* Right arrow */}
            <button
              onClick={() => scrollProductCarousel("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-[#E8E0D4] flex items-center justify-center text-[#1E1B16] hover:bg-[#FAF7F2] transition-colors"
              aria-label="Scroll products right"
            >
              <ChevronRight size={20} />
            </button>
            {/* Fade edges */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10" />
            <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10" />
            {/* Scrollable row */}
            <div
              ref={productCarouselRef}
              className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products
                .filter((p) => activeCategory === null || p.id === activeCategory)
                .map((product, index) => (
                  <div key={product.id} className="snap-start" style={{ minWidth: "280px", maxWidth: "280px" }}>
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quiz CTA (Dark Section) ──────────────────────────────────────── */}
      <ExploreByGoal />

      <section className="relative py-28 bg-[#1A1510] overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/manus-storage/luma_daily_packaging_master_v2_fe19e1c8.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1510] via-[#1A1510]/80 to-[#1A1510]" />

        <div className="container relative z-10 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 bg-[#C8813A]/20 text-[#C8813A] text-xs font-body font-600 tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8813A]" />
              Personalized for You
            </div>
            <h2 className="font-display font-700 text-4xl lg:text-6xl text-[#FAF7F2] leading-tight mb-6 max-w-3xl mx-auto">
              Take 60 seconds.{" "}
              <em className="italic text-[#C8813A]">We'll build your ritual.</em>
            </h2>
            <p className="font-body text-lg text-[#FAF7F2]/55 max-w-lg mx-auto mb-10 leading-relaxed">
              Answer a few questions about your wellness goals and we'll recommend the perfect formula — or combination — for your needs.
            </p>
            <button className="btn-amber text-base px-8 py-4" onClick={() => navigate("/quiz")}>
              Start the Ritual Quiz <ArrowRight size={16} />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Bundles ──────────────────────────────────────────────────────── */}
      <section id="bundles" className="py-24 bg-[#F5EDD8]/40">
        <div className="container">
          <AnimatedSection className="mb-16">
            <SectionLabel>Curated Sets</SectionLabel>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <h2 className="font-display font-700 text-4xl lg:text-5xl text-[#1E1B16]">
                Build your 30-day{" "}
                <em className="italic text-[#C8813A]">wellness ritual.</em>
              </h2>
              <p className="font-body text-base text-[#1E1B16]/55 max-w-sm leading-relaxed">
                Save up to 20% when you bundle. Each set is designed around a specific wellness intention.
              </p>
            </div>
          </AnimatedSection>

          {/* Horizontal Carousel */}
          <div className="relative">
            {/* Scroll container */}
            <div
              ref={carouselRef}
              className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {bundles.map((bundle, index) => (
                <motion.div
                  key={bundle.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={index * 0.08}
                  className={`relative rounded-2xl overflow-hidden group cursor-pointer shrink-0 snap-start ${
                    bundle.featured ? "ring-2 ring-[#C8813A]" : ""
                  }`}
                  style={{ width: "280px" }}
                >
                  {bundle.featured && (
                    <div className="absolute top-4 right-4 z-10 bg-[#C8813A] text-white text-xs font-body font-600 px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B16]/70 via-[#1E1B16]/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-1.5">
                        {bundle.products.map((p) => (
                          <span key={p} className="text-xs font-body bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4">
                    <h3 className="font-display font-700 text-lg text-[#1E1B16] mb-0.5">{bundle.name}</h3>
                    <p className="font-body text-xs text-[#C8813A] font-500 mb-2">{bundle.subtitle}</p>
                    <p className="font-body text-xs text-[#1E1B16]/60 leading-relaxed mb-3 line-clamp-2">{bundle.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display font-700 text-xl text-[#1E1B16]">${Number(bundle.price).toFixed(2)}</span>
                        <span className="font-body text-xs text-[#1E1B16]/40 line-through">${Number(bundle.originalPrice).toFixed(2)}</span>
                      </div>
                      <button onClick={() => { addBundleToCart(bundle); }} className="btn-amber py-2 px-4 text-xs">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Fade edges */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-[#F5EDD8]/60 to-transparent z-10" />
            <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#F5EDD8]/60 to-transparent z-10" />
            {/* Arrow buttons */}
            <button
              onClick={() => scrollCarousel("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-[#E8E0D4] flex items-center justify-center text-[#1E1B16] hover:bg-[#FAF7F2] transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-[#E8E0D4] flex items-center justify-center text-[#1E1B16] hover:bg-[#FAF7F2] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Ingredients Section ──────────────────────────────────────────── */}
      <section id="ingredients" className="py-24 bg-[#1A1510] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <img
                    src="/manus-storage/luma_daily_packaging_master_v2_fe19e1c8.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <AnimatedSection>
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  src="/manus-storage/luma_ingredients_a11e6776.png"
                  alt="Clean, natural ingredients used in Luma Daily formulas"
                  className="w-full h-auto object-cover rounded-3xl"
                />
              </div>
            </AnimatedSection>

            {/* Right: Copy */}
            <AnimatedSection>
              <SectionLabel>
                <span className="text-[#FAF7F2]/40">Clean Ingredients</span>
              </SectionLabel>
              <h2 className="font-display font-700 text-4xl lg:text-5xl text-[#FAF7F2] leading-tight mb-6">
                Clean ingredients,{" "}
                <em className="italic text-[#C8813A]">clearly explained.</em>
              </h2>
              <p className="font-body text-base text-[#FAF7F2]/55 leading-relaxed mb-8">
                We believe you deserve to know exactly what you're putting in your body. Every ingredient in every formula is chosen for a specific reason — and we'll tell you exactly what that reason is.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { title: "No artificial colors or flavors", desc: "Natural fruit extracts give our gummies their color and taste." },
                  { title: "No proprietary blends", desc: "We list exact doses for every active ingredient, always." },
                  { title: "Third-party tested every batch", desc: "ISO-certified lab verification for purity and potency." },
                  { title: "Vegan, gluten-free, non-GMO", desc: "Formulated to fit every lifestyle and dietary need." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i * 0.1}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#C8813A]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-[#C8813A]" />
                    </div>
                    <div>
                      <div className="font-body font-600 text-[#FAF7F2] text-sm mb-0.5">{item.title}</div>
                      <div className="font-body text-sm text-[#FAF7F2]/45">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button onClick={() => navigate("/ingredients")} className="btn-outline-cream">
                View Full Ingredient List <ArrowRight size={14} />
              </button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Subscribe Section ────────────────────────────────────────────── */}
      <section id="subscribe" className="py-24 bg-[#FAF7F2]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <AnimatedSection>
              <SectionLabel>Subscribe & Save</SectionLabel>
              <h2 className="font-display font-700 text-4xl lg:text-5xl text-[#1E1B16] leading-tight mb-6">
                Subscribe once.{" "}
                <em className="italic text-[#C8813A]">Keep your ritual stocked.</em>
              </h2>
              <p className="font-body text-base text-[#1E1B16]/60 leading-relaxed mb-8">
                Never run out. Never overpay. Subscribe and your ritual ships automatically — with 20% off every order, free shipping, and the freedom to pause or cancel anytime.
              </p>

              <div className="space-y-5 mb-10">
                {[
                  { title: "Save 20% on every order", desc: "Automatically applied to all subscription orders." },
                  { title: "Free shipping, always", desc: "No minimum, no surprises — free on every subscription shipment." },
                  { title: "Pause, skip, or cancel anytime", desc: "Complete flexibility. No fees, no questions asked." },
                  { title: "Priority customer support", desc: "Subscribers get dedicated support with faster response times." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i * 0.1}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#C8813A]/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-[#C8813A]" />
                    </div>
                    <div>
                      <div className="font-body font-600 text-[#1E1B16] text-sm mb-0.5">{item.title}</div>
                      <div className="font-body text-sm text-[#1E1B16]/50">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button onClick={() => navigate("/shop")} className="btn-amber">
                Start Your Subscription <ArrowRight size={14} />
              </button>
            </AnimatedSection>

            {/* Right: Image */}
            <AnimatedSection>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <img
                    src="/manus-storage/luma_daily_packaging_master_69403cb3.png"
                    alt="Luma Daily complete product lineup"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Savings badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-6 -right-6 bg-[#C8813A] text-white rounded-2xl p-5 shadow-xl"
                >
                  <div className="font-display font-700 text-3xl">20%</div>
                  <div className="font-body text-xs mt-0.5 opacity-80">off every order</div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F5EDD8]/50">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <SectionLabel>Real Results</SectionLabel>
            <h2 className="font-display font-700 text-4xl lg:text-5xl text-[#1E1B16] mb-4">
              Daily rituals people{" "}
              <em className="italic text-[#C8813A]">actually keep.</em>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#C8813A" stroke="none" />
              ))}
              <span className="font-body text-sm text-[#1E1B16]/60 ml-2">4.9 out of 5 — 2,400+ reviews</span>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={index * 0.1}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={14} fill="#C8813A" stroke="none" />
                  ))}
                </div>
                <p className="font-body text-sm text-[#1E1B16]/70 leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-body font-600 text-sm text-[#1E1B16]">{t.name}</div>
                    <div className="font-body text-xs text-[#1E1B16]/40">{t.location}</div>
                  </div>
                  <span
                    className="text-xs font-body font-500 px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: products.find((p) => p.name === t.product)?.bgColor,
                      color: products.find((p) => p.name === t.product)?.textColor,
                    }}
                  >
                    {t.product}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Header */}
            <AnimatedSection>
              <SectionLabel>Common Questions</SectionLabel>
              <h2 className="font-display font-700 text-4xl lg:text-5xl text-[#1E1B16] leading-tight mb-6">
                Questions before{" "}
                <em className="italic text-[#C8813A]">you start?</em>
              </h2>
              <p className="font-body text-base text-[#1E1B16]/55 leading-relaxed mb-8">
                We believe in full transparency. If you don't find your answer here, our team is always happy to help.
              </p>
              <button onClick={() => navigate("/contact")} className="btn-outline-dark">
                Contact Support <ArrowRight size={14} />
              </button>
            </AnimatedSection>

            {/* Right: FAQ accordion */}
            <div>
              {faqs.map((faq, index) => (
                <FAQItem key={faq.q} faq={faq} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA Banner ─────────────────────────────────────────────── */}
      <section className="py-20 bg-[#C8813A]">
        <div className="container text-center">
          <AnimatedSection>
            <h2 className="font-display font-700 text-4xl lg:text-5xl text-white mb-4">
              Ready to start your ritual?
            </h2>
            <p className="font-body text-lg text-white/75 mb-8 max-w-md mx-auto">
              Join 50,000+ people who've made wellness a daily habit they love.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate("/shop")} className="bg-white text-[#C8813A] font-body font-600 text-sm tracking-wider uppercase px-8 py-4 rounded-full hover:bg-[#FAF7F2] transition-colors">
                Shop All Products
              </button>
              <button className="btn-outline-cream" onClick={() => navigate("/quiz")}>
                Take the Quiz
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#1A1510] text-[#FAF7F2]">
        <div className="container py-16">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#C8813A] flex items-center justify-center">
                  <span className="text-white font-display font-700 text-sm">L</span>
                </div>
                <span className="font-display font-700 text-xl text-[#FAF7F2]">Luma Daily</span>
              </div>
              <p className="font-body text-sm text-[#FAF7F2]/45 leading-relaxed max-w-xs mb-6">
                Science-backed wellness gummies designed to make your daily rituals feel effortless and meaningful.
              </p>
              <div className="flex gap-3">
                {["Instagram", "TikTok", "Pinterest"].map((social) => (
                  <a
                    key={social}
                    href={`https://www.${social.toLowerCase()}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-[#FAF7F2]/15 flex items-center justify-center text-[#FAF7F2]/50 hover:text-[#FAF7F2] hover:border-[#FAF7F2]/40 transition-colors text-xs font-body"
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Shop",
                links: [
                  { label: "Energy", href: "/products/energy" },
                  { label: "Calm", href: "/products/calm" },
                  { label: "Sleep", href: "/products/sleep" },
                  { label: "Focus", href: "/products/focus" },
                  { label: "Glow", href: "/products/glow" },
                  { label: "Gut", href: "/products/gut" },
                  { label: "Bundles", href: "/shop" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "About Us", href: "/about" },
                  { label: "Our Story", href: "/about" },
                  { label: "Ingredients", href: "/ingredients" },
                  { label: "Sustainability", href: "/about" },
                  { label: "Press", href: "/contact" },
                ],
              },
              {
                title: "Support",
                links: [
                  { label: "FAQ", href: "/#faq" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Shipping", href: "/shipping" },
                  { label: "Returns", href: "/shipping" },
                  { label: "Subscription", href: "/account" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-body font-600 text-xs tracking-widest uppercase text-[#FAF7F2]/40 mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => navigate(link.href)}
                        className="font-body text-sm text-[#FAF7F2]/55 hover:text-[#FAF7F2] transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#FAF7F2]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-[#FAF7F2]/30">
              © 2026 Luma Daily. All rights reserved.
            </p>
            <div className="flex gap-6">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Settings", href: "/privacy" },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.href)}
                  className="font-body text-xs text-[#FAF7F2]/30 hover:text-[#FAF7F2]/60 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <p className="font-body text-xs text-[#FAF7F2]/20">
              *These statements have not been evaluated by the FDA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
