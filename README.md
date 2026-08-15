# Carta Joy Wake Park

Carta digital de **Joy Wake Park** (San Juan, Argentina). Reemplazo del PDF actual
por una experiencia de scroll continuo, mobile-first, sin publicidad, sin zoom y
sin pantallas intermedias.

- **16 capítulos · 144 productos**, transcriptos del PDF original.
- **Cero dependencias**: HTML, CSS y JavaScript sin librerías ni framework.
- **12,7 KB** comprimidos de HTML + CSS + JS para toda la carta.
- **Sin red**: tipografías e imágenes se sirven desde el propio proyecto.

## Ver la carta

```bash
npm start          # genera y levanta el servidor
```

- Escritorio: <http://localhost:4173/>
- Celular (misma red Wi-Fi): la consola imprime la IP, por ejemplo `http://192.168.1.8:4173/`

Sin npm:

```bash
node build.mjs && node server.mjs
```

Para verla en el celular sin servidor, abrí directamente `dist/carta-joy.html`:
es un único archivo con todo adentro (imágenes, tipografías, estilos y scripts).

## Estructura

```
data/menu.js                 Fuente de datos única: productos, precios y distintivos.
build.mjs                    Genera el HTML ya renderizado a partir de data/menu.js.
server.mjs                   Servidor estático mínimo (módulos nativos de Node).
vercel.json                  Configuración de despliegue y cabeceras de caché.

public/                      <- ESTO ES LO QUE SE DESPLIEGA
  index.html                 Generado por build.mjs.
  assets/css/carta.css       Estilos.
  assets/js/carta.js         Portada, barra fija, scroll spy e índice desplegable.
  assets/fonts/              Fira Sans y Ubuntu, subconjunto latino (66 KB).
  assets/img/                Fotografía B&N y logo.

dist/                        Ignorado por git, se regenera con `npm run build`.
  carta-joy.html             Archivo único autocontenido, para mandar suelto.
  artifact.html              Fragmento para un host que aporta su propio <head>.
```

`public/index.html` y `dist/` son **generados**. Para cambiar un precio o un
producto se edita `data/menu.js` y se corre `npm run build`.

## Por qué no hay framework

La carta es contenido: 144 productos que no cambian entre visitas y una sola capa
de navegación. Todo el HTML se genera en el build, así que no hay nada que
hidratar en el navegador.

| | Esta carta | Con React/Next |
|---|---|---|
| JavaScript enviado | **2,2 KB** comprimidos | ~90 KB solo de runtime |
| Dependencias | **0** | ~300 paquetes |
| Build | instantáneo, sin `npm install` | requiere instalación |

Un framework serviría si hubiera estado compartido, rutas o datos en vivo. Acá
sumaría peso y tiempo de arranque sin agregar nada visible.

## Desplegar en Vercel

El repo está listo: `vercel.json` ya define el build, la carpeta de salida y las
cabeceras de caché.

```bash
git init && git add -A && git commit -m "Carta Joy Wake Park"
gh repo create carta-joy --private --source=. --push   # o creá el repo a mano
```

Después, en Vercel: **Add New → Project → importás el repo → Deploy**. No hay que
tocar ninguna opción: detecta `vercel.json` solo. Sin variables de entorno.

Para dominio propio: **Settings → Domains** y apuntás el DNS. Ese es el dominio
que conviene poner en el QR, no la URL `*.vercel.app`.

Las cabeceras que quedan configuradas:

| Ruta | Caché |
|---|---|
| `/assets/fonts/*` | 1 año, inmutable (el contenido nunca cambia) |
| `/assets/{img,css,js}/*` | 30 días con revalidación en segundo plano |
| `/` | siempre revalida, así un cambio de precio se ve al instante |

## Decisiones

**Contenido servido, no calculado.** El build escribe los 144 productos en el HTML.
El JavaScript solo agrega navegación: si no carga, la carta se lee igual.

**Precios.** Las comidas llevan un valor único, tal como el PDF. Las bebidas llevan
dos: `Regular` y `Efectivo`. En el PDF la leyenda *(Precio Regular)* está tipografiada
sobre la primera columna y la portada dice "descuentos abonando en efectivo": por eso
el primero es el regular y el segundo el de efectivo. Cada capítulo de bebidas lo
aclara en una línea antes de la lista. Los números usan cifras tabulares.

**Distintivos.** `Veggie` y `Sin TACC` salen de lo que declara la carta original: el
ícono hoja+tilde y la pertenencia al capítulo Sin TACC. No se usa "Vegano" porque el
PDF nunca lo declara. Van junto al producto, nunca como filtro global.

**Tipografía.** Fira Sans para titulares y categorías; Ubuntu para productos,
descripciones y precios. Ambas subconjuntadas al alfabeto que la carta usa: 66 KB
contra los 537 KB de los archivos completos. La Fira Sans Black carga en modo
`block` para que el eslogan a pantalla completa nunca se pinte con una fuente de
reserva más ancha.

**El eslogan.** "Noches mágicas" va en relleno sólido, sin `text-stroke`. La línea
con Á lleva interlineado y relleno propios: medido, quedan ~0,2 em libres entre el
trazo de "NOCHES" y la tilde.

**Navegación.** Índice completo tras la portada y en una hoja desplegable desde la
barra fija. La barra indica el capítulo visible mediante `IntersectionObserver`, con
una resolución de respaldo para saltos directos que no cambian ninguna intersección.

## Celular

La carta se usa desde el teléfono, así que ese es el caso principal y no una
adaptación posterior.

Verificado sin recortes, sin scroll horizontal y con la portada entera en
pantalla en: iPhone SE (375×667), iPhone 12 mini y Android chico (360), iPhone
14/15 (390×844), iPhone 15 Pro (393×852), Pixel/Galaxy (412×915), iPhone Pro Max
(430×932) y **apaisado** (844×390).

**Áreas seguras.** El viewport va a sangre (`viewport-fit=cover`) para que la
portada llegue a los bordes, así que el margen lateral, la barra fija, la portada,
la hoja del índice y el pie suman `env(safe-area-inset-*)`: nada queda bajo el
notch ni bajo el indicador de inicio, ni en retrato ni en apaisado.

**Apaisado.** El eslogan escala con `min(16vw, 19svh)` en lugar de solo con el
ancho, y por debajo de 560 px de alto la portada se compacta. Sin eso, en
apaisado el eslogan medía 135 px y empujaba la indicación de scroll fuera de
pantalla.

**Toque.** El recuadro gris del navegador se reemplaza por una respuesta propia,
y como en pantalla táctil no hay hover, la confirmación del toque es el `:active`.

**Peso en datos móviles.** Solo la primera escena de portada se pide al abrir;
las otras tres se cargan después de `load` y el cruce saltea el turno si una
todavía no llegó, así nunca funde a negro. Medido en 4G (1,6 Mbps, 150 ms):

| | antes de `load` | total |
|---|---|---|
| Pedidos | 12 | 16 |
| Transferido | 513 KB | 922 KB |

El texto de la carta aparece a los **0,93 s** y la foto de portada a los 2,5 s.
Los 144 productos ya están en el HTML: se leen desde el primer pintado.

## Accesibilidad

HTML semántico (`h1` → `h2` por capítulo → `h3` por producto), contraste mínimo
5,97:1 sobre el fondo, objetivos táctiles de 44 px o más, foco visible, navegación
por teclado con retención de foco en la hoja del índice, `alt` en todas las imágenes,
zoom del navegador habilitado, y `prefers-reduced-motion` respetado. Todas las
imágenes llevan `width`/`height` para evitar saltos de maquetación; solo se animan
`transform` y `opacity`.

## Pendientes de confirmar con el local

1. **Corona Sin Alcohol**: el PDF imprime `$9.200 | $12.000`, con el precio en
   efectivo por encima del regular. Se transcribió tal cual y figura marcado en la
   carta.
2. **Rabas Crocantes**: en el PDF lleva el ícono veggie. Siendo calamar, el
   distintivo no se replicó; queda una nota en el producto.
3. **Variantes XL**: el capítulo Sin TACC nombra "Papas Rústicas", "Papas Joy" y
   "Papas Veggie" sin sus versiones XL. El distintivo se aplicó solo a los nombres
   que el PDF declara.
4. **Bombay Bramble + Tónica** (botellas): el PDF imprime `$105.00`. Se tomó
   `$105.000`, idéntico a "Bombay + Tónica", que comparte la misma línea de precios.
