/**
 * Virtual Scrolling Implementation for Large Data Sets
 * Optimized for Cyberpunk GM Screen tables and lists
 */

class VirtualScroll {
  constructor(container, options = {}) {
    this.container = container;
    this.items = options.items || [];
    this.itemHeight = options.itemHeight || 50;
    this.bufferSize = options.bufferSize || 5;
    this.renderItem = options.renderItem || this.defaultRenderItem;
    this.onScroll = options.onScroll || null;
    
    this.scrollTop = 0;
    this.containerHeight = 0;
    this.visibleStart = 0;
    this.visibleEnd = 0;
    
    this.init();
  }
  
  init() {
    this.setupDOM();
    this.attachEventListeners();
    this.render();
  }
  
  setupDOM() {
    this.container.style.position = 'relative';
    this.container.style.overflow = 'auto';
    
    // Create viewport
    this.viewport = document.createElement('div');
    this.viewport.style.position = 'relative';
    this.viewport.style.width = '100%';
    this.viewport.style.minHeight = '100%';
    
    // Create spacer for total height
    this.spacer = document.createElement('div');
    this.spacer.style.position = 'absolute';
    this.spacer.style.top = '0';
    this.spacer.style.left = '0';
    this.spacer.style.width = '1px';
    this.spacer.style.height = `${this.items.length * this.itemHeight}px`;
    this.spacer.style.pointerEvents = 'none';
    
    // Create content container
    this.content = document.createElement('div');
    this.content.style.position = 'relative';
    this.content.style.width = '100%';
    
    this.viewport.appendChild(this.spacer);
    this.viewport.appendChild(this.content);
    this.container.appendChild(this.viewport);
  }
  
  attachEventListeners() {
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Initial size calculation
    this.handleResize();
  }
  
  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    this.calculateVisibleRange();
    this.render();
    
    if (this.onScroll) {
      this.onScroll({
        scrollTop: this.scrollTop,
        visibleStart: this.visibleStart,
        visibleEnd: this.visibleEnd
      });
    }
  }
  
  handleResize() {
    this.containerHeight = this.container.clientHeight;
    this.calculateVisibleRange();
    this.render();
  }
  
  calculateVisibleRange() {
    this.visibleStart = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize);
    this.visibleEnd = Math.min(
      this.items.length,
      Math.ceil((this.scrollTop + this.containerHeight) / this.itemHeight) + this.bufferSize
    );
  }
  
  render() {
    // Clear existing content
    this.content.innerHTML = '';
    
    // Render only visible items
    for (let i = this.visibleStart; i < this.visibleEnd; i++) {
      const item = this.items[i];
      const element = this.renderItem(item, i);
      
      if (element) {
        element.style.position = 'absolute';
        element.style.top = `${i * this.itemHeight}px`;
        element.style.width = '100%';
        element.style.height = `${this.itemHeight}px`;
        element.setAttribute('data-index', i);
        
        this.content.appendChild(element);
      }
    }
  }
  
  defaultRenderItem(item, index) {
    const div = document.createElement('div');
    div.style.padding = '10px';
    div.style.borderBottom = '1px solid var(--border-color)';
    div.style.background = index % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-tertiary)';
    div.textContent = JSON.stringify(item);
    return div;
  }
  
  // Public API
  setItems(items) {
    this.items = items;
    this.spacer.style.height = `${this.items.length * this.itemHeight}px`;
    this.calculateVisibleRange();
    this.render();
  }
  
  addItem(item) {
    this.items.push(item);
    this.spacer.style.height = `${this.items.length * this.itemHeight}px`;
    
    // Only re-render if the new item is visible
    if (this.items.length - 1 >= this.visibleStart && this.items.length - 1 < this.visibleEnd) {
      this.render();
    }
  }
  
  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.spacer.style.height = `${this.items.length * this.itemHeight}px`;
      this.calculateVisibleRange();
      this.render();
    }
  }
  
  updateItem(index, item) {
    if (index >= 0 && index < this.items.length) {
      this.items[index] = item;
      
      // Only re-render if the item is visible
      if (index >= this.visibleStart && index < this.visibleEnd) {
        this.render();
      }
    }
  }
  
  scrollToIndex(index) {
    if (index >= 0 && index < this.items.length) {
      const targetScroll = index * this.itemHeight;
      this.container.scrollTop = targetScroll;
    }
  }
  
  getVisibleItems() {
    return this.items.slice(this.visibleStart, this.visibleEnd);
  }
  
  destroy() {
    this.container.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    this.container.innerHTML = '';
  }
}

// Specialized virtual scroll for combat tracker
class CombatTrackerVirtualScroll extends VirtualScroll {
  constructor(container, options) {
    super(container, {
      ...options,
      itemHeight: 60,
      renderItem: (combatant, index) => this.renderCombatant(combatant, index)
    });
  }
  
  renderCombatant(combatant, index) {
    const div = document.createElement('div');
    div.className = 'virtual-combatant-row';
    div.innerHTML = `
      <div style="display: flex; align-items: center; height: 100%; padding: 10px; 
                  background: ${combatant.isActive ? 'var(--primary-dim)' : (index % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-tertiary)')};
                  border: 1px solid ${combatant.isActive ? 'var(--primary)' : 'var(--border-color)'};">
        <div style="flex: 0 0 50px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: var(--primary);">${combatant.initiative}</div>
        </div>
        <div style="flex: 1; padding: 0 15px;">
          <div style="font-weight: bold; color: var(--text-primary);">${combatant.name}</div>
          <div style="font-size: 12px; color: var(--text-secondary);">${combatant.type} • HP: ${combatant.hp}/${combatant.maxHp}</div>
        </div>
        <div style="flex: 0 0 120px; display: flex; gap: 5px;">
          <button class="action-btn" data-action="damage" data-index="${index}" 
                  style="padding: 4px 8px; background: var(--danger); border: none; color: white; 
                         border-radius: 3px; cursor: pointer; font-size: 11px;">
            Damage
          </button>
          <button class="action-btn" data-action="heal" data-index="${index}"
                  style="padding: 4px 8px; background: var(--success); border: none; color: white; 
                         border-radius: 3px; cursor: pointer; font-size: 11px;">
            Heal
          </button>
          <button class="action-btn" data-action="remove" data-index="${index}"
                  style="padding: 4px 8px; background: var(--bg-tertiary); border: 1px solid var(--border-color); 
                         color: var(--text-secondary); border-radius: 3px; cursor: pointer; font-size: 11px;">
            X
          </button>
        </div>
      </div>
    `;
    
    // Add event listeners
    div.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const idx = parseInt(btn.dataset.index);
        this.handleCombatantAction(action, idx);
      });
    });
    
    return div;
  }
  
  handleCombatantAction(action, index) {
    // Emit custom event for the combat tracker to handle
    this.container.dispatchEvent(new CustomEvent('combatant-action', {
      detail: { action, index, combatant: this.items[index] }
    }));
  }
}

// Specialized virtual scroll for lore database
class LoreDatabaseVirtualScroll extends VirtualScroll {
  constructor(container, options) {
    super(container, {
      ...options,
      itemHeight: 80,
      renderItem: (entry, index) => this.renderLoreEntry(entry, index)
    });
  }
  
  renderLoreEntry(entry, index) {
    const div = document.createElement('div');
    div.className = 'virtual-lore-entry';
    div.innerHTML = `
      <div style="padding: 12px; border-bottom: 1px solid var(--border-color); cursor: pointer;
                  background: ${index % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-tertiary)'};
                  transition: background 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <h4 style="margin: 0 0 5px 0; color: var(--primary);">${entry.title}</h4>
            <p style="margin: 0 0 5px 0; font-size: 13px; color: var(--text-secondary); 
                      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${entry.content}
            </p>
            <div style="display: flex; gap: 5px; flex-wrap: wrap;">
              ${entry.tags.map(tag => `
                <span style="background: var(--bg-quaternary); padding: 2px 6px; 
                             font-size: 10px; border-radius: 2px; color: var(--text-tertiary);">
                  ${tag}
                </span>
              `).join('')}
            </div>
          </div>
          <div style="font-size: 11px; color: var(--text-tertiary); text-align: right;">
            ${entry.category}<br>
            ${new Date(entry.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </div>
    `;
    
    // Add hover effect
    div.addEventListener('mouseenter', () => {
      div.style.background = 'var(--bg-hover)';
    });
    
    div.addEventListener('mouseleave', () => {
      div.style.background = index % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-tertiary)';
    });
    
    // Add click handler
    div.addEventListener('click', () => {
      this.container.dispatchEvent(new CustomEvent('lore-entry-click', {
        detail: { entry, index }
      }));
    });
    
    return div;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VirtualScroll, CombatTrackerVirtualScroll, LoreDatabaseVirtualScroll };
} else {
  window.VirtualScroll = VirtualScroll;
  window.CombatTrackerVirtualScroll = CombatTrackerVirtualScroll;
  window.LoreDatabaseVirtualScroll = LoreDatabaseVirtualScroll;
}