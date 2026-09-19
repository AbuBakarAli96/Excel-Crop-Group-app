import React, { useEffect, useState } from "react";
import {
  approveRequest,
  getAllRequests,
  rejectRequest,
} from "../../services/accessRequestService";
import type { AccessRequest, AccessRequestStatus } from "../../types/accessRequest";
import { IconBuilding, IconMap, IconInbox } from "../../components/icons";
import { LOCATION_TYPE_LABEL } from "../../types/location";

const STATUS_STYLE: Record<AccessRequestStatus, { bg: string; color: string; label: string }> = {
  PENDING: { bg: "#fff4e0", color: "var(--o2)", label: "Pending" },
  APPROVED: { bg: "var(--g3)", color: "var(--g1)", label: "Approved" },
  REJECTED: { bg: "#fdecea", color: "var(--r1)", label: "Rejected" },
};

const TABS: { key: AccessRequestStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

const AccessRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AccessRequest[] | null>(null);
  const [activeTab, setActiveTab] = useState<AccessRequestStatus | "ALL">("PENDING");
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = () => {
    getAllRequests().then(setRequests);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDecision = async (id: string, decision: "APPROVED" | "REJECTED") => {
    setBusyId(id);
    try {
      const updated = decision === "APPROVED" ? await approveRequest(id) : await rejectRequest(id);
      setRequests((prev) => (prev ? prev.map((r) => (r.id === id ? updated : r)) : prev));
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = requests?.filter((r) => r.status === "PENDING").length ?? 0;
  const filtered = requests?.filter((r) => activeTab === "ALL" || r.status === activeTab) ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="stitle">Access Requests</h1>
        <p className="text-[12.5px] text-[var(--txt2)] mt-1 ml-[14px]">
          {pendingCount > 0
            ? `${pendingCount} request${pendingCount === 1 ? "" : "s"} waiting for review`
            : "All requests are up to date"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`ecg-pill ${activeTab === tab.key ? "ecg-pill-active" : ""}`}
          >
            {tab.label}
            {tab.key === "PENDING" && pendingCount > 0 && (
              <span
                className="ml-0.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold"
                style={{
                  background: activeTab === tab.key ? "rgba(255,255,255,.25)" : "var(--o1)",
                  color: "#fff",
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {requests === null && (
        <div className="ecg-card p-10 text-center text-[13px] text-[var(--txt2)]">Loading requests…</div>
      )}

      {requests !== null && filtered.length === 0 && (
        <div className="ecg-card ecg-reveal flex flex-col items-center justify-center text-center py-14 px-6">
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center mb-3"
            style={{ background: "var(--g3)", color: "var(--g1)" }}
          >
            <IconInbox size={20} />
          </div>
          <h2 className="text-[15px] font-bold text-[var(--txt)] mb-1">No requests here</h2>
          <p className="text-[13px] text-[var(--txt2)]">Nothing matches this filter right now.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((req, i) => {
          const style = STATUS_STYLE[req.status];
          const LocIcon = req.location.type === "HEAD_OFFICE" ? IconBuilding : IconMap;
          return (
            <div
              key={req.id}
              className="ecg-card ecg-reveal p-4 sm:p-5"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div
                  className="h-11 w-11 rounded-full flex items-center justify-center shrink-0 font-bold text-[13px] text-white"
                  style={{ background: "var(--g1)" }}
                >
                  {req.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[14px] font-bold text-[var(--txt)]">{req.name}</span>
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {style.label}
                    </span>
                  </div>
                  <div className="text-[12.5px] text-[var(--txt2)] truncate">{req.email}</div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[12px] text-[var(--txt2)]">
                    <LocIcon size={13} className="text-[var(--g1)] shrink-0" />
                    <span className="font-medium text-[var(--txt)]">{req.location.name}</span>
                    <span className="text-[var(--txt3)]">· {LOCATION_TYPE_LABEL[req.location.type]}</span>
                    <span className="text-[var(--txt3)] hidden sm:inline">· {timeAgo(req.submittedAt)}</span>
                  </div>
                </div>

                {req.status === "PENDING" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleDecision(req.id, "REJECTED")}
                      disabled={busyId === req.id}
                      className="ecg-btn ecg-btn-destructive flex-1 sm:flex-none"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDecision(req.id, "APPROVED")}
                      disabled={busyId === req.id}
                      className="ecg-btn ecg-btn-primary flex-1 sm:flex-none"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccessRequestsPage;
