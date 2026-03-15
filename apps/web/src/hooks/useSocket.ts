import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { connectSocket, disconnectSocket, getSocket } from '@/services/socket';

export function useSocket() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

  // Effect 1: connect / disconnect theo auth state
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(accessToken);

    // Task events — invalidate task list của project tương ứng
    socket.on('task_created', (data: { projectId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.projectId] });
    });

    socket.on('task_updated', (data: { projectId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.projectId] });
    });

    socket.on('task_deleted', (data: { projectId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.projectId] });
    });

    // Comment events — invalidate comments của task tương ứng
    socket.on('comment_added', (data: { taskId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.taskId] });
    });

    // Notification events — invalidate list + unread count
    socket.on('notification', () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    });

    return () => {
      socket.removeAllListeners();
      disconnectSocket();
    };
  }, [isAuthenticated, accessToken, queryClient]);

  // Effect 2: join workspace room khi workspace thay đổi
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !currentWorkspace?.id) return;

    socket.emit('join_workspace', { workspaceId: currentWorkspace.id });
  }, [currentWorkspace?.id]);
}
