// Enhanced Netrunning Interface with Narrative Elements
class EnhancedNetrunningInterface extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Game state
    this.architecture = null;
    this.activeNetrunner = null;
    this.currentFloor = 1;
    this.currentNodeIndex = 0;
    this.floorProgress = {};
    this.encounterActive = false;
    
    // Narrative content for different node types
    this.nodeNarratives = {
      password: [
        "A glowing password gate blocks your path. The encryption shifts and morphs like living code.",
        "You encounter a biometric authentication node. Virtual DNA strands spiral around the access point.",
        "A multi-factor authentication barrier stands before you. Time-locked algorithms tick down ominously.",
        "An ancient password node flickers with outdated security protocols. It might be vulnerable to exploits."
      ],
      file: [
        "You discover a data cache containing employee records. Personnel files stream past in glowing text.",
        "Financial records float in a crystalline data structure. Quarterly reports and hidden transactions await.",
        "Classified project files pulse with red warning indicators. The data is heavily encrypted.",
        "You find backup archives dating back years. Deleted files might be recoverable here."
      ],
      control: [
        "You discover the subroutines responsible for the building's air conditioning. There's more to be discovered on this floor if you choose to proceed.",
        "Security camera controls materialize before you. You can see feeds from across the facility.",
        "Door lock protocols glow with amber light. You could lock down or open any area of the building.",
        "The main power grid controls hum with electricity. One wrong move could trigger a blackout."
      ],
      ice: [
        "You encounter Black ICE lying in wait. You are immediately attacked! Roll for initiative - the Black ICE goes first the following round.",
        "Gray ICE materializes from the data stream. Its crystalline form shifts menacingly as it prepares to strike.",
        "White ICE spreads across your path like digital frost. It's more defensive than aggressive, but still dangerous.",
        "A massive ICE construct blocks the entire node. Its many eyes focus on you with hostile intent."
      ],
      data: [
        "A treasure trove of corporate secrets floats in encrypted bubbles. Each one could be worth thousands.",
        "Research data on experimental cyberware glows with potential. This could revolutionize the industry.",
        "You discover the personal files of a high-ranking executive. Blackmail material and private communications abound.",
        "Military contracts and weapon specifications rotate in a secure data vault. This information is extremely valuable."
      ]
    };
    
    // ICE encounter messages
    this.iceEncounters = {
      'Wisp': "A Wisp materializes - a basic defensive program that shimmers like heat haze.",
      'Killer': "A Killer program activates! Its blade-like appendages gleam with malicious code.",
      'Hellhound': "A Hellhound prowls into view, its digital fangs dripping with attack algorithms.",
      'Liche': "A Liche rises from the data stream, freezing nearby programs with its deathly cold presence.",
      'Raven': "A Raven circles overhead, its piercing cry alerting the entire system to your presence.",
      'Scorpion': "A Scorpion skitters forward, its tail arced and ready to inject neural venom.",
      'Dragon': "A massive Dragon unfurls its wings, the ultimate guardian of this system's secrets.",
      'Giant': "A Giant blocks your path, its massive form an impenetrable wall of defensive code.",
      'Kraken': "A Kraken's tentacles emerge from multiple data ports, attacking from all directions.",
      'Asp': "An Asp slithers through the data stream, its presence slowing your connection speed."
    };
    
    // Success/failure messages
    this.actionResults = {
      password: {
        success: [
          "Your decryption algorithm cracks the code! The barrier dissolves into harmless pixels.",
          "The password accepts your forged credentials. Access granted.",
          "You exploit a buffer overflow vulnerability. The gate crashes open."
        ],
        failure: [
          "The password rejects your attempt. Security tightens.",
          "Your decryption bounces off hardened security. Try another approach.",
          "Authentication failed. A trace program begins tracking your location."
        ]
      },
      file: {
        success: [
          "Files download successfully to your deck. The data is yours.",
          "You copy the entire database. Valuable information flows into your storage.",
          "Data extraction complete. No one will know you were here."
        ],
        failure: [
          "File corruption detected. The data crumbles as you try to access it.",
          "Access denied. The files are locked behind additional encryption.",
          "A data bomb triggers! Your deck takes feedback damage."
        ]
      },
      control: {
        success: [
          "System control achieved. You can manipulate the physical world from cyberspace.",
          "Control protocols bow to your commands. The system is yours.",
          "You gain root access. Every connected device awaits your orders."
        ],
        failure: [
          "The control node resists your intrusion. Defensive protocols activate.",
          "System lockout initiated. You'll need to find another way.",
          "Your control attempt triggers an alarm. ICE is incoming!"
        ]
      }
    };
    
    // Cyberpunk RED programs
    this.availablePrograms = {
      'Pathfinder': { cost: 1, type: 'utility', effect: 'Reveals one hidden aspect of architecture' },
      'See Ya': { cost: 1, type: 'utility', effect: 'Safely jack out' },
      'Speedy Gonzalvez': { cost: 2, type: 'booster', effect: '+2 to Speed for this run' },
      'Armor': { cost: 2, type: 'defender', effect: 'Reduces damage by 1d6' },
      'Shield': { cost: 2, type: 'defender', effect: 'Stops first attack' },
      'Flak': { cost: 2, type: 'defender', effect: 'Reduces all damage by 2' },
      'Zap': { cost: 1, type: 'attacker', effect: '1d6 damage to program/ICE' },
      'Banhammer': { cost: 3, type: 'attacker', effect: '2d6 damage to program/ICE' },
      'Sword': { cost: 3, type: 'attacker', effect: '3d6 damage to program/ICE' },
      'DeckKRASH': { cost: 4, type: 'attacker', effect: 'Destroys target deck' },
      'Hellbolt': { cost: 4, type: 'attacker', effect: '4d6 damage, ignores armor' },
      'Worm': { cost: 2, type: 'anti-program', effect: 'Destroys random enemy program' },
      'Virus': { cost: 3, type: 'anti-system', effect: 'Damages architecture systems' },
      'Vrizzbolt': { cost: 3, type: 'anti-personnel', effect: '2d6 damage to netrunner' },
      'Nervescrub': { cost: 4, type: 'anti-personnel', effect: 'Stuns enemy netrunner' },
      'Poison Flatline': { cost: 5, type: 'anti-personnel', effect: '3d6 direct neural damage' },
      'Krash Barrier': { cost: 6, type: 'anti-ICE', effect: 'Destroys one ICE instantly' }
    };
    
    // ICE types
    this.iceTypes = {
      'Wisp': { strength: 2, damage: '1d6', type: 'White', effect: 'Basic defense' },
      'Killer': { strength: 4, damage: '2d6', type: 'Gray', effect: 'Attacks programs' },
      'Hellhound': { strength: 6, damage: '3d6', type: 'Black', effect: 'Hunts intruders' },
      'Liche': { strength: 5, damage: '2d6', type: 'Black', effect: 'Freezes programs' },
      'Raven': { strength: 3, damage: '1d6', type: 'White', effect: 'Alerts security' },
      'Scorpion': { strength: 7, damage: '4d6', type: 'Black', effect: 'Neural damage' },
      'Dragon': { strength: 8, damage: '5d6', type: 'Black', effect: 'Ultimate defense' },
      'Giant': { strength: 6, damage: '3d6', type: 'Gray', effect: 'Blocks access' },
      'Kraken': { strength: 9, damage: '4d6', type: 'Black', effect: 'Multi-attack' },
      'Asp': { strength: 4, damage: '2d6', type: 'Gray', effect: 'Speed reduction' }
    };
    
    this.setupStyles();
    this.setupHTML();
    this.setupEventListeners();
  }

  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        height: 100%;
        background: #0a0a0a;
        color: #0ff;
        font-family: 'Consolas', monospace;
        overflow: hidden;
      }

      .container {
        height: 100%;
        display: grid;
        grid-template-rows: auto 1fr;
        background: rgba(0,0,0,0.95);
      }

      /* Header Tabs */
      .tab-header {
        display: flex;
        background: rgba(0,255,255,0.1);
        border-bottom: 2px solid #0ff;
      }

      .tab {
        padding: 10px 20px;
        cursor: pointer;
        border-right: 1px solid #0ff;
        transition: all 0.3s;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 12px;
      }

      .tab:hover {
        background: rgba(0,255,255,0.2);
      }

      .tab.active {
        background: rgba(0,255,255,0.3);
        color: #fff;
        text-shadow: 0 0 10px #0ff;
      }

      .tab-content {
        display: none;
        height: 100%;
        overflow: auto;
        padding: 20px;
      }

      .tab-content.active {
        display: block;
      }

      /* Enhanced Architecture Explorer */
      .architecture-explorer {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 20px;
        height: 100%;
      }

      .floor-list {
        background: rgba(0,255,255,0.05);
        border: 1px solid #0ff;
        padding: 15px;
        overflow-y: auto;
      }

      .floor-item {
        background: rgba(0,255,255,0.1);
        border: 1px solid #088;
        padding: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .floor-item:hover {
        background: rgba(0,255,255,0.2);
        box-shadow: 0 0 10px #0ff;
      }

      .floor-item.active {
        border-color: #0ff;
        background: rgba(0,255,255,0.3);
      }

      .floor-item.completed {
        border-color: #0f0;
        opacity: 0.7;
      }

      .floor-number {
        font-size: 18px;
        font-weight: bold;
        color: #f0f;
      }

      .floor-content {
        font-size: 12px;
        margin-top: 5px;
        opacity: 0.8;
      }

      .exploration-view {
        background: rgba(0,20,40,0.3);
        border: 1px solid #0ff;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .narrative-box {
        background: rgba(0,0,0,0.5);
        border: 2px solid #0ff;
        padding: 20px;
        min-height: 150px;
        position: relative;
        overflow: hidden;
      }

      .narrative-text {
        font-size: 16px;
        line-height: 1.6;
        color: #0ff;
        text-shadow: 0 0 5px rgba(0,255,255,0.5);
        animation: textGlow 2s ease-in-out infinite alternate;
      }

      @keyframes textGlow {
        from { text-shadow: 0 0 5px rgba(0,255,255,0.5); }
        to { text-shadow: 0 0 10px rgba(0,255,255,0.8); }
      }

      .node-info {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
        padding: 10px;
        background: rgba(0,255,255,0.1);
        border-left: 3px solid #0ff;
      }

      .node-icon {
        font-size: 32px;
      }

      .node-details {
        flex: 1;
      }

      .node-type {
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
        color: #f0f;
      }

      .node-id {
        font-size: 12px;
        opacity: 0.7;
      }

      .action-area {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .btn {
        background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
        border: 2px solid #0ff;
        color: #0ff;
        padding: 10px 20px;
        cursor: pointer;
        font-weight: bold;
        text-transform: uppercase;
        transition: all 0.3s;
        font-size: 12px;
      }

      .btn:hover {
        background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
        box-shadow: 0 0 15px #0ff;
        transform: translateY(-2px);
      }

      .btn.primary {
        border-color: #0f0;
        color: #0f0;
      }

      .btn.danger {
        border-color: #f00;
        color: #f00;
      }

      .btn.warning {
        border-color: #ff0;
        color: #ff0;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .progress-indicator {
        display: flex;
        gap: 5px;
        margin-top: 15px;
        justify-content: center;
      }

      .progress-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #333;
        border: 1px solid #0ff;
        transition: all 0.3s;
      }

      .progress-dot.active {
        background: #0ff;
        box-shadow: 0 0 10px #0ff;
      }

      .progress-dot.completed {
        background: #0f0;
        border-color: #0f0;
      }

      .ice-encounter {
        background: rgba(255,0,0,0.1);
        border: 2px solid #f00;
        padding: 20px;
        margin-top: 20px;
        animation: dangerPulse 1s infinite;
      }

      @keyframes dangerPulse {
        0%, 100% { border-color: #f00; box-shadow: 0 0 10px rgba(255,0,0,0.5); }
        50% { border-color: #ff0; box-shadow: 0 0 20px rgba(255,0,0,0.8); }
      }

      .ice-title {
        font-size: 24px;
        color: #f00;
        text-transform: uppercase;
        margin-bottom: 10px;
        text-shadow: 0 0 10px #f00;
      }

      .ice-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 10px;
        margin-top: 15px;
      }

      .ice-stat {
        background: rgba(0,0,0,0.5);
        padding: 10px;
        text-align: center;
        border: 1px solid #f00;
      }

      .stat-label {
        font-size: 10px;
        text-transform: uppercase;
        opacity: 0.7;
      }

      .stat-value {
        font-size: 18px;
        font-weight: bold;
        color: #ff0;
      }

      /* Floor map visualization */
      .floor-map {
        background: rgba(0,0,0,0.3);
        border: 1px solid #0ff;
        padding: 15px;
        margin-top: 20px;
      }

      .map-nodes {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
        padding: 20px;
      }

      .map-node {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
      }

      .map-node.current {
        animation: currentPulse 1s infinite;
      }

      @keyframes currentPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      .map-node.completed {
        opacity: 0.5;
      }

      .map-node.password { background: rgba(255,0,255,0.3); border: 2px solid #f0f; }
      .map-node.file { background: rgba(255,255,0,0.3); border: 2px solid #ff0; }
      .map-node.control { background: rgba(0,255,255,0.3); border: 2px solid #0ff; }
      .map-node.ice { background: rgba(255,0,0,0.3); border: 2px solid #f00; }
      .map-node.data { background: rgba(0,255,0,0.3); border: 2px solid #0f0; }

      .map-connection {
        position: absolute;
        height: 2px;
        background: #0ff;
        width: 30px;
        top: 50%;
        right: -30px;
        transform: translateY(-50%);
      }

      /* Action results */
      .result-message {
        padding: 15px;
        margin-top: 15px;
        border-radius: 5px;
        animation: resultFade 0.5s ease-in;
      }

      @keyframes resultFade {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .result-message.success {
        background: rgba(0,255,0,0.1);
        border: 1px solid #0f0;
        color: #0f0;
      }

      .result-message.failure {
        background: rgba(255,0,0,0.1);
        border: 1px solid #f00;
        color: #f00;
      }

      /* Other tabs remain the same as before */
      .simulation-panel {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 20px;
        height: 100%;
      }

      .netrunner-stats {
        background: rgba(0,255,255,0.05);
        border: 1px solid #0ff;
        padding: 15px;
      }

      .stat-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;
      }

      .program-slot {
        background: rgba(0,255,255,0.1);
        border: 1px solid #088;
        padding: 8px;
        margin-bottom: 5px;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
      }

      .action-log {
        background: rgba(0,0,0,0.5);
        border: 1px solid #0ff;
        padding: 15px;
        font-family: monospace;
        font-size: 12px;
        height: 100%;
        overflow-y: auto;
      }

      .log-entry {
        margin-bottom: 5px;
        padding: 5px;
        border-left: 3px solid transparent;
      }

      .log-entry.success { color: #0f0; border-color: #0f0; }
      .log-entry.danger { color: #f00; border-color: #f00; }
      .log-entry.info { color: #0ff; border-color: #0ff; }
      .log-entry.warning { color: #ff0; border-color: #ff0; }

      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: #f0f;
        margin-bottom: 15px;
        text-transform: uppercase;
        text-shadow: 0 0 5px #f0f;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  setupHTML() {
    const container = document.createElement('div');
    container.className = 'container';
    container.innerHTML = `
      <div class="tab-header">
        <div class="tab active" data-tab="explorer">Architecture Explorer</div>
        <div class="tab" data-tab="simulation">Netrun Simulation</div>
        <div class="tab" data-tab="programs">Programs & ICE</div>
        <div class="tab" data-tab="visualizer">Visualizer</div>
      </div>

      <!-- Enhanced Architecture Explorer Tab -->
      <div class="tab-content active" data-content="explorer">
        <div class="architecture-explorer">
          <div class="floor-list">
            <div class="section-title">Network Architecture</div>
            <div class="controls">
              <button class="btn primary" id="generate-arch">Generate Network</button>
              <button class="btn" id="add-floor">Add Floor</button>
            </div>
            <div id="floor-container"></div>
          </div>
          
          <div class="exploration-view">
            <div class="narrative-box">
              <div class="node-info" id="current-node-info" style="display: none;">
                <div class="node-icon" id="node-icon">🔒</div>
                <div class="node-details">
                  <div class="node-type" id="node-type">PASSWORD</div>
                  <div class="node-id" id="node-id">F1N0</div>
                </div>
              </div>
              <div class="narrative-text" id="narrative-text">
                Generate a network architecture to begin exploration...
              </div>
              <div class="result-message" id="result-message" style="display: none;"></div>
            </div>
            
            <div class="action-area" id="action-area" style="display: none;">
              <button class="btn primary" id="interact-btn">Interact with Node</button>
              <button class="btn" id="bypass-btn">Attempt Bypass</button>
              <button class="btn warning" id="next-node-btn">Next Node →</button>
              <button class="btn danger" id="jack-out-btn">Emergency Jack Out</button>
            </div>
            
            <div class="ice-encounter" id="ice-encounter" style="display: none;">
              <div class="ice-title" id="ice-name">BLACK ICE DETECTED</div>
              <div class="ice-stats">
                <div class="ice-stat">
                  <div class="stat-label">Type</div>
                  <div class="stat-value" id="ice-type">Black</div>
                </div>
                <div class="ice-stat">
                  <div class="stat-label">Strength</div>
                  <div class="stat-value" id="ice-strength">6</div>
                </div>
                <div class="ice-stat">
                  <div class="stat-label">Damage</div>
                  <div class="stat-value" id="ice-damage">3d6</div>
                </div>
              </div>
              <div class="action-area" style="margin-top: 15px;">
                <button class="btn danger" id="attack-ice">Attack ICE</button>
                <button class="btn warning" id="defend-ice">Defensive Mode</button>
                <button class="btn" id="evade-ice">Attempt Evasion</button>
              </div>
            </div>
            
            <div class="floor-map" id="floor-map" style="display: none;">
              <div class="section-title">Floor Map</div>
              <div class="map-nodes" id="map-nodes"></div>
              <div class="progress-indicator" id="progress-indicator"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other tabs remain the same -->
      <div class="tab-content" data-content="simulation">
        <div class="simulation-panel">
          <div class="netrunner-stats">
            <div class="section-title">Netrunner</div>
            <div class="controls">
              <button class="btn primary" id="generate-netrunner">Generate NPC</button>
            </div>
            <div id="netrunner-info">
              <div class="stat-row">
                <span class="stat-label">Name:</span>
                <span class="stat-value" id="runner-name">-</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Interface:</span>
                <span class="stat-value" id="runner-interface">-</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Speed:</span>
                <span class="stat-value" id="runner-speed">-</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Defense:</span>
                <span class="stat-value" id="runner-defense">-</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">HP:</span>
                <span class="stat-value" id="runner-hp">-</span>
              </div>
            </div>
            <div class="section-title" style="margin-top: 20px;">Programs</div>
            <div id="runner-programs"></div>
            <div class="controls" style="margin-top: 15px;">
              <button class="btn" id="start-simulation">Start Run</button>
              <button class="btn warning" id="step-simulation">Step</button>
              <button class="btn danger" id="stop-simulation">Stop</button>
            </div>
          </div>
          <div class="action-log">
            <div class="section-title">Action Log</div>
            <div id="simulation-log"></div>
          </div>
        </div>
      </div>

      <div class="tab-content" data-content="programs">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <div class="section-title">Programs</div>
            <div id="program-list"></div>
          </div>
          <div>
            <div class="section-title">ICE Types</div>
            <div id="ice-list"></div>
          </div>
        </div>
      </div>

      <div class="tab-content" data-content="visualizer">
        <div class="visualizer">
          <div class="visualizer-screen" id="viz-screen"></div>
          <div class="visualizer-controls">
            <div class="section-title">Visualization Controls</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
              <button class="btn" data-viz="scan">Scanner Sweep</button>
              <button class="btn" data-viz="ice-wall">ICE Wall</button>
              <button class="btn" data-viz="ice-break">ICE Breaker</button>
              <button class="btn" data-viz="data-stream">Data Stream</button>
              <button class="btn" data-viz="trace">Trace Alert</button>
              <button class="btn" data-viz="jack-out">Jack Out</button>
              <button class="btn primary" data-viz="full-sequence">Full Sequence</button>
              <button class="btn danger" id="clear-viz">Clear</button>
            </div>
          </div>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(container);
    
    // Import visualizer styles from the advanced version
    const vizStyle = document.createElement('style');
    vizStyle.textContent = `
      .visualizer {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .visualizer-screen {
        flex: 1;
        background: #000;
        border: 2px solid #0ff;
        position: relative;
        overflow: hidden;
      }
      
      .visualizer-controls {
        padding: 15px;
        background: rgba(0,255,255,0.1);
        border-top: 2px solid #0ff;
      }
      
      .scan-line {
        position: absolute;
        height: 2px;
        background: linear-gradient(90deg, transparent, #0ff, transparent);
        width: 100%;
        animation: scan 2s linear;
      }
      
      @keyframes scan {
        from { transform: translateY(-100%); }
        to { transform: translateY(100vh); }
      }
      
      .ice-wall {
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, transparent, rgba(255,0,0,0.3), rgba(255,0,0,0.8));
        transform: translateY(100%);
        animation: iceApproach 3s ease-in;
      }
      
      @keyframes iceApproach {
        to { transform: translateY(0); }
      }
      
      .ice-break {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(0,255,0,0.8), transparent);
        opacity: 0;
        animation: breakIce 0.5s ease-out 3s forwards;
      }
      
      @keyframes breakIce {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; }
        100% { opacity: 0; transform: scale(2); }
      }
      
      @keyframes dataFall {
        to { top: 100%; }
      }
      
      @keyframes tracePulse {
        0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
      }
    `;
    this.shadowRoot.appendChild(vizStyle);
  }

  setupEventListeners() {
    // Tab switching
    this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Architecture explorer
    this.shadowRoot.getElementById('generate-arch').addEventListener('click', () => this.generateArchitecture());
    this.shadowRoot.getElementById('add-floor').addEventListener('click', () => this.addFloor());
    
    // Node interactions
    this.shadowRoot.getElementById('interact-btn').addEventListener('click', () => this.interactWithNode());
    this.shadowRoot.getElementById('bypass-btn').addEventListener('click', () => this.attemptBypass());
    this.shadowRoot.getElementById('next-node-btn').addEventListener('click', () => this.nextNode());
    this.shadowRoot.getElementById('jack-out-btn').addEventListener('click', () => this.jackOut());
    
    // ICE combat
    this.shadowRoot.getElementById('attack-ice').addEventListener('click', () => this.combatICE('attack'));
    this.shadowRoot.getElementById('defend-ice').addEventListener('click', () => this.combatICE('defend'));
    this.shadowRoot.getElementById('evade-ice').addEventListener('click', () => this.combatICE('evade'));

    // Simulation tab
    this.shadowRoot.getElementById('generate-netrunner').addEventListener('click', () => this.generateNetrunner());
    this.shadowRoot.getElementById('start-simulation').addEventListener('click', () => this.startSimulation());
    this.shadowRoot.getElementById('step-simulation').addEventListener('click', () => this.stepSimulation());
    this.shadowRoot.getElementById('stop-simulation').addEventListener('click', () => this.stopSimulation());

    // Visualizer
    this.shadowRoot.querySelectorAll('[data-viz]').forEach(btn => {
      btn.addEventListener('click', () => this.playVisualization(btn.dataset.viz));
    });
    this.shadowRoot.getElementById('clear-viz').addEventListener('click', () => this.clearVisualization());

    // Initialize program and ICE lists
    this.populateProgramsAndICE();
  }

  switchTab(tabName) {
    this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    this.shadowRoot.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.dataset.content === tabName);
    });
  }

  generateArchitecture() {
    const difficulties = ['Basic', 'Standard', 'Advanced', 'Expert'];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const floors = difficulty === 'Basic' ? 3 : difficulty === 'Standard' ? 5 : difficulty === 'Advanced' ? 7 : 10;
    
    this.architecture = {
      name: `${['Corporate', 'Government', 'Criminal', 'Research'][Math.floor(Math.random() * 4)]} Network`,
      difficulty: difficulty,
      floors: []
    };

    // Generate floors with more detailed nodes
    for (let i = 1; i <= floors; i++) {
      this.architecture.floors.push(this.generateFloor(i));
    }

    this.displayArchitecture();
    this.currentFloor = 1;
    this.currentNodeIndex = 0;
    this.floorProgress = {};
    this.startExploration();
  }

  generateFloor(level) {
    const floorTypes = {
      1: ['Lobby', 'Entry Node', 'Gateway'],
      2: ['Password Gate', 'Authentication', 'Security Check'],
      3: ['File Server', 'Data Repository', 'Archive'],
      4: ['Control Systems', 'Network Hub', 'Router'],
      5: ['Core Systems', 'Main Database', 'Central Processing']
    };

    const type = floorTypes[Math.min(level, 5)][Math.floor(Math.random() * 3)];
    const nodes = [];

    // Generate nodes with narrative content
    const nodeCount = 3 + Math.floor(Math.random() * 4);
    const nodeTypes = ['password', 'file', 'control', 'ice', 'data'];
    
    for (let i = 0; i < nodeCount; i++) {
      const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      nodes.push({
        id: `F${level}N${i}`,
        type: nodeType,
        narrative: this.getRandomNarrative(nodeType),
        completed: false,
        ice: nodeType === 'ice' ? this.randomICE() : null
      });
    }

    return {
      level: level,
      name: type,
      nodes: nodes,
      completed: false
    };
  }

  getRandomNarrative(type) {
    const narratives = this.nodeNarratives[type];
    return narratives[Math.floor(Math.random() * narratives.length)];
  }

  randomICE() {
    const iceNames = Object.keys(this.iceTypes);
    return iceNames[Math.floor(Math.random() * iceNames.length)];
  }

  displayArchitecture() {
    const container = this.shadowRoot.getElementById('floor-container');
    container.innerHTML = '';

    this.architecture.floors.forEach(floor => {
      const floorDiv = document.createElement('div');
      floorDiv.className = 'floor-item';
      if (floor.completed) floorDiv.classList.add('completed');
      
      floorDiv.innerHTML = `
        <div class="floor-number">Floor ${floor.level}: ${floor.name}</div>
        <div class="floor-content">
          Nodes: ${floor.nodes.length} | Progress: ${floor.nodes.filter(n => n.completed).length}/${floor.nodes.length}
        </div>
      `;
      floorDiv.addEventListener('click', () => this.selectFloor(floor.level));
      container.appendChild(floorDiv);
    });
  }

  selectFloor(level) {
    if (level > this.currentFloor + 1) {
      this.showNarrative("You must complete previous floors first!");
      return;
    }
    
    this.currentFloor = level;
    this.currentNodeIndex = 0;
    this.startExploration();
    
    // Update active floor visual
    this.shadowRoot.querySelectorAll('.floor-item').forEach((item, index) => {
      item.classList.toggle('active', index === level - 1);
    });
  }

  startExploration() {
    const floor = this.architecture.floors[this.currentFloor - 1];
    const node = floor.nodes[this.currentNodeIndex];
    
    this.shadowRoot.getElementById('action-area').style.display = 'flex';
    this.shadowRoot.getElementById('floor-map').style.display = 'block';
    
    this.displayNode(node);
    this.displayFloorMap();
  }

  displayNode(node) {
    // Update node info
    const nodeInfo = this.shadowRoot.getElementById('current-node-info');
    nodeInfo.style.display = 'flex';
    
    const icons = {
      password: '🔒',
      file: '📁',
      control: '⚙️',
      ice: '🛡️',
      data: '💾'
    };
    
    this.shadowRoot.getElementById('node-icon').textContent = icons[node.type];
    this.shadowRoot.getElementById('node-type').textContent = node.type.toUpperCase();
    this.shadowRoot.getElementById('node-id').textContent = node.id;
    
    // Show narrative
    this.showNarrative(node.narrative);
    
    // Handle ICE encounters
    if (node.type === 'ice' && node.ice && !node.completed) {
      this.encounterICE(node.ice);
    } else {
      this.shadowRoot.getElementById('ice-encounter').style.display = 'none';
    }
    
    // Update button states
    const nextBtn = this.shadowRoot.getElementById('next-node-btn');
    const floor = this.architecture.floors[this.currentFloor - 1];
    nextBtn.disabled = this.currentNodeIndex >= floor.nodes.length - 1;
  }

  displayFloorMap() {
    const floor = this.architecture.floors[this.currentFloor - 1];
    const mapNodes = this.shadowRoot.getElementById('map-nodes');
    const progress = this.shadowRoot.getElementById('progress-indicator');
    
    mapNodes.innerHTML = '';
    progress.innerHTML = '';
    
    floor.nodes.forEach((node, index) => {
      // Map node
      const mapNode = document.createElement('div');
      mapNode.className = `map-node ${node.type}`;
      if (index === this.currentNodeIndex) mapNode.classList.add('current');
      if (node.completed) mapNode.classList.add('completed');
      
      const icons = {
        password: '🔒',
        file: '📁', 
        control: '⚙️',
        ice: '🛡️',
        data: '💾'
      };
      
      mapNode.textContent = icons[node.type];
      mapNode.addEventListener('click', () => {
        if (index <= this.currentNodeIndex || node.completed) {
          this.currentNodeIndex = index;
          this.displayNode(node);
        }
      });
      
      if (index < floor.nodes.length - 1) {
        const connection = document.createElement('div');
        connection.className = 'map-connection';
        mapNode.appendChild(connection);
      }
      
      mapNodes.appendChild(mapNode);
      
      // Progress dot
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (index === this.currentNodeIndex) dot.classList.add('active');
      if (node.completed) dot.classList.add('completed');
      progress.appendChild(dot);
    });
  }

  showNarrative(text) {
    const narrativeText = this.shadowRoot.getElementById('narrative-text');
    narrativeText.textContent = text;
    
    // Clear previous result
    const resultMsg = this.shadowRoot.getElementById('result-message');
    resultMsg.style.display = 'none';
  }

  interactWithNode() {
    const floor = this.architecture.floors[this.currentFloor - 1];
    const node = floor.nodes[this.currentNodeIndex];
    
    if (node.completed) {
      this.showResult("You've already accessed this node.", 'success');
      return;
    }
    
    // Simulate interaction with dice roll
    const roll = Math.floor(Math.random() * 10) + 1;
    const difficulty = 6; // Base difficulty
    
    if (roll >= difficulty) {
      const results = this.actionResults[node.type];
      if (results && results.success) {
        const message = results.success[Math.floor(Math.random() * results.success.length)];
        this.showResult(message, 'success');
        node.completed = true;
        this.checkFloorCompletion();
      }
    } else {
      const results = this.actionResults[node.type];
      if (results && results.failure) {
        const message = results.failure[Math.floor(Math.random() * results.failure.length)];
        this.showResult(message, 'failure');
      }
    }
    
    this.displayFloorMap();
  }

  attemptBypass() {
    const floor = this.architecture.floors[this.currentFloor - 1];
    const node = floor.nodes[this.currentNodeIndex];
    
    this.showResult("Attempting to bypass node security... Roll Interface + 1d10 vs DV15", 'info');
    
    // Could trigger additional consequences
    if (Math.random() > 0.7) {
      this.showResult("Bypass failed! Security trace initiated!", 'failure');
    }
  }

  nextNode() {
    const floor = this.architecture.floors[this.currentFloor - 1];
    
    if (this.currentNodeIndex < floor.nodes.length - 1) {
      this.currentNodeIndex++;
      const node = floor.nodes[this.currentNodeIndex];
      this.displayNode(node);
      this.displayFloorMap();
    }
  }

  jackOut() {
    this.showNarrative("Emergency jack out initiated! You disconnect from the network...");
    this.shadowRoot.getElementById('action-area').style.display = 'none';
    this.shadowRoot.getElementById('ice-encounter').style.display = 'none';
    this.shadowRoot.getElementById('floor-map').style.display = 'none';
    this.shadowRoot.getElementById('current-node-info').style.display = 'none';
  }

  encounterICE(iceName) {
    const ice = this.iceTypes[iceName];
    const encounter = this.shadowRoot.getElementById('ice-encounter');
    
    encounter.style.display = 'block';
    this.shadowRoot.getElementById('ice-name').textContent = `${iceName.toUpperCase()} DETECTED`;
    this.shadowRoot.getElementById('ice-type').textContent = ice.type;
    this.shadowRoot.getElementById('ice-strength').textContent = ice.strength;
    this.shadowRoot.getElementById('ice-damage').textContent = ice.damage;
    
    // Show ICE encounter narrative
    this.showNarrative(this.iceEncounters[iceName]);
  }

  combatICE(action) {
    const floor = this.architecture.floors[this.currentFloor - 1];
    const node = floor.nodes[this.currentNodeIndex];
    
    switch(action) {
      case 'attack':
        this.showResult("Roll Interface + 1d10 to attack. ICE defends with Strength + 1d10", 'info');
        // Simulate combat
        if (Math.random() > 0.5) {
          this.showResult("ICE destroyed! The path is clear.", 'success');
          node.completed = true;
          this.shadowRoot.getElementById('ice-encounter').style.display = 'none';
          this.checkFloorCompletion();
        } else {
          this.showResult("Attack failed! ICE retaliates - take damage!", 'failure');
        }
        break;
        
      case 'defend':
        this.showResult("Defensive stance activated. +2 to defense against ICE attacks.", 'info');
        break;
        
      case 'evade':
        this.showResult("Attempting to slip past the ICE... Roll Speed + 1d10 vs ICE Strength", 'info');
        if (Math.random() > 0.6) {
          this.showResult("Evasion successful! You slip past undetected.", 'success');
          node.completed = true;
          this.shadowRoot.getElementById('ice-encounter').style.display = 'none';
          this.checkFloorCompletion();
        } else {
          this.showResult("Evasion failed! The ICE blocks your path.", 'failure');
        }
        break;
    }
    
    this.displayFloorMap();
  }

  showResult(message, type) {
    const resultMsg = this.shadowRoot.getElementById('result-message');
    resultMsg.textContent = message;
    resultMsg.className = `result-message ${type}`;
    resultMsg.style.display = 'block';
  }

  checkFloorCompletion() {
    const floor = this.architecture.floors[this.currentFloor - 1];
    const allCompleted = floor.nodes.every(n => n.completed);
    
    if (allCompleted) {
      floor.completed = true;
      this.displayArchitecture();
      this.showResult(`Floor ${this.currentFloor} completed! You may proceed to the next floor.`, 'success');
    }
  }

  addFloor() {
    if (!this.architecture) {
      alert('Generate an architecture first!');
      return;
    }
    
    const newLevel = this.architecture.floors.length + 1;
    this.architecture.floors.push(this.generateFloor(newLevel));
    this.displayArchitecture();
  }

  // Keep all the other methods from the advanced version (simulation, programs, visualizer)
  generateNetrunner() {
    const names = ['Ghost', 'Phantom', 'Cipher', 'Null', 'Vector', 'Nexus', 'Echo', 'Flux'];
    const surnames = ['Runner', 'Hacker', 'Breaker', 'Spider', 'Shadow', 'Wire', 'Code', 'Byte'];
    
    this.activeNetrunner = {
      name: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
      interface: 4 + Math.floor(Math.random() * 4),
      speed: 3 + Math.floor(Math.random() * 3),
      defense: 10 + Math.floor(Math.random() * 5),
      hp: 20 + Math.floor(Math.random() * 11),
      maxHp: 20 + Math.floor(Math.random() * 11),
      programs: []
    };
    
    const programNames = Object.keys(this.availablePrograms);
    const programCount = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < programCount; i++) {
      const program = programNames[Math.floor(Math.random() * programNames.length)];
      if (!this.activeNetrunner.programs.includes(program)) {
        this.activeNetrunner.programs.push(program);
      }
    }
    
    this.displayNetrunner();
  }

  displayNetrunner() {
    this.shadowRoot.getElementById('runner-name').textContent = this.activeNetrunner.name;
    this.shadowRoot.getElementById('runner-interface').textContent = this.activeNetrunner.interface;
    this.shadowRoot.getElementById('runner-speed').textContent = this.activeNetrunner.speed;
    this.shadowRoot.getElementById('runner-defense').textContent = this.activeNetrunner.defense;
    this.shadowRoot.getElementById('runner-hp').textContent = `${this.activeNetrunner.hp}/${this.activeNetrunner.maxHp}`;
    
    const programsDiv = this.shadowRoot.getElementById('runner-programs');
    programsDiv.innerHTML = '';
    this.activeNetrunner.programs.forEach(prog => {
      const progDiv = document.createElement('div');
      progDiv.className = 'program-slot';
      progDiv.innerHTML = `
        <span>${prog}</span>
        <span>${this.availablePrograms[prog].cost} RAM</span>
      `;
      programsDiv.appendChild(progDiv);
    });
  }

  startSimulation() {
    if (!this.activeNetrunner || !this.architecture) {
      alert('Generate a netrunner and architecture first!');
      return;
    }
    
    this.combatLog = [];
    this.addLog('=== NETRUN INITIATED ===', 'info');
    this.addLog(`${this.activeNetrunner.name} jacks into ${this.architecture.name}`, 'info');
    
    this.currentSimFloor = 1;
    this.simulateFloor();
  }

  simulateFloor() {
    const floor = this.architecture.floors[this.currentSimFloor - 1];
    this.addLog(`\n--- FLOOR ${this.currentSimFloor}: ${floor.name} ---`, 'warning');
    
    floor.nodes.forEach(node => {
      this.addLog(`Accessing ${node.type} node ${node.id}...`, 'info');
      
      if (node.type === 'ice' && node.ice) {
        const ice = this.iceTypes[node.ice];
        this.addLog(`ICE DETECTED: ${node.ice} (Strength: ${ice.strength})`, 'danger');
        
        const attackRoll = Math.floor(Math.random() * 10) + this.activeNetrunner.interface;
        const defenseRoll = Math.floor(Math.random() * 10) + ice.strength;
        
        if (attackRoll > defenseRoll) {
          this.addLog(`${this.activeNetrunner.name} breaks through the ICE!`, 'success');
        } else {
          const damage = Math.floor(Math.random() * 6) + 1;
          this.activeNetrunner.hp -= damage;
          this.addLog(`ICE attacks! ${damage} damage dealt`, 'danger');
          this.displayNetrunner();
          
          if (this.activeNetrunner.hp <= 0) {
            this.addLog(`${this.activeNetrunner.name} flatlined!`, 'danger');
            return;
          }
        }
      }
    });
  }

  stepSimulation() {
    if (this.currentSimFloor < this.architecture.floors.length) {
      this.currentSimFloor++;
      this.simulateFloor();
    } else {
      this.addLog(`\n=== NETRUN COMPLETE ===`, 'success');
    }
  }

  stopSimulation() {
    this.addLog(`\n=== EMERGENCY JACK OUT ===`, 'danger');
  }

  addLog(message, type = 'info') {
    const log = this.shadowRoot.getElementById('simulation-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  populateProgramsAndICE() {
    const programList = this.shadowRoot.getElementById('program-list');
    Object.entries(this.availablePrograms).forEach(([name, details]) => {
      const div = document.createElement('div');
      div.className = 'program-slot';
      div.innerHTML = `
        <div>
          <strong>${name}</strong> (${details.cost} RAM)
          <div style="font-size: 11px; opacity: 0.7; margin-top: 3px;">
            Type: ${details.type} | ${details.effect}
          </div>
        </div>
      `;
      programList.appendChild(div);
    });

    const iceList = this.shadowRoot.getElementById('ice-list');
    Object.entries(this.iceTypes).forEach(([name, details]) => {
      const div = document.createElement('div');
      div.className = 'program-slot';
      div.style.borderColor = details.type === 'Black' ? '#f00' : details.type === 'Gray' ? '#888' : '#fff';
      div.innerHTML = `
        <div>
          <strong>${name}</strong> (${details.type} ICE)
          <div style="font-size: 11px; opacity: 0.7; margin-top: 3px;">
            STR: ${details.strength} | DMG: ${details.damage} | ${details.effect}
          </div>
        </div>
      `;
      iceList.appendChild(div);
    });
  }

  // Visualizer methods remain the same
  playVisualization(type) {
    const screen = this.shadowRoot.getElementById('viz-screen');
    
    switch(type) {
      case 'scan':
        this.animateScan(screen);
        break;
      case 'ice-wall':
        this.animateIceWall(screen);
        break;
      case 'ice-break':
        this.animateIceBreak(screen);
        break;
      case 'data-stream':
        this.animateDataStream(screen);
        break;
      case 'trace':
        this.animateTrace(screen);
        break;
      case 'jack-out':
        this.animateJackOut(screen);
        break;
      case 'full-sequence':
        this.animateFullSequence(screen);
        break;
    }
  }

  animateScan(screen) {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const scan = document.createElement('div');
        scan.className = 'scan-line';
        scan.style.top = (i * 20) + '%';
        screen.appendChild(scan);
        setTimeout(() => scan.remove(), 2000);
      }, i * 400);
    }
  }

  animateIceWall(screen) {
    const wall = document.createElement('div');
    wall.className = 'ice-wall';
    screen.appendChild(wall);
    setTimeout(() => wall.remove(), 4000);
  }

  animateIceBreak(screen) {
    const wall = document.createElement('div');
    wall.className = 'ice-wall';
    screen.appendChild(wall);
    
    setTimeout(() => {
      const breaker = document.createElement('div');
      breaker.className = 'ice-break';
      screen.appendChild(breaker);
      setTimeout(() => {
        wall.remove();
        breaker.remove();
      }, 1000);
    }, 2000);
  }

  animateDataStream(screen) {
    const chars = '01';
    for (let i = 0; i < 20; i++) {
      const stream = document.createElement('div');
      stream.style.position = 'absolute';
      stream.style.left = (Math.random() * 100) + '%';
      stream.style.top = '-20px';
      stream.style.color = '#0f0';
      stream.style.fontSize = '14px';
      stream.style.animation = 'dataFall 3s linear';
      
      let text = '';
      for (let j = 0; j < 20; j++) {
        text += chars[Math.floor(Math.random() * 2)];
      }
      stream.textContent = text;
      
      screen.appendChild(stream);
      setTimeout(() => stream.remove(), 3000);
    }
  }

  animateTrace(screen) {
    const trace = document.createElement('div');
    trace.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #f00;
      font-size: 48px;
      font-weight: bold;
      text-shadow: 0 0 20px #f00;
      animation: tracePulse 1s infinite;
    `;
    trace.textContent = 'TRACE DETECTED';
    screen.appendChild(trace);
    setTimeout(() => trace.remove(), 3000);
  }

  animateJackOut(screen) {
    screen.style.background = '#fff';
    setTimeout(() => {
      screen.style.background = '#000';
      const text = document.createElement('div');
      text.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #0ff;
        font-size: 24px;
        text-align: center;
      `;
      text.textContent = 'CONNECTION TERMINATED';
      screen.appendChild(text);
      setTimeout(() => text.remove(), 2000);
    }, 200);
  }

  animateFullSequence(screen) {
    this.animateScan(screen);
    setTimeout(() => this.animateIceWall(screen), 2000);
    setTimeout(() => this.animateIceBreak(screen), 4000);
    setTimeout(() => this.animateDataStream(screen), 6000);
    setTimeout(() => this.animateTrace(screen), 8000);
    setTimeout(() => this.animateJackOut(screen), 10000);
  }

  clearVisualization() {
    const screen = this.shadowRoot.getElementById('viz-screen');
    screen.innerHTML = '';
    screen.style.background = '#000';
  }
}

customElements.define('netrunning-enhanced', EnhancedNetrunningInterface);