import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';

interface OptimisticUpdate<T> {
  id: string;
  data: T;
  timestamp: number;
}

export function useOptimistic<T extends { id: string }>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [pending, setPending] = useState<Map<string, OptimisticUpdate<T>>>(new Map());

  const addOptimistic = useCallback((item: T) => {
    const update: OptimisticUpdate<T> = {
      id: item.id,
      data: item,
      timestamp: Date.now(),
    };

    setPending((prev) => new Map(prev).set(item.id, update));
    setData((prev) => [...prev, item]);
    logger.debug('Optimistic add', { id: item.id });
  }, []);

  const updateOptimistic = useCallback((id: string, updates: Partial<T>) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
    logger.debug('Optimistic update', { id });
  }, []);

  const removeOptimistic = useCallback((id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    logger.debug('Optimistic remove', { id });
  }, []);

  const confirmOptimistic = useCallback((id: string, serverData?: T) => {
    setPending((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });

    if (serverData) {
      setData((prev) =>
        prev.map((item) => (item.id === id ? serverData : item))
      );
    }
    logger.debug('Optimistic confirmed', { id });
  }, []);

  const revertOptimistic = useCallback((id: string) => {
    setPending((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });

    setData((prev) => prev.filter((item) => item.id !== id));
    logger.error('Optimistic reverted', { id });
  }, []);

  return {
    data,
    pending: Array.from(pending.values()),
    addOptimistic,
    updateOptimistic,
    removeOptimistic,
    confirmOptimistic,
    revertOptimistic,
    setData,
  };
}
