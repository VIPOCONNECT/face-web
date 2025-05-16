/**
 * storage.js - מודול ניהול אחסון מקומי
 * אחראי על שמירה, טעינה ומחיקה של פרויקטים במכשיר המשתמש
 */

const StorageManager = (function() {
    // מפתח האחסון המקומי
    const STORAGE_KEY = 'video_creator_projects';
    
    /**
     * בדיקה אם האחסון המקומי זמין
     * @returns {boolean} האם האחסון המקומי זמין
     */
    function isStorageAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.error('אחסון מקומי אינו זמין:', e);
            return false;
        }
    }
    
    /**
     * קבלת כל הפרויקטים מהאחסון המקומי
     * @returns {Array} מערך של כל הפרויקטים
     */
    function getAllProjects() {
        if (!isStorageAvailable()) return [];
        
        try {
            const projectsJSON = localStorage.getItem(STORAGE_KEY);
            return projectsJSON ? JSON.parse(projectsJSON) : [];
        } catch (e) {
            console.error('שגיאה בטעינת פרויקטים:', e);
            return [];
        }
    }
    
    /**
     * שמירת כל הפרויקטים באחסון המקומי
     * @param {Array} projects מערך של פרויקטים לשמירה
     * @returns {boolean} האם השמירה הצליחה
     */
    function saveAllProjects(projects) {
        if (!isStorageAvailable()) return false;
        
        try {
            const projectsJSON = JSON.stringify(projects);
            localStorage.setItem(STORAGE_KEY, projectsJSON);
            return true;
        } catch (e) {
            console.error('שגיאה בשמירת פרויקטים:', e);
            return false;
        }
    }
    
    // ממשק ציבורי של המודול
    return {
        /**
         * שמירת פרויקט באחסון המקומי
         * @param {Object} project פרויקט לשמירה
         * @returns {boolean} האם השמירה הצליחה
         */
        saveProject: function(project) {
            if (!project || !project.id) {
                console.error('לא ניתן לשמור פרויקט ללא מזהה');
                return false;
            }
            
            const projects = getAllProjects();
            const existingIndex = projects.findIndex(p => p.id === project.id);
            
            if (existingIndex >= 0) {
                // עדכון פרויקט קיים
                projects[existingIndex] = project;
            } else {
                // הוספת פרויקט חדש
                projects.push(project);
            }
            
            // עדכון תאריך שינוי אחרון
            project.lastModified = new Date().toISOString();
            
            return saveAllProjects(projects);
        },
        
        /**
         * טעינת פרויקט מהאחסון המקומי
         * @param {string} projectId מזהה הפרויקט לטעינה
         * @returns {Object|null} הפרויקט שנטען או null אם לא נמצא
         */
        loadProject: function(projectId) {
            const projects = getAllProjects();
            return projects.find(p => p.id === projectId) || null;
        },
        
        /**
         * קבלת רשימת כל הפרויקטים המאוחסנים
         * @returns {Array} רשימת פרויקטים מקוצרת (ללא נתונים מלאים)
         */
        getProjectList: function() {
            const projects = getAllProjects();
            
            // החזרת רשימה מקוצרת ללא נתונים מלאים
            return projects.map(p => ({
                id: p.id,
                name: p.name,
                created: p.created,
                lastModified: p.lastModified,
                thumbnail: p.thumbnail || null,
                slidesCount: p.slides ? p.slides.length : 0
            }));
        },
        
        /**
         * מחיקת פרויקט מהאחסון המקומי
         * @param {string} projectId מזהה הפרויקט למחיקה
         * @returns {boolean} האם המחיקה הצליחה
         */
        deleteProject: function(projectId) {
            const projects = getAllProjects();
            const filteredProjects = projects.filter(p => p.id !== projectId);
            
            if (filteredProjects.length < projects.length) {
                return saveAllProjects(filteredProjects);
            }
            
            return false;
        },
        
        /**
         * בדיקה אם האחסון המקומי זמין
         * @returns {boolean} האם האחסון המקומי זמין
         */
        isAvailable: isStorageAvailable,
        
        /**
         * ייצוא פרויקט לקובץ JSON
         * @param {string} projectId מזהה הפרויקט לייצוא
         * @returns {string|null} תוכן ה-JSON של הפרויקט או null אם נכשל
         */
        exportProjectToJSON: function(projectId) {
            const project = this.loadProject(projectId);
            if (!project) return null;
            
            try {
                return JSON.stringify(project);
            } catch (e) {
                console.error('שגיאה בייצוא פרויקט:', e);
                return null;
            }
        },
        
        /**
         * ייבוא פרויקט מקובץ JSON
         * @param {string} jsonData תוכן ה-JSON של הפרויקט
         * @returns {boolean} האם הייבוא הצליח
         */
        importProjectFromJSON: function(jsonData) {
            try {
                const project = JSON.parse(jsonData);
                
                // וידוא שהמבנה תקין
                if (!project.id || !project.name || !Array.isArray(project.slides)) {
                    console.error('מבנה הפרויקט אינו תקין');
                    return false;
                }
                
                return this.saveProject(project);
            } catch (e) {
                console.error('שגיאה בייבוא פרויקט:', e);
                return false;
            }
        }
    };
})();
