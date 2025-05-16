/**
 * animations-manager.js - מודול ניהול אנימציות
 * אחראי על הוספה ועריכה של אנימציות ומעברים בשקפים ואלמנטים
 */

const AnimationsManager = (function() {
    // משתנים פנימיים
    let isInitialized = false;
    let selectedElementId = null;
    
    // רשימת אנימציות זמינות
    const ANIMATIONS = {
        fade: {
            name: 'הופעה והיעלמות',
            presets: {
                fadeIn: { name: 'הופעה', css: 'fadeIn' },
                fadeOut: { name: 'היעלמות', css: 'fadeOut' }
            }
        },
        slide: {
            name: 'החלקה',
            presets: {
                slideIn: { name: 'החלקה פנימה', css: 'slideIn' },
                slideOut: { name: 'החלקה החוצה', css: 'slideOut' }
            }
        },
        zoom: {
            name: 'זום',
            presets: {
                zoomIn: { name: 'התקרבות', css: 'zoomIn' },
                zoomOut: { name: 'התרחקות', css: 'zoomOut' }
            }
        },
        rotate: {
            name: 'סיבוב',
            presets: {
                rotateIn: { name: 'סיבוב פנימה', css: 'rotateIn' },
                rotateOut: { name: 'סיבוב החוצה', css: 'rotateOut' }
            }
        },
        bounce: {
            name: 'קפיצה',
            presets: {
                bounce: { name: 'קפיצה', css: 'bounce' }
            }
        },
        flash: {
            name: 'הבהוב',
            presets: {
                flash: { name: 'הבהוב', css: 'flash' }
            }
        }
    };
    
    // רשימת מעברים זמינים
    const TRANSITIONS = {
        fade: { name: 'הופעה', css: 'fade' },
        slide: { name: 'החלקה', css: 'slide' },
        zoom: { name: 'זום', css: 'zoom' },
        flip: { name: 'היפוך', css: 'flip' }
    };
    
    /**
     * אתחול מודול האנימציות
     */
    function init() {
        if (isInitialized) return;
        
        // טעינת התצוגה המקדימה של שקף
        loadSlidePreview();
        
        // בניית פאנל האנימציות
        buildAnimationsPanel();
        
        // הוספת אירועים
        addAnimationEvents();
        
        isInitialized = true;
    }
    
    /**
     * טעינת התצוגה המקדימה של שקף
     */
    function loadSlidePreview() {
        // קבלת מיכל התצוגה המקדימה
        const previewContainer = document.querySelector('#step-animations .animation-preview');
        if (!previewContainer) return;
        
        // ניקוי תוכן קיים
        previewContainer.innerHTML = '';
        
        // קבלת השקף הנוכחי
        const currentSlide = ProjectManager.getCurrentSlide();
        if (!currentSlide) {
            previewContainer.innerHTML = '<div class="empty-state">אין שקף נבחר</div>';
            return;
        }
        
        // יצירת קנבס אנימציה
        const animationCanvas = document.createElement('div');
        animationCanvas.className = 'animation-canvas';
        
        // החלת רקע
        if (currentSlide.background.type === 'color') {
            animationCanvas.style.backgroundColor = currentSlide.background.value;
        } else if (currentSlide.background.type === 'image') {
            animationCanvas.style.backgroundImage = `url(${currentSlide.background.value})`;
            animationCanvas.style.backgroundSize = 'cover';
            animationCanvas.style.backgroundPosition = 'center';
        }
        
        // הוספת אלמנטים לשקף
        currentSlide.elements.forEach(element => {
            const elementDOM = createAnimationElementDOM(element);
            animationCanvas.appendChild(elementDOM);
        });
        
        // הוספת הקנבס למיכל
        previewContainer.appendChild(animationCanvas);
        
        // הוספת כפתורי בקרה
        const previewControls = document.createElement('div');
        previewControls.className = 'preview-controls';
        
        // כפתור הפעלת אנימציה
        const playButton = document.createElement('button');
        playButton.className = 'btn btn-primary play-animation-btn';
        playButton.innerHTML = '<i class="fas fa-play"></i> הפעל אנימציה';
        playButton.addEventListener('click', playAnimation);
        
        previewControls.appendChild(playButton);
        previewContainer.appendChild(previewControls);
    }
    
    /**
     * יצירת אלמנט DOM לאלמנט שקף בתצוגת אנימציה
     * @param {Object} element אובייקט האלמנט
     * @returns {HTMLElement} אלמנט ה-DOM
     */
    function createAnimationElementDOM(element) {
        const elementDOM = document.createElement('div');
        elementDOM.className = `animation-element ${element.type}-element`;
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
        
        // הוספת אירוע לחיצה לבחירת אלמנט
        elementDOM.addEventListener('click', function(e) {
            e.stopPropagation();
            selectElement(element.id);
        });
        
        return elementDOM;
    }
    
    /**
     * בניית פאנל האנימציות
     */
    function buildAnimationsPanel() {
        // קבלת פאנל האנימציות
        const animationsPanel = document.querySelector('#step-animations .animations-panel');
        if (!animationsPanel) return;
        
        // ניקוי תוכן קיים
        animationsPanel.innerHTML = '';
        
        // יצירת כותרת
        const panelTitle = document.createElement('h3');
        panelTitle.className = 'panel-title';
        panelTitle.textContent = 'הוספת אנימציות';
        
        // יצירת הנחיות
        const instructions = document.createElement('p');
        instructions.className = 'instructions';
        instructions.textContent = 'בחר אלמנט מהשקף כדי להוסיף לו אנימציה';
        
        // יצירת פאנל אנימציות לאלמנטים
        const elementsPanel = document.createElement('div');
        elementsPanel.className = 'elements-animations';
        elementsPanel.innerHTML = `
            <h4>אנימציות לאלמנטים</h4>
            <div class="animation-controls">
                <select class="animation-type-select" disabled>
                    <option value="">-- בחר סוג אנימציה --</option>
                    ${Object.keys(ANIMATIONS).map(key => `
                        <option value="${key}">${ANIMATIONS[key].name}</option>
                    `).join('')}
                </select>
                
                <select class="animation-preset-select" disabled>
                    <option value="">-- בחר אנימציה --</option>
                </select>
                
                <div class="animation-params">
                    <div class="param-group">
                        <label>משך (שניות)</label>
                        <input type="number" class="duration-input" min="0.1" max="10" step="0.1" value="1" disabled>
                    </div>
                    
                    <div class="param-group">
                        <label>השהייה (שניות)</label>
                        <input type="number" class="delay-input" min="0" max="10" step="0.1" value="0" disabled>
                    </div>
                </div>
                
                <button class="btn btn-primary apply-animation-btn" disabled>החל אנימציה</button>
                <button class="btn btn-outline remove-animation-btn" disabled>הסר אנימציה</button>
            </div>
        `;
        
        // יצירת פאנל מעברים בין שקפים
        const transitionsPanel = document.createElement('div');
        transitionsPanel.className = 'slide-transitions';
        transitionsPanel.innerHTML = `
            <h4>מעברים בין שקפים</h4>
            <div class="transition-controls">
                <select class="transition-type-select">
                    <option value="">-- ללא מעבר --</option>
                    ${Object.keys(TRANSITIONS).map(key => `
                        <option value="${key}">${TRANSITIONS[key].name}</option>
                    `).join('')}
                </select>
                
                <div class="transition-params">
                    <div class="param-group">
                        <label>משך (שניות)</label>
                        <input type="number" class="transition-duration-input" min="0.1" max="5" step="0.1" value="0.5">
                    </div>
                </div>
                
                <button class="btn btn-primary apply-transition-btn">החל מעבר</button>
            </div>
        `;
        
        // הוספה של כל האלמנטים לפאנל
        animationsPanel.appendChild(panelTitle);
        animationsPanel.appendChild(instructions);
        animationsPanel.appendChild(elementsPanel);
        animationsPanel.appendChild(transitionsPanel);
    }
    
    /**
     * הוספת אירועים לפאנל האנימציות
     */
    function addAnimationEvents() {
        // אירוע שינוי סוג אנימציה
        const animationTypeSelect = document.querySelector('.animation-type-select');
        if (animationTypeSelect) {
            animationTypeSelect.addEventListener('change', function() {
                updateAnimationPresets(this.value);
            });
        }
        
        // אירוע לחיצה על כפתור החלת אנימציה
        const applyAnimationBtn = document.querySelector('.apply-animation-btn');
        if (applyAnimationBtn) {
            applyAnimationBtn.addEventListener('click', applyAnimation);
        }
        
        // אירוע לחיצה על כפתור הסרת אנימציה
        const removeAnimationBtn = document.querySelector('.remove-animation-btn');
        if (removeAnimationBtn) {
            removeAnimationBtn.addEventListener('click', removeAnimation);
        }
        
        // אירוע לחיצה על כפתור החלת מעבר
        const applyTransitionBtn = document.querySelector('.apply-transition-btn');
        if (applyTransitionBtn) {
            applyTransitionBtn.addEventListener('click', applyTransition);
        }
    }
    
    /**
     * עדכון רשימת אנימציות קבועות מראש בהתאם לסוג שנבחר
     * @param {string} animationType סוג האנימציה שנבחר
     */
    function updateAnimationPresets(animationType) {
        const presetSelect = document.querySelector('.animation-preset-select');
        if (!presetSelect) return;
        
        // ניקוי אפשרויות קיימות
        presetSelect.innerHTML = '<option value="">-- בחר אנימציה --</option>';
        
        // אם לא נבחר סוג, יציאה
        if (!animationType) {
            presetSelect.disabled = true;
            return;
        }
        
        // קבלת רשימת אנימציות לסוג שנבחר
        const presets = ANIMATIONS[animationType]?.presets;
        if (!presets) {
            presetSelect.disabled = true;
            return;
        }
        
        // הוספת האפשרויות
        Object.keys(presets).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = presets[key].name;
            presetSelect.appendChild(option);
        });
        
        // הפעלת הבחירה
        presetSelect.disabled = false;
    }
    
    /**
     * בחירת אלמנט
     * @param {string} elementId מזהה האלמנט
     */
    function selectElement(elementId) {
        // בטל בחירה קודמת
        document.querySelectorAll('.animation-element').forEach(el => {
            el.classList.remove('selected');
        });
        
        // סמן את האלמנט החדש
        const elementDOM = document.querySelector(`.animation-element[data-element-id="${elementId}"]`);
        if (elementDOM) {
            elementDOM.classList.add('selected');
        }
        
        // שמור את מזהה האלמנט הנבחר
        selectedElementId = elementId;
        
        // הפעלת בקרי אנימציה
        enableAnimationControls();
        
        // טען מידע אנימציה קיים אם יש
        loadElementAnimationData(elementId);
    }
    
    /**
     * הפעלת בקרי אנימציה
     */
    function enableAnimationControls() {
        // הפעל את כל בקרי האנימציה
        document.querySelectorAll('.animation-type-select, .animation-preset-select, .duration-input, .delay-input, .apply-animation-btn, .remove-animation-btn').forEach(control => {
            control.disabled = false;
        });
    }
    
    /**
     * טעינת מידע אנימציה קיים של אלמנט
     * @param {string} elementId מזהה האלמנט
     */
    function loadElementAnimationData(elementId) {
        // קבלת האלמנט הנוכחי
        const element = ProjectManager.getElementById(elementId);
        if (!element) return;
        
        // קבלת האנימציה של האלמנט (אם קיימת)
        const animation = element.animation;
        if (!animation) return;
        
        // שליפת אנימציה וסוג אנימציה מהאובייקט
        let foundAnimationType = null;
        let foundAnimationPreset = null;
        
        // חיפוש בכל סוגי האנימציות
        for (const [typeKey, typeObj] of Object.entries(ANIMATIONS)) {
            for (const [presetKey, presetObj] of Object.entries(typeObj.presets)) {
                if (presetObj.css === animation.type) {
                    foundAnimationType = typeKey;
                    foundAnimationPreset = presetKey;
                    break;
                }
            }
            if (foundAnimationType) break;
        }
        
        // אם נמצאה אנימציה, הגדר את הבקרים בהתאם
        if (foundAnimationType) {
            // סוג אנימציה
            const typeSelect = document.querySelector('.animation-type-select');
            if (typeSelect) {
                typeSelect.value = foundAnimationType;
                updateAnimationPresets(foundAnimationType);
            }
            
            // אנימציה ספציפית
            const presetSelect = document.querySelector('.animation-preset-select');
            if (presetSelect) {
                presetSelect.value = foundAnimationPreset;
            }
            
            // משך
            const durationInput = document.querySelector('.duration-input');
            if (durationInput) {
                durationInput.value = animation.duration;
            }
            
            // השהייה
            const delayInput = document.querySelector('.delay-input');
            if (delayInput) {
                delayInput.value = animation.delay;
            }
        }
    }
    
    /**
     * החלת אנימציה על אלמנט נבחר
     */
    function applyAnimation() {
        // בדיקה אם נבחר אלמנט
        if (!selectedElementId) {
            alert('יש לבחור אלמנט תחילה');
            return;
        }
        
        // קבלת ערכי האנימציה
        const animationType = document.querySelector('.animation-type-select').value;
        const animationPreset = document.querySelector('.animation-preset-select').value;
        const duration = parseFloat(document.querySelector('.duration-input').value) || 1;
        const delay = parseFloat(document.querySelector('.delay-input').value) || 0;
        
        // בדיקה שנבחרו סוג ואנימציה
        if (!animationType || !animationPreset) {
            alert('יש לבחור סוג אנימציה ואנימציה ספציפית');
            return;
        }
        
        // קבלת מידע האנימציה
        const animation = {
            type: ANIMATIONS[animationType].presets[animationPreset].css,
            duration: duration,
            delay: delay,
            timingFunction: 'ease',
            iterationCount: 1
        };
        
        // עדכון האנימציה באלמנט
        const updated = ProjectManager.updateElementAnimation(selectedElementId, animation);
        
        if (updated) {
            // טעינה מחדש של התצוגה המקדימה
            loadSlidePreview();
            
            // בחירת האלמנט מחדש
            setTimeout(() => {
                selectElement(selectedElementId);
            }, 100);
        } else {
            alert('אירעה שגיאה בעדכון האנימציה');
        }
    }
    
    /**
     * הסרת אנימציה מאלמנט נבחר
     */
    function removeAnimation() {
        // בדיקה אם נבחר אלמנט
        if (!selectedElementId) {
            alert('יש לבחור אלמנט תחילה');
            return;
        }
        
        // הסרת האנימציה מהאלמנט
        const updated = ProjectManager.removeElementAnimation(selectedElementId);
        
        if (updated) {
            // טעינה מחדש של התצוגה המקדימה
            loadSlidePreview();
            
            // איפוס בקרי האנימציה
            document.querySelector('.animation-type-select').value = '';
            document.querySelector('.animation-preset-select').innerHTML = '<option value="">-- בחר אנימציה --</option>';
            document.querySelector('.animation-preset-select').disabled = true;
            document.querySelector('.duration-input').value = 1;
            document.querySelector('.delay-input').value = 0;
            
            // בחירת האלמנט מחדש
            setTimeout(() => {
                selectElement(selectedElementId);
            }, 100);
        } else {
            alert('אירעה שגיאה בהסרת האנימציה');
        }
    }
    
    /**
     * החלת מעבר בין שקפים
     */
    function applyTransition() {
        // קבלת ערכי המעבר
        const transitionType = document.querySelector('.transition-type-select').value;
        const duration = parseFloat(document.querySelector('.transition-duration-input').value) || 0.5;
        
        // קבלת השקף הנוכחי
        const currentSlide = ProjectManager.getCurrentSlide();
        if (!currentSlide) {
            alert('אין שקף נבחר');
            return;
        }
        
        // עדכון מידע מעבר לשקף
        let transition = null;
        
        if (transitionType) {
            transition = {
                type: TRANSITIONS[transitionType].css,
                duration: duration
            };
        }
        
        // עדכון המעבר בשקף
        const updated = ProjectManager.updateSlideTransition(currentSlide.id, transition);
        
        if (updated) {
            alert('המעבר הוחל בהצלחה על השקף');
        } else {
            alert('אירעה שגיאה בעדכון המעבר');
        }
    }
    
    /**
     * הפעלת אנימציה בתצוגה מקדימה
     */
    function playAnimation() {
        const animationCanvas = document.querySelector('.animation-canvas');
        if (!animationCanvas) return;
        
        // איפוס אנימציות
        const elements = animationCanvas.querySelectorAll('.animation-element');
        elements.forEach(element => {
            // הסרת קלאסי אנימציה קיימים
            element.classList.remove('animated');
            element.style.animation = '';
            
            // גרימה לברואזר לבצע reflow כדי שהאנימציה תתחיל מחדש
            void element.offsetWidth;
        });
        
        // קבלת האלמנטים מהפרויקט עם מידע האנימציה
        const currentSlide = ProjectManager.getCurrentSlide();
        if (!currentSlide) return;
        
        // הפעלת אנימציות על האלמנטים
        currentSlide.elements.forEach(elementData => {
            if (elementData.animation) {
                const elementDOM = animationCanvas.querySelector(`.animation-element[data-element-id="${elementData.id}"]`);
                if (elementDOM) {
                    // החלת סוג האנימציה כקלאס
                    elementDOM.classList.add('animated');
                    elementDOM.style.animation = `${elementData.animation.type} ${elementData.animation.duration}s ${elementData.animation.delay}s ${elementData.animation.timingFunction}`;
                }
            }
        });
    }
    
    // ממשק ציבורי של המודול
    return {
        init: init,
        loadSlidePreview: loadSlidePreview,
        selectElement: selectElement,
        playAnimation: playAnimation
    };
})();
