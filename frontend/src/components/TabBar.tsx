
import clsx from 'clsx';
import { CalendarIcon, PersonIcon } from './Icons';

export type Tab = 'hoje' | 'pacientes';

const TABS = [
  { id: 'hoje' as const, label: 'Hoje', Icon: CalendarIcon },
  { id: 'pacientes' as const, label: 'Pacientes', Icon: PersonIcon },
];

/** Tab bar flutuante em material translúcido. */
export function TabBar({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      <div className="tabbar-inner" role="tablist">
        {TABS.map(({ id, label, Icon }) => {
          const active = value === id;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              className={clsx('tab', active && 'is-active')}
              onClick={() => onChange(id)}
            >
              <Icon width={24} height={24} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
