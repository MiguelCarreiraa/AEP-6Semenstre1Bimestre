import { useState, type FormEvent } from 'react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { ApiError, useStore } from '../store';
import { Sheet } from '../components/Sheet';
import { Avatar, BarButton, Field, Group } from '../components/ui';

const HORARIO = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Sugere a próxima hora cheia — o caso mais comum ao cadastrar. */
function proximaHoraCheia() {
  const h = (new Date().getHours() + 1) % 24;
  return `${String(h).padStart(2, '0')}:00`;
}

export function NovoMedicamentoSheet({ pacienteId, onClose }: { pacienteId?: string; onClose: () => void }) {
  const pacientes = useStore((s) => s.pacientes);
  const cadastrar = useStore((s) => s.cadastrarMedicamento);
  const [paciente, setPaciente] = useState(pacienteId ?? (pacientes.length === 1 ? pacientes[0].id : ''));
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horario, setHorario] = useState(proximaHoraCheia);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const valido = paciente !== '' && nome.trim() !== '' && dosagem.trim() !== '' && HORARIO.test(horario);

  const clear = (k: string) => setErrors(({ [k]: _, ...rest }) => rest);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!valido || saving) return;
    setSaving(true);
    try {
      const m = await cadastrar({ pacienteId: paciente, nomeMedicamento: nome.trim(), dosagem: dosagem.trim(), horario });
      toast.success(`${m.nomeMedicamento} adicionado`, { description: `Todos os dias às ${m.horario}` });
      onClose();
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length) setErrors(err.fields);
      else toast.error('Não foi possível adicionar', { description: (err as Error).message });
      setSaving(false);
    }
  }

  return (
    <Sheet
      title="Novo Medicamento"
      onClose={onClose}
      leading={<BarButton onClick={onClose}>Cancelar</BarButton>}
      trailing={
        <BarButton bold type="submit" form="form-medicamento" disabled={!valido || saving}>
          Adicionar
        </BarButton>
      }
    >
      <form id="form-medicamento" onSubmit={submit} noValidate>
        <Group header="Paciente" footer={errors.pacienteId}>
          <div className="picker" role="radiogroup" aria-label="Paciente">
            {pacientes.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={paciente === p.id}
                className={clsx('picker-item', paciente === p.id && 'is-active')}
                onClick={() => {
                  setPaciente(p.id);
                  clear('pacienteId');
                }}
              >
                <Avatar id={p.id} nome={p.nome} size={44} />
                <span>{p.nome.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </Group>

        <Group header="Medicamento">
          <Field
            label="Nome"
            placeholder="Losartana"
            autoCapitalize="words"
            autoCorrect="off"
            enterKeyHint="next"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              clear('nomeMedicamento');
            }}
            error={errors.nomeMedicamento}
          />
          <Field
            label="Dosagem"
            placeholder="50 mg"
            autoCorrect="off"
            enterKeyHint="next"
            value={dosagem}
            onChange={(e) => {
              setDosagem(e.target.value);
              clear('dosagem');
            }}
            error={errors.dosagem}
          />
          <Field
            label="Horário"
            type="time"
            value={horario}
            onChange={(e) => {
              setHorario(e.target.value);
              clear('horario');
            }}
            error={errors.horario}
          />
        </Group>
      </form>
    </Sheet>
  );
}
