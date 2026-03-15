import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface ProjectProgress {
  projectId: string;
  name: string;
  color: string;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
}

export interface TasksByStatus {
  TODO: number;
  IN_PROGRESS: number;
  DONE: number;
}

export interface OverdueTask {
  id: string;
  title: string;
  dueDate: string;
  daysOverdue: number;
  projectName: string;
  assignees: {
    id: string;
    name: string;
  }[];
}

export interface MemberWorkload {
  userId: string;
  name: string;
  activeTasks: number;
  completedTasks: number;
}

export interface DashboardStats {
  projectsProgress: ProjectProgress[];
  tasksByStatus: TasksByStatus;
  overdueTasks: OverdueTask[];
  memberWorkload: MemberWorkload[];
}

export function useDashboardStats(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard-stats', workspaceId],
    queryFn: async () => {
      const res = await api.get<DashboardStats>(
        `/workspaces/${workspaceId}/dashboard/stats`,
      );
      return res.data;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60, // 1 min
  });
}
