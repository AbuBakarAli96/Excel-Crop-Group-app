import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "../../components/AuthShell";
import { AccessStatusError } from "../../services/authService";

const LOGO_SRC = "/assets/excel-crop-group-logo.png";

const EyeIcon: React.FC<{ open: boolean }> = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-3.22 4.47M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const AlertIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ type: "error" | "pending"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    setLoading(true);
    try {
      const result = await login({ username: email, password });
      const redirectTo = location.state?.from?.pathname ?? "/dashboard";
      navigate(redirectTo, {
        replace: true,
        state: result.justApproved
          ? { justApproved: true, roleLabel: result.roleLabel }
          : undefined,
      });
    } catch (err) {
      if (err instanceof AccessStatusError) {
        setBanner({ type: err.status === "PENDING" ? "pending" : "error", message: err.message });
      } else {
        setBanner({ type: "error", message: err instanceof Error ? err.message : "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      heroHeadline="Run your entire sales order pipeline from one portal."
      heroBody="Place, track, recommend and approve crop input orders — built for Excel Crop Group's Territory Managers, Regional Managers and Head Office."
    >
      {/* Card header — real logo, no redundant text wordmark since the logo already carries it */}
      <div className="flex flex-col items-center mb-2">
        <img
          src={LOGO_SRC}
          alt="Excel Crop Group"
          className="h-14 w-auto mb-1"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
      </div>

      <p className="text-center text-[13px] text-[var(--txt2)] mb-6">
        Sign in to your Sales Order Portal account
      </p>

      {banner && (
        <div
          className="mb-5 flex items-start gap-2 px-4 py-3 text-sm rounded-[6px]"
          style={
            banner.type === "pending"
              ? { background: "#fff4e0", color: "var(--o2)", borderLeft: "3px solid var(--o2)" }
              : { background: "#fdecea", color: "var(--r1)", borderLeft: "3px solid var(--r1)" }
          }
          role="alert"
        >
          {banner.type === "pending" ? <ClockIcon /> : <AlertIcon />}
          <span>{banner.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="ecg-email" className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">
            Username or Email
          </label>
          <input
            id="ecg-email"
            type="text"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@excelcropgroup.com.pk"
            className="ecg-input"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="ecg-password" className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">
            Password
          </label>
          <div className="relative">
            <input
              id="ecg-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="ecg-input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--txt3)] hover:text-[var(--g2)] transition-colors"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <Link
            to="/forgot-password"
            className="text-[12.5px] font-medium transition-colors hover:text-[var(--o1)]"
            style={{ color: "var(--g1)" }}
          >
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="ecg-btn ecg-btn-primary w-full py-2.5">
          {loading ? (
            <>
              <SpinnerIcon />
              Logging in…
            </>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <div
        className="mt-5 px-3.5 py-2.5 text-[11.5px] leading-relaxed rounded-[8px]"
        style={{ background: "var(--g3)", color: "var(--g1)" }}
      >
        <strong>Demo accounts</strong> (password: <code>password</code>):<br />
        territory@excelcropgroup.com.pk · regional@excelcropgroup.com.pk · hq@excelcropgroup.com.pk
        <br />
        <em>Try a pending request:</em> abubakar.ali@excelcropgroup.com.pk
      </div>

      <p className="mt-5 text-center text-[13px] text-[var(--txt2)]">
        First time here?{" "}
        <Link to="/register" className="font-semibold transition-colors hover:text-[var(--o1)]" style={{ color: "var(--g1)" }}>
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};

export default LoginPage;
