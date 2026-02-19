import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RegisterCard from "./RegisterCard";

const MOCK_PROPS = {
  to: "/test",
  title: "test register link",
  description: "test link ...",
};

const renderWithRouter = (props: typeof MOCK_PROPS & { highlight?: boolean } = MOCK_PROPS) =>
  render(
    <MemoryRouter>
      <RegisterCard {...props} />
    </MemoryRouter>
  );

describe("test register card component(link)", () => {
  it("should render props", () => {
    renderWithRouter();
    expect(screen.getByText(MOCK_PROPS.title)).toBeInTheDocument();
    expect(screen.getByText(MOCK_PROPS.description)).toBeInTheDocument();
  });

  it("should render as a link with correct href", () => {
    renderWithRouter();
    expect(screen.getByRole("link")).toHaveAttribute("href", MOCK_PROPS.to);
  });

  it("should not render highlight badge by default", () => {
    renderWithRouter();
    expect(screen.queryByText("แนะนำ")).not.toBeInTheDocument();
  });

  it("should render highlight badge when highlight=true", () => {
    renderWithRouter({ ...MOCK_PROPS, highlight: true });
    expect(screen.getByText("แนะนำ")).toBeInTheDocument();
  });
});
