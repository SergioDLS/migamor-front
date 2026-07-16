'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch, type Order } from '@/lib/api';
import { useAuth } from '@/components/auth-provider';
import { formatCLP } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/brand/order-status-badge';
import { OrderTimeline } from '@/components/brand/order-timeline';
import { HeartMark } from '@/components/brand/heart-mark';

export default function MyOrdersPage() {
  const { session, loading } = useAuth();

  const ordersQuery = useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: () => apiFetch<Order[]>('/orders/mine'),
    enabled: !!session,
  });

  if (!loading && !session) {
    return (
      <p className="container py-12 text-muted-foreground">
        Debes{' '}
        <a href="/login" className="underline">
          ingresar
        </a>{' '}
        para ver tus pedidos.
      </p>
    );
  }

  const orders = ordersQuery.data ?? [];

  return (
    <div className="container space-y-6 py-8">
      <h1 className="font-display text-3xl font-semibold text-brand-chocolate">
        Mis pedidos
      </h1>

      {ordersQuery.isLoading && (
        <p className="text-muted-foreground">Cargando…</p>
      )}
      {ordersQuery.isError && (
        <p className="text-destructive">
          Error: {(ordersQuery.error as Error).message}
        </p>
      )}
      {!ordersQuery.isLoading && orders.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-brand-cream/60 py-16 text-center">
          <HeartMark className="h-12 w-12 text-brand-coral" />
          <p className="text-muted-foreground">
            Todavía no tienes pedidos. Ve al{' '}
            <a href="/catalog" className="font-medium text-brand-coral underline">
              catálogo
            </a>{' '}
            para hacer tu primera solicitud.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="font-display text-lg text-brand-chocolate">
                  Pedido #{order.id.slice(0, 8)}
                </CardTitle>
                <CardDescription>
                  {new Date(order.createdAt).toLocaleDateString('es-CL')} ·{' '}
                  {formatCLP(order.total ? Number(order.total) : null)}
                </CardDescription>
              </div>
              <OrderStatusBadge status={order.status} />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatCLP(Number(item.unitPrice) * item.quantity)}</span>
                </div>
              ))}
              {order.notes && (
                <p className="mt-2 italic">Nota: {order.notes}</p>
              )}
              {order.status === 'cancelled' && order.cancellationReason && (
                <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-destructive">
                  <span className="font-semibold">Motivo de cancelación:</span>{' '}
                  {order.cancellationReason}
                </p>
              )}

              <div className="mt-4 border-t pt-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-chocolate/70">
                  Seguimiento
                </p>
                <OrderTimeline history={order.history} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
