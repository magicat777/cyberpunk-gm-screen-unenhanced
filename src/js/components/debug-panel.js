// Debug script for Cyberpunk GM Screen panel issues
// Provides additional diagnostic capabilities and error reporting

(function() {
    // Wait for DOM to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDebugger);
    } else {
        initDebugger();
    }

    function initDebugger() {
        console.log('🔍 Initializing panel debugging...');
        
        // Wait a moment to ensure all scripts are loaded
        setTimeout(() => {
            // Wrap panel functions in error handling
            wrapPanelFunctions();
            
            console.log('✅ Panel debugging enabled');
        }, 1000);
    }
    
    // Wrap panel functions with error handling
    function wrapPanelFunctions() {
        const functionsToWrap = [
            'createCharacterPanel',
            'createNPCPanel', 
            'createLootPanel',
            'createMapPanel',
            'createLocationPanel',
            'createEncounterPanel'
        ];
        
        functionsToWrap.forEach(funcName => {
            if (typeof window[funcName] === 'function' && !window[funcName]._wrapped) {
                console.log(`Wrapping ${funcName} with error handling`);
                
                const originalFn = window[funcName];
                
                window[funcName] = function() {
                    try {
                        console.log(`Executing ${funcName}...`);
                        const result = originalFn.apply(this, arguments);
                        console.log(`${funcName} completed successfully`);
                        return result;
                    } catch (error) {
                        console.error(`Error in ${funcName}:`, error);
                        console.trace(`Stack trace for ${funcName}`);
                        
                        // Fallback to base createPanel if available
                        try {
                            if (typeof createPanel === 'function') {
                                const errorPanel = createPanel(`Error in ${funcName.replace('create', '').replace('Panel', '')}`);
                                const content = errorPanel.querySelector('.panel-content');
                                
                                if (content) {
                                    content.innerHTML = `
                                        <div style="color: #cc2222; margin-bottom: 10px">
                                            <strong>Error occurred:</strong>
                                        </div>
                                        <div style="font-family: monospace; margin-bottom: 10px">
                                            ${error.message}
                                        </div>
                                        <div style="margin-top: 20px">
                                            Check browser console for more details.
                                        </div>
                                    `;
                                }
                                
                                return errorPanel;
                            }
                        } catch (e) {
                            console.error('Error creating error panel:', e);
                        }
                        
                        return null;
                    }
                };
                
                window[funcName]._wrapped = true;
            }
        });
        
        console.log('Panel functions wrapped with error handling');
    }
})();