import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "../../components/AuthShell";

const LOGO_SRC = "/assets/excel-crop-group-logo.png";

const EyeIcon: React.FC<{ open: boolean }> = ({ open }) =>
  open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-3.22 4.47M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const SpinnerIcon: React.FC = () => (
  <svg
    className="animate-spin"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      opacity="0.25"
    />
    <path
      d="M22 12a10 10 0 0 0-10-10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const AlertIcon: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const loggedInUser = await login({
        username: email,
        password,
      });

      // Only ADMIN accounts can enter the Admin Portal
      if (loggedInUser.role !== "ADMIN") {
        setError("This login is only available for Admin accounts.");
        return;
      }

      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      heroEyebrow="Admin Portal"
      heroHeadline="Manage the entire sales order operation from one place."
      heroBody="Admins can manage regions, territories, orders, approvals, master data and invoices."
      heroImage="/assets/photos/hero-harvester.jpg"
      accent="orange"
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-2">
        <img
          src={LOGO_SRC}
          alt="Excel Crop Group"
          className="h-14 w-auto mb-1"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Admin Badge */}
      <div className="flex justify-center mb-3">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold"
          style={{
            background: "#fff0e6",
            color: "var(--o1)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--o1)" }}
          />
          Admin
        </span>
      </div>

      <h1
        className="text-center text-[22px] sm:text-[24px] font-extrabold tracking-wide mb-1.5"
        style={{ color: "var(--g1)" }}
      >
        WELCOME ADMIN
      </h1>

      <p className="text-center text-[13px] text-[var(--txt2)] mb-6">
        Enter your administrator email and password to access the Admin
        Dashboard
      </p>

      {/* Error */}
      {error && (
        <div
          className="mb-5 flex items-start gap-2 px-4 py-3 text-sm rounded-[6px]"
          style={{
            background: "#fdecea",
            color: "var(--r1)",
            borderLeft: "3px solid var(--r1)",
          }}
          role="alert"
        >
          <AlertIcon />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="admin-email"
            className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]"
          >
            Admin Email
          </label>

          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@excelcropgroup.com.pk"
            className="ecg-input"
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label
            htmlFor="admin-password"
            className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="ecg-input pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--txt3)] hover:text-[var(--g2)] transition-colors"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mb-6">
          <Link
            to="/forgot-password"
            className="text-[12.5px] font-medium transition-colors hover:text-[var(--o1)]"
            style={{ color: "var(--g1)" }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="ecg-btn ecg-btn-primary w-full py-2.5"
        >
          {loading ? (
            <>
              <SpinnerIcon />
              Logging in…
            </>
          ) : (
            "Admin Login"
          )}
        </button>
      </form>

      {/* Demo Admin Account */}
      <div
        className="mt-5 px-3.5 py-2.5 text-[11.5px] leading-relaxed rounded-[8px]"
        style={{
          background: "var(--g3)",
          color: "var(--g1)",
        }}
      >
        <strong>Demo Admin Account</strong>
        <br />
        Email: admin@excelcropgroup.com.pk
        <br />
        Password: <code>admin123</code>
      </div>

      {/* Back to Role Selection */}
      <p className="mt-5 text-center text-[13px] text-[var(--txt2)]">
        Not an Admin?{" "}
        <Link
          to="/roleselection"
          className="font-semibold transition-colors hover:text-[var(--o1)]"
          style={{ color: "var(--g1)" }}
        >
          Choose another login
        </Link>
      </p>
    </AuthShell>
  );
};

export default AdminLogin;