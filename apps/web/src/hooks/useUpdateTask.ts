import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface UpdateTaskParams {
  projectId: string;
  taskId: string;
  silent?: boolean;
  data: {
    title?: string;
    description?: string | null;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate?: string | null;
  };
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, data }: UpdateTaskParams) => {
      const response = await api.patch(`/tasks/${taskId}`, data);
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] }),
        queryClient.invalidateQueries({ queryKey: ['project-stats', variables.projectId] }),
      ]);
      if (!variables.silent) {
        toast.success('Cập nhật task thành công!');
      }
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Cập nhật task thất bại';
      toast.error(message);
    },
  });
}
