# Ranuk Orbit

> Earth, from another angle.

Personal portfolio of [Emilio Ranucoli](https://ranukorbit.com) — drone pilot, Ray-Ban Meta POV creator, and travel photographer based in Mar del Plata, Argentina.

🌐 **Live site:** [ranukorbit.com](https://ranukorbit.com)
📷 **Instagram:** [@emilio_ranucoli](https://www.instagram.com/emilio_ranucoli)
✉️ **Contact:** emilio@ranuk.dev

---

## Stack

- **No build step.** Plain HTML + React 18 (loaded via UMD) + Babel Standalone for inline JSX.
- **Three.js 0.158** for the photorealistic Earth globe (NASA Blue Marble texture).
- **Bilingual ES/EN** with custom i18n context provider.
- **Inline `<style>`** with design tokens (`--ink`, `--celestial`, `--desert`, etc.).
- **Typography:** Italiana, Marcellus, Cormorant Garamond, DM Sans (all Google Fonts).

This is intentionally a **zero-dependency, deploy-anywhere** static site. Drop the folder on any static host and it works.

---

## Estructura

```
Ranuk_Orbit_Project/
├── Ranuk Orbit.html       # entrypoint principal
├── ranuk-data.js          # data layer (locations, services, copy IDs)
├── ranuk-i18n.jsx         # i18n provider (ES/EN)
├── ranuk-hero.jsx         # hero section + nav
├── ranuk-globe.jsx        # Three.js Earth globe + atlas sidebar
├── ranuk-sections.jsx     # archive, story, services, contact, footer
├── ranuk-lightbox.jsx     # full-screen media viewer
├── privacy.html           # política de privacidad bilingüe
├── terms.html             # términos bilingües
├── 404.html               # página de error
├── manifest.json          # PWA manifest
├── favicon.svg            # icono SVG
├── sitemap.xml            # SEO sitemap
├── robots.txt             # crawler rules
├── vercel.json            # deploy config para Vercel
├── _redirects             # deploy config para Cloudflare Pages / Netlify
├── _headers               # security + cache headers
├── compress-photos.sh     # AVIF + WebP responsive
├── compress-videos.sh     # H.264 + AV1 + poster
├── media/optimized/       # assets web (lo único que va al deploy)
└── (docs internos *.md no versionados — ver .gitignore)
```

**Originales:** `Fotos/` y `Videos/` están en `.gitignore`. Los masters viven en disco local + cold storage (Cloudflare R2). Solo las versiones optimizadas van al repo.

---

## Local development

```bash
# Servidor estático rápido (no necesita CORS workaround)
python3 -m http.server 8765
# → http://localhost:8765/Ranuk%20Orbit.html
```

Cambios al HTML/JSX se ven con un refresh. Si tocás el `<style>` inline de `Ranuk Orbit.html`, agregá `?v=N` al URL para bustear el cache de Chrome.

---

## Compresión de media

Antes de hacer push, comprimí los assets nuevos:

```bash
# Instalar tools (una sola vez)
brew install ffmpeg webp libavif

# Fotos
./compress-photos.sh Fotos/Fotos_Drone/Nueva.JPG

# Videos
./compress-videos.sh Videos/Drone/Hero.MP4 hero
```

Ver `MEDIA_PLAN.md` para la estrategia completa.

---

## Deploy

Ver `DEPLOY_GUIDE.md`. Resumen:

1. Crear repo en GitHub
2. Conectar a Cloudflare Pages (o Vercel)
3. Apuntar el dominio `ranukorbit.com` al hosting
4. SSL auto, deploy auto en cada push

---

## Copyright

© 2026 Emilio Ranucoli. Todos los derechos reservados. Ver `LICENSE` para términos completos.

Las fotos, videos, código y diseño de este repositorio son obra original de Emilio Ranucoli. No se permite reproducción, redistribución, ni uso para entrenar modelos de IA sin permiso escrito previo.
