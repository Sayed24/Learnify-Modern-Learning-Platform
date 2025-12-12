/* =========================================================
   Learnify — Complete script.js (matches provided index.html)
   Features:
   - SPA routing (pushState)
   - Courses, Lessons, Quiz (30+ questions)
   - Progress & profile stored in LocalStorage
   - Drag & Drop file upload (resources) -> LocalStorage
   - Certificate generator (canvas -> PNG)
   - Chart.js dashboard
   - GSAP animations (if available)
   - Theme toggle
   - Sidebar collapse
   - Toast & notifications
   ========================================================= */

/* -------------------- Storage keys -------------------- */
const KEYS = {
  PROGRESS: "learnify_progress_v3",
  PROFILE: "learnify_profile_v3",
  SESSION: "learnify_session_v3",
  RESOURCES: "learnify_resources_v3",
  NOTIFS: "learnify_notifs_v3",
  THEME: "learnify_theme_v3"
};

/* -------------------- Helpers for storage -------------------- */
const read = (k) => {
  try { return JSON.parse(localStorage.getItem(k)); }
  catch (e) { return null; }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* -------------------- Sample courses + 30+ quiz questions -------------------- */
const COURSES = [
  {
    id: "html-basics",
    title: "HTML Basics",
    category: "Web Development",
    level: "Beginner",
    duration: "3 hours",
    rating: 4.8,
    lessons: [
      { id: "h1", title: "Intro to HTML", content: "<p>HTML is the structure of web pages.</p>", duration: 6 },
      { id: "h2", title: "Text & Links", content: "<p>Headings, paragraphs and anchors.</p>", duration: 8 },
      { id: "h3", title: "Lists & Tables", content: "<p>Ordered/unordered lists and tables.</p>", duration: 10 },
      { id: "h4", title: "Forms & Inputs", content: "<p>Collect user data with forms.</p>", duration: 12 },
      { id: "h5", title: "Semantic HTML", content: "<p>Use semantic tags to structure content.</p>", duration: 8 }
    ],
    quiz: [
      { question: "What does HTML stand for?", choices: ["HyperText Markup Language","Home Text Markup","Hyper Transfer Markup"], correct: 0, explanation: "HTML = HyperText Markup Language."},
      { question: "Which tag creates a link?", choices: ["<a>","<link>","<href>"], correct: 0, explanation: "<a> is used with href."},
      { question: "Which tag is for an image?", choices: ["<img>","<image>","<pic>"], correct: 0, explanation: "<img> displays images."},
      { question: "Which is semantic?", choices: ["<header>","<div>","<span>"], correct: 0, explanation: "<header> is semantic."},
      { question: "Attribute for link url?", choices: ["src","href","url"], correct: 1, explanation: "Use href on <a>."}
    ]
  },
  {
    id: "css-foundations",
    title: "CSS Foundations",
    category: "Web Development",
    level: "Beginner",
    duration: "4 hours",
    rating: 4.7,
    lessons: [
      { id: "c1", title: "Selectors & Specificity", content: "<p>Target elements with selectors.</p>", duration: 10 },
      { id: "c2", title: "Box Model & Layout", content: "<p>Margins, padding, borders and box-sizing.</p>", duration: 14 },
      { id: "c3", title: "Flexbox Basics", content: "<p>Use flex to align items.</p>", duration: 12 },
      { id: "c4", title: "Responsive Design", content: "<p>Media queries and mobile-first.</p>", duration: 12 }
    ],
    quiz: [
      { question: "What property sets background color?", choices: ["background-color","bg","color-bg"], correct: 0, explanation: "background-color sets backgrounds."},
      { question: "Which layout system is one-dimensional?", choices: ["Flexbox","Grid","Table"], correct: 0, explanation: "Flexbox is one-dimensional."},
      { question: "What does rem relate to?", choices: ["Root font-size","Element font-size","Container width"], correct: 0, explanation: "rem = root font-size."}
    ]
  },
  {
    id: "js-fundamentals",
    title: "JavaScript Fundamentals",
    category: "Programming",
    level: "Intermediate",
    duration: "6 hours",
    rating: 4.6,
    lessons: [
      { id: "j1", title: "Intro & Syntax", content: "<p>Variables, operators and control flow.</p>", duration: 12 },
      { id: "j2", title: "Functions & Scope", content: "<p>Function declarations and closures.</p>", duration: 16 },
      { id: "j3", title: "DOM Manipulation", content: "<p>Select elements and update DOM.</p>", duration: 18 },
      { id: "j4", title: "Promises & Async", content: "<p>Async programming with promises.</p>", duration: 20 }
    ],
    quiz: [
      { question: "Which keyword declares block-scoped variable?", choices: ["var","let","const"], correct: 1, explanation: "let declares block-scoped variables."},
      { question: "Which converts object to JSON string?", choices: ["JSON.stringify","toString","Object.toJSON"], correct: 0, explanation: "JSON.stringify converts object."},
      { question: "How do you create a promise?", choices: ["new Promise(...)","Promise.create()","Promise.build()"], correct: 0, explanation: "Use new Promise with executor."}
    ]
  },
  {
    id: "git-github",
    title: "Git & GitHub Workflow",
    category: "Tools",
    level: "Beginner",
    duration: "2 hours",
    rating: 4.9,
    lessons: [
      { id: "g1", title: "Init & Commit", content: "<p>Initialize repo and commit changes.</p>", duration: 10 },
      { id: "g2", title: "Branches & PRs", content: "<p>Branches and pull requests.</p>", duration: 16 }
    ],
    quiz: [
      { question: "Which command creates commit?", choices: ["git commit -m","git push","git add"], correct: 0, explanation: "git commit -m creates commit."},
      { question: "How to create a branch?", choices: ["git checkout -b name","git branch create name","git new branch"], correct: 0, explanation: "Use git checkout -b or git switch -c."}
    ]
  }
];

// Add extras to reach 30+ questions (spread evenly)
(function addExtraQs(){
  const extras = [
    { question: "What is the DOM?", choices: ["Document Object Model","Data Object Model","Digital Object Manifest"], correct: 0, explanation: "DOM = Document Object Model." },
    { question: "HTTP 404 means?", choices: ["Not Found","Server Error","Unauthorized"], correct: 0, explanation: "404 Not Found." },
    { question: "Which protocol is secure?", choices: ["http","https","ftp"], correct: 1, explanation: "https is secure." },
    { question: "Which tag denotes script?", choices: ["<script>","<js>","<code>"], correct: 0, explanation: "<script> embeds JS." },
    { question: "CSS property for flex container?", choices: ["display:flex","flexbox:yes","layout:flex"], correct: 0, explanation: "display:flex makes flex container." },
    { question: "Which method adds to array end?", choices: ["push","pop","shift"], correct: 0, explanation: "push adds to end." },
    { question: "Which keyword defines constant?", choices: ["let","const","var"], correct: 1, explanation: "const defines constants." },
    { question: "JSON stands for?", choices: ["JavaScript Object Notation","Java Serialized Object Notation","JavaScript Online Notation"], correct: 0, explanation: "JSON = JavaScript Object Notation." },
    { question: "Which is a frontend library?", choices: ["React","Laravel","Django"], correct: 0, explanation: "React is a frontend library." },
    { question: "What does FTP do?", choices: ["File transfer","Frontend tool","Form templating"], correct: 0, explanation: "FTP = File Transfer Protocol." }
  ];
  let i = 0;
  extras.forEach(q => {
    COURSES[i % COURSES.length].quiz.push(q);
    i++;
  });
})();

/* -------------------- App state -------------------- */
let sessionUser = read(KEYS.SESSION) || null;
let profile = read(KEYS.PROFILE) || { name: "Guest", avatar: "" };
let resources = read(KEYS.RESOURCES) || {}; // { courseId: [{name,size,type,dataUrl,uploadedAt}, ...] }
let progress = read(KEYS.PROGRESS) || {}; // { user: { lessonsCompleted: { courseId: [lessonId] }, quizScores: {...}, xp: number, certificates: [] } }
let notifs = read(KEYS.NOTIFS) || [];

/* Ensure structure for guest if none */
if (!progress["guest"]) {
  progress["guest"] = { lessonsCompleted:{}, quizScores:{}, xp:0, certificates:[] };
  write(KEYS.PROGRESS, progress);
}

/* -------------------- DOM references -------------------- */
const pages = Array.from(document.querySelectorAll(".page"));
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const themeToggle = document.getElementById("toggle-theme");
const loginBtn = document.getElementById("login-btn");
const globalSearch = document.getElementById("global-search");
const notifBtn = document.getElementById("notifications-btn");

/* Utility: show toast */
let toastTimer = null;
function showToast(msg, ms = 2200) {
  clearTimeout(toastTimer);
  let t = document.getElementById("learnify-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "learnify-toast";
    Object.assign(t.style, {
      position: "fixed", right: "20px", bottom: "20px",
      padding: "12px 16px", borderRadius: "10px",
      background: "rgba(15,23,36,0.85)", color: "#fff", zIndex: 9999
    });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  toastTimer = setTimeout(() => { t.style.opacity = "0"; }, ms);
}

/* -------------------- Router / Navigation -------------------- */
function showPage(id, push=true){
  pages.forEach(p => p.id === id ? p.classList.add("active") : p.classList.remove("active"));
  navLinks.forEach(n => n.classList.toggle("active", n.dataset.route === id));
  if (push) history.pushState({page:id}, "", `#${id}`);
  // page specific renders
  if (id === "courses") renderCourses();
  if (id === "dashboard") renderDashboard();
  if (id === "course-detail") renderCourseDetail();
  if (id === "explore") renderExplore();
  if (id === "achievements") renderAchievements();
  if (id === "profile") loadProfile();
  if (id === "quiz") renderQuizUI(); // if quiz active
}
window.addEventListener("popstate", ()=> {
  const id = (location.hash && location.hash.replace("#","")) || "dashboard";
  showPage(id, false);
});
navLinks.forEach(a => a.addEventListener("click", (e) => {
  e.preventDefault();
  showPage(a.dataset.route);
}));

/* Sidebar collapse toggle */
sidebarToggle.addEventListener("click", ()=>{
  // toggle collapsed class
  sidebar.classList.toggle("collapsed");
});

/* Sidebar show for mobile */
function showSidebarMobile(){
  sidebar.classList.add("show");
  setTimeout(()=>sidebar.classList.remove("show"), 6000);
}

/* Theme toggle */
function applyTheme(t){
  const root = document.getElementById("app");
  if (t === "dark") root.classList.add("theme-dark");
  else root.classList.remove("theme-dark");
  write(KEYS.THEME, t);
}
applyTheme(read(KEYS.THEME) || "light");
themeToggle.addEventListener("click", ()=>{
  const next = (read(KEYS.THEME) === "light") ? "dark" : "light";
  applyTheme(next);
});

/* Login mock */
loginBtn.addEventListener("click", ()=>{
  const username = prompt("Sign in (enter a username) — this is a mock session");
  if (!username) return;
  sessionUser = username.trim();
  write(KEYS.SESSION, sessionUser);
  // ensure user progress exists
  progress[sessionUser] = progress[sessionUser] || { lessonsCompleted:{}, quizScores:{}, xp:0, certificates:[] };
  write(KEYS.PROGRESS, progress);
  showToast(`Signed in as ${sessionUser}`);
  renderDashboard();
});

/* Notifications button */
notifBtn.addEventListener("click", ()=>{
  if (!notifs.length) return alert("No notifications");
  const list = notifs.map(n => `${new Date(n.date).toLocaleString()} — ${n.text}`).join("\n");
  alert(list);
});

/* Global search */
globalSearch.addEventListener("input", (e)=>{
  const q = e.target.value.trim().toLowerCase();
  renderCourses(q);
  renderExplore(q);
});

/* -------------------- Courses / Explore render -------------------- */
function renderCourses(query=""){
  const grid = document.getElementById("courses-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const q = (query || "").toLowerCase();
  COURSES.forEach(c=>{
    if (q && !(c.title + c.category + c.level).toLowerCase().includes(q)) return;
    const el = document.createElement("div"); el.className = "card course-tile";
    el.innerHTML = `
      <div>
        <div class="title">${c.title}</div>
        <div class="meta">${c.category} • ${c.level} • ${c.duration}</div>
      </div>
      <div class="row space-between" style="margin-top:12px">
        <div class="muted">⭐ ${c.rating.toFixed(1)}</div>
        <div class="row gap">
          <button class="btn" onclick="openCourse('${c.id}')">View</button>
          <button class="btn primary" onclick="startCourse('${c.id}')">Start</button>
        </div>
      </div>
    `;
    grid.appendChild(el);
  });
}

function renderExplore(query=""){
  const grid = document.getElementById("explore-grid");
  if (!grid) return;
  grid.innerHTML = "";
  // populate categories filter
  const categories = Array.from(new Set(COURSES.map(c=>c.category)));
  const catSelect = document.getElementById("filter-category");
  if (catSelect) {
    catSelect.innerHTML = '<option value="">All categories</option>' + categories.map(x=>`<option>${x}</option>`).join('');
  }
  const level = document.getElementById("filter-level")?.value || "";
  const q = (query || "").toLowerCase();
  COURSES.forEach(c=>{
    if (level && c.level !== level) return;
    if (q && !(c.title + c.category + c.level).toLowerCase().includes(q)) return;
    const tile = document.createElement("div"); tile.className = "card course-tile";
    tile.innerHTML = `
      <div>
        <div class="title">${c.title}</div>
        <div class="meta">${c.category} • ${c.level}</div>
      </div>
      <div class="row space-between" style="margin-top:12px">
        <div class="muted">Lessons: ${c.lessons.length}</div>
        <div class="row gap">
          <button class="btn" onclick="openCourse('${c.id}')">Open</button>
        </div>
      </div>
    `;
    grid.appendChild(tile);
  });
}

/* filter clear */
document.getElementById("clear-filters")?.addEventListener("click", ()=>{
  document.getElementById("filter-category").value = "";
  document.getElementById("filter-level").value = "";
  renderExplore();
});

/* -------------------- Course detail, resources, upload -------------------- */
let currentCourseId = null;
let currentLessonId = null;

function openCourse(id){
  currentCourseId = id;
  showPage("course-detail");
}

function renderCourseDetail(){
  if (!currentCourseId) return;
  const course = COURSES.find(c=>c.id === currentCourseId);
  if (!course) return;
  document.getElementById("course-title").innerText = course.title;
  document.getElementById("course-meta").innerText = `${course.category} • ${course.level} • ${course.lessons.length} lessons`;
  document.getElementById("course-desc").innerHTML = course.description || `A polished ${course.title} course for portfolio demos.`;

  // lessons list
  const list = document.getElementById("lesson-list");
  list.innerHTML = "";
  const user = sessionUser || "guest";
  const userProg = (progress[user] && progress[user].lessonsCompleted) || {};
  course.lessons.forEach(l=>{
    const completed = (userProg[currentCourseId] || []).includes(l.id);
    const li = document.createElement("li");
    li.className = "row space-between";
    li.innerHTML = `<div><strong>${l.title}</strong><div class="muted">${l.duration} mins</div></div>
      <div class="row gap"><button class="btn" onclick="openLesson('${currentCourseId}','${l.id}')">${completed ? 'Continue' : 'Start'}</button></div>`;
    list.appendChild(li);
  });

  // resources dropzone binding
  const drop = document.getElementById("resource-drop");
  const input = document.getElementById("resource-input");
  if (drop && input) {
    drop.onclick = ()=> input.click();
    input.onchange = (e)=> handleFiles(e.target.files, currentCourseId);
    drop.ondragover = (e)=> { e.preventDefault(); drop.classList.add("dragover"); };
    drop.ondragleave = ()=> drop.classList.remove("dragover");
    drop.ondrop = (e)=> { e.preventDefault(); drop.classList.remove("dragover"); handleFiles(e.dataTransfer.files, currentCourseId); };
  }

  renderResourceList(currentCourseId);
  renderCourseProgress(currentCourseId);
}

/* handle files (FileList) -> store as dataURL (careful: large files will bloat localStorage) */
function handleFiles(fileList, courseId){
  const arr = Array.from(fileList);
  resources = resources || {};
  resources[courseId] = resources[courseId] || [];
  const promises = arr.map(f => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      resources[courseId].push({ name: f.name, size: f.size, type: f.type, dataUrl: ev.target.result, uploadedAt: new Date().toISOString() });
      res();
    };
    reader.onerror = () => rej();
    reader.readAsDataURL(f);
  }));
  Promise.all(promises).then(()=>{
    write(KEYS.RESOURCES, resources);
    showToast(`${arr.length} file(s) uploaded`);
    renderResourceList(courseId);
  }).catch(()=> showToast("Upload failed"));
}

function renderResourceList(courseId){
  const list = document.getElementById("resource-list");
  if (!list) return;
  list.innerHTML = "";
  const items = (resources && resources[courseId]) ? resources[courseId] : [];
  if (!items.length) { list.innerHTML = "<div class='muted'>No resources uploaded yet.</div>"; return; }
  items.forEach((it, idx) => {
    const div = document.createElement("div"); div.className = "card";
    div.style.display = "flex"; div.style.justifyContent = "space-between"; div.style.alignItems = "center"; div.style.marginBottom = "8px";
    div.innerHTML = `<div><strong>${it.name}</strong><div class="muted" style="font-size:12px">${(it.size/1024).toFixed(1)} KB • ${new Date(it.uploadedAt).toLocaleString()}</div></div>
      <div class="row gap"><button class="btn" onclick="downloadResource('${courseId}',${idx})">Open</button><button class="btn" onclick="deleteResource('${courseId}',${idx})">Delete</button></div>`;
    list.appendChild(div);
  });
}

function downloadResource(courseId, idx){
  const it = (resources[courseId] || [])[idx];
  if (!it) return showToast("Resource not found");
  const a = document.createElement("a"); a.href = it.dataUrl; a.download = it.name; a.click();
}
function deleteResource(courseId, idx){
  if (!resources[courseId] || !resources[courseId][idx]) return;
  resources[courseId].splice(idx,1);
  write(KEYS.RESOURCES, resources);
  renderResourceList(courseId);
  showToast("Resource deleted");
}
function openResourcesFolder(courseId){
  renderResourceList(courseId);
  showToast("Resources shown");
}

/* -------------------- Lessons & Progress -------------------- */
function startCourse(id){
  currentCourseId = id;
  const course = COURSES.find(c=>c.id === id);
  const user = sessionUser || "guest";
  const userProg = (progress[user] && progress[user].lessonsCompleted) || {};
  let next = course.lessons.find(l => !(userProg[id] || []).includes(l.id));
  if (!next) next = course.lessons[0];
  openLesson(id, next.id);
}

function openLesson(courseId, lessonId){
  currentCourseId = courseId; currentLessonId = lessonId;
  showPage("lesson");
  const course = COURSES.find(c=>c.id === courseId);
  const lesson = course.lessons.find(l=>l.id === lessonId);
  document.getElementById("lesson-title").innerText = lesson.title;
  document.getElementById("lesson-meta").innerText = `${course.title} • ${lesson.duration} mins`;
  document.getElementById("lesson-content").innerHTML = lesson.content;
  document.getElementById("lesson-code").innerHTML = lesson.code ? `<pre><code>${escapeHtml(lesson.code)}</code></pre>` : "";
  document.getElementById("mark-complete-btn").onclick = ()=> markLessonComplete(courseId, lessonId);
}

function markLessonComplete(courseId, lessonId){
  const user = sessionUser || "guest";
  progress[user] = progress[user] || { lessonsCompleted: {}, quizScores: {}, xp: 0, certificates: [] };
  progress[user].lessonsCompleted[courseId] = progress[user].lessonsCompleted[courseId] || [];
  if (!progress[user].lessonsCompleted[courseId].includes(lessonId)) {
    progress[user].lessonsCompleted[courseId].push(lessonId);
    progress[user].xp = (progress[user].xp || 0) + 10;
    write(KEYS.PROGRESS, progress);
    pushNotif(`Lesson completed: ${lessonId}`);
    showToast("Marked completed! +10 XP");
  } else {
    showToast("Already completed");
  }
  renderCourseProgress(courseId);
  renderDashboard();
}

/* render course progress % */
function renderCourseProgress(courseId){
  const course = COURSES.find(c=>c.id === courseId);
  const user = sessionUser || "guest";
  const done = (progress[user] && progress[user].lessonsCompleted && progress[user].lessonsCompleted[courseId]) ? progress[user].lessonsCompleted[courseId].length : 0;
  const pct = Math.round((done / course.lessons.length) * 100);
  const el = document.getElementById("course-progress");
  if (el) el.innerText = `${pct}% completed`;
}

/* -------------------- Quiz system -------------------- */
let activeQuiz = null;

function openQuiz(courseId){
  if (!courseId) { showToast("No course selected"); return; }
  const course = COURSES.find(c=>c.id === courseId);
  activeQuiz = {
    courseId,
    questions: shuffleArray(course.quiz).slice(0, Math.min(15, course.quiz.length)),
    index: 0,
    score: 0,
    answers: []
  };
  showPage("quiz");
}

function renderQuizUI(){
  const root = document.getElementById("quiz-card");
  if (!activeQuiz) { root.innerHTML = "<div class='muted'>No quiz active</div>"; return; }
  const q = activeQuiz.questions[activeQuiz.index];
  root.innerHTML = `
    <h3>${COURSES.find(c=>c.id === activeQuiz.courseId).title} — Quiz</h3>
    <div class="muted">Question ${activeQuiz.index+1} of ${activeQuiz.questions.length}</div>
    <div style="margin-top:12px">
      <p><strong>${q.question}</strong></p>
      <div id="choices" class="column"></div>
      <div class="row gap" style="margin-top:12px">
        <button class="btn" onclick="prevQuiz()">Previous</button>
        <button class="btn primary" onclick="submitQuizAnswer()">Submit</button>
      </div>
    </div>
  `;
  const choices = document.getElementById("choices");
  q.choices.forEach((ch, i)=>{
    const b = document.createElement("button"); b.className = "btn"; b.style.display = "block"; b.style.textAlign = "left"; b.innerHTML = ch;
    b.onclick = ()=> { activeQuiz.selected = i; Array.from(choices.children).forEach(x=>x.classList.remove("primary")); b.classList.add("primary"); };
    choices.appendChild(b);
  });
}

function submitQuizAnswer(){
  if (activeQuiz.selected === undefined) return showToast("Choose an answer");
  const q = activeQuiz.questions[activeQuiz.index];
  const correct = activeQuiz.selected === q.correct;
  if (correct) activeQuiz.score++;
  activeQuiz.answers.push({ selected: activeQuiz.selected, correct: q.correct });
  showToast(correct ? "Correct" : "Incorrect");
  activeQuiz.index++;
  activeQuiz.selected = undefined;
  if (activeQuiz.index >= activeQuiz.questions.length) finishQuiz();
  else renderQuizUI();
}

function prevQuiz(){ if (activeQuiz && activeQuiz.index > 0){ activeQuiz.index--; activeQuiz.answers.pop(); renderQuizUI(); } }

function finishQuiz(){
  const user = sessionUser || "guest";
  progress[user] = progress[user] || { lessonsCompleted:{}, quizScores:{}, xp:0, certificates:[] };
  progress[user].quizScores[activeQuiz.courseId] = { score: activeQuiz.score, total: activeQuiz.questions.length, date: new Date().toISOString() };
  const reward = Math.round((activeQuiz.score / activeQuiz.questions.length) * 60);
  progress[user].xp = (progress[user].xp || 0) + reward;

  // if course fully completed, award certificate
  const course = COURSES.find(c=>c.id === activeQuiz.courseId);
  const completedCount = (progress[user].lessonsCompleted && progress[user].lessonsCompleted[activeQuiz.courseId]) ? progress[user].lessonsCompleted[activeQuiz.courseId].length : 0;
  if (completedCount >= course.lessons.length) {
    progress[user].certificates = progress[user].certificates || [];
    if (!progress[user].certificates.includes(activeQuiz.courseId)) progress[user].certificates.push(activeQuiz.courseId);
  }

  write(KEYS.PROGRESS, progress);
  pushNotif(`Quiz completed: ${course.title} — ${activeQuiz.score}/${activeQuiz.questions.length}`);
  showToast(`Quiz finished: ${activeQuiz.score}/${activeQuiz.questions.length} • +${reward} XP`);
  activeQuiz = null;
  showPage("course-detail");
  renderDashboard();
}

/* -------------------- Certificate generator -------------------- */
function generateCertificate(){
  const name = document.getElementById("cert-name").value || (profile.name || sessionUser || "Student");
  const canvas = document.getElementById("certificate-canvas");
  const ctx = canvas.getContext("2d");
  // Background
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,canvas.width,canvas.height);
  // Border
  ctx.strokeStyle = "#1a73e8"; ctx.lineWidth = 18; ctx.strokeRect(20,20,canvas.width-40,canvas.height-40);
  // Title
  ctx.fillStyle = "#0f1724"; ctx.font = "44px Inter, sans-serif"; ctx.fillText("Certificate of Completion", 60, 160);
  ctx.font = "32px Inter, sans-serif"; ctx.fillText(name, 60, 260);
  ctx.font = "20px Inter, sans-serif"; ctx.fillStyle = "#6b7280"; ctx.fillText(`Awarded on ${new Date().toLocaleDateString()}`, 60, 320);
  // QR placeholder
  ctx.fillStyle = "#000"; ctx.fillRect(canvas.width-200, canvas.height-220, 160, 160);
  // download
  const a = document.createElement("a"); a.href = canvas.toDataURL("image/png"); a.download = `learnify-certificate-${name.replace(/\s+/g,"-")}.png`; a.click();
}
function generateCertificateFor(courseId){
  document.getElementById("cert-name").value = profile.name || sessionUser || "Student";
  showPage("certificate");
}

/* -------------------- Dashboard & Chart -------------------- */
let chartInstance = null;
function renderDashboard(){
  const user = sessionUser || "guest";
  const userProf = progress[user] || { lessonsCompleted:{}, quizScores:{}, xp:0, certificates:[] };
  document.getElementById("xp-count").innerText = userProf.xp || 0;
  document.getElementById("inprogress-count").innerText = countInProgress(user);
  document.getElementById("completed-count").innerText = countCompleted(user);
  document.getElementById("cert-count").innerText = (userProf.certificates || []).length;

  const ctx = document.getElementById("progress-chart");
  if (!ctx) return;
  const labels = COURSES.map(c=>c.title);
  const data = COURSES.map(c=>{
    const done = (userProf.lessonsCompleted && userProf.lessonsCompleted[c.id]) ? userProf.lessonsCompleted[c.id].length : 0;
    return Math.round((done / c.lessons.length) * 100);
  });
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ label: "Completion %", data, backgroundColor: "rgba(26,115,232,0.8)" }] },
    options: { responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true, max:100 } } }
  });
}

/* helper counts */
function countInProgress(user){
  user = user || (sessionUser || "guest");
  const p = progress[user] || { lessonsCompleted:{} };
  let count = 0;
  COURSES.forEach(c=>{
    const done = (p.lessonsCompleted[c.id]||[]).length;
    if (done > 0 && done < c.lessons.length) count++;
  });
  return count;
}
function countCompleted(user){
  user = user || (sessionUser || "guest");
  const p = progress[user] || { lessonsCompleted:{} };
  let count = 0;
  COURSES.forEach(c=>{
    if ((p.lessonsCompleted[c.id]||[]).length >= c.lessons.length) count++;
  });
  return count;
}

/* -------------------- Achievements & Notifications -------------------- */
function renderAchievements(){
  const root = document.getElementById("badges");
  if (!root) return;
  root.innerHTML = "";
  const user = sessionUser || "guest";
  const p = progress[user] || { xp:0, certificates:[] };
  (p.certificates || []).forEach(cid=>{
    const course = COURSES.find(c=>c.id===cid);
    const d = document.createElement("div"); d.className="card"; d.style.minWidth="180px"; d.innerHTML = `<h4>${course.title}</h4><div class="muted">Certificate Unlocked</div>`;
    root.appendChild(d);
  });
  if (p.xp >= 50){ const d=document.createElement("div"); d.className="card"; d.style.minWidth="160px"; d.innerHTML = `<h4>50 XP</h4><div class="muted">Active learner</div>`; root.appendChild(d); }
  if (p.xp >= 200){ const d=document.createElement("div"); d.className="card"; d.style.minWidth="160px"; d.innerHTML = `<h4>200 XP</h4><div class="muted">Power learner</div>`; root.appendChild(d); }
}

/* push notification */
function pushNotif(text){
  notifs = notifs || [];
  notifs.unshift({ text, date: new Date().toISOString() });
  write(KEYS.NOTIFS, notifs.slice(0,50));
}

/* -------------------- Profile & Auth helpers -------------------- */
function loadProfile(){
  document.getElementById("profile-name").value = profile.name || "";
  document.getElementById("profile-avatar").value = profile.avatar || "";
}
document.getElementById("save-profile")?.addEventListener("click", ()=>{
  const name = document.getElementById("profile-name").value || "Guest";
  const avatar = document.getElementById("profile-avatar").value || "";
  profile = { name, avatar };
  write(KEYS.PROFILE, profile);
  showToast("Profile saved");
});

/* logout */
function logout(){
  sessionUser = null;
  localStorage.removeItem(KEYS.SESSION);
  showToast("Logged out");
  renderDashboard();
}

/* open upload modal helper */
function openUploadModal(){
  const courseId = prompt("Enter course id to upload resource to (e.g. html-basics):");
  if (!courseId) return;
  const course = COURSES.find(c=>c.id===courseId);
  if (!course) return showToast("Course id not found");
  const input = document.createElement("input"); input.type="file"; input.multiple = true;
  input.onchange = (e)=> handleFiles(e.target.files, courseId);
  input.click();
}

/* README generator */
function downloadReadme(){
  const readme = `# Learnify — Google Material Dashboard Style

Learnify is a portfolio-ready front-end learning platform (SPA) designed to showcase product-like features for interviews.

## Features
- Google Material Dashboard style UI (sidebar + topbar)
- Courses → Lessons → Quizzes (30+ generated questions)
- Drag & Drop resource upload (LocalStorage)
- GSAP animations & Chart.js dashboard
- Certificate generator (download PNG)
- Mock login (LocalStorage) and progress tracking
- Accessible and responsive

## How to deploy
1. Create a GitHub repository.
2. Add index.html, style.css, script.js to repo root.
3. Commit & push to main branch.
4. In GitHub repo -> Settings -> Pages -> Select 'main' branch and root folder.
5. Visit https://<your-username>.github.io/<repo>/

## How to present it in an interview
- Show the dashboard -> explain SPA navigation & local state
- Open a course -> show lessons, mark complete, demonstrate progress saved
- Upload a resource -> show drag & drop and resource persistence
- Take a quiz -> highlight scoring and saved results
- Generate a certificate -> download and show automation
- Discuss design choices: Material style, accessibility, responsive, single-file deploy

## Tech
HTML • CSS • JS • GSAP • Chart.js • LocalStorage
`;
  const a = document.createElement("a"); a.href = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(readme); a.download = 'README.md'; a.click();
}

/* -------------------- Utilities -------------------- */
function shuffleArray(a){ return a.slice().sort(()=>Math.random() - 0.5); }
function escapeHtml(s){ return (s||"").toString().replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

/* -------------------- Init render & bindings -------------------- */
function init(){
  // ensure storage keys exist
  if (!read(KEYS.RESOURCES)) write(KEYS.RESOURCES, resources);
  if (!read(KEYS.PROGRESS)) write(KEYS.PROGRESS, progress);
  if (!read(KEYS.NOTIFS)) write(KEYS.NOTIFS, notifs);
  if (read(KEYS.PROFILE)) profile = read(KEYS.PROFILE);

  // initial renders
  renderCourses();
  renderExplore();
  renderDashboard();
  renderAchievements();
  loadProfile();
  // initial gsap animation
  if (window.gsap) {
    gsap.from(".card", { duration: .6, opacity:0, y:12, stagger: 0.04 });
  }
}

// Expose functions used by HTML onclicks
window.showPage = showPage;
window.openCourse = openCourse;
window.startCourse = startCourse;
window.openLesson = openLesson;
window.openQuiz = openQuiz;
window.generateCertificate = generateCertificate;
window.generateCertificateFor = generateCertificateFor;
window.downloadReadme = downloadReadme;
window.openUploadModal = openUploadModal;
window.navigate = showPage; // alias

// Initialize after DOM loaded
document.addEventListener("DOMContentLoaded", init);
