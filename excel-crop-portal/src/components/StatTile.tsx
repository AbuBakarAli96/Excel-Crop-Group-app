import React from "react";

interface StatTileProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: "green" | "orange" | "teal";
  delayMs?: number;
}

const StatTile: React.FC<StatTileProps> = ({ label, value, icon: Icon, accent = "green", delayMs = 0 }) => {
  const palette = {
    green: { color: "var(--g1)", bg: "var(--g3)" },
    orange: { color: "var(--o1)", bg: "#fff1e6" },
    teal: { color: "var(--g2)", bg: "#e6f5ee" },
  }[accent];

  return (
    <div
      className="ecg-card ecg-reveal p-4 md:p-5 flex items-center gap-4"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div
        className="h-11 w-11 rounded-[10px] flex items-center justify-center shrink-0"
        style={{ background: palette.bg, color: palette.color }}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-[22px] font-extrabold text-[var(--txt)] leading-tight truncate">{value}</div>
        <div className="text-[12.5px] text-[var(--txt2)] truncate">{label}</div>
      </div>
    </div>
  );
};

export default StatTile;
