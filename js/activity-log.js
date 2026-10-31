/* ========================================================
   ENAYA - ACTIVITY LOG INTERACTIVITY
   تفاعل واجهة سجل النشاط: فلاتر الأحداث والتنقل
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // تهيئة جميع أيقونات Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // فلاتر نوع النشاط
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timelineGroups = document.querySelectorAll('.timeline-group');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterType = btn.getAttribute('data-filter');

            timelineGroups.forEach(group => {
                const groupType = group.getAttribute('data-type');
                if (filterType === 'all' || groupType === filterType) {
                    group.style.display = 'flex';
                } else {
                    group.style.display = 'none';
                }
            });
        });
    });
});
