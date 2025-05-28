/**
 * Enhanced NPC Generator for Cyberpunk RED
 * Features: Cultural name variations, enhanced personality, cyberpunk themes
 */

class EnhancedNPCGenerator {
  constructor(container) {
    this.container = container;
    this.currentNPC = null;
    this.savedNPCs = this.loadSavedNPCs();
    
    // Enhanced name database with cultural origins
    this.names = {
      first: {
        corporate: {
          male: ['Richard', 'William', 'Jonathan', 'Alexander', 'Michael', 'David', 'Christopher'],
          female: ['Victoria', 'Elizabeth', 'Catherine', 'Samantha', 'Jennifer', 'Amanda', 'Rebecca'],
          neutral: ['Morgan', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Quinn', 'Cameron']
        },
        street: {
          male: ['Razor', 'Chrome', 'Spike', 'Viper', 'Ghost', 'Neon', 'Blade', 'Phoenix'],
          female: ['Raven', 'Luna', 'Nova', 'Aria', 'Jinx', 'Echo', 'Volt', 'Cyber'],
          neutral: ['Zero', 'Byte', 'Pixel', 'Glitch', 'Data', 'Synth', 'Code', 'Flux']
        },
        japanese: {
          male: ['Takeshi', 'Hiroshi', 'Kenji', 'Akira', 'Yamato', 'Satoshi', 'Ryu'],
          female: ['Yuki', 'Akane', 'Rei', 'Sakura', 'Hanako', 'Miho', 'Kazumi'],
          neutral: ['Sato', 'Mori', 'Kage', 'Taka', 'Hoshi', 'Yama', 'Kawa']
        },
        latino: {
          male: ['Diego', 'Carlos', 'Miguel', 'Rafael', 'Eduardo', 'Fernando', 'Alejandro'],
          female: ['Sofia', 'Carmen', 'Isabella', 'Maria', 'Esperanza', 'Valentina', 'Lucia'],
          neutral: ['Rio', 'Cruz', 'Santos', 'Reyes', 'Morales', 'Vargas', 'Mendoza']
        },
        african: {
          male: ['Kwame', 'Kofi', 'Jabari', 'Zuberi', 'Amari', 'Kenzo', 'Taj'],
          female: ['Asha', 'Zara', 'Kaia', 'Amina', 'Naia', 'Zuri', 'Nia'],
          neutral: ['Phoenix', 'Storm', 'River', 'Sky', 'Arrow', 'Stone', 'Wind']
        }
      },
      last: {
        corporate: ['Sterling', 'Blackwood', 'Sinclair', 'Ashford', 'Pemberton', 'Whitmore', 'Cromwell'],
        street: ['Razorblade', 'Neonlight', 'Darkstorm', 'Cyberwolf', 'Ghostrider', 'Shadowfox'],
        japanese: ['Tanaka', 'Sato', 'Yamamoto', 'Nakamura', 'Watanabe', 'Suzuki', 'Takahashi'],
        latino: ['Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez'],
        african: ['Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore']
      }
    };
    
    // Enhanced roles with specializations
    this.roles = {
      Solo: ['Assassin', 'Bodyguard', 'Mercenary', 'Street Samurai', 'Corporate Security'],
      Netrunner: ['Data Thief', 'ICE Breaker', 'Corporate Spy', 'Virus Writer', 'System Admin'],
      Tech: ['Cybertech Specialist', 'Vehicle Mechanic', 'Electronics Expert', 'Gadgeteer', 'Rigger'],
      Media: ['Investigative Reporter', 'War Correspondent', 'Blogger', 'Documentarian', 'News Anchor'],
      Lawman: ['Beat Cop', 'Detective', 'Corporate Security', 'Private Investigator', 'Federal Agent'],
      Fixer: ['Information Broker', 'Arms Dealer', 'Corporate Liaison', 'Street Contact', 'Smuggler'],
      Exec: ['Corporate VP', 'Department Head', 'Startup CEO', 'Government Official', 'Crime Boss'],
      Rockerboy: ['Punk Musician', 'Street Performer', 'Corporate Idol', 'Underground Artist', 'Rebel Leader'],
      Nomad: ['Vehicle Expert', 'Convoy Leader', 'Wasteland Guide', 'Family Member', 'Trader'],
      Medtech: ['Street Doc', 'Corporate Medic', 'Trauma Team', 'Cybertech Surgeon', 'Combat Medic']
    };
    
    // Enhanced personality traits
    this.personality = {
      traits: [
        'Paranoid', 'Ambitious', 'Cynical', 'Loyal', 'Ruthless', 'Idealistic', 'Greedy', 'Cautious',
        'Reckless', 'Professional', 'Charismatic', 'Cold', 'Impulsive', 'Calculating', 'Protective',
        'Vindictive', 'Compassionate', 'Arrogant', 'Humble', 'Secretive', 'Honest', 'Manipulative'
      ],
      quirks: [
        'Always wears sunglasses', 'Never removes their jacket', 'Constantly checking their phone',
        'Speaks in corporate jargon', 'Has a visible cybernetic implant', 'Smoking habit',
        'Fidgets with a lucky charm', 'Always arrives exactly on time', 'Never makes eye contact',
        'Collects vintage items', 'Has a distinctive laugh', 'Speaks multiple languages'
      ],
      motivations: [
        'Revenge against a corporation', 'Family survival', 'Climbing the corporate ladder',
        'Finding their missing sibling', 'Paying off massive debt', 'Uncovering the truth',
        'Building a criminal empire', 'Escaping their past', 'Protecting the innocent',
        'Achieving immortality', 'Bringing down the system', 'Finding true love'
      ]
    };
    
    // Cyberpunk-specific equipment
    this.equipment = {
      weapons: {
        melee: ['Monokatana', 'Vibroblade', 'Shock Baton', 'Mantis Blades', 'Monowire', 'Cyber Claws'],
        pistol: ['Unity (Arasaka)', 'Lexington (Militech)', 'Overture (Kang Tao)', 'Malorian 3516', 'Nowaki (Arasaka)'],
        smg: ['Saratoga (Constitutional)', 'Pulsar (Techtronika)', 'Shingen (Arasaka)', 'Copperhead (Militech)'],
        rifle: ['Ajax (Militech)', 'Masamune (Arasaka)', 'Achilles (Militech)', 'Ashura (Arasaka)'],
        heavy: ['Carnage (Budget Arms)', 'Defender (Militech)', 'Crusher (Militech)', 'Satara (Budget Arms)']
      },
      cyberware: {
        neural: ['Neural Link', 'Neural Processor', 'Memory Booster', 'Reflex Booster', 'Sandevistan'],
        optical: ['Kiroshi Optics MK.1', 'Kiroshi Optics MK.2', 'Zetatech Optics', 'Militech Optics'],
        audio: ['Biotech Σ MK.1', 'Biotech Σ MK.2', 'Zetatech Mk.2', 'Militech "Soundwave"'],
        circulatory: ['BioTechnica MK.1', 'BioTechnica MK.2', 'Zetatech MK.2', 'Militech "Bloodflow"'],
        limbs: ['Arasaka Cyberarm', 'Militech Cyberarm', 'Zetatech Cyberleg', 'Gorilla Arms', 'Mantis Blades']
      },
      fashion: [
        'Corporate suit', 'Leather jacket', 'Tactical vest', 'Neon-lit accessories', 'Mirrorshades',
        'Combat boots', 'Designer implants', 'Holo-jewelry', 'Gang colors', 'Military surplus'
      ]
    };
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="enhanced-npc-generator">
        <style>
          .enhanced-npc-generator {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 20px;
            font-family: var(--font-secondary);
          }
          
          .generator-header {
            text-align: center;
            margin-bottom: 20px;
          }
          
          .generator-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .control-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .control-label {
            color: var(--text-primary);
            font-family: var(--font-display);
            text-transform: uppercase;
            font-size: 14px;
            font-weight: bold;
          }
          
          .npc-display {
            background: var(--bg-surface);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
          }
          
          .npc-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border-color);
          }
          
          .npc-name {
            font-size: 2rem;
            margin-bottom: 10px;
            color: var(--primary);
          }
          
          .npc-role {
            color: var(--secondary);
            font-family: var(--font-display);
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          
          .stat-group {
            background: var(--bg-overlay);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 15px;
          }
          
          .stat-group h4 {
            color: var(--accent);
            margin: 0 0 10px 0;
            font-family: var(--font-display);
            text-transform: uppercase;
            font-size: 14px;
          }
          
          .stat-item {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            padding: 5px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .stat-value {
            color: var(--primary);
            font-weight: bold;
          }
          
          .personality-section {
            background: var(--bg-overlay);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
          }
          
          .equipment-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          
          .equipment-column {
            background: var(--bg-overlay);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 15px;
          }
          
          .equipment-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .equipment-list li {
            padding: 3px 0;
            color: var(--text-secondary);
          }
          
          .npc-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid var(--border-color);
          }
          
          .saved-npcs-section {
            margin-top: 30px;
          }
          
          .saved-npc-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: var(--bg-overlay);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            margin: 5px 0;
          }
          
          .culture-selector {
            width: 100%;
          }
          
          .generation-options {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
          }
        </style>
        
        <div class="generator-header">
          <h2>
            <glitch-text text="Enhanced NPC Generator" intensity="medium" hover-glitch color="primary"></glitch-text>
          </h2>
        </div>
        
        <!-- Generator Controls -->
        <div class="generator-controls">
          <div class="control-group">
            <label class="control-label">
              <glitch-text text="Cultural Background" intensity="low"></glitch-text>
            </label>
            <select id="culture-select" class="culture-selector">
              <option value="random">Random Culture</option>
              <option value="corporate">Corporate</option>
              <option value="street">Street</option>
              <option value="japanese">Japanese</option>
              <option value="latino">Latino</option>
              <option value="african">African</option>
            </select>
          </div>
          
          <div class="control-group">
            <label class="control-label">
              <glitch-text text="Difficulty Level" intensity="low"></glitch-text>
            </label>
            <select id="difficulty-select">
              <option value="mook">Mook (Everyday)</option>
              <option value="skilled" selected>Skilled (Professional)</option>
              <option value="elite">Elite (Hardened)</option>
              <option value="boss">Boss (Legendary)</option>
            </select>
          </div>
        </div>
        
        <div class="generation-options">
          <holo-button id="generate-full-npc" variant="primary">Generate Full NPC</holo-button>
          <holo-button id="generate-quick-stats" variant="secondary">Quick Combat Stats</holo-button>
          <holo-button id="generate-name-only" variant="accent" size="small">Name Only</holo-button>
          <holo-button id="generate-corporate" variant="success" size="small">Corporate NPC</holo-button>
        </div>
        
        <!-- NPC Display -->
        <div class="npc-display" id="npc-display" style="display: none;">
          <div class="npc-header">
            <div class="npc-name" id="npc-name"></div>
            <div class="npc-role" id="npc-role"></div>
            <div class="npc-culture" id="npc-culture"></div>
          </div>
          
          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-group">
              <h4>Core Stats</h4>
              <div id="core-stats"></div>
            </div>
            <div class="stat-group">
              <h4>Combat Stats</h4>
              <div id="combat-stats"></div>
            </div>
            <div class="stat-group">
              <h4>Skills</h4>
              <div id="skills-list"></div>
            </div>
          </div>
          
          <!-- Equipment -->
          <div class="equipment-grid">
            <div class="equipment-column">
              <h4 style="color: var(--accent); margin: 0 0 10px 0;">Weapons</h4>
              <ul class="equipment-list" id="weapons-list"></ul>
            </div>
            <div class="equipment-column">
              <h4 style="color: var(--accent); margin: 0 0 10px 0;">Cyberware</h4>
              <ul class="equipment-list" id="cyberware-list"></ul>
            </div>
            <div class="equipment-column">
              <h4 style="color: var(--accent); margin: 0 0 10px 0;">Fashion</h4>
              <ul class="equipment-list" id="fashion-list"></ul>
            </div>
          </div>
          
          <!-- Personality -->
          <div class="personality-section">
            <h4 style="color: var(--accent); margin: 0 0 15px 0;">Personality Profile</h4>
            <div id="personality-display"></div>
          </div>
          
          <!-- Actions -->
          <div class="npc-actions">
            <holo-button id="save-npc" variant="success" size="small">Save NPC</holo-button>
            <holo-button id="add-to-combat" variant="primary" size="small">Add to Combat</holo-button>
            <holo-button id="export-npc" variant="secondary" size="small">Export JSON</holo-button>
            <holo-button id="regenerate-personality" variant="accent" size="small">New Personality</holo-button>
          </div>
        </div>
        
        <!-- Saved NPCs -->
        <div class="saved-npcs-section">
          <h4>
            <glitch-text text="Saved NPCs" intensity="low"></glitch-text>
          </h4>
          <div id="saved-npcs-list"></div>
        </div>
      </div>
    `;
    
    this.styleSelects();
  }
  
  styleSelects() {
    const selects = this.container.querySelectorAll('select');
    selects.forEach(select => {
      select.style.cssText = `
        width: 100%;
        padding: 12px;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        font-family: var(--font-secondary);
        border-radius: 4px;
        cursor: pointer;
      `;
    });
  }
  
  attachEventListeners() {
    // Generation buttons
    this.container.querySelector('#generate-full-npc').addEventListener('click', () => this.generateNPC('full'));
    this.container.querySelector('#generate-quick-stats').addEventListener('click', () => this.generateNPC('quick'));
    this.container.querySelector('#generate-name-only').addEventListener('click', () => this.generateNPC('name'));
    this.container.querySelector('#generate-corporate').addEventListener('click', () => this.generateNPC('corporate'));
    
    // Action buttons
    this.container.querySelector('#save-npc').addEventListener('click', () => this.saveNPC());
    this.container.querySelector('#add-to-combat').addEventListener('click', () => this.addToCombat());
    this.container.querySelector('#export-npc').addEventListener('click', () => this.exportNPC());
    this.container.querySelector('#regenerate-personality').addEventListener('click', () => this.regeneratePersonality());
  }
  
  generateNPC(type = 'full') {
    const culture = this.container.querySelector('#culture-select').value;
    const difficulty = this.container.querySelector('#difficulty-select').value;
    
    let selectedCulture = culture;
    if (culture === 'random') {
      selectedCulture = this.randomFrom(['corporate', 'street', 'japanese', 'latino', 'african']);
    }
    
    // Override culture for corporate type
    if (type === 'corporate') {
      selectedCulture = 'corporate';
    }
    
    this.currentNPC = {
      id: `npc_${Date.now()}`,
      name: this.generateName(selectedCulture),
      culture: selectedCulture,
      role: type === 'corporate' ? 'Exec' : this.randomFrom(Object.keys(this.roles)),
      specialization: '',
      difficulty: difficulty,
      stats: this.generateStats(difficulty),
      skills: this.generateSkills(difficulty),
      equipment: type !== 'name' ? this.generateEquipment(difficulty, selectedCulture) : null,
      personality: type === 'full' || type === 'corporate' ? this.generatePersonality() : null,
      generated: new Date().toISOString()
    };
    
    // Add specialization
    this.currentNPC.specialization = this.randomFrom(this.roles[this.currentNPC.role]);
    
    this.displayNPC(type);
  }
  
  generateName(culture) {
    const genders = ['male', 'female', 'neutral'];
    const gender = this.randomFrom(genders);
    
    const firstName = this.randomFrom(this.names.first[culture][gender]);
    const lastName = this.randomFrom(this.names.last[culture]);
    
    return `${firstName} ${lastName}`;
  }
  
  generateStats(difficulty) {
    const baseStats = {
      mook: { base: 6, variance: 2 },
      skilled: { base: 8, variance: 2 },
      elite: { base: 10, variance: 2 },
      boss: { base: 12, variance: 3 }
    };
    
    const statConfig = baseStats[difficulty];
    const stats = {};
    
    ['INT', 'REF', 'TECH', 'COOL', 'ATTR', 'LUCK', 'MA', 'BODY', 'EMP'].forEach(stat => {
      stats[stat] = Math.max(1, Math.min(10, 
        statConfig.base + Math.floor(Math.random() * statConfig.variance * 2) - statConfig.variance
      ));
    });
    
    // Calculate derived stats
    stats.HP = Math.floor((stats.BODY + stats.MA) / 2) + 10;
    stats.Humanity = stats.EMP * 10;
    
    return stats;
  }
  
  generateSkills(difficulty) {
    const skillLevels = {
      mook: [4, 6, 8],
      skilled: [6, 8, 10],
      elite: [8, 10, 12],
      boss: [10, 12, 14]
    };
    
    const skills = {};
    const levels = skillLevels[difficulty];
    
    // Primary skills (3)
    ['Combat', 'Professional', 'Social'].forEach((category, index) => {
      skills[category] = levels[index] || levels[levels.length - 1];
    });
    
    return skills;
  }
  
  generateEquipment(difficulty, culture) {
    const equipment = {
      weapons: [],
      cyberware: [],
      fashion: []
    };
    
    // Weapons based on difficulty
    const weaponCounts = { mook: 1, skilled: 2, elite: 3, boss: 4 };
    const weaponTypes = Object.keys(this.equipment.weapons);
    
    for (let i = 0; i < weaponCounts[difficulty]; i++) {
      const type = this.randomFrom(weaponTypes);
      equipment.weapons.push(this.randomFrom(this.equipment.weapons[type]));
    }
    
    // Cyberware based on culture and difficulty
    const cyberCounts = { mook: 1, skilled: 2, elite: 3, boss: 4 };
    const cyberTypes = Object.keys(this.equipment.cyberware);
    
    for (let i = 0; i < cyberCounts[difficulty]; i++) {
      const type = this.randomFrom(cyberTypes);
      equipment.cyberware.push(this.randomFrom(this.equipment.cyberware[type]));
    }
    
    // Fashion based on culture
    const fashionCount = culture === 'corporate' ? 3 : 2;
    for (let i = 0; i < fashionCount; i++) {
      equipment.fashion.push(this.randomFrom(this.equipment.fashion));
    }
    
    return equipment;
  }
  
  generatePersonality() {
    return {
      traits: [this.randomFrom(this.personality.traits), this.randomFrom(this.personality.traits)],
      quirk: this.randomFrom(this.personality.quirks),
      motivation: this.randomFrom(this.personality.motivations)
    };
  }
  
  displayNPC(type) {
    const display = this.container.querySelector('#npc-display');
    display.style.display = 'block';
    
    // Header
    const nameElement = this.container.querySelector('#npc-name');
    nameElement.innerHTML = `<glitch-text text="${this.currentNPC.name}" intensity="low" hover-glitch color="primary"></glitch-text>`;
    
    this.container.querySelector('#npc-role').innerHTML = `
      ${this.currentNPC.specialization} (${this.currentNPC.role})
    `;
    
    this.container.querySelector('#npc-culture').innerHTML = `
      <span style="color: var(--secondary); font-size: 14px; text-transform: capitalize;">
        ${this.currentNPC.culture} Background • ${this.currentNPC.difficulty.toUpperCase()} Tier
      </span>
    `;
    
    if (type !== 'name') {
      // Core Stats
      const coreStats = this.container.querySelector('#core-stats');
      coreStats.innerHTML = Object.entries(this.currentNPC.stats)
        .filter(([stat]) => ['INT', 'REF', 'TECH', 'COOL'].includes(stat))
        .map(([stat, value]) => `
          <div class="stat-item">
            <span>${stat}</span>
            <span class="stat-value">${value}</span>
          </div>
        `).join('');
      
      // Combat Stats
      const combatStats = this.container.querySelector('#combat-stats');
      combatStats.innerHTML = Object.entries(this.currentNPC.stats)
        .filter(([stat]) => ['BODY', 'MA', 'HP', 'Humanity'].includes(stat))
        .map(([stat, value]) => `
          <div class="stat-item">
            <span>${stat}</span>
            <span class="stat-value">${value}</span>
          </div>
        `).join('');
      
      // Skills
      const skillsList = this.container.querySelector('#skills-list');
      skillsList.innerHTML = Object.entries(this.currentNPC.skills).map(([skill, value]) => `
        <div class="stat-item">
          <span>${skill}</span>
          <span class="stat-value">${value}</span>
        </div>
      `).join('');
    }
    
    if (this.currentNPC.equipment) {
      // Equipment
      const weaponsList = this.container.querySelector('#weapons-list');
      weaponsList.innerHTML = this.currentNPC.equipment.weapons.map(weapon => 
        `<li>${weapon}</li>`
      ).join('');
      
      const cyberwareList = this.container.querySelector('#cyberware-list');
      cyberwareList.innerHTML = this.currentNPC.equipment.cyberware.map(cyber => 
        `<li>${cyber}</li>`
      ).join('');
      
      const fashionList = this.container.querySelector('#fashion-list');
      fashionList.innerHTML = this.currentNPC.equipment.fashion.map(fashion => 
        `<li>${fashion}</li>`
      ).join('');
    }
    
    if (this.currentNPC.personality) {
      // Personality
      const personalityDisplay = this.container.querySelector('#personality-display');
      personalityDisplay.innerHTML = `
        <div style="margin-bottom: 10px;">
          <strong style="color: var(--primary);">Traits:</strong> 
          ${this.currentNPC.personality.traits.join(', ')}
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: var(--primary);">Quirk:</strong> 
          ${this.currentNPC.personality.quirk}
        </div>
        <div>
          <strong style="color: var(--primary);">Motivation:</strong> 
          ${this.currentNPC.personality.motivation}
        </div>
      `;
    }
  }
  
  regeneratePersonality() {
    if (this.currentNPC) {
      this.currentNPC.personality = this.generatePersonality();
      
      const personalityDisplay = this.container.querySelector('#personality-display');
      personalityDisplay.innerHTML = `
        <div style="margin-bottom: 10px;">
          <strong style="color: var(--primary);">Traits:</strong> 
          ${this.currentNPC.personality.traits.join(', ')}
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: var(--primary);">Quirk:</strong> 
          ${this.currentNPC.personality.quirk}
        </div>
        <div>
          <strong style="color: var(--primary);">Motivation:</strong> 
          ${this.currentNPC.personality.motivation}
        </div>
      `;
    }
  }
  
  saveNPC() {
    if (this.currentNPC) {
      this.savedNPCs.push({ ...this.currentNPC });
      localStorage.setItem('savedNPCs', JSON.stringify(this.savedNPCs));
      this.displaySavedNPCs();
      
      // Show confirmation
      if (window.PanelUtils) {
        window.PanelUtils.showNotification('NPC saved successfully!', 'success');
      }
    }
  }
  
  addToCombat() {
    if (this.currentNPC && window.combatTracker) {
      const npc = {
        name: this.currentNPC.name,
        initiative: Math.floor(Math.random() * 20) + 1,
        hp: this.currentNPC.stats.HP,
        maxHp: this.currentNPC.stats.HP,
        armor: 0,
        isPlayer: false
      };
      
      window.combatTracker.addCombatant(npc);
      
      if (window.PanelUtils) {
        window.PanelUtils.showNotification('NPC added to combat tracker!', 'success');
      }
    }
  }
  
  exportNPC() {
    if (this.currentNPC) {
      const dataStr = JSON.stringify(this.currentNPC, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${this.currentNPC.name.replace(/\s+/g, '_')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  }
  
  displaySavedNPCs() {
    const savedList = this.container.querySelector('#saved-npcs-list');
    
    if (this.savedNPCs.length === 0) {
      savedList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">No saved NPCs yet</div>';
      return;
    }
    
    savedList.innerHTML = this.savedNPCs.map((npc, index) => `
      <div class="saved-npc-item">
        <div>
          <strong>${npc.name}</strong> - ${npc.role} (${npc.culture})
        </div>
        <div style="display: flex; gap: 5px;">
          <button onclick="this.getRootNode().host.loadNPC(${index})" 
                  style="padding: 5px 10px; background: var(--primary); border: none; color: white; cursor: pointer; font-size: 12px;">
            Load
          </button>
          <button onclick="this.getRootNode().host.deleteNPC(${index})" 
                  style="padding: 5px 10px; background: var(--danger); border: none; color: white; cursor: pointer; font-size: 12px;">
            Delete
          </button>
        </div>
      </div>
    `).join('');
  }
  
  loadNPC(index) {
    this.currentNPC = { ...this.savedNPCs[index] };
    this.displayNPC('full');
  }
  
  deleteNPC(index) {
    if (confirm('Delete this NPC?')) {
      this.savedNPCs.splice(index, 1);
      localStorage.setItem('savedNPCs', JSON.stringify(this.savedNPCs));
      this.displaySavedNPCs();
    }
  }
  
  loadSavedNPCs() {
    try {
      return JSON.parse(localStorage.getItem('savedNPCs') || '[]');
    } catch (error) {
      console.error('Error loading saved NPCs:', error);
      return [];
    }
  }
  
  randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedNPCGenerator;
}