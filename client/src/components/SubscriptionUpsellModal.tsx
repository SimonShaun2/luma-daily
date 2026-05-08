import { motion } from "framer-motion";
import { X } from "lucide-react";

interface SubscriptionUpsellModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function SubscriptionUpsellModal({
  open,
  onClose,
  onContinue,
}: SubscriptionUpsellModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <button
        aria-label="Close subscription offer"
        className="absolute inset-0 bg-[#1E1B16]/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.96 }}
        transition={{ duration: 0.22 }}
        className="relative w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#E8E0D4] p-6 shadow-2xl"
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white text-[#1E1B16]/60 hover:text-[#1E1B16] flex items-center justify-center"
        >
          <X size={16} />
        </button>
        <p className="font-body text-xs font-600 tracking-[0.18em] uppercase text-[#C8813A] mb-3">
          Subscribe and save
        </p>
        <h3 className="font-display font-700 text-3xl leading-tight text-[#1E1B16] mb-3">
          Make this a ritual and save 20%.
        </h3>
        <p className="font-body text-sm leading-relaxed text-[#1E1B16]/60 mb-5">
          Luma is built for daily consistency. Subscription pricing can be enabled once Appstle or Recharge is connected, and checkout will continue safely today.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {["Pause anytime", "Ships every 30 days", "No hidden fees"].map((item) => (
            <div key={item} className="rounded-2xl bg-white border border-[#E8E0D4] px-3 py-3 text-center">
              <span className="font-body text-[11px] font-600 text-[#1E1B16]/70">{item}</span>
            </div>
          ))}
        </div>
        <button onClick={onContinue} className="btn-amber w-full justify-center py-4 text-sm">
          Continue to Secure Checkout
        </button>
        <button
          onClick={onClose}
          className="w-full mt-3 font-body text-sm text-[#1E1B16]/50 hover:text-[#1E1B16] transition-colors"
        >
          Review my cart
        </button>
      </motion.div>
    </div>
  );
}
