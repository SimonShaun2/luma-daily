# Luma Daily — Page Title + H1 Map

Every page has one canonical SEO title (≤60 chars to avoid SERP truncation) and one H1 (the on-page headline). They can differ — the SEO title is for Google, the H1 is for humans.

**Format:**
- Page URL
- SEO title (chars)
- H1
- H2 structure (page outline)
- Notes

---

## Homepage — `/`

**SEO title (58 chars):**
> Luma Daily | Daily Wellness Gummies for Energy, Calm, Sleep

> *(Note: client brief showed full version "Luma Daily | Daily Wellness Gummies for Energy, Calm, Sleep, Glow + Gut" — 73 chars, will truncate. Use the trimmed version above; keep the full string in `<title>` if you accept truncation in the rendered SERP.)*

**H1:**
> Daily gummies for energy, calm, sleep, glow, and gut support.

**H2 structure:**
- The morning to night ritual, designed in five formulas
- Find the right ritual for you *(quiz CTA)*
- Built around clean ingredients, not flashy claims *(ingredients section)*
- The complete daily ritual, bundled and ready *(bundles section)*
- Real customers. Real rituals. *(testimonials section)*
- Subscribe and save 20% on every order *(subscribe section)*
- Questions, answered *(FAQ snippet section)*

**Notes:**
- Hero CTA: "Build My Ritual" → `/quiz`
- Secondary CTA: "Shop Formulas" → `/shop`
- Above-fold must include H1 + 1 sentence subhead + both CTAs

---

## Shop All — `/shop`

**SEO title (54 chars):**
> Shop All Wellness Gummies | Luma Daily

**H1:**
> All five formulas. One daily ritual.

**H2 structure:**
- Individual formulas
- Wellness bundles + sets
- Filter by goal *(Energy / Calm / Sleep / Beauty / Gut)*
- Subscribe and save 20% on every order
- Not sure where to start? Take the Find My Ritual quiz

**Notes:**
- Tab switcher: Individual Formulas | Bundles & Sets
- Filter pills below tab: All / Energy / Sleep / Stress / Focus / Beauty / Gut
- Each product card: name, tagline, flavor, price, subscribe price, "Add to Cart"

---

## Find My Ritual Quiz — `/quiz`

**SEO title (50 chars):**
> Find My Ritual: Your Daily Wellness Quiz

**H1 (varies by step — main intro H1):**
> Build the ritual that fits the way you actually live.

**H2 structure (per step):**
- Step 1: What's your biggest wellness goal right now?
- Step 2: When during the day do you take supplements?
- Step 3: Any other areas you'd love support?
- Step 4: How would you describe your wellness routine?
- Results: Your personalized daily ritual
- Save your ritual recommendations *(email capture)*
- Subscribe to my daily ritual *(CTA)*

**Notes:**
- Page should have a 60-word "what is the quiz" paragraph above the quiz interface for SEO + AI Overview eligibility
- Schema: `Quiz` is not standard — use `WebApplication` or `HowTo` instead, with steps

---

## Bundles — `/shop?tab=bundles` (or `/bundles` if separate URL)

**SEO title (52 chars):**
> Wellness Gummy Bundles | Luma Daily Stacks

**H1:**
> Build your stack. Save more. Stay consistent.

**H2 structure:**
- Featured bundles
- Build your own ritual *(quiz CTA)*
- Why bundle? *(supplement stack education)*
- Subscribe + save 20% on every order
- All available bundles *(grid)*
- Not sure which bundle? Take the quiz

**Notes:**
- Featured: Daily Ritual (all 6), Energy + Calm, Sleep + Glow
- Each bundle card: name, products included, price, "Add Bundle to Cart"

---

## Product: Luma Energy — `/products/energy`

**SEO title (60 chars):**
> Luma Energy Gummies | Clean Energy + Focus Support

**H1:**
> Luma Energy

**Subhead:**
> Power your day without the crash.

**H2 structure:**
- Ingredients & doses
- How to use
- Why we built this *(brand story tie-in)*
- Quality + certifications
- Real customers, real rituals *(reviews)*
- Pair it with *(related products + bundle)*
- Frequently asked questions
- Shipping + returns

**Notes:**
- Subscribe toggle prominent above price
- Default = Subscribe & Save 20%
- Quantity selector + Add to Cart on right column desktop, sticky bottom on mobile
- Schema: `Product`, `Offer`, `AggregateRating`, `Review` (when reviews live)

---

## Product: Luma Calm — `/products/calm`

**SEO title (57 chars):**
> Luma Calm Gummies | Ashwagandha + L-Theanine Support

**H1:**
> Luma Calm

**Subhead:**
> Quiet the noise. Find your center.

**H2 structure:** *(same as Energy template)*
- Ingredients & doses
- How to use
- Why we built this
- Quality + certifications
- Real customers, real rituals
- Pair it with *(related products + bundle)*
- Frequently asked questions
- Shipping + returns

---

## Product: Luma Sleep — `/products/sleep`

**SEO title (58 chars):**
> Luma Sleep Gummies | Low-Dose Melatonin + Chamomile

**H1:**
> Luma Sleep

**Subhead:**
> Sleep deeper. Wake better.

**H2 structure:** *(same template)*
- Ingredients & doses
- How to use
- Why we built this
- Quality + certifications
- Real customers, real rituals
- Pair it with
- Frequently asked questions
- Shipping + returns

---

## Product: Luma Glow — `/products/glow`

**SEO title (58 chars):**
> Luma Glow Gummies | Marine Collagen + Biotin Support

**H1:**
> Luma Glow

**Subhead:**
> Radiance from the inside out.

**H2 structure:** *(same template)*

---

## Product: Luma Gut — `/products/gut`

**SEO title (60 chars):**
> Luma Gut Gummies | Probiotic + Prebiotic Daily Support

**H1:**
> Luma Gut

**Subhead:**
> Gut health is whole health.

**H2 structure:** *(same template)*

---

## FAQ — `/faq`

**SEO title (45 chars):**
> Luma Daily FAQ | Wellness Gummy Questions

**H1:**
> Questions, answered.

**H2 structure (group questions by theme):**
- About Luma Daily
- Ingredients + safety
- How to take
- Subscriptions
- Shipping + returns
- Account + billing

**Notes:**
- Use `FAQPage` schema with each Q&A as a `Question` / `Answer` pair
- Eligible for FAQ rich results in SERPs and high-value AI Overview pickup
- Each answer: 60–100 words, natural language, no keyword-stuffing

---

## About — `/about`

**SEO title (50 chars):**
> About Luma Daily | Premium Wellness Gummies

**H1:**
> The daily ritual, redesigned.

**H2 structure:**
- Why we built Luma Daily *(founding story)*
- Our standards *(third-party tested, vegan, sugar-thoughtful)*
- The five-formula system
- Sourcing + manufacturing
- The team
- Sustainability
- Get in touch *(contact CTA)*

**Notes:**
- Add `Organization` and `Person` (founder) schema
- About pages are E-E-A-T signals — Google rewards specifics (founder name, location, year founded, certifications)

---

## Ingredients — `/ingredients`

**SEO title (52 chars):**
> Ingredients | Every Dose, Every Detail | Luma Daily

**H1:**
> Every ingredient. Every dose. Nothing hidden.

**H2 structure:**
- Why ingredient transparency matters
- Ingredient index *(jump links to anchors below)*
- Ashwagandha KSM-66
- L-Theanine
- Melatonin
- Chamomile
- Magnesium glycinate
- Marine collagen peptides
- Biotin
- Hyaluronic acid
- Probiotics (10B CFU)
- Inulin prebiotic
- Ginseng root
- Vitamin B12
- Lion's Mane
- *(continue for full ingredient list)*

**Notes:**
- Each ingredient gets its own anchor (`#ashwagandha`, `#l-theanine`, etc.) for deep-linking from blog posts
- Each section: 100–200 words, what it is, what it supports, dose used, where it appears in our products
- Anchor links from PDPs and blog posts feed targeted equity to this page

---

## Blog index — `/blog`

**SEO title (52 chars):**
> Wellness Guides + Rituals | The Luma Daily Blog

**H1:**
> The Luma Daily Wellness Guides

**H2 structure:**
- Featured *(latest pillar / hero article)*
- Daily Wellness Routine *(cluster section)*
- Energy + Focus Support
- Calm + Stress Balance
- Sleep Routine
- Beauty From Within
- Gut Wellness
- All articles *(chronological grid)*

**Notes:**
- Each cluster section displays the pillar + 3 most recent spokes
- Filter pills above grid: All / Routine / Energy / Calm / Sleep / Glow / Gut

---

## Blog pillar example — `/blog/daily-wellness-routine`

**SEO title (59 chars):**
> Daily Wellness Routine: A Complete Guide | Luma Daily

**H1:**
> The complete guide to a daily wellness routine.

**H2 structure:**
- What is a daily wellness routine?
- Why most routines fail
- The five-formula framework
- Morning ritual: energy + focus
- Midday ritual: calm + steady
- Evening ritual: wind down + restore
- Beauty + gut: the always-on layer
- How to make it stick *(consistency tactics)*
- Frequently asked questions
- Build your ritual *(quiz CTA + bundle)*

---

## Blog supporting article example — `/blog/energy-gummies-vs-caffeine`

**SEO title (54 chars):**
> Energy Gummies vs Caffeine: What's the Difference?

**H1:**
> Energy gummies vs caffeine: a side-by-side guide.

**H2 structure:**
- Quick answer
- How caffeine works
- How energy gummies work *(B12, ginseng, L-theanine, CoQ10)*
- The crash question *(why caffeine crashes, why gummies typically don't)*
- When to choose which
- Can you take both?
- Frequently asked questions
- Build your morning ritual *(Energy PDP + quiz CTA)*

---

## Account / Sign In / Register / Checkout

These should be `noindex,nofollow` — transactional / private pages have no SEO value and can dilute crawl budget.

```html
<meta name="robots" content="noindex,nofollow">
```

Pages to noindex:
- `/account` (and all subpages)
- `/signin`, `/register`
- `/checkout` and subroutes
- Cart drawer URL (if it has one)

---

## Title formula reference

**Standard pattern:** `[Page-specific value] | [Brand]`
- e.g. "Luma Energy Gummies | Clean Energy + Focus Support"

**Variations by page type:**
- Homepage: `[Brand] | [What you sell + key categories]`
- PDP: `[Product name] | [Key benefit + key ingredient]`
- Collection: `[Collection name] | [Brand]`
- Blog: `[Article H1 trimmed] | [Brand]` or just `[Article H1]` if 60+ chars
- About: `About [Brand] | [Tagline]`

**Rules:**
- ≤60 chars to avoid SERP truncation (Google shows ~580 px)
- Front-load the most important keyword
- Brand at end (unless brand is the most searched term — then front-load)
- No clickbait, no ALL CAPS, no excessive punctuation
- Title-case major words

---

## Quick scan: all titles + H1s

| Page | SEO Title | H1 |
|---|---|---|
| `/` | Luma Daily \| Daily Wellness Gummies for Energy, Calm, Sleep | Daily gummies for energy, calm, sleep, glow, and gut support. |
| `/shop` | Shop All Wellness Gummies \| Luma Daily | All five formulas. One daily ritual. |
| `/quiz` | Find My Ritual: Your Daily Wellness Quiz | Build the ritual that fits the way you actually live. |
| `/shop?tab=bundles` | Wellness Gummy Bundles \| Luma Daily Stacks | Build your stack. Save more. Stay consistent. |
| `/products/energy` | Luma Energy Gummies \| Clean Energy + Focus Support | Luma Energy |
| `/products/calm` | Luma Calm Gummies \| Ashwagandha + L-Theanine Support | Luma Calm |
| `/products/sleep` | Luma Sleep Gummies \| Low-Dose Melatonin + Chamomile | Luma Sleep |
| `/products/glow` | Luma Glow Gummies \| Marine Collagen + Biotin Support | Luma Glow |
| `/products/gut` | Luma Gut Gummies \| Probiotic + Prebiotic Daily Support | Luma Gut |
| `/faq` | Luma Daily FAQ \| Wellness Gummy Questions | Questions, answered. |
| `/about` | About Luma Daily \| Premium Wellness Gummies | The daily ritual, redesigned. |
| `/ingredients` | Ingredients \| Every Dose, Every Detail \| Luma Daily | Every ingredient. Every dose. Nothing hidden. |
| `/blog` | Wellness Guides + Rituals \| The Luma Daily Blog | The Luma Daily Wellness Guides |
