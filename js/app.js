// ==========================================================================
// FLOR DE GEMA - LOGIC ENGINE (CLEAN MINIMAL REFERENCE STYLE)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';
  let wishlist = JSON.parse(localStorage.getItem('fdg_wishlist') || '[]');

  // Elements
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

  // Initialize
  initCategories();
  renderCatalog();
  renderAcademyArticles();
  updateWishlistUI();
  initCountdown();
  initFAQ();
  initContactForm();

  // Category Pills
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

  // Global helper for the 4 image cards in "Explora por tipo de gema"
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

  // Filter & Sort
  function getFilteredGemstones() {
    return GEMSTONES.filter(gem => {
      const matchCat = currentCategory === 'all' || gem.category === currentCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        gem.name.toLowerCase().includes(q) ||
        gem.shape.toLowerCase().includes(q) ||
        gem.origin.toLowerCase().includes(q) ||
        gem.color.toLowerCase().includes(q) ||
        gem.id.toLowerCase().includes(q);
      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (currentSort === 'price-low') return a.priceCOP - b.priceCOP;
      if (currentSort === 'price-high') return b.priceCOP - a.priceCOP;
      if (currentSort === 'carats-high') return b.carats - a.carats;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }

  function formatCOP(num) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num);
  }
  function formatUSD(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  }

  // Render Catalog
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
            <span class="product-card-badge">${gem.badge || gem.shape}</span>
            <button class="product-card-bookmark-btn ${isSaved ? 'active' : ''}" 
                    title="${isSaved ? 'Quitar de guardados' : 'Guardar gema'}" 
                    onclick="event.stopPropagation(); toggleWishlist('${gem.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <div class="product-card-body">
            <div class="product-card-ref">REF: ${gem.id} · ${gem.origin.split(',')[0]}</div>
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

            <div class="product-card-btn-grid">
              <button class="btn-view-sheet" onclick="openTechSheet('${gem.id}')">
                Ficha Técnica
              </button>
              <button class="btn-wa-reserve" onclick="sendWhatsAppInquiry('${gem.id}')">
                <span>💬</span> Apartar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Wishlist Logic
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
    if (wishlistCounterBadge) {
      wishlistCounterBadge.textContent = wishlist.length;
      wishlistCounterBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
    renderWishlistDrawer();
  }

  function renderWishlistDrawer() {
    if (!wishlistDrawerBody) return;
    const savedGems = GEMSTONES.filter(g => wishlist.includes(g.id));

    if (savedGems.length === 0) {
      wishlistDrawerBody.innerHTML = `
        <div style="text-align: center; color: #6b7280; padding: 3rem 1rem;">
          <p style="font-weight: 600; color: #111827; margin-bottom: 0.3rem;">Tu bolsa de gemas está vacía</p>
          <p style="font-size: 0.85rem;">Guarda tus gemas favoritas con el icono de marcador para cotizarlas en conjunto por WhatsApp.</p>
        </div>
      `;
      if (sendWishlistWaBtn) sendWishlistWaBtn.style.display = 'none';
      return;
    }

    if (sendWishlistWaBtn) sendWishlistWaBtn.style.display = 'block';

    wishlistDrawerBody.innerHTML = savedGems.map(gem => `
      <div style="display: flex; gap: 0.8rem; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 8px;">
        <img src="${gem.image}" alt="${gem.name}" style="width: 55px; height: 55px; object-fit: contain; background: #fff;">
        <div style="flex: 1;">
          <div style="font-size: 0.88rem; font-weight: 700; color: #111827;">${gem.name}</div>
          <div style="font-size: 0.78rem; color: #6b7280;">${gem.carats} ct · ${gem.shape}</div>
          <div style="font-size: 0.85rem; font-weight: 700; color: #111827; margin-top: 0.2rem;">${formatCOP(gem.priceCOP)}</div>
          <button style="color: #dc2626; font-size: 0.78rem; margin-top: 0.3rem; text-decoration: underline;" onclick="toggleWishlist('${gem.id}')">Quitar</button>
        </div>
      </div>
    `).join('');
  }

  window.openWishlist = function() {
    wishlistDrawer?.classList.add('open');
  };

  window.closeWishlist = function() {
    wishlistDrawer?.classList.remove('open');
  };

  // WhatsApp Single Gemstone Inquiry
  window.sendWhatsAppInquiry = function(gemId) {
    const gem = GEMSTONES.find(g => g.id === gemId);
    if (!gem) return;

    const message = `Hola Flor De Gema, estoy interesado(a) en la siguiente piedra:
- *${gem.name}* (Ref: ${gem.id})
- Peso: ${gem.carats} quilates
- Talla: ${gem.cut}
- Origen: ${gem.origin}
- Precio de referencia: ${formatCOP(gem.priceCOP)}

¿Sigue disponible? Quisiera más información y coordinar compra. Eslogan: "Flor De Gema, Invierte en belleza eterna"`;

    window.open(`https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // WhatsApp Batch Wishlist Inquiry
  sendWishlistWaBtn?.addEventListener('click', () => {
    const savedGems = GEMSTONES.filter(g => wishlist.includes(g.id));
    if (savedGems.length === 0) return;

    let itemsList = savedGems.map((g, i) => `${i + 1}. *${g.name}* (${g.id}) - ${g.carats} ct - ${formatCOP(g.priceCOP)}`).join('\n');
    const message = `Hola Flor De Gema, deseo cotizar esta selección de gemas:

${itemsList}

¿Están disponibles para envío asegurado?`;

    window.open(`https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  });

  // Tech Sheet Modal
  window.openTechSheet = function(gemId) {
    const gem = GEMSTONES.find(g => g.id === gemId);
    if (!gem || !techModalOverlay) return;

    const modalBody = document.getElementById('tech-modal-content');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: center;">
        <div style="text-align: center; background: #fafafa; padding: 1.5rem; border-radius: 8px; border: 1px solid #eee;">
          <img src="${gem.image}" alt="${gem.name}" style="max-height: 240px; margin: 0 auto; object-fit: contain;">
          <div style="margin-top: 1rem; font-size: 0.8rem; font-weight: 700; color: #059669;">
            📜 Reporte Gemológico: ${gem.reportNumber}
          </div>
          <div style="font-size: 0.75rem; color: #6b7280;">${gem.lab}</div>
        </div>

        <div>
          <span style="font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase;">Ficha Técnica Oficial · ${gem.id}</span>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #111827; margin: 0.2rem 0 0.8rem;">${gem.name}</h2>
          <p style="font-size: 0.92rem; color: #4b5563; line-height: 1.5; margin-bottom: 1rem;">${gem.description}</p>

          <table class="spec-clean-table">
            <tbody>
              <tr><th>Peso en quilates</th><td>${gem.carats} ct</td></tr>
              <tr><th>Medidas (mm)</th><td>${gem.dimensions}</td></tr>
              <tr><th>Forma y Talla</th><td>${gem.shape} (${gem.cut})</td></tr>
              <tr><th>Color</th><td>${gem.color}</td></tr>
              <tr><th>Claridad</th><td>${gem.clarity}</td></tr>
              <tr><th>Tratamientos conocidos</th><td>${gem.treatment}</td></tr>
              <tr><th>Origen documentado</th><td>${gem.origin}</td></tr>
              <tr><th>Reporte Gemológico</th><td>${gem.lab}</td></tr>
            </tbody>
          </table>

          <div style="margin: 1.2rem 0; font-size: 1.4rem; font-weight: 800; color: #111827;">
            ${formatCOP(gem.priceCOP)} <span style="font-size: 0.88rem; font-weight: 400; color: #6b7280;">(~ ${formatUSD(gem.priceUSD)} USD)</span>
          </div>

          <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
            <button class="btn-primary-dark" style="flex: 1;" onclick="sendWhatsAppInquiry('${gem.id}')">
              Apartar por WhatsApp
            </button>
            <button class="btn-view-sheet" style="padding: 0.8rem 1.2rem;" onclick="toggleWishlist('${gem.id}'); closeTechSheet();">
              ${wishlist.includes(gem.id) ? '✓ Guardada' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    `;

    techModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeTechSheet = function() {
    techModalOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  techModalOverlay?.addEventListener('click', (e) => {
    if (e.target === techModalOverlay) closeTechSheet();
  });
  techModalCloseBtn?.addEventListener('click', closeTechSheet);

  // Academia Articles
  function renderAcademyArticles() {
    const grid = document.getElementById('academy-grid');
    if (!grid) return;

    grid.innerHTML = ACADEMY_ARTICLES.map(art => `
      <div class="academy-card-box" onclick="openAcademyArticle('${art.id}')">
        <span class="academy-category-tag">${art.category}</span>
        <h3 class="academy-title-text">${art.title}</h3>
        <p class="academy-snippet-text">${art.snippet}</p>
        <span class="academy-action-link">Leer Guía →</span>
      </div>
    `).join('');
  }

  window.openAcademyArticle = function(artId) {
    const art = ACADEMY_ARTICLES.find(a => a.id === artId);
    if (!art || !academyModalOverlay) return;

    const contentDiv = document.getElementById('academy-modal-content');
    if (!contentDiv) return;

    contentDiv.innerHTML = `
      <span style="font-size: 0.75rem; font-weight: 700; color: #059669; text-transform: uppercase;">${art.category} · ${art.readTime}</span>
      <h2 style="font-size: 1.6rem; font-weight: 800; color: #111827; margin: 0.4rem 0 1.2rem; line-height: 1.3;">${art.title}</h2>
      <div style="color: #4b5563; font-size: 0.98rem; line-height: 1.7;">
        ${art.fullContent}
      </div>
      <div style="margin-top: 1.8rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.8rem;">
        <span style="font-size: 0.85rem; color: #111827; font-weight: 700;">Flor De Gema · Academia</span>
        <button class="btn-primary-dark" style="padding: 0.6rem 1rem; font-size: 0.85rem;" onclick="window.open('https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=Hola,%20leí%20${encodeURIComponent(art.title)}%20y%20deseo%20asesoría', '_blank')">
          Consultar con Gemólogo
        </button>
      </div>
    `;

    academyModalOverlay.classList.add('open');
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

  // Countdown
  function initCountdown() {
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl) return;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + ((4 + 7 - targetDate.getDay()) % 7 || 7));
    targetDate.setHours(19, 0, 0, 0);

    function update() {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) return;

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minutesEl.textContent = String(m).padStart(2, '0');
      secondsEl.textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  // FAQ
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

  // Contact Form
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

      window.open(`https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`, '_blank');
      form.reset();
    });
  }

  // Search & Sort inputs
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCatalog();
  });

  sortSelect?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCatalog();
  });
});
