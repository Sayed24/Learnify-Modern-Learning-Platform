/* ==========================================================
   GLOBAL APP STATE
========================================================== */
let currentCourse = null;
let currentLesson = null;
let currentQuiz = null;

/* Data Storage Keys */
const STORAGE_KEY = "learningPlatformData";

/* Load saved data or create new */
let appData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    progress: {},
};

/* Save progress */
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

/* ==========================================================
   NAVIGATION SYSTEM
========================================================== */
function navigate(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");

    window.scrollTo(0, 0);
}

/* ==========================================================
   THEME TOGGLE
========================================================== */
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

/* ==========================================================
   COURSE DATA
========================================================== */
const courses = [
    {
        id: 1,
        title: "HTML & CSS Foundations",
        lessons: [
            {
                id: 1,
                title: "Introduction to HTML",
                content: `
                    <p>HTML is the structure of the web. Everything starts with it.</p>
                    <ul>
                      <li>HTML Elements</li>
                      <li>Tags</li>
                      <li>Attributes</li>
                    </ul>
                    <pre><code>&lt;h1&gt;Hello World!&lt;/h1&gt;</code></pre>
                `,
                quiz: [
                    { q: "HTML stands for?", options: ["HyperText Markup Language", "How To Make Lasagna"], a: 0 },
                    { q: "Which tag creates a heading?", options: ["&lt;p&gt;", "&lt;h1&gt;"], a: 1 }
                ]
            },
            {
                id: 2,
                title: "CSS Basics",
                content: `
                    <p>CSS makes your website beautiful.</p>
                    <pre><code>h1 {
  color: red;
  font-size: 30px;
}</code></pre>
                `,
                quiz: [
                    { q: "CSS controls:", options: ["Structure", "Appearance"], a: 1 }
                ]
            }
        ]
    },

    {
        id: 2,
        title: "JavaScript Essentials",
        lessons: [
            {
                id: 1,
                title: "Variables",
                content: `
                <p>Variables store data in JavaScript.</p>
                <pre><code>let name = "John";</code></pre>
                `,
                quiz: [
                    { q: "Which keyword declares a variable?", options: ["let", "pizza"], a: 0 }
                ]
            },
            {
                id: 2,
                title: "Functions",
                content: `
                <p>Functions allow reusable logic.</p>
                <pre><code>function greet() {
  console.log("Hello!");
}</code></pre>
                `,
                quiz: [
                    { q: "Functions are used for:", options: ["Repeating logic", "Changing colors"], a: 0 }
                ]
            }
        ]
    }
];

/* ==========================================================
   LOAD COURSES ON PAGE
========================================================== */
function renderCourses() {
    let container = document.getElementById("coursesContainer");
    container.innerHTML = "";

    courses.forEach(course => {
        let div = document.createElement("div");
        div.className = "course-card glass";
        div.onclick = () => openCourse(course.id);

        div.innerHTML = `
            <h3>${course.title}</h3>
            <span class="badge">${course.lessons.length} Lessons</span>
        `;

        container.appendChild(div);
    });
}

renderCourses();

/* ==========================================================
   OPEN COURSE VIEW
========================================================== */
function openCourse(id) {
    currentCourse = courses.find(c => c.id === id);

    document.getElementById("courseTitle").innerHTML = currentCourse.title;

    let lessonList = document.getElementById("lessonList");
    lessonList.innerHTML = "";

    currentCourse.lessons.forEach(lesson => {
        let div = document.createElement("div");
        div.className = "course-card glass";
        div.onclick = () => openLesson(lesson.id);

        let isDone = appData.progress[`course${id}-lesson${lesson.id}`];

        div.innerHTML = `
            <h4>${lesson.title}</h4>
            <p>${isDone ? "✓ Completed" : "Start Lesson"}</p>
        `;

        lessonList.appendChild(div);
    });

    navigate("courseView");
}

/* ==========================================================
   OPEN LESSON VIEW
========================================================== */
function openLesson(lessonId) {
    currentLesson = currentCourse.lessons.find(l => l.id === lessonId);

    document.getElementById("lessonTitle").innerHTML = currentLesson.title;
    document.getElementById("lessonContent").innerHTML = currentLesson.content;

    currentQuiz = currentLesson.quiz;

    navigate("lessonView");

    if (window.hljs) hljs.highlightAll();
}

/* ==========================================================
   QUIZ HANDLING
========================================================== */
function startQuiz() {
    navigate("quizView");

    let quizBox = document.getElementById("quizBox");
    quizBox.innerHTML = "";

    currentQuiz.forEach((item, index) => {
        let box = document.createElement("div");
        box.className = "glass";

        let optionsHTML = item.options
            .map((op, i) => {
                return `
                <label>
                  <input type="radio" name="q${index}" value="${i}" />
                  ${op}
                </label>`;
            })
            .join("");

        box.innerHTML = `<h4>${item.q}</h4>${optionsHTML}`;
        quizBox.appendChild(box);
    });
}

/* SUBMIT QUIZ */
function submitQuiz() {
    let score = 0;

    currentQuiz.forEach((item, index) => {
        let selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && Number(selected.value) === item.a) score++;
    });

    let total = currentQuiz.length;
    document.getElementById("resultText").innerHTML =
        `You scored <strong>${score}/${total}</strong>.`;

    /* Mark lesson as completed */
    appData.progress[`course${currentCourse.id}-lesson${currentLesson.id}`] = true;
    saveData();

    navigate("resultView");
}

/* ==========================================================
   CERTIFICATE GENERATION
========================================================== */
function generateCertificate() {
    document.getElementById("certCourse").innerHTML = currentCourse.title;

    let date = new Date().toLocaleDateString();
    document.getElementById("certDate").innerHTML = `Date: ${date}`;

    navigate("certificateView");
}

/* ==========================================================
   PROGRESS PAGE
========================================================== */
function renderProgress() {
    let box = document.getElementById("progressBox");
    box.innerHTML = "";

    courses.forEach(course => {
        let completed = 0;
        course.lessons.forEach(lesson => {
            let key = `course${course.id}-lesson${lesson.id}`;
            if (appData.progress[key]) completed++;
        });

        let card = document.createElement("div");
        card.className = "progress-card";
        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${completed} / ${course.lessons.length} lessons completed</p>
        `;
        box.appendChild(card);
    });
}

document.querySelector(".nav-btn:nth-child(3)").addEventListener("click", renderProgress);

/* ==========================================================
   BACK BUTTON LOGIC
========================================================== */
window.onpopstate = () => {
    let pages = document.querySelectorAll(".page");
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById("home").classList.add("active");
};

/* ==========================================================
   INIT
========================================================== */
navigate("home");

/* Syntax highlighting (VS Code Dark ready) */
if (window.hljs) hljs.highlightAll();
