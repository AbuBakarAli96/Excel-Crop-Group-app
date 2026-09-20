import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconClose, IconLeaf, IconChevronLeft, IconChevronRight } from "./icons";

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

export type HeroAccent = "green" | "orange";

const ACCENT_GRADIENT: Record<HeroAccent, string> = {
  green: "linear-gradient(135deg, var(--g1) 0%, var(--g2) 100%)",
  orange: "linear-gradient(135deg, var(--o1) 0%, #a83c00 100%)",
};

/** A tinted wash over the photo — keeps every slide legible and ties real
 * photography back to the brand color instead of looking like generic stock. */
const ACCENT_PHOTO_OVERLAY: Record<HeroAccent, string> = {
  green: "linear-gradient(160deg, rgba(11,46,11,0.78) 0%, rgba(27,110,27,0.5) 45%, rgba(10,30,10,0.72) 100%)",
  orange: "linear-gradient(160deg, rgba(58,20,0,0.78) 0%, rgba(230,81,0,0.48) 45%, rgba(40,14,0,0.72) 100%)",
};

const ACCENT_EYEBROW_BG: Record<HeroAccent, string> = {
  green: "var(--o1)",
  orange: "var(--g1)",
};

// ---------------------------------------------------------------------------
// Hero decoration — soft organic shape + leaf watermark. Only used as a
// fallback when a slide has no photo, so a plain gradient never looks bare.
// ---------------------------------------------------------------------------
const HeroDecoration: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div
      className="ecg-blob ecg-organic ecg-blob-slow"
      style={{
        width: compact ? 130 : 220,
        height: compact ? 130 : 220,
        top: compact ? -30 : -40,
        right: compact ? -20 : -30,
        background: "var(--o1)",
        opacity: 0.16,
      }}
    />
    <div
      className="absolute text-white"
      style={{ bottom: compact ? -10 : -20, left: compact ? -10 : 30, opacity: 0.08, transform: "rotate(-18deg)" }}
    >
      <IconLeaf size={compact ? 90 : 170} />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Hero carousel — up to 3 slides. Manages its own autoplay (paused on
// hover/focus, skipped for prefers-reduced-motion) and renders both the
// full-bleed photo crossfade and the headline/body/controls in sync.
// ---------------------------------------------------------------------------
export interface HeroSlide {
  headline: string;
  body: string;
  /** Path under /public, e.g. "/assets/photos/hero-sprayer.jpg" */
  image?: string;
}

const useCarousel = (length: number) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotionRef = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (length <= 1 || paused || reducedMotionRef.current) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % length), 6500);
    return () => clearInterval(timer);
  }, [length, paused]);

  const go = (index: number) => setActive(((index % length) + length) % length);
  return { active, go, setPaused };
};

const HeroPhotoLayer: React.FC<{ slides: HeroSlide[]; active: number; accent: HeroAccent }> = ({
  slides,
  active,
  accent,
}) => (
  <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
    {slides.map((slide, i) =>
      slide.image ? (
        <div
          key={slide.image}
          className={`ecg-slide-bg ${i === active ? "ecg-slide-bg-active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ) : null
    )}
    <div className="absolute inset-0" style={{ background: ACCENT_PHOTO_OVERLAY[accent] }} />
  </div>
);

const HeroCarouselText: React.FC<{
  slides: HeroSlide[];
  active: number;
  go: (i: number) => void;
}> = ({ slides, active, go }) => (
  <div>
    <div className="relative" style={{ minHeight: 168 }}>
      {slides.map((slide, i) => (
        <div key={slide.headline} className={`ecg-slide space-y-5 ${i === active ? "ecg-slide-active" : ""}`}>
          <h1 className="text-[34px] font-extrabold leading-tight max-w-md">{slide.headline}</h1>
          <p className="text-sm text-white/85 max-w-sm">{slide.body}</p>
        </div>
      ))}
    </div>

    {slides.length > 1 && (
      <div className="flex items-center gap-3 mt-5">
        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="Previous slide"
          className="text-white/70 hover:text-white transition-colors"
        >
          <IconChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.headline}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              className={`ecg-carousel-dot ${i === active ? "ecg-carousel-dot-active" : ""}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="Next slide"
          className="text-white/70 hover:text-white transition-colors"
        >
          <IconChevronRight size={16} />
        </button>
      </div>
    )}
  </div>
);

interface AuthShellProps {
  /** Small pill above the hero headline, e.g. "Sales Order Portal" */
  heroEyebrow?: string;
  /** Single-slide shorthand — kept for pages that don't need the carousel. */
  heroHeadline?: string;
  heroBody?: string;
  heroImage?: string;
  /** 2–3 rotating value props for the hero panel. Takes priority over heroHeadline/heroBody/heroImage when given. */
  heroSlides?: HeroSlide[];
  /** Tints the hero panel/photo wash and eyebrow — "orange" for Admin-facing pages, keeping the same design system while staying visually distinct. */
  accent?: HeroAccent;
  /** Card content — the actual form for this page */
  children: React.ReactNode;
  /** Wider card for pages with more fields (Sign Up) */
  wide?: boolean;
  hideTrustBadges?: boolean;
  /** Shows a close (X) button in the top-right corner of the card, e.g. to dismiss Sign Up and return to Login */
  onClose?: () => void;
}

const AuthShell: React.FC<AuthShellProps> = ({
  heroEyebrow = "Sales Order Portal",
  heroHeadline,
  heroBody,
  heroImage,
  heroSlides,
  accent = "green",
  children,
  wide = false,
  hideTrustBadges = false,
  onClose,
}) => {
  const slides: HeroSlide[] = heroSlides ?? [{ headline: heroHeadline ?? "", body: heroBody ?? "", image: heroImage }];
  const hasPhotos = slides.some((s) => s.image);
  const { active, go, setPaused } = useCarousel(slides.length);

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
          className="hidden min-[980px]:flex min-[980px]:w-1/2 relative overflow-hidden flex-col justify-between p-12 text-white"
          style={{ background: ACCENT_GRADIENT[accent] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {hasPhotos ? (
            <HeroPhotoLayer slides={slides} active={active} accent={accent} />
          ) : (
            <>
              <div className="absolute inset-0 ecg-pattern-dots" />
              <HeroDecoration />
            </>
          )}

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
              style={{ background: ACCENT_EYEBROW_BG[accent] }}
            >
              {heroEyebrow}
            </span>
          </div>

          <div className="relative z-10">
            <HeroCarouselText slides={slides} active={active} go={go} />
            <p dir="rtl" lang="ur" className="mt-5 text-2xl leading-relaxed" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
              ایکسل اور کسان، خوشحال پاکستان
            </p>
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
        {/* Mobile hero strip (<980px) — compact                        */}
        {/* --------------------------------------------------------- */}
        <div
          className="min-[980px]:hidden relative overflow-hidden flex flex-col items-center justify-center text-center px-6 py-7"
          style={{ background: ACCENT_GRADIENT[accent], minHeight: 176 }}
        >
          {hasPhotos ? (
            <HeroPhotoLayer slides={slides} active={active} accent={accent} />
          ) : (
            <>
              <div className="absolute inset-0 ecg-pattern-dots" />
              <HeroDecoration compact />
            </>
          )}
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
              style={{ background: ACCENT_EYEBROW_BG[accent] }}
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
            className={`relative w-full ${wide ? "max-w-[480px]" : "max-w-[420px]"} bg-white p-6 sm:p-8 min-[980px]:p-10 ecg-pop-in`}
            style={{ borderRadius: "var(--rad2)", boxShadow: "var(--sh2)" }}
          >
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3.5 right-3.5 h-8 w-8 rounded-full flex items-center justify-center text-[var(--txt3)] hover:text-[var(--r1)] hover:bg-[var(--g3)] transition-colors"
              >
                <IconClose size={16} />
              </button>
            )}
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
