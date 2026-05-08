# Luma Daily — Brand Entity Profile

This is the canonical source-of-truth for how Luma Daily is described across every external surface where Google (and AI search engines) read brand data: Wikipedia, Wikidata, Crunchbase, social profiles, directory listings, schema markup, and structured data on the website itself.

**Consistency across all of these surfaces is what builds a Knowledge Graph entity.** Google needs to see the same name, description, founding date, parent company, and category in 5+ authoritative sources before it confidently treats Luma Daily as a brand entity. Once it does, the brand becomes eligible for Knowledge Panels in branded SERPs and stronger AI Overview attribution.

---

## Canonical entity facts

| Field | Value |
|---|---|
| **Brand name** | Luma Daily |
| **Legal entity** | Luma Wellness Group |
| **Founded** | 2026 |
| **Headquarters** | United States |
| **Industry** | Wellness / Dietary Supplements |
| **Sub-category** | Functional gummy supplements |
| **Website** | https://takelumadaily.com |
| **Customer base** | Direct-to-consumer (DTC) |
| **Markets** | United States, Canada, United Kingdom |
| **Product line** | 5 wellness gummy formulas + bundles |
| **Manufacturing** | USA, cGMP-certified facilities |
| **Certifications** | Third-party tested, vegan-friendly, gluten-free, non-GMO |
| **Parent company** | Luma Wellness Group |
| **Founder** | *[name placeholder]* |
| **Logo URL** | https://takelumadaily.com/images/logo.png |
| **Brand colors** | Cream `#FAF7F2`, Charcoal `#1E1B16`, Amber `#C8813A` |

---

## Standard brand description (use this verbatim across surfaces)

**Short (50 words, for social bios + directories):**
> Luma Daily is a premium wellness gummy brand built around the daily ritual — five clean formulas for energy, calm, sleep, glow, and gut support. Transparent dosing, third-party tested, designed for adults building a sustainable wellness routine. Made in the USA. takelumadaily.com.

**Medium (100 words, for Crunchbase / Wikipedia-style listings):**
> Luma Daily is a direct-to-consumer wellness gummy brand founded in 2026 by Luma Wellness Group. The brand offers five clean gummy formulas — Energy, Calm, Sleep, Glow, and Gut — designed to fit a complete morning-to-night wellness ritual. Every formula uses transparent, third-party-tested ingredients at clinically-relevant doses, with no proprietary blends. Luma Daily distinguishes itself from mass-market gummy competitors through ingredient transparency, lower-dose smarter formulations (such as 3mg melatonin in Sleep), and a five-formula daily ritual system rather than single-SKU positioning. Available at takelumadaily.com with subscription discounts.

**Long (200 words, for press kits + About-style placements):**
> Luma Daily is a premium wellness gummy brand founded in 2026 by Luma Wellness Group. The brand was built around a simple insight: the wellness industry has a consistency problem. Most people who buy supplements quit within 30 days. Most "stacks" are six bottles deep, taken erratically, abandoned by month two. Luma Daily's response is to build the routine, not just the supplements.
>
> The brand offers five clean gummy formulas — Luma Energy (morning), Luma Calm (midday), Luma Sleep (evening), and Luma Glow + Luma Gut (always-on) — designed to fit a real daily ritual without ingredient overlap or daily complexity. A 60-second Find My Ritual quiz recommends the right two-to-three formulas for each customer's goals and schedule. A flexible subscription removes the consistency problem by automating reorders.
>
> Every Luma Daily formula uses transparent, third-party-tested ingredients at clinically-relevant doses (300mg KSM-66 ashwagandha in Calm, 3mg low-dose melatonin in Sleep, 2,500mg marine collagen in Glow). No proprietary blends. Made in the USA in cGMP-certified facilities.
>
> Luma Daily is available at takelumadaily.com.

---

## What we want Google's Knowledge Graph to know

When a user searches "Luma Daily" in branded mode, the ideal Knowledge Panel surfaces:

1. **Logo + name + category** ("Luma Daily — Wellness gummy brand")
2. **Founded** (2026)
3. **Headquartered in** (United States)
4. **Parent organization** (Luma Wellness Group)
5. **Products** (Luma Energy, Luma Calm, Luma Sleep, Luma Glow, Luma Gut)
6. **Social profiles** (Instagram, TikTok, Pinterest, LinkedIn, YouTube)
7. **Website link** (takelumadaily.com)
8. **Customer reviews snapshot** (4.9/5 average, X reviews)

To get there, the canonical facts above need to appear consistently across:
- Wikipedia (when eligible — needs 3rd-party citations first)
- Wikidata
- Crunchbase
- LinkedIn company page
- Trustpilot brand page
- Google Business Profile
- All social profiles
- Schema markup on takelumadaily.com (`Organization`, `Brand`, `Person` for founder)
- Press citations (Wirecutter, Healthline, Byrdie, etc.)

---

## Entity schema (Organization + Brand)

Implement on every page (in `<head>` via `theme.liquid` or `index.html`):

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Luma Daily",
  "alternateName": ["Luma Wellness", "Luma"],
  "url": "https://takelumadaily.com",
  "logo": "https://takelumadaily.com/images/logo.png",
  "description": "A premium wellness gummy brand built around the daily ritual — five clean formulas for energy, calm, sleep, glow, and gut support.",
  "foundingDate": "2026",
  "parentOrganization": {
    "@type": "Organization",
    "name": "Luma Wellness Group"
  },
  "sameAs": [
    "https://www.instagram.com/lumadaily",
    "https://www.tiktok.com/@lumadaily",
    "https://www.pinterest.com/lumadaily",
    "https://www.facebook.com/lumadaily",
    "https://www.linkedin.com/company/luma-daily",
    "https://www.youtube.com/@lumadaily"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "support@takelumadaily.com",
    "availableLanguage": "English"
  }
}
```

---

## Files referenced
- [organization-description.md](organization-description.md) — long-form brand description for press / About pages
- [social-profile-bios.md](social-profile-bios.md) — per-platform bio copy
- [directory-listings.md](directory-listings.md) — Crunchbase / Trustpilot / etc.
- [google-business-profile.md](google-business-profile.md) — GMB setup + recommendations
- [knowledge-graph-checklist.md](knowledge-graph-checklist.md) — readiness checklist
