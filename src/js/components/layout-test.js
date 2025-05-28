/**
 * Test script for layout-save-improved.js
 * This script helps test the functionality of the improved layout save system
 */

(function() {
    // Wait until page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLayoutTest);
    } else {
        initLayoutTest();
    }
    
    function initLayoutTest() {
        console.log('🧪 Initializing layout test script');
        
        // Wait for CyberpunkGM namespace to be available
        const checkInterval = setInterval(() => {
            if (window.CyberpunkGM && window.CyberpunkGM.Layout) {
                clearInterval(checkInterval);
                setupTestConsole();
                console.log('✅ Layout test script initialized');
            }
        }, 100);
    }
    
    function setupTestConsole() {
        // Create test panel
        const testPanel = document.createElement('div');
        testPanel.className = 'panel';
        testPanel.style.width = '400px';
        testPanel.style.height = '300px';
        testPanel.style.top = '50px';
        testPanel.style.left = '50px';
        testPanel.style.zIndex = '1000';
        
        // Add panel header
        const header = document.createElement('div');
        header.className = 'panel-header';
        
        const title = document.createElement('div');
        title.textContent = 'Layout Test Console';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => testPanel.remove());
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Add panel content
        const content = document.createElement('div');
        content.className = 'panel-content';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.height = 'calc(100% - 30px)';
        content.style.overflowY = 'auto';
        
        // Add test buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.gap = '5px';
        buttonContainer.style.marginBottom = '10px';
        
        // Create test buttons
        const testButtons = [
            { label: 'Add Test Panels', action: addTestPanels },
            { label: 'Random Panel Positions', action: randomizePanelPositions },
            { label: 'Save Current Layout', action: saveCurrentLayout },
            { label: 'Clear Layout', action: clearLayout },
            { label: 'Export Layout', action: exportLayout },
            { label: 'Import Layout', action: importLayout },
            { label: 'Toggle Auto-Save', action: toggleAutoSave },
            { label: 'Test Notification', action: testNotification },
            { label: 'Test Error Handling', action: testErrorHandling }
        ];
        
        testButtons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.label;
            button.style.padding = '5px 10px';
            button.style.margin = '2px';
            button.style.backgroundColor = '#254b75';
            button.style.color = '#e0e0e0';
            button.style.border = '1px solid #00ccff';
            button.style.cursor = 'pointer';
            
            button.addEventListener('click', btn.action);
            buttonContainer.appendChild(button);
        });
        
        // Add log area
        const logArea = document.createElement('div');
        logArea.id = 'layout-test-log';
        logArea.style.flex = '1';
        logArea.style.backgroundColor = '#1a1a24';
        logArea.style.color = '#e0e0e0';
        logArea.style.fontFamily = 'monospace';
        logArea.style.fontSize = '12px';
        logArea.style.padding = '10px';
        logArea.style.overflowY = 'auto';
        logArea.style.whiteSpace = 'pre-wrap';
        logArea.style.maxHeight = '200px';
        
        // Assemble panel
        content.appendChild(buttonContainer);
        content.appendChild(logArea);
        testPanel.appendChild(header);
        testPanel.appendChild(content);
        document.body.appendChild(testPanel);
        
        // Override console.log for test logs
        const originalConsoleLog = console.log;
        console.log = function() {
            // Call original console.log
            originalConsoleLog.apply(console, arguments);
            
            // Add to test log
            const logElement = document.getElementById('layout-test-log');
            if (logElement) {
                const args = Array.from(arguments);
                const timestamp = new Date().toISOString().substring(11, 19);
                const message = `[${timestamp}] ${args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`;
                
                logElement.innerHTML += message + '\n';
                logElement.scrollTop = logElement.scrollHeight;
            }
        };
        
        console.log('Layout Test Console initialized');
    }
    
    function addTestPanels() {
        console.log('Adding test panels...');
        
        const panelTypes = [
            'Notes', 
            'Dice Roller', 
            'Rules Reference'
        ];
        
        panelTypes.forEach((type, index) => {
            // Check if panel creation function exists
            const functionName = `create${type.replace(/\s+/g, '')}Panel`;
            
            if (typeof window[functionName] === 'function') {
                const panel = window[functionName]();
                
                if (panel) {
                    // Position panel
                    panel.style.left = `${100 + (index * 50)}px`;
                    panel.style.top = `${150 + (index * 30)}px`;
                    console.log(`Created ${type} panel`);
                } else {
                    console.log(`Failed to create ${type} panel`);
                }
            } else {
                console.log(`Creation function ${functionName} not found`);
            }
        });
    }
    
    function randomizePanelPositions() {
        console.log('Randomizing panel positions...');
        
        const panels = document.querySelectorAll('.panel');
        
        panels.forEach(panel => {
            // Get viewport dimensions
            const maxX = window.innerWidth - 200;
            const maxY = window.innerHeight - 200;
            
            // Generate random position
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);
            
            // Apply new position
            panel.style.left = `${randomX}px`;
            panel.style.top = `${randomY}px`;
        });
        
        console.log(`Randomized ${panels.length} panels`);
    }
    
    function saveCurrentLayout() {
        console.log('Saving current layout...');
        
        if (window.CyberpunkGM && window.CyberpunkGM.Layout) {
            const result = window.CyberpunkGM.Layout.saveLayout('test');
            console.log('Layout saved:', result ? 'success' : 'failed');
        } else {
            console.log('CyberpunkGM.Layout not available');
        }
    }
    
    function clearLayout() {
        console.log('Clearing layout...');
        
        if (window.CyberpunkGM && window.CyberpunkGM.Layout) {
            window.CyberpunkGM.Layout.clearLayout();
            console.log('Layout cleared');
        } else {
            console.log('CyberpunkGM.Layout not available');
        }
    }
    
    function exportLayout() {
        console.log('Exporting layout...');
        
        if (window.CyberpunkGM && window.CyberpunkGM.Layout) {
            window.CyberpunkGM.Layout.exportLayout();
        } else {
            console.log('CyberpunkGM.Layout not available');
        }
    }
    
    function importLayout() {
        console.log('Importing layout...');
        
        if (window.CyberpunkGM && window.CyberpunkGM.Layout) {
            window.CyberpunkGM.Layout.importLayout();
        } else {
            console.log('CyberpunkGM.Layout not available');
        }
    }
    
    function toggleAutoSave() {
        console.log('Toggling auto-save...');
        
        if (window.CyberpunkGM && window.CyberpunkGM.Layout) {
            // Access Storage utility
            const storage = window.localStorage;
            const autoSaveKey = 'cyberpunk-autosave-enabled';
            
            // Get current state and toggle
            const currentState = storage.getItem(autoSaveKey) !== 'false';
            storage.setItem(autoSaveKey, !currentState);
            
            console.log(`Auto-save ${!currentState ? 'enabled' : 'disabled'}`);
        } else {
            console.log('CyberpunkGM.Layout not available');
        }
    }
    
    function testNotification() {
        console.log('Testing notifications...');
        
        if (window.CyberpunkGM && window.CyberpunkGM.Layout) {
            // Try to access UI or create a custom notification
            const testMessage = 'This is a test notification';
            
            // Try to use the notification system if accessible
            if (window.CyberpunkGM.Layout.UI && window.CyberpunkGM.Layout.UI.notify) {
                window.CyberpunkGM.Layout.UI.notify(testMessage, 'info');
                window.CyberpunkGM.Layout.UI.notify('Success notification test', 'success');
                window.CyberpunkGM.Layout.UI.notify('Error notification test', 'error');
            } else {
                // Create a custom notification
                const notification = document.createElement('div');
                notification.style.position = 'fixed';
                notification.style.bottom = '20px';
                notification.style.right = '20px';
                notification.style.backgroundColor = '#1e1e2d';
                notification.style.color = '#e0e0e0';
                notification.style.border = '1px solid #00ccff';
                notification.style.borderLeft = '4px solid #00ccff';
                notification.style.padding = '10px 15px';
                notification.style.zIndex = '9999';
                notification.style.borderRadius = '4px';
                notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
                notification.textContent = testMessage;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 3000);
            }
            
            console.log('Notification test triggered');
        } else {
            console.log('CyberpunkGM.Layout not available');
        }
    }
    
    function testErrorHandling() {
        console.log('Testing error handling...');
        
        try {
            // Generate an error by trying to parse invalid JSON
            const invalidJson = '{"broken": "json",}';
            JSON.parse(invalidJson);
        } catch (error) {
            console.error('Caught test error:', error);
            
            if (window.CyberpunkGM && window.CyberpunkGM.Layout) {
                // Try to use the notification system if accessible
                if (window.CyberpunkGM.Layout.UI && window.CyberpunkGM.Layout.UI.notify) {
                    window.CyberpunkGM.Layout.UI.notify(`Error test: ${error.message}`, 'error');
                }
            }
        }
        
        console.log('Error handling test complete');
    }
})();