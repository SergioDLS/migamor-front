/** Símbolo del corazón Masamor (isotipo), reutilizable e inline. */
export function HeartMark({
  className,
  stroke = 'currentColor',
  dot = 'currentColor',
}: {
  className?: string;
  stroke?: string;
  dot?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Masamor"
    >
      <path
        fill="none"
        stroke={stroke}
        strokeWidth={3}
        strokeLinejoin="round"
        d="M16 27C6 20 3 14.5 5.5 9.8 7.6 6 12.4 5.6 16 9.4 19.6 5.6 24.4 6 26.5 9.8 29 14.5 26 20 16 27Z"
      />
      <circle cx="16" cy="17" r="2.6" fill={dot} />
    </svg>
  );
}
