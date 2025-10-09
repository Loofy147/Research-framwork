import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useRealtime } from './useRealtime';
import { useOptimistic } from './useOptimistic';
import { logger } from '../utils/logger';
import type { Task } from '../types/database';

/**
 * A comprehensive hook for managing tasks, including data fetching, real-time updates, and optimistic UI.
 * @returns {{
 *   tasks: Task[];
 *   loading: boolean;
 *   error: string | null;
 *   createTask: (data: Partial<Task>) => Promise<Task | null>;
 *   updateTask: (id: string, data: Partial<Task>) => Promise<Task | null>;
 *   deleteTask: (id: string) => Promise<void>;
 *   reload: () => Promise<void>;
 * }} An object containing the tasks, loading state, error state, and functions to manipulate tasks.
 */
export function useTasks() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    data: tasks,
    addOptimistic,
    updateOptimistic,
    removeOptimistic,
    confirmOptimistic,
    revertOptimistic,
    setData,
  } = useOptimistic<Task>([]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await apiService.query<Task>('tasks', {
      order: { column: 'created_at', ascending: false },
    });

    if (response.error) {
      setError(response.error.message);
      logger.error('Failed to load tasks', response.error);
    } else if (response.data) {
      setData(response.data);
    }

    setLoading(false);
  }, [setData]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useRealtime<Task>({
    table: 'tasks',
    onInsert: (payload) => {
      setData((current) => [payload, ...current]);
      logger.info('Task created via realtime', { id: payload.id });
    },
    onUpdate: (payload) => {
      setData((current) =>
        current.map((task) => (task.id === payload.id ? payload : task))
      );
      logger.info('Task updated via realtime', { id: payload.id });
    },
    onDelete: (payload) => {
      setData((current) => current.filter((task) => task.id !== payload.old.id));
      logger.info('Task deleted via realtime', { id: payload.old.id });
    },
  });

  const createTask = useCallback(
    async (data: Partial<Task>) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticTask: Task = {
        id: tempId,
        user_id: '',
        title: data.title || '',
        description: data.description || null,
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        due_date: data.due_date || null,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      addOptimistic(optimisticTask);

      const response = await apiService.create<Task>('tasks', data);

      if (response.error) {
        revertOptimistic(tempId);
        setError(response.error.message);
        throw new Error(response.error.message);
      } else if (response.data) {
        confirmOptimistic(tempId, response.data);
      }

      return response.data;
    },
    [addOptimistic, confirmOptimistic, revertOptimistic]
  );

  const updateTask = useCallback(
    async (id: string, data: Partial<Task>) => {
      updateOptimistic(id, data);

      const response = await apiService.update<Task>('tasks', id, data);

      if (response.error) {
        await loadTasks();
        setError(response.error.message);
        throw new Error(response.error.message);
      } else if (response.data) {
        confirmOptimistic(id, response.data);
      }

      return response.data;
    },
    [updateOptimistic, confirmOptimistic, loadTasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      removeOptimistic(id);

      const response = await apiService.delete('tasks', id);

      if (response.error) {
        await loadTasks();
        setError(response.error.message);
        throw new Error(response.error.message);
      }
    },
    [removeOptimistic, loadTasks]
  );

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    reload: loadTasks,
  };
}
