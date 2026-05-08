import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { goalLandingPages } from "@/lib/articles";

export default function ExploreByGoal() {
  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="container">
        <div className="mb-10 max-w-2xl">
          <p className="font-body text-xs font-600 uppercase tracking-[0.18em] text-[#C8813A]">
            Explore by goal
          </p>
          <h2 className="mt-3 font-display text-4xl font-700 text-[#1E1B16]">
            Find the support that fits your ritual.
          </h2>
          <p className="mt-3 font-body text-base leading-relaxed text-[#1E1B16]/55">
            Useful guides for choosing a focused formula or building a full daily ritual.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goalLandingPages.map((goal) => (
            <Link
              key={goal.slug}
              href={`/goals/${goal.slug}`}
              className="group rounded-3xl border border-[#E8E0D4] bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <p className="font-body text-[11px] font-700 uppercase tracking-[0.16em] text-[#C8813A]">
                {goal.eyebrow}
              </p>
              <h3 className="mt-3 font-display text-2xl font-700 text-[#1E1B16]">
                {goal.title}
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-[#1E1B16]/55">
                {goal.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-body text-sm font-700 text-[#C8813A]">
                Read guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
