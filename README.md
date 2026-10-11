# Probability Lab

Interactive lessons for the [MIT 6.041SC — Probabilistic Systems Analysis and Applied Probability](https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/) curriculum, built for short sessions on a phone.

**Live:** https://mayank64ce.github.io/probability-lab/

Lessons teach by guided discovery rather than exposition: you commit to an answer before anything is explained, manipulate a model to find the relationship yourself, and only then meet the formula. Every lesson ends with an unassisted problem, and no amount of lesson-completing on its own counts as mastery.

## Status

**Phase 1 — functional vertical slice.** One complete lesson (CP-01, conditional probability), the full engine behind it, and local progress that survives closing the tab.

| Phase | Scope                                        | State       |
| ----- | -------------------------------------------- | ----------- |
| 1     | App shell, dashboard, CP-01, local progress  | Complete    |
| 2     | Data-driven exercise bank, practice sessions | Not started |
| 3     | Smart practice and spaced review surfacing   | Not started |
| 4     | All of Unit I                                | Not started |
| 5     | Units II–IV                                  | Not started |
| 6     | Optional AI tutor                            | Not started |

The Practice screen says plainly that its exercise bank does not exist yet rather than showing a mock session. Review is wired to real attempt data and is simply sparse until more content lands.

## Running it

```bash
npm install
npm run dev          # http://localhost:5173/probability-lab/
```

| Script              | Does                                         |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                   |
| `npm test`          | Unit and integration tests (Vitest)          |
| `npm run typecheck` | TypeScript, no emit                          |
| `npm run build`     | Typecheck then production build into `dist/` |
| `npm run preview`   | Serve the production build locally           |
| `npm run format`    | Prettier over the repo                       |

## Architecture

Content is **data**, never components. A lesson is a plain object validated by the types in `src/content/schema.ts`, and the generic engine renders it — which is what lets later phases add hundreds of exercises without touching React.

```text
src/
├── app/            Router, theme, and the progress context
├── components/
│   ├── lessons/        Stage renderer
│   ├── exercises/      Multiple choice, numeric, visual, hints, feedback
│   ├── visualizations/ Keyed registry, referenced from content by string
│   └── ui/             Math (KaTeX), rich text, buttons, cards
├── engine/
│   ├── answerValidator.ts   Grading. Pure, and the sole authority on correctness
│   ├── lessonRunner.ts      Stage navigation rules
│   ├── masteryTracker.ts    Rule-based mastery states
│   ├── reviewScheduler.ts   Spaced-repetition interval ladder
│   └── selectors.ts         Derived dashboard views
├── content/mit-6041/   Lessons, as data
├── storage/            localStorage with versioned migrations
├── pages/              Dashboard, Learn, Practice, Review, Settings, Lesson
└── tests/
```

### Decisions worth knowing

- **`localStorage`, not IndexedDB.** A few thousand attempt records at most, and synchronous reads keep the UI simple. The interface in `storage/progressStore.ts` is narrow enough that swapping the backend touches one file. Migrations are versioned from day one.
- **Mastery is never granted for finishing a lesson.** Reaching `proficient` needs three independent correct answers at 75% accuracy; `mastered` additionally requires surviving a gap of a week, because recall after a delay is the thing that matters. Any miss drops the concept straight to `review-needed`.
- **Validators are pure and exhaustively tested.** Unit slips (`0.2` for a question asking a percentage) and unreduced fractions (`4/12`) get their own named feedback instead of a bare "wrong".
- **Routes are code-split** so KaTeX and its fonts — about 286 kB, pulled in only by lesson content — stay off the critical path. The initial bundle is ~94 kB gzipped.
- **`404.html` is a copy of `index.html`.** GitHub Pages has no rewrite rule, so this is what lets a deep link survive a hard refresh.

## Testing

119 tests across six files.

```bash
npm test
```

`src/tests/probabilityMath.test.ts` recomputes every number asserted in CP-01 from its stated premises rather than trusting the authored content, so a typo in a lesson fails the build. `src/tests/lessonFlow.test.tsx` drives the whole six-screen lesson in a DOM and checks that progress is restored afterwards.

## Attribution

The curriculum map follows MIT 6.041SC (Fall 2013), taught by Prof. John Tsitsiklis, MIT OpenCourseWare, used under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Every lesson, exercise, and worked solution in this repository is original work written for it. MIT course material is **linked, never reproduced**.
