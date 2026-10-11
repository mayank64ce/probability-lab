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
    <div className="space-y-7">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Your progress lives in this browser only. Nothing is uploaded anywhere.
        </p>
      </section>

      <section>
        <SectionHeading title="Appearance" />
        <Card>
          <div
            className="flex gap-1.5 rounded-xl p-1"
            role="group"
            aria-label="Theme"
            style={{ background: "var(--surface-sunken)" }}
          >
            {(["system", "light", "dark"] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                aria-pressed={state.theme === choice}
                onClick={() => setTheme(choice)}
                className="min-h-10 flex-1 rounded-lg text-sm font-semibold capitalize"
                style={
                  state.theme === choice
                    ? { background: "var(--accent)", color: "#fff" }
                    : { background: "transparent", color: "var(--text-muted)" }
                }
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
              className="mt-3 text-sm"
              style={{ color: notice.tone === "ok" ? "var(--correct)" : "var(--wrong)" }}
            >
              {notice.text}
            </p>
          )}

          <hr className="my-4" style={{ borderColor: "var(--border)" }} />

          {confirmingReset ? (
            <div className="space-y-3">
              <p className="text-sm">
                This permanently deletes every recorded answer and all lesson progress in this
                browser. Export a backup first if you might want it back.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="flex-1"
                  style={{ background: "var(--wrong)", color: "#fff" }}
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
            <Button variant="ghost" onClick={() => setConfirmingReset(true)}>
              Erase all progress
            </Button>
          )}
        </Card>
      </section>

      <section>
        <SectionHeading title="Attribution" />
        <Card>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            The curriculum follows{" "}
            <a
              href={COURSE.url}
              target="_blank"
              rel="noreferrer noopener"
              className="underline"
              style={{ color: "var(--accent-text)" }}
            >
              {COURSE.code} {COURSE.title}
            </a>
            , {COURSE.term}, taught by {COURSE.instructor}, {COURSE.institution}, used under{" "}
            <a
              href={COURSE.licenseUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="underline"
              style={{ color: "var(--accent-text)" }}
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
