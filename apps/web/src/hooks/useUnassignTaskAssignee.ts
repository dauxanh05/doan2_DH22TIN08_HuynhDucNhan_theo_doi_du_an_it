import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface UnassignTaskAssigneeParams {
  projectId: string;
  taskId: string;
  userId: string;
}

export function useUnassignTaskAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, userId }: UnassignTaskAssigneeParams) => {
      const response = await api.delete(`/tasks/${taskId}/assignees/${userId}`);
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] }),
      ]);
      toast.success('Đã bỏ người phụ trách');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể bỏ người phụ trách';
      toast.error(message);
    },
  });
}
