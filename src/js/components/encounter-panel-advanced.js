// Advanced Encounter Panel UI Implementation
class AdvancedEncounterPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.generator = new AdvancedEncounterGenerator();
    this.currentEncounter = null;
    this.encounterHistory = [];
    this.favorites = this.loadFavorites();
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="encounter-panel-advanced">
        <div class="encounter-controls">
          <div class="control-row">
            <select id="encounter-type" class="neon-select">
              <option value="random">Random Type</option>
              <option value="combat">Combat</option>
              <option value="social">Social</option>
              <option value="exploration">Exploration</option>
              <option value="horror">Horror</option>
              <option value="mystery">Mystery</option>
            </select>
            
            <select id="encounter-subtype" class="neon-select">
              <option value="random">Random Subtype</option>
            </select>
            
            <button id="generate-encounter" class="btn-primary">
              <span class="icon">🎲</span> Generate Encounter
            </button>
          </div>
          
          <div class="control-row modifiers">
            <div class="modifier-group">
              <label>Party Size</label>
              <select id="party-size" class="neon-select-small">
                <option value="small">Small (1-3)</option>
                <option value="medium" selected>Medium (4-5)</option>
                <option value="large">Large (6+)</option>
              </select>
            </div>
            
            <div class="modifier-group">
              <label>Time</label>
              <select id="time-of-day" class="neon-select-small">
                <option value="day">Day</option>
                <option value="night" selected>Night</option>
                <option value="dawn_dusk">Dawn/Dusk</option>
              </select>
            </div>
            
            <div class="modifier-group">
              <label>District</label>
              <select id="district" class="neon-select-small">
                <option value="city_center">City Center</option>
                <option value="watson" selected>Watson</option>
                <option value="westbrook">Westbrook</option>
                <option value="pacifica">Pacifica</option>
                <option value="badlands">Badlands</option>
              </select>
            </div>
            
            <div class="modifier-group">
              <label>Difficulty</label>
              <input type="range" id="difficulty-adjust" min="-2" max="2" value="0" class="difficulty-slider">
              <span id="difficulty-display">Normal</span>
            </div>
          </div>
          
          <div class="control-row quick-actions">
            <button id="favorite-encounter" class="btn-secondary" disabled>
              <span class="icon">⭐</span> Favorite
            </button>
            <button id="export-encounter" class="btn-secondary" disabled>
              <span class="icon">💾</span> Export
            </button>
            <button id="show-history" class="btn-secondary">
              <span class="icon">📜</span> History
            </button>
            <button id="show-favorites" class="btn-secondary">
              <span class="icon">⭐</span> Favorites
            </button>
          </div>
        </div>
        
        <div class="encounter-display" id="encounter-display">
          <div class="placeholder">
            <div class="placeholder-icon">🎲</div>
            <h3>Generate an Encounter</h3>
            <p>Select your parameters and click Generate to create a detailed encounter scenario</p>
            <div class="quick-presets">
              <h4>Quick Presets:</h4>
              <button class="preset-btn" data-preset="combat-ambush">Gang Ambush</button>
              <button class="preset-btn" data-preset="social-negotiation">Fixer Meeting</button>
              <button class="preset-btn" data-preset="exploration-urban">Building Exploration</button>
              <button class="preset-btn" data-preset="horror-cyber">Cyberpsycho Hunt</button>
            </div>
          </div>
        </div>
        
        <div class="encounter-history-panel" id="history-panel" style="display: none;">
          <h3>Encounter History</h3>
          <div class="history-list" id="history-list"></div>
        </div>
        
        <div class="encounter-favorites-panel" id="favorites-panel" style="display: none;">
          <h3>Favorite Encounters</h3>
          <div class="favorites-list" id="favorites-list"></div>
        </div>
      </div>
    `;
  }
  
  attachEventListeners() {
    // Type selection changes subtypes
    document.getElementById('encounter-type').addEventListener('change', (e) => {
      this.updateSubtypes(e.target.value);
    });
    
    // Generate button
    document.getElementById('generate-encounter').addEventListener('click', () => {
      this.generateEncounter();
    });
    
    // Difficulty slider
    const difficultySlider = document.getElementById('difficulty-adjust');
    const difficultyDisplay = document.getElementById('difficulty-display');
    difficultySlider.addEventListener('input', (e) => {
      const labels = ['Very Easy', 'Easy', 'Normal', 'Hard', 'Very Hard'];
      difficultyDisplay.textContent = labels[parseInt(e.target.value) + 2];
    });
    
    // Quick actions
    document.getElementById('favorite-encounter').addEventListener('click', () => {
      this.favoriteCurrentEncounter();
    });
    
    document.getElementById('export-encounter').addEventListener('click', () => {
      this.exportCurrentEncounter();
    });
    
    document.getElementById('show-history').addEventListener('click', () => {
      this.toggleHistoryPanel();
    });
    
    document.getElementById('show-favorites').addEventListener('click', () => {
      this.toggleFavoritesPanel();
    });
    
    // Preset buttons
    this.container.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.loadPreset(btn.dataset.preset);
      });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      
      if (e.key === 'g' && !e.ctrlKey) {
        document.getElementById('generate-encounter').click();
      } else if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        if (this.currentEncounter) {
          this.favoriteCurrentEncounter();
        }
      }
    });
  }
  
  updateSubtypes(type) {
    const subtypeSelect = document.getElementById('encounter-subtype');
    subtypeSelect.innerHTML = '<option value="random">Random Subtype</option>';
    
    if (type !== 'random' && this.generator.encounters[type]) {
      const subtypes = Object.keys(this.generator.encounters[type]);
      subtypes.forEach(subtype => {
        const option = document.createElement('option');
        option.value = subtype;
        option.textContent = this.formatSubtype(subtype);
        subtypeSelect.appendChild(option);
      });
    }
  }
  
  generateEncounter() {
    const type = document.getElementById('encounter-type').value;
    const subtype = document.getElementById('encounter-subtype').value;
    const modifiers = {
      partySize: document.getElementById('party-size').value,
      timeOfDay: document.getElementById('time-of-day').value,
      district: document.getElementById('district').value,
      difficulty_adjust: parseInt(document.getElementById('difficulty-adjust').value)
    };
    
    this.currentEncounter = this.generator.generateEncounter(type, subtype, modifiers);
    this.displayEncounter(this.currentEncounter);
    this.addToHistory(this.currentEncounter);
    
    // Enable action buttons
    document.getElementById('favorite-encounter').disabled = false;
    document.getElementById('export-encounter').disabled = false;
    
    // Sound effect
    if (window.soundManager) {
      window.soundManager.play('generate');
    }
  }
  
  displayEncounter(encounter) {
    const display = document.getElementById('encounter-display');
    
    if (encounter.error) {
      display.innerHTML = `<div class="error-message">${encounter.error}</div>`;
      return;
    }
    
    display.innerHTML = `
      <div class="encounter-content">
        <div class="encounter-header">
          <h2 class="encounter-name">${encounter.name}</h2>
          <div class="encounter-tags">
            <span class="tag tag-type">${encounter.metadata.type}</span>
            <span class="tag tag-subtype">${encounter.metadata.subtype}</span>
            <span class="tag tag-difficulty ${encounter.difficulty.toLowerCase()}">${encounter.difficulty}</span>
          </div>
        </div>
        
        <div class="encounter-description">
          <p class="text-reading">${encounter.description}</p>
        </div>
        
        ${this.renderEnvironment(encounter)}
        ${this.renderEnemies(encounter)}
        ${this.renderObjectives(encounter)}
        ${this.renderTactics(encounter)}
        ${this.renderComplications(encounter)}
        ${this.renderLoot(encounter)}
        ${this.renderSensoryDetails(encounter)}
        ${this.renderNPCs(encounter)}
        ${this.renderConnections(encounter)}
        
        <div class="encounter-footer">
          <div class="weather-info">
            <strong>Weather:</strong> ${encounter.weather.type} - ${encounter.weather.effects}
          </div>
          <div class="encounter-id">ID: ${encounter.metadata.id}</div>
        </div>
      </div>
    `;
    
    // Add collapsible sections
    display.querySelectorAll('.section-header').forEach(header => {
      header.addEventListener('click', () => {
        header.classList.toggle('collapsed');
        header.nextElementSibling.classList.toggle('collapsed');
      });
    });
  }
  
  renderEnvironment(encounter) {
    if (!encounter.environment) return '';
    
    const env = encounter.environment;
    return `
      <div class="encounter-section">
        <h3 class="section-header">🌆 Environment</h3>
        <div class="section-content">
          ${env.lighting ? `<div class="env-item"><strong>Lighting:</strong> ${env.lighting}</div>` : ''}
          ${env.cover ? `<div class="env-item"><strong>Cover:</strong> ${env.cover}</div>` : ''}
          ${env.hazards ? `
            <div class="env-item">
              <strong>Hazards:</strong>
              <ul class="hazard-list">
                ${env.hazards.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${env.civilians ? `<div class="env-item"><strong>Civilians:</strong> ${env.civilians}</div>` : ''}
          ${env.security_response ? `<div class="env-item"><strong>Security Response:</strong> ${env.security_response}</div>` : ''}
        </div>
      </div>
    `;
  }
  
  renderEnemies(encounter) {
    if (!encounter.enemies) return '';
    
    return `
      <div class="encounter-section">
        <h3 class="section-header">⚔️ Opposition</h3>
        <div class="section-content">
          <div class="enemy-list">
            ${encounter.enemies.map(enemy => `
              <div class="enemy-item">
                <div class="enemy-header">
                  <span class="enemy-type">${enemy.type}</span>
                  <span class="enemy-count">x${enemy.count}</span>
                </div>
                ${enemy.equipment ? `
                  <div class="enemy-equipment">
                    ${enemy.equipment.map(eq => `<span class="equipment-tag">${eq}</span>`).join('')}
                  </div>
                ` : ''}
                ${enemy.skill_modifier ? `
                  <div class="enemy-modifier">Skill Modifier: ${enemy.skill_modifier > 0 ? '+' : ''}${enemy.skill_modifier}</div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  renderObjectives(encounter) {
    if (!encounter.objectives) return '';
    
    return `
      <div class="encounter-section">
        <h3 class="section-header">🎯 Objectives</h3>
        <div class="section-content">
          <ul class="objectives-list">
            ${encounter.objectives.map(obj => `<li>${obj}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
  
  renderTactics(encounter) {
    if (!encounter.tactics) return '';
    
    return `
      <div class="encounter-section">
        <h3 class="section-header">📋 Tactics</h3>
        <div class="section-content">
          <p class="tactics-description">${encounter.tactics}</p>
        </div>
      </div>
    `;
  }
  
  renderComplications(encounter) {
    if (!encounter.complications) return '';
    
    return `
      <div class="encounter-section">
        <h3 class="section-header">⚠️ Potential Complications</h3>
        <div class="section-content">
          <ul class="complications-list">
            ${encounter.complications.map(comp => `
              <li class="${encounter.active_complication === comp ? 'active-complication' : ''}">
                ${comp}
                ${encounter.active_complication === comp ? ' <span class="active-tag">ACTIVE</span>' : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }
  
  renderLoot(encounter) {
    if (!encounter.loot) return '';
    
    return `
      <div class="encounter-section">
        <h3 class="section-header">💰 Potential Loot</h3>
        <div class="section-content">
          <ul class="loot-list">
            ${encounter.loot.map(item => `<li>${item}</li>`).join('')}
          </ul>
          ${encounter.loot_quality_modifier ? `
            <div class="loot-modifier">Quality Modifier: ${encounter.loot_quality_modifier > 0 ? '+' : ''}${encounter.loot_quality_modifier}</div>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  renderSensoryDetails(encounter) {
    if (!encounter.sensory) return '';
    
    return `
      <div class="encounter-section">
        <h3 class="section-header">👁️ Sensory Details</h3>
        <div class="section-content">
          <div class="sensory-grid">
            ${Object.entries(encounter.sensory).map(([sense, detail]) => `
              <div class="sensory-item">
                <span class="sense-type">${this.capitalize(sense)}:</span>
                <span class="sense-detail">${detail}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  renderNPCs(encounter) {
    if (!encounter.random_npcs || encounter.random_npcs.length === 0) return '';
    
    return `
      <div class="encounter-section">
        <h3 class="section-header">👥 Random NPCs</h3>
        <div class="section-content">
          <div class="npc-list">
            ${encounter.random_npcs.map(npc => `
              <div class="npc-item">
                <div class="npc-name">${npc.name}</div>
                <div class="npc-role">${npc.role}</div>
                <div class="npc-details">
                  <span class="npc-appearance">${npc.appearance}</span>
                  <span class="npc-quirk">${npc.quirk}</span>
                </div>
                <div class="npc-behavior">${npc.behavior}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  renderConnections(encounter) {
    if (!encounter.connections || encounter.connections.length === 0) return '';
    
    return `
      <div class="encounter-section">
        <h3 class="section-header">🔗 Connections</h3>
        <div class="section-content">
          <div class="connections-list">
            ${encounter.connections.map(conn => `
              <div class="connection-item">
                <div class="connection-type">${conn.type}</div>
                <div class="connection-desc">${conn.description}</div>
                <div class="connection-impact">${conn.impact}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  favoriteCurrentEncounter() {
    if (!this.currentEncounter) return;
    
    const existing = this.favorites.findIndex(f => f.metadata.id === this.currentEncounter.metadata.id);
    
    if (existing >= 0) {
      this.favorites.splice(existing, 1);
      this.showNotification('Removed from favorites');
    } else {
      this.favorites.push(this.currentEncounter);
      this.showNotification('Added to favorites');
    }
    
    this.saveFavorites();
    this.updateFavoriteButton();
  }
  
  updateFavoriteButton() {
    const btn = document.getElementById('favorite-encounter');
    if (!this.currentEncounter) return;
    
    const isFavorite = this.favorites.some(f => f.metadata.id === this.currentEncounter.metadata.id);
    btn.innerHTML = isFavorite ? '<span class="icon">⭐</span> Favorited' : '<span class="icon">⭐</span> Favorite';
    btn.classList.toggle('active', isFavorite);
  }
  
  exportCurrentEncounter() {
    if (!this.currentEncounter) return;
    
    const json = this.generator.exportEncounter(this.currentEncounter);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `encounter_${this.currentEncounter.metadata.id}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showNotification('Encounter exported');
  }
  
  addToHistory(encounter) {
    this.encounterHistory.unshift(encounter);
    if (this.encounterHistory.length > 50) {
      this.encounterHistory.pop();
    }
    this.saveHistory();
  }
  
  toggleHistoryPanel() {
    const panel = document.getElementById('history-panel');
    const favPanel = document.getElementById('favorites-panel');
    
    if (panel.style.display === 'none') {
      panel.style.display = 'block';
      favPanel.style.display = 'none';
      this.renderHistory();
    } else {
      panel.style.display = 'none';
    }
  }
  
  toggleFavoritesPanel() {
    const panel = document.getElementById('favorites-panel');
    const histPanel = document.getElementById('history-panel');
    
    if (panel.style.display === 'none') {
      panel.style.display = 'block';
      histPanel.style.display = 'none';
      this.renderFavorites();
    } else {
      panel.style.display = 'none';
    }
  }
  
  renderHistory() {
    const list = document.getElementById('history-list');
    
    if (this.encounterHistory.length === 0) {
      list.innerHTML = '<div class="empty-message">No encounters generated yet</div>';
      return;
    }
    
    list.innerHTML = this.encounterHistory.map(enc => `
      <div class="history-item" data-id="${enc.metadata.id}">
        <div class="history-header">
          <span class="history-name">${enc.name}</span>
          <span class="history-time">${new Date(enc.metadata.generated).toLocaleString()}</span>
        </div>
        <div class="history-tags">
          <span class="tag">${enc.metadata.type}</span>
          <span class="tag">${enc.difficulty}</span>
        </div>
        <button class="load-btn" onclick="encounterPanel.loadEncounter('${enc.metadata.id}')">Load</button>
      </div>
    `).join('');
  }
  
  renderFavorites() {
    const list = document.getElementById('favorites-list');
    
    if (this.favorites.length === 0) {
      list.innerHTML = '<div class="empty-message">No favorite encounters yet</div>';
      return;
    }
    
    list.innerHTML = this.favorites.map(enc => `
      <div class="favorite-item" data-id="${enc.metadata.id}">
        <div class="favorite-header">
          <span class="favorite-name">${enc.name}</span>
          <button class="remove-btn" onclick="encounterPanel.removeFavorite('${enc.metadata.id}')">✕</button>
        </div>
        <div class="favorite-tags">
          <span class="tag">${enc.metadata.type}</span>
          <span class="tag">${enc.difficulty}</span>
        </div>
        <button class="load-btn" onclick="encounterPanel.loadFavorite('${enc.metadata.id}')">Load</button>
      </div>
    `).join('');
  }
  
  loadEncounter(id) {
    const encounter = this.encounterHistory.find(e => e.metadata.id === id);
    if (encounter) {
      this.currentEncounter = encounter;
      this.displayEncounter(encounter);
      document.getElementById('history-panel').style.display = 'none';
      document.getElementById('favorite-encounter').disabled = false;
      document.getElementById('export-encounter').disabled = false;
      this.updateFavoriteButton();
    }
  }
  
  loadFavorite(id) {
    const encounter = this.favorites.find(e => e.metadata.id === id);
    if (encounter) {
      this.currentEncounter = encounter;
      this.displayEncounter(encounter);
      document.getElementById('favorites-panel').style.display = 'none';
      document.getElementById('favorite-encounter').disabled = false;
      document.getElementById('export-encounter').disabled = false;
      this.updateFavoriteButton();
    }
  }
  
  removeFavorite(id) {
    this.favorites = this.favorites.filter(f => f.metadata.id !== id);
    this.saveFavorites();
    this.renderFavorites();
    if (this.currentEncounter && this.currentEncounter.metadata.id === id) {
      this.updateFavoriteButton();
    }
  }
  
  loadPreset(preset) {
    const presets = {
      'combat-ambush': { type: 'combat', subtype: 'street' },
      'social-negotiation': { type: 'social', subtype: 'negotiation' },
      'exploration-urban': { type: 'exploration', subtype: 'urban' },
      'horror-cyber': { type: 'horror', subtype: 'psychological' }
    };
    
    const settings = presets[preset];
    if (settings) {
      document.getElementById('encounter-type').value = settings.type;
      this.updateSubtypes(settings.type);
      setTimeout(() => {
        document.getElementById('encounter-subtype').value = settings.subtype;
        this.generateEncounter();
      }, 100);
    }
  }
  
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
  
  // Utility methods
  formatSubtype(subtype) {
    return subtype.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // Storage methods
  saveHistory() {
    localStorage.setItem('cyberpunk-encounter-history', JSON.stringify(this.encounterHistory));
  }
  
  loadHistory() {
    const saved = localStorage.getItem('cyberpunk-encounter-history');
    return saved ? JSON.parse(saved) : [];
  }
  
  saveFavorites() {
    localStorage.setItem('cyberpunk-encounter-favorites', JSON.stringify(this.favorites));
  }
  
  loadFavorites() {
    const saved = localStorage.getItem('cyberpunk-encounter-favorites');
    return saved ? JSON.parse(saved) : [];
  }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('encounter-panel-content')) {
    window.encounterPanel = new AdvancedEncounterPanel('encounter-panel-content');
  }
});