/**
 * عناية | ENAYA - Interactive Landing Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // 3. Scroll reveal animation
  const animatedElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close other items
      faqItems.forEach(other => other.classList.remove('active'));
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 5. Interactive Plant Card in Section 3
  const waterBtn = document.getElementById('demoWaterBtn');
  const lastWateredText = document.getElementById('demoLastWatered');
  const soilMoistureText = document.getElementById('demoMoisture');
  const healthBadge = document.getElementById('demoHealth');

  if (waterBtn) {
    waterBtn.addEventListener('click', () => {
      if (!waterBtn.classList.contains('watered')) {
        waterBtn.classList.add('watered');
        waterBtn.innerHTML = '<span>✓</span> تم الري اليوم بنجاح!';

        if (lastWateredText) lastWateredText.textContent = 'اليوم (الآن)';
        if (soilMoistureText) soilMoistureText.textContent = '85% (رطوبة مثالية)';
        if (healthBadge) healthBadge.textContent = 'ممتازة 100% 🌱';

        // Show feedback message
        const toast = document.createElement('div');
        toast.className = 'demo-toast';
        toast.textContent = '💧 تم تحديث جدول نبتتك وتوثيق الري بنجاح!';
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 50);
        setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 400);
        }, 3000);
      } else {
        // Toggle back for re-testing
        waterBtn.classList.remove('watered');
        waterBtn.innerHTML = '<span>💧</span> تسجيل الري الآن';
        if (lastWateredText) lastWateredText.textContent = 'منذ يومين';
        if (soilMoistureText) soilMoistureText.textContent = '34% (تحتاج ري)';
        if (healthBadge) healthBadge.textContent = 'جيدة 92%';
      }
    });
  }
});
