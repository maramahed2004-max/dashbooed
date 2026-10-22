/**
 * عناية | ENAYA - خدماتنا
 * JavaScript Interactions & Logic for Interface 4
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

    // Close menu when clicking outside
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

  // 3. Interactive Diagnostic Symptom Checker
  const symptomData = {
    yellow: {
      title: "احتمالات اصفرار ورقتك",
      confidence: "85% ري زائد وتجمع مياه",
      cause: "اختناق في الجذور وضعف تصريف الأصيص",
      explanation: "عندما تفرط في الري أو عند انسداد ثقوب التصريف، تحرم الجذور من الأكسجين وتبدأ الأوراق القديمة والسفلية بالاصفرار التدريجي.",
      steps: [
        "افحص فتحات تصريف الأصيص وتأكد من خروج الماء الفائض فوراً.",
        "أوقف الري تماماً حتى تجف أول 3-4 سم من سطح التربة عند لمسها.",
        "انقل النبتة لمكان مشمس أو مضاء بضوء غير مباشر لتنشيط عملية النتح."
      ]
    },
    droop: {
      title: "احتمالات ذبول وتدلي الساق",
      confidence: "92% جفاف تام للتربة أو حرارة مرتفعة",
      cause: "فقدان ضغط الامتلاء الداخلي في خلايا النبتة",
      explanation: "تتدلى السيقان وتنحني الأوراق لأسفل عندما تجف التربة بالكامل وتتعرض النبتة لتيار هواء حار أو جاف.",
      steps: [
        "قم بري النبتة بطريقة الري السفلي (وضع الأصيص في وعاء ماء لـ 20 دقيقة).",
        "ابعد النبتة عن مصادر التكييف المباشر أو أجهزة التدفئة.",
        "ستلاحظ عودة السيقان لوضعها المنتصب خلال 4 إلى 8 ساعات بعد الري."
      ]
    },
    brown: {
      title: "احتمالات البقع البنية والأطراف الجافة",
      confidence: "78% جفاف الهواء أو ملوحة زائدة",
      cause: "انخفاض نسبة الرطوبة الجوية وتراكم الأملاح",
      explanation: "احتراق أطراف الأوراق وتحولها إلى اللون البني المقرمش ينتج عن تدني رطوبة الغرفة لأقل من 40% أو الري بماء يحتوي على كلور مرتفع.",
      steps: [
        "قم برش الأوراق برذاذ ماء فاتر مرة يومياً أو استخدم جهاز ترطيب.",
        "استخدم ماءً مفلتراً أو اترك ماء الصنبور 24 ساعة قبل السقاية.",
        "قص الأطراف البنية الجافة بمقص معقم دون لمس النسيج الأخضر الحي."
      ]
    },
    drop: {
      title: "احتمالات تساقط الأوراق المفاجئ",
      confidence: "88% صدمة بيئية أو نقل مفاجئ",
      cause: "تغير حاد في الإضاءة أو درجة الحرارة",
      explanation: "غالباً ما تسقط الأوراق بعد نقل النبتة من مكان لآخر أو بعد شرائها حديثاً حتى تتأقلم مع بيئتها الجديدة.",
      steps: [
        "ثبّت النبتة في مكان واحد ثابت معتدل الضوء وتجنب كثرة تحريكها.",
        "قلل التسميد خلال فترة التأقلم حتى لا تجهد الجذور الضعيفة.",
        "حافظ على جدول ري معتدل حتى تبدأ النبتة بإخراج نموات خضراء جديدة."
      ]
    }
  };

  const symptomButtons = document.querySelectorAll('.symptom-tab-btn');
  const resultTitle = document.getElementById('resultTitle');
  const resultConfidence = document.getElementById('resultConfidence');
  const resultCause = document.getElementById('resultCause');
  const resultExplanation = document.getElementById('resultExplanation');
  const resultSteps = document.getElementById('resultSteps');

  symptomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      symptomButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const key = btn.getAttribute('data-symptom');
      const data = symptomData[key];

      if (data && resultTitle) {
        // Animate content swap smoothly
        const card = document.querySelector('.diagnostic-result-card');
        card.style.opacity = '0.4';
        card.style.transform = 'translateY(6px)';

        setTimeout(() => {
          resultTitle.textContent = data.title;
          resultConfidence.textContent = data.confidence;
          resultCause.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${data.cause}`;
          resultExplanation.textContent = data.explanation;

          resultSteps.innerHTML = '';
          data.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            resultSteps.appendChild(li);
          });

          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 150);
      }
    });
  });

  // 4. Interactive Dashboard Mockup - "تسجيل سقاية" Button
  const waterBtn = document.getElementById('mockupWaterBtn');
  const waterStatus = document.getElementById('mockupWaterStatus');
  const nextWaterMetric = document.getElementById('mockupNextWater');

  if (waterBtn && waterStatus) {
    waterBtn.addEventListener('click', () => {
      waterBtn.disabled = true;
      waterBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التسجيل...';

      setTimeout(() => {
        waterBtn.innerHTML = '<i class="fa-solid fa-check"></i> تم الري اليوم';
        waterBtn.style.backgroundColor = '#2E7D32';
        waterBtn.style.color = '#FFFFFF';

        if (waterStatus) {
          waterStatus.innerHTML = '<i class="fa-solid fa-droplet text-primary"></i> آخر ري: اليوم (ممتاز)';
        }
        if (nextWaterMetric) {
          nextWaterMetric.textContent = 'بعد 8 أيام';
        }

        // Revert after 4 seconds for interactive repeatability
        setTimeout(() => {
          waterBtn.disabled = false;
          waterBtn.innerHTML = 'تسجيل سقاية';
          waterBtn.style.backgroundColor = '';
          waterBtn.style.color = '';
        }, 4000);
      }, 700);
    });
  }

  // 5. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
