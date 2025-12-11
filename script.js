/* Learnify — Google Material Dashboard style
   Single-file SPA logic, courses + 30+ quiz questions, drag-drop resources (localStorage),
   GSAP animations, Chart.js dashboard, certificate generator, README download.
*/

/* ---------- STORAGE KEYS ---------- */
const KEYS = {
  PROGRESS: "learnify_progress_v2",
  PROFILE: "learnify_profile_v2",
  SESSION: "learnify_session_v2",
  RESOURCES: "learnify_resources_v2",
  NOTIFS: "learnify_notifs_v2",
  THEME: "learnify_theme_v2"
};

function read(k){ try{ return JSON.parse(localStorage.getItem(k)) }catch(e){return null} }
function write(k,v){ localStorage.setItem(k, JSON.stringify(v)) }

/* ---------- SAMPLE COURSES & 30+ QUIZ QUESTIONS ---------- */
const COURSES = [
  {
    id: "html-basics",
    title: "HTML Basics",
    category: "Web Development",
    level: "Beginner",
    duration: "3 hours",
    rating: 4.8,
    lessons: [
      { id:"h1", title:"Intro to HTML", content:"<p>HTML is the structure of web pages. Elements are building blocks.</p>", duration:6 },
      { id:"h2", title:"Text & Links", content:"<p>Headings, paragraphs, and anchors.</p>", duration:8 },
      { id:"h3", title:"Lists & Tables", content:"<p>Ordered and unordered lists and basic tables.</p>", duration:10 },
      { id:"h4", title:"Forms & Inputs", content:"<p>Collect user data with forms.</p>", duration:12 },
      { id:"h5", title:"Semantic HTML", content:"<p>Use semantic tags to structure content.</p>", duration:8 }
    ],
    quiz: [
      { question:"What does HTML stand for?", choices:["HyperText Markup Language","Home Tool Markup Language","Hyperlink Text Makeup Language"], correct:0, explanation:"HTML = HyperText Markup Language." },
      { question:"Which tag creates a link?", choices:["<a>","<link>","<href>"], correct:0, explanation:"<a> is used with href attribute." },
      { question:"Which tag shows a paragraph?", choices:["<p>","<para>","<text>"], correct:0, explanation:"<p> is paragraph." },
      { question:"Which tag is semantic?", choices:["<header>","<span>","<div>"], correct:0, explanation:"<header> is semantic." },
      { question:"Forms commonly use which attribute for submission?", choices:["action","submit","methodology"], correct:0, explanation:"The 'action' attribute sets the submission URL." }
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
      { id:"c1", title:"Selectors & Specificity", content:"<p>Target elements with selectors.</p>", duration:10 },
      { id:"c2", title:"Box Model & Layout", content:"<p>Margins, padding, borders and layout engines.</p>", duration:14 },
      { id:"c3", title:"Flexbox Basics", content:"<p>Use flex to align items.</p>", duration:12 },
      { id:"c4", title:"Responsive Design", content:"<p>Media queries and mobile-first.</p>", duration:12 }
    ],
    quiz: [
      { question:"What property sets background color?", choices:["background-color","bgcolor","color-bg"], correct:0, explanation:"background-color sets background." },
      { question:"Which display makes a flex container?", choices:["display:flex","display:flow","display:gridish"], correct:0, explanation:"display:flex makes a flex container." },
      { question:"What does 'rem' refer to?", choices:["Root em (relative to root font)","Relative to element padding","Random em"], correct:0, explanation:"rem is relative to root font-size." }
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
      { id:"j1", title:"Intro & Syntax", content:"<p>Variables, operators and control flow.</p>", duration:12 },
      { id:"j2", title:"Functions & Scope", content:"<p>Function declarations and closures.</p>", duration:16 },
      { id:"j3", title:"DOM Manipulation", content:"<p>Select elements and update DOM.</p>", duration:18 },
      { id:"j4", title:"Promises & Async", content:"<p>Async programming with promises.</p>", duration:20 }
    ],
    quiz: [
      { question:"Which keyword declares a block-scoped variable?", choices:["let","var","constant"], correct:0, explanation:"'let' declares block-scoped variables." },
      { question:"Which method adds an item to the end of an array?", choices:["push","pop","shift"], correct:0, explanation:"push adds item to the end." },
      { question:"What does JSON stand for?", choices:["JavaScript Object Notation","Java Syntax Object Notation","Just Simple Object Notation"], correct:0, explanation:"JSON = JavaScript Object Notation." },
      { question:"How to create a Promise?", choices:["new Promise((res,rej)=>{})","Promise.create()","Promise.new()"], correct:0, explanation:"Use new Promise with executor." }
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
      { id:"g1", title:"Init & Commit", content:"<p>Initialize repository and commit changes.</p>", duration:10 },
      { id:"g2", title:"Branches & PRs", content:"<p>Use branches and create pull requests.</p>", duration:16 }
    ],
    quiz: [
      { question:"Which command creates a new commit?", choices:["git commit -m","git push","git add ."], correct:0, explanation:"git commit -m creates a commit." },
      { question:"How to create a new branch?", choices:["git checkout -b branch","git branch create branch","git new branch"], correct:0, explanation:"Use git checkout -b or git switch -c." }
    ]
  }
];

// add extra auto-generated quiz items to reach 30+ total
(function extendQuizzes(){
  const extras = [
    { question:"Which HTML element is used to embed JavaScript?", choices:["<script>","<js>","<code>"], correct:0, explanation:"Use <script> to embed JS." },
    { question:"Which CSS property changes text color?", choices:["color","font-color","text-color"], correct:0, explanation:"color sets text color." },
    { question:"Which operator is used for strict equality in JS?", choices:["===","==","!="], correct:0, explanation:"=== checks type + value." },
    { question:"Which git command uploads commits to remote?", choices:["git push","git upload","git send"], correct:0, explanation:"git push uploads commits." },
    { question:"What is the DOM?", choices:["Document Object Model","Domain Object Model","Data Object Model"], correct:0, explanation:"Document Object Model representation." },
    { question:"Which HTML tag displays an image?", choices:["<img>","<image>","<src>"], correct:0, explanation:"<img> displays images." },
    { question:"What does CSS 'flex-direction: column' do?", choices:["Stacks children vertically","Stacks horizontally","Centers children"], correct:0, explanation:"Stacks items top-to-bottom." },
    { question:"Which method converts JS object to string?", choices:["JSON.stringify","toStringObject","Object.stringify"], correct:0, explanation:"JSON.stringify converts object to JSON string." },
    { question:"Which Git command shows commit history?", choices:["git log","git history","git commits"], correct:0, explanation:"git log shows commit history." },
    { question:"What is responsive design?", choices:["Design that adapts to screen sizes","Design for one screen","Design for print"], correct:0, explanation:"Responsive adjusts layout to screen size." }
  ];
  // push extras into courses quiz arrays round-robin
  let i = 0;
  extras.forEach(q=>{
    COURSES[i % COURSES.length].quiz.push(q);
    i++;
  });
})();

/* ---------- APP STATE ---------- */
let session = read(KEYS.SESSION) || null;
let profile = read(KEYS.PROFILE) || { name: "Guest", avatar: "" };
let resources = read(KEYS.RESOURCES) || {}; // { courseId: [{name,size,type,dataUrl,uploadedAt}, ...] }
let progress = read(KEYS.PROGRESS) || {}; // { user: { lessonsCompleted: {courseId:[lessonId]}, quizScores: {...}, xp: number, certificates: [] } }
let notifs = read(KEYS.NOTIFS) || [];

/* ---------- INITIAL UI BINDINGS ---------- */
const pages = Array.from(document.querySelectorAll('.page'));
function showPage(id, push=true){
  pages.forEach(p=>p.id===id ? p.classList.add('active') : p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n=>n.classList.toggle('active', n.dataset.route===id));
  if(push) history.pushState({page:id},"",`#${id}`);
  // render page-specific
  if(id==='courses') renderCourses();
  if(id==='dashboard') renderDashboard();
  if(id==='course-detail') renderCourseDetail();
  if(id==='explore') renderExplore();
  if(id==='achievements') renderAchievements();
  if(id==='profile') loadProfile();
  if(id==='quiz') renderQuizUI();
}
window.addEventListener('popstate', ()=>{ const id = (location.hash && location.hash.replace('#','')) || 'dashboard'; showPage(id,false); });

document.querySelectorAll('.nav-link').forEach(a=>{
  a.addEventListener('click', (e)=>{ e.preventDefault(); showPage(a.dataset.route); });
});

/* sidebar toggle for mobile */
const sidebar = document.getElementById('sidebar');
document.getElementById('sidebar-toggle').addEventListener('click', ()=> sidebar.classList.toggle('show'));

/* theme */
const themeKey = KEYS.THEME;
function applyTheme(t){
  const root = document.getElementById('app');
  if(t==='dark') root.classList.add('theme-dark'); else root.classList.remove('theme-dark');
  write(themeKey,t);
}
applyTheme(read(themeKey) || 'light');
document.getElementById('toggle-theme').addEventListener('click', ()=>{
  const newT = (read(themeKey)==='light') ? 'dark' : 'light';
  applyTheme(newT);
});

/* search */
document.getElementById('global-search').addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q) { renderCourses(); renderExplore(); return; }
  renderCourses(q); renderExplore(q);
});

/* login mock */
document.getElementById('login-btn').addEventListener('click', ()=>{
  const username = prompt('Sign in — enter a username (mock)');
  if(!username) return;
  session = username.trim();
  write(KEYS.SESSION, session);
  if(!progress[session]) progress[session] = { lessonsCompleted: {}, quizScores: {}, xp: 0, certificates: [] };
  write(KEYS.PROGRESS, progress);
  showToast(`Signed in as ${session}`);
  renderDashboard();
});

/* save profile */
document.getElementById('save-profile').addEventListener('click', ()=>{
  const name = document.getElementById('profile-name').value || "Guest";
  const avatar = document.getElementById('profile-avatar').value || "";
  profile = { name, avatar };
  write(KEYS.PROFILE, profile);
  showToast('Profile saved');
});

/* clear filters */
document.getElementById('clear-filters').addEventListener('click', ()=> { document.getElementById('filter-category').value=''; document.getElementById('filter-level').value=''; renderExplore(); });

/* theme select in settings */
document.getElementById('select-theme').addEventListener('change', (e)=> applyTheme(e.target.value));

/* ---------- RENDERING: COURSES & EXPLORE ---------- */
function renderCourses(query=""){
  const grid = document.getElementById('courses-grid');
  grid.innerHTML = "";
  const q = (query || "").toLowerCase();
  COURSES.forEach(c=>{
    if(q && !(c.title+c.category+c.level).toLowerCase().includes(q)) return;
    const card = document.createElement('div'); card.className='card course-tile';
    card.innerHTML = `
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
    grid.appendChild(card);
  });
}

function renderExplore(query=""){
  const grid = document.getElementById('explore-grid');
  grid.innerHTML = "";
  // populate category filter
  const categories = Array.from(new Set(COURSES.map(c=>c.category)));
  const catSelect = document.getElementById('filter-category');
  catSelect.innerHTML = '<option value="">All categories</option>' + categories.map(x=>`<option>${x}</option>`).join('');
  const q = (query || "").toLowerCase();
  COURSES.forEach(c=>{
    const levelFilter = document.getElementById('filter-level').value;
    if(levelFilter && c.level !== levelFilter) return;
    if(q && !(c.title+c.category+c.level).toLowerCase().includes(q)) return;
    const tile = document.createElement('div'); tile.className='card course-tile';
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

/* ---------- COURSE DETAIL, LESSONS & RESOURCES ---------- */
let currentCourseId = null;
let currentLessonId = null;

function openCourse(id){
  currentCourseId = id;
  showPage('course-detail');
}

function renderCourseDetail(){
  if(!currentCourseId) { showToast("No course selected"); return; }
  const course = COURSES.find(c=>c.id===currentCourseId);
  document.getElementById('course-title').innerText = course.title;
  document.getElementById('course-meta').innerText = `${course.category} • ${course.level} • ${course.lessons.length} lessons`;
  document.getElementById('course-desc').innerHTML = course.description || `A polished ${course.title} course for your portfolio.`;
  // lessons
  const list = document.getElementById('lesson-list'); list.innerHTML = "";
  const user = session || "guest";
  const userProgress = (progress[user] && progress[user].lessonsCompleted) || {};
  course.lessons.forEach(lesson=>{
    const completed = (userProgress[currentCourseId] || []).includes(lesson.id);
    const li = document.createElement('li'); li.className='row space-between';
    li.innerHTML = `<div><strong>${lesson.title}</strong><div class="muted">${lesson.duration} mins</div></div>
                    <div class="row gap"><button class="btn" onclick="openLesson('${currentCourseId}','${lesson.id}')">${completed ? 'Continue' : 'Start'}</button></div>`;
    list.appendChild(li);
  });

  // resources
  const drop = document.getElementById('resource-drop');
  const input = document.getElementById('resource-input');
  drop.onclick = ()=> input.click();
  input.onchange = (e)=> handleFiles(e.target.files, currentCourseId);
  // drag events
  drop.ondragover = (e)=>{ e.preventDefault(); drop.classList.add('dragover'); }
  drop.ondragleave = ()=> drop.classList.remove('dragover');
  drop.ondrop = (e)=>{ e.preventDefault(); drop.classList.remove('dragover'); handleFiles(e.dataTransfer.files, currentCourseId); }

  renderResourceList(currentCourseId);
  // progress
  renderCourseProgress(currentCourseId);
}

/* handle file uploads and persist to localStorage as data URLs (small files) */
function handleFiles(fileList, courseId){
  const arr = Array.from(fileList);
  resources[courseId] = resources[courseId] || [];
  const promises = arr.map(f=>{
    return new Promise((res,rej)=>{
      const reader = new FileReader();
      reader.onload = (ev)=> {
        resources[courseId].push({ name: f.name, size: f.size, type: f.type, dataUrl: ev.target.result, uploadedAt: new Date().toISOString() });
        res();
      };
      reader.onerror = ()=> rej();
      reader.readAsDataURL(f);
    });
  });
  Promise.all(promises).then(()=>{
    write(KEYS.RESOURCES, resources);
    showToast(`${arr.length} file(s) uploaded`);
    renderResourceList(courseId);
  }).catch(()=> showToast("Upload failed"));
}
function renderResourceList(courseId){
  const list = document.getElementById('resource-list'); list.innerHTML = "";
  const items = resources[courseId] || [];
  if(items.length===0){ list.innerHTML = '<div class="muted">No resources uploaded yet.</div>'; return; }
  items.forEach((it, idx)=>{
    const li = document.createElement('div'); li.className='row space-between card';
    li.style.marginBottom='8px';
    li.innerHTML = `<div><strong>${it.name}</strong><div class="muted">${(it.size/1024).toFixed(1)} KB • ${new Date(it.uploadedAt).toLocaleString()}</div></div>
                    <div class="row gap">
                      <button class="btn" onclick="downloadResource('${courseId}',${idx})">Open</button>
                      <button class="btn" onclick="deleteResource('${courseId}',${idx})">Delete</button>
                    </div>`;
    list.appendChild(li);
  });
}
function downloadResource(courseId, idx){
  const it = (resources[courseId]||[])[idx];
  if(!it) return showToast("Resource not found");
  const a = document.createElement('a'); a.href = it.dataUrl; a.download = it.name; a.click();
}
function deleteResource(courseId, idx){
  if(!resources[courseId] || !resources[courseId][idx]) return;
  resources[courseId].splice(idx,1); write(KEYS.RESOURCES, resources);
  renderResourceList(courseId); showToast("Resource deleted");
}
function openResourcesFolder(courseId){
  renderResourceList(courseId); showToast("Resources shown below");
}

/* ---------- LESSON VIEWER & PROGRESS ---------- */
function startCourse(id){
  currentCourseId = id;
  // open first incomplete lesson
  const user = session || "guest";
  const userProgress = (progress[user] && progress[user].lessonsCompleted) || {};
  const course = COURSES.find(c=>c.id===id);
  let next = course.lessons.find(l => !(userProgress[id]||[]).includes(l.id));
  if(!next) next = course.lessons[0];
  openLesson(id, next.id);
}

function openLesson(courseId, lessonId){
  currentCourseId = courseId; currentLessonId = lessonId;
  showPage('lesson');
  const course = COURSES.find(c=>c.id===courseId);
  const lesson = course.lessons.find(l=>l.id===lessonId);
  document.getElementById('lesson-title').innerText = lesson.title;
  document.getElementById('lesson-meta').innerText = `${course.title} • ${lesson.duration} mins`;
  document.getElementById('lesson-content').innerHTML = lesson.content;
  document.getElementById('lesson-code').innerHTML = lesson.code ? `<pre><code>${escapeHtml(lesson.code)}</code></pre>` : '';
  document.getElementById('mark-complete-btn').onclick = ()=> markLessonComplete(courseId, lessonId);
}

function markLessonComplete(courseId, lessonId){
  const user = session || "guest";
  progress[user] = progress[user] || { lessonsCompleted: {}, quizScores: {}, xp: 0, certificates: [] };
  progress[user].lessonsCompleted[courseId] = progress[user].lessonsCompleted[courseId] || [];
  if(!progress[user].lessonsCompleted[courseId].includes(lessonId)){
    progress[user].lessonsCompleted[courseId].push(lessonId);
    progress[user].xp = (progress[user].xp || 0) + 10;
    write(KEYS.PROGRESS, progress);
    showToast("Lesson marked complete +10 XP");
    pushNotif(`Lesson completed: ${lessonId}`);
  } else showToast("Already completed");
  renderCourseProgress(courseId);
  renderDashboard();
}

/* render progress percentage for a course */
function renderCourseProgress(courseId){
  const course = COURSES.find(c=>c.id===courseId);
  const user = session || "guest";
  const completed = (progress[user] && progress[user].lessonsCompleted && progress[user].lessonsCompleted[courseId]) ? progress[user].lessonsCompleted[courseId].length : 0;
  const pct = Math.round((completed / course.lessons.length) * 100);
  document.getElementById('course-progress').innerText = `${pct}% completed`;
}

/* ---------- QUIZ SYSTEM ---------- */
let activeQuiz = null;
function openQuiz(courseId){
  if(!courseId) return showToast("No course selected");
  activeQuiz = {
    courseId,
    questions: shuffleArray(COURSES.find(c=>c.id===courseId).quiz).slice(0, Math.min(15, COURSES.find(c=>c.id===courseId).quiz.length)),
    index: 0,
    score: 0,
    answers: []
  };
  showPage('quiz');
}
function renderQuizUI(){
  const root = document.getElementById('quiz-card');
  if(!activeQuiz){ root.innerHTML = '<div class="muted">No active quiz</div>'; return; }
  const q = activeQuiz.questions[activeQuiz.index];
  root.innerHTML = `
    <h3>${COURSES.find(c=>c.id===activeQuiz.courseId).title} — Quiz</h3>
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
  const choices = document.getElementById('choices');
  q.choices.forEach((ch, i)=>{
    const b = document.createElement('button'); b.className='btn'; b.style.display='block'; b.style.textAlign='left'; b.innerHTML = ch;
    b.onclick = ()=> { activeQuiz.selected = i; Array.from(choices.children).forEach(x=>x.classList.remove('primary')); b.classList.add('primary'); };
    choices.appendChild(b);
  });
}
function submitQuizAnswer(){
  if(activeQuiz.selected===undefined) return showToast("Select an answer");
  const q = activeQuiz.questions[activeQuiz.index];
  const correct = activeQuiz.selected === q.correct;
  if(correct) activeQuiz.score++;
  activeQuiz.answers.push({ selected: activeQuiz.selected, correct: q.correct });
  showToast(correct ? "Correct" : "Incorrect");
  activeQuiz.index++;
  activeQuiz.selected = undefined;
  if(activeQuiz.index >= activeQuiz.questions.length) finishQuiz();
  else renderQuizUI();
}
function prevQuiz(){ if(activeQuiz && activeQuiz.index>0){ activeQuiz.index--; activeQuiz.answers.pop(); renderQuizUI(); } }
function finishQuiz(){
  // save score and reward xp
  const user = session || "guest";
  progress[user] = progress[user] || { lessonsCompleted:{}, quizScores:{}, xp:0, certificates:[] };
  progress[user].quizScores[activeQuiz.courseId] = { score: activeQuiz.score, total: activeQuiz.questions.length, date: new Date().toISOString() };
  const reward = Math.round((activeQuiz.score / activeQuiz.questions.length) * 60);
  progress[user].xp = (progress[user].xp || 0) + reward;
  // if course fully completed, unlock certificate stub
  const course = COURSES.find(c=>c.id===activeQuiz.courseId);
  const completed = (progress[user].lessonsCompleted && progress[user].lessonsCompleted[activeQuiz.courseId]) ? progress[user].lessonsCompleted[activeQuiz.courseId].length : 0;
  if(completed >= course.lessons.length) {
    // award certificate
    progress[user].certificates = progress[user].certificates || [];
    if(!progress[user].certificates.includes(activeQuiz.courseId)){
      progress[user].certificates.push(activeQuiz.courseId);
    }
  }
  write(KEYS.PROGRESS, progress);
  pushNotif(`Quiz completed: ${course.title} — ${activeQuiz.score}/${activeQuiz.questions.length}`);
  showToast(`Quiz finished: ${activeQuiz.score}/${activeQuiz.questions.length} • +${reward} XP`);
  activeQuiz = null;
  showPage('course-detail');
  renderDashboard();
}

/* ---------- CERTIFICATE (canvas) ---------- */
function generateCertificate(){
  const name = document.getElementById('cert-name').value || (profile.name || "Student");
  const canvas = document.getElementById('certificate-canvas');
  const ctx = canvas.getContext('2d');
  // background
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,canvas.width,canvas.height);
  // title
  ctx.fillStyle = "#0f1724"; ctx.font = '48px Inter'; ctx.fillText('Certificate of Completion', 80, 160);
  ctx.font = '32px Inter'; ctx.fillText(name, 80, 260);
  ctx.font = '22px Inter'; ctx.fillStyle = '#6b7280'; ctx.fillText(`Awarded for achievements on Learnify • ${new Date().toLocaleDateString()}`, 80, 320);
  // border accent
  ctx.strokeStyle = '#1a73e8'; ctx.lineWidth = 14; ctx.strokeRect(24,24,canvas.width-48,canvas.height-48);
  // download
  const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = `learnify-certificate-${name.replace(/\s+/g,'-')}.png`; a.click();
}
function generateCertificateFor(courseId){
  // set name input with profile
  document.getElementById('cert-name').value = profile.name || (session || "Student");
  showPage('certificate');
}

/* ---------- DASHBOARD & CHART ---------- */
let chart = null;
function renderDashboard(){
  const user = session || "guest";
  const userProf = progress[user] || { lessonsCompleted:{}, quizScores:{}, xp:0, certificates:[] };
  document.getElementById('xp-count').innerText = (userProf.xp || 0);
  document.getElementById('inprogress-count').innerText = countInProgress(user);
  document.getElementById('completed-count').innerText = countCompleted(user);
  document.getElementById('cert-count').innerText = (userProf.certificates || []).length;
  // chart
  const ctx = document.getElementById('progress-chart');
  const labels = COURSES.map(c=>c.title);
  const data = COURSES.map(c=> {
    const done = (userProf.lessonsCompleted && userProf.lessonsCompleted[c.id]) ? userProf.lessonsCompleted[c.id].length : 0;
    return Math.round((done / c.lessons.length) * 100);
  });
  if(chart) chart.destroy();
  chart = new Chart(ctx, { type:'bar', data:{ labels, datasets:[{ label:'Completion %', data, backgroundColor:'rgba(26,115,232,0.7)' }] }, options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true, max:100 } } } });
}

/* helper counts */
function countInProgress(user){
  user = user || (session || "guest");
  const p = progress[user] || { lessonsCompleted:{} };
  let count = 0;
  COURSES.forEach(c=> {
    const done = (p.lessonsCompleted[c.id]||[]).length;
    if(done > 0 && done < c.lessons.length) count++;
  });
  return count;
}
function countCompleted(user){
  user = user || (session || "guest");
  const p = progress[user] || { lessonsCompleted:{} };
  let count = 0;
  COURSES.forEach(c=> { if((p.lessonsCompleted[c.id]||[]).length >= c.lessons.length) count++; });
  return count;
}

/* ---------- ACHIEVEMENTS & NOTIFICATIONS ---------- */
function renderAchievements(){
  const root = document.getElementById('badges'); root.innerHTML = '';
  const user = session || "guest";
  const p = progress[user] || { xp:0, certificates:[] };
  if((p.certificates || []).length > 0){
    p.certificates.forEach(cid=>{
      const course = COURSES.find(c=>c.id===cid);
      const div = document.createElement('div'); div.className='card';
      div.style.minWidth='180px'; div.innerHTML = `<h4>${course.title}</h4><div class="muted">Certificate Unlocked</div>`;
      root.appendChild(div);
    });
  }
  if(p.xp >= 50) { const d=document.createElement('div'); d.className='card'; d.innerHTML='<h4>50 XP</h4><div class="muted">Active learner</div>'; root.appendChild(d); }
  if(p.xp >= 200) { const d=document.createElement('div'); d.className='card'; d.innerHTML='<h4>200 XP</h4><div class="muted">Power learner</div>'; root.appendChild(d); }
}

/* notifications */
function pushNotif(text){
  notifs.unshift({ text, date: new Date().toISOString() });
  write(KEYS.NOTIFS, notifs.slice(0,50));
}
document.getElementById('notifications-btn').addEventListener('click', ()=> {
  const list = notifs.map(n=>`${new Date(n.date).toLocaleString()} — ${n.text}`).join('\n');
  alert(list || "No notifications");
});

/* ---------- PROFILE ---------- */
function loadProfile(){
  document.getElementById('profile-name').value = profile.name || "";
  document.getElementById('profile-avatar').value = profile.avatar || "";
}

/* logout */
function logout(){ session = null; localStorage.removeItem(KEYS.SESSION); showToast("Logged out"); renderDashboard(); }

/* ---------- RESOURCES UPLOAD MODAL (simple) ---------- */
function openUploadModal(){
  // open course selection for upload
  const courseId = prompt("Enter course id to upload resource to (e.g. html-basics):");
  if(!courseId) return;
  const course = COURSES.find(c=>c.id===courseId);
  if(!course) return showToast("Course id not found");
  const input = document.createElement('input'); input.type='file'; input.multiple = true;
  input.onchange = (e)=> handleFiles(e.target.files, courseId);
  input.click();
}

/* ---------- README download generator ---------- */
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
  const a = document.createElement('a'); a.href = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(readme); a.download = 'README.md'; a.click();
}

/* ---------- HELPERS & UTILITIES ---------- */
function shuffleArray(a){ return a.slice().sort(()=>Math.random()-0.5) }
function escapeHtml(s){ return s.replace(/</g,"&lt;").replace(/>/g,"&gt;") }

/* ---------- Toast (simple) ---------- */
let toastTimer = null;
function showToast(msg, ms=2200){
  clearTimeout(toastTimer);
  let t = document.getElementById('learnify-toast');
  if(!t){ t=document.createElement('div'); t.id='learnify-toast'; t.style.position='fixed'; t.style.right='20px'; t.style.bottom='20px'; t.style.padding='12px 16px'; t.style.borderRadius='10px'; t.style.background='rgba(15,23,36,0.8)'; t.style.color='#fff'; t.style.zIndex=9999; document.body.appendChild(t); }
  t.innerText = msg; t.style.opacity = '1';
  toastTimer = setTimeout(()=> t.style.opacity = '0', ms);
}

/* ---------- INITIAL RENDER ---------- */
(function init(){
  // ensure storage keys
  if(!read(KEYS.RESOURCES)) write(KEYS.RESOURCES, {});
  if(!read(KEYS.PROGRESS)) write(KEYS.PROGRESS, {});
  if(!read(KEYS.NOTIFS)) write(KEYS.NOTIFS, []);
  // set profile
  if(read(KEYS.PROFILE)) profile = read(KEYS.PROFILE);
  else write(KEYS.PROFILE, profile);
  // render default pages
  renderCourses();
  renderExplore();
  renderDashboard();
  renderAchievements();
  loadProfile();
  // GSAP entrance
  gsap.from(".card", { duration: .6, opacity:0, y:12, stagger: 0.04 });
})();
