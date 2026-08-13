#!/bin/bash
# compress-videos-h265.sh — Compress all videos >15MB to H.265 at ≤3 Mbps
# Run from Ranuk_Orbit root: ./compress-videos-h265.sh
# Uses VideoToolbox hardware encoder on macOS for speed

set -e
MEDIA_DIR="$(dirname "$0")/media/optimized"
MIN_SIZE=$((15 * 1048576))  # 15MB
BITRATE="3M"
MAXRATE="4M"
BUFSIZE="6M"

echo "🎬 Compressing videos >15MB to H.265 @ ${BITRATE}..."
echo ""

find "$MEDIA_DIR" -name "*.mp4" -size +15M | sort | while read -r src; do
  size_mb=$(( $(stat -f%z "$src") / 1048576 ))
  basename=$(basename "$src")
  tmp="${src%.mp4}.h265.tmp.mp4"
  
  echo "→ ${basename} (${size_mb}MB)"
  
  # Use VideoToolbox H.265 encoder (hardware accelerated on macOS)
  ffmpeg -y -i "$src" \
    -c:v hevc_videotoolbox \
    -b:v "$BITRATE" -maxrate "$MAXRATE" -bufsize "$BUFSIZE" \
    -tag:v hvc1 \
    -c:a aac -b:a 128k \
    -movflags +faststart \
    -loglevel warning \
    "$tmp"
  
  new_size_mb=$(( $(stat -f%z "$tmp") / 1048576 ))
  
  # Only replace if new file is smaller
  if [ $(stat -f%z "$tmp") -lt $(stat -f%z "$src") ]; then
    mv "$tmp" "$src"
    echo "  ✓ ${size_mb}MB → ${new_size_mb}MB"
  else
    rm "$tmp"
    echo "  ⊘ Already optimal (${new_size_mb}MB ≥ ${size_mb}MB)"
  fi
done

echo ""
echo "✓ Done!"
