/**
 * Enhanced Location Generator for Cyberpunk RED
 * Features: Night City districts, detailed locations, NPCs, hooks, interactive map
 */

class EnhancedLocationGenerator {
  constructor(container) {
    this.container = container;
    this.currentLocation = null;
    this.savedLocations = this.loadSavedLocations();
    this.generationHistory = [];
    
    // Enhanced district data with more detail
    this.districts = {
      'city-center': {
        name: 'City Center',
        description: 'The corporate heart of Night City, dominated by massive skyscrapers and corporate headquarters.',
        danger: 'medium',
        security: 'high',
        population: 'high',
        wealth: 'very-high',
        corps: ['Arasaka', 'Militech', 'Biotechnica', 'Kang Tao'],
        atmosphere: 'sterile, controlled, expensive',
        landmarks: ['Arasaka Tower', 'Corporate Plaza', 'Executive District'],
        commonLocations: ['corp', 'restaurant', 'bar', 'government'],
        color: '#00d4ff'
      },
      'watson': {
        name: 'Watson',
        description: 'A district in transition with both corporate development and gang activity.',
        danger: 'medium',
        security: 'medium',
        population: 'high',
        wealth: 'medium',
        corps: ['Arasaka', 'Zetatech'],
        atmosphere: 'bustling, diverse, unpredictable',
        landmarks: ['Kabuki Market', 'Arasaka Waterfront', 'Little China'],
        commonLocations: ['shop', 'apartment', 'bar', 'gang'],
        color: '#ff6b6b'
      },
      'westbrook': {
        name: 'Westbrook',
        description: 'An affluent area containing Japantown and Charter Hill neighborhoods.',
        danger: 'low',
        security: 'high',
        population: 'medium',
        wealth: 'high',
        corps: ['Kang Tao', 'Orbital Air'],
        atmosphere: 'upscale, cultural, fashionable',
        landmarks: ['Japantown', 'Charter Hill', 'Tiger Claw Dojo'],
        commonLocations: ['bar', 'restaurant', 'shop', 'apartment'],
        color: '#4ecdc4'
      },
      'heywood': {
        name: 'Heywood',
        description: 'A diverse district ranging from corporate zones to gang territories.',
        danger: 'medium',
        security: 'medium',
        population: 'very-high',
        wealth: 'low',
        corps: ['Biotechnica', 'Petrochem'],
        atmosphere: 'family-oriented, community-driven, territorial',
        landmarks: ['Valentino Territory', 'The Glen', 'Vista del Rey'],
        commonLocations: ['apartment', 'gang', 'restaurant', 'shop'],
        color: '#45b7d1'
      },
      'pacifica': {
        name: 'Pacifica',
        description: 'An abandoned resort area now ruled by gangs, particularly the Voodoo Boys.',
        danger: 'extreme',
        security: 'minimal',
        population: 'low',
        wealth: 'very-low',
        corps: [],
        atmosphere: 'lawless, dangerous, mystical',
        landmarks: ['Grand Imperial Mall', 'Voodoo Boys Territory', 'Batty\'s Hotel'],
        commonLocations: ['gang', 'apartment', 'warehouse', 'tech'],
        color: '#96ceb4'
      },
      'santo-domingo': {
        name: 'Santo Domingo',
        description: 'An industrial zone filled with factories, power plants, and worker housing.',
        danger: 'high',
        security: 'medium',
        population: 'high',
        wealth: 'low',
        corps: ['Petrochem', 'Biotechnica', 'Orbital Air'],
        atmosphere: 'industrial, working-class, polluted',
        landmarks: ['Power Plant', 'Industrial District', 'Worker Housing'],
        commonLocations: ['warehouse', 'tech', 'apartment', 'corp'],
        color: '#ffeaa7'
      }
    };
    
    // Enhanced location types with subtypes
    this.locationTypes = {
      bar: {
        name: 'Bar/Nightclub',
        icon: '🍻',
        subtypes: ['dive bar', 'nightclub', 'rooftop bar', 'underground club', 'corporate lounge'],
        names: ['Chrome', 'Neon', 'Afterlife', 'Silver', 'Lizzie\'s', 'Riot', 'Totentanz', 'Byte', 'Glitch', 'Static'],
        adjectives: ['Neon', 'Chrome', 'Digital', 'Night', 'Electric', 'Punk', 'Steel', 'Glass'],
        features: ['live music', 'braindance booths', 'VIP rooms', 'dance floor', 'private meetings', 'illegal gambling']
      },
      shop: {
        name: 'Shop/Store',
        icon: '🏪',
        subtypes: ['tech shop', 'fashion boutique', 'weapons dealer', 'black market', 'convenience store'],
        names: ['Tech', 'Junk', 'Parts', 'Gear', 'Warez', 'Bits', 'Cyber', 'Street', 'Night Market'],
        adjectives: ['Underground', 'Hidden', 'Exclusive', 'Famous', 'Shady', 'High-tech', 'Vintage'],
        features: ['rare items', 'custom work', 'repair services', 'trade-ins', 'bulk discounts', 'membership required']
      },
      corp: {
        name: 'Corporate Building',
        icon: '🏢',
        subtypes: ['headquarters', 'research facility', 'office building', 'data center', 'security outpost'],
        names: ['Arasaka', 'Militech', 'Biotechnica', 'Petrochem', 'Kang Tao', 'Zetatech', 'Orbital Air'],
        adjectives: ['Advanced', 'Secure', 'Classified', 'Executive', 'High-tech', 'Restricted'],
        features: ['biometric locks', 'armed security', 'server rooms', 'executive suites', 'clean rooms', 'holding cells']
      },
      apartment: {
        name: 'Residential',
        icon: '🏠',
        subtypes: ['megabuilding', 'luxury tower', 'corporate housing', 'communal living', 'safe house'],
        names: ['Heights', 'Tower', 'Complex', 'Block', 'Megabuilding', 'Flats', 'Suites', 'Den', 'Haven'],
        adjectives: ['Towering', 'Cramped', 'Luxury', 'Secure', 'Run-down', 'Modern', 'Converted'],
        features: ['rooftop access', 'security guards', 'communal areas', 'parking garage', 'maintenance tunnels', 'safe rooms']
      },
      warehouse: {
        name: 'Warehouse/Industrial',
        icon: '🏭',
        subtypes: ['storage facility', 'shipping depot', 'abandoned warehouse', 'chop shop', 'underground market'],
        names: ['Storage', 'Freight', 'Shipping', 'Cargo', 'Container', 'Harbor', 'Industrial', 'Depot'],
        adjectives: ['Abandoned', 'Secured', 'Hidden', 'Converted', 'Automated', 'Underground'],
        features: ['loading docks', 'security systems', 'hidden rooms', 'vehicle access', 'storage containers', 'crane systems']
      },
      gang: {
        name: 'Gang Territory',
        icon: '⚔️',
        subtypes: ['hideout', 'territory marker', 'chop shop', 'safe house', 'meeting spot'],
        names: ['Maelstrom', 'Tyger Claws', 'Valentinos', 'Animals', 'Voodoo Boys', '6th Street', 'Moxes'],
        adjectives: ['Fortified', 'Hidden', 'Marked', 'Dangerous', 'Exclusive', 'Underground'],
        features: ['lookouts', 'booby traps', 'weapons cache', 'escape routes', 'communication hub', 'territory markers']
      },
      clinic: {
        name: 'Medical Facility',
        icon: '🏥',
        subtypes: ['street clinic', 'ripper doc', 'trauma center', 'corporate medical', 'black market surgery'],
        names: ['Care', 'Med-Center', 'Trauma', 'Street Doc', 'Surgery', 'Treatment', 'Implants'],
        adjectives: ['Underground', 'High-tech', 'Questionable', 'Exclusive', 'Emergency', 'Experimental'],
        features: ['operating theaters', 'cybernetics lab', 'patient rooms', 'emergency equipment', 'quarantine area', 'recovery ward']
      },
      tech: {
        name: 'Tech Workshop',
        icon: '🔧',
        subtypes: ['netrunner den', 'workshop', 'repair shop', 'research lab', 'custom shop'],
        names: ['Workshop', 'Netrunner', 'Lab', 'Repair', 'Custom', 'Tech', 'Mod Shop', 'Systems'],
        adjectives: ['High-tech', 'Underground', 'Experimental', 'Custom', 'Advanced', 'Secretive'],
        features: ['workshop space', 'testing area', 'parts storage', 'clean room', 'server farm', 'prototype lab']
      }
    };
    
    // Story hooks and complications
    this.storyHooks = [
      'A data shard with encrypted coordinates was dropped here',
      'A bounty target frequents this location regularly',
      'Illegal braindance recordings are being sold here',
      'A missing person was last seen entering this building',
      'A valuable prototype is hidden somewhere inside',
      'A rival gang is planning to attack this location',
      'Corporate agents are monitoring this place',
      'Black market military cyberware is available here',
      'A famous fixer meets clients at this location',
      'This location sits above forgotten underground tunnels',
      'The security system has a known vulnerability',
      'A corrupt NCPD officer runs extortion from here',
      'The owner owes dangerous people significant money',
      'Someone witnessed a high-profile assassination here',
      'This place is a front for secretive operations'
    ];
    
    this.complications = [
      'Security cameras are malfunctioning',
      'A gang war is about to break out nearby',
      'Corporate security is conducting a surprise inspection',
      'The building is under quarantine',
      'A netrunner attack is disrupting local systems',
      'NCPD raid is scheduled for tonight',
      'A celebrity is visiting incognito',
      'Construction work is blocking main entrances',
      'Power grid failures are causing blackouts',
      'A rival corporation is planning a hostile takeover'
    ];
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="enhanced-location-generator">
        <style>
          .enhanced-location-generator {
            display: flex;
            flex-direction: column;
            height: 100%;
            font-family: var(--font-secondary);
            gap: 20px;
            padding: 20px;
          }
          
          .generator-header {
            text-align: center;
          }
          
          .generator-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .control-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .control-label {
            color: var(--text-primary);
            font-family: var(--font-display);
            text-transform: uppercase;
            font-size: 14px;
            font-weight: bold;
          }
          
          .generation-options {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 15px 0;
            justify-content: center;
          }
          
          .location-tabs {
            display: flex;
            gap: 5px;
            margin-bottom: 20px;
            border-bottom: 2px solid var(--border-color);
          }
          
          .location-tab {
            padding: 12px 20px;
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.3s;
            font-family: var(--font-display);
            text-transform: uppercase;
            font-size: 12px;
            font-weight: bold;
          }
          
          .location-tab.active {
            background: var(--primary);
            color: var(--bg-primary);
            border-color: var(--primary);
          }
          
          .location-tab:hover:not(.active) {
            border-color: var(--primary);
            color: var(--primary);
          }
          
          .tab-content {
            display: none;
          }
          
          .tab-content.active {
            display: block;
          }
          
          .district-map {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
          }
          
          .district-card {
            cursor: pointer;
            transition: all 0.3s;
          }
          
          .district-info {
            padding: 15px;
            border-radius: 8px;
          }
          
          .district-name {
            font-family: var(--font-display);
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          
          .district-description {
            font-size: 12px;
            line-height: 1.4;
            margin-bottom: 10px;
          }
          
          .district-stats {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            text-transform: uppercase;
          }
          
          .location-display {
            flex: 1;
            overflow-y: auto;
          }
          
          .location-header {
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: var(--bg-surface);
            border: 2px solid var(--border-color);
            border-radius: 8px;
          }
          
          .location-name {
            font-size: 2rem;
            margin-bottom: 10px;
            color: var(--primary);
          }
          
          .location-type {
            color: var(--secondary);
            font-family: var(--font-display);
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          
          .location-district {
            color: var(--accent);
            font-size: 14px;
          }
          
          .location-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          
          .detail-section {
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
          }
          
          .detail-section h4 {
            color: var(--accent);
            margin: 0 0 15px 0;
            font-family: var(--font-display);
            text-transform: uppercase;
            font-size: 14px;
          }
          
          .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .feature-list li {
            padding: 5px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-secondary);
          }
          
          .feature-list li:last-child {
            border-bottom: none;
          }
          
          .npc-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .npc-card {
            background: var(--bg-overlay);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 12px;
          }
          
          .npc-name {
            color: var(--primary);
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .npc-role {
            color: var(--secondary);
            font-size: 12px;
            text-transform: uppercase;
          }
          
          .saved-locations {
            margin-top: 20px;
          }
          
          .saved-location-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: var(--bg-overlay);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            margin: 5px 0;
          }
          
          .no-location {
            text-align: center;
            padding: 40px;
            color: var(--text-secondary);
          }
        </style>
        
        <!-- Header -->
        <div class="generator-header">
          <h2>
            <glitch-text text="Location Generator" intensity="medium" hover-glitch color="primary"></glitch-text>
          </h2>
          <p style="color: var(--text-secondary); margin: 10px 0;">Generate detailed locations across Night City's districts</p>
        </div>
        
        <!-- Controls -->
        <div class="generator-controls">
          <div class="control-group">
            <label class="control-label">
              <glitch-text text="Location Type" intensity="low"></glitch-text>
            </label>
            <select id="location-type">
              <option value="random">Random Location</option>
              <option value="bar">Bar/Nightclub</option>
              <option value="shop">Shop/Store</option>
              <option value="corp">Corporate Building</option>
              <option value="apartment">Residential</option>
              <option value="warehouse">Warehouse/Industrial</option>
              <option value="gang">Gang Territory</option>
              <option value="clinic">Medical Facility</option>
              <option value="tech">Tech Workshop</option>
            </select>
          </div>
          
          <div class="control-group">
            <label class="control-label">
              <glitch-text text="District" intensity="low"></glitch-text>
            </label>
            <select id="location-district">
              <option value="random">Random District</option>
              <option value="city-center">City Center</option>
              <option value="watson">Watson</option>
              <option value="westbrook">Westbrook</option>
              <option value="heywood">Heywood</option>
              <option value="pacifica">Pacifica</option>
              <option value="santo-domingo">Santo Domingo</option>
            </select>
          </div>
        </div>
        
        <!-- Generation Options -->
        <div class="generation-options">
          <holo-button id="generate-location" variant="primary">Generate Location</holo-button>
          <holo-button id="generate-district" variant="secondary">Random District</holo-button>
          <holo-button id="generate-encounter" variant="accent" size="small">Quick Encounter</holo-button>
          <holo-button id="save-location" variant="success" size="small" disabled>Save Location</holo-button>
        </div>
        
        <!-- Tabs -->
        <div class="location-tabs">
          <button class="location-tab active" data-tab="details">Location Details</button>
          <button class="location-tab" data-tab="map">District Map</button>
          <button class="location-tab" data-tab="saved">Saved Locations</button>
        </div>
        
        <!-- Tab Content -->
        <div class="tab-content active" id="details-tab">
          <div class="location-display" id="location-display">
            <div class="no-location">
              <div style="font-size: 48px; margin-bottom: 20px;">🏙️</div>
              <h3>No Location Generated</h3>
              <p>Click "Generate Location" to create a new Night City location</p>
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="map-tab">
          <div class="district-map" id="district-map"></div>
        </div>
        
        <div class="tab-content" id="saved-tab">
          <div class="saved-locations">
            <h3>
              <glitch-text text="Saved Locations" intensity="low"></glitch-text>
            </h3>
            <div id="saved-locations-list"></div>
          </div>
        </div>
      </div>
    `;
    
    this.styleSelects();
    this.renderDistrictMap();
    this.displaySavedLocations();
  }
  
  styleSelects() {
    const selects = this.container.querySelectorAll('select');
    selects.forEach(select => {
      select.style.cssText = `
        width: 100%;
        padding: 12px;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        font-family: var(--font-secondary);
        border-radius: 4px;
        cursor: pointer;
      `;
    });
  }
  
  attachEventListeners() {
    // Generation buttons
    this.container.querySelector('#generate-location').addEventListener('click', () => this.generateLocation());
    this.container.querySelector('#generate-district').addEventListener('click', () => this.generateRandomDistrict());
    this.container.querySelector('#generate-encounter').addEventListener('click', () => this.generateQuickEncounter());
    this.container.querySelector('#save-location').addEventListener('click', () => this.saveLocation());
    
    // Tab switching
    const tabs = this.container.querySelectorAll('.location-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });
  }
  
  generateLocation(districtOverride = null, typeOverride = null) {
    const locationType = typeOverride || this.container.querySelector('#location-type').value;
    const district = districtOverride || this.container.querySelector('#location-district').value;
    
    // Select random values if needed
    let selectedType = locationType;
    if (locationType === 'random') {
      selectedType = this.randomFrom(Object.keys(this.locationTypes));
    }
    
    let selectedDistrict = district;
    if (district === 'random') {
      selectedDistrict = this.randomFrom(Object.keys(this.districts));
    }
    
    // Generate location data
    const typeData = this.locationTypes[selectedType];
    const districtData = this.districts[selectedDistrict];
    
    this.currentLocation = {
      id: `location_${Date.now()}`,
      name: this.generateLocationName(selectedType),
      type: selectedType,
      subtype: this.randomFrom(typeData.subtypes),
      district: selectedDistrict,
      description: this.generateLocationDescription(selectedType, selectedDistrict),
      features: this.generateLocationFeatures(selectedType),
      npcs: this.generateLocationNPCs(selectedType),
      hooks: this.generateStoryHooks(),
      complications: this.generateComplications(),
      atmosphere: this.generateAtmosphere(selectedType, selectedDistrict),
      security: this.generateSecurity(selectedType, selectedDistrict),
      generated: new Date().toISOString()
    };
    
    this.displayLocation();
    this.addToHistory();
    
    // Enable save button
    const saveBtn = this.container.querySelector('#save-location');
    saveBtn.removeAttribute('disabled');
  }
  
  generateLocationName(type) {
    const typeData = this.locationTypes[type];
    const name = this.randomFrom(typeData.names);
    const adjective = this.randomFrom(typeData.adjectives);
    
    // Different naming patterns
    const patterns = [
      `The ${adjective} ${name}`,
      `${name} ${this.randomFrom(['Station', 'Hub', 'Center', 'Plaza', 'Point'])}`,
      `${adjective} ${name}`,
      name
    ];
    
    return this.randomFrom(patterns);
  }
  
  generateLocationDescription(type, district) {
    const typeData = this.locationTypes[type];
    const districtData = this.districts[district];
    
    const baseDescriptions = {
      bar: 'A drinking establishment with cyberpunk atmosphere',
      shop: 'A commercial space selling various goods and services',
      corp: 'A corporate facility with advanced security and technology',
      apartment: 'A residential building housing Night City inhabitants',
      warehouse: 'An industrial space used for storage or manufacturing',
      gang: 'A location controlled by one of Night City\'s gangs',
      clinic: 'A medical facility providing healthcare services',
      tech: 'A workshop or laboratory focused on technology'
    };
    
    return `${baseDescriptions[type]} located in ${districtData.name}. The area is known for its ${districtData.atmosphere}.`;
  }
  
  generateLocationFeatures(type) {
    const typeData = this.locationTypes[type];
    const numFeatures = Math.floor(Math.random() * 3) + 2; // 2-4 features
    
    const shuffled = [...typeData.features].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numFeatures);
  }
  
  generateLocationNPCs(type) {
    const numNPCs = Math.floor(Math.random() * 3) + 1; // 1-3 NPCs
    const npcs = [];
    
    const typeRoles = {
      bar: ['Bartender', 'Bouncer', 'Regular Customer', 'Dealer', 'Fixer'],
      shop: ['Owner', 'Clerk', 'Security Guard', 'Customer', 'Supplier'],
      corp: ['Executive', 'Security', 'Employee', 'Visitor', 'Janitor'],
      apartment: ['Resident', 'Landlord', 'Maintenance', 'Visitor', 'Delivery'],
      warehouse: ['Foreman', 'Worker', 'Security', 'Driver', 'Inspector'],
      gang: ['Leader', 'Enforcer', 'Lookout', 'New Recruit', 'Rival'],
      clinic: ['Doctor', 'Nurse', 'Patient', 'Receptionist', 'Supplier'],
      tech: ['Engineer', 'Technician', 'Customer', 'Apprentice', 'Investor']
    };
    
    const roles = typeRoles[type] || ['Person', 'Worker', 'Visitor'];
    
    for (let i = 0; i < numNPCs; i++) {
      npcs.push({
        name: this.generateNPCName(),
        role: this.randomFrom(roles),
        trait: this.randomFrom(['Friendly', 'Suspicious', 'Helpful', 'Dangerous', 'Nervous', 'Professional']),
        motivation: this.randomFrom(['Money', 'Power', 'Survival', 'Family', 'Revenge', 'Knowledge'])
      });
    }
    
    return npcs;
  }
  
  generateNPCName() {
    const firstNames = ['Alex', 'Morgan', 'Casey', 'Riley', 'Jordan', 'Avery', 'Quinn', 'Sage', 'River', 'Phoenix'];
    const lastNames = ['Chen', 'Rodriguez', 'Smith', 'Nakamura', 'Kowalski', 'Williams', 'Garcia', 'Thompson'];
    return `${this.randomFrom(firstNames)} ${this.randomFrom(lastNames)}`;
  }
  
  generateStoryHooks() {
    const numHooks = Math.floor(Math.random() * 2) + 1; // 1-2 hooks
    const shuffled = [...this.storyHooks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numHooks);
  }
  
  generateComplications() {
    if (Math.random() < 0.4) { // 40% chance of complication
      return [this.randomFrom(this.complications)];
    }
    return [];
  }
  
  generateAtmosphere(type, district) {
    const districtData = this.districts[district];
    const typeAtmospheres = {
      bar: ['smoky', 'loud', 'intimate', 'crowded', 'exclusive'],
      shop: ['busy', 'cluttered', 'organized', 'suspicious', 'welcoming'],
      corp: ['sterile', 'tense', 'professional', 'secure', 'imposing'],
      apartment: ['cramped', 'cozy', 'run-down', 'luxurious', 'community-oriented'],
      warehouse: ['industrial', 'empty', 'echoing', 'cluttered', 'secretive'],
      gang: ['tense', 'territorial', 'dangerous', 'fraternal', 'paranoid'],
      clinic: ['sterile', 'busy', 'questionable', 'professional', 'underground'],
      tech: ['innovative', 'cluttered', 'high-tech', 'experimental', 'secretive']
    };
    
    const baseAtmosphere = this.randomFrom(typeAtmospheres[type]);
    return `${baseAtmosphere}, ${districtData.atmosphere}`;
  }
  
  generateSecurity(type, district) {
    const districtData = this.districts[district];
    const typeSecurity = {
      bar: ['bouncer', 'none', 'basic cameras'],
      shop: ['alarm system', 'security guard', 'none'],
      corp: ['high security', 'biometric locks', 'armed guards'],
      apartment: ['basic', 'none', 'concierge'],
      warehouse: ['automated systems', 'guards', 'none'],
      gang: ['lookouts', 'armed members', 'booby traps'],
      clinic: ['none', 'basic', 'private security'],
      tech: ['electronic locks', 'security system', 'none']
    };
    
    return this.randomFrom(typeSecurity[type]);
  }
  
  displayLocation() {
    if (!this.currentLocation) return;
    
    const display = this.container.querySelector('#location-display');
    const location = this.currentLocation;
    const districtData = this.districts[location.district];
    
    display.innerHTML = `
      <div class="location-header">
        <div class="location-name">
          <glitch-text text="${location.name}" intensity="low" hover-glitch color="primary"></glitch-text>
        </div>
        <div class="location-type">${location.subtype} • ${this.locationTypes[location.type].name}</div>
        <div class="location-district">${districtData.name} District</div>
      </div>
      
      <div class="location-details">
        <div class="detail-section">
          <h4>📍 Location Info</h4>
          <p><strong>Description:</strong> ${location.description}</p>
          <p><strong>Atmosphere:</strong> ${location.atmosphere}</p>
          <p><strong>Security:</strong> ${location.security}</p>
          <p><strong>District Danger:</strong> <span style="color: var(--${this.getDangerColor(districtData.danger)})">${districtData.danger}</span></p>
        </div>
        
        <div class="detail-section">
          <h4>🏗️ Features</h4>
          <ul class="feature-list">
            ${location.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <div class="detail-section">
          <h4>👥 NPCs Present</h4>
          <div class="npc-list">
            ${location.npcs.map(npc => `
              <div class="npc-card">
                <div class="npc-name">${npc.name}</div>
                <div class="npc-role">${npc.role} • ${npc.trait}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Motivated by: ${npc.motivation}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        ${location.hooks.length > 0 ? `
          <div class="detail-section">
            <h4>🎭 Story Hooks</h4>
            <ul class="feature-list">
              ${location.hooks.map(hook => `<li>${hook}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${location.complications.length > 0 ? `
          <div class="detail-section">
            <h4>⚠️ Complications</h4>
            <ul class="feature-list">
              ${location.complications.map(comp => `<li style="color: var(--warning);">${comp}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }
  
  renderDistrictMap() {
    const mapContainer = this.container.querySelector('#district-map');
    
    mapContainer.innerHTML = Object.entries(this.districts).map(([key, district]) => `
      <cyber-card 
        variant="primary" 
        interactive
        title="${district.name}"
        subtitle="${district.population} pop. • ${district.security} security"
        data-district="${key}">
        <div class="district-info">
          <div class="district-description">${district.description}</div>
          <div class="district-stats">
            <span>Danger: <span style="color: var(--${this.getDangerColor(district.danger)})">${district.danger}</span></span>
            <span>Wealth: ${district.wealth}</span>
          </div>
        </div>
      </cyber-card>
    `).join('');
    
    // Add click listeners to district cards
    mapContainer.querySelectorAll('cyber-card').forEach(card => {
      card.addEventListener('cyber-card-click', (e) => {
        const district = e.target.dataset.district;
        this.generateLocation(district);
        this.switchTab('details');
      });
    });
  }
  
  getDangerColor(danger) {
    const colors = {
      'minimal': 'success',
      'low': 'success',
      'medium': 'warning',
      'high': 'danger',
      'extreme': 'danger'
    };
    return colors[danger] || 'primary';
  }
  
  generateRandomDistrict() {
    const randomDistrict = this.randomFrom(Object.keys(this.districts));
    this.container.querySelector('#location-district').value = randomDistrict;
    this.generateLocation(randomDistrict);
  }
  
  generateQuickEncounter() {
    // Generate a quick encounter-focused location
    this.generateLocation();
    
    if (window.PanelUtils) {
      window.PanelUtils.showNotification('Quick encounter location generated!', 'success');
    }
  }
  
  saveLocation() {
    if (this.currentLocation) {
      this.savedLocations.push({ ...this.currentLocation });
      localStorage.setItem('savedLocations', JSON.stringify(this.savedLocations));
      this.displaySavedLocations();
      
      if (window.PanelUtils) {
        window.PanelUtils.showNotification('Location saved successfully!', 'success');
      }
    }
  }
  
  displaySavedLocations() {
    const savedList = this.container.querySelector('#saved-locations-list');
    
    if (this.savedLocations.length === 0) {
      savedList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">No saved locations yet</div>';
      return;
    }
    
    savedList.innerHTML = this.savedLocations.map((location, index) => `
      <div class="saved-location-item">
        <div>
          <strong>${location.name}</strong><br>
          <small>${location.subtype} in ${this.districts[location.district].name}</small>
        </div>
        <div style="display: flex; gap: 5px;">
          <button onclick="this.getRootNode().host.loadLocation(${index})" 
                  style="padding: 5px 10px; background: var(--primary); border: none; color: black; cursor: pointer; font-size: 12px;">
            Load
          </button>
          <button onclick="this.getRootNode().host.deleteLocation(${index})" 
                  style="padding: 5px 10px; background: var(--danger); border: none; color: white; cursor: pointer; font-size: 12px;">
            Delete
          </button>
        </div>
      </div>
    `).join('');
  }
  
  loadLocation(index) {
    this.currentLocation = { ...this.savedLocations[index] };
    this.displayLocation();
    this.switchTab('details');
    
    // Enable save button
    const saveBtn = this.container.querySelector('#save-location');
    saveBtn.removeAttribute('disabled');
  }
  
  deleteLocation(index) {
    if (confirm('Delete this location?')) {
      this.savedLocations.splice(index, 1);
      localStorage.setItem('savedLocations', JSON.stringify(this.savedLocations));
      this.displaySavedLocations();
    }
  }
  
  switchTab(tabName) {
    // Update tab buttons
    const tabs = this.container.querySelectorAll('.location-tab');
    tabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.tab === tabName) {
        tab.classList.add('active');
      }
    });
    
    // Update tab content
    const contents = this.container.querySelectorAll('.tab-content');
    contents.forEach(content => {
      content.classList.remove('active');
    });
    
    const activeContent = this.container.querySelector(`#${tabName}-tab`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
  }
  
  addToHistory() {
    this.generationHistory.unshift(this.currentLocation);
    if (this.generationHistory.length > 10) {
      this.generationHistory = this.generationHistory.slice(0, 10);
    }
  }
  
  loadSavedLocations() {
    try {
      return JSON.parse(localStorage.getItem('savedLocations') || '[]');
    } catch (error) {
      console.error('Error loading saved locations:', error);
      return [];
    }
  }
  
  randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedLocationGenerator;
}