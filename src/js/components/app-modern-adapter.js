/**
 * Cyberpunk GM Screen - Adapter
 * 
 * This adapter script fixes issues with the original app-modern.js file
 * by patching the problematic functions after the original script loads.
 */

(function() {
    'use strict';

    // Wait for original script to initialize
    document.addEventListener('DOMContentLoaded', function() {
        // Make sure CyberpunkGM exists
        if (typeof CyberpunkGM === 'undefined') {
            console.error('CyberpunkGM not found. Make sure app-modern.js is loaded first.');
            return;
        }
        
        console.log('Applying fixes to CyberpunkGM');
        
        // Store original functions for reference
        const originalFunctions = {};
        
        // Patch the Panels.create function to fix selector issues
        if (window.CyberpunkGM._internal && window.CyberpunkGM._internal.Panels) {
            originalFunctions.create = window.CyberpunkGM._internal.Panels.create;
            
            window.CyberpunkGM._internal.Panels.create = function(config = {}) {
                try {
                    const result = originalFunctions.create.call(this, config);
                    
                    // Fix title element selector
                    if (result && window.CyberpunkGM._internal.state.panels[result]) {
                        const panel = window.CyberpunkGM._internal.state.panels[result].element;
                        if (panel) {
                            const titleElement = panel.querySelector('.panel-title');
                            if (titleElement) {
                                titleElement.id = `panel-title-${result}`;
                            }
                        }
                    }
                    
                    return result;
                } catch (error) {
                    console.error('Error in patched create function:', error);
                    return originalFunctions.create.call(this, config);
                }
            };
        }
        
        // Expose a public method to safely create accessible panels
        window.createAccessiblePanel = function(type, options = {}) {
            // Default options
            const defaults = {
                width: 400,
                height: 300,
                x: 100,
                y: 100
            };
            
            // Merge options with defaults
            const config = {...defaults, ...options};
            
            // Set title based on type
            let title;
            switch (type) {
                case 'notes': title = 'Notes'; break;
                case 'dice': title = 'Dice Roller'; break;
                case 'rules': title = 'Rules Reference'; break;
                case 'character': title = 'Character Sheet'; break;
                case 'npc': title = 'NPC Generator'; break;
                default: title = 'New Panel';
            }
            
            // Create panel through CyberpunkGM API
            return CyberpunkGM.createPanel({
                title,
                type,
                width: config.width,
                height: config.height,
                x: config.x,
                y: config.y
            });
        };
        
        // Fix pointer events for existing panels
        function upgradeExistingPanels() {
            // Convert to pointer events for all existing panels
            document.querySelectorAll('.panel').forEach(panel => {
                const header = panel.querySelector('.panel-header');
                const handle = panel.querySelector('.resize-handle');
                
                if (header) {
                    // Replace mousedown with pointerdown for dragging
                    const mousedownHandlers = getEventListeners(header, 'mousedown');
                    if (mousedownHandlers && mousedownHandlers.length) {
                        // Add pointer events equivalent
                        header.addEventListener('pointerdown', function(e) {
                            // Skip if clicking close or control buttons
                            if (e.target.classList.contains('close-button') || 
                                e.target.closest('.panel-controls')) return;
                            
                            // Add dragging styles
                            panel.classList.add('panel-dragging');
                            
                            // Capture the pointer
                            header.setPointerCapture(e.pointerId);
                        });
                    }
                }
                
                if (handle) {
                    // Replace mousedown with pointerdown for resizing
                    const mousedownHandlers = getEventListeners(handle, 'mousedown');
                    if (mousedownHandlers && mousedownHandlers.length) {
                        // Add pointer events equivalent
                        handle.addEventListener('pointerdown', function(e) {
                            e.preventDefault();
                            panel.classList.add('panel-resizing');
                            handle.setPointerCapture(e.pointerId);
                        });
                    }
                }
            });
        }
        
        // Helper function to get event listeners (implementation depends on environment)
        function getEventListeners(element, eventType) {
            // This is a placeholder as getting event listeners requires browser devtools
            // or special implementation in the original code
            return null;
        }
        
        // Add click listener for panels from the dropdown menu
        document.querySelectorAll('#add-notes, #add-dice, #add-rules, #add-character, #add-npc').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get panel type from button ID
                const type = this.id.replace('add-', '');
                
                // Create the panel
                createAccessiblePanel(type);
            });
        });
        
        console.log('CyberpunkGM patched successfully');
    });
})();