/* ========================================================
   ENAYA - UNIFIED SIDEBAR & RESPONSIVE CONTROLLER
   تحكم القائمة الجانبية الموحدة لجميع الواجهات
   - موبايل/تابلت (≤1024px): يضيف class="sidebar-open" على body
   - ديسكتوب (≥1025px): يضيف class="sidebar-collapsed" على body
   ======================================================== */

(function () {
    'use strict';

    var MOBILE_BP = 1024; // px

    function isMobile() {
        return window.innerWidth <= MOBILE_BP;
    }

    function initUnifiedSidebar() {
        // تهيئة أيقونات Lucide
        if (window.lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }

        var sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
        if (!sidebar) return;

        // 1. زر الإغلاق داخل القائمة
        var closeBtn = document.getElementById('mobile-sidebar-close') || sidebar.querySelector('.mobile-sidebar-close');
        if (!closeBtn) {
            closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.id = 'mobile-sidebar-close';
            closeBtn.className = 'mobile-sidebar-close';
            closeBtn.setAttribute('aria-label', 'إغلاق القائمة');
            closeBtn.innerHTML = '&times;';
            sidebar.insertBefore(closeBtn, sidebar.firstChild);
        }

        // 2. Backdrop
        var backdrop = document.getElementById('mobile-sidebar-backdrop') || document.querySelector('.mobile-sidebar-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'mobile-sidebar-backdrop';
            backdrop.className = 'mobile-sidebar-backdrop';
            document.body.appendChild(backdrop);
        }

        // ==============================
        // التحكم بالحالة
        // ==============================

        function isSidebarVisible() {
            if (isMobile()) {
                return document.body.classList.contains('sidebar-open');
            } else {
                return !document.body.classList.contains('sidebar-collapsed');
            }
        }

        function setSidebarOpen(open) {
            if (isMobile()) {
                // موبايل: sidebar-open يُظهر القائمة
                document.body.classList.toggle('sidebar-open', open);
                document.body.classList.remove('sidebar-collapsed');
            } else {
                // ديسكتوب: sidebar-collapsed يُخفي القائمة
                document.body.classList.toggle('sidebar-collapsed', !open);
                document.body.classList.remove('sidebar-open');
            }

            // تحديث الـ aria
            var toggleBtns = document.querySelectorAll(
                '#mobile-menu-toggle, #menuToggle, .mobile-menu-btn, .mobile-menu, [data-sidebar-toggle]'
            );
            toggleBtns.forEach(function (btn) {
                btn.setAttribute('aria-expanded', String(open));
                btn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
            });
        }

        // 3. ربط أزرار التبديل
        function bindToggleButtons() {
            var toggleBtns = document.querySelectorAll(
                '#mobile-menu-toggle, #menuToggle, .mobile-menu-btn, .mobile-menu, [data-sidebar-toggle]'
            );
            toggleBtns.forEach(function (btn) {
                btn.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSidebarOpen(!isSidebarVisible());
                };
            });
            return toggleBtns.length > 0;
        }

        var hasToggles = bindToggleButtons();

        // 4. إضافة زر تلقائي إذا لم يكن موجوداً
        var topBar = document.querySelector('.top-bar, .topbar, .top-header');
        if (topBar && !hasToggles) {
            var topBarRight = topBar.querySelector('.top-bar-right') || topBar;
            var autoToggle = document.createElement('button');
            autoToggle.type = 'button';
            autoToggle.id = 'mobile-menu-toggle';
            autoToggle.className = 'mobile-menu-btn';
            autoToggle.setAttribute('aria-label', 'فتح القائمة');
            autoToggle.innerHTML = '<i data-lucide="menu"></i>';
            topBarRight.insertBefore(autoToggle, topBarRight.firstChild);

            autoToggle.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                setSidebarOpen(!isSidebarVisible());
            };

            if (window.lucide && typeof lucide.createIcons === 'function') {
                lucide.createIcons();
            }
        }

        // 5. زر الإغلاق
        closeBtn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            setSidebarOpen(false);
        };

        // 6. Backdrop
        backdrop.onclick = function () {
            setSidebarOpen(false);
        };

        // 7. Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isSidebarVisible()) {
                setSidebarOpen(false);
            }
        });

        // 8. إغلاق القائمة على موبايل عند الضغط على رابط
        sidebar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (isMobile()) {
                    setSidebarOpen(false);
                }
            });
        });

        // 9. إعادة ضبط عند تغيير حجم الشاشة
        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                // إزالة كلا الـ classes عند التغيير بين mobile/desktop
                document.body.classList.remove('sidebar-open', 'sidebar-collapsed');
                bindToggleButtons();
            }, 200);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUnifiedSidebar);
    } else {
        initUnifiedSidebar();
    }
})();
