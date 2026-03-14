import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import TaskDetailModal from '@/features/tasks/TaskDetailModal';

export default function KanbanPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const openTaskModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskId(null);
  };

  if (!projectId) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy dự án.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-4">
        <Link
          to={`/projects/${projectId}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại dự án
        </Link>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Kéo thả để di chuyển tasks giữa các cột
        </p>
      </div>

      {/* Kanban board */}
      <div className="flex-1 min-h-0">
        <KanbanBoard projectId={projectId} onTaskClick={openTaskModal} />
      </div>

      {/* Task detail modal */}
      <TaskDetailModal
        projectId={projectId}
        taskId={selectedTaskId}
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
      />
    </div>
  );
}
