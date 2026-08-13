# Configuración de Cloudflare para Ranuk Orbit

## Pasos para Configurar Cloudflare Pages

### 1. Conectar GitHub a Cloudflare Pages
1. Ir a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navegar a "Pages" → "Create project"
3. Seleccionar "Connect to Git"
4. Conectar cuenta de GitHub
5. Seleccionar repositorio: RanuK12/Ranuk_Orbit
6. Configurar:
   - Build command: `npm run build` (o dejar vacío para sitio estático)
   - Output directory: `/` (raíz del proyecto)
   - Marcar "Builds on branch: main"
7. Hacer clic en "Save and Deploy"

### 2. Configurar Dominio Personalizado
1. Una vez desplegado, ir a "Custom domains" en el proyecto Pages
2. Agregar dominio: `ranukorbit.com`
3. Cloudflare verificará automáticamente el dominio mediante DNS
4. Cloudflare proporcionará automáticamente certificado SSL

### 3. Configuración DNS
Cloudflare configurará automáticamente los registros DNS necesarios:
- A record: apunta a la dirección IP de Cloudflare Pages
- CNAME: para subdominios si se necesitan
- SSL: certificado gratuito automático

### 4. Configuración de Analytics
1. Ir a "Analytics" en el proyecto Pages
2. Activar Cloudflare Analytics (se activa automáticamente)
3. Verificar que los datos comienzan a recopilarse después del despliegue

### 5. Configuración de Rendimiento
1. Ir a "Speed" → "Optimization"
2. Habilitar:
   - Auto Minify (HTML, CSS, JS)
   - Brotli Compression
   - Cache Level: Standard
3. Configurar caché de assets para 1 año

### 6. Configuración de Seguridad
1. Ir a "Security" → "WAF"
2. Configurar reglas básicas:
   - Modo: "Medium"
   - Firewall: activado
   - DDoS Protection: activado
3. Configurar Rate Limiting si es necesario

### 7. Monitoreo
1. Ir a "Analytics" para ver:
   - Tráfico
   - Rendimiento
   - Errores
   - Orígeo geográfico
2. Configurar alertas para:
   - Errores 5xx
   - Tiempos de carga lentos
   - Tráfico inusual

## Solución de Problemas Comunes
- **404 en assets**: Verificar rutas en `_redirects`
- **SSL errors**: Esperar propagación DNS (hasta 48h)
- **Performance**: Optimizar imágenes y habilitar compresión
- **Cache problems**: Purgar cache de Cloudflare si es necesario

## Notas Importantes
- Cloudflare Pages es gratuito para proyectos personales
- El despliegue automático ocurre con cada push a la rama `main`
- Los cambios pueden tardar hasta 5 minutos en reflejar en vivo
- Cloudflare proporciona CDN global para mejor rendimiento
</parameter></function>