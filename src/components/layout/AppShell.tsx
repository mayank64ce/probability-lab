import { NavLink, Outlet } from "react-router-dom";
import { useProgress } from "../../app/ProgressContext";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";

const NAV: { to: string; label: string; icon: IconName; end: boolean }[] = [
  { to: "/", label: "Home", icon: "home", end: true },
  { to: "/learn", label: "Learn", icon: "book", end: false },
  { to: "/practice", label: "Practice", icon: "target", end: false },
  { to: "/review", label: "Review", icon: "repeat", end: false },
];

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <NavLink to="/" className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="bg-accent flex h-9 w-9 items-center justify-center rounded-2xl"
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5" fill="white">
          <circle cx="9" cy="9" r="3.4" />
          <circle cx="23" cy="23" r="3.4" />
          <circle cx="23" cy="9" r="3.4" opacity="0.4" />
          <circle cx="9" cy="23" r="3.4" opacity="0.4" />
        </svg>
      </span>
      <span className={`text-[1.02rem] font-extrabold ${compact ? "sm:hidden lg:inline" : ""}`}>
        Probability Lab
      </span>
    </NavLink>
  );
}

function ThemeToggle({ className = "" }: { className?: string }) {
  const { state, resolvedTheme, setTheme } = useProgress();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme${state.theme === "system" ? " (currently following your system)" : ""}`}
      className={`text-ink-muted hover:bg-raised hover:text-ink flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${className}`}
    >
      <Icon name={resolvedTheme === "dark" ? "sun" : "moon"} />
    </button>
  );
}

function SettingsLink({ className = "" }: { className?: string }) {
  return (
    <NavLink
      to="/settings"
      aria-label="Settings"
      title="Settings"
      className={({ isActive }) =>
        `flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          isActive
            ? "bg-accent-soft text-accent-ink"
            : "text-ink-muted hover:bg-raised hover:text-ink"
        } ${className}`
      }
    >
      <Icon name="settings" />
    </NavLink>
  );
}

/**
 * Two shapes of chrome from one tree: a persistent rail on desktop, and on a
 * phone a slim header with the navigation moved to the bottom, inside thumb
 * reach and clear of the home indicator.
 */
export function AppShell() {
  const { persistent } = useProgress();

  return (
    <div className="min-h-dvh">
      {/* Desktop rail */}
      <aside className="border-line bg-surface fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r px-4 py-6 lg:flex">
        <div className="px-2">
          <Wordmark />
        </div>

        <nav aria-label="Primary" className="mt-8 flex-1">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center gap-3 rounded-2xl px-3 text-[0.95rem] font-bold transition-colors ${
                      isActive
                        ? "bg-accent-soft text-accent-ink"
                        : "text-ink-muted hover:bg-raised hover:text-ink"
                    }`
                  }
                >
                  <Icon name={item.icon} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-line flex items-center gap-1 border-t pt-4">
          <SettingsLink />
          <ThemeToggle />
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col lg:pl-60">
        {/* Phone and tablet header */}
        <header className="border-line bg-canvas/85 sticky top-0 z-20 border-b backdrop-blur-md lg:hidden">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-5 py-3">
            <Wordmark compact />
            <div className="ml-auto flex items-center gap-1">
              <SettingsLink />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {!persistent && (
          <p
            role="status"
            className="bg-warn-soft text-warn-ink px-5 py-2 text-center text-xs font-semibold"
          >
            Progress cannot be saved in this browser — private mode or blocked site data.
          </p>
        )}

        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pt-6 pb-28 lg:px-8 lg:pt-10 lg:pb-16">
          <Outlet />
        </main>

        {/* Phone tab bar */}
        <nav
          aria-label="Primary, compact"
          className="border-line bg-surface/92 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur-md lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <ul className="mx-auto flex max-w-lg">
            {NAV.map((item) => (
              <li key={item.to} className="flex-1">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex min-h-15 flex-col items-center justify-center gap-1 text-[0.68rem] font-bold transition-colors ${
                      isActive ? "text-accent-ink" : "text-ink-muted"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden="true"
                        className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${
                          isActive ? "bg-accent-soft" : ""
                        }`}
                      >
                        <Icon name={item.icon} size={19} />
                      </span>
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
