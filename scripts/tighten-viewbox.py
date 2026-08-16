#!/usr/bin/env python3
"""
Ajusta el viewBox de los SVG de marca al bounding box real de su contenido.

Los archivos del kit vienen exportados sobre artboards cuadrados (566.93 ×
566.93) con el arte ocupando solo una fracción. Al fijarles una altura en CSS,
el espacio vacío del artboard cuenta como parte del elemento y el logo se ve
minúsculo dentro de una caja enorme.

Se calcula el bbox rasterizando con rsvg-convert y recortando con ImageMagick,
y se reescribe el viewBox en unidades del SVG original.

Uso: python3 scripts/tighten-viewbox.py components/brand/assets/*.svg
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

RASTER_W = 1200
PAD_RATIO = 0.01  # 1% de aire alrededor del contenido


def content_bbox(svg_path: Path):
    """(x, y, w, h) del contenido en píxeles, y el alto rasterizado."""
    with tempfile.TemporaryDirectory() as td:
        flat = Path(td) / "flat.svg"
        # currentColor no resuelve fuera de un DOM: fijarlo para poder rasterizar.
        flat.write_text(
            svg_path.read_text(encoding="utf-8").replace("currentColor", "#000"),
            encoding="utf-8",
        )
        png = Path(td) / "out.png"
        subprocess.run(
            ["rsvg-convert", "-w", str(RASTER_W), str(flat), "-o", str(png)],
            check=True,
            capture_output=True,
        )
        info = subprocess.run(
            ["magick", str(png), "-background", "white", "-alpha", "remove",
             "-fuzz", "2%", "-format", "%@|%w|%h", "info:"],
            check=True, capture_output=True, text=True,
        ).stdout
        geom, full_w, full_h = info.split("|")
        m = re.match(r"(\d+)x(\d+)\+(-?\d+)\+(-?\d+)", geom)
        if not m:
            raise ValueError(f"no pude leer el bbox de {svg_path.name}: {geom!r}")
        w, h, x, y = (int(g) for g in m.groups())
        return (x, y, w, h), (int(full_w), int(full_h))


def tighten(svg_path: Path) -> str:
    src = svg_path.read_text(encoding="utf-8")
    m = re.search(r'viewBox="([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"', src)
    if not m:
        return f"{svg_path.name}: sin viewBox, se omite"
    vx, vy, vw, vh = (float(g) for g in m.groups())

    (bx, by, bw, bh), (fw, fh) = content_bbox(svg_path)
    if bw == 0 or bh == 0:
        return f"{svg_path.name}: contenido vacío, se omite"

    # píxeles -> unidades de usuario del SVG
    sx, sy = vw / fw, vh / fh
    nx, ny = vx + bx * sx, vy + by * sy
    nw, nh = bw * sx, bh * sy

    pad = max(nw, nh) * PAD_RATIO
    nx, ny, nw, nh = nx - pad, ny - pad, nw + 2 * pad, nh + 2 * pad

    new_vb = f'viewBox="{nx:.2f} {ny:.2f} {nw:.2f} {nh:.2f}"'
    out = src[: m.start()] + new_vb + src[m.end() :]
    # width/height fijos pelearían con el viewBox recortado.
    out = re.sub(r'\s(width|height)="[^"]*"(?=[^>]*>)', "", out, count=2)
    svg_path.write_text(out, encoding="utf-8")

    ratio_before, ratio_after = vw / vh, nw / nh
    return (f"{svg_path.name}: {vw:.0f}x{vh:.0f} (r={ratio_before:.2f}) "
            f"-> {nw:.0f}x{nh:.0f} (r={ratio_after:.2f})")


if __name__ == "__main__":
    paths = [Path(p) for p in sys.argv[1:]]
    if not paths:
        print(__doc__)
        sys.exit(1)
    for p in sorted(paths):
        print(tighten(p))
