import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import type { ChecklistItem } from '@/hooks/useTask';

export function useChecklists(taskId: string | undefined) {
  return useQuery({
    queryKey: ['task-checklists', taskId],
    queryFn: async () => {
      const response = await api.get<ChecklistItem[]>(`/tasks/${taskId}/checklists`);
      return response.data;
    },
    enabled: !!taskId,
    staleTime: 1000 * 30,
  });
}
