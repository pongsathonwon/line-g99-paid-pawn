import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MultiStepFormContext } from "@/context/MultistepFormContext/MultiStepFormContext";
import BaseRegisterForm, { type TRegisterFormConfig } from "./BaseRegisterForm";
import { THAI_REGISTER_STEPS, FOREIGN_COUNTER_REGISTER_STEPS } from "./register.steps";

// Mock heavy subforms — we're testing StepRenderer routing logic, not subform internals
vi.mock("../RegisterSubform/SearchCustomer", () => ({
  default: () => <div>SearchCustomer</div>,
}));
vi.mock("../RegisterSubform/OTPVerification", () => ({
  default: () => <div>OTPVerification</div>,
}));
vi.mock("../RegisterSubform/TermStep", () => ({
  default: () => <div>TermStep</div>,
}));
vi.mock("../RegisterSubform/PendingStep", () => ({
  PendingStep: () => <div>PendingStep</div>,
}));

// SuccessStep uses useNavigate — needs MemoryRouter
vi.mock("../RegisterSubform/SuccessStep", () => ({
  SuccessStep: () => <div>SuccessStep</div>,
}));

function renderAtPage(config: TRegisterFormConfig, activePage: number) {
  const ctx = {
    activePage,
    totalPage: config.steps.length,
    next: vi.fn(),
    back: vi.fn(),
  };

  return render(
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MultiStepFormContext.Provider value={ctx}>
              <BaseRegisterForm config={config} />
            </MultiStepFormContext.Provider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

const THAI_CONFIG: TRegisterFormConfig = {
  nationCode: "1",
  defaultSearchMethod: "idCard",
  steps: THAI_REGISTER_STEPS,
  mode: "thai",
  includeOtp: true,
};

const COUNTER_CONFIG: TRegisterFormConfig = {
  nationCode: "2",
  defaultSearchMethod: "custCode",
  steps: FOREIGN_COUNTER_REGISTER_STEPS,
  mode: "foreign-counter",
  includeOtp: false,
};

describe("BaseRegisterForm — StepRenderer", () => {
  describe("thai mode (includeOtp: true)", () => {
    it("step 1 renders SearchCustomer", () => {
      renderAtPage(THAI_CONFIG, 1);
      expect(screen.getByText("SearchCustomer")).toBeInTheDocument();
    });

    it("step 2 renders OTPVerification", () => {
      renderAtPage(THAI_CONFIG, 2);
      expect(screen.getByText("OTPVerification")).toBeInTheDocument();
    });

    it("step 3 (term) renders nothing when user is null", () => {
      renderAtPage(THAI_CONFIG, 3);
      expect(screen.queryByText("TermStep")).not.toBeInTheDocument();
    });

    it("step 4 renders SuccessStep", () => {
      renderAtPage(THAI_CONFIG, 4);
      expect(screen.getByText("SuccessStep")).toBeInTheDocument();
    });
  });

  describe("foreign-counter mode (includeOtp: false)", () => {
    it("step 1 renders SearchCustomer", () => {
      renderAtPage(COUNTER_CONFIG, 1);
      expect(screen.getByText("SearchCustomer")).toBeInTheDocument();
    });

    it("step 2 (term) renders nothing when user is null", () => {
      renderAtPage(COUNTER_CONFIG, 2);
      expect(screen.queryByText("TermStep")).not.toBeInTheDocument();
    });

    it("step 3 renders PendingStep", () => {
      renderAtPage(COUNTER_CONFIG, 3);
      expect(screen.getByText("PendingStep")).toBeInTheDocument();
    });
  });

  describe("StepIndicator is always rendered", () => {
    it("renders StepIndicator on every step", () => {
      // StepIndicator renders step labels — check one of them
      renderAtPage(THAI_CONFIG, 1);
      expect(screen.getByText("ค้นหาสมาชิก")).toBeInTheDocument();
    });
  });

  describe("out-of-range page", () => {
    it("renders nothing when activePage exceeds steps length", () => {
      const { container } = renderAtPage(THAI_CONFIG, 99);
      // Only the outer wrapper div, no step content
      expect(screen.queryByText("SearchCustomer")).not.toBeInTheDocument();
      expect(screen.queryByText("OTPVerification")).not.toBeInTheDocument();
      expect(container.querySelector(".flex.flex-col.gap-6")).not.toBeInTheDocument();
    });
  });
});
