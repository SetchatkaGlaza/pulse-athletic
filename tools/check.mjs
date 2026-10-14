// Лёгкая проверка проекта без зависимостей: дубликаты id, битые якоря и ссылки на файлы, alt у изображений.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = readdirSync(root).filter((f) => f.endsWith('.html'));
const problems = [];

for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => problems.push(`${page}: повторяется id="${id}"`));

  [...html.matchAll(/href="#([^"]+)"/g)].forEach(([, a]) => { if (!ids.includes(a)) problems.push(`${page}: нет якоря #${a}`); });
  [...html.matchAll(/<img(?![^>]*\salt=)[^>]*>/g)].forEach(() => problems.push(`${page}: <img> без alt`));

  const files = [...html.matchAll(/(?:src|srcset|poster|href)="([^"#?:]+\.(?:webp|png|jpg|svg|ico|mp4|html|webmanifest))/g)].map((m) => m[1]);
  for (const f of new Set(files)) {
    const ok = existsSync(join(root, f)) || existsSync(join(root, 'public', f));
    if (!ok) problems.push(`${page}: файл не найден: ${f}`);
  }
}

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`OK: проверено страниц — ${pages.length}, проблем не найдено.`);
