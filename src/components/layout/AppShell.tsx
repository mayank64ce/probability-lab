import { NavLink, Outlet } from "react-router-dom";
import { useProgress } from "../../app/ProgressContext";

const NAV = [
  { to: "/", label: "Home", icon: "◆", end: true },
  { to: "/learn", label: "Learn", icon: "▦", end: false },
  { to: "/practice", label: "Practice", icon: "◎", end: false },
  { to: "/review", label: "Review", icon: "↻", end: false },
];

function ThemeToggle() {
  const { state, resolvedTheme, setTheme } = useProgress();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme${state.theme === "system" ? " (currently following your system)" : ""}`}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-sm"
      style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
    >
      <span aria-hidden="true">{resolvedTheme === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}

/**
 * Mobile-first chrome: a compact header, and navigation that sits at the
 * bottom on phones (within thumb reach, clear of the home indicator) and
 * moves into the header on wider screens.
 */
export function AppShell() {
  const { persistent } = useProgress();

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-20 backdrop-blur"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "color-mix(in srgb, var(--surface) 88%, transparent)",
        }}
      >
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              PL
            </span>
            <span className="text-[0.95rem]">Probability Lab</span>
          </NavLink>

          <nav aria-label="Main" className="ml-auto hidden sm:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-medium"
                    style={({ isActive }) =>
                      isActive
                        ? { background: "var(--accent-soft)", color: "var(--accent-text)" }
                        : { color: "var(--text-muted)" }
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <NavLink
              to="/settings"
              aria-label="Settings"
              title="Settings"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm"
              style={({ isActive }) => ({
                background: isActive ? "var(--accent-soft)" : "var(--surface-raised)",
                border: "1px solid var(--border)",
                color: isActive ? "var(--accent-text)" : "var(--text)",
              })}
            >
              <span aria-hidden="true">⚙</span>
            </NavLink>
            <ThemeToggle />
          </div>
        </div>

        {!persistent && (
          <p
            className="px-4 pb-2 text-center text-xs"
            style={{ color: "var(--warn)" }}
            role="status"
          >
            Progress cannot be saved in this browser — private mode or blocked site data.
          </p>
        )}
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-5 pb-28 sm:pb-10">
        <Outlet />
      </main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 backdrop-blur sm:hidden"
        style={{
          borderTop: "1px solid var(--border)",
          background: "color-mix(in srgb, var(--surface) 92%, transparent)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <ul className="mx-auto flex max-w-3xl">
          {NAV.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.7rem] font-medium"
                style={({ isActive }) => ({
                  color: isActive ? "var(--accent-text)" : "var(--text-muted)",
                })}
              >
                <span aria-hidden="true" className="text-base leading-none">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
