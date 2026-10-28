import { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../store';
import { NavBar, NavButton } from '../components/NavBar';
import { Avatar, Button, EmptyState, Group, Row } from '../components/ui';
import { PersonIcon, PlusIcon } from '../components/Icons';
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

  return (
    <>
      <NavBar
        title="Pacientes"
        subtitle={pacientes.length ? `${pacientes.length} ${pacientes.length === 1 ? 'paciente' : 'pacientes'}` : undefined}
        trailing={
          <NavButton label="Novo paciente" onClick={() => openSheet({ type: 'novo-paciente' })}>
            <PlusIcon width={22} height={22} />
          </NavButton>
        }
      />

      {pacientes.length === 0 ? (
        <EmptyState
          icon={<PersonIcon width={40} height={40} />}
          title="Nenhum paciente"
          message="Pacientes cadastrados aparecem aqui, com seus medicamentos e contato."
          action={<Button onClick={() => openSheet({ type: 'novo-paciente' })}>Cadastrar paciente</Button>}
        />
      ) : (
        <Group>
          <AnimatePresence initial={false}>
            {pacientes.map((p) => {
              const n = contagem.get(p.id) ?? 0;
              const anos = idade(p.dataNascimento);
              return (
                <motion.div
                  key={p.id}
                  className="row-wrap"
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Row
                    onClick={() => openSheet({ type: 'paciente', id: p.id })}
                    leading={<Avatar id={p.id} nome={p.nome} />}
                    title={p.nome}
                    subtitle={[
                      n === 0 ? 'Sem medicamentos' : `${n} ${n === 1 ? 'medicamento' : 'medicamentos'}`,
                      anos != null ? `${anos} anos` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                    chevron
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Group>
      )}
    </>
  );
}
