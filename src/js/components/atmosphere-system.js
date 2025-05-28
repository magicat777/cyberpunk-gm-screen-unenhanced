/**
 * Immersive Audio-Visual Atmosphere System
 * Creates dynamic cyberpunk ambience with visuals and sound
 */

class AtmosphereSystem {
  constructor() {
    this.isActive = this.loadPreference('atmosphere-enabled', true);
    this.currentScene = 'night-city';
    this.audioContext = null;
    this.visualEffects = new Map();
    this.audioNodes = new Map();
    this.animationFrameId = null;
    
    this.scenes = {
      'night-city': {
        name: 'Night City Streets',
        ambience: ['rain', 'traffic', 'neon-hum'],
        visuals: ['rain-effect', 'neon-flicker', 'fog'],
        music: 'cyberpunk-ambient'
      },
      'combat-zone': {
        name: 'Combat Zone',
        ambience: ['distant-gunfire', 'sirens', 'static'],
        visuals: ['red-alert', 'smoke', 'sparks'],
        music: 'intense-combat'
      },
      'corporate-office': {
        name: 'Corporate Office',
        ambience: ['air-conditioning', 'typing', 'elevator'],
        visuals: ['hologram-ads', 'clean-lights', 'data-streams'],
        music: 'corporate-muzak'
      },
      'netspace': {
        name: 'Cyberspace',
        ambience: ['digital-noise', 'data-flow', 'glitch'],
        visuals: ['matrix-rain', 'wireframe', 'data-particles'],
        music: 'electronic-pulse'
      },
      'underground-bar': {
        name: 'Underground Bar',
        ambience: ['crowd-chatter', 'glasses-clink', 'bass-thump'],
        visuals: ['smoke-effect', 'strobe-lights', 'holo-dancers'],
        music: 'chrome-rock'
      }
    };
    
    this.init();
  }
  
  async init() {
    if (!this.isActive) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.setupAudioNodes();
      this.setupVisualCanvas();
      this.loadScene(this.currentScene);
    } catch (error) {
      console.warn('Failed to initialize atmosphere system:', error);
    }
  }
  
  setupAudioNodes() {
    // Master gain
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.audioContext.destination);
    
    // Reverb for space
    this.convolver = this.audioContext.createConvolver();
    this.convolver.connect(this.masterGain);
    
    // Filters for atmosphere
    this.lowpassFilter = this.audioContext.createBiquadFilter();
    this.lowpassFilter.type = 'lowpass';
    this.lowpassFilter.frequency.value = 2000;
    this.lowpassFilter.connect(this.convolver);
    
    // Create reverb impulse
    this.createReverbImpulse();
  }
  
  createReverbImpulse() {
    const length = this.audioContext.sampleRate * 2;
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    this.convolver.buffer = impulse;
  }
  
  setupVisualCanvas() {
    // Create full-screen canvas for effects
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'atmosphere-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.3;
      mix-blend-mode: screen;
    `;
    
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    
    document.body.appendChild(this.canvas);
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  // Scene Management
  loadScene(sceneName) {
    const scene = this.scenes[sceneName];
    if (!scene) return;
    
    this.currentScene = sceneName;
    this.clearEffects();
    
    // Start ambient sounds
    scene.ambience.forEach(sound => {
      this.startAmbientSound(sound);
    });
    
    // Start visual effects
    scene.visuals.forEach(effect => {
      this.startVisualEffect(effect);
    });
    
    // Start background music
    if (scene.music) {
      this.startBackgroundMusic(scene.music);
    }
    
    // Start animation loop
    this.startAnimationLoop();
  }
  
  // Audio Effects
  startAmbientSound(soundType) {
    let node;
    
    switch (soundType) {
      case 'rain':
        node = this.createRainSound();
        break;
      case 'traffic':
        node = this.createTrafficSound();
        break;
      case 'neon-hum':
        node = this.createNeonHumSound();
        break;
      case 'distant-gunfire':
        node = this.createGunfireSound();
        break;
      case 'sirens':
        node = this.createSirenSound();
        break;
      case 'digital-noise':
        node = this.createDigitalNoiseSound();
        break;
      case 'crowd-chatter':
        node = this.createCrowdSound();
        break;
      default:
        return;
    }
    
    if (node) {
      this.audioNodes.set(soundType, node);
    }
  }
  
  createRainSound() {
    const bufferSize = 4096;
    const whiteNoise = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
    
    whiteNoise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 0.05 - 0.025;
      }
    };
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;
    
    const gain = this.audioContext.createGain();
    gain.gain.value = 0.2;
    
    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.lowpassFilter);
    
    return { whiteNoise, filter, gain };
  }
  
  createNeonHumSound() {
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 60; // 60Hz hum
    
    const gain = this.audioContext.createGain();
    gain.gain.value = 0.05;
    
    // Add slight variation
    const lfo = this.audioContext.createOscillator();
    lfo.frequency.value = 0.5;
    const lfoGain = this.audioContext.createGain();
    lfoGain.gain.value = 2;
    
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    
    oscillator.connect(gain);
    gain.connect(this.lowpassFilter);
    
    oscillator.start();
    lfo.start();
    
    return { oscillator, gain, lfo };
  }
  
  createDigitalNoiseSound() {
    const bufferSize = 2048;
    const processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
    
    processor.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Digital artifacts
        if (Math.random() < 0.01) {
          output[i] = Math.random() < 0.5 ? -0.5 : 0.5;
        } else {
          output[i] = (Math.random() - 0.5) * 0.02;
        }
      }
    };
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    const gain = this.audioContext.createGain();
    gain.gain.value = 0.15;
    
    processor.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    return { processor, filter, gain };
  }
  
  // Visual Effects
  startVisualEffect(effectType) {
    let effect;
    
    switch (effectType) {
      case 'rain-effect':
        effect = new RainEffect(this.ctx, this.canvas);
        break;
      case 'neon-flicker':
        effect = new NeonFlickerEffect(this.ctx, this.canvas);
        break;
      case 'matrix-rain':
        effect = new MatrixRainEffect(this.ctx, this.canvas);
        break;
      case 'smoke-effect':
        effect = new SmokeEffect(this.ctx, this.canvas);
        break;
      case 'data-particles':
        effect = new DataParticleEffect(this.ctx, this.canvas);
        break;
      default:
        return;
    }
    
    if (effect) {
      this.visualEffects.set(effectType, effect);
    }
  }
  
  startAnimationLoop() {
    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.visualEffects.forEach(effect => {
        effect.update();
        effect.render();
      });
      
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Effect Classes
  createEffectClasses() {
    // Rain Effect
    window.RainEffect = class {
      constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.drops = [];
        
        for (let i = 0; i < 100; i++) {
          this.drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 5 + Math.random() * 10,
            length: 10 + Math.random() * 20
          });
        }
      }
      
      update() {
        this.drops.forEach(drop => {
          drop.y += drop.speed;
          if (drop.y > this.canvas.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * this.canvas.width;
          }
        });
      }
      
      render() {
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        
        this.drops.forEach(drop => {
          this.ctx.beginPath();
          this.ctx.moveTo(drop.x, drop.y);
          this.ctx.lineTo(drop.x, drop.y + drop.length);
          this.ctx.stroke();
        });
      }
    };
    
    // Matrix Rain Effect
    window.MatrixRainEffect = class {
      constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.fontSize = 14;
        this.columns = Math.floor(canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      }
      
      update() {
        // Randomly reset drops
        for (let i = 0; i < this.drops.length; i++) {
          if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.95) {
            this.drops[i] = 0;
          }
          this.drops[i]++;
        }
      }
      
      render() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
          const char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
        }
      }
    };
    
    // Data Particle Effect
    window.DataParticleEffect = class {
      constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.particles = [];
        
        for (let i = 0; i < 50; i++) {
          this.particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: 2 + Math.random() * 3,
            color: Math.random() < 0.5 ? '#0ff' : '#ff0080'
          });
        }
      }
      
      update() {
        this.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          
          // Wrap around edges
          if (p.x < 0) p.x = this.canvas.width;
          if (p.x > this.canvas.width) p.x = 0;
          if (p.y < 0) p.y = this.canvas.height;
          if (p.y > this.canvas.height) p.y = 0;
          
          // Connect nearby particles
          this.particles.forEach(p2 => {
            if (p !== p2) {
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < 100) {
                this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 * (1 - dist / 100)})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
              }
            }
          });
        });
      }
      
      render() {
        this.particles.forEach(p => {
          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        });
      }
    };
    
    // Initialize other effects
    window.NeonFlickerEffect = class {
      constructor() { /* Implementation */ }
      update() { }
      render() { }
    };
    
    window.SmokeEffect = class {
      constructor() { /* Implementation */ }
      update() { }
      render() { }
    };
  }
  
  // Control Panel
  createControlPanel() {
    return `
      <div class="atmosphere-control" style="padding: 20px;">
        <h3 style="color: var(--primary); margin-bottom: 15px;">Atmosphere Control</h3>
        
        <div style="margin-bottom: 15px;">
          <label style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" ${this.isActive ? 'checked' : ''} 
                   onchange="window.atmosphereSystem.toggle(this.checked)">
            <span>Enable Atmospheric Effects</span>
          </label>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; color: var(--text-secondary);">
            Scene Selection
          </label>
          <select onchange="window.atmosphereSystem.loadScene(this.value)" 
                  style="width: 100%; padding: 8px; background: var(--bg-surface); 
                         border: 1px solid var(--border-color); color: var(--text-primary);">
            ${Object.entries(this.scenes).map(([key, scene]) => `
              <option value="${key}" ${key === this.currentScene ? 'selected' : ''}>
                ${scene.name}
              </option>
            `).join('')}
          </select>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; color: var(--text-secondary);">
            Master Volume
          </label>
          <input type="range" min="0" max="1" step="0.1" 
                 value="${this.masterGain ? this.masterGain.gain.value : 0.3}"
                 onchange="window.atmosphereSystem.setVolume(this.value)"
                 style="width: 100%;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; color: var(--text-secondary);">
            Visual Intensity
          </label>
          <input type="range" min="0" max="1" step="0.1" 
                 value="${this.canvas ? this.canvas.style.opacity : 0.3}"
                 onchange="window.atmosphereSystem.setVisualIntensity(this.value)"
                 style="width: 100%;">
        </div>
        
        <div class="scene-preview" style="background: var(--bg-surface); 
                    border: 1px solid var(--border-color); 
                    padding: 10px; border-radius: 4px;">
          <h4 style="color: var(--primary); margin-bottom: 10px;">
            ${this.scenes[this.currentScene].name}
          </h4>
          <div style="font-size: 12px; color: var(--text-secondary);">
            <div>Sounds: ${this.scenes[this.currentScene].ambience.join(', ')}</div>
            <div>Effects: ${this.scenes[this.currentScene].visuals.join(', ')}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Public API
  toggle(enabled) {
    this.isActive = enabled;
    this.savePreference('atmosphere-enabled', enabled);
    
    if (enabled) {
      this.init();
    } else {
      this.clearEffects();
    }
  }
  
  setVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.value = parseFloat(value);
    }
  }
  
  setVisualIntensity(value) {
    if (this.canvas) {
      this.canvas.style.opacity = value;
    }
  }
  
  clearEffects() {
    // Stop audio
    this.audioNodes.forEach(node => {
      if (node.oscillator) node.oscillator.stop();
      if (node.processor) node.processor.disconnect();
    });
    this.audioNodes.clear();
    
    // Clear visuals
    this.visualEffects.clear();
    
    // Stop animation
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
  
  loadPreference(key, defaultValue) {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
  
  savePreference(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// Initialize effect classes
if (typeof window !== 'undefined') {
  const atmosphere = new AtmosphereSystem();
  atmosphere.createEffectClasses();
  window.atmosphereSystem = atmosphere;
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AtmosphereSystem;
} else {
  window.AtmosphereSystem = AtmosphereSystem;
}