import { useEffect, useRef, useState } from 'react';

/**
 * @interface IntersectionObserverOptions
 * @description Options for the Intersection Observer.
 * @property {number | number[]} [threshold=0] - The threshold at which the callback is executed.
 * @property {Element | null} [root=null] - The element that is used as the viewport for checking visibility.
 * @property {string} [rootMargin='0px'] - Margin around the root.
 * @property {boolean} [freezeOnceVisible=false] - If true, the observer will stop observing after the element is visible once.
 */
interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * A React hook that tracks the intersection of a DOM element with the viewport.
 * @param {IntersectionObserverOptions} [options={}] - Configuration options for the Intersection Observer.
 * @returns {{
 *   ref: React.MutableRefObject<Element | null>;
 *   entry: IntersectionObserverEntry | null;
 *   isIntersecting: boolean | undefined;
 * }} An object containing the ref to attach to the element, the intersection entry, and a boolean indicating if the element is intersecting.
 */
export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element | null>(null);
  const frozen = useRef(false);

  useEffect(() => {
    const node = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen.current || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);

      if (entry.isIntersecting && freezeOnceVisible) {
        frozen.current = true;
        observer.disconnect();
      }
    }, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return { ref: elementRef, entry, isIntersecting: entry?.isIntersecting };
}
