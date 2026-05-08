# GA4 Setup

## Recommended Setup

Create a GA4 web data stream for:

`https://takelumadaily.com`

## Events To Track

- `view_item`
- `add_to_cart`
- `begin_checkout`
- `purchase`
- `quiz_started`
- `quiz_completed`
- `ritual_recommended`
- `subscription_selected`

## Implementation Notes

- Do not hardcode a GA4 measurement ID until it is provided.
- If Shopify checkout owns final payment, confirm GA4 is also connected in Shopify admin.
- If the React storefront owns pre-checkout behavior, use env-based IDs and keep IDs out of source control.

## QA

- Use GA4 DebugView.
- Confirm add-to-cart and checkout events fire once.
- Confirm quiz events do not include health-sensitive free-text data.
