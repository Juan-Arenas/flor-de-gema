// ==========================================================================
// FLOR DE GEMA - INTERACTIVE LOGIC & GEMOLOGICAL ENGINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // State
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
  const wishlistDrawerOverlay = document.getElementById('wishlist-drawer-overlay');
  const wishlistDrawerBody = document.getElementById('wishlist-drawer-body');
  const sendWishlistWaBtn = document.getElementById('send-wishlist-wa-btn');

  // Tech Sheet Modal Elements
  const techModalOverlay = document.getElementById('tech-modal-overlay');
  const techModalCloseBtn = document.getElementById('tech-modal-close-btn');

  // Academy Modal Elements
  const academyModalOverlay = document.getElementById('academy-modal-overlay');
  const academyModalCloseBtn = document.getElementById('academy-modal-close-btn');

  // Mobile Menu Elements
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  // Initialize
  initCategories();
  renderCatalog();
  renderAcademyArticles();
  updateWishlistUI();
  initCountdown();
  initFAQ();
  initContactForm();

  // Category filter pills initialization
  function initCategories() {
    if (!filterPillsContainer) return;
    filterPillsContainer.innerHTML = GEM_CATEGORIES.map(cat => `
      <button class="filter-pill ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join('');

    filterPillsContainer.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        filterPillsContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderCatalog();
      });
    });

    // Also handle category cards click in section 2
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const catId = card.dataset.category;
        if (catId) {
          currentCategory = catId;
          const targetPill = filterPillsContainer.querySelector(`[data-category="${catId}"]`);
          if (targetPill) {
            filterPillsContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
            targetPill.classList.add('active');
          }
          renderCatalog();
          document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Filter and Sort Gemstones
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

  // Format currency helpers
  function formatCOP(num) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num);
  }
  function formatUSD(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  }

  // Render Gemstones Catalog
  function renderCatalog() {
    if (!catalogGrid) return;
    const gems = getFilteredGemstones();

    if (gems.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</p>
          <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem;">No se encontraron gemas con estos criterios</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Intenta con otra categoría o consulta a nuestro gemólogo para solicitudes especiales.</p>
          <button class="btn-primary" onclick="resetFilters()">Ver Todas las Gemas</button>
        </div>
      `;
      return;
    }

    catalogGrid.innerHTML = gems.map(gem => {
      const isSaved = wishlist.includes(gem.id);
      return `
        <div class="gem-product-card" data-id="${gem.id}">
          <div class="gem-card-header" onclick="openTechSheet('${gem.id}')">
            <img src="${gem.image}" alt="${gem.name}" loading="lazy">
            <span class="gem-badge">${gem.badge || gem.shape}</span>
            <button class="gem-favorite-btn ${isSaved ? 'active' : ''}" 
                    title="${isSaved ? 'Quitar de guardados' : 'Guardar gema'}" 
                    onclick="event.stopPropagation(); toggleWishlist('${gem.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <div class="gem-card-body">
            <div class="gem-card-ref">REF: ${gem.id} · ${gem.origin.split(',')[0]}</div>
            <h3 class="gem-card-title">${gem.name}</h3>

            <div class="gem-card-spec-tags">
              <span class="spec-mini-tag">💎 ${gem.carats} ct</span>
              <span class="spec-mini-tag">📐 ${gem.dimensions}</span>
              <span class="spec-mini-tag">✨ ${gem.shape}</span>
            </div>

            <div class="gem-card-price-row">
              <div class="gem-price-cop">${formatCOP(gem.priceCOP)}</div>
              <div class="gem-price-usd">~ ${formatUSD(gem.priceUSD)} USD</div>
            </div>

            <div class="gem-card-actions">
              <button class="btn-card-tech" onclick="openTechSheet('${gem.id}')">
                📋 Ficha Técnica
              </button>
              <button class="btn-card-wa" onclick="sendWhatsAppInquiry('${gem.id}')">
                <span>💬</span> Apartar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Wishlist Handling
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
        <div class="empty-wishlist-msg">
          <p style="font-size: 2.2rem; margin-bottom: 0.8rem;">💎</p>
          <p style="font-weight: 600; color: #fff;">Tu selección está vacía</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">Haz clic en el icono de guardar en cualquier gema para cotizarlas en conjunto por WhatsApp.</p>
        </div>
      `;
      if (sendWishlistWaBtn) sendWishlistWaBtn.style.display = 'none';
      return;
    }

    if (sendWishlistWaBtn) sendWishlistWaBtn.style.display = 'flex';

    wishlistDrawerBody.innerHTML = savedGems.map(gem => `
      <div class="wishlist-item-card">
        <img src="${gem.image}" alt="${gem.name}">
        <div class="wishlist-item-details">
          <div class="wishlist-item-title">${gem.name}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${gem.carats} ct · ${gem.shape}</div>
          <div class="wishlist-item-price">${formatCOP(gem.priceCOP)}</div>
          <div class="remove-wishlist-btn" onclick="toggleWishlist('${gem.id}')">✕ Quitar</div>
        </div>
      </div>
    `).join('');
  }

  // Open & Close Wishlist Drawer
  window.openWishlist = function() {
    wishlistDrawer?.classList.add('open');
    wishlistDrawerOverlay?.classList.add('visible');
  };

  window.closeWishlist = function() {
    wishlistDrawer?.classList.remove('open');
    wishlistDrawerOverlay?.classList.remove('visible');
  };

  // WhatsApp Inquiry for Single Gemstone
  window.sendWhatsAppInquiry = function(gemId) {
    const gem = GEMSTONES.find(g => g.id === gemId);
    if (!gem) return;

    const message = `Hola Flor De Gema, estoy interesado(a) en la gema:
- *${gem.name}* (Ref: ${gem.id})
- Peso: ${gem.carats} quilates
- Talla: ${gem.cut}
- Origen: ${gem.origin}
- Precio de referencia: ${formatCOP(gem.priceCOP)}

¿Sigue disponible? Me gustaría recibir video en alta resolución e información para coordinar la compra y envío asegurado. Gracias!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=${encoded}`, '_blank');
  };

  // WhatsApp Inquiry for Entire Wishlist
  if (sendWishlistWaBtn) {
    sendWishlistWaBtn.addEventListener('click', () => {
      const savedGems = GEMSTONES.filter(g => wishlist.includes(g.id));
      if (savedGems.length === 0) return;

      let itemsList = savedGems.map((g, i) => `${i + 1}. *${g.name}* (${g.id}) - ${g.carats} ct - ${formatCOP(g.priceCOP)}`).join('\n');

      const message = `Hola Flor De Gema, he seleccionado las siguientes gemas de su catálogo web para cotización especial:

${itemsList}

¿Podrían confirmarme disponibilidad y condiciones especiales para este lote? Mi eslogan favorito: "Flor De Gema, Invierte en belleza eterna".`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=${encoded}`, '_blank');
    });
  }

  // Tech Sheet Modal Details
  window.openTechSheet = function(gemId) {
    const gem = GEMSTONES.find(g => g.id === gemId);
    if (!gem || !techModalOverlay) return;

    const modalBody = document.getElementById('tech-modal-content');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-grid">
        <div class="modal-media-col">
          <div class="modal-img-container">
            <img src="${gem.image}" alt="${gem.name}">
          </div>
          <div class="modal-cert-badge">
            <span style="font-size: 1.5rem;">📜</span>
            <div>
              <div style="font-weight: 700; color: #fff; font-size: 0.88rem;">Reporte Gemológico Oficial</div>
              <div style="font-size: 0.78rem; color: var(--text-gold); font-family: monospace;">${gem.reportNumber}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${gem.lab}</div>
            </div>
          </div>
        </div>

        <div class="modal-details-col">
          <div class="modal-ref-id">Ficha Técnica Oficial · Ref: ${gem.id}</div>
          <h2 class="modal-gem-title">${gem.name}</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem;">${gem.description}</p>

          <table class="spec-table">
            <tbody>
              <tr>
                <th>Peso en quilates</th>
                <td>${gem.carats} ct</td>
              </tr>
              <tr>
                <th>Medidas (mm)</th>
                <td>${gem.dimensions}</td>
              </tr>
              <tr>
                <th>Forma y Talla</th>
                <td>${gem.shape} · ${gem.cut}</td>
              </tr>
              <tr>
                <th>Color y Saturación</th>
                <td>${gem.color}</td>
              </tr>
              <tr>
                <th>Claridad e Inclusiones</th>
                <td>${gem.clarity}</td>
              </tr>
              <tr>
                <th>Tratamientos Conocidos</th>
                <td>${gem.treatment}</td>
              </tr>
              <tr>
                <th>Origen Documentado</th>
                <td>${gem.origin}</td>
              </tr>
              <tr>
                <th>Certificado / Laboratorio</th>
                <td>${gem.lab}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin: 1rem 0; display: flex; align-items: baseline; gap: 1rem;">
            <span style="font-size: 1.6rem; font-weight: 800; color: var(--text-gold);">${formatCOP(gem.priceCOP)}</span>
            <span style="color: var(--text-muted); font-size: 0.95rem;">(~ ${formatUSD(gem.priceUSD)} USD)</span>
          </div>

          <div class="modal-footer-actions">
            <button class="btn-primary" style="flex: 1; justify-content: center;" onclick="sendWhatsAppInquiry('${gem.id}')">
              <span>💬</span> Apartar por WhatsApp
            </button>
            <button class="btn-secondary" onclick="toggleWishlist('${gem.id}'); closeTechSheet();">
              ${wishlist.includes(gem.id) ? '✓ Guardada' : '⭐ Guardar'}
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

  // Close modals on outside click
  techModalOverlay?.addEventListener('click', (e) => {
    if (e.target === techModalOverlay) closeTechSheet();
  });
  techModalCloseBtn?.addEventListener('click', closeTechSheet);

  // Academy Articles
  function renderAcademyArticles() {
    const grid = document.getElementById('academy-grid');
    if (!grid) return;

    grid.innerHTML = ACADEMY_ARTICLES.map(art => `
      <div class="academy-card" onclick="openAcademyArticle('${art.id}')">
        <div class="academy-card-meta">
          <span class="academy-cat-pill">${art.category}</span>
          <span class="academy-read-time">⏱️ ${art.readTime}</span>
        </div>
        <h3 class="academy-card-title">${art.title}</h3>
        <p class="academy-card-snippet">${art.snippet}</p>
        <span class="academy-read-more">Leer Guía Completa →</span>
      </div>
    `).join('');
  }

  window.openAcademyArticle = function(artId) {
    const art = ACADEMY_ARTICLES.find(a => a.id === artId);
    if (!art || !academyModalOverlay) return;

    const contentDiv = document.getElementById('academy-modal-content');
    if (!contentDiv) return;

    contentDiv.innerHTML = `
      <div style="padding: 2.5rem 2rem;">
        <span class="section-label">${art.category} · ${art.readTime}</span>
        <h2 style="font-family: var(--font-serif); font-size: 2rem; color: #fff; margin: 0.5rem 0 1.5rem; line-height: 1.25;">${art.title}</h2>
        <div style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8;">
          ${art.fullContent}
        </div>
        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <span style="font-size: 0.85rem; color: var(--text-gold); font-weight: 600;">Flor De Gema · Academia Gemológica</span>
          <button class="btn-whatsapp-outline" onclick="window.open('https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=Hola,%20leí%20el%20artículo%20${encodeURIComponent(art.title)}%20en%20su%20web%20y%20quisiera%20asesoría%20sobre%20una%20gema', '_blank')">
            Consultar con un Gemólogo
          </button>
        </div>
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

  // Live Stream Countdown Widget
  function initCountdown() {
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl) return;

    // Set target date (next Thursday/Sunday evening at 7:00 PM)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + ((4 + 7 - targetDate.getDay()) % 7 || 7));
    targetDate.setHours(19, 0, 0, 0);

    function update() {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

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

    update();
    setInterval(update, 1000);
  }

  // FAQ Accordion
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question');
      question?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  // Contact / Quote Form
  function initContactForm() {
    const form = document.getElementById('custom-quote-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('quote-name')?.value || '';
      const gemType = document.getElementById('quote-gem-type')?.value || '';
      const budget = document.getElementById('quote-budget')?.value || '';
      const message = document.getElementById('quote-msg')?.value || '';

      const waText = `Hola Flor De Gema, solicito asesoría personalizada para una gema:
- *Nombre:* ${name}
- *Gema de interés:* ${gemType}
- *Presupuesto aprox:* ${budget}
- *Detalles:* ${message}

Eslogan: "Flor De Gema, Invierte en belleza eterna"`;

      window.open(`https://wa.me/${FLOR_DE_GEMA_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`, '_blank');
      form.reset();
    });
  }

  // Search input & Sort change listener
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCatalog();
  });

  sortSelect?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCatalog();
  });

  // Mobile drawer controls
  mobileMenuToggle?.addEventListener('click', () => {
    mobileNavDrawer?.classList.add('open');
    mobileDrawerOverlay?.classList.add('visible');
  });

  function closeMobileDrawer() {
    mobileNavDrawer?.classList.remove('open');
    mobileDrawerOverlay?.classList.remove('visible');
  }

  mobileDrawerClose?.addEventListener('click', closeMobileDrawer);
  mobileDrawerOverlay?.addEventListener('click', closeMobileDrawer);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // Global reset filters
  window.resetFilters = function() {
    currentCategory = 'all';
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    initCategories();
    renderCatalog();
  };
});
