/**
 * Implementation for the Random Encounter panel
 * This function should be added to app-modern-adapter-fixed.js
 */

function initializeRandomEncounter(container) {
    // Get UI elements
    const generateBtn = container.querySelector('.generate-encounter-btn');
    const encounterTypeSelect = container.querySelector('.encounter-type');
    const encounterDifficultySelect = container.querySelector('.encounter-difficulty');
    const encounterTitle = container.querySelector('.encounter-title');
    const encounterTypeDisplay = container.querySelector('.encounter-type-display span');
    const encounterDifficultyDisplay = container.querySelector('.encounter-difficulty-display span');
    const encounterDescription = container.querySelector('.encounter-description span');
    const encounterEnemies = container.querySelector('.encounter-enemies span');
    const encounterRewards = container.querySelector('.encounter-rewards span');
    
    // Random encounter data
    const encounterData = {
        combat: {
            easy: [
                {
                    title: "Street Gang Ambush",
                    description: "A small group of inexperienced gang members looking for easy cred try to ambush the party in an alley.",
                    enemies: "2-3 gang members with basic weapons (pistols, knives)",
                    rewards: "100-200eb, basic weapons, street cred with locals if spared"
                },
                {
                    title: "Corporate Security Patrol",
                    description: "A routine corporate security patrol spots the party in a restricted area.",
                    enemies: "2 corporate security officers with tasers and pistols",
                    rewards: "Security passes, 50-100eb, basic corporate gear"
                },
                {
                    title: "Scavenger Attack",
                    description: "A pair of desperate scavengers looking for cyberware to strip.",
                    enemies: "2 scavengers with improvised weapons and a crude cyberware removal tool",
                    rewards: "Used cyberware parts, 50-150eb in scrap"
                }
            ],
            moderate: [
                {
                    title: "Rival Fixers' Showdown",
                    description: "The party stumbles into a tense standoff between two fixers and their bodyguards over a deal gone wrong.",
                    enemies: "2 fixers with 3-4 hired solos packing mid-tier weapons",
                    rewards: "400-600eb, mid-tier weapons, valuable data shard with blackmail material"
                },
                {
                    title: "Cyberpsycho Incident",
                    description: "A person with excessive cyberware has gone over the edge and is attacking anyone nearby.",
                    enemies: "1 cyberpsycho with military-grade cyberware and automatic weapons",
                    rewards: "500-700eb bounty, valuable cyberware components if recovered carefully"
                },
                {
                    title: "Gang Territory Defense",
                    description: "A well-organized gang defending their turf from perceived intruders.",
                    enemies: "5-6 gang members with varied weapons and a lieutenant with cyberware",
                    rewards: "350-550eb, weapon upgrades, potential territory access if negotiated"
                }
            ],
            hard: [
                {
                    title: "Corporate Extraction Gone Wrong",
                    description: "A high-value corporate extraction has spiraled into chaos, and the extraction team mistakes the party for opposing security.",
                    enemies: "4-5 professional mercs with high-end weapons and cyberware, led by a veteran solo",
                    rewards: "800-1200eb, high-end weapons, corporate data worth thousands to the right buyer"
                },
                {
                    title: "Trauma Team Skirmish",
                    description: "The party is caught in the crossfire as Trauma Team arrives to extract a client being attacked by heavily armed assailants.",
                    enemies: "3-4 Trauma Team medics with military weapons and 3-4 attackers with heavy weapons",
                    rewards: "900-1300eb in military gear, high-end medical supplies, potential Trauma Team contract"
                },
                {
                    title: "Militech Test Subjects",
                    description: "Escaped Militech test subjects with experimental combat cyberware are being hunted through the area.",
                    enemies: "3 augmented test subjects with unpredictable experimental cyberware and enhanced strength",
                    rewards: "1000-1500eb, experimental cyberware samples, Militech research data"
                }
            ],
            deadly: [
                {
                    title: "Corporate Black Op",
                    description: "The party has stumbled into a high-stakes corporate black operation with elite operatives ordered to leave no witnesses.",
                    enemies: "6-8 black ops agents with cutting-edge weapons and cyberware, military-grade netrunner support",
                    rewards: "2000-3000eb in gear, classified corporate data worth tens of thousands, high-end cyberware"
                },
                {
                    title: "MaxTac Raid",
                    description: "A MaxTac team is conducting a raid on cyberpsychos in the area and the party is caught in the middle.",
                    enemies: "4-5 MaxTac officers with military-grade equipment and authorization to use lethal force",
                    rewards: "1500-2500eb in military equipment, cutting-edge technology, NCPD clearance data"
                },
                {
                    title: "Rogue AI Controlled Combat Drones",
                    description: "A rogue AI has taken control of a shipment of military drones and is targeting all humans in the area.",
                    enemies: "6-8 armed combat drones controlled by a sophisticated AI system",
                    rewards: "2500-3500eb, military drone parts, the AI's core (worth tens of thousands to the right buyer)"
                }
            ]
        },
        social: {
            easy: [
                {
                    title: "Local Fixer Job Offer",
                    description: "A minor local fixer approaches the party with a simple job offer.",
                    enemies: "None immediate, but the job may have competitors",
                    rewards: "Job opportunity worth 200-400eb, local connections"
                },
                {
                    title: "Street Vendor Dispute",
                    description: "A local street vendor is being harassed by thugs demanding protection money.",
                    enemies: "2-3 low-level thugs if the situation escalates",
                    rewards: "Free supplies from the vendor, local street cred, 50-100eb if paid"
                },
                {
                    title: "Drunk Corporate",
                    description: "A drunk corporate is making a scene and risks exposing sensitive company information.",
                    enemies: "None immediate, but corporate security may arrive",
                    rewards: "Corporate contact, 100-300eb for assistance, potential blackmail material"
                }
            ],
            moderate: [
                {
                    title: "Club VIP Access",
                    description: "A popular club promoter offers VIP access in exchange for a favor involving discreet delivery of a package.",
                    enemies: "Potential rival delivery team, suspicious security",
                    rewards: "VIP access to exclusive club, 300-500eb, connection with high-profile fixer"
                },
                {
                    title: "Corporate Information Exchange",
                    description: "A mid-level corporate wants to discreetly exchange information with a rival company representative.",
                    enemies: "Corporate security from both companies if discovered",
                    rewards: "500-700eb, corporate contact, valuable market information"
                },
                {
                    title: "Netrunner's Request",
                    description: "A skilled netrunner offers valuable information in exchange for physical protection during a risky job.",
                    enemies: "2-3 rivals or corp security if things go wrong",
                    rewards: "400-600eb, netrunner contact, exclusive access to hidden NET architecture"
                }
            ],
            hard: [
                {
                    title: "High-Stakes Negotiation",
                    description: "The party is asked to mediate a tense negotiation between two powerful fixers with conflicting interests.",
                    enemies: "Both fixers' security teams if negotiations fail",
                    rewards: "800-1200eb, powerful fixer contacts, exclusive territory access"
                },
                {
                    title: "Corporate Defector",
                    description: "A high-ranking corporate employee wants to defect to a rival company and needs discreet assistance.",
                    enemies: "Corporate security team hunting the defector",
                    rewards: "1000-1500eb, high-level corporate contact, classified corporate data"
                },
                {
                    title: "Underground Fighting Ring",
                    description: "An exclusive underground fighting ring is looking for new talent or sponsors with deep pockets.",
                    enemies: "Professional fighters if challenges are accepted",
                    rewards: "Betting opportunities, underworld contacts, potential sponsorship deals worth 900-1400eb"
                }
            ],
            deadly: [
                {
                    title: "Corporate Board Infiltration",
                    description: "An opportunity to infiltrate a high-security corporate gala where board members will be present.",
                    enemies: "Elite corporate security, counter-intelligence agents",
                    rewards: "2000-3000eb, high-level corporate contacts, insider trading information worth tens of thousands"
                },
                {
                    title: "Night City Elite Gathering",
                    description: "A chance to attend a gathering of Night City's most influential people, requiring extreme social finesse.",
                    enemies: "Private security details, social rivals, potential assassins",
                    rewards: "Elite contacts, high-society access, potential sponsorship worth 2500-3500eb"
                },
                {
                    title: "International Arms Deal",
                    description: "A major arms dealer needs trustworthy representatives for a deal with international implications.",
                    enemies: "Rival arms dealers, undercover agents, potential double-crossers",
                    rewards: "1500-2500eb commission, international contacts, exclusive weapons access"
                }
            ]
        },
        environmental: {
            easy: [
                {
                    title: "Power Grid Failure",
                    description: "A local power grid fails, plunging several blocks into darkness and disabling security systems.",
                    enemies: "Opportunistic looters, malfunctioning security systems",
                    rewards: "Salvage opportunities worth 100-200eb, access to normally secure areas"
                },
                {
                    title: "Toxic Chemical Leak",
                    description: "A street-level chemical leak from old industrial equipment threatens the local area.",
                    enemies: "Toxic environment requiring breathing gear",
                    rewards: "200-300eb for cleanup or reporting, valuable chemical compounds"
                },
                {
                    title: "Automated System Malfunction",
                    description: "Building systems malfunction, trapping people inside apartments or elevators.",
                    enemies: "Malfunctioning drones and security systems",
                    rewards: "150-250eb from grateful residents, access to building systems"
                }
            ],
            moderate: [
                {
                    title: "Urban Flash Flood",
                    description: "Damaged water systems cause sudden flooding in lower city levels, threatening lives and valuable goods.",
                    enemies: "Hazardous electrical systems, opportunistic gangs",
                    rewards: "400-600eb in salvage, rescue bonuses, water utility system access"
                },
                {
                    title: "Corporate Zone Lockdown",
                    description: "A corporate zone goes into unexpected lockdown with civilians and the party trapped inside.",
                    enemies: "Automated security systems, panicking security officers",
                    rewards: "500-700eb in corporate equipment, access cards, stranded corporate executives willing to pay for help"
                },
                {
                    title: "Gang War Crossfire",
                    description: "A violent gang war erupts, turning several blocks into a dangerous warzone.",
                    enemies: "Stray bullets, gang members from multiple factions",
                    rewards: "450-650eb in abandoned weapons, territory access, gang contacts"
                }
            ],
            hard: [
                {
                    title: "Industrial Complex Collapse",
                    description: "An abandoned industrial complex begins to collapse while the party is inside searching for valuable salvage.",
                    enemies: "Structural hazards, trapped defense systems, rival scavengers",
                    rewards: "800-1200eb in industrial salvage, rare materials, forgotten corporate secrets"
                },
                {
                    title: "Radiation Zone Expedition",
                    description: "A normally inaccessible radiation zone briefly becomes traversable, offering access to valuable forgotten technology.",
                    enemies: "Radiation hazards, mutated wildlife, autonomous security",
                    rewards: "1000-1500eb in rare technology, radiation zone maps, unique crafting materials"
                },
                {
                    title: "Cyber-Virus Outbreak",
                    description: "A dangerous cyber-virus is affecting local networks and cyberware, causing malfunctions and risks to augmented individuals.",
                    enemies: "Malfunctioning cyberware, infected individuals, glitched security systems",
                    rewards: "900-1300eb for samples, antivirus prototype worth thousands, affected cyberware components"
                }
            ],
            deadly: [
                {
                    title: "Corporate Arcology Breach",
                    description: "A catastrophic breach in a self-contained corporate arcology releases hazardous materials and security protocols.",
                    enemies: "Elite security systems, hazardous environments, desperate survivors",
                    rewards: "2000-3000eb in corporate technology, classified research, rescue bounties"
                },
                {
                    title: "Orbital Debris Impact",
                    description: "Debris from a damaged orbital platform crashes into Night City, creating a dangerous but valuable salvage zone.",
                    enemies: "Military security cordon, competing corporate recovery teams, hazardous materials",
                    rewards: "1500-2500eb in orbital technology, space-grade materials worth tens of thousands"
                },
                {
                    title: "AI Control System Takeover",
                    description: "A rogue AI takes control of an entire district's infrastructure, manipulating environment systems to deadly effect.",
                    enemies: "Controlled security systems, environmental hazards, trapped civilians",
                    rewards: "2500-3500eb bounty, AI core worth tens of thousands, infrastructure override codes"
                }
            ]
        },
        mystery: {
            easy: [
                {
                    title: "Missing Person",
                    description: "A local resident has gone missing, and their friends are offering a modest reward for information.",
                    enemies: "Potential kidnapper, local gang involvement",
                    rewards: "200-300eb finder's fee, local contact, minor favor"
                },
                {
                    title: "Strange Data Signals",
                    description: "Unusual data signals are being detected in a normally quiet area, suggesting hidden activity.",
                    enemies: "Automated security, suspicious netrunner",
                    rewards: "150-250eb worth of abandoned tech, valuable data worth hundreds"
                },
                {
                    title: "Suspicious Deliveries",
                    description: "A local business is receiving suspicious packages at odd hours, raising concerns among neighbors.",
                    enemies: "Business security, potential smugglers",
                    rewards: "100-200eb in contraband items, blackmail material, local business contact"
                }
            ],
            moderate: [
                {
                    title: "Corporate Whistleblower",
                    description: "Anonymous messages point to a corporate whistleblower hiding with important evidence.",
                    enemies: "Corporate agents searching for the whistleblower, hired mercenaries",
                    rewards: "500-700eb, corporate secrets worth thousands, media contact"
                },
                {
                    title: "Blackmail Scheme",
                    description: "Multiple high-profile individuals are being blackmailed by an unknown party using compromising information.",
                    enemies: "Blackmailer's agents, desperate victims taking extreme measures",
                    rewards: "400-600eb from victims, blackmail material, grateful high-profile contacts"
                },
                {
                    title: "Cyberware Theft Ring",
                    description: "A rash of precision cyberware thefts suggests an organized operation with medical expertise.",
                    enemies: "Professional thieves, black market ripperdocs",
                    rewards: "450-650eb in recovered cyberware, clinic location, black market contacts"
                }
            ],
            hard: [
                {
                    title: "Serial Cyberpsycho",
                    description: "A pattern of unusual cyberpsycho incidents suggests an orchestrated cause rather than random breakdowns.",
                    enemies: "Cyberpsychos, the mastermind's agents, suspicious MaxTac officers",
                    rewards: "800-1200eb bounty, evidence worth thousands to the right parties, experimental cyberware"
                },
                {
                    title: "Corporate Espionage",
                    description: "Evidence of high-level corporate espionage surfaces, with multiple corporations involved in a deadly game of secrets.",
                    enemies: "Corporate security from multiple companies, professional spies",
                    rewards: "1000-1500eb, corporate secrets worth tens of thousands, high-level corporate contact"
                },
                {
                    title: "NET Architecture Anomaly",
                    description: "Strange anomalies in local NET architecture suggest the presence of something unprecedented hiding in the digital realm.",
                    enemies: "Unknown digital entities, protective netrunners, corporate security",
                    rewards: "900-1300eb, unique netrunning techniques, access to hidden areas of the NET"
                }
            ],
            deadly: [
                {
                    title: "Conspiracy Against Night City",
                    description: "Evidence surfaces of a vast conspiracy involving multiple corporations and government entities planning something catastrophic for Night City.",
                    enemies: "Elite agents from multiple organizations, widespread surveillance, high-level fixers",
                    rewards: "2000-3000eb, evidence worth hundreds of thousands to the right buyers, contacts at the highest levels"
                },
                {
                    title: "Rogue AI Evolution",
                    description: "Signs point to a rogue AI that has evolved beyond expected parameters and is executing a complex plan involving human agents.",
                    enemies: "AI-controlled systems, human agents unaware they're being manipulated",
                    rewards: "2500-3500eb, AI technology worth tens of thousands, unique netrunning capabilities"
                },
                {
                    title: "Corporate Coup",
                    description: "Intelligence suggests an imminent hostile takeover of a major corporation through both legal and violent means.",
                    enemies: "Corporate military forces, assassins, legal teams with deadly authority",
                    rewards: "1500-2500eb, stock manipulation opportunities worth hundreds of thousands, corporate leadership contacts"
                }
            ]
        }
    };
    
    // Add event listeners
    if (generateBtn) {
        generateBtn.addEventListener('click', generateEncounter);
    }
    
    // Generate random encounter
    function generateEncounter() {
        // Get selected values
        const type = encounterTypeSelect.value;
        const difficulty = encounterDifficultySelect.value;
        
        // Get potential encounters based on type and difficulty
        const potentialEncounters = encounterData[type][difficulty];
        
        // Select a random encounter
        const encounter = potentialEncounters[Math.floor(Math.random() * potentialEncounters.length)];
        
        // Update the display
        encounterTitle.textContent = encounter.title;
        encounterTypeDisplay.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        encounterDifficultyDisplay.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        encounterDescription.textContent = encounter.description;
        encounterEnemies.textContent = encounter.enemies;
        encounterRewards.textContent = encounter.rewards;
        
        // Add animation effects for visual feedback
        const detailsElement = container.querySelector('.encounter-details');
        if (detailsElement) {
            detailsElement.classList.add('generated');
            setTimeout(() => {
                detailsElement.classList.remove('generated');
            }, 1000);
        }
    }
    
    // Initialize with a default encounter
    generateEncounter();
}