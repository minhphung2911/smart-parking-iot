import { apiClient } from '../../services/api-client';

export const getStats = async () => {
  const { data } = await apiClient.get('/stats');
  return data;
};
