import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "../axios"
import { getHistPaid, getManyPawnByCust, getPawnInterest } from "./pawn";



// Mock the axios client module
vi.mock("../axios", () => ({
    axiosClient: {
        get: vi.fn(),
        post: vi.fn(),
    }
}));

describe("test pawn api module", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    describe("test get pawn", () => {
        const MOCK_PAWN_LIST = [
            {
                pawnNumb: '123456',
                nextPaidDate: '2026-01-01',
                goodWeight: 1.2,
                pawnPrice: 12345,
                interest: 1,
                interestMonth: 1,
            }
        ]
        it("should call axios.get", async () => {
            const MOCK_REQ = { custCode: '123456' }
            vi.mocked(axiosClient.get).mockResolvedValue({
                data: MOCK_PAWN_LIST
            });
            await getManyPawnByCust(MOCK_REQ)

            expect(axiosClient.get).toHaveBeenCalledOnce();
            expect(axiosClient.get).toHaveBeenCalledWith(`pawn/${MOCK_REQ.custCode}`);
        })
    })

    describe("test get pawn interest", () => {

        it("should call axios.post", async () => {
            const MOCK_REQ = { custCode: '123456', pawnNumb: '000002' }
            vi.mocked(axiosClient.post).mockResolvedValue({
                data: {}
            });
            await getPawnInterest(MOCK_REQ)

            expect(axiosClient.post).toHaveBeenCalledOnce();
            expect(axiosClient.post).toHaveBeenCalledWith(`pawn/interest`, MOCK_REQ);
        })
    })

    describe("test get pawn", () => {
        const MOCK_PAWN_LIST = [
            {
                pawnNumb: '123456',
                nextPaidDate: '2026-01-01',
                goodWeight: 1.2,
                pawnPrice: 12345,
                interest: 1,
                interestMonth: 1,
            }
        ]
        it("should call axios.get", async () => {
            const MOCK_REQ = { custCode: '123456' }
            vi.mocked(axiosClient.get).mockResolvedValue({
                data: MOCK_PAWN_LIST
            });
            await getHistPaid(MOCK_REQ)

            expect(axiosClient.get).toHaveBeenCalledOnce();
            expect(axiosClient.get).toHaveBeenCalledWith(`pawn/hist-paid/${MOCK_REQ.custCode}`);
        })
    })
})