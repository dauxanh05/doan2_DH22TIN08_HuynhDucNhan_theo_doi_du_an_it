import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data: { taskId?: string; projectId?: string } | null;
  createdAt: string;
}

interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get<NotificationsResponse | Notification[]>(
        '/notifications?page=1&limit=20',
      );
      // Backend có thể trả array hoặc paginated object
      const result = response.data;
      if (Array.isArray(result)) {
        return result;
      }
      return result.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}
