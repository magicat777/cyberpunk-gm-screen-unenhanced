// AI-powered GM Assistant for Cyberpunk Red
class AIGMAssistant extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.conversationHistory = [];
    this.currentContext = null;
    this.assistantPersona = 'professional';
    this.setupStyles();
    this.setupHTML();
    this.setupEventListeners();
    this.loadConversationHistory();
  }

  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #1a1a1a;
        color: #0ff;
        font-family: 'Cyberpunk', 'Consolas', monospace;
        position: relative;
        overflow: hidden;
      }

      /* Circuit pattern background */
      :host::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: 
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px);
        pointer-events: none;
        z-index: 1;
      }

      .assistant-container {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 15px;
      }

      .assistant-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #0ff;
      }

      .assistant-title {
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 10px #0ff;
      }

      .persona-selector {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .persona-btn {
        background: #2a2a2a;
        border: 1px solid #0ff;
        color: #0ff;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s;
        text-transform: uppercase;
      }

      .persona-btn.active {
        background: #0ff;
        color: #000;
        box-shadow: 0 0 10px #0ff;
      }

      .persona-btn:hover:not(.active) {
        background: #3a3a3a;
        box-shadow: 0 0 5px #0ff;
      }

      .conversation-area {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 15px;
        padding: 10px;
        background: rgba(0,0,0,0.5);
        border: 1px solid #0ff;
        scrollbar-width: thin;
        scrollbar-color: #0ff #1a1a1a;
      }

      .conversation-area::-webkit-scrollbar {
        width: 8px;
      }

      .conversation-area::-webkit-scrollbar-track {
        background: #1a1a1a;
      }

      .conversation-area::-webkit-scrollbar-thumb {
        background: #0ff;
        border-radius: 4px;
      }

      .message {
        margin-bottom: 15px;
        padding: 10px;
        border-radius: 5px;
        position: relative;
        animation: messageSlide 0.3s ease-out;
      }

      @keyframes messageSlide {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .user-message {
        background: rgba(0,255,255,0.1);
        border-left: 3px solid #0ff;
        margin-left: 20px;
      }

      .assistant-message {
        background: rgba(255,0,255,0.1);
        border-left: 3px solid #f0f;
        margin-right: 20px;
      }

      .message-header {
        font-size: 12px;
        margin-bottom: 5px;
        opacity: 0.7;
        text-transform: uppercase;
      }

      .message-content {
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
      }

      .quick-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 10px;
        margin-bottom: 15px;
      }

      .quick-action-btn {
        background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
        border: 2px solid #0ff;
        color: #0ff;
        padding: 10px;
        cursor: pointer;
        font-size: 12px;
        text-transform: uppercase;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
      }

      .quick-action-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0,255,255,0.4), transparent);
        transition: left 0.5s;
      }

      .quick-action-btn:hover {
        background: linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 100%);
        box-shadow: 0 0 15px #0ff, inset 0 0 15px rgba(0,255,255,0.2);
        transform: translateY(-2px);
      }

      .quick-action-btn:hover::before {
        left: 100%;
      }

      .input-area {
        display: flex;
        gap: 10px;
      }

      .user-input {
        flex: 1;
        background: #2a2a2a;
        border: 2px solid #0ff;
        color: #0ff;
        padding: 10px;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
        min-height: 60px;
      }

      .user-input:focus {
        outline: none;
        box-shadow: 0 0 10px #0ff;
      }

      .send-btn {
        background: linear-gradient(180deg, #0ff 0%, #088 100%);
        border: none;
        color: #000;
        padding: 10px 20px;
        cursor: pointer;
        font-weight: bold;
        text-transform: uppercase;
        transition: all 0.3s;
        align-self: flex-end;
      }

      .send-btn:hover {
        background: linear-gradient(180deg, #0ff 0%, #0aa 100%);
        box-shadow: 0 0 20px #0ff;
        transform: scale(1.05);
      }

      .send-btn:active {
        transform: scale(0.95);
      }

      .typing-indicator {
        display: none;
        padding: 10px;
        font-style: italic;
        opacity: 0.7;
      }

      .typing-indicator.active {
        display: block;
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }

      .context-indicator {
        font-size: 12px;
        padding: 5px 10px;
        background: rgba(255,255,0,0.2);
        border: 1px solid #ff0;
        color: #ff0;
        margin-bottom: 10px;
        display: none;
      }

      .context-indicator.active {
        display: block;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  setupHTML() {
    const container = document.createElement('div');
    container.className = 'assistant-container';
    container.innerHTML = `
      <div class="assistant-header">
        <div class="assistant-title">AI GM Assistant</div>
        <div class="persona-selector">
          <button class="persona-btn active" data-persona="professional">Professional</button>
          <button class="persona-btn" data-persona="friendly">Friendly</button>
          <button class="persona-btn" data-persona="noir">Noir</button>
        </div>
      </div>

      <div class="context-indicator">
        Context: <span class="context-text"></span>
      </div>

      <div class="quick-actions">
        <button class="quick-action-btn" data-action="npc">Generate NPC</button>
        <button class="quick-action-btn" data-action="encounter">Random Encounter</button>
        <button class="quick-action-btn" data-action="plot">Plot Hook</button>
        <button class="quick-action-btn" data-action="rules">Rules Question</button>
        <button class="quick-action-btn" data-action="loot">Generate Loot</button>
        <button class="quick-action-btn" data-action="name">Name Generator</button>
      </div>

      <div class="conversation-area"></div>
      
      <div class="typing-indicator">AI is thinking...</div>

      <div class="input-area">
        <textarea class="user-input" placeholder="Ask me anything about your Cyberpunk Red game..."></textarea>
        <button class="send-btn">Send</button>
      </div>
    `;
    this.shadowRoot.appendChild(container);
  }

  setupEventListeners() {
    // Persona selector
    this.shadowRoot.querySelectorAll('.persona-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setPersona(btn.dataset.persona));
    });

    // Quick actions
    this.shadowRoot.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleQuickAction(btn.dataset.action));
    });

    // Send button
    this.shadowRoot.querySelector('.send-btn').addEventListener('click', () => this.sendMessage());

    // Enter key to send
    this.shadowRoot.querySelector('.user-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  setPersona(persona) {
    this.assistantPersona = persona;
    this.shadowRoot.querySelectorAll('.persona-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.persona === persona);
    });
    this.addSystemMessage(`Persona changed to: ${persona}`);
  }

  handleQuickAction(action) {
    const actionPrompts = {
      npc: 'Generate a detailed NPC for Night City including name, role, appearance, personality, and potential plot hooks.',
      encounter: 'Create a random encounter appropriate for Night City streets including situation, NPCs involved, and potential outcomes.',
      plot: 'Generate an interesting plot hook for a Cyberpunk Red campaign including the client, the job, complications, and rewards.',
      rules: 'I have a rules question about Cyberpunk Red. Can you help me understand how something works?',
      loot: 'Generate interesting loot or rewards appropriate for a completed mission in Night City.',
      name: 'Generate cyberpunk-themed names for characters, gangs, corporations, or locations.'
    };

    const prompt = actionPrompts[action];
    if (prompt) {
      this.shadowRoot.querySelector('.user-input').value = prompt;
      this.sendMessage();
    }
  }

  sendMessage() {
    const input = this.shadowRoot.querySelector('.user-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    this.addMessage('user', message);
    
    // Clear input
    input.value = '';

    // Show typing indicator
    this.showTypingIndicator();

    // Simulate AI response
    setTimeout(() => {
      const response = this.generateAIResponse(message);
      this.hideTypingIndicator();
      this.addMessage('assistant', response);
    }, 1000 + Math.random() * 1000);
  }

  generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // NPC Generation
    if (lowerMessage.includes('npc') || lowerMessage.includes('character')) {
      return this.generateNPC();
    }
    
    // Encounter Generation
    if (lowerMessage.includes('encounter') || lowerMessage.includes('random')) {
      return this.generateEncounter();
    }
    
    // Plot Hook Generation
    if (lowerMessage.includes('plot') || lowerMessage.includes('job') || lowerMessage.includes('mission')) {
      return this.generatePlotHook();
    }
    
    // Rules Questions
    if (lowerMessage.includes('rules') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      return this.answerRulesQuestion(message);
    }
    
    // Loot Generation
    if (lowerMessage.includes('loot') || lowerMessage.includes('reward') || lowerMessage.includes('treasure')) {
      return this.generateLoot();
    }
    
    // Name Generation
    if (lowerMessage.includes('name')) {
      return this.generateNames();
    }
    
    // Default response
    return this.getDefaultResponse();
  }

  generateNPC() {
    const roles = ['Solo', 'Netrunner', 'Tech', 'Medtech', 'Media', 'Exec', 'Lawman', 'Fixer', 'Nomad', 'Rockerboy'];
    const personalities = ['Aggressive', 'Cautious', 'Friendly', 'Paranoid', 'Ambitious', 'Cynical', 'Idealistic', 'Greedy'];
    const appearances = ['Cybereyes', 'Chrome arm', 'Face tattoos', 'Mohawk', 'Corporate suit', 'Leather jacket', 'Tech goggles'];
    
    const role = this.randomFrom(roles);
    const firstName = this.randomFrom(['Johnny', 'Sarah', 'Viktor', 'Luna', 'Dante', 'Nyx', 'Rex', 'Zara']);
    const lastName = this.randomFrom(['Chrome', 'Night', 'Steel', 'Wire', 'Shade', 'Volt', 'Cross', 'Silver']);
    const personality = this.randomFrom(personalities);
    const appearance = this.randomFrom(appearances);
    
    return `**Generated NPC:**

**Name:** ${firstName} "${this.randomFrom(['Ghost', 'Razor', 'Shadow', 'Ice'])}" ${lastName}
**Role:** ${role}
**Age:** ${20 + Math.floor(Math.random() * 30)}

**Appearance:** ${appearance}, ${this.randomFrom(['tall and lean', 'short and stocky', 'average build'])}, ${this.randomFrom(['numerous scars', 'clean-cut', 'weathered face'])}

**Personality:** ${personality}, ${this.randomFrom(['loyal to friends', 'trust issues', 'quick to anger', 'calculating'])}

**Background:** ${this.randomFrom(['Former corp employee', 'Street kid survivor', 'Ex-military', 'Self-made criminal'])}

**Current Situation:** ${this.randomFrom(['Looking for work', 'On the run', 'Planning a big score', 'Seeking revenge'])}

**Plot Hook:** ${this.randomFrom(['Has info about a corp conspiracy', 'Knows location of valuable tech', 'Needs help with a personal vendetta', 'Can provide access to restricted areas'])}`;
  }

  generateEncounter() {
    const locations = ['dark alley', 'crowded market', 'abandoned warehouse', 'neon-lit street', 'corporate plaza'];
    const situations = [
      'Gang members shaking down a vendor',
      'Cyberpsycho on a rampage',
      'Corporate extraction gone wrong',
      'Black market deal in progress',
      'Street racing accident'
    ];
    
    return `**Random Encounter:**

**Location:** ${this.randomFrom(locations)}
**Time:** ${this.randomFrom(['Night', 'Dawn', 'Dusk', 'Midnight'])}

**Situation:** ${this.randomFrom(situations)}

**NPCs Involved:**
- ${2 + Math.floor(Math.random() * 4)} ${this.randomFrom(['Tyger Claws', 'Maelstrom', 'Valentinos', 'Corporate Security'])} members
- ${Math.random() > 0.5 ? '1 innocent bystander' : '2-3 civilians'}

**Potential Complications:**
- ${this.randomFrom(['NCPD patrol nearby', 'Media filming the scene', 'Rival gang approaching', 'Building security activated'])}

**Possible Outcomes:**
- **Violence:** Direct confrontation, ${3 + Math.floor(Math.random() * 3)} rounds of combat
- **Negotiation:** DC 15 Persuasion/Streetwise check
- **Stealth:** DC 12 Stealth check to avoid/bypass
- **Creative:** Players might ${this.randomFrom(['create a distraction', 'pit factions against each other', 'call in favors', 'use environment'])}`;
  }

  generatePlotHook() {
    const clients = ['Mysterious fixer', 'Corporate exec', 'Gang leader', 'Rogue AI', 'Government agent'];
    const jobs = [
      'Steal prototype cybernetics',
      'Extract a defecting scientist',
      'Investigate a series of murders',
      'Sabotage a rival corporation',
      'Recover stolen data'
    ];
    const complications = [
      'The target is heavily guarded',
      'Another team is after the same objective',
      'The client has hidden motives',
      'Time limit of 48 hours',
      'Must remain completely undetected'
    ];
    
    return `**Plot Hook:**

**Client:** ${this.randomFrom(clients)}
**Contact Method:** ${this.randomFrom(['Encrypted message', 'Face-to-face meeting', 'Dead drop', 'Through a mutual contact'])}

**The Job:** ${this.randomFrom(jobs)}

**Location:** ${this.randomFrom(['Corpo Plaza', 'Combat Zone', 'Old Industrial District', 'Pacifica', 'Orbital Station'])}

**Payment:** ${1000 + Math.floor(Math.random() * 9000)} eddies per person

**Complication:** ${this.randomFrom(complications)}

**Additional Intel:**
- ${this.randomFrom(['Security uses experimental ICE', 'Target has a body double', 'Location is a front for illegal activities', 'Previous team went missing'])}
- ${this.randomFrom(['24/7 surveillance', 'Automated defenses', 'Corporate hit squad on standby', 'Compromised local law enforcement'])}

**Moral Dilemma:** ${this.randomFrom(['Target is actually innocent', 'Success will harm civilians', 'Client plans betrayal', 'Job supports human trafficking'])}`;
  }

  answerRulesQuestion(question) {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('netrun') || lowerQ.includes('hack')) {
      return `**Netrunning Basics:**

Netrunning uses Interface + 1d10 vs DV:
- Basic system: DV 10
- Standard corporate: DV 15  
- High security: DV 20+

**Key Rules:**
- Each NET action takes 1 turn
- Can be traced after 3 turns
- Black ICE does physical damage
- Need cyberdeck and interface plugs
- Range limited by NET architecture

**Common Programs:** Armor, Shield, Sword, Worm, Virus

*Tip: Always have an escape route planned!*`;
    }
    
    if (lowerQ.includes('combat') || lowerQ.includes('fight')) {
      return `**Combat Rules:**

**Initiative:** REF + 1d10 (highest goes first)

**To Hit:** REF + Weapon Skill + 1d10 vs DV
- Point blank (≤1m): DV 10
- Close (≤10m): DV 13
- Medium (≤25m): DV 15
- Long (≤50m): DV 20
- Extreme (51m+): DV 25

**Damage:** Roll damage - armor SP = damage taken

**Critical Injuries:** When reduced to <1 HP, roll on injury table

**Actions per turn:** 1 Move + 1 Action`;
    }
    
    return `I'd be happy to help with rules questions! Could you be more specific about what you'd like to know? 

Common topics include:
- Combat mechanics
- Netrunning
- Character creation
- Skill checks
- Cyberware
- Critical injuries

Just ask about any specific rule or situation!`;
  }

  generateLoot() {
    const weapons = ['Militech Crusher SMG', 'Arasaka WAA Bullpup', 'Nomad .357 Revolver', 'Mono-katana'];
    const cyberware = ['Cybereye with Low-Light', 'Subdermal Armor', 'Reflex Booster', 'Neural Link'];
    const gear = ['Agent', 'Medkit', 'Tech toolkit', 'Armor jack'];
    const valuable = ['Corporate data shard', 'Illegal braindance', 'Stolen credentials', 'Prototype chip'];
    
    return `**Generated Loot:**

**Weapons:**
- ${this.randomFrom(weapons)} (${this.randomFrom(['Good', 'Excellent', 'Poor'])} condition)
- ${10 + Math.floor(Math.random() * 40)} rounds of ammunition

**Cyberware:** (${Math.random() > 0.5 ? 'Installed' : 'Uninstalled'})
- ${this.randomFrom(cyberware)}
- Humanity Loss: ${1 + Math.floor(Math.random() * 4)}d6

**Gear:**
- ${this.randomFrom(gear)}
- ${Math.floor(Math.random() * 3) + 1}x ${this.randomFrom(['Stimpak', 'Grenade', 'Smoke bomb'])}

**Valuables:**
- ${this.randomFrom(valuable)} (Worth ${500 + Math.floor(Math.random() * 2000)} eddies)
- ${100 + Math.floor(Math.random() * 900)} eddies in credsticks

**Bonus Find:** ${this.randomFrom(['Contact info for a fixer', 'Map to a cache', 'Blackmail material', 'Corporate keycard'])}`;
  }

  generateNames() {
    const firstNames = ['Nova', 'Blade', 'Phoenix', 'Circuit', 'Neon', 'Chrome', 'Volt', 'Binary'];
    const lastNames = ['Steele', 'Cross', 'Night', 'Wire', 'Silver', 'Black', 'Red', 'Zero'];
    const nicknames = ['Ghost', 'Razor', 'Ice', 'Shadow', 'Glitch', 'Spark', 'Crash', 'Flux'];
    const gangNames = ['Chrome Serpents', 'Neon Phantoms', 'Binary Brotherhood', 'Voltage Kings', 'Data Demons'];
    const corpNames = ['NeoTek Industries', 'Quantum Dynamics', 'Synaptic Solutions', 'CyberCore Ltd', 'Neural Networks Inc'];
    const barNames = ['The Glitch', 'Chrome Heart', 'Binary Sunset', 'Neon Dreams', 'The Dead Pixel'];
    
    return `**Generated Names:**

**Character Names:**
- ${this.randomFrom(firstNames)} "${this.randomFrom(nicknames)}" ${this.randomFrom(lastNames)}
- ${this.randomFrom(firstNames)} ${this.randomFrom(lastNames)}
- ${this.randomFrom(nicknames)} ${this.randomFrom(lastNames)}

**Gang Names:**
- ${this.randomFrom(gangNames)}
- The ${this.randomFrom(['Digital', 'Chrome', 'Neon', 'Cyber'])} ${this.randomFrom(['Wolves', 'Ravens', 'Vipers', 'Dragons'])}

**Corporation Names:**
- ${this.randomFrom(corpNames)}
- ${this.randomFrom(['Apex', 'Prime', 'Core', 'Max'])} ${this.randomFrom(['Systems', 'Technologies', 'Innovations', 'Dynamics'])}

**Location Names:**
- ${this.randomFrom(barNames)}
- ${this.randomFrom(['Sector', 'Block', 'Zone'])} ${Math.floor(Math.random() * 99) + 1}
- The ${this.randomFrom(['Underground', 'High-rise', 'Back-alley'])} ${this.randomFrom(['Market', 'Club', 'Clinic'])}`;
  }

  getDefaultResponse() {
    const responses = [
      "I'm here to help with your Cyberpunk Red game! Try asking me to generate NPCs, encounters, plot hooks, or answer rules questions.",
      "Need help with your campaign? I can create NPCs, design encounters, explain rules, or generate cyberpunk content!",
      "Ready to assist, choom. What do you need for your game?",
      "Interface connected. How can I help enhance your Cyberpunk Red session?"
    ];
    
    return this.randomFrom(responses);
  }

  randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  addMessage(sender, content) {
    const conversationArea = this.shadowRoot.querySelector('.conversation-area');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const header = document.createElement('div');
    header.className = 'message-header';
    header.textContent = sender === 'user' ? 'You' : `AI (${this.assistantPersona})`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(header);
    messageDiv.appendChild(contentDiv);
    conversationArea.appendChild(messageDiv);
    
    // Scroll to bottom
    conversationArea.scrollTop = conversationArea.scrollHeight;
    
    // Save to history
    this.conversationHistory.push({ sender, content, timestamp: new Date() });
    this.saveConversationHistory();
  }

  addSystemMessage(content) {
    const conversationArea = this.shadowRoot.querySelector('.conversation-area');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system-message';
    messageDiv.style.fontStyle = 'italic';
    messageDiv.style.opacity = '0.7';
    messageDiv.textContent = `[System: ${content}]`;
    conversationArea.appendChild(messageDiv);
    conversationArea.scrollTop = conversationArea.scrollHeight;
  }

  showTypingIndicator() {
    this.shadowRoot.querySelector('.typing-indicator').classList.add('active');
  }

  hideTypingIndicator() {
    this.shadowRoot.querySelector('.typing-indicator').classList.remove('active');
  }

  setContext(context) {
    this.currentContext = context;
    const indicator = this.shadowRoot.querySelector('.context-indicator');
    const contextText = this.shadowRoot.querySelector('.context-text');
    
    if (context) {
      indicator.classList.add('active');
      contextText.textContent = context;
    } else {
      indicator.classList.remove('active');
    }
  }

  saveConversationHistory() {
    localStorage.setItem('gm-assistant-history', JSON.stringify(this.conversationHistory.slice(-50)));
  }

  loadConversationHistory() {
    const saved = localStorage.getItem('gm-assistant-history');
    if (saved) {
      this.conversationHistory = JSON.parse(saved);
      // Optionally display recent history
    }
  }

  clearHistory() {
    this.conversationHistory = [];
    this.shadowRoot.querySelector('.conversation-area').innerHTML = '';
    this.saveConversationHistory();
    this.addSystemMessage('Conversation history cleared');
  }
}

customElements.define('ai-gm-assistant', AIGMAssistant);