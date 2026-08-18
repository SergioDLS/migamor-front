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
//
// Todos los badges van con fondo claro y texto chocolate: el coral a plena
// saturación no alcanza contraste AA con ningún color de texto (blanco 2.9:1,
// chocolate 4.2:1, crema 2.4:1), porque su luminancia queda justo en medio.
// Al 25% sobre el fondo conserva el matiz identificador y llega a 9.5:1.
export const STATUS_STYLES: Record<OrderStatus, string> = {
  requested: 'bg-brand-blush/60 text-brand-chocolate',
  confirmed: 'bg-brand-coral/25 text-brand-chocolate',
  in_production: 'bg-brand-cream text-brand-chocolate',
  shipped: 'bg-brand-mint text-brand-chocolate',
  delivered: 'bg-brand-chocolate text-brand-cream',
  cancelled: 'bg-destructive/15 text-destructive',
};
