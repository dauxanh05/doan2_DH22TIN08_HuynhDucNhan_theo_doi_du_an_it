import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface AssignTaskAssigneeParams {
  projectId: string;
  taskId: string;
  userId: string;
}

export function useAssignTaskAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, userId }: AssignTaskAssigneeParams) => {
      const response = await api.post(`/tasks/${taskId}/assignees`, { userId });
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] }),
      ]);
      toast.success('Đã gán người phụ trách');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể gán người phụ trách';
      toast.error(message);
    },
  });
}
