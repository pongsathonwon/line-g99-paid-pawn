import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "./RegisterPage";

const renderAt = (entry: string) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <RegisterPage />
    </MemoryRouter>,
  );

const hrefs = () =>
  screen.getAllByRole("link").map((link) => link.getAttribute("href"));

describe("RegisterPage", () => {
  it("links to the three register flows", () => {
    renderAt("/register");
    expect(hrefs()).toEqual([
      "/thai-register",
      "/foreign-register",
      "/foreign-counter-register",
    ]);
  });

  it("passes ?redirect on to each flow", () => {
    renderAt("/register?redirect=%2Fsurvey%2Flinked");
    expect(hrefs()).toEqual([
      "/thai-register?redirect=%2Fsurvey%2Flinked",
      "/foreign-register?redirect=%2Fsurvey%2Flinked",
      "/foreign-counter-register?redirect=%2Fsurvey%2Flinked",
    ]);
  });

  it("drops a redirect that leaves the app", () => {
    renderAt("/register?redirect=%2F%2Fevil.com");
    expect(hrefs()[0]).toBe("/thai-register");
  });
});
