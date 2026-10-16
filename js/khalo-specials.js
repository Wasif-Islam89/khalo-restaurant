/**
 * KhaLo — khalo-specials.js
 * Dedicated Interactivity for KhaLo Specials & Chef's Signature Curations
 * Features: Category filtering, 1-click cart addition, favorites synchronization,
 * mobile drawer, and live order tracking banner.
 */

(() => {
  'use strict';

  // =========================================================================
  // 1. CART & FAVORITES SYNCHRONIZATION
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
    document.querySelectorAll('.special-card-fav-btn').forEach((btn) => {
      const id = btn.dataset.dishId;
      btn.classList.toggle('is-active', favs.includes(id));
    });
  }

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-icon') || (toast ? toast.querySelector('.toast-icon') : null);
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

  function addSpecialToCart(dish, btn) {
    let cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const existing = cart.find((i) => i.id === dish.id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        id: dish.id,
        title: dish.title,
        price: dish.price,
        image: dish.image,
        quantity: 1,
        isSpecial: true
      });
    }

    localStorage.setItem('khalo_cart', JSON.stringify(cart));
    syncBadges();

    // Inline button checkmark feedback
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

  function toggleSpecialFavorite(dishId, btn) {
    const card = btn ? btn.closest('.special-card') : null;
    const dishTitle = card ? (card.querySelector('.special-card-title')?.textContent.trim() || 'KhaLo Special') : 'KhaLo Special';

    let favs = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    const idx = favs.indexOf(dishId);
    if (idx > -1) {
      favs.splice(idx, 1);
      showToast({
        type: 'unfavorite',
        tag: 'Removed from Favorites',
        title: dishTitle,
        desc: 'Dish removed from your saved favorites',
        icon: 'favorite_border'
      });
    } else {
      favs.push(dishId);
      if (card && typeof window.khaloSaveFavoriteMeta === 'function') {
        const priceText = card.querySelector('.special-price')?.textContent.replace(/[^0-9]/g, '') || '1290';
        const img = card.querySelector('.special-card-img')?.getAttribute('src') || '../assets/Shahi Dum Biryani.jpg';
        window.khaloSaveFavoriteMeta(dishId, {
          title: dishTitle,
          price: parseInt(priceText, 10) || 1290,
          image: img,
          restaurant: 'KhaLo Kitchen • Specials',
          deliveryTime: '25-35',
          rating: 4.9,
          reviewsCount: 420,
          badgeText: 'Chef Special',
          badgeIcon: 'bolt',
          badgeClass: 'dish-badge--bestseller'
        });
      }
      showToast({
        type: 'favorite',
        tag: 'Saved to Favorites',
        title: dishTitle,
        desc: 'Added to your favorites wishlist',
        icon: 'favorite',
        actionText: 'View Saved',
        actionUrl: './favorites.html'
      });
    }
    localStorage.setItem('khalo_favorites', JSON.stringify(favs));
    syncBadges();
  }

  // =========================================================================
  // 2. CATEGORY FILTERING
  // =========================================================================
  function initCategoryFilters() {
    const filterPills = document.querySelectorAll('.special-filter-pill');
    const cards = document.querySelectorAll('.special-card');
    const counterEl = document.getElementById('specials-counter-count');

    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const category = pill.dataset.category || 'all';
        let visibleCount = 0;

        cards.forEach((card) => {
          const cardCat = card.dataset.category;
          const isMatch = category === 'all' || cardCat === category;
          card.style.display = isMatch ? 'flex' : 'none';
          if (isMatch) visibleCount++;
        });

        if (counterEl) {
          counterEl.textContent = visibleCount;
        }

        pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });
  }

  // =========================================================================
  // 3. ATTACH CARD ACTION LISTENERS
  // =========================================================================
  function initCardActions() {
    // Add Special to Cart buttons: opens quick-view modal instead of adding directly
    document.querySelectorAll('.btn-add-special, .specials-spotlight-btn').forEach((btn) => {
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
    document.querySelectorAll('.special-card-fav-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dishId = btn.dataset.dishId;
        if (dishId) toggleSpecialFavorite(dishId, btn);
      });
    });
  }

  // =========================================================================
  // 4. SHARED NAVBAR & APP BEHAVIORS (Exact Parity with Home Page)
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
  }

  // =========================================================================
  // 5. INITIALIZE ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initCategoryFilters();
    initCardActions();
    initAppNavigation();
    syncBadges();
  });
})();
