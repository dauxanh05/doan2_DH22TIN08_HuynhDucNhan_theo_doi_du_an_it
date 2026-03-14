import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface DeleteProjectParams {
  projectId: string;
  workspaceId: string;
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: DeleteProjectParams) => {
      const response = await api.delete(`/projects/${projectId}`);
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] }),
        queryClient.removeQueries({ queryKey: ['project', variables.projectId] }),
        queryClient.removeQueries({ queryKey: ['project-stats', variables.projectId] }),
        queryClient.removeQueries({ queryKey: ['tasks', variables.projectId] }),
      ]);
      toast.success('Đã xóa dự án');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Xóa dự án thất bại';
      toast.error(message);
    },
  });
}
