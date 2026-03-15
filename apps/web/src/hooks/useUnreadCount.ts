import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface UnreadCountResponse {
  count: number;
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const response = await api.get<UnreadCountResponse>('/notifications/unread-count');
      return response.data.count;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}
