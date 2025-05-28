/**
 * Cyberpunk GM Screen - Consolidated Debug Panel
 * Version 1.0.0
 * 
 * This file consolidates the functionality of multiple debug panels into a single interface.
 * Fixes issue CP-009: Duplicate debug tool panels.
 */

(function(CyberpunkGM) {
    'use strict';
    
    // Create a Debug namespace if it doesn't exist
    CyberpunkGM.Debug = CyberpunkGM.Debug || {};
    
    // Configuration
    const CONFIG = {
        panelId: 'debug-panel',
        panelTitle: 'Debug Tools',
        defaultWidth: '500px',
        defaultHeight: '350px'
    };
    
    // DOM Utility functions
    const DOM = {
        findOne: function(selector, parent = document) {
            try {
                return parent.querySelector(selector);
            } catch (error) {
                console.error(`Error finding element with selector "${selector}":`, error);
                return null;
            }
        },
        
        findAll: function(selector, parent = document) {
            try {
                return Array.from(parent.querySelectorAll(selector));
            } catch (error) {
                console.error(`Error finding elements with selector "${selector}":`, error);
                return [];
            }
        },
        
        createElement: function(tag, attributes = {}, textContent = '') {
            try {
                const element = document.createElement(tag);
                
                // Set attributes
                Object.entries(attributes).forEach(([key, value]) => {
                    if (key === 'style' && typeof value === 'object') {
                        Object.entries(value).forEach(([prop, val]) => {
                            element.style[prop] = val;
                        });
                    } else if (key === 'className') {
                        element.className = value;
                    } else {
                        element.setAttribute(key, value);
                    }
                });
                
                // Set text content
                if (textContent) {
                    element.textContent = textContent;
                }
                
                return element;
            } catch (error) {
                console.error(`Error creating ${tag} element:`, error);
                return null;
            }
        }
    };
    
    // Storage utility
    const Storage = {
        isAvailable: (function() {
            try {
                const testKey = '__storage_test__';
                localStorage.setItem(testKey, testKey);
                localStorage.removeItem(testKey);
                return true;
            } catch (e) {
                return false;
            }
        })(),
        
        get: function(key, defaultValue = null) {
            if (!this.isAvailable) return defaultValue;
            
            try {
                const item = localStorage.getItem(key);
                return item !== null ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error(`Error retrieving ${key} from localStorage:`, error);
                return defaultValue;
            }
        },
        
        set: function(key, value) {
            if (!this.isAvailable) {
                console.warn('localStorage is not available - data will not persist');
                return false;
            }
            
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error(`Error saving ${key} to localStorage:`, error);
                return false;
            }
        }
    };
    
    // Main debug panel implementation
    function createDebugPanel() {
        console.log('Creating consolidated debug panel...');
            
        // First remove any debug panels created by other systems
        removeExistingDebugPanels();
        
        // Check if our panel already exists to avoid duplicates
        let panel = document.getElementById(CONFIG.panelId);
        if (panel) {
            console.log('Debug panel already exists, showing existing panel');
            panel.style.display = 'flex';
            
            // Make sure panel is at a good position
            if (!panel.style.left || !panel.style.top) {
                panel.style.left = '100px';
                panel.style.top = '100px';
            }
            
            // Ensure z-index is high
            panel.style.zIndex = '9000';
            
            // Update ARIA attributes for the debug button
            const debugButton = document.getElementById('open-debug-panel');
            if (debugButton) {
                debugButton.setAttribute('aria-expanded', 'true');
            }
            
            return panel;
        }
        
        // Create panel
        try {
            console.log('Creating new debug panel');
            
            // Try multiple panel creation methods for best compatibility
            
            // Method 1: Check for built-in panel creation function
            if (typeof window.createPanel === 'function') {
                try {
                    console.log('Using window.createPanel function');
                    panel = window.createPanel(CONFIG.panelTitle);
                    
                    // Handle different return types
                    if (typeof panel === 'string') {
                        // String ID was returned, look for panel in DOM
                        console.log('Panel creation returned ID:', panel);
                        
                        // Try multiple selectors to find the panel
                        let panelElem = document.querySelector(`.panel[data-id="${panel}"]`);
                        
                        // If not found with data-id, try id selector
                        if (!panelElem) {
                            panelElem = document.getElementById(panel);
                        }
                        
                        // If not found with id, try class selector (if it looks like a class)
                        if (!panelElem && panel.startsWith('.')) {
                            panelElem = document.querySelector(panel);
                        }
                        
                        if (panelElem) {
                            panel = panelElem;
                            panel.id = CONFIG.panelId;
                            panel.style.width = CONFIG.defaultWidth;
                            panel.style.height = CONFIG.defaultHeight;
                            panel.style.zIndex = '9000';
                            console.log('Found panel by ID in DOM');
                        } else {
                            // Wait a bit longer for the panel to be added to DOM (some panel systems are async)
                            setTimeout(() => {
                                // Try all selector types again
                                let delayedPanel = document.querySelector(`.panel[data-id="${panel}"]`);
                                if (!delayedPanel) delayedPanel = document.getElementById(panel);
                                if (!delayedPanel && panel.startsWith('.')) delayedPanel = document.querySelector(panel);
                                
                                if (delayedPanel) {
                                    delayedPanel.id = CONFIG.panelId;
                                    delayedPanel.style.width = CONFIG.defaultWidth;
                                    delayedPanel.style.height = CONFIG.defaultHeight;
                                    delayedPanel.style.zIndex = '9000';
                                    populateDebugPanel(delayedPanel);
                                    console.log('Found panel in DOM after delay');
                                } else {
                                    console.warn('Panel not found in DOM even after delay:', panel);
                                }
                            }, 200); // Increased timeout for slower systems
                            console.warn('Panel not immediately found in DOM, will retry');
                            panel = null; // Will fall back to next method
                        }
                    } else if (panel && typeof panel === 'object' && panel.querySelector) {
                        // DOM Element was returned
                        panel.id = CONFIG.panelId;
                        
                        // Ensure panel has good dimensions
                        panel.style.width = CONFIG.defaultWidth;
                        panel.style.height = CONFIG.defaultHeight;
                        panel.style.zIndex = '9000';
                        
                        console.log('Panel created successfully with window.createPanel');
                    } else {
                        console.warn('window.createPanel did not return a valid panel element or ID. Return value:', panel, 'Type:', typeof panel);
                        panel = null; // Will fall back to next method
                    }
                } catch (e) {
                    console.warn('Error using window.createPanel:', e);
                    panel = null; // Will fall back to next method
                }
            }
            
            // Method 2: Check for CyberpunkGM built-in panel creation
            if (!panel && window.CyberpunkGM && typeof window.CyberpunkGM.Layout?.createPanel === 'function') {
                try {
                    console.log('Using CyberpunkGM.Layout.createPanel');
                    panel = window.CyberpunkGM.Layout.createPanel(CONFIG.panelTitle);
                    
                    // Handle different return types
                    if (typeof panel === 'string') {
                        // String ID was returned, look for panel in DOM
                        console.log('CyberpunkGM.Layout returned ID:', panel);
                        
                        // Try multiple selectors to find the panel
                        let panelElem = document.querySelector(`.panel[data-id="${panel}"]`);
                        
                        // If not found with data-id, try id selector
                        if (!panelElem) {
                            panelElem = document.getElementById(panel);
                        }
                        
                        // If not found with id, try class selector (if it looks like a class)
                        if (!panelElem && panel.startsWith('.')) {
                            panelElem = document.querySelector(panel);
                        }
                        
                        if (panelElem) {
                            panel = panelElem;
                            panel.id = CONFIG.panelId;
                            panel.style.width = CONFIG.defaultWidth;
                            panel.style.height = CONFIG.defaultHeight;
                            panel.style.zIndex = '9000';
                            console.log('Found CyberpunkGM panel by ID in DOM');
                        } else {
                            // Wait a bit longer for the panel to be added to DOM (some panel systems are async)
                            setTimeout(() => {
                                // Try all selector types again
                                let delayedPanel = document.querySelector(`.panel[data-id="${panel}"]`);
                                if (!delayedPanel) delayedPanel = document.getElementById(panel);
                                if (!delayedPanel && panel.startsWith('.')) delayedPanel = document.querySelector(panel);
                                
                                if (delayedPanel) {
                                    delayedPanel.id = CONFIG.panelId;
                                    delayedPanel.style.width = CONFIG.defaultWidth;
                                    delayedPanel.style.height = CONFIG.defaultHeight;
                                    delayedPanel.style.zIndex = '9000';
                                    populateDebugPanel(delayedPanel);
                                    console.log('Found CyberpunkGM panel in DOM after delay');
                                } else {
                                    console.warn('CyberpunkGM panel not found in DOM even after delay:', panel);
                                }
                            }, 200); // Increased timeout for slower systems
                            console.warn('CyberpunkGM panel not immediately found in DOM, will retry');
                            panel = null; // Will fall back to next method
                        }
                    } else if (panel && typeof panel === 'object' && panel.querySelector) {
                        // DOM Element was returned
                        panel.id = CONFIG.panelId;
                        panel.style.width = CONFIG.defaultWidth;
                        panel.style.height = CONFIG.defaultHeight;
                        panel.style.zIndex = '9000';
                        
                        console.log('Panel created successfully with CyberpunkGM.Layout.createPanel');
                    } else {
                        console.warn('CyberpunkGM.Layout.createPanel did not return valid panel or ID. Return value:', panel, 'Type:', typeof panel);
                        panel = null;
                    }
                } catch (e) {
                    console.warn('Error with CyberpunkGM.Layout.createPanel:', e);
                    panel = null;
                }
            }
            
            // Fallback method: Create our own panel from scratch
            if (!panel) {
                console.log('Using fallback panel creation method');
                
                // Fallback panel creation
                panel = DOM.createElement('div', {
                    id: CONFIG.panelId,
                    className: 'panel',
                    style: {
                        width: CONFIG.defaultWidth,
                        height: CONFIG.defaultHeight,
                        position: 'absolute',
                        left: '100px',
                        top: '100px',
                        zIndex: '9000',
                        backgroundColor: 'rgba(30, 30, 45, 0.85)',
                        border: '1px solid #00ccff',
                        borderRadius: '4px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                });
                
                // Add HTML structure for panel
                panel.innerHTML = `
                    <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center; 
                         padding: 8px; background-color: rgba(10, 10, 20, 0.8); cursor: move; border-bottom: 1px solid #00ccff;">
                        <div>${CONFIG.panelTitle}</div>
                        <button class="close-button" style="background: none; border: none; color: #e0e0e0; 
                                font-size: 18px; cursor: pointer;">&times;</button>
                    </div>
                    <div class="panel-content" style="flex: 1; overflow: auto; padding: 10px;"></div>
                    <div class="resize-handle" style="position: absolute; bottom: 0; right: 0; width: 15px; 
                         height: 15px; cursor: nwse-resize; background: transparent;"></div>
                `;
                
                // Add panel to document body
                document.body.appendChild(panel);
                
                // Add minimal dragging functionality if not using existing panel system
                const header = panel.querySelector('.panel-header');
                if (header) {
                    header.addEventListener('mousedown', function(e) {
                        e.preventDefault();
                        let startX = e.clientX;
                        let startY = e.clientY;
                        let startLeft = parseInt(panel.style.left) || 0;
                        let startTop = parseInt(panel.style.top) || 0;
                        
                        function movePanel(e) {
                            panel.style.left = (startLeft + e.clientX - startX) + 'px';
                            panel.style.top = (startTop + e.clientY - startY) + 'px';
                        }
                        
                        function stopMoving() {
                            document.removeEventListener('mousemove', movePanel);
                            document.removeEventListener('mouseup', stopMoving);
                        }
                        
                        document.addEventListener('mousemove', movePanel);
                        document.addEventListener('mouseup', stopMoving);
                    });
                }
                
                // Add resize functionality
                const resizeHandle = panel.querySelector('.resize-handle');
                if (resizeHandle) {
                    resizeHandle.addEventListener('mousedown', function(e) {
                        e.preventDefault();
                        let startX = e.clientX;
                        let startY = e.clientY;
                        let startWidth = parseInt(panel.style.width) || 400;
                        let startHeight = parseInt(panel.style.height) || 300;
                        
                        function resizePanel(e) {
                            panel.style.width = (startWidth + e.clientX - startX) + 'px';
                            panel.style.height = (startHeight + e.clientY - startY) + 'px';
                        }
                        
                        function stopResizing() {
                            document.removeEventListener('mousemove', resizePanel);
                            document.removeEventListener('mouseup', stopResizing);
                            panel.classList.remove('resizing');
                        }
                        
                        panel.classList.add('resizing');
                        document.addEventListener('mousemove', resizePanel);
                        document.addEventListener('mouseup', stopResizing);
                    });
                }
                
                // Add close functionality
                const closeButton = panel.querySelector('.close-button');
                if (closeButton) {
                    closeButton.addEventListener('click', function() {
                        panel.style.display = 'none';
                    });
                }
                
                console.log('Panel created using fallback method');
            }
            
            // Final verification
            if (!panel || !panel.querySelector) {
                throw new Error('Failed to create a valid panel');
            }
            
            // Add metadata
            panel.setAttribute('data-debug-version', '1.0.0');
            panel.setAttribute('data-panel-type', 'debug');
            
            // Add ARIA attributes for improved accessibility
            panel.setAttribute('role', 'dialog');
            panel.setAttribute('aria-labelledby', 'debug-panel-title');
            panel.setAttribute('aria-modal', 'true');
            
            // Update ARIA attributes for the debug button
            const debugButton = document.getElementById('open-debug-panel');
            if (debugButton) {
                debugButton.setAttribute('aria-expanded', 'true');
                
                // Add event listener to reset aria-expanded when panel is closed
                const closeButton = panel.querySelector('.panel-header .close-button');
                if (closeButton) {
                    closeButton.addEventListener('click', function() {
                        debugButton.setAttribute('aria-expanded', 'false');
                    });
                }
            }
            
            // Populate panel content
            populateDebugPanel(panel);
            
            console.log('Debug panel created successfully');
            return panel;
        } catch (error) {
            console.error('Error creating debug panel:', error);
            // Ultimate fallback - basic alert box
            alert('Error creating debug panel: ' + error.message);
            return null;
        }
    }
    
    // Populate debug panel with debugging tools
    function populateDebugPanel(panel) {
        if (!panel) return;
        
        const content = panel.querySelector('.panel-content');
        if (!content) return;
        
        // Add ARIA role to content area
        content.setAttribute('role', 'region');
        content.setAttribute('aria-label', 'Debug Panel Content');
        
        // Create tabs for different debugging functions with ARIA roles and attributes
        content.innerHTML = `
            <div class="debug-tabs" role="tablist" aria-label="Debug Tool Functions">
                <button class="debug-tab active" data-tab="system" role="tab" aria-selected="true" aria-controls="system-tab" id="system-tab-button">System Info</button>
                <button class="debug-tab" data-tab="panels" role="tab" aria-selected="false" aria-controls="panels-tab" id="panels-tab-button">Panel Debug</button>
                <button class="debug-tab" data-tab="local-storage" role="tab" aria-selected="false" aria-controls="local-storage-tab" id="local-storage-tab-button">Storage</button>
                <button class="debug-tab" data-tab="console" role="tab" aria-selected="false" aria-controls="console-tab" id="console-tab-button">Console</button>
            </div>
            
            <div class="debug-tab-content" id="system-tab" role="tabpanel" aria-labelledby="system-tab-button">
                <h3>System Information</h3>
                <div class="debug-info-grid">
                    <div class="debug-info-row">
                        <div class="debug-info-label">User Agent:</div>
                        <div class="debug-info-value">${navigator.userAgent}</div>
                    </div>
                    <div class="debug-info-row">
                        <div class="debug-info-label">Window Size:</div>
                        <div class="debug-info-value">${window.innerWidth}px × ${window.innerHeight}px</div>
                    </div>
                    <div class="debug-info-row">
                        <div class="debug-info-label">Pixel Ratio:</div>
                        <div class="debug-info-value">${window.devicePixelRatio}</div>
                    </div>
                    <div class="debug-info-row">
                        <div class="debug-info-label">Theme:</div>
                        <div class="debug-info-value">${getCurrentTheme()}</div>
                    </div>
                    <div class="debug-info-row">
                        <div class="debug-info-label">Document State:</div>
                        <div class="debug-info-value">${document.readyState}</div>
                    </div>
                </div>
                <div class="debug-tools">
                    <button id="debug-refresh-info">Refresh Info</button>
                    <button id="debug-check-functions">Check Core Functions</button>
                </div>
            </div>
            
            <div class="debug-tab-content" id="panels-tab" role="tabpanel" aria-labelledby="panels-tab-button" style="display:none;">
                <h3>Panel Debugging</h3>
                <div class="debug-info-grid">
                    <div class="debug-info-row">
                        <div class="debug-info-label">Active Panels:</div>
                        <div class="debug-info-value" id="active-panels-count">0</div>
                    </div>
                    <div class="debug-info-row">
                        <div class="debug-info-label">Z-Index Range:</div>
                        <div class="debug-info-value" id="z-index-range">N/A</div>
                    </div>
                </div>
                <div class="debug-panels-list" id="debug-panels-list">
                    <em>No panels found</em>
                </div>
                <div class="debug-tools">
                    <button id="debug-organize-panels">Auto-Organize Panels</button>
                    <button id="debug-fit-to-window">Fit Panels to Window</button>
                    <button id="debug-reset-all-panels">Reset All Panels</button>
                </div>
            </div>
            
            <div class="debug-tab-content" id="local-storage-tab" role="tabpanel" aria-labelledby="local-storage-tab-button" style="display:none;">
                <h3>Local Storage</h3>
                <div class="debug-info-grid">
                    <div class="debug-info-row">
                        <div class="debug-info-label">Storage Available:</div>
                        <div class="debug-info-value">${Storage.isAvailable ? 'Yes' : 'No'}</div>
                    </div>
                    <div class="debug-info-row">
                        <div class="debug-info-label">Items Count:</div>
                        <div class="debug-info-value" id="storage-items-count">0</div>
                    </div>
                </div>
                <div class="debug-storage-list" id="debug-storage-list">
                    <em>No items found</em>
                </div>
                <div class="debug-tools">
                    <button id="debug-clear-storage">Clear All Storage</button>
                    <button id="debug-refresh-storage">Refresh Storage</button>
                </div>
            </div>
            
            <div class="debug-tab-content" id="console-tab" role="tabpanel" aria-labelledby="console-tab-button" style="display:none;">
                <h3>Debug Console</h3>
                <div class="debug-console-output" id="debug-console-output">
                    <div class="debug-console-entry">Debug console initialized</div>
                </div>
                <div class="debug-console-input">
                    <input type="text" id="debug-console-command" placeholder="Enter command...">
                    <button id="debug-console-run">Run</button>
                </div>
                <div class="debug-console-hints">
                    <small>Try: checkPanels(), listStorage(), or help()</small>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .debug-tabs {
                display: flex;
                border-bottom: 1px solid rgba(0, 204, 255, 0.5);
                margin-bottom: 10px;
            }
            
            .debug-tab {
                background: none;
                border: none;
                color: #e0e0e0;
                padding: 5px 10px;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                margin-right: 5px;
            }
            
            .debug-tab.active {
                border-bottom: 2px solid #00ccff;
                color: #00ccff;
            }
            
            .debug-tab-content {
                padding: 5px 0;
            }
            
            .debug-tab-content h3 {
                margin-top: 0;
                color: #00ccff;
                font-size: 16px;
                border-bottom: 1px solid rgba(0, 204, 255, 0.3);
                padding-bottom: 5px;
                margin-bottom: 10px;
            }
            
            .debug-info-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 5px;
                margin-bottom: 15px;
            }
            
            .debug-info-row {
                display: grid;
                grid-template-columns: 120px 1fr;
                align-items: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding: 3px 0;
            }
            
            .debug-info-label {
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
            }
            
            .debug-info-value {
                color: #00ccff;
                font-size: 14px;
                word-break: break-word;
            }
            
            .debug-tools {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 10px;
            }
            
            .debug-tools button {
                background-color: rgba(0, 60, 100, 0.5);
                color: #e0e0e0;
                border: 1px solid #00ccff;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .debug-tools button:hover {
                background-color: rgba(0, 80, 120, 0.5);
            }
            
            .debug-panels-list, .debug-storage-list {
                max-height: 150px;
                overflow-y: auto;
                border: 1px solid rgba(0, 204, 255, 0.3);
                padding: 5px;
                margin: 10px 0;
                font-size: 13px;
                background-color: rgba(0, 0, 0, 0.2);
            }
            
            .debug-panels-list div, .debug-storage-list div {
                padding: 3px 5px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .debug-console-output {
                height: 150px;
                overflow-y: auto;
                border: 1px solid rgba(0, 204, 255, 0.3);
                padding: 5px;
                margin-bottom: 10px;
                font-family: monospace;
                font-size: 12px;
                background-color: rgba(0, 0, 0, 0.2);
            }
            
            .debug-console-entry {
                padding: 2px 0;
                word-wrap: break-word;
            }
            
            .debug-console-entry.error {
                color: #ff5555;
            }
            
            .debug-console-entry.info {
                color: #00ccff;
            }
            
            .debug-console-entry.success {
                color: #55cc55;
            }
            
            .debug-console-input {
                display: flex;
                margin-bottom: 5px;
            }
            
            .debug-console-input input {
                flex: 1;
                background-color: rgba(20, 20, 35, 0.8);
                color: #e0e0e0;
                border: 1px solid rgba(0, 204, 255, 0.5);
                padding: 5px;
                font-family: monospace;
            }
            
            .debug-console-input button {
                background-color: rgba(0, 60, 100, 0.5);
                color: #e0e0e0;
                border: 1px solid #00ccff;
                padding: 5px 10px;
                cursor: pointer;
                margin-left: 5px;
            }
            
            .debug-console-hints {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.5);
                text-align: right;
            }
        `;
        document.head.appendChild(style);
        
        // Set up tab switching with proper ARIA support
        const tabs = content.querySelectorAll('.debug-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Hide all tab contents
                content.querySelectorAll('.debug-tab-content').forEach(tabContent => {
                    tabContent.style.display = 'none';
                });
                
                // Remove active class from all tabs and update ARIA attributes
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                    t.tabIndex = -1;
                });
                
                // Show selected tab content
                const tabName = this.getAttribute('data-tab');
                const tabContent = content.querySelector(`#${tabName}-tab`);
                if (tabContent) {
                    tabContent.style.display = 'block';
                }
                
                // Mark this tab as active and update its ARIA attributes
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                this.tabIndex = 0;
                
                // Run tab-specific initialization
                if (tabName === 'panels') {
                    refreshPanelInfo();
                } else if (tabName === 'local-storage') {
                    refreshStorageInfo();
                }
            });
            
            // Handle keyboard navigation for tabs
            tab.addEventListener('keydown', function(e) {
                // Handle left/right arrow keys for tab navigation
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    
                    const tabArray = Array.from(tabs);
                    const currentIndex = tabArray.indexOf(this);
                    let nextIndex;
                    
                    if (e.key === 'ArrowRight') {
                        nextIndex = (currentIndex + 1) % tabArray.length;
                    } else {
                        nextIndex = (currentIndex - 1 + tabArray.length) % tabArray.length;
                    }
                    
                    tabArray[nextIndex].click();
                    tabArray[nextIndex].focus();
                }
            });
        });
        
        // Initialize System tab buttons
        const refreshInfoBtn = content.querySelector('#debug-refresh-info');
        if (refreshInfoBtn) {
            refreshInfoBtn.addEventListener('click', function() {
                const systemTab = content.querySelector('#system-tab');
                if (systemTab) {
                    const windowSizeValue = systemTab.querySelector('.debug-info-row:nth-child(2) .debug-info-value');
                    if (windowSizeValue) {
                        windowSizeValue.textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
                    }
                    
                    const themeValue = systemTab.querySelector('.debug-info-row:nth-child(4) .debug-info-value');
                    if (themeValue) {
                        themeValue.textContent = getCurrentTheme();
                    }
                }
                logToConsole('System info refreshed', 'info');
            });
        }
        
        const checkFunctionsBtn = content.querySelector('#debug-check-functions');
        if (checkFunctionsBtn) {
            checkFunctionsBtn.addEventListener('click', function() {
                const coreFunctions = [
                    'createPanel', 
                    'loadLayout', 
                    'saveLayout', 
                    'clearLayout',
                    'autoOrganize',
                    'fitToWindow',
                    'createNotesPanel',
                    'createCharacterPanel'
                ];
                
                let report = '';
                coreFunctions.forEach(func => {
                    const exists = typeof window[func] === 'function';
                    report += `${func}: ${exists ? 'Available' : 'Missing'}\n`;
                });
                
                logToConsole('Core Function Check:', 'info');
                logToConsole(report);
            });
        }
        
        // Initialize Panels tab buttons
        const organizePanelsBtn = content.querySelector('#debug-organize-panels');
        if (organizePanelsBtn) {
            organizePanelsBtn.addEventListener('click', function() {
                if (typeof window.autoOrganize === 'function') {
                    const result = window.autoOrganize();
                    logToConsole(`Auto-organize panels: ${result ? 'Success' : 'Failed'}`, result ? 'success' : 'error');
                } else if (typeof CyberpunkGM?.Layout?.autoOrganize === 'function') {
                    const result = CyberpunkGM.Layout.autoOrganize();
                    logToConsole(`Auto-organize panels: ${result ? 'Success' : 'Failed'}`, result ? 'success' : 'error');
                } else {
                    logToConsole('Auto-organize function not available', 'error');
                }
                
                // Refresh panel info
                refreshPanelInfo();
            });
        }
        
        const fitToWindowBtn = content.querySelector('#debug-fit-to-window');
        if (fitToWindowBtn) {
            fitToWindowBtn.addEventListener('click', function() {
                if (typeof window.fitToWindow === 'function') {
                    const result = window.fitToWindow();
                    logToConsole(`Fit panels to window: ${result ? 'Success' : 'Failed'}`, result ? 'success' : 'error');
                } else if (typeof CyberpunkGM?.Layout?.fitToWindow === 'function') {
                    const result = CyberpunkGM.Layout.fitToWindow();
                    logToConsole(`Fit panels to window: ${result ? 'Success' : 'Failed'}`, result ? 'success' : 'error');
                } else {
                    logToConsole('Fit to window function not available', 'error');
                }
                
                // Refresh panel info
                refreshPanelInfo();
            });
        }
        
        const resetPanelsBtn = content.querySelector('#debug-reset-all-panels');
        if (resetPanelsBtn) {
            resetPanelsBtn.addEventListener('click', function() {
                if (typeof window.clearLayout === 'function') {
                    window.clearLayout();
                    logToConsole('All panels reset/cleared', 'info');
                } else if (typeof CyberpunkGM?.Layout?.clearLayout === 'function') {
                    CyberpunkGM.Layout.clearLayout();
                    logToConsole('All panels reset/cleared', 'info');
                } else {
                    logToConsole('Clear layout function not available', 'error');
                }
                
                // Refresh panel info
                refreshPanelInfo();
            });
        }
        
        // Initialize Storage tab buttons
        const clearStorageBtn = content.querySelector('#debug-clear-storage');
        if (clearStorageBtn) {
            clearStorageBtn.addEventListener('click', function() {
                if (confirm('This will clear ALL localStorage data. Are you sure?')) {
                    try {
                        localStorage.clear();
                        logToConsole('All localStorage cleared', 'info');
                        refreshStorageInfo();
                    } catch (error) {
                        logToConsole(`Error clearing localStorage: ${error.message}`, 'error');
                    }
                }
            });
        }
        
        const refreshStorageBtn = content.querySelector('#debug-refresh-storage');
        if (refreshStorageBtn) {
            refreshStorageBtn.addEventListener('click', function() {
                refreshStorageInfo();
                logToConsole('Storage info refreshed', 'info');
            });
        }
        
        // Initialize Console tab
        const consoleInput = content.querySelector('#debug-console-command');
        const consoleRunBtn = content.querySelector('#debug-console-run');
        
        if (consoleInput && consoleRunBtn) {
            // Run command function
            function runCommand() {
                const command = consoleInput.value.trim();
                if (!command) return;
                
                logToConsole(`> ${command}`);
                
                try {
                    // Define custom debug commands
                    const debugCommands = {
                        help: function() {
                            return `Available commands:
- help(): Show this help message
- checkPanels(): Show all panels
- listStorage(): List all localStorage items
- getStorageItem(key): Get a specific localStorage item
- clearStorage(): Clear all localStorage
- showTheme(): Show current theme settings`;
                        },
                        checkPanels: function() {
                            const panels = document.querySelectorAll('.panel');
                            return `Found ${panels.length} panels`;
                        },
                        listStorage: function() {
                            try {
                                const items = Object.keys(localStorage);
                                return `Found ${items.length} storage items: ${items.join(', ')}`;
                            } catch (error) {
                                return `Error accessing localStorage: ${error.message}`;
                            }
                        },
                        getStorageItem: function(key) {
                            try {
                                const value = localStorage.getItem(key);
                                return value ? `${key}: ${value}` : `Key "${key}" not found`;
                            } catch (error) {
                                return `Error: ${error.message}`;
                            }
                        },
                        clearStorage: function() {
                            try {
                                localStorage.clear();
                                refreshStorageInfo();
                                return 'All localStorage cleared';
                            } catch (error) {
                                return `Error: ${error.message}`;
                            }
                        },
                        showTheme: function() {
                            return `Current theme: ${getCurrentTheme()}`;
                        }
                    };
                    
                    // Parse command
                    let result;
                    if (command in debugCommands) {
                        result = debugCommands[command]();
                    } else if (command.includes('(') && command.includes(')')) {
                        // Function call pattern
                        const funcName = command.substring(0, command.indexOf('('));
                        const argsStr = command.substring(command.indexOf('(') + 1, command.lastIndexOf(')'));
                        
                        if (funcName in debugCommands) {
                            // Handle arguments - very simple parsing
                            const args = argsStr ? argsStr.split(',').map(arg => {
                                arg = arg.trim();
                                if (arg.startsWith('"') && arg.endsWith('"')) {
                                    return arg.slice(1, -1);
                                }
                                return arg;
                            }) : [];
                            
                            result = debugCommands[funcName](...args);
                        } else {
                            throw new Error(`Unknown command: ${funcName}`);
                        }
                    } else {
                        throw new Error(`Unknown command: ${command}`);
                    }
                    
                    logToConsole(result, 'success');
                } catch (error) {
                    logToConsole(`Error: ${error.message}`, 'error');
                }
                
                // Clear input after running
                consoleInput.value = '';
            }
            
            // Add enter key handler
            consoleInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    runCommand();
                }
            });
            
            // Add button click handler
            consoleRunBtn.addEventListener('click', runCommand);
        }
        
        // Initial setup
        refreshPanelInfo();
        refreshStorageInfo();
    }
    
    // Get the current theme name
    function getCurrentTheme() {
        const html = document.documentElement;
        const body = document.body;
        
        // Check for theme classes or data attributes
        if (body.classList.contains('theme-cyberpunk')) return 'Cyberpunk';
        if (body.classList.contains('theme-neon')) return 'Neon';
        if (body.classList.contains('theme-noir')) return 'Tech Noir';
        if (body.dataset.theme) return body.dataset.theme;
        
        // Check for CSS custom properties that might indicate theme
        const computedStyle = getComputedStyle(html);
        const primaryColor = computedStyle.getPropertyValue('--theme-primary').trim();
        
        if (primaryColor === '#ff5555' || primaryColor === 'rgb(255, 85, 85)') return 'Neon Synthwave';
        if (primaryColor === '#00ccff' || primaryColor === 'rgb(0, 204, 255)') return 'Cyberpunk (Default)';
        
        return 'Unknown';
    }
    
    // Refresh panel information
    function refreshPanelInfo() {
        const panelsTab = document.getElementById('panels-tab');
        if (!panelsTab) return;
        
        const panels = document.querySelectorAll('.panel');
        const panelsCount = document.getElementById('active-panels-count');
        const zIndexRange = document.getElementById('z-index-range');
        const panelsList = document.getElementById('debug-panels-list');
        
        if (panelsCount) {
            panelsCount.textContent = panels.length;
        }
        
        if (zIndexRange && panels.length > 0) {
            // Calculate Z-index range
            let minZ = Infinity;
            let maxZ = -Infinity;
            
            panels.forEach(panel => {
                const zIndex = parseInt(getComputedStyle(panel).zIndex) || 0;
                minZ = Math.min(minZ, zIndex);
                maxZ = Math.max(maxZ, zIndex);
            });
            
            zIndexRange.textContent = minZ === Infinity ? 'N/A' : `${minZ} - ${maxZ}`;
        } else if (zIndexRange) {
            zIndexRange.textContent = 'N/A';
        }
        
        if (panelsList) {
            if (panels.length === 0) {
                panelsList.innerHTML = '<em>No panels found</em>';
            } else {
                let html = '';
                panels.forEach((panel, index) => {
                    const title = panel.querySelector('.panel-header div')?.textContent || 'Untitled';
                    const zIndex = getComputedStyle(panel).zIndex;
                    const position = `${panel.style.left}, ${panel.style.top}`;
                    const size = `${panel.style.width} × ${panel.style.height}`;
                    
                    html += `<div>${index + 1}. <strong>${title}</strong> (z-index: ${zIndex}) - ${position} - ${size}</div>`;
                });
                panelsList.innerHTML = html;
            }
        }
    }
    
    // Refresh storage information
    function refreshStorageInfo() {
        const storageTab = document.getElementById('local-storage-tab');
        if (!storageTab) return;
        
        const itemsCount = document.getElementById('storage-items-count');
        const storageList = document.getElementById('debug-storage-list');
        
        try {
            const keys = Object.keys(localStorage);
            
            if (itemsCount) {
                itemsCount.textContent = keys.length;
            }
            
            if (storageList) {
                if (keys.length === 0) {
                    storageList.innerHTML = '<em>No items found</em>';
                } else {
                    let html = '';
                    keys.forEach(key => {
                        let value = localStorage.getItem(key);
                        
                        // Truncate long values
                        if (value && value.length > 100) {
                            value = value.substring(0, 100) + '...';
                        }
                        
                        html += `<div><strong>${key}</strong>: ${value}</div>`;
                    });
                    storageList.innerHTML = html;
                }
            }
        } catch (error) {
            console.error('Error refreshing storage info:', error);
            
            if (storageList) {
                storageList.innerHTML = `<div class="error">Error accessing localStorage: ${error.message}</div>`;
            }
        }
    }
    
    // Log to the console tab
    function logToConsole(message, type = '') {
        const consoleOutput = document.getElementById('debug-console-output');
        if (!consoleOutput) return;
        
        const entry = document.createElement('div');
        entry.className = 'debug-console-entry';
        
        if (type) {
            entry.classList.add(type);
        }
        
        entry.textContent = message;
        consoleOutput.appendChild(entry);
        
        // Scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    // Remove existing debug panels
    function removeExistingDebugPanels() {
        try {
            // Find all panels first
            const allPanels = document.querySelectorAll('.panel');
            let removed = 0;
            
            // Check each panel for debug-related content in the title
            allPanels.forEach(panel => {
                try {
                    // Get the header text if available
                    const headerDiv = panel.querySelector('.panel-header div');
                    const headerText = headerDiv ? headerDiv.textContent || '' : '';
                    
                    // Also check direct header text as fallback
                    const header = panel.querySelector('.panel-header');
                    const directHeaderText = header ? header.textContent || '' : '';
                    
                    // Check if this panel is a debug panel
                    if (
                        panel.id && panel.id.includes('debug') ||
                        headerText.includes('Debug') || 
                        headerText.includes('Emergency') ||
                        directHeaderText.includes('Debug') || 
                        directHeaderText.includes('Emergency')
                    ) {
                        panel.remove();
                        removed++;
                    }
                } catch (innerError) {
                    console.warn('Error checking panel:', innerError);
                }
            });
            
            console.log(`Removed ${removed} existing debug panels`);
            return true;
        } catch (error) {
            console.error('Error in removeExistingDebugPanels:', error);
            return false;
        }
    }
    
    // Initialize debug tools (called on page load)
    function init() {
        console.log('Initializing consolidated debug panel system...');
        
        // First remove any existing debug panels
        removeExistingDebugPanels();
        
        // Override any existing debug-related functions
        // Store original function if it exists for emergency fallback
        if (typeof window.createDebugPanel === 'function') {
            console.log('Replacing existing createDebugPanel function');
            window._originalCreateDebugPanel = window.createDebugPanel;
        }
        
        // Add enhanced createDebugPanel function to window
        window.createDebugPanel = function() {
            try {
                return CyberpunkGM.Debug.createDebugPanel();
            } catch (error) {
                console.error('Error in consolidated createDebugPanel:', error);
                // Fall back to original if available
                if (typeof window._originalCreateDebugPanel === 'function') {
                    console.warn('Falling back to original debug panel implementation');
                    return window._originalCreateDebugPanel();
                }
                return null;
            }
        };
        
        // Also replace emergency debug tools functions
        if (typeof window.createEmergencyDebugTools === 'function') {
            console.log('Replacing emergency debug tools function');
            window._originalEmergencyDebugTools = window.createEmergencyDebugTools;
            window.createEmergencyDebugTools = window.createDebugPanel;
        }
        
        // Block any emergency debug panel functions
        window.createEmergencyDebugPanel = window.createDebugPanel;
        
        // Add debug panel to menu if needed
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addDebugMenuOption);
        } else {
            // Small delay to ensure DOM is fully processed
            setTimeout(addDebugMenuOption, 100);
        }
        
        // Also watch for debug panels created after our initialization
        observeDebugPanels();
        
        console.log('Consolidated debug panel system initialized');
    }
    
    // Observe DOM for any newly created debug panels
    function observeDebugPanels() {
        try {
            // Create a MutationObserver to watch for newly added panels
            const observer = new MutationObserver(function(mutations) {
                let shouldCheck = false;
                
                // Check if any panels were added
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check if any added nodes are panels or contain panels
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1) { // Element node
                                if (
                                    node.classList && node.classList.contains('panel') ||
                                    node.querySelector && node.querySelector('.panel')
                                ) {
                                    shouldCheck = true;
                                    break;
                                }
                            }
                        }
                        
                        if (shouldCheck) break;
                    }
                }
                
                // If panels were added, check for debug panels
                if (shouldCheck) {
                    // Small delay to ensure panels are fully initialized
                    setTimeout(function() {
                        // Get all panels
                        const allPanels = document.querySelectorAll('.panel');
                        
                        // Check each panel for debug-related content in the title
                        allPanels.forEach(panel => {
                            try {
                                // Skip our own debug panel
                                if (panel.id === CONFIG.panelId) return;
                                
                                // Get the header text if available
                                const headerDiv = panel.querySelector('.panel-header div');
                                const headerText = headerDiv ? headerDiv.textContent || '' : '';
                                
                                // Check if this is a debug panel
                                if (
                                    headerText.includes('Debug') || 
                                    headerText.includes('Emergency')
                                ) {
                                    console.log('Found new debug panel:', headerText);
                                    panel.remove();
                                    console.log('Removed duplicate debug panel');
                                }
                            } catch (innerError) {
                                console.warn('Error checking panel:', innerError);
                            }
                        });
                    }, 100);
                }
            });
            
            // Observe the document body for added nodes
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Store observer for cleanup
            CyberpunkGM.Debug._observer = observer;
            
            console.log('Debug panel observer initialized');
        } catch (error) {
            console.error('Error setting up debug panel observer:', error);
        }
    }
    
    // Add debug panel option to Tools menu
    function addDebugMenuOption() {
        try {
            console.log('Adding debug panel menu option...');
            
            // Try all possible menu selectors
            const menuSelectors = [
                '.dropdown-content',                                 // General dropdown
                '.toolbar .dropdown:nth-child(3) .dropdown-content', // Third dropdown (usually Tools)
                '.dropdown:has(button:contains("Tools")) .dropdown-content',   // Button containing "Tools"
                '#tools-menu .dropdown-content',                     // Tools menu by ID
                '.toolbar-links .dropdown-content',                  // Toolbar links
                'nav .dropdown-content'                              // Nav dropdowns
            ];
            
            // Try each selector to find dropdown contents
            let foundMenus = [];
            for (const selector of menuSelectors) {
                try {
                    const menus = document.querySelectorAll(selector);
                    if (menus && menus.length > 0) {
                        foundMenus = foundMenus.concat(Array.from(menus));
                    }
                } catch (e) {
                    // Skip selector if it doesn't work
                }
            }
            
            // Remove duplicates
            foundMenus = [...new Set(foundMenus)];
            console.log(`Found ${foundMenus.length} potential dropdown menus to add debug panel to`);
            
            // Look for tools menu specifically
            let toolsMenus = [];
            for (const menu of foundMenus) {
                try {
                    // Look for links in this menu that contain "Tools" related text
                    const links = menu.querySelectorAll('a');
                    let isToolsMenu = false;
                    
                    for (const link of links) {
                        const text = link.textContent || '';
                        if (
                            text.includes('Tool') || 
                            text.includes('Utility') || 
                            text.includes('Debug') || 
                            text.includes('Panel')
                        ) {
                            isToolsMenu = true;
                            break;
                        }
                    }
                    
                    // Also check parent elements for Tools text
                    const parent = menu.parentElement;
                    if (parent) {
                        const parentText = parent.textContent || '';
                        if (
                            parentText.includes('Tool') || 
                            parentText.includes('Utility') || 
                            parentText.includes('Debug')
                        ) {
                            isToolsMenu = true;
                        }
                    }
                    
                    if (isToolsMenu) {
                        toolsMenus.push(menu);
                    }
                } catch (e) {
                    // Skip menu if error occurs
                }
            }
            
            console.log(`Found ${toolsMenus.length} likely tools menus`);
            
            // Process all tools menus we found
            let added = 0;
            for (const menu of toolsMenus.length > 0 ? toolsMenus : foundMenus) {
                try {
                    // Check if debug menu already exists in this menu
                    const existingLinks = menu.querySelectorAll('a');
                    let existingDebugLink = null;
                    
                    for (const link of existingLinks) {
                        const text = link.textContent || '';
                        const onclick = link.getAttribute('onclick') || '';
                        
                        if (
                            text.includes('Debug') || 
                            text.includes('Emergency') ||
                            onclick.includes('debug') ||
                            onclick.includes('Debug')
                        ) {
                            existingDebugLink = link;
                            break;
                        }
                    }
                    
                    if (existingDebugLink) {
                        // Modify existing link to use the new consolidated function
                        existingDebugLink.textContent = CONFIG.panelTitle;
                        existingDebugLink.removeAttribute('onclick');
                        existingDebugLink.onclick = function(e) {
                            e.preventDefault();
                            createDebugPanel();
                            return false;
                        };
                        added++;
                    } else {
                        // Create a new debug panel menu item
                        const debugLink = document.createElement('a');
                        debugLink.href = '#';
                        debugLink.textContent = CONFIG.panelTitle;
                        debugLink.onclick = function(e) {
                            e.preventDefault();
                            createDebugPanel();
                            return false;
                        };
                        
                        menu.appendChild(debugLink);
                        added++;
                    }
                } catch (e) {
                    console.warn('Error processing menu:', e);
                }
            }
            
            if (added > 0) {
                console.log(`Debug panel menu option added to ${added} menus`);
            } else {
                // Ultimate fallback - try to add to all dropdown-content elements
                const allDropdowns = document.querySelectorAll('.dropdown-content');
                for (const dropdown of allDropdowns) {
                    try {
                        // Create a new debug panel menu item
                        const debugLink = document.createElement('a');
                        debugLink.href = '#';
                        debugLink.textContent = CONFIG.panelTitle;
                        debugLink.onclick = function(e) {
                            e.preventDefault();
                            createDebugPanel();
                            return false;
                        };
                        
                        dropdown.appendChild(debugLink);
                        added++;
                    } catch (e) {
                        // Skip dropdown if error
                    }
                }
                
                console.log(`Fallback: Debug panel menu added to ${added} dropdowns`);
            }
        } catch (error) {
            console.error('Error adding debug menu option:', error);
        }
    }
    
    // Expose public API
    CyberpunkGM.Debug = {
        createDebugPanel,
        init,
        logToConsole,
        removeExistingDebugPanels,
        observeDebugPanels,
        cleanup: function() {
            // Clean up observers and event listeners
            if (CyberpunkGM.Debug._observer) {
                CyberpunkGM.Debug._observer.disconnect();
            }
            console.log('Cleanup of debug panel system complete');
        },
        _observer: null,
        version: '1.0.1'
    };
    
    // Wait for DOM before initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize with a small delay to let other scripts load
            setTimeout(init, 500);
        });
    } else {
        // Initialize with a small delay
        setTimeout(init, 100);
    }
    
})(window.CyberpunkGM = window.CyberpunkGM || {});