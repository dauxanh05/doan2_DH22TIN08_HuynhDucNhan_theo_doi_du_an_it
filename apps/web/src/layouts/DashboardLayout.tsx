import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useWorkspaceStore } from '@/stores/workspace.store';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const { isLoading } = useWorkspaces();

  useEffect(() => {
    const match = location.pathname.match(/^\/workspaces\/([^/]+)\/(settings|members)$/);
    if (!match || isLoading) return;

    const routeWorkspaceId = match[1];

    if (currentWorkspace?.id === routeWorkspaceId) {
      return;
    }

    const routeWorkspace = workspaces.find((workspace) => workspace.id === routeWorkspaceId);

    if (routeWorkspace) {
      useWorkspaceStore.getState().setCurrentWorkspace(routeWorkspace);
      return;
    }

    navigate('/workspaces', { replace: true });
  }, [location.pathname, currentWorkspace, isLoading, navigate, workspaces]);

  useEffect(() => {
    if (location.pathname === '/workspaces' || isLoading) {
      return;
    }

    if (workspaces.length === 0 && !currentWorkspace) {
      navigate('/workspaces', { replace: true });
    }
  }, [currentWorkspace, isLoading, location.pathname, navigate, workspaces.length]);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
