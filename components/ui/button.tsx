
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:-translate-y-1',
  {
    variants: {
      variant: {
        default: 'text-white shadow-lg hover:shadow-2xl',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl',
        outline:
          'border-2 font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border-[#a07df1] text-[#a07df1] bg-transparent hover:text-white',
        secondary:
          'font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 bg-[rgba(112,112,112,0.1)] text-[#707070] border-2 border-[#707070] hover:bg-[#707070] hover:text-white',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-[#a07df1] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-8 py-4',
        sm: 'h-10 rounded-lg px-6 py-3',
        lg: 'h-14 rounded-xl px-10 py-5',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    // Apply gradient background for default variant
    const gradientStyle = variant === 'default' ? {
      background: 'linear-gradient(90deg, #a07df1, #f69dba)',
      boxShadow: '0 8px 25px rgba(160, 125, 241, 0.3)',
      ...style
    } : style;
    
    // Apply hover gradient for outline variant
    const outlineHoverStyle = variant === 'outline' ? {
      ...gradientStyle,
      '--hover-bg': 'linear-gradient(90deg, #a07df1, #f69dba)'
    } : gradientStyle;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={outlineHoverStyle}
        ref={ref}
        onMouseEnter={(e) => {
          if (variant === 'outline') {
            e.currentTarget.style.background = 'linear-gradient(90deg, #a07df1, #f69dba)';
            e.currentTarget.style.borderColor = 'transparent';
          } else if (variant === 'default') {
            e.currentTarget.style.background = 'linear-gradient(90deg, #9168f0, #f488a8)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(160, 125, 241, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (variant === 'outline') {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#a07df1';
          } else if (variant === 'default') {
            e.currentTarget.style.background = 'linear-gradient(90deg, #a07df1, #f69dba)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(160, 125, 241, 0.3)';
          }
        }}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
