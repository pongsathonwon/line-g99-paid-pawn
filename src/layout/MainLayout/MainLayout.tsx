import { Outlet } from "react-router-dom";
import ProfileBadge from "@/component/ui/ProfileBadge";
import BottomNav from "@/component/ui/BottomNav";
import { useLineContext } from "@/context/LineContext/LineContext";
import { useAuthContext } from "@/context/AuthContext/AuthContext";

function MainLayout() {
  const { lineCtx } = useLineContext();
  const pictureUrl =
    lineCtx?.profile?.pictureUrl ??
    "https://fastly.picsum.photos/id/962/200/200.jpg?hmac=XehF7z9JYkgC-2ZfSP05h7eyumIq9wNKUDoCLklIhr4";
  const { auth } = useAuthContext();
  const fullname = auth?.fullname ?? "ไม่พบชื่อในระบบ";
  return (
    <>
      <ProfileBadge displayName={fullname} pictureUrl={pictureUrl} />
      <section className="overflow-hidden px-4 sm:px-8 pt-content-top pb-content-bottom lg:px-16 lg:pb-content-bottom-lg lg:pt-content-top-lg">
        <Outlet />
      </section>
      <BottomNav />
    </>
  );
}

export default MainLayout;
