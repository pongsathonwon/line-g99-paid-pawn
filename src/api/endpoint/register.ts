import { AxiosError } from "axios";
import { axiosClient } from "../axios";
import type {
  TSearchUserReq,
  TSearchUserRes,
  TOtpRequestReq,
  TOtpRequestRes,
  TOtpVerifyReq,
  TOtpVerifyRes,
  TRegisterReq,
  TForeignRegisterReq,
  TRegisterRes,
  TForeignRegisterStatusReq,
  TForeignRegisterStatusRes,
} from "@/types/register";

// Mock implementations - replace with actual endpoints when backend is ready
export const searchUser = async (req: TSearchUserReq): Promise<TSearchUserRes> => {
  try {
    const { data } = await axiosClient.get<TSearchUserRes>('/cust', { params: req });
    return data
  } catch (e) {
    if (e instanceof AxiosError) {
      const apiErrorMessage = e.response?.data.message;
      if (!apiErrorMessage) throw new Error(`ไม่สามารถใช้งานได้ในขณะนี้ : [${e.code}]`);
      throw new Error(apiErrorMessage)
    }
    if (e instanceof Error) {
      throw e
    }
    throw new Error(String(e))
  }
};

/**
 * Request OTP code to be sent to mobile number
 * Mock endpoint: POST /api/otp/request
 */
export const requestOtp = async (req: TOtpRequestReq): Promise<TOtpRequestRes> => {
  // TODO: Replace with actual API call
  // const { data } = await axiosClient.post<TOtpRequestRes>('/api/otp/request', req);

  // Mock response for development
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        token: 'mock_otp_token_' + Date.now(),
        refno: 'REF' + Math.random().toString(36).substring(7).toUpperCase(),
      });
    }, 500);
  });
};

/**
 * Verify OTP code entered by user
 * Mock endpoint: POST /api/otp/verify
 */
export const verifyOtp = async (req: TOtpVerifyReq): Promise<TOtpVerifyRes> => {
  // TODO: Replace with actual API call
  // const { data } = await axiosClient.post<TOtpVerifyRes>('/api/otp/verify', req);

  // Mock response for development
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock: Accept '123456' as valid OTP
      if (req.pin === '123456') {
        resolve({
          status: 'success',
        });
      } else {
        reject({
          status: 400,
          message: 'Invalid OTP code',
          code: 'otp_invalid',
        });
      }
    }, 500);
  });
};

/**
 * Register Thai user (domestic)
 * Mock endpoint: POST /api/register
 */
export const registerUser = async (req: TRegisterReq): Promise<TRegisterRes> => {
  // TODO: Replace with actual API call
  // const { data } = await axiosClient.post<TRegisterRes>('/api/register', req);

  // Mock response for development
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'user_' + Date.now(),
        custNo: req.custNo,
        fullname: req.fullname,
        lineUid: req.lineUid,
        mobileNo: req.mobileNo,
        isVerified: true,
      });
    }, 1000);
  });
};

/**
 * Register foreign user (requires approval)
 * Mock endpoint: POST /api/foreign-register
 */
export const registerForeignUser = async (req: TForeignRegisterReq): Promise<TRegisterRes> => {
  // TODO: Replace with actual API call
  // const { data } = await axiosClient.post<TRegisterRes>('/api/foreign-register', req);

  // Mock response for development
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'foreign_user_' + Date.now(),
        custNo: req.custNo,
        fullname: req.fullname,
        lineUid: req.lineUid,
        mobileNo: req.mobileNo,
        isVerified: true,
        approvalStatus: 'pending', // Foreign users require approval
      });
    }, 1000);
  });
};

/**
 * Check foreign user registration approval status
 * Mock endpoint: GET /api/foreign-register/status
 */
export const foreignRegisterStatus = async (
  req: TForeignRegisterStatusReq
): Promise<TForeignRegisterStatusRes> => {
  // TODO: Replace with actual API call
  // const { data } = await axiosClient.get<TForeignRegisterStatusRes>('/api/foreign-register/status', { params: req });

  // Mock response for development
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock: Simulate different approval statuses based on lineUid
      const mockStatuses: TForeignRegisterStatusRes[] = [
        {
          approvalStatus: 'pending',
          custNo: 'CUST001',
          fullname: 'John Doe',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        },
        {
          approvalStatus: 'approved',
          custNo: 'CUST002',
          fullname: 'Jane Smith',
          submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        },
        {
          approvalStatus: 'rejected',
          custNo: 'CUST003',
          fullname: 'Bob Johnson',
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          rejectionReason: 'Invalid passport documentation',
        },
      ];

      // Return random status for demo, or use lineUid hash to be consistent
      const index = req.lineUid.length % mockStatuses.length;
      resolve(mockStatuses[index]);
    }, 800);
  });
};

// Export all API functions
export const REGISTER_API = {
  searchUser,
  requestOtp,
  verifyOtp,
  registerUser,
  registerForeignUser,
  foreignRegisterStatus,
};
