/**
 * Debug Tools Initialization Script
 * 
 * This script ensures that only a single consolidated debug panel implementation 
 * is used throughout the application, fixing issue CP-009: Duplicate debug tool panels.
 */

(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Initializing consolidated debug system...');
        
        // Get the debug panel button
        const debugButton = document.getElementById('open-debug-panel');
        
        if (debugButton) {
            // Clear any existing event listeners with cloneNode
            const newButton = debugButton.cloneNode(true);
            debugButton.parentNode.replaceChild(newButton, debugButton);
            
            // Add single event listener for the consolidated debug panel
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Ensure we have a consistent namespace
                window.CyberpunkGM = window.CyberpunkGM || {};
                
                // Try to use the consolidated debug panel system
                if (window.CyberpunkGM.Debug && typeof window.CyberpunkGM.Debug.createDebugPanel === 'function') {
                    console.log('Using consolidated debug panel system');
                    const panel = window.CyberpunkGM.Debug.createDebugPanel();
                    
                    // Update button state
                    if (panel) {
                        this.setAttribute('aria-expanded', 'true');
                    }
                } 
                // Fallback to global createDebugPanel
                else if (typeof window.createDebugPanel === 'function') {
                    console.log('Using global createDebugPanel function');
                    const panel = window.createDebugPanel();
                    
                    // Update button state
                    if (panel) {
                        this.setAttribute('aria-expanded', 'true');
                    }
                }
                // Ultimate fallback to simple alert if debugging is completely broken
                else {
                    console.error('No debug panel system available');
                    alert('Debug panel functionality is not available. Check console for errors.');
                }
            });
            
            console.log('Debug button event listener initialized');
        } else {
            console.warn('Debug button not found in DOM');
        }
        
        // Disable or redirect any "emergency" debug panel functions to avoid duplicates
        ['createEmergencyDebugTools', 'createEmergencyDebugPanel', 'showEmergencyDebug'].forEach(funcName => {
            if (typeof window[funcName] === 'function' && window[funcName] !== window.createDebugPanel) {
                console.log(`Redirecting ${funcName} to consolidated debug panel`);
                window[`_original_${funcName}`] = window[funcName]; // Store original for backup
                window[funcName] = typeof window.createDebugPanel === 'function' ? 
                    window.createDebugPanel : 
                    function() { alert('Debug panel not available'); };
            }
        });
        
        // Cleanup function - remove any existing emergency debug panels
        const removeEmergencyPanels = function() {
            // Look for panels with emergency or debug in their title
            const allPanels = document.querySelectorAll('.panel');
            let removed = 0;
            
            allPanels.forEach(panel => {
                // Skip the main debug panel
                if (panel.id === 'debug-panel') return;
                
                // Check panel title
                const headerText = panel.querySelector('.panel-header') ? 
                    panel.querySelector('.panel-header').textContent || '' : '';
                
                if (headerText.includes('Debug') || headerText.includes('Emergency')) {
                    console.log('Found emergency panel:', headerText);
                    panel.remove();
                    removed++;
                }
            });
            
            if (removed > 0) {
                console.log(`Removed ${removed} emergency debug panels`);
            }
        };
        
        // Run cleanup now
        removeEmergencyPanels();
        
        // Also run cleanup after a short delay (for any async panel creation)
        setTimeout(removeEmergencyPanels, 1000);
        
        console.log('Debug initialization complete');
    });
})();