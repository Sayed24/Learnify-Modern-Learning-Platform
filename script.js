/* =========================
   script.js — Material header + full functionality
   - Navigation
   - Courses & lessons
   - Quizzes & scoring
   - Progress (LocalStorage)
   - Certificates (canvas)
   - Simple auth (LocalStorage)
   - Search
   All functions reference elements in index.html
========================= */

/* --- LocalStorage keys --- */
const LS = {
  COURSES: 'learnify_courses_vfinal',
  USERS: 'learnify_users_vfinal',
  CURRENT: 'learnify_current_vfinal',
  PROGRESS: 'learnify_progress_vfinal',
  CERTS: 'learnify_certs_vfinal'
};

/* --- Sample course data (kept & restored) --- */
const SAMPLE_COURSES = [
  {
    id: "c-html",
    title: "HTML & CSS Foundations",
    category: "Web Development",
    difficulty: "Beginner",
    rating: 4.8,
    description: "Learn HTML, CSS, Flexbox, Grid, and responsive basics.",
    lessons: [
      { id: "c-html-l1", title: "HTML Basics", duration: "8m", content:`<h3>HTML Basics</h3><p>Structure your page with semantic tags.</p><pre><code>&lt;!doctype html&gt;&lt;html&gt;...&lt;/html&gt;</code></pre><textarea id="exercise-c-html-l1" rows="5" placeholder="Write HTML..."></textarea><div style="margin-top:8px"><button class="btn primary" data-exec="c-html-l1">Check</button><button class="btn ghost" data-clear="c-html-l1">Clear</button></div><div id="exercise-result-c-html-l1" class="muted" style="margin-top:6px"></div>` },
      { id: "c-html-l2", title: "Semantic HTML", duration: "10m", content:`<h3>Semantic HTML</h3><p>Use header, main, footer for structure.</p>` },
      { id: "c-html-l3", title: "CSS Selectors", duration: "12m", content:`<h3>Selectors</h3><pre><code>.card{padding:12px}</code></pre>` }
    ],
    quiz: { questions: [ { q: "Which tag is paragraph?", choices:["<p>","<div>","<h1>"], a:0}, { q: "Flexbox is best for?", choices:["1D Layout","2D Layout","Animations"], a:0 } ] }
  },
  {
    id: "c-js",
    title: "JavaScript Essentials",
    category: "Web Development",
    difficulty: "Beginner",
    rating: 4.7,
    description: "Variables, functions, DOM, events, async basics.",
    lessons: [
      { id: "c-js-l1", title: "Variables & Types", duration: "9m", content:`<h3>Variables</h3><pre><code>let x = 1; const name = "Sayed";</code></pre>` },
      { id: "c-js-l2", title: "Functions & Scope", duration: "12m", content:`<h3>Functions</h3><textarea id="exercise-c-js-l2" rows="4" placeholder="// implement sum"></textarea><div style="margin-top:6px"><button class="btn primary" data-exec="c-js-l2">Check</button><button class="btn ghost" data-clear="c-js-l2">Clear</button></div><div id="exercise-result-c-js-l2" class="muted" style="margin-top:6px"></div>` }
    ],
    quiz: { questions: [ { q: "Which is block-scoped?", choices:["var","let","function"], a:1 }, { q: "What does === check?", choices:["value","type","value & type"], a:2 } ] }
  },
  {
    id: "c-projects",
    title: "Front-End Projects",
    category: "Projects",
    difficulty: "Intermediate",
    rating: 4.9,
    description: "Portfolio projects: Todo, Kanban, Portfolio site.",
    lessons: [
      { id: "c-proj-l1", title: "Portfolio Site", duration: "14m", content:`<h3>Portfolio</h3><p>Showcase projects and skills.</p>` },
      { id: "c-proj-l2", title: "Todo App", duration: "18m", content:`<h3>Todo App</h3><p>LocalStorage tasks example.</p>` }
    ],
    quiz: { questions: [ { q: "Which project shows UI skills?", choices:["Portfolio","DB Admin"], a:0 } ] }
  },
  {
    id: "c-git",
    title: "Git & GitHub",
    category: "Tools",
    difficulty: "Beginner",
    rating: 4.5,
    description: "Git basics, branches, GitHub flow.",
    lessons: [
      { id: "c-git-l1", title: "Git Basics", duration: "8m", content:`<pre><code>git init\ngit add .\ngit commit -m "init"</code></pre>` }
    ],
    quiz: { questions: [ { q: "Which commits changes?", choices:["git add","git commit","git push"], a:1 } ] }
  },
  {
    id: "c-responsive",
    title: "Responsive Web Design",
    category: "Design",
    difficulty: "Intermediate",
    rating: 4.6,
    description: "Media queries, fluid design, mobile first.",
    lessons: [
      { id: "c-res-l1", title: "Viewport Meta", duration: "6m", content:`<p>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</p>` }
    ],
    quiz: { questions: [ { q: "Media queries help to:", choices:["Change layout by width","Change fonts only"], a:0 } ] }
  },
  {
    id: "c-advjs",
    title: "Advanced JavaScript",
    category: "Web Development",
    difficulty: "Advanced",
    rating: 4.9,
    description: "Closures, patterns, performance.",
    lessons: [
      { id: "c-aj-l1", title: "Closures", duration: "16m", content:`<h3>Closures</h3><p>Private state & factories.</p>` }
    ],
    quiz: { questions: [ { q: "Closure can access:", choices:["Outer variables","Only local"], a:0 } ] }
  }
];

/* persist sample courses if missing */
if (!localStorage.getItem(LS.COURSES)) localStorage.setItem(LS.COURSES, JSON.stringify(SAMPLE_COURSES));

/* --- App state from storage --- */
let COURSES = JSON.parse(localStorage.getItem(LS.COURSES));
let USERS = JSON.parse(localStorage.getItem(LS.USERS) || "[]");
let CURRENT = JSON.parse(localStorage.getItem(LS.CURRENT) || "null");
let PROGRESS = JSON.parse(localStorage.getItem(LS.PROGRESS) || "{}");
let CERTS = JSON.parse(localStorage.getItem(LS.CERTS) || "[]");

/* ----------------------------
   UI helpers
   ---------------------------- */
function toast(msg, ms=2500){ const el = document.getElementById('toast'); if(!el) return; el.textContent=msg; el.classList.remove('hidden'); setTimeout(()=>el.classList.add('hidden'), ms); }
function saveLS(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function goBackSafe(){ if(document.referrer && document.referrer!==window.location.href) window.history.back(); else navigate('courses'); }

/* render user area on header */
function renderNavUserArea(){
  const area = document.getElementById('navUserArea');
  if (!area) return;
  if (CURRENT) {
    area.innerHTML = `<span class="muted">Hi, ${CURRENT.name}</span> <button class="btn ghost" id="logoutBtn">Logout</button>`;
    document.getElementById('logoutBtn').onclick = ()=> { localStorage.removeItem(LS.CURRENT); CURRENT = null; renderNavUserArea(); toast('Logged out'); renderProgressOverview(); };
  } else {
    area.innerHTML = `<button class="btn ghost" id="loginBtn">Login</button> <button class="btn primary" id="signupBtn">Sign up</button>`;
    document.getElementById('loginBtn').onclick = ()=> openAuth('login');
    document.getElementById('signupBtn').onclick = ()=> openAuth('signup');
  }
}
renderNavUserArea();

/* ----------------------------
   Navigation
   ---------------------------- */
function hideAllPages(){ document.querySelectorAll('.page').forEach(p=>p.classList.remove('active')); }
function navigate(route){
  hideAllPages();
  const page = document.getElementById(route);
  if (page) page.classList.add('active');
  if (route === 'courses') renderCoursesGrid();
  if (route === 'home') renderFeatured();
  if (route === 'progress') renderProgressOverview();
  if (route === 'certs') renderCertificates();
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ----------------------------
   Courses rendering
   ---------------------------- */
function renderFeatured(){
  COURSES = JSON.parse(localStorage.getItem(LS.COURSES));
  const featured = COURSES.slice(0,4);
  const el = document.getElementById('featuredGrid');
  if (!el) return;
  el.innerHTML = featured.map(c=>`<div class="course-card md-card"><div style="display:flex;justify-content:space-between"><div><strong>${c.title}</strong><div class="muted">${c.category}</div></div><div class="badge">${c.rating}★</div></div><p class="muted" style="margin-top:8px">${c.description}</p><div style="margin-top:8px"><button class="btn primary" onclick="openCourse('${c.id}')">Start</button></div></div>`).join('');
}

function renderCoursesGrid(){
  COURSES = JSON.parse(localStorage.getItem(LS.COURSES));
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  COURSES.forEach(c=>{
    const progress = CURRENT ? userCourseProgress(c.id) : 0;
    const div = document.createElement('div'); div.className='course-card';
    div.innerHTML = `<div style="display:flex;justify-content:space-between"><div><strong>${c.title}</strong><div class="muted">${c.category} • ${c.difficulty||''}</div></div><div style="text-align:right"><div class="muted">${progress}%</div><div class="muted">${c.rating}★</div></div></div><p class="muted" style="margin-top:8px">${c.description}</p><div style="margin-top:8px"><button class="btn ghost" onclick="openCourse('${c.id}')">Preview</button> <button class="btn primary" onclick="openCourse('${c.id}')">Open</button></div>`;
    grid.appendChild(div);
  });
}

/* ----------------------------
   Open course & lessons
   ---------------------------- */
let ACTIVE_COURSE = null;
let ACTIVE_LESSON = null;

function openCourse(courseId){
  COURSES = JSON.parse(localStorage.getItem(LS.COURSES));
  const c = COURSES.find(x=>x.id===courseId);
  if (!c) { toast('Course not found'); return; }
  ACTIVE_COURSE = c;
  document.getElementById('courseHeader').innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div><h2>${c.title}</h2><div class="muted">${c.category} • ${c.difficulty}</div><p class="muted">${c.description}</p></div><div><div class="badge">${c.rating}★</div><div style="margin-top:8px" class="muted">Progress: ${CURRENT? userCourseProgress(c.id):0}%</div></div></div>`;
  document.getElementById('lessonList').innerHTML = `<h3>Lessons</h3>` + c.lessons.map(l=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.04);margin-top:8px"><div><strong>${l.title}</strong><div class="muted">${l.duration||''}</div></div><div><button class="btn ghost" onclick="openLesson('${c.id}','${l.id}')">Open</button></div></div>`).join('') + `<div style="margin-top:12px"><button class="btn primary" onclick="startCourse('${c.id}')">Start Course</button></div>`;
  navigate('courseView');
}

function startCourse(courseId){ const c = COURSES.find(x=>x.id===courseId); if(!c) return; openLesson(courseId, c.lessons[0].id); }

function openLesson(courseId, lessonId){
  COURSES = JSON.parse(localStorage.getItem(LS.COURSES));
  const course = COURSES.find(c=>c.id===courseId);
  if (!course) { toast('Course not found'); return; }
  const lesson = course.lessons.find(l=>l.id===lessonId);
  if (!lesson) { toast('Lesson not found'); return; }
  ACTIVE_COURSE = course; ACTIVE_LESSON = lesson;

  document.getElementById('lessonMeta').innerHTML = `<h2>${lesson.title}</h2><div class="muted">${course.title} • ${lesson.duration||''}</div>`;
  document.getElementById('lessonBody').innerHTML = lesson.content;

  // mark complete button
  document.getElementById('markCompleteBtn').onclick = ()=> {
    if (!CURRENT) { toast('Login to save progress'); openAuth('login'); return; }
    const done = toggleLessonComplete(course.id, lesson.id);
    document.getElementById('markCompleteBtn').textContent = done ? 'Completed' : 'Mark Complete';
    renderProgressOverview();
  };

  // next lesson
  document.getElementById('nextLessonBtn').onclick = ()=> {
    const idx = course.lessons.findIndex(x=>x.id===lesson.id);
    if (idx < course.lessons.length - 1) openLesson(course.id, course.lessons[idx+1].id);
    else toast('Last lesson');
  };

  // quiz
  document.getElementById('startQuizBtn').onclick = ()=> {
    if (!course.quiz || !course.quiz.questions) { toast('No quiz'); return; }
    renderQuiz(course.id);
  };

  // exercises buttons wiring (data-exec / data-clear)
  setTimeout(()=> {
    document.querySelectorAll('[data-exec]').forEach(btn=>{
      btn.onclick = ()=> {
        const key = btn.getAttribute('data-exec');
        const ta = document.getElementById('exercise-'+key);
        const out = document.getElementById('exercise-result-'+key);
        if(!ta){ if(out) out.textContent='No input'; return; }
        const text = ta.value.trim();
        let ok=false,msg='Checked';
        if (key.includes('html')) { ok = /<header|<main|<footer/i.test(text); msg = ok? 'Looks good' : 'Include header/main/footer'; }
        else if (key.includes('js')) { ok = /function\s+sum|return/.test(text); msg = ok? 'Function detected' : 'Try implementing function'; }
        if (out) { out.textContent = msg; out.style.color = ok? 'green' : ''; }
      };
    });
    document.querySelectorAll('[data-clear]').forEach(btn=>{
      btn.onclick = ()=> { const key = btn.getAttribute('data-clear'); const ta = document.getElementById('exercise-'+key); const out = document.getElementById('exercise-result-'+key); if(ta) ta.value=''; if(out){ out.textContent=''; out.style.color=''; } };
    });
  }, 40);

  // set mark button label
  if (CURRENT && isLessonCompleted(course.id, lesson.id)) document.getElementById('markCompleteBtn').textContent = 'Completed';
  else document.getElementById('markCompleteBtn').textContent = 'Mark Complete';

  navigate('lessonView');
}

/* ----------------------------
   Quiz rendering & submission
   ---------------------------- */
let QUIZ_STATE = null;
function renderQuiz(courseId){
  const course = COURSES.find(c=>c.id===courseId);
  if (!course || !course.quiz) { toast('Quiz not found'); return; }
  const questions = course.quiz.questions;
  QUIZ_STATE = { courseId, questions, answers: Array(questions.length).fill(null) };
  const wrapper = document.getElementById('quizWrapper');
  wrapper.innerHTML = `<h3>Quiz • ${course.title}</h3>` + questions.map((q,i)=>`<div class="md-card"><div><strong>Q${i+1}:</strong> ${q.q}</div><div style="margin-top:8px">${q.choices.map((c,oi)=>`<label style="display:block;margin:6px 0"><input type="radio" name="q${i}" value="${oi}"> ${c}</label>`).join('')}</div></div>`).join('') + `<div style="margin-top:12px"><button class="btn primary" id="submitQuizBtn">Submit</button></div>`;
  document.getElementById('submitQuizBtn').onclick = submitQuiz;
  navigate('quizView');
}

function submitQuiz(){
  if (!QUIZ_STATE) return;
  const q = QUIZ_STATE.questions;
  let answers = [];
  for (let i=0;i<q.length;i++){
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    answers.push(sel ? Number(sel.value) : null);
  }
  if (answers.some(a=>a===null)) { toast('Answer all questions'); return; }
  let score = 0; q.forEach((qq,i)=> { if (answers[i] === qq.a) score++; });
  const pct = Math.round((score / q.length) * 100);

  if (!CURRENT) { toast('Login to save'); openAuth('login'); return; }
  if (pct >= 60) {
    const cert = { id: 'cert_'+Date.now(), userId: CURRENT.id, name: CURRENT.name, courseId: QUIZ_STATE.courseId, courseTitle: COURSES.find(c=>c.id===QUIZ_STATE.courseId).title, pct, date: new Date().toISOString().split('T')[0] };
    CERTS.push(cert); saveLS(LS.CERTS, CERTS);
    toast('Passed — certificate saved');
  } else toast('Did not pass — try again');

  document.getElementById('quizWrapper').innerHTML = `<div class="md-card"><h3>Results</h3><p>Your score: <strong>${score}/${q.length}</strong> (${pct}%)</p><div style="margin-top:12px"><button class="btn primary" id="downloadCert">Download Certificate</button></div></div>`;
  document.getElementById('downloadCert').onclick = ()=> {
    const dataUrl = generateCertificateImage(CURRENT.name, COURSES.find(c=>c.id===QUIZ_STATE.courseId).title, pct);
    const a = document.createElement('a'); a.href = dataUrl; a.download = `${COURSES.find(c=>c.id===QUIZ_STATE.courseId).title.replace(/\s+/g,'_')}_certificate.png`; a.click();
  };
}

/* ----------------------------
   Progress tracking
   ---------------------------- */
function toggleLessonComplete(courseId, lessonId){
  if (!CURRENT) { toast('Login required'); openAuth('login'); return false; }
  PROGRESS[CURRENT.id] = PROGRESS[CURRENT.id] || {};
  PROGRESS[CURRENT.id][lessonId] = !PROGRESS[CURRENT.id][lessonId];
  saveLS(LS.PROGRESS, PROGRESS);
  return PROGRESS[CURRENT.id][lessonId];
}
function isLessonCompleted(courseId, lessonId){
  return !!(CURRENT && PROGRESS[CURRENT.id] && PROGRESS[CURRENT.id][lessonId]);
}
function userCourseProgress(courseId){
  const course = COURSES.find(c=>c.id===courseId);
  if (!course) return 0;
  if (!CURRENT) return 0;
  const total = course.lessons.length;
  const done = course.lessons.reduce((s,l)=> s + ((PROGRESS[CURRENT.id] && PROGRESS[CURRENT.id][l.id])?1:0), 0);
  return Math.round((done/total)*100);
}
function renderProgressOverview(){
  const box = document.getElementById('progressOverview');
  if (!box) return;
  if (!CURRENT) { box.innerHTML = '<div>Please login to see progress.</div>'; return; }
  let html = '';
  COURSES.forEach(c=> {
    const pct = userCourseProgress(c.id);
    html += `<div class="md-card"><div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${c.title}</strong><div class="muted">${c.category}</div></div><div style="text-align:right"><div class="muted">${pct}%</div><div style="height:10px;width:160px;background:#eee;border-radius:999px;margin-top:8px;overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#4cc9f0,#7c4dff)"></div></div></div></div></div>`;
  });
  box.innerHTML = html;
}

/* ----------------------------
   Certificates
   ---------------------------- */
function renderCertificates(){
  const list = document.getElementById('certList'); list.innerHTML = '';
  if (!CURRENT) { list.innerHTML = '<div>Please login to view certificates</div>'; return; }
  const mine = CERTS.filter(c=>c.userId===CURRENT.id);
  if (mine.length === 0) { list.innerHTML = '<div>No certificates yet.</div>'; return; }
  list.innerHTML = mine.map(c=>`<div class="course-card md-card"><div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${c.courseTitle}</strong><div class="muted">${c.date} • ${c.pct}%</div></div><div><button class="btn primary" onclick="downloadCert('${c.id}')">Download</button></div></div></div>`).join('');
}
function downloadCert(certId){
  const c = CERTS.find(x=>x.id===certId);
  if (!c) return toast('Certificate not found');
  const dataUrl = generateCertificateImage(c.name, c.courseTitle, c.pct, c.date);
  const a = document.createElement('a'); a.href = dataUrl; a.download = `${c.courseTitle.replace(/\s+/g,'_')}_certificate.png`; a.click();
}
function generateCertificateImage(name, courseTitle, pct, dateStr){
  const date = dateStr || new Date().toISOString().split('T')[0];
  const canvas = document.getElementById('certCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1200; canvas.height = 675;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#eef6ff'; ctx.fillRect(60,60,canvas.width-120,120);
  ctx.fillStyle = '#0f1724'; ctx.font = '48px Roboto'; ctx.fillText('Certificate of Completion', 100, 150);
  ctx.font = '28px Roboto'; ctx.fillText(courseTitle, 100, 240);
  ctx.font = '36px Roboto'; ctx.fillText(`Awarded to: ${name}`, 100, 320);
  ctx.font = '20px Roboto'; ctx.fillStyle = '#374151'; ctx.fillText(`Score: ${pct}% • Date: ${date}`, 100, 380);
  ctx.beginPath(); ctx.arc(canvas.width - 180, 180, 80, 0, Math.PI*2); ctx.fillStyle = '#7c4dff'; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font='28px Roboto'; ctx.fillText('PASS', canvas.width - 220, 195);
  return canvas.toDataURL('image/png');
}

/* ----------------------------
   Simple Auth (LocalStorage)
   ---------------------------- */
function openAuth(mode){
  const m = document.getElementById('authModal');
  m.classList.remove('hidden');
  document.getElementById('authMsg').textContent = '';
  if (mode === 'signup'){ document.getElementById('authTitle').textContent='Sign up'; document.getElementById('authName').classList.remove('hidden'); document.getElementById('authSubmit').onclick = doSignup; }
  else { document.getElementById('authTitle').textContent='Login'; document.getElementById('authName').classList.add('hidden'); document.getElementById('authSubmit').onclick = doLogin; }
}
document.getElementById('authCancel').onclick = ()=> document.getElementById('authModal').classList.add('hidden');

function doSignup(){
  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const pass = document.getElementById('authPassword').value;
  if (!name || !email || !pass) { document.getElementById('authMsg').textContent = 'Fill all fields'; return; }
  USERS = JSON.parse(localStorage.getItem(LS.USERS) || '[]');
  if (USERS.find(u=>u.email===email)) { document.getElementById('authMsg').textContent='Email exists'; return; }
  const user = { id:'u_'+Date.now(), name, email, pass };
  USERS.push(user); localStorage.setItem(LS.USERS, JSON.stringify(USERS));
  CURRENT = { id:user.id, name:user.name, email:user.email }; localStorage.setItem(LS.CURRENT, JSON.stringify(CURRENT));
  document.getElementById('authModal').classList.add('hidden'); renderNavUserArea(); toast('Signed up'); renderProgressOverview(); renderCertificates();
}

function doLogin(){
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const pass = document.getElementById('authPassword').value;
  USERS = JSON.parse(localStorage.getItem(LS.USERS) || '[]');
  const u = USERS.find(x=>x.email===email && x.pass===pass);
  if (!u) { document.getElementById('authMsg').textContent='Invalid credentials'; return; }
  CURRENT = { id:u.id, name:u.name, email:u.email }; localStorage.setItem(LS.CURRENT, JSON.stringify(CURRENT));
  document.getElementById('authModal').classList.add('hidden'); renderNavUserArea(); toast('Logged in'); renderProgressOverview(); renderCertificates();
}

/* ----------------------------
   Search wiring
   ---------------------------- */
document.getElementById('searchInput').addEventListener('input', (e)=> {
  const q = e.target.value.trim().toLowerCase();
  if (!q) { renderCoursesGrid(); return; }
  const results = COURSES.filter(c=> (c.title + c.description + c.category + (c.lessons||[]).map(l=>l.title).join(' ')).toLowerCase().includes(q) );
  const grid = document.getElementById('coursesGrid');
  grid.innerHTML = results.map(c=>`<div class="course-card md-card"><div style="display:flex;justify-content:space-between"><div><strong>${c.title}</strong><div class="muted">${c.category}</div></div><div class="badge">${c.rating}★</div></div><p class="muted">${c.description}</p><div style="margin-top:8px"><button class="btn primary" onclick="openCourse('${c.id}')">Open</button></div></div>`).join('');
});

/* ----------------------------
   Execute on load
   ---------------------------- */
document.addEventListener('DOMContentLoaded', ()=> {
  renderNavUserArea();
  renderFeatured();
  renderCoursesGrid();
  renderProgressOverview();
  renderCertificates();
  try{ hljs.highlightAll(); }catch(e){}
});
