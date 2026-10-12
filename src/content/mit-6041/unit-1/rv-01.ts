/**
 * RV-01 — Turning Outcomes Into Numbers.
 *
 * Discrete random variables. The idea that trips people is that a random
 * variable is a *function*, not a number — so this lesson keeps the sample
 * space visible throughout and treats X as a relabelling of it.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { Lesson } from "../../schema";

/** The uniform die, reused by the expectation and variance lessons. */
export const DIE_PMF = {
  xLabel: "Value of one fair die",
  title: "One fair die",
  values: [1, 2, 3, 4, 5, 6].map((x) => ({ x, p: 1 / 6 })),
};

/** The sum of two dice, reused across the random-variable lessons. */
export const SUM_PMF = {
  xLabel: "Sum of two dice",
  title: "Sum of two fair dice",
  values: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((ways, i) => ({ x: i + 2, p: ways / 36 })),
};

export const RV_01: Lesson = {
  id: "RV-01",
  title: "Turning Outcomes Into Numbers",
  blurb: "Meet the random variable: not a number, but a rule that attaches one to every outcome.",
  conceptIds: ["discrete-random-variables"],
  prerequisites: ["Sample spaces and events"],
  estimatedMinutes: 8,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 5: Discrete Random Variables; PMFs; Expectations",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-5/",
      kind: "video",
      note: "Random variables and their distributions, Prof. John Tsitsiklis",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    {
      id: "rv01-predict",
      kind: "predict",
      title: "What kind of thing is X?",
      intro: [
        {
          type: "paragraph",
          text: "Roll two dice and let $X$ be their sum. Everyone writes $X$ as though it were a number — $X = 7$, $X \\leq 4$ — and yet before the dice land it has no value at all.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv01-ex-predict",
        conceptIds: ["discrete-random-variables"],
        objective: "Identify a random variable as a function on the sample space.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "What sort of object is $X$?" }],
        choices: [
          {
            id: "a",
            label: "A function that assigns a number to every outcome",
            correct: true,
          },
          {
            id: "b",
            label: "A number whose value you do not yet know",
            misconception:
              "This is the natural reading and it is the one to unlearn. $X$ is defined for *every* outcome at once — it is the whole assignment, not a single hidden value. The number appears only after an outcome is drawn.",
          },
          {
            id: "c",
            label: "An event",
            misconception:
              "$X$ is not an event, but it *generates* events: $\\{X = 7\\}$ is the set of outcomes whose sum is 7, and that is an event. The variable and the events it defines are different things.",
          },
          {
            id: "d",
            label: "A probability",
            misconception:
              "$X$ takes values from 2 to 12 here, so it cannot be a probability. Probabilities attach to the events $X$ defines, not to $X$ itself.",
          },
        ],
        hints: [
          { text: "Ask what $X$ is for a *specific* outcome, say the pair $(3,4)$." },
          {
            text: "For $(3,4)$ it is 7; for $(1,1)$ it is 2. It has an answer for all 36 outcomes.",
          },
          { text: "Something defined at every point of a set is a function on that set." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "A random variable is a function from the sample space to the real numbers:",
          },
          { type: "math", tex: "X : \\Omega \\to \\mathbb{R}, \\qquad X\\big((a,b)\\big) = a + b" },
          {
            type: "paragraph",
            text: "Nothing about it is random in itself — the randomness is in which outcome occurs. $X$ simply says what number that outcome carries.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "A relabelling of the sample space",
          text: "Think of $X$ as writing a number on every cell of the grid. That lets you ask numerical questions — averages, spread — about an experiment whose outcomes were never numbers to begin with.",
        },
      ],
    },

    {
      id: "rv01-explore",
      kind: "explore",
      title: "Every outcome gets a number",
      intro: [
        {
          type: "paragraph",
          text: "Here is the two-dice sample space with each cell labelled by its sum — that labelling *is* the random variable $X$.",
        },
        {
          type: "paragraph",
          text: "Each event $\\{X = x\\}$ is just the set of cells carrying that number. Select a few and watch which cells light up.",
        },
      ],
      visualization: {
        key: "outcome-grid",
        config: {
          rows: 6,
          cols: 6,
          rowLabel: "First die",
          colLabel: "Second die",
          showSum: true,
          views: [
            { id: "all", label: "All outcomes", rule: { kind: "all" } },
            { id: "x7", label: "X = 7", rule: { kind: "sum", value: 7 } },
            { id: "x2", label: "X = 2", rule: { kind: "sum", value: 2 } },
            { id: "x10", label: "X ≥ 10", rule: { kind: "sumAtLeast", value: 10 } },
          ],
        },
      },
      exercise: {
        kind: "visual",
        id: "rv01-ex-explore",
        conceptIds: ["discrete-random-variables"],
        objective: "Match a value of a random variable to the set of outcomes producing it.",
        difficulty: 1,
        prompt: [{ type: "paragraph", text: "Select **X = 7** to continue." }],
        visualization: "outcome-grid",
        config: {},
        solvedWhen: "x7",
        hints: [{ text: "Use the buttons above the grid." }],
        solution: [
          {
            type: "paragraph",
            text: "Six cells carry the label 7 and only one carries 2. Same variable, very different sized events — which is why the sums are not equally likely.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "The events $\\{X = 2\\}, \\{X = 3\\}, \\ldots, \\{X = 12\\}$ are disjoint and together cover the whole grid. They partition the sample space — and that is what makes the next lesson's distribution add to 1.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "From outcomes to values",
          text: "A random variable collapses a messy sample space into numbers you can average, compare and plot, without losing the ability to ask which outcomes produced them.",
        },
      ],
    },

    {
      id: "rv01-formalize",
      kind: "formalize",
      title: "Writing it down",
      intro: [
        {
          type: "paragraph",
          text: "A **random variable** on a sample space $\\Omega$ is a function",
        },
        { type: "math", tex: "X : \\Omega \\to \\mathbb{R}" },
        {
          type: "paragraph",
          text: "It is **discrete** when the set of values it can take is finite or countable — which is every random variable in this unit.",
        },
        {
          type: "paragraph",
          text: "The notation $\\{X = x\\}$ is shorthand for an event, namely the set of outcomes that $X$ sends to $x$:",
        },
        { type: "math", tex: "\\{X = x\\} = \\{\\omega \\in \\Omega : X(\\omega) = x\\}" },
        {
          type: "paragraph",
          text: "So $P(X = x)$ is an ordinary probability of an ordinary event. Nothing new is being assumed; this is bookkeeping that makes numerical questions sayable.",
        },
        {
          type: "callout",
          tone: "warning",
          title: "$X$ is the function, $x$ is a value",
          text: "The capital letter is the rule; the lower-case letter is a particular number it might take. $P(X = x)$ asks how likely the rule is to produce that number — and mixing the two up makes later formulas unreadable.",
        },
      ],
      derivation: {
        title: "Several variables on one space",
        blocks: [
          {
            type: "paragraph",
            text: "Because a random variable is a function on $\\Omega$, you can define as many as you like on the same experiment, and combine them. On the two-dice space:",
          },
          {
            type: "list",
            items: [
              "$X((a,b)) = a + b$ — the sum.",
              "$M((a,b)) = \\max(a, b)$ — the larger die.",
              "$D((a,b)) = |a - b|$ — the gap between them.",
            ],
          },
          {
            type: "paragraph",
            text: "Sums and products of random variables are defined pointwise, so $X + M$ is again a function on $\\Omega$ and therefore again a random variable:",
          },
          { type: "math", tex: "(X + M)(\\omega) = X(\\omega) + M(\\omega)" },
          {
            type: "paragraph",
            text: "This is why it is worth insisting that $X$ is a function. The whole algebra of random variables — adding them, squaring them, taking expectations of the results — is just ordinary algebra of functions, carried out one outcome at a time.",
          },
        ],
      },
    },

    {
      id: "rv01-apply",
      kind: "apply",
      title: "Now use it",
      intro: [{ type: "paragraph", text: "Same two dice, same variable $X$ for the sum." }],
      exercise: {
        kind: "numeric",
        id: "rv01-ex-apply",
        conceptIds: ["discrete-random-variables"],
        objective: "Compute the probability that a random variable takes a given value.",
        difficulty: 2,
        prerequisites: ["discrete-random-variables"],
        prompt: [
          {
            type: "paragraph",
            text: "What is $P(X = 5)$? Give a probability between 0 and 1.",
          },
        ],
        value: 1 / 9,
        tolerance: 0.004,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          { text: "Which ordered pairs sum to 5?" },
          { text: "$(1,4), (2,3), (3,2), (4,1)$ — four of them." },
          { text: "Four cells out of 36." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "The event $\\{X = 5\\}$ contains four equally likely outcomes:",
          },
          { type: "math", tex: "\\{(1,4), (2,3), (3,2), (4,1)\\}" },
          { type: "math", tex: "P(X = 5) = \\frac{4}{36} = \\frac{1}{9}" },
          {
            type: "paragraph",
            text: "Answering $1/11$ would treat the eleven sums as equally likely — the error FN-01 warned about.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Back to counting cells",
          text: "Every question about a discrete random variable on a finite equally likely space reduces to counting the outcomes behind it.",
        },
      ],
    },

    {
      id: "rv01-reason",
      kind: "reflect",
      title: "Which of these is not a random variable?",
      intro: [
        {
          type: "paragraph",
          text: "Still the two-dice experiment. Three of the four quantities below are random variables on it.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv01-ex-reason",
        conceptIds: ["discrete-random-variables"],
        objective:
          "Distinguish a function on the sample space from a fixed number computed from it.",
        difficulty: 3,
        prompt: [{ type: "paragraph", text: "Which one is **not** a random variable?" }],
        choices: [
          {
            id: "a",
            label: "$P(X = 7)$, the probability that the sum is 7",
            correct: true,
          },
          {
            id: "b",
            label: "The larger of the two dice",
            misconception:
              "This is a random variable. It has a definite value for every outcome — 4 for the pair $(1,4)$, 6 for $(6,2)$ — which is exactly what a function on $\\Omega$ is.",
          },
          {
            id: "c",
            label: "The number of dice showing an even face",
            misconception:
              "This is a random variable taking values 0, 1 or 2, with a definite value for every outcome.",
          },
          {
            id: "d",
            label: "The product of the two dice",
            misconception:
              "This is a random variable. Any rule that attaches a number to each outcome qualifies, however it is computed.",
          },
        ],
        hints: [
          {
            text: "Ask of each quantity: does it have a different value for different outcomes?",
          },
          {
            text: "$P(X = 7) = 1/6$ no matter which outcome occurs. It is a fixed number describing the model, not a function on it.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "$P(X = 7)$ is a single fixed number, $1/6$. It does not change from outcome to outcome, so it is not a function on $\\Omega$ and cannot be a random variable.",
          },
          {
            type: "paragraph",
            text: "The other three all vary with the outcome. The test is simple: feed it a specific outcome and ask whether the answer can change.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Probabilities describe the model; variables live inside it",
          text: "$X$ varies across outcomes. $P(X = 7)$ is a property of the whole probability law, computed once and fixed. Later this distinction is what separates a random variable from its expectation.",
        },
      ],
    },

    {
      id: "rv01-assess",
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
        id: "rv01-ex-assess",
        conceptIds: ["discrete-random-variables"],
        objective:
          "Independently identify the outcomes behind a value of a derived random variable.",
        difficulty: 4,
        prerequisites: ["discrete-random-variables", "sample-spaces"],
        prompt: [
          {
            type: "paragraph",
            text: "Two dice are rolled. Let $M$ be the **larger** of the two values — if they are equal, $M$ is that value.",
          },
          {
            type: "paragraph",
            text: "What is $P(M = 4)$? Give a probability between 0 and 1.",
          },
        ],
        value: 7 / 36,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: "$M = 4$ needs at least one die showing 4, and neither showing more than 4.",
          },
          {
            text: "Count the outcomes where both dice are at most 4, then remove those where both are at most 3.",
          },
          { text: "$4^2 - 3^2 = 16 - 9 = 7$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Counting *at least one 4 and nothing larger* directly risks double-counting the pair $(4,4)$. Subtracting two easy counts avoids that:",
          },
          {
            type: "list",
            items: [
              "Both dice at most 4 — that is $M \\leq 4$, giving $4 \\times 4 = 16$ outcomes.",
              "Both dice at most 3 — that is $M \\leq 3$, giving $3 \\times 3 = 9$ outcomes.",
            ],
          },
          {
            type: "math",
            tex: "P(M = 4) = \\frac{16 - 9}{36} = \\frac{7}{36} \\approx 0.194",
          },
          {
            type: "paragraph",
            text: "Listing them confirms it: $(1,4),(2,4),(3,4),(4,4),(4,3),(4,2),(4,1)$ — seven outcomes, with $(4,4)$ appearing once. Answering $8/36$ is the double-count.",
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
