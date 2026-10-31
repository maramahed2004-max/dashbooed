/* ========================================================
   ENAYA - PLANT DIAGNOSIS INTERACTIVITY
   تفاعل واجهة تشخيص النباتات: رفع الصور، الفحص الذكي، والتنبيهات
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // تهيئة جميع أيقونات Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // عناصر رفع الصورة
    const uploadDropzone = document.getElementById('uploadDropzone');
    const diagnosisFileInput = document.getElementById('diagnosisFileInput');
    const browseFileBtn = document.getElementById('browseFileBtn');
    const dropzonePreview = document.getElementById('dropzonePreview');
    const previewImg = document.getElementById('previewImg');
    const removePreviewBtn = document.getElementById('removePreviewBtn');
    const dropzoneContent = document.getElementById('dropzoneContent');
    const footnoteHint = document.getElementById('footnoteHint');

    let hasSelectedImage = false;

    // فتح نافذة اختيار الملف
    if (browseFileBtn && diagnosisFileInput) {
        browseFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            diagnosisFileInput.click();
        });
    }

    if (uploadDropzone && diagnosisFileInput) {
        uploadDropzone.addEventListener('click', () => {
            if (!hasSelectedImage) {
                diagnosisFileInput.click();
            }
        });

        // السحب والإفلات
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadDropzone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadDropzone.classList.remove('dragover');
            });
        });

        uploadDropzone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                handleFile(files[0]);
            }
        });

        diagnosisFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });
    }

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('يرجى اختيار ملف صورة صالح (PNG أو JPG).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (previewImg && dropzonePreview && dropzoneContent) {
                previewImg.src = e.target.result;
                dropzonePreview.style.display = 'block';
                dropzoneContent.style.display = 'none';
                hasSelectedImage = true;
                if (footnoteHint) {
                    footnoteHint.textContent = `تم تحديد الصورة: ${file.name}`;
                    footnoteHint.style.color = '#2d4a2c';
                    footnoteHint.style.fontWeight = '700';
                }
            }
        };
        reader.readAsDataURL(file);
    }

    // إزالة الصورة المعاينة
    if (removePreviewBtn) {
        removePreviewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (previewImg && dropzonePreview && dropzoneContent && diagnosisFileInput) {
                previewImg.src = '';
                dropzonePreview.style.display = 'none';
                dropzoneContent.style.display = 'flex';
                diagnosisFileInput.value = '';
                hasSelectedImage = false;
                if (footnoteHint) {
                    footnoteHint.textContent = 'لن يبدأ التشخيص قبل إضافة صورة';
                    footnoteHint.style.color = '';
                    footnoteHint.style.fontWeight = '';
                }
            }
        });
    }

    // زر بدء التشخيص
    const startDiagBtn = document.getElementById('startDiagBtn');
    const diagModal = document.getElementById('diagModal');
    const diagModalTitle = document.getElementById('diagModalTitle');
    const diagModalDesc = document.getElementById('diagModalDesc');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalSpinner = document.getElementById('modalSpinner');

    if (startDiagBtn) {
        startDiagBtn.addEventListener('click', () => {
            if (!hasSelectedImage) {
                // تنبيه بصري لطيف لسحب الانتباه لمنطقة رفع الصورة
                if (uploadDropzone) {
                    uploadDropzone.style.borderColor = '#c07a16';
                    uploadDropzone.style.backgroundColor = '#fdf8ee';
                    setTimeout(() => {
                        uploadDropzone.style.borderColor = '';
                        uploadDropzone.style.backgroundColor = '';
                    }, 1200);
                }
                alert('يرجى إضافة صورة للنبتة أولاً لبدء التشخيص.');
                return;
            }

            // تشغيل محاكاة الفحص الذكي
            if (diagModal && modalSpinner) {
                modalSpinner.style.display = 'block';
                diagModalTitle.textContent = 'جارٍ فحص صورة النبتة بالذكاء الاصطناعي...';
                diagModalDesc.innerHTML = 'يتم الآن تحليل درجات لون الأوراق، بقع الجفاف أو الرطوبة، ومقارنتها بقاعدة بيانات أمراض النباتات.';
                modalCloseBtn.style.display = 'none';
                diagModal.classList.add('active');

                setTimeout(() => {
                    modalSpinner.style.display = 'none';
                    diagModalTitle.textContent = 'اكتمل التحليل المقترح! 🌱';
                    diagModalDesc.innerHTML = `
                        <strong>النتيجة المقترحة:</strong> إجهاد مائي خفيف (احتمال زيادة الري).<br>
                        <strong>التوصية:</strong> دعي سطح التربة يجف بمقدار 2-3 سم قبل موعد الري القادم، وتأكدي من فتحات تصريف الإناء.
                    `;
                    modalCloseBtn.style.display = 'inline-block';
                }, 2200);
            }
        });
    }

    // إغلاق النافذة المنبثقة
    if (modalCloseBtn && diagModal) {
        modalCloseBtn.addEventListener('click', () => {
            diagModal.classList.remove('active');
        });
    }

    // زر عرض الاقتراح في سجل التشخيصات
    const viewSuggestionBtn = document.getElementById('viewSuggestionBtn');
    if (viewSuggestionBtn && diagModal) {
        viewSuggestionBtn.addEventListener('click', () => {
            if (modalSpinner) modalSpinner.style.display = 'none';
            diagModalTitle.textContent = 'تشخيص: البوتس · احتمال زيادة الري';
            diagModalDesc.innerHTML = `
                <strong>تاريخ التشخيص:</strong> ١١ أكتوبر ٢٠٢٦<br>
                <strong>الأعراض المرصودة:</strong> اصفرار طفيف عند أطراف الأوراق السفلية مع رطوبة متبقية في عمق التربة.<br>
                <strong>خطة العناية:</strong><br>
                • تقليل عدد مرات الري خلال هذا الأسبوع.<br>
                • نقل النبتة لموقع بضوء غير مباشر أوفر لتسريع امتصاص الماء.<br>
                • التأكد من عدم تجمع مياه زائدة في الصحن السفلي.
            `;
            modalCloseBtn.style.display = 'inline-block';
            diagModal.classList.add('active');
        });
    }
});
