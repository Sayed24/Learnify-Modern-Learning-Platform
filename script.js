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
