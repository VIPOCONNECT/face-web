/**
 * project.js - מודול ניהול פרויקטים
 * אחראי על יצירה, עריכה וניהול של פרויקטים ושקפים
 */

const ProjectManager = (function() {
    // מבנה ברירת מחדל לפרויקט חדש
    const DEFAULT_PROJECT = {
        id: null,
        name: 'פרויקט חדש',
        created: null,
        lastModified: null,
        settings: {
            theme: 'default',
            aspectRatio: '16:9',
            direction: 'rtl'
        },
        slides: []
    };
    
    // מבנה ברירת מחדל לשקף חדש
    const DEFAULT_SLIDE = {
        id: null,
        background: {
            type: 'color',
            value: '#ffffff'
        },
        elements: [],
        transition: {
            type: 'fade',
            duration: 0.7
        }
    };
    
    // סוגי אלמנטים אפשריים
    const ELEMENT_TYPES = {
        TEXT: {
            type: 'text',
            content: 'טקסט חדש',
            style: {
                fontSize: { value: 24, unit: 'px' },
                fontFamily: 'Assistant',
                fontWeight: 'normal',
                color: '#000000',
                textAlign: 'center'
            },
            position: { x: 50, y: 50 },
            size: { 
                width: { value: 'auto', unit: '' },
                height: { value: 'auto', unit: '' }
            },
            animation: {
                type: 'none',
                duration: 1,
                delay: 0
            }
        },
        IMAGE: {
            type: 'image',
            content: '',
            position: { x: 50, y: 50 },
            size: { 
                width: { value: 200, unit: 'px' },
                height: { value: 150, unit: 'px' }
            },
            animation: {
                type: 'none',
                duration: 1,
                delay: 0
            }
        }
    };
    
    // משתנים פנימיים
    let currentProject = null;
    let currentSlideIndex = 0;
    
    /**
     * יצירת מזהה ייחודי
     * @returns {string} מזהה ייחודי
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    }
    
    /**
     * יצירת העתק עמוק של אובייקט
     * @param {Object} obj האובייקט להעתקה
     * @returns {Object} העתק עמוק של האובייקט
     */
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    
    /**
     * שמירת הפרויקט הנוכחי
     * @returns {boolean} האם השמירה הצליחה
     */
    function saveCurrentProject() {
        if (!currentProject) return false;
        return StorageManager.saveProject(currentProject);
    }
    
    // ממשק ציבורי של המודול
    return {
        /**
         * יצירת פרויקט חדש
         * @param {string} name שם הפרויקט (אופציונלי)
         * @returns {Object} הפרויקט החדש
         */
        createProject: function(name = 'פרויקט חדש') {
            const timestamp = new Date().toISOString();
            
            currentProject = deepClone(DEFAULT_PROJECT);
            currentProject.id = generateId();
            currentProject.name = name;
            currentProject.created = timestamp;
            currentProject.lastModified = timestamp;
            
            // יצירת שקף ראשון
            this.addSlide();
            
            // שמירה ראשונית
            saveCurrentProject();
            
            return currentProject;
        },
        
        /**
         * טעינת פרויקט קיים
         * @param {string} projectId מזהה הפרויקט לטעינה
         * @returns {Object|null} הפרויקט שנטען או null אם נכשל
         */
        loadProject: function(projectId) {
            const project = StorageManager.loadProject(projectId);
            
            if (project) {
                currentProject = project;
                currentSlideIndex = 0;
                return currentProject;
            }
            
            return null;
        },
        
        /**
         * קבלת הפרויקט הנוכחי
         * @returns {Object|null} הפרויקט הנוכחי או null אם אין
         */
        getCurrentProject: function() {
            return currentProject;
        },
        
        /**
         * הוספת שקף חדש
         * @param {Object} properties מאפיינים לאתחול השקף (אופציונלי)
         * @returns {Object} השקף החדש
         */
        addSlide: function(properties = {}) {
            if (!currentProject) return null;
            
            // יצירת שקף חדש
            const newSlide = deepClone(DEFAULT_SLIDE);
            newSlide.id = generateId();
            
            // החלת מאפיינים מותאמים אם יש
            Object.assign(newSlide, properties);
            
            // הוספה לפרויקט
            currentProject.slides.push(newSlide);
            currentProject.lastModified = new Date().toISOString();
            
            // שמירה אוטומטית
            saveCurrentProject();
            
            // הגדרת השקף החדש כנוכחי
            currentSlideIndex = currentProject.slides.length - 1;
            
            return newSlide;
        },
        
        /**
         * מחיקת שקף
         * @param {string} slideId מזהה השקף למחיקה
         * @returns {boolean} האם המחיקה הצליחה
         */
        deleteSlide: function(slideId) {
            if (!currentProject || !currentProject.slides.length) return false;
            
            const slideIndex = currentProject.slides.findIndex(s => s.id === slideId);
            
            if (slideIndex === -1) return false;
            
            // מחיקת השקף
            currentProject.slides.splice(slideIndex, 1);
            currentProject.lastModified = new Date().toISOString();
            
            // עדכון אינדקס השקף הנוכחי
            if (currentSlideIndex >= currentProject.slides.length) {
                currentSlideIndex = Math.max(0, currentProject.slides.length - 1);
            }
            
            // שמירה אוטומטית
            saveCurrentProject();
            
            return true;
        },
        
        /**
         * בחירת שקף נוכחי
         * @param {number|string} slideIndexOrId אינדקס או מזהה השקף
         * @returns {Object|null} השקף שנבחר או null אם נכשל
         */
        selectSlide: function(slideIndexOrId) {
            if (!currentProject || !currentProject.slides.length) return null;
            
            // בדיקה אם התקבל מזהה או אינדקס
            if (typeof slideIndexOrId === 'string') {
                const slideIndex = currentProject.slides.findIndex(s => s.id === slideIndexOrId);
                if (slideIndex === -1) return null;
                currentSlideIndex = slideIndex;
            } else if (typeof slideIndexOrId === 'number') {
                if (slideIndexOrId < 0 || slideIndexOrId >= currentProject.slides.length) return null;
                currentSlideIndex = slideIndexOrId;
            } else {
                return null;
            }
            
            return this.getCurrentSlide();
        },
        
        /**
         * קבלת השקף הנוכחי
         * @returns {Object|null} השקף הנוכחי או null אם אין
         */
        getCurrentSlide: function() {
            if (!currentProject || !currentProject.slides.length) return null;
            return currentProject.slides[currentSlideIndex];
        },
        
        /**
         * קבלת אינדקס השקף הנוכחי
         * @returns {number} אינדקס השקף הנוכחי
         */
        getCurrentSlideIndex: function() {
            return currentSlideIndex;
        },
        
        /**
         * קבלת כל השקפים בפרויקט הנוכחי
         * @returns {Array|null} מערך של שקפים או null אם אין פרויקט
         */
        getAllSlides: function() {
            if (!currentProject) return null;
            return currentProject.slides;
        },
        
        /**
         * שינוי סדר השקפים
         * @param {number} fromIndex אינדקס מקור
         * @param {number} toIndex אינדקס יעד
         * @returns {boolean} האם השינוי הצליח
         */
        reorderSlides: function(fromIndex, toIndex) {
            if (!currentProject || !currentProject.slides.length) return false;
            
            // בדיקת תקינות האינדקסים
            if (fromIndex < 0 || fromIndex >= currentProject.slides.length ||
                toIndex < 0 || toIndex >= currentProject.slides.length) {
                return false;
            }
            
            // שמירת השקף הנוכחי
            const currentSlideId = currentProject.slides[currentSlideIndex].id;
            
            // ביצוע הזזה
            const [removedSlide] = currentProject.slides.splice(fromIndex, 1);
            currentProject.slides.splice(toIndex, 0, removedSlide);
            
            // עדכון אינדקס השקף הנוכחי
            currentSlideIndex = currentProject.slides.findIndex(s => s.id === currentSlideId);
            
            // שמירה אוטומטית
            currentProject.lastModified = new Date().toISOString();
            saveCurrentProject();
            
            return true;
        },
        
        /**
         * הוספת אלמנט לשקף הנוכחי
         * @param {string} type סוג האלמנט ('TEXT', 'IMAGE')
         * @param {Object} properties מאפיינים מותאמים (אופציונלי)
         * @returns {Object|null} האלמנט החדש או null אם נכשל
         */
        addElement: function(type, properties = {}) {
            const currentSlide = this.getCurrentSlide();
            if (!currentSlide) return null;
            
            // בדיקת סוג אלמנט תקין
            const templateType = type.toUpperCase();
            if (!ELEMENT_TYPES[templateType]) return null;
            
            // יצירת אלמנט חדש
            const newElement = deepClone(ELEMENT_TYPES[templateType]);
            newElement.id = generateId();
            
            // החלת מאפיינים מותאמים
            Object.keys(properties).forEach(key => {
                if (key === 'style' || key === 'position' || key === 'size' || key === 'animation') {
                    Object.assign(newElement[key], properties[key]);
                } else {
                    newElement[key] = properties[key];
                }
            });
            
            // הוספה לשקף
            currentSlide.elements.push(newElement);
            
            // שמירה אוטומטית
            currentProject.lastModified = new Date().toISOString();
            saveCurrentProject();
            
            return newElement;
        },
        
        /**
         * מחיקת אלמנט מהשקף הנוכחי
         * @param {string} elementId מזהה האלמנט למחיקה
         * @returns {boolean} האם המחיקה הצליחה
         */
        deleteElement: function(elementId) {
            const currentSlide = this.getCurrentSlide();
            if (!currentSlide) return false;
            
            const elementIndex = currentSlide.elements.findIndex(e => e.id === elementId);
            if (elementIndex === -1) return false;
            
            // מחיקת האלמנט
            currentSlide.elements.splice(elementIndex, 1);
            
            // שמירה אוטומטית
            currentProject.lastModified = new Date().toISOString();
            saveCurrentProject();
            
            return true;
        },
        
        /**
         * עדכון מאפייני אלמנט
         * @param {string} elementId מזהה האלמנט לעדכון
         * @param {Object} properties מאפיינים לעדכון
         * @returns {Object|null} האלמנט המעודכן או null אם נכשל
         */
        updateElement: function(elementId, properties) {
            const currentSlide = this.getCurrentSlide();
            if (!currentSlide) return null;
            
            const element = currentSlide.elements.find(e => e.id === elementId);
            if (!element) return null;
            
            // עדכון מאפיינים
            Object.keys(properties).forEach(key => {
                if (key === 'style' || key === 'position' || key === 'size' || key === 'animation') {
                    Object.assign(element[key], properties[key]);
                } else {
                    element[key] = properties[key];
                }
            });
            
            // שמירה אוטומטית
            currentProject.lastModified = new Date().toISOString();
            saveCurrentProject();
            
            return element;
        },
        
        /**
         * עדכון רקע של השקף הנוכחי
         * @param {Object} background מאפייני הרקע
         * @returns {Object|null} השקף המעודכן או null אם נכשל
         */
        updateSlideBackground: function(background) {
            const currentSlide = this.getCurrentSlide();
            if (!currentSlide) return null;
            
            // עדכון רקע
            Object.assign(currentSlide.background, background);
            
            // שמירה אוטומטית
            currentProject.lastModified = new Date().toISOString();
            saveCurrentProject();
            
            return currentSlide;
        },
        
        /**
         * עדכון מעבר של השקף הנוכחי
         * @param {Object} transition מאפייני המעבר
         * @returns {Object|null} השקף המעודכן או null אם נכשל
         */
        updateSlideTransition: function(transition) {
            const currentSlide = this.getCurrentSlide();
            if (!currentSlide) return null;
            
            // עדכון מעבר
            Object.assign(currentSlide.transition, transition);
            
            // שמירה אוטומטית
            currentProject.lastModified = new Date().toISOString();
            saveCurrentProject();
            
            return currentSlide;
        },
        
        /**
         * עדכון הגדרות הפרויקט
         * @param {Object} settings הגדרות חדשות
         * @returns {Object|null} הפרויקט המעודכן או null אם נכשל
         */
        updateProjectSettings: function(settings) {
            if (!currentProject) return null;
            
            // עדכון הגדרות
            Object.assign(currentProject.settings, settings);
            
            // שמירה אוטומטית
            currentProject.lastModified = new Date().toISOString();
            saveCurrentProject();
            
            return currentProject;
        },
        
        /**
         * שכפול שקף נוכחי
         * @returns {Object|null} השקף החדש או null אם נכשל
         */
        duplicateCurrentSlide: function() {
            const currentSlide = this.getCurrentSlide();
            if (!currentSlide) return null;
            
            // יצירת העתק עמוק של השקף
            const slideCopy = deepClone(currentSlide);
            slideCopy.id = generateId();
            
            // יצירת מזהים חדשים לכל האלמנטים
            slideCopy.elements.forEach(element => {
                element.id = generateId();
            });
            
            // הוספה לפרויקט אחרי השקף הנוכחי
            currentProject.slides.splice(currentSlideIndex + 1, 0, slideCopy);
            
            // עדכון אינדקס לשקף החדש
            currentSlideIndex += 1;
            
            // שמירה אוטומטית
            currentProject.lastModified = new Date().toISOString();
            saveCurrentProject();
            
            return slideCopy;
        },
        
        /**
         * שמירת הפרויקט הנוכחי
         * @returns {boolean} האם השמירה הצליחה
         */
        saveProject: saveCurrentProject,
        
        /**
         * קבלת מבנה ברירת המחדל לאלמנט
         * @param {string} type סוג האלמנט
         * @returns {Object|null} מבנה ברירת המחדל או null אם הסוג לא תקין
         */
        getDefaultElement: function(type) {
            const templateType = type.toUpperCase();
            return ELEMENT_TYPES[templateType] ? deepClone(ELEMENT_TYPES[templateType]) : null;
        }
    };
})();
