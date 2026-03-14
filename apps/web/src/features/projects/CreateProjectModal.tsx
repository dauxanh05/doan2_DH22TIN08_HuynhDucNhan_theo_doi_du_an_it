import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import ColorPresetPicker from '@/components/ColorPresetPicker';
import ProjectIconPicker from '@/components/ProjectIconPicker';
import { useCreateProject } from '@/hooks/useCreateProject';

const createProjectSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự').max(80, 'Tên tối đa 80 ký tự'),
  description: z.string().max(500, 'Mô tả tối đa 500 ký tự').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ'),
  icon: z.string().nullable().optional(),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

interface CreateProjectModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({
  workspaceId,
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const createProject = useCreateProject();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#6366f1',
      icon: null,
    },
  });

  const currentColor = watch('color');

  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedIcon(null);
    }
  }, [isOpen, reset]);

  const handleIconChange = (icon: string | null) => {
    setSelectedIcon(icon);
    setValue('icon', icon);
  };

  const onSubmit = (data: CreateProjectForm) => {
    createProject.mutate(
      {
        workspaceId,
        data: {
          name: data.name,
          description: data.description?.trim() || undefined,
          color: data.color,
          icon: data.icon ?? undefined,
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

      <div className="relative max-h-[90vh] w-full max-w-lg mx-4 overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tạo dự án mới</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Icon picker */}
          <div>
            <ProjectIconPicker
              currentIcon={selectedIcon}
              currentImage={null}
              onIconChange={handleIconChange}
            />
          </div>

          <div>
            <label htmlFor="project-name" className="label">
              Tên dự án
            </label>
            <input
              id="project-name"
              type="text"
              {...register('name')}
              className="input"
              placeholder="Website khách hàng"
              autoFocus
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="project-description" className="label">
              Mô tả
            </label>
            <textarea
              id="project-description"
              {...register('description')}
              className="input min-h-24 resize-none"
              placeholder="Mô tả ngắn về mục tiêu dự án"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Color preset picker */}
          <div>
            <label className="label">Màu đại diện</label>
            <ColorPresetPicker
              value={currentColor}
              onChange={(color) => setValue('color', color)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button type="submit" disabled={createProject.isPending} className="btn-primary">
              {createProject.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo dự án'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
