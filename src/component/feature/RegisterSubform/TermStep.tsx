import React, { type PropsWithChildren, useState } from "react";
import { Button } from "@/component/Button";
import { useLineContext } from "@/context/LineContext/LineContext";
import { REGISTER_LOCALE_TEXT } from "@/component/feature/RegisterForm/register.locale";
import { useRegisterMutation } from "./useRegisterMutation";
import useScrollPosition from "./useScrollPosition";

type TTermStepProps = {
  isConsent: boolean;
  onConsent: (consent: boolean) => void;
  userData: {
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
  };
  isVerified: boolean;
  mode: "thai" | "foreign" | "foreign-counter";
};

function TermStep({
  isConsent,
  onConsent,
  userData,
  isVerified,
  mode,
}: PropsWithChildren<TTermStepProps>) {
  const { lineCtx } = useLineContext();
  const { mutate, isPending } = useRegisterMutation(mode);
  const [isChecked, setIsChecked] = useState(isConsent);
  const { hasScrolledToBottom, termsBoxRef } =
    useScrollPosition<HTMLDivElement>();
  const t = REGISTER_LOCALE_TEXT.th.term;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onConsent(checked);
  };

  const handleRegister = () => {
    if (!isChecked || !hasScrolledToBottom) {
      return;
    }

    const lineUid = lineCtx?.profile?.userId;

    if (!lineUid) return;

    if (mode === "foreign-counter") {
      mutate({ lineUid, custNo: userData.custNo, isConsent: isChecked });
      return;
    }

    mutate({
      lineUid,
      custNo: userData.custNo,
      fullname: userData.fullname,
      idCard: userData.idCard,
      birthDate: userData.birthDate,
      mobileNo: userData.mobileNo,
      branchCode: userData.branchCode,
      custType: userData.custType,
      custStat: userData.custStat,
      nationCode: userData.nationCode,
      gender: userData.gender,
      isConsent: isChecked,
      isVerified: isVerified,
    });
  };

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
      </div>

      {/* Scrollable Terms Box */}
      <div
        ref={termsBoxRef}
        className="h-96 overflow-y-auto border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-inner scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div className="mb-4 p-4 bg-white rounded-lg border-l-4 border-amber-500">
            <p>
              บริษัท โกลด์เด้น 99 จำกัด
              ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของคุณ
              โดยนโยบายความเป็นส่วนตัวฉบับนี้ได้อธิบายแนวปฏิบัติเกี่ยวกับการเก็บรวบรวม
              ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล รวมถึงสิทธิต่าง ๆ
              ของเจ้าของข้อมูลส่วนบุคคล ตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
            </p>
          </div>
          {/* conntent */}
          <div className="space-y-5">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-base">
                การเก็บรวบรวมข้อมูลส่วนบุคคล
              </h4>
              <p className="mb-2">
                เราจะเก็บรวบรวมข้อมูลส่วนบุคคลที่ได้รับโดยตรงจากคุณผ่านช่องทาง
                ดังต่อไปนี้
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                <li>การสมัครสมาชิก</li>
                <li>โทรศัพท์</li>
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-base">
                ประเภทข้อมูลส่วนบุคคลที่เก็บรวบรวม
              </h4>
              <div className="space-y-3 bg-white p-4 rounded-lg">
                <p>
                  <b className="text-gray-800">ข้อมูลส่วนบุคคล</b>{" "}
                  <span className="text-gray-600">
                    เช่น ชื่อ นามสกุล อายุ วันเดือนปีเกิด สัญชาติ
                    เลขประจำตัวประชาชน หนังสือเดินทาง เป็นต้น
                  </span>
                </p>
                <p>
                  <b className="text-gray-800">ข้อมูลการติดต่อ</b>{" "}
                  <span className="text-gray-600">
                    เช่น ที่อยู่ หมายเลขโทรศัพท์ อีเมล เป็นต้น
                  </span>
                </p>
                <p>
                  <b className="text-gray-800">ข้อมูลบัญชี</b>{" "}
                  <span className="text-gray-600">
                    เช่น บัญชีผู้ใช้งาน ประวัติการใช้งาน เป็นต้น
                  </span>
                </p>
                <p>
                  <b className="text-gray-800">หลักฐานแสดงตัวตน</b>{" "}
                  <span className="text-gray-600">
                    เช่น สำเนาบัตรประจำตัวประชาชน สำเนาหนังสือเดินทาง เป็นต้น
                  </span>
                </p>
                <p>
                  <b className="text-gray-800">ข้อมูลการทำธุรกรรมและการเงิน</b>{" "}
                  <span className="text-gray-600">
                    เช่น ประวัติการสั่งซื้อ รายละเอียดบัตรเครดิต บัญชีธนาคาร
                    เป็นต้น
                  </span>
                </p>
                <p>
                  <b className="text-gray-800">ข้อมูลทางเทคนิค</b>{" "}
                  <span className="text-gray-600">
                    เช่น IP address, Cookie ID, ประวัติการใช้งานเว็บไซต์
                    (Activity Log) เป็นต้น
                  </span>
                </p>
                <p>
                  <b className="text-gray-800">ข้อมูลอื่น ๆ </b>
                  <span className="text-gray-600">
                    เช่น รูปภาพ ภาพเคลื่อนไหว
                    และข้อมูลอื่นใดที่ถือว่าเป็นข้อมูลส่วนบุคคลตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
                    เราจะเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลอ่อนไหว
                    ดังต่อไปนี้ เมื่อเราได้รับความยินยอมโดยชัดแจ้งจากคุณ
                    เว้นแต่กฎหมายกำหนดให้ทำได้
                  </span>
                </p>
              </div>

              <ul className="list-disc list-inside ml-2 mt-3 space-y-1">
                <li>
                  <b className="text-gray-800">เชื้อชาติ</b>
                  <p className="ml-5 text-gray-600">
                    ข้อมูลอื่นใดที่กระทบต่อข้อมูลส่วนบุคคลของคุณตามที่คณะกรรมการคุ้มครองข้อมูลส่วนบุคคลประกาศกำหนด
                  </p>
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-base">
                ผู้เยาว์
              </h4>
              <p className="text-gray-600">
                หากคุณมีอายุต่ำกว่า 20 ปีหรือมีข้อจำกัดความสามารถตามกฎหมาย
                เราอาจเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของคุณ
                เราอาจจำเป็นต้องให้พ่อแม่หรือผู้ปกครองของคุณให้ความยินยอมหรือที่กฎหมายอนุญาตให้ทำได้
                หากเราทราบว่ามีการเก็บรวบรวมข้อมูลส่วนบุคคลจากผู้เยาว์โดยไม่ได้รับความยินยอมจากพ่อแม่หรือผู้ปกครอง
                เราจะดำเนินการลบข้อมูลนั้นออกจากเซิร์ฟเวอร์ของเรา
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-base">
                วิธีการเก็บรักษาข้อมูลส่วนบุคคล
              </h4>
              <p className="text-gray-600 mb-2">
                เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณในรูปแบบเอกสารและรูปแบบอิเล็กทรอนิกส์
                เราเก็บรักษาข้อมูลส่วนบุคคลของคุณ ดังต่อไปนี้
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                <li>เซิร์ฟเวอร์บริษัทของเราในประเทศไทย</li>
              </ul>

              <h4 className="font-semibold text-gray-800 mb-2 text-base mt-4">
                การประมวลผลข้อมูลส่วนบุคคล
              </h4>
              <p className="text-gray-600 mb-2">
                เราจะเก็บรวบรวม ใช้
                หรือเปิดเผยข้อมูลส่วนบุคคลของคุณเพื่อวัตถุประสงค์ดังต่อไปนี้
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                <li>เพื่อสร้างและจัดการบัญชีผู้ใช้งาน</li>
                <li>เพื่อจัดส่งสินค้าหรือบริการ</li>
                <li>เพื่อปรับปรุงสินค้า บริการ หรือประสบการณ์การใช้งาน</li>
                <li>เพื่อการบริหารจัดการภายในบริษัท</li>
                <li>เพื่อการตลาดและการส่งเสริมการขาย</li>
                <li>เพื่อการบริการหลังการขาย</li>
                <li>เพื่อรวบรวมข้อเสนอแนะ</li>
                <li>เพื่อชำระค่าสินค้าหรือบริการ</li>
                <li>
                  เพื่อปฏิบัติตามข้อตกลงและเงื่อนไข (Terms and Conditions)
                </li>
                <li>เพื่อปฏิบัติตามกฎหมายและกฎระเบียบของหน่วยงานราชการ</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-base">
                ระยะเวลาจัดเก็บข้อมูลส่วนบุคคล
              </h4>
              <p className="text-gray-600">
                เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณไว้ตามระยะเวลาที่จำเป็นในระหว่างที่คุณเป็นลูกค้าหรือมีความสัมพันธ์อยู่กับเราหรือตลอดระยะเวลาที่จำเป็นเพื่อให้บรรลุวัตถุประสงค์ที่เกี่ยวข้องกับนโยบายฉบับนี้
                ซึ่งอาจจำเป็นต้องเก็บรักษาไว้ต่อไปภายหลังจากนั้น
                หากมีกฎหมายกำหนดไว้ เราจะลบ ทำลาย
                หรือทำให้เป็นข้อมูลที่ไม่สามารถระบุตัวตนของคุณได้
                เมื่อหมดความจำเป็นหรือสิ้นสุดระยะเวลาดังกล่าว
              </p>

              <h4 className="font-semibold text-gray-800 mb-2 text-base mt-4">
                สิทธิของเจ้าของข้อมูลส่วนบุคคล
              </h4>
              <p className="text-gray-600 mb-3">
                ภายใต้กฎหมายคุ้มครองข้อมูลส่วนบุคคล
                คุณมีสิทธิในการดำเนินการดังต่อไปนี้
              </p>
              <div className="space-y-3 bg-white p-4 rounded-lg">
                <p className="text-gray-600">
                  <b className="text-gray-800">
                    สิทธิขอถอนความยินยอม (right to withdraw consent)
                  </b>{" "}
                  หากคุณได้ให้ความยินยอม เราจะเก็บรวบรวม ใช้
                  หรือเปิดเผยข้อมูลส่วนบุคคลของคุณ
                  ไม่ว่าจะเป็นความยินยอมที่คุณให้ไว้ก่อนวันที่กฎหมายคุ้มครองข้อมูลส่วนบุคคลใช้บังคับหรือหลังจากนั้น
                  คุณมีสิทธิที่จะถอนความยินยอมเมื่อใดก็ได้ตลอดเวลา
                </p>
                <p className="text-gray-600">
                  <b className="text-gray-800">
                    สิทธิขอเข้าถึงข้อมูล (right to access){" "}
                  </b>
                  คุณมีสิทธิขอเข้าถึงข้อมูลส่วนบุคคลของคุณที่อยู่ในความรับผิดชอบของเราและขอให้เราทำสำเนาข้อมูลดังกล่าวให้แก่คุณ
                  รวมถึงขอให้เราเปิดเผยว่าเราได้ข้อมูลส่วนบุคคลของคุณมาได้อย่างไร
                </p>
                <p className="text-gray-600">
                  <b className="text-gray-800">
                    สิทธิขอถ่ายโอนข้อมูล (right to data portability){" "}
                  </b>
                  คุณมีสิทธิขอรับข้อมูลส่วนบุคคลของคุณในกรณีที่เราได้จัดทำข้อมูลส่วนบุคคลนั้นอยู่ในรูปแบบให้สามารถอ่านหรือใช้งานได้ด้วยเครื่องมือหรืออุปกรณ์ที่ทำงานได้โดยอัตโนมัติและสามารถใช้หรือเปิดเผยข้อมูลส่วนบุคคลได้ด้วยวิธีการอัตโนมัติ
                  รวมทั้งมีสิทธิขอให้เราส่งหรือโอนข้อมูลส่วนบุคคลในรูปแบบดังกล่าวไปยังผู้ควบคุมข้อมูลส่วนบุคคลอื่นเมื่อสามารถทำได้ด้วยวิธีการอัตโนมัติ
                  และมีสิทธิขอรับข้อมูลส่วนบุคคลที่เราส่งหรือโอนข้อมูลส่วนบุคคลในรูปแบบดังกล่าวไปยังผู้ควบคุมข้อมูลส่วนบุคคลอื่นโดยตรง
                  เว้นแต่ไม่สามารถดำเนินการได้เพราะเหตุทางเทคนิค
                </p>
                <p className="text-gray-600">
                  <b className="text-gray-800">
                    สิทธิขอคัดค้าน (right to object)
                  </b>{" "}
                  คุณมีสิทธิขอคัดค้านการเก็บรวบรวม ใช้
                  หรือเปิดเผยข้อมูลส่วนบุคคลของคุณในเวลาใดก็ได้ หากการเก็บรวบรวม
                  ใช้
                  หรือเปิดเผยข้อมูลส่วนบุคคลของคุณที่ทำขึ้นเพื่อการดำเนินงานที่จำเป็นภายใต้ประโยชน์โดยชอบด้วยกฎหมายของเราหรือของบุคคลหรือนิติบุคคลอื่น
                  โดยไม่เกินขอบเขตที่คุณสามารถคาดหมายได้อย่างสมเหตุสมผลหรือเพื่อดำเนินการตามภารกิจเพื่อสาธารณประโยชน์
                </p>
                <p className="text-gray-600">
                  <b className="text-gray-800">
                    สิทธิขอให้ลบหรือทำลายข้อมูล (right to erasure/destruction)
                  </b>{" "}
                  คุณมีสิทธิขอลบหรือทำลายข้อมูลส่วนบุคคลของคุณหรือทำให้ข้อมูลส่วนบุคคลเป็นข้อมูลที่ไม่สามารถระบุตัวคุณได้
                  หากคุณเชื่อว่าข้อมูลส่วนบุคคลของคุณถูกเก็บรวบรวม ใช้
                  หรือเปิดเผยโดยไม่ชอบด้วยกฎหมายที่เกี่ยวข้องหรือเห็นว่าเราหมดความจำเป็นในการเก็บรักษาไว้ตามวัตถุประสงค์ที่เกี่ยวข้องในนโยบายฉบับนี้
                  หรือเมื่อคุณได้ใช้สิทธิขอถอนความยินยอมหรือใช้สิทธิขอคัดค้านตามที่แจ้งไว้ข้างต้นแล้ว
                </p>
                <p className="text-gray-600">
                  <b className="text-gray-800">
                    สิทธิขอให้ระงับการใช้ข้อมูล (right to restriction of
                    processing){" "}
                  </b>
                  คุณมีสิทธิขอให้ระงับการใช้ข้อมูลส่วนบุคคลชั่วคราวในกรณีที่เราอยู่ระหว่างตรวจสอบตามคำร้องขอใช้สิทธิขอแก้ไขข้อมูลส่วนบุคคลหรือขอคัดค้านของคุณหรือกรณีอื่นใดที่เราหมดความจำเป็นและต้องลบหรือทำลายข้อมูลส่วนบุคคลของคุณตามกฎหมายที่เกี่ยวข้องแต่คุณขอให้เราระงับการใช้แทน
                </p>
                <p className="text-gray-600">
                  <b className="text-gray-800">
                    สิทธิขอให้แก้ไขข้อมูล (right to rectification)
                  </b>{" "}
                  คุณมีสิทธิขอแก้ไขข้อมูลส่วนบุคคลของคุณให้ถูกต้อง เป็นปัจจุบัน
                  สมบูรณ์ และไม่ก่อให้เกิดความเข้าใจผิด
                </p>
                <p className="text-gray-600">
                  <b className="text-gray-800">
                    สิทธิร้องเรียน (right to lodge a complaint){" "}
                  </b>
                  คุณมีสิทธิร้องเรียนต่อผู้มีอำนาจตามกฎหมายที่เกี่ยวข้อง
                  หากคุณเชื่อว่าการเก็บรวบรวม ใช้
                  หรือเปิดเผยข้อมูลส่วนบุคคลของคุณ
                  เป็นการกระทำในลักษณะที่ฝ่าฝืนหรือไม่ปฏิบัติตามกฎหมายที่เกี่ยวข้อง
                </p>
              </div>
              <p className="text-gray-600 mt-3">
                คุณสามารถใช้สิทธิของคุณในฐานะเจ้าของข้อมูลส่วนบุคคลข้างต้นได้
                โดยติดต่อมาที่เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของเราตามรายละเอียดท้ายนโยบายนี้
                เราจะแจ้งผลการดำเนินการภายในระยะเวลา 30 วัน
                นับแต่วันที่เราได้รับคำขอใช้สิทธิจากคุณ
                ตามแบบฟอร์มหรือวิธีการที่เรากำหนด ทั้งนี้
                หากเราปฏิเสธคำขอเราจะแจ้งเหตุผลของการปฏิเสธให้คุณทราบผ่านช่องทางต่าง
                ๆ เช่น ข้อความ (SMS) อีเมล โทรศัพท์ จดหมาย เป็นต้น
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-base">
                การโฆษณาและการตลาด
              </h4>
              <p className="text-gray-600">
                เราอาจส่งข้อมูลหรือจดหมายข่าวไปยังอีเมลของคุณ
                โดยมีวัตถุประสงค์เพื่อเสนอสิ่งที่น่าสนกับคุณ
                หากคุณไม่ต้องการรับการติดต่อสื่อสารจากเราผ่านทางอีเมลอีกต่อไป
                คุณสามารถกด "ยกเลิกการติดต่อ"
                ในลิงก์อีเมลหรือติดต่อมายังอีเมลของเราได้
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-base">
                เทคโนโลยีติดตามตัวบุคคล (Cookies)
              </h4>
              <p className="text-gray-600">
                เพื่อเพิ่มประสบการณ์การใช้งานของคุณให้สมบูรณ์และมีประสิทธิภาพมากขึ้น
                เราใช้คุกกี้ (Cookies)หรือเทคโนโลยีที่คล้ายคลึงกัน
                เพื่อพัฒนาการเข้าถึงสินค้าหรือบริการ โฆษณาที่เหมาะสม
                และติดตามการใช้งานของคุณ
                เราใช้คุกกี้เพื่อระบุและติดตามผู้ใช้งานเว็บไซต์และการเข้าถึงเว็บไซต์ของเรา
                หากคุณไม่ต้องการให้มีคุกกี้ไว้ในคอมพิวเตอร์ของคุณ
                คุณสามารถตั้งค่าบราวเซอร์เพื่อปฏิเสธคุกกี้ก่อนที่จะใช้เว็บไซต์ของเราได้
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-base">
                การรักษาความมั่งคงปลอดภัยของข้อมูลส่วนบุคคล
              </h4>
              <p className="text-gray-600">
                เราจะรักษาความมั่นคงปลอดภัยของข้อมูลส่วนบุคคลของคุณไว้ตามหลักการ
                การรักษาความลับ (confidentiality) ความถูกต้องครบถ้วน (integrity)
                และสภาพพร้อมใช้งาน (availability) ทั้งนี้ เพื่อป้องกันการสูญหาย
                เข้าถึง ใช้ เปลี่ยนแปลง แก้ไข หรือเปิดเผย
                นอกจากนี้เราจะจัดให้มีมาตรการรักษาความมั่นคงปลอดภัยของข้อมูลส่วนบุคคล
                ซึ่งครอบคลุมถึงมาตรการป้องกันด้านการบริหารจัดการ (administrative
                safeguard) มาตรการป้องกันด้านเทคนิค (technical safeguard)
                และมาตรการป้องกันทางกายภาพ (physical safeguard)
                ในเรื่องการเข้าถึงหรือควบคุมการใช้งานข้อมูลส่วนบุคคล (access
                control)
              </p>

              <h4 className="font-semibold text-gray-800 mb-2 text-base mt-4">
                การแจ้งเหตุละเมิดข้อมูลส่วนบุคคล
              </h4>
              <p className="text-gray-600">
                ในกรณีที่มีเหตุละเมิดข้อมูลส่วนบุคคลของคุณเกิดขึ้น
                เราจะแจ้งให้สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลทราบโดยไม่ชักช้าภายใน
                72 ชั่วโมง นับแต่ทราบเหตุเท่าที่สามารถกระทำได้
                ในกรณีที่การละเมิดมีความเสี่ยงสูงที่จะมีผลกระทบต่อสิทธิและเสรีภาพของคุณ
                เราจะแจ้งการละเมิดให้คุณทราบพร้อมกับแนวทางการเยียวยาโดยไม่ชักช้าผ่านช่องทางต่าง
                ๆ เช่น เว็บไซต์ ข้อความ (SMS) อีเมล โทรศัพท์ จดหมาย เป็นต้น
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-base">
                การแก้ไขเปลี่ยนแปลงนโยบายความเป็นส่วนตัว
              </h4>
              <p className="text-gray-600">
                เราอาจแก้ไขเปลี่ยนแปลงนโยบายนี้เป็นครั้งคราว
                โดยคุณสามารถทราบข้อกำหนดและเงื่อนไขนโยบายที่มีการแก้ไขเปลี่ยนแปลงนี้ได้ผ่านทางเว็บไซต์ของเรา
                <br />
                <span className="text-amber-600 font-medium">
                  นโยบายนี้แก้ไขล่าสุดและมีผลใช้บังคับตั้งแต่วันที่ 20 ธันวาคม
                  2566
                </span>
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-base">
                นโยบายความเป็นส่วนตัวของเว็บไซต์อื่น
              </h4>
              <p className="text-gray-600">
                นโยบายความเป็นส่วนตัวฉบับนี้ใช้สำหรับการเสนอสินค้า บริการ
                และการใช้งานบนเว็บไซต์สำหรับลูกค้าของเราเท่านั้น
                หากคุณเข้าชมเว็บไซต์อื่นแม้จะผ่านช่องทางเว็บไซต์ของเรา
                การคุ้มครองข้อมูลส่วนบุคคลต่าง ๆ
                จะเป็นไปตามนโยบายความเป็นส่วนตัวของเว็บไซต์นั้น
                ซึ่งเราไม่มีส่วนเกี่ยวข้องด้วย
              </p>
            </div>
          </div>
          {/* footer */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-gray-800 mb-3 text-base">
              รายละเอียดการติดต่อ
            </h4>
            <p className="text-gray-600 mb-4">
              หากคุณต้องการสอบถามข้อมูลเกี่ยวกับนโยบายความเป็นส่วนตัวฉบับนี้
              รวมถึงการขอใช้สิทธิต่าง ๆ
              คุณสามารถติดต่อเราหรือเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของเราได้
              ดังนี้
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <b className="text-amber-700 text-sm">
                  ผู้ควบคุมข้อมูลส่วนบุคคล
                </b>
                <p className="text-gray-600 text-sm mt-2">
                  บริษัท โกลด์เด้น 99 จำกัด
                  <br />
                  15/1-3 อาคารอุดมสุขทาวเวอร์ ซ.อุดมสุข9 บางจาก พระโขนง
                  กรุงเทพมหานคร 10260
                  <br />
                  อีเมล gus_115@hotmail.co.th
                  <br />
                  เว็บไซต์ www.golden99.co.th
                  <br />
                  หมายเลขโทรศัพท์ 066-1606161
                </p>
              </div>
              {/* fix this display data */}
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <b className="text-amber-700 text-sm">
                  เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล
                </b>
                <p className="text-gray-600 text-sm mt-2">
                  นายนัฐกาญ จันทร์ขำ
                  <br />
                  15/1-3 อาคารอุดมสุขทาวเวอร์ ซ.อุดมสุข9 บางจาก พระโขนง
                  กรุงเทพมหานคร 10260
                  <br />
                  อีเมล gus_115@hotmail.co.th
                  <br />
                  หมายเลขโทรศัพท์ 066-1606161
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkbox - only enabled when scrolled to bottom */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="consent-checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={!hasScrolledToBottom}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label
          htmlFor="consent-checkbox"
          className={`text-sm ${
            hasScrolledToBottom ? "text-gray-700" : "text-gray-400"
          }`}
        >
          {t.consentLabel}
          {!hasScrolledToBottom && (
            <span className="block text-xs text-orange-600 mt-1">
              {t.mustScroll}
            </span>
          )}
        </label>
      </div>

      {/* Register Button */}
      <Button
        fullWidth
        onClick={handleRegister}
        disabled={!isChecked || !hasScrolledToBottom || isPending}
      >
        {isPending ? t.submitting : t.submit}
      </Button>
    </section>
  );
}

export default TermStep;
