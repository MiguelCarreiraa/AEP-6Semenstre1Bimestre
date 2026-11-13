import { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../store';
import { Avatar, Button, EmptyState, PageHeader } from '../components/ui';
import { ChevronIcon, PlusIcon, UsersIcon } from '../components/Icons';
import { idade } from '../utils';

export function PacientesScreen() {
  const pacientes = useStore((s) => s.pacientes);
  const medicamentos = useStore((s) => s.medicamentos);
  const openSheet = useStore((s) => s.openSheet);

  const contagem = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of medicamentos) map.set(m.pacienteId, (map.get(m.pacienteId) ?? 0) + 1);
    return map;
  }, [medicamentos]);

  const novo = () => openSheet({ type: 'novo-paciente' });

  return (
    <>
      <PageHeader
        title="Pacientes"
        subtitle={
          pacientes.length ? `${pacientes.length} ${pacientes.length === 1 ? 'paciente cadastrado' : 'pacientes cadastrados'}` : undefined
        }
        action={
          <Button onClick={novo} aria-label="Novo paciente">
            <PlusIcon width={16} height={16} />
            <span>
              Novo<span className="hide-sm"> paciente</span>
            </span>
          </Button>
        }
      />

      {pacientes.length === 0 ? (
        <EmptyState
          icon={<UsersIcon width={28} height={28} />}
          title="Nenhum paciente cadastrado"
          message="Pacientes cadastrados aparecem aqui, com seus medicamentos e contato."
          action={<Button onClick={novo}>Cadastrar paciente</Button>}
        />
      ) : (
        <div className="card table" role="table" aria-label="Pacientes">
          <div className="trow thead" role="row">
            <span role="columnheader">Paciente</span>
            <span role="columnheader" className="col-contact">
              Contato
            </span>
            <span role="columnheader" className="col-meds">
              Medicamentos
            </span>
            <span role="columnheader" className="col-age">
              Idade
            </span>
            <span aria-hidden />
          </div>
          <AnimatePresence initial={false}>
            {pacientes.map((p) => {
              const n = contagem.get(p.id) ?? 0;
              const anos = idade(p.dataNascimento);
              const abrir = () => openSheet({ type: 'paciente', id: p.id });
              return (
                <motion.div
                  key={p.id}
                  className="row-wrap"
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div
                    role="row"
                    tabIndex={0}
                    className="trow is-pressable"
                    onClick={abrir}
                    onKeyDown={(e) => {
                      if (e.target !== e.currentTarget) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        abrir();
                      }
                    }}
                  >
                    <span role="cell" className="cell-person">
                      <Avatar nome={p.nome} />
                      <span className="cell-person-text">
                        <span className="row-title">{p.nome}</span>
                        <span className="row-subtitle only-mobile">
                          {[n === 0 ? 'Sem medicamentos' : `${n} ${n === 1 ? 'medicamento' : 'medicamentos'}`, anos != null ? `${anos} anos` : null]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </span>
                    </span>
                    <span role="cell" className="col-contact cell-muted">
                      {p.contato}
                    </span>
                    <span role="cell" className="col-meds">
                      {n === 0 ? <span className="cell-muted">Nenhum</span> : <span className="count-pill tnum">{n}</span>}
                    </span>
                    <span role="cell" className="col-age cell-muted tnum">
                      {anos != null ? `${anos} anos` : '—'}
                    </span>
                    <ChevronIcon className="row-chevron" width={16} height={16} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
