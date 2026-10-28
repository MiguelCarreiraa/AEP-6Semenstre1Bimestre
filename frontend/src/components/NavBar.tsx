import { useEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';

interface NavBarProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}

/**
 * Título grande do iOS que vira título compacto quando sai da tela.
 * A barra só ganha material translúcido quando há conteúdo passando por baixo
 * (scroll edge effect) — no topo ela é transparente, sem divisória.
 */
export function NavBar({ title, subtitle, trailing }: NavBarProps) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), {
      rootMargin: '-52px 0px 0px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className={clsx('navbar', compact && 'is-compact')}>
        <div className="navbar-inner">
          <span className="navbar-title" aria-hidden={!compact}>
            {title}
          </span>
          <div className="navbar-trailing">{trailing}</div>
        </div>
      </div>
      <header className="large-title">
        {subtitle && <p className="large-title-sub">{subtitle}</p>}
        <h1>{title}</h1>
        <div ref={sentinel} className="large-title-sentinel" />
      </header>
    </>
  );
}

export function NavButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="nav-icon-button" aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  );
}
