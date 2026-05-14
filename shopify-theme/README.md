# Luma Daily Shopify Build

Premium soft-luxury Shopify theme foundation for Luma Daily, a gummy supplement brand with a cream, stone, and muted-gold editorial wellness direction.

This repository is a Shopify Online Store 2.0 theme implementation intended to stay Dawn-compatible while using custom Luma Daily sections, snippets, CSS, and minimal vanilla JavaScript.

## Brand Guardrails

- Use premium, calm, editorial wellness language.
- Use only structure/function claims, such as "supports daily wellness routines" or "helps maintain everyday balance."
- Do not make disease claims or imply treatment, prevention, cure, or diagnosis.
- Include the FDA disclaimer anywhere supplement benefits, product effects, or wellness claims are presented.
- Keep customer-facing copy clear, measured, and substantiated.

## Theme Architecture

The theme includes:

- `layout/theme.liquid` with Shopify head basics, `content_for_header`, Luma CSS/JS asset hooks, section groups, `content_for_layout`, cart drawer rendering, and a global FDA disclaimer note.
- `config/settings_schema.json` with brand palette, layout, cart, and compliance settings.
- `config/settings_data.json` with safe starter defaults.
- `locales/en.default.json` with reusable accessibility, cart, and compliance strings.
- Homepage, product, collection, quiz, bundle, cart drawer, and support page templates.
- Product metafield documentation and app integration placeholders for subscriptions, reviews, quiz, bundles, Klaviyo, and Shopify Inbox.
- Theme Check, deployment, app, QA, and Shopify admin setup documentation.

## Local Setup

Install Shopify CLI from Shopify's official instructions, authenticate to the development store, then run:

```bash
shopify theme dev --store your-store.myshopify.com
```

Run validation before pushing:

```bash
shopify theme check
```

For unpublished QA deploys only, see [docs/deployment.md](docs/deployment.md).

For Shopify admin setup after upload, see [docs/shopify-admin-setup.md](docs/shopify-admin-setup.md).

## Compliance Baseline

Default compliance copy is centralized in `locales/en.default.json`:

> These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.

Any future supplement claim copy should be reviewed against the QA checklist before preview or deployment.
