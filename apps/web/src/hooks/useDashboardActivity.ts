import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'PROJECT' | 'TASK' | 'WORKSPACE' | 'MEMBER';
  entityId: string;
  entityName: string;
  createdAt: string;
}

export interface ActivityResponse {
  data: Activity[];
  total: number;
  page: number;
  limit: number;
}

export function useDashboardActivity(
  workspaceId: string | undefined,
  page: number = 1,
) {
  return useQuery({
    queryKey: ['dashboard-activity', workspaceId, page],
    queryFn: async () => {
      const res = await api.get<ActivityResponse>(
        `/workspaces/${workspaceId}/dashboard/activity`,
        {
          params: { page, limit: 20 },
        },
      );
      return res.data;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 30, // 30s
  });
}
