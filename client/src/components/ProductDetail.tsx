import { Check, ShoppingCart, Star, X } from "lucide-react";

interface Product {
  name: string;
  tagline: string;
  flavor: string;
  accentColor: string;
  price: number;
  img: string;
  soldOut: boolean;
  compareAtPrice?: number;
}

interface ProductDetailProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, subscribe: boolean) => void;
  addingId: string | null;
  successId: string | null;
}

export default function ProductDetail({
  product,
  allProducts,
  onClose,
  onAddToCart,
  addingId,
  successId,
}: ProductDetailProps) {
  if (!product) return null;

  const subscribePrice = Number((product.price * 0.8).toFixed(2));
  const complementaryProducts = allProducts
    .filter((item) => item.name !== product.name)
    .slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-[oklch(0.12_0.03_55_/_0.72)] p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-[oklch(0.98_0.015_80)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[oklch(0.22_0.04_55)] shadow-sm transition hover:bg-white"
          aria-label="Close product details"
        >
          <X size={18} />
        </button>

        <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
          <div
            className="min-h-[360px] p-8"
            style={{
              background: `linear-gradient(160deg, ${product.accentColor}22, oklch(0.98 0.015 80))`,
            }}
          >
            <div className="flex h-full items-center justify-center rounded-[1.5rem] bg-white/45 p-6">
              <img
                src={product.img}
                alt={`${product.name} bottle`}
                className="max-h-[430px] w-full object-contain drop-shadow-xl"
              />
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex text-[oklch(0.72_0.12_80)]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <span className="font-body text-xs text-[oklch(0.42_0.04_55)]">
                10,000+ daily rituals started
              </span>
            </div>

            <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-[oklch(0.72_0.12_80)]">
              {product.flavor}
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-[oklch(0.18_0.04_55)] md:text-5xl">
              {product.name}
            </h2>
            <p className="mt-4 font-body text-lg text-[oklch(0.32_0.04_55)]">
              {product.tagline}
            </p>

            <div className="mt-6 grid gap-3">
              {[
                "Built for daily consistency",
                "Vegan, gluten-free, and third-party tested",
                "Great-tasting gummies made for an easy ritual",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 font-body text-sm text-[oklch(0.32_0.04_55)]">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: product.accentColor }}
                  >
                    <Check size={13} />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[oklch(0.86_0.03_75)] bg-white/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-body text-sm font-bold text-[oklch(0.18_0.04_55)]">
                    Subscribe & Save 20%
                  </p>
                  <p className="font-body text-xs text-[oklch(0.46_0.04_55)]">
                    Delivered monthly. Pause or cancel anytime.
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-[oklch(0.18_0.04_55)]">
                    ${subscribePrice}
                  </p>
                  <p className="font-body text-xs text-[oklch(0.46_0.04_55)]">
                    or ${product.price.toFixed(2)} one-time
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={product.soldOut || addingId === product.name}
                onClick={() => onAddToCart(product, true)}
                className="btn-primary flex flex-1 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={16} />
                {successId === product.name ? "Added to Ritual" : "Subscribe & Save"}
              </button>
              <button
                type="button"
                disabled={product.soldOut || addingId === product.name}
                onClick={() => onAddToCart(product, false)}
                className="btn-secondary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                One-time purchase
              </button>
            </div>

            {complementaryProducts.length > 0 && (
              <div className="mt-8">
                <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-[oklch(0.52_0.04_55)]">
                  Pairs well with
                </p>
                <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                  {complementaryProducts.map((item) => (
                    <div key={item.name} className="min-w-[132px] rounded-2xl border border-[oklch(0.86_0.03_75)] bg-white/55 p-3">
                      <img src={item.img} alt="" className="h-16 w-full object-contain" />
                      <p className="mt-2 font-body text-xs font-bold text-[oklch(0.18_0.04_55)]">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
