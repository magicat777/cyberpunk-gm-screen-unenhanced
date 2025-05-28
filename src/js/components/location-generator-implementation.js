/**
 * Implementation for the Location Generator panel
 * This function should be added to app-modern-adapter-fixed.js
 */

function initializeLocationGenerator(container) {
    // Get UI elements
    const generateBtn = container.querySelector('.generate-location-btn');
    const saveBtn = container.querySelector('.save-location-btn');
    const locationTypeSelect = container.querySelector('.location-type');
    const districtSelect = container.querySelector('.location-district');
    const includeNPCsCheckbox = container.querySelector('.include-npcs');
    const includeHooksCheckbox = container.querySelector('.include-hooks');
    const includeThreatsCheckbox = container.querySelector('.include-threats');
    const locationContainer = container.querySelector('.location-container');
    const tabButtons = container.querySelectorAll('.location-tab');
    const tabContents = container.querySelectorAll('.location-tab-content');
    const savedLocationsList = container.querySelector('.location-list');
    const districtMap = container.querySelector('.night-city-map');
    
    // Define data for location generation
    const locationNames = {
        bar: ['Chrome', 'Neon', 'Afterlife', 'Silver', 'Lizzie\'s', 'Riot', 'Totentanz', 'Decker\'s', 'Jig-Jig', 'Kabuki', 'Nova', 'Byte', 'Glitch'],
        shop: ['Tech', 'Junk', 'Parts', 'Gear', 'Ripper', 'Warez', 'Bits', 'Cyber', 'Street', 'Night', 'City', 'Market'],
        corp: ['Arasaka', 'Militech', 'Biotechnica', 'Petrochem', 'Kang Tao', 'Trauma Team', 'Zetatech', 'Orbital Air', 'West Wind', 'Kiroshi'],
        apartment: ['Heights', 'Tower', 'Complex', 'Block', 'Megabuilding', 'Flats', 'Suites', 'Residence', 'Den', 'Haven'],
        warehouse: ['Storage', 'Freight', 'Shipping', 'Cargo', 'Container', 'Harbor', 'Dock', 'Industrial', 'Supply', 'Depot'],
        gang: ['Maelstrom', 'Tyger Claws', 'Valentinos', 'Animals', 'Voodoo Boys', '6th Street', 'Scavengers', 'Moxes', 'Wraiths', 'Raffen Shiv'],
        restaurant: ['Noodle', 'Street Food', 'Burrito', 'All-Night', 'Syn-Steak', 'Diner', 'Sushi', 'Fast Fry', 'Grill', 'Chow'],
        clinic: ['Care', 'Med-Center', 'Trauma', 'Street Doc', 'Emergency', 'Surgery', 'Treatment', 'Pharmacy', 'Meds', 'Implants'],
        government: ['City Hall', 'NCPD', 'Bureau', 'Department', 'Agency', 'Office', 'Division', 'Authority', 'Municipal', 'Center'],
        tech: ['Workshop', 'Netrunner', 'Lab', 'Repair', 'Custom', 'Tech', 'Mod Shop', 'Engineer', 'Development', 'Systems']
    };
    
    const locationAdjectives = ['Neon', 'Chrome', 'Digital', 'Night', 'Cyber', 'Glitch', 'Static', 'Viral', 'Toxic', 'Electric', 
                              'Punk', 'Steel', 'Glass', 'Noir', 'Grim', 'Shady', 'Underground', 'Hidden', 'Exclusive', 'Famous'];
    
    const locationDescriptions = {
        bar: [
            'A smoky dive bar with neon signs and loud synthetic music pounding from speakers.',
            'An exclusive nightclub with private booths and high-end synthetic alcohol.',
            'A rooftop bar with a view of the Night City skyline, catering to corporate executives.',
            'A crowded underground club with a reputation for illicit braindances and black market deals.',
            'A trendy bar featuring live performances from up-and-coming rockerboys and chrome dancers.'
        ],
        shop: [
            'A cramped tech shop with parts and gadgets piled high on makeshift shelves.',
            'A sleek boutique displaying the latest fashion trends and designer clothing.',
            'A weapons dealer operating out of a reinforced storefront with various guns on display.',
            'A black market cybernetics shop hidden behind a legitimate business front.',
            'A crowded market stall selling scavenged tech parts and refurbished gear.'
        ],
        corp: [
            'A towering corporate headquarters with extensive security and restricted access.',
            'A research facility with unmarked vans coming and going at odd hours.',
            'A corporate-owned apartment complex housing employees and their families.',
            'A sleek office building with mirrored windows and armed security guards.',
            'A subsidiary office handling specialized operations for a larger corporation.'
        ],
        apartment: [
            'A run-down megabuilding with tiny apartments stacked like shipping containers.',
            'A mid-tier residential tower with basic amenities and questionable maintenance.',
            'A luxury apartment complex with private security and exclusive access.',
            'A retrofitted industrial space converted into communal living quarters.',
            'A secure compound housing corporate employees away from the general population.'
        ],
        warehouse: [
            'An abandoned warehouse repurposed by gangs or squatters.',
            'A corporate storage facility with automated security systems.',
            'A shipping depot with constant traffic of delivery vehicles.',
            'A black market exchange disguised as a legitimate storage business.',
            'A former factory now used for illegal activities or underground events.'
        ],
        gang: [
            'A heavily fortified gang hideout with lookouts and booby traps.',
            'A seemingly normal building marked with subtle gang signs and symbols.',
            'A combat zone block claimed by a specific gang, marked with graffiti and warnings.',
            'A chop shop operating as a front for gang activities and illegal tech.',
            'A converted nightclub serving as both a business and gang headquarters.'
        ],
        restaurant: [
            'A street food vendor with plastic chairs and incredible local cuisine.',
            'A 24/7 diner popular with night shift workers and insomniacs.',
            'A high-end restaurant catering exclusively to corporate clients.',
            'A food court featuring multiple synthetic and real food options.',
            'A hidden gem known only to locals serving authentic pre-war recipes.'
        ],
        clinic: [
            'A back-alley ripperdoc clinic with questionable hygiene but skilled hands.',
            'A corporate medical facility with cutting-edge technology and high prices.',
            'A community clinic providing basic care to locals with limited resources.',
            'A black market medical facility dealing in experimental or illegal procedures.',
            'A trauma center handling emergencies with quick, if impersonal, care.'
        ],
        government: [
            'A bureaucratic nightmare of an office processing permits and licenses.',
            'A heavily guarded NCPD precinct with holding cells and interrogation rooms.',
            'A municipal utility management center maintaining the city\'s crumbling infrastructure.',
            'A propaganda broadcasting center disguised as a public service building.',
            'A surveillance hub monitoring the city\'s camera and sensor network.'
        ],
        tech: [
            'A netrunner den filled with custom rigs and black market ICE breakers.',
            'A workshop specializing in custom weapon modifications and upgrades.',
            'A tech repair shop fixing everything from personal devices to combat drones.',
            'A research lab developing cutting-edge technology outside corporate oversight.',
            'A custom cybernetics studio known for unique and artistic implant designs.'
        ]
    };
    
    const districtInfo = {
        'city-center': {
            name: 'City Center',
            description: 'The corporate heart of Night City, dominated by massive skyscrapers and corporate headquarters. The streets are clean, security is tight, and everything costs a premium.',
            danger: 'medium',
            security: 'high',
            commonLocations: ['corp', 'restaurant', 'bar', 'government']
        },
        'watson': {
            name: 'Watson',
            description: 'A district in transition with both corporate development and gang activity. Home to the Arasaka Waterfront and Kabuki marketplace.',
            danger: 'medium',
            security: 'medium',
            commonLocations: ['shop', 'apartment', 'bar', 'gang']
        },
        'westbrook': {
            name: 'Westbrook',
            description: 'An affluent area containing the Japantown and Charter Hill neighborhoods. Known for high-end shopping, entertainment, and corporate residential zones.',
            danger: 'low',
            security: 'high',
            commonLocations: ['bar', 'restaurant', 'shop', 'apartment']
        },
        'heywood': {
            name: 'Heywood',
            description: 'A diverse district with areas ranging from corporate residential zones to gang territories. Home to the Valentinos gang.',
            danger: 'medium',
            security: 'medium',
            commonLocations: ['apartment', 'gang', 'restaurant', 'shop']
        },
        'pacifica': {
            name: 'Pacifica',
            description: 'An abandoned resort area now ruled by gangs, particularly the Voodoo Boys. Highly dangerous with minimal city services or security.',
            danger: 'extreme',
            security: 'minimal',
            commonLocations: ['gang', 'apartment', 'warehouse', 'tech']
        },
        'santo-domingo': {
            name: 'Santo Domingo',
            description: 'An industrial zone filled with factories, power plants, and worker housing. Strongly divided between corporate control and street influence.',
            danger: 'high',
            security: 'medium',
            commonLocations: ['warehouse', 'tech', 'apartment', 'corp']
        },
        'rancho-coronado': {
            name: 'Rancho Coronado',
            description: 'A suburban area with planned communities for corporate workers and middle management. More orderly than most of Night City.',
            danger: 'low',
            security: 'medium',
            commonLocations: ['apartment', 'shop', 'restaurant', 'clinic']
        },
        'north-oak': {
            name: 'North Oak',
            description: 'An exclusive district for the ultra-wealthy, featuring massive compounds and private security. Very difficult to access without proper credentials.',
            danger: 'low',
            security: 'extreme',
            commonLocations: ['corp', 'apartment', 'restaurant', 'clinic']
        },
        'badlands': {
            name: 'Badlands',
            description: 'The harsh desert surrounding Night City. Home to nomad groups, isolated settlements, and abandoned facilities.',
            danger: 'high',
            security: 'minimal',
            commonLocations: ['gang', 'warehouse', 'tech', 'clinic']
        }
    };
    
    const npcRoles = ['Fixer', 'Solo', 'Netrunner', 'Tech', 'Media', 'Exec', 'Nomad', 'Rockerboy', 'Cop', 'Ripper Doc', 'Bartender', 'Dealer', 'Gangster', 'Street Vendor', 'Hacker', 'Bodyguard', 'Mercenary', 'Scavenger', 'Joytoy', 'Doll'];
    
    const npcAdjectives = ['Suspicious', 'Friendly', 'Dangerous', 'Connected', 'Skilled', 'Desperate', 'Cunning', 'Eccentric', 'Mysterious', 'Paranoid', 'Ruthless', 'Ambitious', 'Loyal', 'Untrustworthy', 'Famous', 'Scarred', 'Chromed-up', 'Junkie', 'Wealthy', 'Spiritual'];
    
    const storyHooks = [
        'A mysterious data shard with encrypted coordinates.',
        'A bounty on a high-value target frequenting this location.',
        'Rumors of illegal braindance recordings being sold here.',
        'A missing person was last seen entering this building.',
        'A valuable prototype is supposedly hidden somewhere inside.',
        'A rival gang is planning to attack this location soon.',
        'Corporate agents are monitoring this place for unknown reasons.',
        'Someone here is selling black market military-grade cyberware.',
        'A famous fixer uses this spot to meet potential clients.',
        'This location sits on top of a forgotten underground access point.',
        'A netrunner recently discovered an exploitable vulnerability in the security system.',
        'A corrupt NCPD officer is running an extortion racket from here.',
        'The owner is in debt to the wrong people and looking for help.',
        'Someone witnessed a high-profile assassination from this location.',
        'This place is actually a front for a more secretive operation.'
    ];
    
    const threatTypes = [
        'Gang members looking for trouble',
        'Corporate security conducting a raid',
        'Cyberpsycho on a rampage nearby',
        'Rival business owners with armed guards',
        'Undercover NCPD sting operation',
        'Black market deal gone wrong',
        'Rogue AI controlling local systems',
        'Escaped lab experiment hiding inside',
        'Scavengers looking for fresh cyberware',
        'Netrunner deploying hostile programs',
        'Malfunctioning security robots',
        'Vengeful ex-employee with a grudge',
        'Data courier being chased by hitmen',
        'Street prophet with fanatical followers',
        'Trauma Team conducting a high-risk extraction'
    ];
    
    // Initialize saved locations array
    let savedLocations = loadSavedLocations();
    
    // Initialize active location data
    let activeLocation = null;
    
    // Add event listeners
    if (generateBtn) {
        generateBtn.addEventListener('click', generateLocation);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCurrentLocation);
    }
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                if (content.id === `${tab}-tab`) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
            
            // If switching to saved tab, refresh the saved locations list
            if (tab === 'saved') {
                displaySavedLocations();
            }
            
            // If switching to map tab, initialize the district map
            if (tab === 'map') {
                initializeDistrictMap();
            }
        });
    });
    
    // District map initialization
    function initializeDistrictMap() {
        const districts = container.querySelectorAll('.district');
        const districtLabels = container.querySelectorAll('.district-label');
        const districtName = container.querySelector('.district-name');
        const districtDescription = container.querySelector('.district-description');
        const districtDanger = container.querySelector('.district-danger-level');
        const districtLocations = container.querySelector('.district-common-locations');
        
        // Add click event to districts
        districts.forEach(district => {
            district.addEventListener('click', function() {
                const districtId = this.getAttribute('data-district');
                
                // Update active district
                districts.forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                
                // Display district info
                if (districtInfo[districtId]) {
                    const info = districtInfo[districtId];
                    
                    districtName.textContent = info.name;
                    districtDescription.innerHTML = `<p>${info.description}</p>`;
                    
                    // Display danger level
                    let dangerText = '';
                    let dangerClass = '';
                    
                    switch (info.danger) {
                        case 'low':
                            dangerText = 'Low Danger';
                            dangerClass = 'danger-low';
                            break;
                        case 'medium':
                            dangerText = 'Medium Danger';
                            dangerClass = 'danger-medium';
                            break;
                        case 'high':
                            dangerText = 'High Danger';
                            dangerClass = 'danger-high';
                            break;
                        case 'extreme':
                            dangerText = 'Extreme Danger';
                            dangerClass = 'danger-extreme';
                            break;
                    }
                    
                    districtDanger.innerHTML = `<p>Danger Level: <span class="danger-level ${dangerClass}">${dangerText}</span></p>`;
                    
                    // Display common locations
                    let locationsHtml = '<p>Common Location Types:</p><ul>';
                    info.commonLocations.forEach(locType => {
                        const typeNames = {
                            'bar': 'Bars & Clubs',
                            'shop': 'Shops & Markets',
                            'corp': 'Corporate Buildings',
                            'apartment': 'Residential Buildings',
                            'warehouse': 'Warehouses & Industrial',
                            'gang': 'Gang Territories',
                            'restaurant': 'Restaurants & Food',
                            'clinic': 'Medical Facilities',
                            'government': 'Government Buildings',
                            'tech': 'Tech & Workshops'
                        };
                        
                        locationsHtml += `<li>${typeNames[locType] || locType}</li>`;
                    });
                    locationsHtml += '</ul>';
                    
                    districtLocations.innerHTML = locationsHtml;
                }
            });
        });
        
        // Make the labels activate their districts when clicked
        districtLabels.forEach(label => {
            label.addEventListener('click', function() {
                const districtId = this.getAttribute('data-district');
                const district = container.querySelector(`.district[data-district="${districtId}"]`);
                if (district) {
                    district.dispatchEvent(new Event('click'));
                }
            });
        });
        
        // Select City Center by default
        const defaultDistrict = container.querySelector('.district[data-district="city-center"]');
        if (defaultDistrict) {
            defaultDistrict.dispatchEvent(new Event('click'));
        }
    }
    
    // Location generation function
    function generateLocation() {
        // Get selected options
        const locationType = locationTypeSelect.value;
        const district = districtSelect.value;
        const includeNPCs = includeNPCsCheckbox.checked;
        const includeHooks = includeHooksCheckbox.checked;
        const includeThreats = includeThreatsCheckbox.checked;
        
        // Determine actual location type (random or specific)
        let actualType = locationType;
        if (locationType === 'random') {
            const types = Object.keys(locationNames);
            actualType = types[Math.floor(Math.random() * types.length)];
        }
        
        // Determine actual district (random or specific)
        let actualDistrict = district;
        if (district === 'random') {
            const districts = Object.keys(districtInfo);
            actualDistrict = districts[Math.floor(Math.random() * districts.length)];
        }
        
        // Get district info
        const districtData = districtInfo[actualDistrict] || {
            name: 'Unknown District',
            danger: 'medium',
            security: 'medium',
            commonLocations: []
        };
        
        // Generate location name
        const namePool = locationNames[actualType] || locationNames.shop;
        const adjective = locationAdjectives[Math.floor(Math.random() * locationAdjectives.length)];
        const baseName = namePool[Math.floor(Math.random() * namePool.length)];
        
        // Some name formats (randomly chosen)
        const nameFormats = [
            `The ${adjective} ${baseName}`,
            `${adjective} ${baseName}`,
            `${baseName} ${actualType.charAt(0).toUpperCase() + actualType.slice(1)}`,
            `${baseName}'s`,
            `${adjective} ${baseName} ${actualType.charAt(0).toUpperCase() + actualType.slice(1)}`
        ];
        
        const locationName = nameFormats[Math.floor(Math.random() * nameFormats.length)];
        
        // Get location description
        const descriptions = locationDescriptions[actualType] || locationDescriptions.shop;
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        // Generate security level based on district
        let securityLevel;
        let securityClass;
        
        switch (districtData.security) {
            case 'minimal':
                securityLevel = 'Minimal Security';
                securityClass = 'security-low';
                break;
            case 'low':
                securityLevel = 'Low Security';
                securityClass = 'security-low';
                break;
            case 'medium':
                securityLevel = 'Medium Security';
                securityClass = 'security-medium';
                break;
            case 'high':
                securityLevel = 'High Security';
                securityClass = 'security-high';
                break;
            case 'extreme':
                securityLevel = 'Extreme Security';
                securityClass = 'security-extreme';
                break;
            default:
                securityLevel = 'Medium Security';
                securityClass = 'security-medium';
        }
        
        // Generate NPCs
        let npcsHtml = '';
        if (includeNPCs) {
            npcsHtml = `
                <div class="location-section">
                    <h4 class="section-title">Notable NPCs</h4>
                    <div class="npc-list">
            `;
            
            // Generate 1-3 NPCs
            const npcCount = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < npcCount; i++) {
                const role = npcRoles[Math.floor(Math.random() * npcRoles.length)];
                const adjective = npcAdjectives[Math.floor(Math.random() * npcAdjectives.length)];
                
                // Random name generation (simple version)
                const firstNames = ['Alex', 'Morgan', 'Casey', 'Jordan', 'Quinn', 'Remy', 'Taylor', 'Sam', 'Ash', 'Dakota', 'Jin', 'Kai', 'Nova', 'Zero', 'V', 'Jackie', 'River', 'Panam', 'Judy', 'Kerry'];
                const lastNames = ['Smith', 'Rodriguez', 'Chen', 'Kowalski', 'Fisher', 'Walker', 'Night', 'Kovac', 'Welles', 'Parker', 'Jones', 'Ward', 'Alvarez', 'Reed', 'Deckard', 'Grey', 'Price', 'Black', 'Wolf', 'Steel'];
                
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const name = `${firstName} ${lastName}`;
                
                npcsHtml += `
                    <div class="npc-item">
                        <div class="npc-name">${name}</div>
                        <div class="npc-role">${adjective} ${role}</div>
                    </div>
                `;
            }
            
            npcsHtml += `
                    </div>
                </div>
            `;
        }
        
        // Generate Story Hooks
        let hooksHtml = '';
        if (includeHooks) {
            hooksHtml = `
                <div class="location-section">
                    <h4 class="section-title">Potential Story Hooks</h4>
                    <div class="hook-list">
            `;
            
            // Generate 1-2 hooks
            const hookCount = Math.floor(Math.random() * 2) + 1;
            const usedHookIndices = [];
            
            for (let i = 0; i < hookCount; i++) {
                let hookIndex;
                do {
                    hookIndex = Math.floor(Math.random() * storyHooks.length);
                } while (usedHookIndices.includes(hookIndex));
                
                usedHookIndices.push(hookIndex);
                const hook = storyHooks[hookIndex];
                
                hooksHtml += `
                    <div class="hook-item">
                        <div class="hook-title">Potential Lead</div>
                        <div class="hook-description">${hook}</div>
                    </div>
                `;
            }
            
            hooksHtml += `
                    </div>
                </div>
            `;
        }
        
        // Generate Threats
        let threatsHtml = '';
        if (includeThreats) {
            threatsHtml = `
                <div class="location-section">
                    <h4 class="section-title">Potential Threats</h4>
                    <div class="threat-list">
            `;
            
            // Determine threat count based on district danger level
            let threatCount = 1;
            if (districtData.danger === 'high') threatCount = 2;
            if (districtData.danger === 'extreme') threatCount = 3;
            
            const usedThreatIndices = [];
            
            for (let i = 0; i < threatCount; i++) {
                let threatIndex;
                do {
                    threatIndex = Math.floor(Math.random() * threatTypes.length);
                } while (usedThreatIndices.includes(threatIndex));
                
                usedThreatIndices.push(threatIndex);
                const threat = threatTypes[threatIndex];
                
                threatsHtml += `
                    <div class="threat-item">
                        <div class="threat-name">Threat</div>
                        <div class="threat-description">${threat}</div>
                    </div>
                `;
            }
            
            threatsHtml += `
                    </div>
                </div>
            `;
        }
        
        // Create complete location HTML
        const locationHtml = `
            <div class="location-card">
                <div class="location-header">
                    <h3 class="location-title">${locationName}</h3>
                    <div class="location-badges">
                        <span class="location-type-badge">${actualType.charAt(0).toUpperCase() + actualType.slice(1)}</span>
                        <span class="location-district-badge">${districtData.name}</span>
                    </div>
                </div>
                
                <div class="location-description">
                    <p>${description}</p>
                    <span class="security-level ${securityClass}">${securityLevel}</span>
                </div>
                
                ${npcsHtml}
                ${hooksHtml}
                ${threatsHtml}
            </div>
        `;
        
        // Update the container with the new location
        locationContainer.innerHTML = locationHtml;
        
        // Store the active location data for saving
        activeLocation = {
            name: locationName,
            type: actualType,
            district: actualDistrict,
            description: description,
            security: securityLevel,
            html: locationHtml,
            timestamp: Date.now()
        };
    }
    
    // Save current location function
    function saveCurrentLocation() {
        if (!activeLocation) {
            alert('Generate a location first before saving.');
            return;
        }
        
        // Add ID to the location
        activeLocation.id = 'loc_' + Date.now();
        
        // Add to saved locations
        savedLocations.push(activeLocation);
        
        // Save to storage
        localStorage.setItem('cyberpunk-saved-locations', JSON.stringify(savedLocations));
        
        // Update saved locations list if visible
        if (container.querySelector('#saved-tab').style.display !== 'none') {
            displaySavedLocations();
        }
        
        // Notify user
        alert('Location saved successfully.');
    }
    
    // Load saved locations from storage
    function loadSavedLocations() {
        try {
            const saved = localStorage.getItem('cyberpunk-saved-locations');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error loading saved locations:', e);
            return [];
        }
    }
    
    // Display saved locations
    function displaySavedLocations() {
        if (!savedLocationsList) return;
        
        if (savedLocations.length === 0) {
            savedLocationsList.innerHTML = '<div class="empty-saves-message">No saved locations yet.</div>';
            return;
        }
        
        let locationsHtml = '';
        
        savedLocations.forEach(location => {
            const date = new Date(location.timestamp);
            const dateStr = date.toLocaleDateString();
            
            locationsHtml += `
                <div class="saved-location-item" data-id="${location.id}">
                    <div class="location-item-info">
                        <div class="location-item-name">${location.name}</div>
                        <div class="location-item-details">${location.type.charAt(0).toUpperCase() + location.type.slice(1)} in ${districtInfo[location.district]?.name || location.district} (Saved: ${dateStr})</div>
                    </div>
                    <div class="location-item-buttons">
                        <button class="location-load-btn" data-id="${location.id}">Load</button>
                        <button class="location-delete-btn" data-id="${location.id}">Delete</button>
                    </div>
                </div>
            `;
        });
        
        savedLocationsList.innerHTML = locationsHtml;
        
        // Add event listeners to buttons
        const loadButtons = savedLocationsList.querySelectorAll('.location-load-btn');
        const deleteButtons = savedLocationsList.querySelectorAll('.location-delete-btn');
        
        loadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                loadLocation(id);
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteLocation(id);
            });
        });
    }
    
    // Load saved location
    function loadLocation(id) {
        const location = savedLocations.find(loc => loc.id === id);
        if (!location) return;
        
        // Switch to generator tab
        const generatorTab = container.querySelector('.location-tab[data-tab="generator"]');
        if (generatorTab) {
            generatorTab.click();
        }
        
        // Display the saved location
        locationContainer.innerHTML = location.html;
        
        // Set as active location
        activeLocation = location;
    }
    
    // Delete saved location
    function deleteLocation(id) {
        if (!confirm('Are you sure you want to delete this saved location?')) return;
        
        // Filter out the location to delete
        savedLocations = savedLocations.filter(loc => loc.id !== id);
        
        // Save to storage
        localStorage.setItem('cyberpunk-saved-locations', JSON.stringify(savedLocations));
        
        // Update display
        displaySavedLocations();
    }
    
    // Initialize with default tab
    generateBtn?.click();
}