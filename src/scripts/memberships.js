import { PLANS, PERIODS } from './data.js';
const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/\u00a0/g, '\u202f');
export function initMemberships(booking) {
  const period = document.getElementById('period'); let k = 1;
  function paint() {
    const p = PERIODS[k];
    document.querySelectorAll('.plan').forEach(el => {
      const base = PLANS[el.dataset.plan], m = base * (1 - p.off);
      el.querySelector('b').textContent = fmt(m);
      el.querySelector('s').textContent = p.off ? `${fmt(base)} ₽` : '';
      el.querySelector('.total').textContent = k > 1 ? `Итого ${fmt(m * k)} ₽ за ${p.label}` : 'Оплата помесячно';
    });
    period.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', +b.dataset.k === k));
  }
  period.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) { k = +b.dataset.k; paint(); } });
  period.addEventListener('keydown', e => {
    const bs = [...period.querySelectorAll('button')], i = bs.findIndex(b => +b.dataset.k === k), d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (d) { e.preventDefault(); const n = bs[(i + d + 3) % 3]; k = +n.dataset.k; paint(); n.focus(); }
  });
  document.querySelectorAll('[data-pick-plan]').forEach(b => b.addEventListener('click', () => {
    const plan = b.dataset.pickPlan;
    document.querySelectorAll('.plan').forEach(p => p.classList.toggle('sel', p.dataset.plan === plan));
    booking.open({ plan, format: plan === 'PRO' ? 'personal' : plan === 'ACTIVE' ? 'group' : 'trial', pick: `Тариф ${plan} · ${PERIODS[k].label}` });
  }));
  const cb = document.getElementById('cmp-btn');
  cb.addEventListener('click', () => { const o = cb.getAttribute('aria-expanded') === 'true'; cb.setAttribute('aria-expanded', String(!o)); });
  paint();
}
