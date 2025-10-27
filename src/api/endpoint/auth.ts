import { axiosClient } from "../axios"

const login = async (req: TAuthLoginReq) => {
    // const { data } = await axiosClient.post<TAuthLoginRes>('/login', req);
    // return data
    return Promise.resolve({ token: 'test token' })
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

export type TAuthLoginReq = Pick<TAuthRegisterReq, 'uid'>

export type TAuthLoginRes = {
    token: string
}