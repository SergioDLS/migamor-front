'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { Logo } from './brand/logo';
import { Button, buttonVariants } from './ui/button';

export function SiteHeader() {
  const { session, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Migamor — inicio">
          <Logo
            variant="compacto"
            className="h-9 w-auto text-brand-chocolate sm:h-10"
          />
        </Link>

        <nav className="flex items-center gap-1 font-body">
          {session ? (
            <>
              <Link
                href="/catalog"
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Catálogo
              </Link>
              <Link
                href="/portal/orders"
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Mis pedidos
              </Link>
              {profile?.role === 'admin' && (
                <Link
                  href="/admin/orders"
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  Admin
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Salir
              </Button>
            </>
          ) : (
            <Link href="/login" className={buttonVariants({ size: 'sm' })}>
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
