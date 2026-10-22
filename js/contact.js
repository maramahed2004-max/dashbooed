/**
 * عناية | ENAYA - تواصل معنا
 * JavaScript Logic & Interactions for Contact Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.textContent = isOpen ? '✕' : '☰';
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.textContent = '☰';
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Sticky Header Scroll Effect
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

  // 3. Support Topic Cards Auto-Fill & Scroll
  const topicCards = document.querySelectorAll('.topic-card');
  const messageInput = document.getElementById('contactMessage');
  const contactForm = document.getElementById('contactForm');

  topicCards.forEach(card => {
    card.addEventListener('click', () => {
      const topicTitle = card.querySelector('h3')?.textContent.trim();
      if (messageInput) {
        messageInput.value = `[بخصوص: ${topicTitle}]\n\n`;
        messageInput.focus();
      }

      // Smooth scroll to form
      contactForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // 4. Screenshot Drag & Drop / Click Upload
  const uploadBox = document.getElementById('screenshotUploadBox');
  const fileInput = document.getElementById('screenshotFile');
  const uploadText = document.getElementById('uploadText');

  if (uploadBox && fileInput) {
    uploadBox.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        uploadText.innerHTML = `<span style="color: var(--primary-green);"><i class="fa-solid fa-file-image"></i> تم اختيار: ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>`;
      }
    });

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadBox.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = 'var(--primary-green)';
        uploadBox.style.backgroundColor = '#E8F5E9';
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadBox.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = '';
        uploadBox.style.backgroundColor = '';
      });
    });

    uploadBox.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files[0]) {
        fileInput.files = files;
        uploadText.innerHTML = `<span style="color: var(--primary-green);"><i class="fa-solid fa-file-image"></i> تم اختيار: ${files[0].name} (${(files[0].size / 1024).toFixed(1)} KB)</span>`;
      }
    });
  }

  // 5. Contact Form Submission
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !message) {
        alert('يرجى ملء جميع الحقول المطلوبة (*)');
        return;
      }

      // Button loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> تم إرسال رسالتك بنجاح!';
        submitBtn.style.backgroundColor = '#1B5E20';

        // Clear form
        contactForm.reset();
        if (uploadText) {
          uploadText.textContent = 'اسحب لقطة شاشة لإرفاقها أو انقر للتصفح';
        }

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
        }, 4000);
      }, 1000);
    });
  }
});
