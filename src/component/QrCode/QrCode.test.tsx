import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import QrCode from "./QrCode";

vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,mockqr"),
  },
}));

const MOCK_DATA_URL = "data:image/png;base64,mockqr";

const MOCK_PAYMENT = {
  ref1: "REF001",
  ref2: "REF002",
  amount: "500.00",
};

describe("QrCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing before QR is generated", () => {
    const { container } = render(<QrCode paymentData={MOCK_PAYMENT} />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("renders img with QR data URL after generation", async () => {
    render(<QrCode paymentData={MOCK_PAYMENT} />);
    await waitFor(() => {
      expect(screen.getByRole("img", { name: "QR Code" })).toBeInTheDocument();
    });
    expect(screen.getByRole("img")).toHaveAttribute("src", MOCK_DATA_URL);
  });

  it("applies default width of 256", async () => {
    render(<QrCode paymentData={MOCK_PAYMENT} />);
    await waitFor(() => screen.getByRole("img"));
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "256");
    expect(img).toHaveAttribute("height", "256");
  });

  it("applies custom width when provided", async () => {
    render(<QrCode paymentData={MOCK_PAYMENT} width={128} />);
    await waitFor(() => screen.getByRole("img"));
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "128");
    expect(img).toHaveAttribute("height", "128");
  });

  it("applies className to img", async () => {
    render(<QrCode paymentData={MOCK_PAYMENT} className="my-class" />);
    await waitFor(() => screen.getByRole("img"));
    expect(screen.getByRole("img")).toHaveClass("my-class");
  });
});
