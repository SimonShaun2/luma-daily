import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import InlineQuizCta from "@/components/seo/InlineQuizCta";
import RelatedProducts from "@/components/seo/RelatedProducts";
import { getGoalLandingPage } from "@/lib/articles";

export default function SeoLanding() {
  const params = useParams<{ slug: string }>();
  const page = getGoalLandingPage(params.slug);

  if (!page) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-700 text-[#1E1B16]">Goal guide not found</h1>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 font-body text-sm font-700 text-[#C8813A]">
          <ArrowLeft size={14} /> Back to Luma Daily
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="container max-w-5xl py-16 md:py-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Goals", href: "/goals/daily-wellness-gummies" },
            { label: page.title, href: `/goals/${page.slug}` },
          ]}
        />
        <div className="mt-10 rounded-[2rem] border border-[#E8E0D4] bg-white p-8 shadow-sm md:p-12">
          <p className="font-body text-xs font-700 uppercase tracking-[0.18em] text-[#C8813A]">
            {page.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-700 leading-tight text-[#1E1B16] md:text-6xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-[#1E1B16]/60">
            {page.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-[#1A1510] px-6 py-3 font-body text-sm font-700 text-white"
            >
              Build My Ritual <ArrowRight size={14} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-[#E8E0D4] px-6 py-3 font-body text-sm font-700 text-[#1E1B16]"
            >
              Shop Gummies
            </Link>
          </div>
        </div>

        <div className="grid gap-5 py-12 md:grid-cols-2">
          {page.sections.map((section) => (
            <section key={section.heading} className="rounded-3xl border border-[#E8E0D4] bg-white p-6">
              <h2 className="font-display text-2xl font-700 text-[#1E1B16]">{section.heading}</h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-[#1E1B16]/60">{section.copy}</p>
            </section>
          ))}
        </div>

        <RelatedProducts slugs={page.productSlugs} />

        <section className="mb-12 rounded-3xl border border-[#E8E0D4] bg-white p-6">
          <p className="font-body text-xs font-700 uppercase tracking-[0.18em] text-[#C8813A]">
            Quick answers
          </p>
          <div className="mt-5 space-y-5">
            {page.faqs.map((faq) => (
              <div key={faq.question}>
                <h2 className="font-body font-700 text-[#1E1B16]">{faq.question}</h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-[#1E1B16]/60">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <InlineQuizCta />
      </section>
    </main>
  );
}
