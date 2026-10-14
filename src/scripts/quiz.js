const Q = [
  ['Какая у тебя цель?', [['Стать сильнее', 'strength'], ['Улучшить форму и выносливость', 'functional'], ['Тренироваться в компании', 'group'], ['Пока не знаю', 'personal']]],
  ['Какой у тебя опыт?', [['Только начинаю', 'new'], ['Тренируюсь время от времени', 'mid'], ['Занимаюсь регулярно', 'pro']]],
  ['Сколько раз в неделю готов заниматься?', [['1–2 раза', 'low'], ['3–4 раза', 'mid'], ['5 и больше', 'high']]]
];
const NAMES = { strength: 'силовые тренировки', functional: 'функциональный тренинг', group: 'групповые занятия', personal: 'персональные тренировки' };
export function initQuiz(booking) {
  const box = document.getElementById('quiz-box'); let step = 0, ans = [];
  const bar = () => `<div class="q-prog" aria-hidden="true">${Q.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>`;
  function show() {
    if (step < Q.length) {
      const [q, o] = Q[step];
      box.innerHTML = `<div class="fade">${bar()}<h3>${q}</h3><div class="q-opts">${o.map(([t, v]) => `<button data-v="${v}">${t}</button>`).join('')}</div></div>`;
      return;
    }
    const [goal, exp, freq] = ans;
    const plan = goal === 'personal' || exp === 'new' && freq === 'high' ? 'PRO' : freq === 'low' ? 'START' : freq === 'mid' ? 'ACTIVE' : 'PRO';
    const fmtv = goal === 'personal' ? 'personal' : goal === 'group' || goal === 'functional' ? 'group' : 'trial';
    const why = { START: 'Для 1–2 занятий в неделю достаточно зала.', ACTIVE: 'Зал плюс групповые занятия — хороший баланс при 3–4 тренировках.', PRO: 'Расширенный формат и ознакомительная персональная сессия помогут выстроить регулярность.' }[plan];
    box.innerHTML = `<div class="fade q-res">${bar()}<h3>Твой старт</h3><div class="rec"><span class="pill ty">${NAMES[goal][0].toUpperCase() + NAMES[goal].slice(1)}</span><span class="pill ty">Тариф ${plan}</span></div><p>${why} Начни с пробной тренировки — тренер подскажет подходящую нагрузку.</p><div class="btns"><button class="btn btn-main" id="q-go">Записаться на пробную</button><button class="btn btn-line" id="q-re">Пройти заново</button></div></div>`;
    box.querySelector('#q-go').onclick = () => booking.open({ plan, format: fmtv, pick: `Подбор: ${NAMES[goal]}, тариф ${plan}` });
    box.querySelector('#q-re').onclick = () => { step = 0; ans = []; show(); };
  }
  box.addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; ans.push(b.dataset.v); step++; show(); });
  show();
}
