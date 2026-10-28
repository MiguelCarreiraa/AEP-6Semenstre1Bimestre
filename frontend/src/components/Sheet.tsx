import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useDragControls, useReducedMotion, type PanInfo } from 'motion/react';

/**
 * Projeção de momento da Apple (Designing Fluid Interfaces, WWDC18):
 * onde o gesto "pararia" se continuasse desacelerando como um scroll.
 */
function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

interface SheetProps {
  title: string;
  onClose: () => void;
  leading?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}

/**
 * Bottom sheet no estilo iOS:
 * - entra/sai pelo mesmo caminho (consistência espacial)
 * - arrasta 1:1 pela alça, com rubber-band para cima
 * - decide fechar pela projeção da velocidade, não só pela posição
 * - mola criticamente amortecida (sem bounce) na abertura
 */
export function Sheet({ title, onClose, leading, trailing, children }: SheetProps) {
  const reduce = useReducedMotion();
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
    // O sinal da velocidade manda: um flick para cima nunca fecha.
    if (info.velocity.y >= 0 && projected > height * 0.5) onClose();
  }

  const hidden = reduce ? { opacity: 0 } : { y: offscreen };

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      className="sheet"
      initial={hidden}
      animate={reduce ? { opacity: 1 } : { y: 0 }}
      exit={{ ...hidden, transition: reduce ? { duration: 0.15 } : { type: 'spring', bounce: 0, duration: 0.35 } }}
      transition={reduce ? { duration: 0.2 } : { type: 'spring', bounce: 0, duration: 0.45 }}
      drag={reduce ? false : 'y'}
      dragListener={false}
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.04, bottom: 1 }}
      dragTransition={{ bounceStiffness: 500, bounceDamping: 42 }}
      onDragEnd={onDragEnd}
    >
      <div className="sheet-head" onPointerDown={(e) => controls.start(e)}>
        <div className="grabber" />
        <div className="sheet-bar">
          <div className="sheet-bar-side">{leading}</div>
          <h2 className="sheet-title">{title}</h2>
          <div className="sheet-bar-side end">{trailing}</div>
        </div>
      </div>
      <div className="sheet-body">{children}</div>
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
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      onClick={onClick}
    />
  );
}
