// =========================================================================
// KhaLo Home Page — Interactive Scripts
// Plain JavaScript (Beginner-Friendly & No Framework Dependencies)
// =========================================================================

(() => {
  'use strict';

  // =========================================================================
  // 1. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileMenu) {
    // Opens the mobile navigation drawer
    function openMobileMenu() {
      mobileMenu.classList.remove('hidden-state');
      mobileMenu.classList.add('open-state');
      hamburgerBtn.classList.add('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    }

    // Closes the mobile navigation drawer
    function closeMobileMenu() {
      mobileMenu.classList.remove('open-state');
      mobileMenu.classList.add('hidden-state');
      hamburgerBtn.classList.remove('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }

    // Toggles between open and closed states
    function toggleMobileMenu() {
      const isCurrentlyOpen = mobileMenu.classList.contains('open-state');
      if (isCurrentlyOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    // Toggle drawer when the hamburger button is clicked
    hamburgerBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMobileMenu();
    });

    // Close drawer when any mobile navigation link is clicked
    const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        // Update the active link styling
        mobileNavLinks.forEach((item) => item.classList.remove('active'));
        link.classList.add('active');
        closeMobileMenu();
      });
    });

    // Dismiss drawer when clicking anywhere outside of it
    document.addEventListener('click', (event) => {
      const isMenuOpen = mobileMenu.classList.contains('open-state');
      if (isMenuOpen) {
        const clickedInsideMenu = mobileMenu.contains(event.target);
        const clickedHamburger = hamburgerBtn.contains(event.target);
        if (!clickedInsideMenu && !clickedHamburger) {
          closeMobileMenu();
        }
      }
    });

    // Dismiss drawer when the user presses the Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('open-state')) {
        closeMobileMenu();
      }
    });

    // Automatically close the mobile menu if the screen expands to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && mobileMenu.classList.contains('open-state')) {
        closeMobileMenu();
      }
    }, { passive: true });
  }

  // =========================================================================
  // 2. TOAST NOTIFICATIONS & BADGE COUNTERS
  // =========================================================================
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-icon') || (toast ? toast.querySelector('.toast-icon') : null);
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  // Shows a temporary toast message with a real Material Symbols icon (no emojis)
  function showToast(message, iconName = 'check_circle') {
    if (!toast || !toastText) return;

    // Set the icon glyph name (e.g. 'search', 'favorite', 'shopping_cart', 'local_offer')
    if (toastIcon) {
      toastIcon.textContent = iconName;
    }

    // Set the message text
    toastText.textContent = message;

    // Reveal the toast notification
    toast.classList.add('is-visible');

    // Automatically hide after 2.2 seconds
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2200);
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
  // 3. EXPANDING NAVBAR SEARCH BAR
  // =========================================================================
  const searchWrap = document.getElementById('nav-search-wrap');
  const searchBtn = document.getElementById('search-btn');
  const searchForm = document.getElementById('nav-search-form');
  const searchInput = document.getElementById('nav-search-input');
  const searchCloseBtn = document.getElementById('search-close-btn');

  if (searchWrap && searchBtn && searchInput) {
    // Expands the search bar and focuses the input field
    function openSearch() {
      searchWrap.classList.add('is-open');
      searchBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        searchInput.focus();
      }, 60);
    }

    // Collapses the search bar and clears the query
    function closeSearch() {
      searchWrap.classList.remove('is-open');
      searchBtn.setAttribute('aria-expanded', 'false');
      searchInput.value = '';
      searchBtn.focus();
    }

    // Open on search icon click
    searchBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openSearch();
    });

    // Close when clicking the 'X' button inside the search field
    if (searchCloseBtn) {
      searchCloseBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeSearch();
      });
    }

    // Close search bar when clicking anywhere outside of it
    document.addEventListener('click', (event) => {
      const isSearchOpen = searchWrap.classList.contains('is-open');
      if (isSearchOpen && !searchWrap.contains(event.target)) {
        closeSearch();
      }
    });

    // Close search bar on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && searchWrap.classList.contains('is-open')) {
        closeSearch();
      }
    });

    // Handle search form submission
    if (searchForm) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();

        if (query.length > 0) {
          // Show search toast with 'search' icon (no emojis)
          showToast(`Searching for "${query}"...`, 'search');

          // Scroll smoothly down to popular dishes or menu
          const targetSection = document.getElementById('popular') || document.getElementById('menu');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          searchInput.focus();
        }
      });
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

      const isNowActive = button.classList.toggle('is-active');

      // Restart heart animation
      button.classList.remove('pop');
      void button.offsetWidth; // Force reflow to restart css animation
      button.classList.add('pop');
      button.setAttribute('aria-pressed', isNowActive ? 'true' : 'false');

      // Update badge counter
      bumpBadge('fav-badge', isNowActive ? 1 : -1);

      // Find the dish name from the card
      const dishCard = button.closest('.dish-card');
      let dishName = 'Dish';
      if (dishCard) {
        const nameElement = dishCard.querySelector('.dish-name');
        if (nameElement) {
          dishName = nameElement.textContent.trim();
        }
      }

      // Show toast with 'favorite' icon (no emojis)
      if (isNowActive) {
        showToast(`${dishName} saved to favorites`, 'favorite');
      } else {
        showToast(`${dishName} removed from favorites`, 'favorite');
      }
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
    let resetTimer = null;

    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const itemName = button.dataset.item || 'Item';

      // Increment cart badge and show confirmation toast with 'shopping_cart' icon
      bumpBadge('cart-badge', 1);
      showToast(`${itemName} added to cart`, 'shopping_cart');

      // Visual feedback: temporarily switch button icon to checkmark
      button.classList.add('is-added');
      const iconElement = button.querySelector('.material-symbols-outlined');

      if (iconElement) {
        if (!button.dataset.defaultIcon) {
          button.dataset.defaultIcon = iconElement.textContent.trim() || 'shopping_cart';
        }
        iconElement.textContent = 'check';
      }

      // Reset button back to its default icon after 1.4 seconds
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        button.classList.remove('is-added');
        if (iconElement) {
          iconElement.textContent = button.dataset.defaultIcon || 'shopping_cart';
        }
      }, 1400);
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
})();