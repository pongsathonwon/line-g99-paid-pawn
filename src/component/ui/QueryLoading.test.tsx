import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import QueryLoading from "./QueryLoading";

describe("QueryLoading", () => {
  it("should render loading text", () => {
    render(<QueryLoading />);
    expect(screen.getByText("กำลังโหลดข้อมูล...")).toBeInTheDocument();
  });

  it("should render spinner with animate-spin class", () => {
    const { container } = render(<QueryLoading />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
