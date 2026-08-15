/**
 * Carta Joy Wake Park — fuente de datos única.
 *
 * Transcripción fiel del PDF original (Carta Verano 2023.cdr / Corel PDF Engine,
 * 8 páginas, descargado de storage3.me-qr.com). Cada precio fue verificado
 * contra el render de la página correspondiente.
 *
 * Convención de precios
 * ---------------------
 *   p          -> precio único (comidas: el PDF muestra un solo valor)
 *   r / e      -> r = Precio Regular, e = Precio Efectivo
 *
 * En el PDF, la leyenda "(Precio Regular)" está tipografiada exactamente encima
 * de la PRIMERA columna de precios, y la portada dice "DESCUENTOS ABONANDO EN
 * EFECTIVO": por eso el primer número es el regular y el segundo el de efectivo.
 *
 * Distintivos (tags)
 * ------------------
 *   veggie   -> el PDF marca el producto con el ícono hoja + tilde
 *   sintacc  -> el producto figura, con ese mismo nombre y precio, en el
 *               capítulo "SIN TACC" del PDF
 *
 * No se usa el distintivo "vegano": la carta original nunca lo declara y
 * "veggie" no implica ausencia de lácteos ni huevo.
 *
 * Correcciones aplicadas (solo erratas evidentes, sin cambiar significado):
 *   · Separadores de miles normalizados ($8475 -> $8.475, $27000 -> $27.000).
 *   · "Bombay Bramble + Tónica" en botellas imprime "$105.00"; se toma $105.000
 *     (idéntico a "Bombay + Tónica", misma línea de precios).
 *   · Ortografía: TAAC->TACC, Cheescake->Cheesecake, óreo->Oreo,
 *     kentuky->Kentucky, rebosada->rebozada, Jamenson->Jameson,
 *     Shapphire->Sapphire, Baron B->Barón B, Sandia->Sandía, pimientosy->pimientos y,
 *     suavignon blanc->Sauvignon Blanc, torrentes dulce->Torrontés Dulce,
 *     Gin P/ de los Apóstoles->Gin Príncipe de los Apóstoles,
 *     Sab.->Sabores, Aperol Spirit->Aperol Spritz.
 *
 * Anomalías del PDF que NO se corrigieron (requieren confirmación del local):
 *   · "Corona Sin Alcohol $9200 | $12.000": el efectivo es mayor que el regular.
 *     Se transcribe tal cual y se marca con `check: true`.
 *   · "Rabas Crocantes" lleva el ícono veggie en el PDF; siendo calamar, se
 *     omitió el distintivo (ver `note` en el ítem).
 */

export const BRAND = {
  name: 'Joy Wake Park',
  slogan: ['Noches', 'mágicas'],
  place: 'San Juan · Argentina',
  season: 'Temporada 2026',
  priceNote:
    'En bebidas la carta original muestra dos valores: el precio regular y el precio abonando en efectivo.',
};

export const TAGS = {
  veggie: { short: 'Veggie', full: 'Apto vegetarianos' },
  sintacc: { short: 'Sin TACC', full: 'Sin TACC, apto celíacos' },
};

export const CATEGORIES = [
  {
    id: 'entradas',
    name: 'Entradas',
    kicker: 'Para empezar la noche',
    photo: 'c_entradas',
    alt: 'Manos compartiendo una fuente de papas rústicas sobre una mesa de madera en un bar de noche.',
    items: [
      { n: 'Papas Rústicas', d: 'con dips de lactonesa de ajo', p: 17320, tags: ['sintacc'] },
      { n: 'Papas Rústicas XL', d: 'con dips de lactonesa de ajo', p: 19580 },
      { n: 'Papas Cheddar, Verdeo y Jamón', p: 20710 },
      { n: 'Papas Cheddar, Verdeo y Jamón XL', p: 25795 },
      { n: 'Papas Joy', d: 'verduras asadas, matambre desmechado', p: 23535, tags: ['sintacc'] },
      { n: 'Papas Joy XL', d: 'verduras asadas, matambre desmechado', p: 25795 },
      { n: 'Papas Veggie', d: 'verduras asadas, dips de aderezo de berenjena', p: 18450, tags: ['veggie', 'sintacc'] },
      { n: 'Papas Veggie XL', d: 'verduras asadas, dips de aderezo de berenjena', p: 19580, tags: ['veggie'] },
      { n: 'Pollo Frito', d: 'pechuga de pollo rebozada con crocantes al estilo Kentucky', p: 20145 },
      { n: 'Rabas Crocantes', d: 'con dips de lactonesa de ajo', p: 20000, note: 'En el PDF original figura con el ícono veggie; al ser calamar, el distintivo no se replicó.' },
      { n: 'Tequeños', p: 22405 },
    ],
  },
  {
    id: 'sin-tacc',
    name: 'Sin TACC',
    kicker: 'Apto celíacos',
    photo: 'c_sintacc',
    alt: 'Plato de verduras asadas y papas iluminado por una sola lámpara cálida en un bar oscuro.',
    sectionTag: 'sintacc',
    items: [
      { n: 'Pachata Joy al plato', p: 23850 },
      { n: 'Papas Rústicas', p: 17320 },
      { n: 'Papas Joy', p: 23535 },
      { n: 'Papas Veggie', p: 18450, tags: ['veggie'] },
      { n: 'César Sin Crutones', p: 17858 },
    ],
  },
  {
    id: 'principales',
    name: 'Principales',
    kicker: 'Las pachatas de la casa',
    photo: 'c_principales',
    alt: 'Sándwich alto sobre tabla de madera en la barra de un bar de noche, a contraluz.',
    items: [
      { n: 'Pachata Joy', d: 'pan tipo francés, bife de lomo, lechuga, tomate, queso, jamón, omelette, papas rústicas', p: 22535 },
      { n: 'Pachata Veggie', d: 'pan tipo francés, seitán, tomate, verduras asadas, papas rústicas, dips de aderezo de berenjena', p: 22405, tags: ['veggie'] },
      { n: 'Pachata Wake Park', d: 'pan tipo francés, matambre desmechado, pimientos y cebollas asadas, huevo revuelto, mozzarella, lactonesa de ajo, papas rústicas', p: 24665 },
      { n: 'Club Joy', d: 'pan de miga XXL, pechuga de pollo ahumada, jamón, queso, omelette, lechuga, tomate, papas rústicas', p: 32575 },
      { n: 'Milanesa Napo / A Caballo', p: 23535 },
      { n: 'Milanesa Clásica', p: 20710 },
    ],
  },
  {
    id: 'pizzas',
    name: 'Pizzas',
    kicker: 'Masa a la piedra',
    photo: 'c_pizzas',
    alt: 'Pizza saliendo del horno sobre una pala de madera, con vapor y harina en el aire.',
    items: [
      { n: 'Muzza', d: 'masa a la piedra, salsa de tomate especial, mozzarella, aceitunas verdes', p: 21775 },
      { n: 'Napolitana', d: 'masa a la piedra, salsa de tomate especial, mozzarella, tomates de estación, pesto napolitano, aceitunas negras', p: 22405 },
      { n: 'Ibérica', d: 'masa a la piedra, salsa de tomate especial, mozzarella, jamón crudo estacionado, rúcula, queso parmesano, aceitunas negras', p: 26360 },
      { n: 'Especial', d: 'masa a la piedra, salsa de tomate especial, mozzarella, jamón cocido, huevo, pimiento morrón, aceitunas verdes', p: 24100 },
      { n: 'Veggie Napolitana', d: 'masa a la piedra, salsa de tomate especial, mozzarella veggie, tomates de estación, pesto napolitano, aceitunas negras', p: 29580, tags: ['veggie'] },
      { n: 'Veggie Verduras', d: 'masa a la piedra, salsa de tomate especial, mozzarella veggie, pimientos y cebollas asadas, aceitunas verdes', p: 25970, tags: ['veggie'] },
      { n: 'Veggie Mozzarella', d: 'masa a la piedra, salsa de tomate especial, mozzarella veggie, aceitunas verdes', p: 19580, tags: ['veggie'] },
    ],
  },
  {
    id: 'ensaladas',
    name: 'Ensaladas',
    kicker: 'Fresco y simple',
    photo: 'c_ensaladas',
    alt: 'Manos mezclando una ensalada con pinzas sobre una barra oscura, con luz dura lateral.',
    items: [
      { n: 'César', d: 'pechuga de pollo, lechuga, croutons, queso parmesano, aderezo césar', p: 16000 },
    ],
  },
  {
    id: 'postres',
    name: 'Postres',
    kicker: 'El final dulce',
    photo: 'c_postres',
    alt: 'Porción de torta en un plato sobre la barra, con una cuchara rompiendo la superficie.',
    items: [
      { n: 'Chocotorta', p: 8475 },
      { n: 'Cheesecake de frutos rojos', p: 8475 },
      { n: 'Cheesecake Oreo', p: 8475 },
    ],
  },
  {
    id: 'cervezas',
    name: 'Cervezas',
    kicker: 'Bien frías',
    photo: 'c_cervezas',
    alt: 'Botellas de cerveza heladas alineadas a contraluz sobre la barra, con siluetas de gente detrás.',
    dual: true,
    items: [
      { n: 'Corona 330', r: 9200, e: 8000 },
      { n: 'Corona 710', r: 13800, e: 12000 },
      { n: 'Corona Sin Alcohol', r: 9200, e: 12000, check: true, note: 'Valores transcriptos tal como figuran en el PDF original: el precio en efectivo aparece por encima del regular. A confirmar con el local.' },
    ],
  },
  {
    id: 'vinos',
    name: 'Vinos',
    kicker: 'De San Juan y del país',
    photo: 'c_vinos',
    alt: 'Mano sirviendo vino tinto en una copa a contraluz, con botellas desenfocadas al fondo.',
    dual: true,
    items: [
      { n: 'Joy Wine Malbec / Chardonnay', r: 17250, e: 15000 },
      { n: 'Casimiro Malbec', r: 24150, e: 21000 },
      { n: 'Casimiro Cabernet Sauvignon', r: 24150, e: 21000 },
      { n: 'Casimiro Syrah', r: 24150, e: 21000 },
      { n: 'Casimiro Malbec Rosé', r: 24150, e: 21000 },
      { n: 'Casimiro Blanco Dulce', r: 24150, e: 21000 },
      { n: 'Cafayate Torrontés', r: 17100, e: 15000 },
      { n: 'Cafayate Torrontés Tardío', r: 17100, e: 15000 },
      { n: 'Cafayate Malbec', r: 17100, e: 15000 },
      { n: 'Norton DN', r: 17100, e: 15000 },
      { n: 'Sexy Fish Blend de Blanc', r: 17100, e: 15000 },
      { n: 'Sexy Fish Malbec', r: 17100, e: 15000 },
      { n: 'Cordero con Piel de Lobo Malbec', r: 17100, e: 15000 },
      { n: 'Las Perdices', d: 'Malbec / Sauvignon Blanc / Torrontés Dulce', r: 22000, e: 19000 },
      { n: 'Los Intocables Malbec', r: 31500, e: 27000 },
      { n: 'Trumpeter Malbec', r: 27600, e: 24000 },
      { n: 'Saint Felicien Malbec', r: 34500, e: 30000 },
      { n: 'DV Catena Malbec-Malbec', r: 40500, e: 35000 },
      { n: 'DV Catena Cabernet-Malbec', r: 34500, e: 30000 },
      { n: 'Rutini Cabernet-Malbec', r: 46000, e: 40000 },
    ],
  },
  {
    id: 'espumantes',
    name: 'Espumantes',
    kicker: 'Para brindar',
    photo: 'c_espumantes',
    alt: 'Espumante desbordando en copas durante un brindis, con la multitud desenfocada detrás.',
    dual: true,
    items: [
      { n: 'Dante Robino / Nave Robino', r: 28000, e: 25000 },
      { n: 'Mumm', r: 33000, e: 30000 },
      { n: 'Chandon', r: 50425, e: 44000 },
      { n: 'Barón B', r: 98430, e: 86000 },
      { n: 'Norton Dulce Natural', r: 17100, e: 15000 },
      { n: 'Lata Mumm Lager', r: 9200, e: 8000 },
    ],
  },
  {
    id: 'sin-alcohol',
    name: 'Sin alcohol',
    kicker: 'Para toda la noche',
    photo: 'c_sinalcohol',
    alt: 'Jarra de limonada con menta y hielo sobre la barra de madera, a contraluz.',
    dual: true,
    items: [
      { n: 'Red Bull', d: 'Energy Drink / Sugar Free / Tropical / Sandía', r: 9100, e: 8000 },
      { n: 'Gaseosa 500 cc / Aguas Saborizadas', r: 5100, e: 4500 },
      { n: 'Agua con / sin gas', r: 4500, e: 4000 },
      { n: 'Jarra de Limonada', d: 'menta y jengibre, o naranja', r: 11500, e: 9000 },
      { n: 'Vaso de limonada o naranja', r: 5100, e: 4000 },
      { n: 'Gaseosa / Tónica 1½ L / Jugo Cepita', r: 12000, e: 10000 },
    ],
  },
  {
    id: 'copones',
    name: 'Copones',
    kicker: 'Vaso grande, noche larga',
    photo: 'c_copones',
    alt: 'Copones llenos de hielo sobre la barra y manos estirándose para tomarlos.',
    dual: true,
    items: [
      { n: 'Fernet con Coca', r: 11500, e: 10000 },
      { n: 'Sernova + jugo o Red Bull', r: 11500, e: 10000 },
      { n: 'Campari + jugo', r: 10350, e: 9000 },
      { n: 'Hodlmoser + Red Bull', r: 17250, e: 15000 },
      { n: 'Gin Cordillera', d: 'variedades', r: 13800, e: 12000 },
      { n: 'Gin Bombay Sapphire', r: 23000, e: 20000 },
      { n: 'Gin Bombay Bramble', r: 23000, e: 20000 },
      { n: 'Gin Brighton', r: 11500, e: 10000 },
      { n: 'Gin Beefeater', r: 16699, e: 15000 },
      { n: 'Tanqueray Sevilla', r: 23000, e: 20000 },
      { n: 'Tanqueray', r: 23000, e: 20000 },
      { n: 'Absolut Clásico + Red Bull', r: 19550, e: 17000 },
      { n: 'Absolut Sabores + Red Bull', r: 19550, e: 17000 },
      { n: 'Jagger + Red Bull o Tónica', r: 21850, e: 19000 },
      { n: 'Damon + Coca o tónica', r: 17250, e: 15000 },
      { n: 'Gin Heráclito London Dry', r: 11900, e: 10500 },
      { n: 'Gin Príncipe de los Apóstoles', r: 10800, e: 9500 },
      { n: 'Gin de la Casa', r: 11500, e: 10000 },
      { n: 'Ramazzotti', r: 11500, e: 10000 },
      { n: 'Medida Fernet', r: 8050, e: 7000 },
      { n: 'Gin Brighton Pink', r: 12650, e: 11000 },
      { n: 'Gin Brighton Tangerine', r: 12650, e: 11000 },
      { n: 'Gancia + Sprite', p: 7910 },
    ],
  },
  {
    id: 'tragos',
    name: 'Tragos',
    kicker: 'Coctelería de barra',
    photo: 'c_tragos',
    alt: 'Bartender colando un trago en una copa, con hielo y gotas suspendidas en el aire.',
    dual: true,
    items: [
      { n: 'Jameson Joy', r: 14950, e: 13000 },
      { n: 'Tinto del Joy', r: 10350, e: 9000 },
      { n: 'Mojito Clásico', r: 11500, e: 10000 },
      { n: 'Mojito Malibú', r: 13800, e: 12000 },
      { n: 'Malibú Joy', r: 13800, e: 12000 },
      { n: 'Malibú Summer', r: 11865, e: 10500 },
      { n: 'Caipiroska', r: 11500, e: 10000 },
      { n: 'Daiquiri de Frutas', d: 'durazno, frutilla o ananá', r: 12650, e: 11000 },
      { n: 'Baileys Dolca', r: 13800, e: 12000 },
      { n: 'Cynar Julep', r: 13800, e: 12000 },
      { n: 'Cynar Lemon', r: 13800, e: 12000 },
      { n: 'Tequila Sunrise', r: 11500, e: 10000 },
      { n: 'Sex on the Beach', r: 12650, e: 11000 },
      { n: 'Hold Julep', r: 12650, e: 11000 },
      { n: 'Aperol Spritz', r: 12650, e: 11000 },
      { n: 'Cuba Libre', r: 12650, e: 11000 },
      { n: 'Negroni', r: 13800, e: 12000 },
    ],
  },
  {
    id: 'whisky-medida',
    name: 'Whisky por medida',
    kicker: 'De a un trago',
    photo: 'c_whisky',
    alt: 'Vaso de whisky con un cubo de hielo grande sobre la barra, con luz rasante y humo.',
    dual: true,
    items: [
      { n: 'Jameson', r: 16100, e: 14000 },
      { n: 'Black Label', r: 16100, e: 14000 },
      { n: 'Red Label', r: 14950, e: 13000 },
    ],
  },
  {
    id: 'whisky-botella',
    name: 'Whisky por botella',
    kicker: 'Para la mesa',
    photo: 'c_whiskybot',
    alt: 'Botellas de whisky a contraluz en la estantería de la barra, con una mano tomando una.',
    dual: true,
    items: [
      { n: 'Jameson', r: 172500, e: 150000 },
      { n: 'Black Label', r: 189750, e: 165000 },
      { n: 'Red Label', r: 135150, e: 115000 },
    ],
  },
  {
    id: 'botellas',
    name: 'Botellas',
    kicker: 'Botella completa con su acompañamiento',
    photo: 'c_botellas',
    alt: 'Botellas con estrellitas atravesando la multitud en la noche, con estelas de chispas.',
    dual: true,
    items: [
      { n: 'Fernet + 2 Cocas 1.5 L', r: 78000, e: 68000 },
      { n: 'Campari + Jugo', r: 53130, e: 47000 },
      { n: 'Brighton + Tónica', r: 55200, e: 48000 },
      { n: 'Gin Cordillera + Tónica', d: 'variedades', r: 69690, e: 61000 },
      { n: 'Beefeater + Tónica', r: 105800, e: 92000 },
      { n: 'Tanqueray Sevilla + Tónica', r: 105800, e: 101000 },
      { n: 'Tanqueray + Tónica', r: 105800, e: 101000 },
      { n: 'Bombay + Tónica', r: 120750, e: 105000 },
      { n: 'Bombay Bramble + Tónica', r: 120750, e: 105000 },
      { n: 'Absolut Clásico + Gaseosa o 4 Red Bull', r: 108900, e: 95000 },
      { n: 'Absolut Sabores + Gaseosa o 4 Red Bull', r: 108900, e: 95000 },
      { n: 'Ron Havana Dorado + Coca', r: 75260, e: 66000 },
      { n: 'Ron Havana Blanco + Coca', r: 75260, e: 66000 },
      { n: 'Sernova Sabores + Gaseosa o 4 Red Bull', r: 75260, e: 66000 },
      { n: 'Hodlmoser + 4 Red Bull', r: 108900, e: 95000 },
      { n: 'Jagger + 4 Red Bull', r: 138000, e: 120000 },
      { n: 'Damonjag + Coca o Tónica', r: 88550, e: 77000 },
      { n: 'Ramazzotti + Tónica', r: 51750, e: 45000 },
      { n: 'Blu Spirito + Tónica', r: 67850, e: 59000 },
      { n: 'Brighton Pink / Tangerine + Tónica 1.5 L', r: 58650, e: 51000 },
    ],
  },
  {
    id: 'promos-previas',
    name: 'Promos previas',
    kicker: 'Para agitar hasta el final',
    photo: 'c_promos',
    alt: 'Multitud joven con los tragos en alto en un bar al aire libre de noche, iluminada con flash.',
    dual: true,
    items: [
      { n: 'Fernet + Coca 1.5 L', r: 65500, e: 57000 },
      { n: 'Gin Brighton + Tónica', r: 43700, e: 38000 },
      { n: 'Sernova + 3 Red Bull', r: 64400, e: 56000 },
      { n: 'Absolut + 3 Red Bull', r: 97750, e: 85000 },
      { n: 'Beefeater + Tónica', r: 94300, e: 85000 },
      { n: 'Campari + Jugo Cepita', r: 46000, e: 40000 },
      { n: 'Havana Blanco + Coca 1.5 L', r: 64400, e: 56000 },
      { n: 'Hodlmoser + 3 Red Bull', r: 97750, e: 85000 },
      { n: 'Bombay Sapphire + Tónica', r: 109250, e: 95000 },
      { n: 'Blu Spirito + Tónica', r: 46000, e: 40000 },
    ],
  },
];
