import { HeartMark } from './heart-mark';

// Placeholder de producto con identidad de marca (aún sin fotografía real).
// Color determinístico por nombre + emoji de repostería según el tipo.
const BRAND_BG = [
  'bg-brand-blush/60',
  'bg-brand-mint/70',
  'bg-brand-cream',
  'bg-brand-coral/25',
];

function emojiFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes('galleta')) return '🍪';
  if (n.includes('queque') || n.includes('muffin')) return '🧁';
  if (n.includes('torta') || n.includes('pastel')) return '🍰';
  if (n.includes('pan')) return '🍞';
  if (n.includes('display')) return '🧁';
  return '🥐';
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
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'url(/brand/patron-corazones.png)',
          backgroundSize: '120px',
        }}
      />
      <span className="relative text-5xl drop-shadow-sm">{emojiFor(name)}</span>
      <HeartMark className="absolute bottom-2 right-2 h-5 w-5 text-brand-chocolate/70" />
    </div>
  );
}
