/* =========================================================
   GOOGLE-STYLE LEARNING PLATFORM — FULL SCRIPT.JS
   ========================================================= */

/* ===========================
   ANIMATION LOADER (GSAP Optional)
   =========================== */
function animateElements() {
  if (window.gsap) {
    gsap.to(".fade-in", { opacity: 1, duration: 1, stagger: 0.2 });
    gsap.to(".slide-up", { opacity: 1, y: 0, duration: 1, stagger: 0.1 });
    gsap.to(".scale-in", { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2 });
  }
}
document.addEventListener("DOMContentLoaded", animateElements);

/* ===========================
   GLOBAL DOM ELEMENTS
   =========================== */
const quizContainer = document.querySelector(".quiz-container");
const questionText = document.getElementById("question");
const optionsBox = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progressBars = document.querySelectorAll(".progress");
const dropZone = document.querySelector(".drop-zone");
const fileListUI = document.querySelector(".file-list");

/* ===========================
   SEARCH FILTER
   =========================== */
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const term = this.value.toLowerCase();
  document.querySelectorAll(".course-card").forEach(card => {
    const title = card.querySelector("h2").textContent.toLowerCase();
    card.style.display = title.includes(term) ? "block" : "none";
  });
});

/* ===========================
   COURSE PROGRESS SYSTEM
   =========================== */
function updateCourseProgress(index, percent) {
  progressBars[index].style.width = percent + "%";
}
updateCourseProgress(0, 40);
updateCourseProgress(1, 60);
updateCourseProgress(2, 20);

/* ===========================
   QUIZ SYSTEM — 30+ QUESTIONS
   =========================== */
let quizIndex = 0;
let score = 0;

const quizData = [
  /* HTML */
  { q: "What does HTML stand for?", a: ["Hyper Text Markup Language", "Home Text Machine Language", "Hyper Transfer Markup Language"], correct: 0 },
  { q: "Which tag creates a hyperlink?", a: ["<link>", "<a>", "<href>"], correct: 1 },
  { q: "Which tag is used for the largest heading?", a: ["<h6>", "<h1>", "<header>"], correct: 1 },
  { q: "Which element contains metadata?", a: ["<body>", "<meta>", "<head>"], correct: 2 },
  { q: "Which tag places an image?", a: ["<img>", "<picture>", "<src>"], correct: 0 },

  /* CSS */
  { q: "Which property changes text color?", a: ["font-color", "text-style", "color"], correct: 2 },
  { q: "Which unit is responsive?", a: ["px", "vh/vw", "cm"], correct: 1 },
  { q: "What does CSS stand for?", a: ["Color Style Sheet", "Cascading Style Sheets", "Computer Styled Sheets"], correct: 1 },
  { q: "Which property sets background color?", a: ["background-color", "color-bg", "bg"], correct: 0 },
  { q: "Which is used for animations?", a: ["@animate", "@motion", "@keyframes"], correct: 2 },

  /* JavaScript */
  { q: "Which keyword declares a variable?", a: ["make", "var", "set"], correct: 1 },
  { q: "Which symbol starts a comment?", a: ["//", "##", "--"], correct: 0 },
  { q: "How do you write a function?", a: ["function myFunc()", "func myFunc()", "def myFunc()"], correct: 0 },
  { q: "Which data type is an array?", a: ["[]", "{}", "()"], correct: 0 },
  { q: "Which operator compares strictly?", a: ["==", "=", "==="], correct: 2 },

  /* Web */
  { q: "What does API stand for?", a: ["Application Programming Interface", "Advanced Program Instruction", "App Proxy Integration"], correct: 0 },
  { q: "HTTP status 404 means?", a: ["Not Found", "Server Error", "Success"], correct: 0 },
  { q: "Which protocol is secure?", a: ["http", "ftp", "https"], correct: 2 },
  { q: "Which is a JavaScript library?", a: ["React", "PHP", "MySQL"], correct: 0 },
  { q: "JSON is used to?", a: ["Style pages", "Store data", "Build databases"], correct: 1 },

  /* More Questions */
  { q: "Which HTML tag creates a list?", a: ["<ul>", "<list>", "<item>"], correct: 0 },
  { q: "CSS Flexbox helps with?", a: ["Layouts", "Colors", "Tables"], correct: 0 },
  { q: "JavaScript runs in?", a: ["Browser", "Photoshop", "Excel"], correct: 0 },
  { q: "Which one is NOT a programming language?", a: ["Python", "Java", "HTML"], correct: 2 },
  { q: "React is used for?", a: ["Styling", "User interfaces", "Servers"], correct: 1 },
  { q: "LocalStorage can store?", a: ["Only numbers", "Strings only", "Key-value pairs"], correct: 2 },
  { q: "CSS Grid is best for?", a: ["2D layouts", "Charts", "Forms"], correct: 0 },
  { q: "JavaScript is?", a: ["Compiled", "Interpreted", "Binary"], correct: 1 },
  { q: "The DOM represents?", a: ["Database", "Document structure", "Debug system"], correct: 1 },
  { q: "Which tag is for forms?", a: ["<form>", "<input>", "<submit>"], correct: 0 }
];

/* Show quiz container */
function startQuiz() {
  quizContainer.style.display = "block";
  loadQuestion();
}

/* Load a question */
function loadQuestion() {
  const data = quizData[quizIndex];
  questionText.textContent = data.q;
  optionsBox.innerHTML = "";

  data.a.forEach((option, i) => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.textContent = option;

    div.addEventListener("click", () => {
      if (i === data.correct) {
        div.style.background = "#34a853";
        score++;
      } else {
        div.style.background = "#ea4335";
      }

      document.querySelectorAll(".option").forEach(btn => btn.style.pointerEvents = "none");
    });

    optionsBox.appendChild(div);
  });
}

/* Next button */
nextBtn.addEventListener("click", () => {
  quizIndex++;

  if (quizIndex >= quizData.length) {
    quizContainer.innerHTML = `
      <h2>Quiz Completed!</h2>
      <p>Your Score: <strong>${score} / ${quizData.length}</strong></p>
      <button class="btn btn-primary" onclick="restartQuiz()">Restart</button>
    `;
    return;
  }

  loadQuestion();
});

/* Restart */
function restartQuiz() {
  quizIndex = 0;
  score = 0;
  quizContainer.innerHTML = `
    <div id="question" class="question"></div>
    <div id="options"></div>
    <button id="nextBtn" class="next-btn">Next</button>
  `;
  loadQuestion();
}

/* ===========================
   DRAG-AND-DROP UPLOAD
   =========================== */
function loadSavedFiles() {
  const saved = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
  saved.forEach(file => addFileToList(file));
}

loadSavedFiles();

/* Drag Over */
dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.classList.add("highlight");
});

/* Drag Leave */
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("highlight");
});

/* Drop */
dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.classList.remove("highlight");

  const files = Array.from(e.dataTransfer.files);

  files.forEach(file => {
    addFileToList(file.name);
    saveFile(file.name);
  });
});

/* Add file to UI list */
function addFileToList(name) {
  const li = document.createElement("li");
  li.textContent = name;
  fileListUI.appendChild(li);
}

/* Save file to LocalStorage */
function saveFile(name) {
  const saved = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
  saved.push(name);
  localStorage.setItem("uploadedFiles", JSON.stringify(saved));
}

/* ===========================
   COURSE BUTTON ACTIONS
   =========================== */
document.querySelectorAll("[data-course]").forEach(btn => {
  btn.addEventListener("click", () => {
    startQuiz();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
