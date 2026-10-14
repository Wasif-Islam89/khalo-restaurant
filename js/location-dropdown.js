/**
 * KhaLo — location-dropdown.js
 * Universal Navbar Location Dropdown & Area Selector for Karachi Deliveries.
 * Synchronizes selected delivery neighborhood across all pages via localStorage ('khalo_location').
 */

(() => {
  'use strict';

  const STORAGE_KEY = 'khalo_location';

  // Delivery Areas in Karachi
  const KARACHI_AREAS = [
    { name: 'Clifton', sub: 'Blocks 1 to 9', time: '20–30 mins' },
    { name: 'DHA', sub: 'Phases 1 to 8', time: '25–35 mins' },
    { name: 'Gulshan-e-Iqbal', sub: 'Blocks 1 to 19', time: '20–30 mins' },
    { name: 'PECHS', sub: 'PECHS & Tariq Road', time: '20–30 mins' },
    { name: 'Bahadurabad', sub: 'Bahadurabad & Sharfabad', time: '15–25 mins' },
    { name: 'Gulistan-e-Johar', sub: 'Blocks 1 to 20', time: '30–40 mins' },
    { name: 'North Nazimabad', sub: 'Blocks A to W', time: '30–40 mins' },
    { name: 'Saddar', sub: 'Saddar & Burns Road', time: '25–35 mins' },
    { name: 'Malir Cantt', sub: 'Cantt & Airport Road', time: '35–45 mins' },
    { name: 'Federal B Area', sub: 'Blocks 1 to 22', time: '25–35 mins' },
    { name: 'North Karachi', sub: 'Sectors 1 to 11', time: '35–45 mins' },
    { name: 'Korangi & Creek', sub: 'Creek & Industrial Area', time: '30–40 mins' }
  ];

  function getCleanLocation() {
    const raw = localStorage.getItem(STORAGE_KEY) || '';
    if (!raw) return '';
    return raw.replace(/^Karachi\s*—\s*/i, '').trim();
  }

  let toastTimer = null;

  function showToast(options, fallbackIcon = 'check_circle') {
    let text = '';
    let icon = fallbackIcon || 'check_circle';
    let type = 'info';

    if (typeof options === 'object' && options !== null) {
      type = options.type || 'info';
      icon = options.icon || (type === 'location' ? 'location_on' : type === 'favorite' ? 'favorite' : type === 'unfavorite' ? 'favorite_border' : 'check_circle');

      if (type === 'favorite') {
        text = 'Saved to Favorites';
      } else if (type === 'unfavorite') {
        text = 'Removed from Favorites';
      } else if (type === 'location') {
        const area = (options.title || '').replace(/^Karachi\s*—\s*/i, '').trim();
        text = area ? `Delivering to ${area}` : 'Delivery Area Set';
      } else if (type === 'cart') {
        text = 'Added to Cart';
      } else {
        text = options.title || options.desc || 'Updated';
      }
    } else if (typeof options === 'string') {
      const msg = options.trim();
      if (/saved to favorites/i.test(msg)) {
        type = 'favorite';
        icon = 'favorite';
        text = 'Saved to Favorites';
      } else if (/removed from favorites/i.test(msg)) {
        type = 'unfavorite';
        icon = 'favorite_border';
        text = 'Removed from Favorites';
      } else if (/^Delivery area set to:/i.test(msg)) {
        type = 'location';
        icon = 'location_on';
        const area = msg.replace(/^Delivery area set to:\s*/i, '').replace(/^Karachi\s*—\s*/i, '').trim();
        text = area ? `Delivering to ${area}` : 'Delivery Area Set';
      } else if (/copied/i.test(msg)) {
        type = 'info';
        icon = 'content_copy';
        text = 'Code Copied';
      } else if (/added to cart/i.test(msg) || /cart updated/i.test(msg) || fallbackIcon === 'shopping_cart' || fallbackIcon === 'shopping_bag') {
        type = 'cart';
        icon = 'shopping_bag';
        text = 'Added to Cart';
      } else if (/removed/i.test(msg)) {
        type = 'unfavorite';
        icon = 'delete';
        text = 'Item Removed';
      } else {
        type = 'info';
        icon = fallbackIcon || 'check_circle';
        text = msg;
      }
    }

    if (!text) text = 'Done';
    if (text.length > 36) {
      text = text.substring(0, 34) + '…';
    }

    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }

    // Set classes
    toast.className = `khalo-toast khalo-toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    // Float above cart bar if quick cart bar is currently visible
    const cartBar = document.querySelector('.floating-cart-bar.is-visible');
    if (cartBar) {
      toast.classList.add('has-floating-cart');
    } else {
      toast.classList.remove('has-floating-cart');
    }

    // Ultra-clean, single-row pill (no paragraphs, no headings, no blinking dot)
    toast.innerHTML = `
      <div class="khalo-toast-pill">
        <span class="material-symbols-outlined khalo-toast-icon">${icon}</span>
        <span class="khalo-toast-text">${text}</span>
      </div>
    `;

    // Trigger animation
    clearTimeout(toastTimer);
    void toast.offsetWidth;

    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    // Auto-dismiss smoothly after 2.2 seconds
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  // Expose globally so all pages and scripts can invoke it
  window.showKhaloToast = showToast;
  window.showToast = showToast;

  window.khaloSaveFavoriteMeta = function (dishId, data) {
    if (!dishId || typeof dishId !== 'string') return;
    try {
      const meta = JSON.parse(localStorage.getItem('khalo_favorites_meta') || '{}');
      meta[dishId] = { ...(meta[dishId] || {}), ...data, id: dishId };
      localStorage.setItem('khalo_favorites_meta', JSON.stringify(meta));
    } catch (e) {}
  };

  function updateAllLabels(loc) {
    const selected = loc !== undefined ? loc : getCleanLocation();
    const displayText = selected || 'Select Area';

    // 1. Desktop navbar text
    const deskTexts = document.querySelectorAll('#current-location-text, .current-location-text');
    deskTexts.forEach((el) => {
      el.textContent = displayText;
    });

    // 2. Mobile navbar text
    const mobileTexts = document.querySelectorAll('#mobile-current-location-text, .mobile-location-info .location-name');
    mobileTexts.forEach((el) => {
      el.textContent = displayText;
    });

    // 3. Cart destination chip text
    const cartDest = document.getElementById('cart-dest-location-text');
    if (cartDest) {
      cartDest.textContent = selected ? `${selected}, Karachi` : 'Select Area, Karachi';
    }

    // 4. Update selected class in dropdown
    document.querySelectorAll('.location-dropdown-item').forEach((btn) => {
      const areaName = btn.getAttribute('data-area');
      const isSelected = selected && areaName && areaName.toLowerCase() === selected.toLowerCase();
      btn.classList.toggle('is-selected', Boolean(isSelected));
      const checkIcon = btn.querySelector('.item-check');
      if (checkIcon) {
        checkIcon.style.display = isSelected ? 'inline-block' : 'none';
      }
    });
  }

  function buildDropdownMenu() {
    let existingMenu = document.getElementById('location-dropdown-menu');
    if (existingMenu) return existingMenu;

    const menu = document.createElement('div');
    menu.className = 'location-dropdown-menu';
    menu.id = 'location-dropdown-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', 'Delivery locations');

    const header = document.createElement('div');
    header.className = 'location-dropdown-header';
    header.innerHTML = `
      <span class="location-dropdown-title">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-container, #ff6b35);">
          <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        Select Delivery Area
      </span>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="location-dropdown-city">Karachi</span>
        <button type="button" class="location-modal-close" aria-label="Close" title="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    const closeBtn = header.querySelector('.location-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeAllDropdowns();
      });
    }

    menu.appendChild(header);

    const list = document.createElement('div');
    list.className = 'location-dropdown-list';

    const currentLoc = getCleanLocation();

    KARACHI_AREAS.forEach((area) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'location-dropdown-item';
      item.setAttribute('data-area', area.name);
      item.setAttribute('role', 'menuitem');

      const isSelected = currentLoc && currentLoc.toLowerCase() === area.name.toLowerCase();
      if (isSelected) {
        item.classList.add('is-selected');
      }

      item.innerHTML = `
        <div class="item-meta">
          <span class="item-name">${area.name}</span>
          <span class="item-time">${area.sub} &bull; ${area.time}</span>
        </div>
        <svg class="item-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: ${isSelected ? 'inline-block' : 'none'};">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        selectArea(area.name);
      });

      list.appendChild(item);
    });

    menu.appendChild(list);
    return menu;
  }

  function selectArea(areaName) {
    localStorage.setItem(STORAGE_KEY, areaName);
    updateAllLabels(areaName);
    closeAllDropdowns();
    showToast({
      type: 'location',
      tag: 'Delivery Area Set',
      title: `${areaName}, Karachi`,
      desc: 'Delivery estimate & kitchen menus updated',
      icon: 'location_on',
      duration: 3200
    });

    // Dispatch global event for other components (e.g. cart checkout)
    window.dispatchEvent(new CustomEvent('khalo_location_changed', {
      detail: { location: areaName }
    }));
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.location-dropdown-menu.is-open').forEach((m) => {
      m.classList.remove('is-open');
    });
    document.querySelectorAll('.location-btn').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
    });
    const backdrop = document.getElementById('location-mobile-backdrop');
    if (backdrop) backdrop.classList.remove('is-open');
  }

  function toggleDropdown(btn, menu) {
    if (!menu) {
      menu = document.getElementById('location-dropdown-menu') || buildDropdownMenu();
    }

    const isOpen = menu.classList.contains('is-open');
    closeAllDropdowns();

    if (!isOpen) {
      // Ensure menu is mounted on document.body so that parent display:none or overflow never hides it
      if (menu.parentNode !== document.body) {
        document.body.appendChild(menu);
      }

      // Close mobile drawer if it was open so screen is completely clear for the modal
      if (typeof window.khaloCloseMobileDrawer === 'function') {
        window.khaloCloseMobileDrawer();
      }

      let backdrop = document.getElementById('location-mobile-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'location-mobile-backdrop';
        backdrop.className = 'location-backdrop';
        backdrop.addEventListener('click', closeAllDropdowns);
        document.body.appendChild(backdrop);
      }

      const isMobile = window.innerWidth < 640 || !btn || btn.offsetParent === null;

      if (isMobile) {
        menu.classList.add('mobile-modal-mode');
        menu.style.position = 'fixed';
        menu.style.top = '';
        menu.style.left = '';
        menu.style.right = '';
        backdrop.classList.add('is-open');
      } else {
        menu.classList.remove('mobile-modal-mode');
        const rect = btn.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 8}px`;
        menu.style.left = 'auto';
        menu.style.right = `${window.innerWidth - rect.right}px`;
        backdrop.classList.remove('is-open');
      }

      menu.classList.add('is-open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  function wireMenuItems(menu) {
    menu.querySelectorAll('.location-dropdown-item').forEach((item) => {
      item.onclick = (e) => {
        e.stopPropagation();
        const area = item.getAttribute('data-area');
        if (area) selectArea(area);
      };
    });
  }

  async function initLocationSelector() {
    const selectors = document.querySelectorAll('.location-selector');
    let sharedMenu = document.getElementById('location-dropdown-menu');
    if (!sharedMenu) {
      sharedMenu = buildDropdownMenu();
      document.body.appendChild(sharedMenu);
    }

    selectors.forEach((wrapper) => {
      const btn = wrapper.querySelector('.location-btn');
      if (!btn) return;

      if (btn.tagName.toLowerCase() === 'a') {
        btn.setAttribute('href', 'javascript:void(0)');
      }
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown(btn, sharedMenu);
      });
    });

    // Mobile nav triggers & Cart "Change" link
    const mobileTriggers = document.querySelectorAll(
      '.mobile-location-trigger, #mobile-location-btn, .mobile-location-info, .cart-dest-link, #cart-change-location-btn, .footer-location-trigger'
    );

    mobileTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const firstBtn = document.querySelector('.location-btn');
        let menu = document.getElementById('location-dropdown-menu') || sharedMenu;
        toggleDropdown(firstBtn, menu);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        !e.target.closest('.location-selector') &&
        !e.target.closest('.location-dropdown-menu') &&
        !e.target.closest('.mobile-location-trigger') &&
        !e.target.closest('#mobile-location-btn') &&
        !e.target.closest('.mobile-location-info')
      ) {
        closeAllDropdowns();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
      }
    });

    // Sync labels immediately
    updateAllLabels();

    // Universal Navbar Header Badges (Cart & Favorites) & Mobile Drawer
    syncUniversalNavBadges();
    initUniversalMobileMenu();
  }

  // Universal Navbar Header Badges (Cart & Favorites)
  function syncUniversalNavBadges() {
    try {
      const cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
      const cartBadge = document.getElementById('cart-badge');
      if (cartBadge) {
        cartBadge.textContent = cart.reduce((s, i) => s + (i.quantity || 1), 0);
      }

      const favs = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
      const favBadge = document.getElementById('fav-badge');
      const mobileFavBadge = document.getElementById('mobile-fav-badge');
      if (favBadge) favBadge.textContent = favs.length;
      if (mobileFavBadge) mobileFavBadge.textContent = favs.length;
    } catch (e) {}
  }

  // Universal Mobile Navigation Drawer Controller
  function initUniversalMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburgerBtn || !mobileMenu) return;

    function openMobileMenu() {
      mobileMenu.classList.remove('hidden-state');
      mobileMenu.classList.add('open-state');
      hamburgerBtn.classList.add('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
      mobileMenu.classList.remove('open-state');
      mobileMenu.classList.add('hidden-state');
      hamburgerBtn.classList.remove('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }

    function toggleMobileMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const isCurrentlyOpen = mobileMenu.classList.contains('open-state');
      if (isCurrentlyOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    // Expose helpers globally
    window.khaloToggleMobileDrawer = toggleMobileMenu;
    window.khaloCloseMobileDrawer = closeMobileMenu;
    window.khaloOpenMobileDrawer = openMobileMenu;

    // Use property assignment to guarantee a single canonical click handler
    hamburgerBtn.onclick = toggleMobileMenu;

    // Close when tapping outside the mobile drawer
    document.addEventListener('click', (event) => {
      if (mobileMenu.classList.contains('open-state')) {
        const clickedInsideMenu = mobileMenu.contains(event.target);
        const clickedHamburger = hamburgerBtn.contains(event.target);
        if (!clickedInsideMenu && !clickedHamburger) {
          closeMobileMenu();
        }
      }
    });

    // Close drawer when any mobile navigation link is clicked (excluding location trigger)
    const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link:not(.mobile-location-trigger)');
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Dismiss drawer when user presses the Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('open-state')) {
        closeMobileMenu();
      }
    });

    // Automatically close the mobile menu if screen expands to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && mobileMenu.classList.contains('open-state')) {
        closeMobileMenu();
      }
    }, { passive: true });
  }

  window.syncUniversalNavBadges = syncUniversalNavBadges;

  // Synchronize across tabs and storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      updateAllLabels();
    }
    if (e.key === 'khalo_cart' || e.key === 'khalo_favorites') {
      syncUniversalNavBadges();
    }
  });

  window.addEventListener('khalo_location_changed', (e) => {
    if (e.detail && e.detail.location) {
      updateAllLabels(e.detail.location);
    }
  });

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocationSelector);
  } else {
    initLocationSelector();
  }
})();
