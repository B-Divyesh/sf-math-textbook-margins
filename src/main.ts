import './styles.css';
import { decodeLesson, encodeLesson, isLessonData, LESSON_LIMITS, lessonUrl } from './codec';
import type { Lesson, MarginPrompt, PromptKind, StudentRecord } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
if (!app) throw new Error('Application root is missing.');

const DRAFT_KEY = 'mtm.teacher-draft.v1';
const THEME_KEY = 'mtm.theme';
const LINK_LIMIT = 7500;
const kindLabels: Record<PromptKind, string> = {
  predict: 'Make a prediction',
  work: 'Sketch a step',
  check: 'Check the idea',
};

function id(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function newPrompt(kind: PromptKind): MarginPrompt {
  const examples: Record<PromptKind, [string, string]> = {
    predict: ['Before reading on, what do you think will happen—and why?', 'Now compare your prediction with the explanation in the source.'],
    work: ['Write or sketch the next mathematical step.', 'A useful next step is to name what stays equal before simplifying.'],
    check: ['What tempting mistake could someone make here?', 'Check the sign, the operation, and whether the result answers the original question.'],
  };
  return { id: id(), kind, question: examples[kind][0], reveal: examples[kind][1] };
}

function starterLesson(): Lesson {
  return {
    version: 1,
    id: id(),
    title: '',
    sourceLabel: '',
    sourceUrl: '',
    excerpt: '',
    instructions: 'Open the assigned page. Answer each margin before revealing the next note.',
    prompts: [newPrompt('predict'), newPrompt('work'), newPrompt('check')],
  };
}

function escapeHtml(value: string): string {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

function shell(content: string, mode = ''): string {
  return `
    <header class="site-header">
      <a class="wordmark" href="#/" aria-label="Math Textbook Margins home">
        <span aria-hidden="true" class="registration-mark">M</span>
        <span>Math Textbook<br><em>Margins</em></span>
      </a>
      <div class="header-actions">
        <span id="connection" class="connection" role="status">${navigator.onLine ? '● Online' : '◇ Offline — saved work still works'}</span>
        <button class="icon-button" id="theme-toggle" type="button" aria-label="Switch color theme">◐ <span>Theme</span></button>
      </div>
    </header>
    <main id="main" class="${mode}">${content}</main>
    <footer class="site-footer">
      <p>Private by default. Lessons and answers stay in your browser or shared link.</p>
      <nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
      <p class="art-note">Hero artwork generated for this project with Azure AI Foundry.</p>
    </footer>
    <div id="toast" class="toast" role="status" aria-live="polite"></div>
  `;
}

function wireShell(): void {
  document.querySelector('#theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
  });
  const updateConnection = () => {
    const status = document.querySelector('#connection');
    if (status) status.textContent = navigator.onLine ? '● Online' : '◇ Offline — saved work still works';
  };
  addEventListener('online', updateConnection, { once: true });
  addEventListener('offline', updateConnection, { once: true });
}

function showToast(message: string, action?: { label: string; run: () => void }): void {
  const toast = document.querySelector<HTMLDivElement>('#toast');
  if (!toast) return;
  toast.innerHTML = `${escapeHtml(message)}${action ? ` <button type="button" id="toast-action">${escapeHtml(action.label)}</button>` : ''}`;
  toast.classList.add('show');
  document.querySelector('#toast-action')?.addEventListener('click', () => {
    action?.run();
    toast.classList.remove('show');
  });
  window.setTimeout(() => toast.classList.remove('show'), 7000);
}

function renderHome(): void {
  document.title = 'Math Textbook Margins — Pause before the answer';
  app.innerHTML = shell(`
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow">A quiet layer for active math reading</p>
        <h1 id="home-title">Put the thinking <em>before</em> the answer.</h1>
        <p class="lede">Wrap any legal textbook page or PDF link with three small pauses: predict, sketch a step, and check the idea.</p>
        <div class="hero-actions">
          <a class="button primary" href="#/build">Make a lesson <span aria-hidden="true">→</span></a>
          <button class="button secondary" id="try-sample" type="button">Try a student lesson</button>
        </div>
        <p class="microcopy">Free. No account. No textbook upload. Student answers stay on their device.</p>
      </div>
      <figure class="hero-art">
        <picture>
          <source type="image/webp" srcset="/assets/margin-press-hero-768.webp 768w, /assets/margin-press-hero.webp 1280w" sizes="(max-width: 800px) 92vw, 47vw">
          <img src="/assets/margin-press-hero.webp" width="1280" height="853" alt="Risograph collage of a math workbook surrounded by prediction notes and pencil geometry" decoding="async" fetchpriority="high">
        </picture>
      </figure>
    </section>
    <section class="how" aria-labelledby="how-title">
      <p class="eyebrow">One reading, three margins</p>
      <h2 id="how-title">Interrupt the urge to peek.</h2>
      <ol class="three-beats">
        <li><span aria-hidden="true">01</span><h3>Predict</h3><p>Commit to an idea before the worked explanation appears.</p></li>
        <li><span aria-hidden="true">02</span><h3>Sketch</h3><p>Write the next move in words, notation, or a quick text sketch.</p></li>
        <li><span aria-hidden="true">03</span><h3>Check</h3><p>Name a misconception, then export one compact answer record.</p></li>
      </ol>
    </section>
    <section class="teacher-note" aria-labelledby="teacher-title">
      <div><p class="eyebrow">Made to sit beside your material</p><h2 id="teacher-title">Keep the textbook. Add the pause.</h2></div>
      <p>Margins stores no PDF and extracts no content. Link to material you are allowed to share, add a short permitted excerpt if useful, then copy one self-contained lesson link.</p>
    </section>
  `, 'home');
  wireShell();
  document.querySelector('#try-sample')?.addEventListener('click', () => {
    const sample: Lesson = {
      version: 1,
      id: 'sample-equal-steps',
      title: 'Equal steps, equal expressions',
      sourceLabel: 'Your assigned algebra page',
      sourceUrl: '',
      excerpt: 'Imagine a balance: whatever operation is applied to one side must also be applied to the other.',
      instructions: 'Read the short note, then answer each margin without peeking ahead.',
      prompts: [
        { id: 'sample-predict', kind: 'predict', question: 'If we add 4 to only the left side of an equation, will it still be true? Explain your prediction.', reveal: 'An equation behaves like a balance. Changing only one side usually breaks the equality.' },
        { id: 'sample-work', kind: 'work', question: 'For x − 4 = 9, write the next step that keeps both sides equal.', reveal: 'Add 4 to both sides: x − 4 + 4 = 9 + 4.' },
        { id: 'sample-check', kind: 'check', question: 'A learner writes x = 9 − 4. What idea did they miss?', reveal: 'They reversed the operation on only one side. The same operation must be applied to both sides.' },
      ],
    };
    location.hash = `/lesson/${encodeLesson(sample)}`;
  });
}

function loadDraft(): { lesson: Lesson; recovered: boolean } {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (stored === null) return { lesson: starterLesson(), recovered: false };
    const parsed = JSON.parse(stored) as unknown;
    if (isLessonData(parsed)) return { lesson: parsed, recovered: false };
  } catch {
    // A partial browser write or stale schema should never strand the builder.
  }
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* Storage may be unavailable. */ }
  return { lesson: starterLesson(), recovered: true };
}

function linkLimitGuidance(lesson: Lesson): { message: string; selector: string } {
  const candidates = [
    { label: 'source link', selector: '[name="sourceUrl"]', clear: (item: Lesson) => ({ ...item, sourceUrl: '' }) },
    { label: 'permitted excerpt', selector: '[name="excerpt"]', clear: (item: Lesson) => ({ ...item, excerpt: '' }) },
    { label: 'reveal notes', selector: `[name="reveal-${lesson.prompts[0]?.id}"]`, clear: (item: Lesson) => ({ ...item, prompts: item.prompts.map((prompt) => ({ ...prompt, reveal: '' })) }) },
    { label: 'student directions', selector: '[name="instructions"]', clear: (item: Lesson) => ({ ...item, instructions: '' }) },
    { label: 'student prompts', selector: `[name="question-${lesson.prompts[0]?.id}"]`, clear: (item: Lesson) => ({ ...item, prompts: item.prompts.map((prompt) => ({ ...prompt, question: '' })) }) },
    { label: 'source label', selector: '[name="sourceLabel"]', clear: (item: Lesson) => ({ ...item, sourceLabel: '' }) },
    { label: 'lesson title', selector: '[name="title"]', clear: (item: Lesson) => ({ ...item, title: '' }) },
  ].map((candidate) => ({
    ...candidate,
    reduction: lessonUrl(lesson).length - lessonUrl(candidate.clear(lesson)).length,
  })).filter((candidate) => candidate.reduction > 0)
    .sort((a, b) => b.reduction - a.reduction);

  let shortened = lesson;
  const labels: string[] = [];
  for (const candidate of candidates) {
    shortened = candidate.clear(shortened);
    labels.push(candidate.label);
    if (lessonUrl(shortened).length <= LINK_LIMIT) break;
  }
  const readable = labels.length > 1
    ? `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`
    : labels[0] ?? 'lesson content';
  return {
    message: `This lesson is too long for a reliable link. Shorten the ${readable}.`,
    selector: candidates[0]?.selector ?? '[name="title"]',
  };
}

function renderBuilder(): void {
  document.title = 'Build a lesson — Math Textbook Margins';
  const draft = loadDraft();
  let lesson = draft.lesson;

  const draw = () => {
    app.innerHTML = shell(`
      <section class="builder-intro">
        <a class="back-link" href="#/">← Home</a>
        <p class="eyebrow">Teacher composing table</p>
        <h1>Build a margin lesson.</h1>
        <p>Link to material you may share. Students must answer each prompt before the note underneath is revealed.</p>
        ${draft.recovered ? '<p class="recovery-note" role="status">◇ A saved draft could not be read, so a fresh starter lesson is ready. Your builder is safe to use.</p>' : ''}
      </section>
      <form id="lesson-form" class="builder-form" novalidate>
        <section class="lesson-details" aria-labelledby="details-title">
          <div class="section-heading"><span>01</span><div><h2 id="details-title">Name the reading</h2><p>Nothing is uploaded. The source opens separately.</p></div></div>
          <div class="field-grid">
            <label>Lesson title <span aria-hidden="true">*</span><input name="title" required maxlength="${LESSON_LIMITS.title}" value="${escapeHtml(lesson.title)}" autocomplete="off"></label>
            <label>Source label <input name="sourceLabel" maxlength="80" value="${escapeHtml(lesson.sourceLabel)}" placeholder="e.g. Chapter 4, page 82"></label>
            <label class="wide">Source link <span class="optional">optional</span><input name="sourceUrl" type="url" inputmode="url" value="${escapeHtml(lesson.sourceUrl)}" placeholder="https://…" aria-describedby="source-help"></label>
            <p id="source-help" class="field-help wide">Use a school-approved or public link. Margins never copies or hosts the source.</p>
            <label class="wide">Short permitted excerpt <span class="optional">optional</span><textarea name="excerpt" rows="3" maxlength="700" aria-describedby="excerpt-help">${escapeHtml(lesson.excerpt)}</textarea></label>
            <p id="excerpt-help" class="field-help wide">Only paste text you own or are allowed to reproduce.</p>
            <label class="wide">Student directions <textarea name="instructions" rows="2" maxlength="300">${escapeHtml(lesson.instructions)}</textarea></label>
          </div>
        </section>
        <section class="prompt-editor" aria-labelledby="prompts-title">
          <div class="section-heading"><span>02</span><div><h2 id="prompts-title">Set the pauses</h2><p>Prompt, response, then reveal. Reorder with the arrow buttons.</p></div></div>
          <div id="prompt-list">
            ${lesson.prompts.length ? lesson.prompts.map((prompt, index) => promptEditor(prompt, index, lesson.prompts.length)).join('') : `
              <div class="empty-state"><span aria-hidden="true">□</span><h3>The margin is blank.</h3><p>Add a prediction, a worked step, or a check to make this lesson useful.</p></div>`}
          </div>
          <div class="add-prompt" aria-label="Add a prompt">
            <span>Add:</span>
            <button type="button" data-add="predict" ${lesson.prompts.length >= 3 ? 'disabled' : ''}>+ Prediction</button>
            <button type="button" data-add="work" ${lesson.prompts.length >= 3 ? 'disabled' : ''}>+ Worked step</button>
            <button type="button" data-add="check" ${lesson.prompts.length >= 3 ? 'disabled' : ''}>+ Misconception check</button>
            ${lesson.prompts.length >= 3 ? '<small>Three pauses keep the exported answer record to one page.</small>' : ''}
          </div>
        </section>
        <section class="publish" aria-labelledby="publish-title">
          <div><p class="eyebrow">03 · Hand it over</p><h2 id="publish-title">Create the student link.</h2><p>The lesson is packed into the link itself. Anyone with it can open the prompts; only the student’s browser keeps their answers.</p></div>
          <button class="button primary large" type="submit">Create student link <span aria-hidden="true">→</span></button>
          <p id="form-error" class="form-error" role="alert"></p>
        </section>
      </form>
    `, 'builder');
    wireShell();
    wireBuilder();
  };

  const saveFields = () => {
    const form = document.querySelector<HTMLFormElement>('#lesson-form');
    if (!form) return;
    const data = new FormData(form);
    lesson = {
      ...lesson,
      title: String(data.get('title') ?? '').trim(),
      sourceLabel: String(data.get('sourceLabel') ?? '').trim(),
      sourceUrl: String(data.get('sourceUrl') ?? '').trim(),
      excerpt: String(data.get('excerpt') ?? '').trim(),
      instructions: String(data.get('instructions') ?? '').trim(),
      prompts: lesson.prompts.map((prompt) => ({
        ...prompt,
        kind: String(data.get(`kind-${prompt.id}`) ?? prompt.kind) as PromptKind,
        question: String(data.get(`question-${prompt.id}`) ?? '').trim(),
        reveal: String(data.get(`reveal-${prompt.id}`) ?? '').trim(),
      })),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(lesson));
  };

  const wireBuilder = () => {
    const form = document.querySelector<HTMLFormElement>('#lesson-form');
    form?.addEventListener('input', saveFields);
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      saveFields();
      const error = document.querySelector<HTMLParagraphElement>('#form-error');
      const missingPrompt = lesson.prompts.find((prompt) => !prompt.question || !prompt.reveal);
      let message = '';
      if (!lesson.title) message = 'Add a lesson title before creating the link.';
      else if (!lesson.prompts.length) message = 'Add at least one prompt before creating the link.';
      else if (missingPrompt) message = 'Each pause needs both a student prompt and a reveal note.';
      else if (lesson.sourceUrl && !/^https?:\/\//i.test(lesson.sourceUrl)) message = 'Use a complete source link beginning with http:// or https://.';
      if (message) {
        if (error) error.textContent = `! ${message}`;
        document.querySelector<HTMLElement>(!lesson.title ? '[name="title"]' : missingPrompt ? `[name="question-${missingPrompt.id}"]` : '[name="sourceUrl"]')?.focus();
        return;
      }
      const url = lessonUrl(lesson);
      if (url.length > LINK_LIMIT) {
        const guidance = linkLimitGuidance(lesson);
        if (error) error.textContent = `! ${guidance.message}`;
        document.querySelector<HTMLElement>(guidance.selector)?.focus();
        return;
      }
      try {
        await navigator.clipboard.writeText(url);
        showShareDialog(url, true);
      } catch {
        showShareDialog(url, false);
      }
    });
    document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((button) => button.addEventListener('click', () => {
      saveFields();
      lesson.prompts.push(newPrompt(button.dataset.add as PromptKind));
      localStorage.setItem(DRAFT_KEY, JSON.stringify(lesson));
      draw();
      document.querySelector<HTMLElement>(`[name="question-${lesson.prompts.at(-1)?.id}"]`)?.focus();
    }));
    document.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach((button) => button.addEventListener('click', () => {
      saveFields();
      const prompt = lesson.prompts.find((item) => item.id === button.dataset.remove);
      if (!prompt || !confirm(`Remove “${prompt.question.slice(0, 50) || kindLabels[prompt.kind]}”?`)) return;
      lesson.prompts = lesson.prompts.filter((item) => item.id !== prompt.id);
      localStorage.setItem(DRAFT_KEY, JSON.stringify(lesson));
      draw();
      showToast('Prompt removed.');
    }));
    document.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((button) => button.addEventListener('click', () => {
      saveFields();
      const from = lesson.prompts.findIndex((item) => item.id === button.dataset.prompt);
      const to = from + Number(button.dataset.move);
      if (from < 0 || to < 0 || to >= lesson.prompts.length) return;
      [lesson.prompts[from], lesson.prompts[to]] = [lesson.prompts[to], lesson.prompts[from]];
      localStorage.setItem(DRAFT_KEY, JSON.stringify(lesson));
      draw();
      document.querySelector<HTMLElement>(`[data-prompt-card="${button.dataset.prompt}"]`)?.focus();
    }));
  };

  draw();
}

function promptEditor(prompt: MarginPrompt, index: number, total: number): string {
  return `
    <fieldset class="prompt-slip" data-prompt-card="${prompt.id}" tabindex="-1">
      <legend><span>${String(index + 1).padStart(2, '0')}</span> Pause ${index + 1}</legend>
      <div class="prompt-toolbar">
        <label>Prompt type<select name="kind-${prompt.id}">
          ${Object.entries(kindLabels).map(([value, label]) => `<option value="${value}" ${prompt.kind === value ? 'selected' : ''}>${label}</option>`).join('')}
        </select></label>
        <div class="move-buttons" aria-label="Move pause ${index + 1}">
          <button type="button" data-move="-1" data-prompt="${prompt.id}" ${index === 0 ? 'disabled' : ''} aria-label="Move pause ${index + 1} up">↑</button>
          <button type="button" data-move="1" data-prompt="${prompt.id}" ${index === total - 1 ? 'disabled' : ''} aria-label="Move pause ${index + 1} down">↓</button>
          <button class="remove" type="button" data-remove="${prompt.id}" aria-label="Remove pause ${index + 1}">Remove</button>
        </div>
      </div>
      <label>Student prompt <span aria-hidden="true">*</span><textarea name="question-${prompt.id}" required rows="2" maxlength="${LESSON_LIMITS.question}" aria-describedby="question-limit-${prompt.id}">${escapeHtml(prompt.question)}</textarea><span id="question-limit-${prompt.id}" class="field-limit">Up to ${LESSON_LIMITS.question} characters so a three-pause record prints on one A4 page.</span></label>
      <label>Note revealed after they answer <span aria-hidden="true">*</span><textarea name="reveal-${prompt.id}" required rows="3" maxlength="700">${escapeHtml(prompt.reveal)}</textarea></label>
    </fieldset>
  `;
}

function showShareDialog(url: string, copied: boolean): void {
  const dialog = document.createElement('dialog');
  dialog.className = 'share-dialog';
  dialog.innerHTML = `
    <form method="dialog">
      <button class="dialog-close" aria-label="Close share lesson dialog">×</button>
      <p class="eyebrow">${copied ? '✓ Link copied' : 'Lesson ready'}</p>
      <h2>Hand this to students.</h2>
      <p>The prompts are part of this link. Their answers are not.</p>
      <label>Student lesson link<textarea id="share-url" readonly rows="4">${escapeHtml(url)}</textarea></label>
      <div class="dialog-actions">
        <button type="button" id="copy-share" class="button secondary">Copy link</button>
        <a class="button primary" href="${escapeHtml(url)}">Preview lesson →</a>
      </div>
    </form>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  dialog.showModal();
  document.querySelector('#copy-share')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(url);
    showToast('Student link copied.');
  });
}

function studentStorageKey(lesson: Lesson): string {
  return `mtm.student.${lesson.id}.v1`;
}

function renderStudent(encoded: string): void {
  let lesson: Lesson;
  try {
    lesson = decodeLesson(decodeURIComponent(encoded));
  } catch {
    renderBrokenLesson();
    return;
  }
  document.title = `${lesson.title} — Math Textbook Margins`;
  let record: StudentRecord;
  try {
    record = JSON.parse(localStorage.getItem(studentStorageKey(lesson)) ?? '') as StudentRecord;
    if (!record.responses || !Array.isArray(record.revealed)) throw new Error();
  } catch {
    record = { name: '', responses: {}, revealed: [], updatedAt: new Date().toISOString() };
  }

  const save = () => {
    record.updatedAt = new Date().toISOString();
    localStorage.setItem(studentStorageKey(lesson), JSON.stringify(record));
  };
  const draw = () => {
    const complete = lesson.prompts.length > 0 && lesson.prompts.every((prompt) => record.revealed.includes(prompt.id));
    const progress = lesson.prompts.filter((prompt) => record.revealed.includes(prompt.id)).length;
    app.innerHTML = shell(`
      <div class="student-layout">
        <aside class="source-rail" aria-labelledby="source-title">
          <a class="back-link" href="#/">← Margins home</a>
          <p class="eyebrow">Assigned reading</p>
          <h2 id="source-title">${escapeHtml(lesson.sourceLabel || 'Your teacher’s source')}</h2>
          ${lesson.sourceUrl ? `<a class="button source-link" href="${escapeHtml(lesson.sourceUrl)}" target="_blank" rel="noopener noreferrer">Open source ↗</a>` : '<p class="source-note">Use the source your teacher gave you.</p>'}
          ${lesson.excerpt ? `<blockquote>${escapeHtml(lesson.excerpt)}</blockquote>` : ''}
          <p class="privacy-note"><strong>Private:</strong> your answers stay in this browser until you print or save them.</p>
        </aside>
        <section class="lesson-sheet" aria-labelledby="lesson-title">
          <div class="lesson-heading">
            <p class="eyebrow">Math margin · ${progress} of ${lesson.prompts.length} revealed</p>
            <h1 id="lesson-title">${escapeHtml(lesson.title)}</h1>
            ${lesson.instructions ? `<p class="lesson-directions">${escapeHtml(lesson.instructions)}</p>` : ''}
            <label class="student-name">Your name <input id="student-name" autocomplete="name" maxlength="80" value="${escapeHtml(record.name)}"></label>
          </div>
          <ol class="progress-list" aria-label="Lesson progress">
            ${lesson.prompts.map((prompt, index) => {
              const revealed = record.revealed.includes(prompt.id);
              const answered = Boolean(record.responses[prompt.id]?.trim());
              const unlocked = index === 0 || record.revealed.includes(lesson.prompts[index - 1].id);
              const symbol = revealed ? '✓' : answered ? '◒' : '○';
              const state = revealed ? 'Revealed' : answered ? 'Answered' : unlocked ? 'To do' : 'Locked';
              return `<li class="${revealed ? 'done' : answered ? 'answered' : ''} ${unlocked ? '' : 'locked'}"><span aria-hidden="true">${symbol}</span><span>${index + 1}. ${kindLabels[prompt.kind]}</span><small>${state}</small></li>`;
            }).join('')}
          </ol>
          <div class="student-prompts">
            ${lesson.prompts.map((prompt, index) => studentPrompt(prompt, index, lesson, record)).join('')}
          </div>
          ${complete ? `
            <section class="finish" aria-labelledby="finish-title">
              <span aria-hidden="true">✓</span><div><p class="eyebrow">Margin complete</p><h2 id="finish-title" tabindex="-1">Keep a record of your thinking.</h2><p>Print this page or choose “Save as PDF.” Only your name, prompts, and answers appear in the record.</p></div>
              <button class="button primary" id="export-record" type="button">Print / save answer record</button>
              <button class="button text-button" id="clear-record" type="button">Clear my answers</button>
            </section>` : ''}
        </section>
      </div>
    `, 'student');
    wireShell();
    wireStudent();
    if (complete) document.body.classList.add('lesson-complete'); else document.body.classList.remove('lesson-complete');
  };

  const wireStudent = () => {
    document.querySelector<HTMLInputElement>('#student-name')?.addEventListener('input', (event) => {
      record.name = (event.currentTarget as HTMLInputElement).value;
      save();
    });
    document.querySelectorAll<HTMLTextAreaElement>('[data-response]').forEach((textarea) => textarea.addEventListener('input', () => {
      record.responses[textarea.dataset.response ?? ''] = textarea.value;
      save();
      const reveal = document.querySelector<HTMLButtonElement>(`[data-reveal="${textarea.dataset.response}"]`);
      if (reveal) reveal.disabled = !textarea.value.trim();
      const state = document.querySelector(`[data-state="${textarea.dataset.response}"]`);
      if (state && textarea.value.trim()) state.textContent = '◒ Answered — note ready';
      else if (state) state.textContent = '○ Write before revealing';
    }));
    document.querySelectorAll<HTMLButtonElement>('[data-reveal]').forEach((button) => button.addEventListener('click', () => {
      const promptId = button.dataset.reveal ?? '';
      if (!record.responses[promptId]?.trim()) return;
      record.revealed.push(promptId);
      record.revealed = [...new Set(record.revealed)];
      save();
      draw();
      const index = lesson.prompts.findIndex((prompt) => prompt.id === promptId);
      const next = lesson.prompts[index + 1];
      (next ? document.querySelector<HTMLElement>(`[data-card="${next.id}"]`) : document.querySelector<HTMLElement>('#finish-title'))?.focus();
    }));
    document.querySelector('#export-record')?.addEventListener('click', () => window.print());
    document.querySelector('#clear-record')?.addEventListener('click', () => {
      if (!confirm(`Clear all answers for “${lesson.title}”?`)) return;
      const previous = structuredClone(record);
      record = { name: '', responses: {}, revealed: [], updatedAt: new Date().toISOString() };
      save();
      draw();
      showToast('Answers cleared.', { label: 'Undo', run: () => { record = previous; save(); draw(); } });
    });
  };
  draw();
}

function studentPrompt(prompt: MarginPrompt, index: number, lesson: Lesson, record: StudentRecord): string {
  const unlocked = index === 0 || record.revealed.includes(lesson.prompts[index - 1].id);
  if (!unlocked) return '';
  const revealed = record.revealed.includes(prompt.id);
  const response = record.responses[prompt.id] ?? '';
  return `
    <article class="student-prompt ${revealed ? 'is-revealed' : ''}" data-card="${prompt.id}" tabindex="-1">
      <header><span class="step-number">${String(index + 1).padStart(2, '0')}</span><div><p>${escapeHtml(kindLabels[prompt.kind])}</p><span data-state="${prompt.id}">${revealed ? '✓ Revealed' : response.trim() ? '◒ Answered — note ready' : '○ Write before revealing'}</span></div></header>
      <h2>${escapeHtml(prompt.question)}</h2>
      <label>Your response<textarea data-response="${prompt.id}" rows="5" maxlength="${LESSON_LIMITS.response}" aria-describedby="response-limit-${prompt.id}" ${revealed ? 'readonly' : ''}>${escapeHtml(response)}</textarea><span id="response-limit-${prompt.id}" class="field-limit">Up to ${LESSON_LIMITS.response} characters so your answer record stays on one A4 page.</span></label>
      <div class="print-response"><strong>Your response:</strong> ${escapeHtml(response)}</div>
      ${revealed ? `<section class="reveal-note" aria-label="Teacher note"><p class="eyebrow">✓ Now reveal</p><p>${escapeHtml(prompt.reveal)}</p></section>` : `<button class="button reveal-button" data-reveal="${prompt.id}" type="button" ${response.trim() ? '' : 'disabled'}>Reveal the note underneath ↓</button>`}
    </article>
  `;
}

function renderBrokenLesson(): void {
  document.title = 'Lesson link problem — Math Textbook Margins';
  app.innerHTML = shell(`
    <section class="error-page">
      <span aria-hidden="true">!</span>
      <p class="eyebrow">Lesson link problem</p>
      <h1>This margin could not be opened.</h1>
      <p>The link may be incomplete or from an unsupported version. Ask your teacher to copy the complete link again.</p>
      <a class="button primary" href="#/">Go to Margins home</a>
    </section>`);
  wireShell();
}

function route(): void {
  document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((dialog) => dialog.close());
  window.scrollTo(0, 0);
  const hash = location.hash.slice(1) || '/';
  if (hash === '/build') renderBuilder();
  else if (hash.startsWith('/lesson/')) renderStudent(hash.slice('/lesson/'.length));
  else renderHome();
}

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;
addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
