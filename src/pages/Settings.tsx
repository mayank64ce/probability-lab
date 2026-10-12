import { useRef, useState } from "react";
import { useProgress } from "../app/ProgressContext";
import { exportProgress, importProgress } from "../storage/progressStore";
import { COURSE } from "../content/curriculum";
import { Card, SectionHeading } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

type Notice = { tone: "ok" | "error"; text: string } | null;

export function Settings() {
  const { state, replaceAll, reset, setTheme } = useProgress();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  function download() {
    const blob = new Blob([exportProgress(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `probability-lab-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice({ tone: "ok", text: "Backup downloaded." });
  }

  async function onFile(file: File) {
    try {
      const next = importProgress(await file.text());
      replaceAll(next);
      setNotice({ tone: "ok", text: `Restored ${next.attempts.length} recorded answers.` });
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "That file could not be read.",
      });
    }
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Settings</h1>
        <p className="text-ink-muted mt-1.5">
          Your progress lives in this browser only. Nothing is uploaded anywhere.
        </p>
      </header>

      <section>
        <SectionHeading title="Appearance" />
        <Card>
          <div className="bg-sunken flex gap-1.5 rounded-2xl p-1.5" role="group" aria-label="Theme">
            {(["system", "light", "dark"] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                aria-pressed={state.theme === choice}
                onClick={() => setTheme(choice)}
                className={`min-h-11 flex-1 rounded-xl text-sm font-bold capitalize transition-colors ${
                  state.theme === choice
                    ? "bg-accent text-white shadow-card"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <SectionHeading
          title="Your data"
          hint={`${state.attempts.length} answers recorded · schema v${state.schemaVersion}`}
        />
        <Card>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" className="flex-1" onClick={download}>
              Export backup
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => fileInput.current?.click()}
            >
              Import backup
            </Button>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFile(file);
              e.target.value = "";
            }}
          />

          {notice && (
            <p
              role="status"
              className={`mt-4 text-sm font-bold ${
                notice.tone === "ok" ? "text-good-ink" : "text-bad-ink"
              }`}
            >
              {notice.text}
            </p>
          )}

          <hr className="border-line my-5" />

          {confirmingReset ? (
            <div className="space-y-3">
              <p className="text-sm">
                This permanently deletes every recorded answer and all lesson progress in this
                browser. Export a backup first if you might want it back.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="bad"
                  className="flex-1"
                  onClick={() => {
                    reset();
                    setConfirmingReset(false);
                    setNotice({ tone: "ok", text: "All progress erased." });
                  }}
                >
                  Yes, erase everything
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setConfirmingReset(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost-bad" onClick={() => setConfirmingReset(true)}>
              Erase all progress
            </Button>
          )}
        </Card>
      </section>

      <section>
        <SectionHeading title="Attribution" />
        <Card>
          <p className="text-ink-muted text-sm leading-relaxed">
            The curriculum follows{" "}
            <a
              href={COURSE.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent-ink font-semibold underline"
            >
              {COURSE.code} {COURSE.title}
            </a>
            , {COURSE.term}, taught by {COURSE.instructor}, {COURSE.institution}, used under{" "}
            <a
              href={COURSE.licenseUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent-ink font-semibold underline"
            >
              {COURSE.license}
            </a>
            . Every lesson and problem in this app is original work written for it; MIT course
            material is linked rather than reproduced.
          </p>
        </Card>
      </section>
    </div>
  );
}
