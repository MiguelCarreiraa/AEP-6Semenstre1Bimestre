/** Marca do DoseCerta: cápsula (dose) com selo de confirmação (certa). */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#2563EB" />
      <g transform="rotate(-45 32 32)">
        <rect x="14" y="24" width="36" height="16" rx="8" fill="#fff" />
        <rect x="32" y="24" width="18" height="16" rx="8" fill="#BFDBFE" />
        <rect x="32" y="24" width="8" height="16" fill="#BFDBFE" />
      </g>
      <circle cx="47" cy="47" r="10" fill="#16A36D" stroke="#fff" strokeWidth="3" />
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
