
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
