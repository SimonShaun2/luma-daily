/**
 * Account Dashboard — Customer account & subscription management
 * Design: Warm Editorial — cream/charcoal/amber palette
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Package,
  RefreshCw,
  CreditCard,
  MapPin,
  Bell,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Pause,
  Play,
  Trash2,
  Plus,
  Edit3,
  Star,
  Truck,
  Calendar,
  Settings,
  User,
  AlertTriangle,
  X,
  SkipForward,
} from "lucide-react";

type Tab = "overview" | "subscription" | "orders" | "profile" | "billing";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <User size={16} /> },
  { id: "subscription", label: "Subscription", icon: <RefreshCw size={16} /> },
  { id: "orders", label: "Order History", icon: <Package size={16} /> },
  { id: "profile", label: "Profile", icon: <Settings size={16} /> },
  { id: "billing", label: "Billing", icon: <CreditCard size={16} /> },
];

const MOCK_SUBSCRIPTION = {
  status: "active" as "active" | "paused" | "cancelled",
  nextBillingDate: "June 6, 2026",
  nextShipDate: "June 3, 2026",
  frequency: "Monthly",
  discount: 20,
  items: [
    {
      id: 1,
      name: "Energy",
      flavor: "Blood Orange Mango",
      price: 30.4,
      originalPrice: 38,
      image: "/manus-storage/luma_energy_bottle_e7f2a3b1.png",
      color: "#F59E0B",
      quantity: 1,
    },
    {
      id: 3,
      name: "Sleep",
      flavor: "Blueberry Lavender",
      price: 30.4,
      originalPrice: 38,
      image: "/manus-storage/luma_sleep_bottle_c9d4e5f6.png",
      color: "#8B5CF6",
      quantity: 1,
    },
  ],
};

const MOCK_ORDERS = [
  {
    id: "LD-A7B2C3",
    date: "May 3, 2026",
    status: "Delivered",
    total: 60.8,
    items: ["Energy", "Sleep"],
  },
  {
    id: "LD-D4E5F6",
    date: "April 3, 2026",
    status: "Delivered",
    total: 60.8,
    items: ["Energy", "Sleep"],
  },
  {
    id: "LD-G7H8I9",
    date: "March 3, 2026",
    status: "Delivered",
    total: 91.2,
    items: ["Energy", "Sleep", "Calm"],
  },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    paused: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    Delivered: "bg-green-100 text-green-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-body font-600 ${colors[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

function OverviewTab({ setTab }: { setTab: (t: Tab) => void }) {
  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="bg-[#1E1B16] rounded-2xl p-6 text-white">
        <p className="font-body text-white/50 text-sm mb-1">Good morning,</p>
        <h2 className="font-display font-700 text-2xl mb-1">Sarah Johnson</h2>
        <p className="font-body text-white/60 text-sm">
          Member since March 2026 · Subscriber
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Orders", value: "3", icon: <Package size={18} className="text-[#C8813A]" /> },
          { label: "Streak", value: "3 mo", icon: <Star size={18} className="text-[#C8813A]" /> },
          { label: "Saved", value: "$34.20", icon: <CheckCircle2 size={18} className="text-[#C8813A]" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className="font-display font-700 text-xl text-[#1E1B16]">{stat.value}</p>
            <p className="font-body text-xs text-[#1E1B16]/50">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Subscription summary */}
      <div
        className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setTab("subscription")}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-[#C8813A]" />
            <h3 className="font-display font-700 text-base text-[#1E1B16]">
              Active Subscription
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="active" />
            <ChevronRight size={16} className="text-[#1E1B16]/30" />
          </div>
        </div>
        <p className="font-body text-sm text-[#1E1B16]/60 mb-2">
          Energy + Sleep · Monthly · 20% off
        </p>
        <div className="flex items-center gap-1.5 text-sm">
          <Calendar size={13} className="text-[#C8813A]" />
          <span className="font-body text-[#1E1B16]/60">
            Next shipment: <strong className="text-[#1E1B16]">June 3, 2026</strong>
          </span>
        </div>
      </div>

      {/* Recent order */}
      <div
        className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setTab("orders")}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-[#C8813A]" />
            <h3 className="font-display font-700 text-base text-[#1E1B16]">
              Last Order
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="Delivered" />
            <ChevronRight size={16} className="text-[#1E1B16]/30" />
          </div>
        </div>
        <p className="font-body text-sm text-[#1E1B16]/60">
          LD-A7B2C3 · May 3, 2026 · $60.80
        </p>
      </div>
    </div>
  );
}

// All 6 available Luma Daily formulas for the product picker
const ALL_FORMULAS = [
  {
    id: 1,
    name: "Energy",
    flavor: "Blood Orange Mango",
    tagline: "Natural vitality, sustained",
    price: 30.4,
    originalPrice: 38,
    image: "/manus-storage/luma_energy_bottle_18c415cd.png",
    color: "#F59E0B",
    badge: "Best Seller",
    badgeColor: "#C8813A",
  },
  {
    id: 2,
    name: "Calm",
    flavor: "Raspberry Hibiscus",
    tagline: "Stress less, live more",
    price: 30.4,
    originalPrice: 38,
    image: "/manus-storage/luma_calm_bottle_14cc2d8f.png",
    color: "#EC4899",
    badge: "Fan Favorite",
    badgeColor: "#10B981",
  },
  {
    id: 3,
    name: "Sleep",
    flavor: "Blueberry Lavender",
    tagline: "Rest deeply, wake ready",
    price: 30.4,
    originalPrice: 38,
    image: "/manus-storage/luma_sleep_bottle_a6f93589.png",
    color: "#8B5CF6",
    badge: null,
    badgeColor: "",
  },
  {
    id: 4,
    name: "Focus",
    flavor: "Spearmint Green Tea",
    tagline: "Clarity on demand",
    price: 30.4,
    originalPrice: 38,
    image: "/manus-storage/luma_focus_bottle_4364c9ab.png",
    color: "#0EA5E9",
    badge: "New",
    badgeColor: "#6366F1",
  },
  {
    id: 5,
    name: "Glow",
    flavor: "Strawberry Peach",
    tagline: "Beauty from within",
    price: 30.4,
    originalPrice: 38,
    image: "/manus-storage/luma_glow_bottle_c1ab2dea.png",
    color: "#F97316",
    badge: null,
    badgeColor: "",
  },
  {
    id: 6,
    name: "Gut",
    flavor: "Citrus Mint",
    tagline: "Digestive harmony, daily",
    price: 30.4,
    originalPrice: 38,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663633783733/NP8W4PN5hdBACVumhQ3AtE/luma_gut_bottle-XRZKo6DKmqn38DjNUJpCzw.webp",
    color: "#84CC16",
    badge: "New",
    badgeColor: "#6366F1",
  },
];

function AddFormulaModal({
  open,
  onClose,
  currentItemIds,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  currentItemIds: number[];
  onAdd: (selected: typeof ALL_FORMULAS) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const available = ALL_FORMULAS.filter((f) => !currentItemIds.includes(f.id));
  const selectedFormulas = ALL_FORMULAS.filter((f) => selected.includes(f.id));
  const totalAdd = selectedFormulas.reduce((sum, f) => sum + f.price, 0);

  const handleAdd = () => {
    onAdd(selectedFormulas);
    setSelected([]);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ backgroundColor: "rgba(30,27,22,0.55)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E8E0D4]">
            <div>
              <h2 className="font-display font-700 text-xl text-[#1E1B16]">Add a Formula</h2>
              <p className="font-body text-sm text-[#1E1B16]/50 mt-0.5">20% subscriber discount applied automatically</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#E8E0D4] flex items-center justify-center text-[#1E1B16]/50 hover:text-[#1E1B16] hover:bg-[#DDD5C8] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Formula grid */}
          <div className="overflow-y-auto flex-1 p-6">
            {available.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-display font-700 text-lg text-[#1E1B16] mb-2">You have all formulas!</p>
                <p className="font-body text-sm text-[#1E1B16]/50">All 6 Luma Daily formulas are already in your ritual.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {available.map((formula) => {
                  const isSelected = selected.includes(formula.id);
                  return (
                    <button
                      key={formula.id}
                      onClick={() => toggle(formula.id)}
                      className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-[#C8813A] bg-white shadow-md"
                          : "border-[#E8E0D4] bg-white hover:border-[#C8813A]/40 hover:shadow-sm"
                      }`}
                    >
                      {/* Badge */}
                      {formula.badge && (
                        <span
                          className="absolute top-3 left-3 font-body text-xs font-600 text-white px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: formula.badgeColor }}
                        >
                          {formula.badge}
                        </span>
                      )}

                      {/* Checkmark */}
                      <div
                        className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[#C8813A] bg-[#C8813A]"
                            : "border-[#E8E0D4]"
                        }`}
                      >
                        {isSelected && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        )}
                      </div>

                      {/* Product image */}
                      <div
                        className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: formula.color + "18" }}
                      >
                        <img
                          src={formula.image}
                          alt={formula.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-700 text-base text-[#1E1B16]">Luma {formula.name}</p>
                        <p className="font-body text-xs text-[#1E1B16]/50 mb-1.5">{formula.tagline}</p>
                        <span
                          className="inline-block font-body text-xs font-600 px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: formula.color + "20", color: formula.color }}
                        >
                          {formula.flavor}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-body text-sm font-700 text-[#1E1B16]">${formula.price.toFixed(2)}</p>
                        <p className="font-body text-xs text-[#1E1B16]/40 line-through">${formula.originalPrice.toFixed(2)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-[#E8E0D4] bg-white">
            {selected.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-between mb-4"
              >
                <p className="font-body text-sm text-[#1E1B16]/60">
                  {selected.length} formula{selected.length > 1 ? "s" : ""} selected
                </p>
                <p className="font-body text-sm font-700 text-[#1E1B16]">
                  +${totalAdd.toFixed(2)}/mo
                </p>
              </motion.div>
            )}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#E8E0D4] font-body text-sm font-600 text-[#1E1B16] hover:bg-[#FAF7F2] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={selected.length === 0}
                className={`flex-1 py-3 rounded-xl font-body text-sm font-600 text-white transition-all ${
                  selected.length > 0
                    ? "bg-[#C8813A] hover:bg-[#b8722e] shadow-md"
                    : "bg-[#E8E0D4] text-[#1E1B16]/30 cursor-not-allowed"
                }`}
              >
                {selected.length === 0
                  ? "Select a formula"
                  : `Add ${selected.length} Formula${selected.length > 1 ? "s" : ""} to Ritual`}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  confirmClass,
  icon,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass: string;
  icon: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(30,27,22,0.5)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#1E1B16]/30 hover:text-[#1E1B16] transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#FAF7F2]">
              {icon}
            </div>
            <div>
              <h3 className="font-display font-700 text-xl text-[#1E1B16] mb-2">{title}</h3>
              <p className="font-body text-sm text-[#1E1B16]/60 leading-relaxed">{description}</p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#E8E0D4] font-body text-sm font-600 text-[#1E1B16] hover:bg-[#FAF7F2] transition-colors"
              >
                Keep Active
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 py-3 rounded-xl font-body text-sm font-600 text-white transition-colors ${confirmClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SubscriptionTab() {
  const [sub, setSub] = useState(MOCK_SUBSCRIPTION);
  const [, navigate] = useLocation();
  const [modal, setModal] = useState<"pause" | "resume" | "skip" | "cancel" | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const handleAddFormulas = (newFormulas: typeof ALL_FORMULAS) => {
    setSub((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        ...newFormulas.map((f) => ({
          id: f.id,
          name: f.name,
          flavor: f.flavor,
          price: f.price,
          originalPrice: f.originalPrice,
          image: f.image,
          color: f.color,
          quantity: 1,
        })),
      ],
    }));
  };

  const handlePause = () => setSub((s) => ({ ...s, status: "paused" }));
  const handleResume = () => setSub((s) => ({ ...s, status: "active" }));
  const handleSkip = () => {
    setSkipped(true);
    setSub((s) => ({ ...s, nextShipDate: "July 3, 2026", nextBillingDate: "July 6, 2026" }));
  };
  const handleCancel = () => {
    setCancelled(true);
    setSub((s) => ({ ...s, status: "cancelled" }));
  };

  return (
    <div className="space-y-5">
      {/* Status card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-700 text-lg text-[#1E1B16]">
            My Subscription
          </h3>
          <StatusBadge status={sub.status} />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          {[
            { label: "Frequency", value: sub.frequency },
            { label: "Discount", value: `${sub.discount}% off` },
            { label: "Next Ship", value: sub.nextShipDate },
            { label: "Next Bill", value: sub.nextBillingDate },
          ].map((item) => (
            <div key={item.label} className="bg-[#FAF7F2] rounded-xl p-3">
              <p className="font-body text-xs text-[#1E1B16]/50 mb-0.5">{item.label}</p>
              <p className="font-body text-sm font-600 text-[#1E1B16]">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModal(sub.status === "active" ? "pause" : "resume")}
            className="flex-1 flex items-center justify-center gap-2 border border-[#E8E0D4] rounded-xl py-3 font-body text-sm font-600 text-[#1E1B16] hover:bg-[#FAF7F2] transition-colors"
          >
            {sub.status === "active" ? (
              <><Pause size={14} /> Pause</>
            ) : (
              <><Play size={14} /> Resume</>
            )}
          </button>
          <button
            onClick={() => !skipped && setModal("skip")}
            disabled={skipped}
            className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-3 font-body text-sm font-600 transition-colors ${
              skipped
                ? "border-green-200 bg-green-50 text-green-600 cursor-default"
                : "border-[#E8E0D4] text-[#1E1B16] hover:bg-[#FAF7F2]"
            }`}
          >
            {skipped ? (
              <><CheckCircle2 size={14} /> Skipped</>
            ) : (
              <><SkipForward size={14} /> Skip Next</>
            )}
          </button>
        </div>
      </div>

      {/* Subscription items */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-700 text-base text-[#1E1B16]">
            Your Formulas
          </h3>
          <button
            onClick={() => setShowFormulaModal(true)}
            className="flex items-center gap-1.5 font-body text-sm text-[#C8813A] hover:underline"
          >
            <Plus size={14} /> Add Formula
          </button>
        </div>
        <div className="space-y-3">
          {sub.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-[#FAF7F2] rounded-xl">
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
              <div className="flex-1">
                <p className="font-body text-sm font-600 text-[#1E1B16]">
                  Luma {item.name}
                </p>
                <p className="font-body text-xs text-[#1E1B16]/50">{item.flavor}</p>
              </div>
              <div className="text-right">
                <p className="font-body text-sm font-700 text-[#1E1B16]">
                  ${item.price.toFixed(2)}
                </p>
                <p className="font-body text-xs text-[#1E1B16]/40 line-through">
                  ${item.originalPrice.toFixed(2)}
                </p>
              </div>
              <button className="text-[#1E1B16]/30 hover:text-red-400 transition-colors ml-2">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Frequency selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-display font-700 text-base text-[#1E1B16] mb-4">
          Delivery Frequency
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {["Monthly", "Every 6 Weeks", "Every 2 Months"].map((freq) => (
            <button
              key={freq}
              onClick={() => setSub((s) => ({ ...s, frequency: freq }))}
              className={`py-3 px-3 rounded-xl border text-center font-body text-sm transition-all ${
                sub.frequency === freq
                  ? "border-[#C8813A] bg-[#C8813A]/5 text-[#C8813A] font-600"
                  : "border-[#E8E0D4] text-[#1E1B16]/60 hover:border-[#C8813A]/40"
              }`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      {/* Cancel */}
      {!cancelled ? (
        <div className="text-center">
          <button
            onClick={() => setModal("cancel")}
            className="font-body text-sm text-[#1E1B16]/40 hover:text-red-500 transition-colors"
          >
            Cancel subscription
          </button>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
          <p className="font-display font-700 text-base text-red-600 mb-1">Subscription Cancelled</p>
          <p className="font-body text-sm text-red-400">
            Your subscription has been cancelled. You won't be charged again.
          </p>
          <button
            onClick={() => { setCancelled(false); setSub(MOCK_SUBSCRIPTION); }}
            className="mt-3 font-body text-sm text-[#C8813A] hover:underline"
          >
            Reactivate subscription
          </button>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        open={modal === "pause"}
        onClose={() => setModal(null)}
        onConfirm={handlePause}
        title="Pause your ritual?"
        description="Your subscription will be paused and no shipments will go out until you resume. You can resume anytime from your account."
        confirmLabel="Yes, Pause"
        confirmClass="bg-[#C8813A] hover:bg-[#b8722e]"
        icon={<Pause size={24} className="text-[#C8813A]" />}
      />
      <ConfirmModal
        open={modal === "resume"}
        onClose={() => setModal(null)}
        onConfirm={handleResume}
        title="Resume your ritual?"
        description="Your subscription will be reactivated and your next shipment will go out on the scheduled date."
        confirmLabel="Yes, Resume"
        confirmClass="bg-[#C8813A] hover:bg-[#b8722e]"
        icon={<Play size={24} className="text-[#C8813A]" />}
      />
      <ConfirmModal
        open={modal === "skip"}
        onClose={() => setModal(null)}
        onConfirm={handleSkip}
        title="Skip next shipment?"
        description="We'll skip your next shipment and push your next delivery to July 3, 2026. Your subscription will continue as normal after that."
        confirmLabel="Skip Shipment"
        confirmClass="bg-[#1E1B16] hover:bg-[#2d2a24]"
        icon={<SkipForward size={24} className="text-[#1E1B16]" />}
      />
      <ConfirmModal
        open={modal === "cancel"}
        onClose={() => setModal(null)}
        onConfirm={handleCancel}
        title="Cancel subscription?"
        description="This will permanently cancel your subscription. You'll lose your 20% subscriber discount and won't receive future shipments. This cannot be undone."
        confirmLabel="Cancel Subscription"
        confirmClass="bg-red-500 hover:bg-red-600"
        icon={<AlertTriangle size={24} className="text-red-500" />}
      />
      <AddFormulaModal
        open={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        currentItemIds={sub.items.map((i) => i.id)}
        onAdd={handleAddFormulas}
      />
    </div>
  );
}
function OrdersTab() {
  return (
    <div className="space-y-4">
      {MOCK_ORDERS.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-display font-700 text-base text-[#1E1B16]">
                #{order.id}
              </p>
              <p className="font-body text-sm text-[#1E1B16]/50">{order.date}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-[#1E1B16]/60">
              {order.items.join(" · ")}
            </p>
            <p className="font-body text-sm font-700 text-[#1E1B16]">
              ${order.total.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 border border-[#E8E0D4] rounded-xl py-2.5 font-body text-sm text-[#1E1B16] hover:bg-[#FAF7F2] transition-colors">
              View Details
            </button>
            <button className="flex-1 border border-[#E8E0D4] rounded-xl py-2.5 font-body text-sm text-[#1E1B16] hover:bg-[#FAF7F2] transition-colors">
              Reorder
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab() {
  const [name, setName] = useState("Sarah Johnson");
  const [email, setEmail] = useState("sarah@example.com");
  const [saved, setSaved] = useState(false);

  const inputClass =
    "w-full font-body text-sm text-[#1E1B16] bg-white border border-[#E8E0D4] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C8813A] focus:ring-1 focus:ring-[#C8813A]/30 transition-colors";

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-display font-700 text-lg text-[#1E1B16] mb-5">
          Personal Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="font-body text-xs text-[#1E1B16]/50 mb-1.5 block">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="font-body text-xs text-[#1E1B16]/50 mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="font-body text-xs text-[#1E1B16]/50 mb-1.5 block">Phone</label>
            <input placeholder="Add phone number" className={inputClass} />
          </div>
        </div>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className="btn-amber mt-5 px-6 py-2.5 text-sm flex items-center gap-2"
        >
          {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Edit3 size={14} /> Save Changes</>}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-display font-700 text-lg text-[#1E1B16] mb-4">
          Shipping Address
        </h3>
        <div className="flex items-start gap-3 p-4 bg-[#FAF7F2] rounded-xl mb-3">
          <MapPin size={16} className="text-[#C8813A] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-body text-sm font-600 text-[#1E1B16]">Home</p>
            <p className="font-body text-sm text-[#1E1B16]/60">123 Wellness Ave, San Francisco, CA 94102</p>
          </div>
          <button className="ml-auto text-[#1E1B16]/40 hover:text-[#1E1B16] transition-colors">
            <Edit3 size={14} />
          </button>
        </div>
        <button className="flex items-center gap-2 font-body text-sm text-[#C8813A] hover:underline">
          <Plus size={14} /> Add new address
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-700 text-lg text-[#1E1B16]">
            Notifications
          </h3>
          <Bell size={16} className="text-[#C8813A]" />
        </div>
        {[
          { label: "Order updates", sub: "Shipping & delivery notifications" },
          { label: "Subscription reminders", sub: "Upcoming charges & shipments" },
          { label: "New products & offers", sub: "Be first to know about new formulas" },
          { label: "Wellness tips", sub: "Weekly ritual tips from our team" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#E8E0D4] last:border-0">
            <div>
              <p className="font-body text-sm font-600 text-[#1E1B16]">{item.label}</p>
              <p className="font-body text-xs text-[#1E1B16]/50">{item.sub}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#E8E0D4] rounded-full peer peer-checked:bg-[#C8813A] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-700 text-lg text-[#1E1B16]">
            Payment Methods
          </h3>
          <button className="flex items-center gap-1.5 font-body text-sm text-[#C8813A] hover:underline">
            <Plus size={14} /> Add Card
          </button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-[#FAF7F2] rounded-xl border-2 border-[#C8813A]">
          <div className="w-10 h-7 bg-[#1E1B16] rounded flex items-center justify-center">
            <span className="text-white text-xs font-700">VISA</span>
          </div>
          <div className="flex-1">
            <p className="font-body text-sm font-600 text-[#1E1B16]">•••• •••• •••• 4242</p>
            <p className="font-body text-xs text-[#1E1B16]/50">Expires 12/28</p>
          </div>
          <span className="font-body text-xs text-[#C8813A] font-600 bg-[#C8813A]/10 px-2 py-0.5 rounded-full">
            Default
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-display font-700 text-lg text-[#1E1B16] mb-4">
          Billing History
        </h3>
        <div className="space-y-3">
          {[
            { date: "May 3, 2026", amount: "$60.80", status: "Paid" },
            { date: "April 3, 2026", amount: "$60.80", status: "Paid" },
            { date: "March 3, 2026", amount: "$91.20", status: "Paid" },
          ].map((bill) => (
            <div key={bill.date} className="flex items-center justify-between py-3 border-b border-[#E8E0D4] last:border-0">
              <div>
                <p className="font-body text-sm font-600 text-[#1E1B16]">{bill.date}</p>
                <p className="font-body text-xs text-[#1E1B16]/50">Monthly subscription</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-sm font-700 text-[#1E1B16]">{bill.amount}</span>
                <StatusBadge status={bill.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Nav */}
      <nav className="bg-white border-b border-[#E8E0D4] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C8813A] rounded-full flex items-center justify-center">
              <span className="font-display font-700 text-white text-sm">L</span>
            </div>
            <span className="font-display font-700 text-lg text-[#1E1B16]">Luma Daily</span>
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="flex items-center gap-2 font-body text-sm text-[#1E1B16]/50 hover:text-[#1E1B16] transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* User info */}
              <div className="p-5 border-b border-[#E8E0D4]">
                <div className="w-12 h-12 bg-[#C8813A] rounded-full flex items-center justify-center mb-3">
                  <span className="font-display font-700 text-white text-lg">S</span>
                </div>
                <p className="font-display font-700 text-base text-[#1E1B16]">Sarah Johnson</p>
                <p className="font-body text-xs text-[#1E1B16]/50">sarah@example.com</p>
              </div>
              {/* Nav links */}
              <nav className="p-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all mb-0.5 ${
                      activeTab === tab.id
                        ? "bg-[#C8813A]/10 text-[#C8813A] font-600"
                        : "text-[#1E1B16]/60 hover:bg-[#FAF7F2] hover:text-[#1E1B16]"
                    }`}
                  >
                    <span className={activeTab === tab.id ? "text-[#C8813A]" : "text-[#1E1B16]/40"}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "overview" && <OverviewTab setTab={setActiveTab} />}
                {activeTab === "subscription" && <SubscriptionTab />}
                {activeTab === "orders" && <OrdersTab />}
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "billing" && <BillingTab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
