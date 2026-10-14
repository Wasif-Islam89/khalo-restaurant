// =========================================================================
// KhaLo — favorites.js
// Dedicated Interactive Script for Liked / Saved Dishes
// Universal Synchronization Across Home, Menu, Specials, Deals & Find My Meal
// =========================================================================

(() => {
  'use strict';

  // Comprehensive Master Catalog encompassing items from all KhaLo sections
  const MASTER_CATALOG = [
    // 1. Home / Universal Signature Dishes
    {
      id: 'shahi-dum-biryani-sp',
      title: 'Special Shahi Dum Biryani',
      restaurant: 'KhaLo Kitchen • Clifton',
      price: 1150,
      image: '../assets/Special Shahi Dum Biryani.jpg',
      deliveryTime: '25-35',
      rating: 4.9,
      reviewsCount: 420,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'chicken-karahi',
      title: 'Desi Chicken Karahi',
      restaurant: 'Shinwari Dera • Highway',
      price: 950,
      image: '../assets/Chicken Karahi.jpg',
      deliveryTime: '30-40',
      rating: 4.8,
      reviewsCount: 310,
      badgeClass: 'dish-badge--default',
      badgeIcon: 'whatshot',
      badgeText: 'Slow-cooked'
    },
    {
      id: 'smashed-double-burger',
      title: 'Smashed Double Burger',
      restaurant: 'Burger Lab • Gulshan',
      price: 890,
      image: '../assets/Smashed Double Burger.jpg',
      deliveryTime: '20-25',
      rating: 4.9,
      reviewsCount: 410,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'local_shipping',
      badgeText: 'Free Delivery'
    },
    {
      id: 'loaded-beef-burger',
      title: 'Loaded Beef Burger',
      restaurant: 'Smash Shack • DHA Phase 6',
      price: 820,
      image: '../assets/Loaded Beef Burger.jpg',
      deliveryTime: '25-30',
      rating: 4.7,
      reviewsCount: 195,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Hot Deal'
    },
    {
      id: 'seekh-malai-platter',
      title: 'Seekh & Malai Platter',
      restaurant: 'Kababjees • Clifton',
      price: 1290,
      image: '../assets/Seekh & Malai Platter.jpg',
      deliveryTime: '30-40',
      rating: 4.9,
      reviewsCount: 520,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'outdoor_grill',
      badgeText: 'Charcoal Smoke'
    },
    {
      id: 'animal-fries-mess',
      title: 'Animal Fries Mess',
      restaurant: 'Late Night Crave • Bahadurabad',
      price: 590,
      image: '../assets/Animal Fries Mess.jpg',
      deliveryTime: '15-20',
      rating: 4.6,
      reviewsCount: 312,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'nightlight',
      badgeText: 'Midnight Hit'
    },
    {
      id: 'shahi-dum-biryani',
      title: 'Shahi Dum Biryani (Chicken)',
      restaurant: 'Handi Dum King • PECHS',
      price: 480,
      image: '../assets/Shahi Dum Biryani.jpg',
      deliveryTime: '25-35',
      rating: 4.9,
      reviewsCount: 1840,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'molten-lava-cake',
      title: 'Molten Lava Cake',
      restaurant: 'Sweet Escape • SMCHS',
      price: 490,
      image: '../assets/Molten Lava Cake.jpg',
      deliveryTime: '15-25',
      rating: 4.9,
      reviewsCount: 1540,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'midnight-burger-crave',
      title: 'Midnight Double Smash',
      restaurant: 'Late Night Crave • Bahadurabad',
      price: 890,
      image: '../assets/Smashed Double Burger.jpg',
      deliveryTime: '20-25',
      rating: 4.9,
      reviewsCount: 310,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'nightlight',
      badgeText: 'Midnight Hit'
    },
    {
      id: 'midnight-animal-fries',
      title: 'Midnight Animal Fries',
      restaurant: 'Late Night Crave • Bahadurabad',
      price: 590,
      image: '../assets/Animal Fries Mess.jpg',
      deliveryTime: '15-20',
      rating: 4.8,
      reviewsCount: 240,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'nightlight',
      badgeText: 'Midnight Hit'
    },
    {
      id: 'midnight-lava-cake',
      title: 'Warm Molten Lava Slice',
      restaurant: 'Sweet Escape • SMCHS',
      price: 490,
      image: '../assets/Molten Lava Cake.jpg',
      deliveryTime: '15-20',
      rating: 4.9,
      reviewsCount: 180,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },

    // 2. Menu Catalog Dishes
    {
      id: 'special-mutton-dum-biryani',
      title: 'Special Mutton Dum Biryani',
      restaurant: 'KhaLo Kitchen • Clifton',
      price: 790,
      image: '../assets/Special Shahi Dum Biryani.jpg',
      deliveryTime: '30-35',
      rating: 4.9,
      reviewsCount: 1220,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'sindhi-spicy-biryani',
      title: 'Karachi Spicy Masala Biryani',
      restaurant: 'KhaLo Kitchen • Clifton',
      price: 520,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      deliveryTime: '25',
      rating: 4.8,
      reviewsCount: 950,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Hot Deal'
    },
    {
      id: 'beef-nalli-biryani',
      title: 'Royal Beef Nalli Biryani',
      restaurant: 'KhaLo Kitchen • Clifton',
      price: 850,
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
      deliveryTime: '35',
      rating: 5.0,
      reviewsCount: 640,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'desi-chicken-karahi',
      title: 'Desi Chicken Karahi',
      restaurant: 'Hot N Spicy • Tariq Road',
      price: 890,
      image: '../assets/Chicken Karahi.jpg',
      deliveryTime: '25-30',
      rating: 4.8,
      reviewsCount: 1100,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'peshawari-mutton-karahi',
      title: 'Peshawari Mutton Karahi',
      restaurant: 'Hot N Spicy • Tariq Road',
      price: 1450,
      image: '../assets/Chicken Karahi.jpg',
      deliveryTime: '35-40',
      rating: 4.9,
      reviewsCount: 780,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'white-handi-special',
      title: 'Special Chicken White Handi',
      restaurant: 'Hot N Spicy • Tariq Road',
      price: 920,
      image: '../assets/Chicken Karahi.jpg',
      deliveryTime: '25-30',
      rating: 4.8,
      reviewsCount: 830,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Hot Deal'
    },
    {
      id: 'charcoal-seekh-kabab',
      title: 'Spiced Beef Seekh Kabab',
      restaurant: 'Kolachi BBQ Grill • Do Darya',
      price: 620,
      image: '../assets/Seekh & Malai Platter.jpg',
      deliveryTime: '20-25',
      rating: 4.9,
      reviewsCount: 1340,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'reshmi-malai-boti',
      title: 'Melt-in-Mouth Chicken Malai Boti',
      restaurant: 'Kolachi BBQ Grill • Do Darya',
      price: 740,
      image: '../assets/Seekh & Malai Platter.jpg',
      deliveryTime: '20-25',
      rating: 4.9,
      reviewsCount: 1520,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'chicken-tikka-boti',
      title: 'Karachi Charcoal Chicken Tikka',
      restaurant: 'Kolachi BBQ Grill • Do Darya',
      price: 420,
      image: '../assets/Seekh & Malai Platter.jpg',
      deliveryTime: '20',
      rating: 4.7,
      reviewsCount: 890,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Hot Deal'
    },
    {
      id: 'crispy-zinger-burger',
      title: 'Crispy Thunder Zinger Burger',
      restaurant: 'Bun & Patty • DHA Phase 6',
      price: 580,
      image: '../assets/Loaded Beef Burger.jpg',
      deliveryTime: '20',
      rating: 4.8,
      reviewsCount: 920,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'local_shipping',
      badgeText: 'Free Delivery'
    },
    {
      id: 'peri-peri-crinkle-fries',
      title: 'Peri Peri Crinkle Cut Fries',
      restaurant: 'Fries Point • Bahadurabad',
      price: 320,
      image: '../assets/Animal Fries Mess.jpg',
      deliveryTime: '15',
      rating: 4.7,
      reviewsCount: 680,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Hot Deal'
    },
    {
      id: 'garlic-butter-naan',
      title: 'Tandoori Garlic Butter Roghni Naan',
      restaurant: 'KhaLo Kitchen • Clifton',
      price: 120,
      image: '../assets/Chicken Karahi.jpg',
      deliveryTime: '10',
      rating: 4.9,
      reviewsCount: 1890,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'local_shipping',
      badgeText: 'Free Delivery'
    },
    {
      id: 'shahi-gulab-jamun-sundae',
      title: 'Warm Shahi Gulab Jamun Sundae',
      restaurant: 'Sweet Escape • SMCHS',
      price: 380,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      deliveryTime: '10',
      rating: 4.8,
      reviewsCount: 930,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Hot Deal'
    },
    {
      id: 'zafrani-matka-kheer',
      title: 'Zafrani Clay-Pot Matka Kheer',
      restaurant: 'Sweet Escape • SMCHS',
      price: 340,
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80',
      deliveryTime: '10',
      rating: 4.9,
      reviewsCount: 780,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'kulhad-sweet-lassi',
      title: 'Special Royal Kulhad Lassi',
      restaurant: 'KhaLo Beverage Bar • Clifton',
      price: 260,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      deliveryTime: '5-10',
      rating: 4.9,
      reviewsCount: 1420,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'chilled-mint-margarita',
      title: 'Fresh Mint Lemon Margarita',
      restaurant: 'KhaLo Beverage Bar • Clifton',
      price: 240,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
      deliveryTime: '5',
      rating: 4.8,
      reviewsCount: 990,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'local_shipping',
      badgeText: 'Free Delivery'
    },
    {
      id: 'chilled-cold-drink',
      title: 'Cold Soft Drink (Can 250ml)',
      restaurant: 'KhaLo Beverage Bar • Clifton',
      price: 120,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
      deliveryTime: '5',
      rating: 4.8,
      reviewsCount: 1200,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Hot Deal'
    },

    // 3. KhaLo Specials
    {
      id: 'spec-shahi-biryani',
      title: 'KhaLo Grand Shahi Dum Biryani',
      restaurant: 'KhaLo Kitchen • Specials',
      price: 1290,
      image: '../assets/Shahi Dum Biryani.jpg',
      deliveryTime: '25-35',
      rating: 4.9,
      reviewsCount: 580,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Signature Dum'
    },
    {
      id: 'spec-desi-karahi',
      title: 'Peshawari Desi Ghee Lamb Karahi',
      restaurant: 'KhaLo Kitchen • Specials',
      price: 1890,
      image: '../assets/Chicken Karahi.jpg',
      deliveryTime: '30-40',
      rating: 4.9,
      reviewsCount: 440,
      badgeClass: 'dish-badge--default',
      badgeIcon: 'whatshot',
      badgeText: 'Pure Desi Makhan'
    },
    {
      id: 'spec-seekh-platter',
      title: 'Charcoal Seekh & Malai Platter',
      restaurant: 'KhaLo Kitchen • Specials',
      price: 1450,
      image: '../assets/Seekh & Malai Platter.jpg',
      deliveryTime: '30-40',
      rating: 4.9,
      reviewsCount: 520,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'outdoor_grill',
      badgeText: 'Woodfire Smoked'
    },
    {
      id: 'spec-master-smash',
      title: 'KhaLo Master Smash Burger Double',
      restaurant: 'KhaLo Kitchen • Specials',
      price: 980,
      image: '../assets/Smashed Double Burger.jpg',
      deliveryTime: '20-25',
      rating: 4.9,
      reviewsCount: 390,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'local_shipping',
      badgeText: 'Fresh Grilled'
    },
    {
      id: 'spec-animal-fries',
      title: 'Animal Mess Loaded Gourmet Fries',
      restaurant: 'KhaLo Kitchen • Specials',
      price: 650,
      image: '../assets/Animal Fries Mess.jpg',
      deliveryTime: '15-20',
      rating: 4.8,
      reviewsCount: 310,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'nightlight',
      badgeText: 'Midnight Hit'
    },
    {
      id: 'spec-dawat-table',
      title: 'Dawat-e-KhaLo Grand Table Pairing',
      restaurant: 'KhaLo Kitchen • Specials',
      price: 2650,
      image: '../assets/Shahi Dum Biryani.jpg',
      deliveryTime: '35-45',
      rating: 4.9,
      reviewsCount: 620,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Family Gathering'
    },
    {
      id: 'spec-midnight-crave',
      title: 'Old Karachi Midnight Crave Box',
      restaurant: 'KhaLo Kitchen • Specials',
      price: 1620,
      image: '../assets/Loaded Beef Burger.jpg',
      deliveryTime: '25-35',
      rating: 4.8,
      reviewsCount: 290,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'nightlight',
      badgeText: 'Dual Craving'
    },
    {
      id: 'spec-dessert-duo',
      title: 'Matka Kheer & Belgian Lava Duo',
      restaurant: 'KhaLo Kitchen • Specials',
      price: 820,
      image: '../assets/Molten Lava Cake.jpg',
      deliveryTime: '15-25',
      rating: 4.9,
      reviewsCount: 340,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Seasonal Pairing'
    },

    // 4. KhaLo Deals
    {
      id: 'deal-royal-feast',
      title: 'Royal Shahi Family Handi Feast',
      restaurant: 'KhaLo Kitchen • Deals Hub',
      price: 2550,
      image: '../assets/Shahi Dum Biryani.jpg',
      deliveryTime: '30-40',
      rating: 4.9,
      reviewsCount: 480,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Save Rs. 650'
    },
    {
      id: 'deal-makhan-karahi',
      title: 'Desi Makhan Karahi & Naan Feast',
      restaurant: 'KhaLo Kitchen • Deals Hub',
      price: 1790,
      image: '../assets/Chicken Karahi.jpg',
      deliveryTime: '30-40',
      rating: 4.8,
      reviewsCount: 360,
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Hot Deal'
    },
    {
      id: 'deal-bbq-lovers',
      title: 'Charcoal BBQ Smoke Lovers Box',
      restaurant: 'KhaLo Kitchen • Deals Hub',
      price: 1490,
      image: '../assets/Seekh & Malai Platter.jpg',
      deliveryTime: '25-35',
      rating: 4.9,
      reviewsCount: 510,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller'
    },
    {
      id: 'deal-burger-duo',
      title: 'Smashed Double Burger Duo Box',
      restaurant: 'KhaLo Kitchen • Deals Hub',
      price: 1650,
      image: '../assets/Smashed Double Burger.jpg',
      deliveryTime: '20-30',
      rating: 4.9,
      reviewsCount: 440,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'local_shipping',
      badgeText: 'Free Fries'
    },
    {
      id: 'deal-mutton-mega',
      title: 'Mutton Dum Biryani Royal Mega Box',
      restaurant: 'KhaLo Kitchen • Deals Hub',
      price: 2190,
      image: '../assets/Special Shahi Dum Biryani.jpg',
      deliveryTime: '35-45',
      rating: 4.9,
      reviewsCount: 390,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Chef Special'
    },
    {
      id: 'deal-dessert-crave',
      title: 'Midnight Sweet Tooth Crave Bundle',
      restaurant: 'KhaLo Kitchen • Deals Hub',
      price: 780,
      image: '../assets/Molten Lava Cake.jpg',
      deliveryTime: '15-25',
      rating: 4.9,
      reviewsCount: 290,
      badgeClass: 'dish-badge--green',
      badgeIcon: 'nightlight',
      badgeText: 'Late Night Hit'
    }
  ];

  // Helper: Retrieve complete dish details from Cached Meta, Master Catalog, or construct graceful fallback
  function getDishById(id) {
    if (!id) return null;

    let cachedMeta = null;
    try {
      const metaStore = JSON.parse(localStorage.getItem('khalo_favorites_meta') || '{}');
      if (metaStore && metaStore[id]) {
        cachedMeta = metaStore[id];
      }
    } catch (e) {}

    const catalogDish = MASTER_CATALOG.find((d) => d.id === id);

    if (catalogDish && cachedMeta) {
      return {
        ...catalogDish,
        ...cachedMeta,
        id: id,
        badgeClass: cachedMeta.badgeClass || catalogDish.badgeClass || 'dish-badge--bestseller',
        badgeIcon: cachedMeta.badgeIcon || catalogDish.badgeIcon || 'bolt',
        badgeText: cachedMeta.badgeText || catalogDish.badgeText || 'Saved'
      };
    }

    if (catalogDish) {
      return catalogDish;
    }

    if (cachedMeta && cachedMeta.title) {
      return {
        id: id,
        title: cachedMeta.title,
        restaurant: cachedMeta.restaurant || 'KhaLo Kitchen • Karachi',
        price: typeof cachedMeta.price === 'number' ? cachedMeta.price : (parseInt(cachedMeta.price, 10) || 850),
        image: cachedMeta.image || '../assets/Shahi Dum Biryani.jpg',
        deliveryTime: cachedMeta.deliveryTime || '25-35',
        rating: cachedMeta.rating || 4.9,
        reviewsCount: cachedMeta.reviewsCount || 420,
        badgeClass: cachedMeta.badgeClass || 'dish-badge--bestseller',
        badgeIcon: cachedMeta.badgeIcon || 'bolt',
        badgeText: cachedMeta.badgeText || 'Saved Favorite'
      };
    }

    // Dynamic Title Formatter for unfamiliar IDs
    const formattedTitle = id
      .replace(/^(deal|spec|dish)-/i, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      id: id,
      title: formattedTitle || 'Karachi Special Dish',
      restaurant: 'KhaLo Kitchen • Karachi',
      price: 850,
      image: '../assets/Shahi Dum Biryani.jpg',
      deliveryTime: '25-35',
      rating: 4.8,
      reviewsCount: 380,
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Saved Favorite'
    };
  }

  let favorites = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');

  // Seed initial favorites once if absolute first visit
  if (!localStorage.getItem('khalo_favorites_seeded')) {
    if (favorites.length === 0) {
      favorites = ['shahi-dum-biryani-sp', 'smashed-double-burger', 'animal-fries-mess'];
      localStorage.setItem('khalo_favorites', JSON.stringify(favorites));
    }
    localStorage.setItem('khalo_favorites_seeded', 'true');
  }

  const gridEl = document.getElementById('fav-dishes-grid');
  const emptyStateEl = document.getElementById('fav-empty-state');
  const countBadgeEl = document.getElementById('fav-count-badge');

  // Toast
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
    if (badgeId === 'fav-badge') {
      const mobileBadge = document.getElementById('mobile-fav-badge');
      if (mobileBadge) mobileBadge.textContent = next;
    }
  }

  function renderFavorites() {
    favorites = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    const favCount = favorites.length;

    if (countBadgeEl) {
      countBadgeEl.textContent = `${favCount} ${favCount === 1 ? 'Dish' : 'Dishes'}`;
    }

    const favBadge = document.getElementById('fav-badge');
    const mobileFavBadge = document.getElementById('mobile-fav-badge');
    if (favBadge) favBadge.textContent = favCount;
    if (mobileFavBadge) mobileFavBadge.textContent = favCount;

    if (favCount === 0) {
      if (gridEl) gridEl.style.display = 'none';
      if (emptyStateEl) emptyStateEl.style.display = 'block';
      return;
    }

    if (gridEl) gridEl.style.display = 'grid';
    if (emptyStateEl) emptyStateEl.style.display = 'none';

    // Map every single favorite ID directly through getDishById to guarantee 100% display
    const matchedDishes = favorites.map((id) => getDishById(id)).filter(Boolean);

    function getFavBadgeSvg(iconName) {
      switch (iconName) {
        case 'bolt':
          return `<svg class="badge-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-6 10.49z"/></svg>`;
        case 'whatshot':
          return `<svg class="badge-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.61 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>`;
        case 'local_shipping':
          return `<svg class="badge-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="3" width="15" height="13" stroke-width="2" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16" stroke-width="2"/><circle cx="5.5" cy="18.5" r="2.5" stroke-width="2"/><circle cx="18.5" cy="18.5" r="2.5" stroke-width="2"/></svg>`;
        case 'local_offer':
          return `<svg class="badge-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"/></svg>`;
        case 'outdoor_grill':
          return `<svg class="badge-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 11a8 8 0 0016 0H4zm4 4v5m8-5v5m-4-5v3M8 6a2 2 0 012-2m4 0a2 2 0 012 2"/></svg>`;
        case 'nightlight':
          return `<svg class="badge-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.3 2a10 10 0 00-1.9 19.8 10 10 0 009.6-9.6A10 10 0 0112.3 2z"/></svg>`;
        default:
          return `<svg class="badge-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-6 10.49z"/></svg>`;
      }
    }

    gridEl.innerHTML = matchedDishes.map((dish) => `
      <article class="dish-card" data-dish-id="${dish.id}">
        <div class="dish-img-wrap">
          <img src="${dish.image}" alt="${dish.title}" class="dish-img" loading="lazy" />
          <button class="fav-toggle is-active" aria-label="Save to favorites" type="button" data-fav-id="${dish.id}">
            <svg class="icon-fav" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </button>
          <span class="dish-badge ${dish.badgeClass}">
            ${getFavBadgeSvg(dish.badgeIcon)}
            <span>${dish.badgeText}</span>
          </span>
        </div>
        <div class="dish-body">
          <div class="dish-info">
            <h3 class="dish-name" title="${dish.title}">${dish.title}</h3>
            <p class="dish-restaurant">${dish.restaurant}</p>
            <div class="dish-rating">
              <span class="rating-score">
                <svg class="rating-star-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span>${dish.rating}</span>
              </span>
              <span class="rating-count">(${dish.reviewsCount}+ reviews)</span>
            </div>
          </div>
          <div class="dish-footer">
            <div class="dish-meta">
              <span class="dish-time">
                <svg class="dish-time-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3"/></svg>
                <span>${dish.deliveryTime} mins</span>
              </span>
              <span class="dish-price">Rs. ${dish.price.toLocaleString()}</span>
            </div>
            <button class="btn-add" type="button" data-item="${dish.title}" data-dish-id="${dish.id}">
              <span>Add to Cart</span>
              <span class="btn-icon-holder"><svg class="btn-cart-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg></span>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    // Attach .btn-add listeners: opens modal or adds to cart directly with nice checkmark
    gridEl.querySelectorAll('.btn-add').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const dishId = button.dataset.dishId;
        const dish = getDishById(dishId);

        if (typeof window.openKhaloProductModal === 'function') {
          const product = (typeof window.resolveKhaloProduct === 'function' ? window.resolveKhaloProduct(button) : null) || dish;
          if (product) {
            window.openKhaloProductModal(product);
            return;
          }
        }

        // Direct cart fallback
        if (dish) {
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
              quantity: 1
            });
          }
          localStorage.setItem('khalo_cart', JSON.stringify(cart));
          syncFloatingCartUI();

          const origHtml = button.innerHTML;
          button.classList.add('is-added');
          button.innerHTML = `
            <span>Added</span>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style="width:16px;height:16px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          `;
          setTimeout(() => {
            button.innerHTML = origHtml;
            button.classList.remove('is-added');
          }, 1500);

          if (typeof window.showKhaloToast === 'function') {
            window.showKhaloToast({
              type: 'cart',
              tag: 'Cart Updated',
              title: dish.title,
              desc: 'Added to your order tray',
              icon: 'shopping_bag',
              actionText: 'View Cart',
              actionUrl: './cart.html'
            });
          }
        }
      });
    });

    // Attach .fav-toggle listeners
    gridEl.querySelectorAll('.fav-toggle').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const dishId = button.dataset.favId;
        const dish = getDishById(dishId);
        const dishName = dish ? dish.title : 'Dish';

        button.classList.add('pop');
        favorites = favorites.filter((id) => id !== dishId);
        localStorage.setItem('khalo_favorites', JSON.stringify(favorites));

        // Clean up metadata
        try {
          const metaStore = JSON.parse(localStorage.getItem('khalo_favorites_meta') || '{}');
          if (metaStore[dishId]) {
            delete metaStore[dishId];
            localStorage.setItem('khalo_favorites_meta', JSON.stringify(metaStore));
          }
        } catch (e) {}

        bumpBadge('fav-badge', -1);
        showToast({
          type: 'unfavorite',
          tag: 'Removed from Favorites',
          title: dishName,
          desc: 'Dish removed from your saved favorites',
          icon: 'favorite_border'
        });

        setTimeout(() => renderFavorites(), 250);
      });
    });
  }

  function initNavbar() {
    // Mobile drawer handled universally by location-dropdown.js

    syncFloatingCartUI();
  }

  function syncFloatingCartUI() {
    const cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const totalQty = cart.reduce((s, i) => s + (i.quantity || 1), 0);
    const totalPrice = cart.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0);

    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
      cartBadge.textContent = totalQty;
    }

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

  // Cross-tab synchronization
  window.addEventListener('storage', (event) => {
    if (event.key === 'khalo_favorites' || event.key === 'khalo_favorites_meta') {
      renderFavorites();
    }
    if (event.key === 'khalo_cart') {
      syncFloatingCartUI();
    }
  });

  function init() {
    initNavbar();
    renderFavorites();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
