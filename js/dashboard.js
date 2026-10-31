
/* ==========================================
   ENAYA DASHBOARD JAVASCRIPT
   Icons - Animations - Tasks - Search
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. أيقونات Lucide المعتمدة
    // =====================================

    function refreshIcons() {
        if (window.lucide) {
            lucide.createIcons({
                attrs: {
                    "stroke-width": 1.8
                }
            });
        }
    }

    refreshIcons();


    // =====================================
    // 2. التنقل السلس
    // =====================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                event.preventDefault();
                return;
            }

            const target = document.getElementById(
                targetId.substring(1)
            );

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });
            }

        });

    });


    // =====================================
    // 3. إظهار اسم صورة النبتة المختارة
    // =====================================

    const plantImageInput =
        document.getElementById("plant-change-image");

    const selectedImageName =
        document.getElementById("selected-image-name");

    if (plantImageInput && selectedImageName) {

        plantImageInput.addEventListener("change", function () {

            const file = this.files[0];

            selectedImageName.textContent = file
                ? "الصورة المختارة: " + file.name
                : "";

        });

    }


    // =====================================
    // 4. أنيميشن الأزرار المعتمد
    // =====================================

    document.querySelectorAll(
        ".add-plant-btn, " +
        ".diagnose-plant-btn, " +
        ".change-diagnose-btn, " +
        ".care-done-btn"
    ).forEach(button => {
        button.classList.add("enaya-animated-btn");
    });


    // =====================================
    // 5. مهام العناية والإحصائيات
    // =====================================

    const careButtons =
        document.querySelectorAll(".care-done-btn");

    const remainingBadge =
        document.querySelector(".remaining-badge");

    const statCards =
        document.querySelectorAll(".statistics .stat-card");

    // ترتيب بطاقات الإحصائيات:
    // 0 = نباتاتك
    // 1 = مهام الري
    // 2 = مهمة التسميد
    // 3 = تحتاج متابعة

    const waterStatNumber =
        statCards[1]?.querySelector(".stat-heading strong");

    const fertilizerStatNumber =
        statCards[2]?.querySelector(".stat-heading strong");


    // المهام الأساسية بنفس ترتيب HTML

    const defaultTasks = [
        { type: "water", completed: false },
        { type: "water", completed: false },
        { type: "fertilizer", completed: false }
    ];


    // =====================================
    // 6. حفظ المهام في localStorage
    // =====================================

    const storageKey = "enaya-care-tasks";

    let savedTasks = null;

    try {
        savedTasks = JSON.parse(
            localStorage.getItem(storageKey)
        );
    } catch (error) {
        console.warn("تعذر قراءة المهام المحفوظة", error);
    }

    const tasks =
        Array.isArray(savedTasks) &&
        savedTasks.length === defaultTasks.length &&
        savedTasks.every(
            task => task && typeof task.completed === "boolean"
        )
            ? defaultTasks.map((task, index) => ({
                ...task,
                completed: savedTasks[index].completed
            }))
            : defaultTasks.map(task => ({ ...task }));


    function saveCareTasks() {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(tasks)
            );
        } catch (error) {
            console.warn("تعذر حفظ المهام", error);
        }
    }


    // =====================================
    // 7. تحديث بطاقات الإحصائيات
    // =====================================

    function toArabicNumber(number) {
        return number.toLocaleString("ar");
    }

    function updateStatistics() {

        const remainingTasks = tasks.filter(
            task => !task.completed
        );

        const waterTasks = remainingTasks.filter(
            task => task.type === "water"
        ).length;

        const fertilizerTasks = remainingTasks.filter(
            task => task.type === "fertilizer"
        ).length;


        if (remainingBadge) {

            if (remainingTasks.length === 0) {
                remainingBadge.textContent =
                    "اكتملت جميع المهام";
            } else if (remainingTasks.length === 1) {
                remainingBadge.textContent =
                    "مهمة واحدة متبقية";
            } else if (remainingTasks.length === 2) {
                remainingBadge.textContent =
                    "مهمتان متبقيتان";
            } else {
                remainingBadge.textContent =
                    `${toArabicNumber(remainingTasks.length)} مهام متبقية`;
            }

        }


        if (waterStatNumber) {
            waterStatNumber.textContent =
                toArabicNumber(waterTasks);
        }


        if (fertilizerStatNumber) {
            fertilizerStatNumber.textContent =
                toArabicNumber(fertilizerTasks);
        }

    }


    // =====================================
    // 8. تفعيل أزرار "تمت"
    // =====================================

    function markButtonCompleted(button) {

        button.disabled = true;
        button.classList.add("task-completed");

        button.innerHTML = `
            <i data-lucide="check-circle-2"></i>
            مكتملة
        `;

    }


    careButtons.forEach((button, index) => {

        const task = tasks[index];

        if (!task) return;

        if (task.completed) {
            markButtonCompleted(button);
        }

        button.addEventListener("click", function () {

            if (task.completed) return;

            task.completed = true;

            saveCareTasks();

            markButtonCompleted(button);

            updateStatistics();

            refreshIcons();

        });

    });


    // =====================================
    // 9. البحث عن النباتات
    // =====================================

    const plantSearchInput =
        document.querySelector(".search-box input");

    const plantCards =
        document.querySelectorAll(".plants-grid .plant-card");


    // توحيد كتابة الحروف العربية للبحث

    function normalizeArabic(text) {
        return text
            .trim()
            .toLowerCase()
            .replace(/[أإآ]/g, "ا")
            .replace(/ى/g, "ي")
            .replace(/ـ/g, "")
            .replace(/[\u064B-\u065F]/g, "");
    }


    if (plantSearchInput) {

        plantSearchInput.addEventListener("input", function () {

            const searchText = normalizeArabic(this.value);

            plantCards.forEach(card => {

                const plantName = card.querySelector(
                    ".plant-heading h3"
                )?.textContent || "";

                const isMatch = normalizeArabic(
                    plantName
                ).includes(searchText);

                card.style.display = isMatch ? "" : "none";

            });

        });

    }


    // =====================================
    // 10. تشغيل البيانات عند فتح الصفحة
    // =====================================

    updateStatistics();
    refreshIcons();

});






