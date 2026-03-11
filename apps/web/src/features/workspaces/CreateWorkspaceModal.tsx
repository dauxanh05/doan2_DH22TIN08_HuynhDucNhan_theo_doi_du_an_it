import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import { useCreateWorkspace } from '@/hooks/useCreateWorkspace';
import { useWorkspaceStore } from '@/stores/workspace.store';

// Validation schema
const createSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự').max(50, 'Tên tối đa 50 ký tự'),
  slug: z
    .string()
    .min(2, 'Slug tối thiểu 2 ký tự')
    .max(50, 'Slug tối đa 50 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Chỉ cho phép chữ thường, số và dấu gạch ngang'),
});

type CreateWorkspaceForm = z.infer<typeof createSchema>;

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const createWorkspace = useCreateWorkspace();
  const setCurrentWorkspace = useWorkspaceStore((s) => s.setCurrentWorkspace);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  // Auto-generate slug from name
  const watchName = watch('name');
  useEffect(() => {
    if (watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setValue('slug', slug, { shouldValidate: true });
    }
  }, [watchName, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Submit handler
  const onSubmit = (data: CreateWorkspaceForm) => {
    createWorkspace.mutate(
      {
        name: data.name,
        slug: data.slug,
      },
      {
        onSuccess: (newWorkspace) => {
          setCurrentWorkspace({ ...newWorkspace, role: 'OWNER' });
          onClose();
          navigate(`/workspaces/${newWorkspace.id}/settings`);
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tạo workspace mới</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="create-name" className="label">
              Tên workspace
            </label>
            <input
              id="create-name"
              type="text"
              {...register('name')}
              className="input"
              placeholder="My Workspace"
              autoFocus
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="create-slug" className="label">
              Slug
            </label>
            <input
              id="create-slug"
              type="text"
              {...register('slug')}
              className="input"
              placeholder="my-workspace"
            />
            {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Tự động tạo từ tên. Có thể chỉnh sửa.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createWorkspace.isPending}
              className="btn-primary"
            >
              {createWorkspace.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo workspace'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
