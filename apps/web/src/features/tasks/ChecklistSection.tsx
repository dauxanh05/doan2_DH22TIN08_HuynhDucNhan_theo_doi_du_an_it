import { useMemo, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useChecklists } from '@/hooks/useChecklists';
import { useCreateChecklistItem } from '@/hooks/useCreateChecklistItem';
import { useDeleteChecklistItem } from '@/hooks/useDeleteChecklistItem';
import { useUpdateChecklistItem } from '@/hooks/useUpdateChecklistItem';

interface ChecklistSectionProps {
  projectId: string;
  taskId: string;
  fallbackItems: Array<{
    id: string;
    taskId: string;
    title: string;
    completed: boolean;
    position: number;
  }>;
}

export default function ChecklistSection({
  projectId,
  taskId,
  fallbackItems,
}: ChecklistSectionProps) {
  const { data } = useChecklists(taskId);
  const createChecklistItem = useCreateChecklistItem();
  const updateChecklistItem = useUpdateChecklistItem();
  const deleteChecklistItem = useDeleteChecklistItem();
  const [title, setTitle] = useState('');

  const items = useMemo(() => data ?? fallbackItems, [data, fallbackItems]);

  const handleCreate = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    createChecklistItem.mutate(
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
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Checklist</h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có checklist item nào.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(event) =>
                  updateChecklistItem.mutate({
                    projectId,
                    taskId,
                    checklistId: item.id,
                    data: { completed: event.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{item.title}</span>
              <button
                type="button"
                onClick={() =>
                  deleteChecklistItem.mutate({
                    projectId,
                    taskId,
                    checklistId: item.id,
                  })
                }
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
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
          placeholder="Thêm checklist item"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={createChecklistItem.isPending}
          className="btn-primary whitespace-nowrap"
        >
          {createChecklistItem.isPending ? (
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
