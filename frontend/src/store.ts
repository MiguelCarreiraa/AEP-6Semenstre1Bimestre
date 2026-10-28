import { create } from 'zustand';
import { toast } from 'sonner';
import { api, ApiError, deleteUrl } from './api';
import type { Medicamento, NovoMedicamento, NovoPaciente, Paciente } from './types';
import { haptic } from './utils';

type Status = 'loading' | 'ready' | 'error';

export type Sheet =
  | { type: 'novo-medicamento'; pacienteId?: string }
  | { type: 'novo-paciente' }
  | { type: 'medicamento'; id: string }
  | { type: 'paciente'; id: string }
  | null;

interface State {
  status: Status;
  pacientes: Paciente[];
  medicamentos: Medicamento[];
  sheet: Sheet;

  openSheet: (s: Sheet) => void;
  load: () => Promise<void>;
  cadastrarPaciente: (p: NovoPaciente) => Promise<Paciente>;
  cadastrarMedicamento: (m: NovoMedicamento) => Promise<Medicamento>;
  marcarComoTomado: (id: string) => Promise<void>;
  atualizarHorario: (id: string, horario: string) => Promise<void>;
  removerMedicamento: (id: string) => void;
  removerPaciente: (id: string) => void;
}

const UNDO_MS = 5000;

/**
 * Exclusões com "Desfazer" (Apple: forgiveness > diálogo de confirmação).
 * O item some na hora; o DELETE só vai para a API depois da janela de desfazer.
 */
const pendentes = new Map<string, { kind: 'pacientes' | 'medicamentos'; timer: number }>();

if (typeof window !== 'undefined') {
  // Se a aba fechar antes do prazo, a exclusão ainda acontece.
  window.addEventListener('pagehide', () => {
    for (const [id, { kind, timer }] of pendentes) {
      clearTimeout(timer);
      fetch(deleteUrl(kind, id), { method: 'DELETE', keepalive: true });
    }
    pendentes.clear();
  });
}

const sortMeds = (list: Medicamento[]) =>
  [...list].sort((a, b) => a.horario.localeCompare(b.horario) || a.nomeMedicamento.localeCompare(b.nomeMedicamento));
const sortPacientes = (list: Paciente[]) => [...list].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

export const useStore = create<State>((set, get) => {
  const replaceMed = (m: Medicamento) =>
    set((s) => ({ medicamentos: sortMeds(s.medicamentos.map((x) => (x.id === m.id ? m : x))) }));

  function agendarExclusao<T extends { id: string }>(
    kind: 'pacientes' | 'medicamentos',
    item: T,
    titulo: string,
    restore: (item: T) => void,
  ) {
    const timer = window.setTimeout(async () => {
      pendentes.delete(item.id);
      try {
        await (kind === 'pacientes' ? api.pacientes.remover(item.id) : api.medicamentos.remover(item.id));
      } catch (e) {
        restore(item);
        toast.error('Não foi possível remover', { description: (e as Error).message });
      }
    }, UNDO_MS);
    pendentes.set(item.id, { kind, timer });

    toast(titulo, {
      duration: UNDO_MS,
      action: {
        label: 'Desfazer',
        onClick: () => {
          const p = pendentes.get(item.id);
          if (!p) return;
          clearTimeout(p.timer);
          pendentes.delete(item.id);
          restore(item);
        },
      },
    });
  }

  return {
    status: 'loading',
    pacientes: [],
    medicamentos: [],
    sheet: null,

    openSheet: (sheet) => set({ sheet }),

    load: async () => {
      if (get().status !== 'ready') set({ status: 'loading' });
      try {
        const [pacientes, medicamentos] = await Promise.all([api.pacientes.listar(), api.medicamentos.listar()]);
        set({
          status: 'ready',
          pacientes: sortPacientes(pacientes.filter((p) => !pendentes.has(p.id))),
          medicamentos: sortMeds(medicamentos.filter((m) => !pendentes.has(m.id))),
        });
      } catch {
        set({ status: 'error' });
      }
    },

    cadastrarPaciente: async (p) => {
      const novo = await api.pacientes.cadastrar(p);
      set((s) => ({ pacientes: sortPacientes([...s.pacientes, novo]) }));
      return novo;
    },

    cadastrarMedicamento: async (m) => {
      const novo = await api.medicamentos.cadastrar(m);
      set((s) => ({ medicamentos: sortMeds([...s.medicamentos, novo]) }));
      return novo;
    },

    marcarComoTomado: async (id) => {
      const anterior = get().medicamentos.find((m) => m.id === id);
      if (!anterior) return;
      // Otimista: a UI responde no mesmo frame do toque.
      haptic();
      replaceMed({
        ...anterior,
        tomado: true,
        historicoDoses: [...anterior.historicoDoses, { dataHora: new Date().toISOString() }],
      });
      try {
        replaceMed(await api.medicamentos.marcarComoTomado(id));
      } catch (e) {
        replaceMed(anterior);
        toast.error('Não foi possível registrar a dose', { description: (e as Error).message });
      }
    },

    atualizarHorario: async (id, horario) => {
      replaceMed(await api.medicamentos.atualizarHorario(id, horario));
    },

    removerMedicamento: (id) => {
      const med = get().medicamentos.find((m) => m.id === id);
      if (!med) return;
      set((s) => ({ medicamentos: s.medicamentos.filter((m) => m.id !== id) }));
      agendarExclusao('medicamentos', med, `${med.nomeMedicamento} removido`, (m) =>
        set((s) => ({ medicamentos: sortMeds([...s.medicamentos, m]) })),
      );
    },

    removerPaciente: (id) => {
      const pac = get().pacientes.find((p) => p.id === id);
      if (!pac) return;
      if (get().medicamentos.some((m) => m.pacienteId === id)) {
        // Mesmo bloqueio do backend (409), avisado antes de tentar.
        toast.error('Paciente possui medicamentos', {
          description: 'Remova os medicamentos deste paciente antes de removê-lo.',
        });
        return;
      }
      set((s) => ({ pacientes: s.pacientes.filter((p) => p.id !== id) }));
      agendarExclusao('pacientes', pac, `${pac.nome} removido`, (p) =>
        set((s) => ({ pacientes: sortPacientes([...s.pacientes, p]) })),
      );
    },
  };
});

export { ApiError };
