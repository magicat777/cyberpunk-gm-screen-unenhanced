class EnhancedSoundSystem {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map();
    this.masterVolume = this.loadVolume();
    this.enabled = this.loadEnabled();
    this.preloadedSounds = new Map();
    this.init();
  }

  async init() {
    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.connect(this.audioContext.destination);
      this.masterGainNode.gain.value = this.masterVolume;

      // Generate synthetic cyberpunk sounds
      await this.generateSyntheticSounds();
      
      console.log('Enhanced Sound System initialized');
    } catch (error) {
      console.warn('Sound system failed to initialize:', error);
      this.enabled = false;
    }
  }

  async generateSyntheticSounds() {
    // Generate various cyberpunk-themed synthetic sounds
    this.sounds.set('button-hover', this.createButtonHoverSound());
    this.sounds.set('button-click', this.createButtonClickSound());
    this.sounds.set('panel-open', this.createPanelOpenSound());
    this.sounds.set('panel-close', this.createPanelCloseSound());
    this.sounds.set('notification', this.createNotificationSound());
    this.sounds.set('error', this.createErrorSound());
    this.sounds.set('success', this.createSuccessSound());
    this.sounds.set('dice-roll', this.createDiceRollSound());
    this.sounds.set('data-input', this.createDataInputSound());
    this.sounds.set('data-processed', this.createDataProcessedSound());
    this.sounds.set('system-boot', this.createSystemBootSound());
    this.sounds.set('glitch', this.createGlitchSound());
    this.sounds.set('scan', this.createScanSound());
    this.sounds.set('alert', this.createAlertSound());
    this.sounds.set('menu-navigate', this.createMenuNavigateSound());
  }

  createButtonHoverSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
        
        return { oscillator, gainNode };
      }
    };
  }

  createButtonClickSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator1.type = 'square';
        oscillator1.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
        
        oscillator2.type = 'sawtooth';
        oscillator2.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
        
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.15);
        oscillator2.stop(this.audioContext.currentTime + 0.15);
        
        return { oscillator1, oscillator2, gainNode, filter };
      }
    };
  }

  createPanelOpenSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
        
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(100, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.4);
        
        return { oscillator, gainNode, filter };
      }
    };
  }

  createPanelCloseSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, this.audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.25);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.25);
        
        return { oscillator, gainNode, filter };
      }
    };
  }

  createDiceRollSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const nodes = [];
        const numBounces = 5 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numBounces; i++) {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          const filter = this.audioContext.createBiquadFilter();
          
          const startTime = this.audioContext.currentTime + (i * 0.1);
          const freq = 200 + Math.random() * 400;
          
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(freq, startTime);
          oscillator.frequency.exponentialRampToValueAtTime(freq * 0.7, startTime + 0.05);
          
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(freq * 2, startTime);
          filter.Q.setValueAtTime(5, startTime);
          
          const volume = 0.15 * (1 - i / numBounces);
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
          
          oscillator.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(this.masterGainNode);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.08);
          
          nodes.push({ oscillator, gainNode, filter });
        }
        
        return nodes;
      }
    };
  }

  createGlitchSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < noiseData.length; i++) {
          noiseData[i] = (Math.random() * 2 - 1) * 0.3;
        }
        
        const noiseSource = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        noiseSource.buffer = noiseBuffer;
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, this.audioContext.currentTime + 0.05);
        filter.Q.setValueAtTime(20, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        noiseSource.start(this.audioContext.currentTime);
        
        return { noiseSource, gainNode, filter };
      }
    };
  }

  createNotificationSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
        
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(659, this.audioContext.currentTime); // E5
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.6);
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.6);
        oscillator2.stop(this.audioContext.currentTime + 0.6);
        
        return { oscillator1, oscillator2, gainNode };
      }
    };
  }

  createErrorSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.4);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.8);
        
        return { oscillator, gainNode };
      }
    };
  }

  createSuccessSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(784, this.audioContext.currentTime + 0.2);
        oscillator.frequency.linearRampToValueAtTime(1047, this.audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.6);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.6);
        
        return { oscillator, gainNode };
      }
    };
  }

  createDataInputSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
        
        return { oscillator, gainNode };
      }
    };
  }

  createDataProcessedSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.15);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
        
        return { oscillator, gainNode, filter };
      }
    };
  }

  createSystemBootSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const nodes = [];
        const frequencies = [220, 277, 330, 440, 554, 659];
        
        frequencies.forEach((freq, index) => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          const startTime = this.audioContext.currentTime + (index * 0.15);
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, startTime);
          
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
          
          oscillator.connect(gainNode);
          gainNode.connect(this.masterGainNode);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.2);
          
          nodes.push({ oscillator, gainNode });
        });
        
        return nodes;
      }
    };
  }

  createScanSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.3);
        oscillator.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.6);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1500, this.audioContext.currentTime);
        filter.Q.setValueAtTime(10, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.8);
        
        return { oscillator, gainNode, filter };
      }
    };
  }

  createAlertSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const nodes = [];
        for (let i = 0; i < 3; i++) {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          const startTime = this.audioContext.currentTime + (i * 0.3);
          
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(800, startTime);
          oscillator.frequency.linearRampToValueAtTime(1200, startTime + 0.1);
          oscillator.frequency.linearRampToValueAtTime(800, startTime + 0.2);
          
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
          gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.18);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
          
          oscillator.connect(gainNode);
          gainNode.connect(this.masterGainNode);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.25);
          
          nodes.push({ oscillator, gainNode });
        }
        return nodes;
      }
    };
  }

  createMenuNavigateSound() {
    return {
      type: 'synthetic',
      generator: () => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(660, this.audioContext.currentTime + 0.08);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
        
        return { oscillator, gainNode };
      }
    };
  }

  // Public API
  play(soundName) {
    if (!this.enabled || !this.audioContext || !this.sounds.has(soundName)) {
      return;
    }

    try {
      // Resume audio context if suspended (required by browser autoplay policies)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const sound = this.sounds.get(soundName);
      if (sound.type === 'synthetic') {
        sound.generator();
      }
    } catch (error) {
      console.warn(`Failed to play sound "${soundName}":`, error);
    }
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGainNode) {
      this.masterGainNode.gain.value = this.masterVolume;
    }
    this.saveVolume();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    this.saveEnabled();
  }

  isEnabled() {
    return this.enabled;
  }

  getVolume() {
    return this.masterVolume;
  }

  // Auto-attach to common UI elements
  attachToUI() {
    // Attach to buttons
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches('button, .btn, .tray-btn, holo-button')) {
        this.play('button-hover');
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .btn, .tray-btn, holo-button')) {
        this.play('button-click');
      }
    });

    // Attach to input events
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, textarea, neon-input')) {
        this.play('data-input');
      }
    });

    // Attach to panel events via custom events
    document.addEventListener('panel-created', () => {
      this.play('panel-open');
    });

    document.addEventListener('panel-closed', () => {
      this.play('panel-close');
    });

    // Attach to notification events
    document.addEventListener('notification-shown', (e) => {
      const type = e.detail?.type || 'info';
      if (type === 'error') {
        this.play('error');
      } else if (type === 'success') {
        this.play('success');
      } else {
        this.play('notification');
      }
    });

    // Attach to dice roll events
    document.addEventListener('dice-rolled', () => {
      this.play('dice-roll');
    });

    console.log('Sound system attached to UI elements');
  }

  // Storage methods
  loadVolume() {
    try {
      return parseFloat(localStorage.getItem('cyberpunk-sound-volume') || '0.3');
    } catch {
      return 0.3;
    }
  }

  saveVolume() {
    localStorage.setItem('cyberpunk-sound-volume', this.masterVolume.toString());
  }

  loadEnabled() {
    try {
      return localStorage.getItem('cyberpunk-sound-enabled') !== 'false';
    } catch {
      return true;
    }
  }

  saveEnabled() {
    localStorage.setItem('cyberpunk-sound-enabled', this.enabled.toString());
  }

  // Create settings panel
  createSettingsPanel() {
    return `
      <div class="sound-settings" style="padding: 20px; background: var(--bg-surface); border: 1px solid var(--border-color);">
        <h3 style="color: var(--primary); margin-bottom: 15px;">Sound Settings</h3>
        
        <div style="margin-bottom: 15px;">
          <label style="display: flex; align-items: center; gap: 10px; color: var(--text-primary);">
            <input type="checkbox" ${this.enabled ? 'checked' : ''} class="sound-enabled-toggle">
            Enable Sound Effects
          </label>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="color: var(--text-primary); display: block; margin-bottom: 5px;">
            Master Volume: <span class="volume-display">${Math.round(this.masterVolume * 100)}%</span>
          </label>
          <input type="range" min="0" max="1" step="0.01" value="${this.masterVolume}" 
                 class="volume-slider" style="width: 100%;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <h4 style="color: var(--text-secondary); margin-bottom: 10px;">Test Sounds</h4>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <button class="test-sound-btn" data-sound="button-click">Button Click</button>
            <button class="test-sound-btn" data-sound="notification">Notification</button>
            <button class="test-sound-btn" data-sound="dice-roll">Dice Roll</button>
            <button class="test-sound-btn" data-sound="panel-open">Panel Open</button>
            <button class="test-sound-btn" data-sound="glitch">Glitch</button>
            <button class="test-sound-btn" data-sound="success">Success</button>
          </div>
        </div>
      </div>
    `;
  }

  attachSettingsListeners(container) {
    const enabledToggle = container.querySelector('.sound-enabled-toggle');
    const volumeSlider = container.querySelector('.volume-slider');
    const volumeDisplay = container.querySelector('.volume-display');
    const testButtons = container.querySelectorAll('.test-sound-btn');

    enabledToggle.addEventListener('change', (e) => {
      this.setEnabled(e.target.checked);
    });

    volumeSlider.addEventListener('input', (e) => {
      const volume = parseFloat(e.target.value);
      this.setVolume(volume);
      volumeDisplay.textContent = `${Math.round(volume * 100)}%`;
    });

    testButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.play(btn.dataset.sound);
      });
    });
  }
}

// Initialize global sound system
window.soundSystem = new EnhancedSoundSystem();

// Auto-attach after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => window.soundSystem.attachToUI(), 1000);
  });
} else {
  setTimeout(() => window.soundSystem.attachToUI(), 1000);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedSoundSystem;
} else {
  window.EnhancedSoundSystem = EnhancedSoundSystem;
}