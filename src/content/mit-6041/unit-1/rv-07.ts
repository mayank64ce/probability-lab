/**
 * RV-07 — Averages Under a Condition.
 *
 * Conditional expectation and the total expectation theorem. Closes Unit I by
 * joining its two halves: conditioning from the CP lessons, applied to the
 * expectations from the RV lessons.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { Lesson } from "../../schema";

/** The fair die, conditioned on showing more than 3. */
const HIGH_DIE_PMF = {
  xLabel: "Value of the die, given it exceeds 3",
  title: "Conditional distribution given X > 3",
  values: [4, 5, 6].map((x) => ({ x, p: 1 / 3 })),
};

export const RV_07: Lesson = {
  id: "RV-07",
  title: "Averages Under a Condition",
  blurb: "Take an expectation inside a condition, then rebuild the whole average from the cases.",
  conceptIds: ["conditional-expectation-discrete"],
  prerequisites: ["Expectation", "Conditional probability", "Total probability"],
  estimatedMinutes: 9,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 7: Multiple Discrete Random Variables",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-7/",
      kind: "video",
      note: "Conditional expectation and the total expectation theorem, Prof. John Tsitsiklis",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    {
      id: "rv07-predict",
      kind: "predict",
      title: "The average, given a hint",
      intro: [
        {
          type: "paragraph",
          text: "Roll one fair die. Normally $E[X] = 3.5$. This time, before you look, you are told the die shows **more than 3**.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv07-ex-predict",
        conceptIds: ["conditional-expectation-discrete"],
        objective: "Compute an expectation inside a conditioned sample space.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "What is $E[X \\mid X > 3]$?" }],
        choices: [
          { id: "a", label: "5", correct: true },
          {
            id: "b",
            label: "3.5",
            misconception:
              "3.5 is the unconditional average. The information has ruled out the faces 1, 2 and 3, so the average over what remains must be higher.",
          },
          {
            id: "c",
            label: "4",
            misconception:
              "4 is the smallest value still possible, not the average of the survivors. Three faces remain — 4, 5 and 6 — and they are equally likely.",
          },
          {
            id: "d",
            label: "4.5",
            misconception:
              "4.5 is halfway between 3 and 6. But 3 is no longer possible; the surviving range runs from 4 to 6, whose midpoint is 5.",
          },
        ],
        hints: [
          { text: "Which faces are still possible once you know the die exceeds 3?" },
          { text: "Only 4, 5 and 6 — and by symmetry they remain equally likely, at $1/3$ each." },
          { text: "$\\frac{4 + 5 + 6}{3}$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Conditioning eliminates three faces and renormalises the rest, exactly as in CP-01. The survivors keep their equal weights:",
          },
          {
            type: "math",
            tex: "p_{X \\mid X > 3}(x) = \\tfrac{1}{3} \\quad \\text{for } x = 4, 5, 6",
          },
          { type: "math", tex: "E[X \\mid X > 3] = \\frac{4 + 5 + 6}{3} = 5" },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Same machinery, new object",
          text: "A conditional expectation is an ordinary expectation taken in the conditioned world. Restrict the outcomes, renormalise the probabilities, then average as usual.",
        },
      ],
    },

    {
      id: "rv07-explore",
      kind: "explore",
      title: "The conditioned distribution",
      intro: [
        {
          type: "paragraph",
          text: "Here is what the die looks like once you know it exceeds 3: three bars instead of six, each at $1/3$ rather than $1/6$.",
        },
        {
          type: "paragraph",
          text: "The bars grew because the probability that was attached to the eliminated faces had to go somewhere. Switch on the mean.",
        },
      ],
      visualization: { key: "pmf-chart", config: { ...HIGH_DIE_PMF, offerMean: true } },
      exercise: {
        kind: "visual",
        id: "rv07-ex-explore",
        conceptIds: ["conditional-expectation-discrete"],
        objective: "Locate the balance point of a conditional distribution.",
        difficulty: 1,
        prompt: [{ type: "paragraph", text: "Select **Show the mean** to continue." }],
        visualization: "pmf-chart",
        config: {},
        solvedWhen: "mean",
        hints: [{ text: "Use the toggle above the chart." }],
        solution: [
          {
            type: "paragraph",
            text: "The balance point is 5, up from 3.5. The distribution did not merely lose its left-hand bars — the survivors each grew from $1/6$ to $1/3$ so that they still sum to 1.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "By the same argument, $E[X \\mid X \\leq 3] = \\frac{1+2+3}{3} = 2$. Two conditional averages, 2 and 5, each describing half the die.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "The pieces should rebuild the whole",
          text: "Each case is equally likely, and $\\tfrac12(2) + \\tfrac12(5) = 3.5$ — the unconditional mean. That is not a coincidence; it is the theorem this lesson is heading for.",
        },
      ],
    },

    {
      id: "rv07-formalize",
      kind: "formalize",
      title: "Conditional expectation",
      intro: [
        {
          type: "paragraph",
          text: "Given an event $A$ with $P(A) > 0$, the conditional PMF renormalises $X$ within $A$:",
        },
        {
          type: "math",
          tex: "p_{X \\mid A}(x) = \\frac{P(X = x \\text{ and } A)}{P(A)}",
        },
        { type: "paragraph", text: "and the **conditional expectation** is its balance point:" },
        { type: "math", tex: "E[X \\mid A] = \\sum_x x \\, p_{X \\mid A}(x)" },
        {
          type: "paragraph",
          text: "If $A_1, \\ldots, A_n$ partition the sample space, the **total expectation theorem** rebuilds the whole average from the parts:",
        },
        {
          type: "math",
          tex: "E[X] = \\sum_{i=1}^{n} P(A_i)\\, E[X \\mid A_i]",
        },
        {
          type: "callout",
          tone: "warning",
          title: "Weight by the cases, not equally",
          text: "Exactly as in CP-03, the weights are the probabilities of the cases. Averaging the conditional expectations without weighting them is the same error as averaging the machines' defect rates.",
        },
      ],
      visualization: { key: "pmf-chart", config: { ...HIGH_DIE_PMF, offerMean: true } },
      derivation: {
        title: "Why the pieces reassemble",
        blocks: [
          {
            type: "paragraph",
            text: "Start from the right-hand side and expand each conditional expectation by its definition:",
          },
          {
            type: "math",
            tex: "\\sum_i P(A_i) E[X \\mid A_i] = \\sum_i P(A_i) \\sum_x x\\, \\frac{P(X = x, A_i)}{P(A_i)}",
          },
          { type: "paragraph", text: "The $P(A_i)$ cancels, leaving a double sum:" },
          {
            type: "math",
            tex: "= \\sum_x x \\sum_i P(X = x,\\, A_i)",
          },
          {
            type: "paragraph",
            text: "The inner sum is the total probability theorem applied to the event $\\{X = x\\}$: because the $A_i$ partition the space, those pieces reassemble into $p_X(x)$.",
          },
          { type: "math", tex: "= \\sum_x x\\, p_X(x) = E[X]" },
          {
            type: "paragraph",
            text: "So this theorem is CP-03 with an extra factor of $x$ carried along. The two stand in the same relation as a PMF does to an expectation.",
          },
          {
            type: "paragraph",
            text: "It is most useful when a problem has a natural case split — a hidden choice, a first stage, an unobserved cause. Conditioning on that split often turns one hard expectation into several easy ones.",
          },
        ],
      },
    },

    {
      id: "rv07-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "You already have both halves of the fair die. Put them back together.",
        },
        {
          type: "stats",
          items: [
            { label: "E[X | X ≤ 3]", value: "2" },
            { label: "E[X | X > 3]", value: "5" },
            { label: "Probability of each case", value: "1/2" },
          ],
        },
      ],
      exercise: {
        kind: "numeric",
        id: "rv07-ex-apply",
        conceptIds: ["conditional-expectation-discrete"],
        objective: "Apply the total expectation theorem over a two-case partition.",
        difficulty: 2,
        prerequisites: ["conditional-expectation-discrete"],
        prompt: [
          {
            type: "paragraph",
            text: "Use the total expectation theorem to find $E[X]$ for the fair die.",
          },
        ],
        value: 3.5,
        tolerance: 0.01,
        unit: "plain",
        acceptFraction: true,
        placeholder: "e.g. 3.5",
        hints: [
          {
            text: "The two cases partition the six faces: three below or equal to 3, three above.",
          },
          { text: "Weight each conditional average by $1/2$ and add." },
          { text: "$\\tfrac12(2) + \\tfrac12(5)$." },
        ],
        solution: [
          {
            type: "math",
            tex: "E[X] = P(X \\leq 3)\\,E[X \\mid X \\leq 3] + P(X > 3)\\,E[X \\mid X > 3]",
          },
          { type: "math", tex: "= \\tfrac{1}{2}(2) + \\tfrac{1}{2}(5) = 1 + 2.5 = 3.5" },
          {
            type: "paragraph",
            text: "Which is the answer from RV-03, reached a different way. Agreement here is a useful check that a case split was done correctly.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "A free consistency check",
          text: "If the weighted conditional expectations fail to reproduce the unconditional one, either a case is missing or the weights are wrong.",
        },
      ],
    },

    {
      id: "rv07-reason",
      kind: "reflect",
      title: "Where have you seen this before?",
      intro: [
        {
          type: "paragraph",
          text: "Put the two theorems side by side.",
        },
        { type: "math", tex: "P(B) = \\sum_i P(A_i)\\, P(B \\mid A_i)" },
        { type: "math", tex: "E[X] = \\sum_i P(A_i)\\, E[X \\mid A_i]" },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv07-ex-reason",
        conceptIds: ["conditional-expectation-discrete", "total-probability"],
        objective: "Relate the total expectation theorem to the total probability theorem.",
        difficulty: 3,
        prompt: [{ type: "paragraph", text: "What is the relationship between them?" }],
        choices: [
          {
            id: "a",
            label: "The same partition argument, applied to an average instead of a probability",
            correct: true,
          },
          {
            id: "b",
            label: "They are unrelated results that happen to look alike",
            misconception:
              "The derivation of the second runs straight through the first — expanding the conditional expectations reduces the inner sum to exactly the total probability theorem.",
          },
          {
            id: "c",
            label: "The second only holds when the $A_i$ are independent of $X$",
            misconception:
              "No independence is needed, and independence would make it uninteresting: if every $E[X \\mid A_i]$ equalled $E[X]$ there would be nothing to compute.",
          },
          {
            id: "d",
            label: "The second is an approximation of the first",
            misconception:
              "Both are exact identities. Neither approximates anything — they are consequences of the same partition and the same additivity.",
          },
        ],
        hints: [
          { text: "Compare the two right-hand sides. What differs besides the symbols?" },
          {
            text: "Both weight a case-by-case quantity by the probability of each case. One quantity is a probability, the other an average.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Both split the sample space into cases, compute something inside each case, and weight by how likely each case is. The derivation of the expectation version uses the probability version at its core.",
          },
          {
            type: "paragraph",
            text: "This is a recurring shape. Any quantity that is additive over disjoint events admits a version of the same theorem — and conditioning on a well-chosen partition is one of the most reliable problem-solving moves in the subject.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Divide and conquer, formalised",
          text: "Unit I ends roughly where it began: the useful move is nearly always to condition on something you do not know, solve the easy cases, and weight them back together.",
        },
      ],
    },

    {
      id: "rv07-assess",
      kind: "assess",
      title: "On your own",
      independent: true,
      intro: [
        {
          type: "callout",
          tone: "info",
          title: "No hints until you have tried",
          text: "This one is unassisted. Work it out, submit an answer, and hints unlock afterwards if you need them. Your result here is what counts towards mastery.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "rv07-ex-assess",
        conceptIds: ["conditional-expectation-discrete"],
        objective:
          "Independently build a partition over an unobserved choice and apply total expectation.",
        difficulty: 4,
        prerequisites: ["conditional-expectation-discrete", "total-probability"],
        prompt: [
          {
            type: "paragraph",
            text: "A box holds three dice that look identical. **Two** are ordinary fair dice. The **third** is a trick die with a 4 on every face.",
          },
          {
            type: "paragraph",
            text: "You take one die at random without looking and roll it. Let $X$ be the number you get. What is $E[X]$? Give your answer to three decimal places.",
          },
        ],
        value: 11 / 3,
        tolerance: 0.01,
        unit: "plain",
        acceptFraction: true,
        placeholder: "e.g. 3.5",
        hints: [
          {
            text: "You never learn which die you took, so make that the partition: fair die, or trick die.",
          },
          {
            text: "Two of the three dice are fair, so $P(\\text{fair}) = 2/3$ and $P(\\text{trick}) = 1/3$.",
          },
          {
            text: "$E[X \\mid \\text{fair}] = 3.5$ and $E[X \\mid \\text{trick}] = 4$. Weight and add.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Condition on which die you picked — the thing you cannot observe. The two cases partition the experiment:",
          },
          {
            type: "math",
            tex: "E[X] = P(\\text{fair})\\,E[X \\mid \\text{fair}] + P(\\text{trick})\\,E[X \\mid \\text{trick}]",
          },
          {
            type: "math",
            tex: "= \\tfrac{2}{3}(3.5) + \\tfrac{1}{3}(4) = \\tfrac{7}{3} + \\tfrac{4}{3} = \\tfrac{11}{3} \\approx 3.667",
          },
          {
            type: "paragraph",
            text: "Slightly above 3.5, because the trick die pulls upward — but only by a third of the gap, since it is only taken a third of the time.",
          },
          {
            type: "paragraph",
            text: "Answering $3.75$ averages the two conditional expectations without weighting them, treating the trick die as if it were half the box rather than a third.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "One question is not mastery",
          text: "Getting this right is a good sign, not a conclusion. The concept will come back after a delay, because remembering it in a week is the part that matters.",
        },
      ],
    },
  ],
};
