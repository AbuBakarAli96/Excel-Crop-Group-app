import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import LocationPicker from "../../components/LocationPicker";
import { submitRequest } from "../../services/registrationService";
import type { RequestedRole } from "../../types/registration";
import type { SelectedLocation } from "../../types/location";

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
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const INITIAL_STATE: FormState = {
  fullName: "",
  email: "",
  phone: "",
  role: REQUESTABLE_ROLES[0].value,
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

type FieldErrors = Partial<Record<keyof FormState | "location", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s]{7,15}$/;

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [location, setLocation] = useState<SelectedLocation | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address.";
    if (!form.phone.trim()) errors.phone = "Phone number is required.";
    else if (!PHONE_RE.test(form.phone.trim())) errors.phone = "Enter a valid phone number.";
    if (!location) errors.location = "Please select your city.";
    if (form.password.length < 8) errors.password = "At least 8 characters.";
    if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match.";
    if (!form.agreeTerms) errors.agreeTerms = "You must accept the terms to continue.";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    // New accounts go to the Admin Dashboard for approval before they can log in,
    // matching the real-world onboarding flow for Territory/Regional Managers.
    try {
      await submitRequest({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role as RequestedRole,
        location: location as SelectedLocation,
        password: form.password,
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthShell
        heroHeadline="You're almost in."
        heroBody="Your account request has been sent to Excel Crop Group Admin. You'll get an email as soon as it's approved."
        heroImage="/assets/photos/hero-rice-harvest.jpg"
        hideTrustBadges
        onClose={() => navigate("/login")}
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
            Admin will review your details for <strong>{location?.city ?? "your city"}</strong> and
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
      heroBody="Territory and Regional Managers can request portal access here. Admin reviews every request before activation, keeping the network secure."
      heroImage="/assets/photos/hero-cornfield.jpg"
      wide
      onClose={() => navigate("/login")}
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

      {formError && (
        <div
          className="mb-5 px-4 py-3 text-sm rounded-[6px]"
          style={{ background: "#fdecea", color: "var(--r1)", borderLeft: "3px solid var(--r1)" }}
          role="alert"
        >
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="e.g. Ahmed Raza"
              className={`ecg-input ${fieldErrors.fullName ? "ecg-input-error" : ""}`}
            />
            {fieldErrors.fullName && <p className="mt-1 text-[11.5px] text-[var(--r1)]">{fieldErrors.fullName}</p>}
          </div>
          <div>
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="03xx-xxxxxxx"
              className={`ecg-input ${fieldErrors.phone ? "ecg-input-error" : ""}`}
            />
            {fieldErrors.phone && <p className="mt-1 text-[11.5px] text-[var(--r1)]">{fieldErrors.phone}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Work Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@excelcropgroup.com.pk"
            className={`ecg-input ${fieldErrors.email ? "ecg-input-error" : ""}`}
          />
          {fieldErrors.email && <p className="mt-1 text-[11.5px] text-[var(--r1)]">{fieldErrors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Requested Role</label>
          <div className="relative">
            <select value={form.role} onChange={(e) => update("role", e.target.value)} className="ecg-input">
              {REQUESTABLE_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">
            Your City <span className="text-[var(--txt3)] font-normal">(Province &amp; District auto-filled)</span>
          </label>
          <LocationPicker value={location} onChange={setLocation} error={!!fieldErrors.location} />
          {fieldErrors.location && <p className="mt-1 text-[11.5px] text-[var(--r1)]">{fieldErrors.location}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 8 characters"
              className={`ecg-input ${fieldErrors.password ? "ecg-input-error" : ""}`}
            />
            {fieldErrors.password && <p className="mt-1 text-[11.5px] text-[var(--r1)]">{fieldErrors.password}</p>}
          </div>
          <div>
            <label className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="Re-enter password"
              className={`ecg-input ${fieldErrors.confirmPassword ? "ecg-input-error" : ""}`}
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-[11.5px] text-[var(--r1)]">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        <label className="flex items-start gap-2.5 mb-1.5 cursor-pointer select-none">
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
        {fieldErrors.agreeTerms && <p className="mb-4 text-[11.5px] text-[var(--r1)]">{fieldErrors.agreeTerms}</p>}

        <button type="submit" disabled={loading} className="ecg-btn ecg-btn-primary w-full py-2.5 mt-4">
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
