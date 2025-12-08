/* courses.js
   Contains the full course dataset (5 courses) and helper to ensure data in localStorage.
*/

const SAMPLE_COURSES = [
  // Course 1: HTML & CSS Foundations
  {
    id: "c-html-css",
    title: "HTML & CSS Foundations",
    category: "Web Development",
    difficulty: "Beginner",
    rating: 4.8,
    description: "Learn the building blocks: semantic HTML, CSS basics, layout with Flexbox and Grid.",
    thumbnail: "assets/images/html-css.png",
    lessons: [
      {
        id: "c-html-css-l1",
        title: "HTML Basics",
        duration: "8m",
        content: `
          <h3>HTML Basics</h3>
          <p>HTML structures web pages. Tags, elements and attributes are the core.</p>
          <pre><code class="language-html">&lt;!doctype html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;&lt;meta charset="utf-8"&gt;&lt;title&gt;Hello&lt;/title&gt;&lt;/head&gt;
  &lt;body&gt;&lt;h1&gt;Hello&lt;/h1&gt;&lt;/body&gt;
&lt;/html&gt;</code></pre>
          <h4>Exercise</h4>
          <p>Make a page with header, main, and footer. Paste HTML below:</p>
          <textarea id="exercise-c-html-css-l1" rows="6" placeholder="&lt;!doctype html&gt;..."></textarea>
          <div style="margin-top:.5rem"><button class="btn small primary" data-exec="c-html-css-l1">Check</button><button class="btn small ghost" data-clear="c-html-css-l1">Clear</button></div>
          <div id="exercise-result-c-html-css-l1" class="muted" style="margin-top:.5rem"></div>
        `
      },
      {
        id: "c-html-css-l2",
        title: "Semantic HTML",
        duration: "10m",
        content: `
          <h3>Semantic HTML</h3>
          <p>Use semantic tags to improve accessibility and SEO.</p>
          <pre><code class="language-html">&lt;header&gt;&lt;nav&gt;&lt;/nav&gt;&lt;/header&gt;</code></pre>
          <div class="mcq" data-quiz="c-html-css-l2">
            <div class="quiz-q">Which of these is semantic?</div>
            <div class="options"><div class="opt">div</div><div class="opt">&lt;nav&gt;</div><div class="opt">&lt;span&gt;</div></div>
            <div class="mcq-result muted"></div>
          </div>
        `
      },
      {
        id: "c-html-css-l3",
        title: "CSS Selectors",
        duration: "12m",
        content: `
          <h3>Selectors</h3>
          <pre><code class="language-css">.card { padding: 12px; }</code></pre>
          <p>Selectors target elements for styling.</p>
        `
      },
      {
        id: "c-html-css-l4",
        title: "Flexbox",
        duration: "12m",
        content: `
          <h3>Flexbox</h3>
          <pre><code class="language-css">.row { display:flex; gap:8px; }</code></pre>
          <p>Use flexbox for 1D layouts.</p>
        `
      },
      {
        id: "c-html-css-l5",
        title: "Grid Basics",
        duration: "14m",
        content: `
          <h3>CSS Grid</h3>
          <pre><code class="language-css">.grid { display:grid; grid-template-columns: 1fr 1fr; }</code></pre>
          <p>Grid is great for 2D layouts.</p>
        `
      },
      {
        id: "c-html-css-l6",
        title: "Responsive Media",
        duration: "9m",
        content: `
          <h3>Responsive Images</h3>
          <p>Use srcset and sizes for responsive images.</p>
        `
      }
    ],
    quiz: {
      questions: [
        { q: "Which tag defines a paragraph?", choices: ["<div>","<span>","<p>","<a>"], a: 2 },
        { q: "Flexbox is best for:", choices: ["2D layouts","1D layouts","Database","Animations"], a: 1 }
      ]
    }
  },

  // Course 2: JavaScript Essentials
  {
    id: "c-js",
    title: "JavaScript Essentials",
    category: "Web Development",
    difficulty: "Beginner",
    rating: 4.7,
    description: "JavaScript fundamentals: variables, scope, DOM, and basic patterns.",
    thumbnail: "assets/images/js.png",
    lessons: [
      {
        id: "c-js-l1",
        title: "Variables & Types",
        duration: "9m",
        content: `
          <h3>Variables</h3>
          <pre><code class="language-js">const name = "Sayed"; let age = 28;</code></pre>
          <h4>Predict output</h4>
          <pre><code class="language-js">let a = 1;
function test() {
  console.log(a);
  let a = 2;
}
test();</code></pre>
          <div class="muted">Choose: A)1 B)undefined C)ReferenceError</div>
        `
      },
      {
        id: "c-js-l2",
        title: "Functions & Scope",
        duration: "12m",
        content: `
          <h3>Functions & scope</h3>
          <pre><code class="language-js">function add(a,b){ return a+b; }</code></pre>
          <h4>Exercise</h4>
          <textarea id="exercise-c-js-l2" rows="4" placeholder="// write sum function"></textarea>
          <div style="margin-top:.5rem"><button class="btn small primary" data-exec="c-js-l2">Check</button><button class="btn small ghost" data-clear="c-js-l2">Clear</button></div>
          <div id="exercise-result-c-js-l2" class="muted" style="margin-top:.5rem"></div>
        `
      },
      {
        id: "c-js-l3",
        title: "DOM Basics",
        duration: "10m",
        content: `
          <h3>DOM</h3>
          <pre><code class="language-js">document.querySelector('#app').textContent = 'Hello';</code></pre>
        `
      },
      {
        id: "c-js-l4",
        title: "Events",
        duration: "9m",
        content: `<h3>Events</h3><p>Use addEventListener to handle events.</p>`
      },
      {
        id: "c-js-l5",
        title: "Async & Promises",
        duration: "14m",
        content: `<h3>Async</h3><p>Promises help with async flows.</p>`
      },
      {
        id: "c-js-l6",
        title: "Fetch API",
        duration: "12m",
        content: `<h3>Fetch</h3><pre><code class="language-js">fetch('/api').then(r=>r.json()).then(d=>console.log(d))</code></pre>`
      },
      {
        id: "c-js-l7",
        title: "ES6+ Features",
        duration: "10m",
        content: `<h3>ES6</h3><p>Arrow functions, destructuring, spread, rest.</p>`
      },
      {
        id: "c-js-l8",
        title: "Debugging",
        duration: "8m",
        content: `<h3>Debug</h3><p>DevTools and console for debugging.</p>`
      }
    ],
    quiz: {
      questions: [
        { q: "Which declares block-scoped variable?", choices: ["var","let","function","const (value)"], a: 1 },
        { q: "What does === check?", choices: ["value","type","value & type","none"], a: 2 }
      ]
    }
  },

  // Course 3: Responsive Web Design
  {
    id: "c-responsive",
    title: "Responsive Web Design",
    category: "Design",
    difficulty: "Intermediate",
    rating: 4.6,
    description: "Design responsive pages that adapt to device sizes.",
    thumbnail: "assets/images/responsive.png",
    lessons: [
      { id: "c-responsive-l1", title: "Meta viewport", duration: "6m", content: `<h3>Viewport</h3><p>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</p>` },
      { id: "c-responsive-l2", title: "Media queries", duration: "12m", content: `<h3>Media queries</h3><pre><code class="language-css">@media (max-width: 600px) { .col { width:100% } }</code></pre>` },
      { id: "c-responsive-l3", title: "Fluid images", duration: "6m", content: `<h3>Images</h3><p>Use max-width:100% to make images fluid.</p>` },
      { id: "c-responsive-l4", title: "Mobile first", duration: "8m", content: `<h3>Mobile first</h3><p>Design small screens first.</p>` },
      { id: "c-responsive-l5", title: "Testing & tools", duration: "7m", content: `<h3>Tools</h3><p>Use DevTools device toolbar for testing.</p>` }
    ],
    quiz: { questions: [{ q: "Use media queries to...", choices:["change layout","delete elements","minify CSS"], a:0 }] }
  },

  // Course 4: Front-End Projects
  {
    id: "c-projects",
    title: "Front-End Developer Projects",
    category: "Projects",
    difficulty: "Intermediate",
    rating: 4.9,
    description: "Build real-world projects to showcase in your portfolio.",
    thumbnail: "assets/images/projects.png",
    lessons: [
      { id: "c-projects-l1", title: "Project: Portfolio", duration: "14m", content: `<h3>Portfolio</h3><p>Structure your portfolio to showcase projects.</p>` },
      { id: "c-projects-l2", title: "Project: Todo App", duration: "18m", content: `<h3>Todo</h3><p>Implement add/edit/delete tasks.</p>` },
      { id: "c-projects-l3", title: "Project: Weather App", duration: "16m", content: `<h3>Weather</h3><p>Use an API to fetch weather data.</p>`},
      { id: "c-projects-l4", title: "Project: Kanban Board", duration: "20m", content: `<h3>Kanban</h3><p>Drag-and-drop tasks.</p>`},
      { id: "c-projects-l5", title: "Project: Blog", duration: "12m", content: `<h3>Blog</h3><p>Static blog structure and posts.</p>`},
      { id: "c-projects-l6", title: "Project: E-commerce", duration: "22m", content: `<h3>E-commerce</h3><p>Product listing, cart, checkout mock.</p>`}
    ],
    quiz: { questions: [{ q: "Which project is best for UI skills?", choices:["Portfolio","DB Admin"], a:0 }] }
  },

  // Course 5: Git & GitHub for Beginners
  {
    id: "c-git",
    title: "Git & GitHub for Beginners",
    category: "Tools",
    difficulty: "Beginner",
    rating: 4.5,
    description: "Version control fundamentals and GitHub workflows.",
    thumbnail: "assets/images/git.png",
    lessons: [
      { id: "c-git-l1", title: "Git Basics", duration: "8m", content: `<h3>Git</h3><pre><code class="language-bash">git init
git add .
git commit -m "initial"</code></pre>` },
      { id: "c-git-l2", title: "Branches", duration: "10m", content: `<h3>Branches</h3><p>Create branches with git branch & git checkout.</p>` },
      { id: "c-git-l3", title: "GitHub", duration: "12m", content: `<h3>GitHub</h3><p>Push & create PRs.</p>` },
      { id: "c-git-l4", title: "Workflows", duration: "9m", content: `<h3>Workflows</h3><p>Use GitHub Actions for CI.</p>` }
    ],
    quiz: { questions: [{ q: "What command commits changes?", choices:["git push","git add","git commit"], a:2 }] }
  }
];

if (!localStorage.getItem('learnify_courses')) {
  localStorage.setItem('learnify_courses', JSON.stringify(SAMPLE_COURSES));
}
