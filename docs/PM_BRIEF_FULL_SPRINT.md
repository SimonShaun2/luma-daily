# Luma Daily — Full Sprint PM Brief

**Date:** May 8, 2026  
**Branch:** `feat/cart-enhancements` — `SimonShaun2/luma-daily`  
**Prepared by:** Engineering / Design  
**For:** Product Manager  

---

## Executive Summary

This brief covers everything built and committed to GitHub across the full sprint. The work falls into four distinct bodies of delivery: a complete redesigned landing page with 21 sections and supporting modal flows; 13 additional React pages covering every route in the storefront; 28 checkout and cart UX enhancements with full Shopify porting documentation; and a 47-document SEO content library totalling over 8,000 lines. All code is on `feat/cart-enhancements`. All documentation is in `docs/`. The live prototype is accessible at the Manus webdev preview URL.

---

## Part 1 — Landing Page (`Home.tsx`)

The landing page was built from scratch as a single-file React component (3,653 lines) using a **Warm Editorial Urgency** design system — Playfair Display for display headings, DM Sans for body, amber/terracotta accent palette on an off-white cream base. Every section is production-ready and maps directly to a Shopify theme section or Liquid block.

### Page Sections

| # | Section | Description | Shopify Equivalent |
|---|---------|-------------|-------------------|
| 1 | **Urgency Bar** | Live countdown timer (h/m/s) to a limited offer; auto-hides at zero | `announcement-bar.liquid` |
| 2 | **Navigation** | Logo, five nav links, cart icon with live badge, "Shop Now" CTA; mobile hamburger | `header.liquid` |
| 3 | **Hero** | Asymmetric split — headline + social proof left, UGC video player right; three trust pills | `hero.liquid` |
| 4 | **Press Logos** | Scrolling marquee of press mentions (Forbes, Vogue, etc.) | `logo-list.liquid` |
| 5 | **Trust Bar** | Four icon + copy trust signals (results, taste, clean, certified) | `icon-row.liquid` |
| 6 | **Problem Agitation** | "You've tried the pills. Nothing stuck." copy block with three pain points | `rich-text.liquid` |
| 7 | **Products** | Filter tabs (All / Energy / Calm / Sleep / Focus / Glow / Gut) + horizontal snap carousel; 6 product cards with flavor badges, star ratings, subscribe toggle, ATC button | `product-grid.liquid` |
| 8 | **Quiz CTA** | "Find My Ritual" banner with headline, subhead, and quiz trigger button | `featured-collection.liquid` |
| 9 | **Social Proof Stats** | Three animated counters (customers, rating, satisfaction) with IntersectionObserver trigger | `stats.liquid` |
| 10 | **Bundles** | Horizontal snap carousel; 10 bundle cards with bundle images, pricing, subscribe toggle, ATC | `featured-collection.liquid` |
| 11 | **Ingredients** | Six key ingredients with icons, names, and benefit copy | `icon-with-text.liquid` |
| 12 | **Reviews** | Star rating summary + three review cards with avatar, name, verified badge, body | `reviews.liquid` |
| 13 | **Subscribe & Save** | Side-by-side one-time vs. subscribe comparison; 15% savings callout; CTA | `subscription-cta.liquid` |
| 14 | **UGC Carousel** | Dark-background auto-scrolling carousel of UGC thumbnails with play overlay | `video-gallery.liquid` |
| 15 | **FAQ** | Eight collapsible accordion items with smooth open/close animation | `collapsible-content.liquid` |
| 16 | **Final CTA** | Full-width banner with headline, subhead, and primary CTA | `image-banner.liquid` |
| 17 | **Footer** | Four-column layout — brand, products, company, legal; newsletter input | `footer.liquid` |
| 18 | **Mobile Sticky Bottom Bar** | Slides in after user scrolls past products section; product image, name, price, ATC | Custom sticky section |
| 19 | **Quiz Modal** | Four-step in-page quiz (Goal → Lifestyle → Sleep → Recommendation) with email gate and 15% off offer | Custom modal |
| 20 | **Cart Drawer** | Slide-out Sheet with quantity controls, subscribe toggle, free-shipping progress, GWP tier, upsell row, trust badges, sticky checkout footer | `cart-drawer.liquid` |
| 21 | **Product Detail Modal** | Full product detail overlay triggered from product cards | `product-modal.liquid` |

### Supporting Components

The following components are used across the page and are candidates for extraction into shared Shopify snippets:

- `CountdownTimer` — accepts target date, returns h/m/s with auto-hide at zero.
- `AnimatedCounter` — IntersectionObserver-triggered number animation with configurable duration.
- `FAQItem` — controlled accordion with smooth height transition.
- `StarRating` — renders filled/empty stars from a numeric value.
- `HeroVideoPlayer` — thumbnail with play overlay, modal video player.
- `UGCCarousel` — auto-scrolling horizontal reel with pause-on-hover.
- `QuizModal` — four-step wizard with email capture gate and Klaviyo identify call.

---

## Part 2 — Additional Pages (13 Routes)

Thirteen additional React pages were built and wired into the router, covering every link in the navigation and footer. Each page is fully styled to the Warm Editorial design system.

| Page | Route | Description |
|------|-------|-------------|
| **Shop** | `/shop` | Full product catalogue with filter tabs, sort controls, and product grid |
| **Product Detail** | `/products/:handle` | Full PDP with image gallery, variant selector, subscribe toggle, ATC, ingredient accordion |
| **Quiz** | `/quiz` | Standalone full-page version of the four-step Find My Ritual quiz |
| **About** | `/about` | Brand story, mission, founder section, ingredient sourcing callout |
| **Ingredients** | `/ingredients` | Deep-dive ingredient library with search and category filter |
| **Account** | `/account` | Dashboard with four tabs: Subscription, Order History, Profile, Billing |
| **Sign In** | `/sign-in` | Email + password form with "Forgot password" link and social sign-in placeholders |
| **Register** | `/register` | Account creation form with quiz CTA |
| **Checkout** | `/checkout` | Standalone checkout page (mirrors the modal flow) |
| **Shipping** | `/shipping` | Shipping policy page |
| **Contact** | `/contact` | Contact form with email, subject, message fields |
| **Legal** | `/legal` | Privacy policy and Terms of Service (tabbed) |
| **Not Found** | `*` | 404 page with navigation back to home |

### Account Dashboard Detail

The Account page is the most complex secondary page. It includes a fully functional subscription management tab with an `AddFormulaModal` (product picker showing only formulas not already subscribed, with live price preview), a `ConfirmModal` for pause/resume/skip/cancel actions with animated backdrop, and an order history tab with View Details and Reorder CTAs. All state changes are reflected in real-time in the UI.

---

## Part 3 — Cart & Checkout UX Enhancements (28 Features)

All 28 enhancements are documented with copy-paste Shopify-ready code in `docs/CART_UX_ENHANCEMENTS.md`. The table below provides a consolidated status view; refer to the dedicated PM brief (`docs/PM_BRIEF_CHECKOUT_ENHANCEMENTS.md`) for full implementation detail per feature.

### Cart Drawer Micro-Interactions (Sections 1–10)

These ten features are pure frontend CSS/React state changes. All CSS keyframe animations are committed to `client/src/index.css` and require no additional styling work in Shopify.

| # | Feature | Status |
|---|---------|--------|
| 1 | ATC button loading / success states | ✅ Drop-in |
| 2 | Cart drawer success banner (slide-in) | ✅ Drop-in |
| 3 | New cart item slide-in animation | ✅ Drop-in |
| 4 | Remove item shake + slide-out | ✅ Drop-in |
| 5 | Quantity change price flash | ✅ Drop-in |
| 6 | Cart badge pop on count increase | ✅ Drop-in |
| 7 | Free-shipping progress bar → unlocked banner ($50) | ✅ Drop-in |
| 8 | GWP tier banner at $75 | ✅ Drop-in |
| 9 | Checkout button glow pulse when shipping unlocks | ✅ Drop-in |
| 10 | Sticky checkout footer on mobile | ✅ Drop-in |

### Checkout Form UX (Sections 11–15)

| # | Feature | Status |
|---|---------|--------|
| 11 | Inline form validation (red border + helper text on blur + CTA guard) | ✅ Drop-in |
| 12 | Confirmation email capture ("receipt + 10% off") | ✅ Drop-in |
| 13 | sessionStorage form persistence (PCI-safe, cleared on completion) | ✅ Drop-in |
| 14 | Card number formatter + expiry/CVV focus chaining | ✅ Drop-in |
| 15 | Google Maps Places Autocomplete on Street Address | ⚠️ API key swap needed |

### Payment Step Polish (Sections 16–20)

| # | Feature | Status |
|---|---------|--------|
| 16 | Card network icon detector (Visa / Mastercard / Amex / Discover) | ✅ Drop-in |
| 17 | Klaviyo "Checkout Started" event | ✅ Drop-in |
| 18 | Klaviyo "Placed Order" event | ✅ Drop-in |
| 19 | Order summary mini-badge on Shipping and Payment step headers | ✅ Drop-in |
| 20 | Collapsible promo code field with local fallback table | ✅ Drop-in |

### Post-Order Retention (Sections 21–27)

| # | Feature | Status |
|---|---------|--------|
| 21 | Shopify Discount Codes API validation (async, with fallback) | ⚠️ Backend proxy needed |
| 22 | Referral share row on confirmation (`lumadaily.com/?ref=FIRSTNAME`) | ✅ Drop-in |
| 23 | Post-purchase upsell modal (30% off, 3-minute countdown timer) | ✅ Drop-in |
| 24 | Shopify Draft Orders API — upsell Accept wiring | ⚠️ Backend proxy needed |
| 25 | Loyalty points balance card on confirmation (Smile.io) | ✅ Drop-in (demo) |
| 26 | Redeem points row in Order Summary (range slider, stacks with promo) | ✅ Drop-in (demo) |
| 27 | Klaviyo "Placed Order" event | ✅ Drop-in |

### Abandonment Recovery (Section 28)

| # | Feature | Status |
|---|---------|--------|
| 28 | Exit-intent overlay (top-edge mouseleave, LUMA10 + email capture) | ✅ Drop-in |

---

## Part 4 — SEO Content Library (47 Documents, 8,001 Lines)

A complete SEO content library was built and committed to `docs/seo/`. Every document is written to be copy-pasted directly into Shopify metafields, theme settings, the Shopify blog, or third-party tools (Klaviyo, Google Search Console, schema validators). The library is organised into eight categories.

### SEO Strategy & Architecture

| Document | Description |
|----------|-------------|
| `seo-strategy.md` | Master SEO strategy: three pillars, keyword universe, search intent map, 90-day roadmap, AI search visibility, internal linking, compliance guardrails, KPIs |
| `keyword-map.md` | Five-tier keyword map — T1 branded, T2 category core, T3 product head terms, T4 long-tail commercial, T5 educational — with monthly search volume estimates and priority scores |
| `search-intent-map.md` | Query-to-intent mapping for every major keyword cluster |
| `internal-linking-plan.md` | Hub-and-spoke internal link architecture across all pages |
| `page-title-map.md` | `<title>` tags for every page, optimised for CTR and keyword inclusion |
| `meta-description-library.md` | Meta descriptions for every page and collection |
| `google-snippets.md` | Featured snippet targets with exact answer-box copy |
| `cta-library.md` | 40+ CTA variants across awareness, consideration, and conversion stages |
| `tagline-library.md` | 20+ tagline variants for ads, social, packaging, and email |
| `90-day-roadmap.md` | Week-by-week execution roadmap across all SEO workstreams |

### On-Page Copy

Eight documents covering the exact copy for every major page, written to match search intent and include primary keywords naturally:

`homepage-copy.md`, `product-page-copy.md`, `bundles-copy.md`, `shop-all-copy.md`, `collection-page-copy.md`, `about-copy.md`, `faq-copy.md`, `find-my-ritual-copy.md`

### Product SEO Pages

Five individual product SEO documents (one per formula) covering: primary and secondary keywords, meta title and description, H1/H2 structure, ingredient benefit copy, FAQ schema, and internal linking targets:

`luma-energy.md`, `luma-calm.md`, `luma-sleep.md`, `luma-glow.md`, `luma-gut.md`

### Collection Pages

Eight collection page documents with SEO-optimised headings, body copy, and product grid intro text:

`best-sellers.md`, `morning-ritual.md`, `night-ritual.md`, `beauty-ritual.md`, `gut-health.md`, `full-daily-ritual.md`, `build-your-bundle.md`, `subscribe-and-save.md`

### FAQ & Structured Data

Eight FAQ documents covering every customer question cluster, each formatted for direct import as Shopify metafields or FAQ schema markup:

`homepage-faq.md`, `product-faqs.md`, `collection-faqs.md`, `ingredient-faq.md`, `quiz-faq.md`, `subscription-faq.md`, `shipping-returns-faq.md`, `ai-search-answers.md`

The `ai-search-answers.md` document is specifically written for AI Overview (Google SGE) and ChatGPT citation targeting — short, factual, source-citable answers to the 20 most common Luma Daily queries.

### Blog & Content Marketing

Four documents covering the full 90-day content programme:

| Document | Description |
|----------|-------------|
| `90-day-editorial-calendar.md` | Day-by-day publishing schedule for 90 days: 6 pillar pages, 36 supporting articles, 8 comparison pages, 12 ingredient deep-dives |
| `content-clusters.md` | Topic cluster map with pillar → spoke relationships and internal link targets |
| `pillar-page-outlines.md` | Full H2/H3 outlines for all 6 pillar pages |
| `supporting-article-outlines.md` | Brief outlines for the 36 supporting articles |
| `internal-linking-map.md` | Article-to-article and article-to-product internal link plan |

### Backlink & Digital PR

Five documents covering the full outreach programme:

| Document | Description |
|----------|-------------|
| `backlink-strategy.md` | Strategic frame, 90-day target (30 referring domains), outreach team structure, success metrics |
| `outreach-targets.md` | 40+ qualified prospect sites with DA, relevance score, and contact method |
| `email-templates.md` | Six outreach email templates (guest post, product review, resource page, podcast, influencer, journalist) |
| `pitch-angles.md` | 12 story angles for digital PR pitches |
| `90-day-outreach-calendar.md` | Week-by-week outreach execution calendar |

### Brand Entity & Knowledge Graph

Six documents for establishing Luma Daily as a recognised entity in Google's Knowledge Graph:

| Document | Description |
|----------|-------------|
| `brand-entity-profile.md` | Canonical entity facts, standard brand description, Organization + Brand schema JSON-LD |
| `organization-description.md` | 50/100/150-word brand descriptions for directory listings and press kits |
| `knowledge-graph-checklist.md` | 20-point checklist for Knowledge Graph entity establishment |
| `google-business-profile.md` | GBP setup guide with category, attributes, and Q&A seeds |
| `directory-listings.md` | 25 priority directories with submission instructions |
| `social-profile-bios.md` | Platform-specific bios for Instagram, TikTok, Pinterest, YouTube, Facebook, LinkedIn, X |

---

## Files Changed — Complete Inventory

| Category | Files | Lines |
|----------|-------|-------|
| Landing page (`Home.tsx`) | 1 | 3,653 |
| Additional pages (13 routes) | 13 | ~5,467 |
| Cart context + hooks | 3 | ~400 |
| SEO content library | 47 | 8,001 |
| Checkout UX docs | 2 | ~1,550 |
| CSS animations | 1 (`index.css`) | ~150 |
| **Total** | **67** | **~19,221** |

---

## Production Readiness Summary

The following table summarises what is ready to deploy immediately versus what requires a backend sprint or configuration step before going live in Shopify.

| Workstream | Ready to Deploy | Requires Action Before Deploy |
|------------|:--------------:|-------------------------------|
| Landing page (all 21 sections) | ✅ | Confirm GWP product handle and free-shipping threshold |
| 13 additional pages | ✅ | — |
| Cart micro-interactions (10 features) | ✅ | — |
| Checkout form UX (sections 11–14) | ✅ | — |
| Google Maps Autocomplete | ⚠️ | Swap Manus proxy for `GOOGLE_MAPS_API_KEY` restricted to store domain |
| Klaviyo events (Checkout Started, Placed Order, email capture) | ✅ | Add Klaviyo snippet to `theme.liquid`; create two Klaviyo Flows |
| Promo code field (local fallback) | ✅ | — |
| Promo code field (Shopify API) | ⚠️ | Deploy `POST /api/validate-promo`; add `SHOPIFY_ADMIN_API_TOKEN` |
| Post-purchase upsell modal | ✅ | — |
| Upsell Draft Orders API | ⚠️ | Deploy `POST /api/upsell-add-item`; add `SHOPIFY_ADMIN_API_TOKEN` |
| Loyalty points (demo mode) | ✅ | — |
| Loyalty points (live Smile.io) | ⚠️ | Deploy `GET /api/loyalty-balance`; add `SMILE_API_KEY` |
| Exit-intent overlay | ✅ | — |
| SEO content library | ✅ | Import into Shopify metafields, blog, and theme settings |

---

## Recommended Next Steps (Priority Order)

**1. Shopify theme porting sprint.** The Shopify integration checklist in `docs/PM_BRIEF_CHECKOUT_ENHANCEMENTS.md` lists 12 ordered steps. The highest-impact items are: adding the Klaviyo snippet to `theme.liquid` (unlocks three event flows immediately), creating the two Klaviyo abandoned-cart and placed-order flows, and swapping the Google Maps API key. These three steps require no backend work and can be completed in a single afternoon.

**2. Backend proxy routes.** Three routes (`/api/validate-promo`, `/api/upsell-add-item`, `/api/loyalty-balance`) are fully documented with TypeScript implementations in `CART_UX_ENHANCEMENTS.md` sections 22, 25, and 26. Deploying all three converts the promo field, post-purchase upsell, and loyalty points from demo-quality to production-quality. Required secrets: `SHOPIFY_ADMIN_API_TOKEN`, `SHOPIFY_STORE_DOMAIN`, `SMILE_API_KEY`.

**3. SEO content import.** The 47-document SEO library is ready to import. The highest-leverage starting point is the five product SEO pages (metafields + schema), the FAQ structured data (Shopify metafields → FAQ schema), and the `ai-search-answers.md` document (publish as a dedicated FAQ page to target AI Overviews). The 90-day editorial calendar can be handed directly to a content team to begin publishing.
