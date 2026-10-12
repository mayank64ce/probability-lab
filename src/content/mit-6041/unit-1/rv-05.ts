/**
 * RV-05 — Changing the Variable.
 *
 * Functions of a random variable, and the expected value rule. The lesson is
 * organised around E[g(X)] != g(E[X]), because assuming otherwise is one of
 * the most expensive errors in applied probability.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { Lesson } from "../../schema";

/** Y = X squared, for a single fair die. */
const SQUARE_PMF = {
  xLabel: "Y = X² for one fair die",
  title: "The distribution of X²",
  values: [1, 2, 3, 4, 5, 6].map((x) => ({ x: x * x, p: 1 / 6 })),
};

export const RV_05: Lesson = {
  id: "RV-05",
  title: "Changing the Variable",
  blurb: "Transform a random variable, and find out why the average does not transform with it.",
  conceptIds: ["functions-of-random-variables"],
  prerequisites: ["Expectation", "Probability mass functions"],
  estimatedMinutes: 9,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 6: Discrete Random Variable Examples; Joint PMFs",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-6/",
      kind: "video",
      note: "Functions of random variables and the expected value rule, Prof. John Tsitsiklis",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    {
      id: "rv05-predict",
      kind: "predict",
      title: "Does the average square?",
      intro: [
        {
          type: "paragraph",
          text: "$X$ is one fair die, so $E[X] = 3.5$. Now let $Y = X^2$ — square whatever the die shows.",
        },
        {
          type: "paragraph",
          text: "It is tempting to say $E[Y] = 3.5^2 = 12.25$.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv05-ex-predict",
        conceptIds: ["functions-of-random-variables"],
        objective: "Commit to a judgement about whether expectation passes through a function.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "Is $E[X^2] = 12.25$?" }],
        choices: [
          { id: "a", label: "No — $E[X^2]$ is larger", correct: true },
          {
            id: "b",
            label: "Yes — expectation passes straight through",
            misconception:
              "It passes through *linear* functions only. Squaring stretches large values far more than small ones, so the big faces pull the average of the squares upward.",
          },
          {
            id: "c",
            label: "No — $E[X^2]$ is smaller",
            misconception:
              "Squaring pulls upward, not down. The jump from 5 to 25 is much larger than the jump from 1 to 1, so the high end dominates.",
          },
          {
            id: "d",
            label: "Only if the die is fair",
            misconception:
              "Fairness is not the issue. $E[X^2] \\neq (E[X])^2$ for essentially every random variable — the gap is exactly the variance, which is zero only for a constant.",
          },
        ],
        hints: [
          { text: "Write out the six squared values: $1, 4, 9, 16, 25, 36$." },
          { text: "Average those six numbers and compare with 12.25." },
          { text: "$\\frac{91}{6} \\approx 15.17$, which is well above 12.25." },
        ],
        solution: [
          { type: "paragraph", text: "Average the squares rather than squaring the average:" },
          {
            type: "math",
            tex: "E[X^2] = \\frac{1 + 4 + 9 + 16 + 25 + 36}{6} = \\frac{91}{6} \\approx 15.17",
          },
          {
            type: "paragraph",
            text: "That is nearly 3 above $12.25$ — and the gap is no coincidence. It is precisely $\\mathrm{var}(X) = 35/12 \\approx 2.92$.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "The gap has a name",
          text: "$E[X^2] - (E[X])^2 = \\mathrm{var}(X)$, which you computed last lesson. Variance is literally the amount by which squaring and averaging fail to commute.",
        },
      ],
    },

    {
      id: "rv05-explore",
      kind: "explore",
      title: "The transformed distribution",
      intro: [
        {
          type: "paragraph",
          text: "Here is the distribution of $Y = X^2$. The six bars are still equally likely — squaring did not change *which* outcomes occur, only the labels they carry.",
        },
        {
          type: "paragraph",
          text: "What it did change is the spacing. Switch on the mean and compare it with $3.5^2 = 12.25$.",
        },
      ],
      visualization: { key: "pmf-chart", config: { ...SQUARE_PMF, offerMean: true } },
      exercise: {
        kind: "visual",
        id: "rv05-ex-explore",
        conceptIds: ["functions-of-random-variables"],
        objective: "Observe that a transformation moves the balance point non-linearly.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "Select **Show the mean** to continue." }],
        visualization: "pmf-chart",
        config: {},
        solvedWhen: "mean",
        hints: [{ text: "Use the toggle above the chart." }],
        solution: [
          {
            type: "paragraph",
            text: "The mean sits at about $15.17$, not $12.25$. Squaring spread the upper values far apart — 25 and 36 are 11 units apart, while 1 and 4 are only 3 — and the balance point followed the mass upward.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "The probabilities never moved: each bar is still $1/6$. All that changed was where the bars sit on the axis, and that was enough to move the mean.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Shuffle the labels, keep the masses",
          text: "To transform a random variable, apply the function to each *value* and carry its probability along unchanged. Only when two values collide do their masses need adding.",
        },
      ],
    },

    {
      id: "rv05-formalize",
      kind: "formalize",
      title: "Functions of a random variable",
      intro: [
        {
          type: "paragraph",
          text: "If $X$ is a random variable and $g$ a function, then $Y = g(X)$ is a random variable too — it is the composition $g \\circ X$, still a function on $\\Omega$.",
        },
        {
          type: "paragraph",
          text: "Its PMF gathers all the values of $X$ that $g$ sends to the same place:",
        },
        { type: "math", tex: "p_Y(y) = \\sum_{x \\,:\\, g(x) = y} p_X(x)" },
        {
          type: "paragraph",
          text: "But for an expectation you rarely need $p_Y$ at all. The **expected value rule** lets you work entirely in the distribution of $X$:",
        },
        { type: "math", tex: "E[g(X)] = \\sum_x g(x)\\, p_X(x)" },
        {
          type: "callout",
          tone: "warning",
          title: "$E[g(X)] \\neq g(E[X])$",
          text: "Equality holds for linear $g$ and essentially nothing else. Substituting the mean into a non-linear function and calling the result an expectation is a mistake with real consequences — it is why an average-case cost estimate can be badly wrong.",
        },
      ],
      visualization: { key: "pmf-chart", config: { ...SQUARE_PMF, offerMean: true } },
      derivation: {
        title: "Why you may skip the transformed PMF",
        blocks: [
          {
            type: "paragraph",
            text: "Start from the definition applied to $Y$, then expand each mass using the rule above:",
          },
          {
            type: "math",
            tex: "E[Y] = \\sum_y y\\, p_Y(y) = \\sum_y y \\sum_{x : g(x) = y} p_X(x)",
          },
          {
            type: "paragraph",
            text: "Inside the inner sum every $x$ satisfies $g(x) = y$, so $y$ may be replaced by $g(x)$ and pulled in:",
          },
          {
            type: "math",
            tex: "E[Y] = \\sum_y \\sum_{x : g(x) = y} g(x)\\, p_X(x) = \\sum_x g(x)\\, p_X(x)",
          },
          {
            type: "paragraph",
            text: "The double sum simply visits every $x$ once, grouped by its image. So the two routes agree, and the second never requires finding $p_Y$.",
          },
          {
            type: "paragraph",
            text: "**When does $E[g(X)] = g(E[X])$?** For $g(x) = ax + b$, linearity gives $E[aX + b] = aE[X] + b = g(E[X])$. For anything curved the two differ, and the direction of the error is predictable: a convex $g$, like squaring, always pushes $E[g(X)]$ *above* $g(E[X])$.",
          },
          {
            type: "paragraph",
            text: "That one-sided failure is Jensen's inequality, and the variance identity is its most familiar instance:",
          },
          { type: "math", tex: "E[X^2] - \\big(E[X]\\big)^2 = \\mathrm{var}(X) \\geq 0" },
        ],
      },
    },

    {
      id: "rv05-apply",
      kind: "apply",
      title: "Now use it",
      intro: [{ type: "paragraph", text: "Use the rule directly, without building a new PMF." }],
      exercise: {
        kind: "numeric",
        id: "rv05-ex-apply",
        conceptIds: ["functions-of-random-variables"],
        objective: "Apply the expected value rule to a non-linear transformation.",
        difficulty: 2,
        prerequisites: ["functions-of-random-variables", "expectation"],
        prompt: [
          {
            type: "paragraph",
            text: "$X$ is one fair six-sided die. What is $E[X^2]$? Give your answer to three decimal places.",
          },
        ],
        value: 91 / 6,
        tolerance: 0.01,
        unit: "plain",
        acceptFraction: true,
        placeholder: "e.g. 12.5",
        hints: [
          { text: "Apply the rule: weight $x^2$ by $p_X(x) = 1/6$ for each face." },
          { text: "$\\frac{1 + 4 + 9 + 16 + 25 + 36}{6}$." },
        ],
        solution: [
          {
            type: "math",
            tex: "E[X^2] = \\sum_{x=1}^{6} x^2 \\cdot \\tfrac{1}{6} = \\frac{91}{6} \\approx 15.167",
          },
          {
            type: "paragraph",
            text: "No transformed PMF was needed. Answering $12.25$ squares the mean instead of averaging the squares.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Transform the values, keep the weights",
          text: "The probabilities in the sum are always $p_X$. The function only ever touches the values.",
        },
      ],
    },

    {
      id: "rv05-reason",
      kind: "reflect",
      title: "When do they agree?",
      intro: [
        {
          type: "paragraph",
          text: "Squaring broke the equality. Some functions do not.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv05-ex-reason",
        conceptIds: ["functions-of-random-variables", "expectation"],
        objective: "Identify linearity as the condition under which expectation commutes.",
        difficulty: 4,
        prompt: [
          {
            type: "paragraph",
            text: "For which functions $g$ is $E[g(X)] = g(E[X])$ guaranteed, whatever the distribution of $X$?",
          },
        ],
        choices: [
          { id: "a", label: "Linear functions, $g(x) = ax + b$", correct: true },
          {
            id: "b",
            label: "Increasing functions",
            misconception:
              "Squaring is increasing on the positive numbers and still fails. What matters is curvature, not direction: a curved function bends the spacing between values and moves the balance point.",
          },
          {
            id: "c",
            label: "Any function, provided $X$ is symmetric",
            misconception:
              "A fair die is symmetric and $E[X^2] \\neq (E[X])^2$ all the same. Symmetry of $X$ does not survive a non-linear transformation.",
          },
          {
            id: "d",
            label: "Only the identity $g(x) = x$",
            misconception:
              "Too strict. Shifting and scaling also commute — $E[2X + 3] = 2E[X] + 3$ — which is the linearity of expectation.",
          },
        ],
        hints: [
          { text: "Try $g(x) = 2x + 3$ and check both sides." },
          {
            text: "Linearity of expectation gives $E[2X + 3] = 2E[X] + 3$, which is exactly $g(E[X])$.",
          },
        ],
        solution: [
          { type: "paragraph", text: "For a linear $g$, linearity of expectation does the work:" },
          { type: "math", tex: "E[aX + b] = aE[X] + b = g\\big(E[X]\\big)" },
          {
            type: "paragraph",
            text: "For a curved $g$ the two part company. Convex functions such as $x^2$ or $e^x$ always give $E[g(X)] \\geq g(E[X])$; concave ones such as $\\log x$ or $\\sqrt{x}$ always give the reverse.",
          },
          {
            type: "paragraph",
            text: "This is why an average-case estimate obtained by plugging mean inputs into a non-linear model is systematically wrong, and always in a predictable direction.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Straight lines only",
          text: "Expectation commutes with shifting and scaling and with nothing else. Any bend in $g$ introduces a gap — and the gap grows with the spread of $X$.",
        },
      ],
    },

    {
      id: "rv05-assess",
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
        id: "rv05-ex-assess",
        conceptIds: ["functions-of-random-variables"],
        objective:
          "Independently apply the expected value rule to a transformation of a non-uniform distribution.",
        difficulty: 4,
        prerequisites: ["functions-of-random-variables", "probability-mass-functions"],
        prompt: [
          {
            type: "paragraph",
            text: "$X$ is the sum of two fair dice. Let $D = |X - 7|$, the distance of the sum from 7.",
          },
          {
            type: "paragraph",
            text: "What is $E[D]$? Give your answer to three decimal places.",
          },
        ],
        value: 35 / 18,
        tolerance: 0.01,
        unit: "plain",
        acceptFraction: true,
        placeholder: "e.g. 2.5",
        hints: [
          {
            text: "You need the PMF of the sum: the masses over $2 \\ldots 12$ are $1,2,3,4,5,6,5,4,3,2,1$ over 36.",
          },
          {
            text: "Apply the rule in terms of $X$: $E[D] = \\sum_x |x - 7| \\, p_X(x)$. The distribution is symmetric about 7, so pair the values either side.",
          },
          {
            text: "Distance 1 has mass $10/36$, distance 2 has $8/36$, then $6/36$, $4/36$, $2/36$, and distance 0 has $6/36$.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Apply the expected value rule using the distribution of $X$ — no need to build the PMF of $D$ separately. Symmetry about 7 pairs the values up:",
          },
          {
            type: "list",
            items: [
              "$D = 0$ from $x = 7$: mass $6/36$.",
              "$D = 1$ from $x = 6, 8$: mass $10/36$.",
              "$D = 2$ from $x = 5, 9$: mass $8/36$.",
              "$D = 3$ from $x = 4, 10$: mass $6/36$.",
              "$D = 4$ from $x = 3, 11$: mass $4/36$.",
              "$D = 5$ from $x = 2, 12$: mass $2/36$.",
            ],
          },
          {
            type: "math",
            tex: "E[D] = \\frac{0(6) + 1(10) + 2(8) + 3(6) + 4(4) + 5(2)}{36} = \\frac{70}{36} = \\frac{35}{18} \\approx 1.944",
          },
          {
            type: "paragraph",
            text: "Note $E[D]$ is **not** $|E[X] - 7| = 0$. The absolute value is non-linear, so it does not pass through the expectation — and indeed a typical roll really is about two away from 7.",
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
