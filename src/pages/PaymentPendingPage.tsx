import React from "react";

const PaymentPendingPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center p-6 fixed inset-0">
      <div className="bg-white w-11/12 sm:w-96 md:w-80 lg:w-96 rounded-2xl shadow-md flex flex-col items-center gap-8 py-12 px-6">
        <div className="relative flex justify-center items-center">
          <div
            className="w-20 h-20 rounded-full border-4 border-yellow-300 
                       border-t-transparent animate-spin"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-gray-700 text-lg font-medium">กำลังตรวจสอบ</p>
          <p className="text-gray-500 text-sm">การชำระเงินจากธนาคาร</p>
          <p className="text-yellow-500 text-sm font-medium">
            โปรดรอสักครู่ ระบบกำลังประมวลผล...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPendingPage;
