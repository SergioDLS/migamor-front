import type { OrderStatus } from '@/lib/api';
import { STATUS_LABELS, STATUS_STYLES } from '@/lib/orders';
import { cn } from '@/lib/utils';

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
