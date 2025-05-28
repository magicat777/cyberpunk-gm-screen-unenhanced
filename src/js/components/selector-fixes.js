/**
 * Selector fixes for the Cyberpunk GM Screen
 * 
 * This file provides fixes for selector issues in the original code.
 * These functions should replace their counterparts in app-modern.js.
 */

// Fix for panel title selector
function fixedPanelCreation(panel) {
    // Set title ID for aria-labelledby
    const titleElement = panel.querySelector('.panel-title');
    if (titleElement) {
        titleElement.id = `panel-title-${id}`;
    }
}

// Fix for makeDraggable function
function fixedMakeDraggable(panel) {
    try {
        const header = panel.querySelector('.panel-header');
        if (!header) return;
        
        let isDragging = false;
        let offsetX, offsetY;
        
        // Using Pointer Events for better cross-device support
        header.addEventListener('pointerdown', function(e) {
            // Prevent if clicking close button
            if (e.target.classList.contains('close-button')) return;
            
            isDragging = true;
            panel.style.zIndex = state.lastZIndex++;
            
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // Add dragging class for visual feedback
            panel.classList.add('panel-dragging');
            
            // Capture pointer to receive events outside element
            header.setPointerCapture(e.pointerId);
        });
        
        header.addEventListener('pointermove', function(e) {
            if (!isDragging) return;
            
            // Calculate new position with bounds checking
            let left = e.clientX - offsetX;
            let top = e.clientY - offsetY;
            
            // Prevent dragging offscreen
            left = Math.max(0, Math.min(left, window.innerWidth - 100));
            top = Math.max(0, Math.min(top, window.innerHeight - 50));
            
            panel.style.left = `${left}px`;
            panel.style.top = `${top}px`;
        });
        
        header.addEventListener('pointerup', function(e) {
            if (isDragging) {
                isDragging = false;
                panel.classList.remove('panel-dragging');
                header.releasePointerCapture(e.pointerId);
            }
        });
        
        header.addEventListener('pointercancel', function(e) {
            if (isDragging) {
                isDragging = false;
                panel.classList.remove('panel-dragging');
                header.releasePointerCapture(e.pointerId);
            }
        });
        
        Logger.log(`Made panel draggable: ${panel.dataset.id}`);
    } catch (error) {
        Logger.error('Failed to make panel draggable', error);
    }
}

// Fix for makeResizable function
function fixedMakeResizable(panel) {
    try {
        const handle = panel.querySelector('.resize-handle');
        if (!handle) return;
        
        let isResizing = false;
        
        handle.addEventListener('pointerdown', function(e) {
            isResizing = true;
            e.preventDefault();
            panel.classList.add('panel-resizing');
            handle.setPointerCapture(e.pointerId);
        });
        
        handle.addEventListener('pointermove', function(e) {
            if (!isResizing) return;
            
            const rect = panel.getBoundingClientRect();
            const width = e.clientX - rect.left;
            const height = e.clientY - rect.top;
            
            // Minimum size constraints
            if (width >= 200 && height >= 100) {
                panel.style.width = `${width}px`;
                panel.style.height = `${height}px`;
            }
        });
        
        handle.addEventListener('pointerup', function(e) {
            if (isResizing) {
                isResizing = false;
                panel.classList.remove('panel-resizing');
                handle.releasePointerCapture(e.pointerId);
            }
        });
        
        handle.addEventListener('pointercancel', function(e) {
            if (isResizing) {
                isResizing = false;
                panel.classList.remove('panel-resizing');
                handle.releasePointerCapture(e.pointerId);
            }
        });
        
        Logger.log(`Made panel resizable: ${panel.dataset.id}`);
    } catch (error) {
        Logger.error('Failed to make panel resizable', error);
    }
}

// Fix for UI notification container selector
function fixedShowNotification(message, type = 'info', duration = 3000) {
    try {
        // Create container if it doesn't exist
        let container = Utils.getElement('.cp-notifications');
        if (!container) {
            container = Utils.createElement('div', {
                'class': 'cp-notifications'
            });
            document.body.appendChild(container);
        }
        
        // Create notification element
        const notification = Utils.createElement('div', {
            'class': `cp-notification cp-notification-${type}`
        }, {
            'textContent': message
        });
        
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
        
        Logger.log(`Showed notification: ${message} (${type})`);
        return true;
    } catch (error) {
        Logger.error(`Failed to show notification: ${message}`, error);
        return false;
    }
}

// Fixed event delegation for close button
function initFixedEventDelegation() {
    // Document-level event listeners for delegation
    Events.on(document, 'click', '.close-button', function(event) {
        const panelId = this.closest('.panel').dataset.id;
        if (panelId) {
            Panels.remove(panelId);
        }
    });
}

// Fixed event binding for theme options
function fixedThemeInit() {
    // Add event listeners for theme switching
    Events.on(document, 'click', '.theme-option', function(event) {
        const theme = this.dataset.theme;
        if (theme) {
            Themes.switchTo(theme);
        }
    });
}

// Event delegation selectors fixed
const fixedEventSelectors = {
    // Panel creation buttons
    addNotes: '#add-notes',
    addDice: '#add-dice',
    addRules: '#add-rules',
    // Layout controls
    saveLayout: '#save-layout',
    loadLayout: '#load-layout',
    clearLayout: '#clear-layout',
    resetLayout: '#reset-layout',
    // Font controls
    fontSizeBtn: '.font-size-btn',
    fontFamily: '#font-family',
    applyFont: '#apply-font',
    // Misc
    themeOption: '.theme-option',
    closeButton: '.close-button',
    rollDiceBtn: '.roll-dice-btn',
    panelRuleSection: '.panel-rule-section',
    statInput: '.stat-input'
};