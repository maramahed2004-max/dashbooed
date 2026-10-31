
/* ==========================================
   ENAYA | MY PLANTS
   JavaScript - responsive + interactions
========================================== */

/* بيانات النباتات التجريبية */
const plantData = {
    "peace-lily": {
        name: "زنبق السلام",
        image: "Rectangle (1).png",
        location: "غرفة النوم · قرب النافذة",
        status: "موعد تسميد",
        statusType: "water",
        note: "تابعي موعد التسميد",
        description: "افحصي حالة التربة واحتياجات النبتة قبل التسميد، ولا تعتمدي على الموعد وحده.",
        update: "الموعد التوضيحي: اليوم ١١:٠٠ صباحًا"
    },
    "zz-plant": {
        name: "زاميا",
        image: "Rectangle (2).png",
        location: "المكتب · ضوء غير مباشر",
        status: "تحتاج متابعة",
        statusType: "warning",
        note: "راقبي تغيّر الأوراق",
        description: "راقبي الإضاءة وحالة التربة، وإذا استمر التغيّر أرفقي صورة لطلب تشخيص مقترح.",
        update: "المتابعة القادمة: راقبي الأوراق"
    },
    "pothos": {
        name: "بوتس",
        image: "Rectangle (3).png",
        location: "المطبخ · الرف",
        status: "موعد ري",
        statusType: "water",
        note: "تحققي من رطوبة التربة",
        description: "تحسسي التربة قبل السقي، ولا تعتمدي على الموعد وحده.",
        update: "الموعد التوضيحي: اليوم ٠٩:٠٠ صباحًا"
    },
    "snake-plant": {
        name: "سانسيفيريا",
        image: "Rectangle (4).png",
        location: "المدخل · بجوار الباب",
        status: "موعد ري",
        statusType: "water",
        note: "راقبي رطوبة التربة",
        description: "السانسيفيريا لا تحتاج عادةً إلى الري المتكرر، تأكدي من جفاف التربة قبل إضافة الماء.",
        update: "الموعد التوضيحي: اليوم ١٠:٠٠ صباحًا"
    }
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

let activeFilter = "all";
let selectedId = "zz-plant";
let toastTimer;
let customPlantCounter = 0;

function arabicDigits(value) {
    return String(value).replace(/\d/g, digit => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
}

function normalize(value) {
    return String(value || "")
        .normalize("NFKD")
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .replace(/[أإآ]/g, "ا")
        .replace(/ى/g, "ي")
        .toLowerCase()
        .trim();
}

function drawIcons() {
    if (window.lucide?.createIcons) window.lucide.createIcons();
}

function notify(message) {
    const toast = $("#appToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* أعداد النباتات */
function refreshCounts() {
    const cards = $$(".plant-card");
    const countTag = tag => cards.filter(card =>
        (card.dataset.filterTags || "").split(" ").includes(tag)
    ).length;

    $("#allCount").textContent = arabicDigits(cards.length);
    $("#todayCount").textContent = arabicDigits(countTag("today"));
    $("#attentionCount").textContent = arabicDigits(countTag("attention"));
}

/* البحث والفلاتر */
function applyFilters() {
    const search = normalize($("#plantSearch").value);
    let visible = 0;

    $$(".plant-card").forEach(card => {
        const text = normalize(`${card.dataset.name || ""} ${card.dataset.location || ""}`);
        const tags = (card.dataset.filterTags || "").split(" ");
        const show = text.includes(search) &&
            (activeFilter === "all" || tags.includes(activeFilter));

        card.hidden = !show;
        card.style.display = show ? "" : "none";
        if (show) visible++;
    });

    $("#visibleCount").textContent = arabicDigits(visible) + " نباتات";
    $("#emptyResults").hidden = visible > 0;
    const messages = {
        all: "كل المواقع · عرض النباتات المتاحة",
        today: "نباتات لديها مواعيد توضيحية اليوم",
        attention: "نباتات تحتاج متابعة"
    };
    $("#filterDescription").textContent = messages[activeFilter];
}

function setFilter(name) {
    if (!["all", "today", "attention"].includes(name)) return;
    activeFilter = name;
    $$(".filter-btn").forEach(button => {
        button.classList.toggle("active", button.dataset.filter === name);
    });
    applyFilters();
}

/* عرض تفاصيل النبات */
function selectPlant(id) {
    const plant = plantData[id];
    if (!plant) return;
    selectedId = id;

    $$(".plant-card").forEach(card => {
        card.classList.toggle("selected", card.dataset.id === id);
    });

    $("#detailTitle").textContent = plant.name;
    $("#detailName").textContent = plant.name;
    $("#detailImage").src = plant.image;
    $("#detailImage").alt = "نبتة " + plant.name;
    $("#detailLocation").textContent = plant.location;
    $("#detailStatus").textContent = plant.status;
    $("#detailStatus").className = "detail-status " + plant.statusType;
    $("#detailNoteTitle").textContent = plant.note;
    $("#detailDescription").textContent = plant.description;
    $("#detailUpdate").textContent = plant.update;

    const careText = $(".care-file-card p");
    if (careText) {
        careText.textContent = "ملف العناية الخاص بنبتة " + plant.name +
            "، يمكنك متابعة التذكيرات وسجل النشاط.";
    }

    // التمرير للتفاصيل على التابلت والموبايل
    if (window.matchMedia("(max-width: 1024px)").matches) {
        $("#selectedPlantDetails")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

/* نافذة إضافة نبتة */
function openDialog() {
    const dialog = $("#addPlantDialog");
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal();
    } else {
        notify("المتصفح لا يدعم نافذة الإضافة");
    }
}

function closeDialog() {
    const dialog = $("#addPlantDialog");
    if (dialog?.open) dialog.close();
}

/* فتح وإغلاق القائمة على الموبايل والآيباد */
function setSidebarOpen(open) {
    const sidebar = $("#sidebar");
    const toggle = $("#menuToggle");
    if (!sidebar || !toggle) return;

    const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches;
    const shouldOpen = Boolean(open && isSmallScreen);

    sidebar.classList.toggle("open", shouldOpen);
    toggle.setAttribute("aria-expanded", String(shouldOpen));
    toggle.setAttribute("aria-label", shouldOpen ? "إغلاق القائمة" : "فتح القائمة");
    document.body.style.overflow = shouldOpen ? "hidden" : "";
}

/* إضافة نبتة تجريبية دون تغيير العناصر الموجودة */
function addPlant(event) {
    event.preventDefault();
    const name = $("#newPlantName").value.trim();
    const location = $("#newPlantLocation").value.trim();

    if (!name || !location) {
        notify("يرجى إدخال اسم النبتة ومكانها");
        return;
    }

    const id = "custom-" + (++customPlantCounter);
    plantData[id] = {
        name,
        image: "Rectangle (5).png",
        location,
        status: "أضيفت حديثًا",
        statusType: "normal",
        note: "ابدئي ملف العناية",
        description: "تمت إضافة هذه النبتة بشكل تجريبي داخل الصفحة، ويمكن ربطها لاحقًا بقاعدة البيانات.",
        update: "لا يوجد موعد مجدول حاليًا"
    };

    const card = document.createElement("article");
    card.className = "plant-card";
    card.dataset.id = id;
    card.dataset.name = name;
    card.dataset.location = location;
    card.dataset.filterTags = "";

    // القالب ثابت؛ تُضاف بيانات المستخدم باستخدام textContent للحماية
    card.innerHTML = `
    <img src="Rectangle (5).png" alt="">
    <div class="plant-card-heading">
      <h3></h3>
      <button type="button" class="more-btn" aria-label="">
        <i data-lucide="ellipsis"></i>
      </button>
    </div>
    <p class="plant-location"></p>
    <span class="care-tag normal">نبتة جديدة</span>
    <p class="plant-date">لا توجد مواعيد بعد</p>
    <div class="plant-card-footer">
      <button type="button" class="details-link">عرض التفاصيل ←</button>
      <span>قائمة الحفظ</span>
    </div>`;

    card.querySelector("img").alt = "صورة توضيحية للنبتة " + name;
    card.querySelector("h3").textContent = name;
    card.querySelector(".plant-location").textContent = location;
    const more = card.querySelector(".more-btn");
    more.dataset.plant = id;
    more.setAttribute("aria-label", "خيارات " + name);
    card.querySelector(".details-link").dataset.plant = id;
    $("#plantsGrid").prepend(card);

    $("#addPlantForm").reset();
    closeDialog();
    setFilter("all");
    $("#plantSearch").value = "";
    refreshCounts();
    applyFilters();
    drawIcons();
    selectPlant(id);
    notify("تمت إضافة النبتة تجريبيًا 🌱");
}

/* تشغيل التفاعلات بعد اكتمال تحميل الصفحة */
document.addEventListener("DOMContentLoaded", () => {
    drawIcons();
    refreshCounts();
    applyFilters();

    const params = new URLSearchParams(window.location.search);
    if (params.get("filter")) setFilter(params.get("filter"));
    const plantId = params.get("plant");
    if (plantId && plantData[plantId]) selectPlant(plantId);
    if (params.get("action") === "add") setTimeout(openDialog, 200);

    $("#plantSearch")?.addEventListener("input", applyFilters);

    $$(".filter-btn").forEach(button => {
        button.addEventListener("click", () => setFilter(button.dataset.filter));
    });

    $("#plantsGrid")?.addEventListener("click", event => {
        const button = event.target.closest("[data-plant]");
        if (!button) return;
        selectPlant(button.dataset.plant);
        if (button.classList.contains("more-btn")) {
            notify("تم تحديد النبتة لعرض تفاصيلها");
        }
    });

    // زر الغلاف رابط في HTML: منع الانتقال لفتح النافذة بدلاً منه
    $("#heroAddPlant")?.addEventListener("click", event => {
        event.preventDefault();
        openDialog();
    });

    // هذا المعرّف اختياري؛ عدم وجوده لن يعطّل بقية JavaScript
    $("#sideAddPlant")?.addEventListener("click", event => {
        event.preventDefault();
        setSidebarOpen(false);
        openDialog();
    });

    $("#closeDialog")?.addEventListener("click", closeDialog);
    $("#cancelDialog")?.addEventListener("click", closeDialog);
    $("#addPlantForm")?.addEventListener("submit", addPlant);

    $("#addPlantDialog")?.addEventListener("click", event => {
        if (event.target === $("#addPlantDialog")) closeDialog();
    });

    $("#notificationBtn")?.addEventListener("click", () => {
        notify("ما عندك إشعارات جديدة حاليًا");
    });

    $("#diagnoseBtn")?.addEventListener("click", () => {
        notify("خدمة تشخيص النباتات تحتاج ربط API");
    });

    $("#careFileBtn")?.addEventListener("click", () => {
        notify("ملف العناية لـ " + plantData[selectedId].name + " قيد التجهيز");
    });

    $("#activityBtn")?.addEventListener("click", () => {
        notify("سجل النشاط قيد التجهيز");
    });

    $("#careScheduleBtn")?.addEventListener("click", () => {
        notify("جدول العناية قيد التجهيز");
    });

    $$("[data-toast]").forEach(button => {
        button.addEventListener("click", () => notify(button.dataset.toast));
    });

    $$("[data-coming-soon]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            notify("صفحة " + link.dataset.comingSoon + " قيد التجهيز");
        });
    });

    $("#menuToggle")?.addEventListener("click", () => {
        const sidebar = $("#sidebar");
        setSidebarOpen(!sidebar?.classList.contains("open"));
    });

    // إغلاق القائمة بالضغط خارجها
    document.addEventListener("click", event => {
        const sidebar = $("#sidebar");
        const toggle = $("#menuToggle");
        if (sidebar?.classList.contains("open") &&
            !sidebar.contains(event.target) &&
            !toggle?.contains(event.target)) {
            setSidebarOpen(false);
        }
    });

    // زر Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setSidebarOpen(false);
    });

    // عند الانتقال من شاشة صغيرة إلى كبيرة
    window.addEventListener("resize", () => {
        if (!window.matchMedia("(max-width: 1024px)").matches) {
            setSidebarOpen(false);
        }
    });
});
