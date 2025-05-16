/**
 * template-selector.js - מודול בחירת תבניות
 * אחראי על הצגת וטיפול בתבניות בשלב הראשון של המערכת
 */

const TemplateSelector = (function() {
    // משתנים פנימיים
    let selectedTemplate = null;
    let isInitialized = false;
    
    /**
     * אתחול מודול בחירת התבניות
     */
    function init() {
        if (isInitialized) return;
        
        // טעינת התבניות לממשק
        loadTemplates();
        
        // הוספת אירועי בחירת תבנית
        addTemplateEvents();
        
        isInitialized = true;
    }
    
    /**
     * טעינת התבניות לממשק
     */
    function loadTemplates() {
        const templatesGrid = document.querySelector('#step-template .templates-grid');
        if (!templatesGrid) return;
        
        // ניקוי תוכן קיים
        templatesGrid.innerHTML = '';
        
        // קבלת כל התבניות הזמינות
        const templates = TemplatesManager.getAllTemplates();
        
        // יצירת קלפי תבניות
        templates.forEach(template => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.dataset.templateId = template.id;
            
            templateCard.innerHTML = `
                <div class="template-preview">
                    <img src="${template.thumbnail || 'assets/templates/default.jpg'}" alt="${template.name}">
                    <div class="template-overlay">
                        <button class="btn btn-light">בחר</button>
                    </div>
                </div>
                <h3 class="template-title">${template.name}</h3>
                <p class="template-description">${template.description || ''}</p>
            `;
            
            templatesGrid.appendChild(templateCard);
        });
    }
    
    /**
     * הוספת אירועים לבחירת תבנית
     */
    function addTemplateEvents() {
        // אירועי לחיצה על תבניות
        document.querySelectorAll('#step-template .template-card').forEach(card => {
            card.addEventListener('click', function() {
                // ביטול בחירה קודמת
                document.querySelectorAll('#step-template .template-card').forEach(c => {
                    c.classList.remove('selected');
                });
                
                // סימון התבנית הנוכחית
                this.classList.add('selected');
                
                // שמירת התבנית הנבחרת
                selectedTemplate = this.dataset.templateId;
                
                // הפעלת כפתור הבא
                enableNextButton();
            });
        });
        
        // אירוע לחיצה על כפתור הבא
        document.querySelector('.btn-next').addEventListener('click', function() {
            if (StepsManager.getCurrentStep() === 1 && selectedTemplate) {
                createProjectFromTemplate(selectedTemplate);
            }
        });
    }
    
    /**
     * הפעלת כפתור הבא
     */
    function enableNextButton() {
        const nextButton = document.querySelector('.btn-next');
        if (nextButton) {
            nextButton.disabled = false;
        }
    }
    
    /**
     * יצירת פרויקט מתבנית והמשך לשלב הבא
     * @param {string} templateId מזהה התבנית
     */
    function createProjectFromTemplate(templateId) {
        // קבלת מידע נוסף על התבנית
        const template = TemplatesManager.getTemplate(templateId);
        
        // יצירת שם פרויקט
        const projectName = template ? template.name : 'פרויקט חדש';
        
        // יצירת פרויקט חדש מהתבנית
        const project = TemplatesManager.createProjectFromTemplate(templateId, projectName);
        
        // ניתוב לשלב הבא
        if (project) {
            console.log('Project created successfully:', project.name);
            
            // אירוע מיוחד לעדכון ממשק שקפים בשלב הבא
            document.dispatchEvent(new CustomEvent('project:created', { detail: project }));
        } else {
            console.error('Failed to create project from template:', templateId);
            alert('אירעה שגיאה ביצירת הפרויקט.');
        }
    }
    
    /**
     * בחירת תבנית אוטומטית (אם יש רק אחת)
     */
    function autoSelectTemplateIfSingle() {
        const templates = document.querySelectorAll('#step-template .template-card');
        if (templates.length === 1) {
            templates[0].click();
        }
    }
    
    // ממשק ציבורי של המודול
    return {
        init: init,
        loadTemplates: loadTemplates,
        getSelectedTemplate: function() { return selectedTemplate; }
    };
})();
