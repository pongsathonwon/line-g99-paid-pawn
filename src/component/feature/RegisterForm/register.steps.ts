export type RegisterStep = {
  key: string;
  label: string;
};

export const THAI_REGISTER_STEPS: RegisterStep[] = [
  { key: "search", label: "ค้นหาสมาชิก" },
  { key: "otp", label: "ยืนยัน OTP" },
  { key: "term", label: "เงื่อนไขการใช้บริการ" },
  { key: "success", label: "สำเร็จ" },
];

export const FOREIGN_REGISTER_STEPS: RegisterStep[] = [
  { key: "search", label: "Search Customer" },
  { key: "otp", label: "OTP Verification" },
  { key: "term", label: "Terms & Agreement" },
  { key: "success", label: "Completed" },
];
export const FOREIGN_COUNTER_REGISTER_STEPS: RegisterStep[] = [
  { key: "search", label: "Search Customer" },
  { key: "term", label: "Terms & Ag  0reement" },
  { key: "pending", label: "Pending" },
];
