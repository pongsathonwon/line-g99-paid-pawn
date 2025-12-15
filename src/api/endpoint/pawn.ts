import { axiosClient } from "../axios"

export const getManyPawnByCust = async ({ custCode }: TGetManyPawnReq) => {
    if (!custCode) return []
    const { data } = await axiosClient.get<TGetManyPawmRes[]>(`pawn/${custCode}`)
    return data
}

export const getPawnInterest = async (req: TGetPawnInterestReq) => {
    const { data } = await axiosClient.post<TGetPawnInterestRes>(`pawn/interest`, req)
    return data
}


export type TGetManyPawnReq = { custCode?: string }

export type TGetManyPawmRes = {
    pawnNumb: string
    nextPaidDate: string
    goodWeight: number
    pawnPrice: number
    interest: number
    interestMonth: number
}

export type TGetPawnInterestReq = {
    custCode: string
    pawnNumb: string
}

export type TGetPawnInterestRes = {
    id: number
    createAt: string
    pawnNumb: string
    custCode: string
    branchCode: string
    paidOrder: number
    dueDate: string
    validBefore: string
    baseFactor: number
    penaltyFactor: number
    factor: number
    baseInterest: number
    penaltyInterest: number
    totalInterest: number
    membDisc: number
    netInterest: number
    interestRate: number
    pawnPrice: number
}