#!/usr/bin/env python3
"""
Genera el QR de la carta, en vector.

    uv run --with segno tools/qr.py
    uv run --with segno tools/qr.py https://joy.pamboo.co/

Sale en impresion/qr-joy.svg, que es el que se le manda a la imprenta: al ser
vector no tiene resolución que se quede corta. El PNG de 2000 px que lo acompaña
se rasteriza aparte con Chrome (ver README, "QR para las mesas"): acá no se
genera porque segno no compone el logo del centro.

Decisiones que conviene no tocar sin entender por qué:

- Corrección de errores H (la más alta, tolera 30% del símbolo dañado). Es lo
  que permite tapar el centro con el logo y que igual lea, y además aguanta el
  roce y las manchas de una mesa de bar.
- Módulos negros sobre blanco, nunca al revés. Los lectores manejan el negativo,
  pero de noche y con poca luz el contraste real cae y empiezan a fallar.
- Zona muda de 4 módulos alrededor. No es decorativa: sin ese margen en blanco
  muchos lectores no encuentran el símbolo.
"""
import base64
import sys
from pathlib import Path

import segno

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "impresion"
LOGO = RAIZ / "public" / "assets" / "img" / "logo-joy.png"

URL = sys.argv[1] if len(sys.argv) > 1 else "https://joy.pamboo.co/"

BORDE = 4          # zona muda, en módulos
LADO_LOGO = 0.26   # proporción del ancho total que ocupa el disco del logo


def runs(fila):
    """Agrupa módulos oscuros contiguos: un rectángulo por tirada, no por módulo."""
    x = 0
    while x < len(fila):
        if fila[x]:
            inicio = x
            while x < len(fila) and fila[x]:
                x += 1
            yield inicio, x - inicio
        else:
            x += 1


def main():
    qr = segno.make(URL, error="H")
    matriz = [list(f) for f in qr.matrix]
    n = len(matriz)
    total = n + BORDE * 2

    rects = []
    for y, fila in enumerate(matriz):
        for x, ancho in runs(fila):
            rects.append(
                f'<rect x="{x + BORDE}" y="{y + BORDE}" width="{ancho}" height="1"/>'
            )

    logo_b64 = base64.b64encode(LOGO.read_bytes()).decode()
    disco = total * LADO_LOGO
    centro = total / 2
    # El logo entra dentro del disco con aire propio, si no el trazo blanco
    # queda pegado a los módulos negros y el lector puede confundirse.
    lado_logo = disco * 0.66

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \
viewBox="0 0 {total} {total}" width="{total * 24}" height="{total * 24}" \
role="img" aria-label="Código QR de la carta de Joy Wake Park">
<title>Carta Joy Wake Park — {URL}</title>
<rect width="{total}" height="{total}" fill="#ffffff"/>
<g fill="#0a0a0a" shape-rendering="crispEdges">
{chr(10).join(rects)}
</g>
<circle cx="{centro}" cy="{centro}" r="{disco / 2}" fill="#0a0a0a"/>
<image xlink:href="data:image/png;base64,{logo_b64}" \
x="{centro - lado_logo / 2}" y="{centro - lado_logo / 2}" \
width="{lado_logo}" height="{lado_logo}"/>
</svg>
"""

    SALIDA.mkdir(exist_ok=True)
    destino = SALIDA / "qr-joy.svg"
    destino.write_text(svg, encoding="utf-8")

    tapado = 3.1416 * (disco / 2) ** 2 / (n * n) * 100
    print(f"URL        {URL}")
    print(f"version    {qr.version} ({n}x{n} modulos, correccion H)")
    print(f"logo tapa  {tapado:.1f}% del simbolo (H tolera 30%)")
    print(f"escrito    {destino.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
