const { test, expect } = require('@playwright/test');
const { injectAxe, checkA11y } = require('@axe-core/playwright');

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173'); // Vite dev server
    await injectAxe(page);
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    const results = await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    });
    
    expect(results.violations).toHaveLength(0);
  });

  test('should have proper heading structure', async ({ page }) => {
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
      elements.map((el) => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent.trim()
      }))
    );

    // Verify there's at least one h1
    const h1Count = headings.filter(h => h.level === 1).length;
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Verify heading hierarchy
    for (let i = 1; i < headings.length; i++) {
      const currentLevel = headings[i].level;
      const previousLevel = headings[i - 1].level;
      
      // Heading levels should not skip (e.g., h1 -> h3)
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
    }
  });

  test('all interactive elements should be keyboard accessible', async ({ page }) => {
    // Check all buttons have proper focus styling
    const buttons = await page.$$('button');
    
    for (const button of buttons) {
      await button.focus();
      const hasFocusIndicator = await button.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });
      
      expect(hasFocusIndicator).toBeTruthy();
    }
  });

  test('all images should have alt text', async ({ page }) => {
    const images = await page.$$eval('img', (imgs) =>
      imgs.map((img) => ({
        src: img.src,
        alt: img.alt
      }))
    );

    for (const img of images) {
      expect(img.alt).toBeTruthy();
    }
  });

  test('form elements should have labels', async ({ page }) => {
    const inputs = await page.$$('input, select, textarea');
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = await page.$(`label[for="${id}"]`);
        const hasLabel = label !== null || ariaLabel !== null || ariaLabelledBy !== null;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('color contrast should meet WCAG standards', async ({ page }) => {
    const results = await checkA11y(page, null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2aa', 'wcag2aaa']
      }
    });
    
    const contrastViolations = results.violations.filter(v => 
      v.id.includes('contrast')
    );
    
    expect(contrastViolations).toHaveLength(0);
  });
});