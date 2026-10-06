// =========================================================================
// KhaLo Sign Up Page — JavaScript
// =========================================================================

(function () {

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

  // ----- Show / Hide Password -----
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const togglePasswordIcon = document.getElementById('togglePasswordIcon');

  function updateToggleIcon(iconEl, isShown) {
    if (!iconEl) return;
    if (isShown) {
      iconEl.className = 'fa-regular fa-eye-slash';
    } else {
      iconEl.className = 'fa-regular fa-eye';
    }
  }

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      updateToggleIcon(togglePasswordIcon, isPassword);
    });
  }

  const toggleConfirmBtn = document.getElementById('toggleConfirmPassword');
  const confirmInput = document.getElementById('confirmPassword');
  const toggleConfirmIcon = document.getElementById('toggleConfirmIcon');

  if (toggleConfirmBtn && confirmInput) {
    toggleConfirmBtn.addEventListener('click', () => {
      const isPassword = confirmInput.getAttribute('type') === 'password';
      confirmInput.setAttribute('type', isPassword ? 'text' : 'password');
      updateToggleIcon(toggleConfirmIcon, isPassword);
    });
  }

  // ----- Password Strength Meter -----
  const bar1 = document.getElementById('strengthBar1');
  const bar2 = document.getElementById('strengthBar2');
  const bar3 = document.getElementById('strengthBar3');
  const strengthText = document.getElementById('strengthText');

  function evaluateStrength(val) {
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score++;
    return score;
  }

  function setStrengthUI(score) {
    [bar1, bar2, bar3].forEach(bar => {
      bar.className = 'strength-bar';
    });
    strengthText.className = '';

    if (score === 0) {
      strengthText.textContent = 'None';
    } else if (score === 1) {
      bar1.classList.add('weak');
      strengthText.textContent = 'Weak';
      strengthText.classList.add('weak');
    } else if (score === 2) {
      bar1.classList.add('medium');
      bar2.classList.add('medium');
      strengthText.textContent = 'Medium';
      strengthText.classList.add('medium');
    } else if (score >= 3) {
      bar1.classList.add('strong');
      bar2.classList.add('strong');
      bar3.classList.add('strong');
      strengthText.textContent = 'Strong';
      strengthText.classList.add('strong');
    }
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
      setStrengthUI(evaluateStrength(e.target.value));
    });
  }

  // ----- Form Submission & Validation -----
  const form = document.getElementById('registrationForm');
  const successCard = document.getElementById('successCard');
  const redirectProgress = document.getElementById('redirectProgress');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitBtnIcon = document.getElementById('submitBtnIcon');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(id, show) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('visible', show);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;
      const agreeTerms = document.getElementById('agreeTerms').checked;

      setFieldError('nameError', false);
      setFieldError('emailError', false);
      setFieldError('passwordError', false);
      setFieldError('confirmError', false);
      setFieldError('termsError', false);

      if (!name) {
        setFieldError('nameError', true);
        isValid = false;
      }

      if (!email || !emailPattern.test(email)) {
        setFieldError('emailError', true);
        isValid = false;
      }

      if (!password || password.length < 8) {
        setFieldError('passwordError', true);
        isValid = false;
      }

      if (password !== confirmPassword) {
        setFieldError('confirmError', true);
        isValid = false;
      }

      if (!agreeTerms) {
        setFieldError('termsError', true);
        isValid = false;
      }

      if (!isValid) return;

      // Check if user already exists in localStorage
      let users = [];
      try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          users = JSON.parse(storedUsers);
        }
      } catch (err) {
        users = [];
      }

      let userExists = false;
      for (let i = 0; i < users.length; i++) {
        if (users[i].email && users[i].email.toLowerCase() === email.toLowerCase()) {
          userExists = true;
          break;
        }
      }

      if (userExists) {
        showToast('An account with this email already exists. Please log in.', 'Email Registered');
        return;
      }

      // Save new user data to localStorage
      const newUser = {
        fullName: name,
        email: email,
        password: password
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      submitBtn.disabled = true;
      submitBtnText.textContent = 'Creating Account…';
      if (submitBtnIcon) {
        submitBtnIcon.className = 'fa-solid fa-spinner spin-icon';
      }

      setTimeout(() => {
        showToast('Preparing your KhaLo experience… redirecting to login shortly.', 'Account created successfully!');

        setTimeout(() => {
          window.location.href = 'login.html';
        }, 900);
      }, 1000);
    });
  }

})();

// Smooth page transitions
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
