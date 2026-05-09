# Luma Daily — Checkout & Cart UX Enhancements: PM Brief

**Date:** May 8, 2026  
**Branch:** `feat/cart-enhancements` — `SimonShaun2/luma-daily`  
**Prepared by:** Engineering / Design  
**For:** Product Manager  

---

## Executive Summary

Over the course of this sprint, 28 discrete checkout and cart UX enhancements were designed, prototyped, and validated in the Manus sandbox environment. All code is committed to `feat/cart-enhancements` on GitHub. The full working implementation lives in `client/src/pages/Home.tsx`; every pattern is documented with copy-paste-ready code in `docs/CART_UX_ENHANCEMENTS.md` (sections 1–28), written explicitly for Codex to port directly into Shopify's `checkout.liquid` and the Shopify theme.

The enhancements span five functional areas: **cart drawer micro-interactions**, **checkout form UX**, **payment step polish**, **post-order retention**, and **abandonment recovery**. Each feature is either fully self-contained in the frontend (no backend required) or ships with a documented backend proxy pattern and the required Shopify Admin API calls.

---

## What Is Committed to GitHub

The following table maps each section of `CART_UX_ENHANCEMENTS.md` to its feature, Shopify-readiness status, and any backend secrets required before going live.

| # | Feature | Shopify-Ready? | Backend Required | Secrets Needed |
|---|---------|:--------------:|:----------------:|----------------|
| 1 | ATC button loading / success states | ✅ Drop-in | No | — |
| 2 | Cart drawer success banner (slide-in) | ✅ Drop-in | No | — |
| 3 | New cart item slide-in animation | ✅ Drop-in | No | — |
| 4 | Remove item shake + slide-out | ✅ Drop-in | No | — |
| 5 | Quantity change price flash | ✅ Drop-in | No | — |
| 6 | Cart badge pop on count increase | ✅ Drop-in | No | — |
| 7 | Free-shipping progress bar → unlocked banner | ✅ Drop-in | No | — |
| 8 | GWP tier at $75 | ✅ Drop-in | No | — |
| 9 | Checkout button glow pulse at $50 | ✅ Drop-in | No | — |
| 10 | Sticky checkout footer on mobile | ✅ Drop-in | No | — |
| 11 | CheckoutModal inline form validation | ✅ Drop-in | No | — |
| 12 | Confirmation email capture (receipt + 10% off) | ✅ Drop-in | No (Klaviyo SDK) | — |
| 13 | sessionStorage form persistence | ✅ Drop-in | No | — |
| 14 | Card number formatter + focus chaining | ✅ Drop-in | No | — |
| 15 | Klaviyo email capture integration | ✅ Drop-in | No (Klaviyo SDK) | `KLAVIYO_WEBHOOK_URL` in theme settings |
| 16 | Card network icon detector (Visa/MC/Amex/Discover) | ✅ Drop-in | No | — |
| 17 | Google Maps Places Autocomplete on address field | ⚠️ Key swap needed | No | Replace Manus proxy key with `GOOGLE_MAPS_API_KEY` |
| 18 | Klaviyo "Checkout Started" event | ✅ Drop-in | No (Klaviyo SDK) | Klaviyo Flow setup required |
| 19 | Klaviyo "Placed Order" event | ✅ Drop-in | No (Klaviyo SDK) | Klaviyo Flow setup required |
| 20 | Order summary mini-badge on step headers | ✅ Drop-in | No | — |
| 21 | Collapsible promo code field (local fallback) | ✅ Drop-in | No | — |
| 22 | Shopify Discount Codes API validation | ⚠️ Proxy needed | Yes (`POST /api/validate-promo`) | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_API_TOKEN` |
| 23 | Referral share row on confirmation screen | ✅ Drop-in | No | — |
| 24 | Post-purchase upsell modal (30% off, 3-min timer) | ✅ Drop-in | No | — |
| 25 | Shopify Draft Orders API — upsell Accept | ⚠️ Proxy needed | Yes (`POST /api/upsell-add-item`) | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_API_TOKEN` |
| 26 | Loyalty points balance card on confirmation | ✅ Drop-in (demo) | Yes for live data (`GET /api/loyalty-balance`) | `SMILE_API_KEY` |
| 27 | Redeem points row in Order Summary | ✅ Drop-in (demo) | Yes for live deduction | `SMILE_API_KEY` |
| 28 | Exit-intent overlay with LUMA10 + email capture | ✅ Drop-in | No (Klaviyo SDK) | — |

**Legend:** ✅ Drop-in = works immediately with no backend changes. ⚠️ = functional in demo mode with local fallback; requires one additional backend route or key swap before production.

---

## Feature Descriptions by Area

### Area 1 — Cart Drawer Micro-Interactions (Sections 1–10)

These ten enhancements are pure frontend CSS/React state changes. All CSS keyframe animations (`banner-slide-in`, `cart-item-enter`, `item-shake`, `item-slide-out`, `price-flash`, `badge-pop`, `checkout-glow-pulse`) are already committed to `client/src/index.css` and require no additional styling work. The patterns are designed to drop directly into the existing `CartContext.tsx` and the cart drawer component with minimal refactoring — each section of the doc provides the exact state declarations, handler logic, and JSX snippets needed.

The free-shipping progress bar (section 7) and GWP tier (section 8) use a `$50` and `$75` threshold respectively; both values should be confirmed against the live Shopify shipping settings before deployment. The GWP product handle (`luma-glow-sample`) should be replaced with the actual Shopify product handle.

### Area 2 — Checkout Form UX (Sections 11–15)

**Form validation** (section 11) blocks step advancement if any required field is empty or malformed, marks all fields as touched on submit, and validates on blur. The validation functions for both the shipping and payment steps are fully documented with regex patterns for email and ZIP.

**sessionStorage persistence** (section 13) restores the shipping form on modal reopen within the same browser session. Card number and CVV are explicitly excluded from storage for PCI compliance; the session key `luma_checkout_form` is cleared on order completion.

**Card formatter** (section 14) auto-inserts spaces every four digits, restricts input to digits, and chains focus automatically from card number → expiry → CVV. This is a self-contained input handler with no dependencies.

**Google Maps Autocomplete** (section 15) is the one feature that requires a key swap: the current implementation loads the Maps script via the Manus development proxy. Before deploying to Shopify, replace the proxy URL with a direct Google Maps JavaScript API call using a key restricted to the Shopify store domain in Google Cloud Console.

### Area 3 — Payment Step Polish (Sections 16–20)

**Card network detection** (section 16) inspects the first two digits of the card number on every keystroke and swaps the generic icon for inline Visa, Mastercard, Amex, or Discover SVGs. The full SVG paths are in `Home.tsx` and can be extracted into a shared component.

**Klaviyo "Checkout Started"** (section 18) and **"Placed Order"** (section 19) events both use the `_learnq` browser SDK already injected by the Shopify theme's Klaviyo snippet. No additional script loading is needed. The Klaviyo Flow setup steps are documented in each section: the "Checkout Started" flow should have a 1–4 hour delay and a filter to skip profiles that have since triggered "Placed Order."

**Order summary mini-badge** (section 20) is a small product avatar stack + live total that appears at the top of both the Shipping and Payment steps. It requires no new state — it reads directly from `cartItems` and `discountedTotal`.

### Area 4 — Post-Order Retention (Sections 21–27)

**Promo code field** (section 21) ships with a local fallback table (`LUMA10`, `LUMA15`, `LUMA20`, `WELCOME`) and an async path to `POST /api/validate-promo` (section 22). The backend proxy pattern for the Shopify Discount Codes API is fully documented, including the two-step lookup (discount code → price rule) needed to resolve `value_type` and `value`. This requires `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ADMIN_API_TOKEN` as environment secrets.

**Referral share row** (section 23) builds a `lumadaily.com/?ref=FIRSTNAME` link from the confirmed buyer's first name, with a Copy button (using `navigator.clipboard`) and a native Web Share button that renders only on supported devices.

**Post-purchase upsell modal** (section 24) appears 800ms after the confirmation step renders, showing the first product not already in the cart at 30% off. It includes a 3-minute countdown timer (section 23 of the doc) that turns red at 30 seconds and auto-dismisses at zero. The Accept button attempts `POST /api/upsell-add-item` (section 25) — which appends the line item to a Shopify Draft Order and calls the complete endpoint — and falls back to local cart state if the proxy is not yet deployed.

**Loyalty points balance card** (section 26) and **Redeem points row** (section 27) both use a `loyaltyPoints` state value fetched from `GET /api/loyalty-balance` (Smile.io REST API). In demo mode, the balance defaults to 150 points. The redemption rate is 100 points = $5 off (configurable via `POINTS_PER_DOLLAR`). A range slider lets the customer choose how many points to apply; the discount stacks on top of any active promo code. Server-side point deduction via `POST https://api.smile.io/v1/points_transactions` is documented but not yet wired.

### Area 5 — Abandonment Recovery (Section 28)

**Exit-intent overlay** (section 28) fires once per session when the cursor exits through the top edge of the viewport while the cart contains at least one item. It shows the item count, a copyable `LUMA10` promo badge, and an email capture field that calls `_learnq.identify` on submit. After submission, a success state confirms the code was sent and offers a "Return to my cart" CTA that re-opens the cart drawer. The overlay never fires again in the same session (`exitIntentShown` state).

---

## Backend Routes Required for Production

Three backend proxy routes are documented and ready to implement. All three follow the same pattern: a thin Express route that adds the Shopify Admin API token server-side and forwards the request, keeping secrets off the frontend.

| Route | Method | Purpose | Secrets |
|-------|--------|---------|---------|
| `/api/validate-promo` | `POST` | Validate promo code via Shopify Discount Codes API | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_API_TOKEN` |
| `/api/upsell-add-item` | `POST` | Append upsell line item to Draft Order + complete | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_API_TOKEN` |
| `/api/loyalty-balance` | `GET` | Fetch customer points balance from Smile.io | `SMILE_API_KEY` |

Full TypeScript implementations for all three routes are in `CART_UX_ENHANCEMENTS.md` sections 22, 25, and 26. To activate them, upgrade the project to `web-db-user` (which enables the Express backend), add the three secrets in Settings → Secrets, and register the routes in `server/index.ts`.

---

## Shopify Theme Integration Checklist

The following steps are required to port the frontend patterns into the live Shopify theme. Each item maps to a documented section in `CART_UX_ENHANCEMENTS.md`.

| Step | Action | Section Reference |
|------|--------|-------------------|
| 1 | Add Klaviyo onsite JS snippet to `layout/theme.liquid` before `</head>` | §13, §16, §18, §28 |
| 2 | Add `window.__LUMA_KLAVIYO_WEBHOOK__` Liquid variable to `theme.liquid` | §13 |
| 3 | Add `klaviyo_webhook_url` text field to theme settings schema | §13 |
| 4 | Create Klaviyo "Checkout Started" abandoned-cart flow (1–4h delay, Placed Order filter) | §16 |
| 5 | Create Klaviyo "Placed Order" flow to suppress abandoned-cart and credit revenue | §17 |
| 6 | Replace Manus Maps proxy URL with Google Maps JS API key (restricted to store domain) | §15 |
| 7 | Deploy `/api/validate-promo` backend route; add `SHOPIFY_ADMIN_API_TOKEN` secret | §20 |
| 8 | Deploy `/api/upsell-add-item` backend route; pass `draftOrderId` from order session | §24 |
| 9 | Deploy `/api/loyalty-balance` backend route; add `SMILE_API_KEY` secret | §25 |
| 10 | Wire Smile.io `POST /v1/points_transactions` to deduct redeemed points after order completion | §26 |
| 11 | Replace GWP product handle `luma-glow-sample` with live Shopify product handle | §8 |
| 12 | Confirm free-shipping threshold ($50) matches live Shopify shipping profile | §7 |

---

## Recommended Next Steps (Priority Order)

The following three items represent the highest-leverage actions to take immediately after this brief is reviewed.

**1. Deploy the three backend proxy routes.** The promo validation, upsell Draft Orders, and Smile.io loyalty routes are fully documented and require only the three secrets listed above. Until these are deployed, the promo field uses the local fallback table, the upsell Accept falls back to local cart state, and the loyalty balance shows 150 demo points. Deploying all three converts these features from demo-quality to production-quality in a single backend sprint.

**2. Set up the two Klaviyo flows.** The "Checkout Started" abandoned-cart flow and the "Placed Order" suppression filter are the highest-revenue-impact items in this entire set. The `_learnq.push` calls are already firing in the frontend; the flows just need to be created in Klaviyo Admin and pointed at the correct email templates.

**3. Swap the Google Maps API key.** This is a five-minute change in Google Cloud Console (create a key, restrict it to the Shopify domain, replace the proxy URL in `checkout.liquid`). Address autocomplete meaningfully reduces shipping form abandonment and is worth prioritising before the next traffic push.

---

## Files Changed in This Sprint

| File | Description |
|------|-------------|
| `client/src/pages/Home.tsx` | Full implementation of all 28 enhancements (3,653 net insertions) |
| `client/src/index.css` | CSS keyframe animations for cart micro-interactions |
| `docs/CART_UX_ENHANCEMENTS.md` | 1,399-line implementation guide with copy-paste code for all 28 sections |

All files are on `feat/cart-enhancements`. The branch is fully in sync with the live webdev sandbox as of commit `c22fe05`.
