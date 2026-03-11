import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface JoinWorkspaceResponse {
  message: string;
  workspaceId: string;
}

export function useJoinWorkspace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post<JoinWorkspaceResponse>(`/workspaces/join/${token}`);
      return response.data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      await queryClient.refetchQueries({ queryKey: ['workspaces'], type: 'all' });
      toast.success('Tham gia workspace thành công!');
      navigate('/workspaces', {
        replace: true,
        state: { joinedWorkspaceId: data.workspaceId },
      });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Tham gia workspace thất bại';
      toast.error(message);
    },
  });
}
