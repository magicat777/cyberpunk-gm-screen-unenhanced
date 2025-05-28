const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices'],
    port: chrome.port
  };
  
  const runnerResult = await lighthouse(url, options);
  
  // Extract scores
  const scores = {
    performance: runnerResult.lhr.categories.performance.score * 100,
    accessibility: runnerResult.lhr.categories.accessibility.score * 100,
    bestPractices: runnerResult.lhr.categories['best-practices'].score * 100
  };
  
  console.log('Lighthouse Test Results:');
  console.log('========================');
  console.log(`Performance Score: ${scores.performance}/100`);
  console.log(`Accessibility Score: ${scores.accessibility}/100`);
  console.log(`Best Practices Score: ${scores.bestPractices}/100`);
  
  // Show performance metrics
  const metrics = runnerResult.lhr.audits;
  console.log('\nKey Performance Metrics:');
  console.log(`- First Contentful Paint: ${metrics['first-contentful-paint'].displayValue}`);
  console.log(`- Largest Contentful Paint: ${metrics['largest-contentful-paint'].displayValue}`);
  console.log(`- Total Blocking Time: ${metrics['total-blocking-time'].displayValue}`);
  console.log(`- Cumulative Layout Shift: ${metrics['cumulative-layout-shift'].displayValue}`);
  
  await chrome.kill();
  
  return scores;
}

// Run on local server
const fileUrl = `file://${__dirname}/panel-demo-simple.html`;
runLighthouse(fileUrl).catch(console.error);