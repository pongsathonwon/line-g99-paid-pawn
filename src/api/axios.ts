import axios, { type AxiosResponse } from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export type TAxiosFunc<Req, Res> = [Res, AxiosResponse<Res>, Req];
