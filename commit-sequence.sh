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
