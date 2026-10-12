/**
 * CP-03 — Adding Up the Cases.
 *
 * The total probability theorem. The learner meets it as the natural answer to
 * a question the tree already raises: if every path ends somewhere, what is
 * the probability of an outcome that several different paths reach?
 *
 * The factory tree here is reused unchanged by CP-04, where conditioning on
 * the same outcome turns it into Bayes' theorem.
 *
 * All problems are original, written for this curriculum. MIT OCW material is
 * linked, never reproduced.
 */

import type { Lesson } from "../../schema";

/** Shared with CP-04 so the two lessons are visibly the same picture. */
export const FACTORY_TREE = {
  branches: [
    {
      id: "a",
      label: "Machine A — 50% of output",
      p: 0.5,
      children: [
        { id: "def", label: "Defective", p: 0.01 },
        { id: "good", label: "Good", p: 0.99 },
      ],
    },
    {
      id: "b",
      label: "Machine B — 40% of output",
      p: 0.4,
      children: [
        { id: "def", label: "Defective", p: 0.03 },
        { id: "good", label: "Good", p: 0.97 },
      ],
    },
    {
      id: "c",
      label: "Machine C — 10% of output",
      p: 0.1,
      children: [
        { id: "def", label: "Defective", p: 0.1 },
        { id: "good", label: "Good", p: 0.9 },
      ],
    },
  ],
  conditionOn: "def",
  conditionLabel: "Defective",
};

export const CP_03: Lesson = {
  id: "CP-03",
  title: "Adding Up the Cases",
  blurb: "Build an overall probability by splitting the world into cases and weighting each one.",
  conceptIds: ["total-probability"],
  prerequisites: ["Conditional probability", "The multiplication rule"],
  estimatedMinutes: 9,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 2: Conditioning and Bayes' Rule",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-2/",
      kind: "video",
      note: "The total probability theorem, Prof. John Tsitsiklis",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    // -----------------------------------------------------------------
    // 1. Predict
    // -----------------------------------------------------------------
    {
      id: "cp03-predict",
      kind: "predict",
      title: "Three machines, one defect rate",
      intro: [
        {
          type: "paragraph",
          text: "A factory runs three machines. They produce different shares of the output, and they are not equally reliable.",
        },
        {
          type: "stats",
          items: [
            { label: "Machine A — share / defect rate", value: "50% / 1%" },
            { label: "Machine B — share / defect rate", value: "40% / 3%" },
            { label: "Machine C — share / defect rate", value: "10% / 10%" },
          ],
        },
        {
          type: "paragraph",
          text: "You pick one component at random from the factory's whole output, with no idea which machine made it.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp03-ex-predict",
        conceptIds: ["total-probability"],
        objective:
          "Commit to an intuition about combining case-by-case rates into an overall rate.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "What is the probability that it is defective?" }],
        choices: [
          { id: "a", label: "2.7%", correct: true },
          {
            id: "b",
            label: "4.7%",
            misconception:
              "That is the plain average of 1%, 3% and 10%. It treats the three machines as equally important, but Machine C — the worst one — makes only a tenth of the output, so its 10% rate should count for a tenth, not a third.",
          },
          {
            id: "c",
            label: "14%",
            misconception:
              "That is $1\\% + 3\\% + 10\\%$. Adding the rates directly double-counts: each rate is already a probability *within* its own machine, so they cannot simply be summed.",
          },
          {
            id: "d",
            label: "1%",
            misconception:
              "That is Machine A's rate alone. A is the biggest contributor, but the other 50% of output has to be accounted for too — and it is less reliable.",
          },
        ],
        hints: [
          {
            text: "Imagine 1000 components. How many came from each machine?",
          },
          {
            text: "500 from A, 400 from B, 100 from C. Now apply each machine's own defect rate to its own count.",
          },
          {
            text: "$500 \\times 1\\% = 5$, $400 \\times 3\\% = 12$, $100 \\times 10\\% = 10$. That is 27 defective components out of 1000.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Each machine contributes defects in proportion to **both** how much it makes and how often it fails. Weight each rate by its share:",
          },
          {
            type: "math",
            tex: "P(D) = (0.5)(0.01) + (0.4)(0.03) + (0.1)(0.10)",
          },
          { type: "math", tex: "P(D) = 0.005 + 0.012 + 0.010 = 0.027 = 2.7\\%" },
          {
            type: "paragraph",
            text: "Machine C is ten times worse than A, but makes a fifth as much, so it contributes twice as many defects as A does — not ten times.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Weight by how often each case occurs",
          text: "An overall rate is never the plain average of its case rates unless the cases are equally likely. The weights are the probabilities of the cases themselves.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 2. Explore
    // -----------------------------------------------------------------
    {
      id: "cp03-explore",
      kind: "explore",
      title: "Collect the defective paths",
      intro: [
        {
          type: "paragraph",
          text: "Here is the factory as a tree. The first stage is which machine made the component; the second is whether it came out defective.",
        },
        {
          type: "paragraph",
          text: "Six paths, and every component in the factory takes exactly one of them. Switch to the defective paths and watch what their probabilities add up to.",
        },
      ],
      visualization: { key: "probability-tree", config: FACTORY_TREE },
      exercise: {
        kind: "visual",
        id: "cp03-ex-explore",
        conceptIds: ["total-probability"],
        objective: "See an overall probability as the sum of the paths that reach the outcome.",
        difficulty: 1,
        prompt: [
          {
            type: "paragraph",
            text: "Switch to **Only defective paths** to continue.",
          },
        ],
        visualization: "probability-tree",
        config: {},
        solvedWhen: "conditioned",
        hints: [{ text: "Use the toggle above the tree." }],
        solution: [
          {
            type: "paragraph",
            text: "Three paths end in a defective component: $0.005$, $0.012$ and $0.010$. Together they come to $0.027$ — the 2.7% you predicted.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "The three surviving paths are *disjoint*: a component is made by exactly one machine, so no component is counted twice. That is what makes adding them legitimate.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Split, weight, add",
          text: "Every path probability was already a product — machine share times defect rate. The total probability theorem just says to add up the products that reach the outcome you care about.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 3. Formalize
    // -----------------------------------------------------------------
    {
      id: "cp03-formalize",
      kind: "formalize",
      title: "The total probability theorem",
      intro: [
        {
          type: "paragraph",
          text: "Let $A_1, A_2, \\ldots, A_n$ be a **partition** of the sample space: the cases are mutually exclusive and together they cover everything.",
        },
        {
          type: "list",
          items: [
            "Mutually exclusive — $A_i \\cap A_j = \\emptyset$ for $i \\neq j$. No outcome is in two cases.",
            "Collectively exhaustive — $A_1 \\cup \\cdots \\cup A_n = \\Omega$. No outcome is left out.",
            "Each has positive probability, so conditioning on it means something.",
          ],
        },
        {
          type: "paragraph",
          text: "Then for any event $B$:",
        },
        {
          type: "math",
          tex: "P(B) = \\sum_{i=1}^{n} P(A_i)\\, P(B \\mid A_i)",
        },
        {
          type: "paragraph",
          text: "In words: split the world into cases, work out how likely $B$ is inside each case, and weight each by how likely that case was to begin with.",
        },
        {
          type: "callout",
          tone: "warning",
          title: "The partition is doing the work",
          text: "If the cases overlap you will double-count, and if they do not cover everything you will undercount. Both failures are silent — the arithmetic still produces a number.",
        },
      ],
      visualization: { key: "probability-tree", config: FACTORY_TREE },
      derivation: {
        title: "Why the sum is exactly right",
        blocks: [
          {
            type: "paragraph",
            text: "Because the $A_i$ cover the whole sample space, every outcome of $B$ lies in exactly one of them. So $B$ can be cut into disjoint pieces:",
          },
          {
            type: "math",
            tex: "B = (B \\cap A_1) \\cup (B \\cap A_2) \\cup \\cdots \\cup (B \\cap A_n)",
          },
          {
            type: "paragraph",
            text: "These pieces are disjoint, because the $A_i$ are. The additivity axiom therefore applies with no correction terms:",
          },
          {
            type: "math",
            tex: "P(B) = \\sum_{i=1}^{n} P(B \\cap A_i)",
          },
          {
            type: "paragraph",
            text: "Now rewrite each joint probability with the multiplication rule from the previous lesson, $P(B \\cap A_i) = P(A_i)P(B \\mid A_i)$:",
          },
          {
            type: "math",
            tex: "P(B) = \\sum_{i=1}^{n} P(A_i)\\, P(B \\mid A_i)",
          },
          {
            type: "paragraph",
            text: "So the theorem is two things you already have, used in order: additivity over a partition, then the multiplication rule on each piece. Nothing new is assumed.",
          },
          {
            type: "paragraph",
            text: "The simplest useful case is a two-part partition with an event and its complement, which needs no setup at all:",
          },
          {
            type: "math",
            tex: "P(B) = P(A)\\,P(B \\mid A) + P(A^c)\\,P(B \\mid A^c)",
          },
        ],
      },
    },

    // -----------------------------------------------------------------
    // 4. Apply
    // -----------------------------------------------------------------
    {
      id: "cp03-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "A shop buys the same product from two suppliers, and they are not equally punctual.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "cp03-ex-apply",
        conceptIds: ["total-probability"],
        objective: "Apply the total probability theorem to a two-case partition.",
        difficulty: 2,
        prompt: [
          {
            type: "stats",
            items: [
              { label: "Supplier X — share / late rate", value: "60% / 5%" },
              { label: "Supplier Y — share / late rate", value: "40% / 10%" },
            ],
          },
          {
            type: "paragraph",
            text: "Every order comes from one supplier or the other. What percentage of all orders arrive late?",
          },
        ],
        value: 7,
        tolerance: 0.2,
        unit: "percent",
        acceptFraction: true,
        placeholder: "e.g. 25 or 25%",
        unitSlipFeedback:
          "Your number is right but the unit is not: $0.07$ is the probability, and the question asks for a percentage. Enter 7.",
        hints: [
          {
            text: "The two suppliers form a partition: every order comes from exactly one of them, and they account for all orders.",
          },
          {
            text: "Weight each late rate by that supplier's share: $(0.6)(0.05)$ and $(0.4)(0.10)$.",
          },
          { text: "Add the two contributions: $0.03 + 0.04$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Let $L$ be the event an order is late, and let $X$ and $Y$ be the suppliers. Since $P(X) + P(Y) = 1$ and no order comes from both, they partition the sample space.",
          },
          {
            type: "math",
            tex: "P(L) = P(X)P(L \\mid X) + P(Y)P(L \\mid Y) = (0.6)(0.05) + (0.4)(0.10)",
          },
          { type: "math", tex: "P(L) = 0.03 + 0.04 = 0.07 = 7\\%" },
          {
            type: "paragraph",
            text: "Y is twice as likely to be late but supplies less, so the two suppliers contribute almost equally to the overall lateness — 3 points against 4.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Check the shares add to 1",
          text: "Before weighting anything, confirm the cases really do partition the world. If the shares do not sum to 1, either a case is missing or they overlap.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 5. Reason
    // -----------------------------------------------------------------
    {
      id: "cp03-reason",
      kind: "reflect",
      title: "When the cases do not partition",
      intro: [
        {
          type: "paragraph",
          text: "A colleague wants to estimate the overall defect rate a different way. They have measured two conditional rates:",
        },
        {
          type: "list",
          items: [
            "$P(\\text{defective} \\mid \\text{made on a Monday})$",
            "$P(\\text{defective} \\mid \\text{made by a new employee})$",
          ],
        },
        {
          type: "paragraph",
          text: "They propose weighting these two by $P(\\text{Monday})$ and $P(\\text{new employee})$ and adding them, exactly as you did with the three machines.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp03-ex-reason",
        conceptIds: ["total-probability"],
        objective: "Identify the partition requirement as the load-bearing hypothesis.",
        difficulty: 4,
        prompt: [{ type: "paragraph", text: "What is wrong with this plan?" }],
        choices: [
          {
            id: "a",
            label:
              "The two cases are neither mutually exclusive nor exhaustive, so the sum is meaningless",
            correct: true,
          },
          {
            id: "b",
            label: "Nothing — the theorem works for any two conditional probabilities",
            misconception:
              "The theorem's hypothesis is a partition, and it is doing real work. Without it, the identity $B = (B \\cap A_1) \\cup (B \\cap A_2)$ simply is not true, and the sum has no meaning.",
          },
          {
            id: "c",
            label: "The weights are wrong, but the method is fine once they are rescaled",
            misconception:
              "Rescaling cannot fix it. A component made on a Monday *by* a new employee would be counted twice, and one made on a Thursday by an experienced employee would not be counted at all. No choice of weights repairs both faults at once.",
          },
          {
            id: "d",
            label: "Conditional probabilities can never be combined, only computed",
            misconception:
              "Too strong — combining them is exactly what you did with the three machines. The difference is that the machines partitioned the output and these two categories do not.",
          },
        ],
        hints: [
          {
            text: "Ask the two partition questions. Can a component be in both categories? Must it be in at least one?",
          },
          {
            text: "A new employee working on a Monday falls in both. A Thursday shift staffed entirely by experienced workers falls in neither.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "The theorem requires the cases to be mutually exclusive and collectively exhaustive. These two are neither:",
          },
          {
            type: "list",
            items: [
              "**Overlap** — a component made on Monday by a new employee belongs to both cases and would be counted twice.",
              "**Gap** — a component made on Thursday by an experienced employee belongs to neither and would be missed entirely.",
            ],
          },
          {
            type: "paragraph",
            text: "The three machines worked because every component is made by exactly one of them. *Monday* and *new employee* are two overlapping ways of slicing the same output, not a partition of it.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "The hypothesis is the hard part",
          text: "The arithmetic in this theorem is trivial. Choosing cases that genuinely partition the world is where the thinking is — and it is the step that fails silently, because the formula will happily return a number either way.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 6. Independent challenge
    // -----------------------------------------------------------------
    {
      id: "cp03-assess",
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
        id: "cp03-ex-assess",
        conceptIds: ["total-probability"],
        objective:
          "Independently build a partition over an unobserved event in order to reach an unconditional probability.",
        difficulty: 4,
        prompt: [
          {
            type: "paragraph",
            text: "An urn contains 3 red balls and 2 blue balls. Someone draws one ball and throws it away **without letting you see its colour**. You then draw a ball from what remains.",
          },
          {
            type: "paragraph",
            text: "What is the probability that your ball is red? Give a probability between 0 and 1, as a decimal or a fraction.",
          },
        ],
        value: 0.6,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: "You do not know what the discarded ball was — so make its colour the partition. It was either red or blue, and it cannot have been both.",
          },
          {
            text: "If it was red (probability $3/5$), two red remain among four. If it was blue (probability $2/5$), three red remain among four.",
          },
          {
            text: "Weight and add: $\\frac{3}{5} \\cdot \\frac{2}{4} + \\frac{2}{5} \\cdot \\frac{3}{4}$.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Let $R_1$ be the event the discarded ball was red and $R_2$ that yours is red. You never see the first ball, so condition on both possibilities — they partition the sample space.",
          },
          {
            type: "math",
            tex: "P(R_2) = P(R_1)P(R_2 \\mid R_1) + P(R_1^c)P(R_2 \\mid R_1^c)",
          },
          {
            type: "math",
            tex: "P(R_2) = \\frac{3}{5} \\cdot \\frac{2}{4} + \\frac{2}{5} \\cdot \\frac{3}{4} = \\frac{6}{20} + \\frac{6}{20} = \\frac{12}{20} = \\frac{3}{5} = 0.6",
          },
          {
            type: "paragraph",
            text: "The answer is $3/5$ — exactly the proportion of red balls you started with. Discarding a ball you never saw tells you nothing, so it cannot shift the probability. If you *had* seen it, it would.",
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
