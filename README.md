# Playwright AI Test Generator

An AI-powered tool that automatically generates Playwright E2E tests from Jira-like requirements. This project reads requirement specifications in JSON format (mocking Jira API output), converts them into Gherkin test cases (Given/When/Then format), and then generates executable Playwright test scripts.

## Features

- 📖 **Reads requirements** from JSON files (simulating Jira API output)
- 🤖 **AI-powered generation** of Gherkin test cases from acceptance criteria
- 🎭 **Automatic conversion** of Gherkin scenarios to Playwright tests
- ✅ **TypeScript-based** for type safety and better developer experience
- 🚀 **Easy to use** with simple CLI commands

## Project Structure

```
playwright-ai-gen/
├── src/
│   ├── types.ts                  # TypeScript interfaces and types
│   ├── gherkinGenerator.ts       # AI module to generate Gherkin from requirements
│   ├── playwrightGenerator.ts    # Converts Gherkin to Playwright tests
│   ├── orchestrator.ts           # Main orchestration logic
│   └── index.ts                  # CLI entry point
├── tests/
│   ├── *.spec.ts                 # Generated Playwright tests
│   └── *.feature                 # Generated Gherkin files
├── requirement.json              # Sample requirement (mocking Jira API)
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies and scripts
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/anthonydieu18/playwright-ai-gen.git
cd playwright-ai-gen
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npm run playwright:install
```

## Usage

### Generate Tests from Requirements

The project includes a sample `requirement.json` file. To generate tests from it:

```bash
npm run generate
```

This will:
1. Read the `requirement.json` file
2. Generate Gherkin test cases
3. Convert them to Playwright test scripts
4. Save both `.feature` files and `.spec.ts` files in the `tests/` directory

### Custom Requirements

You can provide your own requirement JSON file:

```bash
npm run build
node dist/index.js path/to/your/requirement.json path/to/output/directory
```

### Requirement JSON Format

The requirement JSON should follow this structure (mocking Jira API output):

```json
{
  "id": "PROJ-123",
  "title": "Feature Name",
  "description": "Feature description",
  "acceptanceCriteria": [
    "Criterion 1",
    "Criterion 2",
    "Criterion 3"
  ],
  "priority": "High",
  "assignee": "Developer Name",
  "status": "In Progress"
}
```

### Run Generated Tests

To run the generated Playwright tests:

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui
```

## How It Works

### 1. AI-Powered Gherkin Generation

The `GherkinGenerator` class analyzes acceptance criteria and intelligently generates Gherkin scenarios:

- **Pattern Recognition**: Identifies keywords like "error", "navigate", "logout" to determine scenario type
- **Smart Mapping**: Maps criteria to appropriate Given/When/Then steps
- **Context Awareness**: Generates relevant setup and teardown steps

### 2. Playwright Test Conversion

The `PlaywrightGenerator` class converts Gherkin steps to Playwright commands:

- **Step Translation**: Converts natural language to Playwright API calls
- **Selector Generation**: Automatically generates appropriate selectors
- **Assertion Mapping**: Translates expected outcomes to Playwright assertions

### 3. Example Output

**Input (requirement.json):**
```json
{
  "acceptanceCriteria": [
    "User can enter valid credentials and successfully log in"
  ]
}
```

**Generated Gherkin:**
```gherkin
Scenario 1: User can enter valid credentials and successfully log in
  Given I am on the login page
  When I enter valid username "testuser"
  And I enter valid password "testpass123"
  And I click the login button
  Then I should be redirected to the dashboard
  And I should see a welcome message
```

**Generated Playwright Test:**
```typescript
test('User can enter valid credentials and successfully log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="username"]', "testuser");
  await page.fill('input[name="password"]', "testpass123");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(new RegExp('.*/dashboard.*'));
  await expect(page.locator('body')).toContainText('Welcome');
});
```

## Development

### Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Project Scripts

- `npm run build` - Compile TypeScript
- `npm run generate` - Generate tests from requirement.json
- `npm test` - Run Playwright tests
- `npm run test:headed` - Run tests with visible browser
- `npm run test:ui` - Run tests in Playwright UI mode
- `npm run playwright:install` - Install Playwright browsers

## Technologies Used

- **TypeScript** - Type-safe development
- **Playwright** - Modern E2E testing framework
- **Node.js** - Runtime environment

## Extending the Generator

The AI module can be extended to support:

- More complex Gherkin patterns
- Additional test frameworks
- Integration with actual Jira API
- Custom step definitions
- Page Object Model generation
- Data-driven test scenarios

## License

ISC

## Author

Created as a demonstration of AI-powered test generation with Playwright.