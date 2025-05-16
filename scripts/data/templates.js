/**
 * templates.js - מודול תבניות מוכנות
 * מספק תבניות מובנות לפרויקטים חדשים
 */

const TemplatesManager = (function() {
    // מאגר התבניות המוכנות
    const TEMPLATES = [
        {
            id: 'blank',
            name: 'פרויקט ריק',
            description: 'התחל מדף ריק עם עיצוב בסיסי',
            thumbnail: 'assets/templates/blank.jpg',
            slides: [
                {
                    background: { type: 'color', value: '#ffffff' },
                    elements: [
                        {
                            type: 'text',
                            content: 'הכותרת שלי',
                            style: {
                                fontSize: { value: 36, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'bold',
                                color: '#333333',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 40 },
                            size: { width: { value: 'auto', unit: '' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0 }
                        },
                        {
                            type: 'text',
                            content: 'כותרת משנה',
                            style: {
                                fontSize: { value: 24, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'normal',
                                color: '#666666',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 60 },
                            size: { width: { value: 'auto', unit: '' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0.5 }
                        }
                    ],
                    transition: { type: 'fade', duration: 0.7 }
                }
            ]
        },
        {
            id: 'business',
            name: 'מצגת עסקית',
            description: 'מצגת מקצועית לעסקים ופרזנטציות',
            thumbnail: 'assets/templates/business.jpg',
            slides: [
                {
                    background: { type: 'color', value: '#0a2540' },
                    elements: [
                        {
                            type: 'text',
                            content: 'שם החברה',
                            style: {
                                fontSize: { value: 40, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 40 },
                            size: { width: { value: 'auto', unit: '' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0 }
                        },
                        {
                            type: 'text',
                            content: 'סלוגן או משפט מפתח',
                            style: {
                                fontSize: { value: 24, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'normal',
                                color: '#3b82f6',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 60 },
                            size: { width: { value: 'auto', unit: '' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0.5 }
                        }
                    ],
                    transition: { type: 'fade', duration: 0.7 }
                },
                {
                    background: { type: 'color', value: '#ffffff' },
                    elements: [
                        {
                            type: 'text',
                            content: 'על החברה',
                            style: {
                                fontSize: { value: 36, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'bold',
                                color: '#0a2540',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 20 },
                            size: { width: { value: 'auto', unit: '' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'slide-in', duration: 1, delay: 0 }
                        },
                        {
                            type: 'text',
                            content: 'כאן מופיע תיאור קצר של החברה או העסק שלך, עם דגש על הערכים והיתרונות שאתם מציעים.',
                            style: {
                                fontSize: { value: 20, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'normal',
                                color: '#333333',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 50 },
                            size: { width: { value: 80, unit: '%' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0.5 }
                        }
                    ],
                    transition: { type: 'slide', duration: 0.7 }
                }
            ]
        },
        {
            id: 'education',
            name: 'מצגת חינוכית',
            description: 'תבנית למצגות חינוכיות ולימודיות',
            thumbnail: 'assets/templates/education.jpg',
            slides: [
                {
                    background: { type: 'color', value: '#f0fdf4' },
                    elements: [
                        {
                            type: 'text',
                            content: 'נושא השיעור',
                            style: {
                                fontSize: { value: 40, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'bold',
                                color: '#166534',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 40 },
                            size: { width: { value: 'auto', unit: '' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0 }
                        },
                        {
                            type: 'text',
                            content: 'שם המורה / כיתה / תאריך',
                            style: {
                                fontSize: { value: 22, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'normal',
                                color: '#4ade80',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 60 },
                            size: { width: { value: 'auto', unit: '' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0.5 }
                        }
                    ],
                    transition: { type: 'fade', duration: 0.7 }
                },
                {
                    background: { type: 'color', value: '#ffffff' },
                    elements: [
                        {
                            type: 'text',
                            content: 'נושא ראשון',
                            style: {
                                fontSize: { value: 32, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'bold',
                                color: '#166534',
                                textAlign: 'right'
                            },
                            position: { x: 50, y: 20 },
                            size: { width: { value: 90, unit: '%' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'slide-in', duration: 0.8, delay: 0 }
                        },
                        {
                            type: 'text',
                            content: '• נקודה ראשונה שברצונך להסביר\n• נקודה שנייה חשובה לנושא\n• נקודה שלישית להרחבה',
                            style: {
                                fontSize: { value: 22, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'normal',
                                color: '#333333',
                                textAlign: 'right'
                            },
                            position: { x: 50, y: 50 },
                            size: { width: { value: 90, unit: '%' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0.5 }
                        }
                    ],
                    transition: { type: 'slide', duration: 0.7 }
                }
            ]
        },
        {
            id: 'personal',
            name: 'סיפור אישי',
            description: 'הצגת סיפור אישי עם תמונות וטקסט',
            thumbnail: 'assets/templates/personal.jpg',
            slides: [
                {
                    background: { type: 'color', value: '#ffe4e6' },
                    elements: [
                        {
                            type: 'text',
                            content: 'הסיפור שלי',
                            style: {
                                fontSize: { value: 42, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'bold',
                                color: '#9f1239',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 40 },
                            size: { width: { value: 'auto', unit: '' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0 }
                        },
                        {
                            type: 'text',
                            content: 'שם / תאריך מיוחד',
                            style: {
                                fontSize: { value: 24, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'normal',
                                color: '#e11d48',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 60 },
                            size: { width: { value: 'auto', unit: '' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0.5 }
                        }
                    ],
                    transition: { type: 'fade', duration: 0.7 }
                },
                {
                    background: { type: 'color', value: '#ffffff' },
                    elements: [
                        {
                            type: 'text',
                            content: 'התחלת הסיפור',
                            style: {
                                fontSize: { value: 32, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'bold',
                                color: '#9f1239',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 30 },
                            size: { width: { value: 'auto', unit: '' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 0.8, delay: 0 }
                        },
                        {
                            type: 'text',
                            content: 'כאן יתחיל הסיפור האישי שלך. תוכל להוסיף תמונות ורגעים מיוחדים שחווית.',
                            style: {
                                fontSize: { value: 22, unit: 'px' },
                                fontFamily: 'Assistant',
                                fontWeight: 'normal',
                                color: '#333333',
                                textAlign: 'center'
                            },
                            position: { x: 50, y: 60 },
                            size: { width: { value: 80, unit: '%' }, height: { value: 'auto', unit: '' } },
                            animation: { type: 'fade-in', duration: 1, delay: 0.5 }
                        }
                    ],
                    transition: { type: 'slide', duration: 0.7 }
                }
            ]
        }
    ];
    
    return {
        /**
         * קבלת כל התבניות הזמינות
         * @returns {Array} מערך של תבניות מוכנות
         */
        getAllTemplates: function() {
            return TEMPLATES;
        },
        
        /**
         * קבלת תבנית לפי מזהה
         * @param {string} templateId מזהה התבנית
         * @returns {Object|null} התבנית המבוקשת או null אם לא נמצאה
         */
        getTemplate: function(templateId) {
            return TEMPLATES.find(template => template.id === templateId) || null;
        },
        
        /**
         * יצירת פרויקט מתבנית מוכנה
         * @param {string} templateId מזהה התבנית
         * @param {string} projectName שם הפרויקט החדש
         * @returns {Object|null} הפרויקט החדש או null אם נכשל
         */
        createProjectFromTemplate: function(templateId, projectName) {
            const template = this.getTemplate(templateId);
            if (!template) return null;
            
            // יצירת פרויקט חדש
            const project = ProjectManager.createProject(projectName || template.name);
            
            // מחיקת השקף הראשוני שנוצר אוטומטית
            if (project.slides.length > 0) {
                const firstSlideId = project.slides[0].id;
                ProjectManager.deleteSlide(firstSlideId);
            }
            
            // הוספת שקפים מהתבנית
            template.slides.forEach((slideTemplate, index) => {
                ProjectManager.addSlide(slideTemplate);
            });
            
            // שמירת הפרויקט
            ProjectManager.saveProject();
            
            return project;
        }
    };
})();
