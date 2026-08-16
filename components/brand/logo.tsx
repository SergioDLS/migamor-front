import Principal from './assets/logo-principal.svg';
import Horizontal from './assets/logo-horizontal.svg';
import Compacto from './assets/logo-compacto.svg';
import SelloLogo from './assets/logo-sello.svg';
import Simbolo from './assets/logo-simbolo.svg';

const VARIANTS = {
  /** Identidad principal: corazón sobre el wordmark, con bajada. */
  principal: Principal,
  /** Secundario horizontal MIGA♥MOR con bajada. */
  horizontal: Horizontal,
  /** Lockup compacto: corazón + wordmark a la derecha. Para alturas pequeñas. */
  compacto: Compacto,
  /** Sello circular. */
  sello: SelloLogo,
  /** Símbolo solo. Para favicon, avatar y usos pequeños. */
  simbolo: Simbolo,
} as const;

export type LogoVariant = keyof typeof VARIANTS;

/**
 * Logotipo Migamor. El SVG hereda el color del contexto (`currentColor`), así
 * que se pinta con las clases de texto de Tailwind:
 *
 *   <Logo variant="compacto" className="h-8 w-auto text-brand-chocolate" />
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
