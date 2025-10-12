import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import RBACTab from "./components/RBACTab";
import AuditTab from "./components/AuditTab";
import BorderMgtTab from "./components/BorderMgtTab";
import PermissionsTab from "./components/PermissionTab";
import { Users, FileText, Globe } from "lucide-react";
// import { useRoleListQuery } from "../../../hooks/useRoleHooks";

type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  Component: React.FC;
};

const tabs: Tab[] = [
  { id: "rbac", label: "RBAC", icon: <Users className="w-4 h-4" />, Component: RBACTab },
  { id: "permissions", label: "Permissions", icon: <Users className="w-4 h-4" />, Component: PermissionsTab },
  { id: "audit", label: "Audit", icon: <FileText className="w-4 h-4" />, Component: AuditTab },
  { id: "border", label: "Border Mgt", icon: <Globe className="w-4 h-4" />, Component: BorderMgtTab },
];

export default function AdminDashboardTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    tabRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const count = tabs.length;
    if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % count);
    else if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + count) % count);
    else if (e.key === "Home") setActiveIndex(0);
    else if (e.key === "End") setActiveIndex(count - 1);
  };

  return (
    <div>
      {/* Scrollable Tab List */}
      <nav role="tablist" aria-label="Admin dashboard tabs" className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-2 mb-4">
        {tabs.map((tab, idx) => {
          const selected = idx === activeIndex;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              ref={(el) => (tabRefs.current[idx] = el)}
              onClick={() => setActiveIndex(idx)}
              onKeyDown={onKeyDown}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                selected ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Tab Panels with Fade Animation */}
      <div className="relative">
        {tabs.map((tab, idx) => {
          const visible = idx === activeIndex;
          return (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={`transition-opacity duration-300 ${visible ? "opacity-100 block" : "opacity-0 absolute inset-0 pointer-events-none"}`}
            >
              <tab.Component />
            </div>
          );
        })}
      </div>
    </div>
  );
}
