// Table Save functionality for Cyberpunk GM Screen
// This script adds the ability to save generated content from random tables

(function() {
    // Wait for DOM to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTableSave);
    } else {
        // DOM already loaded, apply immediately
        initTableSave();
    }

    function initTableSave() {
        console.log('🎲 Initializing table save functionality...');
        
        // Wait to ensure all page scripts have loaded
        setTimeout(() => {
            enhanceRandomTablePanels();
            console.log('✅ Table save functionality initialized');
        }, 1000);
    }
    
    // Enhance random table panels with save functionality
    function enhanceRandomTablePanels() {
        // Enhanced panel creation functions to watch for
        const panelTypes = [
            { id: 'add-npc', type: 'NPC Generator', resultId: 'npc-result', generatorId: 'generate-npc' },
            { id: 'add-loot', type: 'Loot Generator', resultId: 'loot-result', generatorId: 'generate-loot' },
            { id: 'add-location', type: 'Location Generator', resultId: 'location-result', generatorId: 'generate-location-details' },
            { id: 'add-encounter', type: 'Random Encounter', resultId: 'encounter-result', generatorId: 'generate-encounter' },
            { id: 'add-critical', type: 'Critical Injuries', resultId: 'critical-result', generatorId: 'roll-critical' },
            { id: 'add-netrunning', type: 'Netrunning', resultId: 'architecture-result', generatorId: 'generate-architecture' }
        ];
        
        // Add panel creation observers
        addPanelCreationObservers(panelTypes);
        
        // Add event listeners to existing panels
        setTimeout(enhanceExistingPanels, 1500);
    }
    
    // Observe DOM for panel creation
    function addPanelCreationObservers(panelTypes) {
        // Create MutationObserver to watch for new panels
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.classList.contains('panel')) {
                            const headerText = node.querySelector('.panel-header div')?.textContent;
                            
                            // Check if this is a random table panel we want to enhance
                            const panelType = panelTypes.find(type => type.type === headerText);
                            if (panelType) {
                                enhanceTablePanel(node, panelType);
                            }
                        }
                    });
                }
            });
        });
        
        // Start observing the document body for added panels
        observer.observe(document.body, { childList: true });
        console.log('Panel creation observer added');
    }
    
    // Enhance existing panels that may already be on the page
    function enhanceExistingPanels() {
        const panels = document.querySelectorAll('.panel');
        
        panels.forEach(panel => {
            const headerText = panel.querySelector('.panel-header div')?.textContent;
            
            if (headerText === 'NPC Generator') {
                enhanceTablePanel(panel, { 
                    type: 'NPC Generator', 
                    resultId: 'npc-result', 
                    generatorId: 'generate-npc' 
                });
            } else if (headerText === 'Loot Generator') {
                enhanceTablePanel(panel, { 
                    type: 'Loot Generator', 
                    resultId: 'loot-result', 
                    generatorId: 'generate-loot' 
                });
            } else if (headerText === 'Location Generator') {
                enhanceTablePanel(panel, { 
                    type: 'Location Generator', 
                    resultId: 'location-result', 
                    generatorId: 'generate-location-details' 
                });
            } else if (headerText === 'Random Encounter') {
                enhanceTablePanel(panel, { 
                    type: 'Random Encounter', 
                    resultId: 'encounter-result', 
                    generatorId: 'generate-encounter' 
                });
            } else if (headerText === 'Critical Injuries') {
                enhanceTablePanel(panel, { 
                    type: 'Critical Injuries', 
                    resultId: 'critical-result', 
                    generatorId: 'roll-critical' 
                });
            } else if (headerText === 'Netrunning') {
                enhanceTablePanel(panel, { 
                    type: 'Netrunning', 
                    resultId: 'architecture-result', 
                    generatorId: 'generate-architecture' 
                });
            }
        });
    }
    
    // Add save buttons and functionality to a table panel
    function enhanceTablePanel(panel, panelType) {
        try {
            console.log(`Enhancing ${panelType.type} panel with save functionality`);
            
            // Find the result container and generator button
            const resultDiv = panel.querySelector(`#${panelType.resultId}`);
            const genButton = panel.querySelector(`#${panelType.generatorId}`);
            
            if (!resultDiv || !genButton) {
                console.error(`Could not find required elements in ${panelType.type} panel`);
                return;
            }
            
            // Create save button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '10px';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.alignItems = 'center';
            
            // Create history buttons
            const historyContainer = document.createElement('div');
            historyContainer.className = 'history-controls';
            
            // Create Previous button
            const prevButton = document.createElement('button');
            prevButton.textContent = '◀';
            prevButton.title = 'Previous result';
            prevButton.style.marginRight = '5px';
            
            // Create Next button
            const nextButton = document.createElement('button');
            nextButton.textContent = '▶';
            nextButton.title = 'Next result';
            nextButton.style.marginRight = '10px';
            
            // Add history indicator
            const historyIndicator = document.createElement('span');
            historyIndicator.className = 'history-indicator';
            historyIndicator.textContent = '0/0';
            historyIndicator.style.fontSize = '12px';
            historyIndicator.style.marginRight = '10px';
            
            // History state
            const historyState = {
                results: [],
                currentIndex: -1,
                maxSize: 20 // Maximum number of results to store
            };
            
            // Previous button click handler
            prevButton.addEventListener('click', function() {
                if (historyState.currentIndex > 0) {
                    historyState.currentIndex--;
                    resultDiv.innerHTML = historyState.results[historyState.currentIndex];
                    updateHistoryIndicator();
                }
            });
            
            // Next button click handler
            nextButton.addEventListener('click', function() {
                if (historyState.currentIndex < historyState.results.length - 1) {
                    historyState.currentIndex++;
                    resultDiv.innerHTML = historyState.results[historyState.currentIndex];
                    updateHistoryIndicator();
                }
            });
            
            // Update history indicator
            function updateHistoryIndicator() {
                if (historyState.results.length > 0) {
                    historyIndicator.textContent = `${historyState.currentIndex + 1}/${historyState.results.length}`;
                } else {
                    historyIndicator.textContent = '0/0';
                }
            }
            
            // Create save button
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save to File';
            saveButton.addEventListener('click', function() {
                if (resultDiv.innerHTML.trim() === 'Click to generate a location' || 
                    resultDiv.innerHTML.trim() === 'Click to generate an NPC' ||
                    resultDiv.innerHTML.trim() === 'Click to generate loot' ||
                    resultDiv.innerHTML.trim() === 'Click to generate an encounter' ||
                    resultDiv.innerHTML.trim() === 'Roll to generate a critical injury' ||
                    resultDiv.innerHTML.trim() === 'Click to generate a NET architecture') {
                    alert('Generate something first!');
                    return;
                }
                
                saveToFile(resultDiv.innerHTML, panelType.type);
            });
            
            // Create save to collection button
            const saveToCollectionButton = document.createElement('button');
            saveToCollectionButton.textContent = 'Add to Collection';
            saveToCollectionButton.style.marginLeft = '10px';
            saveToCollectionButton.addEventListener('click', function() {
                if (resultDiv.innerHTML.trim() === 'Click to generate a location' || 
                    resultDiv.innerHTML.trim() === 'Click to generate an NPC' ||
                    resultDiv.innerHTML.trim() === 'Click to generate loot' ||
                    resultDiv.innerHTML.trim() === 'Click to generate an encounter' ||
                    resultDiv.innerHTML.trim() === 'Roll to generate a critical injury' ||
                    resultDiv.innerHTML.trim() === 'Click to generate a NET architecture') {
                    alert('Generate something first!');
                    return;
                }
                
                addToCollection(resultDiv.innerHTML, panelType.type);
            });
            
            // Add buttons to containers
            historyContainer.appendChild(prevButton);
            historyContainer.appendChild(nextButton);
            historyContainer.appendChild(historyIndicator);
            
            buttonContainer.appendChild(historyContainer);
            
            const saveButtonsContainer = document.createElement('div');
            saveButtonsContainer.appendChild(saveButton);
            saveButtonsContainer.appendChild(saveToCollectionButton);
            buttonContainer.appendChild(saveButtonsContainer);
            
            // Add container after result div
            resultDiv.parentNode.insertBefore(buttonContainer, resultDiv.nextSibling);
            
            // Intercept the generate button click to capture results
            const originalClickHandler = genButton.onclick;
            genButton.onclick = null;
            
            genButton.addEventListener('click', function(e) {
                // Let the original handler run first
                if (typeof originalClickHandler === 'function') {
                    originalClickHandler.call(this, e);
                }
                
                // After a short delay to let the result populate
                setTimeout(() => {
                    // Add to history
                    if (resultDiv.innerHTML.trim() !== 'Click to generate a location' && 
                        resultDiv.innerHTML.trim() !== 'Click to generate an NPC' &&
                        resultDiv.innerHTML.trim() !== 'Click to generate loot' &&
                        resultDiv.innerHTML.trim() !== 'Click to generate an encounter' &&
                        resultDiv.innerHTML.trim() !== 'Roll to generate a critical injury' &&
                        resultDiv.innerHTML.trim() !== 'Click to generate a NET architecture') {
                        
                        // Add to history
                        historyState.results.push(resultDiv.innerHTML);
                        if (historyState.results.length > historyState.maxSize) {
                            historyState.results.shift(); // Remove oldest result if we exceed max size
                        }
                        historyState.currentIndex = historyState.results.length - 1;
                        updateHistoryIndicator();
                    }
                }, 100);
            });
            
            // Add result type to div for later reference
            resultDiv.dataset.resultType = panelType.type;
            
            console.log(`Enhanced ${panelType.type} panel successfully`);
        } catch (error) {
            console.error(`Error enhancing ${panelType.type} panel:`, error);
        }
    }
    
    // Save result to a file
    function saveToFile(content, type) {
        try {
            // Convert HTML content to a more readable format
            let textContent = content;
            
            // If it's HTML, do some basic conversion
            if (content.includes('<')) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                
                // Convert p tags to newlines
                const pTags = tempDiv.querySelectorAll('p');
                pTags.forEach(p => {
                    p.innerHTML = p.innerHTML + '\n';
                });
                
                // Convert li tags to bullet points
                const liTags = tempDiv.querySelectorAll('li');
                liTags.forEach(li => {
                    li.innerHTML = '• ' + li.innerHTML + '\n';
                });
                
                // Get text content
                textContent = tempDiv.textContent || tempDiv.innerText || '';
            }
            
            // Generate filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
            const filename = `${type.toLowerCase().replace(/\s+/g, '-')}_${timestamp}.txt`;
            
            // Create blob and download link
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.style.display = 'none';
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            setTimeout(() => {
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log(`Saved ${type} to file: ${filename}`);
        } catch (error) {
            console.error('Error saving to file:', error);
            alert(`Error saving to file: ${error.message}`);
        }
    }
    
    // Add the generated content to a collection in local storage
    function addToCollection(content, type) {
        try {
            // Get current collection from localStorage
            let collections = {};
            try {
                const storedCollections = localStorage.getItem('cyberpunkCollections');
                if (storedCollections) {
                    collections = JSON.parse(storedCollections);
                }
            } catch (e) {
                console.error('Error loading collections:', e);
            }
            
            // Create collection for this type if it doesn't exist
            if (!collections[type]) {
                collections[type] = [];
            }
            
            // Format content
            let formattedContent = content;
            
            // If it's HTML, extract key data as text
            if (content.includes('<')) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                
                // For NPCs, extract name and type
                if (type === 'NPC Generator') {
                    const nameMatch = content.match(/<strong>([^<]+)<\/strong>/);
                    const name = nameMatch ? nameMatch[1] : 'Unknown NPC';
                    formattedContent = { name, html: content, date: new Date().toISOString() };
                } 
                // For other generators, use a generic approach
                else {
                    // Extract first header or paragraph as title
                    const firstElement = tempDiv.querySelector('strong, p');
                    const title = firstElement ? (firstElement.textContent || 'Unknown') : 'Unknown';
                    formattedContent = { title, html: content, date: new Date().toISOString() };
                }
            }
            
            // Add to collection (at the beginning to show newest first)
            collections[type].unshift(formattedContent);
            
            // Limit collection size
            const MAX_ITEMS = 50;
            if (collections[type].length > MAX_ITEMS) {
                collections[type] = collections[type].slice(0, MAX_ITEMS);
            }
            
            // Save back to localStorage
            localStorage.setItem('cyberpunkCollections', JSON.stringify(collections));
            
            // Show confirmation to user
            alert(`Added to ${type} collection!`);
            
            // If the collection panel doesn't exist, create it
            if (!document.querySelector('.panel-header div[data-panel-type="Collections"]')) {
                createCollectionsPanel();
            }
        } catch (error) {
            console.error('Error adding to collection:', error);
            alert(`Error adding to collection: ${error.message}`);
        }
    }
    
    // Create a panel to display all collections
    function createCollectionsPanel() {
        try {
            // Create panel
            const panel = typeof createPanel === 'function' 
                ? createPanel('Collections') 
                : document.createElement('div');
            
            if (!panel) return;
            
            // Mark the panel type
            const headerDiv = panel.querySelector('.panel-header div');
            if (headerDiv) {
                headerDiv.dataset.panelType = 'Collections';
            }
            
            // Set styles
            if (panel.style) {
                panel.style.width = '450px';
                panel.style.height = '500px';
            }
            
            const content = panel.querySelector('.panel-content');
            if (!content) return;
            
            // Load collections
            let collections = {};
            try {
                const storedCollections = localStorage.getItem('cyberpunkCollections');
                if (storedCollections) {
                    collections = JSON.parse(storedCollections);
                }
            } catch (e) {
                console.error('Error loading collections:', e);
            }
            
            // Create UI for collections
            let html = `
                <div class="collections-container">
                    <div class="collections-tabs">
            `;
            
            // Create tabs for each collection type
            const collectionTypes = Object.keys(collections);
            
            if (collectionTypes.length === 0) {
                content.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p>No collections yet!</p>
                        <p>Use "Add to Collection" on generators to save items here.</p>
                    </div>
                `;
                return;
            }
            
            collectionTypes.forEach((type, index) => {
                html += `<button class="collection-tab ${index === 0 ? 'active' : ''}" data-type="${type}">${type}</button>`;
            });
            
            html += `</div><div class="collection-content">`;
            
            // Create content for the first collection type
            const firstType = collectionTypes[0];
            if (firstType && collections[firstType]) {
                html += createCollectionContent(collections[firstType], firstType);
            }
            
            html += `</div></div>`;
            
            // Set the HTML
            content.innerHTML = html;
            
            // Add CSS
            const style = document.createElement('style');
            style.textContent = `
                .collections-container { display: flex; flex-direction: column; height: 100%; }
                .collections-tabs { display: flex; overflow-x: auto; border-bottom: 1px solid #00ccff; }
                .collection-tab { background: transparent; color: #00ccff; border: none; padding: 8px 12px; cursor: pointer; }
                .collection-tab.active { background: #1e3a5a; border-bottom: 2px solid #00ccff; }
                .collection-content { flex: 1; overflow-y: auto; padding: 10px 0; }
                .collection-item { margin-bottom: 10px; border: 1px solid #254b75; padding: 10px; cursor: pointer; }
                .collection-item-title { font-weight: bold; margin-bottom: 5px; }
                .collection-item-date { font-size: 0.8em; color: #aaa; margin-bottom: 5px; }
                .collection-item.expanded .collection-item-content { display: block; }
                .collection-item-content { display: none; margin-top: 10px; padding-top: 10px; border-top: 1px dotted #254b75; }
                .collection-controls { display: flex; justify-content: space-between; margin-top: 10px; }
            `;
            
            content.appendChild(style);
            
            // Add event listeners
            const tabs = content.querySelectorAll('.collection-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update content
                    const type = this.getAttribute('data-type');
                    const contentElement = content.querySelector('.collection-content');
                    if (contentElement && collections[type]) {
                        contentElement.innerHTML = createCollectionContent(collections[type], type);
                        
                        // Add event listeners to new items
                        addCollectionItemListeners(contentElement, collections, type);
                    }
                });
            });
            
            // Add event listeners to the first tab's items
            const contentElement = content.querySelector('.collection-content');
            if (contentElement && collections[firstType]) {
                addCollectionItemListeners(contentElement, collections, firstType);
            }
            
            console.log('Collections panel created');
        } catch (error) {
            console.error('Error creating collections panel:', error);
        }
    }
    
    // Create HTML for a collection's content
    function createCollectionContent(collection, type) {
        let html = '';
        
        if (!collection || collection.length === 0) {
            html = `<div style="text-align: center; padding: 20px;">No items in ${type} collection.</div>`;
        } else {
            collection.forEach((item, index) => {
                // For NPC Generator
                if (type === 'NPC Generator' && item.name) {
                    html += `
                        <div class="collection-item" data-index="${index}">
                            <div class="collection-item-title">${item.name}</div>
                            <div class="collection-item-date">${formatDate(item.date)}</div>
                            <div class="collection-item-content">${item.html}</div>
                            <div class="collection-controls">
                                <button class="collection-delete" data-index="${index}">Delete</button>
                                <button class="collection-export" data-index="${index}">Export</button>
                            </div>
                        </div>
                    `;
                } 
                // For other generators
                else if (item.title) {
                    html += `
                        <div class="collection-item" data-index="${index}">
                            <div class="collection-item-title">${item.title}</div>
                            <div class="collection-item-date">${formatDate(item.date)}</div>
                            <div class="collection-item-content">${item.html}</div>
                            <div class="collection-controls">
                                <button class="collection-delete" data-index="${index}">Delete</button>
                                <button class="collection-export" data-index="${index}">Export</button>
                            </div>
                        </div>
                    `;
                }
                // Fallback for older saved items
                else {
                    html += `
                        <div class="collection-item" data-index="${index}">
                            <div class="collection-item-title">Item ${index + 1}</div>
                            <div class="collection-item-date">Unknown date</div>
                            <div class="collection-item-content">${item}</div>
                            <div class="collection-controls">
                                <button class="collection-delete" data-index="${index}">Delete</button>
                                <button class="collection-export" data-index="${index}">Export</button>
                            </div>
                        </div>
                    `;
                }
            });
        }
        
        return html;
    }
    
    // Add event listeners to collection items
    function addCollectionItemListeners(contentElement, collections, type) {
        // Toggle expand/collapse
        const items = contentElement.querySelectorAll('.collection-item');
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                // Don't toggle if clicking on buttons
                if (e.target.tagName === 'BUTTON') return;
                
                this.classList.toggle('expanded');
            });
        });
        
        // Delete buttons
        const deleteButtons = contentElement.querySelectorAll('.collection-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                
                if (confirm('Are you sure you want to delete this item?')) {
                    // Remove item from collection
                    collections[type].splice(index, 1);
                    
                    // Save updated collections
                    localStorage.setItem('cyberpunkCollections', JSON.stringify(collections));
                    
                    // Update UI
                    const item = this.closest('.collection-item');
                    if (item) item.remove();
                    
                    // If no items left, update the content
                    if (collections[type].length === 0) {
                        contentElement.innerHTML = `<div style="text-align: center; padding: 20px;">No items in ${type} collection.</div>`;
                    }
                }
            });
        });
        
        // Export buttons
        const exportButtons = contentElement.querySelectorAll('.collection-export');
        exportButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                
                if (collections[type] && collections[type][index]) {
                    const item = collections[type][index];
                    const content = item.html || item;
                    saveToFile(content, type);
                }
            });
        });
    }
    
    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return 'Unknown date';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        } catch (e) {
            return dateString;
        }
    }
    
    // Add top menu item to access collections
    function addCollectionsMenuItem() {
        const addPanelMenu = document.querySelector('.dropdown-content');
        if (!addPanelMenu) return;
        
        // Check if we already have a collections menu item
        if (addPanelMenu.querySelector('#add-collections')) return;
        
        // Find the Characters section
        const characterSection = Array.from(addPanelMenu.children).find(
            el => el.className === 'menu-category' && el.textContent === 'Characters'
        );
        
        if (characterSection) {
            // Create a menu item for collections
            const collectionsItem = document.createElement('a');
            collectionsItem.href = '#';
            collectionsItem.id = 'add-collections';
            collectionsItem.textContent = 'Collections';
            
            // Add after the character section
            const nextSection = characterSection.nextElementSibling;
            addPanelMenu.insertBefore(collectionsItem, nextSection);
            
            // Add click handler
            collectionsItem.addEventListener('click', function(e) {
                e.preventDefault();
                createCollectionsPanel();
            });
            
            console.log('Collections menu item added');
        }
    }
    
    // Call this after a short delay to ensure the menu has loaded
    setTimeout(addCollectionsMenuItem, 2000);
})();