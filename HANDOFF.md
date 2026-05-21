# HANDOFF — Ranuk Orbit

## Propósito
Portfolio personal de Emilio Ranucoli — drone pilot, creador POV Ray-Ban Meta y fotógrafo de viajes. Sitio estático multilingüe (ES/EN/IT) con globo 3D, lightbox premium y navegación tipo app.

## Estado actual
- ✅ Sitio principal en HTML estático funcionando en ranukorbit.com
- ✅ Next.js 14 rebuild en carpeta `next-app/` (en progreso)
- ✅ i18n completo con traducciones en `messages/`
- 🚧 Algunas ramas feat/ fix/ pendientes de merge

## Stack clave
- HTML5 + React 18 UMD + Babel Standalone (site actual)
- Next.js 14 + TypeScript + Tailwind (rebuild)
- Three.js 0.158 para el globo terrestre
- Cloudflare Pages / Vercel para deploy

## Qué funciona
- Globo 3D interactivo con textura NASA Blue Marble
- Lightbox v9 con controles custom y cierre robusto
- Sistema de posters optimizados (AVIF/WebP)
- Cache busting y service worker

## Qué está roto / pendiente
- Rebuild Next.js no deployado a producción aún
- Algunas ramas de fix con mejoras de UX sin mergear
- Optimización de video mobile en progreso

## Próximos pasos
1. Terminar rebuild Next.js y validar feature parity
2. Mergear ramas `fix/12-ux-improvements` y `fix/lightbox-close-critical`
3. Deploy del next-app a Vercel/Cloudflare

## Notas para retomar
- Los masters de fotos/videos están en `.gitignore`; solo subir `media/optimized/`
- Usar `compress-photos.sh` y `compress-videos.sh` antes de push
- El preloader y las animaciones dependen de GSAP + ScrollTrigger
