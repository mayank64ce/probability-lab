/**
 * CP-04 — Reasoning Backwards.
 *
 * Bayes' theorem, introduced as the question the CP-03 tree leaves hanging:
 * you know which machine causes which defect rate, but when a defective
 * component lands on your desk, which machine did it come from?
 *
 * The explore screen is deliberately the *same figure* as CP-03, with the
 * per-path shares switched on — so inverting a conditional is visibly the same
 * act as conditioning on the tree and renormalising.
 *
 * All problems are original, written for this curriculum. MIT OCW material is
 * linked, never reproduced.
 */

import type { Lesson } from "../../schema";
import { FACTORY_TREE } from "./cp-03";

export const CP_04: Lesson = {
  id: "CP-04",
  title: "Reasoning Backwards",
  blurb: "Invert a conditional probability to infer a hidden cause from the effect you observed.",
  conceptIds: ["bayes-theorem"],
  prerequisites: ["Conditional probability", "The multiplication rule", "Total probability"],
  estimatedMinutes: 10,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 2: Conditioning and Bayes' Rule",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-2/",
      kind: "video",
      note: "Bayes' rule and inference, Prof. John Tsitsiklis",
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
      id: "cp04-predict",
      kind: "predict",
      title: "Which machine made it?",
      intro: [
        {
          type: "paragraph",
          text: "The same factory as the last lesson. Machine A makes half the output and fails 1% of the time; B makes 40% and fails 3%; C makes a tenth and fails 10%.",
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
          text: "A single **defective** component arrives at your desk. You know nothing else about it.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp04-ex-predict",
        conceptIds: ["bayes-theorem"],
        objective: "Commit to an intuition about inferring a cause from an observed effect.",
        difficulty: 3,
        prompt: [
          {
            type: "paragraph",
            text: "What is the probability it was made by **Machine B**?",
          },
        ],
        choices: [
          { id: "a", label: "About 44%", correct: true },
          {
            id: "b",
            label: "40%",
            misconception:
              "That is $P(B)$, Machine B's share of output — the answer you would give *before* looking at the component. You have new evidence now: the component is defective. That evidence should move the number, because B is more failure-prone than A.",
          },
          {
            id: "c",
            label: "3%",
            misconception:
              "That is $P(\\text{defective} \\mid B)$, the chance a Machine B component is faulty. You were asked for the reverse: $P(B \\mid \\text{defective})$. Swapping the two sides of a conditional is the central error this lesson exists to prevent.",
          },
          {
            id: "d",
            label: "1.2%",
            misconception:
              "That is the joint probability $P(B \\cap \\text{defective}) = (0.4)(0.03)$ — the share of *all* output that is both from B and defective. The question restricts attention to defective components only, so 1.2% needs to be rescaled against the defective total.",
          },
        ],
        hints: [
          {
            text: "Out of 1000 components, how many are defective? And how many of those came from Machine B?",
          },
          {
            text: "27 defective in total: 5 from A, 12 from B, 10 from C.",
          },
          { text: "So the answer is $12/27$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Conditioning on *defective* throws away 973 of every 1000 components. Among the 27 that remain, Machine B made 12:",
          },
          {
            type: "math",
            tex: "P(B \\mid D) = \\frac{P(B \\cap D)}{P(D)} = \\frac{(0.4)(0.03)}{0.027} = \\frac{0.012}{0.027} = \\frac{4}{9} \\approx 44.4\\%",
          },
          {
            type: "paragraph",
            text: "The evidence moved Machine B from 40% to 44% — upwards, because B is worse than average, but only slightly, because B is only slightly worse than average.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "The evidence updates the share",
          text: "You started believing Machine B made 40% of components. Seeing a defect nudged that to about 44%. Bayes' theorem is the arithmetic of exactly that nudge.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 2. Explore
    // -----------------------------------------------------------------
    {
      id: "cp04-explore",
      kind: "explore",
      title: "The same tree, read backwards",
      intro: [
        {
          type: "paragraph",
          text: "This is the identical tree from the last lesson — nothing about the factory has changed. What has changed is what you know.",
        },
        {
          type: "paragraph",
          text: "Switch to the defective paths. Last time you read off their **sum**. This time read the badge on each surviving path: its share of that sum.",
        },
      ],
      visualization: {
        key: "probability-tree",
        config: { ...FACTORY_TREE, showShares: true },
      },
      exercise: {
        kind: "visual",
        id: "cp04-ex-explore",
        conceptIds: ["bayes-theorem"],
        objective: "See the posterior as each path's share of the conditioned total.",
        difficulty: 2,
        prompt: [
          {
            type: "paragraph",
            text: "Switch to **Only defective paths** to continue.",
          },
        ],
        visualization: "probability-tree",
        config: {},
        solvedWhen: "conditioned",
        hints: [{ text: "Use the toggle above the tree, as in the previous lesson." }],
        solution: [
          {
            type: "paragraph",
            text: "The three defective paths are $0.005$, $0.012$ and $0.010$, summing to $0.027$. Their shares of that total are $18.5\\%$, $44.4\\%$ and $37\\%$ — and those three add back to $100\\%$.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "Machine C is the striking one. It makes only 10% of the output, yet it is responsible for 37% of the defects — nearly as many as Machine B, which makes four times as much.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Bayes is conditioning, then renormalising",
          text: "This is the same move as CP-01's dimmed students: keep only the outcomes consistent with what you observed, then rescale so they add to 1. The three shares are the posterior probabilities, and nothing new has been assumed to get them.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 3. Formalize
    // -----------------------------------------------------------------
    {
      id: "cp04-formalize",
      kind: "formalize",
      title: "Bayes' theorem",
      intro: [
        {
          type: "paragraph",
          text: "Let $A_1, \\ldots, A_n$ partition the sample space — the possible causes — and let $B$ be the thing you observed. Then for each $i$:",
        },
        {
          type: "math",
          tex: "P(A_i \\mid B) = \\frac{P(A_i)\\, P(B \\mid A_i)}{\\sum_{j} P(A_j)\\, P(B \\mid A_j)}",
        },
        { type: "paragraph", text: "Every piece of that has a name and a job:" },
        {
          type: "list",
          items: [
            "$P(A_i)$ — the **prior**. What you believed before the evidence arrived.",
            "$P(B \\mid A_i)$ — the **likelihood**. How well cause $i$ explains what you saw.",
            "The denominator — the **total probability of the evidence**, from the last lesson. It is the same for every $i$, and its only job is to make the posteriors sum to 1.",
            "$P(A_i \\mid B)$ — the **posterior**. What you believe now.",
          ],
        },
        {
          type: "paragraph",
          text: "So the numerator is prior times likelihood, and the denominator is just the sum of all the numerators. That is why the shares you read off the tree *were* the answer.",
        },
        {
          type: "callout",
          tone: "warning",
          title: "$P(A \\mid B)$ and $P(B \\mid A)$ are different numbers",
          text: "Here $P(D \\mid C) = 10\\%$ but $P(C \\mid D) = 37\\%$. They are not interchangeable, and they are not even usually close. Nearly every misuse of this theorem in the wild is this one confusion.",
        },
      ],
      visualization: {
        key: "probability-tree",
        config: { ...FACTORY_TREE, showShares: true },
      },
      derivation: {
        title: "Two lines, from things you already have",
        blocks: [
          {
            type: "paragraph",
            text: "Write the multiplication rule in both directions for the same intersection, exactly as in CP-02:",
          },
          { type: "math", tex: "P(A_i \\cap B) = P(B)\\,P(A_i \\mid B) = P(A_i)\\,P(B \\mid A_i)" },
          {
            type: "paragraph",
            text: "Divide through by $P(B)$, which is legitimate whenever $P(B) > 0$:",
          },
          { type: "math", tex: "P(A_i \\mid B) = \\frac{P(A_i)\\,P(B \\mid A_i)}{P(B)}" },
          {
            type: "paragraph",
            text: "That is already Bayes' theorem. The familiar form just substitutes the total probability theorem for the denominator, because in practice $P(B)$ is rarely handed to you directly:",
          },
          {
            type: "math",
            tex: "P(B) = \\sum_{j=1}^{n} P(A_j)\\, P(B \\mid A_j)",
          },
          {
            type: "paragraph",
            text: "So the theorem is not a new principle. It is the multiplication rule read in the inconvenient direction, with the previous lesson plugged into the bottom. Everything hard about it is in the interpretation, not the algebra.",
          },
          {
            type: "paragraph",
            text: "One useful consequence: since the denominator does not depend on $i$, the posteriors are proportional to the numerators alone.",
          },
          { type: "math", tex: "P(A_i \\mid B) \\propto P(A_i)\\, P(B \\mid A_i)" },
          {
            type: "paragraph",
            text: "To compare two causes you can skip the denominator entirely and compare prior times likelihood — which is why the odds form of the theorem is often quicker by hand.",
          },
        ],
      },
    },

    // -----------------------------------------------------------------
    // 4. Apply
    // -----------------------------------------------------------------
    {
      id: "cp04-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "A disease affects 1 in 100 people. A screening test is good, but not perfect.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "cp04-ex-apply",
        conceptIds: ["bayes-theorem"],
        objective:
          "Apply Bayes' theorem where the prior is small enough that the posterior defies intuition.",
        difficulty: 3,
        prompt: [
          {
            type: "stats",
            items: [
              { label: "Have the disease", value: "1%" },
              { label: "Test positive, if you have it", value: "99%" },
              { label: "Test positive, if you do not", value: "5%" },
            ],
          },
          {
            type: "paragraph",
            text: "A randomly chosen person tests positive. What percentage chance is there that they actually have the disease? Round to the nearest whole percent.",
          },
        ],
        value: 16.67,
        tolerance: 0.6,
        unit: "percent",
        acceptFraction: true,
        placeholder: "e.g. 25 or 25%",
        unitSlipFeedback:
          "Your number is right but the unit is not: the question asks for a percentage, so multiply by 100.",
        hints: [
          {
            text: "Picture 10 000 people. How many have the disease, and how many of those test positive?",
          },
          {
            text: "100 have it and about 99 of them test positive. But 9900 do not have it, and 5% of those — 495 people — also test positive.",
          },
          {
            text: "Of the $99 + 495 = 594$ positive tests, only 99 are true positives: $99/594$.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Let $H$ be *has the disease* and $+$ be *tests positive*. First get the probability of the evidence, using total probability over $H$ and $H^c$:",
          },
          {
            type: "math",
            tex: "P(+) = (0.01)(0.99) + (0.99)(0.05) = 0.0099 + 0.0495 = 0.0594",
          },
          { type: "paragraph", text: "Then invert:" },
          {
            type: "math",
            tex: "P(H \\mid +) = \\frac{(0.01)(0.99)}{0.0594} = \\frac{0.0099}{0.0594} = \\frac{1}{6} \\approx 16.7\\%",
          },
          {
            type: "paragraph",
            text: "A positive result raises the chance from 1% to about 17% — a seventeenfold increase, and still far from a diagnosis.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "The base rate does not go away",
          text: "The test is right 99% of the time on sick people, yet most positives are wrong. That is not a paradox — it is what happens when a small error rate is applied to a very large group.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 5. Reason
    // -----------------------------------------------------------------
    {
      id: "cp04-reason",
      kind: "reflect",
      title: "Why so low?",
      intro: [
        {
          type: "paragraph",
          text: "The test catches 99% of genuine cases, and yet a positive result left you at only about one in six.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp04-ex-reason",
        conceptIds: ["bayes-theorem"],
        objective:
          "Attribute a counter-intuitive posterior to the base rate rather than to test quality.",
        difficulty: 4,
        prompt: [{ type: "paragraph", text: "What best explains the low answer?" }],
        choices: [
          {
            id: "a",
            label:
              "Healthy people vastly outnumber sick ones, so a small false-positive rate still produces more false positives than there are true ones",
            correct: true,
          },
          {
            id: "b",
            label: "The test is poorly designed and should be discarded",
            misconception:
              "The test is genuinely informative: it moved your belief from 1% to about 17%, a seventeenfold increase. A low posterior is not the same as a useless test — it reflects how little you knew before.",
          },
          {
            id: "c",
            label: "The 99% figure must be wrong",
            misconception:
              "The 99% is used correctly, and it applies only to the 1% of people who have the disease. It says nothing about the other 99% of the population, whose 5% false-positive rate is what dominates the total.",
          },
          {
            id: "d",
            label: "The prevalence is irrelevant once a test result is known",
            misconception:
              "The prevalence is the prior, and it is doing most of the work. Keep the same test but raise prevalence to 10% and the posterior jumps to about 69% — same test, different population, very different conclusion.",
          },
        ],
        hints: [
          {
            text: "Count the two groups separately in a population of 10 000, and compare how many positives each group produces.",
          },
          {
            text: "99 true positives from the 100 sick people; 495 false positives from the 9900 healthy ones. The healthy group wins on sheer size.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Both groups generate positive tests, and the larger group generates more of them despite its much lower rate:",
          },
          {
            type: "list",
            items: [
              "100 people have the disease; about 99 test positive.",
              "9900 do not; 5% of them — 495 people — test positive anyway.",
            ],
          },
          {
            type: "paragraph",
            text: "So 594 positives, of which 99 are genuine: about one in six. The quality of the test is fine. What is small is the prior, and Bayes' theorem keeps it in the calculation where intuition tends to drop it.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Base-rate neglect",
          text: "Judging a positive result by the test's accuracy alone, and ignoring how rare the condition is, is such a reliable human error that it has a name. The theorem's whole practical value is that it refuses to forget the prior.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 6. Independent challenge
    // -----------------------------------------------------------------
    {
      id: "cp04-assess",
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
        id: "cp04-ex-assess",
        conceptIds: ["bayes-theorem"],
        objective:
          "Independently build the evidence probability and invert it, with no partition supplied.",
        difficulty: 4,
        prompt: [
          {
            type: "paragraph",
            text: "40% of the email arriving at a server is spam. The word *offer* appears in 60% of spam messages, and in 5% of legitimate ones.",
          },
          {
            type: "paragraph",
            text: "A message arrives containing the word *offer*. What is the probability that it is spam? Give a probability between 0 and 1, as a decimal or a fraction.",
          },
        ],
        value: 8 / 9,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: "You are not given the probability that a message contains *offer*. Build it first, from the two cases spam and not-spam.",
          },
          {
            text: "$P(\\text{offer}) = (0.4)(0.6) + (0.6)(0.05) = 0.24 + 0.03 = 0.27$.",
          },
          {
            text: "Now invert: the spam contribution over the total, $0.24 / 0.27$.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Let $S$ be *spam* and $W$ be *contains the word offer*. The two cases $S$ and $S^c$ partition the mail, so the total probability theorem gives the denominator:",
          },
          {
            type: "math",
            tex: "P(W) = P(S)P(W \\mid S) + P(S^c)P(W \\mid S^c) = (0.4)(0.6) + (0.6)(0.05)",
          },
          { type: "math", tex: "P(W) = 0.24 + 0.03 = 0.27" },
          { type: "paragraph", text: "Then Bayes' theorem inverts the conditional:" },
          {
            type: "math",
            tex: "P(S \\mid W) = \\frac{P(S)P(W \\mid S)}{P(W)} = \\frac{0.24}{0.27} = \\frac{8}{9} \\approx 0.889",
          },
          {
            type: "paragraph",
            text: "The word pushes a message from 40% likely spam to about 89%. Unlike the medical test, the evidence here is strong *and* the prior was not tiny, so the posterior ends up high.",
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
