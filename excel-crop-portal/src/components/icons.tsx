import React from "react";

type IconProps = { size?: number; className?: string };
const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
});

export const IconGrid: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconOrders: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5" />
    <path d="M8 13h8M8 17h5" />
  </svg>
);

export const IconTag: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.5 3H4a1 1 0 0 0-1 1v5.5a2 2 0 0 0 .83 1.5l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </svg>
);

export const IconDoc: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5" />
    <path d="M8 13h8M8 17h8M8 9h3" />
  </svg>
);

export const IconUsers: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="17.5" cy="9" r="2.6" />
    <path d="M15.8 13.2a5.6 5.6 0 0 1 5.7 5.6" />
  </svg>
);

export const IconMap: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
);

export const IconReport: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20V10M10 20V4M16 20v-7M20 20V13" />
  </svg>
);

export const IconSettings: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.46V21a2 2 0 1 1-4 0v-.09A1.6 1.6 0 0 0 9.18 19a1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.9 15a1.6 1.6 0 0 0-1.46-.97H3.3a2 2 0 1 1 0-4h.09A1.6 1.6 0 0 0 5 8.82a1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.6 1.6 0 0 0 9 4.6a1.6 1.6 0 0 0 .97-1.46V3a2 2 0 1 1 4 0v.09A1.6 1.6 0 0 0 15 4.6a1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.6 1.6 0 0 0 19.4 9a1.6 1.6 0 0 0 1.46.97H21a2 2 0 1 1 0 4h-.09a1.6 1.6 0 0 0-1.51.97Z" />
  </svg>
);

export const IconLogout: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const IconBell: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const IconMenu: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IconClose: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const IconPlus: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconInvoice: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M7 3h10a1 1 0 0 1 1 1v17l-3-2-2 2-2-2-2 2-2-2-3 2V4a1 1 0 0 1 1-1Z" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
);

export const IconChevronRight: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconBuilding: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="4" y="3" width="10" height="18" rx="1" />
    <path d="M14 8h6v13h-6M7 7h1M7 11h1M7 15h1M10.5 7h1M10.5 11h1M10.5 15h1" />
  </svg>
);

export const IconSearch: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const IconChevronDown: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconInbox: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </svg>
);

export const IconLeaf: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M11 20A7 7 0 0 1 4 13V8a1 1 0 0 1 1-1h5a7 7 0 0 1 7 7v1a5 5 0 0 1-5 5Z" />
    <path d="M4.5 8.5 20 3" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconUsersGroup: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="8" r="3" />
    <path d="M2 20c.5-3.5 2.8-5.5 6-5.5s5.5 2 6 5.5" />
    <path d="M14.5 14.6c2.9.3 4.9 2.2 5.5 5.4" />
  </svg>
);

export const IconActivity: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M22 12h-4l-3 8-6-16-3 8H2" />
  </svg>
);

export const IconChevronLeft: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const IconTrash: React.FC<IconProps> = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16" />
    <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
    <path d="M6 7l1 13a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 17 20l1-13" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
