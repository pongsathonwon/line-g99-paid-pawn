import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AxiosError, AxiosHeaders } from "axios";
import QueryError from "./QueryError";

const renderWithRouter = (ui: React.ReactElement) =>
  render(ui, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });

describe("QueryError", () => {
  it("should render error heading", () => {
    renderWithRouter(<QueryError error={null} />);
    expect(screen.getByText("เกิดข้อผิดพลาด")).toBeInTheDocument();
  });

  it("should render back button", () => {
    renderWithRouter(<QueryError error={null} />);
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByText("กลับ")).toBeInTheDocument();
  });

  it("should use default backTo link", () => {
    renderWithRouter(<QueryError error={null} />);
    // MemoryRouter resolves ".." relative to "/" which results in "/"
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });

  it("should use custom backTo link", () => {
    renderWithRouter(<QueryError error={null} backTo="/home" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/home");
  });

  it("should display generic error message from Error", () => {
    const error = new Error("Something went wrong");
    renderWithRouter(<QueryError error={error} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should render empty error message div when error is null", () => {
    const { container } = renderWithRouter(<QueryError error={null} />);
    const messageDiv = container.querySelector(".text-gray-700");
    expect(messageDiv).toBeInTheDocument();
    expect(messageDiv).toHaveTextContent("");
  });

  it("should display parsed API error message from AxiosError", () => {
    const axiosError = new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
      data: { message: "สัญญาไม่ถูกต้อง", code: "INVALID_PAWN" },
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    renderWithRouter(<QueryError error={axiosError} />);
    expect(screen.getByText("สัญญาไม่ถูกต้อง")).toBeInTheDocument();
  });

  it("should display fallback message when AxiosError has no parseable body", () => {
    const axiosError = new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
      data: "not json",
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    renderWithRouter(<QueryError error={axiosError} />);
    expect(screen.getByText("เกิดข้อผิดพลาดในการโหลดข้อมูล")).toBeInTheDocument();
  });
});
