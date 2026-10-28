import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { useStore } from '../store';
import { useNow } from '../hooks';
import { NavBar, NavButton } from '../components/NavBar';
import { Avatar, Button, CheckButton, EmptyState, Group, ProgressRing, Row } from '../components/ui';
import { PersonIcon, PillFillIcon, PlusIcon } from '../components/Icons';
import { agoraEmMinutos, doseDeHoje, formatHoje, formatHora, minutos, periodo, type Periodo } from '../utils';
import type { Medicamento } from '../types';

const ORDEM: Periodo[] = ['Madrugada', 'Manhã', 'Tarde', 'Noite'];

export function HojeScreen() {
  const pacientes = useStore((s) => s.pacientes);
  const medicamentos = useStore((s) => s.medicamentos);
  const openSheet = useStore((s) => s.openSheet);
  const marcar = useStore((s) => s.marcarComoTomado);
  const now = useNow();
  const [filtro, setFiltro] = useState<string | null>(null);

  const pacientePorId = useMemo(() => new Map(pacientes.map((p) => [p.id, p])), [pacientes]);
  const filtroAtivo = filtro && pacientePorId.has(filtro) ? filtro : null;
  const lista = filtroAtivo ? medicamentos.filter((m) => m.pacienteId === filtroAtivo) : medicamentos;

  const tomados = lista.filter((m) => doseDeHoje(m, now)).length;
  const agora = agoraEmMinutos(now);
  const proxima = lista.find((m) => !doseDeHoje(m, now) && minutos(m.horario) >= agora);
  const atrasados = lista.filter((m) => !doseDeHoje(m, now) && minutos(m.horario) < agora).length;

  const grupos = ORDEM.map((p) => ({ periodo: p, itens: lista.filter((m) => periodo(m.horario) === p) })).filter(
    (g) => g.itens.length > 0,
  );

  const add = () => openSheet(pacientes.length ? { type: 'novo-medicamento', pacienteId: filtroAtivo ?? undefined } : { type: 'novo-paciente' });

  return (
    <>
      <NavBar
        title="Hoje"
        subtitle={formatHoje(now)}
        trailing={
          <NavButton label="Adicionar medicamento" onClick={add}>
            <PlusIcon width={22} height={22} />
          </NavButton>
        }
      />

      {pacientes.length === 0 ? (
        <EmptyState
          icon={<PersonIcon width={40} height={40} />}
          title="Nenhum paciente ainda"
          message="Cadastre um paciente para começar a acompanhar os horários dos medicamentos."
          action={<Button onClick={() => openSheet({ type: 'novo-paciente' })}>Cadastrar paciente</Button>}
        />
      ) : (
        <>
          {pacientes.length > 1 && (
            <div className="chips" role="radiogroup" aria-label="Filtrar por paciente">
              <button
                type="button"
                role="radio"
                aria-checked={!filtroAtivo}
                className={clsx('chip', !filtroAtivo && 'is-active')}
                onClick={() => setFiltro(null)}
              >
                Todos
              </button>
              {pacientes.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={filtroAtivo === p.id}
                  className={clsx('chip', filtroAtivo === p.id && 'is-active')}
                  onClick={() => setFiltro(p.id)}
                >
                  <Avatar id={p.id} nome={p.nome} size={22} />
                  {p.nome.split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {lista.length === 0 ? (
            <EmptyState
              icon={<PillFillIcon width={40} height={40} />}
              title="Nenhum medicamento"
              message="Adicione um medicamento com dosagem e horário para montar a agenda do dia."
              action={<Button onClick={add}>Adicionar medicamento</Button>}
            />
          ) : (
            <>
              <div className="summary card">
                <ProgressRing value={tomados} total={lista.length} />
                <div className="summary-text">
                  <p className="summary-count">
                    <strong>{tomados}</strong> de {lista.length} doses
                  </p>
                  {tomados === lista.length ? (
                    <p className="summary-sub is-done">Tudo certo por hoje.</p>
                  ) : proxima ? (
                    <p className="summary-sub">
                      Próxima: <strong>{proxima.nomeMedicamento}</strong> às{' '}
                      <span className="tnum">{proxima.horario}</span>
                    </p>
                  ) : (
                    <p className="summary-sub">Sem mais horários hoje.</p>
                  )}
                  {atrasados > 0 && (
                    <p className="summary-late">
                      {atrasados} {atrasados === 1 ? 'dose atrasada' : 'doses atrasadas'}
                    </p>
                  )}
                </div>
              </div>

              {grupos.map((g) => (
                <Group key={g.periodo} header={g.periodo}>
                  <AnimatePresence initial={false}>
                    {g.itens.map((m) => (
                      <motion.div
                        key={m.id}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="row-wrap"
                      >
                        <DoseRow
                          med={m}
                          now={now}
                          pacienteNome={filtroAtivo ? undefined : pacientePorId.get(m.pacienteId)?.nome.split(' ')[0]}
                          isNext={proxima?.id === m.id}
                          onOpen={() => openSheet({ type: 'medicamento', id: m.id })}
                          onCheck={() => marcar(m.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Group>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}

function DoseRow({
  med,
  now,
  pacienteNome,
  isNext,
  onOpen,
  onCheck,
}: {
  med: Medicamento;
  now: Date;
  pacienteNome?: string;
  isNext: boolean;
  onOpen: () => void;
  onCheck: () => void;
}) {
  const dose = doseDeHoje(med, now);
  const atrasado = !dose && minutos(med.horario) < agoraEmMinutos(now);
  const hora = dose ? formatHora(dose) : '';

  return (
    <Row
      className={clsx('dose', dose && 'is-taken')}
      onClick={onOpen}
      leading={
        <span className={clsx('dose-time tnum', atrasado && 'is-late', isNext && 'is-next')}>{med.horario}</span>
      }
      title={med.nomeMedicamento}
      subtitle={
        <>
          {med.dosagem}
          {pacienteNome && <> · {pacienteNome}</>}
          {dose ? (
            <span className="tag tag-green">{hora ? `Tomado às ${hora}` : 'Tomado'}</span>
          ) : atrasado ? (
            <span className="tag tag-red">Atrasado</span>
          ) : isNext ? (
            <span className="tag tag-blue">Próxima</span>
          ) : null}
        </>
      }
      trailing={<CheckButton checked={!!dose} onCheck={onCheck} label={med.nomeMedicamento} />}
    />
  );
}
