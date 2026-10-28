// Espelham os modelos do backend (com.aep.monitor.model)

export interface Paciente {
  id: string;
  nome: string;
  contato: string;
  dataNascimento: string | null; // ISO yyyy-MM-dd
}

export interface RegistroDose {
  dataHora: string; // ISO Instant
}

export interface Medicamento {
  id: string;
  pacienteId: string;
  nomeMedicamento: string;
  dosagem: string;
  horario: string; // HH:mm
  tomado: boolean;
  historicoDoses: RegistroDose[];
}

export type NovoPaciente = Omit<Paciente, 'id'>;
export type NovoMedicamento = Pick<Medicamento, 'pacienteId' | 'nomeMedicamento' | 'dosagem' | 'horario'>;
