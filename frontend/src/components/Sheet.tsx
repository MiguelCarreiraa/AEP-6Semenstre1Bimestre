import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useDragControls, useReducedMotion, type PanInfo } from 'motion/react';
import { CloseIcon } from './Icons';
import { useMediaQuery } from '../hooks';

/** Onde o gesto "pararia" se continuasse desacelerando — usado para decidir se fecha. */
function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

interface SheetProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * Painel de detalhes e formulários.
 * - Desktop (≥ 768px): painel lateral que entra pela direita.
 * - Celular: bottom sheet que pode ser arrastado para baixo para fechar.
 */
export function Sheet({ title, subtitle, onClose, footer, children }: SheetProps) {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const controls = useDragControls();
  const ref = useRef<HTMLDivElement>(null);
  const offscreen = typeof window !== 'undefined' ? window.innerHeight : 1000;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
  }, []);

  function onDragEnd(_: unknown, info: PanInfo) {
    const height = ref.current?.offsetHeight ?? 400;
    const projected = info.offset.y + project(info.velocity.y);
    if (info.velocity.y >= 0 && projected > height * 0.5) onClose();
  }

  const hidden = reduce ? { opacity: 0 } : isDesktop ? { x: '100%' } : { y: offscreen };
  const shown = reduce ? { opacity: 1 } : isDesktop ? { x: 0 } : { y: 0 };
  const spring = { type: 'spring' as const, bounce: 0 };

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      className="sheet"
      initial={hidden}
      animate={shown}
      exit={{ ...hidden, transition: reduce ? { duration: 0.12 } : { ...spring, duration: 0.25 } }}
      transition={reduce ? { duration: 0.15 } : { ...spring, duration: 0.35 }}
      drag={reduce || isDesktop ? false : 'y'}
      dragListener={false}
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.04, bottom: 1 }}
      onDragEnd={onDragEnd}
    >
      <div className="sheet-head" onPointerDown={(e) => !isDesktop && controls.start(e)}>
        <div className="grabber" />
        <div className="sheet-bar">
          <div className="sheet-heading">
            <h2 className="sheet-title">{title}</h2>
            {subtitle && <p className="sheet-subtitle">{subtitle}</p>}
          </div>
          <button type="button" className="icon-btn" aria-label="Fechar" onClick={onClose} onPointerDown={(e) => e.stopPropagation()}>
            <CloseIcon width={18} height={18} />
          </button>
        </div>
      </div>
      <div className="sheet-body">{children}</div>
      {footer && <div className="sheet-footer">{footer}</div>}
    </motion.div>
  );
}

export function Scrim({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClick}
    />
  );
}
