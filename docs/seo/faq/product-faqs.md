# FAQ — Product Pages

Per-product FAQ banks (5 questions each). Implement on each PDP in the FAQ accordion section. Wrap in `FAQPage` schema. Each PDP also has its own product-specific FAQs in [docs/seo/products/luma-*.md](../products/) — these here are the cross-cutting ones that apply to multiple products.

---

## Universal product FAQs (apply to all 5 PDPs)

### Q: Are Luma Daily gummies third-party tested?
Yes. Every batch of every Luma Daily formula is tested by an independent ISO-certified lab for ingredient identity, potency, and contaminants. Certificates of Analysis are available on request from customer support.

### Q: Where are Luma Daily gummies made?
Luma Daily gummies are manufactured in the United States in cGMP-certified facilities that follow FDA dietary supplement guidelines.

### Q: Do Luma Daily gummies contain sugar?
Yes — but in small, intentional amounts. Each gummy contains about 2g of sugar from natural fruit sources. We use thoughtful sweetening rather than zero-sugar artificial alternatives because the texture and flavor of a gummy you'll actually take daily matters.

### Q: Are Luma Daily gummies safe to take long-term?
Yes — the ingredients in every formula are designed for daily, long-term use at the doses we provide. As with any supplement, consult a healthcare provider if you're pregnant, nursing, on medication, or under 18.

### Q: Can I take multiple Luma Daily formulas together?
Yes. The five formulas are designed without ingredient overlap, so you can take any combination together. The Daily Ritual Bundle includes all five and is the most-purchased option for customers building a complete daily ritual. The [Find My Ritual quiz](/quiz) recommends the right combination based on your goals.

---

## Luma Energy specific FAQs
*(See [products/luma-energy.md](../products/luma-energy.md) for the full per-product FAQ — covers timing, caffeine content, jitters, onset time, and pairing with coffee.)*

---

## Luma Calm specific FAQs
*(See [products/luma-calm.md](../products/luma-calm.md) — covers timing, drowsiness, onset time, pairing with Energy, and daily-use safety.)*

---

## Luma Sleep specific FAQs
*(See [products/luma-sleep.md](../products/luma-sleep.md) — covers timing, melatonin dose, daily-use safety, what-if-it-doesn't-work, and pairing with Calm.)*

---

## Luma Glow specific FAQs
*(See [products/luma-glow.md](../products/luma-glow.md) — covers timing, results timeline, dosing relative to other collagen sources, vegan status, and effectiveness.)*

---

## Luma Gut specific FAQs
*(See [products/luma-gut.md](../products/luma-gut.md) — covers timing, refrigeration, allergens, results timeline, and bloating support.)*

---

## Cross-product comparison FAQs

### Q: What's the difference between Luma Calm and Luma Sleep?
Both support a calmer state, but they're built for different moments. Luma Calm uses ashwagandha and L-theanine to support stress balance during the day — without sedation. Luma Sleep uses 3mg melatonin, chamomile, passionflower, and GABA to support a restful wind-down before bed. Many customers take both: Calm earlier in the day, Sleep 30-60 minutes before bed.

### Q: Should I take Luma Energy or Luma Calm first?
Luma Energy goes in the morning. Luma Calm can go any time, but most customers take it midday or in the late afternoon. The Energy + Calm Bundle is built for this exact pairing.

### Q: Can I take Luma Glow and Luma Gut together?
Yes — they pair well. Skin health is influenced by gut health (the gut-skin axis), so many customers take both as part of a beauty-focused routine.

---

## Schema implementation

Each PDP's FAQ section uses `FAQPage` schema. The 5 product-specific Q&As live on each PDP. The 5 universal Q&As above can either be repeated on every PDP (for completeness + AI Overview eligibility) or live only on the FAQ page with cross-links from PDPs.

Recommended: include 3-5 Q&As per PDP with `FAQPage` schema, plus a link to the full FAQ page for the universal questions.
