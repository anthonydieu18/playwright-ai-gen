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

    // Assertion steps - visibility
    if (lowerStep.includes('should see') || lowerStep.includes('should be navigated')) {
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
      return `${indent}// Given: ${step}\n${indent}// Setup: Login as ${username}\n${indent}await page.goto('/login');\n${indent}await page.fill('input[name="username"]', ${username});\n${indent}await page.fill('input[name="password"]', '"testpass123"');\n${indent}await page.click('button[type="submit"]');\n`;
    }

    // Logged out state
    if (lowerStep.includes('should be logged out')) {
      return `${indent}// Then: ${step}\n${indent}await expect(page.locator('.user-menu')).not.toBeVisible();\n`;
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
    if (lowerStep.includes('home')) return 'home';
    return 'index';
  }

  /**
   * Extract element selector from step
   */
  private extractElement(step: string): string {
    const lowerStep = step.toLowerCase();
    if (lowerStep.includes('login')) return 'button[type="submit"]';
    if (lowerStep.includes('logout')) return 'button.logout';
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
