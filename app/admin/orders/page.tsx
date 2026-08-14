'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, type Order, type OrderStatus } from '@/lib/api';
import { useAuth } from '@/components/auth-provider';
import { formatCLP } from '@/lib/utils';
import { STATUS_LABELS, nextStatus } from '@/lib/orders';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { OrderStatusBadge } from '@/components/brand/order-status-badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default function AdminOrdersPage() {
  const { session, profile, loading } = useAuth();
  const queryClient = useQueryClient();

  // Pedido en proceso de cancelación (modal) + observación.
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [reason, setReason] = useState('');

  const ordersQuery = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => apiFetch<Order[]>('/admin/orders'),
    enabled: !!session && profile?.role === 'admin',
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      apiFetch(`/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  });

  const cancelOrder = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiFetch(`/admin/orders/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      setCancelTarget(null);
      setReason('');
    },
  });

  if (loading)
    return <p className="container py-12 text-muted-foreground">Cargando…</p>;

  if (!session || profile?.role !== 'admin') {
    return (
      <p className="container py-12 text-destructive">
        Acceso restringido. Solo administradores de Migamor.
      </p>
    );
  }

  const orders = ordersQuery.data ?? [];
  const isTerminal = (s: OrderStatus) => s === 'delivered' || s === 'cancelled';

  return (
    <div className="container space-y-6 py-8">
      <h1 className="font-display text-3xl font-semibold text-brand-chocolate">
        Pedidos — Administración
      </h1>

      {ordersQuery.isLoading && (
        <p className="text-muted-foreground">Cargando pedidos…</p>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-cream/50 hover:bg-brand-cream/50">
              <TableHead className="font-accent text-[0.65rem] uppercase tracking-widest">Pedido</TableHead>
              <TableHead className="font-accent text-[0.65rem] uppercase tracking-widest">Cliente</TableHead>
              <TableHead className="font-accent text-[0.65rem] uppercase tracking-widest">Fecha</TableHead>
              <TableHead className="font-accent text-[0.65rem] uppercase tracking-widest">Total</TableHead>
              <TableHead className="font-accent text-[0.65rem] uppercase tracking-widest">Estado</TableHead>
              <TableHead className="font-accent text-[0.65rem] uppercase tracking-widest text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const next = nextStatus(order.status);
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    #{order.id.slice(0, 8)}
                    <div className="text-muted-foreground">
                      {order.items.length} ítem(s)
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.customer?.businessName ?? '—'}
                    <div className="text-xs text-muted-foreground">
                      {order.customer?.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('es-CL')}
                  </TableCell>
                  <TableCell>
                    {formatCLP(order.total ? Number(order.total) : null)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                    {order.status === 'cancelled' && order.cancellationReason && (
                      <p className="mt-1 max-w-[220px] text-xs italic text-muted-foreground">
                        “{order.cancellationReason}”
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isTerminal(order.status) ? (
                      <span className="text-xs text-muted-foreground">
                        Finalizado
                      </span>
                    ) : (
                      <div className="flex justify-end gap-2">
                        {next && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              updateStatus.mutate({ id: order.id, status: next })
                            }
                          >
                            → {STATUS_LABELS[next]}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            setReason('');
                            cancelOrder.reset();
                            setCancelTarget(order);
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {updateStatus.isError && (
        <p className="text-sm text-destructive">
          {(updateStatus.error as Error).message}
        </p>
      )}

      {/* ---------- Modal de cancelación ---------- */}
      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-chocolate/40 p-4"
          onClick={() => !cancelOrder.isPending && setCancelTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-xl font-semibold text-brand-chocolate">
              Cancelar pedido #{cancelTarget.id.slice(0, 8)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Indica el motivo de la cancelación. El cliente podrá verlo en su
              portal.
            </p>

            <Textarea
              autoFocus
              className="mt-4"
              placeholder="Ej: sin stock del producto solicitado para la fecha."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            {cancelOrder.isError && (
              <p className="mt-2 text-sm text-destructive">
                {(cancelOrder.error as Error).message}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="ghost"
                disabled={cancelOrder.isPending}
                onClick={() => setCancelTarget(null)}
              >
                Volver
              </Button>
              <Button
                variant="destructive"
                disabled={reason.trim().length < 3 || cancelOrder.isPending}
                onClick={() =>
                  cancelOrder.mutate({
                    id: cancelTarget.id,
                    reason: reason.trim(),
                  })
                }
              >
                {cancelOrder.isPending ? 'Cancelando…' : 'Confirmar cancelación'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
