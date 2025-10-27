const $ = sel => document.querySelector(sel);
const menu = $('#menu');
const work = $('#work');
const content = $('#content');
const titleBadge = $('#title');
const nav = $('#navBtns');
let cursor = 0;
let currentItems = [];
let currentMode = 'menu';

// Рейтинг
const Score = {
  load(){ try{ return JSON.parse(localStorage.getItem('ai_bayan_scores')||'{}'); }catch(e){ return {}; } },
  save(data){ localStorage.setItem('ai_bayan_scores', JSON.stringify(data)); },
  add(section, delta=10){ const d=this.load(); d[section]=(d[section]||0)+delta; this.save(d); },
};

function starGlow(){
  const glow = document.createElement('div');
  glow.className='star-glow';
  document.body.appendChild(glow);
  setTimeout(()=>glow.remove(), 700);
}

function showMenu(){
  $('#authBox').classList.add('hidden');
  menu.classList.remove('hidden');
  work.classList.add('hidden');
}

function openSection(name){
  menu.classList.add('hidden');
  work.classList.remove('hidden');
  titleBadge.textContent = name;
  nav.classList.add('hidden');
  content.innerHTML = '';
  currentMode = name;
  if(name==='Reading') renderReading();
  if(name==='Listening') renderListening();
  if(name==='Irregular Verbs') renderVerbs(0);
  if(name==='Grammar') renderGrammar(0);
  if(name==='Dictation') renderDictation(0);
  if(name==='Phonetics') renderPhonetics();
  if(name==='Vocabulary') renderVocabulary();
  if(name==='Time') renderTime();
  if(name==='Dictionary') renderDictionary();
  if(name==='Speaking') renderSpeaking();
  if(name==='Writing') renderWriting();
  if(name==='AI Chat') renderChat();
  if(name==='Scorebook') renderScorebook();
}

// Демо-данные (расширишь своими)
const reading = [
  {title:'My Family', text:`Hello! My name is Aida.
I have a mother, a father and a sister.
We are a happy family.
My sister likes cats. I like dogs.`, qa:[
    {q:'Her sister likes cats.', a:true},
    {q:'Aida likes cats.', a:false},
  ]},
  {title:'At School', text:`I go to school every day.
I like English lessons.
My teacher is kind and funny.
We read, write, and play games.`, qa:[
    {q:'She goes to school every week.', a:false},
    {q:'She likes English lessons.', a:true},
  ]}
];

const listening = [
  {title:'At School (dialogue)', lines:[
    "Teacher: Good morning, class!",
    "Aida: Good morning, teacher!",
    "Teacher: What day is it today?",
    "Ali: It’s Tuesday.",
    "Teacher: What’s our first lesson?",
    "Aida: It’s English.",
    "Teacher: Do you like English?",
    "Aida: Yes, I do!"
  ], blanks:[
    {q:'Today is _____.', a:'Tuesday'},
    {q:'Our first lesson is _____.', a:'English'}
  ]}
];

const verbs50 = [
  ['meet','met','met','встречать'],
  ['be','was/were','been','быть'],
  ['have','had','had','иметь'],
  ['do','did','done','делать'],
  ['go','went','gone','идти'],
  ['see','saw','seen','видеть'],
];

const grammar = [
  {title:'To Be', tasks:[
    {q:'I ___ a pupil.', options:['is','am','are'], a:'am'},
    {q:'She ___ my friend.', options:['is','am','are'], a:'is'},
    {q:'They ___ at school.', options:['is','am','are'], a:'are'},
    {q:'He ___ happy.', options:['is','am','are'], a:'is'},
    {q:'We ___ ready.', options:['is','am','are'], a:'are'},
    {q:'You ___ my teacher.', options:['is','am','are'], a:'are'},
  ]},
  {title:'There is / There are', tasks:[
    {q:'___ a book on the table.', options:['There is', 'There are'], a:'There is'},
    {q:'___ two chairs in the room.', options:['There is', 'There are'], a:'There are'},
    {q:'___ a cat under the bed.', options:['There is', 'There are'], a:'There is'},
    {q:'___ apples in the basket.', options:['There is', 'There are'], a:'There are'},
    {q:'___ a lamp near the sofa.', options:['There is', 'There are'], a:'There is'},
    {q:'___ no water in the bottle.', options:['There is', 'There are'], a:'There is'}
  ]}
];

const dictations = [
  {title:'My Family', sentences:[
    'I live with my mother and father.',
    'My sister is ten years old.',
    'My grandmother cooks very well.',
    'We watch TV together every evening.',
    'My brother likes playing football.',
    'I love my family very much.'
  ]}
];

function sectionHero(name){
  const img = document.createElement('img');
  img.src = 'assets/visuals/' + name.toLowerCase().replaceAll(' ','_') + '.png';
  const wrap = document.createElement('div');
  wrap.className='section-hero';
  wrap.appendChild(img);
  return wrap;
}

function renderReading(){
  currentItems = reading; cursor = 0; nav.classList.remove('hidden');
  content.innerHTML = ''; content.appendChild(sectionHero('reading'));
  drawReadingItem();
}
function drawReadingItem(){
  const item = currentItems[cursor];
  const box = document.createElement('div');
  box.innerHTML = `<h3>${item.title}</h3>
  <pre style="white-space:pre-wrap;background:#fff;padding:12px;border-radius:12px">${item.text}</pre>
  <div class="q">True / False</div>
  <div class="answers"></div>`;
  content.appendChild(box);
  const ans = box.querySelector('.answers');
  item.qa.forEach(q=>{
    const t = document.createElement('button'); t.className='ghost'; t.textContent=`✅ ${q.q}`;
    t.onclick = ()=>{ mark(q.a===true, t); if(q.a===true) Score.add('Reading',5); };
    const f = document.createElement('button'); f.className='ghost'; f.textContent=`❌ ${q.q}`;
    f.onclick = ()=>{ mark(q.a===false, f); if(q.a===false) Score.add('Reading',5); };
    ans.appendChild(t); ans.appendChild(f);
  });
}

function renderListening(){
  currentItems = listening; cursor = 0; nav.classList.remove('hidden');
  content.innerHTML = ''; content.appendChild(sectionHero('listening'));
  drawListeningItem();
}
function drawListeningItem(){
  const item = currentItems[cursor];
  content.innerHTML += `<h3>${item.title}</h3>
  <ul>${item.lines.map(l=>`<li>${l}</li>`).join('')}</ul>
  <div class="q">Fill the blanks</div>
  ${item.blanks.map((b,i)=>`<div style="margin:6px 0">${b.q} <input data-i="${i}" class="ghost" style="padding:6px;border-radius:8px;border:1px solid #ddd"></div>`).join('')}
  <button class="primary" id="checkBlanks">Check</button>`;
  $('#checkBlanks').onclick = ()=>{
    content.querySelectorAll('input').forEach(inp=>{
      const i = +inp.dataset.i; const ok = inp.value.trim().toLowerCase() === item.blanks[i].a.toLowerCase();
      inp.classList.remove('correct','wrong'); inp.classList.add(ok?'correct':'wrong');
      if(ok){ Score.add('Listening',5); starGlow(); }
    });
  };
}

function renderVerbs(i){
  cursor = i; nav.classList.remove('hidden');
  content.innerHTML = ''; content.appendChild(sectionHero('irregulars'));
  const v = verbs50[i];
  content.innerHTML += `<h3>${v[0]} — ${v[1]} — ${v[2]} <span class="badge">${v[3]}</span></h3>
    <div class="q">Complete the sentence:</div>
    <div>"I ___ my friend yesterday."</div>
    <div style="margin-top:8px">
      <button class="ghost">meet</button>
      <button class="ghost correct">met</button>
      <button class="ghost">meets</button>
    </div>`;
  content.querySelectorAll('button.ghost').forEach(b=>{
    b.onclick = ()=>{
      const ok = b.classList.contains('correct');
      mark(ok, b); if(ok){ Score.add('Irregular Verbs',5); starGlow(); }
    };
  });
}

function renderGrammar(i){
  currentItems = grammar; cursor = i; nav.classList.remove('hidden');
  content.innerHTML = ''; content.appendChild(sectionHero('grammar'));
  drawGrammarItem();
}
function drawGrammarItem(){
  const item = currentItems[cursor];
  const container = document.createElement('div');
  container.innerHTML = `<h3>${item.title}</h3>`;
  content.appendChild(container);
  item.tasks.forEach((t,idx)=>{
    const row = document.createElement('div'); row.className='q'; row.textContent = (idx+1)+'. '+t.q;
    const box = document.createElement('div');
    t.options.forEach(opt=>{
      const b = document.createElement('button'); b.className='ghost'; b.textContent=opt;
      b.onclick=()=>{ const ok = (opt===t.a); mark(ok,b); if(ok){ Score.add('Grammar',5); starGlow(); } };
      box.appendChild(b);
    });
    content.appendChild(row); content.appendChild(box);
  });
}

function renderDictation(i){
  cursor = i; nav.classList.remove('hidden');
  content.innerHTML=''; content.appendChild(sectionHero('dictation'));
  const item = dictations[i];
  content.innerHTML += `<h3>${item.title}</h3>
  <div class="q">Listen and type each sentence:</div>
  ${item.sentences.map((s,idx)=>`
    <div style="margin:6px 0">
      <button class="ghost" onclick="alert('🎧 ${s}')">▶️ Play</button>
      <input data-i="${idx}" class="ghost" style="padding:8px;border-radius:10px;border:1px solid #ddd;min-width:320px">
    </div>`).join('')}
  <button id="checkDict" class="primary">Check</button>`;
  $('#checkDict').onclick = ()=>{
    content.querySelectorAll('input').forEach(inp=>{
      const i = +inp.dataset.i; const ok = inp.value.trim()===item.sentences[i];
      inp.classList.remove('correct','wrong'); inp.classList.add(ok?'correct':'wrong');
      if(ok){ Score.add('Dictation',5); starGlow(); }
    });
  };
}

function renderPhonetics(){ nav.classList.add('hidden');
  content.innerHTML=''; content.appendChild(sectionHero('phonetics'));
  content.innerHTML += `<h3>Phonetics 🔤</h3>
  <div class="q">Listen & Repeat minimal pairs</div>
  <div><button class="ghost" onclick="mark(true,this); starGlow(); Score.add('Phonetics',5)">ship</button>
       <button class="ghost">sheep</button></div>`;
}

function renderVocabulary(){ nav.classList.add('hidden');
  content.innerHTML=''; content.appendChild(sectionHero('vocabulary'));
  content.innerHTML += `<h3>Vocabulary — Guess the Word</h3>
  <div class="q">This is your father's mother → ?</div>
  <div><button class="ghost">aunt</button><button class="ghost correct">grandmother</button><button class="ghost">mother</button></div>`;
  content.querySelectorAll('button.ghost').forEach(b=>{
    b.onclick = ()=>{ const ok=b.classList.contains('correct'); mark(ok,b); if(ok){ Score.add('Vocabulary',5); starGlow(); } };
  });
}

function renderTime(){ nav.classList.add('hidden');
  content.innerHTML=''; content.appendChild(sectionHero('time'));
  content.innerHTML += `<h3>Telling the Time ⏰</h3>
  <div class="q">It’s half past three → 3:30</div>
  <div><button class="ghost correct">3:30</button> <button class="ghost">3:15</button></div>`;
  content.querySelectorAll('button.ghost').forEach(b=>{
    b.onclick = ()=>{ const ok=b.classList.contains('correct'); mark(ok,b); if(ok){ Score.add('Time',5); starGlow(); } };
  });
}

function renderDictionary(){ nav.classList.add('hidden');
  content.innerHTML=''; content.appendChild(sectionHero('dictionary'));
  content.innerHTML += `<h3>Interactive Dictionary 📗</h3>
  <div class="q">apple — кошка? собака? яблоко?</div>
  <div><button class="ghost">cat</button><button class="ghost">dog</button><button class="ghost correct">apple</button></div>`;
  content.querySelectorAll('button.ghost').forEach(b=>{
    b.onclick = ()=>{ const ok=b.classList.contains('correct'); mark(ok,b); if(ok){ Score.add('Dictionary',5); starGlow(); } };
  });
}

function renderSpeaking(){ nav.classList.add('hidden');
  content.innerHTML=''; content.appendChild(sectionHero('speaking'));
  content.innerHTML += `<h3>Speaking 🎙️</h3>
  <div class="q">AI Bayan: What is your name?</div>
  <button class="primary" onclick="alert('🎤 Recording... (demo)')">🎤 Speak</button>`;
}

function renderWriting(){ nav.classList.add('hidden');
  content.innerHTML=''; content.appendChild(sectionHero('writing'));
  content.innerHTML += `<h3>Writing ✍️ — My Family</h3>
  <textarea style="width:100%;min-height:140px;border-radius:12px;border:1px solid #e5d2a4;padding:10px"></textarea>
  <div style="margin-top:8px"><button class="primary" onclick="Score.add('Writing',10); starGlow(); alert('Saved!')">Save</button></div>`;
}

function renderChat(){ nav.classList.add('hidden');
  content.innerHTML=''; content.appendChild(sectionHero('ai_chat'));
  content.innerHTML += `<h3>AI Bayan Chat 🤖</h3>
  <div class="panel"><div id="chatlog" style="min-height:120px"></div>
  <input id="chatinp" class="pin" placeholder="" style="min-width:60%"><button class="primary" onclick="sendChat()">Send</button></div>`;
  window.sendChat = ()=>{
    const v = $('#chatinp').value.trim(); if(!v) return;
    const log = $('#chatlog');
    const you = document.createElement('div'); you.textContent='You: '+v; log.appendChild(you);
    const bot = document.createElement('div'); bot.textContent='Bayan: Great! Let’s practice: '+v; log.appendChild(bot);
    $('#chatinp').value='';
  }
}

function renderScorebook(){ nav.classList.add('hidden');
  content.innerHTML=''; content.appendChild(sectionHero('scorebook'));
  const data = Score.load();
  let rows = Object.keys(data).map(k=>`<tr><td>${k}</td><td>${data[k]}</td></tr>`).join('');
  if(!rows) rows = '<tr><td colspan="2">No scores yet</td></tr>';
  content.innerHTML += `<h3>Scorebook 📊</h3>
  <table style="width:100%;background:#fff;border-radius:12px;padding:8px;border-collapse:collapse">
   <tr style="background:#fff7e6"><th style="text-align:left;padding:8px">Section</th><th style="text-align:left;padding:8px">Points</th></tr>
   ${rows}
  </table>`;
}

// Проверка ответа
function mark(ok, el){
  el.classList.remove('correct','wrong');
  el.classList.add(ok?'correct':'wrong');
  if(ok){ starGlow(); }
}

// Вход и навигация
$('#enterBtn').onclick = ()=>{
  const pin = $('#codeInput').value.trim();
  if(pin === '7856'){ showMenu(); }
  else { $('#codeInput').classList.add('wrong'); setTimeout(()=>$('#codeInput').classList.remove('wrong'), 500); }
};
$('#scoreBtn').onclick = ()=> openSection('Scorebook');
$('#backToMenu').onclick = showMenu;

menu.addEventListener('click', (e)=>{
  const card = e.target.closest('.card'); if(!card) return;
  const key = card.dataset.open;
  const map = {reading:'Reading', listening:'Listening', verbs:'Irregular Verbs', grammar:'Grammar', dictation:'Dictation',
               phonetics:'Phonetics', vocab:'Vocabulary', srs:'SRS', speaking:'Speaking', writing:'Writing', time:'Time', chat:'AI Chat', dictionary:'Dictionary'};
  openSection(map[key]||'Section');
});

// Пагинация
$('#prevBtn').onclick = ()=>{
  if (currentMode==='Reading'){ if(cursor>0){cursor--; content.innerHTML=''; content.appendChild(sectionHero('reading')); drawReadingItem();} }
  if (currentMode==='Listening'){ if(cursor>0){cursor--; content.innerHTML=''; content.appendChild(sectionHero('listening')); drawListeningItem();} }
  if (currentMode==='Grammar'){ if(cursor>0){cursor--; content.innerHTML=''; content.appendChild(sectionHero('grammar')); drawGrammarItem();} }
  if (currentMode==='Irregular Verbs'){ if(cursor>0){cursor--; renderVerbs(cursor);} }
  if (currentMode==='Dictation'){ if(cursor>0){cursor--; content.innerHTML=''; content.appendChild(sectionHero('dictation')); renderDictation(cursor);} }
};
$('#nextBtn').onclick = ()=>{
  if (currentMode==='Reading'){ if(cursor<reading.length-1){cursor++; content.innerHTML=''; content.appendChild(sectionHero('reading')); drawReadingItem();} }
  if (currentMode==='Listening'){ if(cursor<listening.length-1){cursor++; content.innerHTML=''; content.appendChild(sectionHero('listening')); drawListeningItem();} }
  if (currentMode==='Grammar'){ if(cursor<grammar.length-1){cursor++; content.innerHTML=''; content.appendChild(sectionHero('grammar')); drawGrammarItem();} }
  if (currentMode==='Irregular Verbs'){ if(cursor<verbs50.length-1){cursor++; renderVerbs(cursor);} }
  if (currentMode==='Dictation'){ if(cursor<dictations.length-1){cursor++; content.innerHTML=''; content.appendChild(sectionHero('dictation')); renderDictation(cursor);} }
};
