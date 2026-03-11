import { useQuery } from '@tanstack/react-query';
import api, { resolveApiAssetUrl } from '@/services/api';
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
  const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace);

  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await api.get<Workspace[]>('/workspaces');
      const normalizedWorkspaces = response.data.map((workspace) => ({
        ...workspace,
        logo: resolveApiAssetUrl(workspace.logo),
      }));
      const { currentWorkspace } = useWorkspaceStore.getState();

      setWorkspaces(normalizedWorkspaces);

      if (normalizedWorkspaces.length === 0) {
        if (currentWorkspace) {
          setCurrentWorkspace(null);
        }

        return normalizedWorkspaces;
      }

      if (!currentWorkspace) {
        setCurrentWorkspace(normalizedWorkspaces[0]);
        return normalizedWorkspaces;
      }

      const matchedWorkspace = normalizedWorkspaces.find((ws) => ws.id === currentWorkspace.id);

      if (!matchedWorkspace) {
        setCurrentWorkspace(normalizedWorkspaces[0]);
      } else if (
        matchedWorkspace.name !== currentWorkspace.name ||
        matchedWorkspace.slug !== currentWorkspace.slug ||
        matchedWorkspace.logo !== currentWorkspace.logo ||
        matchedWorkspace.plan !== currentWorkspace.plan ||
        matchedWorkspace.role !== currentWorkspace.role ||
        matchedWorkspace.updatedAt !== currentWorkspace.updatedAt
      ) {
        setCurrentWorkspace(matchedWorkspace);
      }

      return normalizedWorkspaces;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
