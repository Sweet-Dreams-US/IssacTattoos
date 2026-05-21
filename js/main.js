/* =========================================================
   RELIQUARY · main.js
   No framework. No build step. Just rituals.
========================================================= */

const $  = (q, c=document) => c.querySelector(q);
const $$ = (q, c=document) => [...c.querySelectorAll(q)];
const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

const el = (tag, props={}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else if (k === 'data') Object.entries(v).forEach(([dk,dv]) => n.dataset[dk] = dv);
    else if (k === 'text') n.textContent = v;
    else if (k in n) n[k] = v;
    else n.setAttribute(k, v);
  }
  kids.flat().forEach(k => n.appendChild(typeof k === 'string' ? document.createTextNode(k) : k));
  return n;
};

/* ---------- theme: load early so no flash. Light parchment is the brand default. ---------- */
(() => {
  let saved = null;
  try { saved = localStorage.getItem('reliquary-theme'); } catch {}
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

/* ---------- loader ---------- */
window.addEventListener('load', () => {
  const start = performance.now();
  const minHold = 1800;
  const release = () => {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
  };
  const left = Math.max(0, minHold - (performance.now() - start));
  setTimeout(release, left);
});

/* ---------- theme toggle (light is default; dark is opt-in) ---------- */
(() => {
  const btn = $('[data-theme-toggle]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    if (next === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('reliquary-theme', next); } catch {}
  });
})();

/* ---------- custom cursor ---------- */
(() => {
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine) return;

  const cur = $('.cursor');
  const dot = $('.cursor__dot');
  const ring = $('.cursor__ring');

  let mx = innerWidth/2, my = innerHeight/2;
  let dx = mx, dy = my, rx = mx, ry = my;

  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  addEventListener('mousedown', () => cur.classList.add('is-down'));
  addEventListener('mouseup',   () => cur.classList.remove('is-down'));

  const linkSel = 'a, button, .relic, [data-cursor="link"], input[type=submit], input[type=checkbox], select';
  addEventListener('mouseover', e => {
    if (e.target.closest(linkSel)) cur.classList.add('is-link');
  });
  addEventListener('mouseout', e => {
    if (e.target.closest(linkSel)) cur.classList.remove('is-link');
  });

  function tick() {
    dx += (mx - dx) * 0.55;
    dy += (my - dy) * 0.55;
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform  = `translate(${dx}px, ${dy}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---------- nav: stuck state on scroll ---------- */
(() => {
  const nav = $('#nav');
  const apply = () => nav.classList.toggle('is-stuck', scrollY > 28);
  apply();
  addEventListener('scroll', apply, { passive:true });
})();

/* ---------- mobile menu ---------- */
(() => {
  const btn = $('.nav__menu');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open);
  });
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', false);
  }));
})();

/* ---------- hero parallax on mouse ---------- */
(() => {
  if (reduced) return;
  const altar = $('.hero__altar');
  const orns = $$('.orn');
  if (!altar) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;

  addEventListener('mousemove', e => {
    const w = innerWidth, h = innerHeight;
    tx = (e.clientX / w - 0.5) * 24;
    ty = (e.clientY / h - 0.5) * 24;
  }, { passive:true });

  function tick() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    altar.style.transform = `translate(calc(-50% + ${cx*0.6}px), calc(-50% + ${cy*0.6}px))`;
    orns.forEach((o,i) => {
      const f = (i+1) * 0.4;
      o.style.transform = `translate(${cx*f}px, ${cy*f}px)`;
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---------- relics: Isaac Roque's actual work ---------- */
const RELICS = [
  { src:'assets/img/isaac-10.webp', title:'Lion of Judah',            no:'PLATE I',    meta:'Christ & lion · upper arm · 16 hrs',         klass:'relic--lg relic--portrait'   },
  { src:'assets/img/isaac-13.webp', title:'The End of War',           no:'PLATE II',   meta:'Back piece · 32 hrs · 2025',                  klass:'relic--xl relic--landscape'  },
  { src:'assets/img/isaac-08.webp', title:'Ecce Homo',                no:'PLATE III',  meta:'Christ profile · upper arm · 14 hrs',         klass:'relic--md relic--portrait'   },
  { src:'assets/img/isaac-12.webp', title:'The Patriarchs',           no:'PLATE IV',   meta:'Kings & elders · chest piece · 22 hrs',       klass:'relic--lg relic--landscape'  },
  { src:'assets/img/isaac-17.webp', title:'The Chieftain',            no:'PLATE V',    meta:'Headdress portrait · upper arm · 14 hrs',     klass:'relic--md relic--portrait'   },
  { src:'assets/img/isaac-16.webp', title:'Hour of the Reaper',       no:'PLATE VI',   meta:'Hooded death · back piece · 19 hrs',          klass:'relic--md relic--portrait'   },
  { src:'assets/img/isaac-14.webp', title:'Memento Mori',             no:'PLATE VII',  meta:'Skull · calf · 8 hrs',                        klass:'relic--sm relic--portrait'   },
  { src:'assets/img/isaac-07.webp', title:'Madonna del Silencio',     no:'PLATE VIII', meta:'Virgin in prayer · forearm · 11 hrs',         klass:'relic--md relic--portrait'   },
  { src:'assets/img/isaac-03.webp', title:'Fides',                    no:'PLATE IX',   meta:'Christ & three crosses · half sleeve · 18 hrs', klass:'relic--lg relic--portrait' },
  { src:'assets/img/isaac-18.webp', title:'The Officer',              no:'PLATE X',    meta:'Naval portrait · half sleeve · 13 hrs',       klass:'relic--md relic--portrait'   },
  { src:'assets/img/isaac-15.webp', title:'God Above',                no:'PLATE XI',   meta:'Script lettering · forearm · 6 hrs',          klass:'relic--sm relic--portrait'   },
  { src:'assets/img/isaac-11.webp', title:'The Stairway',             no:'PLATE XII',  meta:'Heaven & doves · sleeve · 24 hrs',            klass:'relic--md relic--portrait'   },
  { src:'assets/img/isaac-05.webp', title:'The Watcher in the Pines', no:'PLATE XIII', meta:'Wolf & forest · thigh · 13 hrs',              klass:'relic--md relic--portrait'   },
  { src:'assets/img/isaac-09.webp', title:'The Slugger',              no:'PLATE XIV',  meta:'Baseball portrait · forearm · 7 hrs',         klass:'relic--sm relic--portrait'   },
];

(() => {
  const grid = $('#worksGrid');
  if (!grid) return;

  RELICS.forEach((r, i) => {
    const card = el('article', { class:`relic ${r.klass} fadein`, data:{ index:i } },
      el('div', { class:'relic__media' },
        el('img', { src:r.src, alt:r.title, loading:'lazy' })
      ),
      el('div', { class:'relic__frame' }),
      el('div', { class:'relic__plate' },
        el('span', { class:'kicker', text:r.no }),
        el('h3', { class:'relic__title', text:r.title }),
        el('span', { class:'relic__meta', text:r.meta }),
      ),
    );
    grid.appendChild(card);
  });

  /* lightbox */
  const lbImg   = el('img', { alt:'' });
  const lbKick  = el('span', { class:'kicker' });
  const lbTitle = el('h4');
  const lbClose = el('button', { class:'lightbox__close', 'aria-label':'Close' }, '✕');
  const lb = el('div', { class:'lightbox' },
    lbClose,
    el('div', { class:'lightbox__frame' },
      lbImg,
      el('div', { class:'lightbox__plate' }, lbKick, lbTitle),
    ),
  );
  document.body.appendChild(lb);

  const open = i => {
    const r = RELICS[i];
    lbImg.src = r.src;
    lbImg.alt = r.title;
    lbKick.textContent = `${r.no} · ${r.meta}`;
    lbTitle.textContent = r.title;
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  grid.addEventListener('click', e => {
    const card = e.target.closest('.relic');
    if (!card) return;
    open(+card.dataset.index);
  });
  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ---------- intersection observer for fadein ---------- */
(() => {
  const targets = $$('.fadein, .creed, .step, .visit__card, .section-head, .flash-card');
  targets.forEach(t => t.classList.add('fadein'));
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold:.1, rootMargin:'-50px 0px' });
  targets.forEach(t => io.observe(t));
})();

/* ---------- depth field parallax (5 layers, smooth lerp) ---------- */
(() => {
  if (reduced) return;

  const arts = $$('.depth__art');
  if (!arts.length) return;

  // capture each art's own starting top in viewport-relative px and rotation
  const items = arts.map(el => {
    const speed = parseFloat(el.dataset.speed) || 0.2;
    const baseRot = parseFloat(el.dataset.rot) || 0;
    return { el, speed, baseRot, py: 0, target: 0, rot: baseRot, rotTarget: baseRot };
  });

  let scrollY_ = scrollY;
  addEventListener('scroll', () => { scrollY_ = scrollY; }, { passive:true });

  // mouse-driven gentle parallax in X for an extra dimension
  // (touch devices never fire mousemove, so mxC/myC stay 0 — zero overhead)
  const hasFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  let mxN = 0, myN = 0;  // normalized -0.5..0.5
  let mxC = 0, myC = 0;
  if (hasFinePointer){
    addEventListener('mousemove', e => {
      mxN = (e.clientX / innerWidth - 0.5);
      myN = (e.clientY / innerHeight - 0.5);
    }, { passive:true });
  }

  function tick(){
    // ease the mouse offset (skipped if zero — no harm to compute)
    mxC += (mxN - mxC) * 0.05;
    myC += (myN - myC) * 0.05;

    items.forEach(it => {
      // each layer's base translateY = -scrollY * (1 - speed) so far layers stay almost still
      // but we ALSO want some movement for the parallax effect
      it.target = -scrollY_ * (1 - it.speed);
      it.py += (it.target - it.py) * 0.10;

      // small rotation drift based on scroll position
      it.rotTarget = it.baseRot + (scrollY_ * 0.005 * (1 - it.speed)) * (it.baseRot >= 0 ? 1 : -1);
      it.rot += (it.rotTarget - it.rot) * 0.06;

      // small mouse-driven X (closer layers move more with mouse — 0 on touch)
      const xOff = mxC * 30 * it.speed;
      const yOff = myC * 14 * it.speed;

      // write to CSS vars consumed by transform
      it.el.style.setProperty('--py', `${it.py + yOff}px`);
      it.el.style.setProperty('--r', `${it.rot}deg`);
      it.el.style.setProperty('--s', '1');
      // transform composition is in CSS, but we also nudge X via translate
      it.el.style.transform = `translate3d(calc(-50% + ${xOff}px), ${it.py + yOff}px, 0) rotate(${it.rot}deg)`;
    });

    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---------- 3D card tilt on mouse (creed, step, flash, visit, relic) ---------- */
(() => {
  if (reduced) return;
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine) return;

  const cards = $$('.creed, .step, .visit__card, .flash-card, .relic, .interlude__media');
  cards.forEach(c => {
    c.style.willChange = 'transform';
    c.style.transformStyle = 'preserve-3d';
    let raf = 0, rx = 0, ry = 0, txTarget = 0, tyTarget = 0;

    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      // tilt up-down based on cursor Y, left-right based on cursor X
      tyTarget = (px - 0.5) * 8;   // rotateY
      txTarget = -(py - 0.5) * 6;  // rotateX
      if (!raf) raf = requestAnimationFrame(loop);
    });
    c.addEventListener('mouseleave', () => { txTarget = 0; tyTarget = 0; });

    function loop(){
      rx += (txTarget - rx) * 0.12;
      ry += (tyTarget - ry) * 0.12;
      c.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      if (Math.abs(rx - txTarget) > 0.02 || Math.abs(ry - tyTarget) > 0.02) {
        raf = requestAnimationFrame(loop);
      } else {
        c.style.transform = '';
        raf = 0;
      }
    }
  });
})();

/* ---------- magnetic buttons (subtle pull toward cursor) ---------- */
(() => {
  if (reduced) return;
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine) return;
  const targets = $$('.btn, .nav__cta, .nav__theme, .link-arrow');
  targets.forEach(t => {
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const inner = t.querySelector('.btn__label') || t.firstElementChild || t;
    t.style.willChange = 'transform';
    t.addEventListener('mousemove', e => {
      const r = t.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width/2));
      const dy = (e.clientY - (r.top + r.height/2));
      tx = dx * 0.18;
      ty = dy * 0.22;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    t.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      t.style.transform = `translate(${cx}px, ${cy}px)`;
      if (Math.abs(tx-cx) > 0.1 || Math.abs(ty-cy) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        t.style.transform = '';
        raf = 0;
      }
    };
  });
})();

/* ---------- staggered reveal delays ---------- */
(() => {
  $$('.manifesto__grid .creed').forEach((c,i) => c.style.transitionDelay = (i*.08)+'s');
  $$('.process__list .step').forEach((c,i) => c.style.transitionDelay = (i*.08)+'s');
  $$('.visit__grid .visit__card').forEach((c,i) => c.style.transitionDelay = (i*.08)+'s');
  $$('.works__grid .relic').forEach((c,i) => c.style.transitionDelay = (i*.06)+'s');
})();

/* ---------- booking calendar ---------- */
(() => {
  const root = $('#cal');
  if (!root) return;

  const monthsEl  = $('#calMonths', root);
  const labelEl   = $('#calMonthLabel', root);
  const chipsEl   = $('#calChips', root);
  const hiddenEl  = $('#calHiddenDates', root);
  const prevBtn   = $('[data-cal-prev]', root);
  const nextBtn   = $('[data-cal-next]', root);

  const MAX_DATES = 3;
  const WEEKDAYS  = ['S','M','T','W','T','F','S'];
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // Reliquary house rules — Sun (0) and Mon (1) are closed for drawing days
  const CLOSED_DOW = new Set([0, 1]);

  // Deterministic pseudo-booked / on-hold dates (so demo looks realistic).
  // Hash the date to a stable status. ~30% of open days are booked, ~12% on hold.
  function statusFor(date){
    const today = new Date(); today.setHours(0,0,0,0);
    const d = new Date(date); d.setHours(0,0,0,0);
    if (d < today) return 'past';
    if (CLOSED_DOW.has(d.getDay())) return 'closed';
    // simple hash: y*372 + m*31 + day
    const h = (d.getFullYear() * 372) + (d.getMonth() * 31) + d.getDate();
    const r = (h * 9301 + 49297) % 233280 / 233280;  // [0,1)
    if (r < 0.30) return 'booked';
    if (r < 0.42) return 'hold';
    return 'open';
  }

  const isoDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const fmtChip = d => `${MONTH_NAMES[d.getMonth()].slice(0,3).toUpperCase()} ${d.getDate()}`;

  // STATE
  const today = new Date(); today.setHours(0,0,0,0);
  let viewYear  = today.getFullYear();
  let viewMonth = today.getMonth();          // 0-11
  const selected = new Set();                // ISO date strings

  function buildMonth(year, month){
    const block = el('div', { class:'cal__month-block' });
    const monthDate = new Date(year, month, 1);
    const monthLabel = `${MONTH_NAMES[month]} ${year}`;
    block.appendChild(el('div', { class:'cal__month-block-label', text: monthLabel }));

    const wd = el('div', { class:'cal__weekdays' });
    WEEKDAYS.forEach(d => wd.appendChild(el('span', { text:d })));
    block.appendChild(wd);

    const grid = el('div', { class:'cal__grid' });
    const startDow = monthDate.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // leading filler cells
    for (let i = 0; i < startDow; i++) {
      grid.appendChild(el('span', { class:'cal__day cal__day--filler' }));
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const status = statusFor(date);
      const iso = isoDate(date);
      const cell = el('button', {
        type:'button',
        class:`cal__day cal__day--${status}`,
        'aria-label':`${MONTH_NAMES[month]} ${day} — ${status}`,
        text: String(day),
      });
      cell.dataset.iso = iso;
      cell.dataset.status = status;
      if (status === 'past' || status === 'closed' || status === 'booked'){
        cell.disabled = true;
      } else {
        cell.addEventListener('click', () => toggleDate(iso));
      }
      if (selected.has(iso)) cell.classList.add('cal__day--selected');
      grid.appendChild(cell);
    }
    block.appendChild(grid);
    return block;
  }

  function render(){
    monthsEl.replaceChildren();
    monthsEl.appendChild(buildMonth(viewYear, viewMonth));
    const next = new Date(viewYear, viewMonth + 1, 1);
    monthsEl.appendChild(buildMonth(next.getFullYear(), next.getMonth()));
    labelEl.textContent = `${MONTH_NAMES[viewMonth].slice(0,3).toUpperCase()} – ${MONTH_NAMES[next.getMonth()].slice(0,3).toUpperCase()} ${next.getFullYear()}`;
    // disable prev when at current month
    const atToday = (viewYear === today.getFullYear() && viewMonth === today.getMonth());
    prevBtn.disabled = atToday;
    renderChips();
  }

  function renderChips(){
    chipsEl.replaceChildren();
    if (selected.size === 0){
      chipsEl.appendChild(el('span', { class:'cal__hint', text:'— pick up to 3 —' }));
    } else {
      const sorted = [...selected].sort();
      sorted.forEach(iso => {
        const [y,m,d] = iso.split('-').map(Number);
        const date = new Date(y, m-1, d);
        const chip = el('span', { class:'cal__chip' }, fmtChip(date));
        const x = el('button', { type:'button', class:'cal__chip-x', 'aria-label':`Remove ${fmtChip(date)}` }, '✕');
        x.addEventListener('click', () => toggleDate(iso));
        chip.appendChild(x);
        chipsEl.appendChild(chip);
      });
    }
    hiddenEl.value = [...selected].sort().join(', ');
    if (hiddenEl.value) hiddenEl.setCustomValidity('');
  }

  function toggleDate(iso){
    if (selected.has(iso)) {
      selected.delete(iso);
    } else {
      if (selected.size >= MAX_DATES) {
        // remove the oldest selection to make room
        const first = [...selected][0];
        selected.delete(first);
      }
      selected.add(iso);
    }
    render();
  }

  prevBtn.addEventListener('click', () => {
    const next = new Date(viewYear, viewMonth - 1, 1);
    if (next < new Date(today.getFullYear(), today.getMonth(), 1)) return;
    viewYear  = next.getFullYear();
    viewMonth = next.getMonth();
    render();
  });
  nextBtn.addEventListener('click', () => {
    const next = new Date(viewYear, viewMonth + 1, 1);
    viewYear  = next.getFullYear();
    viewMonth = next.getMonth();
    render();
  });

  render();
})();

/* ---------- booking form submit ---------- */
(() => {
  const form    = $('#bookingForm');
  if (!form) return;
  const hidden  = $('#calHiddenDates');

  form.addEventListener('submit', e => {
    e.preventDefault();
    // require at least one date selected
    if (hidden && !hidden.value){
      hidden.setCustomValidity('Please pick at least one preferred date.');
      // bring the calendar into view + highlight
      const cal = $('#cal');
      cal.classList.add('cal--invalid');
      cal.scrollIntoView({ behavior:'smooth', block:'center' });
      setTimeout(() => cal.classList.remove('cal--invalid'), 1600);
      form.reportValidity();
      return;
    }
    const ok = form.reportValidity();
    if (!ok) return;

    /* persist the request so it lands in the studio panel (admin/) — same
       browser only; swap localStorage for a backend POST to go cross-device */
    try {
      const val = id => (document.getElementById(id)?.value || '').trim();
      const KEY = 'reliquary.requests';
      const reqs = JSON.parse(localStorage.getItem(KEY) || '[]');
      reqs.unshift({
        id: 'r' + Date.now(),
        name: val('bf-name') || 'Unnamed',
        email: val('bf-email'),
        placement: val('bf-placement') || '—',
        style: val('bf-style'),
        story: val('bf-story') || '—',
        dates: hidden && hidden.value ? hidden.value.split(',').map(s => s.trim()) : [],
        status: 'new',
        created: new Date().toISOString().slice(0, 10),
      });
      localStorage.setItem(KEY, JSON.stringify(reqs));
    } catch {}

    form.querySelectorAll('input,select,textarea,button').forEach(node => node.disabled = true);
    $('#bookingSignoff').hidden = false;
  });
})();

/* ---------- subtle altar fade on scroll ---------- */
(() => {
  if (reduced) return;
  const altar = $('.hero__altar');
  if (!altar) return;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (y > innerHeight) return;
    altar.style.opacity = Math.max(0, 0.34 - y * 0.0006);
  }, { passive:true });
})();

/* ---------- smooth scroll with offset for fixed nav ---------- */
(() => {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const t = document.querySelector(href);
      if (!t) return;
      e.preventDefault();
      const offset = 80;
      const top = t.getBoundingClientRect().top + scrollY - offset;
      scrollTo({ top, behavior:'smooth' });
    });
  });
})();
