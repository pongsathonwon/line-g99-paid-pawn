import { saveAT, saveToken } from "@/lib/local-storage-helper";
import { axiosClient } from "../axios"

const login = async (req: TAuthLoginReq) => {
    const { data } = await axiosClient.post<TAuthLoginRes>('/login', req);
    saveToken(data.jwtToken);
    saveAT(data.accessToken);
    return data
}


const register = async (req: TAuthRegisterReq) => {
    const { data } = await axiosClient.post<TAuthLoginRes>('/register', req)
    return data
}

export const AUTH_API = {
    login,
    register,
}

export type TAuthApi = typeof AUTH_API

export type TAuthRegisterReq = {
    uid: string
    custId: string
    phoneNumber: string
}

export type TAuthLoginReq = {
    lineUid: string
}

export type TUserInfo = {
    id: string // external id
    custNo: string // internal custCode
    fullname: string // counterpart custName
    idCard: string // counterpart custId
    lineUid: string,
    mobileNo: string
    branchCode: string // '30'
    custType: string // 'G' 'M' 'E'
    custStat: number // 
    isConsent: boolean
    isVerified: boolean
    birthDate: string // iso
    gender: string // 'm' 'f' 'x'
}

export type TAuthLoginRes = {
    accessToken: string // external jwt
    jwtToken: string // internal token
    jwtExpire: number // unix
    userInfo: TUserInfo
}