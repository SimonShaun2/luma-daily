/*
 * LUMA DAILY — Contact Page
 * Design: Warm Editorial — contact form, support channels, FAQ link
 * Route: /contact
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Clock, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

const topics = [
  "Order & Shipping",
  "Subscription Management",
  "Product Questions",
  "Returns & Refunds",
  "Ingredients & Allergens",
  "Wholesale / Press",
  "Other",
];

export default function Contact() {
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
    orderNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Message sent! We'll be in touch within 24 hours.");
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
              <button onClick={() => navigate("/shop")} className="font-body text-sm text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors">Shop</button>
              <button onClick={() => navigate("/quiz")} className="btn-amber py-2 px-5 text-xs">Find My Ritual</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#1A1510] py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#C8813A]/20 text-[#C8813A] text-xs font-body font-600 tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              We're Here to Help
            </div>
            <h1 className="font-display font-800 text-4xl lg:text-5xl text-[#FAF7F2] mb-3">
              Contact Support
            </h1>
            <p className="font-body text-base text-[#FAF7F2]/55 max-w-md">
              Our team typically responds within 24 hours. For urgent subscription issues, we aim to respond within 4 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Contact channels */}
          <div className="space-y-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="font-display font-700 text-2xl text-[#1E1B16] mb-6">Other ways to reach us</h2>
            </motion.div>

            {[
              {
                icon: <Mail size={18} />,
                title: "Email",
                value: "hello@lumadaily.com",
                desc: "For general inquiries and non-urgent support",
                responseTime: "Within 24 hours",
              },
              {
                icon: <MessageCircle size={18} />,
                title: "Live Chat",
                value: "Available on site",
                desc: "Real-time support for quick questions",
                responseTime: "Mon–Fri, 9am–6pm PT",
              },
              {
                icon: <Clock size={18} />,
                title: "Subscriber Priority",
                value: "Priority queue",
                desc: "Active subscribers get priority response",
                responseTime: "Within 4 hours",
              },
            ].map((channel, i) => (
              <motion.div
                key={channel.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.1}
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#C8813A]/10 flex items-center justify-center text-[#C8813A] shrink-0">
                    {channel.icon}
                  </div>
                  <div>
                    <div className="font-body font-600 text-sm text-[#1E1B16] mb-0.5">{channel.title}</div>
                    <div className="font-body text-sm text-[#C8813A] mb-1">{channel.value}</div>
                    <div className="font-body text-xs text-[#1E1B16]/50 mb-1">{channel.desc}</div>
                    <div className="font-body text-[10px] text-[#1E1B16]/35">{channel.responseTime}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.3}
              className="bg-[#C8813A]/8 rounded-2xl p-5"
            >
              <p className="font-body text-sm font-600 text-[#C8813A] mb-2">Looking for quick answers?</p>
              <p className="font-body text-xs text-[#1E1B16]/60 mb-3">
                Many common questions are answered in our FAQ section.
              </p>
              <button
                onClick={() => navigate("/#faq")}
                className="font-body text-xs font-600 text-[#C8813A] hover:text-[#A66A2A] transition-colors flex items-center gap-1"
              >
                Browse FAQ <ArrowRight size={12} />
              </button>
            </motion.div>
          </div>

          {/* Right: Contact form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-10 shadow-sm text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#C8813A]/10 flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-[#C8813A]" />
                </div>
                <h3 className="font-display font-700 text-2xl text-[#1E1B16] mb-2">Message received!</h3>
                <p className="font-body text-base text-[#1E1B16]/60 mb-6 max-w-sm mx-auto">
                  Thanks for reaching out. We'll get back to you at <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="btn-amber"
                >
                  Return Home
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-8 shadow-sm"
              >
                <h2 className="font-display font-700 text-2xl text-[#1E1B16] mb-6">Send us a message</h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="font-body text-xs font-600 text-[#1E1B16]/60 uppercase tracking-wider mb-1.5 block">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full border border-[#E8E0D4] rounded-xl px-4 py-3 font-body text-sm text-[#1E1B16] placeholder:text-[#1E1B16]/30 focus:outline-none focus:border-[#C8813A] transition-colors bg-[#FAF7F2]/50"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-600 text-[#1E1B16]/60 uppercase tracking-wider mb-1.5 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full border border-[#E8E0D4] rounded-xl px-4 py-3 font-body text-sm text-[#1E1B16] placeholder:text-[#1E1B16]/30 focus:outline-none focus:border-[#C8813A] transition-colors bg-[#FAF7F2]/50"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="font-body text-xs font-600 text-[#1E1B16]/60 uppercase tracking-wider mb-1.5 block">
                      Topic
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full border border-[#E8E0D4] rounded-xl px-4 py-3 font-body text-sm text-[#1E1B16] focus:outline-none focus:border-[#C8813A] transition-colors bg-[#FAF7F2]/50 appearance-none"
                    >
                      <option value="">Select a topic</option>
                      {topics.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs font-600 text-[#1E1B16]/60 uppercase tracking-wider mb-1.5 block">
                      Order Number (optional)
                    </label>
                    <input
                      type="text"
                      value={form.orderNumber}
                      onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                      placeholder="e.g. LD-2026-00123"
                      className="w-full border border-[#E8E0D4] rounded-xl px-4 py-3 font-body text-sm text-[#1E1B16] placeholder:text-[#1E1B16]/30 focus:outline-none focus:border-[#C8813A] transition-colors bg-[#FAF7F2]/50"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="font-body text-xs font-600 text-[#1E1B16]/60 uppercase tracking-wider mb-1.5 block">
                    Message *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    rows={5}
                    className="w-full border border-[#E8E0D4] rounded-xl px-4 py-3 font-body text-sm text-[#1E1B16] placeholder:text-[#1E1B16]/30 focus:outline-none focus:border-[#C8813A] transition-colors bg-[#FAF7F2]/50 resize-none"
                  />
                </div>

                <button type="submit" className="btn-amber w-full justify-center">
                  Send Message <ArrowRight size={14} />
                </button>

                <p className="font-body text-xs text-[#1E1B16]/35 text-center mt-4">
                  By submitting this form you agree to our{" "}
                  <button onClick={() => navigate("/privacy")} className="text-[#C8813A] hover:underline">Privacy Policy</button>.
                </p>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
