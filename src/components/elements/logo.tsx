import { cn } from '@/lib/utils';
import Link from 'next/link';

type LogoVariant = 'gradient' | 'solid' | 'mono-black' | 'mono-white' | 'reverse';
type LogoLockup = 'horizontal' | 'stacked' | 'mark';

interface LogoProps {
  className?: string;
  fullName?: boolean;
  href?: boolean;
  animate?: boolean;
  size?: number;
  variant?: LogoVariant;
  lockup?: LogoLockup;
}

const MARK_BG: Record<LogoVariant, string> = {
  gradient: 'bg-[linear-gradient(135deg,hsl(127_44%_68%),hsl(127_44%_56%))]',
  solid: 'bg-primary',
  'mono-black': 'bg-[#0b0f0c]',
  'mono-white': 'bg-white',
  reverse: 'bg-primary',
};

const MARK_STROKE: Record<LogoVariant, string> = {
  gradient: '#ffffff',
  solid: '#ffffff',
  'mono-black': '#ffffff',
  'mono-white': 'hsl(144 53% 4%)',
  reverse: 'hsl(127 30% 18%)',
};

const Mark = ({
  size,
  variant,
  animate,
}: {
  size: number;
  variant: LogoVariant;
  animate: boolean;
}) => (
  <div
    className={cn(
      'flex items-center justify-center shrink-0',
      MARK_BG[variant],
      variant === 'gradient' && 'shadow-[0_14px_32px_-10px_hsl(127_44%_50%/0.55)]',
      animate && 'animate-float'
    )}
    style={{ width: size, height: size, borderRadius: size * 0.172 }}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={MARK_STROKE[variant]}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size * 0.55, height: size * 0.55 }}
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  </div>
);

export const Logo = ({
  className,
  fullName = false,
  href = false,
  animate = true,
  size = 36,
  variant = 'gradient',
  lockup,
}: LogoProps) => {
  const resolvedLockup: LogoLockup = lockup ?? (fullName ? 'horizontal' : 'mark');
  const showWord = resolvedLockup !== 'mark';
  const stacked = resolvedLockup === 'stacked';

  const content = (
    <div className={cn('flex items-center justify-center gap-2', stacked && 'flex-col')}>
      <Mark size={size} variant={variant} animate={animate} />
      {showWord && (
        <span className="text-lg font-bold tracking-[-0.02em] text-slate-950 dark:text-white">
          Moneyly
        </span>
      )}
    </div>
  );

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {href ? (
        <Link href="/dashboard" className="flex items-center justify-center">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
};
