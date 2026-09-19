import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import LocationSelect from "../../components/LocationSelect";
import { createRequest } from "../../services/accessRequestService";
import { MOCK_LOCATIONS } from "../../mock/locations";
import type { OrganizationalLocation } from "../../types/location";
import { IconCheck } from "../../components/icons";

const LOGO_SRC = "/assets/excel-crop-group-logo.png";

const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const INITIAL_STATE: FormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

const SignUpPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [location, setLocation] = useState<OrganizationalLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.fullName.trim() || !form.email.trim()) {
      setError("Please fill in your name and email address.");
      return;
    }
    if (!location) {
      setError("Please select your territory, region or office.");
      return;
    }
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
    try {
      await createRequest({
        name: form.fullName,
        email: form.email,
        password: form.password,
        location,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted && location) {
    return (
      <AuthShell
        heroHeadline="Your request is with Head Office."
        heroBody="Every new account is reviewed before activation, so the Excel Crop Group network stays secure and accurate."
        hideTrustBadges
      >
        <div className="flex flex-col items-center text-center py-4">
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center mb-4 ecg-pop-in"
            style={{ background: "var(--g3)", color: "var(--g1)" }}
          >
            <IconCheck size={30} />
          </div>
          <h2 className="text-lg font-extrabold text-[var(--txt)] mb-1.5">Access Request Submitted</h2>
          <p className="text-[13.5px] text-[var(--txt2)] max-w-xs mb-5">
            Your request has been sent to the administrator. We'll notify you at{" "}
            <strong>{form.email}</strong> when access is approved.
          </p>

          <div
            className="w-full flex items-center justify-between px-4 py-3 mb-6 text-left"
            style={{ background: "var(--g3)", borderRadius: "var(--rad)" }}
          >
            <span className="text-[12.5px] font-semibold text-[var(--g1)]">Selected location</span>
            <span className="text-[13px] font-bold text-[var(--txt)]">{location.name}</span>
          </div>

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
        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Full Name</label>
          <input
            required
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="e.g. Ahmed Raza"
            className="ecg-input"
          />
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

        <div className="mb-4">
          <LocationSelect
            id="ecg-location"
            label="Select your location"
            options={MOCK_LOCATIONS}
            value={location}
            onChange={setLocation}
          />
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
