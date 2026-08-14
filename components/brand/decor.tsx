import Curva from './assets/swash-curva.svg';
import Lazo from './assets/swash-lazo.svg';
import Ese from './assets/swash-ese.svg';
import Heart from './assets/heart-outline.svg';
import SealSvg from './assets/seal.svg';
import Wavy from './assets/wavy-divider.svg';

/**
 * Elementos gráficos decorativos del kit.
 *
 * Todos van `aria-hidden`: acompañan visualmente pero no aportan información,
 * y anunciarlos solo añadiría ruido al lector de pantalla.
 */

const SWASHES = { curva: Curva, lazo: Lazo, ese: Ese } as const;
export type SwashVariant = keyof typeof SWASHES;

/** Trazo curvo suelto. Para acentuar esquinas y márgenes. */
export function Swash({
  variant = 'curva',
  className,
}: {
  variant?: SwashVariant;
  className?: string;
}) {
  const Svg = SWASHES[variant];
  return <Svg className={className} aria-hidden focusable="false" />;
}

/** Corazón de trazo grueso con cola. El arte sangra al borde del viewBox. */
export function HeartOutline({ className }: { className?: string }) {
  return <Heart className={className} aria-hidden focusable="false" />;
}

/** Círculo de borde ondulado. Sirve de fondo para números y contadores. */
export function Seal({ className }: { className?: string }) {
  return <SealSvg className={className} aria-hidden focusable="false" />;
}

/** Línea ondulada divisoria. */
export function WavyDivider({ className }: { className?: string }) {
  return (
    <Wavy
      className={className}
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    />
  );
}
