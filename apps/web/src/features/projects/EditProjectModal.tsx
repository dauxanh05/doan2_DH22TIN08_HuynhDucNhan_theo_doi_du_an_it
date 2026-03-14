import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import ColorPresetPicker from '@/components/ColorPresetPicker';
import ProjectIconPicker from '@/components/ProjectIconPicker';
import { useUpdateProject } from '@/hooks/useUpdateProject';
import type { Project } from '@/hooks/useProjects';

const editProjectSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự').max(80, 'Tên tối đa 80 ký tự'),
  description: z.string().max(500, 'Mô tả tối đa 500 ký tự').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ'),
  icon: z.string().nullable().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']),
});

type EditProjectForm = z.infer<typeof editProjectSchema>;

interface EditProjectModalProps {
  project: Project;
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProjectModal({
  project,
  workspaceId,
  isOpen,
  onClose,
}: EditProjectModalProps) {
  const updateProject = useUpdateProject();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(project.icon);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditProjectForm>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? '',
      color: project.color,
      icon: project.icon,
      status: project.status,
    },
  });

  const currentColor = watch('color');

  useEffect(() => {
    if (isOpen) {
      reset({
        name: project.name,
        description: project.description ?? '',
        color: project.color,
        icon: project.icon,
        status: project.status,
      });
      setSelectedIcon(project.icon);
    }
  }, [isOpen, project, reset]);

  const handleIconChange = (icon: string | null) => {
    setSelectedIcon(icon);
    setValue('icon', icon);
  };

  const onSubmit = (data: EditProjectForm) => {
    updateProject.mutate(
      {
        projectId: project.id,
        workspaceId,
        data: {
          name: data.name,
          description: data.description?.trim() || null,
          color: data.color,
          icon: data.icon ?? null,
          status: data.status,
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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chỉnh sửa dự án</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Icon picker with upload (projectId available) */}
          <div>
            <ProjectIconPicker
              projectId={project.id}
              workspaceId={workspaceId}
              currentIcon={selectedIcon}
              currentImage={project.image}
              onIconChange={handleIconChange}
            />
          </div>

          <div>
            <label htmlFor="edit-project-name" className="label">
              Tên dự án
            </label>
            <input
              id="edit-project-name"
              type="text"
              {...register('name')}
              className="input"
              autoFocus
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="edit-project-description" className="label">
              Mô tả
            </label>
            <textarea
              id="edit-project-description"
              {...register('description')}
              className="input min-h-24 resize-none"
              placeholder="Mô tả ngắn về mục tiêu dự án"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Color preset picker */}
            <div>
              <label className="label">Màu đại diện</label>
              <ColorPresetPicker
                value={currentColor}
                onChange={(color) => setValue('color', color)}
              />
            </div>

            <div>
              <label htmlFor="edit-project-status" className="label">
                Trạng thái
              </label>
              <select id="edit-project-status" {...register('status')} className="input">
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="ARCHIVED">Lưu trữ</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button type="submit" disabled={updateProject.isPending} className="btn-primary">
              {updateProject.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
