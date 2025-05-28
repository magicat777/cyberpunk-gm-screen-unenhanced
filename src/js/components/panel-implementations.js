/**
 * Panel Implementations for app-modern.html
 * This file provides the implementations for the panel creation functions referenced in app-modern.html
 */

// Initiative Tracker Panel
function createInitiativePanel() {
    const panel = createPanel('Initiative Tracker');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="initiative-controls">
            <button id="init-add">Add Character</button>
            <button id="init-clear">Clear</button>
            <button id="init-sort">Sort</button>
        </div>
        <div class="initiative-list">
            <ul id="initiative-tracker"></ul>
        </div>
    `;
    
    // Add functionality to buttons
    const addButton = content.querySelector('#init-add');
    const clearButton = content.querySelector('#init-clear');
    const sortButton = content.querySelector('#init-sort');
    const trackerList = content.querySelector('#initiative-tracker');
    
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
}

// Game Timer Panel
function createTimerPanel() {
    const panel = createPanel('Game Timer');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="timer-display">00:00:00</div>
        <div class="timer-controls">
            <button id="timer-start">Start</button>
            <button id="timer-pause">Pause</button>
            <button id="timer-reset">Reset</button>
        </div>
        <div class="timer-notes">
            <input type="text" id="timer-note" placeholder="Add time note...">
            <button id="timer-add-note">Add</button>
        </div>
        <div class="timer-log"></div>
    `;
    
    // Timer variables
    let seconds = 0;
    let timerInterval = null;
    let isRunning = false;
    
    // Format time as HH:MM:SS
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return [h, m, s].map(v => v < 10 ? "0" + v : v).join(':');
    };
    
    // Update the timer display
    const updateTimer = () => {
        content.querySelector('.timer-display').textContent = formatTime(seconds);
    };
    
    // Add event listeners to buttons
    content.querySelector('#timer-start').addEventListener('click', function() {
        if (isRunning) return;
        
        isRunning = true;
        timerInterval = setInterval(() => {
            seconds++;
            updateTimer();
        }, 1000);
    });
    
    content.querySelector('#timer-pause').addEventListener('click', function() {
        if (!isRunning) return;
        
        isRunning = false;
        clearInterval(timerInterval);
    });
    
    content.querySelector('#timer-reset').addEventListener('click', function() {
        isRunning = false;
        clearInterval(timerInterval);
        seconds = 0;
        updateTimer();
        content.querySelector('.timer-log').innerHTML = '';
    });
    
    content.querySelector('#timer-add-note').addEventListener('click', function() {
        const noteInput = content.querySelector('#timer-note');
        const note = noteInput.value.trim();
        
        if (note) {
            const logItem = document.createElement('div');
            logItem.className = 'timer-log-item';
            logItem.innerHTML = `
                <span class="timer-log-time">${formatTime(seconds)}</span>
                <span class="timer-log-text">${note}</span>
            `;
            
            content.querySelector('.timer-log').prepend(logItem);
            noteInput.value = '';
        }
    });
    
    return panel;
}

// Calculator Panel
function createCalculatorPanel() {
    const panel = createPanel('Calculator');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="calculator">
            <input type="text" id="calc-display" class="calc-display" readonly>
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
    
    const display = content.querySelector('#calc-display');
    
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
}

// Weapons Table Panel
function createWeaponsPanel() {
    const panel = createPanel('Weapons Table');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="weapons-table">
            <input type="text" id="weapons-filter" placeholder="Filter weapons...">
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
    const filterInput = content.querySelector('#weapons-filter');
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
}

// Armor Table Panel
function createArmorPanel() {
    const panel = createPanel('Armor Table');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="armor-table">
            <input type="text" id="armor-filter" placeholder="Filter armor...">
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
    const filterInput = content.querySelector('#armor-filter');
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
}

// Critical Injury Panel
function createCriticalInjuryPanel() {
    const panel = createPanel('Critical Injuries');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="critical-injuries">
            <div class="critical-controls">
                <button id="roll-critical">Roll Critical</button>
                <select id="critical-location">
                    <option value="head">Head</option>
                    <option value="torso">Torso</option>
                    <option value="right-arm">Right Arm</option>
                    <option value="left-arm">Left Arm</option>
                    <option value="right-leg">Right Leg</option>
                    <option value="left-leg">Left Leg</option>
                </select>
            </div>
            <div id="critical-result" class="critical-result">
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
    content.querySelector('#roll-critical').addEventListener('click', function() {
        const location = content.querySelector('#critical-location').value;
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
            content.querySelector('#critical-result').innerHTML = `
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
}

// Netrunning Panel
function createNetrunningPanel() {
    const panel = createPanel('Netrunning');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="netrunning-panel">
            <div class="netrunning-tabs">
                <button class="net-tab active" data-tab="programs">Programs</button>
                <button class="net-tab" data-tab="actions">Actions</button>
                <button class="net-tab" data-tab="combat">NET Combat</button>
            </div>
            
            <div class="netrunning-content">
                <div id="programs-tab" class="net-tab-content active">
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
                
                <div id="actions-tab" class="net-tab-content">
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
                
                <div id="combat-tab" class="net-tab-content">
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
    
    // Tab functionality
    content.querySelectorAll('.net-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Deactivate all tabs
            content.querySelectorAll('.net-tab').forEach(t => t.classList.remove('active'));
            content.querySelectorAll('.net-tab-content').forEach(c => c.classList.remove('active'));
            
            // Activate selected tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            content.querySelector(`#${tabId}-tab`).classList.add('active');
        });
    });
    
    return panel;
}

// Character Panel
function createCharacterPanel() {
    const panel = createPanel('Character Sheet');
    panel.style.width = '500px';
    panel.style.height = '600px';
    const content = panel.querySelector('.panel-content');
    
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
                    <div>BODY: <input type="number" id="body-stat" class="stat-input" min="1" max="10" value="5"></div>
                    <div>EMP: <input type="number" class="stat-input" min="1" max="10" value="5"></div>
                </div>
                
                <div class="derived-column">
                    <div><strong>Derived Stats</strong></div>
                    <div>HP: <span id="hp-calc">35</span></div>
                    <div>Humanity: <span id="humanity-calc">50</span></div>
                    <div><strong>Current Status</strong></div>
                    <div>HP: <input type="number" id="current-hp" value="35"></div>
                    <div>Armor: <input type="number" id="armor-sp" value="11"></div>
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
    const bodyInput = content.querySelector('#body-stat');
    const hpCalc = content.querySelector('#hp-calc');
    const currentHP = content.querySelector('#current-hp');
    
    bodyInput.addEventListener('change', function() {
        const bodyValue = parseInt(this.value) || 5;
        const hp = 10 + (bodyValue * 5);
        
        hpCalc.textContent = hp;
        currentHP.value = hp;
    });
    
    return panel;
}

// NPC Generator Panel
function createNPCPanel() {
    const panel = createPanel('NPC Generator');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="npc-generator">
            <div class="generator-controls">
                <button id="generate-npc">Generate NPC</button>
                <select id="npc-type">
                    <option value="ganger">Ganger</option>
                    <option value="corp">Corporate</option>
                    <option value="fixer">Fixer</option>
                    <option value="nomad">Nomad</option>
                    <option value="netrunner">Netrunner</option>
                </select>
            </div>
            <div id="npc-result" class="npc-result">
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
    content.querySelector('#generate-npc').addEventListener('click', function() {
        const type = content.querySelector('#npc-type').value;
        const data = npcData[type];
        
        // Generate random name
        const name = data.names[Math.floor(Math.random() * data.names.length)];
        
        // Generate result
        content.querySelector('#npc-result').innerHTML = `
            <div class="npc-name">${name}</div>
            <div class="npc-type-label">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="npc-stats"><strong>Stats:</strong> ${data.stats}</div>
            <div class="npc-gear"><strong>Gear:</strong> ${data.gear}</div>
            <div class="npc-traits"><strong>Traits:</strong> ${data.traits}</div>
        `;
    });
    
    return panel;
}

// Loot Generator Panel
function createLootPanel() {
    const panel = createPanel('Loot Generator');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="loot-generator">
            <div class="generator-controls">
                <button id="generate-loot">Generate Loot</button>
                <select id="loot-quality">
                    <option value="poor">Poor</option>
                    <option value="standard" selected>Standard</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                </select>
            </div>
            <div id="loot-result" class="loot-result">
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
    content.querySelector('#generate-loot').addEventListener('click', function() {
        const quality = content.querySelector('#loot-quality').value;
        
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
        
        content.querySelector('#loot-result').innerHTML = lootHTML;
    });
    
    return panel;
}

// Night City Map Panel
function createMapPanel() {
    const panel = createPanel('Night City Map');
    panel.style.width = '600px';
    panel.style.height = '500px';
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="map-panel">
            <div class="map-controls">
                <select id="map-district">
                    <option value="all">All Districts</option>
                    <option value="city-center">City Center</option>
                    <option value="watson">Watson</option>
                    <option value="heywood">Heywood</option>
                    <option value="westbrook">Westbrook</option>
                    <option value="pacifica">Pacifica</option>
                    <option value="santo-domingo">Santo Domingo</option>
                    <option value="badlands">Badlands</option>
                </select>
                <input type="text" id="map-search" placeholder="Search locations...">
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
                <div id="district-info">Select a district to see details</div>
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
    content.querySelector('#map-district').addEventListener('change', function() {
        const district = this.value;
        
        if (district === 'all') {
            content.querySelector('#district-info').textContent = 'All districts of Night City visible. Select specific district for details.';
        } else {
            content.querySelector('#district-info').textContent = districtInfo[district];
        }
    });
    
    // Search functionality placeholder
    content.querySelector('#map-search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm.length > 2) {
            // This would actually search a database of locations
            content.querySelector('#district-info').textContent = `Searching for "${searchTerm}" in locations...`;
        }
    });
    
    return panel;
}

// Location Generator Panel
function createLocationPanel() {
    const panel = createPanel('Location Generator');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="location-generator">
            <div class="generator-controls">
                <button id="generate-location">Generate Location</button>
                <select id="location-type">
                    <option value="urban">Urban</option>
                    <option value="corporate">Corporate</option>
                    <option value="combat-zone">Combat Zone</option>
                    <option value="industrial">Industrial</option>
                    <option value="badlands">Badlands</option>
                </select>
            </div>
            <div id="location-result" class="location-result">
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
    content.querySelector('#generate-location').addEventListener('click', function() {
        const type = content.querySelector('#location-type').value;
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
        content.querySelector('#location-result').innerHTML = `
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
}

// Random Encounter Panel
function createEncounterPanel() {
    const panel = createPanel('Random Encounter');
    const content = panel.querySelector('.panel-content');
    
    content.innerHTML = `
        <div class="encounter-generator">
            <div class="generator-controls">
                <button id="generate-encounter">Generate Encounter</button>
                <select id="encounter-area">
                    <option value="urban">Urban</option>
                    <option value="corporate">Corporate</option>
                    <option value="combat-zone">Combat Zone</option>
                    <option value="badlands">Badlands</option>
                </select>
                <select id="encounter-difficulty">
                    <option value="easy">Easy</option>
                    <option value="average">Average</option>
                    <option value="difficult">Difficult</option>
                </select>
            </div>
            <div id="encounter-result" class="encounter-result">
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
    content.querySelector('#generate-encounter').addEventListener('click', function() {
        const area = content.querySelector('#encounter-area').value;
        const difficulty = content.querySelector('#encounter-difficulty').value;
        
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
        content.querySelector('#encounter-result').innerHTML = `
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
}