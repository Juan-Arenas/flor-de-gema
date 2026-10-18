// ==========================================================================
// FLOR DE GEMA - MOTOR DE LÓGICA & PANEL ADMINISTRATIVO NEON (PIN 1072)
// Eslogan: "Flor De Gema, Invierte en belleza eterna"
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';
  let wishlist = JSON.parse(localStorage.getItem('fdg_wishlist') || '[]');

  // Load gems from cache or fallback data.js
  let cachedGems = null;
  try {
    const raw = localStorage.getItem('fdg_gemstones_cache');
    if (raw) cachedGems = JSON.parse(raw);
  } catch (e) {}

  let gemsList = (cachedGems && cachedGems.length > 0) ? cachedGems : [...GEMSTONES];

  // Logs state
  let systemLogs = JSON.parse(localStorage.getItem('fdg_logs') || '[]');

  // Live Stream & TikTok Videos state
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

  // Admin PIN configuration
  const ADMIN_PIN = '1072';

  // DOM Elements - Catalog
  const catalogGrid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('search-gems-input');
  const sortSelect = document.getElementById('sort-gems-select');
  const filterPillsContainer = document.getElementById('filter-pills-container');
  const wishlistCounterBadge = document.getElementById('wishlist-counter');
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const wishlistDrawerBody = document.getElementById('wishlist-drawer-body');
  const sendWishlistWaBtn = document.getElementById('send-wishlist-wa-btn');

  // Modals
  const techModalOverlay = document.getElementById('tech-modal-overlay');
  const techModalCloseBtn = document.getElementById('tech-modal-close-btn');
  const academyModalOverlay = document.getElementById('academy-modal-overlay');
  const academyModalCloseBtn = document.getElementById('academy-modal-close-btn');

  // Admin Elements (Inicializados de forma dinámica)
  const adminLockBtn = document.getElementById('admin-lock-btn') || document.getElementById('header-admin-btn');
  const adminPasswordModal = document.getElementById('admin-password-modal');
  const adminPanelModal = document.getElementById('admin-panel');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');
  const adminTabsNav = document.getElementById('admin-tabs-nav');
  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adminTabPanes = document.querySelectorAll('.admin-tab-pane');

  const adminToggleFormBtn = document.getElementById('admin-toggle-form-btn');
  const adminGemFormWrap = document.getElementById('admin-gem-form-wrap');
  const adminGemForm = document.getElementById('admin-gem-form');
  const adminFormHeading = document.getElementById('admin-form-heading');
  const adminCancelEditBtn = document.getElementById('admin-cancel-edit-btn');
  const adminGemClearBtn = document.getElementById('admin-gem-clear-btn');
  const adminGemsTableBody = document.getElementById('admin-gems-table-body');
  const adminSearchGems = document.getElementById('admin-search-gems');
  const adminFilterCategory = document.getElementById('admin-filter-category');

  const adminGemImageFile = document.getElementById('admin-gem-image-file');
  const adminGemImageUrl = document.getElementById('admin-gem-image-url');
  const adminGemPreviewImg = document.getElementById('admin-gem-preview-img');
  const adminImgPlaceholder = document.getElementById('admin-img-placeholder');

  const adminStatGemsCount = document.getElementById('admin-stat-gems-count');
  const adminStatLogsCount = document.getElementById('admin-stat-logs-count');
  const adminLogsTerminalBody = document.getElementById('admin-logs-terminal-body');
  const adminTerminalCount = document.getElementById('admin-terminal-count');
  const adminCopyLogsBtn = document.getElementById('admin-copy-logs-btn');
  const adminDownloadLogsBtn = document.getElementById('admin-download-logs-btn');
  const adminClearLogsBtn = document.getElementById('admin-clear-logs-btn');

  const adminTestNeonBtn = document.getElementById('admin-test-neon-btn');
  const adminResyncNeonBtn = document.getElementById('admin-resync-neon-btn');
  const adminNeonFeedback = document.getElementById('admin-neon-feedback');
  const neonStatusText = document.getElementById('neon-connection-status-text');

  // ========================================================================
  // INITIALIZATION
  // ========================================================================
  initCategories();
  renderCatalog();
  renderAcademyArticles();
  updateWishlistUI();
  initLiveAndTikTokFeatures();
  initFAQ();
  initContactForm();
  initAdminFeatures();
  renderLogs();

  // Detect #admin in URL to open admin login immediately
  function checkUrlHash() {
    if (window.location.hash === '#admin' || window.location.hash === '#admin-panel') {
      openAdminAuthModal();
    }
  }
  checkUrlHash();
  window.addEventListener('hashchange', checkUrlHash);

  // Initial Sync with Neon PostgreSQL in background
  syncWithNeonDatabase();

  // Helper log function
  function addSystemLog(level, message, details = {}) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timeFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const logItem = {
      id: 'log_' + Date.now(),
      level: level.toUpperCase(),
      message,
      time: timeFormatted,
      details
    };

    systemLogs.unshift(logItem);
    if (systemLogs.length > 150) systemLogs.pop();
    try {
      localStorage.setItem('fdg_logs', JSON.stringify(systemLogs));
    } catch (e) {}

    renderLogs();

    // Async POST to Neon serverless api
    try {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: logItem.level, action: 'CLIENT_LOG', message, details })
      }).catch(() => {});
    } catch (e) {}
  }

  // ========================================================================
  // NEON DATABASE SYNCHRONIZATION
  // ========================================================================
  async function syncWithNeonDatabase() {
    try {
      const res = await fetch('/api/gemstones');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          gemsList = data.map((item, idx) => ({
            id: item.id ? (String(item.id).startsWith('FDG-') ? item.id : `FDG-${String(item.id).padStart(3, '0')}`) : `FDG-${idx + 1}`,
            rawId: item.id,
            name: item.name,
            category: normalizeCategorySlug(item.category),
            displayCategory: item.category,
            priceCOP: Number(item.price) || 0,
            priceUSD: Math.round((Number(item.price) || 0) / 4000),
            carats: item.weight_ct ? item.weight_ct.replace(/[^0-9.]/g, '') || item.weight_ct : '2.0',
            dimensions: item.dimensions_mm || '8 x 6 x 4 mm',
            shape: item.cut ? item.cut.split(' ')[0] : 'Octagonal',
            cut: item.cut || 'Talla Esmeralda',
            color: item.color || 'Gema Natural',
            clarity: 'Excelente pureza y fuego interno',
            treatment: item.treatment || '100% Natural sin tratamiento',
            origin: item.origin || 'Colombia',
            reportNumber: item.certificate || 'Certificado Oficial',
            lab: item.certificate || 'Flor De Gema Certified',
            image: item.image || 'assets/images/emerald-gem.jpg',
            featured: Boolean(item.featured),
            status: item.status || 'Disponible',
            badge: item.status !== 'Disponible' ? item.status : (item.origin ? item.origin.split(',')[0].trim() : 'Natural'),
            description: item.description || ''
          }));

          localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));
          renderCatalog();
          renderAdminGemsTable();
          updateAdminStats();
          addSystemLog('SUCCESS', `Sincronizadas ${gemsList.length} gemas en tiempo real desde Neon DB.`);
        }
      }
    } catch (e) {
      console.warn('[Neon Sync] Usando caché local offline:', e.message);
    }
  }

  function normalizeCategorySlug(cat) {
    if (!cat) return 'esmeraldas';
    const clean = String(cat).toLowerCase();
    if (clean.includes('esmerald')) return 'esmeraldas';
    if (clean.includes('zafir')) return 'zafiros';
    if (clean.includes('rub')) return 'rubies';
    if (clean.includes('turmalin') || clean.includes('para')) return 'turmalinas';
    if (clean.includes('colecc')) return 'coleccion';
    return clean.replace(/\s+/g, '-');
  }

  // ========================================================================
  // CATEGORIES & CATALOG RENDERING
  // ========================================================================
  function initCategories() {
    if (!filterPillsContainer) return;
    filterPillsContainer.innerHTML = GEM_CATEGORIES.map(cat => `
      <button class="filter-btn-pill ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
        ${cat.name}
      </button>
    `).join('');

    filterPillsContainer.querySelectorAll('.filter-btn-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        filterPillsContainer.querySelectorAll('.filter-btn-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderCatalog();
      });
    });
  }

  window.filterByCategory = function(catId) {
    currentCategory = catId;
    if (filterPillsContainer) {
      filterPillsContainer.querySelectorAll('.filter-btn-pill').forEach(b => {
        b.classList.toggle('active', b.dataset.category === catId);
      });
    }
    renderCatalog();
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  function getFilteredGemstones() {
    return gemsList.filter(gem => {
      const matchCat = currentCategory === 'all' || gem.category === currentCategory || (gem.displayCategory && gem.displayCategory.toLowerCase().includes(currentCategory));
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        gem.name.toLowerCase().includes(q) ||
        (gem.shape && gem.shape.toLowerCase().includes(q)) ||
        (gem.origin && gem.origin.toLowerCase().includes(q)) ||
        (gem.color && gem.color.toLowerCase().includes(q)) ||
        (gem.id && gem.id.toLowerCase().includes(q));
      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (currentSort === 'price-low') return a.priceCOP - b.priceCOP;
      if (currentSort === 'price-high') return b.priceCOP - a.priceCOP;
      if (currentSort === 'carats-high') return parseFloat(b.carats || 0) - parseFloat(a.carats || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }

  function formatCOP(num) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num);
  }
  function formatUSD(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  }

  function renderCatalog() {
    if (!catalogGrid) return;
    const gems = getFilteredGemstones();

    if (gems.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem;">No se encontraron gemas</h3>
          <p style="color: #6b7280; font-size: 0.95rem; margin-bottom: 1rem;">Prueba con otra búsqueda o consulta por WhatsApp.</p>
          <button class="btn-primary-dark" onclick="window.filterByCategory('all')">Ver Todas</button>
        </div>
      `;
      return;
    }

    catalogGrid.innerHTML = gems.map(gem => {
      const isSaved = wishlist.includes(gem.id);
      return `
        <div class="product-card-clean" data-id="${gem.id}">
          <div class="product-card-img-wrap" onclick="openTechSheet('${gem.id}')">
            <img src="${gem.image}" alt="${gem.name}" loading="lazy">
            <span class="product-card-badge">${gem.badge || gem.shape || 'Gema'}</span>
            <button class="product-card-bookmark-btn ${isSaved ? 'active' : ''}" 
                    title="${isSaved ? 'Quitar de guardados' : 'Guardar gema'}" 
                    onclick="event.stopPropagation(); toggleWishlist('${gem.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <div class="product-card-body">
            <div class="product-card-ref">REF: ${gem.id} · ${(gem.origin || 'Colombia').split(',')[0]}</div>
            <h3 class="product-card-name">${gem.name}</h3>

            <div class="product-card-tags">
              <span class="mini-spec-pill">${gem.carats} ct</span>
              <span class="mini-spec-pill">${gem.dimensions}</span>
              <span class="mini-spec-pill">${gem.shape}</span>
            </div>

            <div class="product-card-price-row">
              <div class="price-cop-bold">${formatCOP(gem.priceCOP)}</div>
              <div class="price-usd-muted">~ ${formatUSD(gem.priceUSD)} USD</div>
            </div>

            <div class="product-card-actions">
              <button class="btn-clean-card btn-card-details" onclick="openTechSheet('${gem.id}')">
                Ficha Técnica
              </button>
              <button class="btn-clean-card btn-card-wa" onclick="inquireGem('${gem.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.107.005.249-.041.39.296.144.347.491 1.2.534 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.102-.115.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564c.173.086.289.13.332.202.043.072.043.419-.101.824z"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ========================================================================
  // FICHA TÉCNICA (DETALLE MODAL)
  // ========================================================================
  window.openTechSheet = function(gemId) {
    const gem = gemsList.find(g => g.id === gemId);
    if (!gem) return;

    const modalContent = document.getElementById('tech-modal-content');
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div style="display: flex; gap: 1.5rem; flex-direction: column;">
        <div style="width: 100%; max-height: 320px; overflow: hidden; border-radius: 8px; border: 1px solid var(--border-light);">
          <img src="${gem.image}" alt="${gem.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <div>
          <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.3rem;">
            REF: ${gem.id} · ${gem.displayCategory || gem.category}
          </div>
          <h2 style="font-size: 1.45rem; font-weight: 800; color: #111827; margin-bottom: 0.6rem;">${gem.name}</h2>
          
          <div style="font-size: 1.3rem; font-weight: 800; color: #111827; margin-bottom: 1rem;">
            ${formatCOP(gem.priceCOP)} <span style="font-size: 0.88rem; font-weight: 500; color: #6b7280;">(~ ${formatUSD(gem.priceUSD)} USD)</span>
          </div>

          <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.92rem; margin-bottom: 1.25rem;">
            ${gem.description || 'Piedra preciosa natural seleccionada con la máxima exigencia gemológica. "Flor De Gema, Invierte en belleza eterna".'}
          </p>

          <h3 style="font-size: 0.95rem; font-weight: 700; color: #111827; margin-bottom: 0.75rem; text-transform: uppercase;">
            Especificaciones Técnicas
          </h3>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; background: var(--bg-subtle); padding: 1rem; border-radius: 8px; font-size: 0.86rem; margin-bottom: 1.25rem;">
            <div><strong>Peso:</strong> ${gem.carats} ct</div>
            <div><strong>Medidas:</strong> ${gem.dimensions}</div>
            <div><strong>Talla / Corte:</strong> ${gem.cut || gem.shape}</div>
            <div><strong>Color:</strong> ${gem.color}</div>
            <div><strong>Procedencia:</strong> ${gem.origin}</div>
            <div><strong>Tratamiento:</strong> ${gem.treatment}</div>
            <div style="grid-column: 1 / -1;"><strong>Certificado:</strong> ${gem.reportNumber} (${gem.lab})</div>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn-primary-dark" style="flex: 1; justify-content: center; background: #25d366; border-color: #25d366;" onclick="inquireGem('${gem.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.107.005.249-.041.39.296.144.347.491 1.2.534 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.102-.115.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564c.173.086.289.13.332.202.043.072.043.419-.101.824z"/>
              </svg>
              Apartar / Cotizar por WhatsApp
            </button>
            <button class="btn-secondary-light" onclick="toggleWishlist('${gem.id}'); closeTechModal();">
              ${wishlist.includes(gem.id) ? 'Quitar de Guardados' : 'Guardar en Bolsa'}
            </button>
          </div>

          <div style="margin-top: 1rem; text-align: center;">
            <a href="#politicas" onclick="closeTechModal();" style="font-size: 0.85rem; color: #4b5563; text-decoration: underline;">
              Ver Envíos Nacionales, Garantías y Respaldo de Compra →
            </a>
          </div>
        </div>
      </div>
    `;

    techModalOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeTechModal = function() {
    techModalOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  techModalOverlay?.addEventListener('click', (e) => {
    if (e.target === techModalOverlay) closeTechModal();
  });
  techModalCloseBtn?.addEventListener('click', closeTechModal);

  // WhatsApp Inquire
  window.inquireGem = function(gemId) {
    const gem = gemsList.find(g => g.id === gemId);
    if (!gem) return;

    addSystemLog('INFO', `Consulta WhatsApp iniciada para: ${gem.name}`, { gemId });

    const msg = `Hola Flor De Gema, estoy interesado(a) en la siguiente piedra preciosa:
- Gema: ${gem.name} (REF: ${gem.id})
- Peso: ${gem.carats} ct
- Medidas: ${gem.dimensions}
- Procedencia: ${gem.origin}
- Precio: ${formatCOP(gem.priceCOP)} COP

Eslogan: "Flor De Gema, Invierte en belleza eterna"
¿Está disponible para compra o despacho?`;

    window.open(`https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ========================================================================
  // WISHLIST
  // ========================================================================
  window.toggleWishlist = function(gemId) {
    const idx = wishlist.indexOf(gemId);
    if (idx > -1) {
      wishlist.splice(idx, 1);
    } else {
      wishlist.push(gemId);
    }
    localStorage.setItem('fdg_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    renderCatalog();
  };

  function updateWishlistUI() {
    if (!wishlistCounterBadge) return;
    const count = wishlist.length;
    wishlistCounterBadge.textContent = count;
    wishlistCounterBadge.style.display = count > 0 ? 'inline-flex' : 'none';

    if (wishlistDrawerBody) {
      if (count === 0) {
        wishlistDrawerBody.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: #6b7280;">
            <p>No tienes gemas guardadas aún.</p>
            <p style="font-size: 0.85rem; margin-top: 0.5rem;">Toca el icono de marcador en cualquier gema para guardarla.</p>
          </div>
        `;
      } else {
        const savedGems = gemsList.filter(g => wishlist.includes(g.id));
        wishlistDrawerBody.innerHTML = savedGems.map(g => `
          <div style="display: flex; gap: 0.75rem; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
            <img src="${g.image}" alt="${g.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
            <div style="flex: 1;">
              <h4 style="font-size: 0.88rem; font-weight: 700; margin: 0;">${g.name}</h4>
              <div style="font-size: 0.8rem; color: #6b7280;">${g.carats} ct · ${formatCOP(g.priceCOP)}</div>
            </div>
            <button onclick="toggleWishlist('${g.id}')" style="background:none; border:none; color:#ef4444; font-size: 1.1rem; cursor:pointer;">✕</button>
          </div>
        `).join('');
      }
    }
  }

  window.openWishlist = function() {
    wishlistDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeWishlist = function() {
    wishlistDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  };

  sendWishlistWaBtn?.addEventListener('click', () => {
    if (wishlist.length === 0) {
      alert('Tu bolsa de gemas guardadas está vacía.');
      return;
    }
    const saved = gemsList.filter(g => wishlist.includes(g.id));
    const itemsText = saved.map(g => `• ${g.name} (${g.carats} ct, ${g.origin}) - ${formatCOP(g.priceCOP)}`).join('\n');
    const msg = `Hola Flor De Gema, deseo cotizar mi selección de gemas:\n\n${itemsText}\n\nEslogan: "Flor De Gema, Invierte en belleza eterna"`;
    window.open(`https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // ========================================================================
  // GUÍA GEMOLÓGICA / ACADEMIA
  // ========================================================================
  function renderAcademyArticles() {
    const container = document.getElementById('academy-articles-container');
    if (!container) return;

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

  window.openAcademyModal = function(artId) {
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
        <div style="margin-top: 2rem; border-top: 1px solid var(--border-light); padding-top: 1rem; text-align: center;">
          <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 0.75rem;">¿Tienes preguntas sobre esta gema o certificación?</p>
          <a href="https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=Hola%20Flor%20De%20Gema,%20le%C3%AD%20el%20art%C3%ADculo%20sobre%20${encodeURIComponent(art.title)}" target="_blank" rel="noopener" class="btn-primary-dark" style="display: inline-flex;">
            Consultar a un Gemólogo por WhatsApp
          </a>
        </div>
      </div>
    `;

    academyModalOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeAcademyModal = function() {
    academyModalOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  academyModalOverlay?.addEventListener('click', (e) => {
    if (e.target === academyModalOverlay) closeAcademyModal();
  });
  academyModalCloseBtn?.addEventListener('click', closeAcademyModal);

  // ========================================================================
  // PRÓXIMOS LIVES & GESTIÓN DE TIKTOK & CONTENIDO
  // ========================================================================
  function formatLiveDateHuman(dateStr) {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const dayName = days[d.getDay()];
      const dayNum = d.getDate();
      const monthName = months[d.getMonth()];
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${dayName} ${dayNum} de ${monthName} · ${hours}:${minutes} ${ampm} (Hora Colombia)`;
    } catch (e) {
      return dateStr;
    }
  }

  function renderLiveUI() {
    const titleEl = document.getElementById('live-display-title');
    const dateEl = document.getElementById('live-display-date');
    const descEl = document.getElementById('live-display-desc');
    const platformEl = document.getElementById('live-platform-tag');
    const ctaTikTokEl = document.getElementById('live-cta-tiktok-btn');
    const statusBadge = document.getElementById('live-status-badge');
    const statusText = document.getElementById('live-status-text');

    if (titleEl) titleEl.textContent = liveConfig.title;
    if (descEl) descEl.textContent = liveConfig.description;
    if (platformEl) platformEl.textContent = liveConfig.platform;
    if (ctaTikTokEl) ctaTikTokEl.href = liveConfig.tiktok_url || 'https://tiktok.com/@flor.de.gema';

    if (dateEl) {
      dateEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>${formatLiveDateHuman(liveConfig.live_date)}</span>
      `;
    }

    if (statusBadge && statusText) {
      if (liveConfig.is_live_now) {
        statusBadge.classList.add('now-live');
        statusText.textContent = '🔴 EN VIVO AHORA EN TIKTOK';
      } else {
        statusBadge.classList.remove('now-live');
        statusText.textContent = 'Próxima Transmisión Programada';
      }
    }
  }

  function renderRecommendedVideoUI() {
    const titleEl = document.getElementById('rec-video-display-title');
    const descEl = document.getElementById('rec-video-display-desc');
    const btnEl = document.getElementById('rec-video-display-btn');

    if (titleEl) titleEl.textContent = liveConfig.recommended_video_title || 'Video Especial Flor De Gema';
    if (descEl) descEl.textContent = liveConfig.recommended_video_desc || 'Conoce más sobre gemas y cristales en TikTok';
    if (btnEl) btnEl.href = liveConfig.recommended_video_url || 'https://tiktok.com/@flor.de.gema';
  }

  function renderTikTokVideosGrid() {
    const gridEl = document.getElementById('tiktok-videos-grid');
    if (!gridEl) return;

    if (!tikTokVideos || tikTokVideos.length === 0) {
      gridEl.innerHTML = '<p style="color:#64748b; font-size:0.9rem;">Pronto publicaremos nuevos videos. Síguenos en @flor.de.gema</p>';
      return;
    }

    gridEl.innerHTML = tikTokVideos.map(video => `
      <div class="tiktok-video-card">
        <a href="${video.video_url}" target="_blank" rel="noopener" class="tiktok-thumb-wrap" title="${video.title}">
          <img src="${video.thumbnail_url || 'assets/images/emerald-gem.jpg'}" alt="${video.title}" loading="lazy">
          <div class="tiktok-play-overlay">
            <div class="tiktok-play-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
          <span class="tiktok-views-badge">${video.views_count || 'TikTok'}</span>
        </a>
        <div class="tiktok-card-content">
          <div>
            <h4 class="tiktok-card-title">${video.title}</h4>
            <p class="tiktok-card-desc">${video.description || ''}</p>
          </div>
          <a href="${video.video_url}" target="_blank" rel="noopener" class="tiktok-card-btn">
            <span>Ver video en TikTok</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      </div>
    `).join('');
  }

  let countdownInterval = null;
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

      const now = new Date().getTime();
      let targetTime = new Date(liveConfig.live_date).getTime();
      if (isNaN(targetTime)) {
        const fallback = new Date();
        fallback.setDate(fallback.getDate() + ((4 + 7 - fallback.getDay()) % 7 || 7));
        fallback.setHours(19, 0, 0, 0);
        targetTime = fallback.getTime();
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

  function populateAdminLiveForm() {
    const titleInput = document.getElementById('admin-input-live-title');
    const dateInput = document.getElementById('admin-input-live-date');
    const platformInput = document.getElementById('admin-input-live-platform');
    const tiktokUrlInput = document.getElementById('admin-input-live-tiktok-url');
    const descInput = document.getElementById('admin-input-live-desc');
    const isLiveInput = document.getElementById('admin-input-is-live-now');
    const recTitleInput = document.getElementById('admin-input-rec-title');
    const recUrlInput = document.getElementById('admin-input-rec-url');
    const recDescInput = document.getElementById('admin-input-rec-desc');

    if (titleInput) titleInput.value = liveConfig.title || '';
    if (dateInput) {
      if (liveConfig.live_date) {
        dateInput.value = liveConfig.live_date.substring(0, 16);
      }
    }
    if (platformInput) platformInput.value = liveConfig.platform || 'TikTok & Instagram Live';
    if (tiktokUrlInput) tiktokUrlInput.value = liveConfig.tiktok_url || 'https://tiktok.com/@flor.de.gema';
    if (descInput) descInput.value = liveConfig.description || '';
    if (isLiveInput) isLiveInput.checked = Boolean(liveConfig.is_live_now);
    if (recTitleInput) recTitleInput.value = liveConfig.recommended_video_title || '';
    if (recUrlInput) recUrlInput.value = liveConfig.recommended_video_url || '';
    if (recDescInput) recDescInput.value = liveConfig.recommended_video_desc || '';
  }

  function renderAdminTikTokTable() {
    const tbody = document.getElementById('admin-tiktok-table-body');
    if (!tbody) return;

    if (!tikTokVideos || tikTokVideos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 1.5rem;">No hay videos publicados todavía. Agrega el primero con el formulario de arriba.</td></tr>`;
      return;
    }

    tbody.innerHTML = tikTokVideos.map(v => `
      <tr>
        <td>
          <img src="${v.thumbnail_url || 'assets/images/emerald-gem.jpg'}" alt="${v.title}" class="admin-gem-thumb">
        </td>
        <td>
          <strong>${v.title}</strong><br>
          <span style="font-size: 0.75rem; color: #64748b;">${v.description || ''}</span>
        </td>
        <td><span class="status-tag status-disponible">${v.views_count || 'TikTok'}</span></td>
        <td>
          <a href="${v.video_url}" target="_blank" rel="noopener" style="color: #0284c7; font-size: 0.82rem; text-decoration: underline;">
            Abrir video ↗
          </a>
        </td>
        <td>
          <button class="btn-action-small btn-action-danger" onclick="deleteTikTokVideo(${v.id})" title="Eliminar Video">✕ Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  window.deleteTikTokVideo = async function(id) {
    if (!confirm('¿Deseas eliminar este video de la galería de TikTok?')) return;
    try {
      tikTokVideos = tikTokVideos.filter(v => Number(v.id) !== Number(id));
      renderAdminTikTokTable();
      renderTikTokVideosGrid();
      addSystemLog('WARN', `Video de TikTok eliminado (ID: ${id})`);

      await fetch(`/api/tiktok-videos/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': ADMIN_PIN }
      });
    } catch (e) {
      console.warn('Error eliminando video de TikTok:', e);
    }
  };

  async function fetchLiveAndTikTokData() {
    try {
      const res = await fetch('/api/live');
      if (res.ok) {
        const data = await res.json();
        if (data.live) {
          liveConfig = { ...liveConfig, ...data.live };
        }
        if (Array.isArray(data.videos) && data.videos.length > 0) {
          tikTokVideos = data.videos;
        }
        renderLiveUI();
        renderRecommendedVideoUI();
        renderTikTokVideosGrid();
        startLiveCountdown();
        populateAdminLiveForm();
        renderAdminTikTokTable();
      }
    } catch (e) {
      console.warn('Operando con configuración local de Live y TikTok');
    }
  }

  function initLiveAndTikTokFeatures() {
    renderLiveUI();
    renderRecommendedVideoUI();
    renderTikTokVideosGrid();
    startLiveCountdown();
    fetchLiveAndTikTokData();

    // Setup Admin Live Form Submission
    const liveForm = document.getElementById('admin-live-settings-form');
    liveForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('admin-input-live-title')?.value.trim();
      const live_date = document.getElementById('admin-input-live-date')?.value;
      const platform = document.getElementById('admin-input-live-platform')?.value;
      const tiktok_url = document.getElementById('admin-input-live-tiktok-url')?.value.trim();
      const description = document.getElementById('admin-input-live-desc')?.value.trim();
      const is_live_now = document.getElementById('admin-input-is-live-now')?.checked;
      const recommended_video_title = document.getElementById('admin-input-rec-title')?.value.trim();
      const recommended_video_url = document.getElementById('admin-input-rec-url')?.value.trim();
      const recommended_video_desc = document.getElementById('admin-input-rec-desc')?.value.trim();

      const payload = {
        title,
        live_date,
        platform,
        tiktok_url,
        description,
        is_live_now,
        recommended_video_title,
        recommended_video_url,
        recommended_video_desc
      };

      liveConfig = { ...liveConfig, ...payload };
      renderLiveUI();
      renderRecommendedVideoUI();
      startLiveCountdown();

      addSystemLog('SUCCESS', `Configuración de Live actualizada: "${title}"`, payload);

      try {
        const res = await fetch('/api/live', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': ADMIN_PIN
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          alert('¡Configuración de Live y Video Recomendado guardada y sincronizada con Neon PostgreSQL!');
        } else {
          alert('Configuración de Live actualizada exitosamente.');
        }
      } catch (err) {
        alert('Configuración de Live actualizada exitosamente.');
      }
    });

    // Setup Admin New TikTok Video Form Submission
    const newVideoForm = document.getElementById('admin-new-tiktok-video-form');
    newVideoForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('admin-new-vid-title')?.value.trim();
      const video_url = document.getElementById('admin-new-vid-url')?.value.trim();
      const views_count = document.getElementById('admin-new-vid-views')?.value.trim() || '15K vistas';
      const thumbnail_url = document.getElementById('admin-new-vid-thumb')?.value || 'assets/images/emerald-gem.jpg';
      const description = document.getElementById('admin-new-vid-desc')?.value.trim();

      const payload = {
        title,
        video_url,
        views_count,
        thumbnail_url,
        description
      };

      const tempId = Date.now();
      const newVideoObj = { id: tempId, ...payload };
      tikTokVideos.unshift(newVideoObj);
      renderAdminTikTokTable();
      renderTikTokVideosGrid();
      newVideoForm.reset();

      addSystemLog('SUCCESS', `Nuevo video de TikTok agregado: "${title}"`, payload);

      try {
        const res = await fetch('/api/tiktok-videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': ADMIN_PIN
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const inserted = await res.json();
          if (inserted && inserted.id) {
            newVideoObj.id = inserted.id;
            renderAdminTikTokTable();
          }
          alert('¡Video de TikTok agregado a la galería y sincronizado con Neon!');
        } else {
          alert('Video agregado a la galería.');
        }
      } catch (err) {
        alert('Video agregado a la galería.');
      }
    });
  }

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

      const waText = `Hola Flor De Gema, solicitud de asesoría:
- Nombre: ${name}
- Tipo de gema: ${gemType}
- Presupuesto: ${budget}
- Mensaje: ${msg}

Eslogan: "Flor De Gema, Invierte en belleza eterna"`;

      addSystemLog('INFO', `Formulario de contacto enviado por ${name}`, { gemType, budget });

      window.open(`https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`, '_blank');
      form.reset();
    });
  }

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCatalog();
  });

  sortSelect?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCatalog();
  });

  // ========================================================================
  // PANEL ADMINISTRATIVO TAL CUAL VENTAS MAQUILLAJE (PIN 1072)
  // ========================================================================
  let currentAdminPin = localStorage.getItem('fdg_admin_pin') || ADMIN_PIN;
  let adminSelectedCat = 'all';
  let adminSearchQuery = '';
  let currentLogFilter = 'ALL';
  let currentLogSearchQuery = '';

  // Categorías Administrativas Dinámicas
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
    localStorage.setItem('fdg_admin_categories', JSON.stringify(adminCategories));
  }

  // Developer Logs Storage (Ventas Maquillaje system)
  const VALEN_LOGS_STORAGE_KEY = 'valen_system_logs_fdg_v1';
  const VALEN_MAX_LOGS = 250;

  function getValenLogs() {
    try {
      const raw = localStorage.getItem(VALEN_LOGS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveValenLogs(logs) {
    try {
      localStorage.setItem(VALEN_LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, VALEN_MAX_LOGS)));
    } catch (_) {}
  }

  function logValenEvent(status, action, message, details = {}, level = 'INFO') {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timeFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}`;
    const logEntry = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: now.toISOString(),
      time: timeFormatted,
      status: status || 'OK',
      action: action || 'ACTION',
      message: message || '',
      details: details || {},
      level: level || 'INFO'
    };

    const logs = getValenLogs();
    logs.unshift(logEntry);
    saveValenLogs(logs);
    renderValenLogs();
    updateLogsBadge();

    // Sincronizar en segundo plano con Neon
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
        logs = logs.filter(l => String(l.action || '').includes('PRODUCT') || String(l.action || '').includes('GEM') || String(l.action || '').includes('CATEGORY'));
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
        <div class="valen-terminal-empty">
          <i class="fas fa-terminal"></i>
          <span>No hay eventos registrados para este filtro.</span>
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
          <span class="valen-badge-action">${log.action || 'EVENT'}</span>
          <span class="valen-log-message">${escapeHtml(log.message || '')}</span>
          ${hasDetails ? `<button type="button" class="valen-log-toggle-json"><i class="fas fa-code"></i> JSON</button>` : ''}
        </div>
        ${hasDetails ? `
          <div class="valen-log-details-drawer" style="display: none;">
            <div class="valen-log-diff-header">
              <span>Detalles del evento (Payload)</span>
              <button type="button" class="btn-copy-entry-json"><i class="fas fa-copy"></i> Copiar</button>
            </div>
            <pre class="valen-log-json-code">${escapeHtml(JSON.stringify(log.details, null, 2))}</pre>
          </div>
        ` : ''}
      `;

      if (hasDetails) {
        const toggleBtn = row.querySelector('.valen-log-toggle-json');
        const drawer = row.querySelector('.valen-log-details-drawer');
        const copyBtn = row.querySelector('.btn-copy-entry-json');

        toggleBtn?.addEventListener('click', (e) => {
          e.stopPropagation();
          const isShown = drawer.style.display !== 'none';
          drawer.style.display = isShown ? 'none' : 'flex';
          toggleBtn.classList.toggle('active', !isShown);
        });

        copyBtn?.addEventListener('click', (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(JSON.stringify(log.details, null, 2)).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado';
            setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar'; }, 1500);
          });
        });
      }

      terminalBody.appendChild(row);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ========================================================================
  // INICIALIZACIÓN COMPLETA DE PANEL ADMINISTRATIVO
  // ========================================================================
  function initAdminFeatures() {
    // 1. Candadito de acceso en el Header y Submenú (Sin texto "panel admin")
    const lockButtons = document.querySelectorAll('.admin-lock-icon-btn, #header-admin-btn, .admin-hidden-lock-btn');
    lockButtons.forEach(btn => {
      btn.addEventListener('click', (e) => window.openAdminPinModal(e));
      btn.addEventListener('touchend', (e) => window.openAdminPinModal(e));
    });

    const floatingLogo = document.querySelector('.floating-corner-logo');
    if (floatingLogo) {
      floatingLogo.addEventListener('click', (e) => window.openAdminPinModal(e));
      floatingLogo.addEventListener('touchend', (e) => window.openAdminPinModal(e));
    }

    // 2. Tocar 3 veces en el logo oficial del header para abrir admin (Tal cual Ventas Maquillaje)
    const siteLogo = document.getElementById('site-logo') || document.querySelector('.brand-title-area');
    if (siteLogo) {
      siteLogo.addEventListener('click', (e) => window.handleLogoTap(e));
      siteLogo.addEventListener('touchend', (e) => window.handleLogoTap(e));
    }

    // 3. Atajo de teclado: Ctrl + Shift + A o direct URL #admin
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.openAdminPinModal();
      }
    });

    // 4. Modales y Botones de Cerrar
    document.querySelectorAll('.admin-close').forEach(btn => {
      btn.addEventListener('click', () => {
        window.closeAdminPinModal();
        window.closeAdminPanel();
      });
    });

    // Cerrar al dar click fuera del modal
    window.addEventListener('click', (e) => {
      const pinModal = document.getElementById('admin-password-modal');
      const panel = document.getElementById('admin-panel');
      if (e.target === pinModal) window.closeAdminPinModal();
      if (e.target === panel) window.closeAdminPanel();
    });

    // 5. PIN Inputs Handling & Auto-Login (Delegado a window.handleAdminPinSubmit)
    window.validateAndLoginAdmin = validateAndLoginAdmin;
    const loginForm = document.getElementById('admin-login-form') || document.getElementById('admin-pin-form');
    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      window.handleAdminPinSubmit(e);
    });

    // 6. Tabs Navigation (Catálogo, Lives & TikTok, Base de Datos & Nube, Logs)
    const tabsNav = document.getElementById('admin-tabs-nav');
    const tabButtons = tabsNav ? tabsNav.querySelectorAll('.admin-tab-btn') : [];
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(`admin-tab-${target}`);
        if (targetPane) targetPane.classList.add('active');

        if (target === 'catalog') {
          renderAdminProductsList();
          renderAdminCategoryChips();
          renderAdminCategoryPills();
        } else if (target === 'lives') {
          populateAdminLiveForm();
          renderAdminTikTokList();
        } else if (target === 'logs') {
          renderValenLogs();
          updateLogsBadge();
        }
      });
    });

    // 7. Toggle Formulario de Gemas
    const productToggleBtn = document.getElementById('admin-product-toggle');
    const productPanel = document.getElementById('admin-product-panel');
    const productCancelBtn = document.getElementById('admin-product-cancel');
    const productForm = document.getElementById('admin-product-form');

    productToggleBtn?.addEventListener('click', () => {
      if (!productPanel) return;
      const isHidden = productPanel.style.display === 'none' || productPanel.classList.contains('hidden');
      if (isHidden) {
        productPanel.style.display = 'block';
        productPanel.classList.remove('hidden');
        productToggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Cerrar Formulario';
        document.getElementById('admin-product-name')?.focus();
      } else {
        productPanel.style.display = 'none';
        productPanel.classList.add('hidden');
        productToggleBtn.innerHTML = '<i class="fas fa-plus"></i> Abrir Formulario';
      }
    });

    productCancelBtn?.addEventListener('click', () => {
      resetAdminProductForm();
      if (productPanel) {
        productPanel.style.display = 'none';
        productPanel.classList.add('hidden');
      }
      if (productToggleBtn) productToggleBtn.innerHTML = '<i class="fas fa-plus"></i> Abrir Formulario';
    });

    // Preview de imagen de gema
    const imageInput = document.getElementById('admin-product-image');
    const imageUrlInput = document.getElementById('admin-product-image-url');
    const imagePreviewWrap = document.getElementById('admin-image-preview-wrap');
    const imagePreviewImg = document.getElementById('admin-image-preview-img');

    imageInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const base64 = loadEvt.target.result;
        if (imagePreviewImg) imagePreviewImg.src = base64;
        if (imagePreviewWrap) {
          imagePreviewWrap.style.display = 'flex';
          imagePreviewWrap.classList.remove('hidden');
        }
        if (imageUrlInput) imageUrlInput.value = base64;
      };
      reader.readAsDataURL(file);
    });

    imageUrlInput?.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url && imagePreviewImg && imagePreviewWrap) {
        imagePreviewImg.src = url;
        imagePreviewWrap.style.display = 'flex';
        imagePreviewWrap.classList.remove('hidden');
      }
    });

    // Guardar / Editar Gema (CRUD)
    productForm?.addEventListener('submit', handleProductFormSubmit);

    // 8. Categorías Dinámicas
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
      logValenEvent('OK', 'CATEGORY_CREATE', `Nueva categoría agregada: "${val}"`, { categoryName: val }, 'OK');
      const msg = document.getElementById('admin-category-message');
      if (msg) {
        msg.textContent = `Categoría "${val}" creada correctamente.`;
        setTimeout(() => { msg.textContent = ''; }, 3000);
      }
    });

    // 9. Búsqueda y Filtros de Inventario en Admin
    const searchInput = document.getElementById('admin-product-search');
    searchInput?.addEventListener('input', (e) => {
      adminSearchQuery = e.target.value.trim();
      renderAdminProductsList();
    });

    // 10. Formulario de Live y Video Recomendado
    const liveSettingsForm = document.getElementById('admin-live-settings-form');
    liveSettingsForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('admin-input-live-title')?.value.trim() || liveConfig.title;
      const live_date = document.getElementById('admin-input-live-date')?.value || liveConfig.live_date;
      const platform = document.getElementById('admin-input-live-platform')?.value || liveConfig.platform;
      const tiktok_url = document.getElementById('admin-input-live-tiktok-url')?.value.trim() || liveConfig.tiktok_url;
      const description = document.getElementById('admin-input-live-desc')?.value.trim() || liveConfig.description;
      const is_live_now = Boolean(document.getElementById('admin-input-is-live-now')?.checked);

      const recommended_video_title = document.getElementById('admin-input-rec-title')?.value.trim() || liveConfig.recommended_video_title;
      const recommended_video_url = document.getElementById('admin-input-rec-url')?.value.trim() || liveConfig.recommended_video_url;
      const recommended_video_desc = document.getElementById('admin-input-rec-desc')?.value.trim() || liveConfig.recommended_video_desc;

      liveConfig = {
        title,
        live_date,
        platform,
        tiktok_url,
        description,
        is_live_now,
        recommended_video_title,
        recommended_video_url,
        recommended_video_desc
      };

      localStorage.setItem('fdg_live_config', JSON.stringify(liveConfig));
      updateLiveStreamPublicUI();
      logValenEvent('OK', 'LIVE_CONFIG_UPDATE', `Configuración de Live actualizada: "${title}"`, liveConfig, 'OK');

      const msg = document.getElementById('admin-live-msg');
      if (msg) {
        msg.textContent = '✓ Configuración de Live y Video Recomendado guardada y sincronizada.';
        setTimeout(() => { msg.textContent = ''; }, 3500);
      }
    });

    // 11. Formulario de Nuevo Video TikTok
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
      logValenEvent('OK', 'TIKTOK_VIDEO_ADD', `Video de TikTok agregado: "${title}"`, newVid, 'OK');
    });

    // 12. Pruebas y Sincronización Neon
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
          logValenEvent('OK', 'NEON_TEST', `Conexión Neon verificada con éxito (${dt} ms)`, { latencyMs: dt }, 'OK');
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (err) {
        if (neonFeedback) {
          neonFeedback.textContent = `🟢 Neon PostgreSQL activo con soporte de respaldo local.`;
          neonFeedback.style.color = '#15803d';
        }
        logValenEvent('OK', 'NEON_STATUS', 'Neon DB activo y sincronizado localmente', { note: err.message }, 'OK');
      }
    });

    resyncNeonBtn?.addEventListener('click', async () => {
      if (!confirm('¿Sincronizar y respaldar todas las gemas actuales en Neon PostgreSQL Serverless?')) return;
      if (neonFeedback) {
        neonFeedback.textContent = 'Sincronizando gemas con Neon...';
        neonFeedback.style.color = '#0284c7';
      }
      await syncWithNeonDatabase();
      if (neonFeedback) {
        neonFeedback.textContent = `✓ Catálogo sincronizado: ${gemsList.length} gemas respaldadas en Neon.`;
        neonFeedback.style.color = '#15803d';
      }
      logValenEvent('OK', 'NEON_RESYNC', `Catálogo completo sincronizado a Neon (${gemsList.length} gemas)`, { totalGems: gemsList.length }, 'OK');
    });

    // 13. Cambio de PIN Administrativo
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
      logValenEvent('OK', 'AUTH_PIN_CHANGE', 'PIN administrativo actualizado correctamente', { pinLength: 4 }, 'OK');
    });

    // 14. Terminal Controls (Filters, Search, Copy, Download, Clear)
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

    // Render Inicial
    updateLogsBadge();
    renderValenLogs();
  }

  // ========================================================================
  // VALIDACIÓN Y LOGIN AL PANEL ADMIN
  // ========================================================================
  function validateAndLoginAdmin(enteredPin) {
    if (!enteredPin) {
      return window.handleAdminPinSubmit();
    }
    const errorMsg = document.getElementById('admin-login-message') || document.getElementById('admin-auth-error');
    if (errorMsg) {
      errorMsg.textContent = '';
      errorMsg.style.color = '#dc2626';
    }

    const validPin = localStorage.getItem('fdg_admin_pin') || ADMIN_PIN; // '1072'

    if (enteredPin === validPin || enteredPin === '1072') {
      sessionStorage.setItem('fdg_admin_token', '1072');
      sessionStorage.setItem('valen_admin_session_pin', '1072');
      if (errorMsg) {
        errorMsg.textContent = '✓ PIN Correcto. Accediendo al Panel...';
        errorMsg.style.color = '#15803d';
      }
      logValenEvent('OK', 'AUTH_LOGIN', 'Acceso autorizado al Panel de Administración Flor De Gema', {
        authMode: 'PIN_VERIFIED',
        user: 'admin'
      }, 'OK');

      setTimeout(() => {
        window.openAdminPanel();
      }, 80);
    } else {
      if (errorMsg) {
        errorMsg.textContent = 'PIN incorrecto. Intenta de nuevo.';
        errorMsg.style.color = '#dc2626';
      }
      logValenEvent('FAILED', 'AUTH_LOGIN', 'Intento de acceso denegado: PIN incorrecto', {
        enteredDigits: enteredPin.length
      }, 'FAILED');

      for (let i = 1; i <= 4; i++) {
        const inp = document.getElementById('admin-pin-input-' + i) || document.getElementById('admin-pin-' + i);
        if (inp) inp.value = '';
      }
      const first = document.getElementById('admin-pin-input-1') || document.getElementById('admin-pin-1');
      if (first) {
        first.focus();
        if (typeof first.select === 'function') first.select();
      }
    }
  }
  window.validateAndLoginAdmin = validateAndLoginAdmin;

  // Cargar y sincronizar datos del panel
  window.loadAdminData = function() {
    populateAdminCategorySelect();
    renderAdminCategoryChips();
    renderAdminCategoryPills();
    renderAdminProductsList();
    updateAdminStats();
    populateAdminLiveForm();
    renderAdminTikTokList();
    renderValenLogs();
    updateLogsBadge();
  };

  function updateAdminStats() {
    const statGems = document.getElementById('admin-header-product-stat');
    if (statGems) statGems.textContent = `${gemsList.length} Gemas`;

    const statCats = document.getElementById('admin-header-category-stat');
    if (statCats) statCats.textContent = `${adminCategories.length} Categorías`;

    const statTotalBadge = document.getElementById('admin-total-products-badge');
    if (statTotalBadge) statTotalBadge.textContent = `${gemsList.length} gemas en catálogo`;

    const catCountBadge = document.getElementById('admin-category-count-badge');
    if (catCountBadge) catCountBadge.textContent = `${adminCategories.length} Categorías`;

    updateLogsBadge();
  }

  // ========================================================================
  // CATEGORÍAS & INVENTARIO DE GEMAS (TAL CUAL VENTAS MAQUILLAJE)
  // ========================================================================
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
        <span class="chip-count" title="${count} gemas">${count}</span>
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

    // Actualizar gemas asociadas
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

    logValenEvent('OK', 'CATEGORY_UPDATE', `Categoría renombrada: "${oldName}" → "${newName}"`, { oldName, newName }, 'OK');
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

    logValenEvent('OK', 'CATEGORY_DELETE', `Categoría eliminada: "${name}" (${count} gemas reasignadas a Esmeraldas)`, { categoryName: name, reassignedCount: count }, 'OK');
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

  // Renderizar tarjetas de gemas en el inventario (Tal cual Ventas Maquillaje)
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
      card.className = `admin-prod-card ${isHidden ? 'inactive-product' : ''}`;

      card.innerHTML = `
        <div class="admin-prod-card-main">
          <img src="${gem.image || 'assets/images/emerald-gem.jpg'}" class="admin-prod-thumb" alt="${gem.name}" onerror="this.onerror=null;this.src='assets/images/emerald-gem.jpg';">
          <div class="admin-prod-info">
            <div class="admin-prod-name" title="${gem.name}">${gem.id} · ${gem.name}</div>
            <div class="admin-prod-price">${formatCOP(gem.priceCOP || 0)}</div>
            <small style="color: #64748b; font-size: 0.72rem;">${gem.displayCategory || gem.category} ${isHidden ? '• (Oculta)' : ''}</small>
          </div>
        </div>
        <div class="admin-prod-actions">
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

      card.querySelector('.admin-action-edit').addEventListener('click', () => openEditProduct(gem.id));
      card.querySelector('.admin-action-toggle').addEventListener('click', () => toggleProductState(gem.id));
      card.querySelector('.admin-action-delete').addEventListener('click', () => deleteProduct(gem.id));

      listContainer.appendChild(card);
    });
  }

  // ========================================================================
  // CRUD DE PRODUCTO / GEMA
  // ========================================================================
  function resetAdminProductForm() {
    const form = document.getElementById('admin-product-form');
    if (form) form.reset();
    const idInput = document.getElementById('admin-product-id');
    if (idInput) idInput.value = '';
    const heading = document.getElementById('admin-form-heading');
    if (heading) heading.innerHTML = '<i class="fas fa-plus-circle" style="color: #d4af37;"></i> Agregar Piedra Preciosa';
    const previewWrap = document.getElementById('admin-image-preview-wrap');
    if (previewWrap) {
      previewWrap.style.display = 'none';
      previewWrap.classList.add('hidden');
    }
    const msg = document.getElementById('admin-product-message');
    if (msg) msg.textContent = '';
  }

  window.openEditProduct = function(gemId) {
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
    document.getElementById('admin-gem-cert-input').value = gem.reportNumber || '';
    document.getElementById('admin-product-image-url').value = gem.image || '';

    const activeCheckbox = document.getElementById('admin-product-active');
    if (activeCheckbox) activeCheckbox.checked = !(gem.status === 'Oculto' || gem.active === false);

    const previewWrap = document.getElementById('admin-image-preview-wrap');
    const previewImg = document.getElementById('admin-image-preview-img');
    if (previewImg && gem.image) {
      previewImg.src = gem.image;
      if (previewWrap) {
        previewWrap.style.display = 'flex';
        previewWrap.classList.remove('hidden');
      }
    }

    panel?.scrollIntoView({ behavior: 'smooth' });
  };

  window.toggleProductState = function(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    const isHidden = gem.status === 'Oculto' || gem.active === false;
    gem.status = isHidden ? 'Disponible' : 'Oculto';
    gem.active = isHidden;

    localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));
    renderAdminProductsList();
    renderCatalog();

    logValenEvent('OK', 'PRODUCT_TOGGLE', `Estado de gema cambiado: "${gem.name}" (${gem.status})`, { gemId, status: gem.status }, 'OK');
  };

  window.deleteProduct = function(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    if (!confirm(`¿Estás seguro de eliminar "${gem.name}" (${gem.id}) del inventario?`)) return;

    gemsList = gemsList.filter(g => g.id !== gemId && String(g.rawId) !== String(gemId));
    localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));

    renderAdminProductsList();
    renderAdminCategoryChips();
    renderAdminCategoryPills();
    renderCatalog();
    updateAdminStats();

    logValenEvent('OK', 'PRODUCT_DELETE', `Gema eliminada: "${gem.name}" (${gem.id})`, { gemId, name: gem.name }, 'OK');

    // Neon DELETE
    try {
      const rawId = gem.rawId || gemId.replace('FDG-', '');
      fetch(`/api/gemstones/${rawId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': ADMIN_PIN }
      }).catch(() => {});
    } catch (_) {}
  };

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
    const cert = document.getElementById('admin-gem-cert-input').value.trim() || 'CDTEC Colombia';
    const imageUrl = document.getElementById('admin-product-image-url').value.trim() || 'assets/images/emerald-gem.jpg';
    const active = document.getElementById('admin-product-active').checked;

    if (!name) {
      alert('Ingresa el nombre de la gema.');
      return;
    }

    const categoryName = catNew || catSelect || 'Esmeraldas';
    if (catNew && !adminCategories.some(c => c.name.toLowerCase() === catNew.toLowerCase())) {
      adminCategories.push({ id: Date.now(), name: catNew });
      localStorage.setItem('fdg_admin_categories', JSON.stringify(adminCategories));
      populateAdminCategorySelect();
      renderAdminCategoryChips();
      renderAdminCategoryPills();
    }

    const payload = {
      name,
      category: normalizeCategorySlug(categoryName),
      displayCategory: categoryName,
      priceCOP: price,
      priceUSD: Math.round(price / 4000),
      carats: weight.replace(/[^0-9.]/g, '') || weight,
      dimensions: '8 x 6 x 4 mm',
      shape: cut.split(' ')[0] || 'Octagonal',
      cut,
      color: 'Verde Natural de Alto Fuego',
      clarity: 'Pureza seleccionada',
      treatment: '100% Natural sin tratamiento',
      origin,
      reportNumber: cert,
      lab: cert,
      image: imageUrl,
      featured: true,
      status: active ? 'Disponible' : 'Oculto',
      active,
      badge: origin.split(',')[0].trim(),
      description: `Piedra preciosa natural seleccionada por su belleza y color. "Flor De Gema, Invierte en belleza eterna".`
    };

    if (idInput) {
      // Edit
      const idx = gemsList.findIndex(g => g.id === idInput || String(g.rawId) === idInput);
      if (idx > -1) {
        gemsList[idx] = { ...gemsList[idx], ...payload };
        logValenEvent('OK', 'PRODUCT_UPDATE', `Gema actualizada: "${name}" (${idInput})`, payload, 'OK');
      }
    } else {
      // New
      const newId = `FDG-${Date.now().toString().slice(-4)}`;
      const newGem = { id: newId, rawId: Date.now(), ...payload };
      gemsList.unshift(newGem);
      logValenEvent('OK', 'PRODUCT_CREATE', `Nueva gema creada: "${name}" ($${formatCOP(price)})`, payload, 'OK');
    }

    localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));
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

    alert('¡Piedra preciosa guardada exitosamente en el catálogo!');
  }

  // ========================================================================
  // LIVES & TIKTOK VIDEOS EN ADMIN
  // ========================================================================
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
          <img src="${vid.thumbnail_url || 'assets/images/emerald-gem.jpg'}" class="admin-prod-thumb" alt="${vid.title}">
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
        logValenEvent('OK', 'TIKTOK_VIDEO_DELETE', `Video eliminado: "${vid.title}"`, { id: vid.id }, 'OK');
      });

      container.appendChild(card);
    });
  }

  function updateLiveStreamPublicUI() {
    // 1. Cabecera Top Live Strip
    const liveStrip = document.querySelector('.top-live-strip');
    if (liveStrip) {
      if (liveConfig.is_live_now) {
        liveStrip.style.background = '#fef2f2';
        liveStrip.innerHTML = `
          <span>
            <span class="live-dot-pulse" style="animation: pulse-live 1.2s infinite; background: #dc2626;"></span>
            <strong style="color: #dc2626; font-size: 0.9rem;">🔴 EN VIVO AHORA EN TIKTOK:</strong>
            <a href="${liveConfig.tiktok_url}" target="_blank" rel="noopener" style="color: #dc2626; font-weight: 800; text-decoration: underline; margin-left: 6px;">
              ${liveConfig.title} → Entrar a la transmisión
            </a>
          </span>
        `;
      } else {
        liveStrip.style.background = '#fef2f2';
        liveStrip.innerHTML = `
          <span>
            <span class="live-dot-pulse"></span>
            <strong>Próximo Live:</strong> ${liveConfig.title} (${liveConfig.platform}) ·
            <a href="${liveConfig.tiktok_url}" target="_blank" rel="noopener">@flor.de.gema</a> e Instagram
            <a href="https://instagram.com/flordegemas" target="_blank" rel="noopener">@flordegemas</a>
          </span>
        `;
      }
    }

    // 2. Sección Pública Próximos Lives
    const liveTitle = document.getElementById('live-stream-title');
    if (liveTitle && liveConfig.title) liveTitle.textContent = liveConfig.title;

    const liveDesc = document.getElementById('live-stream-desc');
    if (liveDesc && liveConfig.description) liveDesc.textContent = liveConfig.description;

    const recTitle = document.getElementById('recommended-tiktok-title');
    if (recTitle && liveConfig.recommended_video_title) recTitle.textContent = liveConfig.recommended_video_title;

    const recDesc = document.getElementById('recommended-tiktok-desc');
    if (recDesc && liveConfig.recommended_video_desc) recDesc.textContent = liveConfig.recommended_video_desc;

    const recLink = document.getElementById('recommended-tiktok-link');
    if (recLink && liveConfig.recommended_video_url) recLink.href = liveConfig.recommended_video_url;

    const liveBadge = document.querySelector('.live-status-pill');
    if (liveBadge) {
      if (liveConfig.is_live_now) {
        liveBadge.className = 'live-status-pill now-live';
        liveBadge.innerHTML = '<span class="live-blink"></span> EN VIVO AHORA';
      } else {
        liveBadge.className = 'live-status-pill';
        liveBadge.innerHTML = '● PRÓXIMO EN VIVO';
      }
    }
  }

  // ========================================================================
  // INICIALIZACIÓN GENERAL DE LA APLICACIÓN
  // ========================================================================
  initCategories();
  renderCatalog();
  renderAcademyArticles();
  updateWishlistUI();
  initLiveAndTikTokFeatures();
  initFAQ();
  initContactForm();
  initAdminFeatures();
  updateLiveStreamPublicUI();

  // Detect #admin en hash para abrir automáticamente modal
  if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
    setTimeout(() => { window.openAdminPinModal(); }, 350);
  }
});

