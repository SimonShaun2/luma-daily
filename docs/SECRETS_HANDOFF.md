# Luma Daily — Secrets & Configuration Handoff

**Branch:** `staging`
**Prepared by:** Engineering / AI Sprint
**Status:** All theme files are complete. This document lists every placeholder that must be populated before the theme goes live.

---

## How to Use This Document

Each row in the tables below maps a placeholder string found in the theme files to the exact value needed and where to obtain it. No placeholder should remain in the deployed theme. Work through each section in order — Shopify Admin settings first, then third-party API keys, then backend environment variables.

---

## 1. Shopify Theme Customizer Settings

These values are set in **Shopify Admin → Online Store → Themes → Customize**. They are stored in `config/settings_data.json` and **must not be committed to Git** (the file is protected via `.gitattributes`).

| Placeholder | Setting Path in Customizer | How to Obtain |
|---|---|---|
| `REPLACE_WITH_LOGO_IMAGE` | Header → Logo image | Upload brand logo (SVG or PNG, min 200px wide) via Customizer media picker |
| `REPLACE_WITH_MAIN_MENU` | Header → Navigation menu | Create a "Main menu" link list in **Admin → Navigation** |
| `REPLACE_WITH_FOOTER_MENU_1` | Footer → Column 1 menu | Create a "Shop" link list in **Admin → Navigation** |
| `REPLACE_WITH_FOOTER_MENU_2` | Footer → Column 2 menu | Create a "Company" link list in **Admin → Navigation** |
| `REPLACE_WITH_FOOTER_MENU_3` | Footer → Column 3 menu | Create a "Support" link list in **Admin → Navigation** |
| `REPLACE_WITH_LEGAL_MENU` | Footer → Legal links menu | Create a "Legal" link list with Privacy Policy, Terms, Refund Policy pages |
| `REPLACE_WITH_INSTAGRAM_URL` | Footer → Instagram URL | Your brand's Instagram profile URL |
| `REPLACE_WITH_TIKTOK_URL` | Footer → TikTok URL | Your brand's TikTok profile URL |
| `REPLACE_WITH_FREE_SHIPPING_THRESHOLD` | Cart → Free shipping threshold | Set to `75` (dollars) or your current threshold |
| `REPLACE_WITH_SUBSCRIPTION_PORTAL_URL` | Account → Subscription portal URL | Recharge: `https://checkout.recharge.com/portal/{shop_id}` — find in Recharge Admin → Settings → Customer Portal |
| `REPLACE_WITH_SUPPORT_EMAIL` | Contact → Support email | Your customer support email address (e.g. `hello@lumadaily.com`) |
| `REPLACE_WITH_SUPPORT_HOURS` | Contact → Support hours | e.g. `Mon–Fri, 9am–5pm EST` |

---

## 2. Klaviyo

These values are injected into `layout/theme.liquid` and `snippets/checkout-enhancements.liquid`.

| Placeholder | File | How to Obtain |
|---|---|---|
| `REPLACE_WITH_KLAVIYO_PUBLIC_API_KEY` | `layout/theme.liquid` (line ~18) | Klaviyo Admin → Account → Settings → API Keys → Public API Key (6-character string, e.g. `Xk9aB2`) |

**Required Klaviyo Flows to activate:**

1. **Abandoned Checkout** — trigger: `Checkout Started` event (already fired by `checkout-enhancements.liquid`). Set delay to 1 hour. Suppress if `Placed Order` received within window.
2. **Post-Purchase Receipt + 10% Off** — trigger: `Placed Order` event (already fired). Include `{{ event.BillingEmail }}` as recipient. Attach `LUMA10` coupon.
3. **Winback / Re-engagement** — trigger: `Customer Email Captured` (exit-intent and confirmation screen). Delay 7 days. Send "We miss you" + `LUMA15`.

---

## 3. Google Maps (Address Autocomplete)

| Placeholder | File | How to Obtain |
|---|---|---|
| `REPLACE_WITH_GOOGLE_MAPS_API_KEY` | `snippets/checkout-enhancements.liquid` (line ~12) | Google Cloud Console → APIs & Services → Credentials → Create API Key. Enable **Maps JavaScript API** and **Places API**. Restrict key to your Shopify domain. |

---

## 4. Smile.io (Loyalty Points)

| Placeholder | File | How to Obtain |
|---|---|---|
| `REPLACE_WITH_SMILE_API_KEY` | Backend route `/apps/loyalty-balance` (see `CART_UX_ENHANCEMENTS.md` §26) | Smile.io Admin → Developer Tools → API Keys → Secret Key |

**Backend route to deploy** (`/apps/loyalty-balance`):
```js
// GET /apps/loyalty-balance?email=customer@example.com
// Proxies to: https://api.smile.io/v1/customers?email=...
// Required header: Authorization: Bearer SMILE_API_KEY
// Returns: { points: 320 }
```

---

## 5. Shopify Admin API (Promo Validation, Upsell, Draft Orders)

Three backend proxy routes must be deployed before the corresponding features go live. All require a **Shopify Admin API access token** with the scopes listed.

| Route | Method | Required Shopify Scope | Purpose |
|---|---|---|---|
| `/apps/validate-promo` | POST | `read_price_rules`, `read_discounts` | Validate promo code against Shopify discount codes |
| `/apps/upsell-add-item` | POST | `write_draft_orders` | Append upsell line item to draft order |
| `/apps/loyalty-balance` | GET | — (Smile.io, not Shopify) | Fetch customer loyalty points from Smile.io |

**How to create the Shopify Admin API token:**
1. Shopify Admin → Apps → Develop apps → Create an app → "Luma Daily Backend"
2. Configure Admin API scopes: `read_price_rules`, `read_discounts`, `write_draft_orders`
3. Install app → copy the **Admin API access token** (shown once)
4. Store as environment variable `SHOPIFY_ADMIN_API_TOKEN` in your backend host (Railway, Render, etc.)

**Store URL placeholder:**

| Placeholder | Where Used | Value |
|---|---|---|
| `REPLACE_WITH_SHOPIFY_STORE_DOMAIN` | All three backend routes | Your `.myshopify.com` domain, e.g. `luma-daily.myshopify.com` |
| `REPLACE_WITH_GWP_PRODUCT_HANDLE` | `snippets/cart-drawer.liquid` GWP banner logic | Shopify Admin → Products → find your GWP product → copy handle from URL |

---

## 6. Gift With Purchase (GWP) Product

The cart drawer shows a "Free gift unlocked!" banner when the cart total exceeds the GWP threshold. Two values must be set:

| Placeholder | File | Value |
|---|---|---|
| `REPLACE_WITH_GWP_PRODUCT_HANDLE` | `snippets/cart-drawer.liquid` | Product handle of the GWP item (e.g. `luma-daily-sample-pack`) |
| `REPLACE_WITH_GWP_THRESHOLD` | `config/settings_schema.json` → `gwp_threshold` | Dollar amount at which GWP unlocks (e.g. `100`) |

---

## 7. Deployment Sequence (Final Checklist)

Work through these steps in order. Do not go live until all rows are checked.

| # | Step | Owner | Status |
|---|---|---|---|
| 1 | Populate all Shopify Customizer settings (Section 1 above) | Shopify Admin | ☐ |
| 2 | Add Klaviyo public API key to `theme.liquid` | Dev | ☐ |
| 3 | Add Google Maps API key to `checkout-enhancements.liquid` | Dev | ☐ |
| 4 | Deploy three backend proxy routes with `SHOPIFY_ADMIN_API_TOKEN` | Backend Dev | ☐ |
| 5 | Deploy Smile.io loyalty proxy route with `SMILE_API_KEY` | Backend Dev | ☐ |
| 6 | Set `REPLACE_WITH_GWP_PRODUCT_HANDLE` and GWP threshold | Shopify Admin | ☐ |
| 7 | Create all required Navigation link lists in Shopify Admin | Shopify Admin | ☐ |
| 8 | Upload logo image via Theme Customizer | Design | ☐ |
| 9 | Activate three Klaviyo flows (Abandoned Checkout, Post-Purchase, Winback) | Marketing | ☐ |
| 10 | QA on Shopify staging theme (preview link) | QA | ☐ |
| 11 | Confirm `config/settings_data.json` is **not** tracked in Git | Dev | ☐ |
| 12 | Publish theme in Shopify Admin → Online Store → Themes | Shopify Admin | ☐ |

---

*This document should be treated as confidential. Do not commit API keys or tokens to Git. Use environment variables for all secrets in backend routes.*
