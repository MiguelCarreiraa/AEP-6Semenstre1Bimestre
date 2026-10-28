import { useStore } from '../store';
import { useNow } from '../hooks';
import { Sheet } from '../components/Sheet';
import { Avatar, BarButton, Group, Row } from '../components/ui';
import { PhoneIcon, PillIcon, PlusIcon, TrashIcon } from '../components/Icons';
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
    <Sheet title={paciente.nome} onClose={onClose} trailing={<BarButton bold onClick={onClose}>OK</BarButton>}>
      <div className="hero">
        <Avatar id={paciente.id} nome={paciente.nome} size={84} />
        <h3>{paciente.nome}</h3>
        {anos != null && <p>{anos} anos</p>}
      </div>

      <Group header="Informações">
        <Row
          leading={
            <span className="icon-tile" style={{ ['--tile' as string]: 'var(--green)' }}>
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
            leading={<span className="icon-tile" style={{ ['--tile' as string]: 'var(--pink)' }}>🎂</span>}
            title={nascFmt.format(new Date(paciente.dataNascimento))}
            subtitle="Nascimento"
          />
        )}
      </Group>

      <Group header={`Medicamentos (${meds.length})`}>
        {meds.map((m) => {
          const tomado = !!doseDeHoje(m, now);
          return (
            <Row
              key={m.id}
              leading={
                <span className="icon-tile" style={{ ['--tile' as string]: tomado ? 'var(--green)' : 'var(--blue)' }}>
                  <PillIcon width={17} height={17} />
                </span>
              }
              title={m.nomeMedicamento}
              subtitle={`${m.dosagem} · ${m.horario}${tomado ? ' · tomado hoje' : ''}`}
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
          <PlusIcon width={18} height={18} />
          Adicionar medicamento
        </button>
      </Group>

      <Group footer={meds.length > 0 ? 'Remova os medicamentos deste paciente para poder removê-lo.' : undefined}>
        <button
          type="button"
          className="row is-pressable row-destructive"
          disabled={meds.length > 0}
          onClick={() => {
            onClose();
            remover(paciente.id);
          }}
        >
          <TrashIcon width={18} height={18} />
          Remover paciente
        </button>
      </Group>
    </Sheet>
  );
}
