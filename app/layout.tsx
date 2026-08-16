import type { Metadata } from 'next';
import './globals.css';
import { fontVariables } from './fonts';
import { Providers } from '@/components/providers';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Migamor — Calidad, horno y corazón',
  description:
    'Plataforma B2B de Migamor: queques y galletas estilo New York, congelados y prehorneados. Pedidos mayoristas y al detalle.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={fontVariables}>
      <body className="font-body antialiased">
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
