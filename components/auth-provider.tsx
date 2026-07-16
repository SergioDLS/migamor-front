'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { PriceTier, UserRole } from '@/lib/api';

interface Profile {
  role: UserRole;
  priceTier: PriceTier;
  businessName: string | null;
}

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  /** true mientras se resuelve la sesión y (si la hay) el perfil. */
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lee el perfil (rol/tier) directo de Supabase — protegido por RLS own_profile.
  useEffect(() => {
    let active = true;

    if (!session?.user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    supabase
      .from('profiles')
      .select('role, price_tier, business_name')
      .eq('id', session.user.id)
      .maybeSingle() // evita 406 cuando no hay fila
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          // Error transitorio (red/RLS): dejamos el perfil sin resolver.
          console.error('No se pudo cargar el perfil:', error.message);
          setProfile(null);
        } else if (!data) {
          // Sesión válida pero sin perfil (usuario borrado o token obsoleto):
          // cerramos sesión para limpiar el estado inválido.
          console.warn('Sesión sin perfil asociado; cerrando sesión.');
          setProfile(null);
          supabase.auth.signOut();
        } else {
          setProfile({
            role: data.role,
            priceTier: data.price_tier,
            businessName: data.business_name,
          });
        }
        setProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  // Cargando mientras se resuelve la sesión, o el perfil de una sesión activa.
  const loading = authLoading || (!!session && profileLoading);

  return (
    <AuthContext.Provider value={{ session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
