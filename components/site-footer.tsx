import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer
      className="mt-20 bg-brand-chocolate text-brand-cream"
      style={{
        backgroundImage: 'url(/brand/textura-2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container flex flex-col items-center gap-4 py-12 text-center">
        <p className="font-display text-3xl font-semibold tracking-tight text-brand-cream">
          Masamor
        </p>
        <p className="text-sm text-brand-blush">Calidad, horno y corazón</p>

        <nav className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-brand-cream/90">
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

        <p className="mt-4 text-xs text-brand-cream/60">
          © {new Date().getFullYear()} Masamor · Pastelería y productos horneados
        </p>
      </div>
    </footer>
  );
}
