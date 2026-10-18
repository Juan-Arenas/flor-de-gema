const { neon } = require('./Ventas Maquillaje/node_modules/@neondatabase/serverless');

const DATABASE_URL = 'postgresql://authenticator:npg_l1dPIAZeQ6rb@ep-holy-rice-ayq7meg3.c-5.us-east-2.aws.neon.tech/valen?sslmode=require';

const INITIAL_GEMS = [
  {
    name: "Esmeralda Muzo 3.45 ct",
    category: "Esmeraldas",
    price: 18500000,
    weight_ct: "3.45 ct",
    dimensions_mm: "9.82 x 7.64 x 5.90 mm",
    origin: "Muzo, Boyacá, Colombia",
    cut: "Talla Esmeralda",
    color: "Verde Muzo Intenso",
    treatment: "Aceite de cedro insignificante",
    certificate: "CDTEC Colombia #CDTEC-2026-88492",
    description: "Esmeralda con el legendario verde gota de aceite de Muzo. Color saturado de máxima vibrancia con brillo interno excepcional y proporciones ideales.",
    image: "assets/images/emerald-gem.jpg",
    status: "Disponible",
    featured: true
  },
  {
    name: "Zafiro Ceilán 2.85 ct",
    category: "Zafiros",
    price: 14200000,
    weight_ct: "2.85 ct",
    dimensions_mm: "8.65 x 7.10 x 5.20 mm",
    origin: "Ratnapura, Sri Lanka",
    cut: "Mixta Brillante (Cojín)",
    color: "Azul Real Intenso",
    treatment: "Sin tratamiento térmico (No Heat)",
    certificate: "GIA Report #GIA-549102844",
    description: "Excepcional corindón azul zafiro con denominación Royal Blue. Completamente natural, sin tratamiento térmico comprobado por laboratorio.",
    image: "assets/images/sapphire-gem.jpg",
    status: "Disponible",
    featured: true
  },
  {
    name: "Rubí Birmano 2.10 ct",
    category: "Rubíes",
    price: 16800000,
    weight_ct: "2.10 ct",
    dimensions_mm: "7.80 x 6.95 x 4.80 mm",
    origin: "Mogok, Birmania",
    cut: "Cojín Brillante",
    color: "Rojo Sangre de Pichón",
    treatment: "Térmico tradicional estándar",
    certificate: "GRS Swisslab #GRS-2026-04912",
    description: "Rubí de colección con la tonalidad Rojo Sangre de Pichón. Posee fluorescencia roja intensa bajo luz natural y saturación cromática pura.",
    image: "assets/images/ruby-gem.jpg",
    status: "Disponible",
    featured: true
  },
  {
    name: "Lote Gemas Finas 12 ct",
    category: "Colección Exclusiva",
    price: 22000000,
    weight_ct: "12.00 ct",
    dimensions_mm: "6 a 10 mm",
    origin: "Brasil, Tanzania, Colombia",
    cut: "Facetado de Precisión",
    color: "Multicolor Exótico",
    treatment: "100% Gemas Naturales",
    certificate: "Flor De Gema Certified #FDG-CERT-2026",
    description: "Colección curada para maestros joyeros o coleccionistas. Incluye ejemplares de turmalina verde cromo, tanzanita, morganita y espinela.",
    image: "assets/images/gem-collection.jpg",
    status: "Disponible",
    featured: true
  },
  {
    name: "Esmeralda Chivor 1.95 ct",
    category: "Esmeraldas",
    price: 9800000,
    weight_ct: "1.95 ct",
    dimensions_mm: "8.90 x 6.20 x 4.30 mm",
    origin: "Chivor, Boyacá, Colombia",
    cut: "Pera Brillante",
    color: "Verde Azulado Chivor",
    treatment: "Aceitado leve tradicional",
    certificate: "CDTEC Colombia #CDTEC-2026-90112",
    description: "El inconfundible tono verde con matiz azulado característico de las minas de Chivor. Brillo cristalino insuperable, ideal para dije o anillo.",
    image: "assets/images/emerald-gem.jpg",
    status: "Disponible",
    featured: false
  },
  {
    name: "Quinteto Imperial 15.5 ct",
    category: "Colección Exclusiva",
    price: 31000000,
    weight_ct: "15.50 ct",
    dimensions_mm: "Serie alineada de museo",
    origin: "Selección Global de Mina",
    cut: "Alta Joyería (Octagonal y Oval)",
    color: "Espectro Completo",
    treatment: "Gemas Naturales Garantizadas",
    certificate: "Flor De Gema Certified #FDG-GLOBAL-2026",
    description: "Cinco gemas de altísima graduación cromática. El pináculo de nuestra selección 'Invierte en belleza eterna'.",
    image: "assets/images/hero-gemstones.jpg",
    status: "Disponible",
    featured: true
  },
  {
    name: "Esmeralda Coscuez 2.40 ct",
    category: "Esmeraldas",
    price: 12500000,
    weight_ct: "2.40 ct",
    dimensions_mm: "8.50 x 7.10 x 4.90 mm",
    origin: "Coscuez, Boyacá, Colombia",
    cut: "Talla Esmeralda",
    color: "Verde Vivo Brillante",
    treatment: "Aceite vegetal menor",
    certificate: "CDTEC Colombia #CDTEC-2026-91400",
    description: "Extraída de las legendarias minas de Coscuez. Tonalidad radiante y cristalino fuego interno con excelente corte simétrico.",
    image: "assets/images/emerald-gem.jpg",
    status: "Disponible",
    featured: true
  },
  {
    name: "Zafiro Padparadscha 1.85 ct",
    category: "Zafiros",
    price: 15900000,
    weight_ct: "1.85 ct",
    dimensions_mm: "7.90 x 6.40 x 4.20 mm",
    origin: "Sri Lanka",
    cut: "Oval Mixto",
    color: "Rosa-Salmón Padparadscha",
    treatment: "Sin tratamiento térmico (No Heat)",
    certificate: "GRS Swisslab #GRS-2026-11892",
    description: "Una de las variedades más escasas del mundo: tono color flor de loto rosa-anaranjado sin calor artificial. Rareza de colección.",
    image: "assets/images/sapphire-gem.jpg",
    status: "Disponible",
    featured: true
  },
  {
    name: "Rubí Estrella Natural 3.10 ct",
    category: "Rubíes",
    price: 11400000,
    weight_ct: "3.10 ct",
    dimensions_mm: "8.20 x 7.50 x 5.10 mm",
    origin: "Madagascar",
    cut: "Cabujón Oval Pulido",
    color: "Rojo Púrpura Asterismo",
    treatment: "100% Natural sin tratamiento",
    certificate: "GIA Report #GIA-22904811",
    description: "Fenómeno óptico de asterismo natural: despliega una estrella de seis rayos perfectamente centrada bajo luz puntual directa.",
    image: "assets/images/ruby-gem.jpg",
    status: "Disponible",
    featured: false
  },
  {
    name: "Turmalina Verde Cromo 2.70 ct",
    category: "Turmalinas & Paraíba",
    price: 8600000,
    weight_ct: "2.70 ct",
    dimensions_mm: "9.10 x 6.80 x 4.60 mm",
    origin: "Tanzania",
    cut: "Step Cut (Octagonal)",
    color: "Verde Esmeralda Profundo",
    treatment: "Sin tratamiento conocido",
    certificate: "Flor De Gema Certified #FDG-TUR-2026",
    description: "Turmalina coloreada naturalmente por cromo y vanadio, con un tono verde bosque intenso semejante al de las esmeraldas más finas.",
    image: "assets/images/gem-collection.jpg",
    status: "Disponible",
    featured: false
  }
];

async function seed() {
  const sql = neon(DATABASE_URL);
  
  const existing = await sql.query('SELECT COUNT(*) as count FROM flordegema_gemstones;');
  if (parseInt(existing[0].count, 10) > 0) {
    console.log(`Table already has ${existing[0].count} gemstones. Skipping duplicate seed.`);
    return;
  }

  for (const g of INITIAL_GEMS) {
    await sql.query(`
      INSERT INTO flordegema_gemstones 
      (name, category, price, weight_ct, dimensions_mm, origin, cut, color, treatment, certificate, description, image, status, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
    `, [
      g.name, g.category, g.price, g.weight_ct, g.dimensions_mm, g.origin,
      g.cut, g.color, g.treatment, g.certificate, g.description, g.image,
      g.status, g.featured
    ]);
  }

  console.log('Seeded 10 gemstones into Neon PostgreSQL successfully!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
