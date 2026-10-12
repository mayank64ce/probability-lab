/**
 * Practice bank for Unit I's conditioning topic.
 *
 * Deliberately separate from CP-01 … CP-06: a lesson teaches an idea once,
 * while a bank supplies the repetition and variation mastery actually needs.
 * Nothing here repeats a lesson's problem.
 *
 * Difficulty spread follows the product plan: 3 recognition, 4 direct
 * calculation, 3 combined, 3 reasoning, 2 transfer.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { ExerciseBank } from "../../schema";

export const CONDITIONING_BANK: ExerciseBank = {
  topicId: "conditioning",
  exercises: [
    // ---------------------------------------------------------------
    // Difficulty 1 — recognition
    // ---------------------------------------------------------------
    {
      kind: "multiple-choice",
      id: "cond-b01",
      conceptIds: ["conditional-probability"],
      objective: "Recognise the definition of a conditional probability.",
      difficulty: 1,
      prompt: [
        { type: "paragraph", text: "Which expression defines $P(A \\mid B)$, for $P(B) > 0$?" },
      ],
      choices: [
        { id: "a", label: "$\\dfrac{P(A \\cap B)}{P(B)}$", correct: true },
        {
          id: "b",
          label: "$\\dfrac{P(A \\cap B)}{P(A)}$",
          misconception:
            "That is $P(B \\mid A)$. The event you are conditioning on goes in the denominator, because it is the new sample space.",
        },
        {
          id: "c",
          label: "$P(A) \\cdot P(B)$",
          misconception:
            "That is the product rule for *independent* events, which computes $P(A \\cap B)$ in a special case — not a conditional probability.",
        },
        {
          id: "d",
          label: "$\\dfrac{P(A) + P(B)}{2}$",
          misconception:
            "Averaging two probabilities has no probabilistic meaning here. Conditioning rescales one probability by another.",
        },
      ],
      hints: [{ text: "Which event becomes the new universe? That one is the denominator." }],
      solution: [
        {
          type: "paragraph",
          text: "Conditioning on $B$ restricts attention to $B$, so $B$ becomes the denominator and the overlap becomes the numerator.",
        },
        { type: "math", tex: "P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}" },
      ],
    },
    {
      kind: "multiple-choice",
      id: "cond-b02",
      conceptIds: ["independence"],
      objective: "Recognise the definition of independence.",
      difficulty: 1,
      prompt: [{ type: "paragraph", text: "Events $A$ and $B$ are independent exactly when:" }],
      choices: [
        { id: "a", label: "$P(A \\cap B) = P(A)\\,P(B)$", correct: true },
        {
          id: "b",
          label: "$P(A \\cap B) = 0$",
          misconception:
            "That is mutual exclusivity, which is the opposite of independence when both events have positive probability — knowing one would tell you the other definitely did not happen.",
        },
        {
          id: "c",
          label: "$P(A) = P(B)$",
          misconception:
            "Equal probabilities say nothing about how the events relate. Two events can be equally likely and still be perfectly dependent.",
        },
        {
          id: "d",
          label: "$P(A \\cup B) = P(A) + P(B)$",
          misconception:
            "That identity holds when the events are disjoint, not when they are independent.",
        },
      ],
      hints: [{ text: "Independence is a statement about the joint probability factorising." }],
      solution: [
        {
          type: "paragraph",
          text: "The factorisation is the definition. It is symmetric, and it stays meaningful even when one probability is zero.",
        },
        { type: "math", tex: "P(A \\cap B) = P(A)\\,P(B)" },
      ],
    },
    {
      kind: "multiple-choice",
      id: "cond-b03",
      conceptIds: ["total-probability"],
      objective: "Recognise a valid partition of a sample space.",
      difficulty: 1,
      prompt: [
        {
          type: "paragraph",
          text: "A fair six-sided die is rolled. Which collection of events partitions the sample space?",
        },
      ],
      choices: [
        { id: "a", label: "{even}, {odd}", correct: true },
        {
          id: "b",
          label: "{less than 4}, {more than 2}",
          misconception:
            "These overlap — a 3 belongs to both — so outcomes would be counted twice.",
        },
        {
          id: "c",
          label: "{1}, {2}, {3}, {4}, {5}",
          misconception:
            "These are disjoint but not exhaustive: rolling a 6 belongs to none of them, so some outcomes would be missed.",
        },
        {
          id: "d",
          label: "{prime}, {even}",
          misconception:
            "2 is both prime and even, so they overlap; and 1 is neither, so they are not exhaustive. Both requirements fail at once.",
        },
      ],
      hints: [{ text: "A partition needs two things: no overlaps, and nothing left out." }],
      solution: [
        {
          type: "paragraph",
          text: "Every roll is either even or odd, and never both, so the two events are mutually exclusive and collectively exhaustive.",
        },
      ],
    },

    // ---------------------------------------------------------------
    // Difficulty 2 — direct calculation
    // ---------------------------------------------------------------
    {
      kind: "numeric",
      id: "cond-b04",
      conceptIds: ["conditional-probability"],
      objective: "Apply the definition of conditional probability directly.",
      difficulty: 2,
      prerequisites: ["conditional-probability"],
      prompt: [
        {
          type: "stats",
          items: [
            { label: "P(A and B)", value: "0.12" },
            { label: "P(B)", value: "0.4" },
          ],
        },
        {
          type: "paragraph",
          text: "What is $P(A \\mid B)$? Give a probability between 0 and 1.",
        },
      ],
      value: 0.3,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [{ text: "Divide the joint probability by the probability of the given event." }],
      solution: [{ type: "math", tex: "P(A \\mid B) = \\frac{0.12}{0.4} = 0.3" }],
    },
    {
      kind: "numeric",
      id: "cond-b05",
      conceptIds: ["multiplication-rule"],
      objective: "Chain two stages of sampling without replacement.",
      difficulty: 2,
      prerequisites: ["conditional-probability"],
      prompt: [
        {
          type: "paragraph",
          text: "A bag holds 6 red and 4 blue marbles. Two are drawn without replacement. What is the probability that **both** are blue? Give a probability between 0 and 1.",
        },
      ],
      value: 2 / 15,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [
        { text: "Ten marbles to begin with, four of them blue." },
        { text: "After one blue leaves, three blue remain among nine." },
      ],
      solution: [
        {
          type: "math",
          tex: "\\frac{4}{10} \\times \\frac{3}{9} = \\frac{12}{90} = \\frac{2}{15} \\approx 0.133",
        },
      ],
    },
    {
      kind: "numeric",
      id: "cond-b06",
      conceptIds: ["total-probability"],
      objective: "Weight two case-specific rates by how often each case occurs.",
      difficulty: 2,
      prerequisites: ["conditional-probability"],
      prompt: [
        {
          type: "stats",
          items: [
            { label: "Supplier A — share / defect rate", value: "70% / 2%" },
            { label: "Supplier B — share / defect rate", value: "30% / 6%" },
          ],
        },
        {
          type: "paragraph",
          text: "Every part comes from one supplier or the other. What is the probability a randomly chosen part is defective? Give a probability between 0 and 1.",
        },
      ],
      value: 0.032,
      tolerance: 0.001,
      unit: "probability",
      acceptFraction: true,
      placeholder: "e.g. 0.05",
      hints: [{ text: "Weight each defect rate by that supplier's share, then add." }],
      solution: [{ type: "math", tex: "(0.7)(0.02) + (0.3)(0.06) = 0.014 + 0.018 = 0.032" }],
    },
    {
      kind: "numeric",
      id: "cond-b07",
      conceptIds: ["independence"],
      objective: "Use independence to compute a joint probability.",
      difficulty: 2,
      prerequisites: ["independence"],
      prompt: [
        {
          type: "stats",
          items: [
            { label: "P(A)", value: "0.4" },
            { label: "P(B)", value: "0.25" },
          ],
        },
        {
          type: "paragraph",
          text: "$A$ and $B$ are independent. What is $P(A \\cap B)$? Give a probability between 0 and 1.",
        },
      ],
      value: 0.1,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [{ text: "Independence means the joint probability factorises into the product." }],
      solution: [{ type: "math", tex: "P(A \\cap B) = (0.4)(0.25) = 0.1" }],
    },

    // ---------------------------------------------------------------
    // Difficulty 3 — combined concepts
    // ---------------------------------------------------------------
    {
      kind: "numeric",
      id: "cond-b08",
      conceptIds: ["bayes-theorem", "total-probability"],
      objective: "Build an evidence probability, then invert the conditional.",
      difficulty: 3,
      prerequisites: ["total-probability"],
      prompt: [
        {
          type: "stats",
          items: [
            { label: "Supplier A — share / defect rate", value: "70% / 2%" },
            { label: "Supplier B — share / defect rate", value: "30% / 6%" },
          ],
        },
        {
          type: "paragraph",
          text: "A part turns out to be defective. What is the probability it came from **Supplier B**? Give a probability between 0 and 1.",
        },
      ],
      value: 9 / 16,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [
        { text: "You worked out the overall defect rate already: $0.032$." },
        { text: "Supplier B's contribution to that total is $(0.3)(0.06) = 0.018$." },
      ],
      solution: [
        {
          type: "math",
          tex: "P(B \\mid D) = \\frac{(0.3)(0.06)}{0.032} = \\frac{0.018}{0.032} = \\frac{9}{16} = 0.5625",
        },
        {
          type: "paragraph",
          text: "Supplier B makes under a third of the parts and over half of the defects.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "cond-b09",
      conceptIds: ["total-probability", "multiplication-rule"],
      objective: "Use a partition over an unobserved first draw.",
      difficulty: 3,
      prerequisites: ["total-probability"],
      prompt: [
        {
          type: "paragraph",
          text: "Two cards are drawn from a standard 52-card deck without replacement, and you never see the first one. What is the probability the **second** card is an ace? Give a probability between 0 and 1.",
        },
      ],
      value: 1 / 13,
      tolerance: 0.004,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [
        { text: "Condition on whether the unseen first card was an ace." },
        {
          text: "$(4/52)(3/51)$ covers the case it was, and $(48/52)(4/51)$ the case it was not.",
        },
      ],
      solution: [
        {
          type: "math",
          tex: "\\frac{4}{52}\\cdot\\frac{3}{51} + \\frac{48}{52}\\cdot\\frac{4}{51} = \\frac{12 + 192}{2652} = \\frac{204}{2652} = \\frac{1}{13}",
        },
        {
          type: "paragraph",
          text: "Exactly the chance the *first* card is an ace. An unseen card carries no information, so position cannot matter.",
        },
      ],
    },
    {
      kind: "multiple-choice",
      id: "cond-b10",
      conceptIds: ["independence", "conditional-probability"],
      objective: "Read off the consequences of independence for a conditional.",
      difficulty: 3,
      prerequisites: ["independence"],
      prompt: [
        {
          type: "paragraph",
          text: "$A$ and $B$ are independent, with $P(A) = 0.5$ and $P(B) = 0.6$. Which statement is true?",
        },
      ],
      choices: [
        { id: "a", label: "$P(A \\mid B) = 0.5$", correct: true },
        {
          id: "b",
          label: "$P(A \\mid B) = 0.3$",
          misconception:
            "$0.3$ is $P(A \\cap B)$, the joint probability. The conditional divides that by $P(B)$, which brings it back to $0.5$.",
        },
        {
          id: "c",
          label: "$P(A \\mid B) = 0.6$",
          misconception:
            "That is $P(B)$. Conditioning on $B$ does not turn $A$ into $B$ — under independence it leaves $P(A)$ exactly where it was.",
        },
        {
          id: "d",
          label: "$P(A \\mid B) = 0$",
          misconception:
            "That would mean $A$ and $B$ cannot both happen, which is the strongest possible dependence — the opposite of what you were told.",
        },
      ],
      hints: [
        { text: "Independence is precisely the statement that conditioning changes nothing." },
      ],
      solution: [
        {
          type: "math",
          tex: "P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{(0.5)(0.6)}{0.6} = 0.5 = P(A)",
        },
      ],
    },

    {
      kind: "numeric",
      id: "cond-b16",
      conceptIds: ["conditional-independence", "bayes-theorem"],
      objective:
        "Update a belief about a hidden cause from a run of conditionally independent trials.",
      difficulty: 3,
      prerequisites: ["conditional-independence"],
      prompt: [
        {
          type: "paragraph",
          text: "A box holds one fair coin and one two-headed coin. You take one at random and flip it twice. Both flips land heads.",
        },
        {
          type: "paragraph",
          text: "What is the probability you are holding the two-headed coin? Give a probability between 0 and 1.",
        },
      ],
      value: 0.8,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [
        {
          text: "Given which coin you hold, the flips are independent — so each coin's chance of two heads is its heads probability squared.",
        },
        {
          text: "The fair coin gives two heads with probability $0.25$; the two-headed coin with probability $1$.",
        },
        { text: "So $P(HH) = (0.5)(0.25) + (0.5)(1) = 0.625$, and you want $0.5 / 0.625$." },
      ],
      solution: [
        {
          type: "paragraph",
          text: "Conditional independence given the coin turns each case into a square:",
        },
        { type: "math", tex: "P(HH) = (0.5)(0.5)^2 + (0.5)(1)^2 = 0.125 + 0.5 = 0.625" },
        {
          type: "math",
          tex: "P(\\text{two-headed} \\mid HH) = \\frac{0.5}{0.625} = 0.8",
        },
        {
          type: "paragraph",
          text: "Two heads take the two-headed coin from even odds to four to one. A third head would take it to eight to nine against the fair coin — each heads is further evidence, and the belief climbs without ever reaching certainty.",
        },
      ],
    },

    // ---------------------------------------------------------------
    // Difficulty 4 — mathematical reasoning
    // ---------------------------------------------------------------
    {
      kind: "multiple-choice",
      id: "cond-b11",
      conceptIds: ["conditional-probability", "independence"],
      objective: "Deduce that positive dependence is symmetric.",
      difficulty: 4,
      prerequisites: ["conditional-probability"],
      prompt: [
        {
          type: "paragraph",
          text: "Suppose $P(A \\mid B) > P(A)$, with both $P(A)$ and $P(B)$ positive. What must be true of $P(B \\mid A)$?",
        },
      ],
      choices: [
        { id: "a", label: "$P(B \\mid A) > P(B)$", correct: true },
        {
          id: "b",
          label: "$P(B \\mid A) < P(B)$",
          misconception:
            "Dependence cannot point in opposite directions. From $P(A \\cap B) > P(A)P(B)$, dividing by $P(A)$ gives $P(B \\mid A) > P(B)$ — the same inequality, the other way round.",
        },
        {
          id: "c",
          label: "$P(B \\mid A) = P(B)$",
          misconception:
            "That would make $A$ and $B$ independent, which contradicts the premise that conditioning on $B$ raised the probability of $A$.",
        },
        {
          id: "d",
          label: "Nothing can be concluded without more information",
          misconception:
            "The multiplication rule settles it in one line. $P(A \\mid B) > P(A)$ is equivalent to $P(A \\cap B) > P(A)P(B)$, which is symmetric in $A$ and $B$.",
        },
      ],
      hints: [
        {
          text: "Clear the denominator: what does $P(A \\mid B) > P(A)$ say about $P(A \\cap B)$?",
        },
        { text: "It gives $P(A \\cap B) > P(A)P(B)$, which treats $A$ and $B$ identically." },
      ],
      solution: [
        { type: "paragraph", text: "Multiply the premise through by $P(B)$:" },
        { type: "math", tex: "P(A \\cap B) > P(A)\\,P(B)" },
        {
          type: "paragraph",
          text: "That inequality is symmetric, so dividing instead by $P(A)$ gives the mirror statement:",
        },
        { type: "math", tex: "P(B \\mid A) > P(B)" },
        {
          type: "paragraph",
          text: "If $B$ is evidence for $A$, then $A$ is evidence for $B$, by exactly the same margin in the joint.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "cond-b12",
      conceptIds: ["independence"],
      objective: "Use the complement to turn an 'at least one' question into a product.",
      difficulty: 4,
      prerequisites: ["independence"],
      prompt: [
        {
          type: "paragraph",
          text: "A fair six-sided die is rolled four times. What is the probability of getting **at least one** 6? Give a probability between 0 and 1, to three decimal places.",
        },
      ],
      value: 1 - (5 / 6) ** 4,
      tolerance: 0.004,
      unit: "probability",
      acceptFraction: true,
      placeholder: "e.g. 0.25",
      hints: [
        { text: "Counting the ways to get at least one 6 is painful. Count the opposite instead." },
        { text: "No 6 at all means every roll misses, and the rolls are independent." },
        { text: "So the answer is $1 - (5/6)^4$." },
      ],
      solution: [
        {
          type: "paragraph",
          text: "The complement of *at least one 6* is *no 6 on any roll*, and independence makes that a product:",
        },
        {
          type: "math",
          tex: "P(\\text{no } 6) = \\left(\\tfrac{5}{6}\\right)^4 = \\tfrac{625}{1296}",
        },
        {
          type: "math",
          tex: "P(\\text{at least one } 6) = 1 - \\tfrac{625}{1296} = \\tfrac{671}{1296} \\approx 0.518",
        },
        {
          type: "paragraph",
          text: "Answering $4/6 \\approx 0.667$ adds the per-roll probabilities, which double-counts the rolls where more than one 6 appears.",
        },
      ],
    },
    {
      kind: "steps",
      id: "cond-b13",
      conceptIds: ["bayes-theorem", "total-probability"],
      objective: "Carry out a full Bayes computation one checkpoint at a time.",
      difficulty: 4,
      prerequisites: ["total-probability", "bayes-theorem"],
      prompt: [
        {
          type: "paragraph",
          text: "Urn A holds 2 red and 3 blue balls. Urn B holds 4 red and 1 blue. You pick an urn at random — each equally likely — and draw one ball. It is **red**.",
        },
        {
          type: "paragraph",
          text: "Work out the probability that you drew from Urn A, one step at a time.",
        },
      ],
      steps: [
        {
          id: "s1",
          prompt: [
            {
              type: "paragraph",
              text: "**Step 1.** If you are drawing from Urn A, what is the probability the ball is red?",
            },
          ],
          answer: {
            kind: "numeric",
            value: 0.4,
            tolerance: 0.005,
            unit: "probability",
            acceptFraction: true,
            placeholder: "e.g. 2/5 or 0.4",
          },
          hint: "Urn A holds 2 red out of $2 + 3 = 5$ balls.",
        },
        {
          id: "s2",
          prompt: [
            {
              type: "paragraph",
              text: "**Step 2.** Now the overall probability of drawing red, across both urns. Urn B gives red with probability $4/5 = 0.8$.",
            },
          ],
          answer: {
            kind: "numeric",
            value: 0.6,
            tolerance: 0.005,
            unit: "probability",
            acceptFraction: true,
            placeholder: "e.g. 0.5",
          },
          hint: "Weight each urn by $1/2$: $(0.5)(0.4) + (0.5)(0.8)$.",
        },
        {
          id: "s3",
          prompt: [
            {
              type: "paragraph",
              text: "**Step 3.** Finally, invert. Given the ball is red, what is the probability it came from Urn A?",
            },
          ],
          answer: {
            kind: "numeric",
            value: 1 / 3,
            tolerance: 0.005,
            unit: "probability",
            acceptFraction: true,
            preferSimplified: true,
            placeholder: "e.g. 1/4 or 0.25",
          },
          hint: "Urn A's contribution over the total: $(0.5)(0.4) / 0.6 = 0.2/0.6$.",
        },
      ],
      hints: [{ text: "Each step feeds the next. Take them in order and do not skip ahead." }],
      solution: [
        {
          type: "math",
          tex: "P(R \\mid A) = \\tfrac{2}{5} = 0.4, \\qquad P(R \\mid B) = \\tfrac{4}{5} = 0.8",
        },
        { type: "math", tex: "P(R) = (0.5)(0.4) + (0.5)(0.8) = 0.6" },
        {
          type: "math",
          tex: "P(A \\mid R) = \\frac{(0.5)(0.4)}{0.6} = \\frac{0.2}{0.6} = \\frac{1}{3}",
        },
        {
          type: "paragraph",
          text: "Red evidence halves the odds on Urn A, from even to one in three, because Urn B produces red twice as readily.",
        },
      ],
    },

    // ---------------------------------------------------------------
    // Difficulty 5 — transfer
    // ---------------------------------------------------------------
    {
      kind: "numeric",
      id: "cond-b14",
      conceptIds: ["bayes-theorem", "conditional-probability"],
      objective:
        "Condition on a face rather than a card, in a setting that invites the wrong sample space.",
      difficulty: 5,
      prerequisites: ["bayes-theorem"],
      prompt: [
        {
          type: "paragraph",
          text: "Three cards sit in a hat. One is red on both faces, one is black on both faces, and one is red on one face and black on the other.",
        },
        {
          type: "paragraph",
          text: "You draw a card at random and lay it down. The face you can see is **red**. What is the probability the hidden face is also red? Give a probability between 0 and 1.",
        },
      ],
      value: 2 / 3,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [
        {
          text: "The tempting answer is $1/2$ — two cards have a red face, so surely it is an even split. Check whether those two cards are equally likely to have *shown* you red.",
        },
        {
          text: "Count faces, not cards. There are six faces in the hat and three of them are red.",
        },
        {
          text: "Of those three red faces, two belong to the red-red card.",
        },
      ],
      solution: [
        {
          type: "paragraph",
          text: "Condition on the face you are looking at, not the card you are holding. Six faces are equally likely to be the one showing, and three of them are red:",
        },
        {
          type: "list",
          items: [
            "Red-red card — contributes **two** red faces.",
            "Red-black card — contributes **one** red face.",
            "Black-black card — contributes none.",
          ],
        },
        {
          type: "math",
          tex: "P(\\text{hidden face red} \\mid \\text{visible face red}) = \\frac{2}{3}",
        },
        {
          type: "paragraph",
          text: "The red-red card is twice as likely to have produced a red face, so seeing red is evidence for it. Answering $1/2$ treats the two red-bearing cards as equally likely to show red, which they are not.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "cond-b15",
      conceptIds: ["conditional-probability"],
      objective: "Condition correctly on a vague statement about one of two items.",
      difficulty: 5,
      prerequisites: ["conditional-probability"],
      prompt: [
        {
          type: "paragraph",
          text: "A family has two children. Each child is independently a boy or a girl with probability $1/2$.",
        },
        {
          type: "paragraph",
          text: "You are told that **at least one** of the two is a boy. What is the probability that both are boys? Give a probability between 0 and 1.",
        },
      ],
      value: 1 / 3,
      tolerance: 0.005,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [
        {
          text: "Write down the four equally likely birth orders before conditioning on anything.",
        },
        {
          text: "They are BB, BG, GB and GG. Which of the four does *at least one boy* rule out?",
        },
        {
          text: "Only GG is ruled out, leaving three equally likely cases, of which one is BB.",
        },
      ],
      solution: [
        {
          type: "paragraph",
          text: "The four birth orders are equally likely. *At least one boy* eliminates only GG:",
        },
        { type: "math", tex: "\\{BB,\\; BG,\\; GB\\}" },
        {
          type: "math",
          tex: "P(\\text{both boys} \\mid \\text{at least one boy}) = \\frac{1}{3}",
        },
        {
          type: "paragraph",
          text: "The common answer $1/2$ comes from imagining a *specific* child identified as a boy — say the elder. That is different information, and it does give $1/2$. Here you were told only that the pair contains a boy somewhere, which leaves BG and GB both alive.",
        },
      ],
    },
  ],
};
