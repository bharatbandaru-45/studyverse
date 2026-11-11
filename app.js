const $ = (id) => document.getElementById(id);
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(`sv_${key}`)) ?? fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(`sv_${key}`, JSON.stringify(value)); }
};
let tasks = store.get('tasks', []);
let notes = store.get('notes', []);
let focusMinutes = store.get('focusMinutes', 0);
let remaining = 25 * 60, timerInterval = null, running = false;

$('todayLabel').textContent = new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric'}).format(new Date());

function navigate(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
  $(view + 'View').classList.add('active-view');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  $('pageName').textContent = ({home:'Overview',ai:'AI Study Room',tasks:'My Tasks',notes:'Notes',focus:'Focus Studio'})[view];
  $('sidebar').classList.remove('open');
}
document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.view)));
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.go)));
$('menuBtn').addEventListener('click', () => $('sidebar').classList.toggle('open'));
$('themeBtn').addEventListener('click', () => document.body.classList.toggle('light-mode'));

function renderTasks() {
  $('taskCount').textContent = tasks.filter(t => !t.done).length;
  $('taskSummary').textContent = `${tasks.length} task${tasks.length===1?'':'s'}`;
  $('taskList').classList.toggle('empty-state', tasks.length===0);
  $('taskList').innerHTML = tasks.length ? tasks.map(t => `<div class="task-item ${t.done?'done':''}"><input type="checkbox" data-check="${t.id}" ${t.done?'checked':''} aria-label="Complete task"><span class="task-text">${escapeHTML(t.text)}</span><button class="delete-btn" data-delete="${t.id}" aria-label="Delete task">×</button></div>`).join('') : 'No tasks yet. Add one small goal to begin.';
}
function renderNotes() {
  $('noteCount').textContent = notes.length;
  $('noteSummary').textContent = `${notes.length} note${notes.length===1?'':'s'}`;
  $('noteList').classList.toggle('empty-state', notes.length===0);
  $('noteList').innerHTML = notes.length ? notes.map(n => `<article class="note-card"><h4>${escapeHTML(n.title)}</h4><p>${escapeHTML(n.body)}</p><button class="delete-btn" data-note-delete="${n.id}">Delete note ×</button></article>`).join('') : 'Your saved notes will appear here.';
}
function escapeHTML(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
$('taskForm').addEventListener('submit', e => { e.preventDefault(); const text=$('taskInput').value.trim(); if(!text)return; tasks.unshift({id:Date.now(),text,done:false}); store.set('tasks',tasks); $('taskInput').value=''; renderTasks(); });
$('taskList').addEventListener('click', e => { const id=Number(e.target.dataset.delete); if(id){tasks=tasks.filter(t=>t.id!==id);store.set('tasks',tasks);renderTasks();} });
$('taskList').addEventListener('change', e => { const id=Number(e.target.dataset.check); if(id){tasks=tasks.map(t=>t.id===id?{...t,done:e.target.checked}:t);store.set('tasks',tasks);renderTasks();} });
$('noteForm').addEventListener('submit', e => { e.preventDefault(); const title=$('noteTitle').value.trim(),body=$('noteBody').value.trim();if(!title||!body)return;notes.unshift({id:Date.now(),title,body});store.set('notes',notes);$('noteTitle').value='';$('noteBody').value='';renderNotes(); });
$('noteList').addEventListener('click',e=>{const id=Number(e.target.dataset.noteDelete);if(id){notes=notes.filter(n=>n.id!==id);store.set('notes',notes);renderNotes();}});

function addChat(text, cls) { const div=document.createElement('div');div.className=cls;div.textContent=text;$('chatArea').appendChild(div);$('chatArea').scrollTop=$('chatArea').scrollHeight; }
function sendChat(text) { if(!text.trim())return;addChat(text,'user-message');addChat('This is the STUDYVERSE demo. The AI service is not connected yet. In the next development phase, we will connect an AI provider securely through a backend.','assistant-message'); }
$('chatForm').addEventListener('submit',e=>{e.preventDefault();sendChat($('chatInput').value);$('chatInput').value='';});
document.querySelectorAll('.suggestion').forEach(b=>b.addEventListener('click',()=>sendChat(b.textContent)));

function updateTimer(){const m=String(Math.floor(remaining/60)).padStart(2,'0'),s=String(remaining%60).padStart(2,'0');$('timer').textContent=`${m}:${s}`;}
function stopTimer(){clearInterval(timerInterval);timerInterval=null;running=false;$('startTimer').innerHTML='Resume focus <span>▶</span>';}
$('startTimer').addEventListener('click',()=>{if(running){stopTimer();$('timerState').textContent='PAUSED';return;}running=true;$('startTimer').textContent='Pause';$('timerState').textContent='YOU ARE IN THE ZONE';timerInterval=setInterval(()=>{remaining--;updateTimer();if(remaining<=0){stopTimer();focusMinutes+=25;store.set('focusMinutes',focusMinutes);$('focusCount').innerHTML=focusMinutes+'<span class="unit">m</span>';$('timerState').textContent='SESSION COMPLETE';}},1000);});
$('resetTimer').addEventListener('click',()=>{stopTimer();remaining=25*60;updateTimer();$('timerState').textContent='READY WHEN YOU ARE';$('startTimer').innerHTML='Start focus <span>▶</span>';});
$('audioFile').addEventListener('change',e=>{const file=e.target.files[0];if(file){$('audioPlayer').src=URL.createObjectURL(file);$('audioPlayer').load();}});
$('focusCount').innerHTML=focusMinutes+'<span class="unit">m</span>';
renderTasks();renderNotes();updateTimer();
if('serviceWorker' in navigator && location.protocol!=='file:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.error));}
