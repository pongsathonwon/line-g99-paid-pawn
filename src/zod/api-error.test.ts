import { describe, expect, it } from "vitest";
import { parseApiError } from "./api-error";

describe("test api-error validator", () => {
    it("should return value", () => {
        expect(parseApiError({
            message: "test error message",
            code: "test code",
        })).not.toBe(null)
    })

    it("should not return error", () => {
        expect(parseApiError({})).toBe(null)
    })
})