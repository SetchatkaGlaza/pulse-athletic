import { contactError, toast } from './validators.js';
const FORMATS = { trial: 'пробную тренировку', group: 'групповое занятие', personal: 'персональную тренировку' };
const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
export function initBooking() {
  const dlg = document.getElementById('booking'), form = document.getElementById('bk-form'), done = document.getElementById('bk-done');
  const f = id => document.getElementById(id), fmtEl = () => form.querySelector('[name=format]:checked').value;
  let opener = null, ctx = {};
  const syncCoach = () => { f('f-coach-wrap').hidden = fmtEl() !== 'personal'; };
  form.querySelectorAll('[name=format]').forEach(r => r.addEventListener('change', syncCoach));

  function clearErrors() { dlg.querySelectorAll('.err').forEach(e => e.textContent = ''); dlg.querySelectorAll('[aria-invalid]').forEach(e => { e.removeAttribute('aria-invalid'); e.removeAttribute('aria-describedby'); }); }
  function open(pre = {}) {
    ctx = pre; form.hidden = false; done.hidden = true; form.reset(); clearErrors();
    form.querySelector(`[name=format][value=${pre.format || 'trial'}]`).checked = true;
    f('f-plan').value = pre.plan || ''; f('f-when').value = pre.when || ''; syncCoach(); f('f-coach').value = pre.coach || '';
    const pk = f('bk-pick'); pk.hidden = !pre.pick; pk.textContent = pre.pick || '';
    if (!dlg.open) dlg.showModal();
    dlg.querySelector('.modal-main').scrollTop = 0; f('f-name').focus({ preventScroll: true });
  }
  const fail = (id, errId, msg) => { const el = f(id); el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', errId); f(errId).textContent = msg; return el; };

  form.addEventListener('submit', e => {
    e.preventDefault(); clearErrors(); const errs = [];
    const name = f('f-name').value.trim(), contact = f('f-contact').value.trim(), ce = contactError(contact);
    if (name.length < 2) errs.push(['f-name', 'e-name', 'Введите имя — не короче двух символов.']);
    if (ce) errs.push(['f-contact', 'e-contact', ce]);
    if (!f('f-agree').checked) errs.push(['f-agree', 'e-agree', 'Для отправки нужно согласие на обработку данных.']);
    if (errs.length) { errs.map(a => fail(...a))[0].focus(); toast('Проверьте поля формы', true); return; }
    const plan = f('f-plan').value, coach = fmtEl() === 'personal' && f('f-coach').value, when = f('f-when').value.trim();
    f('bk-sum').textContent = `${name}, мы записали вас на ${FORMATS[fmtEl()]}` + (ctx.pick && ctx.start ? ` «${ctx.title}»` : '') + (coach ? ` к тренеру ${coach}` : '') + (when ? `. Время: ${when}` : '') + (plan ? `. Тариф: ${plan}` : '') + '.';
    f('bk-ics').hidden = !ctx.start;
    form.hidden = true; done.hidden = false; done.focus(); ctx.onDone && ctx.onDone(); toast('Заявка отправлена');
  });
  f('bk-ics').addEventListener('click', () => {
    const s = ctx.start, e = new Date(s.getTime() + ctx.dur * 60000);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PULSE ATHLETIC//RU', 'BEGIN:VEVENT', `UID:${stamp(s)}@pulseathletic.club`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(s)}`, `DTEND:${stamp(e)}`, `SUMMARY:PULSE ATHLETIC — ${ctx.title}`, 'LOCATION:г. Москва\\, ул. Кожевническая\\, д. 12\\, стр. 3', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })), download: 'pulse-athletic.ics' }); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
  dlg.addEventListener('close', () => opener && opener.isConnected && opener.focus({ preventScroll: true }));
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-open-booking]'); if (!b) return;
    opener = b; open({ format: b.dataset.format, coach: b.dataset.coach, pick: b.dataset.coach ? `Тренер: ${b.dataset.coach}` : '' });
  });
  return { open: pre => { opener = document.activeElement; open(pre); } };
}
