import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/brand/logo';
import { HeartMark } from '@/components/brand/heart-mark';
import { PatternBg } from '@/components/brand/pattern-bg';
import { Seal, WavyDivider } from '@/components/brand/decor';
import { BakeryIcon, type BakeryIconName } from '@/components/brand/bakery-icon';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <PatternBg variant="corazones" opacity={0.07} size={110} />

        <div className="container relative flex flex-col items-center gap-8 py-16 text-center sm:py-24">
          <Logo
            variant="principal"
            className="w-[260px] max-w-full text-brand-chocolate sm:w-[340px]"
            title="Migamor — Calidad, horno y corazón"
          />

          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-brand-chocolate sm:text-5xl">
            Productos horneados con amor,{' '}
            <span className="text-brand-coral">ahora en línea</span>
          </h1>

          <p className="max-w-xl font-body text-lg text-muted-foreground">
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
          icon="torta"
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
          icon="cupcake"
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

      <WavyDivider className="mx-auto my-6 h-5 w-full max-w-3xl px-6 text-brand-blush" />

      {/* ---------- CÓMO FUNCIONA ---------- */}
      <section className="container py-12">
        <h2 className="mb-12 text-center font-display text-3xl font-semibold text-brand-chocolate">
          ¿Cómo funciona?
        </h2>
        <ol className="grid gap-10 sm:grid-cols-3">
          {[
            { n: '1', t: 'Explora el catálogo', d: 'Con precios según tu segmento, mayorista o detalle.' },
            { n: '2', t: 'Solicita tu pedido', d: 'Sin pago en línea. Migamor revisa y confirma.' },
            { n: '3', t: 'Sigue y recompra', d: 'Estados en tiempo real y recompra desde tu portal.' },
          ].map((s) => (
            <li key={s.n} className="flex flex-col items-center text-center">
              {/* Sello en coral rebajado: a plena saturación el coral no
                  alcanza contraste AA con ningún color de texto. */}
              <span className="relative flex h-16 w-16 items-center justify-center">
                <Seal className="absolute inset-0 h-full w-full text-brand-coral/25" />
                <span className="relative font-accent text-xl leading-none text-brand-chocolate">
                  {s.n}
                </span>
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-brand-chocolate">
                {s.t}
              </h3>
              <p className="mt-1 font-body text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <WavyDivider className="mx-auto my-6 h-5 w-full max-w-3xl px-6 text-brand-blush" />

      {/* ---------- CTA sobre textura coral ---------- */}
      <section className="container py-8">
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-16 text-center shadow-sm"
          style={{
            backgroundImage: 'url(/brand/textura-coral.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Lleva tu negocio al siguiente nivel
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-body text-white/90">
            Únete a los más de 100 negocios que ya venden productos Migamor cada
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
  icon,
  className,
}: {
  eyebrow: string;
  eyebrowClass: string;
  title: string;
  points: string[];
  icon: BakeryIconName;
  className?: string;
}) {
  return (
    <div className={cn('rounded-3xl p-8', className)}>
      <BakeryIcon name={icon} className="mb-4 h-14 w-14 text-brand-chocolate/70" />
      {/* BD Sans es muy ancha: funciona en mayúsculas y tamaño pequeño, no en texto corrido. */}
      <p
        className={cn(
          'font-accent text-xs uppercase tracking-widest',
          eyebrowClass,
        )}
      >
        {eyebrow}
      </p>
      <h3 className="mt-2 font-display text-2xl font-semibold text-brand-chocolate">
        {title}
      </h3>
      <ul className="mt-4 space-y-2 font-body text-brand-chocolate/80">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <HeartMark className="mt-1 h-4 w-4 shrink-0 text-brand-coral" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
