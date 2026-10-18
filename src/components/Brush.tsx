// The black brush-stroke labels from their Brixton menus ("mains", "sides", "Drinks").

interface Props {
  children: string;
  large?: boolean;
  as?: 'h2' | 'h3' | 'p' | 'span';
  className?: string;
}

export function Brush({ children, large, as: Tag = 'span', className = '' }: Props) {
  return (
    <Tag className={`brush ${large ? 'brush--lg' : ''} ${className}`}>
      <svg viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6 14 C40 6 92 9 140 7 C190 5 246 4 292 8 L296 12 L289 15 L298 21 L291 26 L297 33 L290 38 L296 45 L288 50 L292 54 C240 57 180 53 128 55 C84 57 38 54 8 52 L3 47 L10 43 L2 37 L9 32 L1 26 L8 22 L2 17 Z"
        />
        <path fill="currentColor" opacity=".55" d="M18 9 L60 5 L58 8 L20 12 Z M210 53 L272 55 L270 58 L212 57 Z" />
      </svg>
      <span>{children}</span>
    </Tag>
  );
}
