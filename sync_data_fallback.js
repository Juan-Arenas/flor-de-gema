const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://authenticator:npg_l1dPIAZeQ6rb@ep-holy-rice-ayq7meg3.c-5.us-east-2.aws.neon.tech/valen?sslmode=require');

async function run() {
  const rows = await sql.query('SELECT * FROM flordegema_gemstones ORDER BY id;');
  console.log('Fetched ' + rows.length + ' rows from Neon');
  const serverGems = rows.map(r => {
    let images = Array.isArray(r.images) && r.images.length > 0 ? r.images : (r.image ? [r.image] : ['assets/images/emerald-gem.jpg']);
    let videos = Array.isArray(r.videos) ? r.videos : [];
    return {
      id: r.id ? ('FDG-' + r.id) : (r.code || 'FDG-001'),
      rawId: r.id,
      name: r.name,
      category: r.category || 'esmeraldas',
      displayCategory: r.category ? (r.category.charAt(0).toUpperCase() + r.category.slice(1)) : 'Esmeraldas',
      priceCOP: Number(r.price) || 0,
      priceUSD: Math.round((Number(r.price) || 0) / 4000),
      carats: r.weight_ct || '2.0',
      dimensions: r.dimensions_mm || 'Consultar',
      shape: r.shape || r.cut || 'Facetado',
      cut: r.cut || 'Facetado',
      color: r.color || 'Color Natural',
      treatment: r.treatment || 'Natural',
      clarity: r.clarity || 'Seleccionada',
      origin: r.origin || 'Colombia',
      reportNumber: r.certificate || 'Reporte Gemológico Oficial',
      lab: r.lab || r.certificate || 'Laboratorio Acreditado',
      image: r.image || images[0] || 'assets/images/emerald-gem.jpg',
      images,
      videos,
      featured: Boolean(r.featured),
      status: r.status || 'Disponible',
      active: r.status !== 'Oculto',
      badge: (r.origin || 'Colombia').split(',')[0].trim(),
      description: r.description || 'Piedra preciosa natural seleccionada con la máxima exigencia gemológica. "Flor De Gema, Invierte en belleza eterna".'
    };
  });
  
  const dataPath = path.join(__dirname, 'js', 'data.js');
  let dataContent = fs.readFileSync(dataPath, 'utf8');
  const gemArrayStr = 'const GEMSTONES = ' + JSON.stringify(serverGems, null, 2) + ';';
  dataContent = dataContent.replace(/const GEMSTONES = \[[\s\S]*?\];/, gemArrayStr);
  fs.writeFileSync(dataPath, dataContent, 'utf8');
  console.log('Successfully updated js/data.js with ' + serverGems.length + ' gemstones from Neon DB!');
}

run().catch(console.error);
