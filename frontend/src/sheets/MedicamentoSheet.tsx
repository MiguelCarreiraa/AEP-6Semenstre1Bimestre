import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useStore } from '../store';
import { useNow } from '../hooks';
import { api } from '../api';
import { Sheet } from '../components/Sheet';
import { Avatar, Button, Group, Row, Tag } from '../components/ui';
import { CheckIcon, ClockIcon, TrashIcon } from '../components/Icons';
import { doseDeHoje, formatDataHora, formatHora, isSameDay } from '../utils';
import type { RegistroDose } from '../types';

export function MedicamentoSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const med = useStore((s) => s.medicamentos.find((m) => m.id === id));
  const paciente = useStore((s) => s.pacientes.find((p) => p.id === med?.pacienteId));
  const openSheet = useStore((s) => s.openSheet);
  const marcar = useStore((s) => s.marcarComoTomado);
  const atualizarHorario = useStore((s) => s.atualizarHorario);
  const remover = useStore((s) => s.removerMedicamento);
  const now = useNow();

  const [horario, setHorario] = useState(med?.horario ?? '');
  const [saving, setSaving] = useState(false);
  const [historico, setHistorico] = useState<RegistroDose[] | null>(null);

  // Histórico vem do endpoint dedicado; enquanto carrega, usa o que já está em memória.
  useEffect(() => {
    let alive = true;
    api.medicamentos
      .historico(id)
      .then((h) => alive && setHistorico(h))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id, med?.historicoDoses.length]);

  if (!med) return null;

  const dose = doseDeHoje(med, now);
  const mudouHorario = horario !== med.horario && horario !== '';
  const doses = [...(historico ?? med.historicoDoses)]
    .map((d) => new Date(d.dataHora))
    .sort((a, b) => b.getTime() - a.getTime());

  async function salvarHorario() {
    setSaving(true);
    try {
      await atualizarHorario(med!.id, horario);
      toast.success('Horário atualizado', { description: `${med!.nomeMedicamento} às ${horario}` });
    } catch (e) {
      toast.error('Não foi possível atualizar', { description: (e as Error).message });
      setHorario(med!.horario);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet
      title={med.nomeMedicamento}
      subtitle={med.dosagem}
      onClose={onClose}
      footer={
        <>
          <Button
            variant="danger"
            className="footer-start"
            onClick={() => {
              onClose();
              remover(med.id);
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
        {dose ? (
          <div className="taken-banner" role="status">
            <CheckIcon width={18} height={18} />
            {formatHora(dose) ? `Dose de hoje tomada às ${formatHora(dose)}` : 'Dose de hoje registrada'}
          </div>
        ) : (
          <Button size="lg" onClick={() => marcar(med.id)}>
            <CheckIcon width={18} height={18} />
            Registrar dose de hoje
          </Button>
        )}

        {paciente && (
          <Group header="Paciente">
            <Row
              leading={<Avatar nome={paciente.nome} size={32} />}
              title={paciente.nome}
              subtitle="Ver detalhes do paciente"
              chevron
              onClick={() => openSheet({ type: 'paciente', id: paciente.id })}
            />
          </Group>
        )}

        <Group header="Horário" footer="O medicamento aparece na agenda todos os dias neste horário.">
          <div className="row">
            <span className="row-leading icon-tile">
              <ClockIcon width={18} height={18} />
            </span>
            <label className="row-text row-title" htmlFor="horario-edit">
              Todos os dias às
            </label>
            <input
              id="horario-edit"
              className="inline-time tnum"
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            />
          </div>
          {mudouHorario && (
            <div className="row row-actions">
              <Button variant="ghost" onClick={() => setHorario(med.horario)}>
                Desfazer
              </Button>
              <Button onClick={salvarHorario} disabled={saving}>
                Salvar horário
              </Button>
            </div>
          )}
        </Group>

        <Group
          header="Histórico de doses"
          aside={doses.length > 0 ? `${doses.length} ${doses.length === 1 ? 'registro' : 'registros'}` : undefined}
          footer={doses.length > 8 ? `Mostrando as 8 mais recentes de ${doses.length}.` : undefined}
        >
          {doses.length === 0 ? (
            <div className="row">
              <span className="row-text row-subtitle">Nenhuma dose registrada ainda.</span>
            </div>
          ) : (
            doses.slice(0, 8).map((d, i) => (
              <div className="row" key={d.getTime() + '-' + i}>
                <span className="row-leading dot" />
                <span className="row-text row-title tnum">{formatDataHora(d)}</span>
                {isSameDay(d, now) && <Tag tone="green">Hoje</Tag>}
              </div>
            ))
          )}
        </Group>
      </div>
    </Sheet>
  );
}
