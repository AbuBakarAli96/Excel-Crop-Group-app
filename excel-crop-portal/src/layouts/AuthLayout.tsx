import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Wraps logged-out routes (Login, Forgot Password, Register).
 * Intentionally minimal — each auth page owns its full-viewport layout
 * so it can control its own responsive breakpoints and branding.
 */
const AuthLayout: React.FC = () => {
  return <Outlet />;
};

export default AuthLayout;
