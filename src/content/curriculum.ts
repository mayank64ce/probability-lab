/**
 * The MIT 6.041SC curriculum map.
 *
 * Units, topics and concepts for the whole course are declared up front so the
 * dashboard can show the real shape of the syllabus from day one. Lessons are
 * attached to concepts incrementally — phase 1 ships exactly one.
 */

import type { Concept, Topic, Unit } from "./schema";

export const COURSE = {
  code: "6.041SC",
  title: "Probabilistic Systems Analysis and Applied Probability",
  institution: "MIT OpenCourseWare",
  term: "Fall 2013",
  instructor: "Prof. John Tsitsiklis",
  url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/",
  license: "CC BY-NC-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
} as const;

export const UNITS: Unit[] = [
  {
    id: "unit-1",
    label: "Unit I",
    title: "Probability Models and Discrete Random Variables",
    summary:
      "Build the language of probability: sample spaces, conditioning, independence, and random variables that take countably many values.",
    topicIds: ["foundations", "conditioning", "discrete-random-variables"],
  },
  {
    id: "unit-2",
    label: "Unit II",
    title: "General Random Variables",
    summary:
      "Move from counting outcomes to measuring them, using densities, joint distributions, and transformations.",
    topicIds: ["continuous-random-variables", "joint-continuous", "transformations"],
  },
  {
    id: "unit-3",
    label: "Unit III",
    title: "Random Processes",
    summary:
      "Study randomness unfolding over time: Bernoulli and Poisson arrivals, and Markov chains with memory of only the present.",
    topicIds: ["bernoulli-process", "poisson-process", "markov-chains"],
  },
  {
    id: "unit-4",
    label: "Unit IV",
    title: "Limit Theorems and Inference",
    summary:
      "Understand what happens in the long run, and how to reason backwards from data to the model that produced it.",
    topicIds: ["inequalities-and-limits", "inference"],
  },
];

export const TOPICS: Topic[] = [
  {
    id: "foundations",
    title: "Probability Models and Counting",
    unitId: "unit-1",
    conceptIds: ["sample-spaces", "probability-axioms", "counting"],
  },
  {
    id: "conditioning",
    title: "Conditioning, Bayes' Rule, and Independence",
    unitId: "unit-1",
    conceptIds: [
      "conditional-probability",
      "multiplication-rule",
      "total-probability",
      "bayes-theorem",
      "independence",
      "conditional-independence",
    ],
  },
  {
    id: "discrete-random-variables",
    title: "Discrete Random Variables",
    unitId: "unit-1",
    conceptIds: [
      "discrete-random-variables",
      "probability-mass-functions",
      "expectation",
      "variance",
      "functions-of-random-variables",
      "joint-pmfs",
      "conditional-expectation-discrete",
    ],
  },
  {
    id: "continuous-random-variables",
    title: "Continuous Random Variables",
    unitId: "unit-2",
    conceptIds: ["continuous-random-variables", "pdfs", "cdfs", "uniform-exponential-normal"],
  },
  {
    id: "joint-continuous",
    title: "Joint and Conditional Densities",
    unitId: "unit-2",
    conceptIds: [
      "joint-densities",
      "marginal-densities",
      "conditional-densities",
      "continuous-independence",
    ],
  },
  {
    id: "transformations",
    title: "Transformations, Covariance, and Correlation",
    unitId: "unit-2",
    conceptIds: [
      "transformations",
      "covariance",
      "correlation",
      "conditional-expectation-continuous",
    ],
  },
  {
    id: "bernoulli-process",
    title: "The Bernoulli Process",
    unitId: "unit-3",
    conceptIds: ["bernoulli-process", "geometric-distribution", "memorylessness"],
  },
  {
    id: "poisson-process",
    title: "The Poisson Process",
    unitId: "unit-3",
    conceptIds: ["poisson-process", "arrival-times", "merging-and-splitting"],
  },
  {
    id: "markov-chains",
    title: "Markov Chains",
    unitId: "unit-3",
    conceptIds: [
      "markov-chains",
      "transition-probabilities",
      "state-classification",
      "stationary-distributions",
      "long-run-behavior",
    ],
  },
  {
    id: "inequalities-and-limits",
    title: "Inequalities and Limit Theorems",
    unitId: "unit-4",
    conceptIds: [
      "markov-inequality",
      "chebyshev-inequality",
      "weak-law-of-large-numbers",
      "convergence",
      "central-limit-theorem",
    ],
  },
  {
    id: "inference",
    title: "Bayesian and Classical Inference",
    unitId: "unit-4",
    conceptIds: [
      "bayesian-inference",
      "parameter-estimation",
      "maximum-likelihood",
      "confidence-intervals",
      "hypothesis-testing",
    ],
  },
];

function concept(
  id: string,
  title: string,
  unitId: Unit["id"],
  topicId: string,
  objective: string,
  prerequisites: string[] = [],
): Concept {
  return { id, title, unitId, topicId, objective, prerequisites };
}

export const CONCEPTS: Concept[] = [
  // --- Unit I ------------------------------------------------------------
  concept(
    "sample-spaces",
    "Sample Spaces and Events",
    "unit-1",
    "foundations",
    "Describe an experiment as a set of mutually exclusive, collectively exhaustive outcomes.",
  ),
  concept(
    "probability-axioms",
    "Probability Axioms",
    "unit-1",
    "foundations",
    "Apply non-negativity, normalization, and additivity to derive probabilities.",
    ["sample-spaces"],
  ),
  concept(
    "counting",
    "Counting Methods",
    "unit-1",
    "foundations",
    "Count arrangements, combinations, and partitions to evaluate equally likely models.",
    ["probability-axioms"],
  ),
  concept(
    "conditional-probability",
    "Conditional Probability",
    "unit-1",
    "conditioning",
    "Recompute a probability once the set of possible outcomes is restricted by information.",
    ["sample-spaces", "probability-axioms"],
  ),
  concept(
    "multiplication-rule",
    "The Multiplication Rule",
    "unit-1",
    "conditioning",
    "Decompose the probability of a sequence of events into conditional stages.",
    ["conditional-probability"],
  ),
  concept(
    "total-probability",
    "Total Probability Theorem",
    "unit-1",
    "conditioning",
    "Assemble an unconditional probability from a partition of conditioning cases.",
    ["conditional-probability"],
  ),
  concept(
    "bayes-theorem",
    "Bayes' Theorem",
    "unit-1",
    "conditioning",
    "Invert a conditional probability to infer a cause from an observed effect.",
    ["conditional-probability", "total-probability"],
  ),
  concept(
    "independence",
    "Independence",
    "unit-1",
    "conditioning",
    "Recognize when information about one event leaves another event's probability unchanged.",
    ["conditional-probability"],
  ),
  concept(
    "conditional-independence",
    "Conditional Independence",
    "unit-1",
    "conditioning",
    "Distinguish independence from independence given a third event.",
    ["independence"],
  ),
  concept(
    "discrete-random-variables",
    "Discrete Random Variables",
    "unit-1",
    "discrete-random-variables",
    "Map outcomes to numerical values and reason about the resulting distribution.",
    ["sample-spaces"],
  ),
  concept(
    "probability-mass-functions",
    "Probability Mass Functions",
    "unit-1",
    "discrete-random-variables",
    "Specify and manipulate the PMF of a discrete random variable.",
    ["discrete-random-variables"],
  ),
  concept(
    "expectation",
    "Expectation",
    "unit-1",
    "discrete-random-variables",
    "Compute and interpret the mean of a distribution as a weighted average.",
    ["probability-mass-functions"],
  ),
  concept(
    "variance",
    "Variance and Standard Deviation",
    "unit-1",
    "discrete-random-variables",
    "Quantify spread and apply the variance of a linear function.",
    ["expectation"],
  ),
  concept(
    "functions-of-random-variables",
    "Functions of Random Variables",
    "unit-1",
    "discrete-random-variables",
    "Derive the distribution of a transformed discrete random variable.",
    ["probability-mass-functions"],
  ),
  concept(
    "joint-pmfs",
    "Joint PMFs",
    "unit-1",
    "discrete-random-variables",
    "Work with the joint, marginal, and conditional PMFs of several random variables.",
    ["probability-mass-functions", "conditional-probability"],
  ),
  concept(
    "conditional-expectation-discrete",
    "Conditional Expectation",
    "unit-1",
    "discrete-random-variables",
    "Use the total expectation theorem to compute means in stages.",
    ["expectation", "joint-pmfs"],
  ),

  // --- Unit II -----------------------------------------------------------
  concept(
    "continuous-random-variables",
    "Continuous Random Variables",
    "unit-2",
    "continuous-random-variables",
    "Reason about random variables whose range is an interval rather than a list.",
    ["discrete-random-variables"],
  ),
  concept(
    "pdfs",
    "Probability Density Functions",
    "unit-2",
    "continuous-random-variables",
    "Integrate a density to obtain probabilities, expectations, and variances.",
    ["continuous-random-variables"],
  ),
  concept(
    "cdfs",
    "Cumulative Distribution Functions",
    "unit-2",
    "continuous-random-variables",
    "Relate CDFs to PDFs and PMFs, and use them across both worlds.",
    ["pdfs"],
  ),
  concept(
    "uniform-exponential-normal",
    "Uniform, Exponential, and Normal",
    "unit-2",
    "continuous-random-variables",
    "Recognize and apply the three workhorse continuous distributions.",
    ["pdfs"],
  ),
  concept(
    "joint-densities",
    "Joint Densities",
    "unit-2",
    "joint-continuous",
    "Describe two continuous random variables with a joint density.",
    ["pdfs"],
  ),
  concept(
    "marginal-densities",
    "Marginal Densities",
    "unit-2",
    "joint-continuous",
    "Recover the density of one variable by integrating the other out.",
    ["joint-densities"],
  ),
  concept(
    "conditional-densities",
    "Conditional Densities",
    "unit-2",
    "joint-continuous",
    "Condition a continuous distribution on the value of another variable.",
    ["joint-densities", "conditional-probability"],
  ),
  concept(
    "continuous-independence",
    "Independence of Continuous Variables",
    "unit-2",
    "joint-continuous",
    "Test independence by factoring a joint density.",
    ["joint-densities", "independence"],
  ),
  concept(
    "transformations",
    "Transformations of Random Variables",
    "unit-2",
    "transformations",
    "Derive the density of a function of a continuous random variable.",
    ["pdfs", "cdfs"],
  ),
  concept(
    "covariance",
    "Covariance",
    "unit-2",
    "transformations",
    "Measure joint variability and apply the variance of a sum.",
    ["variance", "joint-densities"],
  ),
  concept(
    "correlation",
    "Correlation",
    "unit-2",
    "transformations",
    "Interpret the correlation coefficient and its limits as a measure of dependence.",
    ["covariance"],
  ),
  concept(
    "conditional-expectation-continuous",
    "Conditional Expectation and Variance",
    "unit-2",
    "transformations",
    "Apply the laws of iterated expectation and total variance.",
    ["conditional-densities", "conditional-expectation-discrete"],
  ),

  // --- Unit III ----------------------------------------------------------
  concept(
    "bernoulli-process",
    "The Bernoulli Process",
    "unit-3",
    "bernoulli-process",
    "Model a stream of independent trials and count successes over time.",
    ["independence"],
  ),
  concept(
    "geometric-distribution",
    "Geometric Distribution",
    "unit-3",
    "bernoulli-process",
    "Analyse waiting times until the first success.",
    ["bernoulli-process"],
  ),
  concept(
    "memorylessness",
    "Memorylessness",
    "unit-3",
    "bernoulli-process",
    "Explain why a fresh start carries no memory of past failures.",
    ["geometric-distribution"],
  ),
  concept(
    "poisson-process",
    "The Poisson Process",
    "unit-3",
    "poisson-process",
    "Model arrivals in continuous time and compute counts over intervals.",
    ["bernoulli-process"],
  ),
  concept(
    "arrival-times",
    "Arrival and Interarrival Times",
    "unit-3",
    "poisson-process",
    "Relate Poisson counts to exponential and Erlang waiting times.",
    ["poisson-process", "uniform-exponential-normal"],
  ),
  concept(
    "merging-and-splitting",
    "Merging and Splitting",
    "unit-3",
    "poisson-process",
    "Combine and thin independent arrival streams.",
    ["poisson-process"],
  ),
  concept(
    "markov-chains",
    "Markov Chains",
    "unit-3",
    "markov-chains",
    "Model a system whose next state depends only on the current one.",
    ["conditional-probability"],
  ),
  concept(
    "transition-probabilities",
    "Transition Probabilities",
    "unit-3",
    "markov-chains",
    "Compute n-step transition probabilities from a transition matrix.",
    ["markov-chains"],
  ),
  concept(
    "state-classification",
    "Classification of States",
    "unit-3",
    "markov-chains",
    "Identify recurrent, transient, and periodic states.",
    ["markov-chains"],
  ),
  concept(
    "stationary-distributions",
    "Stationary Distributions",
    "unit-3",
    "markov-chains",
    "Solve the balance equations for a chain's steady state.",
    ["transition-probabilities"],
  ),
  concept(
    "long-run-behavior",
    "Long-Run Behavior",
    "unit-3",
    "markov-chains",
    "Predict where a chain spends its time after a long run.",
    ["stationary-distributions", "state-classification"],
  ),

  // --- Unit IV -----------------------------------------------------------
  concept(
    "markov-inequality",
    "Markov's Inequality",
    "unit-4",
    "inequalities-and-limits",
    "Bound a tail probability using only the mean.",
    ["expectation"],
  ),
  concept(
    "chebyshev-inequality",
    "Chebyshev's Inequality",
    "unit-4",
    "inequalities-and-limits",
    "Bound deviation from the mean using the variance.",
    ["variance", "markov-inequality"],
  ),
  concept(
    "weak-law-of-large-numbers",
    "Weak Law of Large Numbers",
    "unit-4",
    "inequalities-and-limits",
    "Explain why sample means concentrate around the true mean.",
    ["chebyshev-inequality"],
  ),
  concept(
    "convergence",
    "Convergence in Probability",
    "unit-4",
    "inequalities-and-limits",
    "Distinguish convergence in probability from convergence of distributions.",
    ["weak-law-of-large-numbers"],
  ),
  concept(
    "central-limit-theorem",
    "Central Limit Theorem",
    "unit-4",
    "inequalities-and-limits",
    "Approximate the distribution of a sum by a normal distribution.",
    ["weak-law-of-large-numbers", "uniform-exponential-normal"],
  ),
  concept(
    "bayesian-inference",
    "Bayesian Inference",
    "unit-4",
    "inference",
    "Update a prior into a posterior using observed data.",
    ["bayes-theorem"],
  ),
  concept(
    "parameter-estimation",
    "Parameter Estimation",
    "unit-4",
    "inference",
    "Construct and evaluate estimators of an unknown parameter.",
    ["bayesian-inference"],
  ),
  concept(
    "maximum-likelihood",
    "Maximum Likelihood Estimation",
    "unit-4",
    "inference",
    "Choose the parameter that makes the observed data most probable.",
    ["parameter-estimation"],
  ),
  concept(
    "confidence-intervals",
    "Confidence Intervals",
    "unit-4",
    "inference",
    "Build and correctly interpret an interval estimate.",
    ["central-limit-theorem", "parameter-estimation"],
  ),
  concept(
    "hypothesis-testing",
    "Hypothesis Testing",
    "unit-4",
    "inference",
    "Decide between competing hypotheses and quantify the error types.",
    ["bayesian-inference"],
  ),
];

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export const CONCEPTS_BY_ID = new Map(CONCEPTS.map((c) => [c.id, c]));
export const TOPICS_BY_ID = new Map(TOPICS.map((t) => [t.id, t]));
export const UNITS_BY_ID = new Map(UNITS.map((u) => [u.id, u]));

export function conceptTitle(id: string): string {
  return CONCEPTS_BY_ID.get(id)?.title ?? id;
}

export function conceptsForUnit(unitId: Unit["id"]): Concept[] {
  return CONCEPTS.filter((c) => c.unitId === unitId);
}

export function topicsForUnit(unitId: Unit["id"]): Topic[] {
  return TOPICS.filter((t) => t.unitId === unitId);
}
