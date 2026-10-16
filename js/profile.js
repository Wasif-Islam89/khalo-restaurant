// =========================================================================
// KhaLo — Account & Profile System JavaScript (2026 Edition)
// File: js/profile.js
// 100% Functional: Live Orders, Favorites, Dynamic Addresses, Profile & Security
// =========================================================================

(function () {
  'use strict';

  // ----- Master Dishes Catalog (Matches favorites.js) -----
  const CATALOG = {
    'shahi-dum-biryani-sp': {
      id: 'shahi-dum-biryani-sp',
      title: 'Special Shahi Dum Biryani',
      restaurant: 'KhaLo Kitchen • Clifton',
      price: 1150,
      image: '../assets/Special Shahi Dum Biryani.jpg'
    },
    'chicken-karahi': {
      id: 'chicken-karahi',
      title: 'Desi Chicken Karahi',
      restaurant: 'Shinwari Dera • Highway',
      price: 950,
      image: '../assets/Chicken Karahi.jpg'
    },
    'smashed-double-burger': {
      id: 'smashed-double-burger',
      title: 'Smashed Double Burger',
      restaurant: 'Burger Lab • Gulshan',
      price: 890,
      image: '../assets/Smashed Double Burger.jpg'
    },
    'loaded-beef-burger': {
      id: 'loaded-beef-burger',
      title: 'Loaded Beef Burger',
      restaurant: 'Smash Shack • DHA Phase 6',
      price: 820,
      image: '../assets/Loaded Beef Burger.jpg'
    },
    'animal-fries-mess': {
      id: 'animal-fries-mess',
      title: 'Animal Fries Mess',
      restaurant: 'Messy Kitchen • PECHS',
      price: 650,
      image: '../assets/Animal Fries Mess.jpg'
    },
    'seekh-malai-platter': {
      id: 'seekh-malai-platter',
      title: 'Seekh & Malai Platter',
      restaurant: 'Zameer Ansari • Sindhi Muslim',
      price: 1250,
      image: '../assets/Seekh & Malai Platter.jpg'
    },
    'molten-lava-cake': {
      id: 'molten-lava-cake',
      title: 'Molten Lava Cake',
      restaurant: 'Sweet Affairs • Clifton',
      price: 550,
      image: '../assets/Molten Lava Cake.jpg'
    }
  };

  // ----- Default User State -----
  let currentUser = {
    fullName: 'Wasif',
    email: 'wasif@example.com',
    phone: '+92 300 1234567',
    area: 'Clifton Block 4',
    street: 'Apartment 4B, Ocean Heights, Block 4, Clifton, Karachi',
    bio: 'Karachi foodie craving genuine spicy Biryani & charcoal BBQ. Ring doorbell twice upon arrival.',
    avatar: '',
    password: ''
  };

  // ----- DOM Elements -----
  const userDisplayTitle = document.getElementById('userDisplayTitle');
  const userPillEmail = document.getElementById('userPillEmail');
  const userPillPhone = document.getElementById('userPillPhone');
  const userPillArea = document.getElementById('userPillArea');
  const profileAvatarImage = document.getElementById('profileAvatarImage');

  // Input Fields
  const profName = document.getElementById('profName');
  const profEmail = document.getElementById('profEmail');
  const profPhone = document.getElementById('profPhone');
  const profArea = document.getElementById('profArea');
  const profStreet = document.getElementById('profStreet');
  const profBio = document.getElementById('profBio');

  // Hero Stat Badges & Tab Badges
  const heroFavCount = document.getElementById('heroFavCount');
  const tabFavBadge = document.getElementById('tabFavBadge');
  const heroActiveOrderCount = document.getElementById('heroActiveOrderCount');
  const navFavBadge = document.getElementById('fav-badge');
  const navCartBadge = document.getElementById('cart-badge');

  // Favorites Grid Elements
  const portalFavDishesGrid = document.getElementById('portalFavDishesGrid');
  const portalFavEmptyState = document.getElementById('portalFavEmptyState');

  // Addresses Elements
  const addressCardsGrid = document.getElementById('addressCardsGrid');
  const openAddAddressBtn = document.getElementById('openAddAddressBtn');
  const addAddressModal = document.getElementById('addAddressModal');
  const cancelAddAddressBtn = document.getElementById('cancelAddAddressBtn');
  const newAddressForm = document.getElementById('newAddressForm');

  // Toast
  const toast = document.getElementById('portalToast');
  const toastHeading = document.getElementById('toastHeading');
  const toastBody = document.getElementById('toastBody');
  let toastTimer = null;

  function showToast(title, message) {
    if (!toast) return;
    toastHeading.textContent = title;
    toastBody.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // =========================================================================
  // 1. INITIALIZE & LOAD USER DATA
  // =========================================================================
  function loadUserSession() {
    try {
      // 1. Read users list
      let users = [];
      try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) users = JSON.parse(storedUsers);
      } catch (err) { users = []; }

      // 2. Read currentUser
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        currentUser = { ...currentUser, ...parsed };
      }

      // Sync password from users array or seed default
      const userIdx = users.findIndex(u => u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (userIdx !== -1) {
        if (users[userIdx].password) {
          currentUser.password = users[userIdx].password;
        } else {
          users[userIdx].password = currentUser.password || 'KhaLo123';
        }
      } else {
        currentUser.password = currentUser.password || 'KhaLo123';
        users.push({
          fullName: currentUser.fullName,
          email: currentUser.email,
          phone: currentUser.phone,
          area: currentUser.area,
          street: currentUser.street,
          avatar: currentUser.avatar,
          password: currentUser.password
        });
        localStorage.setItem('users', JSON.stringify(users));
      }

      // Reset avatar if it contains legacy dummy unsplash URLs
      if (currentUser.avatar && (currentUser.avatar.includes('photo-1507003211169-0a1dd7228f2d') || currentUser.avatar.includes('photo-1534528741775'))) {
        currentUser.avatar = '';
      }
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Could not read currentUser from localStorage', e);
    }

    const storedLocation = localStorage.getItem('khalo_location');
    if (storedLocation) {
      currentUser.area = storedLocation.replace(/^Karachi\s*—\s*/i, '').trim();
    }

    renderUserHeader();
    renderFavorites();
    renderAddresses();
    syncBadges();
    syncLiveOrderDetails();
    renderActiveSessions();
    handleUrlHashRouting();
  }

  function renderUserHeader() {
    const name = currentUser.fullName || 'Wasif';
    const email = currentUser.email || 'wasif@example.com';
    const phone = currentUser.phone || '+92 300 1234567';
    const area = currentUser.area || 'Karachi (Clifton Block 4)';
    const avatar = currentUser.avatar || '';
    const hasCustomAvatar = avatar && avatar.trim() !== '' && !avatar.includes('photo-1507003211169-0a1dd7228f2d');

    if (userDisplayTitle) userDisplayTitle.textContent = name;
    if (userPillEmail) userPillEmail.textContent = email;
    if (userPillPhone) userPillPhone.textContent = phone;
    if (userPillArea) userPillArea.textContent = area.includes('Karachi') ? area : `Karachi (${area})`;
    
    // Hero Banner Avatar: Toggle SVG icon vs custom image
    const profileAvatarSvg = document.getElementById('profileAvatarSvg');
    if (profileAvatarImage) {
      if (hasCustomAvatar) {
        profileAvatarImage.src = avatar;
        profileAvatarImage.style.display = 'block';
        if (profileAvatarSvg) profileAvatarSvg.style.display = 'none';
      } else {
        profileAvatarImage.src = '';
        profileAvatarImage.style.display = 'none';
        if (profileAvatarSvg) profileAvatarSvg.style.display = 'flex';
      }
    }

    // Form Photo Preview: Toggle SVG icon vs custom image
    const formAvatarPreview = document.getElementById('formAvatarPreview');
    const formAvatarSvg = document.getElementById('formAvatarSvg');
    if (formAvatarPreview) {
      if (hasCustomAvatar) {
        formAvatarPreview.src = avatar;
        formAvatarPreview.style.display = 'block';
        if (formAvatarSvg) formAvatarSvg.style.display = 'none';
      } else {
        formAvatarPreview.src = '';
        formAvatarPreview.style.display = 'none';
        if (formAvatarSvg) formAvatarSvg.style.display = 'flex';
      }
    }

    // Navbar Profile Avatar & SVG Toggle (Circle in nav)
    const navBtn = document.getElementById('navProfileBtn');
    const navAvatar = document.getElementById('navProfileAvatar');
    const navIcon = document.getElementById('navProfileIcon');

    if (navAvatar && navIcon) {
      if (hasCustomAvatar) {
        navAvatar.src = avatar;
        navAvatar.style.display = 'block';
        navIcon.style.display = 'none';
        if (navBtn) navBtn.classList.add('has-avatar');

        navAvatar.onerror = function () {
          navAvatar.style.display = 'none';
          navIcon.style.display = 'block';
          if (navBtn) navBtn.classList.remove('has-avatar');
        };
      } else {
        navAvatar.style.display = 'none';
        navIcon.style.display = 'block';
        if (navBtn) navBtn.classList.remove('has-avatar');
      }
    }

    const mobNavAvatar = document.getElementById('mobileNavProfileAvatar');
    const mobNavIcon = document.getElementById('mobileNavProfileIcon');
    if (mobNavAvatar && mobNavIcon) {
      if (hasCustomAvatar) {
        mobNavAvatar.src = avatar;
        mobNavAvatar.style.display = 'inline-block';
        mobNavIcon.style.display = 'none';
        mobNavAvatar.onerror = function () {
          mobNavAvatar.style.display = 'none';
          mobNavIcon.style.display = 'inline-block';
        };
      } else {
        mobNavAvatar.style.display = 'none';
        mobNavIcon.style.display = 'inline-block';
      }
    }

    if (profName) profName.value = name;
    if (profEmail) profEmail.value = email;
    if (profPhone) profPhone.value = phone;
    if (profArea) {
      for (let i = 0; i < profArea.options.length; i++) {
        if (profArea.options[i].value.toLowerCase().includes(area.toLowerCase()) || area.toLowerCase().includes(profArea.options[i].value.toLowerCase())) {
          profArea.selectedIndex = i;
          break;
        }
      }
    }
    if (profStreet && currentUser.street) profStreet.value = currentUser.street;
    if (profBio && currentUser.bio) profBio.value = currentUser.bio;
  }

  // =========================================================================
  // 2. FAVORITES MANAGEMENT (LIVE LOCALSTORAGE SYNC)
  // =========================================================================
  function getFavoritesArray() {
    let favs = [];
    try {
      favs = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    } catch (e) {
      favs = [];
    }
    if (!localStorage.getItem('khalo_favorites_seeded') && favs.length === 0) {
      favs = ['shahi-dum-biryani-sp', 'chicken-karahi', 'loaded-beef-burger'];
      localStorage.setItem('khalo_favorites', JSON.stringify(favs));
      localStorage.setItem('khalo_favorites_seeded', 'true');
    }
    return favs;
  }

  function renderFavorites() {
    if (!portalFavDishesGrid) return;

    const favIds = getFavoritesArray();
    const count = favIds.length;

    if (heroFavCount) heroFavCount.textContent = count;
    if (tabFavBadge) tabFavBadge.textContent = count;
    if (navFavBadge) navFavBadge.textContent = count;

    if (count === 0) {
      portalFavDishesGrid.innerHTML = '';
      if (portalFavEmptyState) portalFavEmptyState.style.display = 'flex';
      return;
    }

    if (portalFavEmptyState) portalFavEmptyState.style.display = 'none';

    let html = '';
    favIds.forEach(id => {
      const dish = CATALOG[id] || {
        id: id,
        title: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        restaurant: 'KhaLo Express Kitchen',
        price: 950,
        image: '../assets/Special Shahi Dum Biryani.jpg'
      };

      html += `
        <div class="fav-dish-card" data-dish-id="${dish.id}">
          <div class="fav-dish-thumb">
            <img src="${dish.image}" alt="${dish.title}" onerror="this.src='../assets/Special Shahi Dum Biryani.jpg';" />
            <button type="button" class="fav-remove-btn" data-action="remove-fav" data-id="${dish.id}" title="Remove from favorites">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>
          <div class="fav-dish-body">
            <span class="fav-dish-rest">${dish.restaurant}</span>
            <h4 class="fav-dish-name">${dish.title}</h4>
            <div class="fav-dish-bottom">
              <span class="fav-dish-price">₨ ${dish.price.toLocaleString()}</span>
              <button type="button" class="btn-fav-add-cart" data-action="add-cart" data-id="${dish.id}">
                <i class="fa-solid fa-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      `;
    });

    portalFavDishesGrid.innerHTML = html;
    attachFavoriteActions();
  }

  function attachFavoriteActions() {
    if (!portalFavDishesGrid) return;

    portalFavDishesGrid.querySelectorAll('[data-action="remove-fav"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        removeFavorite(id);
      });
    });

    portalFavDishesGrid.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        addToCart(id);
      });
    });
  }

  function removeFavorite(id) {
    let favs = getFavoritesArray();
    favs = favs.filter(item => item !== id);
    localStorage.setItem('khalo_favorites', JSON.stringify(favs));
    renderFavorites();
    showToast('Removed from Favorites', 'Dish has been removed from your saved list.');
  }

  function addToCart(id) {
    const dish = CATALOG[id] || {
      id: id,
      title: 'Delicious Dish',
      price: 950,
      image: '../assets/Special Shahi Dum Biryani.jpg'
    };

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    } catch (e) {
      cart = [];
    }

    const existingIdx = cart.findIndex(item => item.id === id);
    if (existingIdx > -1) {
      cart[existingIdx].qty = (cart[existingIdx].qty || 1) + 1;
    } else {
      cart.push({
        id: dish.id,
        title: dish.title,
        price: dish.price,
        qty: 1,
        image: dish.image
      });
    }

    localStorage.setItem('khalo_cart', JSON.stringify(cart));
    if (navCartBadge) navCartBadge.textContent = cart.length;
    showToast('Added to Cart', `${dish.title} added to your shopping cart!`);
  }

  // =========================================================================
  // 3. SAVED ADDRESSES MANAGEMENT (DYNAMIC ADD / DELETE / SET DEFAULT)
  // =========================================================================
  const DEFAULT_ADDRESSES = [
    {
      id: 'addr-home',
      label: 'Home',
      recipient: 'Wasif — +92 300 1234567',
      street: 'Apartment 4B, Ocean Heights, Block 4, Clifton, Karachi South',
      hub: 'KhaLo Clifton Hub (15-20 min)',
      isDefault: true
    },
    {
      id: 'addr-work',
      label: 'Work',
      recipient: 'Wasif (Work Desk)',
      street: 'Floor 6, Tech Tower, Bukhari Commercial, DHA Phase 6, Karachi',
      hub: 'KhaLo DHA Hub (20 min)',
      isDefault: false
    },
    {
      id: 'addr-family',
      label: 'Family',
      recipient: 'Gulshan Residence',
      street: 'House R-142, Block 13D, Gulshan-e-Iqbal, Karachi East',
      hub: 'KhaLo Gulshan Hub (25 min)',
      isDefault: false
    }
  ];

  function getSavedAddresses() {
    try {
      const stored = localStorage.getItem('khalo_saved_addresses');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem('khalo_saved_addresses', JSON.stringify(DEFAULT_ADDRESSES));
    return DEFAULT_ADDRESSES;
  }

  function saveAddresses(addresses) {
    localStorage.setItem('khalo_saved_addresses', JSON.stringify(addresses));
    renderAddresses();
  }

  function renderAddresses() {
    if (!addressCardsGrid) return;
    const addresses = getSavedAddresses();

    let html = '';
    addresses.forEach(addr => {
      const tagClass = addr.label.toLowerCase() === 'work' ? 'work' : (addr.label.toLowerCase() === 'family' ? 'other' : '');
      const icon = addr.label.toLowerCase() === 'work' ? 'fa-briefcase' : (addr.label.toLowerCase() === 'family' ? 'fa-heart' : 'fa-house');

      html += `
        <div class="address-card ${addr.isDefault ? 'is-default' : ''}" data-id="${addr.id}">
          <div class="address-top">
            <span class="address-type-tag ${tagClass}">
              <i class="fa-solid ${icon}"></i> ${addr.label} ${addr.isDefault ? '(Primary)' : ''}
            </span>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              ${addr.isDefault ? '<span class="address-pill-default">DEFAULT</span>' : `
                <button type="button" class="btn-addr-del" data-action="set-default" data-id="${addr.id}" title="Set as primary address">
                  <i class="fa-solid fa-check"></i>
                </button>
                <button type="button" class="btn-addr-del" data-action="del-addr" data-id="${addr.id}" title="Delete address">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              `}
            </div>
          </div>
          <h4 class="address-receiver">${addr.recipient}</h4>
          <p class="address-line">${addr.street}</p>
          <div class="address-footer-bar">
            <span>Hub: <strong>${addr.hub || 'Karachi Express Hub (20 min)'}</strong></span>
          </div>
        </div>
      `;
    });

    addressCardsGrid.innerHTML = html;

    // Attach actions
    addressCardsGrid.querySelectorAll('[data-action="del-addr"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        deleteAddress(id);
      });
    });

    addressCardsGrid.querySelectorAll('[data-action="set-default"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        setDefaultAddress(id);
      });
    });
  }

  function deleteAddress(id) {
    let addrs = getSavedAddresses();
    addrs = addrs.filter(a => a.id !== id);
    saveAddresses(addrs);
    showToast('Address Removed', 'The delivery address has been deleted.');
  }

  function setDefaultAddress(id) {
    let addrs = getSavedAddresses();
    addrs = addrs.map(a => ({ ...a, isDefault: a.id === id }));
    saveAddresses(addrs);

    const defaultAddr = addrs.find(a => a.id === id);
    if (defaultAddr) {
      currentUser.area = defaultAddr.label;
      currentUser.street = defaultAddr.street;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      renderUserHeader();
    }
    showToast('Default Updated', 'Primary delivery address set successfully.');
  }

  // Add Address Modal Handlers
  if (openAddAddressBtn && addAddressModal) {
    openAddAddressBtn.addEventListener('click', () => {
      addAddressModal.classList.add('is-open');
    });
  }

  if (cancelAddAddressBtn && addAddressModal) {
    cancelAddAddressBtn.addEventListener('click', () => {
      addAddressModal.classList.remove('is-open');
    });
  }

  if (newAddressForm) {
    newAddressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const label = document.getElementById('addrLabel').value;
      const recipient = document.getElementById('addrRecipient').value.trim();
      const area = document.getElementById('addrArea').value;
      const street = document.getElementById('addrStreet').value.trim();

      const newAddr = {
        id: 'addr-' + Date.now(),
        label: label,
        recipient: recipient,
        street: `${street}, ${area}, Karachi`,
        hub: `KhaLo ${area.split(' ')[0]} Hub (20 min)`,
        isDefault: false
      };

      const addrs = getSavedAddresses();
      addrs.push(newAddr);
      saveAddresses(addrs);

      newAddressForm.reset();
      if (addAddressModal) addAddressModal.classList.remove('is-open');
      showToast('Address Saved', 'New delivery location added to your saved addresses.');
    });
  }

  // =========================================================================
  // 4. LIVE ORDER SYNCHRONIZATION WITH CART.HTML
  // =========================================================================
  function syncLiveOrderDetails() {
    try {
      const activeOrderData = localStorage.getItem('khalo_active_order');
      if (activeOrderData) {
        const order = JSON.parse(activeOrderData);
        const orderCodeEl = document.querySelector('.live-order-code');
        const orderStampEl = document.querySelector('.live-order-stamp');
        const orderEtaEl = document.getElementById('orderLiveEta');
        const orderPreviewEl = document.querySelector('.live-items-preview');

        if (orderCodeEl && order.id) orderCodeEl.textContent = `Order ${order.id}`;
        if (orderStampEl && order.location) orderStampEl.textContent = `Placed today • Delivering to ${order.location}`;
        if (orderEtaEl && order.eta) orderEtaEl.textContent = order.eta.replace(/~/, '');
        if (orderPreviewEl && order.grandTotal) {
          orderPreviewEl.innerHTML = `<strong>Order Total:</strong> ₨ ${order.grandTotal.toLocaleString()} (Cash on Delivery) • Synchronized with Cart`;
        }
      }
    } catch (e) {}
  }

  // Live Order ETA countdown
  const orderLiveEta = document.getElementById('orderLiveEta');
  if (orderLiveEta) {
    let minutesLeft = 18;
    setInterval(() => {
      if (minutesLeft > 3) {
        minutesLeft--;
        orderLiveEta.textContent = `${minutesLeft} Mins`;
      }
    }, 60000);
  }

  // Past Orders Reorder buttons
  document.querySelectorAll('.past-order-item .btn-reorder-link').forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let dishesToAdd = [];
      if (idx === 0) {
        dishesToAdd = ['loaded-beef-burger', 'animal-fries-mess'];
      } else if (idx === 1) {
        dishesToAdd = ['chicken-karahi'];
      } else {
        dishesToAdd = ['seekh-malai-platter'];
      }

      dishesToAdd.forEach(id => addToCart(id));
      showToast('Reorder Successful', 'Past meal items added to your cart! Taking you to cart...');
      setTimeout(() => {
        window.location.href = './cart.html';
      }, 900);
    });
  });


  // =========================================================================
  // 5.1 DYNAMIC ACTIVE KARACHI DEVICE SESSION (REAL-TIME HARDWARE DETECTION)
  // =========================================================================
  function detectCurrentDevice() {
    const ua = navigator.userAgent || '';
    let deviceName = 'Desktop PC';
    let browserName = 'Web Browser';
    let iconClass = 'fa-desktop';
    let isMobile = false;

    // Detect Device Type & OS
    if (/android/i.test(ua)) {
      isMobile = true;
      iconClass = 'fa-mobile-screen';
      deviceName = /tablet|sm-t/i.test(ua) ? 'Android Tablet' : 'Android Smartphone';
    } else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      isMobile = true;
      iconClass = 'fa-mobile-screen';
      deviceName = /iPad/.test(ua) ? 'Apple iPad' : 'Apple iPhone';
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      iconClass = 'fa-laptop';
      deviceName = 'macOS Mac / MacBook';
    } else if (/Windows NT/i.test(ua)) {
      iconClass = 'fa-laptop';
      deviceName = 'Windows PC';
    } else if (/Linux/i.test(ua)) {
      iconClass = 'fa-laptop';
      deviceName = 'Linux PC';
    }

    // Responsive fallback check (if user opens on mobile viewport or developer mobile emulator)
    if (!isMobile && (window.innerWidth <= 768 || ('ontouchstart' in window && navigator.maxTouchPoints > 0))) {
      isMobile = true;
      iconClass = 'fa-mobile-screen';
      if (deviceName === 'Desktop PC' || deviceName === 'Windows PC') {
        deviceName = 'Mobile Device';
      }
    }

    // Detect Browser
    if (/Edg/i.test(ua)) {
      browserName = 'Microsoft Edge';
    } else if (/Chrome/i.test(ua) && !/Chromium|OPR|Edg/i.test(ua)) {
      browserName = isMobile ? 'Chrome Mobile' : 'Chrome Browser';
    } else if (/Safari/i.test(ua) && !/Chrome|Chromium|OPR/i.test(ua)) {
      browserName = isMobile ? 'Safari Mobile' : 'Safari Browser';
    } else if (/Firefox/i.test(ua)) {
      browserName = 'Firefox';
    } else if (/OPR|Opera/i.test(ua)) {
      browserName = 'Opera Browser';
    }

    return {
      deviceName,
      browserName,
      iconClass,
      isMobile,
      fullTitle: `${deviceName} — ${browserName}`
    };
  }

  function renderActiveSessions() {
    const list = document.getElementById('activeSessionsList');
    if (!list) return;

    const device = detectCurrentDevice();
    const storedLocation = localStorage.getItem('khalo_location') || currentUser.area || 'Karachi (Clifton)';
    const cleanArea = storedLocation.replace(/^Karachi\s*—\s*/i, '').trim();
    const locText = cleanArea ? `${cleanArea}, Karachi` : 'Karachi, Sindh';

    list.innerHTML = `
      <div class="session-entry is-current">
        <div class="session-dev-icon" style="color: var(--primary-container, #ff6b35); background: #fff4ed;">
          <i class="fa-solid ${device.iconClass}"></i>
        </div>
        <div class="session-info">
          <span class="s-dev" style="font-weight: 700; color: var(--text-title, #1a1919);">${device.fullTitle} (Current Session)</span>
          <span class="s-loc" style="color: var(--text-muted, #594139); font-size: 0.8rem; margin-top: 3px; display: flex; align-items: center; gap: 0.35rem;">
            <i class="fa-solid fa-location-dot" style="color: var(--primary-container, #ff6b35); font-size: 0.75rem;"></i>
            <span>${locText} • Active right now</span>
          </span>
        </div>
        <span class="badge-this-device" style="display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 700; background: #dcfce7; color: #15803d; padding: 0.3rem 0.75rem; border-radius: 9999px;">
          <i class="fa-solid fa-circle-check"></i> This Device
        </span>
      </div>
    `;
  }

  // Update session dynamically on window resize or rotation
  window.addEventListener('resize', () => {
    renderActiveSessions();
  }, { passive: true });

  // =========================================================================
  // 6. TABS NAVIGATION & QUICK BUBBLE ROUTING
  // =========================================================================
  const tabButtons = document.querySelectorAll('.account-tab-btn');
  const tabPanes = document.querySelectorAll('.portal-pane');

  function activateTab(tabId, updateHash = true) {
    if (!tabId) return;

    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });

    if (updateHash && window.location.hash !== `#${tabId}`) {
      try {
        history.replaceState(null, null, `#${tabId}`);
      } catch (e) {}
    }

    const navBar = document.querySelector('.account-nav-bar');
    if (navBar && window.innerWidth < 768) {
      navBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function handleUrlHashRouting() {
    const rawHash = window.location.hash ? window.location.hash.replace('#', '') : '';
    if (rawHash) {
      const tabMap = {
        'orders': 'tab-orders',
        'order': 'tab-orders',
        'live-order': 'tab-orders',
        'tracking': 'tab-orders',
        'tab-orders': 'tab-orders',
        'favorites': 'tab-favorites',
        'favs': 'tab-favorites',
        'saved': 'tab-favorites',
        'tab-favorites': 'tab-favorites',
        'addresses': 'tab-addresses',
        'address': 'tab-addresses',
        'tab-addresses': 'tab-addresses',
        'security': 'tab-security',
        'password': 'tab-security',
        'tab-security': 'tab-security',
        'profile': 'tab-profile',
        'details': 'tab-profile',
        'tab-profile': 'tab-profile'
      };
      const targetTab = tabMap[rawHash.toLowerCase()];
      if (targetTab && document.getElementById(targetTab)) {
        activateTab(targetTab, false);
      }
    }
  }

  window.addEventListener('hashchange', handleUrlHashRouting);

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      activateTab(targetId);
    });
  });

  const heroFavBubble = document.getElementById('heroFavBubble');
  const heroOrderBubble = document.getElementById('heroOrderBubble');

  if (heroFavBubble) {
    heroFavBubble.addEventListener('click', () => activateTab('tab-favorites'));
  }

  if (heroOrderBubble) {
    heroOrderBubble.addEventListener('click', () => activateTab('tab-orders'));
  }

  // =========================================================================
  // 7. PERSONAL DETAILS FORM SAVE
  // =========================================================================
  const profileForm = document.getElementById('profileDetailsForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      currentUser.fullName = profName.value.trim();
      currentUser.email = profEmail.value.trim();
      currentUser.phone = profPhone.value.trim();
      currentUser.area = profArea.value;
      currentUser.street = profStreet.value.trim();
      currentUser.bio = profBio.value.trim();

      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('khalo_location', currentUser.area);

      // Sync changes to users array
      try {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        let idx = users.findIndex(u => u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...currentUser };
          localStorage.setItem('users', JSON.stringify(users));
        }
      } catch (err) {}

      renderUserHeader();
      showToast('Profile Updated', 'Your personal details have been saved successfully.');
    });
  }

  // =========================================================================
  // 7b. SECURITY & PASSWORD FORM SAVE (PERSISTENT WITH LOGIN)
  // =========================================================================
  const securityForm = document.getElementById('securityForm');
  const secCurrentPass = document.getElementById('secCurrentPass');
  const secNewPass = document.getElementById('secNewPass');
  const secConfirmPass = document.getElementById('secConfirmPass');

  if (securityForm && secCurrentPass && secNewPass && secConfirmPass) {
    securityForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const currentInput = secCurrentPass.value.trim();
      const newPassInput = secNewPass.value;
      const confirmPassInput = secConfirmPass.value;

      // Determine active password from currentUser or users array
      let activePassword = currentUser.password || 'KhaLo123';
      try {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        let matched = users.find(u => u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (matched && matched.password) {
          activePassword = matched.password;
        }
      } catch (err) {}

      if (currentInput !== activePassword) {
        showToast('Password Error', 'Current password is incorrect. Please enter your existing password.');
        secCurrentPass.focus();
        return;
      }

      if (!newPassInput || newPassInput.length < 4) {
        showToast('Weak Password', 'New password must be at least 4 characters long.');
        secNewPass.focus();
        return;
      }

      if (newPassInput !== confirmPassInput) {
        showToast('Mismatch', 'New password and confirm password do not match.');
        secConfirmPass.focus();
        return;
      }

      // Update in currentUser
      currentUser.password = newPassInput;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      // Update in users array so it persists across logout and next login
      try {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        let idx = users.findIndex(u => u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (idx !== -1) {
          users[idx].password = newPassInput;
          users[idx].fullName = currentUser.fullName;
          users[idx].avatar = currentUser.avatar;
        } else {
          users.push({
            fullName: currentUser.fullName,
            email: currentUser.email,
            phone: currentUser.phone,
            area: currentUser.area,
            street: currentUser.street,
            avatar: currentUser.avatar,
            password: newPassInput
          });
        }
        localStorage.setItem('users', JSON.stringify(users));
      } catch (err) {}

      securityForm.reset();
      showToast('Password Updated', 'Your password has been changed successfully. Use your new password when logging in.');
    });
  }

  // Toggle eye visibility buttons
  document.querySelectorAll('.btn-toggle-eye').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');
      if (input && icon) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      }
    });
  });

  // Profile Picture Upload Handler (Reads file as Data URL / Base64)
  const avatarUploadInput = document.getElementById('avatarUploadInput');
  const btnRemoveAvatar = document.getElementById('btnRemoveAvatar');

  if (avatarUploadInput) {
    avatarUploadInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Invalid File', 'Please select a valid image file (JPG, PNG, WebP).');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('Image Too Large', 'Please upload an image smaller than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (evt) {
        const base64Data = evt.target.result;
        currentUser.avatar = base64Data;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        try {
          let users = JSON.parse(localStorage.getItem('users') || '[]');
          let idx = users.findIndex(u => u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
          if (idx !== -1) {
            users[idx].avatar = base64Data;
            localStorage.setItem('users', JSON.stringify(users));
          }
        } catch (err) {}
        renderUserHeader();
        showToast('Photo Updated', 'Your profile picture has been updated and synchronized with the navbar.');
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnRemoveAvatar) {
    btnRemoveAvatar.addEventListener('click', () => {
      currentUser.avatar = '';
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      try {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        let idx = users.findIndex(u => u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (idx !== -1) {
          users[idx].avatar = '';
          localStorage.setItem('users', JSON.stringify(users));
        }
      } catch (err) {}
      if (avatarUploadInput) avatarUploadInput.value = '';
      renderUserHeader();
      showToast('Avatar Removed', 'Profile picture reset to default icon.');
    });
  }

  // =========================================================================
  // 8. LOGOUT CONFIRMATION MODAL
  // =========================================================================
  const heroLogoutBtn = document.getElementById('heroLogoutBtn');
  const logoutModal = document.getElementById('portalLogoutModal');
  const cancelLogoutAction = document.getElementById('cancelLogoutAction');
  const confirmLogoutAction = document.getElementById('confirmLogoutAction');

  function openLogoutDialog() {
    if (logoutModal) logoutModal.classList.add('is-open');
  }

  function closeLogoutDialog() {
    if (logoutModal) logoutModal.classList.remove('is-open');
  }

  if (heroLogoutBtn) heroLogoutBtn.addEventListener('click', openLogoutDialog);
  if (cancelLogoutAction) cancelLogoutAction.addEventListener('click', closeLogoutDialog);

  if (confirmLogoutAction) {
    confirmLogoutAction.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      showToast('Signed Out', 'Redirecting to login page...');
      setTimeout(() => {
        window.location.href = './login.html';
      }, 1000);
    });
  }

  // Close modals on clicking outside or ESC
  [logoutModal, addAddressModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('is-open');
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (logoutModal) logoutModal.classList.remove('is-open');
      if (addAddressModal) addAddressModal.classList.remove('is-open');
    }
  });

  // Mobile navbar hamburger toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      hamburgerBtn.classList.toggle('active');
      mobileMenu.classList.toggle('hidden-state');
    });
  }

  function syncBadges() {
    try {
      const cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
      if (navCartBadge) navCartBadge.textContent = cart.length || 0;
    } catch (e) {}
  }

  // Initialize
  loadUserSession();

})();
