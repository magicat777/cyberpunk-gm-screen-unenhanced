/**
 * Cyberpunk GM Screen - Accessibility Enhancements
 * Improves accessibility for interactive elements like dropdowns, focus management, etc.
 */

/**
 * Initialize accessible dropdowns
 * Makes dropdowns work with keyboard navigation, click events, and screen readers
 */
function initAccessibleDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropbtn');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (!button || !content) return;
        
        // Add ARIA attributes
        button.setAttribute('aria-haspopup', 'true');
        button.setAttribute('aria-expanded', 'false');
        content.id = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
        button.setAttribute('aria-controls', content.id);
        
        // Handle click events
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown .dropbtn[aria-expanded="true"]').forEach(btn => {
                if (btn !== button) {
                    btn.setAttribute('aria-expanded', 'false');
                    btn.parentElement.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            button.setAttribute('aria-expanded', !isExpanded);
            dropdown.classList.toggle('active', !isExpanded);
        });
        
        // Handle keyboard navigation
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                button.setAttribute('aria-expanded', 'true');
                dropdown.classList.add('active');
                
                // Focus the first item in the dropdown
                const firstItem = content.querySelector('a');
                if (firstItem) {
                    setTimeout(() => {
                        firstItem.focus();
                    }, 10);
                }
            }
        });
        
        // Add keyboard navigation within dropdown menu
        const links = content.querySelectorAll('a');
        
        links.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        if (index < links.length - 1) {
                            links[index + 1].focus();
                        }
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        if (index > 0) {
                            links[index - 1].focus();
                        } else {
                            button.focus();
                            button.setAttribute('aria-expanded', 'false');
                            dropdown.classList.remove('active');
                        }
                        break;
                    case 'Escape':
                        e.preventDefault();
                        button.focus();
                        button.setAttribute('aria-expanded', 'false');
                        dropdown.classList.remove('active');
                        break;
                    case 'Tab':
                        if (index === links.length - 1 && !e.shiftKey) {
                            button.setAttribute('aria-expanded', 'false');
                            dropdown.classList.remove('active');
                        }
                        break;
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                button.setAttribute('aria-expanded', 'false');
                dropdown.classList.remove('active');
            }
        });
    });
}

/**
 * Add a skip-to-content link for keyboard users
 */
function addSkipToContentLink() {
    const skipLink = document.createElement('a');
    skipLink.setAttribute('href', '#main-content');
    skipLink.setAttribute('class', 'skip-link');
    skipLink.textContent = 'Skip to content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to the main content area
    const mainContent = document.querySelector('.panel-content') || document.querySelector('main') || document.body;
    mainContent.id = 'main-content';
    mainContent.setAttribute('tabindex', '-1');
}

/**
 * Enhance panel accessibility
 * Adds proper ARIA roles and keyboard handling
 */
function enhancePanelAccessibility() {
    const panels = document.querySelectorAll('.panel');
    
    panels.forEach(panel => {
        // Set appropriate ARIA roles if not already set
        if (!panel.hasAttribute('role')) {
            panel.setAttribute('role', 'region');
            
            const header = panel.querySelector('.panel-header');
            if (header && !header.hasAttribute('role')) {
                header.setAttribute('role', 'heading');
                header.setAttribute('aria-level', '2');
            }
            
            const title = header?.querySelector('div:first-child') || header?.querySelector('h2');
            if (title) {
                const titleId = `panel-title-${Math.random().toString(36).substr(2, 9)}`;
                title.id = titleId;
                panel.setAttribute('aria-labelledby', titleId);
            }
        }
        
        // Add keyboard control for resize handle
        const resizeHandle = panel.querySelector('.resize-handle');
        if (resizeHandle) {
            if (!resizeHandle.hasAttribute('tabindex')) {
                resizeHandle.setAttribute('tabindex', '0');
                resizeHandle.setAttribute('role', 'button');
                resizeHandle.setAttribute('aria-label', 'Resize panel');
            }
            
            // Add keyboard event handlers for resize
            resizeHandle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Visual indication that resize mode is active
                    resizeHandle.classList.add('active');
                    panel.classList.add('panel-resizing');
                    
                    // Handle keyboard resize
                    const handleKeyboardResize = (resizeEvent) => {
                        const step = resizeEvent.shiftKey ? 50 : 10;
                        
                        switch (resizeEvent.key) {
                            case 'ArrowRight':
                                panel.style.width = `${parseInt(panel.style.width || panel.offsetWidth) + step}px`;
                                resizeEvent.preventDefault();
                                break;
                            case 'ArrowDown':
                                panel.style.height = `${parseInt(panel.style.height || panel.offsetHeight) + step}px`;
                                resizeEvent.preventDefault();
                                break;
                            case 'ArrowLeft':
                                panel.style.width = `${Math.max(200, parseInt(panel.style.width || panel.offsetWidth) - step)}px`;
                                resizeEvent.preventDefault();
                                break;
                            case 'ArrowUp':
                                panel.style.height = `${Math.max(100, parseInt(panel.style.height || panel.offsetHeight) - step)}px`;
                                resizeEvent.preventDefault();
                                break;
                            case 'Escape':
                            case 'Enter':
                            case ' ':
                                document.removeEventListener('keydown', handleKeyboardResize);
                                resizeHandle.classList.remove('active');
                                panel.classList.remove('panel-resizing');
                                resizeEvent.preventDefault();
                                break;
                        }
                    };
                    
                    document.addEventListener('keydown', handleKeyboardResize);
                    
                    // End resize mode when focus is lost
                    resizeHandle.addEventListener('blur', () => {
                        document.removeEventListener('keydown', handleKeyboardResize);
                        resizeHandle.classList.remove('active');
                        panel.classList.remove('panel-resizing');
                    }, { once: true });
                }
            });
        }
    });
}

/**
 * Initialize all accessibility enhancements
 */
function initAccessibility() {
    // Add skip to content link
    addSkipToContentLink();
    
    // Initialize accessible dropdowns
    initAccessibleDropdowns();
    
    // Enhance panel accessibility
    enhancePanelAccessibility();
    
    // Re-run panel accessibility whenever new panels are added
    // Use a mutation observer to watch for added panels
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        (node.classList.contains('panel') || node.querySelector('.panel'))) {
                        enhancePanelAccessibility();
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAccessibility);

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAccessibility,
        initAccessibleDropdowns,
        enhancePanelAccessibility
    };
}