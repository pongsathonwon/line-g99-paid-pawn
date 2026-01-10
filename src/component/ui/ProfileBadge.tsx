import { useLineContext } from "@/context/LineContext/LineContext";

function ProfileBadge() {
  const { lineCtx } = useLineContext();
  const displayName = lineCtx?.profile?.displayName ?? "ไม่พบชื่อในระบบ";
  const pictureUrl =
    lineCtx?.profile?.pictureUrl ??
    "https://fastly.picsum.photos/id/962/200/200.jpg?hmac=XehF7z9JYkgC-2ZfSP05h7eyumIq9wNKUDoCLklIhr4";
  return (
    <header className="fixed top-0 left-0 w-full h-(--header-height) overflow-hidden bg-white">
      <div className="relative -z-10">
        <svg
          className="absolute"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          style={{ transform: "rotate(180deg)" }}
        >
          <defs>
            <linearGradient
              id="redGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#4C0101", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#B20202", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q300,20 600,100 T1200,100 L1200,300 L0,300 Z"
            fill="url(#redGradient)"
          />
        </svg>
      </div>
      <div className="container mx-auto mt-auto h-full p-4 sm:px-8 lg:px-16">
        <div className="flex flex-col h-full justify-between">
          <div className="flex gap-1.5 backdrop-blur-xs p-1 bg-white/5 w-fit rounded-lg">
            <img
              className="rounded-full aspect-squre size-16 sm:size-24"
              src={pictureUrl}
              alt="profile"
            />
            <div className="flex flex-col justify-center">
              <h2 className="text-sm font-bold">ยินดีต้อนรับ</h2>
              <span className="text-sm">{displayName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ProfileBadge;
