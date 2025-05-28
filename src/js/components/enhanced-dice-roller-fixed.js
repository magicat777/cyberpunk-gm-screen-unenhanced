/**
 * Enhanced Dice Roller for Cyberpunk RED - FIXED VERSION
 * Fixes: animation timing, history persistence, critical detection
 */

class CyberpunkDiceRoller {
  constructor(container) {
    this.container = container;
    this.history = [];
    this.macros = this.loadMacros();
    this.criticalInjuries = this.getCriticalInjuryTable();
    this.isRolling = false; // Prevent multiple simultaneous rolls
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
    this.loadHistory();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="dice-roller-enhanced">
        <!-- Quick Rolls -->
        <div class="quick-rolls-section">
          <h4>Quick Rolls</h4>
          <div class="dice-grid">
            <holo-button data-roll="1d10" size="small">D10</holo-button>
            <holo-button data-roll="2d6" size="small">2D6</holo-button>
            <holo-button data-roll="1d10!" variant="accent" size="small">D10!</holo-button>
            <holo-button data-roll="1d100" size="small">D100</holo-button>
            <holo-button data-roll="3d6" size="small">3D6</holo-button>
            <holo-button data-roll="2d10!" variant="accent" size="small">2D10!</holo-button>
          </div>
        </div>
        
        <!-- Skill Check -->
        <div class="skill-check-section">
          <h4>Skill Check</h4>
          <div class="skill-inputs">
            <neon-input 
              type="number" 
              id="skill-value" 
              placeholder="0" 
              label="Skill"
              helper-text="Your skill level (0-10)"
              min="0" 
              max="10"
              variant="primary"
            ></neon-input>
            
            <neon-input 
              type="number" 
              id="stat-value" 
              placeholder="0" 
              label="STAT"
              helper-text="Associated stat (1-10)"
              min="1" 
              max="10"
              variant="primary"
            ></neon-input>
            
            <neon-input 
              type="number" 
              id="difficulty-value" 
              placeholder="15" 
              label="Difficulty"
              helper-text="Target DV (9-30)"
              min="9" 
              max="30"
              variant="accent"
            ></neon-input>
          </div>
          
          <div class="modifiers-section">
            <label class="modifier-label">Modifiers:</label>
            <div class="modifier-buttons">
              <button class="modifier-btn" data-mod="-4">-4</button>
              <button class="modifier-btn" data-mod="-2">-2</button>
              <button class="modifier-btn" data-mod="-1">-1</button>
              <button class="modifier-btn selected" data-mod="0">0</button>
              <button class="modifier-btn" data-mod="+1">+1</button>
              <button class="modifier-btn" data-mod="+2">+2</button>
              <button class="modifier-btn" data-mod="+4">+4</button>
            </div>
          </div>
          
          <holo-button id="roll-skill-check" variant="primary">Roll Skill Check</holo-button>
        </div>
        
        <!-- Special Rolls -->
        <div class="special-rolls-section">
          <h4>Special Rolls</h4>
          <div class="special-buttons">
            <holo-button id="roll-initiative" variant="secondary" size="small">Initiative</holo-button>
            <holo-button id="roll-critical-injury" variant="danger" size="small">Critical Injury</holo-button>
            <holo-button id="roll-death-save" variant="danger" size="small">Death Save</holo-button>
            <holo-button id="roll-humanity" variant="warning" size="small">Humanity</holo-button>
          </div>
        </div>
        
        <!-- Result Display -->
        <div class="result-display">
          <div class="result-animation" id="dice-animation"></div>
          <div class="result-total" id="result-total">Ready to roll!</div>
          <div class="result-details" id="result-details"></div>
        </div>
        
        <!-- Macros -->
        <div class="macros-section">
          <h4>Macros</h4>
          <div class="macro-list" id="macro-list"></div>
          <holo-button id="create-macro" variant="secondary" size="small">+ New Macro</holo-button>
        </div>
        
        <!-- History -->
        <div class="history-section">
          <div class="history-header">
            <h4>Roll History</h4>
            <button class="clear-history-btn" id="clear-history" title="Clear History">×</button>
          </div>
          <div class="history-list" id="history-list"></div>
        </div>
      </div>
      
      <style>
        .dice-roller-enhanced {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
        }
        
        .dice-roller-enhanced h4 {
          margin: 0 0 10px 0;
          color: var(--primary);
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 14px;
        }
        
        .dice-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        
        .skill-inputs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .modifiers-section {
          margin-bottom: 15px;
        }
        
        .modifier-label {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
        }
        
        .modifier-buttons {
          display: flex;
          gap: 8px;
        }
        
        .modifier-btn {
          flex: 1;
          padding: 6px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-secondary);
          font-size: 12px;
        }
        
        .modifier-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        
        .modifier-btn.selected {
          background: var(--primary);
          color: var(--bg-primary);
          border-color: var(--primary);
        }
        
        .special-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        
        .result-display {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
          min-height: 120px;
        }
        
        .result-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 60px;
          opacity: 0;
          color: var(--primary);
          text-shadow: 0 0 20px var(--primary);
          pointer-events: none;
          z-index: 10;
        }
        
        .result-animation.rolling {
          animation: diceRoll 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes diceRoll {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
          }
          40% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
          }
          60% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(270deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8) rotate(360deg);
          }
        }
        
        .result-total {
          font-size: 36px;
          font-weight: bold;
          margin: 10px 0;
          color: var(--primary);
          text-shadow: 0 0 10px var(--primary);
          font-family: var(--font-display);
          transition: all 0.3s ease;
          position: relative;
          z-index: 5;
        }
        
        .result-details {
          font-size: 14px;
          color: var(--text-secondary);
          min-height: 20px;
          position: relative;
          z-index: 5;
        }
        
        .result-display.critical .result-total {
          color: var(--accent);
          text-shadow: 0 0 20px var(--accent);
          animation: criticalPulse 1s ease-in-out;
        }
        
        .result-display.fumble .result-total {
          color: var(--danger);
          text-shadow: 0 0 20px var(--danger);
          animation: fumbleShake 0.5s;
        }
        
        .result-display.success .result-total {
          color: var(--success);
          text-shadow: 0 0 15px var(--success);
        }
        
        .result-display.failure .result-total {
          color: var(--danger);
          text-shadow: 0 0 15px var(--danger);
        }
        
        @keyframes criticalPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes fumbleShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .macro-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
          min-height: 30px;
        }
        
        .macro-btn {
          padding: 6px 12px;
          background: var(--bg-surface);
          border: 1px solid var(--primary);
          color: var(--primary);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          position: relative;
        }
        
        .macro-btn:hover {
          background: var(--primary);
          color: var(--bg-primary);
        }
        
        .macro-delete {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 16px;
          height: 16px;
          background: var(--danger);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 10px;
          cursor: pointer;
          display: none;
        }
        
        .macro-btn:hover .macro-delete {
          display: block;
        }
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .clear-history-btn {
          width: 24px;
          height: 24px;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 2px;
          font-size: 16px;
          transition: all 0.2s;
        }
        
        .clear-history-btn:hover {
          border-color: var(--danger);
          color: var(--danger);
          background: rgba(255, 0, 0, 0.1);
        }
        
        .history-list {
          max-height: 150px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .history-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .history-list::-webkit-scrollbar-track {
          background: var(--bg-surface);
        }
        
        .history-list::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
        
        .history-list::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
        
        .history-item {
          padding: 8px;
          background: var(--bg-surface);
          border-left: 3px solid var(--border-color);
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
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
        
        .history-item:hover {
          background: rgba(0, 255, 255, 0.05);
        }
        
        .history-item.success {
          border-left-color: var(--success);
        }
        
        .history-item.failure {
          border-left-color: var(--danger);
        }
        
        .history-item.critical {
          border-left-color: var(--accent);
          background: rgba(255, 0, 255, 0.05);
        }
        
        .history-time {
          color: var(--text-secondary);
          font-size: 10px;
        }
        
        /* Disabled state while rolling */
        .dice-roller-enhanced.rolling holo-button,
        .dice-roller-enhanced.rolling .modifier-btn,
        .dice-roller-enhanced.rolling .macro-btn {
          pointer-events: none;
          opacity: 0.5;
        }
      </style>
    `;
    
    this.renderMacros();
  }
  
  attachEventListeners() {
    // Quick rolls
    this.container.querySelectorAll('[data-roll]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.isRolling) {
          const formula = btn.dataset.roll;
          this.rollFormula(formula);
        }
      });
    });
    
    // Skill check
    const skillCheckBtn = this.container.querySelector('#roll-skill-check');
    skillCheckBtn.addEventListener('click', () => {
      if (!this.isRolling) this.rollSkillCheck();
    });
    
    // Modifiers
    this.container.querySelectorAll('.modifier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.modifier-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
    
    // Special rolls
    this.container.querySelector('#roll-initiative').addEventListener('click', () => {
      if (!this.isRolling) this.rollInitiative();
    });
    this.container.querySelector('#roll-critical-injury').addEventListener('click', () => {
      if (!this.isRolling) this.rollCriticalInjury();
    });
    this.container.querySelector('#roll-death-save').addEventListener('click', () => {
      if (!this.isRolling) this.rollDeathSave();
    });
    this.container.querySelector('#roll-humanity').addEventListener('click', () => {
      if (!this.isRolling) this.rollHumanity();
    });
    
    // Macros
    this.container.querySelector('#create-macro').addEventListener('click', () => this.createMacro());
    
    // Clear history
    this.container.querySelector('#clear-history').addEventListener('click', () => this.clearHistory());
  }
  
  // Dice rolling methods
  rollD10() {
    return Math.floor(Math.random() * 10) + 1;
  }
  
  rollDice(sides, count = 1) {
    const rolls = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    return rolls;
  }
  
  rollExploding(count = 1) {
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      let roll = this.rollD10();
      rolls.push(roll);
      total += roll;
      
      // Keep rolling on 10s
      while (roll === 10) {
        roll = this.rollD10();
        rolls.push(roll);
        total += roll;
      }
    }
    
    return {
      rolls,
      total,
      exploded: rolls.length > count,
      critical: rolls[0] === 10,
      fumble: rolls[0] === 1 && count === 1
    };
  }
  
  async rollFormula(formula) {
    if (this.isRolling) return;
    this.isRolling = true;
    this.container.classList.add('rolling');
    
    let result;
    let details = '';
    let type = '';
    
    try {
      if (formula.includes('!')) {
        // Exploding dice
        const count = parseInt(formula) || 1;
        result = this.rollExploding(count);
        details = `${result.rolls.join(' + ')} = ${result.total}`;
        
        if (result.critical) {
          details += ' <strong>(CRITICAL!)</strong>';
          type = 'critical';
        }
        if (result.fumble) {
          details += ' <strong>(FUMBLE!)</strong>';
          type = 'fumble';
        }
        
        await this.displayResult(result.total, details, type);
      } else if (formula.includes('d')) {
        // Regular dice
        const [count, sides] = formula.split('d').map(n => parseInt(n) || 1);
        const rolls = this.rollDice(sides, count);
        const total = rolls.reduce((sum, roll) => sum + roll, 0);
        details = rolls.join(' + ') + ' = ' + total;
        
        await this.displayResult(total, details);
      }
      
      this.addToHistory(`${formula}: ${result?.total || 'Error'}`, type);
    } finally {
      this.isRolling = false;
      this.container.classList.remove('rolling');
    }
  }
  
  async rollSkillCheck() {
    if (this.isRolling) return;
    this.isRolling = true;
    this.container.classList.add('rolling');
    
    try {
      const skillInput = this.container.querySelector('#skill-value');
      const statInput = this.container.querySelector('#stat-value');
      const difficultyInput = this.container.querySelector('#difficulty-value');
      
      const skill = parseInt(skillInput.value) || 0;
      const stat = parseInt(statInput.value) || 0;
      const difficulty = parseInt(difficultyInput.value) || 15;
      const modifier = parseInt(this.container.querySelector('.modifier-btn.selected').dataset.mod) || 0;
      
      const roll = this.rollExploding();
      const total = roll.total + skill + stat + modifier;
      const success = total >= difficulty;
      
      let details = `Roll: ${roll.rolls.join('+')} = ${roll.total}<br>`;
      details += `Skill: ${skill} + STAT: ${stat}`;
      if (modifier !== 0) details += ` + Mod: ${modifier > 0 ? '+' : ''}${modifier}`;
      details += `<br>Total: ${total} vs DV ${difficulty}`;
      details += `<br><strong>${success ? 'SUCCESS' : 'FAILURE'}</strong>`;
      
      if (roll.critical && success) details += ' <strong>(CRITICAL SUCCESS!)</strong>';
      if (roll.fumble) details += ' <strong>(FUMBLE!)</strong>';
      
      let type = 'normal';
      if (roll.critical && success) type = 'critical';
      else if (!success) type = 'failure';
      else if (success) type = 'success';
      
      await this.displayResult(total, details, type);
      
      this.addToHistory(
        `Skill Check: ${total} vs ${difficulty} - ${success ? 'Success' : 'Failure'}`,
        success ? 'success' : 'failure'
      );
    } finally {
      this.isRolling = false;
      this.container.classList.remove('rolling');
    }
  }
  
  async rollInitiative() {
    if (this.isRolling) return;
    
    const refStat = prompt('Enter REF stat (1-10):', '5');
    if (!refStat) return;
    
    this.isRolling = true;
    this.container.classList.add('rolling');
    
    try {
      const ref = parseInt(refStat) || 5;
      const roll = this.rollD10();
      const total = roll + ref;
      
      const details = `1d10: ${roll} + REF: ${ref} = ${total}`;
      await this.displayResult(total, details);
      this.addToHistory(`Initiative: ${total}`);
    } finally {
      this.isRolling = false;
      this.container.classList.remove('rolling');
    }
  }
  
  async rollCriticalInjury() {
    if (this.isRolling) return;
    
    const bonus = parseInt(prompt('Bonus to critical injury roll (0-5):', '0')) || 0;
    
    this.isRolling = true;
    this.container.classList.add('rolling');
    
    try {
      const roll = this.rollD10() + bonus;
      const injury = this.criticalInjuries[Math.min(roll, 12)] || this.criticalInjuries[12];
      
      let details = `Roll: ${roll}<br><strong>${injury.location}</strong>: ${injury.effect}`;
      if (injury.mortalWound) details += '<br><strong style="color: var(--danger)">MORTAL WOUND!</strong>';
      
      await this.displayResult(roll, details, injury.mortalWound ? 'fumble' : '');
      this.addToHistory(`Critical Injury: ${injury.location} - ${injury.effect}`, 'failure');
    } finally {
      this.isRolling = false;
      this.container.classList.remove('rolling');
    }
  }
  
  async rollDeathSave() {
    if (this.isRolling) return;
    
    const bodyStat = prompt('Enter BODY stat (1-10):', '5');
    const previousSaves = prompt('Number of previous death saves:', '0');
    
    if (!bodyStat) return;
    
    this.isRolling = true;
    this.container.classList.add('rolling');
    
    try {
      const body = parseInt(bodyStat) || 5;
      const penalty = parseInt(previousSaves) || 0;
      const roll = this.rollD10();
      const total = roll + body;
      const target = 10 + penalty;
      const success = total >= target;
      
      const details = `1d10: ${roll} + BODY: ${body} = ${total}<br>Target: ${target}<br><strong>${success ? 'STABILIZED!' : 'DYING...'}</strong>`;
      
      await this.displayResult(total, details, success ? 'success' : 'fumble');
      this.addToHistory(`Death Save: ${total} vs ${target} - ${success ? 'Stabilized' : 'Dying'}`, success ? 'success' : 'failure');
    } finally {
      this.isRolling = false;
      this.container.classList.remove('rolling');
    }
  }
  
  async rollHumanity() {
    if (this.isRolling) return;
    
    const currentHumanity = prompt('Current Humanity:', '40');
    const humanityLoss = prompt('Humanity Loss:', '2d6');
    
    if (!currentHumanity || !humanityLoss) return;
    
    this.isRolling = true;
    this.container.classList.add('rolling');
    
    try {
      let loss = 0;
      if (humanityLoss.includes('d')) {
        const [count, sides] = humanityLoss.split('d').map(n => parseInt(n) || 1);
        const rolls = this.rollDice(sides, count);
        loss = rolls.reduce((sum, roll) => sum + roll, 0);
      } else {
        loss = parseInt(humanityLoss) || 0;
      }
      
      const newHumanity = parseInt(currentHumanity) - loss;
      let details = `Current: ${currentHumanity}<br>Loss: ${loss}<br>New Humanity: ${newHumanity}`;
      
      if (newHumanity <= 0) {
        details += '<br><strong style="color: var(--danger)">CYBERPSYCHOSIS!</strong>';
      }
      
      await this.displayResult(newHumanity, details, newHumanity <= 0 ? 'fumble' : newHumanity <= 10 ? 'failure' : '');
      this.addToHistory(`Humanity: ${currentHumanity} - ${loss} = ${newHumanity}`, newHumanity <= 0 ? 'failure' : '');
    } finally {
      this.isRolling = false;
      this.container.classList.remove('rolling');
    }
  }
  
  async displayResult(total, details, type = '') {
    const animation = this.container.querySelector('#dice-animation');
    const totalElement = this.container.querySelector('#result-total');
    const detailsElement = this.container.querySelector('#result-details');
    const displayElement = this.container.querySelector('.result-display');
    
    // Reset classes
    displayElement.classList.remove('critical', 'fumble', 'success', 'failure');
    animation.classList.remove('rolling');
    
    // Start animation
    animation.textContent = '⚅';
    void animation.offsetWidth; // Force reflow
    animation.classList.add('rolling');
    
    // Wait for animation to peak
    await new Promise(resolve => setTimeout(resolve, 320));
    
    // Update result at animation peak
    totalElement.textContent = total;
    detailsElement.innerHTML = details;
    
    // Add type class
    if (type) {
      displayElement.classList.add(type);
    }
    
    // Play sound effect
    this.playRollSound(type);
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 480));
  }
  
  playRollSound(type = '') {
    // Use the global soundManager if available
    if (window.soundManager) {
      if (type === 'critical') {
        window.soundManager.play('criticalHit');
      } else if (type === 'fumble') {
        window.soundManager.play('criticalFail');
      } else {
        window.soundManager.play('diceRoll');
      }
    }
  }
  
  // Macro system
  createMacro() {
    const name = prompt('Macro name:');
    const formula = prompt('Roll formula (e.g., 1d10+5, 2d6, 1d10!):');
    
    if (name && formula) {
      const macro = { name, formula, id: Date.now() };
      this.macros.push(macro);
      this.saveMacros();
      this.renderMacros();
    }
  }
  
  renderMacros() {
    const macroList = this.container.querySelector('#macro-list');
    if (!macroList) return;
    
    macroList.innerHTML = '';
    
    this.macros.forEach((macro, index) => {
      const btn = document.createElement('button');
      btn.className = 'macro-btn';
      btn.textContent = macro.name;
      btn.addEventListener('click', () => {
        if (!this.isRolling) this.runMacro(macro);
      });
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'macro-delete';
      deleteBtn.textContent = '×';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteMacro(index);
      });
      
      btn.appendChild(deleteBtn);
      macroList.appendChild(btn);
    });
  }
  
  runMacro(macro) {
    this.rollFormula(macro.formula);
  }
  
  deleteMacro(index) {
    if (confirm(`Delete macro "${this.macros[index].name}"?`)) {
      this.macros.splice(index, 1);
      this.saveMacros();
      this.renderMacros();
    }
  }
  
  saveMacros() {
    localStorage.setItem('cyberpunk-dice-macros', JSON.stringify(this.macros));
  }
  
  loadMacros() {
    try {
      const saved = localStorage.getItem('cyberpunk-dice-macros');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load macros:', e);
      return [];
    }
  }
  
  // History
  addToHistory(entry, type = '') {
    const historyItem = {
      text: entry,
      type: type,
      time: new Date().toLocaleTimeString(),
      id: Date.now()
    };
    
    this.history.unshift(historyItem);
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }
    
    this.saveHistory();
    this.renderHistory();
  }
  
  renderHistory() {
    const historyList = this.container.querySelector('#history-list');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    this.history.slice(0, 10).forEach(item => {
      const div = document.createElement('div');
      div.className = `history-item ${item.type}`;
      div.innerHTML = `
        <span>${item.text}</span>
        <span class="history-time">${item.time}</span>
      `;
      historyList.appendChild(div);
    });
  }
  
  saveHistory() {
    try {
      localStorage.setItem('cyberpunk-dice-history', JSON.stringify(this.history));
    } catch (e) {
      console.error('Failed to save history:', e);
      // If storage is full, clear old entries
      if (this.history.length > 20) {
        this.history = this.history.slice(0, 20);
        try {
          localStorage.setItem('cyberpunk-dice-history', JSON.stringify(this.history));
        } catch (e2) {
          console.error('Still failed to save history:', e2);
        }
      }
    }
  }
  
  loadHistory() {
    try {
      const saved = localStorage.getItem('cyberpunk-dice-history');
      this.history = saved ? JSON.parse(saved) : [];
      // Ensure history is an array
      if (!Array.isArray(this.history)) {
        this.history = [];
      }
      this.renderHistory();
    } catch (e) {
      console.error('Failed to load history:', e);
      this.history = [];
      localStorage.removeItem('cyberpunk-dice-history');
    }
  }
  
  clearHistory() {
    if (confirm('Clear all roll history?')) {
      this.history = [];
      this.saveHistory();
      this.renderHistory();
    }
  }
  
  // Critical injury table
  getCriticalInjuryTable() {
    return {
      2: { location: 'Head', effect: 'Lost Eye', mortalWound: false },
      3: { location: 'Head', effect: 'Brain Injury', mortalWound: true },
      4: { location: 'Head', effect: 'Damaged Eye', mortalWound: false },
      5: { location: 'Head', effect: 'Concussion', mortalWound: false },
      6: { location: 'Head', effect: 'Torn Ear', mortalWound: false },
      7: { location: 'Arm', effect: 'Dismembered Arm', mortalWound: true },
      8: { location: 'Arm', effect: 'Dismembered Hand', mortalWound: false },
      9: { location: 'Arm', effect: 'Broken Arm', mortalWound: false },
      10: { location: 'Body', effect: 'Broken Ribs', mortalWound: false },
      11: { location: 'Body', effect: 'Damaged Internal Organ', mortalWound: true },
      12: { location: 'Leg', effect: 'Dismembered Leg', mortalWound: true }
    };
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CyberpunkDiceRoller;
}