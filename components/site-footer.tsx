import Link from 'next/link';
import { Logo } from './brand/logo';

export function SiteFooter() {
  return (
    <footer
      className="mt-20 bg-brand-chocolate text-brand-cream"
      style={{
        backgroundImage: 'url(/brand/textura-chocolate.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container flex flex-col items-center gap-4 py-12 text-center">
        <Logo
          variant="horizontal"
          className="h-20 w-auto text-brand-cream"
          title="Migamor — Calidad, horno y corazón"
        />

        <nav className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 font-body text-sm text-brand-cream/90">
          <Link href="/catalog" className="hover:text-white">
            Catálogo
          </Link>
          <Link href="/portal/orders" className="hover:text-white">
            Mis pedidos
          </Link>
          <Link href="/login" className="hover:text-white">
            Ingresar
          </Link>
        </nav>

        <p className="mt-4 font-body text-xs text-brand-cream/60">
          © {new Date().getFullYear()} Migamor · Pastelería y productos horneados
        </p>
      </div>
    </footer>
  );
}
