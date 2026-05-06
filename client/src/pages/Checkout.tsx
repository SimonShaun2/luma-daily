/**
 * Checkout — Multi-step checkout flow
 * Steps: 1. Contact & Shipping → 2. Order Review → 3. Confirmation
 * Design: Warm Editorial — cream/charcoal/amber palette
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import {
  ChevronRight,
  ChevronLeft,
  Lock,
  CheckCircle2,
  Package,
  Truck,
  CreditCard,
  Shield,
} from "lucide-react";

type Step = 1 | 2 | 3;

interface ShippingForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  saveInfo: boolean;
}

interface PaymentForm {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

const initialShipping: ShippingForm = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apt: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phone: "",
  saveInfo: false,
};

const initialPayment: PaymentForm = {
  cardNumber: "",
  expiry: "",
  cvv: "",
  nameOnCard: "",
};

const stepLabels = ["Contact & Shipping", "Review Order", "Confirmation"];

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {stepLabels.map((label, i) => {
        const num = (i + 1) as Step;
        const isActive = step === num;
        const isDone = step > num;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body font-700 transition-all ${
                  isDone
                    ? "bg-[#C8813A] text-white"
                    : isActive
                    ? "bg-[#1E1B16] text-white"
                    : "bg-[#E8E0D4] text-[#1E1B16]/40"
                }`}
              >
                {isDone ? <CheckCircle2 size={14} /> : num}
              </div>
              <span
                className={`font-body text-sm hidden sm:block ${
                  isActive ? "text-[#1E1B16] font-600" : "text-[#1E1B16]/40"
                }`}
              >
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div className="w-8 sm:w-12 h-px bg-[#E8E0D4] mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderSummary({ compact = false }: { compact?: boolean }) {
  const { items, subtotal, savings } = useCart();
  const shipping = subtotal > 60 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className={`bg-white rounded-2xl ${compact ? "p-4" : "p-6"} shadow-sm`}>
      <h3 className="font-display font-700 text-lg text-[#1E1B16] mb-4">
        Order Summary
      </h3>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.isSubscription}`} className="flex gap-3 items-center">
            <div
              className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
              style={{ backgroundColor: item.color + "22" }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-600 text-[#1E1B16] truncate">
                Luma {item.name}
              </p>
              <p className="font-body text-xs text-[#1E1B16]/50">
                {item.flavor} · Qty {item.quantity}
              </p>
            </div>
            <span className="font-body text-sm font-700 text-[#1E1B16]">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-[#E8E0D4] pt-4 space-y-2">
        <div className="flex justify-between font-body text-sm text-[#1E1B16]/60">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between font-body text-sm text-green-600">
            <span>Savings</span>
            <span>−${savings.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-body text-sm text-[#1E1B16]/60">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-body text-sm text-[#1E1B16]/60">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-display font-700 text-lg text-[#1E1B16] pt-2 border-t border-[#E8E0D4]">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      {subtotal < 60 && (
        <p className="font-body text-xs text-[#C8813A] mt-3 text-center">
          Add ${(60 - subtotal).toFixed(2)} more for free shipping
        </p>
      )}
    </div>
  );
}

function ShippingStep({
  form,
  setForm,
  onNext,
}: {
  form: ShippingForm;
  setForm: (f: ShippingForm) => void;
  onNext: () => void;
}) {
  const update = (key: keyof ShippingForm, val: string | boolean) =>
    setForm({ ...form, [key]: val });

  const isValid =
    form.email && form.firstName && form.lastName && form.address && form.city && form.state && form.zip;

  const inputClass =
    "w-full font-body text-sm text-[#1E1B16] bg-white border border-[#E8E0D4] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8813A] focus:ring-1 focus:ring-[#C8813A]/30 transition-colors placeholder:text-[#1E1B16]/30";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Contact */}
      <div className="mb-8">
        <h3 className="font-display font-700 text-lg text-[#1E1B16] mb-4">
          Contact Information
        </h3>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
          />
          <input
            type="tel"
            placeholder="Phone number (optional)"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Shipping */}
      <div className="mb-8">
        <h3 className="font-display font-700 text-lg text-[#1E1B16] mb-4">
          Shipping Address
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className={inputClass}
            />
          </div>
          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Apartment, suite, etc. (optional)"
            value={form.apt}
            onChange={(e) => update("apt", e.target.value)}
            className={inputClass}
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className={`${inputClass} col-span-1`}
            />
            <input
              placeholder="State"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="ZIP"
              value={form.zip}
              onChange={(e) => update("zip", e.target.value)}
              className={inputClass}
            />
          </div>
          <select
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            className={inputClass}
          >
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>Australia</option>
          </select>
        </div>
      </div>

      {/* Save info */}
      <label className="flex items-center gap-3 mb-8 cursor-pointer">
        <input
          type="checkbox"
          checked={form.saveInfo}
          onChange={(e) => update("saveInfo", e.target.checked)}
          className="w-4 h-4 accent-[#C8813A]"
        />
        <span className="font-body text-sm text-[#1E1B16]/60">
          Save this information for next time
        </span>
      </label>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="btn-amber w-full justify-center text-base py-4 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue to Review
        <ChevronRight size={18} />
      </button>
    </motion.div>
  );
}

function ReviewStep({
  shipping,
  payment,
  setPayment,
  onNext,
  onBack,
}: {
  shipping: ShippingForm;
  payment: PaymentForm;
  setPayment: (p: PaymentForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const update = (key: keyof PaymentForm, val: string) =>
    setPayment({ ...payment, [key]: val });

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 3 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  };

  const isValid = payment.cardNumber.replace(/\s/g, "").length === 16 && payment.expiry.length === 5 && payment.cvv.length >= 3 && payment.nameOnCard;

  const inputClass =
    "w-full font-body text-sm text-[#1E1B16] bg-white border border-[#E8E0D4] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8813A] focus:ring-1 focus:ring-[#C8813A]/30 transition-colors placeholder:text-[#1E1B16]/30";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Shipping summary */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-[#C8813A]" />
            <h3 className="font-display font-700 text-base text-[#1E1B16]">
              Shipping to
            </h3>
          </div>
          <button
            onClick={onBack}
            className="font-body text-xs text-[#C8813A] hover:underline"
          >
            Edit
          </button>
        </div>
        <p className="font-body text-sm text-[#1E1B16]/70">
          {shipping.firstName} {shipping.lastName}
        </p>
        <p className="font-body text-sm text-[#1E1B16]/70">
          {shipping.address}{shipping.apt ? `, ${shipping.apt}` : ""}
        </p>
        <p className="font-body text-sm text-[#1E1B16]/70">
          {shipping.city}, {shipping.state} {shipping.zip}
        </p>
        <p className="font-body text-sm text-[#1E1B16]/70">{shipping.email}</p>
      </div>

      {/* Shipping method */}
      <div className="mb-6">
        <h3 className="font-display font-700 text-lg text-[#1E1B16] mb-3">
          Shipping Method
        </h3>
        <div className="space-y-2">
          {[
            { label: "Standard Shipping (5–7 days)", price: "Free", sub: "Orders over $60" },
            { label: "Express Shipping (2–3 days)", price: "$9.99", sub: "" },
            { label: "Overnight (1 day)", price: "$19.99", sub: "" },
          ].map((opt, i) => (
            <label
              key={i}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                i === 0
                  ? "border-[#C8813A] bg-[#C8813A]/5"
                  : "border-[#E8E0D4] bg-white hover:border-[#C8813A]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  defaultChecked={i === 0}
                  className="accent-[#C8813A]"
                />
                <div>
                  <p className="font-body text-sm font-600 text-[#1E1B16]">{opt.label}</p>
                  {opt.sub && <p className="font-body text-xs text-[#1E1B16]/50">{opt.sub}</p>}
                </div>
              </div>
              <span className="font-body text-sm font-700 text-[#1E1B16]">{opt.price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={16} className="text-[#C8813A]" />
          <h3 className="font-display font-700 text-lg text-[#1E1B16]">
            Payment
          </h3>
          <Lock size={12} className="text-[#1E1B16]/40" />
          <span className="font-body text-xs text-[#1E1B16]/40">Secure</span>
        </div>
        <div className="space-y-3">
          <input
            placeholder="Name on card"
            value={payment.nameOnCard}
            onChange={(e) => update("nameOnCard", e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Card number"
            value={payment.cardNumber}
            onChange={(e) => update("cardNumber", formatCard(e.target.value))}
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="MM/YY"
              value={payment.expiry}
              onChange={(e) => update("expiry", formatExpiry(e.target.value))}
              className={inputClass}
            />
            <input
              placeholder="CVV"
              value={payment.cvv}
              onChange={(e) => update("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 mb-6 py-3 bg-[#FAF7F2] rounded-xl">
        <div className="flex items-center gap-1.5 text-[#1E1B16]/50">
          <Shield size={14} />
          <span className="font-body text-xs">SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#1E1B16]/50">
          <Lock size={14} />
          <span className="font-body text-xs">Secure Checkout</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#1E1B16]/50">
          <Package size={14} />
          <span className="font-body text-xs">60-Day Returns</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="btn-outline-dark flex items-center gap-2 px-5 py-4"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="btn-amber flex-1 justify-center text-base py-4 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Place Order
          <Lock size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function ConfirmationStep({ shipping, orderNumber }: { shipping: ShippingForm; orderNumber: string }) {
  const [, navigate] = useLocation();
  const { clearCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2, damping: 14 }}
        className="w-20 h-20 bg-[#C8813A] rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 size={40} className="text-white" />
      </motion.div>

      <h2 className="font-display font-700 text-3xl text-[#1E1B16] mb-2">
        Your ritual is on its way!
      </h2>
      <p className="font-body text-[#1E1B16]/60 mb-6">
        Order <span className="font-600 text-[#1E1B16]">#{orderNumber}</span> confirmed
      </p>

      {/* Confirmation details */}
      <div className="bg-white rounded-2xl p-6 text-left mb-6 shadow-sm max-w-sm mx-auto">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#C8813A]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Truck size={14} className="text-[#C8813A]" />
            </div>
            <div>
              <p className="font-body text-sm font-600 text-[#1E1B16]">Shipping to</p>
              <p className="font-body text-sm text-[#1E1B16]/60">
                {shipping.firstName} {shipping.lastName}
              </p>
              <p className="font-body text-sm text-[#1E1B16]/60">
                {shipping.address}, {shipping.city}, {shipping.state}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#C8813A]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Package size={14} className="text-[#C8813A]" />
            </div>
            <div>
              <p className="font-body text-sm font-600 text-[#1E1B16]">Estimated delivery</p>
              <p className="font-body text-sm text-[#1E1B16]/60">5–7 business days</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#C8813A]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 size={14} className="text-[#C8813A]" />
            </div>
            <div>
              <p className="font-body text-sm font-600 text-[#1E1B16]">Confirmation sent to</p>
              <p className="font-body text-sm text-[#1E1B16]/60">{shipping.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upsell: subscribe */}
      <div className="bg-[#1E1B16] rounded-2xl p-6 text-left mb-8 max-w-sm mx-auto">
        <p className="font-display font-700 text-white text-lg mb-1">
          Never run out again.
        </p>
        <p className="font-body text-white/60 text-sm mb-4">
          Switch to a subscription and save 20% on every order.
        </p>
        <button onClick={() => { clearCart(); navigate("/account"); }} className="btn-amber text-sm px-5 py-2.5 w-full justify-center">
          Start My Subscription
        </button>
      </div>

      <button
        onClick={() => { clearCart(); navigate("/"); }}
        className="btn-outline-dark px-8 py-3"
      >
        Back to Home
      </button>
    </motion.div>
  );
}

export default function Checkout() {
  const [step, setStep] = useState<Step>(1);
  const [shipping, setShipping] = useState<ShippingForm>(initialShipping);
  const [payment, setPayment] = useState<PaymentForm>(initialPayment);
  const [orderNumber] = useState(() =>
    "LD-" + Math.random().toString(36).slice(2, 8).toUpperCase()
  );
  const { items } = useCart();
  const [, navigate] = useLocation();

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display font-700 text-2xl text-[#1E1B16] mb-3">
            Your cart is empty
          </h2>
          <p className="font-body text-[#1E1B16]/60 mb-6">
            Add some formulas to get started.
          </p>
          <button onClick={() => navigate("/")} className="btn-amber px-8 py-3">
            Shop Formulas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Nav */}
      <nav className="bg-white border-b border-[#E8E0D4] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-[#C8813A] rounded-full flex items-center justify-center">
              <span className="font-display font-700 text-white text-sm">L</span>
            </div>
            <span className="font-display font-700 text-lg text-[#1E1B16]">
              Luma Daily
            </span>
          </button>
          <div className="flex items-center gap-1.5 text-[#1E1B16]/50">
            <Lock size={14} />
            <span className="font-body text-sm">Secure Checkout</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {step !== 3 && <StepIndicator step={step} />}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <ShippingStep
                  key="shipping"
                  form={shipping}
                  setForm={setShipping}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <ReviewStep
                  key="review"
                  shipping={shipping}
                  payment={payment}
                  setPayment={setPayment}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <ConfirmationStep
                  key="confirm"
                  shipping={shipping}
                  orderNumber={orderNumber}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          {step !== 3 && (
            <div className="lg:col-span-2">
              <OrderSummary />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
