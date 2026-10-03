import { CellColor } from '../types';
import { COLOR_MAP } from '../shapes';

interface BlockCellProps {
  color?: CellColor;
  isGhost?: boolean;
  isInvalidGhost?: boolean;
  isClearing?: boolean;
  size?: number; // size in px or style
  className?: string;
}

export default function BlockCell({
  color = 'blue',
  isGhost = false,
  isInvalidGhost = false,
  isClearing = false,
  size,
  className = ''
}: BlockCellProps) {
  const colorConfig = COLOR_MAP[color] || COLOR_MAP.blue;

  if (isGhost) {
    return (
      <div
        className={`w-full h-full rounded-md border-2 transition-all duration-75 ${
          isInvalidGhost
            ? 'bg-rose-500/30 border-rose-400 animate-pulse'
            : `${colorConfig.bg}/45 ${colorConfig.border} shadow-inner animate-pulse`
        } ${className}`}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  return (
    <div
      className={`relative w-full h-full rounded-md transition-transform select-none overflow-hidden ${
        isClearing ? 'scale-110 brightness-150 animate-ping' : ''
      } ${className}`}
      style={{
        background: colorConfig.gradient,
        boxShadow: `inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.3)`,
        ...(size ? { width: size, height: size } : {})
      }}
    >
      {/* Premium Polished Sheen Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
      {/* Top highlight shine */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-linear-to-b from-white/30 to-transparent rounded-t-md pointer-events-none" />
      {/* Inner subtle bevel */}
      <div className="absolute inset-0 rounded-md border border-white/20 pointer-events-none" />
    </div>
  );
}

