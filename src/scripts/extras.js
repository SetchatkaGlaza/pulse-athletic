import { contactError, toast } from './validators.js';
export function initCookies() {
  const el = document.getElementById('cookie'); if (!el) return;
  let v = null; try { v = localStorage.getItem('pa-cookie'); } catch (e) {}
  if (v) return; setTimeout(() => { el.hidden = false; }, 1500);
  const done = val => { try { localStorage.setItem('pa-cookie', val); } catch (e) {} el.hidden = true; };
  document.getElementById('ck-ok').onclick = () => done('all'); document.getElementById('ck-no').onclick = () => done('necessary');
}
export function initContacts() {
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast('Скопировано'); } catch (e) { toast('Не удалось скопировать — выделите текст вручную', true); }
  }));
  const form = document.getElementById('ask'); if (!form) return;
  const mark = (id, msg) => {
    const input = document.getElementById(id.replace('ea-', 'a-')); document.getElementById(id).textContent = msg;
    if (msg) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', id); } else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
    return msg;
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = mark('ea-name', form['a-name'].value.trim().length < 2 ? 'Введите имя — не короче двух символов.' : ''), c = mark('ea-contact', contactError(form['a-contact'].value.trim()));
    if (n || c) { form.querySelector('[aria-invalid=true]').focus(); toast('Проверьте поля формы', true); return; }
    form.reset(); toast('Сообщение отправлено. Ответим в течение рабочего дня');
  });
}
