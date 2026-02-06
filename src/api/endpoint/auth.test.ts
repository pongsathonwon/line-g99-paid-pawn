import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveAT, saveToken } from "@/lib/local-storage-helper";
import { axiosClient } from "../axios"
import { mockUserInfo } from "@/test/setup/auth-api-mock";
import { AUTH_API, type TAuthLoginRes } from "./auth";

// Mock the axios client module
vi.mock("../axios", () => ({
    axiosClient: {
        post: vi.fn(),
    }
}));

// Mock localStorage helper functions
vi.mock("@/lib/local-storage-helper", () => ({
    saveAT: vi.fn(),
    saveToken: vi.fn(),
}));

const MOCK_USERINFO: TAuthLoginRes = {
    accessToken: 'test-at',
    jwtToken: 'test-jwt-token',
    jwtExpire: Date.now() + 30,
    userInfo: mockUserInfo
}

describe("test auth api module", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    describe("login", () => {
        it("should call axiosClient.post with correct endpoint and request data", async () => {
            const MOCK_REQ = { lineUid: 'test-line-uid' };

            // Mock the axios response
            vi.mocked(axiosClient.post).mockResolvedValue({
                data: MOCK_USERINFO
            });

            await AUTH_API.login(MOCK_REQ);

            expect(axiosClient.post).toHaveBeenCalledOnce();
            expect(axiosClient.post).toHaveBeenCalledWith('/login', MOCK_REQ);
        });

        it("should save tokens to localStorage after successful login", async () => {
            const MOCK_REQ = { lineUid: 'test-line-uid' };

            vi.mocked(axiosClient.post).mockResolvedValue({
                data: MOCK_USERINFO
            });

            await AUTH_API.login(MOCK_REQ);

            expect(saveToken).toHaveBeenCalledOnce();
            expect(saveToken).toHaveBeenCalledWith(MOCK_USERINFO.jwtToken);
            expect(saveAT).toHaveBeenCalledOnce();
            expect(saveAT).toHaveBeenCalledWith(MOCK_USERINFO.accessToken);
        });

        it("should return the response data", async () => {
            const MOCK_REQ = { lineUid: 'test-line-uid' };

            vi.mocked(axiosClient.post).mockResolvedValue({
                data: MOCK_USERINFO
            });

            const result = await AUTH_API.login(MOCK_REQ);

            expect(result).toEqual(MOCK_USERINFO);
        });

        it("should throw error when API call fails", async () => {
            const MOCK_REQ = { lineUid: 'test-line-uid' };
            const mockError = new Error('Network error');

            vi.mocked(axiosClient.post).mockRejectedValue(mockError);

            await expect(AUTH_API.login(MOCK_REQ)).rejects.toThrow('Network error');
            expect(saveToken).not.toHaveBeenCalled();
            expect(saveAT).not.toHaveBeenCalled();
        });
    });

    describe("register", () => {
        it("should call axiosClient.post with correct endpoint and request data", async () => {
            const MOCK_REQ = {
                uid: 'test-uid',
                custId: 'test-cust-id',
                phoneNumber: '0812345678'
            };

            vi.mocked(axiosClient.post).mockResolvedValue({
                data: MOCK_USERINFO
            });

            await AUTH_API.register(MOCK_REQ);

            expect(axiosClient.post).toHaveBeenCalledOnce();
            expect(axiosClient.post).toHaveBeenCalledWith('/register', MOCK_REQ);
        });

        it("should return the response data", async () => {
            const MOCK_REQ = {
                uid: 'test-uid',
                custId: 'test-cust-id',
                phoneNumber: '0812345678'
            };

            vi.mocked(axiosClient.post).mockResolvedValue({
                data: MOCK_USERINFO
            });

            const result = await AUTH_API.register(MOCK_REQ);

            expect(result).toEqual(MOCK_USERINFO);
        });

        it("should not save tokens (register only returns data)", async () => {
            const MOCK_REQ = {
                uid: 'test-uid',
                custId: 'test-cust-id',
                phoneNumber: '0812345678'
            };

            vi.mocked(axiosClient.post).mockResolvedValue({
                data: MOCK_USERINFO
            });

            await AUTH_API.register(MOCK_REQ);

            expect(saveToken).not.toHaveBeenCalled();
            expect(saveAT).not.toHaveBeenCalled();
        });

        it("should throw error when API call fails", async () => {
            const MOCK_REQ = {
                uid: 'test-uid',
                custId: 'test-cust-id',
                phoneNumber: '0812345678'
            };
            const mockError = new Error('Registration failed');

            vi.mocked(axiosClient.post).mockRejectedValue(mockError);

            await expect(AUTH_API.register(MOCK_REQ)).rejects.toThrow('Registration failed');
        });
    });
})