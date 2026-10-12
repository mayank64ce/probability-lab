/**
 * CP-01 — When Information Changes Probability.
 *
 * The first complete lesson. Its arc is predict → explore → formalize → apply
 * → reason → assess: the learner commits to an answer before any explanation
 * appears, discovers the rule by manipulating a population, and only then
 * meets the formula.
 *
 * All problems are original, written for this curriculum. MIT OCW material is
 * linked, never reproduced.
 */

import type { Lesson } from "../../schema";

export const CP_01: Lesson = {
  id: "CP-01",
  title: "When Information Changes Probability",
  blurb:
    "Discover why learning something true can change a probability without changing the world.",
  conceptIds: ["conditional-probability"],
  prerequisites: ["Sample spaces and events", "Probability axioms", "Fractions and percentages"],
  estimatedMinutes: 8,
  version: "1.0.0",

  resources: [
    {
      label: "Lecture 2: Conditioning and Bayes' Rule",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-2/",
      kind: "video",
      note: "Video and slides, Prof. John Tsitsiklis (51 min)",
    },
    {
      label: "Textbook reading: Sections 1.3–1.4",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-2/",
      kind: "reading",
      note: "Conditional probability and the multiplication rule",
    },
    {
      label: "Recitation 2 problems and solutions",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/unit-i/lecture-2/",
      kind: "problems",
      note: "Includes worked help videos on conditional probability and Monty Hall",
    },
    {
      label: "Course resource index",
      url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/",
      kind: "reading",
    },
  ],

  stages: [
    // -----------------------------------------------------------------
    // 1. Predict (with the hook folded in)
    // -----------------------------------------------------------------
    {
      id: "cp01-predict",
      kind: "predict",
      title: "A class of 100 students",
      intro: [
        {
          type: "paragraph",
          text: "A university class has 100 students. Of those, 40 study mathematics, and 20 study both mathematics and physics.",
        },
        {
          type: "stats",
          items: [
            { label: "Students in the class", value: "100" },
            { label: "Study mathematics", value: "40" },
            { label: "Study both subjects", value: "20" },
          ],
        },
        {
          type: "paragraph",
          text: "You pick one student at random. Before you can ask anything else, you are told: **this student studies mathematics.**",
        },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp01-ex-predict",
        conceptIds: ["conditional-probability"],
        objective: "Commit to an intuition about how new information reshapes a probability.",
        difficulty: 1,
        prompt: [
          {
            type: "paragraph",
            text: "What is the probability that this student also studies physics?",
          },
        ],
        choices: [
          {
            id: "a",
            label: "20%",
            misconception:
              "That is $P(\\text{both})=20/100$ — the chance a student picked blindly from the whole class studies both subjects. But you are not picking blindly any more. You already know this one studies mathematics.",
          },
          {
            id: "b",
            label: "40%",
            misconception:
              "40 is the number of mathematics students, so $P(\\text{mathematics})=40/100$. That is the information you were *given*, not the thing you were asked to find.",
          },
          { id: "c", label: "50%", correct: true },
          {
            id: "d",
            label: "80%",
            misconception:
              "Check which number becomes the new denominator. Knowing the student studies mathematics narrows the class to 40 students, and 20 of those 40 study physics.",
          },
        ],
        hints: [
          {
            text: "The student is definitely one of the 40 mathematics students. The other 60 are no longer possible.",
          },
          { text: "Among those 40, how many study physics as well?" },
          { text: "20 of the 40 mathematics students study physics, so the answer is $20/40$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Being told the student studies mathematics rules out 60 of the 100 students. The 40 who remain are the only candidates, and 20 of them study physics.",
          },
          { type: "math", tex: "\\frac{20}{40} = 0.5 = 50\\%" },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "The population shrank",
          text: "Nothing about the students changed. What changed is the set of outcomes still in play: 100 students became 40. The probability moved because the denominator moved.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 2. Explore
    // -----------------------------------------------------------------
    {
      id: "cp01-explore",
      kind: "explore",
      title: "Watch the denominator move",
      intro: [
        {
          type: "paragraph",
          text: "Here is a smaller class of 20 students, so you can see every one of them. Four study both subjects, four study only mathematics, four study only physics, and eight study neither.",
        },
        {
          type: "paragraph",
          text: "Switch between the two views and watch what happens to the probability of physics.",
        },
      ],
      visualization: {
        key: "student-grid",
        config: {
          both: 4,
          mathOnly: 4,
          physicsOnly: 4,
          neither: 8,
        },
      },
      exercise: {
        kind: "visual",
        id: "cp01-ex-explore",
        conceptIds: ["conditional-probability"],
        objective: "Observe that conditioning dims outcomes rather than deleting them.",
        difficulty: 1,
        prompt: [
          {
            type: "paragraph",
            text: "Switch the view to **Mathematics students only** to continue.",
          },
        ],
        visualization: "student-grid",
        config: {},
        solvedWhen: "math-only",
        hints: [{ text: "Use the Mathematics students only button above the grid." }],
        solution: [
          {
            type: "paragraph",
            text: "In the full class, 8 of 20 students study physics, so $P(\\text{physics}) = 40\\%$. Restricting to the 8 mathematics students, 4 of them study physics, so $P(\\text{physics} \\mid \\text{mathematics}) = 50\\%$.",
          },
        ],
      },
      debrief: [
        {
          type: "paragraph",
          text: "The dimmed students did not leave the class — they are simply no longer possible outcomes of *this* experiment. Conditioning is a change in what you are counting over, not a change in the world.",
        },
        {
          type: "callout",
          tone: "insight",
          title: "Conditioning is renormalising",
          text: "You keep only the outcomes consistent with what you know, then rescale so they add to 1 again.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 3. Formalize
    // -----------------------------------------------------------------
    {
      id: "cp01-formalize",
      kind: "formalize",
      title: "Writing it down",
      intro: [
        { type: "paragraph", text: "Name the two events:" },
        {
          type: "list",
          items: ["$A$ — the student studies physics", "$B$ — the student studies mathematics"],
        },
        {
          type: "paragraph",
          text: "In the class of 100, $P(B) = 0.4$ and $P(A \\cap B) = 0.2$. The quantity you worked out is the **conditional probability of $A$ given $B$**:",
        },
        { type: "math", tex: "P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}" },
        {
          type: "paragraph",
          text: "The numerator counts the outcomes where both things happen. The denominator is the new, smaller universe you are conditioning on — dividing by it is exactly the rescaling you just watched.",
        },
        { type: "math", tex: "P(A \\mid B) = \\frac{0.2}{0.4} = 0.5" },
        {
          type: "callout",
          tone: "warning",
          title: "The rule needs $P(B) > 0$",
          text: "If $B$ cannot happen, there is nothing to condition on and the quotient is undefined. Conditioning on an impossible event is meaningless, not merely inconvenient.",
        },
      ],
      derivation: {
        title: "Why this definition, and the multiplication rule",
        blocks: [
          {
            type: "paragraph",
            text: "For a finite sample space with equally likely outcomes, write $|E|$ for the number of outcomes in $E$. Conditioning on $B$ means treating $B$ as the whole space, so the conditional probability of $A$ should be the share of $B$ that also lies in $A$:",
          },
          { type: "math", tex: "P(A \\mid B) = \\frac{|A \\cap B|}{|B|}" },
          {
            type: "paragraph",
            text: "Dividing the top and bottom by $|\\Omega|$, the size of the full sample space, turns counts into probabilities:",
          },
          {
            type: "math",
            tex: "\\frac{|A \\cap B|}{|B|} = \\frac{|A \\cap B| / |\\Omega|}{|B| / |\\Omega|} = \\frac{P(A \\cap B)}{P(B)}",
          },
          {
            type: "paragraph",
            text: "The general definition keeps this formula and drops the equally-likely assumption. It is a genuine probability law on its own: $P(\\cdot \\mid B)$ is non-negative, assigns $P(B \\mid B) = P(B)/P(B) = 1$, and is additive over disjoint events, because",
          },
          {
            type: "math",
            tex: "P(A_1 \\cup A_2 \\mid B) = \\frac{P((A_1 \\cup A_2) \\cap B)}{P(B)} = \\frac{P(A_1 \\cap B) + P(A_2 \\cap B)}{P(B)}",
          },
          {
            type: "paragraph",
            text: "whenever $A_1$ and $A_2$ are disjoint. So every theorem you already know about probabilities still applies after conditioning.",
          },
          {
            type: "paragraph",
            text: "Rearranging the definition gives the **multiplication rule**, which is how conditional probabilities are usually *used* rather than computed:",
          },
          { type: "math", tex: "P(A \\cap B) = P(B)\\, P(A \\mid B) = P(A)\\, P(B \\mid A)" },
          {
            type: "paragraph",
            text: "Extended to a sequence, it lets you walk through an experiment one stage at a time:",
          },
          {
            type: "math",
            tex: "P(A_1 \\cap A_2 \\cap A_3) = P(A_1)\\, P(A_2 \\mid A_1)\\, P(A_3 \\mid A_1 \\cap A_2)",
          },
        ],
      },
      visualization: { key: "event-venn", config: { pB: 0.4, pAB: 0.2, pA: 0.35 } },
    },

    // -----------------------------------------------------------------
    // 4. Apply
    // -----------------------------------------------------------------
    {
      id: "cp01-apply",
      kind: "apply",
      title: "Now use it",
      intro: [
        {
          type: "paragraph",
          text: "A factory produces electronic components on several machines.",
        },
      ],
      exercise: {
        kind: "numeric",
        id: "cp01-ex-apply",
        conceptIds: ["conditional-probability"],
        objective:
          "Apply the definition of conditional probability to a joint probability given as a percentage of the whole.",
        difficulty: 2,
        prompt: [
          {
            type: "stats",
            items: [
              { label: "Come from Machine A", value: "30%" },
              { label: "From Machine A and defective", value: "6%" },
            ],
          },
          {
            type: "paragraph",
            text: "Both percentages are shares of **all** components the factory makes. Given that a component came from Machine A, what percentage of such components are defective?",
          },
        ],
        value: 20,
        tolerance: 0.5,
        unit: "percent",
        acceptFraction: true,
        placeholder: "e.g. 25 or 25%",
        unitSlipFeedback:
          "Your number is right but the unit is not: $0.2$ is the probability, and the question asks for a percentage. Enter 20.",
        hints: [
          {
            text: "Name the events first. Let $A$ be *came from Machine A* and $D$ be *defective*. Which of the two given numbers is $P(A \\cap D)$, and which is $P(A)$?",
          },
          {
            text: "The 6% is a share of all components, not of Machine A's components — so it is the joint probability $P(A \\cap D) = 0.06$, and $P(A) = 0.30$.",
          },
          {
            text: "Apply the definition: $P(D \\mid A) = P(A \\cap D) / P(A) = 0.06 / 0.30$.",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Let $A$ be the event that a component came from Machine A and $D$ that it is defective. The second percentage describes components that are *both* from Machine A *and* defective, as a share of total output, so it is a joint probability.",
          },
          { type: "math", tex: "P(A) = 0.30, \\qquad P(A \\cap D) = 0.06" },
          {
            type: "math",
            tex: "P(D \\mid A) = \\frac{P(A \\cap D)}{P(A)} = \\frac{0.06}{0.30} = 0.2 = 20\\%",
          },
          {
            type: "paragraph",
            text: "So one in five of Machine A's components is defective — a far more alarming number than the 6% headline figure, which was diluted by every component the other machines made.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "Watch what the percentage is a share of",
          text: '"6% of all components are from Machine A and defective" is a joint probability. "6% of Machine A\'s components are defective" would already be the conditional one. Mixing these up is the single most common error with this formula.',
        },
      ],
    },

    // -----------------------------------------------------------------
    // 5. Reason
    // -----------------------------------------------------------------
    {
      id: "cp01-reason",
      kind: "reflect",
      title: "When information tells you nothing",
      intro: [
        {
          type: "paragraph",
          text: "So far, conditioning has always moved the probability. Suppose you condition on $B$ and nothing moves at all.",
        },
        { type: "math", tex: "P(A \\mid B) = P(A), \\qquad P(B) > 0" },
      ],
      exercise: {
        kind: "multiple-choice",
        id: "cp01-ex-reason",
        conceptIds: ["conditional-probability", "independence"],
        objective:
          "Connect an unchanged conditional probability to the definition of independence.",
        difficulty: 3,
        prompt: [{ type: "paragraph", text: "What can you conclude?" }],
        choices: [
          {
            id: "a",
            label: "$A$ and $B$ are independent",
            correct: true,
          },
          {
            id: "b",
            label: "$A$ and $B$ are mutually exclusive",
            misconception:
              "Mutually exclusive means $A \\cap B = \\emptyset$, so $P(A \\mid B) = 0$. That is the *opposite* situation: knowing $B$ would tell you $A$ definitely did not happen — highly informative.",
          },
          {
            id: "c",
            label: "$A$ and $B$ are the same event",
            misconception:
              "If $A = B$ then $P(A \\mid B) = 1$, which only equals $P(A)$ in the degenerate case $P(A) = 1$.",
          },
          {
            id: "d",
            label: "$P(B \\mid A)$ must be 0",
            misconception:
              "Try it on the multiplication rule. From $P(A \\cap B) = P(A)P(B)$ you get $P(B \\mid A) = P(B)$ whenever $P(A) > 0$ — unchanged, not zero.",
          },
        ],
        hints: [
          { text: "Put $P(A \\mid B) = P(A)$ into the definition and clear the denominator." },
          {
            text: "You get $P(A \\cap B) = P(A)\\,P(B)$. Where have you seen that product before?",
          },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Substitute into the definition and multiply through by $P(B)$:",
          },
          {
            type: "math",
            tex: "P(A) = \\frac{P(A \\cap B)}{P(B)} \\;\\Longrightarrow\\; P(A \\cap B) = P(A)\\,P(B)",
          },
          {
            type: "paragraph",
            text: "That product is the definition of **independence**. Learning that $B$ occurred left your belief about $A$ exactly where it started, so $B$ carried no information about $A$.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "insight",
          title: "Independence is the special case",
          text: "Independence is not a separate idea bolted onto probability — it is the one case where conditioning does nothing. Note too that $P(A \\cap B) = P(A)P(B)$ is symmetric, so if $B$ says nothing about $A$, then $A$ says nothing about $B$.",
        },
        {
          type: "paragraph",
          text: "That symmetry is where the next lesson starts.",
        },
      ],
    },

    // -----------------------------------------------------------------
    // 6. Independent challenge
    // -----------------------------------------------------------------
    {
      id: "cp01-assess",
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
        id: "cp01-ex-assess",
        conceptIds: ["conditional-probability"],
        objective: "Independently condition a uniform sample space on a restricting event.",
        difficulty: 2,
        prompt: [
          {
            type: "paragraph",
            text: "A single card is drawn uniformly at random from a standard 52-card deck. You are told the card is a Jack, a Queen, or a King.",
          },
          {
            type: "paragraph",
            text: "What is the probability that it is a King? Give a probability between 0 and 1, as a decimal or a fraction.",
          },
        ],
        value: 1 / 3,
        tolerance: 0.005,
        unit: "probability",
        acceptFraction: true,
        preferSimplified: true,
        placeholder: "e.g. 1/4 or 0.25",
        unitSlipFeedback:
          "That is the right percentage, but this question asks for a probability between 0 and 1. Divide by 100, or add a % sign.",
        hints: [
          { text: "The information restricts the deck. How many cards are still possible?" },
          { text: "There are 4 Jacks, 4 Queens, and 4 Kings, so 12 cards remain in play." },
          { text: "Of those 12 possible cards, 4 are Kings: $P = 4/12$." },
        ],
        solution: [
          {
            type: "paragraph",
            text: "Let $K$ be the event the card is a King and $F$ the event it is a Jack, Queen, or King. Every King is a face card of this kind, so $K \\cap F = K$.",
          },
          {
            type: "math",
            tex: "P(K \\cap F) = P(K) = \\frac{4}{52}, \\qquad P(F) = \\frac{12}{52}",
          },
          {
            type: "math",
            tex: "P(K \\mid F) = \\frac{P(K \\cap F)}{P(F)} = \\frac{4/52}{12/52} = \\frac{4}{12} = \\frac{1}{3}",
          },
          {
            type: "paragraph",
            text: "The 52s cancel, which is the formula agreeing with the obvious count: 12 equally likely cards remain, and 4 of them are Kings.",
          },
        ],
      },
      debrief: [
        {
          type: "callout",
          tone: "info",
          title: "One question is not mastery",
          text: "Getting this right is a good sign, not a conclusion. The concept will come back in practice and again after a delay, because remembering it in a week is the part that matters.",
        },
      ],
    },
  ],
};
