import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
// import SidebarLinkGroup from "./SidebarLinkGroup";
import clsx from "clsx";

import Logo from "@/assets/logo.png";
import HomeIcon from "@/assets/homeIcon.png";
import PaymentIcon from "@/assets/paymentIcon.png";
import TenantIcon from "@/assets/tenantIcon.png";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  exact?: boolean;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: HomeIcon, exact: true },
  { label: "Examination", path: "/dashboard/examination", icon: PaymentIcon },
  { label: "Examinee", path: "/dashboard/examinee", icon: TenantIcon }
  
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  // const { pathname } = useLocation();

  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);

  const [sidebarExpanded] = useState<boolean>(() => {
    return localStorage.getItem("sidebar-expanded") === "true";
  });

  // Handle outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        sidebarOpen &&
        !sidebar.current.contains(e.target as Node) &&
        !trigger.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [sidebarOpen, setSidebarOpen]);

  // Handle Esc key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (sidebarOpen && e.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [sidebarOpen, setSidebarOpen]);

  // Persist expanded state
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", String(sidebarExpanded));
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={clsx(
        "fixed left-0 top-0 z-50 flex  flex-col overflow-y-hidden bg-green-900 h-full duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-12" />
          <span className="text-white font-bold text-3xl shadow-2xl">
            CDCFIB
          </span>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 8.175H2.987L9.362 1.688a.75.75 0 1 0-1.2-.9L.4 8.363a.75.75 0 0 0 0 1.2l7.762 7.875a.75.75 0 1 0 1.2-.9L3.025 9.863H19a.75.75 0 0 0 0-1.5Z" />
          </svg>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="flex flex-col gap-1.5">
          {menuItems.map(({ label, path, icon, exact }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={exact}
                className={({ isActive }) =>
                  clsx(
                    "group flex items-center gap-2.5 rounded-tl-lg rounded-br-lg sm:px-4 py-2 text-[16px] font-medium text-bodydark1 duration-300 ease-in-out hover:bg-green-800 dark:hover:bg-meta-4",
                    isActive && "bg-[#0b7c3e] text-black dark:bg-meta-4"
                  )
                }
              >
                <img src={icon} alt={label} className="w-5 h-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
