import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { useStore } from '../store';
import { useNow } from '../hooks';
import { Avatar, Button, CheckButton, EmptyState, Group, PageHeader, ProgressBar, Row, Tag } from '../components/ui';
import { PersonIcon, PillIcon, PlusIcon } from '../components/Icons';
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

  const add = () =>
    openSheet(
      pacientes.length
        ? { type: 'novo-medicamento', pacienteId: filtroAtivo ?? undefined }
        : { type: 'novo-paciente' },
    );

  return (
    <>
      <PageHeader
        title="Hoje"
        subtitle={formatHoje(now)}
        action={
          <Button onClick={add} aria-label="Novo medicamento">
            <PlusIcon width={16} height={16} />
            <span>
              Novo<span className="hide-sm"> medicamento</span>
            </span>
          </Button>
        }
      />

      {pacientes.length === 0 ? (
        <EmptyState
          icon={<PersonIcon width={28} height={28} />}
          title="Nenhum paciente cadastrado"
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
                  <Avatar nome={p.nome} size={22} />
                  {p.nome.split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {lista.length === 0 ? (
            <EmptyState
              icon={<PillIcon width={28} height={28} />}
              title="Nenhum medicamento"
              message="Adicione um medicamento com dosagem e horário para montar a agenda do dia."
              action={<Button onClick={add}>Adicionar medicamento</Button>}
            />
          ) : (
            <>
              <section className="stats card" aria-label="Resumo do dia">
                <div className="stat">
                  <p className="stat-label">Doses de hoje</p>
                  <p className="stat-value tnum">
                    {tomados}
                    <span> de {lista.length}</span>
                  </p>
                  <ProgressBar value={tomados} total={lista.length} />
                </div>
                <div className="stat">
                  <p className="stat-label">Próxima dose</p>
                  {tomados === lista.length ? (
                    <p className="stat-text is-done">Tudo certo por hoje</p>
                  ) : proxima ? (
                    <>
                      <p className="stat-text">{proxima.nomeMedicamento}</p>
                      <p className="stat-sub">
                        às <span className="tnum">{proxima.horario}</span> · {proxima.dosagem}
                      </p>
                    </>
                  ) : (
                    <p className="stat-text is-muted">Sem mais horários hoje</p>
                  )}
                </div>
                <div className="stat">
                  <p className="stat-label">Em atraso</p>
                  <p className={clsx('stat-value tnum', atrasados > 0 && 'is-late')}>{atrasados}</p>
                  <p className="stat-sub">{atrasados === 1 ? 'dose pendente' : 'doses pendentes'}</p>
                </div>
              </section>

              {grupos.map((g) => (
                <Group
                  key={g.periodo}
                  header={g.periodo}
                  aside={`${g.itens.length} ${g.itens.length === 1 ? 'dose' : 'doses'}`}
                >
                  <AnimatePresence initial={false}>
                    {g.itens.map((m) => (
                      <motion.div
                        key={m.id}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
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
      className={clsx('dose', dose && 'is-taken', isNext && 'is-next')}
      onClick={onOpen}
      leading={<span className={clsx('dose-time tnum', atrasado && 'is-late')}>{med.horario}</span>}
      title={med.nomeMedicamento}
      subtitle={
        <>
          {med.dosagem}
          {pacienteNome && <> · {pacienteNome}</>}
          {hora && <> · Tomada às {hora}</>}
        </>
      }
      trailing={
        <>
          {dose ? null : atrasado ? (
            <Tag tone="red">Atrasada</Tag>
          ) : isNext ? (
            <Tag tone="blue">Próxima</Tag>
          ) : null}
          <CheckButton checked={!!dose} onCheck={onCheck} label={med.nomeMedicamento} />
        </>
      }
    />
  );
}
