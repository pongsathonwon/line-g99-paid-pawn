import { describe, it, expect } from "vitest";
import { formatMobileNumber, isValidMobileNumber, isValidThaiIdCard, unformatMobileNumber } from "./otp";

describe("test utility functions", () => {
    describe('test format mobile number', () => {
        it("should format mobile", () => {
            expect(formatMobileNumber('0812345678')).toBe('081-234-5678')
        })
        it("should not format mobile", () => {
            expect(formatMobileNumber('081234')).toBe('081234')
        })
    })

    describe('test unformat mobile number', () => {
        it('should clean "-" out', () => {
            expect(unformatMobileNumber('081-234-5678')).toBe('0812345678')
        })
    })

    describe('test validate this id numebr', () => {
        it('should be valid clened id numb', () => {
            expect(isValidThaiIdCard("1234567890123")).toBeTruthy()
        })

        it('should be valid id numb with "-"', () => {
            expect(isValidThaiIdCard("1-234-5678-90123")).toBeTruthy()
        })

        it('should be invalid id numb with "-"', () => {
            expect(isValidThaiIdCard("1-234-5678")).toBeFalsy()
        })
    })

    describe("test validmobile number", () => {
        it('should be valid clened mobile numb', () => {
            expect(isValidMobileNumber("0812345678")).toBeTruthy()
        })

        it('should be valid mobile numb with "-"', () => {
            expect(isValidMobileNumber("081-234-5678")).toBeTruthy()
        })

        it('should be invalid clean mobile no', () => {
            expect(isValidMobileNumber("123456789")).toBeFalsy()
        })

        it('should be invalid mobile no with "-"', () => {
            expect(isValidMobileNumber("123-456-789")).toBeFalsy()
        })


    })
})

