import type { Lesson } from './types';

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
  const lesson = JSON.parse(new TextDecoder().decode(bytes)) as Lesson;
  const validId = (value: unknown) => typeof value === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(value);
  const validSource = typeof lesson.sourceUrl === 'string' && (
    lesson.sourceUrl === '' || /^https?:\/\/[^\s]+$/i.test(lesson.sourceUrl)
  );
  if (
    lesson.version !== 1 ||
    !validId(lesson.id) ||
    typeof lesson.title !== 'string' ||
    lesson.title.length > 90 ||
    !validSource ||
    lesson.prompts.length > 3 ||
    !Array.isArray(lesson.prompts) ||
    lesson.prompts.some((prompt) =>
      !prompt || !validId(prompt.id) || !['predict', 'work', 'check'].includes(prompt.kind) ||
      typeof prompt.question !== 'string' || prompt.question.length > 500 ||
      typeof prompt.reveal !== 'string' || prompt.reveal.length > 700
    )
  ) {
    throw new Error('This lesson link is not in a supported format.');
  }
  return lesson;
}

export function lessonUrl(lesson: Lesson): string {
  return `${location.origin}${location.pathname}#/lesson/${encodeLesson(lesson)}`;
}
