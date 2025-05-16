/**
 * preview-export.js - מודול תצוגה מקדימה וייצוא
 * אחראי על השלב האחרון של התהליך, הכולל תצוגה מקדימה וייצוא תוצרים
 */

const PreviewExport = (function() {
    // משתנים פנימיים
    let isInitialized = false;
    let previewInterval = null;
    let currentSlideIndex = 0;
    
    /**
     * אתחול מודול התצוגה המקדימה והייצוא
     */
    function init() {
        if (isInitialized) return;
        
        // איתחול תצוגה מקדימה
        initPreview();
        
        // הוספת אירועי ייצוא
        addExportEvents();
        
        isInitialized = true;
    }
    
    /**
     * אתחול התצוגה המקדימה
     */
    function initPreview() {
        // קבלת אזור התצוגה המקדימה
        const previewContainer = document.querySelector('#step-preview .preview-container');
        if (!previewContainer) return;
        
        // ניקוי תוכן קיים
        previewContainer.innerHTML = '';
        
        // קבלת כל השקפים בפרויקט
        const slides = ProjectManager.getAllSlides();
        if (!slides || slides.length === 0) {
            previewContainer.innerHTML = '<div class="empty-state">אין שקפים בפרויקט.</div>';
            disableExportButtons();
            return;
        }
        
        // יצירת אלמנט קנבס תצוגה מקדימה
        const previewCanvas = document.createElement('div');
        previewCanvas.className = 'preview-canvas';
        
        // יצירת כפתורי בקרה
        const previewControls = document.createElement('div');
        previewControls.className = 'preview-controls';
        
        // כפתור הפעלה/עצירה
        const playPauseBtn = document.createElement('button');
        playPauseBtn.className = 'btn-play-pause';
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        playPauseBtn.addEventListener('click', togglePreview);
        
        // כפתור קודם
        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn-prev-slide';
        prevBtn.innerHTML = '<i class="fas fa-step-backward"></i>';
        prevBtn.addEventListener('click', function() {
            stopPreview();
            navigateToSlide(currentSlideIndex - 1);
        });
        
        // כפתור הבא
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn-next-slide';
        nextBtn.innerHTML = '<i class="fas fa-step-forward"></i>';
        nextBtn.addEventListener('click', function() {
            stopPreview();
            navigateToSlide(currentSlideIndex + 1);
        });
        
        // מד התקדמות
        const progressBar = document.createElement('div');
        progressBar.className = 'preview-progress';
        progressBar.innerHTML = `<div class="progress-fill"></div>`;
        
        // הוספת כפתורי בקרה
        previewControls.appendChild(prevBtn);
        previewControls.appendChild(playPauseBtn);
        previewControls.appendChild(nextBtn);
        
        // הוספת אלמנטים לתצוגה מקדימה
        previewContainer.appendChild(previewCanvas);
        previewContainer.appendChild(progressBar);
        previewContainer.appendChild(previewControls);
        
        // הצגת השקף הראשון
        navigateToSlide(0);
    }
    
    /**
     * הוספת אירועי ייצוא
     */
    function addExportEvents() {
        // כפתור ייצוא כתמונה
        const exportImageBtn = document.querySelector('#export-image-btn');
        if (exportImageBtn) {
            exportImageBtn.addEventListener('click', exportAsImages);
        }
        
        // כפתור ייצוא כסרטון
        const exportVideoBtn = document.querySelector('#export-video-btn');
        if (exportVideoBtn) {
            exportVideoBtn.addEventListener('click', exportAsVideo);
        }
        
        // כפתור שמירת פרויקט
        const saveProjectBtn = document.querySelector('#save-project-btn');
        if (saveProjectBtn) {
            saveProjectBtn.addEventListener('click', saveProject);
        }
    }
    
    /**
     * מעבר לשקף מסוים
     * @param {number} index אינדקס השקף
     */
    function navigateToSlide(index) {
        // קבלת כל השקפים בפרויקט
        const slides = ProjectManager.getAllSlides();
        if (!slides || slides.length === 0) return;
        
        // וידוא שהאינדקס בטווח
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // עדכון האינדקס הנוכחי
        currentSlideIndex = index;
        
        // רנדור השקף
        renderPreviewSlide(slides[index]);
        
        // עדכון סרגל התקדמות
        updateProgressBar();
    }
    
    /**
     * רנדור שקף בתצוגה מקדימה
     * @param {Object} slide אובייקט השקף
     */
    function renderPreviewSlide(slide) {
        const previewCanvas = document.querySelector('.preview-canvas');
        if (!previewCanvas) return;
        
        // ניקוי תוכן קיים
        previewCanvas.innerHTML = '';
        
        // החלת רקע
        if (slide.background.type === 'color') {
            previewCanvas.style.backgroundColor = slide.background.value;
            previewCanvas.style.backgroundImage = '';
        } else if (slide.background.type === 'image') {
            previewCanvas.style.backgroundImage = `url(${slide.background.value})`;
            previewCanvas.style.backgroundSize = 'cover';
            previewCanvas.style.backgroundPosition = 'center';
            previewCanvas.style.backgroundColor = '';
        }
        
        // הוספת אלמנטים לשקף
        slide.elements.forEach(element => {
            const elementDOM = createPreviewElementDOM(element);
            previewCanvas.appendChild(elementDOM);
        });
    }
    
    /**
     * יצירת אלמנט DOM לאלמנט שקף בתצוגה מקדימה
     * @param {Object} element אובייקט האלמנט
     * @returns {HTMLElement} אלמנט ה-DOM
     */
    function createPreviewElementDOM(element) {
        const elementDOM = document.createElement('div');
        elementDOM.className = `preview-element ${element.type}-element`;
        
        // מיקום האלמנט
        elementDOM.style.position = 'absolute';
        elementDOM.style.left = `${element.position.x}%`;
        elementDOM.style.top = `${element.position.y}%`;
        elementDOM.style.transform = 'translate(-50%, -50%)';
        
        // גודל האלמנט
        if (element.size.width.value !== 'auto') {
            elementDOM.style.width = `${element.size.width.value}${element.size.width.unit}`;
        }
        if (element.size.height.value !== 'auto') {
            elementDOM.style.height = `${element.size.height.value}${element.size.height.unit}`;
        }
        
        // הוספת אנימציה (אם קיימת)
        if (element.animation) {
            elementDOM.style.animation = `${element.animation.type} ${element.animation.duration}s ${element.animation.delay}s ${element.animation.timingFunction} ${element.animation.iterationCount}`;
        }
        
        // יצירת תוכן לפי סוג האלמנט
        if (element.type === 'text') {
            // עיצוב האלמנט
            elementDOM.style.color = element.style.color;
            elementDOM.style.fontFamily = element.style.fontFamily;
            elementDOM.style.fontSize = `${element.style.fontSize.value}${element.style.fontSize.unit}`;
            elementDOM.style.fontWeight = element.style.fontWeight;
            elementDOM.style.textAlign = element.style.textAlign;
            
            // תוכן האלמנט
            elementDOM.textContent = element.content;
        } else if (element.type === 'image') {
            const img = document.createElement('img');
            img.src = element.content;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            elementDOM.appendChild(img);
        }
        
        return elementDOM;
    }
    
    /**
     * עדכון סרגל התקדמות
     */
    function updateProgressBar() {
        const progressFill = document.querySelector('.preview-progress .progress-fill');
        if (!progressFill) return;
        
        // קבלת כל השקפים בפרויקט
        const slides = ProjectManager.getAllSlides();
        if (!slides || slides.length === 0) return;
        
        // חישוב אחוז התקדמות
        const progressPercentage = ((currentSlideIndex) / (slides.length - 1)) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    /**
     * הפעלה/עצירה של התצוגה המקדימה
     */
    function togglePreview() {
        const playPauseBtn = document.querySelector('.btn-play-pause');
        if (!playPauseBtn) return;
        
        if (previewInterval) {
            // עצירת המצגת
            stopPreview();
        } else {
            // הפעלת המצגת
            startPreview();
        }
    }
    
    /**
     * הפעלת המצגת האוטומטית
     */
    function startPreview() {
        // עצירת מצגת קיימת (אם יש)
        stopPreview();
        
        // החלפת אייקון לעצירה
        const playPauseBtn = document.querySelector('.btn-play-pause');
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        
        // הפעלת אינטרבל להחלפת שקפים
        previewInterval = setInterval(() => {
            navigateToSlide(currentSlideIndex + 1);
            
            // קבלת מספר השקפים
            const slides = ProjectManager.getAllSlides();
            
            // בדיקה אם הגענו לסוף המצגת
            if (currentSlideIndex === 0 && slides && slides.length > 1) {
                // עצירה לאחר סיבוב שלם
                stopPreview();
            }
        }, 3000); // החלפת שקף כל 3 שניות
    }
    
    /**
     * עצירת המצגת האוטומטית
     */
    function stopPreview() {
        if (previewInterval) {
            clearInterval(previewInterval);
            previewInterval = null;
            
            // החלפת אייקון להפעלה
            const playPauseBtn = document.querySelector('.btn-play-pause');
            if (playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    }
    
    /**
     * ייצוא כתמונות
     */
    function exportAsImages() {
        // קבלת כל השקפים בפרויקט
        const slides = ProjectManager.getAllSlides();
        if (!slides || slides.length === 0) {
            alert('אין שקפים בפרויקט לייצוא.');
            return;
        }
        
        // הצגת הודעת התקדמות
        showLoadingMessage('מכין תמונות לייצוא...');
        
        // מעבר לכל שקף וייצוא כתמונה
        let processedSlides = 0;
        
        // פונקציה רקורסיבית לעיבוד שקף אחד בכל פעם
        function processNextSlide() {
            if (processedSlides >= slides.length) {
                // סיום העיבוד
                hideLoadingMessage();
                alert('הייצוא הושלם בהצלחה. התמונות הורדו לתיקיית ההורדות שלך.');
                return;
            }
            
            // רנדור השקף הנוכחי
            renderPreviewSlide(slides[processedSlides]);
            
            // המרת קנבס לתמונה באמצעות html2canvas
            setTimeout(() => {
                const previewCanvas = document.querySelector('.preview-canvas');
                if (previewCanvas) {
                    html2canvas(previewCanvas).then(canvas => {
                        // יצירת לינק להורדה
                        const link = document.createElement('a');
                        link.download = `slide-${processedSlides + 1}.png`;
                        link.href = canvas.toDataURL('image/png');
                        
                        // לחיצה על הלינק להורדה
                        link.click();
                        
                        // מעבר לשקף הבא
                        processedSlides++;
                        processNextSlide();
                    });
                }
            }, 500);
        }
        
        // התחלת העיבוד
        processNextSlide();
    }
    
    /**
     * ייצוא כסרטון
     */
    function exportAsVideo() {
        // קבלת כל השקפים בפרויקט
        const slides = ProjectManager.getAllSlides();
        if (!slides || slides.length === 0) {
            alert('אין שקפים בפרויקט לייצוא.');
            return;
        }
        
        // הצגת מידע למשתמש לגבי ייצוא וידאו
        alert('פונקציית ייצוא הווידאו דורשת התקנה של מודול נוסף. בינתיים, ניתן לייצא כתמונות ולהשתמש בתוכנה חיצונית ליצירת וידאו.');
    }
    
    /**
     * שמירת פרויקט
     */
    function saveProject() {
        const success = ProjectManager.saveProject();
        
        if (success) {
            alert('הפרויקט נשמר בהצלחה.');
        } else {
            alert('אירעה שגיאה בשמירת הפרויקט.');
        }
    }
    
    /**
     * ביטול כפתורי ייצוא
     */
    function disableExportButtons() {
        const exportButtons = document.querySelectorAll('#export-image-btn, #export-video-btn');
        exportButtons.forEach(button => {
            button.disabled = true;
        });
    }
    
    /**
     * הצגת הודעת טעינה
     * @param {string} message תוכן ההודעה
     */
    function showLoadingMessage(message) {
        let loadingElement = document.querySelector('.loading-message');
        
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.className = 'loading-message';
            document.body.appendChild(loadingElement);
        }
        
        loadingElement.innerHTML = `
            <div class="loading-spinner"></div>
            <p>${message}</p>
        `;
        
        loadingElement.style.display = 'flex';
    }
    
    /**
     * הסתרת הודעת טעינה
     */
    function hideLoadingMessage() {
        const loadingElement = document.querySelector('.loading-message');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
    
    // ממשק ציבורי של המודול
    return {
        init: init,
        exportAsImages: exportAsImages,
        exportAsVideo: exportAsVideo,
        saveProject: saveProject
    };
})();
