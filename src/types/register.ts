// Registration Form Types

export type TSearchUserMethod = 'idCard' | 'mobileNumber' | 'custCode';

export type TQueryParameter = ""

export type TUserType = 'thai' | 'foreign';

export type TRegistrationStep = 'search' | 'otp' | 'success' | 'pending';

export type TSearchUserReq = {
  custId?: string;
  custCode?: string;
  nationCode?: string // 1 ไทย 2 ต่างชาติ
};

export type TSearchUserRes = {
  custNo: string;
  fullname: string;
  idCard: string;
  birthDate: string;
  mobileNo: string;
  branchCode: string;
  custType: string;
  custStat: number;
  nationCode: string;
  gender?: string;
  // Additional POS data
  currentPoint?: number;
  totalBuy?: number;
};

// OTP Request/Response
export type TOtpRequestReq = {
  msisdn: string; // mobile number
};

export type TOtpRequestRes = {
  status: 'success';
  token: string; // OTP session token
  refno: string; // Reference number for user
};

export type TWrappedRes<T> = {
  resultCode: number
  resultDescription: string
  body?: T
}

export type TOtpVerifyReq = {
  token: string; // From OTP request
  pin: string; // 6-digit code
};

export type TOtpVerifyRes = {
  status: string;
  message: string
};

// Register Request/Response
export type TRegisterReq = {
  lineUid: string;
  custNo: string;
  fullname: string;
  idCard: string;
  birthDate: string;
  mobileNo: string;
  branchCode: string;
  custType: string;
  custStat: number;
  nationCode: string;
  gender?: string;
  isConsent: boolean;
  isVerified: boolean;
};

export type TForeignRegisterReq = TRegisterReq & {
  passportNumber?: string;
  nationality?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
};

export type TRegisterRes = {
  id: string;
  custNo: string;
  fullname: string;
  lineUid: string;
  mobileNo: string;
  isVerified: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
};

// Registration Form Data (for multi-step state)
export type TRegistrationFormData = {
  // Step 1: Search
  searchMethod: TSearchUserMethod;
  searchValue: string;

  // User data from search or manual entry
  userData?: TSearchUserRes;

  // Step 2: OTP
  otpToken?: string;
  otpRefNo?: string;
  otpCode?: string;

  // Final
  userType: TUserType;
  isConsent: boolean;
};

// Foreign Register Status Request/Response
export type TForeignRegisterStatusReq = {
  lineUid: string;
};

export type TForeignRegisterStatusRes = {
  approvalStatus: 'pending' | 'approved' | 'rejected';
  custNo?: string;
  fullname?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
};

// Registration Context Type
export type TRegistrationContext = {
  currentStep: TRegistrationStep;
  formData: TRegistrationFormData;
  setCurrentStep: (step: TRegistrationStep) => void;
  setFormData: (data: Partial<TRegistrationFormData>) => void;
  resetForm: () => void;
};
