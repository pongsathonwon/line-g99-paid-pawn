import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QrCodeCard2 from "./QrCodeCard2";

// QrCode is async — mock it to keep these tests synchronous
vi.mock("./QrCode", () => ({
  default: () => <img alt="QR Code" src="mock-qr" />,
}));

const MOCK_PAYMENT = {
  ref1: "CONTRACT001",
  ref2: "REF999",
  amount: "1500.00",
  interestDate: "2025-06-30T00:00:00.000Z",
};

describe("QrCodeCard2", () => {
  it("renders payment logo", () => {
    render(<QrCodeCard2 paymentData={MOCK_PAYMENT} />);
    expect(screen.getByAltText("Payment Logo")).toBeInTheDocument();
  });

  it("renders QR code", () => {
    render(<QrCodeCard2 paymentData={MOCK_PAYMENT} />);
    expect(screen.getByAltText("QR Code")).toBeInTheDocument();
  });

  it("displays amount", () => {
    render(<QrCodeCard2 paymentData={MOCK_PAYMENT} />);
    expect(screen.getByText(`${MOCK_PAYMENT.amount} บาท`)).toBeInTheDocument();
  });

  it("displays ref1", () => {
    render(<QrCodeCard2 paymentData={MOCK_PAYMENT} />);
    expect(screen.getByText(MOCK_PAYMENT.ref1)).toBeInTheDocument();
  });

  it("displays ref2", () => {
    render(<QrCodeCard2 paymentData={MOCK_PAYMENT} />);
    expect(screen.getByText(MOCK_PAYMENT.ref2)).toBeInTheDocument();
  });

  it("displays account name", () => {
    render(<QrCodeCard2 paymentData={MOCK_PAYMENT} />);
    expect(screen.getByText("บจก. โกลด์เด้น 99 จำกัด")).toBeInTheDocument();
  });

  it("displays payment instruction note", () => {
    render(<QrCodeCard2 paymentData={MOCK_PAYMENT} />);
    expect(screen.getByText("บันทึกหน้าจอ QR เพื่อชำระ")).toBeInTheDocument();
  });

  it("displays interestDate label", () => {
    render(<QrCodeCard2 paymentData={MOCK_PAYMENT} />);
    expect(screen.getByText("คิวอาร์โค้ดสามารถชำระได้ถึง")).toBeInTheDocument();
  });
});
