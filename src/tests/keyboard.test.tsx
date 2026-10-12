/**
 * Keyboard operability.
 *
 * The product plan lists keyboard accessibility in its testing standards, and
 * a claim like that is worth nothing unless something exercises it. These
 * drive the lesson with no pointer events at all.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../app/App";
import { loadProgress } from "../storage/progressStore";

beforeEach(() => {
  window.localStorage.clear();
  window.history.pushState({}, "", "/lesson/CP-01");
});

async function openLesson() {
  render(<App />);
  expect(await screen.findByText(/a class of 100 students/i)).toBeInTheDocument();
}

describe("the lesson, driven by keyboard only", () => {
  it("reaches every control by tabbing", async () => {
    const user = userEvent.setup();
    await openLesson();

    const reachable = new Set<string>();
    // Walk a generous number of stops; the lesson has far fewer than this.
    for (let i = 0; i < 25; i += 1) {
      await user.tab();
      const el = document.activeElement as HTMLElement | null;
      if (el && el !== document.body) {
        reachable.add(`${el.tagName}:${(el.textContent ?? "").trim().slice(0, 24)}`);
      }
    }

    const joined = [...reachable].join(" | ");
    // The answer choices and the hint control must be reachable.
    expect(joined).toMatch(/50%|20%|40%|80%/);
    expect(joined).toMatch(/hint/i);
    // Continue is deliberately *not* reachable yet: it is disabled until the
    // learner commits to an answer, and a disabled control should not be a
    // tab stop.
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  it("selects an answer with the arrow keys and submits with the keyboard", async () => {
    const user = userEvent.setup();
    await openLesson();

    // Focus the first choice directly, then move with arrows as ARIA expects.
    const first = screen.getByRole("radio", { name: "20%" });
    first.focus();
    expect(first).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "40%" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "50%" })).toHaveFocus();

    // Arrow navigation selects as it moves, so the answer is already chosen.
    expect(screen.getByRole("radio", { name: "50%" })).toBeChecked();

    // Activate the check button without a mouse.
    screen.getByRole("button", { name: /check answer/i }).focus();
    await user.keyboard("{Enter}");

    expect(await screen.findByText(/^correct\.$/i)).toBeInTheDocument();
    expect(loadProgress().attempts).toHaveLength(1);
  });

  it("wraps around at the ends of the choice list", async () => {
    const user = userEvent.setup();
    await openLesson();

    screen.getByRole("radio", { name: "20%" }).focus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("radio", { name: "80%" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "20%" })).toHaveFocus();
  });

  it("keeps a single tab stop for the group once a choice is made", async () => {
    const user = userEvent.setup();
    await openLesson();

    screen.getByRole("radio", { name: "20%" }).focus();
    await user.keyboard("{ArrowDown}{ArrowDown}");

    const stops = ["20%", "40%", "50%", "80%"]
      .map((name) => screen.getByRole("radio", { name }))
      .filter((el) => el.getAttribute("tabindex") !== "-1");

    // Exactly one stop, and it is the selected option.
    expect(stops).toHaveLength(1);
    expect(stops[0]).toHaveAccessibleName("50%");
  });

  it("submits a numeric answer with Enter from inside the field", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/lesson/FN-01");
    render(<App />);

    // Walk to the apply screen without touching the mouse beyond focusing.
    expect(await screen.findByText(/how many ways can two dice land/i)).toBeInTheDocument();
    screen.getByRole("radio", { name: "36" }).focus();
    await user.keyboard("{Enter}");
    screen.getByRole("button", { name: /check answer/i }).focus();
    await user.keyboard("{Enter}");

    expect(await screen.findByText(/^correct\.$/i)).toBeInTheDocument();
  });
});
