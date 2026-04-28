import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../../../lib/socket';
import { getSlots } from '../api';

export const useSlots = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['slots'],
    queryFn: getSlots,
  });

  useEffect(() => {
    let timer;
    const handleUpdate = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['slots'] });
      }, 100); // 100ms debounce
    };

    socket.on('slotUpdated', handleUpdate);
    socket.on('slotsUpdated', handleUpdate);
    socket.on('parkingUpdate', handleUpdate);

    return () => {
      clearTimeout(timer);
      socket.off('slotUpdated', handleUpdate);
      socket.off('slotsUpdated', handleUpdate);
      socket.off('parkingUpdate', handleUpdate);
    };
  }, [queryClient]);

  return query;
};
