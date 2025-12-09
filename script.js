/*
  script.js — Single-file full learning platform
  - Courses data (6 courses)
  - Navigation (single-page)
  - Auth (signup/login/logout) stored in LocalStorage
  - Progress tracking per user
  - Lessons, quizzes, certificate generation
  - Theme toggle (persisted)
  - Search, categories, copy-to-clipboard, small exercise heuristics
*/

/* ---------- Constants & LocalStorage Keys ---------- */
const LS = {
  COURSES: 'learnify_courses_v2',
  USERS: 'learnify_users_v2',
  CURRENT: 'learnify_current_v2',
  PROGRESS: 'learnify_progress_v2',
  CERTS: 'learnify_certs_v2',
  THEME: 'learnify_theme_v2'
};

/* ---------- Utility helpers ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
function toast(msg, ms = 3000){
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg; t.classList.remove('hidden');
  setTimeout(()=> t.classList.add('hidden'), ms);
}
function saveLS(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function readLS(key, fallback){ const v = localStorage.getItem(key); if (!v) return fallback; try { return JSON.parse(v);} catch(e){ return fallback; } }

/* ---------- Initial sample data (6 courses, many lessons) ---------- */
const SAMPLE_COURSES = [
  { id: "c-html", title:"HTML & CSS Fundamentals", category:"Web Dev", difficulty:"Beginner", rating:4.8,
    description:"HTML & CSS building blocks, Flexbox, Grid and responsive basics.",
    lessons: [
      { id:"c-html-l1", title:"Intro to HTML", duration:"8m",
        content:`<h3>Intro to HTML</h3><p>HTML defines page structure.</p>
          <pre><code>&lt;!doctype html&gt;
&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;&lt;h1&gt;Hi&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
          <p>Exercise: create header/main/footer</p>
          <textarea id="exercise-c-html-l1" rows="5" placeholder="Paste your html..."></textarea>
          <div style="margin-top:.5rem"><button class="btn ghost" data-clear="c-html-l1">Clear</button><button class="btn primary" data-exec="c-html-l1">Check</button></div>
          <div id="exercise-result-c-html-l1" class="muted" style="margin-top:.5rem"></div>`
      },
      { id:"c-html-l2", title:"Semantic Tags", duration:"10m",
        content:`<h3>Semantic Tags</h3><p>Use &lt;header&gt; &lt;nav&gt; &lt;main&gt; etc.</p>
          <div class="mcq" data-quiz="c-html-l2"><div class="quiz-q">Which is a semantic tag?</div>
          <div class="options"><div class="opt">&lt;div&gt;</div><div class="opt">&lt;nav&gt;</div><div class="opt">&lt;span&gt;</div></div><div class="mcq-result muted"></div></div>`
      },
      { id:"c-html-l3", title:"CSS Selectors", duration:"12m",
        content:`<h3>Selectors</h3><pre><code>.card { padding: 12px; }</code></pre>`
      },
      { id:"c-html-l4", title:"Flexbox", duration:"14m", content:`<h3>Flexbox</h3><pre><code>.row{display:flex;gap:8px}</code></pre>` },
      { id:"c-html-l5", title:"Grid Basics", duration:"14m", content:`<h3>Grid</h3><pre><code>.grid{display:grid;grid-template-columns:1fr 1fr}</code></pre>` },
      { id:"c-html-l6", title:"Responsive Images", duration:"7m", content:`<h3>Images</h3><p>Use srcset and sizes.</p>` }
    ],
    quiz: { questions:[
      {q:"Which tag is paragraph?", choices:["<p>","<div>","<h1>"], a:0},
      {q:"Flexbox is best for?", choices:["1D Layout","2D Layout","Database"], a:0}
    ]}
  },

  { id:"c-js", title:"JavaScript Essentials", category:"Web Dev", difficulty:"Beginner", rating:4.7,
    description:"JS fundamentals: variables, functions, DOM, async.",
    lessons:[
      { id:"c-js-l1", title:"Variables & Types", duration:"9m",
        content:`<h3>Variables</h3><pre><code>let a = 1; const name = "Sayed";</code></pre>
          <p>Exercise: predict output</p>
          <pre><code>let a = 1; function test(){ console.log(a); let a = 2; } test();</code></pre>`
      },
      { id:"c-js-l2", title:"Functions & Scope", duration:"11m",
        content:`<h3>Functions</h3><p>Write sum(...nums)</p>
          <textarea id="exercise-c-js-l2" rows="4" placeholder="// function sum(...nums){}"></textarea>
          <div style="margin-top:.5rem"><button class="btn primary" data-exec="c-js-l2">Check</button><button class="btn ghost" data-clear="c-js-l2">Clear</button></div>
          <div id="exercise-result-c-js-l2" class="muted" style="margin-top:.5rem"></div>`
      },
      { id:"c-js-l3", title:"DOM Manipulation", duration:"10m", content:`<h3>DOM</h3><p>document.querySelector('#id')</p>` },
      { id:"c-js-l4", title:"Events", duration:"9m", content:`<h3>Events</h3>` },
      { id:"c-js-l5", title:"Promises & Async", duration:"14m", content:`<h3>Async</h3>` },
      { id:"c-js-l6", title:"Fetch API", duration:"10m", content:`<h3>Fetch</h3>` },
      { id:"c-js-l7", title:"ES6+", duration:"10m", content:`<h3>ES6</h3>` },
      { id:"c-js-l8", title:"Debugging", duration:"8m", content:`<h3>Debug</h3>` }
    ],
    quiz:{ questions:[
      {q:"Which keyword is block-scoped?", choices:["var","let","function"], a:1},
      {q:"What does === test?", choices:["value only","type only","value and type"], a:2}
    ]}
  },

  { id:"c-responsive", title:"Responsive Web Design", category:"Design", difficulty:"Intermediate", rating:4.6,
    description:"Media queries, fluid layouts, mobile-first.",
    lessons:[
      { id:"c-res-l1", title:"Viewport Meta", duration:"6m", content:`<h3>Viewport</h3><p>&lt;meta name="viewport"&gt;</p>` },
      { id:"c-res-l2", title:"Media Queries", duration:"12m", content:`<h3>Media</h3>` },
      { id:"c-res-l3", title:"Fluid Images", duration:"6m", content:`<h3>Fluid</h3>` },
      { id:"c-res-l4", title:"Mobile-first", duration:"8m", content:`<h3>Mobile-first</h3>` },
      { id:"c-res-l5", title:"Testing Tools", duration:"7m", content:`<h3>DevTools</h3>` }
    ],
    quiz:{ questions:[
      {q:"Media queries let you...", choices:["Change layout by width","Change page title","Remove images"], a:0}
    ]}
  },

  // NEW Course 4
  { id:"c-projects", title:"Front-End Projects (Portfolio)", category:"Projects", difficulty:"Intermediate", rating:4.9,
    description:"Build portfolio-ready projects (todo, kanban, e-commerce).",
    lessons:[
      { id:"c-proj-l1", title:"Portfolio Site", duration:"14m", content:`<h3>Portfolio</h3><p>Structure & showcase your work.</p>` },
      { id:"c-proj-l2", title:"Todo App", duration:"18m", content:`<h3>Todo App</h3><p>Add/edit/delete tasks.</p>` },
      { id:"c-proj-l3", title:"Weather App", duration:"16m", content:`<h3>Weather</h3><p>Use fetch to call APIs.</p>` },
      { id:"c-proj-l4", title:"Kanban Board", duration:"20m", content:`<h3>Kanban</h3><p>Drag & drop tasks.</p>` },
      { id:"c-proj-l5", title:"Blog", duration:"12m", content:`<h3>Blog</h3><p>Static posts & layout.</p>` },
      { id:"c-proj-l6", title:"E-commerce Mock", duration:"22m", content:`<h3>E-commerce</h3><p>Product listing & cart.</p>` }
    ],
    quiz:{ questions:[
      {q:"Which project best shows UI skills?", choices:["Portfolio","Database"], a:0}
    ]}
  },

  // NEW Course 5
  { id:"c-git", title:"Git & GitHub for Beginners", category:"Tools", difficulty:"Beginner", rating:4.5,
    description:"Version control basics and GitHub flow.",
    lessons:[
      { id:"c-git-l1", title:"Git Basics", duration:"8m", content:`<pre><code>git init\ngit add .\ngit commit -m "init"</code></pre>` },
      { id:"c-git-l2", title:"Branches", duration:"10m", content:`<h3>Branches</h3><p>git branch & checkout</p>` },
      { id:"c-git-l3", title:"GitHub", duration:"12m", content:`<h3>GitHub</h3><p>Push & PR.</p>` },
      { id:"c-git-l4", title:"Workflows", duration:"9m", content:`<h3>CI</h3><p>GitHub Actions basics</p>` }
    ],
    quiz:{ questions:[
      {q:"Which command commits?", choices:["git commit","git push","git add"], a:0}
    ]}
  },

  // NEW Course 6
  { id:"c-advanced-js", title:"Advanced JavaScript Patterns", category:"Web Dev", difficulty:"Advanced", rating:4.9,
    description:"Closures, patterns, performance, memory & optimization.",
    lessons:[
      { id:"c-aj-l1", title:"Closures & Modules", duration:"16m", content:`<h3>Closures</h3><p>Private state & factory functions.</p>` },
      { id:"c-aj-l2", title:"Design Patterns", duration:"18m", content:`<h3>Patterns</h3><p>Factory, Singleton, Observer.</p>` },
      { id:"c-aj-l3", title:"Performance", duration:"12m", content:`<h3>Performance</h3><p>Optimize rendering & loops.</p>` },
      { id:"c-aj-l4", title:"Memory", duration:"12m", content:`<h3>Memory</h3><p>Garbage collection basics.</p>` }
    ],
    quiz:{ questions:[
      {q:"Closure example returns a function that...", choices:["Can access outer variables","Deletes variables","Runs only once"], a:0}
    ]}
  }
];

/* persist sample courses if missing */
if (!localStorage.getItem(LS.COURSES)) saveLS(LS.COURSES, SAMPLE_COURSES);

/* ---------- State ---------- */
let COURSES = readLS(LS.COURSES, SAMPLE_COURSES);
let USERS = readLS(LS.USERS, []);
let CURRENT = readLS(LS.CURRENT, null);
let PROGRESS = readLS(LS.PROGRESS, {});
let CERTS = readLS(LS.CERTS, []);
let CURRENT_ROUTE = 'home';
let HISTORY_STACK = [];

/* ---------- Theme init ---------- */
(function initTheme(){
  const saved = localStorage.getItem(LS.THEME) || 'light';
  if (saved === 'dark') document.documentElement.setAttribute('data-theme','dark');
})();
$('#themeToggle')?.addEventListener('click', ()=>{
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : '');
  localStorage.setItem(LS.THEME, next);
});

/* ---------- Render user area ---------- */
function renderUserArea(){
  const area = $('#userArea');
  if (!area) return;
  if (CURRENT) {
    area.innerHTML = `<span class="muted">Hi, ${CURRENT.name}</span>
      <button class="btn ghost" id="logoutBtn">Logout</button>`;
    $('#logoutBtn').addEventListener('click', ()=> {
      localStorage.removeItem(LS.CURRENT); CURRENT = null; renderUserArea(); toast('Logged out'); navigate('home'); renderProgressOverview();
    });
  } else {
    area.innerHTML = `<button class="btn ghost" id="loginBtn">Login</button>
      <button class="btn primary" id="signupBtn">Sign up</button>`;
    $('#loginBtn').addEventListener('click', ()=> openAuth('login'));
    $('#signupBtn').addEventListener('click', ()=> openAuth('signup'));
  }
}
renderUserArea();

/* ---------- Navigation ---------- */
function hideAllPages(){ $$('.page').forEach(p=> p.classList.remove('active')); }
function navigate(route){
  if (!route) route = 'home';
  HISTORY_STACK.push(CURRENT_ROUTE);
  CURRENT_ROUTE = route;
  hideAllPages();
  const page = $('#'+route);
  if (page) page.classList.add('active');
  // route-specific inits
  if (route === 'courses') renderCoursesGrid();
  if (route === 'home') renderFeatured();
  if (route === 'progress') renderProgressOverview();
  if (route === 'certs') renderCertificates();
  window.scrollTo({top:0,behavior:'smooth'});
}
function goBackSafe(){
  const prev = HISTORY_STACK.pop();
  if (prev) navigate(prev); else navigate('courses');
}

/* sidebar toggle */
$('#hamburger')?.addEventListener('click', ()=>{
  const sb = $('#sidebar');
  sb.style.display = sb.style.display === 'none' || !sb.style.display ? 'block' : 'none';
});

/* ---------- Search & categories ---------- */
$('#globalSearch')?.addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if (!q) { renderCoursesGrid(); return; }
  const results = COURSES.filter(c => (c.title + (c.description||'') + (c.category||'')).toLowerCase().includes(q) || c.lessons.some(l=> (l.title + (l.content||'')).toLowerCase().includes(q)));
  renderCourseGridTo('#coursesGrid', results);
});

/* ---------- Render featured & categories ---------- */
function renderFeatured(){
  COURSES = readLS(LS.COURSES, SAMPLE_COURSES);
  const featured = COURSES.slice(0,4);
  const el = $('#featuredGrid'); if (!el) return;
  el.innerHTML = featured.map(c=>`<div class="course-card glass-card" onclick="openCourse('${c.id}')"><div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${c.title}</strong><div class="muted">${c.category} • ${c.difficulty||''}</div></div><div class="badge">${c.rating}★</div></div><p class="muted" style="margin-top:8px">${c.description}</p></div>`).join('');
  // categories
  const cats = Array.from(new Set(COURSES.map(c=>c.category)));
  $('#categoryChips').innerHTML = cats.map(cat=>`<div class="chip" onclick="filterByCat('${cat}')">${cat}</div>`).join('');
}

/* ---------- Courses Grid ---------- */
function renderCoursesGrid(){
  COURSES = readLS(LS.COURSES, SAMPLE_COURSES);
  const filter = $('#filterCategory');
  const sortBy = $('#sortBy');

  // populate category filter
  const cats = Array.from(new Set(COURSES.map(c=>c.category)));
  if (filter) filter.innerHTML = `<option value="">All categories</option>` + cats.map(cat=>`<option value="${cat}">${cat}</option>`).join('');

  renderCourseGridTo('#coursesGrid', COURSES);

  if (sortBy) sortBy.onchange = ()=> {
    const val = sortBy.value;
    let arr = [...COURSES];
    if (val === 'rating') arr.sort((a,b)=> (b.rating||0) - (a.rating||0));
    if (val === 'progress' && CURRENT) arr.sort((a,b)=> userCourseProgress(b.id) - userCourseProgress(a.id));
    renderCourseGridTo('#coursesGrid', arr);
  };
}

function filterByCat(cat){
  const arr = COURSES.filter(c=> c.category === cat);
  renderCourseGridTo('#coursesGrid', arr);
}

function renderCourseGridTo(selector, list){
  const container = document.querySelector(selector);
  if (!container) return;
  container.innerHTML = '';
  list.forEach(c=>{
    const progress = CURRENT ? Math.round(userCourseProgress(c.id)) : 0;
    const div = document.createElement('div'); div.className = 'course-card';
    div.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${c.title}</strong><div class="muted">${c.category} • ${c.difficulty||''}</div></div><div style="text-align:right"><div class="muted">${progress}%</div><div class="muted">${c.rating}★</div></div></div><p class="muted" style="margin-top:8px">${c.description}</p><div style="display:flex;gap:8px;margin-top:8px"><button class="btn ghost" onclick="openCourse('${c.id}')">Preview</button><button class="btn primary" onclick="openCourse('${c.id}')">Open</button></div>`;
    container.appendChild(div);
  });
}

/* ---------- Course view ---------- */
let ACTIVE_COURSE = null;
function openCourse(courseId){
  COURSES = readLS(LS.COURSES, SAMPLE_COURSES);
  const c = COURSES.find(x=>x.id === courseId);
  if (!c) { toast('Course not found'); return; }
  ACTIVE_COURSE = c;
  $('#courseHeader').innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div><h2>${c.title}</h2><div class="muted">${c.category} • ${c.difficulty}</div><p class="muted" style="margin-top:8px">${c.description}</p></div><div><div class="badge">${c.rating}★</div><div style="margin-top:10px;color:var(--muted)">Progress: ${CURRENT? userCourseProgress(c.id) : 0}%</div></div></div>`;
  $('#lessonList').innerHTML = `<h3>Lessons</h3>` + c.lessons.map((l,idx)=> `<div class="lesson-row" style="display:flex;justify-content:space-between;align-items:center;padding:8px;border-radius:8px;margin-top:8px;border:1px solid var(--glass-border)"><div><strong>${l.title}</strong><div class="muted">${l.duration}</div></div><div><button class="btn ghost" onclick="openLesson('${c.id}','${l.id}')">Open</button></div></div>`).join('') + `<div style="margin-top:12px"><button class="btn primary" onclick="startCourse('${c.id}')">Start Course</button></div>`;
  navigate('courseView');
}

/* Start course: go to first lesson */
function startCourse(courseId){
  const c = COURSES.find(x=>x.id===courseId);
  if (!c || !c.lessons || c.lessons.length===0) { toast('No lessons'); return; }
  openLesson(courseId, c.lessons[0].id);
}

/* ---------- Lesson view ---------- */
let ACTIVE_LESSON = null;
function openLesson(courseId, lessonId){
  COURSES = readLS(LS.COURSES, SAMPLE_COURSES);
  const course = COURSES.find(c=>c.id===courseId);
  if (!course) { toast('Course not found'); return; }
  const lesson = course.lessons.find(l=>l.id===lessonId);
  if (!lesson) { toast('Lesson not found'); return; }
  ACTIVE_COURSE = course;
  ACTIVE_LESSON = lesson;

  $('#lessonMeta').innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div><h2>${lesson.title}</h2><div class="muted">${course.title} • ${lesson.duration}</div></div><div><div class="muted">Lesson</div></div></div>`;
  $('#lessonBody').innerHTML = lesson.content + `<div style="margin-top:12px"><button class="btn small ghost" id="copyCodeBtn">Copy Code</button></div>`;

  // highlight code blocks if highlight.js loaded
  setTimeout(()=> { try { if (window.hljs) window.hljs.highlightAll(); } catch(e){} }, 60);

  // wire copy-to-clipboard (copies first code block)
  const cbtn = $('#copyCodeBtn');
  cbtn.onclick = ()=> {
    const codeEl = $('#lessonBody pre code');
    if (!codeEl) { toast('No code block found'); return; }
    const text = codeEl.innerText;
    navigator.clipboard.writeText(text).then(()=> toast('Code copied to clipboard'));
  };

  // mark complete
  $('#markCompleteBtn').onclick = ()=> {
    if (!CURRENT) { toast('Please sign up / login to track progress'); openAuth('login'); return; }
    const done = toggleLessonComplete(courseId, lessonId);
    $('#markCompleteBtn').textContent = done ? 'Completed' : 'Mark Complete';
    renderCourseProgressInHeader(courseId);
    renderProgressOverview();
  };

  // next lesson
  $('#nextLessonBtn').onclick = ()=> {
    const idx = course.lessons.findIndex(x=>x.id === lessonId);
    if (idx < course.lessons.length - 1) {
      const nxt = course.lessons[idx+1];
      openLesson(courseId, nxt.id);
    } else toast('This is the last lesson');
  };

  // start quiz
  $('#startQuizBtn').onclick = ()=> {
    if (!course.quiz || !course.quiz.questions || course.quiz.questions.length===0) { toast('No quiz for this course'); return; }
    renderQuiz(course.id);
  };

  // update mark button label if completed
  if (CURRENT && isLessonCompleted(courseId, lessonId)) $('#markCompleteBtn').textContent = 'Completed'; else $('#markCompleteBtn').textContent = 'Mark Complete';

  navigate('lessonView');
}

/* Update course header progress indicator */
function renderCourseProgressInHeader(courseId){
  // Update lesson list header progress text
  const course = COURSES.find(c=>c.id===courseId);
  if (!course) return;
  const progress = userCourseProgress(courseId);
  // if currently on course view header, update the block
  const header = $('#courseHeader');
  if (header && ACTIVE_COURSE && ACTIVE_COURSE.id === courseId) {
    header.querySelector('.muted') && (header.querySelector('.muted').textContent = `${COURSES.find(c=>c.id===courseId).category} • ${COURSES.find(c=>c.id===courseId).difficulty || ''}`);
  }
}

/* ---------- Quizzes ---------- */
let QUIZ_STATE = null;
function renderQuiz(courseId){
  const course = COURSES.find(c=>c.id===courseId);
  if (!course || !course.quiz) { toast('No quiz'); return; }
  const questions = course.quiz.questions;
  QUIZ_STATE = { courseId, questions, answers: Array(questions.length).fill(null) };
  const wrapper = $('#quizWrapper');
  wrapper.innerHTML = `<h3>Quiz • ${course.title}</h3>${questions.map((q,i)=>`<div class="glass-card"><div><strong>Q${i+1}:</strong> ${q.q}</div><div class="options" style="margin-top:8px">${q.choices.map((opt,oi)=>`<label style="display:block;margin-top:6px"><input type="radio" name="q${i}" value="${oi}" /> ${opt}</label>`).join('')}</div></div>`).join('') }<div style="margin-top:12px"><button class="btn primary" id="submitQuiz">Submit</button><button class="btn ghost" id="resetQuiz">Reset</button></div>`;
  $('#submitQuiz').onclick = submitQuiz;
  $('#resetQuiz').onclick = ()=> renderQuiz(courseId);
  navigate('quizView');
}

function submitQuiz(){
  if (!QUIZ_STATE) return;
  const q = QUIZ_STATE.questions;
  let answers = [];
  for (let i=0;i<q.length;i++){
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    answers.push(selected ? Number(selected.value) : null);
  }
  if (answers.some(a=>a===null)) return toast('Please answer all questions');
  let score = 0; q.forEach((qq,i)=> { if (answers[i] === qq.a) score++; });
  const pct = Math.round((score / q.length) * 100);
  // save certificate if passed
  if (!CURRENT) { toast('Login to save result'); openAuth('login'); return; }
  if (pct >= 60) {
    const cert = { id: 'cert_' + Date.now(), userId: CURRENT.id, name: CURRENT.name, courseId: QUIZ_STATE.courseId, courseTitle: COURSES.find(c=>c.id===QUIZ_STATE.courseId).title, pct, date: new Date().toISOString().split('T')[0] };
    CERTS.push(cert); saveLS(LS.CERTS, CERTS); toast('Passed — certificate saved!');
  } else {
    toast('You did not pass — try again');
  }
  // show result view
  $('#quizWrapper').innerHTML = `<div class="glass-card"><h3>Results</h3><p>Your score: <strong>${score}/${q.length}</strong> (${pct}%)</p><div style="margin-top:12px"><button class="btn primary" id="downloadCertBtn">Download Certificate</button><button class="btn ghost" onclick="navigate('courseView')">Back to Course</button></div></div>`;
  $('#downloadCertBtn').onclick = ()=> {
    const dataUrl = generateCertificateImage(CURRENT.name, COURSES.find(c=>c.id===QUIZ_STATE.courseId).title, pct);
    const a = document.createElement('a'); a.href = dataUrl; a.download = `${COURSES.find(c=>c.id===QUIZ_STATE.courseId).title.replace(/\s+/g,'_')}_certificate.png`; a.click();
  };
}

/* ---------- Certificates ---------- */
function renderCertificates(){
  const list = $('#certList'); list.innerHTML = '';
  if (!CURRENT) { list.innerHTML = '<div>Please login to view certificates</div>'; return; }
  const mine = CERTS.filter(c=> c.userId === CURRENT.id);
  if (mine.length === 0) { list.innerHTML = '<div>No certificates yet. Complete courses and pass quizzes to earn one.</div>'; return; }
  list.innerHTML = mine.map(c=>`<div class="course-card glass-card"><div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${c.courseTitle}</strong><div class="muted">${c.date} • ${c.pct}%</div></div><div><button class="btn primary" onclick="downloadCert('${c.id}')">Download</button></div></div></div>`).join('');
}
function downloadCert(certId){
  const c = CERTS.find(x=>x.id === certId);
  if (!c) return toast('Certificate not found');
  const dataUrl = generateCertificateImage(c.name, c.courseTitle, c.pct, c.date);
  const a = document.createElement('a'); a.href = dataUrl; a.download = `${c.courseTitle.replace(/\s+/g,'_')}_certificate.png`; a.click();
}
function generateCertificateImage(name, courseTitle, pct, dateStr){
  const date = dateStr || new Date().toISOString().split('T')[0];
  const canvas = document.getElementById('certCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1200; canvas.height = 675;
  // background
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0, canvas.width, canvas.height);
  // glass banner
  ctx.fillStyle = '#f3f4ff'; ctx.fillRect(60,60,canvas.width-120,120);
  // title
  ctx.fillStyle = '#0f1724'; ctx.font = '48px Inter'; ctx.fillText('Certificate of Completion', 100, 150);
  ctx.font = '28px Inter'; ctx.fillText(courseTitle, 100, 240);
  ctx.font = '36px Inter'; ctx.fillText(`Awarded to: ${name}`, 100, 320);
  ctx.font = '20px Inter'; ctx.fillStyle = '#374151'; ctx.fillText(`Score: ${pct}% • Date: ${date}`, 100, 380);
  // badge
  ctx.beginPath(); ctx.arc(canvas.width - 180, 180, 80, 0, Math.PI*2); ctx.fillStyle = '#7c4dff'; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '28px Inter'; ctx.fillText('PASS', canvas.width - 220, 195);
  return canvas.toDataURL('image/png');
}

/* ---------- Progress tracking ---------- */
function toggleLessonComplete(courseId, lessonId){
  if (!CURRENT) { toast('Login required'); openAuth('login'); return false; }
  PROGRESS = readLS(LS.PROGRESS, {});
  PROGRESS[CURRENT.id] = PROGRESS[CURRENT.id] || {};
  PROGRESS[CURRENT.id][lessonId] = !PROGRESS[CURRENT.id][lessonId];
  saveLS(LS.PROGRESS, PROGRESS);
  return PROGRESS[CURRENT.id][lessonId];
}
function isLessonCompleted(courseId, lessonId){
  PROGRESS = readLS(LS.PROGRESS, {});
  return !!(CURRENT && PROGRESS[CURRENT.id] && PROGRESS[CURRENT.id][lessonId]);
}
function userCourseProgress(courseId){
  const course = COURSES.find(c=>c.id === courseId);
  if (!course || !course.lessons) return 0;
  if (!CURRENT) return 0;
  PROGRESS = readLS(LS.PROGRESS, {});
  const total = course.lessons.length;
  const done = course.lessons.reduce((acc, l)=> acc + ((PROGRESS[CURRENT.id] && PROGRESS[CURRENT.id][l.id]) ? 1 : 0), 0);
  return Math.round((done/total) * 100);
}
function renderProgressOverview(){
  const box = $('#progressOverview'); if (!box) return;
  if (!CURRENT) { box.innerHTML = '<div>Please login to see progress.</div>'; return; }
  PROGRESS = readLS(LS.PROGRESS, {});
  let html = '';
  COURSES.forEach(c => {
    const pct = userCourseProgress(c.id);
    html += `<div class="glass-card"><div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${c.title}</strong><div class="muted">${c.category}</div></div><div style="text-align:right"><div class="muted">${pct}%</div><div style="height:8px;background:rgba(0,0,0,0.06);width:120px;border-radius:8px;margin-top:6px"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:8px"></div></div></div></div></div>`;
  });
  box.innerHTML = html;
}

/* ---------- Auth (signup/login modal) ---------- */
const authModal = $('#authModal'), authTitle = $('#authTitle'), authName = $('#authName'), authEmail = $('#authEmail'), authPassword = $('#authPassword'), authMsg = $('#authMsg');
$('#authCancel')?.addEventListener('click', ()=> authModal.classList.add('hidden'));

function openAuth(mode){
  authModal.classList.remove('hidden');
  if (mode === 'signup') {
    authTitle.textContent = 'Sign up'; authName.classList.remove('hidden'); authEmail.value=''; authPassword.value=''; authMsg.textContent='';
    $('#authSubmit').onclick = doSignup;
  } else {
    authTitle.textContent = 'Login'; authName.classList.add('hidden'); authEmail.value=''; authPassword.value=''; authMsg.textContent='';
    $('#authSubmit').onclick = doLogin;
  }
}

function doSignup(){
  const name = authName.value && authName.value.trim();
  const email = authEmail.value && authEmail.value.trim().toLowerCase();
  const pass = authPassword.value;
  if (!name || !email || !pass) { authMsg.textContent = 'Fill all fields'; return; }
  USERS = readLS(LS.USERS, []);
  if (USERS.find(u=>u.email === email)) { authMsg.textContent = 'Email already exists'; return; }
  const user = { id: 'u_' + Date.now(), name, email, pass };
  USERS.push(user); saveLS(LS.USERS, USERS);
  CURRENT = { id:user.id, name:user.name, email:user.email }; saveLS(LS.CURRENT, CURRENT);
  authModal.classList.add('hidden'); renderUserArea(); toast('Account created — welcome!'); renderProgressOverview(); renderCertificates();
}

function doLogin(){
  const email = authEmail.value && authEmail.value.trim().toLowerCase();
  const pass = authPassword.value;
  if (!email || !pass) { authMsg.textContent = 'Fill all fields'; return; }
  USERS = readLS(LS.USERS, []);
  const u = USERS.find(x=> x.email === email && x.pass === pass);
  if (!u) { authMsg.textContent = 'Invalid credentials'; return; }
  CURRENT = { id:u.id, name:u.name, email:u.email }; saveLS(LS.CURRENT, CURRENT);
  authModal.classList.add('hidden'); renderUserArea(); toast('Logged in'); renderProgressOverview(); renderCertificates();
}

/* initialise auth from storage */
(function initAuth(){
  USERS = readLS(LS.USERS, []); CURRENT = readLS(LS.CURRENT, null); CERTS = readLS(LS.CERTS, []); PROGRESS = readLS(LS.PROGRESS, {});
  renderUserArea();
})();

/* ---------- Exercise check handlers (safe heuristics) ---------- */
document.addEventListener('click', (e)=>{
  const exec = e.target.closest('[data-exec]');
  if (exec){
    const key = exec.getAttribute('data-exec');
    const ta = document.getElementById('exercise-' + key);
    const out = document.getElementById('exercise-result-' + key);
    if (!ta) { if (out) out.textContent = 'No input found'; return; }
    const code = ta.value.trim();
    let ok=false; let msg='';
    if (key.includes('html')) { ok = /<header|<main|<footer/i.test(code); msg = ok? 'Header/main/footer found' : 'Try adding header/main/footer'; }
    else if (key.includes('js')) { ok = /function\s+sum|return/.test(code); msg = ok? 'Sum function looks good' : 'Try implementing sum(...)'; }
    else { ok = code.length > 10; msg = ok? 'Input looks fine' : 'Please provide more content'; }
    if (out) { out.textContent = msg; out.style.color = ok? 'green' : ''; }
  }
  const clr = e.target.closest('[data-clear]');
  if (clr){
    const key = clr.getAttribute('data-clear'); const ta = document.getElementById('exercise-' + key); const out = document.getElementById('exercise-result-' + key);
    if (ta) ta.value=''; if (out) { out.textContent=''; out.style.color=''; }
  }
});

/* ---------- Initialize pages ---------- */
function init(){
  COURSES = readLS(LS.COURSES, SAMPLE_COURSES);
  USERS = readLS(LS.USERS, []);
  CURRENT = readLS(LS.CURRENT, null);
  PROGRESS = readLS(LS.PROGRESS, {});
  CERTS = readLS(LS.CERTS, []);
  renderFeatured();
  renderCoursesGrid();
  renderProgressOverview();
  renderCertificates();
  hookGlobalLinks();
}
function hookGlobalLinks(){
  // clicking a course open from featured: since featured had inline onclick, OK
  // make sidebar nav highlight optional
}
init();

/* ---------- Extra helpers: download project / export data (for portfolio testing) ---------- */
function downloadData(){
  const data = { COURSES, USERS, PROGRESS, CERTS };
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'})); a.download = 'learnify_data.json'; a.click();
}

/* ---------- Keep previous original functions (preserve all earlier code) ---------- */
/* Note: previous code was preserved implicitly: functions like navigate, goBackSafe, etc.
   No original functions were removed — functionality extended on top of them. */
