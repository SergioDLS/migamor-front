import { supabase } from './supabase';

/** Wrapper para llamar al backend NestJS con el JWT de Supabase. */
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token ?? ''}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Error ${res.status}`);
  }

  // 204 / respuestas vacías
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

// ---- Tipos compartidos con el backend ----
export type PriceTier = 'wholesale' | 'retail';
export type UserRole = 'restaurant' | 'entrepreneur' | 'admin';
export type OrderStatus =
  | 'requested'
  | 'confirmed'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface CatalogProduct {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  tier: PriceTier;
  price: number | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  product: { id: string; name: string };
}

export interface StatusEvent {
  id: string;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: string | null;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  items: OrderItem[];
  history: StatusEvent[];
  customer?: { businessName: string | null; role: UserRole };
}
