# Línea gráfica Migamor — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar el brand kit real de Migamor (tipografías, logos, iconos, elementos, patrones) a las 5 pantallas del front, reemplazando los sustitutos actuales y el nombre "Masamor".

**Architecture:** Los assets elegidos se extraen de `../migamor-assets/` a `public/brand/` y `components/brand/assets/`, transformados para ser recoloreables. Una librería de componentes tipados (`<Logo>`, `<BakeryIcon>`, etc.) los expone; ninguna página conoce rutas de archivo. La tipografía se centraliza en `app/fonts.ts` para que un eventual cambio por licencia sea de un solo archivo.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript 5.6, Tailwind 3.4, `next/font/local`, `woff2_compress`, ImageMagick.

**Spec:** [2026-08-14-linea-grafica-migamor-design.md](../specs/2026-08-14-linea-grafica-migamor-design.md)

## Global Constraints

- Marca: **Migamor** (nunca "Masamor") en todo copy visible, `alt`, `aria-label` y metadata.
- Paleta exacta: `#4e2d1e` chocolate · `#ebaba2` blush · `#f9e6c8` crema · `#ee7264` coral · `#d4eee3` menta · `#ffffff` blanco.
- Los `.ttf`/`.otf` originales NO se versionan; solo los `.woff2` derivados.
- Todo SVG convertido a componente: sin bloque `<defs><style>`, sin `class="cls-N"`, con `fill="currentColor"` en cada `<path>`.
- Ningún asset en `public/brand/` sobre 300 KB.
- El repo no tiene test runner. La verificación de cada tarea es `npx tsc --noEmit` y, donde aplique, revisión visual.
- Trabajar en la branch `feat/linea-grafica-migamor`, no en `main`.

---

### Task 1: Branch y tipografías

**Files:**
- Create: `app/fonts/*.woff2` (7 archivos), `app/fonts.ts`
- Modify: `app/layout.tsx`, `tailwind.config.ts`

**Interfaces:**
- Produces: `app/fonts.ts` exporta `balgin`, `bdSans`, `klatsch` (objetos de `next/font/local`) y `fontVariables: string` con las tres clases `.variable` concatenadas.
- Produces: clases Tailwind `font-display`, `font-accent`, `font-body`.

- [ ] **Step 1: Crear la branch**

```bash
git checkout -b feat/linea-grafica-migamor
```

- [ ] **Step 2: Convertir las 7 fuentes a woff2**

```bash
mkdir -p app/fonts
cd "../migamor-assets/Tipografias"
for f in *.ttf *.otf; do
  cp "$f" /tmp/mgf-"$f"
  woff2_compress /tmp/mgf-"$f"
done
cd -
```

Renombrar a kebab-case al copiar a `app/fonts/`:
`balgin-light.woff2`, `balgin-light-italic.woff2`, `balgin-regular.woff2`,
`balgin-semibold.woff2`, `bd-sans-black.woff2`, `klatsch-regular.woff2`,
`klatsch-bold.woff2`.

Verificar: `ls -la app/fonts/` muestra 7 archivos, ninguno sobre 45 KB.

- [ ] **Step 3: Crear `app/fonts.ts`**

```ts
import localFont from 'next/font/local';

/**
 * Tipografías de marca Migamor (Guía de uso gráfico).
 * Centralizadas aquí a propósito: si la licencia de webfont no cubriera el uso
 * en producción, sustituir las tres familias es un cambio de este solo archivo.
 */

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

export const bdSans = localFont({
  src: [{ path: './fonts/bd-sans-black.woff2', weight: '900', style: 'normal' }],
  variable: '--font-accent',
  display: 'swap',
});

export const klatsch = localFont({
  src: [
    { path: './fonts/klatsch-regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/klatsch-bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
});

export const fontVariables = `${balgin.variable} ${bdSans.variable} ${klatsch.variable}`;
```

- [ ] **Step 4: Registrar las familias en Tailwind**

En `tailwind.config.ts`, reemplazar el bloque `fontFamily` (líneas 55-57):

```ts
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        accent: ['var(--font-accent)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
```

- [ ] **Step 5: Conectar en el layout y arreglar el bug de body**

En `app/layout.tsx`: eliminar los imports de `Fredoka` y `Nunito` y sus
constantes; importar `fontVariables`.

```tsx
import { fontVariables } from './fonts';
```

```tsx
    <html lang="es" className={fontVariables}>
      <body className="font-body antialiased">
```

`className="font-[var(--font-nunito)]"` era un bug: esa sintaxis arbitraria de
Tailwind no resuelve una custom property, así que la fuente de body nunca se
aplicaba. `font-body` sí, porque ahora es una clase real del theme.

- [ ] **Step 6: Verificar**

```bash
npx tsc --noEmit && npm run build
```

Esperado: sin errores. En el output de build no debe aparecer descarga de
Google Fonts.

- [ ] **Step 7: Commit**

```bash
git add app/fonts app/fonts.ts app/layout.tsx tailwind.config.ts
git commit -m "feat(brand): tipografías de marca self-hosted (Balgin, BD Sans, Klatsch)"
```

---

### Task 2: Extracción y transformación de assets

**Files:**
- Create: `scripts/extract-brand-assets.sh`
- Create: `components/brand/assets/*.svg` (16 archivos)
- Create/Replace: `public/brand/*.webp`
- Delete: `public/brand/textura-2.png`, `textura-3.png`, `textura-coral.png`, `patron-corazones.png`, `logo-horizontal.svg`, `logo-principal.svg`, `logo-stacked.svg`

**Interfaces:**
- Produces: 16 SVG limpios en `components/brand/assets/`, sin `<style>`, con `fill="currentColor"`.
- Produces: `public/brand/patron-corazones.webp`, `patron-sellos.webp`, `textura-coral.webp`, `textura-chocolate.webp`.

- [ ] **Step 1: Escribir el script de extracción**

Crear `scripts/extract-brand-assets.sh`. Se versiona a propósito: documenta
qué archivo del kit corresponde a cada asset, dato que los nombres originales
("Mesa de trabajo 4 copia 5.svg") no comunican.

```bash
#!/usr/bin/env bash
# Extrae los assets elegidos del brand kit (../migamor-assets) al front.
# Los SVG se limpian: se elimina el bloque <style> y las clases .cls-N, y se
# pone fill="currentColor" en los paths para poder recolorear con Tailwind.
set -euo pipefail

KIT="../migamor-assets"
OUT="components/brand/assets"
PUB="public/brand"
mkdir -p "$OUT" "$PUB"

clean_svg() {   # $1 = origen, $2 = destino
  python3 - "$1" "$2" <<'PY'
import re, sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
s = re.sub(r'<defs>.*?</defs>', '', s, flags=re.S)      # fuera el <style> con .cls-N
s = re.sub(r'\s*class="[^"]*"', '', s)                   # fuera las clases
s = re.sub(r'\s*(fill|stroke)="#[0-9a-fA-F]{3,6}"', '', s)
s = re.sub(r'<(path|circle|ellipse|polygon|rect)\b', r'<\1 fill="currentColor"', s)
s = re.sub(r'<\?xml[^>]*\?>\s*', '', s)
s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
s = re.sub(r'\s*id="[^"]*"', '', s, count=1)
s = re.sub(r'\n\s*\n', '\n', s)
open(dst, 'w', encoding='utf-8').write(s.strip())
PY
}

# --- Logos (LOGOS/RGB/SVG, variante chocolate sobre transparente) ---
L="$KIT/LOGOS/RGB/SVG"
clean_svg "$L/Migamor RGBMesa de trabajo 1 copia 5.svg" "$OUT/logo-principal.svg"
clean_svg "$L/Migamor RGBMesa de trabajo 2 copia 6.svg" "$OUT/logo-horizontal.svg"
clean_svg "$L/Migamor RGBMesa de trabajo 4 copia 5.svg" "$OUT/logo-compacto.svg"
clean_svg "$L/Migamor RGBMesa de trabajo 6.svg"          "$OUT/logo-sello.svg"
clean_svg "$L/Migamor RGBMesa de trabajo 7 copia 5.svg"  "$OUT/logo-simbolo.svg"

# --- Iconos de panadería (Iconos/SVG, variante chocolate = "copia") ---
I="$KIT/Iconos/SVG"
clean_svg "$I/Iconos MasamorMesa de trabajo 1 copia.svg" "$OUT/icon-cupcake.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 2 copia.svg" "$OUT/icon-muffin.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 3 copia.svg" "$OUT/icon-pan.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 4 copia.svg" "$OUT/icon-croissant.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 5 copia.svg" "$OUT/icon-pan-molde.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 6 copia.svg" "$OUT/icon-torta.svg"
clean_svg "$I/Iconos MasamorMesa de trabajo 7 copia.svg" "$OUT/icon-rodillo.svg"

# --- Elementos gráficos (variante sin "copia" = chocolate) ---
E="$KIT/Elementos graficos/SVG"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 1.svg" "$OUT/swash-curva.svg"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 2.svg" "$OUT/swash-lazo.svg"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 3.svg" "$OUT/swash-ese.svg"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 6.svg" "$OUT/heart-outline.svg"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 7.svg" "$OUT/seal.svg"
clean_svg "$E/Elementos graficos MigamorMesa de trabajo 8.svg" "$OUT/wavy-divider.svg"

# --- Patrones y texturas a webp ---
P="$KIT/Patrones/PNG"
magick "$P/Patrones MigamorMesa de trabajo 1@2x.png"       -resize 600x600 -quality 82 "$PUB/patron-corazones.webp"
magick "$P/Patrones MigamorMesa de trabajo 1 copia@2x.png" -resize 600x600 -quality 82 "$PUB/patron-sellos.webp"
T="$KIT/Texturas imagenes"
magick "$T/Texturas color Masamor 1.png" -resize 1600x -quality 80 "$PUB/textura-coral.webp"
magick "$T/Texturas color Masamor 2.png" -resize 1600x -quality 80 "$PUB/textura-chocolate.webp"

echo "OK. Pesos resultantes:"
du -h "$PUB"/*.webp
```

- [ ] **Step 2: Ejecutar y comprobar pesos**

```bash
chmod +x scripts/extract-brand-assets.sh && ./scripts/extract-brand-assets.sh
```

Esperado: 16 SVG en `components/brand/assets/`, 4 webp en `public/brand/`,
**ninguno sobre 300 KB**. Si alguno excede, bajar `-quality` a 75 y repetir.

- [ ] **Step 3: Comprobar que los SVG quedaron limpios**

```bash
grep -l "cls-" components/brand/assets/*.svg
```

Esperado: **sin resultados**. Cualquier archivo listado aquí todavía tiene la
clase que provoca la colisión entre iconos.

```bash
grep -c "currentColor" components/brand/assets/icon-muffin.svg
```

Esperado: al menos 1.

- [ ] **Step 4: Verificar que los patrones son tileables**

Generar una prueba de 2×2 repeticiones y mirarla:

```bash
magick public/brand/patron-corazones.webp -write mpr:t +delete \
  \( mpr:t mpr:t +append \) \( mpr:t mpr:t +append \) -append /tmp/tile-test.png
```

Abrir `/tmp/tile-test.png` y buscar juntas visibles (líneas donde el patrón se
corta). Si las hay, recortar un tile interior limpio con `-crop` antes de
convertir, o usar `background-size` grande para que la junta caiga fuera del
viewport. **No dar por bueno el `background-repeat` sin mirar esta imagen.**

- [ ] **Step 5: Borrar los assets placeholder**

```bash
git rm public/brand/textura-2.png public/brand/textura-3.png \
       public/brand/textura-coral.png public/brand/patron-corazones.png \
       public/brand/logo-horizontal.svg public/brand/logo-principal.svg \
       public/brand/logo-stacked.svg
```

- [ ] **Step 6: Commit**

```bash
git add scripts components/brand/assets public/brand
git commit -m "feat(brand): extraer assets del kit y optimizar texturas a webp"
```

---

### Task 3: Librería de componentes de marca

**Files:**
- Create: `components/brand/logo.tsx`, `components/brand/bakery-icon.tsx`, `components/brand/decor.tsx`, `components/brand/pattern-bg.tsx`
- Modify: `components/brand/heart-mark.tsx`
- Modify: `next.config.mjs` (loader de SVG)

**Interfaces:**
- Produces: `<Logo variant="principal"|"horizontal"|"compacto"|"sello"|"simbolo" className?>`
- Produces: `<BakeryIcon name="cupcake"|"muffin"|"pan"|"croissant"|"pan-molde"|"torta"|"rodillo" className?>`, y el tipo exportado `BakeryIconName`
- Produces: `<Swash variant="curva"|"lazo"|"ese" className?>`, `<HeartOutline className?>`, `<Seal className?>`, `<WavyDivider className?>`
- Produces: `<PatternBg variant="corazones"|"sellos" opacity? size? className?>`
- Produces: `HeartMark` conserva su firma actual `{ className?, stroke?, dot? }`

- [ ] **Step 1: Habilitar el import de SVG como componente**

Next 14 no trae loader de SVG. Instalar `@svgr/webpack`:

```bash
npm install --save-dev @svgr/webpack
```

En `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { svgo: false } }],
    });
    return config;
  },
};

export default nextConfig;
```

Crear `types/svg.d.ts` para que TypeScript acepte el import:

```ts
declare module '*.svg' {
  import type { FC, SVGProps } from 'react';
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
```

Añadir `"types/**/*.d.ts"` al `include` de `tsconfig.json` si no está cubierto
por el glob existente.

- [ ] **Step 2: Escribir `components/brand/logo.tsx`**

```tsx
import Principal from './assets/logo-principal.svg';
import Horizontal from './assets/logo-horizontal.svg';
import Compacto from './assets/logo-compacto.svg';
import Sello from './assets/logo-sello.svg';
import Simbolo from './assets/logo-simbolo.svg';

const VARIANTS = {
  principal: Principal,
  horizontal: Horizontal,
  compacto: Compacto,
  sello: Sello,
  simbolo: Simbolo,
} as const;

export type LogoVariant = keyof typeof VARIANTS;

/**
 * Logotipo Migamor. El SVG hereda el color del contexto (`currentColor`),
 * así que se pinta con las clases de texto de Tailwind:
 *   <Logo variant="compacto" className="h-8 text-brand-chocolate" />
 */
export function Logo({
  variant = 'principal',
  className,
  title = 'Migamor',
}: {
  variant?: LogoVariant;
  className?: string;
  title?: string;
}) {
  const Svg = VARIANTS[variant];
  return <Svg className={className} role="img" aria-label={title} />;
}
```

- [ ] **Step 3: Escribir `components/brand/bakery-icon.tsx`**

```tsx
import Cupcake from './assets/icon-cupcake.svg';
import Muffin from './assets/icon-muffin.svg';
import Pan from './assets/icon-pan.svg';
import Croissant from './assets/icon-croissant.svg';
import PanMolde from './assets/icon-pan-molde.svg';
import Torta from './assets/icon-torta.svg';
import Rodillo from './assets/icon-rodillo.svg';

const ICONS = {
  cupcake: Cupcake,
  muffin: Muffin,
  pan: Pan,
  croissant: Croissant,
  'pan-molde': PanMolde,
  torta: Torta,
  rodillo: Rodillo,
} as const;

export type BakeryIconName = keyof typeof ICONS;

/** Iconos de panadería del kit. Decorativos por defecto (aria-hidden). */
export function BakeryIcon({
  name,
  className,
  label,
}: {
  name: BakeryIconName;
  className?: string;
  label?: string;
}) {
  const Svg = ICONS[name];
  return label ? (
    <Svg className={className} role="img" aria-label={label} />
  ) : (
    <Svg className={className} aria-hidden focusable="false" />
  );
}
```

- [ ] **Step 4: Escribir `components/brand/decor.tsx`**

```tsx
import Curva from './assets/swash-curva.svg';
import Lazo from './assets/swash-lazo.svg';
import Ese from './assets/swash-ese.svg';
import Heart from './assets/heart-outline.svg';
import SealSvg from './assets/seal.svg';
import Wavy from './assets/wavy-divider.svg';

const SWASHES = { curva: Curva, lazo: Lazo, ese: Ese } as const;
export type SwashVariant = keyof typeof SWASHES;

/** Trazos decorativos del kit. Siempre aria-hidden: no aportan significado. */
export function Swash({ variant = 'curva', className }: { variant?: SwashVariant; className?: string }) {
  const Svg = SWASHES[variant];
  return <Svg className={className} aria-hidden focusable="false" />;
}

export function HeartOutline({ className }: { className?: string }) {
  return <Heart className={className} aria-hidden focusable="false" />;
}

export function Seal({ className }: { className?: string }) {
  return <SealSvg className={className} aria-hidden focusable="false" />;
}

export function WavyDivider({ className }: { className?: string }) {
  return <Wavy className={className} aria-hidden focusable="false" />;
}
```

- [ ] **Step 5: Escribir `components/brand/pattern-bg.tsx`**

```tsx
import { cn } from '@/lib/utils';

const PATTERNS = {
  corazones: '/brand/patron-corazones.webp',
  sellos: '/brand/patron-sellos.webp',
} as const;

export type PatternVariant = keyof typeof PATTERNS;

/**
 * Capa de patrón de marca. Se posiciona absoluta sobre el contenedor padre,
 * que debe ser `relative`.
 */
export function PatternBg({
  variant = 'corazones',
  opacity = 0.06,
  size = 260,
  className,
}: {
  variant?: PatternVariant;
  opacity?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: `url(${PATTERNS[variant]})`,
        backgroundSize: `${size}px`,
        opacity,
      }}
    />
  );
}
```

- [ ] **Step 6: Reemplazar el path de `HeartMark` por el símbolo oficial**

El corazón actual está redibujado a mano y no coincide con el del kit. Sustituir
el contenido del `<svg>` por el path de `components/brand/assets/logo-simbolo.svg`,
ajustando el `viewBox` al del archivo real. **Conservar la firma**
(`className`, `stroke`, `dot`) para no romper a sus consumidores, y cambiar el
`aria-label` de "Masamor" a "Migamor".

Si el símbolo oficial es un path relleno y no un trazo, las props `stroke` y
`dot` dejan de tener efecto real: en ese caso mantenerlas aceptadas pero
mapear `stroke` a `fill` del corazón y `dot` al `fill` del punto, y documentarlo
con un comentario en el archivo.

- [ ] **Step 7: Verificar**

```bash
npx tsc --noEmit && npm run build
```

Comprobar además que TypeScript **rechaza** un nombre inválido — es la razón de
ser de esta tarea:

```bash
echo 'import {BakeryIcon} from "@/components/brand/bakery-icon"; export const X = () => <BakeryIcon name="mufin" />;' > /tmp/t.tsx
```

Añadirlo temporalmente como `app/_typetest.tsx`, correr `npx tsc --noEmit`,
confirmar que falla con un error de tipo en `"mufin"`, y **borrar el archivo**.

- [ ] **Step 8: Commit**

```bash
git add components/brand next.config.mjs types tsconfig.json package.json package-lock.json
git commit -m "feat(brand): librería tipada de logos, iconos y elementos gráficos"
```

---

### Task 4: Tokens de color y rebrand del copy

**Files:**
- Modify: `app/globals.css`, `lib/orders.ts`, `app/layout.tsx`, `app/icon.svg`

- [ ] **Step 1: Corregir los dos tonos y el comentario en `app/globals.css`**

Cabecera: "Paleta oficial Masamor" → "Paleta oficial Migamor".

```css
    --foreground: 19 44% 21%;
    --card-foreground: 19 44% 21%;
    --primary: 19 44% 21%;
    --secondary-foreground: 19 44% 24%;
    --brand-chocolate: 19 44% 21%;
    --brand-blush: 7 65% 78%;
```

(`--secondary` queda en `8 65% 90%`: es un blush aclarado, no el token de marca.)

- [ ] **Step 2: Ajustar el estado "despachado" en `lib/orders.ts:41`**

```ts
  shipped: 'bg-brand-mint text-brand-chocolate',
```

`emerald-800` es un verde de Tailwind ajeno a la paleta.

- [ ] **Step 3: Actualizar la metadata en `app/layout.tsx`**

```tsx
export const metadata: Metadata = {
  title: 'Migamor — Calidad, horno y corazón',
  description:
    'Plataforma B2B de Migamor: queques y galletas estilo New York, congelados y prehorneados. Pedidos mayoristas y al detalle.',
};
```

- [ ] **Step 4: Reemplazar el favicon**

Copiar `components/brand/assets/logo-simbolo.svg` a `app/icon.svg`.

- [ ] **Step 5: Verificar y commitear**

```bash
npx tsc --noEmit
git add app/globals.css lib/orders.ts app/layout.tsx app/icon.svg
git commit -m "feat(brand): tokens de color exactos y metadata Migamor"
```

---

### Task 5: Header y footer

**Files:**
- Modify: `components/site-header.tsx`, `components/site-footer.tsx`

- [ ] **Step 1: Header — logo compacto**

Reemplazar el `<img src="/brand/logo-horizontal.svg">` (líneas 21-27):

```tsx
        <Link href="/" className="flex items-center" aria-label="Migamor — inicio">
          <Logo variant="compacto" className="h-8 w-auto text-brand-chocolate sm:h-9" />
        </Link>
```

Importar `Logo` desde `@/components/brand/logo`. Eliminar el comentario
`eslint-disable` de `no-img-element`, que ya no aplica.

- [ ] **Step 2: Footer — logo horizontal y textura optimizada**

Reemplazar el wordmark en texto plano (líneas 14-17) por el logo real y apuntar
la textura al webp:

```tsx
      style={{
        backgroundImage: 'url(/brand/textura-chocolate.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
```

```tsx
        <Logo variant="horizontal" className="h-16 w-auto text-brand-cream" />
```

Copy: `© {year} Migamor · Pastelería y productos horneados`.

- [ ] **Step 3: Verificar y commitear**

```bash
npx tsc --noEmit && npm run build
git add components/site-header.tsx components/site-footer.tsx
git commit -m "feat(brand): header y footer con logos del kit"
```

---

### Task 6: Landing

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Hero**

Reemplazar el `<div>` de patrón inline (líneas 11-18) por `<PatternBg variant="corazones" />`
y el `<img>` del logo (líneas 20-25) por:

```tsx
          <Logo variant="principal" className="w-[280px] max-w-full text-brand-chocolate sm:w-[360px]" />
```

El `<h1>` mantiene `font-display`; el `<p>` de bajada pasa a `font-body`.

- [ ] **Step 2: Tarjetas de segmento con icono**

Añadir prop `icon: BakeryIconName` a `SegmentCard` y renderizarlo sobre el
eyebrow:

```tsx
      <BakeryIcon name={icon} className="mb-3 h-14 w-14 text-brand-chocolate/70" />
```

Mayorista → `torta`; detalle → `cupcake`.

El eyebrow pasa a `font-accent text-xs uppercase tracking-widest` (BD Sans es
ancha; a tamaño pequeño y en mayúsculas es donde funciona).

Las viñetas: reemplazar el carácter `♥` (línea 158) por
`<HeartMark className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-coral" />`.

- [ ] **Step 3: "¿Cómo funciona?" sobre sellos**

Reemplazar el `<span>` con `rounded-full bg-brand-coral` (líneas 90-92) por el
sello ondulado con el número encima:

```tsx
              <span className="relative flex h-16 w-16 items-center justify-center">
                <Seal className="absolute inset-0 h-full w-full text-brand-coral" />
                <span className="relative font-accent text-xl text-white">{s.n}</span>
              </span>
```

Copy: "Masamor revisa y confirma." → "Migamor revisa y confirma."

- [ ] **Step 4: Divisores ondulados entre secciones**

Entre la sección de segmentos y "¿Cómo funciona?", y entre esta y el CTA:

```tsx
      <WavyDivider className="mx-auto my-4 h-6 w-full max-w-3xl text-brand-blush" />
```

- [ ] **Step 5: CTA final**

Textura a `url(/brand/textura-coral.webp)`. Copy: "productos Masamor" →
"productos Migamor".

- [ ] **Step 6: Verificar y commitear**

```bash
npx tsc --noEmit && npm run build
git add app/page.tsx
git commit -m "feat(brand): landing con el universo gráfico del kit"
```

---

### Task 7: Catálogo

**Files:**
- Modify: `components/brand/product-thumb.tsx`, `app/catalog/page.tsx`

- [ ] **Step 1: `ProductThumb` con iconos reales**

Reemplazar `emojiFor` por un mapeo a `BakeryIconName`, conservando la misma
lógica de coincidencia por nombre:

```tsx
function iconFor(name: string): BakeryIconName {
  const n = name.toLowerCase();
  if (n.includes('galleta')) return 'cupcake';
  if (n.includes('queque') || n.includes('muffin')) return 'muffin';
  if (n.includes('torta') || n.includes('pastel')) return 'torta';
  if (n.includes('pan')) return 'pan';
  if (n.includes('display')) return 'cupcake';
  return 'croissant';
}
```

En el render, sustituir `<span className="relative text-5xl">{emojiFor(name)}</span>` por:

```tsx
      <BakeryIcon name={iconFor(name)} className="relative h-20 w-20 text-brand-chocolate/80" />
```

El patrón de fondo pasa a `<PatternBg variant="corazones" opacity={0.12} size={120} />`.
Se conserva el fondo determinístico por hash (`BRAND_BG`).

- [ ] **Step 2: Copy y acentos del carrito**

- "Sin pago en línea. Masamor confirma." → "…Migamor confirma."
- Placeholder "Notas para Masamor (opcional)" → "Notas para Migamor (opcional)"
- Título "Catálogo" y "Tu pedido" en `font-display`
- Precios en `font-display`

- [ ] **Step 3: Verificar y commitear**

```bash
npx tsc --noEmit && npm run build
git add components/brand/product-thumb.tsx app/catalog/page.tsx
git commit -m "feat(brand): catálogo con iconos de panadería del kit"
```

---

### Task 8: Login

**Files:**
- Modify: `app/login/page.tsx`

- [ ] **Step 1: Símbolo oficial y patrón de fondo**

Envolver en un contenedor `relative` con `<PatternBg variant="sellos" opacity={0.05} />`
y reemplazar el `<HeartMark>` suelto (línea 82) por:

```tsx
      <Logo variant="simbolo" className="relative mx-auto mb-6 h-16 w-16 text-brand-coral" />
```

- [ ] **Step 2: Copy y tipografía**

- "Accede a tu portal Masamor." → "Accede a tu portal Migamor."
- El `<select>` de segmento (líneas 131-145): añadir `font-body` y las clases de
  foco del resto de inputs (`ring-offset-background focus-visible:ring-2 focus-visible:ring-ring`)
  para que no quede desalineado con `<Input>`.

- [ ] **Step 3: Verificar y commitear**

```bash
npx tsc --noEmit && npm run build
git add app/login/page.tsx
git commit -m "feat(brand): login con símbolo y patrón del kit"
```

---

### Task 9: Portal y admin

**Files:**
- Modify: `app/portal/orders/page.tsx`, `app/admin/orders/page.tsx`, `components/brand/order-timeline.tsx`

- [ ] **Step 1: Empty state del portal**

Reemplazar el `<HeartMark>` del empty state (línea 57) por un icono con más
carácter y copy de marca:

```tsx
          <BakeryIcon name="croissant" className="h-16 w-16 text-brand-coral" />
```

- [ ] **Step 2: Tipografía de ambas pantallas**

Títulos `h1` en `font-display`; encabezados de tabla en
`font-accent text-xs uppercase tracking-wider`; celdas en `font-body`.

- [ ] **Step 3: Divisor en el timeline**

En `components/brand/order-timeline.tsx`, usar `<WavyDivider className="h-3 text-brand-blush" />`
como conector entre hitos, en lugar de la línea recta actual.

- [ ] **Step 4: Verificar y commitear**

```bash
npx tsc --noEmit && npm run build
git add app/portal app/admin components/brand/order-timeline.tsx
git commit -m "feat(brand): portal y admin con tipografía y elementos de marca"
```

---

### Task 10: Verificación final

- [ ] **Step 1: Sin rastro de "Masamor"**

```bash
grep -rin masamor app components lib public
```

Esperado: **0 resultados**. (`scripts/extract-brand-assets.sh` sí conserva
"Masamor" en las rutas de origen del kit: esos archivos se llaman así de verdad.)

- [ ] **Step 2: Typecheck y build limpios**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 3: Peso de los assets**

```bash
du -sh public/brand && du -h public/brand/* | sort -h | tail -5
```

Esperado: total bajo 1 MB, ningún archivo sobre 300 KB.

- [ ] **Step 4: Revisión visual**

Levantar el dev server en un puerto libre (el 3000 suele estar ocupado por otro
proyecto) y capturar landing y login en 375px y 1280px:

```bash
npx next dev -p 3100
```

Confirmar en las capturas:
- las fuentes de marca cargan (Balgin tiene la "g" de un solo piso y la "a"
  redonda; si ves una grotesca genérica, cayó al fallback)
- acentos y ñ renderizan
- ningún icono con el color equivocado (señal de que quedó una clase `.cls-N`)
- el patrón no muestra juntas visibles
- nada desborda horizontalmente en 375px

Catálogo, portal y admin requieren sesión y backend. Sin credenciales de
Supabase no se pueden verificar visualmente: **declararlo explícitamente en el
reporte** en vez de darlos por buenos.

- [ ] **Step 5: Commit final**

```bash
git add -A && git commit -m "chore(brand): verificación de la línea gráfica"
```

## Pendientes fuera de este plan

- `migamor-front/package.json`: `masamor-frontend` → `migamor-frontend`
- `migamor-backend`: `package.json`, log de `main.ts:37`, comentarios de
  `.env.example`, `RESEND_FROM`, plantillas de `mail.service.ts`
- Confirmar licencia de webfont con varita_grafica
