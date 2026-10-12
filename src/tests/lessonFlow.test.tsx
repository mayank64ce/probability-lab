/**
 * End-to-end behaviour of the vertical slice, in a DOM.
 *
 * These exercise the acceptance criterion directly: open the app, work
 * through CP-01, and find the progress still there on a reload.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../app/App";
import {
  STORAGE_KEY,
  emptyProgress,
  loadProgress,
  saveProgress,
  upsertLessonProgress,
} from "../storage/progressStore";
import { LESSON_INDEX } from "../content/lessons";

const [FIRST, SECOND] = LESSON_INDEX;

beforeEach(() => {
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
});

/**
 * Opens CP-01 directly rather than through the dashboard's recommendation.
 * The recommendation now depends on performance and on curriculum order, and
 * these tests are about the lesson runner, not about what gets suggested.
 */
async function openLesson(_user: ReturnType<typeof userEvent.setup>) {
  window.history.pushState({}, "", "/lesson/CP-01");
  render(<App />);
  expect(await screen.findByText(/a class of 100 students/i)).toBeInTheDocument();
}

describe("the dashboard", () => {
  it("starts a brand new learner at the beginning of the curriculum", async () => {
    render(<App />);
    expect(await screen.findByText(/listing what can happen/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start lesson/i })).toBeInTheDocument();
  });

  it("shows all four MIT units", async () => {
    render(<App />);
    for (const label of ["Unit I", "Unit II", "Unit III", "Unit IV"]) {
      expect(await screen.findByText(label)).toBeInTheDocument();
    }
  });

  it("moves on to the next lesson once the first is finished", async () => {
    // Seed a completed CP-01 through the real store, so the test cannot drift
    // away from the persisted shape.
    const now = Date.now();
    saveProgress(
      upsertLessonProgress(emptyProgress(now), {
        lessonId: FIRST.id,
        stageIndex: FIRST.stageIds.length - 1,
        completedStageIds: FIRST.stageIds,
        startedAt: now,
        updatedAt: now,
        completedAt: now,
        contentVersion: FIRST.version,
      }),
    );

    render(<App />);

    expect(await screen.findByText(/recommended next/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(SECOND.title, "i"))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start lesson/i })).toBeInTheDocument();
  });

  it("claims no weak concepts before anything is attempted", async () => {
    render(<App />);
    expect(await screen.findByText(/anything shaky will surface here/i)).toBeInTheDocument();
  });
});

describe("the predict screen", () => {
  it("will not advance until the learner commits to an answer", async () => {
    const user = userEvent.setup();
    await openLesson(user);

    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    expect(screen.getByText(/commit to an answer to continue/i)).toBeInTheDocument();
  });

  it("hides the correct answer until after submission", async () => {
    const user = userEvent.setup();
    await openLesson(user);

    // The debrief explaining why the population shrank must not be visible yet.
    expect(screen.queryByText(/the population shrank/i)).not.toBeInTheDocument();
  });

  it("confirms a correct prediction and unlocks Continue", async () => {
    const user = userEvent.setup();
    await openLesson(user);

    await user.click(screen.getByRole("radio", { name: "50%" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(await screen.findByText(/^correct\.$/i)).toBeInTheDocument();
    expect(screen.getByText(/the population shrank/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeEnabled();
  });

  it("explains the specific misconception behind a wrong choice", async () => {
    const user = userEvent.setup();
    await openLesson(user);

    await user.click(screen.getByRole("radio", { name: "20%" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(await screen.findByText(/not quite/i)).toBeInTheDocument();
    expect(screen.getByText(/the chance a student picked blindly/i)).toBeInTheDocument();
    // Predicting wrongly is part of the lesson, so the learner still moves on.
    expect(screen.getByRole("button", { name: /continue/i })).toBeEnabled();
  });

  it("records the prediction, right or wrong", async () => {
    const user = userEvent.setup();
    await openLesson(user);

    await user.click(screen.getByRole("radio", { name: "40%" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    const stored = loadProgress();
    expect(stored.attempts).toHaveLength(1);
    expect(stored.attempts[0].exerciseId).toBe("cp01-ex-predict");
    expect(stored.attempts[0].correct).toBe(false);
    expect(stored.attempts[0].contentVersion).toBe("1.0.0");
  });
});

describe("the explore screen", () => {
  it("recomputes the probability when the learner conditions on mathematics", async () => {
    const user = userEvent.setup();
    await openLesson(user);
    await user.click(screen.getByRole("radio", { name: "50%" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText(/watch the denominator move/i)).toBeInTheDocument();

    // Unconditioned: 8 of the 20 students study physics.
    expect(screen.getByText("P(physics)")).toBeInTheDocument();
    expect(screen.getByText(/8 \/ 20 = 40%/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /mathematics students only/i }));

    // Conditioned: 4 of the 8 mathematics students study physics.
    expect(await screen.findByText("P(physics | mathematics)")).toBeInTheDocument();
    expect(screen.getByText(/4 \/ 8 = 50%/)).toBeInTheDocument();
  });

  it("dims the excluded students instead of removing them", async () => {
    const user = userEvent.setup();
    await openLesson(user);
    await user.click(screen.getByRole("radio", { name: "50%" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    const before = screen.getAllByText(/^Student \d+:/);
    await user.click(screen.getByRole("button", { name: /mathematics students only/i }));
    const after = screen.getAllByText(/^Student \d+:/);

    expect(after).toHaveLength(before.length);
    expect(after.some((el) => /excluded by the condition/.test(el.textContent ?? ""))).toBe(true);
  });
});

describe("the independent challenge", () => {
  async function reachAssessment(user: ReturnType<typeof userEvent.setup>) {
    await openLesson(user);

    // 1. Predict
    await user.click(screen.getByRole("radio", { name: "50%" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // 2. Explore — graded by manipulating the figure.
    await user.click(screen.getByRole("button", { name: /mathematics students only/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // 3. Formalize — read-only.
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // 4. Apply
    await user.type(screen.getByLabelText(/your answer/i), "20");
    await user.click(screen.getByRole("button", { name: /^check$/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // 5. Reason
    await user.click(screen.getByRole("radio", { name: /independent/i }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText(/on your own/i)).toBeInTheDocument();
  }

  it("withholds hints until the first submission", async () => {
    const user = userEvent.setup();
    await reachAssessment(user);

    expect(screen.getByRole("button", { name: /show a hint/i })).toBeDisabled();
    expect(screen.getByText(/meant to be done unassisted/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/your answer/i), "1/4");
    await user.click(screen.getByRole("button", { name: /^check$/i }));

    expect(screen.getByRole("button", { name: /show a hint/i })).toBeEnabled();
  });

  it("will not let a wrong answer finish the lesson", async () => {
    const user = userEvent.setup();
    await reachAssessment(user);

    await user.type(screen.getByLabelText(/your answer/i), "4/52");
    await user.click(screen.getByRole("button", { name: /^check$/i }));

    expect(screen.getByRole("button", { name: /finish lesson/i })).toBeDisabled();
    expect(
      screen.getByText(/answer correctly, or reveal the worked solution/i),
    ).toBeInTheDocument();
  });

  it("accepts an unsimplified fraction but says it reduces", async () => {
    const user = userEvent.setup();
    await reachAssessment(user);

    await user.type(screen.getByLabelText(/your answer/i), "4/12");
    await user.click(screen.getByRole("button", { name: /^check$/i }));

    expect(await screen.findByText(/reduces to 1\/3/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /finish lesson/i })).toBeEnabled();
  });

  it("marks the first unassisted attempt as independent", async () => {
    const user = userEvent.setup();
    await reachAssessment(user);

    await user.type(screen.getByLabelText(/your answer/i), "1/3");
    await user.click(screen.getByRole("button", { name: /^check$/i }));

    const assess = loadProgress().attempts.filter((a) => a.exerciseId === "cp01-ex-assess");
    expect(assess).toHaveLength(1);
    expect(assess[0].independent).toBe(true);
    expect(assess[0].correct).toBe(true);
    expect(assess[0].hintsUsed).toBe(0);
  });

  it("completes the lesson and does not claim mastery", async () => {
    const user = userEvent.setup();
    await reachAssessment(user);

    await user.type(screen.getByLabelText(/your answer/i), "1/3");
    await user.click(screen.getByRole("button", { name: /^check$/i }));
    await user.click(screen.getByRole("button", { name: /finish lesson/i }));

    expect(await screen.findByText(/lesson complete/i)).toBeInTheDocument();
    expect(screen.getByText(/one lesson is a start, not mastery/i)).toBeInTheDocument();

    const stored = loadProgress();
    expect(stored.lessons["CP-01"].completedAt).toBeDefined();
  });

  it("links out to the MIT lecture on finishing", async () => {
    const user = userEvent.setup();
    await reachAssessment(user);

    await user.type(screen.getByLabelText(/your answer/i), "1/3");
    await user.click(screen.getByRole("button", { name: /^check$/i }));
    await user.click(screen.getByRole("button", { name: /finish lesson/i }));

    const link = await screen.findByRole("link", { name: /conditioning and bayes/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("ocw.mit.edu/courses/6-041sc"));
  });
});

describe("persistence across a reload", () => {
  it("restores the learner to where they left off", async () => {
    const user = userEvent.setup();
    await openLesson(user);
    await user.click(screen.getByRole("radio", { name: "50%" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText(/watch the denominator move/i)).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    // Simulate closing the tab and coming back to the dashboard.
    screen.getByText(/watch the denominator move/i); // sanity check before unmount
    window.history.pushState({}, "", "/");
    const second = render(<App />);

    const resume = await within(second.container).findByText(/pick up where you left off/i);
    expect(resume).toBeInTheDocument();
    expect(
      within(second.container).getByRole("button", { name: /resume lesson/i }),
    ).toBeInTheDocument();
  });

  it("carries the attempt log into the next session", async () => {
    const user = userEvent.setup();
    await openLesson(user);
    await user.click(screen.getByRole("radio", { name: "20%" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    const reloaded = loadProgress();
    expect(reloaded.attempts).toHaveLength(1);
    expect(reloaded.lastLessonId).toBe("CP-01");
  });
});
