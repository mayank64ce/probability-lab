/**
 * RV-06 — Two Variables at Once.
 *
 * Joint PMFs, marginals and conditional PMFs. The running example is a pair
 * that is obviously dependent — the first die and the sum — because a joint
 * distribution is only interesting when it is not the product of its margins.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { Lesson } from "../../schema";

export const RV_06: Lesson = {
  id: "RV-06",
  title: "Two Variables at Once",
  blurb: "Describe a pair of random variables together, and recover each one from the pair.",
  conceptIds: ["joint-pmfs"],
  prerequisites: ["Probability mass functions", "Conditional probability"],
  estimatedMinutes: 9,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 6: Discrete Random Variable Examples; Joint PMFs",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-6/",
      kind: "video",
      note: "Joint and marginal PMFs, Prof. John Tsitsiklis",
    },
    {
      label: "Lecture 7: Multiple Discrete Random Variables",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-7/",
      kind: "video",
      note: "Conditioning one random variable on another",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    {
      id: "rv06-predict",
      kind: "predict",
      title: "Two variables, one experiment",
      intro: [
        {
          type: "paragraph",
          text: "Roll two dice. Let $X$ be the **first** die and $Y$ the **sum** of both. These live on the same experiment, and they are clearly not unrelated — a large $X$ makes a large $Y$ more likely.",
        },
        {
          type: "paragraph",
          text: "Separately, $p_X(3) = 1/6$ and $p_Y(4) = 3/36 = 1/12$.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv06-ex-predict",
        conceptIds: ["joint-pmfs"],
        objective: "Compute a joint probability and see that it is not the product of the margins.",
        difficulty: 3,
        prompt: [
          {
            type: "paragraph",
            text: "What is $P(X = 3 \\text{ and } Y = 4)$ — the first die shows 3 **and** the sum is 4?",
          },
        ],
        choices: [
          { id: "a", label: "$1/36$", correct: true },
          {
            id: "b",
            label: "$1/72$",
            misconception:
              "$1/72$ is $p_X(3)\\,p_Y(4)$, which would be the answer if $X$ and $Y$ were independent. They are not — the sum is built from the first die, so multiplying the margins is not allowed here.",
          },
          {
            id: "c",
            label: "$1/12$",
            misconception:
              "$1/12$ is $p_Y(4)$ on its own, ignoring the requirement that the first die shows 3. Only one of the three ways to make a sum of 4 starts with a 3.",
          },
          {
            id: "d",
            label: "$0$",
            misconception:
              "It is perfectly possible: first die 3, second die 1 gives a sum of 4. Impossible pairs do exist here — $X = 3$ with $Y = 2$, for instance — but this is not one.",
          },
        ],
        hints: [
          {
            text: "Both conditions must hold at once. If the first die is 3 and the sum is 4, what is the second die?",
          },
          { text: "It must be 1 — so the event is the single outcome $(3,1)$." },
          { text: "One cell out of 36." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Fixing both $X$ and $Y$ fixes the whole outcome: the first die is 3 and the second must be $4 - 3 = 1$.",
          },
          { type: "math", tex: "P(X = 3, Y = 4) = P\\big((3,1)\\big) = \\frac{1}{36}" },
          {
            type: "paragraph",
            text: "Compare with the product of the margins, $\\tfrac{1}{6} \\cdot \\tfrac{1}{12} = \\tfrac{1}{72}$. The two differ, which is exactly what it means for $X$ and $Y$ to be dependent.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "The joint is its own object",
          text: "Knowing each variable separately does not tell you how they move together. The joint PMF carries information the two margins simply do not contain.",
        },
      ],
    },

    {
      id: "rv06-explore",
      kind: "explore",
      title: "Rows, columns and cells",
      intro: [
        {
          type: "paragraph",
          text: "Take the simpler pair for a moment: $X$ the first die, $Y$ the second. The grid is their joint distribution — every cell is one $(x, y)$ combination.",
        },
        {
          type: "paragraph",
          text: "A single value of $X$ is a whole **row**, a single value of $Y$ a whole **column**, and the joint event is where they cross.",
        },
      ],
      visualization: {
        key: "outcome-grid",
        config: {
          rows: 6,
          cols: 6,
          rowLabel: "X (first die)",
          colLabel: "Y (second die)",
          views: [
            { id: "x3", label: "X = 3", rule: { kind: "row", value: 3 } },
            { id: "y5", label: "Y = 5", rule: { kind: "col", value: 5 } },
            { id: "joint", label: "X = 3 and Y = 5", rule: { kind: "cells", cells: [[3, 5]] } },
          ],
        },
      },
      exercise: {
        kind: "visual",
        id: "rv06-ex-explore",
        conceptIds: ["joint-pmfs"],
        objective: "See a marginal as a row or column and a joint value as a single cell.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "Select **X = 3 and Y = 5** to continue." }],
        visualization: "outcome-grid",
        config: {},
        solvedWhen: "joint",
        hints: [{ text: "Use the buttons above the grid." }],
        solution: [
          {
            type: "paragraph",
            text: "The row has 6 cells and the column has 6, but the joint event has just one — the cell where they cross, with probability $1/36$.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "Here $\\tfrac{1}{36} = \\tfrac{1}{6} \\cdot \\tfrac{1}{6}$, so these two dice *are* independent. That is a property of this particular pair, not of joint distributions in general — swap $Y$ for the sum and it fails immediately.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Summing a row gives a margin",
          text: "Add every cell in row $x$ and you recover $p_X(x)$. The margins are always computable from the joint; the reverse is not true.",
        },
      ],
    },

    {
      id: "rv06-formalize",
      kind: "formalize",
      title: "Joint, marginal, conditional",
      intro: [
        {
          type: "paragraph",
          text: "For two discrete random variables on the same sample space, the **joint PMF** is",
        },
        { type: "math", tex: "p_{X,Y}(x, y) = P(X = x \\text{ and } Y = y)" },
        {
          type: "paragraph",
          text: "It is non-negative and sums to 1 over all pairs. The **marginals** are recovered by summing out the variable you do not care about:",
        },
        {
          type: "math",
          tex: "p_X(x) = \\sum_y p_{X,Y}(x, y), \\qquad p_Y(y) = \\sum_x p_{X,Y}(x, y)",
        },
        {
          type: "paragraph",
          text: "The **conditional PMF** renormalises one row or column so that it sums to 1 again — exactly the move from CP-01, now applied to a slice of the table:",
        },
        {
          type: "math",
          tex: "p_{X \\mid Y}(x \\mid y) = \\frac{p_{X,Y}(x, y)}{p_Y(y)}, \\qquad p_Y(y) > 0",
        },
        {
          type: "paragraph",
          text: "And $X$ and $Y$ are **independent** exactly when the joint factorises everywhere:",
        },
        { type: "math", tex: "p_{X,Y}(x,y) = p_X(x)\\,p_Y(y) \\quad \\text{for all } x, y" },
        {
          type: "callout",
          tone: "warning",
          title: "Margins do not determine the joint",
          text: "Many different joint distributions share the same pair of margins. Summing is a one-way street: you can always go from the joint to the margins, and never back without extra information.",
        },
      ],
      derivation: {
        title: "Two tables, same margins",
        blocks: [
          {
            type: "paragraph",
            text: "Take two variables each taking the values 0 and 1 with probability $1/2$. Here are two joint distributions with exactly those margins.",
          },
          {
            type: "paragraph",
            text: "**Independent.** Every cell is $\\tfrac14$:",
          },
          {
            type: "math",
            tex: "p(0,0) = p(0,1) = p(1,0) = p(1,1) = \\tfrac{1}{4}",
          },
          {
            type: "paragraph",
            text: "**Perfectly dependent.** $Y$ always equals $X$:",
          },
          {
            type: "math",
            tex: "p(0,0) = p(1,1) = \\tfrac{1}{2}, \\qquad p(0,1) = p(1,0) = 0",
          },
          {
            type: "paragraph",
            text: "Both have $p_X(0) = p_X(1) = \\tfrac12$ and the same for $Y$, yet they describe utterly different situations. In the first, learning $X$ tells you nothing; in the second it tells you everything.",
          },
          {
            type: "paragraph",
            text: "So the margins are a genuine loss of information. This is why dependence needs its own machinery — conditional distributions here, and covariance in Unit II.",
          },
          {
            type: "paragraph",
            text: "Finally, note the conditional PMF really is a PMF. Summing it over $x$ gives",
          },
          {
            type: "math",
            tex: "\\sum_x \\frac{p_{X,Y}(x,y)}{p_Y(y)} = \\frac{p_Y(y)}{p_Y(y)} = 1",
          },
          {
            type: "paragraph",
            text: "because the numerator sums to the margin. Conditioning renormalises a slice, precisely as it renormalised a sample space.",
          },
        ],
      },
    },

    {
      id: "rv06-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "Back to the dependent pair: $X$ is the first die, $Y$ is the sum.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "rv06-ex-apply",
        conceptIds: ["joint-pmfs"],
        objective: "Recover a marginal by summing a joint distribution.",
        difficulty: 3,
        prerequisites: ["joint-pmfs"],
        prompt: [
          {
            type: "paragraph",
            text: "Find the marginal $p_Y(4)$ — the probability the sum is 4 — by summing the joint over every value of $X$.",
          },
          { type: "paragraph", text: "Give a probability between 0 and 1." },
        ],
        value: 1 / 12,
        tolerance: 0.004,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        hints: [
          { text: "Which values of $X$ can produce a sum of 4?" },
          { text: "Only $X = 1, 2, 3$ — each contributing a single cell of probability $1/36$." },
          { text: "$3/36$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Sum the joint over $x$, remembering that most cells are zero — a sum of 4 is impossible once the first die exceeds 3:",
          },
          {
            type: "math",
            tex: "p_Y(4) = \\sum_x p_{X,Y}(x, 4) = \\tfrac{1}{36} + \\tfrac{1}{36} + \\tfrac{1}{36} = \\tfrac{3}{36} = \\tfrac{1}{12}",
          },
          {
            type: "paragraph",
            text: "Which matches the PMF of the sum from RV-02, as it must — the marginal of a joint is the distribution you would have written down on its own.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Summing out is always available",
          text: "Whatever joint distribution you are handed, the margins follow by addition. The work is in deciding which cells are non-zero.",
        },
      ],
    },

    {
      id: "rv06-reason",
      kind: "reflect",
      title: "Can you go backwards?",
      intro: [
        {
          type: "paragraph",
          text: "A colleague has measured the distribution of $X$ and the distribution of $Y$ separately, and wants the joint distribution of the pair.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv06-ex-reason",
        conceptIds: ["joint-pmfs", "independence"],
        objective: "Recognise that marginals underdetermine the joint distribution.",
        difficulty: 4,
        prompt: [
          { type: "paragraph", text: "Can the joint PMF be reconstructed from the two marginals?" },
        ],
        choices: [
          {
            id: "a",
            label: "No — unless the variables are known to be independent",
            correct: true,
          },
          {
            id: "b",
            label: "Yes — multiply them together",
            misconception:
              "Multiplying gives *a* joint distribution with those margins, namely the independent one. It is rarely the right one: the first die and the sum have perfectly ordinary margins and a joint full of zeros.",
          },
          {
            id: "c",
            label: "Yes, provided both variables take finitely many values",
            misconception:
              "The number of values is irrelevant. Two variables each taking just 0 and 1 already admit many different joints with identical margins.",
          },
          {
            id: "d",
            label: "No — the joint can never be determined by anything",
            misconception:
              "Too strong. The joint is perfectly determinable from the experiment itself, or from the margins *plus* an independence assumption. What fails is recovering it from the margins alone.",
          },
        ],
        hints: [
          {
            text: "Try to build two different joint tables for a pair of fair coin flips, both with uniform margins.",
          },
          {
            text: "Independent flips, and flips that always agree, have identical margins and completely different joints.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Marginalising destroys information, and no amount of algebra restores it. Two variables uniform on $\\{0,1\\}$ can be independent:",
          },
          { type: "math", tex: "p(x,y) = \\tfrac14 \\text{ for all four pairs}" },
          { type: "paragraph", text: "or perfectly matched:" },
          { type: "math", tex: "p(0,0) = p(1,1) = \\tfrac12, \\quad p(0,1) = p(1,0) = 0" },
          {
            type: "paragraph",
            text: "Identical margins, opposite dependence structures. Multiplying the margins always yields the first of these — so doing it silently is an independence assumption, whether or not it is declared.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Multiplying margins is an assumption",
          text: "Whenever you write $p_{X,Y} = p_X p_Y$ you have assumed independence. It is often reasonable and occasionally disastrous, but it is never free.",
        },
      ],
    },

    {
      id: "rv06-assess",
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
        id: "rv06-ex-assess",
        conceptIds: ["joint-pmfs"],
        objective:
          "Independently compute a conditional PMF value by renormalising a slice of a joint distribution.",
        difficulty: 4,
        prerequisites: ["joint-pmfs", "conditional-probability"],
        prompt: [
          {
            type: "paragraph",
            text: "Two fair dice are rolled. $X$ is the first die and $Y$ is the sum. You are told that $Y = 9$.",
          },
          {
            type: "paragraph",
            text: "What is $P(X = 4 \\mid Y = 9)$? Give a probability between 0 and 1.",
          },
        ],
        value: 0.25,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          { text: "List every outcome with a sum of 9. The condition rules out everything else." },
          {
            text: "They are $(3,6), (4,5), (5,4), (6,3)$ — four equally likely outcomes.",
          },
          { text: "In how many of those four is the first die a 4?" },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Conditioning on $Y = 9$ restricts the sample space to the outcomes that produce it, all equally likely:",
          },
          { type: "math", tex: "\\{(3,6),\\; (4,5),\\; (5,4),\\; (6,3)\\}" },
          {
            type: "paragraph",
            text: "Exactly one of those has $X = 4$, so renormalising the slice gives",
          },
          {
            type: "math",
            tex: "p_{X \\mid Y}(4 \\mid 9) = \\frac{p_{X,Y}(4,9)}{p_Y(9)} = \\frac{1/36}{4/36} = \\frac{1}{4}",
          },
          {
            type: "paragraph",
            text: "Answering $1/6$ gives the unconditional $p_X(4)$ and ignores the information. Note also that the condition has made some values of $X$ impossible — $X = 1$ and $X = 2$ cannot reach 9 — which is the dependence showing itself.",
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
