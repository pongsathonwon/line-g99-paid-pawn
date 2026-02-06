import { render, screen } from "@testing-library/react";

import { MemoryRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import BottomNav from "./BottomNav";
import type { PropsWithChildren } from "react";
import userEvent from "@testing-library/user-event";

// Helper component to display current location in tests
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

const RouterWapper = ({
  children,
  initialRoute,
}: PropsWithChildren<{ initialRoute?: string }>) => {
  return (
    <MemoryRouter initialEntries={[initialRoute ?? "/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <LocationDisplay />
              <Outlet />
              {children}
            </div>
          }
          children={[
            <Route path="/home">Home</Route>,
            <Route path="/history">History</Route>,
            <Route path="/term">Term</Route>,
          ]}
        />
      </Routes>
    </MemoryRouter>
  );
};

const partialWrapper =
  (initalRoute?: string) =>
  ({ children }: PropsWithChildren) =>
    <RouterWapper initialRoute={initalRoute}>{children}</RouterWapper>;

describe("test bottom navigation bar", () => {
  describe("navbar should be render on every path", () => {
    it("should render navbar /", () => {
      render(<BottomNav />, { wrapper: partialWrapper("/") });

      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("should render navbar /home", () => {
      render(<BottomNav />, { wrapper: partialWrapper("/home") });

      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("should render navbar /term", () => {
      render(<BottomNav />, { wrapper: partialWrapper("/term") });

      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("should render navbar /history", () => {
      render(<BottomNav />, { wrapper: partialWrapper("/history") });

      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });
  });

  describe("test navigation", () => {
    it("should navigate to /home when home link is clicked", async () => {
      const user = userEvent.setup();
      render(<BottomNav />, { wrapper: partialWrapper("/") });

      const homeLink = screen.getByRole("link", { name: /หน้าหลัก/i });
      await user.click(homeLink);

      // Check the route using the location display helper
      const locationDisplay = screen.getByTestId("location-display");
      expect(locationDisplay).toHaveTextContent("/home");
    });

    it("should navigate to /history when history link is clicked", async () => {
      const user = userEvent.setup();
      render(<BottomNav />, { wrapper: partialWrapper("/") });

      const historyLink = screen.getByRole("link", { name: /ประวัติ/i });
      await user.click(historyLink);

      const locationDisplay = screen.getByTestId("location-display");
      expect(locationDisplay).toHaveTextContent("/history");
    });

    it("should navigate to /term when term link is clicked", async () => {
      const user = userEvent.setup();
      render(<BottomNav />, { wrapper: partialWrapper("/") });

      const termLink = screen.getByRole("link", { name: /เงื่อนไข/i });
      await user.click(termLink);

      const locationDisplay = screen.getByTestId("location-display");
      expect(locationDisplay).toHaveTextContent("/term");
    });
  });

  describe("test active link styling", () => {
    it("should apply active class to home link when on /home route", () => {
      render(<BottomNav />, { wrapper: partialWrapper("/home") });

      const homeLink = screen.getByRole("link", { name: /หน้าหลัก/i });
      expect(homeLink).toHaveClass("text-brand-red");
    });

    it("should apply active class to history link when on /history route", () => {
      render(<BottomNav />, { wrapper: partialWrapper("/history") });

      const historyLink = screen.getByRole("link", { name: /ประวัติ/i });
      expect(historyLink).toHaveClass("text-brand-red");
    });

    it("should apply active class to term link when on /term route", () => {
      render(<BottomNav />, { wrapper: partialWrapper("/term") });

      const termLink = screen.getByRole("link", { name: /เงื่อนไข/i });
      expect(termLink).toHaveClass("text-brand-red");
    });

    it("should not apply active class to non-active links", () => {
      render(<BottomNav />, { wrapper: partialWrapper("/home") });

      const historyLink = screen.getByRole("link", { name: /ประวัติ/i });
      const termLink = screen.getByRole("link", { name: /เงื่อนไข/i });

      expect(historyLink).not.toHaveClass("text-brand-red");
      expect(termLink).not.toHaveClass("text-brand-red");
    });
  });

  describe("test accessibility", () => {
    it("should have all navigation links accessible by role", () => {
      render(<BottomNav />, { wrapper: partialWrapper("/") });

      expect(screen.getByRole("link", { name: /หน้าหลัก/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /ประวัติ/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /เงื่อนไข/i })).toBeInTheDocument();
    });

    it("should render icons for each navigation item", () => {
      const { container } = render(<BottomNav />, { wrapper: partialWrapper("/") });

      // lucide-react icons render as SVGs
      const svgIcons = container.querySelectorAll("svg");
      expect(svgIcons).toHaveLength(3); // 3 navigation items
    });
  });
});
