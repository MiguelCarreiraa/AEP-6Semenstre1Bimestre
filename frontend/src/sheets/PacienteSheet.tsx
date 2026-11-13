import { useStore } from '../store';
import { useNow } from '../hooks';
import { Sheet } from '../components/Sheet';
import { Button, Group, Row, Tag } from '../components/ui';
import { CakeIcon, PhoneIcon, PillIcon, PlusIcon, TrashIcon } from '../components/Icons';
import { doseDeHoje, idade } from '../utils';

const nascFmt = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function PacienteSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const paciente = useStore((s) => s.pacientes.find((p) => p.id === id));
  const todos = useStore((s) => s.medicamentos);
  const openSheet = useStore((s) => s.openSheet);
  const remover = useStore((s) => s.removerPaciente);
  const now = useNow();

  if (!paciente) return null;

  const meds = todos.filter((m) => m.pacienteId === id);
  const anos = idade(paciente.dataNascimento);
  const tel = paciente.contato.replace(/[^\d+]/g, '');

  return (
    <Sheet
      title={paciente.nome}
      subtitle={[
        anos != null ? `${anos} anos` : null,
        meds.length === 0 ? 'Sem medicamentos' : `${meds.length} ${meds.length === 1 ? 'medicamento' : 'medicamentos'}`,
      ]
        .filter(Boolean)
        .join(' · ')}
      onClose={onClose}
      footer={
        <>
          <Button
            variant="danger"
            className="footer-start"
            disabled={meds.length > 0}
            title={meds.length > 0 ? 'Remova os medicamentos deste paciente para poder removê-lo.' : undefined}
            onClick={() => {
              onClose();
              remover(paciente.id);
            }}
          >
            <TrashIcon width={16} height={16} />
            Remover
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </>
      }
    >
      <div className="sheet-stack">
        <Group header="Informações">
          <Row
            leading={
              <span className="icon-tile">
                <PhoneIcon width={17} height={17} />
              </span>
            }
            title={
              paciente.contato.includes('@') ? (
                <a className="link" href={`mailto:${paciente.contato.trim()}`}>
                  {paciente.contato}
                </a>
              ) : tel.length >= 8 ? (
                <a className="link" href={`tel:${tel}`}>
                  {paciente.contato}
                </a>
              ) : (
                paciente.contato
              )
            }
            subtitle="Contato"
          />
          {paciente.dataNascimento && (
            <Row
              leading={
                <span className="icon-tile">
                  <CakeIcon width={17} height={17} />
                </span>
              }
              title={nascFmt.format(new Date(paciente.dataNascimento))}
              subtitle="Nascimento"
            />
          )}
        </Group>

        <Group
          header="Medicamentos"
          aside={meds.length > 0 ? String(meds.length) : undefined}
          footer={meds.length > 0 ? 'Remova os medicamentos deste paciente para poder removê-lo.' : undefined}
        >
          {meds.map((m) => {
            const tomado = !!doseDeHoje(m, now);
            return (
              <Row
                key={m.id}
                leading={
                  <span className="icon-tile">
                    <PillIcon width={17} height={17} />
                  </span>
                }
                title={m.nomeMedicamento}
                subtitle={`${m.dosagem} · ${m.horario}`}
                trailing={tomado ? <Tag tone="green">Tomada hoje</Tag> : undefined}
                chevron
                onClick={() => openSheet({ type: 'medicamento', id: m.id })}
              />
            );
          })}
          <button
            type="button"
            className="row is-pressable row-link"
            onClick={() => openSheet({ type: 'novo-medicamento', pacienteId: paciente.id })}
          >
            <PlusIcon width={16} height={16} />
            Adicionar medicamento
          </button>
        </Group>
      </div>
    </Sheet>
  );
}
