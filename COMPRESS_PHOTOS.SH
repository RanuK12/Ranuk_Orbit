#!/bin/bash

# Script para optimizar fotos: AVIF + WebP responsive
# Requiere: webp, libavif, cwebp, avifenc

set -e

# Configuración
INPUT_DIR="Fotos"
OUTPUT_DIR="media/optimized"
QUALITY_AVIF=80
QUALITY_WEBP=85
MAX_WIDTH=2000

# Crear directorios de salida
mkdir -p "$OUTPUT_DIR"/avif
mkdir -p "$OUTPUT_DIR"/webp

# Función para procesar imágenes
process_image() {
    local input="$1"
    local filename=$(basename "$input")
    local name="${filename%.*}"
    
    echo "Procesando: $filename"
    
    # Convertir a WebP
    cwebp -q "$QUALITY_WEBP" -resize "$MAX_WIDTH" 0 "$input" -o "$OUTPUT_DIR/webp/${name}.webp"
    
    # Convertir a AVIF
    avifenc -q "$QUALITY_AVIF" --min 0 --max "$QUALITY_AVIF" "$input" "$OUTPUT_DIR/avif/${name}.avif"
    
    # Crear versión responsive
    mkdir -p "$OUTPUT_DIR/webp/${name}"
    mkdir -p "$OUTPUT_DIR/avif/${name}"
    
    # Generar múltiples tamaños para WebP
    for width in 400 800 1200 1600; do
        if [ "$width" -le "$MAX_WIDTH" ]; then
            cwebp -q "$QUALITY_WEBP" -resize "$width" 0 "$input" -o "$OUTPUT_DIR/webp/${name}/${width}.webp"
        fi
    done
    
    # Generar múltiples tamaños para AVIF
    for width in 400 800 1200 1600; do
        if [ "$width" -le "$MAX_WIDTH" ]; then
            avifenc -q "$QUALITY_AVIF" --min 0 --max "$QUALITY_AVIF" -l 8 -d 8 --tile-columns 2 "$input" -o "$OUTPUT_DIR/avif/${name}/${width}.avif"
        fi
    done
}

# Procesar todas las imágenes en el directorio de entrada
find "$INPUT_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
    process_image "$img"
done

# Crear HTML con las imágenes optimizadas
cat > "$OUTPUT_DIR/index.html" << EOF
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galería Optimizada</title>
    <style>
        body { font-family: sans-serif; margin: 2rem; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
        .img-container { position: relative; overflow: hidden; border-radius: 8px; }
        .img-container img { width: 100%; height: auto; transition: transform 0.3s; }
        .img-container:hover img { transform: scale(1.05); }
        .loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
    </style>
</head>
<body>
    <h1>Galería de Fotos Optimizadas</h1>
    <div class="gallery">
EOF

# Generar entradas de imagen para cada foto procesada
for avif_dir in "$OUTPUT_DIR/avif"/*/; do
    if [ -d "$avif_dir" ]; then
        name=$(basename "$avif_dir")
        cat >> "$OUTPUT_DIR/index.html" << EOF
        <div class="img-container">
            <picture>
                <source type="image/avif" srcset="media/avif/${name}/1600.avif, media/avif/${name}/800.avif 2x">
                <source type="image/webp" srcset="media/webp/${name}/1600.webp, media/webp/${name}/800.webp 2x">
                <img src="media/webp/${name}/800.webp" alt="${name}" loading="lazy">
            </picture>
        </div>
EOF
    fi
done

cat >> "$OUTPUT_DIR/index.html" << EOF
    </div>
</body>
</html>
EOF

echo "Optimización completada. Las imágenes están en: $OUTPUT_DIR"
echo "Tamaños generados: 400px, 800px, 1200px, 1600px"
echo "Formatos: WebP y AVIF"