// משתנים גלובליים
let slides = [];
let currentSlide = 0;
let editMode = false;
let musicVolume = 0.5;
let projects = []; // מערך לשמירת כל הפרויקטים
let currentProject = 0; // אינדקס הפרויקט הנוכחי
let transitionTime = 3; // זמן מעבר בין שקפים

// אתחול ראשוני
function init() {
  // בדיקה אם יש פרויקטים שמורים
  const savedProjects = localStorage.getItem('videoProjects');
  if (savedProjects) {
    projects = JSON.parse(savedProjects);
    // טעינת הפרויקט האחרון שהיה פעיל
    currentProject = parseInt(localStorage.getItem('currentVideoProject') || '0');
    // טעינת השקפים של הפרויקט הנוכחי
    slides = projects[currentProject].slides;
  } else {
    // יצירת פרויקט ראשון
    createNewProject();
  }
  
  // אתחול ממשק המשתמש
  renderProjects();
  renderSlides();
  selectSlide(0);
  generatePreview();
  
  // הוספת מאזיני אירועים
  setupEventListeners();
}

// הוספת מאזיני אירועים
function setupEventListeners() {
  // הוספת מאזין אירועים לכפתור "פרויקט חדש"
  const newProjectBtn = document.querySelector('.new-project-btn');
  if (newProjectBtn) {
    newProjectBtn.addEventListener('click', newProject);
  } else {
    // אם הכפתור לא קיים, נוסיף אותו לתפריט
    const menuBar = document.querySelector('.menu-bar');
    if (menuBar) {
      const newProjectBtn = document.createElement('button');
      newProjectBtn.className = 'menu-button new-project-btn';
      newProjectBtn.innerHTML = '<i class="fas fa-plus"></i> פרויקט חדש';
      newProjectBtn.addEventListener('click', newProject);
      menuBar.appendChild(newProjectBtn);
    }
  }
}

// פונקציה ליצירת פרויקט חדש
function newProject() {
  createNewProject();
  renderProjects();
  renderSlides();
  selectSlide(0);
  generatePreview();
  saveProjects();
}

// פונקציה ליצירת פרויקט חדש
function createNewProject() {
  // יצירת שקפים לדוגמה לפרויקט חדש
  const newProjectSlides = [
    {
      text: 'שקף ראשון',
      image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85',
      font: 'Arial',
      fontSize: 36,
      textColor: '#ffffff',
      hasBg: true,
      bgColor: '#000000',
      bgOpacity: 0.7,
      pos: 'center',
      customPos: false,
      posX: 50,
      posY: 50,
      anim: 'fade',
      imageAnim: 'none',
      textAnimation: 'none',
      backgroundMusic: 'none',
      soundEffect: 'none'
    }
  ];
  
  // יצירת אובייקט פרויקט חדש
  const newProject = {
    name: `פרויקט ${projects.length + 1}`,
    slides: newProjectSlides,
    thumbnail: newProjectSlides[0].image,
    createdAt: new Date().toISOString()
  };
  
  // הוספת הפרויקט למערך הפרויקטים
  projects.push(newProject);
  
  // הגדרת הפרויקט החדש כפרויקט הנוכחי
  currentProject = projects.length - 1;
  
  // הגדרת השקפים של הפרויקט החדש כשקפים הנוכחיים
  slides = newProject.slides;
  
  // שמירת הפרויקטים
  saveProjects();
}

// פונקציה לרינדור הפרויקטים בסרגל הפרויקטים
function renderProjects() {
  const projectsList = document.getElementById('projectsList');
  projectsList.innerHTML = '';
  
  projects.forEach((project, index) => {
    const projectItem = document.createElement('div');
    projectItem.className = `project-item ${index === currentProject ? 'active' : ''}`;
    projectItem.setAttribute('data-index', index);
    
    // רקע הפרויקט
    const bg = document.createElement('div');
    bg.className = 'project-bg';
    bg.style.backgroundImage = `url('${project.thumbnail}')`;
    projectItem.appendChild(bg);
    
    // מספר הפרויקט
    const number = document.createElement('div');
    number.className = 'project-number';
    number.textContent = index + 1;
    projectItem.appendChild(number);
    
    // שם הפרויקט
    const name = document.createElement('div');
    name.className = 'project-name';
    name.textContent = project.name;
    projectItem.appendChild(name);
    
    // הוספת מאזין אירועים ללחיצה על הפרויקט
    projectItem.addEventListener('click', () => {
      switchProject(index);
    });
    
    projectsList.appendChild(projectItem);
  });
}

// פונקציה למעבר בין פרויקטים
function switchProject(index) {
  if (index === currentProject) return;
  
  // שמירת הפרויקט הנוכחי לפני המעבר
  projects[currentProject].slides = slides;
  
  // מעבר לפרויקט החדש
  currentProject = index;
  slides = projects[currentProject].slides;
  
  // עדכון הממשק
  renderProjects();
  renderSlides();
  selectSlide(0);
  generatePreview();
  
  // שמירת הפרויקטים
  saveProjects();
}

// פונקציה לשמירת הפרויקטים ב-localStorage
function saveProjects() {
  // עדכון השקפים של הפרויקט הנוכחי
  projects[currentProject].slides = slides;
  
  // עדכון התמונה הממוזערת של הפרויקט הנוכחי
  if (slides.length > 0) {
    projects[currentProject].thumbnail = slides[0].image;
  }
  
  // שמירת הפרויקטים ב-localStorage
  localStorage.setItem('videoProjects', JSON.stringify(projects));
  localStorage.setItem('currentVideoProject', currentProject.toString());
}

// הוספת שקף חדש
function addSlide() {
  const newSlide = {
    text: 'שקף חדש',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85',
    font: 'Arial',
    fontSize: 36,
    textColor: '#ffffff',
    hasBg: true,
    bgColor: '#000000',
    bgOpacity: 0.7,
    pos: 'center',
    customPos: false,
    posX: 50,
    posY: 50,
    anim: 'fade',
    imageAnim: 'none',
    textAnimation: 'none',
    backgroundMusic: 'none',
    soundEffect: 'none'
  };
  
  slides.push(newSlide);
  renderSlides();
  selectSlide(slides.length - 1);
  generatePreview();
  saveProjects(); // שמירת הפרויקטים לאחר הוספת שקף
}

// מחיקת שקף
function deleteSlide(index) {
  if (slides.length > 1) {
    slides.splice(index, 1);
    renderSlides();
    selectSlide(Math.min(index, slides.length - 1));
    generatePreview();
    saveProjects(); // שמירת הפרויקטים לאחר מחיקת שקף
  } else {
    alert('לא ניתן למחוק את השקף האחרון');
  }
}

// שכפול שקף
function duplicateSlide(index) {
  const newSlide = JSON.parse(JSON.stringify(slides[index]));
  slides.splice(index + 1, 0, newSlide);
  renderSlides();
  selectSlide(index + 1);
  generatePreview();
  saveProjects(); // שמירת הפרויקטים לאחר שכפול שקף
}

// פונקציה לרינדור השקפים
function renderSlides() {
  const container = document.getElementById('slidesContainer');
  container.innerHTML = '';

  // הוספת הגדרות גלובליות
  const globalSettings = document.createElement('div');
  globalSettings.className = 'transition-time';
  globalSettings.innerHTML = `
    <div class="section-title">הגדרות גלובליות</div>
    <div class="option-group">
      <label class="option-label">זמן מעבר (שניות)
        <div class="tooltip"><i class="fas fa-info-circle"></i>
          <span class="tooltip-text">זמן המעבר בין השקפים בשניות</span>
        </div>
      </label>
      <input type="number" id="transitionTime" min="1" max="10" value="${transitionTime}" onchange="updateTransitionTime(this.value)">
    </div>
    <div class="option-group">
      <label class="option-label">עוצמת מוזיקת רקע
        <div class="tooltip"><i class="fas fa-info-circle"></i>
          <span class="tooltip-text">עוצמת מוזיקת הרקע</span>
        </div>
      </label>
      <div class="range-with-value">
        <input type="range" min="0" max="1" step="0.1" value="${musicVolume}" onchange="updateMusicVolume(this.value)">
        <span class="volume-value">${Math.round(musicVolume * 100)}%</span>
      </div>
    </div>
  `;
  container.appendChild(globalSettings);

  slides.forEach((s, i) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'slide-config';
    
    // יצירת כותרת השקף עם כפתורי פעולות
    const slideHeader = document.createElement('div');
    slideHeader.className = 'slide-header';
    slideHeader.innerHTML = `
      <div class="slide-number">שקף ${i + 1}</div>
      <div class="slide-actions">
        <button onclick="moveSlide(${i}, -1)" title="הזז למעלה"><i class="fas fa-arrow-up"></i></button>
        <button onclick="moveSlide(${i}, 1)" title="הזז למטה"><i class="fas fa-arrow-down"></i></button>
        <button onclick="duplicateSlide(${i})" title="שכפל שקף"><i class="fas fa-copy"></i></button>
        <button onclick="removeSlide(${i})" title="מחק שקף" class="danger"><i class="fas fa-trash"></i></button>
      </div>
    `;
    slideDiv.appendChild(slideHeader);

    // תוכן השקף
    slideDiv.innerHTML += `
      <div class="option-group">
        <label class="option-label">טקסט</label>
        <input type="text" value="${s.text}" oninput="updateSlideText(${i}, this.value)">
      </div>
      
      <div class="option-group">
        <label class="option-label">תמונת רקע</label>
        <input type="text" value="${s.image}" oninput="updateSlideImage(${i}, this.value)" placeholder="הזן URL של תמונה">
      </div>
      
      <div class="option-group">
        <label class="option-label">אנימציית מעבר</label>
        <select onchange="updateSlideTransition(${i}, this.value)">
          ${['fade', 'slide-right', 'slide-left', 'slide-up', 'slide-down', 'zoom-in', 'zoom-out', 'rotate', 'flip', 'bounce']
            .map(t => `<option value="${t}" ${s.anim === t ? 'selected' : ''}>${t}</option>`)
            .join('')}
        </select>
      </div>
      
      <div class="option-group">
        <label class="option-label">אנימציית תמונה</label>
        <select onchange="updateSlideImageAnimation(${i}, this.value)">
          ${['none', 'pulse', 'float', 'shake', 'blur-in', 'pan']
            .map(a => `<option value="${a}" ${s.imageAnim === a ? 'selected' : ''}>${a}</option>`)
            .join('')}
        </select>
      </div>
      
      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleSection(this)">
          <span>אפשרויות טקסט</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="collapsible-content text-options">
          <div class="option-group">
            <label class="option-label">גופן</label>
            <select onchange="updateSlideFont(${i}, this.value)">
              ${['Arial', 'Verdana', 'Tahoma', 'Times New Roman', 'Georgia', 'Courier New', 'Impact']
                .map(f => `<option value="${f}" ${s.font === f ? 'selected' : ''}>${f}</option>`)
                .join('')}
            </select>
          </div>
          
          <div class="option-group">
            <label class="option-label">גודל גופן (px)</label>
            <input type="number" value="${s.fontSize}" min="10" max="100" onchange="updateSlideFontSize(${i}, this.value)">
          </div>
          
          <div class="option-group">
            <label class="option-label">צבע טקסט</label>
            <input type="color" value="${s.textColor}" onchange="updateSlideTextColor(${i}, this.value)">
          </div>
          
          <div class="option-group">
            <label class="option-label">אנימציית טקסט</label>
            <select onchange="updateSlideTextAnimation(${i}, this.value)">
              ${['none', 'typing', 'wave', 'glow', 'shadow-pop', 'rainbow', 'blur-in-text', 'jump', 'fade-in-chars']
                .map(a => `<option value="${a}" ${s.textAnimation === a ? 'selected' : ''}>${a}</option>`)
                .join('')}
            </select>
          </div>
          
          <div class="option-group">
            <label>
              <input type="checkbox" ${s.hasBg ? 'checked' : ''} onchange="updateSlideTextBg(${i}, this.checked)">
              רקע לטקסט
            </label>
          </div>
          
          <div class="bg-options" style="display: ${s.hasBg ? 'block' : 'none'}">
            <div class="option-group">
              <label class="option-label">צבע רקע</label>
              <input type="color" value="${s.bgColor || '#000000'}" onchange="updateSlideBgColor(${i}, this.value)">
            </div>
            
            <div class="option-group">
              <label class="option-label">שקיפות רקע: ${s.bgOpacity || 0.5}</label>
              <input type="range" min="0" max="1" step="0.1" value="${s.bgOpacity || 0.5}" onchange="updateSlideBgOpacity(${i}, this.value)">
            </div>
          </div>
        </div>
      </div>
      
      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleSection(this)">
          <span>מיקום טקסט</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="collapsible-content position-options">
          <div class="option-group">
            <label>
              <input type="checkbox" ${s.customPos ? 'checked' : ''} onchange="updateSlideCustomPos(${i}, this.checked)">
              מיקום מותאם אישית
            </label>
          </div>
          
          <div class="preset-position" style="display: ${s.customPos ? 'none' : 'block'}">
            <div class="option-group">
              <label class="option-label">מיקום מוגדר מראש</label>
              <select onchange="updateSlidePosition(${i}, this.value)">
                ${['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']
                  .map(p => `<option value="${p}" ${s.pos === p ? 'selected' : ''}>${p}</option>`)
                  .join('')}
              </select>
            </div>
          </div>
          
          <div class="custom-position" style="display: ${s.customPos ? 'block' : 'none'}">
            <div class="option-group">
              <label class="option-label">מיקום אופקי (%)</label>
              <div class="range-with-value">
                <input type="range" min="0" max="100" value="${s.posX}" oninput="updateSlidePosX(${i}, this.value)">
                <span class="position-value">${s.posX}%</span>
              </div>
            </div>
            
            <div class="option-group">
              <label class="option-label">מיקום אנכי (%)</label>
              <div class="range-with-value">
                <input type="range" min="0" max="100" value="${s.posY}" oninput="updateSlidePosY(${i}, this.value)">
                <span class="position-value">${s.posY}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="option-group">
        <label class="option-label">מוזיקת רקע</label>
        <select onchange="updateBackgroundMusic(${i}, this.value)">
          ${['none', 'corporate', 'upbeat', 'relaxing', 'happy']
            .map(m => `<option value="${m}" ${s.backgroundMusic === m ? 'selected' : ''}>${m}</option>`)
            .join('')}
        </select>
      </div>
      
      <div class="option-group">
        <label class="option-label">אפקט קולי</label>
        <select onchange="updateSoundEffect(${i}, this.value)">
          ${['none', 'click', 'pop', 'whoosh']
            .map(s => `<option value="${s}" ${s.soundEffect === s ? 'selected' : ''}>${s}</option>`)
            .join('')}
        </select>
      </div>
    `;
    
    container.appendChild(slideDiv);
  });
}

function togglePositionControls(slideIndex) {
  const slide = slides[slideIndex];
  const presetPos = document.querySelector(`.slide-config:nth-child(${slideIndex+1}) .preset-position`);
  const customPos = document.querySelector(`.slide-config:nth-child(${slideIndex+1}) .custom-position`);
  
  if (presetPos && customPos) {
    presetPos.style.display = slide.customPos ? 'none' : 'block';
    customPos.style.display = slide.customPos ? 'block' : 'none';
  }
}

function toggleBgOptions(slideIndex) {
  const slide = slides[slideIndex];
  const bgOptions = document.querySelector(`.slide-config:nth-child(${slideIndex+1}) .bg-options`);
  
  if (bgOptions) {
    bgOptions.style.display = slide.hasBg ? 'block' : 'none';
  }
}

function updatePositionValues(slideIndex) {
  const posXValue = document.querySelector(`.slide-config:nth-child(${slideIndex+1}) .custom-position input[type="range"]:nth-of-type(1) + .position-value`);
  const posYValue = document.querySelector(`.slide-config:nth-child(${slideIndex+1}) .custom-position input[type="range"]:nth-of-type(2) + .position-value`);
  
  if (posXValue && posYValue) {
    const posXInput = document.querySelector(`.slide-config:nth-child(${slideIndex+1}) .custom-position input[type="range"]:nth-of-type(1)`);
    const posYInput = document.querySelector(`.slide-config:nth-child(${slideIndex+1}) .custom-position input[type="range"]:nth-of-type(2)`);
    
    if (posXInput && posYInput) {
      posXInput.addEventListener('input', function() {
        posXValue.textContent = this.value + '%';
      });
      
      posYInput.addEventListener('input', function() {
        posYValue.textContent = this.value + '%';
      });
    }
  }
}

function generatePreview(){
  generatePreview();
  let html=document.getElementById('previewFrame').contentWindow.document.documentElement.outerHTML;
  let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));
  a.download='banner.html';a.click();
}

function editAgain(){renderSlides();}
window.onload=init;

// פונקציות עדכון לשקיפות
function updateTransitionTime(value) {
  transitionTime = parseInt(value);
  generatePreview();
}

function updateSlideText(index, value) {
  slides[index].text = value;
  generatePreview();
}

function updateSlideImage(index, value) {
  slides[index].image = value;
  generatePreview();
}

function updateSlideFont(index, value) {
  slides[index].font = value;
  generatePreview();
}

function updateSlideFontSize(index, value) {
  slides[index].fontSize = value;
  generatePreview();
}

function updateSlideTextColor(index, value) {
  slides[index].textColor = value;
  generatePreview();
}

function updateSlideHasBg(index, value) {
  slides[index].hasBg = value;
  generatePreview();
}

function updateSlideBgColor(index, value) {
  slides[index].bgColor = value;
  generatePreview();
}

function updateSlideBgOpacity(index, value) {
  slides[index].bgOpacity = parseFloat(value);
  generatePreview();
}

function updateSlidePosition(index, value) {
  slides[index].pos = value;
  slides[index].customPos = value === 'custom';
  generatePreview();
}

function updateSlidePositionX(index, value) {
  slides[index].posX = value;
  generatePreview();
}

function updateSlidePositionY(index, value) {
  slides[index].posY = value;
  generatePreview();
}

function updateSlideAnimation(index, value) {
  slides[index].anim = value;
  generatePreview();
}

function updateSlideImageAnimation(index, value) {
  slides[index].imageAnim = value;
  generatePreview();
}

function updateSlideTextAnimation(index, value) {
  slides[index].textAnimation = value;
  generatePreview();
}

function updateBackgroundMusic(index, value) {
  slides[index].backgroundMusic = value;
  generatePreview();
}

function updateSoundEffect(index, value) {
  slides[index].soundEffect = value;
  generatePreview();
}

function updateMusicVolume(value) {
  musicVolume = parseFloat(value);
  document.querySelector('.volume-value').textContent = Math.round(value * 100) + '%';
  generatePreview();
  saveProjects(); // שמירת הפרויקטים לאחר שינוי עוצמת המוזיקה
}

// פונקציות לניהול שקפים
function removeSlide(index) {
  if (slides.length <= 1) {
    alert('לא ניתן למחוק את השקף האחרון');
    return;
  }
  
  // מחיקת השקף מהמערך
  slides.splice(index, 1);
  
  // עדכון ממשק המשתמש
  renderSlides();
  selectSlide(Math.min(index, slides.length - 1));
  generatePreview();
}

function duplicateSlide(index) {
  // יצירת עותק עמוק של השקף
  const newSlide = JSON.parse(JSON.stringify(slides[index]));
  
  // הוספת השקף החדש למערך אחרי השקף המקורי
  slides.splice(index + 1, 0, newSlide);
  
  // עדכון ממשק המשתמש
  renderSlides();
  selectSlide(index + 1);
  generatePreview();
}

function moveSlide(index, direction) {
  // חישוב האינדקס החדש
  const newIndex = index + direction;
  
  // בדיקה שהאינדקס החדש בטווח תקין
  if (newIndex < 0 || newIndex >= slides.length) {
    return;
  }
  
  // החלפת מיקום השקפים
  const temp = slides[index];
  slides[index] = slides[newIndex];
  slides[newIndex] = temp;
  
  // עדכון ממשק המשתמש
  renderSlides();
  selectSlide(newIndex);
  generatePreview();
}

// מאזיני אירועים לאפשרויות השקף
function setupEventListeners() {
  // אין צורך במאזינים אלה כי הם מוגדרים ישירות ב-HTML
  // document.querySelector('.add-slide').addEventListener('click', addSlide);
  // document.querySelector('.transition-time-input').addEventListener('input', updateTransitionTime);
  // document.querySelector('.download-btn').addEventListener('click', downloadHTML);
  
  // מאזיני אירועים לאפשרויות שקף
  // document.querySelectorAll('.slides-container').forEach(container => {
  //   container.addEventListener('click', function(e) {
  //     if (e.target.classList.contains('slide-config')) {
  //       const slideIndex = parseInt(e.target.dataset.index);
  //       selectSlide(slideIndex);
  //     } else if (e.target.classList.contains('delete-slide')) {
  //       const slideIndex = parseInt(e.target.dataset.index);
  //       deleteSlide(slideIndex);
  //     }
  //   });
  // });
  
  // מאזיני אירועים לשינויי הגדרות שקף
  document.querySelector('.slide-text').addEventListener('input', function() {
    updateSlideText(currentSlide, this.value);
  });
  
  document.querySelector('.slide-image').addEventListener('input', function() {
    updateSlideImage(currentSlide, this.value);
  });
  
  document.querySelector('.slide-font').addEventListener('change', function() {
    updateSlideFont(currentSlide, this.value);
  });
  
  document.querySelector('.slide-font-size').addEventListener('input', function() {
    updateSlideFontSize(currentSlide, this.value);
  });
  
  document.querySelector('.slide-text-color').addEventListener('input', function() {
    updateSlideTextColor(currentSlide, this.value);
  });
  
  document.querySelector('.slide-has-bg').addEventListener('change', function() {
    updateSlideTextBg(currentSlide, this.checked);
    toggleBgOptions(currentSlide);
  });
  
  document.querySelector('.slide-bg-color').addEventListener('input', function() {
    updateSlideBgColor(currentSlide, this.value);
  });
  
  document.querySelector('.slide-bg-opacity').addEventListener('input', function() {
    updateSlideBgOpacity(currentSlide, this.value);
    document.querySelector('.opacity-value').textContent = Math.round(this.value * 100) + '%';
  });
  
  document.querySelector('.slide-position').addEventListener('change', function() {
    updateSlidePosition(currentSlide, this.value);
    togglePositionControls(currentSlide);
  });
  
  document.querySelector('.slide-pos-x').addEventListener('input', function() {
    updateSlidePositionX(currentSlide, this.value);
  });
  
  document.querySelector('.slide-pos-y').addEventListener('input', function() {
    updateSlidePositionY(currentSlide, this.value);
  });
  
  document.querySelector('.slide-animation').addEventListener('change', function() {
    updateSlideAnimation(currentSlide, this.value);
  });
  
  document.querySelector('.slide-image-animation').addEventListener('change', function() {
    updateSlideImageAnimation(currentSlide, this.value);
  });
  
  document.querySelector('.slide-text-animation').addEventListener('change', function() {
    updateSlideTextAnimation(currentSlide, this.value);
  });
  
  document.querySelector('.background-music').addEventListener('change', function() {
    updateBackgroundMusic(currentSlide, this.value);
  });
  
  document.querySelector('.sound-effect').addEventListener('change', function() {
    updateSoundEffect(currentSlide, this.value);
  });
}

// בחירת שקף לעריכה
function selectSlide(index) {
  currentSlide = index;
  
  // עדכון ממשק המשתמש עם ערכי השקף הנוכחי
  const slide = slides[index];
  
  document.querySelector('.slide-text').value = slide.text || '';
  document.querySelector('.slide-image').value = slide.image || '';
  document.querySelector('.slide-font').value = slide.font || 'Arial';
  document.querySelector('.slide-font-size').value = slide.fontSize || 24;
  document.querySelector('.slide-text-color').value = slide.textColor || '#ffffff';
  document.querySelector('.slide-has-bg').checked = slide.hasBg || false;
  document.querySelector('.bg-options').style.display = slide.hasBg ? 'block' : 'none';
  document.querySelector('.slide-bg-color').value = slide.bgColor || '#000000';
  document.querySelector('.slide-bg-opacity').value = slide.bgOpacity !== undefined ? slide.bgOpacity : 0.5;
  document.querySelector('.opacity-value').textContent = Math.round((slide.bgOpacity !== undefined ? slide.bgOpacity : 0.5) * 100) + '%';
  document.querySelector('.slide-position').value = slide.customPos ? 'custom' : (slide.pos || 'center');
  document.querySelector('.custom-position').style.display = slide.customPos ? 'block' : 'none';
  document.querySelector('.slide-pos-x').value = slide.posX || 50;
  document.querySelector('.slide-pos-y').value = slide.posY || 50;
  document.querySelector('.slide-animation').value = slide.anim || 'fade';
  document.querySelector('.slide-image-animation').value = slide.imageAnim || 'none';
  document.querySelector('.slide-text-animation').value = slide.textAnimation || 'none';
  document.querySelector('.background-music').value = slide.backgroundMusic || 'none';
  document.querySelector('.sound-effect').value = slide.soundEffect || 'none';
  
  // הדגשת השקף הנבחר
  document.querySelectorAll('.slide-config').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.slide-config[data-index="${index}"]`).classList.add('active');
}

// הוספת שקף חדש
function addSlide() {
  const newSlide = {
    text: 'שקף חדש',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85',
    font: 'Arial',
    fontSize: 36,
    textColor: '#ffffff',
    hasBg: true,
    bgColor: '#000000',
    bgOpacity: 0.7,
    pos: 'center',
    customPos: false,
    posX: 50,
    posY: 50,
    anim: 'fade',
    imageAnim: 'none',
    textAnimation: 'none',
    backgroundMusic: 'none',
    soundEffect: 'none'
  };
  
  slides.push(newSlide);
  renderSlides();
  selectSlide(slides.length - 1);
  generatePreview();
  saveProjects(); // שמירת הפרויקטים לאחר הוספת שקף
}

// מחיקת שקף
function deleteSlide(index) {
  if (slides.length > 1) {
    slides.splice(index, 1);
    renderSlides();
    selectSlide(Math.min(index, slides.length - 1));
    generatePreview();
    saveProjects(); // שמירת הפרויקטים לאחר מחיקת שקף
  } else {
    alert('לא ניתן למחוק את השקף האחרון');
  }
}

// שכפול שקף
function duplicateSlide(index) {
  const newSlide = JSON.parse(JSON.stringify(slides[index]));
  slides.splice(index + 1, 0, newSlide);
  renderSlides();
  selectSlide(index + 1);
  generatePreview();
  saveProjects(); // שמירת הפרויקטים לאחר שכפול שקף
}

// פונקציות לתבניות
function showTemplates() {
  const modal = document.getElementById('templatesModal');
  modal.style.display = 'block';
  
  // הוספת מאזיני אירועים לסגירת החלון
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // סגירת החלון בלחיצה מחוץ לתוכן
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // הוספת מאזיני אירועים לבחירת תבנית
  const templateItems = modal.querySelectorAll('.template-item');
  templateItems.forEach(item => {
    item.addEventListener('click', function() {
      const templateName = this.getAttribute('data-template');
      applyTemplate(templateName);
      modal.style.display = 'none';
    });
  });
}

function applyTemplate(templateName) {
  // מחיקת השקפים הקיימים
  slides = [];
  
  // הוספת שקפים חדשים בהתאם לתבנית שנבחרה
  switch(templateName) {
    case 'business':
      slides = [
        {
          text: 'פתרונות עסקיים מתקדמים',
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
          font: 'Arial',
          fontSize: 40,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#000000',
          bgOpacity: 0.7,
          pos: 'center',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'fade',
          imageAnim: 'none',
          textAnimation: 'typing',
          backgroundMusic: 'corporate',
          soundEffect: 'none'
        },
        {
          text: 'שירותים מקצועיים',
          image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72',
          font: 'Arial',
          fontSize: 36,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#0055aa',
          bgOpacity: 0.6,
          pos: 'top',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'slide-up',
          imageAnim: 'none',
          textAnimation: 'glow',
          backgroundMusic: 'corporate',
          soundEffect: 'none'
        },
        {
          text: 'צור קשר עוד היום',
          image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a',
          font: 'Arial',
          fontSize: 32,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#000000',
          bgOpacity: 0.5,
          pos: 'bottom',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'zoom-in',
          imageAnim: 'none',
          textAnimation: 'none',
          backgroundMusic: 'corporate',
          soundEffect: 'none'
        }
      ];
      break;
    case 'education':
      slides = [
        {
          text: 'למידה חדשנית',
          image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
          font: 'Verdana',
          fontSize: 42,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#3498db',
          bgOpacity: 0.7,
          pos: 'center',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'fade',
          imageAnim: 'none',
          textAnimation: 'typing',
          backgroundMusic: 'upbeat',
          soundEffect: 'none'
        },
        {
          text: 'קורסים מקצועיים',
          image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
          font: 'Verdana',
          fontSize: 36,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#2980b9',
          bgOpacity: 0.6,
          pos: 'top',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'slide-up',
          imageAnim: 'none',
          textAnimation: 'glow',
          backgroundMusic: 'upbeat',
          soundEffect: 'none'
        },
        {
          text: 'הצטרפו אלינו ללמידה',
          image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45',
          font: 'Verdana',
          fontSize: 32,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#3498db',
          bgOpacity: 0.5,
          pos: 'bottom',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'zoom-in',
          imageAnim: 'none',
          textAnimation: 'none',
          backgroundMusic: 'upbeat',
          soundEffect: 'none'
        }
      ];
      break;
    case 'creative':
      slides = [
        {
          text: 'יצירתיות ללא גבולות',
          image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
          font: 'Tahoma',
          fontSize: 42,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#9b59b6',
          bgOpacity: 0.7,
          pos: 'center',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'fade',
          imageAnim: 'pulse',
          textAnimation: 'rainbow',
          backgroundMusic: 'relaxing',
          soundEffect: 'none'
        },
        {
          text: 'עיצוב מודרני',
          image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae',
          font: 'Tahoma',
          fontSize: 36,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#8e44ad',
          bgOpacity: 0.6,
          pos: 'top',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'slide-up',
          imageAnim: 'float',
          textAnimation: 'glow',
          backgroundMusic: 'relaxing',
          soundEffect: 'none'
        },
        {
          text: 'הגשימו את החלום',
          image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73',
          font: 'Tahoma',
          fontSize: 32,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#9b59b6',
          bgOpacity: 0.5,
          pos: 'bottom',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'zoom-in',
          imageAnim: 'blur',
          textAnimation: 'wave',
          backgroundMusic: 'relaxing',
          soundEffect: 'none'
        }
      ];
      break;
    case 'nature':
      // תבנית טבע
      slides = [
        {
          text: 'הטבע במיטבו',
          image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
          font: 'David',
          fontSize: 42,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#27ae60',
          bgOpacity: 0.7,
          pos: 'center',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'fade',
          imageAnim: 'pan',
          textAnimation: 'typing',
          backgroundMusic: 'relaxing',
          soundEffect: 'none'
        },
        {
          text: 'נופים מרהיבים',
          image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
          font: 'David',
          fontSize: 36,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#2ecc71',
          bgOpacity: 0.6,
          pos: 'top',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'slide-up',
          imageAnim: 'float',
          textAnimation: 'glow',
          backgroundMusic: 'relaxing',
          soundEffect: 'none'
        },
        {
          text: 'שמירה על הסביבה',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
          font: 'David',
          fontSize: 32,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#27ae60',
          bgOpacity: 0.5,
          pos: 'bottom',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'zoom-in',
          imageAnim: 'pulse',
          textAnimation: 'none',
          backgroundMusic: 'relaxing',
          soundEffect: 'none'
        }
      ];
      break;
    case 'travel':
      // תבנית טיולים
      slides = [
        {
          text: 'טיולים בעולם',
          image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
          font: 'Arial',
          fontSize: 42,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#e67e22',
          bgOpacity: 0.7,
          pos: 'center',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'fade',
          imageAnim: 'pan',
          textAnimation: 'typing',
          backgroundMusic: 'upbeat',
          soundEffect: 'none'
        },
        {
          text: 'יעדים מומלצים',
          image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d',
          font: 'Arial',
          fontSize: 36,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#d35400',
          bgOpacity: 0.6,
          pos: 'top',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'slide-up',
          imageAnim: 'float',
          textAnimation: 'glow',
          backgroundMusic: 'upbeat',
          soundEffect: 'none'
        },
        {
          text: 'הרפתקאות מרגשות',
          image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
          font: 'Arial',
          fontSize: 32,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#e67e22',
          bgOpacity: 0.5,
          pos: 'bottom',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'zoom-in',
          imageAnim: 'pulse',
          textAnimation: 'none',
          backgroundMusic: 'upbeat',
          soundEffect: 'none'
        }
      ];
      break;
    case 'food':
      // תבנית אוכל
      slides = [
        {
          text: 'חוויות קולינריות',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
          font: 'David',
          fontSize: 42,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#c0392b',
          bgOpacity: 0.7,
          pos: 'center',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'fade',
          imageAnim: 'pulse',
          textAnimation: 'typing',
          backgroundMusic: 'happy',
          soundEffect: 'none'
        },
        {
          text: 'מתכונים מיוחדים',
          image: 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65',
          font: 'David',
          fontSize: 36,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#e74c3c',
          bgOpacity: 0.6,
          pos: 'top',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'slide-up',
          imageAnim: 'float',
          textAnimation: 'glow',
          backgroundMusic: 'happy',
          soundEffect: 'none'
        },
        {
          text: 'טעמים מהעולם',
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f',
          font: 'David',
          fontSize: 32,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#c0392b',
          bgOpacity: 0.5,
          pos: 'bottom',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'zoom-in',
          imageAnim: 'pulse',
          textAnimation: 'none',
          backgroundMusic: 'happy',
          soundEffect: 'none'
        }
      ];
      break;
    default:
      // תבנית ברירת מחדל
      slides = [
        {
          text: 'ברוכים הבאים למערכת יצירת סרטונים',
          image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
          font: 'Arial',
          fontSize: 36,
          textColor: '#ffffff',
          hasBg: true,
          bgColor: '#000000',
          bgOpacity: 0.7,
          pos: 'center',
          customPos: false,
          posX: 50,
          posY: 50,
          anim: 'fade',
          imageAnim: 'none',
          textAnimation: 'typing',
          backgroundMusic: 'none',
          soundEffect: 'none'
        }
      ];
  }
  
  // עדכון ממשק המשתמש
  renderSlides();
  selectSlide(0);
  generatePreview();
}

function showTransitionEffects() {
  const modal = document.getElementById('transitionEffectsModal');
  modal.style.display = 'block';
  
  // הוספת מאזיני אירועים לסגירת החלון
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // סגירת החלון בלחיצה מחוץ לתוכן
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // הוספת מאזיני אירועים לבחירת אפקט
  const effectItems = modal.querySelectorAll('.effect-item');
  effectItems.forEach(item => {
    item.addEventListener('click', function() {
      const effectName = this.getAttribute('data-effect');
      applyTransitionEffect(effectName);
      modal.style.display = 'none';
    });
  });
}

function applyTransitionEffect(effectName) {
  slides[currentSlide].anim = effectName;
  document.querySelector('.slide-animation').value = effectName;
  generatePreview();
}

function toggleEditMode() {
  const previewFrame = document.getElementById('previewFrame');
  const editModeBtn = document.getElementById('editModeBtn');
  
  // בדיקה אם כפתור מצב עריכה קיים
  if (!editModeBtn) return;
  
  // החלפת מצב העריכה
  const isEditMode = editModeBtn.classList.toggle('active');
  
  // שליחת הודעה ל-iframe
  if (previewFrame && previewFrame.contentWindow) {
    previewFrame.contentWindow.postMessage({
      type: 'toggle-edit-mode',
      enabled: isEditMode
    }, '*');
  }
  
  // עדכון טקסט הכפתור
  editModeBtn.innerHTML = isEditMode ? 
    '<i class="fas fa-mouse-pointer"></i> סיום מצב עריכה' : 
    '<i class="fas fa-mouse-pointer"></i> עריכת מיקום';
}
