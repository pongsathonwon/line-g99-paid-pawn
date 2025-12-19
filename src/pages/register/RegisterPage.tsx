import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ลงทะเบียน</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/thai-register" className="text-blue-400 underline">
            ลูกค้าไทย ลงทะเบียนออนไลน์
          </Link>

          <Link to="/foreign-register" className="text-blue-400 underline">
            ลูกค้าต่างชาติ ลงทะเบียนผ่านเบอร์โทรศัพท์
          </Link>
          <Link
            to="/foreign-counter-register"
            className="text-blue-400 underline"
          >
            ลูกค้าต่างชาติ ลงทะเบียนหน้าร้าน
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            สิ่งที่ต้องเตรียม
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="ps-4">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <strong>เอกสารยืนยันตัวตน</strong>
                <span className="col-start-2 -col-end-1">
                  เลขประจำตัวประชาชน รหัสลูกค้า หรือเบอร์โทรศัพท์ลงทะเบียน
                </span>
              </div>
            </li>
            <li className="ps-4">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <strong>เบอร์โทรศัพท์มือถือ</strong>
                <span className="col-start-2 -col-end-1">
                  ยืนยันตัวตนผ่าน otp
                </span>
              </div>
            </li>
            <li className="ps-4">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <strong>ยืนยันตัวตน</strong>
                <span className="col-start-2 -col-end-1">
                  กรณีไม่สามารถยืนยัน opt ได้ ลงทะเบียนผ่านหน้าร้าน
                </span>
              </div>
            </li>
          </ul>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>
            ความช่วยเหลือ{" "}
            <a href="#" className="text-brand-red hover:underline font-medium">
              ติดต่อเรา
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
