import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import type { Project } from '@/hooks/useProjects';

interface CreateProjectPayload {
  workspaceId: string;
  data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string | null;
    status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  };
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, data }: CreateProjectPayload) => {
      const response = await api.post<Project>(`/workspaces/${workspaceId}/projects`, data);
      return response.data;
    },
    onSuccess: (project, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] });
      toast.success(`Đã tạo dự án "${project.name}"`);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Tạo dự án thất bại';
      toast.error(message);
    },
  });
}
