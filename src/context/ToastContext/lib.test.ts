import type { TToast } from "@/types/toast.type";
import { describe, expect, it } from "vitest";
import { filterToast } from "./lib";

describe("test filter toast function", () => {
    it("should correctly decrement duration", () => {
        const step = 50;
        const MOCK_TOAST_INPUT: TToast = {
            id: '1',
            type: 'info',
            duration: 10,
            position: 'top-left',
            message: 'toast-1'
        }

        const MOCK_TOAST_RESPONSE: TToast = {
            ...MOCK_TOAST_INPUT, duration: (MOCK_TOAST_INPUT.duration ?? 0) - step
        }

        expect(filterToast(step)(MOCK_TOAST_INPUT)).toStrictEqual([MOCK_TOAST_RESPONSE])
    })
})