/**
 * Advanced Combat Tracker for Cyberpunk RED - FIXED VERSION
 * Fixes: initiative sorting, HP tracking, data persistence, remove button
 */

class CyberpunkCombatTracker {
  constructor(container) {
    this.container = container;
    this.combatants = [];
    this.round = 1;
    this.currentTurn = 0;
    this.combatActive = false;
    this.combatLog = [];
    
    this.init();
  }
  
  init() {
    this.loadCombat();
    this.render();
    this.attachEventListeners();
    this.renderCombatants();
    this.renderLog();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="combat-tracker-advanced">
        <!-- Combat Header -->
        <div class="combat-header">
          <div class="round-display">
            <span class="round-label">Round</span>
            <span class="round-number" id="round-number">${this.round}</span>
          </div>
          <div class="combat-controls">
            <button id="start-combat" class="holo-button ${this.combatActive ? 'danger' : 'success'} small">
              ${this.combatActive ? 'End Combat' : 'Start Combat'}
            </button>
            <button id="next-turn" class="holo-button primary small" ${!this.combatActive ? 'disabled' : ''}>
              Next Turn
            </button>
          </div>
        </div>
        
        <!-- Add Combatant Form -->
        <div class="add-combatant-form">
          <div class="form-row">
            <div class="input-group">
              <label for="combatant-name">Name</label>
              <input 
                id="combatant-name" 
                type="text"
                placeholder="Character Name" 
                class="neon-input primary"
              />
            </div>
            <div class="input-group">
              <label for="combatant-ref">REF</label>
              <input 
                type="number" 
                id="combatant-ref" 
                placeholder="5" 
                min="1" 
                max="10"
                class="neon-input primary"
                value="5"
              />
            </div>
            <div class="input-group">
              <label for="combatant-hp">HP</label>
              <input 
                type="number" 
                id="combatant-hp" 
                placeholder="40" 
                min="1" 
                max="100"
                class="neon-input primary"
                value="40"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="input-group">
              <label for="combatant-body-armor">Body SP</label>
              <input 
                type="number" 
                id="combatant-body-armor" 
                placeholder="11" 
                min="0" 
                max="20"
                class="neon-input secondary"
                value="11"
              />
            </div>
            <div class="input-group">
              <label for="combatant-head-armor">Head SP</label>
              <input 
                type="number" 
                id="combatant-head-armor" 
                placeholder="11" 
                min="0" 
                max="20"
                class="neon-input secondary"
                value="11"
              />
            </div>
            <select id="combatant-type" class="type-select">
              <option value="PC">PC</option>
              <option value="NPC">NPC</option>
              <option value="Enemy">Enemy</option>
            </select>
            <button id="add-combatant" class="holo-button success">Add</button>
          </div>
        </div>
        
        <!-- Combatants List -->
        <div class="combatants-container">
          <div class="combatants-header">
            <span>Initiative Order</span>
            <div class="header-actions">
              <button id="roll-all-initiative" class="holo-button secondary small">Roll All Initiative</button>
              <button id="clear-combat" class="holo-button danger small">Clear All</button>
            </div>
          </div>
          <div class="combatants-list" id="combatants-list">
            <!-- Combatant cards will be inserted here -->
          </div>
        </div>
        
        <!-- Combat Log -->
        <div class="combat-log">
          <div class="log-header">
            <h4>Combat Log</h4>
            <button class="clear-log-btn" id="clear-log" title="Clear Log">×</button>
          </div>
          <div class="log-entries" id="combat-log"></div>
        </div>
      </div>
      
      <style>
        .combat-tracker-advanced {
          display: flex;
          flex-direction: column;
          gap: 15px;
          height: 100%;
          overflow-y: auto;
          position: relative;
        }
        
        .combat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
        }
        
        .round-display {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .round-label {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
        }
        
        .round-number {
          font-size: 32px;
          font-weight: bold;
          color: var(--primary);
          text-shadow: 0 0 10px var(--primary);
          font-family: var(--font-display);
        }
        
        .combat-controls {
          display: flex;
          gap: 10px;
        }
        
        .add-combatant-form {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 15px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .form-row:last-child {
          grid-template-columns: 1fr 1fr 1fr 120px;
          margin-bottom: 0;
        }
        
        .type-select {
          padding: 10px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-family: var(--font-secondary);
          cursor: pointer;
        }
        
        .combatants-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          overflow: hidden;
          min-height: 200px;
        }
        
        .combatants-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .header-actions {
          display: flex;
          gap: 10px;
        }
        
        .combatants-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .combatants-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .combatants-list::-webkit-scrollbar-track {
          background: var(--bg-surface);
        }
        
        .combatants-list::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
        
        /* Combatant Card */
        .combatant-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 10px;
          position: relative;
          transition: all 0.3s;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .combatant-card.active {
          border-color: var(--primary);
          box-shadow: 0 0 10px var(--primary);
          background: rgba(0, 255, 255, 0.05);
        }
        
        .combatant-card.PC {
          border-left: 3px solid var(--success);
        }
        
        .combatant-card.NPC {
          border-left: 3px solid var(--accent);
        }
        
        .combatant-card.Enemy {
          border-left: 3px solid var(--danger);
        }
        
        .combatant-card.dead {
          opacity: 0.5;
          filter: grayscale(1);
        }
        
        .combatant-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .combatant-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .combatant-name {
          font-weight: bold;
          font-size: 16px;
        }
        
        .combatant-initiative {
          font-size: 24px;
          font-weight: bold;
          color: var(--primary);
          min-width: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .combatant-initiative:hover {
          transform: scale(1.1);
          text-shadow: 0 0 15px var(--primary);
        }
        
        .combatant-stats {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .stat-block {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-label {
          font-size: 10px;
          color: var(--text-secondary);
          text-transform: uppercase;
        }
        
        .stat-value {
          font-size: 18px;
          font-weight: bold;
        }
        
        .hp-bar {
          width: 100%;
          height: 20px;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid var(--border-color);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        
        .hp-fill {
          height: 100%;
          background: var(--success);
          transition: width 0.3s, background-color 0.3s;
        }
        
        .hp-fill.wounded {
          background: var(--warning);
        }
        
        .hp-fill.critical {
          background: var(--danger);
        }
        
        .hp-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: bold;
          text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
        }
        
        .combatant-actions {
          display: flex;
          gap: 5px;
          justify-content: space-between;
        }
        
        .action-buttons {
          display: flex;
          gap: 5px;
        }
        
        .action-btn {
          padding: 4px 8px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          border-radius: 2px;
        }
        
        .action-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(0, 255, 255, 0.1);
        }
        
        .action-btn.remove-btn:hover {
          border-color: var(--danger);
          color: var(--danger);
          background: rgba(255, 0, 64, 0.1);
        }
        
        .status-tags {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }
        
        .status-tag {
          padding: 2px 6px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          font-size: 10px;
          border-radius: 2px;
        }
        
        .status-tag.stunned {
          border-color: var(--warning);
          color: var(--warning);
        }
        
        .status-tag.prone {
          border-color: var(--accent);
          color: var(--accent);
        }
        
        .status-tag.wounded {
          border-color: var(--danger);
          color: var(--danger);
        }
        
        .combat-log {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 10px;
          max-height: 150px;
        }
        
        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .combat-log h4 {
          margin: 0;
          font-size: 14px;
          color: var(--primary);
          text-transform: uppercase;
        }
        
        .clear-log-btn {
          width: 20px;
          height: 20px;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 2px;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .clear-log-btn:hover {
          border-color: var(--danger);
          color: var(--danger);
          background: rgba(255, 0, 0, 0.1);
        }
        
        .log-entries {
          max-height: 100px;
          overflow-y: auto;
          display: flex;
          flex-direction: column-reverse;
          gap: 5px;
        }
        
        .log-entries::-webkit-scrollbar {
          width: 6px;
        }
        
        .log-entries::-webkit-scrollbar-track {
          background: var(--bg-surface);
        }
        
        .log-entries::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
        
        .log-entry {
          font-size: 12px;
          padding: 4px;
          border-left: 2px solid var(--border-color);
          padding-left: 8px;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .log-entry.damage {
          border-left-color: var(--danger);
        }
        
        .log-entry.heal {
          border-left-color: var(--success);
        }
        
        .log-entry.status {
          border-left-color: var(--accent);
        }
        
        .log-entry.initiative {
          border-left-color: var(--primary);
        }
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
          font-style: italic;
        }
      </style>
    `;
  }
  
  attachEventListeners() {
    // Combat controls
    this.container.querySelector('#start-combat').addEventListener('click', () => this.toggleCombat());
    this.container.querySelector('#next-turn').addEventListener('click', () => this.nextTurn());
    
    // Add combatant
    this.container.querySelector('#add-combatant').addEventListener('click', () => this.addCombatant());
    
    // Roll all initiative
    this.container.querySelector('#roll-all-initiative').addEventListener('click', () => this.rollAllInitiative());
    
    // Clear combat
    this.container.querySelector('#clear-combat').addEventListener('click', () => this.clearCombat());
    
    // Clear log
    this.container.querySelector('#clear-log').addEventListener('click', () => this.clearLog());
    
    // Enter key on name input
    const nameInput = this.container.querySelector('#combatant-name');
    if (nameInput) {
      nameInput.addEventListener('neon-change', (e) => {
        if (e.detail.value && e.key === 'Enter') {
          this.addCombatant();
        }
      });
    }
  }
  
  addCombatant() {
    const nameInput = this.container.querySelector('#combatant-name');
    const refInput = this.container.querySelector('#combatant-ref');
    const hpInput = this.container.querySelector('#combatant-hp');
    const bodyArmorInput = this.container.querySelector('#combatant-body-armor');
    const headArmorInput = this.container.querySelector('#combatant-head-armor');
    const typeSelect = this.container.querySelector('#combatant-type');
    
    const name = nameInput.value;
    if (!name) {
      nameInput.focus();
      return;
    }
    
    const combatant = {
      id: Date.now(),
      name: name,
      type: typeSelect.value,
      ref: parseInt(refInput.value) || 5,
      hp: {
        current: parseInt(hpInput.value) || 40,
        max: parseInt(hpInput.value) || 40
      },
      armor: {
        body: {
          current: parseInt(bodyArmorInput.value) || 11,
          max: parseInt(bodyArmorInput.value) || 11
        },
        head: {
          current: parseInt(headArmorInput.value) || 11,
          max: parseInt(headArmorInput.value) || 11
        }
      },
      initiative: 0,
      status: [],
      actions: {
        move: true,
        action: true
      }
    };
    
    this.combatants.push(combatant);
    this.logEntry(`${combatant.name} joined combat`, 'status');
    this.saveCombat();
    this.renderCombatants();
    
    // Clear inputs
    nameInput.clear();
    nameInput.focus();
  }
  
  rollAllInitiative() {
    this.combatants.forEach(combatant => {
      if (combatant.hp.current > 0) {
        combatant.initiative = Math.floor(Math.random() * 10) + 1 + combatant.ref;
      }
    });
    
    // Play dice roll sound
    if (window.soundManager) {
      window.soundManager.play('diceRoll');
    }
    
    this.sortByInitiative();
    this.logEntry('Rolled initiative for all combatants', 'initiative');
    this.saveCombat();
    this.renderCombatants();
  }
  
  rollInitiative(id) {
    const combatant = this.combatants.find(c => c.id === id);
    if (combatant && combatant.hp.current > 0) {
      const roll = Math.floor(Math.random() * 10) + 1;
      combatant.initiative = roll + combatant.ref;
      
      // Play dice roll sound
      if (window.soundManager) {
        window.soundManager.play('diceRoll');
      }
      
      this.logEntry(`${combatant.name} rolled initiative: ${roll} + ${combatant.ref} = ${combatant.initiative}`, 'initiative');
      this.sortByInitiative();
      this.saveCombat();
      this.renderCombatants();
    }
  }
  
  sortByInitiative() {
    this.combatants.sort((a, b) => {
      // Dead combatants go to the bottom
      if (a.hp.current <= 0 && b.hp.current > 0) return 1;
      if (b.hp.current <= 0 && a.hp.current > 0) return -1;
      
      // Sort by initiative (highest first)
      return b.initiative - a.initiative;
    });
  }
  
  toggleCombat() {
    this.combatActive = !this.combatActive;
    
    if (this.combatActive) {
      this.round = 1;
      this.currentTurn = 0;
      this.logEntry('Combat started!', 'status');
    } else {
      this.logEntry('Combat ended.', 'status');
    }
    
    this.saveCombat();
    this.render();
    this.attachEventListeners();
    this.renderCombatants();
    this.renderLog();
  }
  
  nextTurn() {
    if (!this.combatActive || this.combatants.length === 0) return;
    
    // Find next alive combatant
    let attempts = 0;
    do {
      this.currentTurn++;
      if (this.currentTurn >= this.combatants.length) {
        this.currentTurn = 0;
        this.round++;
        this.container.querySelector('#round-number').textContent = this.round;
        this.logEntry(`Round ${this.round} started`, 'status');
      }
      attempts++;
    } while (this.combatants[this.currentTurn].hp.current <= 0 && attempts < this.combatants.length);
    
    const current = this.combatants[this.currentTurn];
    if (current) {
      this.logEntry(`${current.name}'s turn`, 'status');
    }
    
    this.saveCombat();
    this.renderCombatants();
  }
  
  dealDamage(id) {
    const combatant = this.combatants.find(c => c.id === id);
    if (!combatant) return;
    
    const damage = parseInt(prompt(`Deal damage to ${combatant.name}:`, '10'));
    if (isNaN(damage) || damage <= 0) return;
    
    const location = confirm('Hit to head? (OK = Head, Cancel = Body)') ? 'head' : 'body';
    let actualDamage = damage;
    
    // Apply armor
    if (combatant.armor[location].current > 0) {
      actualDamage = Math.max(0, damage - combatant.armor[location].current);
      combatant.armor[location].current = Math.max(0, combatant.armor[location].current - 1);
    }
    
    combatant.hp.current = Math.max(0, combatant.hp.current - actualDamage);
    
    // Play appropriate sound effect
    if (window.soundManager) {
      if (combatant.hp.current <= 0) {
        window.soundManager.play('criticalFail'); // Death sound
      } else if (actualDamage >= 15) {
        window.soundManager.play('combatHit'); // Heavy hit
      } else {
        window.soundManager.play('combatHit'); // Normal hit
      }
    }
    
    this.logEntry(
      `${combatant.name} took ${actualDamage} damage to ${location} (${damage} - ${damage - actualDamage} SP)`,
      'damage'
    );
    
    // Check for death
    if (combatant.hp.current <= 0) {
      this.logEntry(`${combatant.name} is down!`, 'damage');
      combatant.status.push('dead');
    }
    
    this.saveCombat();
    this.renderCombatants();
  }
  
  heal(id) {
    const combatant = this.combatants.find(c => c.id === id);
    if (!combatant) return;
    
    const healing = parseInt(prompt(`Heal ${combatant.name}:`, '5'));
    if (isNaN(healing) || healing <= 0) return;
    
    const oldHp = combatant.hp.current;
    combatant.hp.current = Math.min(combatant.hp.max, combatant.hp.current + healing);
    const actualHealing = combatant.hp.current - oldHp;
    
    // Play healing sound
    if (window.soundManager && actualHealing > 0) {
      window.soundManager.play('uiSuccess');
    }
    
    this.logEntry(`${combatant.name} healed ${actualHealing} HP`, 'heal');
    
    // Remove dead status if healed
    if (combatant.hp.current > 0) {
      combatant.status = combatant.status.filter(s => s !== 'dead');
    }
    
    this.saveCombat();
    this.renderCombatants();
  }
  
  editArmor(id) {
    const combatant = this.combatants.find(c => c.id === id);
    if (!combatant) return;
    
    const newBodyArmor = prompt(`Set ${combatant.name}'s body armor:`, combatant.armor.body.current);
    if (newBodyArmor !== null) {
      combatant.armor.body.current = Math.max(0, parseInt(newBodyArmor) || 0);
    }
    
    const newHeadArmor = prompt(`Set ${combatant.name}'s head armor:`, combatant.armor.head.current);
    if (newHeadArmor !== null) {
      combatant.armor.head.current = Math.max(0, parseInt(newHeadArmor) || 0);
    }
    
    this.saveCombat();
    this.renderCombatants();
  }
  
  remove(id) {
    const combatant = this.combatants.find(c => c.id === id);
    if (!combatant) return;
    
    if (confirm(`Remove ${combatant.name} from combat?`)) {
      this.combatants = this.combatants.filter(c => c.id !== id);
      this.logEntry(`${combatant.name} removed from combat`, 'status');
      
      // Adjust current turn if needed
      if (this.currentTurn >= this.combatants.length) {
        this.currentTurn = Math.max(0, this.combatants.length - 1);
      }
      
      this.saveCombat();
      this.renderCombatants();
    }
  }
  
  clearCombat() {
    if (confirm('Clear all combatants? This cannot be undone.')) {
      this.combatants = [];
      this.round = 1;
      this.currentTurn = 0;
      this.combatActive = false;
      this.combatLog = [];
      this.saveCombat();
      this.render();
      this.attachEventListeners();
    }
  }
  
  renderCombatants() {
    const list = this.container.querySelector('#combatants-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (this.combatants.length === 0) {
      list.innerHTML = '<div class="empty-state">No combatants yet. Add some above!</div>';
      return;
    }
    
    this.combatants.forEach((combatant, index) => {
      const isActive = this.combatActive && index === this.currentTurn;
      const isDead = combatant.hp.current <= 0;
      const hpPercent = (combatant.hp.current / combatant.hp.max) * 100;
      const hpClass = hpPercent <= 25 ? 'critical' : hpPercent <= 50 ? 'wounded' : '';
      
      const card = document.createElement('div');
      card.className = `combatant-card ${combatant.type} ${isActive ? 'active' : ''} ${isDead ? 'dead' : ''}`;
      
      card.innerHTML = `
        <div class="combatant-header">
          <div class="combatant-info">
            <div class="combatant-initiative" onclick="window.combatTracker.rollInitiative(${combatant.id})" title="Click to reroll">
              ${combatant.initiative}
            </div>
            <div class="combatant-name">${combatant.name}</div>
          </div>
          <div class="status-tags">
            ${combatant.status.map(s => `<span class="status-tag ${s}">${s}</span>`).join('')}
          </div>
        </div>
        
        <div class="combatant-stats">
          <div class="stat-block">
            <div class="hp-bar">
              <div class="hp-fill ${hpClass}" style="width: ${hpPercent}%"></div>
              <div class="hp-text">${combatant.hp.current}/${combatant.hp.max}</div>
            </div>
          </div>
          <div class="stat-block">
            <span class="stat-label">Body SP</span>
            <span class="stat-value">${combatant.armor.body.current}</span>
          </div>
          <div class="stat-block">
            <span class="stat-label">Head SP</span>
            <span class="stat-value">${combatant.armor.head.current}</span>
          </div>
        </div>
        
        <div class="combatant-actions">
          <div class="action-buttons">
            <button class="action-btn" onclick="window.combatTracker.dealDamage(${combatant.id})">Damage</button>
            <button class="action-btn" onclick="window.combatTracker.heal(${combatant.id})">Heal</button>
            <button class="action-btn" onclick="window.combatTracker.editArmor(${combatant.id})">Armor</button>
          </div>
          <button class="action-btn remove-btn" onclick="window.combatTracker.remove(${combatant.id})">Remove</button>
        </div>
      `;
      
      list.appendChild(card);
    });
  }
  
  logEntry(message, type = '') {
    const entry = {
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    
    this.combatLog.unshift(entry);
    if (this.combatLog.length > 100) {
      this.combatLog = this.combatLog.slice(0, 100);
    }
    
    this.saveCombat();
    this.renderLog();
  }
  
  renderLog() {
    const logContainer = this.container.querySelector('#combat-log');
    if (!logContainer) return;
    
    logContainer.innerHTML = this.combatLog.slice(0, 20).map(entry => `
      <div class="log-entry ${entry.type}">
        <span>${entry.timestamp}</span> - ${entry.message}
      </div>
    `).join('');
  }
  
  clearLog() {
    if (confirm('Clear combat log?')) {
      this.combatLog = [];
      this.saveCombat();
      this.renderLog();
    }
  }
  
  saveCombat() {
    const data = {
      combatants: this.combatants,
      round: this.round,
      currentTurn: this.currentTurn,
      combatActive: this.combatActive,
      combatLog: this.combatLog
    };
    
    try {
      localStorage.setItem('cyberpunk-combat-tracker', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save combat data:', e);
    }
  }
  
  loadCombat() {
    try {
      const saved = localStorage.getItem('cyberpunk-combat-tracker');
      if (saved) {
        const data = JSON.parse(saved);
        this.combatants = data.combatants || [];
        this.round = data.round || 1;
        this.currentTurn = data.currentTurn || 0;
        this.combatActive = data.combatActive || false;
        this.combatLog = data.combatLog || [];
      }
    } catch (e) {
      console.error('Failed to load combat data:', e);
      this.combatants = [];
      this.combatLog = [];
    }
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CyberpunkCombatTracker;
}