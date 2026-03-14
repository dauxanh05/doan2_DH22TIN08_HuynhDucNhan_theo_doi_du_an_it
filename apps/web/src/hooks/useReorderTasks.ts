import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import type { Task } from '@/hooks/useTasks';

interface ReorderItem {
  id: string;
  position: number;
}

interface ReorderTasksParams {
  projectId: string;
  tasks: ReorderItem[];
}

export function useReorderTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tasks }: ReorderTasksParams) => {
      const response = await api.patch('/tasks/reorder', { tasks });
      return response.data;
    },
    onMutate: async ({ projectId, tasks: reorderItems }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', projectId]);

      if (previousTasks) {
        const positionMap = new Map(reorderItems.map((item) => [item.id, item.position]));
        const updatedTasks = previousTasks.map((task) => {
          const newPosition = positionMap.get(task.id);
          if (newPosition !== undefined) {
            return { ...task, position: newPosition };
          }
          return task;
        });
        queryClient.setQueryData(['tasks', projectId], updatedTasks);
      }

      return { previousTasks };
    },
    onError: (_error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', variables.projectId], context.previousTasks);
      }
      toast.error('Sắp xếp task thất bại');
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    },
  });
}
