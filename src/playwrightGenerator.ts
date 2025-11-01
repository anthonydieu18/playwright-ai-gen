import { TestCase, GherkinScenario } from './types';

/**
 * Converts Gherkin scenarios into Playwright test scripts
 */
export class PlaywrightGenerator {
  /**
   * Generate Playwright test code from test cases
   */
  generatePlaywrightTest(testCase: TestCase): string {
    const imports = this.generateImports();
    const testSuite = this.generateTestSuite(testCase);
    
    return `${imports}\n\n${testSuite}`;
  }

  /**
   * Generate import statements
   */
  private generateImports(): string {
    return `import { test, expect } from '@playwright/test';`;
  }

  /**
   * Generate the test suite
   */
  private generateTestSuite(testCase: TestCase): string {
    let code = `test.describe('${testCase.feature}', () => {\n`;
    
    testCase.scenarios.forEach((scenario) => {
      code += this.generateTest(scenario);
    });
    
    code += '});\n';
    return code;
  }

  /**
   * Generate a single test from a Gherkin scenario
   */
  private generateTest(scenario: GherkinScenario): string {
    const testName = this.extractTestName(scenario.scenario);
    let code = `  test('${testName}', async ({ page }) => {\n`;
    
    // Generate Given steps
    scenario.given.forEach((step) => {
      code += this.convertStepToPlaywright(step, '    ');
    });
    
    // Generate When steps
    scenario.when.forEach((step) => {
      code += this.convertStepToPlaywright(step, '    ');
    });
    
    // Generate Then steps
    scenario.then.forEach((step) => {
      code += this.convertStepToPlaywright(step, '    ');
    });
    
    code += '  });\n\n';
    return code;
  }

  /**
   * Extract clean test name from scenario
   */
  private extractTestName(scenario: string): string {
    // Remove "Scenario X:" prefix
    return scenario.replace(/^Scenario \d+:\s*/, '');
  }

  /**
   * Convert a Gherkin step to Playwright code
   */
  private convertStepToPlaywright(step: string, indent: string): string {
    const lowerStep = step.toLowerCase();

    // Navigation steps
    if (lowerStep.includes('i am on') || lowerStep.includes('navigate')) {
      const page = this.extractPageName(step);
      return `${indent}// Given: ${step}\n${indent}await page.goto('/${page}');\n`;
    }

    // Click steps
    if (lowerStep.includes('click')) {
      const element = this.extractElement(step);
      return `${indent}// When: ${step}\n${indent}await page.click('${element}');\n`;
    }

    // Input steps
    if (lowerStep.includes('enter') && (lowerStep.includes('username') || lowerStep.includes('password'))) {
      const { field, value } = this.extractFieldAndValue(step);
      return `${indent}// When: ${step}\n${indent}await page.fill('input[name="${field}"]', ${value});\n`;
    }

    // Success messages with quoted text (must be before general "should see")
    if (lowerStep.includes('should see') && step.includes('"')) {
      const message = this.extractQuotedValue(step);
      return `${indent}// Then: ${step}\n${indent}await expect(page.locator('.message')).toContainText(${message});\n`;
    }

    // List visibility (must be before general "should see")
    if (lowerStep.includes('should see a list') || lowerStep.includes('should see all')) {
      return `${indent}// Then: ${step}\n${indent}await expect(page.locator('.product-list, .cart-items')).toBeVisible();\n`;
    }

    // Total price
    if (lowerStep.includes('total price')) {
      return `${indent}// Then: ${step}\n${indent}await expect(page.locator('.total-price')).toBeVisible();\n`;
    }

    // Assertion steps - visibility (general fallback for "should see")
    if (lowerStep.includes('should see')) {
      const text = this.extractTextToVerify(step);
      return `${indent}// Then: ${step}\n${indent}await expect(page.locator('body')).toContainText('${text}');\n`;
    }

    // Assertion steps - redirect/navigation
    if (lowerStep.includes('should be redirected') || lowerStep.includes('should be navigated')) {
      const page = this.extractPageName(step);
      return `${indent}// Then: ${step}\n${indent}await expect(page).toHaveURL(new RegExp('.*/${page}.*'));\n`;
    }

    // Logged in state
    if (lowerStep.includes('i am logged in')) {
      const username = this.extractQuotedValue(step);
      return `${indent}// Given: ${step}\n${indent}// Setup: Login as ${username}\n${indent}await page.goto('/login');\n${indent}await page.fill('input[name="username"]', ${username});\n${indent}await page.fill('input[name="password"]', "testpass123");\n${indent}await page.click('button[type="submit"]');\n`;
    }

    // Logged out state
    if (lowerStep.includes('should be logged out')) {
      return `${indent}// Then: ${step}\n${indent}await expect(page.locator('.user-menu')).not.toBeVisible();\n`;
    }

    // Cart-related steps - Given state with specific item
    if (lowerStep.includes('i have "') && step.includes('"')) {
      const item = this.extractQuotedValue(step);
      return `${indent}// Given: ${step}\n${indent}// Setup: Add item to cart\n${indent}await page.goto('/products');\n${indent}await page.click(\`button[data-product=\${${item}}]\`);\n`;
    }

    // Cart-related steps - Given state with items (no specific item)
    if (lowerStep.includes('i have items')) {
      return `${indent}// Given: ${step}\n${indent}// Setup: Add items to cart\n${indent}await page.goto('/products');\n${indent}await page.click('button.add-to-cart:first-of-type');\n`;
    }

    // Cart count assertions
    if (lowerStep.includes('cart count should')) {
      if (lowerStep.includes('increase')) {
        return `${indent}// Then: ${step}\n${indent}const cartCount = await page.locator('.cart-count').textContent();\n${indent}await expect(parseInt(cartCount || '0')).toBeGreaterThan(0);\n`;
      } else if (lowerStep.includes('decrease')) {
        return `${indent}// Then: ${step}\n${indent}await expect(page.locator('.cart-count')).toBeVisible();\n`;
      }
    }

    // Item removal
    if (lowerStep.includes('should be removed')) {
      return `${indent}// Then: ${step}\n${indent}await expect(page.locator('.cart-item')).not.toBeVisible();\n`;
    }

    // Item should not be added
    if (lowerStep.includes('should not be added')) {
      return `${indent}// Then: ${step}\n${indent}await expect(page.locator('.cart-count')).not.toContainText(/[1-9]/);\n`;
    }

    // Default fallback
    return `${indent}// ${step}\n${indent}// TODO: Implement this step\n`;
  }

  /**
   * Extract page name from step
   */
  private extractPageName(step: string): string {
    const lowerStep = step.toLowerCase();
    if (lowerStep.includes('login')) return 'login';
    if (lowerStep.includes('dashboard')) return 'dashboard';
    if (lowerStep.includes('cart')) return 'cart';
    if (lowerStep.includes('product')) return 'products';
    if (lowerStep.includes('home')) return 'home';
    return 'index';
  }

  /**
   * Extract element selector from step
   */
  private extractElement(step: string): string {
    const lowerStep = step.toLowerCase();
    
    // Handle quoted button text
    if (step.includes('"')) {
      const buttonText = this.extractQuotedValue(step);
      return `button:has-text(${buttonText})`;
    }
    
    if (lowerStep.includes('login')) return 'button[type="submit"]';
    if (lowerStep.includes('logout')) return 'button.logout';
    if (lowerStep.includes('remove')) return 'button.remove-item';
    if (lowerStep.includes('products link')) return 'a[href*="products"]';
    if (lowerStep.includes('link')) return 'a';
    return 'button';
  }

  /**
   * Extract field name and value from input step
   */
  private extractFieldAndValue(step: string): { field: string; value: string } {
    const lowerStep = step.toLowerCase();
    const quotedValue = this.extractQuotedValue(step);
    
    if (lowerStep.includes('username')) {
      return { field: 'username', value: quotedValue };
    }
    if (lowerStep.includes('password')) {
      return { field: 'password', value: quotedValue };
    }
    
    return { field: 'input', value: quotedValue };
  }

  /**
   * Extract quoted value from step
   */
  private extractQuotedValue(step: string): string {
    const match = step.match(/"([^"]*)"/);
    return match ? `"${match[1]}"` : '""';
  }

  /**
   * Extract text to verify from assertion
   */
  private extractTextToVerify(step: string): string {
    const lowerStep = step.toLowerCase();
    if (lowerStep.includes('error')) return 'error';
    if (lowerStep.includes('welcome')) return 'Welcome';
    if (lowerStep.includes('login form')) return 'Login';
    return 'content';
  }
}
