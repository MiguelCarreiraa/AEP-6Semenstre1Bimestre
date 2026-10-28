import type { Medicamento } from './types';

// ---------- Horários ----------

/** "HH:mm" -> minutos desde a meia-noite. */
export function minutos(horario: string): number {
  const [h, m] = horario.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function agoraEmMinutos(now: Date): number {
  return now.getHours() * 60 + now.getMinutes();
}

export type Periodo = 'Madrugada' | 'Manhã' | 'Tarde' | 'Noite';

export function periodo(horario: string): Periodo {
  const h = Math.floor(minutos(horario) / 60);
  if (h < 6) return 'Madrugada';
  if (h < 12) return 'Manhã';
  if (h < 18) return 'Tarde';
  return 'Noite';
}

// ---------- Datas ----------

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Momento da dose mais recente tomada hoje, ou null se ainda não foi tomada. */
export function doseDeHoje(med: Medicamento, now: Date): Date | null {
  let ultima: Date | null = null;
  for (const r of med.historicoDoses ?? []) {
    const d = new Date(r.dataHora);
    if (isSameDay(d, now) && (!ultima || d > ultima)) ultima = d;
  }
  return ultima;
}

export function formatHora(d: Date): string {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDataHora(d: Date): string {
  return d.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

/** Ex.: "Terça-feira, 28 de outubro". */
export function formatHoje(now: Date): string {
  const s = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Idade em anos a partir de "yyyy-MM-dd", ou null se não informada. */
export function idade(dataNascimento: string | null): number | null {
  if (!dataNascimento) return null;
  const [a, m, d] = dataNascimento.split('-').map(Number);
  if (!a || !m || !d) return null;
  const hoje = new Date();
  let anos = hoje.getFullYear() - a;
  if (hoje.getMonth() + 1 < m || (hoje.getMonth() + 1 === m && hoje.getDate() < d)) anos--;
  return anos;
}

// ---------- Paciente ----------

const CORES = ['#007aff', '#34c759', '#ff9500', '#af52de', '#ff2d55', '#5ac8fa', '#ff3b30', '#5856d6'];

/** Cor fixa por paciente (mesmo id -> mesma cor), no estilo da paleta da Apple. */
export function corDoPaciente(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return CORES[Math.abs(h) % CORES.length];
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

// ---------- Interação ----------

/** Vibração curta em celulares que suportam (feedback ao marcar a dose). */
export function haptic(): void {
  try {
    navigator.vibrate?.(10);
  } catch {
    /* sem suporte */
  }
}
