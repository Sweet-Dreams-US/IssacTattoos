/* =========================================================
   RELIQUARY · Studio Panel — admin.js
   No framework. localStorage data layer. Demo-seeded.
   Swap the DB.* functions for a real backend to go live.
========================================================= */
(() => {
'use strict';

/* ---------- tiny DOM helper (hook-safe: no innerHTML) ---------- */
const $  = (q, c=document) => c.querySelector(q);
const $$ = (q, c=document) => [...c.querySelectorAll(q)];
const NS = 'http://www.w3.org/2000/svg';

function h(tag, props, ...kids){
  const n = document.createElement(tag);
  if (props) for (const [k,v] of Object.entries(props)){
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'dataset') Object.assign(n.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else if (k === 'value' || k === 'checked' || k === 'disabled' || k === 'hidden') n[k] = v;
    else n.setAttribute(k, v);
  }
  for (const kid of kids.flat()){
    if (kid == null || kid === false) continue;
    n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return n;
}
function svg(paths, vb='0 0 24 24', sw=1.5){
  const s = document.createElementNS(NS,'svg');
  s.setAttribute('viewBox', vb); s.setAttribute('fill','none');
  s.setAttribute('stroke','currentColor'); s.setAttribute('stroke-width', sw);
  s.setAttribute('stroke-linecap','round'); s.setAttribute('stroke-linejoin','round');
  (Array.isArray(paths)?paths:[paths]).forEach(d => {
    const p = document.createElementNS(NS,'path'); p.setAttribute('d', d); s.appendChild(p);
  });
  return s;
}
function svgNode(tag, attrs){
  const n = document.createElementNS(NS, tag);
  for (const [k,v] of Object.entries(attrs||{})) n.setAttribute(k, v);
  return n;
}

/* ---------- formatters ---------- */
const MON = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW3 = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const parseISO = iso => { const [y,m,d]=iso.split('-').map(Number); return new Date(y,m-1,d); };
const isoOf = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fmtDate = iso => { const d=parseISO(iso); return `${MON3[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; };
const fmtDay  = iso => { const d=parseISO(iso); return `${DOW3[d.getDay()]} · ${MON3[d.getMonth()]} ${d.getDate()}`; };
const initials = name => name.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const TODAY = new Date(2026,4,21);                 // demo "today" — 21 May 2026
const todayISO = isoOf(TODAY);

/* =========================================================
   DATA LAYER — localStorage. Swap for a backend to go live.
========================================================= */
const KEYS = {
  req:'reliquary.requests', book:'reliquary.bookings',
  staff:'reliquary.staff', txn:'reliquary.txns', set:'reliquary.settings',
};
const SEED_VERSION = '2026-05-21a';

const read  = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const write = (k, v)  => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function seedData(){
  /* ----- STAFF ----- */
  const staff = [
    { id:'s1', name:'Isaac Roque',  role:'Lead Artist · Founder', days:[2,3,4,5,6], rate:200 },
    { id:'s2', name:'Marisol Vega', role:'Resident Artist',       days:[3,4,5,6,0], rate:170 },
    { id:'s3', name:'Dorian Athey', role:'Apprentice',            days:[4,5,6],     rate:95  },
  ];

  /* ----- REQUESTS (incoming) ----- */
  const requests = [
    { id:'r1', name:'Marcus Bellweather', email:'m.bellweather@gmail.com', placement:'Inner forearm',
      style:'Black & grey portrait', dates:['2026-06-04','2026-06-11'],
      story:'A portrait of my late father from his Navy days — I have one good photo.',
      status:'new', created:'2026-05-20' },
    { id:'r2', name:'Tycen Holloway', email:'tycen.h@proton.me', placement:'Ribs',
      style:'Religious / sacred ornament', dates:['2026-06-18'],
      story:'Archangel Michael, want it large. Open to a multi-session plan.',
      status:'new', created:'2026-05-19' },
    { id:'r3', name:'Renata Cole', email:'renata.cole@outlook.com', placement:'Calf',
      style:'Memento mori / botanical', dates:['2026-06-06','2026-06-13','2026-06-20'],
      story:'A skull wrapped in my daughter’s birth flowers. Sentimental piece.',
      status:'reviewing', created:'2026-05-17' },
    { id:'r4', name:'Sable Ng', email:'sable.ng@gmail.com', placement:'Sternum',
      style:'Fine line & dotwork', dates:['2026-06-09'],
      story:'Small ornamental dotwork piece, delicate. First tattoo.',
      status:'new', created:'2026-05-21' },
    { id:'r5', name:'Gideon Frost', email:'gideon@frostwood.co', placement:'Full sleeve',
      style:'Open to recommendation', dates:['2026-07-02','2026-07-09'],
      story:'Orthodox iconography sleeve — a big commitment, I know. Saved for two years.',
      status:'reviewing', created:'2026-05-15' },
    { id:'r6', name:'Priya Anand', email:'priya.anand@gmail.com', placement:'Shoulder',
      style:'Black & grey portrait', dates:['2026-06-27'],
      story:'Portrait of my grandmother who raised me. Want to get it right.',
      status:'new', created:'2026-05-21' },
  ];

  /* ----- BOOKINGS ----- */
  const upcoming = [
    { client:'Wesley Crane', email:'wcrane@gmail.com', piece:'Lion of Judah — half sleeve, session 2', artistId:'s1', date:'2026-05-22', time:'12:00', hours:6, total:1180, deposit:250 },
    { client:'June Park',    email:'junepark@gmail.com', piece:'Madonna forearm', artistId:'s2', date:'2026-05-23', time:'13:00', hours:4, total:760,  deposit:200 },
    { client:'Hollis Drake', email:'hollis.d@gmail.com', piece:'Wolf & forest — thigh, session 1', artistId:'s1', date:'2026-05-27', time:'11:30', hours:7, total:1340, deposit:250 },
    { client:'Talia Voss',   email:'talia.voss@me.com',  piece:'Memento mori — calf', artistId:'s2', date:'2026-05-29', time:'13:00', hours:5, total:880,  deposit:200 },
    { client:'Wesley Crane', email:'wcrane@gmail.com',   piece:'Lion of Judah — half sleeve, session 3 (final)', artistId:'s1', date:'2026-06-03', time:'12:00', hours:5, total:980, deposit:0 },
    { client:'Anders Lee',   email:'anders.lee@gmail.com', piece:'Christ profile — upper arm', artistId:'s1', date:'2026-06-06', time:'12:00', hours:6, total:1200, deposit:250 },
    { client:'Nina Bauer',   email:'ninabauer@gmail.com', piece:'Fine line ornament — spine', artistId:'s3', date:'2026-06-12', time:'14:00', hours:3, total:420, deposit:120 },
    { client:'Hollis Drake', email:'hollis.d@gmail.com', piece:'Wolf & forest — thigh, session 2', artistId:'s1', date:'2026-06-19', time:'11:30', hours:6, total:1140, deposit:0 },
  ].map((b,i)=>({ id:'b'+(100+i), status:'upcoming', notes:'', ...b }));

  const completed = [
    { client:'Wesley Crane',   piece:'Lion of Judah — half sleeve, session 1', artistId:'s1', date:'2026-05-08', hours:6, total:1180, deposit:250 },
    { client:'Eli Strand',     piece:'Praying hands & rosary — calf',          artistId:'s1', date:'2026-05-06', hours:5, total:940,  deposit:200 },
    { client:'Maya Okafor',    piece:'Death’s-head moth — sternum',        artistId:'s2', date:'2026-05-02', hours:4, total:720,  deposit:200 },
    { client:'Rubenstein K.',  piece:'Patriarchs — chest, session 2',          artistId:'s1', date:'2026-04-29', hours:7, total:1380, deposit:300 },
    { client:'Cara Whitlock',  piece:'Black rose — neck',                      artistId:'s2', date:'2026-04-25', hours:3, total:480,  deposit:150 },
    { client:'Dominic Vance',  piece:'Memento mori skull — bicep',             artistId:'s1', date:'2026-04-18', hours:5, total:980,  deposit:200 },
    { client:'Rubenstein K.',  piece:'Patriarchs — chest, session 1',          artistId:'s1', date:'2026-04-11', hours:7, total:1380, deposit:300 },
    { client:'Tessa Lund',     piece:'Fine line cross — spine',                artistId:'s3', date:'2026-04-04', hours:3, total:390,  deposit:120 },
    { client:'Marcus Hale',    piece:'Naval officer portrait — half sleeve',   artistId:'s1', date:'2026-03-28', hours:8, total:1620, deposit:300 },
    { client:'Imogen Pike',    piece:'Eye of providence — inner bicep',        artistId:'s2', date:'2026-03-21', hours:4, total:680,  deposit:200 },
    { client:'Sawyer Bly',     piece:'Ouroboros — spine',                      artistId:'s1', date:'2026-03-07', hours:5, total:960,  deposit:200 },
    { client:'Helena Frost',   piece:'Madonna del Silencio — forearm',         artistId:'s2', date:'2026-02-21', hours:6, total:1080, deposit:250 },
    { client:'Aaron Diaz',     piece:'Chieftain portrait — upper arm',         artistId:'s1', date:'2026-02-07', hours:6, total:1240, deposit:250 },
    { client:'Noor Haddad',    piece:'Hand of glory — thigh',                  artistId:'s1', date:'2026-01-24', hours:5, total:1000, deposit:200 },
  ].map((b,i)=>({ id:'c'+(200+i), status:'completed', email:'client@example.com', time:'12:00', notes:'', ...b }));

  const bookings = [...upcoming, ...completed];

  /* ----- TRANSACTIONS ----- */
  const txns = [];
  // income from completed bookings: deposit + balance
  completed.forEach(b => {
    txns.push({ id:b.id+'-dep', date:b.date, type:'deposit', label:`Deposit — ${b.client}`, amount:b.deposit, bookingId:b.id });
    txns.push({ id:b.id+'-bal', date:b.date, type:'balance', label:`Balance — ${b.client}`, amount:b.total-b.deposit, bookingId:b.id });
  });
  // income: deposits already taken for some upcoming bookings
  upcoming.filter(b=>b.deposit>0).forEach(b => {
    txns.push({ id:b.id+'-dep', date:b.date>todayISO?todayISO:b.date, type:'deposit', label:`Deposit — ${b.client}`, amount:b.deposit, bookingId:b.id });
  });
  // expenses
  ['2026-01-01','2026-02-01','2026-03-01','2026-04-01','2026-05-01'].forEach((d,i) => {
    txns.push({ id:'rent'+i, date:d, type:'expense', label:'Studio rent — West Central', amount:-1450 });
  });
  txns.push(
    { id:'x1', date:'2026-01-14', type:'expense', label:'Ink & needles — restock',   amount:-420 },
    { id:'x2', date:'2026-02-09', type:'expense', label:'Liability insurance — Q1',   amount:-330 },
    { id:'x3', date:'2026-02-26', type:'expense', label:'Disposables & aftercare',    amount:-265 },
    { id:'x4', date:'2026-03-30', type:'expense', label:'New rotary machine',         amount:-540 },
    { id:'x5', date:'2026-04-12', type:'expense', label:'Ink & needles — restock',    amount:-385 },
    { id:'x6', date:'2026-04-22', type:'expense', label:'Print — flash plates & cards', amount:-180 },
    { id:'x7', date:'2026-05-05', type:'expense', label:'Disposables & aftercare',    amount:-240 },
  );

  /* ----- SETTINGS ----- */
  const settings = {
    studio:'Reliquary Tattoo',
    artist:'Isaac Roque',
    email:'isaac@reliquary.studio',
    phone:'(260) 555-0147',
    address:'West Central, Fort Wayne, Indiana',
    hours:'Tuesday — Saturday · Noon until late',
    depositPct:25,
    hourly:200,
    closedDays:'Sunday, Monday',
  };

  // requests: merge any submitted by the public form before first admin load
  const existingReq = read(KEYS.req, []);
  write(KEYS.req, [...existingReq, ...requests]);
  write(KEYS.book, bookings);
  write(KEYS.staff, staff);
  write(KEYS.txn, txns);
  write(KEYS.set, settings);
  localStorage.setItem('reliquary.seedVersion', SEED_VERSION);
}

const DB = {
  ensure(){ if (localStorage.getItem('reliquary.seedVersion') !== SEED_VERSION) seedData(); },
  requests:()=> read(KEYS.req, []),
  bookings:()=> read(KEYS.book, []),
  staff:()=> read(KEYS.staff, []),
  txns:()=> read(KEYS.txn, []),
  settings:()=> read(KEYS.set, {}),
  saveRequests:v=> write(KEYS.req, v),
  saveBookings:v=> write(KEYS.book, v),
  saveTxns:v=> write(KEYS.txn, v),
  saveSettings:v=> write(KEYS.set, v),
  staffName:id=> (read(KEYS.staff,[]).find(s=>s.id===id)||{}).name || '—',
};

/* ---------- toast ---------- */
let toastTimer;
function toast(msg){
  let t = $('.toast');
  if (!t){ t = h('div',{class:'toast'}); document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(()=> t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 2600);
}

/* =========================================================
   VIEWS
========================================================= */
const views = {};

/* ---------- DASHBOARD ---------- */
views.dashboard = () => {
  const reqs = DB.requests();
  const books = DB.bookings();
  const txns = DB.txns();
  const upcoming = books.filter(b=>b.status==='upcoming').sort((a,b)=>a.date.localeCompare(b.date));
  const newReqs = reqs.filter(r=>r.status==='new'||r.status==='reviewing');

  // month revenue
  const m = todayISO.slice(0,7);
  const monthIncome = txns.filter(t=>t.date.slice(0,7)===m && t.amount>0).reduce((s,t)=>s+t.amount,0);
  const monthExpense = txns.filter(t=>t.date.slice(0,7)===m && t.amount<0).reduce((s,t)=>s+t.amount,0);
  const nextDate = upcoming[0] ? fmtDay(upcoming[0].date) : '—';

  const wrap = h('div');

  // stat tiles
  wrap.append(h('div',{class:'stats'},
    statTile('Open Requests', newReqs.length, `${reqs.filter(r=>r.status==='new').length} brand new`),
    statTile('Upcoming Sittings', upcoming.length, `Next · ${nextDate}`),
    statTile('Revenue · May', money(monthIncome), `${money(-monthExpense)} in expenses`, 'up'),
    statTile('Chair Hours · May', upcoming.filter(b=>b.date.slice(0,7)===m).reduce((s,b)=>s+b.hours,0) + 'h', 'booked this month'),
  ));

  // two-column: agenda + requests preview
  const grid = h('div',{class:'dash-grid'});

  const agendaCard = h('div',{class:'card'},
    h('div',{class:'card__head'}, h('h3',{},'Next Sittings'),
      h('a',{class:'btn btn--sm', href:'#upcoming'},'All upcoming')),
    upcoming.length
      ? h('div',{class:'agenda'}, upcoming.slice(0,6).map(b =>
          h('div',{class:'agenda__item'},
            h('span',{class:'agenda__time'}, b.time),
            h('div',{class:'agenda__body'},
              h('strong',{}, b.client),
              h('span',{}, `${b.piece} · ${DB.staffName(b.artistId)}`)),
            h('span',{class:'agenda__time'}, fmtDay(b.date).split(' · ')[1]))))
      : emptyState('No sittings booked'));

  const reqCard = h('div',{class:'card'},
    h('div',{class:'card__head'}, h('h3',{},'Latest Requests'),
      h('a',{class:'btn btn--sm', href:'#requests'},'Review all')),
    newReqs.length
      ? h('div',{class:'minilist'}, newReqs.slice(0,6).map(r =>
          h('a',{class:'minilist__item', href:'#requests'},
            h('div',{},
              h('strong',{}, r.name),
              h('span',{}, `${r.placement} · ${r.style}`)),
            statusPill(r.status))))
      : emptyState('Inbox clear'));

  grid.append(agendaCard, reqCard);
  wrap.append(grid);
  return wrap;
};

/* ---------- REQUESTS ---------- */
views.requests = () => {
  const reqs = DB.requests();
  const open = reqs.filter(r=>r.status!=='declined'&&r.status!=='scheduled');
  const wrap = h('div');
  wrap.append(h('p',{class:'muted',style:'margin-bottom:18px;font-style:italic'},
    `${open.length} request${open.length===1?'':'s'} awaiting a reply. Accept one to turn it into a booking.`));

  if (!open.length){ wrap.append(emptyState('No open requests — inbox is clear.')); return wrap; }

  const grid = h('div',{class:'reqs'});
  open.forEach(r => grid.append(requestCard(r)));
  wrap.append(grid);
  return wrap;
};

function requestCard(r){
  const card = h('div',{class:'req'});
  card.append(
    h('div',{class:'req__top'},
      h('div',{},
        h('div',{class:'req__name'}, r.name),
        h('div',{class:'req__email'}, r.email)),
      statusPill(r.status)),
    h('dl',{class:'req__body'},
      reqLine('Placement', r.placement),
      reqLine('Style', r.style),
      h('div',{class:'req__line'},
        h('dt',{},'Dates'),
        h('dd',{}, h('div',{class:'req__dates'},
          (r.dates||[]).map(d => h('span',{class:'req__date'}, fmtDay(d)))))),
      h('p',{class:'req__story'}, `“${r.story}”`)),
    h('div',{class:'req__foot'},
      h('button',{class:'btn btn--solid btn--sm', onclick:()=>acceptRequest(r.id)},
        svg('M5 12l5 5L20 7'), 'Accept'),
      h('button',{class:'btn btn--sm', onclick:()=>setRequestStatus(r.id,'reviewing')}, 'Hold'),
      h('button',{class:'btn btn--sm btn--danger', onclick:()=>setRequestStatus(r.id,'declined')}, 'Decline')));
  return card;
}
function reqLine(label, val){
  return h('div',{class:'req__line'}, h('dt',{},label), h('dd',{},val));
}

function setRequestStatus(id, status){
  const reqs = DB.requests();
  const r = reqs.find(x=>x.id===id); if(!r) return;
  r.status = status;
  DB.saveRequests(reqs);
  toast(status==='declined' ? 'Request declined' : 'Moved to holding');
  render();
}
function acceptRequest(id){
  const reqs = DB.requests();
  const r = reqs.find(x=>x.id===id); if(!r) return;
  const books = DB.bookings();
  const set = DB.settings();
  const firstDate = (r.dates&&r.dates[0]) || todayISO;
  books.push({
    id:'b'+Date.now(), client:r.name, email:r.email,
    piece:`${r.style} — ${r.placement}`, artistId:'s1',
    date:firstDate, time:'12:00', hours:5,
    total:0, deposit:0, status:'upcoming', notes:`From request · ${r.story}`,
  });
  DB.saveBookings(books);
  r.status = 'scheduled';
  DB.saveRequests(reqs);
  toast(`${r.name} added to Upcoming`);
  location.hash = '#upcoming';
}

/* ---------- UPCOMING ---------- */
views.upcoming = () => {
  const books = DB.bookings().filter(b=>b.status==='upcoming')
    .sort((a,b)=>a.date.localeCompare(b.date));
  const wrap = h('div');
  if (!books.length){ wrap.append(emptyState('No upcoming sittings.')); return wrap; }

  wrap.append(h('div',{class:'card card__body--flush'},
    bookingTable(books, true)));
  return wrap;
};

/* ---------- COMPLETED ---------- */
views.completed = () => {
  const books = DB.bookings().filter(b=>b.status==='completed')
    .sort((a,b)=>b.date.localeCompare(a.date));
  const wrap = h('div');
  const earned = books.reduce((s,b)=>s+b.total,0);
  wrap.append(h('p',{class:'muted',style:'margin-bottom:18px;font-style:italic'},
    `${books.length} pieces finished · ${money(earned)} earned all-time.`));
  if (!books.length){ wrap.append(emptyState('No completed work yet.')); return wrap; }
  wrap.append(h('div',{class:'card card__body--flush'}, bookingTable(books, false)));
  return wrap;
};

function bookingTable(books, isUpcoming){
  const tbl = h('table',{class:'tbl'});
  tbl.append(h('thead',{}, h('tr',{},
    h('th',{},'Client'),
    h('th',{class:'hide-sm'},'Piece'),
    h('th',{},'Date'),
    h('th',{class:'hide-sm'},'Artist'),
    h('th',{class:'num'},'Hours'),
    h('th',{class:'num'},'Value'),
    h('th',{}, isUpcoming?'':'Status'))));
  const body = h('tbody');
  books.forEach(b => {
    const actionCell = isUpcoming
      ? h('td',{}, h('button',{class:'btn btn--sm btn--sage', onclick:()=>completeBooking(b.id)},
          svg('M5 12l5 5L20 7'),'Mark done'))
      : h('td',{}, statusPill('completed'));
    body.append(h('tr',{},
      h('td',{}, h('div',{class:'who'},
        h('div',{class:'ava'}, initials(b.client)),
        h('div',{}, h('div',{class:'tbl__name'}, b.client),
          h('div',{class:'tbl__meta'}, b.email||'')))),
      h('td',{class:'hide-sm'}, h('div',{}, b.piece),
        b.notes ? h('div',{class:'tbl__meta'}, b.notes.slice(0,46)) : null),
      h('td',{}, h('div',{}, fmtDay(b.date)),
        h('div',{class:'tbl__meta'}, b.time)),
      h('td',{class:'hide-sm'}, DB.staffName(b.artistId)),
      h('td',{class:'num'}, b.hours+'h'),
      h('td',{class:'num'}, b.total ? money(b.total) : h('span',{class:'muted'},'TBD')),
      actionCell));
  });
  tbl.append(body);
  return tbl;
}
function completeBooking(id){
  const books = DB.bookings();
  const b = books.find(x=>x.id===id); if(!b) return;
  b.status='completed';
  DB.saveBookings(books);
  // log balance payment
  const txns = DB.txns();
  const bal = (b.total||0)-(b.deposit||0);
  if (bal>0) txns.push({ id:b.id+'-bal', date:todayISO, type:'balance', label:`Balance — ${b.client}`, amount:bal, bookingId:b.id });
  DB.saveTxns(txns);
  toast(`${b.client} marked complete · ${money(bal)} logged`);
  render();
}

/* ---------- CALENDAR ---------- */
let calYear = TODAY.getFullYear(), calMonth = TODAY.getMonth();
views.calendar = () => {
  const books = DB.bookings();
  const wrap = h('div',{class:'cal-wrap'});
  const first = new Date(calYear, calMonth, 1);
  const startDow = first.getDay();
  const daysIn = new Date(calYear, calMonth+1, 0).getDate();

  wrap.append(h('div',{class:'cal-bar'},
    h('h3',{}, `${MON[calMonth]} ${calYear}`),
    h('div',{class:'cal-nav'},
      h('button',{onclick:()=>{ calMonth--; if(calMonth<0){calMonth=11;calYear--;} render(); }}, svg('M15 6L9 12l6 6')),
      h('button',{onclick:()=>{ calMonth=TODAY.getMonth(); calYear=TODAY.getFullYear(); render(); },title:'Today'}, svg('M12 4v16M4 12h16')),
      h('button',{onclick:()=>{ calMonth++; if(calMonth>11){calMonth=0;calYear++;} render(); }}, svg('M9 6l6 6-6 6')))));

  const head = h('div',{class:'cal-head'});
  DOW3.forEach(d => head.append(h('span',{}, d)));
  wrap.append(head);

  const grid = h('div',{class:'cal-grid'});
  for (let i=0;i<startDow;i++) grid.append(h('div',{class:'cal-cell cal-cell--out'}));
  for (let day=1;day<=daysIn;day++){
    const iso = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dow = new Date(calYear,calMonth,day).getDay();
    const cell = h('div',{class:'cal-cell'+(iso===todayISO?' cal-cell--today':'')});
    cell.append(h('div',{class:'cal-date'}, day));
    if (dow===0||dow===1) cell.append(h('div',{class:'cal-ev cal-ev--closed'},'Closed'));
    books.filter(b=>b.date===iso).forEach(b =>
      cell.append(h('div',{class:'cal-ev cal-ev--booking', title:`${b.client} · ${b.piece}`},
        `${b.time} ${b.client}`)));
    grid.append(cell);
  }
  wrap.append(grid);
  return wrap;
};

/* ---------- STAFF ---------- */
views.staff = () => {
  const staff = DB.staff();
  const books = DB.bookings();
  const wrap = h('div');
  wrap.append(h('p',{class:'muted',style:'margin-bottom:18px;font-style:italic'},
    'Artists & their weekly chair days. Availability on the public calendar is drawn from these schedules.'));
  const grid = h('div',{class:'staff-grid'});
  staff.forEach(s => {
    const mine = books.filter(b=>b.artistId===s.id);
    const upcoming = mine.filter(b=>b.status==='upcoming').length;
    const done = mine.filter(b=>b.status==='completed').length;
    const revenue = mine.filter(b=>b.status==='completed').reduce((sum,b)=>sum+b.total,0);
    const card = h('div',{class:'staff-card'},
      h('div',{class:'staff-card__top'},
        h('div',{class:'ava'}, initials(s.name)),
        h('div',{},
          h('div',{class:'staff-card__name'}, s.name),
          h('div',{class:'staff-card__role'}, s.role))),
      h('div',{class:'staff-stats'},
        h('div',{}, h('b',{},upcoming), h('span',{},'Upcoming')),
        h('div',{}, h('b',{},done), h('span',{},'Completed')),
        h('div',{}, h('b',{},money(revenue)), h('span',{},'Earned'))),
      h('div',{class:'kick',style:'margin-bottom:9px'},'Weekly chair days'),
      h('div',{class:'sched'},
        DOW3.map((d,i) => h('div',{class:'sched__day'+(s.days.includes(i)?' sched__day--on':'')}, d))));
    grid.append(card);
  });
  wrap.append(grid);
  return wrap;
};

/* ---------- ANALYTICS ---------- */
views.analytics = () => {
  const txns = DB.txns();
  const books = DB.bookings();
  const wrap = h('div');

  // revenue by month (last 6 months ending May 2026)
  const months = [];
  for (let i=5;i>=0;i--){
    const d = new Date(2026,4-i,1);
    months.push({ key:isoOf(d).slice(0,7), label:MON3[d.getMonth()] });
  }
  const revByMonth = months.map(m => ({
    ...m,
    income: txns.filter(t=>t.date.slice(0,7)===m.key && t.amount>0).reduce((s,t)=>s+t.amount,0),
  }));
  const maxRev = Math.max(...revByMonth.map(m=>m.income), 1);

  const completed = books.filter(b=>b.status==='completed');
  const totalRev = completed.reduce((s,b)=>s+b.total,0);
  const avgPiece = completed.length ? totalRev/completed.length : 0;
  const totalHours = completed.reduce((s,b)=>s+b.hours,0);

  wrap.append(h('div',{class:'stats'},
    statTile('All-time Revenue', money(totalRev), `${completed.length} pieces`),
    statTile('Avg. Piece Value', money(avgPiece), `${money(totalRev/Math.max(totalHours,1))}/hr effective`),
    statTile('Chair Hours', totalHours+'h', 'time under the needle'),
    statTile('This Month', money(revByMonth[5].income), 'May 2026'),
  ));

  // bar chart
  const chartCard = h('div',{class:'card section-gap'},
    h('div',{class:'card__head'}, h('h3',{},'Revenue · Last 6 Months')),
    h('div',{class:'card__body'}, revenueChart(revByMonth, maxRev)));
  wrap.append(chartCard);

  // style breakdown + artist split
  const byStyle = {};
  completed.forEach(b => {
    const key = b.piece.includes('portrait')||b.piece.includes('Portrait')||b.piece.includes('profile') ? 'Portraits'
      : b.piece.includes('Fine line')||b.piece.includes('ornament')||b.piece.includes('cross') ? 'Fine line & ornament'
      : b.piece.includes('skull')||b.piece.includes('moth')||b.piece.includes('Memento') ? 'Memento mori'
      : 'Religious & figural';
    byStyle[key] = (byStyle[key]||0)+1;
  });
  const styleRows = Object.entries(byStyle).sort((a,b)=>b[1]-a[1]);
  const styleMax = Math.max(...styleRows.map(r=>r[1]),1);

  const split = h('div',{class:'row section-gap'});
  split.append(
    h('div',{class:'card',style:'flex:1;min-width:280px'},
      h('div',{class:'card__head'}, h('h3',{},'Work by Type')),
      h('div',{class:'card__body'},
        h('div',{class:'breakdown'}, styleRows.map(([name,n]) =>
          h('div',{class:'breakdown__row'},
            h('div',{class:'breakdown__top'}, h('span',{},name), h('b',{},n)),
            h('div',{class:'breakdown__track'},
              h('div',{class:'breakdown__fill',style:`width:${n/styleMax*100}%`}))))))),
    h('div',{class:'card',style:'flex:1;min-width:280px'},
      h('div',{class:'card__head'}, h('h3',{},'Revenue by Artist')),
      h('div',{class:'card__body'}, artistSplit(completed))));
  wrap.append(split);
  return wrap;
};

function revenueChart(data, max){
  const W=680, H=240, padL=44, padB=34, padT=14;
  const chart = svgNode('svg',{class:'chart', viewBox:`0 0 ${W} ${H}`});
  // axis
  chart.append(svgNode('line',{class:'chart-axis',x1:padL,y1:H-padB,x2:W,y2:H-padB}));
  // gridlines + y labels
  for (let i=0;i<=3;i++){
    const y = padT + (H-padB-padT) * (i/3);
    const val = Math.round(max*(1-i/3));
    chart.append(svgNode('line',{class:'chart-axis',x1:padL,y1:y,x2:W,y2:y,opacity:i?'.4':'1'}));
    const t = svgNode('text',{x:padL-8,y:y+4,'text-anchor':'end','font-size':'10'});
    t.textContent = '$'+(val/1000).toFixed(1)+'k';
    chart.append(t);
  }
  const bandW = (W-padL)/data.length;
  data.forEach((m,i) => {
    const bh = (m.income/max) * (H-padB-padT);
    const x = padL + bandW*i + bandW*0.22;
    const bw = bandW*0.56;
    chart.append(svgNode('rect',{class:'bar',x,y:H-padB-bh,width:bw,height:Math.max(bh,1)}));
    const lbl = svgNode('text',{x:x+bw/2,y:H-padB+18,'text-anchor':'middle','font-size':'11'});
    lbl.textContent = m.label;
    chart.append(lbl);
    const val = svgNode('text',{x:x+bw/2,y:H-padB-bh-7,'text-anchor':'middle','font-size':'10',fill:'#B89968'});
    val.textContent = m.income ? '$'+(m.income/1000).toFixed(1)+'k' : '';
    chart.append(val);
  });
  return chart;
}
function artistSplit(completed){
  const staff = DB.staff();
  const rows = staff.map(s => ({
    name:s.name,
    rev:completed.filter(b=>b.artistId===s.id).reduce((sum,b)=>sum+b.total,0),
  })).filter(r=>r.rev>0).sort((a,b)=>b.rev-a.rev);
  const max = Math.max(...rows.map(r=>r.rev),1);
  return h('div',{class:'breakdown'}, rows.map(r =>
    h('div',{class:'breakdown__row'},
      h('div',{class:'breakdown__top'}, h('span',{},r.name), h('b',{},money(r.rev))),
      h('div',{class:'breakdown__track'},
        h('div',{class:'breakdown__fill',style:`width:${r.rev/max*100}%`})))));
}

/* ---------- ACCOUNTING ---------- */
views.accounting = () => {
  const txns = DB.txns().slice().sort((a,b)=>b.date.localeCompare(a.date));
  const wrap = h('div');
  const income = txns.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0);
  const expense = txns.filter(t=>t.amount<0).reduce((s,t)=>s+t.amount,0);
  const net = income+expense;

  wrap.append(h('div',{class:'stats'},
    statTile('Income · YTD', money(income), 'deposits + balances', 'up'),
    statTile('Expenses · YTD', money(-expense), 'rent, supplies, gear', 'down'),
    statTile('Net · YTD', money(net), net>=0?'in the black':'in the red', net>=0?'up':'down'),
  ));

  const tbl = h('table',{class:'tbl'});
  tbl.append(h('thead',{}, h('tr',{},
    h('th',{},'Date'),
    h('th',{},'Entry'),
    h('th',{class:'hide-sm'},'Type'),
    h('th',{class:'num'},'Amount'))));
  const body = h('tbody');
  txns.forEach(t => {
    body.append(h('tr',{},
      h('td',{}, fmtDate(t.date)),
      h('td',{}, t.label),
      h('td',{class:'hide-sm'},
        h('span',{class:'pill pill--'+(t.amount>0?'paid':'owing')}, t.type)),
      h('td',{class:'num led-amt '+(t.amount>0?'led-amt--in':'led-amt--out')},
        (t.amount>0?'+':'−') + money(Math.abs(t.amount)))));
  });
  tbl.append(body);
  wrap.append(h('div',{class:'card card__body--flush section-gap'},
    h('div',{class:'card__head'}, h('h3',{},'Ledger'),
      h('span',{class:'muted',style:'font-size:13px;font-style:italic'}, `${txns.length} entries`)),
    tbl));
  return wrap;
};

/* ---------- SETTINGS ---------- */
views.settings = () => {
  const s = DB.settings();
  const wrap = h('div');
  const form = h('form',{class:'card', onsubmit:e=>{
    e.preventDefault();
    const next = {...s};
    $$('[data-set]', form).forEach(inp => next[inp.dataset.set] = inp.value);
    DB.saveSettings(next);
    toast('Studio settings saved');
  }});
  form.append(
    h('div',{class:'card__head'}, h('h3',{},'Studio Settings')),
    h('div',{class:'card__body'},
      h('div',{class:'form-grid'},
        fld('Studio name','studio',s.studio),
        fld('Lead artist','artist',s.artist),
        fld('Booking email','email',s.email,'email'),
        fld('Phone','phone',s.phone),
        fld('Address','address',s.address),
        fld('Open hours','hours',s.hours),
        fld('Closed days','closedDays',s.closedDays),
        fld('Hourly rate ($)','hourly',s.hourly,'number'),
        fld('Deposit (%)','depositPct',s.depositPct,'number'),
        h('div',{class:'fld fld--wide'},
          h('button',{class:'btn btn--solid',type:'submit'}, svg('M5 12l5 5L20 7'),'Save settings'))),
      h('p',{class:'fld__hint',style:'margin-top:20px'},
        'Demo note — this panel stores data in your browser (localStorage). Connect a backend (Supabase, Airtable, a CMS) to make it shared across devices and staff.')));
  wrap.append(form);
  return wrap;
};
function fld(label, key, val, type='text'){
  return h('div',{class:'fld'+(type==='number'?'':'')},
    h('label',{}, label),
    h('input',{type, value:val==null?'':val, dataset:{set:key}}));
}

/* ---------- shared bits ---------- */
function statTile(label, value, sub, dir){
  return h('div',{class:'stat'},
    h('div',{class:'stat__label'}, label),
    h('div',{class:'stat__value'}, value),
    sub ? h('div',{class:'stat__sub'+(dir?' '+dir:'')}, sub) : null);
}
function statusPill(status){
  return h('span',{class:'pill pill--'+status}, status);
}
function emptyState(msg){
  return h('div',{class:'empty'},
    svg('M4 4h16v12H8l-4 4z','0 0 24 24',1.2),
    h('p',{}, msg));
}

/* =========================================================
   ROUTER
========================================================= */
const TITLES = {
  dashboard:['Dashboard','The studio at a glance'],
  requests:['Booking Requests','Incoming applications for the chair'],
  upcoming:['Upcoming Sittings','Confirmed work ahead'],
  completed:['Completed Work','The finished record'],
  calendar:['Calendar','Every sitting, consult and closure'],
  staff:['Staff & Scheduling','Artists and their chair days'],
  analytics:['Analytics','Revenue, hours and the shape of the work'],
  accounting:['Accounting','The ledger — income and expense'],
  settings:['Settings','Studio details and booking rules'],
};

function render(){
  const view = (location.hash.replace('#','') || 'dashboard');
  const name = views[view] ? view : 'dashboard';
  const [title, sub] = TITLES[name];

  $('#viewTitle').textContent = title;
  $('#viewSub').textContent = sub;
  $$('#nav a').forEach(a => a.classList.toggle('is-active', a.dataset.view===name));

  const host = $('#view');
  host.replaceChildren(views[name]());
  host.scrollTo?.(0,0);
  window.scrollTo(0,0);

  // sidebar counts
  const reqs = DB.requests().filter(r=>r.status==='new'||r.status==='reviewing').length;
  const ups  = DB.bookings().filter(b=>b.status==='upcoming').length;
  $('#cntRequests').textContent = reqs || '';
  $('#cntUpcoming').textContent = ups || '';

  document.body.classList.remove('nav-open');
}

/* =========================================================
   BOOT — opens straight to the dashboard (no gate; this is a demo)
========================================================= */
function boot(){
  DB.ensure();

  // topbar date
  $('#topDate').textContent = `${DOW3[TODAY.getDay()]} · ${MON3[TODAY.getMonth()]} ${TODAY.getDate()} ${TODAY.getFullYear()}`;

  addEventListener('hashchange', render);
  render();

  $('#menuToggle')?.addEventListener('click', ()=> document.body.classList.toggle('nav-open'));
  $('#scrim')?.addEventListener('click', ()=> document.body.classList.remove('nav-open'));
}

boot();

})();
