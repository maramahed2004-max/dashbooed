/**
 * عناية | ENAYA - Signup Page Script
 * Interactive form handling, password toggling, and validation
 */

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const messageEl = document.getElementById('formMessage');

  // 1. Password Visibility Toggle
  window.togglePassword = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input || !btn) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    btn.innerHTML = isPassword
      ? '<span>◉</span> إخفاء'
      : '<span>◉</span> إظهار';

    btn.setAttribute('aria-label', isPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
  };

  // 2. Real-time Password Match & Length Feedback
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  function checkPasswordMatch() {
    if (!passwordInput || !confirmPasswordInput) return;

    if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.parentElement.style.borderColor = '#E53935';
    } else if (confirmPasswordInput.value) {
      confirmPasswordInput.parentElement.style.borderColor = '#4CAF50';
    } else {
      confirmPasswordInput.parentElement.style.borderColor = '';
    }
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
  }

  // 3. Form Submission & Validation
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullname = document.getElementById('fullname').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const submitBtn = signupForm.querySelector('button[type="submit"]');

      // Helper to display error
      function showError(text) {
        if (messageEl) {
          messageEl.style.color = '#E53935';
          messageEl.textContent = text;
        }
      }

      // Validations
      if (!fullname || !email || !password || !confirmPassword) {
        showError('يرجى تعبئة جميع الحقول المطلوبة.');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showError('يرجى إدخال بريد إلكتروني صالح.');
        return;
      }

      if (password.length < 8) {
        showError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
        return;
      }

      if (password !== confirmPassword) {
        showError('كلمتا المرور غير متطابقتين.');
        return;
      }

      // Success State
      if (messageEl) {
        messageEl.style.color = '#4CAF50';
        messageEl.textContent = 'جاري التحقق وإنشاء الحساب...';
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳</span> جاري إنشاء الحساب...';
        submitBtn.style.opacity = '0.85';
      }

      // Smooth transition to verify-email.html
      setTimeout(() => {
        const targetUrl = new URL('verify-email.html', window.location.href);
        targetUrl.searchParams.set('email', email);
        targetUrl.searchParams.set('name', fullname);
        window.location.href = targetUrl.href;
      }, 700);
    });
  }
});
