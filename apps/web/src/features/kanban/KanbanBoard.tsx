import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { useTasks } from '@/hooks/useTasks';
import { useUpdateTask } from '@/hooks/useUpdateTask';
import { useReorderTasks } from '@/hooks/useReorderTasks';
import KanbanColumn from './KanbanColumn';
import type { ColumnConfig } from './KanbanColumn';
import KanbanFilterBar from './KanbanFilterBar';
import type { KanbanFilters } from './KanbanFilterBar';
import TaskCard from './TaskCard';
import type { Task } from '@/hooks/useTasks';

const columns: ColumnConfig[] = [
  { id: 'TODO', name: 'Cần làm', color: 'bg-gray-400' },
  { id: 'IN_PROGRESS', name: 'Đang làm', color: 'bg-blue-500' },
  { id: 'DONE', name: 'Hoàn thành', color: 'bg-green-500' },
];

interface KanbanBoardProps {
  projectId: string;
  onTaskClick: (taskId: string) => void;
}

export default function KanbanBoard({ projectId, onTaskClick }: KanbanBoardProps) {
  const { data: allTasks = [], isLoading } = useTasks(projectId);
  const updateTask = useUpdateTask();
  const reorderTasks = useReorderTasks();
  const queryClient = useQueryClient();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<KanbanFilters>({
    assignees: [],
    priorities: [],
    search: '',
  });

  // Sensors for drag
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  // Filter tasks (AND logic, client-side)
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      // Only show parent tasks (not subtasks)
      if (task.parentId) return false;

      // Assignee filter
      if (filters.assignees.length > 0) {
        const taskAssigneeIds = (task.assignees ?? []).map((a) => a.userId);
        const hasMatch = filters.assignees.some((id) => taskAssigneeIds.includes(id));
        if (!hasMatch) return false;
      }

      // Priority filter
      if (filters.priorities.length > 0) {
        if (!filters.priorities.includes(task.priority)) return false;
      }

      // Search filter
      if (filters.search) {
        if (!task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      }

      return true;
    });
  }, [allTasks, filters]);

  // Group by status, sort by position
  const tasksByStatus = useMemo(() => {
    const grouped: Record<Task['status'], Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };
    for (const task of filteredTasks) {
      grouped[task.status].push(task);
    }
    // Sort by position asc
    for (const status of Object.keys(grouped) as Task['status'][]) {
      grouped[status].sort((a, b) => a.position - b.position);
    }
    return grouped;
  }, [filteredTasks]);

  // --- Drag handlers ---

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = allTasks.find((t) => t.id === event.active.id);
      if (task) setActiveTask(task);
    },
    [allTasks],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Find which column the active task is in and which it's over
      const activeTask = allTasks.find((t) => t.id === activeId);
      if (!activeTask) return;

      // Determine the target status
      let targetStatus: Task['status'] | undefined;

      // If over a column directly
      if (['TODO', 'IN_PROGRESS', 'DONE'].includes(overId)) {
        targetStatus = overId as Task['status'];
      } else {
        // Over another task — find that task's status
        const overTask = allTasks.find((t) => t.id === overId);
        if (overTask) {
          targetStatus = overTask.status;
        }
      }

      if (!targetStatus || activeTask.status === targetStatus) return;

      // Optimistically move task to new column in cache
      queryClient.setQueryData<Task[]>(['tasks', projectId], (old) => {
        if (!old) return old;
        return old.map((t) => (t.id === activeId ? { ...t, status: targetStatus } : t));
      });
    },
    [allTasks, projectId, queryClient],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Get current state from cache
      const currentTasks = queryClient.getQueryData<Task[]>(['tasks', projectId]) ?? [];
      const draggedTask = currentTasks.find((t) => t.id === activeId);
      if (!draggedTask) return;

      const currentStatus = draggedTask.status;

      // Determine target status
      let targetStatus: Task['status'] = currentStatus;
      if (['TODO', 'IN_PROGRESS', 'DONE'].includes(overId)) {
        targetStatus = overId as Task['status'];
      } else {
        const overTask = currentTasks.find((t) => t.id === overId);
        if (overTask) targetStatus = overTask.status;
      }

      // Get original task from allTasks (before any cache changes)
      const originalTask = allTasks.find((t) => t.id === activeId);
      const originalStatus = originalTask?.status;

      // Cross-column: update status via API
      if (originalStatus && targetStatus !== originalStatus) {
        updateTask.mutate({
          projectId,
          taskId: activeId,
          silent: true,
          data: { status: targetStatus },
        });
      }

      // Same-column reorder (or reorder within new column after cross-column)
      const columnTasks = currentTasks
        .filter((t) => t.status === targetStatus && !t.parentId)
        .sort((a, b) => a.position - b.position);

      const activeIdx = columnTasks.findIndex((t) => t.id === activeId);
      let overIdx = columnTasks.findIndex((t) => t.id === overId);

      // If overId is a column, place at end
      if (['TODO', 'IN_PROGRESS', 'DONE'].includes(overId)) {
        overIdx = columnTasks.length - 1;
      }

      if (activeIdx !== -1 && overIdx !== -1 && activeIdx !== overIdx) {
        const reordered = arrayMove(columnTasks, activeIdx, overIdx);
        const reorderItems = reordered.map((t, i) => ({ id: t.id, position: i }));

        // Update cache positions
        const positionMap = new Map(reorderItems.map((item) => [item.id, item.position]));
        queryClient.setQueryData<Task[]>(['tasks', projectId], (old) => {
          if (!old) return old;
          return old.map((t) => {
            const newPos = positionMap.get(t.id);
            return newPos !== undefined ? { ...t, position: newPos } : t;
          });
        });

        reorderTasks.mutate({ projectId, tasks: reorderItems });
      }
    },
    [allTasks, projectId, queryClient, updateTask, reorderTasks],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Filter bar */}
      <KanbanFilterBar
        tasks={allTasks}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Kanban columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id]}
              projectId={projectId}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>

        {/* Drag overlay — ghost card */}
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <TaskCard task={activeTask} onClick={() => {}} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
