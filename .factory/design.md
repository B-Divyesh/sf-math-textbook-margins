# Visual thesis — Margin Press

## Direction and rationale

**Risograph tactile collage** turns the familiar physical margin—scrap paper, sticky notes, pencil work, registration marks—into the product interface. It fits a tool whose job is to slow down a digital text long enough for a learner to think on paper. The application should feel authored by a careful classroom teacher, not emitted by an LMS dashboard.

Clarity stays ahead of decoration: the student task is always the darkest, largest element; every state is named and paired with a geometric mark; texture appears at low contrast and never behind dense response text.

## Palette

The palette comes from uncoated workbook stock and two-pass riso ink:

- `paper #F3ECDC` — warm workbook stock / light background
- `sheet #FFFDF7` — clean writing surface
- `ink #172820` — very dark green-black body ink (13.1:1 on paper)
- `muted #536159` — graphite annotation (5.6:1 on paper)
- `pine #174B3A` — primary control (8.4:1 on paper)
- `coral #D9543D` — riso second pass; large marks and underlines, never sole state cue
- `mustard #E5B943` — tape/highlighter fields with dark ink
- `success #176044`, `warning #775500`, `danger #9B2C25`
- dark treatment: `night #132019`, `night-sheet #1D2C24`, text `#F6F0E2`, muted `#BAC7BF`, accent `#E9BD4B`. The dark theme keeps the paper metaphor while lowering glare.

State distinctions never depend on these colors: `○ To do`, `◒ Answered`, and `✓ Revealed` use different symbols, labels, border styles, and filled geometry.

The dark reading band explicitly uses `night #132019` behind the mustard annotation and coral folio marks, rather than inheriting the light paper token. This retains the riso contrast relationship in both system-dark and explicitly selected dark mode.

## Type

- Display: Georgia, Charter, “Times New Roman”, serif — editorial textbook voice, bold/italic used like proof annotations.
- Utility/body: Arial, Helvetica, sans-serif — a neutral, highly available workhorse that keeps labels unambiguous.
- No network fonts. Type scale: 14 / 16 / 18 / 24 / clamp(36–64). Body is 17px on narrow viewports and 16px minimum elsewhere, with 1.55 leading and a 68-character reading measure.

## Spacing and layout

An 8px base rhythm with 4px micro-spacing: 8, 12, 16, 24, 32, 48, 64, 96. Interactive targets are at least 44px. The desktop student view uses a narrow source rail and one generous response sheet; the phone view drops decorative labels, stacks all content, and makes the current task the first visible object. Paper offsets and imperfect one-pixel rules add physical depth without card-grid repetition.

The single-A4 answer record is a product constraint, not merely a print stylesheet: titles are limited to 80 characters, and each of the three questions and learner answers to 240. The composing and response labels explain the cap before content is entered. Long unbroken notation, identifiers, and pasted URL-like strings use `overflow-wrap: anywhere` in the learner view so they remain readable at 390 px.

## Interaction grammar

- Teacher mode resembles a composing table: lesson facts first, then reorderable prompt slips.
- Student mode is a gated sequence. A response unlocks the reveal action; the next prompt does not appear until the current explanation is revealed.
- Actions use verbs. Primary controls are solid pine rectangles with a 2px ink outline and a small offset shadow. Pressing them removes the offset, like a stamp meeting paper.
- Focus is a 3px mustard ring plus a dark outline. Error, saved, offline, and completion messages are announced and use symbol + copy.
- Destructive removal is confirmed; response clearing is reversible via a brief undo action.

## Motion policy

Transitions last 160–240ms and use only opacity and transform. A newly revealed explanation slides from behind its prompt by 8px, suggesting a lifted paper flap. Buttons compress by 2px. No ambient looping motion. Under `prefers-reduced-motion: reduce`, all movement becomes instant and smooth scrolling is disabled; hierarchy, borders, and labels preserve all meaning.

## Asset plan and provenance

One original hero illustration: a top-down riso collage of an open math book with a wide annotated margin, pencil geometry, a prediction slip, and a check stamp. It establishes the tactile metaphor and demonstrates “material in the middle, thinking in the margin.” It contains no readable text, logos, people, or copyrighted pages.

Prompt sheet:

> Use case: stylized-concept. Asset type: landing page hero illustration. Primary request: top-down editorial collage of an open generic mathematics workbook with an intentionally wide margin containing hand-drawn geometric arrows, a blank prediction note, one partially worked algebra line made only of abstract marks, and a round check stamp. Scene: teacher desk assembled from torn uncoated paper. Style: two-color risograph print, imperfect ink registration, halftone grain, cut-paper edges, tactile but clean. Composition: landscape, book angled gently, generous quiet negative space at upper left, no human hands. Lighting: flat printmaking light, warm and studious. Palette: dark pine ink, coral riso ink, mustard accents, cream paper. Avoid: legible words, realistic textbook content, logos, watermarks, gradients, glossy 3D, UI screenshot, copyrighted characters, brand symbols, malformed geometry.

Generation: Azure AI Foundry factory image deployment via `/opt/fleet/lib/gen-image.sh`, generated 2026-08-28. The selected original is stored in `assets/src/` with the prompt sidecar and shipped as optimized WebP. Generated imagery is disclosed in the footer.

Authored icons are simple inline SVG or CSS geometry and are original to this repository.
