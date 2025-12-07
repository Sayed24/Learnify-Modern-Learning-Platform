// Extended data.js - Tech Red Edition
const SAMPLE_COURSES = [
  {
    id: "c-html",
    title: "HTML & Semantics",
    category: "Web Development",
    difficulty: "Beginner",
    rating: 4.6,
    reviews: 120,
    description: "Learn the building blocks of the web with semantic HTML.",
    thumbnail: "assets/html-thumb.png",
    tags: ["html","basics","web"],
    lessons: [
      { id: "c-html-l1", title: "Introduction to HTML", content: "<p>HTML is the structure...</p>", duration: "6m", words: 230 },
      { id: "c-html-l2", title: "Tags and Elements", content: "<p>Tags are used to...</p>", duration: "8m", words: 410 },
      { id: "c-html-l3", title: "Forms and Inputs", content: "<p>Forms collect user input...</p>", duration: "7m", words: 330 }
    ],
    quiz: {
      questions: [
        { q: "Which tag is used for a paragraph?", choices: ["<p>", "<div>", "<a>", "<span>"], a: 0, explanation: "The <p> tag denotes a paragraph." },
        { q: "Which attribute opens a link in a new tab?", choices: ["src", "target='_blank'", "rel", "alt"], a: 1, explanation: "target='_blank' tells the browser to open the link in a new tab." },
        { q: "Semantic element for navigation is:", choices: ["<nav>", "<section>", "<header>", "<main>"], a: 0, explanation: "<nav> is intended for major navigation blocks." }
      ],
      timeLimitSec: 300
    }
  },
  {
    id: "c-css",
    title: "CSS Fundamentals",
    category: "Web Development",
    difficulty: "Beginner",
    rating: 4.7,
    reviews: 95,
    description: "Style your pages using modern CSS techniques.",
    thumbnail: "assets/css-thumb.png",
    tags: ["css","layout","design"],
    lessons: [
      { id: "c-css-l1", title: "Selectors & Specificity", content: "<p>Selectors target elements...</p>", duration: "9m", words: 520 },
      { id: "c-css-l2", title: "Flexbox", content: "<p>Flexbox simplifies layouts...</p>", duration: "10m", words: 610 },
      { id: "c-css-l3", title: "Grid Basics", content: "<p>CSS Grid is a 2D system...</p>", duration: "12m", words: 720 }
    ],
    quiz: {
      questions: [
        { q: "Which property sets the flex-direction?", choices: ["flex-dir", "flex-direction", "direction", "flow"], a: 1, explanation: "flex-direction controls the main axis direction." },
        { q: "Grid uses which units commonly?", choices: ["fr", "%", "px", "all of the above"], a: 3, explanation: "Grid supports 'fr', percentages, pixels etc." },
        { q: "Which property centers content in flexbox?", choices: ["align-items", "justify-content", "center", "place-content"], a: 1, explanation: "justify-content aligns along main axis." }
      ]
    }
  },
  // More sample courses can be added...
];

// store initial courses if not present
if (!localStorage.getItem('learnify_courses')) {
  localStorage.setItem('learnify_courses', JSON.stringify(SAMPLE_COURSES));
}

// helper - expose method to add sample course (used by UI)
function addSampleCourse() {
  const next = {
    id: 'c-sample-' + Date.now(),
    title: 'Sample: JS Essentials',
    category: 'Web Development',
    difficulty: 'Intermediate',
    rating: 4.4,
    reviews: 42,
    description: 'A practical JavaScript fundamentals course.',
    thumbnail: 'assets/js-thumb.png',
    tags: ['javascript','es6'],
    lessons: [
      { id: 'l-' + Date.now() + '-1', title: 'Intro to JS', content: '<p>JS power...</p>', duration: '8m', words: 480 },
      { id: 'l-' + Date.now() + '-2', title: 'Functions & Scope', content: '<p>Scoping rules...</p>', duration: '12m', words: 820 }
    ],
    quiz: {
      questions: [
        { q:'What is a closure?', choices:['A','B','C','D'], a:0, explanation:'Closures capture scope.' }
      ]
    }
  };
  const existing = JSON.parse(localStorage.getItem('learnify_courses')||'[]');
  existing.push(next);
  localStorage.setItem('learnify_courses', JSON.stringify(existing));
  return next;
}
