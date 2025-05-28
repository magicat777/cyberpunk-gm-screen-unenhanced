// Simple Encounter Panel Implementation that works with dynamic DOM
class SimpleEncounterPanel {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      console.error('Encounter panel container not found:', containerId);
      return;
    }
    
    this.generator = window.AdvancedEncounterGenerator ? new AdvancedEncounterGenerator() : null;
    this.currentEncounter = null;
    
    this.init();
  }
  
  init() {
    this.render();
    // Delay event listener attachment to ensure DOM is ready
    setTimeout(() => this.attachEventListeners(), 100);
  }
  
  render() {
    this.container.innerHTML = `
      <div class="encounter-panel-simple" style="height: 100%; display: flex; flex-direction: column;">
        <div class="encounter-controls" style="padding: 15px; background: rgba(0,0,0,0.3); border-bottom: 1px solid #0ff;">
          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <select id="${this.containerId}-type" class="neon-select">
              <option value="random">Random Type</option>
              <option value="combat">Combat</option>
              <option value="social">Social</option>
              <option value="exploration">Exploration</option>
              <option value="horror">Horror</option>
              <option value="mystery">Mystery</option>
            </select>
            
            <select id="${this.containerId}-difficulty" class="neon-select">
              <option value="easy">Easy</option>
              <option value="medium" selected>Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <button id="${this.containerId}-generate" class="btn-primary">
              <span>🎲</span> Generate Encounter
            </button>
          </div>
          
          <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 5px; font-size: 14px;">
              <span>District:</span>
              <select id="${this.containerId}-district" class="neon-select-small">
                <option value="city_center">City Center</option>
                <option value="watson" selected>Watson</option>
                <option value="westbrook">Westbrook</option>
                <option value="pacifica">Pacifica</option>
                <option value="badlands">Badlands</option>
              </select>
            </label>
            
            <label style="display: flex; align-items: center; gap: 5px; font-size: 14px;">
              <span>Time:</span>
              <select id="${this.containerId}-time" class="neon-select-small">
                <option value="day">Day</option>
                <option value="night" selected>Night</option>
                <option value="dawn_dusk">Dawn/Dusk</option>
              </select>
            </label>
          </div>
        </div>
        
        <div id="${this.containerId}-display" class="encounter-display" style="flex: 1; overflow-y: auto; padding: 20px;">
          <div class="placeholder" style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 64px; margin-bottom: 20px; opacity: 0.5;">🎲</div>
            <h3 style="color: #0ff; margin-bottom: 10px; font-size: 24px; text-transform: uppercase;">Generate an Encounter</h3>
            <p style="color: #888; margin-bottom: 30px;">Select your parameters and click Generate to create a detailed encounter scenario</p>
            
            <div class="quick-presets">
              <h4 style="color: #f0f; margin-bottom: 15px;">Quick Presets:</h4>
              <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button class="btn-secondary preset-btn" data-type="combat" data-subtype="street">
                  Street Fight
                </button>
                <button class="btn-secondary preset-btn" data-type="social" data-subtype="negotiation">
                  Negotiation
                </button>
                <button class="btn-secondary preset-btn" data-type="exploration" data-subtype="urban">
                  Urban Exploration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  attachEventListeners() {
    const generateBtn = document.getElementById(`${this.containerId}-generate`);
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateEncounter());
    }
    
    // Preset buttons
    this.container.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        document.getElementById(`${this.containerId}-type`).value = type;
        this.generateEncounter();
      });
    });
  }
  
  generateEncounter() {
    const display = document.getElementById(`${this.containerId}-display`);
    
    // Show loading state
    display.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <div style="font-size: 48px; animation: spin 2s linear infinite;">⚙️</div>
        <h3 style="color: #0ff; margin-top: 20px;">Generating Encounter...</h3>
      </div>
    `;
    
    // Simulate generation delay for effect
    setTimeout(() => {
      if (!this.generator) {
        // Fallback if generator isn't available
        this.displayFallbackEncounter();
        return;
      }
      
      const type = document.getElementById(`${this.containerId}-type`).value;
      const difficulty = document.getElementById(`${this.containerId}-difficulty`).value;
      const district = document.getElementById(`${this.containerId}-district`).value;
      const timeOfDay = document.getElementById(`${this.containerId}-time`).value;
      
      try {
        this.currentEncounter = this.generator.generateEncounter(type, 'random', {
          difficulty_adjust: difficulty === 'easy' ? -1 : difficulty === 'hard' ? 1 : 0,
          district: district,
          timeOfDay: timeOfDay
        });
        
        this.displayEncounter(this.currentEncounter);
      } catch (error) {
        console.error('Error generating encounter:', error);
        this.displayFallbackEncounter();
      }
    }, 500);
  }
  
  displayEncounter(encounter) {
    const display = document.getElementById(`${this.containerId}-display`);
    
    if (!encounter || encounter.error) {
      display.innerHTML = `
        <div style="background: rgba(255,0,0,0.1); border: 1px solid #f00; padding: 20px; border-radius: 5px;">
          <h3 style="color: #f00;">Error Generating Encounter</h3>
          <p>${encounter?.error || 'Unknown error occurred'}</p>
        </div>
      `;
      return;
    }
    
    display.innerHTML = `
      <div class="encounter-content" style="color: #ddd;">
        <div style="margin-bottom: 20px;">
          <h2 style="color: #0ff; margin-bottom: 10px;">${encounter.name || 'Random Encounter'}</h2>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
            <span style="background: #0ff; color: #000; padding: 4px 8px; border-radius: 3px; font-size: 12px;">
              ${encounter.metadata?.type || 'Unknown'}
            </span>
            <span style="background: #f0f; color: #000; padding: 4px 8px; border-radius: 3px; font-size: 12px;">
              ${encounter.difficulty || 'Medium'}
            </span>
          </div>
        </div>
        
        <div style="background: rgba(0,255,255,0.05); padding: 15px; border-left: 3px solid #0ff; margin-bottom: 20px;">
          <p style="line-height: 1.6;">${encounter.description || 'An encounter occurs in Night City...'}</p>
        </div>
        
        ${this.renderSection('Environment', encounter.environment, '🌆')}
        ${this.renderSection('Enemies', encounter.enemies, '👥')}
        ${this.renderSection('Tactics', encounter.tactics, '⚔️')}
        ${this.renderSection('Complications', encounter.complications, '⚡')}
        ${this.renderSection('Loot', encounter.loot, '💰')}
      </div>
    `;
  }
  
  renderSection(title, data, icon) {
    if (!data) return '';
    
    let content = '';
    if (Array.isArray(data)) {
      content = `<ul style="margin: 0; padding-left: 20px;">${data.map(item => {
        if (typeof item === 'object') {
          return `<li>${item.type || item.name || 'Unknown'} ${item.count ? `(${item.count})` : ''}</li>`;
        }
        return `<li>${item}</li>`;
      }).join('')}</ul>`;
    } else if (typeof data === 'object') {
      content = Object.entries(data).map(([key, value]) => {
        if (Array.isArray(value)) {
          return `<div><strong>${this.formatKey(key)}:</strong> ${value.join(', ')}</div>`;
        }
        return `<div><strong>${this.formatKey(key)}:</strong> ${value}</div>`;
      }).join('');
    } else {
      content = `<p>${data}</p>`;
    }
    
    return `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #f0f; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
          <span>${icon}</span> ${title}
        </h3>
        <div style="padding-left: 20px;">
          ${content}
        </div>
      </div>
    `;
  }
  
  formatKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  displayFallbackEncounter() {
    const display = document.getElementById(`${this.containerId}-display`);
    const type = document.getElementById(`${this.containerId}-type`).value;
    const difficulty = document.getElementById(`${this.containerId}-difficulty`).value;
    
    // Simple fallback encounters
    const fallbackEncounters = {
      combat: {
        name: "Street Confrontation",
        description: "A group of gangers blocks your path, demanding a 'toll' for safe passage through their territory.",
        enemies: ["3-5 Street Gangers", "1 Gang Lieutenant"],
        environment: "Narrow alley with dumpsters for cover, flickering streetlights",
        tactics: "Gangers spread out to flank, lieutenant stays back with rifle",
        loot: ["€100-300", "Street weapons", "Drugs", "Gang colors"]
      },
      social: {
        name: "Information Broker Meeting",
        description: "A shadowy figure wants to meet at a nightclub to discuss sensitive information.",
        environment: "Crowded nightclub with loud music, strobing lights",
        complications: ["The broker might be setting you up", "Corporate agents are watching", "Gang owns the club"],
        objectives: ["Verify the broker's identity", "Negotiate price", "Secure the information", "Get out safely"]
      },
      exploration: {
        name: "Abandoned Corporate Facility",
        description: "An old Arasaka research facility stands empty... or does it?",
        environment: "Dark corridors, broken equipment, emergency lighting only",
        hazards: ["Unstable floors", "Automated security still active", "Chemical spills"],
        loot: ["Old tech components", "Research data", "Corporate secrets", "Prototype equipment"]
      }
    };
    
    const encounter = fallbackEncounters[type] || fallbackEncounters.combat;
    
    display.innerHTML = `
      <div class="encounter-content" style="color: #ddd;">
        <h2 style="color: #0ff; margin-bottom: 10px;">${encounter.name}</h2>
        <span style="background: #f0f; color: #000; padding: 4px 8px; border-radius: 3px; font-size: 12px;">
          ${difficulty.toUpperCase()}
        </span>
        
        <div style="background: rgba(0,255,255,0.05); padding: 15px; border-left: 3px solid #0ff; margin: 20px 0;">
          <p>${encounter.description}</p>
        </div>
        
        ${Object.entries(encounter).filter(([key]) => key !== 'name' && key !== 'description').map(([key, value]) => {
          const icon = {
            enemies: '👥',
            environment: '🌆',
            tactics: '⚔️',
            complications: '⚡',
            loot: '💰',
            hazards: '⚠️',
            objectives: '🎯'
          }[key] || '📌';
          
          return this.renderSection(this.formatKey(key), Array.isArray(value) ? value : [value], icon);
        }).join('')}
      </div>
    `;
  }
}

// Make it globally available
window.SimpleEncounterPanel = SimpleEncounterPanel;