import { ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";
import { products } from "@/lib/products";

export default function RelatedProducts({ slugs }: { slugs: string[] }) {
  const related = products.filter((product) => slugs.includes(product.slug));

  if (!related.length) return null;

  return (
    <section className="py-14">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="font-body text-xs font-600 uppercase tracking-[0.18em] text-[#C8813A]">
            Shop the ritual
          </p>
          <h2 className="mt-2 font-display text-3xl font-700 text-[#1E1B16]">
            Recommended formulas
          </h2>
        </div>
        <Link href="/shop" className="hidden font-body text-sm font-700 text-[#C8813A] md:inline-flex">
          Shop all <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {related.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group overflow-hidden rounded-3xl border border-[#E8E0D4] bg-white shadow-sm"
          >
            <div className="aspect-square overflow-hidden" style={{ backgroundColor: product.bgColor }}>
              <img
                src={product.image}
                alt={`${product.fullName} ${product.flavor} gummies`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center gap-1 text-[#C8813A]">
                <Star size={13} fill="currentColor" />
                <span className="font-body text-xs">{product.rating} rating</span>
              </div>
              <h3 className="font-display text-2xl font-700 text-[#1E1B16]">{product.fullName}</h3>
              <p className="mt-2 font-body text-sm text-[#1E1B16]/55">{product.flavor}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
