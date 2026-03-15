import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api, { resolveApiAssetUrl } from '@/services/api';

interface UploadProjectImageResponse {
  image: string;
}

interface UploadProjectImageParams {
  projectId: string;
  workspaceId: string;
  file: File;
}

export function useUploadProjectImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, file }: UploadProjectImageParams) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.patch<UploadProjectImageResponse>(
        `/projects/${projectId}/image`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      return {
        ...response.data,
        image: resolveApiAssetUrl(response.data.image) ?? response.data.image,
      };
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] }),
        queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] }),
      ]);
      toast.success('Cập nhật ảnh dự án thành công!');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Cập nhật ảnh dự án thất bại';
      toast.error(message);
    },
  });
}
