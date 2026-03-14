import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import type { Task } from '@/hooks/useTasks';

interface CreateTaskParams {
  projectId: string;
  data: {
    title: string;
    description?: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate?: string | null;
  };
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, data }: CreateTaskParams) => {
      const response = await api.post<Task>(`/projects/${projectId}/tasks`, data);
      return response.data;
    },
    onSuccess: async (task, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] }),
        queryClient.invalidateQueries({ queryKey: ['project-stats', variables.projectId] }),
      ]);
      toast.success(`Đã tạo task "${task.title}"`);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Tạo task thất bại';
      toast.error(message);
    },
  });
}
