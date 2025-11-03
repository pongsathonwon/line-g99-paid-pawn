import React from "react";
import { BellIcon, HistoryIcon, HomeIcon, ReceiptTextIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

function BottomNav() {
  return (
    <nav className=" bg-white shadow-base fixed bottom-0 left-0 w-full py-3 px-4 sm:px-8">
      <ul className="flex justify-between items-center h-full">
        <li className="aspect-square w-10">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col justify-center items-center text-brand-red"
                : "flex flex-col justify-center items-center"
            }
          >
            <HomeIcon />
            <span className=" text-[10px]">หน้าหลัก</span>
          </NavLink>
        </li>
        <li className="aspect-square w-10">
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col justify-center items-center text-brand-red"
                : "flex flex-col justify-center items-center"
            }
          >
            <HistoryIcon />
            <span className=" text-[10px]">ประวัติ</span>
          </NavLink>
        </li>
        <li className="aspect-square w-10">
          <NavLink
            to="/term"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col justify-center items-center text-brand-red"
                : "flex flex-col justify-center items-center"
            }
          >
            <ReceiptTextIcon />
            <span className=" text-[10px]">เงื่อนไข</span>
          </NavLink>
        </li>
        <li className="aspect-square w-10">
          <NavLink
            to="/notification"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col justify-center items-center text-brand-red"
                : "flex flex-col justify-center items-center"
            }
          >
            <BellIcon />
            <span className=" text-[10px]">แจ้งเตือน</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default BottomNav;
