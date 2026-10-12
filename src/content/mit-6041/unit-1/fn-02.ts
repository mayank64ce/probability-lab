/**
 * FN-02 — The Three Rules Everything Rests On.
 *
 * The probability axioms. Deliberately short on axiom-worship and long on the
 * thing axioms are actually for: deciding what is *possible*, so that a claim
 * like "P(A) = 0.6 and P(B) = 0.5, therefore P(A or B) = 1.1" is recognised as
 * impossible rather than merely odd.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { Lesson } from "../../schema";
import { TWO_DICE_GRID } from "./fn-01";

/** Sum-is-7 together with red-die-is-6; they overlap in exactly one cell. */
const A_OR_B: [number, number][] = [
  [1, 6],
  [2, 5],
  [3, 4],
  [4, 3],
  [5, 2],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],
  [6, 6],
];

export const FN_02: Lesson = {
  id: "FN-02",
  title: "The Three Rules Everything Rests On",
  blurb:
    "Learn the axioms as constraints — what a set of probabilities is and is not allowed to be.",
  conceptIds: ["probability-axioms"],
  prerequisites: ["Sample spaces and events"],
  estimatedMinutes: 9,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 1: Probability Models and Axioms",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-1/",
      kind: "video",
      note: "The axioms and their first consequences, Prof. John Tsitsiklis",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    {
      id: "fn02-predict",
      kind: "predict",
      title: "Can you add probabilities?",
      intro: [
        {
          type: "paragraph",
          text: "Two events live in the same sample space. You are told $P(A) = 0.6$ and $P(B) = 0.5$, and nothing else.",
        },
        {
          type: "stats",
          items: [
            { label: "P(A)", value: "0.6" },
            { label: "P(B)", value: "0.5" },
          ],
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "fn02-ex-predict",
        conceptIds: ["probability-axioms"],
        objective: "Notice that adding probabilities requires a hypothesis.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "What is $P(A \\cup B)$?" }],
        choices: [
          {
            id: "a",
            label: "It cannot be determined from this information",
            correct: true,
          },
          {
            id: "b",
            label: "1.1",
            misconception:
              "No probability can exceed 1 — that is one of the axioms. Getting 1.1 is a signal that adding was not allowed here: $A$ and $B$ must overlap, and the overlap has been counted twice.",
          },
          {
            id: "c",
            label: "1",
            misconception:
              "That would mean $A$ and $B$ together cover the whole sample space. They might, but nothing you were told forces it — the overlap could be larger, leaving room outside both.",
          },
          {
            id: "d",
            label: "0.3",
            misconception:
              "$0.3$ is $P(A)P(B)$, which would be $P(A \\cap B)$ if the events were independent — a different quantity, under an assumption you were not given.",
          },
        ],
        hints: [
          { text: "Try adding them. What do you get, and is that a legal probability?" },
          {
            text: "$0.6 + 0.5 = 1.1 > 1$, so plain addition cannot be right. Something is being double-counted.",
          },
          {
            text: "The overlap $P(A \\cap B)$ is counted in both, and you were not told what it is.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Adding gives $1.1$, which no probability may be. The reason is that the overlap is counted twice:",
          },
          { type: "math", tex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)" },
          {
            type: "paragraph",
            text: "Without $P(A \\cap B)$ the answer is not pinned down. It can be shown to lie between $0.6$ and $1$, but no single value follows.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Additivity has a hypothesis",
          text: "Probabilities add only over events that cannot both happen. The moment events can overlap, addition over-counts — and the axioms are what tell you so.",
        },
      ],
    },

    {
      id: "fn02-explore",
      kind: "explore",
      title: "Where the double-counting happens",
      intro: [
        {
          type: "paragraph",
          text: "Back to the two dice. Let $A$ be *the sum is 7* and $B$ be *the red die shows 6*. Each covers six cells.",
        },
        {
          type: "paragraph",
          text: "Step through the four views and count the cells. Watch what happens to the union.",
        },
      ],
      visualization: {
        key: "outcome-grid",
        config: {
          ...TWO_DICE_GRID,
          views: [
            { id: "a", label: "A: sum is 7", rule: { kind: "sum", value: 7 } },
            { id: "b", label: "B: red is 6", rule: { kind: "row", value: 6 } },
            { id: "union", label: "A or B", rule: { kind: "cells", cells: A_OR_B } },
            { id: "inter", label: "A and B", rule: { kind: "cells", cells: [[6, 1]] } },
          ],
        },
      },
      exercise: {
        kind: "visual",
        id: "fn02-ex-explore",
        conceptIds: ["probability-axioms"],
        objective: "Observe inclusion–exclusion as a count of cells.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "Select **A or B** to continue." }],
        visualization: "outcome-grid",
        config: {},
        solvedWhen: "union",
        hints: [{ text: "Use the buttons above the grid." }],
        solution: [
          {
            type: "paragraph",
            text: "$A$ has 6 cells and $B$ has 6, but the union has 11, not 12 — because the cell $(6,1)$ lies in both and must not be counted twice.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "Six plus six is twelve; the union is eleven. The missing one is exactly the overlap, counted once instead of twice.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Inclusion and exclusion, seen",
          text: "$6 + 6 - 1 = 11$. The subtraction is not a correction bolted on afterwards — it is what additivity means once events can overlap.",
        },
      ],
    },

    {
      id: "fn02-formalize",
      kind: "formalize",
      title: "The axioms",
      intro: [
        {
          type: "paragraph",
          text: "A probability law assigns a number $P(A)$ to every event, subject to exactly three requirements.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Non-negativity** — $P(A) \\geq 0$ for every event $A$.",
            "**Normalization** — $P(\\Omega) = 1$. Something happens.",
            "**Additivity** — if $A$ and $B$ are disjoint, $P(A \\cup B) = P(A) + P(B)$.",
          ],
        },
        {
          type: "paragraph",
          text: "That is all. Everything else in this course is a consequence, including the rule you just watched on the grid:",
        },
        { type: "math", tex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)" },
        {
          type: "callout",
          tone: "warning",
          title: "Additivity needs disjointness",
          text: "The third axiom is the one with a hypothesis, and it is the one people drop. $P(A) + P(B)$ is the probability of the union only when the events cannot both occur.",
        },
      ],
      derivation: {
        title: "What follows immediately",
        blocks: [
          {
            type: "paragraph",
            text: "**The complement.** $A$ and $A^c$ are disjoint and together make $\\Omega$, so additivity and normalization give",
          },
          {
            type: "math",
            tex: "P(A) + P(A^c) = P(\\Omega) = 1 \\;\\Longrightarrow\\; P(A^c) = 1 - P(A)",
          },
          {
            type: "paragraph",
            text: "**Nothing happens with probability zero.** Put $A = \\Omega$ above: $P(\\emptyset) = 1 - 1 = 0$.",
          },
          {
            type: "paragraph",
            text: "**Probabilities never exceed 1.** Since $P(A^c) \\geq 0$ by the first axiom, $P(A) = 1 - P(A^c) \\leq 1$. Note this is a *theorem*, not a fourth axiom.",
          },
          {
            type: "paragraph",
            text: "**Monotonicity.** If $A \\subseteq B$, split $B$ into the disjoint pieces $A$ and $B \\cap A^c$:",
          },
          { type: "math", tex: "P(B) = P(A) + P(B \\cap A^c) \\geq P(A)" },
          {
            type: "paragraph",
            text: "**Inclusion–exclusion.** Split $A \\cup B$ into three disjoint pieces — in $A$ only, in both, in $B$ only — and add them up. Adding $P(A)$ and $P(B)$ counts the middle piece twice, so subtract it once:",
          },
          { type: "math", tex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)" },
          {
            type: "paragraph",
            text: "Because $P(A \\cap B) \\geq 0$, this also gives the **union bound** $P(A \\cup B) \\leq P(A) + P(B)$, which holds for any events at all and is used constantly later in the course.",
          },
        ],
      },
    },

    {
      id: "fn02-apply",
      kind: "apply",
      title: "Now use it",
      intro: [{ type: "paragraph", text: "This time the overlap is given." }],
      exercise: {
        kind: "numeric",
        id: "fn02-ex-apply",
        conceptIds: ["probability-axioms"],
        objective: "Apply inclusion–exclusion to a union.",
        difficulty: 2,
        prerequisites: ["probability-axioms"],
        prompt: [
          {
            type: "stats",
            items: [
              { label: "P(A)", value: "0.6" },
              { label: "P(B)", value: "0.5" },
              { label: "P(A and B)", value: "0.2" },
            ],
          },
          {
            type: "paragraph",
            text: "What is $P(A \\cup B)$? Give a probability between 0 and 1.",
          },
        ],
        value: 0.9,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          { text: "Add the two probabilities, then remove what you counted twice." },
          { text: "$0.6 + 0.5 - 0.2$." },
        ],
        solution: [
          { type: "math", tex: "P(A \\cup B) = 0.6 + 0.5 - 0.2 = 0.9" },
          {
            type: "paragraph",
            text: "A legal probability, and it had to be: the overlap of $0.2$ is exactly what pulls $1.1$ back under 1.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Sanity-check against the axioms",
          text: "Any answer above 1 or below 0 is not a near miss — it is a proof that a step was invalid. Use that: the axioms are a free error check on every calculation you do.",
        },
      ],
    },

    {
      id: "fn02-reason",
      kind: "reflect",
      title: "How much must they overlap?",
      intro: [
        {
          type: "paragraph",
          text: "Return to $P(A) = 0.6$ and $P(B) = 0.5$ with the overlap unknown. The axioms do not pin $P(A \\cap B)$ down, but they do constrain it.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "fn02-ex-reason",
        conceptIds: ["probability-axioms"],
        objective: "Derive a bound on an unknown intersection from the axioms alone.",
        difficulty: 4,
        prompt: [
          {
            type: "paragraph",
            text: "What is the **smallest** value $P(A \\cap B)$ could possibly take?",
          },
        ],
        choices: [
          { id: "a", label: "0.1", correct: true },
          {
            id: "b",
            label: "0",
            misconception:
              "Zero would mean the events are disjoint, giving $P(A \\cup B) = 1.1$. No event may have probability above 1, so they are *forced* to overlap.",
          },
          {
            id: "c",
            label: "0.3",
            misconception:
              "$0.3 = (0.6)(0.5)$ is the overlap under independence — one particular case, not a lower bound. The events could overlap less than that.",
          },
          {
            id: "d",
            label: "0.5",
            misconception:
              "$0.5$ is the *largest* the overlap could be, reached when $B \\subseteq A$. The question asks for the smallest.",
          },
        ],
        hints: [
          { text: "Rearrange inclusion–exclusion to isolate the intersection." },
          {
            text: "$P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = 1.1 - P(A \\cup B)$.",
          },
          { text: "The union is at most 1, so the intersection is at least $1.1 - 1$." },
        ],
        solution: [
          { type: "paragraph", text: "Rearrange inclusion–exclusion:" },
          { type: "math", tex: "P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = 1.1 - P(A \\cup B)" },
          {
            type: "paragraph",
            text: "The union is an event, so $P(A \\cup B) \\leq 1$, and the intersection is therefore at least",
          },
          { type: "math", tex: "P(A \\cap B) \\geq 1.1 - 1 = 0.1" },
          {
            type: "paragraph",
            text: "Two events covering 60% and 50% of the space cannot avoid each other — they must share at least a tenth of it. This is the simplest case of the general bound $P(A \\cap B) \\geq P(A) + P(B) - 1$.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Axioms give you bounds for free",
          text: "Even with the overlap unknown, three short rules forced it into $[0.1,\\, 0.5]$. Much of applied probability is exactly this: bounding what you cannot compute.",
        },
      ],
    },

    {
      id: "fn02-assess",
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
        id: "fn02-ex-assess",
        conceptIds: ["probability-axioms"],
        objective: "Independently extend inclusion–exclusion to three events.",
        difficulty: 4,
        prerequisites: ["probability-axioms"],
        prompt: [
          {
            type: "paragraph",
            text: "Three events each have probability $0.5$. Each **pair** of them intersects with probability $0.25$, and all three intersect with probability $0.1$.",
          },
          {
            type: "stats",
            items: [
              { label: "Each single event", value: "0.5" },
              { label: "Each pair", value: "0.25" },
              { label: "All three", value: "0.1" },
            ],
          },
          {
            type: "paragraph",
            text: "What is the probability that **at least one** of the three occurs? Give a probability between 0 and 1.",
          },
        ],
        value: 0.85,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: "Two events needed one subtraction. With three, subtracting every pair removes the triple overlap too many times.",
          },
          {
            text: "Add the three singles, subtract the three pairs, then add the triple back once.",
          },
          { text: "$3(0.5) - 3(0.25) + 0.1$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Inclusion–exclusion for three events alternates sign, because a region counted too often by one term is corrected by the next:",
          },
          {
            type: "math",
            tex: "P(A \\cup B \\cup C) = \\sum P(A_i) - \\sum P(A_i \\cap A_j) + P(A \\cap B \\cap C)",
          },
          { type: "math", tex: "= 3(0.5) - 3(0.25) + 0.1 = 1.5 - 0.75 + 0.1 = 0.85" },
          {
            type: "paragraph",
            text: "Why the final addition? The triple-overlap region is counted three times by the singles and removed three times by the pairs, leaving it at zero — so it has to be added back once.",
          },
          {
            type: "paragraph",
            text: "Stopping at $1.5 - 0.75 = 0.75$ is the common slip. Answering $1.5$ ignores the overlaps entirely and is not even a legal probability.",
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
