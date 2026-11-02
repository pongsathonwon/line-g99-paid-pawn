import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { SuccessStep } from "./SuccessStep";

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<SuccessStep />} />
        <Route path="/home" element={<div>home</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("test SuccessStep", () => {
  beforeEach(() => renderWithRouter());

  it("should render", () => {
    expect(screen.getByText("ลงทะเบียนสำเร็จ")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "กลับสู่เมนูหลัก" }),
    ).toBeInTheDocument();
  });

  it("should navigate to /home when button is clicked", () => {
    fireEvent.click(screen.getByRole("button", { name: "กลับสู่เมนูหลัก" }));
    expect(screen.getByText("home")).toBeInTheDocument();
  });
});

describe("test SuccessStep with ?redirect", () => {
  const renderAt = (entry: string) =>
    render(
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/thai-register" element={<SuccessStep />} />
          <Route path="/home" element={<div>home</div>} />
          <Route path="/survey/linked" element={<div>survey linked</div>} />
        </Routes>
      </MemoryRouter>,
    );

  it("continues to the redirect path, e.g. back to the survey", () => {
    renderAt("/thai-register?redirect=%2Fsurvey%2Flinked");
    fireEvent.click(screen.getByRole("button", { name: "ดำเนินการต่อ" }));
    expect(screen.getByText("survey linked")).toBeInTheDocument();
  });

  it("ignores a redirect that leaves the app", () => {
    renderAt("/thai-register?redirect=%2F%2Fevil.com");
    fireEvent.click(screen.getByRole("button", { name: "กลับสู่เมนูหลัก" }));
    expect(screen.getByText("home")).toBeInTheDocument();
  });
});
