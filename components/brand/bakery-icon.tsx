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

/**
 * Iconos de panadería del kit, trazo a mano alzada.
 *
 * Decorativos por defecto (`aria-hidden`). Si el icono es la única forma de
 * identificar algo — por ejemplo, sustituye a la foto de un producto — pasar
 * `label` para que se anuncie como imagen con nombre.
 */
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
