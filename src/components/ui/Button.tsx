import { forwardRef, memo } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', children, className = '', ...props }, ref) => {
      const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
      const variantStyles = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      };
      const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
      };

      return (
        <button
          ref={ref}
          className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
          {...props}
        >
          {children}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';
