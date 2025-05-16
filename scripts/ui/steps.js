/**
 * steps.js - מודול ניהול השלבים
 * אחראי על ניווט בין שלבי העבודה השונים במערכת
 */

const StepsManager = (function() {
    // קבועים
    const TOTAL_STEPS = 5;
    
    // משתנים פנימיים
    let currentStep = 1;
    let stepsInitialized = false;
    
    /**
     * אתחול מערכת השלבים
     */
    function init() {
        if (stepsInitialized) return;
        
        // הגדרת אירועי לחיצה על כפתורי ניווט
        document.querySelector('.btn-next').addEventListener('click', goToNextStep);
        document.querySelector('.btn-prev').addEventListener('click', goToPrevStep);
        
        // אתחול סרגל התקדמות
        updateProgressBar();
        
        // אתחול אירועי מעבר ישיר לשלב (לחיצה על אינדיקטור)
        document.querySelectorAll('.step-indicator').forEach(indicator => {
            indicator.addEventListener('click', function() {
                const stepNum = parseInt(this.dataset.step);
                if (stepNum <= getCompletedSteps() + 1) {
                    goToStep(stepNum);
                }
            });
        });
        
        stepsInitialized = true;
    }
    
    /**
     * מעבר לשלב הבא
     */
    function goToNextStep() {
        if (currentStep < TOTAL_STEPS) {
            goToStep(currentStep + 1);
        }
    }
    
    /**
     * מעבר לשלב הקודם
     */
    function goToPrevStep() {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    }
    
    /**
     * מעבר לשלב ספציפי
     * @param {number} stepNum מספר השלב לעבור אליו
     */
    function goToStep(stepNum) {
        if (stepNum < 1 || stepNum > TOTAL_STEPS) return;
        
        // הסתרת השלב הנוכחי
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
        
        // הצגת השלב החדש
        document.querySelector(`.step[data-step="${stepNum}"]`).classList.add('active');
        
        // עדכון משתנה השלב הנוכחי
        currentStep = stepNum;
        
        // עדכון סטטוס כפתורי ניווט
        updateNavigationButtons();
        
        // עדכון סרגל התקדמות
        updateProgressBar();
        
        // הפעלת אירוע שלב נבחר
        triggerStepEvents(stepNum);
    }
    
    /**
     * עדכון סטטוס כפתורי ניווט
     */
    function updateNavigationButtons() {
        const prevBtn = document.querySelector('.btn-prev');
        const nextBtn = document.querySelector('.btn-next');
        
        // עדכון כפתור קודם
        prevBtn.disabled = (currentStep === 1);
        
        // עדכון כפתור הבא
        if (currentStep === TOTAL_STEPS) {
            nextBtn.textContent = 'סיום';
        } else {
            nextBtn.textContent = 'הבא';
            nextBtn.innerHTML = 'הבא <i class="fas fa-arrow-left"></i>';
        }
    }
    
    /**
     * עדכון סרגל התקדמות
     */
    function updateProgressBar() {
        // עדכון אינדיקטורי שלבים
        document.querySelectorAll('.step-indicator').forEach(indicator => {
            const step = parseInt(indicator.dataset.step);
            
            indicator.classList.remove('active', 'completed');
            
            if (step < currentStep) {
                indicator.classList.add('completed');
            } else if (step === currentStep) {
                indicator.classList.add('active');
            }
        });
        
        // עדכון פס ההתקדמות
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentage = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    /**
     * קבלת מספר השלבים שהושלמו
     * @returns {number} מספר השלבים שהושלמו
     */
    function getCompletedSteps() {
        return currentStep - 1;
    }
    
    /**
     * הפעלת אירועים הקשורים לשלב הנוכחי
     * @param {number} stepNum מספר השלב
     */
    function triggerStepEvents(stepNum) {
        // הפעלת אירועים ספציפיים לכל שלב
        switch (stepNum) {
            case 1: // שלב תבנית
                if (typeof TemplateSelector !== 'undefined') {
                    TemplateSelector.init();
                }
                break;
            case 2: // שלב שקפים
                if (typeof SlideManager !== 'undefined') {
                    SlideManager.init();
                }
                break;
            case 3: // שלב תוכן
                if (typeof ContentEditor !== 'undefined') {
                    ContentEditor.init();
                }
                break;
            case 4: // שלב אנימציות
                if (typeof AnimationsManager !== 'undefined') {
                    AnimationsManager.init();
                }
                break;
            case 5: // שלב תצוגה מקדימה וייצוא
                if (typeof PreviewExport !== 'undefined') {
                    PreviewExport.init();
                }
                break;
        }
        
        // התאמת גודל אזורים דינמיים בשלב מסוים
        adjustStepLayout(stepNum);
    }
    
    /**
     * התאמת גודל אזורים דינמיים בשלב
     * @param {number} stepNum מספר השלב
     */
    function adjustStepLayout(stepNum) {
        // התאמת גובה אזורי עריכה
        const step = document.querySelector(`.step[data-step="${stepNum}"]`);
        if (!step) return;
        
        // אתחול גובה אזורי תצוגה על פי גובה חלון התצוגה
        const stepContent = step.querySelector('.slide-preview, .editor-preview');
        if (stepContent) {
            // להתאים גובה בהתאם לגובה החלון ולשאר אלמנטים בדף
            const headerHeight = document.querySelector('.progress-bar-container').offsetHeight;
            const titleHeight = step.querySelector('.step-title').offsetHeight;
            const navigationHeight = document.querySelector('.steps-navigation').offsetHeight;
            const availableHeight = window.innerHeight - headerHeight - titleHeight - navigationHeight - 80; // ערך נוסף למרווחים
            
            // הגדרת גובה מינימלי
            const minHeight = 300;
            const contentHeight = Math.max(minHeight, availableHeight);
            
            // החלת הגובה על אזור התצוגה
            if (window.innerWidth >= 1024) { // רק במסכים גדולים
                stepContent.style.height = `${contentHeight}px`;
            } else {
                stepContent.style.height = ''; // ברירת מחדל במובייל
            }
        }
    }
    
    /**
     * פתיחת מערכת השלבים
     */
    function openStepsView() {
        document.getElementById('splash-screen').classList.remove('active');
        document.getElementById('steps-container').classList.add('active');
        
        // אתחול מחדש של מערכת השלבים
        init();
        goToStep(1);
        
        // התאמת גודל החלון
        adjustStepLayout(1);
        
        // הוספת אירוע לשינוי גודל חלון
        window.addEventListener('resize', function() {
            adjustStepLayout(currentStep);
        });
    }
    
    /**
     * חזרה למסך פתיחה
     */
    function backToSplash() {
        document.getElementById('steps-container').classList.remove('active');
        document.getElementById('splash-screen').classList.add('active');
    }
    
    // ממשק ציבורי של המודול
    return {
        init: init,
        goToStep: goToStep,
        goToNextStep: goToNextStep,
        goToPrevStep: goToPrevStep,
        getCurrentStep: function() { return currentStep; },
        openStepsView: openStepsView,
        backToSplash: backToSplash
    };
})();
