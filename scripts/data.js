// data.js - sample courses/lessons/quizzes (enhanced lesson HTML + exercises + code blocks)
const SAMPLE_COURSES = [
  {
    id: "c-html",
    title: "HTML & Semantics",
    category: "Web Development",
    difficulty: "Beginner",
    description: "Learn the building blocks of the web with semantic HTML.",
    thumbnail: "assets/html-thumb.png",
    lessons: [
      {
        id: "c-html-l1",
        title: "Introduction to HTML",
        duration: "6m",
        words: 230,
        // rich HTML including a code block and an exercise
        content: `
          <h3>What is HTML?</h3>
          <p>HTML (HyperText Markup Language) defines the structure of web pages. It uses tags like <code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code>, and <code>&lt;a&gt;</code>.</p>
          <h4>Example — basic structure</h4>
          <pre><code class="language-html">&lt;!doctype html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;&lt;meta charset="utf-8"&gt;&lt;title&gt;Demo&lt;/title&gt;&lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello world&lt;/h1&gt;
    &lt;p&gt;This is a paragraph.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code></pre>

          <h4>Exercise</h4>
          <p>Create a simple page that includes a header, an article, and a footer.</p>
          <div class="exercise">
            <label>Your HTML (paste or type):</label>
            <textarea id="exercise-c-html-l1" rows="6" placeholder="&lt;!doctype html&gt;..."></textarea>
            <div style="margin-top:.5rem">
              <button class="btn small primary" data-exec="c-html-l1">Run check</button>
              <button class="btn small ghost" data-clear="c-html-l1">Clear</button>
            </div>
            <div id="exercise-result-c-html-l1" class="muted" style="margin-top:.6rem"></div>
          </div>
        `
      },
      {
        id: "c-html-l2",
        title: "Tags and Elements",
        duration: "8m",
        words: 410,
        content: `
          <h3>Semantic Tags</h3>
          <p>HTML5 introduced semantic elements like <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, and <code>&lt;footer&gt;</code>.</p>

          <h4>Code example</h4>
          <pre><code class="language-html">&lt;header&gt;
  &lt;h1&gt;Site Title&lt;/h1&gt;
  &lt;nav&gt;&lt;ul&gt;&lt;li&gt;&lt;a href="#"&gt;Home&lt;/a&gt;&lt;/li&gt;&lt;/ul&gt;&lt;/nav&gt;
&lt;/header&gt;
&lt;main&gt;
  &lt;article&gt;&lt;p&gt;Article text.&lt;/p&gt;&lt;/article&gt;
&lt;/main&gt;
&lt;footer&gt;&lt;p&gt;Copyright 2025&lt;/p&gt;&lt;/footer&gt;
</code></pre>

          <h4>Quick quiz</h4>
          <div class="mcq" data-quiz="c-html-l2">
            <div class="quiz-q">Which element is used for navigation?</div>
            <div class="options">
              <div class="opt" data-ans="0"> &lt;nav&gt; </div>
              <div class="opt" data-ans="1"> &lt;section&gt; </div>
              <div class="opt" data-ans="2"> &lt;div&gt; </div>
            </div>
            <div class="mcq-result muted" style="margin-top:.5rem"></div>
          </div>
        `
      },
      {
        id: "c-html-l3",
        title: "Forms and Inputs",
        duration: "7m",
        words: 330,
        content: `
          <h3>Forms</h3>
          <p>Forms let users submit data. Inputs include text, email, password, checkbox, and submit.</p>

          <h4>Form example</h4>
          <pre><code class="language-html">&lt;form action="/submit" method="post"&gt;
  &lt;label&gt;Name&lt;input name="name" type="text"&gt;&lt;/label&gt;
  &lt;label&gt;Email&lt;input name="email" type="email"&gt;&lt;/label&gt;
  &lt;button type="submit"&gt;Send&lt;/button&gt;
&lt;/form&gt;
</code></pre>

          <h4>Exercise — find the error</h4>
          <p>Below is a broken form. Identify what's missing:</p>
          <pre><code class="language-html">&lt;form method="post"&gt;
  &lt;input type="text" name="name"&gt;
  &lt;button&gt;Submit&lt;/button&gt;
&lt;/form&gt;
</code></pre>
          <div class="muted">Hint: where does the form send data?</div>
        `
      }
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
    id: "c-js",
    title: "JavaScript Essentials",
    category: "Web Development",
    difficulty: "Beginner",
    description: "Learn JavaScript fundamentals with code examples and exercises.",
    thumbnail: "assets/js-thumb.png",
    lessons: [
      {
        id: "c-js-l1",
        title: "Variables & Types",
        duration: "9m",
        words: 420,
        content: `
          <h3>Variables</h3>
          <p>Use <code>let</code>, <code>const</code> and <code>var</code>.</p>

          <h4>Example</h4>
          <pre><code class="language-js">const name = "Sayed";
let age = 28;
console.log(\`Name: \${name}, Age: \${age}\`);</code></pre>

          <h4>Exercise: Predict output</h4>
          <p>What prints to console?</p>
          <pre><code class="language-js">let a = 1;
function test() {
  console.log(a);
  let a = 2;
}
test();</code></pre>
          <div class="muted">Choose: A) 1 &nbsp; B) undefined &nbsp; C) ReferenceError</div>
        `
      },
      {
        id: "c-js-l2",
        title: "Functions & Scope",
        duration: "11m",
        words: 680,
        content: `
          <h3>Functions & Scope</h3>
          <p>Functions create their own scope. Arrow functions behave differently.</p>

          <h4>Example — closure</h4>
          <pre><code class="language-js">function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  }
}
const c = makeCounter();
console.log(c()); // 1
console.log(c()); // 2</code></pre>

          <h4>Exercise</h4>
          <p>Write a function <code>sum</code> that accepts any number of arguments and returns their sum. Try it in the console.</p>
          <textarea id="exercise-c-js-l2" rows="5" placeholder="// function sum(...nums) { ... }"></textarea>
          <div style="margin-top:.5rem"><button class="btn small primary" data-exec="c-js-l2">Run check</button></div>
          <div id="exercise-result-c-js-l2" class="muted" style="margin-top:.5rem"></div>
        `
      }
    ],
    quiz: {
      questions: [
        { q: "Which keyword creates a block-scoped variable?", choices: ["var", "let", "function", "const"], a: 1 },
        { q: "What does === check?", choices: ["value only", "type only", "value and type", "none"], a: 2 }
      ]
    }
  }
];

// Persist initial sample set if not present
if (!localStorage.getItem('learnify_courses')) {
  localStorage.setItem('learnify_courses', JSON.stringify(SAMPLE_COURSES));
}
