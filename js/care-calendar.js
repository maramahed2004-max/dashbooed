/* ========================================================
   ENAYA - CARE CALENDAR INTERACTIVITY
   تفاعل واجهة جدول العناية: فلاتر المهام، إنجاز المهام، والتنقل
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // تهيئة جميع أيقونات Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // تفاعل فلاتر نوع العناية
    const filterBtns = document.querySelectorAll('.filter-btn');
    const taskRows = document.querySelectorAll('.task-item-row');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterType = btn.getAttribute('data-filter');

            taskRows.forEach(row => {
                const rowType = row.getAttribute('data-type');
                if (filterType === 'all' || rowType === filterType) {
                    row.style.display = 'flex';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // تفاعل أزرار "تمت" للمهام
    const taskDoneBtns = document.querySelectorAll('.btn-task-done');
    const tasksCountPill = document.querySelector('.tasks-count-pill');
    const statusNote = document.querySelector('.today-completion-status span');

    let completedCount = 0;
    const totalTasks = taskDoneBtns.length;

    taskDoneBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isCompleted = btn.classList.toggle('completed');

            if (isCompleted) {
                btn.innerHTML = `مُنجزة <i data-lucide="check" style="width:14px;height:14px;"></i>`;
                btn.style.backgroundColor = '#2d4a2c';
                btn.style.color = '#ffffff';
                btn.style.borderColor = '#2d4a2c';
                completedCount++;
            } else {
                btn.innerHTML = `تمت <i data-lucide="check" style="width:14px;height:14px;"></i>`;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.borderColor = '';
                completedCount--;
            }

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            const remaining = totalTasks - completedCount;
            if (tasksCountPill) {
                if (remaining > 0) {
                    tasksCountPill.textContent = `${remaining} مهام متبقية`;
                } else {
                    tasksCountPill.textContent = `اكتملت جميع مهام اليوم 🎉`;
                    tasksCountPill.style.backgroundColor = '#2d4a2c';
                    tasksCountPill.style.color = '#ffffff';
                }
            }

            if (statusNote) {
                if (completedCount === 0) {
                    statusNote.textContent = 'لم تُنجز أي مهمة من مهام اليوم في هذه المعاينة.';
                } else if (completedCount === totalTasks) {
                    statusNote.textContent = 'رائع! تم إنجاز جميع مهام اليوم بنجاح.';
                } else {
                    statusNote.textContent = `تم إنجاز ${completedCount} من أصل ${totalTasks} مهام حتى الآن.`;
                }
            }
        });
    });

    // زر العودة إلى اليوم
    const backToTodayBtn = document.getElementById('backToTodayBtn');
    const todayCard = document.querySelector('.day-column.active-today');

    if (backToTodayBtn && todayCard) {
        backToTodayBtn.addEventListener('click', () => {
            todayCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            todayCard.style.transform = 'scale(1.04)';
            setTimeout(() => {
                todayCard.style.transform = '';
            }, 600);
        });
    }

    // التنقل بين الأسابيع
    const currentWeekLabel = document.getElementById('currentWeekLabel');
    const prevWeekBtn = document.getElementById('prevWeekBtn');
    const nextWeekBtn = document.getElementById('nextWeekBtn');

    if (prevWeekBtn && nextWeekBtn && currentWeekLabel) {
        const weeks = [
            '5–11 أكتوبر 2026',
            '12–18 أكتوبر 2026',
            '19–25 أكتوبر 2026'
        ];
        let currentIdx = 1;

        prevWeekBtn.addEventListener('click', () => {
            if (currentIdx > 0) {
                currentIdx--;
                currentWeekLabel.textContent = weeks[currentIdx];
            }
        });

        nextWeekBtn.addEventListener('click', () => {
            if (currentIdx < weeks.length - 1) {
                currentIdx++;
                currentWeekLabel.textContent = weeks[currentIdx];
            }
        });
    }
});
