# Luma Daily SEO Notes

This repository is the React storefront for Luma Daily, not the Shopify Liquid theme repo. SEO implementation therefore lives in React route metadata, static public assets, and documentation.

## Domain

- Canonical production domain: `https://takelumadaily.com`
- Shopify store domain: `luma-daily.myshopify.com`

## Metadata Strategy

- `client/src/components/RouteSeo.tsx` maps routes to SEO metadata.
- `client/src/components/SeoHead.tsx` updates the document head for title, description, canonical, Open Graph, Twitter card, and robots tags.
- `client/src/lib/seo.ts` is the source of truth for site URL, brand naming, and compliant SEO copy.

## Compliance Guardrails

- Use structure/function language such as “supports energy + focus” and “supports restful sleep.”
- Avoid “cure,” “treat,” “prevent,” “diagnose,” disease names, and clinical outcome promises in metadata.

## Deployment Note

These changes must be deployed through the hosting path that serves `takelumadaily.com`. They do not create or publish a Shopify theme by themselves.
