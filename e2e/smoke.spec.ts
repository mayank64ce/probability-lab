import { expect, test } from "@playwright/test";

/**
 * Smoke tests for the built application.
 *
 * These check the things jsdom cannot: that the production bundle boots, that
 * lazily loaded chunks arrive, that the layout does not overflow a phone, and
 * that progress survives a genuine page reload.
 */

test("the dashboard boots and recommends the first lesson", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Probability Lab" })).toBeVisible();
  await expect(page.getByText(/recommended next/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /start lesson/i })).toBeVisible();
});

test("a lesson loads its own chunk and nothing else", async ({ page }) => {
  const chunks: string[] = [];
  page.on("response", (r) => {
    const name = r.url().split("/").pop() ?? "";
    if (/^(cp|fn|rv)-\d+-/.test(name)) chunks.push(name.split("-").slice(0, 2).join("-"));
  });

  await page.goto("./lesson/CP-01");
  await expect(page.getByText(/a class of 100 students/i)).toBeVisible();

  expect(chunks).toEqual(["cp-01"]);
});

test("a learner can answer a question and advance", async ({ page }) => {
  await page.goto("./lesson/CP-01");
  await page.getByRole("radio", { name: "50%" }).click();
  await page.getByRole("button", { name: /check answer/i }).click();

  await expect(page.getByText("Correct.")).toBeVisible();
  await page.getByRole("button", { name: /^Continue/ }).click();
  await expect(page.getByRole("heading", { name: /watch the denominator move/i })).toBeVisible();
});

test("progress survives a real page reload", async ({ page }) => {
  await page.goto("./lesson/CP-01");
  await page.getByRole("radio", { name: "50%" }).click();
  await page.getByRole("button", { name: /check answer/i }).click();
  await expect(page.getByText("Correct.")).toBeVisible();

  await page.goto("./");
  await expect(page.getByText(/pick up where you left off/i)).toBeVisible();
});

test("a practice session runs from the bank", async ({ page }) => {
  await page.goto("./practice");
  await page.getByRole("button", { name: /start mixed practice/i }).click();

  await expect(page.getByText(/mixed practice/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /next problem/i })).toBeDisabled();
});

test("nothing overflows horizontally at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of ["./", "./learn", "./practice", "./review", "./lesson/RV-02"]) {
    await page.goto(path);
    await page.waitForTimeout(400);
    const { client, scroll } = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(scroll, `${path} overflows horizontally`).toBeLessThanOrEqual(client);
  }
});
