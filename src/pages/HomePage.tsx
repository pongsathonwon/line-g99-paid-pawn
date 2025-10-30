import React from "react";

function HomePage() {
  return (
    <>
      <h3 className="font-semibold text-2xl text-center mb-6">รายการขายฝาก</h3>
      <div className="flex flex-col gap-4 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600">
              This is some sample content to demonstrate scrolling behavior.
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default HomePage;
