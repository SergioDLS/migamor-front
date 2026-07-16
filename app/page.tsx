import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        {/* banda de patrón de corazones, sutil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'url(/brand/patron-corazones.png)',
            backgroundSize: '260px',
          }}
        />
        <div className="container relative flex flex-col items-center gap-8 py-16 text-center sm:py-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-principal.svg"
            alt="Masamor — Calidad, horno y corazón"
            className="w-[280px] max-w-full sm:w-[360px]"
          />

          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-brand-chocolate sm:text-5xl">
            Productos horneados con amor,{' '}
            <span className="text-brand-coral">ahora en línea</span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            Queques y galletas estilo New York, congelados y prehorneados.
            Pedidos mayoristas para restaurantes y cafeterías, o al detalle para
            emprendedores y revendedores.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/login" className={buttonVariants({ size: 'lg' })}>
              Ingresar / Registrarse
            </Link>
            <Link
              href="/catalog"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- SEGMENTOS ---------- */}
      <section className="container grid gap-6 py-8 md:grid-cols-2">
        <SegmentCard
          className="bg-brand-blush/40"
          eyebrow="Restaurantes y cafeterías"
          eyebrowClass="text-brand-coral"
          title="Venta mayorista"
          points={[
            'Productos congelados con precios mayoristas.',
            'Display al menor en tu punto de venta.',
            'Branding en galletas y capacitación en uso del producto.',
          ]}
        />
        <SegmentCard
          className="bg-brand-mint/50"
          eyebrow="Emprendedores y revendedores"
          eyebrowClass="text-brand-chocolate"
          title="Venta al detalle"
          points={[
            'Displays listos para revender con tu propio branding.',
            'Capacitación en decoración de galletas.',
            'Portal con historial, seguimiento y recompra simple.',
          ]}
        />
      </section>

      {/* ---------- CÓMO FUNCIONA ---------- */}
      <section className="container py-16">
        <h2 className="mb-10 text-center font-display text-3xl font-semibold text-brand-chocolate">
          ¿Cómo funciona?
        </h2>
        <ol className="grid gap-8 sm:grid-cols-3">
          {[
            { n: '1', t: 'Explora el catálogo', d: 'Con precios según tu segmento, mayorista o detalle.' },
            { n: '2', t: 'Solicita tu pedido', d: 'Sin pago en línea. Masamor revisa y confirma.' },
            { n: '3', t: 'Sigue y recompra', d: 'Estados en tiempo real y recompra desde tu portal.' },
          ].map((s) => (
            <li key={s.n} className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-coral font-display text-xl font-semibold text-white">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-brand-chocolate">
                {s.t}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- CTA sobre textura coral ---------- */}
      <section className="container py-8">
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-16 text-center shadow-sm"
          style={{
            backgroundImage: 'url(/brand/textura-coral.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Lleva tu negocio al siguiente nivel
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Únete a los más de 100 negocios que ya venden productos Masamor cada
            mes.
          </p>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'mt-8 bg-white text-brand-coral hover:bg-white/90',
            )}
          >
            Crear mi cuenta
          </Link>
        </div>
      </section>
    </div>
  );
}

function SegmentCard({
  eyebrow,
  eyebrowClass,
  title,
  points,
  className,
}: {
  eyebrow: string;
  eyebrowClass: string;
  title: string;
  points: string[];
  className?: string;
}) {
  return (
    <div className={cn('rounded-3xl p-8', className)}>
      <p className={cn('text-sm font-semibold uppercase tracking-wide', eyebrowClass)}>
        {eyebrow}
      </p>
      <h3 className="mt-1 font-display text-2xl font-semibold text-brand-chocolate">
        {title}
      </h3>
      <ul className="mt-4 space-y-2 text-brand-chocolate/80">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="mt-1 text-brand-coral">♥</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
