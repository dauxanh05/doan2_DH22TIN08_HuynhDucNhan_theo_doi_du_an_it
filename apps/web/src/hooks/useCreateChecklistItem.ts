import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface CreateChecklistItemParams {
  projectId: string;
  taskId: string;
  data: {
    title: string;
  };
}

export function useCreateChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, data }: CreateChecklistItemParams) => {
      const response = await api.post(`/tasks/${taskId}/checklists`, data);
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['task-checklists', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['project-stats', variables.projectId] }),
      ]);
      toast.success('Đã thêm checklist item');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Thêm checklist item thất bại';
      toast.error(message);
    },
  });
}
