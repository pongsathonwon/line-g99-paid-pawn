import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { liff } from "@line/liff";
import SessionContextProvider from "./SessionContextProvider";
import { useCustInfo, useSession, type TSessionContext } from "./SessionContext";
import { isNotRegistered } from "./session-lib";
import { registerAxiosTokenBearer } from "./auth-context-helper";
import { AUTH_API } from "@/api/endpoint/auth";
import { ToastContext } from "@/context/ToastContext/ToastContext";
import { createMockToast } from "@/test/setup/survey-wrapper";
import { mockAuthLoginResponse } from "@/test/setup/auth-api-mock";
import { createHttpError } from "@/test/setup/survey-api-mock";

vi.mock("@line/liff", () => ({
  liff: {
    init: vi.fn(),
    login: vi.fn(),
    isLoggedIn: vi.fn(),
    getProfile: vi.fn(),
    getIDToken: vi.fn(),
  },
}));

vi.mock("@/api/endpoint/auth", () => ({
  AUTH_API: { login: vi.fn(), register: vi.fn() },
}));

vi.mock("./auth-context-helper", () => ({
  registerAxiosTokenBearer: vi.fn(() => vi.fn()),
}));

vi.stubEnv("VITE_LIFF_ID", "test-liff-id");

const PROFILE = { userId: "U1234567890", displayName: "Test User" };

/** g99-online's answer for an unlinked LINE uid */
const notRegistered = () => {
  const error = createHttpError(401);
  error.response!.data = { message: "User not registered", requiresRegistration: true };
  return error;
};

let session: TSessionContext;
let custInfo: unknown;
function Probe() {
  session = useSession();
  custInfo = useCustInfo();
  return <div data-testid="status">{session.status}</div>;
}

const renderSession = () => {
  const toast = createMockToast();
  render(
    <ToastContext.Provider value={toast}>
      <SessionContextProvider>
        <Probe />
      </SessionContextProvider>
    </ToastContext.Provider>,
  );
  return { toast };
};

const statusIs = (status: string) =>
  waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent(status));

const lineReady = () => {
  vi.mocked(liff.init).mockResolvedValue();
  vi.mocked(liff.isLoggedIn).mockReturnValue(true);
  vi.mocked(liff.getProfile).mockResolvedValue(PROFILE);
};

describe("SessionContextProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("starts loading", () => {
    vi.mocked(liff.init).mockReturnValue(new Promise(() => {}));
    renderSession();
    expect(screen.getByTestId("status")).toHaveTextContent("loading");
    expect(session.lineUid).toBeNull();
  });

  it("member: LINE ready and the g99-online login succeeds", async () => {
    lineReady();
    vi.mocked(AUTH_API.login).mockResolvedValue(mockAuthLoginResponse);
    const { toast } = renderSession();

    await statusIs("member");
    expect(AUTH_API.login).toHaveBeenCalledWith({ lineUid: PROFILE.userId });
    expect(session.lineUid).toBe(PROFILE.userId);
    expect(session.auth).toEqual(mockAuthLoginResponse.userInfo);
    expect(custInfo).toEqual(mockAuthLoginResponse.userInfo);
    expect(session.errorKind).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("LINE Login Successful");
  });

  it("exposes lineUid before the g99-online login settles", async () => {
    lineReady();
    vi.mocked(AUTH_API.login).mockReturnValue(new Promise(() => {}));
    renderSession();
    await waitFor(() => expect(session.lineUid).toBe(PROFILE.userId));
    expect(session.status).toBe("loading");
  });

  it("guest: g99-online answers 401 requiresRegistration", async () => {
    lineReady();
    vi.mocked(AUTH_API.login).mockRejectedValue(notRegistered());
    renderSession();
    await statusIs("guest");
    expect(session.auth).toBeNull();
    expect(custInfo).toBeNull();
  });

  it.each([
    ["a network error", new Error("Network Error")],
    ["a 401 without requiresRegistration", createHttpError(401)],
    ["a 408 timeout", createHttpError(408)],
    ["a 500", createHttpError(500)],
  ])("error (api), not guest, on %s", async (_name, error) => {
    lineReady();
    vi.mocked(AUTH_API.login).mockRejectedValue(error);
    renderSession();
    await statusIs("error");
    expect(session.errorKind).toBe("api");
    expect(session.lineUid).toBe(PROFILE.userId);
  });

  it("error (line) when LIFF init fails, without calling g99-online", async () => {
    vi.mocked(liff.init).mockRejectedValue(new Error("Init failed"));
    const { toast } = renderSession();
    await statusIs("error");
    expect(session.errorKind).toBe("line");
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Init failed"));
    expect(AUTH_API.login).not.toHaveBeenCalled();
  });

  it("error (line) when the profile cannot be read", async () => {
    vi.mocked(liff.init).mockResolvedValue();
    vi.mocked(liff.isLoggedIn).mockReturnValue(true);
    vi.mocked(liff.getProfile).mockRejectedValue(new Error("Profile fetch failed"));
    renderSession();
    await statusIs("error");
    expect(session.errorKind).toBe("line");
  });

  it("stays loading while LINE login takes over the page", async () => {
    vi.mocked(liff.init).mockResolvedValue();
    vi.mocked(liff.isLoggedIn).mockReturnValue(false);
    renderSession();
    await waitFor(() => expect(liff.login).toHaveBeenCalledOnce());
    expect(screen.getByTestId("status")).toHaveTextContent("loading");
    expect(AUTH_API.login).not.toHaveBeenCalled();
  });

  it("refresh() after registering turns a guest into a member", async () => {
    lineReady();
    vi.mocked(AUTH_API.login)
      .mockRejectedValueOnce(notRegistered())
      .mockResolvedValueOnce(mockAuthLoginResponse);
    renderSession();
    await statusIs("guest");

    let result: string | undefined;
    await act(async () => {
      result = await session.refresh();
    });
    expect(result).toBe("member");
    expect(session.status).toBe("member");
    expect(session.isRefreshing).toBe(false);
    expect(AUTH_API.login).toHaveBeenCalledTimes(2);
  });

  it("refresh() keeps the status on screen while it runs", async () => {
    lineReady();
    let resolveLogin: (v: typeof mockAuthLoginResponse) => void = () => {};
    vi.mocked(AUTH_API.login)
      .mockRejectedValueOnce(createHttpError(500))
      .mockReturnValueOnce(new Promise((r) => (resolveLogin = r)));
    renderSession();
    await statusIs("error");

    let pending: Promise<unknown> = Promise.resolve();
    act(() => {
      pending = session.refresh();
    });
    await waitFor(() => expect(session.isRefreshing).toBe(true));
    expect(session.status).toBe("error");
    await act(async () => {
      resolveLogin(mockAuthLoginResponse);
      await pending;
    });
    expect(session.status).toBe("member");
  });

  it("refresh() without LINE does nothing (a LIFF failure is retried with login)", async () => {
    vi.mocked(liff.init).mockRejectedValue(new Error("Init failed"));
    renderSession();
    await statusIs("error");
    await act(async () => {
      expect(await session.refresh()).toBe("error");
    });
    expect(AUTH_API.login).not.toHaveBeenCalled();
  });

  it("login() sends the user to LINE login and back to this page", async () => {
    vi.mocked(liff.init).mockReturnValue(new Promise(() => {}));
    renderSession();
    session.login();
    expect(liff.login).toHaveBeenCalledWith({ redirectUri: window.location.href });
    session.login("https://app/survey");
    expect(liff.login).toHaveBeenLastCalledWith({ redirectUri: "https://app/survey" });
  });

  it("getIdToken() reads the LIFF ID token, and the bearer interceptor is registered", () => {
    vi.mocked(liff.init).mockReturnValue(new Promise(() => {}));
    vi.mocked(liff.getIDToken).mockReturnValue("id-token");
    renderSession();
    expect(session.getIdToken()).toBe("id-token");
    expect(registerAxiosTokenBearer).toHaveBeenCalledOnce();
  });

  it("useSession needs the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow("useSession requires SessionContextProvider");
  });
});

describe("isNotRegistered", () => {
  it("is true only for 401 with requiresRegistration", () => {
    expect(isNotRegistered(notRegistered())).toBe(true);
    expect(isNotRegistered(createHttpError(401))).toBe(false);
    expect(isNotRegistered(createHttpError(400))).toBe(false);
    expect(isNotRegistered(new Error("x"))).toBe(false);
  });
});
