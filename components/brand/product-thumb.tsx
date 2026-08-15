import { HeartMark } from './heart-mark';
import { PatternBg } from './pattern-bg';
import { BakeryIcon, type BakeryIconName } from './bakery-icon';

// Placeholder de producto con identidad de marca (aún sin fotografía real).
// Color determinístico por nombre + marca del kit según la familia de producto.
const BRAND_BG = [
  'bg-brand-blush/60',
  'bg-brand-mint/70',
  'bg-brand-cream',
  'bg-brand-coral/25',
];

/**
 * Marca visual por familia de producto.
 *
 * `'brand'` significa "sin icono adecuado en el kit": se usa el corazón
 * Migamor en vez de un icono de comida que mienta. Es el caso de las galletas
 * NY — el kit no incluye icono de galleta pese a ser el producto estrella, y
 * está pedido al estudio. Cuando llegue, esta rama pasa a `'galleta'`.
 *
 * El orden importa: "Display Galletas NY" es un display, no una galleta suelta,
 * así que `display` se evalúa primero.
 */
type ProductMark = BakeryIconName | 'brand';

function markFor(name: string): ProductMark {
  const n = name.toLowerCase();
  if (n.includes('display')) return 'torta';
  if (n.includes('galleta')) return 'brand';
  if (n.includes('queque') || n.includes('muffin')) return 'muffin';
  if (n.includes('torta') || n.includes('pastel')) return 'torta';
  if (n.includes('pan')) return 'pan';
  return 'croissant';
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function ProductThumb({
  name,
  imageUrl,
  className = '',
}: {
  name: string;
  imageUrl?: string | null;
  className?: string;
}) {
  // Si en el futuro hay foto real, se prioriza.
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const bg = BRAND_BG[hash(name) % BRAND_BG.length];
  const mark = markFor(name);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${bg} ${className}`}
      aria-hidden
    >
      <PatternBg variant="corazones" opacity={0.14} size={90} />
      {mark === 'brand' ? (
        <HeartMark className="relative h-16 w-16 text-brand-chocolate/80" />
      ) : (
        <>
          <BakeryIcon
            name={mark}
            className="relative h-20 w-20 text-brand-chocolate/80"
          />
          {/* Firma de marca en la esquina. Se omite cuando el corazón ya es la
              marca principal del thumb, para no duplicarlo. */}
          <HeartMark className="absolute bottom-2 right-2 h-4 w-4 text-brand-chocolate/50" />
        </>
      )}
    </div>
  );
}
