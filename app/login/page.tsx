'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/brand/logo';
import { PatternBg } from '@/components/brand/pattern-bg';

type Mode = 'login' | 'register';

// El tier de precios se deriva del segmento elegido en el registro.
const ROLE_TIER: Record<Exclude<UserRole, 'admin'>, 'wholesale' | 'retail'> = {
  restaurant: 'wholesale',
  entrepreneur: 'retail',
};

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [role, setRole] = useState<Exclude<UserRole, 'admin'>>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/catalog');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              price_tier: ROLE_TIER[role],
              business_name: businessName,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          router.push('/catalog');
        } else {
          setInfo(
            'Cuenta creada. Revisa tu correo para confirmar antes de ingresar.',
          );
        }
      }
    } catch (err: any) {
      setError(err.message ?? 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <PatternBg variant="sellos" opacity={0.05} size={130} />
      <div className="relative mx-auto max-w-md px-4 py-12">
        <Logo
          variant="simbolo"
          className="mx-auto mb-6 h-14 w-auto text-brand-coral"
        />
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl text-brand-chocolate">
            {mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </CardTitle>
          <CardDescription>
            {mode === 'login'
              ? 'Accede a tu portal Migamor.'
              : 'Regístrate según tu tipo de negocio.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === 'register' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="business">Nombre del negocio</Label>
                  <Input
                    id="business"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Segmento</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-body text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as Exclude<UserRole, 'admin'>)
                    }
                  >
                    <option value="entrepreneur">
                      Emprendedor / Revendedor (precio detalle)
                    </option>
                    <option value="restaurant">
                      Restaurante / Cafetería (precio mayorista)
                    </option>
                  </select>
                </div>
              </>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-primary">{info}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? 'Procesando…'
                : mode === 'login'
                  ? 'Ingresar'
                  : 'Crear cuenta'}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 w-full text-sm text-muted-foreground underline"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
              setInfo(null);
            }}
          >
            {mode === 'login'
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Ingresa'}
          </button>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
