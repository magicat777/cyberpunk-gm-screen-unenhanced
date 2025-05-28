/**
 * Campaign Manager
 * Export/import campaign data with optional cloud sync
 */

class CampaignManager {
  constructor() {
    this.currentCampaign = this.loadCurrentCampaign();
    this.campaigns = this.loadCampaigns();
  }
  
  /**
   * Get all campaign data from various sources
   */
  gatherCampaignData() {
    const data = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      campaign: {
        name: this.currentCampaign?.name || 'Untitled Campaign',
        id: this.currentCampaign?.id || `campaign-${Date.now()}`,
        created: this.currentCampaign?.created || new Date().toISOString(),
        modified: new Date().toISOString()
      },
      data: {}
    };
    
    // Gather panel layout
    try {
      const layoutData = localStorage.getItem('cyberpunk-panel-layout');
      if (layoutData) {
        data.data.panelLayout = JSON.parse(layoutData);
      }
    } catch (e) {
      console.error('Failed to gather panel layout:', e);
    }
    
    // Gather dice roller data
    try {
      data.data.diceRoller = {
        macros: localStorage.getItem('cyberpunk-dice-macros') ? 
          JSON.parse(localStorage.getItem('cyberpunk-dice-macros')) : [],
        history: localStorage.getItem('cyberpunk-dice-history') ? 
          JSON.parse(localStorage.getItem('cyberpunk-dice-history')) : []
      };
    } catch (e) {
      console.error('Failed to gather dice roller data:', e);
    }
    
    // Gather combat tracker data
    try {
      const combatData = localStorage.getItem('cyberpunk-combat-tracker');
      if (combatData) {
        data.data.combatTracker = JSON.parse(combatData);
      }
    } catch (e) {
      console.error('Failed to gather combat tracker data:', e);
    }
    
    // Gather saved NPCs
    try {
      const npcData = localStorage.getItem('cyberpunk-saved-npcs');
      if (npcData) {
        data.data.savedNPCs = JSON.parse(npcData);
      }
    } catch (e) {
      console.error('Failed to gather NPC data:', e);
    }
    
    // Gather notes
    try {
      data.data.notes = {
        sessionNotes: localStorage.getItem('cyberpunk-session-notes') || '',
        notesHistory: localStorage.getItem('cyberpunk-notes-history') ? 
          JSON.parse(localStorage.getItem('cyberpunk-notes-history')) : []
      };
    } catch (e) {
      console.error('Failed to gather notes:', e);
    }
    
    // Gather custom templates
    try {
      const templatesData = localStorage.getItem('cyberpunk-custom-templates');
      if (templatesData) {
        data.data.customTemplates = JSON.parse(templatesData);
      }
    } catch (e) {
      console.error('Failed to gather templates:', e);
    }
    
    // Gather settings
    try {
      data.data.settings = {
        theme: localStorage.getItem('cyberpunk-theme') || 'dark',
        soundEnabled: localStorage.getItem('cyberpunk-sounds-enabled') !== 'false',
        soundVolume: parseFloat(localStorage.getItem('cyberpunk-sounds-volume')) || 0.5,
        performanceMode: localStorage.getItem('cyberpunk-performance-mode') || 'high'
      };
    } catch (e) {
      console.error('Failed to gather settings:', e);
    }
    
    return data;
  }
  
  /**
   * Export campaign to file
   */
  exportCampaign(options = {}) {
    const { includeHistory = true, compressed = false } = options;
    
    try {
      const data = this.gatherCampaignData();
      
      // Optionally exclude history for smaller files
      if (!includeHistory) {
        delete data.data.diceRoller?.history;
        delete data.data.notes?.notesHistory;
      }
      
      let exportData;
      if (compressed) {
        // Use compression if available
        exportData = this.compressData(data);
      } else {
        exportData = JSON.stringify(data, null, 2);
      }
      
      const blob = new Blob([exportData], { 
        type: compressed ? 'application/octet-stream' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.campaign.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${compressed ? 'cpgn' : 'json'}`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      PanelUtils.showNotification('Campaign exported successfully', 'success');
      return true;
    } catch (error) {
      console.error('Failed to export campaign:', error);
      PanelUtils.showNotification('Failed to export campaign', 'error');
      return false;
    }
  }
  
  /**
   * Import campaign from file
   */
  async importCampaign(file, options = {}) {
    const { merge = false } = options;
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          let data;
          
          // Check if compressed
          if (file.name.endsWith('.cpgn')) {
            data = this.decompressData(e.target.result);
          } else {
            data = JSON.parse(e.target.result);
          }
          
          // Validate data structure
          if (!data.version || !data.campaign || !data.data) {
            throw new Error('Invalid campaign file format');
          }
          
          // Confirm import
          const message = merge ? 
            'This will merge the imported data with your current campaign. Continue?' :
            'This will replace all current data. Are you sure?';
          
          const confirmed = await PanelUtils.confirm(message, {
            title: 'Import Campaign',
            type: merge ? 'warning' : 'danger'
          });
          
          if (!confirmed) {
            resolve(false);
            return;
          }
          
          // Apply imported data
          await this.applyCampaignData(data, merge);
          
          // Update current campaign
          this.currentCampaign = data.campaign;
          this.saveCurrentCampaign();
          
          PanelUtils.showNotification(
            `Campaign "${data.campaign.name}" imported successfully`,
            'success'
          );
          
          // Reload page to apply all changes
          if (confirm('Page will reload to apply all changes. Continue?')) {
            window.location.reload();
          }
          
          resolve(true);
        } catch (error) {
          console.error('Failed to import campaign:', error);
          PanelUtils.showNotification(
            'Failed to import campaign: ' + error.message,
            'error'
          );
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.name.endsWith('.cpgn')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  }
  
  /**
   * Apply campaign data to localStorage
   */
  async applyCampaignData(data, merge = false) {
    const applyData = (key, value) => {
      if (merge && localStorage.getItem(key)) {
        // Merge logic based on data type
        try {
          const existing = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(existing) && Array.isArray(value)) {
            // Merge arrays (remove duplicates by id if objects)
            const merged = [...existing];
            value.forEach(item => {
              if (item.id) {
                const index = merged.findIndex(m => m.id === item.id);
                if (index >= 0) {
                  merged[index] = item; // Update existing
                } else {
                  merged.push(item); // Add new
                }
              } else {
                merged.push(item); // Simple add for non-id items
              }
            });
            localStorage.setItem(key, JSON.stringify(merged));
          } else if (typeof existing === 'object' && typeof value === 'object') {
            // Merge objects
            localStorage.setItem(key, JSON.stringify({ ...existing, ...value }));
          } else {
            // Replace for other types
            localStorage.setItem(key, JSON.stringify(value));
          }
        } catch (e) {
          // If merge fails, just set the value
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
      } else {
        // Direct set
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    };
    
    // Apply each data section
    if (data.data.panelLayout) {
      applyData('cyberpunk-panel-layout', data.data.panelLayout);
    }
    
    if (data.data.diceRoller) {
      if (data.data.diceRoller.macros) {
        applyData('cyberpunk-dice-macros', data.data.diceRoller.macros);
      }
      if (data.data.diceRoller.history) {
        applyData('cyberpunk-dice-history', data.data.diceRoller.history);
      }
    }
    
    if (data.data.combatTracker) {
      applyData('cyberpunk-combat-tracker', data.data.combatTracker);
    }
    
    if (data.data.savedNPCs) {
      applyData('cyberpunk-saved-npcs', data.data.savedNPCs);
    }
    
    if (data.data.notes) {
      if (data.data.notes.sessionNotes) {
        applyData('cyberpunk-session-notes', data.data.notes.sessionNotes);
      }
      if (data.data.notes.notesHistory) {
        applyData('cyberpunk-notes-history', data.data.notes.notesHistory);
      }
    }
    
    if (data.data.customTemplates) {
      applyData('cyberpunk-custom-templates', data.data.customTemplates);
    }
    
    if (data.data.settings && !merge) {
      // Only apply settings on full import, not merge
      Object.entries(data.data.settings).forEach(([key, value]) => {
        localStorage.setItem(`cyberpunk-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
      });
    }
  }
  
  /**
   * Create a new campaign
   */
  createCampaign(name, description = '') {
    const campaign = {
      id: `campaign-${Date.now()}`,
      name,
      description,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
    
    this.campaigns[campaign.id] = campaign;
    this.currentCampaign = campaign;
    
    this.saveCampaigns();
    this.saveCurrentCampaign();
    
    return campaign;
  }
  
  /**
   * Switch to a different campaign
   */
  async switchCampaign(campaignId) {
    const campaign = this.campaigns[campaignId];
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    // Save current campaign data
    if (this.currentCampaign) {
      await this.saveCampaignSnapshot(this.currentCampaign.id);
    }
    
    // Load new campaign data
    await this.loadCampaignSnapshot(campaignId);
    
    this.currentCampaign = campaign;
    this.saveCurrentCampaign();
    
    // Reload to apply changes
    window.location.reload();
  }
  
  /**
   * Save campaign snapshot
   */
  async saveCampaignSnapshot(campaignId) {
    const data = this.gatherCampaignData();
    const key = `cyberpunk-campaign-snapshot-${campaignId}`;
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save campaign snapshot:', e);
      // Try to compress if storage is full
      try {
        const compressed = this.compressData(data);
        localStorage.setItem(key, compressed);
        return true;
      } catch (e2) {
        console.error('Failed to save compressed snapshot:', e2);
        return false;
      }
    }
  }
  
  /**
   * Load campaign snapshot
   */
  async loadCampaignSnapshot(campaignId) {
    const key = `cyberpunk-campaign-snapshot-${campaignId}`;
    const snapshot = localStorage.getItem(key);
    
    if (!snapshot) {
      console.log('No snapshot found for campaign:', campaignId);
      return false;
    }
    
    try {
      let data;
      try {
        data = JSON.parse(snapshot);
      } catch (e) {
        // Try decompressing
        data = this.decompressData(snapshot);
      }
      
      await this.applyCampaignData(data, false);
      return true;
    } catch (e) {
      console.error('Failed to load campaign snapshot:', e);
      return false;
    }
  }
  
  /**
   * Simple compression using LZ-string if available
   */
  compressData(data) {
    const json = JSON.stringify(data);
    
    // Simple RLE compression for demo
    // In production, use a library like LZ-string
    let compressed = json.replace(/(.)\1+/g, (match, char) => {
      return char + match.length;
    });
    
    return btoa(compressed);
  }
  
  /**
   * Decompress data
   */
  decompressData(compressed) {
    try {
      const decompressed = atob(compressed);
      
      // Simple RLE decompression
      let json = decompressed.replace(/(.)\d+/g, (match, char) => {
        const count = parseInt(match.slice(1));
        return char.repeat(count);
      });
      
      return JSON.parse(json);
    } catch (e) {
      // Fallback to direct parse if not compressed
      return JSON.parse(compressed);
    }
  }
  
  /**
   * Get campaign statistics
   */
  getCampaignStats() {
    const data = this.gatherCampaignData();
    
    return {
      panels: data.data.panelLayout?.panels?.length || 0,
      npcs: data.data.savedNPCs?.length || 0,
      diceRolls: data.data.diceRoller?.history?.length || 0,
      combatants: data.data.combatTracker?.combatants?.length || 0,
      notes: data.data.notes?.sessionNotes?.length || 0,
      templates: Object.keys(data.data.customTemplates || {}).length,
      lastModified: data.campaign.modified,
      sizeKB: Math.round(JSON.stringify(data).length / 1024)
    };
  }
  
  /**
   * Clear all campaign data
   */
  async clearCampaignData() {
    const confirmed = await PanelUtils.confirm(
      'This will delete ALL campaign data including panels, NPCs, notes, and settings. This cannot be undone!',
      { title: 'Clear Campaign Data', type: 'danger' }
    );
    
    if (!confirmed) return false;
    
    // List of all campaign-related localStorage keys
    const campaignKeys = [
      'cyberpunk-panel-layout',
      'cyberpunk-dice-macros',
      'cyberpunk-dice-history',
      'cyberpunk-combat-tracker',
      'cyberpunk-saved-npcs',
      'cyberpunk-session-notes',
      'cyberpunk-notes-history',
      'cyberpunk-custom-templates'
    ];
    
    campaignKeys.forEach(key => localStorage.removeItem(key));
    
    PanelUtils.showNotification('Campaign data cleared', 'success');
    
    // Reload page
    setTimeout(() => window.location.reload(), 1000);
    
    return true;
  }
  
  /**
   * Load/save helper methods
   */
  loadCurrentCampaign() {
    try {
      const saved = localStorage.getItem('cyberpunk-current-campaign');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }
  
  saveCurrentCampaign() {
    try {
      localStorage.setItem('cyberpunk-current-campaign', JSON.stringify(this.currentCampaign));
    } catch (e) {
      console.error('Failed to save current campaign:', e);
    }
  }
  
  loadCampaigns() {
    try {
      const saved = localStorage.getItem('cyberpunk-campaigns');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }
  
  saveCampaigns() {
    try {
      localStorage.setItem('cyberpunk-campaigns', JSON.stringify(this.campaigns));
    } catch (e) {
      console.error('Failed to save campaigns:', e);
    }
  }
}

// Initialize and export
window.campaignManager = new CampaignManager();