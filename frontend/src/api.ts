import type { Medicamento, NovoMedicamento, NovoPaciente, Paciente, RegistroDose } from './types';

const BASE = '/api';

/**
 * Erro da API. O GlobalExceptionHandler devolve dois formatos:
 *  - 404/409: { status, erro, mensagem }
 *  - 400 de validação: { campo: mensagem }
 */
export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(status: number, body: unknown) {
    const b = (body ?? {}) as Record<string, unknown>;
    const fields: Record<string, string> = {};
    if (status === 400 && typeof b === 'object' && !('mensagem' in b)) {
      for (const [k, v] of Object.entries(b)) if (typeof v === 'string') fields[k] = v;
    }
    const message =
      typeof b.mensagem === 'string'
        ? b.mensagem
        : Object.values(fields)[0] ?? (status === 0 ? 'Sem conexão com a API' : `Erro ${status}`);
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError(0, null);
  }
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* corpo vazio */
    }
    // Proxy do Vite responde 500/502/504 quando o Spring está fora do ar
    throw new ApiError(res.status >= 500 && body == null ? 0 : res.status, body);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const json = (body: unknown) => JSON.stringify(body);

export const api = {
  pacientes: {
    listar: () => request<Paciente[]>('/pacientes'),
    cadastrar: (p: NovoPaciente) => request<Paciente>('/pacientes', { method: 'POST', body: json(p) }),
    remover: (id: string) => request<void>(`/pacientes/${id}`, { method: 'DELETE' }),
  },
  medicamentos: {
    listar: () => request<Medicamento[]>('/medicamentos'),
    cadastrar: (m: NovoMedicamento) =>
      request<Medicamento>('/medicamentos', { method: 'POST', body: json(m) }),
    historico: (id: string) => request<RegistroDose[]>(`/medicamentos/${id}/historico`),
    atualizarHorario: (id: string, horario: string) =>
      request<Medicamento>(`/medicamentos/${id}/horario`, { method: 'PATCH', body: json({ horario }) }),
    marcarComoTomado: (id: string) =>
      request<Medicamento>(`/medicamentos/${id}/tomado`, { method: 'PATCH' }),
    remover: (id: string) => request<void>(`/medicamentos/${id}`, { method: 'DELETE' }),
  },
};

/** URL absoluta usada para disparar exclusões pendentes ao fechar a aba (fetch keepalive). */
export const deleteUrl = (kind: 'pacientes' | 'medicamentos', id: string) => `${BASE}/${kind}/${id}`;
