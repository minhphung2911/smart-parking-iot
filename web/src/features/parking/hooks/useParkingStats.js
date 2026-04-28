import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../../../lib/socket';
import { getStats } from '../api';

export const useParkingStats = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['parking-stats'],
    queryFn: getStats,
  });

  useEffect(() => {
    let timer;
    const handleUpdate = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['parking-stats'] });
      }, 100);
    };

    socket.on('parkingUpdate', handleUpdate);
    socket.on('slotUpdated', handleUpdate);

    return () => {
      clearTimeout(timer);
      socket.off('parkingUpdate', handleUpdate);
      socket.off('slotUpdated', handleUpdate);
    };
  }, [queryClient]);

  return query;
};
