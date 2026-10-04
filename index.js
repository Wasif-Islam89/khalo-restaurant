// =========================================================================
// KhaLo Splash Loading Screen — JavaScript
// =========================================================================

(function () {
  // Rotating status messages
  const messages = [
    "Deciding delicious choices...",
    "Curating Karahi & Biryani...",
    "Matching your spice level...",
    "Ready to KhaLo!"
  ];

  let index = 0;
  const statusEl = document.getElementById('splash-status-text');

  // Fade in the first message
  if (statusEl) {
    setTimeout(() => {
      statusEl.style.opacity = '1';
      statusEl.style.transform = 'translateY(0px)';
    }, 300);
  }

  // Cycle through status messages
  const messageInterval = setInterval(() => {
    index = (index + 1) % messages.length;
    if (statusEl) {
      statusEl.style.opacity = '0';
      statusEl.style.transform = 'translateY(4px)';
      setTimeout(() => {
        statusEl.textContent = messages[index];
        statusEl.style.opacity = '1';
        statusEl.style.transform = 'translateY(0px)';
      }, 200);
    }
  }, 1500);

  // Logo fallback — show text logo if image fails to load
//   const logoImg = document.getElementById('khalo-logo-img');
//   const logoFallback = document.getElementById('khalo-logo-fallback');

//   if (logoImg) {
//     logoImg.addEventListener('error', () => {
//       logoImg.style.display = 'none';
//       if (logoFallback) {
//         logoFallback.classList.add('visible');
//       }
//     });
//   }

  // -----------------------------------------------------------------------
  // After all 4 messages shown (6 seconds), redirect to signup.html
  // -----------------------------------------------------------------------
  const splashDuration = 6000;

  setTimeout(() => {
    clearInterval(messageInterval);

    // Fade out the whole page before redirecting
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';

    setTimeout(() => {
      window.location.href = './pages/signup.html';
    }, 500);
  }, splashDuration);

  // Cleanup on unload
  window.addEventListener('beforeunload', () => clearInterval(messageInterval));
})();
