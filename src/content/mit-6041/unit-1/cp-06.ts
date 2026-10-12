/**
 * CP-06 — Independence That Depends on What You Know.
 *
 * Conditional independence, and the fact that it neither implies nor is
 * implied by ordinary independence. The two-coin box is the cleanest
 * demonstration: given which coin you hold the flips are independent, and
 * without that knowledge they are not, because each flip is evidence about
 * the coin.
 *
 * Closes the conditioning topic by tying CP-04's posterior back to CP-05's
 * fixed point: here the evidence *does* move the posterior, and that movement
 * is exactly what couples the flips.
 *
 * All problems are original, written for this curriculum. MIT OCW material is
 * linked, never reproduced.
 */

import type { Lesson } from "../../schema";

/** The two-coin box, shared by the explore screen and the derivation. */
export const TWO_COIN_TREE = {
  showShares: true,
  conditionOn: "h",
  conditionLabel: "First flip heads",
  branches: [
    {
      id: "fair",
      label: "Fair coin — picked 50% of the time",
      p: 0.5,
      children: [
        { id: "h", label: "First flip: heads", p: 0.5 },
        { id: "t", label: "First flip: tails", p: 0.5 },
      ],
    },
    {
      id: "two-headed",
      label: "Two-headed coin — picked 50% of the time",
      p: 0.5,
      children: [{ id: "h", label: "First flip: heads", p: 1 }],
    },
  ],
};

export const CP_06: Lesson = {
  id: "CP-06",
  title: "Independence That Depends on What You Know",
  blurb: "See why two flips of the same coin can be dependent until you know which coin it is.",
  conceptIds: ["conditional-independence"],
  prerequisites: ["Independence", "Bayes' theorem", "Total probability"],
  estimatedMinutes: 10,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 3: Independence",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-3/",
      kind: "video",
      note: "Conditional independence and independence of several events, Prof. John Tsitsiklis",
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
      id: "cp06-predict",
      kind: "predict",
      title: "A box with two coins",
      intro: [
        {
          type: "paragraph",
          text: "A box holds two coins. One is fair. The other is two-headed — it lands heads every single time.",
        },
        {
          type: "stats",
          items: [
            { label: "Fair coin — P(heads)", value: "0.5" },
            { label: "Two-headed coin — P(heads)", value: "1" },
          ],
        },
        {
          type: "paragraph",
          text: "You reach in without looking, take one coin, and flip it twice. You are not told which coin you picked.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp06-ex-predict",
        conceptIds: ["conditional-independence"],
        objective:
          "Commit to a judgement about whether repeated flips of one coin are independent.",
        difficulty: 3,
        prompt: [
          {
            type: "paragraph",
            text: "The first flip lands heads. What happens to the probability that the second flip is also heads?",
          },
        ],
        choices: [
          { id: "a", label: "It rises", correct: true },
          {
            id: "b",
            label: "Nothing — flips of a coin are always independent",
            misconception:
              "Flips are independent **given which coin you are holding**. You do not know that. The first flip is evidence about the coin itself, and evidence about the coin is evidence about every later flip.",
          },
          {
            id: "c",
            label: "It falls, because heads has already been used up",
            misconception:
              "There is nothing to use up — the coin is not drawn from a finite pool of outcomes. This is the gambler's fallacy, and it points in the opposite direction from the real effect.",
          },
          {
            id: "d",
            label: "It rises only if you picked the two-headed coin",
            misconception:
              "You never find out which coin you picked, so the answer cannot be conditioned on that. The probability you are asked for already averages over both possibilities — weighted by what the first flip told you.",
          },
        ],
        hints: [
          {
            text: "Before any flip, each coin is equally likely. Does seeing heads leave them equally likely?",
          },
          {
            text: "Heads is certain with the two-headed coin and only half-likely with the fair one, so heads is evidence that you are holding the two-headed coin.",
          },
          {
            text: "And if you are now more likely to be holding the two-headed coin, the next flip is more likely to be heads.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Unconditionally, the first flip is heads three-quarters of the time:",
          },
          { type: "math", tex: "P(H_1) = (0.5)(0.5) + (0.5)(1) = 0.75" },
          { type: "paragraph", text: "Both flips land heads with probability" },
          { type: "math", tex: "P(H_1 \\cap H_2) = (0.5)(0.25) + (0.5)(1) = 0.625" },
          {
            type: "math",
            tex: "P(H_2 \\mid H_1) = \\frac{0.625}{0.75} = \\frac{5}{6} \\approx 0.833",
          },
          {
            type: "paragraph",
            text: "That is well above $P(H_2) = 0.75$, so the two flips are **not** independent.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "The coin is the hidden variable",
          text: "Nothing about the second flip changed physically. What changed is your belief about which coin is in your hand — and every flip is a reading of that same unknown.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 2. Explore
    // -----------------------------------------------------------------
    {
      id: "cp06-explore",
      kind: "explore",
      title: "Watch the belief move",
      intro: [
        {
          type: "paragraph",
          text: "Here is the box as a tree: first which coin you picked, then how the first flip landed.",
        },
        {
          type: "paragraph",
          text: "In CP-05 the shares did not budge, because both machines were equally reliable. Switch to the heads paths and see whether that happens here.",
        },
      ],
      visualization: { key: "probability-tree", config: TWO_COIN_TREE },
      exercise: {
        kind: "visual",
        id: "cp06-ex-explore",
        conceptIds: ["conditional-independence", "bayes-theorem"],
        objective: "Observe a flip shifting the posterior over a hidden cause.",
        difficulty: 2,
        prompt: [
          { type: "paragraph", text: "Switch to **Only first flip heads paths** to continue." },
        ],
        visualization: "probability-tree",
        config: {},
        solvedWhen: "conditioned",
        hints: [{ text: "Use the toggle above the tree." }],
        solution: [
          {
            type: "paragraph",
            text: "The surviving paths are $0.25$ and $0.5$, summing to $P(H_1) = 0.75$. Their shares are $1/3$ and $2/3$: one heads has already taken the two-headed coin from even odds to twice as likely.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "That shift is the whole mechanism. Your belief about the coin moved from $1/2$ to $2/3$ in favour of the two-headed one, and the second flip inherits that belief:",
        },
        {
          type: "math",
          tex: "P(H_2 \\mid H_1) = \\tfrac{1}{3}(0.5) + \\tfrac{2}{3}(1) = \\tfrac{5}{6}",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Dependence through a hidden cause",
          text: "The flips never interact. They are correlated because they share a cause you cannot see — and learning about one teaches you about that cause.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 3. Formalize
    // -----------------------------------------------------------------
    {
      id: "cp06-formalize",
      kind: "formalize",
      title: "Conditional independence",
      intro: [
        {
          type: "paragraph",
          text: "Events $A$ and $B$ are **conditionally independent given $C$** when they factorise inside $C$:",
        },
        { type: "math", tex: "P(A \\cap B \\mid C) = P(A \\mid C)\\, P(B \\mid C)" },
        {
          type: "paragraph",
          text: "Equivalently, when $P(A \\cap C) > 0$, learning $B$ adds nothing once you already know $C$:",
        },
        { type: "math", tex: "P(B \\mid A \\cap C) = P(B \\mid C)" },
        {
          type: "paragraph",
          text: "In the coin box, let $C$ be *you picked the fair coin*. Given $C$, the flips really are independent — each is heads with probability $0.5$ regardless of the other. The dependence you measured appears only when $C$ is unknown.",
        },
        {
          type: "callout",
          tone: "warning",
          title: "Neither property implies the other",
          text: "Conditional independence does not imply independence — the coins just showed that. Independence does not imply conditional independence either: two independent coin flips become perfectly dependent once you are told whether the flips matched.",
        },
      ],
      visualization: { key: "probability-tree", config: TWO_COIN_TREE },
      derivation: {
        title: "Both failures, in full",
        blocks: [
          {
            type: "paragraph",
            text: "**Conditionally independent, not independent.** Write $F$ for the fair coin and $D$ for the two-headed one. Given either coin the flips factorise, by construction:",
          },
          {
            type: "math",
            tex: "P(H_1 \\cap H_2 \\mid F) = 0.25 = (0.5)(0.5), \\qquad P(H_1 \\cap H_2 \\mid D) = 1 = (1)(1)",
          },
          { type: "paragraph", text: "Yet averaging over the two coins breaks the factorisation:" },
          {
            type: "math",
            tex: "P(H_1 \\cap H_2) = 0.625 \\neq 0.5625 = (0.75)(0.75) = P(H_1)P(H_2)",
          },
          {
            type: "paragraph",
            text: "**Independent, not conditionally independent.** Flip two fair coins. Let $A$ be *first is heads* and $B$ be *second is heads*; these are independent, each with probability $1/2$. Now let $C$ be *the two flips differ*.",
          },
          {
            type: "math",
            tex: "P(A \\mid C) = \\tfrac{1}{2}, \\qquad P(B \\mid C) = \\tfrac{1}{2}, \\qquad P(A \\cap B \\mid C) = 0",
          },
          {
            type: "paragraph",
            text: "Given that the flips differ, they cannot both be heads, so the product $1/4$ is wrong. Conditioning destroyed an independence that was there to begin with.",
          },
          {
            type: "paragraph",
            text: 'The two properties are therefore logically independent of each other. Which one a problem gives you is a modelling assumption, and it has to be read carefully: *"the tests are independent"* and *"the tests are independent given the patient\'s true status"* are different claims with different answers.',
          },
        ],
      },
    },

    // -----------------------------------------------------------------
    // 4. Apply
    // -----------------------------------------------------------------
    {
      id: "cp06-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "A patient takes the same diagnostic test twice. The two results are conditionally independent **given whether the patient actually has the disease**.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "cp06-ex-apply",
        conceptIds: ["conditional-independence", "bayes-theorem"],
        objective:
          "Use conditional independence to multiply likelihoods, then invert with Bayes' theorem.",
        difficulty: 4,
        prompt: [
          {
            type: "stats",
            items: [
              { label: "Have the disease", value: "10%" },
              { label: "Test positive, if you have it", value: "90%" },
              { label: "Test positive, if you do not", value: "20%" },
            ],
          },
          {
            type: "paragraph",
            text: "Both tests come back positive. What is the probability the patient has the disease? Give a probability between 0 and 1.",
          },
        ],
        value: 9 / 13,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: "Conditional independence is what lets you square a likelihood: given the disease, two positives have probability $0.9 \\times 0.9$.",
          },
          {
            text: "Build the evidence probability over both cases: $P(++) = (0.1)(0.81) + (0.9)(0.04)$.",
          },
          { text: "That is $0.081 + 0.036 = 0.117$. Now take the diseased share of it." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Let $D$ be *has the disease*. Conditional independence given $D$ turns each pair of results into a product:",
          },
          {
            type: "math",
            tex: "P(++ \\mid D) = (0.9)^2 = 0.81, \\qquad P(++ \\mid D^c) = (0.2)^2 = 0.04",
          },
          { type: "paragraph", text: "Total probability supplies the denominator:" },
          { type: "math", tex: "P(++) = (0.1)(0.81) + (0.9)(0.04) = 0.081 + 0.036 = 0.117" },
          {
            type: "math",
            tex: "P(D \\mid ++) = \\frac{0.081}{0.117} = \\frac{9}{13} \\approx 0.692",
          },
          {
            type: "paragraph",
            text: "One positive test would have given $0.9/(0.9+1.8) = 1/3$. The second positive lifts it past a half — repeating the test is informative precisely because the results are conditionally independent.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "warning",
          title: "The assumption is doing real work",
          text: "If the two results were dependent given the patient's status — the same lab, the same faulty reagent — squaring the likelihood would overstate the evidence badly. Repeating a test only helps if the second result can disagree with the first.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 5. Reason
    // -----------------------------------------------------------------
    {
      id: "cp06-reason",
      kind: "reflect",
      title: "Which way does it go?",
      intro: [
        {
          type: "paragraph",
          text: "You now have two scenarios in hand: flips of an unknown coin, and two fair flips conditioned on whether they matched.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp06-ex-reason",
        conceptIds: ["conditional-independence", "independence"],
        objective:
          "State the logical relationship between independence and conditional independence.",
        difficulty: 4,
        prompt: [
          {
            type: "paragraph",
            text: "What is the relationship between independence and conditional independence?",
          },
        ],
        choices: [
          {
            id: "a",
            label: "Neither one implies the other",
            correct: true,
          },
          {
            id: "b",
            label: "Conditional independence implies independence",
            misconception:
              "The coin box is a counterexample. Given either coin the flips are independent, yet unconditionally $P(H_1 \\cap H_2) = 0.625$ while $P(H_1)P(H_2) = 0.5625$.",
          },
          {
            id: "c",
            label: "Independence implies conditional independence",
            misconception:
              "Two fair flips are independent, but given that the flips *differ* they cannot both be heads — so $P(A \\cap B \\mid C) = 0$ while $P(A \\mid C)P(B \\mid C) = 1/4$. Conditioning can destroy independence as easily as it can create it.",
          },
          {
            id: "d",
            label: "They are two names for the same property",
            misconception:
              "They are different statements about different probability measures: one about $P$, the other about $P(\\cdot \\mid C)$. Each can hold without the other.",
          },
        ],
        hints: [
          {
            text: "You have already met a counterexample in one direction. Can you find the other?",
          },
          {
            text: "The coins break *conditional independence implies independence*. Two fair flips, conditioned on whether they matched, break the reverse.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Both implications fail, and you have seen a concrete counterexample to each:",
          },
          {
            type: "list",
            items: [
              "**Conditional but not unconditional** — the two-coin box. Independent given the coin, dependent without it.",
              "**Unconditional but not conditional** — two fair flips, conditioned on *the flips differ*. Independent to begin with, perfectly dependent afterwards.",
            ],
          },
          {
            type: "paragraph",
            text: "So conditioning is not a property-preserving operation. It can create dependence by revealing a shared cause, and destroy it by constraining two free choices.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Always ask: independent given what?",
          text: '"Independent" on its own is a claim about the unconditional measure. Once a problem conditions on anything, the independence you were handed may no longer be the independence you need.',
        },
      ],
    },

    // -----------------------------------------------------------------
    // 6. Independent challenge
    // -----------------------------------------------------------------
    {
      id: "cp06-assess",
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
        id: "cp06-ex-assess",
        conceptIds: ["conditional-independence"],
        objective:
          "Independently chain conditional independence and total probability across three trials.",
        difficulty: 4,
        prompt: [
          {
            type: "paragraph",
            text: "Same box: one fair coin, one two-headed coin, picked at random. This time you flip the coin you took **three** times.",
          },
          {
            type: "paragraph",
            text: "The first two flips both land heads. What is the probability that the third is heads as well? Give a probability between 0 and 1.",
          },
        ],
        value: 0.9,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: "Given a coin, the flips are independent — so each coin's contribution is just its heads probability raised to a power.",
          },
          {
            text: "$P(\\text{first two heads}) = (0.5)(0.5)^2 + (0.5)(1) = 0.625$, and $P(\\text{three heads}) = (0.5)(0.5)^3 + (0.5)(1) = 0.5625$.",
          },
          { text: "Then divide: $0.5625 / 0.625$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Work with whole runs rather than updating flip by flip. Given a coin, the flips are conditionally independent, so each case is a power:",
          },
          {
            type: "math",
            tex: "P(H_1 \\cap H_2) = (0.5)(0.5)^2 + (0.5)(1)^2 = 0.125 + 0.5 = 0.625",
          },
          {
            type: "math",
            tex: "P(H_1 \\cap H_2 \\cap H_3) = (0.5)(0.5)^3 + (0.5)(1)^3 = 0.0625 + 0.5 = 0.5625",
          },
          {
            type: "math",
            tex: "P(H_3 \\mid H_1 \\cap H_2) = \\frac{0.5625}{0.625} = 0.9",
          },
          {
            type: "paragraph",
            text: "Two heads have pushed the posterior on the two-headed coin to $0.5/0.625 = 0.8$, and $0.8(1) + 0.2(0.5) = 0.9$ agrees. Each additional heads makes the next one more likely — and the sequence climbs towards 1 without ever reaching it.",
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
