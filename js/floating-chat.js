/**
 * KhaLo Restaurant — Floating Right-Aligned Chatbot Widget
 * Shown ONLY on Home and Profile pages.
 * Opens an inline chat popup directly on the current page without navigating away.
 */

(() => {
  'use strict';

  // Strict page filter: Floating chat button is ONLY permitted on Home, Profile, and Floating Chat pages
  function isAllowedPage() {
    const path = (window.location.pathname || '').toLowerCase();
    const isHome = path.endsWith('/home.html') || path.endsWith('home.html') || path.endsWith('/home') || path.endsWith('index.html') || path.endsWith('/') || path === '';
    const isProfile = path.endsWith('/profile.html') || path.endsWith('profile.html') || path.endsWith('/profile');
    const isFloatingChat = path.endsWith('floating-chat.html') || path.includes('floating-chat');
    return isHome || isProfile || isFloatingChat;
  }

  function initFloatingChat() {
    // If not on Home or Profile page, do not display the floating chat widget
    if (!isAllowedPage()) {
      return;
    }

    // Prevent duplicate injection
    if (document.getElementById('khalo-floating-chat-trigger')) return;

    // Remove any older static placeholder if present
    const oldBtn = document.getElementById('floating-help-btn');
    if (oldBtn) oldBtn.remove();

    // Create Widget Container
    const wrapper = document.createElement('div');
    wrapper.id = 'khalo-chat-widget-root';
    wrapper.innerHTML = `
      <!-- Launcher Button on the RIGHT (Without green active dot) -->
      <button type="button" id="khalo-floating-chat-trigger" class="khalo-floating-chat-btn" aria-label="Open KhaLo Live Chat Assistant" title="Chat with KhaLo Support">
        <div class="khalo-chat-icon-wrap">
          <span class="material-symbols-outlined" style="font-size: 1.15rem;">support_agent</span>
        </div>
        <span class="khalo-floating-chat-label">Need Help?</span>
      </button>

      <!-- Inline Popup Chat Modal -->
      <div id="khalo-floating-chat-popup" class="khalo-chat-popup" role="dialog" aria-modal="true" aria-label="KhaLo Live Support">
        <!-- Header -->
        <div class="khalo-chat-popup-header">
          <div class="khalo-chat-header-identity">
            <div class="khalo-chat-mini-avatar">
              <span class="material-symbols-outlined" style="font-size: 1.15rem;">smart_toy</span>
            </div>
            <div>
              <strong class="khalo-chat-header-title">KhaLo Instant Support</strong>
              <div class="khalo-chat-header-status">
                <span>Karachi Culinary Hub</span>
              </div>
            </div>
          </div>
          <div class="khalo-chat-header-tools">
            <button type="button" class="khalo-chat-tool-btn" id="khalo-chat-close-btn" title="Close Chat" aria-label="Close Chat">
              <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
          </div>
        </div>

        <!-- Body / Message Thread -->
        <div class="khalo-chat-popup-body" id="khalo-chat-popup-body">
          <div class="khalo-chat-msg bot">
            <div class="khalo-chat-mini-avatar" style="width: 28px; height: 28px; font-size: 0.9rem;">
              <span class="material-symbols-outlined" style="font-size: 1rem;">smart_toy</span>
            </div>
            <div class="khalo-chat-bubble">
              Assalam-o-Alaikum! 👋 Need help with your order, rider tracking, or menu choice? Tap a quick question below or ask me anything!
            </div>
          </div>
        </div>

        <!-- Quick Inquiry Chips -->
        <div class="khalo-chat-popup-chips" id="khalo-chat-popup-chips">
          <button type="button" class="khalo-chip-item" data-q="Where is my order?">
            <span class="material-symbols-outlined" style="font-size: 13px; color: #ff6b35;">radar</span>
            Where is my order?
          </button>
          <button type="button" class="khalo-chip-item" data-q="Can I cancel my order?">
            <span class="material-symbols-outlined" style="font-size: 13px; color: #ef4444;">cancel</span>
            Can I cancel?
          </button>
          <button type="button" class="khalo-chip-item" data-q="Promo code KHALO50">
            <span class="material-symbols-outlined" style="font-size: 13px; color: #16a34a;">local_offer</span>
            KHALO50 Code
          </button>
          <button type="button" class="khalo-chip-item" data-q="Rider delay">
            <span class="material-symbols-outlined" style="font-size: 13px; color: #0284c7;">two_wheeler</span>
            Rider delay
          </button>
        </div>

        <!-- Input Bar -->
        <div class="khalo-chat-popup-inputbar">
          <input type="text" id="khalo-popup-input" class="khalo-chat-field" placeholder="Ask KhaLo Assistant..." autocomplete="off" />
          <button type="button" id="khalo-popup-submit" class="khalo-chat-submit-btn" aria-label="Send">
            <span class="material-symbols-outlined" style="font-size: 1.15rem;">send</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);

    // DOM References
    const trigger = document.getElementById('khalo-floating-chat-trigger');
    const popup = document.getElementById('khalo-floating-chat-popup');
    const closeBtn = document.getElementById('khalo-chat-close-btn');
    const body = document.getElementById('khalo-chat-popup-body');
    const input = document.getElementById('khalo-popup-input');
    const submit = document.getElementById('khalo-popup-submit');
    const chipsArea = document.getElementById('khalo-chat-popup-chips');

    let isTyping = false;

    // Global Helpers to open/close chat from anywhere
    window.openKhaloChat = function() {
      if (popup) {
        popup.classList.add('is-open');
        setTimeout(() => input?.focus(), 250);
      }
    };

    window.closeKhaloChat = function() {
      if (popup) {
        popup.classList.remove('is-open');
      }
    };

    // Check if page opened with ?openChat=1
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('openChat') === '1' || window.location.hash === '#chat') {
        setTimeout(() => window.openKhaloChat(), 300);
      }
    } catch (e) {}

    // Toggle Chat Popup
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = popup.classList.contains('is-open');
      if (isOpen) {
        window.closeKhaloChat();
      } else {
        window.openKhaloChat();
      }
    });

    closeBtn.addEventListener('click', () => {
      window.closeKhaloChat();
    });

    // Append Message to Popup
    function appendPopupMessage(role, html) {
      if (!body) return;
      const row = document.createElement('div');
      row.className = `khalo-chat-msg ${role}`;

      if (role === 'bot') {
        const av = document.createElement('div');
        av.className = 'khalo-chat-mini-avatar';
        av.style.width = '28px';
        av.style.height = '28px';
        av.innerHTML = '<span class="material-symbols-outlined" style="font-size: 1rem;">smart_toy</span>';
        row.appendChild(av);
      }

      const bubble = document.createElement('div');
      bubble.className = 'khalo-chat-bubble';
      bubble.innerHTML = html;
      row.appendChild(bubble);

      body.appendChild(row);
      body.scrollTop = body.scrollHeight;
    }

    // Active Order Resolution
    function getActiveOrderSnippet() {
      try {
        const raw = localStorage.getItem('khalo_active_order');
        if (!raw) {
          return `
            <strong>No Active Order Found</strong><br>
            You don't have an active order right now.<br>
            <a href="./home.html#popular" style="color: #ff6b35; font-weight: 700; text-decoration: underline;">View Today's Hot Menu &rarr;</a>
          `;
        }
        const order = JSON.parse(raw);
        const stages = { 1: 'Confirmed', 2: 'Cooking in Kitchen', 3: 'On the Way', 4: 'Delivered' };
        const st = stages[order.step] || 'Processing';
        return `
          <strong>Order #${order.orderId || 'KHL-9204'} (${st})</strong><br>
          📍 ${order.location || 'Karachi'}<br>
          ⏱️ ETA: ${order.eta || '25-35 mins'}<br>
          💰 Total: PKR ${Number(order.total || 0).toLocaleString()} (COD)<br>
          <a href="./cart.html" style="display: inline-block; margin-top: 4px; color: #ff6b35; font-weight: 700; text-decoration: underline;">Open Live Tracking &rarr;</a>
        `;
      } catch (e) {
        return 'Please view your <a href="./cart.html" style="color: #ff6b35;">Cart Page</a> for live status.';
      }
    }

    // Knowledge Matcher
    function resolveAnswer(q) {
      const text = q.toLowerCase().trim();

      if (text.includes('where is my order') || text.includes('track') || text.includes('status') || text.includes('kahan') || text.includes('eta')) {
        return getActiveOrderSnippet();
      }

      if (text.includes('cancel') || text.includes('khatam') || text.includes('wapas')) {
        return `
          <strong>KhaLo Cancellation Policy:</strong><br>
          • You can cancel free of charge within <strong>5 minutes</strong> of placing (before kitchen cooking begins).<br>
          • Urgent kitchen support: <strong>+92-300-000-0000</strong>.
        `;
      }

      if (text.includes('promo') || text.includes('khalo50') || text.includes('discount') || text.includes('coupon')) {
        return `
          <strong>🎉 Special Discount Code:</strong><br>
          Use <strong style="color: #ff6b35;">KHALO50</strong> on the Cart checkout screen for <strong>50% OFF</strong> (up to PKR 250 off)!
        `;
      }

      if (text.includes('rider') || text.includes('delay') || text.includes('late') || text.includes('deri')) {
        return `
          <strong>Delivery &amp; Rider Support:</strong><br>
          Standard delivery duration is 30–40 mins across Karachi.<br>
          WhatsApp dispatch captain: <a href="https://wa.me/923000000000" target="_blank" style="color: #16a34a; font-weight: 700;">+92-300-000-0000</a>.
        `;
      }

      if (text.includes('halal') || text.includes('hygiene') || text.includes('safai')) {
        return `
          <strong>100% Halal &amp; Tamper-Proof:</strong><br>
          • Certified 100% Halal fresh meats.<br>
          • Dispatched with signature red tamper-evident safety seals.
        `;
      }

      if (text.includes('location') || text.includes('area') || text.includes('coverage') || text.includes('clifton') || text.includes('dha') || text.includes('gulshan')) {
        return `
          <strong>Karachi Coverage:</strong><br>
          Delivering hot food to Clifton, DHA, Gulshan-e-Iqbal, Johar, North Nazimabad, PECHS, Saddar, and nearby sectors!
        `;
      }

      if (text.includes('mood') || text.includes('recommend') || text.includes('find my meal') || text.includes('kya khaon')) {
        return `
          <strong>AI Food Matchmaker:</strong><br>
          Check out our interactive <a href="./find-my-meal.html" style="color: #ff6b35; font-weight: 700; text-decoration: underline;">Find My Meal Quiz</a> to get dishes matched to your craving!
        `;
      }

      return `
        Thank you for asking! For order tracking, visit <a href="./cart.html" style="color: #ff6b35; font-weight: 700;">Cart</a>, or browse hot dishes on our <a href="./menu.html" style="color: #ff6b35; font-weight: 700;">Menu</a>. Support line: <strong>+92-300-000-0000</strong>.
      `;
    }

    // Handle User Popup Message
    function handlePopupSend(text) {
      if (!text || !text.trim() || isTyping) return;
      const clean = text.trim();

      appendPopupMessage('user', clean.replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])));
      if (input) input.value = '';

      isTyping = true;
      setTimeout(() => {
        const reply = resolveAnswer(clean);
        appendPopupMessage('bot', reply);
        isTyping = false;
      }, 500);
    }

    submit.addEventListener('click', () => handlePopupSend(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handlePopupSend(input.value);
      }
    });

    chipsArea.addEventListener('click', (e) => {
      const chip = e.target.closest('.khalo-chip-item');
      if (chip) {
        const q = chip.getAttribute('data-q') || chip.textContent.trim();
        handlePopupSend(q);
      }
    });
  }

  // Global click interceptor for Help Center triggers
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.footer-help-trigger, a[href*="help-center"], [data-chat-trigger]');
    if (target) {
      e.preventDefault();
      const popup = document.getElementById('khalo-floating-chat-popup');
      if (popup && window.openKhaloChat) {
        window.openKhaloChat();
      } else {
        // If on another page, navigate to Home and open the live chat
        window.location.href = './home.html?openChat=1';
      }
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    initFloatingChat();
    document.querySelectorAll('.footer-socials .social-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = btn.getAttribute('aria-label') || 'instagram';
        window.open('https://' + platform.toLowerCase() + '.com', '_blank', 'noopener,noreferrer');
      });
    });
  });

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initFloatingChat();
  }
})();
