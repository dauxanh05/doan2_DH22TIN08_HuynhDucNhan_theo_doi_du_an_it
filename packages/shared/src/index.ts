export * from './types';

// Constants
export const PRIORITY_LABELS: Record<string, string> = {
  URGENT: 'Khẩn cấp',
  HIGH: 'Cao',
  MEDIUM: 'Trung bình',
  LOW: 'Thấp',
};

export const PRIORITY_COLORS: Record<string, string> = {
  URGENT: 'bg-red-500',
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-gray-400',
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  TODO: 'Cần làm',
  IN_PROGRESS: 'Đang làm',
  DONE: 'Hoàn thành',
};

export const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Chủ sở hữu',
  ADMIN: 'Quản trị viên',
  MEMBER: 'Thành viên',
  VIEWER: 'Người xem',
};
