import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * @interface OptimisticUpdate
 * @description Represents a pending optimistic update.
 * @template T
 * @property {string} id - The unique identifier of the item being updated.
 * @property {T} data - The optimistic data.
 * @property {number} timestamp - The timestamp of when the update was initiated.
 */
interface OptimisticUpdate<T> {
  id: string;
  data: T;
  timestamp: number;
}

/**
 * A React hook for managing optimistic UI updates.
 * @template T - The type of the data items, which must have an `id` property.
 * @param {T[]} initialData - The initial array of data.
 * @returns {{
 *   data: T[];
 *   pending: OptimisticUpdate<T>[];
 *   addOptimistic: (item: T) => void;
 *   updateOptimistic: (id: string, updates: Partial<T>) => void;
 *   removeOptimistic: (id: string) => void;
 *   confirmOptimistic: (id: string, serverData?: T) => void;
 *   revertOptimistic: (id: string) => void;
 *   setData: React.Dispatch<React.SetStateAction<T[]>>;
 * }} An object with the current data, pending updates, and functions to manage optimistic state.
 */
export function useOptimistic<T extends { id: string }>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [pending, setPending] = useState<Map<string, OptimisticUpdate<T>>>(new Map());

  /**
   * Adds an item optimistically to the local state.
   * @param {T} item - The item to add.
   */
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

  /**
   * Updates an item optimistically in the local state.
   * @param {string} id - The ID of the item to update.
   * @param {Partial<T>} updates - The partial data to update the item with.
   */
  const updateOptimistic = useCallback((id: string, updates: Partial<T>) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
    logger.debug('Optimistic update', { id });
  }, []);

  /**
   * Removes an item optimistically from the local state.
   * @param {string} id - The ID of the item to remove.
   */
  const removeOptimistic = useCallback((id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    logger.debug('Optimistic remove', { id });
  }, []);

  /**
   * Confirms an optimistic update, removing it from the pending queue.
   * Optionally updates the item with data from the server.
   * @param {string} id - The ID of the optimistic update to confirm.
   * @param {T} [serverData] - The final data from the server.
   */
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

  /**
   * Reverts an optimistic update, removing the item from the local state.
   * @param {string} id - The ID of the optimistic update to revert.
   */
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
