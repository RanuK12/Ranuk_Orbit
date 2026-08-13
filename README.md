# Ranuk Orbit

Un proyecto de Ranuk IT Solutions para crear una plataforma web optimizada con PWA, despliegue automático y optimización de medios.

## Características Principales

- 🖼️ Optimización avanzada de imágenes (WebP, AVIF)
- 🎥 Optimización de videos (H.264, AV1)
- 📱 PWA (Progressive Web App)
- 🚀 Despliegue automático en Cloudflare Pages/Vercel
- 📊 Analytics integrado
- 🌐 SEO optimizado
- 🎨 Diseño responsive y moderno

## Estructura del Proyecto

```
Ranuk_Orbit/
├── README.md
├── DEPLOY_GUIDE.md
├── COMPRESS_PHOTOS.SH
├── COMPRESS_VIDEOS.SH
├── tareas_pendientes.md
├── media/
│   ├── optimized/
│   │   ├── avif/
│   │   ├── webp/
│   │   ├── h264/
│   │   ├── av1/
│   │   └── posters/
├── Fotos/
└── Videos/
```

## Guías y Scripts

### [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)
Guía completa para desplegar el proyecto en Cloudflare Pages o Vercel, incluyendo:
- Configuración de dominio personalizado
- Headers y redirecciones
- Configuración PWA
- SEO y performance
- Monitoreo y mantenimiento

### [COMPRESS_PHOTOS.SH](COMPRESS_PHOTOS.SH)
Script para optimizar imágenes:
- Convierte a WebP y AVIF
- Genera tamaños responsivos (400px, 800px, 1200px, 1600px)
- Crea galería HTML optimizada

### [COMPRESS_VIDEOS.SH](COMPRESS_VIDEOS.SH)
Script para optimizar videos:
- Convierte a H.264 y AV1
- Genera tamaños responsivos (640x360, 1280x720, 1920x1080)
- Crea miniaturas y galería HTML

## Tareas Pendientes

Ver [tareas_pendientes.md](tareas_pendientes.md) para un seguimiento detallado de las tareas por completar.

## Progreso Actual

El proyecto ha completado la optimización de recursos multimedia y el sistema de caché. Los próximos pasos incluyen:

1. Configurar dominio personalizado en Cloudflare/Vercel
2. Implementar sistema de analytics (Google Analytics + Cloudflare)
3. Configurar SSL y certificados automáticos
4. Optimizar SEO (meta tags, sitemap, robots.txt)

## Despliegue

1. **Cloudflare Pages** (Recomendado)
   - Conectar GitHub a Cloudflare Pages
   - Configurar dominio personalizado
   - Habilitar PWA

2. **Vercel** (Alternativa)
   - Importar repositorio
   - Configurar dominio
   - Optimizar para PWA

## Contribuciones

Este proyecto es parte de Ranuk IT Solutions. Para contribuciones:
1. Crea una rama desde `main`: `git checkout -b ranukita/<id>`
2. Realiza tus cambios
3. Haz commit con el tag `[ranukita:<id>]`
4. Abre un PR para revisión

## Contacto

- **Ranuk IT Solutions**: [ranuk.dev](https://ranuk.dev)
- **Email**: emilio@ranuk.dev
- **LinkedIn**: [Emilio Ranucoli](https://linkedin.com/in/emilio-ranucoli)