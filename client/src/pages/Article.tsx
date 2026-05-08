import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import InlineQuizCta from "@/components/seo/InlineQuizCta";
import RelatedArticles from "@/components/seo/RelatedArticles";
import RelatedProducts from "@/components/seo/RelatedProducts";
import { getArticle } from "@/lib/articles";

export default function Article() {
  const params = useParams<{ slug: string }>();
  const article = getArticle(params.slug);

  if (!article) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-700 text-[#1E1B16]">Guide not found</h1>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 font-body text-sm font-700 text-[#C8813A]">
          <ArrowLeft size={14} /> Back to Luma Daily
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <article className="container max-w-4xl py-16 md:py-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/blog/how-to-build-a-daily-wellness-ritual" },
            { label: article.title, href: `/blog/${article.slug}` },
          ]}
        />
        <p className="mt-10 font-body text-xs font-700 uppercase tracking-[0.18em] text-[#C8813A]">
          {article.category} - {article.readTime}
        </p>
        <h1 className="mt-4 font-display text-5xl font-700 leading-tight text-[#1E1B16] md:text-6xl">
          {article.title}
        </h1>
        <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-[#1E1B16]/60">
          {article.excerpt}
        </p>
        <div className="mt-10 space-y-6 border-y border-[#E8E0D4] py-10">
          {article.body.map((paragraph) => (
            <p key={paragraph} className="font-body text-base leading-8 text-[#1E1B16]/70">
              {paragraph}
            </p>
          ))}
        </div>
        <RelatedProducts slugs={article.relatedProductSlugs} />
        <InlineQuizCta />
      </article>
      <RelatedArticles slugs={article.relatedArticleSlugs} />
    </main>
  );
}
