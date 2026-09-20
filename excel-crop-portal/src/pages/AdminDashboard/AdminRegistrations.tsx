import React, { useMemo, useState } from "react";
import { approveRequest, getAllRequests, rejectRequest } from "../../services/registrationService";
import type { RegistrationRequest, RegistrationStatus } from "../../types/registration";
import { IconInbox } from "../../components/icons";

const ROLE_LABEL: Record<RegistrationRequest["role"], string> = {
  TERRITORY_MANAGER: "Territory Manager",
  REGIONAL_MANAGER: "Regional Manager",
};

const STATUS_STYLES: Record<RegistrationStatus, { bg: string; color: string; label: string }> = {
  PENDING: { bg: "#fff4e0", color: "var(--o2)", label: "Pending" },
  APPROVED: { bg: "var(--g3)", color: "var(--g1)", label: "Approved" },
  REJECTED: { bg: "#fdecea", color: "var(--r1)", label: "Rejected" },
};

const RequestStatusBadge: React.FC<{ status: RegistrationStatus }> = ({ status }) => {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const PILL_TABS: { key: RegistrationStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

const AdminRegistrations: React.FC = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>(() => getAllRequests());
  const [activeTab, setActiveTab] = useState<RegistrationStatus | "ALL">("PENDING");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const refresh = () => setRequests(getAllRequests());

  const visibleRequests = useMemo(() => {
    const byStatus = activeTab === "ALL" ? requests : requests.filter((r) => r.status === activeTab);
    const q = search.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.location.city.toLowerCase().includes(q)
    );
  }, [requests, activeTab, search]);

  const handleApprove = async (id: string) => {
    setBusyId(id);
    approveRequest(id);
    refresh();
    setBusyId(null);
  };

  const handleReject = async (id: string) => {
    setBusyId(id);
    rejectRequest(id);
    refresh();
    setBusyId(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="stitle">Registrations</h1>
        <p className="text-[12.5px] text-[var(--txt2)] mt-1 ml-[14px]">
          Review Territory &amp; Regional Manager account requests and manage access to the portal.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {PILL_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors"
              style={
                activeTab === tab.key
                  ? { background: "var(--o1)", color: "#fff" }
                  : { background: "#fff", color: "var(--txt2)", border: "1px solid var(--border)" }
              }
            >
              {tab.label}
              {tab.key !== "ALL" && (
                <span className="ml-1.5 opacity-80">
                  ({requests.filter((r) => r.status === tab.key).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or city…"
          className="ecg-input sm:max-w-[240px]"
        />
      </div>

      {visibleRequests.length === 0 ? (
        <div className="ecg-card flex flex-col items-center justify-center text-center py-14 px-6">
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center mb-3"
            style={{ background: "#fff0e6", color: "var(--o1)" }}
          >
            <IconInbox size={20} />
          </div>
          <h2 className="text-[15px] font-bold text-[var(--txt)] mb-1">Nothing here</h2>
          <p className="text-[13px] text-[var(--txt2)]">No requests match this filter right now.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleRequests.map((req) => (
            <div key={req.id} className="ecg-card p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex items-center gap-3 min-w-0 md:w-[230px] shrink-0">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                    style={{ background: "var(--g2)" }}
                  >
                    {req.fullName
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold text-[var(--txt)] truncate">{req.fullName}</div>
                    <div className="text-[12px] text-[var(--txt2)] truncate">{req.email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 min-w-0">
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--txt3)]">
                      Role Requested
                    </div>
                    <div className="text-[13px] text-[var(--txt)] truncate">{ROLE_LABEL[req.role]}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--txt3)]">
                      Location
                    </div>
                    <div className="text-[13px] text-[var(--txt)] truncate">
                      {req.location.city}, {req.location.province}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--txt3)]">Phone</div>
                    <div className="text-[13px] text-[var(--txt)] truncate">{req.phone || "—"}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--txt3)]">
                      Submitted
                    </div>
                    <div className="text-[13px] text-[var(--txt)] truncate">{formatDate(req.submittedAt)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 md:w-[240px] shrink-0 justify-start md:justify-end">
                  <RequestStatusBadge status={req.status} />
                  {req.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={busyId === req.id}
                        onClick={() => handleApprove(req.id)}
                        className="ecg-btn ecg-btn-primary py-1.5 px-3 text-[12.5px]"
                      >
                        Accept
                      </button>
                      <button
                        disabled={busyId === req.id}
                        onClick={() => handleReject(req.id)}
                        className="ecg-btn ecg-btn-destructive py-1.5 px-3 text-[12.5px]"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;
