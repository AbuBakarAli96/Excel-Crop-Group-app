import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StatTile from "../../components/StatTile";
import StatusBadge from "../../components/StatusBadge";
import { MOCK_ORDERS } from "../../mock/orders";
import type { OrderStatus } from "../../types/order";
import {
  IconUsers,
  IconOrders,
  IconMap,
  IconInvoice,
  IconPlus,
  IconChevronRight,
} from "../../components/icons";

const currency = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

const PILL_TABS: { key: OrderStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING_RECOMMENDATION", label: "Pending" },
  { key: "RECOMMENDED", label: "Recommended" },
  { key: "APPROVED", label: "Approved" },
  { key: "INVOICED", label: "Invoiced" },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");

  const orders = useMemo(
    () => (activeTab === "ALL" ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === activeTab)),
    [activeTab]
  );

  if (!user) return null;

  // Admin uses its own dedicated dashboard.
  if (user.role === "ADMIN") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  const heading =
    user.role === "TERRITORY_MANAGER"
      ? "My Dashboard"
      : user.role === "REGIONAL_MANAGER"
      ? "Region Dashboard"
      : "HQ Dashboard";

  const subheading =
    user.role === "TERRITORY_MANAGER"
      ? `${user.territory} · ${user.region}`
      : user.role === "REGIONAL_MANAGER"
      ? user.region
      : "All regions · All territories";

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="stitle">{heading}</h1>
          <p className="text-[12.5px] text-[var(--txt2)] mt-1 ml-[14px]">{subheading}</p>
        </div>
        {user.role === "TERRITORY_MANAGER" && (
          <button
            onClick={() => navigate("/orders/new")}
            className="ecg-btn ecg-btn-primary self-start sm:self-auto"
          >
            <IconPlus size={16} />
            New Order
          </button>
        )}
      </div>

      {/* KPI tiles — role-aware */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {user.role === "TERRITORY_MANAGER" && (
          <>
            <StatTile label="My Customers" value={38} icon={IconUsers} delayMs={0} />
            <StatTile label="Pending Orders" value={4} icon={IconOrders} accent="orange" delayMs={60} />
            <StatTile label="Approved This Month" value={17} icon={IconInvoice} accent="teal" delayMs={120} />
            <StatTile label="Sales (MTD)" value={currency(1284500)} icon={IconMap} delayMs={180} />
          </>
        )}
        {user.role === "REGIONAL_MANAGER" && (
          <>
            <StatTile label="Territories in Region" value={6} icon={IconMap} delayMs={0} />
            <StatTile label="Pending Recommendation" value={9} icon={IconOrders} accent="orange" delayMs={60} />
            <StatTile label="Recommended" value={21} icon={IconInvoice} accent="teal" delayMs={120} />
            <StatTile label="Region Sales (MTD)" value={currency(6420000)} icon={IconUsers} delayMs={180} />
          </>
        )}
        {user.role === "HEAD_OFFICE" && (
          <>
            <StatTile label="Pending" value={31} icon={IconOrders} accent="orange" delayMs={0} />
            <StatTile label="Recommended" value={44} icon={IconOrders} accent="teal" delayMs={60} />
            <StatTile label="Approved" value={58} icon={IconMap} delayMs={120} />
            <StatTile label="Invoiced" value={112} icon={IconInvoice} delayMs={180} />
          </>
        )}
      </div>

      {/* Order queue */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="stitle !text-[18px]">
          {user.role === "TERRITORY_MANAGER"
            ? "My Recent Orders"
            : user.role === "REGIONAL_MANAGER"
            ? "Region Order Queue"
            : "Global Order Queue"}
        </h2>
        <button
          onClick={() => navigate("/orders")}
          className="hidden sm:flex items-center gap-1 text-[12.5px] font-semibold text-[var(--g1)] hover:text-[var(--o1)] transition-colors"
        >
          View all <IconChevronRight size={14} />
        </button>
      </div>

      {/* Pill filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PILL_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`ecg-pill ${active ? "ecg-pill-active" : ""}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      <div className="ecg-card overflow-hidden">
        {/* header row — desktop only */}
        <div
          className="hidden md:grid grid-cols-[1fr_1fr_1fr_120px_110px] gap-3 px-5 py-3 text-[11.5px] font-bold uppercase tracking-wide text-[var(--txt3)]"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span>Order</span>
          <span>Customer</span>
          <span>Territory</span>
          <span>Total</span>
          <span>Status</span>
        </div>

        {orders.length === 0 && (
          <div className="py-10 text-center text-[13px] text-[var(--txt2)]">
            No orders in this status.
          </div>
        )}

        {orders.map((order, i) => (
          <div
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_120px_110px] gap-2 md:gap-3 px-5 py-3.5 cursor-pointer hover:bg-[var(--g3)]/40 transition-colors"
            style={{ borderBottom: i === orders.length - 1 ? "none" : "1px solid var(--border)" }}
          >
            <div className="text-[13px] font-bold text-[var(--txt)]">{order.id}</div>
            <div className="text-[13px] text-[var(--txt2)] md:text-right md:order-none order-last col-span-2 md:col-span-1 md:text-left">
              {order.customerName}
            </div>
            <div className="hidden md:block text-[13px] text-[var(--txt2)]">{order.territory}</div>
            <div className="hidden md:block text-[13px] font-semibold text-[var(--txt)]">
              {currency(order.total)}
            </div>
            <div className="md:block">
              <StatusBadge status={order.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
