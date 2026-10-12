/**
 * Practice bank for Unit I's foundations topic: sample spaces, the axioms and
 * counting. Separate from FN-01 … FN-03; nothing here repeats a lesson problem.
 *
 * Spread follows the product plan: 3 recognition, 4 direct calculation,
 * 3 combined, 3 reasoning, 2 transfer.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { ExerciseBank } from "../../schema";

export const FOUNDATIONS_BANK: ExerciseBank = {
  topicId: "foundations",
  exercises: [
    // --------------------------------------------- difficulty 1
    {
      kind: "multiple-choice",
      id: "fnd-b01",
      conceptIds: ["sample-spaces"],
      objective: "Recall the two requirements on a sample space.",
      difficulty: 1,
      prompt: [{ type: "paragraph", text: "What must the outcomes of a sample space satisfy?" }],
      choices: [
        {
          id: "a",
          label: "Mutually exclusive and collectively exhaustive",
          correct: true,
        },
        {
          id: "b",
          label: "Equally likely",
          misconception:
            "Convenient, but not required. The eleven possible sums of two dice form a perfectly valid sample space and are nowhere near equally likely.",
        },
        {
          id: "c",
          label: "Finite in number",
          misconception:
            "Sample spaces may be countably infinite — the number of coin flips before the first head, for instance — or uncountable, as in Unit II.",
        },
        {
          id: "d",
          label: "Numerical",
          misconception:
            "Outcomes can be anything at all: a pair of faces, a colour, a word. Attaching numbers to them is what a random variable does, later.",
        },
      ],
      hints: [{ text: "Exactly one outcome occurs, and at least one outcome occurs." }],
      solution: [
        {
          type: "paragraph",
          text: "Mutually exclusive means no two outcomes can both happen; collectively exhaustive means nothing that can happen has been left out. Nothing else is required.",
        },
      ],
    },
    {
      kind: "multiple-choice",
      id: "fnd-b02",
      conceptIds: ["probability-axioms"],
      objective: "Distinguish the axioms from their consequences.",
      difficulty: 1,
      prompt: [{ type: "paragraph", text: "Which of these is **not** one of the three axioms?" }],
      choices: [
        { id: "a", label: "$P(A) \\leq 1$ for every event $A$", correct: true },
        {
          id: "b",
          label: "$P(A) \\geq 0$ for every event $A$",
          misconception: "Non-negativity is the first axiom.",
        },
        {
          id: "c",
          label: "$P(\\Omega) = 1$",
          misconception: "Normalization is the second axiom.",
        },
        {
          id: "d",
          label: "$P(A \\cup B) = P(A) + P(B)$ for disjoint $A$ and $B$",
          misconception: "Additivity is the third axiom.",
        },
      ],
      hints: [
        {
          text: "One of these can be *derived* from the others. Which one needs no separate assumption?",
        },
      ],
      solution: [
        {
          type: "paragraph",
          text: "$P(A) \\leq 1$ is a theorem, not an axiom. Since $A$ and $A^c$ are disjoint and exhaust $\\Omega$, additivity and normalization give $P(A) = 1 - P(A^c) \\leq 1$, using non-negativity on the complement.",
        },
      ],
    },
    {
      kind: "multiple-choice",
      id: "fnd-b03",
      conceptIds: ["counting"],
      objective: "Recall what a factorial counts.",
      difficulty: 1,
      prompt: [{ type: "paragraph", text: "What does $n!$ count?" }],
      choices: [
        { id: "a", label: "The ways to arrange $n$ distinct items in a row", correct: true },
        {
          id: "b",
          label: "The ways to choose some of $n$ items",
          misconception:
            "Choosing a subset of any size gives $2^n$ possibilities. A factorial counts orderings of all $n$ items, not selections.",
        },
        {
          id: "c",
          label: "The number of subsets of a set of size $n$",
          misconception: "That is $2^n$ — each item is either in or out, independently.",
        },
        {
          id: "d",
          label: "The ways to pair up $n$ items",
          misconception:
            "Pairings are a different and smaller count. $n!$ is the number of complete orderings.",
        },
      ],
      hints: [{ text: "$n$ choices for the first position, $n-1$ for the second, and so on." }],
      solution: [
        {
          type: "math",
          tex: "n! = n(n-1)(n-2)\\cdots 1",
        },
        {
          type: "paragraph",
          text: "Each position in the row is filled from a pool that shrinks by one each time.",
        },
      ],
    },

    // --------------------------------------------- difficulty 2
    {
      kind: "numeric",
      id: "fnd-b04",
      conceptIds: ["sample-spaces"],
      objective: "Compute a probability by counting outcomes.",
      difficulty: 2,
      prerequisites: ["sample-spaces"],
      prompt: [
        {
          type: "paragraph",
          text: "A fair six-sided die is rolled once. What is the probability the result is **odd**? Give a probability between 0 and 1.",
        },
      ],
      value: 0.5,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [{ text: "Three of the six faces are odd: 1, 3 and 5." }],
      solution: [{ type: "math", tex: "P(\\text{odd}) = \\frac{3}{6} = \\frac{1}{2}" }],
    },
    {
      kind: "numeric",
      id: "fnd-b05",
      conceptIds: ["probability-axioms"],
      objective: "Apply additivity to disjoint events.",
      difficulty: 2,
      prerequisites: ["probability-axioms"],
      prompt: [
        {
          type: "stats",
          items: [
            { label: "P(A)", value: "0.3" },
            { label: "P(B)", value: "0.45" },
          ],
        },
        {
          type: "paragraph",
          text: "$A$ and $B$ are **disjoint**. What is $P(A \\cup B)$? Give a probability between 0 and 1.",
        },
      ],
      value: 0.75,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      placeholder: "e.g. 0.5",
      hints: [
        { text: "Disjoint is exactly the hypothesis the additivity axiom needs." },
        { text: "No overlap to subtract, so add them." },
      ],
      solution: [
        { type: "math", tex: "P(A \\cup B) = 0.3 + 0.45 = 0.75" },
        {
          type: "paragraph",
          text: "No inclusion–exclusion correction is required, because $P(A \\cap B) = 0$.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "fnd-b06",
      conceptIds: ["probability-axioms"],
      objective: "Apply the complement rule.",
      difficulty: 2,
      prerequisites: ["probability-axioms"],
      prompt: [
        {
          type: "paragraph",
          text: "An event $A$ has $P(A) = 0.35$. What is $P(A^c)$, the probability it does **not** occur? Give a probability between 0 and 1.",
        },
      ],
      value: 0.65,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      placeholder: "e.g. 0.5",
      hints: [{ text: "$A$ and $A^c$ are disjoint and together make up everything." }],
      solution: [{ type: "math", tex: "P(A^c) = 1 - P(A) = 1 - 0.35 = 0.65" }],
    },
    {
      kind: "numeric",
      id: "fnd-b07",
      conceptIds: ["counting"],
      objective: "Apply the counting principle with repetition allowed.",
      difficulty: 2,
      prerequisites: ["counting"],
      prompt: [
        {
          type: "paragraph",
          text: "How many different 4-digit PINs can be formed from the digits 0–9, if digits **may** repeat? Give a whole number.",
        },
      ],
      value: 10000,
      tolerance: 0.5,
      unit: "plain",
      acceptFraction: false,
      placeholder: "e.g. 5000",
      hints: [
        { text: "Each of the four positions is filled independently." },
        { text: "Ten choices at every position: $10^4$." },
      ],
      solution: [
        { type: "math", tex: "10 \\times 10 \\times 10 \\times 10 = 10^4 = 10{,}000" },
        {
          type: "paragraph",
          text: "Because repetition is allowed, the pool never shrinks — unlike the $10 \\times 9 \\times 8 \\times 7 = 5040$ PINs with all digits distinct.",
        },
      ],
    },

    // --------------------------------------------- difficulty 3
    {
      kind: "numeric",
      id: "fnd-b08",
      conceptIds: ["sample-spaces", "probability-axioms"],
      objective: "Use the complement to count an 'at least one' event.",
      difficulty: 3,
      prerequisites: ["sample-spaces"],
      prompt: [
        {
          type: "paragraph",
          text: "Two fair dice are rolled. What is the probability that **at least one** of them shows a 6? Give a probability between 0 and 1.",
        },
      ],
      value: 11 / 36,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [
        { text: "Counting directly risks double-counting the outcome $(6,6)$." },
        { text: "Count the complement instead: neither die shows a 6." },
        { text: "That is $5 \\times 5 = 25$ outcomes, so $1 - 25/36$." },
      ],
      solution: [
        {
          type: "paragraph",
          text: "The complement is easier: both dice avoid 6, which happens in $5 \\times 5 = 25$ of the 36 outcomes.",
        },
        { type: "math", tex: "P(\\text{at least one } 6) = 1 - \\frac{25}{36} = \\frac{11}{36}" },
        {
          type: "paragraph",
          text: "Answering $12/36$ adds the six outcomes with a 6 on the first die to the six on the second, counting $(6,6)$ twice.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "fnd-b09",
      conceptIds: ["counting"],
      objective: "Evaluate a binomial coefficient.",
      difficulty: 3,
      prerequisites: ["counting"],
      prompt: [
        {
          type: "paragraph",
          text: "In how many ways can 4 items be chosen from 10 when order does not matter? Give a whole number.",
        },
      ],
      value: 210,
      tolerance: 0.5,
      unit: "plain",
      acceptFraction: false,
      placeholder: "e.g. 120",
      hints: [
        { text: "Order does not matter, so this is $\\binom{10}{4}$." },
        { text: "$\\frac{10 \\times 9 \\times 8 \\times 7}{4 \\times 3 \\times 2 \\times 1}$." },
      ],
      solution: [
        {
          type: "math",
          tex: "\\binom{10}{4} = \\frac{10 \\times 9 \\times 8 \\times 7}{24} = \\frac{5040}{24} = 210",
        },
      ],
    },
    {
      kind: "numeric",
      id: "fnd-b10",
      conceptIds: ["probability-axioms"],
      objective: "Rearrange inclusion–exclusion to find an intersection.",
      difficulty: 3,
      prerequisites: ["probability-axioms"],
      prompt: [
        {
          type: "stats",
          items: [
            { label: "P(A)", value: "0.5" },
            { label: "P(B)", value: "0.4" },
            { label: "P(A or B)", value: "0.7" },
          ],
        },
        {
          type: "paragraph",
          text: "What is $P(A \\cap B)$? Give a probability between 0 and 1.",
        },
      ],
      value: 0.2,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      placeholder: "e.g. 0.5",
      hints: [
        { text: "Start from $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$." },
        { text: "Rearranged: $P(A \\cap B) = 0.5 + 0.4 - 0.7$." },
      ],
      solution: [
        { type: "math", tex: "P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = 0.9 - 0.7 = 0.2" },
        {
          type: "paragraph",
          text: "A useful sanity check: the overlap must not exceed either event, and $0.2 \\leq 0.4$.",
        },
      ],
    },

    // --------------------------------------------- difficulty 4
    {
      kind: "multiple-choice",
      id: "fnd-b11",
      conceptIds: ["probability-axioms"],
      objective: "Bound an unknown intersection from the axioms.",
      difficulty: 4,
      prerequisites: ["probability-axioms"],
      prompt: [
        {
          type: "paragraph",
          text: "$P(A) = 0.9$ and $P(B) = 0.8$. What is the **smallest** possible value of $P(A \\cap B)$?",
        },
      ],
      choices: [
        { id: "a", label: "0.7", correct: true },
        {
          id: "b",
          label: "0",
          misconception:
            "Zero would make the events disjoint, forcing $P(A \\cup B) = 1.7$. No probability may exceed 1, so these two events are compelled to overlap heavily.",
        },
        {
          id: "c",
          label: "0.72",
          misconception:
            "$0.72 = (0.9)(0.8)$ is the overlap under independence — one possible value, not the minimum. The overlap can be smaller than that.",
        },
        {
          id: "d",
          label: "0.8",
          misconception:
            "$0.8$ is the *largest* the overlap could be, attained when $B \\subseteq A$. The question asks for the smallest.",
        },
      ],
      hints: [
        { text: "Rearrange inclusion–exclusion and use the fact that the union is at most 1." },
        { text: "$P(A \\cap B) = 1.7 - P(A \\cup B) \\geq 1.7 - 1$." },
      ],
      solution: [
        {
          type: "math",
          tex: "P(A \\cap B) = P(A) + P(B) - P(A \\cup B) \\geq 0.9 + 0.8 - 1 = 0.7",
        },
        {
          type: "paragraph",
          text: "Two events covering 90% and 80% of the space cannot share less than 70% of it. This is the general bound $P(A \\cap B) \\geq P(A) + P(B) - 1$.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "fnd-b12",
      conceptIds: ["counting"],
      objective: "Count arrangements subject to an adjacency constraint.",
      difficulty: 4,
      prerequisites: ["counting"],
      prompt: [
        {
          type: "paragraph",
          text: "Five people stand in a row. In how many arrangements are two particular people — call them A and B — standing **next to each other**? Give a whole number.",
        },
      ],
      value: 48,
      tolerance: 0.5,
      unit: "plain",
      acceptFraction: false,
      placeholder: "e.g. 120",
      hints: [
        { text: "Glue A and B together and treat the pair as a single item." },
        { text: "That leaves 4 items to arrange: $4! = 24$ ways." },
        { text: "But A and B can be glued in two orders — AB or BA." },
      ],
      solution: [
        {
          type: "paragraph",
          text: "Treat the adjacent pair as one block. There are then 4 objects to arrange:",
        },
        { type: "math", tex: "4! = 24" },
        {
          type: "paragraph",
          text: "Within the block, A and B can stand in either order, so every arrangement counts twice:",
        },
        { type: "math", tex: "24 \\times 2 = 48" },
        {
          type: "paragraph",
          text: "As a check, there are $5! = 120$ arrangements in all, and $48/120 = 2/5$ of them have A and B adjacent. Answering 24 forgets that the glued pair has two internal orders.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "fnd-b13",
      conceptIds: ["sample-spaces", "counting"],
      objective: "Count an event defined by a property of the sum.",
      difficulty: 4,
      prerequisites: ["sample-spaces"],
      prompt: [
        {
          type: "paragraph",
          text: "Two fair dice are rolled. What is the probability their sum is a **prime number**? Give a probability between 0 and 1.",
        },
      ],
      value: 5 / 12,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [
        { text: "Which sums between 2 and 12 are prime?" },
        { text: "2, 3, 5, 7 and 11. Note that 1 is not prime and 9 is not either." },
        {
          text: "Their counts are $1, 2, 4, 6, 2$ outcomes respectively.",
        },
      ],
      solution: [
        {
          type: "paragraph",
          text: "The prime sums are 2, 3, 5, 7 and 11. Count the outcomes behind each:",
        },
        {
          type: "list",
          items: [
            "Sum 2 — 1 outcome.",
            "Sum 3 — 2 outcomes.",
            "Sum 5 — 4 outcomes.",
            "Sum 7 — 6 outcomes.",
            "Sum 11 — 2 outcomes.",
          ],
        },
        {
          type: "math",
          tex: "P = \\frac{1 + 2 + 4 + 6 + 2}{36} = \\frac{15}{36} = \\frac{5}{12} \\approx 0.417",
        },
        {
          type: "paragraph",
          text: "Including 9 as prime gives $19/36$ and is the usual slip; forgetting that 2 is prime gives $14/36$.",
        },
      ],
    },

    // --------------------------------------------- difficulty 5
    {
      kind: "numeric",
      id: "fnd-b14",
      conceptIds: ["counting", "sample-spaces"],
      objective:
        "Transfer the birthday-problem argument to an unfamiliar setting and compute a collision probability.",
      difficulty: 5,
      prerequisites: ["counting", "sample-spaces"],
      prompt: [
        {
          type: "paragraph",
          text: "Five people each independently pick a day of the week at random, all seven days equally likely.",
        },
        {
          type: "paragraph",
          text: "What is the probability that **all five pick different days**? Give a probability between 0 and 1, to three decimal places.",
        },
      ],
      value: 2520 / 16807,
      tolerance: 0.004,
      unit: "probability",
      acceptFraction: true,
      placeholder: "e.g. 0.25",
      hints: [
        { text: "How many ways can five people pick days in total, with no restriction?" },
        { text: "$7^5$, since each person chooses independently from seven days." },
        {
          text: "For all-different picks the pool shrinks: $7 \\times 6 \\times 5 \\times 4 \\times 3$.",
        },
      ],
      solution: [
        {
          type: "paragraph",
          text: "Every assignment of days to the five people is equally likely, and there are $7^5 = 16{,}807$ of them.",
        },
        {
          type: "paragraph",
          text: "For all five to differ, each person in turn must avoid every day already taken:",
        },
        {
          type: "math",
          tex: "7 \\times 6 \\times 5 \\times 4 \\times 3 = 2520",
        },
        {
          type: "math",
          tex: "P = \\frac{2520}{16807} \\approx 0.150",
        },
        {
          type: "paragraph",
          text: "Only about one time in seven — collisions are far more likely than intuition suggests, which is the whole point of the birthday problem this mirrors.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "fnd-b15",
      conceptIds: ["counting"],
      objective: "Count selections subject to an exclusion, by subtracting the forbidden ones.",
      difficulty: 5,
      prerequisites: ["counting"],
      prompt: [
        {
          type: "paragraph",
          text: "A committee of 4 is to be chosen from 10 people. Two of them — call them A and B — refuse to serve together, though either is willing to serve without the other.",
        },
        {
          type: "paragraph",
          text: "How many acceptable committees are there? Give a whole number.",
        },
      ],
      value: 182,
      tolerance: 0.5,
      unit: "plain",
      acceptFraction: false,
      placeholder: "e.g. 120",
      hints: [
        {
          text: "Counting the acceptable committees directly means splitting into cases. Counting the forbidden ones is quicker.",
        },
        {
          text: "A committee is forbidden exactly when it contains both A and B. How many such committees are there?",
        },
        {
          text: "Fix A and B as members, then choose the other 2 from the remaining 8: $\\binom{8}{2}$.",
        },
      ],
      solution: [
        { type: "paragraph", text: "Count everything, then remove what is not allowed." },
        { type: "math", tex: "\\binom{10}{4} = 210" },
        {
          type: "paragraph",
          text: "A committee is forbidden precisely when both A and B are on it. Placing them both leaves two seats to fill from the other eight people:",
        },
        { type: "math", tex: "\\binom{8}{2} = 28" },
        { type: "math", tex: "210 - 28 = 182" },
        {
          type: "paragraph",
          text: "Subtracting the forbidden cases from the total is almost always easier than enumerating the permitted ones, which here would need three separate cases: neither A nor B, A alone, B alone.",
        },
      ],
    },
  ],
};
