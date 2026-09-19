import React from "react";
import type { OrderStatus } from "../types/order";

const STYLES: Record<OrderStatus, { bg: string; color: string; label: string }> = {
  DRAFT: { bg: "#f0f0f0", color: "var(--txt3)", label: "Draft" },
  SUBMITTED: { bg: "#fff1e6", color: "var(--o1)", label: "Submitted" },
  PENDING_RECOMMENDATION: { bg: "#fff4e0", color: "var(--o2)", label: "Pending" },
  RECOMMENDED: { bg: "#e6f5ee", color: "var(--g2)", label: "Recommended" },
  APPROVED: { bg: "var(--g3)", color: "var(--g1)", label: "Approved" },
  REJECTED: { bg: "#fdecea", color: "var(--r1)", label: "Rejected" },
  INVOICED: { bg: "var(--g1)", color: "#ffffff", label: "Invoiced" },
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const s = STYLES[status];
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
};

export default StatusBadge;
