import { useId } from 'react';

/** Marca do DoseCerta: cápsula (dose) com selo de confirmação (certa). */
export function LogoMark({ size = 28 }: { size?: number }) {
  const gradient = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4DA3FF" />
          <stop offset="1" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={`url(#${gradient})`} />
      <g transform="rotate(-45 32 32)">
        <rect x="14" y="24" width="36" height="16" rx="8" fill="#fff" />
        <rect x="32" y="24" width="18" height="16" rx="8" fill="#BFDBFF" />
        <rect x="32" y="24" width="8" height="16" fill="#BFDBFF" />
      </g>
      <circle cx="47" cy="47" r="10" fill="#34C759" stroke="#fff" strokeWidth="3" />
      <path d="M42.5 47l3.4 3.4 6-6.8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Brand() {
  return (
    <div className="brand" role="img" aria-label="DoseCerta">
      <LogoMark />
      <span className="brand-name" aria-hidden="true">
        Dose<span className="brand-accent">Certa</span>
      </span>
    </div>
  );
}
