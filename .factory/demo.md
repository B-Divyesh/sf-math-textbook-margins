# Demo sandbox

## Entry points

- Direct demo: `https://math-textbook-margins.sociobot.in/demo`
- Query entry: `https://math-textbook-margins.sociobot.in/?demo=1`

Both open the same complete algebra lesson, **Equal steps, equal expressions**.
It contains a short balance explanation and three realistic prompts: predict the
effect of changing one side, write the next equation step, and identify a common
subtraction mistake.

## Isolation and reset

Demo answers, progress, and theme use only keys beginning `demo:`. The lesson
record is `demo:mtm.student.sample-equal-steps.v1`; the demo theme is
`demo:mtm.theme`. Demo mode does not read or write the normal teacher-draft,
theme, or student-record keys.

The persistent banner says **“Demo — sample data, nothing is saved”** and offers:

- **Reset demo** — removes every `demo:` key and reloads the untouched sample.
- **Start for real** — removes every `demo:` key, then opens the real lesson
  builder at `/#/build`.

The checked browser regression creates a normal sample-record key before entering
the demo, completes part of the demo, resets it, and proves the normal record did
not change.
