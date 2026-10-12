/**
 * RV-03 — Where the Distribution Balances.
 *
 * Expectation, introduced as the balance point of the PMF rather than as a
 * formula. The lesson leans on the fact that E[X] is usually not a value X can
 * take, because that is the point learners most often refuse to accept.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { Lesson } from "../../schema";
import { DIE_PMF } from "./rv-01";

export const RV_03: Lesson = {
  id: "RV-03",
  title: "Where the Distribution Balances",
  blurb:
    "Find the long-run average of a random variable, and see why it is rarely a value it takes.",
  conceptIds: ["expectation"],
  prerequisites: ["Probability mass functions"],
  estimatedMinutes: 9,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 5: Discrete Random Variables; PMFs; Expectations",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-5/",
      kind: "video",
      note: "Expectation and its properties, Prof. John Tsitsiklis",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    {
      id: "rv03-predict",
      kind: "predict",
      title: "The average roll",
      intro: [
        {
          type: "paragraph",
          text: "Roll one fair die a very large number of times and keep a running average of the numbers you see.",
        },
        {
          type: "paragraph",
          text: "The average will settle down. The question is where.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv03-ex-predict",
        conceptIds: ["expectation"],
        objective: "Commit to the long-run average of a uniform random variable.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "What number does the running average approach?" }],
        choices: [
          { id: "a", label: "3.5", correct: true },
          {
            id: "b",
            label: "3",
            misconception:
              "3 is one of the two middle faces, but there are six faces and no single middle one. The average of $1$ through $6$ sits between 3 and 4.",
          },
          {
            id: "c",
            label: "4",
            misconception:
              "Same difficulty as answering 3 — the six faces have no single middle value, so the average falls between the two central faces.",
          },
          {
            id: "d",
            label: "It depends on how many times you roll",
            misconception:
              "The *running* average wanders early on, but it settles towards one fixed number as the rolls accumulate. That number is a property of the die, not of how long you play.",
          },
        ],
        hints: [
          { text: "Over many rolls, each face appears about one sixth of the time." },
          { text: "So the average is $\\frac{1+2+3+4+5+6}{6}$." },
          { text: "$21/6$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Each face occurs about a sixth of the time, so the long-run average is the plain average of the faces:",
          },
          { type: "math", tex: "\\frac{1 + 2 + 3 + 4 + 5 + 6}{6} = \\frac{21}{6} = 3.5" },
          {
            type: "paragraph",
            text: "Note that 3.5 is not a face of the die. The average of a variable need not be a value it can take.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "An average, not a prediction",
          text: "3.5 never appears on any single roll. It describes the whole distribution, not what any one roll will do.",
        },
      ],
    },

    {
      id: "rv03-explore",
      kind: "explore",
      title: "The balance point",
      intro: [
        {
          type: "paragraph",
          text: "Here is the die's distribution: six equal bars. Switch on the mean and see where it sits.",
        },
        {
          type: "paragraph",
          text: "Think of the bars as weights on a plank. The expectation is the point where the plank would balance — pull mass to the right and the balance point follows.",
        },
      ],
      visualization: { key: "pmf-chart", config: { ...DIE_PMF, offerMean: true } },
      exercise: {
        kind: "visual",
        id: "rv03-ex-explore",
        conceptIds: ["expectation"],
        objective: "Locate the expectation as the balance point of a distribution.",
        difficulty: 1,
        prompt: [{ type: "paragraph", text: "Select **Show the mean** to continue." }],
        visualization: "pmf-chart",
        config: {},
        solvedWhen: "mean",
        hints: [{ text: "Use the toggle above the chart." }],
        solution: [
          {
            type: "paragraph",
            text: "The marker lands at 3.5, halfway between the bars at 3 and 4 — exactly where a symmetric distribution must balance.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "For a symmetric distribution the balance point is the centre of symmetry, and you can read it off without arithmetic. The sum of two dice is symmetric about 7, so its expectation is 7 — no computation required.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Weighted by probability",
          text: "The balance point is not the average of the *values*; it is the average weighted by how likely each value is. Equal bars make the two coincide, which is why the uniform case can mislead.",
        },
      ],
    },

    {
      id: "rv03-formalize",
      kind: "formalize",
      title: "Expectation",
      intro: [
        {
          type: "paragraph",
          text: "The **expected value** of a discrete random variable is the probability-weighted average of its values:",
        },
        { type: "math", tex: "E[X] = \\sum_x x \\, p_X(x)" },
        {
          type: "paragraph",
          text: "Each value is counted in proportion to how often it occurs. For the die every weight is $1/6$, which collapses to the ordinary average; for the sum of two dice the weights differ and the ordinary average of $2 \\ldots 12$ would be wrong.",
        },
        {
          type: "paragraph",
          text: "Two properties make expectation easy to work with, and both are used constantly:",
        },
        { type: "math", tex: "E[aX + b] = a\\,E[X] + b" },
        { type: "math", tex: "E[X + Y] = E[X] + E[Y]" },
        {
          type: "callout",
          tone: "warning",
          title: "Linearity needs nothing",
          text: "$E[X + Y] = E[X] + E[Y]$ holds for *any* two random variables on the same space — independent or not. It is one of the few results in this course with no hypothesis attached, and it makes many hard-looking problems short.",
        },
      ],
      visualization: { key: "pmf-chart", config: { ...DIE_PMF, offerMean: true } },
      derivation: {
        title: "Why it is the long-run average, and why linearity is free",
        blocks: [
          {
            type: "paragraph",
            text: "Roll the die $n$ times, with $n$ large. Face $x$ appears about $n\\,p_X(x)$ times, so the total of all the rolls is about $\\sum_x x \\cdot n\\,p_X(x)$, and the average is",
          },
          {
            type: "math",
            tex: "\\frac{1}{n}\\sum_x x \\cdot n\\,p_X(x) = \\sum_x x\\,p_X(x) = E[X]",
          },
          {
            type: "paragraph",
            text: 'That is the intuition. Making "about" precise is the weak law of large numbers, in Unit IV.',
          },
          {
            type: "paragraph",
            text: "**Linearity.** Work over outcomes rather than values. Since $X$ is a function on $\\Omega$, expectation can be written as a sum over outcomes:",
          },
          { type: "math", tex: "E[X] = \\sum_{\\omega \\in \\Omega} X(\\omega)\\,P(\\omega)" },
          {
            type: "paragraph",
            text: "Both forms agree, because grouping the outcomes by the value of $X$ recovers the PMF. In this form linearity is immediate — $(X + Y)(\\omega) = X(\\omega) + Y(\\omega)$ at every outcome, so",
          },
          {
            type: "math",
            tex: "E[X + Y] = \\sum_\\omega \\bigl(X(\\omega) + Y(\\omega)\\bigr)P(\\omega) = E[X] + E[Y]",
          },
          {
            type: "paragraph",
            text: "Nothing was assumed about how $X$ and $Y$ relate, which is exactly why no hypothesis is needed. The sum of two dice has expectation $3.5 + 3.5 = 7$ in one line, with no PMF in sight.",
          },
        ],
      },
    },

    {
      id: "rv03-apply",
      kind: "apply",
      title: "Now use it",
      intro: [{ type: "paragraph", text: "A small wager, with unequal weights." }],
      exercise: {
        kind: "numeric",
        id: "rv03-ex-apply",
        conceptIds: ["expectation"],
        objective: "Compute an expectation over a two-valued random variable.",
        difficulty: 2,
        prerequisites: ["expectation"],
        prompt: [
          {
            type: "stats",
            items: [
              { label: "Win £5 with probability", value: "0.2" },
              { label: "Lose £1 with probability", value: "0.8" },
            ],
          },
          {
            type: "paragraph",
            text: "What is your expected gain per play, in pounds? A loss counts as a negative gain.",
          },
        ],
        value: 0.2,
        tolerance: 0.005,
        unit: "plain",
        acceptFraction: true,
        placeholder: "e.g. 1.5 or -0.5",
        hints: [
          { text: "The variable takes two values: $+5$ and $-1$." },
          { text: "Weight each by its probability: $5(0.2)$ and $(-1)(0.8)$." },
          { text: "$1 - 0.8$." },
        ],
        solution: [
          { type: "math", tex: "E[X] = 5(0.2) + (-1)(0.8) = 1 - 0.8 = 0.2" },
          {
            type: "paragraph",
            text: "A gain of 20p per play on average. You lose four times out of five, and the rare win more than covers it — which is precisely what an expectation is for.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Signs matter",
          text: "Losses enter as negative values, not as subtracted probabilities. Writing $5(0.2) - 1(0.8)$ and $5(0.2) + (-1)(0.8)$ are the same thing; writing $5(0.2) - 1$ is not.",
        },
      ],
    },

    {
      id: "rv03-reason",
      kind: "reflect",
      title: "A value it never takes",
      intro: [
        {
          type: "paragraph",
          text: "$E[X] = 3.5$ for a fair die, and yet no roll ever produces 3.5.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv03-ex-reason",
        conceptIds: ["expectation"],
        objective:
          "Separate the expectation from the most likely value and from attainable values.",
        difficulty: 3,
        prompt: [{ type: "paragraph", text: "What does $E[X] = 3.5$ actually tell you?" }],
        choices: [
          {
            id: "a",
            label: "The average of many rolls settles near 3.5",
            correct: true,
          },
          {
            id: "b",
            label: "3.5 is the most likely outcome",
            misconception:
              "That would be the **mode**, and for a fair die all six faces tie for it. The expectation is a balance point, and it need not coincide with any peak — or with any attainable value at all.",
          },
          {
            id: "c",
            label: "Half of all rolls fall below 3.5 and half above",
            misconception:
              "That describes the **median**. It happens to hold here because the die is symmetric, but for a skewed distribution the mean and median differ — and only the mean is $E[X]$.",
          },
          {
            id: "d",
            label: "The calculation must be wrong, since 3.5 is not a face",
            misconception:
              "An expectation is a weighted average, and averages routinely fall between attainable values. The average household has a non-integer number of occupants for the same reason.",
          },
        ],
        hints: [
          { text: "Think about what the running average does over many rolls." },
          {
            text: "Expectation is a property of the distribution as a whole, not a forecast of any single roll.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "The expectation is the long-run average. It describes the aggregate behaviour of many repetitions, not the result of any one of them.",
          },
          {
            type: "paragraph",
            text: "Mean, median and mode are three different summaries. For the symmetric die the mean and median agree at 3.5 while every face ties for the mode; for a skewed distribution all three can differ.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Expectation summarises; it does not predict",
          text: "Knowing $E[X]$ tells you where the distribution balances and nothing about how far from it a single draw will land. That second question is the next lesson.",
        },
      ],
    },

    {
      id: "rv03-assess",
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
        id: "rv03-ex-assess",
        conceptIds: ["expectation"],
        objective: "Independently derive the PMF of a derived variable and take its expectation.",
        difficulty: 4,
        prerequisites: ["expectation", "probability-mass-functions"],
        prompt: [
          {
            type: "paragraph",
            text: "Two fair dice are rolled. Let $M$ be the **larger** of the two values — if they tie, $M$ is that value.",
          },
          {
            type: "paragraph",
            text: "What is $E[M]$? Give your answer to three decimal places.",
          },
        ],
        value: 161 / 36,
        tolerance: 0.01,
        unit: "plain",
        acceptFraction: true,
        placeholder: "e.g. 3.5",
        hints: [
          {
            text: "Linearity will not help — the maximum is not a sum. You need the PMF of $M$ first.",
          },
          {
            text: "$P(M \\leq k) = k^2/36$, so $p_M(k) = \\frac{k^2 - (k-1)^2}{36} = \\frac{2k-1}{36}$.",
          },
          {
            text: "So the masses for $k = 1 \\ldots 6$ are $1, 3, 5, 7, 9, 11$ over 36. Now weight and add.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Get the PMF through the cumulative count, as in RV-01: $M \\leq k$ exactly when both dice are at most $k$, which happens in $k^2$ of the 36 outcomes.",
          },
          {
            type: "math",
            tex: "p_M(k) = \\frac{k^2 - (k-1)^2}{36} = \\frac{2k - 1}{36}",
          },
          { type: "paragraph", text: "Now weight each value by its mass:" },
          {
            type: "math",
            tex: "E[M] = \\frac{1(1) + 2(3) + 3(5) + 4(7) + 5(9) + 6(11)}{36} = \\frac{161}{36} \\approx 4.472",
          },
          {
            type: "paragraph",
            text: "Comfortably above the 3.5 of a single die, which is what you would expect — taking the larger of two rolls can only push the average up. Answering 3.5 assumes the maximum behaves like one die; answering 7 confuses it with the sum.",
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
