import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("renders as a button element", () => {
      render(<Button>Submit</Button>);
      expect(screen.getByRole("button").tagName).toBe("BUTTON");
    });
  });

  describe("native prop passthrough", () => {
    it("applies type attribute", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("merges custom className", () => {
      render(<Button className="extra-class">Label</Button>);
      expect(screen.getByRole("button")).toHaveClass("extra-class");
    });

    it("calls onClick when clicked", () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("disabled", () => {
    it("is disabled when disabled prop is set", () => {
      render(<Button disabled>Click</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not call onClick when disabled", () => {
      const onClick = vi.fn();
      render(<Button disabled onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("fullWidth", () => {
    it("applies w-full class when fullWidth=true", () => {
      render(<Button fullWidth>Label</Button>);
      expect(screen.getByRole("button")).toHaveClass("w-full");
    });

    it("does not apply w-full class by default", () => {
      render(<Button>Label</Button>);
      expect(screen.getByRole("button")).not.toHaveClass("w-full");
    });
  });
});
