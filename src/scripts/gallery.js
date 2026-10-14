import { SHOTS, IMG } from './data.js';
export function initGallery() {
  const gal = document.getElementById('gal'), tabs = document.getElementById('gal-tabs'), lb = document.getElementById('lb');
  const img = document.getElementById('lb-img'), cap = document.getElementById('lb-cap'), num = document.getElementById('lb-n');
  gal.innerHTML = SHOTS.map((s, i) => `<button class="g" data-c="${s.cat}" data-t="${s.t}" style="--i:${i % 6}" aria-label="Открыть фото: ${s.t}"><img src="${IMG}${s.src}.webp" alt="${s.t}" width="${s.w}" height="${s.h}" loading="lazy"></button>`).join('');
  const all = [...gal.children]; let vis = all, i = 0, opener = null;
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-c]'); if (!b) return;
    tabs.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    all.forEach((g, n) => { const on = b.dataset.c === 'all' || g.dataset.c === b.dataset.c; g.hidden = !on; if (on) { g.style.animation = 'none'; g.offsetWidth; g.style.animation = ''; } });
    vis = all.filter(g => !g.hidden);
  });
  const show = n => { i = (n + vis.length) % vis.length; const s = vis[i].querySelector('img'); img.style.animation = 'none'; img.offsetWidth; img.style.animation = ''; img.src = s.currentSrc || s.src; img.alt = s.alt; cap.textContent = s.alt; num.textContent = `${i + 1} / ${vis.length}`; };
  gal.addEventListener('click', e => { const b = e.target.closest('.g'); if (!b) return; opener = b; vis = all.filter(g => !g.hidden); show(vis.indexOf(b)); lb.showModal(); });
  lb.querySelector('[data-lb-prev]').onclick = () => show(i - 1);
  lb.querySelector('[data-lb-next]').onclick = () => show(i + 1);
  lb.querySelector('[data-lb-close]').onclick = () => lb.close();
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  let x0 = null; lb.addEventListener('pointerdown', e => { x0 = e.clientX; });
  lb.addEventListener('pointerup', e => { if (x0 !== null && Math.abs(e.clientX - x0) > 60) show(i + (e.clientX < x0 ? 1 : -1)); x0 = null; });
  lb.addEventListener('close', () => opener && opener.focus({ preventScroll: true }));
}
