import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import QuickAddTask from './QuickAddTask';
import type { Task } from '@/hooks/useTasks';

export interface ColumnConfig {
  id: Task['status'];
  name: string;
  color: string;
}

interface KanbanColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  projectId: string;
  onTaskClick: (taskId: string) => void;
}

export default function KanbanColumn({
  column,
  tasks,
  projectId,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', status: column.id },
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      className={`flex-shrink-0 w-80 rounded-xl p-4 flex flex-col transition-colors ${
        isOver
          ? 'bg-indigo-50 dark:bg-indigo-950/30'
          : 'bg-gray-100 dark:bg-gray-800'
      }`}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${column.color}`} />
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {column.name}
        </h3>
        <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {tasks.length}
        </span>
      </div>

      {/* Droppable area with task cards */}
      <div
        ref={setNodeRef}
        className="flex-1 space-y-2 min-h-[60px]"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>

      {/* Quick add */}
      <div className="mt-3">
        <QuickAddTask projectId={projectId} status={column.id} />
      </div>
    </div>
  );
}
