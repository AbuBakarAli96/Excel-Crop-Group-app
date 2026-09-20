import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IconBell,
  IconLogout,
  IconMenu,
  IconGrid,
  IconInbox,
  IconMap,
  IconUsersGroup,
} from "../components/icons";
import {
  REGISTRATION_REQUESTS_CHANGED_EVENT,
  getPendingCount,
} from "../services/registrationService";

const LOGO_SRC = "/assets/excel-crop-group-logo.png";

const NAV_ITEMS = [
  { label: "Overview", path: "/admin-dashboard", icon: IconGrid, end: true },
  { label: "Registrations", path: "/admin-dashboard/registrations", icon: IconInbox, badge: true },
  { label: "Locations", path: "/admin-dashboard/locations", icon: IconMap },
  { label: "Users", path: "/admin-dashboard/users", icon: IconUsersGroup },
];

// ---------------------------------------------------------------------------
// Admin sidebar — same shell mechanics (and same 3-tier responsiveness) as
// the Manager DashboardLayout, but built on the orange accent instead of
// green so the two areas are visually distinct at a glance without
// introducing any color outside the existing palette.
// ---------------------------------------------------------------------------
const AdminSidebar: React.FC<{ onNavigate?: () => void; pendingCount: number }> = ({
  onNavigate,
  pendingCount,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin-login", { replace: true });
  };

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--o1)" }}>
      <div
        className="px-5 md:px-2 lg:px-5 py-5 flex items-center md:justify-center lg:justify-start gap-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,.2)" }}
      >
        <span className="ecg-logo-chip shrink-0" style={{ padding: "4px 6px" }}>
          <img
            src={LOGO_SRC}
            alt=""
            className="h-6 w-auto"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
        </span>
        <div className="leading-tight min-w-0 md:hidden lg:block">
          <div className="text-white font-extrabold text-[14px] truncate">Excel Crop Group</div>
          <div className="text-white/80 text-[11px] truncate">Admin Portal</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="flex flex-col">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                onClick={onNavigate}
                title={item.label}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 md:justify-center lg:justify-start px-5 md:px-0 lg:px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors relative",
                    isActive ? "bg-black/15" : "hover:bg-black/[.15]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-0 h-full w-[3px]" style={{ background: "var(--g1)" }} />
                    )}
                    <span className="relative shrink-0">
                      <item.icon size={17} className="text-white/90" />
                      {item.badge && pendingCount > 0 && (
                        <span
                          className="lg:hidden absolute -top-1 -right-1.5 h-2 w-2 rounded-full"
                          style={{ background: "var(--g1)" }}
                        />
                      )}
                    </span>
                    <span className="truncate md:hidden lg:inline">{item.label}</span>
                    {item.badge && pendingCount > 0 && (
                      <span
                        className="hidden lg:inline-flex ml-auto items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold text-white shrink-0"
                        style={{ background: "var(--g1)" }}
                      >
                        {pendingCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 md:px-2 lg:px-3 pb-3">
        <button
          onClick={handleLogout}
          title="Log Out"
          className="w-full flex items-center gap-3 md:justify-center lg:justify-start px-2.5 py-2.5 rounded-[8px] text-[13.5px] font-medium text-white/90 hover:bg-black/[.15] transition-colors"
        >
          <IconLogout size={17} className="shrink-0" />
          <span className="md:hidden lg:inline">Log Out</span>
        </button>
      </div>

      <div className="hidden lg:block px-5 py-3 text-[11px] text-white/75" style={{ background: "rgba(0,0,0,.2)" }}>
        <div>Admin Portal v0.1.0</div>
        <div>support@excelcropgroup.com.pk</div>
      </div>
    </div>
  );
};

const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const refresh = () => setPendingCount(getPendingCount());
    refresh();
    window.addEventListener(REGISTRATION_REQUESTS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(REGISTRATION_REQUESTS_CHANGED_EVENT, refresh);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      <aside className="hidden md:block md:w-[72px] lg:w-[236px] shrink-0">
        <div className="fixed top-0 left-0 h-screen md:w-[72px] lg:w-[236px]">
          <AdminSidebar pendingCount={pendingCount} />
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
          <div className="absolute top-0 left-0 h-full w-[80%] max-w-[280px] shadow-2xl">
            <AdminSidebar onNavigate={() => setMobileNavOpen(false)} pendingCount={pendingCount} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="sticky top-0 z-30 bg-white flex items-center justify-between gap-3 px-4 md:px-6 py-3"
          style={{ boxShadow: "0 2px 10px rgba(0,0,0,.08)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden text-[var(--o1)] shrink-0"
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
            <span
              className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0"
              style={{ background: "#fff0e6", color: "var(--o1)" }}
            >
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <span className="relative text-[var(--txt2)]">
              <IconBell size={19} />
              {pendingCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{ background: "var(--o1)" }}
                />
              )}
            </span>
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
                  style={{ background: "#fff0e6", color: "var(--o1)" }}
                >
                  Admin
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 ecg-pattern-dots-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
