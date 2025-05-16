/**
 * slide-manager.js - מודול ניהול שקפים
 * אחראי על עריכה, יצירה ומחיקה של שקפים בשלב השני של המערכת
 */

const SlideManager = (function() {
    // משתנים פנימיים
    let isInitialized = false;
    let selectedSlideId = null;
    
    /**
     * אתחול מודול ניהול השקפים
     */
    function init() {
        if (isInitialized) return;
        
        // טעינת שקפים לממשק
        loadSlides();
        
        // הוספת אירועי ניהול שקפים
        addSlideEvents();
        
        // אירוע האזנה לשינויים בפרויקט
        document.addEventListener('project:updated', loadSlides);
        
        isInitialized = true;
    }
    
    /**
     * טעינת שקפים לממשק
     */
    function loadSlides() {
        const slidesList = document.querySelector('.slides-list');
        if (!slidesList) {
            // יצירת מיכל שקפים אם לא קיים
            createSlidesContainer();
            return;
        }
        
        // ניקוי תוכן קיים
        slidesList.innerHTML = '';
        
        // קבלת כל השקפים בפרויקט
        const slides = ProjectManager.getAllSlides();
        if (!slides || slides.length === 0) {
            slidesList.innerHTML = '<div class="empty-state">אין שקפים בפרויקט. לחץ על "הוסף שקף" כדי להתחיל.</div>';
            return;
        }
        
        // יצירת תצוגה מוקטנת לכל שקף
        slides.forEach((slide, index) => {
            const slideThumbnail = createSlideThumbnail(slide, index);
            slidesList.appendChild(slideThumbnail);
        });
        
        // בחירת השקף הראשון אם אין שקף מסומן
        if (!selectedSlideId && slides.length > 0) {
            selectSlide(slides[0].id);
        } else if (selectedSlideId) {
            // נסיון לבחור את השקף הנוכחי שוב (אם הוא עדיין קיים)
            const slideExists = slides.some(slide => slide.id === selectedSlideId);
            if (slideExists) {
                selectSlide(selectedSlideId);
            } else if (slides.length > 0) {
                selectSlide(slides[0].id);
            }
        }
    }
    
    /**
     * יצירת מיכל שקפים
     */
    function createSlidesContainer() {
        const slidesPanel = document.querySelector('.slides-panel');
        if (!slidesPanel) return;
        
        // ניקוי תוכן קיים
        slidesPanel.innerHTML = '';
        
        // יצירת כפתור הוספת שקף
        const addSlideBtn = document.createElement('button');
        addSlideBtn.className = 'add-slide-btn';
        addSlideBtn.innerHTML = '<i class="fas fa-plus"></i> הוסף שקף';
        addSlideBtn.addEventListener('click', addNewSlide);
        
        // יצירת מיכל רשימת שקפים
        const slidesList = document.createElement('div');
        slidesList.className = 'slides-list';
        
        // הוספה לפאנל השקפים
        slidesPanel.appendChild(addSlideBtn);
        slidesPanel.appendChild(slidesList);
        
        // טעינת השקפים
        loadSlides();
    }
    
    /**
     * יצירת תצוגה מוקטנת לשקף
     * @param {Object} slide אובייקט השקף
     * @param {number} index אינדקס השקף
     * @returns {HTMLElement} אלמנט התצוגה המוקטנת
     */
    function createSlideThumbnail(slide, index) {
        const slideThumbnail = document.createElement('div');
        slideThumbnail.className = 'slide-thumbnail';
        slideThumbnail.dataset.slideId = slide.id;
        
        // הוספת מספר שקף
        const slideNumber = document.createElement('div');
        slideNumber.className = 'slide-number';
        slideNumber.textContent = index + 1;
        
        // יצירת תצוגה מוקטנת של השקף
        const thumbnailPreview = document.createElement('div');
        thumbnailPreview.className = 'thumbnail-preview';
        
        // החלת רקע
        if (slide.background.type === 'color') {
            thumbnailPreview.style.backgroundColor = slide.background.value;
        } else if (slide.background.type === 'image') {
            thumbnailPreview.style.backgroundImage = `url(${slide.background.value})`;
            thumbnailPreview.style.backgroundSize = 'cover';
            thumbnailPreview.style.backgroundPosition = 'center';
        }
        
        // הוספת אייקון למחיקת שקף
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-slide-btn';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.title = 'מחק שקף';
        deleteButton.addEventListener('click', function(e) {
            e.stopPropagation(); // מניעת בחירת שקף בעת לחיצה על כפתור מחיקה
            deleteSlide(slide.id);
        });
        
        // הוספת כל האלמנטים
        slideThumbnail.appendChild(slideNumber);
        slideThumbnail.appendChild(thumbnailPreview);
        slideThumbnail.appendChild(deleteButton);
        
        // הוספת אירוע לחיצה לבחירת שקף
        slideThumbnail.addEventListener('click', function() {
            selectSlide(slide.id);
        });
        
        // סימון השקף הנוכחי אם הוא נבחר
        if (slide.id === selectedSlideId) {
            slideThumbnail.classList.add('active');
        }
        
        return slideThumbnail;
    }
    
    /**
     * בחירת שקף
     * @param {string} slideId מזהה השקף
     */
    function selectSlide(slideId) {
        // ביטול בחירת שקף קודם
        document.querySelectorAll('.slide-thumbnail').forEach(thumbnail => {
            thumbnail.classList.remove('active');
        });
        
        // סימון השקף החדש
        const selectedThumbnail = document.querySelector(`.slide-thumbnail[data-slide-id="${slideId}"]`);
        if (selectedThumbnail) {
            selectedThumbnail.classList.add('active');
        }
        
        // שמירת מזהה השקף הנבחר
        selectedSlideId = slideId;
        
        // עדכון בחירת שקף במנהל הפרויקט
        ProjectManager.selectSlide(slideId);
        
        // רנדור השקף הנבחר
        renderSelectedSlide();
    }
    
    /**
     * רנדור השקף הנבחר
     */
    function renderSelectedSlide() {
        const slidePreview = document.querySelector('.slide-preview');
        if (!slidePreview) return;
        
        // קבלת השקף הנוכחי
        const currentSlide = ProjectManager.getCurrentSlide();
        if (!currentSlide) {
            slidePreview.innerHTML = '<div class="empty-state">אין שקף נבחר</div>';
            return;
        }
        
        // ניקוי תוכן קיים
        slidePreview.innerHTML = '';
        
        // יצירת אלמנט קנבס שקף
        const slideCanvas = document.createElement('div');
        slideCanvas.className = 'slide-canvas';
        slideCanvas.dataset.slideId = currentSlide.id;
        
        // החלת רקע
        if (currentSlide.background.type === 'color') {
            slideCanvas.style.backgroundColor = currentSlide.background.value;
        } else if (currentSlide.background.type === 'image') {
            slideCanvas.style.backgroundImage = `url(${currentSlide.background.value})`;
            slideCanvas.style.backgroundSize = 'cover';
            slideCanvas.style.backgroundPosition = 'center';
        }
        
        // הוספת אלמנטים לשקף
        currentSlide.elements.forEach(element => {
            const elementDOM = createElementDOM(element);
            slideCanvas.appendChild(elementDOM);
        });
        
        // הוספת הקנבס לתצוגה
        slidePreview.appendChild(slideCanvas);
        
        // עדכון כלי עריכת שקף
        updateSlideTools();
    }
    
    /**
     * יצירת אלמנט DOM לאלמנט שקף
     * @param {Object} element אובייקט האלמנט
     * @returns {HTMLElement} אלמנט ה-DOM
     */
    function createElementDOM(element) {
        const elementDOM = document.createElement('div');
        elementDOM.className = `slide-element ${element.type}-element`;
        elementDOM.dataset.elementId = element.id;
        
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
     * עדכון כלי עריכת שקף
     */
    function updateSlideTools() {
        const slideTools = document.querySelector('.slide-tools');
        if (!slideTools) return;
        
        // קבלת השקף הנוכחי
        const currentSlide = ProjectManager.getCurrentSlide();
        if (!currentSlide) return;
        
        // ניקוי תוכן קיים
        slideTools.innerHTML = '';
        
        // יצירת כותרת
        const toolsTitle = document.createElement('h3');
        toolsTitle.className = 'tools-title';
        toolsTitle.textContent = 'עריכת שקף';
        
        // יצירת כלי עריכת רקע
        const backgroundSection = document.createElement('div');
        backgroundSection.className = 'tool-section';
        
        const backgroundTitle = document.createElement('h4');
        backgroundTitle.className = 'tool-title';
        backgroundTitle.textContent = 'רקע';
        
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.className = 'color-picker';
        colorPicker.value = currentSlide.background.type === 'color' ? currentSlide.background.value : '#ffffff';
        colorPicker.addEventListener('change', function() {
            updateSlideBackground('color', this.value);
        });
        
        const imageUploadLabel = document.createElement('label');
        imageUploadLabel.className = 'tool-button';
        imageUploadLabel.innerHTML = '<i class="fas fa-image"></i>';
        imageUploadLabel.title = 'הוסף תמונת רקע';
        
        const imageUploadInput = document.createElement('input');
        imageUploadInput.type = 'file';
        imageUploadInput.accept = 'image/*';
        imageUploadInput.style.display = 'none';
        imageUploadInput.addEventListener('change', function() {
            handleBackgroundImageUpload(this);
        });
        
        imageUploadLabel.appendChild(imageUploadInput);
        
        backgroundSection.appendChild(backgroundTitle);
        backgroundSection.appendChild(colorPicker);
        backgroundSection.appendChild(imageUploadLabel);
        
        // יצירת כלי הוספת אלמנטים
        const elementsSection = document.createElement('div');
        elementsSection.className = 'tool-section';
        
        const elementsTitle = document.createElement('h4');
        elementsTitle.className = 'tool-title';
        elementsTitle.textContent = 'הוספת אלמנטים';
        
        const elementsTools = document.createElement('div');
        elementsTools.className = 'tools-row';
        
        const addTextButton = document.createElement('button');
        addTextButton.className = 'tool-button';
        addTextButton.innerHTML = '<i class="fas fa-font"></i>';
        addTextButton.title = 'הוסף טקסט';
        addTextButton.addEventListener('click', addTextElement);
        
        const addImageButton = document.createElement('button');
        addImageButton.className = 'tool-button';
        addImageButton.innerHTML = '<i class="fas fa-image"></i>';
        addImageButton.title = 'הוסף תמונה';
        addImageButton.addEventListener('click', openImageUploadDialog);
        
        elementsTools.appendChild(addTextButton);
        elementsTools.appendChild(addImageButton);
        
        elementsSection.appendChild(elementsTitle);
        elementsSection.appendChild(elementsTools);
        
        // יצירת כפתורי פעולות שקף
        const actionsSection = document.createElement('div');
        actionsSection.className = 'tool-section';
        
        const actionsTitle = document.createElement('h4');
        actionsTitle.className = 'tool-title';
        actionsTitle.textContent = 'פעולות';
        
        const actionsTools = document.createElement('div');
        actionsTools.className = 'tools-row';
        
        const duplicateButton = document.createElement('button');
        duplicateButton.className = 'tool-button';
        duplicateButton.innerHTML = '<i class="fas fa-copy"></i>';
        duplicateButton.title = 'שכפל שקף';
        duplicateButton.addEventListener('click', duplicateSlide);
        
        actionsTools.appendChild(duplicateButton);
        
        actionsSection.appendChild(actionsTitle);
        actionsSection.appendChild(actionsTools);
        
        // הוספת כל הסקציות לכלים
        slideTools.appendChild(toolsTitle);
        slideTools.appendChild(backgroundSection);
        slideTools.appendChild(elementsSection);
        slideTools.appendChild(actionsSection);
    }
    
    /**
     * הוספת אירועי ניהול שקפים
     */
    function addSlideEvents() {
        // אירוע לחיצה על כפתור הוספת שקף
        const addSlideBtn = document.querySelector('.add-slide-btn');
        if (addSlideBtn) {
            addSlideBtn.addEventListener('click', addNewSlide);
        }
        
        // אירוע לחיצה על כפתור הבא בשלב השני
        const nextButton = document.querySelector('.btn-next');
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                if (StepsManager.getCurrentStep() === 2) {
                    // שמירת פרויקט לפני מעבר לשלב הבא
                    ProjectManager.saveProject();
                }
            });
        }
        
        // אירוע לטעינת תמונת רקע
        document.addEventListener('slide:background-image-loaded', function(e) {
            if (e.detail && e.detail.image) {
                updateSlideBackground('image', e.detail.image);
            }
        });
    }
    
    /**
     * הוספת שקף חדש
     */
    function addNewSlide() {
        // יצירת שקף חדש
        const newSlide = ProjectManager.addSlide();
        
        if (newSlide) {
            // טעינה מחדש של רשימת השקפים
            loadSlides();
            
            // בחירת השקף החדש
            selectSlide(newSlide.id);
        } else {
            console.error('Failed to add new slide');
        }
    }
    
    /**
     * מחיקת שקף
     * @param {string} slideId מזהה השקף למחיקה
     */
    function deleteSlide(slideId) {
        // בדיקה אם יש לפחות שקף אחד נוסף
        const slides = ProjectManager.getAllSlides();
        if (slides.length <= 1) {
            alert('לא ניתן למחוק את השקף האחרון בפרויקט.');
            return;
        }
        
        // אישור מחיקה
        if (confirm('האם אתה בטוח שברצונך למחוק את השקף?')) {
            // מחיקת השקף
            const success = ProjectManager.deleteSlide(slideId);
            
            if (success) {
                // טעינה מחדש של רשימת השקפים
                loadSlides();
            } else {
                console.error('Failed to delete slide:', slideId);
            }
        }
    }
    
    /**
     * שכפול שקף נוכחי
     */
    function duplicateSlide() {
        // שכפול השקף הנוכחי
        const newSlide = ProjectManager.duplicateCurrentSlide();
        
        if (newSlide) {
            // טעינה מחדש של רשימת השקפים
            loadSlides();
            
            // בחירת השקף החדש
            selectSlide(newSlide.id);
        } else {
            console.error('Failed to duplicate slide');
        }
    }
    
    /**
     * עדכון רקע שקף
     * @param {string} type סוג הרקע ('color', 'image')
     * @param {string} value ערך הרקע (קוד צבע או URL תמונה)
     */
    function updateSlideBackground(type, value) {
        // עדכון רקע השקף הנוכחי
        const updatedSlide = ProjectManager.updateSlideBackground({
            type: type,
            value: value
        });
        
        if (updatedSlide) {
            // רנדור מחדש של השקף
            renderSelectedSlide();
            
            // עדכון תצוגה מוקטנת
            updateSlideThumbnail(updatedSlide.id);
        } else {
            console.error('Failed to update slide background');
        }
    }
    
    /**
     * עדכון תצוגה מוקטנת של שקף
     * @param {string} slideId מזהה השקף
     */
    function updateSlideThumbnail(slideId) {
        // קבלת השקף
        const slides = ProjectManager.getAllSlides();
        const slideIndex = slides.findIndex(slide => slide.id === slideId);
        
        if (slideIndex === -1) return;
        
        // קבלת התצוגה המוקטנת
        const slideThumbnail = document.querySelector(`.slide-thumbnail[data-slide-id="${slideId}"]`);
        if (!slideThumbnail) return;
        
        // קבלת השקף
        const slide = slides[slideIndex];
        
        // עדכון תצוגה מוקטנת
        const thumbnailPreview = slideThumbnail.querySelector('.thumbnail-preview');
        if (thumbnailPreview) {
            // איפוס סגנונות
            thumbnailPreview.style.backgroundColor = '';
            thumbnailPreview.style.backgroundImage = '';
            
            // החלת רקע
            if (slide.background.type === 'color') {
                thumbnailPreview.style.backgroundColor = slide.background.value;
            } else if (slide.background.type === 'image') {
                thumbnailPreview.style.backgroundImage = `url(${slide.background.value})`;
                thumbnailPreview.style.backgroundSize = 'cover';
                thumbnailPreview.style.backgroundPosition = 'center';
            }
        }
    }
    
    /**
     * טיפול בהעלאת תמונת רקע
     * @param {HTMLInputElement} input אלמנט קלט קובץ
     */
    function handleBackgroundImageUpload(input) {
        if (!input.files || input.files.length === 0) return;
        
        const file = input.files[0];
        
        // בדיקה שהקובץ הוא תמונה
        if (!file.type.match('image.*')) {
            alert('יש לבחור קובץ תמונה בלבד.');
            return;
        }
        
        // בדיקת גודל הקובץ (מקסימום 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('גודל הקובץ חורג מהמגבלה (5MB).');
            return;
        }
        
        // קריאת הקובץ
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDataUrl = e.target.result;
            
            // הפעלת אירוע טעינת תמונת רקע
            document.dispatchEvent(new CustomEvent('slide:background-image-loaded', {
                detail: { image: imageDataUrl }
            }));
        };
        
        reader.readAsDataURL(file);
    }
    
    /**
     * פתיחת דיאלוג העלאת תמונה
     */
    function openImageUploadDialog() {
        // יצירת אלמנט קלט קובץ
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        // הוספת אירוע לטעינת קובץ
        fileInput.addEventListener('change', function() {
            if (!this.files || this.files.length === 0) return;
            
            const file = this.files[0];
            
            // בדיקה שהקובץ הוא תמונה
            if (!file.type.match('image.*')) {
                alert('יש לבחור קובץ תמונה בלבד.');
                return;
            }
            
            // בדיקת גודל הקובץ (מקסימום 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('גודל הקובץ חורג מהמגבלה (5MB).');
                return;
            }
            
            // קריאת הקובץ
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageDataUrl = e.target.result;
                
                // הוספת אלמנט תמונה
                addImageElement(imageDataUrl);
            };
            
            reader.readAsDataURL(file);
        });
        
        // הוספה לגוף המסמך והפעלה
        document.body.appendChild(fileInput);
        fileInput.click();
        
        // הסרת האלמנט לאחר השימוש
        setTimeout(() => {
            document.body.removeChild(fileInput);
        }, 1000);
    }
    
    /**
     * הוספת אלמנט טקסט
     */
    function addTextElement() {
        // הוספת אלמנט טקסט לשקף הנוכחי
        const newElement = ProjectManager.addElement('TEXT');
        
        if (newElement) {
            // רנדור מחדש של השקף
            renderSelectedSlide();
        } else {
            console.error('Failed to add text element');
        }
    }
    
    /**
     * הוספת אלמנט תמונה
     * @param {string} imageUrl כתובת התמונה
     */
    function addImageElement(imageUrl) {
        // הוספת אלמנט תמונה לשקף הנוכחי
        const newElement = ProjectManager.addElement('IMAGE', {
            content: imageUrl
        });
        
        if (newElement) {
            // רנדור מחדש של השקף
            renderSelectedSlide();
        } else {
            console.error('Failed to add image element');
        }
    }
    
    // ממשק ציבורי של המודול
    return {
        init: init,
        loadSlides: loadSlides,
        renderSelectedSlide: renderSelectedSlide,
        getCurrentSlideId: function() { return selectedSlideId; }
    };
})();
