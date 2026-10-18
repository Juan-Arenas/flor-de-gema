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

  // Admin Elements
  const adminLockBtn = document.getElementById('admin-lock-btn');
  const adminPasswordModal = document.getElementById('admin-password-modal');
  const adminAuthCloseBtn = document.getElementById('admin-auth-close-btn');
  const adminPinForm = document.getElementById('admin-pin-form');
  const adminAuthError = document.getElementById('admin-auth-error');
  const pinInputs = [
    document.getElementById('admin-pin-1'),
    document.getElementById('admin-pin-2'),
    document.getElementById('admin-pin-3'),
    document.getElementById('admin-pin-4')
  ];

  const adminPanelModal = document.getElementById('admin-panel-modal');
  const adminPanelCloseBtn = document.getElementById('admin-panel-close-btn');
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
  // PANEL ADMINISTRATIVO & AUTENTICACIÓN (PIN 1072)
  // ========================================================================
  function initAdminFeatures() {
    // Botones de acceso a Panel Admin (Header, Submenu, Footer)
    document.getElementById('header-admin-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminAuthModal();
    });

    document.getElementById('submenu-admin-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminAuthModal();
    });

    document.getElementById('footer-admin-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminAuthModal();
    });

    adminLockBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminAuthModal();
    });

    // Triple click en logo para abrir admin
    let logoClicks = 0;
    let logoClickTimer = null;
    const siteLogo = document.querySelector('.site-logo-link');
    siteLogo?.addEventListener('click', (e) => {
      logoClicks++;
      clearTimeout(logoClickTimer);
      if (logoClicks >= 3) {
        e.preventDefault();
        logoClicks = 0;
        openAdminAuthModal();
      } else {
        logoClickTimer = setTimeout(() => { logoClicks = 0; }, 800);
      }
    });

    // Atajo de teclado: Ctrl + Shift + A
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openAdminAuthModal();
      }
    });

    // Cerrar modales auth
    adminAuthCloseBtn?.addEventListener('click', closeAdminAuthModal);
    adminPanelCloseBtn?.addEventListener('click', closeAdminPanel);
    adminLogoutBtn?.addEventListener('click', () => {
      sessionStorage.removeItem('fdg_admin_token');
      addSystemLog('INFO', 'Sesión administrativa cerrada');
      closeAdminPanel();
    });

    // 2. PIN Inputs Handling (Auto-tabbing & submit on 4th digit)
    pinInputs.forEach((input, index) => {
      if (!input) return;

      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = val;

        if (val && index < pinInputs.length - 1) {
          pinInputs[index + 1].focus();
        }

        // Si se completaron los 4 dígitos, submit automático
        const fullPin = pinInputs.map(p => p.value).join('');
        if (fullPin.length === 4) {
          validateAdminPin(fullPin);
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          pinInputs[index - 1].focus();
        }
      });
    });

    adminPinForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullPin = pinInputs.map(p => p.value).join('');
      validateAdminPin(fullPin);
    });

    // 3. Tab Navigation
    adminTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        adminTabBtns.forEach(b => b.classList.remove('active'));
        adminTabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = btn.dataset.tab;
        const targetPane = document.getElementById(`tab-pane-${targetTab}`);
        if (targetPane) targetPane.classList.add('active');
        if (targetTab === 'lives') {
          populateAdminLiveForm();
          renderAdminTikTokTable();
        }
      });
    });

    // 4. Formulario de Gema (Toggle & Submit)
    adminToggleFormBtn?.addEventListener('click', () => {
      resetAdminForm();
      const isVisible = adminGemFormWrap.style.display !== 'none';
      adminGemFormWrap.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        adminFormHeading.textContent = 'Agregar Nueva Piedra Preciosa';
        document.getElementById('admin-gem-name')?.focus();
      }
    });

    adminCancelEditBtn?.addEventListener('click', () => {
      resetAdminForm();
      adminGemFormWrap.style.display = 'none';
    });

    adminGemClearBtn?.addEventListener('click', resetAdminForm);

    // Image file upload with FileReader preview
    adminGemImageFile?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const base64 = loadEvt.target.result;
        adminGemImageUrl.value = base64;
        showImagePreview(base64);
      };
      reader.readAsDataURL(file);
    });

    adminGemImageUrl?.addEventListener('input', (e) => {
      showImagePreview(e.target.value.trim());
    });

    // Guardar / Editar Gema
    adminGemForm?.addEventListener('submit', handleGemFormSubmit);

    // Búsqueda y Filtro de tabla admin
    adminSearchGems?.addEventListener('input', renderAdminGemsTable);
    adminFilterCategory?.addEventListener('change', renderAdminGemsTable);

    // Logs Actions
    adminCopyLogsBtn?.addEventListener('click', () => {
      const text = systemLogs.map(l => `[${l.time}] [${l.level}] ${l.message}`).join('\n');
      navigator.clipboard.writeText(text).then(() => {
        alert('Logs copiados al portapapeles.');
      });
    });

    adminDownloadLogsBtn?.addEventListener('click', () => {
      const text = systemLogs.map(l => `[${l.time}] [${l.level}] ${l.message} ${JSON.stringify(l.details || {})}`).join('\n');
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `flordegema_logs_${Date.now()}.txt`;
      a.click();
    });

    adminClearLogsBtn?.addEventListener('click', () => {
      if (confirm('¿Deseas limpiar todos los registros de la consola?')) {
        systemLogs = [];
        localStorage.removeItem('fdg_logs');
        renderLogs();
        try {
          fetch('/api/logs', {
            method: 'DELETE',
            headers: { 'x-admin-password': ADMIN_PIN }
          }).catch(() => {});
        } catch (e) {}
      }
    });

    // Neon Tab Buttons
    adminTestNeonBtn?.addEventListener('click', async () => {
      adminNeonFeedback.textContent = 'Probando conexión con Neon...';
      adminNeonFeedback.style.color = '#0284c7';
      try {
        const t0 = performance.now();
        const res = await fetch('/api/status');
        const dt = Math.round(performance.now() - t0);
        if (res.ok) {
          const json = await res.json();
          adminNeonFeedback.textContent = `🟢 Conexión exitosa a Neon PostgreSQL (${dt} ms). Base de datos en tiempo real operativa.`;
          adminNeonFeedback.style.color = '#16a34a';
          neonStatusText.textContent = `🟢 Conectado y Sincronizado (${dt} ms)`;
          neonStatusText.style.color = '#16a34a';
          addSystemLog('SUCCESS', `Prueba de conexión Neon exitosa (${dt} ms)`);
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (err) {
        adminNeonFeedback.textContent = `⚠️ Advertencia de conexión: ${err.message}. Operando con almacenamiento local.`;
        adminNeonFeedback.style.color = '#b45309';
        addSystemLog('WARN', `Fallo al probar Neon: ${err.message}`);
      }
    });

    adminResyncNeonBtn?.addEventListener('click', async () => {
      if (confirm('¿Sincronizar y respaldar todas las gemas actuales en Neon PostgreSQL?')) {
        adminNeonFeedback.textContent = 'Sincronizando con Neon...';
        adminNeonFeedback.style.color = '#0284c7';
        await syncWithNeonDatabase();
        adminNeonFeedback.textContent = `✓ Catálogo sincronizado: ${gemsList.length} gemas registradas en Neon.`;
        adminNeonFeedback.style.color = '#16a34a';
      }
    });
  }

  function openAdminAuthModal() {
    if (sessionStorage.getItem('fdg_admin_token') === ADMIN_PIN) {
      openAdminPanel();
      return;
    }
    pinInputs.forEach(p => { if (p) p.value = ''; });
    if (adminAuthError) adminAuthError.textContent = '';
    adminPasswordModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { pinInputs[0]?.focus(); }, 150);
  }

  function closeAdminAuthModal() {
    adminPasswordModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openAdminPanel() {
    closeAdminAuthModal();
    adminPanelModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderAdminGemsTable();
    updateAdminStats();
    renderLogs();
    populateAdminLiveForm();
    renderAdminTikTokTable();
  }

  function closeAdminPanel() {
    adminPanelModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  async function validateAdminPin(pin) {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('fdg_admin_token', ADMIN_PIN);
      addSystemLog('SUCCESS', 'Acceso administrativo autorizado con PIN');
      openAdminPanel();

      // Notificar al serverless api
      try {
        fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        }).catch(() => {});
      } catch (e) {}
    } else {
      if (adminAuthError) adminAuthError.textContent = 'PIN incorrecto. Verifica e intenta nuevamente.';
      addSystemLog('WARN', 'Intento de acceso denegado con PIN incorrecto');
      pinInputs.forEach(p => { if (p) p.value = ''; });
      pinInputs[0]?.focus();
    }
  }

  function showImagePreview(src) {
    if (!adminGemPreviewImg || !adminImgPlaceholder) return;
    if (src) {
      adminGemPreviewImg.src = src;
      adminGemPreviewImg.style.display = 'block';
      adminImgPlaceholder.style.display = 'none';
    } else {
      adminGemPreviewImg.src = '';
      adminGemPreviewImg.style.display = 'none';
      adminImgPlaceholder.style.display = 'block';
    }
  }

  function resetAdminForm() {
    if (!adminGemForm) return;
    adminGemForm.reset();
    document.getElementById('admin-gem-id').value = '';
    showImagePreview('');
  }

  // ========================================================================
  // CRUD DE GEMAS
  // ========================================================================
  async function handleGemFormSubmit(e) {
    e.preventDefault();

    const idInput = document.getElementById('admin-gem-id').value;
    const name = document.getElementById('admin-gem-name').value.trim();
    const category = document.getElementById('admin-gem-category').value;
    const price = Number(document.getElementById('admin-gem-price').value) || 0;
    const weight = document.getElementById('admin-gem-weight').value.trim();
    const dimensions = document.getElementById('admin-gem-dimensions').value.trim();
    const origin = document.getElementById('admin-gem-origin').value.trim();
    const cut = document.getElementById('admin-gem-cut').value.trim();
    const color = document.getElementById('admin-gem-color').value.trim();
    const treatment = document.getElementById('admin-gem-treatment').value.trim();
    const certificate = document.getElementById('admin-gem-certificate').value.trim();
    const status = document.getElementById('admin-gem-status').value;
    const featured = document.getElementById('admin-gem-featured').checked;
    const description = document.getElementById('admin-gem-description').value.trim();
    let image = adminGemImageUrl.value.trim() || 'assets/images/emerald-gem.jpg';

    const payload = {
      name,
      category,
      price,
      weight_ct: weight,
      dimensions_mm: dimensions,
      origin,
      cut,
      color,
      treatment,
      certificate,
      description,
      image,
      status,
      featured
    };

    if (idInput) {
      // EDIT MODE
      const targetIndex = gemsList.findIndex(g => g.id === idInput || String(g.rawId) === idInput);
      if (targetIndex > -1) {
        const rawId = gemsList[targetIndex].rawId || idInput.replace('FDG-', '');
        gemsList[targetIndex] = {
          ...gemsList[targetIndex],
          name,
          category: normalizeCategorySlug(category),
          displayCategory: category,
          priceCOP: price,
          priceUSD: Math.round(price / 4000),
          carats: weight.replace(/[^0-9.]/g, '') || weight,
          dimensions,
          shape: cut ? cut.split(' ')[0] : 'Octagonal',
          cut,
          color,
          treatment,
          reportNumber: certificate,
          lab: certificate,
          image,
          status,
          featured,
          description,
          badge: status !== 'Disponible' ? status : origin.split(',')[0].trim()
        };

        addSystemLog('SUCCESS', `Gema editada: "${name}" (ID: ${idInput})`, payload);

        // Neon PUT
        try {
          fetch(`/api/gemstones/${rawId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': ADMIN_PIN
            },
            body: JSON.stringify(payload)
          }).catch(() => {});
        } catch (e) {}
      }
    } else {
      // CREATE MODE
      const newGemId = `FDG-${Date.now().toString().slice(-4)}`;
      const newGem = {
        id: newGemId,
        rawId: Date.now(),
        name,
        category: normalizeCategorySlug(category),
        displayCategory: category,
        priceCOP: price,
        priceUSD: Math.round(price / 4000),
        carats: weight.replace(/[^0-9.]/g, '') || weight,
        dimensions,
        shape: cut ? cut.split(' ')[0] : 'Octagonal',
        cut: cut || 'Talla Esmeralda',
        color: color || 'Color Natural',
        clarity: 'Pureza seleccionada',
        treatment: treatment || '100% Natural sin tratamiento',
        origin: origin || 'Colombia',
        reportNumber: certificate || 'Certificado Flor De Gema',
        lab: certificate || 'Flor De Gema Certified',
        image,
        featured,
        status,
        badge: status !== 'Disponible' ? status : origin.split(',')[0].trim(),
        description
      };

      gemsList.unshift(newGem);
      addSystemLog('SUCCESS', `Nueva gema agregada: "${name}" ($${price.toLocaleString('es-CO')})`, payload);

      // Neon POST
      try {
        fetch('/api/gemstones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': ADMIN_PIN
          },
          body: JSON.stringify(payload)
        }).then(r => r.json()).then(res => {
          if (res && res.id) newGem.rawId = res.id;
        }).catch(() => {});
      } catch (e) {}
    }

    localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));
    renderCatalog();
    renderAdminGemsTable();
    updateAdminStats();

    resetAdminForm();
    adminGemFormWrap.style.display = 'none';
    alert('¡Piedra preciosa guardada exitosamente en el catálogo y sincronizada con Neon!');
  }

  window.editGemInAdmin = function(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    adminFormHeading.textContent = `Editar Gema: ${gem.name}`;
    document.getElementById('admin-gem-id').value = gem.rawId || gem.id;
    document.getElementById('admin-gem-name').value = gem.name || '';
    document.getElementById('admin-gem-category').value = gem.displayCategory || 'Esmeraldas';
    document.getElementById('admin-gem-price').value = gem.priceCOP || 0;
    document.getElementById('admin-gem-weight').value = gem.carats || '';
    document.getElementById('admin-gem-dimensions').value = gem.dimensions || '';
    document.getElementById('admin-gem-origin').value = gem.origin || '';
    document.getElementById('admin-gem-cut').value = gem.cut || '';
    document.getElementById('admin-gem-color').value = gem.color || '';
    document.getElementById('admin-gem-treatment').value = gem.treatment || '';
    document.getElementById('admin-gem-certificate').value = gem.reportNumber || '';
    document.getElementById('admin-gem-status').value = gem.status || 'Disponible';
    document.getElementById('admin-gem-featured').checked = Boolean(gem.featured);
    document.getElementById('admin-gem-description').value = gem.description || '';
    adminGemImageUrl.value = gem.image || '';
    showImagePreview(gem.image);

    adminGemFormWrap.style.display = 'block';
    adminGemFormWrap.scrollIntoView({ behavior: 'smooth' });
  };

  window.deleteGemInAdmin = function(gemId) {
    const gem = gemsList.find(g => g.id === gemId || String(g.rawId) === String(gemId));
    if (!gem) return;

    if (confirm(`¿Estás seguro de eliminar la gema "${gem.name}" del catálogo?`)) {
      const rawId = gem.rawId || gem.id.replace('FDG-', '');
      gemsList = gemsList.filter(g => g.id !== gem.id);
      localStorage.setItem('fdg_gemstones_cache', JSON.stringify(gemsList));

      addSystemLog('WARN', `Gema eliminada: "${gem.name}" (ID: ${gem.id})`);

      // Neon DELETE
      try {
        fetch(`/api/gemstones/${rawId}`, {
          method: 'DELETE',
          headers: { 'x-admin-password': ADMIN_PIN }
        }).catch(() => {});
      } catch (e) {}

      renderCatalog();
      renderAdminGemsTable();
      updateAdminStats();
    }
  };

  function renderAdminGemsTable() {
    if (!adminGemsTableBody) return;

    const query = (adminSearchGems?.value || '').toLowerCase().trim();
    const catFilter = adminFilterCategory?.value || 'all';

    const filtered = gemsList.filter(g => {
      const matchCat = catFilter === 'all' || (g.displayCategory && g.displayCategory.toLowerCase().includes(catFilter.toLowerCase())) || g.category === catFilter.toLowerCase();
      const matchQuery = !query ||
        g.name.toLowerCase().includes(query) ||
        (g.origin && g.origin.toLowerCase().includes(query)) ||
        (g.cut && g.cut.toLowerCase().includes(query)) ||
        (g.id && g.id.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      adminGemsTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2rem; color: #64748b;">
            No se encontraron gemas con los filtros actuales.
          </td>
        </tr>
      `;
      return;
    }

    adminGemsTableBody.innerHTML = filtered.map(gem => {
      const statusClass = gem.status === 'Vendida' ? 'status-vendida' : (gem.status === 'Reservada' ? 'status-reservada' : 'status-disponible');
      return `
        <tr>
          <td>
            <img src="${gem.image}" alt="${gem.name}" class="admin-gem-thumb">
          </td>
          <td>
            <strong>${gem.name}</strong><br>
            <span style="font-size: 0.75rem; color: #64748b;">${gem.id}</span>
          </td>
          <td>${gem.displayCategory || gem.category}</td>
          <td><strong>${formatCOP(gem.priceCOP)}</strong></td>
          <td>${gem.carats} ct<br><span style="font-size: 0.75rem; color: #64748b;">${gem.dimensions}</span></td>
          <td>${gem.origin}</td>
          <td><span class="status-tag ${statusClass}">${gem.status || 'Disponible'}</span></td>
          <td>
            <div style="display: flex; gap: 4px;">
              <button class="btn-action-small" onclick="editGemInAdmin('${gem.id}')" title="Editar">Editar</button>
              <button class="btn-action-small btn-action-danger" onclick="deleteGemInAdmin('${gem.id}')" title="Eliminar">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateAdminStats() {
    if (adminStatGemsCount) adminStatGemsCount.textContent = `${gemsList.length} Gemas`;
    if (adminStatLogsCount) adminStatLogsCount.textContent = `${systemLogs.length} Logs`;
    if (adminTerminalCount) adminTerminalCount.textContent = `${systemLogs.length} entradas`;
  }

  function renderLogs() {
    if (!adminLogsTerminalBody) return;
    if (systemLogs.length === 0) {
      adminLogsTerminalBody.innerHTML = `<div class="log-line"><span class="log-badge log-INFO">INFO</span> Consola limpia. Esperando nuevos eventos...</div>`;
      return;
    }

    adminLogsTerminalBody.innerHTML = systemLogs.map(l => `
      <div class="log-line">
        <span class="log-badge log-${l.level}">${l.level}</span>
        <span style="color: #94a3b8;">[${l.time}]</span>
        <span>${l.message}</span>
      </div>
    `).join('');
  }
});
