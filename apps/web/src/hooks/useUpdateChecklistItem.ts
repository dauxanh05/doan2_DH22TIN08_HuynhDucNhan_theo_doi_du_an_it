import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface UpdateChecklistItemParams {
  projectId: string;
  taskId: string;
  checklistId: string;
  data: {
    title?: string;
    completed?: boolean;
  };
}

export function useUpdateChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ checklistId, data }: UpdateChecklistItemParams) => {
      const response = await api.patch(`/checklists/${checklistId}`, data);
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['task-checklists', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['project-stats', variables.projectId] }),
      ]);
      toast.success('Đã cập nhật checklist item');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Cập nhật checklist item thất bại';
      toast.error(message);
    },
  });
}
