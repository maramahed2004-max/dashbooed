/* ========================================================
   ENAYA - ACCOUNT & SETTINGS INTERACTIVITY (تفاعلات الحساب والإعدادات)
   الأيقونات، التنقل بين الأقسام، التبديل التفاعلي، والنوافذ التوضيحية
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

    // 3. التنقل السلس بين أقسام الإعدادات وتمييز القسم النشط
    const sectionNavItems = document.querySelectorAll('.section-nav-item');
    const settingsCards = document.querySelectorAll('.settings-card');

    sectionNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            sectionNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // مراقبة التمرير لتحديث التبويب النشط تلقائياً (ScrollSpy)
    if ('IntersectionObserver' in window && settingsCards.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    sectionNavItems.forEach(nav => {
                        if (nav.getAttribute('data-target') === id) {
                            sectionNavItems.forEach(n => n.classList.remove('active'));
                            nav.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        settingsCards.forEach(card => observer.observe(card));
    }

    // 4. زر "حفظ التغييرات" وعرض إشعار Toast
    const btnSaveChanges = document.getElementById('btnSaveChanges');
    const toastNotice = document.getElementById('toastNotice');
    const toastMsg = document.getElementById('toastMsg');
    let toastTimeout;

    function showToast(message, isError = false) {
        if (!toastNotice) return;
        if (toastMsg && message) {
            toastMsg.textContent = message;
        }
        if (isError) {
            toastNotice.style.background = '#8a2323';
        } else {
            toastNotice.style.background = '#233d23';
        }
        toastNotice.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotice.classList.remove('show');
            setTimeout(() => {
                toastNotice.style.background = '#233d23';
            }, 300);
        }, 3200);
    }

    if (btnSaveChanges) {
        btnSaveChanges.addEventListener('click', () => {
            btnSaveChanges.style.transform = 'scale(0.96)';
            setTimeout(() => {
                btnSaveChanges.style.transform = '';
            }, 150);
            showToast('تم حفظ التغييرات وتحديث تفضيلات حسابك بنجاح');
        });
    }

    // 5. تفاعل مفاتيح التبديل (Toggles) مع إشعارات توضيحية
    const toggleInputs = document.querySelectorAll('.switch-control input');
    toggleInputs.forEach(input => {
        input.addEventListener('change', () => {
            const toggleRow = input.closest('.toggle-row') || input.closest('.action-row');
            const titleEl = toggleRow ? (toggleRow.querySelector('.toggle-title') || toggleRow.querySelector('.toggle-info strong')) : null;
            const title = titleEl ? titleEl.textContent.trim() : 'الإعداد';
            const state = input.checked ? 'تفعيل' : 'إيقاف';
            showToast(`تم ${state} "${title}"`);
        });
    });

    // 6. النوافذ المنبثقة التفاعلية (Modals)
    const modalOverlay = document.getElementById('actionModalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBodyContent = document.getElementById('modalBodyContent');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');

    function openModal({ title, content, confirmText, confirmClass, cancelText, onConfirm, onCancel }) {
        if (!modalOverlay) return;
        modalTitle.textContent = title;
        modalBodyContent.innerHTML = content;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        const confirmBtn = document.getElementById('modalConfirmBtn');
        const cancelBtn = document.getElementById('modalCancelBtn');

        if (confirmBtn) {
            confirmBtn.textContent = confirmText || 'تأكيد';
            confirmBtn.className = confirmClass || 'btn-modal-confirm';

            const newConfirm = confirmBtn.cloneNode(true);
            confirmBtn.replaceWith(newConfirm);
            newConfirm.addEventListener('click', () => {
                if (onConfirm) {
                    const result = onConfirm();
                    if (result === false) return;
                }
                closeModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.textContent = cancelText || 'إلغاء';
            const newCancel = cancelBtn.cloneNode(true);
            cancelBtn.replaceWith(newCancel);
            newCancel.addEventListener('click', () => {
                if (onCancel) onCancel();
                closeModal();
            });
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // كلمة المرور الحالية الافتراضية للحساب
    let userCurrentPassword = '123456';

    // زر "تغيير كلمة المرور"
    const btnChangePassword = document.getElementById('btnChangePassword');
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', () => {
            openModal({
                title: 'تغيير كلمة المرور',
                content: `
                    <div id="passwordErrorAlert" style="display: none; align-items: center; gap: 8px; background: rgba(200, 64, 64, 0.1); border-right: 3px solid #c84040; color: #c84040; padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-bottom: 12px; line-height: 1.5;">
                        <i data-lucide="alert-circle" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                        <span id="passwordErrorText"></span>
                    </div>

                    <p style="margin-bottom: 12px; font-size: 13.5px; color: var(--text-muted);">أدخل كلمة المرور الحالية والجديدة لتحديث بيانات الأمان:</p>
                    
                    <div class="form-group" style="margin-top: 10px;">
                        <label style="font-size: 13px; font-weight:600;">كلمة المرور الحالية</label>
                        <input type="password" class="form-input" id="currentPasswordInput" placeholder="••••••••" style="margin-top: 4px;">
                        <small style="font-size: 11.5px; color: var(--text-light); margin-top: 3px; display: block;">كلمة المرور التجريبية: 123456</small>
                    </div>

                    <div class="form-group" style="margin-top: 10px;">
                        <label style="font-size: 13px; font-weight:600;">كلمة المرور الجديدة</label>
                        <input type="password" class="form-input" id="newPasswordInput" placeholder="••••••••" style="margin-top: 4px;">
                    </div>

                    <div class="form-group" style="margin-top: 10px;">
                        <label style="font-size: 13px; font-weight:600;">تأكيد كلمة المرور الجديدة</label>
                        <input type="password" class="form-input" id="confirmNewPasswordInput" placeholder="••••••••" style="margin-top: 4px;">
                    </div>
                `,
                confirmText: 'حفظ كلمة المرور',
                confirmClass: 'btn-modal-confirm',
                onConfirm: () => {
                    const currentInput = document.getElementById('currentPasswordInput');
                    const newInput = document.getElementById('newPasswordInput');
                    const confirmInput = document.getElementById('confirmNewPasswordInput');
                    const errorAlert = document.getElementById('passwordErrorAlert');
                    const errorText = document.getElementById('passwordErrorText');

                    function showError(inputEl, msg) {
                        [currentInput, newInput, confirmInput].forEach(inp => {
                            if (inp) inp.style.borderColor = '';
                        });
                        if (inputEl) {
                            inputEl.style.borderColor = '#c84040';
                            inputEl.focus();
                        }
                        if (errorAlert && errorText) {
                            errorText.textContent = msg;
                            errorAlert.style.display = 'flex';
                            if (typeof lucide !== 'undefined') {
                                lucide.createIcons();
                            }
                        }
                        showToast(msg, true);
                    }

                    const currentVal = currentInput ? currentInput.value.trim() : '';
                    const newVal = newInput ? newInput.value.trim() : '';
                    const confirmVal = confirmInput ? confirmInput.value.trim() : '';

                    // 1. التحقق من إدخال وصحة كلمة المرور الحالية
                    if (!currentVal) {
                        showError(currentInput, 'يرجى إدخال كلمة المرور الحالية');
                        return false;
                    }

                    const validCurrentPasswords = [userCurrentPassword, '123456', 'admin123', 'enaya123', 'password'];
                    if (!validCurrentPasswords.includes(currentVal)) {
                        showError(currentInput, 'كلمة المرور الحالية غير صحيحة! (الكلمة التجريبية: 123456)');
                        return false;
                    }

                    // 2. التحقق من كلمة المرور الجديدة
                    if (!newVal) {
                        showError(newInput, 'يرجى إدخال كلمة المرور الجديدة');
                        return false;
                    }

                    if (newVal.length < 6) {
                        showError(newInput, 'يجب أن تتكون كلمة المرور الجديدة من 6 خانات على الأقل');
                        return false;
                    }

                    if (newVal === currentVal) {
                        showError(newInput, 'كلمة المرور الجديدة يجب أن تختلف عن كلمة المرور الحالية');
                        return false;
                    }

                    // 3. التحقق من تأكيد كلمة المرور وتطابقها
                    if (!confirmVal) {
                        showError(confirmInput, 'يرجى تأكيد كلمة المرور الجديدة');
                        return false;
                    }

                    if (newVal !== confirmVal) {
                        showError(confirmInput, 'كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين!');
                        return false;
                    }

                    // نجاح العملية
                    userCurrentPassword = newVal;
                    showToast('تم تحديث كلمة المرور بنجاح');
                    return true;
                }
            });

            // إزالة حدود الخطأ والتنبيه عند بدء الكتابة في أي حقل
            setTimeout(() => {
                const inputs = [
                    document.getElementById('currentPasswordInput'),
                    document.getElementById('newPasswordInput'),
                    document.getElementById('confirmNewPasswordInput')
                ];
                const errorAlert = document.getElementById('passwordErrorAlert');
                inputs.forEach(inp => {
                    if (inp) {
                        inp.addEventListener('input', () => {
                            inp.style.borderColor = '';
                            if (errorAlert) errorAlert.style.display = 'none';
                        });
                    }
                });
            }, 60);
        });
    }

    // زر "تسجيل الخروج"
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            openModal({
                title: 'تسجيل الخروج',
                content: '<p>هل ترغب بالتأكيد في تسجيل الخروج من حساب يوسف وسام؟ يمكنك تسجيل الدخول مجدداً في أي وقت.</p>',
                confirmText: 'تسجيل الخروج',
                confirmClass: 'btn-modal-danger',
                onConfirm: () => {
                    showToast('جاري تسجيل الخروج...');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1200);
                }
            });
        });
    }

    // إدارة تدفق تأكيد حذف الحساب أو إلغاء طلب الحذف
    const deleteSubtitle = document.getElementById('deleteSubtitle');
    const btnDeleteAccount = document.getElementById('btnDeleteAccount');

    function attachDeleteAccountHandler() {
        const btn = document.getElementById('btnDeleteAccount');
        if (!btn) return;

        btn.onclick = () => {
            openModal({
                title: 'تأكيد طلب حذف الحساب',
                content: `
                    <p style="color: #c84040; font-weight: 700; margin-bottom: 8px;">تحذير: هذا الإجراء دائم ولا يمكن التراجع عنه بمجرد تنفيذه.</p>
                    <p style="margin-bottom: 12px; line-height: 1.6;">سيتم حذف بيانات نباتاتك، جدول العناية، وسجل التشخيص بالكامل من النظام.</p>
                    <p style="font-weight: 600; color: var(--text-dark); margin: 0;">هل ترغب في تأكيد حذف الحساب نهائياً أو إلغاء الطلب؟</p>
                `,
                confirmText: 'تأكيد الحذف',
                confirmClass: 'btn-modal-danger',
                cancelText: 'إلغاء طلب الحذف',
                onConfirm: () => {
                    if (deleteSubtitle) {
                        deleteSubtitle.textContent = 'تم تقديم طلب حذف الحساب بنجاح (قيد المعالجة).';
                        deleteSubtitle.style.color = 'var(--danger-red)';
                        deleteSubtitle.style.fontWeight = '600';
                    }
                    if (btn) {
                        btn.textContent = 'إلغاء طلب الحذف';
                        btn.className = 'btn-secondary-action';
                        attachCancelDeleteHandler();
                    }
                    showToast('تم استلام طلب حذف الحساب بنجاح');
                },
                onCancel: () => {
                    showToast('تم إلغاء طلب الحذف والاحتفاظ بالحساب');
                }
            });
        };
    }

    function attachCancelDeleteHandler() {
        const btn = document.getElementById('btnDeleteAccount');
        if (!btn) return;

        btn.onclick = () => {
            openModal({
                title: 'إلغاء طلب حذف الحساب',
                content: `
                    <p style="margin-bottom: 8px; line-height: 1.6; color: var(--text-dark);">هل أنت متأكد من رغبتك في إلغاء طلب حذف الحساب والاحتفاظ بكافة بياناتك ونباتاتك؟</p>
                    <p style="color: var(--text-muted); font-size: 13px; margin: 0;">سيستمر حسابك بالعمل بصورة طبيعية دون أي تغيير.</p>
                `,
                confirmText: 'تأكيد إلغاء الطلب',
                confirmClass: 'btn-modal-confirm',
                cancelText: 'تراجع',
                onConfirm: () => {
                    if (deleteSubtitle) {
                        deleteSubtitle.textContent = 'إجراء دائم يتطلب تأكيداً منفصلاً.';
                        deleteSubtitle.style.color = '';
                        deleteSubtitle.style.fontWeight = '';
                    }
                    if (btn) {
                        btn.textContent = 'طلب حذف الحساب';
                        btn.className = 'btn-danger-link';
                        attachDeleteAccountHandler();
                    }
                    showToast('تم إلغاء طلب الحذف واستعادة الحساب بنجاح');
                }
            });
        };
    }

    if (btnDeleteAccount) {
        attachDeleteAccountHandler();
    }

    // 7. مربع البحث السريع
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    showToast(`البحث عن: ${query}`);
                }
            }
        });
    }
});
