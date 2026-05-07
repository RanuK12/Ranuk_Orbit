# Ranuk Orbit — Brand Guidelines

> Documento de referencia para mantener la consistencia visual y verbal del proyecto.

## 1. Esencia de marca

**Tagline (EN):** Earth, from another angle.
**Tagline (ES):** La Tierra, desde otro ángulo.

**Voz:** editorial, contenida, con autoridad. Nunca corporativa, nunca emoji, nunca "wow factor" forzado.
**Tono:** primera persona singular cuando habla Emilio. Tercera persona sobria cuando habla la marca.

## 2. Sistema de color

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#0A0A0A` | Fondo principal oscuro, texto sobre claro |
| `--ink-soft` | `#1A1A1A` | Cards, sidebars, hover backgrounds |
| `--celestial` | `#F7F7F5` | Texto sobre oscuro, fondo principal claro |
| `--celestial-warm` | `#EDEAE3` | Sección Story, fondos editoriales |
| `--oceanic` | `#1E6FA4` | Acento azul (links, atlas markers Patagonia) |
| `--desert` | `#C9A227` | Acento dorado (hover, destacados, kicker) |
| `--alpine` | `#8FA8C0` | Categoría Drone (atlas) |
| `--forest` | `#2D7A4A` | Categoría Travel (atlas) |
| `--dusk` | `#6B4C7F` | Categoría POV (atlas) |
| `--line` | `rgba(247,247,245,0.12)` | Bordes suaves sobre oscuro |
| `--line-strong` | `rgba(247,247,245,0.28)` | Bordes principales sobre oscuro |

**Regla de oro:** los acentos (oceanic, desert) jamás se usan como fondos de bloque. Solo en bordes, líneas, micro-detalles tipográficos.

## 3. Tipografía

| Familia | Uso | Peso |
|---|---|---|
| **Italiana** | Display, titulares hero, sección titles | 400 (única) |
| **Marcellus** | Eyebrows, kickers, mayúsculas con tracking | 400 |
| **Cormorant Garamond** | Cuerpo editorial (Story, quotes), itálicas | 400 / 600 / 400 italic |
| **DM Sans** | UI, botones, formularios, footer, body de servicios | 300 / 400 / 500 / 600 |

**Reglas:**
- Italiana se usa en tamaños grandes (≥40px). En menor tamaño no se lee bien.
- Marcellus siempre con `letter-spacing: 0.3em-0.4em` y `text-transform: uppercase`.
- Nunca usar Inter, Roboto, Arial, Helvetica, fuentes sistema. Es slop.
- Nunca mezclar más de 3 familias en una misma sección.

## 4. Espaciado y layout

- `--max: 1440px` — ancho máximo de contenido
- `--gut: clamp(20px, 4vw, 80px)` — gutter responsive
- Section padding vertical: `clamp(80px, 12vh, 160px)`
- Cards: nunca `border-radius` redondeado tipo material design. Solo bordes rectos o `border-radius: 0`.

## 5. Iconografía

- SVG inline siempre. Nunca PNG, nunca icon fonts (FontAwesome).
- Stroke `1.2`-`1.5px`, color heredado (`currentColor`).
- Sin relleno (`fill: none`) salvo en logos sociales y botón WhatsApp.

## 6. Logo y monograma

**Monograma:** R con anillo orbital + cruz cardinal, dentro de círculo.
- Versión sobre fondo oscuro: glifo en `--celestial`.
- Versión sobre fondo claro: glifo en `--ink`.
- Tamaño mínimo: 32px de lado.

**Wordmark:** "Ranuk Orbit" en Italiana, kerning manual.

**Símbolo `⊕`:** se usa como mark en footer y loading screen. Es la firma minimal.

## 7. Fotografía

**Sí:**
- Tomas drone con horizonte limpio
- Color cinematográfico (warm shadows, cold highlights)
- Composiciones rule of thirds o golden ratio
- POV con encuadre estable, primera persona honesta

**No:**
- HDR exagerado
- Saturación bombeada (Instagram filter style)
- Marcas de agua visibles
- Logos de marca sobre la foto

## 8. Copy bilingüe

Todo el sitio debe estar en EN/ES paralelo. Estructura:
```js
{
  es: 'La Tierra, desde otro ángulo',
  en: 'Earth, from another angle'
}
```

**Tono ES:** voseo argentino moderado. "Empezamos por la historia. Qué querés contar..."
**Tono EN:** sintaxis simple, contracciones bienvenidas. "We start with the story. What you want to tell..."

## 9. Microinteracciones

- Cursor custom: dot 8px + trail circle 36px (mix-blend-mode difference).
- Hover en links: trail crece a 60px, color `--desert`.
- Page reveal: fade + 20px translateY, `cubic-bezier(0.22, 1, 0.36, 1)`.
- Konami code: easter egg habilitado (gallery extra).
- Audio toggle: hero tiene mute icon en bottom-right (ghost button).

## 10. No usar nunca

- Emojis en titulares ni en copy de marca
- Lorem ipsum (siempre coordenadas, fechas y nombres reales)
- Stock photos de drones genéricos
- Gradientes `purple → pink` (AI slop)
- Cards con borde izquierdo de color y gradiente sutil (AI slop)
- Botones con `border-radius: 12px` y sombra azul (AI slop)
- Frases corporativas: "soluciones integrales", "experiencia única", "innovador"

## 11. Distribución de marca

- **Web:** ranukorbit.com (canónico)
- **Booking:** cal.com/emilio-ranucoli
- **Email:** emilio@ranuk.dev (firma en `EMAIL_SIGNATURE.html`)
- **Press:** `PRESS_KIT.md` para periodistas

---

_Última actualización: 2026-05-06_
_Documento vivo. Si algo en el sitio no cumple estas reglas, este documento gana._
