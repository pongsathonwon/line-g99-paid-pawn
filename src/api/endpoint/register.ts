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
  TRegisterRequestReq,
  TRegisterRequestRes,
  TRegisterRes,
  TForeignRegisterStatusReq,
  TForeignRegisterStatusRes,
  TWrappedRes,
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
 * Endpoint: POST https://api.simatic.golden99.co.th/api/sb/v1/tbs/otp_request
 */
export const requestOtp = async (req: TOtpRequestReq): Promise<TOtpRequestRes> => {
  try {
    const { data } = await axiosClient.post<TWrappedRes<TOtpRequestRes>>(
      '/api/sb/v1/tbs/otp_request',
      req,
      {
        baseURL: 'https://api.simatic.golden99.co.th',
      }
    );
    const res = data.body
    if (!res) throw new Error(`ไม่สามารถใช้งานได้ในขณะนี้ : [${data.resultCode}]`)
    return res
  } catch (e) {
    if (e instanceof AxiosError) {
      const apiErrorMessage = e.response?.data.message;
      if (!apiErrorMessage) throw new Error(`ไม่สามารถใช้งานได้ในขณะนี้ : [${e.code}]`);
      throw new Error(apiErrorMessage);
    }
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(String(e));
  }
};

/**
 * Verify OTP code entered by user
 * Mock endpoint: POST /api/otp/verify
 */
export const verifyOtp = async (req: TOtpVerifyReq): Promise<TOtpVerifyRes> => {
  // TODO: Replace with actual API call
  // const { data } = await axiosClient.post<TOtpVerifyRes>('/api/otp/verify', req);
  try {

    const { data } = await axiosClient.post<TWrappedRes<TOtpVerifyRes>>(
      '/api/sb/v1/tbs/otp_verify',
      req,
      {
        baseURL: 'https://api.simatic.golden99.co.th',
      }
    );
    const res = data.body
    if (!res) throw new Error(`ไม่สามารถใช้งานได้ในขณะนี้ : [${data.resultCode}]`)
    return res
  } catch (e) {
    if (e instanceof AxiosError) {
      const apiErrorMessage = e.response?.data.message;
      if (!apiErrorMessage) throw new Error(`ไม่สามารถใช้งานได้ในขณะนี้ : [${e.code}]`);
      throw new Error(apiErrorMessage);
    }
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(String(e));
  }
}

/**
 * Update existing user in HUG CRM
 */
export const updateUser = async ({ dataFrom, ...r }: TRegisterReq): Promise<TRegisterRes> => {
  try {
    const { data } = await axiosClient.post<TWrappedRes<TRegisterRes>>(
      '/api/sb/v1/customer/update',
      r,
      {
        baseURL: 'https://api.simatic.golden99.co.th',
      }
    );
    if (data.resultError) throw new Error(data.resultError.message)
    const res = data.body
    if (!res) throw new Error(`อัปเดตข้อมูลไม่สำเร็จ : [${data.resultCode}]`)
    return res
  } catch (e) {
    if (e instanceof AxiosError) {
      const apiErrorMessage = e.response?.data.message;
      if (!apiErrorMessage) throw new Error(`ไม่สามารถใช้งานได้ในขณะนี้ : [${e.code}]`);
      throw new Error(apiErrorMessage);
    }
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(String(e));
  }
}

/**
 * Register user (always POST /api/sb/v1/customer/create — only called when user exists in HUG CRM)
 */
export const registerUser = async (req: TRegisterReq): Promise<TRegisterRes> => {
  try {
    const { data } = await axiosClient.post<TWrappedRes<TRegisterRes>>(
      '/api/sb/v1/customer/create',
      req,
      {
        baseURL: 'https://api.simatic.golden99.co.th',
      }
    );
    if (data.resultError) throw new Error(data.resultError.message)
    const res = data.body
    if (!res) throw new Error(`ลงทะเบียนไม่สำเร็จ : [${data.resultCode}]`)
    return res
  } catch (e) {
    if (e instanceof AxiosError) {
      const apiErrorMessage = e.response?.data.message;
      if (!apiErrorMessage) throw new Error(`ไม่สามารถใช้งานได้ในขณะนี้ : [${e.code}]`);
      throw new Error(apiErrorMessage);
    }
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(String(e));
  }
}




/**
 * Register foreign user with fallback: try create, if duplicate key → update
 */
export const registerUserWithFallback = async (req: TRegisterReq): Promise<TRegisterRes> => {
  try {
    return await registerUser(req);
  } catch (e) {
    if (e instanceof Error && e.message.includes('duplicate key')) {
      // User already exists in vendor DB — fall back to update
      return await updateUser(req);
    }
    throw e;
  }
};

/**
 * Register request for foreign counter (simplified registration)
 * Endpoint: POST /register-request
 * Backend saves: lineUid, custNo, branchCode (from CustInfo), isConsent, isVerified=false, status=PENDING
 */
export const registerRequest = async (req: TRegisterRequestReq): Promise<TRegisterRequestRes> => {
  try {
    const { data } = await axiosClient.post<TRegisterRequestRes>(
      '/register-request',
      req
    );
    if (!data?.lineUid) throw new Error('ลงทะเบียนไม่สำเร็จ');
    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      const apiErrorMessage = e.response?.data.message;
      if (!apiErrorMessage) throw new Error(`ไม่สามารถใช้งานได้ในขณะนี้ : [${e.code}]`);
      throw new Error(apiErrorMessage);
    }
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(String(e));
  }
};

/**
 * Register foreign user (requires approval)
 * Mock endpoint: POST /api/foreign-register
 */
// export const registerForeignUser = async (req: TForeignRegisterReq): Promise<TRegisterRes> => {
//   // TODO: Replace with actual API call
//   // const { data } = await axiosClient.post<TRegisterRes>('/api/foreign-register', req);

//   // Mock response for development
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         id: 'foreign_user_' + Date.now(),
//         custNo: req.custNo,
//         fullname: req.fullname,
//         lineUid: req.lineUid,
//         mobileNo: req.mobileNo,
//         isVerified: true,
//         approvalStatus: 'pending', // Foreign users require approval
//       });
//     }, 1000);
//   });
//};

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
  registerUserWithFallback,
  updateUser,
  registerRequest,
  foreignRegisterStatus,
};
