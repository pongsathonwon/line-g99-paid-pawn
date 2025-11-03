import React, { type PropsWithChildren } from "react";

type TProfileBadgeProps = {
  displayName: string;
  pictureUrl?: string;
} & PropsWithChildren;

function ProfileBadge({
  displayName,
  pictureUrl = "https://fastly.picsum.photos/id/962/200/200.jpg?hmac=XehF7z9JYkgC-2ZfSP05h7eyumIq9wNKUDoCLklIhr4",
}: TProfileBadgeProps) {
  return (
    <header className="bg-white flex px-4 py-4 h-[--header-height] fixed top-0 left-0 w-full sm:px-8 bg-[url(/layout/header_curve_small.png)] sm:bg-[url(/layout/header_curve.png)] bg-no-repeat bg-cover">
      <div className="flex flex-col h-32 sm:h-72 w-full justify-between">
        <div className="flex justify-between items-center">
          <div>left</div>
          <div>end</div>
        </div>
        <div className="flex gap-1.5">
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
    </header>
  );
}

export default ProfileBadge;
