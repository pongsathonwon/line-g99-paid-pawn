import type { TGetManyPawmRes } from "@/api/endpoint/pawn";
import dayjs, { Dayjs } from "dayjs";

export type TPawnStatusEnum = "overdue" | "due-soon" | "normal" | "due" | "expire";

type TGetManyPawnWithStatus = TGetManyPawmRes & {
    pawnStatus: TPawnStatusEnum
    dateDiff: number
}

interface IMapDateIntoState {
    nextPaidDate: string;
}

type TWithPawnStatus = {
    pawnStatus: TPawnStatusEnum
    dateDiff: number
}

export const mapDateIntoState = (targetDate: Dayjs) => {

    return <T extends IMapDateIntoState>(item: T): T & TWithPawnStatus => {
        const nextPaidDate = dayjs(item.nextPaidDate);
        const diffInDays = nextPaidDate.diff(targetDate, "day");

        if (diffInDays > 7) return { ...item, pawnStatus: "normal", dateDiff: diffInDays };

        if (diffInDays > 0) return { ...item, pawnStatus: "due-soon", dateDiff: diffInDays };

        if (diffInDays > -7) return { ...item, pawnStatus: "due", dateDiff: diffInDays };

        if (diffInDays >= -14) return { ...item, pawnStatus: "overdue", dateDiff: diffInDays };

        return { ...item, pawnStatus: "expire", dateDiff: diffInDays };
    };
}

export const transformPawnStatus = (pawn: TGetManyPawmRes[]): TGetManyPawnWithStatus[] => {
    // server sends 2026-03-22T00:00:00 so normalise to start of day for comparison
    const today = dayjs().startOf("day");
    const mapDateIntoStateOfToday = mapDateIntoState(today)
    return pawn.map(mapDateIntoStateOfToday);
} 