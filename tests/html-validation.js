#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Running HTML Validation Tests...\n');

// Read index.html
const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

let errors = [];
let warnings = [];

// Test 1: Check for proper DOCTYPE
if (!htmlContent.startsWith('<!DOCTYPE html>')) {
  errors.push('Missing or incorrect DOCTYPE declaration');
}

// Test 2: Check for lang attribute
if (!htmlContent.includes('<html lang=')) {
  errors.push('Missing lang attribute on html element');
}

// Test 3: Check for meta viewport
if (!htmlContent.includes('viewport')) {
  errors.push('Missing viewport meta tag');
}

// Test 4: Check for title tag
const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
if (!titleMatch) {
  errors.push('Missing title tag');
} else if (titleMatch[1].length < 10) {
  warnings.push('Title tag is too short');
}

// Test 5: Check for duplicate IDs
const idMatches = htmlContent.match(/id="([^"]+)"/g) || [];
const ids = idMatches.map(match => match.replace(/id="|"/g, ''));
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  errors.push(`Duplicate IDs found: ${[...new Set(duplicateIds)].join(', ')}`);
}

// Test 6: Check for empty alt attributes on images
const imgMatches = htmlContent.match(/<img[^>]*>/g) || [];
imgMatches.forEach(img => {
  if (!img.includes('alt=')) {
    warnings.push(`Image missing alt attribute: ${img.substring(0, 50)}...`);
  }
});

// Test 7: Check for inline styles
const inlineStyleCount = (htmlContent.match(/style="/g) || []).length;
if (inlineStyleCount > 50) {
  warnings.push(`High number of inline styles found: ${inlineStyleCount}. Consider moving to CSS files.`);
}

// Test 8: Check for onclick handlers
const onclickCount = (htmlContent.match(/onclick="/g) || []).length;
if (onclickCount > 10) {
  warnings.push(`Many inline onclick handlers found: ${onclickCount}. Consider using addEventListener.`);
}

// Test 9: Check for script tags at end of body
const bodyEndIndex = htmlContent.lastIndexOf('</body>');
const lastScriptIndex = htmlContent.lastIndexOf('<script');
if (lastScriptIndex > bodyEndIndex) {
  warnings.push('Script tags found after </body> tag');
}

// Test 10: Check for ARIA labels on interactive elements
const buttonMatches = htmlContent.match(/<button[^>]*>/g) || [];
let missingAriaButtons = 0;
buttonMatches.forEach(button => {
  if (!button.includes('aria-') && !button.includes('title=')) {
    const textMatch = button.match(/>([^<]+)</);
    if (!textMatch || textMatch[1].trim().length < 3) {
      missingAriaButtons++;
    }
  }
});
if (missingAriaButtons > 0) {
  warnings.push(`${missingAriaButtons} buttons may need ARIA labels or descriptive text`);
}

// Output results
console.log('HTML Validation Results:');
console.log('========================\n');

if (errors.length === 0) {
  console.log('✅ No critical errors found!\n');
} else {
  console.log(`❌ ${errors.length} errors found:\n`);
  errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
  console.log();
}

if (warnings.length > 0) {
  console.log(`⚠️  ${warnings.length} warnings:\n`);
  warnings.forEach((warning, index) => {
    console.log(`  ${index + 1}. ${warning}`);
  });
  console.log();
}

// Summary
console.log('Summary:');
console.log(`- Total lines: ${htmlContent.split('\\n').length}`);
console.log(`- Total size: ${(htmlContent.length / 1024).toFixed(2)} KB`);
console.log(`- Script tags: ${(htmlContent.match(/<script/g) || []).length}`);
console.log(`- Style tags: ${(htmlContent.match(/<style/g) || []).length}`);
console.log(`- Link tags: ${(htmlContent.match(/<link/g) || []).length}`);

// Exit with error code if there are errors
process.exit(errors.length > 0 ? 1 : 0);