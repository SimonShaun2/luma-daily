import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { articles } from "@/lib/articles";

export default function RelatedArticles({ slugs }: { slugs: string[] }) {
  const related = articles.filter((article) => slugs.includes(article.slug));

  if (!related.length) return null;

  return (
    <section className="py-14 bg-[#FAF7F2]">
      <div className="container">
        <div className="mb-7">
          <p className="font-body text-xs font-600 uppercase tracking-[0.18em] text-[#C8813A]">
            Ritual guides
          </p>
          <h2 className="mt-2 font-display text-3xl font-700 text-[#1E1B16]">
            Learn how to build your routine
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {related.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group rounded-3xl border border-[#E8E0D4] bg-white p-6 shadow-sm"
            >
              <p className="font-body text-[11px] font-700 uppercase tracking-[0.16em] text-[#C8813A]">
                {article.category} - {article.readTime}
              </p>
              <h3 className="mt-3 font-display text-2xl font-700 text-[#1E1B16]">
                {article.title}
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-[#1E1B16]/55">
                {article.excerpt}
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
