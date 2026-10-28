import type { Medicamento } from './types';

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * O backend guarda "tomado" como flag permanente e anexa um RegistroDose a cada
 * marcação. Para a agenda do dia, o que importa é se existe registro de HOJE.
 * Documentos antigos sem histórico caem de volta na flag.
 */
export function doseDeHoje(m: Medicamento, now = new Date()): Date | null {
  const hoje = m.historicoDoses
    .map((d) => new Date(d.dataHora))
    .filter((d) => isSameDay(d, now))
    .sort((a, b) => b.getTime() - a.getTime());
  if (hoje[0]) return hoje[0];
  if (m.tomado && m.historicoDoses.length === 0) return new Date(NaN);
  return null;
}

export function minutos(horario: string) {
  const [h, m] = horario.split(':').map(Number);
  return h * 60 + m;
}

export function agoraEmMinutos(now = new Date()) {
  return now.getHours() * 60 + now.getMinutes();
}

export type Periodo = 'Madrugada' | 'Manhã' | 'Tarde' | 'Noite';

export function periodo(horario: string): Periodo {
  const h = Number(horario.slice(0, 2));
  if (h < 5) return 'Madrugada';
  if (h < 12) return 'Manhã';
  if (h < 18) return 'Tarde';
  return 'Noite';
}

const horaFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dataHoraFmt = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});
const diaFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

export const formatHora = (d: Date) => (Number.isNaN(d.getTime()) ? '' : horaFmt.format(d));
export const formatDataHora = (d: Date) => dataHoraFmt.format(d);
export const formatHoje = (d = new Date()) => {
  const s = diaFmt.format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function idade(dataNascimento: string | null): number | null {
  if (!dataNascimento) return null;
  const [y, m, d] = dataNascimento.split('-').map(Number);
  const now = new Date();
  let anos = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) anos--;
  return anos;
}

export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const first = partes[0][0];
  const last = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** Cor estável por paciente, a partir da paleta de cores do sistema da Apple. */
const CORES = ['#FF9500', '#34C759', '#5AC8FA', '#AF52DE', '#FF2D55', '#5856D6', '#FFCC00', '#00C7BE'];
export function corDoPaciente(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return CORES[Math.abs(h) % CORES.length];
}

/** Retorno tátil discreto, só em momentos que importam (Apple: "Utility"). */
export function haptic(ms = 8) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* sem suporte */
  }
}
