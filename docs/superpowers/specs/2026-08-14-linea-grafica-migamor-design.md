# Línea gráfica Migamor — diseño

Fecha: 2026-08-14
Repo: `migamor-front`

## Problema

El frontend usa la paleta oficial de Migamor pero todo lo demás es sustituto:
tipografías de Google Fonts (Fredoka + Nunito) en lugar de las de marca, logos
SVG redibujados que no coinciden con el kit, emojis del sistema como placeholder
de producto, y el nombre "Masamor" en todo el copy visible cuando la marca es
"Migamor".

El brand kit completo está disponible en `../migamor-assets/` (386 MB, ~700
archivos) con manual de uso gráfico, tipografías, logos, iconos, elementos
gráficos y patrones.

## Alcance

Aplicar la línea gráfica real a **las 5 pantallas** del front: landing,
catálogo, login, portal de pedidos y admin de pedidos.

Fuera de alcance en esta pasada:

- `package.json` (`masamor-frontend`) y cualquier identificador interno del paquete
- El repo `migamor-backend` (nombre del paquete, log de arranque en `main.ts`,
  comentarios de `.env.example`, plantillas de correo de `mail.service.ts`)

Ambos quedan listados en "Pendientes" al final.

## Decisiones tomadas

| Decisión | Elección |
|---|---|
| Nombre | Rebrand completo a **Migamor** en copy visible del front |
| Alcance | Las 5 pantallas |
| Arquitectura de assets | Librería de componentes tipados |

## Riesgo conocido: licencia de las tipografías

Balgin, BD Sans (Beautifully Delicious) y Klatsch Grotesk son fuentes
comerciales. Poseer los archivos `.ttf`/`.otf` cubre uso en piezas gráficas,
pero servirlas como webfont requiere una licencia de webfont distinta.

**Acción requerida antes del deploy público:** confirmar la licencia con el
estudio de diseño (varita_grafica). En local y en staging privado no hay
problema.

Si la licencia no cubriera web, el plan B es sustituir por fuentes libres de
métrica y carácter parecidos (Balgin → Poppins SemiBold; Klatsch Grotesk →
Work Sans). Ese cambio queda aislado en un solo archivo (`app/fonts.ts`), así
que el costo de revertir es bajo. Es una de las razones para centralizar la
tipografía en un módulo.

## 1. Fundamentos

### 1.1 Tipografía

Self-hosted con `next/font/local`. Los `.ttf`/`.otf` se convierten a woff2 con
`woff2_compress` (verificado: las 7 convierten, 24–40 KB cada una, ~200 KB
total). Cobertura de español verificada por render: `á é í ó ú ü ñ Ñ ¿ ¡ Á É Í
Ó Ú` presentes en las 7.

Los woff2 se versionan en `app/fonts/`. Los `.ttf`/`.otf` originales NO entran
al repo (siguen viviendo en `migamor-assets/`).

| Variable CSS | Fuente | Pesos | Uso |
|---|---|---|---|
| `--font-display` | Balgin | Light 300, Regular 400, SemiBold 600 | h1–h3, botones, precios |
| `--font-accent` | BD Sans Black | 900 | eyebrows, subtítulos cortos, números de paso |
| `--font-body` | Klatsch Grotesk | Regular 400, Bold 700 | texto corrido, tablas, formularios, labels |

Todas con `display: 'swap'`.

`BD Sans Black` es una display muy ancha y trackeada: se limita a textos de
menos de ~40 caracteres. Usarla en párrafos rompe la legibilidad.

Tailwind expone `font-display`, `font-accent`, `font-body`. El `body` pasa a
`font-body`. Se elimina `Fredoka` y `Nunito` de `app/layout.tsx`.

**Corrección de un bug existente:** `app/layout.tsx:32` aplica
`className="font-[var(--font-nunito)]"`, sintaxis arbitraria de Tailwind que no
resuelve una custom property de esa forma — la fuente de body nunca se aplicó.
Se reemplaza por la clase `font-body` del theme.

### 1.2 Color

La paleta ya está correctamente traducida a HSL en `app/globals.css`. Solo dos
tonos están a 1° del hex oficial:

| Token | Hex oficial | HSL actual | HSL correcto |
|---|---|---|---|
| `--brand-chocolate` / `--foreground` / `--primary` | `#4e2d1e` | `20 44% 21%` | `19 44% 21%` |
| `--brand-blush` | `#ebaba2` | `8 65% 78%` | `7 65% 78%` |

El resto (`crema #f9e6c8`, `coral #ee7264`, `menta #d4eee3`) ya es exacto.

Se actualiza el comentario de cabecera de `globals.css` que hoy dice "Paleta
oficial Masamor".

## 2. Librería de marca

`components/brand/` expone componentes tipados. Ninguna página conoce rutas de
archivo de assets.

### 2.1 `<Logo variant>`

SVG inline, recoloreable con `currentColor`.

| variant | Origen en el kit | Uso previsto |
|---|---|---|
| `principal` | `LOGOS/RGB/SVG/Migamor RGBMesa de trabajo 1 copia 5.svg` | hero de la landing |
| `horizontal` | `LOGOS/RGB/SVG/Migamor RGBMesa de trabajo 2 copia 6.svg` | footer |
| `compacto` | `LOGOS/RGB/SVG/Migamor RGBMesa de trabajo 4 copia 5.svg` | header |
| `sello` | `LOGOS/RGB/SVG/Migamor RGBMesa de trabajo 6.svg` | acento, confirmaciones |
| `simbolo` | `LOGOS/RGB/SVG/Migamor RGBMesa de trabajo 7 copia 5.svg` | favicon, avatar, login |

Todos en la variante chocolate sobre transparente; el color final lo decide la
clase de Tailwind del consumidor.

### 2.2 `<BakeryIcon name>`

Los 7 iconos de panadería, variante chocolate (`Iconos/SVG/Iconos MasamorMesa
de trabajo N copia.svg`, N = 1…7):

| name | N |
|---|---|
| `cupcake` | 1 |
| `muffin` | 2 |
| `pan` | 3 |
| `croissant` | 4 |
| `pan-molde` | 5 |
| `torta` | 6 |
| `rodillo` | 7 |

`viewBox="0 0 283.46 283.46"` (cuadrado) en todos.

### 2.3 Elementos decorativos

De `Elementos graficos/SVG/Elementos graficos MigamorMesa de trabajo N.svg`
(la variante sin sufijo "copia" es la chocolate):

- `<Swash variant="curva|lazo|ese|lazo-alto" />` — N = 1, 2, 3, 4
- `<HeartOutline />` — N = 6, corazón de trazo grueso
- `<Seal />` — N = 7, círculo de borde ondulado
- `<WavyDivider />` — N = 8, línea ondulada divisoria

### 2.4 `<PatternBg variant opacity>`

- `corazones` ← `Patrones/PNG/Patrones MigamorMesa de trabajo 1@2x.png` (blush con punto chocolate)
- `sellos` ← `Patrones/PNG/Patrones MigamorMesa de trabajo 1 copia@2x.png` (sellos dispersos)

**Verificar durante la implementación si son tileables sin costura.** Son
exports de artboard, no tiles diseñados como tales. Si no calzan, se recorta un
tile limpio o se usa un tamaño de fondo que disimule la junta. No dar por
sentado que `background-repeat` va a funcionar.

### 2.5 `HeartMark` — reemplazo

`components/brand/heart-mark.tsx` contiene hoy un corazón redibujado a mano que
no coincide con el símbolo oficial: el real tiene el trazo asimétrico con la
"llama" interior y el punto descentrado.

Se reemplaza el path por el del kit **manteniendo la firma actual**
(`className`, `stroke`, `dot`), de modo que el cambio de símbolo sea
independiente de los cambios de layout. El `aria-label` pasa de "Masamor" a
"Migamor".

Hoy tiene 4 consumidores: `login`, `catalog`, `portal/orders` y
`product-thumb`. Tras la sección 4, `login` pasa a `<Logo variant="simbolo">` y
`portal/orders` a `<BakeryIcon>`; `HeartMark` sigue en uso en `catalog` (título
del carrito) y `product-thumb` (esquina de la miniatura).

### 2.6 Nota de implementación: colisión de clases CSS

Los SVG del kit traen los colores en un bloque `<style>` interno con clases
`.cls-1`, `.cls-2`, etc.:

```svg
<defs><style>.cls-1 { fill: #4e2d1e; }</style></defs>
<path class="cls-1" d="..."/>
```

Un `<style>` dentro de un `<svg>` inline **no está scoped**: aplica a todo el
documento. Dos iconos distintos que definan `.cls-1` con colores diferentes
colisionan y gana el último del DOM.

Al convertir cada SVG a componente: **eliminar el bloque `<defs><style>` y
poner `fill="currentColor"` directamente en cada `<path>`**, quitando el
atributo `class`. Esto resuelve la colisión y habilita el recoloreo por
Tailwind de una sola vez.

## 3. Optimización de assets

Los tres PNG de textura que hoy están en `public/brand/` pesan 3–4 MB cada uno
y se cargan como `background-image` en el footer y la landing — es decir, en
todas las páginas.

Se convierten a webp con `magick -quality 82`, con un objetivo de ~150 KB. Los
patrones también.

Se eliminan de `public/brand/` los assets placeholder que quedan sin uso tras
el cambio.

## 4. Aplicación por pantalla

### 4.1 `components/site-header.tsx`

- `<Logo variant="compacto">` en vez de `<img src="/brand/logo-horizontal.svg">`
- `aria-label` y `alt`: "Migamor — inicio"
- Nav en `font-body`

### 4.2 `app/page.tsx` — landing

- Hero: `<PatternBg variant="corazones">` + `<Logo variant="principal">`
- h1 en `font-display`, eyebrow de segmentos en `font-accent`
- Los 3 pasos de "¿Cómo funciona?": el número va sobre `<Seal />` en vez del
  `rounded-full` plano actual
- Tarjetas de segmento: `<BakeryIcon>` (mayorista → `torta`, detalle → `cupcake`)
- `<WavyDivider />` entre secciones
- Viñetas de la lista: `<HeartMark>` en vez del carácter `♥`
- CTA final sobre textura webp optimizada
- Copy: "Masamor revisa y confirma" → "Migamor revisa y confirma";
  "productos Masamor" → "productos Migamor"

### 4.3 `app/catalog/page.tsx`

- `ProductThumb`: reemplazar los emojis (🍪🧁🍰🍞🥐) por `<BakeryIcon>` con el
  mismo mapeo por nombre de producto que ya existe:

  | Contiene | Icono |
  |---|---|
  | galleta | `cupcake` |
  | queque / muffin | `muffin` |
  | torta / pastel | `torta` |
  | pan | `pan` |
  | display | `cupcake` |
  | (default) | `croissant` |

  Se conserva el fondo de color determinístico por hash y el patrón de fondo.
- Carrito: `<Seal />` como acento del total
- Copy: "Sin pago en línea. Masamor confirma." → "…Migamor confirma.";
  placeholder "Notas para Masamor" → "Notas para Migamor"

### 4.4 `app/login/page.tsx`

- `<Logo variant="simbolo">` en vez de `<HeartMark>` suelto
- `<PatternBg>` sutil de fondo
- Copy: "Accede a tu portal Masamor." → "…portal Migamor."
- El `<select>` de segmento hereda los estilos de input del theme

### 4.5 `app/portal/orders/page.tsx` y `app/admin/orders/page.tsx`

- Empty states con `<BakeryIcon>` en vez de `<HeartMark>` genérico
- Títulos en `font-display`, tablas en `font-body`
- Timeline de estados con `<WavyDivider>` como conector

### 4.6 `components/site-footer.tsx`

- `<Logo variant="horizontal">` en vez del wordmark en texto plano
- Textura de fondo optimizada a webp
- Copy: "Masamor" y "© … Masamor · Pastelería…" → "Migamor"

### 4.7 `lib/orders.ts`

`STATUS_STYLES` ya usa la progresión de marca blush → coral → crema → menta →
chocolate. Se mantiene, con un solo ajuste:

```
shipped: 'bg-brand-mint text-emerald-800'  →  'bg-brand-mint text-brand-chocolate'
```

`emerald-800` es un verde de Tailwind ajeno a la paleta. Chocolate sobre menta
mantiene el contraste y queda dentro de la marca.

### 4.8 `app/layout.tsx`

- `metadata.title`: "Migamor — Calidad, horno y corazón"
- `metadata.description`: "Plataforma B2B de Migamor: …"
- Fuentes locales en vez de Google Fonts
- `app/icon.svg` ← símbolo oficial del kit

## 5. Verificación

1. `npm run build` sin errores ni warnings de tipos.
2. `npx tsc --noEmit` limpio — cubre que los nombres de `variant`/`name` sean
   válidos, que es la razón de ser de la librería tipada.
3. `grep -ri masamor app components lib` devuelve 0 resultados.
4. Levantar el dev server y revisar las 5 pantallas en viewport móvil (375px) y
   desktop (1280px), confirmando por captura:
   - las fuentes de marca cargan (no hay fallback a system-ui)
   - los acentos y la ñ renderizan
   - ningún icono aparece con el color equivocado (señal de colisión de `.cls-N`)
   - el patrón de fondo no muestra juntas visibles
5. Peso total de assets en `public/brand/` por debajo de 1 MB.

Las pantallas de catálogo, portal y admin requieren sesión y backend
levantado; si no hay credenciales de Supabase disponibles al momento de
verificar, se revisan landing y login, y las tres restantes quedan como
verificación pendiente, declarada explícitamente en el reporte.

## Pendientes fuera de esta pasada

- `migamor-front/package.json`: `"name": "masamor-frontend"` → `migamor-frontend`
- `migamor-backend/package.json`: `"name": "masamor-backend"`, `description`
- `migamor-backend/src/main.ts:37`: log "Masamor API escuchando en…"
- `migamor-backend/.env.example`: comentarios de cabecera y `RESEND_FROM=Masamor <onboarding@resend.dev>`
- `migamor-backend/src/mail/mail.service.ts`: revisar plantillas de correo transaccional
- Renombrar los archivos del kit que aún dicen "Masamor" (`Iconos/`,
  `Texturas imagenes/`) — cosmético, no bloquea nada
- Confirmar licencia de webfont de Balgin / BD Sans / Klatsch Grotesk
