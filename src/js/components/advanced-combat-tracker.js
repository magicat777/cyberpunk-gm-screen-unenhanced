/**
 * Advanced Combat Tracker for Cyberpunk RED
 * Full combat management with Cyberpunk RED rules
 */

class CyberpunkCombatTracker {
  constructor(container) {
    this.container = container;
    this.combatants = [];
    this.round = 1;
    this.currentTurn = 0;
    this.combatActive = false;
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
    this.loadCombat();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="combat-tracker-advanced">
        <!-- Combat Header -->
        <div class="combat-header">
          <div class="round-display">
            <span class="round-label">Round</span>
            <span class="round-number">${this.round}</span>
          </div>
          <div class="combat-controls">
            <holo-button id="start-combat" variant="${this.combatActive ? 'danger' : 'success'}" size="small">
              ${this.combatActive ? 'End Combat' : 'Start Combat'}
            </holo-button>
            <holo-button id="next-turn" variant="primary" size="small" ${!this.combatActive ? 'disabled' : ''}>
              Next Turn
            </holo-button>
          </div>
        </div>
        
        <!-- Add Combatant Form -->
        <div class="add-combatant-form">
          <div class="form-row">
            <neon-input 
              id="combatant-name" 
              placeholder="Character Name" 
              label="Name"
              variant="primary"
            ></neon-input>
            <neon-input 
              type="number" 
              id="combatant-ref" 
              placeholder="5" 
              label="REF"
              min="1" 
              max="10"
              variant="primary"
            ></neon-input>
            <neon-input 
              type="number" 
              id="combatant-hp" 
              placeholder="40" 
              label="HP"
              min="1" 
              max="100"
              variant="primary"
            ></neon-input>
          </div>
          <div class="form-row">
            <neon-input 
              type="number" 
              id="combatant-body-armor" 
              placeholder="11" 
              label="Body SP"
              min="0" 
              max="20"
              variant="secondary"
            ></neon-input>
            <neon-input 
              type="number" 
              id="combatant-head-armor" 
              placeholder="11" 
              label="Head SP"
              min="0" 
              max="20"
              variant="secondary"
            ></neon-input>
            <select id="combatant-type" class="type-select">
              <option value="PC">PC</option>
              <option value="NPC">NPC</option>
              <option value="Enemy">Enemy</option>
            </select>
            <holo-button id="add-combatant" variant="success">Add</holo-button>
          </div>
        </div>
        
        <!-- Combatants List -->
        <div class="combatants-container">
          <div class="combatants-header">
            <span>Initiative Order</span>
            <holo-button id="roll-all-initiative" variant="secondary" size="small">Roll All Initiative</holo-button>
          </div>
          <div class="combatants-list" id="combatants-list">
            <!-- Combatant cards will be inserted here -->
          </div>
        </div>
        
        <!-- Combat Log -->
        <div class="combat-log">
          <h4>Combat Log</h4>
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
        }
        
        .combatants-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .combatants-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        /* Combatant Card */
        .combatant-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 10px;
          position: relative;
          transition: all 0.3s;
        }
        
        .combatant-card.active {
          border-color: var(--primary);
          box-shadow: 0 0 10px var(--primary);
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
        }
        
        .action-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
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
        
        .combat-log {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 10px;
          max-height: 150px;
        }
        
        .combat-log h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: var(--primary);
          text-transform: uppercase;
        }
        
        .log-entries {
          max-height: 100px;
          overflow-y: auto;
          display: flex;
          flex-direction: column-reverse;
          gap: 5px;
        }
        
        .log-entry {
          font-size: 12px;
          padding: 4px;
          border-left: 2px solid var(--border-color);
          padding-left: 8px;
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
    
    // Enter key on inputs
    this.container.querySelectorAll('neon-input').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.addCombatant();
      });
    });
    
    // Delegate action button clicks
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('action-btn')) {
        const action = e.target.dataset.action;
        const id = parseInt(e.target.dataset.id);
        
        switch(action) {
          case 'damage': this.dealDamage(id); break;
          case 'heal': this.heal(id); break;
          case 'armor': this.editArmor(id); break;
          case 'remove': this.remove(id); break;
        }
      }
    });
  }
  
  addCombatant() {
    const nameInput = this.container.querySelector('#combatant-name');
    const refInput = this.container.querySelector('#combatant-ref');
    const hpInput = this.container.querySelector('#combatant-hp');
    const bodyArmorInput = this.container.querySelector('#combatant-body-armor');
    const headArmorInput = this.container.querySelector('#combatant-head-armor');
    const typeSelect = this.container.querySelector('#combatant-type');
    
    const name = nameInput.value;
    if (!name) return;
    
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
    this.renderCombatants();
    
    // Clear inputs
    nameInput.clear();
    refInput.value = '5';
    hpInput.value = '40';
    bodyArmorInput.value = '11';
    headArmorInput.value = '11';
    
    this.logEntry(`${combatant.name} joined combat`, 'status');
  }
  
  rollAllInitiative() {
    this.combatants.forEach(combatant => {
      if (combatant.hp.current > 0) {
        combatant.initiative = Math.floor(Math.random() * 10) + 1 + combatant.ref;
      }
    });
    
    // Sort by initiative
    this.combatants.sort((a, b) => b.initiative - a.initiative);
    this.renderCombatants();
    
    this.logEntry('Initiative rolled for all combatants', 'status');
  }
  
  toggleCombat() {
    this.combatActive = !this.combatActive;
    
    if (this.combatActive) {
      this.round = 1;
      this.currentTurn = 0;
      this.logEntry('Combat started!', 'status');
    } else {
      this.logEntry('Combat ended', 'status');
    }
    
    this.render();
  }
  
  nextTurn() {
    if (!this.combatActive) return;
    
    // Reset current combatant's actions
    if (this.combatants[this.currentTurn]) {
      this.combatants[this.currentTurn].actions = {
        move: true,
        action: true
      };
    }
    
    // Move to next combatant
    this.currentTurn++;
    
    // Skip dead combatants
    while (this.currentTurn < this.combatants.length && 
           this.combatants[this.currentTurn].hp.current <= 0) {
      this.currentTurn++;
    }
    
    // Check for round end
    if (this.currentTurn >= this.combatants.length) {
      this.currentTurn = 0;
      this.round++;
      this.container.querySelector('.round-number').textContent = this.round;
      this.logEntry(`Round ${this.round} begins`, 'status');
      
      // Skip dead combatants at start of round
      while (this.currentTurn < this.combatants.length && 
             this.combatants[this.currentTurn].hp.current <= 0) {
        this.currentTurn++;
      }
    }
    
    this.renderCombatants();
    
    if (this.combatants[this.currentTurn]) {
      this.logEntry(`${this.combatants[this.currentTurn].name}'s turn`, 'status');
    }
  }
  
  renderCombatants() {
    const list = this.container.querySelector('#combatants-list');
    list.innerHTML = '';
    
    this.combatants.forEach((combatant, index) => {
      const card = this.createCombatantCard(combatant, index);
      list.appendChild(card);
    });
  }
  
  createCombatantCard(combatant, index) {
    const card = document.createElement('div');
    card.className = `combatant-card ${combatant.type}`;
    
    if (this.combatActive && index === this.currentTurn) {
      card.classList.add('active');
    }
    
    if (combatant.hp.current <= 0) {
      card.classList.add('dead');
    }
    
    const hpPercent = (combatant.hp.current / combatant.hp.max) * 100;
    const hpClass = hpPercent <= 25 ? 'critical' : hpPercent <= 50 ? 'wounded' : '';
    
    card.innerHTML = `
      <div class="combatant-header">
        <span class="combatant-name">${combatant.name}</span>
        <span class="combatant-initiative">${combatant.initiative}</span>
      </div>
      
      <div class="combatant-stats">
        <div class="stat-block">
          <div class="hp-bar">
            <div class="hp-fill ${hpClass}" style="width: ${hpPercent}%"></div>
            <span class="hp-text">${combatant.hp.current}/${combatant.hp.max}</span>
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
          <button class="action-btn" data-action="damage" data-id="${combatant.id}">Damage</button>
          <button class="action-btn" data-action="heal" data-id="${combatant.id}">Heal</button>
          <button class="action-btn" data-action="armor" data-id="${combatant.id}">Armor</button>
          <button class="action-btn" data-action="remove" data-id="${combatant.id}">Remove</button>
        </div>
        
        <div class="status-tags">
          ${combatant.status.map(s => `<span class="status-tag ${s}">${s}</span>`).join('')}
        </div>
      </div>
    `;
    
    return card;
  }
  
  dealDamage(id) {
    const combatant = this.combatants.find(c => c.id === id);
    if (!combatant) return;
    
    const damage = parseInt(prompt(`Damage to ${combatant.name}:`, '10'));
    if (!damage) return;
    
    const location = prompt('Hit location (body/head):', 'body').toLowerCase();
    const armor = combatant.armor[location] || combatant.armor.body;
    
    let actualDamage = damage;
    if (armor.current > 0) {
      actualDamage = Math.max(0, damage - armor.current);
      if (damage > armor.current) {
        armor.current = Math.max(0, armor.current - 1); // Armor ablation
      }
    }
    
    combatant.hp.current = Math.max(0, combatant.hp.current - actualDamage);
    
    this.logEntry(
      `${combatant.name} takes ${actualDamage} damage (${damage} - ${armor.current} SP)`,
      'damage'
    );
    
    if (combatant.hp.current <= 0) {
      this.logEntry(`${combatant.name} is down!`, 'damage');
    }
    
    this.renderCombatants();
    this.saveCombat();
  }
  
  heal(id) {
    const combatant = this.combatants.find(c => c.id === id);
    if (!combatant) return;
    
    const healing = parseInt(prompt(`Heal ${combatant.name}:`, '10'));
    if (!healing) return;
    
    combatant.hp.current = Math.min(combatant.hp.max, combatant.hp.current + healing);
    
    this.logEntry(`${combatant.name} healed for ${healing} HP`, 'heal');
    this.renderCombatants();
    this.saveCombat();
  }
  
  editArmor(id) {
    const combatant = this.combatants.find(c => c.id === id);
    if (!combatant) return;
    
    const newBodySP = prompt(`${combatant.name}'s Body SP:`, combatant.armor.body.current);
    const newHeadSP = prompt(`${combatant.name}'s Head SP:`, combatant.armor.head.current);
    
    if (newBodySP !== null) combatant.armor.body.current = parseInt(newBodySP) || 0;
    if (newHeadSP !== null) combatant.armor.head.current = parseInt(newHeadSP) || 0;
    
    this.renderCombatants();
    this.saveCombat();
  }
  
  remove(id) {
    const combatant = this.combatants.find(c => c.id === id);
    if (!combatant) return;
    
    if (confirm(`Remove ${combatant.name} from combat?`)) {
      this.combatants = this.combatants.filter(c => c.id !== id);
      
      // Adjust current turn if needed
      if (this.currentTurn >= this.combatants.length) {
        this.currentTurn = 0;
      }
      
      this.logEntry(`${combatant.name} removed from combat`, 'status');
      this.renderCombatants();
      this.saveCombat();
    }
  }
  
  logEntry(message, type = '') {
    const log = this.container.querySelector('#combat-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[R${this.round}] ${message}`;
    log.appendChild(entry);
    
    // Keep only last 20 entries
    while (log.children.length > 20) {
      log.removeChild(log.firstChild);
    }
  }
  
  saveCombat() {
    const data = {
      combatants: this.combatants,
      round: this.round,
      currentTurn: this.currentTurn,
      combatActive: this.combatActive
    };
    localStorage.setItem('cyberpunk-combat', JSON.stringify(data));
  }
  
  loadCombat() {
    const saved = localStorage.getItem('cyberpunk-combat');
    if (saved) {
      const data = JSON.parse(saved);
      this.combatants = data.combatants || [];
      this.round = data.round || 1;
      this.currentTurn = data.currentTurn || 0;
      this.combatActive = data.combatActive || false;
      
      this.renderCombatants();
      this.container.querySelector('.round-number').textContent = this.round;
      
      if (this.combatActive) {
        this.container.querySelector('#start-combat').setAttribute('variant', 'danger');
        this.container.querySelector('#start-combat').textContent = 'End Combat';
        this.container.querySelector('#next-turn').removeAttribute('disabled');
      }
    }
  }
}

// Make available globally for inline handlers
window.combatTracker = null;

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CyberpunkCombatTracker;
}