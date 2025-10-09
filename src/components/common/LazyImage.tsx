import { useState, useEffect, memo } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

/**
 * @interface LazyImageProps
 * @description Props for the LazyImage component.
 * @property {string} src - The source URL of the image to load.
 * @property {string} alt - The alternative text for the image.
 * @property {string} [placeholder] - A placeholder image source to display while the main image is loading. Defaults to a gray SVG.
 * @property {string} [className] - Additional CSS classes to apply to the container element.
 * @property {() => void} [onLoad] - Callback function to be executed when the image successfully loads.
 * @property {() => void} [onError] - Callback function to be executed if the image fails to load.
 */
interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * A React component that lazily loads an image when it enters the viewport.
 * It displays a placeholder until the image is loaded.
 * @param {LazyImageProps} props - The props for the component.
 * @returns {JSX.Element} The rendered LazyImage component.
 */
export const LazyImage = memo(({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3C/svg%3E',
  className = '',
  onLoad,
  onError,
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.01,
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (!isIntersecting) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };

    img.onerror = () => {
      onError?.();
    };
  }, [isIntersecting, src, onLoad, onError]);

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';
