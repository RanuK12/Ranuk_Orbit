# Configuración de SSL y Certificados para Ranuk Orbit

## Información sobre SSL en Cloudflare

### Certificado SSL Automático
Cloudflare Pages proporciona certificados SSL automáticamente:

1. **Tipo de certificado**: Let's Encrypt (gratuito)
2. **Renovación automática**: Cada 90 días
3. **Compatibilidad**: TLS 1.2 y TLS 1.3
4. **Modo recomendado**: "Full (strict)" para máxima seguridad

### Pasos para Verificar SSL

#### 1. Verificar en Cloudflare Dashboard
1. Ir a Cloudflare Dashboard → Pages → Ranuk Orbit
2. Navegar a "Settings" → "Custom domains"
3. Verificar que el dominio `ranukorbit.com` esté configurado
4. Asegurarse de que el SSL esté en modo "Full (strict)"

#### 2. Verificar con Herramientas Externas
Usar estas herramientas para verificar el certificado:
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)
- [Qualys SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?ranukorbit.com)

#### 3. Configuración de Headers de Seguridad
El archivo `_headers` ya está configurado con:
- HSTS (si se desea agregar en el futuro)
- X-Frame-Options
- X-Content-Type-Options
- XSS Protection
- Referrer Policy

### Configuración HSTS (Opcional)
Para agregar HSTS, incluir en `_headers`:

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Nota**: Solo agregar HSTS después de verificar que SSL funciona correctamente.

### Renovación Automática
Cloudflare se encarga de:
1. Renovación automática del certificado
2. Monitorización de expiración
3. Notificaciones por correo si hay problemas

### Solución de Problemas
- **Certificado no válido**: Esperar propagación DNS (hasta 48h)
- **Errores de cadena**: Cloudflare maneja la cadena de certificados
- **Renovación fallida**: Contactar a Cloudflare soporte

## Notas Importantes
- El certificado SSL es gratuito y automático con Cloudflare
- No es necesario comprar o configurar certificados manualmente
- La configuración de SSL es parte del proceso de dominio personalizado
- Cloudflare proporciona cifrado de extremo a extremo
</parameter></function>