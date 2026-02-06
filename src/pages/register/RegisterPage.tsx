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
            description="ยืนยันตัวตนผ่านโทรศัพท์มือถือ"
            highlight
          />

          <RegisterCard
            to="/foreign-register"
            title="ลูกค้าชาวต่างชาติ"
            description="ยืนยันตัวตนผ่านโทรศัพท์มือถือ"
          />

          <RegisterCard
            to="/foreign-counter-register"
            title="ลูกค้าชาวต่างชาติ"
            description="ยืนยันตัวตนผ่านหน้าสาขา"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-md border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            สิ่งที่ต้องเตรียม
          </h3>

          <ul className="space-y-4 text-sm text-gray-700 mb-6">
            <li>
              <strong className="block">เอกสารยืนยันตัวตน</strong>
              เลขประจำตัวประชาชน / รหัสลูกค้า
            </li>
            <li>
              <strong className="block">เบอร์โทรศัพท์มือถือ</strong>
              ใช้สำหรับยืนยันตัวตนผ่าน OTP
            </li>
            <li>
              <strong className="block">การยืนยันตัวตน</strong>
              หากไม่สามารถยืนยัน OTP ได้ หรือเปลี่ยนเบอร์โทรศัพท์
              กรุณาลงทะเบียนที่หน้าร้าน
            </li>
          </ul>
        </div>

        <div className="text-center text-sm text-gray-600">
          ต้องการความช่วยเหลือ{" "}
          <span className="text-brand-red font-medium hover:underline">
            ติดต่อเรา
          </span>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
