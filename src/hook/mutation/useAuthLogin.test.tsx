import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthLogin } from "./useAuthLogin";
import { AUTH_API } from "@/api/endpoint/auth";
import { mockAuthLoginResponse } from "@/test/setup/auth-api-mock";

// Mock AUTH_API
vi.mock("@/api/endpoint/auth", () => ({
  AUTH_API: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

describe("useAuthLogin", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
  );

  it("should login successfully and call onSuccess", async () => {
    vi.mocked(AUTH_API.login).mockResolvedValue(mockAuthLoginResponse);

    const { result } = renderHook(() => useAuthLogin(), {
      wrapper,
    });

    await result.current.login("U1234567890");

    await waitFor(() => {
      expect(AUTH_API.login).toHaveBeenCalledWith(
        {
          lineUid: "U1234567890",
        },
        {
          client: queryClient,
          meta: undefined,
          mutationKey: ["g99-login"],
        }
      );
      expect(result.current.auth).toBe(mockAuthLoginResponse.userInfo);
      expect(result.current.error).toBe(null);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("should handle login error and call onError", async () => {
    vi.mocked(AUTH_API.login).mockRejectedValue(new Error("Login failed"));

    const { result } = renderHook(() => useAuthLogin(), {
      wrapper,
    });

    try {
      await result.current.login("U1234567890");
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe("Login failed");
    }

    await waitFor(() => {
      expect(result.current.auth).toBe(null);
      expect(result.current.error).toBe("Login failed");
      expect(result.current.isError).toBe(true);
    });
  });

  it("should not call login when lineUid is empty", async () => {
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useAuthLogin(), {
      wrapper,
    });

    await result.current.login("");

    expect(AUTH_API.login).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("should expose loading states correctly", async () => {
    vi.mocked(AUTH_API.login).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockAuthLoginResponse), 100)
        )
    );

    const { result } = renderHook(() => useAuthLogin(), { wrapper });

    expect(result.current.isPending).toBe(false);

    const loginPromise = result.current.login("U1234567890");

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await loginPromise;

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("should work without callbacks", async () => {
    const { AUTH_API } = await import("@/api/endpoint/auth");
    vi.mocked(AUTH_API.login).mockResolvedValue(mockAuthLoginResponse);

    const { result } = renderHook(() => useAuthLogin(), { wrapper });

    await result.current.login("U1234567890");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
