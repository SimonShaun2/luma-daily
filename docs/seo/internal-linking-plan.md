# Luma Daily — Internal Linking Plan

Internal links do three things for SEO:
1. **Spread link equity** from high-authority pages (Homepage, top blog posts) to commercial pages (PDPs, bundles)
2. **Tell Google what's important** — pages with more inbound internal links rank better
3. **Guide users to conversion** — every educational page should have a clear path to a transactional page within 1 click

Architecture: **hub-and-spoke**. Pillar pages are hubs; supporting articles are spokes; PDPs are conversion endpoints.

---

## 1. Site architecture (3 layers)

### Layer 1 — Conversion endpoints (highest commercial value)
- `/` (Homepage)
- `/quiz` (Find My Ritual)
- `/shop` (Shop All)
- `/shop?tab=bundles` (Bundles)
- `/products/energy` `/products/calm` `/products/sleep` `/products/glow` `/products/gut` (5 PDPs)

### Layer 2 — Authority pages (build topical depth)
- `/blog/daily-wellness-routine` (Pillar 1)
- `/blog/energy-focus-support` (Pillar 2)
- `/blog/calm-stress-balance` (Pillar 3)
- `/blog/sleep-routine` (Pillar 4)
- `/blog/beauty-from-within` (Pillar 5)
- `/blog/gut-wellness` (Pillar 6)
- `/ingredients` (Ingredient deep-dive hub)

### Layer 3 — Supporting content (drives top-of-funnel traffic)
- 48 supporting articles (8 per cluster)
- Comparison posts (vs Olly, vs Lemme, vs Goli, vs Ritual)
- "Best X" roundups

---

## 2. The 3 universal rules

### Rule 1 — Every blog post links to:
- ✅ The cluster pillar page (1 link, top of article, anchor: cluster name)
- ✅ The most-relevant PDP (1–2 links, contextual anchors like "see our ashwagandha gummy")
- ✅ The Find My Ritual quiz (1 link, mid-article CTA)
- ✅ The most-relevant bundle (1 link, after main content, e.g. "the Energy + Calm bundle")
- ✅ 2–3 sibling articles in the same cluster (footer "related reads" block)

**Minimum:** 6 internal links per article. **Target:** 8–12. **Cap:** 15 (more than 15 dilutes equity transfer).

### Rule 2 — Every PDP links to:
- ✅ Related products (3 cards: same cluster + complementary cluster)
- ✅ The bundle that includes this product (1 link, "Better together" section)
- ✅ The educational pillar for this category (1 link, "Why we built this" section)
- ✅ Ingredients page anchor (1 link, "Learn about [key ingredient]")
- ✅ The FAQ (1 link, "Have questions? Read the FAQ")
- ✅ Quiz (sticky CTA — present sitewide)

### Rule 3 — Pillar pages link:
- **Down:** to all 8 supporting articles in their cluster (mandatory)
- **Sideways:** to the other 5 pillar pages (1 mention each, "if you also care about [other cluster]")
- **Out:** to the relevant PDP(s), the most-relevant bundle, the quiz

This makes each pillar a "topic hub" that consolidates equity from spokes and pushes it down to PDPs.

---

## 3. Anchor text strategy

Use varied, natural anchors. Never stuff a single keyword across 20 links — Google's exact-match anchor penalty is real for sites with abnormal anchor distributions.

**Approved anchor patterns:**

| Target | Good anchors | Avoid |
|---|---|---|
| `/products/energy` | "Luma Energy", "our energy gummy", "morning ritual gummy", "Blood Orange Mango energy" | "energy gummies" (overused), "best energy gummy" (manipulative) |
| `/products/sleep` | "Luma Sleep", "our 3mg melatonin gummy", "evening wind-down formula" | "melatonin gummies", "best sleep gummy" |
| `/quiz` | "Find My Ritual quiz", "take the quiz", "build your ritual", "60-second ritual quiz" | "click here", "quiz" |
| `/shop?tab=bundles` | "the Daily Ritual bundle", "our wellness stack", "shop bundles" | "bundles" |
| Pillar pages | "our daily wellness routine guide", "how to build a wellness routine" | exact-match keyword every time |

**Distribution target across 100 internal links to a given page:**
- 30% branded anchors ("Luma Energy", "Luma Sleep")
- 30% natural-language descriptive ("our morning energy gummy")
- 20% keyword-adjacent ("energy gummies", "wellness routine")
- 10% generic action ("learn more", "take the quiz")
- 10% surrounding-context (no anchor — just URL or button)

---

## 4. Cross-cluster linking

Every cluster has natural overlaps with others. Use these to build a tightly-woven web rather than 6 isolated silos.

### Energy ↔ Calm
- Energy crash → Calm gummies (afternoon stress contributes to crash)
- Anchor: "Pair with [Luma Calm](/products/calm) for a more sustainable afternoon"

### Energy ↔ Sleep
- Better sleep = sustained next-day energy
- Anchor: "Better mornings start the night before — see [Luma Sleep](/products/sleep)"

### Calm ↔ Sleep
- Stress is the #1 sleep disruptor
- Anchor: "If stress is keeping you up, try the [Calm + Sleep bundle](/shop/sleep-glow)"

### Glow ↔ Gut
- Skin is downstream of gut health
- Anchor: "Beauty starts in the gut — see [Luma Gut](/products/gut)"

### Glow ↔ Sleep
- Restorative sleep is when collagen synthesis peaks
- Anchor: "Most collagen rebuild happens at night — see our [sleep formula](/products/sleep)"

### Gut ↔ Calm
- Gut-brain axis: 90% of serotonin is produced in the gut
- Anchor: "The gut-brain connection: see [Luma Calm](/products/calm)"

---

## 5. Concrete link map by page

### Homepage (`/`)
**Internal links out (target 30+):**
- Nav: Shop, Bundles, Quiz, Ingredients, About, FAQ, Blog
- Hero CTAs: `/quiz` ("Build My Ritual"), `/shop` ("Shop Formulas")
- Product carousel: 6 PDPs
- Bundle preview: 3 featured bundles
- "How it works" section: → quiz, → blog/daily-wellness-routine
- Testimonials: links to relevant PDPs as social proof
- Footer: every PDP, every bundle, blog index, About, Contact, FAQ, Legal

**Internal links in:** every page on the site (via header logo + footer)

### Find My Ritual quiz (`/quiz`)
**Internal links out:**
- Results page → recommended PDPs (variable, 2–4 based on quiz answers)
- Results page → recommended bundle
- Results page → blog/daily-wellness-routine ("Read more about your ritual")
- Header → home, shop, etc.

**Internal links in:**
- Sitewide sticky CTA on every page
- Every blog article (mid-article)
- Every PDP (sidebar / mid-page)
- Homepage hero
- Bundle pages

### Shop All (`/shop`)
**Internal links out:**
- All 5 PDPs (cards)
- All bundles (tab)
- Filter pills → category-specific results
- "Not sure where to start?" → quiz
- Each card → corresponding ingredient page anchor

**Internal links in:**
- Nav (every page)
- Footer (every page)
- Homepage product carousel
- All "best X" blog roundups
- Some PDP "related products" sections

### Bundles (`/shop?tab=bundles`)
**Internal links out:**
- Each bundle → component PDPs
- "Build your own" → quiz
- "Why bundle?" → blog/how-to-build-a-supplement-stack

**Internal links in:**
- Nav, footer
- Homepage bundle preview
- Every PDP "Better together" section
- Pillar pages (1–2 contextual mentions)

### PDPs (5 product pages)
Same internal link discipline applies to each. Example for `/products/energy`:

**Internal links out:**
- Related products: Luma Calm (afternoon), Luma Sleep (evening), Luma Focus (midday) — 3 cards
- Bundle: "Energy + Calm bundle" → `/shop/energy-calm`
- Pillar: "Read our daily wellness routine guide" → `/blog/daily-wellness-routine`
- Sub-pillar: "Energy + Focus Support" → `/blog/energy-focus-support`
- Ingredients: "How L-Theanine works" → `/ingredients#l-theanine`
- Quiz: sticky CTA + mid-page CTA
- Reviews: optional internal anchor → `/reviews/energy`
- FAQ: "Common questions" → `/faq#energy` (or section-specific)

**Internal links in:**
- Nav, footer
- Homepage product carousel
- Shop All
- All Energy-cluster blog posts (2+ links each)
- Pillar 1 (Daily Wellness Routine) — 2 mentions
- Pillar 2 (Energy + Focus Support) — 4+ mentions
- Comparison posts (vs Olly, etc.)
- Bundle pages that include Energy

### Pillar pages (6)
Example for Pillar 2 (`/blog/energy-focus-support`):

**Internal links out (target 25+):**
- All 8 spokes in the Energy cluster
- The other 5 pillar pages (1 mention each, in "complete your routine" section)
- Luma Energy PDP (3+ contextual mentions throughout body)
- Luma Focus PDP (where applicable)
- Performance Bundle → `/shop/performance`
- Quiz (mid-article + end)
- Ingredients deep-dives: `/ingredients#ginseng`, `/ingredients#b12`, `/ingredients#l-theanine`

**Internal links in:**
- Every Energy-cluster spoke (1 mandatory link to pillar)
- Energy PDP (1 link, "Why we built this")
- Homepage "How it works" section
- Footer "Wellness Guides" section
- Blog index

### Supporting article example (`/blog/energy-gummies-vs-caffeine`)

**Internal links out (target 8–12):**
1. Pillar 2: "Energy + Focus Support" (top of article, anchor: "energy + focus support guide")
2. PDP Luma Energy (2 contextual mentions)
3. Quiz (mid-article CTA)
4. Bundle: Energy + Calm (after main content)
5. Sibling: "Best Time of Day to Take Wellness Gummies" (related reads)
6. Sibling: "How Long for Supplements to Work" (related reads)
7. Sibling: "Morning Wellness Routine" (related reads)
8. Ingredients: `/ingredients#l-theanine`

**Internal links in:**
- Pillar 2 (mandatory link from spoke list)
- 2–3 sibling articles
- Comparison posts touching caffeine
- Energy PDP "Read more" section

---

## 6. Header and footer links (sitewide)

### Primary nav (5 links, follow mobile-first hierarchy)
1. Shop (dropdown: Energy, Calm, Sleep, Glow, Gut, Bundles, Shop All)
2. Quiz (Find My Ritual)
3. Ingredients
4. About
5. Blog

Cart icon + Sign In as utility links.

### Footer (4 columns)

**Column 1 — Shop**
- Energy, Calm, Sleep, Glow, Gut, Bundles, Shop All

**Column 2 — Learn**
- Daily Wellness Routine (pillar 1)
- Find My Ritual (quiz)
- Ingredients
- FAQ
- Blog

**Column 3 — Company**
- About
- Sustainability
- Press
- Contact
- Affiliate Program

**Column 4 — Support**
- Shipping & Returns
- Subscriptions
- Account
- Privacy
- Terms

This gives every PDP a permanent footer link from every page on the site (~30 sitewide footer links), pumping equity to commercial pages.

---

## 7. Schema-level signal: BreadcrumbList

Every page below the homepage should have `BreadcrumbList` schema. This tells Google the parent → child hierarchy and gives breadcrumbs in SERPs.

Example for `/blog/morning-wellness-routine`:
```
Home > Blog > Daily Wellness Routine > Morning Wellness Routine
```

Example for `/products/energy`:
```
Home > Shop > Energy > Luma Energy
```

This reinforces the cluster/pillar architecture in machine-readable form.

---

## 8. Audit + maintenance

**Weekly:**
- New articles audited for the 6+ link minimum before publish
- Broken-link check via Screaming Frog or Ahrefs Site Audit

**Monthly:**
- Orphan-page report — every URL must have ≥ 1 internal link in
- "Most-linked pages" report — verify our priority PDPs are in top 10

**Quarterly:**
- Anchor-text distribution audit per priority page
- Internal PageRank distribution (Sitebulb / Ahrefs internal linking score)
- Refresh top-10 internal links to top-converting PDPs based on assisted-conversion data in GA4

---

## 9. Anti-patterns to avoid

- **One-and-done linking.** A blog post with only 1–2 internal links wastes equity. Always 6+.
- **Footer-only equity transfer.** Footer links count less than in-content links. PDPs need contextual mentions in body copy of articles.
- **Exact-match anchor stuffing.** Every link to `/products/sleep` saying "sleep gummies" looks spammy. Vary anchors.
- **Linking everything to homepage.** Homepage doesn't need more equity. Push down to PDPs and pillar pages.
- **Sidebar widgets with 50 links.** Diluted equity. Pick 3–5 most relevant.
- **Forgetting bundles.** Bundles convert at 2–3× the rate of single PDPs. Every relevant context should mention the bundle option.
- **Not linking to quiz from articles.** Quiz is the #1 conversion engine. Every article must include 1 quiz CTA mid-flow.

---

## Files referenced

- [seo-strategy.md](seo-strategy.md) — strategy framework
- [keyword-map.md](keyword-map.md) — what each page should target
- [search-intent-map.md](search-intent-map.md) — intent → page mapping
- [90-day-roadmap.md](90-day-roadmap.md) — execution sequencing
- [blog/internal-linking-map.md](blog/internal-linking-map.md) — blog-specific link map (Batch 3)
