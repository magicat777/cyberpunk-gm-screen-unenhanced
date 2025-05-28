// Netrunning Interface Implementation
class NetrunningInterface extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentTarget = null;
    this.programs = [];
    this.iceLevel = 0;
    this.neuralHealth = 100;
    this.dataStream = [];
    this.setupStyles();
    this.setupHTML();
    this.setupEventListeners();
    this.startAnimation();
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
        position: relative;
        overflow: hidden;
      }

      .netrun-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
        background: rgba(0,0,0,0.8);
      }

      /* Matrix rain background */
      .matrix-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        opacity: 0.1;
        z-index: 0;
      }

      .matrix-column {
        position: absolute;
        top: -100%;
        font-size: 10px;
        color: #0f0;
        animation: matrixFall linear infinite;
      }

      @keyframes matrixFall {
        to {
          top: 100%;
        }
      }

      .header {
        padding: 15px;
        background: rgba(0,255,255,0.1);
        border-bottom: 2px solid #0ff;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .title {
        font-size: 18px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 10px #0ff;
      }

      .status-bar {
        display: flex;
        gap: 20px;
        font-size: 12px;
      }

      .status-item {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .status-label {
        opacity: 0.7;
        text-transform: uppercase;
      }

      .status-value {
        color: #0f0;
        font-weight: bold;
      }

      .status-value.danger {
        color: #f00;
        animation: blink 0.5s infinite;
      }

      @keyframes blink {
        50% { opacity: 0.5; }
      }

      .main-content {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 15px;
        padding: 15px;
        overflow: hidden;
      }

      .cyberspace-view {
        background: rgba(0,20,40,0.3);
        border: 1px solid #0ff;
        border-radius: 4px;
        padding: 20px;
        position: relative;
        overflow: hidden;
      }

      .grid-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: 
          repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,255,255,0.1) 20px, rgba(0,255,255,0.1) 21px),
          repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,255,255,0.1) 20px, rgba(0,255,255,0.1) 21px);
        pointer-events: none;
      }

      .node {
        position: absolute;
        width: 60px;
        height: 60px;
        background: rgba(0,255,255,0.2);
        border: 2px solid #0ff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 24px;
      }

      .node:hover {
        background: rgba(0,255,255,0.4);
        box-shadow: 0 0 20px #0ff;
        transform: scale(1.1);
      }

      .node.ice {
        background: rgba(255,0,0,0.2);
        border-color: #f00;
      }

      .node.data {
        background: rgba(0,255,0,0.2);
        border-color: #0f0;
      }

      .node.system {
        background: rgba(255,255,0,0.2);
        border-color: #ff0;
      }

      .connection {
        position: absolute;
        height: 2px;
        background: #0ff;
        transform-origin: left center;
        opacity: 0.3;
      }

      .control-panel {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .section {
        background: rgba(0,255,255,0.05);
        border: 1px solid #0ff;
        border-radius: 4px;
        padding: 15px;
      }

      .section-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        text-transform: uppercase;
        color: #f0f;
      }

      .program-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .program {
        background: rgba(0,255,255,0.1);
        border: 1px solid #088;
        padding: 8px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .program:hover {
        background: rgba(0,255,255,0.2);
        border-color: #0ff;
        box-shadow: 0 0 10px #0ff;
      }

      .program-name {
        font-size: 12px;
        font-weight: bold;
      }

      .program-cost {
        font-size: 11px;
        color: #ff0;
      }

      .action-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .btn {
        background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
        border: 2px solid #0ff;
        color: #0ff;
        padding: 10px;
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

      .btn:active {
        transform: scale(0.95);
      }

      .btn.danger {
        border-color: #f00;
        color: #f00;
      }

      .btn.danger:hover {
        box-shadow: 0 0 15px #f00;
      }

      .data-stream {
        height: 100px;
        overflow-y: auto;
        background: #000;
        border: 1px solid #0ff;
        padding: 5px;
        font-family: monospace;
        font-size: 11px;
        scrollbar-width: thin;
        scrollbar-color: #0ff #000;
      }

      .data-stream::-webkit-scrollbar {
        width: 6px;
      }

      .data-stream::-webkit-scrollbar-track {
        background: #000;
      }

      .data-stream::-webkit-scrollbar-thumb {
        background: #0ff;
      }

      .stream-entry {
        margin-bottom: 2px;
        opacity: 0.8;
      }

      .stream-entry.success {
        color: #0f0;
      }

      .stream-entry.error {
        color: #f00;
      }

      .stream-entry.info {
        color: #0ff;
      }

      .neural-bar {
        height: 20px;
        background: #111;
        border: 1px solid #0ff;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
      }

      .neural-fill {
        height: 100%;
        background: linear-gradient(90deg, #0f0 0%, #0ff 100%);
        transition: width 0.3s;
        position: relative;
        overflow: hidden;
      }

      .neural-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: neuralPulse 2s infinite;
      }

      @keyframes neuralPulse {
        to { left: 100%; }
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  setupHTML() {
    const container = document.createElement('div');
    container.className = 'netrun-container';
    container.innerHTML = `
      <div class="matrix-bg" id="matrix-bg"></div>
      
      <div class="header">
        <div class="title">NETRUN INTERFACE v2.1</div>
        <div class="status-bar">
          <div class="status-item">
            <span class="status-label">ICE:</span>
            <span class="status-value" id="ice-level">0</span>
          </div>
          <div class="status-item">
            <span class="status-label">Neural:</span>
            <span class="status-value" id="neural-health">100%</span>
          </div>
          <div class="status-item">
            <span class="status-label">Trace:</span>
            <span class="status-value" id="trace-status">SAFE</span>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="cyberspace-view">
          <div class="grid-overlay"></div>
          <div id="node-container"></div>
        </div>

        <div class="control-panel">
          <div class="section">
            <div class="section-title">Programs</div>
            <div class="program-list">
              <div class="program" data-program="scanner">
                <span class="program-name">Scanner</span>
                <span class="program-cost">2 RAM</span>
              </div>
              <div class="program" data-program="icebreaker">
                <span class="program-name">ICE Breaker</span>
                <span class="program-cost">4 RAM</span>
              </div>
              <div class="program" data-program="stealth">
                <span class="program-name">Stealth Mode</span>
                <span class="program-cost">3 RAM</span>
              </div>
              <div class="program" data-program="dataleech">
                <span class="program-name">Data Leech</span>
                <span class="program-cost">5 RAM</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Actions</div>
            <div class="action-buttons">
              <button class="btn" id="jack-in">Jack In</button>
              <button class="btn danger" id="jack-out">Jack Out</button>
              <button class="btn" id="scan">Scan</button>
              <button class="btn" id="hack">Hack</button>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Neural Health</div>
            <div class="neural-bar">
              <div class="neural-fill" id="neural-bar" style="width: 100%"></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Data Stream</div>
            <div class="data-stream" id="data-stream"></div>
          </div>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(container);
  }

  setupEventListeners() {
    // Program selection
    this.shadowRoot.querySelectorAll('.program').forEach(prog => {
      prog.addEventListener('click', () => this.selectProgram(prog));
    });

    // Action buttons
    this.shadowRoot.getElementById('jack-in').addEventListener('click', () => this.jackIn());
    this.shadowRoot.getElementById('jack-out').addEventListener('click', () => this.jackOut());
    this.shadowRoot.getElementById('scan').addEventListener('click', () => this.performScan());
    this.shadowRoot.getElementById('hack').addEventListener('click', () => this.performHack());
  }

  startAnimation() {
    // Create matrix rain effect
    const matrixBg = this.shadowRoot.getElementById('matrix-bg');
    for (let i = 0; i < 20; i++) {
      const column = document.createElement('div');
      column.className = 'matrix-column';
      column.style.left = `${i * 5}%`;
      column.style.animationDuration = `${5 + Math.random() * 10}s`;
      column.style.animationDelay = `${Math.random() * 5}s`;
      
      // Random characters
      const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      let text = '';
      for (let j = 0; j < 50; j++) {
        text += chars[Math.floor(Math.random() * chars.length)] + '<br>';
      }
      column.innerHTML = text;
      
      matrixBg.appendChild(column);
    }
  }

  jackIn() {
    this.addToStream('Initiating neural connection...', 'info');
    setTimeout(() => {
      this.addToStream('Connection established', 'success');
      this.generateCyberspace();
    }, 1000);
  }

  jackOut() {
    this.addToStream('Disconnecting...', 'info');
    setTimeout(() => {
      this.addToStream('Safely disconnected', 'success');
      this.clearCyberspace();
      this.neuralHealth = 100;
      this.updateStatus();
    }, 500);
  }

  generateCyberspace() {
    const container = this.shadowRoot.getElementById('node-container');
    container.innerHTML = '';
    
    // Create nodes
    const nodeTypes = [
      { type: 'data', icon: '💾', count: 3 },
      { type: 'ice', icon: '🛡️', count: 2 },
      { type: 'system', icon: '⚙️', count: 2 }
    ];
    
    nodeTypes.forEach(nodeType => {
      for (let i = 0; i < nodeType.count; i++) {
        const node = document.createElement('div');
        node.className = `node ${nodeType.type}`;
        node.textContent = nodeType.icon;
        
        // Random position
        node.style.left = `${10 + Math.random() * 80}%`;
        node.style.top = `${10 + Math.random() * 80}%`;
        
        node.addEventListener('click', () => this.interactWithNode(node, nodeType.type));
        
        container.appendChild(node);
      }
    });
    
    this.addToStream('Cyberspace mapped', 'success');
  }

  clearCyberspace() {
    const container = this.shadowRoot.getElementById('node-container');
    container.innerHTML = '';
  }

  interactWithNode(node, type) {
    switch(type) {
      case 'data':
        this.addToStream('Accessing data node...', 'info');
        setTimeout(() => {
          this.addToStream('Data extracted: Corporate secrets', 'success');
          node.style.opacity = '0.3';
        }, 1000);
        break;
      case 'ice':
        this.addToStream('ICE detected! Deploying countermeasures...', 'error');
        this.iceLevel += 20;
        this.neuralHealth -= 10;
        this.updateStatus();
        break;
      case 'system':
        this.addToStream('System node accessed', 'info');
        break;
    }
  }

  performScan() {
    this.addToStream('Scanning network...', 'info');
    setTimeout(() => {
      this.addToStream('3 data nodes detected', 'success');
      this.addToStream('2 ICE barriers detected', 'error');
      this.addToStream('2 system nodes detected', 'info');
    }, 800);
  }

  performHack() {
    if (!this.currentTarget) {
      this.addToStream('No target selected', 'error');
      return;
    }
    
    this.addToStream('Initiating hack sequence...', 'info');
    setTimeout(() => {
      if (Math.random() > 0.5) {
        this.addToStream('Hack successful!', 'success');
      } else {
        this.addToStream('Hack failed! ICE counterattack!', 'error');
        this.neuralHealth -= 20;
        this.updateStatus();
      }
    }, 1500);
  }

  selectProgram(prog) {
    this.shadowRoot.querySelectorAll('.program').forEach(p => p.style.background = 'rgba(0,255,255,0.1)');
    prog.style.background = 'rgba(0,255,255,0.3)';
    this.addToStream(`Program loaded: ${prog.dataset.program}`, 'info');
  }

  addToStream(message, type = 'info') {
    const stream = this.shadowRoot.getElementById('data-stream');
    const entry = document.createElement('div');
    entry.className = `stream-entry ${type}`;
    entry.textContent = `> ${message}`;
    stream.appendChild(entry);
    stream.scrollTop = stream.scrollHeight;
  }

  updateStatus() {
    const iceLevel = this.shadowRoot.getElementById('ice-level');
    const neuralHealth = this.shadowRoot.getElementById('neural-health');
    const neuralBar = this.shadowRoot.getElementById('neural-bar');
    const traceStatus = this.shadowRoot.getElementById('trace-status');
    
    iceLevel.textContent = this.iceLevel;
    neuralHealth.textContent = `${this.neuralHealth}%`;
    neuralBar.style.width = `${this.neuralHealth}%`;
    
    if (this.neuralHealth < 30) {
      neuralHealth.classList.add('danger');
    } else {
      neuralHealth.classList.remove('danger');
    }
    
    if (this.iceLevel > 50) {
      traceStatus.textContent = 'DANGER';
      traceStatus.classList.add('danger');
    } else {
      traceStatus.textContent = 'SAFE';
      traceStatus.classList.remove('danger');
    }
  }
}

customElements.define('netrunning-interface', NetrunningInterface);