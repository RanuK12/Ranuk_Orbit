#!/usr/bin/env python3
"""
build-locales.py — regenerate /es/index.html, /en/index.html, /it/index.html
from the canonical /index.html.

Each locale gets:
  - <html lang="xx">
  - <script>window.RANUK_LANG="xx"</script> injected right after <head>
  - canonical / og:url pointing to /xx/
  - og:locale = the page's locale
  - og:locale:alternate lines list *only* the other two locales
  - <link rel="alternate" hreflang="xx" href="…/xx/"> + x-default

Usage:  python3 build-locales.py
"""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
SRC = ROOT / "index.html"

LOCALES = {
    "es": "es_AR",
    "en": "en_US",
    "it": "it_IT",
}

# The application copy is translated client-side, but titles and descriptions
# are read by crawlers before JavaScript runs. Give every public locale its
# own search snippet instead of serving the English metadata on all routes.
SEO = {
    "en": {
        "title": "Ranuk Orbit | Drone Cinematography & Travel Films",
        "description": "Cinematic drone films, aerial photography and travel storytelling by Emilio Ranucoli. Available worldwide for hospitality, destinations, editorial and brands.",
    },
    "es": {
        "title": "Ranuk Orbit | Cine con dron y narrativa de viajes",
        "description": "Películas con dron, fotografía aérea y narrativa de viajes de Emilio Ranucoli. Disponible para destinos, hotelería, editorial y marcas en todo el mundo.",
    },
    "it": {
        "title": "Ranuk Orbit | Cinematografia con drone e film di viaggio",
        "description": "Film con drone, fotografia aerea e storytelling di viaggio di Emilio Ranucoli. Disponibile in tutto il mondo per destinazioni, ospitalità, editoria e brand.",
    },
}


def build(lang: str, og_locale: str, html: str) -> str:
    out = html
    seo = SEO[lang]

    out = re.sub(r'<title>[^<]*</title>', f'<title>{seo["title"]}</title>', out, count=1)
    for name in ("description", "twitter:description"):
        out = re.sub(
            rf'(<meta name="{re.escape(name)}" content=")[^"]*("\s*/>)',
            rf'\g<1>{seo["description"]}\g<2>',
            out,
            count=1,
        )
    out = re.sub(
        r'(<meta property="og:title" content=")[^"]*("\s*/>)',
        rf'\g<1>{seo["title"]}\g<2>',
        out,
        count=1,
    )
    out = re.sub(
        r'(<meta property="og:description" content=")[^"]*("\s*/>)',
        rf'\g<1>{seo["description"]}\g<2>',
        out,
        count=1,
    )

    # <html lang="…">
    out = re.sub(r'<html\s+lang="[^"]*"', f'<html lang="{lang}"', out, count=1)

    # Inject window.RANUK_LANG right after <head>
    out = out.replace(
        "<head>",
        f'<head>\n<script>window.RANUK_LANG="{lang}"</script>',
        1,
    )

    # canonical + og:url → /xx/
    out = re.sub(
        r'<link rel="canonical" href="https://ranukorbit\.com/?"\s*/>',
        f'<link rel="canonical" href="https://ranukorbit.com/{lang}/" />',
        out,
    )
    out = re.sub(
        r'<meta property="og:url" content="https://ranukorbit\.com/?"\s*/>',
        f'<meta property="og:url" content="https://ranukorbit.com/{lang}/" />',
        out,
    )

    # og:locale (primary)
    out = re.sub(
        r'<meta property="og:locale" content="[^"]*"\s*/>',
        f'<meta property="og:locale" content="{og_locale}" />',
        out,
        count=1,
    )

    # og:locale:alternate — rebuild so the current locale is NOT listed as alternate
    others = [loc for code, loc in LOCALES.items() if code != lang]
    alt_block = "\n".join(
        f'<meta property="og:locale:alternate" content="{loc}" />' for loc in others
    )
    out = re.sub(
        r'(<meta property="og:locale:alternate"[^>]*/>\s*\n?)+',
        alt_block + "\n",
        out,
        count=1,
    )

    return out


def main() -> int:
    html = SRC.read_text(encoding="utf-8")
    for lang, og_locale in LOCALES.items():
        out_dir = ROOT / lang
        out_dir.mkdir(exist_ok=True)
        out_path = out_dir / "index.html"
        out_path.write_text(build(lang, og_locale, html), encoding="utf-8")
        print(f"  wrote {out_path.relative_to(ROOT)}")
    print("done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
