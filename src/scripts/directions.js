export function initDirections() {
  const tabs = [...document.querySelectorAll('#dirx [role=tab]')], panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  const sel = i => { tabs.forEach((t, n) => { t.setAttribute('aria-selected', n === i); t.tabIndex = n === i ? 0 : -1; panels[n].hidden = n !== i; }); };
  tabs.forEach((t, i) => t.addEventListener('click', () => sel(i)));
  document.getElementById('dirx').addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement); if (i < 0) return;
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
    e.preventDefault(); const n = (i + d + tabs.length) % tabs.length; sel(n); tabs[n].focus();
  });
}
