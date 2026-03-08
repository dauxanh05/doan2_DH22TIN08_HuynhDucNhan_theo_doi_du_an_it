import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface UpdateWorkspaceDto {
  name?: string;
  slug?: string;
  logo?: string | null;
}

interface UpdateWorkspaceParams {
  workspaceId: string;
  data: UpdateWorkspaceDto;
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, data }: UpdateWorkspaceParams) => {
      const response = await api.patch(`/workspaces/${workspaceId}`, data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
      toast.success('Cập nhật workspace thành công!');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Cập nhật workspace thất bại';
      toast.error(message);
    },
  });
}
