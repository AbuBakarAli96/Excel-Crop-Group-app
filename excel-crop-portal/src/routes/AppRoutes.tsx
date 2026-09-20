import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import LoginPage from "../pages/Login/Login";
import AdminLoginPage from "../pages/AdminLogin/AdminLogin";
import SignUpPage from "../pages/SignUp/SignUp";
import ForgotPasswordPage from "../pages/ForgotPassword/ForgotPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminLayout from "../layouts/AdminLayout";
import AdminOverview from "../pages/AdminDashboard/AdminOverview";
import AdminRegistrations from "../pages/AdminDashboard/AdminRegistrations";
import AdminLocations from "../pages/AdminDashboard/AdminLocations";
import AdminUsers from "../pages/AdminDashboard/AdminUsers";
import ComingSoon from "../pages/ComingSoon/ComingSoon";

import RoleSelection from "../pages/RoleSelection";

import { useAuth } from "../context/AuthContext";

/**
 * Routes that exist as nav destinations but aren't built yet.
 * Each renders the shared ComingSoon placeholder so the sidebar
 * never dead-ends.
 */
const PLACEHOLDER_ROUTES: {
  path: string;
  title: string;
}[] = [
  { path: "/orders", title: "Orders" },
  { path: "/orders/new", title: "New Order" },
  { path: "/orders/recommend", title: "Recommend / Reject Orders" },
  { path: "/orders/approve", title: "Approve / Reject Orders" },
  { path: "/orders/:orderId", title: "Order Detail" },

  { path: "/customers", title: "My Customers" },
  { path: "/territories", title: "Territories" },
  { path: "/regions", title: "Regions Overview" },
  { path: "/users", title: "Users" },
  { path: "/master-data", title: "Master Data" },

  { path: "/price-list", title: "Price List" },
  { path: "/policies", title: "Policies" },
  { path: "/farzi-invoice", title: "Farzi Invoice" },

  { path: "/reports", title: "Reports" },
  { path: "/settings", title: "Profile & Settings" },
];

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Where a logged-in user lands — Admin gets its own dashboard,
  // everyone else gets the shared sidebar Dashboard.
  const homePath = isAuthenticated
    ? user?.role === "ADMIN"
      ? "/admin-dashboard"
      : "/dashboard"
    : "/roleselection";

  return (
    <Routes>
      {/* =====================================================
          STARTING / ROLE SELECTION PAGE
          ===================================================== */}

      <Route
        path="/"
        element={<Navigate to={homePath} replace />}
      />

      <Route
        path="/roleselection"
        element={
          isAuthenticated ? (
            <Navigate to={homePath} replace />
          ) : (
            <RoleSelection />
          )
        }
      />

      {/* =====================================================
          AUTHENTICATION PAGES
          ===================================================== */}

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin-login" element={<AdminLoginPage />} />

        <Route path="/register" element={<SignUpPage />} />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
      </Route>

      {/* =====================================================
          PROTECTED APPLICATION
          ===================================================== */}

      <Route element={<ProtectedRoute />}>
        {/* Admin — its own dedicated layout with sidebar navigation */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminOverview />} />
            <Route path="/admin-dashboard/registrations" element={<AdminRegistrations />} />
            <Route path="/admin-dashboard/locations" element={<AdminLocations />} />
            <Route path="/admin-dashboard/users" element={<AdminUsers />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["TERRITORY_MANAGER", "REGIONAL_MANAGER", "HEAD_OFFICE"]} />}>
          <Route element={<DashboardLayout />}>
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Placeholder / future pages */}
            {PLACEHOLDER_ROUTES.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<ComingSoon title={route.title} />}
              />
            ))}
          </Route>
        </Route>
      </Route>

      {/* =====================================================
          UNKNOWN URL
          ===================================================== */}

      <Route
        path="*"
        element={<Navigate to={homePath} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;