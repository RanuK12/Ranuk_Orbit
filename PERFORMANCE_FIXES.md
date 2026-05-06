# Performance — diagnóstico y fixes

## El problema real

El sitio carga lento por **5 razones combinadas**, no solo media:

### 1. Babel Standalone en producción (CRÍTICO)
React + Babel se cargan vía CDN como `<script type="text/babel">` y **el navegador compila JSX EN VIVO** en cada visita. Eso es ~600 KB de Babel + tiempo de parseo. En el cliente. **Cada vez.**

**Fix:** Compilar JSX una vez con esbuild en local y entregar JS plano.

### 2. Hero video pesado al cargar
Aún comprimido a 25 MB, **el navegador empieza a bajarlo apenas carga la página** (es preload del hero). 25 MB en una conexión móvil = 5-15 segundos.

**Fix:** lazy-load del hero con poster + autoplay solo cuando esté visible. Usar el AV1 más liviano si el browser lo soporta.

### 3. Globe Three.js textura NASA
La textura de Blue Marble es ~4-8 MB en alta resolución. Se baja siempre.

**Fix:** versión low-res por default, alta-res lazy (intersection observer cuando el atlas está visible).

### 4. Fonts blocking
4 familias de Google Fonts (Italiana, Marcellus, Cormorant Garamond, DM Sans) = ~200 KB de fonts + render-blocking durante el FCP.

**Fix:** `font-display: swap` (ya está), pero además precargar las 2 más críticas (Italiana + DM Sans) con `<link rel="preload" as="font">`.

### 5. Imágenes JPG sin AVIF/WebP
Las fotos del archive son JPG originales pesadas. Sin lazy load adecuado.

**Fix:** correr `compress-photos.sh` y migrar el JSX a `<picture>` con AVIF + WebP.

---

## Plan de fixes — orden de impacto

### 🔴 Fix 1 — Pre-compilar JSX (impacto: -1.5s en LCP)

Reemplazar Babel runtime por build offline:

```bash
# Instalar esbuild una vez
brew install esbuild

# Compilar todos los JSX a un solo bundle JS
cd "/Users/emilio/Desktop/Oficina_Ranuk/Ranuk_Orbit_Project"

# Concatenar JSX en orden de dependencia
cat ranuk-i18n.jsx ranuk-hero.jsx ranuk-globe.jsx ranuk-lightbox.jsx ranuk-sections.jsx > /tmp/ranuk-all.jsx

# Build
esbuild /tmp/ranuk-all.jsx \
  --bundle=false \
  --loader:.jsx=jsx \
  --jsx=transform \
  --jsx-factory=React.createElement \
  --jsx-fragment=React.Fragment \
  --target=es2020 \
  --minify \
  --outfile=ranuk-app.min.js
```

Después, en `Ranuk Orbit.html`, reemplazá:

```html
<!-- ANTES -->
<script src="https://unpkg.com/@babel/standalone@7.24.0/babel.min.js"></script>
<script type="text/babel" src="ranuk-i18n.jsx"></script>
<script type="text/babel" src="ranuk-hero.jsx"></script>
<script type="text/babel" src="ranuk-globe.jsx"></script>
<script type="text/babel" src="ranuk-lightbox.jsx"></script>
<script type="text/babel" src="ranuk-sections.jsx"></script>

<!-- DESPUÉS -->
<script src="ranuk-app.min.js" defer></script>
```

**Ahorro:** ~600 KB de Babel + parseo en cliente. Gain real: 1-2s en mobile 4G.

---

### 🔴 Fix 2 — Hero video: defer + intersection observer

Idea: cargar **solo el poster** al inicio. El video empieza a bajar cuando entra en viewport.

```html
<!-- En Ranuk Orbit.html, reemplazar el preload del hero -->
<!-- ELIMINAR esta línea: -->
<!-- <link rel="preload" as="video" href="/media/optimized/videos/hero.mp4" type="video/mp4" /> -->
```

Y en `ranuk-hero.jsx` cambiar el `<video autoplay>` por algo así:

```jsx
function HeroVideo({ src, poster }) {
  const ref = React.useRef(null);
  const [shouldLoad, setShouldLoad] = React.useState(false);

  React.useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        obs.disconnect();
      }
    }, { rootMargin: '100px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      poster={poster}
      autoPlay muted loop playsInline
      preload={shouldLoad ? "auto" : "none"}
      style={{width:'100%', height:'100%', objectFit:'cover'}}
    >
      {shouldLoad && (
        <>
          <source src={src.replace('.mp4', '.av1.mp4')} type='video/mp4; codecs="av01.0.05M.08"' />
          <source src={src} type="video/mp4" />
        </>
      )}
    </video>
  );
}
```

**Ahorro:** -25 MB en el primer paint. La página dibuja el poster en <1s.

---

### 🟡 Fix 3 — Three.js globe: lazy-mount

El globe solo importa cuando el usuario llega a la sección Atlas. Mientras tanto, mostrá el cover.

En `ranuk-globe.jsx`, envolvé el mount del WebGL así:

```jsx
function AtlasSection() {
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);
        obs.disconnect();
      }
    }, { rootMargin: '300px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section section-light" id="explore">
      {/* ...header... */}
      <div className="globe-wrap">
        {active ? <Globe /> : <div className="globe-placeholder" />}
      </div>
      {/* ...sidebar... */}
    </section>
  );
}
```

**Ahorro:** Three.js (~600 KB) + textura NASA (~4 MB) no se bajan hasta que el usuario scrollee al atlas. Mejora dramática del First Input Delay.

---

### 🟡 Fix 4 — Preload fonts críticas

Agregar al `<head>` de `Ranuk Orbit.html`:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="https://fonts.gstatic.com/s/italiana/v17/QldNNTtLsx4E__B0XQ.woff2" />
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHTWEBlw.woff2" />
```

(Las URLs reales las sacás del CSS de Google Fonts. Inspeccioná `https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:wght@300;400&display=swap` y copiá los `src: url(...)` que correspondan a `latin`).

**Ahorro:** -200ms en FCP.

---

### 🟡 Fix 5 — Comprimir las fotos del archive

Las fotos en `media/fotos-drone/` y `media/fotos-rayban/` siguen siendo JPG originales. Pasalas a AVIF + WebP responsive:

```bash
./compress-photos.sh Fotos/Fotos_Drone
./compress-photos.sh Fotos/Imagenes_Rayban-Meta
```

Después en `ranuk-data.js` apuntá los paths a `media/optimized/fotos/...`.

**Ahorro:** ~80% del peso por imagen.

---

## Métricas objetivo (Lighthouse)

| Métrica | Antes (estimado) | Target | Cómo |
|---|---|---|---|
| LCP (Largest Contentful Paint) | ~5-7s | <2.5s | Fix 1 + 2 + 4 |
| FID (First Input Delay) | ~300ms | <100ms | Fix 1 + 3 |
| CLS (Cumulative Layout Shift) | OK | <0.1 | Ya está |
| Total bundle inicial | ~10 MB | <2 MB | Fix 1 + 2 + 3 |
| Performance score | 50-60 | 90+ | Todos |

---

## Test antes y después

```bash
# Cuando termines un fix, test en local:
# Chrome DevTools → Lighthouse → Mobile · Performance only · Run

# O via CLI (más reproducible):
brew install lighthouse
lighthouse http://localhost:8765/Ranuk%20Orbit.html \
  --only-categories=performance \
  --emulated-form-factor=mobile \
  --view
```

---

## Resumen ejecutivo

```
SI HACÉS SOLO 1 FIX:
  → Fix 1 (compilar JSX). Deja el sitio 2x más rápido.

SI HACÉS 2 FIXES:
  → Fix 1 + Fix 2 (defer hero). Deja el sitio 4x más rápido.

SI HACÉS LOS 5:
  → Lighthouse 90+, sitio top mundial.
```

Te tomo el siguiente turno cuando me des luz verde para empezar con Fix 1 — necesito que el JSX esté final (con los snippets pegados) para hacer un solo bundle definitivo.
