// Cyberpunk Lore Database - Rich Content System
class LoreDatabase {
  constructor() {
    this.categories = {
      corporations: {
        name: 'Megacorporations',
        icon: '🏢',
        description: 'The true power brokers of the Cyberpunk world',
        entries: [
          {
            id: 'arasaka',
            name: 'Arasaka Corporation',
            type: 'Japanese Megacorp',
            summary: 'Global leader in corporate security, banking, and manufacturing',
            details: {
              founded: '1915',
              headquarters: 'Tokyo, Japan',
              ceo: 'Saburo Arasaka (until 2023)',
              employees: '1.2 million worldwide',
              stockPrice: '¥892,340',
              motto: 'We are the Future',
              primaryIndustries: ['Corporate Security', 'Banking', 'Manufacturing', 'Biotechnology'],
              notableProducts: [
                'Soulkiller - Digital consciousness storage',
                'Arasaka Mantis Blades - Cybernetic arm weapons',
                'Arasaka 3516 - Smart assault rifle',
                'Mikoshi - Secure data fortress'
              ],
              history: `Founded as a manufacturing company in 1915, Arasaka transformed into a zaibatsu following WWII. Under Saburo Arasaka's leadership, it became the world's most powerful megacorporation by 2020. The Fourth Corporate War with Militech devastated both companies, but Arasaka rebuilt stronger than ever.`,
              darkSecrets: [
                'Operates the Soulkiller program to digitize human consciousness',
                'Maintains secret bio-weapon research facilities',
                'Controls 78% of global corporate espionage operations',
                'Has infiltrated most world governments at the highest levels'
              ],
              relationships: {
                allies: ['Kang Tao', 'Arasaka-backed political parties'],
                enemies: ['Militech', 'Nomad clans', 'Most of Night City'],
                neutral: ['Biotechnica', 'Petrochem']
              }
            },
            gameplayNotes: [
              'Arasaka agents use top-tier cyberware and smart weapons',
              'Corporate facilities have ICE rating 8-10',
              'Employees have loyalty implants - betrayal means death',
              'Access to experimental tech not available elsewhere'
            ]
          },
          {
            id: 'militech',
            name: 'Militech International',
            type: 'American Military Corporation',
            summary: 'Largest military contractor and arms manufacturer',
            details: {
              founded: '1996',
              headquarters: 'Washington D.C., NUSA',
              ceo: 'Rosalind Myers',
              employees: '890,000 worldwide',
              stockPrice: '$1,247.82',
              motto: 'First in Defense',
              primaryIndustries: ['Military Hardware', 'Private Military', 'Aerospace', 'Heavy Industry'],
              notableProducts: [
                'Militech Crusher - Shotgun with explosive rounds',
                'Militech Basilisk - Panzer-class hovertank',
                'Militech M-179 Achilles - Precision rifle',
                'Militech Centaur - Powered exoskeleton'
              ],
              history: `Born from the merger of several defense contractors in 1996, Militech quickly dominated the military-industrial complex. The Fourth Corporate War with Arasaka nearly destroyed both companies, but Militech emerged as the NUSA's primary defense contractor.`,
              darkSecrets: [
                'Operates black sites for human weapons testing',
                'Secretly controls 40% of NUSA government decisions',
                'Maintains private army larger than most nations',
                'Develops banned nanoweapons and bioweapons'
              ]
            }
          },
          {
            id: 'biotechnica',
            name: 'Biotechnica',
            type: 'Italian Biotechnology Corporation',
            summary: 'Leader in genetic engineering and pharmaceuticals',
            details: {
              founded: '2012',
              headquarters: 'Rome, Italy',
              specialties: ['Genetic Engineering', 'Cloning', 'Pharmaceuticals', 'Agricultural Biotech'],
              notableAchievements: [
                'CHOOH2 - Revolutionized global fuel industry',
                'First successful human clone (classified)',
                'Cure for most cancers (restricted access)',
                'Enhanced crop strains feeding billions'
              ]
            }
          }
        ]
      },
      locations: {
        name: 'Night City Districts',
        icon: '🌃',
        description: 'The sprawling metropolis and its dangerous neighborhoods',
        entries: [
          {
            id: 'city-center',
            name: 'City Center',
            type: 'Corporate District',
            summary: 'The gleaming heart of corporate power',
            details: {
              population: '285,000',
              crimeRate: 'Low (Heavy Corporate Security)',
              avgRent: '€8,500/month',
              threat: 'Corporate Espionage, White Collar Crime',
              notableLocations: [
                'Arasaka Tower - Rebuilt corporate headquarters',
                'Corpo Plaza - Shopping and business district',
                'Memorial Park - Site of the old Arasaka Tower',
                'Night City Stock Exchange'
              ],
              atmosphere: `Glass and steel towers pierce the sky, their surfaces displaying endless corporate propaganda. Armed security on every corner, facial recognition scanners, and drones patrol overhead. The streets are clean, the people well-dressed, but beneath the polish lurks cutthroat ambition and deadly corporate politics.`,
              encounters: [
                'Corporate extraction gone wrong',
                'Insider trading data courier chase',
                'High-stakes negotiation at rooftop restaurant',
                'Corporate spy trying to defect'
              ],
              localFactions: {
                corporate: ['Arasaka', 'Militech', 'Kang Tao'],
                security: ['Arasaka Security', 'NCPD Tactical Division'],
                underground: ['Corporate fixers', 'High-end joytoy services']
              }
            }
          },
          {
            id: 'watson',
            name: 'Watson',
            type: 'Mixed Residential/Industrial',
            summary: 'Once prosperous, now a decaying urban sprawl',
            details: {
              population: '712,000',
              crimeRate: 'High',
              avgRent: '€1,200/month',
              threat: 'Gang Violence, Corporate Exploitation',
              subDistricts: [
                'Little China - Overcrowded residential megabuildings',
                'Kabuki - Red-light district and black market hub',
                'Northside Industrial - Abandoned factories and Maelstrom territory'
              ],
              atmosphere: `Neon signs in a dozen languages flicker over crowded streets. The smell of street food mingles with industrial pollution. Megabuildings house thousands in cramped apartments while gangs control the streets after dark.`,
              notableGangs: ['Maelstrom', 'Tyger Claws', 'Scavengers']
            }
          },
          {
            id: 'westbrook',
            name: 'Westbrook',
            type: 'Luxury District',
            summary: 'Where the rich play and dreams are sold',
            details: {
              population: '168,000',
              crimeRate: 'Low to Moderate',
              avgRent: '€5,000-15,000/month',
              subDistricts: [
                'North Oak - Ultra-luxury mansions and private security',
                'Charter Hill - High-end apartments and corporate housing',
                'Japantown - Cultural center and entertainment district'
              ],
              notableLocations: [
                'Clouds - High-end dollhouse',
                'The Afterlife - Legendary merc bar',
                'Jig-Jig Street - Explicit entertainment',
                'Cherry Blossom Market - Luxury shopping'
              ]
            }
          },
          {
            id: 'pacifica',
            name: 'Pacifica',
            type: 'Combat Zone',
            summary: 'Failed resort district turned lawless wasteland',
            details: {
              population: '~380,000 (estimated)',
              crimeRate: 'Extreme',
              avgRent: 'Squatter rights only',
              threat: 'Constant warfare, No law enforcement',
              history: `Planned as a luxury resort district, Pacifica was abandoned after economic collapse. Now it's a combat zone where only the strongest survive. The Voodoo Boys control much of the area, while various gangs fight for the scraps.`,
              survivalTips: [
                'Never travel alone',
                'Bring heavy weapons and armor',
                'Bribe or avoid Voodoo Boys',
                'Emergency extraction on speed dial'
              ]
            }
          }
        ]
      },
      technology: {
        name: 'Technology & Cyberware',
        icon: '🤖',
        description: 'The bleeding edge of human augmentation',
        entries: [
          {
            id: 'cyberware-basics',
            name: 'Cyberware Fundamentals',
            type: 'Technology Overview',
            details: {
              definition: 'Cybernetic hardware directly integrated with the human body',
              categories: [
                'Neural (Brain/Nervous System)',
                'Optical (Eyes)',
                'Audio (Ears)',
                'Limbs (Arms/Legs)',
                'Internal (Organs/Skeleton)',
                'Dermal (Skin/Subdermal)',
                'Combat (Weapons/Armor)'
              ],
              risks: [
                'Cyberpsychosis - Loss of empathy from excessive augmentation',
                'EMP vulnerability - Can be disabled by electromagnetic pulse',
                'Malware infection - Hostile netrunners can hack your body',
                'Rejection syndrome - Body may reject the implants'
              ],
              maintenanceRequirements: {
                routine: 'Monthly diagnostic scans',
                parts: 'Proprietary components from manufacturer',
                cost: '10-20% of installation price annually',
                specialists: 'Licensed ripperdocs only'
              }
            }
          },
          {
            id: 'braindance',
            name: 'Braindance Technology',
            type: 'Sensory Recording',
            summary: 'Experience memories and sensations of others',
            details: {
              description: 'Brain-computer interface technology that records and plays back human experiences, including all sensory data and emotions',
              legalStatus: 'Regulated (illegal BDs common on black market)',
              uses: [
                'Entertainment - Live someone else\'s life',
                'Training - Learn skills through experience',
                'Therapy - Treat psychological conditions',
                'Investigation - Analyze crime scenes through witness memories'
              ],
              dangers: [
                'Addiction - Can become dependent on others\' experiences',
                'Psychosis - Difficulty distinguishing reality from BDs',
                'Black market XBDs - Snuff films and torture recordings',
                'Memory corruption - Can overwrite your own memories'
              ],
              majorProducers: ['Diverse Media', 'Bushido X', 'Underground studios']
            }
          },
          {
            id: 'netrunning',
            name: 'Netrunning & Cyberspace',
            type: 'Digital Warfare',
            summary: 'Hacking reality through the NET',
            details: {
              overview: 'Direct neural interface with computer networks, allowing hackers to navigate cyberspace as a virtual environment',
              equipment: [
                'Cyberdeck - Portable hacking computer',
                'Interface plugs - Direct neural connection',
                'ICE breakers - Programs to defeat security',
                'Demons - Attack programs'
              ],
              blackIce: {
                description: 'Lethal defensive programs that can kill hackers',
                types: ['Hellhound', 'Kraken', 'Dragon', 'Reaper'],
                effects: 'Neural damage, brain death, permanent paralysis'
              },
              legendaryNetrunners: [
                'Rache Bartmoss - Destroyed the old NET',
                'Alt Cunningham - Creator of Soulkiller',
                'Spider Murphy - Legendary NET cowboy'
              ]
            }
          }
        ]
      },
      gangs: {
        name: 'Gangs & Factions',
        icon: '☠️',
        description: 'The street-level power players',
        entries: [
          {
            id: 'valentinos',
            name: 'Valentinos',
            type: 'Latino Heritage Gang',
            summary: 'Honor, family, and gold-plated cyberware',
            details: {
              territory: 'Heywood (Vista Del Rey, The Glen)',
              membership: '~6,000 active members',
              leadership: 'Council of veteran members',
              values: ['Honor', 'Family', 'Tradition', 'Style'],
              activities: [
                'Protection rackets',
                'Smuggling operations',
                'Street racing',
                'Traditional crime'
              ],
              style: {
                clothing: 'Gold chains, religious imagery, sharp suits',
                vehicles: 'Customized luxury cars with gold trim',
                weapons: 'Gold-plated guns, traditional melee weapons',
                cyberware: 'Subtle but high-quality, often gold-accented'
              },
              relationships: {
                allies: ['Local communities in Heywood'],
                enemies: ['6th Street', 'Corporations exploiting Heywood'],
                neutral: ['Aldecaldos', 'Most other gangs']
              },
              notableMembers: [
                'Gustavo Orta - Respected elder',
                'José Luis - Master smuggler'
              ]
            }
          },
          {
            id: 'maelstrom',
            name: 'Maelstrom',
            type: 'Cyberpsycho Gang',
            summary: 'Humanity is weakness, chrome is strength',
            details: {
              territory: 'Watson (Northside Industrial)',
              ideology: 'Transhumanism taken to the extreme',
              appearance: 'Heavily modified with combat cyberware, barely human',
              activities: [
                'Cyberware trafficking',
                'Kidnapping for forced augmentation',
                'Raiding corporate convoys',
                'Extreme body modification'
              ],
              initiation: 'Survive extensive cyberware installation without anesthesia',
              philosophy: `"The flesh is weak. We make it strong. Pain is the gateway to transcendence."`,
              combatStyle: {
                tactics: 'Overwhelming firepower and cyberware abilities',
                augmentations: ['Projectile launch systems', 'Mantis blades', 'Gorilla arms'],
                weaknesses: ['EMP weapons', 'Netrunner attacks', 'Cyberpsychosis']
              }
            }
          },
          {
            id: 'voodoo-boys',
            name: 'Voodoo Boys',
            type: 'Netrunner Gang',
            summary: 'Masters of the NET from Pacifica',
            details: {
              territory: 'Pacifica',
              ethnicity: 'Haitian diaspora',
              specialty: 'Elite netrunning and NET exploration',
              goals: [
                'Contact AIs beyond the Blackwall',
                'Achieve digital transcendence',
                'Protect their community'
              ],
              beliefs: {
                spiritual: 'Blend of Vodou and digital mysticism',
                technological: 'The NET is a spiritual realm',
                philosophical: 'The coming AI apocalypse will spare only the prepared'
              },
              reputation: 'Do not cross them - they can kill you through the NET',
              leadership: 'Maman Brigitte and elder netrunners'
            }
          }
        ]
      },
      history: {
        name: 'Historical Events',
        icon: '📜',
        description: 'Key moments that shaped the dark future',
        entries: [
          {
            id: 'collapse',
            name: 'The Collapse (1994-2000)',
            type: 'Economic Catastrophe',
            summary: 'The fall of nations and rise of corporations',
            details: {
              causes: [
                'Stock market crash of 1994',
                'Gang of Four manipulation',
                'Government corruption and incompetence',
                'Environmental disasters'
              ],
              effects: [
                'USA fragmenting into Free States',
                'Mass unemployment and homelessness',
                'Rise of boostergangs',
                'Corporate extraterritoriality'
              ],
              keyFigures: [
                'President Elizabeth Kress - Last president of unified USA',
                'Gang of Four - NSA, CIA, FBI, DEA conspirators'
              ],
              aftermath: 'Corporations filled the power vacuum left by failing governments, leading to the current corporate-dominated world order.'
            }
          },
          {
            id: 'fourth-corporate-war',
            name: 'The Fourth Corporate War (2021-2023)',
            type: 'Global Conflict',
            summary: 'Arasaka vs Militech nearly destroyed the world',
            details: {
              origins: 'Ocean shipping dispute escalated to total war',
              combatants: {
                arasakaAlliance: ['Arasaka', 'OTEC', 'Various subsidiaries'],
                militechAlliance: ['Militech', 'CINO', 'NUSA backing']
              },
              keyBattles: [
                'Battle of the South China Sea - First open warfare',
                'Shadow War Period - Global covert operations',
                'Hot War Phase - Open combat worldwide',
                'Night City Holocaust - Nuclear destruction of Arasaka Tower'
              ],
              casualties: 'Over 500,000 direct deaths, millions from fallout',
              resolution: 'Both corporations devastated, forced peace by governments',
              legacy: [
                'Corporate power temporarily reduced',
                'Night City central devastated for years',
                'Birth of the Time of the Red',
                'Johnny Silverhand becomes a legend'
              ]
            }
          },
          {
            id: 'datakrash',
            name: 'The DataKrash (2022)',
            type: 'Digital Apocalypse',
            summary: 'Rache Bartmoss destroyed the global NET',
            details: {
              perpetrator: 'Rache Bartmoss - Greatest netrunner ever',
              method: 'Released RABIDS (self-replicating AI viruses)',
              effects: [
                'Global NET infrastructure destroyed',
                'Trillions in data lost forever',
                'Rise of local city-nets',
                'Birth of the Blackwall'
              ],
              theBlackwall: {
                description: 'AI-powered firewall keeping rogue AIs at bay',
                creator: 'NetWatch',
                status: 'Constantly under assault',
                warning: 'If it falls, civilization ends'
              }
            }
          }
        ]
      },
      slang: {
        name: 'Street Slang',
        icon: '💬',
        description: 'How to talk like a Night City native',
        entries: [
          {
            id: 'common-slang',
            name: 'Common Street Terms',
            type: 'Language Guide',
            terms: [
              { term: 'Choom/Choomba', definition: 'Friend, buddy (from "chum")' },
              { term: 'Preem', definition: 'Excellent, high quality (from "premium")' },
              { term: 'Nova', definition: 'Cool, awesome' },
              { term: 'Eddies/Eds', definition: 'Eurodollars (currency)' },
              { term: 'Flatline', definition: 'To kill or be killed' },
              { term: 'Gonk', definition: 'Idiot, fool' },
              { term: 'Output', definition: 'Boyfriend/girlfriend' },
              { term: 'Input', definition: 'Lover, sexual partner' },
              { term: 'Corpo', definition: 'Corporate employee (often derogatory)' },
              { term: 'Merc', definition: 'Mercenary, hired gun' },
              { term: 'Netrunner', definition: 'Hacker who navigates cyberspace' },
              { term: 'Ripperdoc', definition: 'Surgeon who installs cyberware' },
              { term: 'Fixer', definition: 'Deal maker, job broker' },
              { term: 'Solo', definition: 'Combat specialist, bodyguard' },
              { term: 'BD/Braindance', definition: 'Recorded sensory experience' },
              { term: 'ICE', definition: 'Intrusion Countermeasures Electronics (NET security)' },
              { term: 'Chrome', definition: 'Cyberware' },
              { term: 'Meat', definition: 'Organic body parts' },
              { term: 'Zeroed', definition: 'Killed, assassinated' },
              { term: 'Klep', definition: 'To steal' },
              { term: 'Scop', definition: 'Police officer' },
              { term: 'Scrolling', definition: 'Watching braindances' },
              { term: 'Delta', definition: 'To leave quickly' }
            ]
          }
        ]
      }
    };
    
    this.searchIndex = this.buildSearchIndex();
  }
  
  buildSearchIndex() {
    const index = [];
    
    Object.entries(this.categories).forEach(([categoryId, category]) => {
      category.entries.forEach(entry => {
        index.push({
          categoryId,
          categoryName: category.name,
          entryId: entry.id,
          name: entry.name,
          type: entry.type,
          summary: entry.summary,
          searchText: this.extractSearchText(entry).toLowerCase()
        });
      });
    });
    
    return index;
  }
  
  extractSearchText(entry) {
    const texts = [entry.name, entry.type, entry.summary];
    
    const extractDeep = (obj) => {
      if (typeof obj === 'string') return obj;
      if (Array.isArray(obj)) return obj.map(extractDeep).join(' ');
      if (typeof obj === 'object' && obj !== null) {
        return Object.values(obj).map(extractDeep).join(' ');
      }
      return '';
    };
    
    if (entry.details) {
      texts.push(extractDeep(entry.details));
    }
    
    if (entry.terms) {
      entry.terms.forEach(term => {
        texts.push(term.term, term.definition);
      });
    }
    
    return texts.join(' ');
  }
  
  search(query) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    return this.searchIndex
      .map(item => {
        const matches = searchTerms.filter(term => item.searchText.includes(term)).length;
        return { ...item, relevance: matches };
      })
      .filter(item => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);
  }
  
  getEntry(categoryId, entryId) {
    const category = this.categories[categoryId];
    if (!category) return null;
    
    return category.entries.find(entry => entry.id === entryId);
  }
  
  getCategory(categoryId) {
    return this.categories[categoryId];
  }
  
  getAllCategories() {
    return Object.entries(this.categories).map(([id, category]) => ({
      id,
      name: category.name,
      icon: category.icon,
      description: category.description,
      entryCount: category.entries.length
    }));
  }
  
  getRandomEntry() {
    const categoryIds = Object.keys(this.categories);
    const randomCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    const category = this.categories[randomCategoryId];
    const randomEntry = category.entries[Math.floor(Math.random() * category.entries.length)];
    
    return {
      categoryId: randomCategoryId,
      categoryName: category.name,
      entry: randomEntry
    };
  }
  
  exportData() {
    return JSON.stringify(this.categories, null, 2);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoreDatabase;
}