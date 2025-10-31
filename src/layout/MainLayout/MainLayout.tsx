import React from "react";
import { Outlet } from "react-router-dom";
import ProfileBadge from "@/component/ui/ProfileBadge";
import BottomNav from "@/component/ui/BottomNav";

function MainLayout() {
  return (
    <>
      <ProfileBadge displayName="display name here" />
      <section className="overflow-hidden px-4 py-4 sm:px-8">
        <Outlet />
      </section>
      <BottomNav />
    </>
  );
}

export default MainLayout;
