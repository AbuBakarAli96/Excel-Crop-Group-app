import type { Role } from "../types/auth";
import type { ComponentType } from "react";
import {
  IconGrid,
  IconOrders,
  IconPlus,
  IconUsers,
  IconMap,
  IconTag,
  IconDoc,
  IconInvoice,
  IconReport,
  IconSettings,
} from "../components/icons";

export interface NavItem {
  label: string;
  path: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

const SHARED_TOP: NavItem[] = [{ label: "Dashboard", path: "/dashboard", icon: IconGrid }];

const SHARED_BOTTOM: NavItem[] = [
  { label: "Price List", path: "/price-list", icon: IconTag },
  { label: "Policies", path: "/policies", icon: IconDoc },
  { label: "Profile & Settings", path: "/settings", icon: IconSettings },
];

const BY_ROLE: Record<Role, NavItem[]> = {
  TERRITORY_MANAGER: [
    { label: "My Orders", path: "/orders", icon: IconOrders },
    { label: "New Order", path: "/orders/new", icon: IconPlus },
    { label: "My Customers", path: "/customers", icon: IconUsers },
  ],
  REGIONAL_MANAGER: [
    { label: "Region Order Queue", path: "/orders", icon: IconOrders },
    { label: "Recommend / Reject", path: "/orders/recommend", icon: IconDoc },
    { label: "Territories in My Region", path: "/territories", icon: IconMap },
  ],
  HEAD_OFFICE: [
    { label: "Global Order Queue", path: "/orders", icon: IconOrders },
    { label: "Approve / Reject", path: "/orders/approve", icon: IconDoc },
    { label: "Regions Overview", path: "/regions", icon: IconMap },
    { label: "All Territories", path: "/territories", icon: IconMap },
    { label: "Users", path: "/users", icon: IconUsers },
    { label: "Master Data", path: "/master-data", icon: IconGrid },
    { label: "Farzi Invoice", path: "/farzi-invoice", icon: IconInvoice },
    { label: "Reports", path: "/reports", icon: IconReport },
  ],
  // Admin has its own dedicated dashboard/layout (see AdminDashboard),
  // so it doesn't use this sidebar nav today.
  ADMIN: [],
};

export function getNavItemsForRole(role: Role): NavItem[] {
  return [...SHARED_TOP, ...BY_ROLE[role], ...SHARED_BOTTOM];
}
