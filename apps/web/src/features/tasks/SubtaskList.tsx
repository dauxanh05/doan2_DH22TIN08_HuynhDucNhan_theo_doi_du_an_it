import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useCreateSubtask } from '@/hooks/useCreateSubtask';
import { useUpdateTask } from '@/hooks/useUpdateTask';
import type { TaskDetail } from '@/hooks/useTask';

interface SubtaskListProps {
  projectId: string;
  taskId: string;
  subtasks: TaskDetail[];
}

export default function SubtaskList({ projectId, taskId, subtasks }: SubtaskListProps) {
  const createSubtask = useCreateSubtask();
  const updateTask = useUpdateTask();
  const [title, setTitle] = useState('');

  const handleCreate = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    createSubtask.mutate(
      {
        projectId,
        taskId,
        data: { title: trimmedTitle },
      },
      {
        onSuccess: () => {
          setTitle('');
        },
      },
    );
  };

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Subtasks</h3>

      {subtasks.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có subtask nào.</p>
      ) : (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <label
              key={subtask.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={subtask.status === 'DONE'}
                onChange={(event) =>
                  updateTask.mutate({
                    projectId,
                    taskId: subtask.id,
                    data: {
                      status: event.target.checked ? 'DONE' : 'TODO',
                    },
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{subtask.title}</span>
            </label>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleCreate();
            }
          }}
          className="input"
          placeholder="Thêm subtask mới"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={createSubtask.isPending}
          className="btn-primary whitespace-nowrap"
        >
          {createSubtask.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Thêm
            </>
          )}
        </button>
      </div>
    </section>
  );
}
