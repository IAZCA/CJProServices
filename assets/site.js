/* CJ Pro Services test site: movement and interactions shared by all three designs. */
(() => {
  'use strict';
  const root = document.documentElement;
  const motion = root.dataset.motion === 'on';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const head = $('.site-head');
  const headH = () => (head ? head.offsetHeight : 0);
  const setHeadVar = () => root.style.setProperty('--head-h', headH() + 'px');
  setHeadVar();

  /* ---------- eased scrolling for in-page links ---------- */
  let auto = null;
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const endAuto = () => { auto = null; root.classList.remove('auto-scroll'); };
  const stopAuto = () => { if (auto) { auto.live = false; endAuto(); } };
  function scrollToY(y, done) {
    y = Math.max(0, Math.min(y, root.scrollHeight - innerHeight));
    stopAuto();
    const start = scrollY, dist = y - start;
    if (!motion || document.hidden || Math.abs(dist) < 2) { scrollTo(0, y); done && done(); return; }
    const dur = Math.min(1100, 420 + Math.abs(dist) * 0.22);
    const job = { live: true };
    auto = job;
    root.classList.add('auto-scroll');
    let t0 = null;
    const step = ts => {
      if (!job.live) return;
      if (t0 === null) t0 = ts;
      const p = Math.min(1, (ts - t0) / dur);
      scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
      else { endAuto(); done && done(); }
    };
    requestAnimationFrame(step);
  }
  ['wheel', 'touchstart'].forEach(ev => addEventListener(ev, stopAuto, { passive: true }));

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const toTop = id === '#top';
    const target = toTop ? null : document.getElementById(id.slice(1));
    if (!toTop && !target) return;
    e.preventDefault();
    closeMenu(false);
    if (head) head.classList.remove('hide');
    const y = toTop ? 0 : target.getBoundingClientRect().top + scrollY - headH() - 12;
    scrollToY(y, () => {
      history.replaceState(null, '', toTop ? location.pathname + location.search : location.search + id);
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    });
  });

  /* ---------- header, progress bar, back-to-top, parallax ---------- */
  const prog = $('.progress'), toTopBtn = $('.to-top');
  const para = motion ? $$('[data-parallax]') : [];
  let anchorY = scrollY, ticking = false;
  function onScroll() {
    const y = scrollY;
    const max = root.scrollHeight - innerHeight;
    if (prog) prog.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    if (head) {
      head.classList.toggle('scrolled', y > 8);
      const d = y - anchorY;
      if (y < 320) { head.classList.remove('hide'); anchorY = y; }
      else if (Math.abs(d) > 10) {
        if (!root.classList.contains('auto-scroll') && !root.classList.contains('menu-open')) head.classList.toggle('hide', d > 0);
        anchorY = y;
      }
    }
    if (toTopBtn) toTopBtn.classList.toggle('show', y > 700);
    for (const el of para) {
      if (y < innerHeight * 1.4) el.style.transform = `translate3d(0, ${(y * parseFloat(el.dataset.parallax)).toFixed(1)}px, 0)`;
    }
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); }
  }, { passive: true });
  onScroll();

  /* ---------- active menu item + sliding underline ---------- */
  const navLinks = $$('.nav a[href^="#"]');
  const drawerLinks = $$('.drawer-nav a[href^="#"]');
  const ind = $('.nav-ind');
  const byId = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
  let current = null;
  function moveInd() {
    if (!ind) return;
    const a = byId.get(current);
    if (!a || !a.offsetParent) { ind.classList.remove('on'); return; }
    const n = ind.parentElement.getBoundingClientRect(), r = a.getBoundingClientRect();
    ind.style.width = r.width + 'px';
    ind.style.transform = `translateX(${r.left - n.left}px)`;
    ind.classList.add('on');
  }
  function setActive(id) {
    current = id;
    const h = '#' + id;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === h));
    drawerLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === h));
    moveInd();
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) setActive(en.target.id); }),
      { rootMargin: '-42% 0px -55% 0px' });
    $$('main section[id]').forEach(s => io.observe(s));
  }

  /* ---------- scroll reveal ---------- */
  const targets = $$('[data-reveal], [data-stagger] > *');
  const settle = el => {
    const i = parseFloat(getComputedStyle(el).getPropertyValue('--i')) || 0;
    setTimeout(() => el.classList.add('settled'), 950 + i * 75);
  };
  if (!motion || !('IntersectionObserver' in window)) targets.forEach(el => el.classList.add('in', 'settled'));
  else {
    const rio = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      rio.unobserve(en.target);
      settle(en.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(el => rio.observe(el));
  }
  window.__siteReady = true;

  /* ---------- phone menu drawer ---------- */
  const menuBtn = $('.menu-btn'), drawer = $('.drawer');
  function openMenu() {
    root.classList.add('menu-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    if (drawer) { drawer.removeAttribute('inert'); setTimeout(() => { const c = $('.drawer-close', drawer); c && c.focus({ preventScroll: true }); }, 80); }
  }
  function closeMenu(refocus = true) {
    if (!root.classList.contains('menu-open')) return;
    root.classList.remove('menu-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (drawer) drawer.setAttribute('inert', '');
    if (refocus && menuBtn) menuBtn.focus({ preventScroll: true });
  }
  if (menuBtn) menuBtn.addEventListener('click', () => (root.classList.contains('menu-open') ? closeMenu() : openMenu()));
  const scrim = $('.scrim'); if (scrim) scrim.addEventListener('click', () => closeMenu());
  const dc = $('.drawer-close'); if (dc) dc.addEventListener('click', () => closeMenu());
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  const wide = matchMedia('(min-width: 960px)');
  const onWide = () => { if (wide.matches) closeMenu(false); };
  wide.addEventListener ? wide.addEventListener('change', onWide) : wide.addListener(onWide);

  /* ---------- tabs (Installations / Completed jobs) ---------- */
  const tabSets = $$('[data-tabs]').map(box => {
    const tabs = $$('[role="tab"]', box);
    const tind = $('.tab-ind', box);
    let sel = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
    const place = () => {
      if (!tind || !sel) return;
      tind.style.width = sel.offsetWidth + 'px';
      tind.style.transform = `translateX(${sel.offsetLeft}px)`;
    };
    const select = (t, focus) => {
      sel = t;
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls'));
        if (!p) return;
        const was = !p.hidden;
        p.hidden = !on;
        if (on && !was) { p.classList.remove('panel-in'); void p.offsetWidth; p.classList.add('panel-in'); }
      });
      place();
      if (focus) t.focus();
      document.dispatchEvent(new Event('panelshown'));
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        select(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
      });
    });
    select(sel);
    return place;
  });

  /* ---------- swipe carousels with arrow buttons ---------- */
  $$('[data-carousel]').forEach(c => {
    const track = $('.track', c);
    if (!track) return;
    const prev = $('.prev', c), next = $('.next', c);
    const count = $('.car-count', c), bar = $('.car-bar i', c);
    const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = () => { const card = track.firstElementChild; return card ? card.getBoundingClientRect().width + gap() : 0; };
    const by = dir => {
      const w = step() || track.clientWidth * 0.8;
      track.scrollBy({ left: dir * w, behavior: motion ? 'smooth' : 'auto' });
    };
    const upd = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft < 4;
      if (next) next.disabled = track.scrollLeft > max - 4;
      const s = step(), total = track.children.length;
      if (!s || !total) return;
      const cs = getComputedStyle(track);
      const inner = track.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
      const seen = Math.max(1, Math.min(total, Math.round((inner + gap()) / s)));
      let first = Math.round(track.scrollLeft / s) + 1;
      if (track.scrollLeft >= max - 4) first = total - seen + 1;
      first = Math.max(1, Math.min(first, total - seen + 1));
      const last = first + seen - 1;
      if (count) count.textContent = seen > 1 ? `${first}–${last} of ${total}` : `${first} of ${total}`;
      if (bar) {
        const f = Math.min(1, track.clientWidth / track.scrollWidth);
        bar.style.width = (f * 100) + '%';
        bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * ((1 - f) / f) * 100 : 0}%)`;
      }
    };
    if (prev) prev.addEventListener('click', () => by(-1));
    if (next) next.addEventListener('click', () => by(1));
    track.addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    document.addEventListener('panelshown', upd);
    addEventListener('load', upd);
    upd();
  });

  /* ---------- photo viewer: tap a job photo to see it bigger ---------- */
  const lb = $('#lightbox');
  if (lb && typeof lb.showModal === 'function') {
    const stage = $('.lb-stage', lb), lbImg = $('img', stage), lbCap = $('.lb-cap', lb), lbCount = $('.lb-count', lb);
    let set = [], cur = 0, swiped = false;
    const anim = cls => {
      lbImg.classList.remove('lb-pop', 'lb-from-r', 'lb-from-l');
      void lbImg.offsetWidth;
      lbImg.classList.add(cls);
    };
    const show = (i, dir) => {
      if (!set.length) return;
      cur = (i + set.length) % set.length;
      const a = set[cur], thumb = $('img', a), cap = a.closest('figure') && $('figcaption', a.closest('figure'));
      const want = cur;
      lbImg.alt = thumb ? thumb.alt : '';
      lbImg.src = thumb ? (thumb.currentSrc || thumb.src) : a.href;   // already loaded: shows at once
      const full = new Image();
      full.onload = () => { if (want === cur && lb.open) lbImg.src = a.href; };
      full.src = a.href;
      lbCap.replaceChildren(...(cap ? [...cap.cloneNode(true).childNodes] : []));
      lbCount.textContent = `${cur + 1} / ${set.length}`;
      anim(dir > 0 ? 'lb-from-r' : dir < 0 ? 'lb-from-l' : 'lb-pop');
      [1, -1].forEach(d => { const n = set[(cur + d + set.length) % set.length]; if (n) new Image().src = n.href; });
    };
    const open = a => {
      set = $$('[data-lb]', a.closest('.track') || document);
      root.classList.add('lb-open');
      lb.showModal();
      show(Math.max(0, set.indexOf(a)), 0);
    };
    lb.addEventListener('close', () => {
      root.classList.remove('lb-open');
      const a = set[cur];
      if (!a) return;
      const track = a.closest('.track'), shot = a.closest('.shot');
      if (track && shot) {   // keep the carousel on the photo you ended on
        const tr = track.getBoundingClientRect(), sr = shot.getBoundingClientRect();
        if (sr.left < tr.left || sr.right > tr.right) track.scrollBy({ left: sr.left - tr.left - (parseFloat(getComputedStyle(track).paddingLeft) || 0), behavior: 'auto' });
      }
      a.focus({ preventScroll: true });
    });
    $$('[data-lb]').forEach(a => a.addEventListener('click', e => {
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;   // let "open in new tab" through
      e.preventDefault();
      open(a);
    }));
    $('.lb-prev', lb).addEventListener('click', () => show(cur - 1, -1));
    $('.lb-next', lb).addEventListener('click', () => show(cur + 1, 1));
    $('.lb-close', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => {
      if (swiped) { swiped = false; return; }
      if (e.target === lb || e.target === stage) lb.close();
    });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1, 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1, -1); }
    });
    let sx = null, sy = 0;
    stage.addEventListener('pointerdown', e => { if (e.isPrimary) { sx = e.clientX; sy = e.clientY; swiped = false; } });
    stage.addEventListener('pointerup', e => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) { swiped = true; show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); }
    });
    stage.addEventListener('pointercancel', () => { sx = null; });
  }

  /* ---------- soft glow that follows the pointer on cards ---------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('[data-glow]').forEach(el => el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));
  }

  /* ---------- toast + test form ---------- */
  const toast = $('.toast');
  let tt;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove('show'), 4500);
  }
  $$('form[data-demo]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Thanks! This is a test site, so the form is not connected yet.');
    f.reset();
  }));

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  // keep ?motion=... on links between the designs
  if (location.search) $$('a[data-keep-q]').forEach(a => { a.href = a.getAttribute('href') + location.search; });

  /* ---------- re-measure on resize / font load ---------- */
  const remeasure = () => { setHeadVar(); moveInd(); tabSets.forEach(f => f()); };
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(remeasure, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  addEventListener('load', remeasure);
})();
