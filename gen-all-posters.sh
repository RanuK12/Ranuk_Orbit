#!/usr/bin/env bash
# Generate a unique JPG poster for every video in /videos-drone/ and
# /videos-rayban/ that doesn't already have a dedicated poster.
# Frame is taken at ~35% of the video's duration (safer than 0s for drone
# shots that start on a dark/boot frame, and more cinematic than midpoint).
set -euo pipefail

FFMPEG="${FFMPEG:-ffmpeg}"
FFPROBE="${FFPROBE:-ffprobe}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/media/optimized/posters"
FORCE="${1:-}"
mkdir -p "$OUT"

grab() {
  local src="$1"
  local base out dur ts
  base="$(basename "$src")"
  out="$OUT/${base%.*}.jpg"

  if [[ -f "$out" && "$FORCE" != "force" ]]; then
    return
  fi

  dur=$("$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$src" 2>/dev/null || echo "5")
  # Seek to 35% in, floor to 0.5 to avoid negatives on short clips
  ts=$(awk -v d="$dur" 'BEGIN{ t=d*0.35; if(t<0.5) t=0.5; printf "%.2f", t }')

  # 960px wide @ q:v 6 keeps each poster around 60-90 KB. That's plenty of
  # resolution for a gallery tile (max ~400px on 2x retina) and keeps the
  # total posters directory under ~8 MB, which matters because index.html
  # preloads them opportunistically.
  "$FFMPEG" -hide_banner -loglevel error -y \
    -ss "$ts" -i "$src" \
    -frames:v 1 \
    -vf "scale=960:-2:flags=lanczos" \
    -q:v 6 \
    "$out" 2>/dev/null || echo "[fail] $src"
}

count=0
for dir in "$ROOT/media/optimized/videos-drone" "$ROOT/media/optimized/videos-rayban"; do
  for f in "$dir"/*.mp4; do
    [[ -f "$f" ]] || continue
    grab "$f"
    count=$((count+1))
    if (( count % 10 == 0 )); then echo "[$count] processed"; fi
  done
done

echo "Done. Total videos scanned: $count"
ls -1 "$OUT" | wc -l
