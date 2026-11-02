import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import StarRating from "./StarRating";

describe("StarRating", () => {
  it("renders 5 stars and none checked when empty", () => {
    render(<StarRating label="ความพึงพอใจ" onChange={vi.fn()} />);
    const group = screen.getByRole("radiogroup", { name: "ความพึงพอใจ" });
    expect(group).toBeInTheDocument();
    const stars = screen.getAllByRole("radio");
    expect(stars).toHaveLength(5);
    stars.forEach((star) => expect(star).toHaveAttribute("aria-checked", "false"));
  });

  it("marks the chosen star", () => {
    render(
      <StarRating
        label="ความพึงพอใจ"
        value={3}
        onChange={vi.fn()}
        starLabel={(n) => `${n} ดาว`}
      />,
    );
    expect(screen.getByRole("radio", { name: "3 ดาว" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("reports 1 to 5 on click", () => {
    const onChange = vi.fn();
    render(<StarRating label="x" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "1" }));
    fireEvent.click(screen.getByRole("radio", { name: "5" }));
    expect(onChange.mock.calls).toEqual([[1], [5]]);
  });

  it("flags an invalid row", () => {
    render(<StarRating label="x" onChange={vi.fn()} invalid />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-invalid", "true");
  });
});
