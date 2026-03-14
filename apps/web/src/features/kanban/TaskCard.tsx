import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar } from 'lucide-react';
import type { Task } from '@/hooks/useTasks';

const priorityConfig: Record<Task['priority'], { label: string; className: string }> = {
  URGENT: { label: 'Khẩn cấp', className: 'bg-red-500 text-white' },
  HIGH: { label: 'Cao', className: 'bg-orange-500 text-white' },
  MEDIUM: { label: 'Trung bình', className: 'bg-blue-500 text-white' },
  LOW: { label: 'Thấp', className: 'bg-gray-400 text-white' },
};

function getDueDateInfo(dueDate: string | null): {
  label: string;
  className: string;
} | null {
  if (!dueDate) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate);
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const formatted = dueDay.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

  if (dueDay < today) {
    return { label: formatted, className: 'text-red-500' };
  }
  if (dueDay.getTime() === today.getTime()) {
    return { label: formatted, className: 'text-yellow-600' };
  }
  return { label: formatted, className: 'text-gray-500 dark:text-gray-400' };
}

interface TaskCardProps {
  task: Task;
  onClick: (taskId: string) => void;
  isDragOverlay?: boolean;
}

function TaskCard({ task, onClick, isDragOverlay = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority];
  const dueDateInfo = getDueDateInfo(task.dueDate);
  const assignees = task.assignees ?? [];
  const visibleAssignees = assignees.slice(0, 3);
  const extraCount = assignees.length - 3;

  if (isDragging && !isDragOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/30 p-4 opacity-50"
      >
        <div className="h-16" />
      </div>
    );
  }

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={isDragOverlay ? undefined : style}
      {...(isDragOverlay ? {} : attributes)}
      {...(isDragOverlay ? {} : listeners)}
      onClick={() => onClick(task.id)}
      className={`cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900 ${
        isDragOverlay ? 'rotate-3 shadow-lg' : ''
      }`}
    >
      {/* Title */}
      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
        {task.title}
      </p>

      {/* Priority badge */}
      <span
        className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${priority.className}`}
      >
        {priority.label}
      </span>

      {/* Bottom row: assignees + due date */}
      <div className="mt-2 flex items-center justify-between">
        {/* Assignee avatars */}
        <div className="flex -space-x-2">
          {visibleAssignees.map((assignee) => (
            <div
              key={assignee.userId}
              title={assignee.user.name}
              className="h-6 w-6 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[10px] font-medium text-white dark:border-gray-900 overflow-hidden"
            >
              {assignee.user.avatar ? (
                <img
                  src={assignee.user.avatar}
                  alt={assignee.user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                assignee.user.name.charAt(0).toUpperCase()
              )}
            </div>
          ))}
          {extraCount > 0 && (
            <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-[10px] font-medium text-gray-700 dark:border-gray-900 dark:bg-gray-600 dark:text-gray-200">
              +{extraCount}
            </div>
          )}
        </div>

        {/* Due date */}
        {dueDateInfo && (
          <div className={`flex items-center gap-1 text-xs ${dueDateInfo.className}`}>
            <Calendar className="h-3 w-3" />
            <span>{dueDateInfo.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(TaskCard);
