import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function InlineQuizCta({
  eyebrow = "Not sure where to start?",
  title = "Take the 60-second quiz.",
  copy = "Answer a few questions and get a ritual matched to your daily wellness goals.",
}: {
  eyebrow?: string;
  title?: string;
  copy?: string;
}) {
  return (
    <section className="rounded-3xl bg-[#1A1510] px-6 py-10 text-center text-[#FAF7F2] md:px-10">
      <p className="font-body text-xs font-600 uppercase tracking-[0.18em] text-[#C8813A]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-700 md:text-4xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl font-body text-sm leading-relaxed text-[#FAF7F2]/65">
        {copy}
      </p>
      <Link
        href="/quiz"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C8813A] px-6 py-3 font-body text-sm font-700 text-white transition-colors hover:bg-[#A66A2A]"
      >
        Build My Ritual <ArrowRight size={15} />
      </Link>
    </section>
  );
}
