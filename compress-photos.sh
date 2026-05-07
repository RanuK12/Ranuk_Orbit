#!/usr/bin/env bash
# compress-photos.sh — Ranuk Orbit
# Convierte fotos originales (JPG/HEIC/PNG) a AVIF + WebP responsive
# Uso:
#   ./compress-photos.sh                        # procesa todo Fotos/
#   ./compress-photos.sh path/to/single.JPG     # una sola foto
#
# Requisitos: brew install webp libavif
# (sips ya viene con macOS para HEIC → JPEG temporal)

set -e

# ─── Config ───────────────────────────────────────────────────────────────
SRC_DIR="${1:-Fotos}"
OUT_DIR="media/optimized/fotos"
SIZES=(480 1280 1920)
AVIF_QUALITY=55          # 0-100, lower = smaller
WEBP_QUALITY=78
TMP_DIR=".tmp_compress"

# ─── Checks ───────────────────────────────────────────────────────────────
command -v cwebp >/dev/null 2>&1 || { echo "❌ cwebp no instalado. Corré: brew install webp"; exit 1; }
command -v avifenc >/dev/null 2>&1 || { echo "❌ avifenc no instalado. Corré: brew install libavif"; exit 1; }
command -v sips >/dev/null 2>&1 || { echo "❌ sips no encontrado (debería venir con macOS)"; exit 1; }

mkdir -p "$OUT_DIR" "$TMP_DIR"

# ─── Helper ───────────────────────────────────────────────────────────────
slugify() {
  echo "$1" | iconv -f UTF-8 -t ASCII//TRANSLIT 2>/dev/null \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g' \
    | sed -E 's/^-+|-+$//g'
}

process_one() {
  local input="$1"
  local filename=$(basename "$input")
  local ext="${filename##*.}"
  local name="${filename%.*}"
  local slug=$(slugify "$name")

  echo "→ $filename"

  # Convertir HEIC a JPEG temporal si hace falta
  local working_file="$input"
  case "${ext,,}" in
    heic|heif)
      working_file="$TMP_DIR/$slug.jpg"
      sips -s format jpeg "$input" --out "$working_file" >/dev/null
      ;;
  esac

  for size in "${SIZES[@]}"; do
    local resized="$TMP_DIR/${slug}-${size}.jpg"
    sips -Z "$size" "$working_file" --out "$resized" >/dev/null

    # AVIF
    avifenc --min 20 --max 50 -a end-usage=q -a cq-level=$AVIF_QUALITY \
      -j 4 -s 6 "$resized" "$OUT_DIR/${slug}-${size}.avif" >/dev/null 2>&1

    # WebP
    cwebp -q $WEBP_QUALITY -mt -quiet "$resized" -o "$OUT_DIR/${slug}-${size}.webp"
  done

  # Tamaños finales
  local avif_1280=$(stat -f%z "$OUT_DIR/${slug}-1280.avif" 2>/dev/null || echo 0)
  local webp_1280=$(stat -f%z "$OUT_DIR/${slug}-1280.webp" 2>/dev/null || echo 0)
  printf "    1280px → AVIF %dKB · WebP %dKB\n" $((avif_1280/1024)) $((webp_1280/1024))
}

# ─── Main ─────────────────────────────────────────────────────────────────
if [ -f "$SRC_DIR" ]; then
  process_one "$SRC_DIR"
else
  find "$SRC_DIR" -type f \( \
    -iname "*.jpg" -o -iname "*.jpeg" -o \
    -iname "*.heic" -o -iname "*.heif" -o \
    -iname "*.png" \
  \) -not -name ".*" | while read -r f; do
    process_one "$f"
  done
fi

# Cleanup
rm -rf "$TMP_DIR"

echo ""
echo "✓ Hecho. Output en: $OUT_DIR"
echo "  Total: $(du -sh "$OUT_DIR" | cut -f1)"
