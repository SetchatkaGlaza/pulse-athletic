export const mailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
export const phoneOk = v => { const d = v.replace(/\D/g, ''); return /^[\d\s()+\-]+$/.test(v) && d.length >= 10 && d.length <= 12; };
export function contactError(v) {
  if (!v) return 'Укажите телефон или email.';
  return mailOk(v) || phoneOk(v) ? '' : 'Проверьте контакт: телефон из 10–12 цифр или email вида name@mail.ru.';
}
export function toast(msg, bad) {
  const t = document.getElementById('toast'); if (!t) return;
  t.textContent = msg; t.classList.toggle('bad', !!bad); t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 3800);
}
