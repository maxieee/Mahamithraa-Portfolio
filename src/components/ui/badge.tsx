import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-colors duration-300',
  {
    variants: {
      variant: {
        default: 'border-hairline bg-white/[0.04] text-muted',
        accent: 'border-accent/35 bg-accent/10 text-accent-soft',
        glow: 'border-glow/30 bg-glow/10 text-glow-soft',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
