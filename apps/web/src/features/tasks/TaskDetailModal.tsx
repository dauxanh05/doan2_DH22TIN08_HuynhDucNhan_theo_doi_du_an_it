import { useEffect, useMemo, useState } from 'react';
import { Calendar, Loader2, Trash2, UserPlus, X } from 'lucide-react';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import { useAssignTaskAssignee } from '@/hooks/useAssignTaskAssignee';
import { useDeleteTask } from '@/hooks/useDeleteTask';
import { useTask } from '@/hooks/useTask';
import { useUnassignTaskAssignee } from '@/hooks/useUnassignTaskAssignee';
import { useUpdateTask } from '@/hooks/useUpdateTask';
import { useWorkspaceStore } from '@/stores/workspace.store';
import AttachmentSection from '@/features/tasks/AttachmentSection';
import ChecklistSection from '@/features/tasks/ChecklistSection';
import SubtaskList from '@/features/tasks/SubtaskList';

const statusOptions = [
  { value: 'TODO', label: 'Cần làm' },
  { value: 'IN_PROGRESS', label: 'Đang làm' },
  { value: 'DONE', label: 'Hoàn thành' },
] as const;

const priorityOptions = [
  { value: 'URGENT', label: 'Khẩn cấp' },
  { value: 'HIGH', label: 'Cao' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'LOW', label: 'Thấp' },
] as const;

interface TaskDetailModalProps {
  projectId: string;
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailModal({
  projectId,
  taskId,
  isOpen,
  onClose,
}: TaskDetailModalProps) {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const { data: task, isLoading, isError } = useTask(taskId ?? undefined);
  const { data: workspaceMembers } = useWorkspaceMembers(currentWorkspace?.id);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const assignTaskAssignee = useAssignTaskAssignee();
  const unassignTaskAssignee = useUnassignTaskAssignee();

  const [titleDraft, setTitleDraft] = useState('');
  const [descriptionDraft, setDescriptionDraft] = useState('');

  useEffect(() => {
    if (!task) return;
    setTitleDraft(task.title);
    setDescriptionDraft(task.description ?? '');
  }, [task]);

  const availableMembers = useMemo(() => {
    const assignedIds = new Set(task?.assignees.map((assignee) => assignee.userId) ?? []);
    return (workspaceMembers ?? []).filter((member) => !assignedIds.has(member.userId));
  }, [task?.assignees, workspaceMembers]);

  if (!isOpen || !taskId) {
    return null;
  }

  const handleDelete = () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa task này?');
    if (!confirmed || !taskId) return;

    deleteTask.mutate(
      {
        projectId,
        taskId,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleBlurTitle = () => {
    if (!task) return;
    const trimmedTitle = titleDraft.trim();
    if (!trimmedTitle || trimmedTitle === task.title) {
      setTitleDraft(task.title);
      return;
    }

    updateTask.mutate({
      projectId,
      taskId: task.id,
      data: { title: trimmedTitle },
    });
  };

  const handleBlurDescription = () => {
    if (!task) return;
    const normalizedValue = descriptionDraft.trim();
    const currentValue = task.description ?? '';

    if (normalizedValue === currentValue) {
      setDescriptionDraft(currentValue);
      return;
    }

    updateTask.mutate({
      projectId,
      taskId: task.id,
      data: { description: normalizedValue || null },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chi tiết task</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : isError || !task ? (
          <div className="px-6 py-10 text-center text-sm text-red-500">
            Không thể tải chi tiết task.
          </div>
        ) : (
          <div className="space-y-6 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <input
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                onBlur={handleBlurTitle}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xl font-semibold text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-indigo-800"
              />
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteTask.isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                {deleteTask.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Xóa
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="label">Trạng thái</label>
                <select
                  value={task.status}
                  onChange={(event) =>
                    updateTask.mutate({
                      projectId,
                      taskId: task.id,
                      data: { status: event.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE' },
                    })
                  }
                  className="input"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Ưu tiên</label>
                <select
                  value={task.priority}
                  onChange={(event) =>
                    updateTask.mutate({
                      projectId,
                      taskId: task.id,
                      data: {
                        priority: event.target.value as 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW',
                      },
                    })
                  }
                  className="input"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Due date</label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={task.dueDate ? task.dueDate.slice(0, 10) : ''}
                    onChange={(event) =>
                      updateTask.mutate({
                        projectId,
                        taskId: task.id,
                        data: { dueDate: event.target.value || null },
                      })
                    }
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="label">Assignees</label>
                <select
                  defaultValue=""
                  onChange={(event) => {
                    const userId = event.target.value;
                    if (!userId) return;

                    assignTaskAssignee.mutate({
                      projectId,
                      taskId: task.id,
                      userId,
                    });
                    event.target.value = '';
                  }}
                  className="input"
                >
                  <option value="">+ Thêm người phụ trách</option>
                  {availableMembers.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.user.name} - {member.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="label">Người phụ trách hiện tại</label>
              {task.assignees.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có người phụ trách.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {task.assignees.map((assignee) => (
                    <button
                      key={assignee.userId}
                      type="button"
                      onClick={() =>
                        unassignTaskAssignee.mutate({
                          projectId,
                          taskId: task.id,
                          userId: assignee.userId,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 transition-colors hover:border-red-300 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-800 dark:hover:text-red-400"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      {assignee.user.name}
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="label">Mô tả</label>
              <textarea
                value={descriptionDraft}
                onChange={(event) => setDescriptionDraft(event.target.value)}
                onBlur={handleBlurDescription}
                className="input min-h-32 resize-y"
                placeholder="Mô tả chi tiết công việc"
              />
            </div>

            <SubtaskList projectId={projectId} taskId={task.id} subtasks={task.subtasks} />

            <ChecklistSection
              projectId={projectId}
              taskId={task.id}
              fallbackItems={task.checklists}
            />

            <AttachmentSection
              projectId={projectId}
              taskId={task.id}
              attachments={task.attachments}
            />
          </div>
        )}
      </div>
    </div>
  );
}
