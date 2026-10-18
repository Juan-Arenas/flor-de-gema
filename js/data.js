// Catálogo Maestro de Gemas y Contenido - Flor De Gema
// Eslogan: "Flor De Gema, Invierte en belleza eterna"

// Utilidades globales de formato y normalización
function formatCOP(value) {
  const num = Number(value) || 0;
  return '$ ' + num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function formatUSD(value) {
  const num = Number(value) || 0;
  return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function normalizeCategorySlug(name) {
  if (!name) return 'esmeraldas';
  return String(name)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'esmeraldas';
}
window.formatCOP = formatCOP;
window.formatUSD = formatUSD;
window.normalizeCategorySlug = normalizeCategorySlug;

const FLOR_DE_GEMA_CONFIG = {
  brand: "Flor De Gema",
  slogan: "Invierte en belleza eterna",
  whatsappNumber: "573016256746",
  whatsappDisplay: "+57 301 625 6746",
  social: {
    instagram: "https://instagram.com/flordegemas",
    instagramHandle: "@flordegemas",
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
  { id: "all", name: "Todas las Gemas" },
  { id: "esmeraldas", name: "Esmeraldas" },
  { id: "zafiros", name: "Zafiros" },
  { id: "rubies", name: "Rubíes" },
  { id: "turmalinas", name: "Turmalinas & Paraíba" },
  { id: "coleccion", name: "Colección Exclusiva" }
];

const GEMSTONES = [
  {
    id: "FDG-ESM-001",
    name: "Esmeralda Muzo 3.45 ct",
    category: "esmeraldas",
    priceCOP: 18500000,
    priceUSD: 4650,
    carats: 3.45,
    dimensions: "9.82 x 7.64 x 5.90 mm",
    shape: "Octagonal",
    cut: "Talla Esmeralda",
    color: "Verde Muzo Intenso",
    clarity: "Jardín natural fino",
    treatment: "Aceite de cedro insignificante",
    origin: "Muzo, Boyacá, Colombia",
    reportNumber: "CDTEC-2026-88492",
    lab: "CDTEC Colombia",
    image: "assets/images/emerald-gem.jpg",
    featured: true,
    isLiveLot: true,
    badge: "Muzo",
    description: "Esmeralda con el legendario verde gota de aceite de Muzo. Color saturado de máxima vibrancia con brillo interno excepcional y proporciones ideales."
  },
  {
    id: "FDG-ZAF-002",
    name: "Zafiro Ceilán 2.85 ct",
    category: "zafiros",
    priceCOP: 14200000,
    priceUSD: 3580,
    carats: 2.85,
    dimensions: "8.65 x 7.10 x 5.20 mm",
    shape: "Cojín",
    cut: "Mixta Brillante",
    color: "Azul Real Intenso",
    clarity: "Eye Clean",
    treatment: "Sin tratamiento térmico (No Heat)",
    origin: "Ratnapura, Sri Lanka",
    reportNumber: "GIA-549102844",
    lab: "GIA Report",
    image: "assets/images/sapphire-gem.jpg",
    featured: true,
    isLiveLot: true,
    badge: "Natural",
    description: "Excepcional corindón azul zafiro con denominación Royal Blue. Completamente natural, sin tratamiento térmico comprobado por laboratorio."
  },
  {
    id: "FDG-RUB-003",
    name: "Rubí Birmano 2.10 ct",
    category: "rubies",
    priceCOP: 16800000,
    priceUSD: 4200,
    carats: 2.10,
    dimensions: "7.80 x 6.95 x 4.80 mm",
    shape: "Cojín",
    cut: "Cojín Brillante",
    color: "Rojo Sangre de Pichón",
    clarity: "VVS Transparente",
    treatment: "Térmico tradicional estándar",
    origin: "Mogok, Birmania",
    reportNumber: "GRS-2026-04912",
    lab: "GRS Swisslab",
    image: "assets/images/ruby-gem.jpg",
    featured: true,
    isLiveLot: false,
    badge: "Pigeon Blood",
    description: "Rubí de colección con la tonalidad Rojo Sangre de Pichón. Posee fluorescencia roja intensa bajo luz natural y saturación cromática pura."
  },
  {
    id: "FDG-TUR-004",
    name: "Lote Gemas Finas 12 ct",
    category: "turmalinas",
    priceCOP: 22000000,
    priceUSD: 5500,
    carats: 12.00,
    dimensions: "6 a 10 mm",
    shape: "Mixtas",
    cut: "Facetado de Precisión",
    color: "Multicolor Exótico",
    clarity: "VVS a Eye Clean",
    treatment: "100% Gemas Naturales",
    origin: "Brasil, Tanzania, Colombia",
    reportNumber: "FDG-CERT-2026",
    lab: "Flor De Gema Certified",
    image: "assets/images/gem-collection.jpg",
    featured: true,
    isLiveLot: true,
    badge: "Colección",
    description: "Colección curada para maestros joyeros o coleccionistas. Incluye ejemplares de turmalina verde cromo, tanzanita, morganita y espinela."
  },
  {
    id: "FDG-ESM-005",
    name: "Esmeralda Chivor 1.95 ct",
    category: "esmeraldas",
    priceCOP: 9800000,
    priceUSD: 2450,
    carats: 1.95,
    dimensions: "8.90 x 6.20 x 4.30 mm",
    shape: "Pera",
    cut: "Pera Brillante",
    color: "Verde Azulado Chivor",
    clarity: "Inclusiones trifásicas",
    treatment: "Aceitado leve tradicional",
    origin: "Chivor, Boyacá, Colombia",
    reportNumber: "CDTEC-2026-90112",
    lab: "CDTEC Colombia",
    image: "assets/images/emerald-gem.jpg",
    featured: false,
    isLiveLot: false,
    badge: "Chivor",
    description: "El inconfundible tono verde con matiz azulado característico de las minas de Chivor. Brillo cristalino insuperable, ideal para dije o anillo."
  },
  {
    id: "FDG-COL-006",
    name: "Quinteto Imperial 15.5 ct",
    category: "coleccion",
    priceCOP: 31000000,
    priceUSD: 7800,
    carats: 15.50,
    dimensions: "Serie alineada de museo",
    shape: "Octagonal y Oval",
    cut: "Alta Joyería",
    color: "Espectro Completo",
    clarity: "Élite Gemológica",
    treatment: "Gemas Naturales Garantizadas",
    origin: "Selección Global de Mina",
    reportNumber: "FDG-GLOBAL-2026",
    lab: "Flor De Gema Certified",
    image: "assets/images/hero-gemstones.jpg",
    featured: true,
    isLiveLot: true,
    badge: "Vitrina",
    description: "Cinco gemas de altísima graduación cromática. El pináculo de nuestra selección 'Invierte en belleza eterna'."
  },
  {
    id: "FDG-ESM-007",
    name: "Esmeralda Coscuez 2.40 ct",
    category: "esmeraldas",
    priceCOP: 12500000,
    priceUSD: 3150,
    carats: 2.40,
    dimensions: "8.50 x 7.10 x 4.90 mm",
    shape: "Octagonal",
    cut: "Talla Esmeralda",
    color: "Verde Vivo Brillante",
    clarity: "Translúcida con fuego interno",
    treatment: "Aceite vegetal menor",
    origin: "Coscuez, Boyacá, Colombia",
    reportNumber: "CDTEC-2026-91400",
    lab: "CDTEC Colombia",
    image: "assets/images/emerald-gem.jpg",
    featured: true,
    isLiveLot: false,
    badge: "Coscuez",
    description: "Extraída de las legendarias minas de Coscuez. Tonalidad radiante y cristalino fuego interno con excelente corte simétrico."
  },
  {
    id: "FDG-ZAF-008",
    name: "Zafiro Padparadscha 1.85 ct",
    category: "zafiros",
    priceCOP: 15900000,
    priceUSD: 3980,
    carats: 1.85,
    dimensions: "7.90 x 6.40 x 4.20 mm",
    shape: "Oval",
    cut: "Oval Mixto",
    color: "Rosa-Salmón Padparadscha",
    clarity: "Eye Clean",
    treatment: "Sin tratamiento térmico (No Heat)",
    origin: "Sri Lanka",
    reportNumber: "GRS-2026-11892",
    lab: "GRS Swisslab",
    image: "assets/images/sapphire-gem.jpg",
    featured: true,
    isLiveLot: true,
    badge: "Padparadscha",
    description: "Una de las variedades más escasas del mundo: tono color flor de loto rosa-anaranjado sin calor artificial. Rareza de colección."
  },
  {
    id: "FDG-RUB-009",
    name: "Rubí Estrella Natural 3.10 ct",
    category: "rubies",
    priceCOP: 11400000,
    priceUSD: 2850,
    carats: 3.10,
    dimensions: "8.20 x 7.50 x 5.10 mm",
    shape: "Cabujón",
    cut: "Cabujón Oval Pulido",
    color: "Rojo Púrpura Asterismo",
    clarity: "Estrella nítida de 6 puntas",
    treatment: "100% Natural sin tratamiento",
    origin: "Madagascar",
    reportNumber: "GIA-22904811",
    lab: "GIA Report",
    image: "assets/images/ruby-gem.jpg",
    featured: false,
    isLiveLot: true,
    badge: "Estrella",
    description: "Fenómeno óptico de asterismo natural: despliega una estrella de seis rayos perfectamente centrada bajo luz puntual directa."
  },
  {
    id: "FDG-TUR-010",
    name: "Turmalina Verde Cromo 2.70 ct",
    category: "turmalinas",
    priceCOP: 8600000,
    priceUSD: 2150,
    carats: 2.70,
    dimensions: "9.10 x 6.80 x 4.60 mm",
    shape: "Octagonal",
    cut: "Step Cut",
    color: "Verde Esmeralda Profundo",
    clarity: "VVS Casi Flawless",
    treatment: "Sin tratamiento conocido",
    origin: "Tanzania",
    reportNumber: "FDG-TUR-2026",
    lab: "Flor De Gema Certified",
    image: "assets/images/gem-collection.jpg",
    featured: false,
    isLiveLot: false,
    badge: "Cromo",
    description: "Turmalina coloreada naturalmente por cromo y vanadio, con un tono verde bosque intenso semejante al de las esmeraldas más finas."
  }
];

const ACADEMY_ARTICLES = [
  {
    id: "esmeraldas-colombianas",
    title: "Por qué la Esmeralda Colombiana es la Reina del Mundo Gemológico",
    readTime: "5 min de lectura",
    category: "Origen & Valor",
    snippet: "Descubre el misterio geológico de las minas de Muzo, Chivor y Coscuez, y por qué sus esmeraldas alcanzan precios récord mundiales.",
    fullContent: `
      <h3>La Geología Única de los Andes Colombianos</h3>
      <p>A diferencia de las esmeraldas de Brasil o Zambia que se forman en rocas ígneas, las esmeraldas colombianas se gestaron en sedimentos hidrotermales hace más de 30 millones de años. Este fenómeno geotérmico libre de hierro otorga a la esmeralda colombiana su verde puro, intenso y fluorescente.</p>
      
      <h3>Las Minas Legendarias:</h3>
      <ul>
        <li><strong>Muzo:</strong> Famosa por el verde gota de aceite profundo y aterciopelado.</li>
        <li><strong>Chivor:</strong> Verde azulado eléctrico y extraordinaria transparencia cristalina.</li>
        <li><strong>Coscuez:</strong> Cristales de verde brillante y fuego radiante.</li>
      </ul>

      <h3>El Concepto del "Jardín":</h3>
      <p>Las inclusiones en una esmeralda natural colombiana no son defectos: son su huella dactilar, conocidas como "el jardín" (le jardin). Certifican su origen natural y revelan inclusiones trifásicas de gas, líquido y sal exclusivas de Colombia.</p>
    `
  },
  {
    id: "guia-de-las-4c",
    title: "Las 4C en Gemas de Color: Diferencias Clave con los Diamantes",
    readTime: "7 min de lectura",
    category: "Gemología Práctica",
    snippet: "En las gemas preciosas de color, el color representa hasta el 70% del valor total de la piedra. Aprende a evaluarlas como un experto.",
    fullContent: `
      <h3>1. Color (El Factor Supremo):</h3>
      <p>En rubíes, zafiros y esmeraldas, el color reina por encima de todo:</p>
      <ul>
        <li><strong>Tono:</strong> El color primario y matices secundarios.</li>
        <li><strong>Saturación:</strong> La pureza e intensidad del color.</li>
        <li><strong>Luminosidad:</strong> La luz u oscuridad equilibrada.</li>
      </ul>

      <h3>2. Claridad:</h3>
      <p>Las gemas de color tipo III siempre presentan inclusiones naturales. Lo fundamental es que la gema mantenga transparencia y luz viva.</p>

      <h3>3. Talla y Quilates:</h3>
      <p>La talla busca maximizar la intensidad del color y conservar el peso en quilates sin crear ventanas oscuras o centros apagados.</p>
    `
  },
  {
    id: "tratamientos-en-gemas",
    title: "Tratamientos y Mejoras: Qué es Aceptado y Qué Disminuye el Valor",
    readTime: "6 min de lectura",
    category: "Transparencia & Ética",
    snippet: "Conoce la diferencia entre tratamientos tradicionales históricos (aceite de cedro natural, calentamiento suave) y tratamientos invasivos no recomendados.",
    fullContent: `
      <h3>Tratamientos Tradicionales y Aceptados:</h3>
      <p>Procesos históricos reconocidos por la industria internacional:</p>
      <ul>
        <li><strong>Aceite de Cedro Natural (Esmeraldas):</strong> Práctica tradicional para hidratar microfisuras superficiales con resina vegetal orgánica. Es reversible y respetuosa.</li>
        <li><strong>Tratamiento Térmico Tradicional (Zafiros y Rubíes):</strong> Replica el calor natural de la tierra para estabilizar el color.</li>
      </ul>

      <h3>Tratamientos Invasivos (Rechazados en Flor De Gema):</h3>
      <p>Rechazamos rellenos de vidrio con plomo (lead glass) o resinas epóxicas sintéticas que degradan el valor y la durabilidad de la joya.</p>
    `
  },
  {
    id: "como-leer-reporte-laboratorio",
    title: "Cómo Leer y Comprender un Reporte Gemológico Oficial",
    readTime: "4 min de lectura",
    category: "Certificación",
    snippet: "Aprende a verificar números de reporte de entidades como CDTEC, GIA y GRS para proteger tu inversión en piedras preciosas.",
    fullContent: `
      <h3>Los Datos Clave de un Reporte:</h3>
      <ol>
        <li><strong>Identificación de la Especie:</strong> Debe indicar explícitamente "Natural Beryl" o "Natural Corundum".</li>
        <li><strong>Origen Geográfico:</strong> Certificado emitido tras análisis espectrométrico (ej: Colombia, Sri Lanka).</li>
        <li><strong>Grado de Tratamiento:</strong> Indica si existe modificación térmica o de sustancias menores.</li>
        <li><strong>Validación Digital:</strong> Código de verificación verificable en línea contra el laboratorio oficial.</li>
      </ol>
    `
  }
];
