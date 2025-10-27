import React from "react";

function HomePage() {
  return (
    <div>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="bg-gray-100 p-4 mb-3 rounded-lg">
          <h3 className="font-semibold">Content Block {i + 1}</h3>
          <p className="text-gray-600">
            This is some sample content to demonstrate scrolling behavior.
          </p>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
