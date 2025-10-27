import React from "react";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0">
        <div>
          <h1>curvy curvy shomthing</h1>
        </div>
        header
      </header>
      <section className="flex-1">
        <Outlet />
      </section>
      <nav className="sticky bottom-0">bottm navigation</nav>
    </div>
  );
}

export default MainLayout;
