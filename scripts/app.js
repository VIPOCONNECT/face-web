/**
 * app.js - מודול ראשי של המערכת
 * מאתחל את המערכת ומתאם בין כל המודולים השונים
 */

const VideoCreatorApp = (function() {
    // משתנים פנימיים
    let isInitialized = false;
    
    /**
     * אתחול המערכת
     */
    function init() {
        if (isInitialized) return;
        
        // אתחול אירועים במסך פתיחה
        initSplashEvents();
        
        // אתחול אירועי מודאל
        initModalEvents();
        
        // אתחול אירועי טעינה ראשונית
        window.addEventListener('load', function() {
            // בדיקה אם יש פרויקטים קיימים
            checkExistingProjects();
            
            // הוספת קלאס לסימון שהמערכת מוכנה
            document.body.classList.add('app-ready');
        });
        
        isInitialized = true;
        console.log('VideoCreator initialized');
    }
    
    /**
     * אתחול אירועים במסך פתיחה
     */
    function initSplashEvents() {
        // אירוע לחיצה על כפתור פרויקט חדש
        document.getElementById('new-project-btn').addEventListener('click', function() {
            showTemplateSelection();
        });
        
        // אירוע לחיצה על כפתור טעינת פרויקט קיים
        document.getElementById('load-project-btn').addEventListener('click', function() {
            showProjectsList();
        });
    }
    
    /**
     * אתחול אירועי מודאל
     */
    function initModalEvents() {
        // סגירת מודאל בלחיצה על כפתור סגירה או מחוץ למודאל
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-close') || 
                e.target.classList.contains('modal-container')) {
                closeModal();
            }
        });
        
        // סגירת מודאל בלחיצה על Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    /**
     * בדיקה אם יש פרויקטים קיימים
     */
    function checkExistingProjects() {
        if (!StorageManager.isAvailable()) {
            console.warn('Local storage is not available');
            return;
        }
        
        const projects = StorageManager.getProjectList();
        const loadProjectBtn = document.getElementById('load-project-btn');
        
        // הצגה או הסתרה של כפתור טעינת פרויקט
        if (projects && projects.length > 0) {
            loadProjectBtn.style.display = 'block';
        } else {
            loadProjectBtn.style.display = 'none';
        }
    }
    
    /**
     * הצגת מודאל בחירת תבנית
     */
    function showTemplateSelection() {
        const templates = TemplatesManager.getAllTemplates();
        
        // יצירת תוכן המודאל
        const modalContent = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">בחירת תבנית</h3>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="templates-grid">
                        ${templates.map(template => `
                            <div class="template-card" data-template-id="${template.id}">
                                <div class="template-preview">
                                    <img src="${template.thumbnail || 'assets/templates/default.jpg'}" alt="${template.name}">
                                    <div class="template-overlay">
                                        <button class="btn btn-light">בחר</button>
                                    </div>
                                </div>
                                <h3 class="template-title">${template.name}</h3>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-close">ביטול</button>
                </div>
            </div>
        `;
        
        // הצגת המודאל
        openModal(modalContent);
        
        // הוספת אירועי לחיצה על תבניות
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', function() {
                const templateId = this.dataset.templateId;
                createProjectFromTemplate(templateId);
                closeModal();
            });
        });
    }
    
    /**
     * יצירת פרויקט חדש מתבנית
     * @param {string} templateId מזהה התבנית
     */
    function createProjectFromTemplate(templateId) {
        // יצירת שם ברירת מחדל לפרויקט
        const defaultName = 'פרויקט חדש';
        
        // יצירת פרויקט חדש מהתבנית
        const project = TemplatesManager.createProjectFromTemplate(templateId, defaultName);
        
        if (project) {
            // מעבר למערכת השלבים
            if (typeof StepsManager !== 'undefined') {
                StepsManager.openStepsView();
            } else {
                console.error('StepsManager is not defined');
            }
        } else {
            alert('אירעה שגיאה ביצירת הפרויקט.');
        }
    }
    
    /**
     * הצגת רשימת פרויקטים קיימים
     */
    function showProjectsList() {
        const projects = StorageManager.getProjectList();
        
        if (!projects || projects.length === 0) {
            alert('אין פרויקטים שמורים.');
            return;
        }
        
        // מיון פרויקטים לפי תאריך עדכון אחרון (מהחדש לישן)
        projects.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        // יצירת תוכן המודאל
        const modalContent = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">פרויקטים שמורים</h3>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="projects-list">
                        ${projects.map(project => `
                            <div class="project-item" data-project-id="${project.id}">
                                <div class="project-info">
                                    <h4 class="project-name">${project.name}</h4>
                                    <p class="project-date">עודכן: ${formatDate(project.lastModified)}</p>
                                    <p class="project-slides">מספר שקפים: ${project.slidesCount}</p>
                                </div>
                                <div class="project-actions">
                                    <button class="btn btn-primary btn-load-project" data-project-id="${project.id}">טען</button>
                                    <button class="btn btn-outline btn-delete-project" data-project-id="${project.id}">מחק</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-close">סגור</button>
                </div>
            </div>
        `;
        
        // הצגת המודאל
        openModal(modalContent);
        
        // הוספת אירועי לחיצה על כפתורי פעולה
        document.querySelectorAll('.btn-load-project').forEach(btn => {
            btn.addEventListener('click', function() {
                const projectId = this.dataset.projectId;
                loadProject(projectId);
                closeModal();
            });
        });
        
        document.querySelectorAll('.btn-delete-project').forEach(btn => {
            btn.addEventListener('click', function() {
                const projectId = this.dataset.projectId;
                if (confirm('האם אתה בטוח שברצונך למחוק את הפרויקט?')) {
                    deleteProject(projectId);
                    this.closest('.project-item').remove();
                    
                    // אם אין יותר פרויקטים, סגור את המודאל
                    if (document.querySelectorAll('.project-item').length === 0) {
                        closeModal();
                        checkExistingProjects(); // עדכון כפתורים במסך פתיחה
                    }
                }
            });
        });
    }
    
    /**
     * טעינת פרויקט קיים
     * @param {string} projectId מזהה הפרויקט
     */
    function loadProject(projectId) {
        const project = ProjectManager.loadProject(projectId);
        
        if (project) {
            // מעבר למערכת השלבים
            if (typeof StepsManager !== 'undefined') {
                StepsManager.openStepsView();
            } else {
                console.error('StepsManager is not defined');
            }
        } else {
            alert('אירעה שגיאה בטעינת הפרויקט.');
        }
    }
    
    /**
     * מחיקת פרויקט
     * @param {string} projectId מזהה הפרויקט
     * @returns {boolean} האם המחיקה הצליחה
     */
    function deleteProject(projectId) {
        return StorageManager.deleteProject(projectId);
    }
    
    /**
     * פתיחת מודאל
     * @param {string} content תוכן HTML של המודאל
     */
    function openModal(content) {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = content;
        modalContainer.classList.add('active');
        document.body.classList.add('modal-open');
    }
    
    /**
     * סגירת מודאל
     */
    function closeModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
    
    /**
     * פורמט תאריך לתצוגה נוחה
     * @param {string} dateString מחרוזת תאריך
     * @returns {string} תאריך מפורמט
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // ממשק ציבורי של המודול
    return {
        init: init,
        openModal: openModal,
        closeModal: closeModal
    };
})();

// אתחול המערכת כאשר ה-DOM נטען
document.addEventListener('DOMContentLoaded', function() {
    VideoCreatorApp.init();
});
