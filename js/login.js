/**
 * عناية | ENAYA - Login Page Helper Script
 */
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
    const password = document.getElementById("password") ? document.getElementById("password").value : "";
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    if (!email || !password) {
      if (window.EnayaAlert) {
        EnayaAlert.error("بيانات ناقصة", "يرجى إدخال البريد الإلكتروني وكلمة المرور للمتابعة.");
      } else {
        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (window.EnayaAlert) {
        EnayaAlert.error("صيغة البريد غير صحيحة", "يرجى كتابة عنوان بريد إلكتروني صالح.");
      } else {
        alert("يرجى كتابة عنوان بريد إلكتروني صالح.");
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>⏳</span> جاري تسجيل الدخول...";
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "تسجيل الدخول";
      }

      if (password.toLowerCase() === "wrong" || password === "123") {
        if (window.EnayaAlert) {
          EnayaAlert.error(
            "تعذّر تسجيل الدخول",
            "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى مراجعة بياناتك ثم إعادة المحاولة."
          );
        } else {
          alert("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        }
      } else {
        if (window.EnayaAlert) {
          EnayaAlert.success(
            "مرحباً بعودتك! 🌱",
            "تم تسجيل الدخول بنجاح. جاري توجيهك إلى شاشة متابعة نباتاتك..."
          ).then(() => {
            window.location.href = "index.html";
          });
        } else {
          window.location.href = "index.html";
        }
      }
    }, 600);
  });
});
