/**
 * Enhanced Panel System for Cyberpunk GM Screen
 * Supports dragging, resizing, docking, tabs, and persistence
 */

class EnhancedPanelSystem {
  constructor(options = {}) {
    this.container = options.container || document.querySelector('.panel-container');
    this.panels = new Map();
    this.dockZones = ['top', 'bottom', 'left', 'right'];
    this.activePanel = null;
    this.draggedPanel = null;
    
    this.config = {
      enableDrag: options.enableDrag !== false,
      enableResize: options.enableResize !== false,
      enableDocking: options.enableDocking !== false,
      enableTabs: options.enableTabs !== false,
      persistLayout: options.persistLayout !== false,
      ...options
    };
    
    this.init();
  }
  
  init() {
    // Create dock zones
    if (this.config.enableDocking) {
      this.createDockZones();
    }
    
    // Load saved layout
    if (this.config.persistLayout) {
      this.loadLayout();
    }
    
    // Global event listeners
    this.setupGlobalListeners();
  }
  
  createPanel(options) {
    const panel = new CyberpunkPanel({
      ...options,
      system: this,
      enableDrag: this.config.enableDrag,
      enableResize: this.config.enableResize,
      enableTabs: this.config.enableTabs
    });
    
    this.panels.set(panel.id, panel);
    this.container.appendChild(panel.element);
    
    // Set initial z-index and bring to front
    panel.element.style.zIndex = 100 + this.panels.size;
    this.setActivePanel(panel);
    
    // Save layout after adding
    if (this.config.persistLayout) {
      this.saveLayout();
    }
    
    return panel;
  }
  
  removePanel(panelId) {
    const panel = this.panels.get(panelId);
    if (panel) {
      panel.destroy();
      this.panels.delete(panelId);
      this.saveLayout();
    }
  }
  
  createDockZones() {
    this.dockZones.forEach(zone => {
      const element = document.createElement('div');
      element.className = `dock-zone ${zone}`;
      element.dataset.zone = zone;
      document.body.appendChild(element);
    });
  }
  
  setupGlobalListeners() {
    // Drag events
    if (this.config.enableDrag) {
      document.addEventListener('mousemove', this.handleGlobalMouseMove.bind(this));
      document.addEventListener('mouseup', this.handleGlobalMouseUp.bind(this));
      document.addEventListener('touchmove', this.handleGlobalTouchMove.bind(this), { passive: false });
      document.addEventListener('touchend', this.handleGlobalTouchEnd.bind(this));
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  handleGlobalMouseMove(e) {
    if (this.draggedPanel) {
      e.preventDefault();
      requestAnimationFrame(() => {
        if (this.draggedPanel) {
          this.draggedPanel.handleDragMove(e.clientX, e.clientY);
          this.checkDockZones(e.clientX, e.clientY);
        }
      });
    }
  }
  
  handleGlobalMouseUp(e) {
    if (this.draggedPanel) {
      const zone = this.getActiveDockZone(e.clientX, e.clientY);
      if (zone) {
        this.dockPanel(this.draggedPanel, zone);
      }
      this.draggedPanel.handleDragEnd();
      this.draggedPanel = null;
      this.clearDockZones();
    }
  }
  
  handleGlobalTouchMove(e) {
    if (this.draggedPanel && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleGlobalMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }
  
  handleGlobalTouchEnd(e) {
    if (this.draggedPanel) {
      const touch = e.changedTouches[0];
      this.handleGlobalMouseUp({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }
  
  handleKeyDown(e) {
    // Alt + Tab to cycle panels
    if (e.altKey && e.key === 'Tab') {
      e.preventDefault();
      this.cyclePanel(e.shiftKey ? -1 : 1);
    }
    
    // Esc to close active panel
    if (e.key === 'Escape' && this.activePanel) {
      this.activePanel.minimize();
    }
  }
  
  checkDockZones(x, y) {
    if (!this.config.enableDocking) return;
    
    document.querySelectorAll('.dock-zone').forEach(zone => {
      const rect = zone.getBoundingClientRect();
      const isOver = x >= rect.left && x <= rect.right && 
                     y >= rect.top && y <= rect.bottom;
      zone.classList.toggle('active', isOver);
    });
  }
  
  getActiveDockZone(x, y) {
    const zones = document.querySelectorAll('.dock-zone');
    for (const zone of zones) {
      const rect = zone.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && 
          y >= rect.top && y <= rect.bottom) {
        return zone.dataset.zone;
      }
    }
    return null;
  }
  
  clearDockZones() {
    document.querySelectorAll('.dock-zone').forEach(zone => {
      zone.classList.remove('active');
    });
  }
  
  dockPanel(panel, zone) {
    panel.dock(zone);
    this.saveLayout();
  }
  
  cyclePanel(direction = 1) {
    const panelArray = Array.from(this.panels.values());
    if (panelArray.length === 0) return;
    
    let currentIndex = -1;
    if (this.activePanel) {
      currentIndex = panelArray.findIndex(p => p.id === this.activePanel.id);
    }
    
    const nextIndex = (currentIndex + direction + panelArray.length) % panelArray.length;
    const nextPanel = panelArray[nextIndex];
    
    if (nextPanel) {
      nextPanel.focus();
    }
  }
  
  setActivePanel(panel) {
    if (this.activePanel && this.activePanel !== panel) {
      this.activePanel.element.classList.remove('active');
    }
    
    this.activePanel = panel;
    panel.element.classList.add('active');
    
    // Bring to front if floating
    if (!panel.isDocked) {
      this.bringToFront(panel);
    }
  }
  
  bringToFront(panel) {
    const maxZ = Math.max(...Array.from(this.panels.values())
      .filter(p => !p.isDocked)
      .map(p => parseInt(p.element.style.zIndex || 100)));
    
    panel.element.style.zIndex = maxZ + 1;
  }
  
  saveLayout() {
    if (!this.config.persistLayout) return;
    
    const layout = {
      panels: Array.from(this.panels.values()).map(panel => ({
        id: panel.id,
        title: panel.title,
        position: panel.position,
        size: panel.size,
        state: panel.state,
        isDocked: panel.isDocked,
        dockZone: panel.dockZone,
        activeTab: panel.activeTab,
        content: panel.getContentData()
      }))
    };
    
    localStorage.setItem('cyberpunk-panel-layout', JSON.stringify(layout));
  }
  
  loadLayout() {
    const saved = localStorage.getItem('cyberpunk-panel-layout');
    if (!saved) return;
    
    try {
      const layout = JSON.parse(saved);
      layout.panels.forEach(panelData => {
        this.createPanel(panelData);
      });
    } catch (e) {
      console.error('Failed to load panel layout:', e);
    }
  }
  
  resetLayout() {
    this.panels.forEach(panel => panel.destroy());
    this.panels.clear();
    localStorage.removeItem('cyberpunk-panel-layout');
  }
  
  fitAllToScreen() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 20;
    const panelArray = Array.from(this.panels.values()).filter(p => !p.isDocked);
    
    if (panelArray.length === 0) return;
    
    // Calculate grid layout
    const cols = Math.ceil(Math.sqrt(panelArray.length));
    const rows = Math.ceil(panelArray.length / cols);
    
    const panelWidth = Math.floor((viewportWidth - padding * (cols + 1)) / cols);
    const panelHeight = Math.floor((viewportHeight - padding * (rows + 1)) / rows);
    
    panelArray.forEach((panel, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      panel.position = {
        x: padding + col * (panelWidth + padding),
        y: padding + row * (panelHeight + padding)
      };
      
      panel.size = {
        width: panelWidth,
        height: panelHeight
      };
      
      if (panel.state === 'maximized') {
        panel.state = 'normal';
      }
      
      panel.updatePosition();
      panel.updateSize();
      panel.applyState();
    });
    
    this.saveLayout();
  }
  
  minimizeAll() {
    const bar = document.getElementById('minimizedPanelBar');
    const container = document.getElementById('minimizedPanels');
    
    if (!bar || !container) return;
    
    container.innerHTML = '';
    
    this.panels.forEach(panel => {
      if (!panel.isDocked) {
        panel.minimize();
        
        // Create minimized button
        const btn = document.createElement('button');
        btn.className = 'minimized-panel-btn';
        btn.textContent = panel.title;
        btn.onclick = () => {
          panel.state = 'normal';
          panel.applyState();
          this.updateMinimizedBar();
        };
        container.appendChild(btn);
      }
    });
    
    bar.style.display = container.children.length > 0 ? 'block' : 'none';
  }
  
  updateMinimizedBar() {
    const bar = document.getElementById('minimizedPanelBar');
    const container = document.getElementById('minimizedPanels');
    
    if (!bar || !container) return;
    
    container.innerHTML = '';
    
    this.panels.forEach(panel => {
      if (panel.state === 'minimized' && !panel.isDocked) {
        const btn = document.createElement('button');
        btn.className = 'minimized-panel-btn';
        btn.textContent = panel.title;
        btn.onclick = () => {
          panel.state = 'normal';
          panel.applyState();
          this.updateMinimizedBar();
        };
        container.appendChild(btn);
      }
    });
    
    bar.style.display = container.children.length > 0 ? 'block' : 'none';
  }
}

/**
 * Individual Panel Class
 */
class CyberpunkPanel {
  constructor(options) {
    this.id = options.id || `panel-${Date.now()}`;
    this.title = options.title || 'Panel';
    this.system = options.system;
    
    this.position = options.position || { x: 50, y: 50 };
    this.size = options.size || { width: 400, height: 300 };
    this.state = options.state || 'normal';
    this.isDocked = options.isDocked || false;
    this.dockZone = options.dockZone || null;
    
    this.content = options.content || '';
    this.tabs = options.tabs || [];
    this.activeTab = options.activeTab || 0;
    
    this.enableDrag = options.enableDrag !== false;
    this.enableResize = options.enableResize !== false;
    this.enableTabs = options.enableTabs !== false;
    
    this.dragOffset = { x: 0, y: 0 };
    this.isResizing = false;
    
    this.createElement();
    this.setupEventListeners();
    this.applyState();
  }
  
  createElement() {
    const panel = document.createElement('div');
    panel.className = 'panel floating';
    panel.id = this.id;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', this.title);
    
    // Set initial position immediately
    panel.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    panel.style.width = `${this.size.width}px`;
    panel.style.height = `${this.size.height}px`;
    
    // Header
    const header = document.createElement('div');
    header.className = 'panel-header';
    if (!this.enableDrag) header.classList.add('no-drag');
    
    const title = document.createElement('h3');
    title.className = 'panel-title';
    title.textContent = this.title;
    
    const controls = document.createElement('div');
    controls.className = 'panel-controls';
    
    // Control buttons
    const buttons = [
      { class: 'minimize', label: 'Minimize', handler: () => this.minimize() },
      { class: 'maximize', label: 'Maximize', handler: () => this.maximize() },
      { class: 'close', label: 'Close', handler: () => this.close() }
    ];
    
    if (this.system.config.enableDocking) {
      buttons.unshift({
        class: this.isDocked ? 'float' : 'dock',
        label: this.isDocked ? 'Float' : 'Dock',
        handler: () => this.toggleDock()
      });
    }
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.className = `panel-control ${btn.class}`;
      button.setAttribute('aria-label', btn.label);
      button.addEventListener('click', btn.handler);
      // Don't add textContent - CSS handles it with ::before
      controls.appendChild(button);
    });
    
    header.appendChild(title);
    header.appendChild(controls);
    
    // Tabs
    let tabsElement = null;
    if (this.enableTabs && this.tabs.length > 0) {
      tabsElement = this.createTabs();
    }
    
    // Content
    const content = document.createElement('div');
    content.className = 'panel-content';
    
    if (this.tabs.length > 0) {
      this.tabs.forEach((tab, index) => {
        const tabContent = document.createElement('div');
        tabContent.className = `tab-content ${index === this.activeTab ? 'active' : ''}`;
        tabContent.innerHTML = tab.content || '';
        content.appendChild(tabContent);
      });
    } else if (this.content) {
      content.innerHTML = this.content;
    }
    
    // Resize handles
    if (this.enableResize) {
      const handles = ['right', 'bottom', 'corner'];
      handles.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${pos}`;
        handle.dataset.position = pos;
        panel.appendChild(handle);
      });
    }
    
    // Assemble panel
    panel.appendChild(header);
    if (tabsElement) panel.appendChild(tabsElement);
    panel.appendChild(content);
    
    this.element = panel;
    this.headerElement = header;
    this.contentElement = content;
  }
  
  createTabs() {
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'panel-tabs';
    
    this.tabs.forEach((tab, index) => {
      const tabButton = document.createElement('button');
      tabButton.className = `panel-tab ${index === this.activeTab ? 'active' : ''}`;
      tabButton.textContent = tab.title;
      tabButton.addEventListener('click', () => this.switchTab(index));
      tabsContainer.appendChild(tabButton);
    });
    
    return tabsContainer;
  }
  
  setupEventListeners() {
    // Drag handling
    if (this.enableDrag) {
      this.headerElement.addEventListener('mousedown', this.handleDragStart.bind(this));
      this.headerElement.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    }
    
    // Resize handling
    if (this.enableResize) {
      this.element.querySelectorAll('.resize-handle').forEach(handle => {
        handle.addEventListener('mousedown', this.handleResizeStart.bind(this));
        handle.addEventListener('touchstart', this.handleResizeTouchStart.bind(this), { passive: false });
      });
    }
    
    // Focus handling
    this.element.addEventListener('mousedown', () => this.focus());
    this.element.addEventListener('touchstart', () => this.focus());
  }
  
  handleDragStart(e) {
    if (this.isDocked || this.state === 'maximized') return;
    if (e.target.closest('.panel-control')) return;
    
    e.preventDefault();
    
    const rect = this.element.getBoundingClientRect();
    this.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    this.element.classList.add('dragging');
    this.system.draggedPanel = this;
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
  }
  
  handleTouchStart(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.handleDragStart({
        clientX: touch.clientX,
        clientY: touch.clientY,
        target: e.target,
        preventDefault: () => e.preventDefault()
      });
    }
  }
  
  handleDragMove(x, y) {
    if (this.isDocked) return;
    
    this.position = {
      x: x - this.dragOffset.x,
      y: y - this.dragOffset.y
    };
    
    this.updatePosition();
  }
  
  handleDragEnd() {
    this.element.classList.remove('dragging');
    this.system.saveLayout();
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  }
  
  handleResizeStart(e) {
    if (this.state === 'maximized') return;
    
    e.preventDefault();
    this.isResizing = true;
    this.resizeHandle = e.target.dataset.position;
    
    const rect = this.element.getBoundingClientRect();
    this.resizeStart = {
      width: rect.width,
      height: rect.height,
      x: e.clientX,
      y: e.clientY
    };
    
    document.addEventListener('mousemove', this.handleResizeMove.bind(this));
    document.addEventListener('mouseup', this.handleResizeEnd.bind(this));
  }
  
  handleResizeTouchStart(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.handleResizeStart({
        clientX: touch.clientX,
        clientY: touch.clientY,
        target: e.target,
        preventDefault: () => e.preventDefault()
      });
      
      document.addEventListener('touchmove', this.handleResizeTouchMove.bind(this), { passive: false });
      document.addEventListener('touchend', this.handleResizeTouchEnd.bind(this));
    }
  }
  
  handleResizeMove(e) {
    if (!this.isResizing) return;
    
    const deltaX = e.clientX - this.resizeStart.x;
    const deltaY = e.clientY - this.resizeStart.y;
    
    if (this.resizeHandle.includes('right') || this.resizeHandle === 'corner') {
      this.size.width = Math.max(200, this.resizeStart.width + deltaX);
    }
    
    if (this.resizeHandle.includes('bottom') || this.resizeHandle === 'corner') {
      this.size.height = Math.max(150, this.resizeStart.height + deltaY);
    }
    
    this.updateSize();
  }
  
  handleResizeTouchMove(e) {
    if (e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleResizeMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }
  
  handleResizeEnd() {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
    this.system.saveLayout();
  }
  
  handleResizeTouchEnd() {
    this.handleResizeEnd();
    document.removeEventListener('touchmove', this.handleResizeTouchMove);
    document.removeEventListener('touchend', this.handleResizeTouchEnd);
  }
  
  // Panel methods
  
  minimize() {
    this.state = this.state === 'minimized' ? 'normal' : 'minimized';
    this.applyState();
    this.system.saveLayout();
    this.system.updateMinimizedBar();
  }
  
  maximize() {
    this.state = this.state === 'maximized' ? 'normal' : 'maximized';
    this.applyState();
    this.system.saveLayout();
  }
  
  close() {
    this.system.removePanel(this.id);
  }
  
  toggleDock() {
    if (this.isDocked) {
      this.undock();
    } else {
      this.dock('bottom');
    }
  }
  
  dock(zone) {
    this.isDocked = true;
    this.dockZone = zone;
    this.element.classList.add('docked');
    this.element.classList.remove('floating');
    this.applyState();
    this.system.saveLayout();
  }
  
  undock() {
    this.isDocked = false;
    this.dockZone = null;
    this.element.classList.remove('docked');
    this.element.classList.add('floating');
    this.applyState();
    this.system.saveLayout();
  }
  
  focus() {
    this.system.setActivePanel(this);
  }
  
  switchTab(index) {
    if (index < 0 || index >= this.tabs.length) return;
    
    this.activeTab = index;
    
    // Update tab buttons
    this.element.querySelectorAll('.panel-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });
    
    // Update tab content
    this.element.querySelectorAll('.tab-content').forEach((content, i) => {
      content.classList.toggle('active', i === index);
    });
    
    this.system.saveLayout();
  }
  
  updatePosition() {
    if (!this.isDocked) {
      this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
  }
  
  updateSize() {
    if (!this.isDocked && this.state !== 'maximized') {
      this.element.style.width = `${this.size.width}px`;
      this.element.style.height = `${this.size.height}px`;
    }
  }
  
  applyState() {
    this.element.classList.toggle('minimized', this.state === 'minimized');
    this.element.classList.toggle('maximized', this.state === 'maximized');
    this.element.classList.toggle('docked', this.isDocked);
    this.element.classList.toggle('floating', !this.isDocked);
    
    if (!this.isDocked) {
      this.updatePosition();
      this.updateSize();
    }
  }
  
  getContentData() {
    // Override in subclasses to save specific content data
    return {};
  }
  
  destroy() {
    this.element.remove();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EnhancedPanelSystem, CyberpunkPanel };
}