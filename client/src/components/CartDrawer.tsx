/**
 * CartDrawer — Slide-out cart panel for Luma Daily
 * Design: Warm Editorial — cream/charcoal/amber palette
 * Playfair Display headings + DM Sans body
 *
 * UX Enhancements wired (see docs/CART_UX_ENHANCEMENTS.md):
 *   #2  Success banner on add (lastAddedName from CartContext)
 *   #3  New item slide-in animation (.cart-item-enter)
 *   #4  Remove item shake + slide-out (.item-shake, .item-slide-out)
 *   #5  Quantity change price flash (.price-flash)
 *   #7  Free-shipping progress → unlocked banner
 *   #8  GWP tier at $75 with secondary progress bar
 *   #9  Checkout button glow pulse at $50 (.checkout-glow-pulse)
 *   #10 Sticky checkout footer on mobile
 */
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ChevronRight, Trash2, Check, Gift } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import GiftProgressBar from "@/components/GiftProgressBar";
import SubscriptionUpsellModal from "@/components/SubscriptionUpsellModal";

const FREE_SHIPPING_THRESHOLD = 50;
const GWP_THRESHOLD = 75;

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    subtotal,
    savings,
    checkout,
    isLoading,
    lastAddedName,
  } = useCart();
  const [, navigate] = useLocation();
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  // ── Enhancement #4: Remove item shake + slide-out ─────────────────────────
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // ── Enhancement #5: Quantity change price flash ───────────────────────────
  const [flashId, setFlashId] = useState<string | null>(null);

  // ── Enhancement #3: New item entrance animation ───────────────────────────
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const prevItemIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentIds = new Set(items.map((i) => i.lineId));
    const incoming = new Set<string>();
    currentIds.forEach((id) => {
      if (!prevItemIdsRef.current.has(id)) incoming.add(id);
    });
    if (incoming.size > 0) {
      setNewItemIds(incoming);
      // Clear entrance class after animation completes (350ms)
      const t = setTimeout(() => setNewItemIds(new Set()), 400);
      return () => clearTimeout(t);
    }
    prevItemIdsRef.current = currentIds;
  }, [items]);

  // ── Enhancement #9: Checkout button glow pulse at $50 ────────────────────
  const [glowPulse, setGlowPulse] = useState(false);
  const prevShippingRef = useRef(subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5.99);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5.99;

  useEffect(() => {
    if (prevShippingRef.current > 0 && shipping === 0) {
      setGlowPulse(true);
      const t = setTimeout(() => setGlowPulse(false), 1700);
      return () => clearTimeout(t);
    }
    prevShippingRef.current = shipping;
  }, [shipping]);

  // ── Enhancement #8: GWP tier banner at $75 ───────────────────────────────
  const gwpUnlocked = subtotal >= GWP_THRESHOLD;
  const [gwpBannerVisible, setGwpBannerVisible] = useState(false);
  const prevGwpRef = useRef(gwpUnlocked);

  useEffect(() => {
    if (!prevGwpRef.current && gwpUnlocked) setGwpBannerVisible(true);
    if (prevGwpRef.current && !gwpUnlocked) setGwpBannerVisible(false);
    prevGwpRef.current = gwpUnlocked;
  }, [gwpUnlocked]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleRemove = (lineId: string) => {
    setShakingId(lineId);
    setTimeout(() => {
      setShakingId(null);
      setRemovingId(lineId);
      setTimeout(() => {
        removeItem(lineId);
        setRemovingId(null);
      }, 380);
    }, 450);
  };

  const handleQtyChange = (lineId: string, qty: number) => {
    updateQuantity(lineId, qty);
    setFlashId(lineId);
    setTimeout(() => setFlashId(null), 600);
  };

  const handleCheckout = () => {
    const hasOneTimeItems = items.some((item) => !item.isSubscription);
    if (hasOneTimeItems) {
      setShowSubscribeModal(true);
      return;
    }
    checkout();
  };

  const continueToCheckout = () => {
    setShowSubscribeModal(false);
    checkout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#1E1B16]/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FAF7F2] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E0D4]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#C8813A]" />
                <h2 className="font-display font-700 text-xl text-[#1E1B16]">
                  Your Ritual
                </h2>
                {totalItems > 0 && (
                  <span className="bg-[#C8813A] text-white text-xs font-body font-600 w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1E1B16]/60 hover:text-[#1E1B16] hover:bg-[#E8E0D4] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Enhancement #2: Success banner — slides in when lastAddedName is set */}
            <AnimatePresence>
              {lastAddedName && (
                <motion.div
                  key="success-banner"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mx-4 mt-3 flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-2.5 text-sm font-body font-600"
                >
                  <span className="success-pop inline-flex w-5 h-5 rounded-full bg-green-500 text-white items-center justify-center flex-shrink-0">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>{lastAddedName} added to your ritual!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Free-shipping / GWP progress bar */}
            <GiftProgressBar subtotal={subtotal} />

            {/* Cart Items — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-full text-center py-16"
                >
                  <ShoppingBag size={48} className="text-[#C8813A]/30 mb-4" />
                  <h3 className="font-display font-700 text-xl text-[#1E1B16] mb-2">
                    Your ritual awaits
                  </h3>
                  <p className="font-body text-[#1E1B16]/55 text-sm mb-6">
                    Add your formulas to get started.
                  </p>
                  <button
                    onClick={() => { closeCart(); navigate("/shop"); }}
                    className="btn-amber text-sm px-6 py-2.5"
                  >
                    Shop Formulas
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.lineId}
                      className={[
                        "flex gap-4 bg-white rounded-2xl p-4 shadow-sm transition-colors",
                        newItemIds.has(item.lineId) ? "cart-item-enter" : "",
                        shakingId === item.lineId ? "item-shake" : "",
                        removingId === item.lineId ? "item-slide-out" : "",
                      ].filter(Boolean).join(" ")}
                    >
                      {/* Product image */}
                      <div
                        className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: item.color + "22" }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display font-700 text-sm text-[#1E1B16]">
                              Luma {item.name}
                            </p>
                            <p className="font-body text-xs text-[#1E1B16]/50 mt-0.5">
                              {item.flavor}
                            </p>
                            {item.isSubscription && (
                              <span className="inline-block mt-1 text-xs font-body font-600 text-[#C8813A] bg-[#C8813A]/10 px-2 py-0.5 rounded-full">
                                Subscribe & Save 20%
                              </span>
                            )}
                          </div>
                          {/* Enhancement #4: Trash button turns red on hover, triggers shake */}
                          <button
                            onClick={() => handleRemove(item.lineId)}
                            disabled={shakingId === item.lineId || removingId === item.lineId}
                            className="text-[#1E1B16]/30 hover:text-red-400 transition-colors flex-shrink-0 disabled:opacity-40"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Enhancement #5: Quantity buttons trigger price flash */}
                          <div className="flex items-center gap-2 bg-[#FAF7F2] rounded-full px-2 py-1">
                            <button
                              onClick={() => handleQtyChange(item.lineId, item.quantity - 1)}
                              disabled={isLoading}
                              className="w-5 h-5 flex items-center justify-center text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-body text-sm font-600 text-[#1E1B16] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQtyChange(item.lineId, item.quantity + 1)}
                              disabled={isLoading}
                              className="w-5 h-5 flex items-center justify-center text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Enhancement #5: Price flashes green on qty change */}
                          <div className="text-right">
                            <span
                              className={[
                                "font-body font-700 text-sm text-[#1E1B16] inline-block",
                                flashId === item.lineId ? "price-flash" : "",
                              ].filter(Boolean).join(" ")}
                            >
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="font-body text-xs text-[#1E1B16]/40 line-through ml-1.5">
                                ${(item.originalPrice * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhancement #10: Sticky footer — always visible at bottom */}
            {items.length > 0 && (
              <div className="border-t border-[#E8E0D4] bg-white flex-shrink-0">
                {/* Scrollable totals area */}
                <div className="px-6 pt-4 pb-2 space-y-3 max-h-[40vh] overflow-y-auto">
                  {/* Enhancement #7: Free-shipping progress → unlocked banner */}
                  {subtotal < FREE_SHIPPING_THRESHOLD ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-body text-xs font-600 text-[#1E1B16]">
                          Add <span className="text-[#C8813A]">${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</span> more for free shipping
                        </p>
                        <span className="font-body text-[10px] text-[#1E1B16]/40">${FREE_SHIPPING_THRESHOLD} goal</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#E8E0D4] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#C8813A] transition-all duration-500"
                          style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs font-body font-600 text-green-700"
                    >
                      <Check size={13} className="text-green-500 flex-shrink-0" />
                      🎉 Free shipping unlocked!
                    </motion.div>
                  )}

                  {/* Enhancement #8: GWP secondary progress bar ($50–$75) */}
                  {subtotal >= FREE_SHIPPING_THRESHOLD && !gwpUnlocked && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-body text-xs font-600 text-[#1E1B16]">
                          Add <span className="text-[#C8813A]">${(GWP_THRESHOLD - subtotal).toFixed(2)}</span> for a free sample
                        </p>
                        <Gift size={12} className="text-[#C8813A]" />
                      </div>
                      <div className="h-1.5 rounded-full bg-[#E8E0D4] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all duration-500"
                          style={{ width: `${Math.min(((subtotal - FREE_SHIPPING_THRESHOLD) / (GWP_THRESHOLD - FREE_SHIPPING_THRESHOLD)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Enhancement #8: GWP unlocked banner */}
                  <AnimatePresence>
                    {gwpBannerVisible && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs font-body font-600 text-amber-800"
                      >
                        <span>🎁 Free Luma Glow Sample added!</span>
                        <button
                          onClick={() => setGwpBannerVisible(false)}
                          className="text-amber-500 hover:text-amber-700 transition-colors ml-2 flex-shrink-0"
                          aria-label="Dismiss"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Savings row */}
                  {savings > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-body text-green-600">You save</span>
                      <span className="font-body font-700 text-green-600">
                        −${savings.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[#1E1B16]/60 text-sm">Subtotal</span>
                    <span className="font-display font-700 text-xl text-[#1E1B16]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <p className="font-body text-xs text-[#1E1B16]/40 text-center">
                    {shipping === 0 ? "Free shipping applied" : `+$${shipping.toFixed(2)} shipping · calculated at checkout`}
                  </p>
                </div>

                {/* Sticky CTA — always pinned at bottom */}
                <div className="px-6 pb-5 pt-3">
                  {/* Enhancement #9: Checkout button glow pulse when free shipping unlocks */}
                  <button
                    key={glowPulse ? "glow" : "idle"}
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className={[
                      "btn-amber w-full justify-center text-base py-4 flex items-center gap-2",
                      glowPulse ? "checkout-glow-pulse" : "",
                    ].filter(Boolean).join(" ")}
                  >
                    {isLoading ? "Updating..." : "Proceed to Checkout"}
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={closeCart}
                    className="w-full text-center font-body text-sm text-[#1E1B16]/50 hover:text-[#1E1B16] mt-3 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}

            <SubscriptionUpsellModal
              open={showSubscribeModal}
              onClose={() => setShowSubscribeModal(false)}
              onContinue={continueToCheckout}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
