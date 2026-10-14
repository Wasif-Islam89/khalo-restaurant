// =========================================================================
// KhaLo Home Page — Interactive Scripts
// Plain JavaScript (Beginner-Friendly & No Framework Dependencies)
// =========================================================================

(() => {
  'use strict';

  // =========================================================================
  // 1. MOBILE NAVIGATION DRAWER
  // =========================================================================
  // Managed universally and reliably by location-dropdown.js across all pages.

  // =========================================================================
  // 2. TOAST NOTIFICATIONS & BADGE COUNTERS
  // =========================================================================
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-icon') || (toast ? toast.querySelector('.toast-icon') : null);
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  // Shows a temporary toast message with luxury KhaLo toast system
  function showToast(message, iconName = 'check_circle') {
    if (typeof window.showKhaloToast === 'function') {
      window.showKhaloToast(message, iconName);
      return;
    }
    if (!toast || !toastText) return;

    if (toastIcon) {
      toastIcon.textContent = iconName;
    }
    toastText.textContent = typeof message === 'object' ? (message.title || '') : message;
    toast.classList.add('is-visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  // Updates a counter badge (e.g. cart or favorites) and plays a pop animation
  function bumpBadge(badgeId, delta) {
    const badge = document.getElementById(badgeId);
    if (!badge) return;

    const currentCount = parseInt(badge.textContent, 10) || 0;
    const nextCount = Math.max(0, currentCount + delta);
    badge.textContent = nextCount;

    // Run scale animation if supported by the browser
    if (badge.animate) {
      badge.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.4)' },
          { transform: 'scale(1)' }
        ],
        { duration: 350, easing: 'ease-out' }
      );
    }

    // Keep mobile favorites badge counter in sync with desktop
    if (badgeId === 'fav-badge') {
      const mobileFavBadge = document.getElementById('mobile-fav-badge');
      if (mobileFavBadge) {
        mobileFavBadge.textContent = nextCount;
      }
    }
  }



  // =========================================================================
  // DISH CATALOG & DATA PERSISTENCE
  // =========================================================================
  const DISH_CATALOG = {
    'shahi-dum-biryani-sp': {
      id: 'shahi-dum-biryani-sp',
      title: 'Special Shahi Dum Biryani',
      price: 899,
      image: '../assets/Special Shahi Dum Biryani.jpg'
    },
    'chicken-karahi': {
      id: 'chicken-karahi',
      title: 'Chicken Karahi',
      price: 1150,
      image: '../assets/Chicken Karahi.jpg'
    },
    'seekh-malai-platter': {
      id: 'seekh-malai-platter',
      title: 'Seekh & Malai Platter',
      price: 1450,
      image: '../assets/Seekh & Malai Platter.jpg'
    },
    'smashed-double-burger': {
      id: 'smashed-double-burger',
      title: 'Smashed Double Burger',
      price: 780,
      image: '../assets/Smashed Double Burger.jpg'
    },
    'loaded-beef-burger': {
      id: 'loaded-beef-burger',
      title: 'Loaded Beef Burger',
      price: 850,
      image: '../assets/Loaded beef burger.jpg'
    },
    'animal-fries-mess': {
      id: 'animal-fries-mess',
      title: 'Animal Fries Mess',
      price: 600,
      image: '../assets/Animal Fries Mess.jpg'
    },
    'molten-lava-cake': {
      id: 'molten-lava-cake',
      title: 'Molten Lava Cake',
      price: 550,
      image: '../assets/Molten Lava Cake.jpg'
    }
  };

  // Sync Cart badge and Floating Quick Cart Bar with localStorage
  function syncCartUI() {
    const cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
      cartBadge.textContent = totalQty;
    }

    // Update Floating Mini Cart Bar
    const floatingCartBar = document.getElementById('floating-cart-bar');
    const floatingCartBadge = document.getElementById('floating-cart-badge');
    const floatingCartPrice = document.getElementById('floating-cart-price');

    if (floatingCartBar) {
      if (totalQty > 0) {
        floatingCartBar.classList.add('is-visible');
        if (floatingCartBadge) {
          floatingCartBadge.textContent = `${totalQty} item${totalQty > 1 ? 's' : ''}`;
          if (floatingCartBadge.animate) {
            floatingCartBadge.animate(
              [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }],
              { duration: 300, easing: 'ease-out' }
            );
          }
        }
        if (floatingCartPrice) {
          floatingCartPrice.textContent = `Rs. ${totalPrice.toLocaleString()}`;
        }
      } else {
        floatingCartBar.classList.remove('is-visible');
      }
    }
  }

  // Add Dish to Cart
  function addDishToCart(dish) {
    let cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const existing = cart.find((item) => item.id === dish.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        id: dish.id,
        title: dish.title,
        price: dish.price,
        image: dish.image,
        quantity: 1
      });
    }
    localStorage.setItem('khalo_cart', JSON.stringify(cart));
    syncCartUI();

    // Trigger pop on cart badge
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge && cartBadge.animate) {
      cartBadge.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
        { duration: 350, easing: 'ease-out' }
      );
    }
  }

  // Sync Favorites badges & heart buttons
  function syncFavoritesUI() {
    let favorites = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    if (favorites.length === 0 && !localStorage.getItem('khalo_favorites_init')) {
      // Default to 3 curated favorites if first time
      favorites = ['shahi-dum-biryani-sp', 'smashed-double-burger', 'animal-fries-mess'];
      localStorage.setItem('khalo_favorites', JSON.stringify(favorites));
      localStorage.setItem('khalo_favorites_init', 'true');
    }

    const favBadge = document.getElementById('fav-badge');
    const mobileFavBadge = document.getElementById('mobile-fav-badge');
    if (favBadge) favBadge.textContent = favorites.length;
    if (mobileFavBadge) mobileFavBadge.textContent = favorites.length;

    const allFavBtns = document.querySelectorAll('.fav-toggle');
    allFavBtns.forEach((btn) => {
      const card = btn.closest('.dish-card, .midnight-card');
      const dishId = btn.dataset.dishId || card?.dataset.dishId;
      const isFav = dishId && favorites.includes(dishId);
      btn.classList.toggle('is-active', !!isFav);
      btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    });
  }

  // Toggle Favorite
  function toggleFavoriteDish(dishId, dishName) {
    let favorites = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    const index = favorites.indexOf(dishId);
    let isNowActive = false;

    if (index > -1) {
      favorites.splice(index, 1);
      isNowActive = false;
      showToast({
        type: 'unfavorite',
        tag: 'Removed from Favorites',
        title: dishName,
        desc: 'Dish removed from your saved favorites',
        icon: 'favorite_border'
      });
    } else {
      favorites.push(dishId);
      isNowActive = true;

      const btn = document.querySelector(`.fav-toggle[data-dish-id="${dishId}"]`);
      const card = btn ? btn.closest('.dish-card, .midnight-card') : null;
      if (card && typeof window.khaloSaveFavoriteMeta === 'function') {
        const title = dishName || card.querySelector('.dish-name, .midnight-card-title')?.textContent.trim() || 'Dish';
        const priceText = card.querySelector('.dish-price, .midnight-card-price')?.textContent.replace(/[^0-9]/g, '') || '850';
        const img = card.querySelector('.dish-img, .midnight-img')?.getAttribute('src') || '../assets/Shahi Dum Biryani.jpg';
        const restaurant = card.querySelector('.dish-restaurant, .midnight-card-meta')?.textContent.trim() || 'KhaLo Kitchen • Karachi';
        window.khaloSaveFavoriteMeta(dishId, {
          title: title,
          price: parseInt(priceText, 10) || 850,
          image: img,
          restaurant: restaurant,
          deliveryTime: '25-35',
          rating: 4.9,
          reviewsCount: 420,
          badgeText: 'Bestseller',
          badgeIcon: 'bolt',
          badgeClass: 'dish-badge--bestseller'
        });
      }

      showToast({
        type: 'favorite',
        tag: 'Saved to Favorites',
        title: dishName,
        desc: 'Added to your favorites wishlist',
        icon: 'favorite',
        actionText: 'View Saved',
        actionUrl: './favorites.html'
      });
    }

    localStorage.setItem('khalo_favorites', JSON.stringify(favorites));
    syncFavoritesUI();
    return isNowActive;
  }

  // Sync Location text with localStorage
  function syncLocationUI() {
    const savedLocation = localStorage.getItem('khalo_location') || '';
    const cleanLocation = savedLocation ? savedLocation.replace(/^Karachi\s*—\s*/i, '').trim() : 'Select Area';
    const desktopLoc = document.getElementById('current-location-text');
    if (desktopLoc) {
      desktopLoc.textContent = cleanLocation;
    }
    const mobileLoc = document.querySelector('.mobile-location-info .location-name');
    if (mobileLoc) {
      mobileLoc.textContent = cleanLocation;
    }
    const mobileAreaLabel = document.getElementById('mobile-current-location-text');
    if (mobileAreaLabel) {
      mobileAreaLabel.textContent = cleanLocation;
    }
  }

  // Sync Active Order notification banner
  function syncActiveOrderUI() {
    const banner = document.getElementById('home-active-order-banner');
    if (!banner) return;

    const rawOrder = localStorage.getItem('khalo_active_order');
    if (!rawOrder) {
      banner.style.display = 'none';
      return;
    }

    try {
      const order = JSON.parse(rawOrder);
      if (order && order.id && order.step < 4) {
        banner.style.display = 'block';
        const idLabel = document.getElementById('home-order-id-label');
        const statusLabel = document.getElementById('home-order-status-label');
        const etaLabel = document.getElementById('home-order-eta-label');
        if (idLabel) idLabel.textContent = `Order ${order.id}`;
        if (statusLabel) statusLabel.textContent = order.statusText || 'Kitchen Preparing';
        if (etaLabel && order.eta) etaLabel.textContent = `ETA ~${order.eta}`;
      } else {
        banner.style.display = 'none';
      }
    } catch (e) {
      banner.style.display = 'none';
    }
  }

  // =========================================================================
  // 4. FAVORITES TOGGLING
  // =========================================================================
  const favoriteButtons = document.querySelectorAll('.fav-toggle');

  favoriteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const card = button.closest('.dish-card, .midnight-card');
      const dishId = button.dataset.dishId || card?.dataset.dishId || 'dish';
      let dishName = 'Dish';

      if (card) {
        const nameElement = card.querySelector('.dish-name, .midnight-card-title');
        if (nameElement) {
          dishName = nameElement.textContent.trim();
        }
      }

      if (dishName === 'Dish' && DISH_CATALOG[dishId]) {
        dishName = DISH_CATALOG[dishId].title;
      }

      // Restart heart animation
      button.classList.remove('pop');
      void button.offsetWidth;
      button.classList.add('pop');

      toggleFavoriteDish(dishId, dishName);
    });
  });

  // =========================================================================
  // 5. MOOD SELECTOR
  // =========================================================================
  const moodPills = document.querySelectorAll('.mood-pill');

  moodPills.forEach((pill) => {
    // Set initial aria-pressed state based on whether it is pre-selected
    const isInitiallyActive = pill.classList.contains('mood-pill--active');
    pill.setAttribute('aria-pressed', isInitiallyActive ? 'true' : 'false');

    pill.addEventListener('click', () => {
      // Deactivate all pills
      moodPills.forEach((item) => {
        item.classList.remove('mood-pill--active');
        item.setAttribute('aria-pressed', 'false');

        const moodName = item.querySelector('.mood-name');
        if (moodName) {
          moodName.classList.remove('mood-name--active');
        }

        const moodDesc = item.querySelector('.mood-desc');
        if (moodDesc) {
          moodDesc.classList.remove('mood-desc--active');
        }
      });

      // Activate the clicked pill
      pill.classList.add('mood-pill--active');
      pill.setAttribute('aria-pressed', 'true');

      const activeMoodName = pill.querySelector('.mood-name');
      if (activeMoodName) {
        activeMoodName.classList.add('mood-name--active');
      }

      const activeMoodDesc = pill.querySelector('.mood-desc');
      if (activeMoodDesc) {
        activeMoodDesc.classList.add('mood-desc--active');
      }
    });
  });

  // =========================================================================
  // 6. ADD TO CART (POPULAR DISHES + MIDNIGHT CRAVINGS)
  // =========================================================================
  const addToCartButtons = document.querySelectorAll('.btn-add, .btn-add-cart');

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Open quick-view modal instead of directly adding to cart
      if (typeof window.openKhaloProductModal === 'function') {
        const product = (typeof window.resolveKhaloProduct === 'function' ? window.resolveKhaloProduct(button) : null);
        if (product) {
          window.openKhaloProductModal(product);
          return;
        }
      }

      const card = button.closest('.dish-card, .midnight-card, .hero-spotlight-card');
      const dishId = button.dataset.id || card?.dataset.dishId || 'dish';
      if (DISH_CATALOG[dishId] && typeof window.openKhaloProductModal === 'function') {
        window.openKhaloProductModal(DISH_CATALOG[dishId]);
      }
    });
  });

  // =========================================================================
  // 7. DEALS
  // =========================================================================
  const dealButtons = document.querySelectorAll('.btn-deal');

  dealButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const dealCard = button.closest('.deal-card');
      let dealTitle = 'Deal';

      if (dealCard) {
        const titleElement = dealCard.querySelector('.deal-title');
        if (titleElement) {
          dealTitle = titleElement.textContent.trim();
        }
      }

      // Show toast with 'local_offer' icon (no emojis)
      showToast(`${dealTitle} — applied!`, 'local_offer');
    });
  });

  // =========================================================================
  // 8. NEWSLETTER SUBSCRIPTION FORM
  // =========================================================================
  const newsletterForm = document.getElementById('newsletter-form');

  if (newsletterForm) {
    const emailInput = document.getElementById('newsletter-email');
    const statusMsg = document.getElementById('newsletter-msg');

    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const emailValue = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const isValidEmail = emailPattern.test(emailValue);

      if (!isValidEmail) {
        // Show error message with error icon
        statusMsg.classList.add('is-error');
        statusMsg.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">error</span><span>Please enter a valid email address.</span>';
        emailInput.focus();
        return;
      }

      // Show success message with 'restaurant' icon (no emojis)
      statusMsg.classList.remove('is-error');
      statusMsg.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">restaurant</span><span>Shukriya! You\'re on the list — deals coming your way</span>';
      newsletterForm.reset();
    });
  }

  // =========================================================================
  // 9. BACK TO TOP BUTTON
  // =========================================================================
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    function handleScroll() {
      if (window.scrollY > 600) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 10. DYNAMIC FOOTER YEAR
  // =========================================================================
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 11. ANIMATED STATS COUNTER
  // =========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animates numbers counting up smoothly when scrolled into view
  function countUp(element) {
    const targetValue = parseInt(element.dataset.count, 10);
    const suffix = element.dataset.suffix || '';

    if (Number.isNaN(targetValue) || prefersReducedMotion) return;

    const animationDuration = 1400;
    const startTime = performance.now();

    function updateFrame(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      // Ease out cubic formula for natural deceleration
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(targetValue * easeOutProgress);

      element.textContent = currentValue.toLocaleString('en-US') + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateFrame);
      }
    }

    requestAnimationFrame(updateFrame);
  }

  // =========================================================================
  // 12. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // =========================================================================
  if (!('IntersectionObserver' in window)) return;

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const targetElement = entry.target;

      // If it is a statistic number, run the count-up animation
      if (targetElement.classList.contains('stat-value')) {
        countUp(targetElement);
      } else {
        targetElement.classList.add('is-visible');

        // Clean up animation classes once transition completes
        targetElement.addEventListener('transitionend', function onTransitionEnd(event) {
          if (event.propertyName !== 'transform') return;
          targetElement.classList.remove('animate-on-scroll', 'is-visible');
          targetElement.style.transitionDelay = '';
          targetElement.removeEventListener('transitionend', onTransitionEnd);
        });
      }

      // Stop observing element once it has animated
      observer.unobserve(targetElement);
    });
  }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.12 });

  // Observe all statistics numbers
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach((el) => scrollObserver.observe(el));

  if (prefersReducedMotion) return;

  // Elements to reveal with smooth fade/slide as user scrolls
  const animatedSelectors = [
    '.section-header',
    '.mood-pill',
    '.dish-card',
    '.how-card',
    '.decision-card',
    '.midnight-header',
    '.midnight-card',
    '.deal-card',
    '.review-card',
    '.cta-card'
  ];

  const staggeredCardClasses = [
    'mood-pill',
    'dish-card',
    'how-card',
    'midnight-card',
    'deal-card',
    'review-card'
  ];

  const elementsToAnimate = document.querySelectorAll(animatedSelectors.join(', '));

  elementsToAnimate.forEach((element) => {
    element.classList.add('animate-on-scroll');

    // Add staggered delay for grid card items
    const isStaggeredCard = staggeredCardClasses.some((className) => element.classList.contains(className));
    if (isStaggeredCard && element.parentElement) {
      const siblings = Array.from(element.parentElement.children);
      const cardIndex = siblings.indexOf(element);
      element.style.transitionDelay = (cardIndex % 6) * 80 + 'ms';
    }

    scrollObserver.observe(element);
  });

  // =========================================================================
  // 13. INITIALIZE SHARED APP STATES (CART, FAVORITES, LOCATION, ORDER)
  // =========================================================================
  syncLocationUI();
  syncCartUI();
  syncFavoritesUI();
  syncActiveOrderUI();

  // Listen for storage changes across tabs or pages
  window.addEventListener('storage', (event) => {
    if (event.key === 'khalo_cart') syncCartUI();
    if (event.key === 'khalo_favorites') syncFavoritesUI();
    if (event.key === 'khalo_location') syncLocationUI();
    if (event.key === 'khalo_active_order') syncActiveOrderUI();
  });
})();