#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Running JavaScript Quality Checks...\n');

const jsDir = path.join(__dirname, '..', 'src', 'js', 'components');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

let totalIssues = 0;
let fileReports = [];

files.forEach(file => {
  const filePath = path.join(jsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  let issues = [];
  
  // Check for console.log statements
  const consoleLogs = (content.match(/console\.log/g) || []).length;
  if (consoleLogs > 0) {
    issues.push(`${consoleLogs} console.log statements found`);
  }
  
  // Check for TODO comments
  const todos = (content.match(/TODO|FIXME|HACK/g) || []).length;
  if (todos > 0) {
    issues.push(`${todos} TODO/FIXME/HACK comments found`);
  }
  
  // Check for very long lines
  const lines = content.split('\n');
  const longLines = lines.filter(line => line.length > 120).length;
  if (longLines > 0) {
    issues.push(`${longLines} lines exceed 120 characters`);
  }
  
  // Check for var usage
  const varUsage = (content.match(/\bvar\s+/g) || []).length;
  if (varUsage > 0) {
    issues.push(`${varUsage} 'var' declarations (use let/const instead)`);
  }
  
  // Check for == instead of ===
  const looseEquality = (content.match(/[^=!]==[^=]/g) || []).length;
  if (looseEquality > 0) {
    issues.push(`${looseEquality} loose equality checks (use === instead)`);
  }
  
  // Check for function complexity (very basic)
  const functions = content.match(/function\s+\w+\s*\([^)]*\)\s*{|(\w+)\s*[:=]\s*(?:async\s+)?(?:function\s*)?\([^)]*\)\s*(?:=>)?\s*{/g) || [];
  const largeFunctions = functions.filter(func => {
    const funcStart = content.indexOf(func);
    const funcEnd = content.indexOf('}', funcStart);
    const funcBody = content.substring(funcStart, funcEnd);
    return funcBody.split('\n').length > 50;
  }).length;
  
  if (largeFunctions > 0) {
    issues.push(`${largeFunctions} functions exceed 50 lines`);
  }
  
  // Check for proper error handling
  const tryBlocks = (content.match(/try\s*{/g) || []).length;
  const catchBlocks = (content.match(/catch\s*\(/g) || []).length;
  if (tryBlocks !== catchBlocks) {
    issues.push('Mismatched try/catch blocks');
  }
  
  // Check for missing semicolons (basic check)
  const missingSemis = lines.filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 0 && 
           !trimmed.endsWith(';') && 
           !trimmed.endsWith('{') && 
           !trimmed.endsWith('}') &&
           !trimmed.endsWith(',') &&
           !trimmed.startsWith('//') &&
           !trimmed.startsWith('*') &&
           !trimmed.includes('if (') &&
           !trimmed.includes('else') &&
           !trimmed.includes('for (') &&
           !trimmed.includes('while (') &&
           !trimmed.includes('function') &&
           !trimmed.includes('=>') &&
           (trimmed.includes('=') || trimmed.includes('return') || trimmed.includes('throw'));
  }).length;
  
  if (missingSemis > 0) {
    issues.push(`${missingSemis} lines possibly missing semicolons`);
  }
  
  if (issues.length > 0) {
    fileReports.push({ file, issues });
    totalIssues += issues.length;
  }
});

// Output results
console.log('JavaScript Quality Check Results:');
console.log('=================================\n');

if (fileReports.length === 0) {
  console.log('✅ No issues found in any files!\n');
} else {
  console.log(`Found issues in ${fileReports.length} files:\n`);
  
  fileReports.forEach(report => {
    console.log(`📄 ${report.file}:`);
    report.issues.forEach(issue => {
      console.log(`   - ${issue}`);
    });
    console.log();
  });
}

// Summary statistics
console.log('Summary:');
console.log(`- Files checked: ${files.length}`);
console.log(`- Files with issues: ${fileReports.length}`);
console.log(`- Total issues: ${totalIssues}`);

// Additional metrics
let totalLines = 0;
let totalSize = 0;

files.forEach(file => {
  const filePath = path.join(jsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  totalLines += content.split('\n').length;
  totalSize += content.length;
});

console.log(`- Total lines of code: ${totalLines.toLocaleString()}`);
console.log(`- Total size: ${(totalSize / 1024).toFixed(2)} KB`);
console.log(`- Average file size: ${(totalSize / files.length / 1024).toFixed(2)} KB`);

process.exit(fileReports.length > 0 ? 1 : 0);