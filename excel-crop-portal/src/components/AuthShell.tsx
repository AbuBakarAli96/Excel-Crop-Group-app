import React from "react";
import { Link } from "react-router-dom";

const LOGO_SRC = "/assets/excel-crop-group-logo.png";

// ---------------------------------------------------------------------------
// Small trust-badge icons (kept local & tiny — not worth a shared icon set)
// ---------------------------------------------------------------------------
const ShieldIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const ClockIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const NetworkIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="6" r="2.4" />
    <circle cx="19" cy="6" r="2.4" />
    <circle cx="12" cy="18" r="2.4" />
    <path d="M6.9 7.6 10.5 16M17.1 7.6 13.5 16M7.4 6h9.2" />
  </svg>
);

const TRUST_ITEMS = [
  { icon: ShieldIcon, label: "Secure & encrypted" },
  { icon: ClockIcon, label: "24/7 support" },
  { icon: NetworkIcon, label: "Nationwide network" },
];

// ---------------------------------------------------------------------------
// Mobile hero animation — floating gradient blobs + drifting particles
// ---------------------------------------------------------------------------
const MobileHeroAnimation: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="ecg-blob ecg-glow" style={{ width: 130, height: 130, top: -30, left: -20, background: "var(--o1)", opacity: 0.28 }} />
    <div className="ecg-blob ecg-blob-slow" style={{ width: 100, height: 100, bottom: -24, right: -10, background: "#ffffff", opacity: 0.16 }} />
    <div className="ecg-blob" style={{ width: 60, height: 60, top: 18, right: 40, background: "var(--o3)", opacity: 0.22, animationDelay: "1.2s" }} />
    {[...Array(6)].map((_, i) => (
      <span
        key={i}
        className="ecg-particle"
        style={{
          width: 4,
          height: 4,
          background: "#ffffff",
          left: `${12 + i * 15}%`,
          bottom: 10,
          animationDelay: `${i * 0.7}s`,
          animationDuration: `${4.5 + (i % 3)}s`,
        }}
      />
    ))}
  </div>
);

interface AuthShellProps {
  /** Small pill above the hero headline, e.g. "Sales Order Portal" */
  heroEyebrow?: string;
  heroHeadline: string;
  heroBody: string;
  /** Card content — the actual form for this page */
  children: React.ReactNode;
  /** Wider card for pages with more fields (Sign Up) */
  wide?: boolean;
  hideTrustBadges?: boolean;
}

const AuthShell: React.FC<AuthShellProps> = ({
  heroEyebrow = "Sales Order Portal",
  heroHeadline,
  heroBody,
  children,
  wide = false,
  hideTrustBadges = false,
}) => {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--txt)] flex flex-col">
      {/* Header — logo only, no marketing nav */}
      <header
        className="w-full bg-white flex items-center px-4 sm:px-6 py-2.5 sm:py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Link to="/login" className="flex items-center">
          <img
            src={LOGO_SRC}
            alt="Excel Crop Group"
            className="h-7 sm:h-8 w-auto"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
        </Link>
      </header>

      <div className="flex-1 w-full flex flex-col min-[980px]:flex-row min-[980px]:items-stretch">
        {/* --------------------------------------------------------- */}
        {/* Left hero panel — desktop only (>=980px)                    */}
        {/* --------------------------------------------------------- */}
        <div
          className="hidden min-[980px]:flex min-[980px]:w-1/2 relative overflow-hidden flex-col justify-between p-12 text-white ecg-pattern-dots"
          style={{ background: "linear-gradient(135deg, var(--g1) 0%, var(--g2) 100%)" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 60%)" }}
          />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20" style={{ background: "var(--o1)" }} />
          <div className="absolute top-10 right-10 w-24 h-24 rounded-full opacity-20 ecg-glow" style={{ background: "var(--o3)" }} />

          <div className="relative z-10 flex items-center gap-4">
            <span className="ecg-logo-chip">
              <img
                src={LOGO_SRC}
                alt="Excel Crop Group"
                className="h-9 w-auto"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
            </span>
            <span
              className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide"
              style={{ background: "var(--o1)" }}
            >
              {heroEyebrow}
            </span>
          </div>

          <div className="relative z-10 space-y-5">
            <h1 className="text-[34px] font-extrabold leading-tight max-w-md">{heroHeadline}</h1>
            <p dir="rtl" lang="ur" className="text-2xl leading-relaxed" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
              ایکسل اور کسان، خوشحال پاکستان
            </p>
            <p className="text-sm text-white/85 max-w-sm">{heroBody}</p>
          </div>

          <div className="relative z-10 space-y-4">
            {!hideTrustBadges && (
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {TRUST_ITEMS.map((t) => (
                  <div key={t.label} className="flex items-center gap-1.5 text-[12px] text-white/85">
                    <t.icon />
                    {t.label}
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-white/70">Improving Agriculture · Improving Lives</div>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* Mobile hero strip (<980px) — compact, animated              */}
        {/* --------------------------------------------------------- */}
        <div
          className="min-[980px]:hidden relative overflow-hidden flex flex-col items-center justify-center text-center px-6 py-7 ecg-pattern-dots"
          style={{ background: "linear-gradient(135deg, var(--g1) 0%, var(--g2) 100%)", minHeight: 176 }}
        >
          <MobileHeroAnimation />
          <div className="relative z-10 flex flex-col items-center">
            <span className="ecg-logo-chip mb-2.5">
              <img
                src={LOGO_SRC}
                alt="Excel Crop Group"
                className="h-8 w-auto"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
            </span>
            <span
              className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide text-white"
              style={{ background: "var(--o1)" }}
            >
              {heroEyebrow}
            </span>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* Card — right side on desktop, normal flow on mobile         */}
        {/* --------------------------------------------------------- */}
        <div className="flex-1 flex flex-col items-center min-[980px]:justify-center px-4 sm:px-6 pt-6 pb-8 min-[980px]:py-6">
          <div
            className={`w-full ${wide ? "max-w-[480px]" : "max-w-[420px]"} bg-white p-6 sm:p-8 min-[980px]:p-10 ecg-pop-in`}
            style={{ borderRadius: "var(--rad2)", boxShadow: "var(--sh2)" }}
          >
            {children}
          </div>

          <p className="mt-6 text-center text-[11px] text-[var(--txt3)]">
            © 2026 Excel Crop Group · Multan, Pakistan
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
