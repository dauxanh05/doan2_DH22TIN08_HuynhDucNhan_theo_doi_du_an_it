import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
}

export function useComments(taskId: string | undefined) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const response = await api.get<Comment[]>(`/tasks/${taskId}/comments`);
      return response.data;
    },
    enabled: !!taskId,
    staleTime: 1000 * 30, // 30 seconds
  });
}
