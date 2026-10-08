// =========================================================================
// KhaLo Forgot Password Page — JavaScript
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

  // ----- Toast helper -----
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');
  let toastTimer = null;

  function showToast(message, title, isError) {
    if (!toast) return;
    toastTitle.textContent = title || (isError ? 'Notice' : 'Success');
    toastMessage.textContent = message;

    if (isError) {
      toast.classList.add('toast-error');
      if (toastIcon) {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
      }
    } else {
      toast.classList.remove('toast-error');
      if (toastIcon) {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      }
    }

    toast.classList.add('is-visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3800);
  }

  // ----- Show / Hide Password Toggles -----
  const toggleNewPasswordBtn = document.getElementById('toggleNewPasswordBtn');
  const newPasswordInput = document.getElementById('newPassword');
  const newPasswordEyeIcon = document.getElementById('newPasswordEyeIcon');

  if (toggleNewPasswordBtn && newPasswordInput && newPasswordEyeIcon) {
    toggleNewPasswordBtn.addEventListener('click', () => {
      const isHidden = newPasswordInput.type === 'password';
      newPasswordInput.type = isHidden ? 'text' : 'password';
      newPasswordEyeIcon.className = isHidden ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    });
  }

  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPasswordBtn');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const confirmPasswordEyeIcon = document.getElementById('confirmPasswordEyeIcon');

  if (toggleConfirmPasswordBtn && confirmPasswordInput && confirmPasswordEyeIcon) {
    toggleConfirmPasswordBtn.addEventListener('click', () => {
      const isHidden = confirmPasswordInput.type === 'password';
      confirmPasswordInput.type = isHidden ? 'text' : 'password';
      confirmPasswordEyeIcon.className = isHidden ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    });
  }

  // ----- Helper function to load users from localStorage -----
  function loadStoredUsers() {
    let users = [];
    try {
      const stored = localStorage.getItem('users');
      if (stored) {
        users = JSON.parse(stored);
      }
    } catch (err) {
      users = [];
    }
    return Array.isArray(users) ? users : [];
  }

  // ----- Form elements and state -----
  const emailStepForm = document.getElementById('emailStepForm');
  const passwordStepForm = document.getElementById('passwordStepForm');
  const formHeading = document.getElementById('formHeading');
  const formSubheading = document.getElementById('formSubheading');

  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const emailSubmitBtn = document.getElementById('emailSubmitBtn');
  const emailBtnText = document.getElementById('emailBtnText');
  const emailBtnIcon = document.getElementById('emailBtnIcon');
  const emailBtnSpinner = document.getElementById('emailBtnSpinner');

  const verifiedBadgeText = document.getElementById('verifiedBadgeText');
  const newPasswordError = document.getElementById('newPasswordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
  const passwordBtnText = document.getElementById('passwordBtnText');
  const passwordBtnSpinner = document.getElementById('passwordBtnSpinner');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let verifiedEmail = '';

  // ----- Step 1: Verify Email -----
  if (emailStepForm) {
    emailStepForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();

      // Reset previous error
      if (emailError) emailError.classList.remove('visible');

      if (!email || !emailPattern.test(email)) {
        if (emailError) {
          emailError.textContent = 'Please enter a valid email address.';
          emailError.classList.add('visible');
        }
        showToast('Please enter a valid email address.', 'Invalid Email', true);
        emailInput.focus();
        return;
      }

      // Check whether entered email exists in localStorage
      const users = loadStoredUsers();
      let matchedUser = null;

      for (let i = 0; i < users.length; i++) {
        if (users[i].email && users[i].email.toLowerCase() === email.toLowerCase()) {
          matchedUser = users[i];
          break;
        }
      }

      // If email does not exist, show KhaLo error toast
      if (!matchedUser) {
        if (emailError) {
          emailError.textContent = 'No account found with this email. Please sign up first.';
          emailError.classList.add('visible');
        }
        showToast('No account found with this email address.', 'Email Not Found', true);
        return;
      }

      // If email exists, proceed to Step 2
      verifiedEmail = matchedUser.email;

      emailSubmitBtn.disabled = true;
      emailBtnText.textContent = 'Verifying…';
      if (emailBtnIcon) emailBtnIcon.style.display = 'none';
      if (emailBtnSpinner) emailBtnSpinner.classList.add('visible');

      setTimeout(() => {
        showToast('Email verified! You can now set a new password.', 'Account Verified', false);

        // Hide Step 1, reveal Step 2
        emailStepForm.classList.add('step-hidden');
        passwordStepForm.classList.remove('step-hidden');

        if (formHeading) formHeading.textContent = 'Create a new password';
        if (formSubheading) formSubheading.style.display = 'none';

        newPasswordInput.focus();
      }, 600);
    });
  }

  // ----- Step 2: Set New Password -----
  if (passwordStepForm) {
    passwordStepForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      let isValid = true;

      // Reset field errors
      if (newPasswordError) newPasswordError.classList.remove('visible');
      if (confirmPasswordError) confirmPasswordError.classList.remove('visible');

      // Validate new password (minimum 8 characters)
      if (!newPassword || newPassword.length < 8) {
        if (newPasswordError) {
          newPasswordError.textContent = 'Password must be at least 8 characters.';
          newPasswordError.classList.add('visible');
        }
        isValid = false;
      }

      // Make sure both passwords match
      if (newPassword !== confirmPassword) {
        if (confirmPasswordError) {
          confirmPasswordError.textContent = 'Passwords do not match.';
          confirmPasswordError.classList.add('visible');
        }
        isValid = false;
      }

      if (!isValid) {
        showToast('Please fix the errors before proceeding.', 'Validation Error', true);
        return;
      }

      // Update matching user's password inside localStorage "users" array
      const users = loadStoredUsers();
      let updated = false;

      for (let i = 0; i < users.length; i++) {
        if (users[i].email && users[i].email.toLowerCase() === verifiedEmail.toLowerCase()) {
          users[i].password = newPassword;
          updated = true;
          break;
        }
      }

      if (!updated) {
        showToast('Could not find user to update. Please try again.', 'Error', true);
        return;
      }

      // Save updated array back to localStorage
      localStorage.setItem('users', JSON.stringify(users));

      // Also update currentUser session if it matches
      try {
        const storedCurrent = localStorage.getItem('currentUser');
        if (storedCurrent) {
          const currentUser = JSON.parse(storedCurrent);
          if (currentUser.email && currentUser.email.toLowerCase() === verifiedEmail.toLowerCase()) {
            currentUser.password = newPassword;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          }
        }
      } catch (err) {
        // Safe fail
      }

      // Loading state on button
      passwordSubmitBtn.disabled = true;
      passwordBtnText.textContent = 'Updating Password…';
      if (passwordBtnSpinner) passwordBtnSpinner.classList.add('visible');

      setTimeout(() => {
        // Show existing KhaLo success toast
        showToast('Password reset successfully! Redirecting to login…', 'Success!', false);

        // Redirect to login.html
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1100);
      }, 700);
    });
  }

  // ----- Smooth page transitions -----
  document.querySelectorAll('a[href="login.html"], a[href="signup.html"]').forEach(link => {
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

})();
