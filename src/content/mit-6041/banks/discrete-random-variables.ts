/**
 * Practice bank for Unit I's discrete random variables topic. Separate from
 * RV-01 … RV-07; nothing here repeats a lesson problem.
 *
 * Spread follows the product plan: 3 recognition, 4 direct calculation,
 * 3 combined, 3 reasoning, 2 transfer.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { ExerciseBank } from "../../schema";

export const DISCRETE_RV_BANK: ExerciseBank = {
  topicId: "discrete-random-variables",
  exercises: [
    // --------------------------------------------- difficulty 1
    {
      kind: "multiple-choice",
      id: "drv-b01",
      conceptIds: ["discrete-random-variables"],
      objective: "Recall what a random variable is.",
      difficulty: 1,
      prompt: [{ type: "paragraph", text: "A random variable is:" }],
      choices: [
        { id: "a", label: "A function from outcomes to numbers", correct: true },
        {
          id: "b",
          label: "A number chosen at random",
          misconception:
            "The randomness lives in which outcome occurs, not in the variable. $X$ is defined for every outcome at once.",
        },
        {
          id: "c",
          label: "A probability",
          misconception:
            "A random variable takes values that are usually not probabilities at all — the sum of two dice runs from 2 to 12.",
        },
        {
          id: "d",
          label: "An event",
          misconception:
            "$X$ is not an event, though it generates them: $\\{X = 3\\}$ is an event, $X$ itself is the rule that defines it.",
        },
      ],
      hints: [{ text: "Ask what $X$ equals for one specific outcome, then for every outcome." }],
      solution: [
        { type: "math", tex: "X : \\Omega \\to \\mathbb{R}" },
        {
          type: "paragraph",
          text: "It assigns a number to each possible outcome of the experiment.",
        },
      ],
    },
    {
      kind: "multiple-choice",
      id: "drv-b02",
      conceptIds: ["probability-mass-functions"],
      objective: "Recall the two conditions on a PMF.",
      difficulty: 1,
      prompt: [{ type: "paragraph", text: "A function $p_X$ is a valid PMF exactly when:" }],
      choices: [
        {
          id: "a",
          label: "Every value is non-negative and they sum to 1",
          correct: true,
        },
        {
          id: "b",
          label: "Every value is strictly positive",
          misconception:
            "Zero is allowed. A value the variable simply cannot take has mass 0, and that is perfectly legitimate.",
        },
        {
          id: "c",
          label: "The values are all equal",
          misconception:
            "That describes a uniform distribution, one PMF among many. The sum of two dice is far from uniform.",
        },
        {
          id: "d",
          label: "The values sum to less than 1",
          misconception:
            "They must sum to exactly 1 — the events $\\{X = x\\}$ partition the sample space, so their probabilities account for everything.",
        },
      ],
      hints: [{ text: "Non-negativity, and total mass." }],
      solution: [
        { type: "math", tex: "p_X(x) \\geq 0 \\quad \\text{and} \\quad \\sum_x p_X(x) = 1" },
      ],
    },
    {
      kind: "multiple-choice",
      id: "drv-b03",
      conceptIds: ["expectation"],
      objective: "Recall what an expectation computes.",
      difficulty: 1,
      prompt: [{ type: "paragraph", text: "The expectation $E[X]$ is:" }],
      choices: [
        {
          id: "a",
          label: "The average of the values, weighted by their probabilities",
          correct: true,
        },
        {
          id: "b",
          label: "The most likely value",
          misconception:
            "That is the mode. A fair die has expectation 3.5, which is not a value it can take at all, let alone the most likely one.",
        },
        {
          id: "c",
          label: "The middle value",
          misconception:
            "That is the median. The two agree for symmetric distributions and part company for skewed ones.",
        },
        {
          id: "d",
          label: "The plain average of the values the variable can take",
          misconception:
            "Only when the values are equally likely. Weighting by probability is the whole content of the definition.",
        },
      ],
      hints: [{ text: "Which values count for more — the likely ones or the rare ones?" }],
      solution: [{ type: "math", tex: "E[X] = \\sum_x x \\, p_X(x)" }],
    },

    // --------------------------------------------- difficulty 2
    {
      kind: "numeric",
      id: "drv-b04",
      conceptIds: ["expectation"],
      objective: "Compute the expectation of a uniform variable.",
      difficulty: 2,
      prerequisites: ["expectation"],
      prompt: [
        {
          type: "paragraph",
          text: "$X$ takes the values $1, 2, 3, 4$, each with probability $1/4$. What is $E[X]$?",
        },
      ],
      value: 2.5,
      tolerance: 0.005,
      unit: "plain",
      acceptFraction: true,
      placeholder: "e.g. 3.5",
      hints: [{ text: "Equal weights, so this is the plain average of the four values." }],
      solution: [{ type: "math", tex: "E[X] = \\frac{1 + 2 + 3 + 4}{4} = 2.5" }],
    },
    {
      kind: "numeric",
      id: "drv-b05",
      conceptIds: ["expectation"],
      objective: "Compute the expectation of an indicator variable.",
      difficulty: 2,
      prerequisites: ["expectation"],
      prompt: [
        {
          type: "stats",
          items: [
            { label: "P(X = 0)", value: "0.3" },
            { label: "P(X = 1)", value: "0.7" },
          ],
        },
        { type: "paragraph", text: "What is $E[X]$?" },
      ],
      value: 0.7,
      tolerance: 0.005,
      unit: "plain",
      acceptFraction: true,
      placeholder: "e.g. 0.5",
      hints: [{ text: "$0 \\times 0.3 + 1 \\times 0.7$ — the zero term contributes nothing." }],
      solution: [
        { type: "math", tex: "E[X] = 0(0.3) + 1(0.7) = 0.7" },
        {
          type: "paragraph",
          text: "For a variable taking only 0 and 1, the expectation is simply the probability of the 1.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "drv-b06",
      conceptIds: ["probability-mass-functions"],
      objective: "Compute a PMF value by counting equally likely sequences.",
      difficulty: 2,
      prerequisites: ["probability-mass-functions"],
      prompt: [
        {
          type: "paragraph",
          text: "A fair coin is flipped three times. Let $H$ be the number of heads. What is $p_H(3)$ — the probability of three heads? Give a probability between 0 and 1.",
        },
      ],
      value: 0.125,
      tolerance: 0.004,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [{ text: "Only one of the eight equally likely sequences is HHH." }],
      solution: [{ type: "math", tex: "p_H(3) = \\frac{1}{2^3} = \\frac{1}{8} = 0.125" }],
    },
    {
      kind: "numeric",
      id: "drv-b07",
      conceptIds: ["variance"],
      objective: "Apply the shift rule for variance.",
      difficulty: 2,
      prerequisites: ["variance"],
      prompt: [
        {
          type: "paragraph",
          text: "$\\mathrm{var}(X) = 9$. What is $\\mathrm{var}(X + 5)$?",
        },
      ],
      value: 9,
      tolerance: 0.01,
      unit: "plain",
      acceptFraction: true,
      placeholder: "e.g. 4",
      hints: [
        { text: "Adding a constant moves the mean by the same amount." },
        { text: "So every deviation from the mean is unchanged." },
      ],
      solution: [
        { type: "math", tex: "\\mathrm{var}(X + b) = \\mathrm{var}(X) = 9" },
        {
          type: "paragraph",
          text: "Variance measures spread, and sliding a distribution along the axis does not change how spread out it is.",
        },
      ],
    },

    // --------------------------------------------- difficulty 3
    {
      kind: "numeric",
      id: "drv-b08",
      conceptIds: ["variance"],
      objective: "Compute a variance with the computational formula.",
      difficulty: 3,
      prerequisites: ["variance", "expectation"],
      prompt: [
        {
          type: "paragraph",
          text: "$X$ takes the values $1, 2, 3, 4$, each with probability $1/4$. What is $\\mathrm{var}(X)$?",
        },
      ],
      value: 1.25,
      tolerance: 0.01,
      unit: "plain",
      acceptFraction: true,
      placeholder: "e.g. 2.5",
      hints: [
        { text: "You know $E[X] = 2.5$ already." },
        { text: "$E[X^2] = \\frac{1 + 4 + 9 + 16}{4} = 7.5$." },
        { text: "$7.5 - 2.5^2$." },
      ],
      solution: [
        { type: "math", tex: "E[X^2] = \\frac{1 + 4 + 9 + 16}{4} = 7.5" },
        { type: "math", tex: "\\mathrm{var}(X) = 7.5 - (2.5)^2 = 7.5 - 6.25 = 1.25" },
      ],
    },
    {
      kind: "numeric",
      id: "drv-b09",
      conceptIds: ["expectation"],
      objective: "Apply linearity of expectation.",
      difficulty: 3,
      prerequisites: ["expectation"],
      prompt: [
        {
          type: "paragraph",
          text: "$E[X] = 4$. What is $E[3X + 2]$?",
        },
      ],
      value: 14,
      tolerance: 0.01,
      unit: "plain",
      acceptFraction: true,
      placeholder: "e.g. 10",
      hints: [
        { text: "Expectation passes straight through linear functions." },
        { text: "$3E[X] + 2$." },
      ],
      solution: [
        { type: "math", tex: "E[3X + 2] = 3E[X] + 2 = 12 + 2 = 14" },
        {
          type: "paragraph",
          text: "No information about the distribution of $X$ was needed — linearity holds whatever it is.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "drv-b10",
      conceptIds: ["joint-pmfs", "independence"],
      objective: "Compute a joint probability for independent variables.",
      difficulty: 3,
      prerequisites: ["joint-pmfs"],
      prompt: [
        {
          type: "paragraph",
          text: "Two fair dice are rolled. $X$ is the first die and $Y$ the second, so they are independent.",
        },
        {
          type: "paragraph",
          text: "What is $p_{X,Y}(2, 5)$? Give a probability between 0 and 1.",
        },
      ],
      value: 1 / 36,
      tolerance: 0.004,
      unit: "probability",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1/4 or 0.25",
      hints: [
        { text: "Independence means the joint factorises into the product of the margins." },
        { text: "$\\frac{1}{6} \\times \\frac{1}{6}$." },
      ],
      solution: [
        {
          type: "math",
          tex: "p_{X,Y}(2,5) = p_X(2)\\,p_Y(5) = \\tfrac{1}{6} \\cdot \\tfrac{1}{6} = \\tfrac{1}{36}",
        },
        {
          type: "paragraph",
          text: "Factorising is legitimate *because* the dice are independent. Replace $Y$ by the sum and the same step would be wrong.",
        },
      ],
    },

    // --------------------------------------------- difficulty 4
    {
      kind: "numeric",
      id: "drv-b11",
      conceptIds: ["functions-of-random-variables"],
      objective: "Apply the expected value rule to a non-linear transformation.",
      difficulty: 4,
      prerequisites: ["functions-of-random-variables", "expectation"],
      prompt: [
        {
          type: "paragraph",
          text: "$X$ takes the values $1, 2, 3$, each with probability $1/3$. Let $Y = (X - 2)^2$.",
        },
        { type: "paragraph", text: "What is $E[Y]$? Give your answer to three decimal places." },
      ],
      value: 2 / 3,
      tolerance: 0.01,
      unit: "plain",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 0.5",
      hints: [
        {
          text: "Apply $g$ to each value and keep the probabilities: $g(1), g(2), g(3)$.",
        },
        { text: "Those are $1, 0, 1$." },
        { text: "Average them with weights $1/3$ each." },
      ],
      solution: [
        {
          type: "paragraph",
          text: "Transform the values, keep the weights:",
        },
        {
          type: "math",
          tex: "E[Y] = \\tfrac{1}{3}(1) + \\tfrac{1}{3}(0) + \\tfrac{1}{3}(1) = \\tfrac{2}{3} \\approx 0.667",
        },
        {
          type: "paragraph",
          text: "Note $g(E[X]) = (2 - 2)^2 = 0$, which is not the answer — squaring is non-linear, so it does not commute with expectation. In fact $E[Y]$ here is exactly $\\mathrm{var}(X)$, since 2 happens to be the mean.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "drv-b12",
      conceptIds: ["conditional-expectation-discrete"],
      objective: "Compute an expectation inside a conditioned sample space.",
      difficulty: 4,
      prerequisites: ["conditional-expectation-discrete"],
      prompt: [
        {
          type: "paragraph",
          text: "A fair six-sided die is rolled. What is $E[X \\mid X \\text{ is even}]$?",
        },
      ],
      value: 4,
      tolerance: 0.01,
      unit: "plain",
      acceptFraction: true,
      placeholder: "e.g. 3.5",
      hints: [
        { text: "Which faces survive the condition?" },
        { text: "2, 4 and 6, each now with probability $1/3$ rather than $1/6$." },
        { text: "$\\frac{2 + 4 + 6}{3}$." },
      ],
      solution: [
        {
          type: "paragraph",
          text: "Conditioning on *even* leaves three equally likely faces, renormalised to $1/3$ each:",
        },
        { type: "math", tex: "E[X \\mid X \\text{ even}] = \\frac{2 + 4 + 6}{3} = 4" },
        {
          type: "paragraph",
          text: "Above the unconditional 3.5, as it must be — the condition removed the three smallest faces.",
        },
      ],
    },
    {
      kind: "multiple-choice",
      id: "drv-b13",
      conceptIds: ["variance"],
      objective: "Interpret a variance of zero.",
      difficulty: 4,
      prerequisites: ["variance"],
      prompt: [
        { type: "paragraph", text: "A random variable has $\\mathrm{var}(X) = 0$. What follows?" },
      ],
      choices: [
        { id: "a", label: "$X$ takes a single value with probability 1", correct: true },
        {
          id: "b",
          label: "$E[X] = 0$",
          misconception:
            "Variance and mean are independent of one another. A variable that is always 7 has variance 0 and mean 7.",
        },
        {
          id: "c",
          label: "$X$ is equally likely to take any of its values",
          misconception:
            "That is a uniform distribution, which has *positive* variance whenever it has more than one value. Zero variance means no spread at all.",
        },
        {
          id: "d",
          label: "Nothing — variance can be zero for many distributions",
          misconception:
            "Only one kind. Variance averages non-negative squared deviations, so it vanishes only when every deviation does.",
        },
      ],
      hints: [
        { text: "Variance is an average of squared deviations, and squares cannot be negative." },
        {
          text: "An average of non-negative numbers is zero only when every one of them is zero.",
        },
      ],
      solution: [
        {
          type: "paragraph",
          text: "Each term $(x - \\mu)^2 p_X(x)$ is non-negative, so the sum is zero only if every term is:",
        },
        { type: "math", tex: "\\mathrm{var}(X) = \\sum_x (x - \\mu)^2 p_X(x) = 0" },
        {
          type: "paragraph",
          text: "So any value with positive mass must satisfy $x = \\mu$. The variable is constant, equal to its mean with probability 1 — which is the formal way of saying it is not really random.",
        },
      ],
    },

    // --------------------------------------------- difficulty 5
    {
      kind: "numeric",
      id: "drv-b14",
      conceptIds: ["expectation", "discrete-random-variables"],
      objective: "Derive the distribution of an order statistic and take its expectation.",
      difficulty: 5,
      prerequisites: ["expectation", "probability-mass-functions"],
      prompt: [
        {
          type: "paragraph",
          text: "Two fair dice are rolled. Let $N$ be the **smaller** of the two values — if they tie, $N$ is that value.",
        },
        { type: "paragraph", text: "What is $E[N]$? Give your answer to three decimal places." },
      ],
      value: 91 / 36,
      tolerance: 0.01,
      unit: "plain",
      acceptFraction: true,
      placeholder: "e.g. 3.5",
      hints: [
        {
          text: "Work through the tail: $N \\geq k$ means both dice are at least $k$.",
        },
        {
          text: "$P(N \\geq k) = \\frac{(7-k)^2}{36}$, so $p_N(k) = \\frac{(7-k)^2 - (6-k)^2}{36} = \\frac{13 - 2k}{36}$.",
        },
        {
          text: "The masses for $k = 1 \\ldots 6$ are $11, 9, 7, 5, 3, 1$ over 36. Weight and add.",
        },
      ],
      solution: [
        {
          type: "paragraph",
          text: "Both dice are at least $k$ in $(7-k)^2$ of the 36 outcomes, so differencing gives the PMF:",
        },
        { type: "math", tex: "p_N(k) = \\frac{(7-k)^2 - (6-k)^2}{36} = \\frac{13 - 2k}{36}" },
        {
          type: "math",
          tex: "E[N] = \\frac{1(11) + 2(9) + 3(7) + 4(5) + 5(3) + 6(1)}{36} = \\frac{91}{36} \\approx 2.528",
        },
        {
          type: "paragraph",
          text: "A strong check: the smaller and larger dice must together account for the sum, so $E[N] + E[\\max] = E[\\text{sum}] = 7$. And indeed $\\frac{91}{36} + \\frac{161}{36} = \\frac{252}{36} = 7$.",
        },
      ],
    },
    {
      kind: "numeric",
      id: "drv-b15",
      conceptIds: ["conditional-expectation-discrete", "probability-mass-functions"],
      objective: "Condition a distribution on an event and take the expectation of the result.",
      difficulty: 5,
      prerequisites: ["conditional-expectation-discrete"],
      prompt: [
        {
          type: "paragraph",
          text: "A fair coin is flipped twice. Let $X$ be the number of heads. You are told that **at least one** flip came up heads.",
        },
        {
          type: "paragraph",
          text: "What is $E[X \\mid X \\geq 1]$? Give your answer to three decimal places.",
        },
      ],
      value: 4 / 3,
      tolerance: 0.01,
      unit: "plain",
      acceptFraction: true,
      preferSimplified: true,
      placeholder: "e.g. 1.5",
      hints: [
        {
          text: "The unconditional PMF is $p_X(0) = 1/4$, $p_X(1) = 1/2$, $p_X(2) = 1/4$.",
        },
        {
          text: "The condition removes $X = 0$, so divide the survivors by $P(X \\geq 1) = 3/4$.",
        },
        {
          text: "The conditional masses become $2/3$ for $X = 1$ and $1/3$ for $X = 2$.",
        },
      ],
      solution: [
        {
          type: "paragraph",
          text: "Remove the outcome $X = 0$ and renormalise what is left over $P(X \\geq 1) = 3/4$:",
        },
        {
          type: "math",
          tex: "p_{X \\mid X \\geq 1}(1) = \\frac{1/2}{3/4} = \\frac{2}{3}, \\qquad p_{X \\mid X \\geq 1}(2) = \\frac{1/4}{3/4} = \\frac{1}{3}",
        },
        {
          type: "math",
          tex: "E[X \\mid X \\geq 1] = 1\\left(\\tfrac{2}{3}\\right) + 2\\left(\\tfrac{1}{3}\\right) = \\tfrac{4}{3} \\approx 1.333",
        },
        {
          type: "paragraph",
          text: "Above the unconditional $E[X] = 1$, as expected. Answering 1.5 averages the two surviving values without weighting them — but one head is twice as likely as two.",
        },
      ],
    },
  ],
};
