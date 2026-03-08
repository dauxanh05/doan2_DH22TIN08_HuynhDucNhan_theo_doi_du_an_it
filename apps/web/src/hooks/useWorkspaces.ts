import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';
import { useWorkspaceStore } from '@/stores/workspace.store';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  plan: 'FREE' | 'STARTER' | 'PROFESSIONAL';
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  createdAt: string;
  updatedAt: string;
}

export function useWorkspaces() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces);

  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await api.get<Workspace[]>('/workspaces');
      setWorkspaces(response.data);
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
