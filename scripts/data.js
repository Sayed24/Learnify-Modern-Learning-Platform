// data.js - sample courses/lessons/quizzes
const SAMPLE_COURSES = [
  {
    id: "c-html",
    title: "HTML & Semantics",
    category: "Web Development",
    difficulty: "Beginner",
    description: "Learn the building blocks of the web with semantic HTML.",
    thumbnail: "assets/html-thumb.png",
    lessons: [
      { id: "c-html-l1", title: "Introduction to HTML", content: "<p>HTML is the structure...</p>", duration: "6m" },
      { id: "c-html-l2", title: "Tags and Elements", content: "<p>Tags are used to...</p>", duration: "8m" },
      { id: "c-html-l3", title: "Forms and Inputs", content: "<p>Forms collect user input...</p>", duration: "7m" }
    ],
    quiz: {
      questions: [
        { q: "Which tag is used for a paragraph?", choices: ["<p>", "<div>", "<a>", "<span>"], a: 0 },
        { q: "Which attribute opens a link in a new tab?", choices: ["src", "target='_blank'", "rel", "alt"], a: 1 },
        { q: "Semantic element for navigation is:", choices: ["<nav>", "<section>", "<header>", "<main>"], a: 0 }
      ]
    }
  },
  {
    id: "c-css",
    title: "CSS Fundamentals",
    category: "Web Development",
    difficulty: "Beginner",
    description: "Style your pages using modern CSS techniques.",
    thumbnail: "assets/css-thumb.png",
    lessons: [
      { id: "c-css-l1", title: "Selectors & Specificity", content: "<p>Selectors target elements...</p>", duration: "9m" },
      { id: "c-css-l2", title: "Flexbox", content: "<p>Flexbox simplifies layouts...</p>", duration: "10m" },
      { id: "c-css-l3", title: "Grid Basics", content: "<p>CSS Grid is a 2D system...</p>", duration: "12m" }
    ],
    quiz: {
      questions: [
        { q: "Which property sets the flex-direction?", choices: ["flex-dir", "flex-direction", "direction", "flow"], a: 1 },
        { q: "Grid uses which units commonly?", choices: ["fr", "%", "px", "all of the above"], a: 3 },
        { q: "Which property centers content in flexbox?", choices: ["align-items", "justify-content", "center", "place-content"], a: 1 }
      ]
    }
  },
  // Add more sample courses here for variety...
];

if (!localStorage.getItem('learnify_courses')) {
  localStorage.setItem('learnify_courses', JSON.stringify(SAMPLE_COURSES));
}
