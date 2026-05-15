#!/usr/bin/env bash
# generate-unique-posters.sh — Generates unique posters for ALL videos,
# with special handling for Patagonia clips that tend to share similar
# opening frames.
#
# Uses incremental time offsets for videos in the same location group
# to guarantee visually distinct previews.
#
# Usage:
#   ./generate-unique-posters.sh          # Generate missing posters only
#   ./generate-unique-posters.sh force    # Regenerate ALL posters
#   ./generate-unique-posters.sh patagonia # Only regenerate Patagonia posters
set -euo pipefail

FFMPEG="${FFMPEG:-ffmpeg}"
FFPROBE="${FFPROBE:-ffprobe}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/media/optimized/posters"
MODE="${1:-}"
mkdir -p "$OUT"

grab_at() {
  local src="$1"
  local offset="$2"
  local base out dur ts

  base="$(basename "$src")"
  out="$OUT/${base%.*}.jpg"

  if [[ -f "$out" && "$MODE" != "force" && "$MODE" != "patagonia" ]]; then
    return
  fi

  dur=$("$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$src" 2>/dev/null || echo "5")

  # Use provided offset, but clamp to video duration
  ts=$(awk -v d="$dur" -v o="$offset" 'BEGIN{ t=o; if(t>d*0.9) t=d*0.35; if(t<0.5) t=0.5; printf "%.2f", t }')

  "$FFMPEG" -hide_banner -loglevel error -y \
    -ss "$ts" -i "$src" \
    -frames:v 1 \
    -vf "scale=960:-2:flags=lanczos" \
    -q:v 5 \
    "$out" 2>/dev/null && echo "[ok] $out (at ${ts}s)" || echo "[fail] $src"
}

echo "=== Generating unique posters ==="
echo "Mode: ${MODE:-default (skip existing)}"
echo ""

# ─── Patagonia videos: staggered offsets (2s, 5s, 8s, 11s, ...) ───
echo "--- Patagonia videos (staggered offsets) ---"
offset=2
for f in "$ROOT"/media/optimized/videos-drone/bosque*patagonia*.mp4 \
         "$ROOT"/media/optimized/videos-drone/rio*limay*.mp4 \
         "$ROOT"/media/optimized/videos-drone/valle*encantado*.mp4 \
         "$ROOT"/media/optimized/videos-drone/villa*pehuenia*.mp4; do
  [[ -f "$f" ]] || continue
  grab_at "$f" "$offset"
  offset=$((offset + 3))
done

# ─── All other videos: default 35% offset ───
echo ""
echo "--- All other videos (35% offset) ---"
count=0
for dir in "$ROOT/media/optimized/videos-drone" "$ROOT/media/optimized/videos-rayban"; do
  for f in "$dir"/*.mp4; do
    [[ -f "$f" ]] || continue
    base="$(basename "$f")"
    out="$OUT/${base%.*}.jpg"
    # Skip if already generated (including Patagonia ones done above)
    [[ -f "$out" && "$MODE" != "force" ]] && continue
    # Default: grab at 35%
    dur=$("$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$f" 2>/dev/null || echo "5")
    ts=$(awk -v d="$dur" 'BEGIN{ t=d*0.35; if(t<0.5) t=0.5; printf "%.2f", t }')
    grab_at "$f" "$ts"
    count=$((count+1))
  done
done

echo ""
echo "Done. Poster directory:"
ls -1 "$OUT" | wc -l
echo "files in $OUT"
