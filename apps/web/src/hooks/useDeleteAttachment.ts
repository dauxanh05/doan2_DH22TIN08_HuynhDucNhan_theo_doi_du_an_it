import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface DeleteAttachmentParams {
  projectId: string;
  taskId: string;
  attachmentId: string;
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ attachmentId }: DeleteAttachmentParams) => {
      const response = await api.delete(`/attachments/${attachmentId}`);
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] }),
      ]);
      toast.success('Đã xóa tệp đính kèm');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Xóa tệp đính kèm thất bại';
      toast.error(message);
    },
  });
}
