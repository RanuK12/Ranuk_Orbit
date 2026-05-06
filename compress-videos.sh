#!/usr/bin/env bash
# compress-videos.sh — Ranuk Orbit
# Comprime videos a H.264 1080p + AV1 1080p + poster JPEG
# Uso:
#   ./compress-videos.sh                                # procesa todo Videos/
#   ./compress-videos.sh Videos/Drone_Favoritos/X.MP4   # uno solo
#   ./compress-videos.sh path/to/file.MP4 hero          # marca como hero (más comprimido)
#
# Requisitos: brew install ffmpeg

set -e

SRC_DIR="${1:-Videos}"
PROFILE="${2:-default}"   # default | hero | thumb
OUT_DIR="media/optimized/videos"
POSTER_DIR="media/optimized/posters"

# Profiles
case "$PROFILE" in
  hero)
    H264_CRF=26
    AV1_CRF=34
    SCALE=1920
    AUDIO=""
    ;;
  thumb)
    H264_CRF=28
    AV1_CRF=36
    SCALE=720
    AUDIO="-an"
    ;;
  *)
    H264_CRF=23
    AV1_CRF=32
    SCALE=1920
    AUDIO="-c:a aac -b:a 128k -ac 2"
    ;;
esac

# ─── Checks ───────────────────────────────────────────────────────────────
command -v ffmpeg >/dev/null 2>&1 || { echo "❌ ffmpeg no instalado. Corré: brew install ffmpeg"; exit 1; }

mkdir -p "$OUT_DIR" "$POSTER_DIR"

slugify() {
  echo "$1" | iconv -f UTF-8 -t ASCII//TRANSLIT 2>/dev/null \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g' \
    | sed -E 's/^-+|-+$//g'
}

process_one() {
  local input="$1"
  local filename=$(basename "$input")
  local name="${filename%.*}"
  local slug=$(slugify "$name")
  local size_in=$(du -m "$input" | cut -f1)

  echo "→ $filename ($size_in MB)"

  # 1. Poster (frame en segundo 2)
  ffmpeg -y -loglevel error -i "$input" \
    -ss 00:00:02 -vframes 1 -q:v 3 \
    -vf "scale=${SCALE}:-2" \
    "$POSTER_DIR/${slug}.jpg"

  # 2. H.264 1080p MP4 (compatible con todo)
  ffmpeg -y -loglevel error -i "$input" \
    -c:v libx264 -crf $H264_CRF -preset slow \
    -profile:v high -level 4.1 -pix_fmt yuv420p \
    -vf "scale=${SCALE}:-2:flags=lanczos" \
    $AUDIO \
    -movflags +faststart \
    "$OUT_DIR/${slug}.mp4"

  # 3. AV1 1080p (más liviano, navegadores modernos)
  if ffmpeg -encoders 2>/dev/null | grep -q libsvtav1; then
    ffmpeg -y -loglevel error -i "$input" \
      -c:v libsvtav1 -crf $AV1_CRF -preset 6 \
      -vf "scale=${SCALE}:-2:flags=lanczos" \
      $AUDIO \
      -movflags +faststart \
      "$OUT_DIR/${slug}.av1.mp4"
  else
    echo "    ⚠ libsvtav1 no disponible — saltando AV1. Reinstalá ffmpeg con: brew reinstall ffmpeg"
  fi

  local mp4_size=$(du -m "$OUT_DIR/${slug}.mp4" 2>/dev/null | cut -f1)
  local av1_size=$(du -m "$OUT_DIR/${slug}.av1.mp4" 2>/dev/null | cut -f1 || echo "—")
  printf "    H.264 %sMB · AV1 %sMB · poster %dKB\n" \
    "$mp4_size" "$av1_size" \
    $(stat -f%z "$POSTER_DIR/${slug}.jpg" 2>/dev/null | awk '{print int($1/1024)}')
}

# ─── Main ─────────────────────────────────────────────────────────────────
if [ -f "$SRC_DIR" ]; then
  process_one "$SRC_DIR"
else
  find "$SRC_DIR" -type f \( \
    -iname "*.mp4" -o -iname "*.mov" -o -iname "*.m4v" \
  \) -not -name ".*" | while read -r f; do
    process_one "$f"
  done
fi

echo ""
echo "✓ Hecho."
echo "  Videos: $(du -sh "$OUT_DIR" | cut -f1)"
echo "  Posters: $(du -sh "$POSTER_DIR" | cut -f1)"
