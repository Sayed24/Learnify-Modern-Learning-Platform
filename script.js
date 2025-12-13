let currentCourseId = null;
let currentLessonIndex = 0;

const courses = [
  {
    id: 'html',
    title: 'HTML Fundamentals',
    description: 'Learn the structure of the web.',
    lessons: [
      { title: 'Intro to HTML', content: 'HTML builds web pages.' },
      { title: 'Elements', content: 'Tags define structure.' }
    ]
  },
  {
    id: 'css',
    title: 'CSS Essentials',
    description: 'Style modern websites.',
    lessons: [
      { title: 'CSS Basics', content: 'CSS styles HTML.' },
      { title: 'Flexbox', content: 'Layout system.' }
    ]
  }
];

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function renderCourses() {
  const grid = document.getElementById('courses-grid');
  grid.innerHTML = '';
  courses.forEach(c => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<h3>${c.title}</h3><p>${c.description}</p>`;
    div.onclick = () => openCourse(c.id);
    grid.appendChild(div);
  });
}

function openCourse(id) {
  currentCourseId = id;
  const c = courses.find(x => x.id === id);
  document.getElementById('course-title').textContent = c.title;
  document.getElementById('course-desc').textContent = c.description;
  const list = document.getElementById('lesson-list');
  list.innerHTML = '';
  c.lessons.forEach((l,i)=>{
    const li = document.createElement('li');
    li.textContent = l.title;
    li.onclick = ()=>openLesson(i);
    list.appendChild(li);
  });
  showPage('course-detail');
}

function openLesson(i) {
  currentLessonIndex = i;
  const c = courses.find(x=>x.id===currentCourseId);
  document.getElementById('lesson-title').textContent = c.lessons[i].title;
  document.getElementById('lesson-content').textContent = c.lessons[i].content;
  showPage('lesson');
}

document.getElementById('mark-complete-btn').onclick = ()=>{
  showToast('Lesson completed','success');
};

function showToast(msg,type='info') {
  const t=document.createElement('div');
  t.className='toast';
  t.textContent=msg;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(()=>t.remove(),3000);
}

renderCourses();
showPage('dashboard');

gsap.from('.card',{opacity:0,y:20,stagger:.1});

/* ===============================
   REAL QUIZ DATA (30+ QUESTIONS)
================================ */
const quizzes = {
  html: [
    { q: "What does HTML stand for?", o: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks Tool Markup"], a: 0 },
    { q: "Which tag creates a link?", o: ["<link>", "<a>", "<href>"], a: 1 },
    { q: "Which tag is used for images?", o: ["<img>", "<image>", "<pic>"], a: 0 },
    { q: "HTML is used for?", o: ["Styling", "Structure", "Logic"], a: 1 },
    { q: "Which tag creates a list?", o: ["<ul>", "<list>", "<ol>"], a: 0 },
    { q: "Which attribute opens link in new tab?", o: ["new", "target", "blank"], a: 1 },
    { q: "HTML files end with?", o: [".html", ".css", ".js"], a: 0 },
    { q: "Which tag is semantic?", o: ["<div>", "<span>", "<article>"], a: 2 },
    { q: "Which tag defines table row?", o: ["<td>", "<tr>", "<th>"], a: 1 },
    { q: "Which tag defines form?", o: ["<form>", "<input>", "<fieldset>"], a: 0 }
  ],
  css: [
    { q: "CSS stands for?", o: ["Cascading Style Sheets", "Color Style System", "Creative Styling Syntax"], a: 0 },
    { q: "Which property changes text color?", o: ["font-color", "color", "text-style"], a: 1 },
    { q: "Flexbox axis default?", o: ["column", "row", "grid"], a: 1 },
    { q: "Which unit is responsive?", o: ["px", "em", "pt"], a: 1 },
    { q: "Which property hides element?", o: ["display:none", "hide", "visibility:0"], a: 0 },
    { q: "Which layout is 2D?", o: ["Flexbox", "Grid", "Float"], a: 1 },
    { q: "Media queries are for?", o: ["Speed", "Responsive design", "Fonts"], a: 1 },
    { q: "Which property adds shadow?", o: ["shadow", "box-shadow", "drop-shadow"], a: 1 },
    { q: "Which selector is class?", o: [".box", "#box", "box"], a: 0 },
    { q: "Which property aligns text?", o: ["align", "text-align", "font-align"], a: 1 }
  ],
  js: [
    { q: "JavaScript is?", o: ["Compiled", "Interpreted", "Markup"], a: 1 },
    { q: "Which keyword defines variable?", o: ["var", "let", "both"], a: 2 },
    { q: "DOM stands for?", o: ["Document Object Model", "Data Object Method", "Display Object Model"], a: 0 },
    { q: "Which symbol is assignment?", o: ["=", "==", "==="], a: 0 },
    { q: "Which is array?", o: ["{}", "[]", "()"], a: 1 },
    { q: "Which loop repeats?", o: ["if", "for", "switch"], a: 1 },
    { q: "LocalStorage stores?", o: ["Server data", "Browser data", "Session only"], a: 1 },
    { q: "Which method logs?", o: ["log()", "console.log()", "print()"], a: 1 },
    { q: "Which is function?", o: ["function()", "def()", "method()"], a: 0 },
    { q: "JS can change HTML?", o: ["No", "Yes", "Only CSS"], a: 1 }
  ]
};

/* ===============================
   QUIZ ENGINE
================================ */
let quizIndex = 0;
let quizScore = 0;
let quizCourse = null;

function openQuiz(courseId) {
  quizCourse = courseId;
  quizIndex = 0;
  quizScore = 0;
  renderQuiz();
  showPage('quiz');
}

function renderQuiz() {
  const quiz = quizzes[quizCourse];
  const q = quiz[quizIndex];
  const card = document.getElementById('quiz-card');

  card.innerHTML = `
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">
      ${q.o.map((opt,i)=>`<div class="quiz-option" onclick="answerQuiz(${i})">${opt}</div>`).join('')}
    </div>
    <div class="quiz-footer">
      <span>${quizIndex + 1} / ${quiz.length}</span>
      <span class="quiz-score">Score: ${quizScore}</span>
    </div>
  `;
}

function answerQuiz(selected) {
  const quiz = quizzes[quizCourse];
  const options = document.querySelectorAll('.quiz-option');

  options.forEach(o => o.style.pointerEvents = 'none');

  if (selected === quiz[quizIndex].a) {
    options[selected].classList.add('correct');
    quizScore++;
  } else {
    options[selected].classList.add('wrong');
    options[quiz[quizIndex].a].classList.add('correct');
  }

  setTimeout(() => {
    quizIndex++;
    if (quizIndex < quiz.length) {
      renderQuiz();
    } else {
      finishQuiz();
    }
  }, 900);
}

function finishQuiz() {
  const passed = quizScore >= Math.ceil(quizzes[quizCourse].length * 0.6);
  localStorage.setItem(`quiz-${quizCourse}`, quizScore);

  document.getElementById('quiz-card').innerHTML = `
    <h3>${passed ? "🎉 Quiz Passed" : "❌ Quiz Failed"}</h3>
    <p>Your score: <strong>${quizScore}</strong></p>
    <button class="btn primary" onclick="showPage('course-detail')">Back to Course</button>
  `;

  showToast(
    passed ? "Quiz passed successfully" : "Quiz failed — try again",
    passed ? "success" : "error"
  );
}
