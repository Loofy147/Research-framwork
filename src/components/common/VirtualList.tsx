import { useCallback, useRef, useState, useEffect, memo } from 'react';
import type { ReactNode } from 'react';

/**
 * @interface VirtualListProps
 * @description Props for the VirtualList component.
 * @template T - The type of the items in the list.
 * @property {T[]} items - The array of items to render.
 * @property {number} itemHeight - The height of each item in pixels. This must be constant.
 * @property {number} containerHeight - The height of the scrollable container in pixels.
 * @property {number} [overscan=3] - The number of items to render before and after the visible area to reduce flickering on scroll.
 * @property {(item: T, index: number) => ReactNode} renderItem - A function that renders a single item.
 * @property {(item: T, index: number) => string} keyExtractor - A function that returns a unique key for each item.
 */
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
}

/**
 * A component that renders a virtualized list, only rendering the items currently
 * visible in the viewport (plus an overscan buffer) to improve performance with long lists.
 * @template T - The type of the items in the list.
 * @param {VirtualListProps<T>} props - The props for the component.
 * @returns {JSX.Element} The rendered VirtualList component.
 */
function VirtualListComponent<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
  renderItem,
  keyExtractor,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);
  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      setScrollTop(container.scrollTop);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: containerHeight, overflow: 'auto' }}
      className="relative"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
            position: 'absolute',
            width: '100%',
          }}
        >
          {visibleItems.map((item, idx) => {
            const actualIndex = startIndex + idx;
            return (
              <div
                key={keyExtractor(item, actualIndex)}
                style={{ height: itemHeight }}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const VirtualList = memo(VirtualListComponent) as typeof VirtualListComponent;
