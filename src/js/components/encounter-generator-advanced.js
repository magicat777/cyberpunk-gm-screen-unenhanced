// Advanced Encounter Generator with Detailed Scenarios
class AdvancedEncounterGenerator {
  constructor() {
    this.encounters = {
      combat: {
        street: [
          {
            name: "Gang Ambush",
            description: "A local gang has set up an ambush in a narrow alley, using dumpsters and parked cars as cover.",
            difficulty: "Medium",
            enemies: [
              { type: "Ganger", count: "1d4+2", equipment: ["Heavy Pistol", "Knife", "Light Armorjack"] },
              { type: "Gang Lieutenant", count: "1", equipment: ["SMG", "Medium Armorjack", "Cybereye"] }
            ],
            environment: {
              lighting: "Dim (streetlights, -2 to ranged attacks beyond 20m)",
              cover: "Abundant (dumpsters, cars, doorways)",
              hazards: ["Broken glass (DV10 to move through quickly)", "Steam vents (obscures vision)"],
              civilians: "1d6 bystanders who flee when combat starts"
            },
            tactics: "Gangers use suppressing fire while lieutenant flanks. Will retreat if lieutenant is killed.",
            loot: [
              "€50-200 per ganger",
              "Street drugs (1d4 doses)",
              "Cheap weapons",
              "Gang colors (reputation impact)"
            ],
            complications: [
              "NCPD arrives in 2d6 rounds",
              "Rival gang shows up to 'help'",
              "One ganger has a grenade",
              "Sniper on nearby rooftop"
            ]
          },
          {
            name: "Corporate Extraction Gone Wrong",
            description: "A corporate extraction team is pinned down by security forces. Both sides might see the party as threats or opportunities.",
            difficulty: "Hard",
            enemies: [
              { type: "Corporate Security", count: "2d4", equipment: ["Assault Rifle", "Light Armorjack", "Tactical Comms"] },
              { type: "Extraction Team", count: "1d4+1", equipment: ["SMG", "Medium Armorjack", "Smoke Grenades"] }
            ],
            environment: {
              lighting: "Strobing (alarm lights, -1 to all attacks)",
              cover: "Moderate (office furniture, pillars)",
              hazards: ["Suppression systems (foam, slippery floors)", "Security doors (can trap combatants)"],
              civilians: "2d6 office workers hiding"
            },
            tactics: "Security holds position, extraction team tries to break through. Both may negotiate with party.",
            loot: [
              "Corporate weapons (high quality)",
              "Security badges (temporary access)",
              "Extraction target (valuable asset/person)",
              "€1000-5000 in corporate scrip"
            ],
            complications: [
              "Building goes into lockdown",
              "Extraction target is actually a double agent",
              "AV support arrives for one side",
              "EMP device threatens all cyberware"
            ]
          }
        ],
        vehicle: [
          {
            name: "High-Speed Chase",
            description: "A pursuit through Night City's congested streets, weaving between traffic and avoiding obstacles.",
            difficulty: "Medium",
            enemies: [
              { type: "Pursuit Vehicles", count: "1d3+1", equipment: ["Armed bikes/cars", "Ramming capability"] },
              { type: "Drone Support", count: "1d2", equipment: ["Surveillance", "Light weapons"] }
            ],
            environment: {
              traffic: "Heavy (DV15 to navigate)",
              obstacles: ["Construction zones", "Market stalls", "Pedestrian areas"],
              law_enforcement: "NCPD response in 1d6+2 rounds",
              weather: "Random (rain adds +2 DV to driving)"
            },
            phases: [
              "Initial pursuit (straight speed)",
              "Complication (roadblock, traffic jam)",
              "Dangerous shortcut opportunity",
              "Final confrontation"
            ],
            consequences: [
              "Property damage fines",
              "Civilian casualties (reputation loss)",
              "Vehicle damage",
              "Heat from NCPD"
            ]
          }
        ],
        cyberspace: [
          {
            name: "Data Fortress Infiltration",
            description: "A netrunner must penetrate a corporate data fortress while the team protects their meat body.",
            difficulty: "Hard",
            digital_enemies: [
              { type: "Black ICE", count: "1d4+2", abilities: ["Hellhound", "Wisp", "Killer"] },
              { type: "Sysop", count: "1", abilities: ["Trace", "Shutdown", "Alert"] }
            ],
            physical_enemies: [
              { type: "Corporate Security", count: "Arrives in 2d6 rounds", equipment: ["Standard security gear"] }
            ],
            objectives: [
              "Steal data package",
              "Plant virus",
              "Alter records",
              "Rescue trapped AI"
            ],
            net_architecture: {
              layers: "3-5 (passwords, puzzles, combat)",
              data_mines: "1d4 (fake data to slow runners)",
              trace_difficulty: "DV15 initially, +2 per layer"
            }
          }
        ]
      },
      social: {
        negotiation: [
          {
            name: "Fixer Meet Gone Sideways",
            description: "A meeting with a fixer to discuss a job becomes complicated when another party shows interest.",
            difficulty: "Medium",
            npcs: [
              { name: "The Fixer", personality: "Calculating, profit-focused", goals: "Make deal, maintain reputation" },
              { name: "Rival Crew", personality: "Aggressive, desperate", goals: "Steal the job, eliminate competition" },
              { name: "Mystery Contact", personality: "Enigmatic, well-informed", goals: "Hidden agenda" }
            ],
            location: "Afterlife bar (neutral ground)",
            stakes: {
              success: "Lucrative job, fixer relationship +1",
              failure: "No job, potential enemy, reputation -1",
              critical_success: "Double pay, exclusive fixer access",
              critical_failure: "Set up for ambush, fixer blacklists party"
            },
            social_challenges: [
              "Read the room (detect rival crew's intentions)",
              "Negotiate terms (price, conditions)",
              "Handle interruption (rival crew interference)",
              "Spot the rat (someone's recording)"
            ],
            escalation_triggers: [
              "Someone draws a weapon",
              "Fixer is insulted",
              "Rival crew makes a move",
              "NCPD raid warning"
            ]
          }
        ],
        infiltration: [
          {
            name: "Corporate Gala Infiltration",
            description: "The party must blend in at a high-society corporate event to complete their objective.",
            difficulty: "Hard",
            requirements: [
              "Appropriate clothing (€500+ per person)",
              "Fake identities (DV15 to craft)",
              "Social skills (Cool, Presence)",
              "Knowledge of corporate etiquette"
            ],
            objectives: [
              "Plant listening device in CEO's office",
              "Steal biometric data from target",
              "Make contact with insider",
              "Photograph secret prototype"
            ],
            social_obstacles: [
              "Security checkpoint (metal detectors, ID scan)",
              "Small talk with executives (current events check)",
              "Dance floor diplomacy (DEX + Cool)",
              "Avoiding drunk middle manager"
            ],
            discoveries: [
              "Two corps planning merger",
              "Assassination attempt in progress",
              "Black market auction in basement",
              "Corporate spy from rival company"
            ]
          }
        ]
      },
      exploration: {
        urban: [
          {
            name: "Abandoned Megabuilding",
            description: "Exploring a partially collapsed megabuilding in the Combat Zone, searching for lost tech or missing person.",
            difficulty: "Medium",
            floors: [
              { level: "Ground", hazards: ["Boostergang territory", "Trapped entrances"], loot: ["Street vendor stashes"] },
              { level: "Mid-levels", hazards: ["Unstable floors", "Scavenger ambush"], loot: ["Abandoned apartments"] },
              { level: "Upper floors", hazards: ["No power", "Structural collapse"], loot: ["Corporate safe house"] },
              { level: "Roof", hazards: ["Drone patrol", "Sniper nest"], loot: ["Hidden stash", "AV landing pad"] }
            ],
            environmental_dangers: [
              "Failing structure (DEX saves)",
              "No lighting (darkness penalties)",
              "Toxic areas (radiation/chemicals)",
              "Scavenger traps"
            ],
            discoveries: [
              "Pre-war tech cache",
              "Illegal biolab",
              "Gang drug lab",
              "Cyberpsycho lair",
              "Corporate black site"
            ],
            random_encounters: [
              "Homeless community (information for food)",
              "Lost child (moral choice)",
              "Wounded boosterganger (help or rob)",
              "Rogue AI in building systems"
            ]
          }
        ],
        badlands: [
          {
            name: "Nomad Convoy Escort",
            description: "Protecting a Nomad convoy through the dangerous badlands from raiders and worse.",
            difficulty: "Medium",
            convoy_composition: [
              "3d6 vehicles (trucks, cars, bikes)",
              "2d10+10 Nomads (civilians and fighters)",
              "Valuable cargo (specify based on job)"
            ],
            journey_phases: [
              {
                phase: "Open Highway",
                threats: ["Raffen Shiv scouts", "NCPD checkpoint"],
                duration: "2 hours"
              },
              {
                phase: "Canyon Pass",
                threats: ["Ambush points", "Rockslides"],
                duration: "1 hour"
              },
              {
                phase: "Toxic Wasteland",
                threats: ["Radiation zones", "Mutant animals"],
                duration: "3 hours"
              },
              {
                phase: "Border Crossing",
                threats: ["Corporate security", "Smuggler competition"],
                duration: "30 minutes"
              }
            ],
            complications: [
              "Traitor in the convoy",
              "Cargo is not what it seems",
              "Sandstorm reduces visibility",
              "Rival Nomad clan claims territory"
            ]
          }
        ]
      },
      horror: {
        psychological: [
          {
            name: "Braindance Nightmare",
            description: "A black market BD turns out to be a cyberpsycho's memories, trapping users in a horrific experience.",
            difficulty: "Hard",
            phases: [
              {
                name: "Initial Immersion",
                description: "Pleasant memories suddenly turn dark",
                effects: ["Disorientation", "Can't distinguish BD from reality"]
              },
              {
                name: "Descent into Madness",
                description: "Experience the cyberpsycho's break",
                effects: ["Humanity checks", "Temporary cyberpsychosis symptoms"]
              },
              {
                name: "The Killing Spree",
                description: "Relive murders from killer's perspective",
                effects: ["Combat from unfamiliar viewpoint", "Moral trauma"]
              },
              {
                name: "Escape Attempt",
                description: "Break free from corrupted BD",
                effects: ["Tech rolls to disconnect", "Mental damage on failure"]
              }
            ],
            lasting_effects: [
              "Nightmares (reduced rest benefits)",
              "Paranoia (penalty to social rolls)",
              "BD phobia (can't use braindances)",
              "Killer's memories (unwanted skill knowledge)"
            ]
          }
        ],
        body_horror: [
          {
            name: "Biotechnica Experiment Gone Wrong",
            description: "A secret lab's experiments have created something that should not exist.",
            difficulty: "Very Hard",
            creature: {
              origin: "Human test subjects merged with bioware",
              abilities: ["Adaptive camouflage", "Acid secretion", "Hive mind", "Rapid regeneration"],
              weaknesses: ["Fire", "EMP (disrupts neural link)", "Specific frequency sound"],
              behavior: "Hunts in coordinated packs, takes victims alive for 'integration'"
            },
            location_details: {
              areas: ["Reception (false normalcy)", "Labs (horror evidence)", "Holding cells (survivors?)", "Core (the source)"],
              environmental_hazards: ["Biocontaminants", "Quarantine protocols", "Automated defenses", "Power failures"],
              clues: ["Research logs", "Security footage", "Survivor testimonies", "Failed experiments"]
            },
            moral_choices: [
              "Trapped scientists (save or leave)",
              "Infected survivor (help or eliminate)",
              "Research data (destroy or steal)",
              "Creature young (spare or exterminate)"
            ]
          }
        ]
      },
      mystery: {
        investigation: [
          {
            name: "The Vanishing Netrunners",
            description: "Elite netrunners are disappearing without a trace. The last one left only a cryptic message.",
            difficulty: "Hard",
            clues: {
              digital: ["Corrupted log files", "Ghost in the NET sightings", "Unusual data signatures", "Quantum encryption traces"],
              physical: ["Empty apartments", "Fried cyberdecks", "Neural burnout patterns", "Missing persons reports"],
              social: ["Fixer concerns", "Corporate interest", "Underground panic", "Government involvement"]
            },
            investigation_sites: [
              "Victim's apartments (personal effects)",
              "NET cafes (last known locations)",
              "Black market cyberdeck dealers",
              "Abandoned Arasaka facility"
            ],
            red_herrings: [
              "Rival netrunner setting up competition",
              "Corporate black project cover-up",
              "Rogue AI seeking revenge",
              "Government creating super-soldiers"
            ],
            truth: {
              revelation: "Pre-DataKrash AI has been 'collecting' netrunners",
              motivation: "Building a neural network to escape the Old NET",
              final_confrontation: "Digital dungeon in collapsed NET architecture",
              consequences: "Freeing netrunners vs containing AI threat"
            }
          }
        ]
      }
    };
    
    this.modifiers = {
      party_size: {
        small: { enemy_count: 0.75, loot: 0.8 },
        medium: { enemy_count: 1, loot: 1 },
        large: { enemy_count: 1.5, loot: 1.2 }
      },
      time_of_day: {
        day: { stealth_dc: +2, visibility: "normal" },
        night: { stealth_dc: -2, visibility: "limited", crime_rate: +1 },
        dawn_dusk: { stealth_dc: 0, visibility: "changing" }
      },
      district_modifier: {
        city_center: { security: +3, loot_quality: +2, response_time: -2 },
        watson: { security: 0, loot_quality: 0, gang_presence: +2 },
        westbrook: { security: +1, loot_quality: +1, social_encounters: +2 },
        pacifica: { security: -3, loot_quality: -1, danger: +3 },
        badlands: { security: -2, loot_quality: 0, environmental: +2 }
      }
    };
  }
  
  generateEncounter(type = 'random', subtype = 'random', modifiers = {}) {
    // Select encounter type
    if (type === 'random') {
      const types = Object.keys(this.encounters);
      type = types[Math.floor(Math.random() * types.length)];
    }
    
    // Select subtype
    if (subtype === 'random') {
      const subtypes = Object.keys(this.encounters[type]);
      subtype = subtypes[Math.floor(Math.random() * subtypes.length)];
    }
    
    // Get encounter array
    const encounterArray = this.encounters[type][subtype];
    if (!encounterArray || encounterArray.length === 0) {
      return { error: 'No encounters found for specified type/subtype' };
    }
    
    // Select specific encounter
    const baseEncounter = encounterArray[Math.floor(Math.random() * encounterArray.length)];
    
    // Deep clone to avoid modifying original
    const encounter = JSON.parse(JSON.stringify(baseEncounter));
    
    // Apply modifiers
    this.applyModifiers(encounter, modifiers);
    
    // Add dynamic elements
    this.addDynamicElements(encounter, type, subtype);
    
    // Generate additional details
    encounter.metadata = {
      type,
      subtype,
      generated: new Date().toISOString(),
      modifiers,
      id: this.generateId()
    };
    
    return encounter;
  }
  
  applyModifiers(encounter, modifiers) {
    const { partySize = 'medium', timeOfDay = 'night', district = 'watson', difficulty_adjust = 0 } = modifiers;
    
    // Adjust enemy counts
    if (encounter.enemies) {
      const sizeMultiplier = this.modifiers.party_size[partySize].enemy_count;
      encounter.enemies.forEach(enemy => {
        if (typeof enemy.count === 'string' && enemy.count.includes('d')) {
          enemy.count = `(${enemy.count}) x ${sizeMultiplier}`;
        } else if (typeof enemy.count === 'number') {
          enemy.count = Math.ceil(enemy.count * sizeMultiplier);
        }
      });
    }
    
    // Apply time of day effects
    const timeModifiers = this.modifiers.time_of_day[timeOfDay];
    if (encounter.environment) {
      encounter.environment.visibility = timeModifiers.visibility;
      encounter.environment.lighting = encounter.environment.lighting || this.getLightingForTime(timeOfDay);
    }
    
    // Apply district modifiers
    const districtMods = this.modifiers.district_modifier[district];
    if (districtMods) {
      if (encounter.environment) {
        encounter.environment.security_response = this.getSecurityResponse(districtMods.security);
      }
      if (encounter.loot) {
        encounter.loot_quality_modifier = districtMods.loot_quality;
      }
    }
    
    // Adjust difficulty
    if (difficulty_adjust !== 0) {
      encounter.difficulty = this.adjustDifficulty(encounter.difficulty, difficulty_adjust);
      if (encounter.enemies) {
        encounter.enemies.forEach(enemy => {
          enemy.skill_modifier = (enemy.skill_modifier || 0) + difficulty_adjust;
        });
      }
    }
  }
  
  addDynamicElements(encounter, type, subtype) {
    // Add random NPCs
    encounter.random_npcs = this.generateRandomNPCs(type);
    
    // Add weather
    encounter.weather = this.generateWeather();
    
    // Add random complication chance
    if (encounter.complications && Math.random() < 0.3) {
      const complication = encounter.complications[Math.floor(Math.random() * encounter.complications.length)];
      encounter.active_complication = complication;
    }
    
    // Add hooks to other encounters
    encounter.connections = this.generateConnections(type, subtype);
    
    // Add sensory details
    encounter.sensory = this.generateSensoryDetails(type, subtype);
  }
  
  generateRandomNPCs(type) {
    const npcTemplates = {
      combat: [
        { name: "Panicked Civilian", role: "Liability", behavior: "Runs through firefight" },
        { name: "Off-duty NCPD", role: "Wildcard", behavior: "Might help or call backup" },
        { name: "Street Kid Lookout", role: "Information", behavior: "Will trade info for safety" }
      ],
      social: [
        { name: "Corporate Spy", role: "Complication", behavior: "Gathering intel on everyone" },
        { name: "Drunk Exec", role: "Distraction", behavior: "Causes scenes, drops info" },
        { name: "Ambitious Fixer", role: "Opportunity", behavior: "Always networking" }
      ],
      exploration: [
        { name: "Scavenger", role: "Competitor", behavior: "After the same loot" },
        { name: "Lost Nomad", role: "Guide", behavior: "Knows area, needs escort" },
        { name: "Corporate Researcher", role: "Information", behavior: "Investigating same mystery" }
      ]
    };
    
    const npcs = npcTemplates[type] || [];
    const count = Math.floor(Math.random() * 3);
    const selected = [];
    
    for (let i = 0; i < count && npcs.length > 0; i++) {
      const npc = npcs[Math.floor(Math.random() * npcs.length)];
      selected.push({
        ...npc,
        appearance: this.generateAppearance(),
        quirk: this.generateQuirk()
      });
    }
    
    return selected;
  }
  
  generateWeather() {
    const conditions = [
      { type: "Clear", effects: "No modifiers" },
      { type: "Acid Rain", effects: "DV12 exposure check per hour, -1 to all actions outdoors" },
      { type: "Smog", effects: "Visibility reduced to 50m, breathing protection recommended" },
      { type: "Heat Wave", effects: "Endurance checks every hour, x2 water consumption" },
      { type: "Dust Storm", effects: "Visibility 10m, -3 to ranged attacks, vehicle DV +3" },
      { type: "Fog", effects: "Visibility 20m, +2 to stealth, -2 to perception" }
    ];
    
    return conditions[Math.floor(Math.random() * conditions.length)];
  }
  
  generateConnections(type, subtype) {
    const connections = [];
    
    // Previous encounter callback
    if (Math.random() < 0.3) {
      connections.push({
        type: "Callback",
        description: "NPC from previous encounter recognizes party",
        impact: "Reputation effects, possible aid or vendetta"
      });
    }
    
    // Future hook
    if (Math.random() < 0.4) {
      connections.push({
        type: "Hook",
        description: "Clue or contact leads to future opportunity",
        impact: "New job offer, important information, valuable contact"
      });
    }
    
    // Faction involvement
    if (Math.random() < 0.5) {
      const factions = ["Arasaka", "Militech", "Tyger Claws", "Valentinos", "NCPD", "NetWatch"];
      connections.push({
        type: "Faction",
        description: `${factions[Math.floor(Math.random() * factions.length)]} has interest in outcome`,
        impact: "Faction reputation changes, possible retaliation or reward"
      });
    }
    
    return connections;
  }
  
  generateSensoryDetails(type, subtype) {
    const sensoryMap = {
      combat: {
        sights: ["Muzzle flashes in darkness", "Blood splatter on walls", "Sparking damaged cyberware"],
        sounds: ["Gunfire echoes", "Screaming civilians", "Shattering glass", "Police sirens approaching"],
        smells: ["Cordite", "Ozone from energy weapons", "Fear sweat", "Burning electronics"],
        textures: ["Brass casings underfoot", "Sticky blood", "Rough concrete cover"],
        tastes: ["Metallic fear", "Dust in the air", "Chemical smoke"]
      },
      social: {
        sights: ["Holographic displays", "Fashion extremes", "Corporate logos everywhere"],
        sounds: ["Multiple conversations", "Background music", "Notification pings", "Hushed arguments"],
        smells: ["Expensive perfume", "Synthetic alcohol", "Vape clouds", "Cleaning chemicals"],
        textures: ["Smooth synthsilk", "Cold metal furniture", "Crowded spaces"],
        tastes: ["Synthetic champagne", "Flavored air", "Metallic water"]
      },
      exploration: {
        sights: ["Flickering lights", "Graffiti warnings", "Structural damage", "Old bloodstains"],
        sounds: ["Dripping water", "Settling structure", "Distant machinery", "Scurrying rats"],
        smells: ["Decay", "Chemical spills", "Mold", "Ozone from damaged electronics"],
        textures: ["Rough broken concrete", "Slippery surfaces", "Sharp debris"],
        tastes: ["Dust", "Stale air", "Chemical residue"]
      }
    };
    
    const details = sensoryMap[type] || sensoryMap.exploration;
    const selected = {};
    
    Object.entries(details).forEach(([sense, options]) => {
      selected[sense] = options[Math.floor(Math.random() * options.length)];
    });
    
    return selected;
  }
  
  generateAppearance() {
    const appearances = [
      "Chrome-covered arms",
      "Neon hair implants",
      "Corporate suit, worn",
      "Gang colors prominent",
      "Obvious combat cyberware",
      "Ragged nomad gear",
      "High-fashion extremes",
      "Medical scrubs, bloodstained"
    ];
    return appearances[Math.floor(Math.random() * appearances.length)];
  }
  
  generateQuirk() {
    const quirks = [
      "Constantly checking phone",
      "Nervous tick in eye",
      "Quotes old movies",
      "Chain-smokes",
      "Paranoid glances",
      "Compulsive cleaner",
      "Never stops smiling",
      "Whispers to themself"
    ];
    return quirks[Math.floor(Math.random() * quirks.length)];
  }
  
  getLightingForTime(timeOfDay) {
    const lighting = {
      day: "Bright (no penalties)",
      night: "Dark (penalties without light source)",
      dawn_dusk: "Dim (minor penalties at range)"
    };
    return lighting[timeOfDay] || lighting.night;
  }
  
  getSecurityResponse(level) {
    const responses = {
      '-3': "No response (you're on your own)",
      '-2': "Response in 20+ minutes if at all",
      '-1': "Response in 15-20 minutes",
      '0': "Response in 10-15 minutes",
      '1': "Response in 5-10 minutes",
      '2': "Response in 3-5 minutes",
      '3': "Response in 1-3 minutes, heavy units"
    };
    return responses[level] || responses['0'];
  }
  
  adjustDifficulty(baseDifficulty, adjustment) {
    const difficulties = ["Easy", "Medium", "Hard", "Very Hard", "Nearly Impossible"];
    const currentIndex = difficulties.indexOf(baseDifficulty) || 1;
    const newIndex = Math.max(0, Math.min(difficulties.length - 1, currentIndex + adjustment));
    return difficulties[newIndex];
  }
  
  generateId() {
    return 'enc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Export encounter for reuse
  exportEncounter(encounter) {
    return JSON.stringify(encounter, null, 2);
  }
  
  // Import saved encounter
  importEncounter(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to import encounter:', error);
      return null;
    }
  }
  
  // Get encounter by specific criteria
  searchEncounters(criteria) {
    const { type, subtype, difficulty, keyword } = criteria;
    const results = [];
    
    Object.entries(this.encounters).forEach(([t, subtypes]) => {
      if (type && t !== type) return;
      
      Object.entries(subtypes).forEach(([st, encounters]) => {
        if (subtype && st !== subtype) return;
        
        encounters.forEach(enc => {
          if (difficulty && enc.difficulty !== difficulty) return;
          
          if (keyword) {
            const searchStr = JSON.stringify(enc).toLowerCase();
            if (!searchStr.includes(keyword.toLowerCase())) return;
          }
          
          results.push({
            ...enc,
            metadata: { type: t, subtype: st }
          });
        });
      });
    });
    
    return results;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedEncounterGenerator;
}