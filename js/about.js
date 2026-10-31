/**
 * عناية | ENAYA - سكريبت صفحة من نحن (About Us)
 * Interactivity, Animations & Responsive Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = navMenu.classList.toggle('show');
      mobileToggle.textContent = isExpanded ? '✕' : '☰';
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('show');
        mobileToggle.textContent = '☰';
      }
    });

    // Close menu when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // 2. Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    },
    { passive: true }
  );

  // 3. Scroll Reveal Animations (Intersection Observer)
  const animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animatedElements.forEach((el, index) => {
      // Stagger animations slightly for siblings
      el.style.transitionDelay = `${(index % 3) * 0.12}s`;
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    animatedElements.forEach((el) => el.classList.add('animated'));
  }

  // 4. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 64;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // 5. Interactive Pills Micro-feedback
  const carePills = document.querySelectorAll('.care-pill');
  carePills.forEach((pill) => {
    pill.addEventListener('mouseenter', () => {
      pill.style.borderColor = 'var(--primary-green)';
    });
    pill.addEventListener('mouseleave', () => {
      pill.style.borderColor = 'var(--border-light)';
    });
  });
});
