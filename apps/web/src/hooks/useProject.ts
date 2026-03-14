import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import type { Project } from '@/hooks/useProjects';

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await api.get<Project>(`/projects/${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 2,
  });
}
