import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import { useCreateTask } from '@/hooks/useCreateTask';

const createTaskSchema = z.object({
  title: z.string().min(2, 'Tiêu đề tối thiểu 2 ký tự').max(200, 'Tiêu đề tối đa 200 ký tự'),
  description: z.string().max(2000, 'Mô tả tối đa 2000 ký tự').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  priority: z.enum(['URGENT', 'HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  dueDate: z.string().optional(),
});

type CreateTaskForm = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ projectId, isOpen, onClose }: CreateTaskModalProps) {
  const createTask = useCreateTask();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: CreateTaskForm) => {
    createTask.mutate(
      {
        projectId,
        data: {
          title: data.title,
          description: data.description?.trim() || undefined,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate || undefined,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-4 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tạo task mới</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="task-title" className="label">
              Tiêu đề
            </label>
            <input
              id="task-title"
              type="text"
              {...register('title')}
              className="input"
              placeholder="Tên công việc"
              autoFocus
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="label">
                Trạng thái
              </label>
              <select id="task-status" {...register('status')} className="input">
                <option value="TODO">Cần làm</option>
                <option value="IN_PROGRESS">Đang làm</option>
                <option value="DONE">Hoàn thành</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className="label">
                Ưu tiên
              </label>
              <select id="task-priority" {...register('priority')} className="input">
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
                <option value="URGENT">Khẩn cấp</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="task-dueDate" className="label">
              Hạn hoàn thành
            </label>
            <input id="task-dueDate" type="date" {...register('dueDate')} className="input" />
          </div>

          <div>
            <label htmlFor="task-description" className="label">
              Mô tả
            </label>
            <textarea
              id="task-description"
              {...register('description')}
              className="input min-h-24 resize-none"
              placeholder="Mô tả chi tiết công việc (tùy chọn)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button type="submit" disabled={createTask.isPending} className="btn-primary">
              {createTask.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
