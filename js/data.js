// Catálogo Maestro de Gemas y Contenido - Flor De Gema
// Eslogan: "Flor De Gema, Invierte en belleza eterna"

const FLOR_DE_GEMA_CONFIG = {
  brand: "Flor De Gema",
  slogan: "Invierte en belleza eterna",
  whatsappNumber: "573016256746",
  whatsappDisplay: "+57 301 625 6746",
  social: {
    instagram: "https://instagram.com/flordegema.s",
    instagramHandle: "@flordegema.s",
    tiktok: "https://tiktok.com/@flor.de.gema",
    tiktokHandle: "@flor.de.gema",
    facebook: "https://facebook.com/flordegema",
    facebookHandle: "Flor De Gema"
  },
  liveStream: {
    nextLiveTitle: "Gran Transmisión en Vivo: Lotes Exclusivos de Esmeraldas y Zafiros",
    platform: "TikTok & Instagram Live",
    datetime: "2026-10-25T19:00:00-05:00",
    description: "Presentación en directo de nuevas adquisiciones de minas de Muzo y Ceilán. Precios preferenciales y apartados en vivo."
  }
};

const GEM_CATEGORIES = [
  { id: "all", name: "Todas las Gemas", icon: "💎" },
  { id: "esmeraldas", name: "Esmeraldas", icon: "✨", image: "assets/images/emerald-gem.jpg", tag: "Especialidad Colombia" },
  { id: "zafiros", name: "Zafiros", icon: "🔹", image: "assets/images/sapphire-gem.jpg", tag: "Ceilán & Madagascar" },
  { id: "rubies", name: "Rubíes", icon: "❤️", image: "assets/images/ruby-gem.jpg", tag: "Sangre de Pichón" },
  { id: "turmalinas", name: "Turmalinas & Paraíba", icon: "🔮", image: "assets/images/gem-collection.jpg", tag: "Colores Eléctricos" },
  { id: "coleccion", name: "Gemas de Colección", icon: "👑", image: "assets/images/hero-gemstones.jpg", tag: "Piezas Únicas" }
];

const GEMSTONES = [
  {
    id: "FDG-ESM-001",
    name: "Esmeralda Colombiana Muzo 3.45 ct",
    category: "esmeraldas",
    priceCOP: 18500000,
    priceUSD: 4650,
    carats: 3.45,
    dimensions: "9.82 x 7.64 x 5.90 mm",
    shape: "Octagonal",
    cut: "Talla Esmeralda Clásica (Step Cut)",
    color: "Verde Muzo Intenso (Vivid Green)",
    clarity: "Jardín natural fino y translúcido",
    treatment: "Aceite de cedro menor tradicional (Insignificante)",
    origin: "Minas de Muzo, Boyacá, Colombia",
    reportNumber: "CDTEC-2026-88492",
    lab: "CDTEC (Centro de Desarrollo Tecnológico de la Esmeralda Colombiana)",
    image: "assets/images/emerald-gem.jpg",
    featured: true,
    isLiveLot: true,
    badge: "Pieza Maestra",
    description: "Una esmeralda con el legendario verde gota de aceite de Muzo. Color saturado de máxima vibrancia con brillo interno excepcional y corte de proporciones ideales para alta joyería."
  },
  {
    id: "FDG-ZAF-002",
    name: "Zafiro Real de Ceilán 2.85 ct",
    category: "zafiros",
    priceCOP: 14200000,
    priceUSD: 3580,
    carats: 2.85,
    dimensions: "8.65 x 7.10 x 5.20 mm",
    shape: "Cojín (Cushion)",
    cut: "Talla Mixta Brillante",
    color: "Azul Real Intenso (Royal Blue)",
    clarity: "Eye Clean (Sin inclusiones a simple vista)",
    treatment: "Sin tratamiento térmico (No Heat)",
    origin: "Ratnapura, Sri Lanka (Ceilán)",
    reportNumber: "GIA-549102844",
    lab: "GIA (Gemological Institute of America)",
    image: "assets/images/sapphire-gem.jpg",
    featured: true,
    isLiveLot: true,
    badge: "No Heat / Natural",
    description: "Excepcional corindón azul zafiro con denominación 'Royal Blue'. Completamente natural, sin tratamiento térmico comprobado por laboratorio internacional. Fuego y destellos aterciopelados."
  },
  {
    id: "FDG-RUB-003",
    name: "Rubí Sangre de Pichón 2.10 ct",
    category: "rubies",
    priceCOP: 16800000,
    priceUSD: 4200,
    carats: 2.10,
    dimensions: "7.80 x 6.95 x 4.80 mm",
    shape: "Cojín (Cushion)",
    cut: "Talla Cojín Brillante Modificada",
    color: "Rojo Sangre de Pichón (Pigeon Blood Red)",
    clarity: "VVS (Muy alta transparencia)",
    treatment: "Tratamiento térmico estándar tradicional",
    origin: "Mogok, Birmania (Myanmar)",
    reportNumber: "GRS-2026-04912",
    lab: "GRS GemResearch Swisslab",
    image: "assets/images/ruby-gem.jpg",
    featured: true,
    isLiveLot: false,
    badge: "Pigeon Blood",
    description: "Rubí de colección con la tonalidad más codiciada en gemología: Rojo Sangre de Pichón. Posee fluorescencia roja intensa bajo luz natural y una saturación cromática pura sin tonos secundarios."
  },
  {
    id: "FDG-TUR-004",
    name: "Lote Colección Gemas Finas 12 ct Total",
    category: "turmalinas",
    priceCOP: 22000000,
    priceUSD: 5500,
    carats: 12.00,
    dimensions: "Variadas (6 mm a 10 mm)",
    shape: "Mixtas (Oval, Cojín, Pera, Esmeralda)",
    cut: "Facetado de Precisión",
    color: "Multicolor de Lujo (Verde Cromo, Tanzanita, Morganita, Espinela)",
    clarity: "VVS a Eye Clean",
    treatment: "100% Gemas Naturales Seleccionadas",
    origin: "Brasil, Tanzania, Afganistán, Colombia",
    reportNumber: "FDG-CERT-2026-077",
    lab: "Reporte Gemológico Flor De Gema con Verificación",
    image: "assets/images/gem-collection.jpg",
    featured: true,
    isLiveLot: true,
    badge: "Lote de Coleccionista",
    description: "Colección curada para maestros joyeros o coleccionistas de alta inversión. Incluye ejemplares de turmalina verde cromo, tanzanita azul-violeta, morganita melocotón y espinela fuego."
  },
  {
    id: "FDG-ESM-005",
    name: "Esmeralda Gota de Fuego Chivor 1.95 ct",
    category: "esmeraldas",
    priceCOP: 9800000,
    priceUSD: 2450,
    carats: 1.95,
    dimensions: "8.90 x 6.20 x 4.30 mm",
    shape: "Pera (Pear Cut)",
    cut: "Talla Pera Facetada Brillante",
    color: "Verde Azulado Brillante (Chivor Tone)",
    clarity: "Translúcida con inclusiones trifásicas típicas",
    treatment: "Aceitado leve tradicional",
    origin: "Minas de Chivor, Boyacá, Colombia",
    reportNumber: "CDTEC-2026-90112",
    lab: "CDTEC Colombia",
    image: "assets/images/emerald-gem.jpg",
    featured: false,
    isLiveLot: false,
    badge: "Chivor Azulado",
    description: "El inconfundible tono verde con matiz azulado característico de las minas de Chivor. Brillo cristalino insuperable y formato gota ideal para dije o anillo de compromiso exclusivo."
  },
  {
    id: "FDG-COL-006",
    name: "Quinteto Imperial de Gemas Raras 15.5 ct",
    category: "coleccion",
    priceCOP: 31000000,
    priceUSD: 7800,
    carats: 15.50,
    dimensions: "Serie alineada en estuche de lujo",
    shape: "Tallas Octagonales y Ovales",
    cut: "Corte de Alta Joyería",
    color: "Espectro Completo de Gemas Preciosas",
    clarity: "Selección de Élite",
    treatment: "Gemas Naturales Garantizadas de por Vida",
    origin: "Selección Global Directa de Mina",
    reportNumber: "FDG-GLOBAL-2026",
    lab: "Flor De Gema Certified Vault",
    image: "assets/images/hero-gemstones.jpg",
    featured: true,
    isLiveLot: true,
    badge: "Exclusivo de Vitrina",
    description: "Una obra de arte de la naturaleza: cinco gemas de altísima graduación cromática presentadas sobre pizarra natural. El pináculo de nuestra selección 'Invierte en belleza eterna'."
  }
];

const ACADEMY_ARTICLES = [
  {
    id: "esmeraldas-colombianas",
    title: "Por qué la Esmeralda Colombiana es la Reina del Mundo Gemológico",
    readTime: "5 min de lectura",
    category: "Origen & Valor",
    snippet: "Descubre el misterio geológico de las minas de Muzo, Chivor y Coscuez, y por qué sus esmeraldas alcanzan precios récord mundiales en casas de subastas.",
    fullContent: `
      <h3>La Geología Única de los Andes Colombianos</h3>
      <p>A diferencia de las esmeraldas de Brasil o Zambia que se forman en rocas ígneas y pegmatitas, las esmeraldas colombianas se gestaron en sedimentos hidrotermales sedimentarios hace más de 30 millones de años. Este fenómeno geotérmico único libre de hierro otorga a la esmeralda colombiana su verde puro, intenso y fluorescente.</p>
      
      <h3>Las Minas Legendarias:</h3>
      <ul>
        <li><strong>Muzo:</strong> Conocida por el codiciado color verde profundo y aterciopelado ("Gota de Aceite"), símbolo de máxima opulencia.</li>
        <li><strong>Chivor:</strong> Célebre por sus esmeraldas de verde azulado eléctrico y extraordinaria transparencia cristalina.</li>
        <li><strong>Coscuez:</strong> Famosa por sus cristales de verde brillante y fuego radiante.</li>
      </ul>

      <h3>El Concepto del "Jardín":</h3>
      <p>Las inclusiones en una esmeralda natural colombiana no son defectos: son su huella dactilar, conocidas poéticamente como "el jardín" (le jardin). Certifican su origen natural y revelan inclusiones trifásicas microscópicas de gas, líquido y sal que son exclusivas de Colombia.</p>
    `
  },
  {
    id: "guia-de-las-4c",
    title: "Las 4C en Gemas de Color: Diferencias Clave con los Diamantes",
    readTime: "7 min de lectura",
    category: "Gemología Práctica",
    snippet: "En las gemas preciosas de color, las reglas cambian. El color representa hasta el 70% del valor total de la piedra. Aprende a evaluarlas como un experto.",
    fullContent: `
      <h3>1. Color (El Factor Supremo):</h3>
      <p>En rubíes, zafiros y esmeraldas, el color reina por encima de todo. Se analiza en tres dimensiones:</p>
      <ul>
        <li><strong>Tono (Hue):</strong> El color primario y los matices secundarios (ej: Verde con ligero matiz azulado).</li>
        <li><strong>Saturación (Saturation):</strong> La pureza e intensidad del color, desde apagado hasta vivido y saturado.</li>
        <li><strong>Luminosidad (Tone):</strong> La cantidad de luz u oscuridad en la gema.</li>
      </ul>

      <h3>2. Claridad (Clarity):</h3>
      <p>A diferencia del diamante donde se busca la pureza microscópica, las gemas de color tipo III (como las esmeraldas) siempre presentan inclusiones naturales. Lo fundamental es que la gema mantenga vida, transparencia y luz.</p>

      <h3>3. Talla (Cut):</h3>
      <p>El maestro tallador de gemas de color busca maximizar la intensidad del color y conservar el peso en quilates sin crear ventanas oscuras ("extinction") o centros vacíos ("windowing").</p>

      <h3>4. Peso en Quilates (Carat):</h3>
      <p>El valor por quilate aumenta exponencialmente al superar barreras clave como 1 ct, 2 ct, 3 ct y 5 ct debido a la extrema escasez en la naturaleza.</p>
    `
  },
  {
    id: "tratamientos-en-gemas",
    title: "Tratamientos y Mejoras: Qué es Aceptado y Qué Disminuye el Valor",
    readTime: "6 min de lectura",
    category: "Transparencia & Ética",
    snippet: "Conoce la diferencia entre tratamientos tradicionales históricos (aceite de cedro natural, calentamiento suave) y tratamientos invasivos que no admitimos en Flor De Gema.",
    fullContent: `
      <h3>Tratamientos Tradicionales y Aceptados:</h3>
      <p>En el comercio internacional de gemas existen procesos históricos que se consideran estándares de la industria, siempre y cuando sean divulgados honestamente:</p>
      <ul>
        <li><strong>Aceite de Cedro Natural (Esmeraldas):</strong> Práctica milenaria para hidratar microfisuras superficiales con resina vegetal orgánica. Es reversible y no altera el cristal.</li>
        <li><strong>Tratamiento Térmico Tradicional (Zafiros y Rubíes):</strong> Proceso que replica el calor natural de la tierra para disolver agujas de rutilo y estabilizar el color. Es permanente y aceptado mundialmente.</li>
      </ul>

      <h3>Tratamientos Invasivos (No recomendados para inversión):</h3>
      <p>En Flor De Gema rechazamos taxativamente tratamientos como vidrio de plomo (lead glass filling), resinas epóxicas sintéticas de polímeros o difusión de berilio profunda, ya que degradan el valor intrínseco de la joya.</p>
    `
  },
  {
    id: "como-leer-reporte-laboratorio",
    title: "Cómo Leer y Comprender un Reporte Gemológico Oficial",
    readTime: "4 min de lectura",
    category: "Certificación",
    snippet: "Aprende a verificar números de reporte de entidades como CDTEC, GIA y GRS para proteger tu inversión en piedras preciosas.",
    fullContent: `
      <h3>Los Datos Innegociables de un Reporte:</h3>
      <ol>
        <li><strong>Identificación de la Especie y Variedad:</strong> Debe certificar explícitamente "Natural Beryl (Emerald)" o "Natural Corundum (Sapphire/Ruby)".</li>
        <li><strong>Determinación de Origen Geográfico:</strong> Solo laboratorios con bases de datos espectrométricas avanzadas pueden emitir dictámenes de origen (ej: Colombia, Sri Lanka, Myanmar).</li>
        <li><strong>Grado de Tratamiento:</strong> Indica la presencia de sustancias foráneas (None, Minor, Moderate, Significant).</li>
        <li><strong>Firma Gemológica y Código QR:</strong> Todo reporte moderno incluye validación digital en línea contra la base de datos oficial del laboratorio.</li>
      </ol>
    `
  }
];

// Documentación de Espacios para Flyers recomendados para el usuario
const FLYER_SLOTS_INFO = [
  {
    id: "hero-slider",
    name: "Flyer Principal Hero / Banner de Cabecera",
    ratio: "16:9 Desktop (1920x1080 px) y 4:5 Mobile (1080x1350 px)",
    formats: "WebP (recomendado) o PNG de alta fidelidad",
    suggestedTheme: "Lanzamiento de Colección Nueva, Eslogan 'Flor De Gema, Invierte en belleza eterna', Fotografía de joyas y gemas sobre fondo oscuro.",
    currentImage: "assets/images/hero-gemstones.jpg"
  },
  {
    id: "live-promo",
    name: "Flyer de Transmisión en Vivo (TikTok & Instagram)",
    ratio: "3:4 o 9:16 Vertical (1080x1440 px o 1080x1920 px)",
    formats: "WebP o JPG 100% calidad",
    suggestedTheme: "Anuncio de Fecha y Hora del Live, Cuenta regresiva, Lotes exclusivos a subastar o vender, Foto de esmeralda y zafiro con destellos dorados.",
    currentImage: "assets/images/flyer-live-gemas.jpg"
  },
  {
    id: "catalog-promo",
    name: "Banner Promocional Intermedio de Catálogo",
    ratio: "21:9 Panorámico (1920x600 px o 1200x500 px)",
    formats: "WebP optimizado (< 300 KB)",
    suggestedTheme: "Asesoría Gemológica Personalizada vía WhatsApp, Garantía de Autenticidad Vitalicia, Envíos Asegurados Nacionales e Internacionales.",
    currentImage: "assets/images/gem-lab.jpg"
  }
];
