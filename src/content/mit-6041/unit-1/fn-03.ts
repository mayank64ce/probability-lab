/**
 * FN-03 — Counting Without Listing.
 *
 * Counting methods. The practical skill is deciding whether order matters
 * before reaching for a formula, so the lesson spends its effort there rather
 * than on the algebra of factorials.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { Lesson } from "../../schema";

export const FN_03: Lesson = {
  id: "FN-03",
  title: "Counting Without Listing",
  blurb:
    "Count the outcomes of an experiment too large to write down — and know when order matters.",
  conceptIds: ["counting"],
  prerequisites: ["Sample spaces and events", "Probability axioms"],
  estimatedMinutes: 9,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 4: Counting",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-4/",
      kind: "video",
      note: "The counting principle, permutations and combinations, Prof. John Tsitsiklis",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    {
      id: "fn03-predict",
      kind: "predict",
      title: "Three letters from five",
      intro: [
        {
          type: "paragraph",
          text: "You have five distinct letter tiles: **A B C D E**. You will lay three of them in a row to make a code.",
        },
        {
          type: "paragraph",
          text: "Order matters — ABC and CBA are different codes — and no tile can be used twice.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "fn03-ex-predict",
        conceptIds: ["counting"],
        objective: "Commit to a count before meeting the formulas.",
        difficulty: 2,
        prompt: [{ type: "paragraph", text: "How many different codes are possible?" }],
        choices: [
          { id: "a", label: "60", correct: true },
          {
            id: "b",
            label: "125",
            misconception:
              "$125 = 5^3$ allows a tile to be reused — AAA would be a code. You only have one of each tile, so the pool shrinks with every position filled.",
          },
          {
            id: "c",
            label: "10",
            misconception:
              "10 is the number of ways to *choose* three tiles when order does not matter. Each of those choices can be laid out in $3! = 6$ orders, and $10 \\times 6 = 60$.",
          },
          {
            id: "d",
            label: "15",
            misconception:
              "$15 = 5 + 5 + 5$ adds the choices for each position. Filling positions one after another multiplies, because every first choice can be followed by every second choice.",
          },
        ],
        hints: [
          { text: "How many tiles can go in the first position?" },
          { text: "Five. Once one is placed, how many remain for the second position?" },
          { text: "$5 \\times 4 \\times 3$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Fill the positions one at a time, and notice the pool shrinking:",
          },
          { type: "math", tex: "5 \\times 4 \\times 3 = 60" },
          {
            type: "paragraph",
            text: "Five choices for the first slot, four remaining for the second, three for the third.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Sequential choices multiply",
          text: "Whenever a process is a sequence of independent choices, the counts multiply. Adding them answers a different question: how many ways to make *one* choice from several pools.",
        },
      ],
    },

    {
      id: "fn03-explore",
      kind: "explore",
      title: "With and without replacement",
      intro: [
        {
          type: "paragraph",
          text: "Here are all the ways to pick an **ordered pair** from five tiles — first pick along one axis, second along the other.",
        },
        {
          type: "paragraph",
          text: "Switch to *No repeats* and watch the diagonal disappear. That diagonal is exactly the outcomes where the same tile was used twice.",
        },
      ],
      visualization: {
        key: "outcome-grid",
        config: {
          rows: 5,
          cols: 5,
          rowLabel: "First pick",
          colLabel: "Second pick",
          views: [
            { id: "all", label: "Repeats allowed", rule: { kind: "all" } },
            { id: "noRepeat", label: "No repeats", rule: { kind: "notMatch" } },
            { id: "same", label: "The repeats", rule: { kind: "match" } },
          ],
        },
      },
      exercise: {
        kind: "visual",
        id: "fn03-ex-explore",
        conceptIds: ["counting"],
        objective: "See sampling without replacement as the removal of the diagonal.",
        difficulty: 1,
        prompt: [{ type: "paragraph", text: "Select **No repeats** to continue." }],
        visualization: "outcome-grid",
        config: {},
        solvedWhen: "noRepeat",
        hints: [{ text: "Use the buttons above the grid." }],
        solution: [
          {
            type: "paragraph",
            text: "With repeats there are $5 \\times 5 = 25$ ordered pairs. Forbidding repeats removes the 5 cells on the diagonal, leaving $5 \\times 4 = 20$.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "Both grids count **ordered** pairs: the cell for *A then B* is distinct from the cell for *B then A*. If order did not matter those two cells would be the same outcome, and the count of 20 would halve to 10.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Two questions, in order",
          text: "Before counting anything, ask: can an item repeat, and does order matter? The four combinations of those answers are the whole of elementary counting.",
        },
      ],
    },

    {
      id: "fn03-formalize",
      kind: "formalize",
      title: "Permutations and combinations",
      intro: [
        {
          type: "paragraph",
          text: "**The counting principle.** If a process has $r$ stages, with $n_1$ choices at the first, $n_2$ at the second and so on, the number of outcomes is the product:",
        },
        { type: "math", tex: "n_1 \\times n_2 \\times \\cdots \\times n_r" },
        {
          type: "paragraph",
          text: "**Permutations.** Choosing $k$ items from $n$ distinct items, order mattering, no repeats:",
        },
        {
          type: "math",
          tex: "n (n-1) \\cdots (n - k + 1) = \\frac{n!}{(n-k)!}",
        },
        {
          type: "paragraph",
          text: "**Combinations.** The same choice when order does **not** matter:",
        },
        { type: "math", tex: "\\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}" },
        {
          type: "callout",
          tone: "warning",
          title: "Order first, formula second",
          text: "The commonest error is not arithmetic. It is reaching for $\\binom{n}{k}$ on a question where order matters, or for a permutation where it does not. Decide that before you write anything down.",
        },
      ],
      derivation: {
        title: "Why combinations divide by $k!$",
        blocks: [
          {
            type: "paragraph",
            text: "Count the ordered selections, then notice how badly they over-count the unordered ones.",
          },
          {
            type: "paragraph",
            text: "There are $\\frac{n!}{(n-k)!}$ ordered selections of $k$ items. Every *set* of $k$ items appears among them once for each way of arranging those $k$ items — and there are $k!$ such arrangements.",
          },
          {
            type: "math",
            tex: "\\#\\{\\text{ordered}\\} = \\#\\{\\text{unordered}\\} \\times k!",
          },
          { type: "paragraph", text: "So dividing undoes exactly that over-count:" },
          {
            type: "math",
            tex: "\\binom{n}{k} = \\frac{1}{k!} \\cdot \\frac{n!}{(n-k)!} = \\frac{n!}{k!\\,(n-k)!}",
          },
          {
            type: "paragraph",
            text: "Check it on the grid you just used: $5 \\times 4 = 20$ ordered pairs, each unordered pair counted $2! = 2$ times, giving $\\binom{5}{2} = 10$.",
          },
          {
            type: "paragraph",
            text: "The same argument explains the symmetry $\\binom{n}{k} = \\binom{n}{n-k}$: choosing which $k$ items to take is the same act as choosing which $n-k$ to leave.",
          },
        ],
      },
    },

    {
      id: "fn03-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "A committee is being formed, and the roles on it are all identical.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "fn03-ex-apply",
        conceptIds: ["counting"],
        objective: "Choose between a permutation and a combination, then evaluate it.",
        difficulty: 2,
        prerequisites: ["counting"],
        prompt: [
          {
            type: "paragraph",
            text: "How many different committees of **3 people** can be formed from a group of **8**? Everyone on the committee has the same role, so the order of selection is irrelevant.",
          },
          { type: "paragraph", text: "Give a whole number." },
        ],
        value: 56,
        tolerance: 0.5,
        unit: "plain",
        acceptFraction: false,
        placeholder: "e.g. 120",
        hints: [
          { text: "Order does not matter here, so this is a combination." },
          { text: "$\\binom{8}{3} = \\frac{8!}{3!\\,5!}$." },
          { text: "$\\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1}$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Identical roles means order is irrelevant, so this is a combination:",
          },
          {
            type: "math",
            tex: "\\binom{8}{3} = \\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = \\frac{336}{6} = 56",
          },
          {
            type: "paragraph",
            text: "Answering $336$ counts ordered selections — which would be right if the three roles were distinct, say chair, secretary and treasurer.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "The same group, two questions",
          text: "Eight people give 336 ordered line-ups of three and 56 committees of three. Nothing about the people changed; only what you decided to count as different.",
        },
      ],
    },

    {
      id: "fn03-reason",
      kind: "reflect",
      title: "Where the division comes from",
      intro: [
        {
          type: "paragraph",
          text: "The permutation count and the combination count differ by a factor of $k!$.",
        },
        { type: "math", tex: "\\frac{n!}{(n-k)!} = k! \\cdot \\binom{n}{k}" },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "fn03-ex-reason",
        conceptIds: ["counting"],
        objective: "Explain the division by k! as a correction for over-counting.",
        difficulty: 3,
        prompt: [{ type: "paragraph", text: "Why is that factor exactly $k!$?" }],
        choices: [
          {
            id: "a",
            label: "Each unordered selection appears once for every arrangement of its $k$ items",
            correct: true,
          },
          {
            id: "b",
            label: "Because there are $k!$ ways to choose the $k$ items",
            misconception:
              "$k!$ counts arrangements of items already chosen, not ways of choosing them. The choosing is what $\\binom{n}{k}$ counts.",
          },
          {
            id: "c",
            label: "Because $k$ items can be removed from the pool in $k!$ orders",
            misconception:
              "The order of removal from the pool does not create distinct ordered selections beyond those already counted — the over-count is in the arrangement of the selected items themselves.",
          },
          {
            id: "d",
            label: "It is a convention that makes the formula symmetric",
            misconception:
              "The symmetry $\\binom{n}{k} = \\binom{n}{n-k}$ is a consequence, not the reason. The division corrects a specific, countable over-count.",
          },
        ],
        hints: [
          {
            text: "Take the set $\\{A, B, C\\}$. How many of the ordered triples from the permutation count use exactly these three letters?",
          },
          { text: "Six — ABC, ACB, BAC, BCA, CAB, CBA. That is $3!$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Every unordered selection of $k$ items shows up in the ordered count once for each of its $k!$ arrangements. So the ordered count is $k!$ times too large, and dividing restores it:",
          },
          {
            type: "math",
            tex: "\\binom{n}{k} = \\frac{1}{k!} \\cdot \\frac{n!}{(n-k)!}",
          },
          {
            type: "paragraph",
            text: "Counting a set of things once for each of its arrangements, then dividing by the number of arrangements, is a pattern that recurs throughout combinatorics.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Over-count deliberately, then divide",
          text: "Counting something easy but redundant, then dividing by the redundancy, is often far simpler than counting the thing you want directly.",
        },
      ],
    },

    {
      id: "fn03-assess",
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
        id: "fn03-ex-assess",
        conceptIds: ["counting"],
        objective:
          "Independently turn a counting argument into a probability over equally likely selections.",
        difficulty: 4,
        prerequisites: ["counting", "sample-spaces"],
        prompt: [
          {
            type: "paragraph",
            text: "A committee of **3** is chosen at random from a group of **5 women and 4 men**, with every committee equally likely.",
          },
          {
            type: "paragraph",
            text: "What is the probability it contains **exactly 2 women**? Give a probability between 0 and 1.",
          },
        ],
        value: 10 / 21,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100.",
        hints: [
          {
            text: "Both the favourable committees and the total committees are counted with combinations — order never matters on a committee.",
          },
          {
            text: "Choose 2 of the 5 women and 1 of the 4 men: $\\binom{5}{2}\\binom{4}{1}$ favourable committees.",
          },
          { text: "Divide by every possible committee, $\\binom{9}{3} = 84$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "All committees are equally likely, so this is counting over counting. The favourable ones are built in two independent stages — pick the women, then pick the man — so the counts multiply:",
          },
          {
            type: "math",
            tex: "\\binom{5}{2}\\binom{4}{1} = 10 \\times 4 = 40",
          },
          {
            type: "paragraph",
            text: "There are 9 people in all, so the total number of committees is",
          },
          { type: "math", tex: "\\binom{9}{3} = 84" },
          {
            type: "math",
            tex: "P(\\text{exactly 2 women}) = \\frac{40}{84} = \\frac{10}{21} \\approx 0.476",
          },
          {
            type: "paragraph",
            text: "A frequent slip is $\\binom{5}{2}/\\binom{9}{3}$, which forgets that the third seat still has to be filled by one of the four men.",
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
