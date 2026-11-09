import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { SuccessStep } from "./SuccessStep";
import {
  SessionContext,
  type TSessionContext,
} from "@/context/SessionContext/SessionContext";
import { createMockSession } from "@/test/setup/session-mock";

const renderAt = (
  entry: string,
  session: TSessionContext = createMockSession({ status: "guest" }),
) => {
  render(
    <SessionContext.Provider value={session}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/thai-register" element={<SuccessStep />} />
          <Route path="/home" element={<div>home</div>} />
          <Route path="/survey/linked" element={<div>survey linked</div>} />
        </Routes>
      </MemoryRouter>
    </SessionContext.Provider>,
  );
  return session;
};

describe("test SuccessStep", () => {
  it("should render", () => {
    renderAt("/thai-register");
    expect(screen.getByText("ลงทะเบียนสำเร็จ")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "กลับสู่เมนูหลัก" }),
    ).toBeInTheDocument();
  });

  it("refreshes the session, then goes to /home", async () => {
    const order: string[] = [];
    const session = createMockSession({
      status: "guest",
      refresh: vi.fn(async () => {
        order.push("refresh");
        return "member" as const;
      }),
    });
    renderAt("/thai-register", session);
    fireEvent.click(screen.getByRole("button", { name: "กลับสู่เมนูหลัก" }));
    expect(await screen.findByText("home")).toBeInTheDocument();
    expect(order).toEqual(["refresh"]);
  });

  it("disables the button while the session refreshes", () => {
    renderAt("/thai-register", createMockSession({ status: "guest", isRefreshing: true }));
    expect(screen.getByRole("button", { name: "กลับสู่เมนูหลัก" })).toBeDisabled();
  });
});

describe("test SuccessStep with ?redirect", () => {
  it("continues to the redirect path, e.g. back to the survey", async () => {
    const session = renderAt("/thai-register?redirect=%2Fsurvey%2Flinked");
    fireEvent.click(screen.getByRole("button", { name: "ดำเนินการต่อ" }));
    expect(await screen.findByText("survey linked")).toBeInTheDocument();
    expect(session.refresh).toHaveBeenCalledOnce();
  });

  it("ignores a redirect that leaves the app", async () => {
    renderAt("/thai-register?redirect=%2F%2Fevil.com");
    fireEvent.click(screen.getByRole("button", { name: "กลับสู่เมนูหลัก" }));
    await waitFor(() => expect(screen.getByText("home")).toBeInTheDocument());
  });
});
