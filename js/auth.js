
/*
  عناية | ENAYA
  Unified Alerts & Authentication Helpers
  Cairo Font + Enaya Green Theme
*/

(function () {
  "use strict";

  // ألوان عناية الأساسية
  const GREEN = "#2E7D32";
  const DARK_GREEN = "#1B5E20";

  // التنسيق الموحد للتنبيهات
  function showAlert(icon, title, message, confirmText) {

    if (typeof Swal === "undefined") {
      window.alert(message || title);
      return Promise.resolve({ isConfirmed: true });
    }

    return Swal.fire({
      icon: icon,
      title: title,
      text: message,
      confirmButtonText: confirmText,
      confirmButtonColor: GREEN,
      buttonsStyling: false,

      customClass: {
        popup: "enaya-alert-popup",
        title: "enaya-alert-title",
        htmlContainer: "enaya-alert-message",
        confirmButton: "enaya-alert-button"
      }
    });
  }

  // تنبيهات عناية العامة
  window.EnayaAlert = {

    success: function (
      title,
      message,
      confirmText = "متابعة"
    ) {
      return showAlert(
        "success",
        title,
        message,
        confirmText
      );
    },

    error: function (
      title,
      message,
      confirmText = "أعد المحاولة"
    ) {
      return showAlert(
        "error",
        title,
        message,
        confirmText
      );
    },

    info: function (
      title,
      message,
      confirmText = "حسنًا"
    ) {
      return showAlert(
        "info",
        title,
        message,
        confirmText
      );
    },

    warning: function (
      title,
      message,
      confirmText = "حسنًا"
    ) {
      return showAlert(
        "warning",
        title,
        message,
        confirmText
      );
    },

    toast: function (title, icon = "success") {

      if (typeof Swal === "undefined") {
        console.log(title);
        return Promise.resolve();
      }

      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,

        didOpen: (toast) => {
          toast.addEventListener(
            "mouseenter",
            Swal.stopTimer
          );

          toast.addEventListener(
            "mouseleave",
            Swal.resumeTimer
          );
        }
      });

      return Toast.fire({
        icon: icon,
        title: title,
        customClass: {
          popup: "enaya-alert-popup"
        }
      });
    }
  };

  // إظهار وإخفاء كلمة المرور
  window.togglePassword = function (inputId, button) {

    const input = document.getElementById(inputId);

    if (!input || !button) return;

    const isHidden = input.type === "password";

    input.type = isHidden ? "text" : "password";

    button.innerHTML = isHidden
      ? "◉ إخفاء"
      : "◉ إظهار";

    button.setAttribute(
      "aria-label",
      isHidden
        ? "إخفاء كلمة المرور"
        : "إظهار كلمة المرور"
    );

    button.setAttribute(
      "aria-pressed",
      String(isHidden)
    );
  };

  // قراءة البيانات من رابط الصفحة
  window.getUrlParam = function (name) {
    const params = new URLSearchParams(
      window.location.search
    );

    return params.get(name);
  };

  // إضافة تنسيقات التنبيهات تلقائيًا
  function addAlertStyles() {

    if (document.getElementById("enaya-alert-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "enaya-alert-styles";

    style.textContent = `
      .enaya-alert-popup {
        font-family: 'Cairo', sans-serif !important;
        border-radius: 24px !important;
        border: 1px solid #E0EADE !important;
        padding: 28px 24px !important;
        direction: rtl !important;
        box-shadow:
          0 20px 45px rgba(27, 94, 32, 0.12) !important;
      }

      .enaya-alert-title {
        font-family: 'Cairo', sans-serif !important;
        font-size: 1.4rem !important;
        font-weight: 800 !important;
        color: ${DARK_GREEN} !important;
      }

      .enaya-alert-message {
        font-family: 'Cairo', sans-serif !important;
        font-size: 0.95rem !important;
        line-height: 1.8 !important;
        color: #5F735F !important;
      }

      .enaya-alert-button {
        font-family: 'Cairo', sans-serif !important;
        background: ${GREEN} !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 16px !important;
        padding: 11px 28px !important;
        font-size: 0.95rem !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow:
          0 4px 14px rgba(46,125,50,0.25) !important;
      }

      .enaya-alert-button:hover {
        background: #256C2B !important;
        transform: translateY(-2px);
      }

      .enaya-alert-button:focus-visible {
        outline: 3px solid #A5D6A7 !important;
        outline-offset: 3px;
      }
    `;

    document.head.appendChild(style);
  }

  // Smooth Page Transitions
  function initPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !link.hasAttribute('target') && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          document.body.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
          document.body.style.opacity = '0';
          document.body.style.transform = 'translateY(-4px)';
          setTimeout(() => {
            window.location.href = href;
          }, 200);
        }
      });
    });

    // Reset on back/forward cache
    window.addEventListener('pageshow', () => {
      document.body.style.opacity = '1';
      document.body.style.transform = 'none';
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      addAlertStyles();
      initPageTransitions();
    });
  } else {
    addAlertStyles();
    initPageTransitions();
  }

})();







