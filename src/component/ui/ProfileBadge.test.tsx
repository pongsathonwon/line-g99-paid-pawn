import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileBadge from "./ProfileBadge";

describe("ProfileBadge", () => {
  const MOCK_LINE = {
    pictureUrl: "test-url",
    displayName: "test-name",
  };

  beforeEach(() => {
    render(<ProfileBadge {...MOCK_LINE} />);
  });

  it("should render profile badge", () => {
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("should display the profile image with correct src and alt", () => {
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "test-url");
    expect(image).toHaveAttribute("alt", "profile");
  });

  it("should display the user's display name", () => {
    expect(screen.getByText("test-name")).toBeInTheDocument();
  });

  it("should display logo image", () => {
    expect(screen.getAllByAltText("logo with text")).toBeInTheDocument();
  });

  it("should display welcome text in Thai", () => {
    expect(screen.getByText("ยินดีต้อนรับ")).toBeInTheDocument();
  });

  it("should render as a header element", () => {
    const header = screen.getByRole("banner");
    expect(header.tagName).toBe("HEADER");
  });
});
