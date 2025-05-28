/**
 * Panel Implementations for app-modern.html
 * This file provides the implementations for the panel creation functions referenced in app-modern.html
 * 
 * FIXED VERSION: Prevents duplicate panels and ensures proper positioning
 */

// Store a reference to the createPanel function from the parent window
let createPanelFunction = null;

// Track whether we're using the module or direct implementation
let usingModuleImplementation = false;

// When the module is loaded, set this flag to true
document.addEventListener('DOMContentLoaded', function() {
    // Check if the CyberpunkGM global object is defined with required functionality
    if (typeof CyberpunkGM !== 'undefined' && CyberpunkGM.createPanel) {
        usingModuleImplementation = true;
        console.log('Using CyberpunkGM module implementation for panels');
    } else {
        console.log('Using direct implementation for panels');
        
        // Get createPanel function from parent window
        if (typeof window.createPanel === 'function') {
            createPanelFunction = window.createPanel;
            console.log('Successfully imported createPanel function from parent window');
        } else {
            console.error('Could not find createPanel function in parent window');
        }
        
        // Expose panel functions to window for app-modern.html to use
        window.createInitiativePanel = createInitiativePanel;
        window.createTimerPanel = createTimerPanel;
        window.createCalculatorPanel = createCalculatorPanel;
        window.createWeaponsPanel = createWeaponsPanel;
        window.createArmorPanel = createArmorPanel;
        window.createCriticalInjuryPanel = createCriticalInjuryPanel;
        window.createNetrunningPanel = createNetrunningPanel;
        window.createCharacterPanel = createCharacterPanel;
        window.createNPCPanel = createNPCPanel;
        window.createLootPanel = createLootPanel;
        window.createMapPanel = createMapPanel;
        window.createLocationPanel = createLocationPanel;
        window.createEncounterPanel = createEncounterPanel;
        window.createAdvancedEncounterPanel = createAdvancedEncounterPanel;
        window.createNotesPanel = createNotesPanel;
        window.createLoreBrowserPanel = createLoreBrowserPanel;
    }
});

// Count panel creation attempts to prevent infinite recursion
let panelCreationAttempts = 0;
const MAX_PANEL_ATTEMPTS = 3;

// Standalone Panel Implementation
// This function creates panels without relying on any external functions or references
function createBasicPanel(title) {
    console.log('Creating basic panel with title:', title);
    
    // Create a simple panel element with minimal functionality
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.style.position = 'absolute';
    panel.style.left = '20px';
    panel.style.top = '20px';
    panel.style.zIndex = '1000';
    panel.style.width = '300px';
    panel.style.height = '200px';
    panel.style.backgroundColor = 'rgba(30, 30, 45, 0.85)';
    panel.style.border = '1px solid #00ccff';
    panel.style.borderRadius = '4px';
    panel.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    panel.style.overflow = 'hidden';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.id = 'panel-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    panel.innerHTML = `
        <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center; 
             padding: 8px; background-color: rgba(10, 10, 20, 0.8); cursor: move; border-bottom: 1px solid #00ccff;">
            <div>${title}</div>
            <button class="close-button" style="background: none; border: none; color: #e0e0e0; 
                   font-size: 18px; cursor: pointer;">&times;</button>
        </div>
        <div class="panel-content" style="flex: 1; overflow: auto; padding: 10px;"></div>
        <div class="resize-handle" style="position: absolute; bottom: 0; right: 0; width: 15px; 
             height: 15px; cursor: nwse-resize;"></div>
    `;
    
    document.body.appendChild(panel);
    
    // Add minimal close functionality
    panel.querySelector('.close-button').addEventListener('click', function() {
        panel.remove();
    });
    
    // Add dragging functionality
    const header = panel.querySelector('.panel-header');
    header.addEventListener('mousedown', function(e) {
        e.preventDefault();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = parseInt(panel.style.left) || 20;
        const startTop = parseInt(panel.style.top) || 20;
        
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
    
    return panel;
}

// This function tries to use the imported function first, with a fallback to our basic implementation
function createPanel(title) {
    console.log(`Creating panel "${title}" (attempt ${panelCreationAttempts + 1}/${MAX_PANEL_ATTEMPTS})`);
    
    // Check creation attempts to prevent infinite recursion
    if (panelCreationAttempts >= MAX_PANEL_ATTEMPTS) {
        console.error(`Maximum panel creation attempts (${MAX_PANEL_ATTEMPTS}) reached for panel "${title}". Using emergency fallback.`);
        // Reset counter for next panel creation
        panelCreationAttempts = 0; 
        return createBasicPanel(title + ' (Emergency Fallback)');
    }
    
    // Increment attempts counter
    panelCreationAttempts++;
    
    try {
        // First try the imported function if available
        if (createPanelFunction) {
            console.log('Using imported createPanelFunction');
            const panel = createPanelFunction(title);
            // Reset attempts counter on success
            panelCreationAttempts = 0;
            return panel;
        }
        
        // If we don't have an imported function, use our basic implementation
        console.log('No imported function available, using basic panel implementation');
        const panel = createBasicPanel(title);
        // Reset attempts counter on success
        panelCreationAttempts = 0;
        return panel;
    } catch (error) {
        console.error('Error creating panel:', error);
        // If we've reached the max attempts, use the emergency fallback
        if (panelCreationAttempts >= MAX_PANEL_ATTEMPTS) {
            console.error('Maximum attempts reached after error, using emergency fallback');
            panelCreationAttempts = 0;
            return createBasicPanel(title + ' (Emergency Fallback)');
        }
        
        // Otherwise, try again with an incremented counter
        console.log('Retrying panel creation');
        return createPanel(title);
    }
}

// Explicitly expose createPanel to window
window.createPanel = createPanel;

// Helper function to safely create panels
function safeCreatePanel(factory) {
    // If module implementation is being used, don't create duplicate panels
    if (usingModuleImplementation) {
        console.log('Module implementation taking precedence - skipping direct panel creation');
        return null;
    }
    
    try {
        // Get the panel from the factory function
        const panel = factory();
        
        // Log success or failure
        if (panel) {
            console.log(`Panel created successfully: ${panel.querySelector('.panel-header div')?.textContent || 'Unknown'}`);
        } else {
            console.warn('Failed to create panel');
        }
        
        return panel;
    } catch (error) {
        console.error('Error in safeCreatePanel:', error);
        return null;
    }
}

// Explicitly expose safeCreatePanel to window
window.safeCreatePanel = safeCreatePanel;

// Create proper function references before exposing them
const initPanelFunc = createInitiativePanel;
const timerPanelFunc = createTimerPanel;
const calcPanelFunc = createCalculatorPanel;
const weaponsPanelFunc = createWeaponsPanel;
const armorPanelFunc = createArmorPanel;
const criticalPanelFunc = createCriticalInjuryPanel;
const netrunningPanelFunc = createNetrunningPanel;
const characterPanelFunc = createCharacterPanel;
const npcPanelFunc = createNPCPanel;
const lootPanelFunc = createLootPanel;
const mapPanelFunc = createMapPanel;
const locationPanelFunc = createLocationPanel;
const encounterPanelFunc = createEncounterPanel;
// createNotesPanel is defined separately below

// Immediately expose the functions to the window object
window.createInitiativePanel = initPanelFunc;
window.createTimerPanel = timerPanelFunc;
window.createCalculatorPanel = calcPanelFunc;
window.createWeaponsPanel = weaponsPanelFunc;
window.createArmorPanel = armorPanelFunc;
window.createCriticalInjuryPanel = criticalPanelFunc;
window.createNetrunningPanel = netrunningPanelFunc;
window.createCharacterPanel = characterPanelFunc;
window.createNPCPanel = npcPanelFunc;
window.createLootPanel = lootPanelFunc;
window.createMapPanel = mapPanelFunc;
window.createLocationPanel = locationPanelFunc;
window.createEncounterPanel = encounterPanelFunc;
// window.createNotesPanel is declared below to prevent circular reference

// Initiative Tracker Panel
function createInitiativePanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Initiative Tracker');
        const content = panel.querySelector('.panel-content');
        
        content.innerHTML = `
            <div class="initiative-controls">
                <button id="init-add-${panel.id}">Add Character</button>
                <button id="init-clear-${panel.id}">Clear</button>
                <button id="init-sort-${panel.id}">Sort</button>
            </div>
            <div class="initiative-list">
                <ul id="initiative-tracker-${panel.id}"></ul>
            </div>
        `;
        
        // Add functionality to buttons - use unique IDs
        const addButton = content.querySelector(`#init-add-${panel.id}`);
        const clearButton = content.querySelector(`#init-clear-${panel.id}`);
        const sortButton = content.querySelector(`#init-sort-${panel.id}`);
        const trackerList = content.querySelector(`#initiative-tracker-${panel.id}`);
        
        addButton.addEventListener('click', function() {
            const character = prompt('Character name:');
            if (!character) return;
            
            const initiative = parseInt(prompt('Initiative roll (1d10 + REF + modifiers):'));
            if (isNaN(initiative)) return;
            
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="init-score">${initiative}</span>
                <span class="init-name">${character}</span>
                <button class="init-remove">&times;</button>
            `;
            
            // Add remove functionality
            listItem.querySelector('.init-remove').addEventListener('click', function() {
                listItem.remove();
            });
            
            trackerList.appendChild(listItem);
        });
        
        clearButton.addEventListener('click', function() {
            trackerList.innerHTML = '';
        });
        
        sortButton.addEventListener('click', function() {
            const items = Array.from(trackerList.querySelectorAll('li'));
            
            items.sort((a, b) => {
                const aScore = parseInt(a.querySelector('.init-score').textContent);
                const bScore = parseInt(b.querySelector('.init-score').textContent);
                return bScore - aScore; // Sort high to low
            });
            
            // Clear and re-add sorted items
            trackerList.innerHTML = '';
            items.forEach(item => trackerList.appendChild(item));
        });
        
        return panel;
    });
}

// Game Timer Panel
function createTimerPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Game Timer');
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="timer-display" id="timer-display-${panelId}">00:00:00</div>
            <div class="timer-controls">
                <button id="timer-start-${panelId}">Start</button>
                <button id="timer-pause-${panelId}">Pause</button>
                <button id="timer-reset-${panelId}">Reset</button>
            </div>
            <div class="timer-notes">
                <input type="text" id="timer-note-${panelId}" placeholder="Add time note...">
                <button id="timer-add-note-${panelId}">Add</button>
            </div>
            <div class="timer-log" id="timer-log-${panelId}"></div>
        `;
        
        // Timer variables - store on the panel element to avoid global conflicts
        panel.timerData = {
            seconds: 0,
            timerInterval: null,
            isRunning: false
        };
        
        // Format time as HH:MM:SS
        const formatTime = (seconds) => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return [h, m, s].map(v => v < 10 ? "0" + v : v).join(':');
        };
        
        // Update the timer display
        const updateTimer = () => {
            content.querySelector(`#timer-display-${panelId}`).textContent = formatTime(panel.timerData.seconds);
        };
        
        // Add event listeners to buttons
        content.querySelector(`#timer-start-${panelId}`).addEventListener('click', function() {
            if (panel.timerData.isRunning) return;
            
            panel.timerData.isRunning = true;
            panel.timerData.timerInterval = setInterval(() => {
                panel.timerData.seconds++;
                updateTimer();
            }, 1000);
        });
        
        content.querySelector(`#timer-pause-${panelId}`).addEventListener('click', function() {
            if (!panel.timerData.isRunning) return;
            
            panel.timerData.isRunning = false;
            clearInterval(panel.timerData.timerInterval);
        });
        
        content.querySelector(`#timer-reset-${panelId}`).addEventListener('click', function() {
            panel.timerData.isRunning = false;
            clearInterval(panel.timerData.timerInterval);
            panel.timerData.seconds = 0;
            updateTimer();
            content.querySelector(`#timer-log-${panelId}`).innerHTML = '';
        });
        
        content.querySelector(`#timer-add-note-${panelId}`).addEventListener('click', function() {
            const noteInput = content.querySelector(`#timer-note-${panelId}`);
            const note = noteInput.value.trim();
            
            if (note) {
                const logItem = document.createElement('div');
                logItem.className = 'timer-log-item';
                logItem.innerHTML = `
                    <span class="timer-log-time">${formatTime(panel.timerData.seconds)}</span>
                    <span class="timer-log-text">${note}</span>
                `;
                
                content.querySelector(`#timer-log-${panelId}`).prepend(logItem);
                noteInput.value = '';
            }
        });
        
        return panel;
    });
}

// Calculator Panel
function createCalculatorPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Calculator');
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="calculator">
                <input type="text" id="calc-display-${panelId}" class="calc-display" readonly>
                <div class="calc-buttons">
                    <button class="calc-btn calc-clear">C</button>
                    <button class="calc-btn calc-op">(</button>
                    <button class="calc-btn calc-op">)</button>
                    <button class="calc-btn calc-op">/</button>
                    
                    <button class="calc-btn calc-num">7</button>
                    <button class="calc-btn calc-num">8</button>
                    <button class="calc-btn calc-num">9</button>
                    <button class="calc-btn calc-op">*</button>
                    
                    <button class="calc-btn calc-num">4</button>
                    <button class="calc-btn calc-num">5</button>
                    <button class="calc-btn calc-num">6</button>
                    <button class="calc-btn calc-op">-</button>
                    
                    <button class="calc-btn calc-num">1</button>
                    <button class="calc-btn calc-num">2</button>
                    <button class="calc-btn calc-num">3</button>
                    <button class="calc-btn calc-op">+</button>
                    
                    <button class="calc-btn calc-num">0</button>
                    <button class="calc-btn calc-op">.</button>
                    <button class="calc-btn calc-equal">=</button>
                    <button class="calc-btn calc-op">d</button>
                </div>
            </div>
        `;
        
        const display = content.querySelector(`#calc-display-${panelId}`);
        
        // Add event listeners for calculator buttons
        content.querySelectorAll('.calc-btn').forEach(button => {
            button.addEventListener('click', function() {
                const value = this.textContent;
                
                if (value === 'C') {
                    display.value = '';
                } else if (value === '=') {
                    try {
                        let expression = display.value;
                        // Handle dice notation (e.g., 3d6)
                        if (expression.includes('d')) {
                            expression = expression.replace(/(\d+)d(\d+)/g, (match, count, sides) => {
                                let total = 0;
                                for (let i = 0; i < parseInt(count); i++) {
                                    total += Math.floor(Math.random() * parseInt(sides)) + 1;
                                }
                                return total;
                            });
                        }
                        
                        // Calculate the result
                        display.value = eval(expression);
                    } catch (error) {
                        display.value = 'Error';
                    }
                } else if (value === 'd') {
                    display.value += 'd';
                } else {
                    display.value += value;
                }
            });
        });
        
        return panel;
    });
}

// Weapons Table Panel
function createWeaponsPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Weapons Table');
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="weapons-table">
                <input type="text" id="weapons-filter-${panelId}" placeholder="Filter weapons...">
                <div class="weapons-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Weapon</th>
                                <th>Type</th>
                                <th>DMG</th>
                                <th>ROF</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Medium Pistol</td>
                                <td>P</td>
                                <td>2d6</td>
                                <td>2</td>
                                <td>Standard sidearm</td>
                            </tr>
                            <tr>
                                <td>Heavy Pistol</td>
                                <td>P</td>
                                <td>3d6</td>
                                <td>2</td>
                                <td>Stopping power</td>
                            </tr>
                            <tr>
                                <td>Very Heavy Pistol</td>
                                <td>P</td>
                                <td>4d6</td>
                                <td>1</td>
                                <td>High recoil</td>
                            </tr>
                            <tr>
                                <td>SMG</td>
                                <td>P</td>
                                <td>2d6</td>
                                <td>4</td>
                                <td>Autofire 3/4/5</td>
                            </tr>
                            <tr>
                                <td>Assault Rifle</td>
                                <td>R</td>
                                <td>5d6</td>
                                <td>4</td>
                                <td>Autofire 3/4/5</td>
                            </tr>
                            <tr>
                                <td>Shotgun</td>
                                <td>S</td>
                                <td>5d6</td>
                                <td>1</td>
                                <td>Close quarters</td>
                            </tr>
                            <tr>
                                <td>Sniper Rifle</td>
                                <td>R</td>
                                <td>5d6</td>
                                <td>1</td>
                                <td>Excellent range</td>
                            </tr>
                            <tr>
                                <td>Combat Knife</td>
                                <td>M</td>
                                <td>1d6</td>
                                <td>2</td>
                                <td>Concealable</td>
                            </tr>
                            <tr>
                                <td>Monowire</td>
                                <td>M</td>
                                <td>3d6</td>
                                <td>1</td>
                                <td>Requires Cyberarm</td>
                            </tr>
                            <tr>
                                <td>Grenade</td>
                                <td>E</td>
                                <td>6d6</td>
                                <td>1</td>
                                <td>10m radius</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Add filter functionality
        const filterInput = content.querySelector(`#weapons-filter-${panelId}`);
        filterInput.addEventListener('input', function() {
            const filterValue = this.value.toLowerCase();
            const rows = content.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
        
        return panel;
    });
}

// Armor Table Panel
function createArmorPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Armor Table');
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="armor-table">
                <input type="text" id="armor-filter-${panelId}" placeholder="Filter armor...">
                <div class="armor-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Armor</th>
                                <th>SP</th>
                                <th>EV Penalty</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Leather</td>
                                <td>4</td>
                                <td>0</td>
                                <td>Stylish</td>
                            </tr>
                            <tr>
                                <td>Kevlar</td>
                                <td>7</td>
                                <td>0</td>
                                <td>Common</td>
                            </tr>
                            <tr>
                                <td>Light Armorjack</td>
                                <td>11</td>
                                <td>0</td>
                                <td>Standard protection</td>
                            </tr>
                            <tr>
                                <td>Medium Armorjack</td>
                                <td>12</td>
                                <td>-2</td>
                                <td>Popular with police</td>
                            </tr>
                            <tr>
                                <td>Heavy Armorjack</td>
                                <td>13</td>
                                <td>-2</td>
                                <td>Military grade</td>
                            </tr>
                            <tr>
                                <td>Flak</td>
                                <td>15</td>
                                <td>-3</td>
                                <td>Bulky</td>
                            </tr>
                            <tr>
                                <td>Metalgear</td>
                                <td>18</td>
                                <td>-4</td>
                                <td>Very Heavy</td>
                            </tr>
                            <tr>
                                <td>Bodyweight Suit</td>
                                <td>7</td>
                                <td>0</td>
                                <td>Concealable</td>
                            </tr>
                            <tr>
                                <td>Bulletproof Shield</td>
                                <td>10</td>
                                <td>-1</td>
                                <td>One-handed</td>
                            </tr>
                            <tr>
                                <td>Subdermal Armor</td>
                                <td>+2</td>
                                <td>0</td>
                                <td>Cyberware (HC 7)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Add filter functionality
        const filterInput = content.querySelector(`#armor-filter-${panelId}`);
        filterInput.addEventListener('input', function() {
            const filterValue = this.value.toLowerCase();
            const rows = content.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
        
        return panel;
    });
}

// Critical Injury Panel
function createCriticalInjuryPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Critical Injuries');
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="critical-injuries">
                <div class="critical-controls">
                    <button id="roll-critical-${panelId}">Roll Critical</button>
                    <select id="critical-location-${panelId}">
                        <option value="head">Head</option>
                        <option value="torso">Torso</option>
                        <option value="right-arm">Right Arm</option>
                        <option value="left-arm">Left Arm</option>
                        <option value="right-leg">Right Leg</option>
                        <option value="left-leg">Left Leg</option>
                    </select>
                </div>
                <div id="critical-result-${panelId}" class="critical-result">
                    Select a location and roll
                </div>
            </div>
        `;
        
        // Critical injury tables
        const criticalTables = {
            'head': [
                { roll: '1-3', injury: 'Brain damage', effect: 'DV15 Resist Torture check or -2 to all Actions', time: '1 week' },
                { roll: '4-6', injury: 'Damaged eye', effect: 'DV15 Resist Torture check or -2 to all Ranged Attacks', time: '1 week' },
                { roll: '7-8', injury: 'Concussion', effect: '-2 to all Actions', time: '1d6 days' },
                { roll: '9-10', injury: 'Broken jaw/nose', effect: 'Only able to speak painfully, no verbal communication', time: '2d6 days' }
            ],
            'torso': [
                { roll: '1-3', injury: 'Broken ribs', effect: 'DV15 Resist Torture check or -2 to all Actions', time: '1 week' },
                { roll: '4-6', injury: 'Damaged kidney/liver', effect: 'DV15 Resist Torture check each day or lose 1 HP', time: '1 week' },
                { roll: '7-8', injury: 'Spinal injury', effect: '-2 to all Actions', time: '1d6 days' },
                { roll: '9-10', injury: 'Internal bleeding', effect: 'Lose 2 HP per day', time: '3 days or until surgery' }
            ],
            'right-arm': [
                { roll: '1-3', injury: 'Broken arm', effect: 'Unusable', time: '1 week' },
                { roll: '4-6', injury: 'Damaged hand', effect: '-4 to all Actions with that hand', time: '1 week' },
                { roll: '7-8', injury: 'Severed tendon', effect: '-2 to all Actions with that arm', time: '1d6 days' },
                { roll: '9-10', injury: 'Deep cut', effect: '-2 to all Actions with that arm', time: '1 day' }
            ],
            'left-arm': [
                { roll: '1-3', injury: 'Broken arm', effect: 'Unusable', time: '1 week' },
                { roll: '4-6', injury: 'Damaged hand', effect: '-4 to all Actions with that hand', time: '1 week' },
                { roll: '7-8', injury: 'Severed tendon', effect: '-2 to all Actions with that arm', time: '1d6 days' },
                { roll: '9-10', injury: 'Deep cut', effect: '-2 to all Actions with that arm', time: '1 day' }
            ],
            'right-leg': [
                { roll: '1-3', injury: 'Broken leg', effect: 'MOVE reduced to 1', time: '1 week' },
                { roll: '4-6', injury: 'Damaged knee', effect: '-4 to all Actions involving movement', time: '1 week' },
                { roll: '7-8', injury: 'Severed tendon', effect: '-2 to all Actions involving movement', time: '1d6 days' },
                { roll: '9-10', injury: 'Deep cut', effect: '-2 to all Actions involving movement', time: '1 day' }
            ],
            'left-leg': [
                { roll: '1-3', injury: 'Broken leg', effect: 'MOVE reduced to 1', time: '1 week' },
                { roll: '4-6', injury: 'Damaged knee', effect: '-4 to all Actions involving movement', time: '1 week' },
                { roll: '7-8', injury: 'Severed tendon', effect: '-2 to all Actions involving movement', time: '1d6 days' },
                { roll: '9-10', injury: 'Deep cut', effect: '-2 to all Actions involving movement', time: '1 day' }
            ]
        };
        
        // Roll critical injury function
        content.querySelector(`#roll-critical-${panelId}`).addEventListener('click', function() {
            const location = content.querySelector(`#critical-location-${panelId}`).value;
            const roll = Math.floor(Math.random() * 10) + 1;
            
            let injury = null;
            
            // Find the injury based on roll
            criticalTables[location].forEach(entry => {
                const range = entry.roll.split('-');
                if (roll >= parseInt(range[0]) && roll <= parseInt(range[1])) {
                    injury = entry;
                }
            });
            
            if (injury) {
                content.querySelector(`#critical-result-${panelId}`).innerHTML = `
                    <div class="critical-header">${injury.injury}</div>
                    <div class="critical-details">
                        <div><strong>Roll:</strong> ${roll} (${injury.roll})</div>
                        <div><strong>Location:</strong> ${location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                        <div><strong>Effect:</strong> ${injury.effect}</div>
                        <div><strong>Duration:</strong> ${injury.time}</div>
                    </div>
                `;
            }
        });
        
        return panel;
    });
}

// Netrunning Panel
function createNetrunningPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Netrunning');
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="netrunning-panel">
                <div class="netrunning-tabs">
                    <button class="net-tab active" data-tab="programs-${panelId}">Programs</button>
                    <button class="net-tab" data-tab="actions-${panelId}">Actions</button>
                    <button class="net-tab" data-tab="combat-${panelId}">NET Combat</button>
                </div>
                
                <div class="netrunning-content">
                    <div id="programs-tab-${panelId}" class="net-tab-content active">
                        <h3>Netrunner Programs</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Program</th>
                                    <th>Effect</th>
                                    <th>Class</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Sword</td>
                                    <td>Attack Program (4d6 damage)</td>
                                    <td>Attacker</td>
                                </tr>
                                <tr>
                                    <td>Hellbolt</td>
                                    <td>Attack Program (3d6 damage, ignores defenses)</td>
                                    <td>Attacker</td>
                                </tr>
                                <tr>
                                    <td>Armor</td>
                                    <td>Reduce incoming damage by 4 points</td>
                                    <td>Defender</td>
                                </tr>
                                <tr>
                                    <td>Shield</td>
                                    <td>Reduces all NET damage by half</td>
                                    <td>Defender</td>
                                </tr>
                                <tr>
                                    <td>Worm</td>
                                    <td>Reduces defense value by 1d6 per turn</td>
                                    <td>Booster</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div id="actions-tab-${panelId}" class="net-tab-content">
                        <h3>Netrunner Actions</h3>
                        <ul class="netrunning-list">
                            <li><strong>Jack In:</strong> Enter the NET architecture</li>
                            <li><strong>Jack Out:</strong> Exit the NET architecture</li>
                            <li><strong>Move:</strong> Move between floors of architecture</li>
                            <li><strong>Backdoor:</strong> Bypass a Password</li>
                            <li><strong>Scanner:</strong> Detect Control Nodes and Ice</li>
                            <li><strong>Pathfinder:</strong> Discover structure of architecture</li>
                            <li><strong>Slide:</strong> Slip past ICE undetected</li>
                            <li><strong>Cloak:</strong> Become invisible to Black ICE</li>
                            <li><strong>Control:</strong> Manipulate connected devices</li>
                        </ul>
                    </div>
                    
                    <div id="combat-tab-${panelId}" class="net-tab-content">
                        <h3>NET Combat Reference</h3>
                        <div class="netcombat-steps">
                            <div><strong>1.</strong> Roll Initiative (d10 + Interface + 1d6 for Speedy Gonzalvez)</div>
                            <div><strong>2.</strong> Runners take 3 NET Actions per turn</div>
                            <div><strong>3.</strong> ICE takes actions after Netrunners</div>
                            <div><strong>4.</strong> Program damage ignores Humanity, Armor, etc.</div>
                            <div><strong>5.</strong> Black ICE damages the runner directly</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Tab functionality - fixed to use proper IDs
        content.querySelectorAll('.net-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // Deactivate all tabs
                content.querySelectorAll('.net-tab').forEach(t => t.classList.remove('active'));
                content.querySelectorAll('.net-tab-content').forEach(c => c.classList.remove('active'));
                
                // Activate selected tab
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                content.querySelector(`#${tabId.split('-')[0]}-tab-${panelId}`).classList.add('active');
            });
        });
        
        return panel;
    });
}

// Character Panel
function createCharacterPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Character Sheet');
        panel.style.width = '500px';
        panel.style.height = '600px';
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="character-sheet">
                <input type="text" class="character-name" placeholder="Character Name">
                
                <div class="character-stats">
                    <div class="stats-column">
                        <div><strong>Stats</strong></div>
                        <div>INT: <input type="number" class="stat-input" min="1" max="10" value="5"></div>
                        <div>REF: <input type="number" class="stat-input" min="1" max="10" value="5"></div>
                        <div>DEX: <input type="number" class="stat-input" min="1" max="10" value="5"></div>
                        <div>TECH: <input type="number" class="stat-input" min="1" max="10" value="5"></div>
                        <div>COOL: <input type="number" class="stat-input" min="1" max="10" value="5"></div>
                        <div>WILL: <input type="number" class="stat-input" min="1" max="10" value="5"></div>
                        <div>LUCK: <input type="number" class="stat-input" min="1" max="10" value="5"></div>
                        <div>MOVE: <input type="number" class="stat-input" min="1" max="10" value="5"></div>
                        <div>BODY: <input type="number" id="body-stat-${panelId}" class="stat-input" min="1" max="10" value="5"></div>
                        <div>EMP: <input type="number" class="stat-input" min="1" max="10" value="5"></div>
                    </div>
                    
                    <div class="derived-column">
                        <div><strong>Derived Stats</strong></div>
                        <div>HP: <span id="hp-calc-${panelId}">35</span></div>
                        <div>Humanity: <span id="humanity-calc-${panelId}">50</span></div>
                        <div><strong>Current Status</strong></div>
                        <div>HP: <input type="number" id="current-hp-${panelId}" value="35"></div>
                        <div>Armor: <input type="number" id="armor-sp-${panelId}" value="11"></div>
                    </div>
                </div>
                
                <div class="character-section">
                    <div><strong>Skills</strong> (Add comma-separated list)</div>
                    <textarea class="character-skills">Handgun +5, Stealth +3, Athletics +4, Perception +4, Conversation +3, Brawling +2, Education +2, Streetwise +4</textarea>
                </div>
                
                <div class="character-section">
                    <div><strong>Weapons</strong> (Add comma-separated list)</div>
                    <textarea class="character-weapons">Medium Pistol (2d6), Combat Knife (1d6), Heavy Pistol (3d6)</textarea>
                </div>
                
                <div class="character-section">
                    <div><strong>Cyberware & Gear</strong> (Add comma-separated list)</div>
                    <textarea class="character-gear">Cybereye (Infrared), Light Armorjack (SP11), Agent (Pocket AI), Medscanner</textarea>
                </div>
            </div>
        `;
        
        // Add HP calculation based on BODY stat
        const bodyInput = content.querySelector(`#body-stat-${panelId}`);
        const hpCalc = content.querySelector(`#hp-calc-${panelId}`);
        const currentHP = content.querySelector(`#current-hp-${panelId}`);
        
        bodyInput.addEventListener('change', function() {
            const bodyValue = parseInt(this.value) || 5;
            const hp = 10 + (bodyValue * 5);
            
            hpCalc.textContent = hp;
            currentHP.value = hp;
        });
        
        return panel;
    });
}

// NPC Generator Panel
function createNPCPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('NPC Generator');
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="npc-generator">
                <div class="generator-controls">
                    <button id="generate-npc-${panelId}">Generate NPC</button>
                    <select id="npc-type-${panelId}">
                        <option value="ganger">Ganger</option>
                        <option value="corp">Corporate</option>
                        <option value="fixer">Fixer</option>
                        <option value="nomad">Nomad</option>
                        <option value="netrunner">Netrunner</option>
                    </select>
                </div>
                <div id="npc-result-${panelId}" class="npc-result">
                    Click to generate an NPC
                </div>
            </div>
        `;
        
        // NPC data
        const npcData = {
            ganger: {
                names: ['Spike', 'Razor', 'Blade', 'Viper', 'Fang', 'Jagged', 'Ripper', 'Brick', 'Chains', 'Diesel'],
                stats: 'BODY 7, REF 6, COOL 5, TECH 3, INT 4',
                gear: 'SMG, Armored Jacket, Knife, Stim Injectors',
                traits: 'Aggressive, Territorial, Gang Tattoos, Quick to Violence'
            },
            corp: {
                names: ['Jenkins', 'Blake', 'Morgan', 'Price', 'Harper', 'Takeda', 'Chavez', 'Chen', 'Johnson', 'Wilson'],
                stats: 'INT 7, COOL 6, TECH 5, REF 4, WILL 6',
                gear: 'Light Pistol, Business Attire, Cyberware Comms, Agent',
                traits: 'Analytical, Corporate Loyalty, Arrogant, Well-Connected'
            },
            fixer: {
                names: ['Duke', 'Shadow', 'Lotus', 'Broker', 'Link', 'Socket', 'Dealer', 'Middleman', 'Contact', 'Fuse'],
                stats: 'INT 6, COOL 7, EMP 6, TECH 5, LUCK 6',
                gear: 'Concealable Pistol, Armored Clothing, Multiple Agents, Cyberdeck',
                traits: 'Well-Connected, Cautious, Always Has a Deal, Information Broker'
            },
            nomad: {
                names: ['Dust', 'Wanderer', 'Hawk', 'Sierra', 'Ranger', 'Drifter', 'Roaddog', 'Coyote', 'Pathfinder', 'Storm'],
                stats: 'BODY 6, REF 6, TECH 6, WILL 5, MOVE 6',
                gear: 'Shotgun/Rifle, Rugged Clothing, Vehicle Tools, Med Pack',
                traits: 'Self-Reliant, Family-Oriented, Resourceful, Knows the Badlands'
            },
            netrunner: {
                names: ['Bit', 'Circuit', 'Echo', 'Proxy', 'Glitch', 'Static', 'Cipher', 'Vector', 'Null', 'Syn'],
                stats: 'INT 7, TECH 7, REF 5, COOL 4, LUCK 5',
                gear: 'Cyberdeck, Holdout Pistol, Interface Plugs, Neural Link',
                traits: 'Analytical, Introverted, Paranoid, Digital Expertise'
            }
        };
        
        // Generate NPC
        content.querySelector(`#generate-npc-${panelId}`).addEventListener('click', function() {
            const type = content.querySelector(`#npc-type-${panelId}`).value;
            const data = npcData[type];
            
            // Generate random name
            const name = data.names[Math.floor(Math.random() * data.names.length)];
            
            // Generate result
            content.querySelector(`#npc-result-${panelId}`).innerHTML = `
                <div class="npc-name">${name}</div>
                <div class="npc-type-label">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="npc-stats"><strong>Stats:</strong> ${data.stats}</div>
                <div class="npc-gear"><strong>Gear:</strong> ${data.gear}</div>
                <div class="npc-traits"><strong>Traits:</strong> ${data.traits}</div>
            `;
        });
        
        return panel;
    });
}

// Loot Generator Panel
function createLootPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Loot Generator');
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="loot-generator">
                <div class="generator-controls">
                    <button id="generate-loot-${panelId}">Generate Loot</button>
                    <select id="loot-quality-${panelId}">
                        <option value="poor">Poor</option>
                        <option value="standard" selected>Standard</option>
                        <option value="good">Good</option>
                        <option value="excellent">Excellent</option>
                    </select>
                </div>
                <div id="loot-result-${panelId}" class="loot-result">
                    Click to generate loot
                </div>
            </div>
        `;
        
        // Loot tables
        const lootTables = {
            weapons: [
                { item: 'Medium Pistol', value: '50eb', quality: 'poor' },
                { item: 'Heavy Pistol', value: '100eb', quality: 'standard' },
                { item: 'Very Heavy Pistol', value: '100eb', quality: 'standard' },
                { item: 'SMG', value: '100eb', quality: 'standard' },
                { item: 'Heavy SMG', value: '100eb', quality: 'standard' },
                { item: 'Assault Rifle', value: '500eb', quality: 'good' },
                { item: 'Sniper Rifle', value: '500eb', quality: 'good' },
                { item: 'Shotgun', value: '500eb', quality: 'good' },
                { item: 'Combat Knife', value: '50eb', quality: 'poor' },
                { item: 'Excellent Quality Weapon (any)', value: '1000eb', quality: 'excellent' }
            ],
            armor: [
                { item: 'Leather', value: '20eb', quality: 'poor' },
                { item: 'Kevlar', value: '50eb', quality: 'standard' },
                { item: 'Light Armorjack', value: '100eb', quality: 'standard' },
                { item: 'Medium Armorjack', value: '500eb', quality: 'good' },
                { item: 'Heavy Armorjack', value: '1000eb', quality: 'good' },
                { item: 'Flak', value: '1000eb', quality: 'good' },
                { item: 'Metalgear', value: '5000eb', quality: 'excellent' }
            ],
            cyberware: [
                { item: 'Cybereye (Basic)', value: '100eb', quality: 'standard' },
                { item: 'Cyberaudio Suite', value: '500eb', quality: 'standard' },
                { item: 'Neural Link', value: '500eb', quality: 'good' },
                { item: 'Cyberarm', value: '500eb', quality: 'good' },
                { item: 'Cybereye (Advanced)', value: '1000eb', quality: 'good' },
                { item: 'Subdermal Armor', value: '1000eb', quality: 'good' },
                { item: 'Speedware', value: '5000eb', quality: 'excellent' },
                { item: 'Sandevistan', value: '5000eb', quality: 'excellent' },
                { item: 'Kerenzikov', value: '5000eb', quality: 'excellent' }
            ],
            tech: [
                { item: 'Agent (Basic)', value: '50eb', quality: 'poor' },
                { item: 'Medscanner', value: '100eb', quality: 'standard' },
                { item: 'Scrambler', value: '500eb', quality: 'standard' },
                { item: 'Tech Tool', value: '100eb', quality: 'standard' },
                { item: 'Cyberdeck (Entry)', value: '500eb', quality: 'good' },
                { item: 'Agent (Executive)', value: '1000eb', quality: 'good' },
                { item: 'Smart Glasses', value: '500eb', quality: 'good' },
                { item: 'Cyberdeck (Standard)', value: '2500eb', quality: 'excellent' },
                { item: 'Cyberdeck (Advanced)', value: '5000eb', quality: 'excellent' }
            ],
        };
        
        // Generate loot
        content.querySelector(`#generate-loot-${panelId}`).addEventListener('click', function() {
            const quality = content.querySelector(`#loot-quality-${panelId}`).value;
            
            // Number of items based on quality
            let numItems = 0;
            if (quality === 'poor') numItems = Math.floor(Math.random() * 2) + 1; // 1-2
            if (quality === 'standard') numItems = Math.floor(Math.random() * 2) + 2; // 2-3
            if (quality === 'good') numItems = Math.floor(Math.random() * 3) + 3; // 3-5
            if (quality === 'excellent') numItems = Math.floor(Math.random() * 4) + 4; // 4-7
            
            // Generate cash value
            let cashValue = 0;
            if (quality === 'poor') cashValue = Math.floor(Math.random() * 50) + 10; // 10-59
            if (quality === 'standard') cashValue = Math.floor(Math.random() * 200) + 50; // 50-249
            if (quality === 'good') cashValue = Math.floor(Math.random() * 500) + 250; // 250-749
            if (quality === 'excellent') cashValue = Math.floor(Math.random() * 1000) + 500; // 500-1499
            
            // Get all categories
            const categories = Object.keys(lootTables);
            
            // Generate loot
            let lootItems = [];
            for (let i = 0; i < numItems; i++) {
                // Pick random category
                const category = categories[Math.floor(Math.random() * categories.length)];
                const table = lootTables[category];
                
                // Filter by quality
                let availableItems = table;
                if (quality !== 'excellent') {
                    availableItems = table.filter(item => {
                        if (quality === 'poor') return item.quality === 'poor' || item.quality === 'standard';
                        if (quality === 'standard') return item.quality === 'poor' || item.quality === 'standard' || item.quality === 'good';
                        if (quality === 'good') return item.quality === 'standard' || item.quality === 'good';
                    });
                }
                
                // Pick random item
                const item = availableItems[Math.floor(Math.random() * availableItems.length)];
                lootItems.push(item);
            }
            
            // Display results
            let lootHTML = `
                <div class="loot-header">${quality.charAt(0).toUpperCase() + quality.slice(1)} Quality Loot</div>
                <div class="loot-cash">Cash: ${cashValue}eb</div>
                <div class="loot-items">
                    <ul>
            `;
            
            lootItems.forEach(item => {
                lootHTML += `<li>${item.item} (${item.value})</li>`;
            });
            
            lootHTML += `
                    </ul>
                </div>
                <div class="loot-total">Total Value: ${cashValue + lootItems.reduce((sum, item) => sum + parseInt(item.value), 0)}eb</div>
            `;
            
            content.querySelector(`#loot-result-${panelId}`).innerHTML = lootHTML;
        });
        
        return panel;
    });
}

// Night City Map Panel
function createMapPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Night City Map');
        panel.style.width = '600px';
        panel.style.height = '500px';
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="map-panel">
                <div class="map-controls">
                    <select id="map-district-${panelId}">
                        <option value="all">All Districts</option>
                        <option value="city-center">City Center</option>
                        <option value="watson">Watson</option>
                        <option value="heywood">Heywood</option>
                        <option value="westbrook">Westbrook</option>
                        <option value="pacifica">Pacifica</option>
                        <option value="santo-domingo">Santo Domingo</option>
                        <option value="badlands">Badlands</option>
                    </select>
                    <input type="text" id="map-search-${panelId}" placeholder="Search locations...">
                </div>
                <div class="map-display">
                    <div class="map-placeholder">
                        [Interactive Map - Districts of Night City]
                        
                        This is a simplified map representation.
                        In a full implementation, this would be an interactive
                        SVG or canvas-based map with clickable regions.
                    </div>
                    <div class="map-legend">
                        <div class="legend-item"><span class="legend-color" style="background-color: #e74c3c;"></span> Combat Zone</div>
                        <div class="legend-item"><span class="legend-color" style="background-color: #3498db;"></span> Corporate</div>
                        <div class="legend-item"><span class="legend-color" style="background-color: #2ecc71;"></span> Entertainment</div>
                        <div class="legend-item"><span class="legend-color" style="background-color: #f1c40f;"></span> Industrial</div>
                    </div>
                </div>
                <div class="map-info">
                    <div id="district-info-${panelId}">Select a district to see details</div>
                </div>
            </div>
        `;
        
        // District information
        const districtInfo = {
            'city-center': 'City Center: The heart of corporate power in Night City. Home to massive skyscrapers and corporate headquarters. High security, expensive living.',
            'watson': 'Watson: A mix of industrial areas and residential housing. Contains the Combat Zone and parts of Northside.',
            'heywood': 'Heywood: Primarily residential area with strong gang presence. Hispanic influences and cultural centers.',
            'westbrook': 'Westbrook: Entertainment district with Japantown and Charter Hill. Upscale shopping and nightlife.',
            'pacifica': 'Pacifica: Abandoned resort area turned urban ruin. Controlled by the Voodoo Boys gang. Very dangerous.',
            'santo-domingo': 'Santo Domingo: Industrial zone with factories and power plants. Working class neighborhood with strong nomad connections.',
            'badlands': 'Badlands: The harsh desert surrounding Night City. Home to nomad families and abandoned towns.'
        };
        
        // Update district info
        content.querySelector(`#map-district-${panelId}`).addEventListener('change', function() {
            const district = this.value;
            
            if (district === 'all') {
                content.querySelector(`#district-info-${panelId}`).textContent = 'All districts of Night City visible. Select specific district for details.';
            } else {
                content.querySelector(`#district-info-${panelId}`).textContent = districtInfo[district];
            }
        });
        
        // Search functionality placeholder
        content.querySelector(`#map-search-${panelId}`).addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm.length > 2) {
                // This would actually search a database of locations
                content.querySelector(`#district-info-${panelId}`).textContent = `Searching for "${searchTerm}" in locations...`;
            }
        });
        
        return panel;
    });
}

// Location Generator Panel
function createLocationPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Location Generator');
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="location-generator">
                <div class="generator-controls">
                    <button id="generate-location-${panelId}">Generate Location</button>
                    <select id="location-type-${panelId}">
                        <option value="urban">Urban</option>
                        <option value="corporate">Corporate</option>
                        <option value="combat-zone">Combat Zone</option>
                        <option value="industrial">Industrial</option>
                        <option value="badlands">Badlands</option>
                    </select>
                </div>
                <div id="location-result-${panelId}" class="location-result">
                    Click to generate a location
                </div>
            </div>
        `;
        
        // Location tables
        const locationTables = {
            urban: [
                'Densely-packed apartment blocks with interconnected walkways',
                'Street market with vendors selling everything from food to bootleg tech',
                'Neon-lit bar with synthetic drinks and a mix of clientele',
                'Back-alley ripperdoc clinic with questionable hygiene standards',
                'Graffiti-covered underpass controlled by local gangs',
                'Retrofitted warehouse converted to cheap apartment housing',
                'Elevated train station with view of surrounding cityscape',
                'Crowded plaza with large advertisement screens',
                'Underground club hidden behind an innocuous storefront',
                'Rooftop garden maintained by local community'
            ],
            corporate: [
                'Gleaming skyscraper with tight security and automated defenses',
                'Corporate plaza with sculptured gardens and security checkpoints',
                'Research facility with restricted access and mysterious purpose',
                'Executive residential compound with private security',
                'Corporate-owned shopping mall catering to employees',
                'Data center complex with cooling towers and minimal staff',
                'Private landing pad for AVs and corporate transports',
                'Mid-level manager offices with cubicles and meeting rooms',
                'Corporate archive facility with extensive security measures',
                'Product testing facility with various prototype items'
            ],
            'combat-zone': [
                'Abandoned police checkpoint strewn with bullet holes',
                'Burnt-out building repurposed as gang hideout',
                'Junkyard of stripped cars and salvaged parts',
                'Underground fighting arena with betting and harsh rules',
                'Heavily fortified gang territory boundary with makeshift barriers',
                'Collapsed highway section creating urban cave system',
                'Former shopping mall turned multi-gang neutral marketplace',
                'Toxic waste disposal site with mutated wildlife',
                'Ambush alley known for disappearances and robberies',
                'Bullet-riddled apartment block with survivors barricaded inside'
            ],
            industrial: [
                'Automated factory with minimal human supervision',
                'Chemical processing plant with hazardous material warnings',
                'Power station with massive cooling towers and electric fencing',
                'Shipping yard with stacked containers and loading machinery',
                'Waste processing facility with towering piles of sorted garbage',
                'Abandoned factory repurposed by squatters and small businesses',
                'Water treatment plant with exposed pipes and filtering systems',
                'Manufacturing complex operating 24/7 with shift workers',
                'Maintenance tunnels running beneath industrial sector',
                'Construction site with towering cranes and prefab materials'
            ],
            badlands: [
                'Abandoned gas station reclaimed by nomads as trading post',
                'Irradiated zone with strange plant growth and minimal habitation',
                'Small farming community struggling to grow crops in harsh soil',
                'Old highway motel repurposed as nomad family base',
                'Canyon hideout accessible only by specific routes',
                'Solar farm with arrays of panels and minimal security',
                'Desert racing track used for competitions and training',
                'Ramshackle town built around a rare water source',
                'Military testing grounds with unexploded ordinance',
                'Mining operation with heavy machinery and company housing'
            ]
        };
        
        // Location features to add details
        const locationFeatures = [
            'Currently experiencing electrical issues',
            'Recently attacked, showing damage and emergency repairs',
            'Unusually crowded today',
            'Under surveillance by unknown parties',
            'Recently changed ownership, signage being updated',
            'Contains a hidden room or compartment not easily found',
            'Has an unusual collection of technology or artifacts',
            'Known for a specific urban legend or ghost story',
            'Contains a famous landmark or point of interest',
            'Currently hosting a special event or gathering'
        ];
        
        // Generate location
        content.querySelector(`#generate-location-${panelId}`).addEventListener('click', function() {
            const type = content.querySelector(`#location-type-${panelId}`).value;
            const locations = locationTables[type];
            
            // Pick random location
            const location = locations[Math.floor(Math.random() * locations.length)];
            
            // Pick 1-2 random features
            const numFeatures = Math.floor(Math.random() * 2) + 1;
            const features = [];
            for (let i = 0; i < numFeatures; i++) {
                let feature;
                do {
                    feature = locationFeatures[Math.floor(Math.random() * locationFeatures.length)];
                } while (features.includes(feature));
                features.push(feature);
            }
            
            // Generate NPCs
            const npcCount = Math.floor(Math.random() * 3) + 1;
            
            // Display result
            content.querySelector(`#location-result-${panelId}`).innerHTML = `
                <div class="location-header">${type.charAt(0).toUpperCase() + type.replace('-', ' ').slice(1)} Location</div>
                <div class="location-description">${location}</div>
                <div class="location-features">
                    <strong>Notable Features:</strong>
                    <ul>
                        ${features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
                <div class="location-npcs">
                    <strong>Present NPCs:</strong> ${npcCount} notable characters
                </div>
            `;
        });
        
        return panel;
    });
}

// Random Encounter Panel
function createEncounterPanel() {
    return safeCreatePanel(() => {
        const panel = createPanel('Random Encounter');
        const content = panel.querySelector('.panel-content');
        const panelId = panel.id || Date.now(); // Ensure uniqueness
        
        content.innerHTML = `
            <div class="encounter-generator">
                <div class="generator-controls">
                    <button id="generate-encounter-${panelId}">Generate Encounter</button>
                    <select id="encounter-area-${panelId}">
                        <option value="urban">Urban</option>
                        <option value="corporate">Corporate</option>
                        <option value="combat-zone">Combat Zone</option>
                        <option value="badlands">Badlands</option>
                    </select>
                    <select id="encounter-difficulty-${panelId}">
                        <option value="easy">Easy</option>
                        <option value="average">Average</option>
                        <option value="difficult">Difficult</option>
                    </select>
                </div>
                <div id="encounter-result-${panelId}" class="encounter-result">
                    Click to generate an encounter
                </div>
            </div>
        `;
        
        // Encounter tables
        const encounterTables = {
            urban: [
                { encounter: 'Police drone patrol stops to scan IDs', type: 'social', difficulty: 'easy' },
                { encounter: 'Street vendor selling suspicious implants', type: 'social', difficulty: 'easy' },
                { encounter: 'Two gangs meeting at neutral ground', type: 'tension', difficulty: 'average' },
                { encounter: 'Cyber-psycho attacking pedestrians', type: 'combat', difficulty: 'difficult' },
                { encounter: 'Corporate security checking for corporate espionage', type: 'stealth', difficulty: 'average' },
                { encounter: 'Street race causing chaos through traffic', type: 'chase', difficulty: 'average' },
                { encounter: 'Data courier being chased by corporate agents', type: 'social/combat', difficulty: 'average' },
                { encounter: 'Street prophet preaching about AI apocalypse', type: 'social', difficulty: 'easy' },
                { encounter: 'Gang members extorting local businesses', type: 'social/combat', difficulty: 'average' },
                { encounter: 'Rogue AI controlling local systems', type: 'tech', difficulty: 'difficult' }
            ],
            corporate: [
                { encounter: 'Security patrol checking IDs', type: 'social', difficulty: 'easy' },
                { encounter: 'Corporate espionage in progress', type: 'stealth', difficulty: 'average' },
                { encounter: 'Executive being kidnapped', type: 'combat', difficulty: 'difficult' },
                { encounter: 'Experimental technology malfunction', type: 'tech', difficulty: 'average' },
                { encounter: 'Rival corporate teams in confrontation', type: 'social/combat', difficulty: 'average' },
                { encounter: 'Corporate network intrusion alert', type: 'tech', difficulty: 'difficult' },
                { encounter: 'Testing of security systems', type: 'stealth', difficulty: 'average' },
                { encounter: 'Corporate party with high-profile targets', type: 'social', difficulty: 'easy' },
                { encounter: 'Prototype defense system gone rogue', type: 'combat', difficulty: 'difficult' },
                { encounter: 'Internal power struggle between executives', type: 'social', difficulty: 'average' }
            ],
            'combat-zone': [
                { encounter: 'Gang ambush with makeshift barricade', type: 'combat', difficulty: 'average' },
                { encounter: 'Scavengers harvesting cybernetics from the dead', type: 'social/combat', difficulty: 'average' },
                { encounter: 'Heavily defended gang territory checkpoint', type: 'social/combat', difficulty: 'difficult' },
                { encounter: 'Black market deal going wrong', type: 'combat', difficulty: 'average' },
                { encounter: 'Cyber-psycho on a rampage', type: 'combat', difficulty: 'difficult' },
                { encounter: 'Kidnapping victims being transported', type: 'stealth/combat', difficulty: 'average' },
                { encounter: 'NCPD raid on gang headquarters', type: 'chaos', difficulty: 'difficult' },
                { encounter: 'Gang war spilling into the streets', type: 'combat', difficulty: 'difficult' },
                { encounter: 'Illegal street clinic under attack', type: 'combat', difficulty: 'average' },
                { encounter: 'Territorial dispute between rival gangs', type: 'social/combat', difficulty: 'average' }
            ],
            badlands: [
                { encounter: 'Nomad convoy passing through', type: 'social', difficulty: 'easy' },
                { encounter: 'Roadside ambush by scavengers', type: 'combat', difficulty: 'average' },
                { encounter: 'Crashed AV with corporate cargo', type: 'exploration', difficulty: 'average' },
                { encounter: 'Rad-storm forcing need for shelter', type: 'survival', difficulty: 'average' },
                { encounter: 'Corporate security checkpoint on highway', type: 'social/stealth', difficulty: 'average' },
                { encounter: 'Badlands blood hunt (manhunt)', type: 'chase', difficulty: 'difficult' },
                { encounter: 'Abandoned facility with valuable resources', type: 'exploration', difficulty: 'average' },
                { encounter: 'Nomad clan requesting assistance', type: 'social', difficulty: 'easy' },
                { encounter: 'Corporate transport convoy with heavy security', type: 'combat', difficulty: 'difficult' },
                { encounter: 'Disturbed wildlife pack attacking travelers', type: 'combat', difficulty: 'average' }
            ]
        };
        
        // Difficulty modifiers
        const difficultyDetails = {
            easy: { enemies: '1-3 low-level opponents', reward: 'Minor reward (50-100eb value)', xp: 'Low XP' },
            average: { enemies: '3-6 medium-level opponents or 1-2 tough opponents', reward: 'Standard reward (100-500eb value)', xp: 'Standard XP' },
            difficult: { enemies: '6+ medium-level or 3+ tough opponents', reward: 'Significant reward (500-1000eb+ value)', xp: 'High XP' }
        };
        
        // Generate encounter
        content.querySelector(`#generate-encounter-${panelId}`).addEventListener('click', function() {
            const area = content.querySelector(`#encounter-area-${panelId}`).value;
            const difficulty = content.querySelector(`#encounter-difficulty-${panelId}`).value;
            
            // Filter encounters by difficulty
            const encounters = encounterTables[area].filter(e => {
                if (difficulty === 'easy') return e.difficulty === 'easy';
                if (difficulty === 'average') return e.difficulty === 'easy' || e.difficulty === 'average';
                return true; // 'difficult' includes all
            });
            
            // Pick random encounter
            const encounter = encounters[Math.floor(Math.random() * encounters.length)];
            
            // Generate twist
            const twists = [
                'An unexpected ally appears during the encounter',
                'The situation is not what it initially seemed',
                'A third party intervenes with their own agenda',
                'Environmental conditions complicate the encounter',
                'The true target/objective is different than expected',
                'Someone involved is actually undercover/in disguise',
                'A peaceful solution exists but is not obvious',
                'Time pressure makes the situation more urgent'
            ];
            
            const twist = twists[Math.floor(Math.random() * twists.length)];
            
            // Generate rewards
            const details = difficultyDetails[difficulty];
            
            // Display result
            content.querySelector(`#encounter-result-${panelId}`).innerHTML = `
                <div class="encounter-header">${area.charAt(0).toUpperCase() + area.replace('-', ' ').slice(1)} Encounter</div>
                <div class="encounter-description">${encounter.encounter}</div>
                <div class="encounter-details">
                    <div><strong>Type:</strong> ${encounter.type}</div>
                    <div><strong>Difficulty:</strong> ${difficulty} (${encounter.difficulty})</div>
                    <div><strong>Opposition:</strong> ${details.enemies}</div>
                    <div><strong>Potential Reward:</strong> ${details.reward}</div>
                </div>
                <div class="encounter-twist">
                    <strong>Twist:</strong> ${twist}
                </div>
            `;
        });
        
        return panel;
    });
}
// Counter for notes panel creation attempts
let notesPanelCreationAttempts = 0;
const MAX_NOTES_ATTEMPTS = 2;

// Standalone Notes Panel Implementation that doesn't use any shared functions
function createStandaloneNotesPanel() {
    console.log('Creating standalone notes panel implementation');
    
    try {
        // Create the panel element directly
        const panel = document.createElement('div');
        panel.className = 'panel';
        panel.style.position = 'absolute';
        panel.style.left = '100px';
        panel.style.top = '100px';
        panel.style.width = '400px';
        panel.style.height = '300px';
        panel.style.zIndex = '1000';
        panel.style.backgroundColor = 'rgba(30, 30, 45, 0.85)';
        panel.style.border = '1px solid #00ccff';
        panel.style.borderRadius = '4px';
        panel.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.overflow = 'hidden';
        panel.id = 'notes-panel-' + Date.now();
        
        // Set up panel structure
        panel.innerHTML = `
            <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center; 
                 padding: 8px; background-color: rgba(10, 10, 20, 0.8); cursor: move; border-bottom: 1px solid #00ccff;">
                <div>Notes (Standalone)</div>
                <button class="close-button" style="background: none; border: none; color: #e0e0e0; 
                        font-size: 18px; cursor: pointer;">&times;</button>
            </div>
            <div class="panel-content" style="flex: 1; overflow: auto; padding: 0;"></div>
        `;
        
        // Add the panel to the document
        document.body.appendChild(panel);
        
        // Add rich text editor to the panel content
        const content = panel.querySelector('.panel-content');
        if (content) {
            content.innerHTML = `
                <div style="display: flex; flex-direction: column; height: 100%;">
                    <div style="padding: 5px; background: rgba(20, 20, 30, 0.8); border-bottom: 1px solid rgba(0, 204, 255, 0.3); display: flex; flex-wrap: wrap; gap: 5px;">
                        <button id="bold-${panel.id}" style="padding: 3px 6px; background: rgba(40,40,60,0.9); border: 1px solid #00ccff; color: #e0e0e0;">
                            <strong>B</strong>
                        </button>
                        <button id="italic-${panel.id}" style="padding: 3px 6px; background: rgba(40,40,60,0.9); border: 1px solid #00ccff; color: #e0e0e0;">
                            <em>I</em>
                        </button>
                        <button id="underline-${panel.id}" style="padding: 3px 6px; background: rgba(40,40,60,0.9); border: 1px solid #00ccff; color: #e0e0e0;">
                            <u>U</u>
                        </button>
                        <button id="h1-${panel.id}" style="padding: 3px 6px; background: rgba(40,40,60,0.9); border: 1px solid #00ccff; color: #e0e0e0;">
                            H1
                        </button>
                        <button id="h2-${panel.id}" style="padding: 3px 6px; background: rgba(40,40,60,0.9); border: 1px solid #00ccff; color: #e0e0e0;">
                            H2
                        </button>
                        <button id="list-${panel.id}" style="padding: 3px 6px; background: rgba(40,40,60,0.9); border: 1px solid #00ccff; color: #e0e0e0;">
                            • List
                        </button>
                        <button id="save-${panel.id}" style="padding: 3px 6px; background: rgba(40,40,60,0.9); border: 1px solid #00ccff; color: #e0e0e0;">
                            Save
                        </button>
                    </div>
                    <div id="editor-${panel.id}" contenteditable="true" style="flex: 1; padding: 10px; background: rgba(20,20,35,0.8); color: #e0e0e0; 
                                                    outline: none; overflow-y: auto; min-height: 200px;"></div>
                    <div style="padding: 3px; font-size: 12px; text-align: right; border-top: 1px solid rgba(0, 204, 255, 0.2); color: rgba(200, 200, 255, 0.7);">
                        <span id="status-${panel.id}">Ready</span>
                    </div>
                </div>
            `;
            
            // Add editor functionality
            const editor = document.getElementById(`editor-${panel.id}`);
            const statusEl = document.getElementById(`status-${panel.id}`);
            
            // Add button event listeners
            document.getElementById(`bold-${panel.id}`).addEventListener('click', function() {
                document.execCommand('bold', false, null);
                editor.focus();
            });
            
            document.getElementById(`italic-${panel.id}`).addEventListener('click', function() {
                document.execCommand('italic', false, null);
                editor.focus();
            });
            
            document.getElementById(`underline-${panel.id}`).addEventListener('click', function() {
                document.execCommand('underline', false, null);
                editor.focus();
            });
            
            document.getElementById(`h1-${panel.id}`).addEventListener('click', function() {
                document.execCommand('formatBlock', false, '<h1>');
                editor.focus();
            });
            
            document.getElementById(`h2-${panel.id}`).addEventListener('click', function() {
                document.execCommand('formatBlock', false, '<h2>');
                editor.focus();
            });
            
            document.getElementById(`list-${panel.id}`).addEventListener('click', function() {
                document.execCommand('insertUnorderedList', false, null);
                editor.focus();
            });
            
            document.getElementById(`save-${panel.id}`).addEventListener('click', function() {
                try {
                    localStorage.setItem(`cyberpunk-notes-${panel.id}`, editor.innerHTML);
                    statusEl.textContent = 'Saved!';
                    setTimeout(() => { statusEl.textContent = 'Ready'; }, 1500);
                } catch (err) {
                    statusEl.textContent = 'Error saving';
                    console.error('Error saving notes:', err);
                }
            });
            
            // Add auto-save
            editor.addEventListener('input', function() {
                statusEl.textContent = 'Typing...';
                clearTimeout(editor.saveTimeout);
                editor.saveTimeout = setTimeout(function() {
                    try {
                        localStorage.setItem(`cyberpunk-notes-${panel.id}`, editor.innerHTML);
                        statusEl.textContent = 'Auto-saved';
                        setTimeout(() => { statusEl.textContent = 'Ready'; }, 1500);
                    } catch (err) {
                        statusEl.textContent = 'Auto-save failed';
                        console.error('Error auto-saving notes:', err);
                    }
                }, 2000);
            });
            
            // Make the panel draggable
            const header = panel.querySelector('.panel-header');
            header.addEventListener('mousedown', function(e) {
                if (e.target === header || e.target === header.firstElementChild) {
                    e.preventDefault();
                    
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startLeft = parseInt(panel.style.left) || 100;
                    const startTop = parseInt(panel.style.top) || 100;
                    
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
                }
            });
            
            // Add close functionality
            panel.querySelector('.close-button').addEventListener('click', function() {
                panel.remove();
            });
            
            // Focus the editor
            setTimeout(() => editor.focus(), 100);
        }
        
        return panel;
    } catch (err) {
        console.error('Error in standalone notes panel creation:', err);
        // Create a very basic fallback panel
        const errorPanel = document.createElement('div');
        errorPanel.textContent = 'Failed to create Notes Panel';
        return errorPanel;
    }
}

// Notes Panel implementation with retry logic and fallbacks
function createNotesPanelImplementation() {
    console.log('createNotesPanel called - initializing rich text editor');
    console.log(`Notes panel creation attempt ${notesPanelCreationAttempts + 1}/${MAX_NOTES_ATTEMPTS}`);
    
    // Check if we've reached max attempts
    if (notesPanelCreationAttempts >= MAX_NOTES_ATTEMPTS) {
        console.error(`Maximum notes panel creation attempts (${MAX_NOTES_ATTEMPTS}) reached. Using standalone implementation.`);
        notesPanelCreationAttempts = 0; // Reset counter
        return createStandaloneNotesPanel();
    }
    
    // Increment attempt counter
    notesPanelCreationAttempts++;
    
    try {
        console.log('Creating Notes Panel with createPanel function');
        
        // Try to use createPanel function
        if (typeof createPanel === 'function' || typeof window.createPanel === 'function') {
            const createPanelFunc = (typeof createPanel === 'function') ? createPanel : window.createPanel;
            const panel = createPanelFunc('Notes');
            
            if (!panel) {
                console.error('createPanel returned null or undefined');
                throw new Error('Panel creation failed');
            }
            
            const content = panel.querySelector('.panel-content');
            if (!content) {
                console.error('ERROR: Could not find .panel-content in Notes Panel');
                throw new Error('Panel-content not found in Notes Panel');
            }
            
            const panelId = panel.id || Date.now(); // Ensure uniqueness
            console.log('Notes Panel ID:', panelId);
        
        // Make the notes panel a bit larger by default
        panel.style.width = '400px';
        panel.style.height = '300px';
        
        // Add a style for our text editor and toolbar
        const style = document.createElement('style');
        style.textContent = `
            .notes-editor-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                font-family: var(--font-content, sans-serif);
            }
            .notes-toolbar {
                background-color: rgba(30, 30, 45, 0.9);
                border-bottom: 1px solid var(--theme-primary, #00ccff);
                padding: 5px;
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            .notes-toolbar button {
                background-color: rgba(40, 40, 60, 0.9);
                color: var(--theme-text-primary, #e0e0e0);
                border: 1px solid var(--theme-primary, #00ccff);
                border-radius: 3px;
                padding: 3px 6px;
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.2s;
            }
            .notes-toolbar button:hover {
                background-color: rgba(60, 60, 80, 0.9);
            }
            .notes-toolbar button.active {
                background-color: rgba(0, 150, 200, 0.5);
            }
            .notes-toolbar button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .notes-toolbar .separator {
                width: 1px;
                height: 20px;
                background-color: rgba(200, 200, 255, 0.3);
                margin: 0 5px;
            }
            .notes-editor {
                flex: 1;
                background-color: rgba(20, 20, 35, 0.8);
                border: none;
                color: var(--theme-text-primary, #e0e0e0);
                resize: none;
                padding: 10px;
                font-size: 14px;
                outline: none;
                overflow-y: auto;
                min-height: 200px;
            }
            .notes-editor[contenteditable="true"] {
                cursor: text;
            }
            .notes-footer {
                padding: 5px;
                font-size: 12px;
                color: rgba(200, 200, 255, 0.7);
                text-align: right;
                border-top: 1px solid rgba(200, 200, 255, 0.2);
            }
            /* Custom styling for formatted text */
            .notes-editor b, .notes-editor strong {
                color: var(--theme-primary, #00ccff);
            }
            .notes-editor i, .notes-editor em {
                color: #ffcc00;
            }
            .notes-editor u {
                text-decoration-color: var(--theme-primary, #00ccff);
            }
            .notes-editor h1, .notes-editor h2, .notes-editor h3 {
                color: var(--theme-primary, #00ccff);
                border-bottom: 1px solid rgba(0, 204, 255, 0.3);
                margin-top: 10px;
                margin-bottom: 5px;
            }
            .notes-editor h1 {
                font-size: 1.4em;
            }
            .notes-editor h2 {
                font-size: 1.2em;
            }
            .notes-editor h3 {
                font-size: 1.1em;
            }
            .notes-editor code {
                font-family: monospace;
                background-color: rgba(30, 30, 45, 0.9);
                padding: 2px 4px;
                border-radius: 3px;
                color: #ff5555;
            }
            .notes-editor pre {
                font-family: monospace;
                background-color: rgba(30, 30, 45, 0.9);
                padding: 5px;
                border-radius: 3px;
                color: #ff5555;
                white-space: pre-wrap;
            }
            .notes-editor a {
                color: #55aaff;
                text-decoration: underline;
            }
            .notes-editor ol, .notes-editor ul {
                padding-left: 20px;
            }
        `;
        document.head.appendChild(style);
        
        content.innerHTML = `
            <div class="notes-editor-container">
                <div class="notes-toolbar" role="toolbar" aria-label="Text formatting">
                    <button data-command="bold" title="Bold (Ctrl+B)" aria-label="Bold"><strong>B</strong></button>
                    <button data-command="italic" title="Italic (Ctrl+I)" aria-label="Italic"><em>I</em></button>
                    <button data-command="underline" title="Underline (Ctrl+U)" aria-label="Underline"><u>U</u></button>
                    <div class="separator" role="separator"></div>
                    <button data-command="formatBlock" data-value="h1" title="Heading 1" aria-label="Heading 1">H1</button>
                    <button data-command="formatBlock" data-value="h2" title="Heading 2" aria-label="Heading 2">H2</button>
                    <button data-command="formatBlock" data-value="h3" title="Heading 3" aria-label="Heading 3">H3</button>
                    <div class="separator" role="separator"></div>
                    <button data-command="insertUnorderedList" title="Bullet List" aria-label="Bullet List">• List</button>
                    <button data-command="insertOrderedList" title="Numbered List" aria-label="Numbered List">1. List</button>
                    <div class="separator" role="separator"></div>
                    <button data-command="formatBlock" data-value="pre" title="Code Block" aria-label="Code Block">Code</button>
                    <button data-command="createLink" title="Insert Link" aria-label="Insert Link">Link</button>
                    <div class="separator" role="separator"></div>
                    <button data-command="save" title="Save Notes (Ctrl+S)" aria-label="Save Notes">Save</button>
                    <button data-command="load" title="Load Notes" aria-label="Load Notes">Load</button>
                </div>
                <div id="notes-editor-${panelId}" class="notes-editor" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Notes content"></div>
                <div class="notes-footer">
                    <span id="notes-status-${panelId}" aria-live="polite">Ready</span>
                </div>
            </div>
        `;
        
        // Reference our editor and status elements
        const editor = content.querySelector(`#notes-editor-${panelId}`);
        const statusElement = content.querySelector(`#notes-status-${panelId}`);
        
        // Create a storage key unique to this panel
        const storageKey = `cyberpunk-notes-${panelId}`;
        
        // Handle toolbar button clicks
        content.querySelectorAll('.notes-toolbar button').forEach(button => {
            button.addEventListener('click', function() {
                const command = this.getAttribute('data-command');
                const value = this.getAttribute('data-value') || '';
                
                // Execute the appropriate command based on the button clicked
                switch (command) {
                    case 'save':
                        saveNotes();
                        break;
                        
                    case 'load':
                        loadNotes();
                        break;
                        
                    case 'createLink':
                        const url = prompt('Enter the URL:', 'http://');
                        if (url) {
                            document.execCommand('createLink', false, url);
                        }
                        break;
                        
                    default:
                        // For standard formatting commands
                        document.execCommand(command, false, value);
                        break;
                }
                
                // Make sure the editor maintains focus
                editor.focus();
            });
        });
        
        // Save notes to localStorage
        function saveNotes() {
            try {
                localStorage.setItem(storageKey, editor.innerHTML);
                updateStatus('Notes saved', 'success');
            } catch (error) {
                console.error('Error saving notes:', error);
                updateStatus('Save failed: ' + error.message, 'error');
            }
        }
        
        // Load notes from localStorage
        function loadNotes() {
            try {
                const savedContent = localStorage.getItem(storageKey);
                if (savedContent) {
                    editor.innerHTML = savedContent;
                    updateStatus('Notes loaded', 'success');
                } else {
                    updateStatus('No saved notes found', 'info');
                }
            } catch (error) {
                console.error('Error loading notes:', error);
                updateStatus('Load failed: ' + error.message, 'error');
            }
        }
        
        // Update status message with auto-clear
        function updateStatus(message, type = 'info') {
            statusElement.textContent = message;
            statusElement.style.color = type === 'error' ? '#ff5555' : 
                                        type === 'success' ? '#55ff55' : 
                                        'rgba(200, 200, 255, 0.7)';
            
            // Clear status after 3 seconds
            setTimeout(() => {
                statusElement.textContent = 'Ready';
                statusElement.style.color = 'rgba(200, 200, 255, 0.7)';
            }, 3000);
        }
        
        // Auto-save on content changes with debounce
        let saveTimeout;
        editor.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            updateStatus('Typing...');
            
            saveTimeout = setTimeout(() => {
                saveNotes();
            }, 2000); // Auto-save 2 seconds after typing stops
        });
        
        // Keyboard shortcuts
        editor.addEventListener('keydown', function(e) {
            // Ctrl+S to save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveNotes();
            }
            // Ctrl+B for bold
            else if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                document.execCommand('bold', false, null);
            }
            // Ctrl+I for italic
            else if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                document.execCommand('italic', false, null);
            }
            // Ctrl+U for underline
            else if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                document.execCommand('underline', false, null);
            }
        });
        
        // Try to load saved notes on creation
        loadNotes();
        
        console.log('Notes Panel fully initialized with rich text editor');
        return panel;
        
        } catch (error) {
            console.error('Error creating Notes Panel:', error);
            
            // Create fallback panel if an error occurs
            try {
                const fallbackPanel = createPanel('Notes (Basic)');
                fallbackPanel.querySelector('.panel-content').innerHTML = `
                    <div style="padding: 10px; color: #ff5555;">
                        <strong>Error creating rich text editor</strong>
                        <p>Using basic notes functionality instead.</p>
                        <p>Error details: ${error.message}</p>
                        <textarea style="width: 100%; height: 200px; background: rgba(20, 20, 35, 0.8); 
                                        color: white; border: 1px solid #00ccff; padding: 8px;"></textarea>
                    </div>
                `;
                return fallbackPanel;
            } catch (fallbackError) {
                console.error('Failed to create fallback Notes Panel:', fallbackError);
                const errorDiv = document.createElement('div');
                errorDiv.innerHTML = 'Failed to create Notes Panel';
                return errorDiv;
            }
        }
    });
    
    // Global diagnostic function - can be called from console
    window.debugNotesPanel = function() {
        console.log('Notes Panel Debug Info:');
        console.log('- createNotesPanel function exists:', typeof window.createNotesPanel === 'function');
        console.log('- createPanel function exists:', typeof window.createPanel === 'function');
        console.log('- safeCreatePanel function exists:', typeof window.safeCreatePanel === 'function');
        console.log('- document.readyState:', document.readyState);
        
        // Check for HTML element with id="add-notes"
        const addNotesLink = document.getElementById('add-notes');
        console.log('- add-notes link exists:', !!addNotesLink);
        if (addNotesLink) {
            console.log('  - add-notes link text:', addNotesLink.textContent);
            console.log('  - add-notes link onclick:', addNotesLink.onclick);
        }
        
        // Check if ui-fix.js loaded properly
        console.log('- UI Config loaded:', typeof window.CONFIG !== 'undefined');
        if (typeof window.CONFIG !== 'undefined' && window.CONFIG.selectors) {
            console.log('  - panelMenuItems config:', window.CONFIG.selectors.panelMenuItems);
            console.log('  - notes panel config:', window.CONFIG.selectors.panelMenuItems['add-notes']);
        }
        
        return 'Debug info logged to console';
    };
};

// Expose the Notes Panel function to the window object
// Do this after all the implementation is defined to avoid circular references
// Create a function that will safely create the notes panel
window.createNotesPanel = function() {
    console.log('Window createNotesPanel called');
    
    // First try to use the enhanced notes editor if available
    if (typeof window.createEnhancedNotesPanel === 'function') {
        try {
            console.log('Using enhanced notes editor implementation');
            return window.createEnhancedNotesPanel();
        } catch (e) {
            console.error('Error in enhanced notes editor:', e);
            // Fall through to standard implementation if enhanced version fails
        }
    }
    
    // Next, check if our counter implementation is available
    if (typeof createNotesPanelImplementation === 'function') {
        try {
            // Use the counter-based implementation
            console.log('Using standard notes panel implementation');
            return createNotesPanelImplementation();
        } catch (e) {
            console.error('Error in createNotesPanelImplementation:', e);
        }
    }
    
    // Last resort: completely standalone implementation
    console.log('Using completely standalone notes panel as final fallback');
    if (typeof notesPanelCreationAttempts !== 'undefined') {
        notesPanelCreationAttempts = 0; // Reset counter for next time
    }
    
    // This should always be available since it's defined in this file
    if (typeof createStandaloneNotesPanel === 'function') {
        return createStandaloneNotesPanel();
    }
    
    // Ultimate fallback if somehow we can't find our functions
    console.error('No notes panel implementations available - creating basic div');
    var div = document.createElement('div');
    div.textContent = 'Notes panel unavailable';
    return div;
};

// Alias it for internal use - but don't create circular references!
const createNotesPanel = function() {
    return window.createNotesPanel();
};


// Lore Browser Panel Implementation
window.createLoreBrowserPanel = function() {
    console.log('Creating Lore Browser Panel');
    
    if (typeof window.createPanel \!== 'function') {
        console.error('createPanel function not available');
        return null;
    }
    
    const content = '<div id="lore-browser-content" style="height: 100%; display: flex; flex-direction: column;"></div>';
    
    const panel = window.createPanel({
        title: 'Lore Database',
        content: content,
        width: 900,
        height: 700,
        x: Math.random() * (window.innerWidth - 900),
        y: 100 + Math.random() * 200,
        panelClass: 'lore-browser-panel'
    });
    
    if (panel) {
        // Load the lore browser scripts if not already loaded
        if (typeof LoreDatabase === 'undefined') {
            const loreDBScript = document.createElement('script');
            loreDBScript.src = 'src/js/lore-database.js';
            loreDBScript.onload = function() {
                const loreBrowserScript = document.createElement('script');
                loreBrowserScript.src = 'src/js/lore-browser.js';
                loreBrowserScript.onload = function() {
                    // Initialize lore browser after scripts load
                    if (document.getElementById('lore-browser-content')) {
                        window.loreBrowser = new LoreBrowser('lore-browser-content');
                    }
                };
                document.head.appendChild(loreBrowserScript);
            };
            document.head.appendChild(loreDBScript);
        } else {
            // Scripts already loaded, just initialize
            setTimeout(() => {
                if (document.getElementById('lore-browser-content')) {
                    window.loreBrowser = new LoreBrowser('lore-browser-content');
                }
            }, 100);
        }
    }
    
    return panel;
};

// Expose to global scope if needed
const createLoreBrowserPanel = window.createLoreBrowserPanel;


// Advanced Encounter Panel Implementation
window.createAdvancedEncounterPanel = function() {
    console.log('Creating Advanced Encounter Panel');
    
    if (typeof window.createPanel \!== 'function') {
        console.error('createPanel function not available');
        return null;
    }
    
    const content = '<div id="encounter-panel-content" style="height: 100%; display: flex; flex-direction: column;"></div>';
    
    const panel = window.createPanel({
        title: 'Advanced Encounter Generator',
        content: content,
        width: 900,
        height: 700,
        x: Math.random() * (window.innerWidth - 900),
        y: 100 + Math.random() * 200,
        panelClass: 'encounter-panel-advanced'
    });
    
    if (panel) {
        // Load the encounter generator scripts if not already loaded
        if (typeof AdvancedEncounterGenerator === 'undefined') {
            const genScript = document.createElement('script');
            genScript.src = 'src/js/encounter-generator-advanced.js';
            genScript.onload = function() {
                const panelScript = document.createElement('script');
                panelScript.src = 'src/js/encounter-panel-advanced.js';
                panelScript.onload = function() {
                    // Initialize encounter panel after scripts load
                    if (document.getElementById('encounter-panel-content')) {
                        window.encounterPanel = new AdvancedEncounterPanel('encounter-panel-content');
                    }
                };
                document.head.appendChild(panelScript);
            };
            document.head.appendChild(genScript);
        } else {
            // Scripts already loaded, just initialize
            setTimeout(() => {
                if (document.getElementById('encounter-panel-content')) {
                    window.encounterPanel = new AdvancedEncounterPanel('encounter-panel-content');
                }
            }, 100);
        }
    }
    
    return panel;
};

// Expose to global scope if needed
const createAdvancedEncounterPanel = window.createAdvancedEncounterPanel;
