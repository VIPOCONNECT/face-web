// החלפת טקסט בכותרת
const texts = [
  'היופי שלך, הטיפול שלנו.',
  'להיראות טוב יותר, להרגיש נפלא.',
  'פנקי את עצמך בעור זוהר.',
  'הגיע הזמן להתחדש ביופי מושלם.'
];

const changingText = document.getElementById('changing-text');
let currentIndex = 0;

setInterval(() => {
  changingText.style.opacity = 0;
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % texts.length;
    changingText.textContent = texts[currentIndex];
    changingText.style.opacity = 1;
  }, 1000);
}, 5000);

// רקעים מתחלפים לטיפולי בוטוקס (123)
const botoxSection = document.getElementById('botox-treatments');
const botoxImages = [
  'https://raw.githubusercontent.com/VIPOCONNECT/-12/refs/heads/main/images/1.webp',
  'https://raw.githubusercontent.com/VIPOCONNECT/-12/refs/heads/main/images/2.webp',
  'https://raw.githubusercontent.com/VIPOCONNECT/-12/refs/heads/main/images/3.webp'
];

let botoxIndex = 0;
setInterval(() => {
  botoxSection.style.backgroundImage = `url(${botoxImages[botoxIndex]})`;
  botoxIndex = (botoxIndex + 1) % botoxImages.length;
}, 4000);

// רקעים מתחלפים לטיפולי פנים (456)
const faceSection = document.getElementById('face-treatments');
const faceImages = [
  'https://raw.githubusercontent.com/VIPOCONNECT/-12/refs/heads/main/images/4.webp',
  'https://raw.githubusercontent.com/VIPOCONNECT/-12/refs/heads/main/images/5.webp',
  'https://raw.githubusercontent.com/VIPOCONNECT/-12/refs/heads/main/images/6.webp'
];

let faceIndex = 0;
setInterval(() => {
  faceSection.style.backgroundImage = `url(${faceImages[faceIndex]})`;
  faceIndex = (faceIndex + 1) % faceImages.length;
}, 4000);

// טיפול בתפריט מובייל
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');
  
  // פונקצית פתיחת וסגירת תפריט
  burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    
    // אנימציה לתפריט
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      }
    });
  });
  
  // סגירת תפריט בלחיצה על קישור
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-active');
      burger.classList.remove('toggle');
      navLinks.forEach(link => {
        link.style.animation = '';
      });
    });
  });
  
  // גלילה לסקשנים בלחיצה על קישורים
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // גלילה לטופס צור קשר
  document.querySelectorAll('[data-scroll-to]').forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-scroll-to');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // תיקון תצוגת וידאו ברקע לפי גודל המסך
  function adjustVideoSize() {
    const video = document.getElementById('background-video');
    
    if (window.innerWidth <= 480) {
      video.style.width = '180%';
      video.style.height = '180%';
      video.style.transform = 'translate(-50%, -50%) scale(0.6)';
    } else if (window.innerWidth <= 768) {
      video.style.width = '150%';
      video.style.height = '150%';
      video.style.transform = 'translate(-50%, -50%) scale(0.8)';
    } else if (window.innerWidth <= 1024) {
      video.style.width = '140%';
      video.style.height = '140%';
      video.style.transform = 'translate(-50%, -50%) scale(0.7)';
    } else {
      video.style.width = '130%';
      video.style.height = '130%';
      video.style.transform = 'translate(-50%, -50%) scale(0.7)';
    }
  }
  
  // התאמת גודל וידאו באתחול ובשינוי גודל מסך
  window.addEventListener('load', adjustVideoSize);
  window.addEventListener('resize', adjustVideoSize);
});
