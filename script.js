/* ===========================================
   DATA (Courses, Lessons, Quizzes)
=========================================== */
const courses = {
  1: {
    title: "HTML & CSS Fundamentals",
    lessons: [
      {
        title: "Introduction to HTML",
        content: `
          <p>HTML creates the structure of a webpage.</p>
          <pre><code>&lt;h1&gt;Hello World&lt;/h1&gt;</code></pre>
          <p>Practice exercise:</p>
          <ul>
            <li>Create a simple HTML page</li>
            <li>Add headings, paragraphs & links</li>
          </ul>
        `,
        quiz: [
          { q: "What does HTML stand for?", a: ["Hypertext Markup Language","HighText Machine Language","Hyperloop Machine Language"], correct: 0 },
          { q: "Which tag creates a heading?", a: ["<p>", "<h1>", "<div>"], correct: 1 }
        ]
      }
    ]
  }
};

/* ===========================================
   PAGE NAVIGATION
=========================================== */
function navigate(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ===========================================
   OPEN COURSE
=========================================== */
let currentCourse = null;
let currentLesson = null;

function openCourse(id) {
  currentCourse = id;
  const course = courses[id];

  document.getElementById("courseTitle").innerText = course.title;

  let html = "";
  course.lessons.forEach((lesson, index) => {
    html += `
      <div class="course-card glass" onclick="openLesson(${index})">
        <h3>${lesson.title}</h3>
        <p>Lesson ${index + 1}</p>
      </div>`;
  });

  document.getElementById("lessonList").innerHTML = html;
  navigate("courseView");
}

/* ===========================================
   OPEN LESSON
=========================================== */
function openLesson(i) {
  currentLesson = i;

  const lesson = courses[currentCourse].lessons[i];

  document.getElementById("lessonTitle").innerText = lesson.title;
  document.getElementById("lessonContent").innerHTML = lesson.content;

  navigate("lessonView");
}

/* ===========================================
   QUIZ
=========================================== */
let userAnswers = [];

function startQuiz() {
  const quiz = courses[currentCourse].lessons[currentLesson].quiz;

  let html = "";
  quiz.forEach((q, i) => {
    html += `
      <div class="glass" style="margin:10px 0;padding:15px;">
        <p><strong>${q.q}</strong></p>
        ${q.a.map((opt, idx) =>
          `<label><input type="radio" name="q${i}" value="${idx}"> ${opt}</label><br>`
        ).join("")}
      </div>`;
  });

  document.getElementById("quizBox").innerHTML = html;

  navigate("quizView");
}

/* ===========================================
   SUBMIT QUIZ
=========================================== */
function submitQuiz() {
  const quiz = courses[currentCourse].lessons[currentLesson].quiz;
  let score = 0;

  quiz.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && Number(selected.value) === q.correct) score++;
  });

  document.getElementById("resultText").innerText =
    `You scored ${score} / ${quiz.length}`;

  navigate("resultView");
}

/* ===========================================
   CERTIFICATE
=========================================== */
function generateCertificate() {
  document.getElementById("certCourse").innerText =
    courses[currentCourse].title;

  document.getElementById("certDate").innerText =
    "Completed on " + new Date().toLocaleDateString();

  navigate("certificateView");
}
