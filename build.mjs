/**
 * Genera la carta a partir de data/menu.js.
 *
 *   node build.mjs
 *
 * Produce tres salidas:
 *   public/index.html        -> el sitio que se despliega (junto a public/assets/)
 *   dist/carta-joy.html      -> archivo único con todo embebido, para mandar suelto
 *   dist/artifact.html       -> fragmento para un host que aporta su propio <head>
 *
 * El HTML sale completamente renderizado: el contenido de la carta se lee
 * aunque el JavaScript no cargue.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { BRAND, TAGS, CATEGORIES } from './data/menu.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
/** Carpeta que se despliega tal cual. `public/index.html` es generado. */
const SITE = join(ROOT, 'public');
const IMG = join(SITE, 'assets', 'img');

/* -- utilidades ---------------------------------------------------------- */

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Formato argentino: punto como separador de miles. */
const money = (n) => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const pad2 = (n) => String(n).padStart(2, '0');

/** Lee el ancho y alto reales de un JPEG (marcadores SOF). */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    // SOF0..SOF15, excepto DHT (c4), JPGA (c8) y DAC (cc)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new Error('No se pudo leer el tamaño del JPEG');
}

/** Lee el ancho y alto de un PNG (cabecera IHDR). */
function pngSize(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const sizes = new Map();
async function assetSize(file) {
  if (sizes.has(file)) return sizes.get(file);
  const buf = await readFile(join(IMG, file));
  const size = file.endsWith('.png') ? pngSize(buf) : jpegSize(buf);
  sizes.set(file, size);
  return size;
}

/* -- fragmentos ---------------------------------------------------------- */

const HEROES = [
  { file: 'hero1.jpg', alt: 'Multitud con los brazos en alto frente a los haces de luz de un evento nocturno junto al lago.' },
  { file: 'hero2.jpg', alt: 'Bartender batiendo una coctelera detrás de la barra iluminada a contraluz.' },
  { file: 'hero3.jpg', alt: 'Brindis entre amigos: manos chocando botellas y vasos bajo guirnaldas de luces.' },
  { file: 'hero4.jpg', alt: 'Siluetas bailando sobre el deck junto al agua mientras los haces de luz barren la superficie.' },
];

function tagsHtml(item, sectionTag) {
  const list = [...(item.tags || [])];
  if (sectionTag && !list.includes(sectionTag)) list.push(sectionTag);
  if (!list.length) return '';

  const pills = list
    .map((key) => {
      const t = TAGS[key];
      if (!t) return '';
      return (
        `<span class="tag tag--${key}">${esc(t.short)}` +
        `<span class="sr-only"> — ${esc(t.full)}</span></span>`
      );
    })
    .join('');

  return `<span class="tags">${pills}</span>`;
}

function priceHtml(item) {
  if (typeof item.p === 'number') {
    return `<p class="item__price price price--one">${money(item.p)}</p>`;
  }
  return (
    '<div class="item__price price price--dual">' +
    '<span class="price__lbl">Regular</span>' +
    `<span class="price__num price__num--reg"><span class="sr-only">Precio regular </span>${money(item.r)}</span>` +
    '<span class="price__lbl price__lbl--cash">Efectivo</span>' +
    `<span class="price__num price__num--cash"><span class="sr-only">Precio en efectivo </span>${money(item.e)}</span>` +
    '</div>'
  );
}

function itemHtml(item, sectionTag) {
  const name = `<h3 class="item__name">${esc(item.n)}${tagsHtml(item, sectionTag)}</h3>`;
  const desc = item.d ? `<p class="item__desc">${esc(item.d)}</p>` : '';
  const note = item.note ? `<p class="item__note">${esc(item.note)}</p>` : '';
  return (
    '<li class="item">' +
    `<div class="item__main">${name}${desc}</div>` +
    priceHtml(item) +
    note +
    '</li>'
  );
}

async function chapterHtml(cat, i, total) {
  const photo = `${cat.photo}.jpg`;
  const { w, h } = await assetSize(photo);
  const num = `${pad2(i + 1)} <span aria-hidden="true">/</span><span class="sr-only"> de </span> ${total}`;

  const legend = cat.dual
    ? '<p class="legend">Dos valores por producto: <b>Regular</b> y <b>Efectivo</b>, el precio con descuento abonando en efectivo.</p>'
    : '';

  const items = cat.items.map((it) => itemHtml(it, cat.sectionTag)).join('');

  return `
<section class="chapter" id="${cat.id}" data-name="${esc(cat.name)}" aria-labelledby="t-${cat.id}">
  <div class="chapter__opener reveal">
    <img class="chapter__photo" src="{{IMG}}${photo}" width="${w}" height="${h}" alt="${esc(cat.alt)}" loading="lazy" decoding="async">
    <div class="chapter__head wrap">
      <p class="chapter__num"><span class="sr-only">Capítulo </span>${num}</p>
      <h2 class="chapter__title" id="t-${cat.id}">${esc(cat.name)}</h2>
      <p class="chapter__kicker">${esc(cat.kicker)}</p>
    </div>
  </div>
  <div class="chapter__body wrap">
    ${legend}
    <ul class="items">${items}</ul>
  </div>
</section>`;
}

function tocHtml(idSuffix) {
  const rows = CATEGORIES.map((cat, i) => {
    const n = cat.items.length;
    return (
      `<li><a href="#${cat.id}" data-goto="${cat.id}">` +
      `<span class="toc__num">${pad2(i + 1)}</span>` +
      `<span class="toc__name">${esc(cat.name)}</span>` +
      `<span class="toc__count">${n}<span class="sr-only"> producto${n === 1 ? '' : 's'}</span></span>` +
      '</a></li>'
    );
  }).join('');
  return `<ol class="toc" id="toc-${idSuffix}">${rows}</ol>`;
}

/* -- documento ----------------------------------------------------------- */

async function document_() {
  const total = CATEGORIES.length;
  const count = CATEGORIES.reduce((a, c) => a + c.items.length, 0);

  const heroImgs = await Promise.all(
    HEROES.map(async (hero, i) => {
      const { w, h } = await assetSize(hero.file);
      // Solo el primer fotograma se pide de entrada. Los otros ocupan el
      // viewport (van a sangre), así que `loading=lazy` no los frenaría: se
      // cargan desde el JS una vez que la página terminó de armarse.
      if (i === 0) {
        return (
          `<img class="cover__frame" src="{{IMG}}${hero.file}" width="${w}" height="${h}" ` +
          `alt="${esc(hero.alt)}" fetchpriority="high" decoding="sync">`
        );
      }
      return (
        `<img class="cover__frame" data-src="{{IMG}}${hero.file}" width="${w}" height="${h}" ` +
        `alt="" aria-hidden="true" decoding="async">`
      );
    })
  );

  const logo = await assetSize('logo-joy.png');
  const indexBg = await assetSize('c_indice.jpg');

  const chapters = (
    await Promise.all(CATEGORIES.map((cat, i) => chapterHtml(cat, i, total)))
  ).join('\n');

  return `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Joy Wake Park · Carta · Noches mágicas</title>
<meta name="description" content="Carta digital de Joy Wake Park, San Juan. ${count} productos en ${total} capítulos: cocina, pizzas, vinos, tragos, botellas y promos previas.">
<meta name="theme-color" content="#0a0a0a">
<meta name="color-scheme" content="dark">
<meta property="og:title" content="Joy Wake Park · Noches mágicas">
<meta property="og:description" content="La carta completa de Joy Wake Park, San Juan.">
<meta property="og:type" content="website">
<link rel="icon" href="{{IMG}}logo-joy.png" type="image/png">
<link rel="apple-touch-icon" href="{{IMG}}logo-joy.png">
{{HEAD}}
</head>
<body>

<a class="skip-link" href="#indice">Ir al índice de la carta</a>

<header class="cover">
  <div class="cover__stage" aria-hidden="true"></div>
  ${heroImgs.join('\n  ')}
  <div class="cover__veil" aria-hidden="true"></div>

  <div class="cover__top">
    <img class="cover__logo" src="{{IMG}}logo-joy.png" width="${logo.w}" height="${logo.h}" alt="Joy — Temporada 2026" fetchpriority="high">
    <p class="cover__eyebrow">Bar · Wake Park · Eventos</p>
  </div>

  <div class="cover__mid">
    <h1 class="cover__slogan">
      <span>${esc(BRAND.slogan[0])}</span><span class="is-accented">${esc(BRAND.slogan[1])}</span>
    </h1>
    <span class="cover__rule" aria-hidden="true"></span>
    <p class="cover__place">${esc(BRAND.name)}<br>${esc(BRAND.place)}</p>
  </div>

  <div class="cover__foot">
    <a class="cover__cue" href="#indice">
      <span class="cover__cue-line" aria-hidden="true"></span>
      Deslizá para explorar
    </a>
  </div>
</header>

<nav class="rail" aria-label="Navegación de la carta">
  <img class="rail__mark" src="{{IMG}}logo-joy.png" width="${logo.w}" height="${logo.h}" alt="Joy Wake Park">
  <p class="rail__now" aria-live="polite">Índice</p>
  <button class="rail__btn" id="sheet-open" type="button" aria-expanded="false" aria-controls="sheet">
    <span class="rail__bars" aria-hidden="true"><i></i><i></i><i></i></span>
    Índice
  </button>
</nav>

<main id="carta">

  <section class="index" id="indice" aria-labelledby="indice-t">
    <img class="index__bg" src="{{IMG}}c_indice.jpg" width="${indexBg.w}" height="${indexBg.h}" alt="" aria-hidden="true" loading="lazy" decoding="async">
    <div class="wrap">
      <p class="eyebrow">${total} capítulos · ${count} productos</p>
      <h2 class="index__title" id="indice-t">La carta</h2>
      <p class="index__note">${esc(BRAND.priceNote)} Los distintivos <b>Veggie</b> y <b>Sin&nbsp;TACC</b> aparecen junto a cada producto que los declara.</p>
      ${tocHtml('page')}
    </div>
  </section>

${chapters}

</main>

<footer class="outro">
  <img class="outro__bg" src="{{IMG}}hero3.jpg" width="${(await assetSize('hero3.jpg')).w}" height="${(await assetSize('hero3.jpg')).h}" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <img class="outro__logo" src="{{IMG}}logo-joy.png" width="${logo.w}" height="${logo.h}" alt="Joy Wake Park">
  <p class="outro__slogan">${esc(BRAND.slogan[0])}<br>${esc(BRAND.slogan[1])}</p>
  <p class="outro__meta">${esc(BRAND.name)} · ${esc(BRAND.place)}<br>${esc(BRAND.season)}</p>
  <a class="outro__top" href="#carta">Volver al índice</a>
  <p class="outro__legal">Precios sujetos a modificación sin previo aviso.</p>
</footer>

<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t" aria-hidden="true">
  <div class="sheet__bar">
    <p class="sheet__title" id="sheet-t">Índice</p>
    <button class="sheet__close" id="sheet-close" type="button">Cerrar</button>
  </div>
  <div class="sheet__body">
    <div class="wrap">${tocHtml('sheet')}</div>
  </div>
</div>

{{FOOT}}
</body>
</html>
`;
}

/* -- salidas ------------------------------------------------------------- */

const MIME = { '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };

/**
 * Huella del contenido, para colgar de la URL como `?v=`.
 *
 * Las cabeceras de caché guardan los assets un mes. Sin esto, al cambiar un
 * precio el navegador podría combinar el HTML nuevo con un CSS viejo: la URL
 * cambia solo cuando cambia el contenido, así que la combinación es imposible.
 */
async function stamp(path) {
  const buf = await readFile(path);
  return createHash('sha256').update(buf).digest('hex').slice(0, 8);
}

async function dataUri(path) {
  const buf = await readFile(path);
  const ext = path.slice(path.lastIndexOf('.'));
  return `data:${MIME[ext]};base64,${buf.toString('base64')}`;
}

async function main() {
  const tpl = await document_();

  /* --- 1. sitio estático con assets sueltos --- */
  let multi = tpl;

  for (const file of new Set([...tpl.matchAll(/\{\{IMG\}\}([\w.-]+)/g)].map((m) => m[1]))) {
    const v = await stamp(join(IMG, file));
    multi = multi.replaceAll(`{{IMG}}${file}`, `assets/img/${file}?v=${v}`);
  }

  const cssV = await stamp(join(SITE, 'assets', 'css', 'carta.css'));
  const jsV = await stamp(join(SITE, 'assets', 'js', 'carta.js'));

  multi = multi
    .replace(
      '{{HEAD}}',
      [
        '<link rel="preload" href="assets/fonts/FiraSans-900.woff2" as="font" type="font/woff2" crossorigin>',
        '<link rel="preload" href="assets/fonts/Ubuntu-400.woff2" as="font" type="font/woff2" crossorigin>',
        `<link rel="stylesheet" href="assets/css/carta.css?v=${cssV}">`,
      ].join('\n')
    )
    .replace('{{FOOT}}', `<script src="assets/js/carta.js?v=${jsV}" defer></script>`);

  await writeFile(join(SITE, 'index.html'), multi);

  /* --- 2. archivo único, todo embebido --- */
  let css = await readFile(join(SITE, 'assets', 'css', 'carta.css'), 'utf8');
  const fontRefs = [...css.matchAll(/url\('\.\.\/fonts\/([\w-]+\.woff2)'\)/g)];
  for (const [full, file] of fontRefs) {
    const uri = await dataUri(join(SITE, 'assets', 'fonts', file));
    css = css.replace(full, `url(${uri})`);
  }

  const js = await readFile(join(SITE, 'assets', 'js', 'carta.js'), 'utf8');

  let single = tpl
    .replace('{{HEAD}}', `<style>\n${css}\n</style>`)
    .replace('{{FOOT}}', `<script>\n${js}\n</script>`);

  const imgRefs = new Set([...single.matchAll(/\{\{IMG\}\}([\w.-]+)/g)].map((m) => m[1]));
  for (const file of imgRefs) {
    const uri = await dataUri(join(IMG, file));
    single = single.replaceAll(`{{IMG}}${file}`, uri);
  }

  await mkdir(join(ROOT, 'dist'), { recursive: true });
  await writeFile(join(ROOT, 'dist', 'carta-joy.html'), single);

  /* --- 3. fragmento para publicar (el host aporta doctype/html/head/body) --- */
  const inner = single
    .slice(single.indexOf('<body>') + '<body>'.length, single.lastIndexOf('</body>'))
    .trim();
  // En el publicador el título es el nombre de la pieza en la galería, no el
  // título SEO de la pestaña del sitio.
  const titleTag = '<title>Carta Joy Wake Park</title>';
  const styleTag = single.slice(single.indexOf('<style>'), single.indexOf('</style>') + 8);
  // El <title> va primero: el publicador solo mira los primeros 8 KB.
  const fragment = `${titleTag}\n${styleTag}\n${inner}\n`;
  await writeFile(join(ROOT, 'dist', 'artifact.html'), fragment);

  const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(0) + ' KB';
  const items = CATEGORIES.reduce((a, c) => a + c.items.length, 0);
  console.log(`public/index     ${kb(multi)}   (+ assets sueltos)`);
  console.log(`dist/carta-joy   ${kb(single)}   (archivo único)`);
  console.log(`dist/artifact    ${kb(await readFile(join(ROOT, 'dist', 'artifact.html'), 'utf8'))}   (fragmento publicable)`);
  console.log(`${CATEGORIES.length} capítulos · ${items} productos`);
}

main();
