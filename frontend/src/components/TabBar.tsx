import clsx from 'clsx';
import { CalendarFillIcon, CalendarIcon, PersonFillIcon, PersonIcon } from './Icons';

export type Tab = 'hoje' | 'pacientes';

const TABS = [
  { id: 'hoje' as const, label: 'Hoje', Icon: CalendarIcon, ActiveIcon: CalendarFillIcon },
  { id: 'pacientes' as const, label: 'Pacientes', Icon: PersonIcon, ActiveIcon: PersonFillIcon },
];

/** Tab bar flutuante em material translúcido. Troca de aba não anima: é ação frequente. */
export function TabBar({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      <div className="tabbar-inner" role="tablist">
        {TABS.map(({ id, label, Icon, ActiveIcon }) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              className={clsx('tab', active && 'is-active')}
              onPointerDown={() => onChange(id)}
              onClick={() => onChange(id)}
            >
              {active ? <ActiveIcon width={24} height={24} /> : <Icon width={24} height={24} />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
