import React from "react";
import { useNavigate } from "react-router-dom";

const LOGO_SRC = "/assets/excel-crop-group-logo.png";

const ManagerIcon: React.FC = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 21c.7-4.2 3-6.5 7-6.5s6.3 2.3 7 6.5" />
    <path d="M19 8.5a2.5 2.5 0 0 1 0 5" />
    <path d="M21 20c-.3-2-1.1-3.5-2.5-4.5" />
  </svg>
);

const AdminIcon: React.FC = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3 4.5 6v5.5c0 4.7 3 7.8 7.5 9.5 4.5-1.7 7.5-4.8 7.5-9.5V6L12 3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ArrowIcon: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--txt)] flex flex-col">
      {/* Top Header */}
      <header
        className="w-full bg-white flex items-center justify-between px-5 sm:px-8 py-3.5"
        style={{
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}
      >
        <img
          src={LOGO_SRC}
          alt="Excel Crop Group"
          className="h-9 sm:h-10 w-auto"
        />

        <span className="hidden sm:block text-[12px] font-medium text-[var(--txt3)]">
          Sales Order Portal
        </span>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Photographic banner — real Excel Crop Group imagery instead of a
            plain gradient, so the entry point feels like a real product. */}
        <div
          className="relative w-full overflow-hidden flex items-end justify-center"
          style={{ height: 220, backgroundImage: "url(/assets/photos/hero-sprayer.jpg)", backgroundSize: "cover", backgroundPosition: "center 65%" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(11,46,11,0.35) 0%, rgba(11,46,11,0.55) 55%, var(--bg) 100%)" }}
          />
          <div className="relative z-10 flex flex-col items-center pb-5 text-center px-4">
            <span className="ecg-logo-chip mb-2">
              <img src={LOGO_SRC} alt="Excel Crop Group" className="h-7 w-auto" />
            </span>
            <span className="text-white text-[12.5px] font-semibold tracking-wide">
              Improving Agriculture · Improving Lives
            </span>
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center px-4 py-8 sm:px-6">
          <div
            className="absolute -bottom-40 -right-32 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "#fff3e8",
              opacity: 0.8,
            }}
          />

          <div className="relative z-10 w-full max-w-[850px]">
          {/* Heading */}
          <div className="text-center mb-9">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-[11.5px] font-bold"
              style={{
                background: "var(--g3)",
                color: "var(--g1)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--o1)" }}
              />
              Secure Sales Order Portal
            </div>

            <h1 className="text-[28px] sm:text-[36px] font-extrabold leading-tight text-[var(--g1)]">
              Welcome to Excel Crop Group
            </h1>

            <p className="mt-3 text-[14px] sm:text-[15px] text-[var(--txt2)] max-w-[580px] mx-auto leading-relaxed">
              Choose how you want to access the Sales Order Management Portal.
              Select your account type to continue.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Manager */}
            <button
              type="button"
              onClick={() => navigate("/login?role=manager")}
              className="group text-left bg-white p-6 sm:p-7 cursor-pointer transition-all duration-200"
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--rad2)",
                boxShadow: "var(--sh)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--sh2)";
                e.currentTarget.style.borderColor = "#b9dcb9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--sh)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "var(--g3)",
                  color: "var(--g1)",
                }}
              >
                <ManagerIcon />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: "var(--o1)" }}
                  >
                    Account Type
                  </p>

                  <h2 className="text-[21px] font-extrabold text-[var(--g1)]">
                    Manager
                  </h2>
                </div>

                <span
                  className="mt-1 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "var(--g1)" }}
                >
                  <ArrowIcon />
                </span>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-[var(--txt2)]">
                Login as a Territory Manager or Regional Manager to create,
                manage and recommend sales orders.
              </p>

              <div
                className="mt-5 pt-4 flex items-center gap-2 text-[12px] font-semibold"
                style={{
                  borderTop: "1px solid var(--border)",
                  color: "var(--g1)",
                }}
              >
                Continue as Manager
                <ArrowIcon />
              </div>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => navigate("/admin-login")}
              className="group text-left bg-white p-6 sm:p-7 cursor-pointer transition-all duration-200"
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--rad2)",
                boxShadow: "var(--sh)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--sh2)";
                e.currentTarget.style.borderColor = "#f1c7a9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--sh)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "#fff0e6",
                  color: "var(--o1)",
                }}
              >
                <AdminIcon />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: "var(--o1)" }}
                  >
                    Account Type
                  </p>

                  <h2 className="text-[21px] font-extrabold text-[var(--g1)]">
                    Admin
                  </h2>
                </div>

                <span
                  className="mt-1 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "var(--o1)" }}
                >
                  <ArrowIcon />
                </span>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-[var(--txt2)]">
                Login as Head Office Admin to manage regions, territories,
                approvals, master data and invoices.
              </p>

              <div
                className="mt-5 pt-4 flex items-center gap-2 text-[12px] font-semibold"
                style={{
                  borderTop: "1px solid var(--border)",
                  color: "var(--o1)",
                }}
              >
                Continue as Admin
                <ArrowIcon />
              </div>
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center mt-8">
            <p className="text-[11.5px] text-[var(--txt3)]">
              Authorized Excel Crop Group personnel only
            </p>
          </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-[11px] text-[var(--txt3)]">
          © 2026 Excel Crop Group · Multan, Pakistan
        </p>
      </footer>
    </div>
  );
};

export default RoleSelection;