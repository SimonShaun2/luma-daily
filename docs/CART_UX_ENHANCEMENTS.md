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
