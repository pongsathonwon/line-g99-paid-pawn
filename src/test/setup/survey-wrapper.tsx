import { vi } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import {
  SessionContext,
  type TSessionContext,
} from "@/context/SessionContext/SessionContext";
import { ToastContext } from "@/context/ToastContext/ToastContext";
import type { TToastContext } from "@/types/toast.type";
import { createMockSession } from "./session-mock";
import LocationProbe from "./LocationProbe";

export const createMockToast = (): TToastContext => ({
  toasts: [],
  addToast: vi.fn(),
  removeToast: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
});

type TRenderOptions = {
  path: string;
  initialEntry: string;
  session?: TSessionContext;
  toast?: TToastContext;
  /** more routes next to `path`, e.g. a stand-in register page */
  routes?: { path: string; element: ReactElement }[];
};

/**
 * Renders `ui` at `path` with the app's contexts replaced by plain values.
 * Any other route renders LocationProbe.
 */
export const renderWithSurveyProviders = (
  ui: ReactElement,
  {
    path,
    initialEntry,
    session = createMockSession(),
    toast = createMockToast(),
    routes = [],
  }: TRenderOptions,
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const result = render(
    <ToastContext.Provider value={toast}>
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={session}>
            <MemoryRouter initialEntries={[initialEntry]}>
              <Routes>
                <Route path={path} element={ui} />
                {routes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                <Route path="*" element={<LocationProbe />} />
              </Routes>
            </MemoryRouter>
        </SessionContext.Provider>
      </QueryClientProvider>
    </ToastContext.Provider>,
  );
  return { ...result, toast, session, queryClient };
};
