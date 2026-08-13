#!/bin/bash

# Script para optimizar videos: H.264 + AV1 + poster
# Requiere: ffmpeg

set -e

# Configuración
INPUT_DIR="Videos"
OUTPUT_DIR="media/optimized"
QUALITY_H264="23" # CRF (menor = mejor calidad)
QUALITY_AV1="30"  # CRF (menor = mejor calidad)
POSTER_SIZE="640x360"

# Crear directorios de salida
mkdir -p "$OUTPUT_DIR"/h264
mkdir -p "$OUTPUT_DIR"/av1
mkdir -p "$OUTPUT_DIR"/posters

# Función para procesar videos
process_video() {
    local input="$1"
    local filename=$(basename "$input")
    local name="${filename%.*}"
    
    echo "Procesando: $filename"
    
    # Generar miniatura/poster
    ffmpeg -i "$input" -vf "scale=$POSTER_SIZE:force_original_aspect_ratio=decrease,pad=$POSTER_SIZE:(ow-iw)/2:(oh-ih)/2:black" \
           -vframes 1 "$OUTPUT_DIR/posters/${name}.jpg" -y
    
    # Convertir a H.264 (MP4)
    ffmpeg -i "$input" \
           -c:v libx264 -crf "$QUALITY_H264" -preset medium \
           -c:a aac -b:a 128k \
           -movflags +faststart \
           "$OUTPUT_DIR/h264/${name}.mp4" -y
    
    # Convertir a AV1 (MP4)
    ffmpeg -i "$input" \
           -c:v libsvtav1 -crf "$QUALITY_AV1" -preset 4 \
           -c:a aac -b:a 128k \
           -movflags +faststart \
           "$OUTPUT_DIR/av1/${name}.mp4" -y
    
    # Generar versiones responsive
    mkdir -p "$OUTPUT_DIR/h264/${name}"
    mkdir -p "$OUTPUT_DIR/av1/${name}"
    
    # Tamaños para H.264
    for resolution in "640x360" "1280x720" "1920x1080"; do
        width=$(echo "$resolution" | cut -d'x' -f1)
        height=$(echo "$resolution" | cut -d'x' -f2)
        
        ffmpeg -i "$input" \
               -c:v libx264 -crf "$QUALITY_H264" -preset medium \
               -vf "scale=$width:$height" \
               -c:a aac -b:a 128k \
               -movflags +faststart \
               "$OUTPUT_DIR/h264/${name}/${width}x${height}.mp4" -y
    done
    
    # Tamaños para AV1
    for resolution in "640x360" "1280x720" "1920x1080"; do
        width=$(echo "$resolution" | cut -d'x' -f1)
        height=$(echo "$resolution" | cut -d'x' -f2)
        
        ffmpeg -i "$input" \
               -c:v libsvtav1 -crf "$QUALITY_AV1" -preset 4 \
               -vf "scale=$width:$height" \
               -c:a aac -b:a 128k \
               -movflags +faststart \
               "$OUTPUT_DIR/av1/${name}/${width}x${height}.mp4" -y
    done
}

# Procesar todos los videos en el directorio de entrada
find "$INPUT_DIR" -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.avi" \) | while read -r vid; do
    process_video "$vid"
done

# Crear HTML con los videos optimizados
cat > "$OUTPUT_DIR/video-gallery.html" << EOF
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galería de Videos Optimizados</title>
    <style>
        body { font-family: sans-serif; margin: 2rem; }
        .video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
        .video-container { position: relative; border-radius: 8px; overflow: hidden; background: #000; }
        .video-container video { width: 100%; height: auto; }
        .video-container img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .video-info { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 0.5rem; }
        .play-button { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(255,255,255,0.8); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .play-button::after { content: "▶"; margin-left: 5px; }
    </style>
</head>
<body>
    <h1>Galería de Videos Optimizados</h1>
    <div class="video-grid">
EOF

# Generar entradas de video para cada video procesado
for av1_dir in "$OUTPUT_DIR/av1"/*/; do
    if [ -d "$av1_dir" ]; then
        name=$(basename "$av1_dir")
        poster="$OUTPUT_DIR/posters/${name}.jpg"
        
        # Verificar si existe el poster
        if [ -f "$poster" ]; then
            cat >> "$OUTPUT_DIR/video-gallery.html" << EOF
        <div class="video-container">
            <img src="media/posters/${name}.jpg" alt="${name}">
            <div class="play-button" onclick="this.nextElementSibling.play(); this.style.display='none';"></div>
            <video controls preload="metadata">
                <source src="media/av1/${name}/1280x720.mp4" type="video/mp4">
                <source src="media/h264/${name}/1280x720.mp4" type="video/mp4">
                Tu navegador no soporta la reproducción de video.
            </video>
            <div class="video-info">
                <strong>${name}</strong> | 1280x720 | AV1/H.264
            </div>
        </div>
EOF
        fi
    fi
done

cat >> "$OUTPUT_DIR/video-gallery.html" << EOF
    </div>
</body>
</html>
EOF

echo "Optimización de videos completada. Los videos están en: $OUTPUT_DIR"
echo "Formatos: H.264 y AV1"
echo "Tamaños: 640x360, 1280x720, 1920x1080"
echo "Posters generados en: $OUTPUT_DIR/posters"