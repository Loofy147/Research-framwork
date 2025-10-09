import { forwardRef, memo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * @interface CardProps
 * @description Props for the Card component. Extends standard div attributes.
 * @property {ReactNode} children - The content to be displayed inside the card.
 * @property {boolean} [hover=false] - If true, the card will have a hover effect.
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

/**
 * A styled container component that resembles a card.
 * It can optionally have a hover effect and forwards a ref to the underlying div element.
 * @param {CardProps} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to forward to the div element.
 * @returns {JSX.Element} The rendered Card component.
 */
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
