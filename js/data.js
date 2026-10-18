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

const GEMSTONES = [];

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
