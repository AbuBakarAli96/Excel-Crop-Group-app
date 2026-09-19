import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../../components/AuthShell";

const LOGO_SRC = "/assets/excel-crop-group-logo.png";

const CheckCircleIcon: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const REQUESTABLE_ROLES = [
  { value: "TERRITORY_MANAGER", label: "Territory Manager" },
  { value: "REGIONAL_MANAGER", label: "Regional Manager" },
];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  territory: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const INITIAL_STATE: FormState = {
  fullName: "",
  email: "",
  phone: "",
  role: REQUESTABLE_ROLES[0].value,
  territory: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

const SignUpPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.agreeTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    setLoading(true);
    // Mock request — replace with a real POST to /api/auth/register.
    // New field accounts go through Head Office approval before they can log in,
    // matching the real-world onboarding flow for Territory/Regional Managers.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthShell
        heroHeadline="You're almost in."
        heroBody="Your account request has been sent to Excel Crop Group Head Office. You'll get an email as soon as it's approved."
        hideTrustBadges
      >
        <div className="flex flex-col items-center text-center py-4">
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center mb-4 ecg-pop-in"
            style={{ background: "var(--g3)", color: "var(--g1)" }}
          >
            <CheckCircleIcon />
          </div>
          <h2 className="text-lg font-extrabold text-[var(--txt)] mb-1.5">Request submitted</h2>
          <p className="text-[13.5px] text-[var(--txt2)] max-w-xs mb-6">
            Head Office will review your details for <strong>{form.territory || "your territory"}</strong> and
            activate your account. This usually takes 1–2 business days.
          </p>
          <Link to="/login" className="ecg-btn ecg-btn-primary w-full py-2.5 justify-center">
            Back to Login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      heroHeadline="Join the Excel Crop Group distribution network."
      heroBody="Territory and Regional Managers can request portal access here. Head Office reviews every request before activation, keeping the network secure."
      wide
    >
      <div className="flex flex-col items-center mb-2">
        <img
          src={LOGO_SRC}
          alt="Excel Crop Group"
          className="h-12 w-auto mb-1"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
      </div>
      <h1 className="text-center text-[17px] font-extrabold text-[var(--txt)] mb-1">Create your account</h1>
      <p className="text-center text-[13px] text-[var(--txt2)] mb-6">
        Request access to the Sales Order Portal
      </p>

      {error && (
        <div
          className="mb-5 px-4 py-3 text-sm rounded-[6px]"
          style={{ background: "#fdecea", color: "var(--r1)", borderLeft: "3px solid var(--r1)" }}
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Full Name</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="e.g. Ahmed Raza"
              className="ecg-input"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Phone Number</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="ecg-input"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Work Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@excelcropgroup.com.pk"
            className="ecg-input"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Requested Role</label>
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className="ecg-input"
            >
              {REQUESTABLE_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Territory / Region</label>
            <input
              required
              value={form.territory}
              onChange={(e) => update("territory", e.target.value)}
              placeholder="e.g. Multan City"
              className="ecg-input"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 8 characters"
              className="ecg-input"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Confirm Password</label>
            <input
              required
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="Re-enter password"
              className="ecg-input"
            />
          </div>
        </div>

        <label className="flex items-start gap-2.5 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.agreeTerms}
            onChange={(e) => update("agreeTerms", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--g1)]"
          />
          <span className="text-[12.5px] text-[var(--txt2)]">
            I agree to Excel Crop Group's terms of use and confirm the details above are accurate.
          </span>
        </label>

        <button type="submit" disabled={loading} className="ecg-btn ecg-btn-primary w-full py-2.5">
          {loading ? (
            <>
              <SpinnerIcon />
              Submitting request…
            </>
          ) : (
            "Request Access"
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-[var(--txt2)]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold transition-colors hover:text-[var(--o1)]" style={{ color: "var(--g1)" }}>
          Log in
        </Link>
      </p>
    </AuthShell>
  );
};

export default SignUpPage;
