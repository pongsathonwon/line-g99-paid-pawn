import RegisterCard from "@/component/ui/RegisterForm/RegisterCard/RegisterCard";
function RegisterPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <header className="flex justify-center h-16 border-b bg-white">
        <img src="\logo\logo.png" className="h-15" />
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ลงทะเบียน</h1>
          <p className="text-gray-600">เลือกรูปแบบการลงทะเบียนที่เหมาะกับคุณ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <RegisterCard
            to="/thai-register"
            title="ลูกค้าไทย"
            description="ลงทะเบียนออนไลน์"
            highlight
          />

          <RegisterCard
            to="/foreign-register"
            title="Foreign Customer"
            description="Register with mobile number"
          />

          <RegisterCard
            to="/foreign-counter-register"
            title="Foreign Customer"
            description="Register at G99 counter"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-md border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            สิ่งที่ต้องเตรียม
          </h3>

          <ul className="space-y-4 text-sm text-gray-700 mb-6">
            <li>
              <strong className="block">เอกสารยืนยันตัวตน</strong>
              เลขประจำตัวประชาชน / รหัสลูกค้า / เบอร์โทรศัพท์
            </li>
            <li>
              <strong className="block">เบอร์โทรศัพท์มือถือ</strong>
              ใช้สำหรับยืนยันตัวตนผ่าน OTP
            </li>
            <li>
              <strong className="block">การยืนยันตัวตน</strong>
              หากไม่สามารถยืนยัน OTP ได้ กรุณาลงทะเบียนที่หน้าร้าน
            </li>
          </ul>

          <div className="border-t border-gray-200 my-6" />

          <h4 className="text-base font-semibold text-gray-900 mb-3">
            For Foreign Customers
          </h4>

          <ul className="space-y-4 text-sm text-gray-700">
            <li>
              <strong className="block">Identity Information</strong>
              Passport, customer code, or registered mobile number
            </li>
            <li>
              <strong className="block">Mobile Phone</strong>
              Used for OTP verification
            </li>
            <li>
              <strong className="block">In-store Registration</strong>
              If OTP verification is not possible, please register at our store
            </li>
          </ul>
        </div>

        <div className="text-center text-sm text-gray-600">
          ต้องการความช่วยเหลือ?{" "}
          <a href="#" className="text-brand-red font-medium hover:underline">
            ติดต่อเรา
          </a>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
