import type { TSearchUserMethod } from "@/types/register";

export const searchMethodMapper = (searchMethod: TSearchUserMethod) => {
  switch (searchMethod) {
    case "idCard":
      return "custId";
    case "mobileNumber":
      return "custPhone";
    case "custCode":
      return "custCode";
  }
};

export const searchLabelMapper = (searchMethod: TSearchUserMethod) => {
  switch (searchMethod) {
    case "idCard":
      return "หมายเลขบัตรประชาชน";
    case "mobileNumber":
      return "เบอร์โทรศัพท์มือถือ";
    case "custCode":
      return "รหัสลูกค้า";
  }
};

export const searchValidator = (searchMethod: TSearchUserMethod) => {
  switch (searchMethod) {
    case "idCard":
    case "mobileNumber":
    case "custCode":
  }
};

export type TRegisterFormMode = "thai" | "foreign" | "foreign-counter";

export type TSearchMethodOption = { value: TSearchUserMethod; label: string };

export const getSearchOption = (
  reigsterMode: TRegisterFormMode,
): TSearchMethodOption[] => {
  switch (reigsterMode) {
    case "thai":
      return [{ value: "idCard", label: "บัตรประชาชน" }];
    case "foreign":
      return [{ value: "custCode", label: "รหัสลูกค้า" }];
    case "foreign-counter":
      return [{ value: "custCode", label: "รหัสลูกค้า" }];
  }
};
