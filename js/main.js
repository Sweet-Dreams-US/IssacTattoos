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

/* ---------- relics: build the gallery grid ---------- */
const RELICS = [
  { src:'assets/img/relic-01.webp', title:'Madonna of the Forearm',  no:'PLATE I',    meta:'Black & grey realism · 9 hours · 2026', klass:'relic--xl relic--landscape' },
  { src:'assets/img/relic-02.webp', title:'The Sacred Heart',        no:'PLATE II',   meta:'Sternum · 6 hours · 2026',              klass:'relic--lg relic--portrait'  },
  { src:'assets/img/relic-03.webp', title:'The Patriarch',           no:'PLATE III',  meta:'Bicep portrait · full day · 2026',      klass:'relic--md relic--landscape' },
  { src:'assets/img/relic-04.webp', title:'Rosary, Hands, Light',    no:'PLATE IV',   meta:'Calf · 5 hours · 2026',                 klass:'relic--sm relic--portrait'  },
  { src:'assets/img/relic-05.webp', title:'Cross of Filigree',       no:'PLATE V',    meta:'Spine · fine line · 7 hours · 2025',    klass:'relic--sm relic--portrait'  },
  { src:'assets/img/relic-06.webp', title:'Lion of the Clouds',      no:'PLATE VI',   meta:'Neck → shoulder · 8 hours · 2025',      klass:'relic--md relic--landscape' },
  { src:'assets/img/relic-07.webp', title:'Memento on the Hand',     no:'PLATE VII',  meta:'Hand · dotwork · 4 hours · 2026',       klass:'relic--sm relic--square'    },
  { src:'assets/img/relic-08.webp', title:'Hours of the Studio',     no:'PLATE VIII', meta:'In session · documentary · 2026',       klass:'relic--lg relic--landscape' },
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

/* ---------- booking form ---------- */
(() => {
  const form = $('#bookingForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = form.reportValidity();
    if (!ok) return;
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
