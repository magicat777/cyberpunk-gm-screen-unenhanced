// Advanced Netrunning Interface for GMs
class AdvancedNetrunningInterface extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Game state
    this.architecture = null;
    this.activeNetrunner = null;
    this.currentFloor = 1;
    this.programs = [];
    this.trace = 0;
    this.actions = [];
    this.combatLog = [];
    
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

      /* Architecture Builder */
      .architecture-builder {
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

      .architecture-view {
        background: rgba(0,20,40,0.3);
        border: 1px solid #0ff;
        padding: 20px;
        position: relative;
      }

      /* Flow Diagram */
      .flow-diagram {
        position: relative;
        min-height: 400px;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 40px,
          rgba(0,255,255,0.05) 40px,
          rgba(0,255,255,0.05) 41px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 40px,
          rgba(0,255,255,0.05) 40px,
          rgba(0,255,255,0.05) 41px
        );
      }

      .flow-node {
        position: absolute;
        background: rgba(0,255,255,0.2);
        border: 2px solid #0ff;
        padding: 10px 15px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
        min-width: 100px;
      }

      .flow-node:hover {
        background: rgba(0,255,255,0.4);
        box-shadow: 0 0 20px #0ff;
        transform: scale(1.05);
      }

      .flow-node.ice {
        background: rgba(255,0,0,0.2);
        border-color: #f00;
      }

      .flow-node.program {
        background: rgba(0,255,0,0.2);
        border-color: #0f0;
      }

      .flow-node.data {
        background: rgba(255,255,0,0.2);
        border-color: #ff0;
      }

      .flow-node.control {
        background: rgba(255,0,255,0.2);
        border-color: #f0f;
      }

      .flow-connection {
        position: absolute;
        height: 2px;
        background: #0ff;
        transform-origin: left center;
        pointer-events: none;
      }

      .flow-connection.active {
        background: #0f0;
        box-shadow: 0 0 5px #0f0;
        animation: pulse 1s infinite;
      }

      @keyframes pulse {
        50% { opacity: 0.5; }
      }

      /* Simulation Panel */
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

      .stat-label {
        opacity: 0.7;
      }

      .stat-value {
        font-weight: bold;
        color: #0f0;
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

      .log-entry.success {
        color: #0f0;
        border-color: #0f0;
      }

      .log-entry.danger {
        color: #f00;
        border-color: #f00;
      }

      .log-entry.info {
        color: #0ff;
        border-color: #0ff;
      }

      .log-entry.warning {
        color: #ff0;
        border-color: #ff0;
      }

      /* Control Buttons */
      .controls {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        flex-wrap: wrap;
      }

      .btn {
        background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
        border: 2px solid #0ff;
        color: #0ff;
        padding: 8px 16px;
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

      /* Visualizer Tab */
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

      /* Input Fields */
      input, select {
        background: rgba(0,255,255,0.1);
        border: 1px solid #0ff;
        color: #0ff;
        padding: 5px 10px;
        font-family: inherit;
        font-size: 12px;
      }

      input:focus, select:focus {
        outline: none;
        box-shadow: 0 0 5px #0ff;
      }

      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: #f0f;
        margin-bottom: 15px;
        text-transform: uppercase;
        text-shadow: 0 0 5px #f0f;
      }

      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .help-text {
        font-size: 11px;
        color: #888;
        margin-top: 5px;
      }

      /* Animation classes for visualizer */
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
    `;
    this.shadowRoot.appendChild(style);
  }

  setupHTML() {
    const container = document.createElement('div');
    container.className = 'container';
    container.innerHTML = `
      <div class="tab-header">
        <div class="tab active" data-tab="architecture">Architecture Builder</div>
        <div class="tab" data-tab="simulation">Netrun Simulation</div>
        <div class="tab" data-tab="programs">Programs & ICE</div>
        <div class="tab" data-tab="visualizer">Visualizer</div>
      </div>

      <!-- Architecture Builder Tab -->
      <div class="tab-content active" data-content="architecture">
        <div class="architecture-builder">
          <div class="floor-list">
            <div class="section-title">Architecture Floors</div>
            <div class="controls">
              <button class="btn primary" id="generate-arch">Generate</button>
              <button class="btn" id="add-floor">Add Floor</button>
            </div>
            <div id="floor-container"></div>
          </div>
          <div class="architecture-view">
            <div class="section-title">Floor Layout</div>
            <div class="flow-diagram" id="floor-diagram"></div>
            <div class="controls" style="margin-top: 15px;">
              <select id="node-type">
                <option value="password">Password</option>
                <option value="file">File</option>
                <option value="control">Control Node</option>
                <option value="ice">ICE</option>
                <option value="data">Data Store</option>
              </select>
              <button class="btn" id="add-node">Add Node</button>
              <button class="btn danger" id="clear-floor">Clear Floor</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Simulation Tab -->
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

      <!-- Programs & ICE Tab -->
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

      <!-- Visualizer Tab -->
      <div class="tab-content" data-content="visualizer">
        <div class="visualizer">
          <div class="visualizer-screen" id="viz-screen"></div>
          <div class="visualizer-controls">
            <div class="section-title">Visualization Controls</div>
            <div class="grid-2">
              <button class="btn" data-viz="scan">Scanner Sweep</button>
              <button class="btn" data-viz="ice-wall">ICE Wall Approach</button>
              <button class="btn" data-viz="ice-break">ICE Breaker Attack</button>
              <button class="btn" data-viz="data-stream">Data Stream</button>
              <button class="btn" data-viz="trace">Trace Alert</button>
              <button class="btn" data-viz="jack-out">Emergency Jack Out</button>
              <button class="btn primary" data-viz="full-sequence">Full Sequence</button>
              <button class="btn danger" id="clear-viz">Clear</button>
            </div>
            <div class="help-text">Click buttons to play visualization effects</div>
          </div>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(container);
  }

  setupEventListeners() {
    // Tab switching
    this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Architecture builder
    this.shadowRoot.getElementById('generate-arch').addEventListener('click', () => this.generateArchitecture());
    this.shadowRoot.getElementById('add-floor').addEventListener('click', () => this.addFloor());
    this.shadowRoot.getElementById('add-node').addEventListener('click', () => this.addNode());
    this.shadowRoot.getElementById('clear-floor').addEventListener('click', () => this.clearFloor());

    // Simulation
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

    // Generate floors
    for (let i = 1; i <= floors; i++) {
      this.architecture.floors.push(this.generateFloor(i));
    }

    this.displayArchitecture();
    this.currentFloor = 1;
    this.displayFloor(1);
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

    // Generate nodes for this floor
    const nodeCount = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: `F${level}N${i}`,
        type: ['password', 'file', 'control', 'ice', 'data'][Math.floor(Math.random() * 5)],
        x: 50 + (i % 3) * 150,
        y: 50 + Math.floor(i / 3) * 100
      });
    }

    return {
      level: level,
      name: type,
      nodes: nodes,
      ice: level > 2 ? this.randomICE() : null
    };
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
      floorDiv.innerHTML = `
        <div class="floor-number">Floor ${floor.level}: ${floor.name}</div>
        <div class="floor-content">
          Nodes: ${floor.nodes.length} | ICE: ${floor.ice || 'None'}
        </div>
      `;
      floorDiv.addEventListener('click', () => this.displayFloor(floor.level));
      container.appendChild(floorDiv);
    });
  }

  displayFloor(level) {
    this.currentFloor = level;
    const floor = this.architecture.floors[level - 1];
    const diagram = this.shadowRoot.getElementById('floor-diagram');
    diagram.innerHTML = '';

    // Update active floor
    this.shadowRoot.querySelectorAll('.floor-item').forEach((item, index) => {
      item.classList.toggle('active', index === level - 1);
    });

    // Display nodes
    floor.nodes.forEach(node => {
      const nodeDiv = document.createElement('div');
      nodeDiv.className = `flow-node ${node.type}`;
      nodeDiv.style.left = node.x + 'px';
      nodeDiv.style.top = node.y + 'px';
      nodeDiv.innerHTML = `
        <div>${node.type.toUpperCase()}</div>
        <div style="font-size: 10px; opacity: 0.7;">${node.id}</div>
      `;
      diagram.appendChild(nodeDiv);
    });

    // Draw connections
    for (let i = 0; i < floor.nodes.length - 1; i++) {
      const from = floor.nodes[i];
      const to = floor.nodes[i + 1];
      this.drawConnection(from, to, diagram);
    }
  }

  drawConnection(from, to, container) {
    const connection = document.createElement('div');
    connection.className = 'flow-connection';
    
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    connection.style.left = (from.x + 50) + 'px';
    connection.style.top = (from.y + 25) + 'px';
    connection.style.width = length + 'px';
    connection.style.transform = `rotate(${angle}deg)`;
    
    container.appendChild(connection);
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

  addNode() {
    if (!this.architecture) return;
    
    const floor = this.architecture.floors[this.currentFloor - 1];
    const type = this.shadowRoot.getElementById('node-type').value;
    const node = {
      id: `F${this.currentFloor}N${floor.nodes.length}`,
      type: type,
      x: 50 + (floor.nodes.length % 3) * 150,
      y: 50 + Math.floor(floor.nodes.length / 3) * 100
    };
    
    floor.nodes.push(node);
    this.displayFloor(this.currentFloor);
  }

  clearFloor() {
    if (!this.architecture) return;
    
    const floor = this.architecture.floors[this.currentFloor - 1];
    floor.nodes = [];
    this.displayFloor(this.currentFloor);
  }

  generateNetrunner() {
    const names = ['Ghost', 'Phantom', 'Cipher', 'Null', 'Vector', 'Nexus', 'Echo', 'Flux'];
    const surnames = ['Runner', 'Hacker', 'Breaker', 'Spider', 'Shadow', 'Wire', 'Code', 'Byte'];
    
    this.activeNetrunner = {
      name: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
      interface: 4 + Math.floor(Math.random() * 4), // 4-7
      speed: 3 + Math.floor(Math.random() * 3), // 3-5
      defense: 10 + Math.floor(Math.random() * 5), // 10-14
      hp: 20 + Math.floor(Math.random() * 11), // 20-30
      maxHp: 20 + Math.floor(Math.random() * 11),
      programs: []
    };
    
    // Give random programs
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
    this.addLog(`Target: ${this.architecture.difficulty} architecture with ${this.architecture.floors.length} floors`, 'info');
    
    // Start on floor 1
    this.currentSimFloor = 1;
    this.simulateFloor();
  }

  simulateFloor() {
    const floor = this.architecture.floors[this.currentSimFloor - 1];
    this.addLog(`\n--- FLOOR ${this.currentSimFloor}: ${floor.name} ---`, 'warning');
    
    // Check for ICE
    if (floor.ice) {
      const ice = this.iceTypes[floor.ice];
      this.addLog(`ICE DETECTED: ${floor.ice} (Strength: ${ice.strength})`, 'danger');
      
      // Simulate combat
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
    
    // Process nodes
    floor.nodes.forEach(node => {
      this.addLog(`Accessing ${node.type} node ${node.id}...`, 'info');
      
      switch(node.type) {
        case 'data':
          this.addLog(`Data retrieved: ${['Personnel files', 'Financial records', 'Research data', 'Security codes'][Math.floor(Math.random() * 4)]}`, 'success');
          break;
        case 'control':
          this.addLog(`System control accessed: ${['Cameras disabled', 'Alarms silenced', 'Doors unlocked'][Math.floor(Math.random() * 3)]}`, 'success');
          break;
        case 'password':
          this.addLog(`Password cracked using ${this.activeNetrunner.programs[0] || 'brute force'}`, 'success');
          break;
      }
    });
  }

  stepSimulation() {
    if (this.currentSimFloor < this.architecture.floors.length) {
      this.currentSimFloor++;
      this.simulateFloor();
    } else {
      this.addLog(`\n=== NETRUN COMPLETE ===`, 'success');
      this.addLog(`${this.activeNetrunner.name} successfully navigated all floors!`, 'success');
    }
  }

  stopSimulation() {
    this.addLog(`\n=== EMERGENCY JACK OUT ===`, 'danger');
    this.addLog(`${this.activeNetrunner.name} forcibly disconnected`, 'warning');
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
    // Programs
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

    // ICE
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

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes dataFall {
        to { top: 100%; }
      }
    `;
    screen.appendChild(style);
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
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes tracePulse {
        0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
      }
    `;
    
    screen.appendChild(style);
    screen.appendChild(trace);
    setTimeout(() => {
      trace.remove();
      style.remove();
    }, 3000);
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

customElements.define('netrunning-advanced', AdvancedNetrunningInterface);