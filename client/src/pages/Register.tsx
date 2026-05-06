/*
 * LUMA DAILY — Register Page
 * Design: Warm Editorial — clean sign-up form with quiz CTA
 * Route: /register
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    acceptTerms: false,
    marketingOptIn: true,
  });
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full border border-[#E8E0D4] rounded-xl px-4 py-3 font-body text-sm text-[#1E1B16] placeholder:text-[#1E1B16]/30 focus:outline-none focus:border-[#C8813A] focus:ring-1 focus:ring-[#C8813A]/20 transition-colors bg-white";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!form.acceptTerms) {
      toast.error("Please accept the Terms of Service to continue");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Welcome to Luma Daily, ${form.firstName}!`);
      navigate("/quiz");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#1A1510] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/manus-storage/luma_daily_packaging_master_v2_fe19e1c8.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C8813A] flex items-center justify-center">
              <span className="text-white font-display font-700 text-sm">L</span>
            </div>
            <span className="font-display font-700 text-xl text-[#FAF7F2]">Luma Daily</span>
          </button>
        </div>
        <div className="relative z-10">
          <h2 className="font-display font-800 text-4xl text-[#FAF7F2] leading-tight mb-6">
            Start your{" "}
            <em className="italic text-[#C8813A]">daily ritual.</em>
          </h2>
          <div className="space-y-4">
            {[
              "Personalized formula recommendations",
              "20% off every subscription order",
              "Free shipping, always",
              "Pause or cancel anytime",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#C8813A]/20 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-[#C8813A]" />
                </div>
                <span className="font-body text-sm text-[#FAF7F2]/70">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <p className="font-body text-xs text-[#FAF7F2]/30">
            Trusted by 50,000+ daily ritual keepers
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#C8813A] flex items-center justify-center">
                <span className="text-white font-display font-700 text-xs">L</span>
              </div>
              <span className="font-display font-700 text-lg text-[#1E1B16]">Luma Daily</span>
            </button>
          </div>

          <h1 className="font-display font-800 text-3xl text-[#1E1B16] mb-2">Create your account</h1>
          <p className="font-body text-sm text-[#1E1B16]/55 mb-8">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-[#C8813A] hover:text-[#A66A2A] transition-colors font-600"
            >
              Sign in
            </button>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs font-600 text-[#1E1B16]/55 uppercase tracking-wider mb-1.5 block">
                  First Name *
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Jane"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="font-body text-xs font-600 text-[#1E1B16]/55 uppercase tracking-wider mb-1.5 block">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Smith"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="font-body text-xs font-600 text-[#1E1B16]/55 uppercase tracking-wider mb-1.5 block">
                Email Address *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-body text-xs font-600 text-[#1E1B16]/55 uppercase tracking-wider mb-1.5 block">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1B16]/40 hover:text-[#1E1B16]/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="h-1 flex-1 rounded-full transition-colors"
                      style={{
                        backgroundColor:
                          form.password.length >= level * 3
                            ? level <= 1 ? "#EF4444" : level <= 2 ? "#F59E0B" : level <= 3 ? "#84CC16" : "#22C55E"
                            : "#E8E0D4",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => setForm({ ...form, acceptTerms: !form.acceptTerms })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                    form.acceptTerms ? "bg-[#C8813A] border-[#C8813A]" : "border-[#E8E0D4] group-hover:border-[#C8813A]"
                  }`}
                >
                  {form.acceptTerms && <Check size={11} className="text-white" />}
                </div>
                <span className="font-body text-xs text-[#1E1B16]/60 leading-relaxed">
                  I agree to the{" "}
                  <button type="button" onClick={() => navigate("/terms")} className="text-[#C8813A] hover:underline">Terms of Service</button>
                  {" "}and{" "}
                  <button type="button" onClick={() => navigate("/privacy")} className="text-[#C8813A] hover:underline">Privacy Policy</button>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => setForm({ ...form, marketingOptIn: !form.marketingOptIn })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                    form.marketingOptIn ? "bg-[#C8813A] border-[#C8813A]" : "border-[#E8E0D4] group-hover:border-[#C8813A]"
                  }`}
                >
                  {form.marketingOptIn && <Check size={11} className="text-white" />}
                </div>
                <span className="font-body text-xs text-[#1E1B16]/60 leading-relaxed">
                  Send me wellness tips, new product launches, and exclusive subscriber offers
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-amber w-full justify-center mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-[#1E1B16]/10" />
            <span className="font-body text-xs text-[#1E1B16]/35">or</span>
            <div className="h-px flex-1 bg-[#1E1B16]/10" />
          </div>

          {/* Quiz CTA */}
          <div className="bg-[#C8813A]/8 rounded-2xl p-5 text-center">
            <p className="font-body text-sm font-600 text-[#1E1B16] mb-1">
              Not sure where to start?
            </p>
            <p className="font-body text-xs text-[#1E1B16]/55 mb-3">
              Take our 60-second quiz and get personalized formula recommendations before you sign up.
            </p>
            <button
              onClick={() => navigate("/quiz")}
              className="font-body text-sm font-600 text-[#C8813A] hover:text-[#A66A2A] transition-colors flex items-center gap-1 mx-auto"
            >
              Take the Ritual Quiz <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
