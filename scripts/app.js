/* app.js - main application logic for Learnify SPA */
const LS_KEYS = {
  COURSES: 'learnify_courses',
  USERS: 'learnify_users',
  CURRENT: 'learnify_current',
  PROGRESS: 'learnify_progress',
  THEME: 'learnify_theme',
  CERTS: 'learnify_certs'
};

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* --- initial boot --- */
let COURSES = JSON.parse(localStorage.getItem(LS_KEYS.COURSES) || '[]');
let USERS = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || '[]');
let PROGRESS = JSON.parse(localStorage.getItem(LS_KEYS.PROGRESS) || '{}');
let CERTS = JSON.parse(localStorage.getItem(LS_KEYS.CERTS) || '[]');
let CURRENT = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT) || 'null');

/* elements */
const views = $$('.view');
const toastEl = $('#toast');
const userArea = $('#userArea');
const searchInput = $('#searchInput');
const featuredList = $('#featuredList');
const coursesGrid = $('#coursesGrid');
const filterCategory = $('#filterCategory');
const sortBy = $('#sortBy');
const categoriesWrap = $('#categories');

/* theme */
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(LS_KEYS.THEME, theme);
}
(function initTheme(){
  const saved = localStorage.getItem(LS_KEYS.THEME) || 'light';
  applyTheme(saved);
})();

/* toast */
function toast(msg, ms=3000){
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden');
  setTimeout(()=> toastEl.classList.add('hidden'), ms);
}

/* auth */
function renderUserArea(){
  if (CURRENT) {
    userArea.innerHTML = `<span class="muted">Hi, ${CURRENT.name}</span>
      <button id="logoutBtn" class="btn ghost">Logout</button>`;
    $('#logoutBtn').onclick = () => {
      CURRENT = null;
      localStorage.removeItem(LS_KEYS.CURRENT);
      renderUserArea();
      navigate('home');
    };
  } else {
    userArea.innerHTML = `<button class="btn ghost" id="loginNav">Login</button>
      <button class="btn primary" id="signupNav">Sign up</button>`;
    $('#loginNav').onclick = ()=> navigate('login');
    $('#signupNav').onclick = ()=> navigate('signup');
  }
}
renderUserArea();

/* routing */
function hideAllViews(){ views.forEach(v=>v.classList.add('hidden')); }
function navigate(route, opts){
  hideAllViews();
  if (route === 'home') $('#view-home').classList.remove('hidden');
  if (route === 'courses') {
    $('#view-courses').classList.remove('hidden');
    renderCourses();
  }
  if (route === 'course') {
    $('#view-course').classList.remove('hidden');
    renderCourse(opts.courseId);
  }
  if (route === 'lesson') {
    $('#view-lesson').classList.remove('hidden');
    renderLesson(opts.courseId, opts.lessonId);
  }
  if (route === 'quiz') {
    $('#view-quiz').classList.remove('hidden');
    renderQuiz(opts.courseId);
  }
  if (route === 'dashboard') {
    $('#view-dashboard').classList.remove('hidden');
    renderDashboard();
  }
  if (route === 'certificates') {
    $('#view-certificates').classList.remove('hidden');
    renderCertificates();
  }
  if (route === 'login') $('#view-login').classList.remove('hidden');
  if (route === 'signup') $('#view-signup').classList.remove('hidden');
  if (route === 'about') $('#view-about').classList.remove('hidden');
  // update nav highlight (simple)
}

/* initial nav bindings */
$$('[data-route]').forEach(el=>{
  el.addEventListener('click', e=>{
    const r = el.getAttribute('data-route');
    navigate(r);
  });
});
$('#menuBtn').addEventListener('click', ()=> {
  const sb = $('#sidebar');
  sb.style.display = sb.style.display === 'block' ? '' : 'block';
});
$('#themeToggle').addEventListener('click', ()=>{
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* login/signup */
$('#toSignup')?.addEventListener('click', ()=> navigate('signup'));
$('#toLogin')?.addEventListener('click', ()=> navigate('login'));

$('#signupBtn')?.addEventListener('click', ()=>{
  const name = $('#signupName').value.trim();
  const email = $('#signupEmail').value.trim().toLowerCase();
  const pass = $('#signupPassword').value;
  if (!name || !email || !pass) return toast('Please complete all fields');
  if (USERS.find(u=>u.email===email)) return toast('Email already used');
  const user = {id: 'u_'+Date.now(), name, email, pass};
  USERS.push(user);
  localStorage.setItem(LS_KEYS.USERS, JSON.stringify(USERS));
  CURRENT = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(LS_KEYS.CURRENT, JSON.stringify(CURRENT));
  renderUserArea();
  toast('Account created — welcome!');
  navigate('courses');
});

$('#loginBtn')?.addEventListener('click', ()=>{
  const email = $('#loginEmail').value.trim().toLowerCase();
  const pass = $('#loginPassword').value;
  const user = USERS.find(u=>u.email===email && u.pass===pass);
  if (!user) return toast('Invalid credentials');
  CURRENT = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(LS_KEYS.CURRENT, JSON.stringify(CURRENT));
  renderUserArea();
  toast('Logged in');
  navigate('dashboard');
});

/* search */
searchInput.addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if (q.length === 0) {
    renderFeatured();
    return;
  }
  // filter featured or courses grid
  const results = COURSES.filter(c => (c.title+c.description+(c.category||'')).toLowerCase().includes(q) ||
    c.lessons.some(ls => (ls.title + (ls.content||'')).toLowerCase().includes(q))
  );
  renderCourseGrid(results, coursesGrid);
});

/* load courses list into UI */
function renderFeatured(){
  const list = COURSES.slice(0,4);
  featuredList.innerHTML = '';
  list.forEach(c => {
    const el = document.createElement('div');
    el.className = 'card course-card';
    el.innerHTML = `
      <div class="title">${c.title}</div>
      <div class="course-meta">${c.category} • ${c.difficulty}</div>
      <p class="muted">${c.description}</p>
      <div style="margin-top:.6rem">
        <button class="btn ghost" data-id="${c.id}">Preview</button>
        <button class="btn primary" data-start="${c.id}">Start</button>
      </div>
    `;
    featuredList.appendChild(el);
  });
  // event delegation
  featuredList.querySelectorAll('[data-id]').forEach(b=> b.addEventListener('click', e=> {
    const id = b.getAttribute('data-id');
    navigate('course', { courseId: id });
  }));
  featuredList.querySelectorAll('[data-start]').forEach(b=> b.addEventListener('click', e=> {
    const id = b.getAttribute('data-start');
    if (!CURRENT) { toast('Please login to track progress'); navigate('login'); return; }
    navigate('course', { courseId: id });
  }));
}

function populateCategories(){
  const cats = Array.from(new Set(COURSES.map(c=>c.category)));
  filterCategory.innerHTML = '<option value="">All categories</option>' + cats.map(cat=>`<option value="${cat}">${cat}</option>`).join('');
  categoriesWrap.innerHTML = cats.map(cat=>`<div class="chip" data-cat="${cat}">${cat}</div>`).join('');
  categoriesWrap.querySelectorAll('.chip').forEach(ch => ch.addEventListener('click', ()=>{
    const cat = ch.getAttribute('data-cat');
    filterCategory.value = cat;
    renderCourses();
  }));
}

function renderCourses(){
  populateCategories();
  renderCourseGrid(COURSES, coursesGrid);
}

function renderCourseGrid(list, container){
  container.innerHTML = '';
  // apply sorting
  const sort = sortBy.value;
  let sorted = Array.from(list);
  if (sort === 'progress' && CURRENT) {
    sorted.sort((a,b) => {
      const pa = getCourseProgress(a.id), pb = getCourseProgress(b.id);
      return pb - pa; // highest first
    });
  }
  sorted.forEach(c => {
    const progress = Math.round(getCourseProgress(c.id));
    const el = document.createElement('div');
    el.className = 'card course-card';
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="title">${c.title}</div>
          <div class="course-meta">${c.category} • ${c.difficulty}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:.9rem;color:var(--muted)">${progress}% completed</div>
          <div style="height:8px;width:120px;background:rgba(0,0,0,0.06);border-radius:8px;margin-top:.5rem;">
            <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,var(--accent),var(--accent-2));border-radius:8px"></div>
          </div>
        </div>
      </div>
      <p style="margin-top:.6rem;color:var(--muted)">${c.description}</p>
      <div style="display:flex;gap:.5rem;margin-top:.6rem">
        <button class="btn ghost" data-view="${c.id}">Preview</button>
        <button class="btn primary" data-open="${c.id}">Open</button>
      </div>
    `;
    container.appendChild(el);
  });
  container.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', e=>{
    navigate('course', { courseId: b.getAttribute('data-view') });
  }));
  container.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', e=>{
    navigate('course', { courseId: b.getAttribute('data-open') });
  }));
}

/* course view */
function renderCourse(courseId){
  const course = COURSES.find(c=>c.id===courseId);
  if (!course) return toast('Course not found');
  $('#courseHeader').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <h2>${course.title}</h2>
        <div class="muted">${course.category} • ${course.difficulty}</div>
        <p style="margin-top:.6rem">${course.description}</p>
      </div>
      <div style="text-align:right">
        <button id="startCourse" class="btn primary">Start Course</button>
        <div style="margin-top:.6rem;color:var(--muted)">Progress: ${Math.round(getCourseProgress(course.id))}%</div>
      </div>
    </div>
  `;
  $('#startCourse').onclick = () => {
    if (!CURRENT) { toast('Login to track progress'); navigate('login'); return; }
    navigate('lesson', { courseId: course.id, lessonId: course.lessons[0].id });
  };

  // lessons
  const lessonsHTML = course.lessons.map(ls => {
    const completed = isLessonCompleted(course.id, ls.id) ? '✅' : '';
    return `<div class="lesson-item"><div><div class="title">${ls.title} ${completed}</div><div class="meta">${ls.duration}</div></div>
      <div><button class="btn ghost" data-lesson="${ls.id}" data-course="${course.id}">Open</button></div></div>`;
  }).join('');
  $('#lessonsList').innerHTML = `<h3>Lessons</h3>${lessonsHTML}
    <div style="margin-top:1rem"><button id="takeQuiz" class="btn primary">Take Quiz</button></div>
  `;
  $('#lessonsList').querySelectorAll('[data-lesson]').forEach(b => b.addEventListener('click', ()=>{
    navigate('lesson', { courseId: b.getAttribute('data-course'), lessonId: b.getAttribute('data-lesson') });
  }));
  $('#takeQuiz').addEventListener('click', ()=> navigate('quiz', { courseId: course.id }));
}

/* lesson view */
function renderLesson(courseId, lessonId){
  const course = COURSES.find(c=>c.id===courseId);
  const lesson = course.lessons.find(l=>l.id===lessonId);
  $('#lessonContent').innerHTML = `
    <h2>${lesson.title}</h2>
    <div class="muted">${course.title} • ${lesson.duration}</div>
    <div style="margin-top:1rem">${lesson.content}</div>
    <div style="margin-top:1rem;display:flex;gap:.5rem">
      <button id="markComplete" class="btn primary">${isLessonCompleted(courseId, lessonId)? 'Completed' : 'Mark Complete'}</button>
      <button id="nextLesson" class="btn ghost">Next Lesson</button>
    </div>
  `;
  $('#markComplete').addEventListener('click', ()=>{
    toggleLessonComplete(courseId, lessonId);
    $('#markComplete').textContent = isLessonCompleted(courseId, lessonId) ? 'Completed' : 'Mark Complete';
    renderCourse(courseId);
  });
  $('#nextLesson').addEventListener('click', ()=>{
    const idx = course.lessons.findIndex(l=>l.id===lessonId);
    if (idx < course.lessons.length - 1) {
      const next = course.lessons[idx+1];
      navigate('lesson', { courseId, lessonId: next.id });
    } else {
      toast('This was the last lesson.');
    }
  });
}

/* quizzes */
function renderQuiz(courseId){
  const course = COURSES.find(c=>c.id===courseId);
  if (!course || !course.quiz) return toast('No quiz');
  const questions = course.quiz.questions;
  let answers = Array(questions.length).fill(null);
  const wrapper = $('#quizWrapper');
  function draw(){
    wrapper.innerHTML = `<h3>Quiz • ${course.title}</h3>
      ${questions.map((q,i)=>`
        <div class="quiz-q">
          <div><strong>Q${i+1}:</strong> ${q.q}</div>
          <div class="options">
            ${q.choices.map((opt,oi)=>`<div class="opt" data-i="${i}" data-oi="${oi}">${opt}</div>`).join('')}
          </div>
        </div>
      `).join('')}
      <div style="display:flex;gap:.5rem">
        <button id="submitQuiz" class="btn primary">Submit</button>
        <button id="resetQuiz" class="btn ghost">Reset</button>
      </div>
    `;
    wrapper.querySelectorAll('.opt').forEach(opt=> opt.addEventListener('click', ()=>{
      const i = Number(opt.getAttribute('data-i'));
      const oi = Number(opt.getAttribute('data-oi'));
      answers[i] = oi;
      // mark UI
      wrapper.querySelectorAll(`.options .opt[data-i="${i}"]`).forEach(el=> el.style.borderColor = 'var(--glass-border)');
      opt.style.borderColor = 'var(--accent)';
    }));
    $('#submitQuiz').addEventListener('click', ()=>{
      if (answers.some(a=>a===null)) return toast('Answer all questions');
      let score = 0;
      questions.forEach((q,i)=> { if (answers[i] === q.a) score++; });
      const pct = Math.round((score / questions.length) * 100);
      // save results to progress/certs
      saveQuizResult(courseId, pct);
      wrapper.innerHTML = `<h3>Results</h3><p>Your score: <strong>${score}/${questions.length}</strong> (${pct}%)</p>
        <div style="margin-top:1rem">
          <button id="viewCourse" class="btn ghost">Back to Course</button>
          <button id="getCert" class="btn primary">Get Certificate</button>
        </div>
      `;
      $('#viewCourse').addEventListener('click', ()=> navigate('course', { courseId }));
      $('#getCert').addEventListener('click', ()=> {
        generateCertificate(CURRENT?CURRENT.name:'Guest', course.title, pct);
      });
      renderCourse(courseId);
    });
    $('#resetQuiz').addEventListener('click', ()=> renderQuiz(courseId));
  }
  draw();
}

/* progress helpers */
function getCourseProgress(courseId){
  if (!CURRENT) return 0;
  const key = CURRENT.id;
  const userProgress = (PROGRESS[key] || {});
  const course = COURSES.find(c=>c.id===courseId);
  if (!course) return 0;
  const total = course.lessons.length;
  const done = course.lessons.reduce((acc,l)=> acc + (userProgress[l.id] ? 1 : 0), 0);
  return total === 0 ? 0 : (done/total)*100;
}
function isLessonCompleted(courseId, lessonId){
  if (!CURRENT) return false;
  const userProgress = PROGRESS[CURRENT.id] || {};
  return !!userProgress[lessonId];
}
function toggleLessonComplete(courseId, lessonId){
  if (!CURRENT) return toast('Login to track progress');
  PROGRESS[CURRENT.id] = PROGRESS[CURRENT.id] || {};
  PROGRESS[CURRENT.id][lessonId] = !PROGRESS[CURRENT.id][lessonId];
  localStorage.setItem(LS_KEYS.PROGRESS, JSON.stringify(PROGRESS));
}

/* quiz result save */
function saveQuizResult(courseId, pct){
  if (!CURRENT) return toast('Login to save certificate');
  // Save certificate if >= 60
  if (pct >= 60) {
    const cert = { id: 'cert_'+Date.now(), userId: CURRENT.id, name: CURRENT.name, courseId, courseTitle: COURSES.find(c=>c.id===courseId).title, pct, date: new Date().toISOString().split('T')[0] };
    CERTS.push(cert);
    localStorage.setItem(LS_KEYS.CERTS, JSON.stringify(CERTS));
    toast('Congrats! You passed — certificate available.');
  } else {
    toast('You did not pass — retake to improve your score.');
  }
}

/* certificates rendering & generation (canvas) */
function renderCertificates(){
  if (!CURRENT) { $('#certList').innerHTML = `<div>Please login to view certificates.</div>`; return; }
  const myCerts = CERTS.filter(c => c.userId === CURRENT.id);
  if (myCerts.length === 0) { $('#certList').innerHTML = `<div>No certificates yet. Finish courses and pass quizzes to earn one.</div>`; return; }
  $('#certList').innerHTML = myCerts.map(c => `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-weight:600">${c.courseTitle}</div>
          <div class="muted">${c.date} • Score ${c.pct}%</div>
        </div>
        <div>
          <button class="btn primary" data-download="${c.id}">Download</button>
        </div>
      </div>
    </div>
  `).join('');
  $('#certList').querySelectorAll('[data-download]').forEach(b => b.addEventListener('click', ()=>{
    const id = b.getAttribute('data-download');
    const cert = CERTS.find(x=>x.id===id);
    generateCertificate(cert.name, cert.courseTitle, cert.pct, cert.date);
  }));
}

/* certificate generator - creates a canvas and triggers download */
function generateCertificate(name, courseTitle, pct, dateStr){
  const date = dateStr || new Date().toISOString().split('T')[0];
  // create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 1200; canvas.height = 675;
  const ctx = canvas.getContext('2d');

  // background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  // glass banner
  ctx.fillStyle = '#f3f4ff';
  ctx.fillRect(60,60,canvas.width-120,120);

  // title
  ctx.fillStyle = '#0f1724';
  ctx.font = '48px Roboto';
  ctx.fillText('Certificate of Completion', 100, 150);

  // course
  ctx.font = '28px Roboto';
  ctx.fillStyle = '#111827';
  ctx.fillText(courseTitle, 100, 240);

  // recipient
  ctx.font = '36px Roboto';
  ctx.fillStyle = '#111827';
  ctx.fillText(`Awarded to: ${name}`, 100, 320);

  // score and date
  ctx.font = '20px Roboto';
  ctx.fillStyle = '#374151';
  ctx.fillText(`Score: ${pct}% • Date: ${date}`, 100, 380);

  // badge circle
  ctx.beginPath();
  ctx.arc(canvas.width - 180, 180, 80, 0, Math.PI*2);
  ctx.fillStyle = '#7c4dff';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '28px Roboto';
  ctx.fillText('PASS', canvas.width - 220, 195);

  // trigger download
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${courseTitle.replace(/\s+/g,'_')}_certificate.png`;
  a.click();
}

/* dashboard */
function renderDashboard(){
  if (!CURRENT) return toast('Login to view dashboard');
  // quick stats
  const myProgress = PROGRESS[CURRENT.id] || {};
  const completedCount = Object.values(myProgress).filter(Boolean).length;
  $('#quickStats').innerHTML = `<div>Completed lessons: <strong>${completedCount}</strong></div>`;
  // in progress
  const inProgress = COURSES.filter(c => getCourseProgress(c.id) > 0 && getCourseProgress(c.id) < 100);
  $('#inProgressList').innerHTML = inProgress.map(c=>`<div class="card" style="margin:.5rem 0"><div style="display:flex;justify-content:space-between"><div><strong>${c.title}</strong><div class="muted">${Math.round(getCourseProgress(c.id))}%</div></div><div><button class="btn ghost" data-open="${c.id}">Open</button></div></div></div>`).join('');
  $('#inProgressList').querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', ()=> navigate('course', { courseId: b.getAttribute('data-open') })));

  // chart
  const ctx = document.getElementById('progressChart').getContext('2d');
  const labels = COURSES.map(c=>c.title);
  const data = COURSES.map(c=> Math.round(getCourseProgress(c.id)) );
  if (window._learnifyChart) window._learnifyChart.destroy();
  window._learnifyChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Progress %', data, backgroundColor: labels.map(()=> 'rgba(63,81,181,0.7)') }] },
    options: { responsive:true, plugins:{legend:{display:false}} }
  });
}

/* utility: load courses */
function reloadCourses(){
  COURSES = JSON.parse(localStorage.getItem(LS_KEYS.COURSES) || '[]');
}

/* init */
(function init(){
  reloadCourses();
  renderFeatured();
  renderCourses();
  renderUserArea();
  navigate('home');
})();
