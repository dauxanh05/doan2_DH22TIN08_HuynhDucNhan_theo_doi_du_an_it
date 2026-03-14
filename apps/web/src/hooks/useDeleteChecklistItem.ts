import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface DeleteChecklistItemParams {
  projectId: string;
  taskId: string;
  checklistId: string;
}

export function useDeleteChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ checklistId }: DeleteChecklistItemParams) => {
      const response = await api.delete(`/checklists/${checklistId}`);
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['task-checklists', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['project-stats', variables.projectId] }),
      ]);
      toast.success('Đã xóa checklist item');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Xóa checklist item thất bại';
      toast.error(message);
    },
  });
}
