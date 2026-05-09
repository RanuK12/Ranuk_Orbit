# Ranuk Orbit — Creative Brief

Reference document tracking how the live site satisfies the original
brief's 12 deliverables. Maintained as an index, not a design doc — the
actual implementation is in code. When you edit the brand, tagline,
data model, etc., update this file so the team has a single source of
truth.

Last synced: PR #4 (2026-05-09).

---

## 1. Brand name

- **Final:** **Ranuk Orbit**
- Rationale: keeps the creator's family nickname "Ranuk" (personal, non-corporate) and pairs it with "Orbit" — a word that signals global travel, flight, and returning to the same places with a new angle. Short, memorable, available as .com.
- Variants considered: Ranuk Atlas, Ranuk Aerial, Ranuk Frame.

## 2. Tagline

- **Final (EN):** *Earth, from another angle.*
- **ES:** *La Tierra, desde otro ángulo.*
- **IT:** *La Terra, da un altro angolo.*
- Supporting kicker: `Drone · POV · Travel`
- Rationale: works for both drone (literal "angle") and POV Ray-Ban footage (human angle). Avoids the word "portfolio".

## 3. Creative concept

Ranuk Orbit is not a portfolio. It's a cinematic archive of one person's
way of looking at the world — from the air and at eye level.

Three editorial pillars:

1. **Drone** — composition you only see from above.
2. **POV (Ray-Ban Meta)** — presence you only feel walking.
3. **Stills** — frozen reads of a place.

Every piece of media is geolocated, dated and colour-graded by mood. The
site is architected so the visitor browses by place, time, altitude or
mood — not by arbitrary "projects". The same creator is also an
engineer / data scientist / author publishing in three languages; the
Story section acknowledges that identity without letting it dominate.

## 4. Site architecture

```
/ (home)
  ├─ HeroSection          3-clip drone loop, headline, CTA "Open the Atlas"
  ├─ AtlasSection         #atlas    — Three.js globe + sidebar (14 locations)
  ├─ StatsBand            44 / 1280+ / 640+ / 24
  ├─ ArchiveSection       #archive  — masonry, filters: type · year · place · mood · altitude
  ├─ StorySection         #story    — portrait rotator + 5-paragraph bio + stats
  ├─ RayBanSection        #pov      — glasses lens reel + POV grid + subscribe
  ├─ ServicesSection      #services — 5 packages, FAQ
  ├─ ProcessSection       #process  — Briefing → Scouting → Capture → Edit
  ├─ TestimonialsSection  #testimonials
  ├─ PressSection         #press
  └─ ContactSection       #contact  — form + WhatsApp float + mailto

Localised mirrors: /es/ /en/ /it/ (og:locale + canonical per locale).
SEO: JSON-LD Person schema, hreflang, /sitemap.xml, /robots.txt.
```

## 5. UX flow landing → contact

1. **0-3 s**: hero fullscreen video, preloaded poster avoids flash black.
2. **First scroll**: atlas globe with 14 pins (Maddalena, Trentino, Patagonia, …) + 30 visited dots in grey. Dragging the globe introduces spatial depth.
3. **Pin click**: highlight pulse + lightbox opens with that location's media (drone, stills and POV stacked).
4. **Further scroll**: stats band legitimises scale; archive lets the user filter by any cinematographic axis.
5. **Story**: the personal paragraph about building systems, writing a book and crossing countries sits between the archive and the POV section, giving the visitor a human reason to care.
6. **POV**: experimental tone, subscribe form for the upcoming series.
7. **Services**: 5 pricing tiers with one ribboned "most popular" and a "Let's talk" escape hatch. FAQ right below.
8. **Contact**: 3-field form (name / email / brief), WhatsApp float on mobile after 25 % scroll, direct mailto fallback when no Formspree endpoint is configured.

## 6. Visual design system

- **Base:** celestial white `#F7F7F5` on ink `#0A0A0A`.
- **Location accents:** oceanic `#1E6FA4`, golden `#C9A227`, alpine `#8FA8C0`, forest `#2D7A4A`, dusk `#6B4C7F`, warm `#B85C38`, cold `#8FA8C0`, green `#2D7A4A`. Each assigned per-location via `accentColor`.
- **Type:** Italiana (hero/section titles), Marcellus (overlines/UI microcopy), Cormorant Garamond italic (editorial prose), DM Sans (body), Space Grotesk (numeric + modern UI), Inter (fallback).
- **Spacing:** custom gutter `clamp(20px, 4vw, 80px)`, max-width 1440.
- **Buttons:** `.btn-ghost` (pill outline, inverts on hover) and `.chip` (filter pill).
- **Cards:** `.gallery-item` 4/5 aspect, spotlight every 5th item, hover lifts poster brightness and overlays meta.
- **Motion:** cubic-bezier(0.22, 1, 0.36, 1) for everything; ken-burns on hero; FLIP animation on archive filter change; crossfade on Ray-Ban lenses and profile rotator.
- **Loading:** full-screen `#0A0A0A` with rotating mark + progress bar, fades out at 1.2 s.

CSS lives inline in `index.html` (single-file deploy, no build for styles).
No Tailwind; tech stack section explains why.

## 7. Motion / interaction system

| Pattern | Trigger | Duration | Easing |
|---|---|---|---|
| Ken-burns on hero video | infinite | 22 s alternate | ease-in-out |
| Profile rotator crossfade | interval 10 s | 1.8 s | ease-in-out + 6 s scale |
| POV lens crossfade | interval 15 s | 1.4 s | ease |
| CountUp on stats | `IntersectionObserver` 1 % | 1.8 s | cubic ease-out |
| FLIP on archive filter | state change | 460 ms | cubic(0.22, 1, 0.36, 1) |
| Lightbox open | modal mount | 300 ms | ease |
| Globe rotation to pin | click | manual raf | ease-out on `Y/F` angles |
| Data-reveal opacity+translateY | observer 12 %, rootMargin -10 % | 800 ms | var(--ease) |
| Custom cursor lerp | mousemove | 22 % lerp | — |

All respect `prefers-reduced-motion: reduce` (global override in CSS).

## 8. Data structure

`LOCATIONS_V2` — 14 locations with material.
```ts
{
  id: 'cerdena',                  // slug
  name: { en, es, it },
  country: { en, es, it },
  flag: '🇮🇹',
  coords: { lat, lng },
  cover: 'media/optimized/…jpg',
  accentColor: '#1E6FA4',
  year: 2025,
  description: { en, es },
  media: Media[]
}
```

`Media`
```ts
{
  id: 'cer-v2',                   // loc-prefix
  type: 'photo' | 'video' | 'pov',
  src: 'media/optimized/videos-drone/…mp4',
  poster?: 'media/optimized/posters/…jpg',  // resolved by 4-step matcher
  title: { en, es, it? },
  mood: 'oceanic' | 'golden' | 'cold' | 'warm' | 'green',
  altitude: 'aerial' | 'mountain' | 'street' | 'water',
  year: 2024,
  exif?: { camera, lens, loc },
  location: { id, name, flag, year }   // injected at init
}
```

`VISITED_DOTS_V2` — 30 decorative pins on cities without filmed material.
`STATS_V2` — derived at load: `{ countries, hours_flown, flights, projects }`. Both StatsBand and StorySection read from here so the numbers always match.
`HERO_SEQUENCE` — 3 clips with posters for the landing.
`PROFILE_PHOTOS` — 14 portraits rotated in Story.

Circuit breaker in `ranuk-data.js` drops any media whose `src` is not in `window.RANUK_ASSETS` (declared in `ranuk-manifest.js`), so 404s never reach the browser.

Poster matching priority (step-by-step):
1. `/media/optimized/posters/<basename>.jpg` if in manifest.
2. Best token match among location photos (≥ 50 % overlap).
3. Round-robin across location photos (no more "all 12 videos share the same thumb").
4. `loc.cover` fallback.

## 9. Technical architecture

- **Stack:** vanilla HTML + React 18 UMD + Three.js r158 + esbuild (single `ranuk-app.min.js` bundle, ~118 KB raw / 34 KB gzip).
- **Why not Next.js:** static GitHub Pages hosting is free, deploy is `git push`, no CI needed. The site has no DB, no auth, no personalisation; Next would add ~90 KB runtime for zero benefit today. Migration path is noted under "Future growth" if the site ever needs blog/ISR.
- **Why not Tailwind:** single-file inline `<style>` ships before React hydrates, so FCP is ~instant on the hero. Tailwind JIT would require a build pipeline for CSS. Current CSS ~30 KB uncompressed.
- **Bundler:** esbuild invoked by `build.js` — JSX compiled to `React.createElement`, IIFE format, es2019 target. Windows `--global-name` flag removed after v1 because it shadowed `window`.
- **Locales:** `build-locales.py` regenerates `/en/ /es/ /it/` from `index.html`, rewriting `<html lang>`, `og:locale`, `og:locale:alternate` (strips self-reference), `canonical`, and injects `window.RANUK_LANG`.
- **Three.js:** loaded lazily — only after the atlas enters viewport. Uses jsdelivr CDN `three@0.158.0` (~600 KB). Earth uses the project's classic `earth_atmos_2048.jpg` + normal + specular + clouds textures.
- **Preview downloads:** each video's download link resolves to `/media/optimized/previews/<basename>.mp4` if registered in the manifest, else falls back to `<src>#t=0,8` so browsers that honour media fragments stream only the first 8 s.
- **Lightbox:** custom video controls (play/pause, seek, time, mute). Native `<video controls>` chrome was removed because on iOS Safari it captured pointer events and shadowed the close button.
- **Analytics:** GA4 (`G-3PQHE07PV1`) with `anonymize_ip` and cookie `SameSite=None;Secure`.

## 10. Implementation plan (phases shipped)

- **Phase 0 (pre-Kiro):** initial scaffold.
- **Phase 1 (PR #1):** profile photo paths, preview fallback, `og:locale` alternates, clean `build.js`.
- **Phase 2 (PR #2):** poster mismatch, lightbox close v1, story-stats parity with StatsBand, CountUp threshold 0.01.
- **Phase 3 (PR #3):** custom video controls in lightbox (iOS Safari fix), 5 dedicated Alps posters, manifest now includes posters.
- **Phase 4 (current PR #4):** archive filters by place / mood / altitude, Story section acknowledges the multidisciplinary identity (engineer / data scientist / author), this `CREATIVE_BRIEF.md`.

## 11. Live MVP

Deployed at <https://ranukorbit.com>. Source at <https://github.com/RanuK12/Ranuk_Orbit>. Both `/` and `/es/ /en/ /it/` served by GitHub Pages from `main` branch.

## 12. Future growth

### SEO
- Per-location landing pages (`/atlas/cerdena`, `/atlas/patagonia`, …) with structured data `ImageGallery` + `VideoObject`. Today all media sits behind the single `/` URL, so individual places never rank.
- Add `<script type="application/ld+json">` with `VideoObject` for each hero clip (embedUrl, thumbnailUrl, uploadDate).
- Submit the sitemap to Google Search Console and Bing Webmaster Tools (pending).
- Publish a short interview article on the personal site that backlinks to Ranuk Orbit and vice-versa.

### Virality
- A "Watch the reel" dedicated 60-90 s film (hero CTA exists, target doesn't). Distribute on YouTube + Instagram Reels + LinkedIn.
- `/atlas/<place>` shareable deep-links — opening the site at a specific location auto-centres the globe and opens that place's lightbox.
- Downloadable "Ranuk Orbit Postcards" — high-res stills with subtle watermark, aimed at Pinterest + wallpaper communities.
- Collabs with DJI / Ray-Ban Meta creators programmes (press page is already scaffolded with "Ray-Ban Meta Creators" as 2025 mention).

### Monetisation
- Current: 5 service packages (`Drone Mini €390` → `Travel Story €1.790` + `Custom`).
- Next: preset destinations ("Sardinia 3-day aerial pack", "Patagonia 5-day expedition") with fixed pricing, calendar booking.
- Licensing: stock footage portal gated by email, per-clip pricing in USD/EUR.
- POV subscription: monthly members-only Patagonia POV series (form exists, backend missing).
- Print shop for the best 20 aerial stills.

### Tech debt
- Formspree endpoint still blank → form falls back to `mailto:`. Sign up and set `window.RANUK_FORMSPREE` in `index.html`.
- Generate the 82 real 8-second previews with `./gen-previews.sh` (needs `ffmpeg` local; fallback `#t=0,8` works today).
- Root `/` has `<html lang="en">` but `og:locale="es_AR"` — minor inconsistency, only matters if social crawlers hit the root instead of `/es/` `/en/` `/it/`.
- Zoom-to-pin cinematic transition on the atlas (today the globe just rotates); add camera-dolly + brief pause before opening the lightbox.
