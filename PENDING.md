# Ranuk Orbit — Pending work

Scope that this PR consciously did **not** close, and why. Each entry is ready
to pick up on its own once the blocker is resolved.

---

## P1 — Real testimonials

**Status:** blocked on content, not code.

The current `TESTIMONIALS_V2` array in `ranuk-data.js` is populated with
placeholders (friends / family) because that is the closest thing to a real
client roster right now. Replacing them needs actual client material — quotes,
names, titles, preferably logos.

### When unblocked, update by doing

1. Edit `TESTIMONIALS_V2` in `ranuk-data.js`. Each entry is:
   ```js
   { name: 'Jane Doe',
     role: { en: 'Head of Marketing, Hotel X', es: '…', it: '…' },
     quote: { en: '…', es: '…', it: '…' },
     logo: '/media/optimized/brands/hotel-x.svg' }
   ```
2. Drop logo SVGs into `media/optimized/brands/` and add the paths to
   `ranuk-manifest.js` so the circuit-breaker doesn't drop them.
3. If any testimonial corresponds to a real brand / tourism board, also add
   them to `PRESS_V2` or build a `trust-strip` above the testimonials section.

### What counts as a real client

- DJI, a tourism board, a boutique hotel chain, an airline.
- A named agency that placed the work (not "a friend who runs a restaurant").
- Someone who paid (even if it was barter).

**Do not publish** testimonials that say "Emi is amazing, I love his photos" —
those kill credibility rather than build it.

---

## P2 — Landing pages per location (SEO)

**Status:** scoped, not started.

Goal: each location (Sardinia, Patagonia, Morocco, Thailand, etc.) gets its
own `/en/places/sardinia/` URL with:

- A focused hero (one of that location's hero-ready videos)
- The full archive grid for that location (not truncated)
- A story paragraph unique to the place (not recycled from the main bio)
- Schema.org `Place` + `VideoObject` markup for each clip
- hreflang alternates to `/es/lugares/cerdena/` and `/it/luoghi/sardegna/`

### Recommended approach

Since the stack is currently static HTML + locale subdirs built by
`build-locales.py`, the lowest-friction path is:

1. Add a `LANDING_PAGES` array in `ranuk-data.js` that declares `{ locationId,
   slug_es, slug_en, slug_it }` per entry.
2. Extend `build-locales.py` to iterate over `LOCATIONS_V2` and emit one
   HTML file per location per locale, injecting a single `<script>` that
   sets `window.RANUK_LANDING = { locationId: 'cerdena' }`.
3. In `ranuk-app.jsx`, read `window.RANUK_LANDING` before mounting `<App>`.
   If set, render a dedicated `<LandingPage locationId="…" />` component
   instead of the full orbit. It reuses `ArchiveGroup`, `StorySection` (with
   a landing-specific paragraph), and a trimmed nav.
4. Update `sitemap.xml` — generate entries for every
   `/{locale}/{slug}/` combination.

### Content needed

- 1 hero paragraph per location × 3 languages (~60 words each). The existing
  `description` on each location is the starting point — just slightly longer.
- Meta `<title>` + `<meta description>` per location per locale.
- Canonical URL decision: which locale is the canonical for a given location?
  Probably `/en/places/...` since it's the widest audience.

### Time estimate

- Scaffolding (steps 1–3 above): half a day.
- Content writing (EN/ES/IT for ~14 locations): 2–3 days, mostly writing.
- Sitemap + hreflang QA: 1 hour.

### Why this came out of this PR

This PR already touched index.html, all three locale copies, the Archive,
the Lightbox, the Globe and the Reel. Adding 14×3=42 new HTML files on top
of that would have made the diff unreviewable. Land this PR first, then
take landing pages as their own focused pass.

---

## P2 — Reel video file

**Status:** code ready, content missing.

`ranuk-app.min.js` already ships the `ReelModal` component. It checks
`window.RANUK_REEL_URL` at runtime. When that string is set (e.g. to
`/media/optimized/reel.mp4`), the modal plays that video. When it's empty,
the modal shows a polished "coming soon" card with an Atlas CTA.

### When you have the reel

1. Drop the MP4 into `media/optimized/reel.mp4` (≤ 30 MB, 1080p, H.264, or
   use the HEVC/AV1 pair if you want smaller-on-Safari + compatible-on-Chrome).
2. Add the path to `ranuk-manifest.js` so the circuit-breaker does not drop
   it.
3. Set `window.RANUK_REEL_URL = "/media/optimized/reel.mp4";` in
   `index.html` (there is a commented block near the top reserved for exactly
   this).
4. Run `python3 build-locales.py` to regenerate `/en/` `/es/` `/it/`.

### Recommended

- Include captions as a sibling `.vtt` file if the reel has dialogue.
- Generate a poster (`reel.jpg`) for the first frame so the modal doesn't
  flash black before autoplay kicks in.

---

## P2 — Formspree endpoint

**Status:** 10-minute task, not done.

1. Sign up at https://formspree.io (free plan, 50 submissions/month).
2. Create a form named "Ranuk Orbit contact". Formspree gives you an ID
   like `xzbgkaer`.
3. In `index.html`, replace the placeholder:
   ```html
   <script>
     window.RANUK_FORMSPREE = "https://formspree.io/f/xzbgkaer";
     window.RANUK_REEL_URL  = "";
   </script>
   ```
4. Run `python3 build-locales.py`.
5. Test by submitting the form on the live site; the first email goes
   through a confirmation step on Formspree's side.

Until this is done, the contact form falls back to a `mailto:` — which
works, but means leads are lost when the user's default mail client is
misconfigured.

---

## Nice-to-have (future)

- **EXIF read from actual files.** The `exif` fields on media are
  hand-curated. Writing a tiny `exifr` pass during `build-locales.py` and
  baking real EXIF (camera, focal length, ISO, coords) into
  `ranuk-manifest.js` would be a nice upgrade for editorial credibility.
- **Video HLS.** Right now videos are served as single MP4. For the reel
  and the top-5 highlights (Cerdeña hero, Rio Limay, Atardecer Nieve),
  HLS with 3 bitrate ladders would cut first-frame time on 4G.
- **Service worker.** Once the manifest is stable, a workbox SW caching
  posters + the bundle would make the second visit feel instant.


---

## Auditoría vs. "Prompt Maestro" — qué tenemos y qué falta

Cross-reference entre el brief original ("cinematic media universe, film
studio + luxury brand + tech product + travel atlas") y el estado actual
de Ranuk Orbit. Verde = listo, Amarillo = parcial, Rojo = falta.

### 🟢 Brand Direction

| Requerido | Estado |
|---|---|
| Nombre de marca | **Ranuk Orbit** ✓ (ya consolidado, dominio `ranukorbit.com`) |
| Tagline | "Earth, from another angle" ✓ (en hero + meta tags) |
| Base color celestial white | `--celestial: #F7F7F5` ✓ |
| Paletas dinámicas (oceanic, desert, alpine, forest, dusk) | ✓ definidas en `:root` + cada location tiene `accentColor` aplicado como `--accent` |
| Tipografía premium editorial | Italiana + Marcellus + Cormorant Garamond + DM Sans + Space Grotesk ✓ |
| Manifiesto de marca | ⚠ Existe BRAND_GUIDELINES.md pero no hay un bloque "manifesto" público en el sitio |

### 🟢 Hero Experience
- Fullscreen cinematic ✓
- Drone video loop (3-clip crossfade: Cerdeña → Limay → Alpes) ✓
- Headline + subheadline + CTA ✓
- Letter-reveal animation (stagger/curtain/blur variants) ✓
- Ken Burns + parallax + mute toggle + scroll hint ✓

### 🟡 Interactive World Map — "flagship feature"

| Requerido | Estado |
|---|---|
| Globo interactivo con Three.js/WebGL | ✓ `ranuk-globe.jsx` |
| Pins con media por ubicación | ✓ LOCATIONS_V2 + VISITED_DOTS_V2 |
| Click → transición suave al lugar | ⚠ Abre sidebar + destaca pin, **no hace zoom cinematográfico** al país |
| Nombre, país, thumbs, drone + fotos + POV por lugar | ⚠ Sidebar tiene lista pero NO hay "panel de lugar" con el preview completo de la ubicación seleccionada dentro del mismo globo. El usuario tiene que scrollear al Archive para ver el material |
| Browse por mood / altitude / content type / year | ✓ chips en Archive |

**Falta:** un "location drawer" que aparezca al hacer click en un pin y
muestre hero clip + thumbnails de todo el material de ese lugar sin
salir del Atlas. Actualmente el click sólo centra el globo y marca el
ítem en el sidebar.

### 🟢 Media Experience (Archive)
- Cinematic cards ✓
- Hover preview en desktop (video mount-on-hover con IntersectionObserver) ✓
- Smooth motion transitions + FLIP animation en cambio de filtro ✓
- Lightbox elegante (sin native video UI fea) ✓
- Filtros por place / mood / altitude / year / type ✓
- **[ESTE PR]** Previews únicos por video ✓
- **[ESTE PR]** Layout sin huecos ✓

### 🟡 Story / About Section

| Requerido | Estado |
|---|---|
| Narrativa de viaje cinematográfica | ✓ párrafos en i18n |
| Portrait rotator con fotos reales | ✓ PROFILE_PHOTOS, 14 fotos |
| Stats (países / vuelos / horas / marcas) con CountUp | ✓ |
| Pull quote | ✓ |
| Integración con libro/autor | ❌ El brief pide "Include the book / author identity as part of the story if relevant". Actualmente NO hay mención del libro ni link a la web principal del autor |

**Falta:** un link sutil en Story → web principal Emilio Ranucoli
(engineer/data scientist/author) y un mention del libro como "previous
life" o "backbone identity".

### 🟢 Ray-Ban Meta POV Section — **[ESTE PR]**
- Innovación, inmersión, "being there" ✓
- Frame de anteojos con doble lente + bridge ✓ (rediseñado: gold-ring, reflective sheen)
- Kinetic text marquee ✓
- Micro-stats clips/places/minutes ✓
- Vertical 9:16 filmstrip ✓
- CTA elegante ✓

### 🟡 Conversion / Contact

| Requerido | Estado |
|---|---|
| Form premium y frictionless | ✓ (name + email + message, con borders editoriales) |
| Copy elegante ("Let's create something unforgettable") | ✓ |
| WhatsApp float móvil | ✓ (visible tras 25% scroll) |
| Formspree endpoint real | ❌ **Todavía en `mailto:` fallback** (ya documentado arriba en "Formspree endpoint") |
| Booking/Calendly integration | ❌ no implementado. Para brief calls sería high-impact |

### 🟢 UX / UI Requirements
- Modern, responsive, fast, polished ✓
- Accessible (aria labels, reduced motion respect, keyboard nav en lightbox) ✓
- Mobile-first behavior (custom cursor desactivado en touch, timeline móvil en Atlas) ✓
- Subtle motion + intentional transitions ✓
- Reel modal con "coming soon" cuando no hay URL ✓

### 🟢 Tech Stack
- React 18 + JSX (compilado offline con esbuild) ✓
- Three.js para el globo ✓
- CSS custom, sin Tailwind — decisión consciente (menos bytes) ✓
- Framer Motion ❌ **NO se usa** (todo motion es CSS + requestAnimationFrame). El brief lo pide explícitamente pero el resultado actual tiene menos deps y mejor perf. Mantener la decisión.
- Next.js ❌ **NO se usa.** Sitio estático puro. Trade-off: pierde SSR/SSG pero gana simplicidad de deploy (GitHub Pages / Cloudflare Pages directo). Si se necesitan landing pages por location con SEO serio, migrar a Astro sería más natural que Next.

### 🟡 SEO / Landing Pages por ubicación

| Requerido | Estado |
|---|---|
| hreflang es/en/it + x-default | ✓ |
| Sitemap.xml | ✓ (pero sólo 3 URLs) |
| Open Graph + Twitter Cards | ✓ |
| JSON-LD Person | ✓ |
| Landing por location (`/en/places/sardinia/`, etc) | ❌ **P2 documentado arriba.** Es la mayor oportunidad de crecimiento orgánico |
| Schema.org `Place` + `VideoObject` por clip | ❌ |

### 🟡 Deliverables del brief (1-12)

| # | Deliverable | Estado |
|---|---|---|
| 1 | Brand name + final recommendation | ✓ Ranuk Orbit |
| 2 | Tagline options + final | ✓ "Earth, from another angle" |
| 3 | Creative concept summary | ✓ `CREATIVE_BRIEF.md` |
| 4 | Site architecture / sitemap | ✓ implícito en el sitio mismo |
| 5 | UX flow landing → contact | ✓ Hero → Atlas → Archive → Story → POV → Services → Contact |
| 6 | Visual design system | ✓ documentado en `BRAND_GUIDELINES.md` + `:root` CSS custom props |
| 7 | Motion / interaction system | ✓ en código pero ❌ no documentado formalmente |
| 8 | Data structure for media/locations | ✓ `LOCATIONS_V2` en `ranuk-data.js` |
| 9 | Technical architecture | ⚠ documentado parcialmente en `PERFORMANCE_FIXES.md` |
| 10 | Full implementation plan | ✓ trackeado en `LAUNCH_STEPS.md` |
| 11 | Production-ready MVP | ✓ desplegado |
| 12 | Growth ideas SEO/viralidad/monetización | ❌ no existe un doc formal |

### 🔴 Lo que más falta para llegar a "award-level experience"

1. **Location drawer en el Globo** — que el click en un pin muestre ahí mismo un mini-gallery con el top-3 de ese lugar. Hoy el globo es precioso pero la interacción termina en el sidebar, no en el material.
2. **Landing pages por ubicación** con schema.org para SEO real. Ya está en el PENDING.md arriba — *es la palanca #1 de tráfico orgánico*.
3. **Reel de 90 segundos** — el modal ya existe, falta el MP4.
4. **Testimonials reales** (bloqueado por contenido).
5. **Formspree endpoint** (10 min de trabajo).
6. **Link a la web principal de Emilio + mención del libro** en Story.
7. **Un "Press/Logos" real** — hoy `PRESS_V2` tiene nombres placeholder (DJI Pilot Showcase, Ray-Ban Meta Creators). Si no hay placements reales, quitarlo o moverlo a "Gear & Tools".
8. **Brand Manifesto público** como sección ancla (entre Story y Services): un párrafo poético de 40-60 palabras, trilingüe. Hoy está sólo en `BRAND_GUIDELINES.md`.
9. **Service Worker + cache offline** (mencionado en "Nice-to-have" arriba) — para que el segundo visit sea instantáneo y el sitio funcione en avión/mal WiFi.
10. **Monetización explícita** — hoy no hay pricing público. Los packages en Services tienen precios pero ni tier gratuito de licensing ni tienda de prints. Hay un mercado evidente para:
    - Prints físicos (fotos drone firmadas)
    - Stock licensing (plataforma propia o Pond5/Artgrid)
    - Workshops/cursos (drone travel photography)
    - NFT/collectibles (sólo si encaja con la marca — probablemente NO)

### Resumen ejecutivo

El sitio hoy **cumple el 80%** del brief. Lo que está, está bien hecho
(hero, archive, i18n, perf, a11y). Lo que falta es:

- **Crítico**: endpoint real de contacto (formspree), reel MP4, location
  drawer en el globo, link al perfil principal + libro.
- **Growth**: landing pages por location con schema.org, plan de
  monetización, brand manifesto público.
- **Pulido**: testimonials reales, press verificada o quitada, service
  worker.

Nada es un red-flag técnico. Todo es contenido / integraciones / pulido.
