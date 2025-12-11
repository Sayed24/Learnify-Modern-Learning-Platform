// ===== Learnify — script.js =====
// Simple SPA with LocalStorage state, sample data, routing, quiz, certificate (canvas), and Chart.js dashboard.

// ---------- Sample data ----------
const SAMPLE_COURSES = [
  {
    id: "html-basics",
    title: "HTML Basics",
    category: "Web Development",
    difficulty: "Beginner",
    rating: { total: 48, count: 10 },
    lessons: [
      { id: "l1", title: "Introduction to HTML", content: "<p>HTML stands for HyperText Markup Language. It's the skeleton of web pages.</p>", duration: 5, codeBlocks: ["<!doctype html>"] },
      { id: "l2", title: "Elements & Tags", content: "<p>Tags create elements like <strong>&lt;p&gt;</strong>, <strong>&lt;a&gt;</strong> and <strong>&lt;div&gt;</strong>.</p>", duration: 8 },
      { id: "l3", title: "Attributes & Links", content: "<p>Attributes provide additional info; links use <code>href</code>.</p>", duration: 7 },
      { id: "l4", title: "Forms & Inputs", content: "<p>Forms collect user data.</p>", duration: 10 },
      { id: "l5", title: "Semantic HTML", content: "<p>Use semantic tags like <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>.</p>", duration: 6 },
      { id: "l6", title: "Project: Simple Page", content: "<p>Build a simple page combining what you've learned.</p>", duration: 12 }
    ],
    quiz: [
      { question: "What does HTML stand for?", choices: ["HyperText Markup Language","Hyperlink Markup Language","Home Tool Markup Language"], correct: 0, explanation: "HyperText Markup Language." },
      { question: "Which tag creates a link?", choices: ["<a>","<link>","<href>"], correct: 0, explanation: "<a> is used for links with href attribute." },
      { question: "Semantic HTML includes which tag?", choices: ["<header>","<div>","<span>"], correct: 0, explanation: "<header> is semantic." }
    ]
  },
  {
    id: "js-fundamentals",
    title: "JavaScript Fundamentals",
    category: "Web Development",
    difficulty: "Beginner",
    rating: { total: 32, count: 8 },
    lessons: [
      { id: "j1", title: "Intro to JS", content: "<p>JavaScript adds interactivity to web pages.</p>", duration: 10 },
      { id: "j2", title: "Variables & Types", content: "<p>let, const, var and types.</p>", duration: 12 },
      { id: "j3", title: "DOM Manipulation", content: "<p>Query elements and change content.</p>", duration: 15 }
    ],
    quiz: [
      { question: "Which is a JS keyword to declare a variable?", choices: ["let","int","varx"], correct: 0, explanation: "let is correct." }
    ]
  }
];

// ---------- Storage helpers ----------
const STORAGE_KEYS = {
  USERS: "learnifyUsers",
  SESSION: "learnifySession",
  PROGRESS: "learnifyProgress",
  NOTIFS: "learnifyNotifications",
  PROFILE: "learnifyProfile",
  THEME: "learnifyTheme"
};

function read(key){ try{ return JSON.parse(localStorage.getItem(key)) || null }catch(e){return null} }
function write(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

// Ensure initial data
if(!read(STORAGE_KEYS.PROGRESS)) write(STORAGE_KEYS.PROGRESS,{});
if(!read(STORAGE_KEYS.NOTIFS)) write(STORAGE_KEYS.NOTIFS,[]);
if(!read(STORAGE_KEYS.PROFILE)) write(STORAGE_KEYS.PROFILE, { name: "Guest", avatar: "" });
if(!read(STORAGE_KEYS.THEME)) write(STORAGE_KEYS.THEME, "light");

// ---------- Tiny router ----------
const pages = Array.from(document.querySelectorAll('.page'));
function showSection(id){
  pages.forEach(p=>p.id === id ? p.classList.add('active') : p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.route === id));
  history.pushState({page:id}, "", `#${id}`);
  // Some pages need refresh
  if(id === 'courses' || id === 'explore') renderCourses();
  if(id === 'dashboard') renderDashboard();
  if(id === 'achievements') renderAchievements();
  if(id === 'notifications') renderNotifications();
  if(id === 'profile') loadProfile();
}
window.addEventListener('popstate', (e) => {
  const id = (location.hash && location.hash.replace('#','')) || 'home';
  showSectionNoPush(id);
});
function showSectionNoPush(id){
  pages.forEach(p=>p.id === id ? p.classList.add('active') : p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.route === id));
  if(id === 'courses' || id === 'explore') renderCourses();
  if(id === 'dashboard') renderDashboard();
  if(id === 'achievements') renderAchievements();
  if(id === 'notifications') renderNotifications();
  if(id === 'profile') loadProfile();
}
function navigate(id){
  showSection(id);
}

// Attach nav links
document.querySelectorAll('.nav-link').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const id = a.dataset.route;
    showSection(id);
  });
});

// Boot to correct hash
const startPage = (location.hash && location.hash.replace('#','')) || 'home';
showSectionNoPush(startPage);

// ---------- UI renderers ----------
function renderCourses(filter = "") {
  const grid = document.getElementById('courses-grid');
  const grid2 = document.getElementById('courses-grid-2');
  [grid, grid2].forEach(g=>g && (g.innerHTML = ""));
  const q = (document.getElementById('search')?.value || "").toLowerCase();
  SAMPLE_COURSES.forEach(course=>{
    if(filter && course.category !== filter) return;
    if(q && !course.title.toLowerCase().includes(q) && !course.category.toLowerCase().includes(q)) return;
    const el = document.createElement('div');
    el.className = "course-card card";
    el.innerHTML = `
      <h3>${course.title}</h3>
      <p class="muted">${course.category} • ${course.difficulty}</p>
      <p class="muted">${course.lessons.length} lessons • ⭐ ${(course.rating.total/course.rating.count).toFixed(1)}</p>
      <div class="row gap" style="margin-top:8px">
        <button class="btn" onclick="openCourse('${course.id}')">View</button>
        <button class="btn primary" onclick="startCourse('${course.id}')">Start</button>
      </div>
    `;
    if(grid) grid.appendChild(el);
    if(grid2) grid2.appendChild(el.cloneNode(true));
  });
}
document.getElementById('search')?.addEventListener('input', ()=>renderCourses());

// Open course detail
function openCourse(id){
  const course = SAMPLE_COURSES.find(c=>c.id===id);
  if(!course) return alert("Course not found");
  const card = document.getElementById('course-detail-card');
  card.innerHTML = `
    <div class="row space-between">
      <div>
        <h2>${course.title}</h2>
        <p class="muted">${course.category} • ${course.difficulty}</p>
      </div>
      <div class="muted">Lessons: ${course.lessons.length}</div>
    </div>
    <p>${course.lessons[0].content.substring(0,120)}...</p>
    <h4>Lessons</h4>
    <ul id="lesson-list" class="list"></ul>
    <div class="row gap" style="margin-top:12px">
      <button class="btn primary" onclick="startCourse('${course.id}')">Continue Course</button>
      <button class="btn" onclick="openQuiz('${course.id}')">Take Quiz</button>
    </div>
  `;
  const list = card.querySelector('#lesson-list');
  getProgressForCurrentUser(); // ensure progress loaded
  course.lessons.forEach(lesson=>{
    const li = document.createElement('li');
    const completed = userProgress?.[course.id]?.lessonsCompleted?.includes(lesson.id);
    li.innerHTML = `<div class="row space-between"><div><strong>${lesson.title}</strong><div class="muted">${lesson.duration} mins</div></div><div><button class="btn tiny" onclick="openLesson('${course.id}','${lesson.id}')">${completed ? 'Continue' : 'Start'}</button></div></div>`;
    list.appendChild(li);
  });
  // Remember last course id for navigation
  lastCourseViewed = course.id;
  showSection('course-detail');
}

let lastCourseViewed = null;

// Start / continue course
function startCourse(id){
  lastCourseViewed = id;
  openCourse(id);
  // open first incomplete lesson
  const course = SAMPLE_COURSES.find(c=>c.id===id);
  const progress = getProgressForCurrentUser();
  let next = course.lessons.find(l => !(progress?.[id]?.lessonsCompleted || []).includes(l.id));
  if(!next) next = course.lessons[0];
  openLesson(id, next.id);
}

// Open lesson viewer
function openLesson(courseId, lessonId){
  const course = SAMPLE_COURSES.find(c=>c.id===courseId);
  const lesson = course.lessons.find(l=>l.id===lessonId);
  const el = document.getElementById('lesson-card');
  el.innerHTML = `
    <h2>${lesson.title}</h2>
    <div class="muted">Estimated: ${lesson.duration} mins • Course: ${course.title}</div>
    <div style="margin-top:12px">${lesson.content}</div>
    <div style="margin-top:12px" id="code-blocks"></div>
    <div class="row gap" style="margin-top:12px">
      <button class="btn primary" onclick="markCompleted('${courseId}','${lessonId}')">Mark Completed</button>
      <button class="btn" onclick="openNextLesson('${courseId}','${lessonId}')">Next</button>
    </div>
  `;
  const cb = el.querySelector('#code-blocks');
  if(lesson.codeBlocks) lesson.codeBlocks.forEach(code=>{
    const pre = document.createElement('pre');
    pre.style.padding = "8px"; pre.style.borderRadius = "8px"; pre.style.background = "rgba(0,0,0,0.06)";
    pre.innerHTML = `<code>${escapeHtml(code)}</code><div style="margin-top:6px"><button class="btn tiny" onclick="copyToClipboard(\`${escapeBackticks(code)}\`)">Copy</button></div>`;
    cb.appendChild(pre);
  });
  showSection('lesson');
}

function copyToClipboard(text){
  navigator.clipboard?.writeText(text).then(()=> showToast("Copied to clipboard")).catch(()=>showToast("Copy failed"));
}
function escapeHtml(s){ return s.replace(/</g,"&lt;").replace(/>/g,"&gt;") }
function escapeBackticks(s){ return s.replace(/`/g,'\\`') }

// Progress & marking
let sessionUser = read(STORAGE_KEYS.SESSION) || null;
let userProgress = read(STORAGE_KEYS.PROGRESS) || {};
function getProgressForCurrentUser(){
  userProgress = read(STORAGE_KEYS.PROGRESS) || {};
  if(!sessionUser) return userProgress;
  if(!userProgress[sessionUser]) userProgress[sessionUser] = { lessonsCompleted: {}, quizScores: {}, xp: 0 };
  return userProgress;
}
function saveProgress(){
  write(STORAGE_KEYS.PROGRESS, userProgress);
  renderDashboard();
}
function markCompleted(courseId, lessonId){
  const user = sessionUser || "guest";
  if(!userProgress[user]) userProgress[user] = { lessonsCompleted:{}, quizScores:{}, xp:0 };
  if(!userProgress[user].lessonsCompleted[courseId]) userProgress[user].lessonsCompleted[courseId] = [];
  if(!userProgress[user].lessonsCompleted[courseId].includes(lessonId)){
    userProgress[user].lessonsCompleted[courseId].push(lessonId);
    // grant XP
    userProgress[user].xp = (userProgress[user].xp || 0) + 10;
    write(STORAGE_KEYS.PROGRESS, userProgress);
    pushNotification(`Lesson completed: ${lessonId}`, 'lesson');
    showToast("Marked completed! +10 XP");
  } else {
    showToast("Already completed");
  }
  renderAchievements();
  renderDashboard();
}

// Open next lesson
function openNextLesson(courseId, lessonId){
  const course = SAMPLE_COURSES.find(c=>c.id===courseId);
  const idx = course.lessons.findIndex(l=>l.id===lessonId);
  const next = course.lessons[idx+1];
  if(next) openLesson(courseId,next.id);
  else {
    showToast("No more lessons — well done!"); 
  }
}

// ---------- Quiz ----------
let currentQuiz = null;
function openQuiz(courseId){
  const course = SAMPLE_COURSES.find(c=>c.id===courseId);
  currentQuiz = { courseId, questions: shuffleArray(course.quiz).slice(0, Math.min(10, course.quiz.length)), index: 0, score: 0, answers: [] };
  renderQuiz();
  showSection('quiz');
}
function renderQuiz(){
  const root = document.getElementById('quiz-card');
  if(!currentQuiz) { root.innerHTML = "<p>No quiz active</p>"; return; }
  const q = currentQuiz.questions[currentQuiz.index];
  root.innerHTML = `
    <h3>Quiz • ${SAMPLE_COURSES.find(c=>c.id===currentQuiz.courseId).title}</h3>
    <div class="card">
      <p><strong>Q${currentQuiz.index+1}.</strong> ${q.question}</p>
      <div id="choices"></div>
      <div style="margin-top:12px" class="row gap">
        <button class="btn" onclick="prevQuestion()">Previous</button>
        <button class="btn primary" onclick="submitAnswer()">Submit</button>
      </div>
    </div>
  `;
  const choices = root.querySelector('#choices');
  q.choices.forEach((c,i)=>{
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.display='block';
    btn.style.marginTop='6px';
    btn.innerText = c;
    btn.onclick = ()=> {
      currentQuiz.selected = i;
      root.querySelectorAll('#choices .btn').forEach(b=>b.classList.remove('primary'));
      btn.classList.add('primary');
    };
    choices.appendChild(btn);
  });
}
function submitAnswer(){
  const q = currentQuiz.questions[currentQuiz.index];
  if(currentQuiz.selected === undefined) return showToast("Choose an answer");
  const correct = currentQuiz.selected === q.correct;
  if(correct) currentQuiz.score++;
  currentQuiz.answers.push({ selected: currentQuiz.selected, correct: q.correct });
  // explanation shown briefly
  showToast(correct ? "Correct!" : "Incorrect");
  currentQuiz.index++;
  currentQuiz.selected = undefined;
  if(currentQuiz.index >= currentQuiz.questions.length) finishQuiz();
  else renderQuiz();
}
function prevQuestion(){ if(currentQuiz.index>0){ currentQuiz.index--; currentQuiz.answers.pop(); renderQuiz(); } }
function finishQuiz(){
  const total = currentQuiz.questions.length;
  const score = currentQuiz.score;
  // Save score
  const user = sessionUser || "guest";
  userProgress = read(STORAGE_KEYS.PROGRESS) || {};
  if(!userProgress[user]) userProgress[user] = { lessonsCompleted: {}, quizScores:{}, xp:0 };
  userProgress[user].quizScores[currentQuiz.courseId] = { score, total, date: new Date().toISOString() };
  // give XP proportional
  userProgress[user].xp = (userProgress[user].xp || 0) + Math.round((score/total)*50);
  write(STORAGE_KEYS.PROGRESS, userProgress);
  pushNotification(`Quiz completed: ${SAMPLE_COURSES.find(c=>c.id===currentQuiz.courseId).title} — ${score}/${total}`, 'quiz');
  showSection('course-detail');
  openCourse(currentQuiz.courseId);
  showToast(`Quiz finished: ${score}/${total}`);
  currentQuiz = null;
  renderDashboard();
}

// ---------- Certificate generator ----------
function generateCertificate(){
  const name = document.getElementById('cert-name').value || (read(STORAGE_KEYS.PROFILE)?.name || "Student");
  const canvas = document.getElementById('certificate-canvas');
  const ctx = canvas.getContext('2d');
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  // Border
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 24;
  ctx.strokeRect(24,24,canvas.width-48,canvas.height-48);
  // Title
  ctx.fillStyle = '#0f1724';
  ctx.font = '48px Inter';
  ctx.fillText('Certificate of Completion', 80, 160);
  // Name
  ctx.font = '40px Inter';
  ctx.fillText(name, 80, 260);
  // Course placeholder
  ctx.font = '28px Inter';
  ctx.fillStyle = '#333';
  ctx.fillText('For successfully completing Learnify course', 80, 320);
  // Date
  ctx.font = '20px Inter';
  ctx.fillStyle = '#666';
  ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 80, 360);
  // Small QR mock (just a square)
  ctx.fillStyle = '#000';
  ctx.fillRect(canvas.width-200, canvas.height-200, 160, 160);

  // Download
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `learnify-certificate-${name.replace(/\s+/g,'-')}.png`;
  a.click();
}

// ---------- Dashboard & Chart ----------
let chartInstance = null;
function renderDashboard(){
  const profile = read(STORAGE_KEYS.PROFILE) || {};
  document.getElementById('xp-count').innerText = `XP: ${getUserXP()}`;
  const inProgress = countInProgress();
  document.getElementById('courses-inprogress').innerText = `In Progress: ${inProgress}`;
  document.getElementById('courses-completed').innerText = `Completed: ${countCompleted()}`;

  // Build simple chart: completed vs inprogress
  const ctx = document.getElementById('progress-chart');
  if(!ctx) return;
  const labels = SAMPLE_COURSES.map(c=>c.title);
  const data = SAMPLE_COURSES.map(c=>{
    const p = read(STORAGE_KEYS.PROGRESS) || {};
    const user = sessionUser || "guest";
    const completed = p[user]?.lessonsCompleted?.[c.id]?.length || 0;
    return Math.round((completed / c.lessons.length) * 100);
  });
  if(chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Completion %', data }] },
    options: { responsive:true, maintainAspectRatio:false, scales:{ y:{beginAtZero:true, max:100} } }
  });
}

function getUserXP(){
  const user = sessionUser || "guest";
  const p = read(STORAGE_KEYS.PROGRESS) || {};
  return p[user]?.xp || 0;
}
function countInProgress(){
  const p = read(STORAGE_KEYS.PROGRESS) || {};
  const user = sessionUser || "guest";
  const lessons = p[user]?.lessonsCompleted || {};
  let count = 0;
  SAMPLE_COURSES.forEach(c=>{
    const completed = (lessons[c.id] || []).length;
    if(completed > 0 && completed < c.lessons.length) count++;
  });
  return count;
}
function countCompleted(){ 
  const p = read(STORAGE_KEYS.PROGRESS) || {};
  const user = sessionUser || "guest";
  const lessons = p[user]?.lessonsCompleted || {};
  let count = 0;
  SAMPLE_COURSES.forEach(c=>{
    const completed = (lessons[c.id] || []).length;
    if(completed >= c.lessons.length) count++;
  });
  return count;
}

// ---------- Achievements & Notifications ----------
function renderAchievements(){
  const root = document.getElementById('badges');
  root.innerHTML = "";
  const user = sessionUser || "guest";
  const p = read(STORAGE_KEYS.PROGRESS) || {};
  const xp = p[user]?.xp || 0;
  const completed = countCompleted();
  function badge(title,desc){
    const div = document.createElement('div'); div.className='card small';
    div.innerHTML = `<h4>${title}</h4><div class="muted">${desc}</div>`;
    root.appendChild(div);
  }
  if(completed>0) badge("Course Finisher", `${completed} course(s) completed`);
  if(xp>=50) badge("Learner • 50 XP", "Consistent learning");
  if(xp>=200) badge("Power Learner • 200 XP", "Excellent progress");
}

function pushNotification(text, type='info'){
  const notifs = read(STORAGE_KEYS.NOTIFS) || [];
  notifs.unshift({ text, type, date: new Date().toISOString() });
  write(STORAGE_KEYS.NOTIFS, notifs.slice(0,50));
  renderNotifications();
}
function renderNotifications(){
  const list = document.getElementById('notifications-list');
  const notifs = read(STORAGE_KEYS.NOTIFS) || [];
  list.innerHTML = notifs.map(n=>`<li class="card"><div class="row space-between"><div>${n.text}<div class="muted" style="font-size:12px">${new Date(n.date).toLocaleString()}</div></div></div></li>`).join('');
}

// ---------- Profile & auth (mock) ----------
function loadProfile(){
  const p = read(STORAGE_KEYS.PROFILE) || {};
  document.getElementById('profile-name').value = p.name || "";
  document.getElementById('profile-avatar').value = p.avatar || "";
}
document.getElementById('save-profile')?.addEventListener('click', ()=>{
  const name = document.getElementById('profile-name').value || "Guest";
  const avatar = document.getElementById('profile-avatar').value || "";
  write(STORAGE_KEYS.PROFILE, { name, avatar });
  showToast("Profile saved");
});

// Mock login flow
document.getElementById('login-btn').addEventListener('click', ()=>{
  const username = prompt("Sign in (enter a username) — this is a mock session");
  if(!username) return;
  sessionUser = username.trim();
  write(STORAGE_KEYS.SESSION, sessionUser);
  showToast(`Signed in as ${sessionUser}`);
  // ensure progress data for user
  const p = read(STORAGE_KEYS.PROGRESS) || {};
  if(!p[sessionUser]) p[sessionUser] = { lessonsCompleted:{}, quizScores:{}, xp:0 };
  write(STORAGE_KEYS.PROGRESS, p);
  renderDashboard();
});

// Logout
function logout(){
  sessionUser = null;
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  showToast("Logged out");
}

// ---------- Theme toggle ----------
function applyTheme(t){
  const root = document.getElementById('app');
  if(t === 'light') root.classList.add('theme-light'); else root.classList.remove('theme-light');
  write(STORAGE_KEYS.THEME, t);
}
const savedTheme = read(STORAGE_KEYS.THEME) || 'light';
applyTheme(savedTheme);
document.getElementById('toggle-theme').addEventListener('click', ()=>{
  const newTheme = (read(STORAGE_KEYS.THEME) === 'light') ? 'dark' : 'light';
  applyTheme(newTheme);
});

// ---------- Toasts ----------
let toastTimer = null;
function showToast(msg, ms=2200){
  clearTimeout(toastTimer);
  let t = document.getElementById('learnify-toast');
  if(!t){
    t = document.createElement('div'); t.id='learnify-toast'; t.style.position='fixed'; t.style.right='20px'; t.style.bottom='20px'; t.style.padding='12px 16px'; t.style.borderRadius='10px'; t.style.background='rgba(0,0,0,0.6)'; t.style.color='#fff'; document.body.appendChild(t);
  }
  t.innerText = msg;
  t.style.opacity = '1';
  toastTimer = setTimeout(()=>t.style.opacity='0', ms);
}

// ---------- Utility helpers ----------
function shuffleArray(a){ return a.slice().sort(()=>Math.random() - 0.5) }

// Simple README download helper
function downloadReadme(){
  const content = `# Learnify\n\nThis is a portfolio-ready front-end learning platform built for GitHub Pages. Files: index.html, style.css, script.js\n\nDeploy: push to repo and enable GitHub Pages.`;
  const a = document.createElement('a');
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
  a.download = 'README.txt';
  a.click();
}

// Init render
renderCourses();
renderDashboard();
renderAchievements();
renderNotifications();

// Small helper to open a course by id globally (used by hero button)
document.getElementById('featured-title').innerText = SAMPLE_COURSES[0].title;
function openCourseById(id){ openCourse(id) }
window.openCourse = openCourse;
window.openLesson = openLesson;
window.openQuiz = openQuiz;
window.startCourse = startCourse;
window.navigate = navigate;
window.generateCertificate = generateCertificate;
window.downloadReadme = downloadReadme;
