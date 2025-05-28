/**
 * Theme Manager for Cyberpunk GM Screen
 * Handles theme switching and persistence
 */

class ThemeManager {
  constructor() {
    this.themes = {
      'cyberpunk': {
        name: 'Cyberpunk Classic',
        description: 'Neon cyan and magenta',
        icon: '🌃'
      },
      'corpo': {
        name: 'Corpo',
        description: 'Clean and professional',
        icon: '🏢'
      },
      'street-kid': {
        name: 'Street Kid',
        description: 'Graffiti and neon',
        icon: '🎨'
      },
      'nomad': {
        name: 'Nomad',
        description: 'Desert and rust',
        icon: '🏜️'
      },
      'netrunner': {
        name: 'Netrunner',
        description: 'Matrix terminal',
        icon: '💻'
      }
    };
    
    this.currentTheme = this.loadTheme();
    this.init();
  }
  
  init() {
    // Apply saved theme
    this.applyTheme(this.currentTheme);
    
    // Create theme switcher UI - DISABLED to use new UI
    // this.createThemeSwitcher();
    
    // Listen for system theme changes
    this.watchSystemTheme();
  }
  
  loadTheme() {
    // Check localStorage
    const saved = localStorage.getItem('cyberpunk-theme');
    if (saved && this.themes[saved]) {
      return saved;
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'corpo';
    }
    
    // Default theme
    return 'cyberpunk';
  }
  
  saveTheme(theme) {
    localStorage.setItem('cyberpunk-theme', theme);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme, themeData: this.themes[theme] }
    }));
  }
  
  applyTheme(theme) {
    if (!this.themes[theme]) {
      console.warn(`Theme '${theme}' not found`);
      return;
    }
    
    // Remove all theme classes
    Object.keys(this.themes).forEach(t => {
      document.documentElement.classList.remove(`theme-${t}`);
    });
    
    // Apply theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Add theme class for specific styling
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Update current theme
    this.currentTheme = theme;
    
    // Save preference
    this.saveTheme(theme);
    
    // Update UI
    this.updateThemeSwitcher();
    
    // Apply theme-specific effects
    this.applyThemeEffects(theme);
  }
  
  applyThemeEffects(theme) {
    // Adjust background effects based on theme
    if (window.cyberpunkBg) {
      switch (theme) {
        case 'corpo':
          window.cyberpunkBg.setPerformanceMode('low');
          window.cyberpunkBg.toggleEffect('rain', false);
          window.cyberpunkBg.toggleEffect('glitch', false);
          break;
          
        case 'street-kid':
          window.cyberpunkBg.toggleEffect('glitch', true);
          break;
          
        case 'nomad':
          window.cyberpunkBg.toggleEffect('rain', false);
          // Could add dust/sand effect here
          break;
          
        case 'netrunner':
          window.cyberpunkBg.toggleEffect('rain', true);
          window.cyberpunkBg.toggleEffect('glitch', true);
          break;
          
        default:
          // Cyberpunk classic
          window.cyberpunkBg.toggleEffect('rain', false);
          window.cyberpunkBg.toggleEffect('glitch', false);
      }
    }
  }
  
  createThemeSwitcher() {
    // Create container
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.setAttribute('role', 'radiogroup');
    switcher.setAttribute('aria-label', 'Theme selection');
    
    // Create theme buttons
    Object.entries(this.themes).forEach(([key, theme]) => {
      const btn = document.createElement('button');
      btn.className = 'theme-btn';
      btn.dataset.theme = key;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', key === this.currentTheme);
      btn.setAttribute('aria-label', `${theme.name} theme: ${theme.description}`);
      
      // Add icon and name
      btn.innerHTML = `
        <span class="theme-icon">${theme.icon}</span>
        <span class="theme-name">${theme.name}</span>
      `;
      
      // Click handler
      btn.addEventListener('click', () => this.applyTheme(key));
      
      // Hover preview (optional)
      btn.addEventListener('mouseenter', () => this.previewTheme(key));
      btn.addEventListener('mouseleave', () => this.endPreview());
      
      switcher.appendChild(btn);
    });
    
    // Add to page
    document.body.appendChild(switcher);
    this.switcher = switcher;
  }
  
  updateThemeSwitcher() {
    if (!this.switcher) return;
    
    // Update active states
    this.switcher.querySelectorAll('.theme-btn').forEach(btn => {
      const isActive = btn.dataset.theme === this.currentTheme;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive);
    });
  }
  
  previewTheme(theme) {
    // Temporarily apply theme for preview
    this.previewTimeout = setTimeout(() => {
      document.documentElement.setAttribute('data-theme-preview', theme);
    }, 300);
  }
  
  endPreview() {
    clearTimeout(this.previewTimeout);
    document.documentElement.removeAttribute('data-theme-preview');
  }
  
  watchSystemTheme() {
    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually selected
      const autoSwitch = localStorage.getItem('cyberpunk-theme-auto') !== 'false';
      
      if (autoSwitch) {
        this.applyTheme(e.matches ? 'cyberpunk' : 'corpo');
      }
    });
  }
  
  // Public API
  
  setTheme(theme) {
    this.applyTheme(theme);
  }
  
  getTheme() {
    return this.currentTheme;
  }
  
  getThemes() {
    return this.themes;
  }
  
  cycleTheme() {
    const themeKeys = Object.keys(this.themes);
    const currentIndex = themeKeys.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    this.applyTheme(themeKeys[nextIndex]);
  }
  
  // Custom theme support
  addCustomTheme(key, themeData) {
    this.themes[key] = themeData;
    
    // Add CSS variables
    const style = document.createElement('style');
    style.id = `theme-${key}`;
    style.textContent = `
      [data-theme="${key}"] {
        ${Object.entries(themeData.colors || {})
          .map(([prop, value]) => `--${prop}: ${value};`)
          .join('\n')}
      }
    `;
    document.head.appendChild(style);
  }
  
  openThemeMenu() {
    const menu = document.querySelector('.theme-menu');
    if (menu) {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Shift + T to cycle themes
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
    e.preventDefault();
    if (window.themeManager) {
      window.themeManager.cycleTheme();
    }
  }
});

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}