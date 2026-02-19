import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StepIndicator from "./StepIndicator";
import { multistepFormWrapperFactory } from "@/test/setup/wrapper-factory";
import type { RegisterStep } from "./register.steps";

const MOCK_STEPS: RegisterStep[] = [
  { key: "search", label: "Search" },
  { key: "otp", label: "OTP" },
  { key: "term", label: "Terms" },
  { key: "success", label: "Done" },
];

function renderWithStep(activePage: number) {
  const wrapper = multistepFormWrapperFactory(MOCK_STEPS.length);
  // Render with a custom active page by pre-navigating via the provider
  // Since we can't control activePage directly, we render and use the wrapper
  // We render at page 1 by default; for other pages we use a custom context value
  return render(<StepIndicator steps={MOCK_STEPS} />, { wrapper });
}

describe("StepIndicator", () => {
  describe("renders all step labels", () => {
    it("should render all step labels", () => {
      renderWithStep(1);
      for (const step of MOCK_STEPS) {
        expect(screen.getByText(step.label)).toBeInTheDocument();
      }
    });
  });

  describe("when on step 1 (first step active)", () => {
    it("should show step number 1 as active (not a checkmark)", () => {
      renderWithStep(1);
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should show step numbers 2, 3, 4 as inactive", () => {
      renderWithStep(1);
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("should not render any checkmark icons when on step 1", () => {
      renderWithStep(1);
      // No steps are completed at step 1
      expect(screen.queryAllByTestId("check-icon")).toHaveLength(0);
    });

    it("should render progress bar with 0% width", () => {
      const { container } = renderWithStep(1);
      const progressBar = container.querySelector(".bg-brand-red");
      expect(progressBar).toHaveStyle({ width: "0%" });
    });
  });

  describe("step state classes", () => {
    it("step 1 circle should have active classes when activePage is 1", () => {
      const { container } = renderWithStep(1);
      const circles = container.querySelectorAll(
        ".flex.items-center.justify-center.w-10.h-10.rounded-full"
      );
      // First circle = active
      expect(circles[0]).toHaveClass("bg-white");
      expect(circles[0]).toHaveClass("border-brand-red");
      // Second circle = inactive
      expect(circles[1]).toHaveClass("border-gray-200");
    });
  });

  describe("progress bar width", () => {
    it("should be 0% on step 1 of 4", () => {
      const { container } = renderWithStep(1);
      const progressBar = container.querySelector(".bg-brand-red");
      expect(progressBar).toHaveStyle({ width: "0%" });
    });
  });
});
