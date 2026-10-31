/* ========================================================
   ENAYA - REVIEW PLANT INTERACTIVITY
   تفاعل واجهة مراجعة النبتة: اعتماد النبتة، تعديلها، وربط الصفحات
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // تهيئة جميع أيقونات Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // استرجاع البيانات المحفوظة إن وجدت
    const savedName = sessionStorage.getItem('enaya_temp_plant_name');
    const savedLocation = sessionStorage.getItem('enaya_temp_plant_location');
    const savedPhoto = sessionStorage.getItem('enaya_temp_plant_photo');

    const reviewPlantName = document.getElementById('reviewPlantName');
    const reviewPlantLocation = document.getElementById('reviewPlantLocation');
    const reviewPlantImage = document.getElementById('reviewPlantImage');

    if (savedName && reviewPlantName) {
        reviewPlantName.textContent = savedName;
    }
    if (savedLocation && reviewPlantLocation) {
        reviewPlantLocation.textContent = savedLocation;
    }
    if (savedPhoto && reviewPlantImage) {
        reviewPlantImage.src = savedPhoto;
    }

    // زر اعتماد وإضافة
    const approvePlantBtn = document.getElementById('approvePlantBtn');
    const successModal = document.getElementById('successModal');

    if (approvePlantBtn) {
        approvePlantBtn.addEventListener('click', () => {
            approvePlantBtn.disabled = true;
            approvePlantBtn.innerHTML = `
                <span style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation: spin 0.7s linear infinite;"></span>
                <span>جارٍ الحفظ...</span>
            `;

            if (successModal) {
                successModal.classList.add('active');
            }

            setTimeout(() => {
                // حفظ حالة النبتة كمضافة بنجاح وتوجيه المستخدم إلى صفحة نباتاتي
                sessionStorage.setItem('enaya_new_plant_added', 'true');
                window.location.href = 'my-plants.html';
            }, 1500);
        });
    }
});
