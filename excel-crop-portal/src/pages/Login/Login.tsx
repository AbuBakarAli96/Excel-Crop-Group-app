import React, { useState, useEffect, useCallback } from "react";
import excelCropGroupLogo from "../../assets/excel-crop-group-logo.png";

/**
 * Excel Crop Group — Sales Order Portal — Login Page
 * -----------------------------------------------------------------------
 * React + TypeScript + Tailwind CSS
 *
 * SETUP NOTES (read before dropping this into your app):
 *
 * 1. Fonts — this file injects the Google Fonts <link> tags at runtime
 *    (Poppins 400/600/700/800 + Noto Nastaliq Urdu) so the component is
 *    fully self-contained. If your app already manages <head> tags
 *    (e.g. via a root index.html or a Helmet-style library), feel free
 *    to move the two <link> tags there instead and delete the
 *    `useInjectFonts()` hook below.
 *
 * 2. Brand tokens — the --g1/--g2/... custom properties are defined once
 *    on the root wrapper via the `brandStyle` object below and consumed
 *    everywhere through Tailwind's arbitrary-value syntax, e.g.
 *    `bg-[var(--g1)]`. If you'd rather centralize these in
 *    tailwind.config.js under `theme.extend.colors`, copy the hex values
 *    from BRAND_TOKENS and wire them up there — the className strings in
 *    this file would then swap from `bg-[var(--g1)]` to `bg-brand-g1`.
 *
 * 3. Logo — imported directly from src/assets/excel-crop-group-logo.png so
 *    Vite bundles and hashes it automatically. Drop the real file at that
 *    path (already done if you're using the version I gave you).
 *
 * 4. Auth wiring — `submitLogin` is stubbed with a mock async call that
 *    succeeds once both fields are filled in (it previously always threw,
 *    which is why login looked broken — that's fixed now). Swap its body
 *    for your real API call when the backend is ready.
 *
 * 5. Sign up — this page only links to `/register` ("Create an account"),
 *    for first-time users who need to register before they can log in.
 *    It does not build that registration screen; wire the route up once
 *    that page exists.
 */

// ---------------------------------------------------------------------------
// Brand tokens (kept here as the single source of truth for the CSS vars)
// ---------------------------------------------------------------------------
const BRAND_TOKENS: React.CSSProperties = {
  ["--g1" as string]: "#1b6e1b",
  ["--g2" as string]: "#2d8a2d",
  ["--g3" as string]: "#e8f5e9",
  ["--o1" as string]: "#e65100",
  ["--txt" as string]: "#1a1a1a",
  ["--txt2" as string]: "#555555",
  ["--txt3" as string]: "#888888",
  ["--border" as string]: "#e0e0e0",
  ["--bg" as string]: "#f5f5f5",
  ["--r1" as string]: "#c62828",
  ["--sh" as string]: "0 2px 12px rgba(0,0,0,.1)",
  ["--sh2" as string]: "0 6px 24px rgba(0,0,0,.15)",
  ["--rad" as string]: "8px",
  ["--rad2" as string]: "14px",
};

const LOGO_SRC = excelCropGroupLogo;

// ---------------------------------------------------------------------------
// Small hook: inject Google Fonts once
// ---------------------------------------------------------------------------
function useInjectFonts() {
  useEffect(() => {
    const existing = document.getElementById("ecg-font-links");
    if (existing) return;

    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";

    const fontLink = document.createElement("link");
    fontLink.id = "ecg-font-links";
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap";

    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(fontLink);
  }, []);
}

// ---------------------------------------------------------------------------
// Icons (inline SVG, no external icon package required)
// ---------------------------------------------------------------------------
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
    aria-hidden="true"
    className="shrink-0"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const LoginPage: React.FC = () => {
  useInjectFonts();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitLogin = useCallback(async (loginEmail: string, loginPassword: string): Promise<void> => {
    // TODO: replace this stub with your real API call, e.g.:
    // const res = await fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    // });
    // if (!res.ok) {
    //   const data = await res.json().catch(() => null);
    //   throw new Error(data?.message ?? "Invalid username or password.");
    // }
    // return res.json();

    // Demo-only mock: simulates a network round trip and succeeds as long
    // as both fields are filled in. This previously always threw an error
    // on every submit — that was the bug making the login look broken.
    await new Promise((resolve) => setTimeout(resolve, 900));
    if (!loginEmail.trim() || !loginPassword.trim()) {
      throw new Error("Please enter both your username/email and password.");
    }
    // Success — no error thrown. Hook up real navigation once the API call above is wired in.
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await submitLogin(email, password);
      // navigate to dashboard on success
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ ...BRAND_TOKENS, fontFamily: "'Poppins', sans-serif", fontSize: "14px" }}
      className="min-h-screen w-full bg-[var(--bg)] text-[var(--txt)] flex flex-col"
    >
      {/* ------------------------------------------------------------- */}
      {/* Page-level header — logo only, no marketing nav                */}
      {/* ------------------------------------------------------------- */}
      <header
        className="w-full bg-white flex items-center px-6 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <img
          src={LOGO_SRC}
          alt="Excel Crop Group"
          className="h-9 w-auto"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </header>

      <div className="flex-1 w-full flex items-stretch">
      {/* ------------------------------------------------------------- */}
      {/* Left hero panel — desktop only (>=980px)                      */}
      {/* ------------------------------------------------------------- */}
      <div
        className="hidden min-[980px]:flex min-[980px]:w-1/2 relative overflow-hidden flex-col justify-between p-12 text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--g1) 0%, var(--g2) 100%)",
        }}
      >
        {/* subtle dark overlay for depth, matches public-site hero treatment */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 60%)",
          }}
        />
        {/* soft decorative orange accent, echoes the site's badge/pill accents */}
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20"
          style={{ background: "var(--o1)" }}
        />

        <div className="relative z-10">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide"
            style={{ background: "var(--o1)" }}
          >
            Sales Order Portal
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            Excel Crop Group
          </h1>
          <p
            dir="rtl"
            lang="ur"
            className="text-2xl leading-relaxed"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
          >
            ایکسل اور کسان، خوشحال پاکستان
          </p>
          <p className="text-sm text-white/85 max-w-sm">
            Place, track and manage your crop input orders in one place —
            built for Excel Crop Group's distribution network.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/70">
          Improving Agriculture · Improving Lives
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Right side — login card                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Mobile-only logo + wordmark, replaces the side panel below 980px */}
        <div className="min-[980px]:hidden flex flex-col items-center mb-6 text-center">
          <img
            src={LOGO_SRC}
            alt="Excel Crop Group"
            className="h-14 w-auto mb-2"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <span
            className="text-2xl font-extrabold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--g1) 0%, #2f9e5f 100%)",
            }}
          >
            Excel Crop Group
          </span>
        </div>

        <div
          className="w-full max-w-[420px] bg-white p-10"
          style={{
            borderRadius: "var(--rad2)",
            boxShadow: "var(--sh2)",
          }}
        >
          {/* Card header — logo + wordmark + subtitle (desktop, shown here too for a consistent card) */}
          <div className="hidden min-[980px]:flex flex-col items-center mb-2">
            <img
              src={LOGO_SRC}
              alt="Excel Crop Group"
              className="h-12 w-auto mb-2"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span
              className="text-xl font-extrabold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--g1) 0%, #2f9e5f 100%)",
              }}
            >
              Excel Crop Group
            </span>
          </div>

          <p className="text-center text-[13px] text-[var(--txt2)] mb-6">
            Sales Order Portal
          </p>

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
            {/* Username / Email */}
            <div className="mb-4">
              <label
                htmlFor="ecg-email"
                className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]"
              >
                Username or Email
              </label>
              <input
                id="ecg-email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@excelcropgroup.com.pk"
                className="w-full px-3.5 py-2.5 text-sm bg-white border outline-none transition-colors duration-150 placeholder:text-[var(--txt3)]"
                style={{
                  borderRadius: "var(--rad)",
                  borderColor: "var(--border)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--g2)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(45,138,45,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label
                htmlFor="ecg-password"
                className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]"
              >
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
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-white border outline-none transition-colors duration-150 placeholder:text-[var(--txt3)]"
                  style={{
                    borderRadius: "var(--rad)",
                    borderColor: "var(--border)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--g2)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(45,138,45,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
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

            {/* Forgot password */}
            <div className="flex justify-end mb-6">
              <a
                href="#forgot-password"
                className="text-[12.5px] font-medium transition-colors"
                style={{ color: "var(--o1)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--g1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--o1)")
                }
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-colors duration-150 disabled:cursor-not-allowed"
              style={{
                borderRadius: "var(--rad)",
                background: loading ? "var(--g1)" : "var(--g1)",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "var(--o1)";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "var(--g1)";
              }}
            >
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

          {/* First-time users register via a separate Sign Up page.       */}
          {/* Only the link is wired here — build the registration screen  */}
          {/* at this route separately.                                   */}
          <p className="mt-5 text-center text-[13px] text-[var(--txt2)]">
            First time here?{" "}
            <a
              href="/register"
              className="font-semibold transition-colors"
              style={{ color: "var(--o1)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--g1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--o1)")
              }
            >
              Create an account
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-[var(--txt3)]">
          © 2026 Excel Crop Group · Multan, Pakistan
        </p>
      </div>
      </div>
    </div>
  );
};

export default LoginPage;
