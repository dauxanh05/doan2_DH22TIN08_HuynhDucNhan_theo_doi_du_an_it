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

interface WorkspaceDetail {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  plan: 'FREE' | 'STARTER' | 'PROFESSIONAL';
  createdAt: string;
  updatedAt: string;
  members: WorkspaceMember[];
}

export function useWorkspace(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const response = await api.get<WorkspaceDetail>(`/workspaces/${workspaceId}`);
      return response.data;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
