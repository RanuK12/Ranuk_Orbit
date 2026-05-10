# Ranuk Orbit — Next.js 14 rebuild

Cinematic aerial photography & travel storytelling site for Emilio Ranucoli,
rebuilt from the ground up. Replaces the legacy React 18 UMD SPA (Lighthouse
Performance 27/100) with a modern Next.js 14 architecture targeting Lighthouse
Performance > 90 and full i18n across English, Spanish and Italian.

## Stack

- **Next.js 14** — App Router, React Server Components by default
- **TypeScript** — strict mode, zero `any`
- **Tailwind CSS** — design tokens mapped to the original brand palette
- **next-intl** — `/en`, `/es`, `/it` routes with static rendering (`setRequestLocale`)
- **next/font (Google)** — self-hosted Italiana, Marcellus, Cormorant Garamond, DM Sans
- **next/image** — AVIF/WebP with automatic lazy loading
- **React Three Fiber** — the interactive 3D globe (lazy-loaded, SSR off, graceful SVG fallback)
- **Zod + Server Actions** — contact form with progressive enhancement, honeypot
- **focus-trap-react** — accessible mobile nav + lightbox

## What's implemented

| Section | File | Notes |
|---|---|---|
| Skip link + a11y | `src/components/layout/SkipLink.tsx` | First focusable element |
| Navigation | `src/components/layout/Nav.tsx` | Sticky, scroll-aware blur, mobile overlay with focus trap, ESC closes |
| Locale switcher | `src/components/layout/LocaleSwitcher.tsx` | Route-based (no cookie); preserves path |
| Hero | `src/components/sections/Hero.tsx` | 3-clip crossfade video carousel, CSS-only letter stagger (`--char-index`), slide dots (44×44 hit targets), mute toggle, `visibilitychange` pause |
| Atlas | `src/components/sections/Atlas.tsx` | Year filters, 2-column layout with R3F globe + sidebar |
| Globe 3D | `src/components/globe/Globe3D.tsx` | Lazy-mounted via IntersectionObserver, `dynamic(ssr:false)`, autorotate, pins per location |
| Globe fallback | `src/components/globe/GlobeFallback.tsx` | Equirectangular SVG map when `prefers-reduced-motion` or WebGL unavailable |
| Archive | `src/components/sections/Archive.tsx` | CSS-column masonry, lazy `next/image`, accessible tiles |
| Lightbox | `src/components/lightbox/Lightbox.tsx` | Focus trap, ESC/arrow keys, works on photos + videos |
| Story | `src/components/sections/Story.tsx` | Profile rotator with pause button + `aria-live`, stats, press strip |
| Services | `src/components/sections/Services.tsx` | 4 pricing cards with "Popular" badge, process grid, FAQ accordion |
| POV (Ray-Ban) | `src/components/sections/POV.tsx` | Kinetic marquee background, spectacle-frame dual video lenses, marquee of 9:16 clips |
| Testimonials | `src/components/sections/Testimonials.tsx` | Auto-rotating carousel, pauses on hover/focus, 44×44 dot targets |
| Contact | `src/components/sections/Contact.tsx` + `src/actions/contact.ts` | Server Action, Zod validation, honeypot, corner bracket decoration, permanent labels, `aria-live` |
| Footer | `src/components/layout/Footer.tsx` | 4-column with brand + nav + social |
| Sitemap | `src/app/sitemap.ts` | All 3 locales with hreflang alternates |
| Robots | `src/app/robots.ts` | Allows crawling except `/api/` |
| OG image | `src/app/api/og/route.tsx` | 1200×630 edge-generated, no image fetch |
| JSON-LD | `src/app/[locale]/layout.tsx` | Schema.org/Person with `knowsAbout`, `makesOffer`, `sameAs` |

## Performance highlights

- **First Load JS shared baseline: 87.5 kB** (target was < 150 kB)
- Hero video: only the active + next clip are mounted as `<video>`; the rest
  render as `<img poster>` to avoid burning bandwidth
- Mobile (< 768 px) never autoplays hero video, only the poster
- Globe 3D is `dynamic(ssr:false)` and mounted only when the Atlas section
  enters the viewport (300 px pre-roll via `IntersectionObserver`)
- Every section after Atlas is `dynamic()`-imported with a skeleton loader
- Fonts are self-hosted via `next/font/google` with `display: 'swap'`
- Cache-Control headers: `/media/*` = `immutable`, one year
- `prefers-reduced-motion` disables every decorative animation (marquees,
  Ken Burns, stagger) while keeping functional transitions

## Accessibility

- Skip-to-content link as the first DOM node
- Landmarks: `<nav aria-label="Primary">`, `<main id="main">`, `<footer>`
- All interactive controls ≥ 44×44 px
- Contrast ratio: text uses `#F7F7F5` over `#0A0A0A` (ratio 19.8:1);
  muted text stays ≥ 4.5:1
- Focus states via `outline: 2px solid var(--desert)` with 3 px offset
- Form errors announced via `aria-live`, linked via `aria-describedby`
- Mobile nav overlay uses `focus-trap-react`, ESC closes
- Lightbox traps focus, supports ESC + ←/→
- Globe 3D has `role="img"` fallback; SVG fallback is fully keyboard-operable

## i18n

The default locale is `en`. The middleware forces a prefix — hitting `/`
redirects to `/en`. All translation keys live in `messages/{en,es,it}.json`.

Adding a new locale:

1. Add it to `src/i18n/config.ts` (`locales`, `localeNames`, `localeCodes`, `ogLocales`)
2. Create `messages/<code>.json` with the full key set from `en.json`
3. That's it — middleware, metadata, sitemap, and alternates will pick it up

## Running locally

```bash
cd next-app
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Assets you need to provide

This repo does NOT ship media assets. The app references real paths
under `/public/media/optimized/`, mirroring the legacy site's layout.
You need to copy over (from the legacy site's `media/optimized/` folder
or your source masters) the following subdirectories into `next-app/public/media/optimized/`:

- `Fotos_Emilio_Perfil/` — 6 portrait WebP used in the Story rotator
- `fotos-drone/` — drone stills (see `src/data/locations.ts` for filenames)
- `fotos-rayban/` — POV stills
- `posters/` — JPEG poster frames for every video (used as lightweight previews)
- `videos-drone/` — drone MP4s
- `videos-rayban/` — Ray-Ban POV MP4s

All filenames are already slugified in `src/data/locations.ts`. If a file is
missing, `next/image` will 404 on that tile but the rest of the page keeps
working. For an extra safety net you can wire up a build-time manifest
check similar to the legacy `ranuk-manifest.js`.

## Deployment

This app is built for **Vercel** (zero config, edge network, automatic image
optimization). Other providers work too — anything that runs Node 18+.

```bash
vercel --prod
```

The legacy GitHub Pages deployment is orthogonal. Keep the old `index.html`
and friends at the repository root if you want to keep the GitHub Pages URL
live during the switchover; the Next.js app lives in `next-app/` and deploys
from that subdirectory.

## Migration notes

The following files from the legacy repo were used as the source of truth
for content and are now replaced by typed modules:

| Legacy | Replacement |
|---|---|
| `ranuk-data.js` | `next-app/src/data/locations.ts` + `next-app/src/data/content.ts` |
| `ranuk-i18n.jsx` | `next-app/messages/{en,es,it}.json` |
| `ranuk-hero.jsx` | `next-app/src/components/sections/Hero.tsx` |
| `ranuk-sections.jsx` | split into `next-app/src/components/sections/*.tsx` |
| `ranuk-globe.jsx` | `next-app/src/components/globe/Globe3D.tsx` + `GlobeFallback.tsx` |
| `ranuk-lightbox.jsx` | `next-app/src/components/lightbox/Lightbox.tsx` |
| `ranuk-manifest.js` | Not needed — static imports + `next/image` handle 404s at the component level |

## Follow-ups (not blocking)

- Wire up the Server Action in `src/actions/contact.ts` to a real transactional
  email provider (Resend, Postmark, SendGrid, SMTP). Right now it logs to the
  server console and returns `success`.
- Configure Partytown for GTM if analytics are needed; the prompt called
  it out as optional and the code is intentionally free of scripts.
- Add Lighthouse CI to the workflow (e.g. `.github/workflows/lighthouse.yml`)
  once assets are in place.
- Consider swapping CSS masonry for a JS masonry library if the visual
  rhythm needs tighter packing; the current implementation is CPU-free.
