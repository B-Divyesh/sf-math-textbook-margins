import type { Lesson } from './types';

// These fields appear in the printed answer record. Their caps keep a complete
// three-pause lesson reliably within its advertised single A4 page.
export const LESSON_LIMITS = {
  title: 80,
  question: 240,
  response: 240,
} as const;

const validId = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(value);

export function isLessonData(value: unknown): value is Lesson {
  if (!value || typeof value !== 'object') return false;
  const lesson = value as Record<string, unknown>;
  if (
    lesson.version !== 1 ||
    !validId(lesson.id) ||
    typeof lesson.title !== 'string' || lesson.title.length > LESSON_LIMITS.title ||
    typeof lesson.sourceLabel !== 'string' || lesson.sourceLabel.length > 80 ||
    typeof lesson.sourceUrl !== 'string' ||
    typeof lesson.excerpt !== 'string' || lesson.excerpt.length > 700 ||
    typeof lesson.instructions !== 'string' || lesson.instructions.length > 300 ||
    !Array.isArray(lesson.prompts) || lesson.prompts.length > 3
  ) return false;

  const ids = new Set<string>();
  return lesson.prompts.every((value) => {
    if (!value || typeof value !== 'object') return false;
    const prompt = value as Record<string, unknown>;
    if (
      !validId(prompt.id) || ids.has(prompt.id) ||
      !['predict', 'work', 'check'].includes(String(prompt.kind)) ||
      typeof prompt.question !== 'string' || prompt.question.length > LESSON_LIMITS.question ||
      typeof prompt.reveal !== 'string' || prompt.reveal.length > 700
    ) return false;
    ids.add(prompt.id);
    return true;
  });
}

export function encodeLesson(lesson: Lesson): string {
  const bytes = new TextEncoder().encode(JSON.stringify(lesson));
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function decodeLesson(encoded: string): Lesson {
  const base64 = encoded.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const lesson = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  if (
    !isLessonData(lesson) ||
    (lesson.sourceUrl !== '' && !/^https?:\/\/[^\s]+$/i.test(lesson.sourceUrl))
  ) {
    throw new Error('This lesson link is not in a supported format.');
  }
  return lesson;
}

export function lessonUrl(lesson: Lesson): string {
  return `${location.origin}${location.pathname}#/lesson/${encodeLesson(lesson)}`;
}
