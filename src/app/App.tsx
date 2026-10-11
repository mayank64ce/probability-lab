import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProgressProvider } from "./ProgressProvider";
import { AppShell } from "../components/layout/AppShell";
import { Dashboard } from "../pages/Dashboard";

/**
 * The dashboard is the landing screen and stays in the main bundle. Everything
 * else is split out — which also keeps KaTeX and its fonts, pulled in only by
 * lesson content, off the critical path on a phone.
 */
const Learn = lazy(() => import("../pages/Learn").then((m) => ({ default: m.Learn })));
const Practice = lazy(() => import("../pages/Practice").then((m) => ({ default: m.Practice })));
const Review = lazy(() => import("../pages/Review").then((m) => ({ default: m.Review })));
const Settings = lazy(() => import("../pages/Settings").then((m) => ({ default: m.Settings })));
const LessonPage = lazy(() =>
  import("../pages/LessonPage").then((m) => ({ default: m.LessonPage })),
);
const NotFound = lazy(() => import("../pages/NotFound").then((m) => ({ default: m.NotFound })));

function RouteFallback() {
  return (
    <div className="py-10 text-center text-sm" role="status" style={{ color: "var(--text-muted)" }}>
      Loading…
    </div>
  );
}

/**
 * The basename matches `base` in vite.config.ts. GitHub Pages serves this app
 * from a sub-path, and 404.html is a copy of index.html so deep links survive
 * a hard refresh.
 */
export const ROUTER_BASENAME = import.meta.env.BASE_URL;

export function App() {
  return (
    <ProgressProvider>
      <BrowserRouter basename={ROUTER_BASENAME}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route
              path="learn"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Learn />
                </Suspense>
              }
            />
            <Route
              path="practice"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Practice />
                </Suspense>
              }
            />
            <Route
              path="review"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Review />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Settings />
                </Suspense>
              }
            />
            <Route
              path="lesson/:lessonId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LessonPage />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  );
}
