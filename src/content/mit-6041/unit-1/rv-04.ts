/**
 * RV-04 — How Far From the Middle.
 *
 * Variance and standard deviation. Built around two distributions with the
 * same mean and very different risk, because that contrast is the only honest
 * motivation for a second summary number.
 *
 * All problems are original. MIT OCW material is linked, never reproduced.
 */

import type { Lesson } from "../../schema";
import { DIE_PMF } from "./rv-01";

export const RV_04: Lesson = {
  id: "RV-04",
  title: "How Far From the Middle",
  blurb: "Measure spread, and see why two very different variables can share an average.",
  conceptIds: ["variance"],
  prerequisites: ["Expectation", "Probability mass functions"],
  estimatedMinutes: 9,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 5: Discrete Random Variables; PMFs; Expectations",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-5/",
      kind: "video",
      note: "Variance and standard deviation, Prof. John Tsitsiklis",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    {
      id: "rv04-predict",
      kind: "predict",
      title: "Same average, different risk",
      intro: [
        {
          type: "paragraph",
          text: "Two investments, each costing the same:",
        },
        {
          type: "list",
          items: [
            "**Fund A** returns exactly £5, every time.",
            "**Fund B** returns £0 or £10, each with probability $1/2$.",
          ],
        },
        {
          type: "paragraph",
          text: "Both have an expected return of £5 — for B, $\\tfrac{1}{2}(0) + \\tfrac{1}{2}(10) = 5$.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv04-ex-predict",
        conceptIds: ["variance"],
        objective:
          "Notice that expectation alone fails to distinguish two very different variables.",
        difficulty: 2,
        prompt: [
          {
            type: "paragraph",
            text: "Expectation cannot tell these apart. What is the obvious difference it is missing?",
          },
        ],
        choices: [
          {
            id: "a",
            label: "How far the outcomes stray from the average",
            correct: true,
          },
          {
            id: "b",
            label: "Nothing — equal expectations means the investments are equivalent",
            misconception:
              "They are plainly not equivalent. A guarantees £5; B could pay nothing. Expectation summarises the centre and says nothing about the spread around it.",
          },
          {
            id: "c",
            label: "The number of possible outcomes",
            misconception:
              "Counting outcomes is too crude. A variable taking £4.99 or £5.01 also has two outcomes, and is nearly as safe as Fund A.",
          },
          {
            id: "d",
            label: "Which outcome is most likely",
            misconception:
              "Fund B's two outcomes are equally likely, so there is no single most likely value — yet B is obviously riskier. The missing idea is distance from the mean, not frequency.",
          },
        ],
        hints: [
          { text: "Describe the difference between the two funds to someone in one sentence." },
          { text: "A never deviates from £5; B always deviates by exactly £5." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Both balance at £5. What differs is how far the outcomes sit from that balance point:",
          },
          {
            type: "list",
            items: ["Fund A deviates by 0, always.", "Fund B deviates by 5, always — up or down."],
          },
          {
            type: "paragraph",
            text: "A second number is needed, and it should measure typical distance from the mean.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "One number is not enough",
          text: "Expectation locates the centre. Everything about risk, reliability and precision lives in how tightly the distribution clusters around it.",
        },
      ],
    },

    {
      id: "rv04-explore",
      kind: "explore",
      title: "Seeing the spread",
      intro: [
        {
          type: "paragraph",
          text: "Back to the single fair die. Switch on the spread to see one standard deviation either side of the mean.",
        },
        {
          type: "paragraph",
          text: "The shaded band is the natural scale of the distribution — roughly how far from 3.5 a typical roll lands.",
        },
      ],
      visualization: {
        key: "pmf-chart",
        config: { ...DIE_PMF, offerMean: true, offerSpread: true },
      },
      exercise: {
        kind: "visual",
        id: "rv04-ex-explore",
        conceptIds: ["variance"],
        objective: "Read variance and standard deviation off a distribution.",
        difficulty: 1,
        prompt: [{ type: "paragraph", text: "Select **Show the spread** to continue." }],
        visualization: "pmf-chart",
        config: {},
        solvedWhen: "spread",
        hints: [{ text: "Use the toggle above the chart." }],
        solution: [
          {
            type: "paragraph",
            text: "The die has variance $35/12 \\approx 2.917$ and standard deviation about $1.71$, so the band runs from roughly $1.79$ to $5.21$.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "Notice the band is given in the same units as the die faces, while the variance — about 2.9 — is in *squared* faces. That is why the standard deviation is usually the number quoted.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Square, average, square-root",
          text: "Deviations are squared so that overshoots and undershoots cannot cancel, averaged to get a typical squared distance, then square-rooted to return to the original units.",
        },
      ],
    },

    {
      id: "rv04-formalize",
      kind: "formalize",
      title: "Variance and standard deviation",
      intro: [
        {
          type: "paragraph",
          text: "Write $\\mu = E[X]$. The **variance** is the expected squared deviation from the mean:",
        },
        { type: "math", tex: "\\mathrm{var}(X) = E\\big[(X - \\mu)^2\\big]" },
        {
          type: "paragraph",
          text: "The **standard deviation** is its square root, $\\sigma_X = \\sqrt{\\mathrm{var}(X)}$, which carries the same units as $X$ itself.",
        },
        {
          type: "paragraph",
          text: "In practice the computational form is almost always quicker, since it needs no deviations:",
        },
        { type: "math", tex: "\\mathrm{var}(X) = E[X^2] - \\big(E[X]\\big)^2" },
        {
          type: "paragraph",
          text: "And under a linear change of variable, shifts do nothing while scalings square:",
        },
        { type: "math", tex: "\\mathrm{var}(aX + b) = a^2 \\,\\mathrm{var}(X)" },
        {
          type: "callout",
          tone: "warning",
          title: "Why squares, not absolute values",
          text: "Averaging $|X - \\mu|$ would also measure spread, and is occasionally used. Squaring wins because it is differentiable and because variances of independent variables add — neither of which is true for absolute deviations.",
        },
      ],
      visualization: {
        key: "pmf-chart",
        config: { ...DIE_PMF, offerMean: true, offerSpread: true },
      },
      derivation: {
        title: "The computational formula, and why shifts do not matter",
        blocks: [
          {
            type: "paragraph",
            text: "Expand the square inside the expectation and use linearity, remembering that $\\mu$ is a constant:",
          },
          {
            type: "math",
            tex: "E\\big[(X-\\mu)^2\\big] = E\\big[X^2 - 2\\mu X + \\mu^2\\big] = E[X^2] - 2\\mu E[X] + \\mu^2",
          },
          {
            type: "paragraph",
            text: "Since $E[X] = \\mu$, the last two terms collapse to $-\\mu^2$:",
          },
          { type: "math", tex: "\\mathrm{var}(X) = E[X^2] - \\mu^2" },
          {
            type: "paragraph",
            text: "**Shifts.** Adding a constant moves the mean by the same amount, so every deviation is unchanged:",
          },
          {
            type: "math",
            tex: "(X + b) - E[X + b] = (X + b) - (\\mu + b) = X - \\mu",
          },
          {
            type: "paragraph",
            text: "**Scalings.** Multiplying by $a$ multiplies every deviation by $a$, and the square turns that into $a^2$:",
          },
          {
            type: "math",
            tex: "\\mathrm{var}(aX) = E\\big[(aX - a\\mu)^2\\big] = a^2 E\\big[(X - \\mu)^2\\big] = a^2\\,\\mathrm{var}(X)",
          },
          {
            type: "paragraph",
            text: "Together: $\\mathrm{var}(aX + b) = a^2\\mathrm{var}(X)$. Variance is blind to where a distribution sits and sensitive only to how wide it is — which is exactly what a measure of spread should be.",
          },
        ],
      },
    },

    {
      id: "rv04-apply",
      kind: "apply",
      title: "Now use it",
      intro: [{ type: "paragraph", text: "The fair die again, this time by hand." }],
      exercise: {
        kind: "numeric",
        id: "rv04-ex-apply",
        conceptIds: ["variance"],
        objective: "Apply the computational formula for variance.",
        difficulty: 3,
        prerequisites: ["variance", "expectation"],
        prompt: [
          {
            type: "paragraph",
            text: "One fair six-sided die. What is $\\mathrm{var}(X)$? Give your answer to three decimal places.",
          },
        ],
        value: 35 / 12,
        tolerance: 0.01,
        unit: "plain",
        acceptFraction: true,
        placeholder: "e.g. 2.5",
        hints: [
          {
            text: "Use $\\mathrm{var}(X) = E[X^2] - (E[X])^2$, and you already know $E[X] = 3.5$.",
          },
          {
            text: "$E[X^2] = \\frac{1 + 4 + 9 + 16 + 25 + 36}{6} = \\frac{91}{6}$.",
          },
          { text: "$\\frac{91}{6} - 3.5^2$." },
        ],
        solution: [
          { type: "paragraph", text: "Average the squares first:" },
          {
            type: "math",
            tex: "E[X^2] = \\frac{1 + 4 + 9 + 16 + 25 + 36}{6} = \\frac{91}{6} \\approx 15.167",
          },
          { type: "paragraph", text: "Then subtract the square of the mean:" },
          {
            type: "math",
            tex: "\\mathrm{var}(X) = \\frac{91}{6} - \\left(\\frac{7}{2}\\right)^2 = \\frac{182 - 147}{12} = \\frac{35}{12} \\approx 2.917",
          },
          {
            type: "paragraph",
            text: "The standard deviation is about $1.708$. Note $E[X^2] \\neq (E[X])^2$ — that gap *is* the variance, and it is the subject of the next lesson.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Square the values, not the probabilities",
          text: "$E[X^2]$ weights $x^2$ by $p_X(x)$. Squaring the probabilities instead is a common slip and produces a number that is not a variance of anything.",
        },
      ],
    },

    {
      id: "rv04-reason",
      kind: "reflect",
      title: "Doubling the stakes",
      intro: [
        {
          type: "paragraph",
          text: "A game pays out $X$, with $\\mathrm{var}(X) = 4$. The organiser doubles every payout, so you now receive $2X$.",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "rv04-ex-reason",
        conceptIds: ["variance"],
        objective: "Apply the scaling rule for variance and explain the square.",
        difficulty: 4,
        prompt: [{ type: "paragraph", text: "What is $\\mathrm{var}(2X)$?" }],
        choices: [
          { id: "a", label: "16", correct: true },
          {
            id: "b",
            label: "8",
            misconception:
              "Doubling the payouts doubles every *deviation*, but variance is built from squared deviations — so it grows by $2^2 = 4$, not by 2. The standard deviation is what doubles.",
          },
          {
            id: "c",
            label: "4",
            misconception:
              "Variance is unchanged by *shifts*, not by scalings. Adding £2 to every payout would leave it at 4; doubling them does not.",
          },
          {
            id: "d",
            label: "2",
            misconception:
              "This halves the variance, but doubling the payouts spreads the outcomes further apart, so the spread must grow.",
          },
        ],
        hints: [
          { text: "What happens to each deviation $X - \\mu$ when every value is doubled?" },
          { text: "Each deviation doubles, so each squared deviation is multiplied by 4." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Doubling the payouts also doubles the mean, so every deviation doubles. Variance averages *squared* deviations, so it is multiplied by $2^2$:",
          },
          { type: "math", tex: "\\mathrm{var}(2X) = 2^2\\,\\mathrm{var}(X) = 4 \\times 4 = 16" },
          {
            type: "paragraph",
            text: "In standard deviations the story is simpler: $\\sigma$ goes from 2 to 4, doubling exactly as the payouts did. That is the practical argument for quoting $\\sigma$ rather than the variance.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Shifts are free, scalings are not",
          text: "$\\mathrm{var}(aX + b) = a^2\\mathrm{var}(X)$. Moving a distribution costs nothing; stretching it costs the square of the stretch.",
        },
      ],
    },

    {
      id: "rv04-assess",
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
        id: "rv04-ex-assess",
        conceptIds: ["variance"],
        objective:
          "Independently derive the variance of an indicator variable and maximise it over its parameter.",
        difficulty: 4,
        prerequisites: ["variance", "expectation"],
        prompt: [
          {
            type: "paragraph",
            text: "A coin lands heads with probability $p$. Let $X = 1$ if it comes up heads and $X = 0$ if tails.",
          },
          {
            type: "paragraph",
            text: "Over all values of $p$ between 0 and 1, what is the **largest** possible value of $\\mathrm{var}(X)$?",
          },
        ],
        value: 0.25,
        tolerance: 0.005,
        unit: "plain",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 0.5 or 1/2",
        hints: [
          {
            text: "Find $E[X]$ and $E[X^2]$ first. Note that $X^2 = X$ here, since $0^2 = 0$ and $1^2 = 1$.",
          },
          {
            text: "So $E[X] = E[X^2] = p$, giving $\\mathrm{var}(X) = p - p^2 = p(1-p)$.",
          },
          {
            text: "Where is $p(1-p)$ largest for $p$ in $[0,1]$? Try the midpoint.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Because $X$ only takes the values 0 and 1, squaring leaves it unchanged — $X^2 = X$. So both expectations are the same:",
          },
          { type: "math", tex: "E[X] = p, \\qquad E[X^2] = p" },
          {
            type: "math",
            tex: "\\mathrm{var}(X) = p - p^2 = p(1-p)",
          },
          {
            type: "paragraph",
            text: "That is a downward parabola through $p = 0$ and $p = 1$, so it peaks at the midpoint:",
          },
          {
            type: "math",
            tex: "\\mathrm{var}(X) \\big|_{p = 1/2} = \\tfrac{1}{2} \\cdot \\tfrac{1}{2} = 0.25",
          },
          {
            type: "paragraph",
            text: "A fair coin is the most unpredictable one. Push $p$ towards either extreme and the variance falls to zero, because the outcome becomes a certainty.",
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
