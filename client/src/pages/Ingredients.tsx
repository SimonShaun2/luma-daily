/*
 * LUMA DAILY — Ingredients Page
 * Design: Warm Editorial — full ingredient transparency, formula breakdown
 * Route: /ingredients
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Check, ArrowRight, Shield, Award, Leaf } from "lucide-react";
import { products } from "@/lib/products";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

const standards = [
  {
    icon: <Shield size={20} />,
    title: "ISO-Certified Lab Testing",
    desc: "Every production batch is tested by an independent ISO 17025-accredited laboratory for purity, potency, and the absence of contaminants.",
  },
  {
    icon: <Award size={20} />,
    title: "GMP-Certified Manufacturing",
    desc: "All Luma Daily products are manufactured in FDA-registered, NSF GMP-certified facilities in the United States.",
  },
  {
    icon: <Leaf size={20} />,
    title: "No Proprietary Blends",
    desc: "We list the exact dose of every active ingredient. No hidden blends, no underdosed fillers, no ambiguity.",
  },
  {
    icon: <Check size={20} />,
    title: "Certificates of Analysis",
    desc: "Certificates of Analysis from our third-party testing partner are available for every production batch on request.",
  },
];

export default function Ingredients() {
  const [, navigate] = useLocation();
  const [activeProduct, setActiveProduct] = useState(products[0].slug);

  const selected = products.find((p) => p.slug === activeProduct) || products[0];

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
              <button onClick={() => navigate("/shop")} className="font-body text-sm text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors">Shop</button>
              <button onClick={() => navigate("/quiz")} className="btn-amber py-2 px-5 text-xs">Find My Ritual</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#1A1510] py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-[#C8813A]/20 text-[#C8813A] text-xs font-body font-600 tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              Full Transparency
            </div>
            <h1 className="font-display font-800 text-5xl text-[#FAF7F2] leading-tight mb-4">
              Clean ingredients,{" "}
              <em className="italic text-[#C8813A]">clearly explained.</em>
            </h1>
            <p className="font-body text-lg text-[#FAF7F2]/55 leading-relaxed">
              Every ingredient in every Luma formula is listed with its exact dose and the specific reason it's there. No proprietary blends. No fine print. Just honest formulation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {standards.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.1}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E0D4]/50"
              >
                <div className="w-9 h-9 rounded-xl bg-[#C8813A]/10 flex items-center justify-center text-[#C8813A] mb-3">
                  {s.icon}
                </div>
                <h3 className="font-body font-600 text-sm text-[#1E1B16] mb-1.5">{s.title}</h3>
                <p className="font-body text-xs text-[#1E1B16]/55 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formula Explorer */}
      <section className="py-16 bg-[#F5EDD8]/40">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="h-px w-16 bg-[#1E1B16]/15" />
              <span className="font-body text-xs font-600 tracking-[0.15em] uppercase text-[#1E1B16]/50">Formula Explorer</span>
              <div className="h-px w-16 bg-[#1E1B16]/15" />
            </div>
            <h2 className="font-display font-700 text-4xl text-[#1E1B16]">
              Explore every ingredient
            </h2>
            <p className="font-body text-base text-[#1E1B16]/55 mt-3 max-w-lg mx-auto">
              Select a formula below to see its full ingredient profile, doses, and the science behind each choice.
            </p>
          </motion.div>

          {/* Formula selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {products.map((p) => (
              <button
                key={p.slug}
                onClick={() => setActiveProduct(p.slug)}
                className="px-5 py-2.5 rounded-full font-body text-sm font-500 border transition-all duration-200"
                style={{
                  backgroundColor: activeProduct === p.slug ? p.color : "transparent",
                  borderColor: p.color,
                  color: activeProduct === p.slug ? "white" : p.textColor,
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Selected formula detail */}
          <motion.div
            key={selected.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-5">
              {/* Image panel */}
              <div
                className="md:col-span-2 flex items-center justify-center p-8 min-h-[280px]"
                style={{ backgroundColor: selected.bgColor }}
              >
                <img
                  src={selected.image}
                  alt={`Luma ${selected.name}`}
                  className="w-full max-w-[180px] h-auto object-contain"
                />
              </div>

              {/* Ingredient panel */}
              <div className="md:col-span-3 p-8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display font-700 text-2xl text-[#1E1B16]">Luma {selected.name}</h3>
                    <p className="font-body text-sm text-[#1E1B16]/50 italic">{selected.tagline}</p>
                  </div>
                  {selected.flavor && (
                    <span
                      className="text-xs font-body font-600 px-3 py-1 rounded-full shrink-0 ml-3"
                      style={{ backgroundColor: selected.bgColor, color: selected.textColor }}
                    >
                      {selected.flavor}
                    </span>
                  )}
                </div>

                <p className="font-body text-sm text-[#1E1B16]/60 leading-relaxed mb-6">
                  {selected.longDescription}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="text-xs font-body font-600 text-[#1E1B16]/40 uppercase tracking-wider">
                    Active Ingredients
                  </div>
                  {selected.ingredients.map((ing) => (
                    <div
                      key={ing.name}
                      className="flex items-start gap-4 py-3 border-b border-[#1E1B16]/8 last:border-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-body font-600 text-sm text-[#1E1B16]">{ing.name}</span>
                          <span
                            className="font-body text-xs font-600 px-2.5 py-0.5 rounded-full"
                            style={{ backgroundColor: selected.bgColor, color: selected.textColor }}
                          >
                            {ing.dose}
                          </span>
                        </div>
                        <p className="font-body text-xs text-[#1E1B16]/50">{ing.benefit}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="flex items-center gap-1.5 text-xs font-body font-500 px-3 py-1.5 rounded-full bg-[#C8813A]/8 text-[#C8813A]"
                    >
                      <Check size={10} />
                      {cert}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/products/${selected.slug}`)}
                  className="btn-amber text-xs py-2.5 px-5"
                >
                  Shop Luma {selected.name} <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Never Use */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="font-display font-700 text-4xl text-[#1E1B16]">
              What you'll <em className="italic text-[#C8813A]">never</em> find in a Luma formula
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              "Artificial colors or dyes",
              "Artificial flavors",
              "High-fructose corn syrup",
              "Proprietary blends",
              "Undisclosed fillers",
              "Artificial sweeteners",
              "Gluten",
              "Animal-derived gelatin",
              "GMO ingredients",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.06}
                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <span className="text-red-400 text-xs font-700">✕</span>
                </div>
                <span className="font-body text-sm text-[#1E1B16]/70">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C8813A]">
        <div className="container text-center">
          <h2 className="font-display font-700 text-3xl text-white mb-3">
            Questions about our ingredients?
          </h2>
          <p className="font-body text-base text-white/75 mb-6 max-w-md mx-auto">
            Our team is always happy to answer questions about our formulas, sourcing, or testing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/contact")}
              className="bg-white text-[#C8813A] font-body font-600 text-sm tracking-wider uppercase px-8 py-3.5 rounded-full hover:bg-[#FAF7F2] transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="border border-white/40 text-white font-body text-sm px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Shop All Formulas <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
