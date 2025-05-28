# Cyberpunk GM Screen

A comprehensive digital Game Master screen for the Cyberpunk RED tabletop roleplaying game, featuring rich content, advanced generators, and a sophisticated UI.

## Core Features

### Panel System
- Draggable and resizable panels with smooth animations
- Layout save/restore with auto-save functionality
- Import/export layouts as JSON files
- Mobile-responsive design with tab-based navigation
- Touch gesture support for tablets

### Content & Tools
- **Enhanced Dice Roller** with cyberpunk sound effects
- **Advanced Combat Tracker** with initiative management
- **Rich Text Notes** with markdown support and auto-save
- **NPC Generator** with difficulty tiers and full stats
- **Location Generator** for Night City districts
- **Advanced Encounter Generator** with detailed scenarios
- **Comprehensive Lore Database** with 50+ searchable entries
- **Rules Quick Reference** with organized categories
- **Campaign Manager** with data export/import

### New in Phase 10
- **Enhanced Typography System** with fluid responsive text
- **Reading Mode** for comfortable long-form content viewing
- **Automated Test Suite** for quality assurance
- **Performance Optimization** with FPS monitoring
- **Progressive Web App** support for offline use

## Features

### UI Modernization
- **Multiple Themes**: Choose between Neon Synthwave, Tech Noir, and Minimal themes
- **Improved UX**: Enhanced visual feedback and animations
- **Responsive Design**: Better support for different screen sizes
- **Consistent Components**: Standardized UI using CSS variables
- **Accessibility**: Improved keyboard navigation and screen reader support
- **Modular Architecture**: Clean, maintainable code structure

### Layout Management
- **Auto-Save**: Panel positions and sizes are automatically saved
- **Import/Export**: Share your favorite layouts with other GMs
- **Custom Notifications**: Non-blocking status messages
- **Layout Persistence**: Your setup is restored when you reload the page

### Enhanced Panels
- **Character Management**: Save and load character sheets
- **Note Taking**: Auto-saves content as you type
- **Generators**: Create NPCs, loot, locations, and encounters
- **Collections**: Save generated content for later reference

## Recent Improvements

### Phase 10 - Enhanced Content & Typography
- **Typography System**: Fluid responsive fonts with multiple families for different content types
- **Lore Database**: 50+ entries covering corporations, districts, gangs, technology, and history
- **Advanced Encounters**: Multi-phase scenarios with environmental details and NPC personalities
- **Automated Testing**: Comprehensive test suite with performance benchmarking
- **PWA Support**: Offline functionality with service worker caching

### Previous Phases
- **Major UI Modernization**: Complete rewrite with modern architecture ([See documentation](./docs/ui-modernization-artifacts/UI-MODERNIZATION-SUMMARY.md))
- Added theme switching with Neon Synthwave, Tech Noir, and Minimal themes
- Implemented central state management and event delegation
- Enhanced accessibility with ARIA attributes and keyboard navigation
- Improved code architecture with modular pattern and error handling
- Fixed panel functionality issues with robust error recovery
- Added comprehensive CSS custom properties system
- Enhanced UI with non-blocking notifications
- Optimized performance for panel management

## Project Structure

- `src/frontend/`: Frontend web application
   - `css/`: Stylesheets 
     - `styles.css`: Original styles
     - `styles-modern.css`: New themeable styles
     - `styles-refactored.css`: Modern component-based CSS architecture
     - `cyberpunk-variables.css`: CSS variables and design tokens
     - `cyberpunk-neon-synthwave.css`: Neon 80s theme
     - `cyberpunk-tech-noir.css`: Terminal-inspired theme
     - `cyberpunk-reset.css`: Consistent baseline styles
     - `cyberpunk-typography.css`: Font system
   - `fonts/`: Custom fonts
   - `images/`: Icons and images
   - `js/`: JavaScript files
     - Core Systems:
       - `enhanced-panel-system-fixed.js`: Advanced panel management
       - `performance-optimizer.js`: FPS monitoring and optimization
       - `service-worker.js`: PWA offline support
     - Panels & Features:
       - `enhanced-dice-roller.js`: Dice rolling with sound effects
       - `advanced-combat-tracker.js`: Initiative and combat management
       - `npc-generator.js`: Detailed NPC creation
       - `location-generator-implementation.js`: Night City locations
       - `encounter-generator-advanced.js`: Rich encounter scenarios
       - `lore-database.js` & `lore-browser.js`: Searchable lore system
     - Utilities:
       - `panel-test-suite.js`: Automated testing framework
       - `sound-manager.js`: Cyberpunk audio effects
       - `campaign-manager.js`: Data export/import
- `docs/`: Project documentation
   - `ui-modernization-artifacts/`: UI modernization documentation and artifacts
   - `LAYOUT_SAVE_IMPROVED.md`: Documentation for layout system
- `scripts/`: Utility scripts

## Usage

### Themes
The application supports three themes:
1. **Neon Synthwave**: 80s-inspired bright neon colors with purple and cyan 
2. **Tech Noir**: Terminal-inspired dark theme with teal accents
3. **Minimal**: Clean, understated design for distraction-free gaming

To switch themes, use the theme selector in the top right corner of the toolbar.

### Getting Started
1. Open `cyberpunk-gm-screen.html` in a modern web browser
2. Use the side tray to create panels for your game session
3. Drag panels to arrange your perfect layout
4. Your layout auto-saves and will be restored on reload

### Testing
Run automated tests with: Open the browser console and type `runPanelTests()`

### Keyboard Shortcuts
- `Alt + Tab`: Switch between panels
- `Esc`: Close active panel
- `Ctrl + S`: Save current layout
- `g`: Generate (in encounter panel)
- `/`: Focus search (in lore browser)

## Development

### Prerequisites
- Web browser
- Git (for version control)
- Node.js (optional, for running local server)

### Setup
1. Clone this repository
2. Run `./scripts/run-local-server.sh` to start a local development server
3. Open your browser to the displayed URL

### Documentation
For developers working on this project, please review:
- [Phase 10 Summary - Enhanced Content](./docs/PHASE-10-SUMMARY.md)
- [UI Modernization Summary](./docs/ui-modernization-artifacts/UI-MODERNIZATION-SUMMARY.md)
- [Implementation Plan](./docs/ui-modernization-artifacts/UI-MODERNIZATION-IMPLEMENTATION-PLAN.md)
- [Implementation Progress](./docs/ui-modernization-artifacts/UI-MODERNIZATION-IMPLEMENTATION-PROGRESS.md)
- [Technical Debt and Future Work](./docs/ui-modernization-artifacts/TECHNICAL-DEBT-AND-FUTURE-WORK.md)

## Deployment
This project can be deployed to GitHub Pages.

## License
See the LICENSE file for details.