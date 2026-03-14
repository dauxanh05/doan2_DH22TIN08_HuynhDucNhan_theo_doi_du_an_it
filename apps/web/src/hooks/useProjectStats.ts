import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface ProjectStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export function useProjectStats(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-stats', projectId],
    queryFn: async () => {
      const response = await api.get<ProjectStats>(`/projects/${projectId}/stats`);
      return response.data;
    },
    enabled: !!projectId,
    staleTime: 1000 * 60,
  });
}
