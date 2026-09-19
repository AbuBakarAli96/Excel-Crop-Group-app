import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/Login/Login";
import SignUpPage from "../pages/SignUp/SignUp";
import ForgotPasswordPage from "../pages/ForgotPassword/ForgotPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import ComingSoon from "../pages/ComingSoon/ComingSoon";
import { useAuth } from "../context/AuthContext";

/** Routes that exist as nav destinations but aren't built yet — see the
 * "Recommended build order" in the companion project plan. Each renders
 * the shared ComingSoon placeholder so the sidebar never dead-ends. */
const PLACEHOLDER_ROUTES: { path: string; title: string }[] = [
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
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {PLACEHOLDER_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={<ComingSoon title={route.title} />} />
          ))}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;
