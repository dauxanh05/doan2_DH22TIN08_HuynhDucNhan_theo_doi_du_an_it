// Auth
export type AuthProvider = 'LOCAL' | 'GOOGLE';
export type Theme = 'LIGHT' | 'DARK' | 'SYSTEM';

// Workspace
export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
export type Plan = 'FREE' | 'STARTER' | 'PROFESSIONAL';

// Project
export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

// Task
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

// Notification
export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_UPDATED'
  | 'TASK_COMPLETED'
  | 'COMMENT_ADDED'
  | 'COMMENT_MENTION'
  | 'DEADLINE_APPROACHING'
  | 'INVITATION_RECEIVED';

// User
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  provider: AuthProvider;
  theme: Theme;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Workspace
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: Role;
  joinedAt: string;
  user: User;
}

// Project
export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

// Task
export interface Task {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  position: number;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignees?: TaskAssignee[];
  subtasks?: Task[];
  checklists?: ChecklistItem[];
}

export interface TaskAssignee {
  taskId: string;
  userId: string;
  assignedAt: string;
  user: User;
}

export interface ChecklistItem {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  position: number;
}

// Comment
export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  read: boolean;
  createdAt: string;
}

// API Response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
