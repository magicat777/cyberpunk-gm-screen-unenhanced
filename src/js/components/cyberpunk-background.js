/**
 * Cyberpunk Animated Background Controller
 * Manages animated background effects with performance optimization
 */

class CyberpunkBackground {
  constructor(options = {}) {
    console.log('🎮 CyberpunkBackground: Initializing with options:', options);
    this.container = options.container || document.body;
    this.config = {
      circuits: options.circuits !== false,
      rain: options.rain || false,
      neonPulse: options.neonPulse !== false,
      glitch: options.glitch || false,
      performance: options.performance || 'auto',
      nodes: options.nodes || 20
    };
    
    this.elements = {};
    this.animations = [];
    this.isLowPerformance = false;
    
    console.log('🎮 CyberpunkBackground: Config:', this.config);
    this.init();
  }
  
  init() {
    console.log('🎮 CyberpunkBackground: Starting init()');
    
    // Check performance
    this.detectPerformance();
    console.log('🎮 CyberpunkBackground: Performance mode:', this.isLowPerformance ? 'LOW' : 'HIGH');
    
    // Create background container
    this.createContainer();
    console.log('🎮 CyberpunkBackground: Container created');
    
    // Initialize effects based on config
    if (this.config.circuits) {
      console.log('🎮 CyberpunkBackground: Creating circuit pattern');
      this.createCircuitPattern();
    }
    if (this.config.neonPulse && !this.isLowPerformance) {
      console.log('🎮 CyberpunkBackground: Creating neon pulses');
      this.createNeonPulses();
    }
    if (this.config.rain && !this.isLowPerformance) {
      console.log('🎮 CyberpunkBackground: Creating rain effect');
      this.createRainEffect();
    }
    if (this.config.glitch && !this.isLowPerformance) {
      console.log('🎮 CyberpunkBackground: Creating glitch effect');
      this.createGlitchEffect();
    }
    
    // Skip creating controls - removed per user request
    console.log('🎮 CyberpunkBackground: Skipping controls creation');
    
    // Start animations
    this.startAnimations();
    console.log('🎮 CyberpunkBackground: Animations started');
  }
  
  detectPerformance() {
    if (this.config.performance === 'low') {
      this.isLowPerformance = true;
      return;
    }
    
    if (this.config.performance === 'auto') {
      // Simple performance detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEndDevice = navigator.hardwareConcurrency <= 2;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      this.isLowPerformance = isMobile || isLowEndDevice || prefersReducedMotion;
    }
  }
  
  createContainer() {
    const bg = document.createElement('div');
    bg.className = 'cyberpunk-bg';
    if (this.isLowPerformance) bg.classList.add('low-performance');
    
    this.elements.background = bg;
    this.container.insertBefore(bg, this.container.firstChild);
    
    console.log('🎮 CyberpunkBackground: Background element:', this.elements.background);
    console.log('🎮 CyberpunkBackground: Parent container:', this.container);
  }
  
  createCircuitPattern() {
    // Circuit grid
    const circuit = document.createElement('div');
    circuit.className = 'circuit-pattern';
    this.elements.circuit = circuit;
    this.elements.background.appendChild(circuit);
    
    // Circuit nodes
    const nodesContainer = document.createElement('div');
    nodesContainer.className = 'circuit-nodes';
    
    for (let i = 0; i < this.config.nodes; i++) {
      const node = document.createElement('div');
      node.className = 'circuit-node';
      node.style.left = `${Math.random() * 100}%`;
      node.style.top = `${Math.random() * 100}%`;
      node.style.animationDelay = `${Math.random() * 2}s`;
      nodesContainer.appendChild(node);
    }
    
    this.elements.nodes = nodesContainer;
    this.elements.background.appendChild(nodesContainer);
  }
  
  createNeonPulses() {
    const pulses = ['cyan', 'magenta'];
    
    pulses.forEach(color => {
      const pulse = document.createElement('div');
      pulse.className = `neon-pulse ${color}`;
      
      // Random starting position
      pulse.style.left = `${Math.random() * 100}%`;
      pulse.style.top = `${Math.random() * 100}%`;
      
      this.elements[`pulse-${color}`] = pulse;
      this.elements.background.appendChild(pulse);
    });
  }
  
  createRainEffect() {
    console.log('🎮 CyberpunkBackground: Creating rain effect...');
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-effect active'; // Add active class immediately
    
    // Create rain drops
    const dropCount = 50;
    for (let i = 0; i < dropCount; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDelay = `${Math.random() * 2}s`;
      drop.style.animationDuration = `${0.5 + Math.random() * 1}s`;
      rainContainer.appendChild(drop);
    }
    
    this.elements.rain = rainContainer;
    this.elements.background.appendChild(rainContainer);
    console.log('🎮 CyberpunkBackground: Rain effect created with', dropCount, 'drops');
    console.log('🎮 CyberpunkBackground: Rain container:', this.elements.rain);
    console.log('🎮 CyberpunkBackground: Background element children:', this.elements.background.children);
  }
  
  createGlitchEffect() {
    const glitchContainer = document.createElement('div');
    glitchContainer.className = 'glitch-lines';
    
    // Create glitch lines
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('div');
      line.className = 'glitch-line';
      line.style.top = `${Math.random() * 100}%`;
      line.style.height = `${1 + Math.random() * 3}px`;
      glitchContainer.appendChild(line);
    }
    
    this.elements.glitch = glitchContainer;
    this.elements.background.appendChild(glitchContainer);
    
    // Randomly trigger glitch effect
    this.glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        this.triggerGlitch();
      }
    }, 3000);
  }
  
  triggerGlitch() {
    if (this.elements.glitch) {
      this.elements.glitch.style.opacity = '1';
      setTimeout(() => {
        this.elements.glitch.style.opacity = '0';
      }, 200);
    }
  }
  
  // Controls removed - no longer needed
  /*
  createControls() {
    const controls = document.createElement('div');
    controls.className = 'bg-controls';
    
    const effects = [
      { name: 'rain', label: 'Rain' },
      { name: 'glitch', label: 'Glitch' },
      { name: 'performance', label: 'Low Perf' }
    ];
    
    effects.forEach(effect => {
      const btn = document.createElement('button');
      btn.className = 'bg-control-btn';
      btn.textContent = effect.label;
      btn.dataset.effect = effect.name;
      
      if (effect.name === 'rain' && this.config.rain) btn.classList.add('active');
      if (effect.name === 'glitch' && this.config.glitch) btn.classList.add('active');
      if (effect.name === 'performance' && this.isLowPerformance) btn.classList.add('active');
      
      btn.addEventListener('click', () => this.toggleEffect(effect.name));
      controls.appendChild(btn);
    });
    
    this.elements.controls = controls;
    document.body.appendChild(controls);
  }
  */
  
  toggleEffect(effect) {
    console.log(`🎮 CyberpunkBackground: Toggling ${effect}`);
    
    switch (effect) {
      case 'rain':
        this.config.rain = !this.config.rain;
        console.log(`🎮 CyberpunkBackground: Rain is now ${this.config.rain ? 'ON' : 'OFF'}`);
        
        if (this.config.rain) {
          if (!this.elements.rain) {
            console.log('🎮 CyberpunkBackground: Creating rain effect...');
            this.createRainEffect();
          }
          if (this.elements.rain) {
            this.elements.rain.style.display = 'block';
            this.elements.rain.classList.add('active');
            console.log('🎮 CyberpunkBackground: Rain activated');
          }
        } else if (this.elements.rain) {
          this.elements.rain.style.display = 'none';
          this.elements.rain.classList.remove('active');
          console.log('🎮 CyberpunkBackground: Rain deactivated');
        }
        break;
        
      case 'glitch':
        this.config.glitch = !this.config.glitch;
        if (this.config.glitch) {
          if (!this.elements.glitch) {
            this.createGlitchEffect();
          } else {
            this.elements.glitch.style.display = 'block';
            // Restart glitch interval
            this.glitchInterval = setInterval(() => {
              if (Math.random() < 0.1) {
                this.triggerGlitch();
              }
            }, 2000);
          }
        } else if (this.elements.glitch) {
          clearInterval(this.glitchInterval);
          this.elements.glitch.style.display = 'none';
        }
        break;
        
      case 'performance':
        this.isLowPerformance = !this.isLowPerformance;
        this.elements.background.classList.toggle('low-performance', this.isLowPerformance);
        break;
    }
    
    // Update button state (only if controls exist - they've been removed)
    if (this.elements.controls) {
      const btn = this.elements.controls.querySelector(`[data-effect="${effect}"]`);
      if (btn) btn.classList.toggle('active');
    }
  }
  
  startAnimations() {
    // Start rain if enabled
    if (this.config.rain && this.elements.rain) {
      this.elements.rain.classList.add('active');
    }
  }
  
  destroy() {
    // Clean up intervals
    if (this.glitchInterval) clearInterval(this.glitchInterval);
    
    // Remove elements
    if (this.elements.background) this.elements.background.remove();
    if (this.elements.controls) this.elements.controls.remove();
    
    // Clear references
    this.elements = {};
    this.animations = [];
  }
  
  // Public methods
  setPerformanceMode(mode) {
    this.config.performance = mode;
    this.detectPerformance();
    this.elements.background.classList.toggle('low-performance', this.isLowPerformance);
  }
  
  addCustomEffect(effectFunction) {
    const customEffect = effectFunction(this.elements.background);
    this.animations.push(customEffect);
  }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if user wants background (from localStorage)
  const bgEnabled = localStorage.getItem('cyberpunk-bg-enabled') !== 'false';
  
  if (bgEnabled) {
    window.cyberpunkBg = new CyberpunkBackground({
      circuits: true,
      rain: false,
      neonPulse: true,
      glitch: false,
      performance: 'auto'
    });
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CyberpunkBackground;
}