import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/auth";

interface ProtectedRouteProps {
  /** When given, only these roles may pass — anyone else is redirected to
   * their own home instead of seeing a blocked/blank page. Omit to only
   * require authentication (any logged-in role). */
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const ownHome = user.role === "ADMIN" ? "/admin-dashboard" : "/dashboard";
    return <Navigate to={ownHome} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
