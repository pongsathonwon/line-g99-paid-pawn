// src/lib/local-storage-helper.test.ts
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import {
    saveToken, getToken, deleteToken,
    saveAT, getAT, deleteAt,
} from "./local-storage-helper"

const VALID_TOKEN = "eyJhbGciOiJIUzI1NiJ9.test"
const ONE_HOUR_MS = 1000 * 60 * 60

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    vi.restoreAllMocks()   // restore Date.now() after each test
})

// ─── saveToken / getToken / deleteToken ───────────────────────────────────────

describe("saveToken + getToken", () => {

    it("returns null when nothing saved", () => {
        expect(getToken()).toBeNull()
    })

    it("returns the token when saved and not expired", () => {
        saveToken(VALID_TOKEN)
        expect(getToken()).toBe(VALID_TOKEN)
    })

    it("returns null when token is expired", () => {
        const NOW = Date.now()
        vi.spyOn(Date, "now").mockReturnValueOnce(NOW)          // saveToken call
        saveToken(VALID_TOKEN)

        // move time forward past 1 hour
        vi.spyOn(Date, "now").mockReturnValue(NOW + ONE_HOUR_MS + 1)
        expect(getToken()).toBeNull()
    })

    it("returns null when localStorage has corrupt JSON", () => {
        localStorage.setItem("G99_PAWN_TOKEN", "not-valid-json{{{")
        expect(getToken()).toBeNull()
    })

    it("returns null when stored object fails Zod schema", () => {
        // valid JSON but wrong shape (missing 'value' and 'exp' fields)
        localStorage.setItem("G99_PAWN_TOKEN", JSON.stringify({ wrong: true }))
        expect(getToken()).toBeNull()
    })

})

describe("deleteToken", () => {

    it("removes the token so getToken returns null", () => {
        saveToken(VALID_TOKEN)
        expect(getToken()).toBe(VALID_TOKEN)   // confirm it's there first
        deleteToken()
        expect(getToken()).toBeNull()
    })

    it("does not throw when called with nothing saved", () => {
        expect(() => deleteToken()).not.toThrow()
    })

})

// ─── saveAT / getAT / deleteAt ────────────────────────────────────────────────

describe("saveAT + getAT", () => {

    it("returns null when nothing saved", () => {
        expect(getAT()).toBeNull()
    })

    it("returns the access token when saved and not expired", () => {
        saveAT(VALID_TOKEN)
        expect(getAT()).toBe(VALID_TOKEN)
    })

    it("returns null when access token is expired", () => {
        const NOW = Date.now()
        vi.spyOn(Date, "now").mockReturnValueOnce(NOW)
        saveAT(VALID_TOKEN)

        vi.spyOn(Date, "now").mockReturnValue(NOW + ONE_HOUR_MS + 1)
        expect(getAT()).toBeNull()
    })

    it("returns null when localStorage has corrupt JSON", () => {
        localStorage.setItem("G99_PAWN_AT", "bad-json")
        expect(getAT()).toBeNull()
    })

})

describe("deleteAt", () => {

    it("removes the access token so getAT returns null", () => {
        saveAT(VALID_TOKEN)
        deleteAt()
        expect(getAT()).toBeNull()
    })

})

// ─── Isolation: TOKEN and AT are stored separately ────────────────────────────

describe("key isolation", () => {

    it("saving token does not affect AT", () => {
        saveToken(VALID_TOKEN)
        expect(getAT()).toBeNull()
    })

    it("saving AT does not affect token", () => {
        saveAT(VALID_TOKEN)
        expect(getToken()).toBeNull()
    })

    it("deleting token does not delete AT", () => {
        saveToken(VALID_TOKEN)
        saveAT(VALID_TOKEN)
        deleteToken()
        expect(getAT()).toBe(VALID_TOKEN)
    })

})