/**
 * SignIn — Customer sign in / create account
 * Design: Warm Editorial — cream/charcoal/amber palette
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Eye, EyeOff, ArrowRight, Lock, Mail, User } from "lucide-react";

type Mode = "signin" | "signup" | "forgot";

export default function SignIn() {
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [, navigate] = useLocation();

  const inputClass =
    "w-full font-body text-sm text-[#1E1B16] bg-white border border-[#E8E0D4] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#C8813A] focus:ring-1 focus:ring-[#C8813A]/30 transition-colors placeholder:text-[#1E1B16]/30";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth — navigate to account dashboard
    navigate("/account");
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-[#E8E0D4] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C8813A] rounded-full flex items-center justify-center">
              <span className="font-display font-700 text-white text-sm">L</span>
            </div>
            <span className="font-display font-700 text-lg text-[#1E1B16]">Luma Daily</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="font-body text-sm text-[#1E1B16]/50 hover:text-[#1E1B16] transition-colors"
          >
            ← Back to store
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Brand mark */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#C8813A] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-display font-700 text-white text-2xl">L</span>
            </div>
            <AnimatePresence mode="wait">
              {mode === "signin" && (
                <motion.div key="signin-title" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <h1 className="font-display font-700 text-3xl text-[#1E1B16] mb-1">
                    Welcome back
                  </h1>
                  <p className="font-body text-[#1E1B16]/55 text-sm">
                    Sign in to manage your ritual
                  </p>
                </motion.div>
              )}
              {mode === "signup" && (
                <motion.div key="signup-title" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <h1 className="font-display font-700 text-3xl text-[#1E1B16] mb-1">
                    Start your ritual
                  </h1>
                  <p className="font-body text-[#1E1B16]/55 text-sm">
                    Create your Luma Daily account
                  </p>
                </motion.div>
              )}
              {mode === "forgot" && (
                <motion.div key="forgot-title" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <h1 className="font-display font-700 text-3xl text-[#1E1B16] mb-1">
                    Reset password
                  </h1>
                  <p className="font-body text-[#1E1B16]/55 text-sm">
                    We'll send a reset link to your email
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#E8E0D4] p-8">
            <AnimatePresence mode="wait">
              {/* Sign In form */}
              {mode === "signin" && (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1B16]/30" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1B16]/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pl-10 pr-12`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E1B16]/30 hover:text-[#1E1B16]/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="font-body text-sm text-[#C8813A] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <button type="submit" className="btn-amber w-full justify-center py-4 text-base flex items-center gap-2">
                    Sign In
                    <ArrowRight size={16} />
                  </button>
                  <div className="relative flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-[#E8E0D4]" />
                    <span className="font-body text-xs text-[#1E1B16]/40">or</span>
                    <div className="flex-1 h-px bg-[#E8E0D4]" />
                  </div>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 border border-[#E8E0D4] rounded-xl py-3.5 font-body text-sm text-[#1E1B16] hover:bg-[#FAF7F2] transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </motion.form>
              )}

              {/* Sign Up form */}
              {mode === "signup" && (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1B16]/30" />
                      <input
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`${inputClass} pl-10`}
                        required
                      />
                    </div>
                    <input
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1B16]/30" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1B16]/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pl-10 pr-12`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E1B16]/30 hover:text-[#1E1B16]/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="font-body text-xs text-[#1E1B16]/40">
                    By creating an account you agree to our{" "}
                    <button type="button" onClick={() => navigate("/terms")} className="text-[#C8813A] cursor-pointer hover:underline">Terms</button> and{" "}
                    <button type="button" onClick={() => navigate("/privacy")} className="text-[#C8813A] cursor-pointer hover:underline">Privacy Policy</button>.
                  </p>
                  <button type="submit" className="btn-amber w-full justify-center py-4 text-base flex items-center gap-2">
                    Create Account
                    <ArrowRight size={16} />
                  </button>
                </motion.form>
              )}

              {/* Forgot password */}
              {mode === "forgot" && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {submitted ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={20} className="text-green-600" />
                      </div>
                      <h3 className="font-display font-700 text-lg text-[#1E1B16] mb-2">
                        Check your inbox
                      </h3>
                      <p className="font-body text-sm text-[#1E1B16]/60 mb-6">
                        We sent a reset link to <strong>{email}</strong>
                      </p>
                      <button
                        onClick={() => { setMode("signin"); setSubmitted(false); }}
                        className="btn-outline-dark px-6 py-2.5 text-sm"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgot} className="space-y-4">
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1B16]/30" />
                        <input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`${inputClass} pl-10`}
                          required
                        />
                      </div>
                      <button type="submit" className="btn-amber w-full justify-center py-4 text-base flex items-center gap-2">
                        Send Reset Link
                        <ArrowRight size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("signin")}
                        className="w-full text-center font-body text-sm text-[#1E1B16]/50 hover:text-[#1E1B16] transition-colors"
                      >
                        ← Back to Sign In
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle mode */}
          {mode !== "forgot" && (
            <p className="text-center font-body text-sm text-[#1E1B16]/60 mt-6">
              {mode === "signin" ? (
                <>
                  New to Luma Daily?{" "}
                  <button
                    onClick={() => navigate("/register")}
                    className="text-[#C8813A] font-600 hover:underline"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("signin")}
                    className="text-[#C8813A] font-600 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
