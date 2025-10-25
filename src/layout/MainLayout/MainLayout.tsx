import React from "react";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <section>
      <div> main layout here</div>
      <div>
        <Outlet />
      </div>
      <nav>bottm navigation</nav>
    </section>
  );
}

export default MainLayout;
