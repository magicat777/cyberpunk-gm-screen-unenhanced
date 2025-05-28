// Lore Browser Panel Implementation
class LoreBrowser {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.database = new LoreDatabase();
    this.currentCategory = null;
    this.currentEntry = null;
    this.favorites = this.loadFavorites();
    this.history = [];
    this.historyIndex = -1;
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
    this.showCategoryList();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="lore-browser">
        <div class="lore-header">
          <div class="lore-navigation">
            <button class="lore-nav-btn" id="lore-back" title="Back" disabled>
              <span class="icon">◀</span>
            </button>
            <button class="lore-nav-btn" id="lore-forward" title="Forward" disabled>
              <span class="icon">▶</span>
            </button>
            <button class="lore-nav-btn" id="lore-home" title="Categories">
              <span class="icon">🏠</span>
            </button>
            <button class="lore-nav-btn" id="lore-random" title="Random Entry">
              <span class="icon">🎲</span>
            </button>
            <button class="lore-nav-btn" id="lore-favorites" title="Favorites">
              <span class="icon">⭐</span>
            </button>
          </div>
          
          <div class="lore-search">
            <input type="text" 
              id="lore-search-input" 
              class="neon-input" 
              placeholder="Search lore database..."
              autocomplete="off">
            <div class="search-results-dropdown" id="lore-search-results"></div>
          </div>
        </div>
        
        <div class="lore-breadcrumb" id="lore-breadcrumb"></div>
        
        <div class="lore-content" id="lore-content">
          <div class="loading-spinner">Initializing database...</div>
        </div>
        
        <div class="lore-footer">
          <div class="reading-options">
            <label class="reading-mode-toggle">
              <input type="checkbox" id="reading-mode">
              <span>Enhanced Reading Mode</span>
            </label>
            <button class="text-size-btn" id="decrease-text">A-</button>
            <button class="text-size-btn" id="increase-text">A+</button>
          </div>
          <div class="lore-stats" id="lore-stats"></div>
        </div>
      </div>
    `;
    
    this.updateStats();
  }
  
  attachEventListeners() {
    // Navigation
    document.getElementById('lore-back').addEventListener('click', () => this.navigateBack());
    document.getElementById('lore-forward').addEventListener('click', () => this.navigateForward());
    document.getElementById('lore-home').addEventListener('click', () => this.showCategoryList());
    document.getElementById('lore-random').addEventListener('click', () => this.showRandomEntry());
    document.getElementById('lore-favorites').addEventListener('click', () => this.showFavorites());
    
    // Search
    const searchInput = document.getElementById('lore-search-input');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => this.performSearch(e.target.value), 300);
    });
    
    // Reading options
    document.getElementById('reading-mode').addEventListener('change', (e) => {
      this.toggleReadingMode(e.target.checked);
    });
    
    document.getElementById('decrease-text').addEventListener('click', () => {
      this.adjustTextSize(-1);
    });
    
    document.getElementById('increase-text').addEventListener('click', () => {
      this.adjustTextSize(1);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          if (e.altKey) this.navigateBack();
          break;
        case 'ArrowRight':
          if (e.altKey) this.navigateForward();
          break;
        case '/':
          e.preventDefault();
          searchInput.focus();
          break;
        case 'Escape':
          searchInput.blur();
          this.hideSearchResults();
          break;
      }
    });
  }
  
  showCategoryList() {
    const categories = this.database.getAllCategories();
    const content = document.getElementById('lore-content');
    
    content.innerHTML = `
      <div class="category-grid">
        <h2 class="h2 text-neon">Lore Database</h2>
        <p class="text-reading">Explore the dark future of Night City and beyond. Choose a category to dive deep into the world of Cyberpunk.</p>
        
        <div class="category-cards">
          ${categories.map(cat => `
            <div class="category-card" data-category="${cat.id}">
              <div class="category-icon">${cat.icon}</div>
              <h3 class="h4">${cat.name}</h3>
              <p class="text-sm">${cat.description}</p>
              <div class="category-count">${cat.entryCount} entries</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Attach click handlers
    content.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const categoryId = card.dataset.category;
        this.showCategory(categoryId);
      });
    });
    
    this.updateBreadcrumb(['Home']);
    this.addToHistory({ type: 'home' });
  }
  
  showCategory(categoryId) {
    const category = this.database.getCategory(categoryId);
    if (!category) return;
    
    this.currentCategory = categoryId;
    const content = document.getElementById('lore-content');
    
    content.innerHTML = `
      <div class="category-view">
        <div class="category-header">
          <h2 class="h2">${category.icon} ${category.name}</h2>
          <p class="text-reading">${category.description}</p>
        </div>
        
        <div class="entry-list">
          ${category.entries.map(entry => `
            <div class="entry-card" data-entry="${entry.id}">
              <h3 class="h4">${entry.name}</h3>
              <div class="entry-type">${entry.type}</div>
              <p class="entry-summary">${entry.summary || ''}</p>
              <button class="favorite-btn ${this.isFavorite(categoryId, entry.id) ? 'active' : ''}" 
                data-category="${categoryId}" 
                data-entry="${entry.id}">
                ⭐
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Attach handlers
    content.querySelectorAll('.entry-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.matches('.favorite-btn')) {
          const entryId = card.dataset.entry;
          this.showEntry(categoryId, entryId);
        }
      });
    });
    
    content.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavorite(btn.dataset.category, btn.dataset.entry);
        btn.classList.toggle('active');
      });
    });
    
    this.updateBreadcrumb(['Home', category.name]);
    this.addToHistory({ type: 'category', categoryId });
  }
  
  showEntry(categoryId, entryId) {
    const category = this.database.getCategory(categoryId);
    const entry = this.database.getEntry(categoryId, entryId);
    if (!entry) return;
    
    this.currentCategory = categoryId;
    this.currentEntry = entryId;
    
    const content = document.getElementById('lore-content');
    
    content.innerHTML = `
      <div class="entry-view ${document.getElementById('reading-mode').checked ? 'reading-mode' : ''}">
        <div class="entry-header">
          <h1 class="h2">${entry.name}</h1>
          <div class="entry-meta">
            <span class="entry-type">${entry.type}</span>
            <button class="favorite-btn ${this.isFavorite(categoryId, entryId) ? 'active' : ''}" 
              data-category="${categoryId}" 
              data-entry="${entryId}">
              ⭐ ${this.isFavorite(categoryId, entryId) ? 'Favorited' : 'Add to Favorites'}
            </button>
          </div>
        </div>
        
        ${entry.summary ? `<p class="entry-summary text-reading">${entry.summary}</p>` : ''}
        
        ${this.renderEntryDetails(entry)}
        
        ${this.renderRelatedEntries(categoryId, entryId)}
      </div>
    `;
    
    // Attach favorite handler
    content.querySelector('.favorite-btn').addEventListener('click', (e) => {
      this.toggleFavorite(categoryId, entryId);
      e.target.classList.toggle('active');
      e.target.textContent = e.target.classList.contains('active') 
        ? '⭐ Favorited' 
        : '⭐ Add to Favorites';
    });
    
    // Make links clickable
    content.querySelectorAll('[data-lore-link]').forEach(link => {
      link.addEventListener('click', () => {
        const [linkCat, linkEntry] = link.dataset.loreLink.split(':');
        this.showEntry(linkCat, linkEntry);
      });
    });
    
    this.updateBreadcrumb(['Home', category.name, entry.name]);
    this.addToHistory({ type: 'entry', categoryId, entryId });
  }
  
  renderEntryDetails(entry) {
    if (!entry.details) return '';
    
    const renderValue = (value, key) => {
      if (typeof value === 'string' || typeof value === 'number') {
        return `<span class="detail-value">${value}</span>`;
      }
      
      if (Array.isArray(value)) {
        return `
          <ul class="detail-list">
            ${value.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `;
      }
      
      if (typeof value === 'object' && value !== null) {
        return `
          <div class="detail-nested">
            ${Object.entries(value).map(([k, v]) => `
              <div class="detail-item">
                <span class="detail-key">${this.formatKey(k)}:</span>
                ${renderValue(v, k)}
              </div>
            `).join('')}
          </div>
        `;
      }
      
      return '';
    };
    
    return `
      <div class="entry-details">
        ${Object.entries(entry.details).map(([key, value]) => `
          <div class="detail-section">
            <h3 class="h5">${this.formatKey(key)}</h3>
            ${renderValue(value, key)}
          </div>
        `).join('')}
      </div>
      
      ${entry.gameplayNotes ? `
        <div class="gameplay-notes">
          <h3 class="h5">Gameplay Notes</h3>
          <ul class="notes-list">
            ${entry.gameplayNotes.map(note => `<li>${note}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${entry.terms ? `
        <div class="terms-list">
          ${entry.terms.map(term => `
            <div class="term-item">
              <span class="term">${term.term}</span>
              <span class="definition">${term.definition}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  }
  
  renderRelatedEntries(currentCategory, currentEntry) {
    // Find related entries based on shared keywords or references
    const current = this.database.getEntry(currentCategory, currentEntry);
    if (!current) return '';
    
    const searchText = this.database.extractSearchText(current);
    const keywords = searchText.split(' ')
      .filter(word => word.length > 4)
      .slice(0, 5);
    
    const related = [];
    keywords.forEach(keyword => {
      const results = this.database.search(keyword)
        .filter(r => !(r.categoryId === currentCategory && r.entryId === currentEntry))
        .slice(0, 2);
      related.push(...results);
    });
    
    // Remove duplicates
    const unique = related.filter((item, index, self) =>
      index === self.findIndex(r => r.entryId === item.entryId && r.categoryId === item.categoryId)
    ).slice(0, 5);
    
    if (unique.length === 0) return '';
    
    return `
      <div class="related-entries">
        <h3 class="h5">Related Entries</h3>
        <div class="related-list">
          ${unique.map(item => `
            <div class="related-item" data-lore-link="${item.categoryId}:${item.entryId}">
              <span class="related-category">${item.categoryName}</span>
              <span class="related-name">${item.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  performSearch(query) {
    const resultsContainer = document.getElementById('lore-search-results');
    
    if (!query || query.length < 3) {
      this.hideSearchResults();
      return;
    }
    
    const results = this.database.search(query).slice(0, 10);
    
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
      resultsContainer.style.display = 'block';
      return;
    }
    
    resultsContainer.innerHTML = results.map(result => `
      <div class="search-result-item" data-category="${result.categoryId}" data-entry="${result.entryId}">
        <div class="result-category">${result.categoryName}</div>
        <div class="result-name">${result.name}</div>
        <div class="result-type">${result.type}</div>
      </div>
    `).join('');
    
    resultsContainer.style.display = 'block';
    
    // Attach handlers
    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        this.showEntry(item.dataset.category, item.dataset.entry);
        this.hideSearchResults();
        document.getElementById('lore-search-input').value = '';
      });
    });
  }
  
  hideSearchResults() {
    document.getElementById('lore-search-results').style.display = 'none';
  }
  
  showRandomEntry() {
    const random = this.database.getRandomEntry();
    this.showEntry(random.categoryId, random.entry.id);
  }
  
  showFavorites() {
    const content = document.getElementById('lore-content');
    
    if (this.favorites.length === 0) {
      content.innerHTML = `
        <div class="favorites-empty">
          <h2 class="h2">⭐ Favorites</h2>
          <p class="text-reading">You haven't added any favorites yet. Browse the database and click the star icon to save your favorite entries.</p>
          <button class="btn-primary" onclick="loreBrowser.showCategoryList()">Browse Database</button>
        </div>
      `;
      return;
    }
    
    const favoriteEntries = this.favorites.map(fav => {
      const entry = this.database.getEntry(fav.categoryId, fav.entryId);
      const category = this.database.getCategory(fav.categoryId);
      return { ...entry, categoryId: fav.categoryId, categoryName: category.name };
    }).filter(e => e);
    
    content.innerHTML = `
      <div class="favorites-view">
        <h2 class="h2">⭐ Favorites</h2>
        <div class="entry-list">
          ${favoriteEntries.map(entry => `
            <div class="entry-card" data-category="${entry.categoryId}" data-entry="${entry.id}">
              <div class="entry-category">${entry.categoryName}</div>
              <h3 class="h4">${entry.name}</h3>
              <div class="entry-type">${entry.type}</div>
              <p class="entry-summary">${entry.summary || ''}</p>
              <button class="favorite-btn active" 
                data-category="${entry.categoryId}" 
                data-entry="${entry.id}">
                ⭐
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Attach handlers
    content.querySelectorAll('.entry-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.matches('.favorite-btn')) {
          this.showEntry(card.dataset.category, card.dataset.entry);
        }
      });
    });
    
    content.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavorite(btn.dataset.category, btn.dataset.entry);
        btn.closest('.entry-card').remove();
        
        if (this.favorites.length === 0) {
          this.showFavorites(); // Refresh to show empty state
        }
      });
    });
    
    this.updateBreadcrumb(['Favorites']);
    this.addToHistory({ type: 'favorites' });
  }
  
  toggleFavorite(categoryId, entryId) {
    const index = this.favorites.findIndex(f => 
      f.categoryId === categoryId && f.entryId === entryId
    );
    
    if (index >= 0) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push({ categoryId, entryId });
    }
    
    this.saveFavorites();
  }
  
  isFavorite(categoryId, entryId) {
    return this.favorites.some(f => 
      f.categoryId === categoryId && f.entryId === entryId
    );
  }
  
  loadFavorites() {
    const saved = localStorage.getItem('cyberpunk-lore-favorites');
    return saved ? JSON.parse(saved) : [];
  }
  
  saveFavorites() {
    localStorage.setItem('cyberpunk-lore-favorites', JSON.stringify(this.favorites));
  }
  
  addToHistory(state) {
    // Remove any forward history
    this.history = this.history.slice(0, this.historyIndex + 1);
    
    // Add new state
    this.history.push(state);
    this.historyIndex++;
    
    // Limit history size
    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }
    
    this.updateNavigationButtons();
  }
  
  navigateBack() {
    if (this.historyIndex <= 0) return;
    
    this.historyIndex--;
    this.navigateToHistoryState(this.history[this.historyIndex]);
  }
  
  navigateForward() {
    if (this.historyIndex >= this.history.length - 1) return;
    
    this.historyIndex++;
    this.navigateToHistoryState(this.history[this.historyIndex]);
  }
  
  navigateToHistoryState(state) {
    switch (state.type) {
      case 'home':
        this.showCategoryList();
        break;
      case 'category':
        this.showCategory(state.categoryId);
        break;
      case 'entry':
        this.showEntry(state.categoryId, state.entryId);
        break;
      case 'favorites':
        this.showFavorites();
        break;
    }
    
    // Don't add to history when navigating
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.updateNavigationButtons();
  }
  
  updateNavigationButtons() {
    document.getElementById('lore-back').disabled = this.historyIndex <= 0;
    document.getElementById('lore-forward').disabled = this.historyIndex >= this.history.length - 1;
  }
  
  updateBreadcrumb(path) {
    const breadcrumb = document.getElementById('lore-breadcrumb');
    breadcrumb.innerHTML = path.map((item, index) => {
      if (index === path.length - 1) {
        return `<span class="breadcrumb-current">${item}</span>`;
      }
      return `<span class="breadcrumb-item">${item}</span>`;
    }).join(' <span class="breadcrumb-separator">›</span> ');
  }
  
  toggleReadingMode(enabled) {
    const content = document.querySelector('.entry-view');
    if (content) {
      content.classList.toggle('reading-mode', enabled);
    }
    localStorage.setItem('cyberpunk-reading-mode', enabled);
  }
  
  adjustTextSize(direction) {
    const root = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(root).getPropertyValue('--font-size-base')) || 1;
    const newSize = Math.max(0.875, Math.min(1.5, currentSize + (direction * 0.125)));
    root.style.setProperty('--font-size-base', `${newSize}rem`);
    localStorage.setItem('cyberpunk-text-size', newSize);
  }
  
  updateStats() {
    const stats = document.getElementById('lore-stats');
    const totalEntries = Object.values(this.database.categories)
      .reduce((sum, cat) => sum + cat.entries.length, 0);
    
    stats.innerHTML = `
      <span>${Object.keys(this.database.categories).length} categories</span>
      <span>•</span>
      <span>${totalEntries} entries</span>
      <span>•</span>
      <span>${this.favorites.length} favorites</span>
    `;
  }
  
  formatKey(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('lore-browser-content')) {
    window.loreBrowser = new LoreBrowser('lore-browser-content');
  }
});