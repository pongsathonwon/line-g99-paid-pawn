export const REGISTER_LOCALE_TEXT = {
  th: {
    searchTitle: "ค้นหาสมาชิก",
    searchButton: "ค้นหา",
    searching: "กำลังค้นหา...",
    notFound: "ไม่พบข้อมูลลูกค้า กรุณาตรวจสอบข้อมูลอีกครั้ง",

    memberInfo: "ข้อมูลสมาชิก",
    fullname: "ชื่อ",
    mobile: "เบอร์โทรศัพท์มือถือ",
    confirmIdentity: "ยืนยันตัวตน",

    labels: {
      idCard: "หมายเลขบัตรประชาชน",
      mobileNumber: "เบอร์โทรศัพท์มือถือ",
      custCode: "รหัสลูกค้า",
    },

    errors: {
      requiredByField: {
        idCard: "กรุณากรอกเลขบัตรประชาชน",
        mobileNumber: "กรุณากรอกเบอร์โทรศัพท์",
        custCode: "กรุณากรอกรหัสลูกค้า",
      },
      pattern: {
        idCard: "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก",
        mobileNumber: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0",
        custCode: "รหัสลูกค้าต้องเป็นตัวเลข 6-7 หลัก และต้องไม่ขึ้นต้นด้วย 0",
      },
    },

    term: {
      title: "ข้อกำหนดและเงื่อนไข",
      subtitle: "ข้อกำหนดและเงื่อนไขการใช้บริการ",
      consentLabel: "ข้าพเจ้าได้อ่านและยอมรับข้อกำหนดและเงื่อนไขการใช้บริการ",
      mustScroll: "กรุณาเลื่อนอ่านข้อกำหนดและเงื่อนไขจนจบก่อนทำการยอมรับ",
      submit: "ลงทะเบียน",
      submitting: "กำลังลงทะเบียน...",
      error: "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง",
    },

    otp: {
      title: "ยืนยันรหัส OTP",
      description: (mobile: string) =>
        `รหัส OTP 6 หลัก ส่งไปที่หมายเลข ${mobile}`,
      noMobile: "ไม่พบเบอร์โทรศัพท์",
      refNo: "หมายเลขอ้างอิง",
      confirm: "ยืนยัน OTP",
      resendIn: "ส่ง OTP ใหม่ได้ใน",
      resend: "ส่ง OTP ใหม่",
      sending: "กำลังส่งรหัส OTP...",
      resendSending: "กำลังส่ง...",
      invalidOtp: "รหัส OTP ไม่ถูกต้อง กรุณาลองอีกครั้ง",
      requestFail: "ไม่สามารถส่ง OTP ได้ กรุณาลองอีกครั้ง",
    },
  },

  en: {
    /* โครงสร้างเดียวกันทุก key */
    searchTitle: "Search Member",
    searchButton: "Search",
    searching: "Searching...",
    notFound: "Customer not found",

    memberInfo: "Member Information",
    fullname: "Full Name",
    mobile: "Mobile Number",
    confirmIdentity: "Confirm Identity",

    labels: {
      idCard: "ID Card Number",
      mobileNumber: "Mobile Number",
      custCode: "Customer Code",
    },

    errors: {
      requiredByField: {
        idCard: "Please enter ID card number",
        mobileNumber: "Please enter mobile number",
        custCode: "Please enter customer code",
      },
      pattern: {
        idCard: "ID card must be 13 digits",
        mobileNumber: "Mobile number must be 10 digits and start with 0",
        custCode: "Customer code must be 6–7 digits and not starting with 0",
      },
    },

    term: {
      title: "Terms & Conditions",
      subtitle: "Terms and Conditions",
      consentLabel: "I have read and accept the terms and conditions",
      mustScroll: "Please scroll to the bottom before accepting",
      submit: "Register",
      submitting: "Registering...",
      error: "Registration failed. Please try again.",
    },

    otp: {
      title: "OTP Verification",
      description: (mobile: string) => `6-digit OTP has been sent to ${mobile}`,
      noMobile: "Mobile number not found",
      refNo: "Reference No",
      confirm: "Confirm OTP",
      resendIn: "Resend OTP in",
      resend: "Resend OTP",
      sending: "Sending OTP...",
      resendSending: "Sending...",
      invalidOtp: "Invalid OTP, please try again",
      requestFail: "Unable to send OTP, please try again",
    },
  },
} as const;
