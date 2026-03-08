import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
}

export function useWorkspaceMembers(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['workspaceMembers', workspaceId],
    queryFn: async () => {
      const response = await api.get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`);
      return response.data;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}
