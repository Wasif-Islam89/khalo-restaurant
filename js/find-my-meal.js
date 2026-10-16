// =========================================================================
// KhaLo — find-my-meal.js
// Interactive Food Discovery Engine, Decision Wizard & Craving Wheel
// Standardized to match Home Page interactions, navbar, and button states
// =========================================================================

(() => {
  'use strict';

  // =========================================================================
  // 1. DISH DATASET (Featuring Karachi's Best Kitchens)
  // =========================================================================
  const DISHES_DB = [
    {
      id: 'shahi-dum-biryani-sp',
      title: 'Special Shahi Dum Biryani',
      restaurant: 'KhaLo Kitchen • Clifton',
      locality: 'Clifton',
      price: 1150,
      image: '../assets/Special Shahi Dum Biryani.jpg',
      category: 'desi',
      mood: 'desi',
      deliveryTime: '25-35',
      deliveryMinutes: 30,
      rating: 4.9,
      reviewsCount: 420,
      spiceLevel: 'spicy',
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller',
      matchBaseScore: 99
    },
    {
      id: 'chicken-karahi',
      title: 'Desi Chicken Karahi',
      restaurant: 'Shinwari Dera • Highway',
      locality: 'Highway',
      price: 950,
      image: '../assets/Chicken Karahi.jpg',
      category: 'desi',
      mood: 'desi',
      deliveryTime: '30-40',
      deliveryMinutes: 35,
      rating: 4.8,
      reviewsCount: 310,
      spiceLevel: 'spicy',
      badgeClass: 'dish-badge--default',
      badgeIcon: 'whatshot',
      badgeText: 'Slow-cooked',
      matchBaseScore: 97
    },
    {
      id: 'smashed-double-burger',
      title: 'Smashed Double Burger',
      restaurant: 'Burger Lab • Gulshan',
      locality: 'Gulshan',
      price: 890,
      image: '../assets/Smashed Double Burger.jpg',
      category: 'fastfood',
      mood: 'fastfood',
      deliveryTime: '20-25',
      deliveryMinutes: 20,
      rating: 4.9,
      reviewsCount: 410,
      spiceLevel: 'medium',
      badgeClass: 'dish-badge--green',
      badgeIcon: 'local_shipping',
      badgeText: 'Free Delivery',
      matchBaseScore: 96
    },
    {
      id: 'loaded-beef-burger',
      title: 'Loaded Beef Burger',
      restaurant: 'Smash Shack • DHA Phase 6',
      locality: 'DHA',
      price: 820,
      image: '../assets/Loaded Beef Burger.jpg',
      category: 'fastfood',
      mood: 'fastfood',
      deliveryTime: '25-30',
      deliveryMinutes: 25,
      rating: 4.7,
      reviewsCount: 195,
      spiceLevel: 'medium',
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'local_offer',
      badgeText: 'Hot Deal',
      matchBaseScore: 94
    },
    {
      id: 'seekh-malai-platter',
      title: 'Seekh & Malai Platter',
      restaurant: 'Kababjees • Clifton',
      locality: 'Clifton',
      price: 1290,
      image: '../assets/Seekh & Malai Platter.jpg',
      category: 'bbq',
      mood: 'desi',
      deliveryTime: '30-40',
      deliveryMinutes: 35,
      rating: 4.9,
      reviewsCount: 520,
      spiceLevel: 'medium',
      badgeClass: 'dish-badge--yellow',
      badgeIcon: 'outdoor_grill',
      badgeText: 'Charcoal Smoke',
      matchBaseScore: 95
    },
    {
      id: 'animal-fries-mess',
      title: 'Animal Fries Mess',
      restaurant: 'Late Night Crave • Bahadurabad',
      locality: 'Bahadurabad',
      price: 590,
      image: '../assets/Animal Fries Mess.jpg',
      category: 'midnight',
      mood: 'midnight',
      deliveryTime: '15-20',
      deliveryMinutes: 18,
      rating: 4.6,
      reviewsCount: 312,
      spiceLevel: 'medium',
      badgeClass: 'dish-badge--green',
      badgeIcon: 'nightlight',
      badgeText: 'Midnight Hit',
      matchBaseScore: 93
    },
    {
      id: 'shahi-dum-biryani',
      title: 'Shahi Dum Biryani',
      restaurant: 'Handi Dum King • PECHS',
      locality: 'PECHS',
      price: 850,
      image: '../assets/Shahi Dum Biryani.jpg',
      category: 'desi',
      mood: 'desi',
      deliveryTime: '25-35',
      deliveryMinutes: 25,
      rating: 4.8,
      reviewsCount: 640,
      spiceLevel: 'spicy',
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller',
      matchBaseScore: 95
    },
    {
      id: 'molten-lava-cake',
      title: 'Molten Lava Cake',
      restaurant: 'Sweet Escape • SMCHS',
      locality: 'SMCHS',
      price: 490,
      image: '../assets/Molten Lava Cake.jpg',
      category: 'sweet',
      mood: 'sweet',
      deliveryTime: '15-25',
      deliveryMinutes: 20,
      rating: 4.9,
      reviewsCount: 275,
      spiceLevel: 'mild',
      badgeClass: 'dish-badge--bestseller',
      badgeIcon: 'bolt',
      badgeText: 'Bestseller',
      matchBaseScore: 98
    }
  ];

  // =========================================================================
  // 2. STATE MANAGEMENT
  // =========================================================================
  const state = {
    currentMode: 'wizard',
    currentStep: 1,
    totalSteps: 4,
    wizardPreferences: {
      mood: 'desi',
      budget: 1200,
      speed: 'normal',
      spice: 'spicy',
      group: 'solo'
    },
    activeCategoryFilter: 'all',
    searchQuery: '',
    sortBy: 'match',
    favorites: JSON.parse(localStorage.getItem('khalo_favorites') || '[]'),
    cart: JSON.parse(localStorage.getItem('khalo_cart') || '[]'),
    currentLocation: localStorage.getItem('khalo_location') || ''
  };

  // =========================================================================
  // 3. TOAST NOTIFICATIONS & BADGE COUNTERS (Identical to Home Page)
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

  function bumpBadge(badgeId, delta) {
    const badge = document.getElementById(badgeId);
    if (!badge) return;

    const currentCount = parseInt(badge.textContent, 10) || 0;
    const nextCount = Math.max(0, currentCount + delta);
    badge.textContent = nextCount;

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

    if (badgeId === 'fav-badge') {
      const mobileFavBadge = document.getElementById('mobile-fav-badge');
      if (mobileFavBadge) {
        mobileFavBadge.textContent = nextCount;
      }
    }
  }

  // =========================================================================
  // 4. NAVBAR INTERACTIONS (Copied directly from home.js)
  // =========================================================================
  function initNavbar() {
    // Mobile drawer handled universally by location-dropdown.js


  }

  // =========================================================================
  // 5. STEP-BY-STEP DECISION WIZARD
  // =========================================================================
  const wizardCard = document.getElementById('wizard-card');
  const wizardSteps = document.querySelectorAll('.wizard-step');
  const stepNodes = document.querySelectorAll('.step-node');
  const stepperTrackFill = document.getElementById('stepper-track-fill');
  const prevStepBtn = document.getElementById('wizard-prev-btn');
  const nextStepBtn = document.getElementById('wizard-next-btn');
  const matchingOverlay = document.getElementById('matching-overlay');
  const matchingStatusSub = document.getElementById('matching-status-sub');

  function updateStepperUI() {
    const step = state.currentStep;
    const progress = ((step - 1) / (state.totalSteps - 1)) * 100;

    if (stepperTrackFill) stepperTrackFill.style.width = `${progress}%`;

    stepNodes.forEach((node) => {
      const nodeStep = parseInt(node.getAttribute('data-step'), 10);
      node.classList.remove('active', 'completed');
      if (nodeStep === step) node.classList.add('active');
      else if (nodeStep < step) node.classList.add('completed');
    });

    wizardSteps.forEach((stepView) => {
      const stepNum = parseInt(stepView.getAttribute('data-step-view'), 10);
      stepView.classList.toggle('active', stepNum === step);
    });

    if (prevStepBtn) prevStepBtn.disabled = step === 1;

    if (nextStepBtn) {
      if (step === state.totalSteps) {
        nextStepBtn.innerHTML = `
          <span>Find My Meal</span>
          <span class="material-symbols-outlined">auto_awesome</span>
        `;
      } else {
        nextStepBtn.innerHTML = `
          <span>Continue</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        `;
      }
    }
  }

  function setupWizard() {
    // Option cards selection
    document.querySelectorAll('.option-card').forEach((card) => {
      card.addEventListener('click', () => {
        const group = card.getAttribute('data-group');
        const value = card.getAttribute('data-value');

        document.querySelectorAll(`.option-card[data-group="${group}"]`).forEach((c) => {
          c.classList.remove('selected');
        });
        card.classList.add('selected');

        if (group === 'mood') state.wizardPreferences.mood = value;
        if (group === 'speed') state.wizardPreferences.speed = value;
        if (group === 'spice') state.wizardPreferences.spice = value;
      });
    });

    // Budget slider & presets
    const budgetSlider = document.getElementById('budget-range-input');
    const budgetValDisplay = document.getElementById('budget-val-display');
    const budgetTierTag = document.getElementById('budget-tier-tag');
    const presetChips = document.querySelectorAll('.preset-chip');

    function syncBudget(val) {
      state.wizardPreferences.budget = parseInt(val, 10);
      if (budgetValDisplay) budgetValDisplay.textContent = Number(val).toLocaleString();

      if (budgetTierTag) {
        if (val < 600) budgetTierTag.textContent = 'Pocket Friendly (Bachaat)';
        else if (val <= 1200) budgetTierTag.textContent = 'Karachi Sweet Spot';
        else if (val <= 1800) budgetTierTag.textContent = 'Treat Yourself';
        else budgetTierTag.textContent = 'Grand Feast / Party';
      }

      presetChips.forEach((chip) => {
        const chipVal = parseInt(chip.getAttribute('data-preset'), 10);
        chip.classList.toggle('active', chipVal === parseInt(val, 10));
      });
    }

    if (budgetSlider) {
      budgetSlider.addEventListener('input', (e) => syncBudget(e.target.value));
      presetChips.forEach((chip) => {
        chip.addEventListener('click', () => {
          const presetVal = chip.getAttribute('data-preset');
          budgetSlider.value = presetVal;
          syncBudget(presetVal);
        });
      });
      syncBudget(budgetSlider.value);
    }

    // Navigation buttons
    if (nextStepBtn) {
      nextStepBtn.addEventListener('click', () => {
        if (state.currentStep < state.totalSteps) {
          state.currentStep++;
          updateStepperUI();
        } else {
          runMatchingSimulation();
        }
      });
    }

    if (prevStepBtn) {
      prevStepBtn.addEventListener('click', () => {
        if (state.currentStep > 1) {
          state.currentStep--;
          updateStepperUI();
        }
      });
    }

    stepNodes.forEach((node) => {
      node.addEventListener('click', () => {
        state.currentStep = parseInt(node.getAttribute('data-step'), 10);
        updateStepperUI();
      });
    });
  }

  function runMatchingSimulation() {
    if (wizardCard) wizardCard.style.display = 'none';
    if (matchingOverlay) matchingOverlay.style.display = 'block';

    const phrases = [
      'Checking Dum Biryani pots in Clifton & PECHS…',
      'Checking sizzling smash burger grills in Gulshan…',
      'Matching spice levels with Karachi highway dera kitchens…',
      'Curating your top dishes within budget…'
    ];

    let pIdx = 0;
    const interval = setInterval(() => {
      pIdx++;
      if (matchingStatusSub && phrases[pIdx]) {
        matchingStatusSub.textContent = phrases[pIdx];
      }
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      if (matchingOverlay) matchingOverlay.style.display = 'none';
      if (wizardCard) wizardCard.style.display = 'block';

      state.activeCategoryFilter = state.wizardPreferences.mood;

      document.querySelectorAll('.filter-pill').forEach((pill) => {
        pill.classList.toggle('active', pill.getAttribute('data-category') === state.activeCategoryFilter);
      });

      renderDishes();

      const resultsSection = document.getElementById('results-section');
      if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1800);
  }

  // =========================================================================
  // 6. CRAVING WHEEL (SURPRISE ME / FOOD ROULETTE)
  // =========================================================================
  const wheelSlices = [
    { title: 'Shahi Biryani', color: '#ff6b35', text: '#ffffff', dishId: 'shahi-dum-biryani-sp' },
    { title: 'Smash Burger', color: '#fdc656', text: '#593000', dishId: 'smashed-double-burger' },
    { title: 'Chicken Karahi', color: '#ab3500', text: '#ffffff', dishId: 'chicken-karahi' },
    { title: 'Animal Fries', color: '#51ab74', text: '#ffffff', dishId: 'animal-fries-mess' },
    { title: 'Seekh Platter', color: '#8f2c00', text: '#ffffff', dishId: 'seekh-malai-platter' },
    { title: 'Molten Cake', color: '#ff8f63', text: '#ffffff', dishId: 'molten-lava-cake' }
  ];

  let wheelAngle = 0;
  let isSpinningWheel = false;

  function drawWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2;
    const sliceAngle = (2 * Math.PI) / wheelSlices.length;

    ctx.clearRect(0, 0, width, height);

    wheelSlices.forEach((slice, i) => {
      const startAngle = wheelAngle + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 6, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = slice.text;
      ctx.font = 'bold 15px Inter, sans-serif';
      ctx.fillText(slice.title, radius - 24, 5);
      ctx.restore();
    });
  }

  function spinWheel() {
    if (isSpinningWheel) return;
    isSpinningWheel = true;
    const spinBtn = document.getElementById('spin-wheel-btn');
    const resultBox = document.getElementById('wheel-result-box');
    if (spinBtn) spinBtn.disabled = true;
    if (resultBox) resultBox.style.display = 'none';

    const spinRotations = 5 + Math.random() * 4;
    const extraDegrees = Math.random() * 360;
    const totalRotationRad = spinRotations * 2 * Math.PI + (extraDegrees * Math.PI) / 180;
    const duration = 4000;
    const startTime = performance.now();
    const initialAngle = wheelAngle;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      wheelAngle = initialAngle + totalRotationRad * easedProgress;
      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinningWheel = false;
        if (spinBtn) spinBtn.disabled = false;
        resolveWheelWinner();
      }
    }

    requestAnimationFrame(animate);
  }

  function resolveWheelWinner() {
    const sliceAngle = (2 * Math.PI) / wheelSlices.length;
    const normalizedAngle = (wheelAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const topPointerAngle = (3 * Math.PI / 2 - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
    const winningIndex = Math.floor(topPointerAngle / sliceAngle) % wheelSlices.length;
    const winningSlice = wheelSlices[winningIndex];

    const winningDish = DISHES_DB.find((d) => d.id === winningSlice.dishId) || DISHES_DB[0];

    const resultBox = document.getElementById('wheel-result-box');
    const resultImg = document.getElementById('wheel-result-img');
    const resultName = document.getElementById('wheel-result-name');
    const resultSub = document.getElementById('wheel-result-sub');
    const matchBtn = document.getElementById('wheel-match-now-btn');

    if (resultBox) {
      resultBox.style.display = 'block';
      if (resultImg) resultImg.src = winningDish.image;
      if (resultName) resultName.textContent = winningDish.title;
      if (resultSub) resultSub.textContent = `Rs. ${winningDish.price} • ${winningDish.restaurant}`;
    }

    if (matchBtn) {
      matchBtn.onclick = () => {
        state.activeCategoryFilter = winningDish.category;
        document.querySelectorAll('.filter-pill').forEach((p) => {
          p.classList.toggle('active', p.getAttribute('data-category') === winningDish.category);
        });
        renderDishes();
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
      };
    }

    showToast(`The Craving Wheel picked: ${winningDish.title}!`, 'auto_awesome');
  }

  // =========================================================================
  // 7. MATCH SCORING & DISH RENDERING (With Home Page card and button parity)
  // =========================================================================
  function calculateDishMatch(dish) {
    let score = dish.matchBaseScore;
    const prefs = state.wizardPreferences;

    if (dish.mood === prefs.mood) score += 2;
    else score -= 7;

    if (dish.price <= prefs.budget) score += 3;
    else {
      const overBy = dish.price - prefs.budget;
      score -= Math.min(Math.floor(overBy / 80), 12);
    }

    if (prefs.speed === 'urgent') {
      if (dish.deliveryMinutes <= 20) score += 4;
      else score -= 5;
    }

    if (dish.spiceLevel === prefs.spice) score += 2;

    return Math.min(Math.max(score, 78), 99);
  }

  function getFilteredDishes() {
    let dishes = [...DISHES_DB];

    if (state.activeCategoryFilter !== 'all') {
      dishes = dishes.filter((d) => d.category === state.activeCategoryFilter || d.mood === state.activeCategoryFilter);
    }

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      dishes = dishes.filter((d) =>
        d.title.toLowerCase().includes(q) ||
        d.restaurant.toLowerCase().includes(q)
      );
    }

    dishes = dishes.map((d) => ({
      ...d,
      calculatedMatch: calculateDishMatch(d)
    }));

    if (state.sortBy === 'match') {
      dishes.sort((a, b) => b.calculatedMatch - a.calculatedMatch);
    } else if (state.sortBy === 'price-low') {
      dishes.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-high') {
      dishes.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'rating') {
      dishes.sort((a, b) => b.rating - a.rating);
    } else if (state.sortBy === 'speed') {
      dishes.sort((a, b) => a.deliveryMinutes - b.deliveryMinutes);
    }

    return dishes;
  }

  function renderDishes() {
    const grid = document.getElementById('dishes-grid');
    if (!grid) return;

    const filtered = getFilteredDishes();

    const countBadge = document.getElementById('results-count-badge');
    if (countBadge) countBadge.textContent = `${filtered.length} Dishes Found`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-results">
          <span class="material-symbols-outlined empty-results-icon">search_off</span>
          <h3 class="empty-results-title">No dishes matched your exact filters</h3>
          <p class="empty-results-sub">Try broadening your budget slider, resetting the category tag, or checking other delicious Karachi vibes.</p>
          <button class="btn-primary" id="reset-filters-btn" type="button">
            <span>Reset All Filters</span>
            <span class="material-symbols-outlined">restart_alt</span>
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.activeCategoryFilter = 'all';
          state.searchQuery = '';
          const searchInput = document.getElementById('results-search-input');
          if (searchInput) searchInput.value = '';
          document.querySelectorAll('.filter-pill').forEach((p) => {
            p.classList.toggle('active', p.getAttribute('data-category') === 'all');
          });
          renderDishes();
        });
      }
      return;
    }

    function getFmmBadgeSvg(iconName) {
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

    // Output identical dish-card structure as home.html (Pure SVG Icons)
    grid.innerHTML = filtered.map((dish) => {
      const isFav = state.favorites.includes(dish.id);
      return `
        <article class="dish-card" data-dish-id="${dish.id}">
          <div class="dish-img-wrap">
            <img src="${dish.image}" alt="${dish.title}" class="dish-img" loading="lazy" />
            <button class="fav-toggle ${isFav ? 'is-active' : ''}" aria-label="Save to favorites" type="button" data-dish-id="${dish.id}" data-fav-id="${dish.id}">
              <svg class="icon-fav" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
            <span class="dish-badge ${dish.badgeClass}">
              ${getFmmBadgeSvg(dish.badgeIcon)}
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
      `;
    }).join('');

    // Attach listeners for .btn-add: opens quick-view modal instead of adding directly
    grid.querySelectorAll('.btn-add').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof window.openKhaloProductModal === 'function') {
          const product = typeof window.resolveKhaloProduct === 'function' ? window.resolveKhaloProduct(button) : null;
          if (product) {
            window.openKhaloProductModal(product);
            return;
          }
        }

        const dishId = button.dataset.dishId;
        const dish = DISHES_DB.find((d) => d.id === dishId);
        if (dish && typeof window.openKhaloProductModal === 'function') {
          window.openKhaloProductModal(dish);
        }
      });
    });

    // Attach listeners for .fav-toggle (exact home.js interaction parity)
    grid.querySelectorAll('.fav-toggle').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const dishId = button.dataset.dishId || button.dataset.favId;
        if (!dishId) return;

        const card = button.closest('.dish-card');
        const dishName = card ? (card.querySelector('.dish-name')?.textContent.trim() || 'Dish') : 'Dish';

        let favs = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
        const isCurrentlyFav = favs.includes(dishId);
        button.classList.add('pop');
        setTimeout(() => button.classList.remove('pop'), 400);

        if (isCurrentlyFav) {
          favs = favs.filter((id) => id !== dishId);
          button.classList.remove('is-active');
          showToast({
            type: 'unfavorite',
            tag: 'Removed from Favorites',
            title: dishName,
            desc: 'Dish removed from your saved favorites',
            icon: 'favorite_border'
          });
        } else {
          favs.push(dishId);
          button.classList.add('is-active');
          if (typeof window.khaloSaveFavoriteMeta === 'function') {
            const dishObj = DISHES_DB.find((d) => d.id === dishId);
            if (dishObj) {
              window.khaloSaveFavoriteMeta(dishId, dishObj);
            }
          }
          showToast({
            type: 'favorite',
            tag: 'Saved to Favorites',
            title: dishName,
            desc: 'Added to your favorites wishlist • View in Saved Dishes',
            icon: 'favorite'
          });
        }

        state.favorites = favs;
        localStorage.setItem('khalo_favorites', JSON.stringify(favs));

        // Always sync navbar badge to exact real count
        const favBadge = document.getElementById('fav-badge');
        const mobileFavBadge = document.getElementById('mobile-fav-badge');
        if (favBadge) favBadge.textContent = favs.length;
        if (mobileFavBadge) mobileFavBadge.textContent = favs.length;
      });
    });
  }

  // =========================================================================
  // 8. CART DRAWER & ORDER MANAGEMENT
  // =========================================================================
  function syncFloatingCartUI() {
    const totalQty = state.cart.reduce((s, i) => s + (i.quantity || 1), 0);
    const totalPrice = state.cart.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0);

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

  function addToCart(dish) {
    const existing = state.cart.find((item) => item.id === dish.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        id: dish.id,
        title: dish.title,
        price: dish.price,
        image: dish.image,
        quantity: 1
      });
    }

    localStorage.setItem('khalo_cart', JSON.stringify(state.cart));
    renderCartDrawer();
    syncFloatingCartUI();
  }

  function renderCartDrawer() {
    const cartList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const grandTotalEl = document.getElementById('cart-grand-total');
    if (!cartList) return;

    if (state.cart.length === 0) {
      cartList.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <span class="material-symbols-outlined" style="font-size: 3rem; color: var(--outline-variant); margin-bottom: 0.5rem; display: block;">shopping_basket</span>
          <p style="font-weight: 700; color: var(--text-title); margin-bottom: 0.25rem;">Your cart is empty</p>
          <small>Explore dishes matched to your craving and add them here!</small>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = 'Rs. 0';
      if (grandTotalEl) grandTotalEl.textContent = 'Rs. 0';
      return;
    }

    let subtotal = 0;
    cartList.innerHTML = state.cart.map((item) => {
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;
      return `
        <div class="cart-item" data-cart-id="${item.id}">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.title}</h4>
            <span class="cart-item-price">Rs. ${item.price.toLocaleString()}</span>
          </div>
          <div class="cart-qty-ctrls">
            <button class="cart-qty-btn" data-action="dec" data-id="${item.id}" type="button">-</button>
            <span class="cart-qty-val">${item.quantity}</span>
            <button class="cart-qty-btn" data-action="inc" data-id="${item.id}" type="button">+</button>
          </div>
        </div>
      `;
    }).join('');

    const deliveryFee = 99;
    const grandTotal = subtotal + deliveryFee;

    if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
    if (grandTotalEl) grandTotalEl.textContent = `Rs. ${grandTotal.toLocaleString()}`;

    cartList.querySelectorAll('.cart-qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        const item = state.cart.find((i) => i.id === id);

        if (item) {
          if (action === 'inc') {
            item.quantity += 1;
            bumpBadge('cart-badge', 1);
          } else if (action === 'dec') {
            item.quantity -= 1;
            bumpBadge('cart-badge', -1);
            if (item.quantity <= 0) {
              state.cart = state.cart.filter((i) => i.id !== id);
            }
          }
          localStorage.setItem('khalo_cart', JSON.stringify(state.cart));
          renderCartDrawer();
          syncFloatingCartUI();
        }
      });
    });
  }

  function setupCartDrawer() {
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const checkoutBtn = document.getElementById('cart-checkout-btn');

    document.querySelectorAll('.cart-trigger-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        renderCartDrawer();
        if (cartOverlay) cartOverlay.classList.add('is-open');
      });
    });

    if (cartCloseBtn && cartOverlay) {
      cartCloseBtn.addEventListener('click', () => cartOverlay.classList.remove('is-open'));
      cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) cartOverlay.classList.remove('is-open');
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (state.cart.length === 0) {
          showToast('Please add items to your cart first!', 'warning');
          return;
        }
        window.location.href = './cart.html';
      });
    }
  }

  // =========================================================================
  // 9. FILTERS & CONTROLS
  // =========================================================================
  function setupFilterControls() {
    document.querySelectorAll('.filter-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        state.activeCategoryFilter = pill.getAttribute('data-category');
        document.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        renderDishes();
      });
    });

    const searchInput = document.getElementById('results-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderDishes();
      });
    }

    const sortSelect = document.getElementById('results-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderDishes();
      });
    }
  }

  function setupModeTabs() {
    const wizardSection = document.getElementById('wizard-section');
    const wheelSection = document.getElementById('wheel-section');
    const resultsSection = document.getElementById('results-section');

    document.querySelectorAll('.mode-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const mode = tab.getAttribute('data-mode');
        state.currentMode = mode;

        document.querySelectorAll('.mode-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        if (mode === 'wizard') {
          if (wizardSection) wizardSection.style.display = 'block';
          if (wheelSection) wheelSection.style.display = 'none';
        } else if (mode === 'wheel') {
          if (wizardSection) wizardSection.style.display = 'none';
          if (wheelSection) wheelSection.style.display = 'block';
          drawWheel();
        } else if (mode === 'matrix') {
          if (wizardSection) wizardSection.style.display = 'none';
          if (wheelSection) wheelSection.style.display = 'none';
          if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 10. INITIALIZATION
  // =========================================================================
  function init() {
    initNavbar();
    setupModeTabs();
    setupWizard();
    updateStepperUI();

    const spinBtn = document.getElementById('spin-wheel-btn');
    if (spinBtn) spinBtn.addEventListener('click', spinWheel);
    drawWheel();

    setupFilterControls();
    setupBackToTop();

    // Initial badge counts & Location text
    const savedLocation = localStorage.getItem('khalo_location') || '';
    const locText = document.getElementById('current-location-text');
    if (locText) {
      locText.textContent = savedLocation ? savedLocation.replace(/^Karachi\s*—\s*/i, '').trim() : 'Select Area';
    }

    const favs = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    state.favorites = favs;
    const favBadge = document.getElementById('fav-badge');
    const mobileFavBadge = document.getElementById('mobile-fav-badge');
    if (favBadge) favBadge.textContent = favs.length;
    if (mobileFavBadge) mobileFavBadge.textContent = favs.length;

    const cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    state.cart = cart;
    const cartBadge = document.getElementById('cart-badge');
    const totalCartQty = cart.reduce((s, i) => s + (i.quantity || 1), 0);
    if (cartBadge) cartBadge.textContent = totalCartQty;

    renderDishes();
    syncFloatingCartUI();

    window.addEventListener('storage', (e) => {
      if (e.key === 'khalo_favorites') {
        const updatedFavs = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
        state.favorites = updatedFavs;
        if (favBadge) favBadge.textContent = updatedFavs.length;
        if (mobileFavBadge) mobileFavBadge.textContent = updatedFavs.length;
        document.querySelectorAll('.fav-toggle').forEach((btn) => {
          const id = btn.dataset.dishId || btn.dataset.favId;
          btn.classList.toggle('is-active', updatedFavs.includes(id));
        });
      }
      if (e.key === 'khalo_cart') {
        state.cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
        const updatedCartQty = state.cart.reduce((s, i) => s + (i.quantity || 1), 0);
        if (cartBadge) cartBadge.textContent = updatedCartQty;
        syncFloatingCartUI();
        renderCartDrawer();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
