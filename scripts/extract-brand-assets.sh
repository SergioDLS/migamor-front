#!/usr/bin/env bash
#
# Extrae los assets elegidos del brand kit (../migamor-assets) hacia el front.
#
# Este script se versiona a propósito: los archivos del kit se llaman
# "Mesa de trabajo 4 copia 5.svg" y ese nombre no comunica nada. Aquí queda
# registrado qué archivo del kit corresponde a cada asset del producto, para
# poder re-extraer cuando el estudio mande una versión corregida.
#
# Los SVG se limpian antes de entrar: el kit trae los colores en un bloque
# <defs><style> con clases .cls-N. Un <style> dentro de un <svg> inline NO está
# scoped — aplica a todo el documento — así que dos iconos que definan .cls-1
# con colores distintos colisionan y gana el último del DOM. Se elimina el
# bloque y se pone fill="currentColor" en cada path, lo que además habilita
# recolorear con las clases de texto de Tailwind.
#
# Uso: ./scripts/extract-brand-assets.sh   (desde la raíz de migamor-front)
set -euo pipefail

KIT="../migamor-assets"
OUT="components/brand/assets"
PUB="public/brand"

[ -d "$KIT" ] || { echo "No encuentro el brand kit en $KIT" >&2; exit 1; }
mkdir -p "$OUT" "$PUB"

clean_svg() {   # $1 = ruta origen, $2 = ruta destino
  python3 - "$1" "$2" <<'PY'
import re, sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
s = re.sub(r'<\?xml[^>]*\?>\s*', '', s)
s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
s = re.sub(r'<defs>.*?</defs>', '', s, flags=re.S)          # el <style> con .cls-N
s = re.sub(r'\s*class="[^"]*"', '', s)
s = re.sub(r'\s*(fill|stroke)="#[0-9a-fA-F]{3,6}"', '', s)  # colores hardcodeados
s = re.sub(r'\s*(id|data-name)="[^"]*"', '', s)
s = re.sub(r'<(path|circle|ellipse|polygon|polyline|rect)\b',
           r'<\1 fill="currentColor"', s)
s = re.sub(r'\n\s*\n', '\n', s)
open(dst, 'w', encoding='utf-8').write(s.strip() + '\n')
PY
}

echo "== Logos =="
L="$KIT/LOGOS/RGB/SVG"
clean_svg "$L/Migamor RGBMesa de trabajo 1 copia 5.svg" "$OUT/logo-principal.svg"
clean_svg "$L/Migamor RGBMesa de trabajo 2 copia 6.svg" "$OUT/logo-horizontal.svg"
clean_svg "$L/Migamor RGBMesa de trabajo 4 copia 5.svg" "$OUT/logo-compacto.svg"
clean_svg "$L/Migamor RGBMesa de trabajo 6.svg"         "$OUT/logo-sello.svg"
clean_svg "$L/Migamor RGBMesa de trabajo 7 copia 5.svg" "$OUT/logo-simbolo.svg"

echo "== Iconos de panadería =="
# En Iconos/ la variante chocolate es la que lleva sufijo "copia".
I="$KIT/Iconos/SVG"
clean_svg "$I/Iconos MasamorMesa de trabajo 1 copia.svg" "$OUT/icon-cupcake.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 2 copia.svg" "$OUT/icon-muffin.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 3 copia.svg" "$OUT/icon-pan.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 4 copia.svg" "$OUT/icon-croissant.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 5 copia.svg" "$OUT/icon-pan-molde.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 6 copia.svg" "$OUT/icon-torta.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 7 copia.svg" "$OUT/icon-rodillo.svg"

echo "== Elementos gráficos =="
# En Elementos graficos/ la variante chocolate es la que NO lleva sufijo.
E="$KIT/Elementos graficos/SVG"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 1.svg" "$OUT/swash-curva.svg"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 2.svg" "$OUT/swash-lazo.svg"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 3.svg" "$OUT/swash-ese.svg"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 6.svg" "$OUT/heart-outline.svg"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 7.svg" "$OUT/seal.svg"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 8.svg" "$OUT/wavy-divider.svg"

echo "== Patrones y texturas → webp =="
P="$KIT/Patrones/PNG"
magick "$P/Patrones MigamorMesa de trabajo 1@2x.png" \
  -resize 600x600 -quality 82 "$PUB/patron-corazones.webp"
magick "$P/Patrones MigamorMesa de trabajo 1 copia@2x.png" \
  -resize 600x600 -quality 82 "$PUB/patron-sellos.webp"

T="$KIT/Texturas imagenes"
magick "$T/Texturas color Masamor 1.png" -resize 1600x -quality 80 "$PUB/textura-coral.webp"
magick "$T/Texturas color Masamor 2.png" -resize 1600x -quality 80 "$PUB/textura-chocolate.webp"

echo
echo "SVG limpios: $(ls -1 "$OUT"/*.svg | wc -l)"
if grep -l "cls-" "$OUT"/*.svg 2>/dev/null; then
  echo "AVISO: los archivos de arriba conservan clases .cls-N y van a colisionar." >&2
  exit 1
fi
echo "Pesos en $PUB:"
du -h "$PUB"/*.webp
