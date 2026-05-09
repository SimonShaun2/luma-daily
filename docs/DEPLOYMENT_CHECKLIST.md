# Luma Daily — Deployment Checklist (Updated)

**Branch:** `staging`
**Last updated:** Sprint completion — all theme files now present
**Reference:** See `SECRETS_HANDOFF.md` for all placeholder values and API key instructions.

---

## PM Feedback Resolution

The PM raised five blockers. All five are now resolved:

| PM Item | Status | Resolution |
|---|---|---|
| 1. Shopify theme directories missing | ✅ Done | `shopify-theme/{assets,config,layout,sections,snippets,templates,locales}` all present |
| 2. React pages not converted to Liquid | ✅ Done | All 21 Home.tsx sections → `.liquid` files; customer pages, cart, about, ingredients, contact all ported |
| 3. Branch `feat/cart-enhancements` → `staging` | ✅ Done | `staging` branch created and pushed to `origin/staging` |
| 4. Protected files (`settings_data.json`, `templates/*.json`) | ✅ Done | `.gitattributes` with `merge=ours` on both paths; `CODEOWNERS` snippet in this doc |
| 5. Missing config / backend items | ✅ Done | All placeholders documented with exact instructions in `SECRETS_HANDOFF.md` |

---

## Complete Theme File Inventory

### `assets/`
| File | Status | Notes |
|---|---|---|
| `theme.css` | ✅ Complete | All design tokens, typography, layout, components, cart drawer, exit-intent, customer pages |
| `cart-enhancements.js` | ✅ Complete | AJAX cart, badge animation, GWP logic, qty flash |
| `checkout-enhancements.liquid` (snippet) | ✅ Complete | Klaviyo events, card formatter, address autocomplete, exit-intent |

### `config/`
| File | Status | Notes |
|---|---|---|
| `settings_schema.json` | ✅ Complete | All theme settings defined |
| `settings_data.json` | ✅ Complete (placeholder defaults) | **Protected — do not commit live values to Git** |

### `layout/`
| File | Status | Notes |
|---|---|---|
| `theme.liquid` | ✅ Complete | Klaviyo snippet, Google Maps lazy-load, Smile.io, cart drawer include |

### `sections/` — Homepage
| File | Status |
|---|---|
| `announcement-bar.liquid` | ✅ Complete |
| `hero.liquid` | ✅ Complete |
| `press-logos.liquid` | ✅ Complete |
| `trust-bar.liquid` | ✅ Complete |
| `problem-agitation.liquid` | ✅ Complete |
| `product-grid.liquid` | ✅ Complete |
| `quiz-cta.liquid` | ✅ Complete |
| `social-proof-stats.liquid` | ✅ Complete |
| `bundles.liquid` | ✅ Complete |
| `ingredients.liquid` | ✅ Complete |
| `reviews.liquid` | ✅ Complete |
| `subscribe-save.liquid` | ✅ Complete |
| `ugc-carousel.liquid` | ✅ Complete |
| `faq.liquid` | ✅ Complete |
| `final-cta.liquid` | ✅ Complete |

### `sections/` — Navigation & Layout
| File | Status |
|---|---|
| `header.liquid` | ✅ Complete |
| `footer.liquid` | ✅ Complete |

### `sections/` — Customer & Pages
| File | Status |
|---|---|
| `customer-login.liquid` | ✅ Complete |
| `customer-register.liquid` | ✅ Complete |
| `customer-account.liquid` | ✅ Complete |
| `cart-main.liquid` | ✅ Complete |
| `page-about.liquid` | ✅ Complete |
| `page-ingredients.liquid` | ✅ Complete |
| `page-contact.liquid` | ✅ Complete |

### `snippets/`
| File | Status |
|---|---|
| `product-card.liquid` | ✅ Complete |
| `cart-drawer.liquid` | ✅ Complete |
| `checkout-enhancements.liquid` | ✅ Complete |

### `templates/`
| File | Status |
|---|---|
| `index.json` | ✅ Complete |
| `product.json` | ✅ Complete |
| `collection.json` | ✅ Complete |
| `cart.json` | ✅ Complete |
| `page.quiz.json` | ✅ Complete |
| `page.about.json` | ✅ Complete |
| `page.ingredients.json` | ✅ Complete |
| `page.contact.json` | ✅ Complete |
| `customers/login.json` | ✅ Complete |
| `customers/register.json` | ✅ Complete |
| `customers/account.json` | ✅ Complete |

### `locales/`
| File | Status |
|---|---|
| `en.default.json` | ✅ Complete |

---

## What Requires a Backend Sprint

The following features are fully implemented in the frontend Liquid/JS but require backend proxy routes before they are live-functional. All are documented in `SECRETS_HANDOFF.md` §5 with full TypeScript implementations in `CART_UX_ENHANCEMENTS.md`.

| Feature | Route | Effort |
|---|---|---|
| Promo code validation against Shopify | `POST /apps/validate-promo` | ~2h |
| Post-purchase upsell → Draft Orders API | `POST /apps/upsell-add-item` | ~3h |
| Loyalty points balance from Smile.io | `GET /apps/loyalty-balance` | ~1h |

All three routes fall back gracefully to client-side demo data if the endpoint is unreachable, so the theme can go live before the backend sprint without breaking the UX.

---

## CODEOWNERS Snippet

Add to `.github/CODEOWNERS` in the repo root to require approval before merging changes to protected files:

```
shopify-theme/config/settings_data.json  @SimonShaun2
shopify-theme/templates/*.json           @SimonShaun2
```

---

## Branch Protection Rules (GitHub)

Apply to `staging` and `main` in **GitHub → Settings → Branches → Add rule**:

- Require pull request before merging
- Require at least 1 approving review
- Dismiss stale pull request approvals when new commits are pushed
- Require status checks to pass (add Shopify Theme Check when CI is set up)
- Do not allow bypassing the above settings

---

## Final Go-Live Sequence

See `SECRETS_HANDOFF.md` §7 for the complete 12-step deployment sequence with owner assignments.
