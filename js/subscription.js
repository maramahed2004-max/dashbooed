/* ========================================================
   ENAYA - SUBSCRIPTION & BILLING INTERACTIVITY
   تفاعل واجهة الاشتراك والفواتير: النوافذ المنبثقة، التنقل، والبحث
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. تهيئة جميع أيقونات Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. التحكم بالقائمة الجانبية للشاشات الصغيرة
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // 3. النوافذ المنبثقة لاستعراض خيارات الاشتراك
    const planButtons = document.querySelectorAll('.plan-action-btn');
    const modalOverlay = document.getElementById('planModalOverlay');
    const modalPlanTitle = document.getElementById('modalPlanTitle');
    const modalPlanDesc = document.getElementById('modalPlanDesc');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const toastNotice = document.getElementById('toastNotice');
    const toastMsg = document.getElementById('toastMsg');

    function openPlanModal(planName) {
        if (!modalOverlay) return;

        if (modalPlanTitle) {
            modalPlanTitle.textContent = `تفاصيل ${planName}`;
        }
        if (modalPlanDesc) {
            modalPlanDesc.textContent = planName.includes('سنوي')
                ? 'خيار الاشتراك السنوي يوفر أفضل قيمة مع خصم شهرين مجاناً ووصول مبكر لميزات تشخيص النباتات بالذكاء الاصطناعي.'
                : 'خيار الاشتراك الشهري يمنحك مرونة كاملة لتجربة كافة مزايا رعاية النباتات بدون التزام طويل الأمد.';
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function closePlanModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showToast(message) {
        if (!toastNotice) return;
        if (toastMsg) toastMsg.textContent = message;
        toastNotice.classList.add('show');
        setTimeout(() => {
            toastNotice.classList.remove('show');
        }, 3200);
    }

    planButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan') || 'الاشتراك';
            openPlanModal(plan);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePlanModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closePlanModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closePlanModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePlanModal();
        }
    });

    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            closePlanModal();
            showToast('شكراً لاهتمامك! سيتم إشعارك فور إطلاق هذه الخطة.');
        });
    }

    // 4. فلترة تفاعلية في جدول مقارنة المزايا عند الكتابة في حقل البحث
    const searchInput = document.getElementById('searchInput');
    const tableRows = document.querySelectorAll('.comparison-table tbody tr');

    if (searchInput && tableRows.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (!query || text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});
