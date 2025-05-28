/**
 * Cyberpunk GM Screen - UI Fix Implementation
 * Fixes issues with panel functionality, layout buttons, and UI positioning
 * Version 1.0
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        selectors: {
            panels: '.panel',
            layoutButtons: ['save-layout', 'load-layout', 'clear-layout', 'reset-layout', 'auto-organize', 'fit-to-window'],
            settingsButtons: ['toggle-animations', 'show-font-settings', 'about'],
            panelMenuItems: {
                'add-character': 'createCharacterPanel',
                'add-npc': 'createNPCPanel',
                'add-loot': 'createLootPanel',
                'add-map': 'createMapPanel',
                'add-location': 'createLocationPanel',
                'add-encounter': 'createEncounterPanel',
                'add-notes': 'createNotesPanel',
                'add-dice': 'createDicePanel',
                'add-initiative': 'createInitiativePanel',
                'add-rules': 'createRulesPanel',
                'add-timer': 'createTimerPanel',
                'add-calculator': 'createCalculatorPanel',
                'add-weapons': 'createWeaponsPanel',
                'add-armor': 'createArmorPanel',
                'add-critical': 'createCriticalPanel',
                'add-netrunning': 'createNetrunningPanel'
            }
        },
        debugMode: false,
        logPrefix: '🔧 [UI-FIX]'
    };
    
    // Internal utility functions
    const Utils = {
        log: function(message, type = 'log') {
            if (CONFIG.debugMode || type === 'error' || type === 'warn') {
                console[type](`${CONFIG.logPrefix} ${message}`);
            }
        },
        
        findOne: function(selector, parent = document) {
            try {
                return parent.querySelector(selector);
            } catch (error) {
                this.log(`Error finding element "${selector}": ${error.message}`, 'error');
                return null;
            }
        },
        
        findAll: function(selector, parent = document) {
            try {
                return Array.from(parent.querySelectorAll(selector));
            } catch (error) {
                this.log(`Error finding elements "${selector}": ${error.message}`, 'error');
                return [];
            }
        },
        
        createElement: function(tag, options = {}) {
            try {
                const element = document.createElement(tag);
                
                if (options.id) element.id = options.id;
                if (options.className) element.className = options.className;
                if (options.text) element.textContent = options.text;
                if (options.html) element.innerHTML = options.html;
                
                if (options.attributes) {
                    Object.entries(options.attributes).forEach(([key, value]) => {
                        element.setAttribute(key, value);
                    });
                }
                
                if (options.style) {
                    Object.entries(options.style).forEach(([key, value]) => {
                        element.style[key] = value;
                    });
                }
                
                if (options.events) {
                    Object.entries(options.events).forEach(([event, handler]) => {
                        element.addEventListener(event, handler);
                    });
                }
                
                if (options.parent) {
                    options.parent.appendChild(element);
                }
                
                return element;
            } catch (error) {
                this.log(`Error creating element: ${error.message}`, 'error');
                return null;
            }
        }
    };
    
    // UI Notification System
    const UI = {
        notificationContainer: null,
        
        init: function() {
            this.notificationContainer = Utils.createElement('div', {
                className: 'ui-fix-notifications',
                style: {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: '9999',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    pointerEvents: 'none'
                },
                parent: document.body
            });
            
            // Add style for notifications
            const style = Utils.createElement('style', {
                html: `
                    .ui-fix-notification {
                        background-color: var(--theme-bg-secondary, #1e1e2d);
                        color: var(--theme-text-primary, #e0e0e0);
                        padding: 12px 15px;
                        border-radius: 4px;
                        margin-top: 5px;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                        max-width: 300px;
                        pointer-events: auto;
                        animation: ui-fix-notification-in 0.3s ease-out;
                        position: relative;
                    }
                    .ui-fix-notification-info {
                        border-left: 4px solid var(--theme-primary, #00ccff);
                    }
                    .ui-fix-notification-success {
                        border-left: 4px solid #22cc66;
                    }
                    .ui-fix-notification-error {
                        border-left: 4px solid #ff3333;
                    }
                    .ui-fix-notification-out {
                        animation: ui-fix-notification-out 0.3s ease-in forwards;
                    }
                    @keyframes ui-fix-notification-in {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes ui-fix-notification-out {
                        from { opacity: 1; transform: translateY(0); }
                        to { opacity: 0; transform: translateY(-20px); }
                    }
                `,
                parent: document.head
            });
        },
        
        notify: function(message, type = 'info', duration = 3000) {
            if (!this.notificationContainer) {
                this.init();
            }
            
            const notification = Utils.createElement('div', {
                className: `ui-fix-notification ui-fix-notification-${type}`,
                html: message,
                parent: this.notificationContainer
            });
            
            if (duration > 0) {
                setTimeout(() => {
                    notification.classList.add('ui-fix-notification-out');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }, duration);
            }
            
            return notification;
        }
    };
    
    // Fix 1: Ensure panel creation functions are globally available
    function exposeGlobalFunctions() {
        Utils.log('Ensuring panel functions are globally available');
        
        // Make sure createPanel is globally available
        if (typeof createPanel === 'function' && typeof window.createPanel !== 'function') {
            window.createPanel = createPanel;
            Utils.log('Exposed createPanel to global scope');
        }
        
        // Check for panel creation functions and expose to global scope
        Object.values(CONFIG.selectors.panelMenuItems).forEach(funcName => {
            // Skip if already global
            if (typeof window[funcName] === 'function') {
                Utils.log(`${funcName} already in global scope`);
                return;
            }
            
            // Try to find the function in the current scope
            if (typeof eval(funcName) === 'function') {
                window[funcName] = eval(funcName);
                Utils.log(`Exposed ${funcName} to global scope`);
            } else {
                Utils.log(`${funcName} not found in current scope`, 'warn');
            }
        });
    }
    
    // Fix 2: Wrap panel creation functions with error handling
    function wrapPanelFunctions() {
        Utils.log('Adding error handling to panel functions');
        
        Object.values(CONFIG.selectors.panelMenuItems).forEach(funcName => {
            if (typeof window[funcName] !== 'function') {
                Utils.log(`Cannot wrap ${funcName} - function not found`, 'warn');
                return;
            }
            
            // Skip if already wrapped
            if (window[funcName]._wrapped) {
                Utils.log(`${funcName} already wrapped`);
                return;
            }
            
            const originalFunc = window[funcName];
            
            window[funcName] = function() {
                try {
                    Utils.log(`Executing ${funcName}...`);
                    const result = originalFunc.apply(this, arguments);
                    Utils.log(`${funcName} executed successfully`);
                    return result;
                } catch (error) {
                    Utils.log(`Error in ${funcName}: ${error.message}`, 'error');
                    
                    // Try to create a fallback panel
                    try {
                        if (typeof window.createPanel === 'function') {
                            const panelTitle = funcName.replace(/^create|Panel$/g, '');
                            const errorPanel = window.createPanel(panelTitle);
                            
                            if (errorPanel && errorPanel.querySelector) {
                                const content = errorPanel.querySelector('.panel-content');
                                if (content) {
                                    content.innerHTML = `
                                        <div style="color: #ff3333; margin-bottom: 10px;">
                                            <strong>Error creating panel:</strong>
                                        </div>
                                        <div style="margin-bottom: 10px;">
                                            ${error.message}
                                        </div>
                                        <div>
                                            Check browser console for details.
                                        </div>
                                    `;
                                }
                            }
                            
                            UI.notify(`Error creating ${panelTitle} panel: ${error.message}`, 'error');
                            return errorPanel;
                        }
                    } catch (fallbackError) {
                        Utils.log(`Error creating fallback panel: ${fallbackError.message}`, 'error');
                    }
                    
                    UI.notify(`Error creating panel: ${error.message}`, 'error');
                    return null;
                }
            };
            
            // Mark as wrapped to prevent double-wrapping
            window[funcName]._wrapped = true;
            Utils.log(`${funcName} wrapped with error handling`);
        });
    }
    
    // Fix 3: Fix panel menu event binding
    function fixPanelMenuEvents() {
        Utils.log('Fixing panel menu event binding');
        
        Object.entries(CONFIG.selectors.panelMenuItems).forEach(([menuId, funcName]) => {
            const menuItem = document.getElementById(menuId);
            
            if (!menuItem) {
                Utils.log(`Menu item #${menuId} not found`, 'warn');
                return;
            }
            
            // Skip if already fixed
            if (menuItem._fixed) {
                Utils.log(`Menu item #${menuId} already fixed`);
                return;
            }
            
            // Clone to remove existing listeners
            const newMenuItem = menuItem.cloneNode(true);
            if (menuItem.parentNode) {
                menuItem.parentNode.replaceChild(newMenuItem, menuItem);
            }
            
            // Add new event listener with error handling
            newMenuItem.addEventListener('click', function(e) {
                e.preventDefault();
                Utils.log(`Menu item #${menuId} clicked, calling ${funcName}`);
                
                if (typeof window[funcName] === 'function') {
                    try {
                        const panel = window[funcName]();
                        Utils.log(`Panel created successfully via ${funcName}`);
                    } catch (error) {
                        Utils.log(`Error calling ${funcName}: ${error.message}`, 'error');
                        UI.notify(`Error creating panel: ${error.message}`, 'error');
                    }
                } else {
                    Utils.log(`Function ${funcName} not available`, 'error');
                    UI.notify(`Panel creation function not available`, 'error');
                }
            });
            
            // Mark as fixed
            newMenuItem._fixed = true;
            Utils.log(`Fixed event binding for #${menuId}`);
        });
    }
    
    // Fix 4: Fix layout button functionality
    function fixLayoutButtons() {
        Utils.log('Fixing layout button functionality');
        
        CONFIG.selectors.layoutButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            
            if (!button) {
                Utils.log(`Layout button #${buttonId} not found`, 'warn');
                return;
            }
            
            // Skip if already fixed
            if (button._fixed) {
                Utils.log(`Layout button #${buttonId} already fixed`);
                return;
            }
            
            // Clone to remove existing listeners
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
            
            // Add new event listener based on button type
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                Utils.log(`Layout button #${buttonId} clicked`);
                
                // Handle specific layout functions
                switch (buttonId) {
                    case 'save-layout':
                        if (window.CyberpunkGM && window.CyberpunkGM.Layout && typeof window.CyberpunkGM.Layout.saveLayout === 'function') {
                            try {
                                window.CyberpunkGM.Layout.saveLayout('default');
                                UI.notify('Layout saved successfully', 'success');
                            } catch (error) {
                                Utils.log(`Error saving layout: ${error.message}`, 'error');
                                UI.notify(`Error saving layout: ${error.message}`, 'error');
                            }
                        } else if (typeof window.saveLayout === 'function') {
                            try {
                                window.saveLayout();
                                UI.notify('Layout saved successfully', 'success');
                            } catch (error) {
                                Utils.log(`Error saving layout: ${error.message}`, 'error');
                                UI.notify(`Error saving layout: ${error.message}`, 'error');
                            }
                        } else {
                            Utils.log('Layout save function not found', 'error');
                            UI.notify('Layout save functionality not available', 'error');
                        }
                        break;
                        
                    case 'load-layout':
                        if (window.CyberpunkGM && window.CyberpunkGM.Layout && typeof window.CyberpunkGM.Layout.loadLayout === 'function') {
                            try {
                                window.CyberpunkGM.Layout.loadLayout();
                                UI.notify('Layout loaded', 'info');
                            } catch (error) {
                                Utils.log(`Error loading layout: ${error.message}`, 'error');
                                UI.notify(`Error loading layout: ${error.message}`, 'error');
                            }
                        } else if (typeof window.loadLayout === 'function') {
                            try {
                                window.loadLayout();
                                UI.notify('Layout loaded', 'info');
                            } catch (error) {
                                Utils.log(`Error loading layout: ${error.message}`, 'error');
                                UI.notify(`Error loading layout: ${error.message}`, 'error');
                            }
                        } else {
                            Utils.log('Layout load function not found', 'error');
                            UI.notify('Layout load functionality not available', 'error');
                        }
                        break;
                        
                    case 'clear-layout':
                        if (window.CyberpunkGM && window.CyberpunkGM.Layout && typeof window.CyberpunkGM.Layout.clearLayout === 'function') {
                            try {
                                window.CyberpunkGM.Layout.clearLayout();
                                UI.notify('Layout cleared', 'info');
                            } catch (error) {
                                Utils.log(`Error clearing layout: ${error.message}`, 'error');
                                UI.notify(`Error clearing layout: ${error.message}`, 'error');
                            }
                        } else if (typeof window.clearLayout === 'function') {
                            try {
                                window.clearLayout();
                                UI.notify('Layout cleared', 'info');
                            } catch (error) {
                                Utils.log(`Error clearing layout: ${error.message}`, 'error');
                                UI.notify(`Error clearing layout: ${error.message}`, 'error');
                            }
                        } else {
                            // Fallback - try to remove all panels
                            try {
                                const panels = Utils.findAll(CONFIG.selectors.panels);
                                panels.forEach(panel => panel.remove());
                                UI.notify(`Removed ${panels.length} panels`, 'info');
                            } catch (error) {
                                Utils.log(`Error removing panels: ${error.message}`, 'error');
                                UI.notify(`Error removing panels: ${error.message}`, 'error');
                            }
                        }
                        break;
                        
                    case 'reset-layout':
                        if (typeof window.resetLayout === 'function') {
                            try {
                                window.resetLayout();
                                UI.notify('Layout reset to default', 'info');
                            } catch (error) {
                                Utils.log(`Error resetting layout: ${error.message}`, 'error');
                                UI.notify(`Error resetting layout: ${error.message}`, 'error');
                            }
                        } else {
                            Utils.log('Layout reset function not found', 'error');
                            UI.notify('Layout reset functionality not available', 'error');
                        }
                        break;
                        
                    case 'auto-organize':
                        if (typeof window.autoOrganizeLayout === 'function') {
                            try {
                                window.autoOrganizeLayout();
                                UI.notify('Panels auto-organized', 'info');
                            } catch (error) {
                                Utils.log(`Error auto-organizing: ${error.message}`, 'error');
                                UI.notify(`Error auto-organizing: ${error.message}`, 'error');
                            }
                        } else {
                            Utils.log('Auto-organize function not found', 'error');
                            UI.notify('Auto-organize functionality not available', 'error');
                        }
                        break;
                        
                    case 'fit-to-window':
                        if (typeof window.fitLayoutToWindow === 'function') {
                            try {
                                window.fitLayoutToWindow();
                                UI.notify('Panels fit to window', 'info');
                            } catch (error) {
                                Utils.log(`Error fitting to window: ${error.message}`, 'error');
                                UI.notify(`Error fitting to window: ${error.message}`, 'error');
                            }
                        } else {
                            Utils.log('Fit to window function not found', 'error');
                            UI.notify('Fit to window functionality not available', 'error');
                        }
                        break;
                }
            });
            
            // Mark as fixed
            newButton._fixed = true;
            Utils.log(`Fixed layout button #${buttonId}`);
        });
    }
    
    // Fix 5: Fix settings button functionality
    function fixSettingsButtons() {
        Utils.log('Fixing settings button functionality');
        
        CONFIG.selectors.settingsButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            
            if (!button) {
                Utils.log(`Settings button #${buttonId} not found`, 'warn');
                return;
            }
            
            // Skip if already fixed
            if (button._fixed) {
                Utils.log(`Settings button #${buttonId} already fixed`);
                return;
            }
            
            // Clone to remove existing listeners
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
            
            // Add new event listener based on button type
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                Utils.log(`Settings button #${buttonId} clicked`);
                
                // Handle specific settings functions
                switch (buttonId) {
                    case 'toggle-animations':
                        try {
                            document.body.classList.toggle('no-animations');
                            const disabled = document.body.classList.contains('no-animations');
                            UI.notify(`Animations ${disabled ? 'disabled' : 'enabled'}`, 'info');
                        } catch (error) {
                            Utils.log(`Error toggling animations: ${error.message}`, 'error');
                            UI.notify(`Error toggling animations: ${error.message}`, 'error');
                        }
                        break;
                        
                    case 'show-font-settings':
                        try {
                            const controls = document.querySelector('.controls');
                            if (controls) {
                                controls.style.display = 'block';
                            } else {
                                Utils.log('Font controls not found', 'error');
                                UI.notify('Font controls not found', 'error');
                            }
                        } catch (error) {
                            Utils.log(`Error showing font settings: ${error.message}`, 'error');
                            UI.notify(`Error showing font settings: ${error.message}`, 'error');
                        }
                        break;
                        
                    case 'about':
                        try {
                            alert('Cyberpunk RED GM Screen\nA minimalist tool for Game Masters\nVersion 1.1');
                        } catch (error) {
                            Utils.log(`Error showing about dialog: ${error.message}`, 'error');
                            UI.notify(`Error showing about dialog: ${error.message}`, 'error');
                        }
                        break;
                }
            });
            
            // Mark as fixed
            newButton._fixed = true;
            Utils.log(`Fixed settings button #${buttonId}`);
        });
    }
    
    // Fix 6: Fix theme switcher to prevent button overlap
    function fixThemeSwitcher() {
        Utils.log('Fixing theme switcher positioning');
        
        const themeSwitcher = document.querySelector('.theme-switcher');
        if (!themeSwitcher) {
            Utils.log('Theme switcher not found', 'warn');
            return;
        }
        
        // Ensure proper margin to prevent overlap with Debug and Logout buttons
        themeSwitcher.style.marginRight = '120px';
        Utils.log('Theme switcher margin updated');
    }
    
    // Fix 7: Create test function to verify functionality
    function createTestFunction() {
        Utils.log('Creating test function');
        
        window.testPanelFunctionality = function() {
            console.group('Testing Panel Functionality');
            
            // Test panel creation functions
            console.log('Testing panel creation functions:');
            Object.entries(CONFIG.selectors.panelMenuItems).forEach(([menuId, funcName]) => {
                console.log(`Testing ${funcName}...`);
                
                try {
                    if (typeof window[funcName] === 'function') {
                        const panel = window[funcName]();
                        if (panel && panel.nodeType) {
                            console.log(`✓ ${funcName} created panel successfully`);
                            // Remove panel after testing
                            setTimeout(() => {
                                if (panel.parentNode) {
                                    panel.remove();
                                }
                            }, 1000);
                        } else {
                            console.error(`✗ ${funcName} did not return a valid panel element`);
                        }
                    } else {
                        console.error(`✗ ${funcName} not available`);
                    }
                } catch (error) {
                    console.error(`✗ Error in ${funcName}: ${error.message}`);
                }
            });
            
            // Test layout functionality
            console.log('Testing layout functionality:');
            if (window.CyberpunkGM && window.CyberpunkGM.Layout) {
                console.log('✓ Layout module available');
            } else {
                console.error('✗ Layout module not available');
            }
            
            // Test buttons
            console.log('Testing button availability:');
            [...CONFIG.selectors.layoutButtons, ...CONFIG.selectors.settingsButtons].forEach(buttonId => {
                const button = document.getElementById(buttonId);
                console.log(`Button #${buttonId}: ${button ? '✓' : '✗'}`);
            });
            
            console.groupEnd();
            
            return 'Test completed, check console for details';
        };
        
        Utils.log('Test function created: window.testPanelFunctionality()');
    }
    
    // Initialize UI fixes
    function init() {
        Utils.log('Initializing UI fixes');
        
        // Initialize the UI notification system
        UI.init();
        
        // Apply fixes based on document readiness
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyFixes);
        } else {
            applyFixes();
        }
        
        // Also run fixes when window is fully loaded (for late-loading scripts)
        window.addEventListener('load', function() {
            Utils.log('Window loaded, reapplying fixes');
            applyFixes();
        });
    }
    
    // Apply all fixes
    function applyFixes() {
        Utils.log('Applying all UI fixes');
        
        // Fix 1: Ensure panel creation functions are globally available
        exposeGlobalFunctions();
        
        // Fix 2: Wrap panel creation functions with error handling
        wrapPanelFunctions();
        
        // Fix 3: Fix panel menu event binding
        fixPanelMenuEvents();
        
        // Fix 4: Fix layout button functionality
        fixLayoutButtons();
        
        // Fix 5: Fix settings button functionality
        fixSettingsButtons();
        
        // Fix 6: Fix theme switcher to prevent button overlap
        fixThemeSwitcher();
        
        // Fix 7: Create test function
        createTestFunction();
        
        Utils.log('All UI fixes applied successfully');
        
        // Show notification only if fixes applied after initial load
        if (document.readyState === 'complete') {
            UI.notify('UI fixes applied successfully', 'success');
        }
    }
    
    // Start initialization
    init();
})();
// Add the createNotesPanel function to the list of panel menu items
if (CONFIG.selectors.panelMenuItems && \!CONFIG.selectors.panelMenuItems['add-notes']) {
    CONFIG.selectors.panelMenuItems['add-notes'] = 'createNotesPanel';
}

// Expose the createNotesPanel function to the window object
if (typeof window.createNotesPanel \!== 'function') {
    window.createNotesPanel = createNotesPanel;
}

// Add createNotesPanel to the list of exposed functions at line 33
// window.createNotesPanel = createNotesPanel;
TEST_EOF < /dev/null
