/**
 * Help & Tutorial System
 * Interactive walkthrough and help documentation for new users
 */

class HelpSystem {
  constructor() {
    this.currentTutorial = null;
    this.tutorialStep = 0;
    this.seenTutorials = this.loadSeenTutorials();
    
    // Tutorial definitions
    this.tutorials = {
      'first-time': {
        name: 'Getting Started',
        description: 'Learn the basics of the Cyberpunk GM Screen',
        steps: [
          {
            title: 'Welcome to Cyberpunk GM Screen!',
            content: 'This tool helps you manage your Cyberpunk RED sessions with style. Let\'s take a quick tour.',
            target: null,
            position: 'center'
          },
          {
            title: 'Creating Panels',
            content: 'Click the menu button (☰) to open the side tray and create panels for dice rolling, combat tracking, and more.',
            target: '.menu-toggle',
            position: 'right'
          },
          {
            title: 'Panel Templates',
            content: 'Use pre-configured templates for common GM scenarios. Click here to see available templates.',
            target: '.header-actions button',
            position: 'bottom'
          },
          {
            title: 'Moving Panels',
            content: 'Drag panels by their title bar to move them around. Resize by dragging the edges.',
            target: '.panel',
            position: 'top'
          },
          {
            title: 'Keyboard Shortcuts',
            content: 'Use keyboard shortcuts for quick access:\n• 1-9: Switch panels\n• Alt+Tab: Cycle panels\n• Esc: Minimize active panel',
            target: null,
            position: 'center'
          },
          {
            title: 'You\'re Ready!',
            content: 'That\'s the basics! Explore the different panels and features. Click the ? button anytime for help.',
            target: null,
            position: 'center'
          }
        ]
      },
      
      'panel-basics': {
        name: 'Panel System Basics',
        description: 'Learn how to use the panel system effectively',
        steps: [
          {
            title: 'Panel Controls',
            content: 'Each panel has controls in the title bar:\n• Drag to move\n• Click edges to resize\n• Use buttons to minimize/maximize/close',
            target: '.panel-header',
            position: 'bottom'
          },
          {
            title: 'Minimizing Panels',
            content: 'Minimized panels appear at the bottom of the screen. Click them to restore.',
            target: '.minimized-panel-bar',
            position: 'top'
          },
          {
            title: 'Tab Groups',
            content: 'Drag panels onto each other to create tabbed groups. Great for organizing related panels!',
            target: '.panel',
            position: 'right'
          },
          {
            title: 'Saving Layouts',
            content: 'Your panel layout saves automatically. You can also export/import layouts from the menu.',
            target: null,
            position: 'center'
          }
        ]
      },
      
      'dice-roller': {
        name: 'Dice Roller Guide',
        description: 'Master the enhanced dice roller',
        steps: [
          {
            title: 'Quick Rolls',
            content: 'Click the dice buttons for common rolls. D10! means exploding dice (reroll 10s).',
            target: '.dice-grid',
            position: 'bottom'
          },
          {
            title: 'Skill Checks',
            content: 'Enter your skill level, STAT value, and target difficulty. The roller calculates everything!',
            target: '.skill-inputs',
            position: 'top'
          },
          {
            title: 'Macros',
            content: 'Save frequently used rolls as macros for quick access.',
            target: '#create-macro',
            position: 'left'
          },
          {
            title: 'Roll History',
            content: 'All your rolls are saved here. Great for checking past results during disputes!',
            target: '.history-list',
            position: 'top'
          }
        ]
      },
      
      'combat-tracker': {
        name: 'Combat Tracker Guide',
        description: 'Run smooth combat encounters',
        steps: [
          {
            title: 'Adding Combatants',
            content: 'Enter character details and click Add. NPCs can be added directly from the NPC Generator!',
            target: '.add-combatant-form',
            position: 'bottom'
          },
          {
            title: 'Initiative Order',
            content: 'Click "Roll Initiative" on each character or "Roll All" to roll for everyone at once.',
            target: '#roll-all-initiative',
            position: 'left'
          },
          {
            title: 'Tracking Damage',
            content: 'Click the damage button to apply damage. Armor reduces damage automatically!',
            target: '.damage-btn',
            position: 'right'
          },
          {
            title: 'Combat Flow',
            content: 'Use "Next Turn" to advance through initiative order. The tracker handles round counting.',
            target: '#next-turn',
            position: 'bottom'
          }
        ]
      }
    };
    
    // Help topics
    this.helpTopics = {
      'keyboard-shortcuts': {
        title: 'Keyboard Shortcuts',
        content: `
          <div class="help-section">
            <h4>Panel Navigation</h4>
            <ul>
              <li><kbd>1-9</kbd> - Quick switch to numbered panels</li>
              <li><kbd>Alt + Tab</kbd> - Cycle through panels</li>
              <li><kbd>Esc</kbd> - Minimize active panel</li>
            </ul>
          </div>
          <div class="help-section">
            <h4>Panel Movement</h4>
            <ul>
              <li><kbd>Ctrl + ←↑→↓</kbd> - Move active panel</li>
              <li><kbd>Ctrl + Shift + ←↑→↓</kbd> - Move panel faster</li>
            </ul>
          </div>
        `
      },
      
      'tips-tricks': {
        title: 'Tips & Tricks',
        content: `
          <div class="help-section">
            <h4>Power User Tips</h4>
            <ul>
              <li>Double-click panel headers to maximize/restore</li>
              <li>Hold Shift while resizing to maintain aspect ratio</li>
              <li>Drag panels to screen edges for auto-positioning</li>
              <li>Use templates for quick session setup</li>
            </ul>
          </div>
          <div class="help-section">
            <h4>Performance Tips</h4>
            <ul>
              <li>Minimize unused panels to save resources</li>
              <li>Use Performance Mode for older devices</li>
              <li>Close panels you're not actively using</li>
            </ul>
          </div>
        `
      },
      
      'faq': {
        title: 'Frequently Asked Questions',
        content: `
          <div class="help-section">
            <h4>Q: How do I save my layout?</h4>
            <p>Layouts save automatically! You can also export them from the menu.</p>
          </div>
          <div class="help-section">
            <h4>Q: Can I use this offline?</h4>
            <p>Yes! Once loaded, everything works offline. Data saves locally.</p>
          </div>
          <div class="help-section">
            <h4>Q: How do I report bugs?</h4>
            <p>Report issues at: <a href="https://github.com/anthropics/claude-code/issues" target="_blank">GitHub Issues</a></p>
          </div>
          <div class="help-section">
            <h4>Q: Can I customize the themes?</h4>
            <p>Click the 🎨 button to cycle through available themes.</p>
          </div>
        `
      }
    };
  }
  
  /**
   * Show the help dialog
   */
  showHelp() {
    const dialog = document.createElement('div');
    dialog.className = 'help-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--bg-surface);
      border: 2px solid var(--primary);
      border-radius: 4px;
      padding: 0;
      z-index: 10005;
      width: 600px;
      max-width: 90vw;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
    `;
    
    dialog.innerHTML = `
      <div class="help-header" style="padding: 20px; border-bottom: 1px solid var(--border-color); 
                                      display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0; color: var(--primary); font-size: 20px; text-transform: uppercase;">
          Help & Tutorials
        </h2>
        <button onclick="this.closest('.help-dialog').remove()" 
                style="background: transparent; border: 1px solid var(--border-color); 
                       color: var(--text-secondary); width: 30px; height: 30px; 
                       cursor: pointer; font-size: 18px;">×</button>
      </div>
      
      <div class="help-content" style="display: flex; flex: 1; overflow: hidden;">
        <div class="help-sidebar" style="width: 200px; background: var(--bg-overlay); 
                                         padding: 20px; overflow-y: auto;">
          <h3 style="margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; 
                     color: var(--text-secondary);">Tutorials</h3>
          ${Object.entries(this.tutorials).map(([id, tutorial]) => `
            <button class="help-nav-item" onclick="window.helpSystem.startTutorial('${id}')"
                    style="display: block; width: 100%; text-align: left; padding: 10px;
                           background: transparent; border: none; color: var(--text-primary);
                           cursor: pointer; margin-bottom: 5px; font-size: 14px;
                           transition: all 0.2s;">
              ${tutorial.name}
              ${this.seenTutorials.includes(id) ? ' ✓' : ''}
            </button>
          `).join('')}
          
          <h3 style="margin: 20px 0 15px 0; font-size: 14px; text-transform: uppercase; 
                     color: var(--text-secondary);">Help Topics</h3>
          ${Object.entries(this.helpTopics).map(([id, topic]) => `
            <button class="help-nav-item" onclick="window.helpSystem.showTopic('${id}')"
                    style="display: block; width: 100%; text-align: left; padding: 10px;
                           background: transparent; border: none; color: var(--text-primary);
                           cursor: pointer; margin-bottom: 5px; font-size: 14px;
                           transition: all 0.2s;">
              ${topic.title}
            </button>
          `).join('')}
        </div>
        
        <div class="help-main" id="help-main-content" style="flex: 1; padding: 20px; overflow-y: auto;">
          <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
            <div style="font-size: 48px; margin-bottom: 20px;">🎮</div>
            <h3 style="margin: 0 0 10px 0; color: var(--primary);">Welcome to Help</h3>
            <p>Select a tutorial or help topic from the sidebar to get started.</p>
            <button onclick="window.helpSystem.startTutorial('first-time')"
                    style="margin-top: 20px; padding: 10px 20px; background: var(--primary);
                           border: none; color: var(--bg-primary); cursor: pointer;
                           font-weight: bold; text-transform: uppercase;">
              Start Quick Tour
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Add hover effects
    dialog.querySelectorAll('.help-nav-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.background = 'var(--bg-surface)';
        item.style.color = 'var(--primary)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = 'transparent';
        item.style.color = 'var(--text-primary)';
      });
    });
  }
  
  /**
   * Show a specific help topic
   */
  showTopic(topicId) {
    const topic = this.helpTopics[topicId];
    if (!topic) return;
    
    const mainContent = document.getElementById('help-main-content');
    if (!mainContent) {
      this.showHelp();
      setTimeout(() => this.showTopic(topicId), 100);
      return;
    }
    
    mainContent.innerHTML = `
      <h2 style="margin: 0 0 20px 0; color: var(--primary);">${topic.title}</h2>
      <div style="line-height: 1.6; color: var(--text-primary);">
        ${topic.content}
      </div>
    `;
    
    // Style the content
    mainContent.querySelectorAll('kbd').forEach(kbd => {
      kbd.style.cssText = `
        background: var(--bg-overlay);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: var(--font-mono);
        font-size: 12px;
      `;
    });
    
    mainContent.querySelectorAll('.help-section').forEach(section => {
      section.style.cssText = `
        margin-bottom: 20px;
        padding: 15px;
        background: var(--bg-overlay);
        border-left: 3px solid var(--primary);
      `;
    });
    
    mainContent.querySelectorAll('h4').forEach(h4 => {
      h4.style.cssText = `
        margin: 0 0 10px 0;
        color: var(--primary);
        font-size: 16px;
      `;
    });
    
    mainContent.querySelectorAll('ul').forEach(ul => {
      ul.style.cssText = `
        margin: 10px 0;
        padding-left: 20px;
      `;
    });
    
    mainContent.querySelectorAll('li').forEach(li => {
      li.style.cssText = `
        margin: 5px 0;
        color: var(--text-secondary);
      `;
    });
  }
  
  /**
   * Start an interactive tutorial
   */
  startTutorial(tutorialId) {
    const tutorial = this.tutorials[tutorialId];
    if (!tutorial) return;
    
    // Close help dialog if open
    document.querySelector('.help-dialog')?.remove();
    
    this.currentTutorial = tutorialId;
    this.tutorialStep = 0;
    
    // Show first step
    this.showTutorialStep();
  }
  
  /**
   * Show current tutorial step
   */
  showTutorialStep() {
    if (!this.currentTutorial) return;
    
    const tutorial = this.tutorials[this.currentTutorial];
    const step = tutorial.steps[this.tutorialStep];
    
    if (!step) {
      this.endTutorial();
      return;
    }
    
    // Remove any existing tutorial overlay
    document.querySelector('.tutorial-overlay')?.remove();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'tutorial-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10006;
      pointer-events: none;
    `;
    
    // Create spotlight if target exists
    if (step.target) {
      const target = document.querySelector(step.target);
      if (target) {
        const rect = target.getBoundingClientRect();
        const spotlight = document.createElement('div');
        spotlight.style.cssText = `
          position: absolute;
          top: ${rect.top - 10}px;
          left: ${rect.left - 10}px;
          width: ${rect.width + 20}px;
          height: ${rect.height + 20}px;
          border: 2px solid var(--primary);
          border-radius: 4px;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px var(--primary);
          pointer-events: none;
        `;
        overlay.appendChild(spotlight);
      }
    }
    
    // Create tutorial popup
    const popup = document.createElement('div');
    popup.className = 'tutorial-popup';
    popup.style.cssText = `
      position: fixed;
      background: var(--bg-surface);
      border: 2px solid var(--primary);
      border-radius: 4px;
      padding: 20px;
      max-width: 400px;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
      z-index: 10007;
      pointer-events: all;
    `;
    
    // Position popup
    this.positionTutorialPopup(popup, step);
    
    popup.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: var(--primary); font-size: 18px;">
        ${step.title}
      </h3>
      <p style="margin: 0 0 20px 0; color: var(--text-primary); line-height: 1.5;">
        ${step.content.replace(/\n/g, '<br>')}
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="color: var(--text-secondary); font-size: 12px;">
          Step ${this.tutorialStep + 1} of ${tutorial.steps.length}
        </span>
        <div style="display: flex; gap: 10px;">
          ${this.tutorialStep > 0 ? `
            <button onclick="window.helpSystem.previousTutorialStep()"
                    style="padding: 8px 16px; background: var(--bg-overlay);
                           border: 1px solid var(--border-color); color: var(--text-secondary);
                           cursor: pointer;">Previous</button>
          ` : ''}
          <button onclick="window.helpSystem.skipTutorial()"
                  style="padding: 8px 16px; background: var(--bg-overlay);
                         border: 1px solid var(--danger); color: var(--danger);
                         cursor: pointer;">Skip</button>
          <button onclick="window.helpSystem.nextTutorialStep()"
                  style="padding: 8px 16px; background: var(--primary);
                         border: none; color: var(--bg-primary); cursor: pointer;
                         font-weight: bold;">
            ${this.tutorialStep < tutorial.steps.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }
  
  /**
   * Position tutorial popup based on target and preferences
   */
  positionTutorialPopup(popup, step) {
    const padding = 20;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (step.position === 'center' || !step.target) {
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      return;
    }
    
    const target = document.querySelector(step.target);
    if (!target) {
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      return;
    }
    
    const targetRect = target.getBoundingClientRect();
    const positions = {
      top: {
        top: targetRect.top - padding,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translate(-50%, -100%)'
      },
      bottom: {
        top: targetRect.bottom + padding,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translate(-50%, 0)'
      },
      left: {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.left - padding,
        transform: 'translate(-100%, -50%)'
      },
      right: {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + padding,
        transform: 'translate(0, -50%)'
      }
    };
    
    const pos = positions[step.position] || positions.bottom;
    popup.style.top = pos.top + 'px';
    popup.style.left = pos.left + 'px';
    popup.style.transform = pos.transform;
  }
  
  /**
   * Navigate tutorial steps
   */
  nextTutorialStep() {
    this.tutorialStep++;
    this.showTutorialStep();
  }
  
  previousTutorialStep() {
    this.tutorialStep--;
    this.showTutorialStep();
  }
  
  skipTutorial() {
    this.endTutorial();
  }
  
  endTutorial() {
    document.querySelector('.tutorial-overlay')?.remove();
    
    if (this.currentTutorial && !this.seenTutorials.includes(this.currentTutorial)) {
      this.seenTutorials.push(this.currentTutorial);
      this.saveSeenTutorials();
    }
    
    this.currentTutorial = null;
    this.tutorialStep = 0;
    
    // Show completion message
    PanelUtils.showNotification('Tutorial completed!', 'success');
  }
  
  /**
   * Check if should show first-time tutorial
   */
  checkFirstTime() {
    if (!localStorage.getItem('cyberpunk-has-visited')) {
      localStorage.setItem('cyberpunk-has-visited', 'true');
      setTimeout(() => {
        if (confirm('Welcome! Would you like a quick tour of the Cyberpunk GM Screen?')) {
          this.startTutorial('first-time');
        }
      }, 1000);
    }
  }
  
  /**
   * Load/save seen tutorials
   */
  loadSeenTutorials() {
    try {
      const saved = localStorage.getItem('cyberpunk-seen-tutorials');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }
  
  saveSeenTutorials() {
    try {
      localStorage.setItem('cyberpunk-seen-tutorials', JSON.stringify(this.seenTutorials));
    } catch (e) {
      console.error('Failed to save tutorial progress:', e);
    }
  }
}

// Initialize and export
window.helpSystem = new HelpSystem();

// Add help button styles
if (!document.querySelector('#help-system-styles')) {
  const style = document.createElement('style');
  style.id = 'help-system-styles';
  style.textContent = `
    .help-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: var(--bg-surface);
      border: 2px solid var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 24px;
      color: var(--primary);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s;
      z-index: 9999;
    }
    
    .help-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0,255,255,0.3);
    }
    
    @media (max-width: 768px) {
      .help-button {
        bottom: 80px;
      }
    }
  `;
  document.head.appendChild(style);
}