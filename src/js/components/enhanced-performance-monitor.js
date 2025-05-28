class EnhancedPerformanceMonitor {
  constructor() {
    this.isEnabled = this.loadEnabled();
    this.metrics = {
      fps: [],
      frameTime: [],
      memoryUsage: [],
      renderTime: [],
      scriptTime: [],
      panelCount: 0,
      componentCount: 0
    };
    
    this.thresholds = {
      lowFPS: 30,
      highFrameTime: 33.33, // 30 FPS = ~33ms per frame
      memoryWarning: 100 * 1024 * 1024, // 100MB
      renderTimeWarning: 16.67 // 60 FPS = ~16.67ms per frame
    };
    
    this.optimizations = {
      deferredUpdates: true,
      throttledEvents: true,
      memoizedCalculations: true,
      virtualScrolling: false,
      reducedAnimations: false
    };
    
    this.observers = new Map();
    this.animationFrameId = null;
    this.performanceEntries = [];
    this.lastFrameTime = performance.now();
    
    this.init();
  }

  init() {
    if (!this.isEnabled) return;

    this.setupPerformanceObserver();
    this.startFPSMonitoring();
    this.setupMemoryMonitoring();
    this.setupMutationObserver();
    this.attachEventOptimizations();
    
    console.log('Enhanced Performance Monitor initialized');
  }

  setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      // Observe navigation and resource timing
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordPerformanceEntry(entry);
        });
      });

      navObserver.observe({ entryTypes: ['navigation', 'resource'] });
      this.observers.set('navigation', navObserver);

      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
          if (entry.name === 'largest-contentful-paint') {
            this.metrics.largestContentfulPaint = entry.startTime;
          }
        });
      });

      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.set('paint', paintObserver);

      // Observe layout shifts
      const layoutObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            this.metrics.cumulativeLayoutShift = 
              (this.metrics.cumulativeLayoutShift || 0) + entry.value;
          }
        });
      });

      layoutObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('layout', layoutObserver);

    } catch (error) {
      console.warn('Failed to setup performance observer:', error);
    }
  }

  startFPSMonitoring() {
    const measureFPS = (currentTime) => {
      const frameTime = currentTime - this.lastFrameTime;
      const fps = 1000 / frameTime;
      
      this.metrics.fps.push(fps);
      this.metrics.frameTime.push(frameTime);
      
      // Keep only last 100 measurements
      if (this.metrics.fps.length > 100) {
        this.metrics.fps.shift();
        this.metrics.frameTime.shift();
      }
      
      // Check for performance issues
      if (fps < this.thresholds.lowFPS) {
        this.handleLowFPS(fps);
      }
      
      if (frameTime > this.thresholds.highFrameTime) {
        this.handleHighFrameTime(frameTime);
      }
      
      this.lastFrameTime = currentTime;
      this.animationFrameId = requestAnimationFrame(measureFPS);
    };
    
    this.animationFrameId = requestAnimationFrame(measureFPS);
  }

  setupMemoryMonitoring() {
    if (!('memory' in performance)) {
      console.warn('Memory monitoring not supported');
      return;
    }

    const checkMemory = () => {
      const memory = performance.memory;
      const memoryInfo = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };
      
      this.metrics.memoryUsage.push(memoryInfo);
      
      // Keep only last 50 measurements
      if (this.metrics.memoryUsage.length > 50) {
        this.metrics.memoryUsage.shift();
      }
      
      // Check for memory warnings
      if (memoryInfo.used > this.thresholds.memoryWarning) {
        this.handleHighMemoryUsage(memoryInfo);
      }
    };
    
    // Check memory every 5 seconds
    setInterval(checkMemory, 5000);
    checkMemory(); // Initial check
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      let addedNodes = 0;
      let removedNodes = 0;
      
      mutations.forEach(mutation => {
        addedNodes += mutation.addedNodes.length;
        removedNodes += mutation.removedNodes.length;
        
        // Count panels and components
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList?.contains('panel')) {
              this.metrics.panelCount++;
            }
            if (node.tagName?.includes('-')) { // Custom elements
              this.metrics.componentCount++;
            }
          }
        });
        
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList?.contains('panel')) {
              this.metrics.panelCount--;
            }
            if (node.tagName?.includes('-')) {
              this.metrics.componentCount--;
            }
          }
        });
      });
      
      if (addedNodes > 10 || removedNodes > 10) {
        this.handleDOMChurn(addedNodes, removedNodes);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    this.observers.set('mutation', observer);
  }

  attachEventOptimizations() {
    if (!this.optimizations.throttledEvents) return;

    // Throttle resize events
    let resizeTimeout;
    const originalResize = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
      if (type === 'resize' && typeof listener === 'function') {
        const throttledListener = function(event) {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => listener(event), 100);
        };
        return originalResize.call(this, type, throttledListener, options);
      }
      return originalResize.call(this, type, listener, options);
    };

    // Throttle scroll events
    let scrollTimeout;
    document.addEventListener('scroll', (event) => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Optimized scroll handling
        this.handleOptimizedScroll(event);
      }, 16); // ~60fps
    }, { passive: true });

    // Debounce input events
    document.addEventListener('input', this.debounce((event) => {
      // Optimized input handling
      this.handleOptimizedInput(event);
    }, 300), { passive: true });
  }

  // Performance issue handlers
  handleLowFPS(fps) {
    console.warn(`Low FPS detected: ${fps.toFixed(2)}`);
    
    if (!this.optimizations.reducedAnimations) {
      this.enableReducedAnimations();
    }
    
    this.dispatchPerformanceEvent('low-fps', { fps });
  }

  handleHighFrameTime(frameTime) {
    console.warn(`High frame time detected: ${frameTime.toFixed(2)}ms`);
    
    if (!this.optimizations.deferredUpdates) {
      this.enableDeferredUpdates();
    }
    
    this.dispatchPerformanceEvent('high-frame-time', { frameTime });
  }

  handleHighMemoryUsage(memoryInfo) {
    console.warn(`High memory usage detected: ${(memoryInfo.used / 1024 / 1024).toFixed(2)}MB`);
    
    // Trigger garbage collection hint
    if ('gc' in window && typeof window.gc === 'function') {
      window.gc();
    }
    
    this.dispatchPerformanceEvent('high-memory', memoryInfo);
  }

  handleDOMChurn(added, removed) {
    console.warn(`High DOM churn detected: +${added}, -${removed} nodes`);
    
    if (!this.optimizations.virtualScrolling && this.metrics.componentCount > 50) {
      this.suggestVirtualScrolling();
    }
    
    this.dispatchPerformanceEvent('dom-churn', { added, removed });
  }

  // Optimization implementations
  enableReducedAnimations() {
    this.optimizations.reducedAnimations = true;
    
    // Add CSS class to reduce animations
    document.documentElement.classList.add('reduced-motion');
    
    // Override animation durations
    const style = document.createElement('style');
    style.textContent = `
      .reduced-motion *,
      .reduced-motion *::before,
      .reduced-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log('Reduced animations enabled for better performance');
  }

  enableDeferredUpdates() {
    this.optimizations.deferredUpdates = true;
    
    // Batch DOM updates
    let updateQueue = [];
    let updateScheduled = false;
    
    const flushUpdates = () => {
      updateQueue.forEach(update => update());
      updateQueue = [];
      updateScheduled = false;
    };
    
    window.deferUpdate = (updateFn) => {
      updateQueue.push(updateFn);
      if (!updateScheduled) {
        updateScheduled = true;
        requestIdleCallback ? 
          requestIdleCallback(flushUpdates) : 
          setTimeout(flushUpdates, 0);
      }
    };
    
    console.log('Deferred updates enabled for better performance');
  }

  suggestVirtualScrolling() {
    console.log('Consider implementing virtual scrolling for better performance with many components');
    this.dispatchPerformanceEvent('suggest-virtual-scrolling', {
      componentCount: this.metrics.componentCount
    });
  }

  // Utility functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

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

  handleOptimizedScroll(event) {
    // Optimize scroll performance
    const scrollTop = event.target.scrollTop || document.documentElement.scrollTop;
    
    // Only process scroll events that matter
    if (Math.abs(scrollTop - (this.lastScrollTop || 0)) < 5) {
      return; // Ignore small scroll changes
    }
    
    this.lastScrollTop = scrollTop;
  }

  handleOptimizedInput(event) {
    // Optimize input performance
    const target = event.target;
    
    // Defer expensive operations
    if (window.deferUpdate) {
      window.deferUpdate(() => {
        // Process input changes
        this.processInputChange(target);
      });
    }
  }

  processInputChange(target) {
    // Placeholder for input processing optimization
    console.log('Processing optimized input change');
  }

  recordPerformanceEntry(entry) {
    this.performanceEntries.push({
      name: entry.name,
      type: entry.entryType,
      startTime: entry.startTime,
      duration: entry.duration,
      timestamp: Date.now()
    });
    
    // Keep only last 200 entries
    if (this.performanceEntries.length > 200) {
      this.performanceEntries.shift();
    }
  }

  dispatchPerformanceEvent(type, detail) {
    const event = new CustomEvent('performance-issue', {
      detail: { type, ...detail }
    });
    document.dispatchEvent(event);
  }

  // Public API
  getMetrics() {
    const avgFPS = this.metrics.fps.length > 0 ? 
      this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length : 0;
    
    const avgFrameTime = this.metrics.frameTime.length > 0 ? 
      this.metrics.frameTime.reduce((a, b) => a + b, 0) / this.metrics.frameTime.length : 0;
    
    const latestMemory = this.metrics.memoryUsage.length > 0 ? 
      this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1] : null;
    
    return {
      fps: {
        current: this.metrics.fps.length > 0 ? this.metrics.fps[this.metrics.fps.length - 1] : 0,
        average: avgFPS,
        min: Math.min(...this.metrics.fps),
        max: Math.max(...this.metrics.fps)
      },
      frameTime: {
        current: this.metrics.frameTime.length > 0 ? this.metrics.frameTime[this.metrics.frameTime.length - 1] : 0,
        average: avgFrameTime
      },
      memory: latestMemory,
      panels: this.metrics.panelCount,
      components: this.metrics.componentCount,
      optimizations: this.optimizations,
      performance: {
        firstContentfulPaint: this.metrics.firstContentfulPaint,
        largestContentfulPaint: this.metrics.largestContentfulPaint,
        cumulativeLayoutShift: this.metrics.cumulativeLayoutShift
      }
    };
  }

  getPerformanceReport() {
    const metrics = this.getMetrics();
    const issues = this.identifyPerformanceIssues(metrics);
    const recommendations = this.generateRecommendations(issues);
    
    return {
      timestamp: Date.now(),
      metrics,
      issues,
      recommendations,
      score: this.calculatePerformanceScore(metrics, issues)
    };
  }

  identifyPerformanceIssues(metrics) {
    const issues = [];
    
    if (metrics.fps.average < this.thresholds.lowFPS) {
      issues.push({
        type: 'low-fps',
        severity: 'high',
        description: `Average FPS (${metrics.fps.average.toFixed(2)}) is below threshold (${this.thresholds.lowFPS})`
      });
    }
    
    if (metrics.frameTime.average > this.thresholds.highFrameTime) {
      issues.push({
        type: 'high-frame-time',
        severity: 'medium',
        description: `Average frame time (${metrics.frameTime.average.toFixed(2)}ms) is above threshold (${this.thresholds.highFrameTime}ms)`
      });
    }
    
    if (metrics.memory && metrics.memory.used > this.thresholds.memoryWarning) {
      issues.push({
        type: 'high-memory',
        severity: 'medium',
        description: `Memory usage (${(metrics.memory.used / 1024 / 1024).toFixed(2)}MB) is high`
      });
    }
    
    if (metrics.panels > 10) {
      issues.push({
        type: 'too-many-panels',
        severity: 'low',
        description: `High number of panels (${metrics.panels}) may impact performance`
      });
    }
    
    if (metrics.components > 100) {
      issues.push({
        type: 'too-many-components',
        severity: 'medium',
        description: `High number of components (${metrics.components}) may impact performance`
      });
    }
    
    return issues;
  }

  generateRecommendations(issues) {
    const recommendations = [];
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'low-fps':
          recommendations.push('Enable reduced animations and defer non-critical updates');
          break;
        case 'high-frame-time':
          recommendations.push('Consider breaking large operations into smaller chunks');
          break;
        case 'high-memory':
          recommendations.push('Close unused panels and clear old data');
          break;
        case 'too-many-panels':
          recommendations.push('Consider closing some panels to improve performance');
          break;
        case 'too-many-components':
          recommendations.push('Consider virtual scrolling for large lists');
          break;
      }
    });
    
    return [...new Set(recommendations)]; // Remove duplicates
  }

  calculatePerformanceScore(metrics, issues) {
    let score = 100;
    
    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 30;
          break;
        case 'medium':
          score -= 20;
          break;
        case 'low':
          score -= 10;
          break;
      }
    });
    
    // Bonus points for good metrics
    if (metrics.fps.average >= 60) score += 10;
    if (metrics.frameTime.average <= 16.67) score += 10;
    
    return Math.max(0, Math.min(100, score));
  }

  // Settings and controls
  setEnabled(enabled) {
    this.isEnabled = enabled;
    this.saveEnabled();
    
    if (enabled) {
      this.init();
    } else {
      this.cleanup();
    }
  }

  cleanup() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  // Storage methods
  loadEnabled() {
    try {
      return localStorage.getItem('cyberpunk-performance-enabled') !== 'false';
    } catch {
      return true;
    }
  }

  saveEnabled() {
    localStorage.setItem('cyberpunk-performance-enabled', this.isEnabled.toString());
  }

  // UI for performance monitoring
  createPerformancePanel() {
    const metrics = this.getMetrics();
    const report = this.getPerformanceReport();
    
    return `
      <div class="performance-monitor" style="padding: 20px; font-family: var(--font-mono); background: var(--bg-surface);">
        <h3 style="color: var(--primary); margin-bottom: 15px;">Performance Monitor</h3>
        
        <div class="performance-metrics" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
          <div class="metric-card" style="background: var(--bg-tertiary); padding: 15px; border: 1px solid var(--border-color);">
            <div class="metric-title" style="color: var(--text-secondary); font-size: 12px; margin-bottom: 5px;">FPS</div>
            <div class="metric-value" style="color: var(--primary); font-size: 24px; font-weight: bold;">
              ${metrics.fps.current.toFixed(1)}
            </div>
            <div class="metric-detail" style="color: var(--text-tertiary); font-size: 10px;">
              Avg: ${metrics.fps.average.toFixed(1)} | Min: ${metrics.fps.min.toFixed(1)} | Max: ${metrics.fps.max.toFixed(1)}
            </div>
          </div>
          
          <div class="metric-card" style="background: var(--bg-tertiary); padding: 15px; border: 1px solid var(--border-color);">
            <div class="metric-title" style="color: var(--text-secondary); font-size: 12px; margin-bottom: 5px;">Frame Time</div>
            <div class="metric-value" style="color: var(--accent); font-size: 24px; font-weight: bold;">
              ${metrics.frameTime.current.toFixed(1)}ms
            </div>
            <div class="metric-detail" style="color: var(--text-tertiary); font-size: 10px;">
              Avg: ${metrics.frameTime.average.toFixed(1)}ms
            </div>
          </div>
          
          <div class="metric-card" style="background: var(--bg-tertiary); padding: 15px; border: 1px solid var(--border-color);">
            <div class="metric-title" style="color: var(--text-secondary); font-size: 12px; margin-bottom: 5px;">Memory</div>
            <div class="metric-value" style="color: var(--secondary); font-size: 24px; font-weight: bold;">
              ${metrics.memory ? (metrics.memory.used / 1024 / 1024).toFixed(1) : 'N/A'}MB
            </div>
            <div class="metric-detail" style="color: var(--text-tertiary); font-size: 10px;">
              ${metrics.memory ? `Total: ${(metrics.memory.total / 1024 / 1024).toFixed(1)}MB` : 'Not available'}
            </div>
          </div>
          
          <div class="metric-card" style="background: var(--bg-tertiary); padding: 15px; border: 1px solid var(--border-color);">
            <div class="metric-title" style="color: var(--text-secondary); font-size: 12px; margin-bottom: 5px;">Components</div>
            <div class="metric-value" style="color: var(--text-primary); font-size: 24px; font-weight: bold;">
              ${metrics.panels}/${metrics.components}
            </div>
            <div class="metric-detail" style="color: var(--text-tertiary); font-size: 10px;">
              Panels/Components
            </div>
          </div>
        </div>
        
        <div class="performance-score" style="text-align: center; margin-bottom: 20px;">
          <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 5px;">Performance Score</div>
          <div style="color: ${report.score >= 80 ? 'var(--success)' : report.score >= 60 ? 'var(--warning)' : 'var(--error)'}; font-size: 36px; font-weight: bold;">
            ${report.score}
          </div>
        </div>
        
        ${report.issues.length > 0 ? `
          <div class="performance-issues" style="margin-bottom: 20px;">
            <h4 style="color: var(--error); margin-bottom: 10px;">Performance Issues</h4>
            ${report.issues.map(issue => `
              <div class="issue-item" style="background: var(--bg-quaternary); padding: 10px; margin-bottom: 5px; border-left: 3px solid var(--error);">
                <div style="font-weight: bold; color: var(--error);">${issue.type.toUpperCase()}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">${issue.description}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${report.recommendations.length > 0 ? `
          <div class="performance-recommendations" style="margin-bottom: 20px;">
            <h4 style="color: var(--accent); margin-bottom: 10px;">Recommendations</h4>
            ${report.recommendations.map(rec => `
              <div class="recommendation-item" style="background: var(--bg-quaternary); padding: 8px; margin-bottom: 3px; border-left: 3px solid var(--accent); font-size: 12px;">
                ${rec}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="performance-controls">
          <h4 style="color: var(--text-secondary); margin-bottom: 10px;">Optimizations</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <label style="display: flex; align-items: center; gap: 5px; font-size: 12px;">
              <input type="checkbox" ${this.optimizations.reducedAnimations ? 'checked' : ''} class="opt-reduced-animations">
              Reduced Animations
            </label>
            <label style="display: flex; align-items: center; gap: 5px; font-size: 12px;">
              <input type="checkbox" ${this.optimizations.deferredUpdates ? 'checked' : ''} class="opt-deferred-updates">
              Deferred Updates
            </label>
            <label style="display: flex; align-items: center; gap: 5px; font-size: 12px;">
              <input type="checkbox" ${this.optimizations.throttledEvents ? 'checked' : ''} class="opt-throttled-events">
              Throttled Events
            </label>
            <label style="display: flex; align-items: center; gap: 5px; font-size: 12px;">
              <input type="checkbox" ${this.isEnabled ? 'checked' : ''} class="opt-monitoring-enabled">
              Enable Monitoring
            </label>
          </div>
        </div>
      </div>
    `;
  }

  attachPerformancePanelListeners(container) {
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const className = e.target.className;
        const isChecked = e.target.checked;
        
        switch (className) {
          case 'opt-reduced-animations':
            if (isChecked && !this.optimizations.reducedAnimations) {
              this.enableReducedAnimations();
            }
            break;
          case 'opt-deferred-updates':
            if (isChecked && !this.optimizations.deferredUpdates) {
              this.enableDeferredUpdates();
            }
            break;
          case 'opt-throttled-events':
            this.optimizations.throttledEvents = isChecked;
            break;
          case 'opt-monitoring-enabled':
            this.setEnabled(isChecked);
            break;
        }
      });
    });
  }
}

// Initialize global performance monitor
window.performanceMonitor = new EnhancedPerformanceMonitor();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedPerformanceMonitor;
} else {
  window.EnhancedPerformanceMonitor = EnhancedPerformanceMonitor;
}