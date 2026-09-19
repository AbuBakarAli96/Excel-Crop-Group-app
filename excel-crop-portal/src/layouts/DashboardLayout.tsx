import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABEL } from "../types/auth";
import { getNavItemsForRole } from "../config/navigation";
import { IconBell, IconLogout, IconMenu } from "../components/icons";
import {
  ACCESS_REQUESTS_CHANGED_EVENT,
  getAllRequests,
} from "../services/accessRequestService";
import type { AccessRequest } from "../types/accessRequest";

const LOGO_SRC = "/assets/excel-crop-group-logo.png";

// ---------------------------------------------------------------------------
// Sidebar — one component, three densities via responsive classes:
//   <768px  (mobile drawer, always full-width): labels shown
//   768–1023px (tablet, persistent icon rail): labels hidden
//   >=1024px (desktop, persistent full sidebar): labels shown
// The mobile drawer is only ever rendered below the md breakpoint, so the
// md:/lg: classes below only take effect on the persistent aside.
// ---------------------------------------------------------------------------
const SidebarContent: React.FC<{ onNavigate?: () => void; pendingAccessRequests: number }> = ({
  onNavigate,
  pendingAccessRequests,
}) => {
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
      <div
        className="px-5 md:px-2 lg:px-5 py-5 flex items-center md:justify-center lg:justify-start gap-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,.15)" }}
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
          <div className="text-white/70 text-[11px] truncate">Sales Order Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="flex flex-col">
          {items.map((item) => {
            const badgeCount = item.badgeKey === "pendingAccessRequests" ? pendingAccessRequests : 0;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onNavigate}
                  title={item.label}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 md:justify-center lg:justify-start px-5 md:px-0 lg:px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors relative",
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
                      <span className="relative shrink-0">
                        <item.icon size={17} className="text-white/90" />
                        {badgeCount > 0 && (
                          <span
                            className="lg:hidden absolute -top-1 -right-1.5 h-2 w-2 rounded-full"
                            style={{ background: "var(--o1)" }}
                          />
                        )}
                      </span>
                      <span className="truncate md:hidden lg:inline">{item.label}</span>
                      {badgeCount > 0 && (
                        <span
                          className="hidden lg:inline-flex ml-auto items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold text-white shrink-0"
                          style={{ background: "var(--o1)" }}
                        >
                          {badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 md:px-2 lg:px-3 pb-3">
        <button
          onClick={handleLogout}
          title="Log Out"
          className="w-full flex items-center gap-3 md:justify-center lg:justify-start px-2.5 py-2.5 rounded-[8px] text-[13.5px] font-medium text-white/90 hover:bg-black/[.18] transition-colors"
        >
          <IconLogout size={17} className="shrink-0" />
          <span className="md:hidden lg:inline">Log Out</span>
        </button>
      </div>

      {/* Footer block — app version + support, dark green per brand. Hidden in the
          compact tablet rail; there simply isn't room for it there. */}
      <div className="hidden lg:block px-5 py-3 text-[11px] text-white/70" style={{ background: "#123a1e" }}>
        <div>App v0.1.0</div>
        <div>Support: support@excelcropgroup.com.pk</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Notification bell — Head Office only sees live content; other roles get a
// calm empty state rather than a dead/misleading control.
// ---------------------------------------------------------------------------
const NotificationBell: React.FC<{ pending: AccessRequest[] }> = ({ pending }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isHeadOffice = user?.role === "HEAD_OFFICE";
  const count = isHeadOffice ? pending.length : 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-[var(--txt2)] hover:text-[var(--g1)] transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <IconBell size={19} />
        {count > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
            style={{ background: "var(--o1)" }}
          />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            className="absolute right-0 mt-3 w-[300px] max-w-[85vw] bg-white z-50 overflow-hidden"
            style={{ borderRadius: "var(--rad2)", boxShadow: "var(--sh2)", border: "1px solid var(--border)" }}
          >
            <div className="px-4 py-3 text-[13px] font-bold text-[var(--txt)]" style={{ borderBottom: "1px solid var(--border)" }}>
              Notifications
            </div>
            {!isHeadOffice && (
              <div className="px-4 py-8 text-center text-[12.5px] text-[var(--txt2)]">You're all caught up.</div>
            )}
            {isHeadOffice && count === 0 && (
              <div className="px-4 py-8 text-center text-[12.5px] text-[var(--txt2)]">No pending access requests.</div>
            )}
            {isHeadOffice &&
              pending.slice(0, 4).map((req) => (
                <div key={req.id} className="px-4 py-3 flex items-start gap-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span
                    className="h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: "var(--o1)" }}
                  >
                    🔔
                  </span>
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-semibold text-[var(--txt)] truncate">
                      New access request — {req.name}
                    </div>
                    <div className="text-[11.5px] text-[var(--txt2)] truncate">
                      Requested: {req.location.name}
                    </div>
                  </div>
                </div>
              ))}
            {isHeadOffice && count > 0 && (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/access-requests");
                }}
                className="w-full py-2.5 text-[12.5px] font-bold text-center transition-colors"
                style={{ color: "var(--g1)" }}
              >
                Review requests →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);

  useEffect(() => {
    if (user?.role !== "HEAD_OFFICE") return;
    const refresh = () => {
      getAllRequests().then((all) => setPendingRequests(all.filter((r) => r.status === "PENDING")));
    };
    refresh();
    window.addEventListener(ACCESS_REQUESTS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(ACCESS_REQUESTS_CHANGED_EVENT, refresh);
  }, [user?.role]);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Persistent sidebar — icon rail on tablet (md), full width on desktop (lg) */}
      <aside className="hidden md:block md:w-[72px] lg:w-[236px] shrink-0">
        <div className="fixed top-0 left-0 h-screen md:w-[72px] lg:w-[236px]">
          <SidebarContent pendingAccessRequests={pendingRequests.length} />
        </div>
      </aside>

      {/* Mobile sidebar drawer — full labels always, only visible <768px */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-0 left-0 h-full w-[80%] max-w-[280px] shadow-2xl">
            <SidebarContent
              onNavigate={() => setMobileNavOpen(false)}
              pendingAccessRequests={pendingRequests.length}
            />
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
            <NotificationBell pending={pendingRequests} />
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
