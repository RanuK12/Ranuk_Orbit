# Pasos para lanzar Ranuk Orbit

Orden exacto. Marcá cada paso con [x] cuando lo completes.

---

## ✅ PASO 0 — Ya hecho

- [x] Sitio funcionando localmente
- [x] Hero comprimido (27 MB H.264 / 36 MB AV1, desde 477 MB)
- [x] Repositorio creado: https://github.com/RanuK12/Ranuk_Orbit
- [x] Todos los snippets de marketing generados

---

## 🟡 PASO 1 — Aplicar los snippets a los archivos existentes

Estos cambios son **manuales** porque tocan archivos JSX/HTML existentes.
Abrí cada archivo en tu editor (VS Code, Cursor) y hacé los cambios.

### 1.A — `Ranuk Orbit.html`

Abrir y hacer 3 cosas:

**1. Pegar meta tags SEO** (dentro del `<head>`, reemplazando los actuales):
- Abrí `HEAD_SNIPPETS.html`
- Copiá todo el contenido (sin las líneas `<!-- ... -->` de instrucciones)
- Pegalo dentro del `<head>` de `Ranuk Orbit.html`, reemplazando los meta tags actuales (charset, viewport, title, description)

**2. Pegar el script de Google Analytics 4** (antes del `</head>`):
- Abrí `GA4_SNIPPET.html`
- Seguí los pasos del comentario para crear tu propiedad GA4
- Reemplazá `G-RANUK_ORBIT_ID` (las 2 ocurrencias) con tu Measurement ID real
- Pegá el bloque `<script>` antes del `</head>`

**3. Pegar el CSS de marketing** (al final del `<style>` actual):
- Abrí `MARKETING_CSS.css`
- Copiá todo el contenido
- Pegalo al final del bloque `<style>` que ya existe en `Ranuk Orbit.html` (justo antes de `</style>`)

### 1.B — `ranuk-sections.jsx`

Abrir y hacer 5 cosas:

**1. Arreglar links del footer** (líneas 630-631):
```diff
- <a href="/privacy">{t.footer.privacy}</a>
- <a href="/terms">{t.footer.terms}</a>
+ <a href="/privacy.html">{t.footer.privacy}</a>
+ <a href="/terms.html">{t.footer.terms}</a>
```

**2. Reemplazar el form de contacto:**
- Crear cuenta gratis en https://formspree.io
- Crear un form, copiar el endpoint (formato: `https://formspree.io/f/xnnjkogw`)
- Abrí `CONTACT_FORM_SNIPPET.jsx`, reemplazá `FORMSPREE_ENDPOINT`
- Copiá la función `ContactForm` y pegala dentro de `ranuk-sections.jsx`
- En `ContactSection`, reemplazá el `<form>` actual por `<ContactForm />`

**3. Pegar StatsBand:**
- Copiá el contenido de `STATS_BAND_SNIPPET.jsx`
- Pegalo dentro de `ranuk-sections.jsx`
- En el componente `App`, montalo entre `<AtlasSection />` y `<ArchiveSection />`

**4. Pegar HowIWork y FAQ:**
- Copiá `HOW_I_WORK_SNIPPET.jsx` y `FAQ_SNIPPET.jsx`
- Pegalos dentro de `ranuk-sections.jsx`
- En `App`, montalos en este orden: `<ServicesSection />`, `<HowIWorkSection />`, `<FAQSection />`, `<ContactSection />`

**5. Pegar WhatsApp Float + Social Links:**
- Copiá `WHATSAPP_BUTTON_SNIPPET.jsx` y reemplazá `WHATSAPP_NUMBER` con tu número (formato `549223XXXXXXX`)
- Copiá `SOCIAL_LINKS_SNIPPET.jsx`
- En `App`, agregá `<WhatsAppFloat />` como último elemento (fuera de cualquier section)
- En el `Footer`, reemplazá los links sociales actuales por `<SocialLinks variant="list" />`

### 1.C — `ranuk-hero.jsx`

**1. Agregar HeroCTAs:**
- Copiá `CTA_HERO_SNIPPET.jsx` dentro de `ranuk-hero.jsx`
- Montá `<HeroCTAs />` dentro del contenedor principal del hero, después del título y antes del scroll-hint

---

## 🟡 PASO 2 — Generar iconos PNG

```bash
brew install imagemagick
cd "/Users/emilio/Desktop/Oficina_Ranuk/Ranuk_Orbit_Project"
mkdir -p icons
magick favicon.svg -background "#0A0A0A" -resize 16x16   icons/favicon-16.png
magick favicon.svg -background "#0A0A0A" -resize 32x32   icons/favicon-32.png
magick favicon.svg -background "#0A0A0A" -resize 192x192 icons/icon-192.png
magick favicon.svg -background "#0A0A0A" -resize 512x512 icons/icon-512.png
magick favicon.svg -background "#0A0A0A" -resize 180x180 apple-touch-icon.png
```

---

## 🟡 PASO 3 — Generar OG image

`og.jpg` de **1200×630 px** para previews en redes sociales:

1. Abrí Canva (o Figma): nuevo diseño 1200×630
2. Fondo: foto del hero (Cerdeña Maddalena) o el globe oscuro
3. Texto centrado:
   - "RANUK ORBIT" en Italiana grande
   - "Earth, from another angle." en Cormorant Garamond italic
   - URL chiquita abajo: `ranukorbit.com`
4. Exportar como JPEG calidad 85%, target <200 KB
5. Guardar como `og.jpg` en la raíz del proyecto

---

## 🟡 PASO 4 — Comprimir el resto de los videos

El batch automático ya corrió en background. Verificá:

```bash
ls -lh media/optimized/videos/
du -sh media/optimized/
```

Si querés agregar más videos al portfolio:

```bash
./compress-videos.sh "Videos/Drone_Favoritos/X.MP4" default
```

Para Ray-Ban Meta videos (ya hay 2.4 GB):

```bash
./compress-videos.sh "Videos/Rayban_Meta/X.mov" default
```

**Importante:** Antes del primer push a GitHub, verificá que `media/optimized/` pese **menos de 100 MB total**. Si pesa más, sacá los videos menos importantes (te recomiendo dejar 1 hero + 6-8 reels portfolio + 4-6 Ray-Ban POV).

---

## 🟡 PASO 5 — Crear cuenta Formspree

1. https://formspree.io/register
2. Verificar email
3. **New form** → nombre "Ranuk Orbit Contact" → email destinatario `emilio@ranuk.dev` (o el que uses)
4. Copiar endpoint (formato `https://formspree.io/f/xnnjkogw`)
5. Pegarlo en `ranuk-sections.jsx` donde está `FORMSPREE_ENDPOINT`

Free tier: 50 submissions/mes. Más que suficiente para empezar.

---

## 🟡 PASO 6 — Crear cuenta Google Analytics 4

1. https://analytics.google.com
2. Admin (engranaje abajo izq) → **Create Property**
3. Nombre: "Ranuk Orbit" · Time zone: Argentina · Currency: ARS (o EUR/USD)
4. **Data streams** → Web → URL: `https://ranukorbit.com` → Stream name: "Web"
5. Copiar **Measurement ID** (formato `G-XXXXXXXXXX`)
6. Pegarlo en `Ranuk Orbit.html` (las 2 ocurrencias de `G-RANUK_ORBIT_ID`)

**Tip:** Si tenés otra propiedad GA4 ya configurada en otra web tuya, podés usar la misma cuenta — Google permite múltiples propiedades dentro de una cuenta. Dale "Create" en el lado izquierdo del admin.

---

## 🟡 PASO 7 — Renombrar robots.txt

```bash
cd "/Users/emilio/Desktop/Oficina_Ranuk/Ranuk_Orbit_Project"
mv robots.production.txt robots.txt
```

---

## 🟡 PASO 8 — Verificación local antes del push

Levantar server local:

```bash
cd "/Users/emilio/Desktop/Oficina_Ranuk/Ranuk_Orbit_Project"
python3 -m http.server 8765
```

Abrir en navegador: **http://localhost:8765/Ranuk%20Orbit.html?v=99**

Recorrer el sitio y verificar:
- [ ] Hero CTAs visibles ("Ver portfolio" y "Trabajemos juntos")
- [ ] Stats band aparece entre Atlas y Archive
- [ ] How I Work se ve después de Services
- [ ] FAQ accordion abre/cierra cada item
- [ ] WhatsApp float aparece después de scrollear 25%
- [ ] Footer tiene links a `/privacy.html` y `/terms.html` y funcionan
- [ ] Lang switcher (ES/EN) cambia todo el contenido nuevo
- [ ] DevTools console: 0 errores en rojo
- [ ] DevTools Network: ningún archivo >5MB
- [ ] Form de contacto submit funciona (te tiene que llegar email de prueba)

---

## 🟡 PASO 9 — Push al repositorio

```bash
cd "/Users/emilio/Desktop/Oficina_Ranuk/Ranuk_Orbit_Project"

# Verificar que git tiene tu nombre, NO el de Claude
git config user.name        # debe decir RanuK12
git config user.email       # tu email

# Init si no está iniciado
git init -b main 2>/dev/null

# Agregar el remote (solo primera vez)
git remote add origin https://github.com/RanuK12/Ranuk_Orbit.git 2>/dev/null

# Verificar .gitignore funciona
git status --ignored | grep -E "(Fotos|Videos)" && echo "OK ignoradas"

# Stage + commit + push
git add .
git status   # revisar que no aparezcan Fotos/ ni Videos/ ni nada >100MB

git commit -m "Ranuk Orbit v2 — initial production"
git push -u origin main
```

**Importante:** los commits van a estar firmados solo con tu nombre/email. Sin atribución a nadie más.

---

## 🟡 PASO 10 — Conectar Cloudflare Pages

1. https://dash.cloudflare.com/ → Workers & Pages → **Create application**
2. **Pages** → **Connect to Git** → autorizar GitHub
3. Seleccionar `RanuK12/Ranuk_Orbit`
4. Build settings:
   - Framework preset: **None**
   - Build command: (vacío)
   - Build output directory: `/` (raíz)
5. **Save and Deploy**

En 2-3 minutos tu sitio está en `<algo>.pages.dev`. Probá que cargue correcto.

---

## 🟡 PASO 11 — Apuntar el dominio

Cuando tengas comprado `ranukorbit.com`:

1. Cloudflare Pages → tu proyecto → **Custom domains** → **Set up custom domain**
2. Agregar `ranukorbit.com` y `www.ranukorbit.com`
3. Cloudflare te muestra los DNS records → copiarlos al panel de tu registrar
   (NameCheap, GoDaddy, etc.)
4. Esperar propagación (5 min - 24h)
5. SSL se activa solo

---

## 🟡 PASO 12 — Submit a buscadores

**Google Search Console:**
1. https://search.google.com/search-console
2. **Add property** → URL prefix → `https://ranukorbit.com`
3. Verificar (vía DNS TXT record o subiendo archivo HTML)
4. Sitemaps → agregar `https://ranukorbit.com/sitemap.xml`
5. URL Inspection → pegar `https://ranukorbit.com` → **Request indexing**

**Bing Webmaster Tools:**
1. https://www.bing.com/webmasters
2. Importar desde Google Search Console (1 click)

---

## 🟡 PASO 13 — Promoción día 1

**Instagram (@emi_ranucoli):**
- Reel con clip del hero + texto overlay "Está al aire."
- Story con countdown + sticker "Link in bio"
- Cambiar bio: agregar `ranukorbit.com`

**LinkedIn (emilio-ranucoli):**
- Post profesional: "Después de 3 años volando, lancé Ranuk Orbit. Drone, Ray-Ban Meta POV y foto editorial. [link]"
- Pin el post

**X (@EmilioRanucoli):**
- Tweet con foto del hero + link
- Pinear el tweet

**VSCO:**
- Update bio con `ranukorbit.com`

**WhatsApp directo (mejor conversión):**
- Mandar a 20-30 contactos profesionales personalmente: "Lancé el sitio nuevo, te paso el link por si te interesa: [url]"

---

## 🟡 PASO 14 — Métricas que mirar (semana 1)

Abrir GA4 cada 2 días y mirar:
- **Realtime** → confirmar que GA4 está trackeando
- **Reports → Engagement → Events** → ver `cta_click`, `whatsapp_click`, `social_click`
- **Reports → Acquisition → Traffic sources** → de dónde viene la gente
- **Reports → User attributes → Geography** → desde qué países

**Métricas saludables semana 1:**
- 100-300 visitas únicas (depende cuánto promociones)
- Tasa de rebote <60%
- 1-3 leads vía formulario
- Tiempo medio de sesión >1:30

---

## 🟢 Si algo se rompe

| Síntoma | Causa probable | Solución |
|---|---|---|
| Página en blanco | JSX con error de sintaxis | DevTools console → buscar el error |
| OG image no aparece en WhatsApp | Cache de WhatsApp | Forzar con `?v=2` en el link compartido |
| Form no envía | Endpoint Formspree mal | Verificar URL en `ranuk-sections.jsx` |
| Hero video no autoplay en iOS | Falta `playsinline muted` | Verificar `<video>` tag |
| GA4 no trackea | Measurement ID mal pegado | DevTools → buscar `gtag` en console |
| Stats band no se ve | Falta CSS pegado | Pegar `MARKETING_CSS.css` al `<style>` |
| Links `/privacy` 404 | No actualizaste el footer | Cambiar a `/privacy.html` |

---

## 🟢 Resumen ejecutivo

```
HOY (2-3 horas):
  ├─ Aplicar snippets manuales (PASO 1)
  ├─ Generar iconos + OG (PASOS 2, 3)
  ├─ Crear Formspree + GA4 (PASOS 5, 6)
  └─ Verificar local (PASO 8)

MAÑANA (1-2 horas):
  ├─ Push a GitHub (PASO 9)
  ├─ Conectar Cloudflare Pages (PASO 10)
  └─ Apuntar dominio (PASO 11) — depende de cuándo lo compres

DÍA 3 (30 min):
  ├─ Search Console + Bing (PASO 12)
  └─ Promoción social (PASO 13)

SEMANA 1+:
  └─ Mirar GA4 cada 2 días (PASO 14)
```
