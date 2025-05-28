const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

async function runAccessibilityTest() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Test the demo page
  await page.goto(`file://${__dirname}/panel-demo-simple.html`);
  
  // Run axe-core
  const results = await new AxePuppeteer(page).analyze();
  
  console.log('Accessibility Test Results:');
  console.log('===========================');
  console.log(`Violations: ${results.violations.length}`);
  console.log(`Passes: ${results.passes.length}`);
  console.log(`Incomplete: ${results.incomplete.length}`);
  console.log(`Inapplicable: ${results.inapplicable.length}`);
  
  if (results.violations.length > 0) {
    console.log('\nViolations:');
    results.violations.forEach(violation => {
      console.log(`\n- ${violation.description} (${violation.id})`);
      console.log(`  Impact: ${violation.impact}`);
      console.log(`  Affected elements: ${violation.nodes.length}`);
      violation.nodes.forEach(node => {
        console.log(`    - ${node.target}`);
      });
    });
  }
  
  await browser.close();
  
  return results.violations.length === 0;
}

runAccessibilityTest().then(passed => {
  process.exit(passed ? 0 : 1);
}).catch(error => {
  console.error('Error running accessibility test:', error);
  process.exit(1);
});