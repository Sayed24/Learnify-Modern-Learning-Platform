/* app.js - full app with extras: back button, header, profile, ratings, achievements, timer quiz, certificate QR */
const LS_KEYS = {
  COURSES: 'learnify_courses',
  USERS: 'learnify_users',
  CURRENT: 'learnify_current',
  PROGRESS: 'learnify_progress',
  THEME: 'learnify_theme',
  CERTS: 'learnify_certs',
  ACHIEVEMENTS: 'learnify_achievements'
};

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* --- load data --- */
let COURSES = JSON.parse(localStorage.getItem(LS_KEYS.COURSES) || '[]');
let USERS = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || '[]');
let PROGRESS = JSON.parse(localStorage.getItem(LS_KEYS.PROGRESS) || '{}');
let CERTS = JSON.parse(localStorage.getItem(LS_KEYS.CERTS) || '[]');
let ACHIEVEMENTS = JSON.parse(localStorage.getItem(LS_KEYS.ACHIEVEMENTS) || '[]');
let CURRENT = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT) || 'null');

/* elements */
const views = $$('.view');
const toastEl = $('#toast');
const userArea = $('#profileBtn');
const searchInput = $('#searchInput');
const featuredList = $('#featuredList');
const coursesGrid = $('#coursesGrid');
const filterCategory = $('#filterCategory');
const sortBy = $('#sortBy');
const categoriesWrap = $('#categories');
const statCourses = $('#statCourses');
const statUsers = $('#statUsers');
const statCerts = $('#statCerts');

/* THEME */
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(LS_KEYS.THEME, theme);
}
(function initTheme(){
  const saved = localStorage.getItem(LS_KEYS.THEME) || 'light';
  applyTheme(saved);
})();

/* TOAST */
let toastTimer = null;
function toast(msg, ms=3500){
  if (toastTimer) clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden');
  toastTimer = setTimeout(()=> toastEl.classList.add('hidden'), ms);
}

/* Safe back button */
function goBackSafe() {
  if (document.referrer && document.referrer !== window.location.href) {
    window.history.back();
  } else {
    navigate('courses');
  }
}
window.goBackSafe = goBackSafe;

/* NAV / HEADER interactions */
const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');
const profileBtn = $('#profileBtn');
const profileDropdown = $('#profileDropdown');
const navLogin = $('#navLogin');
const navSignup = $('#navSignup');
const navLogout = $('#navLogout');

menuToggle?.addEventListener('click', ()=> {
  if (navLinks.style.display === 'flex') {
    navLinks.style.display = '';
  } else {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
  }
});
profileBtn?.addEventListener('click', ()=> {
  if (!profileDropdown) return;
  profileDropdown.style.display = profileDropdown.style.display === 'flex' ? 'none' : 'flex';
});
document.addEventListener('click', (e)=> {
  if (!profileDropdown) return;
  if (!profileDropdown.contains(e.target) && e.target.id !== 'profileBtn') {
    profileDropdown.style.display = 'none';
  }
});

/* render header user area */
function renderHeaderUser(){
  const navUsername = $('#navUsername');
  if (CURRENT) {
    navUsername.textContent = CURRENT.name;
    navLogin.classList.add('hidden');
    navSignup.classList.add('hidden');
    navLogout.classList.remove('hidden');
    $('#profileDropdown').querySelector('#navUsername').textContent = CURRENT.name;
  } else {
    navUsername.textContent = 'Guest';
    navLogin.classList.remove('hidden');
    navSignup.classList.remove('hidden');
    navLogout.classList.add('hidden');
  }
}
renderHeaderUser();

/* Routing */
function hideAllViews(){ views.forEach(v=>v.classList.add('hidden')); }
function navigate(route, opts={}) {
  hideAllViews();
  // normalize route keys
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
  if (route === 'explore') {
    $('#view-explore').classList.remove('hidden');
    renderExplore();
  }
  if (route === 'dashboard') {
    $('#view-dashboard').classList.remove('hidden');
    renderDashboard();
  }
  if (route === 'achievements') {
    $('#view-achievements').classList.remove('hidden');
    renderAchievements();
  }
  if (route === 'certificates') {
    $('#view-certificates').classList.remove('hidden');
    renderCertificates();
  }
  if (route === 'login') $('#view-login').classList.remove('hidden');
  if (route === 'signup') $('#view-signup').classList.remove('hidden');
  if (route === 'profile') $('#view-profile').classList.remove('hidden');
  if (route === 'about') $('#view-about').classList.remove('hidden');
  // update active nav links visually (simple)
  $$('.nav-links a, .sidebar a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-route') === route);
  });
}

/* attach data-route nav links */
$$('[data-route]').forEach(el=> el.addEventListener('click', e=>{
  const r = el.getAttribute('data-route');
  navigate(r);
}));

/* initial bindings for auth nav */
navLogin?.addEventListener('click', ()=> navigate('login'));
navSignup?.addEventListener('click', ()=> navigate('signup'));
navLogout?.addEventListener('click', ()=> {
  logoutUser();
  navigate('home');
});

/* AUTH: signup / login / profile */
$('#toSignup')?.addEventListener('click', ()=> navigate('signup'));
$('#toLogin')?.addEventListener('click', ()=> navigate('login'));

$('#signupBtn')?.addEventListener('click', ()=>{
  const name = $('#signupName').value.trim();
  const email = $('#signupEmail').value.trim().toLowerCase();
  const pass = $('#signupPassword').value;
  if (!name || !email || !pass) return toast('Please complete all fields');
  if (USERS.find(u=>u.email===email)) return toast('Email already used');
  const user = {id: 'u_'+Date.now(), name, email, pass, avatar: '', xp:0, badges:[]};
  USERS.push(user);
  localStorage.setItem(LS_KEYS.USERS, JSON.stringify(USERS));
  CURRENT = { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
  localStorage.setItem(LS_KEYS.CURRENT, JSON.stringify(CURRENT));
  renderHeaderUser();
  toast('Account created — welcome!');
  navigate('courses');
});

$('#loginBtn')?.addEventListener('click', ()=>{
  const email = $('#loginEmail').value.trim().toLowerCase();
  const pass = $('#loginPassword').value;
  const user = USERS.find(u=>u.email===email && u.pass===pass);
  if (!user) return toast('Invalid credentials');
  CURRENT = { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
  localStorage.setItem(LS_KEYS.CURRENT, JSON.stringify(CURRENT));
  renderHeaderUser();
  toast('Logged in');
  navigate('dashboard');
});

/* logout helper */
function logoutUser(){
  CURRENT = null;
  localStorage.removeItem(LS_KEYS.CURRENT);
  renderHeaderUser();
  toast('Logged out');
}

/* search */
searchInput?.addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if (q.length === 0) {
    renderFeatured();
    return;
  }
  const results = COURSES.filter(c => (c.title+c.description+(c.category||'')+ (c.tags?c.tags.join(' '):'')).toLowerCase().includes(q) ||
    c.lessons.some(ls => (ls.title + (ls.content||'')).toLowerCase().includes(q))
  );
  renderCourseGrid(results, coursesGrid);
});

/* render stats */
function renderStats(){
  statCourses.textContent = COURSES.length;
  statUsers.textContent = USERS.length || 0;
  statCerts.textContent = CERTS.length || 0;
}

/* featured */
function renderFeatured(){
  const list = COURSES.slice(0,4);
  featuredList.innerHTML = '';
  list.forEach(c => {
    const el = document.createElement('div');
    el.className = 'card course-card';
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="title">${c.title}</div>
          <div class="course-meta">${c.category} • ${c.difficulty} • ${c.rating || 0}★</div>
        </div>
        <div style="text-align:right">
          <div class="muted">${c.reviews||0} reviews</div>
        </div>
      </div>
      <p class="muted">${c.description}</p>
      <div style="margin-top:.6rem;display:flex;gap:.5rem">
        <button class="btn ghost" data-view="${c.id}">Preview</button>
        <button class="btn primary" data-start="${c.id}">Start</button>
      </div>
    `;
    featuredList.appendChild(el);
  });
  featuredList.querySelectorAll('[data-view]').forEach(b=> b.addEventListener('click', e=> navigate('course', { courseId: b.getAttribute('data-view') })));
  featuredList.querySelectorAll('[data-start]').forEach(b=> b.addEventListener('click', e=>{
    const id = b.getAttribute('data-start');
    if (!CURRENT) { toast('Please login to track progress'); navigate('login'); return; }
    navigate('course', { courseId: id });
  }));
}

/* categories */
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

/* render courses grid */
function renderCourses(){
  reloadCourses();
  populateCategories();
  renderCourseGrid(COURSES, coursesGrid);
  renderStats();
}

function renderCourseGrid(list, container){
  container.innerHTML = '';
  const sort = sortBy?.value || 'new';
  let sorted = Array.from(list);
  if (sort === 'progress' && CURRENT) {
    sorted.sort((a,b) => getCourseProgress(b.id) - getCourseProgress(a.id));
  } else if (sort === 'rating') {
    sorted.sort((a,b) => (b.rating||0) - (a.rating||0));
  }
  sorted.forEach(c => {
    const progress = Math.round(getCourseProgress(c.id));
    const el = document.createElement('div');
    el.className = 'card course-card';
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="title">${c.title}</div>
          <div class="course-meta">${c.category} • ${c.difficulty} • ${c.rating||0}★ (${c.reviews||0})</div>
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
        <button class="btn small ghost" data-rate="${c.id}">Rate</button>
      </div>
    `;
    container.appendChild(el);
  });
  container.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', ()=> navigate('course', { courseId: b.getAttribute('data-view') })));
  container.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', ()=> navigate('course', { courseId: b.getAttribute('data-open') })));
  container.querySelectorAll('[data-rate]').forEach(b => b.addEventListener('click', ()=> {
    const id = b.getAttribute('data-rate');
    const rating = prompt('Rate this course 1-5 stars');
    if (!rating) return;
    const r = Math.max(1, Math.min(5, Number(rating)));
    const course = COURSES.find(x=>x.id===id);
    if (!course) return;
    // naive update
    course.reviews = (course.reviews || 0) + 1;
    course.rating = ((course.rating || 0) * (course.reviews - 1) + r) / course.reviews;
    localStorage.setItem(LS_KEYS.COURSES, JSON.stringify(COURSES));
    toast('Thanks for rating!');
    renderCourses();
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
        <div class="muted">${course.category} • ${course.difficulty} • ${Math.round(course.rating || 0)}★</div>
        <p style="margin-top:.6rem">${course.description}</p>
        <div class="meta-row"><span class="muted">${course.tags ? course.tags.join(', '): ''}</span></div>
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

  const lessonsHTML = course.lessons.map(ls => {
    const completed = isLessonCompleted(course.id, ls.id) ? '✅' : '';
    const est = Math.max(1, Math.round((ls.words||250)/200));
    return `<div class="lesson-item"><div><div class="title">${ls.title} ${completed}</div><div class="meta">Duration: ${ls.duration} • Est ${est} min • ${ls.words||'~'} words</div></div>
      <div><button class="btn ghost" data-lesson="${ls.id}" data-course="${course.id}">Open</button></div></div>`;
  }).join('');
  $('#lessonsList').innerHTML = `<h3>Lessons</h3>${lessonsHTML}
    <div style="margin-top:1rem;display:flex;gap:.5rem">
      <button id="takeQuiz" class="btn primary">Take Quiz</button>
      <button id="downloadSyllabus" class="btn ghost">Download Syllabus</button>
    </div>
  `;
  $('#lessonsList').querySelectorAll('[data-lesson]').forEach(b => b.addEventListener('click', ()=>{
    navigate('lesson', { courseId: b.getAttribute('data-course'), lessonId: b.getAttribute('data-lesson') });
  }));
  $('#takeQuiz').addEventListener('click', ()=> navigate('quiz', { courseId: course.id }));
  $('#downloadSyllabus').addEventListener('click', ()=> {
    downloadSyllabus(course);
  });
}

/* lesson view */
function renderLesson(courseId, lessonId){
  const course = COURSES.find(c=>c.id===courseId);
  if (!course) return toast('Course missing');
  const lesson = course.lessons.find(l=>l.id===lessonId);
  if (!lesson) return toast('Lesson missing');
  const est = Math.max(1, Math.round((lesson.words||250)/200));
  $('#lessonContent').innerHTML = `
    <h2>${lesson.title}</h2>
    <div class="muted">${course.title} • ${lesson.duration} • Est ${est} min</div>
    <div style="margin-top:1rem">${lesson.content}</div>
    <div style="margin-top:1rem;display:flex;gap:.5rem">
      <button id="markComplete" class="btn primary">${isLessonCompleted(courseId, lessonId)? 'Completed' : 'Mark Complete'}</button>
      <button id="nextLesson" class="btn ghost">Next Lesson</button>
      <button id="saveNote" class="btn ghost">Save Note</button>
    </div>
    <div id="readingProgress" style="margin-top:1rem"><small>Scroll to track reading progress</small><div class="progressbar" style="height:8px;width:100%;background:#eee;border-radius:6px;margin-top:6px"><div id="readingBar" style="height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--accent-2));border-radius:6px"></div></div></div>
  `;
  // mark complete
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
  // reading progress by scroll
  const readingBar = $('#readingBar');
  const contentWrap = $('#lessonContent');
  contentWrap.addEventListener('scroll', ()=> {
    const scrolled = contentWrap.scrollTop;
    const full = contentWrap.scrollHeight - contentWrap.clientHeight;
    const pct = full > 0 ? Math.round((scrolled / full) * 100) : 0;
    readingBar.style.width = pct + '%';
  });
}

/* quizzes with timer, explanations, confetti at 100% */
function renderQuiz(courseId){
  const course = COURSES.find(c=>c.id===courseId);
  if (!course || !course.quiz) return toast('No quiz available');
  const questions = course.quiz.questions;
  let answers = Array(questions.length).fill(null);
  let timer = null;
  let timeLeft = course.quiz.timeLimitSec || 0;
  const wrapper = $('#quizWrapper');

  function draw(){
    wrapper.innerHTML = `<h3>Quiz • ${course.title}</h3>
      ${timeLeft>0 ? `<div class="muted">Time left: <span id="quizTimer">${formatTime(timeLeft)}</span></div>` : ''}
      ${questions.map((q,i)=>`
        <div class="quiz-q" data-q="${i}">
          <div><strong>Q${i+1}:</strong> ${q.q}</div>
          <div class="options">
            ${q.choices.map((opt,oi)=>`<div class="opt" tabindex="0" data-i="${i}" data-oi="${oi}">${opt}</div>`).join('')}
          </div>
          <div class="explain hidden" id="explain-${i}"></div>
        </div>
      `).join('')}
      <div style="display:flex;gap:.5rem;margin-top:1rem">
        <button id="submitQuiz" class="btn primary">Submit</button>
        <button id="resetQuiz" class="btn ghost">Reset</button>
      </div>
    `;
    wrapper.querySelectorAll('.opt').forEach(opt=> opt.addEventListener('click', ()=>{
      const i = Number(opt.getAttribute('data-i'));
      const oi = Number(opt.getAttribute('data-oi'));
      answers[i] = oi;
      wrapper.querySelectorAll(`.options .opt[data-i="${i}"]`).forEach(el=> el.style.borderColor = 'var(--glass-border)');
      opt.style.borderColor = 'var(--accent)';
    }));
    // keyboard support
    wrapper.querySelectorAll('.opt').forEach(o => o.addEventListener('keydown', (ev)=> {
      if (ev.key === 'Enter' || ev.key === ' ') { o.click(); }
    }));

    $('#submitQuiz').addEventListener('click', submit);
    $('#resetQuiz').addEventListener('click', ()=> {
      answers = Array(questions.length).fill(null);
      draw();
    });
    if (timeLeft > 0 && !timer) startTimer();
  }

  function formatTime(s){
    const m = Math.floor(s/60), sec = s%60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }
  function startTimer(){
    timer = setInterval(()=> {
      timeLeft--;
      const tEl = $('#quizTimer');
      if (tEl) tEl.textContent = formatTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timer);
        submit();
      }
    }, 1000);
  }
  function submit(){
    if (answers.some(a=>a===null)) return toast('Answer all questions');
    if (timer) clearInterval(timer);
    let score = 0;
    questions.forEach((q,i)=> { if (answers[i] === q.a) score++; });
    const pct = Math.round((score / questions.length) * 100);
    saveQuizResult(courseId, pct);
    // show explanations inline
    questions.forEach((q,i)=>{
      const expl = $('#explain-'+i);
      if (expl) {
        expl.innerHTML = `<small>${q.explanation || ''}</small>`;
        expl.classList.remove('hidden');
      }
      // mark correct / wrong
      wrapper.querySelectorAll(`.options .opt[data-i="${i}"]`).forEach(o=>{
        const oi = Number(o.getAttribute('data-oi'));
        if (oi === q.a) o.style.borderColor = 'green';
        else if (answers[i] === oi) o.style.borderColor = 'red';
      });
    });
    wrapper.insertAdjacentHTML('beforeend', `<div style="margin-top:1rem"><strong>Score: ${score}/${questions.length} (${pct}%)</strong></div>
      <div style="margin-top:.5rem"><button id="viewCourse" class="btn ghost">Back to Course</button> <button id="getCert" class="btn primary">Get Certificate</button></div>`);
    $('#viewCourse').addEventListener('click', ()=> navigate('course', { courseId }));
    $('#getCert').addEventListener('click', ()=> {
      generateCertificate(CURRENT?CURRENT.name:'Guest', course.title, pct);
    });
    if (pct === 100) confetti();
    renderCourse(courseId);
  }

  draw();
}

/* confetti (simple) */
function confetti(){
  // simple visual confetti using many colored divs
  for (let i=0;i<30;i++){
    const d = document.createElement('div');
    d.style.position='fixed'; d.style.left = (Math.random()*90)+'%'; d.style.top='-10px';
    d.style.width='10px'; d.style.height='14px'; d.style.background = ['#ff6b6b','#ff7043','#c62828','#ffd166'][Math.floor(Math.random()*4)];
    d.style.opacity='0.95'; d.style.transform = `rotate(${Math.random()*360}deg)`;
    d.style.transition = 'top 1.6s ease-in, transform 1.6s';
    document.body.appendChild(d);
    setTimeout(()=>{ d.style.top = (60+Math.random()*60)+'%'; d.style.transform = 'rotate(720deg)'; }, 20);
    setTimeout(()=> d.remove(), 2200);
  }
}

/* progress helpers */
function getCourseProgress(courseId){
  if (!CURRENT) return 0;
  const userProgress = (PROGRESS[CURRENT.id] || {});
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

/* save quiz result + award achievements */
function saveQuizResult(courseId, pct){
  if (!CURRENT) return toast('Login to save certificate');
  if (pct >= 60) {
    const cert = { id: 'cert_'+Date.now(), userId: CURRENT.id, name: CURRENT.name, courseId, courseTitle: COURSES.find(c=>c.id===courseId).title, pct, date: new Date().toISOString().split('T')[0] };
    CERTS.push(cert);
    localStorage.setItem(LS_KEYS.CERTS, JSON.stringify(CERTS));
    toast('Congrats! You passed — certificate available.');
    awardAchievement(CURRENT.id, 'Passed a course');
  } else {
    toast('You did not pass — retake to improve your score.');
  }
}

/* certificates rendering & generation */
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

/* certificate generator (improved with border + QR) */
function generateCertificate(name, courseTitle, pct, dateStr){
  const date = dateStr || new Date().toISOString().split('T')[0];
  const canvas = document.getElementById('hiddenCanvas') || document.createElement('canvas');
  canvas.width = 1200; canvas.height = 675;
  const ctx = canvas.getContext('2d');

  // background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  // border
  ctx.fillStyle = 'rgba(198,40,40,0.12)';
  ctx.fillRect(40,40,canvas.width-80,canvas.height-80);

  // inner
  ctx.fillStyle = '#fff';
  ctx.fillRect(70,70,canvas.width-140,canvas.height-140);

  // title
  ctx.fillStyle = '#2b2b2b';
  ctx.font = 'bold 48px Roboto';
  ctx.fillText('Certificate of Completion', 120, 170);

  ctx.font = '28px Roboto';
  ctx.fillStyle = '#111';
  ctx.fillText(courseTitle, 120, 240);

  ctx.font = '36px Roboto';
  ctx.fillStyle = '#111';
  ctx.fillText(`Awarded to: ${name}`, 120, 320);

  ctx.font = '20px Roboto';
  ctx.fillStyle = '#555';
  ctx.fillText(`Score: ${pct}% • Date: ${date}`, 120, 380);

  // badge
  ctx.beginPath();
  ctx.fillStyle = '#c62828';
  ctx.arc(canvas.width - 180, 180, 80, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '28px Roboto';
  ctx.fillText('PASS', canvas.width - 220, 195);

  // QR (simple simulated)
  ctx.fillStyle = '#000';
  ctx.fillRect(canvas.width - 220, canvas.height - 220, 120, 120);

  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${courseTitle.replace(/\s+/g,'_')}_certificate.png`;
  a.click();
}

/* achievements */
function awardAchievement(userId, title){
  ACHIEVEMENTS.push({ id: 'ach_'+Date.now(), userId, title, date: new Date().toISOString().split('T')[0] });
  localStorage.setItem(LS_KEYS.ACHIEVEMENTS, JSON.stringify(ACHIEVEMENTS));
}
function renderAchievements(){
  if (!CURRENT) return toast('Login to view achievements');
  const mine = ACHIEVEMENTS.filter(a=>a.userId===CURRENT.id);
  $('#achievementsList').innerHTML = mine.length ? mine.map(a=>`<div class="card"><strong>${a.title}</strong><div class="muted">${a.date}</div></div>`).join('') : '<div>No achievements yet.</div>';
}

/* dashboard */
function renderDashboard(){
  if (!CURRENT) { navigate('login'); toast('Please login'); return; }
  const myProgress = PROGRESS[CURRENT.id] || {};
  const completedCount = Object.values(myProgress).filter(Boolean).length;
  $('#quickStats').innerHTML = `<div>Completed lessons: <strong>${completedCount}</strong></div><div>Badges: <strong>${(CURRENT.badges||[]).length}</strong></div>`;
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
    data: { labels, datasets: [{ label: 'Progress %', data, backgroundColor: labels.map(()=> 'rgba(198,40,40,0.8)') }] },
    options: { responsive:true, plugins:{legend:{display:false}} }
  });
}

/* explore */
function renderExplore(){
  $('#exploreResults').innerHTML = COURSES.map(c=>`<div class="card"><strong>${c.title}</strong><div class="muted">${c.tags?c.tags.join(', '):''}</div><div style="margin-top:8px"><button class="btn primary" data-open="${c.id}">Open</button></div></div>`).join('');
  $('#exploreResults').querySelectorAll('[data-open]').forEach(b=> b.addEventListener('click', ()=> navigate('course', { courseId: b.getAttribute('data-open') })));
}

/* utilities: reload courses */
function reloadCourses(){ COURSES = JSON.parse(localStorage.getItem(LS_KEYS.COURSES) || '[]'); }

/* syllabus download (simple text file) */
function downloadSyllabus(course){
  const text = `Syllabus: ${course.title}\n\n` + course.lessons.map((l,i)=>`${i+1}. ${l.title} - ${l.duration}`).join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `${course.title.replace(/\s+/g,'_')}_syllabus.txt`; a.click();
}

/* small utility for adding sample course from data.js */
$('#createCourseBtn')?.addEventListener('click', ()=>{
  const newCourse = addSampleCourse();
  reloadCourses();
  renderCourses();
  toast('Sample course added');
});

/* init app */
(function init(){
  reloadCourses();
  renderFeatured();
  renderCourses();
  renderHeaderUser();
  renderStats();
  navigate('home');
})();
