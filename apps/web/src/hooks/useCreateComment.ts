import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import type { Comment } from '@/hooks/useComments';

interface CreateCommentParams {
  taskId: string;
  data: {
    content: string;
    mentions?: string[];
  };
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, data }: CreateCommentParams) => {
      const response = await api.post<Comment>(`/tasks/${taskId}/comments`, data);
      return response.data;
    },
    onSuccess: (_comment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.taskId] });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gửi bình luận thất bại';
      toast.error(message);
    },
  });
}
