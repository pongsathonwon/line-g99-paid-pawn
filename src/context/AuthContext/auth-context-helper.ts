import { axiosClient } from "@/api/axios";
import { getAT } from "@/lib/local-storage-helper";

export const registerAxiosTokenBearer = () => {
    const interceptor = axiosClient.interceptors.request.use((config) => {
        const token = getAT();
        config.headers.Authorization = token
            ? `Bearer ${token}`
            : config.headers.Authorization;
        return config;
    });
    return () => axiosClient.interceptors.request.eject(interceptor);
}