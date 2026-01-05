import { BellIcon, HistoryIcon, HomeIcon, ReceiptTextIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

function BottomNav() {
  return (
    <div className="bg-white shadow-base fixed bottom-0 left-0 w-screen flex justify-center">
      <nav className="container py-3 px-4 sm:px-8 lg:px-16">
        <ul className="flex justify-between items-center h-full">
          <li className="aspect-square w-10 lg:w-20 flex flex-col">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive
                  ? "flex flex-col justify-between h-full items-center text-brand-red text-[10px] lg:text-lg"
                  : "flex flex-col justify-between h-full items-center text-[10px] lg:text-lg"
              }
            >
              <HomeIcon />
              <span>หน้าหลัก</span>
            </NavLink>
          </li>
          <li className="aspect-square w-10 lg:w-20 flex flex-col">
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive
                  ? "flex flex-col justify-between h-full items-center text-brand-red text-[10px] lg:text-lg"
                  : "flex flex-col justify-between h-full items-center text-[10px] lg:text-lg"
              }
            >
              <HistoryIcon />
              <span>ประวัติ</span>
            </NavLink>
          </li>
          <li className="aspect-square w-10 lg:w-20 flex flex-col">
            <NavLink
              to="/term"
              className={({ isActive }) =>
                isActive
                  ? "flex flex-col justify-between h-full items-center text-brand-red text-[10px] lg:text-lg"
                  : "flex flex-col justify-between h-full items-center text-[10px] lg:text-lg"
              }
            >
              <ReceiptTextIcon />
              <span>เงื่อนไข</span>
            </NavLink>
          </li>
          <li className="aspect-square w-10 lg:w-20 flex flex-col">
            <NavLink
              to="/notification"
              className={({ isActive }) =>
                isActive
                  ? "flex flex-col justify-between h-full items-center text-brand-red text-[10px] lg:text-lg"
                  : "flex flex-col justify-between h-full items-center text-[10px] lg:text-lg"
              }
            >
              <BellIcon />
              <span>แจ้งเตือน</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BottomNav;
