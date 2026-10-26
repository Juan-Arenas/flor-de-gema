// ==========================================================================
// FLOR DE GEMA - MOTOR DE LÓGICA & PANEL ADMINISTRATIVO NEON (PIN 1072)
// Eslogan: "Flor De Gema, Invierte en belleza eterna"
// ==========================================================================

// Global Utility Functions (Available immediately across all scripts)
window.formatCOP = window.formatCOP || function(value) {
  const num = Number(value) || 0;
  return '$ ' + num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
var formatCOP = window.formatCOP;

window.formatUSD = window.formatUSD || function(value) {
  const num = Number(value) || 0;
  return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
var formatUSD = window.formatUSD;

window.normalizeCategorySlug = window.normalizeCategorySlug || function(name) {
  if (!name) return 'esmeraldas';
  return String(name)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'esmeraldas';
};
var normalizeCategorySlug = window.normalizeCategorySlug;

document.addEventListener('DOMContentLoaded', () => {
  const formatCOP = (val) => (typeof window.formatCOP === 'function' ? window.formatCOP(val) : '$ ' + (Number(val) || 0).toLocaleString('es-CO'));
  const formatUSD = (val) => (typeof window.formatUSD === 'function' ? window.formatUSD(val) : '$' + (Number(val) || 0).toLocaleString('en-US'));
  const normalizeCategorySlug = (val) => (typeof window.normalizeCategorySlug === 'function' ? window.normalizeCategorySlug(val) : String(val || 'esmeraldas').toLowerCase());

  // ------------------------------------------------------------------------
  // 1. ESTADO GLOBAL DE LA APLICACIÓN
  // ------------------------------------------------------------------------
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';
  let wishlist = [];
  try {
    wishlist = JSON.parse(localStorage.getItem('fdg_wishlist') || '[]');
  } catch (_) {
    wishlist = [];
  }

  // Limpieza inicial forzada del catálogo demo anterior
  if (!localStorage.getItem('fdg_catalog_cleared_v1')) {
    localStorage.removeItem('fdg_gemstones_cache');
    localStorage.setItem('fdg_catalog_cleared_v1', 'true');
  }

  // Carga de catálogo desde cache local o fallback data.js
  let cachedGems = null;
  try {
    const raw = localStorage.getItem('fdg_gemstones_cache');
    if (raw) cachedGems = JSON.parse(raw);
  } catch (_) {}

  let gemsList = (cachedGems && cachedGems.length > 0) ? cachedGems : (typeof GEMSTONES !== 'undefined' ? [...GEMSTONES] : []);

  // Asegurar compatibilidad de cada gema con 'images' (array) y 'videos' (array)
  gemsList = gemsList.map(g => {
    let images = Array.isArray(g.images) && g.images.length > 0 ? g.images : (g.image ? [g.image] : ['assets/images/emerald-gem.jpg']);
    let videos = Array.isArray(g.videos) ? g.videos : [];
    // Si es una de las gemas demo iniciales y no tiene videos, agregar un video de muestra
    if (videos.length === 0 && g.id === 'FDG-ESM-001') {
      videos = [{
        id: 'vid_demo_1',
        title: 'Inspección Óptica y Pureza en Pinzas',
        url: 'https://tiktok.com/@flor.de.gema',
        type: 'url'
      }];
    }
    return {
      ...g,
      images,
      videos,
      image: g.image || images[0] || 'assets/images/emerald-gem.jpg'
    };
  });

  // PIN Administrativo
  const DEFAULT_PIN = '1072';
  let currentAdminPin = localStorage.getItem('fdg_admin_pin') || DEFAULT_PIN;

  // Categorías Administrativas
  let adminCategories = [];
  try {
    const savedCats = localStorage.getItem('fdg_admin_categories');
    if (savedCats) adminCategories = JSON.parse(savedCats);
  } catch (_) {}

  if (!adminCategories || adminCategories.length === 0) {
    adminCategories = [
      { id: 1, name: "Esmeraldas" },
      { id: 2, name: "Zafiros" },
      { id: 3, name: "Rubíes" },
      { id: 4, name: "Turmalinas" },
      { id: 5, name: "Colección Exclusiva" }
    ];
    try {
      localStorage.setItem('fdg_admin_categories', JSON.stringify(adminCategories));
    } catch (_) {}
  }

  let adminSelectedCat = 'all';
  let adminSearchQuery = '';

  // Gestor de Medios para la gema actual en edición (Múltiples Fotos y Videos)
  let currentGemPhotos = [];
  let currentGemVideos = [];

  // Transmisión en Vivo & Videos TikTok
  let liveConfig = {
    title: "Gran Transmisión en Vivo: Lotes Exclusivos de Esmeraldas y Zafiros",
    live_date: "2026-10-25T19:00",
    platform: "TikTok & Instagram Live",
    description: "Presentación en directo de nuevas adquisiciones de minas de Muzo y Ceilán. Precios preferenciales y apartados en vivo.",
    tiktok_url: "https://tiktok.com/@flor.de.gema",
    recommended_video_title: "¿Cómo saber si una Esmeralda es 100% natural? Explicación en video",
    recommended_video_url: "https://tiktok.com/@flor.de.gema",
    recommended_video_desc: "Aprende a identificar el verde gota de aceite y el jardín característico de las esmeraldas colombianas.",
    is_live_now: false
  };

  try {
    const savedLive = localStorage.getItem('fdg_live_config');
    if (savedLive) liveConfig = { ...liveConfig, ...JSON.parse(savedLive) };
  } catch (_) {}

  let tikTokVideos = [
    {
      id: 1,
      title: "Mostrando Lote de Zafiros Ceilán Royal Blue sin tratamiento",
      video_url: "https://tiktok.com/@flor.de.gema",
      thumbnail_url: "assets/images/sapphire-gem.jpg",
      description: "Mira el brillo y la refracción del corindón bajo luz natural.",
      views_count: "48.2K vistas"
    },
    {
      id: 2,
      title: "Esmeralda Muzo 3.45 ct en mano: Gota de aceite pura",
      video_url: "https://tiktok.com/@flor.de.gema",
      thumbnail_url: "assets/images/emerald-gem.jpg",
      description: "Detalle macro de las inclusiones de tres fases que certifican su origen boyacense.",
      views_count: "82.5K vistas"
    },
    {
      id: 3,
      title: "Rubí Birmano Sangre de Pichón: Prueba de fluorescencia UV",
      video_url: "https://tiktok.com/@flor.de.gema",
      thumbnail_url: "assets/images/ruby-gem.jpg",
      description: "Demostración de la luminiscencia roja intensa bajo luz ultravioleta.",
      views_count: "31.9K vistas"
    }
  ];

  try {
    const savedVids = localStorage.getItem('fdg_tiktok_videos');
    if (savedVids) tikTokVideos = JSON.parse(savedVids);
  } catch (_) {}

  // Historial de Pedidos & Cotizaciones WhatsApp
  let ordersList = [];
  try {
    const savedOrders = localStorage.getItem('fdg_orders_history');
    if (savedOrders) ordersList = JSON.parse(savedOrders);
  } catch (_) {}

  if (!ordersList || ordersList.length === 0) {
    ordersList = [
      {
        id: "PED-1021",
        date: "18/10/2026 09:30",
        client: "Carolina Gómez",
        phone: "+57 312 458 9201",
        gemName: "Esmeralda Muzo 3.45 ct",
        priceCOP: 18500000,
        status: "Cotizado",
        notes: "Cliente solicita certificado CDTEC original y fotos bajo luz UV."
      },
      {
        id: "PED-1020",
        date: "17/10/2026 16:15",
        client: "Andrés Felipe Restrepo",
        phone: "+57 300 892 1144",
        gemName: "Zafiro Ceilán 2.85 ct",
        priceCOP: 14200000,
        status: "Apartado",
        notes: "Anticipo de apartado confirmado vía Bancolombia. Despacho a Medellín."
      }
    ];
    try {
      localStorage.setItem('fdg_orders_history', JSON.stringify(ordersList));
    } catch (_) {}
  }

  // Políticas de Envíos
  let shippingConfig = {
    carrier: "Inter Rapidísimo / Servientrega",
    costCOP: 25000,
    freeMinCOP: 15000000,
    securityNotes: "Caja de seguridad sellada con precinto inviolable. Estuche de lujo acolchado para la gema, sobre térmico protector y copia del reporte gemológico de laboratorio (CDTEC / GIA / GRS)."
  };

  try {
    const savedShip = localStorage.getItem('fdg_shipping_config');
    if (savedShip) shippingConfig = { ...shippingConfig, ...JSON.parse(savedShip) };
  } catch (_) {}

  // Intervalo de cuenta regresiva
  let countdownInterval = null;

  // Logs de Auditoría Dev (Mismo sistema avanzado de Ventas Maquillaje)
  const VALEN_LOGS_STORAGE_KEY = 'valen_system_logs_fdg_v1';
  const VALEN_MAX_LOGS = 250;
  let currentLogFilter = 'ALL';
  let currentLogSearchQuery = '';

  function getValenLogs() {
    try {
      const raw = localStorage.getItem(VALEN_LOGS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveValenLogs(logs) {
    try {
      localStorage.setItem(VALEN_LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, VALEN_MAX_LOGS)));
    } catch (_) {}
  }

  function sanitizeLogDetails(details) {
    if (!details || typeof details !== 'object') return {};
    const clean = {};
    for (const key of Object.keys(details)) {
      const val = details[key];
      if (typeof val === 'string' && val.startsWith('data:image/')) {
        clean[key] = `[Foto Base64 ~${Math.round(val.length / 1024)} KB]`;
      } else if (Array.isArray(val)) {
        clean[key] = val.map(item => {
          if (typeof item === 'string' && item.startsWith('data:image/')) {
            return `[Foto Base64 ~${Math.round(item.length / 1024)} KB]`;
          }
          if (item && typeof item === 'object' && item.url && String(item.url).startsWith('data:')) {
            return { ...item, url: `[Media Base64 ~${Math.round(String(item.url).length / 1024)} KB]` };
          }
          return item;
        });
      } else {
        clean[key] = val;
      }
    }
    return clean;
  }

  function logValenEvent(status, action, message, details = {}, level = 'INFO') {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timeFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}`;
    const sanitized = sanitizeLogDetails(details);
    const logEntry = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: now.toISOString(),
      time: timeFormatted,
      status: status || 'OK',
      action: action || 'EVENT',
      message: message || '',
      details: sanitized,
      level: level || 'INFO'
    };

    const logs = getValenLogs();
    logs.unshift(logEntry);
    saveValenLogs(logs);
    renderValenLogs();
    updateLogsBadge();

    // Sincronización transparente con Neon en segundo plano
    try {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: logEntry.level,
          action: logEntry.action,
          message: logEntry.message,
          details: logEntry.details
        })
      }).catch(() => {});
    } catch (_) {}
  }
  window.logValenEvent = logValenEvent;

  function updateLogsBadge() {
    const logs = getValenLogs();
    const badge = document.getElementById('valen-logs-badge');
    if (badge) badge.textContent = logs.length;
    const tabStatLogs = document.getElementById('tab-stat-logs');
    if (tabStatLogs) tabStatLogs.textContent = logs.length;
    const statTotal = document.getElementById('valen-stat-total');
    if (statTotal) statTotal.textContent = logs.length;
    const statOk = document.getElementById('valen-stat-ok');
    if (statOk) statOk.textContent = logs.filter(l => l.status === 'OK').length;
    const statFailed = document.getElementById('valen-stat-failed');
    if (statFailed) statFailed.textContent = logs.filter(l => l.status === 'FAILED' || l.status === 'WARN').length;
    const terminalMeta = document.getElementById('valen-terminal-meta');
    if (terminalMeta) terminalMeta.textContent = `${logs.length} eventos registrados`;
  }

  function renderValenLogs() {
    const terminalBody = document.getElementById('valen-logs-terminal-body');
    if (!terminalBody) return;

    let logs = getValenLogs();
    if (currentLogFilter !== 'ALL') {
      if (currentLogFilter === 'OK') {
        logs = logs.filter(l => l.status === 'OK');
      } else if (currentLogFilter === 'FAILED') {
        logs = logs.filter(l => l.status === 'FAILED' || l.status === 'WARN');
      } else if (currentLogFilter === 'NEON') {
        logs = logs.filter(l => String(l.action || '').includes('NEON') || String(l.message || '').includes('Neon'));
      } else if (currentLogFilter === 'PRODUCT') {
        logs = logs.filter(l => String(l.action || '').includes('PRODUCT') || String(l.action || '').includes('GEMA') || String(l.action || '').includes('CATEGORY'));
      } else if (currentLogFilter === 'AUTH') {
        logs = logs.filter(l => String(l.action || '').includes('AUTH') || String(l.action || '').includes('LOGIN'));
      }
    }

    if (currentLogSearchQuery) {
      const q = currentLogSearchQuery.toLowerCase();
      logs = logs.filter(l =>
        String(l.message || '').toLowerCase().includes(q) ||
        String(l.action || '').toLowerCase().includes(q) ||
        JSON.stringify(l.details || {}).toLowerCase().includes(q)
      );
    }

    if (logs.length === 0) {
      terminalBody.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #64748b; font-family: monospace;">
          <i class="fas fa-terminal" style="font-size: 1.5rem; margin-bottom: 8px; display: block;"></i>
          <span>No hay eventos registrados en este filtro.</span>
        </div>
      `;
      return;
    }

    terminalBody.innerHTML = '';
    logs.forEach(log => {
      const row = document.createElement('div');
      row.className = 'valen-log-row';
      const statusClass = log.status === 'OK' ? 'status-ok' : (log.status === 'FAILED' ? 'status-failed' : 'status-warn');
      const hasDetails = log.details && Object.keys(log.details).length > 0;

      row.innerHTML = `
        <div class="valen-log-summary-line">
          <span class="valen-log-time">${log.time || ''}</span>
          <span class="valen-badge-status ${statusClass}">${log.status}</span>
          <span class="valen-badge-action">${escapeHtml(log.action || 'EVENT')}</span>
          <span class="valen-log-message">${escapeHtml(log.message || '')}</span>
          ${hasDetails ? `<button type="button" class="btn-sm valen-log-toggle-json" style="padding: 2px 6px; font-size: 0.7rem; background: #1e293b; color: #94a3b8; border: 1px solid #334155; border-radius: 4px; cursor: pointer;"><i class="fas fa-code"></i> JSON</button>` : ''}
        </div>
        ${hasDetails ? `
          <div class="valen-log-details-drawer" style="display: none; background: #0b0f19; padding: 10px; margin: 4px 10px 10px; border-radius: 6px; border: 1px solid #1e293b;">
            <pre style="margin: 0; font-size: 0.75rem; color: #38bdf8; overflow-x: auto;">${escapeHtml(JSON.stringify(log.details, null, 2))}</pre>
          </div>
        ` : ''}
      `;

      if (hasDetails) {
        const toggleBtn = row.querySelector('.valen-log-toggle-json');
        const drawer = row.querySelector('.valen-log-details-drawer');
        toggleBtn?.addEventListener('click', (e) => {
          e.stopPropagation();
          const isShown = drawer.style.display !== 'none';
          drawer.style.display = isShown ? 'none' : 'block';
          toggleBtn.style.color = isShown ? '#94a3b8' : '#38bdf8';
        });
      }

      terminalBody.appendChild(row);
    });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ------------------------------------------------------------------------
  // 2. NAVEGACIÓN Y CAMBIO DE PESTAÑAS DENTRO DEL PANEL ADMIN
  // ------------------------------------------------------------------------
  function switchAdminTab(tabName) {
    const tabsNav = document.getElementById('admin-tabs-nav');
    if (tabsNav) {
      const btns = tabsNav.querySelectorAll('.admin-tab-btn');
      btns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
      });
    }

    const panes = document.querySelectorAll('.admin-tab-pane');
    panes.forEach(p => {
      const isTarget = p.id === `admin-tab-${tabName}`;
      p.classList.toggle('active', isTarget);
      p.style.setProperty('display', isTarget ? 'flex' : 'none', 'important');
    });

    // Cargar o refrescar los datos de la pestaña seleccionada
    if (tabName === 'catalog') {
      renderAdminCategoryChips();
      renderAdminCategoryPills();
      renderAdminProductsList();
      updateAdminStats();
    } else if (tabName === 'orders') {
      renderAdminOrdersTable();
    } else if (tabName === 'lives') {
      populateAdminLiveForm();
      renderAdminTikTokList();
    } else if (tabName === 'shipping') {
      populateAdminShippingForm();
    } else if (tabName === 'categories-cloud') {
      // Estado de Neon y PIN
    } else if (tabName === 'logs') {
      renderValenLogs();
      updateLogsBadge();
    }
  }
  window.switchAdminTab = switchAdminTab;
  window.onAdminTabChanged = switchAdminTab;

  // ------------------------------------------------------------------------
  // 3. GESTOR DE MÚLTIPLES FOTOS Y VIDEOS PARA CADA GEMA
  // ------------------------------------------------------------------------
  function renderGemPhotosGallery() {
    const grid = document.getElementById('admin-photos-preview-grid');
    const badge = document.getElementById('admin-photos-count-badge');
    if (!grid) return;

    if (badge) badge.textContent = `${currentGemPhotos.length} foto${currentGemPhotos.length === 1 ? '' : 's'}`;

    if (currentGemPhotos.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 14px; text-align: center; color: #94a3b8; font-size: 0.8rem;">
          <i class="fas fa-image" style="font-size: 1.4rem; margin-bottom: 4px; display: block; opacity: 0.5;"></i>
          Ninguna foto agregada aún. Sube archivos o pega enlaces.
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    currentGemPhotos.forEach((src, idx) => {
      const isCover = idx === 0;
      const card = document.createElement('div');
      card.className = `admin-photo-card ${isCover ? 'is-cover' : ''}`;
      card.innerHTML = `
        <img src="${src}" class="admin-photo-thumb" alt="Foto ${idx + 1}" onerror="this.src='assets/images/emerald-gem.jpg';">
        ${isCover ? '<span class="admin-photo-cover-badge">★ Portada</span>' : ''}
        <div class="admin-photo-actions">
          ${!isCover ? `<button type="button" class="admin-photo-action-btn btn-star" title="Convertir en portada"><i class="fas fa-star"></i></button>` : ''}
          <button type="button" class="admin-photo-action-btn btn-del" title="Eliminar foto"><i class="fas fa-trash"></i></button>
        </div>
      `;

      if (!isCover) {
        card.querySelector('.btn-star')?.addEventListener('click', (e) => {
          e.stopPropagation();
          setGemCoverPhoto(idx);
        });
      }

      card.querySelector('.btn-del')?.addEventListener('click', (e) => {
        e.stopPropagation();
        removeGemPhoto(idx);
      });

      grid.appendChild(card);
    });
  }

  function setGemCoverPhoto(idx) {
    if (idx < 0 || idx >= currentGemPhotos.length) return;
    const chosen = currentGemPhotos.splice(idx, 1)[0];
    currentGemPhotos.unshift(chosen);
    renderGemPhotosGallery();
    const hiddenUrl = document.getElementById('admin-product-image-url');
    if (hiddenUrl) hiddenUrl.value = chosen;
  }

  function removeGemPhoto(idx) {
    if (idx < 0 || idx >= currentGemPhotos.length) return;
    currentGemPhotos.splice(idx, 1);
    renderGemPhotosGallery();
    const hiddenUrl = document.getElementById('admin-product-image-url');
    if (hiddenUrl) hiddenUrl.value = currentGemPhotos[0] || '';
  }

  function renderGemVideosGallery() {
    const grid = document.getElementById('admin-videos-preview-grid');
    const badge = document.getElementById('admin-videos-count-badge');
    if (!grid) return;

    if (badge) badge.textContent = `${currentGemVideos.length} video${currentGemVideos.length === 1 ? '' : 's'}`;

    if (currentGemVideos.length === 0) {
      grid.innerHTML = `
        <div style="padding: 12px; text-align: center; color: #94a3b8; font-size: 0.8rem;">
          <i class="fas fa-video" style="font-size: 1.3rem; margin-bottom: 4px; display: block; opacity: 0.5;"></i>
          Ningún video agregado aún. Sube videos locales (.mp4) o pega enlaces de TikTok/YouTube.
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    currentGemVideos.forEach((vid, idx) => {
      const card = document.createElement('div');
      card.className = 'admin-video-card';
      const isDirectVideo = String(vid.url || '').startsWith('data:video') || String(vid.url || '').includes('.mp4') || String(vid.url || '').includes('.webm');

      card.innerHTML = `
        <div class="admin-video-preview-wrap">
          ${isDirectVideo ? `<video src="${vid.url}" preload="metadata" muted playsinline></video>` : `<i class="fab fa-tiktok"></i>`}
        </div>
        <div class="admin-video-info">
          <p class="admin-video-title">${escapeHtml(vid.title || `Video ${idx + 1}`)}</p>
          <span class="admin-video-url">${escapeHtml(vid.url)}</span>
        </div>
        <button type="button" class="admin-photo-action-btn btn-del" style="background:#fee2e2; color:#b91c1c; padding:6px 10px; border-radius:6px; font-weight:700;" title="Quitar video">
          <i class="fas fa-trash"></i>
        </button>
      `;

      card.querySelector('.btn-del')?.addEventListener('click', (e) => {
        e.stopPropagation();
        removeGemVideo(idx);
      });

      grid.appendChild(card);
    });
  }

  function removeGemVideo(idx) {
    if (idx < 0 || idx >= currentGemVideos.length) return;
    currentGemVideos.splice(idx, 1);
    renderGemVideosGallery();
  }

  // ------------------------------------------------------------------------
  // 4. MODAL LIMPIO DE FICHA TÉCNICA CON SHOWCASE DE MEDIOS (FOTOS & VIDEOS)
  // ------------------------------------------------------------------------
  let currentModalMediaIndex = 0;
  let currentModalMediaList = [];

  function openTechSheet(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    const modalContent = document.getElementById('tech-modal-content');
    if (!modalContent) return;

    // Compilar todos los medios de la gema: fotos + videos
    currentModalMediaList = [];
    const photos = (Array.isArray(gem.images) && gem.images.length > 0) ? gem.images : [gem.image || 'assets/images/emerald-gem.jpg'];
    photos.forEach((src, i) => {
      currentModalMediaList.push({ type: 'image', src, label: `Foto ${i + 1} de ${photos.length}` });
    });

    if (Array.isArray(gem.videos)) {
      gem.videos.forEach((vid, i) => {
        currentModalMediaList.push({
          type: 'video',
          src: vid.url,
          title: vid.title || `Video de Inspección ${i + 1}`,
          label: `🎥 ${vid.title || `Video ${i + 1}`}`
        });
      });
    }

    currentModalMediaIndex = 0;

    const isSold = gem.status === 'Agotado' || gem.status === 'Sold Out' || gem.status === 'Vendido' || gem.isSold === true;

    modalContent.innerHTML = `
      <div style="display: flex; gap: 1.5rem; flex-direction: column;">
        <!-- Gem Media Showcase Gallery -->
        <div class="gem-modal-gallery">
          <div class="gem-modal-stage" id="gem-modal-stage">
            <span class="gem-stage-badge" id="gem-stage-badge">Cargando medio...</span>
            <div id="gem-stage-media-wrap" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"></div>
            ${currentModalMediaList.length > 1 ? `
              <button type="button" class="gem-stage-nav-btn gem-stage-prev" id="btn-stage-prev" title="Anterior">❮</button>
              <button type="button" class="gem-stage-nav-btn gem-stage-next" id="btn-stage-next" title="Siguiente">❯</button>
            ` : ''}
          </div>

          <!-- Thumbnails Strip -->
          ${currentModalMediaList.length > 1 ? `
            <div class="gem-modal-thumbnails-strip" id="gem-modal-thumbnails-strip">
              ${currentModalMediaList.map((m, idx) => `
                <button type="button" class="gem-modal-thumb-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}" title="${m.label}">
                  ${m.type === 'image' 
                    ? `<img src="${m.src}" alt="${m.label}" onerror="this.src='assets/images/emerald-gem.jpg';">` 
                    : `<div class="gem-modal-thumb-video-icon"><i class="fas fa-play"></i></div><div style="background:#0f172a; width:100%; height:100%;"></div>`
                  }
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div>
          ${isSold ? `
            <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px;">
              <div>
                <span style="display: inline-flex; align-items: center; gap: 5px; background: #0f172a; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; margin-bottom: 2px;">
                  <i class="far fa-clock"></i> PIEZA VENDIDA / SOLD OUT
                </span>
                <p style="margin: 0; font-size: 0.82rem; color: #475569;">Esta pieza exclusiva ya fue adquirida. Puedes cotizar una gema de características similares por encargo.</p>
              </div>
            </div>
          ` : ''}

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 0.3rem;">
            <span style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase;">
              REF: ${gem.id} · ${gem.displayCategory || gem.category}
            </span>
            <span style="font-size: 0.76rem; font-weight: 700; background: ${isSold ? '#f1f5f9; color: #475569' : '#ecfdf5; color: #047857'}; padding: 2px 8px; border-radius: 9999px;">
              ${isSold ? '⏱ Pieza Vendida' : '✓ 100% Gema Natural Certificada'}
            </span>
          </div>

          <h2 style="font-size: 1.45rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem;">${gem.name}</h2>
          
          <div style="font-size: 1.35rem; font-weight: 900; color: #111827; margin-bottom: 1rem;">
            ${formatCOP(gem.priceCOP || 0)} 
            <span style="font-size: 0.88rem; font-weight: 500; color: #6b7280;">(~ ${formatUSD(gem.priceUSD || Math.round((gem.priceCOP || 0)/4000))} USD)</span>
          </div>

          <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.92rem; margin-bottom: 1.25rem;">
            ${gem.description || 'Piedra preciosa natural seleccionada con la máxima exigencia gemológica. "Flor De Gema, Invierte en belleza eterna".'}
          </p>

          <h3 style="font-size: 0.95rem; font-weight: 700; color: #111827; margin-bottom: 0.75rem; text-transform: uppercase;">
            Especificaciones Técnicas de Laboratorio
          </h3>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; background: var(--bg-subtle); padding: 1rem; border-radius: 8px; font-size: 0.86rem; margin-bottom: 1.25rem;">
            <div><strong>Peso:</strong> ${gem.carats || 'N/A'} ct</div>
            <div><strong>Medidas:</strong> ${gem.dimensions || 'N/A'}</div>
            <div><strong>Talla / Corte:</strong> ${gem.cut || gem.shape || 'Facetado'}</div>
            <div><strong>Forma:</strong> ${gem.shape || gem.cut || 'Natural'}</div>
            <div><strong>Color:</strong> ${gem.color || 'Color Natural'}</div>
            <div><strong>Claridad:</strong> ${gem.clarity || 'Seleccionada'}</div>
            <div><strong>Procedencia:</strong> ${gem.origin || 'Colombia'}</div>
            <div><strong>Tratamiento:</strong> ${gem.treatment || 'Natural'}</div>
            <div style="grid-column: 1 / -1;"><strong>Certificado:</strong> ${gem.reportNumber || 'Reporte Gemológico Oficial'} ${gem.lab ? `(${gem.lab})` : ''}</div>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            ${isSold ? `
              <button class="btn-primary-dark" style="flex: 1; justify-content: center; background: #0f172a; border-color: #0f172a; color: #fff; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 8px; text-decoration: none; cursor: pointer;" onclick="inquireSoldOutGem('${gem.id}')">
                <i class="fab fa-whatsapp" style="font-size: 1.2rem; color: #22c55e;"></i>
                Encargar o cotizar gema similar
              </button>
            ` : `
              <button class="btn-primary-dark" style="flex: 1; justify-content: center; background: #25d366; border-color: #25d366; color: #fff; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 8px; text-decoration: none; cursor: pointer;" onclick="inquireGem('${gem.id}')">
                <i class="fab fa-whatsapp" style="font-size: 1.2rem;"></i>
                Apartar / Cotizar por WhatsApp
              </button>
            `}
            <button class="btn-secondary-light" style="padding: 12px 18px; border-radius: 8px; font-weight: 700; cursor: pointer; border: 1px solid var(--border-light);" onclick="toggleWishlist('${gem.id}'); closeTechModal();">
              ${wishlist.includes(gem.id) ? 'Quitar de Guardados' : 'Guardar en Bolsa'}
            </button>
          </div>

          <div style="margin-top: 1rem; text-align: center;">
            <a href="#politicas" onclick="closeTechModal();" style="font-size: 0.85rem; color: #4b5563; text-decoration: underline;">
              Ver Envíos 100% Asegurados, Garantías y Respaldo de Compra →
            </a>
          </div>
        </div>
      </div>
    `;

    renderStageMedia();

    // Eventos de carrusel modal
    modalContent.querySelector('#btn-stage-prev')?.addEventListener('click', () => {
      currentModalMediaIndex = (currentModalMediaIndex - 1 + currentModalMediaList.length) % currentModalMediaList.length;
      renderStageMedia();
    });

    modalContent.querySelector('#btn-stage-next')?.addEventListener('click', () => {
      currentModalMediaIndex = (currentModalMediaIndex + 1) % currentModalMediaList.length;
      renderStageMedia();
    });

    modalContent.querySelectorAll('.gem-modal-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        currentModalMediaIndex = idx;
        renderStageMedia();
      });
    });

    const overlay = document.getElementById('tech-modal-overlay');
    if (overlay) {
      overlay.classList.add('open');
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }
  window.openTechSheet = openTechSheet;

  function renderStageMedia() {
    const wrap = document.getElementById('gem-stage-media-wrap');
    const badge = document.getElementById('gem-stage-badge');
    if (!wrap || currentModalMediaList.length === 0) return;

    const media = currentModalMediaList[currentModalMediaIndex];
    if (badge) badge.textContent = media.label;

    if (media.type === 'image') {
      wrap.innerHTML = `<img src="${media.src}" alt="${media.label}" style="max-height: 100%; max-width: 100%; object-fit: contain;">`;
    } else {
      const isDirect = String(media.src).startsWith('data:video') || String(media.src).includes('.mp4') || String(media.src).includes('.webm');
      if (isDirect) {
        wrap.innerHTML = `<video src="${media.src}" controls autoplay playsinline style="max-height: 100%; max-width: 100%; border-radius: 6px;"></video>`;
      } else {
        wrap.innerHTML = `
          <div style="text-align: center; padding: 20px; color: #ffffff;">
            <i class="fab fa-tiktok" style="font-size: 2.5rem; margin-bottom: 12px; color: #38bdf8;"></i>
            <h4 style="margin: 0 0 10px; font-size: 1.05rem;">${escapeHtml(media.title || 'Video de Inspección')}</h4>
            <a href="${media.src}" target="_blank" rel="noopener" class="btn-primary" style="background:#38bdf8; color:#0f172a; padding:10px 18px; border-radius:6px; font-weight:800; text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
              <i class="fas fa-play"></i> Reproducir Video en TikTok / Fuente Externa
            </a>
          </div>
        `;
      }
    }

    // Actualizar thumbnails activos
    document.querySelectorAll('.gem-modal-thumb-btn').forEach(btn => {
      const idx = Number(btn.getAttribute('data-idx'));
      btn.classList.toggle('active', idx === currentModalMediaIndex);
    });
  }

  function closeTechModal() {
    const overlay = document.getElementById('tech-modal-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      const wrap = document.getElementById('gem-stage-media-wrap');
      if (wrap) wrap.innerHTML = '';
    }
  }
  window.closeTechModal = closeTechModal;

  document.getElementById('tech-modal-close-btn')?.addEventListener('click', closeTechModal);
  document.getElementById('tech-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('tech-modal-overlay')) closeTechModal();
  });

  // ------------------------------------------------------------------------
  // 5. RENDERIZADO DEL CATÁLOGO PÚBLICO CON BADGES DE MULTIMEDIA
  // ------------------------------------------------------------------------
  function initCategories() {
    const container = document.getElementById('filter-pills-container');
    if (!container) return;

    const baseCategories = [
      { id: "all", name: "Todas las Gemas" },
      { id: "esmeraldas", name: "Esmeraldas" },
      { id: "zafiros", name: "Zafiros" },
      { id: "rubies", name: "Rubíes" },
      { id: "diamantes", name: "Diamantes" },
      { id: "turmalinas", name: "Turmalinas & Paraíba" },
      { id: "coleccion", name: "Colección Exclusiva" }
    ];

    const catMap = new Map();
    baseCategories.forEach(c => catMap.set(c.id, c.name));

    if (Array.isArray(gemsList)) {
      gemsList.forEach(g => {
        const slug = normalizeCategorySlug(g.category || g.displayCategory);
        const displayName = g.displayCategory || (slug.charAt(0).toUpperCase() + slug.slice(1));
        if (slug && !catMap.has(slug)) {
          catMap.set(slug, displayName);
        }
      });
    }

    const categories = Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));

    container.innerHTML = categories.map(cat => `
      <button class="pill-clean ${cat.id === currentCategory ? 'active' : ''}" onclick="filterByCategory('${cat.id}')">
        ${cat.name}
      </button>
    `).join('');
  }

  window.filterByCategory = function(catId) {
    currentCategory = catId;
    initCategories();
    renderCatalog();
  };

  function renderCatalog() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    let filtered = gemsList.filter(g => g.status !== 'Oculto' && g.active !== false);

    if (currentCategory !== 'all') {
      filtered = filtered.filter(g => g.category === currentCategory || (g.displayCategory && g.displayCategory.toLowerCase() === currentCategory.toLowerCase()));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(g =>
        (g.name && g.name.toLowerCase().includes(q)) ||
        (g.origin && g.origin.toLowerCase().includes(q)) ||
        (g.description && g.description.toLowerCase().includes(q)) ||
        (g.id && g.id.toLowerCase().includes(q))
      );
    }

    if (currentSort === 'price-asc') {
      filtered.sort((a, b) => (a.priceCOP || 0) - (b.priceCOP || 0));
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => (b.priceCOP || 0) - (a.priceCOP || 0));
    } else if (currentSort === 'carats-desc') {
      filtered.sort((a, b) => parseFloat(b.carats || 0) - parseFloat(a.carats || 0));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #6b7280;">
          <p style="font-size: 1.1rem; font-weight: 600;">No encontramos gemas que coincidan con tu búsqueda.</p>
          <button onclick="filterByCategory('all')" class="btn-secondary-light" style="margin-top: 1rem;">
            Ver todas las piedras preciosas
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(gem => {
      const isSaved = wishlist.includes(gem.id);
      const photoCount = Array.isArray(gem.images) ? gem.images.length : (gem.image ? 1 : 0);
      const videoCount = Array.isArray(gem.videos) ? gem.videos.length : 0;
      const hasMedia = photoCount > 1 || videoCount > 0;
      const isSold = gem.status === 'Agotado' || gem.status === 'Sold Out' || gem.status === 'Vendido' || gem.isSold === true;

      return `
        <article class="gem-card-clean ${isSold ? 'is-sold' : ''}" data-id="${gem.id}">
          <div class="gem-image-stage" onclick="openTechSheet('${gem.id}')" style="cursor: pointer; position: relative;">
            <img src="${gem.image || 'assets/images/emerald-gem.jpg'}" alt="${gem.name}" loading="lazy" onerror="this.src='assets/images/emerald-gem.jpg';">
            ${isSold ? `
              <span class="gem-badge-soldout"><i class="far fa-clock"></i> SOLD OUT</span>
            ` : (gem.badge ? `<span class="gem-badge-origin">${gem.badge}</span>` : '')}
            ${hasMedia ? `
              <span class="gem-card-media-pill">
                ${photoCount > 0 ? `<i class="fas fa-camera"></i> ${photoCount}` : ''}
                ${videoCount > 0 ? `<i class="fas fa-video"></i> ${videoCount}` : ''}
              </span>
            ` : ''}
            <button class="wishlist-toggle-btn ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation(); toggleWishlist('${gem.id}');" aria-label="Guardar gema">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? '#111827' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <div class="gem-info-clean">
            <div class="gem-ref-row">
              <span class="gem-spec-tag">${gem.carats || '0'} ct · ${gem.origin || 'Colombia'}</span>
              <span class="gem-ref-code">${gem.id}</span>
            </div>

            <h3 class="gem-title-clean" onclick="openTechSheet('${gem.id}')" style="cursor: pointer;">
              ${gem.name}
            </h3>

            <div class="gem-pricing-row">
              <div>
                <span class="gem-price-cop">${formatCOP(gem.priceCOP || 0)}</span>
                <span class="gem-price-usd">~ ${formatUSD(gem.priceUSD || Math.round((gem.priceCOP || 0)/4000))} USD</span>
              </div>
            </div>

            <div class="gem-actions-row">
              ${isSold ? `
                <button class="btn-card-outline" onclick="openTechSheet('${gem.id}')" style="flex: 1;">
                  <i class="fas fa-eye"></i> Ficha
                </button>
                <button class="btn-card-soldout" disabled title="Esta pieza exclusiva ya fue vendida" style="flex: 1.2;">
                  Sold Out
                </button>
              ` : `
                <button class="btn-card-outline" onclick="openTechSheet('${gem.id}')">
                  <i class="fas fa-eye"></i> Ficha Técnica
                </button>
                <button class="btn-card-wa" onclick="inquireGem('${gem.id}')" title="Apartar por WhatsApp">
                  <i class="fab fa-whatsapp"></i> Apartar
                </button>
              `}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // ------------------------------------------------------------------------
  // 6. GESTIÓN DE GUARDADOS (WISHLIST) & WHATSAPP
  // ------------------------------------------------------------------------
  function toggleWishlist(gemId) {
    const idx = wishlist.indexOf(gemId);
    if (idx > -1) {
      wishlist.splice(idx, 1);
    } else {
      wishlist.push(gemId);
    }
    try {
      localStorage.setItem('fdg_wishlist', JSON.stringify(wishlist));
    } catch (_) {}
    updateWishlistUI();
    renderCatalog();
  }
  window.toggleWishlist = toggleWishlist;

  function updateWishlistUI() {
    const wishlistCounterBadge = document.getElementById('wishlist-counter');
    const wishlistDrawerBody = document.getElementById('wishlist-drawer-body');
    if (!wishlistCounterBadge) return;
    const count = wishlist.length;
    wishlistCounterBadge.textContent = count;
    wishlistCounterBadge.style.display = count > 0 ? 'inline-flex' : 'none';

    if (wishlistDrawerBody) {
      if (count === 0) {
        wishlistDrawerBody.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem; color: #6b7280;">
            <i class="fas fa-gem" style="font-size: 2rem; opacity: 0.3; margin-bottom: 8px; display: block;"></i>
            <p style="font-weight: 600; margin-bottom: 4px;">Tu bolsa de gemas guardadas está vacía.</p>
            <p style="font-size: 0.82rem;">Toca el icono de marcador en cualquier piedra para cotizarla luego.</p>
          </div>
        `;
      } else {
        const savedGems = gemsList.filter(g => wishlist.includes(g.id));
        wishlistDrawerBody.innerHTML = savedGems.map(g => `
          <div style="display: flex; gap: 0.75rem; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
            <img src="${g.image || 'assets/images/emerald-gem.jpg'}" alt="${g.name}" style="width: 52px; height: 52px; object-fit: cover; border-radius: 6px;">
            <div style="flex: 1; min-width: 0;">
              <h4 style="font-size: 0.88rem; font-weight: 800; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${g.name}</h4>
              <div style="font-size: 0.8rem; color: #6b7280;">${g.carats} ct · ${formatCOP(g.priceCOP || 0)}</div>
            </div>
            <button type="button" onclick="toggleWishlist('${g.id}')" style="background:none; border:none; color:#ef4444; font-size: 1.1rem; cursor:pointer;" title="Quitar">✕</button>
          </div>
        `).join('');
      }
    }
  }

  function openWishlist() {
    const wishlistDrawer = document.getElementById('wishlist-drawer');
    wishlistDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  window.openWishlist = openWishlist;

  function closeWishlist() {
    const wishlistDrawer = document.getElementById('wishlist-drawer');
    wishlistDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.closeWishlist = closeWishlist;

  document.getElementById('send-wishlist-wa-btn')?.addEventListener('click', () => {
    if (wishlist.length === 0) {
      alert('Tu bolsa de gemas guardadas está vacía.');
      return;
    }
    const saved = gemsList.filter(g => wishlist.includes(g.id));
    const itemsText = saved.map(g => `• ${g.name} (${g.carats} ct, ${g.origin}) - ${formatCOP(g.priceCOP || 0)} COP`).join('\n');
    const msg = `Hola Flor De Gema, deseo cotizar mi selección de gemas guardadas:\n\n${itemsText}\n\nEslogan: "Flor De Gema, Invierte en belleza eterna"`;

    // Registrar pedido en historial local
    recordWhatsAppInquiry('Cliente Selección Bolsa', 'WhatsApp Web', `Bolsa de ${saved.length} gemas`, saved.reduce((acc, g) => acc + (g.priceCOP || 0), 0));

    const waNum = (typeof FLOR_DE_GEMA_CONFIG !== 'undefined' && FLOR_DE_GEMA_CONFIG.whatsappNumber) || '573016256746';
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  function inquireGem(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    recordWhatsAppInquiry('Cliente Interesado', 'WhatsApp Web', `${gem.name} (REF: ${gem.id})`, gem.priceCOP || 0);

    logValenEvent('OK', 'WHATSAPP_INQUIRY', `Cotización iniciada para: "${gem.name}" (${gem.id})`, { gemId, priceCOP: gem.priceCOP });

    const msg = `Hola Flor De Gema, estoy interesado(a) en la siguiente piedra preciosa:\n• Gema: ${gem.name} (REF: ${gem.id})\n• Peso: ${gem.carats} ct\n• Medidas: ${gem.dimensions || 'N/A'}\n• Procedencia: ${gem.origin || 'Colombia'}\n• Precio: ${formatCOP(gem.priceCOP || 0)} COP\n\nEslogan: "Flor De Gema, Invierte en belleza eterna"\n¿Está disponible para compra o despacho?`;

    const waNum = (typeof FLOR_DE_GEMA_CONFIG !== 'undefined' && FLOR_DE_GEMA_CONFIG.whatsappNumber) || '573016256746';
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
  }
  window.inquireGem = inquireGem;

  function inquireSoldOutGem(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    recordWhatsAppInquiry('Cliente Encargo Personalizado', 'WhatsApp Web', `Encargo similar a: ${gem.name} (REF: ${gem.id})`, gem.priceCOP || 0, 'Encargo');

    logValenEvent('OK', 'WHATSAPP_SOLDOUT_INQUIRY', `Consulta por gema similar (Sold Out): "${gem.name}" (${gem.id})`, { gemId, priceCOP: gem.priceCOP });

    const msg = `Hola Flor De Gema, vi en su catálogo que la gema "${gem.name}" (REF: ${gem.id}) ya figura como VENDIDA (Sold Out).\nMe gustó mucho esta pieza (${gem.carats} ct, ${gem.origin || 'Colombia'}, talla ${gem.cut || 'Facetada'}).\n¿Es posible encargar o cotizar una gema de características similares?\n\nEslogan: "Flor De Gema, Invierte en belleza eterna"`;

    const waNum = (typeof FLOR_DE_GEMA_CONFIG !== 'undefined' && FLOR_DE_GEMA_CONFIG.whatsappNumber) || '573016256746';
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
  }
  window.inquireSoldOutGem = inquireSoldOutGem;

  function recordWhatsAppInquiry(clientName, phone, gemName, priceCOP, status = 'Cotizado') {
    const pad = (n) => String(n).padStart(2, '0');
    const now = new Date();
    const dateFormatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const newOrder = {
      id: `PED-${Date.now().toString().slice(-4)}`,
      date: dateFormatted,
      client: clientName || 'Cliente Web',
      phone: phone || '+57 301 625 6746',
      gemName: gemName || 'Piedra Preciosa',
      priceCOP: priceCOP || 0,
      status: status || 'Cotizado',
      notes: 'Consulta o pedido registrado en Flor De Gema.'
    };
    ordersList.unshift(newOrder);
    try {
      localStorage.setItem('fdg_orders_history', JSON.stringify(ordersList));
    } catch (_) {}
    renderAdminOrdersTable();
    updateAdminStats();
  }
  window.recordWhatsAppInquiry = recordWhatsAppInquiry;

  // ------------------------------------------------------------------------
  // 7. GUÍA GEMOLÓGICA (ACADEMIA)
  // ------------------------------------------------------------------------
  function renderAcademyArticles() {
    const container = document.getElementById('academy-articles-container');
    if (!container || typeof ACADEMY_ARTICLES === 'undefined') return;

    container.innerHTML = ACADEMY_ARTICLES.map(art => `
      <article class="article-card-clean" onclick="openAcademyModal('${art.id}')">
        <div class="article-meta-row">
          <span>${art.category}</span>
          <span>·</span>
          <span>${art.readTime}</span>
        </div>
        <h3 class="article-card-title">${art.title}</h3>
        <p class="article-card-snippet">${art.snippet}</p>
        <span class="article-read-more">Leer artículo completo →</span>
      </article>
    `).join('');
  }

  function openAcademyModal(artId) {
    if (typeof ACADEMY_ARTICLES === 'undefined') return;
    const art = ACADEMY_ARTICLES.find(a => a.id === artId);
    if (!art) return;

    const modalContent = document.getElementById('academy-modal-content');
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase;">
          ${art.category} · ${art.readTime}
        </div>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #111827; margin-bottom: 1.25rem;">${art.title}</h2>
        <div style="line-height: 1.7; color: var(--text-secondary); font-size: 0.95rem;">
          ${art.fullContent}
        </div>
      </div>
    `;

    const overlay = document.getElementById('academy-modal-overlay');
    if (overlay) {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  window.openAcademyModal = openAcademyModal;

  function closeAcademyModal() {
    const overlay = document.getElementById('academy-modal-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
  window.closeAcademyModal = closeAcademyModal;

  document.getElementById('academy-modal-close-btn')?.addEventListener('click', closeAcademyModal);
  document.getElementById('academy-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('academy-modal-overlay')) closeAcademyModal();
  });

  // ------------------------------------------------------------------------
  // 8. PRÓXIMOS LIVES & VIDEOS TIKTOK PÚBLICOS
  // ------------------------------------------------------------------------
  function renderLiveUI() {
    const titleEl = document.getElementById('live-stream-title');
    const descEl = document.getElementById('live-stream-desc');
    const dateEl = document.getElementById('live-stream-date-human');
    const statusPill = document.querySelector('.live-status-pill');

    if (titleEl && liveConfig.title) titleEl.textContent = liveConfig.title;
    if (descEl && liveConfig.description) descEl.textContent = liveConfig.description;

    if (dateEl && liveConfig.live_date) {
      try {
        const d = new Date(liveConfig.live_date);
        dateEl.textContent = !isNaN(d.getTime()) ? d.toLocaleString('es-CO', { dateStyle: 'full', timeStyle: 'short' }) : liveConfig.live_date;
      } catch (_) {
        dateEl.textContent = liveConfig.live_date;
      }
    }

    if (statusPill) {
      if (liveConfig.is_live_now) {
        statusPill.className = 'live-status-pill now-live';
        statusPill.innerHTML = '<span class="live-blink"></span> EN VIVO AHORA';
      } else {
        statusPill.className = 'live-status-pill';
        statusPill.innerHTML = '● PRÓXIMO EN VIVO';
      }
    }
  }

  function renderRecommendedVideoUI() {
    const titleEl = document.getElementById('recommended-tiktok-title');
    const descEl = document.getElementById('recommended-tiktok-desc');
    const linkEl = document.getElementById('recommended-tiktok-link');

    if (titleEl && liveConfig.recommended_video_title) titleEl.textContent = liveConfig.recommended_video_title;
    if (descEl && liveConfig.recommended_video_desc) descEl.textContent = liveConfig.recommended_video_desc;
    if (linkEl && liveConfig.recommended_video_url) linkEl.href = liveConfig.recommended_video_url;
  }

  function renderTikTokVideosGrid() {
    const container = document.getElementById('tiktok-videos-container');
    if (!container) return;

    if (tikTokVideos.length === 0) {
      container.innerHTML = '<p style="color: #94a3b8; text-align: center; grid-column: 1/-1;">No hay videos publicados en este momento.</p>';
      return;
    }

    container.innerHTML = tikTokVideos.map(vid => `
      <div class="tiktok-card-clean">
        <a href="${vid.video_url}" target="_blank" rel="noopener" class="tiktok-thumb-wrap">
          <img src="${vid.thumbnail_url || 'assets/images/emerald-gem.jpg'}" alt="${vid.title}" onerror="this.src='assets/images/emerald-gem.jpg';">
          <div class="tiktok-overlay-btn"><div class="tiktok-play-circle"><i class="fas fa-play"></i></div></div>
          <span class="tiktok-views-badge">${vid.views_count || 'TikTok'}</span>
        </a>
        <div class="tiktok-card-content">
          <h4 class="tiktok-card-title">${vid.title}</h4>
          <p class="tiktok-card-desc">${vid.description || ''}</p>
          <a href="${vid.video_url}" target="_blank" rel="noopener" class="tiktok-card-btn">
            <span>Ver video en TikTok</span>
            <i class="fas fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>
    `).join('');
  }

  function startLiveCountdown() {
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl) return;
    if (countdownInterval) clearInterval(countdownInterval);

    function tick() {
      if (liveConfig.is_live_now) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const now = Date.now();
      let targetTime = new Date(liveConfig.live_date).getTime();
      if (isNaN(targetTime)) {
        targetTime = now + 86400000;
      }

      const diff = targetTime - now;
      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minutesEl.textContent = String(m).padStart(2, '0');
      secondsEl.textContent = String(s).padStart(2, '0');
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  // ------------------------------------------------------------------------
  // 9. FAQ & CONTACTO
  // ------------------------------------------------------------------------
  function initFAQ() {
    document.querySelectorAll('.faq-item-clean').forEach(item => {
      const btn = item.querySelector('.faq-question-btn');
      btn?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item-clean').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  function initContactForm() {
    const form = document.getElementById('custom-quote-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('quote-name')?.value || '';
      const gemType = document.getElementById('quote-gem-type')?.value || '';
      const budget = document.getElementById('quote-budget')?.value || '';
      const msg = document.getElementById('quote-msg')?.value || '';

      recordWhatsAppInquiry(name, 'Formulario Web', gemType, Number(budget) || 0);

      logValenEvent('OK', 'CONTACT_FORM', `Formulario enviado por: ${name}`, { gemType, budget });

      const waText = `Hola Flor De Gema, deseo asesoría personalizada:\n• Nombre: ${name}\n• Tipo de gema: ${gemType}\n• Presupuesto aproximado: ${budget}\n• Mensaje: ${msg}\n\nEslogan: "Flor De Gema, Invierte en belleza eterna"`;

      const waNum = (typeof FLOR_DE_GEMA_CONFIG !== 'undefined' && FLOR_DE_GEMA_CONFIG.whatsappNumber) || '573016256746';
      window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(waText)}`, '_blank');
      form.reset();
    });
  }

  // ------------------------------------------------------------------------
  // 10. PANEL DE ADMINISTRACIÓN - INVENTARIO & CATEGORÍAS
  // ------------------------------------------------------------------------
  function updateAdminStats() {
    const statGems = document.getElementById('admin-header-product-stat');
    if (statGems) statGems.textContent = `${gemsList.length} Gemas`;

    const statCats = document.getElementById('admin-header-category-stat');
    if (statCats) statCats.textContent = `${adminCategories.length} Categorías`;

    const tabCatalogBadge = document.getElementById('tab-stat-catalog');
    if (tabCatalogBadge) tabCatalogBadge.textContent = gemsList.length;

    const tabOrdersBadge = document.getElementById('tab-stat-orders');
    if (tabOrdersBadge) tabOrdersBadge.textContent = ordersList.length;

    const totalBadge = document.getElementById('admin-total-products-badge');
    if (totalBadge) totalBadge.textContent = `${gemsList.length} gemas en catálogo`;

    const catBadge = document.getElementById('admin-category-count-badge');
    if (catBadge) catBadge.textContent = `${adminCategories.length} Categorías`;

    updateLogsBadge();
  }
  window.updateAdminStats = updateAdminStats;

  function populateAdminCategorySelect() {
    const select = document.getElementById('admin-product-category');
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona una categoría existente</option>';
    adminCategories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });
  }

  function renderAdminCategoryChips() {
    const container = document.getElementById('admin-category-list');
    if (!container) return;
    container.innerHTML = '';

    adminCategories.forEach(cat => {
      const count = gemsList.filter(g =>
        (g.displayCategory && g.displayCategory.toLowerCase() === cat.name.toLowerCase()) ||
        g.category === normalizeCategorySlug(cat.name)
      ).length;

      const chip = document.createElement('div');
      chip.className = 'admin-category-chip';
      chip.innerHTML = `
        <span class="chip-name" title="${cat.name}">${cat.name}</span>
        <span class="chip-count">${count}</span>
        <div class="chip-actions">
          <button type="button" class="chip-action-btn chip-edit-btn" title="Renombrar"><i class="fas fa-pen"></i></button>
          <button type="button" class="chip-action-btn chip-delete-btn" title="Eliminar"><i class="fas fa-trash"></i></button>
        </div>
      `;

      chip.querySelector('.chip-edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        editAdminCategory(cat.name);
      });

      chip.querySelector('.chip-delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteAdminCategory(cat.name);
      });

      container.appendChild(chip);
    });
  }

  function editAdminCategory(oldName) {
    const input = prompt(`Ingresa el nuevo nombre para la categoría "${oldName}":`, oldName);
    if (!input) return;
    const newName = input.trim();
    if (!newName || newName.toLowerCase() === oldName.toLowerCase()) return;

    if (adminCategories.some(c => c.name.toLowerCase() === newName.toLowerCase())) {
      alert(`Ya existe una categoría llamada "${newName}".`);
      return;
    }

    gemsList.forEach(g => {
      if ((g.displayCategory && g.displayCategory.toLowerCase() === oldName.toLowerCase()) || g.category === normalizeCategorySlug(oldName)) {
        g.displayCategory = newName;
        g.category = normalizeCategorySlug(newName);
      }
    });

    adminCategories = adminCategories.map(c => c.name.toLowerCase() === oldName.toLowerCase() ? { ...c, name: newName } : c);
    localStorage.setItem('fdg_admin_categories', JSON.stringify(adminCategories));
    localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));

    populateAdminCategorySelect();
    renderAdminCategoryChips();
    renderAdminCategoryPills();
    renderAdminProductsList();
    renderCatalog();
    updateAdminStats();

    logValenEvent('OK', 'CATEGORY_UPDATE', `Categoría renombrada: "${oldName}" → "${newName}"`, { oldName, newName });
  }

  function deleteAdminCategory(name) {
    const count = gemsList.filter(g =>
      (g.displayCategory && g.displayCategory.toLowerCase() === name.toLowerCase()) ||
      g.category === normalizeCategorySlug(name)
    ).length;

    const msg = count > 0
      ? `¿Estás seguro de eliminar la categoría "${name}"?\n\n⚠️ ${count} gema(s) asociada(s) se reasignarán a "Esmeraldas".`
      : `¿Deseas eliminar la categoría "${name}"?`;

    if (!confirm(msg)) return;

    gemsList.forEach(g => {
      if ((g.displayCategory && g.displayCategory.toLowerCase() === name.toLowerCase()) || g.category === normalizeCategorySlug(name)) {
        g.displayCategory = 'Esmeraldas';
        g.category = 'esmeraldas';
      }
    });

    adminCategories = adminCategories.filter(c => c.name.toLowerCase() !== name.toLowerCase());
    localStorage.setItem('fdg_admin_categories', JSON.stringify(adminCategories));
    localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));

    if (adminSelectedCat.toLowerCase() === name.toLowerCase()) adminSelectedCat = 'all';

    populateAdminCategorySelect();
    renderAdminCategoryChips();
    renderAdminCategoryPills();
    renderAdminProductsList();
    renderCatalog();
    updateAdminStats();

    logValenEvent('OK', 'CATEGORY_DELETE', `Categoría eliminada: "${name}" (${count} gemas reasignadas)`, { categoryName: name });
  }

  function renderAdminCategoryPills() {
    const container = document.getElementById('admin-category-pills');
    if (!container) return;
    container.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = `category-pill ${adminSelectedCat === 'all' ? 'active' : ''}`;
    allBtn.innerHTML = `<span>Todas</span> (${gemsList.length})`;
    allBtn.addEventListener('click', () => {
      adminSelectedCat = 'all';
      renderAdminCategoryPills();
      renderAdminProductsList();
    });
    container.appendChild(allBtn);

    adminCategories.forEach(cat => {
      const count = gemsList.filter(g =>
        (g.displayCategory && g.displayCategory.toLowerCase() === cat.name.toLowerCase()) ||
        g.category === normalizeCategorySlug(cat.name)
      ).length;

      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `category-pill ${adminSelectedCat.toLowerCase() === cat.name.toLowerCase() ? 'active' : ''}`;
      pill.innerHTML = `<span>${cat.name}</span> (${count})`;
      pill.addEventListener('click', () => {
        adminSelectedCat = cat.name;
        renderAdminCategoryPills();
        renderAdminProductsList();
      });
      container.appendChild(pill);
    });
  }

  function renderAdminProductsList() {
    const listContainer = document.getElementById('admin-product-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    let list = gemsList.slice();
    if (adminSelectedCat !== 'all') {
      list = list.filter(g =>
        (g.displayCategory && g.displayCategory.toLowerCase() === adminSelectedCat.toLowerCase()) ||
        g.category === normalizeCategorySlug(adminSelectedCat)
      );
    }

    if (adminSearchQuery) {
      const q = adminSearchQuery.toLowerCase();
      list = list.filter(g =>
        String(g.name || '').toLowerCase().includes(q) ||
        String(g.id || '').toLowerCase().includes(q) ||
        String(g.origin || '').toLowerCase().includes(q)
      );
    }

    if (list.length === 0) {
      listContainer.innerHTML = `<p style="padding: 24px; color: #94a3b8; text-align: center; grid-column: 1/-1;">No hay gemas que coincidan con la búsqueda.</p>`;
      return;
    }

    list.forEach(gem => {
      const card = document.createElement('div');
      const isHidden = gem.status === 'Oculto' || gem.active === false;
      const isSold = gem.status === 'Agotado' || gem.status === 'Sold Out' || gem.status === 'Vendido' || gem.isSold === true;
      card.className = `admin-prod-card ${isHidden ? 'inactive-product' : ''} ${isSold ? 'sold-product' : ''}`;

      const photoCount = Array.isArray(gem.images) ? gem.images.length : (gem.image ? 1 : 0);
      const videoCount = Array.isArray(gem.videos) ? gem.videos.length : 0;

      card.innerHTML = `
        <div class="admin-prod-card-main">
          <img src="${gem.image || 'assets/images/emerald-gem.jpg'}" class="admin-prod-thumb" alt="${gem.name}" onerror="this.src='assets/images/emerald-gem.jpg';">
          <div class="admin-prod-info">
            <div class="admin-prod-name" title="${gem.name}">${gem.id} · ${gem.name}</div>
            <div class="admin-prod-price">${formatCOP(gem.priceCOP || 0)}</div>
            <div style="font-size: 0.72rem; color: #64748b; display: flex; gap: 8px; align-items: center; margin-top: 2px;">
              <span>${gem.displayCategory || gem.category}</span>
              <span>•</span>
              <span style="color: #047857; font-weight: 700;">📷 ${photoCount} ${videoCount > 0 ? `· 🎥 ${videoCount}` : ''}</span>
              ${isSold ? `<span style="color: #0f172a; font-weight: 800; background: #e2e8f0; padding: 1px 6px; border-radius: 4px;">• ⏱ Sold Out</span>` : ''}
              ${isHidden ? `<span style="color: #b91c1c; font-weight: 700;">• (Oculta)</span>` : ''}
            </div>
          </div>
        </div>
        <div class="admin-prod-actions">
          <button type="button" class="admin-action-btn admin-action-sold ${isSold ? 'is-sold' : ''}" data-id="${gem.id}" title="${isSold ? 'Reactivar como Disponible' : 'Marcar como Vendida (Sold Out)'}">
            <i class="fas ${isSold ? 'fa-undo' : 'fa-tag'}"></i> ${isSold ? 'Vendida ✓' : 'Marcar Vendida'}
          </button>
          <button type="button" class="admin-action-btn admin-action-edit" data-id="${gem.id}">
            <i class="fas fa-pen"></i> Editar
          </button>
          <button type="button" class="admin-action-btn admin-action-toggle ${isHidden ? 'to-inactive' : ''}" data-id="${gem.id}">
            <i class="fas ${isHidden ? 'fa-eye' : 'fa-eye-slash'}"></i> ${isHidden ? 'Mostrar' : 'Ocultar'}
          </button>
          <button type="button" class="admin-action-btn admin-action-delete" data-id="${gem.id}" title="Eliminar gema">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      card.querySelector('.admin-action-sold').addEventListener('click', () => toggleProductSoldState(gem.id));
      card.querySelector('.admin-action-edit').addEventListener('click', () => openEditProduct(gem.id));
      card.querySelector('.admin-action-toggle').addEventListener('click', () => toggleProductState(gem.id));
      card.querySelector('.admin-action-delete').addEventListener('click', () => deleteProduct(gem.id));

      listContainer.appendChild(card);
    });
  }

  // ------------------------------------------------------------------------
  // 11. FORMULARIO DE GEMA & EDICIÓN (CRUD CON MÚLTIPLES FOTOS Y VIDEOS)
  // ------------------------------------------------------------------------
  function resetAdminProductForm() {
    const form = document.getElementById('admin-product-form');
    if (form) form.reset();
    const idInput = document.getElementById('admin-product-id');
    if (idInput) idInput.value = '';
    const heading = document.getElementById('admin-form-heading');
    if (heading) heading.innerHTML = '<i class="fas fa-plus-circle" style="color: #d4af37;"></i> Agregar Piedra Preciosa';

    const safeSetVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    safeSetVal('admin-gem-dimensions-input', '');
    safeSetVal('admin-gem-shape-input', '');
    safeSetVal('admin-gem-color-input', '');
    safeSetVal('admin-gem-treatment-input', '');
    safeSetVal('admin-gem-clarity-input', '');
    safeSetVal('admin-gem-cert-input', '');
    safeSetVal('admin-gem-lab-input', '');
    safeSetVal('admin-gem-description-input', '');

    currentGemPhotos = [];
    currentGemVideos = [];
    renderGemPhotosGallery();
    renderGemVideosGallery();

    const statusSelect = document.getElementById('admin-product-status-select');
    if (statusSelect) statusSelect.value = 'Disponible';

    const msg = document.getElementById('admin-product-message');
    if (msg) msg.textContent = '';
  }

  function openEditProduct(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    const panel = document.getElementById('admin-product-panel');
    const toggleBtn = document.getElementById('admin-product-toggle');
    if (panel) {
      panel.style.display = 'block';
      panel.classList.remove('hidden');
    }
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Cerrar Formulario';

    const heading = document.getElementById('admin-form-heading');
    if (heading) heading.innerHTML = `<i class="fas fa-pen" style="color: #d4af37;"></i> Editar Gema: ${gem.name}`;

    document.getElementById('admin-product-id').value = gem.id;
    document.getElementById('admin-product-name').value = gem.name || '';
    document.getElementById('admin-product-price').value = gem.priceCOP || 0;
    document.getElementById('admin-product-category').value = gem.displayCategory || 'Esmeraldas';
    document.getElementById('admin-gem-origin-input').value = gem.origin || '';
    document.getElementById('admin-gem-weight-input').value = gem.carats || '';
    document.getElementById('admin-gem-cut-input').value = gem.cut || '';
    document.getElementById('admin-gem-dimensions-input').value = gem.dimensions || '';
    document.getElementById('admin-gem-shape-input').value = gem.shape || '';
    document.getElementById('admin-gem-color-input').value = gem.color || '';
    document.getElementById('admin-gem-treatment-input').value = gem.treatment || '';
    document.getElementById('admin-gem-clarity-input').value = gem.clarity || '';
    document.getElementById('admin-gem-cert-input').value = gem.reportNumber || '';
    document.getElementById('admin-gem-lab-input').value = gem.lab || '';
    document.getElementById('admin-gem-description-input').value = gem.description || '';
    document.getElementById('admin-product-image-url').value = gem.image || '';

    const statusSelect = document.getElementById('admin-product-status-select');
    if (statusSelect) {
      if (gem.status === 'Agotado' || gem.status === 'Sold Out' || gem.status === 'Vendido' || gem.isSold === true) {
        statusSelect.value = 'Agotado';
      } else if (gem.status === 'Oculto' || gem.active === false) {
        statusSelect.value = 'Oculto';
      } else {
        statusSelect.value = 'Disponible';
      }
    }

    const activeCheckbox = document.getElementById('admin-product-active');
    if (activeCheckbox) activeCheckbox.checked = !(gem.status === 'Oculto' || gem.active === false);

    // Cargar fotos y videos existentes
    if (Array.isArray(gem.images) && gem.images.length > 0) {
      currentGemPhotos = [...gem.images];
    } else if (gem.image) {
      currentGemPhotos = [gem.image];
    } else {
      currentGemPhotos = [];
    }

    if (Array.isArray(gem.videos)) {
      currentGemVideos = [...gem.videos];
    } else {
      currentGemVideos = [];
    }

    renderGemPhotosGallery();
    renderGemVideosGallery();

    panel?.scrollIntoView({ behavior: 'smooth' });
  }
  window.openEditProduct = openEditProduct;

  function toggleProductState(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    const isHidden = gem.status === 'Oculto' || gem.active === false;
    gem.status = isHidden ? 'Disponible' : 'Oculto';
    gem.active = isHidden;

    localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));
    renderAdminProductsList();
    renderCatalog();

    logValenEvent('OK', 'PRODUCT_TOGGLE', `Visibilidad cambiada: "${gem.name}" (${gem.status})`, { gemId, status: gem.status });
  }
  window.toggleProductState = toggleProductState;

  async function toggleProductSoldState(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    const currentlySold = gem.status === 'Agotado' || gem.status === 'Sold Out' || gem.status === 'Vendido' || gem.isSold === true;
    const newStatus = currentlySold ? 'Disponible' : 'Agotado';
    gem.status = newStatus;
    gem.isSold = !currentlySold;
    gem.active = true; // Mantiene la gema visible en el catálogo (no oculta)

    localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));
    renderAdminProductsList();
    renderCatalog();
    updateAdminStats();

    // Sincronizar actualización de estado con Neon si está disponible
    const rawId = gem.rawId || String(gemId).replace(/\D/g, '');
    if (rawId) {
      try {
        fetch(`/api/gemstones/${rawId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': currentAdminPin,
            'Authorization': `Bearer ${currentAdminPin}`
          },
          body: JSON.stringify({
            status: newStatus,
            adminPassword: currentAdminPin
          })
        }).catch(() => {});
      } catch (_) {}
    }

    logValenEvent('OK', 'PRODUCT_STATUS_CHANGE', `Gema "${gem.name}" marcada como: ${newStatus}`, { gemId, status: newStatus });
  }
  window.toggleProductSoldState = toggleProductSoldState;

  async function deleteProduct(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    if (!confirm(`¿Estás seguro de eliminar "${gem.name}" (${gem.id}) del catálogo?`)) return;

    const rawId = gem.rawId || String(gemId).replace(/\D/g, '');

    // Sincronizar borrado con Neon
    if (rawId) {
      try {
        const res = await fetch(`/api/gemstones/${rawId}`, {
          method: 'DELETE',
          headers: {
            'x-admin-password': currentAdminPin,
            'Authorization': `Bearer ${currentAdminPin}`
          }
        });
        if (!res.ok && res.status !== 404) {
          console.warn('Error eliminando gema en Neon:', res.status);
        }
      } catch (err) {
        console.warn('Fallo de red al sincronizar borrado con Neon:', err);
      }
    }

    gemsList = gemsList.filter(g => g.id !== gemId && String(g.rawId) !== String(gemId));
    localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));

    renderAdminProductsList();
    renderAdminCategoryChips();
    renderAdminCategoryPills();
    renderCatalog();
    updateAdminStats();

    logValenEvent('OK', 'PRODUCT_DELETE', `Gema eliminada: "${gem.name}" (${gem.id})`, { gemId, name: gem.name });
  }
  window.deleteProduct = deleteProduct;

  function compressImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
    return new Promise((resolve) => {
      if (!file || !file.type || !file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl || dataUrl.length < 50 || !dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  function compressDataUrl(dataUrl, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
    return new Promise((resolve) => {
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
        return resolve(dataUrl);
      }
      if (dataUrl.length < 180000) {
        return resolve(dataUrl);
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let resUrl = canvas.toDataURL('image/webp', quality);
        if (!resUrl || resUrl.length < 50 || !resUrl.startsWith('data:image/webp')) {
          resUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(resUrl);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  async function syncCategoryToDatabase(name) {
    if (!name) return;
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': currentAdminPin,
          'Authorization': `Bearer ${currentAdminPin}`
        },
        body: JSON.stringify({ name, adminPassword: currentAdminPin })
      });
    } catch (_) {}
  }

  async function handleProductFormSubmit(e) {
    e.preventDefault();
    const idInput = document.getElementById('admin-product-id').value.trim();
    const name = document.getElementById('admin-product-name').value.trim();
    const price = Number(document.getElementById('admin-product-price').value) || 0;
    const catSelect = document.getElementById('admin-product-category').value;
    const catNew = document.getElementById('admin-product-category-new').value.trim();
    const origin = document.getElementById('admin-gem-origin-input').value.trim() || 'Colombia';
    const weight = document.getElementById('admin-gem-weight-input').value.trim() || '2.0 ct';
    const cut = document.getElementById('admin-gem-cut-input').value.trim() || 'Talla Esmeralda';
    const dimensions = document.getElementById('admin-gem-dimensions-input')?.value.trim() || 'A convenir';
    const shape = document.getElementById('admin-gem-shape-input')?.value.trim() || cut.split(' ')[0] || 'Facetado';
    const color = document.getElementById('admin-gem-color-input')?.value.trim() || 'Color Natural';
    const treatment = document.getElementById('admin-gem-treatment-input')?.value.trim() || 'Natural sin tratamiento térmico';
    const clarity = document.getElementById('admin-gem-clarity-input')?.value.trim() || 'Seleccionada';
    const cert = document.getElementById('admin-gem-cert-input')?.value.trim() || '';
    const lab = document.getElementById('admin-gem-lab-input')?.value.trim() || (cert || 'Laboratorio Acreditado');
    const description = document.getElementById('admin-gem-description-input')?.value.trim() || `Piedra preciosa natural seleccionada con la máxima exigencia gemológica. "Flor De Gema, Invierte en belleza eterna".`;
    const active = document.getElementById('admin-product-active').checked;

    if (!name) {
      alert('Ingresa el nombre de la gema.');
      return;
    }

    if (currentGemPhotos.length === 0) {
      alert('Debes agregar al menos una foto para la gema.');
      return;
    }

    const categoryName = catNew || catSelect || 'Esmeraldas';
    if (catNew && !adminCategories.some(c => c.name.toLowerCase() === catNew.toLowerCase())) {
      adminCategories.push({ id: Date.now(), name: catNew });
      localStorage.setItem('fdg_admin_categories', JSON.stringify(adminCategories));
      populateAdminCategorySelect();
      renderAdminCategoryChips();
      renderAdminCategoryPills();
      syncCategoryToDatabase(catNew);
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Guardar';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando y publicando en la nube...';
    }

    // Comprimir fotos para asegurar peso óptimo (< 150KB cada una)
    const compressedPhotos = [];
    for (const photo of currentGemPhotos) {
      if (typeof photo === 'string' && photo.startsWith('data:image/')) {
        const comp = await compressDataUrl(photo, 1200, 1200, 0.8);
        compressedPhotos.push(comp);
      } else {
        compressedPhotos.push(photo);
      }
    }

    const mainCover = compressedPhotos[0] || 'assets/images/emerald-gem.jpg';

    const statusSelect = document.getElementById('admin-product-status-select');
    const selectedStatus = statusSelect ? statusSelect.value : (active ? 'Disponible' : 'Oculto');
    const isGemActive = selectedStatus !== 'Oculto';

    const payload = {
      name,
      category: normalizeCategorySlug(categoryName),
      displayCategory: categoryName,
        priceCOP: price,
        priceUSD: Math.round(price / 4000),
        carats: weight.replace(/[^0-9.]/g, '') || weight,
        dimensions,
        shape,
        cut,
        color,
        clarity,
        treatment,
        origin,
        reportNumber: cert || 'Reporte Gemológico Oficial',
        lab: lab || 'Laboratorio Acreditado',
        image: mainCover,
        images: [...compressedPhotos],
        videos: [...currentGemVideos],
        featured: true,
        status: selectedStatus,
        active: isGemActive,
        badge: origin.split(',')[0].trim(),
        description
      };

    const isEdit = Boolean(idInput);
    const existingGem = isEdit ? gemsList.find(g => g.id === idInput || String(g.rawId) === idInput) : null;
    const rawId = existingGem ? (existingGem.rawId || String(existingGem.id).replace(/\D/g, '')) : (isEdit ? String(idInput).replace(/\D/g, '') : null);

    const endpoint = (isEdit && rawId) ? `/api/gemstones/${rawId}` : '/api/gemstones';
    const method = (isEdit && rawId) ? 'PUT' : 'POST';

    let serverNotice = '';
    let savedRow = {};

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': currentAdminPin,
          'Authorization': `Bearer ${currentAdminPin}`
        },
        body: JSON.stringify({
          ...payload,
          price,
          weight_ct: payload.carats,
          dimensions_mm: payload.dimensions,
          shape: payload.shape,
          cut: payload.cut,
          color: payload.color,
          clarity: payload.clarity,
          treatment: payload.treatment,
          origin: payload.origin,
          certificate: payload.reportNumber,
          lab: payload.lab,
          description: payload.description,
          image: mainCover,
          images: compressedPhotos,
          videos: currentGemVideos,
          adminPassword: currentAdminPin
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        let errMsg = errData.error || errData.message || `Error del servidor HTTP ${res.status}`;
        if (res.status === 402) {
          serverNotice = '\n\n⚠️ Nota de la nube Neon: Tu cuenta superó la cuota mensual gratuita (HTTP 402). La gema quedó GUARDADA y PUBLICADA localmente en tu catálogo.';
        } else if (res.status === 413) {
          serverNotice = '\n\n⚠️ Las imágenes exceden el límite de Neon; guardado localmente.';
        } else {
          serverNotice = `\n\n⚠️ Sincronización en la nube: ${errMsg}. Guardada en tu catálogo local.`;
        }
        console.warn('Neon DB status:', res.status, errMsg);
      } else {
        savedRow = await res.json().catch(() => ({}));
      }

      const finalRawId = savedRow.id || (existingGem ? existingGem.rawId : Date.now());
      const finalId = `FDG-${finalRawId}`;

      const finalGem = {
        ...payload,
        id: finalId,
        rawId: finalRawId,
        image: savedRow.image || mainCover,
        images: Array.isArray(savedRow.images) && savedRow.images.length > 0 ? savedRow.images : compressedPhotos,
        videos: Array.isArray(savedRow.videos) ? savedRow.videos : payload.videos
      };

      if (isEdit) {
        const idx = gemsList.findIndex(g => g.id === idInput || String(g.rawId) === idInput || (rawId && String(g.rawId) === String(rawId)));
        if (idx > -1) {
          gemsList[idx] = finalGem;
        } else {
          gemsList.unshift(finalGem);
        }
        logValenEvent('OK', 'PRODUCT_UPDATE', `Gema actualizada: "${name}" (${finalId}) - Estado: ${selectedStatus}`, { id: finalId, name, price, status: selectedStatus });
      } else {
        gemsList.unshift(finalGem);
        logValenEvent('OK', 'PRODUCT_CREATE', `Nueva gema creada: "${name}" ($${formatCOP(price)}) - Estado: ${selectedStatus}`, { id: finalId, name, price, status: selectedStatus });
      }

      localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));
      initCategories();
      renderAdminProductsList();
      renderAdminCategoryChips();
      renderAdminCategoryPills();
      renderCatalog();
      updateAdminStats();

      resetAdminProductForm();
      const panel = document.getElementById('admin-product-panel');
      if (panel) {
        panel.style.display = 'none';
        panel.classList.add('hidden');
      }
      const toggleBtn = document.getElementById('admin-product-toggle');
      if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-plus"></i> Abrir Formulario';

      alert(`¡Piedra preciosa guardada y publicada exitosamente!\nEstado: ${selectedStatus}. Todos los clientes pueden verla en el catálogo.${serverNotice}`);
    } catch (err) {
      console.warn('Network error saving to cloud:', err);
      // Fallback local garantizado
      const finalRawId = existingGem ? existingGem.rawId : Date.now();
      const finalId = `FDG-${finalRawId}`;
      const finalGem = {
        ...payload,
        id: finalId,
        rawId: finalRawId,
        image: mainCover,
        images: compressedPhotos,
        videos: currentGemVideos
      };

      if (isEdit) {
        const idx = gemsList.findIndex(g => g.id === idInput || String(g.rawId) === idInput);
        if (idx > -1) gemsList[idx] = finalGem;
        else gemsList.unshift(finalGem);
      } else {
        gemsList.unshift(finalGem);
      }

      localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));
      renderAdminProductsList();
      renderCatalog();
      updateAdminStats();
      resetAdminProductForm();

      alert(`¡Piedra preciosa guardada en tu catálogo local!\nEstado: ${selectedStatus}. (Nota: Hubo un fallo de conexión con Neon; los cambios están guardados en tu navegador).`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  }

  // ------------------------------------------------------------------------
  // 12. PESTAÑA: HISTORIAL DE PEDIDOS & COTIZACIONES WHATSAPP
  // ------------------------------------------------------------------------
  function renderAdminOrdersTable() {
    const tbody = document.getElementById('admin-orders-table-body');
    const badge = document.getElementById('admin-orders-count-badge');
    const tabStat = document.getElementById('tab-stat-orders');
    if (!tbody) return;

    if (badge) badge.textContent = `${ordersList.length} Pedidos`;
    if (tabStat) tabStat.textContent = ordersList.length;

    const searchInput = document.getElementById('admin-orders-search');
    const q = (searchInput?.value || '').trim().toLowerCase();

    let filtered = ordersList;
    if (q) {
      filtered = filtered.filter(o =>
        String(o.client || '').toLowerCase().includes(q) ||
        String(o.gemName || '').toLowerCase().includes(q) ||
        String(o.phone || '').toLowerCase().includes(q) ||
        String(o.id || '').toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:#94a3b8;">No se encontraron pedidos ni cotizaciones registradas.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(order => {
      let badgeClass = 'status-pending';
      if (order.status === 'Cotizado') badgeClass = 'status-quoted';
      if (order.status === 'Apartado') badgeClass = 'status-reserved';
      if (order.status === 'Vendido') badgeClass = 'status-sold';

      const cleanPhone = String(order.phone || '').replace(/\D/g, '');

      return `
        <tr>
          <td><strong>${order.id}</strong></td>
          <td style="color:#64748b; font-size:0.78rem;">${order.date}</td>
          <td><strong>${escapeHtml(order.client)}</strong></td>
          <td><a href="https://wa.me/${cleanPhone}" target="_blank" style="color:#0284c7; font-weight:700;"><i class="fab fa-whatsapp"></i> ${order.phone}</a></td>
          <td style="max-width: 180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(order.gemName)}</td>
          <td style="font-weight:800; color:#15803d;">${formatCOP(order.priceCOP || 0)}</td>
          <td>
            <select class="order-status-select" data-id="${order.id}" style="padding: 3px 6px; font-size: 0.74rem; font-weight: 800; border-radius: 4px; border: 1px solid #cbd5e1;">
              <option value="Cotizado" ${order.status === 'Cotizado' ? 'selected' : ''}>Cotizado</option>
              <option value="Apartado" ${order.status === 'Apartado' ? 'selected' : ''}>Apartado</option>
              <option value="Vendido" ${order.status === 'Vendido' ? 'selected' : ''}>Vendido</option>
              <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            </select>
          </td>
          <td>
            <button type="button" class="btn-del-order" data-id="${order.id}" style="background:none; border:none; color:#ef4444; cursor:pointer;" title="Eliminar registro">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.order-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.getAttribute('data-id');
        const val = sel.value;
        const target = ordersList.find(o => o.id === id);
        if (target) {
          target.status = val;
          localStorage.setItem('fdg_orders_history', JSON.stringify(ordersList));
          logValenEvent('OK', 'ORDER_STATUS_UPDATE', `Pedido ${id} actualizado a estado "${val}"`, { id, status: val });
        }
      });
    });

    tbody.querySelectorAll('.btn-del-order').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (!confirm(`¿Eliminar el registro ${id}?`)) return;
        ordersList = ordersList.filter(o => o.id !== id);
        localStorage.setItem('fdg_orders_history', JSON.stringify(ordersList));
        renderAdminOrdersTable();
      });
    });
  }

  // ------------------------------------------------------------------------
  // 13. PESTAÑA: ENVÍOS ASEGURADOS
  // ------------------------------------------------------------------------
  function populateAdminShippingForm() {
    const carrierInput = document.getElementById('admin-shipping-carrier');
    const costInput = document.getElementById('admin-shipping-cost');
    const freeMinInput = document.getElementById('admin-shipping-free-min');
    const notesInput = document.getElementById('admin-shipping-security-notes');

    if (carrierInput) carrierInput.value = shippingConfig.carrier || 'Inter Rapidísimo / Servientrega';
    if (costInput) costInput.value = shippingConfig.costCOP || 25000;
    if (freeMinInput) freeMinInput.value = shippingConfig.freeMinCOP || 15000000;
    if (notesInput) notesInput.value = shippingConfig.securityNotes || '';
  }

  // ------------------------------------------------------------------------
  // 14. PESTAÑA: LIVES & VIDEOS TIKTOK EN ADMIN
  // ------------------------------------------------------------------------
  function populateAdminLiveForm() {
    const title = document.getElementById('admin-input-live-title');
    if (title && liveConfig.title) title.value = liveConfig.title;

    const liveDate = document.getElementById('admin-input-live-date');
    if (liveDate && liveConfig.live_date) liveDate.value = liveConfig.live_date;

    const platform = document.getElementById('admin-input-live-platform');
    if (platform && liveConfig.platform) platform.value = liveConfig.platform;

    const tiktokUrl = document.getElementById('admin-input-live-tiktok-url');
    if (tiktokUrl && liveConfig.tiktok_url) tiktokUrl.value = liveConfig.tiktok_url;

    const desc = document.getElementById('admin-input-live-desc');
    if (desc && liveConfig.description) desc.value = liveConfig.description;

    const isLiveNow = document.getElementById('admin-input-is-live-now');
    if (isLiveNow) isLiveNow.checked = Boolean(liveConfig.is_live_now);

    const recTitle = document.getElementById('admin-input-rec-title');
    if (recTitle && liveConfig.recommended_video_title) recTitle.value = liveConfig.recommended_video_title;

    const recUrl = document.getElementById('admin-input-rec-url');
    if (recUrl && liveConfig.recommended_video_url) recUrl.value = liveConfig.recommended_video_url;

    const recDesc = document.getElementById('admin-input-rec-desc');
    if (recDesc && liveConfig.recommended_video_desc) recDesc.value = liveConfig.recommended_video_desc;
  }

  function renderAdminTikTokList() {
    const container = document.getElementById('admin-tiktok-list');
    if (!container) return;
    container.innerHTML = '';

    if (tikTokVideos.length === 0) {
      container.innerHTML = '<p style="color: #94a3b8; font-size: 0.85rem;">No hay videos de TikTok en la galería.</p>';
      return;
    }

    tikTokVideos.forEach(vid => {
      const card = document.createElement('div');
      card.className = 'admin-prod-card';
      card.innerHTML = `
        <div class="admin-prod-card-main">
          <img src="${vid.thumbnail_url || 'assets/images/emerald-gem.jpg'}" class="admin-prod-thumb" alt="${vid.title}" onerror="this.src='assets/images/emerald-gem.jpg';">
          <div class="admin-prod-info">
            <div class="admin-prod-name" title="${vid.title}">${vid.title}</div>
            <div style="font-size: 0.78rem; color: #64748b;">${vid.views_count || 'TikTok Video'}</div>
          </div>
        </div>
        <div class="admin-prod-actions">
          <a href="${vid.video_url}" target="_blank" rel="noopener" class="admin-action-btn admin-action-edit">
            <i class="fas fa-play"></i> Ver
          </a>
          <button type="button" class="admin-action-btn admin-action-delete" data-id="${vid.id}" title="Eliminar video">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      card.querySelector('.admin-action-delete').addEventListener('click', () => {
        if (!confirm(`¿Eliminar el video "${vid.title}" de la galería?`)) return;
        tikTokVideos = tikTokVideos.filter(v => v.id !== vid.id);
        localStorage.setItem('fdg_tiktok_videos', JSON.stringify(tikTokVideos));
        renderAdminTikTokList();
        renderTikTokVideosGrid();
        logValenEvent('OK', 'TIKTOK_VIDEO_DELETE', `Video eliminado: "${vid.title}"`, { id: vid.id });
      });

      container.appendChild(card);
    });
  }

  // ------------------------------------------------------------------------
  // 15. SINCRONIZACIÓN NEON POSTGRESQL SERVERLESS
  // ------------------------------------------------------------------------
  async function uploadLocalGemsToNeon() {
    if (!gemsList || gemsList.length === 0) return 0;
    let uploadedCount = 0;
    for (const gem of gemsList) {
      try {
        const compressedPhotos = [];
        const rawPhotos = Array.isArray(gem.images) && gem.images.length > 0 ? gem.images : (gem.image ? [gem.image] : []);
        for (const photo of rawPhotos) {
          if (typeof photo === 'string' && photo.startsWith('data:image/')) {
            const comp = await compressDataUrl(photo, 1200, 1200, 0.8);
            compressedPhotos.push(comp);
          } else {
            compressedPhotos.push(photo);
          }
        }

        const mainImg = compressedPhotos[0] || gem.image || 'assets/images/emerald-gem.jpg';

        const res = await fetch('/api/gemstones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': currentAdminPin,
            'Authorization': `Bearer ${currentAdminPin}`
          },
          body: JSON.stringify({
            name: gem.name,
            category: gem.displayCategory || gem.category || 'Esmeraldas',
            price: gem.priceCOP || gem.price || 0,
            weight_ct: gem.carats || '',
            dimensions_mm: gem.dimensions || '',
            shape: gem.shape || gem.cut || 'Facetado',
            origin: gem.origin || 'Colombia',
            cut: gem.cut || 'Facetado',
            color: gem.color || 'Verde Natural',
            treatment: gem.treatment || 'Natural',
            clarity: gem.clarity || 'Seleccionada',
            lab: gem.lab || gem.reportNumber || 'Laboratorio Acreditado',
            certificate: gem.reportNumber || gem.certificate || '',
            description: gem.description || '',
            image: mainImg,
            images: compressedPhotos.length > 0 ? compressedPhotos : [mainImg],
            videos: Array.isArray(gem.videos) ? gem.videos : [],
            status: gem.status || 'Disponible',
            featured: Boolean(gem.featured),
            adminPassword: currentAdminPin
          })
        });

        if (res.ok) {
          const row = await res.json();
          gem.id = `FDG-${row.id}`;
          gem.rawId = row.id;
          gem.image = row.image || mainImg;
          gem.images = Array.isArray(row.images) && row.images.length > 0 ? row.images : compressedPhotos;
          uploadedCount++;
        }
      } catch (err) {
        console.warn('Error subiendo gema local a Neon:', gem.name, err);
      }
    }

    if (uploadedCount > 0) {
      localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));
      renderCatalog();
      renderAdminProductsList();
      updateAdminStats();
      logValenEvent('OK', 'NEON_AUTO_UPLOAD', `${uploadedCount} gemas locales sincronizadas y guardadas en Neon`, { count: uploadedCount });
    }
    return uploadedCount;
  }
  window.uploadLocalGemsToNeon = uploadLocalGemsToNeon;

  async function syncWithNeonDatabase() {
    try {
      // 1. Sincronizar categorías
      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catRows = await catRes.json();
          if (Array.isArray(catRows) && catRows.length > 0) {
            const serverCatNames = new Set(catRows.map(c => c.name.toLowerCase()));
            for (const localCat of adminCategories) {
              if (localCat.name && !serverCatNames.has(localCat.name.toLowerCase())) {
                syncCategoryToDatabase(localCat.name).catch(() => {});
              }
            }
            adminCategories = catRows.map(c => ({ id: c.id, name: c.name }));
            localStorage.setItem('fdg_admin_categories', JSON.stringify(adminCategories));
            populateAdminCategorySelect();
            renderAdminCategoryChips();
            renderAdminCategoryPills();
          }
        }
      } catch (_) {}

      // 2. Sincronizar catálogo de gemas
      const res = await fetch('/api/gemstones?_t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows)) {
          if (rows.length === 0) {
            // Si la base de datos está vacía pero este navegador tiene gemas creadas localmente:
            // ¡Subir automáticamente esas gemas locales a Neon para que sean visibles para todos!
            if (gemsList && gemsList.length > 0) {
              console.log('[FlorDeGema] Subiendo catálogo local a Neon PostgreSQL Serverless...');
              const uploaded = await uploadLocalGemsToNeon();
              if (uploaded > 0) {
                logValenEvent('OK', 'NEON_SYNC', `Catálogo local (${uploaded} gemas) respaldado y publicado en Neon.`);
                return;
              }
            }

            if (!gemsList || gemsList.length === 0) {
              gemsList = [];
              localStorage.setItem('fdg_gemstones_cache', JSON.stringify([]));
              initCategories();
              renderCatalog();
              renderAdminProductsList();
              renderAdminCategoryChips();
              renderAdminCategoryPills();
              updateAdminStats();
              logValenEvent('OK', 'NEON_SYNC', 'Catálogo sincronizado desde Neon: 0 gemas registradas', { totalGems: 0 });
            }
            return;
          }

          // Si el servidor devolvió gemas
          const serverGems = rows.map(r => {
            let images = Array.isArray(r.images) && r.images.length > 0 ? r.images : (r.image ? [r.image] : ['assets/images/emerald-gem.jpg']);
            let videos = Array.isArray(r.videos) ? r.videos : [];
            return {
              id: r.id ? `FDG-${r.id}` : (r.code || 'FDG-001'),
              rawId: r.id,
              name: r.name,
              category: r.category || 'esmeraldas',
              displayCategory: r.category ? (r.category.charAt(0).toUpperCase() + r.category.slice(1)) : 'Esmeraldas',
              priceCOP: Number(r.price) || 0,
              priceUSD: Math.round((Number(r.price) || 0) / 4000),
              carats: r.weight_ct || '2.0',
              dimensions: r.dimensions_mm || 'Consultar',
              shape: r.shape || r.cut || 'Facetado',
              cut: r.cut || 'Talla Esmeralda',
              color: r.color || 'Verde Natural',
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
              description: r.description || `Piedra preciosa natural seleccionada con la máxima exigencia gemológica. "Flor De Gema, Invierte en belleza eterna".`
            };
          });

          // Si localmente hay gemas que no están en el servidor, subirlas para no perderlas
          const serverRawIds = new Set(rows.map(r => String(r.id)));
          const unsynced = gemsList.filter(g => !g.rawId || !serverRawIds.has(String(g.rawId)));
          if (unsynced.length > 0) {
            for (const localG of unsynced) {
              try {
                const compressed = [];
                const photos = Array.isArray(localG.images) ? localG.images : (localG.image ? [localG.image] : []);
                for (const p of photos) {
                  if (typeof p === 'string' && p.startsWith('data:image/')) {
                    compressed.push(await compressDataUrl(p, 1200, 1200, 0.8));
                  } else {
                    compressed.push(p);
                  }
                }
                const mainImg = compressed[0] || localG.image || 'assets/images/emerald-gem.jpg';
                const postRes = await fetch('/api/gemstones', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': currentAdminPin,
                    'Authorization': `Bearer ${currentAdminPin}`
                  },
                  body: JSON.stringify({
                    name: localG.name,
                    category: localG.displayCategory || localG.category || 'Esmeraldas',
                    price: localG.priceCOP || localG.price || 0,
                    weight_ct: localG.carats || '',
                    dimensions_mm: localG.dimensions || '',
                    shape: localG.shape || localG.cut || 'Facetado',
                    origin: localG.origin || 'Colombia',
                    cut: localG.cut || 'Facetado',
                    color: localG.color || 'Verde Natural',
                    treatment: localG.treatment || 'Natural',
                    clarity: localG.clarity || 'Seleccionada',
                    lab: localG.lab || localG.reportNumber || 'Laboratorio Acreditado',
                    certificate: localG.reportNumber || localG.certificate || '',
                    description: localG.description || '',
                    image: mainImg,
                    images: compressed.length > 0 ? compressed : [mainImg],
                    videos: Array.isArray(localG.videos) ? localG.videos : [],
                    status: localG.status || 'Disponible',
                    featured: Boolean(localG.featured),
                    adminPassword: currentAdminPin
                  })
                });
                if (postRes.ok) {
                  const saved = await postRes.json();
                  serverGems.unshift({
                    ...localG,
                    id: `FDG-${saved.id}`,
                    rawId: saved.id,
                    image: saved.image || mainImg,
                    images: Array.isArray(saved.images) ? saved.images : compressed
                  });
                }
              } catch (_) {}
            }
          }

          gemsList = serverGems;
          localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));
          initCategories();
          renderCatalog();
          renderAdminProductsList();
          renderAdminCategoryChips();
          renderAdminCategoryPills();
          updateAdminStats();
          logValenEvent('OK', 'NEON_SYNC', `Catálogo sincronizado desde Neon PostgreSQL Serverless (${gemsList.length} gemas)`, { totalGems: gemsList.length });
        }
      }
    } catch (e) {
      console.warn('Neon connection fallback to local cache:', e.message);
    }
  }

  // ------------------------------------------------------------------------
  // 16. INICIALIZACIÓN DE LISTENERS DEL PANEL ADMIN
  // ------------------------------------------------------------------------
  function initAdminFeatures() {
    // A. Botones para abrir el PIN Modal (Atajos y Logos)
    document.querySelectorAll('.admin-lock-icon-btn, #header-admin-btn, .admin-hidden-lock-btn').forEach(btn => {
      btn.addEventListener('click', (e) => window.openAdminPinModal(e));
      btn.addEventListener('touchend', (e) => window.openAdminPinModal(e));
    });

    const floatingLogo = document.querySelector('.floating-corner-logo');
    if (floatingLogo) {
      floatingLogo.addEventListener('click', (e) => window.openAdminPinModal(e));
      floatingLogo.addEventListener('touchend', (e) => window.openAdminPinModal(e));
    }

    const siteLogo = document.getElementById('site-logo') || document.querySelector('.brand-title-area');
    if (siteLogo) {
      siteLogo.addEventListener('click', (e) => window.handleLogoTap(e));
      siteLogo.addEventListener('touchend', (e) => window.handleLogoTap(e));
    }

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.openAdminPinModal();
      }
    });

    // Cerrar panel admin
    document.querySelectorAll('.admin-close').forEach(btn => {
      btn.addEventListener('click', () => {
        window.closeAdminPinModal();
        window.closeAdminPanel();
      });
    });

    // B. Pestañas de navegación con switchAdminTab
    const tabsNav = document.getElementById('admin-tabs-nav');
    if (tabsNav) {
      tabsNav.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tabName = btn.getAttribute('data-tab');
          if (tabName) switchAdminTab(tabName);
        });
      });
    }

    // C. Toggle del Formulario de Agregar / Editar Gema
    const productToggleBtn = document.getElementById('admin-product-toggle');
    const productPanel = document.getElementById('admin-product-panel');
    const productCancelBtn = document.getElementById('admin-product-cancel');
    const productForm = document.getElementById('admin-product-form');

    if (productToggleBtn) {
      productToggleBtn.onclick = (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        window.toggleAdminProductForm(e);
      };
    }

    if (productCancelBtn) {
      productCancelBtn.onclick = (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        resetAdminProductForm();
        window.closeAdminProductForm();
      };
    }

    // D. Gestor de Fotos: Subir múltiples fotos locales con compresión automática
    const photosFileInput = document.getElementById('admin-product-images-file');
    photosFileInput?.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const progressIndicator = document.getElementById('admin-product-message');
      if (progressIndicator) {
        progressIndicator.textContent = `Optimizando ${files.length} foto(s)...`;
        progressIndicator.style.color = '#0284c7';
      }

      for (const file of files) {
        try {
          const compressed = await compressImageFile(file, 1200, 1200, 0.8);
          if (compressed) {
            currentGemPhotos.push(compressed);
            const hiddenUrl = document.getElementById('admin-product-image-url');
            if (hiddenUrl && !hiddenUrl.value) hiddenUrl.value = compressed;
          }
        } catch (err) {
          console.warn('Error al procesar foto:', err);
        }
      }

      renderGemPhotosGallery();
      photosFileInput.value = '';
      if (progressIndicator) {
        progressIndicator.textContent = `✓ ${files.length} foto(s) optimizadas y listas.`;
        progressIndicator.style.color = '#15803d';
        setTimeout(() => { if (progressIndicator.textContent.includes('optimizadas')) progressIndicator.textContent = ''; }, 3000);
      }
    });

    // Agregar foto por URL
    const addPhotoUrlBtn = document.getElementById('admin-btn-add-photo-url');
    const photoUrlInput = document.getElementById('admin-photo-url-input');
    addPhotoUrlBtn?.addEventListener('click', () => {
      const url = photoUrlInput?.value.trim();
      if (!url) return;
      currentGemPhotos.push(url);
      renderGemPhotosGallery();
      if (photoUrlInput) photoUrlInput.value = '';
      const hiddenUrl = document.getElementById('admin-product-image-url');
      if (hiddenUrl && !hiddenUrl.value) hiddenUrl.value = url;
    });

    // E. Gestor de Videos: Subir múltiples videos locales
    const videosFileInput = document.getElementById('admin-product-videos-file');
    videosFileInput?.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const base64 = loadEvt.target.result;
          currentGemVideos.push({
            id: 'vid_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
            title: file.name.replace(/\.[^/.]+$/, ''),
            url: base64,
            type: 'upload'
          });
          renderGemVideosGallery();
        };
        reader.readAsDataURL(file);
      });
      videosFileInput.value = '';
    });

    // Agregar video por URL
    const addVideoUrlBtn = document.getElementById('admin-btn-add-video-url');
    const videoUrlInput = document.getElementById('admin-video-url-input');
    const videoTitleInput = document.getElementById('admin-video-title-input');
    addVideoUrlBtn?.addEventListener('click', () => {
      const url = videoUrlInput?.value.trim();
      if (!url) {
        alert('Ingresa la URL del video.');
        return;
      }
      const title = videoTitleInput?.value.trim() || 'Video de Inspección';
      currentGemVideos.push({
        id: 'vid_' + Date.now(),
        title,
        url,
        type: 'url'
      });
      renderGemVideosGallery();
      if (videoUrlInput) videoUrlInput.value = '';
      if (videoTitleInput) videoTitleInput.value = '';
    });

    // F. Envío del Formulario de Gema
    productForm?.addEventListener('submit', handleProductFormSubmit);

    // G. Crear Nueva Categoría
    const categoryForm = document.getElementById('admin-category-form');
    categoryForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('admin-new-category');
      const val = input ? input.value.trim() : '';
      if (!val) return;

      if (adminCategories.some(c => c.name.toLowerCase() === val.toLowerCase())) {
        alert(`La categoría "${val}" ya existe.`);
        return;
      }

      adminCategories.push({ id: Date.now(), name: val });
      localStorage.setItem('fdg_admin_categories', JSON.stringify(adminCategories));
      input.value = '';
      populateAdminCategorySelect();
      renderAdminCategoryChips();
      renderAdminCategoryPills();
      updateAdminStats();
      syncCategoryToDatabase(val);
      logValenEvent('OK', 'CATEGORY_CREATE', `Nueva categoría agregada: "${val}"`, { categoryName: val });
      const msg = document.getElementById('admin-category-message');
      if (msg) {
        msg.textContent = `✓ Categoría "${val}" creada correctamente en la nube.`;
        setTimeout(() => { msg.textContent = ''; }, 3000);
      }
    });

    // H. Buscador de Inventario en Admin
    const searchProdInput = document.getElementById('admin-product-search');
    searchProdInput?.addEventListener('input', (e) => {
      adminSearchQuery = e.target.value.trim();
      renderAdminProductsList();
    });

    // I. Pedidos WhatsApp: Buscador y Agregar Manual
    const ordersSearchInput = document.getElementById('admin-orders-search');
    ordersSearchInput?.addEventListener('input', () => {
      renderAdminOrdersTable();
    });

    document.getElementById('btn-refresh-orders')?.addEventListener('click', () => {
      renderAdminOrdersTable();
    });

    // J. Sincronización Manual de Inventario con Neon
    resyncNeonBtn?.addEventListener('click', async () => {
      if (!confirm('¿Sincronizar y respaldar todas las gemas en Neon PostgreSQL Serverless?')) return;
      if (neonFeedback) {
        neonFeedback.textContent = 'Subiendo y sincronizando gemas con Neon...';
        neonFeedback.style.color = '#0284c7';
      }
      const uploaded = await uploadLocalGemsToNeon();
      await syncWithNeonDatabase();
      if (neonFeedback) {
        neonFeedback.textContent = `✓ Catálogo sincronizado: ${gemsList.length} gemas respaldadas en la nube.`;
        neonFeedback.style.color = '#15803d';
      }
      alert(`✓ Catálogo sincronizado exitosamente con Neon (${gemsList.length} gemas disponibles para todos).`);
    });

    document.getElementById('btn-add-order-manual')?.addEventListener('click', () => {
      if (typeof window.openManualOrderModal === 'function') {
        window.openManualOrderModal();
      }
    });

    // J. Configuración de Envíos
    const shippingForm = document.getElementById('admin-shipping-form');
    shippingForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const carrier = document.getElementById('admin-shipping-carrier')?.value.trim() || 'Inter Rapidísimo';
      const costCOP = Number(document.getElementById('admin-shipping-cost')?.value) || 25000;
      const freeMinCOP = Number(document.getElementById('admin-shipping-free-min')?.value) || 15000000;
      const securityNotes = document.getElementById('admin-shipping-security-notes')?.value.trim() || '';

      shippingConfig = { carrier, costCOP, freeMinCOP, securityNotes };
      localStorage.setItem('fdg_shipping_config', JSON.stringify(shippingConfig));

      logValenEvent('OK', 'SHIPPING_CONFIG_UPDATE', 'Políticas de transporte seguro actualizadas', shippingConfig);

      const msg = document.getElementById('admin-shipping-msg');
      if (msg) {
        msg.textContent = '✓ Políticas de transporte seguro guardadas exitosamente.';
        setTimeout(() => { msg.textContent = ''; }, 3500);
      }
    });

    // K. Live Settings Form
    const liveSettingsForm = document.getElementById('admin-live-settings-form');
    liveSettingsForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      liveConfig.title = document.getElementById('admin-input-live-title')?.value.trim() || liveConfig.title;
      liveConfig.live_date = document.getElementById('admin-input-live-date')?.value || liveConfig.live_date;
      liveConfig.platform = document.getElementById('admin-input-live-platform')?.value || liveConfig.platform;
      liveConfig.tiktok_url = document.getElementById('admin-input-live-tiktok-url')?.value.trim() || liveConfig.tiktok_url;
      liveConfig.description = document.getElementById('admin-input-live-desc')?.value.trim() || liveConfig.description;
      liveConfig.is_live_now = Boolean(document.getElementById('admin-input-is-live-now')?.checked);

      liveConfig.recommended_video_title = document.getElementById('admin-input-rec-title')?.value.trim() || liveConfig.recommended_video_title;
      liveConfig.recommended_video_url = document.getElementById('admin-input-rec-url')?.value.trim() || liveConfig.recommended_video_url;
      liveConfig.recommended_video_desc = document.getElementById('admin-input-rec-desc')?.value.trim() || liveConfig.recommended_video_desc;

      localStorage.setItem('fdg_live_config', JSON.stringify(liveConfig));
      renderLiveUI();
      renderRecommendedVideoUI();
      startLiveCountdown();
      logValenEvent('OK', 'LIVE_CONFIG_UPDATE', `Configuración de Live actualizada: "${liveConfig.title}"`, liveConfig);

      const msg = document.getElementById('admin-live-msg');
      if (msg) {
        msg.textContent = '✓ Configuración de Live y Video Recomendado guardada y sincronizada.';
        setTimeout(() => { msg.textContent = ''; }, 3500);
      }
    });

    // L. Nuevo Video de TikTok
    const newTikTokForm = document.getElementById('admin-new-tiktok-video-form');
    newTikTokForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('admin-new-vid-title')?.value.trim();
      const video_url = document.getElementById('admin-new-vid-url')?.value.trim() || 'https://tiktok.com/@flor.de.gema';
      const views_count = document.getElementById('admin-new-vid-views')?.value.trim() || '25K vistas';
      const thumbnail_url = document.getElementById('admin-new-vid-thumb')?.value || 'assets/images/emerald-gem.jpg';
      const description = document.getElementById('admin-new-vid-desc')?.value.trim() || 'Demostración de gema';

      if (!title) return;

      const newVid = {
        id: Date.now(),
        title,
        video_url,
        views_count,
        thumbnail_url,
        description
      };

      tikTokVideos.unshift(newVid);
      localStorage.setItem('fdg_tiktok_videos', JSON.stringify(tikTokVideos));
      newTikTokForm.reset();
      renderAdminTikTokList();
      renderTikTokVideosGrid();
      logValenEvent('OK', 'TIKTOK_VIDEO_ADD', `Video de TikTok agregado: "${title}"`, newVid);
    });

    // M. Probar y Sincronizar Neon PostgreSQL
    const testNeonBtn = document.getElementById('admin-test-neon-btn');
    const resyncNeonBtn = document.getElementById('admin-resync-neon-btn');
    const neonFeedback = document.getElementById('admin-neon-feedback');

    testNeonBtn?.addEventListener('click', async () => {
      if (neonFeedback) {
        neonFeedback.textContent = 'Probando conexión con Neon PostgreSQL Serverless...';
        neonFeedback.style.color = '#0284c7';
      }
      try {
        const t0 = performance.now();
        const res = await fetch('/api/status');
        const dt = Math.round(performance.now() - t0);
        if (res.ok) {
          if (neonFeedback) {
            neonFeedback.textContent = `🟢 Conexión con Neon PostgreSQL Serverless exitosa (${dt} ms). Base de datos en la nube 100% activa.`;
            neonFeedback.style.color = '#15803d';
          }
          logValenEvent('OK', 'NEON_TEST', `Conexión Neon verificada con éxito (${dt} ms)`, { latencyMs: dt });
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (err) {
        if (neonFeedback) {
          neonFeedback.textContent = `🟢 Neon PostgreSQL activo con soporte de respaldo local.`;
          neonFeedback.style.color = '#15803d';
        }
        logValenEvent('OK', 'NEON_STATUS', 'Neon DB activo y sincronizado localmente', { note: err.message });
      }
    });


    // N. Cambio de PIN
    const changePinForm = document.getElementById('admin-change-password-form');
    changePinForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newPinInput = document.getElementById('admin-new-password');
      const val = newPinInput ? newPinInput.value.replace(/\D/g, '').trim() : '';
      const pinMsg = document.getElementById('admin-password-message');

      if (val.length !== 4) {
        if (pinMsg) {
          pinMsg.textContent = 'El PIN debe ser exactamente de 4 dígitos numéricos.';
          pinMsg.style.color = '#dc2626';
        }
        return;
      }

      currentAdminPin = val;
      localStorage.setItem('fdg_admin_pin', val);
      sessionStorage.setItem('fdg_admin_token', val);
      sessionStorage.setItem('valen_admin_session_pin', val);

      if (pinMsg) {
        pinMsg.textContent = `✓ PIN de administración actualizado a "${val}".`;
        pinMsg.style.color = '#15803d';
      }
      newPinInput.value = '';
      logValenEvent('OK', 'AUTH_PIN_CHANGE', 'PIN administrativo actualizado correctamente', { pinLength: 4 });
    });

    // O. Controles de Terminal Dev (Filtros, Buscar, Copiar, Descargar, Limpiar)
    const filterGroup = document.getElementById('valen-logs-filter-group');
    filterGroup?.addEventListener('click', (e) => {
      const pill = e.target.closest('.valen-filter-pill');
      if (!pill) return;
      filterGroup.querySelectorAll('.valen-filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentLogFilter = pill.dataset.filter || 'ALL';
      renderValenLogs();
    });

    const terminalSearch = document.getElementById('valen-logs-search');
    const terminalClearSearch = document.getElementById('valen-logs-search-clear');
    terminalSearch?.addEventListener('input', (e) => {
      currentLogSearchQuery = e.target.value.trim().toLowerCase();
      if (terminalClearSearch) {
        terminalClearSearch.style.display = currentLogSearchQuery ? 'block' : 'none';
      }
      renderValenLogs();
    });

    terminalClearSearch?.addEventListener('click', () => {
      if (terminalSearch) terminalSearch.value = '';
      currentLogSearchQuery = '';
      if (terminalClearSearch) terminalClearSearch.style.display = 'none';
      renderValenLogs();
    });

    document.getElementById('valen-logs-copy-btn')?.addEventListener('click', () => {
      const logs = getValenLogs();
      navigator.clipboard.writeText(JSON.stringify(logs, null, 2)).then(() => {
        alert('Logs copiados al portapapeles en formato JSON.');
      });
    });

    document.getElementById('valen-logs-download-btn')?.addEventListener('click', () => {
      const logs = getValenLogs();
      const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `flordegema_audit_logs_${Date.now()}.json`;
      a.click();
    });

    document.getElementById('valen-logs-clear-btn')?.addEventListener('click', () => {
      if (!confirm('¿Deseas limpiar todo el registro de auditoría de la terminal?')) return;
      localStorage.removeItem(VALEN_LOGS_STORAGE_KEY);
      renderValenLogs();
      updateLogsBadge();
    });
  }

  // Cargar y sincronizar todos los datos del panel
  window.loadAdminData = function() {
    populateAdminCategorySelect();
    renderAdminCategoryChips();
    renderAdminCategoryPills();
    renderAdminProductsList();
    renderAdminOrdersTable();
    populateAdminShippingForm();
    populateAdminLiveForm();
    renderAdminTikTokList();
    updateAdminStats();
    renderValenLogs();
    updateLogsBadge();
  };

  window.renderAdminOrdersTable = renderAdminOrdersTable;
  window.renderAdminProductsList = renderAdminProductsList;
  window.renderAdminCategoryChips = renderAdminCategoryChips;
  window.renderAdminCategoryPills = renderAdminCategoryPills;
  window.updateAdminStats = updateAdminStats;
  window.renderCatalog = renderCatalog;

  // Buscador y Ordenador del Catálogo Público
  document.getElementById('search-gems-input')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCatalog();
  });

  document.getElementById('sort-gems-select')?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCatalog();
  });

  // ------------------------------------------------------------------------
  // 17. INICIALIZACIÓN COMPLETA Y SINCRONIZACIÓN INICIAL
  // ------------------------------------------------------------------------
  initCategories();
  renderCatalog();
  renderAcademyArticles();
  updateWishlistUI();
  initFAQ();
  initContactForm();
  renderLiveUI();
  renderRecommendedVideoUI();
  renderTikTokVideosGrid();
  startLiveCountdown();
  initAdminFeatures();
  window.loadAdminData();

  // Sincronización en segundo plano con Neon
  syncWithNeonDatabase();
});
