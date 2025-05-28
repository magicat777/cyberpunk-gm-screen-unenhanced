/**
 * Performance Optimizer
 * Optimizes app performance for mobile devices and large datasets
 */

class PerformanceOptimizer {
  constructor() {
    this.config = {
      enableLazyLoading: true,
      enableVirtualScrolling: true,
      enableDebouncing: true,
      enableThrottling: true,
      maxHistoryItems: 100,
      maxPanelsOpen: 10,
      animationThreshold: 5,
      lowMemoryThreshold: 50 * 1024 * 1024, // 50MB
      criticalMemoryThreshold: 100 * 1024 * 1024 // 100MB
    };
    
    this.observers = new Map();
    this.rafCallbacks = new Map();
    this.performanceMode = this.detectPerformanceMode();
    
    this.init();
  }
  
  init() {
    // Monitor performance
    this.startPerformanceMonitoring();
    
    // Setup intersection observers for lazy loading
    this.setupLazyLoading();
    
    // Optimize animations based on device
    this.optimizeAnimations();
    
    // Setup memory monitoring
    this.monitorMemoryUsage();
    
    // Apply initial optimizations
    this.applyOptimizations();
  }
  
  /**
   * Detect optimal performance mode based on device
   */
  detectPerformanceMode() {
    const factors = {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      lowMemory: navigator.deviceMemory && navigator.deviceMemory < 4,
      slowConnection: navigator.connection && navigator.connection.effectiveType && 
        ['slow-2g', '2g'].includes(navigator.connection.effectiveType),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      batteryLow: false
    };
    
    // Check battery status if available
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        factors.batteryLow = battery.level < 0.2 && !battery.charging;
        this.updatePerformanceMode(factors);
      });
    }
    
    return this.calculatePerformanceMode(factors);
  }
  
  calculatePerformanceMode(factors) {
    const score = Object.values(factors).filter(Boolean).length;
    
    if (score >= 3) return 'low';
    if (score >= 1) return 'medium';
    return 'high';
  }
  
  updatePerformanceMode(factors) {
    const newMode = this.calculatePerformanceMode(factors);
    if (newMode !== this.performanceMode) {
      this.performanceMode = newMode;
      this.applyOptimizations();
      
      // Notify user of performance mode change
      PanelUtils.showNotification(
        `Performance mode: ${newMode.toUpperCase()}`,
        'info'
      );
    }
  }
  
  /**
   * Apply optimizations based on performance mode
   */
  applyOptimizations() {
    const optimizations = {
      low: {
        animations: false,
        shadows: false,
        glowEffects: false,
        backgroundEffects: false,
        maxPanels: 3,
        historyLimit: 20,
        autoSaveInterval: 60000 // 1 minute
      },
      medium: {
        animations: 'simple',
        shadows: true,
        glowEffects: false,
        backgroundEffects: 'simple',
        maxPanels: 6,
        historyLimit: 50,
        autoSaveInterval: 30000 // 30 seconds
      },
      high: {
        animations: true,
        shadows: true,
        glowEffects: true,
        backgroundEffects: true,
        maxPanels: 10,
        historyLimit: 100,
        autoSaveInterval: 10000 // 10 seconds
      }
    };
    
    const settings = optimizations[this.performanceMode];
    
    // Apply CSS optimizations
    document.documentElement.classList.remove('perf-low', 'perf-medium', 'perf-high');
    document.documentElement.classList.add(`perf-${this.performanceMode}`);
    
    // Update config
    Object.assign(this.config, settings);
    
    // Apply background optimizations
    if (window.background) {
      window.background.setPerformance(this.performanceMode);
    }
    
    // Trigger optimization events
    window.dispatchEvent(new CustomEvent('performance-mode-changed', {
      detail: { mode: this.performanceMode, settings }
    }));
  }
  
  /**
   * Setup lazy loading for panels and images
   */
  setupLazyLoading() {
    if (!this.config.enableLazyLoading) return;
    
    // Create intersection observer for lazy loading
    const lazyLoadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            // Load panel content
            if (element.classList.contains('panel-lazy')) {
              this.loadPanelContent(element);
              lazyLoadObserver.unobserve(element);
            }
            
            // Load images
            if (element.tagName === 'IMG' && element.dataset.src) {
              element.src = element.dataset.src;
              delete element.dataset.src;
              lazyLoadObserver.unobserve(element);
            }
          }
        });
      },
      {
        rootMargin: '50px'
      }
    );
    
    this.observers.set('lazyLoad', lazyLoadObserver);
  }
  
  /**
   * Load panel content on demand
   */
  loadPanelContent(panelElement) {
    const panelId = panelElement.dataset.panelId;
    const panelType = panelElement.dataset.panelType;
    
    // Show loading state
    PanelUtils.showLoading(panelElement, 'Loading panel...');
    
    // Load content based on type
    requestAnimationFrame(() => {
      switch (panelType) {
        case 'dice-roller':
          new CyberpunkDiceRoller(panelElement);
          break;
        case 'combat-tracker':
          new CyberpunkCombatTracker(panelElement);
          break;
        case 'npc-generator':
          new NPCGenerator(panelElement);
          break;
        // Add other panel types
      }
    });
  }
  
  /**
   * Optimize animations based on performance
   */
  optimizeAnimations() {
    // Reduce animation complexity for low-end devices
    if (this.performanceMode === 'low') {
      // Add CSS to disable animations
      const style = document.createElement('style');
      style.id = 'perf-animations';
      style.textContent = `
        .perf-low * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
        
        .perf-low .cyberpunk-background,
        .perf-low .glitch-effect,
        .perf-low .neon-glow {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Use will-change for better GPU acceleration
    document.querySelectorAll('.panel').forEach(panel => {
      panel.style.willChange = 'transform';
    });
  }
  
  /**
   * Monitor memory usage and trigger cleanup
   */
  monitorMemoryUsage() {
    if (!performance.memory) return;
    
    setInterval(() => {
      const memoryUsage = performance.memory.usedJSHeapSize;
      
      if (memoryUsage > this.config.criticalMemoryThreshold) {
        this.performCriticalCleanup();
      } else if (memoryUsage > this.config.lowMemoryThreshold) {
        this.performCleanup();
      }
    }, 30000); // Check every 30 seconds
  }
  
  /**
   * Perform memory cleanup
   */
  performCleanup() {
    console.log('🧹 Performing memory cleanup...');
    
    // Trim history
    this.trimHistory();
    
    // Clear unused panel content
    this.clearInactivePanels();
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }
  
  /**
   * Perform critical memory cleanup
   */
  performCriticalCleanup() {
    console.warn('⚠️ Critical memory usage detected!');
    
    // Aggressive cleanup
    this.performCleanup();
    
    // Close non-essential panels
    this.closeNonEssentialPanels();
    
    // Switch to low performance mode
    this.performanceMode = 'low';
    this.applyOptimizations();
    
    // Notify user
    PanelUtils.showNotification(
      'Low memory: Some features disabled',
      'warning'
    );
  }
  
  /**
   * Trim history data to configured limits
   */
  trimHistory() {
    // Trim dice history
    try {
      const diceHistory = localStorage.getItem('cyberpunk-dice-history');
      if (diceHistory) {
        const history = JSON.parse(diceHistory);
        if (Array.isArray(history) && history.length > this.config.historyLimit) {
          history.splice(this.config.historyLimit);
          localStorage.setItem('cyberpunk-dice-history', JSON.stringify(history));
        }
      }
    } catch (e) {
      console.error('Failed to trim dice history:', e);
    }
    
    // Trim combat log
    document.querySelectorAll('.combat-log .log-entry').forEach((entry, index) => {
      if (index >= this.config.historyLimit) {
        entry.remove();
      }
    });
  }
  
  /**
   * Clear content from inactive panels
   */
  clearInactivePanels() {
    if (!window.panelSystem) return;
    
    const panels = Array.from(window.panelSystem.panels.values());
    panels.forEach(panel => {
      if (panel.state === 'minimized' && panel.content) {
        // Store content state
        panel.contentState = this.serializePanelContent(panel);
        
        // Clear heavy content
        const heavyElements = panel.content.querySelectorAll(
          'canvas, video, iframe, .history-list, .log-entries'
        );
        heavyElements.forEach(el => el.remove());
      }
    });
  }
  
  /**
   * Close non-essential panels
   */
  closeNonEssentialPanels() {
    if (!window.panelSystem) return;
    
    const panels = Array.from(window.panelSystem.panels.values());
    const openPanels = panels.filter(p => p.state !== 'minimized');
    
    if (openPanels.length > this.config.maxPanels) {
      // Keep only the most recently used panels
      openPanels
        .sort((a, b) => (a.lastInteraction || 0) - (b.lastInteraction || 0))
        .slice(0, openPanels.length - this.config.maxPanels)
        .forEach(panel => panel.minimize());
    }
  }
  
  /**
   * Optimize scroll performance with virtual scrolling
   */
  createVirtualScroller(container, items, itemHeight = 30) {
    if (!this.config.enableVirtualScrolling) return;
    
    const visibleHeight = container.clientHeight;
    const totalHeight = items.length * itemHeight;
    const visibleItems = Math.ceil(visibleHeight / itemHeight) + 2; // Buffer
    
    // Create spacer
    const spacer = document.createElement('div');
    spacer.style.height = totalHeight + 'px';
    
    // Create content container
    const content = document.createElement('div');
    content.style.position = 'absolute';
    content.style.top = '0';
    content.style.left = '0';
    content.style.right = '0';
    
    container.style.position = 'relative';
    container.style.overflow = 'auto';
    container.innerHTML = '';
    container.appendChild(spacer);
    container.appendChild(content);
    
    const updateVisibleItems = () => {
      const scrollTop = container.scrollTop;
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleItems, items.length);
      
      // Clear and render visible items
      content.innerHTML = '';
      content.style.transform = `translateY(${startIndex * itemHeight}px)`;
      
      for (let i = startIndex; i < endIndex; i++) {
        const itemElement = this.renderItem(items[i], i);
        content.appendChild(itemElement);
      }
    };
    
    // Throttled scroll handler
    const throttledUpdate = this.throttle(updateVisibleItems, 16);
    container.addEventListener('scroll', throttledUpdate);
    
    // Initial render
    updateVisibleItems();
    
    return {
      update: updateVisibleItems,
      destroy: () => container.removeEventListener('scroll', throttledUpdate)
    };
  }
  
  /**
   * Performance monitoring
   */
  startPerformanceMonitoring() {
    // Monitor FPS
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
        
        // Adjust performance if FPS is low
        if (fps < 30 && this.performanceMode !== 'low') {
          console.warn(`Low FPS detected: ${fps}`);
          this.downgradePerformance();
        }
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry);
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }
  
  /**
   * Downgrade performance mode
   */
  downgradePerformance() {
    if (this.performanceMode === 'high') {
      this.performanceMode = 'medium';
    } else if (this.performanceMode === 'medium') {
      this.performanceMode = 'low';
    }
    
    this.applyOptimizations();
  }
  
  /**
   * Utility functions
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  /**
   * Request idle callback polyfill
   */
  requestIdleCallback(callback) {
    if ('requestIdleCallback' in window) {
      return window.requestIdleCallback(callback);
    }
    
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => 50
      });
    }, 1);
  }
  
  /**
   * Serialize panel content for later restoration
   */
  serializePanelContent(panel) {
    // Implementation depends on panel type
    return {
      type: panel.dataset.panelType,
      state: {} // Panel-specific state
    };
  }
  
  /**
   * Get current performance stats
   */
  getStats() {
    return {
      mode: this.performanceMode,
      memory: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
      } : 'N/A',
      panels: window.panelSystem ? window.panelSystem.panels.size : 0,
      animations: this.config.animations
    };
  }
}

// Initialize and export
window.performanceOptimizer = new PerformanceOptimizer();

// Add performance CSS
if (!document.querySelector('#performance-styles')) {
  const style = document.createElement('style');
  style.id = 'performance-styles';
  style.textContent = `
    /* Low performance mode optimizations */
    .perf-low .panel {
      box-shadow: none !important;
    }
    
    .perf-low .neon-glow,
    .perf-low .scanning-line,
    .perf-low .glitch-effect {
      display: none !important;
    }
    
    /* Medium performance mode */
    .perf-medium .panel {
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    
    /* Reduce paint areas */
    .panel-content {
      contain: layout style paint;
    }
    
    /* GPU acceleration for transforms */
    .panel,
    .minimized-panel {
      transform: translateZ(0);
      backface-visibility: hidden;
    }
  `;
  document.head.appendChild(style);
}