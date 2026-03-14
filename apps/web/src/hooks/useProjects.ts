import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  image: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export function useProjects(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      const response = await api.get<Project[]>(`/workspaces/${workspaceId}/projects`);
      return response.data;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}
