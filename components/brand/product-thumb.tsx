import { HeartMark } from './heart-mark';
import { PatternBg } from './pattern-bg';
import { BakeryIcon, type BakeryIconName } from './bakery-icon';

// Placeholder de producto con identidad de marca (aún sin fotografía real).
// Color determinístico por nombre + icono del kit según el tipo.
const BRAND_BG = [
  'bg-brand-blush/60',
  'bg-brand-mint/70',
  'bg-brand-cream',
  'bg-brand-coral/25',
];

function iconFor(name: string): BakeryIconName {
  const n = name.toLowerCase();
  if (n.includes('galleta')) return 'cupcake';
  if (n.includes('queque') || n.includes('muffin')) return 'muffin';
  if (n.includes('torta') || n.includes('pastel')) return 'torta';
  if (n.includes('pan')) return 'pan';
  if (n.includes('display')) return 'cupcake';
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

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${bg} ${className}`}
      aria-hidden
    >
      <PatternBg variant="corazones" opacity={0.14} size={90} />
      <BakeryIcon
        name={iconFor(name)}
        className="relative h-20 w-20 text-brand-chocolate/80"
      />
      <HeartMark className="absolute bottom-2 right-2 h-4 w-4 text-brand-chocolate/50" />
    </div>
  );
}
