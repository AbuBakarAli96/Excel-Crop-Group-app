import React from "react";
import { IconDoc } from "../../components/icons";

const ComingSoon: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div>
      <h1 className="stitle mb-6">{title}</h1>
      <div className="ecg-card ecg-reveal flex flex-col items-center justify-center text-center py-16 px-6">
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--g3)", color: "var(--g1)" }}
        >
          <IconDoc size={24} />
        </div>
        <h2 className="text-[17px] font-bold text-[var(--txt)] mb-1.5">
          {title} is on the way
        </h2>
        <p className="text-[13.5px] text-[var(--txt2)] max-w-sm">
          This screen is next up in the build order. It will follow the same
          look and feel as the rest of the portal once it's wired to live data.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
