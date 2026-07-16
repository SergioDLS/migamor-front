import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Publishable key (sb_publishable_...). Reemplaza a la legacy anon key;
  // mismo bajo privilegio, respeta RLS. Segura de exponer al navegador.
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
