import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface InviteMemberDto {
  email: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
}

interface InviteMemberParams {
  workspaceId: string;
  data: InviteMemberDto;
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, data }: InviteMemberParams) => {
      const response = await api.post(`/workspaces/${workspaceId}/invite`, data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] });
      toast.success('Gửi lời mời thành công!');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gửi lời mời thất bại';
      toast.error(message);
    },
  });
}
