import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { ApiError, useStore } from '../store';
import { Sheet } from '../components/Sheet';
import { BarButton, Field, Group } from '../components/ui';

export function NovoPacienteSheet({ onClose }: { onClose: () => void }) {
  const cadastrar = useStore((s) => s.cadastrarPaciente);
  const openSheet = useStore((s) => s.openSheet);
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const valido = nome.trim() !== '' && contato.trim() !== '';
  const hoje = new Date().toISOString().slice(0, 10);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!valido || saving) return;
    setSaving(true);
    try {
      const p = await cadastrar({ nome: nome.trim(), contato: contato.trim(), dataNascimento: nascimento || null });
      toast.success(`${p.nome} cadastrado`, {
        action: { label: 'Adicionar remédio', onClick: () => openSheet({ type: 'novo-medicamento', pacienteId: p.id }) },
      });
      onClose();
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length) setErrors(err.fields);
      else toast.error('Não foi possível cadastrar', { description: (err as Error).message });
      setSaving(false);
    }
  }

  return (
    <Sheet
      title="Novo Paciente"
      onClose={onClose}
      leading={<BarButton onClick={onClose}>Cancelar</BarButton>}
      trailing={
        <BarButton bold type="submit" form="form-paciente" disabled={!valido || saving}>
          Adicionar
        </BarButton>
      }
    >
      <form id="form-paciente" onSubmit={submit} noValidate>
        <Group>
          <Field
            label="Nome"
            placeholder="Maria da Silva"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              setErrors(({ nome: _, ...rest }) => rest);
            }}
            error={errors.nome}
          />
          <Field
            label="Contato"
            placeholder="(44) 99999-0000"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            value={contato}
            onChange={(e) => {
              setContato(e.target.value);
              setErrors(({ contato: _, ...rest }) => rest);
            }}
            error={errors.contato}
          />
          <Field
            label="Nascimento"
            type="date"
            max={hoje}
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            error={errors.dataNascimento}
            hint="Opcional"
          />
        </Group>
      </form>
    </Sheet>
  );
}
