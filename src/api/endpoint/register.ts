import { axiosClient } from "../axios";
import {
  TSearchUserReq,
  TSearchUserRes,
  TOtpRequestReq,
  TOtpRequestRes,
  TOtpVerifyReq,
  TOtpVerifyRes,
  TRegisterReq,
  TForeignRegisterReq,
  TRegisterRes,
} from "@/types/register";

// Mock implementations - replace with actual endpoints when backend is ready

/**
 * Search for existing user by cardId, mobileNumber, or custCode
 * Mock endpoint: GET /api/user/search
 */
export const searchUser = async (req: TSearchUserReq): Promise<TSearchUserRes> => {
  // TODO: Replace with actual API call
  // const { data } = await axiosClient.get<TSearchUserRes>('/api/user/search', { params: req });

  // Mock response for development
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate user found
      if (req.cardId === '1234567890123' || req.mobileNumber === '0812345678' || req.custCode === 'CUST001') {
        resolve({
          custNo: 'CUST001',
          fullname: 'สมชาย ใจดี',
          idCard: '1234567890123',
          birthDate: '1990-01-15',
          mobileNo: '0812345678',
          branchCode: '30',
          custType: 'G',
          custStat: 1,
          nationCode: '1', // Thai
          gender: 'm',
          currentPoint: 100,
          totalBuy: 50000,
        });
      } else if (req.cardId === 'P1234567' || req.mobileNumber === '0898765432') {
        // Foreign user example
        resolve({
          custNo: 'CUST002',
          fullname: 'John Smith',
          idCard: 'P1234567',
          birthDate: '1985-06-20',
          mobileNo: '0898765432',
          branchCode: '30',
          custType: 'F',
          custStat: 1,
          nationCode: '2', // Foreign
          gender: 'm',
          currentPoint: 50,
          totalBuy: 25000,
        });
      } else {
        // User not found
        reject({
          status: 404,
          message: 'User not found',
        });
      }
    }, 1000); // Simulate network delay
  });
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

// Export all API functions
export const REGISTER_API = {
  searchUser,
  requestOtp,
  verifyOtp,
  registerUser,
  registerForeignUser,
};
