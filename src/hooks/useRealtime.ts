import { useEffect, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';

interface RealtimeOptions<T> {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: { old: T }) => void;
}

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
