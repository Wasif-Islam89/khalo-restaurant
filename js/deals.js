/**
 * KhaLo — deals.js
 * Dedicated Interactivity for KhaLo Deals & Feast Combos Page
 * Features: Live countdown timer, 1-click voucher copying, category filtering,
 * synchronized cart (khalo_cart), favorites (khalo_favorites), and responsive mobile drawer.
 */

(() => {
  'use strict';

  // =========================================================================
  // 1. LIVE COUNTDOWN TIMER (Till Midnight)
  // =========================================================================
  function initCountdownTimer() {
    const hoursEl = document.getElementById('deal-hours');
    const minsEl = document.getElementById('deal-mins');
    const secsEl = document.getElementById('deal-secs');

    if (!hoursEl || !minsEl || !secsEl) return;

    function updateTimer() {
      const now = new Date();
      // Target midnight tonight
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight - now;

      if (diff <= 0) {
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secsEl.textContent = String(secs).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // =========================================================================
  // 2. VOUCHER COPY TO CLIPBOARD & USE IN CART
  // =========================================================================
  function initVoucherCopy() {
    const copyBtns = document.querySelectorAll('.voucher-copy-btn');
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        if (!code) return;

        // Auto-save promo code for cart
        try {
          localStorage.setItem('khalo_applied_promo', code);
        } catch (e) {}

        // Clipboard write with fallback
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).catch(() => {});
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = code;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        // Inline visual feedback
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>Copied!</span>
        `;
        btn.classList.add('copied');

        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove('copied');
        }, 2200);
      });
    });

    // Handle "Use in Cart" buttons
    document.querySelectorAll('.voucher-apply-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        if (code) {
          try {
            localStorage.setItem('khalo_applied_promo', code);
          } catch (e) {}
        }
      });
    });
  }

  // =========================================================================
  // 3. CART & FAVORITES SYNCHRONIZATION
  // =========================================================================
  function syncBadges() {
    // Cart Badge
    const cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) cartBadge.textContent = totalQty;

    // Floating Cart Bar
    const floatingBar = document.getElementById('floating-cart-bar');
    const floatingBadge = document.getElementById('floating-cart-badge');
    const floatingPrice = document.getElementById('floating-cart-price');

    if (floatingBar) {
      if (totalQty > 0) {
        floatingBar.classList.add('is-visible');
        if (floatingBadge) floatingBadge.textContent = `${totalQty} item${totalQty > 1 ? 's' : ''}`;
        if (floatingPrice) floatingPrice.textContent = `Rs. ${totalPrice.toLocaleString()}`;
      } else {
        floatingBar.classList.remove('is-visible');
      }
    }

    // Favorites Badge
    const favs = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    const favBadge = document.getElementById('fav-badge');
    const mobileFavBadge = document.getElementById('mobile-fav-badge');
    if (favBadge) favBadge.textContent = favs.length;
    if (mobileFavBadge) mobileFavBadge.textContent = favs.length;

    // Update active heart buttons
    document.querySelectorAll('.deal-card-fav-btn').forEach((btn) => {
      const dealId = btn.dataset.dealId;
      btn.classList.toggle('is-active', favs.includes(dealId));
    });
  }

  function addDealToCart(deal, btn) {
    let cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const existing = cart.find((i) => i.id === deal.id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        id: deal.id,
        title: deal.title,
        price: deal.price,
        image: deal.image,
        quantity: 1,
        isDeal: true
      });
    }

    localStorage.setItem('khalo_cart', JSON.stringify(cart));
    syncBadges();

    // Silent inline checkmark button feedback
    if (btn) {
      const originalHtml = btn.innerHTML;
      btn.classList.add('is-added');
      btn.innerHTML = `
        <span>Added</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" style="width:15px;height:15px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      `;
      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.classList.remove('is-added');
      }, 1600);
    }
  }

  function toggleDealFavorite(dealId, btn) {
    let favs = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    const idx = favs.indexOf(dealId);
    const card = btn ? btn.closest('.deal-card') : null;
    const dealTitle = card ? (card.querySelector('.deal-title')?.textContent.trim() || 'Exclusive Deal') : 'Exclusive Deal';
    const toastFn = window.showKhaloToast || window.showToast;

    if (idx > -1) {
      favs.splice(idx, 1);
      if (typeof toastFn === 'function') {
        toastFn({
          type: 'unfavorite',
          tag: 'Removed from Favorites',
          title: dealTitle,
          desc: 'Deal removed from your saved favorites',
          icon: 'favorite_border'
        });
      }
    } else {
      favs.push(dealId);
      if (card && typeof window.khaloSaveFavoriteMeta === 'function') {
        const priceText = card.querySelector('.deal-price-current')?.textContent.replace(/[^0-9]/g, '') || '1650';
        const img = card.querySelector('.deal-card-img')?.getAttribute('src') || '../assets/Shahi Dum Biryani.jpg';
        window.khaloSaveFavoriteMeta(dealId, {
          title: dealTitle,
          price: parseInt(priceText, 10) || 1650,
          image: img,
          restaurant: 'KhaLo Feast & Combos',
          deliveryTime: '25-35',
          rating: 4.9,
          reviewsCount: 380,
          badgeText: 'Hot Deal',
          badgeIcon: 'local_offer',
          badgeClass: 'dish-badge--yellow'
        });
      }
      if (typeof toastFn === 'function') {
        toastFn({
          type: 'favorite',
          tag: 'Saved to Favorites',
          title: dealTitle,
          desc: 'Deal saved to your favorites wishlist',
          icon: 'favorite',
          actionText: 'View Saved',
          actionUrl: './favorites.html'
        });
      }
    }
    localStorage.setItem('khalo_favorites', JSON.stringify(favs));
    syncBadges();
  }

  // =========================================================================
  // 4. DEALS CATEGORY FILTERING
  // =========================================================================
  function initCategoryFilters() {
    const filterPills = document.querySelectorAll('.deal-filter-pill');
    const dealCards = document.querySelectorAll('.deal-card');
    const counterEl = document.getElementById('deals-counter-count');

    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const category = pill.dataset.category || 'all';
        let visibleCount = 0;

        dealCards.forEach((card) => {
          const cardCat = card.dataset.category;
          const isMatch = category === 'all' || cardCat === category;
          card.style.display = isMatch ? 'flex' : 'none';
          if (isMatch) visibleCount++;
        });

        if (counterEl) {
          counterEl.textContent = visibleCount;
        }

        // Scroll pill into center on mobile
        pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });
  }

  // =========================================================================
  // 5. ATTACH DEAL BUTTON LISTENERS
  // =========================================================================
  function initDealActions() {
    // Add Deal to Cart buttons: opens quick-view modal instead of adding directly
    document.querySelectorAll('.btn-add-deal, .deals-spotlight-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof window.openKhaloProductModal === 'function') {
          const product = typeof window.resolveKhaloProduct === 'function' ? window.resolveKhaloProduct(btn) : null;
          if (product) {
            window.openKhaloProductModal(product);
            return;
          }
        }
      });
    });

    // Favorites Heart Toggle
    document.querySelectorAll('.deal-card-fav-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dealId = btn.dataset.dealId;
        if (dealId) toggleDealFavorite(dealId, btn);
      });
    });
  }

  // =========================================================================
  // 6. SHARED NAVBAR & APP BEHAVIORS
  // =========================================================================
  function initAppNavigation() {
    // Mobile Drawer handled universally by location-dropdown.js



    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add('is-visible');
        } else {
          backToTopBtn.classList.remove('is-visible');
        }
      });
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Current Year in footer
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // App store badges click feedback
    document.querySelectorAll('.store-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showDealToast('KhaLo Mobile App coming soon on iOS & Android!');
      });
    });
  }

  // =========================================================================
  // 7. INITIALIZE ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initCountdownTimer();
    initVoucherCopy();
    initCategoryFilters();
    initDealActions();
    initAppNavigation();
    syncBadges();
  });
})();
