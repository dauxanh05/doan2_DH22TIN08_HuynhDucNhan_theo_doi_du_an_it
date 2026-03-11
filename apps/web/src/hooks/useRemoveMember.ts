import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';
import { useWorkspaceStore } from '@/stores/workspace.store';

interface RemoveMemberParams {
  workspaceId: string;
  userId: string;
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, userId }: RemoveMemberParams) => {
      const response = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] }),
        queryClient.invalidateQueries({ queryKey: ['workspaces'] }),
        queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] }),
      ]);

      const currentUserId = useAuthStore.getState().user?.id;
      const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore.getState();
      const isSelfRemove = variables.userId === currentUserId;

      if (isSelfRemove) {
        if (currentWorkspace?.id === variables.workspaceId) {
          setCurrentWorkspace(null);
        }
        toast.success('Đã rời workspace');
        return;
      }

      toast.success('Xóa thành viên thành công!');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Xóa thành viên thất bại';
      toast.error(message);
    },
  });
}
