/**
 * Cyberpunk GM Screen - Panel System Tests
 * 
 * This script provides functions to test the panel system functionality
 * and verify that all fixes are working correctly.
 */

(function() {
    'use strict';
    
    // Wait for DOM to load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Panel system test script loaded');
        
        // Create test button
        const testButton = document.createElement('button');
        testButton.id = 'run-panel-tests';
        testButton.className = 'test-button';
        testButton.textContent = 'Run Panel Tests';
        testButton.setAttribute('aria-label', 'Run panel system tests');
        testButton.style.position = 'fixed';
        testButton.style.bottom = '20px';
        testButton.style.left = '20px';
        testButton.style.zIndex = '9999';
        testButton.style.padding = '10px 15px';
        testButton.style.background = 'rgba(20, 20, 35, 0.9)';
        testButton.style.color = '#e0e0e0';
        testButton.style.border = '1px solid #00ccff';
        testButton.style.borderRadius = '4px';
        testButton.style.cursor = 'pointer';
        
        document.body.appendChild(testButton);
        
        // Function to run panel system tests
        testButton.addEventListener('click', function() {
            console.log('Running panel system tests...');
            window.showNotification('Running panel system tests...', 'info', 3000);
            
            runPanelTests();
        });
    });
    
    // Panel test suite
    function runPanelTests() {
        console.group('Panel System Tests');
        
        // Check for required global functions
        console.log('Checking for required functions...');
        const requiredFunctions = [
            'createAccessiblePanel',
            'showNotification',
            'initAccessibility'
        ];
        
        let functionsExist = true;
        requiredFunctions.forEach(func => {
            const exists = typeof window[func] === 'function';
            console.log(`${func}: ${exists ? '✓' : '✗'}`);
            functionsExist = functionsExist && exists;
        });
        
        if (!functionsExist) {
            console.error('Required functions are missing. Tests cannot continue.');
            window.showNotification('Test failed: Required functions missing', 'error', 5000);
            console.groupEnd();
            return;
        }
        
        // Test panel creation
        console.log('Testing panel creation...');
        const panels = [];
        
        try {
            // Test 1: Create a notes panel
            const notesPanel = window.createAccessiblePanel('notes', {
                x: 100,
                y: 100,
                width: 300,
                height: 200
            });
            
            if (notesPanel) {
                console.log('✓ Notes panel created');
                panels.push(notesPanel);
            } else {
                throw new Error('Failed to create notes panel');
            }
            
            // Test 2: Create a dice panel
            const dicePanel = window.createAccessiblePanel('dice', {
                x: 450,
                y: 100,
                width: 300,
                height: 200
            });
            
            if (dicePanel) {
                console.log('✓ Dice panel created');
                panels.push(dicePanel);
            } else {
                throw new Error('Failed to create dice panel');
            }
            
            // Test 3: Panel DOM structure
            const panel = document.querySelector(`.panel[data-id="${notesPanel}"]`);
            if (!panel) {
                throw new Error('Panel element not found in DOM');
            }
            
            const expectedElements = [
                '.panel-header',
                '.panel-title',
                '.close-button',
                '.panel-content',
                '.resize-handle'
            ];
            
            expectedElements.forEach(selector => {
                if (!panel.querySelector(selector)) {
                    throw new Error(`Panel structure missing: ${selector}`);
                }
            });
            
            console.log('✓ Panel DOM structure is correct');
            
            // Test 4: Verify panel position is within viewport
            const rect = panel.getBoundingClientRect();
            if (rect.left < 0 || rect.top < 0 || 
                rect.right > window.innerWidth || 
                rect.bottom > window.innerHeight) {
                throw new Error('Panel positioned outside viewport');
            }
            
            console.log('✓ Panel position is within viewport');
            
            // Test 5: Check for close button functionality
            setTimeout(() => {
                const dicePanel = document.querySelector(`.panel[data-type="dice"]`);
                if (dicePanel) {
                    const closeButton = dicePanel.querySelector('.close-button');
                    if (closeButton) {
                        console.log('Testing close button...');
                        closeButton.click();
                        
                        // Verify panel was removed
                        setTimeout(() => {
                            if (!document.querySelector(`.panel[data-type="dice"]`)) {
                                console.log('✓ Close button works correctly');
                                window.showNotification('Panel close test succeeded', 'success', 2000);
                            } else {
                                console.error('✗ Panel was not removed after clicking close button');
                                window.showNotification('Panel close test failed', 'error', 3000);
                            }
                            
                            console.log('All tests completed');
                            console.groupEnd();
                            window.showNotification('Panel system tests completed', 'success', 3000);
                        }, 500);
                    }
                }
            }, 1000);
            
        } catch (error) {
            console.error('Test failed:', error);
            window.showNotification('Panel tests failed: ' + error.message, 'error', 5000);
            console.groupEnd();
        }
    }
})();