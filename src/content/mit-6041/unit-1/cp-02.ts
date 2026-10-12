/**
 * CP-02 — Walking Through an Experiment.
 *
 * The multiplication rule, taught as the thing conditional probability is
 * usually *for*: not computing P(A | B) from a table, but running an
 * experiment forward one stage at a time.
 *
 * All problems are original, written for this curriculum. MIT OCW material is
 * linked, never reproduced.
 */

import type { Lesson } from "../../schema";

export const CP_02: Lesson = {
  id: "CP-02",
  title: "Walking Through an Experiment",
  blurb: "Chain conditional probabilities to follow a multi-stage experiment from start to finish.",
  conceptIds: ["multiplication-rule"],
  prerequisites: ["Conditional probability", "Fractions and percentages"],
  estimatedMinutes: 9,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 2: Conditioning and Bayes' Rule",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-2/",
      kind: "video",
      note: "The multiplication rule and sequential models, Prof. John Tsitsiklis",
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
      id: "cp02-predict",
      kind: "predict",
      title: "Two fuses from the box",
      intro: [
        {
          type: "paragraph",
          text: "A box holds 10 fuses. Three of them are defective. You pull out two fuses, one after the other, and you do **not** put the first one back.",
        },
        {
          type: "stats",
          items: [
            { label: "Fuses in the box", value: "10" },
            { label: "Defective", value: "3" },
            { label: "Drawn, without replacement", value: "2" },
          ],
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp02-ex-predict",
        conceptIds: ["multiplication-rule"],
        objective: "Commit to an intuition about how a first draw changes the second.",
        difficulty: 2,
        prompt: [
          { type: "paragraph", text: "What is the probability that **both** fuses are defective?" },
        ],
        choices: [
          { id: "a", label: "6.7%", correct: true },
          {
            id: "b",
            label: "9%",
            misconception:
              "That is $(3/10) \\times (3/10)$, which treats the second draw as if the first had never happened. You did not replace the fuse — after one defective fuse is removed, 2 defective remain out of 9.",
          },
          {
            id: "c",
            label: "6%",
            misconception:
              "That is $(3/10) \\times (2/10)$. You correctly dropped the numerator from 3 to 2, but the box also got smaller: 9 fuses remain, not 10.",
          },
          {
            id: "d",
            label: "30%",
            misconception:
              "That is just $P(\\text{first is defective}) = 3/10$. It is the probability of clearing the first stage, not of clearing both.",
          },
        ],
        hints: [
          {
            text: "Take the stages one at a time. What is the probability the first fuse is defective?",
          },
          {
            text: "Given the first was defective and is not going back, the box now holds 9 fuses, 2 of them defective.",
          },
          { text: "Multiply the two stages: $\\frac{3}{10} \\times \\frac{2}{9}$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Let $D_1$ be the event the first fuse is defective and $D_2$ the second. The first stage is a straight count:",
          },
          { type: "math", tex: "P(D_1) = \\frac{3}{10}" },
          {
            type: "paragraph",
            text: "The second stage is a conditional probability, because the box has changed. Given $D_1$, two defective fuses remain among nine:",
          },
          { type: "math", tex: "P(D_2 \\mid D_1) = \\frac{2}{9}" },
          {
            type: "math",
            tex: "P(D_1 \\cap D_2) = \\frac{3}{10} \\times \\frac{2}{9} = \\frac{6}{90} = \\frac{1}{15} \\approx 6.7\\%",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "The second stage is conditional",
          text: "Drawing without replacement means the second probability depends on what the first draw did. That dependence is not a complication to be avoided — it is the whole reason conditional probability exists.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 2. Explore
    // -----------------------------------------------------------------
    {
      id: "cp02-explore",
      kind: "explore",
      title: "Multiply along the path",
      intro: [
        {
          type: "paragraph",
          text: "Here is the same experiment drawn as a tree. The first number on each path is the probability of that first draw; the second is the probability of the second draw **given** the first.",
        },
        {
          type: "paragraph",
          text: "Notice that every second-stage denominator is 9, never 10. The box shrank.",
        },
      ],
      visualization: {
        key: "probability-tree",
        config: {
          mode: "trace",
          branches: [
            {
              id: "d",
              label: "1st draw: defective",
              p: 0.3,
              display: "3/10",
              children: [
                { id: "d", label: "2nd: defective", p: 2 / 9, display: "2/9" },
                { id: "g", label: "2nd: good", p: 7 / 9, display: "7/9" },
              ],
            },
            {
              id: "g",
              label: "1st draw: good",
              p: 0.7,
              display: "7/10",
              children: [
                { id: "d", label: "2nd: defective", p: 3 / 9, display: "3/9" },
                { id: "g", label: "2nd: good", p: 6 / 9, display: "6/9" },
              ],
            },
          ],
        },
      },
      exercise: {
        kind: "visual",
        id: "cp02-ex-explore",
        conceptIds: ["multiplication-rule"],
        objective: "Trace a path and see its probability as a product of stages.",
        difficulty: 1,
        prompt: [
          {
            type: "paragraph",
            text: "Tap the path where **both** draws are defective — first row, first child.",
          },
        ],
        visualization: "probability-tree",
        config: {},
        solvedWhen: "leaf:d-d",
        hints: [{ text: "That is the path reading *1st draw: defective*, then *2nd: defective*." }],
        solution: [
          {
            type: "paragraph",
            text: "The path multiplies to $\\frac{3}{10} \\times \\frac{2}{9} = \\frac{1}{15}$, the answer you predicted on the previous screen.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "Every one of the four paths is a product of its stages, and the four products add to 1 — they are the only four ways the experiment can finish.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "A path is a product",
          text: "A tree turns a sequence of events into a sequence of multiplications. That is the multiplication rule, before anyone writes it down.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 3. Formalize
    // -----------------------------------------------------------------
    {
      id: "cp02-formalize",
      kind: "formalize",
      title: "The multiplication rule",
      intro: [
        {
          type: "paragraph",
          text: "The definition of conditional probability, rearranged, stops being a way to *compute* $P(A \\mid B)$ and becomes a way to *use* it:",
        },
        { type: "math", tex: "P(A \\cap B) = P(A)\\, P(B \\mid A)" },
        {
          type: "paragraph",
          text: "Read left to right, that is the sentence: *first $A$ happens, then $B$ happens given that it did.* Extended to three stages it reads the same way:",
        },
        {
          type: "math",
          tex: "P(A_1 \\cap A_2 \\cap A_3) = P(A_1)\\, P(A_2 \\mid A_1)\\, P(A_3 \\mid A_1 \\cap A_2)",
        },
        {
          type: "paragraph",
          text: "Each factor conditions on **everything** that came before it, which is exactly what walking down one branch of the tree does.",
        },
        {
          type: "callout",
          tone: "warning",
          title: "This is not $P(A)P(B)$",
          text: "The product $P(A)\\,P(B)$ is the special case where $B$ does not depend on $A$. Writing it when the draws are without replacement is the most common error in this topic.",
        },
      ],
      derivation: {
        title: "Why the order does not matter",
        blocks: [
          {
            type: "paragraph",
            text: "The definition of conditional probability can be rearranged in two directions, because $A \\cap B$ and $B \\cap A$ are the same event:",
          },
          { type: "math", tex: "P(A \\cap B) = P(A)\\, P(B \\mid A) = P(B)\\, P(A \\mid B)" },
          {
            type: "paragraph",
            text: "So a two-stage experiment can be chained in either order and must give the same answer. For the fuses, drawing the tree the other way round gives",
          },
          {
            type: "math",
            tex: "P(D_2)\\, P(D_1 \\mid D_2) = \\frac{3}{10} \\times \\frac{2}{9} = \\frac{1}{15}",
          },
          {
            type: "paragraph",
            text: "which is the same number, even though $P(D_1 \\mid D_2)$ conditions on something that happens *later in time*. Conditioning is about information, not chronology — a point that becomes the whole of Bayes' theorem two lessons from now.",
          },
          {
            type: "paragraph",
            text: "The general chain rule follows by induction. Writing $B_k = A_1 \\cap \\cdots \\cap A_k$, each step peels off one factor:",
          },
          {
            type: "math",
            tex: "P(B_n) = P(B_{n-1})\\, P(A_n \\mid B_{n-1}) = \\prod_{k=1}^{n} P(A_k \\mid B_{k-1})",
          },
          {
            type: "paragraph",
            text: "with $B_0 = \\Omega$, so the first factor is the unconditional $P(A_1)$. Every factor is well defined as long as $P(B_{n-1}) > 0$.",
          },
        ],
      },
    },

    // -----------------------------------------------------------------
    // 4. Apply
    // -----------------------------------------------------------------
    {
      id: "cp02-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "A bag contains 5 red marbles and 3 blue marbles. You draw two marbles without replacement.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "cp02-ex-apply",
        conceptIds: ["multiplication-rule"],
        objective: "Apply the two-stage multiplication rule to sampling without replacement.",
        difficulty: 2,
        prompt: [
          {
            type: "stats",
            items: [
              { label: "Red marbles", value: "5" },
              { label: "Blue marbles", value: "3" },
            ],
          },
          {
            type: "paragraph",
            text: "What is the probability that **both** marbles are red? Give a probability between 0 and 1, as a decimal or a fraction.",
          },
        ],
        value: 5 / 14,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          { text: "There are 8 marbles in total. What is the probability the first one is red?" },
          {
            text: "After one red marble is removed, 4 red remain among 7 marbles, so the second stage is $4/7$.",
          },
          { text: "Multiply: $\\frac{5}{8} \\times \\frac{4}{7}$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Let $R_1$ and $R_2$ be the events that the first and second marbles are red. There are $5 + 3 = 8$ marbles to start.",
          },
          { type: "math", tex: "P(R_1) = \\frac{5}{8}, \\qquad P(R_2 \\mid R_1) = \\frac{4}{7}" },
          {
            type: "math",
            tex: "P(R_1 \\cap R_2) = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14} \\approx 0.357",
          },
          {
            type: "paragraph",
            text: "Both the numerator and the denominator dropped by one between the stages, because the marble that left was red and it left the bag.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Count what is left, not what you started with",
          text: "At every stage, ask two questions: how many outcomes are still favourable, and how many are still possible? Sampling without replacement changes both.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 5. Reason
    // -----------------------------------------------------------------
    {
      id: "cp02-reason",
      kind: "reflect",
      title: "Conditioning backwards",
      intro: [
        {
          type: "paragraph",
          text: "You worked out $P(R_1 \\cap R_2)$ by going forwards: the first marble, then the second given the first.",
        },
        {
          type: "paragraph",
          text: "A classmate does it the other way. They compute $P(R_2)$ — the probability the **second** marble is red, before knowing anything about the first — and then multiply by $P(R_1 \\mid R_2)$, the probability the first was red *given that the second was*. They get the same answer.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp02-ex-reason",
        conceptIds: ["multiplication-rule", "conditional-probability"],
        objective: "Recognise that conditioning is about information, not time order.",
        difficulty: 3,
        prompt: [{ type: "paragraph", text: "Is their method sound?" }],
        choices: [
          {
            id: "a",
            label: "Yes — both orderings compute $P(R_1 \\cap R_2)$",
            correct: true,
          },
          {
            id: "b",
            label: "No — you cannot condition on an event that happens later",
            misconception:
              "Conditioning is about what you know, not when things occur. $P(R_1 \\mid R_2)$ asks: among the worlds where the second marble was red, in what share was the first one red too? That is a perfectly ordinary question about a sample space.",
          },
          {
            id: "c",
            label: "Only if the two draws are independent",
            misconception:
              "Independence is not needed. $P(A \\cap B) = P(B)P(A \\mid B)$ is just the definition of conditional probability rearranged, and it holds for any events with $P(B) > 0$. Here the draws are plainly *not* independent.",
          },
          {
            id: "d",
            label: "Yes, but only because both marbles are the same colour",
            misconception:
              "The symmetry has nothing to do with the colours matching. $P(A \\cap B) = P(A)P(B \\mid A) = P(B)P(A \\mid B)$ holds for every pair of events.",
          },
        ],
        hints: [
          { text: "Write out the definition of $P(R_1 \\mid R_2)$ and clear the denominator." },
          {
            text: "You get $P(R_2)\\,P(R_1 \\mid R_2) = P(R_1 \\cap R_2)$ — the same intersection, approached from the other side.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Both orderings are the definition of conditional probability, rearranged:",
          },
          {
            type: "math",
            tex: "P(R_1 \\cap R_2) = P(R_1)\\,P(R_2 \\mid R_1) = P(R_2)\\,P(R_1 \\mid R_2)",
          },
          {
            type: "paragraph",
            text: "By symmetry $P(R_2) = 5/8$ as well — before you look at anything, the second marble is just as likely to be red as the first. So $P(R_1 \\mid R_2) = 4/7$, and the product is $5/14$ again.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Information, not chronology",
          text: "Nothing in the definition of $P(A \\mid B)$ mentions time. Being willing to condition on a later event is what makes it possible to reason from an effect back to its cause — which is where this chain of lessons is heading.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 6. Independent challenge
    // -----------------------------------------------------------------
    {
      id: "cp02-assess",
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
        id: "cp02-ex-assess",
        conceptIds: ["multiplication-rule"],
        objective:
          "Independently translate a stopping condition into a single path, then chain its stages.",
        difficulty: 4,
        prompt: [
          {
            type: "paragraph",
            text: "A box holds 10 components: 6 good and 4 defective. You test them one at a time, without replacement, and you **stop as soon as you find a defective one**.",
          },
          {
            type: "paragraph",
            text: "What is the probability that you need exactly three tests? Give a probability between 0 and 1, as a decimal or a fraction.",
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
          {
            text: "Before any arithmetic: if you stopped on the third test, what must the first two tests have shown?",
          },
          {
            text: "They must both have been good — a defective component at test 1 or 2 would have stopped you earlier. So the only path is good, good, defective.",
          },
          {
            text: "Chain the three stages: $\\frac{6}{10} \\times \\frac{5}{9} \\times \\frac{4}{8}$.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: 'The modelling step comes first. *Exactly three tests* does not mean "a defective one appears somewhere in the first three" — the stopping rule forces a single sequence: good, then good, then defective.',
          },
          {
            type: "math",
            tex: "P(G_1) = \\frac{6}{10}, \\quad P(G_2 \\mid G_1) = \\frac{5}{9}, \\quad P(D_3 \\mid G_1 \\cap G_2) = \\frac{4}{8}",
          },
          {
            type: "paragraph",
            text: "Two good components have left the box before the third test, so 8 remain — and all 4 defective ones are still among them.",
          },
          {
            type: "math",
            tex: "P = \\frac{6}{10} \\times \\frac{5}{9} \\times \\frac{4}{8} = \\frac{120}{720} = \\frac{1}{6} \\approx 0.167",
          },
          {
            type: "paragraph",
            text: "A common wrong turn is to multiply $\\frac{6}{10} \\times \\frac{5}{9} \\times \\frac{4}{8}$ by 3, as though the defective component could land in any of the three positions. It cannot: the rule says you stop, so only the last position is available to it.",
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
