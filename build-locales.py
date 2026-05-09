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


def build(lang: str, og_locale: str, html: str) -> str:
    out = html

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
