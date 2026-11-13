import clsx from 'clsx';
import { CalendarIcon, UsersIcon } from './Icons';
import { Brand } from './Logo';

export type Tab = 'hoje' | 'pacientes';

const ITEMS = [
  { id: 'hoje' as const, label: 'Hoje', Icon: CalendarIcon },
  { id: 'pacientes' as const, label: 'Pacientes', Icon: UsersIcon },
];

/**
 * Navegação principal: barra lateral no desktop, barra inferior no celular.
 * É o mesmo elemento — o CSS muda a disposição.
 */
export function Sidebar({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Brand />
      </div>
      <nav className="sidebar-nav" aria-label="Navegação principal">
        {ITEMS.map(({ id, label, Icon }) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              className={clsx('nav-item', active && 'is-active')}
              aria-current={active ? 'page' : undefined}
              onClick={() => onChange(id)}
            >
              <Icon width={20} height={20} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
