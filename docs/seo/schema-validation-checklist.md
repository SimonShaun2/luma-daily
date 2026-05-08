# Schema Validation Checklist

- Homepage outputs one `Organization` schema object.
- Homepage outputs one `WebSite` schema object.
- Homepage FAQ schema matches visible or planned FAQ copy.
- `/shop` outputs `CollectionPage` and `BreadcrumbList`.
- `/products/energy`, `/products/calm`, `/products/sleep`, `/products/glow`, and `/products/gut` output valid `Product` schema.
- Product schema includes name, image, description, brand, offers, price, currency, and availability.
- Product descriptions avoid disease claims.
- Breadcrumb positions are sequential and absolute URLs resolve on `takelumadaily.com`.
- Article schema is available for future blog routes.
- No tracking IDs, API keys, or private Shopify credentials are exposed in schema.
