/**
 * Module Index for Cyberpunk GM Screen
 * Central registry of all JavaScript modules with their versions and dependencies
 */

const CyberpunkModules = {
  // Core System Modules
  core: {
    'enhanced-panel-system-fixed': {
      version: '2.0.0',
      description: 'Core panel management system with drag, resize, and state persistence',
      dependencies: [],
      exports: ['EnhancedPanelSystem']
    },
    'cyberpunk-background': {
      version: '1.0.0',
      description: 'Animated cyberpunk background with circuits and effects',
      dependencies: [],
      exports: ['CyberpunkBackground']
    },
    'theme-manager': {
      version: '1.0.0',
      description: 'Theme switching and persistence',
      dependencies: [],
      exports: ['ThemeManager']
    },
    'sound-manager': {
      version: '1.0.0',
      description: 'Sound effects management with Web Audio API',
      dependencies: [],
      exports: ['SoundManager']
    }
  },
  
  // Panel Modules
  panels: {
    'enhanced-dice-roller-fixed': {
      version: '2.0.0',
      description: 'Advanced dice roller with exploding dice and macros',
      dependencies: ['sound-manager'],
      exports: ['CyberpunkDiceRoller', 'EnhancedDiceRoller']
    },
    'advanced-combat-tracker-fixed': {
      version: '2.0.0',
      description: 'Combat tracker with initiative, HP, and armor management',
      dependencies: ['sound-manager'],
      exports: ['CyberpunkCombatTracker', 'AdvancedCombatTracker']
    },
    'npc-generator': {
      version: '1.0.0',
      description: 'NPC generator with stats, skills, and equipment',
      dependencies: ['sound-manager'],
      exports: ['NPCGenerator']
    },
    'rules-reference': {
      version: '1.0.0',
      description: 'Searchable rules database',
      dependencies: ['sound-manager'],
      exports: ['RulesReference']
    },
    'notes-text-editor': {
      version: '1.0.0',
      description: 'Enhanced notes editor with markdown support',
      dependencies: [],
      exports: ['NotesTextEditor']
    }
  },
  
  // Utility Modules
  utilities: {
    'panel-utils': {
      version: '1.0.0',
      description: 'Common panel utilities for loading states and error handling',
      dependencies: ['loading-spinner', 'error-message'],
      exports: ['PanelUtils']
    }
  },
  
  // Web Components
  components: {
    'holo-button': {
      version: '1.0.0',
      description: 'Holographic button component',
      dependencies: [],
      exports: ['HoloButton']
    },
    'neon-input': {
      version: '1.0.0',
      description: 'Neon-styled input component',
      dependencies: [],
      exports: ['NeonInput']
    },
    'loading-spinner': {
      version: '1.0.0',
      description: 'Cyberpunk loading spinner',
      dependencies: [],
      exports: ['LoadingSpinner']
    },
    'error-message': {
      version: '1.0.0',
      description: 'Error message display component',
      dependencies: [],
      exports: ['ErrorMessage']
    }
  },
  
  // Deprecated Modules (to be removed)
  deprecated: [
    'advanced-combat-tracker.js',
    'app-modern-adapter.js',
    'enhanced-dice-roller.js',
    'enhanced-panel-system.js',
    'panel-implementations.js',
    'debug-panel.js',
    'layout-save.js',
    'hotfix.js',
    'panel-fix.js',
    'selector-fixes.js',
    'ui-fix.js'
  ]
};

// Module loader helper
class ModuleLoader {
  static async loadModule(moduleName) {
    try {
      // Find module in registry
      for (const category of Object.keys(CyberpunkModules)) {
        if (category === 'deprecated') continue;
        
        if (CyberpunkModules[category][moduleName]) {
          const module = CyberpunkModules[category][moduleName];
          console.log(`Loading ${moduleName} v${module.version}...`);
          
          // Check dependencies
          for (const dep of module.dependencies) {
            if (!this.isModuleLoaded(dep)) {
              console.warn(`Dependency ${dep} not loaded for ${moduleName}`);
            }
          }
          
          return true;
        }
      }
      
      console.error(`Module ${moduleName} not found in registry`);
      return false;
    } catch (error) {
      console.error(`Failed to load module ${moduleName}:`, error);
      return false;
    }
  }
  
  static isModuleLoaded(moduleName) {
    // Check if module exports are available
    for (const category of Object.keys(CyberpunkModules)) {
      if (category === 'deprecated') continue;
      
      const module = CyberpunkModules[category][moduleName];
      if (module) {
        return module.exports.some(exportName => window[exportName] !== undefined);
      }
    }
    return false;
  }
  
  static validateAllModules() {
    const results = {
      loaded: [],
      missing: [],
      deprecated: []
    };
    
    // Check core and panel modules
    for (const category of ['core', 'panels', 'utilities', 'components']) {
      for (const [moduleName, module] of Object.entries(CyberpunkModules[category])) {
        if (this.isModuleLoaded(moduleName)) {
          results.loaded.push(`✓ ${moduleName} v${module.version}`);
        } else {
          results.missing.push(`✗ ${moduleName}`);
        }
      }
    }
    
    // Check for deprecated modules
    for (const deprecated of CyberpunkModules.deprecated) {
      if (document.querySelector(`script[src*="${deprecated}"]`)) {
        results.deprecated.push(`⚠ ${deprecated} (should be removed)`);
      }
    }
    
    return results;
  }
  
  static getDependencyGraph() {
    const graph = {};
    
    for (const category of ['core', 'panels', 'utilities', 'components']) {
      for (const [moduleName, module] of Object.entries(CyberpunkModules[category])) {
        graph[moduleName] = {
          category,
          version: module.version,
          dependencies: module.dependencies,
          dependents: []
        };
      }
    }
    
    // Build dependents list
    for (const [moduleName, moduleInfo] of Object.entries(graph)) {
      for (const dep of moduleInfo.dependencies) {
        if (graph[dep]) {
          graph[dep].dependents.push(moduleName);
        }
      }
    }
    
    return graph;
  }
}

// Export for module management
window.CyberpunkModules = CyberpunkModules;
window.ModuleLoader = ModuleLoader;

// Auto-validate on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Validating Cyberpunk GM Screen modules...');
    const validation = ModuleLoader.validateAllModules();
    
    console.log('✅ Loaded modules:', validation.loaded.length);
    validation.loaded.forEach(m => console.log(m));
    
    if (validation.missing.length > 0) {
      console.warn('❌ Missing modules:', validation.missing.length);
      validation.missing.forEach(m => console.warn(m));
    }
    
    if (validation.deprecated.length > 0) {
      console.warn('⚠️  Deprecated modules found:', validation.deprecated.length);
      validation.deprecated.forEach(m => console.warn(m));
    }
  });
} else {
  // Document already loaded
  setTimeout(() => {
    const validation = ModuleLoader.validateAllModules();
    console.log('Module validation:', validation);
  }, 100);
}