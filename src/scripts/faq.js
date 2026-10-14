export function initFaq() {
  const root = document.getElementById('faq-list'), btns = [...root.querySelectorAll('button')];
  btns.forEach(b => b.addEventListener('click', () => b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true'))));
  root.addEventListener('keydown', e => {
    const i = btns.indexOf(document.activeElement); if (i < 0) return;
    const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: btns.length - 1 }[e.key]; if (to === undefined) return;
    e.preventDefault(); btns[(to + btns.length) % btns.length].focus();
  });
}
