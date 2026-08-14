import localFont from 'next/font/local';

/**
 * Tipografías de marca Migamor (Guía de uso gráfico).
 *
 * Centralizadas aquí a propósito: Balgin, BD Sans y Klatsch Grotesk son fuentes
 * comerciales y su licencia de webfont está pendiente de confirmar con el
 * estudio de diseño. Si no cubriera el uso en producción, sustituir las tres
 * familias es un cambio de este solo archivo.
 */

/** Fuente principal — títulos cortos, botones, precios. */
export const balgin = localFont({
  src: [
    { path: './fonts/balgin-light.woff2', weight: '300', style: 'normal' },
    { path: './fonts/balgin-light-italic.woff2', weight: '300', style: 'italic' },
    { path: './fonts/balgin-regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/balgin-semibold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
});

/**
 * Fuente secundaria — eyebrows, números de paso, subtítulos.
 * Muy ancha y trackeada: usar solo en textos de menos de ~40 caracteres.
 */
export const bdSans = localFont({
  src: [{ path: './fonts/bd-sans-black.woff2', weight: '900', style: 'normal' }],
  variable: '--font-accent',
  display: 'swap',
});

/** Fuente de apoyo — texto corrido, tablas, formularios. */
export const klatsch = localFont({
  src: [
    { path: './fonts/klatsch-regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/klatsch-bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
});

export const fontVariables = `${balgin.variable} ${bdSans.variable} ${klatsch.variable}`;
