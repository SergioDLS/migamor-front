import { cn } from '@/lib/utils';
import Simbolo from './assets/logo-simbolo.svg';
import Sello from './assets/logo-sello.svg';

/**
 * Patrón de fondo de marca.
 *
 * Se genera como <pattern> SVG en vez de usar los PNG de `Patrones/` del kit:
 * esos archivos son exports de artboard (1134×1701, con alpha), no tiles
 * diseñados para repetirse — al aplicarles background-repeat muestran junta
 * visible en ambos ejes. Construirlo aquí sale seamless por definición, pesa
 * ~1 KB en vez de 128 KB, escala sin pérdida y hereda el color del contexto.
 *
 * El contenedor padre debe ser `relative`.
 */

const MOTIFS = {
  corazones: Simbolo,
  sellos: Sello,
} as const;

export type PatternVariant = keyof typeof MOTIFS;

export function PatternBg({
  variant = 'corazones',
  opacity = 0.06,
  size = 96,
  className,
}: {
  variant?: PatternVariant;
  /** Opacidad de la capa completa. El patrón es decorativo: mantener bajo. */
  opacity?: number;
  /** Lado del tile en px. El motivo ocupa un 45% de ese lado. */
  size?: number;
  className?: string;
}) {
  const Motif = MOTIFS[variant];
  // Id determinístico: dos instancias con la misma variante y tamaño definen
  // un patrón idéntico, así que compartir el id es inocuo y evita un hook
  // (useId no está disponible en Server Components).
  const id = `mgf-pattern-${variant}-${size}`;

  const motif = size * 0.45;
  const gap = size * 0.5;

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ opacity }}
    >
      <svg className="h-full w-full" role="presentation">
        <defs>
          <pattern
            id={id}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-8)"
          >
            {/* Dos motivos por tile, en ladrillo. Ninguno excede el tile
                (0.5 + 0.45 = 0.95), que es lo que mantiene la repetición
                sin cortes. */}
            <Motif x={0} y={0} width={motif} height={motif} />
            <Motif x={gap} y={gap} width={motif} height={motif} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
