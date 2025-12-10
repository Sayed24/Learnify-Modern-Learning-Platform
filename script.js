/* script.js — Learnify full front-end app
   Features included:
   - Courses / lessons / quizzes
   - Progress saved to LocalStorage per user
   - Mock auth (signup/login/logout)
   - Dashboard with Chart.js
   - Certificate generation (canvas -> PNG)
   - Search, filter, sort
   - Dark/Light mode saved to LocalStorage
   - Toast notifications, animations, responsive
*/

/* =========================
   LocalStorage keys & helpers
========================= */
const LS = {
  COURSES: 'learnify_courses_final',
  USERS: 'learnify_users_final',
  CURRENT: 'learnify_current_final',
  PROGRESS: 'learnify_progress_final',
  CERTS: 'learnify_certs_final',
  THEME: 'learnify_theme_final'
};
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function read(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e){ return fallback; } }
function toast(msg, ms=2500){ const t=$('#toast'); if(!t) return; t.textContent=msg; t.classList.remove('hidden'); setTimeout(()=>t.classList.add('hidden'), ms); }

/* =========================
   Sample data (if absent)
========================= */
const SAMPLE = [
  { id:'c-html', title:'HTML & CSS Fundamentals', category:'Web Dev', difficulty:'Beginner', rating:4.8, thumbnail:'assets/html-thumb.png',
    description:' Learn markup & styles.',
    lessons:[
      { id:'c-html-l1', title:'Intro to HTML', duration:'8m', content:`<h3>Intro to HTML</h3><p>HTML is structure of the web.</p><pre><code>&lt;h1&gt;Hello&lt;/h1&gt;</code></pre>` },
      { id:'c-html-l2', title:'Semantic Tags', duration:'10m', content:`<h3>Semantic Tags</h3><p>header, main, footer</p>` },
      { id:'c-html-l3', title:'Flexbox', duration:'15m', content:`<h3>Flexbox</h3><p>Layout in 1D</p>` }
    ],
    quiz:{ questions:[
      { q:'What does HTML stand for?', choices:['HyperText Markup Language','Home Tool Markup Language','Hyperlinks Text Markup'], a:0},
      { q:'Which tag is a block-level heading?', choices:['<div>','<h1>','<span>'], a:1}
    ]}
  },
  { id:'c-js', title:'JavaScript Essentials', category:'Web Dev', difficulty:'Beginner', rating:4.7, thumbnail:'assets/js-thumb.png',
    description:'Core JS for interactive apps.',
    lessons:[
      { id:'c-js-l1', title:'Variables & Types', duration:'10m', content:`<h3>Variables</h3><pre><code>let a = 1;</code></pre>` },
      { id:'c-js-l2', title:'Functions', duration:'12m', content:`<h3>Functions</h3><pre><code>function sum(a,b){return a+b}</code></pre>` }
    ],
    quiz:{ questions:[
      { q:'Which keyword declares block scope?', choices:['var','let','const'], a:1},
      { q:'=== checks both', choices:['value','type','value and type'], a:2}
    ]}
  },
  { id:'c-projects', title:'Front-End Projects', category:'Projects', difficulty:'Intermediate', rating:4.9, thumbnail:'assets/projects-thumb.png',
    description:'Build portfolio-ready projects.', lessons:[ { id:'c-proj-l1', title:'Portfolio Site', duration:'14m', content:'<p>Structure & showcase</p>' } ],
    quiz:{ questions:[ { q:'Which project shows UI skills?', choices:['Portfolio','Database Admin'], a:0 } ] }
  }
];
if (!localStorage.getItem(LS.COURSES)) save(LS.COURSES, SAMPLE);

/* =========================
   App State
========================= */
let COURSES = read(LS.COURSES, SAMPLE);
let USERS = read(LS.USERS, []);
let CURRENT = read(LS.CURRENT, null);
let PROGRESS = read(LS.PROGRESS, {});
let CERTS = read(LS.CERTS, []);
let HISTORY = [];

/* =========================
   Theme
========================= */
(function initTheme(){
  const t = localStorage.getItem(LS.THEME) || 'light';
  if (t === 'dark') document.body.classList.add('dark');
  $('#themeToggle').checked = t === 'dark';
})();
$('#themeToggle')?.addEventListener('change', (e)=>{
  if (e.target.checked){ document.body.classList.add('dark'); localStorage.setItem(LS.THEME,'dark'); }
  else { document.body.classList.remove('dark'); localStorage.setItem(LS.THEME,'light'); }
});

/* =========================
   Render nav user area
========================= */
function renderNavUserArea(){
  const area = $('#navUserArea');
  if (!area) return;
  if (CURRENT){ area.innerHTML = `<span class="muted">Hi, ${CURRENT.name}</span> <button class="btn ghost" id="logoutBtn">Logout</button>`; $('#logoutBtn').onclick = ()=> { localStorage.removeItem(LS.CURRENT); CURRENT=null; renderNavUserArea(); toast('Logged out'); renderDashboard(); renderCertificates(); }; }
  else { area.innerHTML = `<button class="btn ghost" id="loginBtn">Login</button> <button class="btn primary" id="signupBtn">Sign up</button>`; $('#loginBtn').onclick=()=>openAuth('login'); $('#signupBtn').onclick=()=>openAuth('signup'); }
}
renderNavUserArea();

/* =========================
   Navigation
========================= */
function hidePages(){ $$('.page').forEach(p=>p.classList.remove('active')); }
function navigate(route){
  HISTORY.push(route);
  hidePages();
  const el = $('#'+route);
  if (el) el.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if (route === 'courses') renderCourses();
  if (route === 'home') renderHome();
  if (route === 'dashboard') renderDashboard();
  if (route === 'certs') renderCertificates();
}
function goBackSafe(){ HISTORY.pop(); const prev = HISTORY.pop()||'home'; navigate(prev); }

/* =========================
   Home: featured & categories
========================= */
function renderHome(){
  COURSES = read(LS.COURSES, SAMPLE);
  const featured = COURSES.slice(0,4);
  $('#featuredGrid').innerHTML = featured.map(c=>`<div class="course-card md-card"><div style="display:flex;justify-content:space-between"><div><strong>${c.title}</strong><div class="muted">${c.category}</div></div><div class="badge">${c.rating}★</div></div><p class="muted">${c.description}</p><div style="margin-top:8px"><button class="btn primary" onclick="openCourse('${c.id}')">Start</button></div></div>`).join('');
  const cats = Array.from(new Set(COURSES.map(c=>c.category)));
  $('#categoryChips').innerHTML = cats.map(cat=>`<div class="chip" onclick="filterByCat('${cat}')">${cat}</div>`).join('');
}

/* =========================
   Courses: grid, filter, sort
========================= */
function renderCourses(){
  COURSES = read(LS.COURSES, SAMPLE);
  const grid = $('#coursesGrid'); if(!grid) return;
  const filterCat = $('#filterCategory'); const filterDiff = $('#filterDifficulty'); const sortBy = $('#sortBy');

  // populate filters if empty
  if (filterCat && filterCat.children.length === 1){
    const cats = Array.from(new Set(COURSES.map(c=>c.category)));
    filterCat.innerHTML = '<option value="">All categories</option>' + cats.map(x=>`<option value="${x}">${x}</option>`).join('');
  }

  let list = [...COURSES];
  // apply filters
  const cat = filterCat?.value || '';
  const diff = filterDiff?.value || '';
  if (cat) list = list.filter(c=>c.category===cat);
  if (diff) list = list.filter(c=>c.difficulty===diff);

  // sorting
  const s = sortBy?.value || 'new';
  if (s === 'rating') list.sort((a,b)=> (b.rating||0)-(a.rating||0));
  if (s === 'progress' && CURRENT) list.sort((a,b)=> userCourseProgress(b.id)-userCourseProgress(a.id));

  grid.innerHTML = list.map(c=> {
    const prog = CURRENT? userCourseProgress(c.id):0;
    return `<div class="course-card md-card">
      <div style="display:flex;justify-content:space-between"><div><strong>${c.title}</strong><div class="muted">${c.category} • ${c.difficulty||''}</div></div><div style="text-align:right"><div class="muted">${prog}%</div><div class="muted">${c.rating}★</div></div></div>
      <p class="muted">${c.description}</p>
      <div style="margin-top:8px"><button class="btn ghost" onclick="openCourse('${c.id}')">Preview</button> <button class="btn primary" onclick="openCourse('${c.id}')">Continue Course</button></div>
    </div>`;
  }).join('');
}

$('#filterCategory')?.addEventListener('change', renderCourses);
$('#filterDifficulty')?.addEventListener('change', renderCourses);
$('#sortBy')?.addEventListener('change', renderCourses);

/* handy category click */
function filterByCat(cat){ $('#filterCategory').value = cat; renderCourses(); navigate('courses'); }

/* =========================
   Open course & lessons
========================= */
let ACTIVE = { course:null, lesson:null };
function openCourse(courseId){
  COURSES = read(LS.COURSES, SAMPLE);
  const c = COURSES.find(x=>x.id===courseId);
  if (!c) { toast('Course not found'); return; }
  ACTIVE.course = c;
  $('#courseHeader').innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div><h2>${c.title}</h2><div class="muted">${c.category} • ${c.difficulty||''}</div><p class="muted">${c.description}</p></div><div><div class="badge">${c.rating}★</div><div class="muted" style="margin-top:8px">Progress: ${CURRENT?userCourseProgress(c.id):0}%</div></div></div>`;
  $('#lessonList').innerHTML = `<h3>Lessons</h3>` + c.lessons.map((l, idx)=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.04);margin-top:8px"><div><strong>${l.title}</strong><div class="muted">${l.duration||''}</div></div><div><button class="btn ghost" onclick="openLesson('${c.id}','${l.id}')">Open</button></div></div>`).join('') + `<div style="margin-top:12px"><button class="btn primary" onclick="startCourse('${c.id}')">Start Course</button></div>`;
  navigate('courseView');
}
function startCourse(courseId){ const c = COURSES.find(x=>x.id===courseId); if (!c || !c.lessons) return; openLesson(courseId, c.lessons[0].id); }

function openLesson(courseId, lessonId){
  COURSES = read(LS.COURSES, SAMPLE);
  const course = COURSES.find(c=>c.id===courseId);
  if (!course) { toast('Course not found'); return; }
  const lesson = course.lessons.find(l=>l.id===lessonId);
  if (!lesson) { toast('Lesson not found'); return; }
  ACTIVE.course = course; ACTIVE.lesson = lesson;

  $('#lessonMeta').innerHTML = `<h2>${lesson.title}</h2><div class="muted">${course.title} • ${lesson.duration||''}</div>`;
  $('#lessonBody').innerHTML = lesson.content;

  // mark button wiring
  $('#markCompleteBtn').onclick = ()=> {
    if (!CURRENT) { toast('Login to save progress'); openAuth('login'); return; }
    const done = toggleLessonComplete(course.id, lesson.id);
    $('#markCompleteBtn').textContent = done ? 'Completed' : 'Mark Complete';
    renderDashboard(); renderCourses(); renderProgress(); renderCertificates();
  };

  $('#prevLessonBtn').onclick = ()=> {
    const idx = course.lessons.findIndex(x=>x.id===lesson.id);
    if (idx > 0) openLesson(course.id, course.lessons[idx-1].id);
    else toast('This is first lesson');
  };
  $('#nextLessonBtn').onclick = ()=> {
    const idx = course.lessons.findIndex(x=>x.id===lesson.id);
    if (idx < course.lessons.length - 1) openLesson(course.id, course.lessons[idx+1].id);
    else toast('This is last lesson');
  };

  $('#lessonQuizBtn').onclick = ()=> {
    if (!course.quiz || !course.quiz.questions) { toast('No quiz for this course'); return; }
    renderQuiz(course.id);
  };

  // exercises wiring (data-exec / data-clear)
  setTimeout(()=> {
    $$('[data-exec]').forEach(btn => btn.onclick = handleExec);
    $$('[data-clear]').forEach(btn => btn.onclick = handleClear);
  }, 30);

  // update completed label
  if (CURRENT && isLessonCompleted(course.id, lesson.id)) $('#markCompleteBtn').textContent = 'Completed'; else $('#markCompleteBtn').textContent = 'Mark Complete';

  navigate('lessonView');
}

/* exec handlers */
function handleExec(e){
  const key = e.target.getAttribute('data-exec');
  const ta = document.getElementById('exercise-'+key);
  const out = document.getElementById('exercise-result-'+key);
  if (!ta) { if (out) out.textContent='No input'; return; }
  const txt = ta.value || '';
  let ok=false, msg='';
  if (key.includes('html')) { ok = /<header|<main|<footer/i.test(txt); msg = ok ? 'Looks good' : 'Try including header/main/footer'; }
  else if (key.includes('js')) { ok = /function\s+\w+\(|return/.test(txt); msg = ok ? 'Function detected' : 'Try implementing function'; }
  else ok = txt.length > 8;
  if (out){ out.textContent = msg; out.style.color = ok? 'green' : ''; }
}
function handleClear(e){
  const key = e.target.getAttribute('data-clear');
  const ta = document.getElementById('exercise-'+key);
  const out = document.getElementById('exercise-result-'+key);
  if (ta) ta.value=''; if (out) out.textContent=''; out.style.color='';
}

/* =========================
   Quiz system
========================= */
let QUIZ_STATE = null;
function renderQuiz(courseId){
  const course = COURSES.find(c=>c.id===courseId);
  if (!course || !course.quiz) { toast('Quiz not found'); return; }
  const questions = course.quiz.questions;
  QUIZ_STATE = { courseId, questions, answers: Array(questions.length).fill(null) };
  const wrapper = $('#quizWrapper');
  wrapper.innerHTML = `<h3>Quiz • ${course.title}</h3>` + questions.map((q,i)=>`<div class="md-card"><div><strong>Q${i+1}:</strong> ${q.q}</div><div style="margin-top:8px">${q.choices.map((c,oi)=>`<label style="display:block;margin-top:8px"><input type="radio" name="q${i}" value="${oi}"> ${c}</label>`).join('')}</div></div>`).join('') + `<div style="margin-top:12px"><button class="btn primary" id="submitQuiz">Submit</button><button class="btn ghost" id="resetQuiz">Reset</button></div>`;
  $('#submitQuiz').onclick = submitQuiz;
  $('#resetQuiz').onclick = ()=> renderQuiz(courseId);
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
  const pct = Math.round((score / q.length)*100);
  if (!CURRENT){ toast('Login to save result'); openAuth('login'); return; }
  if (pct >= 60){ const cert = { id:'cert_'+Date.now(), userId:CURRENT.id, name:CURRENT.name, courseId:QUIZ_STATE.courseId, courseTitle:COURSES.find(c=>c.id===QUIZ_STATE.courseId).title, pct, date:new Date().toISOString().split('T')[0] }; CERTS.push(cert); save(LS.CERTS, CERTS); toast('Passed — certificate saved'); }
  else toast('Did not pass — try again');

  $('#quizWrapper').innerHTML = `<div class="md-card"><h3>Results</h3><p>Your score: <strong>${score}/${q.length}</strong> (${pct}%)</p><div style="margin-top:12px"><button class="btn primary" id="downloadCert">Download Certificate</button></div></div>`;
  $('#downloadCert').onclick = ()=> {
    const dataUrl = generateCertificateImage(CURRENT.name, COURSES.find(c=>c.id===QUIZ_STATE.courseId).title, pct);
    const a = document.createElement('a'); a.href = dataUrl; a.download = `${COURSES.find(c=>c.id===QUIZ_STATE.courseId).title.replace(/\s+/g,'_')}_certificate.png`; a.click();
  };
}

/* =========================
   Progress tracking
========================= */
function toggleLessonComplete(courseId, lessonId){
  if (!CURRENT){ toast('Login required'); openAuth('login'); return false; }
  PROGRESS[CURRENT.id] = PROGRESS[CURRENT.id] || {};
  PROGRESS[CURRENT.id][lessonId] = !PROGRESS[CURRENT.id][lessonId];
  save(LS.PROGRESS, PROGRESS);
  return PROGRESS[CURRENT.id][lessonId];
}
function isLessonCompleted(courseId, lessonId){
  return !!(CURRENT && PROGRESS[CURRENT.id] && PROGRESS[CURRENT.id][lessonId]);
}
function userCourseProgress(courseId){
  const course = COURSES.find(c=>c.id===courseId);
  if (!course || !course.lessons) return 0;
  if (!CURRENT) return 0;
  const total = course.lessons.length;
  const done = course.lessons.reduce((s,l)=> s + ((PROGRESS[CURRENT.id] && PROGRESS[CURRENT.id][l.id])?1:0), 0);
  return Math.round((done/total)*100);
}

/* =========================
   Certificates
========================= */
function renderCertificates(){
  const list = $('#certList'); list.innerHTML = '';
  if (!CURRENT){ list.innerHTML = '<div>Please login to view certificates</div>'; return; }
  const mine = CERTS.filter(c=>c.userId===CURRENT.id);
  if (mine.length===0){ list.innerHTML = '<div>No certificates yet.</div>'; return; }
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
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#eef6ff'; ctx.fillRect(60,60,canvas.width-120,120);
  ctx.fillStyle = '#0f1724'; ctx.font = '48px Roboto'; ctx.fillText('Certificate of Completion', 100, 150);
  ctx.font = '28px Roboto'; ctx.fillText(courseTitle, 100, 240);
  ctx.font = '36px Roboto'; ctx.fillText(`Awarded to: ${name}`, 100, 320);
  ctx.font = '20px Roboto'; ctx.fillStyle = '#374151'; ctx.fillText(`Score: ${pct}% • Date: ${date}`, 100, 380);
  ctx.beginPath(); ctx.arc(canvas.width - 180, 180, 80, 0, Math.PI*2); ctx.fillStyle = '#7c4dff'; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font='28px Roboto'; ctx.fillText('PASS', canvas.width - 220, 195);
  return canvas.toDataURL('image/png');
}

/* =========================
   Dashboard (Chart.js)
========================= */
function renderDashboard(){
  const el = $('#dashProgress'); if (!el) return;
  if (!CURRENT){ el.innerHTML = '<div>Please login to see dashboard</div>'; return; }
  // simple stats
  const completed = CERTS.filter(c=>c.userId===CURRENT.id).length;
  const inProgress = COURSES.filter(c=> userCourseProgress(c.id) > 0 && userCourseProgress(c.id) < 100).length;
  const streak = Math.floor(Math.random()*7)+1; // demo
  const xp = completed*120 + inProgress*30;
  el.innerHTML = `<div><strong>Completed:</strong> ${completed}</div><div><strong>In progress:</strong> ${inProgress}</div><div><strong>XP:</strong> ${xp}</div>`;
  $('#dashStats').innerHTML = `<div>Streak: <strong>${streak} day(s)</strong></div><div>Badges: <strong>${completed>0? 'Course Master':''}</strong></div>`;

  // chart
  const labels = COURSES.map(c=>c.title);
  const data = COURSES.map(c=> userCourseProgress(c.id));
  const ctx = document.getElementById('progressChart').getContext('2d');
  try{
    window.progressChart && window.progressChart.destroy();
  }catch(e){}
  window.progressChart = new Chart(ctx, {
    type:'bar',
    data:{ labels, datasets:[{ label:'Progress %', data, backgroundColor:labels.map(()=> 'rgba(79,70,229,0.8)') }] },
    options:{ responsive:true, scales:{ y:{ beginAtZero:true, max:100 } } }
  });
}

/* =========================
   Auth (mock)
========================= */
function openAuth(mode){
  const modal = $('#authModal'); modal.classList.remove('hidden');
  $('#authMsg').textContent = '';
  if (mode === 'signup'){ $('#authTitle').textContent='Sign up'; $('#authName').classList.remove('hidden'); $('#authSubmit').onclick = doSignup; }
  else { $('#authTitle').textContent='Login'; $('#authName').classList.add('hidden'); $('#authSubmit').onclick = doLogin; }
}
$('#authCancel').onclick = ()=> $('#authModal').classList.add('hidden');

function doSignup(){
  const name = $('#authName').value.trim(); const email = $('#authEmail').value.trim().toLowerCase(); const pass = $('#authPassword').value;
  if (!name||!email||!pass){ $('#authMsg').textContent='Fill all fields'; return; }
  USERS = read(LS.USERS, []);
  if (USERS.find(u=>u.email===email)){ $('#authMsg').textContent='Email exists'; return; }
  const user = { id:'u_'+Date.now(), name, email, pass };
  USERS.push(user); save(LS.USERS, USERS);
  CURRENT = { id:user.id, name:user.name, email:user.email }; save(LS.CURRENT, CURRENT);
  $('#authModal').classList.add('hidden'); renderNavUserArea(); toast('Signed up'); renderDashboard(); renderCertificates();
}

function doLogin(){
  const email = $('#authEmail').value.trim().toLowerCase(); const pass = $('#authPassword').value;
  USERS = read(LS.USERS, []);
  const u = USERS.find(x=>x.email===email && x.pass===pass);
  if (!u){ $('#authMsg').textContent='Invalid credentials'; return; }
  CURRENT = { id:u.id, name:u.name, email:u.email }; save(LS.CURRENT, CURRENT);
  $('#authModal').classList.add('hidden'); renderNavUserArea(); toast('Logged in'); renderDashboard(); renderCertificates();
}

/* =========================
   Search system
========================= */
$('#globalSearch')?.addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if (!q) { renderCourses(); return; }
  const results = COURSES.filter(c=> (c.title + c.description + c.category + (c.lessons||[]).map(l=>l.title).join(' ')).toLowerCase().includes(q));
  $('#coursesGrid').innerHTML = results.map(c=>`<div class="course-card md-card"><div style="display:flex;justify-content:space-between"><div><strong>${c.title}</strong><div class="muted">${c.category}</div></div><div class="badge">${c.rating}★</div></div><p class="muted">${c.description}</p><div style="margin-top:8px"><button class="btn primary" onclick="openCourse('${c.id}')">Open</button></div></div>`).join('');
});

/* =========================
   Init
========================= */
document.addEventListener('DOMContentLoaded', ()=>{
  COURSES = read(LS.COURSES, SAMPLE);
  USERS = read(LS.USERS, []);
  CURRENT = read(LS.CURRENT, null);
  PROGRESS = read(LS.PROGRESS, {});
  CERTS = read(LS.CERTS, []);
  renderNavUserArea();
  renderHome();
  renderCourses();
  renderDashboard();
  renderCertificates();
  try{ hljs.highlightAll(); }catch(e){}
});
