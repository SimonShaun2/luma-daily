/**
 * cart-enhancements.js
 * Ported from: Home.tsx CartDrawer + CheckoutModal components
 * Handles: ATC animations, cart AJAX updates, free-shipping progress, GWP tier,
 *          quantity controls, remove animations, cart badge pop, checkout glow pulse
 *
 * Depends on: window.__LUMA_CONFIG__ (injected by theme.liquid)
 */

(function () {
  'use strict';

  var cfg = window.__LUMA_CONFIG__ || {};
  var FREE_SHIPPING = (cfg.freeShippingThreshold || 50) * 100; // in cents
  var GWP_THRESHOLD = (cfg.gwpThreshold || 75) * 100;
  var GWP_HANDLE = cfg.gwpProductHandle || '';

  // ─── Cart drawer open / close ──────────────────────────────────────────────
  var drawer = document.getElementById('cart-drawer');
  var overlay = document.getElementById('cart-overlay');
  var closeBtn = document.getElementById('cart-close-btn');
  var cartIconBtns = document.querySelectorAll('[data-cart-trigger]');

  function openCart() {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', 'false');
    drawer.classList.add('cart-drawer--open');
    document.body.classList.add('cart-drawer-open');
    refreshCart().then(function (cart) {
      document.dispatchEvent(new CustomEvent('luma:cart:opened', { detail: { cart: cart } }));
    });
  }

  function closeCart() {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', 'true');
    drawer.classList.remove('cart-drawer--open');
    document.body.classList.remove('cart-drawer-open');
  }

  cartIconBtns.forEach(function (btn) { btn.addEventListener('click', openCart); });
  if (overlay) overlay.addEventListener('click', closeCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);

  // ─── Fetch cart and re-render ──────────────────────────────────────────────
  function refreshCart() {
    return fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        updateShippingBar(cart);
        updateGWPBanner(cart);
        updateCartBadge(cart);
        updateSubtotal(cart);
        return cart;
      });
  }

  // ─── Shipping progress bar ─────────────────────────────────────────────────
  function updateShippingBar(cart) {
    var fill = document.getElementById('shipping-bar-fill');
    var label = document.getElementById('shipping-bar-label');
    var remaining = document.getElementById('shipping-bar-remaining');
    if (!fill || !label) return;
    var pct = Math.min(100, Math.round((cart.total_price / FREE_SHIPPING) * 100));
    fill.style.width = pct + '%';
    if (cart.total_price >= FREE_SHIPPING) {
      label.innerHTML = "🎉 You've unlocked free shipping!";
      fill.classList.add('shipping-bar__fill--unlocked');
      // Glow pulse on checkout button
      var checkoutBtn = document.getElementById('cart-checkout-btn');
      if (checkoutBtn) checkoutBtn.classList.add('btn--glow-pulse');
    } else {
      var diff = ((FREE_SHIPPING - cart.total_price) / 100).toFixed(2);
      label.innerHTML = 'Add <strong>$' + diff + '</strong> more for free shipping';
      fill.classList.remove('shipping-bar__fill--unlocked');
    }
  }

  // ─── GWP banner ───────────────────────────────────────────────────────────
  function updateGWPBanner(cart) {
    var banner = document.getElementById('gwp-banner');
    if (!banner) return;
    if (cart.total_price >= GWP_THRESHOLD) {
      banner.style.display = 'block';
      if (GWP_HANDLE) addGWPIfMissing(cart, GWP_HANDLE);
    } else {
      banner.style.display = 'none';
    }
  }

  function addGWPIfMissing(cart, handle) {
    var alreadyIn = cart.items.some(function (i) { return i.handle === handle; });
    if (alreadyIn) return;
    fetch('/products/' + handle + '.js')
      .then(function (r) { return r.json(); })
      .then(function (product) {
        var variantId = product.variants[0].id;
        return fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1, properties: { _gwp: true } })
        });
      })
      .then(function () { refreshCart(); });
  }

  // ─── Cart badge ───────────────────────────────────────────────────────────
  function updateCartBadge(cart) {
    var badges = document.querySelectorAll('[data-cart-count]');
    badges.forEach(function (b) {
      var prev = parseInt(b.textContent, 10) || 0;
      b.textContent = cart.item_count;
      if (cart.item_count > prev) {
        b.classList.add('cart-badge--pop');
        setTimeout(function () { b.classList.remove('cart-badge--pop'); }, 400);
      }
    });
  }

  // ─── Subtotal ─────────────────────────────────────────────────────────────
  function updateSubtotal(cart) {
    var el = document.getElementById('cart-subtotal');
    if (el) el.textContent = '$' + (cart.total_price / 100).toFixed(2);
  }

  // ─── Quantity controls ────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.qty-btn');
    if (!btn) return;
    var key = btn.dataset.key;
    var item = document.querySelector('.cart-item[data-key="' + key + '"]');
    var qtyEl = item && item.querySelector('.qty-display');
    var qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
    var newQty = btn.classList.contains('qty-btn--minus') ? Math.max(0, qty - 1) : qty + 1;
    updateItemQuantity(key, newQty, item, qtyEl);
  });

  function updateItemQuantity(key, qty, itemEl, qtyEl) {
    if (qty === 0 && itemEl) {
      itemEl.classList.add('cart-item--removing');
      setTimeout(function () { itemEl.remove(); }, 350);
    } else if (qtyEl) {
      qtyEl.textContent = qty;
      qtyEl.classList.add('qty-flash');
      setTimeout(function () { qtyEl.classList.remove('qty-flash'); }, 500);
    }
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function () { refreshCart(); });
  }

  // ─── Remove item ──────────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.cart-item__remove');
    if (!btn) return;
    var key = btn.dataset.key;
    var itemEl = document.querySelector('.cart-item[data-key="' + key + '"]');
    if (itemEl) {
      itemEl.classList.add('cart-item--removing');
      setTimeout(function () { itemEl.remove(); }, 350);
    }
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: 0 })
    }).then(function () { refreshCart(); });
  });

  // ─── ATC form intercept (product-grid + bundles sections) ─────────────────
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('.product-card__atc-form, .bundle-card__atc-form, .upsell-item__form');
    if (!form) return;
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var origText = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Adding…'; btn.disabled = true; }

    var data = new FormData(form);
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(data))
    })
      .then(function (r) { return r.json(); })
      .then(function () {
        if (btn) {
          btn.textContent = '✓ Added!';
          btn.classList.add('btn--success');
          setTimeout(function () {
            btn.textContent = origText;
            btn.disabled = false;
            btn.classList.remove('btn--success');
          }, 1800);
        }
        refreshCart();
        openCart();
      });
  });

  // ─── Initial cart refresh on page load ────────────────────────────────────
  refreshCart();

})();
