/**
 * Sound Manager for Cyberpunk GM Screen
 * Handles all sound effects with volume control and performance optimization
 */

class SoundManager {
  constructor() {
    this.enabled = localStorage.getItem('cyberpunk-sounds-enabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('cyberpunk-sounds-volume')) || 0.5;
    this.sounds = new Map();
    
    // Sound library
    this.soundLibrary = {
      diceRoll: {
        id: 'diceRollSound',
        fallback: this.createDiceRollSound()
      },
      critical: {
        id: 'criticalSound',
        fallback: this.createCriticalSound()
      },
      combatHit: {
        id: 'combatHitSound',
        fallback: this.createCombatHitSound()
      },
      buttonClick: {
        id: null,
        fallback: this.createClickSound()
      },
      panelOpen: {
        id: null,
        fallback: this.createPanelOpenSound()
      },
      panelClose: {
        id: null,
        fallback: this.createPanelCloseSound()
      },
      error: {
        id: null,
        fallback: this.createErrorSound()
      },
      success: {
        id: null,
        fallback: this.createSuccessSound()
      }
    };
    
    this.init();
  }
  
  init() {
    // Preload sounds
    Object.entries(this.soundLibrary).forEach(([key, config]) => {
      if (config.id) {
        const audio = document.getElementById(config.id);
        if (audio) {
          audio.volume = this.volume;
          this.sounds.set(key, audio);
        } else {
          // Use fallback
          this.sounds.set(key, config.fallback);
        }
      } else {
        this.sounds.set(key, config.fallback);
      }
    });
  }
  
  play(soundName, options = {}) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (!sound) return;
    
    try {
      // Clone the audio to allow multiple simultaneous plays
      const audio = sound.cloneNode(true);
      audio.volume = options.volume || this.volume;
      
      // Pitch variation
      if (options.pitch) {
        audio.playbackRate = options.pitch;
      }
      
      // Clean up after playing
      audio.addEventListener('ended', () => {
        audio.remove();
      });
      
      audio.play().catch(e => {
        // Silently fail if autoplay is blocked
        console.debug('Sound play failed:', e);
      });
    } catch (e) {
      console.error('Sound error:', e);
    }
  }
  
  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('cyberpunk-sounds-enabled', enabled);
  }
  
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('cyberpunk-sounds-volume', this.volume);
    
    // Update all existing sounds
    this.sounds.forEach(sound => {
      if (sound instanceof Audio) {
        sound.volume = this.volume;
      }
    });
  }
  
  // Sound generation functions
  createDiceRollSound() {
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    return audio;
  }
  
  createCriticalSound() {
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRqQEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YYAEAABQ/1r/Vv9a/1X/W/9U/1z/U/9d/1L/Xv9R/1//UP9g/0//Yf9O/2L/Tf9j/0z/ZP9L/2X/Sv9m/0n/Z/9I/2j/R/9p/0b/av9F/2v/RP9s/0P/bf9C/27/Qf9v/0D/cP8//3H/Pv9y/z3/c/88/3T/O/91/zr/dv85/3f/OP94/zf/ef82/3r/Nf97/zT/fP8z/33/Mv9+/zH/f/8w/4D/L/+B/y7/gv8t/4P/LP+E/yv/hf8q/4b/Kf+H/yj/iP8n/4n/Jv+K/yX/i/8k/4z/I/+N/yL/jv8h/4//IP+Q/x//kf8e/5L/Hf+T/xz/lP8b/5X/Gv+W/xn/l/8Y/5j/F/+Z/xb/mv8V/5v/FP+c/xP/nf8S/57/Ef+f/xD/oP8P/6H/Dv+i/w3/o/8M/6T/C/+l/wr/pv8J/6f/CP+o/wf/qf8G/6r/Bf+r/wT/rP8D/63/Av+u/wH/r/8A/7D/AP+x/wD/sv8A/7P/AP+0/wD/tf8A/7b/AP+3/wD/uP8A/7n/AP+6/wD/u/8A/7z/AP+9/wD/vv8A/7//AP/A/wD/wf8A/8L/AP/D/wD/xP8A/8X/AP/G/wD/x/8A/8j/AP/J/wD/yv8A/8v/AP/M/wD/zf8A/87/AP/P/wD/0P8A/9H/AP/S/wD/0/8A/9T/AP/V/wD/1v8A/9f/AP/Y/wD/2f8A/9r/AP/b/wD/3P8A/93/AP/e/wD/3/8A/+D/AP/h/wD/4v8A/+P/AP/k/wD/5f8A/+b/AP/n/wD/6P8A/+n/AP/q/wD/6/8A/+z/AP/t/wD/7v8A/+//AP/w/wD/8f8A//L/AP/z/wD/9P8A//X/AP/2/wD/9/8A//j/AP/5/wD/+v8A//v/AP/8/wD//f8A//7/AP///wD/AABhAGEAYQBhAGEAYQBhAGEAYQBhAGEAYQBhAGEAYQBhAGEAYQBhAGEAYQBhAGEAYQBhAGEAYQBhAGEAYQBhAGEA';
    return audio;
  }
  
  createCombatHitSound() {
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRjQDAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRADAAD/fwCAAIAAgP9/AIAAgACA/38AgACAAID/fwCAAIAAgP9/AIAAgACA/38AgACAAID/fwCAAIAAgP9/AIAAgACA/38AgACAAID/fwCAAIAAgP9/AID/fwCAAIAAgP9//38AgACAAIAAgP9/AIAAgACA/38AgACAAID/fwCAAIAAgP9/AIAAgACA/38AgACAAID/fwCAAIAAgP9/AIAAgACA/38AgACAAID/fwCAAIAAgP9/AIAAgACA';
    return audio;
  }
  
  createClickSound() {
    // Generate a synthetic click sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.05, audioContext.sampleRate);
    const channel = buffer.getChannelData(0);
    
    for (let i = 0; i < channel.length; i++) {
      channel[i] = Math.random() * 0.5 * Math.exp(-i / 100);
    }
    
    const audio = new Audio();
    const blob = new Blob([this.bufferToWave(buffer)], { type: 'audio/wav' });
    audio.src = URL.createObjectURL(blob);
    return audio;
  }
  
  createPanelOpenSound() {
    // Synthetic swoosh sound
    return this.createSynthSound(0.2, (i, length) => {
      return Math.sin(i / length * Math.PI) * Math.sin(i * 0.05) * 0.3;
    });
  }
  
  createPanelCloseSound() {
    // Reverse swoosh
    return this.createSynthSound(0.15, (i, length) => {
      return Math.sin((1 - i / length) * Math.PI) * Math.sin(i * 0.08) * 0.25;
    });
  }
  
  createErrorSound() {
    // Low buzz
    return this.createSynthSound(0.3, (i, length) => {
      return Math.sin(i * 0.02) * Math.sin(i * 0.001) * 0.4 * (1 - i / length);
    });
  }
  
  createSuccessSound() {
    // Pleasant chime
    return this.createSynthSound(0.4, (i, length) => {
      const envelope = Math.sin(i / length * Math.PI);
      return (Math.sin(i * 0.03) + Math.sin(i * 0.045)) * 0.2 * envelope;
    });
  }
  
  createSynthSound(duration, generator) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, length, sampleRate);
    const channel = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      channel[i] = generator(i, length);
    }
    
    const audio = new Audio();
    const blob = new Blob([this.bufferToWave(buffer)], { type: 'audio/wav' });
    audio.src = URL.createObjectURL(blob);
    return audio;
  }
  
  bufferToWave(buffer) {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;
    
    // Write WAVE header
    const setUint16 = (data) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };
    
    const setUint32 = (data) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };
    
    // RIFF identifier
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length minus RIFF header
    setUint32(0x45564157); // "WAVE"
    
    // fmt sub-chunk
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // length = 16
    setUint16(1); // PCM
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // byte rate
    setUint16(buffer.numberOfChannels * 2); // block align
    setUint16(16); // bits per sample
    
    // data sub-chunk
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4); // data length
    
    // write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }
    
    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF; // scale
        view.setInt16(pos, sample, true); // write sample
        pos += 2;
      }
      offset++;
    }
    
    return arrayBuffer;
  }
}

// Create global instance
window.soundManager = new SoundManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SoundManager;
}