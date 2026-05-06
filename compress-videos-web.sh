#!/usr/bin/env bash
# compress-videos-web.sh — Ranuk Orbit
# Versión agresiva para WEB. Target: hero <8MB, reels <12MB.
# Usa AV1 con preset más eficiente y H.264 con CRF más alto.
#
# Uso:
#   ./compress-videos-web.sh path/to/file.MP4 hero    # hero loop
#   ./compress-videos-web.sh path/to/file.MP4 reel    # reel portfolio
#   ./compress-videos-web.sh path/to/file.MP4 thumb   # filmstrip thumb

set -e

INPUT="$1"
PROFILE="${2:-reel}"
OUT_DIR="media/optimized/videos"
POSTER_DIR="media/optimized/posters"

case "$PROFILE" in
  hero)
    H264_CRF=27
    AV1_CRF=38       # más alto = menos peso
    AV1_PRESET=4     # preset bajo = mejor compresión
    SCALE=1920
    AUDIO="-an"      # hero sin audio
    DURATION="-t 15" # max 15 segundos para hero loops
    ;;
  reel)
    H264_CRF=26
    AV1_CRF=36
    AV1_PRESET=5
    SCALE=1920
    AUDIO="-c:a aac -b:a 96k -ac 2"
    DURATION=""
    ;;
  thumb)
    H264_CRF=30
    AV1_CRF=40
    AV1_PRESET=8
    SCALE=720
    AUDIO="-an"
    DURATION="-t 8"
    ;;
  *)
    echo "❌ Profile inválido. Usá: hero | reel | thumb"
    exit 1
    ;;
esac

command -v ffmpeg >/dev/null 2>&1 || { echo "❌ ffmpeg no instalado"; exit 1; }
[ -f "$INPUT" ] || { echo "❌ Archivo no existe: $INPUT"; exit 1; }
mkdir -p "$OUT_DIR" "$POSTER_DIR"

slugify() {
  echo "$1" | iconv -f UTF-8 -t ASCII//TRANSLIT 2>/dev/null \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g' \
    | sed -E 's/^-+|-+$//g'
}

filename=$(basename "$INPUT")
name="${filename%.*}"
slug=$(slugify "$name")
size_in_mb=$(du -m "$INPUT" | cut -f1)

echo "→ $filename ($size_in_mb MB) · profile=$PROFILE"

# 1. Poster (frame en segundo 1)
ffmpeg -y -loglevel error -i "$INPUT" \
  -ss 00:00:01 -vframes 1 -q:v 4 \
  -vf "scale=${SCALE}:-2" \
  "$POSTER_DIR/${slug}.jpg"

# 2. H.264 (compatibilidad universal)
ffmpeg -y -loglevel error -i "$INPUT" \
  $DURATION \
  -c:v libx264 -crf $H264_CRF -preset slow \
  -profile:v high -level 4.0 -pix_fmt yuv420p \
  -vf "scale=${SCALE}:-2:flags=lanczos" \
  $AUDIO \
  -movflags +faststart \
  "$OUT_DIR/${slug}.mp4"

# 3. AV1 (navegadores modernos, mucho más liviano)
if ffmpeg -encoders 2>/dev/null | grep -q libsvtav1; then
  ffmpeg -y -loglevel error -i "$INPUT" \
    $DURATION \
    -c:v libsvtav1 -crf $AV1_CRF -preset $AV1_PRESET \
    -vf "scale=${SCALE}:-2:flags=lanczos" \
    $AUDIO \
    -movflags +faststart \
    "$OUT_DIR/${slug}.av1.mp4"
fi

mp4_size=$(du -m "$OUT_DIR/${slug}.mp4" 2>/dev/null | cut -f1)
av1_size=$(du -m "$OUT_DIR/${slug}.av1.mp4" 2>/dev/null | cut -f1 || echo "—")
poster_kb=$(stat -f%z "$POSTER_DIR/${slug}.jpg" 2>/dev/null | awk '{print int($1/1024)}')

# Si AV1 sale más grande que H.264, lo borramos (no aporta)
if [ -f "$OUT_DIR/${slug}.av1.mp4" ] && [ "$av1_size" -gt "$mp4_size" ]; then
  echo "    ⚠ AV1 ($av1_size MB) > H.264 ($mp4_size MB) — borrando AV1"
  rm "$OUT_DIR/${slug}.av1.mp4"
  av1_size="—"
fi

printf "    ✓ H.264 %sMB · AV1 %sMB · poster %dKB\n" "$mp4_size" "$av1_size" "$poster_kb"
