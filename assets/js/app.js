/* app.js - shared utilities used by all pages
   - auth (signup/login)
   - progress (LocalStorage per-user)
   - small UI helpers (toast, back safe)
   - index/course/dashboard page initializers call these functions
*/

const LS = {
  COURSES: 'learnify_courses',
  USERS: 'learnify_users',
  CURRENT: 'learnify_current',
  PROGRESS: 'learnify_progress',
  CERTS: 'learnify_certs'
};

function getCourses(){
  return JSON.parse(localStorage.getItem(LS.COURSES) || '[]');
}
function saveCourses(arr){
  localStorage.setItem(LS.COURSES, JSON.stringify(arr));
}
function getUsers(){ return JSON.parse(localStorage.getItem(LS.USERS) || '[]'); }
function saveUsers(u){ localStorage.setItem(LS.USERS, JSON.stringify(u)); }
function getCurrent(){ return JSON.parse(localStorage.getItem(LS.CURRENT) || 'null'); }
function setCurrent(u){ localStorage.setItem(LS.CURRENT, JSON.stringify(u)); }
function getProgress(){ return JSON.parse(localStorage.getItem(LS.PROGRESS) || '{}'); }
function saveProgress(p){ localStorage.setItem(LS.PROGRESS, JSON.stringify(p)); }
function getCerts(){ return JSON.parse(localStorage.getItem(LS.CERTS) || '[]'); }
function saveCerts(c){ localStorage.setItem(LS.CERTS, JSON.stringify(c)); }

/* UI helpers */
function toast(msg, ms=3000){
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg; el.classList.remove('hidden');
  setTimeout(()=> el.classList.add('hidden'), ms);
}

/* safe back button */
function goBackSafe(){
  if (document.referrer && document.referrer !== window.location.href) window.history.back();
  else window.location.href = 'index.html';
}

/* render nav user area (used on each page) */
function renderNavUserArea(){
  const container = document.getElementById('navUserArea');
  if (!container) return;
  const user = getCurrent();
  if (user) {
    container.innerHTML = `<span class="muted">Hi, ${user.name}</span>
      <a class="btn ghost" href="profile.html" style="margin-left:8px">Profile</a>
      <button id="logoutBtn" class="btn ghost">Logout</button>`;
    document.getElementById('logoutBtn').onclick = ()=> {
      localStorage.removeItem(LS.CURRENT);
      renderNavUserArea();
      toast('Logged out');
      window.location.href = 'index.html';
    };
  } else {
    container.innerHTML = `<a class="btn ghost" href="login.html">Login</a>
      <a class="btn primary" href="signup.html" style="margin-left:8px">Sign up</a>`;
  }
}

/* progress helpers */
function userToggleLessonComplete(courseId, lessonId){
  const user = getCurrent();
  if (!user) { toast('Please login'); window.location.href='login.html'; return false; }
  const prog = getProgress();
  prog[user.id] = prog[user.id] || {};
  prog[user.id][lessonId] = !prog[user.id][lessonId];
  saveProgress(prog);
  return prog[user.id][lessonId];
}
function userIsLessonComplete(courseId, lessonId){
  const user = getCurrent(); if (!user) return false;
  const prog = getProgress(); return !!(prog[user.id] && prog[user.id][lessonId]);
}
function userCourseProgress(courseId){
  const courses = getCourses();
  const course = courses.find(c=>c.id===courseId); if(!course) return 0;
  const total = course.lessons.length;
  const user = getCurrent(); if (!user) return 0;
  const prog = getProgress(); const done = course.lessons.reduce((s,l)=> s + (prog[user.id] && prog[user.id][l.id] ? 1 : 0), 0);
  return Math.round((done/total)*100);
}

/* certificate generator - simple canvas */
function generateCertificateImage(name, courseTitle, pct, dateStr){
  const date = dateStr || new Date().toISOString().split('T')[0];
  const canvas = document.getElementById('certCanvas') || document.createElement('canvas');
  canvas.width = 1200; canvas.height = 675;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#f3f4ff'; ctx.fillRect(60,60,canvas.width-120,120);
  ctx.fillStyle = '#0f1724'; ctx.font = '48px Roboto'; ctx.fillText('Certificate of Completion', 100, 150);
  ctx.font = '28px Roboto'; ctx.fillText(courseTitle, 100, 240);
  ctx.font = '36px Roboto'; ctx.fillText(`Awarded to: ${name}`, 100, 320);
  ctx.font = '20px Roboto'; ctx.fillStyle = '#374151'; ctx.fillText(`Score: ${pct}% • Date: ${date}`, 100, 380);
  ctx.beginPath(); ctx.arc(canvas.width - 180, 180, 80, 0, Math.PI*2); ctx.fillStyle = '#7c4dff'; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font='28px Roboto'; ctx.fillText('PASS', canvas.width - 220, 195);

  return canvas.toDataURL('image/png');
}
