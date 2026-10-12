/**
 * FN-01 — Listing What Can Happen.
 *
 * Sample spaces and events. The first thing a probability model needs is a
 * list of outcomes, and almost every modelling error later in the course is
 * really an error made here — choosing a list whose entries are not equally
 * likely, or not disjoint, or not exhaustive.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { Lesson } from "../../schema";

/** Shared with FN-02, which builds events on the same sample space. */
export const TWO_DICE_GRID = {
  rows: 6,
  cols: 6,
  rowLabel: "First die",
  colLabel: "Second die",
};

export const FN_01: Lesson = {
  id: "FN-01",
  title: "Listing What Can Happen",
  blurb:
    "Build the list of outcomes a probability model rests on — and see what breaks without it.",
  conceptIds: ["sample-spaces"],
  prerequisites: ["Fractions and percentages"],
  estimatedMinutes: 8,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 1: Probability Models and Axioms",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-1/",
      kind: "video",
      note: "Sample spaces, events and the axioms, Prof. John Tsitsiklis",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    {
      id: "fn01-predict",
      kind: "predict",
      title: "How many ways can two dice land?",
      intro: [
        {
          type: "paragraph",
          text: "You roll a red die and a blue die. Before computing any probability, a model needs the list of everything that could happen.",
        },
        {
          type: "paragraph",
          text: "The two dice are physically distinct — you can tell them apart by colour.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "fn01-ex-predict",
        conceptIds: ["sample-spaces"],
        objective: "Commit to a count of the outcomes before seeing the grid.",
        difficulty: 1,
        prompt: [{ type: "paragraph", text: "How many outcomes are in the sample space?" }],
        choices: [
          { id: "a", label: "36", correct: true },
          {
            id: "b",
            label: "11",
            misconception:
              "11 is the number of possible **sums**, from 2 to 12. Those are a legitimate thing to care about, but they are not equally likely — there is one way to make 2 and six ways to make 7 — so they are a poor list to build a model on.",
          },
          {
            id: "c",
            label: "12",
            misconception:
              "12 adds the faces of the two dice, $6 + 6$. But the dice land *together*, so each face of the red die can pair with each face of the blue one. That calls for multiplication, not addition.",
          },
          {
            id: "d",
            label: "21",
            misconception:
              "21 counts unordered pairs, treating red 1 with blue 2 as the same outcome as red 2 with blue 1. The dice are distinguishable, so those are two different outcomes — and they are twice as likely as any double.",
          },
        ],
        hints: [
          { text: "For each of the 6 faces the red die can show, how many can the blue die show?" },
          { text: "Six possibilities for the red die, and six for the blue die, independently." },
          { text: "$6 \\times 6 = 36$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Each die lands on one of six faces, and the two are distinguishable, so the outcomes are **ordered pairs**:",
          },
          {
            type: "math",
            tex: "\\Omega = \\{(1,1), (1,2), \\ldots, (6,6)\\}, \\qquad |\\Omega| = 36",
          },
          {
            type: "paragraph",
            text: "All 36 are equally likely, which is what makes this list useful.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "A good list is equally likely",
          text: "You can always describe an experiment with fewer, coarser outcomes. The reason to prefer 36 ordered pairs over 11 sums is that the 36 are equally likely, so probabilities become counting.",
        },
      ],
    },

    {
      id: "fn01-explore",
      kind: "explore",
      title: "Events are sets of outcomes",
      intro: [
        {
          type: "paragraph",
          text: "Here is the whole sample space: 36 cells, one per outcome, each equally likely.",
        },
        {
          type: "paragraph",
          text: "An **event** is nothing more exotic than a subset of this grid. Switch between the events and watch the count change.",
        },
      ],
      visualization: {
        key: "outcome-grid",
        config: {
          ...TWO_DICE_GRID,
          views: [
            { id: "all", label: "Everything", rule: { kind: "all" } },
            { id: "sum7", label: "Sum is 7", rule: { kind: "sum", value: 7 } },
            { id: "firstSix", label: "Red die is 6", rule: { kind: "row", value: 6 } },
            { id: "double", label: "A double", rule: { kind: "match" } },
          ],
        },
      },
      exercise: {
        kind: "visual",
        id: "fn01-ex-explore",
        conceptIds: ["sample-spaces"],
        objective: "See an event as a subset of the sample space and its probability as a count.",
        difficulty: 1,
        prompt: [{ type: "paragraph", text: "Select **Sum is 7** to continue." }],
        visualization: "outcome-grid",
        config: {},
        solvedWhen: "sum7",
        hints: [{ text: "Use the buttons above the grid." }],
        solution: [
          {
            type: "paragraph",
            text: "Six cells have a sum of 7, so the event covers $6/36 = 1/6$ of the space. Note that *a double* also has six cells — different events, same probability.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "Nothing was computed. Each probability is the share of cells the event covers, which is only legitimate because the cells are equally likely.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Event = subset",
          text: "Every question you can ask about this experiment is a subset of the grid. *And* is an intersection, *or* is a union, *not* is a complement — the language of sets, used literally.",
        },
      ],
    },

    {
      id: "fn01-formalize",
      kind: "formalize",
      title: "Sample space and events",
      intro: [
        {
          type: "paragraph",
          text: "A probability model starts with the **sample space** $\\Omega$: the set of all possible outcomes of one run of the experiment. An **event** is any subset of $\\Omega$.",
        },
        {
          type: "paragraph",
          text: "The list has to satisfy two things, and they are easy to state and easy to get wrong:",
        },
        {
          type: "list",
          items: [
            "**Mutually exclusive** — exactly one outcome occurs. Two entries in the list can never both happen.",
            "**Collectively exhaustive** — at least one outcome occurs. Nothing that can happen is missing from the list.",
          ],
        },
        {
          type: "paragraph",
          text: "When $\\Omega$ is finite and the outcomes are equally likely, probability reduces to counting:",
        },
        { type: "math", tex: "P(A) = \\frac{|A|}{|\\Omega|}" },
        {
          type: "callout",
          tone: "warning",
          title: "Granularity is a choice, and it has consequences",
          text: "The 11 sums are mutually exclusive and exhaustive, so they are a *valid* sample space — they are simply not equally likely, so the counting formula above does not apply to them.",
        },
      ],
      visualization: {
        key: "outcome-grid",
        config: {
          ...TWO_DICE_GRID,
          showSum: true,
          views: [
            { id: "all", label: "Sums shown", rule: { kind: "all" } },
            { id: "sum7", label: "Sum is 7", rule: { kind: "sum", value: 7 } },
            { id: "sum2", label: "Sum is 2", rule: { kind: "sum", value: 2 } },
          ],
        },
      },
      derivation: {
        title: "Why the coarse model misleads",
        blocks: [
          {
            type: "paragraph",
            text: "Take the sums as the sample space and assume, wrongly, that all eleven are equally likely. That model claims",
          },
          { type: "math", tex: "P(\\text{sum} = 2) = P(\\text{sum} = 7) = \\tfrac{1}{11}" },
          {
            type: "paragraph",
            text: "The grid shows otherwise: one cell makes 2, and six make 7. The correct values are",
          },
          {
            type: "math",
            tex: "P(\\text{sum} = 2) = \\tfrac{1}{36}, \\qquad P(\\text{sum} = 7) = \\tfrac{6}{36} = \\tfrac{1}{6}",
          },
          {
            type: "paragraph",
            text: "The coarse list is not *wrong* as a list — it is mutually exclusive and exhaustive. What is wrong is the extra assumption that its entries are equally likely. The fine-grained list earns that assumption from the symmetry of the dice.",
          },
          {
            type: "paragraph",
            text: "This is the general lesson. The equally-likely assumption is a claim about the world, never a free consequence of writing a list. When it does not hold, you need the axioms rather than counting — which is the next lesson.",
          },
        ],
      },
    },

    {
      id: "fn01-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "Same two dice, same 36 equally likely outcomes.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "fn01-ex-apply",
        conceptIds: ["sample-spaces"],
        objective: "Compute a probability by counting outcomes in an event.",
        difficulty: 2,
        prerequisites: ["sample-spaces"],
        prompt: [
          {
            type: "paragraph",
            text: "What is the probability that the two dice sum to **10 or more**? Give a probability between 0 and 1.",
          },
        ],
        value: 1 / 6,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          { text: "List the sums that qualify: 10, 11 and 12." },
          { text: "Three ways to make 10, two ways to make 11, one way to make 12." },
          { text: "That is 6 cells out of 36." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Count the cells in each qualifying sum:",
          },
          {
            type: "list",
            items: [
              "Sum 10 — $(4,6), (5,5), (6,4)$: three outcomes.",
              "Sum 11 — $(5,6), (6,5)$: two outcomes.",
              "Sum 12 — $(6,6)$: one outcome.",
            ],
          },
          {
            type: "math",
            tex: "P(\\text{sum} \\geq 10) = \\frac{3 + 2 + 1}{36} = \\frac{6}{36} = \\frac{1}{6}",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Count cells, not sums",
          text: "Three different sums qualified, but what mattered was the six outcomes behind them. Working in the equally likely space keeps the arithmetic honest.",
        },
      ],
    },

    {
      id: "fn01-reason",
      kind: "reflect",
      title: "A tempting shortcut",
      intro: [
        {
          type: "paragraph",
          text: "A classmate proposes a simpler model for two dice: the sample space is the eleven possible sums, $\\{2, 3, \\ldots, 12\\}$, each with probability $1/11$.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "fn01-ex-reason",
        conceptIds: ["sample-spaces"],
        objective: "Separate validity of a sample space from the equally-likely assumption.",
        difficulty: 3,
        prompt: [{ type: "paragraph", text: "What exactly is wrong with this model?" }],
        choices: [
          {
            id: "a",
            label: "The list of outcomes is fine; assigning them equal probability is not",
            correct: true,
          },
          {
            id: "b",
            label: "The list is wrong — a sample space must contain every ordered pair",
            misconception:
              "A sample space just has to be mutually exclusive and collectively exhaustive, and the eleven sums are both. Nothing requires maximum granularity. The defect is the probability assignment, not the list.",
          },
          {
            id: "c",
            label: "Nothing is wrong — any list of outcomes can be given equal probability",
            misconception:
              "Equal probability is a claim about the experiment, not something you may declare. Here it predicts $P(\\text{sum}=2) = 1/11$, while the dice deliver $1/36$.",
          },
          {
            id: "d",
            label: "The probabilities fail to sum to 1",
            misconception:
              "They do sum to 1 — eleven outcomes at $1/11$ each. The model is internally consistent and still describes the wrong dice.",
          },
        ],
        hints: [
          { text: "Check the two requirements for a sample space against the eleven sums." },
          {
            text: "They pass both. So the defect must be in the probabilities, not the outcome list.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "The eleven sums are mutually exclusive and collectively exhaustive, so they form a perfectly legitimate sample space. What fails is the uniform assignment:",
          },
          {
            type: "math",
            tex: "P(\\text{sum} = 2) = \\tfrac{1}{36} \\neq \\tfrac{1}{11}",
          },
          {
            type: "paragraph",
            text: "The fine-grained model earns uniformity from the physical symmetry of the dice. The coarse one inherits no such symmetry, so its probabilities have to be computed rather than assumed.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Choose the space where symmetry lives",
          text: "Pick the granularity at which you can honestly claim the outcomes are equally likely. Everything coarser can then be computed from it.",
        },
      ],
    },

    {
      id: "fn01-assess",
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
        id: "fn01-ex-assess",
        conceptIds: ["sample-spaces"],
        objective: "Independently count an event defined by two simultaneous conditions.",
        difficulty: 4,
        prerequisites: ["sample-spaces"],
        prompt: [
          {
            type: "paragraph",
            text: "Two distinguishable dice are rolled. What is the probability that the two dice show **different** numbers **and** their sum is **even**?",
          },
          { type: "paragraph", text: "Give a probability between 0 and 1." },
        ],
        value: 1 / 3,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: "When is a sum of two whole numbers even? Think about the parity of each die.",
          },
          {
            text: "The sum is even exactly when both dice are even or both are odd — 9 outcomes each way, 18 in total.",
          },
          {
            text: "Of those 18, the doubles have to go: there are 6 of them, and all have an even sum.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "A sum is even exactly when the two dice share a parity, so start there:",
          },
          {
            type: "list",
            items: [
              "Both even — $3 \\times 3 = 9$ outcomes.",
              "Both odd — $3 \\times 3 = 9$ outcomes.",
            ],
          },
          {
            type: "paragraph",
            text: "That is 18 outcomes with an even sum. Every double has an even sum and must be excluded, and there are 6 doubles:",
          },
          { type: "math", tex: "P = \\frac{18 - 6}{36} = \\frac{12}{36} = \\frac{1}{3}" },
          {
            type: "paragraph",
            text: "Answering $1/2$ counts every even sum and forgets the doubles. Answering $5/18$ removes the doubles from the wrong total.",
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
