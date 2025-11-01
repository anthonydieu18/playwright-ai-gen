export interface Requirement {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: string;
  assignee: string;
  status: string;
}

export interface GherkinScenario {
  feature: string;
  scenario: string;
  given: string[];
  when: string[];
  then: string[];
}

export interface TestCase {
  feature: string;
  scenarios: GherkinScenario[];
}
