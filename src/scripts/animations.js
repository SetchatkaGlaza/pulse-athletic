export function initMotion() {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const bar = document.getElementById('progress'), mbar = document.getElementById('mbar'), hero = document.getElementById('top');
  const par = [...document.querySelectorAll('.hero-still, .hero-media, .cta>img')]; let ticking = false;
  const tick = () => {
    ticking = false; const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    mbar.classList.toggle('show', scrollY > hero.offsetHeight * .7);
    if (reduce) return;
    par.forEach(el => { const box = (el.closest('.hero, .cta') || el).getBoundingClientRect(); if (box.bottom < 0 || box.top > innerHeight) return; el.style.setProperty('--py', `${(box.top * -.12).toFixed(1)}px`); });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }, { passive: true }); tick();

  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  const fmt = n => n.toLocaleString('ru-RU');
  const cio = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; cio.unobserve(en.target);
    const to = +en.target.dataset.count; if (reduce) { en.target.textContent = fmt(to); return; }
    const t0 = performance.now(), d = 1600;
    const step = t => { const p = Math.min((t - t0) / d, 1), e = 1 - Math.pow(1 - p, 4); en.target.textContent = fmt(Math.round(to * e)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = '0'; cio.observe(el); });

  const vids = document.querySelectorAll('video');
  if (reduce) vids.forEach(v => { v.pause(); v.removeAttribute('autoplay'); v.hidden = true; });
  else vids.forEach(v => vo.observe(v));
}
const vo = new IntersectionObserver(es => es.forEach(en => { const v = en.target; if (en.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }), { threshold: .1 });
