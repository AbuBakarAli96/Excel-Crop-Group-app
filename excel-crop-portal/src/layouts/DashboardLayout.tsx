import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABEL } from "../types/auth";
import { getNavItemsForRole } from "../config/navigation";
import { IconBell, IconLogout, IconMenu } from "../components/icons";

const LOGO_SRC = "/assets/excel-crop-group-logo.png";

const SidebarContent: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const items = getNavItemsForRole(user.role);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--g2)" }}>
      {/* Sidebar brand header */}
      <div className="px-5 py-5 flex items-center gap-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,.15)" }}>
        <span className="ecg-logo-chip shrink-0" style={{ padding: "4px 6px" }}>
          <img
            src={LOGO_SRC}
            alt=""
            className="h-6 w-auto"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
        </span>
        <div className="leading-tight min-w-0">
          <div className="text-white font-extrabold text-[14px] truncate">Excel Crop Group</div>
          <div className="text-white/70 text-[11px] truncate">Sales Order Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors relative",
                    isActive ? "bg-black/15" : "hover:bg-black/[.18]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className="absolute left-0 top-0 h-full w-[3px]"
                        style={{ background: "var(--o1)" }}
                      />
                    )}
                    <item.icon size={17} className="text-white/90 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-[8px] text-[13.5px] font-medium text-white/90 hover:bg-black/[.18] transition-colors"
        >
          <IconLogout size={17} />
          Log Out
        </button>
      </div>

      {/* Footer block — app version + support, dark green per brand */}
      <div className="px-5 py-3 text-[11px] text-white/70" style={{ background: "#123a1e" }}>
        <div>App v0.1.0</div>
        <div>Support: support@excelcropgroup.com.pk</div>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-[236px] shrink-0">
        <div className="fixed top-0 left-0 h-screen w-[236px]">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-0 left-0 h-full w-[80%] max-w-[280px] shadow-2xl">
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 bg-white flex items-center justify-between gap-3 px-4 md:px-6 py-3"
          style={{ boxShadow: "0 2px 10px rgba(0,0,0,.08)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden text-[var(--g1)] shrink-0"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu size={22} />
            </button>
            <img
              src={LOGO_SRC}
              alt="Excel Crop Group"
              className="hidden sm:block h-7 w-auto shrink-0"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
            />
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <button
              className="relative text-[var(--txt2)] hover:text-[var(--g1)] transition-colors"
              aria-label="Notifications"
            >
              <IconBell size={19} />
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ background: "var(--o1)" }}
              />
            </button>
            <div className="flex items-center gap-2.5">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                style={{ background: "var(--g1)" }}
              >
                {user?.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-[13px] font-semibold text-[var(--txt)]">{user?.name}</div>
                <div
                  className="inline-block mt-0.5 px-2 py-[1px] rounded-full text-[10.5px] font-semibold"
                  style={{ background: "var(--g3)", color: "var(--g1)" }}
                >
                  {user ? ROLE_LABEL[user.role] : ""}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 ecg-pattern-dots-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
