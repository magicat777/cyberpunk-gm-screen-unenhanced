// Campaign Progress Tracking System
class CampaignTracker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.campaigns = [];
    this.currentCampaign = null;
    this.setupStyles();
    this.setupHTML();
    this.setupEventListeners();
    this.loadCampaigns();
  }

  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        height: 100%;
        background: #1a1a1a;
        color: #0ff;
        font-family: 'Cyberpunk', 'Consolas', monospace;
        overflow: hidden;
      }

      .tracker-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 15px;
      }

      .tracker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #0ff;
      }

      .tracker-title {
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 10px #0ff;
      }

      .campaign-selector {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      select {
        background: #2a2a2a;
        border: 2px solid #0ff;
        color: #0ff;
        padding: 5px 10px;
        font-family: inherit;
        font-size: 14px;
        cursor: pointer;
      }

      select:focus {
        outline: none;
        box-shadow: 0 0 10px #0ff;
      }

      .new-campaign-btn {
        background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
        border: 2px solid #0ff;
        color: #0ff;
        padding: 5px 15px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s;
      }

      .new-campaign-btn:hover {
        background: linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 100%);
        box-shadow: 0 0 10px #0ff;
      }

      .campaign-content {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .section {
        background: rgba(0,255,255,0.05);
        border: 1px solid #0ff;
        padding: 15px;
        border-radius: 5px;
      }

      .section-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        text-transform: uppercase;
        color: #f0f;
        text-shadow: 0 0 5px #f0f;
      }

      .campaign-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .stat-card {
        background: #2a2a2a;
        border: 1px solid #0ff;
        padding: 10px;
        text-align: center;
        border-radius: 3px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #0ff;
        text-shadow: 0 0 10px #0ff;
      }

      .stat-label {
        font-size: 12px;
        text-transform: uppercase;
        opacity: 0.7;
        margin-top: 5px;
      }

      .timeline {
        position: relative;
        padding-left: 30px;
      }

      .timeline::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #0ff;
      }

      .timeline-event {
        position: relative;
        margin-bottom: 20px;
        background: #2a2a2a;
        padding: 10px;
        border: 1px solid #0ff;
        border-radius: 3px;
      }

      .timeline-event::before {
        content: '';
        position: absolute;
        left: -25px;
        top: 15px;
        width: 10px;
        height: 10px;
        background: #0ff;
        border-radius: 50%;
        box-shadow: 0 0 10px #0ff;
      }

      .event-date {
        font-size: 12px;
        color: #ff0;
        margin-bottom: 5px;
      }

      .event-title {
        font-weight: bold;
        margin-bottom: 5px;
      }

      .event-description {
        font-size: 14px;
        opacity: 0.8;
      }

      .add-event-btn {
        width: 100%;
        background: rgba(0,255,255,0.1);
        border: 2px dashed #0ff;
        color: #0ff;
        padding: 10px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
        margin-top: 10px;
      }

      .add-event-btn:hover {
        background: rgba(0,255,255,0.2);
        border-style: solid;
      }

      .objectives-list {
        list-style: none;
        padding: 0;
      }

      .objective-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #2a2a2a;
        border: 1px solid #0ff;
        margin-bottom: 10px;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .objective-item:hover {
        background: #3a3a3a;
        box-shadow: 0 0 5px #0ff;
      }

      .objective-checkbox {
        width: 20px;
        height: 20px;
        border: 2px solid #0ff;
        background: transparent;
        position: relative;
        flex-shrink: 0;
      }

      .objective-checkbox.completed::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #0ff;
        font-size: 16px;
        font-weight: bold;
      }

      .objective-text {
        flex: 1;
      }

      .objective-text.completed {
        text-decoration: line-through;
        opacity: 0.5;
      }

      .characters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
      }

      .character-card {
        background: #2a2a2a;
        border: 1px solid #0ff;
        padding: 10px;
        text-align: center;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .character-card:hover {
        background: #3a3a3a;
        box-shadow: 0 0 10px #0ff;
        transform: translateY(-2px);
      }

      .character-name {
        font-weight: bold;
        margin-bottom: 5px;
      }

      .character-role {
        font-size: 12px;
        color: #f0f;
      }

      .character-status {
        font-size: 10px;
        margin-top: 5px;
        padding: 2px 5px;
        border-radius: 10px;
        background: rgba(0,255,0,0.2);
        color: #0f0;
      }

      .character-status.dead {
        background: rgba(255,0,0,0.2);
        color: #f00;
      }

      .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        align-items: center;
        justify-content: center;
      }

      .modal.active {
        display: flex;
      }

      .modal-content {
        background: #1a1a1a;
        border: 2px solid #0ff;
        padding: 20px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 0 30px #0ff;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .modal-title {
        font-size: 18px;
        font-weight: bold;
        text-transform: uppercase;
      }

      .close-btn {
        background: none;
        border: none;
        color: #f00;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
      }

      .close-btn:hover {
        color: #ff0;
        text-shadow: 0 0 10px #ff0;
      }

      .form-group {
        margin-bottom: 15px;
      }

      .form-group label {
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
        text-transform: uppercase;
      }

      .form-group input,
      .form-group textarea {
        width: 100%;
        background: #2a2a2a;
        border: 1px solid #0ff;
        color: #0ff;
        padding: 8px;
        font-family: inherit;
        font-size: 14px;
      }

      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        box-shadow: 0 0 5px #0ff;
      }

      .form-group textarea {
        min-height: 80px;
        resize: vertical;
      }

      .submit-btn {
        background: linear-gradient(180deg, #0ff 0%, #088 100%);
        border: none;
        color: #000;
        padding: 10px 20px;
        font-weight: bold;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s;
        width: 100%;
      }

      .submit-btn:hover {
        box-shadow: 0 0 20px #0ff;
        transform: scale(1.02);
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  setupHTML() {
    const container = document.createElement('div');
    container.className = 'tracker-container';
    container.innerHTML = `
      <div class="tracker-header">
        <div class="tracker-title">Campaign Tracker</div>
        <div class="campaign-selector">
          <select class="campaign-select">
            <option value="">Select Campaign</option>
          </select>
          <button class="new-campaign-btn">New Campaign</button>
        </div>
      </div>

      <div class="campaign-content">
        <div class="section">
          <div class="section-title">Campaign Overview</div>
          <div class="campaign-overview">
            <div class="stat-card">
              <div class="stat-value">0</div>
              <div class="stat-label">Sessions</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">0</div>
              <div class="stat-label">Days In-Game</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">0</div>
              <div class="stat-label">Objectives</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">0</div>
              <div class="stat-label">Characters</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Timeline</div>
          <div class="timeline"></div>
          <button class="add-event-btn">+ Add Event</button>
        </div>

        <div class="section">
          <div class="section-title">Current Objectives</div>
          <ul class="objectives-list"></ul>
          <button class="add-event-btn add-objective-btn">+ Add Objective</button>
        </div>

        <div class="section">
          <div class="section-title">Player Characters</div>
          <div class="characters-grid"></div>
          <button class="add-event-btn add-character-btn">+ Add Character</button>
        </div>
      </div>

      <!-- Modals -->
      <div class="modal campaign-modal">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">New Campaign</div>
            <button class="close-btn">×</button>
          </div>
          <form class="campaign-form">
            <div class="form-group">
              <label>Campaign Name</label>
              <input type="text" name="name" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea name="description"></textarea>
            </div>
            <div class="form-group">
              <label>Starting Date (In-Game)</label>
              <input type="text" name="startDate" placeholder="e.g., January 1, 2077">
            </div>
            <button type="submit" class="submit-btn">Create Campaign</button>
          </form>
        </div>
      </div>

      <div class="modal event-modal">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">Add Timeline Event</div>
            <button class="close-btn">×</button>
          </div>
          <form class="event-form">
            <div class="form-group">
              <label>Event Date</label>
              <input type="text" name="date" required>
            </div>
            <div class="form-group">
              <label>Event Title</label>
              <input type="text" name="title" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea name="description"></textarea>
            </div>
            <button type="submit" class="submit-btn">Add Event</button>
          </form>
        </div>
      </div>

      <div class="modal objective-modal">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">Add Objective</div>
            <button class="close-btn">×</button>
          </div>
          <form class="objective-form">
            <div class="form-group">
              <label>Objective</label>
              <input type="text" name="text" required>
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select name="priority">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button type="submit" class="submit-btn">Add Objective</button>
          </form>
        </div>
      </div>

      <div class="modal character-modal">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">Add Character</div>
            <button class="close-btn">×</button>
          </div>
          <form class="character-form">
            <div class="form-group">
              <label>Character Name</label>
              <input type="text" name="name" required>
            </div>
            <div class="form-group">
              <label>Player Name</label>
              <input type="text" name="player">
            </div>
            <div class="form-group">
              <label>Role</label>
              <select name="role">
                <option value="Solo">Solo</option>
                <option value="Netrunner">Netrunner</option>
                <option value="Tech">Tech</option>
                <option value="Medtech">Medtech</option>
                <option value="Media">Media</option>
                <option value="Exec">Exec</option>
                <option value="Lawman">Lawman</option>
                <option value="Fixer">Fixer</option>
                <option value="Nomad">Nomad</option>
                <option value="Rockerboy">Rockerboy</option>
              </select>
            </div>
            <button type="submit" class="submit-btn">Add Character</button>
          </form>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(container);
  }

  setupEventListeners() {
    // Campaign selector
    const campaignSelect = this.shadowRoot.querySelector('.campaign-select');
    campaignSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        this.loadCampaign(e.target.value);
      }
    });

    // New campaign button
    this.shadowRoot.querySelector('.new-campaign-btn').addEventListener('click', () => {
      this.showModal('campaign');
    });

    // Add buttons
    this.shadowRoot.querySelector('.add-event-btn').addEventListener('click', () => {
      this.showModal('event');
    });

    this.shadowRoot.querySelector('.add-objective-btn').addEventListener('click', () => {
      this.showModal('objective');
    });

    this.shadowRoot.querySelector('.add-character-btn').addEventListener('click', () => {
      this.showModal('character');
    });

    // Close buttons
    this.shadowRoot.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.remove('active');
      });
    });

    // Form submissions
    this.shadowRoot.querySelector('.campaign-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createCampaign(new FormData(e.target));
    });

    this.shadowRoot.querySelector('.event-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTimelineEvent(new FormData(e.target));
    });

    this.shadowRoot.querySelector('.objective-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addObjective(new FormData(e.target));
    });

    this.shadowRoot.querySelector('.character-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addCharacter(new FormData(e.target));
    });

    // Click outside modal to close
    this.shadowRoot.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
  }

  showModal(type) {
    this.shadowRoot.querySelector(`.${type}-modal`).classList.add('active');
  }

  createCampaign(formData) {
    const campaign = {
      id: Date.now().toString(),
      name: formData.get('name'),
      description: formData.get('description'),
      startDate: formData.get('startDate'),
      sessions: 0,
      daysInGame: 0,
      timeline: [],
      objectives: [],
      characters: [],
      created: new Date()
    };

    this.campaigns.push(campaign);
    this.saveCampaigns();
    this.loadCampaign(campaign.id);
    this.updateCampaignSelector();
    this.shadowRoot.querySelector('.campaign-modal').classList.remove('active');
  }

  loadCampaign(id) {
    this.currentCampaign = this.campaigns.find(c => c.id === id);
    if (this.currentCampaign) {
      this.updateDisplay();
    }
  }

  updateDisplay() {
    if (!this.currentCampaign) return;

    // Update stats
    this.shadowRoot.querySelectorAll('.stat-value')[0].textContent = this.currentCampaign.sessions;
    this.shadowRoot.querySelectorAll('.stat-value')[1].textContent = this.currentCampaign.daysInGame;
    this.shadowRoot.querySelectorAll('.stat-value')[2].textContent = this.currentCampaign.objectives.filter(o => !o.completed).length;
    this.shadowRoot.querySelectorAll('.stat-value')[3].textContent = this.currentCampaign.characters.filter(c => c.status !== 'dead').length;

    // Update timeline
    this.updateTimeline();

    // Update objectives
    this.updateObjectives();

    // Update characters
    this.updateCharacters();
  }

  updateTimeline() {
    const timeline = this.shadowRoot.querySelector('.timeline');
    timeline.innerHTML = this.currentCampaign.timeline
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(event => `
        <div class="timeline-event">
          <div class="event-date">${event.date}</div>
          <div class="event-title">${event.title}</div>
          <div class="event-description">${event.description}</div>
        </div>
      `).join('');
  }

  updateObjectives() {
    const list = this.shadowRoot.querySelector('.objectives-list');
    list.innerHTML = this.currentCampaign.objectives.map((obj, index) => `
      <li class="objective-item" data-index="${index}">
        <div class="objective-checkbox ${obj.completed ? 'completed' : ''}"></div>
        <div class="objective-text ${obj.completed ? 'completed' : ''}">${obj.text}</div>
      </li>
    `).join('');

    // Add click handlers
    list.querySelectorAll('.objective-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.toggleObjective(index);
      });
    });
  }

  updateCharacters() {
    const grid = this.shadowRoot.querySelector('.characters-grid');
    grid.innerHTML = this.currentCampaign.characters.map(char => `
      <div class="character-card">
        <div class="character-name">${char.name}</div>
        <div class="character-role">${char.role}</div>
        <div class="character-status ${char.status}">${char.status}</div>
      </div>
    `).join('');
  }

  addTimelineEvent(formData) {
    if (!this.currentCampaign) return;

    this.currentCampaign.timeline.push({
      date: formData.get('date'),
      title: formData.get('title'),
      description: formData.get('description')
    });

    this.saveCampaigns();
    this.updateTimeline();
    this.shadowRoot.querySelector('.event-modal').classList.remove('active');
  }

  addObjective(formData) {
    if (!this.currentCampaign) return;

    this.currentCampaign.objectives.push({
      text: formData.get('text'),
      priority: formData.get('priority'),
      completed: false
    });

    this.saveCampaigns();
    this.updateDisplay();
    this.shadowRoot.querySelector('.objective-modal').classList.remove('active');
  }

  addCharacter(formData) {
    if (!this.currentCampaign) return;

    this.currentCampaign.characters.push({
      name: formData.get('name'),
      player: formData.get('player'),
      role: formData.get('role'),
      status: 'active'
    });

    this.saveCampaigns();
    this.updateDisplay();
    this.shadowRoot.querySelector('.character-modal').classList.remove('active');
  }

  toggleObjective(index) {
    if (!this.currentCampaign) return;

    this.currentCampaign.objectives[index].completed = !this.currentCampaign.objectives[index].completed;
    this.saveCampaigns();
    this.updateDisplay();
  }

  updateCampaignSelector() {
    const select = this.shadowRoot.querySelector('.campaign-select');
    select.innerHTML = '<option value="">Select Campaign</option>' +
      this.campaigns.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    if (this.currentCampaign) {
      select.value = this.currentCampaign.id;
    }
  }

  saveCampaigns() {
    localStorage.setItem('cyberpunk-campaigns', JSON.stringify(this.campaigns));
  }

  loadCampaigns() {
    const saved = localStorage.getItem('cyberpunk-campaigns');
    if (saved) {
      this.campaigns = JSON.parse(saved);
      this.updateCampaignSelector();
      if (this.campaigns.length > 0) {
        this.loadCampaign(this.campaigns[0].id);
      }
    }
  }

  incrementSession() {
    if (!this.currentCampaign) return;
    this.currentCampaign.sessions++;
    this.saveCampaigns();
    this.updateDisplay();
  }

  incrementDays(days = 1) {
    if (!this.currentCampaign) return;
    this.currentCampaign.daysInGame += days;
    this.saveCampaigns();
    this.updateDisplay();
  }

  exportCampaign() {
    if (!this.currentCampaign) return;
    
    const data = JSON.stringify(this.currentCampaign, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentCampaign.name.replace(/\s+/g, '_')}_campaign.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

customElements.define('campaign-tracker', CampaignTracker);