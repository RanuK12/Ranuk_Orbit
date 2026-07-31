# ROADMAP — Ranuk Orbit
*Definición de alcance, tareas pendientes y fechas*
Última actualización: 2026-07-31

---

## 1. Alcance del proyecto

### ¿Qué es Ranuk Orbit?
Portfolio personal de Emilio Ranucoli — drone pilot, Ray-Ban Meta POV creator, travel photographer. Sitio estático multilingüe (ES/EN/IT) con globo 3D interactivo, lightbox premium y navegación tipo app.

### Incluye
- Sitio web estático (HTML + React 18 UMD + Babel Standalone)
- Globo 3D interactivo con textura NASA Blue Marble
- Lightbox v9 premium con controles custom y video
- Sistema de i18n completo (ES/EN/IT)
- Archivo de medios geolocalizados y organizados
- Service worker y cache busting
- Optimización de rendimiento y SEO

### NO incluye
- Desarrollo de aplicaciones móviles o desktop
- Creación de contenido nuevo (fotos, videos, textos)
- Integración con sistemas de booking/reservas
- E-commerce o venta de servicios

---

## 2. Estado actual

### ✅ Funcionalidades en producción
- Sitio principal en `ranukorbit.com` (GitHub Pages + Cloudflare)
- Globo 3D con 14 locations + atlas sidebar
- Lightbox con controles custom, video, imágenes
- Navegación completa en ES/EN/IT
- Optimización de fotos (AVIF/WebP responsive)
- Service worker para offline

### 🚧 Problemas pendientes
- **Divergencia de historias**: Force-push en main rompió las relaciones entre ramas
- **Rebuild Next.js 14** sin mergear (carpeta `next-app/` en rama `refactor/nextjs-14-rebuild`)
- **Múltiples ramas de fix/feat** sin mergear (12+ ramas activas)

### 📊 Estado de ramas clave
| Rama | Fecha último commit | Estado | Prioridad |
|------|-------------------|--------|-----------|
| main | 2026-06-22 | En producción | - |
| refactor/nextjs-14-rebuild | 2026-05-10 | Rebuild completo, sin mergear | P0 |
| fix/12-ux-improvements | 2026-05-15 | 12 mejoras UX, sin mergear | P1 |
| fix/lightbox-close-critical | 2026-05-14 | Fix de cierre lightbox, sin mergear | P0 |
| feat/lightbox-v9-premium-redesign | 2026-05-14 | Lightbox premium, sin mergear | P1 |

---

## 3. Tareas pendientes

### 🔴 P0 - Crítico (bloqueantes para deploy)
- **Reconstruir historias y mergear ramas** (10h)
  - Force-push en main rompió las relaciones de merge
  - Rebase o merge --allow-unrelated-histories
  - Prioridad: bloquea todos los demás cambios

- **Deploy del rebuild Next.js 14** (20h)
  - Validar feature parity vs sitio actual
  - Configurar deploy en Vercel/Cloudflare Pages
  - Migrar configuración de GA4, DNS, redirects

- **Fix críticos de UX** (5h)
  - Cierre de lightbox (rama fix/lightbox-close-critical)
  - Stats en Story section (rama fix/12-ux-improvements)

### 🟡 P1 - Alto (impacto inmediato)
- **Testimonios reales** (bloqueado, 5h)
  - Reemplazar placeholders en `ranuk-data.js`
  - Solicitar material a clientes reales
  - Agregar logos y traducciones

- **Landing pages por locación** (15h)
  - URLs `/en/places/sardinia/`, `/es/patagonia/`, etc.
  - Hero específico + archive completo por location
  - SEO: schema, meta tags, sitemap

- **Pipeline de video automatizado** (10h)
  - Automatizar compresión H.264/AV1 + poster
  - Integrar con CI/CD para nuevos uploads
  - Monitoreo de calidad y tamaño

### 🟢 P2 - Medio (mejoras continuas)
- **Métricas de performance** (5h)
  - Core Web Vitals (LCP, FID, CLS)
  - Monitorización con GA4 + RUM
  - Optimizar imágenes y lazy loading

- **Estrategia de contenido** (10h)
  - Blog: historias detrás de los viajes
  - Instagram: reels con highlights de locaciones
  - YouTube: tutoriales de drone y POV

- **Marketing y lanzamiento** (8h)
  - Email signature personalizada
  - Press kit con logos y contacto
  - Configurar redes sociales profesionales

### 🔵 P3 - Bajo (nice-to-have)
- **Mejoras UX/visuales** (rama fix/12-ux-improvements) (5h)
- **Fix varios pendientes** (10h)
- **Optimizaciones menores** (5h)

---

## 4. Roadmap con fechas

### Fase 1: Resolución técnica (2 semanas)
- **Semana 1 (2026-08-01 a 2026-08-07)**: 
  - Resolver divergencias de historias
  - Mergear ramas críticas (P0)
  - Validar rebuild Next.js

- **Semana 2 (2026-08-08 a 2026-08-14)**:
  - Deploy de rebuild Next.js a staging
  - Validación de feature parity
  - Fix críticos de UX

### Fase 2: Implementación (4 semanas)
- **Semana 3-4 (2026-08-15 a 2026-08-28)**:
  - Implementar testimonios reales
  - Crear landing pages por locación
  - Pipeline de video automatizado

- **Semana 5-6 (2026-08-29 a 2026-09-11)**:
  - Configurar métricas de performance
  - Implementar estrategia de contenido
  - Preparar marketing

### Fase 3: Lanzamiento y crecimiento (2 semanas)
- **Semana 7 (2026-09-12 a 2026-09-18)**:
  - Email signature + press kit
  - Configurar redes sociales
  - Contenido inicial para redes

- **Semana 8 (2026-09-19 a 2026-09-25)**:
  - Lanzamiento oficial
  - Promoción en redes
  - Seguimiento de métricas

---

## 5. Deuda técnica

### Historias divergentes
- Force-push en main rompió relaciones de merge
- Solución: `git merge --allow-unrelated-histories` o rebase interactivo

### Ramas sin mergear (12+)
- 3 ramas P0 críticas
- 4 ramas P1 de alto impacto
- 5+ ramas P2/P3 menores

### Archivos duplicados
- `next-app/` tiene su propio copy de componentes
- Posible duplicación de CSS/JS entre HTML y Next.js

---

## 6. Riesgos y bloqueantes

### 🚨 Riesgos altos
- **Contenido faltante**: Testimonios reales bloqueados hasta obtener material de clientes
- **Divergencia de historias**: Puede causar conflictos complejos al mergear
- **Performance**: Rebuild Next.js puede tener diferentes Core Web Vitals

### ⚠️ Riesgos medios
- **SEO**: Landing pages nuevas requieren migración cuidadosa
- **Mantenimiento**: Doble stack (HTML + Next.js) aumenta complejidad
- **Contenido**: Estrategia de contenido requiere tiempo constante

### ✅ Mitigaciones
- Priorizar merge de ramas antes de nuevo desarrollo
- Validar cada cambio en staging antes de producción
- Documentar decisiones técnicas en el repo

---

*Este ROADMAP será actualizado cada vez que se complete un milestone o cambien las prioridades.*