import { Outlet } from "react-router-dom";
import ProfileBadge from "@/component/ui/ProfileBadge";
import BottomNav from "@/component/ui/BottomNav";

function MainLayout() {
  return (
    <>
      <ProfileBadge displayName="display name here" />
      <section className="overflow-hidden px-4 sm:px-8 pt-content-top pb-content-bottom lg:px-16 lg:pb-content-bottom-lg lg:pt-content-top-lg">
        <Outlet />
      </section>
      <BottomNav />
    </>
  );
}

export default MainLayout;
