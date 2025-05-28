/**
 * Compact Cybernetic Dice Roller
 * Redesigned for space efficiency and cybernetic aesthetics
 */

class CompactDiceRoller {
  constructor(container) {
    this.container = container;
    this.history = [];
    this.macros = this.loadMacros();
    this.currentModifier = 0;
    this.isRolling = false;
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
    this.loadHistory();
  }
  
  render() {
    this.container.innerHTML = `
      <style>
        .compact-dice-roller {
          background: var(--bg-surface);
          border: 2px solid var(--primary);
          border-radius: 8px;
          padding: 15px;
          font-family: var(--font-mono);
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
        }
        
        /* Removed overlay - was blocking content visibility */
        
        .compact-dice-roller > * {
          position: relative;
          z-index: 1;
        }
        
        .dice-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: bold;
          color: var(--primary);
        }
        
        .dice-header::before {
          content: '◉';
          font-size: 12px;
          color: var(--accent);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .dice-quick-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          margin-bottom: 10px;
        }
        
        .quick-dice-btn {
          background: #2a2a2a;
          background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
          border: 2px solid #0ff;
          color: #0ff;
          padding: 10px 6px;
          font-size: 13px;
          font-weight: bold;
          font-family: var(--font-mono);
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.5),
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
          transform: translateY(0);
        }
        
        .quick-dice-btn::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -100%;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
          transition: left 0.3s;
        }
        
        .quick-dice-btn:hover {
          background: #0ff;
          color: #000;
          border-color: #0ff;
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.8),
            0 4px 8px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          text-shadow: none;
        }
        
        .quick-dice-btn:hover::before {
          left: 100%;
        }
        
        .quick-dice-btn:active {
          transform: translateY(1px);
          box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.3),
            inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .quick-dice-btn.exploding {
          background: linear-gradient(180deg, #3a2a3a 0%, #2a1a2a 100%);
          color: #ff0080;
          border-color: #ff0080;
          text-shadow: 0 0 5px rgba(255, 0, 128, 0.8);
        }
        
        .quick-dice-btn.exploding:hover {
          background: #ff0080;
          color: #000;
          box-shadow: 
            0 0 20px rgba(255, 0, 128, 0.8),
            0 4px 8px rgba(0, 0, 0, 0.5);
        }
        
        .skill-check-compact {
          background: #1a1a1a;
          border: 2px solid #0ff;
          border-radius: 6px;
          padding: 10px;
          margin-bottom: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        }
        
        .skill-inputs-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
          margin-bottom: 8px;
        }
        
        .mini-input {
          background: #2a2a2a;
          border: 1px solid #0ff;
          color: #0ff;
          padding: 6px 8px;
          font-size: 12px;
          font-family: var(--font-mono);
          text-align: center;
          border-radius: 3px;
          transition: all 0.3s;
          font-weight: bold;
        }
        
        .mini-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 6px var(--primary-glow);
        }
        
        .input-label {
          font-size: 9px;
          color: var(--text-tertiary);
          text-transform: uppercase;
          margin-bottom: 2px;
          text-align: center;
        }
        
        .modifier-strip {
          display: flex;
          gap: 2px;
          margin-bottom: 8px;
          justify-content: center;
        }
        
        .mod-btn {
          background: linear-gradient(180deg, 
            rgba(255, 255, 255, 0.05) 0%, 
            var(--bg-tertiary) 20%, 
            var(--bg-quaternary) 100%);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 4px 6px;
          font-size: 9px;
          font-weight: bold;
          font-family: var(--font-mono);
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 2px;
          min-width: 26px;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }
        
        .mod-btn.active {
          background: linear-gradient(180deg, 
            var(--primary) 0%, 
            var(--primary-dim) 100%);
          color: var(--bg-primary);
          border-color: var(--primary);
          box-shadow: 
            0 0 8px var(--primary-glow),
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transform: translateY(1px);
        }
        
        .mod-btn:hover:not(.active) {
          background: linear-gradient(180deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            var(--bg-hover) 20%, 
            var(--bg-tertiary) 100%);
          border-color: var(--primary-dim);
          transform: translateY(-1px);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .mod-btn:active:not(.active) {
          transform: translateY(0);
          box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.2),
            inset 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .roll-action-btn {
          width: 100%;
          background: linear-gradient(180deg, 
            var(--primary) 0%, 
            var(--primary-dim) 50%,
            var(--primary-dim) 50%,
            rgba(0, 0, 0, 0.2) 100%);
          border: 1px solid var(--primary);
          color: var(--bg-primary);
          padding: 10px;
          font-size: 12px;
          font-family: var(--font-mono);
          font-weight: bold;
          cursor: pointer;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 
            0 3px 6px rgba(0, 0, 0, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          transform: translateY(0);
        }
        
        .roll-action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .roll-action-btn:hover {
          background: linear-gradient(180deg, 
            rgba(255, 255, 255, 0.1) 0%,
            var(--primary) 10%, 
            var(--primary-dim) 50%,
            var(--primary-dim) 50%,
            rgba(0, 0, 0, 0.3) 100%);
          box-shadow: 
            0 4px 8px rgba(0, 255, 255, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
          transform: translateY(-1px);
        }
        
        .roll-action-btn:hover::before {
          left: 100%;
        }
        
        .roll-action-btn:active {
          transform: translateY(2px);
          box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.3),
            inset 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .roll-action-btn.rolling {
          animation: rolling 1s infinite;
        }
        
        @keyframes rolling {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .result-display {
          background: #000;
          border: 2px solid #00ff41;
          border-radius: 6px;
          padding: 10px;
          margin-top: 10px;
          text-align: center;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 
            0 0 10px rgba(0, 255, 65, 0.5),
            inset 0 0 10px rgba(0, 255, 65, 0.1);
        }
        
        /* Removed overlay pattern for better visibility */
        
        .result-content {
          position: relative;
          z-index: 1;
        }
        
        .result-main {
          font-size: 16px;
          font-weight: bold;
          color: var(--primary);
          margin-bottom: 4px;
        }
        
        .result-detail {
          font-size: 10px;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
        }
        
        .result-success {
          color: var(--success);
        }
        
        .result-failure {
          color: var(--error);
        }
        
        .result-critical {
          color: var(--accent);
          animation: glow 1s infinite alternate;
        }
        
        @keyframes glow {
          from { text-shadow: 0 0 5px currentColor; }
          to { text-shadow: 0 0 15px currentColor; }
        }
        
        .history-compact {
          margin-top: 8px;
          max-height: 60px;
          overflow-y: auto;
        }
        
        .history-item {
          font-size: 9px;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          padding: 2px 4px;
          border-bottom: 1px solid rgba(0, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
        }
        
        .history-item:last-child {
          border-bottom: none;
        }
        
        .special-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          margin-top: 8px;
        }
        
        .special-btn {
          background: linear-gradient(180deg, 
            rgba(255, 255, 255, 0.05) 0%, 
            var(--bg-tertiary) 20%, 
            var(--bg-quaternary) 100%);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 6px 8px;
          font-size: 10px;
          font-weight: bold;
          font-family: var(--font-mono);
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.3s;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          transform: translateY(0);
        }
        
        .special-btn:hover {
          background: linear-gradient(180deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            var(--accent-dim) 20%, 
            var(--accent) 100%);
          color: var(--bg-primary);
          border-color: var(--accent);
          box-shadow: 
            0 2px 4px rgba(0, 255, 65, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        
        .special-btn:active {
          transform: translateY(1px);
          box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.2),
            inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .circuit-accent {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 4px;
          right: 4px;
          background: radial-gradient(circle, var(--primary) 30%, transparent 31%),
                      linear-gradient(0deg, transparent 40%, var(--primary) 41%, var(--primary) 59%, transparent 60%),
                      linear-gradient(90deg, transparent 40%, var(--primary) 41%, var(--primary) 59%, transparent 60%);
          background-size: 4px 4px, 8px 8px, 8px 8px;
          opacity: 0.3;
          animation: circuit-flow 3s infinite;
        }
        
        @keyframes circuit-flow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
      </style>
      
      <div class="compact-dice-roller">
        <div class="circuit-accent"></div>
        
        <div class="dice-header">
          <span>DICE.SYS</span>
          <span style="margin-left: auto; font-size: 10px; color: var(--text-tertiary);">v2.1</span>
        </div>
        
        <!-- Quick Dice Grid -->
        <div class="dice-quick-grid">
          <button class="quick-dice-btn" data-roll="1d10">D10</button>
          <button class="quick-dice-btn" data-roll="1d6">D6</button>
          <button class="quick-dice-btn exploding" data-roll="1d10!">D10!</button>
          <button class="quick-dice-btn" data-roll="1d100">D100</button>
          <button class="quick-dice-btn" data-roll="2d6">2D6</button>
          <button class="quick-dice-btn" data-roll="3d6">3D6</button>
          <button class="quick-dice-btn exploding" data-roll="2d10!">2D10!</button>
          <button class="quick-dice-btn" data-roll="1d20">D20</button>
        </div>
        
        <!-- Skill Check Section -->
        <div class="skill-check-compact">
          <div class="skill-inputs-row">
            <div>
              <div class="input-label">SKILL</div>
              <input type="number" class="mini-input" id="skill-val" min="0" max="10" value="0">
            </div>
            <div>
              <div class="input-label">STAT</div>
              <input type="number" class="mini-input" id="stat-val" min="1" max="10" value="8">
            </div>
            <div>
              <div class="input-label">DV</div>
              <input type="number" class="mini-input" id="dv-val" min="6" max="30" value="15">
            </div>
          </div>
          
          <div class="modifier-strip">
            <button class="mod-btn" data-mod="-4">-4</button>
            <button class="mod-btn" data-mod="-2">-2</button>
            <button class="mod-btn" data-mod="-1">-1</button>
            <button class="mod-btn active" data-mod="0">±0</button>
            <button class="mod-btn" data-mod="+1">+1</button>
            <button class="mod-btn" data-mod="+2">+2</button>
            <button class="mod-btn" data-mod="+4">+4</button>
          </div>
          
          <button class="roll-action-btn" id="skill-check-btn">EXECUTE SKILL CHECK</button>
        </div>
        
        <!-- Special Actions -->
        <div class="special-actions">
          <button class="special-btn" id="initiative-btn">INIT</button>
          <button class="special-btn" id="critical-btn">CRIT</button>
          <button class="special-btn" id="death-save-btn">DEATH</button>
          <button class="special-btn" id="humanity-btn">HUM</button>
        </div>
        
        <!-- Result Display -->
        <div class="result-display" id="result-display">
          <div class="result-content">
            <div class="result-main">READY</div>
            <div class="result-detail">Select dice or skill check</div>
          </div>
        </div>
        
        <!-- History -->
        <div class="history-compact" id="roll-history"></div>
      </div>
    `;
  }
  
  attachEventListeners() {
    // Quick dice buttons
    this.container.querySelectorAll('.quick-dice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rollExpression = e.target.dataset.roll;
        this.rollDice(rollExpression);
      });
    });
    
    // Modifier buttons
    this.container.querySelectorAll('.mod-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.mod-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentModifier = parseInt(e.target.dataset.mod);
      });
    });
    
    // Skill check button
    this.container.querySelector('#skill-check-btn').addEventListener('click', () => {
      this.rollSkillCheck();
    });
    
    // Special action buttons
    this.container.querySelector('#initiative-btn').addEventListener('click', () => {
      this.rollSpecial('initiative');
    });
    
    this.container.querySelector('#critical-btn').addEventListener('click', () => {
      this.rollSpecial('critical');
    });
    
    this.container.querySelector('#death-save-btn').addEventListener('click', () => {
      this.rollSpecial('death-save');
    });
    
    this.container.querySelector('#humanity-btn').addEventListener('click', () => {
      this.rollSpecial('humanity');
    });
  }
  
  rollDice(expression) {
    if (this.isRolling) return;
    
    this.isRolling = true;
    const btn = this.container.querySelector(`[data-roll="${expression}"]`);
    const resultDisplay = this.container.querySelector('#result-display');
    
    // Show rolling animation
    if (btn) btn.classList.add('rolling');
    this.showResult('ROLLING...', 'Processing dice...', 'processing');
    
    // Play sound effect
    if (window.soundSystem) {
      window.soundSystem.play('dice-roll');
    }
    
    setTimeout(() => {
      const result = this.parseDiceExpression(expression);
      this.showResult(result.total, result.breakdown, result.type);
      this.addToHistory(expression, result);
      
      if (btn) btn.classList.remove('rolling');
      this.isRolling = false;
    }, 1000);
  }
  
  rollSkillCheck() {
    if (this.isRolling) return;
    
    this.isRolling = true;
    const skillBtn = this.container.querySelector('#skill-check-btn');
    
    skillBtn.classList.add('rolling');
    this.showResult('COMPUTING...', 'Skill check processing...', 'processing');
    
    if (window.soundSystem) {
      window.soundSystem.play('dice-roll');
    }
    
    setTimeout(() => {
      const skill = parseInt(this.container.querySelector('#skill-val').value) || 0;
      const stat = parseInt(this.container.querySelector('#stat-val').value) || 8;
      const dv = parseInt(this.container.querySelector('#dv-val').value) || 15;
      
      const roll = Math.floor(Math.random() * 10) + 1;
      const total = roll + skill + stat + this.currentModifier;
      
      let resultType = 'failure';
      let resultText = 'FAILURE';
      
      if (roll === 10) {
        resultType = 'critical';
        resultText = 'CRITICAL SUCCESS';
      } else if (total >= dv) {
        resultType = 'success';
        resultText = 'SUCCESS';
      } else if (roll === 1) {
        resultType = 'critical';
        resultText = 'CRITICAL FAILURE';
      }
      
      const breakdown = `${roll} + ${skill} + ${stat} ${this.currentModifier >= 0 ? '+' : ''}${this.currentModifier} = ${total} vs DV${dv}`;
      
      this.showResult(resultText, breakdown, resultType);
      this.addToHistory(`Skill Check (DV${dv})`, { total, breakdown, type: resultType });
      
      skillBtn.classList.remove('rolling');
      this.isRolling = false;
    }, 1200);
  }
  
  rollSpecial(type) {
    if (this.isRolling) return;
    
    this.isRolling = true;
    this.showResult('PROCESSING...', 'Special roll...', 'processing');
    
    if (window.soundSystem) {
      window.soundSystem.play('dice-roll');
    }
    
    setTimeout(() => {
      let result;
      
      switch (type) {
        case 'initiative':
          const initRoll = Math.floor(Math.random() * 10) + 1;
          result = {
            total: `INIT: ${initRoll}`,
            breakdown: `D10 = ${initRoll}`,
            type: 'success'
          };
          break;
          
        case 'critical':
          const critRoll = Math.floor(Math.random() * 10) + 1;
          const critResult = this.getCriticalInjury(critRoll);
          result = {
            total: `CRIT: ${critRoll}`,
            breakdown: critResult,
            type: 'critical'
          };
          break;
          
        case 'death-save':
          const deathRoll = Math.floor(Math.random() * 10) + 1;
          const deathResult = deathRoll >= 6 ? 'STABILIZED' : 'DYING';
          result = {
            total: deathResult,
            breakdown: `D10 = ${deathRoll} (need 6+)`,
            type: deathRoll >= 6 ? 'success' : 'failure'
          };
          break;
          
        case 'humanity':
          const humRoll = Math.floor(Math.random() * 10) + 1;
          result = {
            total: `HUM: ${humRoll}`,
            breakdown: `D10 = ${humRoll}`,
            type: humRoll <= 3 ? 'failure' : 'success'
          };
          break;
      }
      
      this.showResult(result.total, result.breakdown, result.type);
      this.addToHistory(type.toUpperCase(), result);
      this.isRolling = false;
    }, 1000);
  }
  
  parseDiceExpression(expression) {
    const match = expression.match(/(\d+)d(\d+)(!?)/);
    if (!match) return { total: 0, breakdown: 'Invalid', type: 'failure' };
    
    const [, numDice, dieSize, exploding] = match;
    const dice = parseInt(numDice);
    const size = parseInt(dieSize);
    const isExploding = exploding === '!';
    
    let rolls = [];
    let total = 0;
    
    for (let i = 0; i < dice; i++) {
      let roll = Math.floor(Math.random() * size) + 1;
      let rollTotal = roll;
      
      // Handle exploding dice
      if (isExploding && roll === size) {
        const explosions = [roll];
        while (roll === size) {
          roll = Math.floor(Math.random() * size) + 1;
          explosions.push(roll);
          rollTotal += roll;
        }
        rolls.push(`(${explosions.join('+')})=${rollTotal}`);
      } else {
        rolls.push(roll.toString());
      }
      
      total += rollTotal;
    }
    
    return {
      total,
      breakdown: `${expression}: [${rolls.join(', ')}] = ${total}`,
      type: isExploding && rolls.some(r => r.includes('+')) ? 'critical' : 'success'
    };
  }
  
  showResult(main, detail, type) {
    const resultDisplay = this.container.querySelector('#result-display');
    const typeClass = type === 'critical' ? 'result-critical' : 
                     type === 'success' ? 'result-success' : 
                     type === 'failure' ? 'result-failure' : '';
    
    resultDisplay.innerHTML = `
      <div class="result-content">
        <div class="result-main ${typeClass}">${main}</div>
        <div class="result-detail">${detail}</div>
      </div>
    `;
  }
  
  addToHistory(roll, result) {
    const historyItem = {
      timestamp: Date.now(),
      roll,
      result: result.total,
      breakdown: result.breakdown
    };
    
    this.history.unshift(historyItem);
    if (this.history.length > 10) this.history.pop();
    
    this.updateHistoryDisplay();
    this.saveHistory();
  }
  
  updateHistoryDisplay() {
    const historyContainer = this.container.querySelector('#roll-history');
    historyContainer.innerHTML = this.history.slice(0, 5).map(item => {
      const time = new Date(item.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return `
        <div class="history-item">
          <span>${item.roll}</span>
          <span>${item.result}</span>
        </div>
      `;
    }).join('');
  }
  
  getCriticalInjury(roll) {
    const injuries = [
      'Foreign Object', 'Broken Ribs', 'Broken Arm', 'Broken Leg',
      'Collapsed Lung', 'Spinal Injury', 'Crushed Fingers', 'Torn Muscle',
      'Concussion', 'Damaged Eye'
    ];
    return injuries[roll - 1] || 'Unknown Injury';
  }
  
  loadHistory() {
    try {
      const saved = localStorage.getItem('cyberpunk-dice-history');
      if (saved) {
        this.history = JSON.parse(saved);
        this.updateHistoryDisplay();
      }
    } catch (error) {
      console.warn('Failed to load dice history:', error);
    }
  }
  
  saveHistory() {
    try {
      localStorage.setItem('cyberpunk-dice-history', JSON.stringify(this.history));
    } catch (error) {
      console.warn('Failed to save dice history:', error);
    }
  }
  
  loadMacros() {
    try {
      return JSON.parse(localStorage.getItem('cyberpunk-dice-macros') || '[]');
    } catch {
      return [];
    }
  }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompactDiceRoller;
} else {
  window.CompactDiceRoller = CompactDiceRoller;
}