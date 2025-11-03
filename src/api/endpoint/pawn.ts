import { axiosClient } from "../axios"

export const getManyPawnByCust = async ({ custCode }: TGetManyPawnReq) => {
    const { data } = await axiosClient.get<TGetManyPawmRes[]>(`pawn/${custCode}`)
    return data
}


type TGetManyPawnReq = { custCode: string }

type TGetManyPawmRes = {
    pawnNumb: string
    nextPaidDate: string
    goodWeight: number
    pawnPrice: number
    interest: number
    interestMonth: number
}