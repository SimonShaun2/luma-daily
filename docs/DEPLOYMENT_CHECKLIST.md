# Luma Daily — Shopify Deployment Readiness Checklist

**Date:** May 8, 2026  
**Branch:** `staging` — `SimonShaun2/luma-daily`  
**Status:** All five PM items addressed. See section-by-section status below.

---

## PM Item 1 — Shopify Theme File Structure ✅ RESOLVED

The `shopify-theme/` directory now exists on the `staging` branch with all seven required subdirectories populated.

```
shopify-theme/
├── assets/
│   └── cart-enhancements.js       ← ATC animations, AJAX cart, GWP, shipping bar
├── config/
│   ├── settings_schema.json       ← Theme settings definitions (all configurable values)
│   └── settings_data.json         ← Live values (PROTECTED — see Item 4)
├── layout/
│   └── theme.liquid               ← Master layout: fonts, Klaviyo SDK, Maps API, config injection
├── locales/
│   └── en.default.json            ← All UI strings (internationalisation-ready)
├── sections/
│   ├── announcement-bar.liquid    ← §1 Urgency bar + countdown timer
│   ├── hero.liquid                ← §3 Asymmetric hero + video player
│   ├── press-logos.liquid         ← §4 Scrolling press marquee
│   ├── trust-bar.liquid           ← §5 Four trust signals
│   ├── problem-agitation.liquid   ← §6 Pain point copy block
│   ├── product-grid.liquid        ← §7 Filter tabs + snap carousel + ATC
│   ├── quiz-cta.liquid            ← §8 Find My Ritual banner
│   ├── social-proof-stats.liquid  ← §9 Animated counters
│   ├── bundles.liquid             ← §10 Bundle carousel + ATC
│   ├── ingredients.liquid         ← §11 Ingredient grid
│   ├── reviews.liquid             ← §12 Review cards
│   ├── subscribe-save.liquid      ← §13 One-time vs subscribe comparison
│   ├── ugc-carousel.liquid        ← §14 UGC video reel
│   ├── faq.liquid                 ← §15 Accordion FAQ + FAQ schema JSON-LD
│   └── final-cta.liquid           ← §16 Full-width CTA banner
├── snippets/
│   ├── cart-drawer.liquid         ← CartDrawer component (all 10 micro-interactions)
│   └── checkout-enhancements.liquid ← Klaviyo events + exit-intent overlay
└── templates/
    ├── index.json                 ← Homepage section order
    ├── product.json               ← PDP sections
    ├── collection.json            ← Collection page sections
    └── page.quiz.json             ← Quiz page
```

**What is NOT yet in `shopify-theme/` and still needs to be created:**

| Missing file | Owner | Notes |
|---|---|---|
| `assets/theme.css` | Dev | Port `client/src/index.css` design tokens and all component CSS |
| `layout/password.liquid` | Dev | Required by Shopify for password-protected stores |
| `sections/header.liquid` | Dev | Navigation, cart icon, mobile hamburger |
| `sections/footer.liquid` | Dev | Four-column footer + newsletter input |
| `snippets/product-card.liquid` | Dev | Shared product card used by product-grid and bundles |
| `templates/customers/login.liquid` | Dev | Sign-in page |
| `templates/customers/register.liquid` | Dev | Register page |
| `templates/customers/account.liquid` | Dev | Account dashboard |
| `templates/page.about.json` | Dev | About page |
| `templates/page.ingredients.json` | Dev | Ingredients page |
| `templates/page.contact.json` | Dev | Contact page |
| `templates/cart.json` | Dev | Standalone cart page (fallback) |

---

## PM Item 2 — React → Liquid Conversion ✅ RESOLVED (partial)

`Home.tsx` is **not** Shopify-deployable as-is. The 15 homepage sections have been converted to Liquid section files (see Item 1 above). The conversion approach for each section is:

| React pattern | Shopify Liquid equivalent |
|---|---|
| `useState` / `useEffect` for UI state | Vanilla JS in `<script>` tags within each section file, or `assets/cart-enhancements.js` |
| `props` / component settings | `{% schema %}` settings blocks, read via `section.settings.*` |
| Dynamic product data from `PRODUCTS[]` array | `collections[section.settings.collection].products` Liquid loop |
| `CartContext` | AJAX `/cart.js`, `/cart/add.js`, `/cart/change.js` endpoints in `cart-enhancements.js` |
| Klaviyo `_learnq.push()` calls | Identical JS in `snippets/checkout-enhancements.liquid` |
| `IntersectionObserver` counters | Identical JS in `sections/social-proof-stats.liquid` |
| FAQ accordion | Identical JS in `sections/faq.liquid` |
| Countdown timer | Identical JS in `sections/announcement-bar.liquid` |

**Sections not yet converted to Liquid** (require a follow-up dev sprint):

| React component | Status | Notes |
|---|---|---|
| `CheckoutModal` | ⚠️ Not converted | Shopify's hosted checkout replaces this. Klaviyo events and exit-intent are ported to `snippets/checkout-enhancements.liquid`. Card formatter and sessionStorage persistence are not needed in Shopify checkout. |
| `QuizModal` | ⚠️ Stub only | `templates/page.quiz.json` exists; full quiz logic needs porting to `sections/quiz.liquid` with Liquid + JS |
| `CartDrawer` | ✅ Converted | `snippets/cart-drawer.liquid` + `assets/cart-enhancements.js` |
| `ProductDetailModal` | ⚠️ Not converted | Use Shopify's native PDP (`templates/product.json`) instead |
| Account dashboard | ⚠️ Not converted | Use Recharge customer portal for subscription management |

---

## PM Item 3 — Branch: `feat/cart-enhancements` → `staging` ✅ RESOLVED

The `staging` branch was created from `feat/cart-enhancements` and pushed to `origin/staging`. It is now live at:

```
https://github.com/SimonShaun2/luma-daily/tree/staging
```

**Recommended branch protection rules** (set in GitHub → Settings → Branches → Add rule for `staging`):

- Require pull request before merging (1 approver minimum)
- Require status checks to pass (add Shopify CLI theme check when available)
- Do not allow force pushes
- Do not allow deletions

---

## PM Item 4 — Protected Files ✅ RESOLVED

Both files are protected via `.gitattributes` in `shopify-theme/`:

```gitattributes
config/settings_data.json  merge=ours
templates/*.json           merge=ours
```

The `merge=ours` strategy means Git will never auto-merge changes into these files — any conflict requires a manual decision. This prevents a code push from overwriting merchant-configured theme settings or live template section order.

**Additional protection recommended in GitHub:**

Add a `CODEOWNERS` file at the repo root:

```
# These files require explicit approval from a Shopify admin before merge
shopify-theme/config/settings_data.json @SimonShaun2
shopify-theme/templates/*.json @SimonShaun2
```

**Current state of `config/settings_data.json`:** All sensitive values are set to `REPLACE_WITH_*` placeholders. No real API keys are committed. The file must be populated via Shopify Admin → Online Store → Themes → Customize before going live.

---

## PM Item 5 — Missing Config & Backend Items

The table below lists every outstanding configuration item, the exact location where it must be set, and the current status.

### Configuration Items (no backend code required)

| Item | Where to set | Current value | Status |
|---|---|---|---|
| **GWP product handle** | Shopify Admin → Online Store → Themes → Customize → Cart & Checkout → GWP product handle | `REPLACE_WITH_LIVE_PRODUCT_HANDLE` | ⚠️ Needs real handle |
| **Free-shipping threshold** | Same as above → Free shipping threshold | `50` (dollars) | ✅ Set to $50 — confirm with ops |
| **GWP threshold** | Same as above → GWP threshold | `75` (dollars) | ✅ Set to $75 — confirm with ops |
| **Klaviyo public key** | Same as above → Klaviyo → Klaviyo public API key | `REPLACE_WITH_KLAVIYO_PUBLIC_KEY` | ⚠️ Needs real key |
| **Klaviyo Flow webhook URL** | Same as above → Klaviyo → Flow webhook URL | `REPLACE_WITH_SHOPIFY_FLOW_WEBHOOK_URL` | ⚠️ Needs real URL |
| **Google Maps API key** | Same as above → Google Maps → API key | `REPLACE_WITH_GOOGLE_MAPS_API_KEY` | ⚠️ Needs real key (restrict to store domain) |
| **Smile.io API key** | Same as above → Smile.io → API key | `REPLACE_WITH_SMILE_API_KEY` | ⚠️ Needs real key |
| **Urgency bar end date** | Same as above → Promotions → Urgency bar end date | `2026-05-15T23:59:59` | ⚠️ Update before launch |
| **Exit-intent promo code** | Same as above → Promotions → Exit-intent promo code | `LUMA10` | ✅ Ready |

### Klaviyo Setup (no backend code required)

| Task | Instructions | Status |
|---|---|---|
| Add Klaviyo snippet to `theme.liquid` | Already done — `theme.liquid` loads `klaviyo.js` when `settings.klaviyo_public_key` is set | ✅ Done |
| Create "Abandoned Checkout" Flow | Klaviyo → Flows → Create Flow → Metric trigger: "Checkout Started" → 1h delay → email | ⚠️ Create in Klaviyo |
| Create "Placed Order" Flow | Klaviyo → Flows → Create Flow → Metric trigger: "Placed Order" → receipt email | ⚠️ Create in Klaviyo |
| Create "Receipt + 10% Off" Flow | Klaviyo → Flows → Create Flow → Webhook trigger (Shopify Flow) → email with LUMA10 | ⚠️ Create in Klaviyo + Shopify Flow |

### Backend Proxy Routes (requires a server sprint)

Three API proxy routes are documented in `docs/CART_UX_ENHANCEMENTS.md` sections 22, 25, and 26. All three have TypeScript implementations ready to copy. They require a Node.js/Edge function deployment (Shopify Functions, Vercel Edge, or a Shopify App proxy).

| Route | Method | Purpose | Required secrets | Section |
|---|---|---|---|---|
| `/api/validate-promo` | `POST` | Validates promo codes against Shopify Discount Codes API | `SHOPIFY_ADMIN_API_TOKEN`, `SHOPIFY_STORE_DOMAIN` | §22 |
| `/api/upsell-add-item` | `POST` | Appends upsell line item to a Shopify Draft Order | `SHOPIFY_ADMIN_API_TOKEN`, `SHOPIFY_STORE_DOMAIN` | §25 |
| `/api/loyalty-balance` | `GET` | Fetches customer points balance from Smile.io | `SMILE_API_KEY` | §26 |

Until these routes are deployed, all three features fall back gracefully: promo codes use the local `PROMO_FALLBACK` table, upsell Accept adds to local cart state, and loyalty points display a 150-point demo balance.

---

## Recommended Deployment Sequence

The following order minimises risk and allows each layer to be tested independently before the next is added.

| Step | Action | Branch | Estimated effort |
|---|---|---|---|
| 1 | Port `client/src/index.css` to `shopify-theme/assets/theme.css` | `staging` | 2h |
| 2 | Create `sections/header.liquid` and `sections/footer.liquid` | `staging` | 3h |
| 3 | Create `snippets/product-card.liquid` shared component | `staging` | 1h |
| 4 | Populate all `REPLACE_WITH_*` values in Shopify Admin Customize | Shopify Admin | 30m |
| 5 | Upload `shopify-theme/` to a Shopify development theme via Shopify CLI | Shopify CLI | 1h |
| 6 | QA all 15 homepage sections in the Shopify theme preview | Shopify Admin | 2h |
| 7 | Create two Klaviyo flows (Abandoned Checkout + Placed Order) | Klaviyo | 1h |
| 8 | Deploy three backend proxy routes | Server | 4h |
| 9 | Promote development theme to live | Shopify Admin | 15m |
| 10 | Monitor Klaviyo event stream and cart conversion rate for 48h | Analytics | Ongoing |
