/*
 * LUMA DAILY — About Us Page
 * Design: Warm Editorial — brand story, mission, values, team
 * Route: /about
 */

import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Check, Leaf, Shield, Award, Heart } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1 } }),
};

const team = [
  {
    name: "Dr. Maya Chen",
    role: "Co-Founder & Chief Science Officer",
    bio: "Former research scientist at UCSF with 12 years in nutritional biochemistry. Maya formulates every Luma product and oversees our clinical research partnerships.",
    initials: "MC",
    color: "#EEF5EF",
    textColor: "#2D5A32",
  },
  {
    name: "Jordan Park",
    role: "Co-Founder & CEO",
    bio: "Previously built and scaled two wellness startups. Jordan's mission is to make evidence-based supplementation accessible, honest, and something people actually enjoy.",
    initials: "JP",
    color: "#FEF9E7",
    textColor: "#7A5C00",
  },
  {
    name: "Priya Nair",
    role: "Head of Product",
    bio: "10 years in CPG product development at brands including Ritual and Seed. Priya leads our formula development process from concept to shelf.",
    initials: "PN",
    color: "#F3F0FA",
    textColor: "#3D2B7A",
  },
  {
    name: "Marcus Webb",
    role: "Head of Sustainability",
    bio: "Environmental scientist turned brand builder. Marcus oversees our supply chain ethics, packaging sustainability, and B Corp certification journey.",
    initials: "MW",
    color: "#EFF6EC",
    textColor: "#2A5C1A",
  },
];

const values = [
  {
    icon: <Shield size={22} />,
    title: "Radical Transparency",
    desc: "We list every ingredient, every dose, and every reason it's in the formula. No proprietary blends, no hidden fillers, no fine print.",
  },
  {
    icon: <Leaf size={22} />,
    title: "Clean by Design",
    desc: "Vegan, gluten-free, non-GMO, and free from artificial colors, flavors, and sweeteners. Clean isn't a marketing claim — it's our baseline.",
  },
  {
    icon: <Award size={22} />,
    title: "Science-Backed",
    desc: "Every formula is built on peer-reviewed research. We work with independent researchers and test every batch at ISO-certified labs.",
  },
  {
    icon: <Heart size={22} />,
    title: "Ritual Over Routine",
    desc: "We believe wellness should feel like something you want to do, not something you have to do. That's why taste, texture, and experience matter as much as efficacy.",
  },
];

const milestones = [
  { year: "2021", event: "Luma Daily founded in San Francisco by Dr. Maya Chen and Jordan Park" },
  { year: "2022", event: "Launched first three formulas: Energy, Calm, and Sleep" },
  { year: "2023", event: "Reached 10,000 subscribers. Added Focus and Glow to the lineup" },
  { year: "2024", event: "Launched Gut formula. Achieved 50,000 active subscribers" },
  { year: "2025", event: "Expanded to Canada and the UK. Began B Corp certification process" },
  { year: "2026", event: "50,000+ daily rituals kept. Continuing to grow the Luma family" },
];

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#1E1B16]/8">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#C8813A] flex items-center justify-center">
                <span className="text-white font-display font-700 text-xs">L</span>
              </div>
              <span className="font-display font-700 text-lg text-[#1E1B16]">Luma Daily</span>
            </button>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/shop")} className="font-body text-sm text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors">Shop</button>
              <button onClick={() => navigate("/quiz")} className="btn-amber py-2 px-5 text-xs">Find My Ritual</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#1A1510] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/manus-storage/luma_daily_packaging_master_v2_fe19e1c8.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-[#C8813A]/20 text-[#C8813A] text-xs font-body font-600 tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              Our Story
            </div>
            <h1 className="font-display font-800 text-5xl lg:text-6xl text-[#FAF7F2] leading-[1.05] mb-6">
              Wellness that{" "}
              <em className="italic text-[#C8813A]">actually works.</em>
            </h1>
            <p className="font-body text-lg text-[#FAF7F2]/60 leading-relaxed">
              Luma Daily was built on a simple belief: supplements should be honest, effective, and something you genuinely look forward to taking. We started in 2021 with three formulas and a conviction that the wellness industry could do better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-[#1E1B16]/15" />
                <span className="font-body text-xs font-600 tracking-[0.15em] uppercase text-[#1E1B16]/50">Our Mission</span>
                <div className="h-px flex-1 bg-[#1E1B16]/15" />
              </div>
              <h2 className="font-display font-700 text-4xl lg:text-5xl text-[#1E1B16] leading-tight mb-6">
                Make wellness feel like{" "}
                <em className="italic text-[#C8813A]">a ritual, not a chore.</em>
              </h2>
              <p className="font-body text-base text-[#1E1B16]/60 leading-relaxed mb-6">
                The supplement industry is full of overcomplicated labels, underdosed formulas, and marketing that outpaces the science. We set out to fix that — starting with the ingredients.
              </p>
              <p className="font-body text-base text-[#1E1B16]/60 leading-relaxed mb-8">
                Every Luma formula is built around a specific wellness need, with ingredients chosen for efficacy and dosed at clinically relevant levels. We publish every dose. We explain every ingredient. We test every batch.
              </p>
              <div className="space-y-3">
                {[
                  "Founded by a research scientist and a serial wellness entrepreneur",
                  "Every formula reviewed by our Scientific Advisory Board",
                  "All products manufactured in FDA-registered, GMP-certified facilities",
                  "Certificates of Analysis published for every production batch",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#C8813A]/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} className="text-[#C8813A]" />
                    </div>
                    <span className="font-body text-sm text-[#1E1B16]/65">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden">
                <img
                  src="/manus-storage/luma_daily_packaging_master_v2_fe19e1c8.png"
                  alt="Luma Daily product lineup"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#C8813A] text-white rounded-2xl p-5 shadow-xl">
                <div className="font-display font-700 text-3xl">50K+</div>
                <div className="font-body text-xs mt-0.5 opacity-80">Daily rituals kept</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#F5EDD8]/40">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="h-px w-16 bg-[#1E1B16]/15" />
              <span className="font-body text-xs font-600 tracking-[0.15em] uppercase text-[#1E1B16]/50">What We Stand For</span>
              <div className="h-px w-16 bg-[#1E1B16]/15" />
            </div>
            <h2 className="font-display font-700 text-4xl text-[#1E1B16]">Our values</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.1}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C8813A]/10 flex items-center justify-center text-[#C8813A] mb-4">
                  {value.icon}
                </div>
                <h3 className="font-display font-700 text-lg text-[#1E1B16] mb-2">{value.title}</h3>
                <p className="font-body text-sm text-[#1E1B16]/60 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="h-px w-16 bg-[#1E1B16]/15" />
              <span className="font-body text-xs font-600 tracking-[0.15em] uppercase text-[#1E1B16]/50">Our Journey</span>
              <div className="h-px w-16 bg-[#1E1B16]/15" />
            </div>
            <h2 className="font-display font-700 text-4xl text-[#1E1B16]">How we got here</h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.1}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#C8813A] flex items-center justify-center shrink-0">
                    <span className="font-body text-white text-[10px] font-700">{m.year}</span>
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-[#C8813A]/20 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="font-body text-base text-[#1E1B16]/70 leading-relaxed">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#1A1510]">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="h-px w-16 bg-[#FAF7F2]/15" />
              <span className="font-body text-xs font-600 tracking-[0.15em] uppercase text-[#FAF7F2]/40">The People</span>
              <div className="h-px w-16 bg-[#FAF7F2]/15" />
            </div>
            <h2 className="font-display font-700 text-4xl text-[#FAF7F2]">Meet the team</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.1}
                className="bg-[#FAF7F2]/5 rounded-2xl p-6 border border-[#FAF7F2]/10"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-display font-700 text-xl mb-4"
                  style={{ backgroundColor: member.color, color: member.textColor }}
                >
                  {member.initials}
                </div>
                <h3 className="font-display font-700 text-lg text-[#FAF7F2] mb-0.5">{member.name}</h3>
                <p className="font-body text-xs text-[#C8813A] font-500 mb-3">{member.role}</p>
                <p className="font-body text-sm text-[#FAF7F2]/50 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C8813A]">
        <div className="container text-center">
          <h2 className="font-display font-700 text-3xl text-white mb-3">
            Ready to start your ritual?
          </h2>
          <p className="font-body text-base text-white/75 mb-6 max-w-md mx-auto">
            Take our 60-second quiz and we'll recommend the perfect formula for your wellness goals.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/quiz")}
              className="bg-white text-[#C8813A] font-body font-600 text-sm tracking-wider uppercase px-8 py-3.5 rounded-full hover:bg-[#FAF7F2] transition-colors"
            >
              Take the Ritual Quiz
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="border border-white/40 text-white font-body text-sm px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Shop All Products <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
