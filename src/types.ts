export type PromptKind = 'predict' | 'work' | 'check';

export interface MarginPrompt {
  id: string;
  kind: PromptKind;
  question: string;
  reveal: string;
}

export interface Lesson {
  version: 1;
  id: string;
  title: string;
  sourceLabel: string;
  sourceUrl: string;
  excerpt: string;
  instructions: string;
  prompts: MarginPrompt[];
}

export interface StudentRecord {
  name: string;
  responses: Record<string, string>;
  revealed: string[];
  updatedAt: string;
}
