import type { PropsWithChildren } from "react";

type MobileLayoutProps = PropsWithChildren;

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-light-gray">
      {/* Max width container - centered on desktop */}
      <div className="mx-auto max-w-[430px] bg-white min-h-screen">
        {children}
      </div>
    </div>
  );
}
