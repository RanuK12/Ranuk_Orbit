# DNS Setup — ranukorbit.com en GitHub Pages

> Cómo apuntar `ranukorbit.com` (comprado en DigitalOcean) a GitHub Pages.

## Resumen del flujo
1. Crear repo en GitHub: `<tu-usuario>/ranukorbit` (público o privado, ambos sirven con Pages)
2. Habilitar GitHub Pages en el repo
3. Configurar DNS en DigitalOcean → 4 registros A + 1 CNAME
4. Esperar propagación (5 min a 24 horas)
5. Activar HTTPS en GitHub Pages

---

## Paso 1 — Repo de GitHub (si todavía no existe)

```bash
cd "/Users/emilio/Desktop/Oficina_Ranuk/Ranuk_Orbit_Project"
git init
git add -A
git commit -m "Initial commit — Ranuk Orbit v2"
gh repo create ranukorbit --public --source=. --remote=origin --push
```

(O si preferís sin `gh`: creá el repo desde web, copiá el URL y `git remote add origin ...`)

## Paso 2 — Habilitar GitHub Pages

1. Repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` · folder: `/ (root)` → **Save**
4. Esperá 1-2 minutos. Aparece la URL temporal: `https://<tu-usuario>.github.io/ranukorbit/`

## Paso 3 — Custom domain en GitHub Pages

1. Mismo Settings → Pages → **Custom domain** → escribir `ranukorbit.com` → **Save**
2. GitHub crea automáticamente un archivo `CNAME` en el repo con el contenido `ranukorbit.com`
3. Marcar **Enforce HTTPS** (después de que el DNS propague, ver paso 4)

## Paso 4 — DNS en DigitalOcean

### 4.1 Entrá al panel de DNS

1. DigitalOcean → **Networking** → **Domains** → click en `ranukorbit.com`
2. Vas a ver una tabla con los DNS records

### 4.2 Borrar cualquier registro A o CNAME existente

Si hay registros que apunten a un Droplet o a App Platform, borralos. Solo dejamos lo que vamos a configurar abajo.

### 4.3 Crear los 4 registros A para el apex (ranukorbit.com)

GitHub Pages requiere 4 IPs específicas. En DigitalOcean:

| Tipo | Hostname | Valor | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 3600 |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |

**Cómo:** Add Record → Tipo `A` → Hostname `@` (DigitalOcean lo convierte en el apex) → Value (la IP) → Create. Repetir 4 veces.

### 4.4 Crear el CNAME para www

| Tipo | Hostname | Valor | TTL |
|---|---|---|---|
| CNAME | `www` | `<tu-usuario>.github.io.` | 3600 |

⚠️ El punto final en `<tu-usuario>.github.io.` es importante: indica FQDN absoluto.

### 4.5 (Opcional) AAAA records para IPv6

Si querés IPv6 (recomendado, GitHub lo soporta):

| Tipo | Hostname | Valor | TTL |
|---|---|---|---|
| AAAA | `@` | `2606:50c0:8000::153` | 3600 |
| AAAA | `@` | `2606:50c0:8001::153` | 3600 |
| AAAA | `@` | `2606:50c0:8002::153` | 3600 |
| AAAA | `@` | `2606:50c0:8003::153` | 3600 |

## Paso 5 — Verificar propagación

Desde la terminal (en mac):

```bash
# Debe responder con las 4 IPs de GitHub
dig ranukorbit.com +short

# Debe responder con <tu-usuario>.github.io
dig www.ranukorbit.com +short
```

O usá https://www.whatsmydns.net y poné `ranukorbit.com` → debe ver las 4 IPs en todas las regiones.

**Tiempos típicos:**
- DigitalOcean propaga en ~5-15 minutos
- ISPs internacionales pueden tardar hasta 24h
- Si después de 1h `dig` no muestra las IPs, revisá los registros en DigitalOcean

## Paso 6 — Activar HTTPS en GitHub Pages

Una vez que el DNS propaga:

1. GitHub repo → Settings → Pages
2. Marcar **Enforce HTTPS** (la opción se habilita cuando GitHub valida el dominio)
3. GitHub emite un certificado Let's Encrypt automáticamente. Tarda ~10-30 min.

## Paso 7 — Verificar en producción

```bash
# Debe redirigir HTTP → HTTPS y mostrar el sitio
curl -I https://ranukorbit.com

# www debe redirigir al apex (configurado en GitHub Pages)
curl -I https://www.ranukorbit.com
```

Esperado:
```
HTTP/2 200
server: GitHub.com
```

---

## Checklist final

- [ ] Repo `ranukorbit` creado y pusheado
- [ ] GitHub Pages activado en branch `main`
- [ ] Custom domain `ranukorbit.com` agregado en Pages
- [ ] Archivo `CNAME` con contenido `ranukorbit.com` en el repo
- [ ] 4 registros A apuntando a `185.199.108-111.153` en DigitalOcean
- [ ] CNAME `www` apuntando a `<tu-usuario>.github.io.`
- [ ] (Opcional) 4 registros AAAA IPv6
- [ ] DNS propagado (verificado con `dig`)
- [ ] HTTPS forzado en GitHub Pages
- [ ] `https://ranukorbit.com` carga correctamente

---

## Troubleshooting

**Error "Domain does not resolve to GitHub Pages servers"**
→ El DNS no propagó aún. Esperá 30 min y reintentá. O `dig` no muestra las IPs correctas → revisá los registros A.

**Error "HTTPS not available"**
→ GitHub está emitiendo el certificado. Esperá ~30 min después de que el DNS propague.

**El sitio carga pero `www.` no funciona**
→ Falta el CNAME de `www` o falta el punto final en `<tu-usuario>.github.io.`

**El sitio carga `<tu-usuario>.github.io/ranukorbit/` pero no `ranukorbit.com`**
→ Falta el archivo `CNAME` en el repo. GitHub lo crea automáticamente al setear Custom domain, pero si lo borraste hay que recrearlo manualmente con contenido `ranukorbit.com`.

**Los assets (CSS, JS, videos) dan 404 en el dominio custom**
→ El sitio usa rutas relativas (`media/optimized/...`) que sí funcionan en custom domain. Si algún path arranca con `/ranukorbit/`, eso solo sirve en la URL temporal de GitHub. Verificá que ningún path en el HTML tenga `/ranukorbit/` hardcodeado.

---

_Última actualización: 2026-05-06_
