export const SURVEY_TEXT = {
  title: "แบบประเมินหลังใช้บริการ",
  subtitle: "ขอบคุณที่ใช้บริการ Golden 99 ความเห็นของคุณช่วยให้เราพัฒนาบริการได้ดียิ่งขึ้น",
  ratingHint: "ให้คะแนน 1 ถึง 5 ดาว (5 = ดีมาก)",
  star: (n: number) => `${n} ดาว`,
  textCounter: (length: number, max: number) =>
    `${length.toLocaleString("th-TH")}/${max.toLocaleString("th-TH")}`,
  textPlaceholder: "พิมพ์ความเห็นของคุณ (ไม่บังคับ)",
  submit: "ส่งแบบประเมิน",
  submitting: "กำลังส่ง...",
  retry: "ลองใหม่อีกครั้ง",
  relogin: "เข้าสู่ระบบ LINE อีกครั้ง",
  backToList: "กลับไปหน้ารายการ",
  list: {
    heading: "เลือกรายการที่ต้องการประเมิน",
    hint: (days: number) =>
      `รายการของคุณในช่วง ${days.toLocaleString("th-TH")} วันที่ผ่านมา แตะรายการเพื่อประเมิน`,
    empty: "ไม่พบรายการในช่วง 30 วันที่ผ่านมา",
    surveyed: "ประเมินแล้ว",
    docNumb: "เลขที่เอกสาร",
    branch: "สาขา",
  },
  form: {
    heading: "ประเมินรายการนี้",
  },
  errors: {
    rating: "กรุณาให้คะแนน 1 ถึง 5 ดาว",
    textRequired: "กรุณากรอกข้อความ",
    textTooLong: "ข้อความต้องไม่เกิน 1,000 ตัวอักษร",
    loadList: "ไม่สามารถโหลดรายการได้ในขณะนี้",
    loadForm: "ไม่สามารถโหลดแบบประเมินได้ในขณะนี้",
    memberServiceDown: "ระบบสมาชิกขัดข้องชั่วคราว",
    memberServiceDownHint: "กรุณาลองใหม่อีกครั้งในอีกสักครู่",
    unauthorized: "ไม่สามารถยืนยันตัวตน LINE ได้ กำลังพาไปเข้าสู่ระบบใหม่",
    submit: "ส่งแบบประเมินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
    setChanged: "แบบประเมินมีการปรับปรุง กรุณาตอบใหม่อีกครั้ง",
    alreadySurveyed: "ประเมินรายการนี้แล้ว",
    txnNotFound: "ไม่พบรายการนี้",
    txnNotFoundHint:
      "รายการนี้ไม่อยู่ในบัญชีสมาชิกของคุณ หรือไม่อยู่ในช่วง 30 วันที่ผ่านมา",
    txnNotEligible: "รายการนี้ประเมินไม่ได้แล้ว",
    txnNotEligibleHint: "รายการถูกยกเลิก หรือเกิน 30 วันนับจากวันที่ทำรายการ",
    // GoldenApi says "not a member" while the g99-online login says member
    // (e.g. just registered): sending them to /register would loop
    notMember: "ยังไม่พบบัญชีสมาชิกของคุณ",
    notMemberHint: "ระบบอาจใช้เวลาสักครู่ กรุณาลองใหม่อีกครั้ง",
  },
  thankYou: {
    title: "ขอบคุณสำหรับการประเมิน",
    message: "เราได้รับคำตอบของคุณแล้ว",
    another: "ประเมินรายการอื่น",
  },
  testMode: {
    banner: (uid: string | null | undefined) =>
      uid ? `โหมดทดสอบ · uid …${uid.slice(-6)}` : "โหมดทดสอบ",
    notMember: "uid นี้ยังไม่เป็นสมาชิก",
    notMemberHint:
      "โหมดทดสอบไม่พาไปหน้าลงทะเบียน ลองใช้ uid ของลูกค้าที่เป็นสมาชิกแล้ว",
    refusedTitle: "รหัสโหมดทดสอบไม่ถูกต้อง",
    refused:
      "ระบบไม่รับรหัสทดสอบนี้ หรือโหมดทดสอบถูกปิดอยู่ คำตอบจะไม่ถูกบันทึก",
    exit: "ออกจากโหมดทดสอบ",
  },
};
