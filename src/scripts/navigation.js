export function initNavigation() {
  const hdr = document.getElementById('hdr'), nav = document.getElementById('nav'), burger = document.getElementById('burger');
  const all = [...nav.querySelectorAll('a')], links = all.filter(a => !a.classList.contains('nav-cta')), mq = matchMedia('(max-width:1100px)');
  const set = open => {
    nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = open && mq.matches ? 'hidden' : ''; hdr.classList.remove('hide'); sync();
  };
  const sync = () => { nav.inert = mq.matches && !nav.classList.contains('open'); };
  burger.addEventListener('click', () => set(!nav.classList.contains('open')));
  all.forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); burger.focus(); } });
  nav.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !nav.classList.contains('open')) return;
    const f = [burger, ...all], i = f.indexOf(document.activeElement);
    if (e.shiftKey && i === 0) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); burger.focus(); }
  });
  mq.addEventListener('change', () => set(false)); sync();

  let last = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY; hdr.classList.toggle('solid', y > 24);
    if (!nav.classList.contains('open')) hdr.classList.toggle('hide', y > last + 6 && y > 500 ? true : y < last - 6 ? false : hdr.classList.contains('hide'));
    last = y;
  }, { passive: true });
  hdr.classList.toggle('solid', scrollY > 24);

  const map = new Map(links.filter(a => a.getAttribute('href').startsWith('#')).map(a => [document.querySelector(a.getAttribute('href')), a]));
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', map.get(en.target) === a)); }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, t) => t && io.observe(t));
}
