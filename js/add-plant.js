/* ========================================================
   ENAYA - ADD PLANT INTERACTIVITY
   تفاعل واجهة إضافة نبتة: رفع الصورة، التحليل، والأيقونات
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // تهيئة جميع أيقونات Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // عناصر رفع وتغيير الصورة
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const uploadStatusBadge = document.getElementById('uploadStatusBadge');
    const photoFileInput = document.getElementById('photoFileInput');
    const plantImagePreview = document.getElementById('plantImagePreview');
    const uploadedFileName = document.getElementById('uploadedFileName');
    const fileSpecs = document.getElementById('fileSpecs');

    if (changePhotoBtn && photoFileInput) {
        changePhotoBtn.addEventListener('click', () => {
            photoFileInput.click();
        });

        if (uploadStatusBadge) {
            uploadStatusBadge.addEventListener('click', () => {
                photoFileInput.click();
            });
        }

        photoFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // تحديث اسم الملف وحجمه
                if (uploadedFileName) {
                    uploadedFileName.textContent = file.name;
                }
                if (fileSpecs) {
                    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
                    const ext = file.name.split('.').pop().toUpperCase();
                    fileSpecs.textContent = `${sizeMb} م.ب · ${ext}`;
                }

                // عرض معاينة الصورة
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (plantImagePreview) {
                        plantImagePreview.src = event.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // زر التحليل والمراجعة
    const addPlantForm = document.getElementById('addPlantForm');
    const submitBtn = document.getElementById('submitBtn');
    const analysisModal = document.getElementById('analysisModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');

    if (addPlantForm) {
        addPlantForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const plantName = document.getElementById('plantNameInput').value.trim();
            const plantLocation = document.getElementById('plantLocationInput').value.trim();

            if (!plantName) {
                alert('يرجى إدخال اسم النبتة');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation: spin 0.7s linear infinite;"></span>
                    <span>جارٍ التحليل...</span>
                `;
            }

            // حفظ بيانات النبتة للانتقال إلى واجهة المراجعة
            sessionStorage.setItem('enaya_temp_plant_name', plantName);
            sessionStorage.setItem('enaya_temp_plant_location', plantLocation);
            if (plantImagePreview && plantImagePreview.src) {
                sessionStorage.setItem('enaya_temp_plant_photo', plantImagePreview.src);
            }

            if (analysisModal) {
                analysisModal.classList.add('active');
            }

            setTimeout(() => {
                if (modalTitle && modalDesc) {
                    modalTitle.textContent = 'تم تحليل النبتة بنجاح!';
                    modalDesc.innerHTML = `تم التعرف على <strong>${plantName}</strong> واقتراح احتياجات العناية بالذكاء الاصطناعي.<br>جارٍ نقلك للمراجعة والاعتماد...`;
                }

                setTimeout(() => {
                    window.location.href = 'review-plant.html';
                }, 1200);
            }, 1500);
        });
    }
});
