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
