import { vi } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import { LineContext, type TLineStatus } from "@/context/LineContext/LineContext";
import { AuthContext, type TAuthContext } from "@/context/AuthContext/AuthContext";
import { ToastContext } from "@/context/ToastContext/ToastContext";
import type { TToastContext } from "@/types/toast.type";
import type { TMaybe } from "@/types/base.type";
import LocationProbe from "./LocationProbe";

export const mockLineLogin: TLineStatus = {
  isLogin: true,
  profile: { userId: "Usurvey0001", displayName: "ลูกค้าทดสอบ" },
};

export const createMockToast = (): TToastContext => ({
  toasts: [],
  addToast: vi.fn(),
  removeToast: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
});

export const createMockAuth = (
  overrides: Partial<TAuthContext> = {},
): TAuthContext => ({
  auth: null,
  error: null,
  relogin: vi.fn().mockResolvedValue(undefined),
  loginStatus: { isPending: false, isSuccess: false, isError: false },
  ...overrides,
});

type TRenderOptions = {
  path: string;
  initialEntry: string;
  lineCtx?: TMaybe<TLineStatus>;
  auth?: TAuthContext;
  toast?: TToastContext;
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
    lineCtx = mockLineLogin,
    auth = createMockAuth(),
    toast = createMockToast(),
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
        <LineContext.Provider value={{ lineCtx }}>
          <AuthContext.Provider value={auth}>
            <MemoryRouter initialEntries={[initialEntry]}>
              <Routes>
                <Route path={path} element={ui} />
                <Route path="*" element={<LocationProbe />} />
              </Routes>
            </MemoryRouter>
          </AuthContext.Provider>
        </LineContext.Provider>
      </QueryClientProvider>
    </ToastContext.Provider>,
  );
  return { ...result, toast, auth, queryClient };
};
