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

    // Determine scenario type based on keywords
    if (lowerCriteria.includes('error') || lowerCriteria.includes('invalid')) {
      return this.generateErrorScenario(featureTitle, criteria, scenarioNumber);
    } else if (lowerCriteria.includes('navigate') || lowerCriteria.includes('access')) {
      return this.generateNavigationScenario(featureTitle, criteria, scenarioNumber);
    } else if (lowerCriteria.includes('log out') || lowerCriteria.includes('logout')) {
      return this.generateLogoutScenario(featureTitle, criteria, scenarioNumber);
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
