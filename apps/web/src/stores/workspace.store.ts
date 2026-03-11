import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  switchWorkspace: (workspaceId: string) => Workspace | null;
  clearWorkspaces: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: [],
      currentWorkspace: null,
      setWorkspaces: (workspaces) => set({ workspaces }),
      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      switchWorkspace: (workspaceId) => {
        const ws = get().workspaces.find((w) => w.id === workspaceId) ?? null;
        if (ws) {
          set({ currentWorkspace: ws });
        }
        return ws;
      },
      clearWorkspaces: () => set({ workspaces: [], currentWorkspace: null }),
    }),
    {
      name: 'workspace-storage',
      partialize: (state) => ({ currentWorkspace: state.currentWorkspace }),
    },
  ),
);
