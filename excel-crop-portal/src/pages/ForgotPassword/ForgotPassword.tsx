import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import OtpInput from "../../components/OtpInput";

const LOGO_SRC = "/assets/excel-crop-group-logo.png";

type Step = "EMAIL" | "OTP" | "RESET" | "SUCCESS";
const STEP_ORDER: Step[] = ["EMAIL", "OTP", "RESET", "SUCCESS"];

const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const MailIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const CheckCircleIcon: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

/** Step progress bar shown above the form on every step except the final success screen. */
const StepTrack: React.FC<{ step: Step }> = ({ step }) => {
  const idx = STEP_ORDER.indexOf(step);
  return (
    <div className="ecg-step-track mb-6">
      {["EMAIL", "OTP", "RESET"].map((s, i) => (
        <div
          key={s}
          className={`ecg-step-dot ${i < idx ? "ecg-step-done" : i === idx ? "ecg-step-current" : ""}`}
        />
      ))}
    </div>
  );
};

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(30);

  // Countdown for "resend code" — purely a UX nicety on the mock flow.
  useEffect(() => {
    if (step !== "OTP" || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendIn]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter the email linked to your account.");
      return;
    }
    setLoading(true);
    // Mock — replace with a real POST to /api/auth/forgot-password
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setResendIn(30);
    setStep("OTP");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length < 6) {
      setError("Enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    // Mock — any 6-digit code is accepted here; replace with a real verify call.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);
    setStep("RESET");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    // Mock — replace with a real POST to /api/auth/reset-password
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setStep("SUCCESS");
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    setResendIn(30);
  };

  if (step === "SUCCESS") {
    return (
      <AuthShell
        heroHeadline="Password updated."
        heroBody="Your new password is active — head back to the login page to get back to your dashboard."
        hideTrustBadges
      >
        <div className="flex flex-col items-center text-center py-4">
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center mb-4 ecg-pop-in"
            style={{ background: "var(--g3)", color: "var(--g1)" }}
          >
            <CheckCircleIcon />
          </div>
          <h2 className="text-lg font-extrabold text-[var(--txt)] mb-1.5">Password reset successful</h2>
          <p className="text-[13.5px] text-[var(--txt2)] max-w-xs mb-6">
            You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="ecg-btn ecg-btn-primary w-full py-2.5"
          >
            Back to Login
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      heroHeadline="Forgot your password? No problem."
      heroBody="We'll send a one-time code to your registered email so you can get straight back into your Sales Order Portal account."
      hideTrustBadges
    >
      <div className="flex flex-col items-center mb-2">
        <img
          src={LOGO_SRC}
          alt="Excel Crop Group"
          className="h-12 w-auto mb-1"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
      </div>

      <StepTrack step={step} />

      {error && (
        <div
          className="mb-5 px-4 py-3 text-sm rounded-[6px]"
          style={{ background: "#fdecea", color: "var(--r1)", borderLeft: "3px solid var(--r1)" }}
          role="alert"
        >
          {error}
        </div>
      )}

      {step === "EMAIL" && (
        <form onSubmit={handleSendOtp} noValidate>
          <h1 className="text-[17px] font-extrabold text-[var(--txt)] mb-1 text-center">Reset your password</h1>
          <p className="text-center text-[13px] text-[var(--txt2)] mb-6">
            Enter the email linked to your account and we'll send you a verification code.
          </p>
          <div className="mb-6">
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@excelcropgroup.com.pk"
              className="ecg-input"
              autoFocus
            />
          </div>
          <button type="submit" disabled={loading} className="ecg-btn ecg-btn-primary w-full py-2.5">
            {loading ? (
              <>
                <SpinnerIcon /> Sending code…
              </>
            ) : (
              "Send Verification Code"
            )}
          </button>
        </form>
      )}

      {step === "OTP" && (
        <form onSubmit={handleVerifyOtp} noValidate>
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center mb-3 mx-auto"
            style={{ background: "var(--g3)", color: "var(--g1)" }}
          >
            <MailIcon />
          </div>
          <h1 className="text-[17px] font-extrabold text-[var(--txt)] mb-1 text-center">Check your inbox</h1>
          <p className="text-center text-[13px] text-[var(--txt2)] mb-6">
            We sent a 6-digit code to <strong>{email}</strong>. Enter it below to continue.
          </p>
          <div className="mb-5">
            <OtpInput value={otp} onChange={setOtp} error={!!error} />
          </div>
          <button type="submit" disabled={loading} className="ecg-btn ecg-btn-primary w-full py-2.5 mb-4">
            {loading ? (
              <>
                <SpinnerIcon /> Verifying…
              </>
            ) : (
              "Verify Code"
            )}
          </button>
          <p className="text-center text-[12.5px] text-[var(--txt2)]">
            Didn't get the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendIn > 0}
              className="font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: "var(--g1)" }}
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
            </button>
          </p>
        </form>
      )}

      {step === "RESET" && (
        <form onSubmit={handleResetPassword} noValidate>
          <h1 className="text-[17px] font-extrabold text-[var(--txt)] mb-1 text-center">Set a new password</h1>
          <p className="text-center text-[13px] text-[var(--txt2)] mb-6">
            Choose a strong password you haven't used before.
          </p>
          <div className="mb-4">
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="ecg-input"
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="ecg-input"
            />
          </div>
          <button type="submit" disabled={loading} className="ecg-btn ecg-btn-primary w-full py-2.5">
            {loading ? (
              <>
                <SpinnerIcon /> Updating…
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-[13px] text-[var(--txt2)]">
        Remembered your password?{" "}
        <Link to="/login" className="font-semibold transition-colors hover:text-[var(--o1)]" style={{ color: "var(--g1)" }}>
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
