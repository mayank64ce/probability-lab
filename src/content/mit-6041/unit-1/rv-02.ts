/**
 * RV-02 — The Shape of a Random Variable.
 *
 * Probability mass functions. The PMF is introduced as the thing the previous
 * lesson's partition forces into existence: the events {X = x} are disjoint
 * and exhaustive, so their probabilities are a distribution whether or not
 * anyone names it.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { Lesson } from "../../schema";
import { SUM_PMF } from "./rv-01";

export const RV_02: Lesson = {
  id: "RV-02",
  title: "The Shape of a Random Variable",
  blurb: "Collect all the probabilities of a random variable into one object — its distribution.",
  conceptIds: ["probability-mass-functions"],
  prerequisites: ["Discrete random variables", "Probability axioms"],
  estimatedMinutes: 8,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 5: Discrete Random Variables; PMFs; Expectations",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-5/",
      kind: "video",
      note: "Probability mass functions, Prof. John Tsitsiklis",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    {
      id: "rv02-predict",
      kind: "predict",
      title: "How likely is a seven?",
      intro: [
        {
          type: "paragraph",
          text: "$X$ is again the sum of two fair dice. Writing $p_X(x)$ for $P(X = x)$, the eleven numbers $p_X(2), \\ldots, p_X(12)$ describe the variable completely.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv02-ex-predict",
        conceptIds: ["probability-mass-functions"],
        objective: "Compute one value of a PMF from the underlying sample space.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "What is $p_X(7)$?" }],
        choices: [
          { id: "a", label: "$6/36$", correct: true },
          {
            id: "b",
            label: "$1/11$",
            misconception:
              "$1/11$ spreads the probability evenly over the eleven possible sums. They are not equally likely — six outcomes make a 7 and only one makes a 12.",
          },
          {
            id: "c",
            label: "$2/36$",
            misconception:
              "$2/36$ is $p_X(3)$ or $p_X(11)$. Seven is the most likely sum precisely because more ordered pairs produce it than any other value.",
          },
          {
            id: "d",
            label: "$1/2$",
            misconception:
              "A sum of 7 is the single most likely value, but it is still only one of eleven. One in six, not one in two.",
          },
        ],
        hints: [
          { text: "How many ordered pairs sum to 7?" },
          { text: "Six: $(1,6)$ through $(6,1)$." },
          { text: "Out of 36 equally likely outcomes." },
        ],
        solution: [
          { type: "math", tex: "p_X(7) = P(X = 7) = \\frac{6}{36} = \\frac{1}{6}" },
          {
            type: "paragraph",
            text: "Doing this for every value from 2 to 12 produces the whole distribution — which is the object this lesson is about.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "One function instead of eleven questions",
          text: "Rather than asking about each value separately, collect them: $p_X$ is a single function carrying everything there is to know about $X$.",
        },
      ],
    },

    {
      id: "rv02-explore",
      kind: "explore",
      title: "The whole distribution at once",
      intro: [
        {
          type: "paragraph",
          text: "Here is $p_X$ for the sum of two dice, drawn as bars. The height of each bar is the probability of that value.",
        },
        {
          type: "paragraph",
          text: "The triangular shape is not decoration — it is the count of grid cells behind each sum, read off the sample space you saw in the last lesson.",
        },
      ],
      visualization: { key: "pmf-chart", config: { ...SUM_PMF, offerMean: false } },
      exercise: {
        kind: "numeric",
        id: "rv02-ex-explore",
        conceptIds: ["probability-mass-functions"],
        objective: "Read a value off a probability mass function.",
        difficulty: 2,
        prompt: [
          {
            type: "paragraph",
            text: "Read the chart: what is $p_X(4)$? Give a probability between 0 and 1.",
          },
        ],
        value: 1 / 12,
        tolerance: 0.004,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        hints: [
          { text: "Three ordered pairs sum to 4: $(1,3), (2,2), (3,1)$." },
          { text: "$3/36$, which reduces." },
        ],
        solution: [
          { type: "math", tex: "p_X(4) = \\frac{3}{36} = \\frac{1}{12} \\approx 0.083" },
          {
            type: "paragraph",
            text: "Every bar is a count over 36, which is why the eleven bars add to exactly 1.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "The bars climb to a peak at 7 and fall away symmetrically. That shape comes entirely from how many ways each sum can be made — one way to make 2, six ways to make 7, one way to make 12.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "The bars must add to 1",
          text: "The events $\\{X = x\\}$ partition the sample space, so their probabilities add to $P(\\Omega) = 1$. A PMF that does not sum to 1 is not a mistake of judgement — it is a violation of the axioms.",
        },
      ],
    },

    {
      id: "rv02-formalize",
      kind: "formalize",
      title: "The probability mass function",
      intro: [
        {
          type: "paragraph",
          text: "For a discrete random variable $X$, the **probability mass function** is",
        },
        { type: "math", tex: "p_X(x) = P(X = x)" },
        {
          type: "paragraph",
          text: "It obeys exactly two conditions, both inherited from the axioms:",
        },
        {
          type: "list",
          items: [
            "$p_X(x) \\geq 0$ for every $x$ — non-negativity.",
            "$\\sum_x p_X(x) = 1$, the sum running over all values $X$ can take.",
          ],
        },
        {
          type: "paragraph",
          text: "Any function satisfying both *is* the PMF of some random variable. That is a useful licence: you can define a distribution directly, without naming an underlying experiment.",
        },
        {
          type: "paragraph",
          text: "Probabilities of more complicated events come from adding the relevant masses:",
        },
        { type: "math", tex: "P(X \\in A) = \\sum_{x \\in A} p_X(x)" },
        {
          type: "callout",
          tone: "warning",
          title: "Mass, not density",
          text: "Each $p_X(x)$ is a genuine probability, so it can never exceed 1. When continuous random variables arrive in Unit II their densities *can* exceed 1, because they are no longer probabilities of single values.",
        },
      ],
      visualization: { key: "pmf-chart", config: { ...SUM_PMF, offerMean: false } },
      derivation: {
        title: "Why the masses sum to 1",
        blocks: [
          {
            type: "paragraph",
            text: "Let $x_1, x_2, \\ldots$ be the values $X$ can take. The events $\\{X = x_i\\}$ are disjoint — one run of the experiment produces one outcome, and that outcome has one value of $X$.",
          },
          {
            type: "paragraph",
            text: "They are also exhaustive, since every outcome is sent somewhere by $X$. So they partition $\\Omega$, and additivity applies with no correction terms:",
          },
          {
            type: "math",
            tex: "\\sum_i p_X(x_i) = \\sum_i P(X = x_i) = P(\\Omega) = 1",
          },
          {
            type: "paragraph",
            text: "This is the same partition argument behind the total probability theorem, applied to the partition a random variable generates for free.",
          },
          {
            type: "paragraph",
            text: "For a finite, equally likely sample space the masses are just counts:",
          },
          {
            type: "math",
            tex: "p_X(x) = \\frac{\\#\\{\\omega : X(\\omega) = x\\}}{|\\Omega|}",
          },
          {
            type: "paragraph",
            text: "which is why the two-dice PMF is a triangle: the counts $1,2,3,4,5,6,5,4,3,2,1$ sum to 36.",
          },
        ],
      },
    },

    {
      id: "rv02-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "A different experiment, with a distribution you will meet many times again.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "rv02-ex-apply",
        conceptIds: ["probability-mass-functions"],
        objective: "Build one value of a PMF by counting equally likely sequences.",
        difficulty: 3,
        prerequisites: ["probability-mass-functions", "counting"],
        prompt: [
          {
            type: "paragraph",
            text: "A fair coin is flipped three times. Let $H$ be the number of heads.",
          },
          {
            type: "paragraph",
            text: "What is $p_H(2)$? Give a probability between 0 and 1.",
          },
        ],
        value: 0.375,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        hints: [
          { text: "There are $2^3 = 8$ equally likely sequences of three flips." },
          { text: "How many of them contain exactly two heads? Choose which flips are heads." },
          { text: "$\\binom{3}{2} = 3$ sequences out of 8." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "All eight sequences are equally likely, so count the favourable ones:",
          },
          { type: "math", tex: "\\{HHT,\\; HTH,\\; THH\\}" },
          { type: "math", tex: "p_H(2) = \\frac{\\binom{3}{2}}{2^3} = \\frac{3}{8} = 0.375" },
          {
            type: "paragraph",
            text: "The whole PMF is $1/8, 3/8, 3/8, 1/8$ for $0,1,2,3$ heads — which does add to 1.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Counting reappears",
          text: "The binomial coefficient from FN-03 is doing the work. A PMF is often just a counting argument, one value at a time.",
        },
      ],
    },

    {
      id: "rv02-reason",
      kind: "reflect",
      title: "Is this a distribution?",
      intro: [
        {
          type: "paragraph",
          text: "Someone proposes a random variable $X$ taking the values $1, 2, 3, 4$, with",
        },
        { type: "math", tex: "p_X(x) = \\frac{x}{10}" },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv02-ex-reason",
        conceptIds: ["probability-mass-functions"],
        objective: "Test a candidate PMF against the two conditions.",
        difficulty: 3,
        prompt: [{ type: "paragraph", text: "Is this a valid PMF?" }],
        choices: [
          {
            id: "a",
            label: "Yes — the values are non-negative and sum to 1",
            correct: true,
          },
          {
            id: "b",
            label: "No — the probabilities are not all equal",
            misconception:
              "Nothing requires a PMF to be uniform. The sum of two dice is a perfectly good random variable with wildly unequal masses.",
          },
          {
            id: "c",
            label: "No — $p_X(4) = 0.4$ is too large",
            misconception:
              "A mass may be anything up to 1. $0.4$ is a legitimate probability, and here the other three leave exactly enough room for it.",
          },
          {
            id: "d",
            label: "Only if $X$ comes from some actual experiment",
            misconception:
              "No experiment needs to be named. Any non-negative function summing to 1 is the PMF of some random variable — one can always be constructed.",
          },
        ],
        hints: [
          { text: "There are exactly two conditions. Check them both." },
          { text: "Add the four masses: $\\frac{1 + 2 + 3 + 4}{10}$." },
        ],
        solution: [
          { type: "paragraph", text: "Both conditions hold. Each mass is positive, and" },
          {
            type: "math",
            tex: "\\sum_{x=1}^{4} \\frac{x}{10} = \\frac{1 + 2 + 3 + 4}{10} = \\frac{10}{10} = 1",
          },
          {
            type: "paragraph",
            text: "So it is a valid PMF, describing a variable four times as likely to be 4 as to be 1. Validity is purely arithmetic — it says nothing about whether the model is a good description of anything.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Two conditions, no more",
          text: "Non-negative, and sums to 1. Any function clearing that bar is a distribution; everything else — shape, symmetry, where the mass sits — is modelling, not legality.",
        },
      ],
    },

    {
      id: "rv02-assess",
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
        id: "rv02-ex-assess",
        conceptIds: ["probability-mass-functions"],
        objective:
          "Independently build a PMF value for a biased repeated trial, combining counting with unequal outcome probabilities.",
        difficulty: 4,
        prerequisites: ["probability-mass-functions", "counting", "independence"],
        prompt: [
          {
            type: "paragraph",
            text: "A **biased** coin lands heads with probability $0.3$. It is flipped four times, independently. Let $H$ be the number of heads.",
          },
          {
            type: "paragraph",
            text: "What is $p_H(2)$? Give a probability between 0 and 1, to three decimal places.",
          },
        ],
        value: 0.2646,
        tolerance: 0.004,
        unit: "probability",
        acceptFraction: true,
        placeholder: "e.g. 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: "The sequences are no longer equally likely, so counting them is not enough — each one needs its own probability.",
          },
          {
            text: "Any particular sequence with two heads and two tails has probability $(0.3)^2 (0.7)^2$, by independence.",
          },
          {
            text: "There are $\\binom{4}{2} = 6$ such sequences, so multiply.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Two things have to be combined: how many sequences have two heads, and how likely each one is.",
          },
          {
            type: "paragraph",
            text: "By independence, any specific sequence with two heads and two tails has probability",
          },
          { type: "math", tex: "(0.3)^2 (0.7)^2 = 0.09 \\times 0.49 = 0.0441" },
          {
            type: "paragraph",
            text: "The sequences are disjoint events of equal probability, and there are $\\binom{4}{2} = 6$ of them, so their probabilities add:",
          },
          {
            type: "math",
            tex: "p_H(2) = \\binom{4}{2}(0.3)^2(0.7)^2 = 6 \\times 0.0441 = 0.2646",
          },
          {
            type: "paragraph",
            text: "Answering $0.0441$ forgets that six different sequences qualify. Answering $6/16$ assumes a fair coin, which this one is not.",
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
