class EnhancedLoreDatabase {
  constructor(container) {
    this.container = container;
    this.currentCategory = 'all';
    this.searchTerm = '';
    this.bookmarks = this.loadBookmarks();
    this.recentHistory = this.loadHistory();
    this.loreData = this.initializeLoreDatabase();
    this.init();
  }

  initializeLoreDatabase() {
    return {
      corporations: [
        {
          id: 'arasaka',
          title: 'Arasaka Corporation',
          category: 'corporations',
          content: 'The largest and most powerful megacorporation in the world. Founded in 1915 by Sasai Arasaka, it controls banking, manufacturing, and security services globally. Known for their ruthless business practices and advanced technology.',
          tags: ['megacorp', 'japanese', 'security', 'banking'],
          lastUpdated: Date.now() - 86400000
        },
        {
          id: 'militech',
          title: 'Militech International',
          category: 'corporations',
          content: 'The premier weapons and military technology corporation. Militech provides military hardware, cybernetics, and security services. Often in direct competition with Arasaka for government contracts.',
          tags: ['megacorp', 'weapons', 'military', 'american'],
          lastUpdated: Date.now() - 172800000
        },
        {
          id: 'biotechnica',
          title: 'Biotechnica',
          category: 'corporations',
          content: 'Specializes in biotechnology, pharmaceuticals, and food production. Controls much of the world\'s food supply through genetically modified crops and artificial proteins.',
          tags: ['biotech', 'food', 'pharmaceuticals', 'genetics'],
          lastUpdated: Date.now() - 259200000
        },
        {
          id: 'netwatch',
          title: 'NetWatch',
          category: 'corporations',
          content: 'The Net monitoring and security organization. NetWatch agents patrol cyberspace, hunting rogue AIs and maintaining Net infrastructure. Often seen as both protectors and oppressors.',
          tags: ['netrunning', 'security', 'ai', 'cyberspace'],
          lastUpdated: Date.now() - 345600000
        },
        {
          id: 'zetatech',
          title: 'Zetatech',
          category: 'corporations',
          content: 'Specializes in cybernetics and neural interface technology. Known for high-quality but expensive cyberware, often favored by corporate executives and elite solos.',
          tags: ['cybernetics', 'neural', 'luxury', 'technology'],
          lastUpdated: Date.now() - 432000000
        }
      ],
      gangs: [
        {
          id: 'valentinos',
          title: 'Valentinos',
          category: 'gangs',
          content: 'A Latino gang that controls parts of Heywood. Known for their strong family values, Day of the Dead aesthetics, and fierce loyalty. They\'re involved in drug trafficking, protection rackets, and street racing.',
          tags: ['latino', 'heywood', 'family', 'drugs', 'racing'],
          lastUpdated: Date.now() - 518400000
        },
        {
          id: 'maelstrom',
          title: 'Maelstrom',
          category: 'gangs',
          content: 'Cyberpunk gang obsessed with body modification and technology. Members often replace large portions of their bodies with crude cyberware. They worship technology and see flesh as weakness.',
          tags: ['cyberware', 'technology', 'modification', 'watson'],
          lastUpdated: Date.now() - 604800000
        },
        {
          id: 'tyger-claws',
          title: 'Tyger Claws',
          category: 'gangs',
          content: 'Japanese-influenced gang that controls most of Japantown. They run pachinko parlors, braindance studios, and prostitution rings. Known for their honor code and yakuza traditions.',
          tags: ['japanese', 'japantown', 'braindance', 'honor', 'yakuza'],
          lastUpdated: Date.now() - 691200000
        },
        {
          id: 'animals',
          title: 'Animals',
          category: 'gangs',
          content: 'Gang that enhances their bodies with animal-based drugs and hormones. They eschew cyberware in favor of biological enhancement, making them incredibly strong but unstable.',
          tags: ['biological', 'drugs', 'enhancement', 'pacifica'],
          lastUpdated: Date.now() - 777600000
        },
        {
          id: 'sixth-street',
          title: 'Sixth Street Gang',
          category: 'gangs',
          content: 'Formed from former soldiers and veterans. They see themselves as protectors of their community but have devolved into another gang. Known for military tactics and patriotic imagery.',
          tags: ['veterans', 'military', 'community', 'patriotic'],
          lastUpdated: Date.now() - 864000000
        }
      ],
      locations: [
        {
          id: 'night-city',
          title: 'Night City',
          category: 'locations',
          content: 'The City of Dreams on the shores of Del Coronado Bay. Night City is an autonomous corporate city-state, officially neutral in corporate wars. Six major districts divide the sprawling metropolis.',
          tags: ['city', 'autonomous', 'bay', 'corporate'],
          lastUpdated: Date.now() - 950400000
        },
        {
          id: 'arasaka-tower',
          title: 'Arasaka Tower',
          category: 'locations',
          content: 'The massive corporate headquarters of Arasaka Corporation in City Center. This fortress-like structure serves as both office complex and symbol of corporate power in Night City.',
          tags: ['arasaka', 'corporate', 'tower', 'city-center'],
          lastUpdated: Date.now() - 1036800000
        },
        {
          id: 'afterlife',
          title: 'Afterlife Bar',
          category: 'locations',
          content: 'The most famous mercenary bar in Night City, located in Watson. Named after the drinks honoring dead legends, it\'s where fixers meet their crews and deals are made.',
          tags: ['bar', 'mercenary', 'watson', 'fixers'],
          lastUpdated: Date.now() - 1123200000
        },
        {
          id: 'combat-zone',
          title: 'The Combat Zone',
          category: 'locations',
          content: 'Areas of Night City abandoned by law enforcement and corporate security. These lawless regions are controlled by gangs and are extremely dangerous for civilians.',
          tags: ['lawless', 'gangs', 'dangerous', 'abandoned'],
          lastUpdated: Date.now() - 1209600000
        },
        {
          id: 'badlands',
          title: 'The Badlands',
          category: 'locations',
          content: 'The wasteland surrounding Night City. Home to nomad clans, hidden corporate facilities, and scavengers. A harsh environment where only the strong survive.',
          tags: ['wasteland', 'nomads', 'survival', 'corporate'],
          lastUpdated: Date.now() - 1296000000
        }
      ],
      technology: [
        {
          id: 'braindance',
          title: 'Braindance (BD)',
          category: 'technology',
          content: 'Technology that allows users to experience recorded memories and sensations of others. Used for entertainment, training, and investigation. Highly addictive and sometimes illegal.',
          tags: ['memories', 'entertainment', 'addictive', 'neural'],
          lastUpdated: Date.now() - 1382400000
        },
        {
          id: 'cyberware',
          title: 'Cyberware',
          category: 'technology',
          content: 'Cybernetic implants that enhance or replace human body parts. Ranges from simple data storage to full body replacement. Extensive use can lead to cyberpsychosis.',
          tags: ['implants', 'enhancement', 'cyberpsychosis', 'body'],
          lastUpdated: Date.now() - 1468800000
        },
        {
          id: 'netrunning',
          title: 'Netrunning',
          category: 'technology',
          content: 'The art of hacking into computer systems through direct neural interface. Netrunners use specialized cyberware to navigate cyberspace and break through ICE (Intrusion Countermeasures Electronics).',
          tags: ['hacking', 'neural', 'cyberspace', 'ice'],
          lastUpdated: Date.now() - 1555200000
        },
        {
          id: 'artificial-intelligence',
          title: 'Artificial Intelligence',
          category: 'technology',
          content: 'Advanced AI systems that can think and learn. True AIs are extremely rare and often hunted by NetWatch. Rogue AIs pose significant threats to human civilization.',
          tags: ['ai', 'rogue', 'netwatch', 'threat'],
          lastUpdated: Date.now() - 1641600000
        },
        {
          id: 'smart-weapons',
          title: 'Smart Weapons',
          category: 'technology',
          content: 'Firearms linked to targeting cyberware that can lock onto targets and guide projectiles. Requires compatible smartlink cyberware to function properly.',
          tags: ['weapons', 'targeting', 'smartlink', 'firearms'],
          lastUpdated: Date.now() - 1728000000
        }
      ],
      history: [
        {
          id: 'fourth-corporate-war',
          title: 'Fourth Corporate War',
          category: 'history',
          content: 'Devastating conflict between Arasaka and Militech from 2021-2023. Ended with the destruction of Arasaka Tower and the DataKrash, which severely damaged the global Net.',
          tags: ['war', 'arasaka', 'militech', 'datakrash'],
          lastUpdated: Date.now() - 1814400000
        },
        {
          id: 'red-decades',
          title: 'The Red Decades (2020s-2040s)',
          category: 'history',
          content: 'Period following the Fourth Corporate War characterized by environmental disaster, economic collapse, and the rebuilding of civilization. Red skies from atmospheric dust gave the era its name.',
          tags: ['disaster', 'collapse', 'rebuilding', 'environment'],
          lastUpdated: Date.now() - 1900800000
        },
        {
          id: 'datakrash',
          title: 'The DataKrash',
          category: 'history',
          content: 'Catastrophic event in 2023 that destroyed much of the old Net. Caused by rogue AIs and the corporate war, it led to the fragmented modern Net architecture.',
          tags: ['net', 'crash', 'ai', 'corporate-war'],
          lastUpdated: Date.now() - 1987200000
        },
        {
          id: 'unification-war',
          title: 'Unification War',
          category: 'history',
          content: 'Conflict in the 1990s where the New United States attempted to reclaim the Free States. Night City remained neutral and autonomous throughout the conflict.',
          tags: ['war', 'independence', 'night-city', 'neutral'],
          lastUpdated: Date.now() - 2073600000
        },
        {
          id: 'collapse',
          title: 'The Collapse (1994-2000)',
          category: 'history',
          content: 'Economic and environmental crisis that led to the breakdown of many national governments. Corporations filled the power vacuum, leading to the corporate-dominated world.',
          tags: ['economic', 'environmental', 'government', 'corporate'],
          lastUpdated: Date.now() - 2160000000
        }
      ],
      culture: [
        {
          id: 'rockerboy',
          title: 'Rockerboy Culture',
          category: 'culture',
          content: 'Musical rebels who use their art to fight corporate oppression. Rockerboys inspire the masses and often lead resistance movements against the system.',
          tags: ['music', 'rebellion', 'corporate', 'resistance'],
          lastUpdated: Date.now() - 2246400000
        },
        {
          id: 'nomad-families',
          title: 'Nomad Families',
          category: 'culture',
          content: 'Tribal groups that rejected corporate society and live in the wasteland. Organized into families and clans, they survive through trade, salvage, and mutual aid.',
          tags: ['tribal', 'family', 'wasteland', 'trade'],
          lastUpdated: Date.now() - 2332800000
        },
        {
          id: 'street-fashion',
          title: 'Street Fashion',
          category: 'culture',
          content: 'Cyberpunk fashion emphasizes functionality, rebellion, and body modification. Chrome, leather, neon colors, and visible cyberware are common elements.',
          tags: ['fashion', 'cyberpunk', 'chrome', 'modification'],
          lastUpdated: Date.now() - 2419200000
        },
        {
          id: 'screamsheets',
          title: 'Screamsheets',
          category: 'culture',
          content: 'Sensationalist digital news media that prioritizes entertainment over truth. The modern equivalent of tabloid journalism in the corporate media landscape.',
          tags: ['media', 'news', 'sensationalist', 'corporate'],
          lastUpdated: Date.now() - 2505600000
        },
        {
          id: 'chrome-rock',
          title: 'Chrome Rock',
          category: 'culture',
          content: 'Musical genre that emerged in the 2040s, characterized by synthesized sounds, aggressive beats, and anti-corporate lyrics. Popular in underground clubs.',
          tags: ['music', 'synthesized', 'anti-corporate', 'underground'],
          lastUpdated: Date.now() - 2592000000
        }
      ]
    };
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <style>
        .lore-database {
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: var(--font-primary);
        }
        
        .lore-header {
          background: var(--bg-surface);
          border-bottom: 2px solid var(--primary);
          padding: 15px;
          flex-shrink: 0;
        }
        
        .lore-search-row {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .lore-category-tabs {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }
        
        .lore-tab {
          padding: 8px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          text-transform: uppercase;
          transition: all 0.3s;
        }
        
        .lore-tab.active {
          background: var(--primary);
          color: var(--bg-primary);
          border-color: var(--primary);
          box-shadow: 0 0 10px var(--primary-glow);
        }
        
        .lore-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        
        .lore-sidebar {
          width: 250px;
          background: var(--bg-surface);
          border-right: 1px solid var(--border-color);
          overflow-y: auto;
          flex-shrink: 0;
        }
        
        .lore-main {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: var(--bg-tertiary);
        }
        
        .lore-list-item {
          padding: 12px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .lore-list-item:hover {
          background: var(--bg-hover);
          border-left: 3px solid var(--primary);
        }
        
        .lore-list-item.active {
          background: var(--primary);
          color: var(--bg-primary);
        }
        
        .lore-item-title {
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .lore-item-category {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--text-tertiary);
          margin-bottom: 4px;
        }
        
        .lore-item-tags {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        
        .lore-tag {
          background: var(--bg-quaternary);
          padding: 2px 6px;
          font-size: 10px;
          border-radius: 2px;
          color: var(--text-tertiary);
        }
        
        .lore-detail {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 20px;
          max-width: 600px;
        }
        
        .lore-detail-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
        }
        
        .lore-detail-title {
          font-size: 20px;
          font-weight: bold;
          color: var(--primary);
        }
        
        .lore-detail-actions {
          display: flex;
          gap: 10px;
        }
        
        .lore-bookmark-btn {
          background: none;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 5px 10px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s;
        }
        
        .lore-bookmark-btn.bookmarked {
          background: var(--accent);
          color: var(--bg-primary);
          border-color: var(--accent);
        }
        
        .lore-detail-content {
          line-height: 1.6;
          margin-bottom: 15px;
        }
        
        .lore-detail-meta {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: var(--text-tertiary);
          border-top: 1px solid var(--border-color);
          padding-top: 10px;
        }
        
        .lore-stats {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 15px;
          margin-bottom: 20px;
        }
        
        .lore-stats-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: var(--primary);
        }
        
        .lore-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        
        .lore-stat {
          text-align: center;
          padding: 8px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
        }
        
        .lore-stat-value {
          font-size: 18px;
          font-weight: bold;
          color: var(--primary);
        }
        
        .lore-stat-label {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--text-tertiary);
        }
        
        .lore-recent {
          margin-top: 15px;
        }
        
        .lore-recent-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }
        
        .lore-recent-item {
          padding: 6px 8px;
          background: var(--bg-quaternary);
          border-left: 3px solid var(--accent);
          margin-bottom: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .lore-recent-item:hover {
          background: var(--bg-hover);
        }
        
        .lore-placeholder {
          text-align: center;
          color: var(--text-tertiary);
          padding: 40px;
          font-style: italic;
        }
      </style>
      
      <div class="lore-database">
        <div class="lore-header">
          <div class="lore-search-row">
            <neon-input
              class="lore-search"
              placeholder="Search lore database..."
              style="flex: 1;"
            ></neon-input>
            <holo-button class="clear-search-btn" variant="secondary">Clear</holo-button>
          </div>
          
          <div class="lore-category-tabs">
            <button class="lore-tab active" data-category="all">All</button>
            <button class="lore-tab" data-category="corporations">Corporations</button>
            <button class="lore-tab" data-category="gangs">Gangs</button>
            <button class="lore-tab" data-category="locations">Locations</button>
            <button class="lore-tab" data-category="technology">Technology</button>
            <button class="lore-tab" data-category="history">History</button>
            <button class="lore-tab" data-category="culture">Culture</button>
            <button class="lore-tab" data-category="bookmarks">Bookmarks</button>
          </div>
        </div>
        
        <div class="lore-content">
          <div class="lore-sidebar">
            <div class="lore-list"></div>
          </div>
          
          <div class="lore-main">
            <div class="lore-stats">
              <div class="lore-stats-title">Database Statistics</div>
              <div class="lore-stats-grid">
                <div class="lore-stat">
                  <div class="lore-stat-value">${this.getTotalEntries()}</div>
                  <div class="lore-stat-label">Total Entries</div>
                </div>
                <div class="lore-stat">
                  <div class="lore-stat-value">${this.bookmarks.length}</div>
                  <div class="lore-stat-label">Bookmarks</div>
                </div>
                <div class="lore-stat">
                  <div class="lore-stat-value">${this.recentHistory.length}</div>
                  <div class="lore-stat-label">Recent Views</div>
                </div>
              </div>
            </div>
            
            <div class="lore-recent">
              <div class="lore-recent-title">Recently Viewed</div>
              ${this.renderRecentHistory()}
            </div>
            
            <div class="lore-detail-container"></div>
          </div>
        </div>
      </div>
    `;
    
    this.updateLoreList();
  }

  attachEventListeners() {
    const searchInput = this.container.querySelector('.lore-search');
    const clearBtn = this.container.querySelector('.clear-search-btn');
    const categoryTabs = this.container.querySelectorAll('.lore-tab');
    
    searchInput.addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this.updateLoreList();
    });
    
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      this.searchTerm = '';
      this.updateLoreList();
    });
    
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentCategory = tab.dataset.category;
        this.updateLoreList();
      });
    });
  }

  updateLoreList() {
    const loreList = this.container.querySelector('.lore-list');
    const entries = this.getFilteredEntries();
    
    loreList.innerHTML = entries.map(entry => `
      <div class="lore-list-item" data-id="${entry.id}" data-category="${entry.category}">
        <div class="lore-item-title">${entry.title}</div>
        <div class="lore-item-category">${entry.category}</div>
        <div class="lore-item-tags">
          ${entry.tags.map(tag => `<span class="lore-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `).join('');
    
    loreList.querySelectorAll('.lore-list-item').forEach(item => {
      item.addEventListener('click', () => {
        this.showLoreDetail(item.dataset.id, item.dataset.category);
        loreList.querySelectorAll('.lore-list-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  getFilteredEntries() {
    let entries = [];
    
    if (this.currentCategory === 'all') {
      Object.values(this.loreData).forEach(category => entries.push(...category));
    } else if (this.currentCategory === 'bookmarks') {
      entries = this.getBookmarkedEntries();
    } else if (this.loreData[this.currentCategory]) {
      entries = this.loreData[this.currentCategory];
    }
    
    if (this.searchTerm) {
      entries = entries.filter(entry => 
        entry.title.toLowerCase().includes(this.searchTerm) ||
        entry.content.toLowerCase().includes(this.searchTerm) ||
        entry.tags.some(tag => tag.toLowerCase().includes(this.searchTerm))
      );
    }
    
    return entries.sort((a, b) => a.title.localeCompare(b.title));
  }

  getBookmarkedEntries() {
    const bookmarked = [];
    Object.values(this.loreData).forEach(category => {
      category.forEach(entry => {
        if (this.bookmarks.includes(entry.id)) {
          bookmarked.push(entry);
        }
      });
    });
    return bookmarked;
  }

  showLoreDetail(entryId, category) {
    const entry = this.loreData[category]?.find(e => e.id === entryId);
    if (!entry) return;
    
    this.addToHistory(entryId);
    
    const detailContainer = this.container.querySelector('.lore-detail-container');
    const isBookmarked = this.bookmarks.includes(entryId);
    
    detailContainer.innerHTML = `
      <div class="lore-detail">
        <div class="lore-detail-header">
          <div class="lore-detail-title">${entry.title}</div>
          <div class="lore-detail-actions">
            <button class="lore-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                    data-id="${entryId}">
              ${isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
            </button>
          </div>
        </div>
        
        <div class="lore-detail-content">
          ${entry.content}
        </div>
        
        <div class="lore-detail-meta">
          <span>Category: ${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}</span>
          <span>Tags: ${entry.tags.join(', ')}</span>
          <span>Updated: ${this.formatDate(entry.lastUpdated)}</span>
        </div>
      </div>
    `;
    
    const bookmarkBtn = detailContainer.querySelector('.lore-bookmark-btn');
    bookmarkBtn.addEventListener('click', () => {
      this.toggleBookmark(entryId);
      this.showLoreDetail(entryId, category);
      this.updateStats();
    });
  }

  toggleBookmark(entryId) {
    const index = this.bookmarks.indexOf(entryId);
    if (index > -1) {
      this.bookmarks.splice(index, 1);
    } else {
      this.bookmarks.push(entryId);
    }
    this.saveBookmarks();
  }

  addToHistory(entryId) {
    const index = this.recentHistory.indexOf(entryId);
    if (index > -1) {
      this.recentHistory.splice(index, 1);
    }
    this.recentHistory.unshift(entryId);
    this.recentHistory = this.recentHistory.slice(0, 10);
    this.saveHistory();
  }

  renderRecentHistory() {
    if (this.recentHistory.length === 0) {
      return '<div class="lore-placeholder">No recent entries</div>';
    }
    
    return this.recentHistory.map(entryId => {
      const entry = this.findEntryById(entryId);
      if (!entry) return '';
      
      return `
        <div class="lore-recent-item" data-id="${entryId}" data-category="${entry.category}">
          ${entry.title}
        </div>
      `;
    }).join('');
  }

  findEntryById(entryId) {
    for (const category of Object.values(this.loreData)) {
      const entry = category.find(e => e.id === entryId);
      if (entry) return entry;
    }
    return null;
  }

  getTotalEntries() {
    return Object.values(this.loreData).reduce((total, category) => total + category.length, 0);
  }

  updateStats() {
    const statsGrid = this.container.querySelector('.lore-stats-grid');
    if (statsGrid) {
      statsGrid.innerHTML = `
        <div class="lore-stat">
          <div class="lore-stat-value">${this.getTotalEntries()}</div>
          <div class="lore-stat-label">Total Entries</div>
        </div>
        <div class="lore-stat">
          <div class="lore-stat-value">${this.bookmarks.length}</div>
          <div class="lore-stat-label">Bookmarks</div>
        </div>
        <div class="lore-stat">
          <div class="lore-stat-value">${this.recentHistory.length}</div>
          <div class="lore-stat-label">Recent Views</div>
        </div>
      `;
    }
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  loadBookmarks() {
    try {
      return JSON.parse(localStorage.getItem('cyberpunk-lore-bookmarks') || '[]');
    } catch {
      return [];
    }
  }

  saveBookmarks() {
    localStorage.setItem('cyberpunk-lore-bookmarks', JSON.stringify(this.bookmarks));
  }

  loadHistory() {
    try {
      return JSON.parse(localStorage.getItem('cyberpunk-lore-history') || '[]');
    } catch {
      return [];
    }
  }

  saveHistory() {
    localStorage.setItem('cyberpunk-lore-history', JSON.stringify(this.recentHistory));
  }

  // Public API for integration
  searchLore(term) {
    const searchInput = this.container.querySelector('.lore-search');
    if (searchInput) {
      searchInput.value = term;
      this.searchTerm = term.toLowerCase();
      this.updateLoreList();
    }
  }

  jumpToEntry(entryId) {
    const entry = this.findEntryById(entryId);
    if (entry) {
      this.showLoreDetail(entryId, entry.category);
      
      // Update active item
      const listItems = this.container.querySelectorAll('.lore-list-item');
      listItems.forEach(item => {
        item.classList.toggle('active', item.dataset.id === entryId);
      });
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedLoreDatabase;
} else {
  window.EnhancedLoreDatabase = EnhancedLoreDatabase;
}