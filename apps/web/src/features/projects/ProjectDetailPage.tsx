import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  FolderKanban,
  Kanban,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import CreateTaskModal from '@/features/tasks/CreateTaskModal';
import EditProjectModal from '@/features/projects/EditProjectModal';
import ProjectTaskModal from '@/features/tasks/TaskDetailModal';
import { useDeleteProject } from '@/hooks/useDeleteProject';
import { useProject } from '@/hooks/useProject';
import { useProjectStats } from '@/hooks/useProjectStats';
import { useTasks } from '@/hooks/useTasks';
import { resolveApiAssetUrl } from '@/services/api';
import { useWorkspaceStore } from '@/stores/workspace.store';

const taskStatusLabels: Record<string, string> = {
  TODO: 'Cần làm',
  IN_PROGRESS: 'Đang làm',
  DONE: 'Hoàn thành',
};

const priorityLabels: Record<string, string> = {
  URGENT: 'Khẩn cấp',
  HIGH: 'Cao',
  MEDIUM: 'Trung bình',
  LOW: 'Thấp',
};

const projectStatusLabels: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  COMPLETED: 'Hoàn thành',
  ARCHIVED: 'Lưu trữ',
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = useProject(id);
  const { data: stats } = useProjectStats(id);
  const { data: tasks } = useTasks(id);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace);
  const deleteProject = useDeleteProject();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);

  const openTaskModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskId(null);
  };

  useEffect(() => {
    if (!project) return;

    const matchedWorkspace = workspaces.find((workspace) => workspace.id === project.workspaceId);
    if (matchedWorkspace && currentWorkspace?.id !== matchedWorkspace.id) {
      setCurrentWorkspace(matchedWorkspace);
    }
  }, [currentWorkspace?.id, project, setCurrentWorkspace, workspaces]);

  const handleDeleteProject = () => {
    if (!project) return;

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa dự án "${project.name}"? Tất cả task sẽ bị xóa theo.`,
    );
    if (!confirmed) return;

    const workspaceId = project.workspaceId;
    deleteProject.mutate(
      { projectId: project.id, workspaceId },
      {
        onSuccess: () => {
          navigate(`/workspaces/${workspaceId}/projects`, { replace: true });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Không tìm thấy dự án
        </h3>
        <p className="text-gray-500 dark:text-gray-400">Dự án không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  const backHref = currentWorkspace
    ? `/workspaces/${currentWorkspace.id}/projects`
    : '/workspaces';

  const statCards = [
    { label: 'Tổng task', value: stats?.totalTasks ?? tasks?.length ?? 0 },
    { label: 'Cần làm', value: stats?.todoTasks ?? 0 },
    { label: 'Đang làm', value: stats?.inProgressTasks ?? 0 },
    { label: 'Hoàn thành', value: stats?.doneTasks ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to={backHref} className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Dự án
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{project.name}</span>
      </nav>

      {/* Project header card */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          {project.image ? (
            <img
              src={resolveApiAssetUrl(project.image) ?? project.image}
              alt={project.name}
              className="h-14 w-14 rounded-xl border border-gray-200 object-cover flex-shrink-0 dark:border-gray-700"
            />
          ) : project.icon ? (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-3xl flex-shrink-0 dark:border-gray-700 dark:bg-gray-900">
              {project.icon}
            </div>
          ) : (
            <div
              className="h-14 w-14 rounded-xl flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
              <span className="inline-flex px-2.5 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                {projectStatusLabels[project.status] || project.status}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {project.description || 'Chưa có mô tả cho dự án này.'}
            </p>
          </div>

          {/* Project actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to={`/projects/${project.id}/kanban`}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Kanban className="h-4 w-4" />
              Kanban
            </Link>
            <button
              type="button"
              onClick={() => setShowEditProject(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4" />
              Sửa
            </button>
            <button
              type="button"
              onClick={handleDeleteProject}
              disabled={deleteProject.isPending}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              {deleteProject.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Xóa
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((item) => (
          <div key={item.label} className="card p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Task list */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Danh sách task</h2>
          <button onClick={() => setShowCreateTask(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Tạo task
          </button>
        </div>

        {!tasks || tasks.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <FolderKanban className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
              Chưa có task nào
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Bắt đầu bằng cách tạo task đầu tiên cho dự án này.
            </p>
            <button onClick={() => setShowCreateTask(true)} className="btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Tạo task đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <button
                type="button"
                key={task.id}
                onClick={() => openTaskModal(task.id)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-left transition-colors hover:border-indigo-400 dark:hover:border-indigo-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {task.description || 'Chưa có mô tả'}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="block text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {taskStatusLabels[task.status] || task.status}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      Ưu tiên: {priorityLabels[task.priority] || task.priority}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {id && (
        <>
          <ProjectTaskModal
            projectId={id}
            taskId={selectedTaskId}
            isOpen={isTaskModalOpen}
            onClose={closeTaskModal}
          />
          <CreateTaskModal
            projectId={id}
            isOpen={showCreateTask}
            onClose={() => setShowCreateTask(false)}
          />
        </>
      )}

      {project && (
        <EditProjectModal
          project={project}
          workspaceId={project.workspaceId}
          isOpen={showEditProject}
          onClose={() => setShowEditProject(false)}
        />
      )}
    </div>
  );
}
