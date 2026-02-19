import { describe, expect, it } from "vitest";
import { createBarcodeFilled, createBarcodeClean } from "./lib";
import type { TQrCodeConfig } from "./lib.type";

const CONFIG: TQrCodeConfig = {
  prefix: "|",
  taxId: "0105555097424",
  suffix: "01",
};

const PAY = {
  ref1: "123",
  ref2: "456",
  amount: "100.00",
};

describe("createBarcodeFilled", () => {
  it("starts with prefix + taxId + suffix", () => {
    const result = createBarcodeFilled(PAY, CONFIG);
    expect(result.startsWith("|010555509742401")).toBe(true);
  });

  it("pads ref1 to 18 characters", () => {
    const result = createBarcodeFilled(PAY, CONFIG);
    const parts = result.split("\r");
    expect(parts[1]).toBe("123".padStart(18, "0"));
    expect(parts[1]).toHaveLength(18);
  });

  it("pads ref2 to 18 characters", () => {
    const result = createBarcodeFilled(PAY, CONFIG);
    const parts = result.split("\r");
    expect(parts[2]).toBe("456".padStart(18, "0"));
    expect(parts[2]).toHaveLength(18);
  });

  it("strips decimal from amount and pads to 10 characters", () => {
    const result = createBarcodeFilled(PAY, CONFIG);
    const parts = result.split("\r");
    expect(parts[3]).toBe("0000010000");
    expect(parts[3]).toHaveLength(10);
  });

  it("handles amount with no decimal point", () => {
    const result = createBarcodeFilled({ ...PAY, amount: "500" }, CONFIG);
    const parts = result.split("\r");
    expect(parts[3]).toBe("0000000500");
  });

  it("produces 4 sections separated by CR", () => {
    const result = createBarcodeFilled(PAY, CONFIG);
    expect(result.split("\r")).toHaveLength(4);
  });
});

describe("createBarcodeClean", () => {
  it("starts with prefix + taxId + suffix", () => {
    const result = createBarcodeClean(PAY, CONFIG);
    expect(result.startsWith("|010555509742401")).toBe(true);
  });

  it("uses ref1 as-is without padding", () => {
    const result = createBarcodeClean(PAY, CONFIG);
    const parts = result.split("\r");
    expect(parts[1]).toBe("123");
  });

  it("uses ref2 as-is without padding", () => {
    const result = createBarcodeClean(PAY, CONFIG);
    const parts = result.split("\r");
    expect(parts[2]).toBe("456");
  });

  it("strips decimal from amount without padding", () => {
    const result = createBarcodeClean(PAY, CONFIG);
    const parts = result.split("\r");
    expect(parts[3]).toBe("10000");
  });

  it("produces 4 sections separated by CR", () => {
    const result = createBarcodeClean(PAY, CONFIG);
    expect(result.split("\r")).toHaveLength(4);
  });
});
