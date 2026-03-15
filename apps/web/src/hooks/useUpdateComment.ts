import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import type { Comment } from '@/hooks/useComments';

interface UpdateCommentParams {
  taskId: string;
  commentId: string;
  data: {
    content: string;
    mentions?: string[];
  };
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, data }: UpdateCommentParams) => {
      const response = await api.patch<Comment>(`/comments/${commentId}`, data);
      return response.data;
    },
    onSuccess: (_comment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.taskId] });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Cập nhật bình luận thất bại';
      toast.error(message);
    },
  });
}
