import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface TaskUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface TaskAssignee {
  taskId: string;
  userId: string;
  assignedAt: string;
  user: TaskUser;
}

export interface ChecklistItem {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  position: number;
}

export interface Attachment {
  id: string;
  taskId: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

export interface TaskDetail {
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
  assignees: TaskAssignee[];
  subtasks: TaskDetail[];
  checklists: ChecklistItem[];
  attachments: Attachment[];
}

export function useTask(taskId: string | undefined) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await api.get<TaskDetail>(`/tasks/${taskId}`);
      return response.data;
    },
    enabled: !!taskId,
    staleTime: 1000 * 30,
  });
}
