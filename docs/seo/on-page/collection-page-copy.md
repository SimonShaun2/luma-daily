# Collection Page — Universal Copy Template

Reusable patterns for all 8 collection pages. Per-collection specifics in [docs/seo/collections/*.md](../collections/).

---

## Above-the-fold structure

1. Breadcrumb: Home > Shop > [Collection]
2. **Eyebrow** (small caps, optional context): e.g., "MORNING RITUAL"
3. **H1:** Collection-specific (e.g., "The morning ritual, simplified.")
4. **Subhead:** 1 sentence summary of what's in the collection
5. **Primary CTA button:** "Build My Ritual" → `/quiz` (for unsure visitors)
6. **Optional filter pills** below the H1 (Energy / Sleep / Stress / etc. when relevant)

---

## SEO intro copy (above the product grid, ~80-100 words)

Per-collection copy from `collections/*.md`. Should:
- Lead with the use case ("the formulas built for the first part of the day")
- Mention the 1-2 anchor products in the collection
- Reinforce the daily-ritual positioning
- Call out subscription value ("subscribe and save 20% on every order")

---

## Product grid

- 3-column desktop, 2-column tablet, 1-column mobile
- Each card: image, name, tagline, price, subscribe price line, "Add to Cart"
- Featured products positioned 1-3 (highest conversion in the collection)
- Bundle cards visually distinct (slightly larger or bordered)

---

## Mid-grid CTA block (after position 3-4)

**Headline:** Not sure where to start?
**Body:** Take the 60-second Find My Ritual quiz to get a personalized recommendation.
**CTA:** Build My Ritual → `/quiz`

---

## Below-the-grid sections

### Section 1 — "Why this collection"
Educational/positioning paragraph (~80 words). Why this collection exists, what need it serves, who it's for.

### Section 2 — Related blog content
3 article cards from the relevant blog cluster. E.g., Morning Ritual collection → Morning Wellness Routine, Energy Gummies vs Caffeine, Best Time to Take Wellness Gummies.

### Section 3 — FAQ
3-4 Q&As from [collection-faqs.md](../faq/collection-faqs.md) for this specific collection. `FAQPage` schema.

### Section 4 — Final CTA
**Headline:** Subscribe + save 20% on every order.
**CTA:** Subscribe & Save → any product / bundle in the collection

---

## Schema
- `CollectionPage` schema with `mainEntity` listing the products
- `BreadcrumbList`
- `FAQPage`
- Each product card has minimal `Product` schema (image, name, price, URL)

---

## SEO sub-footer copy (below FAQ, above main footer)

A 60-word "long-tail intent" paragraph designed to capture variant-keyword search intent without keyword-stuffing. Example for the Morning Ritual collection:

> Whether you're looking for energy gummies for adults, a clean morning supplement routine, or a caffeine-free alternative to coffee, the Luma Daily morning ritual is built around the formulas that support steady energy, focus, and a calmer start to your day. Free shipping on subscriptions. Cancel anytime.
