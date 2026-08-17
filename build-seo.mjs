#!/usr/bin/env node
/**
 * Genera una pagina por destino y el sitemap completo.
 *
 * Por que existe: ranukorbit.com es una SPA que pinta todo en el cliente. El HTML servido es un
 * <div id="app"> vacio — sin un solo <h1> — y el sitemap tenia 4 URLs que son la misma home en
 * cuatro idiomas. Para Google el sitio entero era una pagina sin contenido, y por eso no aparece
 * en ninguna busqueda de "video con drone <lugar>", que es exactamente lo que la gente escribe.
 *
 * Estas paginas NO son la SPA: son HTML estatico con el relato, las fotos y los videos de cada
 * lugar. Es el diario de viaje, indexable, y cada una entra al sitio por el Atlas.
 *
 * Uso: node build-seo.mjs   (despues de node build.js)
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://ranukorbit.com';

// Cargar el dataset real (el mismo que consume el cliente), con el manifest para que el circuit
// breaker descarte lo que no existe en /media.
globalThis.window = {};
new Function(readFileSync(join(ROOT, 'ranuk-manifest.js'), 'utf8')).call(globalThis);
new Function(readFileSync(join(ROOT, 'ranuk-data.js'), 'utf8')).call(globalThis);
const LOCATIONS = globalThis.window.LOCATIONS_V2 || globalThis.LOCATIONS_V2;
if (!LOCATIONS?.length) throw new Error('no pude leer LOCATIONS_V2 de ranuk-data.js');

const LANGS = ['es', 'en', 'it'];
// Cada idioma con su segmento de URL: para posicionar conviene que la ruta este en el idioma.
const SEG = { es: 'lugares', en: 'places', it: 'luoghi' };
const pick = (v, l) => (typeof v === 'object' && v ? (v[l] ?? v.es ?? v.en) : v);
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const T = {
  es: { volver: 'Volver al atlas', piezas: 'piezas', ver: 'Ver en el archivo', desde: 'Filmado en',
        intro: 'Fotografía y cine con drone', otros: 'Otros lugares', sitio: 'Ranuk Orbit',
        cta: 'Trabajemos juntos', ctaSub: 'Cine aéreo para destinos, hotelería, editorial y marcas.' },
  en: { volver: 'Back to the atlas', piezas: 'pieces', ver: 'See in the archive', desde: 'Filmed in',
        intro: 'Drone photography and cinematography', otros: 'Other places', sitio: 'Ranuk Orbit',
        cta: "Let's work together", ctaSub: 'Aerial film for destinations, hospitality, editorial and brands.' },
  it: { volver: "Torna all'atlante", piezas: 'pezzi', ver: "Vedi nell'archivio", desde: 'Girato nel',
        intro: 'Fotografia e cinema con drone', otros: 'Altri luoghi', sitio: 'Ranuk Orbit',
        cta: 'Lavoriamo insieme', ctaSub: 'Cinema aereo per destinazioni, hotellerie, editoria e brand.' },
};

const urlFor = (lang, id) => `${SITE}/${lang === 'es' ? '' : lang + '/'}${SEG[lang]}/${id}/`;
const homeFor = (lang) => `${SITE}/${lang === 'es' ? '' : lang + '/'}`;

/** JSON-LD: Place con los videos que lo documentan. Es lo que habilita los resultados con miniatura. */
function jsonLd(loc, lang, t) {
  const nombre = pick(loc.name, lang);
  const videos = loc.media.filter((m) => m.type !== 'photo').slice(0, 10).map((m) => ({
    '@type': 'VideoObject',
    name: pick(m.title, lang) || nombre,
    description: pick(loc.description, lang),
    thumbnailUrl: SITE + m.poster,
    contentUrl: SITE + m.src,
    uploadDate: `${m.year || loc.year}-01-01`,
  }));
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        name: nombre,
        description: pick(loc.description, lang),
        address: { '@type': 'PostalAddress', addressCountry: pick(loc.country, lang) },
        geo: { '@type': 'GeoCoordinates', latitude: loc.coords.lat, longitude: loc.coords.lng },
        image: SITE + loc.cover,
      },
      ...videos,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.sitio, item: homeFor(lang) },
          { '@type': 'ListItem', position: 2, name: nombre, item: urlFor(lang, loc.id) },
        ],
      },
    ],
  });
}

function pagina(loc, lang) {
  const t = T[lang];
  const nombre = pick(loc.name, lang);
  const pais = pick(loc.country, lang);
  const desc = pick(loc.description, lang);
  const titulo = `${nombre}, ${pais} — ${t.intro} | Ranuk Orbit`;
  const otros = LOCATIONS.filter((l) => l.id !== loc.id).slice(0, 8);
  const prof = '../../..' + (lang === 'es' ? '' : '/..');   // no se usa: todo va con rutas absolutas

  const piezas = loc.media.map((m) => `
        <figure class="seo-pieza">
          <img src="${m.poster || m.src}" alt="${esc(pick(m.title, lang) || nombre)}" loading="lazy" decoding="async" width="960" height="540">
          <figcaption>${esc(pick(m.title, lang) || nombre)}</figcaption>
        </figure>`).join('');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${urlFor(lang, loc.id)}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(l, loc.id)}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${urlFor('es', loc.id)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(nombre + ' — ' + t.sitio)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}${loc.cover}">
<meta property="og:url" content="${urlFor(lang, loc.id)}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/seo-pages.css">
<script type="application/ld+json">${jsonLd(loc, lang, t)}</script>
</head>
<body class="seo-page">
<header class="seo-top">
  <a class="seo-brand" href="${homeFor(lang)}">
    <svg viewBox="0 0 64 64" width="22" height="22" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
        <circle cx="32" cy="32" r="22"/><path d="M32 10v7M32 47v7M10 32h7M47 32h7"/>
        <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(-28 32 32)" stroke-width="1.2" opacity=".8"/>
      </g>
      <g fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M26.5 40.5v-17h6.2a5.4 5.4 0 0 1 0 10.8H26.5"/><path d="M32.9 34.3 39 40.5"/>
      </g>
      <circle cx="55" cy="19.8" r="2.5" fill="#C9A227"/>
    </svg>
    <span>${t.sitio}</span>
  </a>
  <nav class="seo-langs">${LANGS.map((l) => `<a href="${urlFor(l, loc.id)}"${l === lang ? ' aria-current="page"' : ''}>${l.toUpperCase()}</a>`).join('')}</nav>
</header>

<main>
  <article class="seo-hero">
    <p class="seo-kicker">${loc.flag} ${esc(pais)} · ${t.desde} ${loc.year}</p>
    <h1>${esc(nombre)}</h1>
    <p class="seo-lead">${esc(desc)}</p>
    <p class="seo-meta">${loc.media.length} ${t.piezas} · <a href="${homeFor(lang)}#atlas">${t.volver}</a></p>
  </article>

  <section class="seo-grid">${piezas}
  </section>

  <section class="seo-cta">
    <h2>${t.cta}</h2>
    <p>${t.ctaSub}</p>
    <a class="seo-btn" href="${homeFor(lang)}#contact">${t.cta} →</a>
  </section>

  <nav class="seo-otros" aria-label="${t.otros}">
    <h2>${t.otros}</h2>
    <ul>${otros.map((l) => `<li><a href="${urlFor(lang, l.id)}">${l.flag} ${esc(pick(l.name, lang))}</a></li>`).join('')}</ul>
  </nav>
</main>

<footer class="seo-foot">
  <a href="${homeFor(lang)}">⊕ ${t.sitio}</a>
</footer>
</body>
</html>
`;
}

// ── Generar ──────────────────────────────────────────────────────────────────
let n = 0;
for (const lang of LANGS) {
  const base = join(ROOT, lang === 'es' ? '' : lang, SEG[lang]);
  rmSync(base, { recursive: true, force: true });
  for (const loc of LOCATIONS) {
    const dir = join(base, loc.id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), pagina(loc, lang), 'utf8');
    n++;
  }
}

// ── sitemap ──────────────────────────────────────────────────────────────────
const entradas = [];
for (const lang of LANGS) {
  entradas.push({ loc: homeFor(lang), prio: '1.0', alts: LANGS.map((l) => [l, homeFor(l)]) });
}
for (const loc of LOCATIONS) {
  for (const lang of LANGS) {
    entradas.push({ loc: urlFor(lang, loc.id), prio: '0.8', alts: LANGS.map((l) => [l, urlFor(l, loc.id)]) });
  }
}
writeFileSync(join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entradas.map((e) => `  <url>
    <loc>${e.loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${e.prio}</priority>
${e.alts.map(([l, u]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${u}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${e.alts[0][1]}"/>
  </url>`).join('\n')}
</urlset>
`, 'utf8');

console.log(`paginas de destino: ${n} (${LOCATIONS.length} lugares x ${LANGS.length} idiomas)`);
console.log(`sitemap.xml: ${entradas.length} URLs`);

// ── Contenido indexable en la home ───────────────────────────────────────────
// El <div id="app"> se sirve vacio: Google ve una pagina sin un solo <h1>. React lo reemplaza al
// montar (createRoot limpia el contenedor), asi que esto no se ve en pantalla mas que un instante,
// pero es lo que leen los crawlers — y de paso da algo mientras carga el bundle.
// Ademas es el unico lugar desde donde se descubren las 42 paginas de destino.
function bloqueHome(lang) {
  const t = T[lang];
  const tagline = { es: 'La Tierra, desde otro ángulo', en: 'Earth, from another angle',
                    it: 'La Terra, da un altro angolo' }[lang];
  const bajada = {
    es: 'Cine y fotografía con drone: un diario de viaje filmado en 14 lugares de 6 países, y el mismo trabajo para destinos, hotelería, editorial y marcas.',
    en: 'Drone film and photography: a travel journal shot across 14 places in 6 countries, and the same work for destinations, hospitality, editorial and brands.',
    it: 'Cinema e fotografia con drone: un diario di viaggio girato in 14 luoghi di 6 paesi, e lo stesso lavoro per destinazioni, hotellerie, editoria e brand.',
  }[lang];
  return `<div id="seo-fallback">
      <h1>Ranuk Orbit — ${tagline}</h1>
      <p>${bajada}</p>
      <h2>${t.otros}</h2>
      <ul>${LOCATIONS.map((l) => `<li><a href="${urlFor(lang, l.id)}">${esc(pick(l.name, lang))}, ${esc(pick(l.country, lang))} — ${esc(pick(l.description, lang)).slice(0, 120)}</a></li>`).join('')}</ul>
    </div>`;
}

for (const [archivo, lang] of [['index.html', 'es'], ['es/index.html', 'es'],
                               ['en/index.html', 'en'], ['it/index.html', 'it']]) {
  const ruta = join(ROOT, archivo);
  if (!existsSync(ruta)) continue;
  let html = readFileSync(ruta, 'utf8');
  html = html.replace(/<div id="app">[\s\S]*?<\/div>/, `<div id="app">${bloqueHome(lang)}</div>`);
  writeFileSync(ruta, html, 'utf8');
  console.log(`home indexable: ${archivo} (${lang})`);
}
