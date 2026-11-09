import { Outlet } from "react-router-dom";
import { useSession } from "@/context/SessionContext/SessionContext";
import ProfileBadge from "@/component/ui/ProfileBadge";
import BottomNav from "@/component/ui/BottomNav";

function MainLayout() {
  const { lineProfile, auth } = useSession();
  const pictureUrl =
    lineProfile?.pictureUrl ??
    "https://fastly.picsum.photos/id/962/200/200.jpg?hmac=XehF7z9JYkgC-2ZfSP05h7eyumIq9wNKUDoCLklIhr4";
  const fullname = auth?.fullname ?? "ไม่พบชื่อในระบบ";
  const custNo = auth?.custNo ?? "ไม่พบรหัสลูกค้าในระบบ";
  return (
    <>
      <ProfileBadge
        displayName={fullname}
        pictureUrl={pictureUrl}
        custNo={custNo}
      />
      <section className="overflow-hidden px-4 sm:px-8 pt-content-top pb-content-bottom lg:px-16 lg:pb-content-bottom-lg lg:pt-content-top-lg">
        <Outlet />
      </section>
      <BottomNav />
    </>
  );
}

export default MainLayout;
