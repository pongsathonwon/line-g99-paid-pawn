import { Outlet } from "react-router-dom";
import ProfileBadge from "@/component/ui/ProfileBadge";
import BottomNav from "@/component/ui/BottomNav";
import { useLineContext } from "@/context/LineContext/LineContext";

function MainLayout() {
  const { lineCtx } = useLineContext();
  return (
    <>
      <ProfileBadge
        displayName={lineCtx?.profile?.displayName ?? "display name here"}
        pictureUrl={lineCtx?.profile?.pictureUrl}
      />
      <section className="overflow-hidden px-4 sm:px-8 pt-content-top pb-content-bottom">
        <Outlet />
      </section>
      <BottomNav />
    </>
  );
}

export default MainLayout;
