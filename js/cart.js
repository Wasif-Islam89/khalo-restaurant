// =========================================================================
// KhaLo — cart.js
// Dedicated Interactive Script for Shopping Cart & Order Checkout
// Full Parity with Karachi Delivery Hub & Order Simulation
// =========================================================================

(() => {
  'use strict';

  // Base standard delivery fee across Karachi
  const deliveryFeeBase = 99;

  // Promo Codes Vault & Rules (Synchronized with deals.html)
  const PROMO_CODES = {
    'KHALO20': {
      code: 'KHALO20',
      type: 'percent',
      value: 20,
      minSubtotal: 1500,
      title: '20% OFF (Karahi & Handi)',
      desc: '20% off orders above Rs. 1,500'
    },
    'FREEDEL': {
      code: 'FREEDEL',
      type: 'free_delivery',
      value: 0,
      minSubtotal: 800,
      title: 'FREE EXPRESS DELIVERY',
      desc: 'Free doorstep delivery on orders above Rs. 800'
    },
    'FEAST500': {
      code: 'FEAST500',
      type: 'flat',
      value: 500,
      minSubtotal: 2500,
      title: 'FLAT RS. 500 OFF',
      desc: 'Flat Rs. 500 off feasts above Rs. 2,500'
    },
    'MIDNIGHT40': {
      code: 'MIDNIGHT40',
      type: 'percent',
      value: 40,
      minSubtotal: 500,
      title: '40% MIDNIGHT CRAVE',
      desc: '40% discount on late night orders above Rs. 500'
    },
    'KHALO50': {
      code: 'KHALO50',
      type: 'flat',
      value: 150,
      minSubtotal: 500,
      title: 'RS. 150 OFF',
      desc: 'Rs. 150 off orders above Rs. 500'
    },
    'WELCOME': {
      code: 'WELCOME',
      type: 'percent',
      value: 10,
      minSubtotal: 0,
      title: '10% WELCOME DISCOUNT',
      desc: '10% welcome discount on any order'
    }
  };

  // State
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
  } catch (e) {
    cart = [];
  }

  let appliedDiscount = 0;
  let activePromo = (localStorage.getItem('khalo_applied_promo') || '').trim().toUpperCase();
  let isFreeDeliveryApplied = false;
  const currentLocation = localStorage.getItem('khalo_location') || '';

  // DOM Elements
  const cartListEl = document.getElementById('cart-items-list');
  const cartEmptyStateEl = document.getElementById('cart-empty-state');
  const cartLayoutGridEl = document.getElementById('cart-layout-grid');
  const countBadgeEl = document.getElementById('cart-count-badge');
  const subtotalEl = document.getElementById('cart-subtotal');
  const deliveryFeeEl = document.getElementById('cart-delivery-fee');
  const discountRowEl = document.getElementById('cart-discount-row');
  const discountAmountEl = document.getElementById('cart-discount-amount');
  const grandTotalEl = document.getElementById('cart-grand-total');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const promoInput = document.getElementById('promo-input');
  const promoBtn = document.getElementById('promo-btn');
  const promoText = document.getElementById('promo-applied-text');
  const promoWarningText = document.getElementById('promo-warning-text');
  const promoActiveBadge = document.getElementById('promo-active-badge');
  const promoActiveCode = document.getElementById('promo-active-code');
  const promoActiveDesc = document.getElementById('promo-active-desc');
  const promoRemoveBtn = document.getElementById('promo-remove-btn');
  const promoForm = document.getElementById('promo-form');
  const destLocationText = document.getElementById('cart-dest-location-text');
  const orderModal = document.getElementById('order-modal-overlay');
  const orderCloseBtn = document.getElementById('order-modal-close-btn');

  // Toast helper
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  function showToast(message, iconName = 'check_circle') {
    if (typeof window.showKhaloToast === 'function') {
      window.showKhaloToast(message, iconName);
      return;
    }
    if (!toast || !toastText) return;
    if (toastIcon) toastIcon.textContent = iconName;
    toastText.textContent = typeof message === 'object' ? (message.title || '') : message;
    toast.classList.add('is-visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  function bumpBadge(badgeId, delta) {
    const badge = document.getElementById(badgeId);
    if (!badge) return;
    const current = parseInt(badge.textContent, 10) || 0;
    const next = Math.max(0, current + delta);
    badge.textContent = next;
    if (badge.animate) {
      badge.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
        { duration: 350, easing: 'ease-out' }
      );
    }
  }

  function updateNavbarBadges() {
    const totalQty = cart.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
    const cartBadge = document.getElementById('cart-badge');
    const mobileCartBadge = document.getElementById('mobile-cart-badge');
    if (cartBadge) cartBadge.textContent = totalQty;
    if (mobileCartBadge) mobileCartBadge.textContent = totalQty;

    const favs = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    const favBadge = document.getElementById('fav-badge');
    const mobileFavBadge = document.getElementById('mobile-fav-badge');
    if (favBadge) favBadge.textContent = favs.length;
    if (mobileFavBadge) mobileFavBadge.textContent = favs.length;

    if (countBadgeEl) {
      countBadgeEl.textContent = `${totalQty} ${totalQty === 1 ? 'item' : 'items'}`;
    }
  }

  function renderCart() {
    try {
      cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    } catch (e) {
      cart = [];
    }

    updateNavbarBadges();

    if (!cartListEl) return;

    if (!Array.isArray(cart) || cart.length === 0) {
      if (cartLayoutGridEl) cartLayoutGridEl.style.display = 'none';
      if (cartEmptyStateEl) cartEmptyStateEl.style.display = 'block';
      if (subtotalEl) subtotalEl.textContent = 'Rs. 0';
      if (deliveryFeeEl) deliveryFeeEl.textContent = 'Rs. 0';
      if (grandTotalEl) grandTotalEl.textContent = 'Rs. 0';
      return;
    }

    if (cartLayoutGridEl) cartLayoutGridEl.style.display = 'grid';
    if (cartEmptyStateEl) cartEmptyStateEl.style.display = 'none';

    let subtotal = 0;

    cartListEl.innerHTML = cart.map((item) => {
      const qty = parseInt(item.quantity, 10) || 1;
      const price = typeof item.price === 'number'
        ? item.price
        : (parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0);
      const lineTotal = price * qty;
      subtotal += lineTotal;
      const isDealItem = (item.id && String(item.id).startsWith('deal-')) || item.isDeal;
      const dealBadgeHtml = isDealItem ? `<span class="cart-deal-badge">Special Deal Combo</span>` : '';
      const img = item.image || '../assets/Shahi Dum Biryani.jpg';
      const title = item.title || 'Special Dish';

      return `
        <div class="cart-row" data-id="${item.id}">
          <img src="${img}" alt="${title}" class="cart-row-img" onerror="this.onerror=null;this.src='../assets/Shahi Dum Biryani.jpg';" />
          <div class="cart-row-info">
            ${dealBadgeHtml}
            <h3 class="cart-row-title">${title}</h3>
            <span class="cart-row-unit-price">Rs. ${price.toLocaleString()}</span>
          </div>
          <div class="cart-row-qty">
            <button class="cart-qty-btn" data-action="dec" data-id="${item.id}" type="button" aria-label="Decrease quantity">−</button>
            <span class="cart-qty-num">${qty}</span>
            <button class="cart-qty-btn" data-action="inc" data-id="${item.id}" type="button" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-row-total">
            Rs. ${lineTotal.toLocaleString()}
          </div>
          <button class="cart-row-remove" data-id="${item.id}" type="button" aria-label="Remove item">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      `;
    }).join('');

    // Dynamic Promo & Discount Evaluation
    appliedDiscount = 0;
    isFreeDeliveryApplied = false;
    let promoWarning = '';

    if (activePromo && PROMO_CODES[activePromo]) {
      const promo = PROMO_CODES[activePromo];
      if (subtotal >= promo.minSubtotal) {
        if (promo.type === 'percent') {
          appliedDiscount = Math.round(subtotal * (promo.value / 100));
        } else if (promo.type === 'flat') {
          appliedDiscount = Math.min(subtotal, promo.value);
        } else if (promo.type === 'free_delivery') {
          isFreeDeliveryApplied = true;
          appliedDiscount = 0;
        }

        // Active Badge UI
        if (promoActiveBadge) {
          promoActiveBadge.style.display = 'flex';
          if (promoActiveCode) promoActiveCode.textContent = promo.code;
          if (promoActiveDesc) {
            if (promo.type === 'free_delivery') {
              promoActiveDesc.textContent = 'Free express delivery unlocked (Saved Rs. 99)';
            } else {
              promoActiveDesc.textContent = `${promo.title} • Saved Rs. ${appliedDiscount.toLocaleString()}`;
            }
          }
        }
        if (promoForm) promoForm.style.display = 'none';
        if (promoText) {
          promoText.style.display = 'block';
          promoText.textContent = promo.type === 'free_delivery'
            ? '✓ Free delivery active across all Karachi zones!'
            : `✓ Voucher ${promo.code} active: Saved Rs. ${appliedDiscount.toLocaleString()}!`;
        }
        if (promoWarningText) promoWarningText.style.display = 'none';
      } else {
        // Below minimum subtotal threshold
        const needed = promo.minSubtotal - subtotal;
        promoWarning = `Add Rs. ${needed.toLocaleString()} more to activate ${promo.code} (${promo.title})`;
        if (promoActiveBadge) promoActiveBadge.style.display = 'none';
        if (promoForm) promoForm.style.display = 'flex';
        if (promoText) promoText.style.display = 'none';
        if (promoWarningText) {
          promoWarningText.textContent = `⚠️ ${promoWarning}`;
          promoWarningText.style.display = 'block';
        }
      }
    } else {
      if (promoActiveBadge) promoActiveBadge.style.display = 'none';
      if (promoForm) promoForm.style.display = 'flex';
      if (promoText) promoText.style.display = 'none';
      if (promoWarningText) promoWarningText.style.display = 'none';
    }

    // Update active highlight on quick chips
    document.querySelectorAll('.promo-chip').forEach((chip) => {
      chip.classList.toggle('is-active', chip.dataset.code === activePromo && subtotal >= (PROMO_CODES[chip.dataset.code]?.minSubtotal || 0));
    });

    // Summary calculations
    const isFreeDelivery = subtotal >= 1500 || isFreeDeliveryApplied;
    const deliveryFee = isFreeDelivery ? 0 : deliveryFeeBase;
    const grandTotal = Math.max(0, subtotal + deliveryFee - appliedDiscount);

    if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;

    if (deliveryFeeEl) {
      if (deliveryFee === 0) {
        const badgeLabel = isFreeDeliveryApplied ? 'FREE (FREEDEL)' : 'FREE';
        deliveryFeeEl.innerHTML = `<span class="delivery-free-badge">${badgeLabel}</span> Rs. 0`;
      } else {
        deliveryFeeEl.textContent = `Rs. ${deliveryFee}`;
      }
    }

    if (discountRowEl) {
      if (appliedDiscount > 0) {
        discountRowEl.style.display = 'flex';
        if (discountAmountEl) discountAmountEl.textContent = `- Rs. ${appliedDiscount.toLocaleString()}`;
      } else {
        discountRowEl.style.display = 'none';
      }
    }

    if (grandTotalEl) grandTotalEl.textContent = `Rs. ${grandTotal.toLocaleString()}`;

    const payCardRadioEl = document.getElementById('pay-method-card');
    const checkoutBtnTextEl = document.getElementById('cart-checkout-btn-text');
    if (payCardRadioEl && payCardRadioEl.checked && checkoutBtnTextEl) {
      checkoutBtnTextEl.textContent = `Pay Rs. ${grandTotal.toLocaleString()} & Place Order`;
    }

    // Event listeners on rows
    cartListEl.querySelectorAll('.cart-qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        const item = cart.find((i) => String(i.id) === String(id));

        if (item) {
          if (action === 'inc') {
            item.quantity = (parseInt(item.quantity, 10) || 1) + 1;
            bumpBadge('cart-badge', 1);
          } else if (action === 'dec') {
            item.quantity = (parseInt(item.quantity, 10) || 1) - 1;
            bumpBadge('cart-badge', -1);
            if (item.quantity <= 0) {
              cart = cart.filter((i) => String(i.id) !== String(id));
              showToast(`${item.title || 'Item'} removed`, 'delete');
            }
          }
          localStorage.setItem('khalo_cart', JSON.stringify(cart));
          renderCart();
        }
      });
    });

    cartListEl.querySelectorAll('.cart-row-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find((i) => String(i.id) === String(id));
        if (item) {
          cart = cart.filter((i) => String(i.id) !== String(id));
          localStorage.setItem('khalo_cart', JSON.stringify(cart));
          showToast(`${item.title || 'Item'} removed from cart`, 'delete');
          renderCart();
        }
      });
    });
  }

  // Promo code management
  function applyPromoCode(rawCode, showFeedback = true) {
    const code = (rawCode || '').trim().toUpperCase();
    if (!code) return;

    if (!PROMO_CODES[code]) {
      showToast('Invalid coupon. Try KHALO20, FREEDEL or FEAST500', 'error');
      return;
    }

    activePromo = code;
    localStorage.setItem('khalo_applied_promo', code);
    if (promoInput) promoInput.value = '';

    const subtotal = cart.reduce((s, i) => {
      const qty = parseInt(i.quantity, 10) || 1;
      const price = typeof i.price === 'number'
        ? i.price
        : (parseInt(String(i.price).replace(/[^0-9]/g, ''), 10) || 0);
      return s + (price * qty);
    }, 0);

    const promo = PROMO_CODES[code];

    if (subtotal >= promo.minSubtotal) {
      if (showFeedback) {
        if (promo.type === 'free_delivery') {
          showToast('Free delivery coupon FREEDEL applied!', 'moped');
        } else {
          showToast(`Voucher ${code} applied successfully!`, 'local_offer');
        }
      }
    } else {
      const diff = promo.minSubtotal - subtotal;
      showToast(`Add Rs. ${diff.toLocaleString()} more to unlock ${code}`, 'warning');
    }

    renderCart();
  }

  function removePromoCode() {
    const prevPromo = activePromo;
    activePromo = '';
    appliedDiscount = 0;
    isFreeDeliveryApplied = false;
    localStorage.removeItem('khalo_applied_promo');

    if (promoInput) promoInput.value = '';
    if (promoText) promoText.style.display = 'none';
    if (promoWarningText) promoWarningText.style.display = 'none';
    if (promoActiveBadge) promoActiveBadge.style.display = 'none';
    if (promoForm) promoForm.style.display = 'flex';

    renderCart();
    if (prevPromo) {
      showToast(`Coupon ${prevPromo} removed`, 'info');
    }
  }

  function setupPromo() {
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        applyPromoCode(promoInput.value, true);
      });

      promoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyPromoCode(promoInput.value, true);
        }
      });
    }

    if (promoRemoveBtn) {
      promoRemoveBtn.addEventListener('click', () => {
        removePromoCode();
      });
    }

    // Quick Coupon Chips from Deals page
    document.querySelectorAll('.promo-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const code = chip.dataset.code;
        if (code) {
          applyPromoCode(code, true);
        }
      });
    });

    // Auto-apply preselected coupon from deals.html or URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const paramPromo = urlParams.get('promo');
    if (paramPromo && PROMO_CODES[paramPromo.toUpperCase()]) {
      applyPromoCode(paramPromo.toUpperCase(), true);
    } else if (activePromo && PROMO_CODES[activePromo]) {
      applyPromoCode(activePromo, false);
    }
  }

  // =========================================================================
  // ORDER TRACKING & LIVE SIMULATION
  // =========================================================================
  const orderModalId = document.getElementById('order-modal-id');
  const orderCopyBtn = document.getElementById('order-copy-btn');
  const orderCopyText = document.getElementById('order-copy-text');
  const orderModalDest = document.getElementById('order-modal-dest');
  const orderModalEta = document.getElementById('order-modal-eta');
  const orderModalTotal = document.getElementById('order-modal-total');
  const orderModalXBtn = document.getElementById('order-modal-x-btn');
  const orderSimBtn = document.getElementById('order-sim-advance-btn');
  const orderSimBtnLabel = document.getElementById('order-sim-btn-label');
  const riderCallBtn = document.getElementById('rider-call-btn');
  const riderNameEl = document.querySelector('.rider-name');
  const riderPhoneEl = document.querySelector('.rider-phone');
  const riderBikeEl = document.querySelector('.rider-bike');
  const modalDishesTagsEl = document.getElementById('modal-order-dishes-tags');

  // Stages configuration
  const ORDER_STAGES = [
    {
      step: 1,
      name: 'Order Placed & Confirmed',
      sub: 'Received by KhaLo Kitchen',
      icon: 'receipt_long',
      eta: '30–35 mins'
    },
    {
      step: 2,
      name: 'Kitchen Preparing',
      sub: 'Chef is frying & packing hot meal',
      icon: 'soup_kitchen',
      eta: '25–30 mins'
    },
    {
      step: 3,
      name: 'Rider Dispatched',
      sub: 'Rider is on the way with your hot meal',
      icon: 'moped',
      eta: '10–15 mins'
    },
    {
      step: 4,
      name: 'Delivered',
      sub: 'Piping hot food handed to you. Enjoy your KhaLo feast!',
      icon: 'home_pin',
      eta: 'Arrived'
    }
  ];

  const RIDERS_POOL = [
    { name: 'Tariq Khan', phone: '+92 300 2849102', bike: 'Honda CG 125 • KHI-8291' },
    { name: 'Hamza Malik', phone: '+92 312 9014283', bike: 'Yamaha YBR 125 • KHI-4019' },
    { name: 'Bilal Ahmed', phone: '+92 333 4910294', bike: 'Super Power 70 • KHI-1738' },
    { name: 'Zeeshan Ali', phone: '+92 345 6192840', bike: 'Suzuki GS 150 • KHI-9031' }
  ];

  let currentModalOrderId = null;
  let liveTimerInterval = null;

  function normalizeOrderItems(orders) {
    if (!Array.isArray(orders)) return [];
    return orders.map((order) => {
      if (order && Array.isArray(order.items)) {
        order.items = order.items.map((it) => {
          const dishTitle = (it.title && it.title !== 'Dish' && it.title !== 'Delicious Dish')
            ? it.title
            : (it.name && it.name !== 'Dish' && it.name !== 'Delicious Dish')
            ? it.name
            : (it.item || it.title || it.name || 'Special KhaLo Feast');
          return {
            ...it,
            title: dishTitle,
            name: dishTitle,
            quantity: parseInt(it.quantity, 10) || 1
          };
        });
      }
      return order;
    });
  }

  function getActiveOrders() {
    try {
      const data = localStorage.getItem('khalo_active_orders');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return normalizeOrderItems(parsed);
      }
      const single = localStorage.getItem('khalo_active_order');
      if (single) {
        const order = JSON.parse(single);
        return order ? normalizeOrderItems([order]) : [];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  function getActiveOrder() {
    const orders = getActiveOrders();
    return orders.length > 0 ? orders[0] : null;
  }

  function saveActiveOrders(orders) {
    const normalized = normalizeOrderItems(orders);
    localStorage.setItem('khalo_active_orders', JSON.stringify(normalized));
    if (normalized.length > 0) {
      localStorage.setItem('khalo_active_order', JSON.stringify(normalized[0]));
    } else {
      localStorage.removeItem('khalo_active_order');
    }
    renderActiveOrdersUI();
  }

  function getOrderById(id) {
    const orders = getActiveOrders();
    return orders.find((o) => o.id === id) || orders[0] || null;
  }

  // Update Stepper timeline visuals in tracking modal
  function updateTimelineUI(currentStep) {
    for (let i = 1; i <= 4; i++) {
      const stepEl = document.getElementById(`track-step-${i}`);
      if (!stepEl) continue;

      stepEl.classList.remove('step-done', 'step-active');
      const nodeIcon = stepEl.querySelector('.tracker-node .material-symbols-outlined');

      if (i < currentStep) {
        stepEl.classList.add('step-done');
        if (nodeIcon) nodeIcon.textContent = 'check';
      } else if (i === currentStep) {
        stepEl.classList.add('step-active');
        if (nodeIcon) {
          if (i === 1) nodeIcon.textContent = 'check';
          if (i === 2) nodeIcon.textContent = 'soup_kitchen';
          if (i === 3) nodeIcon.textContent = 'moped';
          if (i === 4) nodeIcon.textContent = 'home_pin';
        }
      } else {
        if (nodeIcon) {
          if (i === 2) nodeIcon.textContent = 'soup_kitchen';
          if (i === 3) nodeIcon.textContent = 'moped';
          if (i === 4) nodeIcon.textContent = 'home_pin';
        }
      }
    }
  }

  // Real-Time Delivery Timer for all active orders
  function tickLiveOrderTimer() {
    const orders = getActiveOrders();
    if (!orders || orders.length === 0) {
      if (liveTimerInterval) {
        clearInterval(liveTimerInterval);
        liveTimerInterval = null;
      }
      renderActiveOrdersUI();
      return;
    }

    const now = Date.now();
    let anyStepChanged = false;
    let ordersToKeep = [];

    orders.forEach((order) => {
      if (!order.placedAt) {
        order.placedAt = now - 60000;
        order.durationSec = 30 * 60;
      }

      const elapsedSec = Math.floor((now - order.placedAt) / 1000);
      const totalDuration = order.durationSec || 1800;
      const remainingSec = Math.max(0, totalDuration - elapsedSec);

      const mins = Math.floor(remainingSec / 60);
      const secs = remainingSec % 60;
      const formattedCountdown = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      const etaText = remainingSec > 0 ? `${mins + 1} mins` : 'Arrived';

      let calculatedStep = 1;
      if (elapsedSec >= 1800) {
        calculatedStep = 4;
      } else if (elapsedSec >= 720) {
        calculatedStep = 3;
      } else if (elapsedSec >= 60) {
        calculatedStep = 2;
      } else {
        calculatedStep = 1;
      }

      const stageConfig = ORDER_STAGES.find((s) => s.step === calculatedStep) || ORDER_STAGES[0];
      if (order.step !== calculatedStep) {
        anyStepChanged = true;
        showToast(`Order ${order.id}: ${stageConfig.name}`, 'moped');
      }

      order.step = calculatedStep;
      order.statusText = stageConfig.name;
      order.statusSub = stageConfig.sub;
      order.statusIcon = stageConfig.icon;
      order.eta = etaText;
      order.countdownText = formattedCountdown;

      // Update in-card countdown chip & ETA directly for silky smooth ticking
      const chipEl = document.getElementById(`chip-countdown-${order.id}`);
      if (chipEl) {
        chipEl.innerHTML = `<span class="material-symbols-outlined">schedule</span> ${formattedCountdown}`;
      }
      const etaEl = document.getElementById(`card-eta-${order.id}`);
      if (etaEl) {
        etaEl.textContent = etaText;
      }
      const statusPillEl = document.getElementById(`card-status-${order.id}`);
      if (statusPillEl) {
        statusPillEl.textContent = order.statusText;
      }
      const headingEl = document.getElementById(`card-heading-${order.id}`);
      if (headingEl) {
        headingEl.textContent = order.statusText;
      }
      const subEl = document.getElementById(`card-sub-${order.id}`);
      if (subEl) {
        subEl.textContent = order.statusSub;
      }

      // Check if this order is currently displayed in the tracking modal
      if (currentModalOrderId === order.id && orderModal && orderModal.classList.contains('is-open')) {
        const modalCountdownEl = document.getElementById('modal-timer-countdown');
        const modalPhaseEl = document.getElementById('modal-timer-phase-text');
        if (modalCountdownEl) {
          modalCountdownEl.textContent = remainingSec > 0 ? `${formattedCountdown} Mins` : 'Delivered!';
        }
        if (modalPhaseEl) {
          modalPhaseEl.textContent = order.statusText;
        }
        if (orderModalEta) {
          orderModalEta.textContent = remainingSec > 0 ? `~${mins + 1} mins (${formattedCountdown})` : 'Arrived at Doorstep';
        }
        updateTimelineUI(calculatedStep);
      }

      // Keep orders that haven't expired past 45 mins
      if (elapsedSec < 2700) {
        ordersToKeep.push(order);
      }
    });

    if (ordersToKeep.length !== orders.length || anyStepChanged) {
      localStorage.setItem('khalo_active_orders', JSON.stringify(ordersToKeep));
      if (ordersToKeep.length > 0) {
        localStorage.setItem('khalo_active_order', JSON.stringify(ordersToKeep[0]));
      } else {
        localStorage.removeItem('khalo_active_order');
      }
    }

    // Update Top Banner with the latest active order
    const topBanner = document.getElementById('home-active-order-banner');
    if (topBanner) {
      const latest = ordersToKeep[0];
      if (latest && latest.step < 4) {
        topBanner.style.display = 'block';
        const idLabel = document.getElementById('home-order-id-label');
        const statusLabel = document.getElementById('home-order-status-label');
        const etaLabel = document.getElementById('home-order-eta-label');
        if (idLabel) idLabel.textContent = `Order ${latest.id}`;
        if (statusLabel) statusLabel.textContent = latest.statusText || 'Kitchen Preparing';
        if (etaLabel && latest.eta) etaLabel.textContent = `ETA ~${latest.eta}`;
      } else {
        topBanner.style.display = 'none';
      }
    }
  }

  function startLiveOrderTimer() {
    if (liveTimerInterval) clearInterval(liveTimerInterval);
    tickLiveOrderTimer();
    liveTimerInterval = setInterval(tickLiveOrderTimer, 1000);
  }

  // Render the Tracking Modal details for a specific order
  function renderTrackingModal(order) {
    if (!order) return;
    currentModalOrderId = order.id;

    if (orderModalId) orderModalId.textContent = order.id;
    if (orderModalDest) {
      orderModalDest.textContent = order.detailedAddress || order.location || 'Karachi';
      orderModalDest.title = order.detailedAddress || order.location || 'Karachi';
    }
    if (orderModalEta) orderModalEta.textContent = order.eta || '25–35 mins';
    const payText = (order.paymentMethod && order.paymentMethod.includes('Card'))
      ? 'Paid Online (Card)'
      : 'Cash on Delivery (COD)';
    if (orderModalTotal) orderModalTotal.textContent = `Rs. ${(order.grandTotal || 0).toLocaleString()} • ${payText}`;

    // Rider details
    const rider = order.rider || RIDERS_POOL[0];
    if (riderNameEl) riderNameEl.textContent = rider.name;
    if (riderPhoneEl) riderPhoneEl.textContent = rider.phone;
    if (riderBikeEl) riderBikeEl.textContent = rider.bike;

    // Render Dishes Ordered Strip in Modal
    if (modalDishesTagsEl) {
      const items = Array.isArray(order.items) ? order.items : [];
      if (items.length > 0) {
        modalDishesTagsEl.innerHTML = items
          .map((item) => {
            const qty = parseInt(item.quantity, 10) || 1;
            const name = item.title || item.name || item.item || 'Delicious Dish';
            return `
              <div class="modal-dish-pill">
                <span class="dish-pill-qty">${qty}x</span>
                <span class="dish-pill-name">${name}</span>
              </div>
            `;
          })
          .join('');
      } else {
        modalDishesTagsEl.innerHTML = '<div class="modal-dish-pill"><span class="dish-pill-name">Custom KhaLo Feast</span></div>';
      }
    }

    updateTimelineUI(order.step || 1);
  }

  // Open tracking modal for a specific order
  function openTrackingModal(orderId) {
    const order = getOrderById(orderId);
    if (!order) return;
    renderTrackingModal(order);
    if (orderModal) {
      orderModal.classList.add('is-open');
    }
  }

  // Render All Active Orders in cart page
  function renderActiveOrdersUI() {
    const container = document.getElementById('active-orders-container');
    if (!container) return;

    const orders = getActiveOrders().filter((o) => o && o.step < 4);

    if (orders.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    container.innerHTML = orders
      .map((order) => {
        const items = Array.isArray(order.items) ? order.items : [];
        const dishesHtml = items.length > 0
          ? items
              .map((it) => {
                const qty = parseInt(it.quantity, 10) || 1;
                const name = it.title || it.name || it.item || 'Delicious Dish';
                return `
                  <span class="order-dish-tag">
                    <span class="dish-tag-qty">${qty}x</span>
                    <span class="dish-tag-name">${name}</span>
                  </span>
                `;
              })
              .join('')
          : '<span class="order-dish-tag"><span class="dish-tag-name">Special KhaLo Feast</span></span>';

        const initialCountdown = order.countdownText || '29:50';
        const initialEta = order.eta || '30 mins';

        return `
          <div class="active-order-card" data-order-id="${order.id}">
            <div class="active-order-header">
              <div class="active-order-title-group">
                <span class="active-order-badge-live">
                  <span class="pulse-dot"></span> LIVE ORDER
                </span>
                <span class="active-order-id">${order.id}</span>
              </div>
              <span class="active-order-status-pill" id="card-status-${order.id}">${order.statusText || 'Order Placed & Confirmed'}</span>
            </div>

            <div class="active-order-body">
              <div class="active-order-status-main">
                <div class="status-icon-box">
                  <span class="material-symbols-outlined" id="card-icon-${order.id}">${order.statusIcon || 'receipt_long'}</span>
                </div>
                <div class="status-text-box">
                  <h4 id="card-heading-${order.id}">${order.statusText || 'Order Placed & Confirmed'}</h4>
                  <p id="card-sub-${order.id}">${order.statusSub || 'Your meal is being prepared hot in Karachi.'}</p>
                </div>
              </div>

              <!-- Ordered Dishes Strip -->
              <div class="active-order-dishes-strip">
                <div class="active-order-dishes-header">
                  <div class="active-order-dishes-title">
                    <span class="material-symbols-outlined">restaurant_menu</span>
                    <span>Items in this Order</span>
                  </div>
                </div>
                <div class="order-dishes-tags">
                  ${dishesHtml}
                </div>
              </div>

              <div class="active-order-meta-grid">
                <div class="meta-item">
                  <span class="meta-label">Estimated Arrival</span>
                  <div class="meta-arrival-row">
                    <span class="meta-val highlight" id="card-eta-${order.id}">${initialEta}</span>
                    <span class="small-countdown-chip" id="chip-countdown-${order.id}">
                      <span class="material-symbols-outlined">schedule</span> ${initialCountdown}
                    </span>
                  </div>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Delivering To</span>
                  <span class="meta-val">${order.detailedAddress || order.location || 'Clifton, Karachi'}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Payment</span>
                  <span class="meta-val" style="color: ${order.paymentMethod && order.paymentMethod.includes('Card') ? '#059669' : '#ea580c'}; font-weight: 700;">
                    ${order.paymentMethod && order.paymentMethod.includes('Card') ? 'Paid via Card' : 'Cash on Delivery (COD)'}
                  </span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Grand Total</span>
                  <span class="meta-val">Rs. ${(order.grandTotal || 0).toLocaleString()}</span>
                </div>
              </div>

              <div class="active-order-actions">
                <button type="button" class="active-card-btn-primary" data-action="open-tracker" data-order-id="${order.id}">
                  <span class="material-symbols-outlined">moped</span>
                  Open Live Tracker
                </button>
                <button type="button" class="active-card-btn-outline" data-action="cancel-order" data-order-id="${order.id}">
                  Cancel / Clear
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    // Attach event listeners for each rendered card
    container.querySelectorAll('[data-action="open-tracker"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const orderId = e.currentTarget.getAttribute('data-order-id');
        openTrackingModal(orderId);
      });
    });

    container.querySelectorAll('[data-action="cancel-order"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const orderId = e.currentTarget.getAttribute('data-order-id');
        const orders = getActiveOrders().filter((o) => o.id !== orderId);
        saveActiveOrders(orders);
        showToast(`Order ${orderId} cancelled / cleared`, 'delete');
      });
    });
  }

  // Backward compatibility alias
  function renderActiveOrderCard() {
    renderActiveOrdersUI();
  }

  // Checkout and Order Placement (Inline COD and Card Payment)
  function setupCheckout() {
    const payCodRadio = document.getElementById('pay-method-cod');
    const payCardRadio = document.getElementById('pay-method-card');
    const codLabel = document.getElementById('pay-method-cod-label');
    const cardLabel = document.getElementById('pay-method-card-label');
    const paymentCodInfo = document.getElementById('payment-cod-info');
    const paymentCardFormWrap = document.getElementById('payment-card-form-wrap');
    const checkoutBtnText = document.getElementById('cart-checkout-btn-text');
    const checkoutBtnIcon = document.getElementById('cart-checkout-btn-icon');

    // Inline Card Inputs
    const cardNameInput = document.getElementById('cart-card-name');
    const cardNumberInput = document.getElementById('cart-card-number');
    const cardExpiryInput = document.getElementById('cart-card-expiry');
    const cardCvvInput = document.getElementById('cart-card-cvv');
    const cardBrandBadge = document.getElementById('cart-card-brand-badge');
    const autofillVisaBtn = document.getElementById('cart-autofill-visa');
    const autofillMcBtn = document.getElementById('cart-autofill-mc');

    function updatePaymentChoiceUI() {
      const isCard = payCardRadio && payCardRadio.checked;
      if (codLabel) codLabel.classList.toggle('is-selected', !isCard);
      if (cardLabel) cardLabel.classList.toggle('is-selected', isCard);

      if (paymentCodInfo) paymentCodInfo.style.display = isCard ? 'none' : 'flex';
      if (paymentCardFormWrap) paymentCardFormWrap.style.display = isCard ? 'flex' : 'none';

      if (checkoutBtnText && checkoutBtnIcon) {
        if (isCard) {
          const grandTotalVal = grandTotalEl ? grandTotalEl.textContent : '';
          checkoutBtnText.textContent = grandTotalVal ? `Pay with Card • ${grandTotalVal}` : 'Pay with Card';
          checkoutBtnIcon.textContent = 'arrow_forward';
        } else {
          checkoutBtnText.textContent = 'Confirm Order (Cash on Delivery)';
          checkoutBtnIcon.textContent = 'arrow_forward';
        }
      }
    }

    if (payCodRadio) payCodRadio.addEventListener('change', updatePaymentChoiceUI);
    if (payCardRadio) payCardRadio.addEventListener('change', updatePaymentChoiceUI);

    const OFFICIAL_VISA_SVG = `<svg viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 28px; height: 18px; display: block; border-radius: 3px;"><rect width="36" height="22" rx="3" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="0.8"/><path d="M14.5 15.8l1.8-10.7h2.8l-1.8 10.7h-2.8zm8.2-10.5c-.6-.2-1.5-.4-2.6-.4-2.8 0-4.8 1.5-4.8 3.6 0 1.6 1.4 2.5 2.5 3 .1.6 1.5.9 1.5 1.4 0 .7-.9 1-1.7 1-1.1 0-1.7-.2-2.6-.6l-.4-.2-.4 2.1c.6.2 1.7.5 2.8.5 3 0 5-1.5 5-3.7 0-1.2-.8-2.3-2.5-3-1-.5-1.7-.9-1.7-1.5 0-.5.6-1 1.7-1 .9 0 1.6.2 2.1.5l.2.1.4-1.8zm6.5 5.2l1.4-3.7.8 3.7h-2.2zm3.2 5.3l-2-9.6c-.1-.5-.5-.7-.9-.7h-3.5c-.3 0-.6.1-.7.5l-3.9 9.8h3l.6-1.6h3.6l.3 1.6h2.6zm-18.8-10.7l-2.7 7.3-.3-1.5c-.5-1.7-2-3.5-3.7-4.4l2.5 9.2h3l4.5-10.6h-3.3z" fill="#1434CB"/><path d="M8.7 5.1h-4.7l-.1.5c3.7.9 6.1 3.2 7.1 5.9l-1-5.3c-.2-.8-.7-1.1-1.3-1.1z" fill="#F7B600"/></svg>`;

    const OFFICIAL_MC_SVG = `<svg viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 28px; height: 18px; display: block; border-radius: 3px;"><rect width="36" height="22" rx="3" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="0.8"/><circle cx="14" cy="11" r="6.5" fill="#EB001B"/><circle cx="22" cy="11" r="6.5" fill="#F79E1B"/><path d="M18 6.45a6.5 6.5 0 0 0 0 9.1 6.5 6.5 0 0 0 0-9.1z" fill="#FF5F00"/></svg>`;

    // Card Input Formatting
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        const parts = [];
        for (let i = 0; i < val.length; i += 4) {
          parts.push(val.substring(i, i + 4));
        }
        e.target.value = parts.join(' ');

        // Detect Brand and show official SVG
        if (cardBrandBadge) {
          if (/^4/.test(val)) {
            cardBrandBadge.innerHTML = OFFICIAL_VISA_SVG;
            cardBrandBadge.style.background = 'transparent';
            cardBrandBadge.style.padding = '0';
            cardBrandBadge.classList.add('is-visible');
          } else if (/^(5[1-5]|2[2-7])/.test(val)) {
            cardBrandBadge.innerHTML = OFFICIAL_MC_SVG;
            cardBrandBadge.style.background = 'transparent';
            cardBrandBadge.style.padding = '0';
            cardBrandBadge.classList.add('is-visible');
          } else {
            cardBrandBadge.classList.remove('is-visible');
          }
        }
      });
    }

    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) {
          let month = parseInt(val.substring(0, 2), 10);
          if (month > 12) month = 12;
          if (month < 1 && val.length === 2) month = 1;
          const monthStr = month < 10 ? `0${month}` : `${month}`;
          e.target.value = monthStr + '/' + val.substring(2);
        } else {
          e.target.value = val;
        }
      });
    }

    if (cardCvvInput) {
      cardCvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
      });
    }

    // Instant Test Autofills
    if (autofillVisaBtn) {
      autofillVisaBtn.addEventListener('click', () => {
        if (cardNameInput) cardNameInput.value = 'Muhammad Wasif';
        if (cardNumberInput) {
          cardNumberInput.value = '4242 4242 4242 4242';
          cardNumberInput.dispatchEvent(new Event('input'));
        }
        if (cardExpiryInput) cardExpiryInput.value = '12/28';
        if (cardCvvInput) cardCvvInput.value = '888';
        showToast('Demo Visa Card filled!', 'credit_card');
      });
    }

    if (autofillMcBtn) {
      autofillMcBtn.addEventListener('click', () => {
        if (cardNameInput) cardNameInput.value = 'KhaLo Karachi User';
        if (cardNumberInput) {
          cardNumberInput.value = '5555 4444 3333 2222';
          cardNumberInput.dispatchEvent(new Event('input'));
        }
        if (cardExpiryInput) cardExpiryInput.value = '09/29';
        if (cardCvvInput) cardCvvInput.value = '543';
        showToast('Demo Mastercard filled!', 'credit_card');
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        try {
          cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
        } catch (e) {
          cart = [];
        }

        if (!Array.isArray(cart) || cart.length === 0) {
          showToast('Your cart is empty! Add dishes to order', 'warning');
          return;
        }

        // Extract manual street / gali address
        const manualAddrInput = document.getElementById('cart-manual-address-input');
        const manualNotes = manualAddrInput ? manualAddrInput.value.trim() : '';
        if (manualNotes) {
          localStorage.setItem('khalo_manual_address', manualNotes);
        }

        // Check if Online Card was selected
        const isCardChosen = payCardRadio && payCardRadio.checked;

        if (isCardChosen) {
          const nameVal = cardNameInput ? cardNameInput.value.trim() : '';
          const numVal = cardNumberInput ? cardNumberInput.value.replace(/\s+/g, '') : '';
          const expVal = cardExpiryInput ? cardExpiryInput.value.trim() : '';
          const cvvVal = cardCvvInput ? cardCvvInput.value.trim() : '';

          if (!nameVal || nameVal.length < 3) {
            showToast('Please enter cardholder name.', 'person');
            if (cardNameInput) cardNameInput.focus();
            return;
          }
          if (!numVal || numVal.length < 15) {
            showToast('Please enter a valid 16-digit card number.', 'credit_card');
            if (cardNumberInput) cardNumberInput.focus();
            return;
          }
          if (!expVal || expVal.length < 5 || !expVal.includes('/')) {
            showToast('Please enter expiry date (MM/YY).', 'calendar_month');
            if (cardExpiryInput) cardExpiryInput.focus();
            return;
          }
          if (!cvvVal || cvvVal.length < 3) {
            showToast('Please enter 3-digit CVV.', 'lock');
            if (cardCvvInput) cardCvvInput.focus();
            return;
          }
        }

        // Calculate final amounts
        const subtotal = cart.reduce((s, i) => {
          const qty = parseInt(i.quantity, 10) || 1;
          const price = typeof i.price === 'number'
            ? i.price
            : (parseInt(String(i.price).replace(/[^0-9]/g, ''), 10) || 0);
          return s + (price * qty);
        }, 0);

        const deliveryFee = (subtotal >= 1500 || isFreeDeliveryApplied) ? 0 : deliveryFeeBase;
        const grandTotal = Math.max(0, subtotal + deliveryFee - appliedDiscount);

        // Generate unique Order ID
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const generatedOrderId = `#KL-${randomNum}`;
        const locRaw = localStorage.getItem('khalo_location') || '';
        const cleanLoc = locRaw.replace(/^Karachi\s*—\s*/i, '').trim() || 'Clifton, Karachi';
        const detailedLoc = manualNotes ? `${cleanLoc} • ${manualNotes}` : cleanLoc;

        const currentActiveOrders = getActiveOrders();
        // Assign a distinct rider from the pool
        const assignedRider = RIDERS_POOL[currentActiveOrders.length % RIDERS_POOL.length];

        // Card details if card was used
        let paymentMethodStr = 'Cash on Delivery (COD)';
        let paymentStatusStr = 'Pending (COD)';

        if (isCardChosen) {
          const numRaw = cardNumberInput ? cardNumberInput.value.replace(/\s+/g, '') : '';
          const last4 = numRaw.slice(-4) || '4242';
          const cardBrand = /^4/.test(numRaw) ? 'Visa' : (/^(5[1-5]|2[2-7])/.test(numRaw) ? 'Mastercard' : 'Card');
          paymentMethodStr = `Debit / Credit Card (${cardBrand} •••• ${last4})`;
          paymentStatusStr = 'PAID';
        }

        // Create Active Order Record with real-time 30-min countdown
        const now = Date.now();
        const newOrder = {
          id: generatedOrderId,
          placedAt: now,
          durationSec: 30 * 60, // 30 minutes
          step: 1, // Start at 1: Order Placed & Confirmed
          statusText: 'Order Placed & Confirmed',
          statusSub: isCardChosen ? `Payment Authorized & Received via ${paymentMethodStr}` : 'Received by KhaLo Kitchen (Cash on Delivery)',
          statusIcon: 'receipt_long',
          items: cart.map((it) => {
            const dishTitle = it.title || it.name || it.item || 'Special KhaLo Meal';
            return {
              id: it.id,
              title: dishTitle,
              name: dishTitle,
              price: it.price,
              quantity: parseInt(it.quantity, 10) || 1,
              image: it.image
            };
          }),
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          discount: appliedDiscount,
          promoCode: activePromo || null,
          grandTotal: grandTotal,
          location: cleanLoc,
          detailedAddress: detailedLoc,
          streetNotes: manualNotes,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          eta: '30 mins',
          countdownText: '30:00',
          rider: assignedRider,
          paymentMethod: paymentMethodStr,
          paymentStatus: paymentStatusStr
        };

        // If card was chosen, show brief feedback
        if (isCardChosen) {
          checkoutBtn.disabled = true;
          if (checkoutBtnText) checkoutBtnText.textContent = 'Authorizing Payment...';
        }

        setTimeout(() => {
          // Prepend new order so latest appears at top
          const updatedOrders = [newOrder, ...currentActiveOrders];
          saveActiveOrders(updatedOrders);
          startLiveOrderTimer();

          // Clear Cart items & promo
          cart = [];
          localStorage.setItem('khalo_cart', JSON.stringify(cart));
          appliedDiscount = 0;
          activePromo = '';
          isFreeDeliveryApplied = false;
          localStorage.removeItem('khalo_applied_promo');
          renderCart();

          checkoutBtn.disabled = false;
          updatePaymentChoiceUI();

          // Open live order tracking modal for this new order
          openTrackingModal(newOrder.id);

          const successMsg = isCardChosen 
            ? `Payment Approved! Order confirmed: ${generatedOrderId}` 
            : `Order placed! Tracking ID: ${generatedOrderId}`;
          showToast(successMsg, 'check_circle');
        }, isCardChosen ? 600 : 0);
      });
    }

    // Modal Close button (Back to Home Screen)
    if (orderCloseBtn && orderModal) {
      orderCloseBtn.addEventListener('click', () => {
        orderModal.classList.remove('is-open');
        window.location.href = './home.html';
      });
    }

    // Modal 'X' button
    if (orderModalXBtn && orderModal) {
      orderModalXBtn.addEventListener('click', () => {
        orderModal.classList.remove('is-open');
      });
    }

    // Copy Order ID
    if (orderCopyBtn) {
      orderCopyBtn.addEventListener('click', () => {
        const order = currentModalOrderId ? getOrderById(currentModalOrderId) : getActiveOrder();
        const idToCopy = order ? order.id : (orderModalId?.textContent || '#KL-84920');

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(idToCopy).catch(() => { });
        }

        if (orderCopyText) orderCopyText.textContent = 'Copied!';
        showToast('Order ID Copied', 'content_copy');

        setTimeout(() => {
          if (orderCopyText) orderCopyText.textContent = 'Copy';
        }, 1800);
      });
    }

    // Call Rider Simulation
    if (riderCallBtn) {
      riderCallBtn.addEventListener('click', () => {
        const order = currentModalOrderId ? getOrderById(currentModalOrderId) : getActiveOrder();
        const rName = order?.rider?.name || 'Rider';
        const rPhone = order?.rider?.phone || '+92 300 2849102';
        showToast(`Calling Rider ${rName} (${rPhone})...`, 'call');
      });
    }

    // Timer Box click for demo fast-forward (+5 mins)
    const timerBox = document.getElementById('order-delivery-timer-box');
    if (timerBox) {
      timerBox.style.cursor = 'pointer';
      timerBox.title = 'Click to advance time by +5 mins (Demo Fast-Forward)';
      timerBox.addEventListener('click', () => {
        const orders = getActiveOrders();
        const targetOrder = currentModalOrderId
          ? orders.find((o) => o.id === currentModalOrderId)
          : orders[0];

        if (targetOrder) {
          if (!targetOrder.placedAt) targetOrder.placedAt = Date.now();
          targetOrder.placedAt -= 300000; // shift back by 5 mins in ms
          saveActiveOrders(orders);
          tickLiveOrderTimer();
          showToast(`Fast-forwarded +5 mins for ${targetOrder.id}`, 'fast_forward');
        }
      });
    }

    // Top Banner Track button
    const bannerTrackBtn = document.getElementById('home-order-track-btn');
    if (bannerTrackBtn && orderModal) {
      bannerTrackBtn.addEventListener('click', () => {
        const order = getActiveOrder();
        if (order) {
          openTrackingModal(order.id);
        }
      });
    }

    // Check if opened with #track hash
    if (window.location.hash === '#track') {
      const order = getActiveOrder();
      if (order && orderModal) {
        openTrackingModal(order.id);
      }
    }
  }

  // Navbar functions
  function initNavbar() {
    // Mobile drawer handled universally by location-dropdown.js

    // Display current location
    const locClean = (localStorage.getItem('khalo_location') || '').replace(/^Karachi\s*—\s*/i, '').trim();
    if (destLocationText) {
      destLocationText.textContent = locClean ? `${locClean}, Karachi` : 'Select Area, Karachi';
    }
    const navLocationText = document.getElementById('current-location-text');
    if (navLocationText) {
      navLocationText.textContent = locClean || 'Select Area';
    }

    window.addEventListener('khalo_location_changed', (e) => {
      const loc = e.detail && e.detail.location ? e.detail.location : (localStorage.getItem('khalo_location') || '');
      const clean = loc.replace(/^Karachi\s*—\s*/i, '').trim();
      if (destLocationText) destLocationText.textContent = clean ? `${clean}, Karachi` : 'Select Area, Karachi';
      if (navLocationText) navLocationText.textContent = clean || 'Select Area';
    });
  }

  // Setup Manual Street / Gali / House / Delivery Instructions Message Box
  function setupManualAddressInput() {
    const addrInput = document.getElementById('cart-manual-address-input');
    const clearBtn = document.getElementById('btnClearManualAddr');
    if (!addrInput) return;

    // Prefill from localStorage or logged-in user street
    let initialVal = localStorage.getItem('khalo_manual_address') || '';
    if (!initialVal) {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (user && user.street) {
          initialVal = user.street;
        }
      } catch (e) {}
    }

    if (initialVal) {
      addrInput.value = initialVal;
      if (clearBtn) clearBtn.style.display = 'inline-block';
    }

    addrInput.addEventListener('input', () => {
      const val = addrInput.value.trim();
      if (val) {
        localStorage.setItem('khalo_manual_address', addrInput.value);
        if (clearBtn) clearBtn.style.display = 'inline-block';
      } else {
        localStorage.removeItem('khalo_manual_address');
        if (clearBtn) clearBtn.style.display = 'none';
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        addrInput.value = '';
        localStorage.removeItem('khalo_manual_address');
        clearBtn.style.display = 'none';
        addrInput.focus();
      });
    }
  }

  // Init
  function init() {
    initNavbar();
    setupPromo();
    setupManualAddressInput();
    setupCheckout();
    renderCart();
    renderActiveOrderCard();
    startLiveOrderTimer();

    // Check existing order for modal or URL param redirection
    const urlParams = new URLSearchParams(window.location.search);
    const trackOrderId = urlParams.get('track') || urlParams.get('orderPlaced');
    if (trackOrderId) {
      setTimeout(() => {
        const targetOrder = getOrderById(trackOrderId);
        if (targetOrder) {
          openTrackingModal(targetOrder.id);
          showToast(`Order confirmed! Tracking ${targetOrder.id}`, 'check_circle');
        }
      }, 350);
    } else {
      const existingOrder = getActiveOrder();
      if (existingOrder) {
        renderTrackingModal(existingOrder);
      }
    }

    // Cross-tab synchronization
    window.addEventListener('storage', (event) => {
      if (event.key === 'khalo_cart') {
        renderCart();
      }
      if (event.key === 'khalo_active_order' || event.key === 'khalo_active_orders') {
        renderActiveOrdersUI();
        const ord = getActiveOrder();
        if (ord) renderTrackingModal(ord);
      }
      if (event.key === 'khalo_applied_promo') {
        activePromo = (localStorage.getItem('khalo_applied_promo') || '').trim().toUpperCase();
        renderCart();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
