#!/usr/bin/env node

import * as path from 'path';
import { TestGeneratorOrchestrator } from './orchestrator';

/**
 * Main entry point for the test generator CLI
 */
function main() {
  console.log('🚀 Playwright AI Test Generator\n');

  const args = process.argv.slice(2);
  const requirementPath = args[0] || path.join(__dirname, '../requirement.json');
  const outputDir = args[1] || path.join(__dirname, '../tests');

  try {
    const orchestrator = new TestGeneratorOrchestrator();
    orchestrator.generateTestsFromRequirement(requirementPath, outputDir);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
