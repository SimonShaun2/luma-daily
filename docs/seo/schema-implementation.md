# Luma Daily Schema Implementation

## Implemented Schema

- `Organization` for Luma Wellness Group and Luma Daily brand identity.
- `WebSite` for the canonical storefront at `https://takelumadaily.com`.
- `Product` schema on product detail routes.
- `BreadcrumbList` on shop, product, article-style, and support routes.
- `FAQPage` schema on the homepage using compliant supplement FAQ language.
- `Article` schema support for future `/blog/:slug` routes.
- `CollectionPage` schema on `/shop`.

## Files

- `client/src/components/SchemaMarkup.tsx`
- `client/src/components/RouteSchema.tsx`
- `client/src/App.tsx`

## Compliance

Schema descriptions use structure/function wording only, such as “supports energy + focus” and “supports digestive wellness.”

Existing product detail body copy should be reviewed separately before launch because some legacy product data predates the current five-product Luma positioning.

## Validation

Use these tools after deployment:

- Google Rich Results Test
- Schema.org validator
- Google Search Console URL Inspection
