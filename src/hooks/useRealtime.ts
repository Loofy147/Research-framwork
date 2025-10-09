import { useEffect, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';

/**
 * @interface RealtimeOptions
 * @description Options for the useRealtime hook.
 * @template T
 * @property {string} table - The name of the table to subscribe to.
 * @property {string} [filter] - A filter string for the subscription (e.g., 'id=eq.1').
 * @property {'INSERT' | 'UPDATE' | 'DELETE' | '*'} [event='*'] - The type of event to listen for.
 * @property {(payload: T) => void} [onInsert] - Callback for INSERT events.
 * @property {(payload: T) => void} [onUpdate] - Callback for UPDATE events.
 * @property {(payload: { old: T }) => void} [onDelete] - Callback for DELETE events.
 */
interface RealtimeOptions<T> {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: { old: T }) => void;
}

/**
 * A React hook for subscribing to Supabase real-time changes.
 * @template T - The expected type of the payload data.
 * @param {RealtimeOptions<T>} options - The configuration for the real-time subscription.
 * @returns {{
 *   connected: boolean;
 *   channel: RealtimeChannel | null;
 * }} An object containing the connection status and the Supabase channel instance.
 */
export function useRealtime<T = unknown>(options: RealtimeOptions<T>) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [connected, setConnected] = useState(false);

  const subscribe = useCallback(() => {
    const newChannel = supabase
      .channel(`${options.table}-changes`)
      .on(
        'postgres_changes' as any,
        {
          event: options.event || '*',
          schema: 'public',
          table: options.table,
          filter: options.filter,
        },
        (payload: any) => {
          logger.debug('Realtime event', { table: options.table, event: payload.eventType });

          if (payload.eventType === 'INSERT' && options.onInsert) {
            options.onInsert(payload.new as T);
          } else if (payload.eventType === 'UPDATE' && options.onUpdate) {
            options.onUpdate(payload.new as T);
          } else if (payload.eventType === 'DELETE' && options.onDelete) {
            options.onDelete({ old: payload.old as T });
          }
        }
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
        logger.info('Realtime subscription status', { status, table: options.table });
      });

    setChannel(newChannel);
  }, [options]);

  useEffect(() => {
    subscribe();

    return () => {
      if (channel) {
        channel.unsubscribe();
        logger.info('Realtime channel unsubscribed', { table: options.table });
      }
    };
  }, [subscribe, channel, options.table]);

  return { connected, channel };
}
