/**
 * KhaLo — menu.js
 * Dedicated Interactivity for Authentic Restaurant Food Menu
 * Features: Live search, category tabs, dietary chips, sorting,
 * quick-view modal, synchronized cart (khalo_cart), favorites (khalo_favorites),
 * toast alerts, and responsive floating mini-cart pill.
 */

(() => {
  'use strict';

  // =========================================================================
  // 1. COMPREHENSIVE DISHES DATASET
  // =========================================================================
  const DISHES = [
    // BIRYANI & RICE
    {
      id: 'shahi-dum-biryani',
      title: 'Shahi Dum Biryani (Chicken)',
      category: 'biryani',
      price: 480,
      originalPrice: 550,
      image: '../assets/Shahi Dum Biryani.jpg',
      description: 'Long-grain aged basmati rice cooked on slow dum with tender chicken, infused with pure saffron, Kewra water, and authentic Karachi spices.',
      rating: 4.9,
      reviews: 1840,
      prepTime: '25-30 min',
      calories: '650 kcal',
      spiceLevel: 'Medium',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: true,
      isSpicy: false,
      portions: [
        { name: 'Single Portion', sub: 'Serves 1 person with Raita', price: 480 },
        { name: 'Family Platter', sub: 'Serves 3-4 persons with Raita & Salad', price: 1350 }
      ]
    },
    {
      id: 'special-mutton-dum-biryani',
      title: 'Special Mutton Dum Biryani',
      category: 'biryani',
      price: 790,
      originalPrice: 890,
      image: '../assets/Special Shahi Dum Biryani.jpg',
      description: 'Succulent cuts of fresh mutton marinated overnight in yogurt and spices, layered with aromatic saffron rice and crowned with fried onions.',
      rating: 4.9,
      reviews: 1220,
      prepTime: '30-35 min',
      calories: '720 kcal',
      spiceLevel: 'Medium',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: true,
      isSpicy: false,
      portions: [
        { name: 'Regular Portion', sub: 'Serves 1 person with Raita', price: 790 },
        { name: 'Double Portion', sub: 'Serves 2-3 persons with Raita', price: 1520 }
      ]
    },
    {
      id: 'sindhi-spicy-biryani',
      title: 'Karachi Spicy Masala Biryani',
      category: 'biryani',
      price: 520,
      originalPrice: 580,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      description: 'Fiery Karachi style biryani featuring tender chicken, spiced golden potatoes (aloo), dried plums (aloo bukhara), and fresh green chillies.',
      rating: 4.8,
      reviews: 950,
      prepTime: '25 min',
      calories: '680 kcal',
      spiceLevel: 'Spicy',
      dietary: 'non-veg',
      isBestseller: false,
      isChefSpecial: false,
      isSpicy: true,
      portions: [
        { name: 'Single Box', sub: 'Serves 1 person', price: 520 },
        { name: 'Family Matka', sub: 'Serves 3 persons', price: 1480 }
      ]
    },
    {
      id: 'beef-nalli-biryani',
      title: 'Royal Beef Nalli Biryani',
      category: 'biryani',
      price: 850,
      originalPrice: 950,
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
      description: 'Slow-braised tender beef shank with rich roasted bone marrow (nalli) poured over fragrant saffron basmati dum rice.',
      rating: 5.0,
      reviews: 640,
      prepTime: '35 min',
      calories: '810 kcal',
      spiceLevel: 'Medium',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: true,
      isSpicy: false,
      portions: [
        { name: 'Standard (1 Nalli)', sub: 'Serves 1 person', price: 850 },
        { name: 'Grand (2 Nallis)', sub: 'Serves 2 persons', price: 1650 }
      ]
    },

    // KARAHI & HANDI
    {
      id: 'desi-chicken-karahi',
      title: 'Desi Makhan Chicken Karahi',
      category: 'karahi',
      price: 1150,
      originalPrice: 1290,
      image: '../assets/Chicken Karahi.jpg',
      description: 'Cooked in pure Desi Makhan with vine-ripened tomatoes, crushed ginger juliennes, green chillies, and freshly roasted cumin coriander blend.',
      rating: 4.9,
      reviews: 1460,
      prepTime: '30-40 min',
      calories: '750 kcal',
      spiceLevel: 'Medium',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: true,
      isSpicy: false,
      portions: [
        { name: 'Half Karahi (0.5 kg)', sub: 'Ideal for 1-2 persons', price: 1150 },
        { name: 'Full Karahi (1.0 kg)', sub: 'Ideal for 3-4 persons', price: 2150 }
      ]
    },
    {
      id: 'mutton-shinwari-karahi',
      title: 'Mutton Shinwari Saltish Karahi',
      category: 'karahi',
      price: 1650,
      originalPrice: 1850,
      image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80',
      description: 'Authentic Peshawar Shinwari style mutton cooked in its own natural juices with salt, fresh tomatoes, and green chillies without heavy red chillies.',
      rating: 4.8,
      reviews: 780,
      prepTime: '40 min',
      calories: '820 kcal',
      spiceLevel: 'Mild',
      dietary: 'non-veg',
      isBestseller: false,
      isChefSpecial: true,
      isSpicy: false,
      portions: [
        { name: 'Half Karahi (0.5 kg)', sub: 'Serves 1-2 persons', price: 1650 },
        { name: 'Full Karahi (1.0 kg)', sub: 'Serves 3-4 persons', price: 3100 }
      ]
    },
    {
      id: 'white-chicken-handi',
      title: 'Creamy White Chicken Handi',
      category: 'karahi',
      price: 1280,
      originalPrice: 1400,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80',
      description: 'Boneless chicken cubes cooked in a velvet cashew paste, fresh dairy malai, crushed white peppers, and mild green cardamoms.',
      rating: 4.9,
      reviews: 890,
      prepTime: '30 min',
      calories: '710 kcal',
      spiceLevel: 'Mild',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Regular Clay Handi', sub: 'Serves 2 persons', price: 1280 },
        { name: 'Large Clay Handi', sub: 'Serves 4 persons', price: 2390 }
      ]
    },
    {
      id: 'paneer-reshmi-handi',
      title: 'Shahi Paneer Reshmi Handi',
      category: 'karahi',
      price: 780,
      originalPrice: 850,
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80',
      description: 'Fresh homemade cottage cheese cubes simmered in a silky tomato butter gravy infused with dried fenugreek leaves (kasoori methi).',
      rating: 4.7,
      reviews: 430,
      prepTime: '25 min',
      calories: '540 kcal',
      spiceLevel: 'Mild',
      dietary: 'veg',
      isBestseller: false,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Standard Handi', sub: 'Serves 1-2 persons', price: 780 },
        { name: 'Double Handi', sub: 'Serves 3 persons', price: 1450 }
      ]
    },

    // BBQ & SIZZLERS
    {
      id: 'seekh-malai-platter',
      title: 'Grand Seekh & Malai BBQ Platter',
      category: 'bbq',
      price: 1450,
      originalPrice: 1650,
      image: '../assets/Seekh & Malai Platter.jpg',
      description: 'A lavish combo of 4 Beef Seekh Kababs, 8 Malai Boti pieces, 2 Crispy Parathas, spicy mint raita, and fresh marinated onion rings.',
      rating: 4.9,
      reviews: 2100,
      prepTime: '25-30 min',
      calories: '920 kcal',
      spiceLevel: 'Medium',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: true,
      isSpicy: false,
      portions: [
        { name: 'Platter for Two', sub: 'Includes Parathas & Dips', price: 1450 },
        { name: 'Jumbo Feast for 4', sub: 'Double skewers with Naan basket', price: 2690 }
      ]
    },
    {
      id: 'reshmi-malai-boti',
      title: 'Smoked Reshmi Malai Boti',
      category: 'bbq',
      price: 580,
      originalPrice: 650,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
      description: 'Boneless tender chicken skewers marinated in fresh cream, white pepper, and subtle lemon juice, flame grilled over fragrant natural coals.',
      rating: 4.8,
      reviews: 1140,
      prepTime: '20-25 min',
      calories: '520 kcal',
      spiceLevel: 'Mild',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Single Skewer (8 pcs)', sub: 'Serves 1 person', price: 580 },
        { name: 'Double Skewer (16 pcs)', sub: 'Serves 2-3 persons', price: 1100 }
      ]
    },
    {
      id: 'beef-bihari-boti',
      title: 'Karachi Charcoal Beef Bihari Boti',
      category: 'bbq',
      price: 640,
      originalPrice: 720,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
      description: 'Melt-in-mouth beef strips marinated in raw papaya, mustard oil, and freshly ground Bihari spices, grilled until charred and tender.',
      rating: 4.9,
      reviews: 860,
      prepTime: '25 min',
      calories: '580 kcal',
      spiceLevel: 'Spicy',
      dietary: 'non-veg',
      isBestseller: false,
      isChefSpecial: true,
      isSpicy: true,
      portions: [
        { name: 'Single Plate', sub: 'Served with Puri Paratha', price: 640 },
        { name: 'Double Plate', sub: 'Served with 2 Puri Parathas', price: 1240 }
      ]
    },

    // BURGERS & SANDWICHES
    {
      id: 'smashed-double-burger',
      title: 'Smashed Double Beef Burger',
      category: 'burgers',
      price: 680,
      originalPrice: 780,
      image: '../assets/Smashed Double Burger.jpg',
      description: 'Two smashed prime beef patties with caramelized lacy edges, double American cheddar slices, house burger glaze, in toasted brioche bun.',
      rating: 4.9,
      reviews: 1650,
      prepTime: '20 min',
      calories: '740 kcal',
      spiceLevel: 'Medium',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Burger Only', sub: 'Juicy smashed double burger', price: 680 },
        { name: 'Meal with Fries & Drink', sub: 'Includes fries and chilled can', price: 920 }
      ]
    },
    {
      id: 'loaded-beef-burger',
      title: 'KhaLo Signature Loaded Beef Burger',
      category: 'burgers',
      price: 790,
      originalPrice: 890,
      image: '../assets/Loaded Beef Burger.jpg',
      description: 'Thick flame-grilled beef patty stacked with crispy onion rings, melted cheddar, beef bacon jam, and smoky BBQ chipotle sauce.',
      rating: 4.9,
      reviews: 1390,
      prepTime: '20-25 min',
      calories: '840 kcal',
      spiceLevel: 'Medium',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: true,
      isSpicy: false,
      portions: [
        { name: 'Burger Only', sub: 'Loaded beef burger', price: 790 },
        { name: 'Combo with Curly Fries & Drink', sub: 'Full meal experience', price: 1050 }
      ]
    },
    {
      id: 'crispy-zinger-crunch',
      title: 'Crispy Zinger Crunch Burger',
      category: 'burgers',
      price: 540,
      originalPrice: 620,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      description: 'Crispy double-dredged chicken breast fillet, iceberg lettuce, pickled jalapeños, and generous garlic chili mayo inside a soft sesame bun.',
      rating: 4.8,
      reviews: 1480,
      prepTime: '15-20 min',
      calories: '610 kcal',
      spiceLevel: 'Spicy',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: false,
      isSpicy: true,
      portions: [
        { name: 'Zinger Burger', sub: 'Crispy fillet burger', price: 540 },
        { name: 'Zinger Meal Combo', sub: 'With salted fries and drink', price: 780 }
      ]
    },

    // FRIES & SIDES
    {
      id: 'animal-fries-mess',
      title: 'Loaded Animal Fries Mess',
      category: 'sides',
      price: 450,
      originalPrice: 520,
      image: '../assets/Animal Fries Mess.jpg',
      description: 'Golden crispy fries drenched in liquid cheddar cheese sauce, grilled caramelized onions, minced beef bits, and secret KhaLo burger drizzle.',
      rating: 4.8,
      reviews: 1950,
      prepTime: '15 min',
      calories: '550 kcal',
      spiceLevel: 'Mild',
      dietary: 'non-veg',
      isBestseller: true,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Regular Mess Box', sub: 'Serves 1-2 persons', price: 450 },
        { name: 'Monster Share Box', sub: 'Double loaded for 3-4 persons', price: 820 }
      ]
    },
    {
      id: 'peri-peri-crinkle-fries',
      title: 'Peri Peri Masala Crinkle Fries',
      category: 'sides',
      price: 290,
      originalPrice: 340,
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
      description: 'Crispy crinkle-cut potatoes dusted in zesty African bird’s eye chili spice and chatkhara lime salt.',
      rating: 4.7,
      reviews: 820,
      prepTime: '12 min',
      calories: '380 kcal',
      spiceLevel: 'Spicy',
      dietary: 'veg',
      isBestseller: false,
      isChefSpecial: false,
      isSpicy: true,
      portions: [
        { name: 'Regular Pack', sub: 'With garlic mayo dip', price: 290 },
        { name: 'Large Pack', sub: 'With 2 dipping sauces', price: 440 }
      ]
    },
    {
      id: 'garlic-butter-naan',
      title: 'Desi Butter & Garlic Naan (2 Pcs)',
      category: 'sides',
      price: 190,
      originalPrice: 220,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop&q=80',
      description: 'Fresh tandoori naans baked on scorching clay walls, brushed with roasted garlic butter and fresh coriander.',
      rating: 4.8,
      reviews: 1200,
      prepTime: '10 min',
      calories: '310 kcal',
      spiceLevel: 'None',
      dietary: 'veg',
      isBestseller: false,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Basket of 2 Naans', sub: 'Clay tandoor baked', price: 190 },
        { name: 'Basket of 4 Naans', sub: 'Clay tandoor baked', price: 360 }
      ]
    },

    // DESSERTS & SWEETS
    {
      id: 'molten-lava-cake',
      title: 'Gooey Molten Chocolate Lava Cake',
      category: 'desserts',
      price: 490,
      originalPrice: 560,
      image: '../assets/Molten Lava Cake.jpg',
      description: 'Warm rich Belgian dark chocolate sponge cake with an irresistible warm flowing chocolate center. Served piping hot.',
      rating: 4.9,
      reviews: 1540,
      prepTime: '15 min',
      calories: '510 kcal',
      spiceLevel: 'None',
      dietary: 'veg',
      isBestseller: true,
      isChefSpecial: true,
      isSpicy: false,
      portions: [
        { name: 'Single Lava Cake', sub: 'With dark cocoa drizzle', price: 490 },
        { name: 'Lava with Vanilla Scoop', sub: 'Served with premium vanilla ice cream', price: 620 }
      ]
    },
    {
      id: 'shahi-gulab-jamun-sundae',
      title: 'Warm Shahi Gulab Jamun Sundae',
      category: 'desserts',
      price: 380,
      originalPrice: 420,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      description: 'Two soft warm khoya gulab jamuns served on a bed of cold kulfa ice cream, garnished with roasted pistachios and silver vark.',
      rating: 4.8,
      reviews: 930,
      prepTime: '10 min',
      calories: '420 kcal',
      spiceLevel: 'None',
      dietary: 'veg',
      isBestseller: false,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Classic Sundae', sub: '2 Jamuns + Ice Cream', price: 380 },
        { name: 'Family Box (6 Jamuns)', sub: 'Without ice cream', price: 650 }
      ]
    },
    {
      id: 'zafrani-matka-kheer',
      title: 'Zafrani Clay-Pot Matka Kheer',
      category: 'desserts',
      price: 340,
      originalPrice: 380,
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80',
      description: 'Traditional slow-simmered rice pudding enriched with whole milk, saffron strands, cardamom, and crushed almonds in clay earthenware.',
      rating: 4.9,
      reviews: 780,
      prepTime: '10 min',
      calories: '360 kcal',
      spiceLevel: 'None',
      dietary: 'veg',
      isBestseller: true,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Single Matka', sub: 'Chilled clay pot serving', price: 340 },
        { name: 'Double Matka (2 Pcs)', sub: 'Chilled clay pot serving', price: 640 }
      ]
    },

    // BEVERAGES & DRINKS
    {
      id: 'kulhad-sweet-lassi',
      title: 'Special Royal Kulhad Lassi',
      category: 'drinks',
      price: 260,
      originalPrice: 300,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      description: 'Thick creamy yogurt lassi sweetened with pure sugar and rose water, crowned with a layer of thick fresh malai in clay kulhad.',
      rating: 4.9,
      reviews: 1420,
      prepTime: '5-10 min',
      calories: '320 kcal',
      spiceLevel: 'None',
      dietary: 'veg',
      isBestseller: true,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Sweet Malai Lassi (350ml)', sub: 'Traditional sweet clay cup', price: 260 },
        { name: 'Namkeen Salted Lassi (350ml)', sub: 'Savory with roasted cumin', price: 240 }
      ]
    },
    {
      id: 'chilled-mint-margarita',
      title: 'Fresh Mint Lemon Margarita',
      category: 'drinks',
      price: 240,
      originalPrice: 280,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
      description: 'Crushed garden-fresh mint leaves, freshly squeezed lime juice, black rock salt, and fizzy soda blended with crushed ice.',
      rating: 4.8,
      reviews: 990,
      prepTime: '5 min',
      calories: '110 kcal',
      spiceLevel: 'None',
      dietary: 'veg',
      isBestseller: true,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Chilled Glass (400ml)', sub: 'Fresh blended mint refresher', price: 240 },
        { name: 'Family Pitcher (1.2L)', sub: 'Ideal for 3-4 persons', price: 680 }
      ]
    },
    {
      id: 'chilled-cold-drink',
      title: 'Cold Soft Drink (Can 250ml)',
      category: 'drinks',
      price: 120,
      originalPrice: 130,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
      description: 'Ice-cold carbonated refreshment. Available in Coca-Cola, Sprite, Fanta, Pakola, or Diet Coke.',
      rating: 4.7,
      reviews: 2400,
      prepTime: '2 min',
      calories: '140 kcal',
      spiceLevel: 'None',
      dietary: 'veg',
      isBestseller: false,
      isChefSpecial: false,
      isSpicy: false,
      portions: [
        { name: 'Coke / Sprite Can (250ml)', sub: 'Ice-cold aluminum can', price: 120 },
        { name: '1.5 Litre Family Bottle', sub: 'Chilled pet bottle', price: 240 }
      ]
    }
  ];

  // =========================================================================
  // 2. STATE MANAGEMENT
  // =========================================================================
  let currentCategory = 'all';
  let searchQuery = '';
  let activeFilterChip = 'all'; // 'all' | 'bestseller' | 'chef' | 'spicy' | 'veg' | 'under600'
  let currentSort = 'recommended'; // 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'fastest'
  let selectedModalDish = null;
  let selectedModalPortionIdx = 0;

  // DOM Elements
  const menuGrid = document.getElementById('menu-grid');
  const searchInput = document.getElementById('menu-search-input');
  const searchClearBtn = document.getElementById('menu-search-clear');
  const sortSelect = document.getElementById('menu-sort-select');
  const categoryPills = document.querySelectorAll('.category-pill');
  const statusTitle = document.getElementById('menu-status-title');
  const statusCount = document.getElementById('menu-status-count');
  const floatingCartBar = document.getElementById('floating-cart-bar');
  const floatingCartBadge = document.getElementById('floating-cart-badge');
  const floatingCartPrice = document.getElementById('floating-cart-price');

  // Modal Elements
  const modalBackdrop = document.getElementById('menu-modal-backdrop');
  const modalCloseBtn = document.getElementById('menu-modal-close-btn');
  const modalImg = document.getElementById('modal-dish-img');
  const modalTitle = document.getElementById('modal-dish-title');
  const modalPrice = document.getElementById('modal-dish-price');
  const modalDesc = document.getElementById('modal-dish-desc');
  const modalRating = document.getElementById('modal-dish-rating');
  const modalTime = document.getElementById('modal-dish-time');
  const modalSpice = document.getElementById('modal-dish-spice');
  const modalPortionsContainer = document.getElementById('modal-portions-container');
  const modalAddBtn = document.getElementById('modal-add-to-cart-btn');

  // =========================================================================
  // 3. TOAST NOTIFICATIONS & BADGES
  // =========================================================================
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

  // Update Cart Badge in Navbar & Floating Bar
  function syncCartUI() {
    const cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
      cartBadge.textContent = totalQty;
      if (cartBadge.animate && totalQty > 0) {
        cartBadge.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }],
          { duration: 300, easing: 'ease-out' }
        );
      }
    }

    // Update Floating Mini Cart Bar
    if (floatingCartBar) {
      if (totalQty > 0) {
        floatingCartBar.classList.add('is-visible');
        if (floatingCartBadge) floatingCartBadge.textContent = `${totalQty} item${totalQty > 1 ? 's' : ''}`;
        if (floatingCartPrice) floatingCartPrice.textContent = `Rs. ${totalPrice.toLocaleString()}`;
      } else {
        floatingCartBar.classList.remove('is-visible');
      }
    }
  }

  // Update Favorites Badge in Navbar
  function syncFavoritesUI() {
    const favorites = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    const favBadge = document.getElementById('fav-badge');
    const mobileFavBadge = document.getElementById('mobile-fav-badge');
    if (favBadge) favBadge.textContent = favorites.length;
    if (mobileFavBadge) mobileFavBadge.textContent = favorites.length;
  }

  // Check if item is favorite
  function isDishFavorite(dishId) {
    const favorites = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    return favorites.includes(dishId);
  }

  // Toggle Favorite
  function toggleDishFavorite(dishId, dishTitle, buttonEl = null) {
    let favorites = JSON.parse(localStorage.getItem('khalo_favorites') || '[]');
    const index = favorites.indexOf(dishId);
    let isAdded = false;

    if (index > -1) {
      favorites.splice(index, 1);
      showToast({
        type: 'unfavorite',
        tag: 'Removed from Favorites',
        title: dishTitle || 'Dish',
        desc: 'Dish removed from your saved favorites',
        icon: 'favorite_border'
      });
    } else {
      favorites.push(dishId);
      isAdded = true;

      const dishObj = DISHES.find((d) => d.id === dishId);
      if (dishObj && typeof window.khaloSaveFavoriteMeta === 'function') {
        window.khaloSaveFavoriteMeta(dishId, {
          title: dishObj.title,
          price: dishObj.price,
          image: dishObj.image,
          restaurant: 'KhaLo Kitchen • Karachi',
          deliveryTime: dishObj.prepTime ? dishObj.prepTime.replace(/[^0-9-]/g, '') : '25-30',
          rating: dishObj.rating || 4.9,
          reviewsCount: dishObj.reviews || 500,
          badgeText: dishObj.isBestseller ? 'Bestseller' : 'Chef Special',
          badgeIcon: 'bolt',
          badgeClass: 'dish-badge--bestseller'
        });
      }

      showToast({
        type: 'favorite',
        tag: 'Saved to Favorites',
        title: dishTitle || 'Dish',
        desc: 'Added to your favorites wishlist',
        icon: 'favorite',
        actionText: 'View Saved',
        actionUrl: './favorites.html'
      });
    }

    localStorage.setItem('khalo_favorites', JSON.stringify(favorites));
    syncFavoritesUI();

    if (buttonEl) {
      buttonEl.classList.toggle('is-active', isAdded);
      buttonEl.classList.add('pop');
      setTimeout(() => buttonEl.classList.remove('pop'), 400);
    } else {
      document.querySelectorAll(`.fav-toggle[data-id="${dishId}"], .fav-toggle[data-dish-id="${dishId}"]`).forEach((b) => {
        b.classList.toggle('is-active', isAdded);
      });
    }
  }

  // Get Quantity of Dish currently in Cart
  function getCartItemQuantity(dishId) {
    const cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const item = cart.find((i) => i.id === dishId);
    return item ? (item.quantity || 1) : 0;
  }

  // Add Dish to Cart
  function addToCart(dish, portion = null, customQty = 1) {
    let cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const targetPrice = portion ? portion.price : dish.price;
    const targetTitle = portion ? `${dish.title} (${portion.name})` : dish.title;
    const targetId = portion ? `${dish.id}-${portion.name.toLowerCase().replace(/\s+/g, '-')}` : dish.id;

    const existing = cart.find((item) => item.id === targetId);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + customQty;
    } else {
      cart.push({
        id: targetId,
        title: targetTitle,
        price: targetPrice,
        image: dish.image,
        quantity: customQty
      });
    }

    localStorage.setItem('khalo_cart', JSON.stringify(cart));
    syncCartUI();
  }

  // Change Quantity from Card controls
  function updateCartQty(dishId, delta) {
    let cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const index = cart.findIndex((i) => i.id === dishId);

    if (index > -1) {
      cart[index].quantity = (cart[index].quantity || 1) + delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      localStorage.setItem('khalo_cart', JSON.stringify(cart));
      syncCartUI();
      renderDishes();
    }
  }

  // =========================================================================
  // 4. FILTERING, SORTING & RENDERING
  // =========================================================================
  function getFilteredDishes() {
    let filtered = DISHES.filter((dish) => {
      // Category match
      if (currentCategory !== 'all' && dish.category !== currentCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = dish.title.toLowerCase().includes(q);
        const matchesDesc = dish.description.toLowerCase().includes(q);
        const matchesCat = dish.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });

    // Sorting
    if (currentSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    } else if (currentSort === 'fastest') {
      filtered.sort((a, b) => parseInt(a.prepTime) - parseInt(b.prepTime));
    }

    return filtered;
  }

  // Update Category Badge Counts
  function updateCategoryPillCounts() {
    categoryPills.forEach((pill) => {
      const cat = pill.dataset.category;
      let count = 0;
      if (cat === 'all') {
        count = DISHES.length;
      } else {
        count = DISHES.filter((d) => d.category === cat).length;
      }
      const countEl = pill.querySelector('.category-pill-count');
      if (countEl) countEl.textContent = count;
    });
  }

  // Render Dishes to Grid
  function renderDishes() {
    if (!menuGrid) return;
    const items = getFilteredDishes();

    // Update Status Title & Count
    const categoryNames = {
      all: 'All Delicious Dishes',
      biryani: 'Aromatic Biryani & Rice',
      karahi: 'Sizzling Karahi & Handi',
      bbq: 'Smoked BBQ & Kebabs',
      burgers: 'Juicy Burgers & Sandwiches',
      sides: 'Crispy Fries & Starters',
      desserts: 'Mouthwatering Desserts & Sweets',
      drinks: 'Chilled Drinks & Refreshers'
    };

    if (statusTitle) {
      statusTitle.textContent = searchQuery ? `Search Results for "${searchQuery}"` : categoryNames[currentCategory] || 'Menu Dishes';
    }
    if (statusCount) {
      statusCount.textContent = `${items.length} ${items.length === 1 ? 'Dish' : 'Dishes'} Available`;
    }

    // Handle Empty Results
    if (items.length === 0) {
      menuGrid.innerHTML = `
        <div class="menu-empty-state">
          <div class="empty-state-icon">
            <span class="material-symbols-outlined">restaurant</span>
          </div>
          <h3 class="empty-state-title">No Dishes Found</h3>
          <p class="empty-state-desc">We couldn't find any dishes matching your craving or search query. Try searching for "Biryani" or "Burger".</p>
          <button type="button" class="empty-state-reset-btn" id="empty-state-reset-btn">
            <span class="material-symbols-outlined">refresh</span>
            <span>Reset All Filters</span>
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('empty-state-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          searchQuery = '';
          currentSort = 'recommended';
          if (searchInput) searchInput.value = '';
          if (searchClearBtn) searchClearBtn.classList.remove('is-visible');
          if (sortSelect) sortSelect.value = 'recommended';
          categoryPills.forEach((p) => p.classList.toggle('active', p.dataset.category === 'all'));
          renderDishes();
        });
      }
      return;
    }

    // Clean Inline SVG Icons dictionary
    const CARD_SVGS = {
      heart: `<svg class="icon-fav" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`,
      star: `<svg class="rating-star-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
      schedule: `<svg class="dish-time-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3"/></svg>`,
      cart: `<svg class="btn-cart-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
      check: `<svg class="btn-cart-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`,
      bolt: `<svg class="badge-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-6 10.49z"/></svg>`,
      truck: `<svg class="badge-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="3" width="15" height="13" stroke-width="2" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16" stroke-width="2"/><circle cx="5.5" cy="18.5" r="2.5" stroke-width="2"/><circle cx="18.5" cy="18.5" r="2.5" stroke-width="2"/></svg>`,
      tag: `<svg class="badge-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"/></svg>`,
      award: `<svg class="badge-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
      flame: `<svg class="badge-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.61 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>`,
      grill: `<svg class="badge-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 11a8 8 0 0016 0H4zm4 4v5m8-5v5m-4-5v3M8 6a2 2 0 012-2m4 0a2 2 0 012 2"/></svg>`,
      moon: `<svg class="badge-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.3 2a10 10 0 00-1.9 19.8 10 10 0 009.6-9.6A10 10 0 0112.3 2z"/></svg>`
    };

    // Curated single badge lookup (Every card has EXACTLY ONE clean badge)
    function getDishSingleBadge(dish) {
      switch (dish.id) {
        case 'shahi-dum-biryani':
          return { text: 'Bestseller', svg: CARD_SVGS.bolt, class: 'dish-badge--bestseller' };
        case 'special-mutton-dum-biryani':
          return { text: "Chef's Choice", svg: CARD_SVGS.award, class: 'dish-badge--chef' };
        case 'sindhi-spicy-biryani':
          return { text: 'Free Delivery', svg: CARD_SVGS.truck, class: 'dish-badge--freedelivery' };
        case 'beef-nalli-biryani':
          return { text: 'Hot Deal', svg: CARD_SVGS.tag, class: 'dish-badge--deal' };
        case 'desi-chicken-karahi':
          return { text: 'Bestseller', svg: CARD_SVGS.bolt, class: 'dish-badge--bestseller' };
        case 'mutton-shinwari-karahi':
          return { text: 'Slow-cooked', svg: CARD_SVGS.flame, class: 'dish-badge--default' };
        case 'white-chicken-handi':
          return { text: 'Free Delivery', svg: CARD_SVGS.truck, class: 'dish-badge--freedelivery' };
        case 'paneer-reshmi-handi':
          return { text: "Chef's Choice", svg: CARD_SVGS.award, class: 'dish-badge--chef' };
        case 'seekh-malai-platter':
          return { text: 'Charcoal Smoke', svg: CARD_SVGS.grill, class: 'dish-badge--yellow' };
        case 'reshmi-malai-boti':
          return { text: 'Hot Deal', svg: CARD_SVGS.tag, class: 'dish-badge--deal' };
        case 'beef-bihari-boti':
          return { text: 'Free Delivery', svg: CARD_SVGS.truck, class: 'dish-badge--freedelivery' };
        case 'smashed-double-burger':
          return { text: 'Bestseller', svg: CARD_SVGS.bolt, class: 'dish-badge--bestseller' };
        case 'loaded-beef-burger':
          return { text: 'Hot Deal', svg: CARD_SVGS.tag, class: 'dish-badge--deal' };
        case 'crispy-zinger-crunch':
          return { text: 'Free Delivery', svg: CARD_SVGS.truck, class: 'dish-badge--freedelivery' };
        case 'animal-fries-mess':
          return { text: 'Midnight Hit', svg: CARD_SVGS.moon, class: 'dish-badge--green' };
        case 'peri-peri-crinkle-fries':
          return { text: 'Hot Deal', svg: CARD_SVGS.tag, class: 'dish-badge--deal' };
        case 'garlic-butter-naan':
          return { text: 'Free Delivery', svg: CARD_SVGS.truck, class: 'dish-badge--freedelivery' };
        case 'molten-lava-cake':
          return { text: 'Bestseller', svg: CARD_SVGS.bolt, class: 'dish-badge--bestseller' };
        case 'shahi-gulab-jamun-sundae':
          return { text: 'Hot Deal', svg: CARD_SVGS.tag, class: 'dish-badge--deal' };
        case 'zafrani-matka-kheer':
          return { text: "Chef's Choice", svg: CARD_SVGS.award, class: 'dish-badge--chef' };
        case 'kulhad-sweet-lassi':
          return { text: 'Bestseller', svg: CARD_SVGS.bolt, class: 'dish-badge--bestseller' };
        case 'chilled-mint-margarita':
          return { text: 'Free Delivery', svg: CARD_SVGS.truck, class: 'dish-badge--freedelivery' };
        case 'chilled-cold-drink':
          return { text: 'Hot Deal', svg: CARD_SVGS.tag, class: 'dish-badge--deal' };
        default:
          if (dish.isBestseller) return { text: 'Bestseller', svg: CARD_SVGS.bolt, class: 'dish-badge--bestseller' };
          if (dish.originalPrice && dish.originalPrice > dish.price) return { text: 'Hot Deal', svg: CARD_SVGS.tag, class: 'dish-badge--deal' };
          if (dish.isChefSpecial) return { text: "Chef's Choice", svg: CARD_SVGS.award, class: 'dish-badge--chef' };
          return { text: 'Free Delivery', svg: CARD_SVGS.truck, class: 'dish-badge--freedelivery' };
      }
    }

    function getDishRestaurant(dish) {
      switch (dish.category) {
        case 'biryani': return 'KhaLo Kitchen • Clifton';
        case 'karahi': return 'Hot N Spicy • Tariq Road';
        case 'bbq': return 'Kolachi BBQ Grill • Do Darya';
        case 'burgers': return 'Bun & Patty • DHA Phase 6';
        case 'sides': return 'Fries Point • Bahadurabad';
        case 'desserts': return 'Sweet Escape • SMCHS';
        case 'drinks': return 'KhaLo Beverage Bar • Clifton';
        default: return 'KhaLo Kitchen • Clifton';
      }
    }

    // Build Cards HTML — Exact parity with home.html dish-card structure (Pure SVG Icons)
    menuGrid.innerHTML = items.map((dish) => {
      const isFav = isDishFavorite(dish.id);
      const badge = getDishSingleBadge(dish);
      const restaurant = getDishRestaurant(dish);

      return `
        <article class="dish-card" data-dish-id="${dish.id}">
          <div class="dish-img-wrap btn-open-modal" data-id="${dish.id}" style="cursor: pointer;" title="Tap to view details & options for ${dish.title}">
            <img src="${dish.image}" alt="${dish.title}" class="dish-img" loading="lazy" />
            <button class="fav-toggle ${isFav ? 'is-active' : ''}" aria-label="Save to favorites" type="button" data-id="${dish.id}" data-dish-id="${dish.id}">
              ${CARD_SVGS.heart}
            </button>
            <span class="dish-badge ${badge.class}">
              ${badge.svg}
              <span>${badge.text}</span>
            </span>
          </div>
          <div class="dish-body">
            <div class="dish-info">
              <h3 class="dish-name btn-open-modal" data-id="${dish.id}" title="${dish.title}" style="cursor: pointer;">${dish.title}</h3>
              <p class="dish-restaurant">${restaurant}</p>
              <div class="dish-rating">
                <span class="rating-score">
                  ${CARD_SVGS.star}
                  <span>${dish.rating}</span>
                </span>
                <span class="rating-count">(${dish.reviews}+ reviews)</span>
              </div>
            </div>
            <div class="dish-footer">
              <div class="dish-meta">
                <span class="dish-time">
                  ${CARD_SVGS.schedule}
                  <span>${dish.prepTime}</span>
                </span>
                <span class="dish-price">Rs. ${dish.price.toLocaleString()}</span>
              </div>
              <button class="btn-add btn-add-dish" type="button" data-id="${dish.id}" data-item="${dish.title}" data-price="${dish.price}" data-image="${dish.image}">
                <span>Add to Cart</span>
                <span class="btn-icon-holder">${CARD_SVGS.cart}</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach Event Listeners to Cards
    attachCardEvents();
  }

  // Attach Card Interactions (Add to cart, Favorite, Quick-view Modal)
  function attachCardEvents() {
    // Add Dish to Cart Button: opens quick-view modal instead of adding directly
    document.querySelectorAll('.btn-add-dish').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dishId = btn.dataset.id;
        const dish = DISHES.find((d) => d.id === dishId) || (typeof window.resolveKhaloProduct === 'function' ? window.resolveKhaloProduct(btn) : null);
        if (dish) {
          openDishModal(dish);
        }
      });
    });

    // Favorite Button
    document.querySelectorAll('.fav-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dishId = btn.dataset.id || btn.dataset.dishId;
        const dish = DISHES.find((d) => d.id === dishId);
        if (dish) toggleDishFavorite(dishId, dish.title, btn);
      });
    });

    // Click on Card Title or Image to Open Modal
    document.querySelectorAll('.btn-open-modal').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // Prevent click if user clicked directly on the favorite heart
        if (e.target.closest('.fav-toggle')) return;
        const dishId = btn.dataset.id;
        const dish = DISHES.find((d) => d.id === dishId);
        if (dish) openDishModal(dish);
      });
    });
  }

  // =========================================================================
  // 5. QUICK VIEW / PORTION MODAL
  // =========================================================================
  function openDishModal(dish) {
    selectedModalDish = dish;
    selectedModalPortionIdx = 0;

    if (modalImg) modalImg.src = dish.image;
    if (modalImg) modalImg.alt = dish.title;
    if (modalTitle) modalTitle.textContent = dish.title;
    if (modalPrice) modalPrice.textContent = `Rs. ${(dish.portions ? dish.portions[0].price : dish.price).toLocaleString()}`;
    if (modalDesc) modalDesc.textContent = dish.description;
    if (modalRating) modalRating.textContent = `${dish.rating} ★ (${dish.reviews} reviews)`;
    if (modalTime) modalTime.textContent = dish.prepTime;
    if (modalSpice) modalSpice.textContent = dish.spiceLevel;

    // Render Portion Options if available
    if (modalPortionsContainer) {
      if (dish.portions && dish.portions.length > 0) {
        modalPortionsContainer.innerHTML = `
          <div class="menu-modal-section-title">Select Serving Size</div>
          <div class="portion-options-grid">
            ${dish.portions.map((portion, idx) => `
              <div class="portion-option-card ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
                <div>
                  <div class="portion-name">${portion.name}</div>
                  <div class="portion-sub">${portion.sub}</div>
                </div>
                <div class="portion-price">Rs. ${portion.price.toLocaleString()}</div>
              </div>
            `).join('')}
          </div>
        `;

        modalPortionsContainer.querySelectorAll('.portion-option-card').forEach((card) => {
          card.addEventListener('click', () => {
            modalPortionsContainer.querySelectorAll('.portion-option-card').forEach((c) => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedModalPortionIdx = parseInt(card.dataset.idx, 10);
            const selPortion = dish.portions[selectedModalPortionIdx];
            if (modalPrice) modalPrice.textContent = `Rs. ${selPortion.price.toLocaleString()}`;
          });
        });
      } else {
        modalPortionsContainer.innerHTML = '';
      }
    }

    if (modalBackdrop) modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDishModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    selectedModalDish = null;
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDishModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeDishModal();
    });
  }

  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      if (selectedModalDish) {
        const portion = (selectedModalDish.portions && selectedModalDish.portions.length > 0)
          ? selectedModalDish.portions[selectedModalPortionIdx]
          : null;
        addToCart(selectedModalDish, portion);

        // Visual feedback: 'Added' text and green checkmark
        const origHtml = modalAddBtn.innerHTML;
        modalAddBtn.classList.add('is-added');
        modalAddBtn.innerHTML = `
          <span>Added</span>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style="width:17px;height:17px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        `;
        setTimeout(() => {
          modalAddBtn.innerHTML = origHtml;
          modalAddBtn.classList.remove('is-added');
          closeDishModal();
        }, 500);
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
      closeDishModal();
    }
  });

  // =========================================================================
  // 6. EVENT LISTENERS: SEARCH, CATEGORIES, CHIPS, SORT
  // =========================================================================

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('is-visible', searchQuery.trim().length > 0);
      }
      renderDishes();
    });
  }

  // Clear Search
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClearBtn.classList.remove('is-visible');
      renderDishes();
    });
  }

  // Category Pills
  categoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      categoryPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.category || 'all';
      renderDishes();

      // Scroll into view horizontally on mobile
      pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });

  // Sort Dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderDishes();
    });
  }

  // Hero Quick Category Shortcut Buttons
  document.querySelectorAll('.menu-quicktag').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCat = btn.dataset.targetCategory;
      if (!targetCat) return;
      currentCategory = targetCat;
      categoryPills.forEach((p) => {
        const isMatch = p.dataset.category === targetCat;
        p.classList.toggle('active', isMatch);
        if (isMatch) {
          p.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
      renderDishes();
      const catalogEl = document.getElementById('menu-catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Hero Featured Dish Order Button
  document.querySelectorAll('[data-open-dish]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dishId = btn.dataset.openDish;
      const dish = DISHES.find((d) => d.id === dishId);
      if (dish) {
        openDishModal(dish);
      }
    });
  });

  // Hero Browse All button smooth scroll
  const heroScrollBtn = document.getElementById('hero-scroll-catalog-btn');
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const catalogEl = document.getElementById('menu-catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =========================================================================
  // 7. SHARED NAVIGATION & APP BEHAVIORS (NAVBAR, BACK-TO-TOP, DRAWER)
  // =========================================================================

  // Hamburger Drawer is handled universally by location-dropdown.js

  // Back to Top Button
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

  // Year in Footer
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // Storage Listener (Synchronize across multiple tabs/windows)
  window.addEventListener('storage', (event) => {
    if (event.key === 'khalo_cart') syncCartUI();
    if (event.key === 'khalo_favorites') syncFavoritesUI();
  });

  // =========================================================================
  // 8. INITIALIZATION
  // =========================================================================
  updateCategoryPillCounts();
  syncCartUI();
  syncFavoritesUI();
  renderDishes();

})();
