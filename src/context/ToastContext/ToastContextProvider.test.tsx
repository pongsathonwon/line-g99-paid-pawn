import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ToastContextProvider from "./ToastContextProvider";

describe("test toast context provider", () => {
  it("should render child correctly", () => {
    render(<ToastContextProvider>test</ToastContextProvider>);
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
