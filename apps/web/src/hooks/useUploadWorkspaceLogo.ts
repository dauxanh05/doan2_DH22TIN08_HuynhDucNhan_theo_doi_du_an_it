import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api, { resolveApiAssetUrl } from '@/services/api';
import { useWorkspaceStore } from '@/stores/workspace.store';

interface UploadWorkspaceLogoResponse {
  logo: string;
}

export function useUploadWorkspaceLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, file }: { workspaceId: string; file: File }) => {
      const formData = new FormData();
      formData.append('logo', file);
      const response = await api.patch<UploadWorkspaceLogoResponse>(
        `/workspaces/${workspaceId}/logo`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      return {
        ...response.data,
        logo: resolveApiAssetUrl(response.data.logo) ?? response.data.logo,
      };
    },
    onSuccess: (data, variables) => {
      const resolvedLogo = resolveApiAssetUrl(data.logo);

      queryClient.setQueryData(['workspace', variables.workspaceId], (previous: unknown) => {
        if (!previous || typeof previous !== 'object') {
          return previous;
        }

        return {
          ...(previous as Record<string, unknown>),
          logo: resolvedLogo,
        };
      });

      queryClient.setQueryData(['workspaces'], (previous: unknown) => {
        if (!Array.isArray(previous)) {
          return previous;
        }

        return previous.map((workspace) => {
          if (
            workspace &&
            typeof workspace === 'object' &&
            'id' in workspace &&
            workspace.id === variables.workspaceId
          ) {
            return {
              ...(workspace as Record<string, unknown>),
              logo: resolvedLogo,
            };
          }

          return workspace;
        });
      });

      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });

      const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore.getState();
      if (currentWorkspace?.id === variables.workspaceId && resolvedLogo) {
        setCurrentWorkspace({
          ...currentWorkspace,
          logo: resolvedLogo,
        });
      }

      toast.success('Cập nhật logo thành công!');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Cập nhật logo thất bại';
      toast.error(message);
    },
  });
}
