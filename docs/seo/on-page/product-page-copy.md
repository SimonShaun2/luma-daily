# Product Page — Universal Copy Template

Reusable copy patterns for all 5 PDPs. Per-product specifics live in [docs/seo/products/luma-*.md](../products/).

---

## Above-the-fold structure (right column on desktop, top on mobile)

1. Breadcrumb: Home > Shop > [Category] > [Product]
2. Star rating + review count (e.g., "★★★★★ 4.9 (847 reviews)")
3. **H1:** Product name (e.g., "Luma Energy")
4. **Subhead:** Outcome-led tagline (e.g., "Power your day without the crash.")
5. **Flavor badge** (e.g., "Blood Orange Mango")
6. **Description paragraph** (~80 words — the most-conversion-relevant short pitch; longer description appears below the fold)
7. **Subscribe vs One-Time toggle** (default: Subscribe & Save 20%)
8. **Price** (showing both subscribe and one-time, with "save $X/mo" call-out)
9. **"Delivered monthly · Free shipping · Cancel anytime"** subline
10. **Quantity selector** (default 1)
11. **Add to Ritual** button — primary CTA, prominent
12. **Subscribe benefits block** (when subscribe is selected): 4 bullets in compact box

---

## Below-the-fold structure

### Section 1 — Trust badges (3 across)
- Third-party tested
- Vegan & clean
- 60-day guarantee

### Section 2 — Long-form description (~150-200 words)
Per-product copy from each [products/luma-*.md](../products/) file.

### Section 3 — Accordion: Ingredients & doses
Default-open. Each ingredient on its own row: name, dose, 1-line benefit, ingredient page anchor link.

### Section 4 — Accordion: How to use
Per-product timing guidance + pro tip.

### Section 5 — Accordion: Quality + certifications
Standard 4-point list (vegan, gluten-free, non-GMO, third-party tested). Plus "Every batch tested by an ISO-certified lab. Certificates of Analysis available on request."

### Section 6 — Accordion: Shipping + returns
3-line pull from FAQ: free shipping over $60, 60-day money-back guarantee, secure checkout.

### Section 7 — Reviews
Star rating distribution + 3-6 verified review cards. Filter by rating, sort by recent / most helpful.

### Section 8 — "Pair it with" / Related products
3 product cards. Per-product recommendations from `products/luma-*.md`.

### Section 9 — FAQ
5 product-specific Q&As from `products/luma-*.md`. `FAQPage` schema.

### Section 10 — Final CTA
**Headline:** Not sure if [Product Name] fits your routine?
**Body:** Take the 60-second Find My Ritual quiz to get a personalized formula recommendation.
**CTA:** Build My Ritual → `/quiz`

---

## Sticky elements

### Mobile sticky bottom bar
- Price + "Add to Ritual" button (always visible while scrolling)

### Desktop sticky right column
- Subscribe toggle + Add to Cart (sticks while scrolling through long description)

---

## Schema markup
- `Product` (name, image, description, sku, brand, offer with price)
- `Offer` (with `priceCurrency`, `price`, `availability`, `priceValidUntil`)
- `AggregateRating` (when reviews are live)
- `BreadcrumbList`
- `FAQPage` (5 product-specific Q&As)

---

## Compliance footer (small print, every PDP)

> *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare provider if you are pregnant, nursing, on medication, or under 18.*
