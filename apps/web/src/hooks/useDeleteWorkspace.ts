import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useWorkspaceStore } from '@/stores/workspace.store';

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace);

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await api.delete(`/workspaces/${workspaceId}`);
      return response.data;
    },
    onSuccess: (_data, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      // Clear currentWorkspace if deleting the active one
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(null);
      }
      toast.success('Xóa workspace thành công!');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Xóa workspace thất bại';
      toast.error(message);
    },
  });
}
