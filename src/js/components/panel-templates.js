/**
 * Panel Templates System
 * Pre-configured layouts for common GM scenarios
 */

class PanelTemplates {
  constructor() {
    this.templates = {
      'combat-session': {
        name: 'Combat Session',
        description: 'Optimized for combat encounters',
        icon: '⚔️',
        panels: [
          {
            type: 'dice-roller',
            position: { x: 20, y: 80 },
            size: { width: 400, height: 600 }
          },
          {
            type: 'combat-tracker',
            position: { x: 440, y: 80 },
            size: { width: 600, height: 600 }
          },
          {
            type: 'npc-generator',
            position: { x: 1060, y: 80 },
            size: { width: 400, height: 300 }
          },
          {
            type: 'notes',
            position: { x: 1060, y: 400 },
            size: { width: 400, height: 280 }
          }
        ]
      },
      
      'roleplay-session': {
        name: 'Roleplay Session',
        description: 'Focus on narrative and social encounters',
        icon: '🎭',
        panels: [
          {
            type: 'notes',
            position: { x: 20, y: 80 },
            size: { width: 500, height: 600 }
          },
          {
            type: 'npc-generator',
            position: { x: 540, y: 80 },
            size: { width: 450, height: 350 }
          },
          {
            type: 'dice-roller',
            position: { x: 540, y: 450 },
            size: { width: 450, height: 230 }
          },
          {
            type: 'rules-reference',
            position: { x: 1010, y: 80 },
            size: { width: 450, height: 600 }
          }
        ]
      },
      
      'character-creation': {
        name: 'Character Creation',
        description: 'Everything needed for making new characters',
        icon: '👤',
        panels: [
          {
            type: 'npc-generator',
            position: { x: 20, y: 80 },
            size: { width: 500, height: 600 }
          },
          {
            type: 'dice-roller',
            position: { x: 540, y: 80 },
            size: { width: 400, height: 300 }
          },
          {
            type: 'rules-reference',
            position: { x: 540, y: 400 },
            size: { width: 400, height: 280 }
          },
          {
            type: 'notes',
            position: { x: 960, y: 80 },
            size: { width: 500, height: 600 }
          }
        ]
      },
      
      'quick-reference': {
        name: 'Quick Reference',
        description: 'Rules and dice for quick checks',
        icon: '📖',
        panels: [
          {
            type: 'rules-reference',
            position: { x: 20, y: 80 },
            size: { width: 600, height: 600 }
          },
          {
            type: 'dice-roller',
            position: { x: 640, y: 80 },
            size: { width: 400, height: 600 }
          }
        ]
      },
      
      'gm-prep': {
        name: 'GM Preparation',
        description: 'Layout for session planning',
        icon: '📋',
        panels: [
          {
            type: 'notes',
            position: { x: 20, y: 80 },
            size: { width: 600, height: 600 }
          },
          {
            type: 'npc-generator',
            position: { x: 640, y: 80 },
            size: { width: 400, height: 350 }
          },
          {
            type: 'rules-reference',
            position: { x: 640, y: 450 },
            size: { width: 400, height: 230 }
          }
        ]
      },
      
      'mobile-compact': {
        name: 'Mobile/Compact',
        description: 'Single column layout for small screens',
        icon: '📱',
        panels: [
          {
            type: 'dice-roller',
            position: { x: 20, y: 80 },
            size: { width: 380, height: 250 }
          },
          {
            type: 'combat-tracker',
            position: { x: 20, y: 350 },
            size: { width: 380, height: 300 }
          }
        ]
      }
    };
    
    this.customTemplates = this.loadCustomTemplates();
  }
  
  /**
   * Get all available templates
   */
  getAllTemplates() {
    return {
      ...this.templates,
      ...this.customTemplates
    };
  }
  
  /**
   * Get a specific template by ID
   */
  getTemplate(templateId) {
    const allTemplates = this.getAllTemplates();
    return allTemplates[templateId];
  }
  
  /**
   * Apply a template to the current panel system
   */
  async applyTemplate(templateId, options = {}) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template "${templateId}" not found`);
    }
    
    const { clearExisting = true, animate = true } = options;
    
    if (!window.panelSystem) {
      throw new Error('Panel system not initialized');
    }
    
    // Clear existing panels if requested
    if (clearExisting) {
      const confirmed = await PanelUtils.confirm(
        'This will replace all current panels. Continue?',
        { title: 'Apply Template', type: 'warning' }
      );
      
      if (!confirmed) return false;
      
      // Clear all panels
      Array.from(window.panelSystem.panels.keys()).forEach(id => {
        window.panelSystem.removePanel(id);
      });
    }
    
    // Apply template panels
    const createdPanels = [];
    
    for (const [index, panelConfig] of template.panels.entries()) {
      // Add stagger delay for animation
      if (animate) {
        await new Promise(resolve => setTimeout(resolve, index * 100));
      }
      
      const panel = await this.createPanelFromConfig(panelConfig);
      if (panel) {
        createdPanels.push(panel);
      }
    }
    
    // Save as last used template
    localStorage.setItem('cyberpunk-last-template', templateId);
    
    // Show success notification
    PanelUtils.showNotification(
      `Applied "${template.name}" template`,
      'success'
    );
    
    // Play sound effect
    if (window.soundManager) {
      window.soundManager.play('uiSuccess');
    }
    
    return createdPanels;
  }
  
  /**
   * Create a panel from template configuration
   */
  async createPanelFromConfig(config) {
    const { type, position, size } = config;
    
    switch (type) {
      case 'dice-roller':
        return this.createDicePanel(position, size);
      
      case 'combat-tracker':
        return this.createCombatPanel(position, size);
      
      case 'npc-generator':
        return this.createNPCPanel(position, size);
      
      case 'rules-reference':
        return this.createRulesPanel(position, size);
      
      case 'notes':
        return this.createNotesPanel(position, size);
      
      default:
        console.warn(`Unknown panel type: ${type}`);
        return null;
    }
  }
  
  // Panel creation methods
  createDicePanel(position, size) {
    const uniqueId = `dice-roller-${Date.now()}`;
    const panel = window.panelSystem.createPanel({
      title: 'Enhanced Dice Roller',
      content: `<div id="${uniqueId}" style="height: 100%; overflow: auto;"></div>`,
      position,
      size
    });
    
    setTimeout(() => {
      const container = document.querySelector(`#${uniqueId}`);
      if (container) {
        const diceRoller = new CyberpunkDiceRoller(container);
      }
    }, 100);
    
    return panel;
  }
  
  createCombatPanel(position, size) {
    const uniqueId = `combat-tracker-${Date.now()}`;
    const panel = window.panelSystem.createPanel({
      title: 'Advanced Combat Tracker',
      content: `<div id="${uniqueId}" style="height: 100%; overflow: auto;"></div>`,
      position,
      size
    });
    
    setTimeout(() => {
      const container = document.getElementById(uniqueId);
      if (container) {
        const tracker = new CyberpunkCombatTracker(container);
        container.combatTracker = tracker;
      }
    }, 100);
    
    return panel;
  }
  
  createNPCPanel(position, size) {
    const uniqueId = `npc-generator-${Date.now()}`;
    const panel = window.panelSystem.createPanel({
      title: 'NPC Generator',
      content: `<div id="${uniqueId}" style="height: 100%; overflow: auto;"></div>`,
      position,
      size
    });
    
    setTimeout(() => {
      const container = document.getElementById(uniqueId);
      if (container) {
        const npcGenerator = new NPCGenerator(container);
        container.npcGenerator = npcGenerator;
      }
    }, 100);
    
    return panel;
  }
  
  createRulesPanel(position, size) {
    const uniqueId = `rules-reference-${Date.now()}`;
    const panel = window.panelSystem.createPanel({
      title: 'Rules Quick Reference',
      content: `<div id="${uniqueId}" style="height: 100%; overflow: auto;"></div>`,
      position,
      size
    });
    
    setTimeout(() => {
      const container = document.getElementById(uniqueId);
      if (container) {
        const rulesReference = new RulesReference(container);
        container.rulesReference = rulesReference;
      }
    }, 100);
    
    return panel;
  }
  
  createNotesPanel(position, size) {
    const uniqueId = `notes-${Date.now()}`;
    const panel = window.panelSystem.createPanel({
      title: 'Session Notes',
      content: `<div id="${uniqueId}" style="height: 100%; overflow: auto;"></div>`,
      position,
      size
    });
    
    setTimeout(() => {
      const container = document.getElementById(uniqueId);
      if (container) {
        const notesEditor = new NotesTextEditor(container);
        notesEditor.init();
      }
    }, 100);
    
    return panel;
  }
  
  /**
   * Save current layout as a custom template
   */
  saveAsTemplate(name, description = '') {
    if (!window.panelSystem) {
      throw new Error('Panel system not initialized');
    }
    
    const panels = Array.from(window.panelSystem.panels.values());
    if (panels.length === 0) {
      throw new Error('No panels to save');
    }
    
    // Generate template ID
    const templateId = `custom-${Date.now()}`;
    
    // Map panels to template format
    const templatePanels = panels.map(panel => {
      // Determine panel type from title
      let type = 'unknown';
      if (panel.title.includes('Dice')) type = 'dice-roller';
      else if (panel.title.includes('Combat')) type = 'combat-tracker';
      else if (panel.title.includes('NPC')) type = 'npc-generator';
      else if (panel.title.includes('Rules')) type = 'rules-reference';
      else if (panel.title.includes('Notes')) type = 'notes';
      
      return {
        type,
        position: { ...panel.position },
        size: { ...panel.size }
      };
    });
    
    // Create template
    const template = {
      name,
      description,
      icon: '⭐',
      panels: templatePanels,
      created: new Date().toISOString()
    };
    
    // Save to custom templates
    this.customTemplates[templateId] = template;
    this.saveCustomTemplates();
    
    // Show success
    PanelUtils.showNotification(
      `Saved template "${name}"`,
      'success'
    );
    
    return templateId;
  }
  
  /**
   * Delete a custom template
   */
  deleteCustomTemplate(templateId) {
    if (!templateId.startsWith('custom-')) {
      throw new Error('Can only delete custom templates');
    }
    
    delete this.customTemplates[templateId];
    this.saveCustomTemplates();
    
    PanelUtils.showNotification(
      'Template deleted',
      'success'
    );
  }
  
  /**
   * Load custom templates from localStorage
   */
  loadCustomTemplates() {
    try {
      const saved = localStorage.getItem('cyberpunk-custom-templates');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Failed to load custom templates:', error);
      return {};
    }
  }
  
  /**
   * Save custom templates to localStorage
   */
  saveCustomTemplates() {
    try {
      localStorage.setItem(
        'cyberpunk-custom-templates',
        JSON.stringify(this.customTemplates)
      );
    } catch (error) {
      console.error('Failed to save custom templates:', error);
    }
  }
  
  /**
   * Export template to JSON
   */
  exportTemplate(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template "${templateId}" not found`);
    }
    
    const exportData = {
      version: '1.0',
      template: {
        ...template,
        id: templateId
      }
    };
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberpunk-template-${templateId}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  /**
   * Import template from JSON
   */
  async importTemplate(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          if (!data.template) {
            throw new Error('Invalid template file');
          }
          
          const templateId = `imported-${Date.now()}`;
          this.customTemplates[templateId] = {
            ...data.template,
            name: `${data.template.name} (Imported)`,
            imported: new Date().toISOString()
          };
          
          this.saveCustomTemplates();
          
          PanelUtils.showNotification(
            'Template imported successfully',
            'success'
          );
          
          resolve(templateId);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

// Export for use
window.PanelTemplates = PanelTemplates;

// Initialize global instance
window.panelTemplates = new PanelTemplates();