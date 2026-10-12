/**
 * CP-05 — When Information Tells You Nothing.
 *
 * Independence. CP-01 already derived $P(A \cap B) = P(A)P(B)$ from an
 * unchanged conditional, so this lesson starts past that: it attacks the two
 * confusions that actually cost marks — independence mistaken for mutual
 * exclusivity, and independence judged by whether two things "feel connected"
 * rather than by the arithmetic.
 *
 * Reuses the CP-03/CP-04 tree with a config where conditioning moves nothing,
 * which makes independence the visible opposite of Bayes.
 *
 * All problems are original, written for this curriculum. MIT OCW material is
 * linked, never reproduced.
 */

import type { Lesson } from "../../schema";

export const CP_05: Lesson = {
  id: "CP-05",
  title: "When Information Tells You Nothing",
  blurb:
    "Pin down what independence really claims — and why it is not the same as being unrelated.",
  conceptIds: ["independence"],
  prerequisites: ["Conditional probability", "Bayes' theorem"],
  estimatedMinutes: 9,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 3: Independence",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-3/",
      kind: "video",
      note: "Independence, conditional independence and reliability, Prof. John Tsitsiklis",
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
      id: "cp05-predict",
      kind: "predict",
      title: "Two dice, one suspicion",
      intro: [
        {
          type: "paragraph",
          text: "You roll two fair dice. Consider two events:",
        },
        {
          type: "list",
          items: ["$A$ — the **first** die shows a 6", "$B$ — the **sum** of the two dice is 7"],
        },
        {
          type: "paragraph",
          text: "The sum obviously depends on the first die — change that die and the sum changes with it. So you might expect learning $A$ to tell you something about $B$.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp05-ex-predict",
        conceptIds: ["independence"],
        objective: "Commit to a judgement about dependence before checking it arithmetically.",
        difficulty: 2,
        prompt: [
          {
            type: "paragraph",
            text: "You are told the first die shows a 6. What happens to the probability that the sum is 7?",
          },
        ],
        choices: [
          { id: "a", label: "Nothing — it stays at $1/6$", correct: true },
          {
            id: "b",
            label: "It rises, because a 6 is a big number",
            misconception:
              "A big first die does not help. To reach 7 you now need exactly a 1, which is one face out of six — the same odds as before. Starting from a 2 you would need a 5; from a 3, a 4. Every starting value leaves exactly one winning face.",
          },
          {
            id: "c",
            label: "It falls, because 7 needs two middling numbers",
            misconception:
              "There is nothing middling about it. Whatever the first die shows, exactly one value of the second die produces a sum of 7, so the chance is $1/6$ no matter what you were told.",
          },
          {
            id: "d",
            label: "It becomes 0, because 6 is too large",
            misconception:
              "A 6 and a 1 sum to 7, so it is perfectly possible. Only sums below 7 would be ruled out, and 7 is not one of them.",
          },
        ],
        hints: [
          {
            text: "Given the first die is a 6, which values of the second die make the sum 7?",
          },
          {
            text: "Only a 1. That is one face out of six, so $P(B \\mid A) = 1/6$.",
          },
          {
            text: "Now compare with the unconditional $P(B)$. Of the 36 equally likely pairs, 6 sum to 7.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Given the first die is a 6, the sum is 7 exactly when the second die is a 1:",
          },
          { type: "math", tex: "P(B \\mid A) = \\frac{1}{6}" },
          {
            type: "paragraph",
            text: "And unconditionally, 6 of the 36 equally likely outcomes sum to 7 — one for each value of the first die:",
          },
          { type: "math", tex: "P(B) = \\frac{6}{36} = \\frac{1}{6}" },
          {
            type: "paragraph",
            text: "The two are equal, so the events are independent — despite the sum being *computed from* the first die.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Independence is arithmetic, not causation",
          text: "The sum is physically determined in part by the first die, and the two events are still independent. Independence says the numbers do not move; it says nothing about whether two things are connected in the world.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 2. Explore
    // -----------------------------------------------------------------
    {
      id: "cp05-explore",
      kind: "explore",
      title: "A tree where nothing moves",
      intro: [
        {
          type: "paragraph",
          text: "Here is the factory from the last two lessons, with one change: both machines are now **equally reliable**. Each fails 5% of the time.",
        },
        {
          type: "paragraph",
          text: "In CP-04, learning that a component was defective shifted Machine B's share from 40% to 44%. Switch to the defective paths and watch what the shares do this time.",
        },
      ],
      visualization: {
        key: "probability-tree",
        config: {
          showShares: true,
          conditionOn: "def",
          conditionLabel: "Defective",
          branches: [
            {
              id: "a",
              label: "Machine A — 60% of output",
              p: 0.6,
              children: [
                { id: "def", label: "Defective", p: 0.05 },
                { id: "good", label: "Good", p: 0.95 },
              ],
            },
            {
              id: "b",
              label: "Machine B — 40% of output",
              p: 0.4,
              children: [
                { id: "def", label: "Defective", p: 0.05 },
                { id: "good", label: "Good", p: 0.95 },
              ],
            },
          ],
        },
      },
      exercise: {
        kind: "visual",
        id: "cp05-ex-explore",
        conceptIds: ["independence"],
        objective: "Observe independence as a posterior that equals the prior.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "Switch to **Only defective paths** to continue." }],
        visualization: "probability-tree",
        config: {},
        solvedWhen: "conditioned",
        hints: [{ text: "Use the toggle above the tree, as in the previous two lessons." }],
        solution: [
          {
            type: "paragraph",
            text: "The defective paths are $0.03$ and $0.02$, so $P(\\text{defective}) = 0.05$. Their shares are $0.03/0.05 = 60\\%$ and $0.02/0.05 = 40\\%$ — exactly the output shares you started with.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "The posterior equals the prior. Holding a defective component in your hand tells you nothing whatsoever about which machine made it, because neither machine is more likely than the other to have produced a defect.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Independence is the fixed point of Bayes",
          text: "Bayes' theorem always applies. Independence is the case where it returns what you already believed — the evidence has no leverage, so the update does nothing.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 3. Formalize
    // -----------------------------------------------------------------
    {
      id: "cp05-formalize",
      kind: "formalize",
      title: "Writing independence down",
      intro: [
        {
          type: "paragraph",
          text: "Two events are **independent** when their joint probability factorises:",
        },
        { type: "math", tex: "P(A \\cap B) = P(A)\\, P(B)" },
        {
          type: "paragraph",
          text: "This is the definition, not the conditional form, for two reasons. It is symmetric in $A$ and $B$, so neither event is privileged; and it stays meaningful when $P(B) = 0$, where $P(A \\mid B)$ is undefined.",
        },
        {
          type: "paragraph",
          text: "When $P(B) > 0$ the familiar version follows immediately, and it is the one that carries the meaning:",
        },
        { type: "math", tex: "P(A \\mid B) = P(A)" },
        {
          type: "callout",
          tone: "warning",
          title: "Independent is not mutually exclusive",
          text: "Mutually exclusive means $P(A \\cap B) = 0$: the events cannot both happen. If both have positive probability, that is the *strongest possible dependence* — learning one tells you the other definitely did not occur. The two ideas are opposites, not synonyms.",
        },
      ],
      visualization: { key: "event-venn", config: { pA: 0.5, pB: 0.4, pAB: 0.2 } },
      derivation: {
        title: "Complements, and why three events need more care",
        blocks: [
          {
            type: "paragraph",
            text: "If $A$ and $B$ are independent, so are $A$ and $B^c$. Split $A$ along $B$:",
          },
          { type: "math", tex: "P(A) = P(A \\cap B) + P(A \\cap B^c)" },
          {
            type: "paragraph",
            text: "Substitute the definition and factorise what is left:",
          },
          {
            type: "math",
            tex: "P(A \\cap B^c) = P(A) - P(A)P(B) = P(A)\\bigl(1 - P(B)\\bigr) = P(A)\\,P(B^c)",
          },
          {
            type: "paragraph",
            text: 'So independence survives complementing either event — which is what lets you compute "at least one" probabilities by working with the complement instead.',
          },
          {
            type: "paragraph",
            text: "For three or more events, pairwise independence is **not** enough. Mutual independence demands that every subset factorise:",
          },
          {
            type: "math",
            tex: "P(A \\cap B) = P(A)P(B), \\quad P(A \\cap C) = P(A)P(C), \\quad P(B \\cap C) = P(B)P(C)",
          },
          { type: "math", tex: "\\text{and} \\quad P(A \\cap B \\cap C) = P(A)P(B)P(C)" },
          {
            type: "paragraph",
            text: "The last condition does not follow from the first three. Flip two fair coins and let $A$ be *first is heads*, $B$ be *second is heads*, and $C$ be *the two flips match*. Each pair is independent, yet $A \\cap B$ forces $C$ to happen, so $P(A \\cap B \\cap C) = 1/4$ while $P(A)P(B)P(C) = 1/8$.",
          },
        ],
      },
    },

    // -----------------------------------------------------------------
    // 4. Apply
    // -----------------------------------------------------------------
    {
      id: "cp05-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "Two independent events, and a question about either of them happening.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "cp05-ex-apply",
        conceptIds: ["independence"],
        objective: "Combine independence with the addition rule to find a union.",
        difficulty: 3,
        prompt: [
          {
            type: "stats",
            items: [
              { label: "P(A)", value: "0.3" },
              { label: "P(B)", value: "0.5" },
            ],
          },
          {
            type: "paragraph",
            text: "$A$ and $B$ are independent. What is $P(A \\cup B)$, the probability that at least one of them happens? Give a probability between 0 and 1.",
          },
        ],
        value: 0.65,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: "The addition rule holds for any two events: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.",
          },
          {
            text: "Independence is what lets you fill in the overlap: $P(A \\cap B) = (0.3)(0.5) = 0.15$.",
          },
          { text: "So $P(A \\cup B) = 0.3 + 0.5 - 0.15$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Adding the two probabilities counts the overlap twice, so it has to come back off once:",
          },
          { type: "math", tex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)" },
          {
            type: "paragraph",
            text: "Independence supplies the overlap, which is the only thing you were not given directly:",
          },
          { type: "math", tex: "P(A \\cap B) = (0.3)(0.5) = 0.15" },
          { type: "math", tex: "P(A \\cup B) = 0.3 + 0.5 - 0.15 = 0.65" },
          {
            type: "paragraph",
            text: "Answering $0.8$ means forgetting to subtract the overlap — which would also claim that two independent events with probability $0.6$ each are certain to produce at least one.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Independence fills in intersections, not unions",
          text: "The addition rule is general and never needs independence. What independence buys you is the one term the addition rule leaves unknown.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 5. Reason
    // -----------------------------------------------------------------
    {
      id: "cp05-reason",
      kind: "reflect",
      title: "The confusion worth killing",
      intro: [
        {
          type: "paragraph",
          text: "Suppose $A$ and $B$ are **mutually exclusive** — they cannot both occur — and both have positive probability.",
        },
        { type: "math", tex: "A \\cap B = \\emptyset, \\qquad P(A) > 0, \\qquad P(B) > 0" },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp05-ex-reason",
        conceptIds: ["independence"],
        objective: "Separate mutual exclusivity from independence, definitively.",
        difficulty: 4,
        prompt: [{ type: "paragraph", text: "Can $A$ and $B$ be independent?" }],
        choices: [
          {
            id: "a",
            label: "No — never, under these conditions",
            correct: true,
          },
          {
            id: "b",
            label: "Yes — mutually exclusive events are always independent",
            misconception:
              "This is the single most common error in the topic, and it gets the relationship exactly backwards. If $A$ and $B$ cannot co-occur then learning $A$ happened tells you $B$ definitely did not — the most informative outcome possible, which is the opposite of independence.",
          },
          {
            id: "c",
            label: "Only when $P(A) + P(B) = 1$",
            misconception:
              "That condition makes them a partition, which changes nothing here. The product $P(A)P(B)$ is still positive while $P(A \\cap B)$ is still zero, so the factorisation still fails.",
          },
          {
            id: "d",
            label: "Yes, provided both probabilities are small",
            misconception:
              "Small is not zero. $P(A)P(B)$ is strictly positive whenever both are, and it has to equal $P(A \\cap B) = 0$ exactly — not approximately.",
          },
        ],
        hints: [
          { text: "Write down what each of the two properties says about $P(A \\cap B)$." },
          {
            text: "Mutual exclusivity gives $P(A \\cap B) = 0$. Independence demands $P(A \\cap B) = P(A)P(B)$, which is strictly positive here.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "The two conditions make incompatible demands on the same number:",
          },
          {
            type: "math",
            tex: "P(A \\cap B) = 0 \\quad \\text{but} \\quad P(A)\\,P(B) > 0",
          },
          {
            type: "paragraph",
            text: "So the factorisation fails and the events cannot be independent. In fact they are maximally dependent: $P(A \\mid B) = 0$, as far from $P(A) > 0$ as the conditional can get.",
          },
          {
            type: "paragraph",
            text: "The only way to be both is for one of them to be impossible, which the premise rules out.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Disjoint means maximally dependent",
          text: "Mutually exclusive events sit at the far end of the dependence scale from independent ones. If you remember nothing else from this lesson, remember that these two words are opposites.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 6. Independent challenge
    // -----------------------------------------------------------------
    {
      id: "cp05-assess",
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
        id: "cp05-ex-assess",
        conceptIds: ["independence"],
        objective:
          "Independently combine independence with a count of the ways a redundant system can survive.",
        difficulty: 4,
        prompt: [
          {
            type: "paragraph",
            text: "A system contains three components that fail **independently**, each with probability $0.1$. The system keeps working as long as **at least two** of the three are working.",
          },
          {
            type: "paragraph",
            text: "What is the probability that the system works? Give a probability between 0 and 1.",
          },
        ],
        value: 0.972,
        tolerance: 0.002,
        unit: "probability",
        acceptFraction: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: '"At least two working" splits into two disjoint cases. What are they?',
          },
          {
            text: "Either all three work, or exactly one fails. All three working is $0.9^3$.",
          },
          {
            text: "Exactly one fails can happen in three ways — it could be any of the components — so that case is $3 \\times 0.1 \\times 0.9^2$.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "The system works in two mutually exclusive ways, so their probabilities add. Independence lets each case be a product.",
          },
          { type: "math", tex: "P(\\text{all three work}) = 0.9^3 = 0.729" },
          {
            type: "paragraph",
            text: "Exactly one failure needs the count: there are three choices of which component fails, and the other two must work.",
          },
          {
            type: "math",
            tex: "P(\\text{exactly one fails}) = 3 \\times 0.1 \\times 0.9^2 = 3 \\times 0.081 = 0.243",
          },
          { type: "math", tex: "P(\\text{works}) = 0.729 + 0.243 = 0.972" },
          {
            type: "paragraph",
            text: "Three components at 90% reliability give 97.2% together. Answering $0.729$ forgets that the system tolerates one failure; forgetting the factor of 3 gives $0.810$.",
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
