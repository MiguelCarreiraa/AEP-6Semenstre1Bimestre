import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { CheckIcon, ChevronIcon } from './Icons';
import { corDoPaciente, iniciais } from '../utils';

/* ---------- Avatar ---------- */

export function Avatar({ id, nome, size = 40 }: { id: string; nome: string; size?: number }) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.4, ['--avatar' as string]: corDoPaciente(id) }}
      aria-hidden
    >
      {iniciais(nome)}
    </span>
  );
}

/* ---------- Anel de progresso (estilo Activity rings) ---------- */

export function ProgressRing({ value, total, size = 76 }: { value: number; total: number; size?: number }) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : value / total;
  return (
    <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${value} de ${total} doses`}>
      <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
      <circle
        className={clsx('ring-value', pct >= 1 && 'is-done')}
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

/* ---------- Botão de check da dose ---------- */

export function CheckButton({ checked, onCheck, label }: { checked: boolean; onCheck: () => void; label: string }) {
  return (
    <button
      type="button"
      className={clsx('check', checked && 'is-checked')}
      aria-pressed={checked}
      aria-label={checked ? `${label}: dose de hoje registrada` : `Marcar ${label} como tomado`}
      disabled={checked}
      onClick={(e) => {
        e.stopPropagation();
        onCheck();
      }}
    >
      <CheckIcon width={18} height={18} />
    </button>
  );
}

/* ---------- Lista agrupada (inset grouped) ---------- */

export function Group({ header, footer, children }: { header?: ReactNode; footer?: ReactNode; children: ReactNode }) {
  return (
    <section className="group">
      {header && <h3 className="group-header">{header}</h3>}
      <div className="group-body">{children}</div>
      {footer && <p className="group-footer">{footer}</p>}
    </section>
  );
}

export function Row({
  leading,
  title,
  subtitle,
  trailing,
  chevron,
  onClick,
  className,
}: {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  chevron?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const content = (
    <>
      {leading && <span className="row-leading">{leading}</span>}
      <span className="row-text">
        <span className="row-title">{title}</span>
        {subtitle && <span className="row-subtitle">{subtitle}</span>}
      </span>
      {trailing && <span className="row-trailing">{trailing}</span>}
      {chevron && <ChevronIcon className="row-chevron" width={14} height={14} />}
    </>
  );
  if (!onClick) return <div className={clsx('row', className)}>{content}</div>;
  return (
    <div
      role="button"
      tabIndex={0}
      className={clsx('row is-pressable', className)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {content}
    </div>
  );
}

/* ---------- Campos de formulário ---------- */

export function Field({
  label,
  error,
  hint,
  ...input
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const id = useId();
  return (
    <div className={clsx('field', error && 'has-error')}>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} {...input} />
      {(error || hint) && (
        <p id={`${id}-msg`} className="field-msg" role={error ? 'alert' : undefined}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

/* ---------- Botões ---------- */

export function Button({
  variant = 'filled',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'filled' | 'tinted' | 'plain' | 'destructive' }) {
  return <button type="button" className={clsx('btn', `btn-${variant}`, className)} {...props} />;
}

export function BarButton({
  bold,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { bold?: boolean }) {
  return <button type="button" className={clsx('bar-btn', bold && 'is-bold', className)} {...props} />;
}

/* ---------- Estado vazio ---------- */

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}
