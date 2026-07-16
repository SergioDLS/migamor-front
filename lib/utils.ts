import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea un número como precio en pesos chilenos (CLP). */
export function formatCLP(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Fecha + hora legible (ej: "3 jul 2026, 14:32"). */
export function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
