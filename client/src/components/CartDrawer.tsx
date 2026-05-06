/**
 * CartDrawer — Slide-out cart panel
 * Design: Warm Editorial — cream/charcoal/amber palette
 * Playfair Display headings + DM Sans body
 */
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ChevronRight, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, subtotal, savings } = useCart();
  const [, navigate] = useLocation();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
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

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag size={48} className="text-[#C8813A]/30 mb-4" />
                  <h3 className="font-display font-700 text-xl text-[#1E1B16] mb-2">
                    Your ritual awaits
                  </h3>
                  <p className="font-body text-[#1E1B16]/55 text-sm mb-6">
                    Add your formulas to get started.
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn-amber text-sm px-6 py-2.5"
                  >
                    Shop Formulas
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.isSubscription}`}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm"
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
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#1E1B16]/30 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity */}
                          <div className="flex items-center gap-2 bg-[#FAF7F2] rounded-full px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-body text-sm font-600 text-[#1E1B16] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="font-body font-700 text-sm text-[#1E1B16]">
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
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[#E8E0D4] bg-white">
                {savings > 0 && (
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="font-body text-green-600">You save</span>
                    <span className="font-body font-700 text-green-600">
                      −${savings.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-[#1E1B16]/60 text-sm">Subtotal</span>
                  <span className="font-display font-700 text-xl text-[#1E1B16]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="font-body text-xs text-[#1E1B16]/40 mb-4 text-center">
                  Shipping & taxes calculated at checkout
                </p>
                <button
                  onClick={handleCheckout}
                  className="btn-amber w-full justify-center text-base py-4 flex items-center gap-2"
                >
                  Proceed to Checkout
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={closeCart}
                  className="w-full text-center font-body text-sm text-[#1E1B16]/50 hover:text-[#1E1B16] mt-3 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
