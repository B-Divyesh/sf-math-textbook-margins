import { describe, expect, it } from 'vitest';
import { decodeLesson, encodeLesson, isLessonData, LESSON_LIMITS } from './codec';
import type { Lesson } from './types';

const lesson: Lesson = {
  version: 1,
  id: 'lesson-1',
  title: 'Ratios & π',
  sourceLabel: 'Page 12',
  sourceUrl: 'https://example.com/math',
  excerpt: 'A permitted excerpt.',
  instructions: 'Think first.',
  prompts: [{ id: 'p1', kind: 'predict', question: 'What changes?', reveal: 'Compare both sides.' }],
};

describe('lesson link codec', () => {
  it('round trips unicode lesson data', () => {
    expect(decodeLesson(encodeLesson(lesson))).toEqual(lesson);
  });

  it('rejects malformed payloads', () => {
    expect(() => decodeLesson(encodeLesson({ ...lesson, version: 2 } as unknown as Lesson))).toThrow();
    expect(() => decodeLesson(encodeLesson({ ...lesson, prompts: [null] } as unknown as Lesson))).toThrow();
    expect(() => decodeLesson('not-json')).toThrow();
  });

  it('validates every persisted draft field before rendering', () => {
    expect(isLessonData(lesson)).toBe(true);
    expect(isLessonData({ version: 1, prompts: [null] })).toBe(false);
    expect(isLessonData({ ...lesson, sourceLabel: null })).toBe(false);
    expect(isLessonData({ ...lesson, prompts: [{ ...lesson.prompts[0], kind: 'stale-kind' }] })).toBe(false);
  });

  it('rejects unsafe identifiers and source protocols', () => {
    expect(() => decodeLesson(encodeLesson({ ...lesson, id: '\"><script>' }))).toThrow();
    expect(() => decodeLesson(encodeLesson({ ...lesson, sourceUrl: 'javascript:alert(1)' }))).toThrow();
  });

  it('rejects lesson content beyond the one-page record limits', () => {
    expect(() => decodeLesson(encodeLesson({ ...lesson, title: 'x'.repeat(LESSON_LIMITS.title + 1) }))).toThrow();
    expect(() => decodeLesson(encodeLesson({
      ...lesson,
      prompts: [{ ...lesson.prompts[0], question: 'x'.repeat(LESSON_LIMITS.question + 1) }],
    }))).toThrow();
  });
});
