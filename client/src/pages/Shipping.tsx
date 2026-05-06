/*
 * LUMA DAILY — Shipping & Returns Page
 * Design: Warm Editorial — clear shipping/returns info
 * Route: /shipping
 */

import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Truck, RefreshCw, Clock, MapPin, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function Shipping() {
  const [, navigate] = useLocation();

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
            <button onClick={() => navigate("/contact")} className="font-body text-sm text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#1A1510] py-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display font-800 text-4xl lg:text-5xl text-[#FAF7F2] mb-3">
              Shipping & Returns
            </h1>
            <p className="font-body text-base text-[#FAF7F2]/55 max-w-md">
              Fast, reliable shipping and a hassle-free return policy — because your experience matters as much as the product.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container py-14">
        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          {/* Shipping */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white rounded-3xl p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C8813A]/10 flex items-center justify-center text-[#C8813A]">
                <Truck size={20} />
              </div>
              <h2 className="font-display font-700 text-2xl text-[#1E1B16]">Shipping</h2>
            </div>

            <div className="space-y-5">
              {[
                {
                  title: "Standard Shipping",
                  desc: "5–7 business days",
                  price: "$5.99 (Free on orders over $60)",
                },
                {
                  title: "Expedited Shipping",
                  desc: "2–3 business days",
                  price: "$12.99",
                },
                {
                  title: "Overnight Shipping",
                  desc: "Next business day",
                  price: "$24.99",
                },
                {
                  title: "Subscription Orders",
                  desc: "Always free, always standard",
                  price: "FREE",
                  highlight: true,
                },
              ].map((option) => (
                <div
                  key={option.title}
                  className={`flex items-center justify-between py-4 border-b border-[#1E1B16]/8 last:border-0 ${option.highlight ? "bg-[#C8813A]/5 -mx-4 px-4 rounded-xl" : ""}`}
                >
                  <div>
                    <div className="font-body font-600 text-sm text-[#1E1B16]">{option.title}</div>
                    <div className="font-body text-xs text-[#1E1B16]/50">{option.desc}</div>
                  </div>
                  <div
                    className={`font-body font-600 text-sm ${option.highlight ? "text-[#C8813A]" : "text-[#1E1B16]"}`}
                  >
                    {option.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#FAF7F2] rounded-xl">
              <p className="font-body text-xs text-[#1E1B16]/55 leading-relaxed">
                Orders placed before 2pm PT on business days are processed same day. Orders placed on weekends or holidays are processed the next business day.
              </p>
            </div>
          </motion.div>

          {/* Returns */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
            className="bg-white rounded-3xl p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C8813A]/10 flex items-center justify-center text-[#C8813A]">
                <RefreshCw size={20} />
              </div>
              <h2 className="font-display font-700 text-2xl text-[#1E1B16]">Returns & Refunds</h2>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-[#C8813A]/8 rounded-xl border border-[#C8813A]/20">
                <div className="font-body font-600 text-sm text-[#C8813A] mb-1">60-Day Money-Back Guarantee</div>
                <p className="font-body text-xs text-[#1E1B16]/60 leading-relaxed">
                  Not satisfied with your first order? We'll refund the full product price — no questions asked — within 60 days of purchase.
                </p>
              </div>

              {[
                {
                  title: "First-time orders",
                  desc: "Full refund within 60 days, even if opened",
                },
                {
                  title: "Unopened products",
                  desc: "Full refund within 30 days of delivery",
                },
                {
                  title: "Defective or damaged items",
                  desc: "Full replacement or refund, no return required",
                },
                {
                  title: "Subscription orders",
                  desc: "Cancel anytime; refunds per order policy above",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 py-3 border-b border-[#1E1B16]/8 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C8813A] mt-1.5 shrink-0" />
                  <div>
                    <div className="font-body font-600 text-sm text-[#1E1B16]">{item.title}</div>
                    <div className="font-body text-xs text-[#1E1B16]/50">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/contact")}
              className="btn-outline-dark mt-6 text-xs py-2.5 px-5"
            >
              Start a Return <ArrowRight size={12} />
            </button>
          </motion.div>
        </div>

        {/* Additional info */}
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: <Clock size={18} />,
              title: "Processing Time",
              desc: "Orders are processed within 1 business day. You'll receive a tracking number via email once your order ships.",
            },
            {
              icon: <MapPin size={18} />,
              title: "Where We Ship",
              desc: "We currently ship to all 50 US states, Canada, and the United Kingdom. International shipping rates vary.",
            },
            {
              icon: <Truck size={18} />,
              title: "Tracking Your Order",
              desc: "Track your order in real-time from your account dashboard under Order History, or via the link in your shipping confirmation email.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.1}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="w-8 h-8 rounded-xl bg-[#C8813A]/10 flex items-center justify-center text-[#C8813A] mb-3">
                {item.icon}
              </div>
              <h3 className="font-body font-600 text-sm text-[#1E1B16] mb-1.5">{item.title}</h3>
              <p className="font-body text-xs text-[#1E1B16]/55 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
