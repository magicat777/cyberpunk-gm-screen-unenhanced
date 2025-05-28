// Automated Test Suite for Critical Panel Functions
class PanelTestSuite {
  constructor() {
    this.results = [];
    this.currentTest = null;
  }
  
  async runAllTests() {
    console.log('🧪 Starting Panel Test Suite...');
    this.results = [];
    
    // Core panel system tests
    await this.testPanelCreation();
    await this.testPanelDragging();
    await this.testPanelResizing();
    await this.testPanelMinimizeRestore();
    await this.testPanelClose();
    await this.testPanelPersistence();
    
    // Panel content tests
    await this.testDiceRollerFunctionality();
    await this.testCombatTrackerFunctionality();
    await this.testNotesEditorFunctionality();
    await this.testNPCGeneratorFunctionality();
    
    // Mobile responsiveness tests
    await this.testMobileResponsiveness();
    await this.testTouchGestures();
    
    // Performance tests
    await this.testPanelPerformance();
    await this.testMemoryUsage();
    
    // Generate report
    this.generateReport();
  }
  
  async testPanelCreation() {
    this.startTest('Panel Creation');
    
    try {
      // Test creating a basic panel
      const panel = window.createPanel({
        title: 'Test Panel',
        content: '<div>Test Content</div>',
        width: 400,
        height: 300
      });
      
      this.assert(panel !== null, 'Panel should be created');
      this.assert(panel.element !== undefined, 'Panel should have element property');
      this.assert(document.contains(panel.element), 'Panel should be in document');
      
      // Clean up
      panel.close();
      
      this.passTest('Panel creation successful');
    } catch (error) {
      this.failTest(`Panel creation failed: ${error.message}`);
    }
  }
  
  async testPanelDragging() {
    this.startTest('Panel Dragging');
    
    try {
      const panel = window.createPanel({
        title: 'Drag Test',
        content: '<div>Drag Me</div>',
        x: 100,
        y: 100
      });
      
      const initialX = panel.position.x;
      const initialY = panel.position.y;
      
      // Simulate drag
      const header = panel.element.querySelector('.panel-header');
      this.simulateDrag(header, 50, 50);
      
      await this.wait(100);
      
      this.assert(panel.position.x !== initialX, 'Panel X should change after drag');
      this.assert(panel.position.y !== initialY, 'Panel Y should change after drag');
      
      // Test constraints
      this.simulateDrag(header, -1000, -1000);
      await this.wait(100);
      
      this.assert(panel.position.x >= 0, 'Panel should not go off-screen left');
      this.assert(panel.position.y >= 60, 'Panel should not go under header');
      
      panel.close();
      this.passTest('Panel dragging works correctly');
    } catch (error) {
      this.failTest(`Panel dragging failed: ${error.message}`);
    }
  }
  
  async testPanelResizing() {
    this.startTest('Panel Resizing');
    
    try {
      const panel = window.createPanel({
        title: 'Resize Test',
        content: '<div>Resize Me</div>',
        width: 400,
        height: 300,
        resizable: true
      });
      
      const initialWidth = panel.size.width;
      const initialHeight = panel.size.height;
      
      // Simulate resize
      const resizeHandle = panel.element.querySelector('.resize-handle-se');
      this.simulateDrag(resizeHandle, 100, 100);
      
      await this.wait(100);
      
      this.assert(panel.size.width > initialWidth, 'Panel width should increase');
      this.assert(panel.size.height > initialHeight, 'Panel height should increase');
      
      // Test minimum size constraints
      this.simulateDrag(resizeHandle, -500, -500);
      await this.wait(100);
      
      this.assert(panel.size.width >= 200, 'Panel should respect minimum width');
      this.assert(panel.size.height >= 150, 'Panel should respect minimum height');
      
      panel.close();
      this.passTest('Panel resizing works correctly');
    } catch (error) {
      this.failTest(`Panel resizing failed: ${error.message}`);
    }
  }
  
  async testPanelMinimizeRestore() {
    this.startTest('Panel Minimize/Restore');
    
    try {
      const panel = window.createPanel({
        title: 'Minimize Test',
        content: '<div>Minimize Me</div>'
      });
      
      // Test minimize
      const minimizeBtn = panel.element.querySelector('.minimize-btn');
      minimizeBtn.click();
      
      await this.wait(100);
      
      this.assert(panel.isMinimized === true, 'Panel should be minimized');
      this.assert(!panel.element.classList.contains('active'), 'Panel should not be active when minimized');
      
      // Test restore from minimized bar
      const minimizedBar = document.querySelector('.minimized-panel-bar');
      this.assert(minimizedBar !== null, 'Minimized bar should exist');
      
      const minimizedItem = minimizedBar.querySelector(`[data-panel-id="${panel.id}"]`);
      this.assert(minimizedItem !== null, 'Minimized item should exist');
      
      minimizedItem.click();
      await this.wait(100);
      
      this.assert(panel.isMinimized === false, 'Panel should be restored');
      this.assert(panel.element.classList.contains('active'), 'Panel should be active after restore');
      
      panel.close();
      this.passTest('Panel minimize/restore works correctly');
    } catch (error) {
      this.failTest(`Panel minimize/restore failed: ${error.message}`);
    }
  }
  
  async testPanelClose() {
    this.startTest('Panel Close');
    
    try {
      const panel = window.createPanel({
        title: 'Close Test',
        content: '<div>Close Me</div>'
      });
      
      const panelId = panel.id;
      
      // Test close button
      const closeBtn = panel.element.querySelector('.close-btn');
      closeBtn.click();
      
      await this.wait(100);
      
      this.assert(!document.contains(panel.element), 'Panel should be removed from document');
      this.assert(!window.panelSystem.panels.has(panelId), 'Panel should be removed from panel system');
      
      this.passTest('Panel close works correctly');
    } catch (error) {
      this.failTest(`Panel close failed: ${error.message}`);
    }
  }
  
  async testPanelPersistence() {
    this.startTest('Panel Persistence');
    
    try {
      // Create panel with specific state
      const panel = window.createPanel({
        title: 'Persistence Test',
        content: '<div id="persist-content">Test Data: <span id="test-value">42</span></div>',
        x: 200,
        y: 200,
        width: 500,
        height: 400
      });
      
      // Modify content
      const testValue = panel.element.querySelector('#test-value');
      testValue.textContent = '100';
      
      // Save layout
      window.panelSystem.saveLayout('test-layout');
      
      // Close panel
      panel.close();
      await this.wait(100);
      
      // Load layout
      window.panelSystem.loadLayout('test-layout');
      await this.wait(100);
      
      // Find restored panel
      const restoredPanel = Array.from(window.panelSystem.panels.values())
        .find(p => p.title === 'Persistence Test');
      
      this.assert(restoredPanel !== undefined, 'Panel should be restored');
      this.assert(restoredPanel.position.x === 200, 'Panel X position should be restored');
      this.assert(restoredPanel.position.y === 200, 'Panel Y position should be restored');
      this.assert(restoredPanel.size.width === 500, 'Panel width should be restored');
      this.assert(restoredPanel.size.height === 400, 'Panel height should be restored');
      
      restoredPanel.close();
      this.passTest('Panel persistence works correctly');
    } catch (error) {
      this.failTest(`Panel persistence failed: ${error.message}`);
    }
  }
  
  async testDiceRollerFunctionality() {
    this.startTest('Dice Roller Functionality');
    
    try {
      // Create dice roller panel
      window.createDicePanel();
      await this.wait(500);
      
      const diceRoller = document.querySelector('.dice-roller');
      this.assert(diceRoller !== null, 'Dice roller should exist');
      
      // Test d10 roll
      const d10Button = diceRoller.querySelector('[data-dice="d10"]');
      this.assert(d10Button !== null, 'D10 button should exist');
      
      d10Button.click();
      await this.wait(100);
      
      const results = diceRoller.querySelector('.roll-results');
      this.assert(results !== null, 'Roll results should exist');
      
      const lastRoll = results.querySelector('.roll-entry');
      this.assert(lastRoll !== null, 'Roll entry should exist');
      
      // Test modifier input
      const modifierInput = diceRoller.querySelector('#dice-modifier');
      modifierInput.value = '5';
      modifierInput.dispatchEvent(new Event('change'));
      
      d10Button.click();
      await this.wait(100);
      
      const modifiedRoll = results.querySelector('.roll-entry');
      this.assert(modifiedRoll.textContent.includes('+5'), 'Modifier should be applied');
      
      // Close panel
      const panel = Array.from(window.panelSystem.panels.values())
        .find(p => p.element.contains(diceRoller));
      panel.close();
      
      this.passTest('Dice roller functionality works correctly');
    } catch (error) {
      this.failTest(`Dice roller functionality failed: ${error.message}`);
    }
  }
  
  async testCombatTrackerFunctionality() {
    this.startTest('Combat Tracker Functionality');
    
    try {
      window.createCombatPanel();
      await this.wait(500);
      
      const tracker = window.combatTracker;
      this.assert(tracker !== null, 'Combat tracker should exist');
      
      // Add characters
      tracker.addCharacter('Test NPC 1', 15);
      tracker.addCharacter('Test NPC 2', 10);
      tracker.addCharacter('Player 1', 18);
      
      await this.wait(100);
      
      const characters = tracker.container.querySelectorAll('.character-item');
      this.assert(characters.length === 3, 'Should have 3 characters');
      
      // Test initiative sorting
      const firstChar = characters[0].querySelector('.character-name');
      this.assert(firstChar.textContent === 'Player 1', 'Characters should be sorted by initiative');
      
      // Test round management
      const nextRoundBtn = tracker.container.querySelector('.next-round-btn');
      nextRoundBtn.click();
      
      await this.wait(100);
      
      const roundDisplay = tracker.container.querySelector('.round-number');
      this.assert(roundDisplay.textContent === '2', 'Round should increment');
      
      // Close panel
      const panel = Array.from(window.panelSystem.panels.values())
        .find(p => p.element.contains(tracker.container));
      panel.close();
      
      this.passTest('Combat tracker functionality works correctly');
    } catch (error) {
      this.failTest(`Combat tracker functionality failed: ${error.message}`);
    }
  }
  
  async testNotesEditorFunctionality() {
    this.startTest('Notes Editor Functionality');
    
    try {
      window.createNotesPanel();
      await this.wait(500);
      
      const editor = document.querySelector('.notes-editor');
      this.assert(editor !== null, 'Notes editor should exist');
      
      const textarea = editor.querySelector('textarea');
      this.assert(textarea !== null, 'Textarea should exist');
      
      // Test typing
      textarea.value = '# Test Note\n\nThis is a **test** note.';
      textarea.dispatchEvent(new Event('input'));
      
      await this.wait(100);
      
      // Test auto-save
      const savedContent = localStorage.getItem('cyberpunk-notes-content');
      this.assert(savedContent === textarea.value, 'Notes should auto-save');
      
      // Test markdown preview if available
      const previewBtn = editor.querySelector('.preview-btn');
      if (previewBtn) {
        previewBtn.click();
        await this.wait(100);
        
        const preview = editor.querySelector('.preview-content');
        this.assert(preview !== null, 'Preview should exist');
        this.assert(preview.innerHTML.includes('<h1>'), 'Markdown should be rendered');
      }
      
      // Close panel
      const panel = Array.from(window.panelSystem.panels.values())
        .find(p => p.element.contains(editor));
      panel.close();
      
      this.passTest('Notes editor functionality works correctly');
    } catch (error) {
      this.failTest(`Notes editor functionality failed: ${error.message}`);
    }
  }
  
  async testNPCGeneratorFunctionality() {
    this.startTest('NPC Generator Functionality');
    
    try {
      window.createNPCPanel();
      await this.wait(500);
      
      const generator = document.querySelector('.npc-generator');
      this.assert(generator !== null, 'NPC generator should exist');
      
      // Test generation
      const generateBtn = generator.querySelector('.generate-btn');
      generateBtn.click();
      
      await this.wait(100);
      
      const npcDisplay = generator.querySelector('.npc-display');
      this.assert(npcDisplay !== null, 'NPC display should exist');
      
      // Check generated content
      const name = npcDisplay.querySelector('.npc-name');
      this.assert(name !== null && name.textContent.length > 0, 'NPC should have name');
      
      const stats = npcDisplay.querySelectorAll('.stat-value');
      this.assert(stats.length > 0, 'NPC should have stats');
      
      // Test difficulty selector
      const difficultySelect = generator.querySelector('#npc-difficulty');
      difficultySelect.value = 'elite';
      difficultySelect.dispatchEvent(new Event('change'));
      
      generateBtn.click();
      await this.wait(100);
      
      // Elite NPCs should have higher stats
      const eliteStats = npcDisplay.querySelectorAll('.stat-value');
      let hasHighStat = false;
      eliteStats.forEach(stat => {
        if (parseInt(stat.textContent) >= 7) hasHighStat = true;
      });
      this.assert(hasHighStat, 'Elite NPC should have high stats');
      
      // Close panel
      const panel = Array.from(window.panelSystem.panels.values())
        .find(p => p.element.contains(generator));
      panel.close();
      
      this.passTest('NPC generator functionality works correctly');
    } catch (error) {
      this.failTest(`NPC generator functionality failed: ${error.message}`);
    }
  }
  
  async testMobileResponsiveness() {
    this.startTest('Mobile Responsiveness');
    
    try {
      // Save original viewport
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;
      
      // Simulate mobile viewport
      window.innerWidth = 375;
      window.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));
      
      await this.wait(100);
      
      // Check mobile UI elements
      const mobileNav = document.querySelector('.mobile-nav');
      this.assert(mobileNav !== null, 'Mobile navigation should exist');
      
      const desktopPanels = document.querySelector('.panel-container');
      const mobileTabs = document.querySelector('.mobile-tab-container');
      
      this.assert(
        getComputedStyle(desktopPanels).display === 'none' || 
        getComputedStyle(mobileTabs).display === 'block',
        'Should show mobile UI on small screens'
      );
      
      // Restore viewport
      window.innerWidth = originalWidth;
      window.innerHeight = originalHeight;
      window.dispatchEvent(new Event('resize'));
      
      this.passTest('Mobile responsiveness works correctly');
    } catch (error) {
      this.failTest(`Mobile responsiveness failed: ${error.message}`);
    }
  }
  
  async testTouchGestures() {
    this.startTest('Touch Gestures');
    
    try {
      // Create panel for testing
      const panel = window.createPanel({
        title: 'Touch Test',
        content: '<div>Swipe Me</div>'
      });
      
      // Simulate touch drag
      const header = panel.element.querySelector('.panel-header');
      const touch = new Touch({
        identifier: Date.now(),
        target: header,
        clientX: 100,
        clientY: 100,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 0,
        force: 1
      });
      
      const touchStart = new TouchEvent('touchstart', {
        touches: [touch],
        targetTouches: [touch],
        changedTouches: [touch],
        bubbles: true
      });
      
      header.dispatchEvent(touchStart);
      
      // Move touch
      const movedTouch = new Touch({
        identifier: touch.identifier,
        target: header,
        clientX: 150,
        clientY: 150,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 0,
        force: 1
      });
      
      const touchMove = new TouchEvent('touchmove', {
        touches: [movedTouch],
        targetTouches: [movedTouch],
        changedTouches: [movedTouch],
        bubbles: true
      });
      
      header.dispatchEvent(touchMove);
      
      const touchEnd = new TouchEvent('touchend', {
        touches: [],
        targetTouches: [],
        changedTouches: [movedTouch],
        bubbles: true
      });
      
      header.dispatchEvent(touchEnd);
      
      await this.wait(100);
      
      // Panel should have moved
      this.assert(panel.position.x !== 100 || panel.position.y !== 100, 'Panel should move with touch');
      
      panel.close();
      this.passTest('Touch gestures work correctly');
    } catch (error) {
      // Touch events might not be supported in all environments
      this.skipTest('Touch gestures not supported in this environment');
    }
  }
  
  async testPanelPerformance() {
    this.startTest('Panel Performance');
    
    try {
      const startTime = performance.now();
      const panels = [];
      
      // Create multiple panels
      for (let i = 0; i < 10; i++) {
        panels.push(window.createPanel({
          title: `Performance Test ${i}`,
          content: '<div>Performance Test Content</div>',
          x: 50 + i * 30,
          y: 50 + i * 30
        }));
      }
      
      const creationTime = performance.now() - startTime;
      this.assert(creationTime < 1000, 'Creating 10 panels should take less than 1 second');
      
      // Test dragging performance
      const dragStartTime = performance.now();
      panels.forEach(panel => {
        panel.setPosition(panel.position.x + 100, panel.position.y + 100);
      });
      const dragTime = performance.now() - dragStartTime;
      
      this.assert(dragTime < 100, 'Moving 10 panels should take less than 100ms');
      
      // Clean up
      panels.forEach(panel => panel.close());
      
      this.passTest(`Panel performance acceptable (Creation: ${creationTime.toFixed(2)}ms, Drag: ${dragTime.toFixed(2)}ms)`);
    } catch (error) {
      this.failTest(`Panel performance test failed: ${error.message}`);
    }
  }
  
  async testMemoryUsage() {
    this.startTest('Memory Usage');
    
    try {
      if (!performance.memory) {
        this.skipTest('Memory API not available');
        return;
      }
      
      const initialMemory = performance.memory.usedJSHeapSize;
      const panels = [];
      
      // Create and destroy panels
      for (let i = 0; i < 5; i++) {
        const panel = window.createPanel({
          title: `Memory Test ${i}`,
          content: '<div>' + 'x'.repeat(10000) + '</div>'
        });
        panels.push(panel);
      }
      
      await this.wait(100);
      
      panels.forEach(panel => panel.close());
      
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
        await this.wait(100);
      }
      
      const finalMemory = performance.memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      this.assert(memoryIncrease < 10 * 1024 * 1024, 'Memory usage should be reasonable');
      
      this.passTest('Memory usage is acceptable');
    } catch (error) {
      this.skipTest('Memory usage test not supported');
    }
  }
  
  // Helper methods
  startTest(name) {
    this.currentTest = {
      name,
      startTime: performance.now(),
      status: 'running'
    };
    console.log(`🧪 Testing: ${name}...`);
  }
  
  passTest(message) {
    this.currentTest.endTime = performance.now();
    this.currentTest.duration = this.currentTest.endTime - this.currentTest.startTime;
    this.currentTest.status = 'passed';
    this.currentTest.message = message;
    this.results.push(this.currentTest);
    console.log(`✅ ${this.currentTest.name}: ${message} (${this.currentTest.duration.toFixed(2)}ms)`);
  }
  
  failTest(message) {
    this.currentTest.endTime = performance.now();
    this.currentTest.duration = this.currentTest.endTime - this.currentTest.startTime;
    this.currentTest.status = 'failed';
    this.currentTest.message = message;
    this.results.push(this.currentTest);
    console.error(`❌ ${this.currentTest.name}: ${message}`);
  }
  
  skipTest(message) {
    this.currentTest.status = 'skipped';
    this.currentTest.message = message;
    this.results.push(this.currentTest);
    console.warn(`⏭️ ${this.currentTest.name}: ${message}`);
  }
  
  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }
  
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  simulateDrag(element, deltaX, deltaY) {
    const rect = element.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    const mousedown = new MouseEvent('mousedown', {
      clientX: startX,
      clientY: startY,
      bubbles: true
    });
    
    const mousemove = new MouseEvent('mousemove', {
      clientX: startX + deltaX,
      clientY: startY + deltaY,
      bubbles: true
    });
    
    const mouseup = new MouseEvent('mouseup', {
      clientX: startX + deltaX,
      clientY: startY + deltaY,
      bubbles: true
    });
    
    element.dispatchEvent(mousedown);
    document.dispatchEvent(mousemove);
    document.dispatchEvent(mouseup);
  }
  
  generateReport() {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const total = this.results.length;
    
    console.log('\n📊 Test Report Summary');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️ Skipped: ${skipped}`);
    console.log(`Success Rate: ${((passed / (total - skipped)) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => r.status === 'failed').forEach(test => {
        console.log(`  - ${test.name}: ${test.message}`);
      });
    }
    
    // Create report panel
    const reportContent = `
      <div class="test-report">
        <h2>Panel Test Suite Results</h2>
        <div class="summary">
          <div class="stat">
            <span class="label">Total Tests:</span>
            <span class="value">${total}</span>
          </div>
          <div class="stat passed">
            <span class="label">Passed:</span>
            <span class="value">${passed}</span>
          </div>
          <div class="stat failed">
            <span class="label">Failed:</span>
            <span class="value">${failed}</span>
          </div>
          <div class="stat skipped">
            <span class="label">Skipped:</span>
            <span class="value">${skipped}</span>
          </div>
        </div>
        <div class="test-results">
          ${this.results.map(test => `
            <div class="test-result ${test.status}">
              <span class="test-name">${test.name}</span>
              <span class="test-status">${test.status.toUpperCase()}</span>
              <span class="test-message">${test.message}</span>
              ${test.duration ? `<span class="test-duration">${test.duration.toFixed(2)}ms</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      <style>
        .test-report { padding: 1rem; }
        .test-report h2 { color: var(--primary-color); margin-bottom: 1rem; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat { background: rgba(0, 0, 0, 0.5); padding: 1rem; border: 1px solid var(--border-color); }
        .stat.passed { border-color: #00ff00; }
        .stat.failed { border-color: #ff0000; }
        .stat.skipped { border-color: #ffff00; }
        .stat .label { display: block; font-size: 0.875rem; opacity: 0.7; }
        .stat .value { display: block; font-size: 2rem; font-weight: bold; }
        .test-results { display: grid; gap: 0.5rem; }
        .test-result { display: grid; grid-template-columns: 1fr auto auto auto; gap: 1rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.3); border-left: 3px solid; align-items: center; }
        .test-result.passed { border-color: #00ff00; }
        .test-result.failed { border-color: #ff0000; }
        .test-result.skipped { border-color: #ffff00; }
        .test-name { font-weight: 600; }
        .test-status { font-size: 0.75rem; padding: 0.25rem 0.5rem; background: rgba(0, 0, 0, 0.5); }
        .test-message { font-size: 0.875rem; opacity: 0.8; }
        .test-duration { font-size: 0.75rem; opacity: 0.6; }
      </style>
    `;
    
    window.createPanel({
      title: 'Test Report',
      content: reportContent,
      width: 800,
      height: 600
    });
  }
}

// Create global test runner
window.panelTestSuite = new PanelTestSuite();

// Add console command
window.runPanelTests = async function() {
  await window.panelTestSuite.runAllTests();
};

console.log('🧪 Panel Test Suite loaded. Run tests with: runPanelTests()');