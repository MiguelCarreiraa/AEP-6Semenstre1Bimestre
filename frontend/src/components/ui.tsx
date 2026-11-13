import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { CheckIcon, ChevronIcon } from './Icons';
import { iniciais } from '../utils';

/* ---------- Cabeçalho de página ---------- */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </header>
  );
}

/* ---------- Avatar ---------- */

export function Avatar({ nome, size = 36 }: { nome: string; size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.38)) }} aria-hidden>
      {iniciais(nome)}
    </span>
  );
}

/* ---------- Etiqueta de status ---------- */

export function Tag({ tone = 'neutral', children }: { tone?: 'neutral' | 'blue' | 'green' | 'red'; children: ReactNode }) {
  return <span className={clsx('tag', `tag-${tone}`)}>{children}</span>;
}

/* ---------- Barra de progresso ---------- */

export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div
      className={clsx('progress', pct >= 100 && 'is-done')}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={value}
      aria-label={`${value} de ${total} doses`}
    >
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------- Registrar dose ---------- */

export function CheckButton({ checked, onCheck, label }: { checked: boolean; onCheck: () => void; label: string }) {
  return (
    <button
      type="button"
      className={clsx('dose-action', checked && 'is-checked')}
      aria-label={checked ? `${label}: dose de hoje registrada` : `Registrar dose de ${label}`}
      disabled={checked}
      onClick={(e) => {
        e.stopPropagation();
        onCheck();
      }}
    >
      <CheckIcon width={16} height={16} />
      <span>{checked ? 'Tomada' : 'Registrar'}</span>
    </button>
  );
}

/* ---------- Cartão com título ---------- */

export function Group({
  header,
  aside,
  footer,
  children,
}: {
  header?: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="group">
      <div className="card">
        {header && (
          <div className="card-head">
            <h3>{header}</h3>
            {aside && <span className="card-aside">{aside}</span>}
          </div>
        )}
        <div className="card-body">{children}</div>
      </div>
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
      {chevron && <ChevronIcon className="row-chevron" width={16} height={16} />}
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
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg';
}) {
  return <button type="button" className={clsx('btn', `btn-${variant}`, size === 'lg' && 'btn-lg', className)} {...props} />;
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
