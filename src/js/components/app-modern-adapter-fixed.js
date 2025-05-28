/**
 * Cyberpunk GM Screen - Adapter (FIXED)
 * 
 * This adapter script provides a standalone implementation of panel functionality
 * that doesn't rely on the original app-modern.js file.
 */

(function() {
    'use strict';

    // Track active panels for state management
    const state = {
        panels: {},
        lastZIndex: 1000,
        panelCount: 0
    };
    
    // Function to show notifications - defined early so it can be used immediately
    window.showNotification = function(message, type = 'info', duration = 3000) {
        try {
            // Create container if it doesn't exist
            let container = document.querySelector('.cp-notifications');
            if (!container) {
                container = document.createElement('div');
                container.className = 'cp-notifications';
                container.setAttribute('aria-live', 'polite');
                document.body.appendChild(container);
            }
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `cp-notification cp-notification-${type}`;
            notification.textContent = message;
            
            // Add to container
            container.appendChild(notification);
            
            // Remove after duration
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.classList.add('cp-notification-hiding');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }
            }, duration);
            
            return true;
        } catch (error) {
            console.error(`Failed to show notification: ${message}`, error);
            return false;
        }
    };

    // Wait for DOM to load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Initializing fixed adapter for CyberpunkGM');
        
        // Check for browser compatibility and API availability
        try {
            // Check essential browser APIs
            if (!window.requestAnimationFrame) {
                console.warn('requestAnimationFrame not supported! Animations may not be smooth.');
                showNotification('Your browser may not support smooth animations', 'warning', 5000);
            }
            
            // Check for pointer events support
            if (!window.PointerEvent) {
                console.warn('PointerEvent not supported! Falling back to mouse events.');
                showNotification('Your browser has limited touch support', 'warning', 5000);
            }
            
            // Check if original API is missing and show warning
            if (!window.CyberpunkGM || typeof window.CyberpunkGM.createPanel !== 'function') {
                console.warn('CyberpunkGM API missing! Using standalone panel implementation.');
                showNotification('Panel system running in standalone mode', 'info', 5000);
            }
            
            // Define createPanel function if not already defined
            if (typeof window.createPanel !== 'function') {
                console.log('Creating and exposing createPanel function');
                window.createPanel = function(title) {
                    return window.createAccessiblePanel(title);
                };
            }
            
            // Define safeCreatePanel helper if not already defined
            if (typeof window.safeCreatePanel !== 'function') {
                console.log('Creating and exposing safeCreatePanel function');
                window.safeCreatePanel = function(factory) {
                    try {
                        return factory();
                    } catch (error) {
                        console.error('Error in safeCreatePanel:', error);
                        return null;
                    }
                };
            }
        } catch (error) {
            console.error('Error during initialization:', error);
            showNotification('Error initializing panel system. Some features may not work correctly.', 'error', 8000);
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
            
            // Set title and content based on type
            let title, content;
            switch (type) {
                case 'notes': 
                    title = 'Notes';
                    content = `<textarea class="notes-textarea" placeholder="Enter your notes here..." 
                              aria-label="Notes textarea"></textarea>`;
                    break;
                case 'dice': 
                    title = 'Dice Roller';
                    content = createDiceRollerContent();
                    break;
                case 'rules': 
                    title = 'Rules Reference';
                    content = createRulesReferenceContent();
                    break;
                case 'character': 
                    title = 'Character Sheet';
                    content = createCharacterSheetContent();
                    break;
                case 'npc': 
                    title = 'NPC Generator';
                    content = createNPCGeneratorContent();
                    break;
                case 'weapons': 
                    title = 'Weapons Table';
                    content = createWeaponTableContent();
                    break;
                case 'armor': 
                    title = 'Armor Table';
                    content = createArmorTableContent();
                    break;
                case 'critical': 
                    title = 'Critical Injuries';
                    content = createCriticalInjuriesContent();
                    break;
                case 'netrunning': 
                    title = 'Netrunning';
                    content = createNetrunningContent();
                    break;
                case 'initiative': 
                    title = 'Initiative Tracker';
                    content = createInitiativeTrackerContent();
                    break;
                case 'timer': 
                    title = 'Game Timer';
                    content = createTimerContent();
                    break;
                case 'calculator': 
                    title = 'Calculator';
                    content = createCalculatorContent();
                    break;
                case 'map': 
                    title = 'Night City Map';
                    content = createMapContent();
                    break;
                case 'location': 
                    title = 'Location Generator';
                    content = createLocationGeneratorContent();
                    break;
                case 'encounter': 
                    title = 'Random Encounter';
                    content = createRandomEncounterContent();
                    break;
                case 'loot': 
                    title = 'Loot Generator';
                    content = createLootGeneratorContent();
                    break;
                default: 
                    title = 'New Panel';
                    content = `<p>Content for this panel type is not yet implemented.</p>`;
            }
            
            try {
                // Validate inputs
                if (!type) {
                    throw new Error('Panel type is required');
                }
                
                if (config.width < 200 || config.height < 100) {
                    console.warn(`Panel size below minimum: ${config.width}x${config.height}. Adjusting to minimum size.`);
                    config.width = Math.max(config.width, 200);
                    config.height = Math.max(config.height, 100);
                    showNotification('Panel size adjusted to minimum dimensions', 'info', 2000);
                }
                
                // Try using the original API first if available
                if (window.CyberpunkGM && typeof window.CyberpunkGM.createPanel === 'function') {
                    console.log(`Creating panel using original API: ${type}`);
                    return window.CyberpunkGM.createPanel({
                        title,
                        type,
                        width: config.width,
                        height: config.height,
                        x: config.x,
                        y: config.y
                    });
                } else {
                    // Create a panel using our standalone implementation
                    console.log(`Creating panel using standalone implementation: ${type}`);
                    return createStandalonePanel(title, content, config, type);
                }
            } catch (error) {
                console.error('Error creating panel:', error);
                
                // Provide more user-friendly error message
                let errorMessage = 'Failed to create panel';
                if (error.message) {
                    errorMessage += ': ' + error.message;
                } else {
                    errorMessage += '. Check console for details.';
                }
                
                showNotification(errorMessage, 'error', 5000);
                
                // Return null to indicate failure
                return null;
            }
        };
        
        // Standalone panel creation
        function createStandalonePanel(title, content, config, type) {
            // Generate unique ID
            const id = 'panel-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            
            // Create panel element with semantic attributes
            const panel = document.createElement('section');  // Using section for better semantics
            panel.className = 'panel';
            panel.dataset.id = id;
            panel.dataset.type = type;
            panel.setAttribute('tabindex', '0');
            panel.setAttribute('role', 'dialog');
            panel.setAttribute('aria-labelledby', `panel-title-${id}`);
            panel.setAttribute('aria-label', `Panel ${title}`);
            
            // Apply position and size with improved bounds checking and window size monitoring
            // Ensure panel is completely visible within viewport
            let left = Math.max(10, Math.min(config.x, window.innerWidth - config.width - 10));
            let top = Math.max(10, Math.min(config.y, window.innerHeight - config.height - 10));
            
            // Check if panel position needs to be adjusted from requested position
            if (left !== config.x || top !== config.y) {
                console.log(`Panel position adjusted from (${config.x}, ${config.y}) to (${left}, ${top}) to keep within viewport`);
            }
            
            panel.style.left = `${left}px`;
            panel.style.top = `${top}px`;
            panel.style.width = `${config.width}px`;
            panel.style.height = `${config.height}px`;
            panel.style.zIndex = state.lastZIndex++;
            
            // Add window resize handler to keep panel in viewport
            const resizeHandler = function() {
                // Re-check bounds when window is resized
                const rect = panel.getBoundingClientRect();
                let newLeft = Math.max(10, Math.min(rect.left, window.innerWidth - rect.width - 10));
                let newTop = Math.max(10, Math.min(rect.top, window.innerHeight - rect.height - 10));
                
                if (newLeft !== rect.left || newTop !== rect.top) {
                    panel.style.left = `${newLeft}px`;
                    panel.style.top = `${newTop}px`;
                }
            };
            
            window.addEventListener('resize', resizeHandler);
            // Store reference to allow removal when panel is closed
            panel._resizeHandler = resizeHandler;
            
            // Create panel structure with improved semantics
            panel.innerHTML = `
                <header class="panel-header" role="button" aria-grabbed="false">
                    <div class="panel-title" id="panel-title-${id}">${title}</div>
                    <div class="panel-controls">
                        <button class="close-button" aria-label="Close panel" tabindex="0">&times;</button>
                    </div>
                </header>
                <div class="panel-content">${content}</div>
                <div class="resize-handle" tabindex="0" role="button" 
                     aria-label="Resize panel (use arrow keys when focused)"></div>
            `;
            
            document.body.appendChild(panel);
            
            // Add event listeners for keyboard navigation
            addKeyboardSupport(panel, id);
            
            // Make panel draggable
            makeAccessibleDraggable(panel);
            
            // Make panel resizable
            makeAccessibleResizable(panel);
            
            // Initialize specific panel content
            initializePanelContent(panel, type);
            
            // Add to state tracking
            state.panels[id] = {
                id,
                type,
                element: panel,
                title,
                config
            };
            state.panelCount++;
            
            return id;
        }
        
        // Keyboard navigation for panels
        function addKeyboardSupport(panel, id) {
            // Close button keyboard support
            const closeButton = panel.querySelector('.close-button');
            if (closeButton) {
                closeButton.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        
                        // Visual feedback
                        this.classList.add('active');
                        
                        // Get panel info from state or title element
                        const panelTitle = state.panels[id] ? state.panels[id].title : 
                                          panel.querySelector('.panel-title').textContent || 'Panel';
                        
                        // Remove panel after brief delay for feedback
                        setTimeout(() => {
                            if (panel.parentNode) {
                                // Remove any event listeners associated with this panel
                                if (panel._resizeHandler) {
                                    window.removeEventListener('resize', panel._resizeHandler);
                                }
                                
                                // Save panel state if needed
                                delete state.panels[id];
                                
                                // Notify user
                                showNotification(`${panelTitle} panel closed`, 'info', 1500);
                                
                                // Remove from DOM
                                panel.parentNode.removeChild(panel);
                                
                                console.log(`Panel ${id} closed via keyboard`);
                            }
                        }, 100);
                    }
                });
                
                // Click handler for close button
                closeButton.addEventListener('click', function() {
                    if (panel.parentNode) {
                        // Get panel info from state or title element
                        const panelTitle = state.panels[id] ? state.panels[id].title : 
                                          panel.querySelector('.panel-title').textContent || 'Panel';
                        
                        // Remove any event listeners associated with this panel
                        if (panel._resizeHandler) {
                            window.removeEventListener('resize', panel._resizeHandler);
                        }
                        
                        // Clean up panel state
                        delete state.panels[id];
                        
                        // Notify user
                        showNotification(`${panelTitle} panel closed`, 'info', 1500);
                        
                        // Remove from DOM
                        panel.parentNode.removeChild(panel);
                        
                        console.log(`Panel ${id} closed`);
                    }
                });
            }
            
            // Whole panel keyboard navigation
            panel.addEventListener('keydown', function(e) {
                // Move panel with arrow keys when holding shift
                if (e.shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                    
                    const step = 10;
                    const rect = panel.getBoundingClientRect();
                    
                    let left = parseInt(panel.style.left) || rect.left;
                    let top = parseInt(panel.style.top) || rect.top;
                    
                    switch (e.key) {
                        case 'ArrowLeft':
                            left = Math.max(10, left - step);
                            break;
                        case 'ArrowRight':
                            left = Math.min(window.innerWidth - rect.width - 10, left + step);
                            break;
                        case 'ArrowUp':
                            top = Math.max(10, top - step);
                            break;
                        case 'ArrowDown':
                            top = Math.min(window.innerHeight - rect.height - 10, top + step);
                            break;
                    }
                    
                    panel.style.left = `${left}px`;
                    panel.style.top = `${top}px`;
                }
                
                // Close panel with Escape key
                if (e.key === 'Escape') {
                    const closeBtn = panel.querySelector('.close-button');
                    if (closeBtn) {
                        // Visual feedback before closing
                        closeBtn.classList.add('active');
                        
                        // Get panel info from state or title element
                        const panelTitle = state.panels[id] ? state.panels[id].title : 
                                          panel.querySelector('.panel-title').textContent || 'Panel';
                        
                        // Delete panel directly to avoid any potential issues with click event
                        setTimeout(() => {
                            if (panel.parentNode) {
                                // Remove any event listeners associated with this panel
                                if (panel._resizeHandler) {
                                    window.removeEventListener('resize', panel._resizeHandler);
                                }
                                
                                // Save panel state if needed
                                delete state.panels[id];
                                
                                // Notify user
                                showNotification(`${panelTitle} panel closed`, 'info', 1500);
                                
                                // Remove from DOM
                                panel.parentNode.removeChild(panel);
                                
                                console.log(`Panel ${id} closed via Escape key`);
                            }
                        }, 100);
                    }
                }
            });
        }
        
        // Improved draggable implementation with requestAnimationFrame for performance
        function makeAccessibleDraggable(panel) {
            const header = panel.querySelector('.panel-header');
            if (!header) {
                console.error('Panel header not found. Panel may not be properly structured.');
                showNotification('Error initializing panel dragging. See console for details.', 'error');
                return;
            }
            
            let isDragging = false;
            let offsetX, offsetY;
            let currentX, currentY;
            let animationFrameId = null;
            
            // Using Pointer Events for better cross-device support
            header.addEventListener('pointerdown', function(e) {
                // Skip if clicking close button or control elements
                if (e.target.closest('.close-button, .panel-controls')) return;
                
                isDragging = true;
                
                // Bring panel to front
                panel.style.zIndex = (++state.lastZIndex).toString();
                
                const rect = panel.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                
                currentX = rect.left;
                currentY = rect.top;
                
                // Add dragging class for visual feedback
                panel.classList.add('panel-dragging');
                panel.setAttribute('aria-grabbed', 'true');
                
                // Capture pointer to receive events outside element
                header.setPointerCapture(e.pointerId);
                
                // Start animation loop
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(updatePosition);
            });
            
            function updatePosition() {
                if (!isDragging) return;
                
                // Keep panel fully visible within viewport
                panel.style.left = `${currentX}px`;
                panel.style.top = `${currentY}px`;
                
                // Continue animation loop
                animationFrameId = requestAnimationFrame(updatePosition);
            }
            
            header.addEventListener('pointermove', function(e) {
                if (!isDragging) return;
                
                // Calculate new position with enhanced bounds checking
                const panelWidth = panel.offsetWidth;
                const panelHeight = panel.offsetHeight;
                
                // Ensure panel remains fully visible
                currentX = Math.max(10, Math.min(e.clientX - offsetX, window.innerWidth - panelWidth - 10));
                currentY = Math.max(10, Math.min(e.clientY - offsetY, window.innerHeight - panelHeight - 10));
            });
            
            header.addEventListener('pointerup', function(e) {
                if (isDragging) {
                    isDragging = false;
                    panel.classList.remove('panel-dragging');
                    panel.setAttribute('aria-grabbed', 'false');
                    header.releasePointerCapture(e.pointerId);
                    
                    // Stop animation loop
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                    
                    // Save position to panel state
                    if (panel.dataset.id && state.panels[panel.dataset.id]) {
                        state.panels[panel.dataset.id].config.x = currentX;
                        state.panels[panel.dataset.id].config.y = currentY;
                    }
                }
            });
            
            header.addEventListener('pointercancel', function(e) {
                if (isDragging) {
                    isDragging = false;
                    panel.classList.remove('panel-dragging');
                    panel.setAttribute('aria-grabbed', 'false');
                    header.releasePointerCapture(e.pointerId);
                    
                    // Stop animation loop
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                }
            });
        }
        
        // Improved resizable implementation
        function makeAccessibleResizable(panel) {
            const handle = panel.querySelector('.resize-handle');
            if (!handle) {
                console.error('Resize handle not found. Panel may not be properly structured.');
                showNotification('Error initializing panel resizing. See console for details.', 'error');
                return;
            }
            
            let isResizing = false;
            let currentWidth, currentHeight;
            let animationFrameId = null;
            
            // Add tabindex and role for accessibility
            handle.setAttribute('tabindex', '0');
            handle.setAttribute('role', 'button');
            handle.setAttribute('aria-label', 'Resize panel (use arrow keys when focused)');
            
            handle.addEventListener('pointerdown', function(e) {
                isResizing = true;
                e.preventDefault();
                
                // Visual indication that resize mode is active
                panel.classList.add('panel-resizing');
                handle.classList.add('resizing-active');
                handle.style.cursor = 'nwse-resize';
                
                currentWidth = panel.offsetWidth;
                currentHeight = panel.offsetHeight;
                
                // Capture pointer to receive events outside element
                handle.setPointerCapture(e.pointerId);
                
                // Start animation loop
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(updateSize);
            });
            
            function updateSize() {
                if (!isResizing) return;
                
                // Update panel size
                panel.style.width = `${currentWidth}px`;
                panel.style.height = `${currentHeight}px`;
                
                // Continue animation loop
                animationFrameId = requestAnimationFrame(updateSize);
            }
            
            handle.addEventListener('pointermove', function(e) {
                if (!isResizing) return;
                
                const rect = panel.getBoundingClientRect();
                
                // Calculate new dimensions
                currentWidth = Math.max(200, e.clientX - rect.left);
                currentHeight = Math.max(100, e.clientY - rect.top);
            });
            
            handle.addEventListener('pointerup', function(e) {
                if (isResizing) {
                    isResizing = false;
                    panel.classList.remove('panel-resizing');
                    handle.classList.remove('resizing-active');
                    handle.style.cursor = '';
                    handle.releasePointerCapture(e.pointerId);
                    
                    // Stop animation loop
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                    
                    // Save size to panel state
                    if (panel.dataset.id && state.panels[panel.dataset.id]) {
                        state.panels[panel.dataset.id].config.width = currentWidth;
                        state.panels[panel.dataset.id].config.height = currentHeight;
                    }
                }
            });
            
            handle.addEventListener('pointercancel', function(e) {
                if (isResizing) {
                    isResizing = false;
                    panel.classList.remove('panel-resizing');
                    handle.classList.remove('resizing-active');
                    handle.style.cursor = '';
                    handle.releasePointerCapture(e.pointerId);
                    
                    // Stop animation loop
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                }
            });
            
            // Keyboard support for resize handle with visual and audio feedback
            handle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Start keyboard resize mode
                    panel.classList.add('panel-resizing');
                    handle.classList.add('resizing-active');
                    
                    // Provide feedback message for screen readers
                    showNotification('Resize mode activated. Use arrow keys to resize, Enter or Escape to finish.', 'info', 2000);
                    
                    const handleKeyboardResize = function(resizeEvent) {
                        const step = resizeEvent.shiftKey ? 50 : 10;
                        
                        switch (resizeEvent.key) {
                            case 'ArrowRight':
                                currentWidth = parseInt(panel.style.width || panel.offsetWidth) + step;
                                panel.style.width = `${currentWidth}px`;
                                resizeEvent.preventDefault();
                                break;
                            case 'ArrowDown':
                                currentHeight = parseInt(panel.style.height || panel.offsetHeight) + step;
                                panel.style.height = `${currentHeight}px`;
                                resizeEvent.preventDefault();
                                break;
                            case 'ArrowLeft':
                                currentWidth = Math.max(200, parseInt(panel.style.width || panel.offsetWidth) - step);
                                panel.style.width = `${currentWidth}px`;
                                resizeEvent.preventDefault();
                                break;
                            case 'ArrowUp':
                                currentHeight = Math.max(100, parseInt(panel.style.height || panel.offsetHeight) - step);
                                panel.style.height = `${currentHeight}px`;
                                resizeEvent.preventDefault();
                                break;
                            case 'Escape':
                            case 'Enter':
                            case ' ':
                                document.removeEventListener('keydown', handleKeyboardResize);
                                panel.classList.remove('panel-resizing');
                                handle.classList.remove('resizing-active');
                                resizeEvent.preventDefault();
                                break;
                        }
                        
                        // Save size to panel state
                        if (panel.dataset.id && state.panels[panel.dataset.id]) {
                            state.panels[panel.dataset.id].config.width = currentWidth;
                            state.panels[panel.dataset.id].config.height = currentHeight;
                        }
                    };
                    
                    document.addEventListener('keydown', handleKeyboardResize);
                    
                    // End resize mode when focus is lost
                    handle.addEventListener('blur', function() {
                        document.removeEventListener('keydown', handleKeyboardResize);
                        panel.classList.remove('panel-resizing');
                        handle.classList.remove('resizing-active');
                    }, { once: true });
                }
            });
        }
        
        // Panel content initialization functions
        function initializePanelContent(panel, type) {
            // Initialize panel-specific functionality here
            const contentElement = panel.querySelector('.panel-content');
            if (!contentElement) {
                console.error('Panel content element not found. Panel may not be properly structured.');
                showNotification('Error initializing panel content. See console for details.', 'error');
                return;
            }
            
            // Add initialization logic for different panel types
            switch (type) {
                case 'dice':
                    initializeDiceRoller(contentElement);
                    break;
                case 'rules':
                    initializeRulesReference(contentElement);
                    break;
                case 'critical':
                    initializeCriticalInjuries(contentElement);
                    break;
                case 'netrunning':
                    initializeNetrunning(contentElement);
                    break;
                case 'npc':
                    initializeNPCGenerator(contentElement);
                    break;
                case 'loot':
                    initializeLootGenerator(contentElement);
                    break;
                case 'location':
                    initializeLocationGenerator(contentElement);
                    break;
                case 'encounter':
                    initializeRandomEncounter(contentElement);
                    break;
                case 'initiative':
                    initializeInitiativeTracker(contentElement);
                    break;
                case 'timer':
                    initializeTimer(contentElement);
                    break;
                case 'calculator':
                    initializeCalculator(contentElement);
                    break;
                case 'character':
                    initializeCharacterSheet(contentElement);
                    break;
                // Add more cases for other panel types
            }
        }
        
        // Panel content creation functions
        function createDiceRollerContent() {
            return `
                <div class="dice-roller">
                    <div class="dice-controls">
                        <div class="dice-row">
                            <label for="dice-count">Number of dice:</label>
                            <input type="number" id="dice-count" min="1" max="10" value="1">
                        </div>
                        <div class="dice-row">
                            <label for="dice-sides">Sides per die:</label>
                            <select id="dice-sides">
                                <option value="4">d4</option>
                                <option value="6">d6</option>
                                <option value="8">d8</option>
                                <option value="10" selected>d10</option>
                                <option value="12">d12</option>
                                <option value="20">d20</option>
                                <option value="100">d100</option>
                            </select>
                        </div>
                        <div class="dice-row">
                            <label for="dice-modifier">Modifier:</label>
                            <input type="number" id="dice-modifier" value="0">
                        </div>
                        <button class="roll-dice-btn">Roll Dice</button>
                    </div>
                    <div class="dice-results">
                        <div class="dice-result">Roll results will appear here</div>
                        <div class="dice-history"></div>
                    </div>
                </div>
            `;
        }
        
        function createRulesReferenceContent() {
            return `
                <div class="rules-reference">
                    <div class="rules-categories">
                        <select class="rule-category-select">
                            <option value="combat">Combat</option>
                            <option value="skills">Skills</option>
                            <option value="netrunning">Netrunning</option>
                            <option value="vehicles">Vehicles</option>
                            <option value="equipment">Equipment</option>
                        </select>
                    </div>
                    <div class="rules-content">
                        <div class="rules-section" id="combat-rules">
                            <h3>Combat Rules</h3>
                            <p>Core rules for Cyberpunk RED combat.</p>
                            <div class="rules-detail">
                                <h4>Initiative</h4>
                                <p>Roll 1d10 + REF to determine initiative order.</p>
                                <h4>Attack</h4>
                                <p>Roll 1d10 + Skill + STAT vs. target DV to hit.</p>
                                <h4>Damage</h4>
                                <p>Weapon damage - target SP = damage dealt.</p>
                                <h4>Critical Injury</h4>
                                <p>When HP reaches 0, roll on Critical Injury table.</p>
                                <h4>Death Save</h4>
                                <p>Roll 1d10 under BODY score to survive critical injuries.</p>
                            </div>
                        </div>
                        
                        <div class="rules-section" id="skills-rules" style="display: none;">
                            <h3>Skills Rules</h3>
                            <p>How skills work in Cyberpunk RED.</p>
                            <div class="rules-detail">
                                <h4>Skill Checks</h4>
                                <p>Roll 1d10 + Skill + Attribute vs. DV</p>
                                <h4>Difficulty Values (DV)</h4>
                                <ul>
                                    <li>DV 9: Easy task</li>
                                    <li>DV 13: Average task</li>
                                    <li>DV 15: Difficult task</li>
                                    <li>DV 17: Very difficult task</li>
                                    <li>DV 21: Nearly impossible task</li>
                                    <li>DV 24: Superhuman task</li>
                                </ul>
                                <h4>Common Skills</h4>
                                <p>Athletics, Brawling, Concentration, Conversation, Education, Evasion, First Aid, Human Perception, Language, Local Expert, Perception, Persuasion, Stealth, and many more.</p>
                            </div>
                        </div>
                        
                        <div class="rules-section" id="netrunning-rules" style="display: none;">
                            <h3>Netrunning Rules</h3>
                            <p>Rules for hackers and NET architecture.</p>
                            <div class="rules-detail">
                                <h4>Netrunning Actions</h4>
                                <p>Each action takes 1 turn of the Netrunner's 3 turns per round.</p>
                                <h4>Interface Check</h4>
                                <p>1d10 + Interface Skill + INT vs. DV</p>
                                <h4>Black ICE</h4>
                                <p>Hostile programs with specific effects on Netrunners.</p>
                                <h4>Damage</h4>
                                <p>NET damage affects Netrunner's brain directly.</p>
                                <h4>Programs</h4>
                                <p>Sword, Worm, Armor, Eraser and Zap programs aid the Netrunner.</p>
                            </div>
                        </div>
                        
                        <div class="rules-section" id="vehicles-rules" style="display: none;">
                            <h3>Vehicles Rules</h3>
                            <p>Rules for driving and vehicle combat.</p>
                            <div class="rules-detail">
                                <h4>Driving Check</h4>
                                <p>1d10 + Drive Land Vehicle + REF vs. DV</p>
                                <h4>Vehicle Combat</h4>
                                <p>Vehicle HP = 10 + BODY x 5</p>
                                <h4>Vehicular Damage</h4>
                                <ul>
                                    <li>Light: No effect</li>
                                    <li>Medium: Speed reduced by 25%</li>
                                    <li>Heavy: Speed reduced by 50%</li>
                                    <li>Critical: Vehicle disabled</li>
                                </ul>
                                <h4>Pedestrian Hit</h4>
                                <p>3d6 damage each turn under vehicle</p>
                            </div>
                        </div>
                        
                        <div class="rules-section" id="equipment-rules" style="display: none;">
                            <h3>Equipment Rules</h3>
                            <p>Rules for gear, items, and equipment.</p>
                            <div class="rules-detail">
                                <h4>Weapons</h4>
                                <p>Categories: Melee, Pistols, SMGs, Rifles, Shotguns, Heavy</p>
                                <h4>Armor</h4>
                                <p>Stopping Power (SP) reduces incoming damage</p>
                                <h4>Cyberware</h4>
                                <p>Modifications require Humanity cost and Tech installation</p>
                                <h4>Drugs & Medical</h4>
                                <p>Various effects from boost to heal</p>
                                <h4>Fashion</h4>
                                <p>Affects street cred and social interactions</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Initialize rules reference panel functionality
        function initializeRulesReference(container) {
            // Get the category selector
            const categorySelect = container.querySelector('.rule-category-select');
            if (!categorySelect) {
                console.error('Rules reference category selector not found');
                return;
            }
            
            // Get all rule sections
            const ruleSections = container.querySelectorAll('.rules-section');
            if (ruleSections.length === 0) {
                console.error('Rules sections not found');
                return;
            }
            
            // Add change event handler to selector
            categorySelect.addEventListener('change', function() {
                const selectedCategory = this.value;
                
                // Hide all sections first
                ruleSections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // Show selected section
                const selectedSection = container.querySelector(`#${selectedCategory}-rules`);
                if (selectedSection) {
                    selectedSection.style.display = 'block';
                    console.log(`Switched to ${selectedCategory} rules`);
                } else {
                    console.error(`Rules section for ${selectedCategory} not found`);
                    showNotification(`Error: Rules section for ${selectedCategory} not found`, 'error');
                }
            });
            
            // Initialize with first category
            categorySelect.dispatchEvent(new Event('change'));
            
            console.log('Rules reference panel initialized');
        }
        
        // Initialize critical injuries panel functionality
        function initializeCriticalInjuries(container) {
            // Define the critical injuries table as a data structure for easier lookup
            const criticalInjuries = [
                { range: [1, 3], name: "Broken Fingers", effect: "-2 to all actions with that hand", recovery: "1 week" },
                { range: [4, 6], name: "Foreign Object", effect: "1 damage per turn until removed", recovery: "DV13 First Aid check" },
                { range: [7, 8], name: "Sprained Ankle", effect: "-2 to MOVE", recovery: "1 week" },
                { range: [9, 9], name: "Dislocated Shoulder", effect: "-4 to all actions with that arm", recovery: "1 day with treatment" },
                { range: [10, 11], name: "Battered", effect: "-1 to all actions", recovery: "1 day" },
                { range: [12, 13], name: "Deep Cut", effect: "Lose 1 HP per turn until treated", recovery: "DV13 First Aid check" },
                { range: [14, 15], name: "Bleeding", effect: "Recover at half rate until treated", recovery: "DV13 First Aid or 1 day in hospital" },
                { range: [16, 16], name: "Broken Ribs", effect: "-2 to all actions", recovery: "1 week" },
                { range: [17, 18], name: "Concussion", effect: "-2 to INT, REF, DEX", recovery: "1 day with treatment" },
                { range: [19, 19], name: "Broken Arm", effect: "Arm unusable", recovery: "1 month or 1 week with surgery" },
                { range: [20, 20], name: "Broken Leg", effect: "MOVE reduced to 1", recovery: "1 month or 1 week with surgery" },
                { range: [21, 22], name: "Ruptured Organ", effect: "-4 to all actions", recovery: "Death in 1 hour without surgery" },
                { range: [23, 24], name: "Crushed Fingers", effect: "Lose 1d6 fingers, -2 per finger lost to actions using that hand", recovery: "Permanent unless cyberware installed" },
                { range: [25, 25], name: "Dismembered Leg", effect: "Lose leg, MOVE reduced to 1", recovery: "Permanent unless cyberware installed" },
                { range: [26, 27], name: "Dismembered Arm", effect: "Lose arm and items held in that hand", recovery: "Permanent unless cyberware installed" },
                { range: [28, 29], name: "Lost Eye", effect: "-4 to ranged attacks and Perception checks", recovery: "Permanent unless cyberware installed" },
                { range: [30, 31], name: "Brain Injury", effect: "-4 to INT actions and -2 to all other actions", recovery: "Permanent unless special treatment available" },
                { range: [32, 33], name: "Maimed Face", effect: "Lose 5 points from Appearance Stat", recovery: "Permanent unless surgery or cyberware" },
                { range: [34, 50], name: "Damaged Spine", effect: "Lose use of all limbs", recovery: "Permanent unless special treatment available" }
            ];
            
            // Body locations for targeted injuries
            const bodyLocations = {
                "head": [
                    "Concussion", "Lost Eye", "Brain Injury", "Maimed Face"
                ],
                "torso": [
                    "Broken Ribs", "Ruptured Organ", "Damaged Spine", "Deep Cut", "Bleeding"
                ],
                "right-arm": [
                    "Broken Fingers", "Dislocated Shoulder", "Broken Arm", "Crushed Fingers", "Dismembered Arm"
                ],
                "left-arm": [
                    "Broken Fingers", "Dislocated Shoulder", "Broken Arm", "Crushed Fingers", "Dismembered Arm"
                ],
                "right-leg": [
                    "Sprained Ankle", "Broken Leg", "Dismembered Leg"
                ],
                "left-leg": [
                    "Sprained Ankle", "Broken Leg", "Dismembered Leg"
                ]
            };
            
            // Get the roll button and body location selector
            const rollButton = container.querySelector('.roll-critical-btn');
            const locationSelect = container.querySelector('.critical-body-location');
            const resultDiv = container.querySelector('.injury-details');
            
            if (!rollButton || !resultDiv) {
                console.error('Critical injuries panel elements not found');
                return;
            }
            
            // Roll critical injury
            function rollCriticalInjury(targetLocation = 'random') {
                let result, injury;
                
                if (targetLocation === 'random') {
                    // Roll on the main table (1d10 + 1d6 for 2-16 range)
                    const d10 = Math.floor(Math.random() * 10) + 1;
                    const d6 = Math.floor(Math.random() * 6) + 1;
                    result = d10 + d6;
                    
                    // Adding another d6 for severe injuries (very rare)
                    if (result === 16 && Math.random() < 0.2) {
                        const severeD6 = Math.floor(Math.random() * 6) + 1;
                        const severeD10 = Math.floor(Math.random() * 10) + 1;
                        result = 16 + severeD6 + severeD10;
                    }
                    
                    // Find the injury in the table
                    injury = criticalInjuries.find(item => 
                        result >= item.range[0] && result <= item.range[1]
                    );
                } else {
                    // Get a random injury from the selected body location
                    const locationInjuries = bodyLocations[targetLocation];
                    if (!locationInjuries || locationInjuries.length === 0) {
                        showNotification(`Error: No injuries defined for location ${targetLocation}`, 'error');
                        return;
                    }
                    
                    // Pick a random injury from this location
                    const injuryName = locationInjuries[Math.floor(Math.random() * locationInjuries.length)];
                    injury = criticalInjuries.find(item => item.name === injuryName);
                }
                
                if (!injury) {
                    showNotification(`Error: Could not find injury for roll ${result}`, 'error');
                    return;
                }
                
                return { roll: result, injury };
            }
            
            // Handle roll button clicks
            rollButton.addEventListener('click', function() {
                const selectedLocation = locationSelect.value;
                const rollResult = rollCriticalInjury(selectedLocation);
                
                if (!rollResult) return;
                
                // Create the result HTML
                const resultHTML = `
                    <div class="injury-card">
                        <h5>${rollResult.injury.name}</h5>
                        ${rollResult.roll ? `<div class="injury-roll">Roll: ${rollResult.roll}</div>` : ''}
                        <div class="injury-location">${selectedLocation !== 'random' ? 
                            `Location: ${locationSelect.options[locationSelect.selectedIndex].text}` : ''}</div>
                        <div class="injury-effect"><strong>Effect:</strong> ${rollResult.injury.effect}</div>
                        <div class="injury-recovery"><strong>Recovery:</strong> ${rollResult.injury.recovery}</div>
                    </div>
                `;
                
                // Update the result div
                resultDiv.innerHTML = resultHTML;
                
                // Display notification
                showNotification(`Critical Injury: ${rollResult.injury.name}`, 'info', 3000);
                
                console.log(`Rolled critical injury: ${rollResult.injury.name}`);
            });
            
            // Add change event for location selector
            if (locationSelect) {
                locationSelect.addEventListener('change', function() {
                    console.log(`Selected body location: ${this.value}`);
                });
            }
            
            console.log('Critical injuries panel initialized');
        }
        
        // Initialize netrunning panel functionality
        // Initialize NPC Generator functionality
        // Initialize loot generator
        function initializeLootGenerator(container) {
            // Define loot data components
            
            // Loot categories with associated items
            const lootDatabase = {
                weapons: [
                    { name: "Medium Pistol", description: "Standard sidearm with decent stopping power", value: 50, rarity: "common", category: "weapons" },
                    { name: "Heavy Pistol", description: "Powerful handgun with excellent stopping power", value: 100, rarity: "common", category: "weapons" },
                    { name: "Very Heavy Pistol", description: "Massive handgun that packs a serious punch", value: 200, rarity: "uncommon", category: "weapons" },
                    { name: "SMG", description: "Compact automatic weapon with high rate of fire", value: 100, rarity: "common", category: "weapons" },
                    { name: "Heavy SMG", description: "More powerful SMG with improved stopping power", value: 200, rarity: "uncommon", category: "weapons" },
                    { name: "Assault Rifle", description: "Standard military-grade rifle with good range and power", value: 500, rarity: "uncommon", category: "weapons" },
                    { name: "Sniper Rifle", description: "Long-range precision rifle", value: 500, rarity: "uncommon", category: "weapons" },
                    { name: "Shotgun", description: "Close-range weapon with devastating damage", value: 500, rarity: "uncommon", category: "weapons" },
                    { name: "Heavy Shotgun", description: "More powerful shotgun with improved stopping power", value: 1000, rarity: "uncommon", category: "weapons" },
                    { name: "Grenade Launcher", description: "Launches explosive grenades at targets", value: 1500, rarity: "rare", category: "weapons" },
                    { name: "Rocket Launcher", description: "Heavy weapon that fires explosive rockets", value: 2000, rarity: "rare", category: "weapons" },
                    { name: "Flamethrower", description: "Projects streams of burning fuel", value: 1000, rarity: "rare", category: "weapons" },
                    { name: "Smart Rifle", description: "Advanced rifle with target-tracking bullets", value: 2500, rarity: "rare", category: "weapons" },
                    { name: "Monowire", description: "Incredibly sharp wire weapon worn on wrists", value: 3000, rarity: "rare", category: "weapons" },
                    { name: "Mantis Blades", description: "Retractable cyberware blades", value: 5000, rarity: "exotic", category: "weapons" },
                    { name: "Tsunami Arms Heatsink", description: "Prototype energy pistol", value: 7500, rarity: "exotic", category: "weapons" },
                    { name: "Kendachi Monokatana", description: "High-frequency blade that can cut through armor", value: 5000, rarity: "exotic", category: "weapons" },
                    { name: "Arasaka Black Unicorn", description: "Legendary katana of corpo origin", value: 10000, rarity: "legendary", category: "weapons" }
                ],
                armor: [
                    { name: "Leather Jacket", description: "Basic protection with some style", value: 20, rarity: "common", category: "armor" },
                    { name: "Kevlar Vest", description: "Simple ballistic protection for the torso", value: 50, rarity: "common", category: "armor" },
                    { name: "Light Armorjack", description: "Light armor that covers the full body", value: 100, rarity: "common", category: "armor" },
                    { name: "Medium Armorjack", description: "Better protection with some mobility cost", value: 500, rarity: "uncommon", category: "armor" },
                    { name: "Heavy Armorjack", description: "Serious protection at the cost of mobility", value: 1000, rarity: "uncommon", category: "armor" },
                    { name: "Flak Jacket", description: "Military-grade explosion protection", value: 500, rarity: "uncommon", category: "armor" },
                    { name: "Bulletproof Shield", description: "Portable cover that blocks most bullets", value: 500, rarity: "uncommon", category: "armor" },
                    { name: "MetalGear", description: "Heavy metal plates for maximum protection", value: 1000, rarity: "rare", category: "armor" },
                    { name: "Corporate Bodyweave", description: "Subdermal armor that doesn't affect appearance", value: 5000, rarity: "rare", category: "armor" },
                    { name: "Military Hardened Subdermal", description: "Military-grade subdermal armor", value: 10000, rarity: "exotic", category: "armor" },
                    { name: "Arasaka Elite Bodysuit", description: "Corpo bodysuit with state-of-the-art protection", value: 15000, rarity: "exotic", category: "armor" },
                    { name: "Militech Aphelion", description: "Prototype combat armor with integrated systems", value: 20000, rarity: "legendary", category: "armor" }
                ],
                cyberware: [
                    { name: "Cybereye (Basic)", description: "Simple replacement eye with minor enhancements", value: 100, rarity: "common", category: "cyberware" },
                    { name: "Cyberaudio Suite", description: "Enhanced hearing capabilities", value: 100, rarity: "common", category: "cyberware" },
                    { name: "Neural Link", description: "Brain-computer interface for cyberdecks", value: 500, rarity: "common", category: "cyberware" },
                    { name: "Subdermal Grip", description: "Improves weapon handling", value: 100, rarity: "common", category: "cyberware" },
                    { name: "Interface Plugs", description: "Direct neural connection points", value: 500, rarity: "common", category: "cyberware" },
                    { name: "Cybereye (Advanced)", description: "Enhanced vision with multiple options", value: 1000, rarity: "uncommon", category: "cyberware" },
                    { name: "Subdermal Armor", description: "Implanted armor plating", value: 1000, rarity: "uncommon", category: "cyberware" },
                    { name: "Reflex Boosters", description: "Enhanced reaction times", value: 1000, rarity: "uncommon", category: "cyberware" },
                    { name: "Smartgun Link", description: "Neural interface for smart weapons", value: 500, rarity: "uncommon", category: "cyberware" },
                    { name: "Kerenzikov", description: "Reflex enhancement for bullet-time perception", value: 5000, rarity: "rare", category: "cyberware" },
                    { name: "Sandevistan", description: "Military time dilation implant", value: 5000, rarity: "rare", category: "cyberware" },
                    { name: "Gorilla Arms", description: "Enhanced strength arm replacements", value: 3000, rarity: "rare", category: "cyberware" },
                    { name: "Mantis Blades", description: "Concealed arm blades", value: 5000, rarity: "rare", category: "cyberware" },
                    { name: "Projectile Launch System", description: "Arm-mounted projectile weapon", value: 5000, rarity: "rare", category: "cyberware" },
                    { name: "Cyberdeck (High-End)", description: "Advanced netrunner interface", value: 10000, rarity: "exotic", category: "cyberware" },
                    { name: "Full Cyberleg Suite", description: "Complete leg replacements with enhancements", value: 5000, rarity: "exotic", category: "cyberware" },
                    { name: "Military Sandevistan Mk.4", description: "Next-gen combat time dilation system", value: 15000, rarity: "exotic", category: "cyberware" },
                    { name: "Arasaka Neural Suite", description: "Integrated system with multiple enhancements", value: 25000, rarity: "legendary", category: "cyberware" }
                ],
                valuables: [
                    { name: "Credchip", description: "Digital currency card with funds", value: [50, 200], rarity: "common", category: "valuables" },
                    { name: "Stim Pack", description: "Battlefield medical stimulant", value: 30, rarity: "common", category: "valuables" },
                    { name: "Data Shard", description: "Contains possibly valuable data", value: [20, 500], rarity: "common", category: "valuables" },
                    { name: "Encrypted Shard", description: "Contains encrypted data, possibly valuable", value: [100, 1000], rarity: "uncommon", category: "valuables" },
                    { name: "Platinum Jewelry", description: "High-end jewelry pieces", value: [200, 1000], rarity: "uncommon", category: "valuables" },
                    { name: "Corporate Access Card", description: "Provides access to corporate areas", value: 500, rarity: "uncommon", category: "valuables" },
                    { name: "Stash of Eurodollars", description: "Physical currency, increasingly rare", value: [500, 2000], rarity: "uncommon", category: "valuables" },
                    { name: "Black Market Cred Stick", description: "Untraceable digital currency", value: [1000, 5000], rarity: "rare", category: "valuables" },
                    { name: "Corporate Blackmail Data", description: "Information that could ruin someone powerful", value: [5000, 20000], rarity: "rare", category: "valuables" },
                    { name: "Rare Earth Metals", description: "Valuable materials for tech manufacturing", value: [2000, 10000], rarity: "rare", category: "valuables" },
                    { name: "Prototype Blueprints", description: "Plans for unreleased tech", value: [5000, 15000], rarity: "exotic", category: "valuables" },
                    { name: "Corporate Bearer Bonds", description: "High-value untraceable financial instruments", value: [10000, 50000], rarity: "exotic", category: "valuables" },
                    { name: "Militech Stock Certificate", description: "Ownership in a major weapons corporation", value: [5000, 20000], rarity: "exotic", category: "valuables" },
                    { name: "Legendary Original Painting", description: "Authentic pre-war artwork", value: [50000, 100000], rarity: "legendary", category: "valuables" }
                ],
                tech: [
                    { name: "Personal Link", description: "Basic communications device", value: 20, rarity: "common", category: "tech" },
                    { name: "Tech Tool Kit", description: "Basic tools for tech repairs", value: 50, rarity: "common", category: "tech" },
                    { name: "Agent (Basic)", description: "AI assistant program on a portable device", value: 100, rarity: "common", category: "tech" },
                    { name: "Scrambler", description: "Masks communications signals", value: 100, rarity: "common", category: "tech" },
                    { name: "Smart Glasses", description: "HUD display and minor enhancements", value: 500, rarity: "uncommon", category: "tech" },
                    { name: "Holo Projector", description: "Creates 3D holographic images", value: 300, rarity: "uncommon", category: "tech" },
                    { name: "Cyberdeck (Basic)", description: "Entry-level netrunner interface", value: 500, rarity: "uncommon", category: "tech" },
                    { name: "Signal Jammer", description: "Disrupts electronic communications", value: 1000, rarity: "uncommon", category: "tech" },
                    { name: "Agent (High-End)", description: "Advanced AI assistant with multiple features", value: 1000, rarity: "rare", category: "tech" },
                    { name: "Cyberdeck (Mid-Tier)", description: "Capable netrunner interface", value: 2500, rarity: "rare", category: "tech" },
                    { name: "Arasaka Scanner", description: "Military-grade sensor equipment", value: 2000, rarity: "rare", category: "tech" },
                    { name: "Portable Braindance Editor", description: "Edit and create braindance recordings", value: 5000, rarity: "exotic", category: "tech" },
                    { name: "Full Immersion Braindance Rig", description: "High-end BD system with sensory feedback", value: 10000, rarity: "exotic", category: "tech" },
                    { name: "Netwatch Prototype", description: "Experimental device with unique capabilities", value: 25000, rarity: "legendary", category: "tech" }
                ],
                drugs: [
                    { name: "Stim Inhaler", description: "Performance enhancing stimulant", value: 20, rarity: "common", category: "drugs" },
                    { name: "Glitter", description: "Common party drug that enhances sensations", value: 20, rarity: "common", category: "drugs" },
                    { name: "SynthCoke", description: "Synthetic stimulant", value: 50, rarity: "common", category: "drugs" },
                    { name: "Boost", description: "Combat stimulant that increases reflexes", value: 100, rarity: "uncommon", category: "drugs" },
                    { name: "Blue Glass", description: "Dissociative that induces feelings of invulnerability", value: 100, rarity: "uncommon", category: "drugs" },
                    { name: "Black Lace", description: "Powerful combat drug with side effects", value: 200, rarity: "uncommon", category: "drugs" },
                    { name: "DorphaMax", description: "Strong pain suppressant used by solos", value: 200, rarity: "rare", category: "drugs" },
                    { name: "Ivory", description: "Expensive designer drug for the wealthy", value: 500, rarity: "rare", category: "drugs" },
                    { name: "Kereznikov Analog", description: "Drug that mimics reflex booster effects", value: 1000, rarity: "rare", category: "drugs" },
                    { name: "Corps-Tech Combat Stim", description: "Military-grade combat enhancer", value: 2000, rarity: "exotic", category: "drugs" },
                    { name: "Memory Crystal", description: "Experimental drug that enhances neural functions", value: 5000, rarity: "legendary", category: "drugs" }
                ],
                clothing: [
                    { name: "Street Clothes", description: "Basic urban fashion", value: 20, rarity: "common", category: "clothing" },
                    { name: "Corporate Casual", description: "Entry-level corporate attire", value: 50, rarity: "common", category: "clothing" },
                    { name: "Gang Colors", description: "Distinctive gang affiliated clothing", value: 50, rarity: "common", category: "clothing" },
                    { name: "Synth-Leather Jacket", description: "Stylish modern jacket with some protection", value: 100, rarity: "common", category: "clothing" },
                    { name: "Edgerunner Outfit", description: "Flashy street mercenary style", value: 200, rarity: "uncommon", category: "clothing" },
                    { name: "Corporate Suit", description: "High-quality business attire", value: 500, rarity: "uncommon", category: "clothing" },
                    { name: "Light Armor Weave Clothing", description: "Fashionable clothes with armor weave", value: 500, rarity: "uncommon", category: "clothing" },
                    { name: "Rockerboy Performance Gear", description: "Eye-catching stage outfit", value: 1000, rarity: "rare", category: "clothing" },
                    { name: "Arasaka Executive Suit", description: "High-end corpo fashion with subtle armor", value: 2000, rarity: "rare", category: "clothing" },
                    { name: "LED Fashion Suite", description: "Programmable light-up clothing", value: 1500, rarity: "rare", category: "clothing" },
                    { name: "Kiroshi OpticWear", description: "Advanced fashion with integrated tech", value: 5000, rarity: "exotic", category: "clothing" },
                    { name: "Johnny Silverhand's Replica Jacket", description: "Replica of the legendary rockerboy's iconic jacket", value: 10000, rarity: "legendary", category: "clothing" }
                ]
            };

            // Container types for loot
            const containers = [
                { name: "Cardboard Box", description: "A simple cardboard box, slightly worn", valueModifier: 0.8, maxValue: 200 },
                { name: "Plastic Crate", description: "A durable plastic storage container", valueModifier: 1.0, maxValue: 500 },
                { name: "Metal Lockbox", description: "A metal box with a simple lock", valueModifier: 1.2, maxValue: 2000 },
                { name: "Duffel Bag", description: "A worn duffel bag with several compartments", valueModifier: 1.0, maxValue: 1000 },
                { name: "Briefcase", description: "A corporate-style briefcase", valueModifier: 1.5, maxValue: 5000 },
                { name: "Gun Case", description: "A specialized case for storing weapons", valueModifier: 1.3, maxValue: 3000, specialFor: "weapons" },
                { name: "Armored Container", description: "A reinforced container with encrypted lock", valueModifier: 2.0, maxValue: 10000 },
                { name: "Corporate Safe", description: "A high-security corporate safe", valueModifier: 3.0, maxValue: 50000 },
                { name: "Hidden Compartment", description: "A secret compartment hidden in the wall", valueModifier: 1.8, maxValue: 20000 },
                { name: "Militech Secure Container", description: "Military-grade secure storage", valueModifier: 2.5, maxValue: 30000 },
                { name: "Arasaka Data Vault", description: "High-tech container for valuable data", valueModifier: 2.0, maxValue: 40000, specialFor: "tech" },
                { name: "Medical Refrigerator", description: "Temperature-controlled storage for medical supplies", valueModifier: 1.5, maxValue: 15000, specialFor: "drugs" },
                { name: "Cyberware Case", description: "Specialized case for transporting cyberware", valueModifier: 1.8, maxValue: 25000, specialFor: "cyberware" },
                { name: "Buried Stash", description: "A waterproof container buried for safekeeping", valueModifier: 1.7, maxValue: 20000 },
                { name: "Old World Safe", description: "Pre-war safe with mechanical lock", valueModifier: 2.2, maxValue: 35000 }
            ];
            
            // Value tiers for loot generation
            const valueTiers = {
                "poor": {
                    multiplier: 0.5,
                    maxTotal: 500,
                    rarityWeights: { common: 90, uncommon: 10, rare: 0, exotic: 0, legendary: 0 }
                },
                "standard": {
                    multiplier: 1.0,
                    maxTotal: 2000,
                    rarityWeights: { common: 60, uncommon: 30, rare: 10, exotic: 0, legendary: 0 }
                },
                "high": {
                    multiplier: 2.0,
                    maxTotal: 10000,
                    rarityWeights: { common: 30, uncommon: 40, rare: 25, exotic: 5, legendary: 0 }
                },
                "premium": {
                    multiplier: 5.0,
                    maxTotal: 50000,
                    rarityWeights: { common: 10, uncommon: 30, rare: 40, exotic: 18, legendary: 2 }
                },
                "jackpot": {
                    multiplier: 10.0,
                    maxTotal: 100000,
                    rarityWeights: { common: 0, uncommon: 10, rare: 40, exotic: 40, legendary: 10 }
                }
            };
            
            // Stored saved loot collections
            let savedLoot = [];
            
            // Get the tab buttons and content sections
            const tabButtons = container.querySelectorAll('.loot-tab');
            const tabContents = container.querySelectorAll('.loot-tab-content');
            
            // Get the generate button and selectors
            const generateBtn = container.querySelector('.generate-loot-btn');
            const saveBtn = container.querySelector('.save-loot-btn');
            const valueSelect = container.querySelector('.loot-value');
            const typeSelect = container.querySelector('.loot-type');
            const lootContainer = container.querySelector('.loot-container');
            const itemsContainer = container.querySelector('.items-container');
            
            // Get additional controls
            const includeRareCheckbox = container.querySelector('.include-rare-items');
            const includeContainerCheckbox = container.querySelector('.include-container');
            const itemCountInput = container.querySelector('.item-count');
            
            // Get the filter controls
            const filterButton = container.querySelector('.filter-button');
            const filterCategory = container.querySelector('.filter-category');
            const filterRarity = container.querySelector('.filter-rarity');
            
            // Check if elements exist
            if (!tabButtons.length || !tabContents.length) {
                console.error('Loot panel tab elements not found');
                return;
            }
            
            if (!generateBtn || !valueSelect || !typeSelect || !lootContainer) {
                console.error('Loot generator elements not found');
                return;
            }
            
            // Add items to the database tab
            function populateItemDatabase(filterCat = 'all', filterRar = 'all') {
                if (!itemsContainer) return;
                
                // Clear the container
                itemsContainer.innerHTML = '';
                
                // Flatten all items into one array
                const allItems = Object.values(lootDatabase).flat();
                
                // Filter items based on selected criteria
                const filteredItems = allItems.filter(item => {
                    return (filterCat === 'all' || item.category === filterCat) && 
                           (filterRar === 'all' || item.rarity === filterRar);
                });
                
                // Display items
                if (filteredItems.length === 0) {
                    itemsContainer.innerHTML = '<div class="empty-items-message">No items match your filter criteria.</div>';
                    return;
                }
                
                // Sort items by rarity and then by value
                const rarityOrder = { legendary: 5, exotic: 4, rare: 3, uncommon: 2, common: 1 };
                filteredItems.sort((a, b) => {
                    // First sort by rarity
                    const rarityCompare = rarityOrder[b.rarity] - rarityOrder[a.rarity];
                    if (rarityCompare !== 0) return rarityCompare;
                    
                    // Then by value (handling value ranges)
                    const aValue = Array.isArray(a.value) ? a.value[1] : a.value;
                    const bValue = Array.isArray(b.value) ? b.value[1] : b.value;
                    return bValue - aValue;
                });
                
                filteredItems.forEach(item => {
                    const itemValue = Array.isArray(item.value) 
                        ? `€${item.value[0]} - €${item.value[1]}`
                        : `€${item.value}`;
                    
                    const itemDiv = document.createElement('div');
                    itemDiv.className = `database-item loot-item-${item.rarity}`;
                    
                    itemDiv.innerHTML = `
                        <div class="database-item-header">
                            <span class="loot-item-name">${item.name}
                                <span class="rarity-badge rarity-${item.rarity}">${capitalizeFirstLetter(item.rarity)}</span>
                            </span>
                            <span class="loot-item-price">${itemValue}</span>
                        </div>
                        <div class="loot-item-desc">${item.description}</div>
                        <div class="loot-item-category">Category: ${capitalizeFirstLetter(item.category)}</div>
                        <div class="database-item-actions">
                            <button class="add-to-loot-btn" data-name="${item.name}" data-category="${item.category}">
                                Add to Custom Loot
                            </button>
                        </div>
                    `;
                    
                    itemsContainer.appendChild(itemDiv);
                    
                    // Add event listener to the add button
                    const addBtn = itemDiv.querySelector('.add-to-loot-btn');
                    addBtn.addEventListener('click', function() {
                        const itemName = this.getAttribute('data-name');
                        const itemCategory = this.getAttribute('data-category');
                        
                        // Find the item in the database
                        const selectedItem = lootDatabase[itemCategory].find(i => i.name === itemName);
                        
                        if (selectedItem) {
                            // Create a temporary loot collection with just this item
                            const tempLoot = {
                                id: 'temp',
                                name: 'Custom Selection',
                                value: 'custom',
                                items: [selectedItem],
                                totalValue: Array.isArray(selectedItem.value) 
                                    ? selectedItem.value[1] 
                                    : selectedItem.value,
                                timestamp: new Date().toISOString(),
                                container: null
                            };
                            
                            // Display the item
                            displayLoot(tempLoot);
                            
                            // Switch to the generator tab
                            tabButtons.forEach(btn => {
                                if (btn.getAttribute('data-tab') === 'generator') {
                                    btn.click();
                                }
                            });
                            
                            // Store in container dataset for potential saving
                            container.dataset.currentLoot = JSON.stringify(tempLoot);
                            
                            showNotification(`Added ${itemName} to current loot`, 'success', 2000);
                        }
                    });
                });
            }
            
            // Tab switching functionality
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Deactivate all tabs
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.style.display = 'none');
                    
                    // Activate the selected tab
                    this.classList.add('active');
                    const activeTab = container.querySelector(`#${tabId}-tab`);
                    if (activeTab) {
                        activeTab.style.display = 'block';
                    }
                    
                    // If switching to database tab, populate items
                    if (tabId === 'database') {
                        populateItemDatabase();
                    }
                    
                    console.log(`Switched to ${tabId} tab`);
                });
            });
            
            // Filter functionality
            if (filterButton) {
                filterButton.addEventListener('click', function() {
                    const categoryValue = filterCategory.value;
                    const rarityValue = filterRarity.value;
                    populateItemDatabase(categoryValue, rarityValue);
                });
            }
            
            // Helper functions
            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            
            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
            
            function getRandomElement(array) {
                return array[Math.floor(Math.random() * array.length)];
            }
            
            function getRandomValueInRange(range) {
                if (Array.isArray(range)) {
                    return randomInt(range[0], range[1]);
                }
                return range;
            }
            
            // Function to select an item based on rarity weights
            function selectItemByRarity(items, rarityWeights, includeRare = true) {
                // Filter items by whether we include rare items
                const availableItems = includeRare ? items : items.filter(item => 
                    item.rarity === 'common' || item.rarity === 'uncommon');
                
                if (availableItems.length === 0) return null;
                
                // Create rarity pools
                const rarityPools = {
                    common: availableItems.filter(item => item.rarity === 'common'),
                    uncommon: availableItems.filter(item => item.rarity === 'uncommon'),
                    rare: availableItems.filter(item => item.rarity === 'rare'),
                    exotic: availableItems.filter(item => item.rarity === 'exotic'),
                    legendary: availableItems.filter(item => item.rarity === 'legendary')
                };
                
                // Calculate total weight
                let totalWeight = 0;
                for (const [rarity, weight] of Object.entries(rarityWeights)) {
                    if (rarityPools[rarity].length > 0) {
                        totalWeight += weight;
                    }
                }
                
                if (totalWeight === 0) return null;
                
                // Select rarity based on weights
                let randomWeight = Math.random() * totalWeight;
                let selectedRarity = 'common';
                
                for (const [rarity, weight] of Object.entries(rarityWeights)) {
                    if (rarityPools[rarity].length > 0) {
                        if (randomWeight < weight) {
                            selectedRarity = rarity;
                            break;
                        }
                        randomWeight -= weight;
                    }
                }
                
                // Select random item from the chosen rarity pool
                return getRandomElement(rarityPools[selectedRarity]);
            }
            
            // Function to find an appropriate container based on value and type
            function selectContainer(totalValue, lootType) {
                // Filter containers that can hold this value
                const validContainers = containers.filter(container => 
                    container.maxValue >= totalValue);
                
                if (validContainers.length === 0) {
                    // If no container is suitable by value, get the highest capacity one
                    return containers.sort((a, b) => b.maxValue - a.maxValue)[0];
                }
                
                // Prefer containers that are specialized for this type
                const specializedContainers = validContainers.filter(container => 
                    container.specialFor === lootType);
                
                if (specializedContainers.length > 0) {
                    return getRandomElement(specializedContainers);
                }
                
                return getRandomElement(validContainers);
            }
            
            // Generate loot with the given parameters
            function generateLoot() {
                try {
                    // Get the selected options
                    const valueLevel = valueSelect.value;
                    const lootType = typeSelect.value;
                    const includeRare = includeRareCheckbox?.checked ?? true;
                    const includeContainer = includeContainerCheckbox?.checked ?? true;
                    const itemCount = parseInt(itemCountInput?.value) || 5;
                    
                    // Get value tier data
                    const valueTier = valueTiers[valueLevel];
                    if (!valueTier) {
                        throw new Error(`Invalid value level: ${valueLevel}`);
                    }
                    
                    // Determine which categories to include
                    let categories = [];
                    if (lootType === 'mixed') {
                        // Include all categories
                        categories = Object.keys(lootDatabase);
                    } else {
                        // Include only the specified category
                        categories = [lootType];
                    }
                    
                    // Generate random items
                    const selectedItems = [];
                    let totalValue = 0;
                    
                    // Try to reach the target item count
                    let attempts = 0;
                    const maxAttempts = itemCount * 3; // Avoid infinite loops
                    
                    while (selectedItems.length < itemCount && attempts < maxAttempts && totalValue < valueTier.maxTotal) {
                        attempts++;
                        
                        // Select random category
                        const category = getRandomElement(categories);
                        
                        // Select item based on rarity weights
                        const item = selectItemByRarity(lootDatabase[category], valueTier.rarityWeights, includeRare);
                        if (!item) continue;
                        
                        // Calculate item value with tier multiplier
                        let itemValue = 0;
                        if (Array.isArray(item.value)) {
                            itemValue = randomInt(
                                Math.round(item.value[0] * valueTier.multiplier),
                                Math.round(item.value[1] * valueTier.multiplier)
                            );
                        } else {
                            itemValue = Math.round(item.value * valueTier.multiplier);
                        }
                        
                        // Check if adding this item would exceed max value
                        if (totalValue + itemValue > valueTier.maxTotal) {
                            continue;
                        }
                        
                        // Add item to selection
                        selectedItems.push({
                            ...item,
                            actualValue: itemValue
                        });
                        
                        totalValue += itemValue;
                    }
                    
                    // Select an appropriate container if enabled
                    let container = null;
                    if (includeContainer) {
                        container = selectContainer(totalValue, lootType);
                        
                        // Apply container value modifier
                        totalValue = Math.round(totalValue * container.valueModifier);
                    }
                    
                    // Generate a name for this loot collection
                    const nameGenerator = {
                        weapons: ["Weapons Cache", "Armory Stash", "Mercenary's Arsenal", "Gun Runner's Goods"],
                        armor: ["Armor Collection", "Protection Gear", "Defender's Cache", "Security Equipment"],
                        cyberware: ["Chrome Collection", "Ripperdoc's Supplies", "Cyberware Components", "Body Mods"],
                        valuables: ["Valuable Goods", "Precious Items", "Fixer's Treasures", "Black Market Goods"],
                        tech: ["Tech Supplies", "Electronic Parts", "Netrunner's Cache", "Digital Equipment"],
                        drugs: ["Chemical Stash", "Pharmaceutical Goods", "Street Drugs", "Medical Supplies"],
                        clothing: ["Fashion Collection", "Clothing Cache", "Stylish Gear", "Designer Items"],
                        mixed: ["Mixed Loot", "Assorted Goods", "Scavenger's Haul", "Random Collection"]
                    };
                    
                    const lootName = getRandomElement(nameGenerator[lootType]);
                    
                    // Assemble the loot object
                    const loot = {
                        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
                        name: lootName,
                        value: valueLevel,
                        items: selectedItems,
                        totalValue: totalValue,
                        timestamp: new Date().toISOString(),
                        container: container
                    };
                    
                    // Display the generated loot
                    displayLoot(loot);
                    
                    // Store the current loot for potential saving
                    container.dataset.currentLoot = JSON.stringify(loot);
                    
                    console.log(`Generated ${selectedItems.length} items worth €${totalValue}`);
                    
                    return loot;
                } catch (error) {
                    console.error('Error generating loot:', error);
                    showNotification('Failed to generate loot', 'error', 3000);
                    return null;
                }
            }
            
            // Display loot in the UI
            function displayLoot(loot) {
                if (!lootContainer) return;
                
                // Create HTML for the loot card
                let lootHTML = `
                    <div class="loot-card">
                        <div class="loot-collection-header">
                            <div class="loot-collection-title">${loot.name}</div>
                            <div class="loot-value-label">€${loot.totalValue}</div>
                        </div>
                `;
                
                // Add container description if there is one
                if (loot.container) {
                    lootHTML += `
                        <div class="loot-container-description">
                            <strong>${loot.container.name}:</strong> ${loot.container.description}
                        </div>
                    `;
                }
                
                // Add each item
                if (loot.items.length === 0) {
                    lootHTML += `<div class="empty-loot-message">No items found.</div>`;
                } else {
                    loot.items.forEach(item => {
                        const itemValue = item.actualValue || (Array.isArray(item.value) ? 
                            randomInt(item.value[0], item.value[1]) : item.value);
                        
                        lootHTML += `
                            <div class="loot-item loot-item-${item.rarity}">
                                <div class="loot-item-info">
                                    <span class="loot-item-name">${item.name}
                                        <span class="rarity-badge rarity-${item.rarity}">${capitalizeFirstLetter(item.rarity)}</span>
                                    </span>
                                    <span class="loot-item-desc">${item.description}</span>
                                </div>
                                <span class="loot-item-price">€${itemValue}</span>
                            </div>
                        `;
                    });
                    
                    // Add total value at the bottom
                    lootHTML += `
                        <div class="loot-total">
                            <span>Total Value:</span>
                            <span>€${loot.totalValue}</span>
                        </div>
                    `;
                }
                
                lootHTML += `</div>`;
                
                // Update the loot container
                lootContainer.innerHTML = lootHTML;
                
                // Show notification
                showNotification(`Generated loot worth €${loot.totalValue}`, 'success', 2000);
            }
            
            // Save loot to local storage
            function saveLoot(loot) {
                savedLoot.push(loot);
                
                try {
                    localStorage.setItem('savedLoot', JSON.stringify(savedLoot));
                    showNotification(`Saved loot collection: ${loot.name}`, 'success', 3000);
                    updateSavedLootList();
                } catch (error) {
                    console.error('Error saving loot:', error);
                    showNotification('Failed to save loot', 'error', 3000);
                }
            }
            
            // Load saved loot from local storage
            function loadSavedLoot() {
                try {
                    const saved = localStorage.getItem('savedLoot');
                    if (saved) {
                        savedLoot = JSON.parse(saved);
                        updateSavedLootList();
                    }
                } catch (error) {
                    console.error('Error loading saved loot:', error);
                }
            }
            
            // Update the saved loot list UI
            function updateSavedLootList() {
                const lootList = container.querySelector('.loot-list');
                const emptyMessage = container.querySelector('.empty-saves-message');
                
                if (!lootList) return;
                
                // Show the container if we have saved loot
                if (savedLoot.length > 0) {
                    emptyMessage.style.display = 'none';
                    
                    // Clear current list
                    lootList.innerHTML = '';
                    
                    // Add each saved loot to the list
                    savedLoot.forEach(loot => {
                        const item = document.createElement('div');
                        item.className = 'saved-loot-item';
                        
                        const infoDiv = document.createElement('div');
                        infoDiv.className = 'loot-item-info';
                        
                        const nameSpan = document.createElement('div');
                        nameSpan.className = 'loot-item-name';
                        nameSpan.textContent = loot.name;
                        
                        const detailsSpan = document.createElement('div');
                        detailsSpan.className = 'loot-item-desc';
                        const itemCount = loot.items ? loot.items.length : 0;
                        detailsSpan.textContent = `${itemCount} items, €${loot.totalValue}`;
                        
                        infoDiv.appendChild(nameSpan);
                        infoDiv.appendChild(detailsSpan);
                        
                        const btnContainer = document.createElement('div');
                        btnContainer.className = 'loot-item-buttons';
                        
                        const loadBtn = document.createElement('button');
                        loadBtn.className = 'loot-load-btn';
                        loadBtn.textContent = 'Load';
                        
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'loot-delete-btn';
                        deleteBtn.textContent = 'Delete';
                        
                        btnContainer.appendChild(loadBtn);
                        btnContainer.appendChild(deleteBtn);
                        
                        item.appendChild(infoDiv);
                        item.appendChild(btnContainer);
                        
                        lootList.appendChild(item);
                        
                        // Add event listeners
                        loadBtn.addEventListener('click', () => {
                            displayLoot(loot);
                            
                            // Switch to the generator tab
                            tabButtons.forEach(btn => {
                                if (btn.getAttribute('data-tab') === 'generator') {
                                    btn.click();
                                }
                            });
                            
                            // Store the current loot for potential re-saving
                            container.dataset.currentLoot = JSON.stringify(loot);
                        });
                        
                        deleteBtn.addEventListener('click', () => {
                            deleteLoot(loot.id);
                        });
                    });
                } else {
                    emptyMessage.style.display = 'block';
                }
            }
            
            // Delete a saved loot collection
            function deleteLoot(id) {
                savedLoot = savedLoot.filter(loot => loot.id !== id);
                localStorage.setItem('savedLoot', JSON.stringify(savedLoot));
                showNotification('Loot collection deleted', 'info', 2000);
                updateSavedLootList();
            }
            
            // Handle generate button clicks
            if (generateBtn) {
                generateBtn.addEventListener('click', function() {
                    generateLoot();
                });
            }
            
            // Handle save button clicks
            if (saveBtn) {
                saveBtn.addEventListener('click', function() {
                    try {
                        const currentLootData = container.dataset.currentLoot;
                        if (currentLootData) {
                            const loot = JSON.parse(currentLootData);
                            saveLoot(loot);
                        } else {
                            showNotification('No loot to save. Generate some first.', 'info', 3000);
                        }
                    } catch (error) {
                        console.error('Error saving loot:', error);
                        showNotification('Failed to save loot', 'error', 3000);
                    }
                });
            }
            
            // Load any saved loot
            loadSavedLoot();
            
            // Populate the item database
            populateItemDatabase();
            
            console.log('Loot Generator panel initialized');
        }
        
        function initializeNPCGenerator(container) {
            // Define NPC data components
            
            // NPC Types with associated data
            const npcTypes = {
                "civilian": {
                    names: ["Ari", "Casey", "Jordan", "Riley", "Avery", "Blake", "Cameron", "Dakota", "Quinn", "Taylor", "Morgan", "Alexis", "Jamie", "Rory", "Skyler"],
                    lastNames: ["Smith", "Johnson", "Williams", "Chen", "Rodriguez", "Garcia", "Martinez", "Davis", "Brown", "Wilson", "Lee", "Nguyen", "Kim", "Patel", "Singh"],
                    roles: ["Vendor", "Bartender", "Worker", "Resident", "Passenger", "Bystander", "Street Urchin", "Clubgoer", "Citizen", "Market Seller"],
                    skills: ["Brawling", "Conversation", "Driving", "Education", "Persuasion", "Basic Tech", "Stealth", "Streetwise", "Perception", "Athletics"],
                    gear: ["Cellphone", "Credchip", "AR Glasses", "Flashlight", "Med Inhaler", "Stim Patch", "Synth-Leather Jacket", "Work Gloves", "Pocket Tool", "Canned Food"],
                    cyberware: ["Chipware Socket", "Basic Cyberaudio", "Light Tattoo", "Interface Plugs", "Subdermal Pocket", "Shift-Tacts", "Memory Chip"],
                    threatMultiplier: 0.8,
                    statCap: 7
                },
                "corporate": {
                    names: ["Victoria", "Alexander", "Elizabeth", "Jonathan", "Penelope", "Sebastian", "Samantha", "Nathaniel", "Charlotte", "Theodore", "Katherine", "Benjamin", "Isabella", "Harrison", "Sophia"],
                    lastNames: ["Arasaka", "Militech", "Biotechnica", "Petrochem", "Kang-Tao", "Kendachi", "Orbital Air", "Sterling", "Wei", "Nakamura", "Takemura", "Iwasaki", "Holloway", "Montgomery", "Rothschild"],
                    roles: ["Executive", "Manager", "Scientist", "Security", "Analyst", "Researcher", "Lawyer", "Agent", "Rep", "Advisor"],
                    skills: ["Bureaucracy", "Business", "Composition", "Accounting", "Human Perception", "Persuasion", "Education", "Library Search", "Conversation", "Wardrobe & Style"],
                    gear: ["Agent (AI Assistant)", "Expensive Suit", "Smart Glasses", "Encrypted Shard", "Corporate ID", "Trauma Team Card", "Encrypted Credchip", "Smart Briefcase", "Luxury Vehicle Key", "Designer Watch"],
                    cyberware: ["Neural Link", "Cyberoptics", "TelePresence Link", "Memory Boost", "Techhair", "Nasal Filters", "Voice Stress Analyzer", "Skinwatch"],
                    threatMultiplier: 1.0,
                    statCap: 8
                },
                "gangmember": {
                    names: ["Razor", "Spike", "Viper", "Diesel", "Fang", "Slash", "Cobra", "Venom", "Knuckles", "Bones", "Ripper", "Jinx", "Havoc", "Ghost", "Reaper"],
                    lastNames: ["Maelstrom", "Valentinos", "6th Street", "Tyger Claws", "Animals", "Voodoo Boys", "Mox", "Scavs", "Wraiths", "Blood Nation", "Red Chrome", "Steel Dragons", "Night Fangs", "Cyber Saints", "Venom Hand"],
                    roles: ["Enforcer", "Pusher", "Lookout", "Dealer", "Thug", "Runner", "Brawler", "Lieutenant", "Hitter", "Chopper"],
                    skills: ["Brawling", "Handguns", "Melee Weapons", "Streetwise", "Stealth", "Intimidation", "Concentration", "Resist Torture/Drugs", "Athletics", "Strength Feat"],
                    gear: ["Assault Rifle", "Medium Pistol", "Knife", "Baseball Bat", "Bulletproof Vest", "Armored Clothing", "Drugs", "Stolen Credchips", "Burner Phone", "Gang Colors"],
                    cyberware: ["Wolvers", "Slice n' Dice", "Big Knucks", "Reflex Boost", "Boosted Tendons", "Scratchers", "Pain Editor", "Subdermal Armor"],
                    threatMultiplier: 1.2,
                    statCap: 9
                },
                "fixer": {
                    names: ["Twitch", "Neon", "Circuit", "Glitch", "Echo", "Vector", "Nova", "Zero", "Cipher", "Proxy", "Cache", "Alias", "Mirage", "Phoenix", "Spectre"],
                    lastNames: ["Black", "White", "Shade", "Stone", "Silver", "Gold", "Diamond", "Glass", "Frost", "Bright", "Swift", "Steel", "Onyx", "Jade", "Ruby"],
                    roles: ["Broker", "Fence", "Middleman", "Supplier", "Negotiator", "Connector", "Dealer", "Information Broker", "Network Specialist", "Operator"],
                    skills: ["Perception", "Persuasion", "Business", "Streetwise", "Trading", "Forgery", "Bribery", "Conversation", "Accounting", "Handguns"],
                    gear: ["Smart Link Glasses", "Encrypted Shard", "High-End Agent", "Concealable Pistol", "Armored Business Attire", "Multiple Burner Phones", "Hidden Blade", "Portable Terminal", "Luxury Vehicle", "Encrypted Datacoin"],
                    cyberware: ["Neural Link with Mercantile Suite", "Subdermal Pocket", "Voice Stress Analyzer", "Memory Chip", "Tactical Analysis Interface", "Eye Camera", "Audio Scanner", "Enhanced Analytics"],
                    threatMultiplier: 1.1,
                    statCap: 8
                },
                "solo": {
                    names: ["Frost", "Jax", "Hawk", "Wolf", "Storm", "Flint", "Raven", "Shade", "Steel", "Viper", "Hunter", "Grim", "Shadow", "Blaze", "Reaper"],
                    lastNames: ["Black", "Graves", "Cross", "Stone", "Steele", "Wolf", "Hunter", "Blade", "Winter", "Night", "Viper", "Hawk", "Fang", "Edge", "Blood"],
                    roles: ["Mercenary", "Bodyguard", "Hitman", "Enforcer", "Operator", "Gun-for-hire", "Ex-Military", "Contractor", "Security Specialist", "Sharpshooter"],
                    skills: ["Handguns", "Shoulder Arms", "Melee Weapons", "Resist Torture/Drugs", "Athletics", "Tactics", "Weapons Tech", "Martial Arts", "Stealth", "Perception"],
                    gear: ["Assault Rifle", "Heavy Pistol", "Combat Knife", "Armored Jacket", "Light Armorjack", "Grenades", "Subdermal Armor", "Smart Glasses", "Ammo", "Trauma Pack"],
                    cyberware: ["Smartgun Link", "Kerenzikov", "Reflex Boost", "Sandevistan", "Subdermal Armor", "Wolvers", "Enhanced Antibodies", "Pain Editor"],
                    threatMultiplier: 1.5,
                    statCap: 10
                },
                "netrunner": {
                    names: ["Zero", "Cypher", "Proxy", "Ghost", "Neon", "Circuit", "Glitch", "Echo", "Virus", "Flux", "Vector", "Code", "Pixel", "Nova", "Pulse"],
                    lastNames: ["Binary", "Virtual", "Crypto", "Cipher", "Digital", "Vector", "Neural", "Core", "Phantom", "Protocol", "Webb", "Stream", "Null", "Byte", "Wire"],
                    roles: ["Hacker", "Decker", "Data Thief", "NET Specialist", "Cyber Operator", "Matrix Runner", "Code Jockey", "Security Breaker", "Intrusion Specialist", "Information Broker"],
                    skills: ["Interface", "Basic Tech", "Cryptography", "Electronics/Security Tech", "Programming", "Perception", "Library Search", "Composition", "Education", "Stealth"],
                    gear: ["Cyberdeck", "Neural Link", "Programs (multiple)", "Light Pistol", "Armored Techwear", "Computing Suite", "Smart Glasses", "Portable Terminal", "Lockpick Set", "Signal Boosters"],
                    cyberware: ["Neural Link", "Cyberdeck Link", "Interface Plugs", "Memory Boost", "Sensory Recording", "Techhair", "Eye Camera", "Tactile Boost"],
                    threatMultiplier: 1.4,
                    statCap: 9
                },
                "medtech": {
                    names: ["Hope", "Mercy", "Patch", "Stitch", "Remedy", "Doc", "Grace", "Swift", "Bones", "Vital", "Angel", "Life", "Florence", "Galen", "Soma"],
                    lastNames: ["Cruz", "Heal", "Mendez", "Chen", "Weaver", "Mend", "Savior", "Salva", "Vita", "White", "Hands", "Morgan", "Wright", "Goldman", "Patel"],
                    roles: ["Street Doctor", "Trauma Specialist", "Ripperdoc", "Combat Medic", "Surgeon", "Therapist", "Field Medic", "Pharmaceutical Tech", "Medical Researcher", "Body Bank Operator"],
                    skills: ["First Aid", "Paramedic", "Pharmaceuticals", "Education", "Science", "Deduction", "Conversation", "Human Perception", "Concentration", "Resist Torture/Drugs"],
                    gear: ["Medkit", "Trauma Pack", "Pharmaceuticals", "Med Scanner", "Light Pistol", "Surgical Tools", "Armored MedTech Coat", "Auto-Injector", "Portable Cryo-Unit", "Medical Supplies"],
                    cyberware: ["Medscanner", "Nasal Filters", "Toxin Binders", "Enhanced Antibodies", "Med System", "Biomonitor", "TrueEye", "Skill Chip: Surgery"],
                    threatMultiplier: 1.0,
                    statCap: 8
                },
                "rockerboy": {
                    names: ["Rebel", "Star", "Fuse", "Chord", "Vox", "Amp", "Riff", "Solo", "Lyric", "Beat", "Melody", "Rhythm", "Bass", "Axe", "Jam"],
                    lastNames: ["Chrome", "Steel", "Black", "Wild", "Strange", "Rebel", "Neon", "Flash", "Thunder", "Lightning", "Night", "Star", "Moon", "Mercury", "Venus"],
                    roles: ["Singer", "Guitarist", "Drummer", "DJ", "VR Artist", "Street Poet", "Political Activist", "Performer", "Frontman", "Digital Composer"],
                    skills: ["Charismatic Leadership", "Composition", "Play Instrument", "Wardrobe & Style", "Persuasion", "Performance", "Streetwise", "Brawling", "Athletics", "Resist Torture/Drugs"],
                    gear: ["Instrument", "Microphone Implant", "Custom Stage Clothes", "Holdout Pistol", "Media Suite", "Holographic Projector", "Encrypted Shard", "Agent (PR Manager)", "Portable Studio", "Braindance Recorder"],
                    cyberware: ["Enhanced Voice Box", "Audio Suite", "Light Tattoos", "Techhair", "Synthskin", "Subdermal LED Array", "Enhanced Hearing", "Memory Chip"],
                    threatMultiplier: 1.1,
                    statCap: 8
                },
                "nomad": {
                    names: ["Dust", "Road", "Sky", "Hawk", "Flint", "Desert", "Moon", "Sage", "Canyon", "Cliff", "Clay", "Mesa", "Ridge", "Dune", "Badlands"],
                    lastNames: ["Aldecaldo", "Jodes", "Thunberg", "Santiago", "Murieta", "Weathers", "Reeves", "Pacer", "Walker", "Dustman", "Windmaker", "Sandoval", "Rivers", "Stryker", "Thunderhorse"],
                    roles: ["Driver", "Scout", "Hunter", "Tribe Tech", "Mechanic", "Guide", "Trader", "Pathfinder", "Clan Leader", "Defender"],
                    skills: ["Driving", "Vehicle Tech", "Survival", "Tracking", "Animal Handling", "Endurance", "Navigation", "Athletics", "Shoulder Arms", "Wilderness Survival"],
                    gear: ["Assault Rifle", "Nomad Leathers", "Vehicle Tool Kit", "Custom Vehicle", "Smart Binoculars", "Survival Kit", "Tent/Shelter", "Water Purifier", "Field Communication Set", "Tribal Token"],
                    cyberware: ["Vehicle Link", "Cyberoptics (Vehicle Interface)", "Enhanced Antibodies", "Toxin Binders", "Nasal Filters", "Radio Communicator", "Enhanced Hearing", "Techhair"],
                    threatMultiplier: 1.2,
                    statCap: 9
                },
                "tech": {
                    names: ["Gear", "Socket", "Bolt", "Widget", "Circuit", "Spark", "Wrench", "Newton", "Tesla", "Edison", "Chip", "Cog", "Sprint", "Patch", "Buffer"],
                    lastNames: ["Fix", "Maker", "Builder", "Craft", "Wright", "Forge", "Smith", "Mend", "Patch", "Tech", "Rivet", "Solder", "Coder", "Compile", "Debug"],
                    roles: ["Engineer", "Mechanic", "Inventor", "Repairman", "Jury Rigger", "Weaponsmith", "Armorer", "Hardware Hacker", "Braindance Editor", "Vehicle Specialist"],
                    skills: ["Basic Tech", "Cybertech", "Electronics", "Weapontech", "Land Vehicle Tech", "Education", "Science", "Fabrication", "Demolitions", "Jury Rig"],
                    gear: ["Tech Tool Kit", "Smart Multitool", "Portable Electronics Lab", "Light Pistol", "Tech Armor", "Micro-fabricator", "Scrap Parts (various)", "Technical Manuals", "Portable Generator", "Targeting Assistance"],
                    cyberware: ["Tool Hand", "Multitools", "Tech Scanner", "Skill Chips: Technical", "Memory Chip", "Enhanced Vision", "Interface Plugs", "Sensitivity Enhancement"],
                    threatMultiplier: 1.0,
                    statCap: 8
                },
                "lawman": {
                    names: ["Justice", "Judge", "Law", "Shield", "Order", "Badge", "Honor", "Sentry", "Guardian", "Ranger", "Marshal", "Arbiter", "Sentinel", "Warden", "Keeper"],
                    lastNames: ["Stone", "Steel", "Iron", "Silver", "Justice", "Stern", "Brooks", "Shields", "Graves", "Manning", "Lawson", "Judge", "Marshall", "Court", "Justice"],
                    roles: ["Cop", "Detective", "Corporate Security", "Badge", "Agent", "Inspector", "Marshal", "Enforcer", "Investigator", "Special Unit"],
                    skills: ["Handguns", "Shoulder Arms", "Criminology", "Human Perception", "Interrogation", "Athletics", "Deduction", "Perception", "Driving", "Brawling"],
                    gear: ["Service Weapon", "Badge", "Bulletproof Vest", "Law Enforcement Credentials", "Handcuffs", "Communication Device", "Smart Glasses", "Tactical Gear", "Body Camera", "Investigation Kit"],
                    cyberware: ["Cyberoptics (Recording)", "Audio Recorder", "Subdermal Armor", "Reflex Boost", "Neural Link", "Voice Stress Analyzer", "Olfactory Boost", "Nasal Filters"],
                    threatMultiplier: 1.3,
                    statCap: 9
                },
                "executive": {
                    names: ["Sterling", "Morgan", "Winston", "Victoria", "Sinclair", "Montgomery", "Remington", "Archibald", "Cornelius", "Bartholomew", "Cassandra", "Maximilian", "Anastasia", "Nathaniel", "Elizabeth"],
                    lastNames: ["Blackwell", "Montgomery", "Sterling", "Rothschild", "Vanderbilt", "Rockefeller", "Windsor", "Astor", "Pembrooke", "Sinclair", "Worthington", "Goldsmith", "Richmond", "Wellington", "Kingsley"],
                    roles: ["CEO", "Director", "CTO", "CFO", "Board Member", "VP", "President", "COO", "Chairman", "Chief Executive"],
                    skills: ["Resources", "Bureaucracy", "Business", "Human Perception", "Conversation", "Wardrobe & Style", "Accounting", "Persuasion", "Personal Grooming", "Education"],
                    gear: ["Executive Pass", "Custom Outfit", "Executive Transport", "Private Security", "Encrypted Data Shard", "Smart Assistant", "Corporate Black Card", "Penthouse Access", "Designer Accessories", "Personal Assistant"],
                    cyberware: ["Neural Link", "Cyberoptics (Market Analysis Suite)", "Techhair", "Internal Agent", "Voice Stress Analyzer", "Olfactory Boost", "Skinwatch", "Memory Boost"],
                    threatMultiplier: 1.1,
                    statCap: 8
                }
            };
            
            // Threat levels and their modifiers
            const threatLevels = {
                "goon": {
                    statModifier: 0.7,
                    skillModifier: 0.6,
                    cyberwareCount: { min: 0, max: 1 },
                    skillCount: { min: 2, max: 4 },
                    gearCount: { min: 1, max: 3 },
                    hp: { base: 20, variance: 10 }
                },
                "standard": {
                    statModifier: 1.0,
                    skillModifier: 1.0,
                    cyberwareCount: { min: 1, max: 2 },
                    skillCount: { min: 3, max: 5 },
                    gearCount: { min: 2, max: 4 },
                    hp: { base: 30, variance: 10 }
                },
                "lieutenant": {
                    statModifier: 1.2,
                    skillModifier: 1.3,
                    cyberwareCount: { min: 2, max: 3 },
                    skillCount: { min: 4, max: 6 },
                    gearCount: { min: 3, max: 5 },
                    hp: { base: 40, variance: 15 }
                },
                "boss": {
                    statModifier: 1.5,
                    skillModifier: 1.5,
                    cyberwareCount: { min: 3, max: 5 },
                    skillCount: { min: 5, max: 8 },
                    gearCount: { min: 4, max: 6 },
                    hp: { base: 55, variance: 15 }
                }
            };
            
            // Personality traits
            const personalityTraits = [
                "Always speaks in third person",
                "Constantly fidgets with cybernetic implants",
                "Speaks in short, clipped sentences",
                "Paranoid about corporate surveillance",
                "Collects strange trinkets from the wasteland",
                "Has an unusual laugh that echoes",
                "Obsessed with pre-war technology",
                "Whistles when nervous",
                "Quotes obscure commercials from the 2020s",
                "Afraid of the dark",
                "Believes conspiracy theories about AI takeover",
                "Refers to their weapons by name",
                "Refuses to use certain technology",
                "Speaks multiple languages mid-sentence",
                "Carries a lucky charm everywhere",
                "Addicted to synthetic stimulants",
                "Has a distinctive facial tic",
                "Claims to hear voices from cyberspace",
                "Obsessively clean despite living in squalor",
                "Collects cybernetic parts from enemies",
                "Heavily religious in a world that's forgotten faith",
                "Speaks with an exaggerated accent",
                "Never makes eye contact",
                "Always makes bets on unlikely outcomes",
                "Convinced they're being followed",
                "Compulsively lies about their past",
                "Has a catchphrase they use constantly",
                "Carries mementos from everyone they've killed",
                "Terrified of specific technology",
                "Regularly changes their appearance"
            ];
            
            // Motivations
            const motivations = [
                "Seeking revenge for a past betrayal",
                "Trying to pay off a massive debt",
                "Searching for a long-lost family member",
                "Escaping a dangerous past life",
                "Addicted to expensive cyberware upgrades",
                "Obsessed with gaining corporate influence",
                "Protecting a secret that could get them killed",
                "Following orders from a mysterious benefactor",
                "Gathering intelligence for a rival faction",
                "Building a reputation in the underworld",
                "Seeking a cure for a terminal illness",
                "Wants to leave Night City for good",
                "Climbing the corporate ladder at any cost",
                "Driven by religious or ideological beliefs",
                "Collecting rare technology or artifacts",
                "Running from the law for past crimes",
                "Searching for a legendary piece of technology",
                "Trying to expose a corporate conspiracy",
                "Wants to become the best in their profession",
                "Simply trying to survive another day"
            ];
            
            // Stored saved NPCs
            let savedNPCs = [];
            
            // Get the tab buttons and content sections
            const tabButtons = container.querySelectorAll('.npc-tab');
            const tabContents = container.querySelectorAll('.npc-tab-content');
            
            // Get the generate button and selectors
            const generateBtn = container.querySelector('.generate-npc-btn');
            const saveBtn = container.querySelector('.save-npc-btn');
            const typeSelect = container.querySelector('.npc-type');
            const threatSelect = container.querySelector('.npc-threat');
            const npcContainer = container.querySelector('.npc-container');
            const templateContainer = container.querySelector('.templates-container');
            
            // Get the filter controls
            const filterButton = container.querySelector('.filter-button');
            const filterType = container.querySelector('.filter-type');
            const filterThreat = container.querySelector('.filter-threat');
            
            // Check if elements exist
            if (!tabButtons.length || !tabContents.length) {
                console.error('NPC panel tab elements not found');
                return;
            }
            
            if (!generateBtn || !typeSelect || !threatSelect || !npcContainer) {
                console.error('NPC generator elements not found');
                return;
            }
            
            // Add NPC Templates to the database tab
            function populateTemplateDatabase(filterType = 'all', filterThreat = 'all') {
                if (!templateContainer) return;
                
                // Clear the container
                templateContainer.innerHTML = '';
                
                // Create a set of template NPCs
                const templates = [
                    { type: 'corporate', name: 'Arasaka Security Officer', threat: 'standard', description: 'Standard corporate security officer equipped with company-issued cyberware and weapons.' },
                    { type: 'corporate', name: 'Militech Executive', threat: 'lieutenant', description: 'High-ranking executive with military background and expensive cyberware.' },
                    { type: 'corporate', name: 'Corporate Spy', threat: 'standard', description: 'Corporate agent specialized in infiltration and information gathering.' },
                    { type: 'solo', name: 'Veteran Mercenary', threat: 'lieutenant', description: 'Experienced solo with multiple combat enhancements and tactical training.' },
                    { type: 'solo', name: 'Elite Hitman', threat: 'boss', description: 'Top-tier assassin with extensive military-grade cyberware and combat skills.' },
                    { type: 'solo', name: 'Rookie Gun-for-hire', threat: 'goon', description: 'Newly established solo trying to make a name in the mercenary business.' },
                    { type: 'gangmember', name: 'Maelstrom Cyberpsycho', threat: 'boss', description: 'Heavily modified gang member on the verge of cyberpsychosis.' },
                    { type: 'gangmember', name: 'Tyger Claws Enforcer', threat: 'lieutenant', description: 'Gang lieutenant specializing in melee combat with cyberware enhancements.' },
                    { type: 'gangmember', name: 'Street Thug', threat: 'goon', description: 'Common gang member with minimal cyberware but dangerous in groups.' },
                    { type: 'netrunner', name: 'Voodoo Boys Netrunner', threat: 'lieutenant', description: 'Skilled netrunner capable of dangerous black ICE programs and neural attacks.' },
                    { type: 'netrunner', name: 'Corporate Black ICE Specialist', threat: 'boss', description: 'Elite corporate netrunner with military-grade deck and custom attack programs.' },
                    { type: 'netrunner', name: 'Script Kiddie', threat: 'goon', description: 'Amateur netrunner using pre-made programs with limited understanding.' },
                    { type: 'civilian', name: 'Street Vendor', threat: 'goon', description: 'Local merchant selling goods from a small stall in the Night City markets.' },
                    { type: 'civilian', name: 'Corporate Wage Slave', threat: 'goon', description: 'Low-level corporate employee with minimal cyberware and resources.' },
                    { type: 'civilian', name: 'Street Doc', threat: 'standard', description: 'Unlicensed medical practitioner operating from a hidden clinic.' }
                ];
                
                // Filter templates based on selected criteria
                const filteredTemplates = templates.filter(template => {
                    return (filterType === 'all' || template.type === filterType) && 
                           (filterThreat === 'all' || template.threat === filterThreat);
                });
                
                // Display templates
                if (filteredTemplates.length === 0) {
                    templateContainer.innerHTML = '<div class="empty-templates-message">No templates match your filter criteria.</div>';
                    return;
                }
                
                filteredTemplates.forEach(template => {
                    const templateItem = document.createElement('div');
                    templateItem.className = `template-item template-${template.type} threat-${template.threat}`;
                    templateItem.style.padding = '10px';
                    templateItem.style.marginBottom = '10px';
                    templateItem.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                    templateItem.style.borderRadius = '4px';
                    templateItem.style.borderLeft = `3px solid ${getTypeColor(template.type)}`;
                    
                    templateItem.innerHTML = `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="font-weight: bold;">${template.name}</span>
                            <span>
                                <span class="npc-type-badge" style="background-color: ${getTypeColor(template.type, true)};">${capitalizeFirstLetter(template.type)}</span>
                                <span class="npc-threat-badge threat-${template.threat}">${capitalizeFirstLetter(template.threat)}</span>
                            </span>
                        </div>
                        <div style="font-size: 13px; color: rgba(220, 220, 220, 0.8);">${template.description}</div>
                        <button class="generate-template-btn" 
                                data-type="${template.type}" 
                                data-threat="${template.threat}"
                                style="margin-top: 5px; padding: 3px 8px; background-color: rgba(0, 204, 255, 0.2); border: 1px solid #00ccff; color: #e0e0e0; border-radius: 3px; cursor: pointer;">
                            Generate
                        </button>
                    `;
                    
                    templateContainer.appendChild(templateItem);
                    
                    // Add event listener to the generate button
                    const generateTemplateBtn = templateItem.querySelector('.generate-template-btn');
                    generateTemplateBtn.addEventListener('click', function() {
                        const type = this.getAttribute('data-type');
                        const threat = this.getAttribute('data-threat');
                        
                        // Set the selectors to match the template
                        typeSelect.value = type;
                        threatSelect.value = threat;
                        
                        // Generate NPC and switch to the generator tab
                        generateNPC(type, threat);
                        
                        // Switch to the generator tab
                        tabButtons.forEach(btn => {
                            if (btn.getAttribute('data-tab') === 'generator') {
                                btn.click();
                            }
                        });
                    });
                });
            }
            
            // Get color for NPC type
            function getTypeColor(type, isBackground = false) {
                const colors = {
                    'solo': isBackground ? 'rgba(255, 50, 50, 0.2)' : '#ff3333',
                    'netrunner': isBackground ? 'rgba(0, 204, 255, 0.2)' : '#00ccff',
                    'corporate': isBackground ? 'rgba(255, 204, 0, 0.2)' : '#ffcc00',
                    'gangmember': isBackground ? 'rgba(255, 100, 0, 0.2)' : '#ff6400',
                    'fixer': isBackground ? 'rgba(170, 0, 255, 0.2)' : '#aa00ff',
                    'nomad': isBackground ? 'rgba(100, 150, 0, 0.2)' : '#649600',
                    'medtech': isBackground ? 'rgba(0, 200, 100, 0.2)' : '#00c864',
                    'rockerboy': isBackground ? 'rgba(255, 0, 200, 0.2)' : '#ff00c8',
                    'tech': isBackground ? 'rgba(0, 150, 200, 0.2)' : '#0096c8',
                    'lawman': isBackground ? 'rgba(0, 0, 200, 0.2)' : '#0000c8',
                    'executive': isBackground ? 'rgba(200, 150, 0, 0.2)' : '#c89600',
                    'civilian': isBackground ? 'rgba(150, 150, 150, 0.2)' : '#969696'
                };
                
                return colors[type] || (isBackground ? 'rgba(150, 150, 150, 0.2)' : '#969696');
            }
            
            // Tab switching functionality
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Deactivate all tabs
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.style.display = 'none');
                    
                    // Activate the selected tab
                    this.classList.add('active');
                    const activeTab = container.querySelector(`#${tabId}-tab`);
                    if (activeTab) {
                        activeTab.style.display = 'block';
                    }
                    
                    // If switching to database tab, populate templates
                    if (tabId === 'database') {
                        populateTemplateDatabase();
                    }
                    
                    console.log(`Switched to ${tabId} tab`);
                });
            });
            
            // Filter functionality
            if (filterButton) {
                filterButton.addEventListener('click', function() {
                    const typeValue = filterType.value;
                    const threatValue = filterThreat.value;
                    populateTemplateDatabase(typeValue, threatValue);
                });
            }
            
            // Helper functions
            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            
            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
            
            function getRandomElement(array) {
                return array[Math.floor(Math.random() * array.length)];
            }
            
            function getRandomStat(threatLevel, typeStatCap) {
                // Calculate base stat value based on threat level and type cap
                const baseMax = Math.min(10, Math.ceil(typeStatCap * threatLevels[threatLevel].statModifier));
                const baseMin = Math.max(2, Math.floor(baseMax * 0.6));
                
                return randomInt(baseMin, baseMax);
            }
            
            function getRandomSubset(array, min, max) {
                const count = randomInt(min, max);
                const shuffled = array.slice().sort(() => 0.5 - Math.random());
                return shuffled.slice(0, count);
            }
            
            // Generate an NPC with the given parameters
            function generateNPC(specificType = null, specificThreat = null) {
                try {
                    // Get the selected options or use provided values
                    const typeValue = specificType || typeSelect.value;
                    const threatValue = specificThreat || threatSelect.value;
                    
                    // Determine if we should include additional elements
                    const includeCyberware = container.querySelector('.npc-with-cyberware')?.checked ?? true;
                    const includeGear = container.querySelector('.npc-with-gear')?.checked ?? true;
                    const includeTraits = container.querySelector('.npc-with-traits')?.checked ?? true;
                    
                    // Handle random selections
                    let npcType = typeValue;
                    let npcThreat = threatValue;
                    
                    if (npcType === 'random') {
                        // Get random type excluding "random" itself
                        const typesArray = Object.keys(npcTypes);
                        npcType = getRandomElement(typesArray);
                    }
                    
                    if (npcThreat === 'random') {
                        // Get random threat excluding "random" itself
                        const threatsArray = Object.keys(threatLevels);
                        npcThreat = getRandomElement(threatsArray);
                    }
                    
                    // Get type and threat data
                    const typeData = npcTypes[npcType];
                    const threatData = threatLevels[npcThreat];
                    
                    if (!typeData || !threatData) {
                        throw new Error(`Invalid NPC type or threat level: ${npcType}, ${npcThreat}`);
                    }
                    
                    // Generate NPC data
                    const firstName = getRandomElement(typeData.names);
                    const lastName = getRandomElement(typeData.lastNames);
                    const role = getRandomElement(typeData.roles);
                    
                    // Generate stats
                    const statCap = typeData.statCap || 8;
                    const stats = {
                        INT: getRandomStat(npcThreat, statCap),
                        REF: getRandomStat(npcThreat, statCap),
                        DEX: getRandomStat(npcThreat, statCap),
                        TECH: getRandomStat(npcThreat, statCap),
                        COOL: getRandomStat(npcThreat, statCap),
                        WILL: getRandomStat(npcThreat, statCap),
                        LUCK: getRandomStat(npcThreat, statCap),
                        MOVE: getRandomStat(npcThreat, statCap),
                        BODY: getRandomStat(npcThreat, statCap),
                        EMP: getRandomStat(npcThreat, statCap - (includeCyberware ? 2 : 0)) // Lower EMP if has cyberware
                    };
                    
                    // Adjust certain stats based on type
                    switch (npcType) {
                        case 'solo':
                            stats.REF = Math.min(10, stats.REF + 2);
                            stats.BODY = Math.min(10, stats.BODY + 1);
                            break;
                        case 'netrunner':
                            stats.INT = Math.min(10, stats.INT + 2);
                            stats.TECH = Math.min(10, stats.TECH + 1);
                            break;
                        case 'corporate':
                            stats.COOL = Math.min(10, stats.COOL + 2);
                            stats.INT = Math.min(10, stats.INT + 1);
                            break;
                        case 'nomad':
                            stats.TECH = Math.min(10, stats.TECH + 1);
                            stats.WILL = Math.min(10, stats.WILL + 1);
                            break;
                        // Add more type-specific adjustments
                    }
                    
                    // Calculate HP based on BODY and threat level
                    const bodyMultiplier = 5;
                    const hp = threatData.hp.base + (stats.BODY * bodyMultiplier) + randomInt(-threatData.hp.variance, threatData.hp.variance);
                    
                    // Generate skills
                    const skillCount = randomInt(threatData.skillCount.min, threatData.skillCount.max);
                    const skillPool = typeData.skills.slice(); // Clone the array
                    const skills = [];
                    
                    for (let i = 0; i < skillCount && skillPool.length > 0; i++) {
                        const index = Math.floor(Math.random() * skillPool.length);
                        const skill = skillPool.splice(index, 1)[0];
                        const level = Math.floor(randomInt(2, 6) * threatData.skillModifier);
                        skills.push({ name: skill, level });
                    }
                    
                    // Generate cyberware
                    let cyberware = [];
                    if (includeCyberware) {
                        const cyberwareCount = randomInt(threatData.cyberwareCount.min, threatData.cyberwareCount.max);
                        const cyberwarePool = typeData.cyberware.slice(); // Clone the array
                        
                        for (let i = 0; i < cyberwareCount && cyberwarePool.length > 0; i++) {
                            const index = Math.floor(Math.random() * cyberwarePool.length);
                            cyberware.push(cyberwarePool.splice(index, 1)[0]);
                        }
                    }
                    
                    // Generate gear
                    let gear = [];
                    if (includeGear) {
                        const gearCount = randomInt(threatData.gearCount.min, threatData.gearCount.max);
                        const gearPool = typeData.gear.slice(); // Clone the array
                        
                        for (let i = 0; i < gearCount && gearPool.length > 0; i++) {
                            const index = Math.floor(Math.random() * gearPool.length);
                            gear.push(gearPool.splice(index, 1)[0]);
                        }
                    }
                    
                    // Generate personality and motivation
                    let personality = includeTraits ? getRandomElement(personalityTraits) : null;
                    let motivation = includeTraits ? getRandomElement(motivations) : null;
                    
                    // Assemble the NPC object
                    const npc = {
                        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
                        name: `${firstName} ${lastName}`,
                        type: npcType,
                        typeName: capitalizeFirstLetter(npcType),
                        threat: npcThreat,
                        threatName: capitalizeFirstLetter(npcThreat),
                        role: role,
                        stats: stats,
                        hp: hp,
                        skills: skills,
                        cyberware: cyberware,
                        gear: gear,
                        personality: personality,
                        motivation: motivation,
                        created: new Date().toISOString()
                    };
                    
                    // Display the generated NPC
                    displayNPC(npc);
                    
                    // Store the current NPC for potential saving
                    container.dataset.currentNPC = JSON.stringify(npc);
                    
                    return npc;
                } catch (error) {
                    console.error('Error generating NPC:', error);
                    showNotification('Failed to generate NPC', 'error', 3000);
                    return null;
                }
            }
            
            // Display an NPC in the UI
            function displayNPC(npc) {
                if (!npcContainer) return;
                
                // Create HTML for the NPC card
                let npcHTML = `
                    <div class="npc-card ${npc.type} ${npc.threat === 'boss' ? 'boss' : ''}">
                        <div class="npc-header">
                            <div class="npc-name-container">
                                <h4 class="npc-name">${npc.name}</h4>
                                <div>${npc.role}</div>
                            </div>
                            <div>
                                <span class="npc-type-badge" style="background-color: ${getTypeColor(npc.type, true)};">${npc.typeName}</span>
                                <span class="npc-threat-badge threat-${npc.threat}">${npc.threatName}</span>
                            </div>
                        </div>
                        
                        <div class="npc-stats-grid">
                `;
                
                // Add stats
                for (const [stat, value] of Object.entries(npc.stats)) {
                    npcHTML += `
                        <div class="stat-box">
                            <div class="stat-label">${stat}</div>
                            <div class="stat-value">${value}</div>
                        </div>
                    `;
                }
                
                // Add HP stat box
                npcHTML += `
                    <div class="stat-box" style="background-color: rgba(255, 50, 50, 0.2);">
                        <div class="stat-label">HP</div>
                        <div class="stat-value">${npc.hp}</div>
                    </div>
                </div>
                `;
                
                // Add skills section if skills exist
                if (npc.skills && npc.skills.length > 0) {
                    npcHTML += `
                        <div class="npc-skills">
                            <div class="npc-section-title">Skills</div>
                            <div class="npc-skill-list">
                    `;
                    
                    // Add each skill
                    npc.skills.forEach(skill => {
                        npcHTML += `<div class="npc-skill">${skill.name} ${skill.level}</div>`;
                    });
                    
                    npcHTML += `
                            </div>
                        </div>
                    `;
                }
                
                // Add cyberware section if cyberware exists
                if (npc.cyberware && npc.cyberware.length > 0) {
                    npcHTML += `
                        <div class="npc-cyberware">
                            <div class="npc-section-title">Cyberware</div>
                            <div class="npc-cyberware-list">
                    `;
                    
                    // Add each cyberware item
                    npc.cyberware.forEach(item => {
                        npcHTML += `<div class="npc-cyberware-item">${item}</div>`;
                    });
                    
                    npcHTML += `
                            </div>
                        </div>
                    `;
                }
                
                // Add gear section if gear exists
                if (npc.gear && npc.gear.length > 0) {
                    npcHTML += `
                        <div class="npc-gear">
                            <div class="npc-section-title">Gear</div>
                            <div class="npc-gear-list">
                    `;
                    
                    // Add each gear item
                    npc.gear.forEach(item => {
                        npcHTML += `<div class="npc-gear-item">${item}</div>`;
                    });
                    
                    npcHTML += `
                            </div>
                        </div>
                    `;
                }
                
                // Add personality and motivation
                if (npc.personality || npc.motivation) {
                    npcHTML += `<div class="npc-personality">`;
                    
                    if (npc.personality) {
                        npcHTML += `<div><strong>Personality:</strong> ${npc.personality}</div>`;
                    }
                    
                    if (npc.motivation) {
                        npcHTML += `<div><strong>Motivation:</strong> ${npc.motivation}</div>`;
                    }
                    
                    npcHTML += `</div>`;
                }
                
                npcHTML += `</div>`;
                
                // Update the NPC container
                npcContainer.innerHTML = npcHTML;
                
                // Show notification
                showNotification(`Generated ${npc.typeName} ${npc.role}`, 'success', 2000);
                
                console.log(`Generated NPC: ${npc.name}, ${npc.typeName} ${npc.role}`);
            }
            
            // Save NPC to local storage
            function saveNPC(npc) {
                savedNPCs.push(npc);
                
                try {
                    localStorage.setItem('savedNPCs', JSON.stringify(savedNPCs));
                    showNotification(`Saved NPC: ${npc.name}`, 'success', 3000);
                    updateSavedNPCsList();
                } catch (error) {
                    console.error('Error saving NPC:', error);
                    showNotification('Failed to save NPC', 'error', 3000);
                }
            }
            
            // Load saved NPCs from local storage
            function loadSavedNPCs() {
                try {
                    const saved = localStorage.getItem('savedNPCs');
                    if (saved) {
                        savedNPCs = JSON.parse(saved);
                        updateSavedNPCsList();
                    }
                } catch (error) {
                    console.error('Error loading saved NPCs:', error);
                }
            }
            
            // Update the saved NPCs list UI
            function updateSavedNPCsList() {
                const npcList = container.querySelector('.npc-list');
                const emptyMessage = container.querySelector('.empty-saves-message');
                
                if (!npcList) return;
                
                // Show the container if we have saved NPCs
                if (savedNPCs.length > 0) {
                    emptyMessage.style.display = 'none';
                    
                    // Clear current list
                    npcList.innerHTML = '';
                    
                    // Add each saved NPC to the list
                    savedNPCs.forEach(npc => {
                        const item = document.createElement('div');
                        item.className = 'saved-npc-item';
                        
                        const infoDiv = document.createElement('div');
                        infoDiv.className = 'npc-item-info';
                        
                        const nameSpan = document.createElement('div');
                        nameSpan.className = 'npc-item-name';
                        nameSpan.textContent = npc.name;
                        
                        const typeSpan = document.createElement('div');
                        typeSpan.className = 'npc-item-type';
                        typeSpan.textContent = `${npc.typeName} ${npc.role} (${npc.threatName})`;
                        
                        infoDiv.appendChild(nameSpan);
                        infoDiv.appendChild(typeSpan);
                        
                        const btnContainer = document.createElement('div');
                        btnContainer.className = 'npc-item-buttons';
                        
                        const loadBtn = document.createElement('button');
                        loadBtn.className = 'npc-load-btn';
                        loadBtn.textContent = 'Load';
                        
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'npc-delete-btn';
                        deleteBtn.textContent = 'Delete';
                        
                        btnContainer.appendChild(loadBtn);
                        btnContainer.appendChild(deleteBtn);
                        
                        item.appendChild(infoDiv);
                        item.appendChild(btnContainer);
                        
                        npcList.appendChild(item);
                        
                        // Add event listeners
                        loadBtn.addEventListener('click', () => {
                            displayNPC(npc);
                            
                            // Switch to the generator tab
                            tabButtons.forEach(btn => {
                                if (btn.getAttribute('data-tab') === 'generator') {
                                    btn.click();
                                }
                            });
                            
                            // Store the current NPC for potential re-saving
                            container.dataset.currentNPC = JSON.stringify(npc);
                        });
                        
                        deleteBtn.addEventListener('click', () => {
                            deleteNPC(npc.id);
                        });
                    });
                } else {
                    emptyMessage.style.display = 'block';
                }
            }
            
            // Delete a saved NPC
            function deleteNPC(id) {
                savedNPCs = savedNPCs.filter(npc => npc.id !== id);
                localStorage.setItem('savedNPCs', JSON.stringify(savedNPCs));
                showNotification('NPC deleted', 'info', 2000);
                updateSavedNPCsList();
            }
            
            // Handle generate button clicks
            if (generateBtn) {
                generateBtn.addEventListener('click', function() {
                    generateNPC();
                });
            }
            
            // Handle save button clicks
            if (saveBtn) {
                saveBtn.addEventListener('click', function() {
                    try {
                        const currentNPCData = container.dataset.currentNPC;
                        if (currentNPCData) {
                            const npc = JSON.parse(currentNPCData);
                            saveNPC(npc);
                        } else {
                            showNotification('No NPC to save. Generate one first.', 'info', 3000);
                        }
                    } catch (error) {
                        console.error('Error saving NPC:', error);
                        showNotification('Failed to save NPC', 'error', 3000);
                    }
                });
            }
            
            // Load any saved NPCs
            loadSavedNPCs();
            
            // Populate the NPC templates database
            populateTemplateDatabase();
            
            console.log('NPC Generator panel initialized');
        }
        
        function initializeNetrunning(container) {
            // Define the NET architecture components
            const iceTypes = [
                { 
                    name: "Wisp", 
                    difficulty: "Easy", 
                    effect: "2d6 damage to Netrunner", 
                    description: "A simple security program that attacks intruders.",
                    category: "Standard ICE",
                    dv: 2,
                    atk: 3,
                    def: 3,
                    hp: 5,
                    appearance: "Appears as a small blue flame with a simple facial structure"
                },
                { 
                    name: "Asp", 
                    difficulty: "Standard", 
                    effect: "3d6 damage to Netrunner", 
                    description: "An advanced attack program that can inflict serious harm.",
                    category: "Standard ICE",
                    dv: 4,
                    atk: 5,
                    def: 3,
                    hp: 8,
                    appearance: "Serpentine digital construct with glowing yellow data nodes"
                },
                { 
                    name: "Raven", 
                    difficulty: "Hard", 
                    effect: "Reveals position to all active security", 
                    description: "Sends an alert to security forces about the Netrunner's physical location.",
                    category: "Standard ICE",
                    dv: 6,
                    atk: 4,
                    def: 4,
                    hp: 10,
                    appearance: "Black avian form with glowing red eyes that continuously scans the architecture"
                },
                { 
                    name: "Hellhound", 
                    difficulty: "Very Hard", 
                    effect: "3d6 damage and connection crashed", 
                    description: "Powerful Black ICE that can cause brain damage and force disconnect.",
                    category: "Black ICE",
                    dv: 8,
                    atk: 7,
                    def: 6,
                    hp: 15,
                    appearance: "Fiery canine form with multiple heads and burning code trailing behind it"
                },
                { 
                    name: "Liche", 
                    difficulty: "Deadly", 
                    effect: "5d6 damage, save vs. death", 
                    description: "Extremely dangerous Black ICE that can kill a Netrunner instantly.",
                    category: "Black ICE",
                    dv: 10,
                    atk: 10,
                    def: 8,
                    hp: 20,
                    appearance: "Skeletal humanoid figure trailing wisps of decaying code that corrupts everything it touches"
                },
                { 
                    name: "Sabertooth", 
                    difficulty: "Hard", 
                    effect: "4d6 damage, -2 to all actions", 
                    description: "Vicious ICE that causes neural feedback and reduced capabilities.",
                    category: "Standard ICE",
                    dv: 6,
                    atk: 6,
                    def: 5,
                    hp: 12,
                    appearance: "Feline digital predator with elongated data fangs that pulse with energy"
                },
                { 
                    name: "Skunk", 
                    difficulty: "Standard", 
                    effect: "Interface action DVs +4 for 1d6 turns", 
                    description: "Releases 'stink code' that makes navigation difficult.",
                    category: "Standard ICE",
                    dv: 4,
                    atk: 3,
                    def: 4,
                    hp: 8,
                    appearance: "Amorphous cloud of corrupted data particles that spreads throughout the local architecture"
                },
                { 
                    name: "Killer", 
                    difficulty: "Very Hard", 
                    effect: "4d6 damage, DEF reduced by 4", 
                    description: "Military-grade ICE that targets a Netrunner's defense capabilities.",
                    category: "Black ICE",
                    dv: 8,
                    atk: 8,
                    def: 5,
                    hp: 15,
                    appearance: "Humanoid soldier construct with various weaponized limbs and targeting systems"
                },
                { 
                    name: "Scorpion", 
                    difficulty: "Hard", 
                    effect: "3d6 damage, trace initiated", 
                    description: "Attacks while simultaneously tracking the Netrunner's physical location.",
                    category: "Standard ICE",
                    dv: 6,
                    atk: 5,
                    def: 5,
                    hp: 10,
                    appearance: "Segmented data construct with glowing stinger that pulses with tracking algorithms"
                },
                { 
                    name: "Wizard's Book", 
                    difficulty: "Very Hard", 
                    effect: "Disables 1d3 random programs", 
                    description: "Advanced ICE that can deactivate Netrunner programs temporarily.",
                    category: "Anti-Program ICE",
                    dv: 8,
                    atk: 6,
                    def: 7,
                    hp: 12,
                    appearance: "Floating tome surrounded by orbiting symbols that cast digital 'spells'"
                },
                { 
                    name: "Kraken", 
                    difficulty: "Deadly", 
                    effect: "3d6 damage, pulls Netrunner down 1d3 levels", 
                    description: "Powerful Black ICE that drags the Netrunner deeper into the architecture.",
                    category: "Black ICE",
                    dv: 9,
                    atk: 9,
                    def: 7,
                    hp: 18,
                    appearance: "Massive tentacled data construct that extends throughout multiple levels of the architecture"
                }
            ];
            
            const controlNodes = [
                { 
                    name: "Password Database", 
                    security: "Low", 
                    description: "Contains login credentials and access codes.",
                    value: "Access to secure systems and restricted areas",
                    dv: 2
                },
                { 
                    name: "Video Security", 
                    security: "Medium", 
                    description: "Controls surveillance cameras throughout the facility.",
                    value: "Can disable cameras or access surveillance footage",
                    dv: 4
                },
                { 
                    name: "Door Controls", 
                    security: "Medium", 
                    description: "Can lock and unlock building access points.",
                    value: "Control physical access throughout the facility",
                    dv: 4
                },
                { 
                    name: "Personnel Files", 
                    security: "Low", 
                    description: "Contains employee information and schedules.",
                    value: "Personal data useful for social engineering",
                    dv: 2
                },
                { 
                    name: "Financial Records", 
                    security: "High", 
                    description: "Contains sensitive financial data and transactions.",
                    value: "Banking details, transaction histories, account numbers",
                    dv: 6
                },
                { 
                    name: "Security Protocols", 
                    security: "High", 
                    description: "Can enable or disable security systems.",
                    value: "Control over alarm systems and security responses",
                    dv: 6
                },
                { 
                    name: "Communication Systems", 
                    security: "Medium", 
                    description: "Controls internal and external communications.",
                    value: "Monitor or manipulate messages and comms",
                    dv: 4
                },
                { 
                    name: "Medical Records", 
                    security: "Medium", 
                    description: "Contains patient histories and treatment data.",
                    value: "Sensitive medical information and treatments",
                    dv: 4
                },
                { 
                    name: "Research Data", 
                    security: "Very High", 
                    description: "Contains proprietary research findings and test results.",
                    value: "Valuable intellectual property and classified research",
                    dv: 8
                },
                { 
                    name: "Weapon Systems", 
                    security: "Very High", 
                    description: "Controls automated defense systems.",
                    value: "Can activate/deactivate lethal defensive measures",
                    dv: 8
                },
                { 
                    name: "HVAC Systems", 
                    security: "Low", 
                    description: "Controls environmental systems in the building.",
                    value: "Control over air quality, temperature, ventilation",
                    dv: 2
                },
                { 
                    name: "Power Grid", 
                    security: "High", 
                    description: "Controls power distribution throughout the facility.",
                    value: "Can cause blackouts or power surges",
                    dv: 6
                },
                { 
                    name: "Automated Manufacturing", 
                    security: "High", 
                    description: "Controls robotic assembly lines and fabrication systems.",
                    value: "Can reprogram or sabotage manufacturing processes",
                    dv: 6
                },
                { 
                    name: "Funds Transfer Authorization", 
                    security: "Very High", 
                    description: "System to approve and process financial transactions.",
                    value: "Can redirect funds or manipulate transactions",
                    dv: 8
                }
            ];
            
            const architectureTypes = {
                "corporate": {
                    controlNodes: ["Password Database", "Financial Records", "Personnel Files", "Security Protocols", "Research Data", "Funds Transfer Authorization"],
                    iceTypes: ["Wisp", "Asp", "Raven", "Sabertooth", "Scorpion", "Wizard's Book"],
                    description: "Corporate architectures prioritize data protection and financial security."
                },
                "city": {
                    controlNodes: ["Power Grid", "HVAC Systems", "Door Controls", "Video Security", "Communication Systems", "Automated Manufacturing"],
                    iceTypes: ["Wisp", "Skunk", "Raven", "Asp", "Hellhound", "Kraken"],
                    description: "City infrastructure architectures focus on maintaining essential services."
                },
                "security": {
                    controlNodes: ["Video Security", "Door Controls", "Security Protocols", "Weapon Systems", "Communication Systems", "Password Database"],
                    iceTypes: ["Wisp", "Asp", "Raven", "Killer", "Hellhound", "Scorpion"],
                    description: "Security architectures are designed with multiple defensive layers and aggressive ICE."
                },
                "medical": {
                    controlNodes: ["Password Database", "Medical Records", "Personnel Files", "HVAC Systems", "Research Data", "Communication Systems"],
                    iceTypes: ["Wisp", "Skunk", "Asp", "Scorpion", "Liche", "Wizard's Book"],
                    description: "Medical architectures protect sensitive patient data and research information."
                },
                "military": {
                    controlNodes: ["Security Protocols", "Weapon Systems", "Research Data", "Communication Systems", "Door Controls", "Video Security"],
                    iceTypes: ["Asp", "Raven", "Killer", "Hellhound", "Liche", "Kraken"],
                    description: "Military architectures feature the most dangerous ICE and highest security levels."
                }
            };
            
            // Get the tab buttons and content sections
            const tabButtons = container.querySelectorAll('.netrunning-tab');
            const tabContents = container.querySelectorAll('.netrunning-tab-content');
            
            // Get the generate button and selectors
            const generateBtn = container.querySelector('.create-net-architecture-btn');
            const difficultySelect = container.querySelector('.netrunning-difficulty');
            const typeSelect = container.querySelector('.netrunning-type');
            const architectureContainer = container.querySelector('.architecture-container');
            
            if (!tabButtons.length || !tabContents.length) {
                console.error('Netrunning panel tab elements not found');
                return;
            }
            
            if (!generateBtn || !difficultySelect || !typeSelect || !architectureContainer) {
                console.error('Netrunning panel generator elements not found');
                return;
            }
            
            // Tab switching functionality
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Deactivate all tabs
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.style.display = 'none');
                    
                    // Activate the selected tab
                    this.classList.add('active');
                    const activeTab = container.querySelector(`#${tabId}-tab`);
                    if (activeTab) {
                        activeTab.style.display = 'block';
                    }
                    
                    console.log(`Switched to ${tabId} tab`);
                });
            });
            
            // Store saved architectures
            let savedArchitectures = [];
            
            // Generate NET architecture
            function generateArchitecture(difficulty, type, options = {}) {
                let levels = 5; // Standard
                
                // Set levels based on difficulty
                if (difficulty === 'basic') levels = 3;
                if (difficulty === 'challenging') levels = 6;
                if (difficulty === 'complex') levels = 7;
                if (difficulty === 'extreme') levels = 10;
                
                // Default options
                const defaultOptions = {
                    includeBlackIce: true,
                    allowEmptyLevels: true,
                    addFinalBoss: false
                };
                
                // Merge provided options with defaults
                const config = {...defaultOptions, ...options};
                
                let archIce = [];
                let archNodes = [];
                
                // Filter available ICE types based on selected type and black ICE preference
                let availableIce = type === 'random' ? 
                    iceTypes.slice() : 
                    iceTypes.filter(ice => architectureTypes[type].iceTypes.includes(ice.name));
                    
                if (!config.includeBlackIce) {
                    availableIce = availableIce.filter(ice => ice.category !== "Black ICE");
                }
                
                const availableNodes = type === 'random' ? 
                    controlNodes.slice() : 
                    controlNodes.filter(node => architectureTypes[type].controlNodes.includes(node.name));
                
                // Function to get a random element and remove it from the array
                function getRandomAndRemove(array) {
                    if (!array.length) return null;
                    const index = Math.floor(Math.random() * array.length);
                    const item = array[index];
                    array.splice(index, 1);
                    return item;
                }
                
                // Function to get a random element without removing it
                function getRandomElement(array) {
                    if (!array.length) return null;
                    return array[Math.floor(Math.random() * array.length)];
                }
                
                // Create architecture with a mix of ICE and Control Nodes
                for (let i = 0; i < levels; i++) {
                    // Last level special handling - add a boss if configured
                    if (i === levels - 1 && config.addFinalBoss) {
                        // Get the toughest ICE available
                        const blackIce = iceTypes.filter(ice => ice.category === "Black ICE")
                            .sort((a, b) => b.dv - a.dv);
                        
                        if (blackIce.length > 0) {
                            // Use the most dangerous Black ICE for the final level
                            archIce.push({
                                level: i + 1,
                                ...blackIce[0],
                                effect: blackIce[0].effect + " (ENHANCED)",
                                hp: blackIce[0].hp * 1.5, // 50% more HP for boss
                                isBoss: true
                            });
                            continue; // Skip the rest of this iteration
                        }
                    }
                    
                    // Allow empty levels based on configuration
                    if (!config.allowEmptyLevels || Math.random() > 0.2) { // 20% chance of empty level if allowed
                        // Deeper levels are more likely to have ICE
                        const iceChance = 0.3 + (i / levels) * 0.4; // 30% to 70% chance based on depth
                        
                        if (Math.random() < iceChance && availableIce.length > 0) {
                            // Add ICE to this level
                            archIce.push({
                                level: i + 1,
                                ...getRandomAndRemove(availableIce)
                            });
                        } else if (availableNodes.length > 0) {
                            // Add Control Node to this level
                            archNodes.push({
                                level: i + 1,
                                ...getRandomAndRemove(availableNodes)
                            });
                        } else if (availableIce.length > 0) {
                            // If we're out of nodes but still have ICE, use ICE
                            archIce.push({
                                level: i + 1,
                                ...getRandomAndRemove(availableIce)
                            });
                        } else {
                            // If we're out of both, reuse without removing
                            if (Math.random() < 0.5) {
                                const randomIce = getRandomElement(iceTypes);
                                if (randomIce) {
                                    archIce.push({
                                        level: i + 1,
                                        ...randomIce
                                    });
                                }
                            } else {
                                const randomNode = getRandomElement(controlNodes);
                                if (randomNode) {
                                    archNodes.push({
                                        level: i + 1,
                                        ...randomNode
                                    });
                                }
                            }
                        }
                    }
                }
                
                // Set a random password to unlock the architecture
                const password = Math.floor(Math.random() * 9000) + 1000; // 4-digit password
                
                // Generate architecture name based on type
                const generateName = () => {
                    const prefixes = {
                        corporate: ["MegaCorp", "Arasaka", "Militech", "Biotechnica", "PetroChem"],
                        city: ["Metro", "Urban", "DownBelow", "Sprawl", "NightCity"],
                        security: ["SecGuard", "DefCon", "Watchdog", "BlueLine", "Sentinel"],
                        medical: ["MediCorp", "Trauma", "BioScan", "GeneMed", "Pharma"],
                        military: ["WarMachine", "DeathHead", "IronFist", "BlackOps", "StrikeForce"]
                    };
                    
                    const suffixes = ["System", "Network", "Grid", "Hub", "Nexus", "Core", "Matrix", "Web"];
                    
                    const selectedType = type === 'random' ? 
                        ['corporate', 'city', 'security', 'medical', 'military'][Math.floor(Math.random() * 5)] : 
                        type;
                    
                    const prefix = prefixes[selectedType][Math.floor(Math.random() * prefixes[selectedType].length)];
                    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                    
                    return `${prefix}-${suffix}`;
                };
                
                return {
                    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5), // Generate unique ID
                    name: generateName(),
                    levels,
                    type: type === 'random' ? 
                        ['corporate', 'city', 'security', 'medical', 'military'][Math.floor(Math.random() * 5)] : 
                        type,
                    description: type === 'random' ? 
                        "Randomly generated architecture" : 
                        architectureTypes[type].description,
                    password,
                    ice: archIce,
                    nodes: archNodes,
                    options: config,
                    created: new Date().toISOString(),
                    difficulty
                };
            }
            
            // Save architecture to local storage
            function saveArchitecture(architecture) {
                savedArchitectures.push(architecture);
                
                try {
                    localStorage.setItem('savedNetArchitectures', JSON.stringify(savedArchitectures));
                    showNotification(`Saved architecture: ${architecture.name}`, 'success', 3000);
                    updateSavedArchitecturesList();
                } catch (error) {
                    console.error('Error saving architecture:', error);
                    showNotification('Failed to save architecture', 'error', 3000);
                }
            }
            
            // Load saved architectures from local storage
            function loadSavedArchitectures() {
                try {
                    const saved = localStorage.getItem('savedNetArchitectures');
                    if (saved) {
                        savedArchitectures = JSON.parse(saved);
                        updateSavedArchitecturesList();
                    }
                } catch (error) {
                    console.error('Error loading saved architectures:', error);
                }
            }
            
            // Update the saved architectures list UI
            function updateSavedArchitecturesList() {
                const savedContainer = container.querySelector('.saved-architectures');
                const listContainer = container.querySelector('.architecture-list');
                const emptyMessage = container.querySelector('.empty-saves-message');
                
                if (!savedContainer || !listContainer) return;
                
                // Show the container if we have saved architectures
                if (savedArchitectures.length > 0) {
                    savedContainer.style.display = 'block';
                    emptyMessage.style.display = 'none';
                    
                    // Clear current list
                    listContainer.innerHTML = '';
                    
                    // Add each saved architecture to the list
                    savedArchitectures.forEach(arch => {
                        const item = document.createElement('div');
                        item.className = 'saved-arch-item';
                        item.style.display = 'flex';
                        item.style.justifyContent = 'space-between';
                        item.style.padding = '5px';
                        item.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
                        
                        const nameSpan = document.createElement('span');
                        nameSpan.textContent = `${arch.name} (${arch.type}, ${arch.levels} levels)`;
                        
                        const btnContainer = document.createElement('div');
                        
                        const loadBtn = document.createElement('button');
                        loadBtn.textContent = 'Load';
                        loadBtn.style.marginRight = '5px';
                        loadBtn.style.padding = '2px 5px';
                        loadBtn.style.backgroundColor = 'rgba(0, 204, 255, 0.2)';
                        loadBtn.style.border = '1px solid #00ccff';
                        loadBtn.style.color = '#e0e0e0';
                        loadBtn.style.borderRadius = '3px';
                        loadBtn.style.cursor = 'pointer';
                        
                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Delete';
                        deleteBtn.style.padding = '2px 5px';
                        deleteBtn.style.backgroundColor = 'rgba(255, 50, 50, 0.2)';
                        deleteBtn.style.border = '1px solid #ff3333';
                        deleteBtn.style.color = '#e0e0e0';
                        deleteBtn.style.borderRadius = '3px';
                        deleteBtn.style.cursor = 'pointer';
                        
                        btnContainer.appendChild(loadBtn);
                        btnContainer.appendChild(deleteBtn);
                        
                        item.appendChild(nameSpan);
                        item.appendChild(btnContainer);
                        
                        listContainer.appendChild(item);
                        
                        // Add event listeners
                        loadBtn.addEventListener('click', () => {
                            displayArchitecture(arch);
                        });
                        
                        deleteBtn.addEventListener('click', () => {
                            deleteArchitecture(arch.id);
                        });
                    });
                } else {
                    emptyMessage.style.display = 'block';
                }
            }
            
            // Delete a saved architecture
            function deleteArchitecture(id) {
                savedArchitectures = savedArchitectures.filter(arch => arch.id !== id);
                localStorage.setItem('savedNetArchitectures', JSON.stringify(savedArchitectures));
                showNotification('Architecture deleted', 'info', 3000);
                updateSavedArchitecturesList();
            }
            
            // Format and display an architecture in the UI
            function displayArchitecture(architecture) {
                try {
                    // Create HTML representation
                    let architectureHTML = `
                        <div class="net-architecture" data-id="${architecture.id}">
                            <div class="arch-header">
                                <h4>NET Architecture: ${architecture.name}</h4>
                                <div class="arch-detail">Type: ${architecture.type.charAt(0).toUpperCase() + architecture.type.slice(1)}</div>
                                <div class="arch-detail">Password: ${architecture.password}</div>
                                <div class="arch-detail">Difficulty: ${architecture.difficulty.charAt(0).toUpperCase() + architecture.difficulty.slice(1)}</div>
                                <div class="arch-detail">Levels: ${architecture.levels}</div>
                                <div class="arch-description">${architecture.description}</div>
                            </div>
                            <div class="arch-levels">
                    `;
                    
                    // Sort all components by level
                    const allComponents = [...architecture.ice, ...architecture.nodes].sort((a, b) => a.level - b.level);
                    
                    for (let i = 0; i < architecture.levels; i++) {
                        const level = i + 1;
                        const levelComponents = allComponents.filter(comp => comp.level === level);
                        
                        architectureHTML += `
                            <div class="arch-level">
                                <div class="level-number">Level ${level}</div>
                                <div class="level-content">
                        `;
                        
                        if (levelComponents.length === 0) {
                            architectureHTML += `<div class="empty-level">Empty Level</div>`;
                        } else {
                            levelComponents.forEach(comp => {
                                // Determine if it's ICE or a Control Node
                                const isIce = architecture.ice.some(ice => ice.level === comp.level && ice.name === comp.name);
                                
                                if (isIce) {
                                    // Determine if it's black ICE
                                    const isBlackIce = comp.category === "Black ICE";
                                    const isBoss = comp.isBoss;
                                    
                                    architectureHTML += `
                                        <div class="ice-component ${isBlackIce ? 'black-ice' : ''} ${isBoss ? 'boss-ice' : ''}" style="${isBlackIce ? 'border-left: 3px solid #ff3333; background-color: rgba(255, 0, 0, 0.1);' : ''} ${isBoss ? 'border: 2px solid #ff3333; background-color: rgba(255, 0, 0, 0.15);' : ''}">
                                            <div class="component-header">
                                                <span class="ice-icon">${isBlackIce ? '☠️' : '🛡️'}</span>
                                                <span class="component-name">${comp.name} ${isBlackIce ? '(Black ICE)' : '(ICE)'} ${isBoss ? '👑' : ''}</span>
                                                <span class="component-difficulty">${comp.difficulty}</span>
                                            </div>
                                            <div class="component-stats">
                                                <span class="stat">DV: ${comp.dv}</span>
                                                <span class="stat">ATK: ${comp.atk}</span>
                                                <span class="stat">DEF: ${comp.def}</span>
                                                <span class="stat">HP: ${comp.hp}</span>
                                            </div>
                                            <div class="component-effect">${comp.effect}</div>
                                            <div class="component-description">${comp.description}</div>
                                            ${comp.appearance ? `<div class="component-appearance"><em>Appearance: ${comp.appearance}</em></div>` : ''}
                                        </div>
                                    `;
                                } else {
                                    architectureHTML += `
                                        <div class="node-component">
                                            <div class="component-header">
                                                <span class="node-icon">📱</span>
                                                <span class="component-name">${comp.name}</span>
                                                <span class="component-security">Security: ${comp.security}</span>
                                            </div>
                                            <div class="component-stats">DV: ${comp.dv}</div>
                                            <div class="component-description">${comp.description}</div>
                                            ${comp.value ? `<div class="component-value"><strong>Value:</strong> ${comp.value}</div>` : ''}
                                        </div>
                                    `;
                                }
                            });
                        }
                        
                        architectureHTML += `
                                </div>
                            </div>
                        `;
                    }
                    
                    architectureHTML += `
                            </div>
                        </div>
                    `;
                    
                    // Update the architecture container
                    architectureContainer.innerHTML = architectureHTML;
                    
                    // Show notification
                    showNotification(`Loaded ${architecture.name} architecture`, 'success', 3000);
                    
                    // Switch to the architecture tab if we're not already there
                    const generatorTab = container.querySelector('[data-tab="generator"]');
                    if (generatorTab && !generatorTab.classList.contains('active')) {
                        generatorTab.click();
                    }
                    
                    console.log(`Displayed ${architecture.name} architecture`);
                } catch (error) {
                    console.error('Error displaying architecture:', error);
                    showNotification('Failed to display architecture', 'error', 3000);
                }
            }
            
            // Handle generate button clicks
            generateBtn.addEventListener('click', function() {
                const difficulty = difficultySelect.value;
                const type = typeSelect.value;
                const includeBlackIce = container.querySelector('.black-ice-preference').checked;
                const allowEmptyLevels = container.querySelector('.empty-levels').checked;
                const addFinalBoss = container.querySelector('.final-boss').checked;
                
                try {
                    // Generate the architecture with options
                    const architecture = generateArchitecture(difficulty, type, {
                        includeBlackIce,
                        allowEmptyLevels,
                        addFinalBoss
                    });
                    
                    // Display the generated architecture
                    displayArchitecture(architecture);
                    
                    // Store the current architecture for potential saving
                    container.dataset.currentArchitecture = JSON.stringify(architecture);
                    
                    console.log(`Generated ${architecture.type} NET Architecture with ${architecture.levels} levels`);
                } catch (error) {
                    console.error('Error generating NET architecture:', error);
                    showNotification('Failed to generate NET architecture', 'error', 3000);
                }
            });
            
            // Handle save button clicks
            const saveBtn = container.querySelector('.save-architecture-btn');
            if (saveBtn) {
                saveBtn.addEventListener('click', function() {
                    try {
                        const currentArchData = container.dataset.currentArchitecture;
                        if (currentArchData) {
                            const architecture = JSON.parse(currentArchData);
                            saveArchitecture(architecture);
                        } else {
                            showNotification('No architecture to save. Generate one first.', 'info', 3000);
                        }
                    } catch (error) {
                        console.error('Error saving architecture:', error);
                        showNotification('Failed to save architecture', 'error', 3000);
                    }
                });
            }
            
            // Add styling for black ICE and boss ICE
            const style = document.createElement('style');
            style.textContent = `
                .black-ice {
                    border-left: 3px solid #ff3333 !important;
                    background-color: rgba(255, 0, 0, 0.1) !important;
                }
                .boss-ice {
                    border: 2px solid #ff3333 !important;
                    background-color: rgba(255, 0, 0, 0.15) !important;
                }
                .ice-category-header {
                    margin-top: 15px;
                    margin-bottom: 10px;
                    font-weight: bold;
                    color: var(--theme-accent, #00ccff);
                    border-bottom: 1px solid var(--theme-accent, #00ccff);
                    padding-bottom: 5px;
                }
                .component-stats {
                    display: flex;
                    gap: 10px;
                    margin: 5px 0;
                    font-size: 12px;
                    color: rgba(220, 220, 220, 0.8);
                }
                .stat {
                    background-color: rgba(0, 0, 0, 0.2);
                    padding: 2px 5px;
                    border-radius: 3px;
                }
                .component-appearance {
                    font-size: 12px;
                    color: rgba(220, 220, 220, 0.7);
                    margin-top: 5px;
                }
                .component-value {
                    font-size: 12px;
                    color: rgba(220, 220, 220, 0.9);
                    margin-top: 5px;
                }
                .architecture-tip {
                    font-style: italic;
                    color: rgba(220, 220, 220, 0.7);
                    font-size: 12px;
                    margin-top: 10px;
                }
                .arch-description {
                    font-style: italic;
                    color: rgba(220, 220, 220, 0.8);
                    margin-top: 10px;
                    font-size: 13px;
                }
                .saved-arch-item:hover {
                    background-color: rgba(0, 204, 255, 0.1);
                }
            `;
            document.head.appendChild(style);
            
            // Load any saved architectures
            loadSavedArchitectures();
            
            console.log('Netrunning panel initialized');
        }
        
        // Global state and constants for character sheet
        const CHARACTER_SETTINGS = {
            storageKeyPrefix: 'cyberpunk-character-'
        };
            
        function createCharacterSheetContent() {
            // Generate a unique ID for this instance
            const id = `char-${Date.now()}`;
            
            // Save ID to window for later access in initialization
            window._lastCharacterSheetId = id;
            
            // Character data state for persistence
            const characterState = {
                id: id,
                name: '',
                role: 'Solo',
                imageData: null, // Base64 image data
                stats: {
                    int: 5,
                    ref: 5,
                    dex: 5,
                    tech: 5,
                    cool: 5,
                    will: 5,
                    luck: 5,
                    move: 5,
                    body: 5,
                    emp: 5
                },
                derived: {
                    hp: 35,
                    currentHp: 35,
                    armor: 11,
                    humanity: 50
                },
                skills: 'Handgun +5, Stealth +3, Athletics +4, Perception +4, Conversation +3, Brawling +2, Education +2, Streetwise +4',
                weapons: 'Medium Pistol (2d6), Combat Knife (1d6), Heavy Pistol (3d6)',
                cyberware: 'Cybereye (Infrared), Light Armorjack (SP11), Agent (Pocket AI), Medscanner'
            };
            
            // Try to load from localStorage if available
            if (typeof localStorage !== 'undefined') {
                try {
                    const savedData = localStorage.getItem(`${CHARACTER_SETTINGS.storageKeyPrefix}${id}`);
                    if (savedData) {
                        const parsedData = JSON.parse(savedData);
                        if (parsedData) {
                            Object.assign(characterState, parsedData);
                        }
                    }
                } catch (e) {
                    console.error('Error loading saved character data:', e);
                }
            }
            
            // Save the current state to window for initialization
            window._characterState = characterState;

            // Create full character sheet HTML
            return `
                <div class="character-sheet">
                    <div class="character-header">
                        <input type="text" id="${id}-name" placeholder="Character Name" class="character-name" value="${characterState.name}">
                        <div id="${id}-image-container" class="character-image-container" role="button" tabindex="0" aria-label="Click to upload character image">
                            ${characterState.imageData ? 
                                `<img src="${characterState.imageData}" class="character-image" alt="Character Portrait">` : 
                                `<div class="character-image-placeholder">Click to<br>Upload Image</div>`
                            }
                            <input type="file" id="${id}-image-input" class="character-file-input" accept="image/*">
                        </div>
                    </div>
                    
                    <div class="character-stats-grid">
                        <div class="character-stats-section">
                            <div class="character-section-title">Stats</div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">INT</span>
                                <input type="number" id="${id}-stat-int" class="character-stat-input" min="1" max="10" value="${characterState.stats.int}">
                            </div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">REF</span>
                                <input type="number" id="${id}-stat-ref" class="character-stat-input" min="1" max="10" value="${characterState.stats.ref}">
                            </div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">DEX</span>
                                <input type="number" id="${id}-stat-dex" class="character-stat-input" min="1" max="10" value="${characterState.stats.dex}">
                            </div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">TECH</span>
                                <input type="number" id="${id}-stat-tech" class="character-stat-input" min="1" max="10" value="${characterState.stats.tech}">
                            </div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">COOL</span>
                                <input type="number" id="${id}-stat-cool" class="character-stat-input" min="1" max="10" value="${characterState.stats.cool}">
                            </div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">WILL</span>
                                <input type="number" id="${id}-stat-will" class="character-stat-input" min="1" max="10" value="${characterState.stats.will}">
                            </div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">LUCK</span>
                                <input type="number" id="${id}-stat-luck" class="character-stat-input" min="1" max="10" value="${characterState.stats.luck}">
                            </div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">MOVE</span>
                                <input type="number" id="${id}-stat-move" class="character-stat-input" min="1" max="10" value="${characterState.stats.move}">
                            </div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">BODY</span>
                                <input type="number" id="${id}-stat-body" class="character-stat-input" min="1" max="10" value="${characterState.stats.body}">
                            </div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">EMP</span>
                                <input type="number" id="${id}-stat-emp" class="character-stat-input" min="1" max="10" value="${characterState.stats.emp}">
                            </div>
                        </div>
                        
                        <div class="character-derived-section">
                            <div class="character-section-title">Derived Stats</div>
                            <div class="character-derived-item">
                                <span class="character-stat-label">Max HP</span>
                                <span id="${id}-derived-hp" class="character-stat-value">${characterState.derived.hp}</span>
                            </div>
                            <div class="character-derived-item">
                                <span class="character-stat-label">Humanity</span>
                                <span id="${id}-derived-humanity" class="character-stat-value">${characterState.derived.humanity}</span>
                            </div>
                            
                            <div class="character-section-title" style="margin-top: 15px;">Current Status</div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">Current HP</span>
                                <input type="number" id="${id}-current-hp" class="character-stat-input" min="0" value="${characterState.derived.currentHp}">
                            </div>
                            <div class="character-stat-item">
                                <span class="character-stat-label">Armor SP</span>
                                <input type="number" id="${id}-armor-sp" class="character-stat-input" min="0" value="${characterState.derived.armor}">
                            </div>
                        </div>
                    </div>
                    
                    <div class="character-section-title">Skills</div>
                    <textarea id="${id}-skills" class="character-textarea" placeholder="Add comma-separated list of skills (e.g. Handgun +5, Stealth +3)">${characterState.skills}</textarea>
                    
                    <div class="character-section-title">Weapons</div>
                    <textarea id="${id}-weapons" class="character-textarea" placeholder="Add comma-separated list of weapons (e.g. Medium Pistol (2d6), Combat Knife (1d6))">${characterState.weapons}</textarea>
                    
                    <div class="character-section-title">Cyberware & Gear</div>
                    <textarea id="${id}-cyberware" class="character-textarea" placeholder="Add comma-separated list of cyberware and gear (e.g. Cybereye (Infrared), Light Armorjack (SP11))">${characterState.cyberware}</textarea>
                    
                    <div class="character-actions">
                        <button id="${id}-apply" class="character-action-button primary">Apply</button>
                        <button id="${id}-save" class="character-action-button">Save</button>
                        <button id="${id}-load" class="character-action-button">Load</button>
                        <button id="${id}-reset" class="character-action-button">Reset</button>
                        <button id="${id}-print" class="character-action-button">Print</button>
                    </div>
                </div>
            `;
        }
        
        // Initialize Character Sheet panel functionality
        function initializeCharacterSheet(contentElement) {
            // Get the ID from the window variable set during creation
            const id = window._lastCharacterSheetId;
            if (!id) {
                console.error('Character sheet ID not found');
                return;
            }
            
            // Get the state or create a new one
            const characterState = window._characterState || {
                id: id,
                name: '',
                role: 'Solo',
                imageData: null,
                stats: { int: 5, ref: 5, dex: 5, tech: 5, cool: 5, will: 5, luck: 5, move: 5, body: 5, emp: 5 },
                derived: { hp: 35, currentHp: 35, armor: 11, humanity: 50 },
                skills: 'Handgun +5, Stealth +3, Athletics +4, Perception +4, Conversation +3, Brawling +2, Education +2, Streetwise +4',
                weapons: 'Medium Pistol (2d6), Combat Knife (1d6), Heavy Pistol (3d6)',
                cyberware: 'Cybereye (Infrared), Light Armorjack (SP11), Agent (Pocket AI), Medscanner'
            };
            
            // Function to calculate derived stats
            function calculateHP(bodyValue) {
                return 10 + (bodyValue * 5);
            }
            
            // Create notification function to improve UI feedback
            function showNotification(message, type = 'info', duration = 3000) {
                // Create container if it doesn't exist
                let container = document.querySelector('.character-notifications');
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'character-notifications';
                    document.body.appendChild(container);
                }
                
                // Create notification element
                const notification = document.createElement('div');
                notification.className = `character-notification ${type}`;
                notification.innerHTML = `
                    <div class="character-notification-message">${message}</div>
                    <button class="character-notification-close" aria-label="Close notification">&times;</button>
                `;
                
                // Add close functionality
                const closeButton = notification.querySelector('.character-notification-close');
                closeButton.addEventListener('click', function() {
                    notification.classList.add('exiting');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                });
                
                // Add to container
                container.appendChild(notification);
                
                // Auto-remove after duration
                if (duration > 0) {
                    setTimeout(() => {
                        if (document.body.contains(notification)) {
                            notification.classList.add('exiting');
                            setTimeout(() => {
                                if (notification.parentNode) {
                                    notification.parentNode.removeChild(notification);
                                }
                            }, 300);
                        }
                    }, duration);
                }
            }
            
            // Function to gather character data from all inputs
            function gatherCharacterData() {
                characterState.name = contentElement.querySelector(`#${id}-name`).value;
                characterState.stats.int = parseInt(contentElement.querySelector(`#${id}-stat-int`).value) || 5;
                characterState.stats.ref = parseInt(contentElement.querySelector(`#${id}-stat-ref`).value) || 5;
                characterState.stats.dex = parseInt(contentElement.querySelector(`#${id}-stat-dex`).value) || 5;
                characterState.stats.tech = parseInt(contentElement.querySelector(`#${id}-stat-tech`).value) || 5;
                characterState.stats.cool = parseInt(contentElement.querySelector(`#${id}-stat-cool`).value) || 5;
                characterState.stats.will = parseInt(contentElement.querySelector(`#${id}-stat-will`).value) || 5;
                characterState.stats.luck = parseInt(contentElement.querySelector(`#${id}-stat-luck`).value) || 5;
                characterState.stats.move = parseInt(contentElement.querySelector(`#${id}-stat-move`).value) || 5;
                characterState.stats.body = parseInt(contentElement.querySelector(`#${id}-stat-body`).value) || 5;
                characterState.stats.emp = parseInt(contentElement.querySelector(`#${id}-stat-emp`).value) || 5;
                characterState.derived.currentHp = parseInt(contentElement.querySelector(`#${id}-current-hp`).value) || 35;
                characterState.derived.armor = parseInt(contentElement.querySelector(`#${id}-armor-sp`).value) || 11;
                characterState.skills = contentElement.querySelector(`#${id}-skills`).value;
                characterState.weapons = contentElement.querySelector(`#${id}-weapons`).value;
                characterState.cyberware = contentElement.querySelector(`#${id}-cyberware`).value;
                
                // Recalculate derived stats
                characterState.derived.hp = calculateHP(characterState.stats.body);
                
                return characterState;
            }
            
            // Function to save character to localStorage
            function saveToLocalStorage() {
                if (typeof localStorage !== 'undefined') {
                    const storageKey = `${CHARACTER_SETTINGS.storageKeyPrefix}${id}`;
                    try {
                        localStorage.setItem(storageKey, JSON.stringify(characterState));
                        return true;
                    } catch (e) {
                        console.error('Error saving character data:', e);
                        return false;
                    }
                }
                return false;
            }
            
            // Function to update UI with current state
            function updateCharacterUI() {
                // Update name field
                contentElement.querySelector(`#${id}-name`).value = characterState.name;
                
                // Update image
                const imageContainer = contentElement.querySelector(`#${id}-image-container`);
                if (characterState.imageData) {
                    imageContainer.innerHTML = `
                        <img src="${characterState.imageData}" class="character-image" alt="Character Portrait">
                        <input type="file" id="${id}-image-input" class="character-file-input" accept="image/*">
                    `;
                } else {
                    imageContainer.innerHTML = `
                        <div class="character-image-placeholder">Click to<br>Upload Image</div>
                        <input type="file" id="${id}-image-input" class="character-file-input" accept="image/*">
                    `;
                }
                
                // Re-add click event
                setupImageUploadHandler();
                
                // Update stat inputs
                contentElement.querySelector(`#${id}-stat-int`).value = characterState.stats.int;
                contentElement.querySelector(`#${id}-stat-ref`).value = characterState.stats.ref;
                contentElement.querySelector(`#${id}-stat-dex`).value = characterState.stats.dex;
                contentElement.querySelector(`#${id}-stat-tech`).value = characterState.stats.tech;
                contentElement.querySelector(`#${id}-stat-cool`).value = characterState.stats.cool;
                contentElement.querySelector(`#${id}-stat-will`).value = characterState.stats.will;
                contentElement.querySelector(`#${id}-stat-luck`).value = characterState.stats.luck;
                contentElement.querySelector(`#${id}-stat-move`).value = characterState.stats.move;
                contentElement.querySelector(`#${id}-stat-body`).value = characterState.stats.body;
                contentElement.querySelector(`#${id}-stat-emp`).value = characterState.stats.emp;
                
                // Update derived stats
                contentElement.querySelector(`#${id}-derived-hp`).textContent = characterState.derived.hp;
                contentElement.querySelector(`#${id}-derived-humanity`).textContent = characterState.derived.humanity;
                contentElement.querySelector(`#${id}-current-hp`).value = characterState.derived.currentHp;
                contentElement.querySelector(`#${id}-armor-sp`).value = characterState.derived.armor;
                
                // Update textareas
                contentElement.querySelector(`#${id}-skills`).value = characterState.skills;
                contentElement.querySelector(`#${id}-weapons`).value = characterState.weapons;
                contentElement.querySelector(`#${id}-cyberware`).value = characterState.cyberware;
            }
            
            // Setup event handlers
            
            // Image upload handling
            function setupImageUploadHandler() {
                const imageContainer = contentElement.querySelector(`#${id}-image-container`);
                const imageInput = contentElement.querySelector(`#${id}-image-input`);
                
                imageContainer.addEventListener('click', function() {
                    imageInput.click();
                });
                
                imageInput.addEventListener('change', function(e) {
                    if (this.files && this.files[0]) {
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            const imageData = e.target.result;
                            
                            // Update the UI
                            imageContainer.innerHTML = `
                                <img src="${imageData}" class="character-image" alt="Character Portrait">
                                <input type="file" id="${id}-image-input" class="character-file-input" accept="image/*">
                            `;
                            
                            // Re-add the event listener
                            setupImageUploadHandler();
                            
                            // Update the state
                            characterState.imageData = imageData;
                        };
                        
                        reader.readAsDataURL(this.files[0]);
                    }
                });
            }
            
            // Initialize image upload
            setupImageUploadHandler();
            
            // Body stat change handler for HP calculation
            const bodyInput = contentElement.querySelector(`#${id}-stat-body`);
            const hpSpan = contentElement.querySelector(`#${id}-derived-hp`);
            const currentHpInput = contentElement.querySelector(`#${id}-current-hp`);
            
            bodyInput.addEventListener('change', function() {
                const bodyValue = parseInt(this.value) || 5;
                const newHp = calculateHP(bodyValue);
                
                // Update derived HP
                hpSpan.textContent = newHp;
                
                // Also update current HP if it was at max before
                if (parseInt(currentHpInput.value) === characterState.derived.hp) {
                    currentHpInput.value = newHp;
                }
                
                // Update state
                characterState.stats.body = bodyValue;
                characterState.derived.hp = newHp;
            });
            
            // Apply button handler
            const applyButton = contentElement.querySelector(`#${id}-apply`);
            applyButton.addEventListener('click', function() {
                // Gather all inputs
                gatherCharacterData();
                
                // Save to localStorage if available
                if (saveToLocalStorage()) {
                    showNotification('Character data applied and saved locally', 'success');
                } else {
                    showNotification('Character data applied (storage unavailable)', 'info');
                }
                
                // Apply a visual feedback effect to the button
                this.classList.add('character-button-flash');
                setTimeout(() => {
                    this.classList.remove('character-button-flash');
                }, 500);
            });
            
            // Save button handler - exports character data as JSON file
            const saveButton = contentElement.querySelector(`#${id}-save`);
            saveButton.addEventListener('click', function() {
                // First apply changes to ensure latest data
                gatherCharacterData();
                saveToLocalStorage();
                
                // Add timestamp to metadata
                const exportData = {
                    ...characterState,
                    meta: {
                        version: '2.0',
                        exportedAt: new Date().toISOString(),
                        exportType: 'cyberpunk-character'
                    }
                };
                
                // Convert to pretty JSON
                const jsonData = JSON.stringify(exportData, null, 2);
                
                // Create blob and download link
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                // Create a meaningful filename with date
                const dateStr = new Date().toISOString().slice(0, 10);
                const filename = characterState.name ? 
                    `${characterState.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${dateStr}.json` : 
                    `cyberpunk-character_${dateStr}.json`;
                
                // Create and trigger download link
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
                
                showNotification(`Character saved to ${filename}`, 'success');
                
                // Apply visual feedback
                this.classList.add('character-button-flash');
                setTimeout(() => {
                    this.classList.remove('character-button-flash');
                }, 500);
            });
            
            // Load button handler - imports character data from JSON file
            const loadButton = contentElement.querySelector(`#${id}-load`);
            loadButton.addEventListener('click', function() {
                // Create a file input
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.json';
                fileInput.style.display = 'none';
                
                fileInput.addEventListener('change', function(e) {
                    if (this.files && this.files[0]) {
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            try {
                                // Parse the JSON data
                                const importedData = JSON.parse(e.target.result);
                                
                                // Validate basic structure
                                if (!importedData.stats || !importedData.derived) {
                                    throw new Error('Invalid character file format');
                                }
                                
                                // Apply imported data to state
                                characterState.name = importedData.name || '';
                                characterState.imageData = importedData.imageData;
                                characterState.stats = {...characterState.stats, ...importedData.stats};
                                characterState.derived = {...characterState.derived, ...importedData.derived};
                                characterState.skills = importedData.skills || '';
                                characterState.weapons = importedData.weapons || '';
                                characterState.cyberware = importedData.cyberware || '';
                                
                                // Update UI with imported data
                                updateCharacterUI();
                                
                                // Also save to local storage
                                saveToLocalStorage();
                                
                                showNotification('Character data loaded successfully', 'success');
                            } catch (error) {
                                console.error('Error parsing character file:', error);
                                showNotification(`Error loading character data: ${error.message}`, 'error');
                            }
                        };
                        
                        reader.readAsText(this.files[0]);
                    }
                });
                
                // Trigger the file input
                document.body.appendChild(fileInput);
                fileInput.click();
                
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(fileInput);
                }, 100);
            });
            
            // Reset button handler
            const resetButton = contentElement.querySelector(`#${id}-reset`);
            resetButton.addEventListener('click', function() {
                if (confirm('Reset all character data to defaults?')) {
                    // Reset to default state
                    characterState.name = '';
                    characterState.imageData = null;
                    characterState.stats = {
                        int: 5, ref: 5, dex: 5, tech: 5,
                        cool: 5, will: 5, luck: 5, move: 5,
                        body: 5, emp: 5
                    };
                    characterState.derived = {
                        hp: 35,
                        currentHp: 35,
                        armor: 11,
                        humanity: 50
                    };
                    characterState.skills = 'Handgun +5, Stealth +3, Athletics +4, Perception +4, Conversation +3, Brawling +2, Education +2, Streetwise +4';
                    characterState.weapons = 'Medium Pistol (2d6), Combat Knife (1d6), Heavy Pistol (3d6)';
                    characterState.cyberware = 'Cybereye (Infrared), Light Armorjack (SP11), Agent (Pocket AI), Medscanner';
                    
                    // Update UI
                    updateCharacterUI();
                    
                    // Update localStorage
                    saveToLocalStorage();
                    
                    showNotification('Character reset to defaults', 'info');
                }
            });
            
            // Print button handler with enhanced styling
            const printButton = contentElement.querySelector(`#${id}-print`);
            printButton.addEventListener('click', function() {
                // First apply changes to ensure latest data
                gatherCharacterData();
                saveToLocalStorage();
                
                // Create a printable version of the character sheet
                const printWindow = window.open('', '_blank');
                
                if (!printWindow) {
                    showNotification('Pop-up blocked. Please allow pop-ups for this site.', 'error');
                    return;
                }
                
                // Print-friendly CSS with Cyberpunk styling that still prints well
                const printCSS = `
                    @page {
                        size: letter portrait;
                        margin: 0.5in;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        line-height: 1.5;
                        margin: 0;
                        padding: 20px;
                        color: #111;
                        background: #fff;
                        position: relative;
                    }
                    
                    /* For screen preview */
                    @media screen {
                        body {
                            background: #0a0a14;
                            color: #e0e0e0;
                        }
                        
                        body::before {
                            content: '';
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: linear-gradient(135deg, rgba(0, 12, 24, 0.95), rgba(0, 36, 60, 0.9));
                            z-index: -1;
                        }
                        
                        .print-wrapper {
                            max-width: 8.5in;
                            margin: 0 auto;
                            background: #fff;
                            color: #111;
                            padding: 0.5in;
                            box-shadow: 0 0 30px rgba(0, 255, 196, 0.3);
                            border-radius: 4px;
                            position: relative;
                            overflow: hidden;
                        }
                        
                        .print-wrapper::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 4px;
                            background: linear-gradient(90deg, 
                                rgba(0, 255, 196, 0), 
                                rgba(0, 255, 196, 0.8), 
                                rgba(0, 255, 196, 0));
                        }
                    }
                    
                    /* Header styles */
                    .print-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 15px;
                        margin-bottom: 20px;
                        position: relative;
                    }
                    
                    .print-title {
                        font-size: 28px;
                        font-weight: bold;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    }
                    
                    .print-character-name {
                        font-size: 24px;
                        font-weight: bold;
                    }
                    
                    .print-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    
                    .print-section {
                        border: 1px solid #333;
                        border-radius: 5px;
                        padding: 15px;
                        margin-bottom: 20px;
                        page-break-inside: avoid;
                    }
                    
                    .print-section-title {
                        font-weight: bold;
                        font-size: 18px;
                        margin-bottom: 12px;
                        border-bottom: 1px solid #333;
                        padding-bottom: 5px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .print-stat-item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                        padding: 4px 0;
                        border-bottom: 1px dotted #ccc;
                    }
                    
                    .print-stat-label {
                        font-weight: bold;
                        letter-spacing: 0.5px;
                    }
                    
                    .print-stat-value {
                        font-family: 'Courier New', monospace;
                        font-weight: bold;
                    }
                    
                    img.print-character-image {
                        max-width: 150px;
                        max-height: 150px;
                        object-fit: contain;
                        border: 1px solid #333;
                        padding: 2px;
                        background-color: #fff;
                    }
                    
                    .print-skills, .print-weapons, .print-cyberware {
                        line-height: 1.6;
                    }
                    
                    .print-footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        border-top: 1px solid #ccc;
                        padding-top: 10px;
                    }
                    
                    .print-logo {
                        display: block;
                        margin: 0 auto 10px;
                        max-width: 100px;
                        opacity: 0.8;
                    }
                    
                    .print-watermark {
                        position: absolute;
                        bottom: 0.5in;
                        right: 0.5in;
                        opacity: 0.05;
                        pointer-events: none;
                        font-size: 80px;
                        font-weight: bold;
                        text-transform: uppercase;
                        transform: rotate(-45deg);
                    }
                    
                    .print-button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #00ccff;
                        color: #000;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        transition: all 0.3s ease;
                    }
                    
                    .print-button:hover {
                        background-color: #00a3cc;
                        box-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
                    }
                    
                    /* Print media specific styles */
                    @media print {
                        body {
                            font-size: 12pt;
                            background: #fff !important;
                            color: #000 !important;
                        }
                        
                        .print-wrapper {
                            box-shadow: none;
                            padding: 0;
                            max-width: none;
                        }
                        
                        .no-print, .print-button {
                            display: none !important;
                        }
                        
                        a {
                            text-decoration: none;
                            color: #000;
                        }
                        
                        .print-section {
                            border: 1px solid #000;
                            break-inside: avoid;
                        }
                        
                        .print-watermark {
                            opacity: 0.03;
                        }
                    }
                `;
                
                // Generate the content
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Cyberpunk RED Character Sheet - ${characterState.name || 'Unnamed'}</title>
                        <style>${printCSS}</style>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body>
                        <div class="print-wrapper">
                            <div class="print-watermark">CYBERPUNK</div>
                            
                            <div class="print-header">
                                <div class="print-title">CYBERPUNK RED CHARACTER</div>
                                <div class="print-character-name">${characterState.name || 'Unnamed Character'}</div>
                            </div>
                            
                            <div class="print-grid">
                                <div class="print-section">
                                    <div class="print-section-title">Core Statistics</div>
                                    <div class="print-stat-item">
                                        <span class="print-stat-label">INTELLIGENCE (INT)</span>
                                        <span class="print-stat-value">${characterState.stats.int}</span>
                                    </div>
                                    <div class="print-stat-item">
                                        <span class="print-stat-label">REFLEXES (REF)</span>
                                        <span class="print-stat-value">${characterState.stats.ref}</span>
                                    </div>
                                    <div class="print-stat-item">
                                        <span class="print-stat-label">DEXTERITY (DEX)</span>
                                        <span class="print-stat-value">${characterState.stats.dex}</span>
                                    </div>
                                    <div class="print-stat-item">
                                        <span class="print-stat-label">TECHNIQUE (TECH)</span>
                                        <span class="print-stat-value">${characterState.stats.tech}</span>
                                    </div>
                                    <div class="print-stat-item">
                                        <span class="print-stat-label">COOL</span>
                                        <span class="print-stat-value">${characterState.stats.cool}</span>
                                    </div>
                                    <div class="print-stat-item">
                                        <span class="print-stat-label">WILLPOWER (WILL)</span>
                                        <span class="print-stat-value">${characterState.stats.will}</span>
                                    </div>
                                    <div class="print-stat-item">
                                        <span class="print-stat-label">LUCK</span>
                                        <span class="print-stat-value">${characterState.stats.luck}</span>
                                    </div>
                                    <div class="print-stat-item">
                                        <span class="print-stat-label">MOVEMENT (MOVE)</span>
                                        <span class="print-stat-value">${characterState.stats.move}</span>
                                    </div>
                                    <div class="print-stat-item">
                                        <span class="print-stat-label">BODY</span>
                                        <span class="print-stat-value">${characterState.stats.body}</span>
                                    </div>
                                    <div class="print-stat-item">
                                        <span class="print-stat-label">EMPATHY (EMP)</span>
                                        <span class="print-stat-value">${characterState.stats.emp}</span>
                                    </div>
                                </div>
                                
                                <div class="print-section">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div style="flex: 1">
                                            <div class="print-section-title">Status & Derived</div>
                                            <div class="print-stat-item">
                                                <span class="print-stat-label">MAXIMUM HP</span>
                                                <span class="print-stat-value">${characterState.derived.hp}</span>
                                            </div>
                                            <div class="print-stat-item">
                                                <span class="print-stat-label">CURRENT HP</span>
                                                <span class="print-stat-value">${characterState.derived.currentHp}</span>
                                            </div>
                                            <div class="print-stat-item">
                                                <span class="print-stat-label">ARMOR SP</span>
                                                <span class="print-stat-value">${characterState.derived.armor}</span>
                                            </div>
                                            <div class="print-stat-item">
                                                <span class="print-stat-label">HUMANITY</span>
                                                <span class="print-stat-value">${characterState.derived.humanity}</span>
                                            </div>
                                        </div>
                                        
                                        <div style="flex: 1; text-align: center; padding-left: 15px;">
                                            ${characterState.imageData ? 
                                                `<img src="${characterState.imageData}" class="print-character-image" alt="Character Portrait">` : 
                                                `<div style="border: 1px dashed #777; width: 130px; height: 130px; margin: 0 auto; display: flex; justify-content: center; align-items: center;">
                                                    <div style="text-align: center; color: #777; font-style: italic;">No Image</div>
                                                </div>`
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="print-section">
                                <div class="print-section-title">Skills</div>
                                <div class="print-skills">
                                    ${characterState.skills
                                        .split(',')
                                        .map(skill => skill.trim())
                                        .filter(skill => skill.length > 0)
                                        .map(skill => `<span style="display: inline-block; margin-right: 15px; padding: 2px 5px;">${skill}</span>`)
                                        .join('')}
                                </div>
                            </div>
                            
                            <div class="print-section">
                                <div class="print-section-title">Weapons & Combat</div>
                                <div class="print-weapons">
                                    ${characterState.weapons
                                        .split(',')
                                        .map(weapon => weapon.trim())
                                        .filter(weapon => weapon.length > 0)
                                        .map(weapon => `<span style="display: inline-block; margin-right: 15px; padding: 2px 5px;">${weapon}</span>`)
                                        .join('')}
                                </div>
                            </div>
                            
                            <div class="print-section">
                                <div class="print-section-title">Cyberware & Gear</div>
                                <div class="print-cyberware">
                                    ${characterState.cyberware
                                        .split(',')
                                        .map(item => item.trim())
                                        .filter(item => item.length > 0)
                                        .map(item => `<span style="display: inline-block; margin-right: 15px; padding: 2px 5px;">${item}</span>`)
                                        .join('')}
                                </div>
                            </div>
                            
                            <div class="print-footer">
                                <div>Generated: ${new Date().toLocaleDateString()} | Cyberpunk RED Character Sheet</div>
                                <div>© R. Talsorian Games, Inc. | For personal use only.</div>
                            </div>
                        </div>
                        
                        <div class="no-print" style="margin: 20px 0; text-align: center;">
                            <button class="print-button" onclick="window.print();return false;">Print as PDF</button>
                        </div>
                        
                        <script>
                            // Auto-trigger print dialog after a short delay to ensure everything loads
                            setTimeout(() => {
                                window.print();
                            }, 500);
                        </script>
                    </body>
                    </html>
                `);
                
                printWindow.document.close();
                
                // Add visual feedback to button
                this.classList.add('character-button-flash');
                setTimeout(() => {
                    this.classList.remove('character-button-flash');
                }, 500);
            });
            
            console.log('Character sheet panel initialized');
        }
        
        function createNPCGeneratorContent() {
            return `
                <div class="npc-generator">
                    <h3>Cyberpunk RED NPC Generator</h3>
                    
                    <div class="npc-tabs">
                        <button class="npc-tab active" data-tab="generator">Generator</button>
                        <button class="npc-tab" data-tab="saved">Saved NPCs</button>
                        <button class="npc-tab" data-tab="database">NPC Database</button>
                    </div>
                    
                    <div class="npc-tab-content" id="generator-tab">
                        <div class="generator-controls">
                            <div class="control-row">
                                <button class="generate-npc-btn">Generate NPC</button>
                                <button class="save-npc-btn">Save NPC</button>
                            </div>
                            <div class="control-row">
                                <select class="npc-type">
                                    <option value="random" selected>Random Type</option>
                                    <option value="civilian">Civilian</option>
                                    <option value="corporate">Corporate</option>
                                    <option value="fixer">Fixer</option>
                                    <option value="nomad">Nomad</option>
                                    <option value="gangmember">Gang Member</option>
                                    <option value="netrunner">Netrunner</option>
                                    <option value="solo">Solo</option>
                                    <option value="tech">Tech</option>
                                    <option value="medtech">Medtech</option>
                                    <option value="executive">Executive</option>
                                    <option value="lawman">Lawman</option>
                                    <option value="rockerboy">Rockerboy</option>
                                </select>
                                
                                <select class="npc-threat">
                                    <option value="random" selected>Random Threat</option>
                                    <option value="goon">Goon (Easy)</option>
                                    <option value="standard">Standard (Average)</option>
                                    <option value="lieutenant">Lieutenant (Hard)</option>
                                    <option value="boss">Boss (Very Hard)</option>
                                </select>
                            </div>
                            <div class="control-row">
                                <label>
                                    <input type="checkbox" class="npc-with-cyberware" checked>
                                    Include Cyberware
                                </label>
                                <label>
                                    <input type="checkbox" class="npc-with-gear" checked>
                                    Include Gear
                                </label>
                                <label>
                                    <input type="checkbox" class="npc-with-traits" checked>
                                    Include Personality
                                </label>
                            </div>
                        </div>
                        
                        <div class="npc-result">
                            <div class="npc-container">
                                <div class="npc-placeholder">
                                    <p>Click "Generate NPC" to create a random NPC for your game.</p>
                                    <p class="npc-tip">Tip: Different NPC types have different skills, cyberware, and equipment.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="npc-tab-content" id="saved-tab" style="display: none;">
                        <div class="saved-npcs" style="margin-bottom: 15px;">
                            <h4>Saved NPCs</h4>
                            <div class="npc-list" style="max-height: 400px; overflow-y: auto;">
                                <!-- Saved NPCs will appear here -->
                                <div class="empty-saves-message">No saved NPCs yet.</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="npc-tab-content" id="database-tab" style="display: none;">
                        <h4>NPC Templates</h4>
                        
                        <div class="database-filters control-row">
                            <select class="filter-type">
                                <option value="all" selected>All Types</option>
                                <option value="civilian">Civilian</option>
                                <option value="corporate">Corporate</option>
                                <option value="gangmember">Gang Member</option>
                                <option value="netrunner">Netrunner</option>
                                <option value="solo">Solo</option>
                            </select>
                            
                            <select class="filter-threat">
                                <option value="all" selected>All Threat Levels</option>
                                <option value="goon">Goon (Easy)</option>
                                <option value="standard">Standard (Average)</option>
                                <option value="lieutenant">Lieutenant (Hard)</option>
                                <option value="boss">Boss (Very Hard)</option>
                            </select>
                            
                            <button class="filter-button">Apply Filter</button>
                        </div>
                        
                        <div class="templates-container" style="max-height: 400px; overflow-y: auto;">
                            <!-- NPC templates will be generated here -->
                        </div>
                    </div>
                </div>
            `;
        }
        
        function createWeaponTableContent() {
            return `
                <div class="weapons-table">
                    <h3>Cyberpunk RED Weapons</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Weapon</th>
                                <th>Type</th>
                                <th>DMG</th>
                                <th>ROF</th>
                                <th>Range</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Medium Pistol</td>
                                <td>P</td>
                                <td>2d6</td>
                                <td>2</td>
                                <td>50m</td>
                                <td>€50</td>
                            </tr>
                            <tr>
                                <td>Heavy SMG</td>
                                <td>SMG</td>
                                <td>3d6</td>
                                <td>3</td>
                                <td>150m</td>
                                <td>€500</td>
                            </tr>
                            <tr>
                                <td>Assault Rifle</td>
                                <td>R</td>
                                <td>5d6</td>
                                <td>4</td>
                                <td>400m</td>
                                <td>€1000</td>
                            </tr>
                            <tr>
                                <td>Shotgun</td>
                                <td>SG</td>
                                <td>5d6</td>
                                <td>1</td>
                                <td>50m</td>
                                <td>€500</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        function createArmorTableContent() {
            return `
                <div class="armor-table">
                    <h3>Cyberpunk RED Armor</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Armor</th>
                                <th>SP</th>
                                <th>Penalty</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Leather Jacket</td>
                                <td>4</td>
                                <td>0</td>
                                <td>€20</td>
                            </tr>
                            <tr>
                                <td>Kevlar Vest</td>
                                <td>7</td>
                                <td>0</td>
                                <td>€50</td>
                            </tr>
                            <tr>
                                <td>Light Armorjack</td>
                                <td>11</td>
                                <td>0</td>
                                <td>€100</td>
                            </tr>
                            <tr>
                                <td>Medium Armorjack</td>
                                <td>12</td>
                                <td>-2</td>
                                <td>€500</td>
                            </tr>
                            <tr>
                                <td>Heavy Armorjack</td>
                                <td>13</td>
                                <td>-2</td>
                                <td>€1000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        function createCriticalInjuriesContent() {
            return `
                <div class="critical-injuries">
                    <h3>Critical Injuries Table</h3>
                    <div class="critical-controls">
                        <button class="roll-critical-btn">Roll Random Injury</button>
                        <select class="critical-body-location">
                            <option value="random">Random Location</option>
                            <option value="head">Head</option>
                            <option value="torso">Torso</option>
                            <option value="right-arm">Right Arm</option>
                            <option value="left-arm">Left Arm</option>
                            <option value="right-leg">Right Leg</option>
                            <option value="left-leg">Left Leg</option>
                        </select>
                    </div>
                    
                    <div class="critical-result">
                        <div class="injury-result">
                            <h4>Roll Result</h4>
                            <div class="injury-details">
                                <p>Click "Roll Random Injury" to generate a critical injury.</p>
                            </div>
                        </div>
                    </div>
                    
                    <h4>Cyberpunk RED Critical Injury Table</h4>
                    <div class="table-container">
                        <table class="critical-table">
                            <thead>
                                <tr>
                                    <th>Roll</th>
                                    <th>Injury</th>
                                    <th>Effect</th>
                                    <th>Recovery</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1-3</td>
                                    <td>Broken Fingers</td>
                                    <td>-2 to all actions with that hand</td>
                                    <td>1 week</td>
                                </tr>
                                <tr>
                                    <td>4-6</td>
                                    <td>Foreign Object</td>
                                    <td>1 damage per turn until removed</td>
                                    <td>DV13 First Aid check</td>
                                </tr>
                                <tr>
                                    <td>7-8</td>
                                    <td>Sprained Ankle</td>
                                    <td>-2 to MOVE</td>
                                    <td>1 week</td>
                                </tr>
                                <tr>
                                    <td>9</td>
                                    <td>Dislocated Shoulder</td>
                                    <td>-4 to all actions with that arm</td>
                                    <td>1 day with treatment</td>
                                </tr>
                                <tr>
                                    <td>10-11</td>
                                    <td>Battered</td>
                                    <td>-1 to all actions</td>
                                    <td>1 day</td>
                                </tr>
                                <tr>
                                    <td>12-13</td>
                                    <td>Deep Cut</td>
                                    <td>Lose 1 HP per turn until treated</td>
                                    <td>DV13 First Aid check</td>
                                </tr>
                                <tr>
                                    <td>14-15</td>
                                    <td>Bleeding</td>
                                    <td>Recover at half rate until treated</td>
                                    <td>DV13 First Aid or 1 day in hospital</td>
                                </tr>
                                <tr>
                                    <td>16</td>
                                    <td>Broken Ribs</td>
                                    <td>-2 to all actions</td>
                                    <td>1 week</td>
                                </tr>
                                <tr>
                                    <td>17-18</td>
                                    <td>Concussion</td>
                                    <td>-2 to INT, REF, DEX</td>
                                    <td>1 day with treatment</td>
                                </tr>
                                <tr>
                                    <td>19</td>
                                    <td>Broken Arm</td>
                                    <td>Arm unusable</td>
                                    <td>1 month or 1 week with surgery</td>
                                </tr>
                                <tr>
                                    <td>20</td>
                                    <td>Broken Leg</td>
                                    <td>MOVE reduced to 1</td>
                                    <td>1 month or 1 week with surgery</td>
                                </tr>
                                <tr>
                                    <td>21-22</td>
                                    <td>Ruptured Organ</td>
                                    <td>-4 to all actions</td>
                                    <td>Death in 1 hour without surgery</td>
                                </tr>
                                <tr>
                                    <td>23-24</td>
                                    <td>Crushed Fingers</td>
                                    <td>Lose 1d6 fingers, -2 per finger lost to actions using that hand</td>
                                    <td>Permanent unless cyberware installed</td>
                                </tr>
                                <tr>
                                    <td>25</td>
                                    <td>Dismembered Leg</td>
                                    <td>Lose leg, MOVE reduced to 1</td>
                                    <td>Permanent unless cyberware installed</td>
                                </tr>
                                <tr>
                                    <td>26-27</td>
                                    <td>Dismembered Arm</td>
                                    <td>Lose arm and items held in that hand</td>
                                    <td>Permanent unless cyberware installed</td>
                                </tr>
                                <tr>
                                    <td>28-29</td>
                                    <td>Lost Eye</td>
                                    <td>-4 to ranged attacks and Perception checks</td>
                                    <td>Permanent unless cyberware installed</td>
                                </tr>
                                <tr>
                                    <td>30-31</td>
                                    <td>Brain Injury</td>
                                    <td>-4 to INT actions and -2 to all other actions</td>
                                    <td>Permanent unless special treatment available</td>
                                </tr>
                                <tr>
                                    <td>32-33</td>
                                    <td>Maimed Face</td>
                                    <td>Lose 5 points from Appearance Stat</td>
                                    <td>Permanent unless surgery or cyberware</td>
                                </tr>
                                <tr>
                                    <td>34+</td>
                                    <td>Damaged Spine</td>
                                    <td>Lose use of all limbs</td>
                                    <td>Permanent unless special treatment available</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
        
        function createNetrunningContent() {
            return `
                <div class="netrunning-panel">
                    <h3>Cyberpunk RED Netrunning</h3>
                    
                    <div class="netrunning-tabs">
                        <button class="netrunning-tab active" data-tab="generator">NET Architecture</button>
                        <button class="netrunning-tab" data-tab="reference">Rules Reference</button>
                        <button class="netrunning-tab" data-tab="programs">Programs</button>
                        <button class="netrunning-tab" data-tab="ice">ICE Database</button>
                    </div>
                    
                    <div class="netrunning-tab-content" id="generator-tab">
                        <div class="netrunning-controls">
                            <div class="control-row">
                                <button class="create-net-architecture-btn">Generate Architecture</button>
                                <button class="save-architecture-btn" style="background-color: rgba(0, 204, 255, 0.2); border: 1px solid #00ccff;">Save Architecture</button>
                            </div>
                            <div class="control-row">
                                <select class="netrunning-difficulty">
                                    <option value="basic">Basic (3 levels)</option>
                                    <option value="standard" selected>Standard (5 levels)</option>
                                    <option value="complex">Complex (7 levels)</option>
                                    <option value="challenging">Challenging (6 levels)</option>
                                    <option value="extreme">Extreme (10 levels)</option>
                                </select>
                                
                                <select class="netrunning-type">
                                    <option value="corporate">Corporate</option>
                                    <option value="city">City Infrastructure</option>
                                    <option value="security">Security System</option>
                                    <option value="medical">Medical Facility</option>
                                    <option value="military">Military Installation</option>
                                    <option value="random" selected>Random</option>
                                </select>
                            </div>
                            <div class="control-row">
                                <label>
                                    <input type="checkbox" class="black-ice-preference" checked>
                                    Include Black ICE
                                </label>
                                <label>
                                    <input type="checkbox" class="empty-levels" checked>
                                    Allow Empty Levels
                                </label>
                                <label>
                                    <input type="checkbox" class="final-boss">
                                    Add Final Boss ICE
                                </label>
                            </div>
                        </div>
                        
                        <div class="saved-architectures" style="margin-bottom: 15px; display: none;">
                            <h4>Saved Architectures</h4>
                            <div class="architecture-list" style="max-height: 150px; overflow-y: auto;">
                                <!-- Saved architectures will appear here -->
                                <div class="empty-saves-message">No saved architectures yet.</div>
                            </div>
                        </div>
                        
                        <div class="architecture-result">
                            <div class="architecture-container">
                                <div class="architecture-placeholder">
                                    <p>Click "Generate Architecture" to create a NET Architecture.</p>
                                    <p class="architecture-tip">Tip: Different architecture types have different focuses. Military has the most dangerous ICE, while Corporate focuses on data protection.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="netrunning-tab-content" id="reference-tab" style="display: none;">
                        <h4>Common Netrunning Actions</h4>
                        <table class="netrunning-table">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>DV</th>
                                    <th>Effect</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Interface</td>
                                    <td>6</td>
                                    <td>Jack into NET Architecture</td>
                                </tr>
                                <tr>
                                    <td>Backdoor Entry</td>
                                    <td>8</td>
                                    <td>Enter without alerting system</td>
                                </tr>
                                <tr>
                                    <td>Pathfinder</td>
                                    <td>6</td>
                                    <td>Find way to next level</td>
                                </tr>
                                <tr>
                                    <td>Control</td>
                                    <td>8</td>
                                    <td>Take control of device/door</td>
                                </tr>
                                <tr>
                                    <td>Eye-Dee</td>
                                    <td>6</td>
                                    <td>Identify ICE or file</td>
                                </tr>
                                <tr>
                                    <td>Slide</td>
                                    <td>6</td>
                                    <td>Move between accessible floors</td>
                                </tr>
                                <tr>
                                    <td>Virus</td>
                                    <td>8</td>
                                    <td>Upload harmful code</td>
                                </tr>
                                <tr>
                                    <td>Zap</td>
                                    <td>Varies</td>
                                    <td>Attack programs/ICE</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <h4>NET Combat</h4>
                        <p>When attacking ICE, roll: 1d10 + Interface Skill + Program ATK vs. ICE's Defense Value (DV)</p>
                        <p>When ICE attacks you, roll: 1d10 + Interface Skill + Program DEF vs. ICE's ATK</p>
                        
                        <h4>Black ICE</h4>
                        <p>Black ICE can cause physical harm to Netrunners through their neural links. Failed saves against Black ICE can result in brain damage or even death.</p>
                        
                        <h4>Control Nodes</h4>
                        <p>Control Nodes allow access to real-world systems. Once successfully accessed, Netrunners can manipulate the associated systems (cameras, doors, etc).</p>
                    </div>
                    
                    <div class="netrunning-tab-content" id="programs-tab" style="display: none;">
                        <h4>Netrunner Programs</h4>
                        <table class="netrunning-table">
                            <thead>
                                <tr>
                                    <th>Program</th>
                                    <th>ATK</th>
                                    <th>DEF</th>
                                    <th>Effect</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Sword</td>
                                    <td>4</td>
                                    <td>0</td>
                                    <td>Basic attack program</td>
                                </tr>
                                <tr>
                                    <td>Worm</td>
                                    <td>2</td>
                                    <td>0</td>
                                    <td>Assists with tracing and tracking</td>
                                </tr>
                                <tr>
                                    <td>Armor</td>
                                    <td>0</td>
                                    <td>4</td>
                                    <td>Defense against ICE</td>
                                </tr>
                                <tr>
                                    <td>Flak</td>
                                    <td>2</td>
                                    <td>6</td>
                                    <td>Defense against Black ICE</td>
                                </tr>
                                <tr>
                                    <td>Banhammer</td>
                                    <td>6</td>
                                    <td>2</td>
                                    <td>Strong attack with knockback</td>
                                </tr>
                                <tr>
                                    <td>DeckKRASH</td>
                                    <td>8</td>
                                    <td>0</td>
                                    <td>Crashes another netrunner</td>
                                </tr>
                                <tr>
                                    <td>Eraser</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>Deletes files</td>
                                </tr>
                                <tr>
                                    <td>Vrizzbolt</td>
                                    <td>6</td>
                                    <td>0</td>
                                    <td>Powerful attack with stun</td>
                                </tr>
                                <tr>
                                    <td>Speedware</td>
                                    <td>0</td>
                                    <td>2</td>
                                    <td>+2 initiative in NET Actions</td>
                                </tr>
                                <tr>
                                    <td>See Ya</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>Emergency disconnect without trace</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <h4>Program Slots</h4>
                        <p>A Netrunner's cyberdeck has limited slots based on its quality:</p>
                        <ul>
                            <li>Poor Quality: 3 program slots</li>
                            <li>Standard Quality: 7 program slots</li>
                            <li>Excellent Quality: 10 program slots</li>
                        </ul>
                    </div>
                    
                    <div class="netrunning-tab-content" id="ice-tab" style="display: none;">
                        <h4>ICE Database</h4>
                        <p>ICE (Intrusion Countermeasure Electronics) protects NET Architectures from unauthorized access.</p>
                        
                        <div class="ice-category-header">Standard ICE</div>
                        <table class="netrunning-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>DV</th>
                                    <th>ATK/DEF</th>
                                    <th>Effect</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Wisp</td>
                                    <td>2</td>
                                    <td>3/3</td>
                                    <td>2d6 damage to Netrunner</td>
                                </tr>
                                <tr>
                                    <td>Asp</td>
                                    <td>4</td>
                                    <td>5/3</td>
                                    <td>3d6 damage to Netrunner</td>
                                </tr>
                                <tr>
                                    <td>Raven</td>
                                    <td>6</td>
                                    <td>4/4</td>
                                    <td>Reveals position to security</td>
                                </tr>
                                <tr>
                                    <td>Sabertooth</td>
                                    <td>6</td>
                                    <td>6/5</td>
                                    <td>4d6 damage, -2 to all actions</td>
                                </tr>
                                <tr>
                                    <td>Skunk</td>
                                    <td>4</td>
                                    <td>3/4</td>
                                    <td>Interface DVs +4 for 1d6 turns</td>
                                </tr>
                                <tr>
                                    <td>Scorpion</td>
                                    <td>6</td>
                                    <td>5/5</td>
                                    <td>3d6 damage, trace initiated</td>
                                </tr>
                                <tr>
                                    <td>Wizard's Book</td>
                                    <td>8</td>
                                    <td>6/7</td>
                                    <td>Disables 1d3 random programs</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div class="ice-category-header">Black ICE</div>
                        <table class="netrunning-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>DV</th>
                                    <th>ATK/DEF</th>
                                    <th>Effect</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Hellhound</td>
                                    <td>8</td>
                                    <td>7/6</td>
                                    <td>3d6 damage, connection crashed</td>
                                </tr>
                                <tr>
                                    <td>Liche</td>
                                    <td>10</td>
                                    <td>10/8</td>
                                    <td>5d6 damage, save vs. death</td>
                                </tr>
                                <tr>
                                    <td>Killer</td>
                                    <td>8</td>
                                    <td>8/5</td>
                                    <td>4d6 damage, DEF reduced by 4</td>
                                </tr>
                                <tr>
                                    <td>Kraken</td>
                                    <td>9</td>
                                    <td>9/7</td>
                                    <td>3d6 damage, pulls down 1d3 levels</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
        
        function createInitiativeTrackerContent() {
            return `
                <div class="initiative-tracker">
                    <div class="initiative-controls">
                        <button class="add-combatant-btn">Add Combatant</button>
                        <button class="next-turn-btn">Next Turn</button>
                        <button class="reset-combat-btn">Reset Combat</button>
                    </div>
                    <div class="combatants-list">
                        <div class="combatant-header">
                            <span class="combatant-initiative">Init</span>
                            <span class="combatant-name">Name</span>
                            <span class="combatant-health">HP</span>
                            <span class="combatant-actions">Actions</span>
                        </div>
                        <div class="combatants-container">
                            <!-- Combatants will be added here -->
                        </div>
                    </div>
                    <div class="add-combatant-form" style="display: none;">
                        <input type="text" placeholder="Name" class="combatant-name-input">
                        <input type="number" placeholder="Initiative" class="combatant-init-input">
                        <input type="number" placeholder="HP" class="combatant-hp-input">
                        <button class="save-combatant-btn">Add</button>
                        <button class="cancel-combatant-btn">Cancel</button>
                    </div>
                </div>
            `;
        }
        
        function createTimerContent() {
            return `
                <div class="game-timer">
                    <div class="timer-display">
                        <div class="timer-value">00:00:00</div>
                        <div class="timer-date">Day 1 - Morning</div>
                    </div>
                    <div class="timer-controls">
                        <button class="timer-btn start-btn">Start</button>
                        <button class="timer-btn pause-btn" disabled>Pause</button>
                        <button class="timer-btn reset-btn">Reset</button>
                    </div>
                    <div class="time-jump">
                        <button class="time-btn" data-minutes="15">+15m</button>
                        <button class="time-btn" data-minutes="60">+1h</button>
                        <button class="time-btn" data-minutes="240">+4h</button>
                        <button class="time-btn" data-minutes="720">+12h</button>
                        <button class="time-btn" data-minutes="1440">+1d</button>
                    </div>
                </div>
            `;
        }
        
        function createCalculatorContent() {
            return `
                <div class="calculator">
                    <div class="calculator-display">0</div>
                    <div class="calculator-keypad">
                        <button class="calc-btn calc-clear">C</button>
                        <button class="calc-btn calc-op">/</button>
                        <button class="calc-btn calc-op">*</button>
                        <button class="calc-btn calc-op">-</button>
                        
                        <button class="calc-btn calc-num">7</button>
                        <button class="calc-btn calc-num">8</button>
                        <button class="calc-btn calc-num">9</button>
                        <button class="calc-btn calc-op">+</button>
                        
                        <button class="calc-btn calc-num">4</button>
                        <button class="calc-btn calc-num">5</button>
                        <button class="calc-btn calc-num">6</button>
                        <button class="calc-btn calc-op">(</button>
                        
                        <button class="calc-btn calc-num">1</button>
                        <button class="calc-btn calc-num">2</button>
                        <button class="calc-btn calc-num">3</button>
                        <button class="calc-btn calc-op">)</button>
                        
                        <button class="calc-btn calc-num">0</button>
                        <button class="calc-btn calc-num">.</button>
                        <button class="calc-btn calc-equals">=</button>
                        <button class="calc-btn calc-backspace">←</button>
                    </div>
                    <div class="dice-shortcut">
                        <button class="dice-shortcut-btn" data-dice="2d6">2d6</button>
                        <button class="dice-shortcut-btn" data-dice="3d6">3d6</button>
                        <button class="dice-shortcut-btn" data-dice="1d10">1d10</button>
                    </div>
                </div>
            `;
        }
        
        function createMapContent() {
            return `
                <div class="night-city-map">
                    <div class="map-controls">
                        <select class="map-district">
                            <option value="city-center">City Center</option>
                            <option value="watson">Watson</option>
                            <option value="westbrook">Westbrook</option>
                            <option value="heywood">Heywood</option>
                            <option value="pacifica">Pacifica</option>
                            <option value="santo-domingo">Santo Domingo</option>
                            <option value="badlands">Badlands</option>
                        </select>
                        <div class="map-zoom">
                            <button class="zoom-in">+</button>
                            <button class="zoom-out">-</button>
                        </div>
                    </div>
                    <div class="map-container">
                        <div class="map-placeholder">
                            <p>Night City Map - Select a district</p>
                            <p class="map-note">City Center is the default district</p>
                            <div class="district-description">
                                <h4>City Center</h4>
                                <p>The heart of Night City, dominated by corporate towers and high-end shopping.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        function createLocationGeneratorContent() {
            return `
                <div class="location-generator">
                    <h3>Cyberpunk RED Location Generator</h3>
                    
                    <div class="location-tabs">
                        <button class="location-tab active" data-tab="generator">Generator</button>
                        <button class="location-tab" data-tab="saved">Saved Locations</button>
                        <button class="location-tab" data-tab="map">District Map</button>
                    </div>
                    
                    <div class="location-tab-content" id="generator-tab">
                        <div class="location-controls">
                            <div class="control-row">
                                <button class="generate-location-btn">Generate Location</button>
                                <button class="save-location-btn">Save Location</button>
                            </div>
                            <div class="control-row">
                                <select class="location-type">
                                    <option value="random" selected>Random Type</option>
                                    <option value="bar">Bar/Club</option>
                                    <option value="shop">Shop</option>
                                    <option value="corp">Corporate</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="warehouse">Warehouse</option>
                                    <option value="gang">Gang Territory</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="clinic">Clinic/Hospital</option>
                                    <option value="government">Government</option>
                                    <option value="tech">Tech/Workshop</option>
                                </select>
                                
                                <select class="location-district">
                                    <option value="random" selected>Random District</option>
                                    <option value="city-center">City Center</option>
                                    <option value="watson">Watson</option>
                                    <option value="westbrook">Westbrook</option>
                                    <option value="heywood">Heywood</option>
                                    <option value="pacifica">Pacifica</option>
                                    <option value="santo-domingo">Santo Domingo</option>
                                    <option value="rancho-coronado">Rancho Coronado</option>
                                    <option value="north-oak">North Oak</option>
                                    <option value="badlands">Badlands</option>
                                </select>
                            </div>
                            <div class="control-row">
                                <label>
                                    <input type="checkbox" class="include-npcs" checked>
                                    Include NPCs
                                </label>
                                <label>
                                    <input type="checkbox" class="include-hooks" checked>
                                    Include Story Hooks
                                </label>
                                <label>
                                    <input type="checkbox" class="include-threats">
                                    Include Threats
                                </label>
                            </div>
                        </div>
                        
                        <div class="location-result">
                            <div class="location-container">
                                <div class="location-placeholder">
                                    <p>Click "Generate Location" to create a random location for your game.</p>
                                    <p class="location-tip">Tip: Different districts have different types of locations and security levels.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="location-tab-content" id="saved-tab" style="display: none;">
                        <div class="saved-locations" style="margin-bottom: 15px;">
                            <h4>Saved Locations</h4>
                            <div class="location-list" style="max-height: 400px; overflow-y: auto;">
                                <!-- Saved locations will appear here -->
                                <div class="empty-saves-message">No saved locations yet.</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="location-tab-content" id="map-tab" style="display: none;">
                        <h4>Night City Districts</h4>
                        <div class="district-map">
                            <div class="district-map-container">
                                <div class="district-info">
                                    <p>Select a district on the map to view information about it.</p>
                                </div>
                                <div class="district-map-visual">
                                    <!-- Map visualization will be added here -->
                                    <div class="map-placeholder">
                                        <svg viewBox="0 0 600 500" class="night-city-map">
                                            <polygon class="district" data-district="city-center" points="280,200 320,200 350,250 320,300 280,300 250,250" />
                                            <polygon class="district" data-district="watson" points="350,250 400,200 450,250 400,300 350,300" />
                                            <polygon class="district" data-district="westbrook" points="320,300 350,300 400,350 350,400 300,400 250,350" />
                                            <polygon class="district" data-district="heywood" points="250,250 280,200 220,150 170,200 200,250" />
                                            <polygon class="district" data-district="pacifica" points="200,250 150,300 150,350 200,400 250,350" />
                                            <polygon class="district" data-district="santo-domingo" points="400,300 450,250 500,300 500,350 450,400 400,350" />
                                            <polygon class="district" data-district="rancho-coronado" points="200,400 150,350 150,450 200,450" />
                                            <polygon class="district" data-district="north-oak" points="450,150 400,200 450,250 500,200" />
                                            <polygon class="district" data-district="badlands" points="500,200 550,200 550,450 150,450 150,400 200,450 300,450 400,450 500,400 500,350" />
                                            <text x="300" y="250" class="district-label" data-district="city-center">City Center</text>
                                            <text x="400" y="250" class="district-label" data-district="watson">Watson</text>
                                            <text x="320" y="350" class="district-label" data-district="westbrook">Westbrook</text>
                                            <text x="220" y="200" class="district-label" data-district="heywood">Heywood</text>
                                            <text x="200" y="350" class="district-label" data-district="pacifica">Pacifica</text>
                                            <text x="450" y="350" class="district-label" data-district="santo-domingo">Santo Domingo</text>
                                            <text x="170" y="420" class="district-label" data-district="rancho-coronado">Rancho</text>
                                            <text x="470" y="200" class="district-label" data-district="north-oak">North Oak</text>
                                            <text x="350" y="430" class="district-label" data-district="badlands">Badlands</text>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="district-details">
                                <h4 class="district-name">Select a district</h4>
                                <div class="district-description"></div>
                                <div class="district-danger-level"></div>
                                <div class="district-common-locations"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        function createRandomEncounterContent() {
            return `
                <div class="random-encounter">
                    <div class="encounter-controls">
                        <button class="generate-encounter-btn">Generate Encounter</button>
                        <select class="encounter-type">
                            <option value="combat">Combat</option>
                            <option value="social">Social</option>
                            <option value="environmental">Environmental</option>
                            <option value="mystery">Mystery</option>
                        </select>
                        <select class="encounter-difficulty">
                            <option value="easy">Easy</option>
                            <option value="moderate">Moderate</option>
                            <option value="hard">Hard</option>
                            <option value="deadly">Deadly</option>
                        </select>
                    </div>
                    <div class="encounter-details">
                        <h3 class="encounter-title">---</h3>
                        <div class="encounter-type-display">Type: <span>---</span></div>
                        <div class="encounter-difficulty-display">Difficulty: <span>---</span></div>
                        <div class="encounter-description">Description: <span>---</span></div>
                        <div class="encounter-enemies">Enemies/NPCs: <span>---</span></div>
                        <div class="encounter-rewards">Rewards: <span>---</span></div>
                    </div>
                </div>
            `;
        }
        
        function createLootGeneratorContent() {
            return `
                <div class="loot-generator">
                    <h3>Cyberpunk RED Loot Generator</h3>
                    
                    <div class="loot-tabs">
                        <button class="loot-tab active" data-tab="generator">Generator</button>
                        <button class="loot-tab" data-tab="saved">Saved Loot</button>
                        <button class="loot-tab" data-tab="database">Item Database</button>
                    </div>
                    
                    <div class="loot-tab-content" id="generator-tab">
                        <div class="loot-controls">
                            <div class="control-row">
                                <button class="generate-loot-btn">Generate Loot</button>
                                <button class="save-loot-btn">Save Loot</button>
                            </div>
                            <div class="control-row">
                                <select class="loot-value">
                                    <option value="poor">Poor Value</option>
                                    <option value="standard" selected>Standard Value</option>
                                    <option value="high">High Value</option>
                                    <option value="premium">Premium Value</option>
                                    <option value="jackpot">Jackpot</option>
                                </select>
                                
                                <select class="loot-type">
                                    <option value="mixed" selected>Mixed Loot</option>
                                    <option value="weapons">Weapons</option>
                                    <option value="armor">Armor</option>
                                    <option value="cyberware">Cyberware</option>
                                    <option value="cash">Cash & Valuables</option>
                                    <option value="tech">Tech & Gadgets</option>
                                    <option value="drugs">Drugs & Consumables</option>
                                    <option value="clothing">Clothing & Fashion</option>
                                </select>
                            </div>
                            <div class="control-row">
                                <label>
                                    <input type="checkbox" class="include-rare-items" checked>
                                    Include Rare Items
                                </label>
                                <label>
                                    <input type="checkbox" class="include-container" checked>
                                    Include Container
                                </label>
                                <label>
                                    <input type="number" class="item-count" min="1" max="20" value="5" style="width: 50px;">
                                    Items
                                </label>
                            </div>
                        </div>
                        
                        <div class="loot-result">
                            <div class="loot-container">
                                <div class="loot-placeholder">
                                    <p>Click "Generate Loot" to create random loot for your game.</p>
                                    <p class="loot-tip">Tip: Different settings produce different types and qualities of loot.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="loot-tab-content" id="saved-tab" style="display: none;">
                        <div class="saved-loot" style="margin-bottom: 15px;">
                            <h4>Saved Loot Collections</h4>
                            <div class="loot-list" style="max-height: 400px; overflow-y: auto;">
                                <!-- Saved loot will appear here -->
                                <div class="empty-saves-message">No saved loot collections yet.</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="loot-tab-content" id="database-tab" style="display: none;">
                        <h4>Item Database</h4>
                        
                        <div class="database-filters control-row">
                            <select class="filter-category">
                                <option value="all" selected>All Categories</option>
                                <option value="weapons">Weapons</option>
                                <option value="armor">Armor</option>
                                <option value="cyberware">Cyberware</option>
                                <option value="valuables">Valuables</option>
                                <option value="tech">Tech</option>
                                <option value="drugs">Drugs & Consumables</option>
                                <option value="clothing">Clothing</option>
                            </select>
                            
                            <select class="filter-rarity">
                                <option value="all" selected>All Rarities</option>
                                <option value="common">Common</option>
                                <option value="uncommon">Uncommon</option>
                                <option value="rare">Rare</option>
                                <option value="exotic">Exotic</option>
                            </select>
                            
                            <button class="filter-button">Apply Filter</button>
                        </div>
                        
                        <div class="items-container" style="max-height: 400px; overflow-y: auto;">
                            <!-- Item database entries will be generated here -->
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Initialize functions for panel content
        function initializeDiceRoller(container) {
            const rollButton = container.querySelector('.roll-dice-btn');
            if (!rollButton) return;
            
            rollButton.addEventListener('click', function() {
                const count = parseInt(container.querySelector('#dice-count').value) || 1;
                const sides = parseInt(container.querySelector('#dice-sides').value) || 10;
                const modifier = parseInt(container.querySelector('#dice-modifier').value) || 0;
                
                // Roll the dice
                const rolls = [];
                let total = 0;
                
                for (let i = 0; i < count; i++) {
                    const roll = Math.floor(Math.random() * sides) + 1;
                    rolls.push(roll);
                    total += roll;
                }
                
                const finalTotal = total + modifier;
                const resultElement = container.querySelector('.dice-result');
                const historyElement = container.querySelector('.dice-history');
                
                // Format result
                let resultText = `Results [${rolls.join(', ')}]`;
                if (modifier !== 0) {
                    resultText += ` + ${modifier} (modifier)`;
                }
                resultText += ` = ${finalTotal}`;
                
                // Update display
                if (resultElement) {
                    resultElement.textContent = resultText;
                }
                
                // Add to history
                if (historyElement) {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.textContent = `${count}d${sides} ${modifier >= 0 ? '+' : ''}${modifier} = ${finalTotal}`;
                    historyElement.prepend(historyItem);
                    
                    // Limit history items
                    const historyItems = historyElement.querySelectorAll('.history-item');
                    if (historyItems.length > 5) {
                        historyElement.removeChild(historyItems[historyItems.length - 1]);
                    }
                }
            });
        }
        
        function initializeInitiativeTracker(container) {
            const addBtn = container.querySelector('.add-combatant-btn');
            const nextBtn = container.querySelector('.next-turn-btn');
            const resetBtn = container.querySelector('.reset-combat-btn');
            const addForm = container.querySelector('.add-combatant-form');
            const saveBtn = container.querySelector('.save-combatant-btn');
            const cancelBtn = container.querySelector('.cancel-combatant-btn');
            const combatantsContainer = container.querySelector('.combatants-container');
            
            if (!addBtn || !nextBtn || !resetBtn || !addForm || !saveBtn || !cancelBtn || !combatantsContainer) return;
            
            // Show the add combatant form
            addBtn.addEventListener('click', function() {
                addForm.style.display = 'block';
                container.querySelector('.combatant-name-input').focus();
            });
            
            // Cancel adding combatant
            cancelBtn.addEventListener('click', function() {
                addForm.style.display = 'none';
                clearFormInputs();
            });
            
            // Save new combatant
            saveBtn.addEventListener('click', function() {
                const name = container.querySelector('.combatant-name-input').value || 'Combatant';
                const init = parseInt(container.querySelector('.combatant-init-input').value) || 0;
                const hp = parseInt(container.querySelector('.combatant-hp-input').value) || 10;
                
                addCombatant(name, init, hp);
                addForm.style.display = 'none';
                clearFormInputs();
            });
            
            // Reset combat tracker
            resetBtn.addEventListener('click', function() {
                combatantsContainer.innerHTML = '';
            });
            
            // Advance to next turn
            nextBtn.addEventListener('click', function() {
                const combatants = combatantsContainer.querySelectorAll('.combatant');
                if (combatants.length === 0) return;
                
                // Find active combatant and set next one active
                let activeIndex = -1;
                for (let i = 0; i < combatants.length; i++) {
                    if (combatants[i].classList.contains('active')) {
                        activeIndex = i;
                        combatants[i].classList.remove('active');
                        break;
                    }
                }
                
                const nextIndex = (activeIndex + 1) % combatants.length;
                combatants[nextIndex].classList.add('active');
                combatants[nextIndex].scrollIntoView({behavior: 'smooth', block: 'nearest'});
            });
            
            // Helper functions
            function addCombatant(name, initiative, hp) {
                const combatant = document.createElement('div');
                combatant.className = 'combatant';
                combatant.innerHTML = `
                    <span class="combatant-initiative">${initiative}</span>
                    <span class="combatant-name">${name}</span>
                    <span class="combatant-health">${hp}</span>
                    <span class="combatant-actions">
                        <button class="combatant-damage">-</button>
                        <button class="combatant-heal">+</button>
                        <button class="combatant-remove">×</button>
                    </span>
                `;
                
                // Add event listeners for buttons
                combatant.querySelector('.combatant-damage').addEventListener('click', function() {
                    const healthSpan = combatant.querySelector('.combatant-health');
                    let health = parseInt(healthSpan.textContent) - 1;
                    healthSpan.textContent = Math.max(0, health);
                    
                    if (health <= 0) {
                        combatant.classList.add('defeated');
                    }
                });
                
                combatant.querySelector('.combatant-heal').addEventListener('click', function() {
                    const healthSpan = combatant.querySelector('.combatant-health');
                    let health = parseInt(healthSpan.textContent) + 1;
                    healthSpan.textContent = health;
                    
                    combatant.classList.remove('defeated');
                });
                
                combatant.querySelector('.combatant-remove').addEventListener('click', function() {
                    combatant.remove();
                });
                
                // Add to the container and sort by initiative
                combatantsContainer.appendChild(combatant);
                sortCombatantsByInitiative();
                
                // If this is the first combatant, make it active
                if (combatantsContainer.querySelectorAll('.combatant').length === 1) {
                    combatant.classList.add('active');
                }
            }
            
            function clearFormInputs() {
                container.querySelector('.combatant-name-input').value = '';
                container.querySelector('.combatant-init-input').value = '';
                container.querySelector('.combatant-hp-input').value = '';
            }
            
            function sortCombatantsByInitiative() {
                const combatants = Array.from(combatantsContainer.querySelectorAll('.combatant'));
                combatants.sort((a, b) => {
                    const aInit = parseInt(a.querySelector('.combatant-initiative').textContent);
                    const bInit = parseInt(b.querySelector('.combatant-initiative').textContent);
                    return bInit - aInit; // Higher initiative first
                });
                
                // Re-append in sorted order
                combatants.forEach(combatant => {
                    combatantsContainer.appendChild(combatant);
                });
            }
        }
        
        function initializeRandomEncounter(container) {
            // Get UI elements
            const generateBtn = container.querySelector('.generate-encounter-btn');
            const encounterTypeSelect = container.querySelector('.encounter-type');
            const encounterDifficultySelect = container.querySelector('.encounter-difficulty');
            const encounterTitle = container.querySelector('.encounter-title');
            const encounterTypeDisplay = container.querySelector('.encounter-type-display span');
            const encounterDifficultyDisplay = container.querySelector('.encounter-difficulty-display span');
            const encounterDescription = container.querySelector('.encounter-description span');
            const encounterEnemies = container.querySelector('.encounter-enemies span');
            const encounterRewards = container.querySelector('.encounter-rewards span');
            
            // Random encounter data
            const encounterData = {
                combat: {
                    easy: [
                        {
                            title: "Street Gang Ambush",
                            description: "A small group of inexperienced gang members looking for easy cred try to ambush the party in an alley.",
                            enemies: "2-3 gang members with basic weapons (pistols, knives)",
                            rewards: "100-200eb, basic weapons, street cred with locals if spared"
                        },
                        {
                            title: "Corporate Security Patrol",
                            description: "A routine corporate security patrol spots the party in a restricted area.",
                            enemies: "2 corporate security officers with tasers and pistols",
                            rewards: "Security passes, 50-100eb, basic corporate gear"
                        },
                        {
                            title: "Scavenger Attack",
                            description: "A pair of desperate scavengers looking for cyberware to strip.",
                            enemies: "2 scavengers with improvised weapons and a crude cyberware removal tool",
                            rewards: "Used cyberware parts, 50-150eb in scrap"
                        }
                    ],
                    moderate: [
                        {
                            title: "Rival Fixers' Showdown",
                            description: "The party stumbles into a tense standoff between two fixers and their bodyguards over a deal gone wrong.",
                            enemies: "2 fixers with 3-4 hired solos packing mid-tier weapons",
                            rewards: "400-600eb, mid-tier weapons, valuable data shard with blackmail material"
                        },
                        {
                            title: "Cyberpsycho Incident",
                            description: "A person with excessive cyberware has gone over the edge and is attacking anyone nearby.",
                            enemies: "1 cyberpsycho with military-grade cyberware and automatic weapons",
                            rewards: "500-700eb bounty, valuable cyberware components if recovered carefully"
                        },
                        {
                            title: "Gang Territory Defense",
                            description: "A well-organized gang defending their turf from perceived intruders.",
                            enemies: "5-6 gang members with varied weapons and a lieutenant with cyberware",
                            rewards: "350-550eb, weapon upgrades, potential territory access if negotiated"
                        }
                    ],
                    hard: [
                        {
                            title: "Corporate Extraction Gone Wrong",
                            description: "A high-value corporate extraction has spiraled into chaos, and the extraction team mistakes the party for opposing security.",
                            enemies: "4-5 professional mercs with high-end weapons and cyberware, led by a veteran solo",
                            rewards: "800-1200eb, high-end weapons, corporate data worth thousands to the right buyer"
                        },
                        {
                            title: "Trauma Team Skirmish",
                            description: "The party is caught in the crossfire as Trauma Team arrives to extract a client being attacked by heavily armed assailants.",
                            enemies: "3-4 Trauma Team medics with military weapons and 3-4 attackers with heavy weapons",
                            rewards: "900-1300eb in military gear, high-end medical supplies, potential Trauma Team contract"
                        },
                        {
                            title: "Militech Test Subjects",
                            description: "Escaped Militech test subjects with experimental combat cyberware are being hunted through the area.",
                            enemies: "3 augmented test subjects with unpredictable experimental cyberware and enhanced strength",
                            rewards: "1000-1500eb, experimental cyberware samples, Militech research data"
                        }
                    ],
                    deadly: [
                        {
                            title: "Corporate Black Op",
                            description: "The party has stumbled into a high-stakes corporate black operation with elite operatives ordered to leave no witnesses.",
                            enemies: "6-8 black ops agents with cutting-edge weapons and cyberware, military-grade netrunner support",
                            rewards: "2000-3000eb in gear, classified corporate data worth tens of thousands, high-end cyberware"
                        },
                        {
                            title: "MaxTac Raid",
                            description: "A MaxTac team is conducting a raid on cyberpsychos in the area and the party is caught in the middle.",
                            enemies: "4-5 MaxTac officers with military-grade equipment and authorization to use lethal force",
                            rewards: "1500-2500eb in military equipment, cutting-edge technology, NCPD clearance data"
                        },
                        {
                            title: "Rogue AI Controlled Combat Drones",
                            description: "A rogue AI has taken control of a shipment of military drones and is targeting all humans in the area.",
                            enemies: "6-8 armed combat drones controlled by a sophisticated AI system",
                            rewards: "2500-3500eb, military drone parts, the AI's core (worth tens of thousands to the right buyer)"
                        }
                    ]
                },
                social: {
                    easy: [
                        {
                            title: "Local Fixer Job Offer",
                            description: "A minor local fixer approaches the party with a simple job offer.",
                            enemies: "None immediate, but the job may have competitors",
                            rewards: "Job opportunity worth 200-400eb, local connections"
                        },
                        {
                            title: "Street Vendor Dispute",
                            description: "A local street vendor is being harassed by thugs demanding protection money.",
                            enemies: "2-3 low-level thugs if the situation escalates",
                            rewards: "Free supplies from the vendor, local street cred, 50-100eb if paid"
                        },
                        {
                            title: "Drunk Corporate",
                            description: "A drunk corporate is making a scene and risks exposing sensitive company information.",
                            enemies: "None immediate, but corporate security may arrive",
                            rewards: "Corporate contact, 100-300eb for assistance, potential blackmail material"
                        }
                    ],
                    moderate: [
                        {
                            title: "Club VIP Access",
                            description: "A popular club promoter offers VIP access in exchange for a favor involving discreet delivery of a package.",
                            enemies: "Potential rival delivery team, suspicious security",
                            rewards: "VIP access to exclusive club, 300-500eb, connection with high-profile fixer"
                        },
                        {
                            title: "Corporate Information Exchange",
                            description: "A mid-level corporate wants to discreetly exchange information with a rival company representative.",
                            enemies: "Corporate security from both companies if discovered",
                            rewards: "500-700eb, corporate contact, valuable market information"
                        },
                        {
                            title: "Netrunner's Request",
                            description: "A skilled netrunner offers valuable information in exchange for physical protection during a risky job.",
                            enemies: "2-3 rivals or corp security if things go wrong",
                            rewards: "400-600eb, netrunner contact, exclusive access to hidden NET architecture"
                        }
                    ],
                    hard: [
                        {
                            title: "High-Stakes Negotiation",
                            description: "The party is asked to mediate a tense negotiation between two powerful fixers with conflicting interests.",
                            enemies: "Both fixers' security teams if negotiations fail",
                            rewards: "800-1200eb, powerful fixer contacts, exclusive territory access"
                        },
                        {
                            title: "Corporate Defector",
                            description: "A high-ranking corporate employee wants to defect to a rival company and needs discreet assistance.",
                            enemies: "Corporate security team hunting the defector",
                            rewards: "1000-1500eb, high-level corporate contact, classified corporate data"
                        },
                        {
                            title: "Underground Fighting Ring",
                            description: "An exclusive underground fighting ring is looking for new talent or sponsors with deep pockets.",
                            enemies: "Professional fighters if challenges are accepted",
                            rewards: "Betting opportunities, underworld contacts, potential sponsorship deals worth 900-1400eb"
                        }
                    ],
                    deadly: [
                        {
                            title: "Corporate Board Infiltration",
                            description: "An opportunity to infiltrate a high-security corporate gala where board members will be present.",
                            enemies: "Elite corporate security, counter-intelligence agents",
                            rewards: "2000-3000eb, high-level corporate contacts, insider trading information worth tens of thousands"
                        },
                        {
                            title: "Night City Elite Gathering",
                            description: "A chance to attend a gathering of Night City's most influential people, requiring extreme social finesse.",
                            enemies: "Private security details, social rivals, potential assassins",
                            rewards: "Elite contacts, high-society access, potential sponsorship worth 2500-3500eb"
                        },
                        {
                            title: "International Arms Deal",
                            description: "A major arms dealer needs trustworthy representatives for a deal with international implications.",
                            enemies: "Rival arms dealers, undercover agents, potential double-crossers",
                            rewards: "1500-2500eb commission, international contacts, exclusive weapons access"
                        }
                    ]
                },
                environmental: {
                    easy: [
                        {
                            title: "Power Grid Failure",
                            description: "A local power grid fails, plunging several blocks into darkness and disabling security systems.",
                            enemies: "Opportunistic looters, malfunctioning security systems",
                            rewards: "Salvage opportunities worth 100-200eb, access to normally secure areas"
                        },
                        {
                            title: "Toxic Chemical Leak",
                            description: "A street-level chemical leak from old industrial equipment threatens the local area.",
                            enemies: "Toxic environment requiring breathing gear",
                            rewards: "200-300eb for cleanup or reporting, valuable chemical compounds"
                        },
                        {
                            title: "Automated System Malfunction",
                            description: "Building systems malfunction, trapping people inside apartments or elevators.",
                            enemies: "Malfunctioning drones and security systems",
                            rewards: "150-250eb from grateful residents, access to building systems"
                        }
                    ],
                    moderate: [
                        {
                            title: "Urban Flash Flood",
                            description: "Damaged water systems cause sudden flooding in lower city levels, threatening lives and valuable goods.",
                            enemies: "Hazardous electrical systems, opportunistic gangs",
                            rewards: "400-600eb in salvage, rescue bonuses, water utility system access"
                        },
                        {
                            title: "Corporate Zone Lockdown",
                            description: "A corporate zone goes into unexpected lockdown with civilians and the party trapped inside.",
                            enemies: "Automated security systems, panicking security officers",
                            rewards: "500-700eb in corporate equipment, access cards, stranded corporate executives willing to pay for help"
                        },
                        {
                            title: "Gang War Crossfire",
                            description: "A violent gang war erupts, turning several blocks into a dangerous warzone.",
                            enemies: "Stray bullets, gang members from multiple factions",
                            rewards: "450-650eb in abandoned weapons, territory access, gang contacts"
                        }
                    ],
                    hard: [
                        {
                            title: "Industrial Complex Collapse",
                            description: "An abandoned industrial complex begins to collapse while the party is inside searching for valuable salvage.",
                            enemies: "Structural hazards, trapped defense systems, rival scavengers",
                            rewards: "800-1200eb in industrial salvage, rare materials, forgotten corporate secrets"
                        },
                        {
                            title: "Radiation Zone Expedition",
                            description: "A normally inaccessible radiation zone briefly becomes traversable, offering access to valuable forgotten technology.",
                            enemies: "Radiation hazards, mutated wildlife, autonomous security",
                            rewards: "1000-1500eb in rare technology, radiation zone maps, unique crafting materials"
                        },
                        {
                            title: "Cyber-Virus Outbreak",
                            description: "A dangerous cyber-virus is affecting local networks and cyberware, causing malfunctions and risks to augmented individuals.",
                            enemies: "Malfunctioning cyberware, infected individuals, glitched security systems",
                            rewards: "900-1300eb for samples, antivirus prototype worth thousands, affected cyberware components"
                        }
                    ],
                    deadly: [
                        {
                            title: "Corporate Arcology Breach",
                            description: "A catastrophic breach in a self-contained corporate arcology releases hazardous materials and security protocols.",
                            enemies: "Elite security systems, hazardous environments, desperate survivors",
                            rewards: "2000-3000eb in corporate technology, classified research, rescue bounties"
                        },
                        {
                            title: "Orbital Debris Impact",
                            description: "Debris from a damaged orbital platform crashes into Night City, creating a dangerous but valuable salvage zone.",
                            enemies: "Military security cordon, competing corporate recovery teams, hazardous materials",
                            rewards: "1500-2500eb in orbital technology, space-grade materials worth tens of thousands"
                        },
                        {
                            title: "AI Control System Takeover",
                            description: "A rogue AI takes control of an entire district's infrastructure, manipulating environment systems to deadly effect.",
                            enemies: "Controlled security systems, environmental hazards, trapped civilians",
                            rewards: "2500-3500eb bounty, AI core worth tens of thousands, infrastructure override codes"
                        }
                    ]
                },
                mystery: {
                    easy: [
                        {
                            title: "Missing Person",
                            description: "A local resident has gone missing, and their friends are offering a modest reward for information.",
                            enemies: "Potential kidnapper, local gang involvement",
                            rewards: "200-300eb finder's fee, local contact, minor favor"
                        },
                        {
                            title: "Strange Data Signals",
                            description: "Unusual data signals are being detected in a normally quiet area, suggesting hidden activity.",
                            enemies: "Automated security, suspicious netrunner",
                            rewards: "150-250eb worth of abandoned tech, valuable data worth hundreds"
                        },
                        {
                            title: "Suspicious Deliveries",
                            description: "A local business is receiving suspicious packages at odd hours, raising concerns among neighbors.",
                            enemies: "Business security, potential smugglers",
                            rewards: "100-200eb in contraband items, blackmail material, local business contact"
                        }
                    ],
                    moderate: [
                        {
                            title: "Corporate Whistleblower",
                            description: "Anonymous messages point to a corporate whistleblower hiding with important evidence.",
                            enemies: "Corporate agents searching for the whistleblower, hired mercenaries",
                            rewards: "500-700eb, corporate secrets worth thousands, media contact"
                        },
                        {
                            title: "Blackmail Scheme",
                            description: "Multiple high-profile individuals are being blackmailed by an unknown party using compromising information.",
                            enemies: "Blackmailer's agents, desperate victims taking extreme measures",
                            rewards: "400-600eb from victims, blackmail material, grateful high-profile contacts"
                        },
                        {
                            title: "Cyberware Theft Ring",
                            description: "A rash of precision cyberware thefts suggests an organized operation with medical expertise.",
                            enemies: "Professional thieves, black market ripperdocs",
                            rewards: "450-650eb in recovered cyberware, clinic location, black market contacts"
                        }
                    ],
                    hard: [
                        {
                            title: "Serial Cyberpsycho",
                            description: "A pattern of unusual cyberpsycho incidents suggests an orchestrated cause rather than random breakdowns.",
                            enemies: "Cyberpsychos, the mastermind's agents, suspicious MaxTac officers",
                            rewards: "800-1200eb bounty, evidence worth thousands to the right parties, experimental cyberware"
                        },
                        {
                            title: "Corporate Espionage",
                            description: "Evidence of high-level corporate espionage surfaces, with multiple corporations involved in a deadly game of secrets.",
                            enemies: "Corporate security from multiple companies, professional spies",
                            rewards: "1000-1500eb, corporate secrets worth tens of thousands, high-level corporate contact"
                        },
                        {
                            title: "NET Architecture Anomaly",
                            description: "Strange anomalies in local NET architecture suggest the presence of something unprecedented hiding in the digital realm.",
                            enemies: "Unknown digital entities, protective netrunners, corporate security",
                            rewards: "900-1300eb, unique netrunning techniques, access to hidden areas of the NET"
                        }
                    ],
                    deadly: [
                        {
                            title: "Conspiracy Against Night City",
                            description: "Evidence surfaces of a vast conspiracy involving multiple corporations and government entities planning something catastrophic for Night City.",
                            enemies: "Elite agents from multiple organizations, widespread surveillance, high-level fixers",
                            rewards: "2000-3000eb, evidence worth hundreds of thousands to the right buyers, contacts at the highest levels"
                        },
                        {
                            title: "Rogue AI Evolution",
                            description: "Signs point to a rogue AI that has evolved beyond expected parameters and is executing a complex plan involving human agents.",
                            enemies: "AI-controlled systems, human agents unaware they're being manipulated",
                            rewards: "2500-3500eb, AI technology worth tens of thousands, unique netrunning capabilities"
                        },
                        {
                            title: "Corporate Coup",
                            description: "Intelligence suggests an imminent hostile takeover of a major corporation through both legal and violent means.",
                            enemies: "Corporate military forces, assassins, legal teams with deadly authority",
                            rewards: "1500-2500eb, stock manipulation opportunities worth hundreds of thousands, corporate leadership contacts"
                        }
                    ]
                }
            };
            
            // Add event listeners
            if (generateBtn) {
                generateBtn.addEventListener('click', generateEncounter);
            }
            
            // Generate random encounter
            function generateEncounter() {
                // Get selected values
                const type = encounterTypeSelect.value;
                const difficulty = encounterDifficultySelect.value;
                
                // Get potential encounters based on type and difficulty
                const potentialEncounters = encounterData[type][difficulty];
                
                // Select a random encounter
                const encounter = potentialEncounters[Math.floor(Math.random() * potentialEncounters.length)];
                
                // Update the display
                encounterTitle.textContent = encounter.title;
                encounterTypeDisplay.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                encounterDifficultyDisplay.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
                encounterDescription.textContent = encounter.description;
                encounterEnemies.textContent = encounter.enemies;
                encounterRewards.textContent = encounter.rewards;
                
                // Add animation effects for visual feedback
                const detailsElement = container.querySelector('.encounter-details');
                if (detailsElement) {
                    detailsElement.classList.add('generated');
                    setTimeout(() => {
                        detailsElement.classList.remove('generated');
                    }, 1000);
                }
            }
            
            // Initialize with a default encounter
            generateEncounter();
        }
        
        function initializeLocationGenerator(container) {
            // Get UI elements
            const generateBtn = container.querySelector('.generate-location-btn');
            const saveBtn = container.querySelector('.save-location-btn');
            const locationTypeSelect = container.querySelector('.location-type');
            const districtSelect = container.querySelector('.location-district');
            const includeNPCsCheckbox = container.querySelector('.include-npcs');
            const includeHooksCheckbox = container.querySelector('.include-hooks');
            const includeThreatsCheckbox = container.querySelector('.include-threats');
            const locationContainer = container.querySelector('.location-container');
            const tabButtons = container.querySelectorAll('.location-tab');
            const tabContents = container.querySelectorAll('.location-tab-content');
            const savedLocationsList = container.querySelector('.location-list');
            const districtMap = container.querySelector('.night-city-map');
            
            // Define data for location generation
            const locationNames = {
                bar: ['Chrome', 'Neon', 'Afterlife', 'Silver', 'Lizzie\'s', 'Riot', 'Totentanz', 'Decker\'s', 'Jig-Jig', 'Kabuki', 'Nova', 'Byte', 'Glitch'],
                shop: ['Tech', 'Junk', 'Parts', 'Gear', 'Ripper', 'Warez', 'Bits', 'Cyber', 'Street', 'Night', 'City', 'Market'],
                corp: ['Arasaka', 'Militech', 'Biotechnica', 'Petrochem', 'Kang Tao', 'Trauma Team', 'Zetatech', 'Orbital Air', 'West Wind', 'Kiroshi'],
                apartment: ['Heights', 'Tower', 'Complex', 'Block', 'Megabuilding', 'Flats', 'Suites', 'Residence', 'Den', 'Haven'],
                warehouse: ['Storage', 'Freight', 'Shipping', 'Cargo', 'Container', 'Harbor', 'Dock', 'Industrial', 'Supply', 'Depot'],
                gang: ['Maelstrom', 'Tyger Claws', 'Valentinos', 'Animals', 'Voodoo Boys', '6th Street', 'Scavengers', 'Moxes', 'Wraiths', 'Raffen Shiv'],
                restaurant: ['Noodle', 'Street Food', 'Burrito', 'All-Night', 'Syn-Steak', 'Diner', 'Sushi', 'Fast Fry', 'Grill', 'Chow'],
                clinic: ['Care', 'Med-Center', 'Trauma', 'Street Doc', 'Emergency', 'Surgery', 'Treatment', 'Pharmacy', 'Meds', 'Implants'],
                government: ['City Hall', 'NCPD', 'Bureau', 'Department', 'Agency', 'Office', 'Division', 'Authority', 'Municipal', 'Center'],
                tech: ['Workshop', 'Netrunner', 'Lab', 'Repair', 'Custom', 'Tech', 'Mod Shop', 'Engineer', 'Development', 'Systems']
            };
            
            const locationAdjectives = ['Neon', 'Chrome', 'Digital', 'Night', 'Cyber', 'Glitch', 'Static', 'Viral', 'Toxic', 'Electric', 
                                      'Punk', 'Steel', 'Glass', 'Noir', 'Grim', 'Shady', 'Underground', 'Hidden', 'Exclusive', 'Famous'];
            
            const locationDescriptions = {
                bar: [
                    'A smoky dive bar with neon signs and loud synthetic music pounding from speakers.',
                    'An exclusive nightclub with private booths and high-end synthetic alcohol.',
                    'A rooftop bar with a view of the Night City skyline, catering to corporate executives.',
                    'A crowded underground club with a reputation for illicit braindances and black market deals.',
                    'A trendy bar featuring live performances from up-and-coming rockerboys and chrome dancers.'
                ],
                shop: [
                    'A cramped tech shop with parts and gadgets piled high on makeshift shelves.',
                    'A sleek boutique displaying the latest fashion trends and designer clothing.',
                    'A weapons dealer operating out of a reinforced storefront with various guns on display.',
                    'A black market cybernetics shop hidden behind a legitimate business front.',
                    'A crowded market stall selling scavenged tech parts and refurbished gear.'
                ],
                corp: [
                    'A towering corporate headquarters with extensive security and restricted access.',
                    'A research facility with unmarked vans coming and going at odd hours.',
                    'A corporate-owned apartment complex housing employees and their families.',
                    'A sleek office building with mirrored windows and armed security guards.',
                    'A subsidiary office handling specialized operations for a larger corporation.'
                ],
                apartment: [
                    'A run-down megabuilding with tiny apartments stacked like shipping containers.',
                    'A mid-tier residential tower with basic amenities and questionable maintenance.',
                    'A luxury apartment complex with private security and exclusive access.',
                    'A retrofitted industrial space converted into communal living quarters.',
                    'A secure compound housing corporate employees away from the general population.'
                ],
                warehouse: [
                    'An abandoned warehouse repurposed by gangs or squatters.',
                    'A corporate storage facility with automated security systems.',
                    'A shipping depot with constant traffic of delivery vehicles.',
                    'A black market exchange disguised as a legitimate storage business.',
                    'A former factory now used for illegal activities or underground events.'
                ],
                gang: [
                    'A heavily fortified gang hideout with lookouts and booby traps.',
                    'A seemingly normal building marked with subtle gang signs and symbols.',
                    'A combat zone block claimed by a specific gang, marked with graffiti and warnings.',
                    'A chop shop operating as a front for gang activities and illegal tech.',
                    'A converted nightclub serving as both a business and gang headquarters.'
                ],
                restaurant: [
                    'A street food vendor with plastic chairs and incredible local cuisine.',
                    'A 24/7 diner popular with night shift workers and insomniacs.',
                    'A high-end restaurant catering exclusively to corporate clients.',
                    'A food court featuring multiple synthetic and real food options.',
                    'A hidden gem known only to locals serving authentic pre-war recipes.'
                ],
                clinic: [
                    'A back-alley ripperdoc clinic with questionable hygiene but skilled hands.',
                    'A corporate medical facility with cutting-edge technology and high prices.',
                    'A community clinic providing basic care to locals with limited resources.',
                    'A black market medical facility dealing in experimental or illegal procedures.',
                    'A trauma center handling emergencies with quick, if impersonal, care.'
                ],
                government: [
                    'A bureaucratic nightmare of an office processing permits and licenses.',
                    'A heavily guarded NCPD precinct with holding cells and interrogation rooms.',
                    'A municipal utility management center maintaining the city\'s crumbling infrastructure.',
                    'A propaganda broadcasting center disguised as a public service building.',
                    'A surveillance hub monitoring the city\'s camera and sensor network.'
                ],
                tech: [
                    'A netrunner den filled with custom rigs and black market ICE breakers.',
                    'A workshop specializing in custom weapon modifications and upgrades.',
                    'A tech repair shop fixing everything from personal devices to combat drones.',
                    'A research lab developing cutting-edge technology outside corporate oversight.',
                    'A custom cybernetics studio known for unique and artistic implant designs.'
                ]
            };
            
            const districtInfo = {
                'city-center': {
                    name: 'City Center',
                    description: 'The corporate heart of Night City, dominated by massive skyscrapers and corporate headquarters. The streets are clean, security is tight, and everything costs a premium.',
                    danger: 'medium',
                    security: 'high',
                    commonLocations: ['corp', 'restaurant', 'bar', 'government']
                },
                'watson': {
                    name: 'Watson',
                    description: 'A district in transition with both corporate development and gang activity. Home to the Arasaka Waterfront and Kabuki marketplace.',
                    danger: 'medium',
                    security: 'medium',
                    commonLocations: ['shop', 'apartment', 'bar', 'gang']
                },
                'westbrook': {
                    name: 'Westbrook',
                    description: 'An affluent area containing the Japantown and Charter Hill neighborhoods. Known for high-end shopping, entertainment, and corporate residential zones.',
                    danger: 'low',
                    security: 'high',
                    commonLocations: ['bar', 'restaurant', 'shop', 'apartment']
                },
                'heywood': {
                    name: 'Heywood',
                    description: 'A diverse district with areas ranging from corporate residential zones to gang territories. Home to the Valentinos gang.',
                    danger: 'medium',
                    security: 'medium',
                    commonLocations: ['apartment', 'gang', 'restaurant', 'shop']
                },
                'pacifica': {
                    name: 'Pacifica',
                    description: 'An abandoned resort area now ruled by gangs, particularly the Voodoo Boys. Highly dangerous with minimal city services or security.',
                    danger: 'extreme',
                    security: 'minimal',
                    commonLocations: ['gang', 'apartment', 'warehouse', 'tech']
                },
                'santo-domingo': {
                    name: 'Santo Domingo',
                    description: 'An industrial zone filled with factories, power plants, and worker housing. Strongly divided between corporate control and street influence.',
                    danger: 'high',
                    security: 'medium',
                    commonLocations: ['warehouse', 'tech', 'apartment', 'corp']
                },
                'rancho-coronado': {
                    name: 'Rancho Coronado',
                    description: 'A suburban area with planned communities for corporate workers and middle management. More orderly than most of Night City.',
                    danger: 'low',
                    security: 'medium',
                    commonLocations: ['apartment', 'shop', 'restaurant', 'clinic']
                },
                'north-oak': {
                    name: 'North Oak',
                    description: 'An exclusive district for the ultra-wealthy, featuring massive compounds and private security. Very difficult to access without proper credentials.',
                    danger: 'low',
                    security: 'extreme',
                    commonLocations: ['corp', 'apartment', 'restaurant', 'clinic']
                },
                'badlands': {
                    name: 'Badlands',
                    description: 'The harsh desert surrounding Night City. Home to nomad groups, isolated settlements, and abandoned facilities.',
                    danger: 'high',
                    security: 'minimal',
                    commonLocations: ['gang', 'warehouse', 'tech', 'clinic']
                }
            };
            
            const npcRoles = ['Fixer', 'Solo', 'Netrunner', 'Tech', 'Media', 'Exec', 'Nomad', 'Rockerboy', 'Cop', 'Ripper Doc', 'Bartender', 'Dealer', 'Gangster', 'Street Vendor', 'Hacker', 'Bodyguard', 'Mercenary', 'Scavenger', 'Joytoy', 'Doll'];
            
            const npcAdjectives = ['Suspicious', 'Friendly', 'Dangerous', 'Connected', 'Skilled', 'Desperate', 'Cunning', 'Eccentric', 'Mysterious', 'Paranoid', 'Ruthless', 'Ambitious', 'Loyal', 'Untrustworthy', 'Famous', 'Scarred', 'Chromed-up', 'Junkie', 'Wealthy', 'Spiritual'];
            
            const storyHooks = [
                'A mysterious data shard with encrypted coordinates.',
                'A bounty on a high-value target frequenting this location.',
                'Rumors of illegal braindance recordings being sold here.',
                'A missing person was last seen entering this building.',
                'A valuable prototype is supposedly hidden somewhere inside.',
                'A rival gang is planning to attack this location soon.',
                'Corporate agents are monitoring this place for unknown reasons.',
                'Someone here is selling black market military-grade cyberware.',
                'A famous fixer uses this spot to meet potential clients.',
                'This location sits on top of a forgotten underground access point.',
                'A netrunner recently discovered an exploitable vulnerability in the security system.',
                'A corrupt NCPD officer is running an extortion racket from here.',
                'The owner is in debt to the wrong people and looking for help.',
                'Someone witnessed a high-profile assassination from this location.',
                'This place is actually a front for a more secretive operation.'
            ];
            
            const threatTypes = [
                'Gang members looking for trouble',
                'Corporate security conducting a raid',
                'Cyberpsycho on a rampage nearby',
                'Rival business owners with armed guards',
                'Undercover NCPD sting operation',
                'Black market deal gone wrong',
                'Rogue AI controlling local systems',
                'Escaped lab experiment hiding inside',
                'Scavengers looking for fresh cyberware',
                'Netrunner deploying hostile programs',
                'Malfunctioning security robots',
                'Vengeful ex-employee with a grudge',
                'Data courier being chased by hitmen',
                'Street prophet with fanatical followers',
                'Trauma Team conducting a high-risk extraction'
            ];
            
            // Initialize saved locations array
            let savedLocations = loadSavedLocations();
            
            // Initialize active location data
            let activeLocation = null;
            
            // Add event listeners
            if (generateBtn) {
                generateBtn.addEventListener('click', generateLocation);
            }
            
            if (saveBtn) {
                saveBtn.addEventListener('click', saveCurrentLocation);
            }
            
            // Tab switching
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const tab = this.getAttribute('data-tab');
                    
                    // Update active tab button
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show selected tab content
                    tabContents.forEach(content => {
                        if (content.id === `${tab}-tab`) {
                            content.style.display = 'block';
                        } else {
                            content.style.display = 'none';
                        }
                    });
                    
                    // If switching to saved tab, refresh the saved locations list
                    if (tab === 'saved') {
                        displaySavedLocations();
                    }
                    
                    // If switching to map tab, initialize the district map
                    if (tab === 'map') {
                        initializeDistrictMap();
                    }
                });
            });
            
            // District map initialization
            function initializeDistrictMap() {
                const districts = container.querySelectorAll('.district');
                const districtLabels = container.querySelectorAll('.district-label');
                const districtName = container.querySelector('.district-name');
                const districtDescription = container.querySelector('.district-description');
                const districtDanger = container.querySelector('.district-danger-level');
                const districtLocations = container.querySelector('.district-common-locations');
                
                // Add click event to districts
                districts.forEach(district => {
                    district.addEventListener('click', function() {
                        const districtId = this.getAttribute('data-district');
                        
                        // Update active district
                        districts.forEach(d => d.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Display district info
                        if (districtInfo[districtId]) {
                            const info = districtInfo[districtId];
                            
                            districtName.textContent = info.name;
                            districtDescription.innerHTML = `<p>${info.description}</p>`;
                            
                            // Display danger level
                            let dangerText = '';
                            let dangerClass = '';
                            
                            switch (info.danger) {
                                case 'low':
                                    dangerText = 'Low Danger';
                                    dangerClass = 'danger-low';
                                    break;
                                case 'medium':
                                    dangerText = 'Medium Danger';
                                    dangerClass = 'danger-medium';
                                    break;
                                case 'high':
                                    dangerText = 'High Danger';
                                    dangerClass = 'danger-high';
                                    break;
                                case 'extreme':
                                    dangerText = 'Extreme Danger';
                                    dangerClass = 'danger-extreme';
                                    break;
                            }
                            
                            districtDanger.innerHTML = `<p>Danger Level: <span class="danger-level ${dangerClass}">${dangerText}</span></p>`;
                            
                            // Display common locations
                            let locationsHtml = '<p>Common Location Types:</p><ul>';
                            info.commonLocations.forEach(locType => {
                                const typeNames = {
                                    'bar': 'Bars & Clubs',
                                    'shop': 'Shops & Markets',
                                    'corp': 'Corporate Buildings',
                                    'apartment': 'Residential Buildings',
                                    'warehouse': 'Warehouses & Industrial',
                                    'gang': 'Gang Territories',
                                    'restaurant': 'Restaurants & Food',
                                    'clinic': 'Medical Facilities',
                                    'government': 'Government Buildings',
                                    'tech': 'Tech & Workshops'
                                };
                                
                                locationsHtml += `<li>${typeNames[locType] || locType}</li>`;
                            });
                            locationsHtml += '</ul>';
                            
                            districtLocations.innerHTML = locationsHtml;
                        }
                    });
                });
                
                // Make the labels activate their districts when clicked
                districtLabels.forEach(label => {
                    label.addEventListener('click', function() {
                        const districtId = this.getAttribute('data-district');
                        const district = container.querySelector(`.district[data-district="${districtId}"]`);
                        if (district) {
                            district.dispatchEvent(new Event('click'));
                        }
                    });
                });
                
                // Select City Center by default
                const defaultDistrict = container.querySelector('.district[data-district="city-center"]');
                if (defaultDistrict) {
                    defaultDistrict.dispatchEvent(new Event('click'));
                }
            }
            
            // Location generation function
            function generateLocation() {
                // Get selected options
                const locationType = locationTypeSelect.value;
                const district = districtSelect.value;
                const includeNPCs = includeNPCsCheckbox.checked;
                const includeHooks = includeHooksCheckbox.checked;
                const includeThreats = includeThreatsCheckbox.checked;
                
                // Determine actual location type (random or specific)
                let actualType = locationType;
                if (locationType === 'random') {
                    const types = Object.keys(locationNames);
                    actualType = types[Math.floor(Math.random() * types.length)];
                }
                
                // Determine actual district (random or specific)
                let actualDistrict = district;
                if (district === 'random') {
                    const districts = Object.keys(districtInfo);
                    actualDistrict = districts[Math.floor(Math.random() * districts.length)];
                }
                
                // Get district info
                const districtData = districtInfo[actualDistrict] || {
                    name: 'Unknown District',
                    danger: 'medium',
                    security: 'medium',
                    commonLocations: []
                };
                
                // Generate location name
                const namePool = locationNames[actualType] || locationNames.shop;
                const adjective = locationAdjectives[Math.floor(Math.random() * locationAdjectives.length)];
                const baseName = namePool[Math.floor(Math.random() * namePool.length)];
                
                // Some name formats (randomly chosen)
                const nameFormats = [
                    `The ${adjective} ${baseName}`,
                    `${adjective} ${baseName}`,
                    `${baseName} ${actualType.charAt(0).toUpperCase() + actualType.slice(1)}`,
                    `${baseName}'s`,
                    `${adjective} ${baseName} ${actualType.charAt(0).toUpperCase() + actualType.slice(1)}`
                ];
                
                const locationName = nameFormats[Math.floor(Math.random() * nameFormats.length)];
                
                // Get location description
                const descriptions = locationDescriptions[actualType] || locationDescriptions.shop;
                const description = descriptions[Math.floor(Math.random() * descriptions.length)];
                
                // Generate security level based on district
                let securityLevel;
                let securityClass;
                
                switch (districtData.security) {
                    case 'minimal':
                        securityLevel = 'Minimal Security';
                        securityClass = 'security-low';
                        break;
                    case 'low':
                        securityLevel = 'Low Security';
                        securityClass = 'security-low';
                        break;
                    case 'medium':
                        securityLevel = 'Medium Security';
                        securityClass = 'security-medium';
                        break;
                    case 'high':
                        securityLevel = 'High Security';
                        securityClass = 'security-high';
                        break;
                    case 'extreme':
                        securityLevel = 'Extreme Security';
                        securityClass = 'security-extreme';
                        break;
                    default:
                        securityLevel = 'Medium Security';
                        securityClass = 'security-medium';
                }
                
                // Generate NPCs
                let npcsHtml = '';
                if (includeNPCs) {
                    npcsHtml = `
                        <div class="location-section">
                            <h4 class="section-title">Notable NPCs</h4>
                            <div class="npc-list">
                    `;
                    
                    // Generate 1-3 NPCs
                    const npcCount = Math.floor(Math.random() * 3) + 1;
                    
                    for (let i = 0; i < npcCount; i++) {
                        const role = npcRoles[Math.floor(Math.random() * npcRoles.length)];
                        const adjective = npcAdjectives[Math.floor(Math.random() * npcAdjectives.length)];
                        
                        // Random name generation (simple version)
                        const firstNames = ['Alex', 'Morgan', 'Casey', 'Jordan', 'Quinn', 'Remy', 'Taylor', 'Sam', 'Ash', 'Dakota', 'Jin', 'Kai', 'Nova', 'Zero', 'V', 'Jackie', 'River', 'Panam', 'Judy', 'Kerry'];
                        const lastNames = ['Smith', 'Rodriguez', 'Chen', 'Kowalski', 'Fisher', 'Walker', 'Night', 'Kovac', 'Welles', 'Parker', 'Jones', 'Ward', 'Alvarez', 'Reed', 'Deckard', 'Grey', 'Price', 'Black', 'Wolf', 'Steel'];
                        
                        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                        const name = `${firstName} ${lastName}`;
                        
                        npcsHtml += `
                            <div class="npc-item">
                                <div class="npc-name">${name}</div>
                                <div class="npc-role">${adjective} ${role}</div>
                            </div>
                        `;
                    }
                    
                    npcsHtml += `
                            </div>
                        </div>
                    `;
                }
                
                // Generate Story Hooks
                let hooksHtml = '';
                if (includeHooks) {
                    hooksHtml = `
                        <div class="location-section">
                            <h4 class="section-title">Potential Story Hooks</h4>
                            <div class="hook-list">
                    `;
                    
                    // Generate 1-2 hooks
                    const hookCount = Math.floor(Math.random() * 2) + 1;
                    const usedHookIndices = [];
                    
                    for (let i = 0; i < hookCount; i++) {
                        let hookIndex;
                        do {
                            hookIndex = Math.floor(Math.random() * storyHooks.length);
                        } while (usedHookIndices.includes(hookIndex));
                        
                        usedHookIndices.push(hookIndex);
                        const hook = storyHooks[hookIndex];
                        
                        hooksHtml += `
                            <div class="hook-item">
                                <div class="hook-title">Potential Lead</div>
                                <div class="hook-description">${hook}</div>
                            </div>
                        `;
                    }
                    
                    hooksHtml += `
                            </div>
                        </div>
                    `;
                }
                
                // Generate Threats
                let threatsHtml = '';
                if (includeThreats) {
                    threatsHtml = `
                        <div class="location-section">
                            <h4 class="section-title">Potential Threats</h4>
                            <div class="threat-list">
                    `;
                    
                    // Determine threat count based on district danger level
                    let threatCount = 1;
                    if (districtData.danger === 'high') threatCount = 2;
                    if (districtData.danger === 'extreme') threatCount = 3;
                    
                    const usedThreatIndices = [];
                    
                    for (let i = 0; i < threatCount; i++) {
                        let threatIndex;
                        do {
                            threatIndex = Math.floor(Math.random() * threatTypes.length);
                        } while (usedThreatIndices.includes(threatIndex));
                        
                        usedThreatIndices.push(threatIndex);
                        const threat = threatTypes[threatIndex];
                        
                        threatsHtml += `
                            <div class="threat-item">
                                <div class="threat-name">Threat</div>
                                <div class="threat-description">${threat}</div>
                            </div>
                        `;
                    }
                    
                    threatsHtml += `
                            </div>
                        </div>
                    `;
                }
                
                // Create complete location HTML
                const locationHtml = `
                    <div class="location-card">
                        <div class="location-header">
                            <h3 class="location-title">${locationName}</h3>
                            <div class="location-badges">
                                <span class="location-type-badge">${actualType.charAt(0).toUpperCase() + actualType.slice(1)}</span>
                                <span class="location-district-badge">${districtData.name}</span>
                            </div>
                        </div>
                        
                        <div class="location-description">
                            <p>${description}</p>
                            <span class="security-level ${securityClass}">${securityLevel}</span>
                        </div>
                        
                        ${npcsHtml}
                        ${hooksHtml}
                        ${threatsHtml}
                    </div>
                `;
                
                // Update the container with the new location
                locationContainer.innerHTML = locationHtml;
                
                // Store the active location data for saving
                activeLocation = {
                    name: locationName,
                    type: actualType,
                    district: actualDistrict,
                    description: description,
                    security: securityLevel,
                    html: locationHtml,
                    timestamp: Date.now()
                };
            }
            
            // Save current location function
            function saveCurrentLocation() {
                if (!activeLocation) {
                    alert('Generate a location first before saving.');
                    return;
                }
                
                // Add ID to the location
                activeLocation.id = 'loc_' + Date.now();
                
                // Add to saved locations
                savedLocations.push(activeLocation);
                
                // Save to storage
                localStorage.setItem('cyberpunk-saved-locations', JSON.stringify(savedLocations));
                
                // Update saved locations list if visible
                if (container.querySelector('#saved-tab').style.display !== 'none') {
                    displaySavedLocations();
                }
                
                // Notify user
                alert('Location saved successfully.');
            }
            
            // Load saved locations from storage
            function loadSavedLocations() {
                try {
                    const saved = localStorage.getItem('cyberpunk-saved-locations');
                    return saved ? JSON.parse(saved) : [];
                } catch (e) {
                    console.error('Error loading saved locations:', e);
                    return [];
                }
            }
            
            // Display saved locations
            function displaySavedLocations() {
                if (!savedLocationsList) return;
                
                if (savedLocations.length === 0) {
                    savedLocationsList.innerHTML = '<div class="empty-saves-message">No saved locations yet.</div>';
                    return;
                }
                
                let locationsHtml = '';
                
                savedLocations.forEach(location => {
                    const date = new Date(location.timestamp);
                    const dateStr = date.toLocaleDateString();
                    
                    locationsHtml += `
                        <div class="saved-location-item" data-id="${location.id}">
                            <div class="location-item-info">
                                <div class="location-item-name">${location.name}</div>
                                <div class="location-item-details">${location.type.charAt(0).toUpperCase() + location.type.slice(1)} in ${districtInfo[location.district]?.name || location.district} (Saved: ${dateStr})</div>
                            </div>
                            <div class="location-item-buttons">
                                <button class="location-load-btn" data-id="${location.id}">Load</button>
                                <button class="location-delete-btn" data-id="${location.id}">Delete</button>
                            </div>
                        </div>
                    `;
                });
                
                savedLocationsList.innerHTML = locationsHtml;
                
                // Add event listeners to buttons
                const loadButtons = savedLocationsList.querySelectorAll('.location-load-btn');
                const deleteButtons = savedLocationsList.querySelectorAll('.location-delete-btn');
                
                loadButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        loadLocation(id);
                    });
                });
                
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        deleteLocation(id);
                    });
                });
            }
            
            // Load saved location
            function loadLocation(id) {
                const location = savedLocations.find(loc => loc.id === id);
                if (!location) return;
                
                // Switch to generator tab
                const generatorTab = container.querySelector('.location-tab[data-tab="generator"]');
                if (generatorTab) {
                    generatorTab.click();
                }
                
                // Display the saved location
                locationContainer.innerHTML = location.html;
                
                // Set as active location
                activeLocation = location;
            }
            
            // Delete saved location
            function deleteLocation(id) {
                if (!confirm('Are you sure you want to delete this saved location?')) return;
                
                // Filter out the location to delete
                savedLocations = savedLocations.filter(loc => loc.id !== id);
                
                // Save to storage
                localStorage.setItem('cyberpunk-saved-locations', JSON.stringify(savedLocations));
                
                // Update display
                displaySavedLocations();
            }
            
            // Initialize with default tab
            generateBtn?.click();
        }
        
        function initializeTimer(container) {
            const display = container.querySelector('.timer-value');
            const dateDisplay = container.querySelector('.timer-date');
            const startBtn = container.querySelector('.start-btn');
            const pauseBtn = container.querySelector('.pause-btn');
            const resetBtn = container.querySelector('.reset-btn');
            const timeButtons = container.querySelectorAll('.time-btn');
            
            if (!display || !dateDisplay || !startBtn || !pauseBtn || !resetBtn) return;
            
            let startTime = new Date();
            let gameTime = new Date();
            let elapsedTime = 0;
            let timerInterval = null;
            let isRunning = false;
            
            // Update the timer display
            function updateDisplay() {
                const hours = Math.floor(elapsedTime / 3600).toString().padStart(2, '0');
                const minutes = Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0');
                const seconds = Math.floor(elapsedTime % 60).toString().padStart(2, '0');
                
                display.textContent = `${hours}:${minutes}:${seconds}`;
                
                // Update game time
                gameTime = new Date(startTime.getTime() + elapsedTime * 1000);
                
                // Calculate in-game day
                const daysPassed = Math.floor(elapsedTime / 86400); // 86400 seconds in a day
                const hourOfDay = gameTime.getHours();
                
                // Determine time of day
                let timeOfDay;
                if (hourOfDay >= 5 && hourOfDay < 12) {
                    timeOfDay = 'Morning';
                } else if (hourOfDay >= 12 && hourOfDay < 17) {
                    timeOfDay = 'Afternoon';
                } else if (hourOfDay >= 17 && hourOfDay < 21) {
                    timeOfDay = 'Evening';
                } else {
                    timeOfDay = 'Night';
                }
                
                dateDisplay.textContent = `Day ${daysPassed + 1} - ${timeOfDay}`;
            }
            
            // Start the timer
            startBtn.addEventListener('click', function() {
                if (isRunning) return;
                
                isRunning = true;
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                
                const startNow = Date.now();
                const lastElapsed = elapsedTime;
                
                timerInterval = setInterval(function() {
                    const now = Date.now();
                    elapsedTime = lastElapsed + Math.floor((now - startNow) / 1000);
                    updateDisplay();
                }, 1000);
            });
            
            // Pause the timer
            pauseBtn.addEventListener('click', function() {
                if (!isRunning) return;
                
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                
                clearInterval(timerInterval);
            });
            
            // Reset the timer
            resetBtn.addEventListener('click', function() {
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                
                clearInterval(timerInterval);
                elapsedTime = 0;
                startTime = new Date();
                gameTime = new Date();
                updateDisplay();
            });
            
            // Time jump buttons
            timeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const minutes = parseInt(this.dataset.minutes) || 0;
                    elapsedTime += minutes * 60;
                    updateDisplay();
                });
            });
            
            // Initialize display
            updateDisplay();
        }
        
        function initializeCalculator(container) {
            const display = container.querySelector('.calculator-display');
            const buttons = container.querySelectorAll('.calc-btn');
            const diceButtons = container.querySelectorAll('.dice-shortcut-btn');
            
            if (!display || !buttons.length) return;
            
            let currentValue = '0';
            let needsClear = false;
            
            // Update the display
            function updateDisplay() {
                display.textContent = currentValue;
            }
            
            // Handle button clicks
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    // If previous calculation is done, clear for new input
                    if (needsClear && !button.classList.contains('calc-op')) {
                        currentValue = '0';
                        needsClear = false;
                    }
                    
                    // Handle different button types
                    if (button.classList.contains('calc-num')) {
                        // Number buttons
                        if (currentValue === '0' && button.textContent !== '.') {
                            currentValue = button.textContent;
                        } else {
                            currentValue += button.textContent;
                        }
                    } else if (button.classList.contains('calc-op')) {
                        // Operation buttons
                        if (['+', '-', '*', '/', '(', ')'].includes(button.textContent)) {
                            currentValue += button.textContent;
                            needsClear = false;
                        }
                    } else if (button.classList.contains('calc-equals')) {
                        // Calculate result
                        try {
                            currentValue = eval(currentValue).toString();
                            needsClear = true;
                        } catch (error) {
                            currentValue = 'Error';
                            needsClear = true;
                        }
                    } else if (button.classList.contains('calc-clear')) {
                        // Clear button
                        currentValue = '0';
                        needsClear = false;
                    } else if (button.classList.contains('calc-backspace')) {
                        // Backspace button
                        if (currentValue.length > 1) {
                            currentValue = currentValue.slice(0, -1);
                        } else {
                            currentValue = '0';
                        }
                    }
                    
                    updateDisplay();
                });
            });
            
            // Dice shortcut buttons
            diceButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const diceType = this.dataset.dice;
                    let [count, sides] = diceType.split('d').map(Number);
                    
                    // Roll the dice
                    let total = 0;
                    for (let i = 0; i < count; i++) {
                        total += Math.floor(Math.random() * sides) + 1;
                    }
                    
                    // Handle the result
                    if (needsClear || currentValue === '0') {
                        currentValue = total.toString();
                    } else {
                        // Try to determine if we should append or add
                        if (['+', '-', '*', '/', '('].includes(currentValue.slice(-1))) {
                            currentValue += total;
                        } else {
                            currentValue += '+' + total;
                        }
                    }
                    
                    needsClear = false;
                    updateDisplay();
                });
            });
            
            // Initialize display
            updateDisplay();
        }
        
        // [Function moved to the top of the file]
        
        // Use event delegation for panel buttons (more robust than direct selection)
        document.addEventListener('click', function(event) {
            // Check if the clicked element id starts with 'add-'
            if (event.target.id && event.target.id.startsWith('add-')) {
                event.preventDefault();
                
                // Get panel type from button ID
                const type = event.target.id.replace('add-', '');
                
                // Create the panel
                const panelId = createAccessiblePanel(type);
                
                // Show success notification
                if (panelId) {
                    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} panel created`, 'success', 2000);
                }
            }
        });
        
        // Initialize accessibility features
        window.initAccessibility = function() {
            // Handle dropdown menus
            const dropdowns = document.querySelectorAll('.dropdown');
            
            dropdowns.forEach(dropdown => {
                const button = dropdown.querySelector('.dropbtn');
                const content = dropdown.querySelector('.dropdown-content');
                
                if (!button || !content) return;
                
                // Handle click events
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isExpanded = button.getAttribute('aria-expanded') === 'true';
                    
                    // Close all other dropdowns first
                    document.querySelectorAll('.dropdown .dropbtn[aria-expanded="true"]').forEach(btn => {
                        if (btn !== button) {
                            btn.setAttribute('aria-expanded', 'false');
                            btn.parentElement.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    button.setAttribute('aria-expanded', !isExpanded);
                    dropdown.classList.toggle('active', !isExpanded);
                });
                
                // Handle keyboard navigation
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        button.setAttribute('aria-expanded', 'true');
                        dropdown.classList.add('active');
                        
                        // Focus the first item in the dropdown
                        const firstItem = content.querySelector('a');
                        if (firstItem) {
                            setTimeout(() => {
                                firstItem.focus();
                            }, 10);
                        }
                    }
                });
                
                // Add keyboard navigation within dropdown menu
                const links = content.querySelectorAll('a');
                
                links.forEach((link, index) => {
                    link.addEventListener('keydown', (e) => {
                        switch (e.key) {
                            case 'ArrowDown':
                                e.preventDefault();
                                if (index < links.length - 1) {
                                    links[index + 1].focus();
                                }
                                break;
                            case 'ArrowUp':
                                e.preventDefault();
                                if (index > 0) {
                                    links[index - 1].focus();
                                } else {
                                    button.focus();
                                    button.setAttribute('aria-expanded', 'false');
                                    dropdown.classList.remove('active');
                                }
                                break;
                            case 'Escape':
                                e.preventDefault();
                                button.focus();
                                button.setAttribute('aria-expanded', 'false');
                                dropdown.classList.remove('active');
                                break;
                            case 'Tab':
                                if (index === links.length - 1 && !e.shiftKey) {
                                    button.setAttribute('aria-expanded', 'false');
                                    dropdown.classList.remove('active');
                                }
                                break;
                        }
                    });
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        button.setAttribute('aria-expanded', 'false');
                        dropdown.classList.remove('active');
                    }
                });
            });
            
            // Handle theme switcher
            const themeOptions = document.querySelectorAll('.theme-option');
            themeOptions.forEach(option => {
                option.addEventListener('click', function() {
                    // Update ARIA states for all options
                    themeOptions.forEach(opt => {
                        opt.setAttribute('aria-checked', 'false');
                        opt.classList.remove('active');
                    });
                    
                    // Set this one as checked
                    this.setAttribute('aria-checked', 'true');
                    this.classList.add('active');
                    
                    // Apply theme
                    const theme = this.getAttribute('data-theme');
                    if (theme) {
                        document.body.className = `theme-${theme}`;
                    }
                });
                
                // Keyboard support for theme options
                option.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
        };
        
        console.log('CyberpunkGM fixed adapter initialized successfully');
    });
})();