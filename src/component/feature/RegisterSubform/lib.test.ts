import { describe, it, expect } from "vitest";
import { searchMethodMapper, searchLabelMapper, getSearchOption } from "./lib";

// ─── searchMethodMapper ───────────────────────────────────────────────────────

describe("searchMethodMapper", () => {

    it("maps 'idCard' to 'custId'", () => {
        expect(searchMethodMapper("idCard")).toBe("custId");
    });

    it("maps 'mobileNumber' to 'custPhone'", () => {
        expect(searchMethodMapper("mobileNumber")).toBe("custPhone");
    });

    it("maps 'custCode' to 'custCode'", () => {
        expect(searchMethodMapper("custCode")).toBe("custCode");
    });

});

// ─── searchLabelMapper ────────────────────────────────────────────────────────

describe("searchLabelMapper", () => {

    it("maps 'idCard' to Thai label for national ID", () => {
        expect(searchLabelMapper("idCard")).toBe("หมายเลขบัตรประชาชน");
    });

    it("maps 'mobileNumber' to Thai label for mobile number", () => {
        expect(searchLabelMapper("mobileNumber")).toBe("เบอร์โทรศัพท์มือถือ");
    });

    it("maps 'custCode' to Thai label for customer code", () => {
        expect(searchLabelMapper("custCode")).toBe("รหัสลูกค้า");
    });

});

// ─── getSearchOption ──────────────────────────────────────────────────────────

describe("getSearchOption", () => {

    it("thai mode — returns only idCard option", () => {
        const options = getSearchOption("thai");
        expect(options).toHaveLength(1);
        expect(options[0].value).toBe("idCard");
    });

    it("foreign mode — returns only custCode option", () => {
        const options = getSearchOption("foreign");
        expect(options).toHaveLength(1);
        expect(options[0].value).toBe("custCode");
    });

    it("foreign-counter mode — returns only custCode option", () => {
        const options = getSearchOption("foreign-counter");
        expect(options).toHaveLength(1);
        expect(options[0].value).toBe("custCode");
    });

    it("thai mode — does not include mobileNumber or custCode options", () => {
        const options = getSearchOption("thai");
        const values = options.map((o) => o.value);
        expect(values).not.toContain("mobileNumber");
        expect(values).not.toContain("custCode");
    });

    it("foreign mode — does not include idCard option", () => {
        const options = getSearchOption("foreign");
        const values = options.map((o) => o.value);
        expect(values).not.toContain("idCard");
    });

    it("each option has a non-empty label", () => {
        const modes = ["thai", "foreign", "foreign-counter"] as const;
        for (const mode of modes) {
            const options = getSearchOption(mode);
            for (const option of options) {
                expect(option.label.length).toBeGreaterThan(0);
            }
        }
    });

});
