/**
 * KhaLo — quick-view-modal.js
 * Universal Product / Dish Details Quick-View Modal
 * Provides interactive modal popup when clicking on dish/deal/special cards
 * across Home, Find My Meal, KhaLo Specials, and Deals pages.
 */

(() => {
  'use strict';

  // Comprehensive Product Catalog across KhaLo Karachi
  const GLOBAL_CATALOG = {
    // === HOME & MENU POPULAR DISHES ===
    'shahi-dum-biryani': {
      id: 'shahi-dum-biryani',
      title: 'Shahi Dum Biryani',
      price: 480,
      image: '../assets/Shahi Dum Biryani.jpg',
      description: 'Long-grain aged basmati rice slow-dum cooked with tender fresh chicken, pure saffron, and aromatic Kewra water.',
      rating: 4.9,
      reviews: '1.8k',
      prepTime: '25-30 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Single Box', sub: 'Serves 1 person', price: 480 },
        { name: 'Family Matka', sub: 'Serves 3-4 persons', price: 1420 }
      ]
    },
    'shahi-dum-biryani-sp': {
      id: 'shahi-dum-biryani-sp',
      title: 'Special Shahi Dum Biryani',
      price: 899,
      image: '../assets/Special Shahi Dum Biryani.jpg',
      description: 'Chef\'s signature saffron dum biryani with marinated prime cuts, fried caramelized onions, whole cloves, and golden potatoes.',
      rating: 4.9,
      reviews: '1.4k',
      prepTime: '30 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Regular Matka', sub: 'Serves 1-2 persons', price: 899 },
        { name: 'Family Handi', sub: 'Serves 3-4 persons', price: 1750 }
      ]
    },
    'chicken-karahi': {
      id: 'chicken-karahi',
      title: 'Chicken Karahi',
      price: 1150,
      image: '../assets/Chicken Karahi.jpg',
      description: 'Iron wok-fired bone-in chicken simmered in ripe country tomatoes, ginger juliennes, green chillies, and freshly cracked black pepper.',
      rating: 4.8,
      reviews: '850',
      prepTime: '30-40 min',
      spiceLevel: 'Spicy',
      portions: [
        { name: 'Half Karahi', sub: 'Serves 1-2 persons', price: 1150 },
        { name: 'Full Karahi', sub: 'Serves 3-4 persons', price: 1980 }
      ]
    },
    'seekh-malai-platter': {
      id: 'seekh-malai-platter',
      title: 'Seekh & Malai Platter',
      price: 1450,
      image: '../assets/Seekh & Malai Platter.jpg',
      description: 'Charcoal flame-grilled tender beef seekh kababs paired with velvety boneless reshmi malai boti, served with parathas and mint dip.',
      rating: 4.9,
      reviews: '580',
      prepTime: '35-45 min',
      spiceLevel: 'Mild',
      portions: [
        { name: 'Platter for Two', sub: 'Includes Parathas & Dips', price: 1450 },
        { name: 'Jumbo Feast (4 Persons)', sub: 'Double Skewers + Naan basket', price: 2690 }
      ]
    },
    'smashed-double-burger': {
      id: 'smashed-double-burger',
      title: 'Smashed Double Burger',
      price: 780,
      image: '../assets/Smashed Double Burger.jpg',
      description: 'Two crispy-edged smashed prime beef patties topped with melted cheddar, house secret sauce, and pickles in a toasted brioche bun.',
      rating: 4.9,
      reviews: '920',
      prepTime: '20-25 min',
      spiceLevel: 'Mild',
      portions: [
        { name: 'Single Burger', sub: 'Solo burger with secret sauce', price: 780 },
        { name: 'Combo Meal', sub: 'With Fries & Chilled Soft Drink', price: 1050 }
      ]
    },

    // === MIDNIGHT CRAVINGS ===
    'loaded-beef-burger': {
      id: 'loaded-beef-burger',
      title: 'Loaded Beef Burger',
      price: 850,
      image: '../assets/Loaded beef burger.jpg',
      description: 'Thick grilled beef patty crowned with caramelized onions, smoky BBQ sauce, melted Monterey jack, and crispy beef bacon bits.',
      rating: 4.8,
      reviews: '640',
      prepTime: '15-20 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Single Burger', sub: 'Solo loaded burger', price: 850 },
        { name: 'Late Night Combo', sub: 'With Animal Fries & Drink', price: 1220 }
      ]
    },
    'animal-fries-mess': {
      id: 'animal-fries-mess',
      title: 'Animal Fries Mess',
      price: 600,
      image: '../assets/Animal Fries Mess.jpg',
      description: 'Golden crispy fries smothered in seasoned minced beef chili, signature creamy cheese sauce, diced jalapenos, and grilled onions.',
      rating: 4.8,
      reviews: '810',
      prepTime: '15-20 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Regular Box', sub: 'Serves 1 person', price: 600 },
        { name: 'Monster Mess Platter', sub: 'Serves 2-3 persons', price: 980 }
      ]
    },
    'molten-lava-cake': {
      id: 'molten-lava-cake',
      title: 'Molten Lava Cake',
      price: 550,
      image: '../assets/Molten Lava Cake.jpg',
      description: 'Freshly baked rich Belgian dark chocolate sponge oozing with a warm liquid chocolate center, dusted with confectioner sugar.',
      rating: 4.9,
      reviews: '1.1k',
      prepTime: '10 min',
      spiceLevel: 'None',
      portions: [
        { name: 'Single Lava Cake', sub: 'Warm molten chocolate cake', price: 550 },
        { name: 'With Vanilla Gelato', sub: 'Served with artisan ice cream scoop', price: 680 }
      ]
    },

    // === KHALO SPECIALS ===
    'special-royal-biryani': {
      id: 'special-royal-biryani',
      title: 'Royal Shahi Mutton Dum Biryani',
      price: 1590,
      image: '../assets/Special Shahi Dum Biryani.jpg',
      description: 'Aged fragrant saffron basmati rice slow-sealed on marinated tender mutton cuts, natural kewra water, and pure country ghee.',
      rating: 4.9,
      reviews: '1.9k',
      prepTime: '35-45 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Royal Handi (Serves 2)', sub: 'Clay sealed dum handi', price: 1590 },
        { name: 'Grand Daawat Thaal (Serves 4)', sub: 'With extra meat cuts & boiled eggs', price: 2990 }
      ]
    },
    'spec-dum-handi': {
      id: 'spec-dum-handi',
      title: 'Shahi Dum Mutton Handi Biryani',
      price: 1290,
      image: '../assets/Special Shahi Dum Biryani.jpg',
      description: 'Hand-ground spices, 2-year aged basmati, and prime mutton slow-cooked in dough-sealed earthen handis over live embers.',
      rating: 4.9,
      reviews: '1.4k',
      prepTime: '30-40 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Signature Matka (Serves 2)', sub: 'Earthen handi dum cooked', price: 1290 },
        { name: 'Family Clay Handi (Serves 4)', sub: 'Generous feast with raita & salad', price: 2450 }
      ]
    },
    'spec-desi-karahi': {
      id: 'spec-desi-karahi',
      title: 'Peshawari Desi Ghee Lamb Karahi',
      price: 1890,
      image: '../assets/Chicken Karahi.jpg',
      description: 'Tender cuts simmered in pure country butter and fresh ripe tomatoes, seasoned only with coarse black pepper, sea salt, and ginger juliennes.',
      rating: 4.9,
      reviews: '980',
      prepTime: '35-40 min',
      spiceLevel: 'Spicy',
      portions: [
        { name: 'Full Iron Wok (Serves 2-3)', sub: 'Cooked in 100% pure desi makhan', price: 1890 },
        { name: 'Grand Feast Wok (Serves 4-5)', sub: 'Double portion + 4 Roghni Naans', price: 3450 }
      ]
    },
    'spec-seekh-platter': {
      id: 'spec-seekh-platter',
      title: 'Charcoal Seekh & Reshmi Malai Boti Platter',
      price: 1450,
      image: '../assets/Seekh & Malai Platter.jpg',
      description: 'Double portion of flame-kissed seekh kababs and cream-marinated reshmi malai boti skewers, served over live wood charcoal embers.',
      rating: 4.9,
      reviews: '1.8k',
      prepTime: '25-30 min',
      spiceLevel: 'Mild',
      portions: [
        { name: 'Platter for Two', sub: '4 Beef Seekh + 8 Malai Boti + 2 Parathas', price: 1450 },
        { name: 'Jumbo BBQ Feast (Serves 4)', sub: '8 Seekh + 16 Malai Boti + 4 Parathas', price: 2750 }
      ]
    },
    'spec-kunna-gosht': {
      id: 'spec-kunna-gosht',
      title: 'Clay-Pot Chinioti Kunna Gosht',
      price: 1650,
      image: '../assets/Chicken Karahi.jpg',
      description: 'Melt-in-mouth mutton shank gently braised in an earthen clay pot with flour roux, pure ghee, and whole spices for 6+ hours.',
      rating: 4.8,
      reviews: '750',
      prepTime: '40-50 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Claypot (Serves 2)', sub: 'Includes 2 Roghni Naans', price: 1650 },
        { name: 'Large Claypot (Serves 4)', sub: 'Double shank cuts + 4 Naans', price: 3100 }
      ]
    },
    'spec-sindhi-biryani': {
      id: 'spec-sindhi-biryani',
      title: 'Authentic Karachi Sindhi Dum Biryani',
      price: 950,
      image: '../assets/Shahi Dum Biryani.jpg',
      description: 'Zesty, fiery Karachi biryani layered with marinated chicken, soft spiced potatoes, dried plums, and green chili paste.',
      rating: 4.8,
      reviews: '1.6k',
      prepTime: '25 min',
      spiceLevel: 'Spicy',
      portions: [
        { name: 'Double Plate (Serves 2)', sub: 'With raita & fresh salad', price: 950 },
        { name: 'Family Matka (Serves 4)', sub: 'Jumbo pot with extra potatoes & plums', price: 1850 }
      ]
    },
    'spec-white-handi': {
      id: 'spec-white-handi',
      title: 'Royal Creamy Kasturi Chicken Handi',
      price: 1350,
      image: '../assets/Chicken Karahi.jpg',
      description: 'Boneless tender chicken cubes cooked in fresh country cream, roasted cashew nut paste, white pepper, and fragrant dried fenugreek.',
      rating: 4.8,
      reviews: '910',
      prepTime: '30 min',
      spiceLevel: 'Mild',
      portions: [
        { name: 'Handi for Two', sub: 'Served with 2 butter naans', price: 1350 },
        { name: 'Family Clay Handi', sub: 'Serves 4 persons with 4 naans', price: 2550 }
      ]
    },
    'spec-platter-feast': {
      id: 'spec-platter-feast',
      title: 'Grand Darbar Charcoal Kebab & Boti Thaal',
      price: 2890,
      image: '../assets/Seekh & Malai Platter.jpg',
      description: 'The ultimate royal barbecue assembly featuring Bihari boti, seekh kababs, reshmi boti, fish tikka, parathas, and spiced dips.',
      rating: 5.0,
      reviews: '1.1k',
      prepTime: '35-45 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Darbar Thaal (Serves 4-5)', sub: 'All signature BBQ cuts + Parathas', price: 2890 },
        { name: 'Royal Banquet (Serves 7-8)', sub: 'Double assembly + Drinks & Desserts', price: 4990 }
      ]
    },
    'spec-rabri-kheer': {
      id: 'spec-rabri-kheer',
      title: 'Matka Zafrani Rabri Kheer',
      price: 450,
      image: '../assets/Molten Lava Cake.jpg',
      description: 'Slow-condensed buffalo milk layered with thick caramelized rabri lachhas, crushed cardamom, roasted pistachios, and pure saffron.',
      rating: 4.9,
      reviews: '2.1k',
      prepTime: '5-10 min',
      spiceLevel: 'None',
      portions: [
        { name: 'Single Clay Matka', sub: 'Chilled earthen cup (350ml)', price: 450 },
        { name: 'Family Clay Thaal', sub: 'Feast bowl (1.2kg) serves 4-5', price: 1190 }
      ]
    },

    // === DEALS ===
    'deal-bbq-night': {
      id: 'deal-bbq-night',
      title: 'Grand Karachi BBQ Night Platter',
      price: 1490,
      image: '../assets/Seekh & Malai Platter.jpg',
      description: '4 Beef Seekh Kababs, 8 Malai Boti skewers, 2 Crispy Parathas, spiced mint raita, and 2 chilled soft drinks.',
      rating: 4.9,
      reviews: '1.6k',
      prepTime: '25-35 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Weekend BBQ Feast (Serves 2-3)', sub: 'Was Rs. 2,150 • 30% OFF', price: 1490 },
        { name: 'Mega Feast (Serves 4-5)', sub: 'Double skewers + 4 Parathas + 4 Drinks', price: 2690 }
      ]
    },
    'deal-biryani-feast': {
      id: 'deal-biryani-feast',
      title: 'Royal Dum Biryani Feast',
      price: 1590,
      image: '../assets/Special Shahi Dum Biryani.jpg',
      description: '2 Full Shahi Dum Biryanis, 4 Chicken Seekh Kababs, zeera raita, fresh kachumber salad, and 1.5L chilled drink.',
      rating: 4.9,
      reviews: '1.8k',
      prepTime: '30-35 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Standard Combo (Serves 3-4)', sub: 'Was Rs. 2,250 • 29% OFF', price: 1590 },
        { name: 'Grand Feast (Serves 6)', sub: 'Includes 4 Biryanis + 8 Kababs + Drinks', price: 2850 }
      ]
    },
    'deal-karahi-combo': {
      id: 'deal-karahi-combo',
      title: 'Desi Ghee Karahi & Naan Trio',
      price: 1750,
      image: '../assets/Chicken Karahi.jpg',
      description: '1 Full Chicken Karahi in pure desi ghee, 4 Piping hot Roghni Naans, mint raita, and fresh onion salad.',
      rating: 4.9,
      reviews: '940',
      prepTime: '35-40 min',
      spiceLevel: 'Spicy',
      portions: [
        { name: 'Full Karahi Combo (Serves 3)', sub: 'Was Rs. 2,400 • 27% OFF', price: 1750 },
        { name: 'Family Feast (Serves 5)', sub: 'With 1.5 Karahi + 6 Roghni Naans', price: 3100 }
      ]
    },
    'deal-burger-duo': {
      id: 'deal-burger-duo',
      title: 'Smashed Burger Duo & Fries Combo',
      price: 1290,
      image: '../assets/Smashed Double Burger.jpg',
      description: '2 Gourmet Smashed Double Beef Burgers, 1 Monster Mess Animal Fries, and 2 chilled soft drinks.',
      rating: 4.8,
      reviews: '1.4k',
      prepTime: '20-25 min',
      spiceLevel: 'Mild',
      portions: [
        { name: '2 Burgers + Mess Fries + 2 Drinks', sub: 'Was Rs. 1,750 • 26% OFF', price: 1290 },
        { name: '4 Burgers Family Combo', sub: '4 Smashed Burgers + 2 Fries + 4 Drinks', price: 2390 }
      ]
    },
    'deal-midnight-munchies': {
      id: 'deal-midnight-munchies',
      title: 'Midnight Cravers Feast',
      price: 990,
      image: '../assets/Loaded beef burger.jpg',
      description: '1 Loaded Beef Burger, 1 Hot Animal Fries, 1 Warm Molten Lava Cake, and 1 chilled drink.',
      rating: 4.8,
      reviews: '1.1k',
      prepTime: '15-20 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Midnight Box (Serves 2)', sub: 'Was Rs. 1,450 • 31% OFF', price: 990 },
        { name: 'Late Night Party Box (Serves 4)', sub: 'Double burgers, fries & cakes', price: 1850 }
      ]
    },
    'deal-family-handi': {
      id: 'deal-family-handi',
      title: 'White Handi & Paratha Banquet',
      price: 2190,
      image: '../assets/Chicken Karahi.jpg',
      description: '1 Full Creamy White Chicken Handi, 4 Crispy Lachedar Parathas, zeera raita, and 4 Kheer Matkas.',
      rating: 4.9,
      reviews: '730',
      prepTime: '30-40 min',
      spiceLevel: 'Mild',
      portions: [
        { name: 'Banquet for 4-5 Persons', sub: 'Was Rs. 2,950 • 25% OFF', price: 2190 },
        { name: 'Grand Banquet (Serves 7)', sub: 'With extra half handi & desserts', price: 3850 }
      ]
    },
    'deal-bbq-paratha': {
      id: 'deal-bbq-paratha',
      title: 'Smoked Malai Boti Paratha Roll Duo',
      price: 790,
      image: '../assets/Seekh & Malai Platter.jpg',
      description: '2 Jumbo Charcoal Smoked Malai Boti Paratha Rolls wrapped with spiced onion rings and garlic mayo, plus 1 soft drink.',
      rating: 4.9,
      reviews: '2.1k',
      prepTime: '15-20 min',
      spiceLevel: 'Mild',
      portions: [
        { name: '2 Jumbo Rolls + 1 Drink', sub: 'Was Rs. 1,100 • 28% OFF', price: 790 },
        { name: '4 Rolls Family Pack + 2 Drinks', sub: 'Ideal for group cravings', price: 1490 }
      ]
    }
  };

  // Add Aliases for dishes and deals across all pages
  GLOBAL_CATALOG['special-mutton-dum-biryani'] = GLOBAL_CATALOG['shahi-dum-biryani-sp'];
  GLOBAL_CATALOG['special-royal-biryani'] = GLOBAL_CATALOG['special-royal-biryani'] || GLOBAL_CATALOG['shahi-dum-biryani-sp'];
  GLOBAL_CATALOG['desi-chicken-karahi'] = GLOBAL_CATALOG['chicken-karahi'];

  // State
  let currentProduct = null;
  let currentPortionIdx = 0;

  // Ensure Modal Styles exist in page head
  function ensureModalStyles() {
    if (document.getElementById('khalo-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'khalo-modal-styles';
    style.textContent = `
      .menu-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(28, 23, 20, 0.72);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.25rem;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.25s ease, visibility 0.25s ease;
      }
      .menu-modal-backdrop.is-open {
        opacity: 1;
        visibility: visible;
      }
      .menu-modal-window {
        background: #ffffff;
        border-radius: 24px;
        max-width: 580px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
        transform: translateY(20px) scale(0.97);
        transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .menu-modal-backdrop.is-open .menu-modal-window {
        transform: translateY(0) scale(1);
      }
      .menu-modal-close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1a1919;
        border: none;
        cursor: pointer;
        z-index: 10;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s, background 0.2s;
      }
      .menu-modal-close-btn:hover {
        transform: scale(1.1);
        background: #ffffff;
        color: #ff6b35;
      }
      .menu-modal-img-wrap {
        width: 100%;
        height: 250px;
        overflow: hidden;
        background: #f5ebe1;
        position: relative;
      }
      .menu-modal-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .menu-modal-body {
        padding: 1.5rem 1.6rem 1.6rem;
      }
      .menu-modal-header-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }
      .menu-modal-title {
        font-size: 1.45rem;
        font-weight: 900;
        color: #1a1919;
        line-height: 1.2;
        margin: 0;
      }
      .menu-modal-price {
        font-size: 1.45rem;
        font-weight: 900;
        color: #ab3500;
        white-space: nowrap;
      }
      .menu-modal-desc {
        font-size: 13.5px;
        color: #594139;
        line-height: 1.55;
        margin: 0 0 1.15rem;
      }
      .menu-modal-meta-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.65rem;
        margin-bottom: 1.25rem;
        padding: 0.75rem;
        background: #faf6f2;
        border-radius: 14px;
        border: 1px solid #eeded5;
      }
      .modal-meta-card {
        text-align: center;
      }
      .modal-meta-label {
        font-size: 10.5px;
        text-transform: uppercase;
        color: #8d766e;
        font-weight: 800;
        letter-spacing: 0.05em;
        margin-bottom: 2px;
      }
      .modal-meta-val {
        font-size: 13.5px;
        font-weight: 850;
        color: #1a1919;
      }
      .menu-modal-section-title {
        font-size: 13.5px;
        font-weight: 800;
        color: #1a1919;
        margin-bottom: 0.55rem;
      }
      .portion-options-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.65rem;
        margin-bottom: 1.25rem;
      }
      .portion-option-card {
        padding: 0.75rem 0.9rem;
        border-radius: 12px;
        border: 1.5px solid #eeded5;
        background: #ffffff;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.4rem;
      }
      .portion-option-card:hover {
        border-color: #ff6b35;
        background: #fffbf8;
      }
      .portion-option-card.selected {
        border-color: #ff6b35;
        background: #fff8f4;
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.14);
      }
      .portion-name {
        font-size: 13px;
        font-weight: 800;
        color: #1a1919;
      }
      .portion-sub {
        font-size: 11px;
        color: #8d766e;
        margin-top: 1px;
      }
      .portion-price {
        font-size: 13px;
        font-weight: 800;
        color: #ab3500;
        white-space: nowrap;
      }
      .menu-modal-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 0.85rem;
      }
      .modal-add-to-cart-btn {
        flex: 1;
        height: 48px;
        background: linear-gradient(135deg, #ff6b35, #ff5722);
        color: #ffffff;
        border-radius: 9999px;
        font-size: 14.5px;
        font-weight: 800;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        cursor: pointer;
        border: none;
        box-shadow: 0 4px 14px rgba(255, 107, 53, 0.3);
        transition: all 0.2s ease;
        font-family: inherit;
      }
      .modal-add-to-cart-btn:hover {
        background: linear-gradient(135deg, #f25c24, #e64a19);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
      }
      .modal-add-to-cart-btn.is-added {
        background: #2e7d32 !important;
        box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3) !important;
      }
      @media (max-width: 640px) {
        .menu-modal-window {
          border-radius: 20px;
          max-height: 92vh;
        }
        .menu-modal-img-wrap {
          height: 190px;
        }
        .menu-modal-body {
          padding: 1.15rem;
        }
        .menu-modal-title, .menu-modal-price {
          font-size: 1.25rem;
        }
        .portion-options-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Ensure Modal HTML exists in the DOM
  function ensureModalDOM() {
    ensureModalStyles();

    let backdrop = document.getElementById('menu-modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'menu-modal-backdrop';
      backdrop.id = 'menu-modal-backdrop';
      backdrop.setAttribute('role', 'dialog');
      backdrop.setAttribute('aria-modal', 'true');
      backdrop.setAttribute('aria-labelledby', 'modal-dish-title');

      backdrop.innerHTML = `
        <div class="menu-modal-window">
          <button type="button" class="menu-modal-close-btn" id="menu-modal-close-btn" aria-label="Close product preview">
            <span class="material-symbols-outlined">close</span>
          </button>

          <div class="menu-modal-img-wrap">
            <img src="../assets/Special Shahi Dum Biryani.jpg" alt="Dish Preview" id="modal-dish-img" class="menu-modal-img" />
          </div>

          <div class="menu-modal-body">
            <div class="menu-modal-header-row">
              <h3 class="menu-modal-title" id="modal-dish-title">Dish Title</h3>
              <div class="menu-modal-price" id="modal-dish-price">Rs. 0</div>
            </div>

            <p class="menu-modal-desc" id="modal-dish-desc">
              Delicious freshly prepared Karachi specialty crafted to order.
            </p>

            <div class="menu-modal-meta-grid">
              <div class="modal-meta-card">
                <div class="modal-meta-label">Rating</div>
                <div class="modal-meta-val" id="modal-dish-rating">4.9 ★</div>
              </div>
              <div class="modal-meta-card">
                <div class="modal-meta-label">Prep Time</div>
                <div class="modal-meta-val" id="modal-dish-time">25 min</div>
              </div>
              <div class="modal-meta-card">
                <div class="modal-meta-label">Spice Level</div>
                <div class="modal-meta-val" id="modal-dish-spice">Medium</div>
              </div>
            </div>

            <div id="modal-portions-container"></div>

            <div class="menu-modal-actions">
              <button type="button" class="modal-add-to-cart-btn" id="modal-add-to-cart-btn">
                <span>Add to Cart</span>
                <svg class="btn-cart-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style="width:17px;height:17px;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
    }

    // Attach Event Handlers
    const closeBtn = document.getElementById('menu-modal-close-btn');
    if (closeBtn && !closeBtn.dataset.bound) {
      closeBtn.dataset.bound = 'true';
      closeBtn.addEventListener('click', closeProductModal);
    }

    if (backdrop && !backdrop.dataset.bound) {
      backdrop.dataset.bound = 'true';
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeProductModal();
      });
    }

    const addBtn = document.getElementById('modal-add-to-cart-btn');
    if (addBtn && !addBtn.dataset.bound) {
      addBtn.dataset.bound = 'true';
      addBtn.addEventListener('click', handleModalAddToCart);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeProductModal();
      }
    });

    return backdrop;
  }

  // Open Product Modal
  function openProductModal(item) {
    if (!item) return;
    const backdrop = ensureModalDOM();

    currentProduct = item;
    currentPortionIdx = 0;

    const modalImg = document.getElementById('modal-dish-img');
    const modalTitle = document.getElementById('modal-dish-title');
    const modalPrice = document.getElementById('modal-dish-price');
    const modalDesc = document.getElementById('modal-dish-desc');
    const modalRating = document.getElementById('modal-dish-rating');
    const modalTime = document.getElementById('modal-dish-time');
    const modalSpice = document.getElementById('modal-dish-spice');
    const portionsWrap = document.getElementById('modal-portions-container');
    const addBtn = document.getElementById('modal-add-to-cart-btn');

    if (modalImg) {
      modalImg.src = item.image;
      modalImg.alt = item.title;
    }
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalDesc) modalDesc.textContent = item.description || 'Crafted fresh to order with authentic Karachi spices and premium ingredients.';
    if (modalRating) modalRating.textContent = `${item.rating || 4.9} ★ (${item.reviews || '500+'} reviews)`;
    if (modalTime) modalTime.textContent = item.prepTime || '25-35 min';
    if (modalSpice) modalSpice.textContent = item.spiceLevel || 'Medium';

    // Calculate initial price
    const initialPrice = item.portions && item.portions.length > 0 ? item.portions[0].price : item.price;
    if (modalPrice) modalPrice.textContent = `Rs. ${initialPrice.toLocaleString()}`;

    // Render Serving Sizes / Portions
    if (portionsWrap) {
      if (item.portions && item.portions.length > 0) {
        portionsWrap.innerHTML = `
          <div class="menu-modal-section-title">Select Serving Size</div>
          <div class="portion-options-grid">
            ${item.portions.map((portion, idx) => `
              <div class="portion-option-card ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
                <div>
                  <div class="portion-name">${portion.name}</div>
                  <div class="portion-sub">${portion.sub || ''}</div>
                </div>
                <div class="portion-price">Rs. ${portion.price.toLocaleString()}</div>
              </div>
            `).join('')}
          </div>
        `;

        portionsWrap.querySelectorAll('.portion-option-card').forEach((card) => {
          card.addEventListener('click', () => {
            portionsWrap.querySelectorAll('.portion-option-card').forEach((c) => c.classList.remove('selected'));
            card.classList.add('selected');
            currentPortionIdx = parseInt(card.dataset.idx, 10);
            const selPortion = item.portions[currentPortionIdx];
            if (modalPrice && selPortion) {
              modalPrice.textContent = `Rs. ${selPortion.price.toLocaleString()}`;
            }
          });
        });
      } else {
        portionsWrap.innerHTML = '';
      }
    }

    if (addBtn) {
      addBtn.classList.remove('is-added');
      addBtn.innerHTML = `
        <span>Add to Cart</span>
        <svg class="btn-cart-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style="width:17px;height:17px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      `;
    }

    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  // Close Product Modal
  function closeProductModal() {
    const backdrop = document.getElementById('menu-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('is-open');
    }
    document.body.style.overflow = '';
    currentProduct = null;
  }

  // Handle Add to Cart inside Modal
  function handleModalAddToCart() {
    if (!currentProduct) return;

    const portion = currentProduct.portions && currentProduct.portions.length > 0
      ? currentProduct.portions[currentPortionIdx]
      : null;

    const targetPrice = portion ? portion.price : currentProduct.price;
    const targetTitle = portion ? `${currentProduct.title} (${portion.name})` : currentProduct.title;
    const targetId = portion ? `${currentProduct.id}-${portion.name.toLowerCase().replace(/\s+/g, '-')}` : currentProduct.id;

    let cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const existing = cart.find((i) => i.id === targetId);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        id: targetId,
        title: targetTitle,
        price: targetPrice,
        image: currentProduct.image,
        quantity: 1
      });
    }

    localStorage.setItem('khalo_cart', JSON.stringify(cart));

    // Update UI elements across page
    syncPageCartUI();

    // Fire cart event for any external listeners
    window.dispatchEvent(new CustomEvent('khalo:cart-updated', { detail: { cart } }));

    // Button feedback
    const addBtn = document.getElementById('modal-add-to-cart-btn');
    if (addBtn) {
      addBtn.classList.add('is-added');
      addBtn.innerHTML = `
        <span>Added</span>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style="width:17px;height:17px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      `;
    }

    setTimeout(() => {
      closeProductModal();
    }, 600);
  }

  // Sync Cart UI across any KhaLo page
  function syncPageCartUI() {
    const cart = JSON.parse(localStorage.getItem('khalo_cart') || '[]');
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
      cartBadge.textContent = totalQty;
      if (cartBadge.animate) {
        cartBadge.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
          { duration: 350, easing: 'ease-out' }
        );
      }
    }

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
  }

  // Resolve Product Data from Element (Card or Button)
  function resolveProduct(el) {
    if (!el) return null;

    const card = el.closest(
      '.dish-card, .midnight-card, .special-card, .deal-card, .specials-spotlight-card, .deals-spotlight-card, .hero-spotlight-card, .menu-showcase-card'
    ) || el;

    // Try finding by dataset ID on el first, then card
    const dishId = el.dataset.id || el.dataset.dishId || el.dataset.dealId ||
                   card.dataset.id || card.dataset.dishId || card.dataset.dealId;

    if (dishId && GLOBAL_CATALOG[dishId]) {
      return GLOBAL_CATALOG[dishId];
    }

    // Secondary lookup: Try finding from button inside card
    const btn = card.querySelector('[data-id], [data-dish-id], [data-deal-id]');
    if (btn) {
      const btnId = btn.dataset.dishId || btn.dataset.dealId || btn.dataset.id;
      if (btnId && GLOBAL_CATALOG[btnId]) {
        return GLOBAL_CATALOG[btnId];
      }
    }

    // Fallback: Construct dynamically from card & button markup
    const titleEl = card.querySelector('.dish-name, .midnight-card-title, .special-card-title, .deal-card-title, .specials-spotlight-title, .deals-spotlight-title, .hero-spotlight-title, .menu-showcase-title');
    const imgEl = card.querySelector('img');
    const priceEl = card.querySelector('.dish-price, .midnight-card-price, .special-price, .deal-price-now, .specials-spotlight-now, .deals-spotlight-now, .hero-spotlight-now, .menu-showcase-now, .specials-spotlight-price');
    const descEl = card.querySelector('.dish-restaurant, .midnight-card-meta, .special-card-desc, .deal-card-desc, .specials-spotlight-desc, .deals-spotlight-desc, .hero-spotlight-desc, .menu-showcase-desc');

    const title = el.dataset.item || el.dataset.dishTitle || el.dataset.dealTitle || (titleEl ? titleEl.textContent.trim() : 'Authentic Specialty');
    const image = el.dataset.image || el.dataset.dishImage || el.dataset.dealImage || (imgEl ? imgEl.src : '../assets/Special Shahi Dum Biryani.jpg');

    let price = parseInt(el.dataset.price || el.dataset.dishPrice || el.dataset.dealPrice, 10);
    if (!price || isNaN(price)) {
      if (priceEl) {
        const num = parseInt(priceEl.textContent.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(num) && num > 0) price = num;
      }
    }
    if (!price || isNaN(price)) price = 750;

    const description = descEl ? descEl.textContent.trim() : 'Cooked fresh to order with genuine Karachi flavors and supreme taste.';

    return {
      id: dishId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      price,
      image,
      description,
      rating: 4.9,
      reviews: '850',
      prepTime: '25-35 min',
      spiceLevel: 'Medium',
      portions: [
        { name: 'Regular Serving', sub: 'Serves 1-2 persons', price: price },
        { name: 'Family Serving', sub: 'Serves 3-4 persons', price: Math.round(price * 2.2) }
      ]
    };
  }

  // Universal Click Delegator in Capture Phase:
  // Intercepts ANY card or card's Add to Cart button click so:
  // 1. It opens the popup/modal first.
  // 2. It does NOT add to cart directly!
  // 3. Item is ONLY added to cart when user clicks Add to Cart INSIDE the popup modal.
  function initUniversalModalDelegation() {
    ensureModalDOM();

    document.addEventListener('click', (e) => {
      // 1. If inside the open modal window, let modal controls operate normally
      if (e.target.closest('.menu-modal-window')) {
        return;
      }

      // 2. Click on backdrop background -> close modal
      if (e.target.id === 'menu-modal-backdrop') {
        closeProductModal();
        return;
      }

      // 3. Favorite heart toggle button -> allow favorite toggling, do not open modal
      if (
        e.target.closest('.fav-toggle') ||
        e.target.closest('.special-card-fav-btn') ||
        e.target.closest('.deal-card-fav-btn') ||
        e.target.closest('.btn-fav')
      ) {
        return;
      }

      // 4. "Add to Cart" button on ANY product/deal/special card:
      // USER REQUIREMENT: DO NOT add to cart directly! Open the popup modal instead!
      const addBtn = e.target.closest(
        '.btn-add, .btn-add-cart, .btn-add-dish, .btn-add-special, .btn-add-deal, .midnight-add-btn, .specials-spotlight-btn, .deals-spotlight-btn, .hero-spotlight-btn, .menu-showcase-order-btn'
      );

      if (addBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const product = resolveProduct(addBtn);
        if (product) {
          openProductModal(product);
        }
        return;
      }

      // 5. Clicking anywhere on the card surface (image, title, card body):
      const card = e.target.closest(
        '.dish-card, .midnight-card, .special-card, .deal-card, .specials-spotlight-card, .deals-spotlight-card, .hero-spotlight-card, .menu-showcase-card'
      );

      if (card) {
        // If clicking navigation link that isn't the card title/image, allow navigation
        if (e.target.closest('a') && !e.target.closest('.dish-img-wrap, .dish-name, .hero-spotlight-card, .menu-showcase-card, .specials-spotlight-card, .deals-spotlight-card')) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const product = resolveProduct(card);
        if (product) {
          openProductModal(product);
        }
      }
    }, true); // Capture phase: runs before any bubbling listeners!
  }

  // Public API
  window.openKhaloProductModal = openProductModal;
  window.closeKhaloProductModal = closeProductModal;
  window.resolveKhaloProduct = resolveProduct;
  window.attachKhaloModalListeners = initUniversalModalDelegation;

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initUniversalModalDelegation();
    });
  } else {
    initUniversalModalDelegation();
  }

})();
