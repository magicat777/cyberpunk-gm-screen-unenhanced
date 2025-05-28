/**
 * Cyberpunk GM Screen - Layout Save & Restore
 * An improved implementation with better error handling, security, and performance
 * Version 1.1.0
 */

// Use IIFE with namespace to avoid global pollution
(function(CyberpunkGM) {
    'use strict';
    
    // Create a Layout namespace if it doesn't exist
    CyberpunkGM.Layout = CyberpunkGM.Layout || {};
    
    // Configuration object for easy maintenance
    const CONFIG = {
        storageKeys: {
            autoSaveEnabled: 'cyberpunk-autosave-enabled',
            layoutAutoSave: 'cyberpunk-layout-autosave',
            layoutDefault: 'cyberpunk-layout-default',
            layoutExport: 'cyberpunk-layout-export',
            layoutImport: 'cyberpunk-layout-import'
        },
        selectors: {
            // Multiple fallback selectors for layout menu
            layoutDropdowns: [
                '.dropdown:nth-child(2) .dropdown-content',
                '.dropdown .dropdown-content:has(#save-layout)',
                '.dropdown-content:has(#load-layout)', 
                '#layout-menu .dropdown-content'
            ],
            menuItems: {
                saveLayout: '#save-layout',
                loadLayout: '#load-layout',
                clearLayout: '#clear-layout',
                resetLayout: '#reset-layout',
                exportLayout: '#export-layout',
                importLayout: '#import-layout',
                toggleAutoSave: '#toggle-autosave'
            },
            panels: '.panel',
            panelTitle: '.panel-header div'
        },
        debounceTime: 1000, // 1 second debounce for auto-save
        initDelay: 500,     // Fallback delay if events aren't supported
        notifications: {
            duration: 3000,  // How long notifications stay visible (ms)
            position: 'bottom-right'
        },
        maxPanels: 100      // Security limit for imported layouts
    };
    
    // Storage utility - handles localStorage securely with proper error handling
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
        },
        
        remove: function(key) {
            if (!this.isAvailable) return false;
            
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error(`Error removing ${key} from localStorage:`, error);
                return false;
            }
        },
        
        isAutoSaveEnabled: function() {
            return this.get(CONFIG.storageKeys.autoSaveEnabled, true);
        },
        
        setAutoSaveEnabled: function(enabled) {
            return this.set(CONFIG.storageKeys.autoSaveEnabled, enabled);
        }
    };
    
    // DOM Utility - safer DOM operations with proper error handling
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
        
        findWithFallbacks: function(selectors, parent = document) {
            if (!Array.isArray(selectors)) {
                selectors = [selectors];
            }
            
            for (const selector of selectors) {
                const element = this.findOne(selector, parent);
                if (element) return element;
            }
            
            return null;
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
        },
        
        appendAfter: function(newNode, referenceNode) {
            try {
                if (referenceNode && referenceNode.parentNode) {
                    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Error appending element after reference node:', error);
                return false;
            }
        },
        
        // Event management with proper cleanup
        events: {
            registry: new WeakMap(),
            
            add: function(element, eventType, handler, options = {}) {
                if (!element) return false;
                
                try {
                    // Create registry for this element if it doesn't exist
                    if (!this.registry.has(element)) {
                        this.registry.set(element, []);
                    }
                    
                    // Store the event info
                    const eventInfo = { eventType, handler, options };
                    this.registry.get(element).push(eventInfo);
                    
                    // Add the actual event listener
                    element.addEventListener(eventType, handler, options);
                    return true;
                } catch (error) {
                    console.error(`Error adding ${eventType} event to element:`, error);
                    return false;
                }
            },
            
            remove: function(element, eventType, handler, options = {}) {
                if (!element || !this.registry.has(element)) return false;
                
                try {
                    // Get event registry for this element
                    const events = this.registry.get(element);
                    
                    // Find the event in the registry
                    const index = events.findIndex(e => 
                        e.eventType === eventType && 
                        e.handler === handler
                    );
                    
                    if (index !== -1) {
                        // Remove event listener
                        element.removeEventListener(eventType, handler, options);
                        
                        // Remove from registry
                        events.splice(index, 1);
                        
                        // Clean up empty registry
                        if (events.length === 0) {
                            this.registry.delete(element);
                        }
                        
                        return true;
                    }
                    
                    return false;
                } catch (error) {
                    console.error(`Error removing ${eventType} event from element:`, error);
                    return false;
                }
            },
            
            removeAll: function(element) {
                if (!element || !this.registry.has(element)) return false;
                
                try {
                    // Get all registered events for this element
                    const events = this.registry.get(element);
                    
                    // Remove all event listeners
                    events.forEach(e => {
                        element.removeEventListener(e.eventType, e.handler, e.options);
                    });
                    
                    // Clear registry for this element
                    this.registry.delete(element);
                    return true;
                } catch (error) {
                    console.error('Error removing all events from element:', error);
                    return false;
                }
            }
        }
    };
    
    // UI utility - Handle notifications and UI components
    const UI = {
        notificationContainer: null,
        
        initNotifications: function() {
            if (this.notificationContainer) return;
            
            this.notificationContainer = DOM.createElement('div', {
                className: 'cp-notifications-container',
                style: {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: '9999',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    maxWidth: '300px'
                }
            });
            
            document.body.appendChild(this.notificationContainer);
            
            // Add styles
            const style = DOM.createElement('style');
            style.textContent = `
                .cp-notification {
                    background-color: #1e1e2d;
                    color: #e0e0e0;
                    border: 1px solid #00ccff;
                    padding: 10px 15px;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    animation: cp-notification-fade 0.3s ease-out;
                    position: relative;
                }
                .cp-notification-success {
                    border-left: 4px solid #00cc66;
                }
                .cp-notification-error {
                    border-left: 4px solid #ff3333;
                }
                .cp-notification-info {
                    border-left: 4px solid #00ccff;
                }
                .cp-notification-close {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    cursor: pointer;
                    color: #888;
                    font-size: 10px;
                    background: none;
                    border: none;
                    padding: 2px 5px;
                }
                .cp-notification-close:hover {
                    color: #fff;
                }
                @keyframes cp-notification-fade {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .cp-notification-exit {
                    animation: cp-notification-fade-out 0.3s ease-in forwards;
                }
                @keyframes cp-notification-fade-out {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-20px); }
                }
            `;
            
            document.head.appendChild(style);
        },
        
        notify: function(message, type = 'info', duration = CONFIG.notifications.duration) {
            this.initNotifications();
            
            const notification = DOM.createElement('div', {
                className: `cp-notification cp-notification-${type}`
            });
            
            notification.innerHTML = `
                ${message}
                <button class="cp-notification-close">&times;</button>
            `;
            
            this.notificationContainer.appendChild(notification);
            
            // Add close functionality
            const closeBtn = notification.querySelector('.cp-notification-close');
            if (closeBtn) {
                DOM.events.add(closeBtn, 'click', () => this.removeNotification(notification));
            }
            
            // Auto-remove after duration
            if (duration > 0) {
                setTimeout(() => this.removeNotification(notification), duration);
            }
            
            return notification;
        },
        
        removeNotification: function(notification) {
            if (!notification || !notification.parentNode) return;
            
            notification.classList.add('cp-notification-exit');
            
            // Remove after animation completes
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        },
        
        confirm: function(message, onConfirm, onCancel) {
            // Create modal confirmation dialog
            const backdrop = DOM.createElement('div', {
                className: 'cp-modal-backdrop',
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10000
                }
            });
            
            const modal = DOM.createElement('div', {
                className: 'cp-modal',
                style: {
                    backgroundColor: '#1e1e2d',
                    border: '1px solid #00ccff',
                    borderRadius: '4px',
                    padding: '20px',
                    width: '300px',
                    maxWidth: '90%'
                }
            });
            
            const content = DOM.createElement('div', {
                className: 'cp-modal-content',
                style: {
                    marginBottom: '20px'
                }
            }, message);
            
            const buttonContainer = DOM.createElement('div', {
                style: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px'
                }
            });
            
            const cancelButton = DOM.createElement('button', {
                className: 'cp-modal-button',
                style: {
                    backgroundColor: '#1e3a5a',
                    color: '#e0e0e0',
                    border: '1px solid #888',
                    padding: '5px 15px',
                    cursor: 'pointer'
                }
            }, 'Cancel');
            
            const confirmButton = DOM.createElement('button', {
                className: 'cp-modal-button',
                style: {
                    backgroundColor: '#254b75',
                    color: '#e0e0e0',
                    border: '1px solid #00ccff',
                    padding: '5px 15px',
                    cursor: 'pointer'
                }
            }, 'Confirm');
            
            // Add event listeners
            DOM.events.add(cancelButton, 'click', () => {
                if (typeof onCancel === 'function') onCancel();
                document.body.removeChild(backdrop);
            });
            
            DOM.events.add(confirmButton, 'click', () => {
                if (typeof onConfirm === 'function') onConfirm();
                document.body.removeChild(backdrop);
            });
            
            // Assemble and show modal
            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(confirmButton);
            modal.appendChild(content);
            modal.appendChild(buttonContainer);
            backdrop.appendChild(modal);
            document.body.appendChild(backdrop);
        }
    };
    
    // Utility functions
    const Utils = {
        // Throttle/debounce function for performance
        debounce: function(func, wait) {
            let timeout;
            
            return function(...args) {
                const context = this;
                
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(context, args);
                }, wait);
            };
        },
        
        // Generate timestamp for filenames
        getTimestamp: function() {
            return new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        },
        
        // More robust function checking
        isFunctionAvailable: function(funcName, context = window) {
            try {
                return typeof context[funcName] === 'function';
            } catch (error) {
                return false;
            }
        },
        
        // Validate layout data for security
        validateLayout: function(layout) {
            if (!layout || typeof layout !== 'object') {
                return { valid: false, reason: 'Layout is not an object' };
            }
            
            if (!layout.panels || !Array.isArray(layout.panels)) {
                return { valid: false, reason: 'Layout does not contain a panels array' };
            }
            
            if (layout.panels.length > CONFIG.maxPanels) {
                return { valid: false, reason: `Layout contains too many panels (${layout.panels.length}, max: ${CONFIG.maxPanels})` };
            }
            
            // Check each panel has required properties
            for (const panel of layout.panels) {
                if (!panel.title || typeof panel.title !== 'string') {
                    return { valid: false, reason: 'A panel is missing a valid title' };
                }
                
                // Validate numeric properties (optional but must be valid if present)
                ['zIndex'].forEach(prop => {
                    if (panel[prop] !== undefined && isNaN(parseInt(panel[prop]))) {
                        return { valid: false, reason: `Panel has invalid ${prop} property` };
                    }
                });
                
                // Validate string properties (optional but must be valid if present)
                ['left', 'top', 'width', 'height'].forEach(prop => {
                    if (panel[prop] !== undefined && typeof panel[prop] !== 'string') {
                        return { valid: false, reason: `Panel has invalid ${prop} property` };
                    }
                });
            }
            
            return { valid: true };
        }
    };
    
    // Initialize layout save functionality
    function init() {
        console.log('🔧 Initializing improved layout save functionality...');
        
        // Initialize notifications
        UI.initNotifications();
        
        // Event for document ready
        function onDocumentReady() {
            enhanceLayoutMenu();
            setupAutoSave();
            
            // Load auto-saved layout after a short delay to ensure other components are ready
            if (Storage.isAutoSaveEnabled()) {
                // Use custom ready event if available
                if (document.createEvent && document.dispatchEvent) {
                    // Create and listen for a custom ready event
                    document.addEventListener('cyberpunk-app-ready', loadAutoSavedLayout);
                    
                    // Use a fallback timeout in case the event isn't fired
                    const readyTimeout = setTimeout(() => {
                        loadAutoSavedLayout();
                        document.removeEventListener('cyberpunk-app-ready', loadAutoSavedLayout);
                    }, CONFIG.initDelay);
                    
                    // Remember the timeout to clear it if the event fires
                    CyberpunkGM.Layout._readyTimeout = readyTimeout;
                } else {
                    // Fallback to simple timeout
                    setTimeout(loadAutoSavedLayout, CONFIG.initDelay);
                }
            }
            
            console.log('✅ Layout save functionality initialized');
        }
        
        // Use event listeners with fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDocumentReady);
        } else {
            onDocumentReady();
        }
    }
    
    // Find and enhance the layout menu
    function enhanceLayoutMenu() {
        // Find layout dropdown with fallbacks
        const layoutDropdown = DOM.findWithFallbacks(CONFIG.selectors.layoutDropdowns);
        
        if (!layoutDropdown) {
            console.error('Layout dropdown not found using any of the selectors');
            return;
        }
        
        // Check if menu is already enhanced
        if (DOM.findOne(CONFIG.selectors.menuItems.exportLayout, layoutDropdown)) {
            console.log('Layout menu already enhanced');
            return;
        }
        
        try {
            // Add export option
            const exportOption = DOM.createElement('a', {
                href: '#',
                id: 'export-layout'
            }, 'Export Layout');
            
            // Add import option
            const importOption = DOM.createElement('a', {
                href: '#',
                id: 'import-layout'
            }, 'Import Layout');
            
            // Add auto-save toggle option
            const autoSaveOption = DOM.createElement('a', {
                href: '#',
                id: 'toggle-autosave'
            }, Storage.isAutoSaveEnabled() ? 'Disable Auto-Save' : 'Enable Auto-Save');
            
            // Add options to the dropdown
            layoutDropdown.appendChild(exportOption);
            layoutDropdown.appendChild(importOption);
            layoutDropdown.appendChild(autoSaveOption);
            
            // Add event handlers with proper management
            DOM.events.add(exportOption, 'click', function(e) {
                e.preventDefault();
                exportLayout();
            });
            
            DOM.events.add(importOption, 'click', function(e) {
                e.preventDefault();
                importLayout();
            });
            
            DOM.events.add(autoSaveOption, 'click', function(e) {
                e.preventDefault();
                
                const currentlyEnabled = Storage.isAutoSaveEnabled();
                Storage.setAutoSaveEnabled(!currentlyEnabled);
                
                this.textContent = !currentlyEnabled ? 'Disable Auto-Save' : 'Enable Auto-Save';
                
                UI.notify(
                    `Layout auto-save ${!currentlyEnabled ? 'enabled' : 'disabled'}`,
                    !currentlyEnabled ? 'success' : 'info'
                );
            });
            
            console.log('Layout menu enhanced with export/import options');
        } catch (error) {
            console.error('Error enhancing layout menu:', error);
        }
    }
    
    // Set up auto-save functionality with improved performance
    function setupAutoSave() {
        // Create a more targeted MutationObserver
        const observer = new MutationObserver(function(mutations) {
            let shouldSave = false;
            
            // More efficient filtering of relevant mutations
            for (const mutation of mutations) {
                // For attribute mutations, check if it's a panel and relevant attribute
                if (mutation.type === 'attributes' && 
                    mutation.target.classList && 
                    mutation.target.classList.contains('panel')) {
                    
                    // Only save for position/size/visibility changes
                    if (['style', 'class'].includes(mutation.attributeName)) {
                        const style = window.getComputedStyle(mutation.target);
                        
                        // Check if the relevant styles changed
                        if (['left', 'top', 'width', 'height', 'display', 'visibility'].some(
                            prop => mutation.oldValue && mutation.oldValue.includes(prop))) {
                            shouldSave = true;
                            break;
                        }
                    }
                } 
                // For added/removed nodes, only care about panels
                else if (mutation.type === 'childList') {
                    const addedPanel = Array.from(mutation.addedNodes).some(node => 
                        node.nodeType === 1 && node.classList && node.classList.contains('panel'));
                    
                    const removedPanel = Array.from(mutation.removedNodes).some(node => 
                        node.nodeType === 1 && node.classList && node.classList.contains('panel'));
                    
                    if (addedPanel || removedPanel) {
                        shouldSave = true;
                        break;
                    }
                }
            }
            
            // If we should save, use debounced save
            if (shouldSave && Storage.isAutoSaveEnabled()) {
                debouncedSave();
            }
        });
        
        // Use debounce for better performance
        const debouncedSave = Utils.debounce(function() {
            saveCurrentLayout('autosave');
        }, CONFIG.debounceTime);
        
        // Observe panels container with more targeted options
        observer.observe(document.body, { 
            attributes: true,
            attributeFilter: ['style', 'class'],
            attributeOldValue: true,
            childList: true,
            subtree: true
        });
        
        // Store observer reference for cleanup
        CyberpunkGM.Layout._observer = observer;
        
        console.log('Layout auto-save observer set up with performance optimizations');
    }
    
    // Load the auto-saved layout
    function loadAutoSavedLayout() {
        try {
            // Check for autosaved layout
            const savedLayout = Storage.get(CONFIG.storageKeys.layoutAutoSave);
            if (!savedLayout) {
                console.log('No auto-saved layout found');
                return;
            }
            
            // Validate layout
            const validation = Utils.validateLayout(savedLayout);
            if (!validation.valid) {
                console.error(`Invalid auto-saved layout: ${validation.reason}`);
                UI.notify('Could not load saved layout: Invalid format', 'error');
                return;
            }
            
            // Check if panels exist (might already be loaded)
            const existingPanels = DOM.findAll(CONFIG.selectors.panels);
            if (existingPanels.length > 0) {
                console.log('Panels already exist, not loading auto-saved layout');
                return;
            }
            
            console.log(`Loading auto-saved layout with ${savedLayout.panels.length} panels`);
            
            // Check for original loadLayout function
            if (Utils.isFunctionAvailable('loadLayout')) {
                window.loadLayout(savedLayout);
                UI.notify('Layout restored from your last session', 'info');
            } else {
                // Use our implementation
                applyLayout(savedLayout);
                UI.notify('Layout restored using fallback method', 'info');
            }
        } catch (error) {
            console.error('Error loading auto-saved layout:', error);
            UI.notify('Error loading saved layout', 'error');
        }
    }
    
    // Apply layout by creating panels
    function applyLayout(layout) {
        // Validate layout
        const validation = Utils.validateLayout(layout);
        if (!validation.valid) {
            console.error(`Cannot apply layout: ${validation.reason}`);
            UI.notify(`Cannot apply layout: ${validation.reason}`, 'error');
            return false;
        }
        
        // Clear existing panels
        clearLayout();
        
        // Track creation success
        let successCount = 0;
        let errorCount = 0;
        
        // Create each panel
        layout.panels.forEach(panel => {
            try {
                if (!panel.title) {
                    console.warn('Panel missing title, skipping');
                    return;
                }
                
                let newPanel = null;
                
                // Dynamic function name based on panel title
                const panelTypeName = panel.title.replace(/\s+/g, '');
                const fnName = `create${panelTypeName}Panel`;
                
                // Try to find creation function with different naming patterns
                const creationFunctions = [
                    // Exact name match: createNotesPanel
                    `create${panelTypeName}Panel`,
                    // Original name: createNotesPanel
                    `create${panel.title.split(' ')[0]}Panel`,
                    // Pascal case: CreateNotesPanel
                    `Create${panelTypeName}Panel`,
                    // All lowercase: createnotespanel
                    `create${panelTypeName.toLowerCase()}panel`
                ];
                
                // Try each potential function name
                for (const funcName of creationFunctions) {
                    if (Utils.isFunctionAvailable(funcName)) {
                        newPanel = window[funcName]();
                        break;
                    }
                }
                
                // Fallback to generic panel
                if (!newPanel && Utils.isFunctionAvailable('createPanel')) {
                    console.log(`Using fallback createPanel for "${panel.title}"`);
                    newPanel = window.createPanel(panel.title);
                }
                
                // Apply position and styles if panel was created
                if (newPanel) {
                    // Apply position and size
                    if (panel.left) newPanel.style.left = panel.left;
                    if (panel.top) newPanel.style.top = panel.top;
                    if (panel.width) newPanel.style.width = panel.width;
                    if (panel.height) newPanel.style.height = panel.height;
                    if (panel.zIndex) newPanel.style.zIndex = panel.zIndex;
                    
                    successCount++;
                } else {
                    console.error(`Could not create panel "${panel.title}" - creation function not found`);
                    errorCount++;
                }
            } catch (error) {
                console.error(`Error creating panel "${panel.title}":`, error);
                errorCount++;
            }
        });
        
        if (errorCount > 0) {
            UI.notify(`Layout loaded with ${successCount} panels. ${errorCount} panels failed.`, 'info');
        } else {
            UI.notify(`Layout loaded with ${successCount} panels`, 'success');
        }
        
        return successCount > 0;
    }
    
    // Clear all panels
    function clearLayout() {
        try {
            const panels = DOM.findAll(CONFIG.selectors.panels);
            panels.forEach(panel => {
                DOM.events.removeAll(panel);
                panel.remove();
            });
            
            return true;
        } catch (error) {
            console.error('Error clearing layout:', error);
            return false;
        }
    }
    
    // Save current layout
    function saveCurrentLayout(name = 'default') {
        try {
            // Get all panels
            const panels = DOM.findAll(CONFIG.selectors.panels);
            const savedPanels = [];
            
            panels.forEach(panel => {
                const titleElem = DOM.findOne(CONFIG.selectors.panelTitle, panel);
                const title = titleElem ? titleElem.textContent : null;
                
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
            
            // Create layout object
            const layoutData = {
                panels: savedPanels,
                timestamp: new Date().toISOString(),
                version: '1.1'
            };
            
            // Save to localStorage
            const storageKey = `cyberpunk-layout-${name}`;
            const success = Storage.set(storageKey, layoutData);
            
            if (success) {
                console.log(`Layout saved as '${name}' with ${savedPanels.length} panels`);
            } else {
                console.error(`Failed to save layout '${name}'`);
            }
            
            return success ? layoutData : null;
        } catch (error) {
            console.error('Error saving layout:', error);
            UI.notify('Error saving layout', 'error');
            return null;
        }
    }
    
    // Export layout to file
    function exportLayout() {
        try {
            // Get current layout
            const layout = saveCurrentLayout('export');
            if (!layout) {
                UI.notify('No panels to export', 'error');
                return;
            }
            
            // Generate filename with date
            const timestamp = Utils.getTimestamp();
            const filename = `cyberpunk-layout_${timestamp}.json`;
            
            // Create a blob and download link
            const dataStr = JSON.stringify(layout, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = DOM.createElement('a', {
                href: url,
                download: filename,
                style: { display: 'none' }
            });
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            setTimeout(() => {
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log(`Layout exported to ${filename}`);
            UI.notify(`Layout exported to ${filename}`, 'success');
        } catch (error) {
            console.error('Error exporting layout:', error);
            UI.notify(`Error exporting layout: ${error.message}`, 'error');
        }
    }
    
    // Import layout from file
    function importLayout() {
        try {
            // Create a file input
            const fileInput = DOM.createElement('input', {
                type: 'file',
                accept: '.json',
                style: { display: 'none' }
            });
            
            DOM.events.add(fileInput, 'change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                
                DOM.events.add(reader, 'load', function(e) {
                    try {
                        // Parse and validate layout
                        let layout;
                        try {
                            layout = JSON.parse(e.target.result);
                        } catch (parseError) {
                            throw new Error(`Invalid JSON format: ${parseError.message}`);
                        }
                        
                        // Validate layout structure and security
                        const validation = Utils.validateLayout(layout);
                        if (!validation.valid) {
                            throw new Error(validation.reason);
                        }
                        
                        // Ask for confirmation
                        UI.confirm(
                            `Import layout with ${layout.panels.length} panels? Current layout will be replaced.`,
                            function() { // onConfirm
                                // Store the layout
                                Storage.set(CONFIG.storageKeys.layoutImport, layout);
                                
                                // Apply the layout
                                if (applyLayout(layout)) {
                                    // Also save as auto-save if enabled
                                    if (Storage.isAutoSaveEnabled()) {
                                        Storage.set(CONFIG.storageKeys.layoutAutoSave, layout);
                                    }
                                    
                                    UI.notify('Layout imported successfully', 'success');
                                }
                            }
                        );
                    } catch (error) {
                        console.error('Error importing layout:', error);
                        UI.notify(`Error importing layout: ${error.message}`, 'error');
                    }
                });
                
                reader.readAsText(file);
            });
            
            document.body.appendChild(fileInput);
            fileInput.click();
            
            setTimeout(() => {
                document.body.removeChild(fileInput);
                DOM.events.removeAll(fileInput);
            }, 5000);
        } catch (error) {
            console.error('Error setting up import:', error);
            UI.notify(`Error setting up import: ${error.message}`, 'error');
        }
    }
    
    // Enhance or wrap existing functions rather than replacing them
    function enhanceExistingFunctions() {
        // Enhance saveLayout if it exists
        if (Utils.isFunctionAvailable('saveLayout')) {
            const originalSaveLayout = window.saveLayout;
            
            window.saveLayout = function(...args) {
                try {
                    // Call the original function
                    const result = originalSaveLayout.apply(this, args);
                    
                    // Also auto-save if enabled
                    if (Storage.isAutoSaveEnabled()) {
                        saveCurrentLayout('autosave');
                    }
                    
                    return result;
                } catch (error) {
                    console.error('Error in enhanced saveLayout:', error);
                    return null;
                }
            };
            
            console.log('Enhanced existing saveLayout function');
        }
        
        // Enhance clearLayout if it exists
        if (Utils.isFunctionAvailable('clearLayout')) {
            const originalClearLayout = window.clearLayout;
            
            window.clearLayout = function(...args) {
                try {
                    // Call the original function
                    const result = originalClearLayout.apply(this, args);
                    
                    // Also save empty layout for auto-save if enabled
                    if (Storage.isAutoSaveEnabled()) {
                        setTimeout(() => saveCurrentLayout('autosave'), 100);
                    }
                    
                    return result;
                } catch (error) {
                    console.error('Error in enhanced clearLayout:', error);
                    return null;
                }
            };
            
            console.log('Enhanced existing clearLayout function');
        }
    }
    
    // Cleanup when module is unloaded (for proper memory management)
    function cleanup() {
        // Stop observing DOM changes
        if (CyberpunkGM.Layout._observer) {
            CyberpunkGM.Layout._observer.disconnect();
        }
        
        // Clear any pending timeouts
        if (CyberpunkGM.Layout._readyTimeout) {
            clearTimeout(CyberpunkGM.Layout._readyTimeout);
        }
        
        console.log('Layout module cleanup complete');
    }
    
    // Auto-organize panels in a grid layout
    function autoOrganize() {
        try {
            const panels = DOM.findAll(CONFIG.selectors.panels);
            if (panels.length === 0) return false;
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const margin = 20;
            const headerHeight = 50; // Approximate toolbar height
            
            // Calculate available space
            const availableWidth = viewportWidth - (margin * 2);
            const availableHeight = viewportHeight - headerHeight - (margin * 2);
            
            // Calculate panel dimensions based on count
            let cols = Math.ceil(Math.sqrt(panels.length));
            let rows = Math.ceil(panels.length / cols);
            
            // Make sure we have at least one column and row
            cols = Math.max(1, cols);
            rows = Math.max(1, rows);
            
            // Calculate panel dimensions
            const panelWidth = Math.floor(availableWidth / cols);
            const panelHeight = Math.floor(availableHeight / rows);
            
            // Position each panel
            panels.forEach((panel, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;
                
                // Position panel
                panel.style.left = (margin + (col * panelWidth)) + 'px';
                panel.style.top = (headerHeight + margin + (row * panelHeight)) + 'px';
                panel.style.width = (panelWidth - margin) + 'px';
                panel.style.height = (panelHeight - margin) + 'px';
                
                // Ensure it's visible and has a good z-index
                panel.style.display = 'flex';
                panel.style.zIndex = 1000 + index;
            });
            
            UI.notify('Panels organized in grid layout', 'success');
            return true;
        } catch (error) {
            console.error('Error organizing panels:', error);
            UI.notify('Error organizing panels', 'error');
            return false;
        }
    }
    
    // Fit all panels to the current window size
    function fitToWindow() {
        try {
            const panels = DOM.findAll(CONFIG.selectors.panels);
            if (panels.length === 0) return false;
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const margin = 20;
            const headerHeight = 50; // Approximate toolbar height
            
            // Calculate available space
            const availableWidth = viewportWidth - (margin * 2);
            const availableHeight = viewportHeight - headerHeight - (margin * 2);
            
            panels.forEach(panel => {
                // Ensure panel doesn't exceed viewport
                const currentLeft = parseInt(panel.style.left) || margin;
                const currentTop = parseInt(panel.style.top) || (headerHeight + margin);
                const currentWidth = parseInt(panel.style.width) || 300;
                const currentHeight = parseInt(panel.style.height) || 200;
                
                // Adjust position if outside viewport
                const newLeft = Math.min(Math.max(currentLeft, margin), viewportWidth - currentWidth - margin);
                const newTop = Math.min(Math.max(currentTop, headerHeight + margin), viewportHeight - currentHeight - margin);
                
                // Apply changes
                panel.style.left = newLeft + 'px';
                panel.style.top = newTop + 'px';
                
                // If the panel is too big for the viewport, resize it
                if (currentWidth > availableWidth) {
                    panel.style.width = (availableWidth - margin) + 'px';
                }
                
                if (currentHeight > availableHeight) {
                    panel.style.height = (availableHeight - margin) + 'px';
                }
            });
            
            UI.notify('Panels fit to window', 'success');
            return true;
        } catch (error) {
            console.error('Error fitting panels to window:', error);
            UI.notify('Error fitting panels to window', 'error');
            return false;
        }
    }
    
    // Expose public API
    CyberpunkGM.Layout = {
        ...CyberpunkGM.Layout,
        init,
        saveLayout: saveCurrentLayout,
        exportLayout,
        importLayout,
        loadLayout: loadAutoSavedLayout,
        applyLayout,
        clearLayout,
        autoOrganize,
        fitToWindow,
        setAutoSaveEnabled: Storage.setAutoSaveEnabled,
        cleanup,
        // Internal properties (for reference and cleanup)
        _observer: null,
        _readyTimeout: null
    };
    
    // Call enhanceExistingFunctions after a short delay to ensure all scripts have loaded
    setTimeout(enhanceExistingFunctions, CONFIG.initDelay);
    
    // Auto-init unless explicitly disabled
    if (!CyberpunkGM.Layout._noAutoInit) {
        init();
    }
    
})(window.CyberpunkGM = window.CyberpunkGM || {});