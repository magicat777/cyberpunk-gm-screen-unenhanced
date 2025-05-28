# 🚀 Deployment Steps - UN-Enhanced Edition

## Step 1: Prepare the Repository Structure

First, let's organize our files for the new repository:

```bash
# Create a deployment directory
mkdir -p ~/cyberpunk-gm-screen-unenhanced
cd ~/cyberpunk-gm-screen-unenhanced

# Initialize git
git init

# Create directory structure
mkdir -p src/js/{core,components,utils}
mkdir -p src/css
mkdir -p src/assets/{fonts,images,sounds}
mkdir -p docs
mkdir -p tests
mkdir -p .github/workflows
```

## Step 2: Copy and Organize Files

```bash
# Copy the main HTML file as index.html
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/cyberpunk-gm-screen.html index.html

# Copy JavaScript components
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/js/enhanced-panel-system-fixed.js src/js/core/panel-system.js
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/js/theme-manager.js src/js/core/
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/js/ai-gm-assistant.js src/js/components/
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/js/campaign-tracker.js src/js/components/
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/js/netrunning-enhanced.js src/js/components/
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/js/encounter-panel-simple.js src/js/components/
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/js/compact-dice-roller.js src/js/components/
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/js/advanced-combat-tracker-fixed.js src/js/components/combat-tracker.js
# ... copy all other JS files

# Copy CSS files
cp -r ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/css/* src/css/

# Copy assets
cp -r ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/fonts/* src/assets/fonts/
cp -r ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/src/images/* src/assets/images/

# Copy documentation
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/README_UNENHANCED.md README.md
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/PROGRESS_SUMMARY_JAN27.md docs/
cp ~/projects/cyberpunk-gm-screen/cyberpunk-gm-screen/GITHUB_STRATEGY.md docs/
```

## Step 3: Create Essential Files

### Create .gitignore
```bash
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
```

### Create package.json
```bash
cat > package.json << 'EOF'
{
  "name": "cyberpunk-gm-screen-unenhanced",
  "version": "3.0.0-alpha",
  "description": "The UN-Enhanced Edition - Because We're Just Getting Started!",
  "main": "index.html",
  "scripts": {
    "dev": "python3 -m http.server 3000",
    "test": "echo \"No tests yet - TODO: Add Playwright tests\"",
    "lint": "echo \"No linting yet - TODO: Add ESLint\""
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/cyberpunk-gm-screen-unenhanced.git"
  },
  "keywords": [
    "cyberpunk",
    "cyberpunk-red",
    "ttrpg",
    "gm-tools",
    "game-master",
    "web-components"
  ],
  "author": "Your Name",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/yourusername/cyberpunk-gm-screen-unenhanced/issues"
  },
  "homepage": "https://github.com/yourusername/cyberpunk-gm-screen-unenhanced#readme"
}
EOF
```

### Create LICENSE
```bash
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 [Your Name]

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
```

## Step 4: Update File Paths in index.html

Update all script and CSS paths in index.html to match new structure:
```html
<!-- Update from -->
<script src="src/js/ai-gm-assistant.js"></script>

<!-- To -->
<script src="src/js/components/ai-gm-assistant.js"></script>
```

## Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `cyberpunk-gm-screen-unenhanced`
3. Description: "The UN-Enhanced Edition - Because We're Just Getting Started!"
4. Public repository
5. DO NOT initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 6: Initial Commit Sequence

```bash
# Add remote
git remote add origin https://github.com/yourusername/cyberpunk-gm-screen-unenhanced.git

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
git add docs/*
git commit -m "📚 Add documentation and progress tracking"

# Push to GitHub
git push -u origin main

# Tag the alpha release
git tag -a v3.0.0-alpha -m "First alpha release of the UN-Enhanced Edition"
git push origin v3.0.0-alpha
```

## Step 7: Enable GitHub Pages

1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Click Save

Your app will be available at:
`https://yourusername.github.io/cyberpunk-gm-screen-unenhanced/`

## Step 8: Configure Repository

1. **Add Topics**: 
   - cyberpunk-red
   - ttrpg
   - gm-tools
   - javascript
   - web-components
   - game-master

2. **Create Issue Labels**:
   - `enhancement` (green) - New features
   - `bug` (red) - Something isn't working
   - `documentation` (blue) - Documentation improvements
   - `good first issue` (purple) - Good for newcomers
   - `help wanted` (yellow) - Extra attention needed
   - `un-enhancement` (cyan) - Makes it less un-enhanced!

3. **Add Description and Website**:
   - Description: "🎲 The UN-Enhanced Edition - A feature-rich GM screen for Cyberpunk RED. Because we're just getting started, choom!"
   - Website: Your GitHub Pages URL

## Step 9: Create Release

1. Go to Releases → Create a new release
2. Tag: v3.0.0-alpha
3. Title: "UN-Enhanced Edition v3.0.0-alpha"
4. Description:
```markdown
# 🚀 UN-Enhanced Edition Alpha Release

The first alpha release of the Cyberpunk GM Screen UN-Enhanced Edition!

## ✨ Features
- 🤖 AI-powered GM assistant
- 🌐 Interactive netrunning with narrative mode
- 📊 Campaign progress tracking
- 🎲 Advanced dice system
- ⚔️ Smart combat tracker
- 🎯 Encounter generator
- 🌆 Atmosphere system
- 📱 Mobile responsive

## 🐛 Known Issues
- This is an alpha release - expect bugs!
- Performance optimization ongoing
- Some features still in development

## 🤝 Contributing
We welcome contributions! Check out our [contributing guide](docs/CONTRIBUTING.md).

## 📖 Documentation
See the [README](README.md) for full documentation.

---
Current UN-Enhancement Level: 15% 📊
```

5. Check "This is a pre-release"
6. Publish release

## Step 10: Final Checklist

- [ ] All files copied and organized
- [ ] Paths updated in index.html
- [ ] Repository created on GitHub
- [ ] All commits pushed
- [ ] Alpha tag created
- [ ] GitHub Pages enabled
- [ ] Repository configured
- [ ] Release published
- [ ] Test live site
- [ ] Share with community!

## 🎉 Congratulations!

Your UN-Enhanced Edition is now live! Share the link and start gathering feedback from the community.

Remember: Every contribution makes it LESS un-enhanced! 🚀