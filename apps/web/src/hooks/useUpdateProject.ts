import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import type { Project } from '@/hooks/useProjects';

interface UpdateProjectParams {
  projectId: string;
  workspaceId: string;
  data: {
    name?: string;
    description?: string | null;
    color?: string;
    icon?: string | null;
    status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  };
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, data }: UpdateProjectParams) => {
      const response = await api.patch<Project>(`/projects/${projectId}`, data);
      return response.data;
    },
    onSuccess: async (project, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] }),
        queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] }),
      ]);
      toast.success(`Đã cập nhật dự án "${project.name}"`);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Cập nhật dự án thất bại';
      toast.error(message);
    },
  });
}
