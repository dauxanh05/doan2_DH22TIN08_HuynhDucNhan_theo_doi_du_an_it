import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] });
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
