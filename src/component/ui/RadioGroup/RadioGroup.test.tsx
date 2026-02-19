import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import RadioGroup, { type TRadioOption } from "./RadioGroup";

type TOption = "a" | "b" | "c";

const OPTIONS: TRadioOption<TOption>[] = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
];

// Controlled wrapper that lifts state up — mirrors real usage
function ControlledRadioGroup({ initial = "a" as TOption, onChange = vi.fn() }) {
  const [value, setValue] = useState<TOption>(initial);
  return (
    <RadioGroup
      options={OPTIONS}
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange(v);
      }}
    />
  );
}

describe("RadioGroup", () => {
  describe("rendering", () => {
    it("renders all options", () => {
      render(<ControlledRadioGroup />);
      for (const opt of OPTIONS) {
        expect(screen.getByText(opt.label)).toBeInTheDocument();
      }
    });

    it("renders optional label when provided", () => {
      render(
        <RadioGroup options={OPTIONS} value="a" onChange={vi.fn()} label="Pick one" />
      );
      expect(screen.getByText("Pick one")).toBeInTheDocument();
    });

    it("does not render label element when label is omitted", () => {
      render(<RadioGroup options={OPTIONS} value="a" onChange={vi.fn()} />);
      expect(screen.queryByText("Pick one")).not.toBeInTheDocument();
    });
  });

  describe("active state", () => {
    it("marks the initial value as active", () => {
      render(<ControlledRadioGroup initial="b" />);
      const btn = screen.getByRole("button", { name: "Option B" });
      expect(btn).toHaveClass("border-brand-red");
    });

    it("does not mark other options as active", () => {
      render(<ControlledRadioGroup initial="b" />);
      const btnA = screen.getByRole("button", { name: "Option A" });
      const btnC = screen.getByRole("button", { name: "Option C" });
      expect(btnA).not.toHaveClass("border-brand-red");
      expect(btnC).not.toHaveClass("border-brand-red");
    });
  });

  describe("interaction — lifted state", () => {
    it("calls onChange with the clicked value", () => {
      const onChange = vi.fn();
      render(<ControlledRadioGroup onChange={onChange} />);
      fireEvent.click(screen.getByRole("button", { name: "Option B" }));
      expect(onChange).toHaveBeenCalledWith("b");
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("updates active option after click", () => {
      render(<ControlledRadioGroup initial="a" />);
      fireEvent.click(screen.getByRole("button", { name: "Option C" }));
      expect(screen.getByRole("button", { name: "Option C" })).toHaveClass("border-brand-red");
      expect(screen.getByRole("button", { name: "Option A" })).not.toHaveClass("border-brand-red");
    });

    it("can switch selection multiple times", () => {
      render(<ControlledRadioGroup initial="a" />);
      fireEvent.click(screen.getByRole("button", { name: "Option B" }));
      fireEvent.click(screen.getByRole("button", { name: "Option C" }));
      expect(screen.getByRole("button", { name: "Option C" })).toHaveClass("border-brand-red");
      expect(screen.getByRole("button", { name: "Option B" })).not.toHaveClass("border-brand-red");
    });
  });
});
