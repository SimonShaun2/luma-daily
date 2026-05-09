# Cart UX Enhancements — Implementation Guide for Codex

> **Branch:** `feat/cart-enhancements`  
> **CSS keyframes:** already added to `client/src/index.css`  
> **Target files:** `client/src/contexts/CartContext.tsx` + the cart drawer component

---

## Overview

These enhancements were prototyped and validated in the Manus design sandbox. All CSS animations are already committed to `index.css`. This document describes the React state logic Codex needs to add to the existing Shopify-backed `CartContext` and cart drawer component.

---

## 1. ATC Button Loading / Success States

**Goal:** Each "Add to Cart" button cycles through `idle → loading → success → idle` independently.

### State to add to `CartContext`

```ts
// In CartContextType interface
addingId: string | null;   // product handle currently being added
successId: string | null;  // product handle that just succeeded (cleared after 1.4s)
```

### Logic in `addItem`

```ts
// Wrap the existing addItem call:
setAddingId(input.handle);
try {
  // ... existing Shopify addCartLines call ...
  setAddingId(null);
  setSuccessId(input.handle);
  setTimeout(() => setSuccessId(null), 1400);
} catch (e) {
  setAddingId(null);
  throw e;
}
```

### ATC button JSX pattern

```tsx
const isAdding   = addingId === product.handle;
const isSuccess  = successId === product.handle;

<button
  onClick={() => addItem({ handle: product.handle, variantId: product.variantId, ... })}
  disabled={isAdding || isSuccess}
  className={`btn-primary ... ${isSuccess ? 'bg-green-600' : ''}`}
>
  {isAdding  && <span className="spinner-icon mr-2">⟳</span>}
  {isSuccess && <span className="success-pop mr-2">✓</span>}
  {isAdding ? 'Adding...' : isSuccess ? 'Added!' : 'Add to Cart'}
</button>
```

---

## 2. Cart Drawer Success Banner

**Goal:** A green slide-in banner at the top of the cart drawer shows the product name for 2.5s after it is added.

### State to add to `CartContext`

```ts
lastAddedName: string | null;  // product name of the last item added (cleared after 2.5s)
```

### Logic in `addItem`

```ts
setLastAddedName(input.name);
setTimeout(() => setLastAddedName(null), 2500);
```

### Cart drawer header JSX pattern

```tsx
{lastAddedName && (
  <div className="banner-slide-in flex items-center gap-2 bg-green-100 text-green-800 rounded-lg px-3 py-2 mb-3 text-sm font-semibold">
    <span className="success-pop inline-flex w-5 h-5 rounded-full bg-green-600 text-white items-center justify-center">✓</span>
    {lastAddedName} added to your ritual!
  </div>
)}
```

---

## 3. New Cart Item Slide-In Animation

**Goal:** Items animate in with a spring entrance when first added to the cart.

### Logic in cart drawer

```tsx
// Track which item IDs were present on the previous render
const [prevItemIds, setPrevItemIds] = useState<Set<string>>(new Set());
const newItemIds = new Set(items.filter(i => !prevItemIds.has(i.id)).map(i => i.id));
useEffect(() => {
  if (items.length > 0) setPrevItemIds(new Set(items.map(i => i.id)));
}, [items]);

// Apply class to new items
<div key={item.id} className={newItemIds.has(item.id) ? 'cart-item-enter' : ''}>
  {/* cart item content */}
</div>
```

---

## 4. Remove Item — Shake + Slide-Out

**Goal:** Clicking the trash icon shakes the item for 450ms, then slides it out before calling `removeItem`.

### State in cart drawer component

```ts
const [shakingId, setShakingId]   = useState<string | null>(null);
const [removingId, setRemovingId] = useState<string | null>(null);
```

### Handler

```ts
const handleRemove = (lineId: string) => {
  setShakingId(lineId);
  setTimeout(() => {
    setShakingId(null);
    setRemovingId(lineId);
    setTimeout(() => {
      removeItem(lineId);
      setRemovingId(null);
    }, 380);
  }, 450);
};
```

### Item wrapper class

```tsx
<div
  className={`
    ${shakingId === item.lineId ? 'item-shake' : ''}
    ${removingId === item.lineId ? 'item-slide-out' : ''}
  `}
>
```

---

## 5. Quantity Change Price Flash

**Goal:** The price display flashes green briefly when quantity is changed.

### State in cart drawer component

```ts
const [flashId, setFlashId] = useState<string | null>(null);
```

### Handler

```ts
const handleQtyChange = (lineId: string, qty: number) => {
  updateQuantity(lineId, qty);
  setFlashId(lineId);
  setTimeout(() => setFlashId(null), 600);
};
```

### Price element class

```tsx
<span className={flashId === item.lineId ? 'price-flash' : ''}>
  ${(item.price * item.quantity).toFixed(2)}
</span>
```

---

## 6. Cart Badge Pop on Count Increase

**Goal:** The cart icon count badge scales up with a spring-pop animation each time the count increases.

### State in nav component

```ts
const [badgePop, setBadgePop] = useState(false);
const prevCountRef = useRef(totalItems);
useEffect(() => {
  if (totalItems > prevCountRef.current) {
    setBadgePop(true);
    setTimeout(() => setBadgePop(false), 500);
  }
  prevCountRef.current = totalItems;
}, [totalItems]);
```

### Badge element

```tsx
{totalItems > 0 && (
  <span
    key={badgePop ? 'pop' : 'idle'}
    className={`badge ${badgePop ? 'badge-pop' : ''}`}
  >
    {totalItems}
  </span>
)}
```

---

## 7. Free-Shipping Progress Bar → Unlocked Banner

**Goal:** The progress bar in the cart footer swaps to a green "🎉 Free shipping unlocked!" banner when `subtotal >= 50`.

```tsx
{subtotal < 50 ? (
  <div>
    <p>Add ${(50 - subtotal).toFixed(2)} for free shipping</p>
    <div className="progress-bar" style={{ width: `${(subtotal / 50) * 100}%` }} />
  </div>
) : (
  <div className="banner-slide-in free-shipping-banner">
    🎉 Free shipping unlocked!
  </div>
)}
```

---

## 8. GWP Tier at $75

**Goal:** When `subtotal >= 75`, show a "🎁 Free Luma Glow Sample added!" banner. Between $50 and $75, show a secondary progress bar.

### State in cart drawer component

```ts
const gwpUnlocked = subtotal >= 75;
const [gwpBannerVisible, setGwpBannerVisible] = useState(false);
const prevGwpRef = useRef(gwpUnlocked);
useEffect(() => {
  if (!prevGwpRef.current && gwpUnlocked) setGwpBannerVisible(true);
  if (prevGwpRef.current && !gwpUnlocked) setGwpBannerVisible(false);
  prevGwpRef.current = gwpUnlocked;
}, [gwpUnlocked]);
```

### JSX

```tsx
{/* Between $50 and $75 — secondary progress bar */}
{subtotal >= 50 && !gwpUnlocked && (
  <div>
    <p>Add ${(75 - subtotal).toFixed(2)} for a free sample</p>
    <div className="progress-bar" style={{ width: `${((subtotal - 50) / 25) * 100}%` }} />
  </div>
)}

{/* GWP banner — slides in at $75 */}
{gwpBannerVisible && (
  <div className="banner-slide-in gwp-banner">
    🎁 Free Luma Glow Sample added!
    <button onClick={() => setGwpBannerVisible(false)}>✕</button>
  </div>
)}
```

---

## 9. Checkout Button Glow Pulse

**Goal:** The Checkout button fires a warm amber glow once when `subtotal` crosses $50 (shipping becomes free).

### State in cart drawer component

```ts
const shipping = subtotal >= 50 ? 0 : 5.99;
const [glowPulse, setGlowPulse] = useState(false);
const prevShippingRef = useRef(shipping);
useEffect(() => {
  if (prevShippingRef.current > 0 && shipping === 0) {
    setGlowPulse(true);
    setTimeout(() => setGlowPulse(false), 1700);
  }
  prevShippingRef.current = shipping;
}, [shipping]);
```

### Checkout button

```tsx
<button
  key={glowPulse ? 'glow' : 'idle'}
  onClick={checkout}
  className={`btn-primary ${glowPulse ? 'checkout-glow-pulse' : ''}`}
>
  Checkout — ${(subtotal + shipping).toFixed(2)}
</button>
```

---

## 10. Sticky Checkout Footer on Mobile

**Goal:** The Checkout button is always visible at the bottom of the cart drawer regardless of scroll position.

### Structure

```tsx
<SheetContent className="flex flex-col">
  {/* Scrollable items */}
  <div className="flex-1 overflow-y-auto">
    {/* cart items */}
  </div>

  {/* Scrollable totals */}
  <div className="px-5 py-4 space-y-3 overflow-y-auto max-h-[40vh]">
    {/* progress bars, GWP banners, totals */}
  </div>

  {/* Sticky checkout — always at bottom */}
  <div className="sticky bottom-0 bg-white border-t px-5 py-4 space-y-3">
    {/* trust badges */}
    <button className="btn-primary w-full">Checkout</button>
    {/* payment icons */}
  </div>
</SheetContent>
```

---

*All CSS classes referenced above are defined in `client/src/index.css` in the "Cart UX Enhancement Animations" section.*

---

## 9. CheckoutModal Form Validation

**Goal:** Block step advancement if required fields are empty or invalid. Show inline red-border + error message per field on blur or on submit attempt.

### State to add to `CheckoutModal`

```ts
const [touched, setTouched] = useState<Record<string, boolean>>({});
const [formErrors, setFormErrors] = useState<Record<string, string>>({});
const [confirmEmail, setConfirmEmail] = useState("");
const [confirmEmailSubmitted, setConfirmEmailSubmitted] = useState(false);
const [confirmEmailError, setConfirmEmailError] = useState("");
```

### Validation functions

```ts
const validateShipping = (f: typeof form) => {
  const errs: Record<string, string> = {};
  if (!f.email.trim()) errs.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = "Enter a valid email";
  if (!f.firstName.trim()) errs.firstName = "First name is required";
  if (!f.lastName.trim()) errs.lastName = "Last name is required";
  if (!f.address.trim()) errs.address = "Street address is required";
  if (!f.city.trim()) errs.city = "City is required";
  if (!f.state.trim()) errs.state = "State is required";
  if (!f.zip.trim()) errs.zip = "ZIP is required";
  else if (!/^\d{5}(-\d{4})?$/.test(f.zip.trim())) errs.zip = "Enter a valid ZIP";
  return errs;
};

const validatePayment = (f: typeof form) => {
  const errs: Record<string, string> = {};
  if (!f.nameOnCard.trim()) errs.nameOnCard = "Name on card is required";
  if (!f.cardNumber.trim()) errs.cardNumber = "Card number is required";
  else if (f.cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter a valid 16-digit card number";
  if (!f.expiry.trim()) errs.expiry = "Expiry is required";
  else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.expiry.trim())) errs.expiry = "Use MM / YY format";
  if (!f.cvv.trim()) errs.cvv = "CVV is required";
  else if (!/^\d{3,4}$/.test(f.cvv.trim())) errs.cvv = "Enter 3 or 4 digits";
  return errs;
};
```

### CTA button onClick guard

```tsx
onClick={() => {
  if (step === "shipping") {
    const errs = validateShipping(form);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      setTouched({ email: true, firstName: true, lastName: true, address: true, city: true, state: true, zip: true });
      return;
    }
    setFormErrors({});
  }
  if (step === "payment") {
    const errs = validatePayment(form);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      setTouched(t => ({ ...t, nameOnCard: true, cardNumber: true, expiry: true, cvv: true }));
      return;
    }
    setFormErrors({});
  }
  // advance to next step...
}}
```

### Input field pattern (apply to each field)

```tsx
<input
  type="text"
  placeholder="Email address"
  value={form.email}
  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
  onBlur={() => setTouched(t => ({ ...t, email: true }))}
  className={`w-full border rounded-lg px-4 py-3 text-sm ... ${
    touched.email && formErrors.email
      ? 'border-red-400 focus:border-red-400'
      : 'border-[oklch(0.88_0.02_80)] focus:border-[oklch(0.58_0.13_45)]'
  }`}
/>
{touched.email && formErrors.email && (
  <span className="text-red-500 text-xs mt-1 block">{formErrors.email}</span>
)}
```

### Reset on modal close

```ts
const handleReset = () => {
  setStep("summary");
  setForm({ /* all fields empty */ });
  setTouched({});
  setFormErrors({});
  setConfirmEmail("");
  setConfirmEmailSubmitted(false);
  setConfirmEmailError("");
};
```

---

## 10. Confirmation Email Capture

**Goal:** After order confirmation, offer "Get your receipt + 10% off your next order" email capture with validation and success state.

### JSX pattern (insert above the upsell row in the confirmation step)

```tsx
<div className="bg-[oklch(0.975_0.015_80)] rounded-xl border border-[oklch(0.88_0.02_80)] p-4 space-y-3">
  {confirmEmailSubmitted ? (
    <div className="flex items-center gap-2 text-[oklch(0.42_0.08_150)]">
      <div className="w-6 h-6 rounded-full bg-[oklch(0.94_0.04_150)] flex items-center justify-center shrink-0">
        <Check size={13} strokeWidth={3} />
      </div>
      <span className="text-sm font-body font-semibold">Check your inbox!</span>
    </div>
  ) : (
    <>
      <div>
        <p className="text-sm font-display font-bold text-[oklch(0.22_0.04_55)]">
          Get your receipt + 10% off your next order
        </p>
        <p className="text-xs font-body text-[oklch(0.52_0.04_55)] mt-0.5">
          We'll send your order confirmation and an exclusive discount.
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={confirmEmail}
          onChange={e => { setConfirmEmail(e.target.value); setConfirmEmailError(""); }}
          className={`flex-1 border rounded-lg px-3 py-2.5 text-sm ... ${
            confirmEmailError ? 'border-red-400' : 'border-[oklch(0.88_0.02_80)]'
          }`}
        />
        <button
          onClick={() => {
            if (!confirmEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(confirmEmail)) {
              setConfirmEmailError("Enter a valid email");
              return;
            }
            setConfirmEmailSubmitted(true);
            // TODO: wire to Klaviyo identify() or POST to /api/email-capture
          }}
          className="shrink-0 bg-[oklch(0.58_0.13_45)] text-white text-sm font-semibold rounded-lg px-4 py-2.5"
        >
          Send
        </button>
      </div>
      {confirmEmailError && <span className="text-red-500 text-xs block">{confirmEmailError}</span>}
    </>
  )}
</div>
```

**Shopify / Klaviyo integration note:** On `setConfirmEmailSubmitted(true)`, call `klaviyo.identify({ email: confirmEmail })` or POST to a Shopify Flow webhook to trigger the receipt + discount email flow.

---

## 11. sessionStorage Form Persistence

**Goal:** Restore shipping form fields when the user reopens the checkout modal within the same browser session. Card number and CVV are intentionally excluded for PCI compliance.

### Implementation

```ts
const SS_KEY = "luma_checkout_form";

// Lazy initializer — reads from sessionStorage on first render
const [form, setForm] = useState(() => {
  try {
    const saved = sessionStorage.getItem(SS_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { email: "", firstName: "", lastName: "", address: "", city: "", state: "", zip: "", cardNumber: "", expiry: "", cvv: "", nameOnCard: "" };
});

// Persist on every change, strip sensitive fields
useEffect(() => {
  const { cardNumber, cvv, ...safe } = form;
  try {
    sessionStorage.setItem(SS_KEY, JSON.stringify({ ...safe, cardNumber: "", cvv: "" }));
  } catch { /* ignore */ }
}, [form]);
```

### Reset on order completion

```ts
const handleReset = () => {
  // ...existing resets...
  try { sessionStorage.removeItem(SS_KEY); } catch { /* ignore */ }
};
```

---

## 12. Card Number Formatter + Focus Chaining

**Goal:** Auto-insert spaces every 4 digits (`1234 5678 9012 3456`), restrict to digits only, and automatically move focus to Expiry when 16 digits are entered, then to CVV when Expiry is complete.

### Refs

```ts
const expiryRef = useRef<HTMLInputElement>(null);
const cvvRef    = useRef<HTMLInputElement>(null);
```

### Card number input

```tsx
<input
  type="text"
  inputMode="numeric"
  placeholder="1234 5678 9012 3456"
  value={form.cardNumber}
  maxLength={19}
  onChange={e => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setForm(f => ({ ...f, cardNumber: formatted }));
    if (digits.length === 16) setTimeout(() => expiryRef.current?.focus(), 0);
  }}
  className="... tracking-widest"
/>
```

### Expiry input (auto-format MM / YY + advance to CVV)

```tsx
<input
  ref={expiryRef}
  type="text"
  inputMode="numeric"
  placeholder="MM / YY"
  value={form.expiry}
  maxLength={7}
  onChange={e => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    let formatted = raw;
    if (raw.length >= 3) formatted = raw.slice(0, 2) + " / " + raw.slice(2);
    else if (raw.length === 2 && form.expiry.length < 2) formatted = raw + " / ";
    setForm(f => ({ ...f, expiry: formatted }));
    if (raw.length === 4) setTimeout(() => cvvRef.current?.focus(), 0);
  }}
/>
```

### CVV input (digits only)

```tsx
<input
  ref={cvvRef}
  type="text"
  inputMode="numeric"
  placeholder="CVV"
  value={form.cvv}
  maxLength={4}
  onChange={e => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setForm(f => ({ ...f, cvv: digits }));
  }}
/>
```

---

## 13. Klaviyo Email Capture Integration

**Goal:** On confirmation email submit, call `klaviyo.identify()` via the Klaviyo browser SDK (already loaded by the Shopify theme) and optionally POST to a Shopify Flow webhook for the receipt + 10% off discount automation.

### Helper function

```ts
const klaviyoCapture = (email: string) => {
  try {
    // Klaviyo browser SDK (_learnq is injected by the Shopify theme snippet)
    if (typeof window !== "undefined" && (window as any)._learnq) {
      (window as any)._learnq.push(["identify", { $email: email }]);
    }
    // Optional: POST to Shopify Flow webhook
    // Set window.__LUMA_KLAVIYO_WEBHOOK__ in theme.liquid via Liquid global JS:
    //   <script>window.__LUMA_KLAVIYO_WEBHOOK__ = "{{ settings.klaviyo_webhook_url }}";</script>
    const webhookUrl = (window as any).__LUMA_KLAVIYO_WEBHOOK__;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "checkout_confirmation", discount: "LUMA10" }),
      }).catch(() => { /* silent fail */ });
    }
  } catch { /* silent fail */ }
};
```

### Shopify theme setup

1. In **Shopify Admin → Online Store → Themes → Edit code**, open `layout/theme.liquid`.
2. Add the Klaviyo onsite JS snippet (from Klaviyo dashboard) before `</head>`.
3. Add a global JS variable to expose the Flow webhook URL:
   ```liquid
   <script>
     window.__LUMA_KLAVIYO_WEBHOOK__ = "{{ settings.klaviyo_webhook_url | escape }}";
   </script>
   ```
4. In **Theme settings**, add a `klaviyo_webhook_url` text field and paste the Shopify Flow webhook URL.
5. In **Shopify Flow**, create a trigger on the webhook, then add a Klaviyo "Add to list" or "Track event" action to send the receipt + discount email.

---

## 14. Card Network Icon Detector

**Goal:** Inspect the first 1–2 digits of the card number as the user types and swap the generic `CreditCard` icon for a Visa / Mastercard / Amex / Discover SVG badge in real-time.

### Detection logic

```ts
const detectCardNetwork = (num: string): "visa" | "mastercard" | "amex" | "discover" | null => {
  const d = num.replace(/\s/g, "");
  if (/^4/.test(d)) return "visa";
  if (/^5[1-5]|^2[2-7]/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  if (/^6(?:011|5)/.test(d)) return "discover";
  return null;
};
const cardNetwork = detectCardNetwork(form.cardNumber); // re-derived on every render
```

### JSX — icon slot inside the card number input wrapper

```tsx
<span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
  {cardNetwork === "visa"       && <VisaSVG />}
  {cardNetwork === "mastercard" && <MastercardSVG />}
  {cardNetwork === "amex"       && <AmexSVG />}
  {cardNetwork === "discover"   && <DiscoverSVG />}
  {!cardNetwork && <CreditCard size={18} className="text-[oklch(0.72_0.04_55)]" />}
</span>
```

Each `*SVG` is an inline `<svg>` element with the brand's official colours. See `Home.tsx` for the full paths.

---

## 15. Google Maps Places Autocomplete on Street Address

**Goal:** When the user focuses the Street Address field on the Shipping step, attach a Google Maps Places Autocomplete widget that auto-fills city, state, and ZIP on selection.

### Implementation (useEffect inside CheckoutModal)

```ts
useEffect(() => {
  if (step !== "shipping") return;
  let autocomplete: google.maps.places.Autocomplete | null = null;
  let listener: google.maps.MapsEventListener | null = null;

  const initAutocomplete = () => {
    if (!addressRef.current || !window.google?.maps?.places) return;
    autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" },
      fields: ["address_components", "formatted_address"],
    });
    listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete!.getPlace();
      if (!place.address_components) return;
      let streetNumber = "", route = "", city = "", state = "", zip = "";
      for (const comp of place.address_components) {
        const t = comp.types;
        if (t.includes("street_number")) streetNumber = comp.long_name;
        else if (t.includes("route")) route = comp.long_name;
        else if (t.includes("locality")) city = comp.long_name;
        else if (t.includes("administrative_area_level_1")) state = comp.short_name;
        else if (t.includes("postal_code")) zip = comp.long_name;
      }
      setForm(f => ({
        ...f,
        address: streetNumber ? `${streetNumber} ${route}` : (place.formatted_address ?? f.address),
        city, state, zip,
      }));
      setTouched(t => ({ ...t, address: true, city: true, state: true, zip: true }));
    });
  };

  if (window.google?.maps?.places) {
    initAutocomplete();
  } else {
    // Lazy-load the Maps script (uses the Manus proxy — no API key needed from user)
    if (!document.querySelector(`script[src*="${MAPS_PROXY_URL}"]`)) {
      const script = document.createElement("script");
      script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${FORGE_API_KEY}&v=weekly&libraries=places`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    }
  }

  return () => {
    if (listener) window.google?.maps?.event?.removeListener(listener);
  };
}, [step]);
```

**Shopify port note:** In `checkout.liquid`, replace the street address `<input>` with the same pattern, loading the Maps script from your own Google Maps API key (not the Manus proxy). Restrict the key to your Shopify domain in the Google Cloud Console.

---

## 16. Klaviyo "Checkout Started" Event

**Goal:** Fire a Klaviyo `Checkout Started` track event the moment the checkout modal opens with items in the cart, enabling abandoned-checkout email flows.

### useEffect (inside CheckoutModal)

```ts
useEffect(() => {
  if (!open || cartItems.length === 0) return;
  try {
    if (typeof window !== "undefined" && (window as any)._learnq) {
      (window as any)._learnq.push(["track", "Checkout Started", {
        $value: total,
        ItemNames: cartItems.map(i => i.name),
        Items: cartItems.map(i => ({
          ProductName: i.name,
          Quantity: i.qty,
          ItemPrice: i.subscribe ? +(i.price * 0.85).toFixed(2) : i.price,
          RowTotal: i.subscribe
            ? +(i.price * 0.85 * i.qty).toFixed(2)
            : +(i.price * i.qty).toFixed(2),
          Subscribe: i.subscribe ?? false,
        })),
        CheckoutURL: window.location.href,
      }]);
    }
  } catch { /* silent fail */ }
}, [open, cartItems.length]);
```

### Klaviyo Flow setup

1. In Klaviyo, go to **Flows → Create Flow → Build your own**.
2. Set the trigger to **Metric → Checkout Started**.
3. Add a **Time Delay** of 1–4 hours, then an **Email** action using your abandoned-checkout template.
4. Add a **Filter** on the flow to skip profiles that have triggered `Placed Order` since the flow started.
5. Publish the flow.

**Property mapping:** `$value` maps to Klaviyo's built-in revenue field; `Items` is a line-item array compatible with Klaviyo's product block in email templates.

---

## 17. Klaviyo "Placed Order" Event

**Goal:** Fire a `Placed Order` track event the moment the user passes payment validation and advances to the confirmation step, closing the abandoned-checkout loop and feeding Klaviyo revenue attribution.

### Placement

Inside the `step === "payment"` validation block in the CTA `onClick`, immediately after `setFormErrors({})` succeeds:

```ts
try {
  if (typeof window !== "undefined" && (window as any)._learnq) {
    (window as any)._learnq.push(["track", "Placed Order", {
      $value: discountedTotal,
      OrderId: `LUMA-${Date.now()}`,
      ItemNames: cartItems.map(i => i.name),
      Items: cartItems.map(i => ({
        ProductName: i.name,
        Quantity: i.qty,
        ItemPrice: i.subscribe ? +(i.price * 0.85).toFixed(2) : i.price,
        RowTotal: i.subscribe
          ? +(i.price * 0.85 * i.qty).toFixed(2)
          : +(i.price * i.qty).toFixed(2),
        Subscribe: i.subscribe ?? false,
      })),
      PromoCode: appliedPromo?.code ?? null,
      Discount: appliedPromo ? +(discountedTotal - total).toFixed(2) : 0,
      BillingEmail: form.email,
    }]);
  }
} catch { /* silent fail */ }
```

**Klaviyo Flow:** Use `Placed Order` as a flow trigger to suppress the `Checkout Started` abandoned-cart flow for profiles that converted. Add a filter: "Skip if person has triggered Placed Order zero times since starting this flow."

---

## 18. Order Summary Mini-Badge on Step Headers

**Goal:** Show a compact badge at the top of the Shipping and Payment steps — product avatar stack, item count, and running total (with discount applied) — so users never lose sight of what they're buying.

### JSX pattern (identical for both steps)

```tsx
<div className="bg-white rounded-xl border border-[oklch(0.88_0.02_80)] p-3 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <div className="flex -space-x-2">
      {cartItems.slice(0, 3).map((item, i) => (
        <img key={i} src={item.img} alt={item.name}
          className="w-8 h-8 rounded-full border-2 border-white object-cover" />
      ))}
    </div>
    <span className="text-xs font-body text-[oklch(0.42_0.04_55)]">
      {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
    </span>
  </div>
  <div className="text-right">
    {appliedPromo && (
      <span className="text-[10px] font-body text-[oklch(0.42_0.08_150)] font-semibold block">
        {appliedPromo.pct}% off applied
      </span>
    )}
    <span className="font-display font-bold text-sm text-[oklch(0.22_0.04_55)]">
      ${discountedTotal.toFixed(2)}
    </span>
  </div>
</div>
```

Place this as the **first child** inside each step's `<div className="p-5 space-y-4">` container.

---

## 19. Collapsible Promo Code Field

**Goal:** Add a "Have a promo code?" toggle in the Order Summary step that expands an input + Apply button, validates the code against a lookup table, shows a green success badge when applied, and reflects the discount in the subtotal, discount row, and total.

### State

```ts
const [promoOpen, setPromoOpen] = useState(false);
const [promoInput, setPromoInput] = useState("");
const [promoError, setPromoError] = useState("");
const [appliedPromo, setAppliedPromo] = useState<{ code: string; pct: number } | null>(null);

// Lookup table — replace with a real API call (e.g. POST /api/validate-promo)
const PROMO_CODES: Record<string, number> = {
  LUMA10: 10, LUMA15: 15, LUMA20: 20, WELCOME: 10,
};

const applyPromo = () => {
  const code = promoInput.trim().toUpperCase();
  if (!code) { setPromoError("Enter a promo code"); return; }
  const pct = PROMO_CODES[code];
  if (!pct) { setPromoError("Invalid or expired code"); return; }
  setAppliedPromo({ code, pct });
  setPromoError("");
};

const discountedTotal = appliedPromo
  ? +(total * (1 - appliedPromo.pct / 100)).toFixed(2)
  : total;
```

### JSX (inside the totals card, between Shipping row and Total row)

```tsx
{/* Promo toggle */}
{!appliedPromo ? (
  <>
    <button onClick={() => setPromoOpen(o => !o)}
      className="text-xs text-[oklch(0.52_0.08_45)] font-semibold flex items-center gap-1">
      <span>{promoOpen ? "−" : "+"}</span> Have a promo code?
    </button>
    {promoOpen && (
      <div className="mt-2 flex gap-2">
        <input type="text" placeholder="Enter code" value={promoInput}
          onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
          onKeyDown={e => e.key === "Enter" && applyPromo()}
          className="flex-1 border rounded-lg px-3 py-2 text-sm uppercase tracking-widest ..." />
        <button onClick={applyPromo} className="...">Apply</button>
      </div>
    )}
    {promoError && <span className="text-red-500 text-xs">{promoError}</span>}
  </>
) : (
  <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
    <span className="text-xs font-semibold text-green-700">
      ✓ {appliedPromo.code} — {appliedPromo.pct}% off
    </span>
    <button onClick={() => { setAppliedPromo(null); setPromoInput(""); setPromoOpen(false); }}>
      Remove
    </button>
  </div>
)}

{/* Discount row — only shown when promo applied */}
{appliedPromo && (
  <div className="flex justify-between text-green-700 font-semibold">
    <span>Discount ({appliedPromo.pct}%)</span>
    <span>-${(total - discountedTotal).toFixed(2)}</span>
  </div>
)}

{/* Total row — shows strikethrough original when discounted */}
<div className="flex justify-between font-bold text-base pt-2 border-t">
  <span>Total</span>
  <div className="text-right">
    {appliedPromo && <span className="text-xs line-through text-gray-400">${total.toFixed(2)}</span>}
    <span>${discountedTotal.toFixed(2)}</span>
  </div>
</div>
```

**Shopify port note:** Replace the `PROMO_CODES` lookup with a call to `POST /api/validate_promo` backed by Shopify's Discount Codes API (`GET /admin/api/2024-01/price_rules/{id}/discount_codes.json`). Return `{ valid: true, pct: 15 }` or `{ valid: false, message: "..." }`.

---

## 20. Shopify Discount Codes API Validation

**Goal:** Replace the client-side promo lookup table with an async call to a backend proxy that validates codes against Shopify's Discount Codes API, keeping codes in sync with Shopify Admin.

### Frontend (`applyPromo`)

```ts
const applyPromo = async () => {
  const code = promoInput.trim().toUpperCase();
  if (!code) { setPromoError("Enter a promo code"); return; }
  setPromoLoading(true);
  setPromoError("");
  try {
    const res = await fetch("/api/validate-promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.valid && data.pct) {
        setAppliedPromo({ code, pct: data.pct, type: data.type ?? "percentage" });
      } else {
        setPromoError(data.message ?? "Invalid or expired code");
      }
      return;
    }
  } catch { /* fall through to local lookup */ }
  finally { setPromoLoading(false); }
  // Local fallback for demo / pre-production
  const FALLBACK = { LUMA10: 10, LUMA15: 15, LUMA20: 20, WELCOME: 10 };
  const pct = FALLBACK[code as keyof typeof FALLBACK];
  if (pct) setAppliedPromo({ code, pct, type: "percentage" });
  else setPromoError("Invalid or expired code");
};
```

### Backend proxy route (`POST /api/validate-promo`)

```ts
// server/routes/validatePromo.ts
import type { Request, Response } from "express";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN!;   // e.g. luma-daily.myshopify.com
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN!;

export async function validatePromo(req: Request, res: Response) {
  const { code } = req.body as { code: string };
  if (!code) return res.status(400).json({ valid: false, message: "No code provided" });

  // 1. Look up the discount code
  const lookupRes = await fetch(
    `https://${SHOPIFY_STORE}/admin/api/2024-01/discount_codes/lookup.json?code=${encodeURIComponent(code)}`,
    { headers: { "X-Shopify-Access-Token": SHOPIFY_TOKEN } }
  );
  if (!lookupRes.ok) return res.json({ valid: false, message: "Invalid or expired code" });
  const { discount_code } = await lookupRes.json();

  // 2. Resolve the parent price rule for value_type + value
  const ruleRes = await fetch(
    `https://${SHOPIFY_STORE}/admin/api/2024-01/price_rules/${discount_code.price_rule_id}.json`,
    { headers: { "X-Shopify-Access-Token": SHOPIFY_TOKEN } }
  );
  const { price_rule } = await ruleRes.json();

  const isPercentage = price_rule.value_type === "percentage";
  const pct = isPercentage ? Math.abs(parseFloat(price_rule.value)) : null;
  const fixed = !isPercentage ? Math.abs(parseFloat(price_rule.value)) : null;

  return res.json({ valid: true, pct, fixed, type: price_rule.value_type });
}
```

**Required secrets:** `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_API_TOKEN` (add via Settings → Secrets after upgrading to web-db-user).

---

## 21. Referral Share Row on Confirmation Screen

**Goal:** After order confirmed, show a pre-filled referral link (`lumadaily.com/?ref=FIRSTNAME`) with copy-to-clipboard and native Web Share API buttons, turning every buyer into a referral channel.

### State needed

None — uses `form.firstName` already in scope.

### JSX (insert after email capture card, before "Complete your ritual")

```tsx
<div className="bg-white rounded-xl border p-4">
  <p className="text-sm font-bold mb-0.5">Share Luma Daily with a friend</p>
  <p className="text-xs text-gray-500 mb-3">They get 10% off their first order. You get 10% off your next.</p>
  {(() => {
    const refName = (form.firstName || "friend").trim();
    const refUrl = `https://lumadaily.com/?ref=${encodeURIComponent(refName)}`;
    return (
      <div className="flex gap-2">
        <div className="flex-1 bg-gray-50 border rounded-lg px-3 py-2 text-xs truncate select-all">{refUrl}</div>
        <button onClick={() => {
          navigator.clipboard.writeText(refUrl).catch(() => {});
          const el = document.getElementById("ref-copy-label");
          if (el) { el.textContent = "Copied!"; setTimeout(() => { if (el) el.textContent = "Copy"; }, 2000); }
        }} className="...">
          <span id="ref-copy-label">Copy</span>
        </button>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button onClick={() => navigator.share({
            title: "Try Luma Daily",
            text: `${refName} thinks you'll love Luma Daily — get 10% off!`,
            url: refUrl,
          }).catch(() => {})} className="...">Share</button>
        )}
      </div>
    );
  })()}
</div>
```

**Shopify port:** Wire the `ref` query param to a Shopify Referral app (e.g. Referral Candy or Smile.io) or a custom Shopify Flow that creates a unique discount code for the referrer on first referred purchase.

---

## 22. Post-Purchase Upsell Modal

**Goal:** 800ms after the confirmation step renders, show a full-screen overlay with a one-time 30%-off offer on the first product not already in the cart. Accept adds it to the cart at the discounted price; decline closes the modal. The modal never shows again once accepted.

### State

```ts
const [showUpsellModal, setShowUpsellModal] = useState(false);
const [upsellAccepted, setUpsellAccepted] = useState(false);
const [upsellAdding, setUpsellAdding] = useState(false);
```

### Trigger

```ts
useEffect(() => {
  if (step !== "confirmation" || upsellAccepted) return;
  const timer = setTimeout(() => setShowUpsellModal(true), 800);
  return () => clearTimeout(timer);
}, [step]);
```

### Accept handler

```ts
onClick={async () => {
  setUpsellAdding(true);
  await new Promise(r => setTimeout(r, 600)); // simulate add-to-order API
  addToCart({ ...upsellProd, price: upsellPrice }); // upsellPrice = price * 0.70
  setUpsellAdding(false);
  setUpsellAccepted(true);
  setShowUpsellModal(false);
}}
```

**Shopify port:** Replace `addToCart` with a POST to Shopify's Draft Orders API to append the upsell line item to the existing order before it is fulfilled. Use `PUT /admin/api/2024-01/draft_orders/{id}.json` with the new `line_items` array, then call `POST /admin/api/2024-01/draft_orders/{id}/complete.json` to finalize.

---

## 23. Upsell Modal Countdown Timer

**Goal:** Show a live MM:SS countdown in the upsell modal header that creates urgency and auto-dismisses the offer when it expires.

### State

```ts
const [upsellSecondsLeft, setUpsellSecondsLeft] = useState(180); // 3 minutes
```

### Reset on modal open

```ts
// In the 800ms trigger useEffect:
const timer = setTimeout(() => { setShowUpsellModal(true); setUpsellSecondsLeft(180); }, 800);
```

### Countdown tick useEffect

```ts
useEffect(() => {
  if (!showUpsellModal) return;
  if (upsellSecondsLeft <= 0) { setShowUpsellModal(false); return; }
  const tick = setInterval(() => setUpsellSecondsLeft(s => {
    if (s <= 1) { setShowUpsellModal(false); return 0; }
    return s - 1;
  }), 1000);
  return () => clearInterval(tick);
}, [showUpsellModal, upsellSecondsLeft]);
```

### Display (in modal header)

```tsx
<span className={`font-bold tabular-nums ${upsellSecondsLeft <= 30 ? "text-red-400" : "text-white"}`}>
  {String(Math.floor(upsellSecondsLeft / 60)).padStart(2, "0")}:{String(upsellSecondsLeft % 60).padStart(2, "0")}
</span>
```

A thin progress bar below the timer shrinks from full-width to zero over 180 seconds, turning red in the final 30 seconds.

---

## 24. Shopify Draft Orders API — Upsell Accept

**Goal:** When the user accepts the post-purchase upsell, attempt to append the line item to the live Shopify order via a backend proxy before falling back to local cart state.

### Frontend Accept handler

```ts
onClick={async () => {
  setUpsellAdding(true);
  try {
    const res = await fetch("/api/upsell-add-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName: upsellProd.name,
        quantity: 1,
        price: upsellPrice,
        originalPrice: upsellProd.price,
        discountPct: 30,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("proxy not available");
  } catch {
    // Proxy not yet deployed — fall back to local cart state
    addToCart({ ...upsellProd, price: upsellPrice });
  }
  setUpsellAdding(false);
  setUpsellAccepted(true);
  setShowUpsellModal(false);
}}
```

### Backend proxy route (`POST /api/upsell-add-item`)

```ts
// server/routes/upsellAddItem.ts
import type { Request, Response } from "express";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN!;

export async function upsellAddItem(req: Request, res: Response) {
  const { draftOrderId, variantId, quantity, price } = req.body;

  // 1. Fetch existing draft order
  const getRes = await fetch(
    `https://${SHOPIFY_STORE}/admin/api/2024-01/draft_orders/${draftOrderId}.json`,
    { headers: { "X-Shopify-Access-Token": SHOPIFY_TOKEN } }
  );
  const { draft_order } = await getRes.json();

  // 2. Append upsell line item
  const updatedLineItems = [
    ...draft_order.line_items,
    { variant_id: variantId, quantity, price: String(price), applied_discount: { value: "30", value_type: "percentage" } },
  ];
  await fetch(
    `https://${SHOPIFY_STORE}/admin/api/2024-01/draft_orders/${draftOrderId}.json`,
    {
      method: "PUT",
      headers: { "X-Shopify-Access-Token": SHOPIFY_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ draft_order: { line_items: updatedLineItems } }),
    }
  );

  // 3. Complete the draft order
  await fetch(
    `https://${SHOPIFY_STORE}/admin/api/2024-01/draft_orders/${draftOrderId}/complete.json`,
    { method: "POST", headers: { "X-Shopify-Access-Token": SHOPIFY_TOKEN } }
  );

  return res.json({ ok: true });
}
```

**Required secrets:** `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_API_TOKEN`. Pass `draftOrderId` from the Klaviyo "Placed Order" event payload or from a server-side session store.

---

## 25. Loyalty Points Balance on Confirmation Screen

**Goal:** Show earned points, tier badge, and a progress bar toward the next tier immediately after the order confirmation renders, seeding repeat-purchase intent.

### Points calculation (frontend, demo)

```ts
const basePoints = Math.round(discountedTotal);           // $1 = 1 point
const subscribeBonus = cartItems.some(i => i.subscribe)
  ? Math.round(basePoints * 0.5) : 0;                    // subscribe = 1.5x
const earnedPoints = basePoints + subscribeBonus;

const TIERS = [
  { name: "Bronze",   min: 0,    max: 250  },
  { name: "Silver",   min: 250,  max: 500  },
  { name: "Gold",     min: 500,  max: 1000 },
  { name: "Platinum", min: 1000, max: 2000 },
];
const priorPoints = 150; // replace with real balance from Loyalty API
const totalPoints = priorPoints + earnedPoints;
const tier = TIERS.find(t => totalPoints >= t.min && totalPoints < t.max) ?? TIERS[3];
const nextTier = TIERS[TIERS.indexOf(tier) + 1];
const pct = nextTier
  ? Math.min(100, Math.round(((totalPoints - tier.min) / (nextTier.min - tier.min)) * 100))
  : 100;
```

**Shopify port:** Replace `priorPoints = 150` with a call to your loyalty provider's REST API (e.g. Smile.io `GET /v1/customers?email={email}`, LoyaltyLion `GET /customers/{id}`) to fetch the real running balance. Fire a "Points Earned" event via the provider's webhook after order completion to credit the points server-side.

---

## 26. Smile.io Loyalty API Integration

**Goal:** Replace the `priorPoints = 150` demo value with a live balance fetched from the Smile.io REST API when the confirmation step renders.

### State

```ts
const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null);
const [loyaltyFetched, setLoyaltyFetched] = useState(false);
```

### Fetch useEffect (fires once on confirmation step with a known email)

```ts
useEffect(() => {
  if (step !== "confirmation" || loyaltyFetched || !form.email) return;
  setLoyaltyFetched(true);
  (async () => {
    try {
      const res = await fetch(
        `/api/loyalty-balance?email=${encodeURIComponent(form.email)}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (res.ok) {
        const data = await res.json();
        setLoyaltyPoints(typeof data.points === "number" ? data.points : 150);
      } else {
        setLoyaltyPoints(150); // demo fallback
      }
    } catch {
      setLoyaltyPoints(150); // demo fallback
    }
  })();
}, [step, form.email, loyaltyFetched]);
```

### Backend proxy route (`GET /api/loyalty-balance?email=`)

```ts
// server/routes/loyaltyBalance.ts
import type { Request, Response } from "express";

const SMILE_API_KEY = process.env.SMILE_API_KEY!;

export async function loyaltyBalance(req: Request, res: Response) {
  const { email } = req.query as { email: string };
  const smileRes = await fetch(
    `https://api.smile.io/v1/customers?email=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${SMILE_API_KEY}` } }
  );
  const { customers } = await smileRes.json();
  const points = customers?.[0]?.points_balance ?? 0;
  return res.json({ points });
}
```

**Required secret:** `SMILE_API_KEY` (found in Smile.io Admin → Apps → API).

---

## 27. Redeem Points Row in Order Summary

**Goal:** Let customers apply their loyalty points as a discount in the Order Summary step, with a range slider and live dollar-value preview.

### State & derived values

```ts
const [redeemPointsOpen, setRedeemPointsOpen] = useState(false);
const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);

const POINTS_PER_DOLLAR = 20; // 100 pts = $5 off
const availablePoints = loyaltyPoints ?? 150;
const maxRedeemablePoints = Math.min(availablePoints, Math.floor(total * POINTS_PER_DOLLAR));
const pointsDiscount = +(pointsToRedeem / POINTS_PER_DOLLAR).toFixed(2);

// Combined discount: promo code + points
const discountedTotal = +Math.max(
  0,
  (appliedPromo ? total * (1 - appliedPromo.pct / 100) : total) - pointsDiscount
).toFixed(2);
```

### UI pattern

- "Redeem points (N available)" toggle link, identical in style to the promo code toggle.
- Range slider (`min=0`, `max=maxRedeemablePoints`, `step=20`) with live "X pts = -$Y" label.
- "Apply" button commits the selection; "Remove" resets `pointsToRedeem` to 0.
- A "Points discount" line item appears in the totals card when `pointsToRedeem > 0`.

**Shopify port:** After order completion, call `POST https://api.smile.io/v1/points_transactions` to deduct the redeemed points from the customer's balance server-side.

---

## 28. Exit-Intent Overlay

**Goal:** Detect when the user moves their cursor out of the viewport through the top edge while the cart is non-empty, and show a one-time "Wait — here's 10% off" modal.

### State

```ts
const [exitIntentShown, setExitIntentShown] = useState(false);
const [exitIntentVisible, setExitIntentVisible] = useState(false);
const [exitEmail, setExitEmail] = useState("");
const [exitSubmitted, setExitSubmitted] = useState(false);
```

### Trigger useEffect

```ts
useEffect(() => {
  const handleMouseLeave = (e: MouseEvent) => {
    if (e.clientY > 20) return;           // only top-edge exits
    if (exitIntentShown) return;           // fire once per session
    if (count === 0) return;               // only when cart has items
    setExitIntentShown(true);
    setExitIntentVisible(true);
  };
  document.addEventListener("mouseleave", handleMouseLeave);
  return () => document.removeEventListener("mouseleave", handleMouseLeave);
}, [exitIntentShown, count]);
```

### Modal features

- Backdrop blur overlay, click-outside to dismiss.
- Shows item count from cart (`count` state).
- Displays `LUMA10` promo badge with a Copy button.
- Email field sends `_learnq.push(["identify", { $email }])` to Klaviyo on submit.
- After submit: success state with "Code sent!" confirmation and "Return to my cart" CTA that re-opens the cart drawer.
- "Return to my cart" CTA also available before submit.
