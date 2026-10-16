/**
 * KhaLo — payment.js
 * Dedicated Online Card Payment System
 */

(function () {
  'use strict';

  // State
  let cart = [];
  let subtotal = 0;
  let deliveryFee = 99;
  let discountAmount = 0;
  let grandTotal = 0;
  let appliedPromoCode = '';

  const RIDERS_POOL = [
    { name: 'Tariq Mehmood', phone: '+92 312 8492019', bike: 'Honda CD70 (KHI-8921)' },
    { name: 'Zubair Khan', phone: '+92 301 5591024', bike: 'Yamaha YBR (KHI-3042)' },
    { name: 'Bilal Ahmed', phone: '+92 333 4910291', bike: 'United 125 (KHI-7128)' },
    { name: 'Hamza Farooq', phone: '+92 345 8820194', bike: 'Super Power (KHI-1092)' }
  ];

  // DOM Elements
  const cardHolderInput = document.getElementById('card-holder-input');
  const cardNumberInput = document.getElementById('card-number-input');
  const cardExpiryInput = document.getElementById('card-expiry-input');
  const cardCvvInput = document.getElementById('card-cvv-input');
  const cardForm = document.getElementById('card-payment-form');
  const btnSubmitPay = document.getElementById('btn-submit-pay');
  const btnPayText = document.getElementById('btn-pay-text');

  // Preview elements
  const virtualCardEl = document.getElementById('virtual-card-element');
  const cardPreviewBrand = document.getElementById('card-preview-brand');
  const cardPreviewNumber = document.getElementById('card-preview-number');
  const cardPreviewHolder = document.getElementById('card-preview-holder');
  const cardPreviewExpiry = document.getElementById('card-preview-expiry');
  const inputBrandIndicator = document.getElementById('input-brand-indicator');

  // Sidebar Elements
  const sidebarItemsList = document.getElementById('sidebar-items-list');
  const sidebarItemsCount = document.getElementById('sidebar-items-count');
  const sidebarDestLoc = document.getElementById('sidebar-dest-location');
  const sidebarDestNotes = document.getElementById('sidebar-dest-notes');
  const billSubtotal = document.getElementById('bill-subtotal');
  const billDelivery = document.getElementById('bill-delivery');
  const billDiscountRow = document.getElementById('bill-discount-row');
  const billDiscount = document.getElementById('bill-discount');
  const billGrandTotal = document.getElementById('bill-grand-total');

  // Autofill buttons
  const btnFillVisa = document.getElementById('btn-fill-visa');
  const btnFillMastercard = document.getElementById('btn-fill-mastercard');
  const tabCodMode = document.getElementById('tab-cod-mode');
  const btnFallbackCod = document.getElementById('btn-fallback-cod');

  // Processing Overlay Elements
  const processingOverlay = document.getElementById('payment-processing-overlay');
  const procStep1 = document.getElementById('proc-step-1');
  const procStep2 = document.getElementById('proc-step-2');
  const procStep3 = document.getElementById('proc-step-3');
  const processingTitle = document.getElementById('processing-title-text');
  const processingDesc = document.getElementById('processing-desc-text');

  // Toast
  const toast = document.getElementById('payment-toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  // Load and calculate Cart
  function loadCartData() {
    try {
      cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    } catch (e) {
      cart = [];
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      showToast('No items in cart. Redirecting...');
      setTimeout(() => {
        window.location.href = './cart.html';
      }, 1200);
      return;
    }

    // Subtotal
    subtotal = cart.reduce((sum, item) => {
      const qty = parseInt(item.quantity, 10) || 1;
      const price = typeof item.price === 'number'
        ? item.price
        : (parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0);
      return sum + (price * qty);
    }, 0);

    // Voucher Promo check
    appliedPromoCode = (localStorage.getItem('khalo_applied_promo') || '').trim().toUpperCase();
    let isFreeDelivery = subtotal >= 1500;

    if (appliedPromoCode === 'FREEDEL') {
      isFreeDelivery = true;
      discountAmount = 0;
    } else if (appliedPromoCode === 'KHALO20') {
      discountAmount = Math.round(subtotal * 0.20);
    } else if (appliedPromoCode === 'FEAST500') {
      discountAmount = 500;
    } else if (appliedPromoCode === 'MIDNIGHT40') {
      discountAmount = Math.round(subtotal * 0.40);
    } else {
      discountAmount = 0;
    }

    deliveryFee = isFreeDelivery ? 0 : 99;
    grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

    renderSidebarSummary();
  }

  function renderSidebarSummary() {
    // Total count
    const totalQty = cart.reduce((sum, i) => sum + (parseInt(i.quantity, 10) || 1), 0);
    if (sidebarItemsCount) {
      sidebarItemsCount.textContent = `${totalQty} ${totalQty === 1 ? 'dish' : 'dishes'}`;
    }

    // Address
    const rawLoc = localStorage.getItem('khalo_location') || 'Clifton, Karachi';
    const cleanLoc = rawLoc.replace(/^Karachi\s*—\s*/i, '').trim();
    const manualNotes = localStorage.getItem('khalo_manual_address') || '';

    if (sidebarDestLoc) sidebarDestLoc.textContent = cleanLoc || 'Clifton, Karachi';
    if (sidebarDestNotes) {
      sidebarDestNotes.textContent = manualNotes ? `Delivery note: ${manualNotes}` : 'Direct doorstep delivery';
    }

    // Render Dishes
    if (sidebarItemsList) {
      sidebarItemsList.innerHTML = cart.map((it) => {
        const dishName = it.title || it.name || it.item || 'Delicious Dish';
        const qty = parseInt(it.quantity, 10) || 1;
        const price = typeof it.price === 'number'
          ? it.price
          : (parseInt(String(it.price).replace(/[^0-9]/g, ''), 10) || 0);
        const itemImg = it.image || '../assets/Special Shahi Dum Biryani.jpg';

        return `
          <div class="sidebar-item-row">
            <img class="sidebar-item-thumb" src="${itemImg}" alt="${dishName}" onerror="this.src='../assets/khalo_logo_clean.png';" />
            <div class="sidebar-item-details">
              <div class="sidebar-item-name">${dishName}</div>
              <div class="sidebar-item-qty">Qty: ${qty}</div>
            </div>
            <div class="sidebar-item-price">Rs. ${(price * qty).toLocaleString()}</div>
          </div>
        `;
      }).join('');
    }

    // Bill details
    if (billSubtotal) billSubtotal.textContent = `Rs. ${subtotal.toLocaleString()}`;
    if (billDelivery) {
      billDelivery.textContent = deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`;
      billDelivery.style.color = deliveryFee === 0 ? '#10b981' : 'inherit';
    }

    if (discountAmount > 0) {
      if (billDiscountRow) billDiscountRow.style.display = 'flex';
      if (billDiscount) billDiscount.textContent = `-Rs. ${discountAmount.toLocaleString()}`;
    } else {
      if (billDiscountRow) billDiscountRow.style.display = 'none';
    }

    if (billGrandTotal) billGrandTotal.textContent = `Rs. ${grandTotal.toLocaleString()}`;
    if (btnPayText) btnPayText.textContent = `Pay Rs. ${grandTotal.toLocaleString()} Securely`;
  }

  // Detect card brand from number
  function getCardBrand(num) {
    const clean = num.replace(/\s+/g, '');
    if (/^4/.test(clean)) return { name: 'VISA', bg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #121110 100%)' };
    if (/^(5[1-5]|2[2-7])/.test(clean)) return { name: 'MASTERCARD', bg: 'linear-gradient(135deg, #27272a 0%, #3f3f46 50%, #18181b 100%)' };
    if (/^506/.test(clean)) return { name: 'PAYPAK', bg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #0c0a09 100%)' };
    return { name: 'VISA', bg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #121110 100%)' };
  }

  // Live Card Preview formatting
  function setupLiveCardInputs() {
    // Cardholder Name
    if (cardHolderInput) {
      cardHolderInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (cardPreviewHolder) {
          cardPreviewHolder.textContent = val ? val.toUpperCase() : 'YOUR NAME';
        }
      });
    }

    // Card Number formatting (Auto-space every 4 digits)
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 16) val = val.substring(0, 16);

        // Group by 4
        const parts = [];
        for (let i = 0; i < val.length; i += 4) {
          parts.push(val.substring(i, i + 4));
        }
        const formatted = parts.join(' ');
        e.target.value = formatted;

        // Detect brand and show official SVG
        const brand = getCardBrand(val);
        const OFFICIAL_VISA_SVG = `<svg viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 32px; height: 20px; display: block; border-radius: 3px;"><rect width="36" height="22" rx="3" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="0.8"/><path d="M14.5 15.8l1.8-10.7h2.8l-1.8 10.7h-2.8zm8.2-10.5c-.6-.2-1.5-.4-2.6-.4-2.8 0-4.8 1.5-4.8 3.6 0 1.6 1.4 2.5 2.5 3 .1.6 1.5.9 1.5 1.4 0 .7-.9 1-1.7 1-1.1 0-1.7-.2-2.6-.6l-.4-.2-.4 2.1c.6.2 1.7.5 2.8.5 3 0 5-1.5 5-3.7 0-1.2-.8-2.3-2.5-3-1-.5-1.7-.9-1.7-1.5 0-.5.6-1 1.7-1 .9 0 1.6.2 2.1.5l.2.1.4-1.8zm6.5 5.2l1.4-3.7.8 3.7h-2.2zm3.2 5.3l-2-9.6c-.1-.5-.5-.7-.9-.7h-3.5c-.3 0-.6.1-.7.5l-3.9 9.8h3l.6-1.6h3.6l.3 1.6h2.6zm-18.8-10.7l-2.7 7.3-.3-1.5c-.5-1.7-2-3.5-3.7-4.4l2.5 9.2h3l4.5-10.6h-3.3z" fill="#1434CB"/><path d="M8.7 5.1h-4.7l-.1.5c3.7.9 6.1 3.2 7.1 5.9l-1-5.3c-.2-.8-.7-1.1-1.3-1.1z" fill="#F7B600"/></svg>`;
        const OFFICIAL_MC_SVG = `<svg viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 32px; height: 20px; display: block; border-radius: 3px;"><rect width="36" height="22" rx="3" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="0.8"/><circle cx="14" cy="11" r="6.5" fill="#EB001B"/><circle cx="22" cy="11" r="6.5" fill="#F79E1B"/><path d="M18 6.45a6.5 6.5 0 0 0 0 9.1 6.5 6.5 0 0 0 0-9.1z" fill="#FF5F00"/></svg>`;

        if (cardPreviewBrand) {
          cardPreviewBrand.innerHTML = brand.name === 'MASTERCARD' ? OFFICIAL_MC_SVG : OFFICIAL_VISA_SVG;
        }
        if (virtualCardEl) virtualCardEl.style.background = brand.bg;

        if (inputBrandIndicator) {
          inputBrandIndicator.innerHTML = brand.name === 'MASTERCARD' ? OFFICIAL_MC_SVG : OFFICIAL_VISA_SVG;
          inputBrandIndicator.className = 'input-brand-indicator is-visible';
          inputBrandIndicator.style.background = 'transparent';
          inputBrandIndicator.style.padding = '0';
        }

        // Preview formatted digits
        if (cardPreviewNumber) {
          if (!val) {
            cardPreviewNumber.textContent = '•••• •••• •••• ••••';
          } else {
            let displayStr = '';
            for (let i = 0; i < 16; i++) {
              if (i > 0 && i % 4 === 0) displayStr += ' ';
              displayStr += (i < val.length) ? val[i] : '•';
            }
            cardPreviewNumber.textContent = displayStr;
          }
        }
      });
    }

    // Expiry Date (MM/YY formatting)
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.substring(0, 4);

        if (val.length >= 2) {
          let month = parseInt(val.substring(0, 2), 10);
          if (month > 12) month = 12;
          if (month < 1 && val.length === 2) month = 1;
          const monthStr = month < 10 ? `0${month}` : `${month}`;
          e.target.value = monthStr + '/' + val.substring(2);
        } else {
          e.target.value = val;
        }

        if (cardPreviewExpiry) {
          cardPreviewExpiry.textContent = e.target.value || 'MM/YY';
        }
      });
    }

    // CVV input
    if (cardCvvInput) {
      cardCvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
      });

      cardCvvInput.addEventListener('focus', () => {
        if (virtualCardEl) {
          virtualCardEl.style.transform = 'rotateY(10deg) scale(1.02)';
        }
      });

      cardCvvInput.addEventListener('blur', () => {
        if (virtualCardEl) {
          virtualCardEl.style.transform = 'none';
        }
      });
    }
  }

  // Demo card auto-fill handlers
  function setupDemoButtons() {
    if (btnFillVisa) {
      btnFillVisa.addEventListener('click', () => {
        cardHolderInput.value = 'Muhammad Wasif';
        cardNumberInput.value = '4242 4242 4242 4242';
        cardExpiryInput.value = '12/28';
        cardCvvInput.value = '888';

        cardNumberInput.dispatchEvent(new Event('input'));
        cardHolderInput.dispatchEvent(new Event('input'));
        cardExpiryInput.dispatchEvent(new Event('input'));

        showToast('Demo Visa Card autofilled!');
      });
    }

    if (btnFillMastercard) {
      btnFillMastercard.addEventListener('click', () => {
        cardHolderInput.value = 'KhaLo Karachi User';
        cardNumberInput.value = '5555 4444 3333 2222';
        cardExpiryInput.value = '08/29';
        cardCvvInput.value = '543';

        cardNumberInput.dispatchEvent(new Event('input'));
        cardHolderInput.dispatchEvent(new Event('input'));
        cardExpiryInput.dispatchEvent(new Event('input'));

        showToast('Demo Mastercard autofilled!');
      });
    }

    // Switch to COD handlers
    const handleSwitchToCod = () => {
      const confirmCod = confirm('Switch to Cash on Delivery (COD)? You will pay the rider in cash at your doorstep.');
      if (confirmCod) {
        // Place COD order directly
        placeCodOrderDirectly();
      }
    };

    if (tabCodMode) tabCodMode.addEventListener('click', handleSwitchToCod);
    if (btnFallbackCod) btnFallbackCod.addEventListener('click', handleSwitchToCod);
  }

  // Direct COD order placement from payment page
  function placeCodOrderDirectly() {
    const rawLoc = localStorage.getItem('khalo_location') || 'Clifton, Karachi';
    const cleanLoc = rawLoc.replace(/^Karachi\s*—\s*/i, '').trim();
    const manualNotes = localStorage.getItem('khalo_manual_address') || '';
    const detailedLoc = manualNotes ? `${cleanLoc} • ${manualNotes}` : cleanLoc;

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `#KL-${randomNum}`;
    const assignedRider = RIDERS_POOL[Math.floor(Math.random() * RIDERS_POOL.length)];

    const newOrder = {
      id: orderId,
      placedAt: Date.now(),
      durationSec: 30 * 60,
      step: 1,
      statusText: 'Order Placed & Confirmed',
      statusSub: 'Received by KhaLo Kitchen (Cash on Delivery)',
      statusIcon: 'receipt_long',
      items: cart.map((it) => ({
        id: it.id,
        title: it.title || it.name || it.item || 'Special KhaLo Meal',
        price: it.price,
        quantity: parseInt(it.quantity, 10) || 1,
        image: it.image
      })),
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: discountAmount,
      promoCode: appliedPromoCode || null,
      grandTotal: grandTotal,
      location: cleanLoc,
      detailedAddress: detailedLoc,
      streetNotes: manualNotes,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eta: '30 mins',
      countdownText: '30:00',
      rider: assignedRider,
      paymentMethod: 'Cash on Delivery (COD)',
      paymentStatus: 'Pending (COD)'
    };

    saveOrderAndRedirect(newOrder);
  }

  // Card Form Submit & Bank Processing Simulation
  function setupFormSubmission() {
    if (!cardForm) return;

    cardForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = cardHolderInput ? cardHolderInput.value.trim() : '';
      const numVal = cardNumberInput ? cardNumberInput.value.replace(/\s+/g, '') : '';
      const expVal = cardExpiryInput ? cardExpiryInput.value.trim() : '';
      const cvvVal = cardCvvInput ? cardCvvInput.value.trim() : '';

      // Validation
      if (!nameVal || nameVal.length < 3) {
        showToast('Please enter the full cardholder name.');
        if (cardHolderInput) cardHolderInput.focus();
        return;
      }

      if (!numVal || numVal.length < 15) {
        showToast('Please enter a valid 16-digit card number.');
        if (cardNumberInput) cardNumberInput.focus();
        return;
      }

      if (!expVal || expVal.length < 5 || !expVal.includes('/')) {
        showToast('Please enter a valid expiry date (MM/YY).');
        if (cardExpiryInput) cardExpiryInput.focus();
        return;
      }

      if (!cvvVal || cvvVal.length < 3) {
        showToast('Please enter the 3 or 4-digit CVV code on the back.');
        if (cardCvvInput) cardCvvInput.focus();
        return;
      }

      // Start Bank 3D-Secure Processing Simulation
      if (btnSubmitPay) btnSubmitPay.disabled = true;
      if (processingOverlay) processingOverlay.classList.add('is-open');

      // Step 1: Connecting
      if (procStep1) {
        procStep1.className = 'proc-step is-active';
      }

      setTimeout(() => {
        // Step 2: 3D Secure Verification
        if (procStep1) {
          procStep1.className = 'proc-step is-done';
          const icon = procStep1.querySelector('.material-symbols-outlined');
          if (icon) icon.textContent = 'check_circle';
        }
        if (procStep2) {
          procStep2.className = 'proc-step is-active';
          const icon = procStep2.querySelector('.material-symbols-outlined');
          if (icon) icon.textContent = 'hourglass_top';
        }
        if (processingTitle) processingTitle.textContent = '3D-Secure Authenticating...';
        if (processingDesc) processingDesc.textContent = 'Verifying bank security token and authorizing PKR ' + grandTotal.toLocaleString() + '...';

        setTimeout(() => {
          // Step 3: Approved
          if (procStep2) {
            procStep2.className = 'proc-step is-done';
            const icon = procStep2.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = 'check_circle';
          }
          if (procStep3) {
            procStep3.className = 'proc-step is-done';
            const icon = procStep3.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = 'check_circle';
          }
          if (processingTitle) processingTitle.textContent = 'Payment Authorized Successfully! 🎉';
          if (processingDesc) processingDesc.textContent = 'Transaction complete. Order dispatched to KhaLo kitchen!';

          // Create the Paid Order Record
          const rawLoc = localStorage.getItem('khalo_location') || 'Clifton, Karachi';
          const cleanLoc = rawLoc.replace(/^Karachi\s*—\s*/i, '').trim();
          const manualNotes = localStorage.getItem('khalo_manual_address') || '';
          const detailedLoc = manualNotes ? `${cleanLoc} • ${manualNotes}` : cleanLoc;

          const randomNum = Math.floor(10000 + Math.random() * 90000);
          const orderId = `#KL-${randomNum}`;
          const brand = getCardBrand(numVal).name;
          const last4 = numVal.slice(-4);
          const assignedRider = RIDERS_POOL[Math.floor(Math.random() * RIDERS_POOL.length)];

          const newOrder = {
            id: orderId,
            placedAt: Date.now(),
            durationSec: 30 * 60,
            step: 1,
            statusText: 'Order Placed & Confirmed',
            statusSub: `Payment Received via ${brand} ending in ${last4}`,
            statusIcon: 'receipt_long',
            items: cart.map((it) => ({
              id: it.id,
              title: it.title || it.name || it.item || 'Special KhaLo Meal',
              price: it.price,
              quantity: parseInt(it.quantity, 10) || 1,
              image: it.image
            })),
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            discount: discountAmount,
            promoCode: appliedPromoCode || null,
            grandTotal: grandTotal,
            location: cleanLoc,
            detailedAddress: detailedLoc,
            streetNotes: manualNotes,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            eta: '30 mins',
            countdownText: '30:00',
            rider: assignedRider,
            paymentMethod: `Debit / Credit Card (${brand} •••• ${last4})`,
            paymentStatus: 'PAID',
            cardBrand: brand,
            cardLast4: last4,
            transactionId: `TXN-${Date.now()}`
          };

          setTimeout(() => {
            saveOrderAndRedirect(newOrder);
          }, 900);

        }, 900);
      }, 800);
    });
  }

  // Save order to localStorage and redirect to Cart tracking
  function saveOrderAndRedirect(order) {
    try {
      let orders = [];
      const stored = localStorage.getItem('khalo_active_orders');
      if (stored) {
        orders = JSON.parse(stored);
        if (!Array.isArray(orders)) orders = [];
      }
      orders = [order, ...orders];
      localStorage.setItem('khalo_active_orders', JSON.stringify(orders));
      localStorage.setItem('khalo_active_order', JSON.stringify(order));
    } catch (e) {
      localStorage.setItem('khalo_active_order', JSON.stringify(order));
    }

    // Clear cart & promo
    localStorage.removeItem('khalo_cart');
    localStorage.removeItem('khalo_applied_promo');

    // Redirect to cart page with track ID to open tracking modal immediately
    window.location.href = `./cart.html?track=${encodeURIComponent(order.id)}`;
  }

  // Init
  function init() {
    loadCartData();
    setupLiveCardInputs();
    setupDemoButtons();
    setupFormSubmission();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
