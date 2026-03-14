import { useRef, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useCreateTask } from '@/hooks/useCreateTask';
import type { Task } from '@/hooks/useTasks';

interface QuickAddTaskProps {
  projectId: string;
  status: Task['status'];
}

export default function QuickAddTask({ projectId, status }: QuickAddTaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const createTask = useCreateTask();

  const handleOpen = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle('');
  };

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      handleCancel();
      return;
    }

    createTask.mutate(
      { projectId, data: { title: trimmed, status } },
      {
        onSuccess: () => {
          setTitle('');
          inputRef.current?.focus();
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 p-2.5 text-sm text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400 flex items-center justify-center gap-1.5"
      >
        <Plus className="h-4 w-4" />
        Thêm task
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleCancel}
        placeholder="Nhập tên task..."
        disabled={createTask.isPending}
        className="w-full rounded border-0 bg-transparent px-1 py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500"
      />
      {createTask.isPending && (
        <div className="flex justify-center py-1">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
        </div>
      )}
    </div>
  );
}
