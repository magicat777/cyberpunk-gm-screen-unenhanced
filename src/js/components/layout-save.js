// Layout Save functionality for Cyberpunk GM Screen
// This script enhances the layout management with auto-save and export/import capabilities

(function() {
    // Wait for DOM to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLayoutSave);
    } else {
        // DOM already loaded, apply immediately
        initLayoutSave();
    }

    function initLayoutSave() {
        console.log('📋 Initializing layout save functionality...');
        
        // Wait to ensure all page scripts have loaded
        setTimeout(() => {
            enhanceLayoutFunctions();
            loadAutoSavedLayout();
            console.log('✅ Layout save functionality initialized');
        }, 1200);
    }
    
    // Enhance the layout functions with additional capabilities
    function enhanceLayoutFunctions() {
        // Check for existing layout functions
        if (typeof localStorage === 'undefined') {
            console.error('localStorage not available - layout save disabled');
            return;
        }
        
        // Enhance layout menu
        enhanceLayoutMenu();
        
        // Add auto-save functionality
        setupAutoSave();
    }
    
    // Add enhanced options to the layout menu
    function enhanceLayoutMenu() {
        // Find the layout menu dropdown
        const layoutDropdown = document.querySelector('.dropdown:nth-child(2) .dropdown-content');
        if (!layoutDropdown) {
            console.error('Layout dropdown not found');
            return;
        }
        
        // Add enhanced options if they don't already exist
        if (!document.getElementById('export-layout')) {
            // Add export option
            const exportOption = document.createElement('a');
            exportOption.href = '#';
            exportOption.id = 'export-layout';
            exportOption.textContent = 'Export Layout';
            layoutDropdown.appendChild(exportOption);
            
            // Add import option
            const importOption = document.createElement('a');
            importOption.href = '#';
            importOption.id = 'import-layout';
            importOption.textContent = 'Import Layout';
            layoutDropdown.appendChild(importOption);
            
            // Add auto-save toggle option
            const autoSaveOption = document.createElement('a');
            autoSaveOption.href = '#';
            autoSaveOption.id = 'toggle-autosave';
            
            // Check if auto-save is enabled
            const autoSaveEnabled = localStorage.getItem('cyberpunk-autosave-enabled') !== 'false';
            autoSaveOption.textContent = autoSaveEnabled ? 'Disable Auto-Save' : 'Enable Auto-Save';
            layoutDropdown.appendChild(autoSaveOption);
            
            // Add event handlers
            exportOption.addEventListener('click', exportLayout);
            importOption.addEventListener('click', importLayout);
            autoSaveOption.addEventListener('click', function() {
                const currentlyEnabled = localStorage.getItem('cyberpunk-autosave-enabled') !== 'false';
                localStorage.setItem('cyberpunk-autosave-enabled', !currentlyEnabled);
                this.textContent = !currentlyEnabled ? 'Disable Auto-Save' : 'Enable Auto-Save';
                alert(`Layout auto-save ${!currentlyEnabled ? 'enabled' : 'disabled'}`);
            });
            
            console.log('Layout menu enhanced with export/import options');
        }
    }
    
    // Set up auto-save functionality
    function setupAutoSave() {
        // Save layout when panels are moved
        const observer = new MutationObserver(function(mutations) {
            let shouldSave = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    if (mutation.target.classList.contains('panel')) {
                        shouldSave = true;
                    }
                } else if (mutation.type === 'childList' && 
                          (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    // Check if panel was added or removed
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        if (mutation.addedNodes[i].classList && 
                            mutation.addedNodes[i].classList.contains('panel')) {
                            shouldSave = true;
                            break;
                        }
                    }
                    
                    for (let i = 0; i < mutation.removedNodes.length; i++) {
                        if (mutation.removedNodes[i].classList && 
                            mutation.removedNodes[i].classList.contains('panel')) {
                            shouldSave = true;
                            break;
                        }
                    }
                }
            });
            
            if (shouldSave) {
                // Throttle saves to once per second
                if (!setupAutoSave.saveTimeout) {
                    setupAutoSave.saveTimeout = setTimeout(function() {
                        setupAutoSave.saveTimeout = null;
                        if (localStorage.getItem('cyberpunk-autosave-enabled') !== 'false') {
                            saveCurrentLayout('autosave');
                        }
                    }, 1000);
                }
            }
        });
        
        observer.observe(document.body, { 
            attributes: true,
            attributeFilter: ['style', 'class'],
            childList: true,
            subtree: true
        });
        
        console.log('Layout auto-save observer set up');
    }
    
    // Load the auto-saved layout if available
    function loadAutoSavedLayout() {
        try {
            // Check if auto-save is enabled (default to enabled)
            if (localStorage.getItem('cyberpunk-autosave-enabled') === 'false') {
                console.log('Layout auto-save is disabled');
                return;
            }
            
            // Check for autosaved layout
            const savedLayout = localStorage.getItem('cyberpunk-layout-autosave');
            if (!savedLayout) {
                console.log('No auto-saved layout found');
                return;
            }
            
            // Parse layout
            const layout = JSON.parse(savedLayout);
            if (!layout.panels || !Array.isArray(layout.panels) || layout.panels.length === 0) {
                console.log('Invalid auto-saved layout structure');
                return;
            }
            
            // Wait a bit longer to ensure page is fully loaded
            setTimeout(() => {
                try {
                    // See if there's an existing loadLayout function
                    if (typeof window.loadLayout === 'function') {
                        const originalLoadLayout = window.loadLayout;
                        window.loadLayout = function(layoutData) {
                            return originalLoadLayout.call(this, layoutData);
                        };
                        
                        window.loadLayout(layout);
                        console.log('Auto-saved layout loaded successfully');
                    } else {
                        // Fallback: Use applyLayout function
                        applyLayout(layout);
                    }
                } catch (error) {
                    console.error('Error applying auto-saved layout:', error);
                }
            }, 1000);
        } catch (error) {
            console.error('Error loading auto-saved layout:', error);
        }
    }
    
    // Apply a layout by creating panels
    function applyLayout(layout) {
        // Clear existing panels
        clearLayout();
        
        // Check for panels array
        if (!layout.panels || !Array.isArray(layout.panels)) {
            console.error('Invalid layout structure - missing panels array');
            return;
        }
        
        // Create panels based on their types
        layout.panels.forEach(panel => {
            try {
                if (!panel.title) {
                    console.warn('Panel missing title, skipping:', panel);
                    return;
                }
                
                let newPanel;
                
                // Create appropriate panel type based on title
                switch (panel.title) {
                    case 'Notes':
                        newPanel = typeof createNotesPanel === 'function' ? createNotesPanel() : null;
                        break;
                    case 'Dice Roller':
                        newPanel = typeof createDicePanel === 'function' ? createDicePanel() : null;
                        break;
                    case 'Rules Reference':
                        newPanel = typeof createRulesPanel === 'function' ? createRulesPanel() : null;
                        break;
                    case 'Initiative Tracker':
                        newPanel = typeof createInitiativePanel === 'function' ? createInitiativePanel() : null;
                        break;
                    case 'Game Timer':
                        newPanel = typeof createTimerPanel === 'function' ? createTimerPanel() : null;
                        break;
                    case 'Calculator':
                        newPanel = typeof createCalculatorPanel === 'function' ? createCalculatorPanel() : null;
                        break;
                    case 'Weapons Table':
                        newPanel = typeof createWeaponsPanel === 'function' ? createWeaponsPanel() : null;
                        break;
                    case 'Armor Table':
                        newPanel = typeof createArmorPanel === 'function' ? createArmorPanel() : null;
                        break;
                    case 'Critical Injuries':
                        newPanel = typeof createCriticalInjuryPanel === 'function' ? createCriticalInjuryPanel() : null;
                        break;
                    case 'Netrunning':
                        newPanel = typeof createNetrunningPanel === 'function' ? createNetrunningPanel() : null;
                        break;
                    case 'Character Sheet':
                        newPanel = typeof createCharacterPanel === 'function' ? createCharacterPanel() : null;
                        break;
                    case 'NPC Generator':
                        newPanel = typeof createNPCPanel === 'function' ? createNPCPanel() : null;
                        break;
                    case 'Loot Generator':
                        newPanel = typeof createLootPanel === 'function' ? createLootPanel() : null;
                        break;
                    case 'Night City Map':
                        newPanel = typeof createMapPanel === 'function' ? createMapPanel() : null;
                        break;
                    case 'Location Generator':
                        newPanel = typeof createLocationPanel === 'function' ? createLocationPanel() : null;
                        break;
                    case 'Random Encounter':
                        newPanel = typeof createEncounterPanel === 'function' ? createEncounterPanel() : null;
                        break;
                    case 'Collections':
                        newPanel = typeof createCollectionsPanel === 'function' ? createCollectionsPanel() : null;
                        break;
                    default:
                        // Default to a basic panel
                        newPanel = typeof createPanel === 'function' ? createPanel(panel.title) : null;
                }
                
                // Apply position and size if panel was created
                if (newPanel) {
                    if (panel.left) newPanel.style.left = panel.left;
                    if (panel.top) newPanel.style.top = panel.top;
                    if (panel.width) newPanel.style.width = panel.width;
                    if (panel.height) newPanel.style.height = panel.height;
                    if (panel.zIndex) newPanel.style.zIndex = panel.zIndex;
                }
            } catch (error) {
                console.error(`Error creating panel '${panel.title}':`, error);
            }
        });
        
        console.log(`Applied layout with ${layout.panels.length} panels`);
    }
    
    // Clear all panels from the layout
    function clearLayout() {
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => panel.remove());
    }
    
    // Save the current layout
    function saveCurrentLayout(name = 'default') {
        // Get all panels
        const panels = document.querySelectorAll('.panel');
        const savedPanels = [];
        
        panels.forEach(panel => {
            const title = panel.querySelector('.panel-header div')?.textContent;
            
            if (title) {
                savedPanels.push({
                    title: title,
                    left: panel.style.left,
                    top: panel.style.top,
                    width: panel.style.width,
                    height: panel.style.height,
                    zIndex: panel.style.zIndex
                });
            }
        });
        
        // Save to localStorage
        try {
            const layoutData = { 
                panels: savedPanels,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            // Store as string
            localStorage.setItem(`cyberpunk-layout-${name}`, JSON.stringify(layoutData));
            console.log(`Layout saved as '${name}' with ${savedPanels.length} panels`);
            
            return layoutData;
        } catch (error) {
            console.error('Error saving layout:', error);
            return null;
        }
    }
    
    // Export layout to a file
    function exportLayout() {
        try {
            // Get current layout
            const layout = saveCurrentLayout('export');
            
            // Generate filename with date
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
            const filename = `cyberpunk-layout_${timestamp}.json`;
            
            // Create a blob and download link
            const dataStr = JSON.stringify(layout, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.style.display = 'none';
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            setTimeout(() => {
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log(`Layout exported to ${filename}`);
            alert(`Layout exported to ${filename}`);
        } catch (error) {
            console.error('Error exporting layout:', error);
            alert(`Error exporting layout: ${error.message}`);
        }
    }
    
    // Import layout from a file
    function importLayout() {
        try {
            // Create a file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const layout = JSON.parse(e.target.result);
                        
                        // Basic validation
                        if (!layout.panels || !Array.isArray(layout.panels)) {
                            throw new Error('Invalid layout file format');
                        }
                        
                        // Ask user for confirmation
                        if (confirm(`Import layout with ${layout.panels.length} panels? Current layout will be replaced.`)) {
                            // Save imported layout
                            localStorage.setItem('cyberpunk-layout-import', e.target.result);
                            
                            // Apply the layout
                            applyLayout(layout);
                            
                            // Also save as auto-save if auto-save is enabled
                            if (localStorage.getItem('cyberpunk-autosave-enabled') !== 'false') {
                                localStorage.setItem('cyberpunk-layout-autosave', e.target.result);
                            }
                            
                            alert('Layout imported successfully');
                        }
                    } catch (error) {
                        console.error('Error parsing layout file:', error);
                        alert(`Error importing layout: ${error.message}`);
                    }
                };
                
                reader.readAsText(file);
            });
            
            document.body.appendChild(fileInput);
            fileInput.click();
            
            setTimeout(() => {
                document.body.removeChild(fileInput);
            }, 5000);
        } catch (error) {
            console.error('Error setting up import:', error);
            alert(`Error setting up import: ${error.message}`);
        }
    }
    
    // If there's an existing saveLayout function, enhance it
    if (typeof window.saveLayout === 'function') {
        const originalSaveLayout = window.saveLayout;
        window.saveLayout = function() {
            // Call the original function
            originalSaveLayout.apply(this, arguments);
            
            // Also save layout for auto-save if enabled
            if (localStorage.getItem('cyberpunk-autosave-enabled') !== 'false') {
                saveCurrentLayout('autosave');
            }
        };
        
        console.log('Enhanced existing saveLayout function');
    }
    
    // Enhance clear layout function if it exists
    if (typeof window.clearLayout === 'function') {
        const originalClearLayout = window.clearLayout;
        window.clearLayout = function() {
            // Call the original function
            originalClearLayout.apply(this, arguments);
            
            // Also save empty layout for auto-save if enabled
            if (localStorage.getItem('cyberpunk-autosave-enabled') !== 'false') {
                setTimeout(() => saveCurrentLayout('autosave'), 100);
            }
        };
        
        console.log('Enhanced existing clearLayout function');
    }
})();