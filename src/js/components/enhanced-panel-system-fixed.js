/**
 * Enhanced Panel System for Cyberpunk GM Screen - FIXED VERSION
 * Fixes: z-index management, minimize animations, position persistence
 */

class EnhancedPanelSystem {
  constructor(options = {}) {
    this.container = options.container || document.querySelector('.panel-container');
    this.panels = new Map();
    this.activePanel = null;
    this.draggedPanel = null;
    this.minimizedPanels = new Map(); // Store position/size when minimized
    this.baseZIndex = 1000; // Start panels at z-index 1000
    
    // Mobile detection
    this.isMobile = window.innerWidth <= 768;
    this.mobileActivePanel = null;
    
    this.config = {
      enableDrag: options.enableDrag !== false,
      enableResize: options.enableResize !== false,
      enableTabs: options.enableTabs !== false,
      persistLayout: options.persistLayout !== false,
      ...options
    };
    
    this.init();
  }
  
  init() {
    
    // Load saved layout
    if (this.config.persistLayout) {
      this.loadLayout();
    }
    
    // Global event listeners
    this.setupGlobalListeners();
    
    // Fix container z-index to ensure panels appear above background
    if (this.container) {
      this.container.style.position = 'relative';
      this.container.style.zIndex = '100';
    }
    
    // Initialize mobile interface
    if (this.isMobile) {
      this.initializeMobileInterface();
    }
    
    // Handle resize events
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      
      if (wasMobile !== this.isMobile) {
        if (this.isMobile) {
          this.initializeMobileInterface();
        } else {
          this.cleanupMobileInterface();
        }
      }
    });
  }
  
  createPanel(options) {
    // Ensure panel position is within viewport
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
    const footerHeight = document.getElementById('appFooter')?.offsetHeight || 50;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust position if not provided or out of bounds
    if (options.position) {
      const maxX = viewportWidth - (options.size?.width || 400) - 20;
      const maxY = viewportHeight - (options.size?.height || 300) - footerHeight - 20;
      
      options.position.x = Math.max(20, Math.min(options.position.x, maxX));
      options.position.y = Math.max(headerHeight, Math.min(options.position.y, maxY));
    } else {
      // Default position that's safely within bounds
      options.position = {
        x: 50 + (this.panels.size * 30), // Offset each new panel
        y: headerHeight + 20
      };
    }
    
    const panel = new CyberpunkPanel({
      ...options,
      system: this,
      enableDrag: this.config.enableDrag,
      enableResize: this.config.enableResize,
      enableTabs: this.config.enableTabs
    });
    
    this.panels.set(panel.id, panel);
    this.container.appendChild(panel.element);
    
    // Set initial z-index with proper layering
    const currentPanelCount = this.panels.size;
    panel.element.style.zIndex = this.baseZIndex + currentPanelCount;
    
    // Handle mobile interface
    if (this.isMobile) {
      this.addMobileTab(panel);
      this.setMobileActivePanel(panel);
    } else {
      this.setActivePanel(panel);
    }
    
    // Save layout after adding
    if (this.config.persistLayout) {
      this.saveLayout();
    }
    
    return panel;
  }
  
  removePanel(panelId) {
    const panel = this.panels.get(panelId);
    if (panel) {
      // Clean up minimized state if exists
      this.minimizedPanels.delete(panelId);
      
      // Remove mobile tab if on mobile
      if (this.isMobile) {
        this.removeMobileTab(panelId);
      }
      
      panel.destroy();
      this.panels.delete(panelId);
      this.saveLayout();
      this.updateMinimizedBar();
    }
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
        }
      });
    }
  }
  
  handleGlobalMouseUp(e) {
    if (this.draggedPanel) {
      this.draggedPanel.handleDragEnd();
      this.draggedPanel = null;
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
    
    // Esc to close/minimize active panel
    if (e.key === 'Escape' && this.activePanel) {
      if (this.isMobile) {
        // On mobile, go back to panel list
        this.mobileActivePanel = null;
        this.panels.forEach(p => p.element.classList.remove('mobile-active'));
      } else {
        this.activePanel.minimize();
      }
    }
    
    // Ctrl/Cmd + Arrow keys to move active panel
    if ((e.ctrlKey || e.metaKey) && this.activePanel && !this.isMobile) {
      const step = e.shiftKey ? 50 : 10; // Shift for larger steps
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.activePanel.position.x = Math.max(0, this.activePanel.position.x - step);
          this.activePanel.updatePosition();
          this.saveLayout();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.activePanel.position.x = Math.min(
            window.innerWidth - this.activePanel.size.width,
            this.activePanel.position.x + step
          );
          this.activePanel.updatePosition();
          this.saveLayout();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
          this.activePanel.position.y = Math.max(headerHeight, this.activePanel.position.y - step);
          this.activePanel.updatePosition();
          this.saveLayout();
          break;
        case 'ArrowDown':
          e.preventDefault();
          const footerHeight = document.getElementById('appFooter')?.offsetHeight || 50;
          this.activePanel.position.y = Math.min(
            window.innerHeight - this.activePanel.size.height - footerHeight,
            this.activePanel.position.y + step
          );
          this.activePanel.updatePosition();
          this.saveLayout();
          break;
      }
    }
    
    // Tab key to focus panel content
    if (e.key === 'Tab' && !e.altKey && this.activePanel) {
      // Let browser handle tab navigation within panel
    }
    
    // Number keys 1-9 to quick switch panels
    if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      const panels = Array.from(this.panels.values());
      if (index < panels.length) {
        if (this.isMobile) {
          this.setMobileActivePanel(panels[index]);
        } else {
          this.setActivePanel(panels[index]);
          panels[index].focus();
        }
      }
    }
  }
  
  
  dockPanel(panel, zone) {
    panel.dock(zone);
    this.saveLayout();
  }
  
  cyclePanel(direction = 1) {
    const panelArray = Array.from(this.panels.values()).filter(p => p.state !== 'minimized');
    if (panelArray.length === 0) return;
    
    let currentIndex = -1;
    if (this.activePanel && this.activePanel.state !== 'minimized') {
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
    
    // Bring to front if not minimized
    if (panel.state !== 'minimized') {
      this.bringToFront(panel);
    }
  }
  
  cyclePanel(direction = 1) {
    const panels = Array.from(this.panels.values()).filter(p => p.state !== 'minimized');
    if (panels.length === 0) return;
    
    let currentIndex = panels.findIndex(p => p === this.activePanel);
    if (currentIndex === -1) currentIndex = 0;
    
    let newIndex = currentIndex + direction;
    
    // Wrap around
    if (newIndex < 0) newIndex = panels.length - 1;
    if (newIndex >= panels.length) newIndex = 0;
    
    if (this.isMobile) {
      this.setMobileActivePanel(panels[newIndex]);
    } else {
      this.setActivePanel(panels[newIndex]);
      panels[newIndex].focus();
    }
  }
  
  bringToFront(panel) {
    // Get all non-minimized panels
    const floatingPanels = Array.from(this.panels.values())
      .filter(p => p.state !== 'minimized');
    
    // Find the highest z-index
    const maxZ = Math.max(
      ...floatingPanels.map(p => parseInt(p.element.style.zIndex || this.baseZIndex)),
      this.baseZIndex
    );
    
    // Set the panel to be above all others
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
        activeTab: panel.activeTab,
        content: panel.content,
        contentData: panel.getContentData(),
        // Save pre-minimize state
        preMinimizeState: this.minimizedPanels.get(panel.id) || null
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
        const panel = this.createPanel(panelData);
        // Restore minimized state data
        if (panelData.preMinimizeState) {
          this.minimizedPanels.set(panel.id, panelData.preMinimizeState);
        }
      });
    } catch (e) {
      console.error('Failed to load panel layout:', e);
    }
  }
  
  resetLayout() {
    this.panels.forEach(panel => panel.destroy());
    this.panels.clear();
    this.minimizedPanels.clear();
    localStorage.removeItem('cyberpunk-panel-layout');
    this.updateMinimizedBar();
  }
  
  fitAllToScreen() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
    const footerHeight = document.getElementById('appFooter')?.offsetHeight || 50;
    const padding = 20;
    
    // Filter only non-minimized panels
    const panelArray = Array.from(this.panels.values())
      .filter(p => p.state !== 'minimized');
    
    if (panelArray.length === 0) return;
    
    // Calculate available space
    const availableWidth = viewportWidth - (padding * 2);
    const availableHeight = viewportHeight - headerHeight - footerHeight - (padding * 2);
    
    // Calculate grid layout
    const cols = Math.ceil(Math.sqrt(panelArray.length));
    const rows = Math.ceil(panelArray.length / cols);
    
    const panelWidth = Math.floor((availableWidth - padding * (cols - 1)) / cols);
    const panelHeight = Math.floor((availableHeight - padding * (rows - 1)) / rows);
    
    panelArray.forEach((panel, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      panel.position = {
        x: padding + col * (panelWidth + padding),
        y: headerHeight + padding + row * (panelHeight + padding)
      };
      
      panel.size = {
        width: Math.min(panelWidth, 800), // Max width to prevent panels from being too wide
        height: Math.min(panelHeight, 600) // Max height to prevent panels from being too tall
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
    this.panels.forEach(panel => {
      if (panel.state !== 'minimized') {
        panel.minimize();
      }
    });
    this.updateMinimizedBar();
  }
  
  updateMinimizedBar() {
    const bar = document.getElementById('minimizedPanelBar');
    const container = document.getElementById('minimizedPanels');
    
    if (!bar || !container) return;
    
    container.innerHTML = '';
    
    this.panels.forEach(panel => {
      if (panel.state === 'minimized') {
        const btn = document.createElement('button');
        btn.className = 'minimized-panel-btn';
        btn.textContent = panel.title;
        btn.onclick = () => {
          panel.restore();
          this.updateMinimizedBar();
        };
        container.appendChild(btn);
      }
    });
    
    bar.style.display = container.children.length > 0 ? 'block' : 'none';
  }
  
  // Store panel state before minimizing
  storeMinimizedState(panelId, state) {
    this.minimizedPanels.set(panelId, state);
  }
  
  // Get stored minimized state
  getMinimizedState(panelId) {
    return this.minimizedPanels.get(panelId);
  }
  
  // Clear minimized state
  clearMinimizedState(panelId) {
    this.minimizedPanels.delete(panelId);
  }
  
  // Mobile Interface Methods
  initializeMobileInterface() {
    const mobileTabs = document.getElementById('mobilePanelTabs');
    if (!mobileTabs) return;
    
    // Clear existing tabs
    mobileTabs.innerHTML = '';
    
    // Update existing panels
    this.panels.forEach(panel => {
      this.addMobileTab(panel);
    });
    
    // Show first panel if any exist
    if (this.panels.size > 0) {
      const firstPanel = Array.from(this.panels.values())[0];
      this.setMobileActivePanel(firstPanel);
    }
    
    // Add swipe gesture support
    this.setupMobileSwipeGestures();
  }
  
  cleanupMobileInterface() {
    const mobileTabs = document.getElementById('mobilePanelTabs');
    if (mobileTabs) {
      mobileTabs.innerHTML = '';
    }
    
    // Show all panels in desktop mode
    this.panels.forEach(panel => {
      panel.element.classList.remove('mobile-active');
      panel.element.style.display = '';
    });
  }
  
  addMobileTab(panel) {
    if (!this.isMobile) return;
    
    const mobileTabs = document.getElementById('mobilePanelTabs');
    if (!mobileTabs) return;
    
    const tab = document.createElement('button');
    tab.className = 'mobile-panel-tab';
    tab.dataset.panelId = panel.id;
    
    // Determine icon based on panel title
    let icon = '📄';
    if (panel.title.includes('Dice')) icon = '🎲';
    else if (panel.title.includes('Combat')) icon = '⚔️';
    else if (panel.title.includes('Notes')) icon = '📝';
    else if (panel.title.includes('Debug')) icon = '🔧';
    else if (panel.title.includes('NPC')) icon = '👥';
    else if (panel.title.includes('Rules')) icon = '📖';
    
    tab.innerHTML = `
      <span class="icon">${icon}</span>
      <span>${panel.title}</span>
    `;
    
    tab.addEventListener('click', () => {
      this.setMobileActivePanel(panel);
    });
    
    mobileTabs.appendChild(tab);
    
    // If this is the first panel, make it active
    if (this.panels.size === 1) {
      this.setMobileActivePanel(panel);
    }
  }
  
  removeMobileTab(panelId) {
    if (!this.isMobile) return;
    
    const mobileTabs = document.getElementById('mobilePanelTabs');
    if (!mobileTabs) return;
    
    const tab = mobileTabs.querySelector(`[data-panel-id="${panelId}"]`);
    if (tab) {
      tab.remove();
    }
    
    // If removed panel was active, activate another
    if (this.mobileActivePanel && this.mobileActivePanel.id === panelId) {
      const remainingPanels = Array.from(this.panels.values());
      if (remainingPanels.length > 0) {
        this.setMobileActivePanel(remainingPanels[0]);
      } else {
        this.mobileActivePanel = null;
      }
    }
  }
  
  setMobileActivePanel(panel) {
    if (!this.isMobile || !panel) return;
    
    // Hide all panels
    this.panels.forEach(p => {
      p.element.classList.remove('mobile-active');
    });
    
    // Show selected panel
    panel.element.classList.add('mobile-active');
    this.mobileActivePanel = panel;
    
    // Update tab states
    const mobileTabs = document.getElementById('mobilePanelTabs');
    if (mobileTabs) {
      mobileTabs.querySelectorAll('.mobile-panel-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.panelId === panel.id);
      });
    }
  }
  
  setupMobileSwipeGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleMobileSwipe();
    }, { passive: true });
    
    const handleMobileSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) < swipeThreshold) return;
      
      const panels = Array.from(this.panels.values());
      const currentIndex = panels.findIndex(p => p === this.mobileActivePanel);
      
      if (diff > 0 && currentIndex < panels.length - 1) {
        // Swipe left - next panel
        this.setMobileActivePanel(panels[currentIndex + 1]);
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous panel
        this.setMobileActivePanel(panels[currentIndex - 1]);
      }
    };
    
    this.handleMobileSwipe = handleMobileSwipe;
  }
}

/**
 * Individual Panel Class - FIXED VERSION
 */
class CyberpunkPanel {
  constructor(options) {
    this.id = options.id || `panel-${Date.now()}`;
    this.title = options.title || 'Panel';
    this.system = options.system;
    
    this.position = options.position || { x: 50, y: 50 };
    this.size = options.size || { width: 400, height: 300 };
    this.state = options.state || 'normal';
    
    this.content = options.content || '';
    this.tabs = options.tabs || [];
    this.activeTab = options.activeTab || 0;
    
    // Disable drag and resize on mobile
    const isMobile = window.innerWidth <= 768;
    this.enableDrag = !isMobile && options.enableDrag !== false;
    this.enableResize = !isMobile && options.enableResize !== false;
    this.enableTabs = options.enableTabs !== false;
    
    this.dragOffset = { x: 0, y: 0 };
    this.isResizing = false;
    
    // Animation state
    this.isAnimating = false;
    
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
    
    // Set initial position and size
    panel.style.position = 'absolute';
    panel.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    panel.style.width = `${this.size.width}px`;
    panel.style.height = `${this.size.height}px`;
    panel.style.transition = 'none'; // Disable transition initially
    
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
    
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.className = `panel-control ${btn.class}`;
      button.setAttribute('aria-label', btn.label);
      button.addEventListener('click', btn.handler);
      controls.appendChild(button);
    });
    
    header.appendChild(title);
    header.appendChild(controls);
    
    // Tabs
    let tabsElement = null;
    if (this.enableTabs && this.tabs.length > 0) {
      tabsElement = this.createTabs();
    }
    
    // Content wrapper for smooth animations
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'panel-content-wrapper';
    
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
    
    contentWrapper.appendChild(content);
    
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
    panel.appendChild(contentWrapper);
    
    this.element = panel;
    this.headerElement = header;
    this.contentElement = content;
    this.contentWrapper = contentWrapper;
    
    // Enable transitions after creation
    setTimeout(() => {
      panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 50);
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
    if (this.state === 'maximized' || this.state === 'minimized') return;
    if (e.target.closest('.panel-control')) return;
    
    e.preventDefault();
    
    // Get the current transform position
    const transform = this.element.style.transform;
    const match = transform.match(/translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/);
    const currentX = match ? parseFloat(match[1]) : this.position.x;
    const currentY = match ? parseFloat(match[2]) : this.position.y;
    
    // Calculate offset from where the mouse clicked to the panel's current position
    this.dragOffset = {
      x: e.clientX - currentX,
      y: e.clientY - currentY
    };
    
    // Disable transitions during drag
    this.element.style.transition = 'none';
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
    if (this.state === 'minimized') return;
    
    // Get browser boundaries
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
    const footerHeight = document.getElementById('appFooter')?.offsetHeight || 50;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate new position
    let newX = x - this.dragOffset.x;
    let newY = y - this.dragOffset.y;
    
    // Constrain to viewport - allow panels to touch header but not go under it
    const sideMargin = 10;
    newX = Math.max(sideMargin, Math.min(newX, viewportWidth - this.size.width - sideMargin));
    newY = Math.max(headerHeight, Math.min(newY, viewportHeight - this.size.height - footerHeight));
    
    this.position = {
      x: newX,
      y: newY
    };
    
    this.updatePosition();
  }
  
  handleDragEnd() {
    this.element.classList.remove('dragging');
    // Re-enable transitions
    this.element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    this.system.saveLayout();
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  }
  
  handleResizeStart(e) {
    if (this.state === 'maximized' || this.state === 'minimized') return;
    
    e.preventDefault();
    this.isResizing = true;
    this.resizeHandle = e.target.dataset.position;
    
    // Disable transitions during resize
    this.element.style.transition = 'none';
    
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
    
    // Get viewport constraints
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
    const footerHeight = document.getElementById('appFooter')?.offsetHeight || 50;
    const panelRect = this.element.getBoundingClientRect();
    
    if (this.resizeHandle.includes('right') || this.resizeHandle === 'corner') {
      // Constrain width to viewport minus panel position
      const maxWidth = viewportWidth - panelRect.left - 20;
      this.size.width = Math.max(200, Math.min(this.resizeStart.width + deltaX, maxWidth));
    }
    
    if (this.resizeHandle.includes('bottom') || this.resizeHandle === 'corner') {
      // Constrain height to viewport minus panel position and header/footer
      const maxHeight = viewportHeight - panelRect.top - footerHeight - 20;
      this.size.height = Math.max(150, Math.min(this.resizeStart.height + deltaY, maxHeight));
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
    // Re-enable transitions
    this.element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
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
    if (this.state === 'minimized') {
      this.restore();
    } else {
      // Store current state before minimizing
      this.system.storeMinimizedState(this.id, {
        position: { ...this.position },
        size: { ...this.size },
        previousState: this.state
      });
      
      this.state = 'minimized';
      this.applyState();
      this.system.saveLayout();
      this.system.updateMinimizedBar();
    }
  }
  
  restore() {
    if (this.state !== 'minimized') return;
    
    // Restore previous state
    const savedState = this.system.getMinimizedState(this.id);
    if (savedState) {
      this.position = savedState.position;
      this.size = savedState.size;
      this.state = savedState.previousState || 'normal';
      this.system.clearMinimizedState(this.id);
    } else {
      this.state = 'normal';
    }
    
    this.applyState();
    this.updatePosition();
    this.updateSize();
    this.system.saveLayout();
    this.system.updateMinimizedBar();
    
    // Bring to front when restored
    this.focus();
  }
  
  maximize() {
    this.state = this.state === 'maximized' ? 'normal' : 'maximized';
    this.applyState();
    this.system.saveLayout();
  }
  
  close() {
    // Add fade out animation
    this.element.style.opacity = '0';
    this.element.style.transform += ' scale(0.9)';
    
    setTimeout(() => {
      this.system.removePanel(this.id);
    }, 300);
  }
  
  
  focus() {
    if (this.state !== 'minimized') {
      this.system.setActivePanel(this);
    }
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
    if (this.state !== 'minimized') {
      this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
  }
  
  updateSize() {
    if (this.state !== 'maximized' && this.state !== 'minimized') {
      this.element.style.width = `${this.size.width}px`;
      this.element.style.height = `${this.size.height}px`;
    }
  }
  
  applyState() {
    // Remove all state classes
    this.element.classList.remove('minimized', 'maximized', 'normal');
    
    // Add current state class
    this.element.classList.add(this.state);
    
    // Always floating
    this.element.classList.add('floating');
    
    // Handle minimized state
    if (this.state === 'minimized') {
      this.element.style.transform = 'translate(-9999px, -9999px)';
      this.element.style.opacity = '0';
    } else {
      this.element.style.opacity = '1';
      this.updatePosition();
      this.updateSize();
    }
    
    // Handle maximized state
    if (this.state === 'maximized') {
      this.element.style.zIndex = '9000'; // Below header (10000) but above other panels
      
      // Set proper maximized dimensions respecting header/footer
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
      const footerHeight = document.getElementById('appFooter')?.offsetHeight || 50;
      
      this.element.style.top = headerHeight + 'px';
      this.element.style.left = '0';
      this.element.style.width = '100vw';
      this.element.style.height = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
      this.element.style.transform = 'none';
    }
  }
  
  getContentData() {
    // Save content state based on panel type
    const data = {};
    
    // Check for dice roller
    const diceRoller = this.element.querySelector('.dice-roller-enhanced');
    if (diceRoller && window.CyberpunkDiceRoller) {
      data.type = 'dice-roller';
      data.history = localStorage.getItem('cyberpunk-dice-history');
    }
    
    // Check for combat tracker
    const combatTracker = this.element.querySelector('.combat-tracker-advanced');
    if (combatTracker && window.CyberpunkCombatTracker) {
      data.type = 'combat-tracker';
      data.combatData = localStorage.getItem('cyberpunk-combat-tracker');
    }
    
    // Check for notes
    const notesArea = this.element.querySelector('#notesArea');
    if (notesArea) {
      data.type = 'notes';
      data.content = notesArea.value;
    }
    
    // Check for debug panel
    const debugPanel = this.element.querySelector('[id^="debug-panel-"]');
    if (debugPanel) {
      data.type = 'debug';
      // Debug panel state is mostly UI, no critical data to save
    }
    
    return data;
  }
  
  destroy() {
    // Fade out before removing
    this.element.style.opacity = '0';
    this.element.style.transform += ' scale(0.9)';
    
    setTimeout(() => {
      this.element.remove();
    }, 300);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EnhancedPanelSystem, CyberpunkPanel };
}