/**
 * Enhanced Rules Quick Reference for Cyberpunk RED
 * Features: Advanced search, bookmarks, recent views, expanded database
 */

class EnhancedRulesReference {
  constructor(container) {
    this.container = container;
    this.searchTerm = '';
    this.activeCategory = 'all';
    this.bookmarks = this.loadBookmarks();
    this.recentlyViewed = this.loadRecentlyViewed();
    this.expandedRules = new Set();
    
    // Enhanced rules database with more comprehensive content
    this.rulesData = {
      combat: {
        title: 'Combat Rules',
        icon: '⚔️',
        color: 'danger',
        rules: [
          {
            id: 'initiative',
            name: 'Initiative',
            description: 'Roll 1d10 + REF. Act in order from highest to lowest.',
            details: 'On a tie, player characters go first. If still tied, higher REF goes first. Initiative is rolled once per combat unless something dramatically changes.',
            tags: ['combat', 'ref', 'turn order'],
            difficulty: 'Basic'
          },
          {
            id: 'attack-roll',
            name: 'Attack Roll',
            description: '1d10 + REF + Weapon Skill vs Defense Value (DV)',
            details: `Base DV by range:
• 0-6m: DV 13 (Point Blank)
• 7-12m: DV 15 (Close)  
• 13-25m: DV 20 (Medium)
• 26-50m: DV 25 (Long)
• 51-100m: DV 30 (Extreme)
• 101-200m: DV 35 (Maximum)`,
            tags: ['combat', 'attack', 'range', 'dv'],
            difficulty: 'Basic'
          },
          {
            id: 'damage',
            name: 'Damage Resolution',
            description: 'Roll damage dice - target\'s armor SP = damage dealt',
            details: `Damage Types:
• Headshots: Ignore body armor, x2 damage
• Cover: Light (+10 SP), Heavy (+20 SP), Full (Cannot hit)
• Armor Degradation: SP reduces by 1 when hit
• Ablative: Some armor is destroyed when penetrated`,
            tags: ['combat', 'damage', 'armor', 'sp'],
            difficulty: 'Basic'
          },
          {
            id: 'critical-success',
            name: 'Critical Success',
            description: 'Natural 10 on attack roll - roll again and add',
            details: 'If second roll is also 10, keep rolling and adding. Critical hits always hit regardless of DV. For damage, add all dice together for final result.',
            tags: ['combat', 'critical', 'luck'],
            difficulty: 'Basic'
          },
          {
            id: 'autofire',
            name: 'Autofire',
            description: 'Multiple shots at single target or area',
            details: `Single Target: 2 bullets = +1 to hit, 3 bullets = +3 to hit
Suppressive Fire: 10 bullets, area effect, everyone rolls DV 15
Full Auto: Empty entire magazine, massive damage potential`,
            tags: ['combat', 'autofire', 'suppression'],
            difficulty: 'Advanced'
          },
          {
            id: 'martial-arts',
            name: 'Martial Arts',
            description: 'Special unarmed combat techniques',
            details: `Martial Arts Styles provide special moves:
• Karate: Focused Strike (+2 damage)
• Boxing: Grab + Strike combo
• Judo: Throws and grapples
• Capoeira: Sweep attacks
Each style has unique benefits and techniques.`,
            tags: ['combat', 'martial arts', 'unarmed'],
            difficulty: 'Advanced'
          }
        ]
      },
      
      skills: {
        title: 'Skill Checks',
        icon: '🎯',
        color: 'primary',
        rules: [
          {
            id: 'skill-check',
            name: 'Basic Skill Check',
            description: '1d10 + STAT + Skill vs Difficulty Value (DV)',
            details: `Difficulty Values:
• DV 9: Simple (everyday tasks)
• DV 13: Everyday (typical challenges)  
• DV 15: Difficult (requires training)
• DV 17: Professional (expert level)
• DV 21: Heroic (legendary skill)
• DV 24: Incredible (superhuman)
• DV 29: Legendary (near impossible)`,
            tags: ['skills', 'dv', 'difficulty'],
            difficulty: 'Basic'
          },
          {
            id: 'skill-modifiers',
            name: 'Skill Modifiers',
            description: 'Various factors affect skill rolls',
            details: `Common Modifiers:
• Taking time: +1 to +5 (double to 16x time)
• Rush job: -1 to -5 (half to 1/16 time)
• Quality tools: +1 to +3
• Poor conditions: -1 to -5
• Complementary skill: +1 from helper`,
            tags: ['skills', 'modifiers', 'time'],
            difficulty: 'Intermediate'
          },
          {
            id: 'luck-usage',
            name: 'Using LUCK Points',
            description: 'Add LUCK points 1:1 to any roll after seeing result',
            details: `LUCK Rules:
• Declare after seeing the roll result
• Add points 1:1 to the total
• Cannot exceed your max LUCK stat
• Refreshes at start of each session
• Can be used on any d10 roll`,
            tags: ['luck', 'reroll', 'points'],
            difficulty: 'Basic'
          }
        ]
      },
      
      netrunning: {
        title: 'Netrunning',
        icon: '💻',
        color: 'accent',
        rules: [
          {
            id: 'net-architecture',
            name: 'NET Architecture',
            description: 'Networks have multiple levels with ICE protection',
            details: `Network Levels:
• Level 1-2: Basic (Home networks)
• Level 3-4: Standard (Small business)
• Level 5-6: Uncommon (Corporate division)
• Level 7-8: Advanced (Major corporation)
• Level 9-10: Masterwork (Government/Military)
Each level increases ICE strength and complexity.`,
            tags: ['netrunning', 'architecture', 'ice'],
            difficulty: 'Intermediate'
          },
          {
            id: 'cyberdeck-programs',
            name: 'Cyberdeck Programs',
            description: 'Software that provides NET capabilities',
            details: `Essential Programs:
• Armor: Protects against Black ICE
• Sword: Attacks ICE and other runners
• See Ya: Invisibility in the NET
• Wrecking Ball: Destroys files/systems
• Speedway: Faster movement
• Banhammer: Kicks others out`,
            tags: ['netrunning', 'programs', 'cyberdeck'],
            difficulty: 'Advanced'
          },
          {
            id: 'black-ice',
            name: 'Black ICE',
            description: 'Lethal defensive programs that can kill',
            details: `Black ICE Types:
• Hellhound: 3d6 damage, basic hunter
• Liche: 4d6 damage, area denial
• Kraken: 5d6 damage, tentacle grab
• Dragon: 6d6 damage, elite guardian
• Balron: 8d6 damage, custom horrors
Damage goes directly to HP!`,
            tags: ['netrunning', 'black ice', 'damage'],
            difficulty: 'Advanced'
          }
        ]
      },
      
      cyberware: {
        title: 'Cyberware & Tech',
        icon: '🦾',
        color: 'secondary',
        rules: [
          {
            id: 'humanity-cost',
            name: 'Humanity Cost',
            description: 'Installing cyberware reduces Humanity',
            details: `Humanity Loss:
• Each piece of cyberware has a Humanity Cost
• Roll 1d6, lose that much Humanity
• If Humanity drops to 0, character becomes NPC
• Therapy can restore Humanity over time
• EMP stat = current Humanity ÷ 10 (round down)`,
            tags: ['cyberware', 'humanity', 'emp'],
            difficulty: 'Basic'
          },
          {
            id: 'cyberpsychosis',
            name: 'Cyberpsychosis',
            description: 'Mental breakdown from too much chrome',
            details: `When Humanity reaches critical levels:
• 40+ Humanity: Occasional stress
• 20-39 Humanity: Noticeable personality changes  
• 8-19 Humanity: Serious dissociation
• 1-7 Humanity: Borderline psychotic
• 0 Humanity: Full cyberpsychosis (NPC)`,
            tags: ['cyberware', 'cyberpsychosis', 'humanity'],
            difficulty: 'Intermediate'
          },
          {
            id: 'installation',
            name: 'Cyberware Installation',
            description: 'Surgical procedure to install implants',
            details: `Installation Process:
• Requires Surgery skill check
• DV varies by complexity (13-24)
• Failure causes 2d6 damage
• Critical failure may destroy implant
• Recovery time: 1d6 days
• Street docs are cheaper but riskier`,
            tags: ['cyberware', 'surgery', 'installation'],
            difficulty: 'Advanced'
          }
        ]
      },
      
      vehicles: {
        title: 'Vehicles & Driving',
        icon: '🚗',
        color: 'success',
        rules: [
          {
            id: 'vehicle-combat',
            name: 'Vehicle Combat',
            description: 'Fighting in and with vehicles',
            details: `Vehicle Combat Rules:
• Driver uses Driving skill for maneuvers
• Passengers can shoot with -2 penalty
• Ramming: Vehicle damage = SDP/10 (d6s)
• Called shots can target tires, engine, driver
• Vehicle SDP = Hit Points for vehicles`,
            tags: ['vehicles', 'combat', 'driving'],
            difficulty: 'Advanced'
          },
          {
            id: 'chases',
            name: 'Vehicle Chases',
            description: 'High-speed pursuit rules',
            details: `Chase Mechanics:
• Opposed Driving + REF rolls each turn
• Winner can close/increase distance
• Environmental hazards require saves
• Stunts provide bonuses but risk crashes
• Combat during chases at -4 penalty`,
            tags: ['vehicles', 'chase', 'driving'],
            difficulty: 'Advanced'
          }
        ]
      },
      
      gear: {
        title: 'Equipment & Gear',
        icon: '🎒',
        color: 'accent',
        rules: [
          {
            id: 'weapon-stats',
            name: 'Weapon Statistics',
            description: 'Understanding weapon ratings',
            details: `Weapon Stats Explained:
• Damage: Dice rolled for damage
• Rate of Fire (ROF): Shots per turn
• Range: Effective range in meters  
• Magazine: Ammunition capacity
• Reliability: Jam number (roll over = jam)
• Cost: Price in Eurodollars`,
            tags: ['weapons', 'stats', 'equipment'],
            difficulty: 'Basic'
          },
          {
            id: 'armor-types',
            name: 'Armor Types',
            description: 'Different armor provides different protection',
            details: `Armor Categories:
• Light Armorjack: SP 11, covers torso
• Medium Armorjack: SP 12, covers torso  
• Heavy Armorjack: SP 18, covers torso
• Bulletproof: SP 10, concealable
• Helmet: SP 11, head protection only
• Body armor doesn't protect head shots`,
            tags: ['armor', 'protection', 'sp'],
            difficulty: 'Basic'
          }
        ]
      },
      
      economics: {
        title: 'Economics & Lifestyle',
        icon: '💰',
        color: 'warning',
        rules: [
          {
            id: 'lifestyle-costs',
            name: 'Monthly Lifestyle Costs',
            description: 'Cost of living in Night City',
            details: `Lifestyle Levels:
• Street Rat: 20eb/month (homeless)
• Kibble: 100eb/month (coffin hotel)
• Generic: 500eb/month (basic apartment)
• Good: 1,000eb/month (nice place)
• Excellent: 2,500eb/month (luxury)
• Extravagant: 5,000eb/month (corporate)`,
            tags: ['lifestyle', 'cost', 'economics'],
            difficulty: 'Basic'
          },
          {
            id: 'inflation',
            name: 'Price Inflation',
            description: 'Costs in 2045 vs historical prices',
            details: `Price Multipliers (vs 2020):
• Food: x3 (kibble vs real food)
• Housing: x5 (urban decay premium)
• Vehicles: x2 (advanced tech)
• Weapons: x1.5 (commonplace)
• Medical: x10 (corporate control)
Street vendors may offer discounts`,
            tags: ['economics', 'inflation', 'prices'],
            difficulty: 'Intermediate'
          }
        ]
      }
    };
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
    this.displayRules();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="enhanced-rules-reference">
        <style>
          .enhanced-rules-reference {
            display: flex;
            flex-direction: column;
            height: 100%;
            font-family: var(--font-secondary);
          }
          
          .rules-header {
            background: var(--bg-overlay);
            border-bottom: 2px solid var(--border-color);
            padding: 20px;
            flex-shrink: 0;
          }
          
          .rules-title {
            text-align: center;
            margin-bottom: 20px;
          }
          
          .search-section {
            margin-bottom: 20px;
          }
          
          .search-container {
            position: relative;
          }
          
          .category-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
          }
          
          .category-btn {
            padding: 8px 16px;
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            cursor: pointer;
            border-radius: 20px;
            font-size: 14px;
            font-family: var(--font-secondary);
            transition: all 0.3s;
            text-transform: uppercase;
            font-weight: bold;
          }
          
          .category-btn:hover {
            border-color: var(--primary);
            color: var(--primary);
          }
          
          .category-btn.active {
            background: var(--primary);
            color: var(--bg-primary);
            border-color: var(--primary);
            box-shadow: 0 0 10px var(--primary);
          }
          
          .rules-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }
          
          .rules-stats {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 15px;
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 14px;
            color: var(--text-secondary);
          }
          
          .rules-grid {
            display: grid;
            gap: 20px;
          }
          
          .category-section {
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
          }
          
          .category-header {
            background: var(--bg-overlay);
            padding: 15px 20px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            gap: 15px;
            cursor: pointer;
            transition: all 0.3s;
          }
          
          .category-header:hover {
            background: var(--primary);
            color: var(--bg-primary);
          }
          
          .category-icon {
            font-size: 24px;
          }
          
          .category-title {
            flex: 1;
            font-family: var(--font-display);
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .category-count {
            background: var(--accent);
            color: var(--bg-primary);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
          }
          
          .rules-list {
            padding: 0;
          }
          
          .rule-card {
            border-bottom: 1px solid var(--border-color);
            transition: all 0.3s;
          }
          
          .rule-card:last-child {
            border-bottom: none;
          }
          
          .rule-card:hover {
            background: var(--bg-overlay);
          }
          
          .rule-header {
            padding: 15px 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .rule-main {
            flex: 1;
          }
          
          .rule-name {
            color: var(--primary);
            font-family: var(--font-display);
            font-size: 16px;
            font-weight: bold;
            margin: 0 0 5px 0;
            text-transform: uppercase;
          }
          
          .rule-description {
            color: var(--text-primary);
            margin: 0;
            font-size: 14px;
          }
          
          .rule-meta {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 5px;
          }
          
          .rule-difficulty {
            background: var(--secondary);
            color: var(--bg-primary);
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .rule-actions {
            display: flex;
            gap: 5px;
          }
          
          .rule-action-btn {
            width: 30px;
            height: 30px;
            border: 1px solid var(--border-color);
            background: var(--bg-surface);
            color: var(--text-secondary);
            cursor: pointer;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transition: all 0.3s;
          }
          
          .rule-action-btn:hover {
            border-color: var(--primary);
            color: var(--primary);
          }
          
          .rule-action-btn.bookmarked {
            background: var(--warning);
            color: var(--bg-primary);
            border-color: var(--warning);
          }
          
          .rule-details {
            padding: 0 20px 15px 20px;
            color: var(--text-secondary);
            line-height: 1.6;
            border-top: 1px solid var(--border-color);
            background: var(--bg-primary);
          }
          
          .rule-details.expanded {
            display: block;
          }
          
          .rule-details.collapsed {
            display: none;
          }
          
          .rule-tags {
            margin-top: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
          }
          
          .rule-tag {
            background: var(--accent);
            color: var(--bg-primary);
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .highlight {
            background: var(--warning);
            color: var(--bg-primary);
            padding: 0 2px;
            border-radius: 2px;
          }
          
          .no-results {
            text-align: center;
            padding: 40px;
            color: var(--text-secondary);
          }
          
          .bookmarks-section {
            margin-top: 20px;
            padding: 15px;
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 4px;
          }
          
          .recent-section {
            margin-top: 20px;
            padding: 15px;
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 4px;
          }
          
          .quick-links {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }
          
          .quick-link {
            padding: 5px 10px;
            background: var(--primary);
            color: var(--bg-primary);
            text-decoration: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
          }
          
          .quick-link:hover {
            background: var(--secondary);
          }
        </style>
        
        <!-- Header -->
        <div class="rules-header">
          <div class="rules-title">
            <h2>
              <glitch-text text="Rules Quick Reference" intensity="low" hover-glitch color="primary"></glitch-text>
            </h2>
          </div>
          
          <!-- Search Section -->
          <div class="search-section">
            <div class="search-container">
              <neon-input 
                id="rules-search"
                type="text"
                placeholder="Search rules, mechanics, keywords..."
                label="Search Database"
                helper-text="Try: initiative, damage, netrunning, cyberware"
              ></neon-input>
            </div>
            
            <!-- Category Filters -->
            <div class="category-filters">
              <button class="category-btn active" data-category="all">All Rules</button>
              <button class="category-btn" data-category="combat">Combat</button>
              <button class="category-btn" data-category="skills">Skills</button>
              <button class="category-btn" data-category="netrunning">Netrunning</button>
              <button class="category-btn" data-category="cyberware">Cyberware</button>
              <button class="category-btn" data-category="vehicles">Vehicles</button>
              <button class="category-btn" data-category="gear">Equipment</button>
              <button class="category-btn" data-category="economics">Economics</button>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="rules-content">
          <!-- Stats Bar -->
          <div class="rules-stats">
            <span id="rules-count">Loading rules...</span>
            <span>Categories: ${Object.keys(this.rulesData).length}</span>
            <span id="bookmarks-count">Bookmarks: ${this.bookmarks.length}</span>
          </div>
          
          <!-- Quick Actions -->
          <div class="bookmarks-section" style="display: ${this.bookmarks.length > 0 ? 'block' : 'none'}">
            <h4 style="margin: 0 0 10px 0; color: var(--warning);">⭐ Bookmarked Rules</h4>
            <div class="quick-links" id="bookmarks-list"></div>
          </div>
          
          <div class="recent-section" style="display: ${this.recentlyViewed.length > 0 ? 'block' : 'none'}">
            <h4 style="margin: 0 0 10px 0; color: var(--secondary);">🕒 Recently Viewed</h4>
            <div class="quick-links" id="recent-list"></div>
          </div>
          
          <!-- Rules Display -->
          <div class="rules-grid" id="rules-display"></div>
        </div>
      </div>
    `;
    
    this.updateBookmarksList();
    this.updateRecentList();
  }
  
  attachEventListeners() {
    // Search input
    const searchInput = this.container.querySelector('#rules-search');
    searchInput.addEventListener('neon-input', (e) => {
      this.searchTerm = e.detail.value.toLowerCase().trim();
      this.displayRules();
    });
    
    // Category filters
    const categoryBtns = this.container.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.dataset.category;
        this.displayRules();
      });
    });
  }
  
  displayRules() {
    const display = this.container.querySelector('#rules-display');
    let allRules = [];
    let filteredCategories = this.activeCategory === 'all' ? 
      Object.entries(this.rulesData) : 
      [[this.activeCategory, this.rulesData[this.activeCategory]]].filter(([key, val]) => val);
    
    // Count total rules
    Object.values(this.rulesData).forEach(category => {
      allRules = allRules.concat(category.rules);
    });
    
    // Update stats
    const rulesCount = this.container.querySelector('#rules-count');
    rulesCount.textContent = `Total Rules: ${allRules.length}`;
    
    if (filteredCategories.length === 0) {
      display.innerHTML = `
        <div class="no-results">
          <p>No rules found in category "${this.activeCategory}"</p>
        </div>
      `;
      return;
    }
    
    let html = '';
    
    filteredCategories.forEach(([categoryKey, categoryData]) => {
      const filteredRules = this.filterRules(categoryData.rules);
      
      if (filteredRules.length === 0 && this.searchTerm) return;
      
      html += `
        <div class="category-section">
          <div class="category-header" onclick="this.parentElement.querySelector('.rules-list').style.display = this.parentElement.querySelector('.rules-list').style.display === 'none' ? 'block' : 'none'">
            <span class="category-icon">${categoryData.icon}</span>
            <span class="category-title">${categoryData.title}</span>
            <span class="category-count">${filteredRules.length}</span>
          </div>
          <div class="rules-list">
            ${filteredRules.map(rule => this.renderRuleCard(rule, categoryKey)).join('')}
          </div>
        </div>
      `;
    });
    
    if (html === '') {
      html = `
        <div class="no-results">
          <p>No rules found matching "${this.searchTerm}"</p>
          <p>Try different keywords or browse categories</p>
        </div>
      `;
    }
    
    display.innerHTML = html;
  }
  
  filterRules(rules) {
    if (!this.searchTerm) return rules;
    
    return rules.filter(rule => {
      const searchIn = `${rule.name} ${rule.description} ${rule.details} ${rule.tags.join(' ')}`.toLowerCase();
      return searchIn.includes(this.searchTerm);
    });
  }
  
  renderRuleCard(rule, categoryKey) {
    const isExpanded = this.expandedRules.has(rule.id);
    const isBookmarked = this.bookmarks.includes(rule.id);
    const highlightedName = this.highlightSearchTerm(rule.name);
    const highlightedDescription = this.highlightSearchTerm(rule.description);
    const highlightedDetails = this.highlightSearchTerm(rule.details);
    
    return `
      <div class="rule-card">
        <div class="rule-header" onclick="this.parentElement.querySelector('.enhanced-rules-reference').toggleRule('${rule.id}')">
          <div class="rule-main">
            <h4 class="rule-name">${highlightedName}</h4>
            <p class="rule-description">${highlightedDescription}</p>
          </div>
          <div class="rule-meta">
            <span class="rule-difficulty rule-difficulty-${rule.difficulty.toLowerCase()}">${rule.difficulty}</span>
            <div class="rule-actions">
              <button class="rule-action-btn ${isBookmarked ? 'bookmarked' : ''}" 
                      onclick="event.stopPropagation(); this.getRootNode().querySelector('.enhanced-rules-reference').toggleBookmark('${rule.id}')"
                      title="${isBookmarked ? 'Remove bookmark' : 'Add bookmark'}">
                ⭐
              </button>
              <button class="rule-action-btn" 
                      onclick="event.stopPropagation(); this.getRootNode().querySelector('.enhanced-rules-reference').copyRule('${rule.id}')"
                      title="Copy to clipboard">
                📋
              </button>
            </div>
          </div>
        </div>
        <div class="rule-details ${isExpanded ? 'expanded' : 'collapsed'}">
          <div>${highlightedDetails}</div>
          <div class="rule-tags">
            ${rule.tags.map(tag => `<span class="rule-tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  toggleRule(ruleId) {
    if (this.expandedRules.has(ruleId)) {
      this.expandedRules.delete(ruleId);
    } else {
      this.expandedRules.add(ruleId);
      this.addToRecentlyViewed(ruleId);
    }
    this.displayRules();
  }
  
  toggleBookmark(ruleId) {
    const index = this.bookmarks.indexOf(ruleId);
    if (index > -1) {
      this.bookmarks.splice(index, 1);
    } else {
      this.bookmarks.push(ruleId);
    }
    this.saveBookmarks();
    this.updateBookmarksList();
    this.displayRules();
    
    // Update stats
    const bookmarksCount = this.container.querySelector('#bookmarks-count');
    bookmarksCount.textContent = `Bookmarks: ${this.bookmarks.length}`;
  }
  
  copyRule(ruleId) {
    const rule = this.findRuleById(ruleId);
    if (rule) {
      const text = `${rule.name}\n${rule.description}\n\n${rule.details}`;
      navigator.clipboard.writeText(text).then(() => {
        if (window.PanelUtils) {
          window.PanelUtils.showNotification('Rule copied to clipboard!', 'success');
        }
      });
    }
  }
  
  addToRecentlyViewed(ruleId) {
    const index = this.recentlyViewed.indexOf(ruleId);
    if (index > -1) {
      this.recentlyViewed.splice(index, 1);
    }
    this.recentlyViewed.unshift(ruleId);
    
    // Keep only last 10
    if (this.recentlyViewed.length > 10) {
      this.recentlyViewed = this.recentlyViewed.slice(0, 10);
    }
    
    this.saveRecentlyViewed();
    this.updateRecentList();
  }
  
  updateBookmarksList() {
    const bookmarksList = this.container.querySelector('#bookmarks-list');
    if (!bookmarksList) return;
    
    const section = this.container.querySelector('.bookmarks-section');
    if (this.bookmarks.length === 0) {
      section.style.display = 'none';
      return;
    }
    
    section.style.display = 'block';
    bookmarksList.innerHTML = this.bookmarks.map(ruleId => {
      const rule = this.findRuleById(ruleId);
      return rule ? `
        <span class="quick-link" onclick="this.getRootNode().querySelector('.enhanced-rules-reference').jumpToRule('${ruleId}')">
          ${rule.name}
        </span>
      ` : '';
    }).join('');
  }
  
  updateRecentList() {
    const recentList = this.container.querySelector('#recent-list');
    if (!recentList) return;
    
    const section = this.container.querySelector('.recent-section');
    if (this.recentlyViewed.length === 0) {
      section.style.display = 'none';
      return;
    }
    
    section.style.display = 'block';
    recentList.innerHTML = this.recentlyViewed.slice(0, 5).map(ruleId => {
      const rule = this.findRuleById(ruleId);
      return rule ? `
        <span class="quick-link" onclick="this.getRootNode().querySelector('.enhanced-rules-reference').jumpToRule('${ruleId}')">
          ${rule.name}
        </span>
      ` : '';
    }).join('');
  }
  
  jumpToRule(ruleId) {
    // Find the category for this rule
    let targetCategory = null;
    Object.entries(this.rulesData).forEach(([categoryKey, categoryData]) => {
      if (categoryData.rules.find(rule => rule.id === ruleId)) {
        targetCategory = categoryKey;
      }
    });
    
    if (targetCategory) {
      // Set active category
      const categoryBtns = this.container.querySelectorAll('.category-btn');
      categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === targetCategory) {
          btn.classList.add('active');
        }
      });
      this.activeCategory = targetCategory;
      
      // Expand the rule
      this.expandedRules.add(ruleId);
      this.addToRecentlyViewed(ruleId);
      
      // Refresh display
      this.displayRules();
    }
  }
  
  findRuleById(ruleId) {
    for (const categoryData of Object.values(this.rulesData)) {
      const rule = categoryData.rules.find(r => r.id === ruleId);
      if (rule) return rule;
    }
    return null;
  }
  
  highlightSearchTerm(text) {
    if (!this.searchTerm) return text;
    
    const regex = new RegExp(`(${this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
  
  loadBookmarks() {
    try {
      return JSON.parse(localStorage.getItem('rulesBookmarks') || '[]');
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }
  
  saveBookmarks() {
    localStorage.setItem('rulesBookmarks', JSON.stringify(this.bookmarks));
  }
  
  loadRecentlyViewed() {
    try {
      return JSON.parse(localStorage.getItem('rulesRecentlyViewed') || '[]');
    } catch (error) {
      console.error('Error loading recently viewed:', error);
      return [];
    }
  }
  
  saveRecentlyViewed() {
    localStorage.setItem('rulesRecentlyViewed', JSON.stringify(this.recentlyViewed));
  }
}

// Make methods available to HTML onclick handlers
EnhancedRulesReference.prototype.toggleRule = EnhancedRulesReference.prototype.toggleRule;
EnhancedRulesReference.prototype.toggleBookmark = EnhancedRulesReference.prototype.toggleBookmark;
EnhancedRulesReference.prototype.copyRule = EnhancedRulesReference.prototype.copyRule;
EnhancedRulesReference.prototype.jumpToRule = EnhancedRulesReference.prototype.jumpToRule;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedRulesReference;
}