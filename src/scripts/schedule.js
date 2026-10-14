import { TYPES, WEEK, COACH } from './data.js';
const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], WDN = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const pad = n => String(n).padStart(2, '0'), iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hash = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967295; };
const endT = (s, d) => { const [h, m] = s.split(':').map(Number), t = h * 60 + m + d; return `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`; };
const plural = (n, a) => a[n % 100 > 10 && n % 100 < 15 ? 2 : [2, 0, 1, 1, 1, 2][Math.min(n % 10, 5)]];

export function initSchedule(booking) {
  const daysEl = document.getElementById('days'), chipsEl = document.getElementById('chips'), list = document.getElementById('sched'), sum = document.getElementById('sch-sum');
  const now = new Date(), dates = [...Array(7)].map((_, i) => { const d = new Date(now); d.setDate(now.getDate() + i); return d; });
  const booked = new Set(); let day = 0, filter = 'all';
  const wd = d => (d.getDay() + 6) % 7;
  const classes = i => WEEK[wd(dates[i])].map((c, k) => {
    const [type, name, start, dur, coach, level, cap] = c, id = `${iso(dates[i])}-${k}`;
    const taken = cap === 1 ? (hash(id) > .7 ? 1 : 0) : Math.min(cap, Math.round(cap * (.15 + hash(id) * .9)));
    const [h, m] = start.split(':').map(Number), at = new Date(dates[i]); at.setHours(h, m, 0, 0);
    return { id, type, name, start, dur, coach, level, cap, taken, at, past: at < now };
  }).sort((a, b) => a.at - b.at);

  daysEl.innerHTML = dates.map((d, i) => `<button role="tab" id="day-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" aria-controls="sched" data-d="${i}">${WD[wd(d)]}<b>${d.getDate()}</b><small>${i === 0 ? 'сегодня' : i === 1 ? 'завтра' : ''}</small></button>`).join('');
  chipsEl.innerHTML = [['all', 'Все'], ...Object.entries(TYPES)].map(([k, v]) => `<button data-f="${k}" aria-pressed="${k === filter}">${v}</button>`).join('');

  function render() {
    daysEl.querySelectorAll('button').forEach(b => { const on = +b.dataset.d === day; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    chipsEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.f === filter));
    list.setAttribute('aria-labelledby', `day-${day}`);
    const items = classes(day).filter(c => filter === 'all' || c.type === filter);
    const free = items.filter(c => !c.past && c.cap > 1).reduce((a, c) => a + Math.max(0, c.cap - c.taken - (booked.has(c.id) ? 1 : 0)), 0);
    sum.textContent = items.length ? `${items.length} ${plural(items.length, ['занятие', 'занятия', 'занятий'])}${free ? ` · свободно ${free} ${plural(free, ['место', 'места', 'мест'])} в группах` : ''}` : '';
    list.innerHTML = items.length ? items.map((c, i) => {
      const mine = booked.has(c.id), left = c.cap === 1 ? (c.taken ? 0 : 1) : Math.max(0, c.cap - c.taken - (mine ? 1 : 0)), full = left === 0;
      const sp = c.cap === 1 ? `<div class="spots">${full ? 'Время занято' : 'Время свободно'}</div>` : `<div class="spots ${left <= 3 ? 'low' : ''}">${full ? 'Мест нет' : `Свободно ${left} из ${c.cap}`}<i style="--w:${Math.round((c.cap - left) / c.cap * 100)}%"></i></div>`;
      const btn = c.past ? '<button class="btn btn-line btn-sm" disabled>Завершено</button>' : mine ? '<button class="btn is-done btn-sm" disabled>Вы записаны</button>' : `<button class="btn ${full ? 'btn-line' : 'btn-main'} btn-sm" data-id="${c.id}">${full ? 'В лист ожидания' : 'Записаться'}</button>`;
      return `<li class="${c.past ? 'past' : ''}" style="--i:${i}"><div class="t">${c.start}–${endT(c.start, c.dur)}<small>${c.dur} мин</small></div><div class="n">${c.name}<div><span class="pill ty">${TYPES[c.type]}</span><span class="pill">${c.level}</span></div></div><div class="coach-m"><img src="${COACH[c.coach].img}" alt="" width="44" height="44" loading="lazy">${c.coach}</div>${sp}${btn}</li>`;
    }).join('') : '<li class="empty">В этот день занятий выбранного типа нет. Попробуйте другой день или фильтр.</li>';
  }

  daysEl.addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (b) { day = +b.dataset.d; render(); } });
  daysEl.addEventListener('keydown', e => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k) return;
    e.preventDefault(); day = (day + k + 7) % 7; render(); document.getElementById(`day-${day}`).focus();
  });
  chipsEl.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) { filter = b.dataset.f; render(); } });
  list.addEventListener('click', e => {
    const b = e.target.closest('button[data-id]'); if (!b) return;
    const c = classes(day).find(x => x.id === b.dataset.id); if (!c) return;
    booking.open({ format: c.type === 'personal' ? 'personal' : 'group', coach: c.coach, when: `${WDN[wd(dates[day])]}, ${dates[day].getDate()}.${pad(dates[day].getMonth() + 1)} в ${c.start}`, pick: `${c.name} · ${c.start}–${endT(c.start, c.dur)}`, start: c.at, dur: c.dur, title: c.name, onDone: () => { booked.add(c.id); render(); } });
  });
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.filter; render();
    document.getElementById('schedule').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
  }));
  if (classes(0).every(c => c.past)) day = 1;
  render();
}
