/* quiz.js - render quiz.html page and handle quiz interaction */
function initQuizPage(){
  renderNavUserArea();
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('course');
  if (!courseId) { toast('Missing course'); window.location.href='index.html'; return; }

  const courses = getCourses();
  const course = courses.find(c=>c.id===courseId);
  if (!course || !course.quiz) { toast('Quiz not found'); window.location.href='course.html?course='+courseId; return; }

  const wrapper = document.getElementById('quizWrapper');
  const questions = course.quiz.questions;
  let answers = Array(questions.length).fill(null);

  function render(){
    wrapper.innerHTML = `<h3>Quiz • ${course.title}</h3>
      ${questions.map((q,i)=>`<div class="quiz-q"><div><strong>Q${i+1}:</strong> ${q.q}</div>
        <div class="options">${q.choices.map((c,oi)=>`<div class="opt" data-i="${i}" data-oi="${oi}">${c}</div>`).join('')}</div></div>`).join('')}
      <div style="margin-top:12px"><button id="submitQuiz" class="btn primary">Submit</button><button id="resetQuiz" class="btn ghost">Reset</button></div>`;

    wrapper.querySelectorAll('.opt').forEach(opt => {
      opt.addEventListener('click', ()=> {
        const i = Number(opt.getAttribute('data-i'));
        const oi = Number(opt.getAttribute('data-oi'));
        answers[i] = oi;
        wrapper.querySelectorAll(`.options .opt[data-i="${i}"]`).forEach(el=> el.style.borderColor = '');
        opt.style.borderColor = 'var(--accent)';
      });
    });

    document.getElementById('submitQuiz').addEventListener('click', submit);
    document.getElementById('resetQuiz').addEventListener('click', ()=> { answers = Array(questions.length).fill(null); render(); });
  }

  function submit(){
    if (answers.some(a=>a===null)) { toast('Please answer all'); return; }
    let score = 0;
    questions.forEach((q,i)=> { if (answers[i] === q.a) score++; });
    const pct = Math.round((score/questions.length)*100);

    // save certificate if user logged in
    const user = getCurrent();
    if (!user) { toast('Login to save results'); window.location.href='login.html'; return; }
    if (pct >= 60) {
      const certs = getCerts();
      certs.push({ id: 'cert_'+Date.now(), userId: user.id, name: user.name, courseId, courseTitle: course.title, pct, date: new Date().toISOString().split('T')[0] });
      saveCerts(certs);
      toast('Passed — certificate saved');
    } else {
      toast('Did not pass — try again');
    }

    wrapper.innerHTML = `<h3>Results</h3><p>Your score: <strong>${score}/${questions.length}</strong> (${pct}%)</p>
      <div style="margin-top:12px"><a class="btn ghost" href="course.html?course=${courseId}">Back to Course</a>
        <button id="downloadCert" class="btn primary">Download Certificate</button></div>`;
    document.getElementById('downloadCert').addEventListener('click', ()=> {
      const dataUrl = generateCertificateImage(user.name, course.title, pct);
      const a = document.createElement('a'); a.href = dataUrl; a.download = `${course.title.replace(/\s+/g,'_')}_certificate.png`; a.click();
    });
  }

  render();
}
