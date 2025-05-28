#!/bin/bash

# Deploy script for Cyberpunk GM Screen - UN-Enhanced Edition
# This script helps prepare and deploy the project to GitHub

echo "🚀 Cyberpunk GM Screen - UN-Enhanced Edition Deployment Script"
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

# Set up directories
CURRENT_DIR=$(pwd)
DEPLOY_DIR="$HOME/cyberpunk-gm-screen-unenhanced"

echo -e "\n${BLUE}Step 1: Creating deployment directory...${NC}"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Initialize git
echo -e "\n${BLUE}Step 2: Initializing Git repository...${NC}"
git init

# Create directory structure
echo -e "\n${BLUE}Step 3: Creating directory structure...${NC}"
mkdir -p src/js/{core,components,utils}
mkdir -p src/css
mkdir -p src/assets/{fonts,images,sounds}
mkdir -p docs
mkdir -p tests
mkdir -p .github/workflows

# Copy files
echo -e "\n${BLUE}Step 4: Copying project files...${NC}"

# Main HTML
cp "$CURRENT_DIR/cyberpunk-gm-screen.html" index.html

# Core JS files
cp "$CURRENT_DIR/src/js/enhanced-panel-system-fixed.js" src/js/core/panel-system.js
cp "$CURRENT_DIR/src/js/theme-manager.js" src/js/core/

# Component files
cp "$CURRENT_DIR/src/js/ai-gm-assistant.js" src/js/components/
cp "$CURRENT_DIR/src/js/campaign-tracker.js" src/js/components/
cp "$CURRENT_DIR/src/js/netrunning-enhanced.js" src/js/components/
cp "$CURRENT_DIR/src/js/encounter-panel-simple.js" src/js/components/
cp "$CURRENT_DIR/src/js/compact-dice-roller.js" src/js/components/
cp "$CURRENT_DIR/src/js/advanced-combat-tracker-fixed.js" src/js/components/combat-tracker.js
cp "$CURRENT_DIR/src/js/virtual-scroll.js" src/js/components/
cp "$CURRENT_DIR/src/js/collaboration-system.js" src/js/components/
cp "$CURRENT_DIR/src/js/atmosphere-system.js" src/js/components/

# Copy all other necessary JS files
for file in "$CURRENT_DIR/src/js/"*.js; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        if [[ ! -f "src/js/core/$filename" && ! -f "src/js/components/$filename" ]]; then
            cp "$file" src/js/components/
        fi
    fi
done

# CSS files
cp -r "$CURRENT_DIR/src/css/"* src/css/ 2>/dev/null || echo "No CSS files to copy"

# Assets
cp -r "$CURRENT_DIR/src/fonts/"* src/assets/fonts/ 2>/dev/null || echo "No font files to copy"
cp -r "$CURRENT_DIR/src/images/"* src/assets/images/ 2>/dev/null || echo "No image files to copy"

# Documentation
cp "$CURRENT_DIR/README_UNENHANCED.md" README.md
cp "$CURRENT_DIR/PROGRESS_SUMMARY_JAN27.md" docs/
cp "$CURRENT_DIR/GITHUB_STRATEGY.md" docs/

# Create essential files
echo -e "\n${BLUE}Step 5: Creating essential files...${NC}"

# .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local

# Testing
coverage/
.nyc_output/

# Temporary
tmp/
temp/
EOF

# package.json
cat > package.json << EOF
{
  "name": "cyberpunk-gm-screen-unenhanced",
  "version": "3.0.0-alpha",
  "description": "The UN-Enhanced Edition - Because We're Just Getting Started!",
  "main": "index.html",
  "scripts": {
    "dev": "python3 -m http.server 3000",
    "test": "echo \\"No tests yet - TODO: Add Playwright tests\\"",
    "lint": "echo \\"No linting yet - TODO: Add ESLint\\""
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/$GITHUB_USERNAME/cyberpunk-gm-screen-unenhanced.git"
  },
  "keywords": [
    "cyberpunk",
    "cyberpunk-red",
    "ttrpg",
    "gm-tools",
    "game-master",
    "web-components"
  ],
  "author": "$GITHUB_USERNAME",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/$GITHUB_USERNAME/cyberpunk-gm-screen-unenhanced/issues"
  },
  "homepage": "https://github.com/$GITHUB_USERNAME/cyberpunk-gm-screen-unenhanced#readme"
}
EOF

# LICENSE
cat > LICENSE << EOF
MIT License

Copyright (c) 2025 $GITHUB_USERNAME

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# Update paths in index.html
echo -e "\n${BLUE}Step 6: Updating file paths in index.html...${NC}"
sed -i 's|src="/src/js/|src="src/js/components/|g' index.html
sed -i 's|src="src/js/enhanced-panel-system-fixed.js"|src="src/js/core/panel-system.js"|g' index.html
sed -i 's|src="src/js/theme-manager.js"|src="src/js/core/theme-manager.js"|g' index.html
sed -i 's|src="src/js/advanced-combat-tracker-fixed.js"|src="src/js/components/combat-tracker.js"|g' index.html

echo -e "\n${GREEN}✅ File preparation complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Go to https://github.com/new"
echo "2. Create repository: cyberpunk-gm-screen-unenhanced"
echo "3. Run the following commands:"
echo ""
echo -e "${BLUE}cd $DEPLOY_DIR${NC}"
echo -e "${BLUE}git remote add origin https://github.com/$GITHUB_USERNAME/cyberpunk-gm-screen-unenhanced.git${NC}"
echo ""
echo "4. Then run the commit sequence:"
echo -e "${BLUE}./commit-sequence.sh${NC}"

# Create commit sequence script
cat > commit-sequence.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting commit sequence..."

# Commit 1: Foundation
git add README.md LICENSE package.json .gitignore
git commit -m "🚀 Initial commit: UN-Enhanced Edition begins"

# Commit 2: Core Systems
git add src/js/core/*
git commit -m "✨ Add core panel and theme systems"

# Commit 3: Components - Basics
git add src/js/components/combat-tracker.js src/js/components/compact-dice-roller.js
git commit -m "🎲 Add dice roller and combat tracker"

# Commit 4: AI Assistant
git add src/js/components/ai-gm-assistant.js
git commit -m "🤖 Add AI-powered GM assistant"

# Commit 5: Campaign Tracker
git add src/js/components/campaign-tracker.js
git commit -m "📊 Add campaign progress tracking"

# Commit 6: Netrunning Suite
git add src/js/components/netrunning-*.js
git commit -m "🌐 Add enhanced netrunning interface with narrative mode"

# Commit 7: Additional Components
git add src/js/components/*
git commit -m "✨ Add encounter generator and supporting components"

# Commit 8: Styling and Assets
git add src/css/* src/assets/*
git commit -m "🎨 Add cyberpunk styling and assets"

# Commit 9: Main Application
git add index.html
git commit -m "🏗️ Add main application file"

# Commit 10: Documentation
git add docs/* .github
git commit -m "📚 Add documentation and progress tracking"

echo "✅ Commit sequence complete!"
echo ""
echo "Now run:"
echo "git push -u origin main"
echo "git tag -a v3.0.0-alpha -m 'First alpha release of the UN-Enhanced Edition'"
echo "git push origin v3.0.0-alpha"
EOF

chmod +x commit-sequence.sh

echo -e "\n${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "${YELLOW}Files are ready in: $DEPLOY_DIR${NC}"