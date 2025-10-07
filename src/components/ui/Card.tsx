import { forwardRef, memo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export const Card = memo(
  forwardRef<HTMLDivElement, CardProps>(
    ({ children, hover = false, className = '', ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${hover ? 'transition-shadow hover:shadow-md' : ''} ${className}`}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

Card.displayName = 'Card';
