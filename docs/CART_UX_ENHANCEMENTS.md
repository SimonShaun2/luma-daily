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
