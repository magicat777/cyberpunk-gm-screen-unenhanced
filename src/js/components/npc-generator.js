/**
 * NPC Generator for Cyberpunk RED
 * Generates quick NPCs with stats, skills, gear, and background
 */

class NPCGenerator {
  constructor(container) {
    this.container = container;
    this.currentNPC = null;
    this.savedNPCs = this.loadSavedNPCs();
    
    // Data tables for generation
    this.names = {
      first: {
        male: ['Johnny', 'Viktor', 'Rogue', 'Jackie', 'Takemura', 'River', 'Kerry', 'Dum Dum', 'Royce', 'Dexter'],
        female: ['V', 'Judy', 'Panam', 'Evelyn', 'Claire', 'Misty', 'Hanako', 'Alt', 'Lizzy', 'Meredith'],
        neutral: ['Phoenix', 'Neon', 'Chrome', 'Byte', 'Pixel', 'Zero', 'Glitch', 'Synth', 'Data', 'Echo']
      },
      last: ['Silverhand', 'Welles', 'Alvarez', 'Palmer', 'Ward', 'Eurodyne', 'Cunningham', 'DeShawn', 'Stout', 'Okada']
    };
    
    this.roles = ['Solo', 'Netrunner', 'Tech', 'Media', 'Lawman', 'Fixer', 'Exec', 'Rockerboy', 'Nomad', 'Medtech'];
    
    this.cyberware = [
      'Neural Link', 'Cyberoptics', 'Cyberaudio', 'Neural Processor', 'Cyberlimb (Arm)', 
      'Cyberlimb (Leg)', 'Subdermal Armor', 'Reflex Booster', 'Kiroshi Optics', 'Zetatech Neural Processor'
    ];
    
    this.weapons = {
      melee: ['Knife', 'Sword', 'Baseball Bat', 'Monowire', 'Mantis Blades', 'Gorilla Arms'],
      pistol: ['Unity', 'Lexington', 'Overture', 'Malorian Arms 3516', 'Liberty'],
      smg: ['Saratoga', 'Pulsar', 'Shingen', 'Problem Solver'],
      rifle: ['Copperhead', 'Masamune', 'Ajax', 'Divided We Stand'],
      heavy: ['Carnage', 'Crusher', 'Defender', 'Malorian Overwatch']
    };
    
    this.gear = [
      'Agent', 'Airhypo', 'Anti-Smog Breathing Mask', 'Binoculars', 'Carryall', 
      'Duct Tape', 'Flashlight', 'Grapple Gun', 'Handcuffs', 'Lock Picking Set',
      'Medtech Bag', 'Pocket Amplifier', 'Radar Detector', 'Radio Scanner', 'Rope (60m)',
      'Tech Bag', 'Techtool', 'Video Camera'
    ];
    
    this.traits = [
      'Paranoid', 'Ambitious', 'Cynical', 'Loyal', 'Ruthless', 'Idealistic', 
      'Greedy', 'Cautious', 'Reckless', 'Professional', 'Charismatic', 'Cold'
    ];
    
    this.motivations = [
      'Revenge', 'Survival', 'Power', 'Fame', 'Money', 'Family', 
      'Freedom', 'Knowledge', 'Justice', 'Thrills', 'Love', 'Redemption'
    ];
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="npc-generator">
        <!-- Generator Controls -->
        <div class="generator-controls">
          <div class="difficulty-selector">
            <label style="color: var(--text-primary); font-family: var(--font-display); text-transform: uppercase; margin-bottom: 10px; display: block;">
              <glitch-text text="Difficulty Level" intensity="low" speed="slow"></glitch-text>
            </label>
            <select id="npc-difficulty" class="difficulty-select" style="width: 100%; padding: 12px; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); font-family: var(--font-secondary);">
              <option value="mook">Mook (Everyday)</option>
              <option value="skilled" selected>Skilled (Professional)</option>
              <option value="elite">Elite (Hardened)</option>
              <option value="boss">Boss (Legendary)</option>
            </select>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <holo-button id="generate-npc" variant="primary">Generate NPC</holo-button>
            <holo-button id="quick-generate" variant="secondary" size="small">Quick Combat Stats</holo-button>
          </div>
        </div>
        
        <!-- NPC Display -->
        <div class="npc-display" id="npc-display" style="display: none;">
          <div class="npc-header">
            <h3 class="npc-name" id="npc-name"></h3>
            <div class="npc-role" id="npc-role"></div>
          </div>
          
          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-group">
              <h4>Stats</h4>
              <div class="stat-list" id="stats-list"></div>
            </div>
            <div class="stat-group">
              <h4>Combat</h4>
              <div class="combat-stats" id="combat-stats"></div>
            </div>
          </div>
          
          <!-- Skills -->
          <div class="skills-section">
            <h4>Key Skills</h4>
            <div class="skills-list" id="skills-list"></div>
          </div>
          
          <!-- Equipment -->
          <div class="equipment-section">
            <h4>Equipment</h4>
            <div class="equipment-grid">
              <div class="equipment-column">
                <h5>Weapons</h5>
                <div class="weapons-list" id="weapons-list"></div>
              </div>
              <div class="equipment-column">
                <h5>Cyberware</h5>
                <div class="cyberware-list" id="cyberware-list"></div>
              </div>
              <div class="equipment-column">
                <h5>Gear</h5>
                <div class="gear-list" id="gear-list"></div>
              </div>
            </div>
          </div>
          
          <!-- Personality -->
          <div class="personality-section">
            <h4>Personality</h4>
            <div class="personality-traits" id="personality-traits"></div>
          </div>
          
          <!-- Actions -->
          <div class="npc-actions">
            <holo-button id="save-npc" variant="success" size="small">Save NPC</holo-button>
            <holo-button id="add-to-combat" variant="primary" size="small">Add to Combat</holo-button>
            <holo-button id="export-npc" variant="secondary" size="small">Export</holo-button>
          </div>
        </div>
        
        <!-- Saved NPCs -->
        <div class="saved-npcs-section">
          <h4>Saved NPCs</h4>
          <div class="saved-npcs-list" id="saved-npcs-list"></div>
        </div>
      </div>
      
      <style>
        .npc-generator {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
          overflow-y: auto;
          padding: 10px;
        }
        
        .generator-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .difficulty-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }
        
        .difficulty-selector label {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
        }
        
        .difficulty-select {
          flex: 1;
          padding: 8px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-family: var(--font-secondary);
          cursor: pointer;
        }
        
        .npc-display {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .npc-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid var(--primary);
        }
        
        .npc-name {
          font-size: 24px;
          color: var(--primary);
          margin: 0;
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .npc-role {
          font-size: 14px;
          color: var(--accent);
          margin-top: 5px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .stat-group h4 {
          margin: 0 0 10px 0;
          color: var(--primary);
          font-size: 14px;
          text-transform: uppercase;
        }
        
        .stat-list, .combat-stats {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 5px;
          background: var(--bg-overlay);
          border-radius: 3px;
          font-size: 12px;
        }
        
        .stat-value {
          color: var(--primary);
          font-weight: bold;
        }
        
        .skills-section, .equipment-section, .personality-section {
          margin-bottom: 20px;
        }
        
        .skills-section h4, .equipment-section h4, .personality-section h4 {
          margin: 0 0 10px 0;
          color: var(--primary);
          font-size: 14px;
          text-transform: uppercase;
        }
        
        .skills-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 8px;
        }
        
        .skill-item {
          padding: 6px 10px;
          background: var(--bg-overlay);
          border: 1px solid var(--border-color);
          border-radius: 3px;
          font-size: 12px;
          transition: all 0.2s;
        }
        
        .skill-item:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        
        .equipment-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        
        .equipment-column h5 {
          margin: 0 0 8px 0;
          color: var(--accent);
          font-size: 12px;
          text-transform: uppercase;
        }
        
        .weapons-list, .cyberware-list, .gear-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .equipment-item {
          padding: 5px 8px;
          background: var(--bg-overlay);
          border-left: 2px solid var(--accent);
          font-size: 11px;
        }
        
        .personality-traits {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .trait-badge {
          padding: 6px 12px;
          background: var(--bg-overlay);
          border: 1px solid var(--primary);
          border-radius: 20px;
          font-size: 12px;
          color: var(--primary);
        }
        
        .npc-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
        }
        
        .saved-npcs-section {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 15px;
        }
        
        .saved-npcs-section h4 {
          margin: 0 0 10px 0;
          color: var(--primary);
          font-size: 14px;
          text-transform: uppercase;
        }
        
        .saved-npcs-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }
        
        .saved-npc-card {
          padding: 10px;
          background: var(--bg-overlay);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        
        .saved-npc-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        
        .saved-npc-name {
          font-weight: bold;
          color: var(--primary);
          font-size: 14px;
        }
        
        .saved-npc-role {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .delete-npc {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 20px;
          height: 20px;
          background: var(--danger);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 12px;
          cursor: pointer;
          display: none;
        }
        
        .saved-npc-card:hover .delete-npc {
          display: block;
        }
      </style>
    `;
    
    this.renderSavedNPCs();
  }
  
  attachEventListeners() {
    // Generate NPC
    this.container.querySelector('#generate-npc').addEventListener('click', () => {
      this.generateNPC();
    });
    
    // Quick generate
    this.container.querySelector('#quick-generate').addEventListener('click', () => {
      this.generateNPC(true);
    });
    
    // Save NPC
    this.container.querySelector('#save-npc').addEventListener('click', () => {
      this.saveCurrentNPC();
    });
    
    // Add to combat
    this.container.querySelector('#add-to-combat').addEventListener('click', () => {
      this.addToCombat();
    });
    
    // Export NPC
    this.container.querySelector('#export-npc').addEventListener('click', () => {
      this.exportNPC();
    });
  }
  
  generateNPC(quickMode = false) {
    const difficulty = this.container.querySelector('#npc-difficulty').value;
    
    // Generate basic info
    const gender = Math.random() < 0.45 ? 'male' : Math.random() < 0.9 ? 'female' : 'neutral';
    const firstName = this.randomFrom(this.names.first[gender]);
    const lastName = this.randomFrom(this.names.last);
    const role = this.randomFrom(this.roles);
    
    // Generate stats based on difficulty
    const stats = this.generateStats(difficulty);
    
    // Generate combat stats
    const combatStats = this.generateCombatStats(stats, difficulty);
    
    // Generate skills based on role
    const skills = this.generateSkills(role, difficulty);
    
    // Generate equipment
    const equipment = this.generateEquipment(role, difficulty);
    
    // Generate personality (skip in quick mode)
    const personality = quickMode ? null : this.generatePersonality();
    
    // Create NPC object
    this.currentNPC = {
      name: `${firstName} ${lastName}`,
      role: role,
      difficulty: difficulty,
      stats: stats,
      combat: combatStats,
      skills: skills,
      equipment: equipment,
      personality: personality
    };
    
    // Display NPC
    this.displayNPC(quickMode);
    
    // Play sound effect
    if (window.soundManager) {
      window.soundManager.play('uiSuccess');
    }
  }
  
  generateStats(difficulty) {
    const baseStats = {
      mook: { min: 2, max: 6 },
      skilled: { min: 4, max: 7 },
      elite: { min: 5, max: 8 },
      boss: { min: 6, max: 10 }
    };
    
    const range = baseStats[difficulty];
    
    return {
      INT: this.randomRange(range.min, range.max),
      REF: this.randomRange(range.min, range.max),
      DEX: this.randomRange(range.min, range.max),
      TECH: this.randomRange(range.min, range.max),
      COOL: this.randomRange(range.min, range.max),
      WILL: this.randomRange(range.min, range.max),
      LUCK: this.randomRange(range.min, range.max),
      MOVE: this.randomRange(range.min, range.max),
      BODY: this.randomRange(range.min, range.max),
      EMP: this.randomRange(range.min, range.max)
    };
  }
  
  generateCombatStats(stats, difficulty) {
    const hpMultipliers = {
      mook: 2,
      skilled: 3,
      elite: 4,
      boss: 5
    };
    
    const armorValues = {
      mook: { body: 7, head: 0 },
      skilled: { body: 11, head: 11 },
      elite: { body: 12, head: 12 },
      boss: { body: 15, head: 15 }
    };
    
    return {
      hp: 10 + (stats.BODY * hpMultipliers[difficulty]),
      armor: armorValues[difficulty],
      initiative: stats.REF,
      deathSave: stats.BODY,
      seriouslyWounded: Math.floor((10 + (stats.BODY * hpMultipliers[difficulty])) / 2)
    };
  }
  
  generateSkills(role, difficulty) {
    const skillLevels = {
      mook: { primary: 4, secondary: 2 },
      skilled: { primary: 6, secondary: 4 },
      elite: { primary: 8, secondary: 6 },
      boss: { primary: 10, secondary: 8 }
    };
    
    const roleSkills = {
      'Solo': ['Handgun', 'Shoulder Arms', 'Brawling', 'Melee Weapon', 'Athletics'],
      'Netrunner': ['Interface', 'Electronics/Security Tech', 'Cryptography', 'System Knowledge', 'Programming'],
      'Tech': ['Maker', 'Electronics/Security Tech', 'Weaponstech', 'Cybertech', 'Demolitions'],
      'Media': ['Credibility', 'Persuasion', 'Perception', 'Photography/Film', 'Social'],
      'Lawman': ['Authority', 'Criminology', 'Interrogation', 'Streetwise', 'Handgun'],
      'Fixer': ['Streetdeal', 'Trading', 'Business', 'Persuasion', 'Social'],
      'Exec': ['Resources', 'Business', 'Bureaucracy', 'Leadership', 'Social'],
      'Rockerboy': ['Charisma', 'Play Instrument', 'Composition', 'Persuasion', 'Wardrobe & Style'],
      'Nomad': ['Moto', 'Survival', 'Navigation', 'Animal Handling', 'Tracking'],
      'Medtech': ['Medicine', 'Surgery', 'Pharmaceuticals', 'Cryotank Operation', 'Diagnosis']
    };
    
    const skills = [];
    const primarySkills = roleSkills[role] || [];
    const levels = skillLevels[difficulty];
    
    // Add primary skills
    primarySkills.slice(0, 3).forEach(skill => {
      skills.push({ name: skill, level: levels.primary });
    });
    
    // Add secondary skills
    primarySkills.slice(3).forEach(skill => {
      skills.push({ name: skill, level: levels.secondary });
    });
    
    // Add common skills
    skills.push({ name: 'Perception', level: levels.secondary });
    skills.push({ name: 'Evasion', level: levels.secondary });
    
    return skills;
  }
  
  generateEquipment(role, difficulty) {
    const equipment = {
      weapons: [],
      cyberware: [],
      gear: []
    };
    
    // Number of items based on difficulty
    const itemCounts = {
      mook: { weapons: 1, cyberware: 0, gear: 1 },
      skilled: { weapons: 2, cyberware: 1, gear: 2 },
      elite: { weapons: 2, cyberware: 2, gear: 3 },
      boss: { weapons: 3, cyberware: 3, gear: 4 }
    };
    
    const counts = itemCounts[difficulty];
    
    // Generate weapons based on role
    const weaponPreferences = {
      'Solo': ['rifle', 'pistol', 'melee'],
      'Netrunner': ['pistol', 'smg'],
      'Tech': ['pistol', 'melee'],
      'Media': ['pistol'],
      'Lawman': ['pistol', 'smg'],
      'Fixer': ['pistol'],
      'Exec': ['pistol'],
      'Rockerboy': ['pistol', 'melee'],
      'Nomad': ['rifle', 'pistol'],
      'Medtech': ['pistol']
    };
    
    const preferences = weaponPreferences[role] || ['pistol'];
    
    for (let i = 0; i < counts.weapons; i++) {
      const type = preferences[i % preferences.length];
      equipment.weapons.push(this.randomFrom(this.weapons[type]));
    }
    
    // Generate cyberware
    for (let i = 0; i < counts.cyberware; i++) {
      const cyber = this.randomFrom(this.cyberware);
      if (!equipment.cyberware.includes(cyber)) {
        equipment.cyberware.push(cyber);
      }
    }
    
    // Generate gear
    for (let i = 0; i < counts.gear; i++) {
      const item = this.randomFrom(this.gear);
      if (!equipment.gear.includes(item)) {
        equipment.gear.push(item);
      }
    }
    
    return equipment;
  }
  
  generatePersonality() {
    return {
      traits: [this.randomFrom(this.traits), this.randomFrom(this.traits)].filter((v, i, a) => a.indexOf(v) === i),
      motivation: this.randomFrom(this.motivations)
    };
  }
  
  displayNPC(quickMode = false) {
    const display = this.container.querySelector('#npc-display');
    display.style.display = 'block';
    
    // Header with glitch effect for name
    const nameElement = this.container.querySelector('#npc-name');
    nameElement.innerHTML = `<glitch-text text="${this.currentNPC.name}" intensity="low" hover-glitch color="primary"></glitch-text>`;
    this.container.querySelector('#npc-role').textContent = `${this.currentNPC.role} (${this.currentNPC.difficulty.toUpperCase()})`;
    
    // Stats with enhanced styling
    const statsList = this.container.querySelector('#stats-list');
    statsList.innerHTML = Object.entries(this.currentNPC.stats).map(([stat, value]) => `
      <div class="stat-item">
        <span>${stat}</span>
        <span class="stat-value" style="color: var(--primary); font-weight: bold;">${value}</span>
      </div>
    `).join('');
    
    // Combat stats
    const combatStats = this.container.querySelector('#combat-stats');
    combatStats.innerHTML = `
      <div class="stat-item">
        <span>HP</span>
        <span class="stat-value">${this.currentNPC.combat.hp}</span>
      </div>
      <div class="stat-item">
        <span>Body Armor</span>
        <span class="stat-value">${this.currentNPC.combat.armor.body} SP</span>
      </div>
      <div class="stat-item">
        <span>Head Armor</span>
        <span class="stat-value">${this.currentNPC.combat.armor.head} SP</span>
      </div>
      <div class="stat-item">
        <span>Initiative</span>
        <span class="stat-value">+${this.currentNPC.combat.initiative}</span>
      </div>
      <div class="stat-item">
        <span>Death Save</span>
        <span class="stat-value">${this.currentNPC.combat.deathSave}</span>
      </div>
    `;
    
    // Skills
    const skillsList = this.container.querySelector('#skills-list');
    skillsList.innerHTML = this.currentNPC.skills.map(skill => `
      <div class="skill-item">${skill.name} +${skill.level}</div>
    `).join('');
    
    // Equipment
    const weaponsList = this.container.querySelector('#weapons-list');
    weaponsList.innerHTML = this.currentNPC.equipment.weapons.map(weapon => `
      <div class="equipment-item">${weapon}</div>
    `).join('');
    
    const cyberwareList = this.container.querySelector('#cyberware-list');
    cyberwareList.innerHTML = this.currentNPC.equipment.cyberware.length > 0 
      ? this.currentNPC.equipment.cyberware.map(cyber => `
          <div class="equipment-item">${cyber}</div>
        `).join('')
      : '<div class="equipment-item" style="color: var(--text-secondary)">None</div>';
    
    const gearList = this.container.querySelector('#gear-list');
    gearList.innerHTML = this.currentNPC.equipment.gear.map(item => `
      <div class="equipment-item">${item}</div>
    `).join('');
    
    // Personality (skip in quick mode)
    const personalitySection = this.container.querySelector('.personality-section');
    if (quickMode || !this.currentNPC.personality) {
      personalitySection.style.display = 'none';
    } else {
      personalitySection.style.display = 'block';
      const personalityTraits = this.container.querySelector('#personality-traits');
      personalityTraits.innerHTML = `
        ${this.currentNPC.personality.traits.map(trait => `
          <span class="trait-badge">${trait}</span>
        `).join('')}
        <span class="trait-badge" style="background: var(--accent); color: var(--bg-primary);">
          Motivation: ${this.currentNPC.personality.motivation}
        </span>
      `;
    }
  }
  
  saveCurrentNPC() {
    if (!this.currentNPC) return;
    
    this.savedNPCs.push({
      ...this.currentNPC,
      id: Date.now()
    });
    
    this.saveSavedNPCs();
    this.renderSavedNPCs();
    
    // Show feedback
    if (window.soundManager) {
      window.soundManager.play('uiSuccess');
    }
  }
  
  renderSavedNPCs() {
    const list = this.container.querySelector('#saved-npcs-list');
    
    if (this.savedNPCs.length === 0) {
      list.innerHTML = '<div style="text-align: center; color: var(--text-secondary); font-size: 12px;">No saved NPCs yet</div>';
      return;
    }
    
    list.innerHTML = this.savedNPCs.map(npc => `
      <div class="saved-npc-card" data-npc-id="${npc.id}">
        <div class="saved-npc-name">${npc.name}</div>
        <div class="saved-npc-role">${npc.role}</div>
        <button class="delete-npc" onclick="event.stopPropagation(); this.closest('.npc-generator').dispatchEvent(new CustomEvent('delete-npc', {detail: ${npc.id}}))">×</button>
      </div>
    `).join('');
    
    // Add click handlers
    list.querySelectorAll('.saved-npc-card').forEach(card => {
      card.addEventListener('click', () => {
        const npcId = parseInt(card.dataset.npcId);
        const npc = this.savedNPCs.find(n => n.id === npcId);
        if (npc) {
          this.currentNPC = npc;
          this.displayNPC();
        }
      });
    });
    
    // Handle delete events
    this.container.addEventListener('delete-npc', (e) => {
      this.deleteNPC(e.detail);
    });
  }
  
  deleteNPC(id) {
    this.savedNPCs = this.savedNPCs.filter(npc => npc.id !== id);
    this.saveSavedNPCs();
    this.renderSavedNPCs();
  }
  
  addToCombat() {
    if (!this.currentNPC) return;
    
    // Dispatch event with NPC data
    const event = new CustomEvent('add-npc-to-combat', {
      detail: {
        name: this.currentNPC.name,
        ref: this.currentNPC.stats.REF,
        hp: this.currentNPC.combat.hp,
        bodyArmor: this.currentNPC.combat.armor.body,
        headArmor: this.currentNPC.combat.armor.head,
        type: 'NPC'
      },
      bubbles: true
    });
    
    this.container.dispatchEvent(event);
    
    // Show feedback
    if (window.soundManager) {
      window.soundManager.play('uiClick');
    }
  }
  
  exportNPC() {
    if (!this.currentNPC) return;
    
    const npcText = this.formatNPCForExport(this.currentNPC);
    
    // Create download
    const blob = new Blob([npcText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentNPC.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  formatNPCForExport(npc) {
    let text = `CYBERPUNK RED NPC\n`;
    text += `${'='.repeat(50)}\n\n`;
    
    text += `Name: ${npc.name}\n`;
    text += `Role: ${npc.role}\n`;
    text += `Difficulty: ${npc.difficulty.toUpperCase()}\n\n`;
    
    text += `STATS\n${'-'.repeat(20)}\n`;
    Object.entries(npc.stats).forEach(([stat, value]) => {
      text += `${stat}: ${value}\n`;
    });
    
    text += `\nCOMBAT\n${'-'.repeat(20)}\n`;
    text += `HP: ${npc.combat.hp}\n`;
    text += `Body Armor: ${npc.combat.armor.body} SP\n`;
    text += `Head Armor: ${npc.combat.armor.head} SP\n`;
    text += `Initiative: +${npc.combat.initiative}\n`;
    text += `Death Save: ${npc.combat.deathSave}\n`;
    text += `Seriously Wounded: ${npc.combat.seriouslyWounded}\n`;
    
    text += `\nSKILLS\n${'-'.repeat(20)}\n`;
    npc.skills.forEach(skill => {
      text += `${skill.name}: +${skill.level}\n`;
    });
    
    text += `\nEQUIPMENT\n${'-'.repeat(20)}\n`;
    text += `Weapons:\n`;
    npc.equipment.weapons.forEach(weapon => {
      text += `  - ${weapon}\n`;
    });
    
    if (npc.equipment.cyberware.length > 0) {
      text += `\nCyberware:\n`;
      npc.equipment.cyberware.forEach(cyber => {
        text += `  - ${cyber}\n`;
      });
    }
    
    text += `\nGear:\n`;
    npc.equipment.gear.forEach(item => {
      text += `  - ${item}\n`;
    });
    
    if (npc.personality) {
      text += `\nPERSONALITY\n${'-'.repeat(20)}\n`;
      text += `Traits: ${npc.personality.traits.join(', ')}\n`;
      text += `Motivation: ${npc.personality.motivation}\n`;
    }
    
    return text;
  }
  
  // Utility functions
  randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  saveSavedNPCs() {
    try {
      localStorage.setItem('cyberpunk-saved-npcs', JSON.stringify(this.savedNPCs));
    } catch (e) {
      console.error('Failed to save NPCs:', e);
    }
  }
  
  loadSavedNPCs() {
    try {
      const saved = localStorage.getItem('cyberpunk-saved-npcs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load saved NPCs:', e);
      return [];
    }
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NPCGenerator;
}