# Luma Daily — 90-Day SEO Roadmap

Week-by-week execution plan to take takelumadaily.com from launch to 5K organic sessions/month and top-3 rankings on 12 priority keywords.

---

## Week 0 — Pre-launch checklist (do before publishing anything)

- [ ] Confirm `takelumadaily.com` resolves and serves SSL
- [ ] Install Google Search Console + verify domain (DNS TXT method)
- [ ] Install GA4, link to GSC
- [ ] Generate + submit `sitemap.xml` (`/sitemap.xml`) to GSC
- [ ] Add `robots.txt` with sitemap reference, disallow `/account`, `/checkout`, `/signin`
- [ ] Set up rank tracking (Ahrefs, Semrush, or SerpRobot) for 50 keywords from [keyword-map.md](keyword-map.md)
- [ ] Set up brand monitoring (Google Alerts: "luma daily", "take luma daily")
- [ ] Create master spreadsheet for AI Overview tracking (manually sample 25 priority queries weekly)

---

## Days 1–7 — On-page foundation (Sprint 1)

**Goal:** Every priority page has correct title, meta, H1, and minimum schema.

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| 1 | Implement SEO titles + meta on Homepage, Shop, Quiz | Dev | live in prod |
| 2 | Implement on 5 PDPs (Energy, Calm, Sleep, Glow, Gut) | Dev | live |
| 3 | Add `Product` schema to all 5 PDPs (price, brand, image, rating placeholder, availability) | Dev | live, validates in [Schema Markup Validator](https://validator.schema.org) |
| 4 | Add `Organization` schema sitewide via `theme.liquid`/`index.html` | Dev | live |
| 5 | Add `BreadcrumbList` schema on PDPs + collection | Dev | live |
| 6 | Implement on Bundles, FAQ, About, Ingredients, Legal pages | Dev | live |
| 7 | GSC inspection: request indexing for all 13 priority pages | SEO | indexed within 48h |

**Acceptance:** Each page shows correct title in GSC's URL inspection, schema validates, page loads ≤ 2.5s LCP.

**Source documents:** [page-title-map.md](page-title-map.md), [meta-description-library.md](meta-description-library.md)

---

## Days 8–14 — Content infrastructure (Sprint 2)

**Goal:** Blog system live, first 6 pillar pages published, image + alt-text discipline established.

| Day | Task | Deliverable |
|---|---|---|
| 8 | Stand up `/blog` index page with category nav (6 clusters) | live |
| 9 | Publish pillar 1: Daily Wellness Routine (`/blog/daily-wellness-routine`) | 2,500+ words, schema, internal links |
| 10 | Publish pillar 2: Energy + Focus Support | as above |
| 11 | Publish pillar 3: Calm + Stress Balance | as above |
| 12 | Publish pillar 4: Sleep Routine | as above |
| 13 | Publish pillar 5: Beauty From Within | as above |
| 14 | Publish pillar 6: Gut Wellness | as above |

**Each pillar page must include:**
- 60-word "AI Overview slot" intro
- Comprehensive H2 sections (8–12)
- 1 product CTA per relevant SKU
- Quiz CTA (mid-article + end)
- 5+ outbound expert citations (clinical studies, established health publishers)
- `Article` + `FAQPage` schema
- 3–5 expert quotes (real or sourced)
- Featured image + 4–6 supporting images, all with descriptive alt text

**Source:** [blog/pillar-page-outlines.md](blog/pillar-page-outlines.md), [blog/content-clusters.md](blog/content-clusters.md)

---

## Days 15–21 — Supporting articles wave 1 (Sprint 3)

**Goal:** First 6 supporting articles live, internal linking complete, Google Discover-eligible.

Articles to publish (one per day):
- Day 15: How to Build a Daily Wellness Routine That Actually Sticks
- Day 16: Morning Wellness Routine: How to Start Your Day With Energy
- Day 17: What Is a Supplement Routine?
- Day 18: Energy Gummies vs Caffeine: What's the Difference?
- Day 19: How to Build a Nighttime Wellness Routine
- Day 20: Magnesium vs Melatonin: What Should You Know?
- Day 21: Internal-linking pass — every new article links up to its pillar, sideways to 2–3 sibling articles, and out to relevant PDP + quiz

**Each article must include:**
- 1,200–1,800 words
- 60-word answer paragraph
- 3–5 H2s, 2–4 H3s per H2
- FAQ section (3–5 Q&As) with `FAQPage` schema
- 1 product CTA inline + 1 at end
- Quiz CTA mid-article
- Featured image + 2–3 inline images
- Author byline ("By the Luma Wellness Team" or named editor)

---

## Days 22–28 — Supporting articles wave 2 + technical SEO (Sprint 4)

**Goal:** Days 7–12 of priority article list live, Core Web Vitals all green.

Articles:
- Day 22: Beauty From Within: Skin, Hair + Nails Support
- Day 23: Prebiotic vs Probiotic: What's the Difference?
- Day 24: How to Stay Consistent With Supplements
- Day 25: The Best Time of Day to Take Wellness Gummies
- Day 26: How to Build a Simple Wellness Stack
- Day 27: Five Gummies, One Daily Ritual

**Day 28 — Technical SEO audit + fix:**
- LCP ≤ 2.5s on mobile (compress hero images, defer non-critical JS)
- CLS ≤ 0.1 (reserve image dimensions, font-display: swap)
- INP ≤ 200ms (audit framer-motion impact on input handlers)
- Mobile-friendly check (GSC Mobile Usability)
- Internal linking audit: zero orphan pages

---

## Days 29–30 — Off-page wave 1

**Goal:** First 10 quality backlinks initiated.

| Tactic | Target | Volume | Notes |
|---|---|---|---|
| Wellness publisher outreach | mindbodygreen, Well+Good, The Cut, Byrdie | 4 pitches | offer expert quote on "the ritual gummy trend" |
| Podcast pitch | Wellness Mama, The Skinny Confidential, Almost 30 | 3 pitches | founder interview |
| HARO / Qwoted | "wellness rituals," "supplement routines" | 5 responses/wk | low effort, mid-yield |
| Reddit AMA | r/Supplements with founder | 1 | builds Reddit citations (LLM food) |
| ProductHunt launch | full launch with quiz CTA | 1 | drives backlinks + brand-search lift |

**KPI:** 10 referring domains acquired, 3 in DR 60+ publications.

---

## Days 31–60 — Content engine ignition

### Weekly cadence (8 weeks)

- **2 articles/week** published (16 articles in this period)
- **1 comparison post/month** (vs Olly, vs Lemme, vs Goli — 1 per month)
- **1 ingredient deep-dive/week** mapped to /ingredients anchor sections

### Articles to publish (days 31–60, weeks 5–8)

Week 5 (days 31–37):
- Magnesium for Sleep + Relaxation (Sleep cluster)
- The Stress + Sleep Connection (Calm + Sleep)
- Luma Daily vs Olly: Honest Comparison (Comparison)

Week 6 (days 38–44):
- Why Daily Routine Beats "Stack of the Month" (Routine pillar)
- How Long Does It Take Ashwagandha to Work? (Calm)
- Ingredient Deep-Dive: L-Theanine (Calm)

Week 7 (days 45–51):
- How to Read a Supplement Label (Routine)
- Probiotic Gummies for Bloating: What to Know (Gut)
- Luma Daily vs Lemme: Which Is Right for You? (Comparison)

Week 8 (days 52–60):
- Sleep Hygiene Beyond Supplements (Sleep)
- Beauty From Within: A 30-Day Reset (Glow)
- Ingredient Deep-Dive: Marine Collagen (Glow)
- 60-day GSC + GA4 review: identify top 5 articles, refresh underperformers

### Off-page wave 2 (days 31–60)

- 5 more guest posts placed
- 10 more HARO responses → 3 placed citations
- Press release: "Luma Daily launches Find My Ritual quiz" → 5 niche outlets
- Influencer seeding: 25 micro-influencers (10K–50K) sent product, ungated CTA codes
- Build Trustpilot + GoodHousekeeping presence (review-aggregator citations)

---

## Days 61–90 — Scale + iterate

### Content cadence

- **3 articles/week** (12 articles in this period)
- Refresh top 5 organic pages based on day-60 GSC data
- Roll out video content: 5 short YouTube videos (under-2-min ingredient explainers — Lion's Mane, Ashwagandha, etc.) — supports Google universal search + becomes embed-bait

### Articles to publish (days 61–90)

This period focuses on long-tail commercial + comparison content with the goal of converting organic traffic. Final 18 articles to complete the 30-piece corpus:

| Theme | Articles |
|---|---|
| Routine | The 5-Minute Wellness Routine; How to Pick a Multi vs a Stack; Wellness Routine for Busy Women |
| Energy | Best Energy Gummies for Adults (roundup); Caffeine-Free Energy Sources Ranked; Why Afternoon Energy Crashes Happen |
| Calm | Ashwagandha vs L-Theanine: When to Use Which; Stress + the Cortisol Connection; Calm Gummies for Anxiety-Adjacent Days* |
| Sleep | Best Sleep Gummies for Adults (roundup); Low-Dose Melatonin: Why Less Is More; The Ideal Bedtime Wind-Down |
| Glow | Best Collagen Gummies for Skin (roundup); Collagen vs Biotin: Which Should You Take?; Hyaluronic Acid Inside-Out |
| Gut | Best Probiotic Gummies for Adults (roundup); Prebiotic + Probiotic Together: A Daily Strategy; Bloating: A Daily Routine That Helps |
| Brand | Luma Daily vs Goli; Luma Daily vs Ritual; Year-One Customer Stories |

*Use compliance-safe framing — "stress-adjacent" not "anxiety," "wakefulness" not "insomnia."

### Off-page wave 3 (days 61–90)

- Launch affiliate program (10–15% commission, target wellness/lifestyle bloggers)
- Pitch year-end gift guides (Vogue, Glamour, Real Simple, Apartment Therapy) for Q4
- 1 large feature pitch (NYT Wellness, Bon Appetit) — "the new minimalist supplement routine" angle
- Establish founder voice on LinkedIn + 2 long-form Substack guest pieces

### KPI checkpoint (day 90)

| KPI | Target | Measure |
|---|---|---|
| Organic sessions/month | 5,000 | GA4 |
| Top-3 rankings on priority kws | 12 | rank tracker |
| Indexed pages | 60+ | GSC coverage |
| Referring domains | 75+ | Ahrefs/Semrush |
| Branded search volume | +200% vs day 0 | GSC |
| AI Overview citations (sampled queries) | 20% of 25 queries | manual sampling |
| Organic-attributed revenue | $25K/mo run-rate | GA4 + Shopify |
| Quiz completions from organic | 1,500/mo | GA4 events |

---

## Standing operating rhythm (post-day-90)

**Weekly:**
- Publish 2 new articles
- Refresh 1 underperforming article (target page 2 → page 1)
- Send 5 HARO responses
- Post 1 founder LinkedIn essay

**Monthly:**
- 1 comparison post
- 1 large guest post placement
- GSC keyword-position audit + refresh top 5 pages
- AI Overview sampling across 50 priority queries

**Quarterly:**
- Full technical SEO audit (Screaming Frog crawl)
- Backlink audit + disavow toxic links
- Competitor gap analysis (Ahrefs Content Gap)
- Roadmap re-plan for next 90 days

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Google algorithm update tanks rankings | medium | high | diversify traffic (email, paid, social); avoid keyword-stuffing; build entity, not keyword density |
| Competitor copies content angle | high | low | be first, be deeper; build brand entity Google trusts more |
| FDA / FTC compliance issue from copy | low | extreme | strict adherence to structure/function language; legal review of all blog content quarterly |
| Vercel or Shopify outage tanks SEO | low | medium | uptime monitoring (UptimeRobot); 99.9% SLA |
| Content team capacity bottleneck | high | medium | retain 2 freelance wellness writers from day 1, with brand voice doc |

---

## Files referenced

- [seo-strategy.md](seo-strategy.md) — overall strategy
- [keyword-map.md](keyword-map.md) — keyword universe
- [search-intent-map.md](search-intent-map.md) — intent-to-page mapping
- [internal-linking-plan.md](internal-linking-plan.md) — link architecture
- [page-title-map.md](page-title-map.md) — titles + metas (Batch 2)
- [blog/content-clusters.md](blog/content-clusters.md) — cluster definitions (Batch 3)
- [blog/90-day-editorial-calendar.md](blog/90-day-editorial-calendar.md) — daily publish schedule (Batch 3)
