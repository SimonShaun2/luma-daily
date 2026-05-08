# Knowledge Graph Readiness Checklist

A checklist of every action that contributes to Luma Daily becoming a recognized brand entity in Google's Knowledge Graph (and by extension, in AI Overviews / ChatGPT / Perplexity / Bing AI).

The Knowledge Graph is what powers branded Knowledge Panels in SERPs. Brands with mature Knowledge Graph entities get:
- Knowledge Panel for branded queries (massive SERP real estate)
- Higher branded-search CTR
- Stronger AI search engine attribution
- Better trust signal across all rankings

---

## Foundation — must complete first 30 days

- [ ] Implement `Organization` schema sitewide (name, logo, description, founded date, parent org, sameAs links to all socials)
- [ ] Implement `Brand` schema on every PDP linking back to the parent `Organization`
- [ ] Implement `Person` schema for founder (when founder bio is published)
- [ ] All 6 social profiles created with consistent bios *(see [social-profile-bios.md](social-profile-bios.md))*
- [ ] LinkedIn Company Page live + verified
- [ ] Crunchbase profile claimed and complete
- [ ] Trustpilot business profile created
- [ ] Google Business Profile set up + verified *(see [google-business-profile.md](google-business-profile.md))*
- [ ] BBB listing created
- [ ] Wikidata entry created (canonical fact source for the brand)

---

## Authority — days 31-90

- [ ] First 5 third-party press citations (Wirecutter, Healthline, Byrdie, Well+Good, mindbodygreen, etc. — even small mentions count)
- [ ] First 50 verified reviews on Trustpilot
- [ ] First 10 verified reviews on GBP
- [ ] Press kit available at takelumadaily.com/press (logos, founder bio, product photos, fact sheet)
- [ ] Brand mentioned (even without backlink) in 10+ wellness publications
- [ ] Founder bio published on About page with Person schema
- [ ] Founder LinkedIn presence active (1+ post per week)
- [ ] First 5 podcast appearances by founder

---

## Knowledge Panel triggers — these are what tips Google to build the panel

The Knowledge Panel typically appears when:

1. **3+ authoritative sources confirm the brand entity** (Crunchbase, Wikipedia, LinkedIn, Wikidata, Trustpilot, Yelp, news mentions)
2. **Branded search volume crosses ~500/month** (signals real brand interest)
3. **Schema implementation is clean and validates** (Organization with logo, sameAs, contactPoint)
4. **The brand has owned-domain content that satisfies branded queries** (About page, Press page, FAQ)

Track these via Google Search Console (branded keyword volume) + manual SERP screenshots monthly.

---

## AI search engine readiness

LLM-based search engines (ChatGPT, Perplexity, Claude, Bing AI, Google AI Overviews) cite brands they recognize as entities. To be cited:

- [ ] Reddit presence: brand mentioned in r/Supplements, r/wellness, r/skincareaddiction (not spam — natural mentions, ideally Q&A responses)
- [ ] Wikipedia eligibility (typically requires multiple notable third-party sources first — work toward eligibility, not direct creation)
- [ ] Consistent canonical brand description across all surfaces *(see [organization-description.md](organization-description.md))*
- [ ] FAQPage schema on homepage, PDPs, FAQ page — high LLM citation rate from FAQ-formatted content
- [ ] ai-search-answers.md content live on the site (the canonical answer bank — see [../faq/ai-search-answers.md](../faq/ai-search-answers.md))

---

## What to track quarterly

- Branded search volume (GSC)
- Knowledge Panel appearance for "luma daily" (manual SERP check)
- AI Overview citation rate on 25 sample queries
- Wikipedia / Wikidata entry status
- Number of authoritative third-party brand mentions
- LinkedIn followers (proxy for B2B/PR brand awareness)
- Trustpilot review count + average rating

---

## What "Knowledge Graph maturity" looks like at day 365

- Knowledge Panel appears for "luma daily" branded search
- Brand cited in 30%+ of relevant AI Overview queries
- Founder cited as an industry voice in wellness press
- 100+ verified reviews across Trustpilot + GBP
- 5+ tier-1 press citations (NYT, Vogue, mindbodygreen, Wirecutter, etc.)
- Brand surfaces in "best wellness gummies" and "best [category] gummies" AI roundups

---

## Files referenced
- [brand-entity-profile.md](brand-entity-profile.md) — canonical entity facts
- [organization-description.md](organization-description.md) — long-form descriptions
- [social-profile-bios.md](social-profile-bios.md) — per-platform bios
- [directory-listings.md](directory-listings.md) — directories to set up
- [google-business-profile.md](google-business-profile.md) — GBP setup
- [../faq/ai-search-answers.md](../faq/ai-search-answers.md) — AI search canonical answers
