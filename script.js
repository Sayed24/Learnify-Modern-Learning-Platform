/* =====================================================
   Learnify — Complete Script.js
   Google Material Style Learning Platform
   ===================================================== */

/* ---------------- GLOBAL STATE ---------------- */
let currentPage = 'dashboard';
let currentCourseId = null;
let currentLessonIndex = 0;

/* ---------------- DATA ---------------- */
const courses = [
  {
    id: 'html',
    title: 'HTML Fundamentals',
    category: 'Web',
    level: 'Beginner',
    description: 'Learn the structure of the web using HTML.',
    lessons: [
      { title: 'What is HTML?', content: 'HTML is the standard markup language for creating web pages.' },
      { title: 'Elements & Tags', content: 'HTML uses elements defined by tags like <div>, <p>, <a>.' },
      { title: 'Forms & Inputs', content: 'Forms allow user interaction using inputs, labels, and buttons.' }
    ]
  },
  {
    id: 'css',
    title: 'CSS Essentials',
    category: 'Web',
    level: 'Beginner',
    description: 'Style modern websites using CSS.',
    lessons: [
      { title: 'CSS Basics', content: 'CSS controls layout, colors, fonts, and spacing.' },
      { title: 'Flexbox', content: 'Flexbox helps align items horizontally and vertically.' },
      { title: 'Responsive Design', content: 'Media queries adapt layouts to different screens.' }
    ]
  },
  {
    id: 'js',
    title: 'JavaScript Core',
    category: 'Programming',
    level: 'Beginner',
    description: 'Make websites interactive using JavaScript.',
    lessons: [
      { title: 'Variables', content: 'Variables store data values.' },
      { title: 'Functions', content: 'Functions execute reusable logic.' },
      { title: 'DOM Manipulation', content: 'JavaScript can change HTML dynamically.' }
    ]
  }
];

/* ---------------- QUIZ (30+ QUESTIONS) ---------------- */
const quizQuestions = {
  html: Array.from({ length: 10 }, (_, i) => ({
    q: `HTML Question ${i + 1}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 0
  })),
  css: Array.from({ length: 10 }, (_, i) => ({
    q: `CSS Question ${i + 1}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 1
  })),
  js: Array.from({ length: 10 }, (_, i) => ({
    q: `JavaScript Question ${i + 1}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 2
  }))
};

/* ---------------- STORAGE HELPERS ---------------- */
const store = {
  get(key, fallback) {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

/* ---------------- NAVIGATION ---------------- */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  currentPage = id;
}

/* ---------------- SIDEBAR ---------------- */
document.getElementById('sidebar-toggle').onclick = () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
};

/* ---------------- THEME ---------------- */
document.getElementById('toggle-theme').onclick = () => {
  const app = document.getElementById('app');
  app.classList.toggle('theme-dark');
};

/* ---------------- COURSES ---------------- */
function renderCourses() {
  const grid = document.getElementById('courses-grid');
  grid.innerHTML = '';
  courses.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${c.title}</h3>
      <p class="muted">${c.description}</p>
      <small>${c.level} • ${c.lessons.length} lessons</small>
      <div style="margin-top:10px">
        <button class="btn primary">Open</button>
      </div>
    `;
    card.querySelector('button').onclick = () => openCourse(c.id);
    grid.appendChild(card);
  });
}

function openCourse(id) {
  currentCourseId = id;
  const course = courses.find(c => c.id === id);
  document.getElementById('course-title').textContent = course.title;
  document.getElementById('course-desc').textContent = course.description;
  document.getElementById('course-meta').textContent =
    `${course.category} • ${course.level} • ${course.lessons.length} lessons`;

  const list = document.getElementById('lesson-list');
  list.innerHTML = '';
  course.lessons.forEach((l, i) => {
    const li = document.createElement('li');
    li.textContent = l.title;
    li.onclick = () => openLesson(i);
    list.appendChild(li);
  });

  showPage('course-detail');
}

/* ---------------- LESSONS ---------------- */
function openLesson(index) {
  const course = courses.find(c => c.id === currentCourseId);
  const lesson = course.lessons[index];
  currentLessonIndex = index;

  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('lesson-content').textContent = lesson.content;
  showPage('lesson');
}

document.getElementById('mark-complete-btn').onclick = () => {
  const progress = store.get('progress', {});
  progress[currentCourseId] = Math.max(progress[currentCourseId] || 0, currentLessonIndex + 1);
  store.set('progress', progress);
  alert('Lesson marked complete!');
};

/* ---------------- QUIZ ---------------- */
function openQuiz(courseId) {
  const quiz = quizQuestions[courseId];
  let score = 0;
  const card = document.getElementById('quiz-card');
  card.innerHTML = '';

  quiz.forEach((q, i) => {
    const div = document.createElement('div');
    div.innerHTML = `<p><strong>${i + 1}. ${q.q}</strong></p>`;
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = opt;
      btn.onclick = () => {
        if (idx === q.answer) score++;
        btn.disabled = true;
      };
      div.appendChild(btn);
    });
    card.appendChild(div);
  });

  const finish = document.createElement('button');
  finish.className = 'btn primary';
  finish.textContent = 'Finish Quiz';
  finish.onclick = () => alert(`Your score: ${score}/${quiz.length}`);
  card.appendChild(finish);

  showPage('quiz');
}

/* ---------------- UPLOAD ---------------- */
const dropzone = document.getElementById('resource-drop');
const input = document.getElementById('resource-input');

dropzone.onclick = () => input.click();
input.onchange = e => saveFiles(e.target.files);

dropzone.ondragover = e => e.preventDefault();
dropzone.ondrop = e => {
  e.preventDefault();
  saveFiles(e.dataTransfer.files);
};

function saveFiles(files) {
  const stored = store.get('files', []);
  [...files].forEach(f => stored.push({ name: f.name }));
  store.set('files', stored);
  alert('Files saved locally!');
}

/* ---------------- DASHBOARD ---------------- */
function updateDashboard() {
  const progress = store.get('progress', {});
  document.getElementById('completed-count').textContent =
    Object.keys(progress).length;
}

updateDashboard();
renderCourses();
showPage('dashboard');

/* ---------------- GSAP ANIMATIONS ---------------- */
gsap.from('.card', {
  opacity: 0,
  y: 20,
  stagger: 0.05,
  duration: 0.6,
  ease: 'power2.out'
});
