'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFetch, type CatalogProduct } from '@/lib/api';
import { useAuth } from '@/components/auth-provider';
import { formatCLP } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ProductThumb } from '@/components/brand/product-thumb';
import { HeartMark } from '@/components/brand/heart-mark';

export default function CatalogPage() {
  const { session, profile, loading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => apiFetch<CatalogProduct[]>('/products'),
    enabled: !!session,
  });

  const createOrder = useMutation({
    mutationFn: (items: { productId: string; quantity: number }[]) =>
      apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({ items, notes: notes || undefined }),
      }),
    onSuccess: () => {
      setCart({});
      setNotes('');
      router.push('/portal/orders');
    },
  });

  const products = productsQuery.data ?? [];

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([productId, quantity]) => {
          const product = products.find((p) => p.id === productId);
          return { productId, quantity, product };
        }),
    [cart, products],
  );

  const total = cartItems.reduce(
    (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
    0,
  );

  const setQty = (id: string, qty: number) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, qty) }));

  if (!loading && !session) {
    return (
      <p className="container py-12 text-muted-foreground">
        Debes{' '}
        <a href="/login" className="underline">
          ingresar
        </a>{' '}
        para ver el catálogo y sus precios.
      </p>
    );
  }

  return (
    <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-brand-chocolate">
            Catálogo
          </h1>
          {profile && (
            <Badge variant="secondary">
              Precios {profile.priceTier === 'wholesale' ? 'mayoristas' : 'detalle'}
            </Badge>
          )}
        </div>

        {productsQuery.isLoading && (
          <p className="text-muted-foreground">Cargando productos…</p>
        )}
        {productsQuery.isError && (
          <p className="text-destructive">
            Error cargando el catálogo: {(productsQuery.error as Error).message}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <ProductThumb
                name={p.name}
                imageUrl={p.imageUrl}
                className="aspect-[4/3] w-full"
              />
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-lg text-brand-chocolate">
                  {p.name}
                </CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-2xl font-bold text-brand-coral">
                  {formatCLP(p.price)}
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Input
                  type="number"
                  min={0}
                  className="w-20"
                  value={cart[p.id] ?? 0}
                  onChange={(e) => setQty(p.id, Number(e.target.value))}
                />
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => setQty(p.id, (cart[p.id] ?? 0) + 1)}
                >
                  Agregar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <aside className="lg:sticky lg:top-8 h-fit">
        <Card className="border-brand-blush/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-xl text-brand-chocolate">
              <HeartMark className="h-5 w-5 text-brand-coral" />
              Tu pedido
            </CardTitle>
            <CardDescription>Sin pago en línea. Masamor confirma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {cartItems.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aún no agregas productos.
              </p>
            )}
            {cartItems.map((i) => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span>
                  {i.product?.name} × {i.quantity}
                </span>
                <span>{formatCLP((i.product?.price ?? 0) * i.quantity)}</span>
              </div>
            ))}

            {cartItems.length > 0 && (
              <>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-display text-lg text-brand-chocolate">
                    Total
                  </span>
                  <span className="text-xl font-bold text-brand-coral">
                    {formatCLP(total)}
                  </span>
                </div>
                <Textarea
                  placeholder="Notas para Masamor (opcional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2">
            <Button
              disabled={cartItems.length === 0 || createOrder.isPending}
              onClick={() =>
                createOrder.mutate(
                  cartItems.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                  })),
                )
              }
            >
              {createOrder.isPending ? 'Enviando…' : 'Solicitar pedido'}
            </Button>
            {createOrder.isError && (
              <p className="text-sm text-destructive">
                {(createOrder.error as Error).message}
              </p>
            )}
          </CardFooter>
        </Card>
      </aside>
    </div>
  );
}
