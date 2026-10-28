// Ícones no estilo SF Symbols (traço arredondado, peso regular).
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const PlusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ChevronIcon = (p: P) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} strokeWidth={3} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" pathLength={1} />
  </svg>
);

export const PillIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)" />
    <path d="m8.6 8.6 6.8 6.8" />
  </svg>
);

export const PillFillIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <g transform="rotate(-45 12 12)">
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" fill="currentColor" opacity="0.35" />
      <path d="M12 8.5h6A3.5 3.5 0 0 1 18 15.5h-6z" fill="currentColor" />
    </g>
  </svg>
);

export const PersonIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
  </svg>
);

export const PersonFillIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <circle cx="12" cy="8" r="4.5" />
    <path d="M3.5 21a8.5 8.5 0 0 1 17 0z" />
  </svg>
);

export const CalendarIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const CalendarFillIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" fill="currentColor" />
    <rect x="3.5" y="10" width="17" height="10.5" rx="0" fill="var(--card)" opacity="0.35" />
    <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 4h3.5l1.5 4.5-2 1.5a11 11 0 0 0 6 6l1.5-2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4.5h6V7" />
  </svg>
);

export const WifiOffIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.4-1.8M2 9.5a15 15 0 0 1 4.3-2.7M22 9.5A15 15 0 0 0 11 5.6" />
    <circle cx="12" cy="20" r="0.6" fill="currentColor" />
  </svg>
);
