import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface TaskAssigneeUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface TaskAssignee {
  taskId: string;
  userId: string;
  assignedAt: string;
  user: TaskAssigneeUser;
}

export interface Task {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  position: number;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignees?: TaskAssignee[];
}

export function useTasks(projectId: string | undefined) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
      return response.data;
    },
    enabled: !!projectId,
    staleTime: 1000 * 60,
  });
}
