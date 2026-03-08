import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface UpdateMemberRoleParams {
  workspaceId: string;
  userId: string;
  data: {
    role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  };
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, userId, data }: UpdateMemberRoleParams) => {
      const response = await api.patch(`/workspaces/${workspaceId}/members/${userId}`, data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] });
      toast.success('Cập nhật vai trò thành công!');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Cập nhật vai trò thất bại';
      toast.error(message);
    },
  });
}
