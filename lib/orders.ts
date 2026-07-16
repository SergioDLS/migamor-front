import type { OrderStatus } from './api';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  requested: 'Solicitado',
  confirmed: 'Confirmado',
  in_production: 'En producción',
  shipped: 'Despachado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const STATUS_ORDER: OrderStatus[] = [
  'requested',
  'confirmed',
  'in_production',
  'shipped',
  'delivered',
];

/** Siguiente estado permitido en la máquina de estados, o null si es final. */
export function nextStatus(status: OrderStatus): OrderStatus | null {
  const idx = STATUS_ORDER.indexOf(status);
  return idx >= 0 && idx < STATUS_ORDER.length - 1
    ? STATUS_ORDER[idx + 1]
    : null;
}

export function statusVariant(
  status: OrderStatus,
): 'default' | 'secondary' | 'outline' {
  if (status === 'delivered') return 'default';
  if (status === 'requested') return 'outline';
  return 'secondary';
}

// Progresión de color de marca por estado (blush → coral → cream → mint → chocolate).
export const STATUS_STYLES: Record<OrderStatus, string> = {
  requested: 'bg-brand-blush/60 text-brand-chocolate',
  confirmed: 'bg-brand-coral text-white',
  in_production: 'bg-brand-cream text-brand-chocolate',
  shipped: 'bg-brand-mint text-emerald-800',
  delivered: 'bg-brand-chocolate text-brand-cream',
  cancelled: 'bg-destructive/15 text-destructive',
};
