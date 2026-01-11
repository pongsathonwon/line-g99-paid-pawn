import { Outlet } from "react-router-dom";
import ProfileBadge from "@/component/ui/ProfileBadge";
import BottomNav from "@/component/ui/BottomNav";
import { useLineContext } from "@/context/LineContext/LineContext";

function MainLayout() {
  const { lineCtx } = useLineContext();
  const displayName = lineCtx?.profile?.displayName ?? "ไม่พบชื่อในระบบ";
  const pictureUrl =
    lineCtx?.profile?.pictureUrl ??
    "https://fastly.picsum.photos/id/962/200/200.jpg?hmac=XehF7z9JYkgC-2ZfSP05h7eyumIq9wNKUDoCLklIhr4";
  return (
    <>
      <ProfileBadge displayName={displayName} pictureUrl={pictureUrl} />
      <section className="overflow-hidden px-4 sm:px-8 pt-content-top pb-content-bottom lg:px-16 lg:pb-content-bottom-lg lg:pt-content-top-lg">
        <Outlet />
      </section>
      <BottomNav />
    </>
  );
}

export default MainLayout;
