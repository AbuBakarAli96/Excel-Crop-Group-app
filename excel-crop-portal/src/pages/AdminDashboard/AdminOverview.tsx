import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StatTile from "../../components/StatTile";
import { IconUsers, IconInbox, IconMap, IconActivity, IconChevronRight } from "../../components/icons";
import { getAllRequests } from "../../services/registrationService";
import { getProvinces, getAllCitiesFlat } from "../../services/locationService";
import type { RegistrationRequest, RegistrationStatus } from "../../types/registration";

const STATUS_STYLES: Record<RegistrationStatus, { bg: string; color: string; label: string }> = {
  PENDING: { bg: "#fff4e0", color: "var(--o2)", label: "Pending" },
  APPROVED: { bg: "var(--g3)", color: "var(--g1)", label: "Approved" },
  REJECTED: { bg: "#fdecea", color: "var(--r1)", label: "Rejected" },
};

const timeAgo = (iso: string): string => {
  const hours = Math.round((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

const QUICK_LINKS = [
  { label: "Review registrations", path: "/admin-dashboard/registrations", icon: IconInbox },
  { label: "Browse locations", path: "/admin-dashboard/locations", icon: IconMap },
  { label: "View active users", path: "/admin-dashboard/users", icon: IconUsers },
];

const AdminOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests] = useState<RegistrationRequest[]>(() => getAllRequests());

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "PENDING").length,
      approved: requests.filter((r) => r.status === "APPROVED").length,
      rejected: requests.filter((r) => r.status === "REJECTED").length,
    }),
    [requests]
  );

  const recent = useMemo(
    () =>
      [...requests]
        .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1))
        .slice(0, 5),
    [requests]
  );

  const provinceCount = getProvinces().length;
  const cityCount = getAllCitiesFlat().length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="stitle">Welcome, {user?.name?.split(" ")[0] ?? "Admin"}</h1>
        <p className="text-[12.5px] text-[var(--txt2)] mt-1 ml-[14px]">
          Here's what's happening across the Sales Order Portal today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile label="Total Requests" value={counts.total} icon={IconUsers} accent="teal" />
        <StatTile label="Pending Approval" value={counts.pending} icon={IconInbox} accent="orange" delayMs={40} />
        <StatTile label="Approved" value={counts.approved} icon={IconMap} accent="green" delayMs={80} />
        <StatTile label="Rejected" value={counts.rejected} icon={IconChevronRight} accent="orange" delayMs={120} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {QUICK_LINKS.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="ecg-card flex items-center gap-3 p-4 text-left"
          >
            <span
              className="h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: "#fff0e6", color: "var(--o1)" }}
            >
              <link.icon size={18} />
            </span>
            <span className="flex-1 text-[13.5px] font-semibold text-[var(--txt)]">{link.label}</span>
            <IconChevronRight size={16} className="text-[var(--txt3)] shrink-0" />
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 ecg-card p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <IconActivity size={16} className="text-[var(--o1)]" />
            <h2 className="text-[14px] font-bold text-[var(--txt)]">Recent Activity</h2>
          </div>
          {recent.length === 0 ? (
            <p className="text-[13px] text-[var(--txt2)] py-6 text-center">No registration activity yet.</p>
          ) : (
            <div className="flex flex-col">
              {recent.map((r, i) => {
                const s = STATUS_STYLES[r.status];
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 py-2.5"
                    style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
                  >
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                      style={{ background: "var(--g2)" }}
                    >
                      {r.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-[var(--txt)] truncate">
                        {r.fullName} <span className="text-[var(--txt3)] font-normal">requested access</span>
                      </div>
                      <div className="text-[11.5px] text-[var(--txt3)]">{r.location.city} · {timeAgo(r.submittedAt)}</div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold shrink-0"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="ecg-card p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <IconMap size={16} className="text-[var(--o1)]" />
            <h2 className="text-[14px] font-bold text-[var(--txt)]">Location Coverage</h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[var(--txt2)]">Provinces / Territories</span>
              <span className="text-[13px] font-bold text-[var(--txt)]">{provinceCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[var(--txt2)]">Cities in dataset</span>
              <span className="text-[13px] font-bold text-[var(--txt)]">{cityCount}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin-dashboard/locations")}
            className="ecg-btn ecg-btn-secondary w-full mt-4 py-2 text-[12.5px]"
          >
            Browse full directory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
