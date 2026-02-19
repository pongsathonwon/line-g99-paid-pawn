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
