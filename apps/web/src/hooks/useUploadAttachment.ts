import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface UploadAttachmentParams {
  projectId: string;
  taskId: string;
  file: File;
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, file }: UploadAttachmentParams) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] }),
        queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] }),
      ]);
      toast.success('Tải file lên thành công');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Tải file lên thất bại';
      toast.error(message);
    },
  });
}
