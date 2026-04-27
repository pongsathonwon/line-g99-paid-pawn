import { describe, it, expect } from "vitest";
import dayjs from "dayjs";
import { mapDateIntoState, transformPawnStatus } from "./lib";
import type { TGetManyPawmRes } from "@/api/endpoint/pawn";

// ─── factory ──────────────────────────────────────────────────────────────────

const makePawn = (nextPaidDate: string): TGetManyPawmRes => ({
    pawnNumb: "P001",
    nextPaidDate,
    goodWeight: 10,
    pawnPrice: 5000,
    interest: 100,
    interestMonth: 1,
});

// Fixed reference date — both test setup and mapDateIntoState use the same
// anchor, so dayjs.diff("day") truncation is always consistent
const REF = dayjs("2026-01-15T00:00:00.000Z");
const map = mapDateIntoState(REF);

const dateAt = (offsetDays: number) =>
    REF.add(offsetDays, "day").toISOString();

// ─── mapDateIntoState (HOF with injected reference date) ─────────────────────

describe("test mapping next paid date into pawn state", () => {

    describe("normal — due date more than 7 days away", () => {
        it("assigns 'normal' when diff = 8", () => {
            expect(map(makePawn(dateAt(8))).pawnStatus).toBe("normal");
        });

        it("assigns 'normal' when diff = 30", () => {
            expect(map(makePawn(dateAt(30))).pawnStatus).toBe("normal");
        });

        it("dateDiff is greater than 7", () => {
            expect(map(makePawn(dateAt(8))).dateDiff).toBeGreaterThan(7);
        });
    });

    describe("due-soon — due date 1 to 7 days away", () => {
        it("assigns 'due-soon' when diff = 7", () => {
            expect(map(makePawn(dateAt(7))).pawnStatus).toBe("due-soon");
        });

        it("assigns 'due-soon' when diff = 1", () => {
            expect(map(makePawn(dateAt(1))).pawnStatus).toBe("due-soon");
        });

        it("dateDiff is between 1 and 7", () => {
            const result = map(makePawn(dateAt(4)));
            expect(result.dateDiff).toBeGreaterThan(0);
            expect(result.dateDiff).toBeLessThanOrEqual(7);
        });
    });

    describe("due — overdue by 0 to 7 days", () => {
        it("assigns 'due' when diff = 0 (today)", () => {
            expect(map(makePawn(dateAt(0))).pawnStatus).toBe("due");
        });

        it("assigns 'due' when diff = -1", () => {
            expect(map(makePawn(dateAt(-1))).pawnStatus).toBe("due");
        });

        it("assigns 'due' when diff = -7", () => {
            expect(map(makePawn(dateAt(-7))).pawnStatus).toBe("due");
        });
    });

    describe("overdue — overdue by 8 to 14 days", () => {
        it("assigns 'overdue' when diff = -8", () => {
            expect(map(makePawn(dateAt(-8))).pawnStatus).toBe("overdue");
        });

        it("assigns 'overdue' when diff = -14", () => {
            expect(map(makePawn(dateAt(-14))).pawnStatus).toBe("overdue");
        });

        it("dateDiff is between -8 and -14", () => {
            const result = map(makePawn(dateAt(-10)));
            expect(result.dateDiff).toBeLessThan(-7);
            expect(result.dateDiff).toBeGreaterThanOrEqual(-14);
        });
    });

    describe("expire — overdue by more than 14 days", () => {
        it("assigns 'expire' when diff = -15", () => {
            expect(map(makePawn(dateAt(-15))).pawnStatus).toBe("expire");
        });

        it("assigns 'expire' when diff = -30", () => {
            expect(map(makePawn(dateAt(-30))).pawnStatus).toBe("expire");
        });

        it("dateDiff is less than -14", () => {
            expect(map(makePawn(dateAt(-20))).dateDiff).toBeLessThan(-14);
        });
    });

    // ─── boundary values ──────────────────────────────────────────────────────

    describe("boundaries", () => {
        it("diff = 8 → normal,  diff = 7 → due-soon", () => {
            expect(map(makePawn(dateAt(8))).pawnStatus).toBe("normal");
            expect(map(makePawn(dateAt(7))).pawnStatus).toBe("due-soon");
        });

        it("diff = 1 → due-soon,  diff = 0 → due", () => {
            expect(map(makePawn(dateAt(1))).pawnStatus).toBe("due-soon");
            expect(map(makePawn(dateAt(0))).pawnStatus).toBe("due");
        });

        it("diff = -7 → due,  diff = -8 → overdue", () => {
            expect(map(makePawn(dateAt(-7))).pawnStatus).toBe("due");
            expect(map(makePawn(dateAt(-8))).pawnStatus).toBe("overdue");
        });

        it("diff = -14 → overdue,  diff = -15 → expire", () => {
            expect(map(makePawn(dateAt(-14))).pawnStatus).toBe("overdue");
            expect(map(makePawn(dateAt(-15))).pawnStatus).toBe("expire");
        });
    });

    // ─── array handling ───────────────────────────────────────────────────────

    describe("array handling", () => {
        it("returns empty array when given empty array", () => {
            expect(transformPawnStatus([])).toEqual([]);
        });

        it("maps multiple pawns independently", () => {
            const input = [
                makePawn(dateAt(10)),   // normal
                makePawn(dateAt(3)),    // due-soon
                makePawn(dateAt(-3)),   // due
                makePawn(dateAt(-10)),  // overdue
                makePawn(dateAt(-20)),  // expire
            ];
            const [a, b, c, d, e] = input.map(map);
            expect(a.pawnStatus).toBe("normal");
            expect(b.pawnStatus).toBe("due-soon");
            expect(c.pawnStatus).toBe("due");
            expect(d.pawnStatus).toBe("overdue");
            expect(e.pawnStatus).toBe("expire");
        });

        it("preserves all original pawn fields", () => {
            const pawn = makePawn(dateAt(10));
            const result = map(pawn);
            expect(result.pawnNumb).toBe(pawn.pawnNumb);
            expect(result.pawnPrice).toBe(pawn.pawnPrice);
            expect(result.goodWeight).toBe(pawn.goodWeight);
            expect(result.interest).toBe(pawn.interest);
            expect(result.interestMonth).toBe(pawn.interestMonth);
        });
    });
});
