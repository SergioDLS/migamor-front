import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Masamor — Calidad, horno y corazón',
  description:
    'Plataforma B2B de Masamor: queques y galletas estilo New York, congelados y prehorneados. Pedidos mayoristas y al detalle.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="font-[var(--font-nunito)] antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
