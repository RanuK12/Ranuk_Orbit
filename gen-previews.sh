#!/usr/bin/env bash
# gen-previews.sh — generate 8-second H.264 preview clips for every video
# under media/optimized/videos-{drone,rayban}/ and place them in
# media/optimized/previews/ with the same filename.
#
# Usage:   ./gen-previews.sh                 # process every video
#          ./gen-previews.sh force           # regenerate even if output exists
#
# After running, also re-run ./build.js (or regenerate the manifest list in
# ranuk-manifest.js) so that window.RANUK_ASSETS knows the previews exist.
#
# Requirements: ffmpeg (brew install ffmpeg or apt-get install ffmpeg).
set -euo pipefail

FORCE="${1:-}"
OUT_DIR="media/optimized/previews"
mkdir -p "$OUT_DIR"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "[gen-previews] ffmpeg not found. Install it first (brew install ffmpeg)." >&2
  exit 1
fi

process() {
  local src="$1"
  local base out
  base="$(basename "$src")"
  out="${OUT_DIR}/${base%.*}.mp4"

  if [[ -f "$out" && "$FORCE" != "force" ]]; then
    echo "[skip] $out"
    return
  fi

  echo "[gen]  $src → $out"
  # -ss 0 -t 8 — first 8 seconds
  # CRF 28 + scale 1280x-2 keeps the preview small (~1-3MB) for instant download
  # -movflags +faststart makes the file streamable from the first byte
  ffmpeg -hide_banner -loglevel error -y \
    -ss 0 -t 8 -i "$src" \
    -vf "scale=1280:-2" \
    -c:v libx264 -crf 28 -preset veryfast -pix_fmt yuv420p \
    -an \
    -movflags +faststart \
    "$out"
}

shopt -s nullglob
for dir in media/optimized/videos-drone media/optimized/videos-rayban; do
  [[ -d "$dir" ]] || continue
  for f in "$dir"/*.mp4 "$dir"/*.MP4 "$dir"/*.mov "$dir"/*.MOV; do
    [[ -f "$f" ]] || continue
    process "$f"
  done
done

echo
echo "Done. Previews saved to $OUT_DIR/"
echo "Next: regenerate ranuk-manifest.js so window.RANUK_ASSETS includes the new files,"
echo "      then re-run ./build.js to rebuild ranuk-app.min.js."
