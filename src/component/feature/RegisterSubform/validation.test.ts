import { describe, it, expect } from "vitest";
import { createSearchCustomerSchema } from "./validation";

// ─── helpers ──────────────────────────────────────────────────────────────────

const MESSAGES = {
    required: "required",
    pattern: "invalid format",
};

const schema = (method: Parameters<typeof createSearchCustomerSchema>[0]) =>
    createSearchCustomerSchema(method, MESSAGES);

const valid = (method: Parameters<typeof createSearchCustomerSchema>[0], value: string) =>
    schema(method).safeParse({ searchValue: value });

const invalid = (method: Parameters<typeof createSearchCustomerSchema>[0], value: string) =>
    schema(method).safeParse({ searchValue: value });

// ─── idCard ───────────────────────────────────────────────────────────────────

describe("createSearchCustomerSchema — idCard", () => {

    it("accepts a valid 13-digit ID card number", () => {
        expect(valid("idCard", "1234567890123").success).toBe(true);
    });

    it("rejects empty string with required message", () => {
        const result = invalid("idCard", "");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(MESSAGES.required);
    });

    it("rejects fewer than 13 digits", () => {
        const result = invalid("idCard", "123456789012");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(MESSAGES.pattern);
    });

    it("rejects more than 13 digits", () => {
        const result = invalid("idCard", "12345678901234");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(MESSAGES.pattern);
    });

    it("rejects ID card with letters", () => {
        const result = invalid("idCard", "123456789012a");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(MESSAGES.pattern);
    });

    it("rejects ID card with spaces", () => {
        const result = invalid("idCard", "1234567890 23");
        expect(result.success).toBe(false);
    });

    it("rejects ID card with dashes", () => {
        const result = invalid("idCard", "1-2345-67890-12-3");
        expect(result.success).toBe(false);
    });

});

// ─── mobileNumber ─────────────────────────────────────────────────────────────

describe("createSearchCustomerSchema — mobileNumber", () => {

    it("accepts a valid 10-digit mobile starting with 0", () => {
        expect(valid("mobileNumber", "0812345678").success).toBe(true);
    });

    it("accepts all valid Thai mobile prefixes", () => {
        expect(valid("mobileNumber", "0612345678").success).toBe(true); // 06x
        expect(valid("mobileNumber", "0712345678").success).toBe(true); // 07x
        expect(valid("mobileNumber", "0912345678").success).toBe(true); // 09x
    });

    it("rejects empty string with required message", () => {
        const result = invalid("mobileNumber", "");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(MESSAGES.required);
    });

    it("rejects number not starting with 0", () => {
        const result = invalid("mobileNumber", "1812345678");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(MESSAGES.pattern);
    });

    it("rejects fewer than 10 digits", () => {
        const result = invalid("mobileNumber", "081234567");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(MESSAGES.pattern);
    });

    it("rejects more than 10 digits", () => {
        const result = invalid("mobileNumber", "08123456789");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(MESSAGES.pattern);
    });

    it("rejects mobile with letters", () => {
        const result = invalid("mobileNumber", "081234567a");
        expect(result.success).toBe(false);
    });

    it("rejects mobile with dashes", () => {
        const result = invalid("mobileNumber", "081-234-5678");
        expect(result.success).toBe(false);
    });

});

// ─── custCode ─────────────────────────────────────────────────────────────────

describe("createSearchCustomerSchema — custCode", () => {

    it("accepts a valid 6-digit customer code", () => {
        expect(valid("custCode", "123456").success).toBe(true);
    });

    it("accepts a valid 7-digit customer code", () => {
        expect(valid("custCode", "1234567").success).toBe(true);
    });

    it("accepts customer code starting with 0 (branch 0 edge case)", () => {
        // comment in source: 'test case with customer code of branch 0 ie. 000002'
        expect(valid("custCode", "000002").success).toBe(true);
    });

    it("rejects empty string with required message", () => {
        const result = invalid("custCode", "");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(MESSAGES.required);
    });

    it("rejects fewer than 6 digits", () => {
        const result = invalid("custCode", "12345");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(MESSAGES.pattern);
    });

    it("rejects more than 7 digits", () => {
        const result = invalid("custCode", "123456789");
        expect(result.success).toBe(false);
        // .max(7) uses Zod's default message, not MESSAGES.pattern
    });

    it("rejects custCode with letters", () => {
        const result = invalid("custCode", "12345a");
        expect(result.success).toBe(false);
    });

});
