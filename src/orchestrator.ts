import * as fs from 'fs';
import * as path from 'path';
import { Requirement } from './types';
import { GherkinGenerator } from './gherkinGenerator';
import { PlaywrightGenerator } from './playwrightGenerator';

/**
 * Main orchestrator for the AI-powered test generation pipeline
 */
export class TestGeneratorOrchestrator {
  private gherkinGenerator: GherkinGenerator;
  private playwrightGenerator: PlaywrightGenerator;

  constructor() {
    this.gherkinGenerator = new GherkinGenerator();
    this.playwrightGenerator = new PlaywrightGenerator();
  }

  /**
   * Read requirement from JSON file
   */
  readRequirement(filePath: string): Requirement {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Requirement;
  }

  /**
   * Generate tests from a requirement file
   */
  generateTestsFromRequirement(requirementPath: string, outputDir: string): void {
    console.log('📖 Reading requirement from:', requirementPath);
    const requirement = this.readRequirement(requirementPath);

    console.log('🤖 Generating Gherkin test cases...');
    const testCase = this.gherkinGenerator.generateTestCases(requirement);
    const gherkinText = this.gherkinGenerator.formatAsGherkin(testCase);

    // Save Gherkin file
    const gherkinOutputPath = path.join(outputDir, `${this.sanitizeFilename(requirement.id)}.feature`);
    this.ensureDirectoryExists(outputDir);
    fs.writeFileSync(gherkinOutputPath, gherkinText);
    console.log('✅ Gherkin test cases saved to:', gherkinOutputPath);
    console.log('\n' + gherkinText);

    console.log('🎭 Converting Gherkin to Playwright tests...');
    const playwrightTest = this.playwrightGenerator.generatePlaywrightTest(testCase);

    // Save Playwright test file
    const testOutputPath = path.join(outputDir, `${this.sanitizeFilename(requirement.id)}.spec.ts`);
    fs.writeFileSync(testOutputPath, playwrightTest);
    console.log('✅ Playwright test saved to:', testOutputPath);

    console.log('\n🎉 Test generation complete!');
  }

  /**
   * Ensure directory exists, create if not
   */
  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Sanitize filename
   */
  private sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  }
}
