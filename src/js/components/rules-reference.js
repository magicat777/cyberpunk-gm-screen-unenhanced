/**
 * Rules Quick Reference for Cyberpunk RED
 * Searchable rules database with categories and quick lookups
 */

class RulesReference {
  constructor(container) {
    this.container = container;
    this.searchTerm = '';
    this.activeCategory = 'all';
    this.bookmarks = this.loadBookmarks();
    this.recentlyViewed = [];
    
    // Rules data organized by category
    this.rulesData = {
      combat: {
        title: 'Combat Rules',
        icon: '⚔️',
        rules: [
          {
            name: 'Initiative',
            description: 'Roll 1d10 + REF. Act in order from highest to lowest.',
            details: 'On a tie, player characters go first. If still tied, higher REF goes first.'
          },
          {
            name: 'Attack Roll',
            description: '1d10 + REF + Weapon Skill vs Defense Value (DV)',
            details: 'Base DV is determined by range. Single Shot DV: 13 (0-6m), 15 (7-12m), 20 (13-25m), 25 (26-50m), 30 (51-100m)'
          },
          {
            name: 'Damage',
            description: 'Roll damage dice - target\'s armor SP = damage dealt',
            details: 'Headshots ignore body armor. Cover provides additional SP: Light Cover (SP 10), Heavy Cover (SP 20), Full Cover (cannot be hit).'
          },
          {
            name: 'Critical Success',
            description: 'Natural 10 on attack roll - roll again and add',
            details: 'If second roll is also 10, keep rolling. Critical hits always hit regardless of DV.'
          },
          {
            name: 'Critical Failure',
            description: 'Natural 1 on attack roll - automatic miss',
            details: 'GM may impose additional consequences like weapon jam or hitting an ally.'
          },
          {
            name: 'Suppressive Fire',
            description: 'Use automatic weapon to suppress area',
            details: 'Uses 10 bullets. Everyone in area must beat DV 15 or take damage. Shooter rolls damage once, applies to all hit.'
          },
          {
            name: 'Aimed Shot',
            description: 'Spend action to aim for +1 to hit',
            details: 'Can aim up to 3 rounds for maximum +3 bonus. Bonus lost if you move or are hit.'
          },
          {
            name: 'Melee Attack',
            description: '1d10 + DEX + Melee Weapon/Brawling vs DV',
            details: 'Melee DV = 10 + defender\'s DEX + Evasion skill'
          },
          {
            name: 'Grappling',
            description: 'Opposed Brawling checks to grapple',
            details: 'Grappled target is -2 to all actions. Escape requires winning opposed Brawling check.'
          },
          {
            name: 'Death Saves',
            description: 'At 0 HP or less, roll Death Save each turn',
            details: 'Death Save: BODY + 1d10 vs DV 10 (+1 per previous save). Fail = death. Pass = stabilized at 1 HP after combat.'
          }
        ]
      },
      
      skills: {
        title: 'Skill Checks',
        icon: '🎯',
        rules: [
          {
            name: 'Basic Skill Check',
            description: '1d10 + STAT + Skill vs Difficulty Value (DV)',
            details: 'DV 9 (Simple), DV 13 (Everyday), DV 15 (Difficult), DV 17 (Professional), DV 21 (Heroic), DV 24 (Incredible), DV 29 (Legendary)'
          },
          {
            name: 'Complimentary Skill',
            description: 'Help another character with your skill',
            details: 'Roll your skill check at same DV. If you succeed, they get +1. Multiple helpers don\'t stack.'
          },
          {
            name: 'Taking Extra Time',
            description: 'Double time for +1, quadruple for +2',
            details: 'Maximum +5 bonus for 16x normal time. Not usable in combat or time pressure.'
          },
          {
            name: 'Opposed Checks',
            description: 'Both roll, highest total wins',
            details: 'Ties go to defender or status quo. Critical success beats normal success.'
          },
          {
            name: 'Skill Resolution',
            description: 'Determine approach and applicable skill',
            details: 'GM sets DV based on difficulty. Player rolls. Describe outcome based on success/failure margin.'
          },
          {
            name: 'Using LUCK',
            description: 'Add LUCK points 1:1 to any roll',
            details: 'Declare before rolling. LUCK refreshes at start of each session. Cannot exceed max LUCK stat.'
          }
        ]
      },
      
      netrunning: {
        title: 'Netrunning',
        icon: '💻',
        rules: [
          {
            name: 'NET Architecture',
            description: 'Networks have multiple levels with ICE',
            details: 'Levels: 1-2 (Basic), 3-4 (Standard), 5-6 (Uncommon), 7-8 (Advanced), 9-10 (Masterwork)'
          },
          {
            name: 'Interface Check',
            description: '1d10 + Interface vs ICE\'s DV',
            details: 'Base DVs: Password (DV 12), File (DV 14), Control Node (DV 16), Root (DV 18)'
          },
          {
            name: 'Cyberdeck Programs',
            description: 'Programs provide different NET actions',
            details: 'Armor, Banhammer, Eraser, See Ya, Speedy, Wrecking Ball, etc. Each has specific effect.'
          },
          {
            name: 'Black ICE',
            description: 'Dangerous programs that can harm netrunner',
            details: 'Types: Hellhound (3d6), Liche (4d6), Kraken (5d6), Dragon (6d6). Damage goes to HP!'
          },
          {
            name: 'NET Actions',
            description: 'Each turn choose: Move, Interface, or Program',
            details: 'Move: Travel between nodes. Interface: Attempt to breach. Program: Activate cyberdeck program.'
          },
          {
            name: 'Meat Actions',
            description: 'Can act in meatspace while in NET',
            details: '-2 to all meatspace actions while netrunning. Can\'t move without disconnecting.'
          }
        ]
      },
      
      healing: {
        title: 'Healing & Medicine',
        icon: '🏥',
        rules: [
          {
            name: 'First Aid',
            description: 'Heals 1 HP per point over DV',
            details: 'DV 13 (Simple), DV 15 (Everyday), DV 17 (Difficult). Takes 1 minute. Each person can only be treated once per injury.'
          },
          {
            name: 'Natural Healing',
            description: 'Recover HP based on injury level',
            details: 'Light Wounds (>25% HP): 1 HP/day. Moderate (<25% HP): 1 HP/week with daily First Aid. Critical (<1 HP): Requires Surgery.'
          },
          {
            name: 'Surgery',
            description: 'Required for Critical injuries',
            details: 'Surgery DV 17. Success stabilizes patient. Can then heal 1 HP/week with care.'
          },
          {
            name: 'Pharmaceuticals',
            description: 'Various drugs provide bonuses',
            details: 'Speedheal (2x healing rate), Bounce (+2 Death Saves), Synthcoke (+1 REF for 1 hour), etc.'
          },
          {
            name: 'Therapy',
            description: 'Recover Humanity and Empathy',
            details: 'Costs 500eb/week. Roll 1d10/week: 8+ recovers 2 Humanity (max EMP x 10).'
          },
          {
            name: 'Cyberware Surgery',
            description: 'Installing requires Surgery check',
            details: 'DV varies by implant. Failed surgery deals 2d6 damage. Critical failure can destroy implant.'
          }
        ]
      },
      
      social: {
        title: 'Social & Reputation',
        icon: '🗣️',
        rules: [
          {
            name: 'Facedown',
            description: 'Intimidation contest using COOL + Rep',
            details: 'Opposed roll. Loser takes -2 to all actions against winner for scene. Critical win causes flee/surrender.'
          },
          {
            name: 'Reputation',
            description: 'Your Rep affects social interactions',
            details: 'Rep 0-4 (Nobody), 5-7 (Local), 8-10 (City-wide), 11+ (Regional/National)'
          },
          {
            name: 'Fast Talk',
            description: 'Persuasion to convince someone',
            details: 'DV based on request reasonableness. Success gets cooperation. Failure may burn bridges.'
          },
          {
            name: 'Trading',
            description: 'Haggle for better prices',
            details: 'Beat DV 15 for 10% discount. Every 5 over gives additional 10% (max 50% off).'
          },
          {
            name: 'Interrogation',
            description: 'Extract information from subject',
            details: 'Opposed check vs COOL + Resist Torture/Drugs. Success reveals info. Torture gives +2 but may harm subject.'
          },
          {
            name: 'Seduction',
            description: 'Use charm to influence target',
            details: 'Human Perception + Persuasion vs DV (based on target\'s interest). Success improves attitude.'
          }
        ]
      },
      
      cyberware: {
        title: 'Cyberware',
        icon: '🦾',
        rules: [
          {
            name: 'Humanity Loss',
            description: 'Installing cyberware costs Humanity',
            details: 'Each piece has Humanity Cost (HC). When current Humanity ÷ 10 < EMP, lose 1 EMP permanently.'
          },
          {
            name: 'Cyberpsychosis',
            description: 'Humanity reaches 0 = cyberpsycho',
            details: 'Character becomes NPC. Violent, paranoid, disconnected from humanity. Therapy may help if caught early.'
          },
          {
            name: 'Borgware',
            description: 'Full body replacement options',
            details: 'Alpha (HC 10d6), Beta (HC 8d6), Gemini (HC 4d6), etc. Massive humanity loss but major benefits.'
          },
          {
            name: 'Neural Link',
            description: 'Required for most other cyberware',
            details: 'Costs 500eb, HC 2. Allows smartgun links, vehicle links, chipware, etc.'
          },
          {
            name: 'Fashionware',
            description: 'Cosmetic cyber, no Humanity loss',
            details: 'Light tattoos, shift-tacts, techhair, etc. Style over substance.'
          },
          {
            name: 'Therapy Recovery',
            description: 'Regain Humanity through therapy',
            details: 'Cannot recover HC from installed cyberware. Only from trauma/loss. Max Humanity = EMP x 10 - installed HC.'
          }
        ]
      },
      
      vehicles: {
        title: 'Vehicles & Chases',
        icon: '🏎️',
        rules: [
          {
            name: 'Vehicle Movement',
            description: 'Vehicles have MOVE stats in m/round',
            details: 'Combat Speed (MOVE), Cruising (MOVE x3), Top Speed (MOVE x5). Turning reduces speed.'
          },
          {
            name: 'Control Rolls',
            description: 'REF + Drive/Pilot to control vehicle',
            details: 'Required for stunts, avoiding obstacles, combat maneuvers. Failure may cause crash.'
          },
          {
            name: 'Vehicle Combat',
            description: 'Shooting from/at vehicles',
            details: 'Moving vehicle: -2 to attacks. Target moving: additional -2. Called shots to tires/driver at -4.'
          },
          {
            name: 'Ramming',
            description: 'Deal damage based on speed',
            details: 'Both vehicles take damage. Larger vehicle takes less. Damage = (MOVE ÷ 20)d6.'
          },
          {
            name: 'Chase Scenes',
            description: 'Opposed driving checks',
            details: 'Winner gains/loses range. Three wins = escape/catch. Complications on fumbles.'
          },
          {
            name: 'Vehicle Armor',
            description: 'Vehicles have SP like characters',
            details: 'Standard car (SP 10), Armored (SP 25), AV-4 (SP 40). Weapons may have armor penetration.'
          }
        ]
      },
      
      equipment: {
        title: 'Equipment & Gear',
        icon: '🎒',
        rules: [
          {
            name: 'Availability',
            description: 'How hard items are to find',
            details: 'E (Everywhere), C (Common), P (Poor), R (Rare), L (Luxury). Affects price and purchase DV.'
          },
          {
            name: 'Weapon Reliability',
            description: 'Chance of jam on fumble',
            details: 'VR (Very Reliable): Jam on second 1. ST (Standard): Jam on 1. UR (Unreliable): Jam on 1-2.'
          },
          {
            name: 'Armor Stacking',
            description: 'Can\'t stack armor pieces',
            details: 'Only highest SP counts. Exception: Helmet protects head separately from body armor.'
          },
          {
            name: 'Encumbrance',
            description: 'Carry capacity = BODY x 10 kg',
            details: 'Over capacity: -2 MOVE, -2 physical actions. Double capacity: can\'t run, -4 to actions.'
          },
          {
            name: 'Ammo Types',
            description: 'Special ammunition effects',
            details: 'AP (halves armor), Rubber (non-lethal), Incendiary (+2 damage vs unarmored), Smart (+1 to hit with link).'
          },
          {
            name: 'Weapon Modifications',
            description: 'Attachments and upgrades',
            details: 'Smartgun Link (+1 hit), Extended Mag (2x ammo), Silencer (stealth kills), Drum Mag (4x ammo), etc.'
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
      <div class="rules-reference">
        <!-- Search Bar -->
        <div class="search-section">
          <div class="input-group">
            <label for="rules-search">Quick Search</label>
            <input 
              id="rules-search" 
              type="text" 
              placeholder="Search rules..." 
              class="neon-input primary"
            />
          </div>
        </div>
        
        <!-- Category Tabs -->
        <div class="category-tabs">
          <button class="category-tab active" data-category="all">
            <span>📖</span> All Rules
          </button>
          ${Object.entries(this.rulesData).map(([key, category]) => `
            <button class="category-tab" data-category="${key}">
              <span>${category.icon}</span> ${category.title}
            </button>
          `).join('')}
        </div>
        
        <!-- Rules Display -->
        <div class="rules-display" id="rules-display">
          <!-- Rules will be inserted here -->
        </div>
      </div>
      
      <style>
        .rules-reference {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 15px;
          padding: 10px;
        }
        
        .search-section {
          flex-shrink: 0;
        }
        
        .category-tabs {
          display: flex;
          gap: 5px;
          overflow-x: auto;
          padding-bottom: 5px;
          flex-shrink: 0;
        }
        
        .category-tabs::-webkit-scrollbar {
          height: 6px;
        }
        
        .category-tabs::-webkit-scrollbar-track {
          background: var(--bg-surface);
        }
        
        .category-tabs::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
        
        .category-tab {
          padding: 8px 15px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .category-tab span {
          font-size: 14px;
        }
        
        .category-tab:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        
        .category-tab.active {
          background: var(--primary);
          color: var(--bg-primary);
          border-color: var(--primary);
        }
        
        .rules-display {
          flex: 1;
          overflow-y: auto;
          padding-right: 5px;
        }
        
        .category-section {
          margin-bottom: 20px;
        }
        
        .category-title {
          font-size: 18px;
          color: var(--primary);
          margin: 0 0 15px 0;
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .rule-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 15px;
          margin-bottom: 10px;
          transition: all 0.2s;
        }
        
        .rule-card:hover {
          border-color: var(--primary);
          transform: translateX(5px);
        }
        
        .rule-card.expanded {
          border-color: var(--accent);
        }
        
        .rule-header {
          cursor: pointer;
          user-select: none;
        }
        
        .rule-name {
          font-size: 16px;
          color: var(--primary);
          margin: 0 0 5px 0;
          font-weight: bold;
        }
        
        .rule-description {
          font-size: 14px;
          color: var(--text-primary);
          margin: 0;
        }
        
        .rule-details {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
          font-size: 13px;
          color: var(--text-secondary);
          display: none;
        }
        
        .rule-card.expanded .rule-details {
          display: block;
        }
        
        .no-results {
          text-align: center;
          color: var(--text-secondary);
          padding: 40px;
          font-size: 14px;
        }
        
        .highlight {
          background: rgba(0, 255, 255, 0.2);
          color: var(--primary);
          padding: 0 2px;
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
          .category-tabs {
            -webkit-overflow-scrolling: touch;
          }
          
          .rule-card {
            padding: 12px;
          }
          
          .rule-name {
            font-size: 14px;
          }
          
          .rule-description {
            font-size: 12px;
          }
        }
      </style>
    `;
  }
  
  attachEventListeners() {
    // Search functionality
    const searchInput = this.container.querySelector('#rules-search');
    searchInput.addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this.displayRules();
    });
    
    // Category tabs
    this.container.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.container.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.dataset.category;
        this.displayRules();
      });
    });
    
    // Rule card expansion
    this.container.addEventListener('click', (e) => {
      const ruleHeader = e.target.closest('.rule-header');
      if (ruleHeader) {
        const ruleCard = ruleHeader.closest('.rule-card');
        ruleCard.classList.toggle('expanded');
        
        // Play sound effect
        if (window.soundManager) {
          window.soundManager.play('uiClick');
        }
      }
    });
  }
  
  displayRules() {
    const display = this.container.querySelector('#rules-display');
    let html = '';
    
    // Get categories to display
    const categoriesToShow = this.activeCategory === 'all' 
      ? Object.keys(this.rulesData) 
      : [this.activeCategory];
    
    let hasResults = false;
    
    categoriesToShow.forEach(categoryKey => {
      const category = this.rulesData[categoryKey];
      const filteredRules = this.filterRules(category.rules);
      
      if (filteredRules.length > 0) {
        hasResults = true;
        html += `
          <div class="category-section">
            <h3 class="category-title">
              <span>${category.icon}</span>
              ${category.title}
            </h3>
            ${filteredRules.map(rule => this.renderRuleCard(rule)).join('')}
          </div>
        `;
      }
    });
    
    if (!hasResults) {
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
      const searchIn = `${rule.name} ${rule.description} ${rule.details}`.toLowerCase();
      return searchIn.includes(this.searchTerm);
    });
  }
  
  renderRuleCard(rule) {
    const highlightedName = this.highlightSearchTerm(rule.name);
    const highlightedDescription = this.highlightSearchTerm(rule.description);
    const highlightedDetails = this.highlightSearchTerm(rule.details);
    
    return `
      <div class="rule-card">
        <div class="rule-header">
          <h4 class="rule-name">${highlightedName}</h4>
          <p class="rule-description">${highlightedDescription}</p>
        </div>
        <div class="rule-details">
          ${highlightedDetails}
        </div>
      </div>
    `;
  }
  
  highlightSearchTerm(text) {
    if (!this.searchTerm) return text;
    
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RulesReference;
}