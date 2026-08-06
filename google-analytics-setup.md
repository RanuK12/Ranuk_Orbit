# Configuración de Google Analytics para Ranuk Orbit

## Pasos para Activar Google Analytics

### 1. Crear Cuenta de Google Analytics
1. Ir a [Google Analytics](https://analytics.google.com/)
2. Iniciar sesión con cuenta Google
3. Hacer clic en "Comenzar" → "Medir"
4. Seleccionar "Web" → "Web"
5. Ingresar información del sitio:
   - Nombre: Ranuk Orbit
   - URL: https://ranukorbit.com
   - Categoría: "Arte y entretenimiento"
   - Zona horaria: Argentina/Buenos Aires (UTC-3)
6. Hacer clic en "Crear"

### 2. Obtener ID de Seguimiento
1. Una vez creada la propiedad, copiar el ID de seguimiento (formato: G-XXXXXXXXXX)
2. Reemplazar "G-XXXXXXXXXX" en el archivo `index.html` línea ~30:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

### 3. Verificar Implementación
1. Usar [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjpdhgcnjdnpijlgnmb) para Chrome
2. Abrir el sitio web
3. Verificar en la consola de herramientas de desarrollador que se carga el script

### 4. Configuración en Cloudflare
1. Ir a Cloudflare Dashboard → Pages → Ranuk Orbit
2. Sección "Custom domains" → "Analytics"
3. Activar Cloudflare Analytics (se activa automáticamente con dominio personalizado)

### 5. Monitoreo
1. Esperar 24-48 horas para ver los primeros datos
2. Verificar en el panel de Google Analytics:
   - Usuarios
   - Sesiones
   - Tasa de rebote
   - Páginas más vistas
   - Dispositivos utilizados

## Notas Importantes
- El ID de Google Analytics debe ser único para cada sitio
- Puede tardar hasta 48 horas en mostrar datos reales
- Cloudflare Analytics proporciona datos adicionales de rendimiento
- Para sitios de alto tráfico, considerar Google Analytics 4 (GA4) en lugar de Universal Analytics
</parameter></function>