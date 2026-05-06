/*
 * LUMA DAILY — Shop All Products Page
 * Design: Warm Editorial — full product listing with filters and bundles
 * Route: /shop
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Star, Check, Filter } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products, bundles } from "@/lib/products";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
};

const FILTERS = ["All", "Energy", "Sleep", "Stress", "Focus", "Beauty", "Gut"];

export default function Shop() {
  const [, navigate] = useLocation();
  const { addItem, openCart } = useCart();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"formulas" | "bundles">("formulas");

  const filterMap: Record<string, string[]> = {
    All: products.map((p) => p.slug),
    Energy: ["energy"],
    Sleep: ["sleep"],
    Stress: ["calm"],
    Focus: ["focus"],
    Beauty: ["glow"],
    Gut: ["gut"],
  };

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((p) => filterMap[activeFilter]?.includes(p.slug));

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      flavor: product.flavor || product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      color: product.color,
      isSubscription: false,
    });
    openCart();
    toast.success(`Luma ${product.name} added to cart`);
  };

  const handleAddBundleToCart = (bundle: typeof bundles[0]) => {
    addItem({
      id: bundle.id + 100,
      name: bundle.name,
      flavor: bundle.subtitle,
      price: bundle.price,
      originalPrice: bundle.originalPrice,
      image: bundle.image,
      color: "#C8813A",
      isSubscription: false,
    });
    openCart();
    toast.success(`${bundle.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#1E1B16]/8">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#C8813A] flex items-center justify-center">
                <span className="text-white font-display font-700 text-xs">L</span>
              </div>
              <span className="font-display font-700 text-lg text-[#1E1B16]">Luma Daily</span>
            </button>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/quiz")} className="font-body text-sm text-[#C8813A] hover:text-[#A66A2A] transition-colors">
                Find My Ritual
              </button>
              <button onClick={() => navigate("/signin")} className="font-body text-sm text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-[#1A1510] py-16">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#C8813A]/20 text-[#C8813A] text-xs font-body font-600 tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Six Formulas · One Daily Ritual
            </div>
            <h1 className="font-display font-800 text-4xl lg:text-5xl text-[#FAF7F2] mb-4">
              Shop All Products
            </h1>
            <p className="font-body text-base text-[#FAF7F2]/55 max-w-md mx-auto">
              Science-backed formulas for every wellness need. Subscribe and save 20% on every order.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab switcher */}
      <div className="border-b border-[#1E1B16]/10 bg-[#FAF7F2] sticky top-16 z-30">
        <div className="container">
          <div className="flex gap-0">
            {(["formulas", "bundles"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-body text-sm font-600 capitalize border-b-2 transition-all duration-200 ${
                  activeTab === tab
                    ? "border-[#C8813A] text-[#C8813A]"
                    : "border-transparent text-[#1E1B16]/50 hover:text-[#1E1B16]"
                }`}
              >
                {tab === "formulas" ? "Individual Formulas" : "Bundles & Sets"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-10">
        {activeTab === "formulas" && (
          <>
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 mb-8 items-center">
              <Filter size={14} className="text-[#1E1B16]/40 mr-1" />
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full font-body text-sm font-500 border transition-all duration-200 ${
                    activeFilter === f
                      ? "bg-[#1E1B16] text-white border-[#1E1B16]"
                      : "bg-transparent border-[#1E1B16]/20 text-[#1E1B16]/60 hover:border-[#1E1B16]/50 hover:text-[#1E1B16]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={fadeUp}
                  custom={i * 0.08}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  {/* Image */}
                  <div
                    className="relative h-56 overflow-hidden cursor-pointer"
                    style={{ backgroundColor: product.bgColor }}
                    onClick={() => navigate(`/products/${product.slug}`)}
                  >
                    {product.badge && (
                      <div
                        className="absolute top-3 left-3 z-10 text-xs font-body font-600 px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: product.color }}
                      >
                        {product.badge}
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={`Luma ${product.name}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          className="font-display font-700 text-xl text-[#1E1B16] cursor-pointer hover:text-[#C8813A] transition-colors"
                          onClick={() => navigate(`/products/${product.slug}`)}
                        >
                          Luma {product.name}
                        </h3>
                        <p className="font-body text-xs text-[#1E1B16]/50 italic">{product.tagline}</p>
                        {product.flavor && (
                          <span
                            className="inline-block mt-1.5 text-[10px] font-body font-600 px-2.5 py-0.5 rounded-full"
                            style={{ backgroundColor: product.bgColor, color: product.textColor }}
                          >
                            {product.flavor}
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="font-display font-700 text-xl text-[#1E1B16]">${product.price}</div>
                        <div className="font-body text-xs text-[#1E1B16]/35 line-through">${product.originalPrice}</div>
                      </div>
                    </div>

                    <p className="font-body text-sm text-[#1E1B16]/60 leading-relaxed mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={11} fill={s <= Math.round(product.rating) ? "#C8813A" : "none"} stroke={s <= Math.round(product.rating) ? "none" : "#C8813A"} strokeWidth={1.5} />
                        ))}
                      </div>
                      <span className="font-body text-xs text-[#1E1B16]/45">{product.rating} ({product.reviews})</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn-amber flex-1 justify-center text-xs py-2.5"
                      >
                        <ShoppingBag size={13} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => navigate(`/products/${product.slug}`)}
                        className="btn-outline-dark px-3 py-2.5 text-xs"
                      >
                        Details
                      </button>
                    </div>

                    {/* Subscribe price hint */}
                    <p className="font-body text-[10px] text-[#C8813A] mt-2 text-center">
                      Subscribe for ${product.subscribePrice}/mo · Save 20%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === "bundles" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle, i) => (
              <motion.div
                key={bundle.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i * 0.07}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group ${
                  bundle.featured ? "ring-2 ring-[#C8813A]" : ""
                }`}
              >
                {bundle.featured && (
                  <div className="bg-[#C8813A] text-white text-xs font-body font-600 text-center py-2">
                    Most Popular
                  </div>
                )}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={bundle.image}
                    alt={bundle.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B16]/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                    {bundle.products.map((p) => (
                      <span key={p} className="text-[10px] font-body bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-700 text-xl text-[#1E1B16] mb-0.5">{bundle.name}</h3>
                  <p className="font-body text-xs text-[#C8813A] font-500 mb-2">{bundle.subtitle}</p>
                  <p className="font-body text-sm text-[#1E1B16]/60 leading-relaxed mb-4 line-clamp-2">{bundle.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-700 text-2xl text-[#1E1B16]">${bundle.price}</span>
                      <span className="font-body text-sm text-[#1E1B16]/35 line-through">${bundle.originalPrice}</span>
                      <span className="font-body text-xs text-[#C8813A] font-600">
                        Save ${bundle.originalPrice - bundle.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddBundleToCart(bundle)}
                    className="btn-amber w-full justify-center text-sm mt-4"
                  >
                    <ShoppingBag size={14} />
                    Add Bundle to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Subscribe CTA */}
      <section className="py-16 bg-[#C8813A]">
        <div className="container text-center">
          <h2 className="font-display font-700 text-3xl text-white mb-3">
            Subscribe & save 20% on every order
          </h2>
          <p className="font-body text-base text-white/75 mb-6 max-w-md mx-auto">
            Free shipping, pause anytime, cancel anytime. Your ritual, your terms.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/quiz")}
              className="bg-white text-[#C8813A] font-body font-600 text-sm tracking-wider uppercase px-8 py-3.5 rounded-full hover:bg-[#FAF7F2] transition-colors"
            >
              Find My Ritual
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-white/40 text-white font-body text-sm px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Learn More <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1510] py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#C8813A] flex items-center justify-center">
              <span className="text-white font-display font-700 text-xs">L</span>
            </div>
            <span className="font-display font-700 text-base text-[#FAF7F2]">Luma Daily</span>
          </button>
          <div className="flex gap-6">
            {[
              { label: "About", path: "/about" },
              { label: "Ingredients", path: "/ingredients" },
              { label: "Contact", path: "/contact" },
              { label: "FAQ", path: "/#faq" },
            ].map((l) => (
              <button
                key={l.label}
                onClick={() => navigate(l.path)}
                className="font-body text-xs text-[#FAF7F2]/40 hover:text-[#FAF7F2]/70 transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="font-body text-xs text-[#FAF7F2]/25">© 2026 Luma Daily</p>
        </div>
      </footer>
    </div>
  );
}
