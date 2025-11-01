import { Requirement, GherkinScenario, TestCase } from './types';

/**
 * AI-powered module to generate Gherkin test cases from requirements
 * This simulates AI by using template-based generation with intelligent mapping
 */
export class GherkinGenerator {
  /**
   * Generate Gherkin test cases from a requirement
   */
  generateTestCases(requirement: Requirement): TestCase {
    const scenarios: GherkinScenario[] = [];

    // Generate scenarios based on acceptance criteria
    requirement.acceptanceCriteria.forEach((criteria, index) => {
      const scenario = this.generateScenarioFromCriteria(
        requirement.title,
        criteria,
        index + 1
      );
      scenarios.push(scenario);
    });

    return {
      feature: requirement.title,
      scenarios,
    };
  }

  /**
   * Generate a Gherkin scenario from a single acceptance criterion
   */
  private generateScenarioFromCriteria(
    featureTitle: string,
    criteria: string,
    scenarioNumber: number
  ): GherkinScenario {
    // Use AI-like logic to extract key actions and outcomes
    const lowerCriteria = criteria.toLowerCase();

    // Determine scenario type based on keywords - order matters!
    // Check for specific patterns first, then broader ones
    if (lowerCriteria.includes('error') || lowerCriteria.includes('invalid') || lowerCriteria.includes('out-of-stock')) {
      return this.generateErrorScenario(featureTitle, criteria, scenarioNumber);
    } else if (lowerCriteria.includes('log out') || lowerCriteria.includes('logout')) {
      return this.generateLogoutScenario(featureTitle, criteria, scenarioNumber);
    } else if (lowerCriteria.includes('view') && lowerCriteria.includes('cart')) {
      return this.generateCartViewRemoveScenario(featureTitle, criteria, scenarioNumber);
    } else if (lowerCriteria.includes('remove') && lowerCriteria.includes('cart')) {
      return this.generateCartViewRemoveScenario(featureTitle, criteria, scenarioNumber);
    } else if (lowerCriteria.includes('add') && lowerCriteria.includes('cart')) {
      return this.generateCartActionScenario(featureTitle, criteria, scenarioNumber);
    } else if (lowerCriteria.includes('navigate') || lowerCriteria.includes('access') || lowerCriteria.includes('listing')) {
      return this.generateNavigationScenario(featureTitle, criteria, scenarioNumber);
    } else {
      return this.generateSuccessScenario(featureTitle, criteria, scenarioNumber);
    }
  }

  /**
   * Generate a success scenario
   */
  private generateSuccessScenario(
    featureTitle: string,
    criteria: string,
    scenarioNumber: number
  ): GherkinScenario {
    return {
      feature: featureTitle,
      scenario: `Scenario ${scenarioNumber}: ${criteria}`,
      given: ['I am on the login page'],
      when: [
        'I enter valid username "testuser"',
        'I enter valid password "testpass123"',
        'I click the login button',
      ],
      then: [
        'I should be redirected to the dashboard',
        'I should see a welcome message',
      ],
    };
  }

  /**
   * Generate an error scenario
   */
  private generateErrorScenario(
    featureTitle: string,
    criteria: string,
    scenarioNumber: number
  ): GherkinScenario {
    const lowerCriteria = criteria.toLowerCase();
    
    if (lowerCriteria.includes('out-of-stock') || lowerCriteria.includes('stock')) {
      return {
        feature: featureTitle,
        scenario: `Scenario ${scenarioNumber}: ${criteria}`,
        given: ['I am on the product page for "Out of Stock Product"'],
        when: ['I click the "Add to Cart" button'],
        then: [
          'I should see an error message "This item is out of stock"',
          'The item should not be added to my cart',
        ],
      };
    }
    
    return {
      feature: featureTitle,
      scenario: `Scenario ${scenarioNumber}: ${criteria}`,
      given: ['I am on the login page'],
      when: [
        'I enter invalid username "wronguser"',
        'I enter invalid password "wrongpass"',
        'I click the login button',
      ],
      then: [
        'I should see an error message',
        'I should remain on the login page',
      ],
    };
  }

  /**
   * Generate a navigation scenario
   */
  private generateNavigationScenario(
    featureTitle: string,
    criteria: string,
    scenarioNumber: number
  ): GherkinScenario {
    const lowerCriteria = criteria.toLowerCase();
    
    if (lowerCriteria.includes('product') || lowerCriteria.includes('listing')) {
      return {
        feature: featureTitle,
        scenario: `Scenario ${scenarioNumber}: ${criteria}`,
        given: ['I am on the home page'],
        when: ['I click on the products link'],
        then: [
          'I should be navigated to the product listing page',
          'I should see a list of products',
        ],
      };
    }
    
    return {
      feature: featureTitle,
      scenario: `Scenario ${scenarioNumber}: ${criteria}`,
      given: ['I am on the home page'],
      when: ['I click on the login link'],
      then: [
        'I should be navigated to the login page',
        'I should see the login form',
      ],
    };
  }

  /**
   * Generate a logout scenario
   */
  private generateLogoutScenario(
    featureTitle: string,
    criteria: string,
    scenarioNumber: number
  ): GherkinScenario {
    return {
      feature: featureTitle,
      scenario: `Scenario ${scenarioNumber}: ${criteria}`,
      given: ['I am logged in as "testuser"', 'I am on the dashboard page'],
      when: ['I click the logout button'],
      then: [
        'I should be logged out',
        'I should be redirected to the home page',
      ],
    };
  }

  /**
   * Generate a shopping cart action scenario
   */
  private generateCartActionScenario(
    featureTitle: string,
    criteria: string,
    scenarioNumber: number
  ): GherkinScenario {
    const lowerCriteria = criteria.toLowerCase();
    
    if (lowerCriteria.includes('add')) {
      return {
        feature: featureTitle,
        scenario: `Scenario ${scenarioNumber}: ${criteria}`,
        given: ['I am on the product page for "Test Product"'],
        when: [
          'I click the "Add to Cart" button',
        ],
        then: [
          'I should see a success message "Product added to cart"',
          'The cart count should increase by 1',
        ],
      };
    }
    
    return this.generateSuccessScenario(featureTitle, criteria, scenarioNumber);
  }

  /**
   * Generate a cart view/remove scenario
   */
  private generateCartViewRemoveScenario(
    featureTitle: string,
    criteria: string,
    scenarioNumber: number
  ): GherkinScenario {
    const lowerCriteria = criteria.toLowerCase();
    
    if (lowerCriteria.includes('view')) {
      return {
        feature: featureTitle,
        scenario: `Scenario ${scenarioNumber}: ${criteria}`,
        given: ['I have items in my shopping cart'],
        when: ['I navigate to the cart page'],
        then: [
          'I should see all items in my cart',
          'I should see the total price',
        ],
      };
    }
    
    if (lowerCriteria.includes('remove')) {
      return {
        feature: featureTitle,
        scenario: `Scenario ${scenarioNumber}: ${criteria}`,
        given: ['I am on the cart page', 'I have "Test Product" in my cart'],
        when: ['I click the remove button for "Test Product"'],
        then: [
          'The item should be removed from the cart',
          'The cart count should decrease by 1',
        ],
      };
    }
    
    return this.generateSuccessScenario(featureTitle, criteria, scenarioNumber);
  }

  /**
   * Format test cases as Gherkin text
   */
  formatAsGherkin(testCase: TestCase): string {
    let gherkinText = `Feature: ${testCase.feature}\n\n`;

    testCase.scenarios.forEach((scenario) => {
      gherkinText += `  ${scenario.scenario}\n`;
      
      scenario.given.forEach((step) => {
        gherkinText += `    Given ${step}\n`;
      });
      
      scenario.when.forEach((step) => {
        gherkinText += `    When ${step}\n`;
      });
      
      scenario.then.forEach((step) => {
        gherkinText += `    Then ${step}\n`;
      });
      
      gherkinText += '\n';
    });

    return gherkinText;
  }
}
