import { apiClient } from '../../services/api-client';

export const getSlots = async () => {
  const { data } = await apiClient.get('/slots');
  return data;
};
