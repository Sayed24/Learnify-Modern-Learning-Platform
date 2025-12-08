/* lessons.js handles the lesson.html page rendering and interactions */
function initLessonPage(){
  renderNavUserArea();
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('course');
  const lessonId = params.get('lesson');

  if (!courseId || !lessonId) {
    toast('Missing course or lesson'); window.location.href='index.html'; return;
  }

  const courses = getCourses();
  const course = courses.find(c=>c.id===courseId);
  if (!course) { toast('Course not found'); window.location.href='index.html'; return; }
  const lesson = course.lessons.find(l=>l.id===lessonId);
  if (!lesson) { toast('Lesson not found'); window.location.href='course.html?course='+courseId; return; }

  const lessonContent = document.getElementById('lessonContent');
  lessonContent.innerHTML = `<h2>${lesson.title}</h2>
    <div class="muted">${course.title} • ${lesson.duration}</div>
    <div class="lesson" id="lesson-body" style="margin-top:12px">${lesson.content}</div>
    <div style="margin-top:12px"><button id="markComplete" class="btn primary">${userIsLessonComplete(courseId,lessonId)?'Completed':'Mark Complete'}</button>
      <a class="btn ghost" id="nextLessonLink">Next Lesson</a>
      <a class="btn ghost" href="quiz.html?course=${courseId}">Take Quiz</a>
    </div>`;

  // apply highlight to any code block
  setTimeout(()=> {
    try { if (window.hljs) window.hljs.highlightAll(); } catch(e){console.warn(e);}
  }, 60);

  document.getElementById('markComplete').addEventListener('click', ()=>{
    const done = userToggleLessonComplete(courseId, lessonId);
    document.getElementById('markComplete').textContent = done ? 'Completed' : 'Mark Complete';
    toast('Progress saved');
  });

  // next lesson link
  const idx = course.lessons.findIndex(l=>l.id===lessonId);
  const next = course.lessons[idx+1];
  const nextLink = document.getElementById('nextLessonLink');
  if (next) nextLink.onclick = ()=> { window.location.href = `lesson.html?course=${courseId}&lesson=${next.id}`; };
  else nextLink.onclick = ()=> toast('Last lesson in this course');

  // wire exercises buttons (data-exec / data-clear)
  document.querySelectorAll('[data-exec]').forEach(btn => {
    btn.addEventListener('click', ()=> {
      const key = btn.getAttribute('data-exec');
      const ta = document.getElementById('exercise-' + key);
      const out = document.getElementById('exercise-result-' + key);
      if (!ta) { if(out) out.textContent='No input found'; return; }
      const text = ta.value.trim();
      // safe heuristics per exercise id
      let ok=false,msg='Checked';
      if (key === 'c-html-css-l1') {
        ok = /<header[\s>]/i.test(text) && /<footer[\s>]/i.test(text) && /<main[\s>]/i.test(text);
        msg = ok ? 'Looks good — header, main & footer detected' : 'Try including header, main and footer tags';
      } else if (key === 'c-js-l2') {
        ok = /function\s+sum\s*\(|const\s+sum\s*=/.test(text) || text.includes('return');
        msg = ok ? 'Good — sum function detected' : 'Try implementing function sum(...nums){ return nums.reduce... }';
      } else {
        ok = text.length>10; msg = ok? 'Input looks OK' : 'Please enter code';
      }
      if (out) { out.textContent = msg; out.style.color = ok ? 'green' : ''; }
    });
  });
  document.querySelectorAll('[data-clear]').forEach(btn => {
    btn.addEventListener('click', ()=> {
      const key = btn.getAttribute('data-clear');
      const ta = document.getElementById('exercise-' + key);
      const out = document.getElementById('exercise-result-' + key);
      if (ta) ta.value=''; if (out) { out.textContent=''; out.style.color=''; }
    });
  });

}
