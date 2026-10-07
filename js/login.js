// =========================================================================
// KhaLo Login Page — JavaScript
// =========================================================================

(function () {

  // ----- Logo fallback if image fails to load -----
  const logoImg = document.getElementById('loginLogoImg');
  const logoFallback = document.getElementById('loginLogoFallback');
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      logoImg.style.display = 'none';
      if (logoFallback) logoFallback.classList.add('visible');
    });
  }

  // ----- Password show / hide -----
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const passwordEyeIcon = document.getElementById('passwordEyeIcon');

  if (togglePasswordBtn && passwordInput && passwordEyeIcon) {
    togglePasswordBtn.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      passwordEyeIcon.className = isHidden ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    });
  }

  // ----- Toast helper -----
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message, title) {
    if (!toast) return;
    toastTitle.textContent = title || 'Notice';
    toastMessage.textContent = message;

    toast.classList.add('is-visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3800);
  }

  // ----- Forgot password (non-blocking feedback instead of alert()) -----
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('If that email is registered, a reset link is on its way.', 'Check your inbox');
    });
  }

  // ----- Google mock login -----
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      showToast('Connecting with Google… one moment!', 'Redirecting');
    });
  }

  // ----- Login form submit -----
  const form = document.getElementById('loginForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const emailInput = document.getElementById('email');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !emailPattern.test(email)) {
        showToast('Please enter a valid email address.', 'Notice');
        emailInput.focus();
        return;
      }

      if (!password) {
        showToast('Please enter your password.', 'Notice');
        passwordInput.focus();
        return;
      }

      // Check user credentials from localStorage
      let users = [];
      try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          users = JSON.parse(storedUsers);
        }
      } catch (err) {
        users = [];
      }

      let matchedUser = null;
      for (let i = 0; i < users.length; i++) {
        if (users[i].email && users[i].email.toLowerCase() === email.toLowerCase()) {
          matchedUser = users[i];
          break;
        }
      }

      if (!matchedUser) {
        showToast('No account found with this email. Please sign up first.', 'Login Failed');
        return;
      }

      if (matchedUser.password !== password) {
        showToast('Incorrect password. Please try again.', 'Login Failed');
        return;
      }

      // Save current logged in user session
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));

      // Simulate loading state
      btnText.textContent = 'Logging in…';
      btnSpinner.classList.add('visible');
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('Ready to decide what to eat! Taking you to KhaLo.', 'Login successful!');

        setTimeout(() => {
          window.location.href = 'home.html';
        }, 900);
      }, 1000);
    });
  }

})();

// Smooth page transitions //
document.querySelectorAll('a[href="signup.html"], a[href="login.html"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.href;
    document.body.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.98)';
    setTimeout(() => {
      window.location.href = target;
    }, 400);
  });
});
