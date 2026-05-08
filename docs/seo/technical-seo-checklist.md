# Luma Daily Technical SEO Checklist

## Implemented

- Route-aware page titles for homepage, shop, quiz, product, brand, support, and policy routes.
- Meta descriptions written with structure/function supplement language only.
- Canonical tags for public routes on `https://takelumadaily.com`.
- Open Graph tags for share previews.
- Twitter summary card tags.
- Explicit `index,follow` robots meta for public pages and `noindex,nofollow` for unknown product/404 states.
- Static `robots.txt` that allows crawling and references the sitemap.
- Static `sitemap.xml` for primary pages and five core Luma products.

## QA Checks

- Confirm `takelumadaily.com/robots.txt` serves the generated file after deployment.
- Confirm `takelumadaily.com/sitemap.xml` is reachable and submitted in Google Search Console.
- Inspect rendered page source or browser DOM for one canonical tag per route.
- Use Google Rich Results Test separately for schema branches.
- Verify no disease claims appear in SEO titles or descriptions.

## Follow-Up

- Product data currently includes legacy Focus content in the React storefront. The sitemap intentionally focuses on the five current Luma formulas.
- Add a real Open Graph image at `client/public/og/luma-daily-og.jpg` before broad sharing.
