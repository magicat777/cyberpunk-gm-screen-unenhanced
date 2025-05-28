// Panel fix for Cyberpunk GM Screen
// Version 1.3 - Comprehensive fix for Character and World panels

(function() {
    // Wait for DOM to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPanelFix);
    } else {
        // DOM already loaded, apply fix immediately
        initPanelFix();
    }

    function initPanelFix() {
        console.log('🔧 Applying panel functionality fixes...');
        
        // The fix needs to run after the inline script that defines the panel functions
        // To guarantee this, we wait for the DOM to be fully loaded and then apply the fix
        window.addEventListener('load', function() {
            setTimeout(() => {
                // Manually check if panel creation functions are available
                checkPanelFunctions();
                
                // Fix event handlers for panel menu items
                addSafeEventHandlers();
                
                // Expose functions to global scope
                exportFunctionsToGlobalScope();
                
                console.log('✅ Panel fixes applied successfully!');
            }, 1000);
        });
    }
    
    // Check if panel creation functions are available in the document
    function checkPanelFunctions() {
        console.log('Checking panel functions availability...');
        
        const panelFunctions = [
            'createPanel',
            'createCharacterPanel',
            'createNPCPanel',
            'createLootPanel',
            'createMapPanel',
            'createLocationPanel',
            'createEncounterPanel'
        ];
        
        panelFunctions.forEach(funcName => {
            const funcAvailable = typeof window[funcName] === 'function';
            console.log(`${funcName}: ${funcAvailable ? 'Available ✓' : 'Not available ✗'}`);
        });
    }
    
    // Export panel functions to global scope to ensure they're accessible
    function exportFunctionsToGlobalScope() {
        // We need to ensure all panel functions are available in the global scope
        
        // First, try to access the functions from script scope
        const scriptElements = document.querySelectorAll('script');
        let scriptContent = "";
        scriptElements.forEach(script => {
            if (!script.src && script.textContent) {
                scriptContent += script.textContent;
            }
        });
        
        // Define panel creation functions directly if needed
        if (typeof window.createCharacterPanel !== 'function') {
            console.log('Adding createCharacterPanel function to global scope');
            
            window.createCharacterPanel = function() {
                try {
                    // Call the base createPanel function
                    const panel = window.createPanel('Character Sheet');
                    if (!panel) return null;
                    
                    panel.style.width = "500px";
                    panel.style.height = "600px";
                    
                    panel.querySelector('.panel-content').innerHTML = `
                        <div style="padding: 10px;">
                            <input type="text" placeholder="Character Name" style="width: 100%; font-size: 18px; margin-bottom: 10px;">
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                                <div>
                                    <div><strong>Stats</strong></div>
                                    <div>INT: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                    <div>REF: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                    <div>DEX: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                    <div>TECH: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                    <div>COOL: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                    <div>WILL: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                    <div>LUCK: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                    <div>MOVE: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                    <div>BODY: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                    <div>EMP: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                </div>
                                <div>
                                    <div><strong>Derived Stats</strong></div>
                                    <div>HP: <span id="hp-calc">35</span></div>
                                    <div>Humanity: <span id="humanity-calc">50</span></div>
                                    <div><strong>Current Status</strong></div>
                                    <div>HP: <input type="number" id="current-hp" value="35" style="width: 40px;"></div>
                                    <div>Armor: <input type="number" id="armor-sp" value="11" style="width: 40px;"></div>
                                </div>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <div><strong>Skills</strong> (Add comma-separated list)</div>
                                <textarea style="width: 100%; height: 80px;">Handgun +5, Stealth +3, Athletics +4, Perception +4, Conversation +3, Brawling +2, Education +2, Streetwise +4</textarea>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <div><strong>Weapons</strong> (Add comma-separated list)</div>
                                <textarea style="width: 100%; height: 60px;">Medium Pistol (2d6), Combat Knife (1d6), Heavy Pistol (3d6)</textarea>
                            </div>
                            <div>
                                <div><strong>Cyberware & Gear</strong> (Add comma-separated list)</div>
                                <textarea style="width: 100%; height: 60px;">Cybereye (Infrared), Light Armorjack (SP11), Agent (Pocket AI), Medscanner</textarea>
                            </div>
                        </div>
                    `;
                    
                    // Add HP calculation
                    const bodyInput = panel.querySelector('input[min="1"][max="10"]:nth-of-type(9)');
                    const hpCalc = panel.querySelector('#hp-calc');
                    const currentHP = panel.querySelector('#current-hp');
                    
                    if (bodyInput && hpCalc && currentHP) {
                        bodyInput.addEventListener('change', function() {
                            const body = parseInt(this.value) || 5;
                            const hp = 10 + (body * 5);
                            hpCalc.textContent = hp;
                            currentHP.value = hp;
                        });
                    }
                    
                    return panel;
                } catch (error) {
                    console.error('Error creating character panel:', error);
                    return null;
                }
            };
        }
        
        // Simplified NPC generator panel
        if (typeof window.createNPCPanel !== 'function') {
            console.log('Adding createNPCPanel function to global scope');
            
            window.createNPCPanel = function() {
                try {
                    // Call the base createPanel function
                    const panel = window.createPanel('NPC Generator');
                    if (!panel) return null;
                    
                    panel.querySelector('.panel-content').innerHTML = `
                        <div style="margin-bottom: 10px;">
                            <button id="generate-npc">Generate NPC</button>
                            <select id="npc-type" style="margin-left: 10px;">
                                <option value="ganger">Ganger</option>
                                <option value="corp">Corporate</option>
                                <option value="fixer">Fixer</option>
                                <option value="nomad">Nomad</option>
                                <option value="netrunner">Netrunner</option>
                            </select>
                        </div>
                        <div id="npc-result" style="border: 1px solid #00ccff; padding: 10px;">
                            Click to generate an NPC
                        </div>
                    `;
                    
                    // Add generation functionality
                    const genButton = panel.querySelector('#generate-npc');
                    const typeSelect = panel.querySelector('#npc-type');
                    const resultDiv = panel.querySelector('#npc-result');
                    
                    if (genButton && typeSelect && resultDiv) {
                        genButton.addEventListener('click', function() {
                            const type = typeSelect.value;
                            resultDiv.innerHTML = `Generated ${type} NPC`;
                        });
                    }
                    
                    return panel;
                } catch (error) {
                    console.error('Error creating NPC panel:', error);
                    return null;
                }
            };
        }
        
        // Simplified loot generator panel
        if (typeof window.createLootPanel !== 'function') {
            console.log('Adding createLootPanel function to global scope');
            
            window.createLootPanel = function() {
                try {
                    // Call the base createPanel function
                    const panel = window.createPanel('Loot Generator');
                    if (!panel) return null;
                    
                    panel.querySelector('.panel-content').innerHTML = `
                        <div style="margin-bottom: 10px;">
                            <button id="generate-loot">Generate Loot</button>
                            <select id="loot-type" style="margin-left: 10px;">
                                <option value="corpse">Corpse</option>
                                <option value="apartment">Apartment</option>
                                <option value="vehicle">Vehicle</option>
                                <option value="corporate">Corporate Office</option>
                            </select>
                        </div>
                        <div id="loot-result" style="border: 1px solid #00ccff; padding: 10px;">
                            Click to generate loot
                        </div>
                    `;
                    
                    // Add generation functionality
                    const genButton = panel.querySelector('#generate-loot');
                    const typeSelect = panel.querySelector('#loot-type');
                    const resultDiv = panel.querySelector('#loot-result');
                    
                    if (genButton && typeSelect && resultDiv) {
                        genButton.addEventListener('click', function() {
                            const type = typeSelect.value;
                            resultDiv.innerHTML = `Generated ${type} loot`;
                        });
                    }
                    
                    return panel;
                } catch (error) {
                    console.error('Error creating loot panel:', error);
                    return null;
                }
            };
        }
        
        // Simplified map panel
        if (typeof window.createMapPanel !== 'function') {
            console.log('Adding createMapPanel function to global scope');
            
            window.createMapPanel = function() {
                try {
                    // Call the base createPanel function
                    const panel = window.createPanel('Night City Map');
                    if (!panel) return null;
                    
                    panel.style.width = "500px";
                    panel.style.height = "400px";
                    
                    panel.querySelector('.panel-content').innerHTML = `
                        <div style="text-align: center; padding: 10px;">
                            <p>Night City Districts Map</p>
                            <div style="border: 1px solid #00ccff; padding: 10px; margin: 10px; height: 300px;">
                                [Map Visualization]
                            </div>
                            <button id="generate-location">Generate Random Location</button>
                        </div>
                    `;
                    
                    // Add button functionality
                    const genButton = panel.querySelector('#generate-location');
                    if (genButton) {
                        genButton.addEventListener('click', function() {
                            alert('Generated random location');
                        });
                    }
                    
                    return panel;
                } catch (error) {
                    console.error('Error creating map panel:', error);
                    return null;
                }
            };
        }
        
        // Simplified location generator panel
        if (typeof window.createLocationPanel !== 'function') {
            console.log('Adding createLocationPanel function to global scope');
            
            window.createLocationPanel = function() {
                try {
                    // Call the base createPanel function
                    const panel = window.createPanel('Location Generator');
                    if (!panel) return null;
                    
                    panel.querySelector('.panel-content').innerHTML = `
                        <div style="margin-bottom: 10px;">
                            <button id="generate-location-details">Generate Location</button>
                            <select id="location-type" style="margin-left: 10px;">
                                <option value="bar">Bar/Club</option>
                                <option value="corpo">Corporate Building</option>
                                <option value="apartment">Apartment</option>
                                <option value="store">Store/Shop</option>
                                <option value="street">Street Scene</option>
                            </select>
                        </div>
                        <div id="location-result" style="border: 1px solid #00ccff; padding: 10px;">
                            Click to generate a location
                        </div>
                    `;
                    
                    // Add generation functionality
                    const genButton = panel.querySelector('#generate-location-details');
                    const typeSelect = panel.querySelector('#location-type');
                    const resultDiv = panel.querySelector('#location-result');
                    
                    if (genButton && typeSelect && resultDiv) {
                        genButton.addEventListener('click', function() {
                            const type = typeSelect.value;
                            resultDiv.innerHTML = `Generated ${type} location`;
                        });
                    }
                    
                    return panel;
                } catch (error) {
                    console.error('Error creating location panel:', error);
                    return null;
                }
            };
        }
        
        // Simplified encounter panel
        if (typeof window.createEncounterPanel !== 'function') {
            console.log('Adding createEncounterPanel function to global scope');
            
            window.createEncounterPanel = function() {
                try {
                    // Call the base createPanel function
                    const panel = window.createPanel('Random Encounter');
                    if (!panel) return null;
                    
                    panel.querySelector('.panel-content').innerHTML = `
                        <div style="margin-bottom: 10px;">
                            <button id="generate-encounter">Generate Encounter</button>
                            <select id="encounter-type" style="margin-left: 10px;">
                                <option value="combat">Combat</option>
                                <option value="social">Social</option>
                                <option value="environmental">Environmental</option>
                                <option value="mystery">Mystery</option>
                            </select>
                        </div>
                        <div id="encounter-result" style="border: 1px solid #00ccff; padding: 10px;">
                            Click to generate an encounter
                        </div>
                    `;
                    
                    // Add generation functionality
                    const genButton = panel.querySelector('#generate-encounter');
                    const typeSelect = panel.querySelector('#encounter-type');
                    const resultDiv = panel.querySelector('#encounter-result');
                    
                    if (genButton && typeSelect && resultDiv) {
                        genButton.addEventListener('click', function() {
                            const type = typeSelect.value;
                            resultDiv.innerHTML = `Generated ${type} encounter`;
                        });
                    }
                    
                    return panel;
                } catch (error) {
                    console.error('Error creating encounter panel:', error);
                    return null;
                }
            };
        }
    }
    
    // Add safe event handlers to panel menu items
    function addSafeEventHandlers() {
        console.log('Adding safe event handlers to panel menu items...');
        
        // Map of menu items to their creation functions
        const menuHandlers = {
            'add-character': 'createCharacterPanel',
            'add-npc': 'createNPCPanel',
            'add-loot': 'createLootPanel',
            'add-map': 'createMapPanel',
            'add-location': 'createLocationPanel',
            'add-encounter': 'createEncounterPanel'
        };
        
        // Add safe event handlers to each menu item
        Object.entries(menuHandlers).forEach(([menuId, funcName]) => {
            // Find the menu item element
            const element = document.getElementById(menuId);
            
            // Skip if element not found
            if (!element) {
                console.warn(`Menu item #${menuId} not found`);
                return;
            }
            
            // Skip if already fixed
            if (element._fixed) {
                console.log(`Menu item #${menuId} already fixed`);
                return;
            }
            
            // Clone the element to remove existing event listeners
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // Add new event listener with error handling
            newElement.addEventListener('click', function(e) {
                e.preventDefault();
                
                try {
                    console.log(`Clicked on ${menuId}, calling ${funcName}...`);
                    
                    // Check if function exists
                    if (typeof window[funcName] !== 'function') {
                        throw new Error(`${funcName} is not defined`);
                    }
                    
                    // Call the function to create the panel
                    const panel = window[funcName]();
                    
                    if (!panel) {
                        throw new Error(`${funcName} did not return a valid panel`);
                    }
                    
                    console.log(`Successfully created panel using ${funcName}`);
                } catch (error) {
                    console.error(`Error creating panel: ${error.message}`);
                    alert(`Failed to create panel: ${error.message}`);
                    
                    // Try to create a fallback error panel
                    try {
                        if (typeof window.createPanel === 'function') {
                            const errorPanel = window.createPanel('Error');
                            if (errorPanel && errorPanel.querySelector) {
                                const content = errorPanel.querySelector('.panel-content');
                                if (content) {
                                    content.innerHTML = `
                                        <div style="color: #ff3333; padding: 10px;">
                                            <p><strong>Error creating panel:</strong></p>
                                            <p>${error.message}</p>
                                            <p>Please check the browser console for more details.</p>
                                        </div>
                                    `;
                                }
                            }
                        }
                    } catch (fallbackError) {
                        console.error('Error creating fallback panel:', fallbackError);
                    }
                }
            });
            
            // Mark as fixed
            newElement._fixed = true;
            console.log(`Added safe event handler to #${menuId}`);
        });
    }
    
    // Fix for layout-save-improved.js notification container
    function fixLayoutSaveImproved() {
        // Check if the layout save module is available
        if (window.CyberpunkGM && window.CyberpunkGM.Layout) {
            console.log('Fixing layout-save-improved.js notification container');
            
            const layoutModule = window.CyberpunkGM.Layout;
            
            // Fix the notification initialization function
            const originalInitNotifications = layoutModule.initNotifications;
            
            layoutModule.initNotifications = function() {
                try {
                    // Create container if it doesn't exist
                    if (!this.notificationContainer) {
                        this.notificationContainer = document.createElement('div');
                        this.notificationContainer.className = 'cp-notifications';
                        this.notificationContainer.style.position = 'fixed';
                        this.notificationContainer.style.bottom = '20px';
                        this.notificationContainer.style.right = '20px';
                        this.notificationContainer.style.zIndex = '9999';
                    }
                    
                    // Add the container to document.body if it exists
                    if (document.body) {
                        document.body.appendChild(this.notificationContainer);
                    } else {
                        console.warn('document.body not available for notification container');
                        // Defer the append until body is available
                        window.addEventListener('DOMContentLoaded', () => {
                            document.body.appendChild(this.notificationContainer);
                        });
                    }
                    
                    // Add styles for notifications
                    const style = document.createElement('style');
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
                            border-left: 4px solid #cc3333;
                        }
                        .cp-notification-info {
                            border-left: 4px solid #3399ff;
                        }
                        @keyframes cp-notification-fade {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `;
                    
                    if (document.head) {
                        document.head.appendChild(style);
                    }
                    
                    console.log('Notification system initialized');
                } catch (error) {
                    console.error('Error initializing notifications:', error);
                }
            };
            
            // Try to initialize notifications now
            try {
                layoutModule.initNotifications();
            } catch (error) {
                console.error('Error calling initNotifications:', error);
            }
        }
    }
    
    // Fix all the things
    window.addEventListener('load', function() {
        // Wait a bit to make sure everything is loaded
        setTimeout(() => {
            try {
                fixLayoutSaveImproved();
            } catch (error) {
                console.error('Error fixing layout save notifications:', error);
            }
        }, 1500);
    });
})();